import React, { useMemo } from "react";
import { useCurrentFrame, staticFile, Img } from "remotion";

interface PixelLabSpriteProps {
  // Path to character folder relative to public/ (e.g. "assets/peste-pixel/pixellab/characters/peasant-man")
  basePath: string;
  // Animation name (e.g. "walking", "idle") or null for static rotation
  animation?: string;
  // Direction (e.g. "south", "east", "north", "west")
  direction?: string;
  // Number of frames in the animation
  frameCount?: number;
  // Frames per sprite frame (lower = faster animation)
  frameRate?: number;
  // Display size on screen (upscaled from 64px native)
  displaySize?: number;
  // Loop animation
  loop?: boolean;
  // Flip horizontally
  flipX?: boolean;
  // Delay before animation starts (in Remotion frames)
  startFrame?: number;
  // Additional CSS
  style?: React.CSSProperties;
}

export const PixelLabSprite: React.FC<PixelLabSpriteProps> = ({
  basePath,
  animation,
  direction = "south",
  frameCount = 6,
  frameRate = 5,
  displaySize = 256,
  loop = true,
  flipX = false,
  startFrame = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);

  const currentSpriteFrame = useMemo(() => {
    if (!animation) return -1;
    const idx = Math.floor(elapsed / frameRate);
    return loop ? idx % frameCount : Math.min(idx, frameCount - 1);
  }, [animation, elapsed, frameRate, frameCount, loop]);

  const imageSrc = useMemo(() => {
    if (!animation || currentSpriteFrame < 0) {
      return staticFile(`${basePath}/rotations/${direction}.png`);
    }
    const paddedFrame = String(currentSpriteFrame).padStart(3, "0");
    return staticFile(
      `${basePath}/animations/${animation}/${direction}/frame_${paddedFrame}.png`
    );
  }, [basePath, animation, direction, currentSpriteFrame]);

  if (elapsed < 0 && startFrame > 0) return null;

  return (
    <Img
      src={imageSrc}
      style={{
        width: displaySize,
        height: displaySize,
        imageRendering: "pixelated",
        transform: flipX ? "scaleX(-1)" : undefined,
        objectFit: "contain",
        ...style,
      }}
    />
  );
};
