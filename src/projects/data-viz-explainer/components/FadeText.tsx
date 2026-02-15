import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS } from "../config/theme";

interface FadeTextProps {
  text: string;
  startFrame: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  letterSpacing?: number;
  maxWidth?: number;
  lineHeight?: number;
  align?: "left" | "center" | "right";
  direction?: "up" | "down" | "left" | "right";
  fontFamily?: string;
  uppercase?: boolean;
  glowColor?: string;
}

export const FadeText: React.FC<FadeTextProps> = ({
  text,
  startFrame,
  fontSize = 24,
  color = COLORS.textPrimary,
  fontWeight = 600,
  letterSpacing = 0,
  maxWidth,
  lineHeight = 1.4,
  align = "center",
  direction = "up",
  fontFamily = "Inter",
  uppercase = false,
  glowColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 15, mass: 0.6 },
  });

  const offset = 30;
  const translateMap = {
    up: `translateY(${(1 - progress) * offset}px)`,
    down: `translateY(${(1 - progress) * -offset}px)`,
    left: `translateX(${(1 - progress) * offset}px)`,
    right: `translateX(${(1 - progress) * -offset}px)`,
  };

  return (
    <div
      style={{
        fontSize,
        color,
        fontWeight,
        fontFamily,
        letterSpacing,
        lineHeight,
        textAlign: align,
        maxWidth,
        opacity: progress,
        transform: translateMap[direction],
        textTransform: uppercase ? "uppercase" : undefined,
        textShadow: glowColor ? `0 0 20px ${glowColor}` : undefined,
      }}
    >
      {text}
    </div>
  );
};
