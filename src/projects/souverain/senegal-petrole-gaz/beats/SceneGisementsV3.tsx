/**
 * SceneGisementsV3 — la VRAIE scene gisements (Senegal Petrole & Gaz, V3-REFONTE).
 *
 * Ecrite DEPUIS LA VOIX (force alignment Whisper du segment 52->104s de narration-v3-VALIDEE.mp3),
 * pas depuis un decoupage d'effets herite. Workflow : doctrine -> intention -> forme -> briques V5.
 * Cf. memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md + CONTINUITE-SCENE-INTENTION-DABORD.md.
 *
 * UN SEUL MONDE qui se transforme (continuite §2) : la carte Mapbox V5 du Senegal offshore, drapeau SEN
 * drape des le debut (MapboxCountryFlagDecal, colorie la carte). On PLONGE de champ en champ, on enrichit.
 *
 * 3 ACTES (un par champ decouvert), cales sur la voix :
 *   ACTE 1 SANGOMAR  f0-500   "trois... Sangomar, petrole brut, Woodside, Petrosen 18%"
 *                             -> jeton oil + plaque deportee Woodside + overlay 18/82 (style Hera, entre/frappe/sort)
 *   ACTE 2 GTA       f500-1090 "GTA, gaz, frontiere Mauritanie, BP, cargaisons Europe/Asie, remplacer gaz russe"
 *                             -> jeton gas + dezoom + flux GTA->Europe/Asie qui s'allument + RUSSIE grisee/coupee
 *   ACTE 3 YAKAAR    f1090-1560 "Yakaar-Teranga, personne n'a decide, il attend, plusieurs capitales le regardent"
 *                             -> jeton qui pulse + fleches de convoitise + drapeaux des pays touches
 *
 * Drapeau SEN = HEROS, drape toute la scene (opacite dosee). Europe/Asie = couleurs nationales qui
 * s'allument (destinations positives). Russie = NEGATIVE (on la remplace) -> grisee puis coupee.
 *
 * Anti-derive : tout overlay geo-ancre = map.project([lon,lat]) RECALCULE chaque frame (useCurrentFrame).
 */
import React, { useRef, useState } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import type mapboxgl from "mapbox-gl";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { CartoSouverainV5 } from "../../../_shared/mapbox/CartoSouverainV5";
import { GeoCountryPlaque } from "../../../_shared/mapbox/GeoCountryPlaque";
import { GisementMarker } from "../../../_shared/mapbox/GisementTokens";
import { MapboxCountryFlagDecal } from "../../../_shared/mapbox/MapboxCountryFlagDecal";
import { drawFlagCanvas } from "../../../_shared/mapbox/flagCanvas";
import { BarilJaugeIcon } from "../../../_shared/thumbnails/icons/BarilJaugeIcon";

const { fontFamily: BEBAS } = loadBebas();

// CORRIGE 2026-07-04 (passe de finition, chantiers #2+#3 REPRISE-PASSE-FINITION.md, valide Aziz apres
// comparaison Option A/B) : "Premiere chose a comprendre...trouve trois." (49.54->53.70s abs) est
// desormais couverte par le FONDU DE SORTIE ETENDU de sc.1a (SenegalScene1IntroCoin, TOTAL=641f) —
// PAS par un pre-roll navy uni dans cette scene (juge "ne fait pas de sens" par Aziz : rester sur le
// plan precedent qui bouge > fond fixe). AUDIO_START demarre donc directement sur "Le premier s'appelle
// Sangomar." (53.70s, forced-align propre scene1-realign-2026-07-04.json, loss 0.26) — plus de
// dedoublement de texte avec sc.1a. Le contenu visuel garde un court PRE_ROLL (58f=1.93s, recalcule
// pour ce nouvel AUDIO_START) le temps que le fondu de sc.1a finisse de s'estomper a l'ecran.
const AUDIO_START = 53.70;
const PRE_ROLL = 58; // 1.93s : raccord de fondu avec la fin de sc.1a, avant l'arrivee sur Sangomar
const NAVY = "#16213a", GOLD = "#c8a951", GREY = "#5a5a5a", IVORY = "#f2efe6";
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const W = 1920, H = 1080;

// ── coords reelles (offshore Senegal + destinations export) ──────────────────
const SANGOMAR: [number, number] = [-16.95, 14.0];   // petrole, au large de Dakar/Sine-Saloum
const GTA: [number, number] = [-17.05, 15.9];        // gaz, frontiere SN/MR
const YAKAAR: [number, number] = [-17.3, 14.9];      // gaz, au large
const EUROPE: [number, number] = [2.2, 46.2];        // ~ France (destination, visible dans le cadre resserre)
const ASIA: [number, number] = [78.0, 22.0];         // ~ Inde (le flux or doit atteindre le drapeau indien affiche a droite)
const RUSSIA: [number, number] = [38.0, 56.0];       // ~ Russie europeenne (concurrent evince, bord nord-est)

