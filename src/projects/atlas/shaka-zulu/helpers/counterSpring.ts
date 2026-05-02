// Counter avec spring lourd (Kimi Q4) — "4 000" sur S4
// Combine compteur (0 -> target) avec spring scale pour effet "poids physique"

import { interpolate, spring } from "remotion";

export interface CounterSpringConfig {
  frame: number;
  startFrame: number;
  target: number;
  counterDurationFrames: number;
  fps: number;
  // Spring config (defaut Kimi Q4 : mass 3, damping 15)
  mass?: number;
  damping?: number;
  stiffness?: number;
}

export function counterSpring(config: CounterSpringConfig): {
  value: number;
  scale: number;
  formattedValue: string;
} {
  const {
    frame,
    startFrame,
    target,
    counterDurationFrames,
    fps,
    mass = 3,
    damping = 15,
    stiffness = 100,
  } = config;

  // Compteur 0 -> target
  const value = Math.floor(
    interpolate(
      frame,
      [startFrame, startFrame + counterDurationFrames],
      [0, target],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    )
  );

  // Spring scale : mass 3 + damping 15 = poids lourd, retombe doucement
  const scale = spring({
    frame: frame - startFrame,
    fps,
    config: { mass, damping, stiffness },
    from: 0.5,
    to: 1,
  });

  // Format avec espace comme separateur milliers
  const formattedValue = value.toLocaleString("fr-FR").replace(/ /g, " ");

  return { value, scale, formattedValue };
}
