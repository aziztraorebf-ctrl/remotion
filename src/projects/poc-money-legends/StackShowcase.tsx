import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Scene2ActTitleCard3D } from "./Scene2Globe3D";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSourceSerif } from "@remotion/google-fonts/SourceSerif4";

const { fontFamily: playfairFamily } = loadPlayfair();
const { fontFamily: sourceSerifFamily } = loadSourceSerif();

// ─── TIMING CONSTANTS ────────────────────────────────────────────────────────
export const STACK_SHOWCASE_FRAMES = 2700;
const FPS = 30;

const SCENE_1_START = 0;
const SCENE_1_END = 150;

const SCENE_2_START = 150;
const SCENE_2_END = 330;

const SCENE_3_START = 330;
const SCENE_3_END = 660;

const SCENE_4_START = 660;
const SCENE_4_END = 960;

const SCENE_5_START = 960;
const SCENE_5_END = 1110;

const SCENE_6_START = 1110;
const SCENE_6_END = 1560;

const SCENE_7_START = 1560;
const SCENE_7_END = 1860;

const SCENE_8_START = 1860;
const SCENE_8_END = 2160;

const SCENE_9_START = 2160;
const SCENE_9_END = 2460;

const SCENE_10_START = 2460;
const SCENE_10_END = 2700;

const FLASH_FRAMES = [148, 328, 658, 958, 1108, 1558, 1858, 2158, 2458];

// ─── SPRING CONFIGS ──────────────────────────────────────────────────────────
const SPRING_SMOOTH = { damping: 200, stiffness: 80, mass: 1 };
const SPRING_BOUNCE = { damping: 8, stiffness: 200 };
const SPRING_SNAPPY = { damping: 20, stiffness: 200 };

// ─── GOLD PRICE DATA ─────────────────────────────────────────────────────────
const GOLD_PRICES = [35, 42, 100, 180, 320, 270, 350, 420, 480, 600, 720, 900, 1100, 1420, 1680, 1780, 1850, 1900, 2070, 2350];
const GOLD_YEARS = [1970, 1972, 1975, 1978, 1981, 1984, 1987, 1990, 1993, 1997, 2000, 2004, 2007, 2010, 2013, 2016, 2019, 2021, 2023, 2024];

