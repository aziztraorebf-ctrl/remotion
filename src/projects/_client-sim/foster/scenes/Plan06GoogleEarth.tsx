// MOTEUR: carte Mapbox satellite — plongee orbitale frame-driven
/**
 * FOSTER — PLAN 6 (17,40 -> 18,45 s) : LE GLOBE, PUIS LA PLONGEE
 * ==============================================================
 * Reference : public/_client-sim/_references/foster/foster-with-confidence.mp4
 *
 * Premier plan CARTOGRAPHIQUE de la reproduction. Registre entierement different
 * de tout ce qui precede — et notre terrain fort (Mapbox frame-driven).
 *
 * ⛔ LE TABLEAU DE DECOUPAGE ANNONCAIT « 18,03 -> 18,41 · vue satellite du
 * Nebraska ». Deux corrections mesurees :
 *   1. le plan commence a 17,40 s (pas 18,03) — le globe apparait en fondu
 *      croise PENDANT la fin du plan 5, qui le porte deja ;
 *   2. il ne commence pas sur une carte plate mais sur un GLOBE ENTIER vu de
 *      l'espace (halo atmospherique, fond etoile), avec les labels pays.
 *
 * ── LES MESURES (toutes prises sur les frames, cf. protocole) ───────────────
 *
 * LE ZOOM — deux methodes independantes et convergentes :
 *   a) optique (recalage d'echelle frame a frame) : facteur x1,125 par frame,
 *      CONSTANT sur toute la plongee ;
 *   b) geographique (villes identifiees sur les frames) : z 3,08 -> 7,94,
 *      soit 4,86 niveaux en 0,90 s.
 *
 * ⭐⭐ LE ZOOM EST LINEAIRE EN NIVEAUX MAPBOX, PAS ACCELERE.
 * Gemini a rapporte une « acceleration exponentielle » : c'est un contresens.
 * Un facteur d'echelle CONSTANT par frame (x1,125) EST une exponentielle en
 * taille apparente — donc l'oeil lit « ca accelere » — mais en NIVEAUX de zoom
 * (echelle log2) la progression est parfaitement REGULIERE. Coder un easing
 * accelere ici serait doubler l'exponentielle et rater le geste.
 * (Meme famille que le piege n°5 du plan 4 : une impression de vitesse n'est
 * pas une mesure de vitesse.)
 *
 * LA CIBLE : Nebraska central, le long de l'I-80. Reperes lus sur la frame
 * 18,30 s : Lexington · Johnson Lake · Elwood · Cozad · Gothenburg.
 * Depart : Amerique du Nord centree, Honolulu visible a gauche ET la Norvege
 * a droite (~160 deg de longitude dans le cadre).
 *
 * LE FLOU RADIAL (raccord vers le plan 7, la maison filmee) :
 * nettete mesuree (variance du laplacien) 6,1 -> 1,1 et luminance 111 -> 46,
 * sur les ~0,33 s finales. Les deux montent ENSEMBLE. A 18,45 s l'image est
 * quasi illisible : il ne reste qu'une petite maison blanche au centre exact.
 * ⭐ Consequence : la fin du plan n'a pas besoin d'etre fidele geographiquement,
 * elle est noyee. L'effort porte sur le DEBUT (le globe) et la REGULARITE.
 *
 * ⛔⛔ PIEGE DE LA SOURCE — NE PAS REPRODUIRE : la reference contient des frames
 * entierement NOIRES a 18,033 et 18,100 s. Ce n'est PAS un flash de montage :
 * sur ces frames les seuls pixels non-noirs sont en y 9-44 / x 1790-1907, soit
 * le watermark fiverr composite par-dessus. Ce sont des frames PERDUES par la
 * capture d'ecran (la source est en VFR, r_frame_rate=90000/1 aberrant).
 * Regle : une frame noire dont seul l'overlay survit est un artefact de capture.
 */

import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  continueRender,
  delayRender,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import mapboxgl from "mapbox-gl";
import { MapboxBrandingHide } from "../../../_shared/mapbox/MapboxBase";

const PLAN_START = 17.4;

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

