// GazoducActe1Hook — Acte 1 "L'anomalie" (hook), globe D3 orthographique, 84.68s/2540f@30fps.
//
// v4 (2026-08-03, retour Aziz sur v3 apres visionnage complet) — refonte structurelle sur 5 points :
//   1. CAMERA : v3 decoupait 10 fonctions separees par beat (mouvements courts, discontinus) -> perte
//      de l'amplitude/fluidite du prototype valide. FIX : retour au systeme camAt() du prototype
//      (UN SEUL tableau de keyframes CamKey[], interpolation continue sur toute la duree, easeInOut
//      applique au trajet complet entre 2 keys) — les 3 pics ultradynamiques sont des keyframes
//      RAPPROCHEES dans ce meme systeme, pas un mecanisme parallele.
//   2. Pays voisins grisés + vague continentale : retires (Aziz : "ne donne rien, on n'a pas encore
//      parle des pays traverses"). Fond uniforme partout sauf Nigeria.
//   3. Triplet MEME/MEME/MEME : texte a l'ecran + mini-zoom retires (lisait "PowerPoint scolaire",
//      la voix porte deja le rythme). Reste seulement une pulsation caméra tres legere sur chaque mot.
//   4. Drapeaux Espagne/Algerie : retardés jusqu'a l'ARRIVEE du trace correspondant (contour pulse +
//      couleur unie avant, drapeau seulement quand le marqueur voyageur atteint le pays) — restaure
//      la tension/surprise au lieu de spoiler la destination des le beat 3.
//   5. Halo "marche europeen" : remplace par un vrai contour continental Europe qui s'illumine
//      (pas un simple cercle décoratif).
//   6. Distinction des 2 tracés : stagger temporel + head-marker plus visible (recherche Tavily
//      2026-08-03 sur les techniques Johnny Harris/Vox — cf commentaires ARC_START/TSGP_START).
//   7. Labels AAGP/TSGP : ancrés a la TETE du trace mobile (pointAlongWinding/pointAlongArc), pas au
//      pays de destination fixe — le lien label<->trace est immediat des que le trace commence.
//   8. Titre final : typewriter retire ("kitsch", ton different du reste documentaire) -> fade+slide
//      sobre, cohérent avec le registre Souverain.
//
// Base : globeGeo.ts (projection/occlusion), globeCamera.ts (camAt, CamKey), geoArc.ts (tracés/arcs).
// Briques reprises telles quelles du prototype ProtoGazoducGlobeFusion.tsx (PaysTrace, GlobeFlagFill,
// BorderPulse) — cf memory/episodes/souverain/gazoduc-aagp-tsgp/STATUS.md pour l'historique complet.
//
// 10 beats sur 84.68s (2540f) cales sur narration-NEW.alignment.json (mot-a-mot, jamais retape a la
// main) — voir BEAT_T ci-dessous pour les ancrages exacts.
import React, { useMemo } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, interpolate, spring } from "remotion";
import { W, H, GLOBE_R, GRATICULE, worldFeatures, featureByName, orthoAt, pathOf, isVisible as isVisibleGeo } from "../../_rnd/d3-16x9/globeGeo";
import { arcPathD, pointAlongArc, projectPoint, type LonLat } from "../../_rnd/d3-16x9/geoArc";
import { camAt, type CamKey } from "../../_rnd/d3-16x9/globeCamera";
import { THEMES, GlobeFlagFill, BorderPulse } from "../../_rnd/d3-16x9/SoudanActe3GlobeProto16x9";

export const GAZODUC_A1_FRAMES = 2540; // 84.68s @30fps — fin exacte "...gaz africain." (narration-NEW.alignment.json)

const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const t = THEMES.mixte;
// ⭐ FIX ecart chromatique (downstream review 3/3) : #e8834a (orange) trop proche de flowGold
// (#FFC742) sur fond kaki, surtout a l'echelle continentale — les 2 traces se confondaient.
// Corail/rouge brique plus sombre : meme famille chaude (coherence AAGP/TSGP = 2 strategies
// energetiques) mais separation nette en LUMINANCE (pas juste en teinte).
const TSGP_COLOR = "#c1502e";

// --- Geo (coordonnees verifiees, jamais inventees a la main) ---
const NIGERIA: LonLat = [8.0, 9.5];
// ⛔ FIX FACTUEL (2026-08-03, downstream review) : le script verrouille (SCRIPT-V3.md) dit "pour
// finalement atteindre le MAROC" — l'Espagne n'est qu'un pays CLIENT europeen cite plus tard
// (avec France/Italie/Allemagne), jamais la destination du pipeline. L'ancien code utilisait
// ESPAGNE comme destination AAGP (herite du prototype, jamais verifie contre le script) — corrige.
const MAROC: LonLat = [-8.69, 29.82]; // geoCentroid reel (topojson countries-110m.json), jamais invente
const ALGERIE: LonLat = [2.61, 28.09];
const MIDPOINT: LonLat = [(NIGERIA[0] + MAROC[0]) / 2, (NIGERIA[1] + MAROC[1]) / 2];
// Centre europeen (beat 3) : zone-marche a illuminer AVANT les 2 portes individuelles.
const EUROPE_CENTRE: LonLat = [8.0, 48.0]; // centre approx Europe occidentale, visible depuis Nigeria/Maroc/Algerie

// ===== JALONS COTIERS REELS AAGP (Nigeria -> Maroc) — downstream review 3/3 : l'ancien trace en S
// mathematique (windingPathD) ne lisait pas comme cotier, ressemblait a une 2e traversee saharienne
// stylisee. FIX : polyligne via geoCentroid REELS (topojson countries-110m.json, meme dataset que le
// reste du fichier) le long de la facade atlantique — le trace suit la VRAIE geographie, le S devient
// un sous-produit naturel de la cote plutot qu'une ondulation artificielle. =====
const AAGP_JALONS: LonLat[] = [
  NIGERIA,
  [2.34, 9.64],   // Benin
  [-1.24, 7.92],  // Ghana
  [-9.41, 6.43],  // Liberia
  [-11.06, 10.45],// Guinee
  [-14.51, 14.35],// Senegal
  [-10.35, 20.18],// Mauritanie
  MAROC,
];

