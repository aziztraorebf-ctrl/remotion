// Camera shake — REUSABLE TEMPLATE
// Multi-frequency sin oscillation simulating a handheld camera jolt.
// Usage in a scene component:
//
//   import { useCurrentFrame, interpolate } from "remotion";
//   import { cameraShake, shakeEnvelope } from "./cameraShake";
//
//   const frame = useCurrentFrame();
//   const env = shakeEnvelope(frame, { start: 155, peak: 165, end: 215 });
//   const { x, y } = cameraShake(frame, 12 * env);
//   return <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px)` }}>...</AbsoluteFill>;
//
// PRESETS (amplitude in pixels):
//   8  = light tap / footstep
//   12 = baobab uprooting / heavy fall
//   18 = explosion / cannon
//   24 = earthquake (use sparingly — hard to watch)

import { interpolate } from "remotion";

export function cameraShake(frame: number, amplitude: number): { x: number; y: number } {
  const x =
    Math.sin(frame * 1.7) * amplitude +
    Math.sin(frame * 3.1) * amplitude * 0.4;
  const y =
    Math.sin(frame * 2.3) * amplitude * 0.7 +
    Math.sin(frame * 4.7) * amplitude * 0.3;
  return { x, y };
}

// Smooth envelope: ramp up over (start -> peak), hold, ramp down before end
export function shakeEnvelope(
  frame: number,
  config: { start: number; peak: number; end: number; rampDownFrames?: number }
): number {
  const { start, peak, end, rampDownFrames = 10 } = config;
  return interpolate(
    frame,
    [start, peak, end - rampDownFrames, end],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
}
