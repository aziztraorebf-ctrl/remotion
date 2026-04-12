import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  delayRender,
  continueRender,
  staticFile,
} from "remotion";
import { evolvePath } from "@remotion/paths";
import * as d3Geo from "d3-geo";
import * as topojson from "topojson-client";

// ============================================================
// HistoricalMap — Carte animee Afrique de l'Ouest
// Format : 1080x1920 (Short vertical) | 30s @ 30fps = 900 frames
//
// PART 1 (0-300f) : Route Tombouctou -> Senegal
// PART 2 (300-600f) : Empire du Mali (bordures colorees + route de l'or)
// PART 3 (600-900f) : Deep zoom + icones SVG
// ============================================================

const W = 1080;
const H = 1920;

// -- Palette GeoAfrique --
const PAL = {
  bg: "#F5E6C8",
  land: "#D4CBB8",
  landStroke: "#B8A88C",
  oceanDeep: "#C8D8E4",
  oceanLight: "#D8E4EC",
  oceanLine: "rgba(160, 185, 210, 0.15)",
  gold: "#D4AF37",
  goldGlow: "rgba(212, 175, 55, 0.3)",
  goldPulse: "rgba(212, 175, 55, 0.15)",
  empireGold: "#E8C547",
  empireBorder: "#C9A227",
  empireGlow: "rgba(212, 175, 55, 0.12)",
  text: "#2C1810",
  textBg: "rgba(245, 230, 200, 0.85)",
  shadow: "rgba(80, 60, 30, 0.25)",
} as const;

// -- Villes Part 1 --
const CITIES_P1: { name: string; coords: [number, number]; labelOffset: [number, number] }[] = [
  { name: "Tombouctou", coords: [-3.0, 16.76], labelOffset: [14, -20] },
  { name: "Cote du Senegal", coords: [-17.44, 14.69], labelOffset: [-160, 18] },
];

// -- Ville Part 2 --
const NIANI: { name: string; coords: [number, number]; labelOffset: [number, number] } = {
  name: "Niani", coords: [-11.37, 11.37], labelOffset: [14, -20],
};

// -- Route 1 : Tombouctou -> Senegal --
const ROUTE1_COORDS: [number, number][] = [
  [-3.0, 16.76], [-5.5, 15.8], [-8.0, 14.5],
  [-11.5, 14.2], [-14.5, 14.5], [-17.44, 14.69],
];

// -- Route 2 : Niani -> Tombouctou (route de l'or) --
const ROUTE2_COORDS: [number, number][] = [
  [-11.37, 11.37], [-10.5, 12.5], [-8.5, 13.8],
  [-6.0, 15.0], [-4.5, 16.0], [-3.0, 16.76],
];

// -- ISO codes Empire du Mali (historique, territoire approximatif) --
// Mali, Senegal, Guinee, Gambie
const EMPIRE_MALI_ISO = [466, 686, 324, 270];

// -- ISO codes Afrique de l'Ouest --
const WEST_AFRICA_ISO = new Set([
  466, 562, 854, 288, 384, 694, 430, 624, 270, 324,
  686, 478, 768, 204, 566, 132, 180, 120, 140, 148,
]);

// -- Projection centree Afrique de l'Ouest --
function makeProjection() {
  return d3Geo
    .geoMercator()
    .center([-10, 15.5])
    .scale(2200)
    .translate([W / 2, H * 0.42]);
}

interface CountryFeature {
  id: number;
  path: string;
}

// ── Hook chargement carte ────────────────────────────────────
function useMapData() {
  const [countries, setCountries] = React.useState<CountryFeature[]>([]);
  const [handle] = React.useState(() => delayRender("HistoricalMap load"));

  React.useEffect(() => {
    fetch(staticFile("assets/maps/countries-50m.json"))
      .then((r) => r.json())
      .then((topo) => {
        const geo = topojson.feature(
          topo,
          topo.objects.countries
        ) as unknown as GeoJSON.FeatureCollection;

        const proj = makeProjection();
        const pathGen = d3Geo.geoPath().projection(proj);

        const features: CountryFeature[] = geo.features
          .map((f) => {
            const d = pathGen(f);
            if (!d) return null;
            return { id: Number(f.id), path: d };
          })
          .filter(Boolean) as CountryFeature[];

        setCountries(features);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [handle]);

  return countries;
}

// ── Construire un SVG path courbe depuis des waypoints ───────
function buildCurvePath(
  coords: [number, number][],
  proj: d3Geo.GeoProjection
): string {
  const points = coords.map((c) => proj(c)).filter(Boolean) as [number, number][];
  if (points.length < 2) return "";

  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev[0] + curr[0]) / 2;
    const cpy = (prev[1] + curr[1]) / 2 - 15;
    d += ` Q ${cpx} ${cpy} ${curr[0]} ${curr[1]}`;
  }
  return d;
}

// ── Interpoler position sur des points projetes ──────────────
function getDotPosition(
  progress: number,
  points: [number, number][]
): { x: number; y: number } {
  if (points.length < 2) return { x: 0, y: 0 };
  const total = points.length - 1;
  const seg = Math.min(Math.floor(progress * total), total - 1);
  const t = progress * total - seg;
  const a = points[seg];
  const b = points[Math.min(seg + 1, points.length - 1)];
  return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t };
}

