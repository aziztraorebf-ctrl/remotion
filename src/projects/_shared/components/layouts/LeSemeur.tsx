import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface SemeurCup {
  id: string;
  label: string;
  seeds: number;
  role: "source" | "destination";
  x: number;
  y: number;
}

export interface LeSemeurProps {
  cups?: SemeurCup[];
  totalValue?: string;
  title?: string;
  subtitle?: string;
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const CUP_RADIUS = 65;
const SEED_RADIUS = 8;
const SEED_DIST_RADIUS = 35;

const DEFAULT_CUPS: SemeurCup[] = [
  { id: "b0", label: "MALI",          seeds: 5, role: "source",      x: 300,  y: 700 },
  { id: "b1", label: "SÉNÉGAL",       seeds: 4, role: "source",      x: 740,  y: 700 },
  { id: "b2", label: "CÔTE D'IVOIRE", seeds: 6, role: "source",      x: 1180, y: 700 },
  { id: "b3", label: "NIGER",         seeds: 3, role: "source",      x: 1620, y: 700 },
  { id: "t0", label: "FRANCE",        seeds: 0, role: "destination", x: 300,  y: 380 },
  { id: "t1", label: "SUISSE",        seeds: 0, role: "destination", x: 740,  y: 380 },
  { id: "t2", label: "UK",            seeds: 0, role: "destination", x: 1180, y: 380 },
  { id: "t3", label: "CHINE",         seeds: 0, role: "destination", x: 1620, y: 380 },
];

const SEED_PATHS: Array<{ from: string; to: string; path: string; delay: number }> = [
  { from: "b0", to: "t0", path: "M 300 700 C 200 540, 200 540, 300 380",  delay: 60  },
  { from: "b0", to: "t1", path: "M 300 700 C 400 500, 640 500, 740 380",  delay: 75  },
  { from: "b1", to: "t1", path: "M 740 700 C 640 540, 640 540, 740 380",  delay: 90  },
  { from: "b1", to: "t2", path: "M 740 700 C 840 500, 1080 500, 1180 380", delay: 105 },
  { from: "b2", to: "t2", path: "M 1180 700 C 1080 540, 1080 540, 1180 380", delay: 120 },
  { from: "b2", to: "t3", path: "M 1180 700 C 1280 500, 1520 500, 1620 380", delay: 135 },
  { from: "b3", to: "t3", path: "M 1620 700 C 1720 540, 1720 540, 1620 380", delay: 150 },
];

// Pre-compute seed positions around a cup center
function getSeedPositions(cx: number, cy: number, count: number) {
  return Array.from({ length: Math.min(count, 8) }, (_, i) => {
    const angle = (i / Math.max(count, 1)) * Math.PI * 2;
    return {
      x: cx + SEED_DIST_RADIUS * Math.cos(angle),
      y: cy + SEED_DIST_RADIUS * Math.sin(angle),
    };
  });
}

export const LeSemeur: React.FC<LeSemeurProps> = ({
  cups = DEFAULT_CUPS,
  totalValue = "$2.3B",
  title = "FUITE DES CAPITAUX",
  subtitle = "TRANSFERTS DES IDE VERS L'EUROPE (2023)",
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 — cups appear (0→30)
  const cupsScale = spring({ frame, fps, config: { damping: 14, stiffness: 100, mass: 1 } });

  // Phase 4 — labels (90→120)
  const labelsOpacity = interpolate(frame, [90, 120], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Phase 5 — total value (200→230)
  const totalScale = spring({
    frame: Math.max(0, frame - 200),
    fps,
    config: { damping: 12, stiffness: 150, mass: 1 },
  });
  const totalOpacity = interpolate(frame, [200, 215], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Track seeds that have arrived at destination
  const arrivedByDest: Record<string, number> = {};
  SEED_PATHS.forEach((sp) => {
    const travelProgress = spring({
      frame: Math.max(0, frame - sp.delay),
      fps,
      config: { damping: 16, stiffness: 120, mass: 0.8 },
    });
    if (travelProgress > 0.95) {
      arrivedByDest[sp.to] = (arrivedByDest[sp.to] ?? 0) + 1;
    }
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      {/* Title */}
      <div style={{
        position: "absolute", top: 60, left: 60,
        fontFamily: FONT_MONO, fontSize: 48, letterSpacing: 6,
        color: "#f2ebd9", textTransform: "uppercase" as const,
        opacity: interpolate(frame, [5, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        {title}
      </div>
      {subtitle && (
        <div style={{
          position: "absolute", top: 122, left: 60,
          fontFamily: FONT_MONO, fontSize: 22, letterSpacing: 3,
          color: "#4a9eff", textTransform: "uppercase" as const,
          opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          {subtitle}
        </div>
      )}

      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>
        {/* Row separator */}
        <line x1={100} y1={540} x2={1820} y2={540}
          stroke="rgba(242,235,217,0.1)" strokeWidth={1} strokeDasharray="6 6" />

        {/* Row labels */}
        <text x={100} y={700} textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: FONT_MONO, fontSize: 14, letterSpacing: 3, fill: "#c8a951", opacity: labelsOpacity }}>
          ORIGINE
        </text>
        <text x={110} y={380} textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: FONT_MONO, fontSize: 14, letterSpacing: 3, fill: "#4a9eff", opacity: labelsOpacity }}>
          DEST.
        </text>

        {/* Travelling seed paths */}
        {SEED_PATHS.map((sp, i) => {
          const travelProgress = spring({
            frame: Math.max(0, frame - sp.delay),
            fps,
            config: { damping: 16, stiffness: 120, mass: 0.8 },
          });
          if (travelProgress <= 0 || travelProgress >= 0.99) return null;
          // Approximate point on cubic bezier at t=travelProgress
          const t = travelProgress;
          const parts = sp.path.match(/([\d.-]+)/g)!.map(Number);
          const [x0, y0, cx1, cy1, cx2, cy2, x3, y3] = parts;
          const bx = Math.pow(1-t,3)*x0 + 3*Math.pow(1-t,2)*t*cx1 + 3*(1-t)*t*t*cx2 + t*t*t*x3;
          const by = Math.pow(1-t,3)*y0 + 3*Math.pow(1-t,2)*t*cy1 + 3*(1-t)*t*t*cy2 + t*t*t*y3;
          return (
            <circle key={i} cx={bx} cy={by} r={SEED_RADIUS}
              fill="#c8a951" opacity={0.9} />
          );
        })}

        {/* Cups */}
        {cups.map((cup) => {
          const isSource = cup.role === "source";
          const seedCount = isSource ? cup.seeds : (arrivedByDest[cup.id] ?? 0);
          const seedPositions = getSeedPositions(cup.x, cup.y, seedCount);

          return (
            <g key={cup.id} transform={`translate(${cup.x}, ${cup.y}) scale(${cupsScale}) translate(-${cup.x}, -${cup.y})`}>
              {/* Cup circle */}
              <circle cx={cup.x} cy={cup.y} r={CUP_RADIUS}
                fill="rgba(200,169,81,0.1)"
                stroke={isSource ? "#c8a951" : "#4a9eff"}
                strokeWidth={2} />

              {/* Seeds inside cup */}
              {seedPositions.map((pos, si) => (
                <circle key={si} cx={pos.x} cy={pos.y} r={SEED_RADIUS}
                  fill={isSource ? "#c8a951" : "#4a9eff"}
                  opacity={0.85} />
              ))}

              {/* Seed count */}
              <text x={cup.x} y={cup.y} textAnchor="middle" dominantBaseline="middle"
                style={{ fontFamily: FONT_MONO, fontSize: 22, fill: isSource ? "#c8a951" : "#4a9eff", fontWeight: "bold" }}>
                {seedCount}
              </text>

              {/* Label */}
              <text
                x={cup.x}
                y={isSource ? cup.y + CUP_RADIUS + 28 : cup.y - CUP_RADIUS - 14}
                textAnchor="middle"
                style={{ fontFamily: FONT_MONO, fontSize: 18, letterSpacing: 3,
                  fill: isSource ? "#c8a951" : "#4a9eff", opacity: labelsOpacity,
                  textTransform: "uppercase" }}>
                {cup.label}
              </text>
            </g>
          );
        })}

        {/* Total value */}
        <text x={960} y={540} textAnchor="middle" dominantBaseline="middle"
          style={{
            fontFamily: FONT_MONO, fontSize: 82, letterSpacing: 4,
            fill: "#f2ebd9", opacity: totalOpacity,
            transform: `scale(${totalScale})`,
            transformOrigin: "960px 540px",
          }}>
          {totalValue}
        </text>
      </svg>
    </AbsoluteFill>
  );
};
