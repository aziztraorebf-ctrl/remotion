// ACTE 4 — BEATS 1 A 4 FUSIONNES "Meme les voisins sont aspires" — GLOBE D3 CONTINU (16:9).
//
// Fusionne SoudanActe4B1B2Globe.tsx + SoudanActe4B3Globe.tsx + SoudanActe4B4Nil.tsx en UNE SEULE
// composition, MEME discipline que les Actes 5/6 (deja continus) : une camera CONTINUE (camAt sur
// TOUTE la plage de frames, jamais de segmentation if/else) qui traverse les 4 beats, et chaque
// element gouverne par `frame >= jalon` -> APPARAIT et PERSISTE (jamais de disparition/fondu de
// sortie inter-beats). La carte s'ENRICHIT en continu : a la fin du B4, tout ce qui a ete nomme
// depuis le B1 est encore visible (Russie+flux+jetons R/S, Port-Soudan+navire+base navale, Egypte+
// arc Le Caire->SAF, le Nil).
//
// Retours Aziz traites ici (cf brief orchestrateur) :
//  1. PERSISTANCE INTER-BEATS TOTALE — zero carte vide, zero cut sec entre B1/B2/B3/B4.
//  2. CAMERA CONTINUE unique (buildActe4B1B4Cam, inline ci-dessous) qui VOLE d'un point a l'autre.
//  3. ZOOM Port-Soudan (B2) plus serre que l'original B1B2 (le navire encre est agrandi/rapproche).
//  4. GEOPLAQUES lisibles derriere chaque label (fond sombre semi-opaque + coins arrondis) au lieu
//     du texte blanc + textShadow (juge "dur a lire" par Aziz).
//  5. ZERO sous-titre bas d'ecran (regle constante de l'episode).
//
// Source du contenu visuel (repris/adapte, PAS retape a zero) : SoudanActe4B1B2Globe.tsx (Russie,
// flux RSF/SAF, Port-Soudan, navire NavireGuerreEncre, base navale), SoudanActe4B3Globe.tsx (Egypte,
// arc Le Caire->SAF, halo SAF renforce), SoudanActe4B4Nil.tsx (trace du Nil, spline Catmull-Rom).
// Socle : globeGeo.ts, geoArc.ts, globeCamera.ts (camAt), SoudanActe3GlobeProto16x9.tsx (THEMES,
// GlobeFlagFill, Medallion, RSF_RED, SAF_BLUE). Timing : soudanActe4Timing.ts (BEAT1..BEAT4).
import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Audio,
  Sequence,
  staticFile,
} from "remotion";
import {
  W,
  H,
  GLOBE_R,
  GRATICULE,
  worldFeatures,
  featureByName,
  orthoAt,
  pathOf,
  isVisible as isVisibleGeo,
} from "./globeGeo";
import { GEO, windingPathD, projectPoint, type LonLat } from "./geoArc";
import { camAt, type CamKey } from "./globeCamera";
import { THEMES, GlobeFlagFill, Medallion, RSF_RED, SAF_BLUE } from "./SoudanActe3GlobeProto16x9";
import { NavireGuerreEncre } from "../../_shared/svg-library/elements/maritime/NavireGuerreEncre";
import { PART_OFFSETS, BEAT1, BEAT2, BEAT3, BEAT4 } from "../../warmap/soudan-acte4/soudanActe4Timing";

const t = THEMES.mixte;
const FPS = 30;
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ============================================================================================
// TIMING — les jalons de soudanActe4Timing.ts sont deja des frames ABSOLUES depuis le debut du
// fichier concat FULL (frame 0 = PART_OFFSETS.p1 = 0). Ce bloc B1->B4 demarre EXACTEMENT a cette
// meme frame 0 -> on reprend les jalons ABSOLUS tels quels, zero relocalisation necessaire (contrairement
// a B1B2Globe qui relocalisait B2 en local). Ca simplifie la camera ET l'audio (memes reperes partout).
// ============================================================================================
const TAIL = 18; // petite queue de raccord vers l'Acte 5 (meme logique que B1B2/B3/B6)
export const ACTE4_B1B4_FRAMES = BEAT4.end + TAIL;

