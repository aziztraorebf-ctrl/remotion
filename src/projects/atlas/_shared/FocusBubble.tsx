import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

type FocusBubbleProps = {
  active: boolean;
  startFrame: number;
  endFrame: number;
  zoomTarget?: number;
  blurMax?: number;
  origin?: { x: number; y: number };
  children: React.ReactNode;
  background: React.ReactNode;
};

export const FocusBubble: React.FC<FocusBubbleProps> = ({
  startFrame,
  endFrame,
  zoomTarget = 1.18,
  blurMax = 4,
  origin = { x: 540, y: 960 },
  children,
  background,
}) => {
  const frame = useCurrentFrame();

  const ramp = 12;
  const phase = (() => {
    if (frame < startFrame) return 0;
    if (frame < startFrame + ramp) {
      return interpolate(frame, [startFrame, startFrame + ramp], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
    if (frame < endFrame - ramp) return 1;
    if (frame < endFrame) {
      return interpolate(frame, [endFrame - ramp, endFrame], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
    return 0;
  })();

  const zoom = 1 + (zoomTarget - 1) * phase;
  const blur = blurMax * phase;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          filter: `blur(${blur}px)`,
          transform: `scale(${zoom})`,
          transformOrigin: `${origin.x}px ${origin.y}px`,
        }}
      >
        {background}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: `${origin.x}px ${origin.y}px`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
