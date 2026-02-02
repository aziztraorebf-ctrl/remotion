import React from "react";
import { Head } from "./Head";
import { Torso } from "./Torso";
import { Arm } from "./Arm";
import { Leg } from "./Leg";
import { StickFigureProps } from "./types";
import {
  DIMENSIONS,
  DEFAULT_COLOR,
  DEFAULT_FILL,
  DEFAULT_STROKE_WIDTH,
} from "./constants";

export const StickFigure: React.FC<StickFigureProps> = ({
  x = 0,
  y = 0,
  scale = 1,
  color = DEFAULT_COLOR,
  fillColor = DEFAULT_FILL,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  leftArmRotation = 0,
  rightArmRotation = 0,
  leftLegRotation = 0,
  rightLegRotation = 0,
  headTilt = 0,
  expression = "neutral",
}) => {
  const d = DIMENSIONS;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <Leg
        startX={0}
        startY={d.hipY}
        length={d.legLength}
        color={color}
        strokeWidth={strokeWidth}
        rotation={leftLegRotation}
        side="left"
        footWidth={d.footWidth}
        footHeight={d.footHeight}
      />
      <Leg
        startX={0}
        startY={d.hipY}
        length={d.legLength}
        color={color}
        strokeWidth={strokeWidth}
        rotation={rightLegRotation}
        side="right"
        footWidth={d.footWidth}
        footHeight={d.footHeight}
      />

      <Torso
        topX={0}
        topY={d.shoulderY}
        length={d.torsoLength}
        color={color}
        strokeWidth={strokeWidth}
      />

      <Arm
        startX={0}
        startY={d.shoulderY}
        length={d.armLength}
        color={color}
        strokeWidth={strokeWidth}
        rotation={leftArmRotation}
        side="left"
        handRadius={d.handRadius}
      />
      <Arm
        startX={0}
        startY={d.shoulderY}
        length={d.armLength}
        color={color}
        strokeWidth={strokeWidth}
        rotation={rightArmRotation}
        side="right"
        handRadius={d.handRadius}
      />

      <Head
        cx={0}
        cy={d.headCenterY}
        radius={d.headRadius}
        color={color}
        fillColor={fillColor}
        strokeWidth={strokeWidth}
        tilt={headTilt}
        expression={expression}
      />
    </g>
  );
};