// Jalons regroupes (frames ABSOLUES, = valeurs BEATn.xxx directement)
const T = {
  // BEAT 1
  b1Start: BEAT1.start,
  troisiemePays: BEAT1.troisiemePays,
  changeDeCamp: BEAT1.changeDeCamp,
  wagnerArmait: BEAT1.wagnerArmait,
  volteFace2024: BEAT1.volteFace2024,
  b1End: BEAT1.end,
  // BEAT 2
  b2Start: BEAT2.start,
  portSoudanNomme: BEAT2.portSoudanNomme,
  vingtCinqAns: BEAT2.vingtCinqAns,
  troisCentsSoldats: BEAT2.troisCentsSoldats,
  quatreNavires: BEAT2.quatreNavires,
  propulsionNucleaire: BEAT2.propulsionNucleaire,
  soudanPasSigne: BEAT2.soudanPasSigne,
  b2End: BEAT2.end,
  // BEAT 3
  b3Start: BEAT3.start,
  egypteNommee: BEAT3.egypteNommee,
  renseignement: BEAT3.renseignement,
  coordonne: BEAT3.coordonne,
  b3End: BEAT3.end,
  // BEAT 4
  b4Start: BEAT4.start,
  nilNomme: BEAT4.nilNomme,
  redouteInfluence: BEAT4.redouteInfluence,
  profondeurStrategique: BEAT4.profondeurStrategique,
  b4End: BEAT4.end,
};

const MOSCOU: LonLat = GEO.moscou;
const RSF_TOKEN: LonLat = GEO.rsfToken;
const SAF_TOKEN: LonLat = GEO.safToken;
const PORT_SOUDAN: LonLat = GEO.portSoudan;
const EGYPTE: LonLat = GEO.cairo;

