import React from "react";
import { useCurrentFrame, staticFile, Img } from "remotion";

interface SpriteAnimatorProps {
  // Array of image paths relative to public/ (individual frames)
  frames: string[];
  // Frames per sprite frame (e.g., 4 = each sprite shows for 4 video frames)
  frameRate?: number;
  // Display size
  width: number;
  height: number;
  // Loop the animation
  loop?: boolean;
  // Flip horizontally
  flipX?: boolean;
  // Additional style
  style?: React.CSSProperties;
}

// Animates a sequence of individual PNG frames
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
  // Path to the spritesheet image relative to public/
  src: string;
  // Number of frames in the spritesheet (horizontal strip)
  frameCount: number;
  // Width/height of a single frame in the spritesheet
  frameWidth: number;
  frameHeight: number;
  // Display size
  displayWidth: number;
  displayHeight: number;
  // Frames per sprite frame
  frameRate?: number;
  loop?: boolean;
  flipX?: boolean;
  style?: React.CSSProperties;
}

// Animates a horizontal spritesheet (single row of frames)
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
