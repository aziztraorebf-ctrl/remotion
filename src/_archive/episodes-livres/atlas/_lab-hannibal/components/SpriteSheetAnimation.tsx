import React from "react";
import { Img, staticFile, useCurrentFrame, interpolate } from "remotion";

type SpriteSheetAnimationProps = {
  src: string;
  frameWidth: number;
  frameHeight: number;
  totalFrames: number;
  startFrame: number;
  durationFrames: number;
  position: { x: number; y: number };
  displaySize: { width: number; height: number };
  loop?: boolean;
  filter?: string;
  imageRendering?: "pixelated" | "auto";
  layout?: "horizontal" | "vertical";
};

export const SpriteSheetAnimation: React.FC<SpriteSheetAnimationProps> = ({
  src,
  frameWidth,
  frameHeight,
  totalFrames,
  startFrame,
  durationFrames,
  position,
  displaySize,
  loop = false,
  filter,
  imageRendering = "pixelated",
  layout = "horizontal",
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  if (localFrame < 0) return null;

  const progress = interpolate(
    localFrame,
    [0, durationFrames],
    [0, totalFrames],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: loop ? "extend" : "clamp",
    }
  );

  const spriteIndex = loop
    ? Math.floor(progress) % totalFrames
    : Math.min(Math.floor(progress), totalFrames - 1);

  const scaleX = displaySize.width / frameWidth;
  const scaleY = displaySize.height / frameHeight;

  const offsetX = layout === "horizontal" ? -spriteIndex * frameWidth : 0;
  const offsetY = layout === "vertical" ? -spriteIndex * frameHeight : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: position.x - displaySize.width / 2,
        top: position.y - displaySize.height / 2,
        width: displaySize.width,
        height: displaySize.height,
        overflow: "hidden",
        filter,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          left: offsetX * scaleX,
          top: offsetY * scaleY,
          width:
            layout === "horizontal"
              ? frameWidth * totalFrames * scaleX
              : frameWidth * scaleX,
          height:
            layout === "vertical"
              ? frameHeight * totalFrames * scaleY
              : frameHeight * scaleY,
          imageRendering,
        }}
      />
    </div>
  );
};
