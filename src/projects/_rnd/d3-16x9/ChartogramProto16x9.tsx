import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  spring,
} from "remotion";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import world110m from "../../../../public/_rnd/vox-repro/countries-110m.json";

export const CHARTOGRAM_FRAMES = 300; // 10s

// ---------------------------------------------------------------------------
// PROTO R&D — CHARTOGRAM (vrai MORPHING GEOGRAPHIQUE).
// La FORME REELLE d'un pays (polygone D3 geo) SE DEFORME en une barre
// proportionnelle a sa donnee. La carte DEVIENT la donnee.
//
// Methode (deterministe) :
//  1. projeter le contour du Soudan -> polyligne de points pixel.
//  2. REECHANTILLONNER ce contour a N points equidistants (perimetre).
//  3. construire une forme-cible (rectangle-barre) AUSSI a N points, meme sens.
//  4. interpoler point-a-point (lerp) entre les 2 -> le pays "coule" en barre.
// Aucun Math.random ; tout est fonction de la frame.
// ---------------------------------------------------------------------------

const W = 1920;
const H = 1080;

const COL = {
  bg0: "#0b1220",
  bg1: "#131f33",
  ink: "#e8dcc0",
  gold: "#e8b44a",
  danger: "#d6552e",
  land: "#c8a45e",
  muted: "#6b7d94",
};

type Pt = [number, number];

// distance perimetrique cumulee -> reechantillonnage a N points equidistants
function resample(points: Pt[], N: number): Pt[] {
  // longueurs cumulees
  const cum: number[] = [0];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i][0] - points[i - 1][0];
    const dy = points[i][1] - points[i - 1][1];
    cum.push(cum[i - 1] + Math.hypot(dx, dy));
  }
  const total = cum[cum.length - 1];
  const out: Pt[] = [];
  for (let k = 0; k < N; k++) {
    const target = (k / N) * total;
    // trouver le segment
    let i = 1;
    while (i < cum.length && cum[i] < target) i++;
    if (i >= points.length) i = points.length - 1;
    const seg = cum[i] - cum[i - 1] || 1;
    const t = (target - cum[i - 1]) / seg;
    out.push([
      points[i - 1][0] + (points[i][0] - points[i - 1][0]) * t,
      points[i - 1][1] + (points[i][1] - points[i - 1][1]) * t,
    ]);
  }
  return out;
}

// construit un rectangle (barre) ferme a N points, sens horaire, depart en haut-gauche
function rectPoints(x: number, y: number, w: number, h: number, N: number): Pt[] {
  const perim = 2 * (w + h);
  const corners: Pt[] = [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ];
  const segLen = [w, h, w, h];
  const cum = [0, w, w + h, w + h + w, perim];
  const out: Pt[] = [];
  for (let k = 0; k < N; k++) {
    const d = (k / N) * perim;
    let s = 0;
    while (s < 4 && cum[s + 1] < d) s++;
    const t = (d - cum[s]) / (segLen[s] || 1);
    const a = corners[s];
    const b = corners[(s + 1) % 4];
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
  }
  return out;
}

// aligne le point de depart de la barre sur celui de la forme geo (min distance)
function rotateToMatch(target: Pt[], ref: Pt): Pt[] {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < target.length; i++) {
    const d = Math.hypot(target[i][0] - ref[0], target[i][1] - ref[1]);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return [...target.slice(best), ...target.slice(0, best)];
}

const N = 200; // points de reechantillonnage

export const ChartogramProto16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { geoPts, barPts, centroidPx } = useMemo(() => {
    const fc = feature(world110m as any, (world110m as any).objects.countries) as any;
    const sudan = fc.features.find((f: any) => f.properties.name === "Sudan");

    const proj = geoMercator().fitExtent(
      [
        [W * 0.12, H * 0.16],
        [W * 0.42, H * 0.84],
      ],
      sudan,
    );
    const pathGen = geoPath(proj);

    // recuperer le ring principal projete en pixels
    const ring: Pt[] = sudan.geometry.coordinates[0].map(
      (c: [number, number]) => proj(c) as Pt,
    );
    const geoResampled = resample(ring, N);

    // centroide pixel
    const cen = pathGen.centroid(sudan) as Pt;

    // barre-cible : hauteur proportionnelle a une donnee (ex. deplaces), a droite
    const barW = 150;
    const barH = 560; // "grande" barre = donnee elevee
    const barX = W * 0.58;
    const barY = H * 0.5 - barH / 2;
    let bar = rectPoints(barX, barY, barW, barH, N);
    bar = rotateToMatch(bar, geoResampled[0]);

    return { geoPts: geoResampled, barPts: bar, centroidPx: cen };
  }, []);

  // phase morph : 0 (pays) -> 1 (barre), entre f110 et f200
  const morph = spring({
    frame: Math.max(0, frame - 110),
    fps,
    config: { mass: 1, damping: 18, stiffness: 42 },
    durationInFrames: 90,
  });

  // interpolation point-a-point
  const cur: Pt[] = geoPts.map((g, i) => [
    g[0] + (barPts[i][0] - g[0]) * morph,
    g[1] + (barPts[i][1] - g[1]) * morph,
  ]);
  const d = "M " + cur.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" L ") + " Z";

  // couleur : pays ocre -> barre or (la donnee)
  const fill = morph < 0.5 ? COL.land : COL.gold;

  // compteur de la donnee (apparait avec la barre)
  const val = Math.round(
    interpolate(morph, [0.3, 1], [0, 11], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * 10,
  ) / 10;

  return (
    <AbsoluteFill style={{ backgroundColor: COL.bg0 }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 40% 45%, ${COL.bg1} 0%, ${COL.bg0} 72%)`,
        }}
      />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <path
          d={d}
          fill={fill}
          fillOpacity={0.95}
          stroke={COL.ink}
          strokeWidth={2}
          strokeOpacity={0.7}
        />
        {/* label pays (fade out) */}
        <text
          x={centroidPx[0]}
          y={centroidPx[1]}
          fill={COL.ink}
          fontSize={30}
          fontFamily="Georgia, serif"
          fontWeight={600}
          textAnchor="middle"
          opacity={interpolate(morph, [0, 0.4], [1, 0], { extrapolateRight: "clamp" })}
        >
          SOUDAN
        </text>
        {/* valeur donnee (fade in avec la barre) */}
        {morph > 0.4 && (
          <text
            x={W * 0.58 + 75}
            y={H * 0.5 - 300}
            fill={COL.gold}
            fontSize={64}
            fontFamily="Georgia, serif"
            fontWeight={700}
            textAnchor="middle"
            opacity={(morph - 0.4) / 0.6}
          >
            {val.toFixed(1)}M
          </text>
        )}
      </svg>

      <div style={{ position: "absolute", left: 80, top: 70, color: COL.ink, fontFamily: "Georgia, serif" }}>
        <div style={{ fontSize: 24, letterSpacing: 3, opacity: 0.7 }}>LE PAYS DEVIENT LA DONNEE</div>
        <div style={{ fontSize: 42, fontWeight: 700 }}>Deplaces internes</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 54,
          textAlign: "center",
          color: COL.ink,
          fontFamily: "Georgia, serif",
          fontSize: 32,
          opacity: interpolate(frame, [200, 240], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        La forme du Soudan se deverse en un seul chiffre.
      </div>
    </AbsoluteFill>
  );
};
