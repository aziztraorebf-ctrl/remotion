import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS, PIXEL_SIZE } from "../config/theme";
import {
  HOOK_END,
  SEG1_END,
  CROSSFADE_FRAMES,
} from "../config/timing";

interface PixelBackgroundProps {
  children: React.ReactNode;
}

export const PixelBackground: React.FC<PixelBackgroundProps> = ({
  children,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Background color transitions smoothly between segments
  const hookToSeg1 = interpolate(
    frame,
    [HOOK_END - CROSSFADE_FRAMES, HOOK_END + CROSSFADE_FRAMES],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const seg1ToSeg2 = interpolate(
    frame,
    [SEG1_END - CROSSFADE_FRAMES, SEG1_END + CROSSFADE_FRAMES],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Grain: shift SVG noise seed every 3 frames for film-like texture
  const grainSeed = Math.floor(frame / 3);

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
      }}
    >
      {/* Base color layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: COLORS.bgAct1,
          opacity: 1 - hookToSeg1,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: COLORS.bgAct2,
          opacity: hookToSeg1 * (1 - seg1ToSeg2),
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: COLORS.bgAct3,
          opacity: seg1ToSeg2,
        }}
      />

      {/* Pixel grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              ${COLORS.gridLine},
              ${COLORS.gridLine} 1px,
              transparent 1px,
              transparent ${PIXEL_SIZE}px
            ),
            repeating-linear-gradient(
              90deg,
              ${COLORS.gridLine},
              ${COLORS.gridLine} 1px,
              transparent 1px,
              transparent ${PIXEL_SIZE}px
            )
          `,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Grain noise */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 2,
          opacity: 0.06,
        }}
      >
        <filter id="pixelGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={3}
            seed={grainSeed}
            result="noise"
          />
          <feColorMatrix type="saturate" values="0" in="noise" />
        </filter>
        <rect width="100%" height="100%" filter="url(#pixelGrain)" />
      </svg>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, width, height }}>
        {children}
      </div>
    </div>
  );
};