// ============================================================================================
// CAMERA CONTINUE — UN SEUL jeu de keyframes camAt sur toute la plage 0..ACTE4_B1B4_FRAMES.
// Reprend les 4 sequences de camera des fichiers sources (B1B2 + B3 + B4) mises bout a bout, avec
// le RESSERRE Port-Soudan volontairement plus serre que l'original (retour Aziz : "le navire est
// trop petit actuellement") — scaleMul monte a 3.3/3.5 au lieu de 2.6/2.9/2.95.
// ============================================================================================
function buildActe4B1B4Cam(): CamKey[] {
  return [
    // --- BEAT 1 : raccord depuis fin Acte 3 (Soudan/Darfour resserre) -> s'ouvre pour Moscou (nord).
    { frame: T.b1Start, lon: 28, lat: 16, scaleMul: 3.6 },
    { frame: T.troisiemePays, lon: 30, lat: 22, scaleMul: 2.6 },
    { frame: T.changeDeCamp, lon: 33, lat: 34, scaleMul: 1.55 }, // DEZOOM : Moscou + Soudan ensemble
    { frame: T.wagnerArmait, lon: 33, lat: 34, scaleMul: 1.5 }, // tient large, flux ancien RSF se lit
    { frame: T.volteFace2024, lon: 34, lat: 28, scaleMul: 1.6 }, // recentre vers Khartoum, flux SAF net
    { frame: T.b1End, lon: 35, lat: 24, scaleMul: 1.8 }, // commence a redescendre vers la mer Rouge

    // --- BEAT 2 : RESSERRE FORT sur Port-Soudan/mer Rouge — le navire doit se voir clairement.
    { frame: T.b2Start, lon: 35, lat: 24, scaleMul: 1.8 },
    { frame: T.portSoudanNomme, lon: 37.2, lat: 19.3, scaleMul: 3.3 }, // pulse fort, zoom marque
    { frame: T.vingtCinqAns, lon: 37.4, lat: 19.6, scaleMul: 3.5 }, // encore plus serre — navire lisible
    { frame: T.quatreNavires, lon: 37.4, lat: 19.6, scaleMul: 3.5 }, // tient serre pour les plaques chiffrees
    { frame: T.soudanPasSigne, lon: 36.5, lat: 20.2, scaleMul: 3.0 }, // commence a dezoomer pour B3
    { frame: T.b2End, lon: 35.5, lat: 21, scaleMul: 2.4 }, // DEZOOME/REMONTE : prepare le cadrage Egypte

    // --- BEAT 3 : Egypte + Soudan ensemble (arc Le Caire -> SAF).
    { frame: T.b3Start, lon: 34, lat: 22, scaleMul: 2.1 },
    { frame: T.egypteNommee - 20, lon: 33, lat: 24, scaleMul: 1.95 },
    { frame: T.egypteNommee, lon: 32, lat: 23, scaleMul: 1.8 }, // Le Caire + Khartoum cadres ensemble
    { frame: T.renseignement, lon: 32, lat: 22, scaleMul: 1.85 },
    { frame: T.coordonne, lon: 31.5, lat: 19, scaleMul: 2.1 }, // recentre vers SAF/Khartoum

    // --- BEAT 4 : Nil (motif) — camera STABLE (exigence script : on nomme la cause, pas un fait
    // nouveau visuel majeur ; contraste volontaire apres le mouvement des 3 beats precedents).
    { frame: T.b4Start, lon: 32, lat: 22, scaleMul: 1.85 },
    { frame: T.nilNomme, lon: 31.8, lat: 22.5, scaleMul: 1.9 },
    { frame: T.redouteInfluence, lon: 31.5, lat: 23, scaleMul: 1.95 },
    { frame: T.profondeurStrategique, lon: 31.5, lat: 23.5, scaleMul: 2.0 }, // phrase coup de poing, quasi fige
    { frame: ACTE4_B1B4_FRAMES, lon: 31.5, lat: 23.5, scaleMul: 2.0 },
  ];
}
const CAM = buildActe4B1B4Cam();

// ============================================================================================
// GEOPLAQUE — fond sombre semi-opaque derriere chaque label geo-ancre (retour Aziz : le texte
// blanc + textShadow etait dur a lire). Coins arrondis, padding, Georgia serif clair sur fond
// sombre. Remplace tous les <text> SVG bruts des fichiers sources par un <div> HTML positionne.
// ============================================================================================
const GeoPlaque: React.FC<{ x: number; y: number; label: string; op: number; accent?: string; dy?: number }> =
  ({ x, y, label, op, accent = t.flowGold, dy = -34 }) => {
    if (op <= 0.01) return null;
    return (
      <div style={{ position: "absolute", left: x, top: y + dy, transform: "translate(-50%,-50%)", opacity: op,
        pointerEvents: "none", padding: "5px 14px", background: "rgba(10,16,24,0.76)", borderRadius: 6,
        borderLeft: `2.5px solid ${accent}`, whiteSpace: "nowrap", boxShadow: "0 3px 8px rgba(0,0,0,0.4)" }}>
        <span style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 20, letterSpacing: "0.01em",
          color: t.labelFill }}>{label}</span>
      </div>
    );
  };

// --- Icone base navale sobre (reprise EXACTE de B1B2Globe) — apparait a Port-Soudan et RESTE.
const NavalBaseIcon: React.FC<{ x: number; y: number; reveal: number; pulse: number }> = ({ x, y, reveal, pulse }) => {
  if (reveal <= 0.01) return null;
  return (
    <g transform={`translate(${x} ${y})`} opacity={reveal}>
      {pulse > 0 && <circle r={10 + 30 * pulse} fill={t.flowMetal} opacity={0.3 * (1 - pulse)} />}
      <circle r={16} fill="rgba(10,16,24,0.72)" stroke={t.flowMetal} strokeWidth={2} />
      <g stroke={t.labelFill} strokeWidth={2} fill="none" strokeLinecap="round">
        <circle cx={0} cy={-6} r={2.6} fill={t.labelFill} stroke="none" />
        <line x1={0} y1={-3.5} x2={0} y2={7} />
        <path d="M -6 3 Q 0 11 6 3" />
        <line x1={-5} y1={-1} x2={5} y2={-1} />
      </g>
    </g>
  );
};

