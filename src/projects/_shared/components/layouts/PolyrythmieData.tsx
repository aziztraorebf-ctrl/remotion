import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface PolyrythmieBar {
  label: string;
  value: number;
  displayValue: string;
}

export interface PolyrythmieDataProps {
  bars?: PolyrythmieBar[];
  maxValue?: number;
  title?: string;
  unit?: string;
  thresholdValue?: number;
  thresholdLabel?: string;
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const DEFAULT_BARS: PolyrythmieBar[] = [
  { label: "MALI", value: 15.3, displayValue: "15.3 Md$" },
  { label: "SÉNÉGAL", value: 27.6, displayValue: "27.6 Md$" },
  { label: "BURKINA", value: 19.1, displayValue: "19.1 Md$" },
  { label: "CÔTE D'IVOIRE", value: 70.0, displayValue: "70.0 Md$" },
  { label: "NIGER", value: 13.6, displayValue: "13.6 Md$" },
  { label: "GUINÉE", value: 16.0, displayValue: "16.0 Md$" },
];

// Rythme syncopé Gemini : pattern 3+2+3 (délais inégaux, musicalité africaine)
const SYNCOPATED_DELAYS = [20, 35, 45, 60, 70, 85];

const CHART_START_X = 160;
const CHART_START_Y = 880;
const CHART_END_Y = 220;
const CHART_HEIGHT = CHART_START_Y - CHART_END_Y;
const BAR_WIDTH = 100;
const BAR_POSITIONS_X = [260, 520, 780, 1040, 1300, 1560];
const GRID_Y_POSITIONS = [880, 733, 587, 440, 293];

export const PolyrythmieData: React.FC<PolyrythmieDataProps> = ({
  bars = DEFAULT_BARS,
  maxValue = 80,
  title = "PIB COMPARÉ · ZONE CEDEAO",
  unit = "Md$",
  thresholdValue = 26.9,
  thresholdLabel = "MOYENNE RÉGIONALE",
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Grid lines draw-on (0→20)
  const gridProgress = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title appearance
  const titleOpacity = interpolate(frame, [5, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Threshold line draw-on (120→140)
  const thresholdProgress = interpolate(frame, [120, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const thresholdY = thresholdValue !== undefined
    ? CHART_START_Y - (thresholdValue / maxValue) * CHART_HEIGHT
    : 0;
  const totalChartWidth = 1760 - 160;

  // Per-bar animations
  const barAnimations = bars.map((bar, i) => {
    const delay = SYNCOPATED_DELAYS[i] ?? 20 + i * 20;
    const barSpring = spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: { damping: 12, stiffness: 150, mass: 1 },
    });
    const barHeight = (bar.value / maxValue) * CHART_HEIGHT;
    const currentHeight = barSpring * barHeight;
    const labelOpacity = interpolate(frame, [delay + 5, delay + 15], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const valueOpacity = interpolate(frame, [delay + 10, delay + 22], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { barSpring, barHeight, currentHeight, labelOpacity, valueOpacity };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 60,
          fontFamily: FONT_MONO,
          fontSize: 42,
          letterSpacing: 4,
          color: "#f2ebd9",
          textTransform: "uppercase" as const,
          opacity: titleOpacity,
        }}
      >
        {title}
      </div>

      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        {/* Grid lines horizontal (staff musical) */}
        {GRID_Y_POSITIONS.map((y, i) => (
          <line
            key={i}
            x1={CHART_START_X}
            y1={y}
            x2={CHART_START_X + totalChartWidth * gridProgress}
            y2={y}
            stroke="rgba(242,235,217,0.15)"
            strokeWidth={1}
          />
        ))}

        {/* Baseline */}
        <line
          x1={CHART_START_X}
          y1={CHART_START_Y}
          x2={CHART_START_X + totalChartWidth * gridProgress}
          y2={CHART_START_Y}
          stroke="rgba(242,235,217,0.4)"
          strokeWidth={1.5}
        />

        {/* Bars */}
        {bars.slice(0, BAR_POSITIONS_X.length).map((bar, i) => {
          const anim = barAnimations[i];
          const x = BAR_POSITIONS_X[i];
          return (
            <g key={i}>
              <rect
                x={x - BAR_WIDTH / 2}
                y={CHART_START_Y - anim.currentHeight}
                width={BAR_WIDTH}
                height={anim.currentHeight}
                fill="#c8a951"
                opacity={0.85}
              />
              {/* Value above bar */}
              <text
                x={x}
                y={CHART_START_Y - anim.currentHeight - 14}
                textAnchor="middle"
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 26,
                  letterSpacing: 1,
                  fill: "#c8a951",
                  opacity: anim.valueOpacity,
                  textTransform: "uppercase",
                }}
              >
                {bar.displayValue}
              </text>
              {/* Label below bar */}
              <text
                x={x}
                y={CHART_START_Y + 32}
                textAnchor="middle"
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 20,
                  letterSpacing: 2,
                  fill: "#4a9eff",
                  opacity: anim.labelOpacity,
                  textTransform: "uppercase",
                }}
              >
                {bar.label}
              </text>
            </g>
          );
        })}

        {/* Threshold line */}
        {thresholdValue !== undefined && (
          <>
            <line
              x1={CHART_START_X}
              y1={thresholdY}
              x2={CHART_START_X + totalChartWidth * thresholdProgress}
              y2={thresholdY}
              stroke="#4a9eff"
              strokeWidth={1.5}
              strokeDasharray="8 4"
            />
            <text
              x={1780}
              y={thresholdY - 10}
              textAnchor="end"
              style={{
                fontFamily: FONT_MONO,
                fontSize: 18,
                letterSpacing: 2,
                fill: "#4a9eff",
                opacity: thresholdProgress,
                textTransform: "uppercase",
              }}
            >
              {thresholdLabel}
            </text>
          </>
        )}
      </svg>
    </AbsoluteFill>
  );
};
