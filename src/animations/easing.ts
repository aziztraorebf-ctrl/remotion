import { Easing } from "remotion";

export const EASING = {
  easeIn: Easing.bezier(0.42, 0, 1, 1),
  easeOut: Easing.bezier(0, 0, 0.58, 1),
  easeInOut: Easing.bezier(0.42, 0, 0.58, 1),
  bouncy: Easing.bezier(0.68, -0.55, 0.265, 1.55),
  linear: Easing.linear,
};
