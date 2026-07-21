import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Audio,
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
import { type LonLat } from "./geoArc";
import { camAt, type CamKey } from "./globeCamera";
import { THEMES, GlobeFlagFill } from "./SoudanActe3GlobeProto16x9";

// Palette = THEMES.mixte (source de verite unique du globe Soudan, coherence Actes 3/5/6).
const t = THEMES.mixte;

// ============================================================================================
// ACTE 4 — BEAT 4 "Le motif egyptien" (le Nil se surligne) — GLOBE D3.
//
// Script (verifie, rien invente) :
// "L'Egypte n'agit pas par solidarite, mais par calcul. Le Nil traverse les deux pays, et elle
// redoute de voir le Soudan basculer sous une influence rivale. Pour l'Egypte, le Soudan n'est
// pas seulement un voisin. C'est une profondeur strategique."
//
// INTENTION : montrer le MOTIF geographique, aucun nouveau marqueur/flux. Le TRACE DU NIL (deja
// geographiquement present, on ne l'invente pas — cours reel Soudan->Egypte) PULSE et SE
// SURLIGNE du Soudan (sud) jusqu'a son delta en Egypte (nord) pendant "Le Nil traverse les deux
// pays". Camera STABLE sur l'ensemble Egypte-Soudan-mer Rouge (contraste volontaire avec le
// mouvement des beats precedents = on nomme la CAUSE, pas un fait nouveau).
//
// Timing = forced-alignment reel de l'audio p3 (whisper-p3.ts). BEAT4 demarre a 18.76s DANS p3
// (p3 contient B3 0-18.76s PUIS B4 18.76-33.42s) — on ne joue QUE la portion B4 via startFrom.
// ============================================================================================

const FPS = 30;

// Jalons ABSOLUS dans p3 (soudanActe4Timing.ts BEAT4), en secondes.
const P3_B4_START_S = 18.76;
const P3_NIL_NOMME_S = 22.6;
const P3_REDOUTE_INFLUENCE_S = 24.62;
const P3_PROFONDEUR_STRATEGIQUE_S = 31.86;
const P3_END_S = 33.42;

// Jalons RELATIFS au debut du beat (= debut audio joue), en frames.
const T = {
  start: 0,
  nilNomme: Math.round((P3_NIL_NOMME_S - P3_B4_START_S) * FPS), // ~115f / 3.84s — le Nil pulse/se surligne
  redouteInfluence: Math.round((P3_REDOUTE_INFLUENCE_S - P3_B4_START_S) * FPS), // ~176f / 5.86s
  profondeurStrategique: Math.round((P3_PROFONDEUR_STRATEGIQUE_S - P3_B4_START_S) * FPS), // ~393f / 13.1s
  end: Math.round((P3_END_S - P3_B4_START_S) * FPS), // ~440f / 14.66s
};

// Duree = portion B4 reelle + petite queue de raccord (insert Kosti B5 suit, cut/fade acceptable).
export const ACTE4_B4_FRAMES = T.end + 20;

// --- Le Nil : polyligne geo reelle (pas dans le TopoJSON pays, on la trace nous-memes).
// Sud (confluence Khartoum) -> nord (delta Mediterranee), coords verifiees (Wikipedia/geo reelle).
const NIL: LonLat[] = [
  [32.5, 15.6], // confluence Khartoum (Nil Bleu + Nil Blanc)
  [33.9, 17.7], // Atbara (dernier affluent)
  [30.9, 19.6], // grande boucle du Nil (Nubie, Soudan nord)
  [31.3, 21.8], // Wadi Halfa (frontiere Soudan/Egypte)
  [32.9, 24.1], // Assouan (Egypte)
  [32.6, 25.7], // Louxor
  [31.6, 27.2], // Assiout
  [31.2, 30.0], // Le Caire
  [31.0, 31.4], // delta, Mediterranee
];

