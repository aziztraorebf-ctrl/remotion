import { spring, interpolate } from "remotion";
import { AnimationFunction } from "./types";

export const waving: AnimationFunction = (frame, fps) => {
  const armRaise = spring({
    frame,
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 100 },
  });

  const waveStart = Math.round(fps * 0.3);
  const waveFrame = Math.max(0, frame - waveStart);
  const waveCycle = Math.round(fps * 0.3);
  const waveCycleFrame = waveFrame % waveCycle;

  const waveAngle =
    frame >= waveStart
      ? interpolate(
          waveCycleFrame,
          [0, waveCycle / 2, waveCycle],
          [-15, 15, -15]
        )
      : 0;

  const rightArmAngle =
    interpolate(armRaise, [0, 1], [0, -120]) + waveAngle;

  return {
    leftArmRotation: 0,
    rightArmRotation: rightArmAngle,
    leftLegRotation: 0,
    rightLegRotation: 0,
    headTilt: interpolate(armRaise, [0, 1], [0, 5]),
    bodyY: 0,
    bodyX: 0,
    expression: "happy",
  };
};
