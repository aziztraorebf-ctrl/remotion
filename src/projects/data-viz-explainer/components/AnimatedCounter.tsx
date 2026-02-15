import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../config/theme";

interface AnimatedCounterProps {
  startValue: number;
  endValue: number;
  startFrame: number;
  durationFrames: number;
  prefix?: string;
  suffix?: string;
  color?: string;
  fontSize?: number;
  locale?: string;
  fontFamily?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  startValue,
  endValue,
  startFrame,
  durationFrames,
  prefix = "",
  suffix = "",
  color = COLORS.textPrimary,
  fontSize = 64,
  locale = "fr-FR",
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();

  const value = Math.round(
    interpolate(frame, [startFrame, startFrame + durationFrames], [startValue, endValue], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const opacity = interpolate(frame, [startFrame - 10, startFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        fontWeight: 800,
        color,
        opacity,
        letterSpacing: -1,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {prefix}
      {value.toLocaleString(locale)}
      {suffix}
    </div>
  );
};