/**
 * satellite-streets-v12, et NON satellite-v9 (le defaut du repo pour le
 * satellite, cf. MAPBOX_STYLES.satellite dans _shared/mapbox/MapboxBase.tsx).
 * ⭐ Choix dicte par la MESURE, pas par la convention : la reference affiche
 * les labels tout du long — « Canada », « NEBRASKA », Lexington, Cozad, et les
 * boucliers I-80/I-70 — et ils font une bonne part de la lecture « Google
 * Earth ». satellite-v9 est nu : la plongee y devient une texture abstraite.
 * Le repo reserve deja satellite-streets au « zoom sol » (MapboxCameraLab S9,
 * PetrolePatience A3), ce qui est exactement notre cas en fin de plan.
 */
const STYLE_URL = "mapbox://styles/mapbox/satellite-streets-v12";

/** Nebraska central, zone Johnson Lake / Elwood, le long de l'I-80. */
const TARGET = { lon: -99.75, lat: 40.72 } as const;

/**
 * Le depart est centre plus a l'ouest et plus au nord que la cible : au niveau
 * du globe on voit l'Amerique du Nord entiere. Le recadrage vers la cible se
 * fait PENDANT la plongee (mesure : le point d'arrivee n'est pas au centre au
 * debut du plan — releve par les deux voix, confirme a l'oeil).
 */
/**
 * ⭐⭐ zoom de depart MESURE (3,635), pas dose. L'historique complet, parce que
 * la lecon vaut au-dela de ce plan :
 *   1. deduction geographique      -> 3,08  : globe a 72,7 % du cadre (cible 89,4)
 *   2. correction « mercator »      -> 3,38  : 81,8 %. Rate.
 *   3. loi ajustee sur 2 points     -> 3,606 : 99,9 %. Depasse — globe hors cadre.
 *   4. loi ajustee sur 3 points     -> 3,459 : bon ordre de grandeur
 *   5. mesure PAR REPERES lus a l'oeil -> 3,635 : la bonne. ✅
 * ⛔⛔ Les etapes 1-4 se fiaient a une metrique AUTOMATIQUE (largeur de la
 * corde de pixels non-noirs, puis bord par gradient). Les DEUX ont menti :
 * la 1re parce que le voile bleu a rendu le fond spatial non-noir, la 2nde
 * parce que le gradient s'accroche aux cotes et au terminateur jour/nuit
 * plutot qu'au limbe. Elles donnaient 99,9 % la ou l'oeil voit un globe plus
 * PETIT que la reference. C'est exactement l'avertissement du protocole :
 * « les detecteurs automatiques derapent des que le decor s'allume », et la
 * methode fiable est la GRILLE DE REPERES tracee sur la frame, lue a l'oeil.
 * Mesure finale sur 2 villes identifiables dans les 2 images (San Francisco,
 * New York) : distance ref 50,6 % du cadre vs v4 44,7 % -> facteur 0,885,
 * soit +0,176 niveau de zoom.
 * ⛔ Etape 2 : elle supposait le comportement MERCATOR (largeur ~ 2^z). Entre
 * z=3,08 et z=3,38 le rapport attendu etait 1,231, le rapport REEL 1,125 — en
 * projection GLOBE le diametre apparent ne suit pas 2^z.
 * ⛔ Etape 3 : deux points TROP RAPPROCHES (0,30 d'ecart) donnent une pente
 * fragile qui extrapole mal — l'erreur a double au lieu de se resorber.
 * ⭐ La lecon n'est donc pas « resoudre plutot que doser » (je l'avais fait des
 * l'etape 3) mais : **une loi ajustee ne vaut que dans l'intervalle de ses
 * points de mesure.** Il a fallu un 3e point, pris HORS de l'intervalle initial,
 * pour que l'ajustement (log2(w) = 0,8555 z + 3,5228) devienne fiable.
 * ⚠️ Le point a 99,9 % est SATURE (globe deborde => la corde vaut la largeur du
 * cadre) : la loi est juste entre 3,0 et 3,5, pas au-dela.
 */
const START = { lon: -104.5, lat: 44.0, zoom: 3.635 } as const;

