import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS } from "../config/theme";

interface DataPoint {
  x: number; // 0-1 normalized
  y: number; // 0-1 normalized
}

interface LineChartProps {
  data: DataPoint[];
  startFrame: number;
  width?: number;
  height?: number;
  color?: string;
  showArea?: boolean;
  showDots?: boolean;
  xLabels?: string[];
  yLabels?: string[];
  title?: string;
  fontFamily?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  startFrame,
  width = 700,
  height = 350,
  color = COLORS.green,
  showArea = true,
  showDots = true,
  xLabels = [],
  yLabels = [],
  title,
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const padding = { top: 40, right: 30, bottom: 40, left: 60 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Animate drawing progress
  const drawProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 30, mass: 1.2, stiffness: 40 },
  });

  const opacity = interpolate(frame, [startFrame - 10, startFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Build SVG path
  const points = data.map((d) => ({
    x: padding.left + d.x * chartW,
    y: padding.top + (1 - d.y) * chartH,
  }));

  // Only show points up to drawProgress
  const visibleCount = Math.ceil(points.length * drawProgress);
  const visiblePoints = points.slice(0, visibleCount);

  const linePath =
    visiblePoints.length > 1
      ? visiblePoints
          .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
          .join(" ")
      : "";

  const areaPath =
    visiblePoints.length > 1
      ? `${linePath} L ${visiblePoints[visiblePoints.length - 1].x} ${padding.top + chartH} L ${visiblePoints[0].x} ${padding.top + chartH} Z`
      : "";

  return (
    <div style={{ opacity, fontFamily }}>
      {title && (
        <div
          style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          {title}
        </div>
      )}
      <svg width={width} height={height}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
          <line
            key={i}
            x1={padding.left}
            y1={padding.top + (1 - v) * chartH}
            x2={padding.left + chartW}
            y2={padding.top + (1 - v) * chartH}
            stroke={COLORS.gridLine}
            strokeWidth={1}
          />
        ))}

        {/* Area fill */}
        {showArea && areaPath && (
          <path
            d={areaPath}
            fill={`url(#areaGrad-${color.replace("#", "")})`}
          />
        )}

        {/* Line */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Dots */}
        {showDots &&
          visiblePoints.map((p, i) => {
            const dotScale = spring({
              frame: frame - startFrame - i * 3,
              fps,
              config: { damping: 10, mass: 0.3 },
            });
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={5 * dotScale}
                fill={color}
                stroke={COLORS.bgPrimary}
                strokeWidth={2}
              />
            );
          })}

        {/* Y-axis labels */}
        {yLabels.map((label, i) => (
          <text
            key={i}
            x={padding.left - 10}
            y={padding.top + (1 - i / (yLabels.length - 1)) * chartH + 4}
            textAnchor="end"
            fontSize={11}
            fill={COLORS.textMuted}
            fontFamily={fontFamily}
          >
            {label}
          </text>
        ))}

        {/* X-axis labels */}
        {xLabels.map((label, i) => (
          <text
            key={i}
            x={padding.left + (i / (xLabels.length - 1)) * chartW}
            y={height - 10}
            textAnchor="middle"
            fontSize={11}
            fill={COLORS.textMuted}
            fontFamily={fontFamily}
          >
            {label}
          </text>
        ))}

        {/* Gradient definition */}
        <defs>
          <linearGradient
            id={`areaGrad-${color.replace("#", "")}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