// ── Ocean vivant ─────────────────────────────────────────────
function OceanWaves({ frame }: { frame: number }) {
  const lines: React.ReactNode[] = [];
  const lineCount = 20;
  const spacing = H / lineCount;

  for (let i = 0; i < lineCount; i++) {
    const y = i * spacing;
    const phase = i * 0.4 + frame * 0.03;
    const amplitude = 3 + Math.sin(i * 0.2) * 2;

    let d = `M 0 ${y}`;
    for (let x = 0; x <= W; x += 40) {
      const dy = Math.sin(phase + x * 0.008) * amplitude;
      d += ` L ${x} ${y + dy}`;
    }

    lines.push(
      <path key={i} d={d} fill="none" stroke={PAL.oceanLine} strokeWidth={1.5} />
    );
  }
  return <>{lines}</>;
}

// ── Pulse ring ───────────────────────────────────────────────
function PulseRing({ cx, cy, frame, startFrame }: {
  cx: number; cy: number; frame: number; startFrame: number;
}) {
  const local = frame - startFrame;
  if (local < 0) return null;

  const PERIOD = 60;
  const rings = [0, 20, 40];

  return (
    <>
      {rings.map((offset, i) => {
        const t = ((local - offset) % PERIOD + PERIOD) % PERIOD;
        const progress = t / PERIOD;
        const r = 8 + progress * 35;
        const opacity = (1 - progress) * 0.4;
        if (local < offset) return null;
        return (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={PAL.gold} strokeWidth={1.5} opacity={opacity}
          />
        );
      })}
    </>
  );
}

// ── Route animee (reutilisable) ──────────────────────────────
function AnimatedRoute({ path, progress }: { path: string; progress: number }) {
  if (!path || progress <= 0) return null;
  const { strokeDasharray, strokeDashoffset } = evolvePath(progress, path);

  return (
    <>
      <path d={path} fill="none" stroke={PAL.goldGlow} strokeWidth={14}
        strokeLinecap="round" strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
      />
      <path d={path} fill="none" stroke={PAL.gold} strokeWidth={4}
        strokeLinecap="round" strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
      />
    </>
  );
}

// ── Label ville ──────────────────────────────────────────────
function CityLabel({ name, pos, offset, appear }: {
  name: string; pos: [number, number]; offset: [number, number]; appear: number;
}) {
  return (
    <g opacity={appear} transform={`translate(${pos[0]}, ${pos[1]})`}>
      <circle r={6} fill={PAL.gold} stroke="#FFFFFF" strokeWidth={2} />
      <g transform={`translate(${offset[0]}, ${offset[1]})`}>
        <rect x={-6} y={-16} width={name.length * 12 + 16} height={26}
          rx={4} fill={PAL.textBg} stroke={PAL.gold} strokeWidth={1}
        />
        <text x={2} y={2} fontFamily="Georgia, serif" fontSize={16}
          fontWeight="bold" fill={PAL.text}
        >{name}</text>
      </g>
    </g>
  );
}

// ── Icone PNG (Gemini) sur la carte ──────────────────────────
function MapIcon({ x, y, src, size, appear }: {
  x: number; y: number; src: string; size: number; appear: number;
}) {
  if (appear <= 0) return null;
  const half = size / 2;
  return (
    <g opacity={appear} transform={`translate(${x}, ${y}) scale(${appear})`}>
      <image
        href={staticFile(src)}
        x={-half}
        y={-half}
        width={size}
        height={size}
      />
    </g>
  );
}