// ─── SCENE 1 — HOOK TYPO ─────────────────────────────────────────────────────
const Scene1HookTypo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: SPRING_SMOOTH });
  const subOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barWidth = spring({ frame: frame - 20, fps, config: SPRING_SNAPPY });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0a0a1a 0%, #0d1b3e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontSize: 280,
          fontFamily: "'Georgia', serif",
          fontWeight: 700,
          WebkitTextStroke: "3px rgba(255,255,255,0.8)",
          color: "transparent",
          lineHeight: 1,
          transform: `scale(${titleScale})`,
          userSelect: "none",
        }}
      >
        1324
      </div>
      <div
        style={{
          fontSize: 22,
          fontFamily: "'Helvetica Neue', sans-serif",
          letterSpacing: "0.2em",
          color: "#ffffff",
          textAlign: "center",
          marginTop: 32,
          opacity: subOpacity,
          maxWidth: 900,
          textTransform: "uppercase",
        }}
      >
        L&apos;ANNEE OU MANSA MOUSSA EFFONDRA L&apos;ECONOMIE DU CAIRE
      </div>

      {/* Gold bar at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 3,
          width: `${barWidth * 100}%`,
          backgroundColor: "#D4AF37",
        }}
      />
    </AbsoluteFill>
  );
};

// ─── SCENE 2 — ACT TITLE CARD ────────────────────────────────────────────────
const Scene2ActTitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({ frame, fps, config: SPRING_SMOOTH });
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity,
      }}
    >
      {/* Background outline text */}
      <div
        style={{
          position: "absolute",
          fontSize: 160,
          fontFamily: "'Georgia', serif",
          fontWeight: 900,
          WebkitTextStroke: "1px rgba(255,255,255,0.12)",
          color: "transparent",
          userSelect: "none",
          transform: `scale(${appear})`,
        }}
      >
        ACTE I
      </div>

      {/* Sphere */}
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, #1a4a8a, #020820)",
          boxShadow:
            "0 0 80px 30px rgba(50,120,255,0.4), 0 0 200px 80px rgba(20,60,200,0.15)",
          transform: `scale(${appear})`,
          zIndex: 2,
        }}
      />

      {/* Front text */}
      <div
        style={{
          fontSize: 28,
          fontFamily: "'Helvetica Neue', sans-serif",
          fontWeight: 300,
          letterSpacing: "0.3em",
          color: "#ffffff",
          marginTop: 40,
          textTransform: "uppercase",
          opacity: appear,
          zIndex: 2,
        }}
      >
        L&apos;HUMILIATION
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 3 — LINE CHART ────────────────────────────────────────────────────
const Scene3LineChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const DURATION = SCENE_3_END - SCENE_3_START;
  const CHART_MARGIN = { top: 80, right: 120, bottom: 80, left: 120 };
  const CHART_W = 1920 - CHART_MARGIN.left - CHART_MARGIN.right;
  const CHART_H = 1080 - CHART_MARGIN.top - CHART_MARGIN.bottom;

  const minPrice = 35;
  const maxPrice = 2350;

  const points = GOLD_PRICES.map((price, i) => ({
    x: CHART_MARGIN.left + (i / (GOLD_PRICES.length - 1)) * CHART_W,
    y: CHART_MARGIN.top + CHART_H - ((price - minPrice) / (maxPrice - minPrice)) * CHART_H,
    price,
    year: GOLD_YEARS[i],
  }));

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    return `${acc} L ${p.x} ${p.y}`;
  }, "");

  // Estimate total path length for stroke-dashoffset animation
  // We compute total segments length manually
  let totalLength = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    totalLength += Math.sqrt(dx * dx + dy * dy);
  }

  const drawProgress = interpolate(frame, [10, DURATION - 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const strokeDashoffset = totalLength * (1 - drawProgress);

  // Highlight at frame 150 (relative) = 1324 marker (index 2 roughly — year 1975)
  const HIGHLIGHT_FRAME = 150;
  const highlightOpacity = interpolate(frame, [HIGHLIGHT_FRAME, HIGHLIGHT_FRAME + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 1324 is before 1970 data, so we place it conceptually at x=points[0].x - 100 (just off left)
  // Instead map it at ~index 2 to represent the historical disruption impact visually
  const highlightX = points[2].x;

  // Title fade-in
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // End point pulse
  const endPointRadius = 6 + spring({ frame: Math.max(0, frame - 280), fps, config: SPRING_BOUNCE }) * 4;
  const lastPoint = points[points.length - 1];

  // Y-axis labels
  const yLabels = [35, 500, 1000, 1500, 2000, 2350];

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1117" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {/* Grid lines */}
        {yLabels.map((val) => {
          const y = CHART_MARGIN.top + CHART_H - ((val - minPrice) / (maxPrice - minPrice)) * CHART_H;
          return (
            <g key={val}>
              <line
                x1={CHART_MARGIN.left}
                y1={y}
                x2={CHART_MARGIN.left + CHART_W}
                y2={y}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
                strokeDasharray="4 8"
              />
              <text
                x={CHART_MARGIN.left - 12}
                y={y + 5}
                fill="rgba(255,255,255,0.4)"
                fontSize={14}
                textAnchor="end"
                fontFamily="'Helvetica Neue', sans-serif"
              >
                {val}$
              </text>
            </g>
          );
        })}

        {/* 1324 vertical highlight */}
        <line
          x1={highlightX}
          y1={CHART_MARGIN.top}
          x2={highlightX}
          y2={CHART_MARGIN.top + CHART_H}
          stroke="#D4AF37"
          strokeWidth={2}
          opacity={highlightOpacity}
        />
        <text
          x={highlightX + 10}
          y={CHART_MARGIN.top + 40}
          fill="#D4AF37"
          fontSize={13}
          fontFamily="'Helvetica Neue', sans-serif"
          opacity={highlightOpacity}
        >
          Pelerinage Mansa Moussa
        </text>
        <text
          x={highlightX + 10}
          y={CHART_MARGIN.top + 60}
          fill="#D4AF37"
          fontSize={12}
          fontFamily="'Helvetica Neue', sans-serif"
          opacity={highlightOpacity}
        >
          crash -25% sur le Caire
        </text>

        {/* Animated price curve */}
        <path
          d={pathD}
          fill="none"
          stroke="#ffffff"
          strokeWidth={2.5}
          strokeDasharray={totalLength}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* End point pulse */}
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r={endPointRadius}
          fill="#D4AF37"
          opacity={drawProgress}
        />
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r={4}
          fill="#ffffff"
          opacity={drawProgress}
        />

        {/* Year labels on x-axis (sparse) */}
        {[0, 4, 9, 14, 19].map((i) => (
          <text
            key={i}
            x={points[i].x}
            y={CHART_MARGIN.top + CHART_H + 30}
            fill="rgba(255,255,255,0.4)"
            fontSize={13}
            textAnchor="middle"
            fontFamily="'Helvetica Neue', sans-serif"
          >
            {GOLD_YEARS[i]}
          </text>
        ))}
      </svg>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 18,
          fontFamily: "'Helvetica Neue', sans-serif",
          color: "#ffffff",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          opacity: titleOpacity,
        }}
      >
        PRIX DE L&apos;OR — 1970 &rarr; 2024
      </div>

      {/* Source badge */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          right: 40,
          fontSize: 12,
          fontFamily: "'Helvetica Neue', sans-serif",
          color: "rgba(255,255,255,0.3)",
        }}
      >
        Source: World Gold Council
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 4 — NEWSPAPER ARTICLE ─────────────────────────────────────────────
const Scene4Newspaper: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const DURATION = SCENE_4_END - SCENE_4_START;
  const HIGHLIGHT_FRAME_LOCAL = 120; // frame 780 global = 120 local

  const contentOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const panX = interpolate(frame, [0, DURATION], [-12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const kenBurnsScale = interpolate(frame, [0, DURATION], [1.04, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const highlightBg = interpolate(
    frame,
    [HIGHLIGHT_FRAME_LOCAL, HIGHLIGHT_FRAME_LOCAL + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#f0ece3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Paper texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${staticFile("poc-money-legends/paper-texture.png")})`,
          backgroundSize: "cover",
          opacity: 0.08,
          mixBlendMode: "multiply",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Article block */}
      <div
        style={{
          transform: `translateX(${panX}px) scale(${kenBurnsScale})`,
          transformOrigin: "center center",
          opacity: contentOpacity,
          zIndex: 3,
          maxWidth: 760,
          padding: "48px 56px",
          backgroundColor: "#f0ece3",
        }}
      >
        {/* Section tag */}
        <div
          style={{
            fontSize: 13,
            fontFamily: sourceSerifFamily,
            fontVariant: "small-caps",
            letterSpacing: "0.2em",
            color: "#666666",
            marginBottom: 16,
            textTransform: "uppercase",
          }}
        >
          ARCHIVES &middot; 1324 AP. J.-C.
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 36,
            fontFamily: playfairFamily,
            fontWeight: 700,
            color: "#1a1a1a",
            lineHeight: 1.25,
            marginBottom: 24,
            borderTop: "3px solid #1a1a1a",
            borderBottom: "1px solid #1a1a1a",
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          L&apos;Arrivee du Sultan du Mali Paralyse les Marches du Caire
        </div>

        {/* Body paragraph 1 */}
        <p
          style={{
            fontSize: 17,
            fontFamily: sourceSerifFamily,
            color: "#2a2a2a",
            lineHeight: 1.7,
            marginBottom: 18,
          }}
        >
          Le passage du sultan Mansa Moussa par la cite du Caire en route vers
          La Mecque a provoque une perturbation sans precedent dans les marches
          locaux. La distribution massive d&apos;or pur par son entourage a
          provoque une devaluation catastrophique des metaux precieux.
        </p>

        {/* Body paragraph 2 with highlight */}
        <p
          style={{
            fontSize: 17,
            fontFamily: sourceSerifFamily,
            color: "#2a2a2a",
            lineHeight: 1.7,
          }}
        >
          Selon les chroniqueurs de l&apos;epoque, cette intervention{" "}
          <span
            style={{
              backgroundColor: `rgba(255, 229, 102, ${highlightBg})`,
              padding: "1px 3px",
              borderRadius: 2,
              transition: "none",
            }}
          >
            reduisit le prix de l&apos;or de 25% pendant 12 ans
          </span>{" "}
          apres le passage du souverain manden, laissant les marchands egyptiens
          dans un etat de stupeur et d&apos;appauvrissement durable.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 5 — LOWER-THIRD NAME TAG ─────────────────────────────────────────
const Scene5LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({ frame, fps, config: SPRING_SNAPPY });
  const translateX = interpolate(slideIn, [0, 1], [-100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a2535 0%, #0d1117 100%)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-start",
      }}
    >
      {/* Simulated cinema bg texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(30,50,80,0.6) 0%, transparent 70%)",
        }}
      />

      {/* Name tag */}
      <div
        style={{
          transform: `translateX(${translateX}px)`,
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          marginLeft: 100,
          marginBottom: 120,
          zIndex: 2,
        }}
      >
        {/* Gold bar */}
        <div
          style={{
            width: 3,
            backgroundColor: "#D4AF37",
            marginRight: 16,
            flexShrink: 0,
          }}
        />
        <div>
          <div
            style={{
              fontSize: 32,
              fontFamily: "'Helvetica Neue', sans-serif",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.2,
              letterSpacing: "0.05em",
            }}
          >
            MANSA MOUSSA
          </div>
          <div
            style={{
              fontSize: 16,
              fontFamily: "'Helvetica Neue', sans-serif",
              fontWeight: 300,
              color: "rgba(255,255,255,0.65)",
              letterSpacing: "0.08em",
              marginTop: 4,
            }}
          >
            Mansa de l&apos;Empire du Mali &middot; 1312&ndash;1337
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 6 — D3-GEO SVG ROUTES ────────────────────────────────────────────
const AFRICA_OUTLINE_POINTS = [
  [760, 100], [900, 90], [1020, 110], [1100, 160], [1150, 240],
  [1160, 340], [1120, 440], [1060, 520], [1080, 620], [1040, 700],
  [980, 780], [920, 840], [860, 880], [800, 900], [740, 880],
  [680, 840], [640, 780], [600, 700], [580, 620], [600, 540],
  [580, 460], [600, 380], [620, 300], [640, 220], [680, 160],
  [720, 120], [760, 100],
];

const TRADE_ROUTES = [
  {
    id: "route-ghana-cairo",
    points: [[660, 400], [740, 340], [820, 280], [900, 240], [980, 200], [1050, 180]],
    label: "Route du Sahara",
    color: "#D4AF37",
  },
  {
    id: "route-mali-timbuktu",
    points: [[650, 480], [700, 440], [750, 410], [800, 400], [840, 420]],
    label: "Niger — Tomboctou",
    color: "#E8A020",
  },
  {
    id: "route-coast",
    points: [[620, 540], [650, 580], [680, 620], [700, 660], [720, 700]],
    label: "Cote Atlantique",
    color: "#C8902A",
  },
];

const GOLD_PRODUCERS = [
  { x: 660, y: 420, r: 28, label: "Ghana", value: "130t" },
  { x: 700, y: 460, r: 22, label: "Mali", value: "72t" },
  { x: 680, y: 500, r: 18, label: "Burkina", value: "60t" },
  { x: 740, y: 430, r: 12, label: "Niger", value: "25t" },
];

const Scene6GeoRoutes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const DURATION = SCENE_6_END - SCENE_6_START;

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const mapReveal = interpolate(frame, [10, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Each route draws in sequence
  const routeDrawProgress = TRADE_ROUTES.map((_, i) => {
    const startF = 40 + i * 50;
    return interpolate(frame, [startF, startF + 120], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  });

  // Producers appear with spring
  const producerScale = GOLD_PRODUCERS.map((_, i) => {
    const startF = 120 + i * 20;
    return spring({ frame: Math.max(0, frame - startF), fps, config: SPRING_BOUNCE });
  });

  // Estimate route path lengths
  const getPathLength = (pts: number[][]) => {
    let len = 0;
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i][0] - pts[i - 1][0];
      const dy = pts[i][1] - pts[i - 1][1];
      len += Math.sqrt(dx * dx + dy * dy);
    }
    return len;
  };

  const toPathD = (pts: number[][]) =>
    pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f1923" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {/* Africa rough outline */}
        <polygon
          points={AFRICA_OUTLINE_POINTS.map((p) => p.join(",")).join(" ")}
          fill="#1a2535"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={1.5}
          opacity={mapReveal}
        />

        {/* Sahara texture dots */}
        {Array.from({ length: 40 }).map((_, i) => (
          <circle
            key={i}
            cx={680 + (i % 8) * 40 + Math.sin(i) * 10}
            cy={200 + Math.floor(i / 8) * 35 + Math.cos(i) * 8}
            r={1.5}
            fill="rgba(255,255,255,0.06)"
            opacity={mapReveal}
          />
        ))}

        {/* Trade routes */}
        {TRADE_ROUTES.map((route, ri) => {
          const pathD = toPathD(route.points);
          const pLen = getPathLength(route.points);
          const dashoffset = pLen * (1 - routeDrawProgress[ri]);
          return (
            <g key={route.id}>
              <path
                d={pathD}
                fill="none"
                stroke={route.color}
                strokeWidth={2.5}
                strokeDasharray={pLen}
                strokeDashoffset={dashoffset}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.85}
              />
              {/* Animated dot on the route */}
              {routeDrawProgress[ri] > 0.1 && (() => {
                const t = (frame % 60) / 60;
                const idx = Math.min(Math.floor(t * (route.points.length - 1)), route.points.length - 2);
                const localT = (t * (route.points.length - 1)) - idx;
                const px = route.points[idx][0] + (route.points[idx + 1][0] - route.points[idx][0]) * localT;
                const py = route.points[idx][1] + (route.points[idx + 1][1] - route.points[idx][1]) * localT;
                return (
                  <circle
                    cx={px}
                    cy={py}
                    r={4}
                    fill={route.color}
                    opacity={routeDrawProgress[ri]}
                  />
                );
              })()}
            </g>
          );
        })}

        {/* Gold producers */}
        {GOLD_PRODUCERS.map((p, i) => (
          <g key={p.label} transform={`translate(${p.x}, ${p.y})`}>
            <circle
              r={p.r * producerScale[i]}
              fill="rgba(212,175,55,0.25)"
              stroke="#D4AF37"
              strokeWidth={1.5}
            />
            <text
              y={p.r + 16}
              textAnchor="middle"
              fill="rgba(255,255,255,0.75)"
              fontSize={12}
              fontFamily="'Helvetica Neue', sans-serif"
              opacity={producerScale[i]}
            >
              {p.label}
            </text>
            <text
              y={-p.r - 6}
              textAnchor="middle"
              fill="#D4AF37"
              fontSize={11}
              fontFamily="'Helvetica Neue', sans-serif"
              fontWeight={600}
              opacity={producerScale[i]}
            >
              {p.value}
            </text>
          </g>
        ))}

        {/* Route labels */}
        {TRADE_ROUTES.map((route, ri) => {
          const midIdx = Math.floor(route.points.length / 2);
          const px = route.points[midIdx][0];
          const py = route.points[midIdx][1] - 18;
          return (
            <text
              key={route.id + "-label"}
              x={px}
              y={py}
              fill={route.color}
              fontSize={13}
              fontFamily="'Helvetica Neue', sans-serif"
              letterSpacing="0.1em"
              opacity={routeDrawProgress[ri]}
              textAnchor="middle"
            >
              {route.label}
            </text>
          );
        })}
      </svg>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 20,
          fontFamily: "'Helvetica Neue', sans-serif",
          color: "#ffffff",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          opacity: titleOpacity,
        }}
      >
        ROUTES DE L&apos;OR — AFRIQUE DE L&apos;OUEST
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 7 — BAR CHART ─────────────────────────────────────────────────────
const BARS_DATA = [
  { label: "Ghana", value: 130, maxValue: 130, color: "#D4AF37", delay: 0 },
  { label: "Mali", value: 72, maxValue: 130, color: "#E8A020", delay: 40 },
  { label: "Burkina Faso", value: 60, maxValue: 130, color: "#C8902A", delay: 80 },
  { label: "Niger", value: 25, maxValue: 130, color: "#A87020", delay: 120 },
];

const Scene7BarChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const MAX_BAR_WIDTH = 1200;
  const BAR_HEIGHT = 48;
  const BAR_GAP = 24;
  const LEFT_LABEL_W = 160;
  const totalBlockH = BARS_DATA.length * (BAR_HEIGHT + BAR_GAP) - BAR_GAP;

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d1117",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: 20,
          fontFamily: "'Helvetica Neue', sans-serif",
          color: "#ffffff",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: 56,
          opacity: titleOpacity,
        }}
      >
        PRODUCTION D&apos;OR ANNUELLE (TONNES)
      </div>

      {/* Bars */}
      <div style={{ width: LEFT_LABEL_W + MAX_BAR_WIDTH + 80 }}>
        {BARS_DATA.map((bar, i) => {
          const barSpring = spring({
            frame: Math.max(0, frame - bar.delay),
            fps,
            config: SPRING_SMOOTH,
          });
          const barW = (bar.value / bar.maxValue) * MAX_BAR_WIDTH * barSpring;

          return (
            <div
              key={bar.label}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: i < BARS_DATA.length - 1 ? BAR_GAP : 0,
              }}
            >
              {/* Label */}
              <div
                style={{
                  width: LEFT_LABEL_W,
                  textAlign: "right",
                  paddingRight: 20,
                  fontSize: 18,
                  fontFamily: "'Helvetica Neue', sans-serif",
                  color: "rgba(255,255,255,0.8)",
                  flexShrink: 0,
                  opacity: barSpring,
                }}
              >
                {bar.label}
              </div>

              {/* Bar fill */}
              <div
                style={{
                  width: barW,
                  height: BAR_HEIGHT,
                  backgroundColor: bar.color,
                  borderRadius: "0 4px 4px 0",
                  flexShrink: 0,
                }}
              />

              {/* Value label */}
              <div
                style={{
                  marginLeft: 12,
                  fontSize: 18,
                  fontFamily: "'Helvetica Neue', sans-serif",
                  fontWeight: 600,
                  color: bar.color,
                  opacity: barSpring,
                }}
              >
                {bar.value}t
              </div>
            </div>
          );
        })}
      </div>

      {/* Source */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          right: 48,
          fontSize: 12,
          fontFamily: "'Helvetica Neue', sans-serif",
          color: "rgba(255,255,255,0.25)",
        }}
      >
        Source: World Gold Council 2023
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 8 — SPOTLIGHT INSERT ──────────────────────────────────────────────
const Scene8SpotlightInsert: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardScale = spring({ frame, fps, config: SPRING_SMOOTH });
  const valueScale = spring({ frame: Math.max(0, frame - 30), fps, config: SPRING_BOUNCE });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a2535 0%, #0d1117 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background dim overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: `rgba(0,0,0,${0.8 * bgOpacity})`,
          background:
            "radial-gradient(ellipse at 40% 60%, rgba(30,50,80,0.4) 0%, rgba(0,0,0,0.85) 70%)",
        }}
      />

      {/* Cartouche */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: 600,
          backgroundColor: "rgba(0,0,0,0.9)",
          border: "2px solid #D4AF37",
          borderRadius: 12,
          padding: "48px 56px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${cardScale})`,
        }}
      >
        {/* Icon */}
        <div
          style={{
            fontSize: 80,
            lineHeight: 1,
            marginBottom: 20,
          }}
        >
          &#9878;
        </div>

        {/* Big value */}
        <div
          style={{
            fontSize: 96,
            fontFamily: "'Georgia', serif",
            fontWeight: 900,
            color: "#D4AF37",
            lineHeight: 1,
            transform: `scale(${valueScale})`,
            display: "inline-block",
          }}
        >
          &minus;25%
        </div>

        {/* Label */}
        <div
          style={{
            fontSize: 20,
            fontFamily: "'Helvetica Neue', sans-serif",
            color: "rgba(255,255,255,0.9)",
            marginTop: 20,
            textAlign: "center",
            letterSpacing: "0.05em",
          }}
        >
          chute du prix de l&apos;or au Caire
        </div>

        {/* Sub-label */}
        <div
          style={{
            fontSize: 15,
            fontFamily: "'Helvetica Neue', sans-serif",
            color: "rgba(255,255,255,0.5)",
            marginTop: 8,
            textAlign: "center",
          }}
        >
          pendant 12 ans apres 1324
        </div>

        {/* Source */}
        <div
          style={{
            marginTop: 28,
            paddingTop: 16,
            borderTop: "1px solid rgba(212,175,55,0.3)",
            width: "100%",
            fontSize: 12,
            fontFamily: "'Helvetica Neue', sans-serif",
            color: "rgba(255,255,255,0.3)",
            textAlign: "center",
            letterSpacing: "0.08em",
          }}
        >
          Al-Maqrizi, historien egyptien &middot; 1364&ndash;1442
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 9 — CTA FINALE ────────────────────────────────────────────────────
const Scene9CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const DURATION = SCENE_9_END - SCENE_9_START;

  const titleScale = spring({ frame, fps, config: SPRING_SMOOTH });
  const subOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const line1Scale = spring({ frame: Math.max(0, frame - 40), fps, config: SPRING_SNAPPY });
  const line2Scale = spring({ frame: Math.max(0, frame - 60), fps, config: SPRING_SNAPPY });
  const line3Scale = spring({ frame: Math.max(0, frame - 80), fps, config: SPRING_SNAPPY });
  const ctaScale = spring({ frame: Math.max(0, frame - 120), fps, config: SPRING_BOUNCE });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0a0a1a 0%, #1a0a05 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Logo title */}
      <div
        style={{
          fontSize: 72,
          fontFamily: "'Georgia', serif",
          fontWeight: 900,
          color: "#D4AF37",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          transform: `scale(${titleScale})`,
        }}
      >
        GEO AFRIQUE
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: 20,
          fontFamily: "'Helvetica Neue', sans-serif",
          fontWeight: 300,
          color: "rgba(255,255,255,0.7)",
          letterSpacing: "0.08em",
          marginTop: 12,
          opacity: subOpacity,
        }}
      >
        L&apos;Afrique que l&apos;histoire n&apos;a pas racontee
      </div>

      {/* 3 feature lines */}
      <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { text: "Cartes interactives", emoji: "📍", scale: line1Scale },
          { text: "Donnees verifiees", emoji: "📊", scale: line2Scale },
          { text: "Narration francaise", emoji: "🎙", scale: line3Scale },
        ].map(({ text, emoji, scale }) => (
          <div
            key={text}
            style={{
              fontSize: 20,
              fontFamily: "'Helvetica Neue', sans-serif",
              color: "rgba(255,255,255,0.85)",
              transform: `scale(${scale})`,
              display: "inline-block",
            }}
          >
            {emoji} {text}
          </div>
        ))}
      </div>

      {/* CTA button */}
      <div
        style={{
          marginTop: 48,
          backgroundColor: "#D4AF37",
          color: "#000000",
          fontSize: 20,
          fontFamily: "'Helvetica Neue', sans-serif",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          padding: "16px 48px",
          borderRadius: 8,
          transform: `scale(${ctaScale})`,
        }}
      >
        ABONNE-TOI
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 10 — CREDITS TECH ─────────────────────────────────────────────────
const TECH_STACK = [
  { name: "Remotion", desc: "animation React", color: "#D4AF37" },
  { name: "Mapbox GL", desc: "cartes interactives", color: "#D4AF37" },
  { name: "d3-geo", desc: "projections geographiques", color: "#D4AF37" },
  { name: "ElevenLabs", desc: "voix francaise", color: "#D4AF37" },
  { name: "PixelLab", desc: "pixel art sprites", color: "#D4AF37" },
];

