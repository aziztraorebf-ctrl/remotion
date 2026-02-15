import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS } from "../config/theme";

interface AnimatedBarProps {
  value: number; // 0-100
  maxValue?: number;
  startFrame: number;
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  showValue?: boolean;
  suffix?: string;
  fontFamily?: string;
}

export const AnimatedBar: React.FC<AnimatedBarProps> = ({
  value,
  maxValue = 100,
  startFrame,
  width = 500,
  height = 40,
  color = COLORS.green,
  backgroundColor = COLORS.bgCard,
  label,
  showValue = true,
  suffix = "",
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 20, mass: 0.8, stiffness: 80 },
  });

  const barWidth = (value / maxValue) * 100 * progress;

  const opacity = interpolate(frame, [startFrame - 5, startFrame + 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ opacity, fontFamily, width }}>
      {label && (
        <div
          style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            marginBottom: 8,
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          width: "100%",
          height,
          backgroundColor,
          borderRadius: height / 2,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${barWidth}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: height / 2,
            boxShadow: `0 0 20px ${color}40`,
            position: "relative",
          }}
        />
      </div>
      {showValue && (
        <div
          style={{
            fontSize: 16,
            color,
            marginTop: 6,
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(value * progress).toLocaleString("fr-FR")}
          {suffix}
        </div>
      )}
    </div>
  );
};
