import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface LoomWeaverNodeColors {
  tl: string;
  tr: string;
  bl: string;
  br: string;
}

export interface LoomWeaverProps {
  title?: string;
  nodeColors?: LoomWeaverNodeColors;
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const WARP_Y = [135, 250.71, 366.42, 482.14, 597.85, 713.57, 829.28, 945];
const WEFT_X = [240, 445.71, 651.42, 857.14, 1062.85, 1268.57, 1474.28, 1680];

const WARP_DELAYS = [0, 8, 16, 24, 32, 40, 48, 56];
const WEFT_DELAYS = [40, 50, 60, 70, 80, 90, 100, 110];

const DEFAULT_NODE_COLORS: LoomWeaverNodeColors = {
  tl: "#4a9eff",
  tr: "#c8a951",
  bl: "#e63946",
  br: "#2d9e6b",
};

function getNodeColor(xi: number, yi: number, colors: LoomWeaverNodeColors): string {
  const left = xi < 4;
  const top = yi < 4;
  if (top && left) return colors.tl;
  if (top && !left) return colors.tr;
  if (!top && left) return colors.bl;
  return colors.br;
}

export const LoomWeaver: React.FC<LoomWeaverProps> = ({
  title = "ALLIANCES & INTERDEPENDANCES",
  nodeColors = DEFAULT_NODE_COLORS,
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 — fils horizontaux (warp)
  const warpOffsets = WARP_DELAYS.map((delay) =>
    interpolate(frame, [delay, delay + 30], [1920, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Phase 2 — fils verticaux (weft)
  const weftOffsets = WEFT_DELAYS.map((delay) =>
    interpolate(frame, [delay, delay + 30], [1080, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Phase 3 — nœuds aux intersections
  const nodeSprings: spring[][] = WEFT_X.map((_, xi) =>
    WARP_Y.map((_, yi) => {
      const nodeDelay = 120 + (xi + yi) * 2;
      return spring({
        frame: Math.max(0, frame - nodeDelay),
        fps,
        config: { damping: 12, stiffness: 150, mass: 0.8 },
      });
    })
  );

  // Phase 4 — titre
  const titleOp = interpolate(frame, [160, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleSpring = spring({
    frame: Math.max(0, frame - 160),
    fps,
    config: { damping: 20, stiffness: 100, mass: 1 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        {/* Fils horizontaux — warp */}
        {WARP_Y.map((y, i) => (
          <line
            key={`warp-${i}`}
            x1={0} y1={y} x2={1920} y2={y}
            stroke="rgba(242,235,217,0.4)"
            strokeWidth={2}
            strokeDasharray={1920}
            strokeDashoffset={warpOffsets[i] ?? 1920}
          />
        ))}

        {/* Fils verticaux — weft */}
        {WEFT_X.map((x, i) => (
          <line
            key={`weft-${i}`}
            x1={x} y1={0} x2={x} y2={1080}
            stroke="rgba(200,169,81,0.4)"
            strokeWidth={2}
            strokeDasharray={1080}
            strokeDashoffset={weftOffsets[i] ?? 1080}
          />
        ))}

        {/* Nœuds aux intersections */}
        {WEFT_X.map((x, xi) =>
          WARP_Y.map((y, yi) => {
            const sc = (nodeSprings[xi]?.[yi]) ?? 0;
            const color = getNodeColor(xi, yi, nodeColors);
            return (
              <circle
                key={`node-${xi}-${yi}`}
                cx={x}
                cy={y}
                r={8 * sc}
                fill={color}
                opacity={0.9}
              />
            );
          })
        )}

        {/* Titre central */}
        <g opacity={titleOp}>
          <rect
            x={660} y={480} width={600} height={120}
            rx={4}
            fill="rgba(26,37,53,0.92)"
            transform={`translate(960,540) scale(${titleSpring}) translate(-960,-540)`}
          />
          <text
            x={960} y={548}
            textAnchor="middle"
            style={{
              fontFamily: FONT_MONO,
              fontSize: 28,
              fontWeight: "bold",
              fill: "#f2ebd9",
              letterSpacing: 3,
            }}
            transform={`translate(960,540) scale(${titleSpring}) translate(-960,-540)`}
          >
            {title}
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
