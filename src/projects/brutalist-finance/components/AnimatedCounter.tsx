import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { COLORS, FONTS, SPRING_BRUT } from "../config/theme";

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
  fontFamily = FONTS.mono,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const visible = frame >= startFrame;
  if (!visible) return null;

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: {
      ...SPRING_BRUT,
      mass: 0.8,
    },
    durationInFrames: durationFrames,
  });

  const value = Math.round(startValue + (endValue - startValue) * progress);

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        fontWeight: 700,
        color,
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
