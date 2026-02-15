import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../config/theme";

interface GlitchTransitionProps {
  startFrame: number;
  durationFrames?: number;
  intensity?: number;
}

export const GlitchTransition: React.FC<GlitchTransitionProps> = ({
  startFrame,
  durationFrames = 3,
  intensity = 12,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const active = frame >= startFrame && frame < startFrame + durationFrames;
  if (!active) return null;

  const localFrame = frame - startFrame;
  const offsets = [
    { x: -intensity, y: 0, color: "rgba(230, 57, 70, 0.6)" },
    { x: intensity, y: 0, color: "rgba(0, 102, 255, 0.6)" },
    { x: 0, y: intensity * 0.5, color: "rgba(255, 214, 0, 0.4)" },
  ];

  const sliceCount = 6 + localFrame * 2;
  const sliceH = height / sliceCount;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 100,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* RGB shift layers */}
      {offsets.map((offset, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: offset.color,
            transform: `translate(${offset.x * (localFrame + 1) * 0.3}px, ${offset.y * (localFrame + 1) * 0.3}px)`,
            mixBlendMode: "screen",
          }}
        />
      ))}
      {/* Horizontal slice displacement */}
      {Array.from({ length: sliceCount }).map((_, i) => {
        const shouldDisplace = (i + localFrame) % 3 === 0;
        if (!shouldDisplace) return null;
        const displaceX =
          ((i * 7 + localFrame * 13) % (intensity * 2)) - intensity;
        return (
          <div
            key={`s-${i}`}
            style={{
              position: "absolute",
              top: i * sliceH,
              left: 0,
              width: "100%",
              height: sliceH,
              backgroundColor: COLORS.black,
              transform: `translateX(${displaceX}px)`,
              opacity: 0.3,
            }}
          />
        );
      })}
    </div>
  );
};
