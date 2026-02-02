import { spring, interpolate } from "remotion";
import { AnimationFunction } from "./types";

export const reaction: AnimationFunction = (frame, fps) => {
  const tiltProgress = spring({
    frame,
    fps,
    config: { mass: 0.6, damping: 10, stiffness: 120 },
  });

  const headTilt = interpolate(tiltProgress, [0, 1], [0, 15]);

  const surpriseFrame = Math.round(fps * 0.5);
  const isSurprised = frame >= surpriseFrame;

  const bodyLean = interpolate(tiltProgress, [0, 1], [0, -2]);

  return {
    leftArmRotation: 0,
    rightArmRotation: 0,
    leftLegRotation: 0,
    rightLegRotation: 0,
    headTilt,
    bodyY: bodyLean,
    bodyX: 0,
    expression: isSurprised ? "surprised" : "neutral",
  };
};