// Echantillonnage CATMULL-ROM (spline lisse passant par tous les points de controle) — remplace
// l'interpolation lineaire qui rendait le fleuve ANGULEUX/zigzag. La courbe est douce comme un vrai
// cours d'eau, tout en passant exactement par les reperes geo (Khartoum, Assouan, Le Caire, delta).
function catmullRom(p0: LonLat, p1: LonLat, p2: LonLat, p3: LonLat, f: number): LonLat {
  const f2 = f * f;
  const f3 = f2 * f;
  const lon =
    0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * f + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * f2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * f3);
  const lat =
    0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * f + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * f2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * f3);
  return [lon, lat];
}
function densifyNil(pts: LonLat[], perSegment = 14): LonLat[] {
  const out: LonLat[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]; // extremites : dupliquer le point de bord (tangente naturelle)
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? pts[i + 1];
    for (let s = 0; s < perSegment; s++) {
      out.push(catmullRom(p0, p1, p2, p3, s / perSegment));
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}
const NIL_DENSE: LonLat[] = densifyNil(NIL);

// Chemin SVG de la portion revelee [0..reveal] du Nil (sud->nord), projete/clippe par geoPath.
function nilPathD(path: (o: any) => string | null, reveal: number): string {
  const r = Math.max(0, Math.min(1, reveal));
  if (r <= 0) return "";
  const cut = Math.max(1, Math.round(NIL_DENSE.length * r));
  const d = path({ type: "LineString", coordinates: NIL_DENSE.slice(0, cut + 1) } as any);
  return d || "";
}

// --- Camera : STABLE (exigence script — on nomme la cause, pas un fait nouveau visuel majeur).
// Cadre Egypte + Soudan + mer Rouge ensemble, leger mouvement seulement (pas de dezoom/rotation
// marques). Raccord entree = fin B3 (globe deja pose region Soudan/Egypte, cf B3 dans meme p3).
function buildActe4B4Cam(): CamKey[] {
  return [
    // ENTREE : cadre large Egypte-Soudan-mer Rouge, pose (continuite avec B3 qui vient de nommer l'Egypte).
    { frame: T.start, lon: 32, lat: 22, scaleMul: 1.75 },
    // leger resserre au moment ou le Nil se nomme/surligne — accompagne sans casser la stabilite.
    { frame: T.nilNomme, lon: 32, lat: 22, scaleMul: 1.8 },
    { frame: T.redouteInfluence, lon: 31.5, lat: 23, scaleMul: 1.85 },
    // "profondeur strategique" : phrase coup de poing — camera quasi figee, Egypte+Soudan cadres ensemble.
    { frame: T.profondeurStrategique, lon: 31.5, lat: 23.5, scaleMul: 1.9 },
    { frame: ACTE4_B4_FRAMES, lon: 31.5, lat: 23.5, scaleMul: 1.9 },
  ];
}
const CAM = buildActe4B4Cam();

const NIL_BLUE = "#7FC8E8"; // stroke lumineux du Nil (distinct du bleu ocean, distinct de l'or des flux)

export const SoudanActe4B4Nil: React.FC = () => {
  const frame = useCurrentFrame();
  const features = useMemo(() => worldFeatures(), []);

  const cam = camAt(CAM, frame);
  const rotLambda = -cam.lon;
  const rotLat = -cam.lat;
  const globeR = GLOBE_R * cam.scaleMul;
  const proj = useMemo(
    () => orthoAt(rotLambda, rotLat).scale(globeR),
    [rotLambda, rotLat, globeR],
  );
  const path = useMemo(() => pathOf(proj), [proj]);

  const egyptFeature = useMemo(() => featureByName("Egypt"), []);

  const cx = W / 2;
  const cy = H / 2;

  // Le Nil se REVELE du sud (Khartoum) vers le nord (delta) pendant "Le Nil traverse les deux pays".
  const nilReveal = interpolate(frame, [T.nilNomme, T.nilNomme + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nilD = nilPathD(path, nilReveal);

  // Pulse doux du trace une fois revele (le motif "vit" pendant qu'on parle de calcul strategique).
  const nilPulse = 0.75 + 0.25 * Math.sin(frame / 10);

  // L'Egypte se teinte doucement de son drapeau apres "elle redoute de voir le Soudan basculer"
  // (renforce "calcul egyptien" sans ajouter de marqueur — le pays lui-meme reagit).
  const egyptFlagReveal = interpolate(
    frame,
    [T.redouteInfluence, T.redouteInfluence + 30],
    [0, 0.55],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: t.bg }}>
      <Audio
        src={staticFile("_shared/audio/soudan/acte4-voisins-aspires-p3.mp3")}
        startFrom={Math.round(P3_B4_START_S * FPS)}
      />

      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, ${t.oceanOuter} 0%, ${t.bg} 78%)`,
        }}
      />

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="a4b4ocean" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor={t.oceanInner} />
            <stop offset="70%" stopColor={t.oceanMid} />
            <stop offset="100%" stopColor={t.oceanOuter} />
          </radialGradient>
          <radialGradient id="a4b4atmo" cx="50%" cy="50%" r="50%">
            <stop offset="82%" stopColor={t.atmoColor} stopOpacity={0} />
            <stop offset="97%" stopColor={t.atmoColor} stopOpacity={t.atmoOpacity} />
            <stop offset="100%" stopColor={t.atmoColor} stopOpacity={0} />
          </radialGradient>
          <clipPath id="a4b4clip">
            <circle cx={cx} cy={cy} r={globeR} />
          </clipPath>
          <filter id="a4b4glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* halo atmospherique */}
        <circle cx={cx} cy={cy} r={globeR + 14} fill="url(#a4b4atmo)" />
        {/* sphere ocean */}
        <circle cx={cx} cy={cy} r={globeR} fill="url(#a4b4ocean)" />

        <g clipPath="url(#a4b4clip)">
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

          {/* Egypte se teinte doucement de son drapeau ("elle redoute...") — le pays lui-meme reagit,
              pas de marqueur ajoute. */}
          {egyptFeature && egyptFlagReveal > 0.01 && (
            <GlobeFlagFill
              feature={egyptFeature}
              proj={proj}
              path={path}
              flagCode="eg"
              reveal={egyptFlagReveal}
              glow={t.landActiveStroke}
            />
          )}

          {/* LE NIL — trace reel Soudan->Egypte, se revele sud->nord, pulse lumineux (le motif). */}
          {nilD && (
            <g opacity={nilPulse}>
              {/* halo large discret (le fleuve "vit") */}
              <path
                d={nilD}
                fill="none"
                stroke={NIL_BLUE}
                strokeWidth={7}
                strokeOpacity={0.22}
                strokeLinecap="round"
                filter="url(#a4b4glow)"
              />
              {/* trace net */}
              <path
                d={nilD}
                fill="none"
                stroke={NIL_BLUE}
                strokeWidth={2.6}
                strokeOpacity={0.95}
                strokeLinecap="round"
              />
            </g>
          )}
        </g>

        {/* lisere du globe */}
        <circle cx={cx} cy={cy} r={globeR} fill="none" stroke={t.sphereStroke} strokeWidth={1.5} strokeOpacity={0.4} />
      </svg>

      {/* Pas de sous-titre bas de cadre (retour Aziz : bas d'ecran reserve aux SOURCES uniquement,
          jamais de sous-titre qui repete la voix = effet "TikTok" proscrit). */}
    </AbsoluteFill>
  );
};
