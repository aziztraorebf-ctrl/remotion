import React from "react";
import { useCurrentFrame, staticFile, Img } from "remotion";

interface AnimatedFireProps {
  x: number;
  y: number;
  startFrame: number;
  size?: "small" | "medium" | "large";
  variant?: number;
}

const SIZE_SCALES: Record<string, number> = {
  small: 2,
  medium: 3,
  large: 4,
};

// 8 individual frames per fire variant
const FRAME_COUNT = 8;

export const AnimatedFire: React.FC<AnimatedFireProps> = ({
  x,
  y,
  startFrame,
  size = "medium",
  variant = 1,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);

  if (elapsed <= 0) return null;

  const scale = SIZE_SCALES[size];
  // Frame size from assets: 32x48 px
  const displayW = 32 * scale;
  const displayH = 48 * scale;

  // Cycle through 8 frames at ~6fps sprite rate
  const frameRate = 5;
  const spriteIndex = (Math.floor(elapsed / frameRate) % FRAME_COUNT) + 1;

  const basePath = `assets/peste-pixel/fire/red/Group 4 - ${variant}`;
  const framePath = `${basePath}/Group 4 - ${variant}_${spriteIndex}.png`;

  return (
    <div
      style={{
        position: "absolute",
        left: x - displayW / 2,
        top: y - displayH,
        width: displayW,
        height: displayH,
        zIndex: 15,
      }}
    >
      <Img
        src={staticFile(framePath)}
        style={{
          width: displayW,
          height: displayH,
          imageRendering: "pixelated",
          objectFit: "contain",
        }}
      />
    </div>
  );
};
