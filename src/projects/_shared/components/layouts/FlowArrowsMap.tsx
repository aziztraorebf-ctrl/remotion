import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { getLength } from "@remotion/paths";

export interface FlowArrow {
  id: string;
  fromLabel: string;
  toLabel: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  volume: number;
  volumeLabel: string;
  color?: string;
  delayFrames?: number;
}

export interface FlowArrowsMapProps {
  title?: string;
  subtitle?: string;
  arrows?: FlowArrow[];
  bgColor?: string;
  startFrame?: number;
  arrowDrawDuration?: number;
}

const DEFAULT_ARROWS: FlowArrow[] = [
  {
    id: "a1",
    fromLabel: "SENEGAL",
    toLabel: "EUROPE",
    fromX: 0.18,
    fromY: 0.55,
    toX: 0.52,
    toY: 0.25,
    volume: 2.4,
    volumeLabel: "2.4 MDS $",
    color: "#c8a951",
    delayFrames: 0,
  },
  {
    id: "a2",
    fromLabel: "SENEGAL",
    toLabel: "ASIE",
    fromX: 0.18,
    fromY: 0.55,
    toX: 0.78,
    toY: 0.35,
    volume: 1.1,
    volumeLabel: "1.1 MDS $",
    color: "#c8a951",
    delayFrames: 15,
  },
  {
    id: "a3",
    fromLabel: "SENEGAL",
    toLabel: "AFRIQUE",
    fromX: 0.18,
    fromY: 0.55,
    toX: 0.32,
    toY: 0.62,
    volume: 0.6,
    volumeLabel: "0.6 MDS $",
    color: "#4a9eff",
    delayFrames: 25,
  },
];

const VB_W = 1920;
const VB_H = 1080;

function buildCubicPath(
  fx: number,
  fy: number,
  tx: number,
  ty: number
): string {
  const dx = tx - fx;
  const dy = ty - fy;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  let cx1: number;
  let cy1: number;
  let cx2: number;
  let cy2: number;

  if (absDx >= absDy) {
    const bowY = Math.min(fy, ty) - absDx * 0.35;
    cx1 = fx + dx * 0.25;
    cy1 = bowY;
    cx2 = fx + dx * 0.75;
    cy2 = bowY;
  } else {
    const bowX = Math.min(fx, tx) - absDy * 0.35;
    cx1 = bowX;
    cy1 = fy + dy * 0.25;
    cx2 = bowX;
    cy2 = fy + dy * 0.75;
  }

  return `M ${fx},${fy} C ${cx1},${cy1} ${cx2},${cy2} ${tx},${ty}`;
}

function pointOnCubic(
  fx: number,
  fy: number,
  tx: number,
  ty: number,
  t: number
): { x: number; y: number } {
  const dx = tx - fx;
  const dy = ty - fy;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  let cx1: number;
  let cy1: number;
  let cx2: number;
  let cy2: number;

  if (absDx >= absDy) {
    const bowY = Math.min(fy, ty) - absDx * 0.35;
    cx1 = fx + dx * 0.25;
    cy1 = bowY;
    cx2 = fx + dx * 0.75;
    cy2 = bowY;
  } else {
    const bowX = Math.min(fx, tx) - absDy * 0.35;
    cx1 = bowX;
    cy1 = fy + dy * 0.25;
    cx2 = bowX;
    cy2 = fy + dy * 0.75;
  }

  const mt = 1 - t;
  const x =
    mt * mt * mt * fx +
    3 * mt * mt * t * cx1 +
    3 * mt * t * t * cx2 +
    t * t * t * tx;
  const y =
    mt * mt * mt * fy +
    3 * mt * mt * t * cy1 +
    3 * mt * t * t * cy2 +
    t * t * t * ty;
  return { x, y };
}

