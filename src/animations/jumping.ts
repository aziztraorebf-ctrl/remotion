import { spring, interpolate } from "remotion";
import { AnimationFunction } from "./types";

export const jumping: AnimationFunction = (frame, fps) => {
  const prepDuration = Math.round(fps * 0.25);
  const jumpHeight = 80;

  const jumpSpring = spring({
    frame: Math.max(0, frame - prepDuration),
    fps,
    config: { mass: 0.4, damping: 8, stiffness: 200 },
  });

  const prepSquash =
    frame < prepDuration
      ? interpolate(frame, [0, prepDuration], [0, 8])
      : 0;

  const jumpY =
    frame >= prepDuration
      ? interpolate(jumpSpring, [0, 0.5, 1], [0, -jumpHeight, 0])
      : prepSquash;

  const armAngle =
    frame >= prepDuration
      ? interpolate(jumpSpring, [0, 0.3, 1], [0, -140, 0])
      : interpolate(frame, [0, prepDuration], [0, 10]);

  const legSpread =
    frame >= prepDuration
      ? interpolate(jumpSpring, [0, 0.3, 0.7, 1], [0, 15, 15, 0])
      : interpolate(frame, [0, prepDuration], [0, 5]);

  const isAirborne = frame >= prepDuration && jumpSpring > 0.1 && jumpSpring < 0.9;

  return {
    leftArmRotation: armAngle,
    rightArmRotation: armAngle,
    leftLegRotation: legSpread,
    rightLegRotation: -legSpread,
    headTilt: 0,
    bodyY: jumpY,
    bodyX: 0,
    expression: isAirborne ? "excited" : "happy",
  };
};
