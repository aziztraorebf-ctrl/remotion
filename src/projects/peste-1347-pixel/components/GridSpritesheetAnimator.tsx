import React from "react";
import { useCurrentFrame, staticFile } from "remotion";

interface GridSpritesheetAnimatorProps {
  src: string;
  cols: number;
  rows: number;
  frameWidth: number;
  frameHeight: number;
  displayWidth: number;
  displayHeight: number;
  startRow?: number;
  frameCount?: number;
  frameRate?: number;
  loop?: boolean;
  flipX?: boolean;
  startFrame?: number;
  style?: React.CSSProperties;
}

export const GridSpritesheetAnimator: React.FC<
  GridSpritesheetAnimatorProps
> = ({
  src,
  cols,
  rows,
  frameWidth,
  frameHeight,
  displayWidth,
  displayHeight,
  startRow = 0,
  frameCount,
  frameRate = 6,
  loop = true,
  flipX = false,
  startFrame = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);

  const totalFrames = frameCount ?? cols;
  const scale = displayWidth / frameWidth;

  const spriteIndex = loop
    ? Math.floor(elapsed / frameRate) % totalFrames
    : Math.min(Math.floor(elapsed / frameRate), totalFrames - 1);

  const col = spriteIndex % cols;
  const row = startRow + Math.floor(spriteIndex / cols);

  const bgX = -(col * frameWidth * scale);
  const bgY = -(row * frameHeight * scale);

  if (elapsed <= 0 && startFrame > 0) return null;

  return (
    <div
      style={{
        width: displayWidth,
        height: displayHeight,
        overflow: "hidden",
        imageRendering: "pixelated" as const,
        transform: flipX ? "scaleX(-1)" : undefined,
        backgroundImage: `url(${staticFile(src)})`,
        backgroundPosition: `${bgX}px ${bgY}px`,
        backgroundSize: `${cols * frameWidth * scale}px ${rows * frameHeight * scale}px`,
        backgroundRepeat: "no-repeat",
        ...style,
      }}
    />
  );
};
