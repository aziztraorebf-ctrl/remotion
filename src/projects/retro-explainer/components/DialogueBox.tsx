import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { RETRO_COLORS, RETRO_FONTS, TIMING } from "../config/theme";
import { loadFont } from "@remotion/google-fonts/PressStart2P";

const { fontFamily } = loadFont();

interface DialogueBoxProps {
  text: string;
  speakerName?: string;
  startFrame?: number;
  accentColor?: string;
  position?: "bottom" | "center";
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  text,
  speakerName,
  startFrame = 0,
  accentColor = RETRO_COLORS.uiGreen,
  position = "bottom",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  // Box open animation
  const openProgress = spring({
    frame: relativeFrame,
    fps,
    config: { damping: 18, mass: 0.6 },
  });

  // Typewriter effect
  const charsToShow = Math.floor(relativeFrame / TIMING.typewriterSpeed);
  const displayText = text.slice(0, charsToShow);
  const isTyping = charsToShow < text.length;

  // Blinking cursor
  const cursorVisible = isTyping || Math.floor(relativeFrame / 15) % 2 === 0;

  const positionStyle =
    position === "bottom"
      ? { bottom: 40, left: 60, right: 60 }
      : {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70%",
        };

  return (
    <div
      style={{
        position: "absolute",
        ...positionStyle,
        zIndex: 20,
        opacity: openProgress,
        transform:
          position === "bottom"
            ? `scaleY(${interpolate(openProgress, [0, 1], [0.3, 1])})`
            : undefined,
        transformOrigin: "bottom center",
      }}
    >
      {/* Speaker name tag */}
      {speakerName && (
        <div
          style={{
            position: "absolute",
            top: -18,
            left: 20,
            backgroundColor: accentColor,
            color: RETRO_COLORS.bgDark,
            fontFamily,
            fontSize: 10,
            padding: "4px 12px",
            zIndex: 1,
          }}
        >
          {speakerName}
        </div>
      )}

      {/* Main dialogue box */}
      <div
        style={{
          backgroundColor: "rgba(15, 14, 23, 0.95)",
          border: `3px solid ${accentColor}`,
          borderRadius: 0,
          padding: "24px 28px",
          minHeight: 80,
          imageRendering: "pixelated",
          boxShadow: `0 0 15px ${accentColor}40, inset 0 0 30px rgba(0,0,0,0.5)`,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 16,
            color: RETRO_COLORS.textPrimary,
            lineHeight: 2,
            letterSpacing: 1,
          }}
        >
          {displayText}
          {cursorVisible && (
            <span style={{ color: accentColor, marginLeft: 2 }}>_</span>
          )}
        </div>
      </div>

      {/* Corner decorations */}
      {[
        { top: -2, left: -2 },
        { top: -2, right: -2 },
        { bottom: -2, left: -2 },
        { bottom: -2, right: -2 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos,
            width: 8,
            height: 8,
            backgroundColor: accentColor,
          }}
        />
      ))}
    </div>
  );
};