// ── Composant principal ──────────────────────────────────────
export const HistoricalMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const countries = useMapData();
  const proj = React.useMemo(() => makeProjection(), []);

  // -- Routes --
  const route1Path = React.useMemo(() => buildCurvePath(ROUTE1_COORDS, proj), [proj]);
  const route2Path = React.useMemo(() => buildCurvePath(ROUTE2_COORDS, proj), [proj]);

  // -- Points projetes --
  const r1Points = React.useMemo(
    () => ROUTE1_COORDS.map((c) => proj(c)).filter(Boolean) as [number, number][],
    [proj]
  );
  const r2Points = React.useMemo(
    () => ROUTE2_COORDS.map((c) => proj(c)).filter(Boolean) as [number, number][],
    [proj]
  );

  const startPt = r1Points[0] ?? [W / 2, H * 0.42];
  const endPt = r1Points[r1Points.length - 1] ?? [W / 2, H * 0.42];
  const nianiPt = proj(NIANI.coords) ?? [W / 2, H * 0.55];
  const mapCenter: [number, number] = [W / 2, H * 0.42];

  // ================================================================
  // PART 1 : frames 0-300 (0-10s) — Route Tombouctou -> Senegal
  // ================================================================

  const mapOpacity = interpolate(frame, [0, 45], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // -- Camera Part 1 --
  const PULLBACK_END = 60;
  const BREATHE1_END = 90;
  const PAN1_END = 210;
  const SNAP1_END = 240;

  // Trace route 1
  const trace1 = interpolate(frame, [BREATHE1_END, PAN1_END], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // Dot route 1
  const dot1 = React.useMemo(() => getDotPosition(trace1, r1Points), [trace1, r1Points]);

  // ================================================================
  // PART 2 : frames 300-600 (10-20s) — Empire du Mali
  // ================================================================

  // Bordures colorees : chaque pays se colore en sequence (300-420f)
  const empireColors = EMPIRE_MALI_ISO.map((_, i) => {
    const colorStart = 300 + i * 30;
    return spring({
      frame: frame - colorStart,
      fps,
      config: { damping: 20, stiffness: 100 },
    });
  });

  // Empire glow pulse (510-600f)
  const empireGlowPulse = frame > 510
    ? 0.08 + Math.sin((frame - 510) * 0.12) * 0.06
    : 0;

  // Snap zoom sur Niani (360-390f)
  const nianiLabel = spring({
    frame: frame - 390,
    fps,
    config: { damping: 14, stiffness: 200 },
  });

  // Route 2 : Niani -> Tombouctou (420-510f)
  const trace2 = interpolate(frame, [420, 510], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // Dot route 2
  const dot2 = React.useMemo(() => getDotPosition(trace2, r2Points), [trace2, r2Points]);

  // ================================================================
  // PART 3 : frames 600-900 (20-30s) — Deep zoom + icones
  // ================================================================

  // Icone mosquee (apparait a 660f, pendant le deep zoom sur Tombouctou)
  const mosqueAppear = spring({
    frame: frame - 660,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  // Icone caravane (apparait a 690f, entre les deux villes)
  const caravanAppear = spring({
    frame: frame - 690,
    fps,
    config: { damping: 18, stiffness: 100 },
  });

  // Icone couronne Niani (apparait a 750f, apres pan vers Niani)
  const crownAppear = spring({
    frame: frame - 750,
    fps,
    config: { damping: 14, stiffness: 140 },
  });

  // Position caravane (milieu de la route 2)
  const caravanPt = proj([-7.0, 13.5]) ?? [W / 2, H * 0.5];

  // ================================================================
  // CAMERA COMPOSITE (30s)
  // ================================================================

  // -- ZOOM --
  let zoomScale: number;
  const breathe = Math.sin(frame * 0.08) * 0.006;

  if (frame <= PULLBACK_END) {
    // P1 Phase 1 : Pull back
    zoomScale = interpolate(frame, [0, PULLBACK_END], [1.35, 1.12], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }) + breathe;
  } else if (frame <= PAN1_END) {
    // P1 Phase 2-3 : cruise zoom
    zoomScale = interpolate(frame, [PULLBACK_END, PAN1_END], [1.12, 1.20], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    }) + breathe;
  } else if (frame <= 300) {
    // P1 Phase 4-5 : snap + hold
    const snap1 = spring({ frame: frame - PAN1_END, fps, config: { damping: 12, stiffness: 300 } });
    zoomScale = 1.20 + snap1 * 0.10 + breathe;
  } else if (frame <= 360) {
    // P2 : breathing on Senegal, start coloring
    zoomScale = 1.30 + breathe;
  } else if (frame <= 420) {
    // P2 : snap zoom to Niani
    const snapNiani = spring({ frame: frame - 360, fps, config: { damping: 14, stiffness: 200 } });
    zoomScale = 1.30 + snapNiani * 0.12 + breathe;
  } else if (frame <= 510) {
    // P2 : cruise during route 2 trace, slight pull back
    zoomScale = interpolate(frame, [420, 510], [1.42, 1.25], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    }) + breathe;
  } else if (frame <= 600) {
    // P2 : pull back to reveal full empire
    zoomScale = interpolate(frame, [510, 570], [1.25, 1.05], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }) + breathe;
  } else if (frame <= 660) {
    // P3 : deep zoom IN vers Tombouctou (1.05 -> 2.8)
    zoomScale = interpolate(frame, [600, 660], [1.05, 2.8], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
  } else if (frame <= 720) {
    // P3 : hold zoome sur Tombouctou + icones apparaissent
    zoomScale = 2.8 + breathe * 2;
  } else if (frame <= 780) {
    // P3 : pan zoome vers Niani (leger dezoom 2.8 -> 2.4)
    zoomScale = interpolate(frame, [720, 780], [2.8, 2.4], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    }) + breathe;
  } else if (frame <= 840) {
    // P3 : pull back progressif (2.4 -> 1.0)
    zoomScale = interpolate(frame, [780, 840], [2.4, 1.0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    }) + breathe;
  } else {
    // P3 : hold final, vue d'ensemble
    zoomScale = 1.0 + breathe;
  }

  // -- PAN --
  let panX: number;
  let panY: number;

  if (frame <= BREATHE1_END) {
    // Hold Tombouctou
    panX = startPt[0];
    panY = startPt[1];
  } else if (frame <= PAN1_END) {
    // Pan Tombouctou -> Senegal
    const p1 = interpolate(frame, [BREATHE1_END, PAN1_END], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    panX = startPt[0] + (endPt[0] - startPt[0]) * p1;
    panY = startPt[1] + (endPt[1] - startPt[1]) * p1;
  } else if (frame <= 360) {
    // Hold Senegal
    panX = endPt[0];
    panY = endPt[1];
  } else if (frame <= 420) {
    // Pan Senegal -> Niani
    const p2 = interpolate(frame, [360, 420], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    panX = endPt[0] + (nianiPt[0] - endPt[0]) * p2;
    panY = endPt[1] + (nianiPt[1] - endPt[1]) * p2;
  } else if (frame <= 510) {
    // Pan Niani -> follow route 2 toward Tombouctou
    const p3 = interpolate(frame, [420, 510], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
    panX = nianiPt[0] + (startPt[0] - nianiPt[0]) * p3;
    panY = nianiPt[1] + (startPt[1] - nianiPt[1]) * p3;
  } else if (frame <= 600) {
    // Pull back to center
    const p4 = interpolate(frame, [510, 570], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    panX = startPt[0] + (mapCenter[0] - startPt[0]) * p4;
    panY = startPt[1] + (mapCenter[1] - startPt[1]) * p4;
  } else if (frame <= 720) {
    // P3 : deep zoom + hold sur Tombouctou
    const p5 = interpolate(frame, [600, 660], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
    panX = mapCenter[0] + (startPt[0] - mapCenter[0]) * p5;
    panY = mapCenter[1] + (startPt[1] - mapCenter[1]) * p5;
  } else if (frame <= 780) {
    // P3 : pan zoome Tombouctou -> Niani
    const p6 = interpolate(frame, [720, 780], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    panX = startPt[0] + (nianiPt[0] - startPt[0]) * p6;
    panY = startPt[1] + (nianiPt[1] - startPt[1]) * p6;
  } else {
    // P3 : pull back to center
    const p7 = interpolate(frame, [780, 840], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    panX = nianiPt[0] + (mapCenter[0] - nianiPt[0]) * p7;
    panY = nianiPt[1] + (mapCenter[1] - nianiPt[1]) * p7;
  }

  // -- ROTATION --
  let rotation: number;
  if (frame <= BREATHE1_END || frame > PAN1_END && frame <= 360) {
    rotation = 0;
  } else if (frame <= PAN1_END) {
    rotation = interpolate(
      frame, [BREATHE1_END, (BREATHE1_END + PAN1_END) / 2, PAN1_END],
      [0, 2.5, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  } else if (frame <= 420) {
    // Rotation pendant pan vers Niani
    rotation = interpolate(frame, [360, 390, 420], [0, -2, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
  } else if (frame <= 510) {
    // Rotation pendant route 2
    rotation = interpolate(frame, [420, 465, 510], [0, 1.5, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
  } else if (frame <= 720) {
    rotation = 0;
  } else if (frame <= 780) {
    // P3 : rotation pendant pan zoome Tombouctou -> Niani
    rotation = interpolate(frame, [720, 750, 780], [0, -1.5, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
  } else {
    rotation = 0;
  }

  // -- Labels Part 1 --
  const labelTombouctou = spring({ frame: frame - 30, fps, config: { damping: 20, stiffness: 120 } });
  const labelSenegal = spring({ frame: frame - PAN1_END, fps, config: { damping: 18, stiffness: 150 } });

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.bg }}>
      <div
        style={{
          width: W, height: H,
          transform: `translate(${panX}px, ${panY}px) scale(${zoomScale}) rotate(${rotation}deg) translate(${-panX}px, ${-panY}px)`,
          transformOrigin: "0 0",
          opacity: mapOpacity,
        }}
      >
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <filter id="landShadow" x="-2%" y="-2%" width="108%" height="108%">
              <feDropShadow dx={2} dy={3} stdDeviation={3} floodColor={PAL.shadow} floodOpacity={0.4} />
            </filter>
            <radialGradient id="oceanGrad" cx="30%" cy="40%" r="70%">
              <stop offset="0%" stopColor={PAL.oceanLight} />
              <stop offset="100%" stopColor={PAL.oceanDeep} />
            </radialGradient>
          </defs>

          {/* Ocean */}
          <rect width={W} height={H} fill="url(#oceanGrad)" />
          <OceanWaves frame={frame} />

          {/* Pays avec relief */}
          <g filter="url(#landShadow)">
            {countries.map((c) => {
              const isWA = WEST_AFRICA_ISO.has(c.id);
              const empireIdx = EMPIRE_MALI_ISO.indexOf(c.id);
              const isEmpire = empireIdx >= 0;

              // Couleur empire animee
              let fill = isWA ? PAL.land : "#E0D8CC";
              if (isEmpire && empireColors[empireIdx] > 0) {
                const t = empireColors[empireIdx];
                const r1 = parseInt(PAL.land.slice(1, 3), 16);
                const g1 = parseInt(PAL.land.slice(3, 5), 16);
                const b1 = parseInt(PAL.land.slice(5, 7), 16);
                const r2 = parseInt(PAL.empireGold.slice(1, 3), 16);
                const g2 = parseInt(PAL.empireGold.slice(3, 5), 16);
                const b2 = parseInt(PAL.empireGold.slice(5, 7), 16);
                const ri = Math.round(r1 + (r2 - r1) * t);
                const gi = Math.round(g1 + (g2 - g1) * t);
                const bi = Math.round(b1 + (b2 - b1) * t);
                fill = `rgb(${ri}, ${gi}, ${bi})`;
              }

              return (
                <path key={c.id} d={c.path}
                  fill={fill}
                  stroke={isEmpire && empireColors[empireIdx] > 0.5 ? PAL.empireBorder : PAL.landStroke}
                  strokeWidth={isEmpire && empireColors[empireIdx] > 0.5 ? 2.5 : isWA ? 1.2 : 0.5}
                  opacity={isWA ? 1 : 0.5}
                />
              );
            })}
          </g>

          {/* Empire glow pulse (fin Part 2) */}
          {empireGlowPulse > 0 && countries.map((c) => {
            const empireIdx = EMPIRE_MALI_ISO.indexOf(c.id);
            if (empireIdx < 0) return null;
            return (
              <path key={`glow-${c.id}`} d={c.path}
                fill={PAL.empireGlow} stroke="none"
                opacity={empireGlowPulse}
              />
            );
          })}

          {/* Bordures empire dorees (apres coloration) */}
          {countries.map((c) => {
            const empireIdx = EMPIRE_MALI_ISO.indexOf(c.id);
            if (empireIdx < 0 || empireColors[empireIdx] < 0.5) return null;
            return (
              <path key={`border-${c.id}`} d={c.path}
                fill="none" stroke={PAL.empireBorder}
                strokeWidth={3} opacity={empireColors[empireIdx] * 0.7}
              />
            );
          })}

          {/* Trait de cote */}
          {countries.map((c) => {
            if (!WEST_AFRICA_ISO.has(c.id)) return null;
            return (
              <path key={`coast-${c.id}`} d={c.path}
                fill="none" stroke={PAL.landStroke}
                strokeWidth={2.5} opacity={0.4}
              />
            );
          })}

          {/* Route 1 */}
          <AnimatedRoute path={route1Path} progress={trace1} />

          {/* Route 2 */}
          <AnimatedRoute path={route2Path} progress={trace2} />

          {/* Dot route 1 */}
          {trace1 > 0 && trace1 < 1 && (
            <>
              <circle cx={dot1.x} cy={dot1.y} r={12}
                fill={PAL.goldPulse} opacity={0.5 + Math.sin(frame * 0.3) * 0.2}
              />
              <circle cx={dot1.x} cy={dot1.y} r={5} fill={PAL.gold} />
            </>
          )}

          {/* Dot route 2 */}
          {trace2 > 0 && trace2 < 1 && (
            <>
              <circle cx={dot2.x} cy={dot2.y} r={12}
                fill={PAL.goldPulse} opacity={0.5 + Math.sin(frame * 0.3) * 0.2}
              />
              <circle cx={dot2.x} cy={dot2.y} r={5} fill={PAL.gold} />
            </>
          )}

          {/* Pulse rings Part 1 */}
          {CITIES_P1.map((city, i) => {
            const pos = proj(city.coords);
            if (!pos) return null;
            return (
              <PulseRing key={`pulse-${city.name}`}
                cx={pos[0]} cy={pos[1]} frame={frame}
                startFrame={i === 0 ? 40 : PAN1_END + 10}
              />
            );
          })}

          {/* Pulse ring Niani */}
          {nianiLabel > 0 && (
            <PulseRing cx={nianiPt[0]} cy={nianiPt[1]} frame={frame} startFrame={400} />
          )}

          {/* Labels Part 1 */}
          {CITIES_P1.map((city, i) => {
            const pos = proj(city.coords);
            if (!pos) return null;
            const appear = i === 0 ? labelTombouctou : labelSenegal;
            return (
              <CityLabel key={city.name} name={city.name}
                pos={pos as [number, number]} offset={city.labelOffset} appear={appear}
              />
            );
          })}

          {/* Label Niani */}
          {nianiLabel > 0 && (
            <CityLabel name={NIANI.name}
              pos={nianiPt as [number, number]} offset={NIANI.labelOffset} appear={nianiLabel}
            />
          )}

          {/* Icones Gemini Part 3 */}
          <MapIcon
            x={startPt[0]} y={startPt[1] - 50}
            src="assets/geoafrique/icons/mosque-icon-v2-transparent.png"
            size={70} appear={mosqueAppear}
          />
          <MapIcon
            x={caravanPt[0]} y={caravanPt[1] - 25}
            src="assets/geoafrique/icons/caravan-icon-v2-transparent.png"
            size={90} appear={caravanAppear}
          />
          <MapIcon
            x={nianiPt[0]} y={nianiPt[1] - 55}
            src="assets/geoafrique/icons/mansa-moussa-icon-v2-transparent.png"
            size={70} appear={crownAppear}
          />

          {/* Titre Empire du Mali (apparait pendant le pull back final) */}
          {frame > 530 && (() => {
            const titleAppear = spring({
              frame: frame - 530, fps,
              config: { damping: 20, stiffness: 100 },
            });
            const titleY = interpolate(titleAppear, [0, 1], [H * 0.72 + 20, H * 0.72], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            return (
              <g opacity={titleAppear}>
                <rect x={W / 2 - 180} y={titleY - 30} width={360} height={50}
                  rx={6} fill={PAL.textBg} stroke={PAL.empireBorder} strokeWidth={2}
                />
                <text x={W / 2} y={titleY + 5}
                  fontFamily="Georgia, serif" fontSize={26} fontWeight="bold"
                  fill={PAL.text} textAnchor="middle"
                >Empire du Mali (XIIIe s.)</text>
              </g>
            );
          })()}
        </svg>
      </div>
    </AbsoluteFill>
  );
};
