import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { StickFigure } from "../../../characters/StickFigure";
import { OutdoorBackground } from "../../../components/OutdoorBackground";
import { Sun } from "../../../components/Sun";
import { Expression } from "../../../characters/StickFigure/types";

export const CharacterTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalCycle = fps * 4;
  const cycleFrame = frame % totalCycle;
  const section = Math.floor((cycleFrame / totalCycle) * 4);

  let expression: Expression = "neutral";
  let headTilt = 0;
  let leftArmRotation = 0;
  let rightArmRotation = 0;

  if (section === 0) {
    expression = "neutral";
    const breathe = interpolate(
      cycleFrame % fps,
      [0, fps / 2, fps],
      [0, -2, 0]
    );
    leftArmRotation = breathe;
    rightArmRotation = -breathe;
  } else if (section === 1) {
    expression = "happy";
    headTilt = 5;
    rightArmRotation = interpolate(
      cycleFrame - totalCycle / 4,
      [0, fps * 0.3],
      [0, -60],
      { extrapolateRight: "clamp" }
    );
  } else if (section === 2) {
    expression = "surprised";
    headTilt = -10;
  } else {
    expression = "excited";
    headTilt = 5;
    leftArmRotation = -40;
    rightArmRotation = -40;
  }

  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
      <OutdoorBackground />
      <Sun />
      <StickFigure
        x={960}
        y={500}
        scale={1.5}
        expression={expression}
        headTilt={headTilt}
        leftArmRotation={leftArmRotation}
        rightArmRotation={rightArmRotation}
      />
    </svg>
  );
};
