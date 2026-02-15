import React, { useMemo } from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONTS, PIXEL_SIZE } from "../config/theme";
import { PLAGUE_DATA } from "../config/data";

interface PixelLineChartProps {
  startFrame: number;
  drawDuration: number;
  width?: number;
  height?: number;
  showComparison?: boolean;
  comparisonStartFrame?: number;
  comparisonDrawDuration?: number;
}

// Chart margins
const MARGIN = { top: 60, right: 80, bottom: 60, left: 100 };

// Step size for pixelated line -- larger for visible retro aesthetic
const STEP = PIXEL_SIZE * 3;

// Generate stepped (staircase) path between two points
const generateSteps = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  step: number
): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = [];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const numSteps = Math.max(1, Math.floor(dist / step));

  for (let i = 0; i <= numSteps; i++) {
    const t = i / numSteps;
    // Horizontal first, then vertical (staircase)
    const x = Math.round((x1 + dx * t) / step) * step;
    const y = Math.round((y1 + dy * t) / step) * step;
    points.push({ x, y });
  }
  return points;
};

// COVID-like exponential curve for comparison
const generateCovidCurve = (
  numPoints: number,
  maxDay: number,
  maxDeaths: number
): { day: number; deaths: number }[] => {
  const points: { day: number; deaths: number }[] = [];
  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1);
    const day = t * maxDay * 0.15; // COVID spreads much faster
    // Exponential then plateau
    const deaths = maxDeaths * (1 - Math.exp(-t * 4));
    points.push({ day, deaths });
  }
  return points;
};

