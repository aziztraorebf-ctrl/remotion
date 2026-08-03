// PROTO FUSION — combine le meilleur des 2 protos precedents dans UNE SEULE sequence narrative
// (Gazoduc AAGP vs TSGP, Acte 1 hook). Decision Aziz 2026-08-02 apres review des 2 protos isoles :
// "le proto 1 et le proto 2 se completent extremement bien. Le meilleur des deux devrait etre un
// prototype 3 du globe, qui combine les deux dans une seule sequence narrative."
//
// Ce qu'on prend de CHAQUE proto (ne rien reinventer, cf memoire projet) :
//  - ProtoGazoducZoomRobuste.tsx : amplitude de camera AMPLE (scaleMul ~1.3 -> ~4.4), pivot+zoom
//    JAMAIS fige, et la regle du globeR calcule UNE FOIS et reutilise PARTOUT (aucun GLOBE_R brut
//    en dehors du calcul de globeR lui-meme — verifie par grep en fin de fichier/commentaire).
//    Drapeau Nigeria solidaire de la sphere via GlobeFlagFill (brique exacte reutilisee).
//  - ProtoGazoducArcContinu.tsx : structure narrative (ouverture serree -> pivot large qui revele
//    les 2 territoires -> re-avancee -> arrivee serree) ET le probleme identifie par Aziz apres
//    rendu : l'arc trace au grand cercle (arcPathD) entre Nigeria et l'Espagne ressort quasi DROIT
//    a l'ecran (les 2 points sont presque sur le meme grand cercle nord-sud, la courbure du globe
//    ne suffit pas a creer un S visible). FIX : on utilise ICI windingPathD/windingCircle (deja
//    presents dans geoArc.ts, jamais utilises jusqu'ici) qui ajoutent une ondulation perpendiculaire
//    au grand cercle -> vraie courbe en S lisible, tout en restant geo-coherente (part et arrive pile
//    sur les 2 points, cf enveloppe sin(t*PI) qui annule l'ondulation aux extremites).
//
// Duree ~16s (480f @30fps) — narration continue, camera jamais figee pendant que l'arc se trace.
//
// ⭐ RAFFINEMENT 2026-08-02 (Aziz, ref. video GlobeRecitProto.tsx du Short Soudan) : le Nigeria et
// l'Espagne n'apparaissent plus par simple fade (drapeau qui se materialise / couleur qui glisse) —
// ils naissent a l'ecran par le geste "CONTOUR se trace PUIS remplissage" (PaysTrace, brique reprise
// telle quelle de GlobeRecitProto.tsx : longueur de path MESUREE via polylineLength(), jamais
// l'heuristique "nombre de commandes" — cf feedback svg-path-length-heuristique-commandes-jamais-fiable).
// Le `d` passe a PaysTrace est le path DEJA PROJETE a l'ecran (path(feature), coordonnees SVG post-
// projection ortho), donc le mecanisme marche a l'identique ici bien que la projection (orthoAt avec
// scaleMul continu) ne soit pas celle du fichier Soudan — seule la longueur du trait/l'echelle ecran
// changent, jamais le referentiel des coordonnees.
//
// ⭐⭐ RAFFINEMENT 2 (Aziz 2026-08-02, apres le fix du bug remplissage Espagne) : le CONTINENT AFRICAIN
// se dessine en fond DISCRET juste apres le Nigeria (jamais aussi visible que le sujet), pendant que
// la camera est POSEE dessus (fenetre HOLD ajoutee dans CAM ci-dessous, cf commentaire). Inspire du
// `mondeFade` de GlobeRecitProto.tsx (plafonne 0.30, apparition tardive) mais ARRIVE PLUS TOT ici (juste
// apres le sujet, pas a la toute fin) car son role est de donner le CONTEXTE geographique avant les arcs,
// pas une simple retombee finale. Effet de VAGUE organique (jamais tous les pays au meme rythme) : le
// timing de chaque pays est offset par sa DISTANCE ANGULAIRE au Nigeria (geoDistance de d3-geo, deja
// disponible, jamais reinvente a la main) — les voisins immediats (Benin, Cameroun) se tracent en
// premier, les plus lointains (Cote d'Ivoire, Congo) en dernier, comme une onde qui part du sujet.
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { geoDistance, geoCentroid } from "d3-geo";
import { W, H, GLOBE_R, GRATICULE, worldFeatures, featureByName, orthoAt, pathOf, isVisible as isVisibleGeo } from "./globeGeo";
import { windingPathD, pointAlongWinding, arcPathD, pointAlongArc, projectPoint, type LonLat } from "./geoArc";
import { camAt, type CamKey } from "./globeCamera";
import { THEMES, GlobeFlagFill, BorderPulse } from "./SoudanActe3GlobeProto16x9";
import { SubtitleBarSouverain, type SubLine } from "../../_shared/components/ui/SubtitleBarSouverain";

// Sous-titres (demande explicite Aziz 2026-08-03, DEROGATION SCIENTE a la doctrine "pas de sous-titre
// bas d'ecran qui repete la narration" — cf feedback_pas-de-sous-titres-bas-ecran-reserve-sources.md.
// Segments extraits mot-a-mot du forced-align reel (narration-NEW.alignment.json), PAS retapes a la
// main — les 2 premieres phrases du script Acte 1 seulement, cales sur les 480f/16s de ce prototype
// (l'Acte 1 complet dure 84.68s/2540f, bien au-dela de ce test isole — cf STATUS.md).
const ACTE1_SUBTITLES: SubLine[] = [
  { text: "Imaginez deux immenses tuyaux qui partent du même pays.", start: 4, end: 126 },
  { text: "Ils partent exactement du même endroit : les immenses réserves du Nigeria.", start: 151, end: 344 },
];