// ── frontieres d'actes (frames @30fps, segment 52->104s = 1560f) ─────────────
// Cales sur le force alignment Whisper : Sangomar f106, "18" f404, GTA f501, cargaisons f751,
// Yakaar f1155, "attend" f1345, "reviendra" f1431.
const A1 = 0;     // SANGOMAR
const A2 = 500;   // GTA (la voix dit "le deuxieme c'est GTA" ~f470-501)
const A3 = 1090;  // YAKAAR (la voix dit "un troisieme champ, Yakaar" ~f1090-1155)
// ── PIVOT 60% (fin de scene 1 : "combien reste au Senegal ?") ───────────────
// La carte a fait son travail (3 champs montres). On RECENTRE : la carte recule
// et se voile, LE chiffre 60% emerge, se nuance ("ni scandale ni jackpot"), puis
// le fond reste pur (transition vers scene 2 Norvege/Congo/Botswana).
//
// ⚠️ CALAGE VERIFIE A L'OREILLE (transcription Whisper de narration-v3-VALIDEE.mp3, l'audio REEL qui joue).
// scene1-alignment.json est DESYNCHRONISE de ~20s (il met "surprise" a 82s, en realite 102.5s) -> NE PAS l'utiliser.
// La source fiable = AUDIO_START=52 + temps audio reel. scene_frame = (t_abs - 52) * 30 :
//   "surprise"(fin Yakaar) 102.5s=f1515 · "Reste la vraie question" 102.8s=f1524 · "combien reste" 106s=f1620
//   "environ 60%" 108.5s=f1695 · "60% la moyenne" 113s=f1830 · "ni scandale ni jackpot" 117.5s=f1965
//   "ne dit rien" 120s=f2040 · "du resultat" 122s=f2100 · (scene 2 "regardons trois" 122.5s=f2115)
const PIV = 1500;  // debut voile carte (recouvre la toute fin de Yakaar f1515, transition douce)
// END RECALCULE 2026-07-04 (chantier 10, bug de re-dedoublement decouvert a l'assemblage complet) :
// quand AUDIO_START est passe de 49.5 a 53.70 (chantier 2 Option A), END n'avait PAS ete recalcule en
// consequence -> la scene rejouait "...decide vraiment du resultat, avant de juger..." EN DOUBLE avec
// sc.2 (confirme par whisper medium sur le montage assemble). END doit TOUJOURS verifier :
// AUDIO_START + END/30 = 122.5s abs (fin sur "decide", avant que sc.2 ne reprenne "vraiment du resultat").
const END = 2064;  // +504f / ~16.8s : "Reste la vraie question..." -> "...ce qui decide" (122.5s abs)

// ────────────────────────────────────────────────────────────────────────────
//  brightenMap — eclaircit le fond de carte APRES applyGeoAfriqueV5 (override LOCAL, ne touche pas
//  le composant partage). CHANTIER 6 (passe finition 2026-07-04) : cette scene etait la seule des 3
//  scenes cartos (gisements/comparaison/coulisses) a ne PAS avoir ce fix -> rupture de charte "carte
//  sombre" au debut de la video (retour Aziz ~1min04 montage). Copie identique de SceneComparaisonV3/
//  SceneCoulissesV3 (source de verite unique du style carte claire).
// ────────────────────────────────────────────────────────────────────────────
const brightenMap = (map: mapboxgl.Map) => {
  const safe = (id: string, prop: string, val: unknown) => {
    try { if (map.getLayer(id)) (map.setPaintProperty as any)(id, prop, val); } catch (_e) {}
  };
  const LAND = "#6f7480";   // terres : gris desature plus CLAIR (etait #4a4a4a)
  const WATER = "#274b73";  // eau : bleu un peu plus clair, contraste terre/eau maintenu (etait #1a3a5c)
  const BORDER = "#eef0f3"; // frontieres : blanc franc (etait #c8c8c8)
  safe("land", "background-color", LAND);
  safe("landuse", "fill-color", LAND);
  safe("national-park", "fill-color", LAND);
  safe("landcover", "fill-color", LAND);
  safe("water", "fill-color", WATER);
  safe("water-shadow", "fill-color", WATER);
  // frontieres : couleur franche + epaisseur croissante au zoom (lisible de loin SANS bouillie de pres)
  safe("admin-0-boundary", "line-color", BORDER);
  safe("admin-0-boundary", "line-width", ["interpolate", ["linear"], ["zoom"], 2, 0.8, 4, 1.6, 6, 2.6]);
  safe("admin-0-boundary", "line-opacity", 0.9);
  safe("admin-0-boundary-disputed", "line-color", BORDER);
  safe("admin-1-boundary", "line-color", "rgba(210,210,210,0.18)");
};

