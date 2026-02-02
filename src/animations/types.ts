import { Expression } from "../characters/StickFigure/types";

export interface AnimationPose {
  leftArmRotation: number;
  rightArmRotation: number;
  leftLegRotation: number;
  rightLegRotation: number;
  headTilt: number;
  bodyY: number;
  bodyX: number;
  expression: Expression;
}

export type AnimationFunction = (
  frame: number,
  fps: number,
  options?: Record<string, number>
) => AnimationPose;

export const DEFAULT_POSE: AnimationPose = {
  leftArmRotation: 0,
  rightArmRotation: 0,
  leftLegRotation: 0,
  rightLegRotation: 0,
  headTilt: 0,
  bodyY: 0,
  bodyX: 0,
  expression: "neutral",
};