const TSGP_SAMPLES = 100;

// Pays d'Europe occidentale a illuminer comme "zone-marche" au beat 3 (contour seul, pas de fill
// plein — l'idee est de montrer le CONTINENT comme cible, pas de repeter le geste PaysTrace/drapeau
// deja utilise pour Nigeria/Espagne/Algerie).
const EUROPE_COUNTRIES = [
  "France", "Germany", "Italy", "Portugal", "Belgium", "Netherlands",
  "Switzerland", "Austria", "United Kingdom", "Ireland",
];

// ===== ANCRAGES DE TIMING (frames absolues @30fps) — mot-a-mot narration-NEW.alignment.json =====
const BEAT_T = {
  b1Start: 0, b1End: 225, // 0-7.5s "Imaginez deux immenses tuyaux qui partent du même pays."
  b2Start: 225, b2End: 435, // 7.5-14.5s "Ils partent exactement du même endroit... Nigeria."
  b3Start: 435, b3End: 660, // 14.5-22s "Ils visent... marché européen, qui cherche... fournisseurs de gaz."
  b4Start: 660, b4End: 870, // 22-29s triplet "MÊME point de départ. MÊME destination. MÊME urgence."
  b4Meme1: 660, b4Meme2: 740, b4Meme3: 812, // 3 accents (pulsation caméra seulement, pas de texte)
  b5Start: 870, b5End: 1140, // 29-38s "Et pourtant... ne se parlent pas... aucun kilomètre de trajet."
  b6Start: 1140, b6End: 1410, // 38-47s "guerre silencieuse... un seul... verra vraiment le jour."
  b7Start: 1410, b7End: 1680, // 47-56s diptyque AAGP "L'un a misé... côte atlantique."
  b8Start: 1680, b8End: 1950, // 56-65s diptyque TSGP "L'autre a misé... à travers le Sahara."
  b9Start: 1950, b9End: 2310, // 65-77s tension finale "Un SEUL... course secrète..."
  b10Start: 2310, b10End: 2540, // 77-84.68s titre "Voici la course secrète pour devenir le futur maître du gaz africain."
  // Overlay cout (retour Aziz : meubler le creux 1:08-1:15, fin diptyque TSGP -> debut tension) —
  // chiffres verifies SCRIPT-V3.md ("environ 25 milliards de dollars" AAGP / "environ 13 milliards
  // de dollars" TSGP, "deux fois moins cher") — pas encore prononces a l'Acte 1, mais l'overlay
  // EXPLIQUE EN AVANCE pourquoi "un seul a des chances" sans repeter le texte de la voix (doctrine
  // WARMAP-GRAMMAIRE "overlay = structure, jamais le texte").
  overlayCoutStart: 2040, overlayCoutEnd: 2250, // 68-75s
};

// ===== CAMERA — systeme UNIQUE continu (camAt/CamKey du prototype, PAS 10 fonctions separees).
// Amplitude/fluidite du prototype 16s restaurees : keyframes espacees, easeInOut sur le trajet
// COMPLET entre 2 points (jamais des micro-segments qui repartent d'une position fixe). Les 3 pics
// ultradynamiques (beat 3 pull-back, beat 6 clash, beat 9 tension) sont des paires de keyframes
// RAPPROCHEES dans ce meme tableau (grand ecart de scale/position sur peu de frames) plutot qu'un
// mecanisme separe — exactement le principe du prototype (cf CAM dans ProtoGazoducGlobeFusion.tsx). =====
const B = BEAT_T;
const CAM: CamKey[] = [
  // Beat 1 (0-7.5s) — decouverte Nigeria : ouverture large puis approche ample.
  { frame: 0, lon: NIGERIA[0] - 25, lat: NIGERIA[1] + 15, scaleMul: 1.3 },
  { frame: B.b1End, lon: NIGERIA[0] - 3, lat: NIGERIA[1] + 3, scaleMul: 2.6 },
  // Beat 2 (7.5-14.5s) — origine commune : la camera continue de se rapprocher doucement (hold relatif).
  { frame: B.b2End, lon: NIGERIA[0] - 2, lat: NIGERIA[1] + 2, scaleMul: 2.9 },
  // Beat 3 (14.5-22s) — PIC 1 : pull-back ample et RAPIDE vers l'Europe (keyframe rapprochee = pic).
  { frame: B.b3Start + 45, lon: EUROPE_CENTRE[0], lat: EUROPE_CENTRE[1] - 8, scaleMul: 1.35 },
  { frame: B.b3End, lon: EUROPE_CENTRE[0], lat: EUROPE_CENTRE[1] - 10, scaleMul: 1.5 },
  // Beat 4 (22-29s) — triplet MEME : la camera reste large et stable (pas de mini-zoom par mot,
  // juste une tres legere derive continue geree par easeInOut naturel entre 2 keys espacees).
  { frame: B.b4End, lon: EUROPE_CENTRE[0] - 3, lat: EUROPE_CENTRE[1] - 12, scaleMul: 1.55 },
  // Beat 5 (29-38s) — divergence : la camera redescend vers l'Afrique de l'Ouest, ample, pour suivre
  // les 2 tracés qui commencent a se separer.
  { frame: B.b5End, lon: (NIGERIA[0] + ALGERIE[0]) / 2, lat: (NIGERIA[1] + ALGERIE[1]) / 2 - 3, scaleMul: 1.9 },
  // Beat 6 (38-47s) — PIC 2 clash : recadrage sec et ample sur le Sahara (le "vide" entre les 2 tracés).
  { frame: B.b6Start + 30, lon: MIDPOINT[0] + 4, lat: MIDPOINT[1] - 8, scaleMul: 1.35 },
  { frame: B.b6End, lon: MIDPOINT[0], lat: MIDPOINT[1] - 5, scaleMul: 1.6 },
  // Beat 7 (47-56s) — diptyque AAGP : suivi ample de la cote atlantique vers le Maroc.
  { frame: B.b7End, lon: MAROC[0] + 2, lat: MAROC[1] - 4, scaleMul: 2.3 },
  // Beat 8 (56-65s) — diptyque TSGP : match-cut ample vers l'Algerie/Sahara.
  { frame: B.b8End, lon: ALGERIE[0] - 2, lat: ALGERIE[1] + 3, scaleMul: 2.2 },
  // Beat 9 (65-77s) — PIC 3 tension : push-in ample et rapide sur le systeme complet.
  { frame: B.b9Start + 55, lon: MIDPOINT[0], lat: MIDPOINT[1] - 2, scaleMul: 2.75 },
  { frame: B.b9End, lon: MIDPOINT[0], lat: MIDPOINT[1] - 1, scaleMul: 2.5 },
  // Beat 10 (77-84.68s) — titre : dezoom final ample, vue d'ensemble.
  { frame: B.b10End, lon: MIDPOINT[0], lat: MIDPOINT[1] - 2, scaleMul: 1.7 },
];