export const SceneGisementsV3: React.FC = () => {
  const { fps } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [, force] = useState(0);

  // ── Cinematographie "etablir puis plonger", relief successif sur chaque champ ──
  // Vue large -> plongee Sangomar -> remontee/transition -> plongee GTA -> dezoom monde (flux)
  // -> retour Senegal large (climax Yakaar + fleches de convoitise).
  const camKeys = [
    // ACTE 1 — etablir puis plonger sur SANGOMAR
    { atProgress: 0.0,         cam: { lon: -16.6,  lat: 14.6,  zoom: 5.75, pitch: 0,  bearing: 0 } },
    { atProgress: 70 / END,    cam: { lon: -16.6,  lat: 14.6,  zoom: 5.85, pitch: 6,  bearing: 0 } },
    { atProgress: 150 / END,   cam: { lon: SANGOMAR[0] - 0.05, lat: SANGOMAR[1] - 0.18, zoom: 7.3, pitch: 40, bearing: -7 } },
    { atProgress: 430 / END,   cam: { lon: SANGOMAR[0] - 0.05, lat: SANGOMAR[1] - 0.16, zoom: 7.35, pitch: 40, bearing: -4 } },
    // ACTE 2 — remonter, plonger GTA (frontiere nord), puis DEZOOM MONDE (flux export)
    { atProgress: A2 / END,    cam: { lon: -16.9,  lat: 15.2,  zoom: 6.4,  pitch: 30, bearing: 0 } },
    { atProgress: 640 / END,   cam: { lon: GTA[0] - 0.04, lat: GTA[1] - 0.18, zoom: 7.3, pitch: 40, bearing: 5 } },
    // bearing remis a 0 AVANT le dezoom (evite la rotation qui fait zigzaguer leader+carte)
    { atProgress: 730 / END,   cam: { lon: GTA[0] - 0.04, lat: GTA[1] - 0.16, zoom: 7.1, pitch: 36, bearing: 0 } },
    // dezoom pour les flux (cargaisons vers Europe/Asie) — resserre sur Atlantique/Afrique/Europe.
    // Trajet cam DROIT (pas de bearing) : le dezoom recule sans pivoter.
    { atProgress: 880 / END,   cam: { lon: 8, lat: 30, zoom: 2.5, pitch: 0, bearing: 0 } },
    { atProgress: A3 / END,    cam: { lon: 8, lat: 30, zoom: 2.5, pitch: 0, bearing: 0 } },
    // ACTE 3 — retour Senegal large pour le climax Yakaar + convoitise
    { atProgress: 1190 / END,  cam: { lon: -16.6, lat: 14.7, zoom: 5.6, pitch: 12, bearing: 0 } },
    { atProgress: 1300 / END,  cam: { lon: -16.7, lat: 14.85, zoom: 6.05, pitch: 22, bearing: 0 } },
    { atProgress: 1480 / END,  cam: { lon: -16.7, lat: 14.85, zoom: 6.05, pitch: 22, bearing: 0 } },
    // PIVOT 60% — la carte RECULE doucement (dezoom + pitch a plat) pendant qu'elle se voile.
    // On ne quitte pas le monde : il s'eloigne et passe en fond derriere le chiffre.
    { atProgress: 1620 / END,  cam: { lon: -16.4, lat: 14.6, zoom: 5.3, pitch: 4, bearing: 0 } },
    { atProgress: 1.0,         cam: { lon: -16.2, lat: 14.4, zoom: 5.05, pitch: 0, bearing: 0 } },
  ];

  return (
    <AbsoluteFill>
      {/* endAt AJOUTE 2026-07-04 (chantier 10) : sans lui, l'audio jouait jusqu'a la fin du RENDER
          (PRE_ROLL+END=2122f=70.73s apres AUDIO_START=53.70 -> 124.43s), au-dela du point voulu 122.5s
          ("...ce qui decide"), rejouant "avant de juger le Senegal, regardons trois" DEJA dans sc.2. */}
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3")} startFrom={AUDIO_START * fps} endAt={Math.round(122.5 * fps)} />
      <SceneSFX />
      {/* PRE_ROLL (0->58f) : raccord avec la fin du fondu de sc.1a (deja navy_deep a ce point) —
          carte pas encore apparue, fond navy en continuite (evite un cut sec avant Sangomar). */}
      <AbsoluteFill style={{ backgroundColor: NAVY }} />
      <Sequence from={PRE_ROLL}>
        <CartoSouverainV5 camKeys={camKeys} focusIsos={["SEN"]} onMapReady={(m) => { mapRef.current = m; brightenMap(m); force((n) => n + 1); }}>
          {/* DRAPEAU SEN drape des le debut (heros, colorie la carte) — opacite dosee */}
          <MapboxCountryFlagDecal mapRef={mapRef} iso="SEN" geoNames={["Senegal"]} drawFlag={(s) => drawFlagCanvas("SEN", s)} opacity={0.5} />
          {/* Drapeaux des pays convoiteurs — apparaissent pendant le DEZOOM monde (acte 2, f880-1090),
              quand Europe/Asie/Russie sont dans le cadre et que les flux les relient. La couleur est
              posee la (carte vivante, pas du gris), avant le retour Senegal pour le climax Yakaar.
              Europe + Asie = destinations (positives) · Russie = concurrent evince mais on l'affiche
              aussi (le spectateur voit QUI on remplace). */}
          {/* France : clipBbox metropolitaine (sinon Natural Earth inclut Guadeloupe..Reunion → metropole minuscule, drapeau blanc) */}
          <AnimatedFlagDecal mapRef={mapRef} iso="FRA" geoNames={["France"]} appearAt={905} maxOpacity={1} clipBbox={[-5.5, 41.0, 9.8, 51.5]} />
          <AnimatedFlagDecal mapRef={mapRef} iso="IND" geoNames={["India"]} appearAt={950} maxOpacity={0.9} />
          <AnimatedFlagDecal mapRef={mapRef} iso="RUS" geoNames={["Russia"]} appearAt={905} maxOpacity={0.5} fadeOutAt={1000} />
          <Effets mapRef={mapRef} />
        </CartoSouverainV5>
        {/* ── PIVOT 60% : voile navy + chiffre hero + jauge + nuance (premier plan, par-dessus la carte) ── */}
        <PivotRevenu />
      </Sequence>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  PIVOT REVENU — fin de scene 1, en DATA-HERO (grammaire DECODE-mpesa, validee Aziz).
//  Objet-HEROS central immuable (le BARIL) qui se remplit du drapeau SEN a 60%, halo qui
//  RESPIRE, UNE donnee greffee a droite (60%), UNE seule ecriture (la question). Fond navy
//  QUADRILLE (grille or visible, registre data Souverain). Voile OPAQUE : la carte disparait
//  totalement (plein ecran, plus de superposition jeton Yakaar/carte).
//
//  REGLE DES 5s sur ~20s = 4 plateaux, le baril ne bouge JAMAIS (seuls remplissage + halo vivent).
//  Cale sur l'audio REEL (Whisper segment 100-125s, frame_scene = (t_abs-52)*30) :
//   P1 f1500-1640 : voile opaque monte, baril vide + question ("Reste la vraie question..." f1558)
//   P2 f1640-1740 : le baril SE REMPLIT a 60%, le 60% se greffe a droite. Pic "environ 60%" f1715.
//   P3 f1740-1980 : tenue stable, halo respire ("60% la moyenne" f1911).
//   P4 f1980-2120 : halo se calme, fade doux -> navy pur ("ni scandale... du resultat" f2010-2134).
// ════════════════════════════════════════════════════════════════════════════
const PivotRevenu: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < PIV) return null;

  // P1 — voile navy OPAQUE : la carte disparait totalement (plein ecran serie).
  const veil = interpolate(frame, [PIV, PIV + 70], [0, 1], clamp);

  // SEULE ecriture : la question (apparait apres le voile, reste jusqu'au fade final).
  const qOp = interpolate(frame, [1560, 1600, 2024, 2064], [0, 1, 1, 0], clamp);

  // P2 — remplissage baril 0->60%, RALENTI et ease-out (le petrole se pose, mouvement ample).
  // Etale sur f1640->1790 (150f = 5s) au lieu de 80f. Le pic reste cale sur "soixante pour cent" (~f1715-1760).
  const fillT = interpolate(frame, [1640, 1790], [0, 1], clamp);
  const fillEased = 1 - Math.pow(1 - fillT, 2.2); // ease-out : rapide au debut, lent a la fin (se pose)
  const barilRatio = fillEased * 60;
  const num = Math.round(barilRatio);
  const barilOp = interpolate(frame, [1560, 1620, 2034, 2064], [0, 1, 1, 0], clamp);
  // le 60% se greffe a droite APRES le remplissage (f1770->1820)
  const rightIn = interpolate(frame, [1770, 1820], [0, 1], clamp);

  // ── geometrie du baril (repere viewBox 1280x720 du composant) pour poser l'animation de surface ──
  const B_CX = 500, B_CY = 400, B_W = 320, B_H = 470;
  const B_bottom = B_CY + B_H / 2;
  const B_left = B_CX - B_W / 2, B_right = B_CX + B_W / 2;
  const surfaceY = B_bottom - (B_H * barilRatio) / 100; // niveau du liquide (= cutY interne)
  const filled = barilRatio > 2;
  // ondulation de surface (une fois du liquide present) : oscillation lente du niveau + brillance
  const ripple = 2.2 * Math.sin(frame / 9) + 1.4 * Math.sin(frame / 13 + 1);
  // reflet qui balaye le couvercle (haut du baril) lentement
  const sweepX = B_left + ((frame % 150) / 150) * B_W;

  // P3 — halo qui RESPIRE (le pivot respire, cree du vide). Se calme en P4 ("ni scandale").
  const haloBreath = 0.10 + 0.05 * Math.sin(frame / 16);
  const haloCalm = interpolate(frame, [1980, 2060], [1, 0.4], clamp); // se calme vers la fin
  const halo = haloBreath * haloCalm;

  // P4 — fade-out global -> navy pur (transition scene 2).
  const blockOp = interpolate(frame, [2034, 2064], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* voile navy OPAQUE + grille or visible (registre data Souverain) */}
      <AbsoluteFill style={{
        backgroundColor: NAVY,
        opacity: veil,
        backgroundImage:
          "linear-gradient(rgba(200,169,81,0.10) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(200,169,81,0.10) 1px, transparent 1px)",
        backgroundSize: "60px 60px, 60px 60px",
      }} />
      {/* halo radial doux derriere le baril */}
      <AbsoluteFill style={{
        opacity: barilOp,
        background: `radial-gradient(circle at 33% 55%, rgba(200,169,81,${halo}) 0%, rgba(200,169,81,0) 36%)`,
      }} />

      <AbsoluteFill style={{ opacity: blockOp }}>
        {/* SEULE ecriture : la question, en haut (remontee pour ne pas toucher le baril) */}
        <div
          style={{
            position: "absolute", top: 70, width: "100%", textAlign: "center",
            opacity: qOp, color: IVORY, fontFamily: BEBAS, fontSize: 52, letterSpacing: "0.05em",
          }}
        >
          Combien reste au Sénégal&nbsp;?
        </div>

        {/* BARIL HERO a GAUCHE du centre (immuable, gros), se remplit du drapeau SEN */}
        <div style={{ position: "absolute", inset: 0, opacity: barilOp }}>
          <BarilJaugeIcon
            ratio={barilRatio}
            flagColors={{ a: "#00853F", b: "#FDEF42", c: "#E31B23" }}
            starColor="#00853F"
            position={{ cx: 500, cy: 400 }}
            size={{ w: 320, h: 470 }}
          />
          {/* SURFACE VIVANTE (anti-statique) : ondulation du niveau de liquide + reflet qui balaye le couvercle.
              Memes coords que le baril (viewBox 1280x720), pose par-dessus. */}
          <svg width="100%" height="100%" viewBox="0 0 1280 720" style={{ position: "absolute", inset: 0 }}>
            {filled && (
              <>
                {/* miroitement de la surface du petrole (ellipse claire qui ondule au niveau du liquide) */}
                <ellipse
                  cx={B_CX} cy={surfaceY + ripple}
                  rx={B_W / 2 - 6} ry={B_W * 0.085}
                  fill="none" stroke="#f4e3ad" strokeWidth={2}
                  opacity={0.35 + 0.12 * Math.sin(frame / 9)}
                />
                <ellipse
                  cx={B_CX} cy={surfaceY + ripple}
                  rx={B_W / 2 - 6} ry={B_W * 0.085}
                  fill="#f4e3ad" opacity={0.07 + 0.04 * Math.sin(frame / 11)}
                />
              </>
            )}
            {/* reflet diagonal qui balaye le HAUT du baril (couvercle metal) — vie permanente */}
            <g clipPath="url(#barilTopClip)" opacity={0.5}>
              <rect x={sweepX} y={B_CY - B_H / 2 - 10} width={16} height={B_H * 0.45} fill="#ffffff" opacity={0.10} transform="skewX(-18)" />
            </g>
            <defs>
              <clipPath id="barilTopClip">
                <rect x={B_left} y={B_CY - B_H / 2} width={B_W} height={surfaceY - (B_CY - B_H / 2)} />
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* SEULE donnee : le 60% hero greffe a droite (spring), aligne au centre du baril, SANS label */}
        <div style={{
          position: "absolute", right: 300, top: 470, textAlign: "left",
          opacity: rightIn * barilOp, transform: `translateX(${(1 - rightIn) * 40}px)`,
        }}>
          <div style={{ fontFamily: BEBAS, fontSize: 220, lineHeight: 0.9, color: GOLD, textShadow: "0 0 30px rgba(200,169,81,0.3)" }}>{num}%</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  SFX — couche son. Chaque SFX dans un <Sequence> (doctrine : {frame===X && <Audio>} = SILENCE
//  en render ; il FAUT wrapper dans une Sequence d'une duree >= celle du son). Volumes doses pour
//  ne pas couvrir la narration. Cales sur les moments des actes 1-3 (frames stables que je controle).
// ════════════════════════════════════════════════════════════════════════════
const Sfx: React.FC<{ at: number; src: string; dur?: number; volume?: number }> = ({ at, src, dur = 24, volume = 0.5 }) => (
  <Sequence from={at} durationInFrames={dur}>
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);

const SFX = {
  ping: "_shared/sfx/camera/sfx-map-ping.mp3",   // apparition jeton (cliquetis discret)
  barilFill: "_shared/sfx/ui/sfx-baril-fill.mp3", // remplissage du baril 60% (liquide qui monte)
};

// SFX EPURE (retour Aziz) : on NE met PAS un son a chaque mouvement de camera (saturation).
// Garder : (1) le PING d'apparition de chaque jeton/gisement · (2) le bruit de REMPLISSAGE du baril.
// Retire : TOUS les swooshs/whooshs de camera (mal cales, n'ajoutent rien), arrows de flux, pops.
// SceneSFX est au niveau RACINE (pas dans la Sequence from={PRE_ROLL} de la carte) -> ses "at" doivent
// inclure le PRE_ROLL (+75f) pour rester synchro avec Sangomar/GTA/Yakaar/remplissage (bug #2 fix).
const SceneSFX: React.FC = () => (
  <>
    {/* ping a l'apparition de chaque gisement (ponctue la decouverte) */}
    <Sfx at={PRE_ROLL + 165} src={SFX.ping} dur={16} volume={0.5} />  {/* SANGOMAR */}
    <Sfx at={PRE_ROLL + 575} src={SFX.ping} dur={16} volume={0.5} />  {/* GTA */}
    <Sfx at={PRE_ROLL + 1165} src={SFX.ping} dur={16} volume={0.5} /> {/* YAKAAR */}
    {/* remplissage du baril 60% : liquide qui monte, cale sur le remplissage (f1640-1790) */}
    <Sfx at={PRE_ROLL + 1640} src={SFX.barilFill} dur={150} volume={0.42} />
  </>
);

// ════════════════════════════════════════════════════════════════════════════
//  Drapeau drape avec opacite ANIMEE (etend MapboxCountryFlagDecal mono-injection :
//  on injecte a opacite 0 puis on pilote raster-opacity par frame). Pour les pays
//  destinations qui s'allument quand une fleche les touche (acte 3).
// ════════════════════════════════════════════════════════════════════════════
const AnimatedFlagDecal: React.FC<{
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  iso: string;
  geoNames: string[];
  appearAt: number;
  maxOpacity?: number;
  /** si fourni, le drapeau s'estompe a partir de fadeOutAt (ex: Russie = concurrent evince). */
  fadeOutAt?: number;
  /** bbox metropolitaine pour les pays a DOM-TOM (ex: France). */
  clipBbox?: [number, number, number, number];
}> = ({ mapRef, iso, geoNames, appearAt, maxOpacity = 0.7, fadeOutAt, clipBbox }) => {
  const frame = useCurrentFrame();
  const map = mapRef.current;
  const op = fadeOutAt != null
    ? interpolate(frame, [appearAt, appearAt + 26, fadeOutAt, fadeOutAt + 40], [0, maxOpacity, maxOpacity, maxOpacity * 0.18], clamp)
    : interpolate(frame, [appearAt, appearAt + 26], [0, maxOpacity], clamp);
  // piloter l'opacite du layer une fois injecte
  if (map) {
    const layerId = `flagdecal-lyr-${iso}`;
    if (map.getLayer(layerId)) {
      try { map.setPaintProperty(layerId, "raster-opacity", op); } catch (_e) { /* layer pas pret */ }
    }
  }
  // injecte a opacite 0 (le pilotage ci-dessus prend le relais)
  return <MapboxCountryFlagDecal mapRef={mapRef} iso={iso} geoNames={geoNames} drawFlag={(s) => drawFlagCanvas(iso, s)} opacity={0} clipBbox={clipBbox} />;
};

// ════════════════════════════════════════════════════════════════════════════
//  Utilitaires courbe (reutilises du systeme V5 — flux Bezier avec pointe)
// ════════════════════════════════════════════════════════════════════════════
function bezierSamples(x0: number, y0: number, cpX: number, cpY: number, x1: number, y1: number, steps: number) {
  const pts: [number, number][] = [[x0, y0]];
  let totalLen = 0;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const bx = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cpX + t * t * x1;
    const by = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cpY + t * t * y1;
    const dx = bx - pts[i - 1][0], dy = by - pts[i - 1][1];
    totalLen += Math.sqrt(dx * dx + dy * dy);
    pts.push([bx, by]);
  }
  return { pts, totalLen };
}
function bezierPointAtLength(pts: [number, number][], targetLen: number) {
  let cum = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1];
    const seg = Math.sqrt(dx * dx + dy * dy);
    if (cum + seg >= targetLen || i === pts.length - 1) {
      const frac = seg > 0 ? Math.min(1, (targetLen - cum) / seg) : 0;
      return { x: pts[i - 1][0] + frac * dx, y: pts[i - 1][1] + frac * dy, angle: Math.atan2(dy, dx) };
    }
    cum += seg;
  }
  const last = pts[pts.length - 1], prev = pts[pts.length - 2];
  return { x: last[0], y: last[1], angle: Math.atan2(last[1] - prev[1], last[0] - prev[0]) };
}

