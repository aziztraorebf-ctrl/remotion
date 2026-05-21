import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../config/theme";

interface HookTextOverlayProps {
  text: string;
  mode: "stamp" | "strikethrough" | "typewriter";
  localFrame: number; // frame relative to this overlay's appearance
  color?: string;
  fontSize?: number;
  position?: "center" | "bottom-center";
}

export const HookTextOverlay: React.FC<HookTextOverlayProps> = ({
  text,
  mode,
  localFrame,
  color = COLORS.textPrimary,
  fontSize = 48,
  position = "center",
}) => {
  const { fps } = useVideoConfig();

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    ...(position === "center"
      ? { top: "50%", transform: "translateY(-50%)" }
      : { bottom: 120 }),
    pointerEvents: "none",
  };

  if (mode === "stamp") {
    return <StampText text={text} localFrame={localFrame} color={color} fontSize={fontSize} fps={fps} style={containerStyle} />;
  }

  if (mode === "strikethrough") {
    return <StrikethroughText text={text} localFrame={localFrame} color={color} fontSize={fontSize} fps={fps} style={containerStyle} />;
  }

  return <TypewriterText text={text} localFrame={localFrame} color={color} fontSize={fontSize} style={containerStyle} />;
};

// Stamp: word appears with spring scale + shake
const StampText: React.FC<{
  text: string;
  localFrame: number;
  color: string;
  fontSize: number;
  fps: number;
  style: React.CSSProperties;
}> = ({ text, localFrame, color, fontSize, fps, style }) => {
  const scale = spring({
    frame: localFrame,
    fps,
    config: { mass: 2, damping: 12, stiffness: 200 },
  });

  const opacity = interpolate(localFrame, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Brief shake on impact (frames 2-8)
  const shakeX =
    localFrame >= 2 && localFrame <= 8
      ? Math.sin(localFrame * 12) * (8 - localFrame)
      : 0;
  const shakeY =
    localFrame >= 2 && localFrame <= 8
      ? Math.cos(localFrame * 9) * (8 - localFrame) * 0.5
      : 0;

  return (
    <div style={style}>
      <div
        style={{
          fontFamily: FONTS.title,
          fontSize,
          color,
          opacity,
          transform: `scale(${scale}) translate(${shakeX}px, ${shakeY}px)`,
          textShadow: `0 0 40px ${color}, 0 4px 8px rgba(0,0,0,0.8), 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000`,
          letterSpacing: "0.1em",
          WebkitTextStroke: "2px rgba(0,0,0,0.7)",
          paintOrder: "stroke fill" as const,
        }}
      >
        {text}
      </div>
    </div>
  );
};

// Strikethrough: text appears then red line crosses through it
const StrikethroughText: React.FC<{
  text: string;
  localFrame: number;
  color: string;
  fontSize: number;
  fps: number;
  style: React.CSSProperties;
}> = ({ text, localFrame, color, fontSize, fps, style }) => {
  // Text fades in first
  const textOpacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Strikethrough line starts after text is visible
  const lineProgress = spring({
    frame: Math.max(0, localFrame - 15),
    fps,
    config: { mass: 0.5, damping: 14, stiffness: 300 },
  });

  return (
    <div style={style}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <div
          style={{
            fontFamily: FONTS.title,
            fontSize,
            color,
            opacity: textOpacity,
            letterSpacing: "0.1em",
          }}
        >
          {text}
        </div>
        {/* Red strikethrough line */}
        {lineProgress > 0 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "-3%",
              width: `${lineProgress * 106}%`,
              height: Math.max(4, fontSize * 0.08),
              backgroundColor: COLORS.plagueRed,
              transform: "translateY(-50%) rotate(-2deg)",
              boxShadow: `0 0 12px ${COLORS.plagueRed}`,
            }}
          />
        )}
      </div>
    </div>
  );
};

// Typewriter: text appears character by character with blinking cursor
const TypewriterText: React.FC<{
  text: string;
  localFrame: number;
  color: string;
  fontSize: number;
  style: React.CSSProperties;
}> = ({ text, localFrame, color, fontSize, style }) => {
  const charsPerFrame = 0.6;
  const visibleChars = Math.min(
    text.length,
    Math.floor(localFrame * charsPerFrame),
  );
  const displayText = text.slice(0, visibleChars);
  const isComplete = visibleChars >= text.length;

  // Blinking cursor (15-frame cycle)
  const cursorVisible = !isComplete || localFrame % 30 < 15;

  return (
    <div style={style}>
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize,
          color,
          letterSpacing: "0.05em",
          textShadow: "0 2px 8px rgba(0,0,0,0.9), 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
          WebkitTextStroke: "1px rgba(0,0,0,0.6)",
          paintOrder: "stroke fill" as const,
        }}
      >
        {displayText}
        <span
          style={{
            opacity: cursorVisible ? 1 : 0,
            color,
            marginLeft: 2,
          }}
        >
          _
        </span>
      </div>
    </div>
  );
};