// gamma (rotation Z, pour les 2 pics "clash"/"tension") — meme principe camAt mais sur un seul axe,
// tableau separe car camAt() du prototype ne gere pas gamma nativement.
const GAMMA_KEYS: { frame: number; gamma: number }[] = [
  { frame: 0, gamma: 0 },
  { frame: B.b6Start, gamma: 0 },
  { frame: B.b6Start + 24, gamma: 2.5 }, // a-coup du clash
  { frame: B.b6End, gamma: 0 },
  { frame: B.b9Start, gamma: 0 },
  { frame: B.b9Start + 40, gamma: -2.8 }, // a-coup de la tension finale
  { frame: B.b9End, gamma: 0 },
  { frame: B.b10End, gamma: 0 },
];
function gammaAt(frame: number): number {
  if (frame <= GAMMA_KEYS[0].frame) return GAMMA_KEYS[0].gamma;
  const last = GAMMA_KEYS[GAMMA_KEYS.length - 1];
  if (frame >= last.frame) return last.gamma;
  let i = 0;
  while (i < GAMMA_KEYS.length - 1 && GAMMA_KEYS[i + 1].frame <= frame) i++;
  const a = GAMMA_KEYS[i], b2 = GAMMA_KEYS[i + 1];
  const raw = (frame - a.frame) / (b2.frame - a.frame);
  const e = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;
  return a.gamma + (b2.gamma - a.gamma) * e;
}

// Longueur reelle d'un path (jamais d'heuristique — brique reprise telle quelle du prototype).
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

// ─────────────────────────────────────────────────────────────────────────────
// OVERLAY ECHELLE — cartouche plein ecran comparatif AAGP/TSGP (retour Aziz apres downstream
// review : le cartouche financier initial "25 vs 13 Mds$" a ete remis en question — pas encore
// narre a l'Acte 1, ton trop economique alors que l'ouverture ("imaginez deux immenses tuyaux")
// est physique/sensorielle). REMPLACE par l'echelle PHYSIQUE des 2 traces : distance en km,
// chiffres verifies (SCRIPT-V3.md "6900 kilometres" AAGP prononce en Acte 2 ; GAZODUC-MEGAPROJETS-
// SUJET.md "~4128 km" TSGP, source unique a nuancer mais deja dans notre matiere factuelle) —
// rendu comme une regle graduee plutot qu'une barre de cout, echo direct du "imaginez" d'ouverture.
// Pattern structurel repris de Insert50M (Soudan Acte 1) : cartouche + count-up + mini-visuel.
const InsertEchelle: React.FC<{ frame: number; inAt: number; outAt: number }> = ({ frame, inAt, outAt }) => {
  const op = interpolate(frame, [inAt, inAt + 16, outAt - 16, outAt], [0, 1, 1, 0], clampB);
  if (op <= 0) return null;
  const rise = interpolate(frame, [inAt, inAt + 20], [30, 0], clampB);
  const aagpVal = Math.round(interpolate(frame, [inAt + 12, inAt + 66], [0, 6900], clampB));
  const tsgpVal = Math.round(interpolate(frame, [inAt + 12, inAt + 66], [0, 4128], clampB));
  const subOp = interpolate(frame, [inAt + 70, inAt + 90], [0, 1], clampB);
  const barMaxW = 220;
  const aagpBarW = interpolate(frame, [inAt + 12, inAt + 66], [0, barMaxW], clampB);
  const tsgpBarW = interpolate(frame, [inAt + 12, inAt + 66], [0, barMaxW * (4128 / 6900)], clampB);
  return (
    <div style={{ position: "absolute", left: "50%", top: "50%",
      transform: `translate(-50%, calc(-50% + ${rise}px))`, opacity: op, pointerEvents: "none",
      background: "linear-gradient(150deg, #1a2338 0%, #0f1626 100%)",
      border: "2px solid rgba(200,169,81,0.55)", borderRadius: 10, padding: "30px 46px",
      boxShadow: "0 24px 70px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.08)",
      fontFamily: "Georgia, serif", minWidth: 420 }}>
      <div style={{ fontSize: 15, letterSpacing: 3, color: "#9fb2cf", textTransform: "uppercase", marginBottom: 22, fontFamily: "'IBM Plex Mono', monospace" }}>
        Deux routes, deux longueurs
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: t.flowGold, width: 60, fontFamily: "'IBM Plex Mono', monospace" }}>AAGP</span>
        {/* graduations (regle) — echo visuel du "imaginez ces tuyaux" plutot qu'une barre de cout */}
        <div style={{ position: "relative", height: 22, width: aagpBarW, background: t.flowGold, borderRadius: 3, boxShadow: `0 0 12px ${t.flowGold}80`,
          backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.25) 0 2px, transparent 2px 28px)" }} />
        <span style={{ fontSize: 34, fontWeight: 800, color: "#f2ebd9" }}>{aagpVal.toLocaleString("fr-FR")} km</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: TSGP_COLOR, width: 60, fontFamily: "'IBM Plex Mono', monospace" }}>TSGP</span>
        <div style={{ position: "relative", height: 22, width: tsgpBarW, background: TSGP_COLOR, borderRadius: 3, boxShadow: `0 0 12px ${TSGP_COLOR}80`,
          backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.25) 0 2px, transparent 2px 28px)" }} />
        <span style={{ fontSize: 34, fontWeight: 800, color: "#f2ebd9" }}>{tsgpVal.toLocaleString("fr-FR")} km</span>
      </div>
      <div style={{ fontSize: 16, letterSpacing: 1, color: "#c8a951", marginTop: 20, opacity: subOp,
        borderTop: "1px solid rgba(200,169,81,0.3)", paddingTop: 14, fontFamily: "'IBM Plex Mono', monospace" }}>
        UN LONG DÉTOUR CONTRE UNE LIGNE DIRECTE
      </div>
    </div>
  );
};

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

