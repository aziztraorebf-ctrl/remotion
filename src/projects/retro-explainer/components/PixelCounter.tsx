import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { RETRO_COLORS } from "../config/theme";
import { loadFont } from "@remotion/google-fonts/PressStart2P";

const { fontFamily } = loadFont();

interface PixelCounterProps {
  startValue: number;
  endValue: number;
  startFrame?: number;
  durationFrames?: number;
  prefix?: string;
  suffix?: string;
  color?: string;
  fontSize?: number;
  label?: string;
}

export const PixelCounter: React.FC<PixelCounterProps> = ({
  startValue,
  endValue,
  startFrame = 0,
  durationFrames = 60,
  prefix = "",
  suffix = "",
  color = RETRO_COLORS.uiGreen,
  fontSize = 48,
  label,
}) => {
  const frame = useCurrentFrame();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const value = Math.round(
    interpolate(relativeFrame, [0, durationFrames], [startValue, endValue], {
      extrapolateRight: "clamp",
    })
  );

  // Glow intensity increases as number goes up
  const glowIntensity = interpolate(
    relativeFrame,
    [0, durationFrames],
    [5, 20],
    { extrapolateRight: "clamp" }
  );

  // Shake when counting fast
  const isCountingFast =
    relativeFrame > 5 && relativeFrame < durationFrames - 5;
  const shakeX = isCountingFast ? Math.sin(relativeFrame * 3) * 2 : 0;
  const shakeY = isCountingFast ? Math.cos(relativeFrame * 2.5) * 1.5 : 0;

  const formattedValue = value.toLocaleString("fr-FR");

  return (
    <div
      style={{
        textAlign: "center",
        fontFamily,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {label && (
        <div
          style={{
            fontSize: Math.round(fontSize * 0.35),
            color: RETRO_COLORS.textSecondary,
            marginBottom: 8,
            letterSpacing: 2,
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          fontSize,
          color,
          textShadow: `0 0 ${glowIntensity}px ${color}, 0 0 ${glowIntensity * 2}px ${color}40`,
          letterSpacing: 4,
        }}
      >
        {prefix}
        {formattedValue}
        {suffix}
      </div>
    </div>
  );
};