// --- Navire de guerre SVG encre a Port-Soudan (repris de B1B2Globe, AGRANDI — retour Aziz : le
// zoom camera plus serre + une echelle relative plus grande rendent le navire nettement plus lisible).
const NAVIRE_CX = (873 + 1679) / 2;
const NAVIRE_CY = (367 + 758) / 2;
const NavireEncreAuGlobe: React.FC<{ x: number; y: number; reveal: number; frame: number }> = ({ x, y, reveal, frame }) => {
  if (reveal <= 0.01) return null;
  // scale 0.1 -> 0.13 (retour Aziz : navire trop petit dans B1B2Globe original). Combine avec le
  // scaleMul camera plus fort (3.3-3.5 vs 2.6-2.95), le navire est visiblement plus grand a l'ecran.
  const scale = 0.13 * reveal;
  const bobY = Math.sin(frame / 11) * 1.6;
  const rollDeg = Math.sin(frame / 14) * 0.9;
  const waveA = 0.5 + 0.5 * Math.sin(frame / 18);
  const waveB = 0.5 + 0.5 * Math.sin(frame / 18 + Math.PI * 0.66);
  const waveC = 0.5 + 0.5 * Math.sin(frame / 18 + Math.PI * 1.33);
  return (
    <g transform={`translate(${x} ${y + bobY}) rotate(${rollDeg})`} opacity={reveal}>
      <ellipse cx={0} cy={17} rx={62} ry={9} fill="none" stroke={t.oceanInner} strokeWidth={1.4} opacity={0.32 * waveA} />
      <ellipse cx={-14} cy={22} rx={44} ry={6.5} fill="none" stroke={t.oceanInner} strokeWidth={1.2} opacity={0.28 * waveB} />
      <ellipse cx={16} cy={25} rx={36} ry={5.5} fill="none" stroke={t.oceanInner} strokeWidth={1.1} opacity={0.26 * waveC} />
      <g opacity={0.35 * reveal}>
        <circle cx={5.6} cy={-30} r={3.2} fill={t.grat} opacity={0.5} />
        <circle cx={7.4} cy={-36 - Math.sin(frame / 20) * 2} r={4.2} fill={t.grat} opacity={0.36} />
        <circle cx={9.6} cy={-43 - Math.sin(frame / 20) * 3} r={5.2} fill={t.grat} opacity={0.24} />
      </g>
      <g transform={`scale(${scale}) translate(${-NAVIRE_CX} ${-NAVIRE_CY})`}>
        <NavireGuerreEncre wakeOpacity={0.15} deckLineColor={t.flowGold} hatchPatternId="a4fusedNavireInk" />
      </g>
    </g>
  );
};

// ============================================================================================
// LE NIL (repris de B4Nil.tsx) — polyligne geo reelle sud->nord, spline Catmull-Rom (fleuve lisse).
// ============================================================================================
const NIL: LonLat[] = [
  [32.5, 15.6], // confluence Khartoum
  [33.9, 17.7], // Atbara
  [30.9, 19.6], // grande boucle du Nil (Nubie)
  [31.3, 21.8], // Wadi Halfa
  [32.9, 24.1], // Assouan
  [32.6, 25.7], // Louxor
  [31.6, 27.2], // Assiout
  [31.2, 30.0], // Le Caire
  [31.0, 31.4], // delta
];
function catmullRom(p0: LonLat, p1: LonLat, p2: LonLat, p3: LonLat, f: number): LonLat {
  const f2 = f * f;
  const f3 = f2 * f;
  const lon = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * f + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * f2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * f3);
  const lat = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * f + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * f2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * f3);
  return [lon, lat];
}
function densifyNil(pts: LonLat[], perSegment = 14): LonLat[] {
  const out: LonLat[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? pts[i + 1];
    for (let s = 0; s < perSegment; s++) out.push(catmullRom(p0, p1, p2, p3, s / perSegment));
  }
  out.push(pts[pts.length - 1]);
  return out;
}
const NIL_DENSE: LonLat[] = densifyNil(NIL);
function nilPathD(path: (o: any) => string | null, reveal: number): string {
  const r = Math.max(0, Math.min(1, reveal));
  if (r <= 0) return "";
  const cut = Math.max(1, Math.round(NIL_DENSE.length * r));
  const d = path({ type: "LineString", coordinates: NIL_DENSE.slice(0, cut + 1) } as any);
  return d || "";
}
const NIL_BLUE = "#7FC8E8";

