import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../config/theme";

interface StampTextProps {
  text: string;
  startFrame: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  fontFamily?: string;
  letterSpacing?: number;
  uppercase?: boolean;
  offsetShadow?: boolean;
  shadowColor?: string;
  textAlign?: "left" | "center" | "right";
  strikethrough?: boolean;
}

export const StampText: React.FC<StampTextProps> = ({
  text,
  startFrame,
  fontSize = 48,
  color = COLORS.textPrimary,
  fontWeight = 700,
  fontFamily = FONTS.display,
  letterSpacing = 2,
  uppercase = true,
  offsetShadow = false,
  shadowColor = COLORS.black,
  textAlign = "center",
  strikethrough = false,
}) => {
  const frame = useCurrentFrame();
  const visible = frame >= startFrame;

  if (!visible) return null;

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        fontWeight,
        color,
        letterSpacing,
        textTransform: uppercase ? "uppercase" : "none",
        textShadow: offsetShadow
          ? `4px 4px 0px ${shadowColor}`
          : "none",
        textAlign,
        textDecoration: strikethrough ? "line-through" : "none",
        lineHeight: 1.1,
      }}
    >
      {text}
    </div>
  );
};