function arrowHeadPoints(
  fx: number,
  fy: number,
  tx: number,
  ty: number
): string {
  const dx = tx - fx;
  const dy = ty - fy;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  let cx2: number;
  let cy2: number;

  if (absDx >= absDy) {
    const bowY = Math.min(fy, ty) - absDx * 0.35;
    cx2 = fx + dx * 0.75;
    cy2 = bowY;
  } else {
    const bowX = Math.min(fx, tx) - absDy * 0.35;
    cx2 = bowX;
    cy2 = fy + dy * 0.75;
  }

  const vx = tx - cx2;
  const vy = ty - cy2;
  const len = Math.sqrt(vx * vx + vy * vy) || 1;
  const ux = vx / len;
  const uy = vy / len;

  const headLen = 18;
  const headWidth = 10;

  const bx = tx - ux * headLen;
  const by = ty - uy * headLen;

  const p1x = bx - uy * headWidth;
  const p1y = by + ux * headWidth;
  const p2x = bx + uy * headWidth;
  const p2y = by - ux * headWidth;

  return `${tx},${ty} ${p1x},${p1y} ${p2x},${p2y}`;
}

interface ArrowLayerProps {
  arrow: FlowArrow;
  normalizedVolume: number;
  frame: number;
  startFrame: number;
  arrowDrawDuration: number;
}