const Scene10Credits: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const DURATION = SCENE_10_END - SCENE_10_START;
  const FADE_OUT_START = DURATION - 30;

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const globalOpacity = interpolate(
    frame,
    [FADE_OUT_START, DURATION],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const lineScales = TECH_STACK.map((_, i) => {
    const delay = i * 20;
    return spring({ frame: Math.max(0, frame - delay), fps, config: SPRING_SNAPPY });
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: globalOpacity,
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: 14,
          fontFamily: "'Helvetica Neue', sans-serif",
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          marginBottom: 40,
          opacity: titleOpacity,
        }}
      >
        CONSTRUIT AVEC
      </div>

      {/* Stack list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {TECH_STACK.map(({ name, desc, color }, i) => (
          <div
            key={name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              transform: `scale(${lineScales[i]})`,
              opacity: lineScales[i],
            }}
          >
            {/* Bullet */}
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: color,
                flexShrink: 0,
              }}
            />
            {/* Name */}
            <span
              style={{
                fontSize: 22,
                fontFamily: "'Helvetica Neue', sans-serif",
                fontWeight: 600,
                color: "#ffffff",
                minWidth: 140,
              }}
            >
              {name}
            </span>
            {/* Description */}
            <span
              style={{
                fontSize: 18,
                fontFamily: "'Helvetica Neue', sans-serif",
                fontWeight: 300,
                color: "rgba(255,255,255,0.45)",
              }}
            >
              {desc}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── FLASH TRANSITION ────────────────────────────────────────────────────────