// ── Longueur REELLE d'un path (jamais d'heuristique — leçon CFA beat 6a, brique reprise de
// GlobeRecitProto.tsx sans modification). ──
function polylineLength(d: string): number {
  let total = 0;
  const re = /([MLZ])([^MLZ]*)/gi;
  let m: RegExpExecArray | null;
  let cur: number[][] = [];
  const flush = () => {
    for (let i = 1; i < cur.length; i++) {
      total += Math.hypot(cur[i][0] - cur[i - 1][0], cur[i][1] - cur[i - 1][1]);
    }
    cur = [];
  };
  while ((m = re.exec(d)) !== null) {
    const cmd = m[1].toUpperCase();
    if (cmd === "Z") { if (cur.length) { total += Math.hypot(cur[0][0] - cur[cur.length - 1][0], cur[0][1] - cur[cur.length - 1][1]); flush(); } continue; }
    const nums = m[2].trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (cmd === "M" && cur.length) flush();
    for (let i = 0; i + 1 < nums.length; i += 2) cur.push([nums[i], nums[i + 1]]);
  }
  flush();
  return total;
}

// Un pays qui SE DESSINE (contour) puis se REMPLIT (aplat de couleur) — geste en 2 temps, pas un fade.
const PaysTrace: React.FC<{
  d: string; trace: number; fill: number; fillColor: string; strokeColor?: string; strokeW?: number; fillOpacity?: number; strokeOpacity?: number;
}> = ({ d, trace, fill, fillColor, strokeColor = "#F4ECD2", strokeW = 1.8, fillOpacity = 0.95, strokeOpacity = 0.95 }) => {
  const len = useMemo(() => polylineLength(d), [d]);
  if (trace <= 0) return null;
  return (
    <g>
      {fill > 0.01 && <path d={d} fill={fillColor} fillOpacity={fillOpacity * fill} stroke="none" />}
      <path
        d={d} fill="none" stroke={strokeColor} strokeWidth={strokeW}
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={len} strokeDashoffset={len * (1 - trace)}
        strokeOpacity={strokeOpacity}
      />
    </g>
  );
};

export const PROTO_GAZODUC_FUSION_FRAMES = 480; // 16s @30fps (+90f = fenetre HOLD continent, cf CAM)

const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const t = THEMES.mixte;
// TSGP_COLOR : orange saharien, meme valeur EXACTE que ProtoGazoducAfriqueComplete.tsx (coherence
// inter-prototypes demandee par le brief) — pas dans GlobeTheme (interface partagee par d'autres
// scenes/themes qui n'ont pas de 2e flux), garde locale a ce fichier plutot que d'etendre le contrat
// partage pour un seul consommateur.
const TSGP_COLOR = "#e8834a";

// --- Geo (Nigeria = source du gaz AAGP/TSGP, Espagne = porte d'entree europeenne AAGP, Algerie =
// porte d'entree TSGP) — coordonnees Espagne/Nigeria deja verifiees dans ce fichier ; ALGERIE reprise
// telle quelle de GAZODUC_GEO.algerieCenter (gazoducGeo.ts, verifiee depuis notre GeoJSON reel via
// d3.geoCentroid — jamais inventee a la main, meme discipline que le reste du registre Souverain). -----
const NIGERIA: LonLat = [8.0, 9.5];
const ESPAGNE: LonLat = [-3.5, 40.0];
const ALGERIE: LonLat = [2.61, 28.09];
const MIDPOINT: LonLat = [(NIGERIA[0] + ESPAGNE[0]) / 2, (NIGERIA[1] + ESPAGNE[1]) / 2];
// Algerie n'est qu'a 3.4deg du MIDPOINT Nigeria-Espagne (verifie par calcul geoDistance) : le pivot
// camera existant (frame 300, cf CAM) qui revele "les 2 territoires" cadre donc DEJA correctement les
// 2 cibles sans aucun ajustement de trajectoire camera — pas de 3e cle CAM necessaire.

// --- Amplitude de winding (courbe en S, AAGP SEULEMENT) : amp en degres, waves = nb d'oscillations
// sur le trajet. CORRECTIF (verifie par calcul, cf scratchpad test-winding2.mjs) : l'enveloppe
// sin(t*PI) de windingCircle annule le decalage aux 2 extremites et rend le signe de sin(t*PI*waves)
// MONOTONE tant que waves < 2 -- resultat : une simple bosse asymetrique (1 seul lobe), PAS un S, quelle
// que soit l'amplitude. C'est exactement le rendu obtenu en premiere passe (amp=3.2, waves=1.4) et
// confirme visuellement sur les frames 190/220/280/350 : courbe simple, jamais un vrai S. Il faut
// waves >= 2.2 pour obtenir 2 changements de signe (= 2 inflexions = un vrai S qui part a gauche
// PUIS revient a droite avant d'arriver). amp=6 (double du premier essai) pour que le serpentement
// reste lisible meme au zoom le plus large (scaleMul 1.65 vers 210f, globe petit a l'ecran).
const ARC_AMP = 6;
const ARC_WAVES = 2.3;
const ARC_SAMPLES = 120;