const ArrowLayer: React.FC<ArrowLayerProps> = ({
  arrow,
  normalizedVolume,
  frame,
  startFrame,
  arrowDrawDuration,
}) => {
  const delay = arrow.delayFrames ?? 0;
  const color = arrow.color ?? "#c8a951";
  const strokeWidth = 4 + normalizedVolume * 12;

  const fx = arrow.fromX * VB_W;
  const fy = arrow.fromY * VB_H;
  const tx = arrow.toX * VB_W;
  const ty = arrow.toY * VB_H;

  const pathDef = buildCubicPath(fx, fy, tx, ty);
  const pathLength = getLength(pathDef);

  const localFrame = frame - startFrame - delay;

  const progress = interpolate(
    localFrame,
    [0, arrowDrawDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Static draw dash: reveals the path from start to current progress
  const dashOffset = pathLength * (1 - progress);

  // Flow dash: animates continuously once the arrow is fully drawn (deterministic)
  const flowDashOffset = progress >= 1 ? -((localFrame - arrowDrawDuration) * 3) % 20 : 0;

  const fromOpacity = interpolate(
    localFrame,
    [0, 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const toOpacity = interpolate(
    localFrame,
    [arrowDrawDuration - 10, arrowDrawDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const arrowHeadOpacity = interpolate(
    localFrame,
    [arrowDrawDuration - 5, arrowDrawDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const midOpacity = interpolate(
    localFrame,
    [Math.floor(arrowDrawDuration * 0.4), Math.floor(arrowDrawDuration * 0.7)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Glow dot: follows the arrow head during draw
  const glowDotProgress = Math.min(progress, 0.98);
  const glowDotPos = pointOnCubic(fx, fy, tx, ty, glowDotProgress);

  // Hide glow dot once arrow is fully drawn
  const glowDotOpacity = interpolate(
    localFrame,
    [0, 5, arrowDrawDuration - 5, arrowDrawDuration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const midPoint = pointOnCubic(fx, fy, tx, ty, 0.5);
  const headPoints = arrowHeadPoints(fx, fy, tx, ty);

  // Label vertical tick offset (drawn to the left of from/to label text)
  const tickHeight = 22;

  return (
    <g>
      {/* Arrow body: draw reveal */}
      <path
        d={pathDef}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
        opacity={0.85}
      />

      {/* Flow dash overlay: continuous flux animation after full draw */}
      {progress >= 1 && (
        <path
          d={pathDef}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth * 0.6}
          strokeLinecap="round"
          strokeDasharray="4,16"
          strokeDashoffset={flowDashOffset}
          opacity={0.45}
        />
      )}

      {/* Arrow head */}
      <polygon
        points={headPoints}
        fill={color}
        opacity={arrowHeadOpacity}
      />

      {/* Glow dot: luminous head following the draw */}
      <circle
        cx={glowDotPos.x}
        cy={glowDotPos.y}
        r={6}
        fill={color}
        opacity={glowDotOpacity}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />

      {/* From label: vertical tick + IBM Plex Mono text, no rect background */}
      <g opacity={fromOpacity}>
        <line
          x1={fx - 52}
          y1={fy - tickHeight / 2}
          x2={fx - 52}
          y2={fy + tickHeight / 2}
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <text
          x={fx - 44}
          y={fy + 6}
          textAnchor="start"
          fill="#f2ebd9"
          fontSize={18}
          fontFamily="'IBM Plex Mono', 'Courier New', monospace"
          fontWeight="700"
          letterSpacing="2"
        >
          {arrow.fromLabel}
        </text>
      </g>

      {/* To label: vertical tick + IBM Plex Mono text, no rect background */}
      <g opacity={toOpacity}>
        <line
          x1={tx - 52}
          y1={ty + 10}
          x2={tx - 52}
          y2={ty + 10 + tickHeight}
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <text
          x={tx - 44}
          y={ty + 26}
          textAnchor="start"
          fill={color}
          fontSize={18}
          fontFamily="'IBM Plex Mono', 'Courier New', monospace"
          fontWeight="700"
          letterSpacing="2"
        >
          {arrow.toLabel}
        </text>
      </g>

      {/* Volume label at midpoint: horizontal tick + IBM Plex Mono text, no pill */}
      <g opacity={midOpacity}>
        <line
          x1={midPoint.x - 10}
          y1={midPoint.y + 4}
          x2={midPoint.x + 10}
          y2={midPoint.y + 4}
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <text
          x={midPoint.x + 18}
          y={midPoint.y + 10}
          textAnchor="start"
          fill={color}
          fontSize={22}
          fontFamily="'IBM Plex Mono', 'Courier New', monospace"
          fontWeight="800"
          letterSpacing="1"
        >
          {arrow.volumeLabel}
        </text>
      </g>
    </g>
  );
};

export const FlowArrowsMap: React.FC<FlowArrowsMapProps> = ({
  title = "EXPORTS SENEGAL",
  subtitle = "DESTINATIONS PRINCIPALES - 2024",
  arrows = DEFAULT_ARROWS,
  bgColor = "transparent",
  startFrame = 0,
  arrowDrawDuration = 60,
}) => {
  const frame = useCurrentFrame();
  useVideoConfig();

  const volumes = arrows.map((a) => a.volume);
  const maxVolume = Math.max(...volumes, 1);
  const minVolume = Math.min(...volumes, 0);
  const range = maxVolume - minVolume || 1;

  const titleOpacity = interpolate(frame - startFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      {/* Dots-grid background */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(242,235,217,0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          backgroundColor: "transparent",
        }}
      />

      {/* Flow arrows SVG layer */}
      <AbsoluteFill>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid slice"
          style={{ position: "absolute", inset: 0 }}
        >
          {arrows.map((arrow) => {
            const normalizedVolume = (arrow.volume - minVolume) / range;
            return (
              <ArrowLayer
                key={arrow.id}
                arrow={arrow}
                normalizedVolume={normalizedVolume}
                frame={frame}
                startFrame={startFrame}
                arrowDrawDuration={arrowDrawDuration}
              />
            );
          })}
        </svg>
      </AbsoluteFill>

      {/* Title overlay */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: "0 80px 60px 80px",
          pointerEvents: "none",
        }}
      >
        <div style={{ opacity: titleOpacity }}>
          {title && (
            <div
              style={{
                color: "#ffffff",
                fontSize: 48,
                fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                fontWeight: 700,
                letterSpacing: "0.18em",
                lineHeight: 1.1,
                textTransform: "uppercase",
              }}
            >
              {title}
            </div>
          )}
          {subtitle && (
            <div
              style={{
                color: "#c8a951",
                fontSize: 22,
                fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                fontWeight: 500,
                letterSpacing: "0.12em",
                marginTop: 8,
                textTransform: "uppercase",
                opacity: 0.85,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default FlowArrowsMap;
