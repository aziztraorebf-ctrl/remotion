import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface BaselineProps {
  country: string;
  year: string | number;
  source: string;
  fadeInStart?: number; // frame de début du fade-in (défaut 55)
  fadeInEnd?: number;   // frame de fin du fade-in (défaut 70)
  accentColor?: string; // couleur pays (défaut #d4a93c)
}

export const Baseline: React.FC<BaselineProps> = ({
  country,
  year,
  source,
  fadeInStart = 55,
  fadeInEnd = 70,
  accentColor = "#d4a93c",
}) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  const opacity = interpolate(frame, [fadeInStart, fadeInEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: height * 0.055,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        opacity,
      }}
    >
      <span style={{ color: accentColor, fontSize: 16, letterSpacing: "0.2em", fontFamily: "sans-serif", fontWeight: 600 }}>
        {country}
      </span>
      <span style={{ color: "#3a5a7a", fontSize: 14 }}>|</span>
      <span style={{ color: "#5a7a9a", fontSize: 15, letterSpacing: "0.12em", fontFamily: "sans-serif" }}>
        {year}
      </span>
      <span style={{ color: "#3a5a7a", fontSize: 14 }}>|</span>
      <span style={{ color: "#4a6a8a", fontSize: 14, letterSpacing: "0.08em", fontFamily: "sans-serif" }}>
        {source}
      </span>
    </div>
  );
};
