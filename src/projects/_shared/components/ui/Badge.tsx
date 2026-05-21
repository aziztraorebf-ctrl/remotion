import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface BadgeProps {
  label: string;
  appearFrame: number;
  bgColor?: string;      // défaut #5a1010 (rouge)
  borderColor?: string;  // défaut #8b2020
  textColor?: string;    // défaut #f5f0e8
  fontSize?: number;     // défaut 22
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  appearFrame,
  bgColor = "#5a1010",
  borderColor = "#8b2020",
  textColor = "#f5f0e8",
  fontSize = 22,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = spring({
    frame: frame - appearFrame,
    fps,
    config: { damping: 22, stiffness: 120 },
  });

  const opacity = interpolate(frame - appearFrame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(t, [0, 1], [0.85, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        background: bgColor,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 4,
        padding: "5px 18px",
      }}
    >
      <span
        style={{
          color: textColor,
          fontSize,
          fontWeight: 700,
          letterSpacing: "0.12em",
          fontFamily: "Bebas Neue, Impact, sans-serif",
        }}
      >
        {label}
      </span>
    </div>
  );
};
