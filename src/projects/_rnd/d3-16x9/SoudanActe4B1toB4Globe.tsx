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
import { THEMES, GlobeFlagFill, RSF_RED, SAF_BLUE, GeoPlaqueSVG, BorderPulse } from "./SoudanActe3GlobeProto16x9";
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

// --- SOLDATS / CHARS autour de chaque camp (retour Aziz : "carte vivante des le depart", montrer le
// point de la guerre — comme l'Acte 1). SOBRE : 1 char + 1 soldat par camp, poses PRES du jeton general
// (pas une armee). RSF (Darfour, ouest) = technical rouge + soldat RSF ; SAF (Khartoum/Nil) = char bleu +
// soldat SAF. Coords geo reelles decalees autour du jeton pour ne pas se superposer au portrait.
interface Unit { at: LonLat; sprite: string; size: number }
const RSF_UNITS: Unit[] = [
  { at: [22.6, 13.4], sprite: "tech-td-red", size: 46 },   // technical (pick-up arme) a l'ouest du jeton RSF
  { at: [25.7, 12.0], sprite: "portrait-rsf", size: 34 },  // soldat RSF au sud-est
];
const SAF_UNITS: Unit[] = [
  { at: [34.9, 17.2], sprite: "tank-td-blue", size: 46 },  // char SAF au nord-est de Khartoum (degage du portrait)
  { at: [31.2, 13.9], sprite: "portrait-saf", size: 34 },  // soldat SAF au sud-ouest
];

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
// GEOPLAQUE — voir GeoPlaqueSVG (SoudanActe3GlobeProto16x9.tsx), source de verite unique du label
// geo-ancre (unification 2026-07-21). L'ancien GeoPlaque local (HTML <div> overlay) est SUPPRIME ;
// les appels ci-dessous utilisent desormais GeoPlaqueSVG, rendu DANS le <svg> (voir plus bas).
// ============================================================================================

// --- PortraitToken (repris EXACTEMENT de SoudanActe5Globe.tsx) — jeton-visage : cercle parchemin +
// bordure faction + portrait clippe rond + ombre-sol. Remplace les Medallion-lettre RSF/SAF par les
// vrais visages des dirigeants (retour Aziz : lisibilite/incarnation superieure a une lettre).
const PortraitToken: React.FC<{ x: number; y: number; sprite: string; border: string; op: number; size?: number }> =
  ({ x, y, sprite, border, op, size = 62 }) => {
    if (op <= 0.01) return null;
    const D = size;
    return (
      <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: op, pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: "50%", top: "72%", width: D * 0.82, height: D * 0.26,
          transform: "translate(-50%,-50%)", background: "rgba(40,27,8,0.42)", borderRadius: "50%", filter: "blur(6px)" }} />
        <div style={{ width: D, height: D, borderRadius: "50%", overflow: "hidden", background: "#F5EFD6",
          border: `3.5px solid ${border}`, boxShadow: "0 4px 10px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.3)" }}>
          <img src={staticFile(`_shared/sprites/warmap/${sprite}.png`)}
            style={{ width: "118%", height: "118%", objectFit: "cover", objectPosition: "top center",
              transform: "translate(-8%, 2%)", display: "block" }} />
        </div>
      </div>
    );
  };

