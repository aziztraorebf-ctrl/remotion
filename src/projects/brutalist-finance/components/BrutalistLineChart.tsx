import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS, FONTS, BORDER } from "../config/theme";

interface DataPoint {
  x: number;
  y: number;
}

interface BrutalistLineChartProps {
  data: DataPoint[];
  startFrame: number;
  width?: number;
  height?: number;
  color?: string;
  secondaryData?: DataPoint[];
  secondaryColor?: string;
  xLabels?: string[];
  yLabels?: string[];
  title?: string;
  borderColor?: string;
  drawDuration?: number;
}

export const BrutalistLineChart: React.FC<BrutalistLineChartProps> = ({
  data,
  startFrame,
  width = 600,
  height = 250,
  color = COLORS.blue,
  secondaryData,
  secondaryColor = COLORS.red,
  xLabels,
  yLabels,
  title,
  borderColor = COLORS.white,
  drawDuration = 90,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const visible = frame >= startFrame;
  if (!visible) return null;

  const drawProgress = interpolate(
    frame,
    [startFrame, startFrame + drawDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const padding = { top: 30, right: 20, bottom: 40, left: 60 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const toPath = (points: DataPoint[]): string => {
    return points
      .map((p, i) => {
        const px = padding.left + p.x * chartW;
        const py = padding.top + (1 - p.y) * chartH;
        return `${i === 0 ? "M" : "L"} ${px} ${py}`;
      })
      .join(" ");
  };

  const pathStr = toPath(data);
  const secondaryPathStr = secondaryData ? toPath(secondaryData) : "";

  const estimatePathLength = (points: DataPoint[]): number => {
    let len = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = (points[i].x - points[i - 1].x) * chartW;
      const dy = (points[i].y - points[i - 1].y) * chartH;
      len += Math.sqrt(dx * dx + dy * dy);
    }
    return len;
  };

  const pathLength = estimatePathLength(data);
  const secondaryPathLength = secondaryData
    ? estimatePathLength(secondaryData)
    : 0;

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {title && (
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 14,
            fontWeight: 400,
            color: COLORS.textMuted,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          {title}
        </div>
      )}
      <svg
        width={width}
        height={height}
        style={{
          border: `${BORDER.width}px ${BORDER.style} ${borderColor}`,
        }}
      >
        {/* Horizontal grid lines */}
        {gridLines.map((g) => {
          const y = padding.top + (1 - g) * chartH;
          return (
            <line
              key={g}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke={COLORS.gridLine}
              strokeWidth={1}
            />
          );
        })}

        {/* Primary line */}
        <path
          d={pathStr}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength * (1 - drawProgress)}
          strokeLinecap="butt"
        />

        {/* Secondary line */}
        {secondaryData && secondaryPathStr && (
          <path
            d={secondaryPathStr}
            fill="none"
            stroke={secondaryColor}
            strokeWidth={4}
            strokeDasharray={secondaryPathLength}
            strokeDashoffset={secondaryPathLength * (1 - drawProgress)}
            strokeLinecap="butt"
          />
        )}

        {/* Square points - primary */}
        {data.map((p, i) => {
          const pointProgress = interpolate(
            drawProgress,
            [i / data.length, (i + 1) / data.length],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          if (pointProgress < 0.5) return null;
          const px = padding.left + p.x * chartW;
          const py = padding.top + (1 - p.y) * chartH;
          return (
            <rect
              key={`p-${i}`}
              x={px - 4}
              y={py - 4}
              width={8}
              height={8}
              fill={color}
            />
          );
        })}

        {/* Square points - secondary */}
        {secondaryData?.map((p, i) => {
          const pointProgress = interpolate(
            drawProgress,
            [i / secondaryData.length, (i + 1) / secondaryData.length],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          if (pointProgress < 0.5) return null;
          const px = padding.left + p.x * chartW;
          const py = padding.top + (1 - p.y) * chartH;
          return (
            <rect
              key={`s-${i}`}
              x={px - 4}
              y={py - 4}
              width={8}
              height={8}
              fill={secondaryColor}
            />
          );
        })}

        {/* X labels */}
        {xLabels?.map((label, i) => {
          const px =
            padding.left + (i / (xLabels.length - 1)) * chartW;
          return (
            <text
              key={`xl-${i}`}
              x={px}
              y={height - 8}
              fill={COLORS.textMuted}
              fontFamily={FONTS.mono}
              fontSize={12}
              textAnchor="middle"
            >
              {label}
            </text>
          );
        })}

        {/* Y labels */}
        {yLabels?.map((label, i) => {
          const py =
            padding.top + (1 - i / (yLabels.length - 1)) * chartH;
          return (
            <text
              key={`yl-${i}`}
              x={padding.left - 8}
              y={py + 4}
              fill={COLORS.textMuted}
              fontFamily={FONTS.mono}
              fontSize={12}
              textAnchor="end"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
