import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface FilRougeNode {
  label: string;
  role: string;
  value?: string;
  x: number;
  y: number;
  isTarget?: boolean;
}

export interface FilRougeProps {
  nodes?: FilRougeNode[];
  title?: string;
  threadPath?: string;
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const CARD_W = 220;
const CARD_H = 140;
const PIN_R = 8;

const THREAD_TOTAL_FRAMES = 120;
const THREAD_START = 30;
const TARGET_REVEAL = 160;
const TENSION_START = 190;

// Approximate path length for stroke-dashoffset animation
// FilRouge uses a polyline — sum of segment distances
const NODE_APPEAR_INTERVAL = 25;

const DEFAULT_NODES: FilRougeNode[] = [
  { label: "MINISTRE DES MINES",    role: "SIGNATAIRE",     x: 250,  y: 180 },
  { label: "SOCIETE ECRAN LTD",     role: "INTERMEDIAIRE",  x: 780,  y: 220 },
  { label: "BANQUE OFFSHORE",        role: "FLUX FINANCIERS", value: "450M $", x: 1350, y: 150 },
  { label: "PROJET INFRASTRUCTURE", role: "COUVERTURE",      x: 550,  y: 650 },
  { label: "BENEFICIAIRE FINAL",     role: "INCONNU",         isTarget: true, x: 1450, y: 700 },
];

const DEFAULT_THREAD = "M 360 195 L 890 235 L 1460 165 L 660 665 L 1560 715";

// Approximate polyline length
function polylineLength(path: string): number {
  const nums = path.match(/([\d.]+)/g)?.map(Number) ?? [];
  let total = 0;
  for (let i = 2; i < nums.length - 1; i += 2) {
    const dx = nums[i] - nums[i - 2];
    const dy = nums[i + 1] - nums[i - 1];
    total += Math.sqrt(dx * dx + dy * dy);
  }
  return total;
}

export const FilRouge: React.FC<FilRougeProps> = ({
  nodes = DEFAULT_NODES,
  title = "RESEAU D'EXTRACTION",
  threadPath = DEFAULT_THREAD,
  bgColor = "#1a2535",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const THREAD_LEN = polylineLength(threadPath);

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Thread draw progress
  const threadProgress = interpolate(
    frame,
    [THREAD_START, THREAD_START + THREAD_TOTAL_FRAMES],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Thread tension spring (stroke width)
  const tensionScale = spring({
    frame: Math.max(0, frame - TENSION_START),
    fps,
    config: { damping: 8, stiffness: 300, mass: 1 },
  });
  const threadStrokeWidth = 2 + tensionScale * 2;

  const dashOffset = THREAD_LEN * (1 - threadProgress);

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      {/* Cork board texture dots */}
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.07 }}>
        {Array.from({ length: 40 }, (_, row) =>
          Array.from({ length: 70 }, (_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={col * 28 + 14}
              cy={row * 28 + 14}
              r={2}
              fill="#c8a951"
            />
          ))
        )}
      </svg>

      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>
        {/* Title */}
        <text
          x={60} y={60}
          style={{
            fontFamily: FONT_MONO,
            fontSize: 32,
            letterSpacing: 6,
            fill: "#f2ebd9",
            opacity: titleOpacity,
            textTransform: "uppercase",
          }}
        >
          {title}
        </text>

        {/* Red thread */}
        <path
          d={threadPath}
          fill="none"
          stroke="#e63946"
          strokeWidth={threadStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={THREAD_LEN}
          strokeDashoffset={dashOffset}
        />

        {/* Cards */}
        {nodes.map((node, i) => {
          const cardScale = spring({
            frame: Math.max(0, frame - i * NODE_APPEAR_INTERVAL),
            fps,
            config: { damping: 14, stiffness: 150, mass: 0.8 },
          });

          const isTarget = node.isTarget;
          const targetRevealOpacity = isTarget
            ? interpolate(frame, [TARGET_REVEAL, TARGET_REVEAL + 20], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1;

          const cardBg = isTarget ? "#1a3a5c" : "#f2ebd9";
          const textColor = isTarget ? "#f2ebd9" : "#1a2535";
          const valueColor = isTarget ? "#e63946" : "#c8a951";

          const cx = node.x;
          const cy = node.y;
          const cardX = cx - CARD_W / 2;
          const cardY = cy - CARD_H / 2;
          const pinX = cx;
          const pinY = cy - CARD_H / 2 - 6;

          return (
            <g
              key={i}
              opacity={isTarget ? targetRevealOpacity : 1}
              transform={`translate(${cx}, ${cy}) scale(${cardScale}) translate(-${cx}, -${cy})`}
            >
              {/* Card */}
              <rect
                x={cardX} y={cardY}
                width={CARD_W} height={CARD_H}
                fill={cardBg}
                stroke={isTarget ? "#e63946" : "rgba(26,37,53,0.2)"}
                strokeWidth={isTarget ? 3 : 1}
                rx={4}
              />

              {/* Pin */}
              <circle
                cx={pinX} cy={pinY}
                r={PIN_R}
                fill="#e63946"
              />

              {/* Label */}
              <text
                x={cx}
                y={cy - 22}
                textAnchor="middle"
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: isTarget ? 15 : 14,
                  letterSpacing: 2,
                  fill: textColor,
                  fontWeight: "bold",
                }}
              >
                {node.label}
              </text>

              {/* Role */}
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  letterSpacing: 3,
                  fill: isTarget ? "#4a9eff" : "#888",
                }}
              >
                {node.role}
              </text>

              {/* Value */}
              {node.value && (
                <text
                  x={cx}
                  y={cy + 30}
                  textAnchor="middle"
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 18,
                    letterSpacing: 3,
                    fill: valueColor,
                    fontWeight: "bold",
                  }}
                >
                  {node.value}
                </text>
              )}

              {/* Target question mark */}
              {isTarget && !node.value && (
                <text
                  x={cx}
                  y={cy + 30}
                  textAnchor="middle"
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 28,
                    fill: "#e63946",
                    fontWeight: "bold",
                  }}
                >
                  ?
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
