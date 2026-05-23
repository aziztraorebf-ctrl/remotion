import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface MosaiqueWaxProps {
  title?: string;
  subtitle?: string;
  colors?: string[];
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const DEFAULT_COLORS = [
  "#e63946", "#c8a951", "#4a9eff", "#2d9e6b", "#f2ebd9", "#e63946",
  "#c8a951", "#4a9eff", "#2d9e6b", "#f2ebd9", "#e63946", "#c8a951",
  "#4a9eff", "#2d9e6b", "#f2ebd9", "#e63946", "#c8a951", "#4a9eff",
  "#2d9e6b", "#f2ebd9", "#e63946", "#c8a951", "#4a9eff", "#2d9e6b",
];

const STAGGER_DELAYS = [
  0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44,
  48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92,
];

// 24 triangles précalculés par Gemini
const TRIANGLES = [
  "960,540 960,340 1133,440",
  "960,340 960,140 1133,240",
  "960,340 1133,240 1133,440",
  "1133,240 1306,340 1133,440",
  "960,540 1133,440 1133,640",
  "1133,440 1306,340 1306,540",
  "1133,440 1306,540 1133,640",
  "1306,540 1306,740 1133,640",
  "960,540 1133,640 960,740",
  "1133,640 1306,740 1133,840",
  "1133,640 1133,840 960,740",
  "1133,840 960,940 960,740",
  "960,540 960,740 787,640",
  "960,740 960,940 787,840",
  "960,740 787,840 787,640",
  "787,840 614,740 787,640",
  "960,540 787,640 787,440",
  "787,640 614,740 614,540",
  "787,640 614,540 787,440",
  "614,540 614,340 787,440",
  "960,540 787,440 960,340",
  "787,440 614,340 787,240",
  "787,440 787,240 960,340",
  "787,240 960,140 960,340",
];

export const MosaiqueWax: React.FC<MosaiqueWaxProps> = ({
  title = "TEXTILE ET IDENTITE",
  subtitle = "LE MOTIF QUI PARLE",
  colors = DEFAULT_COLORS,
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const triangleSprings = STAGGER_DELAYS.map((delay) =>
    spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: { damping: 10, stiffness: 180, mass: 0.8 },
    })
  );

  const titleSpring = spring({
    frame: Math.max(0, frame - 150),
    fps,
    config: { damping: 14, stiffness: 120, mass: 1 },
  });
  const titleOp = interpolate(frame, [150, 168], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        {/* Triangles wax */}
        {TRIANGLES.map((pts, i) => {
          const sc = triangleSprings[i] ?? 0;
          const color = (colors[i] ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length])!;
          // Centre du triangle pour la transformation scale
          const coords = pts.split(" ").map((p) => p.split(",").map(Number));
          const cx = (coords.reduce((s, c) => s + (c[0] ?? 0), 0) / 3).toFixed(1);
          const cy = (coords.reduce((s, c) => s + (c[1] ?? 0), 0) / 3).toFixed(1);
          return (
            <polygon
              key={i}
              points={pts}
              fill={color}
              stroke="#1a2535"
              strokeWidth={1.5}
              transform={`translate(${cx},${cy}) scale(${sc}) translate(-${cx},-${cy})`}
            />
          );
        })}

        {/* Titre central overlay */}
        <g opacity={titleOp}>
          {/* Badge fond */}
          <rect
            x={760} y={500} width={400} height={80}
            rx={4}
            fill="#f2ebd9"
            transform={`translate(960,540) scale(${titleSpring}) translate(-960,-540)`}
          />
          <text
            x={960} y={548}
            textAnchor="middle"
            style={{
              fontFamily: FONT_MONO,
              fontSize: 28,
              fontWeight: "bold",
              fill: "#1a2535",
              letterSpacing: 4,
            }}
            transform={`translate(960,540) scale(${titleSpring}) translate(-960,-540)`}
          >
            {title}
          </text>
          {subtitle && (
            <text
              x={960} y={572}
              textAnchor="middle"
              style={{
                fontFamily: FONT_MONO,
                fontSize: 14,
                fill: "#1a2535",
                opacity: 0.6,
                letterSpacing: 2,
              }}
              transform={`translate(960,540) scale(${titleSpring}) translate(-960,-540)`}
            >
              {subtitle}
            </text>
          )}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