const isFlashFrame = (frame: number): boolean => {
  return FLASH_FRAMES.some((tf) => frame >= tf - 1 && frame <= tf + 1);
};

// ─── MAIN COMPOSITION ────────────────────────────────────────────────────────
export const StackShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  if (isFlashFrame(frame)) {
    return <AbsoluteFill style={{ backgroundColor: "#ffffff" }} />;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* Background music */}
      <Audio
        src={staticFile("poc-money-legends/audio/music-v1.mp3")}
        volume={0.08}
      />

      <Sequence
        from={SCENE_1_START}
        durationInFrames={SCENE_1_END - SCENE_1_START}
        premountFor={FPS}
      >
        <Scene1HookTypo />
      </Sequence>

      <Sequence
        from={SCENE_2_START}
        durationInFrames={SCENE_2_END - SCENE_2_START}
        premountFor={FPS}
      >
        <Scene2ActTitleCard3D startFrame={0} />
      </Sequence>

      <Sequence
        from={SCENE_3_START}
        durationInFrames={SCENE_3_END - SCENE_3_START}
        premountFor={FPS}
      >
        <Scene3LineChart />
      </Sequence>

      <Sequence
        from={SCENE_4_START}
        durationInFrames={SCENE_4_END - SCENE_4_START}
        premountFor={FPS}
      >
        <Scene4Newspaper />
      </Sequence>

      <Sequence
        from={SCENE_5_START}
        durationInFrames={SCENE_5_END - SCENE_5_START}
        premountFor={FPS}
      >
        <Scene5LowerThird />
      </Sequence>

      <Sequence
        from={SCENE_6_START}
        durationInFrames={SCENE_6_END - SCENE_6_START}
        premountFor={FPS}
      >
        <Scene6GeoRoutes />
      </Sequence>

      <Sequence
        from={SCENE_7_START}
        durationInFrames={SCENE_7_END - SCENE_7_START}
        premountFor={FPS}
      >
        <Scene7BarChart />
      </Sequence>

      <Sequence
        from={SCENE_8_START}
        durationInFrames={SCENE_8_END - SCENE_8_START}
        premountFor={FPS}
      >
        <Scene8SpotlightInsert />
      </Sequence>

      <Sequence
        from={SCENE_9_START}
        durationInFrames={SCENE_9_END - SCENE_9_START}
        premountFor={FPS}
      >
        <Scene9CTA />
      </Sequence>

      <Sequence
        from={SCENE_10_START}
        durationInFrames={SCENE_10_END - SCENE_10_START}
        premountFor={FPS}
      >
        <Scene10Credits />
      </Sequence>
    </AbsoluteFill>
  );
};