/**
 * Multiplie par k les valeurs de SORTIE d'une expression de taille Mapbox.
 *
 * ⛔⛔ POURQUOI CETTE FONCTION EXISTE — le piege coute 1 render pour rien.
 * L'evidence est d'ecrire `["*", <expression existante>, k]`. Mapbox la REJETTE :
 * une expression `["zoom"]` ne peut vivre qu'au sommet d'un `step`/`interpolate`,
 * jamais imbriquee dans autre chose. Message du parseur :
 *   « "zoom" expression may only be used as input to a top-level "step" or
 *     "interpolate" expression. »
 * ⛔ Et le rejet est SILENCIEUX : `setLayoutProperty` fait un `return` nu apres
 * validation, et l'erreur part en `map.fire(ErrorEvent)` — elle n'est jamais
 * levee. Donc AUCUN try/catch ne l'attrape, aucun crash, aucun log : la valeur
 * n'est simplement jamais ecrite. C'est un echec 100 % invisible, du genre que
 * seule une MESURE sur le rendu revele (hauteur des lettres inchangee).
 *
 * La parade : ne pas envelopper l'expression, mais descendre dedans et
 * multiplier ses valeurs de sortie. On preserve ainsi la hierarchie
 * pays > Etats > villes que la reference montre clairement — ces expressions
 * imbriquent un `step` sur `symbolrank` (et un `match` sur `type` pour les
 * subdivisions), d'ou la recursion.
 */
const scaleTextSize = (e: unknown, k: number): unknown => {
  if (typeof e === "number") return e * k;
  if (!Array.isArray(e)) return e;
  const [op, ...rest] = e as [string, ...unknown[]];
  if (typeof op === "string" && op.startsWith("interpolate")) {
    const [interp, input, ...stops] = rest;
    const out: unknown[] = [op, interp, input];
    for (let i = 0; i < stops.length; i += 2) {
      out.push(stops[i], scaleTextSize(stops[i + 1], k));
    }
    return out;
  }
  if (op === "step") {
    const [input, def, ...stops] = rest;
    const out: unknown[] = [op, input, scaleTextSize(def, k)];
    for (let i = 0; i < stops.length; i += 2) {
      out.push(stops[i], scaleTextSize(stops[i + 1], k));
    }
    return out;
  }
  if (op === "match") {
    const [input, ...cases] = rest;
    const out: unknown[] = [op, input];
    for (let i = 0; i < cases.length - 1; i += 2) {
      out.push(cases[i], scaleTextSize(cases[i + 1], k));
    }
    out.push(scaleTextSize(cases[cases.length - 1], k));
    return out;
  }
  return e;
};
const END = { zoom: 7.94 } as const;

/** Bornes du flou radial final, en secondes depuis le debut du plan. */
const BLUR_FROM = 18.12 - PLAN_START;
const BLUR_TO = 18.45 - PLAN_START;

