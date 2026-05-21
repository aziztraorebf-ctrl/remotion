import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

type DialogBubbleProps = {
  text: string;
  startFrame: number;
  durationFrames: number;
  pointTo: { x: number; y: number };
  maxWidth?: number;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  fontSize?: number;
  offsetY?: number;
};

export const DialogBubble: React.FC<DialogBubbleProps> = ({
  text,
  startFrame,
  durationFrames,
  pointTo,
  maxWidth = 320,
  bgColor = "rgba(20, 14, 8, 0.92)",
  borderColor = "#E6C76E",
  textColor = "#F5E9C9",
  fontSize = 24,
  offsetY = 110,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - startFrame;
  const fadeOutStart = durationFrames - 10;

  const reveal = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 180 },
  });

  const fadeOut = interpolate(
    localFrame,
    [fadeOutStart, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (localFrame < 0 || localFrame > durationFrames) return null;

  const opacity = reveal * fadeOut;
  const scale = 0.85 + 0.15 * reveal;

  // Bubble positioned ABOVE the sprite (règle Aziz Atlas — pas SUR le sprite)
  const bubbleX = pointTo.x;
  const bubbleY = pointTo.y - offsetY;

  return (
    <div
      style={{
        position: "absolute",
        left: bubbleX,
        top: bubbleY,
        transform: `translate(-50%, -100%) scale(${scale})`,
        transformOrigin: "center bottom",
        opacity,
        pointerEvents: "none",
      }}
    >
      {/* Bubble body */}
      <div
        style={{
          background: bgColor,
          border: `2px solid ${borderColor}`,
          borderRadius: 4,
          padding: "12px 18px",
          maxWidth,
          fontFamily: '"VCR OSD Mono", "Courier New", monospace',
          fontSize,
          color: textColor,
          textAlign: "center",
          letterSpacing: 0.5,
          lineHeight: 1.3,
          boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
      {/* Pointer arrow (pointing down to sprite) */}
      <svg
        width="20"
        height="14"
        viewBox="0 0 20 14"
        style={{
          position: "absolute",
          left: "50%",
          bottom: -12,
          transform: "translateX(-50%)",
        }}
      >
        <path
          d="M 0 0 L 10 14 L 20 0 Z"
          fill={bgColor}
          stroke={borderColor}
          strokeWidth="2"
          strokeLinejoin="miter"
        />
        {/* Mask to hide top edge of arrow blending into bubble */}
        <rect x="2" y="-2" width="16" height="2" fill={bgColor} />
      </svg>
    </div>
  );
};
