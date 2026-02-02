export type Expression = "neutral" | "happy" | "surprised" | "excited";

export interface StickFigureProps {
  x?: number;
  y?: number;
  scale?: number;
  color?: string;
  fillColor?: string;
  strokeWidth?: number;

  leftArmRotation?: number;
  rightArmRotation?: number;
  leftLegRotation?: number;
  rightLegRotation?: number;
  headTilt?: number;

  expression?: Expression;
}

export interface StickFigureDimensions {
  headRadius: number;
  headCenterY: number;
  neckY: number;
  shoulderY: number;
  torsoLength: number;
  hipY: number;
  armLength: number;
  legLength: number;
  handRadius: number;
  footWidth: number;
  footHeight: number;
}
