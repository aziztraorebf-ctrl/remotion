import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { getLength } from "@remotion/paths";

export interface LineChartDataPoint {
  year: string | number;
  value: number;
}

export interface LineChartDrawOnProps {
  title?: string;
  subtitle?: string;
  data?: LineChartDataPoint[];
  yLabel?: string;
  sourceLabel?: string;
  lineColor?: string;
  bgColor?: string;
  startFrame?: number;
  drawDuration?: number;
}

const DEFAULT_DATA: LineChartDataPoint[] = [
  { year: 2019, value: 0 },
  { year: 2020, value: 0 },
  { year: 2021, value: 2 },
  { year: 2022, value: 4 },
  { year: 2023, value: 8 },
  { year: 2024, value: 35 },
  { year: 2025, value: 70 },
  { year: 2026, value: 110 },
  { year: 2027, value: 145 },
];

const CLAMP = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const LineChartDrawOn: React.FC<LineChartDrawOnProps> = ({
  title = "PRODUCTION PETROLIERE",
  subtitle = "SENEGAL · CHAMP SANGOMAR",
  data = DEFAULT_DATA,
  yLabel = "MILLIONS DE BARILS",
  sourceLabel = "Source : Woodside Energy, 2024",
  lineColor = "#c8a951",
  bgColor = "transparent",
  startFrame = 0,
  drawDuration = 80,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const marginLeft = 120;
  const marginRight = 120;
  const marginTop = 200;
  const marginBottom = 140;

  const chartWidth = width - marginLeft - marginRight;
  const chartHeight = height * 0.7 - marginTop - marginBottom;
  const chartX = marginLeft;
  const chartY = marginTop;
  const chartBottom = chartY + chartHeight;

  const values = data.map((d) => d.value);
  const minVal = 0;
  const maxVal = Math.max(...values) * 1.1;

  const toX = (i: number) =>
    chartX + (i / (data.length - 1)) * chartWidth;
  const toY = (v: number) =>
    chartY + chartHeight - ((v - minVal) / (maxVal - minVal)) * chartHeight;

  const pathD = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i)},${toY(d.value)}`)
    .join(" ");

  const totalLength = getLength(pathD);

  const progress = interpolate(frame - startFrame, [0, drawDuration], [0, 1], CLAMP);
  const dashOffset = totalLength * (1 - progress);

  const dotX = interpolate(progress, [0, 1], [toX(0), toX(data.length - 1)], CLAMP);
  const dotY = (() => {
    const idx = progress * (data.length - 1);
    const lo = Math.floor(idx);
    const hi = Math.min(lo + 1, data.length - 1);
    const t = idx - lo;
    return toY(data[lo].value) * (1 - t) + toY(data[hi].value) * t;
  })();

  const afterDraw = frame - startFrame - drawDuration;
  const pulseScale =
    afterDraw >= 0
      ? 1 +
        0.3 *
          Math.abs(
            Math.sin((afterDraw / 20) * Math.PI)
          )
      : 1;

  const yTickCount = 4;
  const yTicks = Array.from({ length: yTickCount }, (_, i) =>
    minVal + ((maxVal - minVal) * i) / (yTickCount - 1)
  );

  const labelColor = "rgba(242,235,217,0.5)";
  const ivoire = "#f2ebd9";
  const gold = "#c8a951";

  // Area path: follow the line then close bottom
  const areaD =
    data.map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i)},${toY(d.value)}`).join(" ") +
    ` L ${toX(data.length - 1)},${chartBottom} L ${toX(0)},${chartBottom} Z`;

  // Animated clip rect width for area reveal
  const clipWidth = interpolate(progress, [0, 1], [0, chartWidth], CLAMP);

  // Scanner line x position (sweeps from chartLeft to chartRight during frames 0..drawDuration)
  const scannerX = interpolate(
    frame - startFrame,
    [0, drawDuration],
    [chartX, chartX + chartWidth],
    CLAMP
  );

  return (
    <AbsoluteFill style={{ background: bgColor }}>
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8a951" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#c8a951" stopOpacity={0} />
          </linearGradient>
          <clipPath id="area-clip">
            <rect
              x={chartX}
              y={chartY}
              width={clipWidth}
              height={chartHeight}
            />
          </clipPath>
        </defs>

        {/* Y grid lines (dashed only — no solid axis lines) */}
        {yTicks.map((tick, i) => {
          const ty = toY(tick);
          return (
            <g key={i}>
              <line
                x1={chartX}
                y1={ty}
                x2={chartX + chartWidth}
                y2={ty}
                stroke="#f2ebd9"
                strokeWidth={0.8}
                strokeDasharray="2,6"
                opacity={0.1}
              />
              <text
                x={chartX - 14}
                y={ty + 5}
                textAnchor="end"
                fill={labelColor}
                fontSize={22}
                fontFamily="'IBM Plex Mono', monospace"
              >
                {Math.round(tick)}
              </text>
            </g>
          );
        })}

        {/* X labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={toX(i)}
            y={chartBottom + 44}
            textAnchor="middle"
            fill={labelColor}
            fontSize={22}
            fontFamily="'IBM Plex Mono', monospace"
          >
            {d.year}
          </text>
        ))}

        {/* Scanner line — sweeps left to right independently */}
        {frame > startFrame && frame - startFrame <= drawDuration && (
          <line
            x1={scannerX}
            y1={chartY}
            x2={scannerX}
            y2={chartBottom}
            stroke="#4a9eff"
            strokeWidth={1}
            opacity={0.15}
          />
        )}

        {/* Area fill under curve — clipped to animate with progress */}
        <path
          d={areaD}
          fill="url(#area-gradient)"
          clipPath="url(#area-clip)"
        />

        {/* Glow layer */}
        <path
          d={pathD}
          fill="none"
          stroke={lineColor}
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={totalLength}
          strokeDashoffset={dashOffset}
          opacity={0.18}
        />

        {/* Curve */}
        <path
          d={pathD}
          fill="none"
          stroke={lineColor}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={totalLength}
          strokeDashoffset={dashOffset}
        />

        {/* Vertical cursor — dashed line from dot down to chart bottom */}
        {progress > 0 && (
          <line
            x1={dotX}
            y1={dotY}
            x2={dotX}
            y2={chartBottom}
            stroke="#c8a951"
            strokeWidth={1}
            strokeDasharray="4,4"
            opacity={0.5}
          />
        )}

        {/* Moving dot */}
        {progress > 0 && (
          <g transform={`translate(${dotX}, ${dotY})`}>
            <circle
              r={10 * pulseScale}
              fill={lineColor}
              opacity={0.25}
            />
            <circle
              r={6}
              fill={lineColor}
            />
          </g>
        )}
      </svg>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: marginLeft,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 36,
          fontWeight: 800,
          color: ivoire,
          textTransform: "uppercase",
          letterSpacing: 3,
        }}
      >
        {title}
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          top: 112,
          left: marginLeft,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 20,
          color: gold,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        {subtitle}
      </div>

      {/* Source */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          right: marginRight,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 18,
          color: `${gold}80`,
          letterSpacing: 1,
        }}
      >
        {sourceLabel}
      </div>
    </AbsoluteFill>
  );
};