const BezierFlow: React.FC<{
  x0: number; y0: number; cpX: number; cpY: number; x1: number; y1: number;
  progress: number; stroke: string; strokeWidth?: number; opacity?: number; arrowSize?: number;
}> = ({ x0, y0, cpX, cpY, x1, y1, progress, stroke, strokeWidth = 3, opacity = 1, arrowSize = 13 }) => {
  if (progress <= 0.005) return null;
  const STEPS = 60;
  const { pts, totalLen } = bezierSamples(x0, y0, cpX, cpY, x1, y1, STEPS);
  const drawn = progress * totalLen;
  const { x: arX, y: arY, angle: arAng } = bezierPointAtLength(pts, drawn);
  const AS = arrowSize;
  const ax1 = arX - AS * Math.cos(arAng - 0.4), ay1 = arY - AS * Math.sin(arAng - 0.4);
  const ax2 = arX - AS * Math.cos(arAng + 0.4), ay2 = arY - AS * Math.sin(arAng + 0.4);
  const d = `M ${x0} ${y0} Q ${cpX} ${cpY} ${x1} ${y1}`;
  return (
    <g opacity={opacity}>
      <path d={d} fill="none" stroke={NAVY} strokeWidth={strokeWidth + 2.5} opacity={0.55} strokeDasharray={`${drawn} ${totalLen}`} strokeLinecap="round" />
      <path d={d} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={`${drawn} ${totalLen}`} strokeLinecap="round" />
      {progress > 0.02 && <path d={`M ${arX} ${arY} L ${ax1} ${ay1} L ${ax2} ${ay2} Z`} fill={stroke} stroke={NAVY} strokeWidth={0.6} />}
    </g>
  );
};

