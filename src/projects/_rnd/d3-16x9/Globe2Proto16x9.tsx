import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { geoInterpolate } from "d3-geo";
import {
  W,
  H,
  GLOBE_R,
  GRATICULE,
  worldFeatures,
  orthoAt,
  pathOf,
  isVisible,
  featureByName,
} from "./globeGeo";

export const GLOBE2_FRAMES = 420; // 14s @ 30fps

// ---------------------------------------------------------------------------
// PROTO R&D — GLOBE 2.0 (D3 geoOrthographic) frame-driven / deterministe.
// Ce que le globe 1.0 NE faisait pas, et qu'on prouve ici :
//  1. ARCS A OCCLUSION REELLE : un arc de flux (geodesique geoInterpolate) passe
//     DERRIERE la sphere quand il franchit l'horizon — on ne dessine que les
//     segments dont les 2 extremites sont sur l'hemisphere visible (isVisible).
//     -> les arcs sont VRAIMENT sur un globe 3D, pas colles par-dessus.
//  2. VILLES QUI S'ALLUMENT (points + halo pulsant), masquees si cote cache.
//  3. TERMINATEUR JOUR/NUIT : un disque d'ombre decale = la nuit, qui derive.
//  4. Rotation frame-driven vers le carrefour Soudan + leger tilt.
//
// Sujet-cobaye : les routes de l'or / du soutien qui convergent vers le Soudan.
// ---------------------------------------------------------------------------

const COL = {
  space0: "#060a14",
  space1: "#0d1526",
  ocean: "#16324a",
  land: "#c8a45e",
  landStroke: "#3a2a18",
  graticule: "#2a4055",
  gold: "#e8b44a",
  goldHi: "#ffe39a",
  ink: "#e8dcc0",
  danger: "#d6552e",
  night: "#04060d",
};

interface Flux {
  from: [number, number]; // [lon,lat]
  to: [number, number];
  label: string;
  color: string;
  startF: number; // frame de depart du trace
}

// Carrefour = Khartoum. Sources qui convergent.
// NB pour l'occlusion : au moins UNE source lointaine (Asie de l'Est) dont l'arc
// traverse l'hemisphere CACHE -> il doit passer DERRIERE le globe (segments coupes).
const KHARTOUM: [number, number] = [32.5, 15.6];
const FLUX: Flux[] = [
  { from: [55.3, 25.2], to: KHARTOUM, label: "Emirats", color: COL.gold, startF: 70 }, // Dubai
  { from: [32.9, 39.9], to: KHARTOUM, label: "Ankara", color: COL.goldHi, startF: 100 }, // Ankara
  // Source a l'OPPOSE du globe (Pacifique/Oceanie) : sa geodesique vers Khartoum
  // traverse forcement l'hemisphere CACHE -> l'arc DISPARAIT derriere la sphere
  // puis reapparait cote visible. Preuve indeniable de l'occlusion.
  { from: [174.8, -41.3], to: KHARTOUM, label: "reseau lointain", color: COL.danger, startF: 120 }, // Nouvelle-Zelande
];

// Villes a allumer (lon,lat + label). La source lointaine n'a pas de pastille
// (elle est cote cache) — on montre juste son arc qui emerge de derriere.
const CITIES: { lonLat: [number, number]; label: string; f: number }[] = [
  { lonLat: KHARTOUM, label: "Khartoum", f: 40 },
  { lonLat: [55.3, 25.2], label: "Dubai", f: 70 },
  { lonLat: [32.9, 39.9], label: "Ankara", f: 100 },
];

// Cible de rotation = Khartoum (on l'amene au centre du globe).
const TARGET: [number, number] = KHARTOUM;

