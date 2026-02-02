import { interpolate } from "remotion";
import { AnimationFunction } from "./types";

export const walking: AnimationFunction = (frame, fps, options = {}) => {
  const speed = options.speed ?? 1;
  const pixelsPerFrame = options.pixelsPerFrame ?? 4;

  const cycleLength = Math.round((fps * 0.5) / speed);
  const cycleFrame = frame % cycleLength;

  const legSwing = interpolate(
    cycleFrame,
    [0, cycleLength / 4, cycleLength / 2, (3 * cycleLength) / 4, cycleLength],
    [20, 0, -20, 0, 20]
  );

  const armSwing = interpolate(
    cycleFrame,
    [0, cycleLength / 4, cycleLength / 2, (3 * cycleLength) / 4, cycleLength],
    [-15, 0, 15, 0, -15]
  );

  const bounce = interpolate(
    cycleFrame,
    [0, cycleLength / 4, cycleLength / 2, (3 * cycleLength) / 4, cycleLength],
    [0, -4, 0, -4, 0]
  );

  return {
    leftArmRotation: armSwing,
    rightArmRotation: -armSwing,
    leftLegRotation: legSwing,
    rightLegRotation: -legSwing,
    headTilt: 0,
    bodyY: bounce,
    bodyX: frame * pixelsPerFrame * speed,
    expression: "happy",
  };
};
