import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { FONTS, COLORS } from "../config/theme";

interface DeathCounterProps {
  startFrame: number;
  endFrame: number;
  startValue: number;
  endValue: number;
  label?: string;
}

export const DeathCounter: React.FC<DeathCounterProps> = ({
  startFrame,
  endFrame,
  startValue,
  endValue,
  label = "morts",
}) => {
  const frame = useCurrentFrame();

  const rawValue = interpolate(
    frame,
    [startFrame, endFrame],
    [startValue, endValue],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const value = Math.round(rawValue);
  const formatted = value.toLocaleString("fr-FR");

  if (frame < startFrame) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 64,
          color: COLORS.plagueRed,
          lineHeight: 1,
          textShadow: `0 0 20px ${COLORS.plagueRed}40`,
        }}
      >
        ~ {formatted}
      </div>
      <div
        style={{
          fontFamily: FONTS.title,
          fontSize: 14,
          color: COLORS.textSecondary,
          marginTop: 8,
          letterSpacing: 2,
        }}
      >
        {label}
      </div>
    </div>
  );
};