export const Plan06GoogleEarth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const handleRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  // ── Camera : zoom LINEAIRE en niveaux (cf. docstring) ──────────────────────
  const zoom = interpolate(t, [0, BLUR_TO], [START.zoom, END.zoom], {
    extrapolateRight: "clamp",
  });

  /**
   * Le recadrage vers la cible se termine AVANT la fin du zoom : une fois la
   * cible centree, la plongee reste dans l'axe. Sinon la carte « derive »
   * lateralement pendant tout le plan, ce que la reference ne fait pas.
   */
  const recentre = interpolate(t, [0, 0.55], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });
  const lon = interpolate(recentre, [0, 1], [START.lon, TARGET.lon]);
  const lat = interpolate(recentre, [0, 1], [START.lat, TARGET.lat]);

  // ── Init map ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const handle = delayRender("Plan06 Mapbox init", {
      timeoutInMilliseconds: 60000,
    });
    handleRef.current = handle;
    // Garde-fou : sans token on libere le render au lieu de le bloquer 60 s.
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      handleRef.current = null;
      return;
    }
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: [START.lon, START.lat],
      zoom: START.zoom,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      antialias: true,
      // ⛔ MESURE : `attributionControl:false` retire l'attribution TEXTE mais
      // PAS le logo Mapbox, et <MapboxBrandingHide /> ne suffisait pas non plus
      // (logo encore mesure a y 486-536 / x 4-191 sur le rendu v2). Le conteneur
      // du logo est donc supprime a la main apres l'init, ci-dessous.
      // ⛔ fadeDuration:0 obligatoire — sinon les labels et les tuiles arrivent
      // en fondu sur une duree reelle, et le rendu frame-driven scintille.
      fadeDuration: 0,
    });

    /**
     * ⭐ Sans cette ecoute, une propriete de style refusee par le validateur
     * echoue en TOTAL SILENCE (Mapbox `fire` un ErrorEvent au lieu de lever) :
     * pas de crash, pas de log, la valeur n'est juste jamais appliquee. C'est
     * ce qui a rendu invisible le premier essai d'agrandissement des labels.
     */
    map.on("error", (e) => {
      // eslint-disable-next-line no-console
      console.warn("[Plan06] mapbox:", (e as { error?: Error }).error?.message);
    });

    map.on("style.load", () => {
      try {
        (
          map as mapboxgl.Map & { setProjection?: (p: string) => void }
        ).setProjection?.("globe");
      } catch {
        /* projection globe indisponible : on reste en mercator */
      }
      /**
       * ⭐ LABELS AGRANDIS x1,25 — defaut repere a l'oeil par Aziz, puis MESURE.
       * Histoire de ce chiffre, parce qu'elle est instructive :
       *   - le releve GPT annoncait « hauteur de capitale ~2,2 % du cadre » ;
       *   - la MESURE sur la reference donne 0,46 % (et 0,37 % chez nous).
       * L'estimation du modele etait donc surestimee d'un facteur ~5. Elle
       * signalait un VRAI defaut (nos labels sont bien trop petits) avec un
       * FAUX chiffre. Applique tel quel, il aurait produit des labels enormes.
       * => facteur reel mesure : 0,46/0,37 = 1,25.
       * On MULTIPLIE les valeurs de sortie des expressions existantes au lieu
       * de les remplacer : Mapbox fait varier text-size avec le zoom et le rang
       * de la ville, et ecraser ces formules aplatirait la hierarchie
       * (pays > Etats > villes) que la reference montre clairement.
       * ⚠️ Le « comment » n'est pas trivial : cf. `scaleTextSize` ci-dessus —
       * envelopper l'expression est rejete EN SILENCE par Mapbox.
       */
      const LABEL_SCALE = 1.25;
      for (const id of [
        "country-label",
        "state-label",
        "settlement-major-label",
        "settlement-minor-label",
        "settlement-subdivision-label",
      ]) {
        try {
          if (!map.getLayer(id)) continue;
          const current = map.getLayoutProperty(id, "text-size");
          if (current === undefined) continue;
          map.setLayoutProperty(
            id,
            "text-size",
            scaleTextSize(current, LABEL_SCALE) as never,
          );
          /**
           * Halo : le style en pose DEJA un (largeur 1,0 a 1,25, noir OPAQUE).
           * ⛔ Ma 1re version demandait `rgba(0,0,0,0.55)` : passer d'un noir
           * opaque a 55 % d'alpha AFFAIBLISSAIT le halo au lieu de le renforcer
           * — d'ou « aucun halo n'apparait » alors que l'appel etait valide et
           * bien applique. On garde donc une couleur OPAQUE et on n'augmente
           * que la largeur.
           */
          map.setPaintProperty(id, "text-halo-width", 2);
        } catch {
          /* une couche absente du style ne doit pas casser le render */
        }
      }

      // Suppression effective du branding : on retire les noeuds du DOM plutot
      // que de compter sur une regle CSS (cf. commentaire dans les options).
      try {
        containerRef.current
          ?.querySelectorAll(
            ".mapboxgl-ctrl-logo, .mapboxgl-ctrl-attrib, .mapboxgl-ctrl-bottom-left, .mapboxgl-ctrl-bottom-right",
          )
          .forEach((n) => n.remove());
      } catch {
        /* le branding restera visible, sans casser le render */
      }
      map.once("idle", () => {
        setReady(true);
        continueRender(handle);
        handleRef.current = null;
      });
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ── Engine par frame ───────────────────────────────────────────────────────
  /**
   * ⭐ Une plongee de ~5 niveaux en 1 s traverse un nouveau palier de tuiles a
   * presque chaque frame. Sans attente explicite, le render headless capture
   * des tuiles basse resolution : la plongee devient une bouillie qui « pompe ».
   * ⛔ CORRECTION (wrap 2026-08-27) : j'avais ecrit « le repo ne synchronisait
   * qu'a l'init — cette attente est ajoutee ici ». C'est FAUX, et le
   * commentaire se contredisait lui-meme 20 lignes plus bas en creditant
   * « (Pattern WarMapEngine) ». Ce pattern existe DEJA a l'identique dans 6
   * fichiers (WarMapEngine, SahelWarMapEngine, MapAnimationShowcase,
   * LobitoWarmapScene, LobitoVersionA), memes constantes 300/1200 incluses.
   * ⚠️ La vraie dette est donc INVERSE : 6 copies non factorisees. Seule
   * celle-ci ajoute le cleanup `clearTimeout(guard)` que les autres n'ont pas.
   */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    map.jumpTo({ center: [lon, lat], zoom, pitch: 0, bearing: 0 });

    const handle = delayRender(`Plan06 tuiles f${frame}`, {
      timeoutInMilliseconds: 40000,
    });
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      continueRender(handle);
    };
    map.once("idle", finish);
    // ⛔ Filet indispensable : si la carte est DEJA idle au moment du jumpTo,
    // l'evenement ne se redeclenchera jamais et le render resterait bloque
    // jusqu'au timeout, frame apres frame. Delai court quand les tuiles sont
    // la, long quand il faut les telecharger. (Pattern WarMapEngine.)
    const guard = setTimeout(finish, map.areTilesLoaded() ? 300 : 1200);
    return () => {
      clearTimeout(guard);
      finish();
    };
  }, [frame, ready, lon, lat, zoom]);

  // ── Flou radial de sortie ──────────────────────────────────────────────────
  /**
   * Mesure : nettete 6,1 -> 1,1 ET luminance 111 -> 46, simultanement.
   * Un vrai flou radial (zoom blur) n'existe pas en CSS. On le compose :
   *   - un `blur` global qui monte, pour la perte de nettete ;
   *   - un `scale` qui s'emballe, pour l'etirement radial ;
   *   - un assombrissement, mesure lui aussi.
   * Le centre reste net plus longtemps que les bords grace au masque radial.
   */
  const blurAmount = interpolate(t, [BLUR_FROM, BLUR_TO], [0, 26], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const darken = interpolate(t, [BLUR_FROM, BLUR_TO], [0, 0.58], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const burst = interpolate(t, [BLUR_FROM, BLUR_TO], [1, 1.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${burst})`,
          transformOrigin: "50% 50%",
        }}
      >
        {/*
          Etalonnage MESURE sur la zone centrale du plan (moyenne RGB) :
            reference  R 114,2  G 110,6  B 97,4
            v1 brute   R 109,9  G 106,1  B 50,9
          ⭐ R et G sont deja justes (ecart < 5) — c'est le BLEU qui s'effondre,
          de moitie. Le defaut n'est donc PAS une luminosite a remonter mais une
          dominante trop chaude : les tuiles Mapbox sont plus jaunes/terreuses
          que l'imagerie Google Earth.
          ⛔ `hue-rotate(-8deg)` a ETE ESSAYE ET RETIRE : il fait tourner TOUTES
          les teintes, donc il a pousse le rouge de +7,5 tout en ne rattrapant
          que 12 des 46 points de bleu manquants (erreur moyenne 18,4 -> 14,4
          seulement). Un canal deficient ne se corrige pas par une rotation
          globale. On applique donc un voile bleu en `screen`, qui n'ajoute que
          du bleu sans deplacer R et G.
        */}
        <div
          ref={containerRef}
          style={{
            width,
            height,
            filter: `blur(${blurAmount}px) saturate(0.88)`,
          }}
        />
        {/*
          Le voile froid : `screen` n'ADDITIONNE que la ou il y a de la matiere,
          donc il remonte le bleu sans toucher au noir de l'espace ni deplacer
          R et G (contrairement a hue-rotate). Dose pour combler les ~34 points
          de bleu qui manquaient encore en v2.
        */}
        <AbsoluteFill
          style={{
            backgroundColor: "rgb(0, 10, 46)",
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
          aria-hidden
        />
        {/*
          Le flou de la reference est RADIAL : net au centre, etire vers les
          bords. Une seconde couche floutee, masquee en anneau, creuse le centre
          — le degrade evite la bordure nette qu'un masque binaire produirait.
        */}
        <AbsoluteFill
          style={{
            backdropFilter: `blur(${blurAmount * 0.9}px)`,
            WebkitMaskImage:
              "radial-gradient(circle at 50% 50%, transparent 8%, black 46%)",
            maskImage:
              "radial-gradient(circle at 50% 50%, transparent 8%, black 46%)",
            opacity: blurAmount > 0 ? 1 : 0,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{ backgroundColor: "#000", opacity: darken }}
        aria-hidden
      />
    </AbsoluteFill>
  );
};