// Leader : ligne + pointe du point geo vers la plaque deportee
const Leader: React.FC<{ x1: number; y1: number; x2: number; y2: number; op: number }> = ({ x1, y1, x2, y2, op }) => {
  const ang = Math.atan2(y1 - y2, x1 - x2);
  const ax = x1 - 13 * Math.cos(ang), ay = y1 - 13 * Math.sin(ang);
  return (
    <g opacity={op}>
      <line x1={x2} y1={y2} x2={x1} y2={y1} stroke={GOLD} strokeWidth={2} strokeLinecap="round" />
      <path d={`M ${x1} ${y1} L ${ax - 6 * Math.sin(ang)} ${ay + 6 * Math.cos(ang)} L ${ax + 6 * Math.sin(ang)} ${ay - 6 * Math.cos(ang)} Z`} fill={GOLD} />
    </g>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  EFFETS — overlays SVG geo-ancres (1 seul SVG plein ecran, positions recalculees chaque frame)
// ════════════════════════════════════════════════════════════════════════════
const Effets: React.FC<{ mapRef: React.MutableRefObject<mapboxgl.Map | null> }> = ({ mapRef }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const map = mapRef.current;
  if (!map) return null;
  const P = (c: [number, number]) => { const p = map.project(c as any); return [p.x, p.y] as [number, number]; };
  const zoom = map.getZoom();

  const [sx, sy] = P(SANGOMAR);
  const [gx, gy] = P(GTA);
  const [yx, yy] = P(YAKAAR);
  const [ex, ey] = P(EUROPE);
  const [asx, asy] = P(ASIA);
  // (RUSSIA n'a plus de flux projete — drapeau-decal seul)

  // ── ACTE 1 — SANGOMAR : jeton oil + leader + plaque deportee ───────────────
  const a1MarkerStart = 150;
  const a1Scale = spring({ frame: frame - a1MarkerStart, fps, config: { damping: 16, mass: 0.8 } });
  const a1MarkerOp = interpolate(frame, [a1MarkerStart, a1MarkerStart + 20, A2 - 20, A2], [0, 1, 1, 0], clamp);
  const a1PlaqueOp = interpolate(frame, [230, 256, A2 - 30, A2], [0, 1, 1, 0], clamp);

  // ── ACTE 2 — GTA : jeton gas frontiere + flux Europe/Asie + Russie coupee ──
  const a2MarkerStart = 560;
  const a2Scale = spring({ frame: frame - a2MarkerStart, fps, config: { damping: 16, mass: 0.8 } });
  // jeton + plaque + leader GTA s'eteignent AVANT le dezoom (f730) — sinon le leader balaie
  // l'ecran en suivant le point GTA qui s'eloigne tres vite (le "zigzag" repere par Aziz).
  const a2MarkerOp = interpolate(frame, [a2MarkerStart, a2MarkerStart + 20, 700, 722], [0, 1, 1, 0], clamp);
  const a2PlaqueOp = interpolate(frame, [600, 626, 700, 722], [0, 1, 1, 0], clamp);

  // flux GTA -> Europe (ivoire) + GTA -> Asie (or), pendant le dezoom monde (f880-1090)
  const flowEuropeProg = interpolate(frame, [905, 1010], [0, 1], clamp);
  const flowEuropeOp = interpolate(frame, [905, 925, 1060, 1090], [0, 0.95, 0.95, 0], clamp);
  const flowAsiaProg = interpolate(frame, [950, 1060], [0, 1], clamp);
  const flowAsiaOp = interpolate(frame, [950, 970, 1060, 1090], [0, 0.95, 0.95, 0], clamp);

  // (Russie : plus de flux propre — elle reste affichee comme drapeau qui s'estompe, le concurrent
  //  qu'on remplace, mais sans fleche partant d'elle, cf. retour Aziz "melangeant".)

  // control points flux
  const eurCp: [number, number] = [(gx + ex) / 2 + 80, (gy + ey) / 2 - 220];
  const asiaCp: [number, number] = [(gx + asx) / 2 + 200, (gy + asy) / 2 - 160];

  // ── ACTE 3 — YAKAAR : jeton qui pulse + fleches de convoitise ──────────────
  const a3MarkerStart = 1150;
  const a3Scale = spring({ frame: frame - a3MarkerStart, fps, config: { damping: 18, mass: 0.7 } });
  const a3Op = interpolate(frame, [a3MarkerStart, a3MarkerStart + 24], [0, 1], clamp);
  // fleches de convoitise : convergent vers Yakaar SANS toucher (gap permanent).
  // Origines cote OCEAN (gauche/haut-gauche/bas-gauche) — les convoiteurs viennent du large,
  // les fleches ne traversent pas le continent (qui est a droite du point Yakaar).
  const convoiteOrigins: [number, number][] = [
    [0, H * 0.12], [0, H * 0.34], [0, H * 0.56], [0, H * 0.80],
    [W * 0.18, 0], [W * 0.32, 0], [W * 0.20, H], [W * 0.36, H],
  ];

  const PLAQUE_X = 360; // colonne ocean gauche — assez a droite pour que les longs libelles ne debordent pas (plaque centree sur ce x)

  return (
    <>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {/* (overlay 18% retire — redondant avec la voix, trop bref, posait sur le continent.
            La plaque Sangomar "Petrole brut / Woodside" porte deja l'info.) */}

        {/* ═══ ACTE 1 — SANGOMAR ═══ */}
        {frame < A2 + 10 && a1MarkerOp > 0.01 && (
          <>
            <Leader x1={sx} y1={sy} x2={PLAQUE_X + 10} y2={560 + 44} op={a1PlaqueOp} />
            <GisementMarker kind="oil" x={sx} y={sy} scale={a1Scale} frame={frame} localF={frame - a1MarkerStart} appeared={frame - a1MarkerStart > 24} uid="sangomar" zoom={zoom} />
          </>
        )}

        {/* ═══ ACTE 2 — GTA ═══ */}
        {frame >= A2 - 20 && frame < 900 && a2MarkerOp > 0.01 && (
          <>
            <Leader x1={gx} y1={gy} x2={PLAQUE_X + 10} y2={380 + 44} op={a2PlaqueOp} />
            <g transform={`translate(${gx}, ${gy})`} opacity={a2MarkerOp}>
              <g transform={`scale(${a2Scale})`}>
                {/* barre frontiere SN/MR sous le jeton */}
                <line x1={0} y1={-30} x2={0} y2={30} stroke={IVORY} strokeWidth={1.2} opacity={0.5} />
              </g>
            </g>
            <GisementMarker kind="gas" x={gx} y={gy} scale={a2Scale} frame={frame} localF={frame - a2MarkerStart} appeared={frame - a2MarkerStart > 24} uid="gta" zoom={zoom} />
          </>
        )}

        {/* ACTE 2 — flux export (dezoom monde) : SEULEMENT les destinations (clients).
            Pas de fleche partant de la Russie (melangeant) — la Russie reste affichee comme
            drapeau qui s'estompe (le concurrent qu'on remplace), mais sans fleche propre. */}
        {frame >= 895 && frame < A3 + 10 && (
          <>
            {/* GTA -> Europe (ivoire, positif) */}
            {flowEuropeOp > 0.01 && (
              <BezierFlow x0={gx} y0={gy} cpX={eurCp[0]} cpY={eurCp[1]} x1={ex} y1={ey} progress={flowEuropeProg} stroke={IVORY} strokeWidth={3.4} opacity={flowEuropeOp} />
            )}
            {/* GTA -> Asie (or, positif) */}
            {flowAsiaOp > 0.01 && (
              <BezierFlow x0={gx} y0={gy} cpX={asiaCp[0]} cpY={asiaCp[1]} x1={asx} y1={asy} progress={flowAsiaProg} stroke={GOLD} strokeWidth={3.4} opacity={flowAsiaOp} />
            )}
          </>
        )}

        {/* ═══ ACTE 3 — YAKAAR : convoitise ═══ */}
        {/* borne haute PIV+30 : le jeton/fleches s'effacent sous le voile navy qui monte (pas de jeton dore
            qui perce le pivot). Avant ca le voile (0->0.86) les estompe deja en "monde qui recule". */}
        {frame >= A3 && frame < PIV + 30 && (
          <>
            {/* fleches de convoitise : tracees vers Yakaar, s'arretent 56px avant (gap = suspense) */}
            {convoiteOrigins.map(([ox, oy], i) => {
              const drawProg = interpolate(frame, [1240 + i * 8, 1330 + i * 8], [0, 1], clamp);
              if (drawProg <= 0.005) return null;
              const dx = yx - ox, dy = yy - oy;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 1) return null;
              const endFrac = Math.max(0, (dist - 56) / dist);
              const curX = ox + drawProg * endFrac * dx;
              const curY = oy + drawProg * endFrac * dy;
              return (
                <g key={i}>
                  <line x1={ox} y1={oy} x2={curX} y2={curY} stroke={IVORY} strokeWidth={1.4} opacity={0.4} />
                  {drawProg > 0.9 && <circle cx={curX} cy={curY} r={3} fill={GOLD} opacity={0.6} />}
                </g>
              );
            })}
            {/* jeton Yakaar : anneau pointille qui RESPIRE (en attente) */}
            {a3Op > 0.01 && (
              <g transform={`translate(${yx}, ${yy})`} opacity={a3Op}>
                <g transform={`scale(${a3Scale})`}>
                  <circle r={26 + 4 * Math.sin((frame - a3MarkerStart) / 36)} fill="none" stroke={GOLD} strokeWidth={2.2} strokeDasharray="3 6" opacity={0.78 + 0.16 * Math.sin((frame - a3MarkerStart) / 36)} />
                  <circle r={38} fill="none" stroke={IVORY} strokeWidth={1} strokeDasharray="2 8" opacity={0.3} />
                  <circle r={6} fill={GOLD} />
                </g>
              </g>
            )}
          </>
        )}
      </svg>

      {/* ── ACTE 1 — plaque SANGOMAR deportee (ocean gauche) ──────────────────── */}
      {frame < A2 && a1PlaqueOp > 0.01 && (
        <GeoCountryPlaque frame={frame} name="SANGOMAR" color={GOLD} stat="Pétrole brut" source="Opérateur : Woodside (Australie)" appearAt={230} hideAt={A2} pos={{ x: PLAQUE_X, y: 560 }} />
      )}

      {/* ── ACTE 2 — plaque GTA deportee (ocean gauche) ──────────────────────── */}
      {frame >= A2 - 10 && frame < 730 && a2PlaqueOp > 0.01 && (
        <GeoCountryPlaque frame={frame} name="GTA" color={GOLD} stat="Gaz, depuis 2025" source="Opérateur : BP (Royaume-Uni)" appearAt={600} hideAt={724} pos={{ x: PLAQUE_X, y: 380 }} />
      )}

      {/* ── ACTE 2 — plaques DESTINATION qui apparaissent quand la fleche TOUCHE le pays ──
          France (fleche Europe arrive ~f1010) · Inde (fleche Asie arrive ~f1060). Posees AU POINT
          d'atterrissage (geo-ancrees), petites (juste le nom + role) = vie sur les pays partenaires. */}
      {frame >= 1000 && frame < A3 && (
        <GeoCountryPlaque frame={frame} name="FRANCE" color={IVORY} stat="Client gaz" appearAt={1008} hideAt={A3} pos={{ x: ex, y: ey - 30 }} />
      )}
      {frame >= 1050 && frame < A3 && (
        <GeoCountryPlaque frame={frame} name="INDE" color={GOLD} stat="Client gaz" appearAt={1058} hideAt={A3} pos={{ x: asx, y: asy - 30 }} />
      )}

      {/* ── ACTE 3 — plaque YAKAAR deportee (ocean gauche) ───────────────────── */}
      {/* La plaque Yakaar disparait AVANT le pivot 60% (sinon elle chevauche l'amorce "sur tout cet argent").
          hideAt=PIV-10 -> elle s'efface pendant que la voix finit "...la plus grosse surprise". */}
      {frame >= A3 + 60 && frame < PIV && (
        <GeoCountryPlaque frame={frame} name="YAKAAR-TERANGA" color={GOLD} stat="Gaz, non attribué" source="Opérateur : à décider" appearAt={1180} hideAt={PIV - 10} pos={{ x: PLAQUE_X, y: 470 }} />
      )}
    </>
  );
};

export const SCENE_GISEMENTS_V3_FRAMES = END;
export default SceneGisementsV3;
