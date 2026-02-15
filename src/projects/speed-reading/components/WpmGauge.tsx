import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

type WpmGaugeProps = {
  maxWpm: number;
};

export const WpmGauge: React.FC<WpmGaugeProps> = ({ maxWpm }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animate from 0 to maxWpm over 1.5 seconds
  const gaugeValue = interpolate(
    frame,
    [0, 1.5 * fps],
    [0, maxWpm],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  const displayValue = Math.round(gaugeValue);

  // Pulsing glow at the end
  const glowIntensity = interpolate(
    frame,
    [1.5 * fps, 2 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 140,
          fontWeight: 700,
          color: "#FFFFFF",
          fontVariantNumeric: "tabular-nums",
          textShadow: `0 0 ${40 + glowIntensity * 40}px rgba(245, 158, 11, ${0.3 + glowIntensity * 0.4})`,
        }}
      >
        {displayValue}
      </div>
      <div
        style={{
          fontFamily,
          fontSize: 28,
          fontWeight: 700,
          color: "#94A3B8",
          letterSpacing: 6,
          textTransform: "uppercase",
        }}
      >
        words per minute
      </div>
    </div>
  );
};