// --- TSGP (Nigeria -> Algerie) : trajet GEOGRAPHIQUEMENT plus court/direct que l'AAGP (19.3deg de
// grand cercle vs 32.2deg pour Nigeria->Espagne, verifie par calcul geoDistance) — coherent avec le
// script ("ligne plus directe a travers le Sahara" vs le detour cotier AAGP). Choix : arcPathD (grand
// cercle DROIT), PAS windingPathD — le serpentement en S du AAGP represente visuellement le long detour
// atlantique ; un trajet plus court et plus direct appelle une ligne plus franche, jamais une ondulation
// qui suggererait a tort un detour similaire. Meme mecanisme de reveal/marker que AAGP (arcPathD/
// pointAlongArc, deja utilises dans SoudanActe3GlobeProto16x9.tsx — rien de reinvente).
const TSGP_SAMPLES = 100;
// Decalage temporel (brief point 3, script Acte 1 : "Meme point de depart. Meme destination. Meme
// urgence. Et pourtant... ces deux projets ne se parlent pas.") : les 2 arcs partent EXACTEMENT au
// meme instant (ARC_START, meme depart = meme urgence) mais le TSGP (plus court, 19.3deg) est plus
// RAPIDE que l'AAGP (32.2deg) sur la MEME fenetre temporelle [ARC_START, ARC_END] — il finit son trace
// nettement AVANT l'AAGP (TSGP_END < ARC_END), pendant que l'AAGP est encore en train de serpenter.
// Cette avance illustre concretement "l'un mise sur la vitesse" (Acte 1, description TSGP) sans avoir
// besoin d'un texte a l'ecran : le trajet direct arrive, l'autre continue son long detour.
const TSGP_END = 360; // finit 60f (~2s) avant ARC_END (420) = arrivee nettement plus rapide, visible

// ===== CAMERA CONTINUE : amplitude ample du proto 2 (1.3 -> 4.4), adaptee au timing 480f + structure
// narrative du proto 1 (ouverture large -> pivot qui revele les 2 territoires -> zoom serre final). =====
const NIGERIA_CAM: LonLat = [NIGERIA[0] - 3, NIGERIA[1] + 3];
const CAM: CamKey[] = [
  // 0-90f (0-3s) : OUVERTURE vue large planetaire (comme proto 2 frame 0, scaleMul 1.3) — on situe
  // le Nigeria dans le systeme avant de foncer dessus.
  { frame: 0, lon: -20, lat: 10, scaleMul: 1.3 },
  // 90-150f (3-5s) : la camera avance et pivote vers le Nigeria, zoom progressif (reprend le rythme
  // proto 2 frame 90 -> 200, scaleMul 2.2 -> 3.0).
  { frame: 150, lon: NIGERIA_CAM[0], lat: NIGERIA_CAM[1], scaleMul: 3.0 },
  // 150-240f (5-8s) : ⭐ NOUVELLE FENETRE HOLD (Aziz 2026-08-02) — 2 keys IDENTIQUES (meme lon/lat/scale)
  // => camAt() interpole entre 2 points egaux = camera STRICTEMENT IMMOBILE. C'est PENDANT ce hold que
  // le continent africain se dessine en fond (cf continentTrace plus bas) — meme regle que Soudan
  // ("les fenetres pivot/trace ne se chevauchent jamais", GlobeRecitProto.tsx L90).
  { frame: 240, lon: NIGERIA_CAM[0], lat: NIGERIA_CAM[1], scaleMul: 3.0 },
  // 240-300f (8-10s) : PIVOT LARGE qui revele les 2 territoires + la courbure (reprend le geste proto 1
  // frame 90, scaleMul 1.5) — jamais figee, l'arc COMMENCE a se tracer ici (cf arcReveal ci-dessous).
  { frame: 300, lon: MIDPOINT[0], lat: MIDPOINT[1] - 6, scaleMul: 1.65 },
  // 300-390f (10-13s) : la camera repart en avant vers l'Espagne PENDANT que l'arc continue de se tracer
  // (jamais figee pendant le tracage, reprend le geste proto 1 frame 165).
  { frame: 390, lon: MIDPOINT[0] - 4, lat: MIDPOINT[1] + 5, scaleMul: 2.6 },
  // 390-480f (13-16s) : ZOOM SERRE FINAL sur la zone Espagne/tracage qui vient d'arriver (amplitude
  // ample du proto 2, scaleMul 4.0+) — le territoire cible s'illumine.
  { frame: 480, lon: ESPAGNE[0] + 2, lat: ESPAGNE[1] - 2, scaleMul: 4.1 },
];

