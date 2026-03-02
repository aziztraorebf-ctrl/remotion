import React from "react";
import { interpolate } from "remotion";

export const W = 1920;
export const H = 1080;
export const GROUND_Y = 840;
export const FPS = 30;

// Fade-in helper
export function enter(
  frame: number,
  start: number,
  dur: number,
  to = 1
): number {
  return interpolate(frame, [start, start + dur], [0, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// Fade-out helper
export function exit(
  frame: number,
  start: number,
  dur: number
): number {
  return interpolate(frame, [start, start + dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// Style title chrome shown at top of each scene
export const StyleTitle: React.FC<{
  frame: number;
  number: string;
  title: string;
  subtitle: string;
  textColor?: string;
  bgColor?: string;
}> = ({
  frame,
  number,
  title,
  subtitle,
  textColor = "#1a1008",
  bgColor = "rgba(255,255,240,0.82)",
}) => {
  const opacity = enter(frame, 0, 20);
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
        padding: "18px 0 14px",
        background: bgColor,
        borderBottom: `2px solid ${textColor}`,
        fontFamily: "Georgia, 'Times New Roman', serif",
        color: textColor,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontSize: 14,
          letterSpacing: 6,
          opacity: 0.55,
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        Style {number}
      </div>
      <div style={{ fontSize: 32, fontWeight: "bold", letterSpacing: 2 }}>
        {title}
      </div>
      <div style={{ fontSize: 16, opacity: 0.65, marginTop: 4, fontStyle: "italic" }}>
        {subtitle}
      </div>
    </div>
  );
};

// Small character label shown under a character
export const CharLabel: React.FC<{
  x: number;
  y: number;
  name: string;
  fill?: string;
}> = ({ x, y, name, fill = "#1a1008" }) => (
  <text
    x={x}
    y={y}
    textAnchor="middle"
    fontSize={18}
    fontFamily="Georgia, serif"
    fill={fill}
    opacity={0.55}
    fontStyle="italic"
  >
    {name}
  </text>
);
