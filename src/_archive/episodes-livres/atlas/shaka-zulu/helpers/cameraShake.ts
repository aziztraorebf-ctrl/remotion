// Camera shake — Atlas Shaka Zulu (copie depuis geoafrique-shorts, validee Sonjata V7)
// Multi-frequency sin oscillation simulating a handheld camera jolt.
//
// Usage : <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px)` }}>
//
// PRESETS amplitude (pixels):
//   8  = footstep / light tap
//   12 = heavy fall / baobab uprooting
//   18 = explosion / cannon (Gqokli flash 90% S2)
//   24 = earthquake (sparingly)

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