export const ProtoGazoducGlobeFusion: React.FC = () => {
  const frame = useCurrentFrame();

  // ===== CAMERA CONTINUE (jamais figee, cf grep GLOBE_R en bas de fichier) =====
  const cam = camAt(CAM, frame);
  const rotLambda = -cam.lon;
  const rotLat = -cam.lat;
  const globeR = GLOBE_R * cam.scaleMul; // SEULE variable de rayon utilisee pour TOUT dessin de sphere.
  const proj = orthoAt(rotLambda, rotLat).scale(globeR);
  const path = pathOf(proj);
  const visible = (ll: LonLat) => isVisibleGeo(ll, rotLambda, rotLat);

  const sphere = path({ type: "Sphere" } as any) || "";
  const grat = path(GRATICULE as any) || "";
  const feats = worldFeatures();
  const nigeria = featureByName("Nigeria");
  const espagne = featureByName("Spain");
  const algerie = featureByName("Algeria");

  // ===== ARC AAGP en S (windingPathD, PAS arcPathD) — se trace PENDANT le pivot/avancee de camera
  // (240-420f, decale +90f par la fenetre HOLD continent), jamais une fois la camera arretee. =====
  const ARC_START = 240;
  const ARC_END = 420;
  const arcReveal = interpolate(frame, [ARC_START, ARC_END], [0, 1], clampB);
  const arcD = windingPathD(proj, path, NIGERIA, ESPAGNE, arcReveal, ARC_AMP, ARC_WAVES, ARC_SAMPLES);
  const travelT = interpolate(frame, [ARC_START, ARC_END], [0, 1], clampB);
  const marker = frame >= ARC_START && frame <= ARC_END
    ? pointAlongWinding(proj, NIGERIA, ESPAGNE, travelT, visible, ARC_AMP, ARC_WAVES, ARC_SAMPLES)
    : null;

  // ===== ARC TSGP (arcPathD, grand cercle DROIT — PAS windingPathD, cf commentaire TSGP_SAMPLES plus
  // haut) — MEME frame de depart que AAGP (ARC_START, "meme urgence") mais fenetre de reveal plus
  // COURTE (TSGP_END < ARC_END) : le trajet plus court/direct arrive plus vite, illustrant "l'un mise
  // sur la vitesse" sans texte a l'ecran. =====
  const tsgpReveal = interpolate(frame, [ARC_START, TSGP_END], [0, 1], clampB);
  const tsgpD = arcPathD(proj, path, NIGERIA, ALGERIE, tsgpReveal, TSGP_SAMPLES);
  const tsgpTravelT = interpolate(frame, [ARC_START, TSGP_END], [0, 1], clampB);
  const tsgpMarker = frame >= ARC_START && frame <= TSGP_END
    ? pointAlongArc(proj, NIGERIA, ALGERIE, tsgpTravelT, visible)
    : null;

  // ===== NIGERIA : geste "contour se trace PUIS se remplit" (PaysTrace), court et fini AVANT que
  // la camera n'entre dans son HOLD (frame 150) — le pays "nait" a l'ecran avant que le contexte
  // (continent) et le trajet (arc) ne partent.
  // trace = [20, 95] (75f ~ 2.5s, meme duree que TRACE_COURT dans GlobeRecitProto.tsx) ; le fill
  // (drapeau + pulse) suit juste apres, fini avant 150.
  const NIGERIA_TRACE_START = 20;
  const NIGERIA_TRACE_END = 95; // 75f ~ 2.5s
  const nigeriaTrace = interpolate(frame, [NIGERIA_TRACE_START, NIGERIA_TRACE_END], [0, 1], clampB);
  const nigeriaFill = interpolate(frame, [NIGERIA_TRACE_END - 15, NIGERIA_TRACE_END + 20], [0, 1], clampB);
  // le drapeau (GlobeFlagFill) se materialise sur le meme rythme que le remplissage du contour.
  const nigeriaReveal = nigeriaFill;
  const nigeriaPulse = interpolate(frame, [NIGERIA_TRACE_END, NIGERIA_TRACE_END + 40], [1, 0], clampB);

  // ===== CONTINENT AFRICAIN EN FOND (Aziz 2026-08-02) — se dessine PENDANT le HOLD camera [150, 240],
  // juste apres le Nigeria (fill fini a 115), en EFFET DE VAGUE organique : chaque pays est offset par
  // sa distance angulaire REELLE au Nigeria (geoDistance, d3-geo — jamais une valeur inventee a la main).
  // Sous-ensemble limite aux voisins visibles dans le cadre a ce zoom (scaleMul 3.0, cadrage serre sur
  // le Nigeria) plutot que tout le continent (aurait surcharge visuellement a cette echelle, cf brief).
  const CONTINENT_HOLD_START = 150;
  const CONTINENT_HOLD_END = 240;
  // ⚠️ CORRECTIF (verifie par calcul, cf script scratchpad de verification) : la 1ere version demarrait
  // la vague a 105 (avant meme le hold) et le pays le PLUS LOIN finissait a 255 — APRES CONTINENT_HOLD_END
  // (240), donc encore en train de se tracer quand la camera repartait deja vers l'arc. Fix : ancrer le
  // depart PILE sur CONTINENT_HOLD_START et retrecir span+geste pour que meme le pays le plus lointain
  // (waveOffset max 0.65) finisse avec de la marge avant la fin du hold (240).
  const CONTINENT_TRACE_START = CONTINENT_HOLD_START; // 150 — demarre pile quand la camera se pose
  const CONTINENT_TRACE_SPAN = 50; // la vague (departs decales) s'etale sur 50f (~1.7s)
  const CONTINENT_COUNTRIES = [
    "Benin", "Cameroon", "Togo", "Niger", "Ghana", "Burkina Faso",
    "Gabon", "Chad", "Congo", "Central African Rep.", "Côte d'Ivoire", "Mali",
  ];
  const continentFeats = useMemo(() => {
    const set = new Set(CONTINENT_COUNTRIES);
    const withDist = worldFeatures()
      .filter((f) => set.has(f.properties.name))
      .map((f) => {
        const c = geoCentroid(f as any) as LonLat;
        const distDeg = (geoDistance(NIGERIA, c) * 180) / Math.PI;
        return { feat: f, distDeg };
      });
    const maxDist = Math.max(...withDist.map((w) => w.distDeg), 1);
    // offset [0, 1] proportionnel a la distance : le voisin le plus proche part en premier (offset 0),
    // le plus lointain part en dernier (offset max 1 = part a la toute fin du span).
    return withDist.map(({ feat, distDeg }) => ({ feat, waveOffset: distDeg / maxDist }));
  }, []);
  // duree du GESTE de trace de chaque pays — verifie par calcul (cf script scratchpad) que meme le
  // DERNIER pays (waveOffset=1, demarre a CONTINENT_TRACE_START + CONTINENT_TRACE_SPAN = 200) finit
  // (s1=235) AVANT CONTINENT_HOLD_END (240) — 5f de marge, le fond est bien FINI/stable avant que la
  // camera ne reparte vers l'arc (contrainte du brief : jamais de trace de fond encore en mouvement
  // pendant que le pivot commence).
  const CONTINENT_TRACE_GESTURE = 35;

  // ===== ESPAGNE (territoire cible) : meme geste, cale pour que le remplissage arrive a peu pres
  // quand l'arc y arrive (frame 330) — le pays "se construit" PENDANT que le tracé y va, et finit
  // de se remplir juste a l'arrivee (coherence narrative trace<->arc).
  const ESPAGNE_TRACE_START = 255;
  const ESPAGNE_TRACE_END = 330; // 75f ~ 2.5s, fini pile quand l'arc arrive
  const espagneTrace = interpolate(frame, [ESPAGNE_TRACE_START, ESPAGNE_TRACE_END], [0, 1], clampB);
  // FIX bug remplissage instantane (Aziz 2026-08-02) : le remplissage ne doit JAMAIS commencer avant
  // que le contour ait fini de se dessiner (ESPAGNE_TRACE_END), meme principe que `spainFill` dans
  // ProtoGazoducAfriqueComplete.tsx L257-261 (fenetre [T_AAGP_END, T_AAGP_END + 0.9s], jamais avant).
  // Avant ce fix, targetGlow demarrait a ESPAGNE_TRACE_END-18=312, soit 18f AVANT la fin du trace
  // (330) => l'interieur se remplissait pendant que le contour etait encore en dash-offset partiel.
  const espagneFill = interpolate(frame, [ESPAGNE_TRACE_END, ESPAGNE_TRACE_END + 27], [0, 1], clampB);
  const targetGlow = espagneFill; // alias : glow de couleur = meme progression que le remplissage
  const espagnePulse = interpolate(frame, [ESPAGNE_TRACE_END - 25, ESPAGNE_TRACE_END + 20], [0, 1], clampB);

  // ===== ALGERIE (territoire cible TSGP) : MEME mecanisme que Espagne (PaysTrace contour-puis-
  // remplissage + BorderPulse), cale sur TSGP_END (360, pas ARC_END 420) puisque le trace TSGP arrive
  // plus tot que l'AAGP (cf TSGP_END plus haut, "l'un mise sur la vitesse"). =====
  const ALGERIE_TRACE_START = 195;
  const ALGERIE_TRACE_END = TSGP_END; // 360 — fini pile quand le marqueur TSGP arrive
  const algerieTrace = interpolate(frame, [ALGERIE_TRACE_START, ALGERIE_TRACE_END], [0, 1], clampB);
  // meme principe que le fix Espagne : le remplissage ne demarre JAMAIS avant la fin du contour.
  const algerieFill = interpolate(frame, [ALGERIE_TRACE_END, ALGERIE_TRACE_END + 27], [0, 1], clampB);
  const algerieGlow = algerieFill;
  const algeriePulse = interpolate(frame, [ALGERIE_TRACE_END - 25, ALGERIE_TRACE_END + 20], [0, 1], clampB);

  const pNigeria = nigeria ? projectPoint(proj, NIGERIA, visible) : null;
  const pEspagne = espagne ? projectPoint(proj, ESPAGNE, visible) : null;
  const pAlgerie = algerie ? projectPoint(proj, ALGERIE, visible) : null;

  const fadeIn = interpolate(frame, [0, 14], [0, 1], clampB);

  // Champ d'etoiles (repris tel quel de GlobeRecitProto.tsx, Short Soudan 9:16) : PRNG deterministe
  // a seed fixe (jamais Math.random(), casserait la reproductibilite du rendu), 140 points.
  const stars = useMemo(() => {
    let seed = 42;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    return Array.from({ length: 140 }, () => ({
      x: rand() * W,
      y: rand() * H,
      r: 0.6 + rand() * 1.6,
      op: 0.25 + rand() * 0.55,
    }));
  }, []);

  return (
    <AbsoluteFill style={{ background: t.bg }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <g>
            {stars.map((s, i) => (
              <circle key={`star${i}`} cx={s.x} cy={s.y} r={s.r} fill="#F4ECD2" opacity={s.op} />
            ))}
          </g>
          <defs>
            <radialGradient id="pgfAtmo" cx="50%" cy="50%" r="50%">
              <stop offset="80%" stopColor={t.atmoColor} stopOpacity="0" />
              <stop offset="93%" stopColor={t.atmoColor} stopOpacity={t.atmoOpacity + 0.15} />
              <stop offset="100%" stopColor={t.atmoColor} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="pgfOcean" cx="42%" cy="38%" r="70%">
              <stop offset="0%" stopColor={t.oceanInner} />
              <stop offset="70%" stopColor={t.oceanMid} />
              <stop offset="100%" stopColor={t.oceanOuter} />
            </radialGradient>
            <radialGradient id="pgfShade" gradientUnits="userSpaceOnUse"
              cx={W / 2 - globeR * 0.24} cy={H / 2 - globeR * 0.3} r={globeR * 1.35}>
              <stop offset="0%" stopColor="#000" stopOpacity="0" />
              <stop offset="58%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#05070d" stopOpacity="0.5" />
            </radialGradient>
            <clipPath id="pgfSphereClip"><path d={sphere} /></clipPath>
          </defs>

          {/* halo atmospherique + ocean + graticule — tous derives de globeR (jamais GLOBE_R brut) */}
          <circle cx={W / 2} cy={H / 2} r={globeR + 34} fill="url(#pgfAtmo)" />
          <path d={sphere} fill="url(#pgfOcean)" stroke={t.sphereStroke} strokeWidth={1.5} strokeOpacity={0.55} />
          <path d={grat} fill="none" stroke={t.grat} strokeWidth={0.8} strokeOpacity={t.gratOpacity} />

          {/* pays neutres — EXCLUT Nigeria/Espagne/Algerie (geste PaysTrace dedie chacun) ET le
              sous-ensemble CONTINENT_COUNTRIES (geste de fond discret ci-dessous, jamais un fill
              instantane a la frame 0 comme avant — sinon le "continent qui se dessine" n'aurait plus
              rien a reveler). ⛔ CORRECTIF 2026-08-03 : Algerie ajoutee a cette exclusion — sans elle,
              Algerie apparaissait des la frame 0 comme un pays kaki neutre ordinaire (seul le point-
              cible orange la distinguait), au lieu de "naitre" a l'ecran par son propre PaysTrace comme
              l'Espagne. Meme defaut que le "trou ocean/pays" du fix Nigeria plus bas — verifie
              visuellement (frame 60 avant fix : Algerie deja pleine, cf scratchpad algeria_earlycheck.png). */}
          {feats.map((f, i) => {
            const name = f.properties.name;
            if (name === "Nigeria" || name === "Spain" || name === "Algeria") return null;
            if (CONTINENT_COUNTRIES.includes(name)) return null;
            const d = path(f as any);
            if (!d) return null;
            return <path key={i} d={d} fill={t.land} stroke={t.landStroke} strokeWidth={t.borderWidth} strokeOpacity={t.borderOpacity} />;
          })}

          {/* ⭐ FIX DEFAUT 1 (Aziz 2026-08-02, review v3) — "trou" ocean/pays : le Nigeria (et les pays
              CONTINENT_COUNTRIES) etaient EXCLUS a la fois de la boucle ci-dessus ET de tout fond avant
              leur propre PaysTrace (qui renvoie null tant que trace<=0) -> ocean nu visible sous le
              Nigeria de la frame 0 a ~20 (cf frame 60 de la v3, contour Nigeria flottant sur bleu vide
              alors que tout le reste du globe est deja plein). FIX calque sur le principe CFA
              (CfaActe2Carte16x9.tsx L258-265) : UNE base neutre couvrant TOUT le monde AVANT toute
              colorisation specifique, meme famille chromatique que t.land (jamais un gris disjoint).
              Ici : base FIXE (pas de trace, juste un fill discret) des la frame 0 sous Nigeria +
              CONTINENT_COUNTRIES, remplacee visuellement par leur propre PaysTrace qui se dessine PAR-
              DESSUS des que son geste demarre — donc plus jamais de trou, a aucun instant. */}
          {/* ⛔⛔ CORRECTIF CONTRASTE TERRE/OCEAN (2026-08-03, diagnostic precis PAS un changement de theme
              — cf grep RGB : le theme mixte lui-meme est correct, land #B8A578 lit bien "kaki" partout
              ailleurs sur le globe ou il est peint a pleine opacite). Le bug etait un vrai defaut de
              COMPOSITING : fillOpacity=0.16 (ancien) sur fond ocean tres sombre (t.bg #0a1018, oceanMid
              #1f3554) donne un blend RGB (55,71,90) — quasi IDENTIQUE en famille de teinte a l'ocean lui-
              meme (31,53,84) — d'ou la confusion visuelle "ca se fond dans l'ocean", peu importe combien
              on montait l'opacite AVANT ce fix (0.42 au plafond de la vague ne donnait que (95,100,99),
              encore un gris terne, PAS un kaki). Verifie par calcul (script scratchpad blend RGB) : il faut
              >=0.85 pour que le land se distingue clairement de l'ocean (161,148,115 @0.85 vs 176,159,118
              @0.95) — en dessous, le fill mixe optiquement avec le bleu sous-jacent au lieu de lire comme
              une terre. FIX : base quasi-opaque (0.88, proche du plafond mixte 0.95 de la vague ci-dessous)
              — le "discret vs le sujet" (Nigeria) reste assure par l'absence de drapeau/pulse/glow sur ces
              pays, pas par une transparence qui les rend indiscernables de la mer. */}
          {/* Algerie ajoutee ici (2026-08-03, meme correctif que ci-dessus) : maintenant exclue de la
              boucle "pays neutres" (son propre PaysTrace la dessine), elle a besoin de la MEME base
              fixe que Nigeria pour ne jamais laisser de trou ocean nu avant que son trace ne demarre
              (ALGERIE_TRACE_START=195) — jamais de fond nu, meme principe pour toute cible dediee. */}
          {feats.map((f, i) => {
            const name = f.properties.name;
            if (name !== "Nigeria" && name !== "Algeria" && !CONTINENT_COUNTRIES.includes(name)) return null;
            const d = path(f as any);
            if (!d) return null;
            return <path key={`base-${i}`} d={d} fill={t.land} fillOpacity={0.88} stroke={t.landStroke} strokeWidth={t.borderWidth} strokeOpacity={t.borderOpacity} />;
          })}

          {/* CONTINENT AFRICAIN EN FOND — se dessine en VAGUE discrete pendant le HOLD camera
              [150, 240] (cf continentFeats + waveOffset ci-dessus). Opacite plafonnee BIEN EN-DESSOUS
              du Nigeria (0.95) et de l'Espagne (glow) — jamais en concurrence avec le sujet.
              ⭐ FIX DEFAUT 2 (Aziz 2026-08-02, review v3) — la vague etait tracee avec strokeColor
              "#E8D9A8" (creme, OK) mais SANS base fixe en-dessous : sur fond ocean tres sombre
              (t.bg #0a1018), le blend visuel donnait un gris-bleu froid disjoint du kaki chaud du
              reste du monde (delta RGB<15 avec l'ocean, confirme par inspection frame 232 de la v3).
              ⛔⛔ CORRECTIF 2026-08-03 (suite du fix base ci-dessus) : le plafond 0.42 restait BIEN
              EN-DESSOUS du seuil de lisibilite kaki-vs-ocean (il faut >=0.85, cf calcul RGB au fix
              base) — la vague "finissait" toujours en gris-bleu terne, jamais un vrai kaki. Plafond
              remonte a 0.95 (juste sous le Nigeria a 1.0 opaque) : la vague est maintenant un vrai
              RENFORCEMENT visible au-dessus de la base (0.88 -> 0.95, delta faible mais la base
              elle-meme est deja lisible - le "geste" perceptible vient du CONTOUR qui se trace, pas
              d'un saut d'opacite de fill qui n'aurait plus de marge pour etre visible). */}
          {continentFeats.map(({ feat, waveOffset }, i) => {
            const d = path(feat as any);
            if (!d) return null;
            const s0 = CONTINENT_TRACE_START + waveOffset * CONTINENT_TRACE_SPAN;
            const s1 = s0 + CONTINENT_TRACE_GESTURE;
            const trace = interpolate(frame, [s0, s1], [0, 1], clampB);
            // le fill suit le CONTOUR FINI (jamais avant, meme principe que le fix Espagne : le
            // remplissage ne devance jamais le trace).
            // Plafond 0.95 (kaki t.land, cf correctif contraste ci-dessus) : la vague RENFORCE
            // stroke+fill par-dessus une base deja lisible, jamais une couleur a part.
            const fill = interpolate(frame, [s1, s1 + 16], [0, 0.95], clampB);
            return (
              <PaysTrace
                key={`cont-${i}`}
                d={d}
                trace={trace}
                fill={fill}
                fillColor={t.land}
                strokeColor="#E8D9A8"
                strokeW={1.3}
                fillOpacity={1}
                strokeOpacity={0.55}
              />
            );
          })}

          {/* NIGERIA — geste "contour se trace PUIS se remplit" (PaysTrace), puis drapeau + pulse
              (briques GlobeFlagFill/BorderPulse exactes, reutilisees du proto 2) une fois trace fini. */}
          {nigeria && (() => {
            const d = path(nigeria as any);
            if (!d) return null;
            return <PaysTrace d={d} trace={nigeriaTrace} fill={nigeriaFill} fillColor={t.land} strokeColor="#FFC742" strokeW={2.1} />;
          })()}
          {nigeria && <GlobeFlagFill feature={nigeria} proj={proj} path={path} flagCode="ng" reveal={nigeriaReveal} glow="#FFC742" />}
          {nigeria && (() => {
            const d = path(nigeria as any);
            if (!d) return null;
            return <BorderPulse d={d} pulse={nigeriaPulse} color="#FFC742" />;
          })()}

          {/* ESPAGNE — territoire CIBLE : meme geste "contour se trace PUIS se remplit". Le remplissage
              uni (interpolateColor kaki->actif) est remplace par le DRAPEAU reel (GlobeFlagFill, meme
              brique exacte que le Nigeria ligne ~441) — demande Aziz 2026-08-03 : "chaque pays... prend
              la couleur de son drapeau". Le contour PaysTrace reste (silhouette + trait qui se dessine),
              seul le fill interne devient le drapeau, revele au meme rythme que l'ancien fillColor
              (espagneFill), donc AUCUN changement de timing — juste ce qui remplit le contour. */}
          {espagne && (() => {
            const d = path(espagne as any);
            if (!d) return null;
            return (
              <g>
                <PaysTrace d={d} trace={espagneTrace} fill={0} fillColor={t.land} strokeColor={t.landActiveStroke} strokeW={t.borderWidth + 1.2 * targetGlow} />
                <GlobeFlagFill feature={espagne} proj={proj} path={path} flagCode="es" reveal={espagneFill} glow={t.flowGold} />
                <BorderPulse d={d} pulse={espagnePulse} color={t.flowGold} />
              </g>
            );
          })()}

          {/* ALGERIE — territoire CIBLE TSGP : MEME principe que l'Espagne ci-dessus, drapeau algerien
              reel au lieu du remplissage orange uni. Le contour reste teinte TSGP (orange) pour garder
              la differenciation visuelle AAGP/TSGP pendant que le trait se dessine. */}
          {algerie && (() => {
            const d = path(algerie as any);
            if (!d) return null;
            return (
              <g>
                <PaysTrace d={d} trace={algerieTrace} fill={0} fillColor={t.land} strokeColor={TSGP_COLOR} strokeW={t.borderWidth + 1.2 * algerieGlow} />
                <GlobeFlagFill feature={algerie} proj={proj} path={path} flagCode="dz" reveal={algerieFill} glow={TSGP_COLOR} />
                <BorderPulse d={d} pulse={algeriePulse} color={TSGP_COLOR} />
              </g>
            );
          })()}

          {/* ARC en S (windingPathD) Nigeria -> Espagne, ondulation perpendiculaire au grand cercle */}
          {arcD && (
            <>
              <path d={arcD} fill="none" stroke="rgba(10,14,22,0.55)" strokeWidth={6} strokeLinecap="round" opacity={0.6} />
              <path d={arcD} fill="none" stroke={t.flowGold} strokeWidth={11} strokeLinecap="round" opacity={0.18} />
              <path d={arcD} fill="none" stroke={t.flowGold} strokeWidth={4.4} strokeLinecap="round" />
              <path d={arcD} fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round"
                strokeDasharray="7 12" strokeDashoffset={-(frame * 0.9) % 19} opacity={0.55} />
            </>
          )}
          {/* ARC TSGP (arcPathD, grand cercle direct) Nigeria -> Algerie, orange + surcouche pointillee
              PLUS SERREE (dasharray "3 7" vs "7 12" du AAGP) pour differencier visuellement le trace
              direct/sec du trace cotier — meme principe que le tsgpClip pointille de
              ProtoGazoducAfriqueComplete.tsx (surcouche pointillee = signature TSGP a travers les 2
              prototypes). */}
          {tsgpD && (
            <>
              <path d={tsgpD} fill="none" stroke="rgba(10,14,22,0.55)" strokeWidth={6} strokeLinecap="round" opacity={0.6} />
              <path d={tsgpD} fill="none" stroke={TSGP_COLOR} strokeWidth={11} strokeLinecap="round" opacity={0.18} />
              <path d={tsgpD} fill="none" stroke={TSGP_COLOR} strokeWidth={4.4} strokeLinecap="round" />
              <path d={tsgpD} fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round"
                strokeDasharray="3 7" strokeDashoffset={-(frame * 1.3) % 10} opacity={0.6} />
            </>
          )}
          {/* marqueur voyageur dore le long de l'arc AAGP */}
          {marker && (
            <g transform={`translate(${marker.x} ${marker.y})`}>
              <circle r={18} fill={t.flowGold} opacity={0.22} />
              <circle r={11} fill={t.flowGold} opacity={0.35} />
              <circle r={8.5} fill={t.flowGold} stroke="#fff" strokeWidth={2} />
            </g>
          )}
          {/* marqueur voyageur orange le long de l'arc TSGP (plus rapide, cf TSGP_END) */}
          {tsgpMarker && (
            <g transform={`translate(${tsgpMarker.x} ${tsgpMarker.y})`}>
              <circle r={18} fill={TSGP_COLOR} opacity={0.22} />
              <circle r={11} fill={TSGP_COLOR} opacity={0.35} />
              <circle r={8.5} fill={TSGP_COLOR} stroke="#fff" strokeWidth={2} />
            </g>
          )}

          {/* points-source/cible discrets */}
          {pNigeria && <circle cx={pNigeria.x} cy={pNigeria.y} r={5} fill={t.flowGold} stroke={t.landStroke} strokeWidth={1.5} />}
          {pEspagne && <circle cx={pEspagne.x} cy={pEspagne.y} r={5} fill={t.flowGold} stroke={t.landStroke} strokeWidth={1.5} />}
          {pAlgerie && <circle cx={pAlgerie.x} cy={pAlgerie.y} r={5} fill={TSGP_COLOR} stroke={t.landStroke} strokeWidth={1.5} />}

          {/* ombre spherique (volume), clippee a la sphere courante */}
          <rect x={0} y={0} width={W} height={H} fill="url(#pgfShade)" clipPath="url(#pgfSphereClip)" pointerEvents="none" />
        </svg>

        {pNigeria && nigeriaReveal > 0.01 && (
          <div style={{ position: "absolute", left: pNigeria.x, top: pNigeria.y - 40, transform: "translate(-50%,-100%)",
            opacity: nigeriaReveal, color: t.labelFill, fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700,
            textShadow: "0 2px 4px rgba(0,0,0,0.8)", whiteSpace: "nowrap", pointerEvents: "none" }}>
            Nigeria
          </div>
        )}
      </AbsoluteFill>

      {/* diagnostic a l'ecran : scaleMul + globeR courants (verif visuelle rapide, comme proto 2) */}
      <div style={{ position: "absolute", top: 20, left: 20, color: "#fff", fontFamily: "monospace",
        fontSize: 20, background: "rgba(0,0,0,0.5)", padding: "6px 12px", borderRadius: 4 }}>
        frame {frame} | scaleMul {cam.scaleMul.toFixed(2)} | globeR {Math.round(globeR)}px
      </div>

      <SubtitleBarSouverain lines={ACTE1_SUBTITLES} bottomPx={100} />
    </AbsoluteFill>
  );
};

// lerp hex simple (evite color-mix CSS, non garanti en headless — meme recette que les 2 protos).
function interpolateColor(a: string, b: string, p: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * p).toString(16).padStart(2, "0"));
  return `#${c.join("")}`;
}

export default ProtoGazoducGlobeFusion;
