import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS } from "../config/theme";

interface DonutSegment {
  value: number;
  color: string;
  label: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  startFrame: number;
  size?: number;
  strokeWidth?: number;
  centerText?: string;
  centerSubText?: string;
  fontFamily?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  segments,
  startFrame,
  size = 280,
  strokeWidth = 32,
  centerText,
  centerSubText,
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const drawProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 25, mass: 1.0, stiffness: 50 },
  });

  const opacity = interpolate(frame, [startFrame - 5, startFrame + 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let accumulatedOffset = 0;

  return (
    <div style={{ opacity, position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={COLORS.bgCard}
          strokeWidth={strokeWidth}
        />

        {/* Segments */}
        {segments.map((segment, i) => {
          const segmentLength = (segment.value / total) * circumference;
          const dashArray = `${segmentLength * drawProgress} ${circumference}`;
          const rotation = -90 + (accumulatedOffset / total) * 360;
          accumulatedOffset += segment.value;

          return (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              strokeLinecap="round"
              transform={`rotate(${rotation} ${center} ${center})`}
              style={{
                filter: `drop-shadow(0 0 6px ${segment.color}40)`,
              }}
            />
          );
        })}
      </svg>

      {/* Center text */}
      {centerText && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily,
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: COLORS.textPrimary,
              opacity: drawProgress,
            }}
          >
            {centerText}
          </div>
          {centerSubText && (
            <div
              style={{
                fontSize: 12,
                color: COLORS.textSecondary,
                marginTop: 4,
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {centerSubText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
