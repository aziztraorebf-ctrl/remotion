import React from "react";
import { useCurrentFrame } from "remotion";
import { FONTS, COLORS } from "../config/theme";

interface PixelTypewriterProps {
  text: string;
  startFrame: number;
  charsPerFrame?: number;
  font?: "title" | "body";
  color?: string;
  fontSize?: number;
  variant?: "narrative" | "terminal";
  style?: React.CSSProperties;
}

export const PixelTypewriter: React.FC<PixelTypewriterProps> = ({
  text,
  startFrame,
  charsPerFrame = 0.8,
  font = "body",
  color,
  fontSize = 28,
  variant = "narrative",
  style,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const visibleChars = Math.floor(elapsed * charsPerFrame);
  const displayText = text.slice(0, visibleChars);
  const isTyping = visibleChars < text.length && visibleChars > 0;

  const isTerminal = variant === "terminal";
  const textColor = color ?? (isTerminal ? COLORS.terminalGreen : COLORS.textPrimary);
  const cursorColor = isTerminal ? COLORS.terminalGreen : COLORS.gold;

  // Blinking block cursor (15-frame cycle)
  const cursorVisible = isTyping && Math.floor(frame / 15) % 2 === 0;

  if (elapsed <= 0) return null;

  return (
    <div
      style={{
        fontFamily: font === "title" ? FONTS.title : FONTS.body,
        fontSize,
        color: textColor,
        lineHeight: 1.4,
        letterSpacing: font === "title" ? 2 : 0,
        textShadow: isTerminal ? "0 0 8px rgba(0,255,65,0.3)" : undefined,
        ...style,
      }}
    >
      {displayText}
      {cursorVisible && (
        <span style={{ color: cursorColor }}>_</span>
      )}
    </div>
  );
};
