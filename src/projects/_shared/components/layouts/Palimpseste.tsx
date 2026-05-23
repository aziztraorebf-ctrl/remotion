import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface ColonialLine {
  x1: number; y1: number;
  x2: number; y2: number;
  label: string;
  labelX: number;
  labelY: number;
}

export interface ModernFlow {
  path: string;
  label: string;
  labelX: number;
  labelY: number;
  color?: string;
}

export interface PalimpsesteProps {
  colonialLines?: ColonialLine[];
  modernFlows?: ModernFlow[];
  titleColonial?: string;
  titleModern?: string;
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const DEFAULT_COLONIAL: ColonialLine[] = [
  { x1: 400,  y1: 100, x2: 400,  y2: 900, label: "SOUDAN FRANÇAIS",  labelX: 420, labelY: 200 },
  { x1: 400,  y1: 500, x2: 1500, y2: 500, label: "HAUTE-VOLTA",      labelX: 1200, labelY: 480 },
  { x1: 900,  y1: 100, x2: 900,  y2: 900, label: "DAHOMEY",          labelX: 920, labelY: 800 },
  { x1: 1500, y1: 100, x2: 1500, y2: 900, label: "NIGERIA",          labelX: 1520, labelY: 300 },
  { x1: 400,  y1: 900, x2: 1500, y2: 100, label: "CÔTE D'IVOIRE",    labelX: 700, labelY: 750 },
];

const DEFAULT_MODERN: ModernFlow[] = [
  { path: "M 200 800 C 600 900, 1200 200, 1700 300", label: "CORRIDOR DAKAR-DJIBOUTI", labelX: 1250, labelY: 230, color: "#4a9eff" },
  { path: "M 300 200 C 800 100, 1000 800, 1600 900", label: "ZONE LIBRE ZLECAF",       labelX: 1050, labelY: 850, color: "#4a9eff" },
  { path: "M 800 1000 C 900 600, 1300 400, 1800 500", label: "ROUTE TRANSSAHARIENNE",  labelX: 1350, labelY: 430, color: "#4a9eff" },
];

// Approximate SVG path length for dash animation
function approxPathLength(path: string): number {
  const nums = path.match(/([\d.-]+)/g)!.map(Number);
  let len = 0;
  for (let i = 0; i < nums.length - 2; i += 2) {
    const dx = nums[i + 2] - nums[i];
    const dy = nums[i + 3] - nums[i + 1];
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return Math.max(len, 600);
}

function lineLength(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export const Palimpseste: React.FC<PalimpsesteProps> = ({
  colonialLines = DEFAULT_COLONIAL,
  modernFlows = DEFAULT_MODERN,
  titleColonial = "LES FRONTIÈRES DE BERLIN (1885)",
  titleModern = "LES CORRIDORS DU FUTUR (2024)",
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 — colonial draw-on (0→45), staggered per line
  // Phase 3 — dissolve colonial + modern draw-on (90→150)
  const dissolveProgress = interpolate(frame, [90, 140], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Title glitch (100→110)
  const isGlitch = frame >= 100 && frame <= 110;
  const glitchOffset = isGlitch ? (frame % 2 === 0 ? 5 : -5) : 0;
  const showModernTitle = frame >= 105;

  // Colonial labels fade out (90→120)
  const colonialLabelOpacity = interpolate(frame, [90, 120], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Modern labels fade in (120→150)
  const modernLabelOpacity = interpolate(frame, [120, 150], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      {/* Title */}
      <div style={{
        position: "absolute", top: 50, left: 0, right: 0, textAlign: "center",
        fontFamily: FONT_MONO, fontSize: 42, letterSpacing: 4,
        color: "#f2ebd9", textTransform: "uppercase" as const,
        transform: `translateX(${glitchOffset}px)`,
      }}>
        {showModernTitle ? titleModern : titleColonial}
      </div>

      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>
        {/* Colonial lines */}
        {colonialLines.map((cl, i) => {
          const drawDelay = i * 9;
          const drawProgress = interpolate(frame, [drawDelay, drawDelay + 35], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const len = lineLength(cl.x1, cl.y1, cl.x2, cl.y2);
          const strokeOpacity = interpolate(dissolveProgress, [0, 1], [0.85, 0.12], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const strokeColor = interpolate(dissolveProgress, [0, 1], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }) > 0.5 ? "rgba(200,169,81,0.15)" : "#c8a951";

          return (
            <g key={i}>
              <line
                x1={cl.x1} y1={cl.y1} x2={cl.x2} y2={cl.y2}
                stroke="#c8a951"
                strokeWidth={2}
                strokeOpacity={strokeOpacity}
                strokeDasharray={len}
                strokeDashoffset={len * (1 - drawProgress)}
              />
              <text x={cl.labelX} y={cl.labelY}
                style={{ fontFamily: FONT_MONO, fontSize: 18, letterSpacing: 2,
                  fill: "#c8a951", opacity: colonialLabelOpacity * drawProgress,
                  textTransform: "uppercase" }}>
                {cl.label}
              </text>
            </g>
          );
        })}

        {/* Modern flow lines */}
        {modernFlows.map((mf, i) => {
          const drawDelay = 90 + i * 18;
          const drawProgress = interpolate(frame, [drawDelay, drawDelay + 40], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const pathLen = approxPathLength(mf.path);

          return (
            <g key={i}>
              <path
                d={mf.path}
                fill="none"
                stroke={mf.color ?? "#4a9eff"}
                strokeWidth={3}
                strokeDasharray={pathLen}
                strokeDashoffset={pathLen * (1 - drawProgress)}
                opacity={0.9}
              />
              {/* Glow duplicate */}
              <path
                d={mf.path}
                fill="none"
                stroke={mf.color ?? "#4a9eff"}
                strokeWidth={8}
                opacity={0.15 * drawProgress}
              />
              <text x={mf.labelX} y={mf.labelY}
                style={{ fontFamily: FONT_MONO, fontSize: 20, letterSpacing: 3,
                  fill: mf.color ?? "#4a9eff", opacity: modernLabelOpacity * drawProgress,
                  textTransform: "uppercase" }}>
                {mf.label}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