export const Globe2Proto16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = useMemo(() => worldFeatures(), []);

  // Rotation : depart depuis l'Atlantique, arrive sur Khartoum (spring doux).
  const rotProg = spring({
    frame,
    fps,
    config: { mass: 1, damping: 20, stiffness: 42 },
    durationInFrames: 90,
  });
  const startLon = -40;
  const rotLambda = interpolate(rotProg, [0, 1], [-startLon, -TARGET[0]]);
  const rotPhi = interpolate(rotProg, [0, 1], [-8, -TARGET[1] * 0.75]); // leger tilt

  const proj = useMemo(
    () => orthoAt(rotLambda, rotPhi),
    [rotLambda, rotPhi],
  );
  const path = useMemo(() => pathOf(proj), [proj]);

  // Terminateur jour/nuit : centre du disque d'ombre = anti-soleil, derive lentement.
  const sunLon = interpolate(frame, [0, GLOBE2_FRAMES], [40, -20]);
  const nightCenter: [number, number] = [sunLon + 180, -18];
  const nightPt = proj([nightCenter[0], nightCenter[1]]);
  const nightVisible = isVisible(nightCenter, rotLambda, rotPhi);

  // Helper : projeter un [lon,lat] en pixel (ou null si derriere).
  const projPt = (lonLat: [number, number]): [number, number] | null => {
    if (!isVisible(lonLat, rotLambda, rotPhi)) return null;
    const p = proj(lonLat);
    return p ? [p[0], p[1]] : null;
  };

  // Construit les segments VISIBLES d'un arc geodesique (occlusion).
  const arcSegments = (
    a: [number, number],
    b: [number, number],
    progress: number,
  ): string[] => {
    const N = 60;
    const nDraw = Math.max(2, Math.round(N * progress));
    const interp = geoInterpolate(a, b);
    const segs: string[] = [];
    let cur: string[] = [];
    for (let i = 0; i <= nDraw; i++) {
      const t = i / N;
      const ll = interp(t) as [number, number];
      const vis = isVisible(ll, rotLambda, rotPhi);
      if (vis) {
        const p = proj(ll);
        if (p) cur.push(`${p[0].toFixed(1)},${p[1].toFixed(1)}`);
      } else {
        if (cur.length >= 2) segs.push(cur.join(" "));
        cur = [];
      }
    }
    if (cur.length >= 2) segs.push(cur.join(" "));
    return segs;
  };

  const cx = W / 2;
  const cy = H / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: COL.space0 }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, ${COL.space1} 0%, ${COL.space0} 75%)`,
        }}
      />

      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <radialGradient id="oceanGrad" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#1d4363" />
            <stop offset="100%" stopColor={COL.ocean} />
          </radialGradient>
          <radialGradient id="atmo" cx="50%" cy="50%" r="50%">
            <stop offset="82%" stopColor="#6fb8e0" stopOpacity={0} />
            <stop offset="97%" stopColor="#6fb8e0" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#6fb8e0" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="nightGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COL.night} stopOpacity={0.62} />
            <stop offset="70%" stopColor={COL.night} stopOpacity={0.45} />
            <stop offset="100%" stopColor={COL.night} stopOpacity={0} />
          </radialGradient>
          <clipPath id="globeClip">
            <circle cx={cx} cy={cy} r={GLOBE_R} />
          </clipPath>
          <filter id="cityGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* halo atmospherique */}
        <circle cx={cx} cy={cy} r={GLOBE_R + 14} fill="url(#atmo)" />

        {/* sphere ocean */}
        <circle cx={cx} cy={cy} r={GLOBE_R} fill="url(#oceanGrad)" />

        <g clipPath="url(#globeClip)">
          {/* graticule */}
          <path
            d={path(GRATICULE as any) || ""}
            fill="none"
            stroke={COL.graticule}
            strokeWidth={0.6}
            opacity={0.5}
          />

          {/* pays (l'ortho clippe nativement l'hemisphere cache) */}
          {features.map((f, i) => {
            const isSudan = f.properties.name === "Sudan" || f.properties.name === "S. Sudan";
            return (
              <path
                key={i}
                d={path(f as any) || ""}
                fill={isSudan ? "#d8b878" : COL.land}
                stroke={COL.landStroke}
                strokeWidth={0.5}
                strokeOpacity={0.6}
              />
            );
          })}

          {/* terminateur nuit : disque d'ombre centre sur l'anti-soleil, clippe au globe */}
          {nightVisible && nightPt && (
            <circle
              cx={nightPt[0]}
              cy={nightPt[1]}
              r={GLOBE_R * 1.05}
              fill="url(#nightGrad)"
            />
          )}

          {/* ARCS A OCCLUSION : seuls les segments visibles sont traces */}
          {FLUX.map((flx, i) => {
            const prog = interpolate(
              frame,
              [flx.startF, flx.startF + 55],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            if (prog <= 0.01) return null;
            const segs = arcSegments(flx.from, flx.to, prog);
            const flow = (frame * 2) % 40;
            return (
              <g key={`arc${i}`}>
                {segs.map((pts, j) => (
                  <polyline
                    key={j}
                    points={pts}
                    fill="none"
                    stroke={flx.color}
                    strokeWidth={3}
                    strokeOpacity={0.9}
                    strokeLinecap="round"
                  />
                ))}
                {/* gouttes qui filent sur les segments visibles */}
                {prog > 0.95 &&
                  segs.map((pts, j) => (
                    <polyline
                      key={`f${j}`}
                      points={pts}
                      fill="none"
                      stroke={COL.goldHi}
                      strokeWidth={4}
                      strokeOpacity={0.85}
                      strokeDasharray="4 36"
                      strokeDashoffset={-flow}
                      strokeLinecap="round"
                    />
                  ))}
              </g>
            );
          })}

          {/* VILLES qui s'allument (masquees si cote cache) */}
          {CITIES.map((c, i) => {
            const pt = projPt(c.lonLat);
            if (!pt) return null;
            const app = spring({
              frame: Math.max(0, frame - c.f),
              fps,
              config: { mass: 1, damping: 12, stiffness: 100 },
              durationInFrames: 24,
            });
            if (app <= 0.01) return null;
            const pulse = 1 + 0.35 * Math.sin(frame / 8 + i);
            const isHub = c.label === "Khartoum";
            const col = isHub ? COL.danger : COL.gold;
            return (
              <g key={c.label} transform={`translate(${pt[0]} ${pt[1]})`} opacity={app}>
                <circle r={(isHub ? 9 : 6) * pulse} fill={col} opacity={0.28} />
                <circle r={isHub ? 6 : 4} fill={col} filter="url(#cityGlow)" stroke={COL.ink} strokeWidth={1} />
                <text
                  x={0}
                  y={-16}
                  fill={COL.ink}
                  fontSize={22}
                  fontFamily="Georgia, serif"
                  fontWeight={600}
                  textAnchor="middle"
                  stroke={COL.space0}
                  strokeWidth={0.5}
                >
                  {c.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* liseré du globe */}
        <circle
          cx={cx}
          cy={cy}
          r={GLOBE_R}
          fill="none"
          stroke="#6fb8e0"
          strokeWidth={1.5}
          strokeOpacity={0.4}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 54,
          textAlign: "center",
          color: COL.ink,
          fontFamily: "Georgia, serif",
          fontSize: 34,
          letterSpacing: 1,
          opacity: interpolate(frame, [150, 190], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Les routes du soutien convergent vers un seul point.
      </div>
    </AbsoluteFill>
  );
};
