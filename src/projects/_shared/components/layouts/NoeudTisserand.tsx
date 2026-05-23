import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface InputFlow {
  label: string;
  percentage: number;
  color?: string;
  side?: "left" | "top" | "bottom";
}

export interface NoeudTisserandProps {
  inputFlows?: InputFlow[];
  outputLabel?: string;
  bottleneckLabel?: string;
  bottleneckEntity?: string;
  blocked?: boolean;
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const DEFAULT_FLOWS: InputFlow[] = [
  { label: "MALI", percentage: 34, color: "#c8a951", side: "left" },
  { label: "BURKINA FASO", percentage: 28, color: "#4a9eff", side: "left" },
  { label: "NIGER", percentage: 38, color: "#f2ebd9", side: "left" },
];

const NODE_X = 1200;
const NODE_Y = 540;
const NODE_RADIUS = 80;

const INPUT_START_X = 200;
const INPUT_Y_POSITIONS = [240, 540, 840];

// Cubic bezier paths from Gemini specs
const INPUT_PATHS = [
  `M 200 240 C 700 240, 700 540, 1200 540`,
  `M 200 540 C 700 540, 700 540, 1200 540`,
  `M 200 840 C 700 840, 700 540, 1200 540`,
];

const OUTPUT_PATH = `M 1200 540 C 1400 540, 1500 540, 1720 540`;

function getPathLength(path: string): number {
  // Approximate using SVG path trick — pre-computed for our cubic bezier paths
  // (proper measure would need a browser DOM, these are tight approximations)
  if (path.includes("240 C")) return 1080;
  if (path.includes("840 C")) return 1080;
  if (path.includes("540 C 700 540")) return 1000;
  return 600;
}

const PATH_LENGTHS = [1080, 1000, 1080];
const OUTPUT_PATH_LENGTH = 600;

export const NoeudTisserand: React.FC<NoeudTisserandProps> = ({
  inputFlows = DEFAULT_FLOWS,
  outputLabel = "TRANSIT INTERNATIONAL",
  bottleneckLabel = "GOULOT",
  bottleneckEntity = "PORT DE DAKAR",
  blocked = true,
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const flows = inputFlows.slice(0, 3);

  // Phase 1 — input paths draw-on (0→30)
  const inputDrawProgress = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 2 — node appear (30→60)
  const nodeScale = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 10, stiffness: 120, mass: 1 },
  });

  // Phase 3 — output draw-on (60→90)
  const outputDrawProgress = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 4 — labels fadeIn (90→120)
  const labelsOpacity = interpolate(frame, [90, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 5 — squeeze (150→180)
  const squeezeProgress = spring({
    frame: Math.max(0, frame - 150),
    fps,
    config: { damping: 12, stiffness: 90, mass: 1 },
  });

  const nodePulse = 1 + 0.08 * Math.sin((frame / 8));
  const nodeDisplayRadius = NODE_RADIUS * nodeScale * (frame >= 150 ? (1 - 0.15 * squeezeProgress) : 1);

  const blockedColor = "#c8455a";
  const freeColor = "#4aef9f";
  const nodeColor = blocked ? blockedColor : freeColor;
  const textColor = "#1a2535";

  // Flow stroke widths proportional to percentage
  const maxPct = Math.max(...flows.map((f) => f.percentage));

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        {/* Input flow paths */}
        {flows.map((flow, i) => {
          const pathD = INPUT_PATHS[i] ?? INPUT_PATHS[0];
          const pathLen = PATH_LENGTHS[i] ?? 1080;
          const strokeW = 3 + (flow.percentage / maxPct) * 8;
          const squeeze = i === 1 ? 1 : 1 + squeezeProgress * 0.4;
          return (
            <path
              key={i}
              d={pathD}
              fill="none"
              stroke={flow.color ?? "#4a9eff"}
              strokeWidth={strokeW * squeeze}
              strokeDasharray={pathLen}
              strokeDashoffset={pathLen * (1 - inputDrawProgress)}
              opacity={0.8}
            />
          );
        })}

        {/* Output path */}
        <path
          d={OUTPUT_PATH}
          fill="none"
          stroke={blocked ? blockedColor : freeColor}
          strokeWidth={5}
          strokeDasharray={OUTPUT_PATH_LENGTH}
          strokeDashoffset={OUTPUT_PATH_LENGTH * (1 - outputDrawProgress)}
          opacity={0.85}
        />

        {/* Node circle */}
        <circle
          cx={NODE_X}
          cy={NODE_Y}
          r={nodeDisplayRadius * nodePulse}
          fill={nodeColor}
          opacity={nodeScale}
        />

        {/* Node bottleneck label */}
        <text
          x={NODE_X}
          y={NODE_Y - 4}
          textAnchor="middle"
          style={{
            fontFamily: FONT_MONO,
            fontSize: 18,
            letterSpacing: 4,
            fill: textColor,
            fontWeight: "bold",
            opacity: nodeScale,
            textTransform: "uppercase",
          }}
        >
          {bottleneckLabel}
        </text>

        {/* Flow labels */}
        {flows.map((flow, i) => {
          const yPos = INPUT_Y_POSITIONS[i] ?? 540;
          return (
            <g key={i} opacity={labelsOpacity}>
              <text
                x={INPUT_START_X - 20}
                y={yPos - 16}
                textAnchor="middle"
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 22,
                  letterSpacing: 2,
                  fill: "#f2ebd9",
                  textTransform: "uppercase",
                }}
              >
                {flow.label}
              </text>
              <text
                x={INPUT_START_X - 20}
                y={yPos + 14}
                textAnchor="middle"
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 30,
                  letterSpacing: 1,
                  fill: flow.color ?? "#c8a951",
                  fontWeight: "bold",
                }}
              >
                {flow.percentage}%
              </text>
            </g>
          );
        })}

        {/* Output label */}
        <text
          x={1750}
          y={520}
          textAnchor="end"
          style={{
            fontFamily: FONT_MONO,
            fontSize: 20,
            letterSpacing: 3,
            fill: blocked ? blockedColor : freeColor,
            opacity: outputDrawProgress,
            textTransform: "uppercase",
          }}
        >
          {outputLabel}
        </text>
      </svg>

      {/* Bottleneck entity label — below node */}
      <div
        style={{
          position: "absolute",
          left: NODE_X - 200,
          top: NODE_Y + NODE_RADIUS + 20,
          width: 400,
          textAlign: "center",
          fontFamily: FONT_MONO,
          fontSize: 28,
          letterSpacing: 2,
          color: "#f2ebd9",
          textTransform: "uppercase" as const,
          opacity: nodeScale,
        }}
      >
        {bottleneckEntity}
      </div>

      {/* Blocked indicator */}
      {blocked && (
        <div
          style={{
            position: "absolute",
            left: NODE_X - 150,
            top: NODE_Y - NODE_RADIUS - 60,
            width: 300,
            textAlign: "center",
            fontFamily: FONT_MONO,
            fontSize: 16,
            letterSpacing: 6,
            color: blockedColor,
            textTransform: "uppercase" as const,
            opacity: Math.min(nodeScale, labelsOpacity),
          }}
        >
          BLOQUÉ
        </div>
      )}
    </AbsoluteFill>
  );
};