// ============================================================================================
// COMPOSANT PRINCIPAL
// ============================================================================================
export const SoudanActe4B1toB4Globe: React.FC = () => {
  const frame = useCurrentFrame();
  const features = useMemo(() => worldFeatures(), []);

  const cam = camAt(CAM, frame);
  const rotLambda = -cam.lon;
  const rotLat = -cam.lat;
  const globeR = GLOBE_R * cam.scaleMul;
  const proj = useMemo(() => orthoAt(rotLambda, rotLat).scale(globeR), [rotLambda, rotLat, globeR]);
  const path = useMemo(() => pathOf(proj), [proj]);
  const visible = (ll: LonLat) => isVisibleGeo(ll, rotLambda, rotLat);

  const russiaFeature = useMemo(() => featureByName("Russia"), []);
  const egypteFeature = useMemo(() => featureByName("Egypt"), []);

  const cx = W / 2;
  const cy = H / 2;

  // ===== BEAT 1 : Russie (drapeau) + flux RSF (ancien, s'estompe MAIS persiste) + flux SAF (net) ====
  const russiaReveal = interpolate(frame, [T.troisiemePays, T.troisiemePays + 22], [0, 1], clampB);
  const rsfFlowProg = interpolate(frame, [T.wagnerArmait, T.wagnerArmait + 40], [0, 1], clampB);
  // persistance : le flux ancien ne descend plus tres bas (0.35 au lieu de 0.08) — reste lisible
  // toute la suite de l'acte (regle "nom->persiste", jamais d'effacement total).
  const rsfFlowFade = interpolate(frame, [T.wagnerArmait + 40, T.volteFace2024 + 10], [1, 0.35], clampB);
  const safFlowProg = interpolate(frame, [T.volteFace2024, T.volteFace2024 + 44], [0, 1], clampB);
  const safFlowOp = interpolate(frame, [T.volteFace2024, T.volteFace2024 + 20], [0, 0.95], clampB);
  const rsfPulse = interpolate(frame, [T.wagnerArmait + 30, T.wagnerArmait + 70], [1, 0], clampB);
  const safPulse = interpolate(frame, [T.volteFace2024 + 34, T.volteFace2024 + 74], [1, 0], clampB);
  const medallionScale = interpolate(frame, [T.wagnerArmait, T.wagnerArmait + 20], [0, 1], clampB);
  const safMedallionScale = interpolate(frame, [T.volteFace2024, T.volteFace2024 + 20], [0, 1], clampB);

  // ===== BEAT 2 : Port-Soudan pulse + base navale + navire encre — S'AJOUTENT, PERSISTENT =========
  const portSoudanReveal = interpolate(frame, [T.portSoudanNomme, T.portSoudanNomme + 18], [0, 1], clampB);
  const portSoudanPulse = interpolate(frame, [T.portSoudanNomme, T.portSoudanNomme + 40], [1, 0], clampB);

  // ===== BEAT 3 : Egypte (drapeau) + arc Le Caire->SAF + halo SAF renforce en 2 paliers ============
  const egypteReveal = interpolate(frame, [T.egypteNommee, T.egypteNommee + 22], [0, 1], clampB);
  const arcProg = interpolate(frame, [T.egypteNommee, T.egypteNommee + 46], [0, 1], clampB);
  const arcOp = interpolate(frame, [T.egypteNommee, T.egypteNommee + 18], [0, 0.95], clampB);
  const arcPulse = interpolate(frame, [T.egypteNommee + 30, T.egypteNommee + 70], [1, 0], clampB);
  const flowOffset = (frame * 2) % 40;
  const safRenforce = interpolate(
    frame,
    [T.egypteNommee, T.egypteNommee + 20, T.renseignement, T.renseignement + 20, T.coordonne, T.coordonne + 20],
    [0.4, 0.55, 0.55, 0.78, 0.78, 1],
    clampB,
  );
  // le medaillon SAF du B3 est le MEME jeton que celui pose au B1 (persistance) : on prend le max
  // des deux echelles pour ne jamais le voir "reculer" au moment ou B3 prend le relais.
  const safMedallionScaleB3 = interpolate(frame, [T.egypteNommee - 10, T.egypteNommee + 12], [0, 1], clampB);

  // ===== BEAT 4 : le Nil (motif) + Egypte se teinte davantage =====================================
  const nilReveal = interpolate(frame, [T.nilNomme, T.nilNomme + 30], [0, 1], clampB);
  const nilD = nilPathD(path, nilReveal);
  const nilPulse = 0.75 + 0.25 * Math.sin(frame / 10);
  // le drapeau egyptien (deja pose au B3) se renforce encore un peu au B4 ("elle redoute...") — MAX
  // avec le reveal B3 pour ne jamais regresser.
  const egyptFlagReinforceB4 = interpolate(frame, [T.redouteInfluence, T.redouteInfluence + 30], [0, 0.2], clampB);
  const egypteRevealFinal = Math.min(1, egypteReveal + egyptFlagReinforceB4);

  // ===== POINTS PROJETES =====
  const pMoscou = projectPoint(proj, MOSCOU, visible);
  const pRSF = projectPoint(proj, RSF_TOKEN, visible);
  const pSAF = projectPoint(proj, SAF_TOKEN, visible);
  const pPortSoudan = projectPoint(proj, PORT_SOUDAN, visible);
  const pEgypte = projectPoint(proj, EGYPTE, visible);

  // Terminateur nuit (discret), derive lente sur toute la duree du bloc fusionne.
  const sunLon = interpolate(frame, [0, ACTE4_B1B4_FRAMES], [55, 5]);
  const nightCenter: LonLat = [sunLon + 180, -15];
  const nightPt = visible(nightCenter) ? proj(nightCenter) : null;

  return (
    <AbsoluteFill style={{ backgroundColor: t.bg }}>
      {/* AUDIO — p1 (B1), p2 (B2), p3 tronque a la fin du B4 (B3+B4 sont dans le meme fichier p3). */}
      <Sequence from={PART_OFFSETS.p1} durationInFrames={PART_OFFSETS.p2 - PART_OFFSETS.p1} premountFor={FPS}>
        <Audio src={staticFile("_shared/audio/soudan/acte4-voisins-aspires-p1.mp3")} />
      </Sequence>
      <Sequence from={PART_OFFSETS.p2} durationInFrames={PART_OFFSETS.p3 - PART_OFFSETS.p2} premountFor={FPS}>
        <Audio src={staticFile("_shared/audio/soudan/acte4-voisins-aspires-p2.mp3")} />
      </Sequence>
      <Sequence from={PART_OFFSETS.p3} durationInFrames={ACTE4_B1B4_FRAMES - PART_OFFSETS.p3} premountFor={FPS}>
        <Audio
          src={staticFile("_shared/audio/soudan/acte4-voisins-aspires-p3.mp3")}
          endAt={Math.max(1, T.b4End - PART_OFFSETS.p3)}
        />
      </Sequence>

      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${t.oceanOuter} 0%, ${t.bg} 78%)` }} />

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="a4fusedOcean" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor={t.oceanInner} />
            <stop offset="70%" stopColor={t.oceanMid} />
            <stop offset="100%" stopColor={t.oceanOuter} />
          </radialGradient>
          <radialGradient id="a4fusedAtmo" cx="50%" cy="50%" r="50%">
            <stop offset="82%" stopColor={t.atmoColor} stopOpacity={0} />
            <stop offset="97%" stopColor={t.atmoColor} stopOpacity={t.atmoOpacity} />
            <stop offset="100%" stopColor={t.atmoColor} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="a4fusedNight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#04060d" stopOpacity={0.55} />
            <stop offset="70%" stopColor="#04060d" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#04060d" stopOpacity={0} />
          </radialGradient>
          <clipPath id="a4fusedClip">
            <circle cx={cx} cy={cy} r={globeR} />
          </clipPath>
          <filter id="a4fusedGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="a4fusedNavireInk" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M0 0V10" stroke="#0c1318" strokeWidth={2.4} opacity={0.5} />
          </pattern>
        </defs>

        <circle cx={cx} cy={cy} r={globeR + 14} fill="url(#a4fusedAtmo)" />
        <circle cx={cx} cy={cy} r={globeR} fill="url(#a4fusedOcean)" />

        <g clipPath="url(#a4fusedClip)">
          <path d={path(GRATICULE as any) || ""} fill="none" stroke={t.grat} strokeWidth={0.6} opacity={t.gratOpacity} />

          {features.map((f, i) => {
            const isSudan = f.properties.name === "Sudan" || f.properties.name === "S. Sudan";
            return (
              <path
                key={i}
                d={path(f as any) || ""}
                fill={isSudan ? t.sudanFill : t.land}
                stroke={isSudan ? t.sudanStroke : t.landStroke}
                strokeWidth={isSudan ? 0.9 : t.borderWidth}
                strokeOpacity={t.borderOpacity}
              />
            );
          })}

          {nightPt && <circle cx={nightPt[0]} cy={nightPt[1]} r={globeR * 1.05} fill="url(#a4fusedNight)" />}

          {/* RUSSIE — drapeau, pose au B1, PERSISTE jusqu'a la fin */}
          {russiaFeature && russiaReveal > 0.01 && (
            <GlobeFlagFill feature={russiaFeature} proj={proj} path={path} flagCode="ru" reveal={russiaReveal} glow="#c74d4d" />
          )}

          {/* EGYPTE — drapeau, pose au B3, renforce leger au B4, PERSISTE */}
          {egypteFeature && egypteRevealFinal > 0.01 && (
            <GlobeFlagFill feature={egypteFeature} proj={proj} path={path} flagCode="eg" reveal={egypteRevealFinal} glow="#7fae6a" />
          )}

          {/* FLUX ANCIEN Moscou -> RSF (B1, s'estompe mais ne s'efface JAMAIS totalement) */}
          {rsfFlowProg > 0.01 && (
            <path
              d={windingPathD(proj, path, MOSCOU, RSF_TOKEN, rsfFlowProg, -2.2, 1)}
              fill="none"
              stroke={RSF_RED}
              strokeWidth={3.2}
              strokeOpacity={0.85 * rsfFlowFade}
              strokeLinecap="round"
              strokeDasharray={rsfFlowFade < 0.5 ? "5 7" : undefined}
            />
          )}

          {/* FLUX NET Moscou -> SAF (B1, 2024, tient et PERSISTE) */}
          {safFlowProg > 0.01 && (
            <path
              d={windingPathD(proj, path, MOSCOU, SAF_TOKEN, safFlowProg, 1.8, 1)}
              fill="none"
              stroke={SAF_BLUE}
              strokeWidth={3.6}
              strokeOpacity={safFlowOp}
              strokeLinecap="round"
            />
          )}

          {/* ARC Le Caire -> SAF (B3, nouveau soutien egyptien, PERSISTE) */}
          {arcProg > 0.01 && (
            <g>
              <path
                d={windingPathD(proj, path, EGYPTE, SAF_TOKEN, arcProg, -1.4, 1)}
                fill="none"
                stroke="#7fae6a"
                strokeWidth={3.6}
                strokeOpacity={arcOp}
                strokeLinecap="round"
              />
              {arcProg > 0.96 && (
                <path
                  d={windingPathD(proj, path, EGYPTE, SAF_TOKEN, 1, -1.4, 1)}
                  fill="none"
                  stroke="#a8d090"
                  strokeWidth={4}
                  strokeOpacity={0.75}
                  strokeDasharray="4 34"
                  strokeDashoffset={-flowOffset}
                  strokeLinecap="round"
                />
              )}
            </g>
          )}

          {/* Jetons RSF/SAF (medaillons) — poses au B1, RENFORCES au B3 (SAF), PERSISTENT */}
          {pRSF && medallionScale > 0.01 && (
            <Medallion x={pRSF.x} y={pRSF.y} color={RSF_RED} label="R" scale={medallionScale * Math.max(0.4, rsfFlowFade)} pulse={rsfPulse} t={t as any} />
          )}
          {pSAF && (safMedallionScale > 0.01 || safMedallionScaleB3 > 0.01) && (
            <Medallion
              x={pSAF.x}
              y={pSAF.y}
              color={SAF_BLUE}
              label="S"
              scale={Math.max(safMedallionScale, safMedallionScaleB3 * (0.7 + 0.3 * safRenforce))}
              pulse={Math.max(safPulse, arcPulse)}
              t={t as any}
            />
          )}

          {/* BASE NAVALE + NAVIRE ENCRE a Port-Soudan (B2, PERSISTE) */}
          {pPortSoudan && portSoudanReveal > 0.01 && (
            <>
              <NavireEncreAuGlobe x={pPortSoudan.x + 78} y={pPortSoudan.y + 48} reveal={portSoudanReveal} frame={frame} />
              <NavalBaseIcon x={pPortSoudan.x} y={pPortSoudan.y} reveal={portSoudanReveal} pulse={portSoudanPulse} />
            </>
          )}

          {/* LE NIL (B4, motif) — trace reel Soudan->Egypte, revele sud->nord, pulse lumineux */}
          {nilD && (
            <g opacity={nilPulse}>
              <path d={nilD} fill="none" stroke={NIL_BLUE} strokeWidth={7} strokeOpacity={0.22} strokeLinecap="round" filter="url(#a4fusedGlow)" />
              <path d={nilD} fill="none" stroke={NIL_BLUE} strokeWidth={2.6} strokeOpacity={0.95} strokeLinecap="round" />
            </g>
          )}
        </g>

        <circle cx={cx} cy={cy} r={globeR} fill="none" stroke={t.sphereStroke} strokeWidth={1.5} strokeOpacity={0.4} />
      </svg>

      {/* ===== GEOPLAQUES (labels HTML lisibles, fond sombre) — persistent une fois posees ===== */}
      {pMoscou && <GeoPlaque x={pMoscou.x} y={pMoscou.y} label="Moscou" op={russiaReveal} accent="#c74d4d" dy={-30} />}
      {pPortSoudan && <GeoPlaque x={pPortSoudan.x} y={pPortSoudan.y} label="Port-Soudan" op={portSoudanReveal} accent={t.flowMetal} dy={38} />}
      {pEgypte && <GeoPlaque x={pEgypte.x} y={pEgypte.y} label="Le Caire" op={egypteRevealFinal} accent="#7fae6a" dy={-30} />}

      {/* ZERO sous-titre bas d'ecran (regle constante : bas de cadre reserve aux SOURCES uniquement,
          ce bloc n'a pas de source a afficher — la voix off + la densite visuelle du globe portent
          le sens, meme discipline que B1B2/B3/B4/B6). */}
    </AbsoluteFill>
  );
};

export default SoudanActe4B1toB4Globe;
