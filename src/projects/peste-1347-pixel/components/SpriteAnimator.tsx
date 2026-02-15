import React from "react";
import { useCurrentFrame, staticFile, Img } from "remotion";

interface SpriteAnimatorProps {
  frames: string[];
  frameRate?: number;
  width: number;
  height: number;
  loop?: boolean;
  flipX?: boolean;
  style?: React.CSSProperties;
}

export const SpriteAnimator: React.FC<SpriteAnimatorProps> = ({
  frames,
  frameRate = 4,
  width,
  height,
  loop = true,
  flipX = false,
  style,
}) => {
  const frame = useCurrentFrame();

  if (frames.length === 0) return null;

  const spriteIndex = loop
    ? Math.floor(frame / frameRate) % frames.length
    : Math.min(Math.floor(frame / frameRate), frames.length - 1);

  return (
    <Img
      src={staticFile(frames[spriteIndex])}
      style={{
        width,
        height,
        imageRendering: "pixelated",
        transform: flipX ? "scaleX(-1)" : undefined,
        objectFit: "contain",
        ...style,
      }}
    />
  );
};

interface SpritesheetAnimatorProps {
  src: string;
  frameCount: number;
  frameWidth: number;
  frameHeight: number;
  displayWidth: number;
  displayHeight: number;
  frameRate?: number;
  loop?: boolean;
  flipX?: boolean;
  style?: React.CSSProperties;
}

export const SpritesheetAnimator: React.FC<SpritesheetAnimatorProps> = ({
  src,
  frameCount,
  frameWidth,
  frameHeight,
  displayWidth,
  displayHeight,
  frameRate = 4,
  loop = true,
  flipX = false,
  style,
}) => {
  const frame = useCurrentFrame();

  const spriteIndex = loop
    ? Math.floor(frame / frameRate) % frameCount
    : Math.min(Math.floor(frame / frameRate), frameCount - 1);

  const scale = displayWidth / frameWidth;

  return (
    <div
      style={{
        width: displayWidth,
        height: displayHeight,
        overflow: "hidden",
        imageRendering: "pixelated",
        transform: flipX ? "scaleX(-1)" : undefined,
        ...style,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: frameWidth * frameCount * scale,
          height: frameHeight * scale,
          marginLeft: -spriteIndex * displayWidth,
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
};
