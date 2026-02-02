import { interpolate } from "remotion";
import { AnimationFunction } from "./types";

export const idle: AnimationFunction = (frame, fps) => {
  const cycleLength = fps * 2;
  const cycleFrame = frame % cycleLength;

  const bodyY = interpolate(
    cycleFrame,
    [0, cycleLength / 2, cycleLength],
    [0, -3, 0]
  );

  const armSway = interpolate(
    cycleFrame,
    [0, cycleLength / 2, cycleLength],
    [-2, 2, -2]
  );

  return {
    leftArmRotation: armSway,
    rightArmRotation: -armSway,
    leftLegRotation: 0,
    rightLegRotation: 0,
    headTilt: 0,
    bodyY,
    bodyX: 0,
    expression: "neutral",
  };
};