export const PixelLineChart: React.FC<PixelLineChartProps> = ({
  startFrame,
  drawDuration,
  width = 1200,
  height = 700,
  showComparison = false,
  comparisonStartFrame = 0,
  comparisonDrawDuration = 300,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elapsed = Math.max(0, frame - startFrame);

  // Chart area
  const chartW = width - MARGIN.left - MARGIN.right;
  const chartH = height - MARGIN.top - MARGIN.bottom;

  // Data ranges
  const maxDay = PLAGUE_DATA[PLAGUE_DATA.length - 1].day;
  const maxDeaths = PLAGUE_DATA[PLAGUE_DATA.length - 1].deaths;

  // Map data to chart coordinates
  const toX = (day: number) =>
    MARGIN.left + (day / maxDay) * chartW;
  const toY = (deaths: number) =>
    MARGIN.top + chartH - (deaths / maxDeaths) * chartH;

  // Generate all stepped points for plague curve
  const plagueSteps = useMemo(() => {
    const allSteps: { x: number; y: number }[] = [];
    for (let i = 0; i < PLAGUE_DATA.length - 1; i++) {
      const p1 = PLAGUE_DATA[i];
      const p2 = PLAGUE_DATA[i + 1];
      const steps = generateSteps(
        toX(p1.day),
        toY(p1.deaths),
        toX(p2.day),
        toY(p2.deaths),
        STEP
      );
      // Skip first point of each segment (except the very first) to avoid duplicates
      allSteps.push(...(i === 0 ? steps : steps.slice(1)));
    }
    return allSteps;
  }, [chartW, chartH]);

  // COVID comparison steps
  const covidData = useMemo(
    () => generateCovidCurve(20, maxDay, maxDeaths * 0.8),
    [maxDay, maxDeaths]
  );
  const covidSteps = useMemo(() => {
    const allSteps: { x: number; y: number }[] = [];
    for (let i = 0; i < covidData.length - 1; i++) {
      const p1 = covidData[i];
      const p2 = covidData[i + 1];
      const steps = generateSteps(
        toX(p1.day),
        toY(p1.deaths),
        toX(p2.day),
        toY(p2.deaths),
        STEP
      );
      allSteps.push(...(i === 0 ? steps : steps.slice(1)));
    }
    return allSteps;
  }, [covidData, chartW, chartH]);

  // Draw progress
  const plagueProgress = interpolate(
    elapsed,
    [0, drawDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const covidElapsed = Math.max(0, frame - comparisonStartFrame);
  const covidProgress = showComparison
    ? interpolate(
        covidElapsed,
        [0, comparisonDrawDuration],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  const visiblePlagueSteps = Math.floor(plagueProgress * plagueSteps.length);
  const visibleCovidSteps = Math.floor(covidProgress * covidSteps.length);

  if (elapsed <= 0) return null;

  return (
    <div style={{ position: "relative", width, height }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ imageRendering: "pixelated" }}
      >
        {/* Axes */}
        <line
          x1={MARGIN.left}
          y1={MARGIN.top}
          x2={MARGIN.left}
          y2={MARGIN.top + chartH}
          stroke={COLORS.terminalGreenDim}
          strokeWidth={2}
        />
        <line
          x1={MARGIN.left}
          y1={MARGIN.top + chartH}
          x2={MARGIN.left + chartW}
          y2={MARGIN.top + chartH}
          stroke={COLORS.terminalGreenDim}
          strokeWidth={2}
        />

        {/* Y-axis label */}
        <text
          x={MARGIN.left + 4}
          y={MARGIN.top - 20}
          textAnchor="start"
          fontFamily={FONTS.title}
          fontSize={10}
          fill={COLORS.terminalGreenDim}
        >
          MORTS (MILLIERS)
        </text>

        {/* X-axis label */}
        <text
          x={MARGIN.left + chartW}
          y={MARGIN.top + chartH + 40}
          textAnchor="end"
          fontFamily={FONTS.title}
          fontSize={10}
          fill={COLORS.terminalGreenDim}
        >
          JOURS
        </text>

        {/* Y-axis ticks */}
        {[0, 2500, 5000, 7500, 10000].map((val) => {
          const y = toY(val);
          return (
            <g key={`y-${val}`}>
              <line
                x1={MARGIN.left - 6}
                y1={y}
                x2={MARGIN.left}
                y2={y}
                stroke={COLORS.terminalGreenDim}
                strokeWidth={1}
              />
              <text
                x={MARGIN.left - 10}
                y={y + 4}
                textAnchor="end"
                fontFamily={FONTS.body}
                fontSize={16}
                fill={COLORS.terminalGreenDim}
              >
                {(val / 1000).toFixed(0)}M
              </text>
              {/* Grid line */}
              <line
                x1={MARGIN.left}
                y1={y}
                x2={MARGIN.left + chartW}
                y2={y}
                stroke={COLORS.terminalGreenDim}
                strokeWidth={0.5}
                opacity={0.15}
              />
            </g>
          );
        })}

        {/* X-axis ticks */}
        {[0, 180, 360, 540, 720, 900].map((val) => {
          const x = toX(val);
          return (
            <g key={`x-${val}`}>
              <line
                x1={x}
                y1={MARGIN.top + chartH}
                x2={x}
                y2={MARGIN.top + chartH + 6}
                stroke={COLORS.terminalGreenDim}
                strokeWidth={1}
              />
              <text
                x={x}
                y={MARGIN.top + chartH + 24}
                textAnchor="middle"
                fontFamily={FONTS.body}
                fontSize={16}
                fill={COLORS.terminalGreenDim}
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Plague curve (stepped pixels) */}
        {plagueSteps.slice(0, visiblePlagueSteps).map((pt, i) => (
          <rect
            key={`p-${i}`}
            x={pt.x - STEP / 2}
            y={pt.y - STEP / 2}
            width={STEP}
            height={STEP}
            fill={COLORS.plagueRed}
          />
        ))}

        {/* COVID curve (stepped pixels) */}
        {showComparison &&
          covidSteps.slice(0, visibleCovidSteps).map((pt, i) => (
            <rect
              key={`c-${i}`}
              x={pt.x - STEP / 2}
              y={pt.y - STEP / 2}
              width={STEP}
              height={STEP}
              fill={COLORS.terminalGreen}
            />
          ))}

        {/* Legend */}
        {plagueProgress > 0.1 && (
          <g>
            <rect
              x={MARGIN.left + chartW - 200}
              y={MARGIN.top + 10}
              width={12}
              height={12}
              fill={COLORS.plagueRed}
            />
            <text
              x={MARGIN.left + chartW - 182}
              y={MARGIN.top + 21}
              fontFamily={FONTS.body}
              fontSize={18}
              fill={COLORS.textPrimary}
            >
              Peste (1347-1351)
            </text>
          </g>
        )}
        {showComparison && covidProgress > 0.1 && (
          <g>
            <rect
              x={MARGIN.left + chartW - 200}
              y={MARGIN.top + 34}
              width={12}
              height={12}
              fill={COLORS.terminalGreen}
            />
            <text
              x={MARGIN.left + chartW - 182}
              y={MARGIN.top + 45}
              fontFamily={FONTS.body}
              fontSize={18}
              fill={COLORS.textPrimary}
            >
              COVID-19 (2020)
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