// --- MilitaryToken (soldat OU char) — petit sprite POSE SUR LE SOL, echelle ECRAN quasi fixe (objet
// vu de loin, il ne "grossit" pas comme le navire au dezoom : c'est une figure d'infanterie/blindé sobre
// autour de chaque camp = "la guerre" habite la carte des la 1re seconde, comme l'Acte 1). Ombre-sol
// dessinee + spring pop a l'apparition. `op` = opacite courante (persistance : ne retombe jamais a 0).
const MilitaryToken: React.FC<{ x: number; y: number; sprite: string; op: number; frame: number; appear: number; size?: number }> =
  ({ x, y, sprite, op, frame, appear, size = 40 }) => {
    if (op <= 0.01 || frame < appear) return null;
    const D = size;
    // spring pop d'apparition puis FIGE a 1 (pas d'oscillation continue = raster net, cf lecon jeton flou)
    const sp = interpolate(frame, [appear, appear + 12, appear + 22], [0, 1.14, 1], clampB);
    const fadeIn = interpolate(frame, [appear, appear + 10], [0, 1], clampB);
    return (
      <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-58%) scale(${sp})`,
        opacity: op * fadeIn, pointerEvents: "none" }}>
        {/* ombre-sol (poids physique de l'engin/soldat pose sur le terrain) */}
        <div style={{ position: "absolute", left: "50%", top: "70%", width: D * 0.72, height: D * 0.22,
          transform: "translate(-50%,-50%)", background: "rgba(20,14,6,0.42)", borderRadius: "50%", filter: "blur(5px)" }} />
        <img src={staticFile(`_shared/sprites/warmap/${sprite}.png`)}
          style={{ width: D, height: D, objectFit: "contain", display: "block" }} />
      </div>
    );
  };

// --- Glow territorial ancre-geo (RSF/SAF) — le Soudan "porte" la guerre civile au lieu de rester
// un territoire vide : un halo radial pose sous les jetons, qui persiste et pulse legerement.
const TerritoryGlow: React.FC<{ x: number; y: number; color: string; op: number; frame: number; id: string }> =
  ({ x, y, color, op, frame, id }) => {
    if (op <= 0.01) return null;
    const pulse = 0.9 + 0.1 * Math.sin(frame / 26);
    const r = 62 * pulse;
    return (
      <g opacity={op}>
        <defs>
          <radialGradient id={id} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity={0.30} />
            <stop offset="55%" stopColor={color} stopOpacity={0.16} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
      </g>
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
const NavireEncreAuGlobe: React.FC<{ x: number; y: number; reveal: number; frame: number; camScale: number }> = ({ x, y, reveal, frame, camScale }) => {
  if (reveal <= 0.01) return null;
  // TAILLE PROPORTIONNELLE AU GLOBE (retour Aziz : "le navire n'est pas fixe, il devient gigantesque
  // quand on dezoome"). Le navire est un objet POSE SUR LA MER — il doit grossir/retrecir AVEC la carte,
  // pas garder une taille ecran fixe (sinon il parait enorme des que la camera dezoome). On calibre a
  // scaleMul=3.4 (zoom Port-Soudan du B2) ou 0.20 est la bonne taille, et on met a l'echelle lineairement.
  const NAVIRE_CALIB_SCALE = 3.4;
  const scale = 0.20 * (camScale / NAVIRE_CALIB_SCALE) * reveal;
  // le sillage/vagues/ondes suivent la meme echelle relative pour rester coherents avec la coque.
  const rel = camScale / NAVIRE_CALIB_SCALE;
  const bobY = Math.sin(frame / 11) * 1.6;
  const rollDeg = Math.sin(frame / 14) * 1.6; // tangage plus marque (retour Aziz : navire trop statique)
  const waveA = 0.5 + 0.5 * Math.sin(frame / 18);
  const waveB = 0.5 + 0.5 * Math.sin(frame / 18 + Math.PI * 0.66);
  const waveC = 0.5 + 0.5 * Math.sin(frame / 18 + Math.PI * 1.33);
  // apparition : petit halo/splash d'encre autour de la coque, s'estompe une fois le navire installe.
  const splash = interpolate(reveal, [0, 0.3], [1, 0], clampB);
  // sillage anime derriere la poupe : dashes qui defilent vers l'arriere (le navire "avance" sur place).
  // Cote +x (droite) : dans l'asset NavireGuerreEncre, le sillage natif (wakeOpacity) est dessine a
  // x=1655..1887, PASSE le bord droit de la coque (873..1679) -> la poupe est du cote droit (+x) du
  // repere local. On prolonge ce meme cote, hors silhouette (coque scaled ~ +80px de large).
  const wakeOffset = -(frame * 2.4) % 26;
  return (
    <g transform={`translate(${x} ${y + bobY * rel}) rotate(${rollDeg})`} opacity={reveal}>
      {/* toutes les decorations (vagues, ondes, sillage) mises a l'echelle relative du globe (rel) pour
          rester coherentes avec la coque, elle-meme scalee par `scale` = 0.20 * rel * reveal. */}
      <g transform={`scale(${rel})`}>
        {splash > 0.01 && (
          <circle r={16 + 26 * (1 - splash)} fill={t.oceanInner} opacity={0.3 * splash} />
        )}
        <ellipse cx={0} cy={17} rx={62} ry={9} fill="none" stroke={t.oceanInner} strokeWidth={1.4} opacity={0.32 * waveA} />
        <ellipse cx={-14} cy={22} rx={44} ry={6.5} fill="none" stroke={t.oceanInner} strokeWidth={1.2} opacity={0.28 * waveB} />
        <ellipse cx={16} cy={25} rx={36} ry={5.5} fill="none" stroke={t.oceanInner} strokeWidth={1.1} opacity={0.26 * waveC} />
        <g opacity={0.35 * reveal}>
          <circle cx={5.6} cy={-30} r={3.2} fill={t.grat} opacity={0.5} />
          <circle cx={7.4} cy={-36 - Math.sin(frame / 20) * 2} r={4.2} fill={t.grat} opacity={0.36} />
          <circle cx={9.6} cy={-43 - Math.sin(frame / 20) * 3} r={5.2} fill={t.grat} opacity={0.24} />
        </g>
        {/* sillage a la poupe (cote droit, hors silhouette) : traits qui defilent vers l'arriere. */}
        <g stroke={t.oceanInner} strokeLinecap="round" opacity={0.65 * reveal}>
          <line x1={90} y1={2} x2={128} y2={2} strokeWidth={2.6} strokeOpacity={0.55}
            strokeDasharray="7 11" strokeDashoffset={wakeOffset} />
          <line x1={86} y1={10} x2={122} y2={13} strokeWidth={2} strokeOpacity={0.4}
            strokeDasharray="6 10" strokeDashoffset={wakeOffset * 0.8} />
          <line x1={84} y1={-6} x2={116} y2={-8} strokeWidth={1.6} strokeOpacity={0.32}
            strokeDasharray="5 9" strokeDashoffset={wakeOffset * 0.65} />
        </g>
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
// Bleu du Nil (retour Aziz : "faire ressortir le bleu du Nil", plus brillant) — cyan-azur sature,
// plus lumineux que l'ancien #7FC8E8. NIL_GLOW = halo large plus bleu-electrique pour le glow.
const NIL_BLUE = "#4FB8F0";
const NIL_GLOW = "#2EA8FF";
const NIL_CORE = "#CBEBFF"; // coeur clair du fleuve (filet lumineux qui coule)

// ============================================================================================
// COMPOSANT PRINCIPAL
// ============================================================================================
export const SoudanActe4B1toB4Globe: React.FC = () => {
  const frame = useCurrentFrame();
  const features = useMemo(() => worldFeatures(), []);

  const cam = camAt(CAM, frame);
  // DERIVE LENTE DE FOND (dosage B6) — pendant la phase Nil TENUE du B4 (camera quasi figee, exigence
  // script), on ajoute une rotation continue tres douce de la longitude = "monde en mouvement" au lieu
  // d'un plan strictement fixe. Monte 0->~3 deg pendant redoute/profondeur, PUIS REDESCEND a 0 avant la
  // sortie (sinon le decalage persisterait et casserait le raccord de sortie lon31.5/lat23.5 attendu par
  // l'insert Kosti/B6). Off ailleurs (les beats 1-3 ont deja leur mouvement de cadrage).
  const driftLon = interpolate(
    frame,
    [T.redouteInfluence, T.redouteInfluence + 40, T.profondeurStrategique, T.b4End],
    [0, 2.0, 3.0, 0],
    clampB,
  );
  const rotLambda = -(cam.lon + driftLon);
  const rotLat = -cam.lat;
  const globeR = GLOBE_R * cam.scaleMul;
  const proj = useMemo(() => orthoAt(rotLambda, rotLat).scale(globeR), [rotLambda, rotLat, globeR]);
  const path = useMemo(() => pathOf(proj), [proj]);
  const visible = (ll: LonLat) => isVisibleGeo(ll, rotLambda, rotLat);

  const russiaFeature = useMemo(() => featureByName("Russia"), []);
  const egypteFeature = useMemo(() => featureByName("Egypt"), []);

  const cx = W / 2;
  const cy = H / 2;

  // Offset commun du filet lumineux qui coule sur les flux traces (RSF/SAF B1, arc B3) — un seul
  // rythme de "coule" partage par tous les flux vivants de l'Acte.
  const flowOffset = (frame * 2) % 40;

  // ===== OUVERTURE : carte HABITEE des b1Start (retour Aziz) — les 2 generaux + leurs territoires +
  // quelques soldats/chars sont poses DES LA 1re seconde, AVANT que Moscou apparaisse. On ne demarre plus
  // sur un Soudan vide : le zoom vers Moscou part d'une scene deja vivante (la guerre civile est la).
  // openingReveal : spring d'entree cale sur le tout debut, puis PLANCHER a 1 -> persistance tout l'acte.
  const openingReveal = interpolate(frame, [T.b1Start, T.b1Start + 22], [0, 1], clampB);

  // ===== BEAT 1 : Russie (drapeau) + flux RSF (ancien, s'estompe MAIS persiste) + flux SAF (net) ====
  const russiaReveal = interpolate(frame, [T.troisiemePays, T.troisiemePays + 22], [0, 1], clampB);
  // FRONTIERE PERSISTANTE LUMINEUSE (pattern B6) — souffle one-shot a la nomination puis contour qui
  // RESPIRE tant que le pays est actif (le pays nomme reste "chaud", pas inerte). Russie a troisiemePays.
  const russiaBorderPulse = interpolate(frame, [T.troisiemePays, T.troisiemePays + 24], [0, 1], clampB);
  const russiaBorderOn = interpolate(frame, [T.troisiemePays + 20, T.troisiemePays + 40], [0, 1], clampB);
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
  // FRONTIERE PERSISTANTE LUMINEUSE Egypte (pattern B6) — souffle a egypteNommee puis contour respirant.
  const egypteBorderPulse = interpolate(frame, [T.egypteNommee, T.egypteNommee + 24], [0, 1], clampB);
  const egypteBorderOn = interpolate(frame, [T.egypteNommee + 20, T.egypteNommee + 40], [0, 1], clampB);
  const arcProg = interpolate(frame, [T.egypteNommee, T.egypteNommee + 46], [0, 1], clampB);
  const arcOp = interpolate(frame, [T.egypteNommee, T.egypteNommee + 18], [0, 0.95], clampB);
  const arcPulse = interpolate(frame, [T.egypteNommee + 30, T.egypteNommee + 70], [1, 0], clampB);
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
  const egypteRevealBase = Math.min(1, egypteReveal + egyptFlagReinforceB4);
  // ===== RESPIRATION NIL (retour Aziz) — une fois le Nil trace, on OUVRE une fenetre de ~2-3s ou :
  //   (a) le drapeau egyptien devient le MEME aplat creme que le Soudan (plus de drapeau du tout),
  //   (b) TOUS les flux/arcs s'effacent, pour que SEUL le trace bleu du Nil respire, bien lisible,
  //   (c) puis tout REVIENT comme avant (drapeau + fleches). Les jetons + geoplaques RESTENT (ancrage).
  // nilBreath : 0 -> 1 (ouverture) -> tient -> 0 (retour). Cale apres le trace du Nil (nilNomme+30).
  const breathStart = T.nilNomme + 34; // le Nil vient de finir de se tracer
  // fenetre RALLONGEE (retour Aziz : "faire durer le Nil plus longtemps") — tenue ~130 frames (~4.3s)
  // au lieu de ~60. Le retour se fait toujours avant la fin du B4 (profondeurStrategique ~ nilNomme+280),
  // donc le raccord de sortie (drapeau + fleches revenus) reste intact.
  const nilBreath = interpolate(
    frame,
    [breathStart, breathStart + 18, breathStart + 148, breathStart + 172],
    [0, 1, 1, 0],
    clampB,
  );
  // pendant la respiration, le drapeau egyptien -> aplat creme (comme le Soudan). En dehors, il reprend
  // sa valeur normale (attenuee par le B4 pour laisser voir le Nil de base).
  const egyptFlagDimForNil = interpolate(frame, [T.nilNomme, T.nilNomme + 30], [1, 0.55], clampB);
  const egypteRevealFinal = egypteRevealBase * egyptFlagDimForNil * (1 - nilBreath);
  // facteur d'effacement des flux pendant la respiration (1 = plein, 0 = efface).
  const fluxBreathe = 1 - nilBreath;
  // NIL plus brillant (retour Aziz) : boost d'eclat pendant la fenetre de respiration (seul le Nil est
  // visible -> il rayonne davantage). 1.0 hors fenetre, jusqu'a ~1.6 au pic de nilBreath.
  const nilBoost = 1 + 0.6 * nilBreath;

  // ===== GEOPLAQUES VILLES EPHEMERES (retour Aziz) — enveloppe temporelle : fade-in a la nomination,
  // tient ~2s (EPHEM_HOLD), fade-out. Multiplie l'opacite de reveal existante des plaques Moscou/
  // Port-Soudan/Le Caire (pattern B6). Le drapeau du pays + le jeton/label general, eux, PERSISTENT.
  const EPHEM_IN = 14, EPHEM_HOLD = 60, EPHEM_OUT = 16; // ~2s tenu
  const ephemEnvelope = (at: number) =>
    interpolate(frame, [at, at + EPHEM_IN, at + EPHEM_IN + EPHEM_HOLD, at + EPHEM_IN + EPHEM_HOLD + EPHEM_OUT],
      [0, 1, 1, 0], clampB);
  const moscouEphem = ephemEnvelope(T.troisiemePays);
  const portSoudanEphem = ephemEnvelope(T.portSoudanNomme);
  const caireEphem = ephemEnvelope(T.egypteNommee);

  // ===== OPACITES JETONS/TERRITOIRES — unifiees (jeton-portrait, halo territorial ET soldats/chars
  // partagent la MEME opacite par camp, pour apparaitre/persister ensemble). max(openingReveal, ancienne
  // valeur de beat) : poses des l'ouverture, jamais en-dessous, la logique de flux/pulse par beat reste
  // intacte (elle continue de piloter les ondes/filets, cf plus bas).
  const rsfTokenOp = Math.max(0, Math.min(1, Math.max(openingReveal, medallionScale * Math.max(0.4, rsfFlowFade))));
  const safTokenOp = Math.max(0, Math.min(1, Math.max(openingReveal, Math.max(safMedallionScale, safMedallionScaleB3 * (0.7 + 0.3 * safRenforce)))));

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

          {/* GLOWS TERRITORIAUX — le Soudan "porte" la guerre civile (RSF Darfour / SAF Khartoum-Nil)
              au lieu de rester un territoire vide. Poses APRES les pays, AVANT les jetons/drapeaux
              pour rester lisibles derriere le contenu ancre-point. Apparaissent avec leur jeton, PERSISTENT. */}
          {pRSF && (
            <TerritoryGlow x={pRSF.x} y={pRSF.y} color={RSF_RED} op={rsfTokenOp} frame={frame} id="a4glowRSF" />
          )}
          {pSAF && (
            <TerritoryGlow x={pSAF.x} y={pSAF.y} color={SAF_BLUE} op={safTokenOp} frame={frame} id="a4glowSAF" />
          )}

          {/* SOLDATS / CHARS (SVG group) — rendus en HTML apres le </svg> (comme les portraits), voir bloc
              MilitaryToken plus bas. Ici on ne pose que les glows/jetons ancres-SVG. */}

          {/* RUSSIE — drapeau, pose au B1, PERSISTE jusqu'a la fin */}
          {russiaFeature && russiaReveal > 0.01 && (
            <GlobeFlagFill feature={russiaFeature} proj={proj} path={path} flagCode="ru" reveal={russiaReveal} glow="#c74d4d" />
          )}
          {/* Russie — souffle de frontiere + contour persistant lumineux respirant (pattern B6) */}
          {russiaFeature && russiaBorderPulse > 0.01 && russiaBorderPulse < 1 && (
            <BorderPulse d={path(russiaFeature as any) || ""} pulse={russiaBorderPulse} color="#e08a8a" />
          )}
          {russiaFeature && russiaBorderOn > 0.01 && (() => {
            const d = path(russiaFeature as any); if (!d) return null;
            const breathe = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin((frame - T.troisiemePays) / 11));
            return <path d={d} fill="none" stroke="#e08a8a" strokeWidth={2.2} strokeOpacity={russiaBorderOn * breathe * 0.85}
              strokeLinejoin="round" filter="url(#a4fusedGlow)" />;
          })()}

          {/* EGYPTE — drapeau, pose au B3, renforce leger au B4, PERSISTE */}
          {egypteFeature && egypteRevealFinal > 0.01 && (
            <GlobeFlagFill feature={egypteFeature} proj={proj} path={path} flagCode="eg" reveal={egypteRevealFinal} glow="#7fae6a" />
          )}
          {/* RESPIRATION NIL : pendant la fenetre, l'Egypte prend le MEME aplat creme que le Soudan
              (le drapeau s'efface via egypteRevealFinal*(1-nilBreath)) -> la vallee Soudan+Egypte devient
              un seul aplat clair et le trace bleu du Nil ressort nettement. Retour du drapeau ensuite. */}
          {egypteFeature && nilBreath > 0.01 && (
            <path
              d={path(egypteFeature as any) || ""}
              fill={t.sudanFill}
              fillOpacity={nilBreath}
              stroke={t.sudanStroke}
              strokeWidth={0.9}
              strokeOpacity={0.6 * nilBreath}
            />
          )}
          {/* Egypte — souffle de frontiere + contour persistant lumineux respirant (pattern B6). Le
              contour suit egypteRevealFinal -> s'eteint pendant la RESPIRATION NIL comme le drapeau. */}
          {egypteFeature && egypteBorderPulse > 0.01 && egypteBorderPulse < 1 && (
            <BorderPulse d={path(egypteFeature as any) || ""} pulse={egypteBorderPulse} color="#a8d090" />
          )}
          {egypteFeature && egypteBorderOn > 0.01 && egypteRevealFinal > 0.01 && (() => {
            const d = path(egypteFeature as any); if (!d) return null;
            const breathe = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin((frame - T.egypteNommee) / 11));
            return <path d={d} fill="none" stroke="#a8d090" strokeWidth={2.2}
              strokeOpacity={egypteBorderOn * egypteRevealFinal * breathe * 0.85}
              strokeLinejoin="round" filter="url(#a4fusedGlow)" />;
          })()}

          {/* TOUS LES FLUX/ARCS regroupes sous un g dont l'opacite tombe a 0 pendant la RESPIRATION NIL
              (retour Aziz : effacer les fleches ~2-3s pour voir le trace du Nil, puis les remettre). */}
          <g opacity={fluxBreathe}>
          {/* FLUX ANCIEN Moscou -> RSF (B1, s'estompe mais ne s'efface JAMAIS totalement) */}
          {rsfFlowProg > 0.01 && (
            <g>
              <path
                d={windingPathD(proj, path, MOSCOU, RSF_TOKEN, rsfFlowProg, -2.2, 1)}
                fill="none"
                stroke={RSF_RED}
                strokeWidth={3.2}
                strokeOpacity={0.85 * rsfFlowFade}
                strokeLinecap="round"
                strokeDasharray={rsfFlowFade < 0.5 ? "5 7" : undefined}
              />
              {/* filet lumineux qui coule (Moscou -> jeton) une fois le trace bien avance */}
              {rsfFlowProg > 0.9 && (
                <path
                  d={windingPathD(proj, path, MOSCOU, RSF_TOKEN, 1, -2.2, 1)}
                  fill="none"
                  stroke="#E8776B"
                  strokeWidth={2.4}
                  strokeOpacity={0.6 * rsfFlowFade}
                  strokeDasharray="5 26"
                  strokeDashoffset={-flowOffset}
                  strokeLinecap="round"
                />
              )}
            </g>
          )}

          {/* FLUX NET Moscou -> SAF (B1, 2024, tient et PERSISTE) */}
          {safFlowProg > 0.01 && (
            <g>
              <path
                d={windingPathD(proj, path, MOSCOU, SAF_TOKEN, safFlowProg, 1.8, 1)}
                fill="none"
                stroke={SAF_BLUE}
                strokeWidth={3.6}
                strokeOpacity={safFlowOp}
                strokeLinecap="round"
              />
              {/* filet lumineux qui coule (Moscou -> jeton) une fois le trace bien avance */}
              {safFlowProg > 0.9 && (
                <path
                  d={windingPathD(proj, path, MOSCOU, SAF_TOKEN, 1, 1.8, 1)}
                  fill="none"
                  stroke="#7FC8F0"
                  strokeWidth={2.6}
                  strokeOpacity={0.65 * safFlowOp}
                  strokeDasharray="5 26"
                  strokeDashoffset={-flowOffset}
                  strokeLinecap="round"
                />
              )}
            </g>
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
          </g>

          {/* Jetons RSF/SAF : PULSE d'arrivee du flux seul reste en SVG (halo geo-ancre). Le disque-visage
              (PortraitToken) est rendu en HTML apres le </svg> (cf plus bas), meme pattern que GeoPlaque. */}
          {pRSF && medallionScale > 0.01 && rsfPulse > 0 && (
            <>
              <circle cx={pRSF.x} cy={pRSF.y} r={17 + 34 * rsfPulse} fill={RSF_RED} opacity={0.28 * (1 - rsfPulse)} />
              <circle cx={pRSF.x} cy={pRSF.y} r={17 + 16 * rsfPulse} fill="none" stroke={RSF_RED} strokeWidth={2.5} opacity={0.7 * (1 - rsfPulse)} />
            </>
          )}
          {pSAF && (safMedallionScale > 0.01 || safMedallionScaleB3 > 0.01) && Math.max(safPulse, arcPulse) > 0 && (
            <>
              <circle cx={pSAF.x} cy={pSAF.y} r={17 + 34 * Math.max(safPulse, arcPulse)} fill={SAF_BLUE} opacity={0.28 * (1 - Math.max(safPulse, arcPulse))} />
              <circle cx={pSAF.x} cy={pSAF.y} r={17 + 16 * Math.max(safPulse, arcPulse)} fill="none" stroke={SAF_BLUE} strokeWidth={2.5} opacity={0.7 * (1 - Math.max(safPulse, arcPulse))} />
            </>
          )}

          {/* BASE NAVALE + NAVIRE ENCRE a Port-Soudan (B2, PERSISTE) */}
          {pPortSoudan && portSoudanReveal > 0.01 && (
            <>
              <NavireEncreAuGlobe
                x={pPortSoudan.x + 78 * (cam.scaleMul / 3.4)}
                y={pPortSoudan.y + 48 * (cam.scaleMul / 3.4)}
                reveal={portSoudanReveal}
                frame={frame}
                camScale={cam.scaleMul}
              />
              <NavalBaseIcon x={pPortSoudan.x} y={pPortSoudan.y} reveal={portSoudanReveal} pulse={portSoudanPulse} />
            </>
          )}

          {/* LE NIL (B4, motif) — trace reel Soudan->Egypte, revele sud->nord. Plus BRILLANT (retour Aziz) :
              triple couche (halo bleu-electrique large + trait azur epais + coeur clair) + filet lumineux
              qui COULE le long du fleuve = "le Nil vit". nilBoost renforce l'eclat pendant la respiration. */}
          {nilD && (
            <g opacity={nilPulse}>
              {/* halo diffus large (glow bleu electrique) */}
              <path d={nilD} fill="none" stroke={NIL_GLOW} strokeWidth={12 * nilBoost} strokeOpacity={0.30 * nilBoost} strokeLinecap="round" filter="url(#a4fusedGlow)" />
              <path d={nilD} fill="none" stroke={NIL_GLOW} strokeWidth={7} strokeOpacity={0.35 * nilBoost} strokeLinecap="round" filter="url(#a4fusedGlow)" />
              {/* trait principal azur, plus epais */}
              <path d={nilD} fill="none" stroke={NIL_BLUE} strokeWidth={3.8} strokeOpacity={0.98} strokeLinecap="round" />
              {/* coeur clair (le courant) */}
              <path d={nilD} fill="none" stroke={NIL_CORE} strokeWidth={1.4} strokeOpacity={0.85 * nilBoost} strokeLinecap="round" />
              {/* filet lumineux qui coule vers le nord (dashes qui defilent) — le fleuve s'ecoule */}
              <path d={nilD} fill="none" stroke={NIL_CORE} strokeWidth={2.4} strokeOpacity={0.7}
                strokeDasharray="6 30" strokeDashoffset={-flowOffset} strokeLinecap="round" />
            </g>
          )}

          {/* GEOPLAQUES (GeoPlaqueSVG, unification 2026-07-21) — labels geo-ancres, DANS le svg
              (le composant partage est rendu en SVG, pas en HTML). Meme x/y/op/accent/dy que
              l'ancien GeoPlaque local ; persistent une fois posees. */}
          {/* PLAQUES VILLES/PAYS = EPHEMERES (retour Aziz : Moscou/Port-Soudan/Le Caire tiennent ~2s puis
              disparaissent, elles ne servent a rien tout le long — surtout avec plus de jetons). Chacune
              fade-in a sa nomination, tient ~2s, fade-out. Le DRAPEAU qui remplit le pays reste la reference
              permanente. `*Ephem` = enveloppe temporelle multipliant l'opacite de reveal existante. */}
          {pMoscou && <GeoPlaqueSVG x={pMoscou.x} y={pMoscou.y} label="Moscou" op={russiaReveal * moscouEphem} accent="#c74d4d" dy={-30} />}
          {pPortSoudan && <GeoPlaqueSVG x={pPortSoudan.x} y={pPortSoudan.y} label="Port-Soudan" op={portSoudanReveal * portSoudanEphem} accent={t.flowMetal} dy={38} />}
          {pEgypte && <GeoPlaqueSVG x={pEgypte.x} y={pEgypte.y} label="Le Caire" op={egypteRevealFinal * caireEphem} accent="#7fae6a" dy={-30} />}

          {/* LABELS GENERAUX = PERSISTANTS (ancrage — retour Aziz : les jetons + leurs noms restent tout
              l'acte). Sous le portrait (dy positif). Poses des l'ouverture avec le jeton. */}
          {pRSF && <GeoPlaqueSVG x={pRSF.x} y={pRSF.y} label="Hemedti" op={rsfTokenOp} accent={RSF_RED} dy={44} fs={15} />}
          {pSAF && <GeoPlaqueSVG x={pSAF.x} y={pSAF.y} label="al-Burhan" op={safTokenOp} accent={SAF_BLUE} dy={44} fs={15} />}
        </g>

        <circle cx={cx} cy={cy} r={globeR} fill="none" stroke={t.sphereStroke} strokeWidth={1.5} strokeOpacity={0.4} />
      </svg>

      {/* ===== JETONS-PORTRAITS (visages Hemeti/Burhan, HTML overlay) — remplacent les medaillons-lettre
          RSF/SAF. Meme logique d'apparition/persistance/echelle que les anciens Medallion (op = echelle
          courante clampee 0..1). PAS de sprite Poutine dispo -> aucun jeton-visage a Moscou, seul le
          drapeau russe + le pulse d'arrivee (SVG) marquent le foyer. ===== */}
      {/* SOLDATS / CHARS autour de chaque camp (retour Aziz : montrer "la guerre" des le depart, sobre).
          Poses/persistants avec le meme op que leur camp. RSF (ouest/Darfour) + SAF (Khartoum/Nil). */}
      {RSF_UNITS.map((u, i) => {
        const p = projectPoint(proj, u.at, visible);
        if (!p) return null;
        return (
          <MilitaryToken key={`rsfu${i}`} x={p.x} y={p.y} sprite={u.sprite} op={rsfTokenOp}
            frame={frame} appear={T.b1Start + 6 + i * 6} size={u.size} />
        );
      })}
      {SAF_UNITS.map((u, i) => {
        const p = projectPoint(proj, u.at, visible);
        if (!p) return null;
        return (
          <MilitaryToken key={`safu${i}`} x={p.x} y={p.y} sprite={u.sprite} op={safTokenOp}
            frame={frame} appear={T.b1Start + 6 + i * 6} size={u.size} />
        );
      })}

      {pRSF && (
        <PortraitToken
          x={pRSF.x}
          y={pRSF.y}
          sprite="portrait-hemeti"
          border={RSF_RED}
          op={rsfTokenOp}
          size={60}
        />
      )}
      {pSAF && (
        <PortraitToken
          x={pSAF.x}
          y={pSAF.y}
          sprite="portrait-burhan"
          border={SAF_BLUE}
          op={safTokenOp}
          size={60}
        />
      )}

      {/* PLAQUE SOURCE (passe finale polish, 2026-07-22, migree depuis l'ancien SoudanActe4.tsx perime
          vers ce fichier ACTIF) — accord base navale chiffre (25 ans/300 soldats/4 navires/nucleaire),
          calee sur le dernier fait du bloc B2 ("Soudan pas signe"). Bas de cadre reserve aux SOURCES
          uniquement (bandeau discret coin bas-droite, pas un sous-titre plein largeur). */}
      <SourcePlaque frame={frame} appear={T.soudanPasSigne + 15} text="Asharq Al-Awsat, 2026" />
    </AbsoluteFill>
  );
};

// SourcePlaque — bandeau SOURCE discret, bas-droite, 1 ligne, style sobre parchemin (recette exacte
// SoudanActe3GlobeInsert.tsx, recopiee a l'identique). Fade in 10f / hold 54f / fade out 12f = ~1.8s.
const SourcePlaque: React.FC<{ text: string; appear: number; frame: number; holdFrames?: number }> = ({ text, appear, frame, holdFrames = 54 }) => {
  if (frame < appear || frame > appear + holdFrames + 12) return null;
  const op = interpolate(frame, [appear, appear + 10, appear + holdFrames, appear + holdFrames + 12], [0, 1, 1, 0], clampB);
  return (
    <div style={{ position: "absolute", right: 40, bottom: 40, opacity: op, pointerEvents: "none",
      background: "rgba(242,229,200,0.86)", border: "1px solid rgba(58,42,24,0.35)", borderRadius: 4,
      padding: "5px 12px", maxWidth: 620, boxShadow: "0 2px 6px rgba(0,0,0,0.25)" }}>
      <span style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 600, color: "#3A2A18",
        letterSpacing: 0.2, whiteSpace: "nowrap" }}>
        {text}
      </span>
    </div>
  );
};

export default SoudanActe4B1toB4Globe;