export const GazoducActe1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const camRaw = camAt(CAM, frame);
  const gamma = gammaAt(frame);
  const cam = { ...camRaw, gamma };

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
  const maroc = featureByName("Morocco");
  const algerie = featureByName("Algeria");

  // ===== ARC AAGP COTIER (Nigeria -> Maroc, via jalons reels) : se trace pendant beat 5-7. STAGGER
  // (point 6, recherche Tavily) : demarre 12f (~0.4s) APRES le TSGP. FIX cotier (downstream review
  // 3/3) : compose de N segments arcPathD CHAINES sur les jalons AAGP_JALONS (grand cercle entre
  // chaque paire de points reels) au lieu d'un seul windingPathD mathematique — le trace SUIT la vraie
  // facade atlantique, le S emerge naturellement de la courbure cote au lieu d'etre une ondulation
  // stylisee. Chaque segment a sa propre fenetre de reveal (proportionnelle a sa longueur angulaire),
  // revele successivement — jamais tous en meme temps (= toujours "en cours de dessin"). =====
  const TSGP_START = BEAT_T.b5Start;
  const ARC_START = BEAT_T.b5Start + 12;
  const ARC_END = BEAT_T.b7End;
  const aagpSegLengths = useMemo(() => {
    const lens: number[] = [];
    for (let i = 0; i < AAGP_JALONS.length - 1; i++) {
      const [lon1, lat1] = AAGP_JALONS[i], [lon2, lat2] = AAGP_JALONS[i + 1];
      lens.push(Math.hypot(lon2 - lon1, lat2 - lat1)); // approx plane, suffisant pour repartir le temps
    }
    return lens;
  }, []);
  const aagpTotalLen = aagpSegLengths.reduce((a, b) => a + b, 0);
  // fraction cumulee [0..1] du parcours total au debut de chaque segment
  const aagpSegStarts = useMemo(() => {
    const starts: number[] = [0];
    let acc = 0;
    for (const len of aagpSegLengths) { acc += len; starts.push(acc / aagpTotalLen); }
    return starts;
  }, [aagpSegLengths, aagpTotalLen]);
  const arcGlobalT = interpolate(frame, [ARC_START, ARC_END], [0, 1], clampB);
  const arcSegments = AAGP_JALONS.slice(0, -1).map((a, i) => {
    const b = AAGP_JALONS[i + 1];
    const segT0 = aagpSegStarts[i], segT1 = aagpSegStarts[i + 1];
    const segReveal = interpolate(arcGlobalT, [segT0, segT1], [0, 1], clampB);
    const d = arcPathD(proj, path, a, b, segReveal, Math.max(20, Math.round(TSGP_SAMPLES * (segT1 - segT0))));
    return { d, segT0, segT1, a, b };
  });
  const arcD = arcSegments.map((s) => s.d).filter(Boolean).join(" ");
  // position du marqueur voyageur : trouver le segment actif selon arcGlobalT
  const marker = (() => {
    if (arcGlobalT <= 0 || arcGlobalT >= 1 && frame > ARC_END) return null;
    const seg = arcSegments.find((s) => arcGlobalT >= s.segT0 && arcGlobalT <= s.segT1) ?? arcSegments[arcSegments.length - 1];
    const localT = seg.segT1 > seg.segT0 ? (arcGlobalT - seg.segT0) / (seg.segT1 - seg.segT0) : 1;
    return frame >= ARC_START && frame <= ARC_END
      ? pointAlongArc(proj, seg.a, seg.b, localT, visible)
      : null;
  })();

  // ===== ARC TSGP (Nigeria -> Algerie, grand cercle direct) : part LE PREMIER (stagger), finit aussi
  // le premier (trajet plus court, "l'un mise sur la vitesse") — cale sur fin beat 8.
  const TSGP_END = BEAT_T.b8End - 90;
  const tsgpReveal = interpolate(frame, [TSGP_START, TSGP_END], [0, 1], clampB);
  const tsgpD = arcPathD(proj, path, NIGERIA, ALGERIE, tsgpReveal, TSGP_SAMPLES);
  const tsgpTravelT = interpolate(frame, [TSGP_START, TSGP_END], [0, 1], clampB);
  const tsgpMarker = frame >= TSGP_START && frame <= TSGP_END
    ? pointAlongArc(proj, NIGERIA, ALGERIE, tsgpTravelT, visible)
    : null;

  // ===== NIGERIA : contour se trace LENTEMENT (10s, "presque hypnotisant" — retour Aziz) puis se
  // remplit. Etale sur les beats 1+2 entiers (0-14.5s) plutot que fini en 4.3s comme avant — le
  // contour reste le point d'ancrage visuel pendant que la camera approche. Pulse renforce (2 ondes
  // au lieu d'une seule, amplitude/duree superieures) pour un effet plus marque a l'arrivee. =====
  const NIGERIA_TRACE_START = 15;
  const NIGERIA_TRACE_END = 315; // 10s de trace (etait 130 = 4.3s)
  const nigeriaTrace = interpolate(frame, [NIGERIA_TRACE_START, NIGERIA_TRACE_END], [0, 1], clampB);
  const nigeriaFill = interpolate(frame, [NIGERIA_TRACE_END - 20, NIGERIA_TRACE_END + 30], [0, 1], clampB);
  const nigeriaReveal = nigeriaFill;
  const nigeriaPulse = interpolate(frame, [NIGERIA_TRACE_END, NIGERIA_TRACE_END + 60], [1, 0], clampB);
  const nigeriaPulse2 = interpolate(frame, [NIGERIA_TRACE_END + 25, NIGERIA_TRACE_END + 85], [1, 0], clampB);

  // ===== MAROC (porte AAGP) — contour PULSE + couleur unie des le beat 3 (identification du pays),
  // mais le DRAPEAU n'apparait qu'a l'ARRIVEE du marqueur voyageur (point 4, retour Aziz : "garder la
  // surprise, drapeau seulement quand le trace atteint le pays" — plus l'ancien reveal a ~20s qui
  // spoilait tout). Le contour trace tot pour l'identification geo, le fill drapeau vient a la fin. =====
  const MAROC_TRACE_START = BEAT_T.b3Start + 60;
  const MAROC_TRACE_END = BEAT_T.b3Start + 150;
  const marocTrace = interpolate(frame, [MAROC_TRACE_START, MAROC_TRACE_END], [0, 1], clampB);
  const marocPulseIdent = interpolate(frame, [MAROC_TRACE_END - 25, MAROC_TRACE_END + 20], [0, 1], clampB);
  // Drapeau : reveal seulement dans la derniere portion du trajet AAGP (le marqueur "arrive").
  const AAGP_ARRIVAL_START = ARC_END - 45;
  const marocFlagReveal = interpolate(frame, [AAGP_ARRIVAL_START, ARC_END], [0, 1], clampB);
  const marocPulseArrival = interpolate(frame, [ARC_END - 20, ARC_END + 25], [0, 1], clampB);

  // ===== ALGERIE (porte TSGP) — MEME principe : contour identifie tot, drapeau seulement a l'arrivee
  // du trace (cale sur TSGP_END, plus tot que l'AAGP car le trajet est plus court).
  const ALGERIE_TRACE_START = BEAT_T.b3Start + 60;
  const ALGERIE_TRACE_END = BEAT_T.b3Start + 150;
  const algerieTrace = interpolate(frame, [ALGERIE_TRACE_START, ALGERIE_TRACE_END], [0, 1], clampB);
  const algeriePulseIdent = interpolate(frame, [ALGERIE_TRACE_END - 25, ALGERIE_TRACE_END + 20], [0, 1], clampB);
  const TSGP_ARRIVAL_START = TSGP_END - 35;
  const algerieFlagReveal = interpolate(frame, [TSGP_ARRIVAL_START, TSGP_END], [0, 1], clampB);
  const algeriePulseArrival = interpolate(frame, [TSGP_END - 15, TSGP_END + 20], [0, 1], clampB);

  // ===== EUROPE (zone-marche, beat 3) — contour continental qui s'illumine (point 5), pas un cercle
  // decoratif : chaque pays d'EUROPE_COUNTRIES recoit un stroke qui pulse, ensemble ils dessinent la
  // silhouette du "marche europeen" comme cible commune AVANT que les 2 portes ne soient identifiees.
  const europeGlowReveal = interpolate(
    frame,
    [BEAT_T.b3Start + 10, BEAT_T.b3Start + 50, BEAT_T.b3End - 30, BEAT_T.b3End - 5],
    [0, 1, 1, 0],
    clampB
  );
  const europePulse = interpolate((frame - BEAT_T.b3Start) % 50, [0, 25, 50], [0.5, 0.9, 0.5], clampB);
  const europeFeats = useMemo(() => {
    const set = new Set(EUROPE_COUNTRIES);
    return worldFeatures().filter((f) => set.has(f.properties.name));
  }, []);
  // ⭐ RAPPEL HALO EUROPE aux arrivees (downstream review 3/3 : "meme destination" reste ambigu vu
  // qu'AAGP arrive au Maroc et TSGP en Algerie — sans rappel, le spectateur peut lire 2 destinations
  // rivales). Reactivation BRIEVE et ATTENUEE (jamais aussi forte que le beat 3) au moment ou chaque
  // marqueur atteint sa porte, pour rappeler visuellement "cette porte -> le meme marche commun".
  const europeRecallAAGP = interpolate(frame, [ARC_END - 10, ARC_END + 15, ARC_END + 55, ARC_END + 80], [0, 1, 1, 0], clampB);
  const europeRecallTSGP = interpolate(frame, [TSGP_END - 10, TSGP_END + 15, TSGP_END + 55, TSGP_END + 80], [0, 1, 1, 0], clampB);
  const europeRecallReveal = Math.max(europeRecallAAGP, europeRecallTSGP) * 0.45; // toujours plus faible que le beat 3

  const pNigeria = nigeria ? projectPoint(proj, NIGERIA, visible) : null;
  const pMaroc = maroc ? projectPoint(proj, MAROC, visible) : null;
  const pAlgerie = algerie ? projectPoint(proj, ALGERIE, visible) : null;

  const fadeIn = interpolate(frame, [0, 14], [0, 1], clampB);

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

  // ===== LABELS AAGP/TSGP — ancres a la TETE du trace mobile (point 7, recherche Tavily), pas au
  // pays de destination fixe. Suivent le marqueur voyageur des que le trace demarre, avec un leger
  // delai d'entree (spring) — le lien label<->trace est immediat, pas seulement visible au beat 7/8. =====
  const aagpLabelOpacity = interpolate(frame, [ARC_START + 20, ARC_START + 45], [0, 1], clampB);
  const tsgpLabelOpacity = interpolate(frame, [TSGP_START + 20, TSGP_START + 45], [0, 1], clampB);
  // Sous-texte explicatif visible ~2.5s a la 1ere apparition seulement (downstream review 3/3).
  const aagpFirstLabelOpacity = interpolate(frame, [ARC_START + 45, ARC_START + 65, ARC_START + 120, ARC_START + 140], [0, 1, 1, 0], clampB);
  const tsgpFirstLabelOpacity = interpolate(frame, [TSGP_START + 45, TSGP_START + 65, TSGP_START + 120, TSGP_START + 140], [0, 1, 1, 0], clampB);

  // ===== BEAT 10 — TITRE final : fade + slide sobre (point 8, typewriter retire — jugé kitsch,
  // ton "hacker" incoherent avec le registre documentaire premium du reste de l'acte).
  const titleActive = frame >= BEAT_T.b10Start;
  const titleLocal = frame - BEAT_T.b10Start;
  const titleOpacity = interpolate(titleLocal, [10, 40], [0, 1], clampB);
  const titleSlide = interpolate(titleLocal, [10, 50], [24, 0], clampB);
  const TITLE_TEXT = "LA COURSE SECRÈTE DU GAZ AFRICAIN";

  return (
    <AbsoluteFill style={{ background: t.bg }}>
      <Audio src={staticFile("souverain/gazoduc-aagp-tsgp/audio/narration.mp3")} />
      <AbsoluteFill style={{ opacity: fadeIn }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <g>
            {stars.map((s, i) => (
              <circle key={`star${i}`} cx={s.x} cy={s.y} r={s.r} fill="#F4ECD2" opacity={s.op} />
            ))}
          </g>
          <defs>
            <radialGradient id="a1Atmo" cx="50%" cy="50%" r="50%">
              <stop offset="80%" stopColor={t.atmoColor} stopOpacity="0" />
              <stop offset="93%" stopColor={t.atmoColor} stopOpacity={t.atmoOpacity + 0.15} />
              <stop offset="100%" stopColor={t.atmoColor} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="a1Ocean" cx="42%" cy="38%" r="70%">
              <stop offset="0%" stopColor={t.oceanInner} />
              <stop offset="70%" stopColor={t.oceanMid} />
              <stop offset="100%" stopColor={t.oceanOuter} />
            </radialGradient>
            <radialGradient id="a1Shade" gradientUnits="userSpaceOnUse"
              cx={W / 2 - globeR * 0.24} cy={H / 2 - globeR * 0.3} r={globeR * 1.35}>
              <stop offset="0%" stopColor="#000" stopOpacity="0" />
              <stop offset="58%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#05070d" stopOpacity="0.5" />
            </radialGradient>
            <clipPath id="a1SphereClip"><path d={sphere} /></clipPath>
          </defs>

          <g transform={`rotate(${cam.gamma} ${W / 2} ${H / 2})`}>
            <circle cx={W / 2} cy={H / 2} r={globeR + 34} fill="url(#a1Atmo)" />
            <path d={sphere} fill="url(#a1Ocean)" stroke={t.sphereStroke} strokeWidth={1.5} strokeOpacity={0.55} />
            <path d={grat} fill="none" stroke={t.grat} strokeWidth={0.8} strokeOpacity={t.gratOpacity} />

            {/* pays neutres — fond UNIFORME partout (point 2 : plus de grisage/vague continentale,
                Aziz : "ne donne rien, on n'a pas encore parle des pays traverses"). Exclut seulement
                Nigeria/Maroc/Algerie (gestes dedies). */}
            {feats.map((f, i) => {
              const name = f.properties.name;
              if (name === "Nigeria" || name === "Spain" || name === "Algeria") return null;
              const d = path(f as any);
              if (!d) return null;
              return <path key={i} d={d} fill={t.land} stroke={t.landStroke} strokeWidth={t.borderWidth} strokeOpacity={t.borderOpacity} />;
            })}

            {/* base fixe kaki quasi-opaque sous Nigeria/Maroc/Algerie — jamais de trou ocean nu
                avant leur propre PaysTrace (seuil >=0.85 verifie, cf commentaires prototype).
                ⛔ FIX (retour Aziz apres v4b) : Nigeria avait ete omis de cette base fixe lors du
                retrait du grisage voisins -> ocean bleu visible SOUS le contour Nigeria pendant les
                15-130 premieres frames (avant que trace+fill ne le couvrent), verifie sur capture. */}
            {nigeria && (() => {
              const d = path(nigeria as any);
              if (!d) return null;
              return <path d={d} fill={t.land} fillOpacity={0.88} stroke={t.landStroke} strokeWidth={t.borderWidth} strokeOpacity={t.borderOpacity} />;
            })()}
            {maroc && (() => {
              const d = path(maroc as any);
              if (!d) return null;
              return <path d={d} fill={t.land} fillOpacity={0.88} stroke={t.landStroke} strokeWidth={t.borderWidth} strokeOpacity={t.borderOpacity} />;
            })()}
            {algerie && (() => {
              const d = path(algerie as any);
              if (!d) return null;
              return <path d={d} fill={t.land} fillOpacity={0.88} stroke={t.landStroke} strokeWidth={t.borderWidth} strokeOpacity={t.borderOpacity} />;
            })()}

            {/* EUROPE — "mask reveal" (technique Johnny Harris, recherche Tavily 2026-08-03) : ASSOMBRIR
                tout le reste du globe pour que l'Europe ressorte clairement comme cible, plutot qu'un
                simple contour qui pulse noye dans le reste (retour Aziz : "vu de loin, le glow ne
                permet pas de voir qu'on parle vraiment de l'Europe"). Voile sombre global PUIS les
                pays europeens sont redessines PAR-DESSUS avec leur couleur normale + glow — ils
                "percent" a travers le voile. europeReveal = max(beat 3 fort, rappel aux arrivees
                attenue) — le meme mecanisme sert aux 2 moments, juste avec une intensite differente. */}
            {(() => {
              const europeReveal = Math.max(europeGlowReveal, europeRecallReveal);
              if (europeReveal <= 0.01) return null;
              return (
                <>
                  <rect x={0} y={0} width={W} height={H} fill="#05070d" opacity={europeReveal * 0.6} clipPath="url(#a1SphereClip)" />
                  {europeFeats.map((f, i) => {
                    const d = path(f as any);
                    if (!d) return null;
                    return (
                      <path key={`eu-${i}`} d={d} fill={t.land} fillOpacity={europeReveal}
                        stroke={t.flowGold} strokeWidth={1.8 + europePulse * 1.2} strokeOpacity={europeReveal * europePulse} />
                    );
                  })}
                  {/* glow SANS filter:blur CSS (interdit projet) — halo large+transparent superpose
                      a un second trait plus fin, meme technique que le glow des arcs AAGP/TSGP
                      (strokeWidth 11/opacity 0.18 puis strokeWidth 4.4 plein, plus bas dans ce fichier) */}
                  {europeFeats.map((f, i) => {
                    const d = path(f as any);
                    if (!d) return null;
                    return (
                      <path key={`eu-glow-${i}`} d={d} fill="none"
                        stroke={t.flowGold} strokeWidth={9} strokeOpacity={europeReveal * europePulse * 0.18} />
                    );
                  })}
                  {europeFeats.map((f, i) => {
                    const d = path(f as any);
                    if (!d) return null;
                    return (
                      <path key={`eu-glow2-${i}`} d={d} fill="none"
                        stroke={t.flowGold} strokeWidth={5} strokeOpacity={europeReveal * europePulse * 0.35} />
                    );
                  })}
                </>
              );
            })()}

            {/* NIGERIA — contour lent+hypnotisant (10s), pulse double (2 ondes) a l'arrivee du trace. */}
            {nigeria && (() => {
              const d = path(nigeria as any);
              if (!d) return null;
              return <PaysTrace d={d} trace={nigeriaTrace} fill={nigeriaFill} fillColor={t.land} strokeColor="#FFC742" strokeW={2.6} />;
            })()}
            {nigeria && <GlobeFlagFill feature={nigeria} proj={proj} path={path} flagCode="ng" reveal={nigeriaReveal} glow="#FFC742" />}
            {nigeria && (() => {
              const d = path(nigeria as any);
              if (!d) return null;
              return (
                <>
                  <BorderPulse d={d} pulse={nigeriaPulse} color="#FFC742" />
                  <BorderPulse d={d} pulse={nigeriaPulse2} color="#FFC742" />
                </>
              );
            })()}

            {/* MAROC — contour+couleur unie des l'identification (beat 3), DRAPEAU seulement a
                l'arrivee du trace AAGP (point 4 : restaure la surprise). */}
            {maroc && (() => {
              const d = path(maroc as any);
              if (!d) return null;
              return (
                <g>
                  <PaysTrace d={d} trace={marocTrace} fill={marocFlagReveal > 0.01 ? 0 : marocTrace} fillColor={t.landActive ?? t.land} strokeColor={t.landActiveStroke} strokeW={t.borderWidth + 1.2 * marocPulseIdent} />
                  {marocFlagReveal > 0.01 && <GlobeFlagFill feature={maroc} proj={proj} path={path} flagCode="ma" reveal={marocFlagReveal} glow={t.flowGold} />}
                  <BorderPulse d={d} pulse={marocPulseIdent} color={t.flowGold} />
                  <BorderPulse d={d} pulse={marocPulseArrival} color={t.flowGold} />
                </g>
              );
            })()}

            {/* ALGERIE — meme principe : contour identifie tot, drapeau a l'arrivee du trace TSGP. */}
            {algerie && (() => {
              const d = path(algerie as any);
              if (!d) return null;
              return (
                <g>
                  <PaysTrace d={d} trace={algerieTrace} fill={algerieFlagReveal > 0.01 ? 0 : algerieTrace} fillColor={t.land} strokeColor={TSGP_COLOR} strokeW={t.borderWidth + 1.2 * algeriePulseIdent} />
                  {algerieFlagReveal > 0.01 && <GlobeFlagFill feature={algerie} proj={proj} path={path} flagCode="dz" reveal={algerieFlagReveal} glow={TSGP_COLOR} />}
                  <BorderPulse d={d} pulse={algeriePulseIdent} color={TSGP_COLOR} />
                  <BorderPulse d={d} pulse={algeriePulseArrival} color={TSGP_COLOR} />
                </g>
              );
            })()}

            {/* ARC TSGP direct — part LE PREMIER (stagger, point 6) */}
            {tsgpD && (
              <>
                <path d={tsgpD} fill="none" stroke="rgba(10,14,22,0.55)" strokeWidth={6} strokeLinecap="round" opacity={0.6} />
                <path d={tsgpD} fill="none" stroke={TSGP_COLOR} strokeWidth={11} strokeLinecap="round" opacity={0.18} />
                <path d={tsgpD} fill="none" stroke={TSGP_COLOR} strokeWidth={4.4} strokeLinecap="round" />
                <path d={tsgpD} fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round"
                  strokeDasharray="3 7" strokeDashoffset={-(frame * 1.3) % 10} opacity={0.6} />
              </>
            )}
            {/* ARC AAGP en S — part 12f apres (stagger) */}
            {arcD && (
              <>
                <path d={arcD} fill="none" stroke="rgba(10,14,22,0.55)" strokeWidth={6} strokeLinecap="round" opacity={0.6} />
                <path d={arcD} fill="none" stroke={t.flowGold} strokeWidth={11} strokeLinecap="round" opacity={0.18} />
                <path d={arcD} fill="none" stroke={t.flowGold} strokeWidth={4.4} strokeLinecap="round" />
                <path d={arcD} fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round"
                  strokeDasharray="7 12" strokeDashoffset={-(frame * 0.9) % 19} opacity={0.55} />
              </>
            )}
            {/* marqueur voyageur TSGP — plus visible (head-marker renforce, point 6) */}
            {tsgpMarker && (
              <g transform={`translate(${tsgpMarker.x} ${tsgpMarker.y})`}>
                <circle r={22} fill={TSGP_COLOR} opacity={0.18} />
                <circle r={14} fill={TSGP_COLOR} opacity={0.32} />
                <circle r={9.5} fill={TSGP_COLOR} stroke="#fff" strokeWidth={2.4} />
              </g>
            )}
            {/* marqueur voyageur AAGP */}
            {marker && (
              <g transform={`translate(${marker.x} ${marker.y})`}>
                <circle r={22} fill={t.flowGold} opacity={0.18} />
                <circle r={14} fill={t.flowGold} opacity={0.32} />
                <circle r={9.5} fill={t.flowGold} stroke="#fff" strokeWidth={2.4} />
              </g>
            )}

            {/* points-source/cible discrets */}
            {pNigeria && <circle cx={pNigeria.x} cy={pNigeria.y} r={5} fill={t.flowGold} stroke={t.landStroke} strokeWidth={1.5} />}
            {pMaroc && <circle cx={pMaroc.x} cy={pMaroc.y} r={5} fill={t.flowGold} stroke={t.landStroke} strokeWidth={1.5} />}
            {pAlgerie && <circle cx={pAlgerie.x} cy={pAlgerie.y} r={5} fill={TSGP_COLOR} stroke={t.landStroke} strokeWidth={1.5} />}

            <rect x={0} y={0} width={W} height={H} fill="url(#a1Shade)" clipPath="url(#a1SphereClip)" pointerEvents="none" />
          </g>
        </svg>

        {/* NIGERIA — meme style geoplaque que AAGP/TSGP (retour Aziz : coherence visuelle, plus de
            texte brut). Visible jusqu'au beat 3 (avant que la camera ne s'eloigne vers l'Europe). */}
        {pNigeria && nigeriaReveal > 0.01 && frame < BEAT_T.b3Start && (
          <div style={{ position: "absolute", left: pNigeria.x, top: pNigeria.y - 40, transform: "translate(-50%,-100%)",
            opacity: nigeriaReveal, background: "rgba(0,0,0,0.72)", border: "1.5px solid #FFC742",
            borderRadius: 6, padding: "4px 12px", color: "#f2ebd9", fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 16, fontWeight: 700, letterSpacing: 2, whiteSpace: "nowrap", pointerEvents: "none" }}>
            NIGERIA
          </div>
        )}

        {/* AAGP/TSGP — ancres a la TETE du trace mobile (point 7), suivent le marqueur voyageur.
            ⛔ FIX collision (verifie sur render v4, 2026-08-03) : les 2 marqueurs passent proches
            l'un de l'autre (tracés partis du meme point Nigeria) -> labels superposes/illisibles a
            32-40s. Detection simple : si distance écran < seuil, on écarte le label TSGP plus haut
            (au-dessus de l'AAGP) avec une leader line qui garde le lien visuel avec son marqueur. */}
        {(() => {
          if (!tsgpMarker && !marker) return null;
          const dx = tsgpMarker && marker ? tsgpMarker.x - marker.x : Infinity;
          const dy = tsgpMarker && marker ? tsgpMarker.y - marker.y : Infinity;
          const dist = Math.hypot(dx, dy);
          const collide = dist < 90;
          const tsgpLabelY = collide && tsgpMarker ? tsgpMarker.y - 74 : (tsgpMarker ? tsgpMarker.y - 34 : 0);
          return (
            <>
              {tsgpMarker && tsgpLabelOpacity > 0.01 && (
                <>
                  {collide && (
                    <svg style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", overflow: "visible" }}>
                      <line x1={tsgpMarker.x} y1={tsgpMarker.y - 12} x2={tsgpMarker.x} y2={tsgpLabelY + 14}
                        stroke={TSGP_COLOR} strokeWidth={1} opacity={tsgpLabelOpacity * 0.7} />
                    </svg>
                  )}
                  <div style={{ position: "absolute", left: tsgpMarker.x, top: tsgpLabelY, transform: "translate(-50%,-100%)",
                    opacity: tsgpLabelOpacity, background: "rgba(0,0,0,0.72)", border: `1.5px solid ${TSGP_COLOR}`,
                    borderRadius: 6, padding: "4px 12px", color: "#f2ebd9", fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 16, fontWeight: 700, letterSpacing: 2, whiteSpace: "nowrap", pointerEvents: "none",
                    textAlign: "center" }}>
                    TSGP
                    {/* explicite SEULEMENT a la 1ere apparition (downstream review 3/3 : acronyme jamais
                        prononce par la voix) — sous-texte qui fade out apres ~2.5s, laisse l'acronyme seul. */}
                    {tsgpFirstLabelOpacity > 0.01 && (
                      <div style={{ fontSize: 10, fontWeight: 400, letterSpacing: 1, color: "#c9a877",
                        marginTop: 2, opacity: tsgpFirstLabelOpacity }}>
                        ROUTE SAHARIENNE
                      </div>
                    )}
                  </div>
                </>
              )}
              {marker && aagpLabelOpacity > 0.01 && (
                <div style={{ position: "absolute", left: marker.x, top: marker.y - 34, transform: "translate(-50%,-100%)",
                  opacity: aagpLabelOpacity, background: "rgba(0,0,0,0.72)", border: `1.5px solid ${t.flowGold}`,
                  borderRadius: 6, padding: "4px 12px", color: "#f2ebd9", fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 16, fontWeight: 700, letterSpacing: 2, whiteSpace: "nowrap", pointerEvents: "none",
                  textAlign: "center" }}>
                  AAGP
                  {aagpFirstLabelOpacity > 0.01 && (
                    <div style={{ fontSize: 10, fontWeight: 400, letterSpacing: 1, color: "#c9a877",
                      marginTop: 2, opacity: aagpFirstLabelOpacity }}>
                      ROUTE ATLANTIQUE
                    </div>
                  )}
                </div>
              )}
            </>
          );
        })()}

        {/* OVERLAY ECHELLE — meuble le creux 68-75s (fin diptyque TSGP -> debut tension, camera
            relativement statique). Cf InsertEchelle plus haut. */}
        <InsertEchelle frame={frame} inAt={BEAT_T.overlayCoutStart} outAt={BEAT_T.overlayCoutEnd} />

        {/* TITRE FINAL — fade + slide sobre (point 8, typewriter retire) */}
        {titleActive && (
          <div style={{ position: "absolute", left: 0, right: 0, top: "50%", transform: `translateY(calc(-50% + ${titleSlide}px))`,
            textAlign: "center", padding: "0 120px", pointerEvents: "none", opacity: titleOpacity }}>
            <div style={{ color: t.labelFill, fontFamily: "Georgia, serif", fontSize: 58, fontWeight: 700,
              letterSpacing: 2, lineHeight: 1.15, textShadow: "0 4px 12px rgba(0,0,0,0.9)" }}>
              {TITLE_TEXT}
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default GazoducActe1Hook;
