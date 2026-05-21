/**
 * Presets d'animation Remotion — source de verite unique.
 * Importer depuis ici, jamais reinventer dans les beats.
 *
 * Regles :
 * - startAt = frame absolue dans le beat (pas relative)
 * - Tous les presets clampent automatiquement
 * - Ne pas modifier les configs spring sans valider visuellement
 */

import { interpolate, spring } from "remotion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// --- Opacite ---

export const fadeIn = (frame: number, startAt: number, durationFrames = 20): number =>
  interpolate(frame, [startAt, startAt + durationFrames], [0, 1], CLAMP);

export const fadeOut = (frame: number, startAt: number, durationFrames = 20): number =>
  interpolate(frame, [startAt, startAt + durationFrames], [1, 0], CLAMP);

export const fadeInOut = (
  frame: number,
  inStart: number,
  outStart: number,
  durationFrames = 20
): number => {
  const inVal = interpolate(frame, [inStart, inStart + durationFrames], [0, 1], CLAMP);
  const outVal = interpolate(frame, [outStart, outStart + durationFrames], [1, 0], CLAMP);
  return Math.min(inVal, outVal);
};

// --- Mouvement vertical (slide) ---

export const slideUp = (
  frame: number,
  startAt: number,
  fps: number,
  distancePx = 60
): string => {
  const s = spring({ frame: frame - startAt, fps, config: { stiffness: 80, damping: 22 } });
  return `translateY(${(1 - s) * distancePx}px)`;
};

export const slideDown = (
  frame: number,
  startAt: number,
  fps: number,
  distancePx = 60
): string => {
  const s = spring({ frame: frame - startAt, fps, config: { stiffness: 80, damping: 22 } });
  return `translateY(${(s - 1) * distancePx}px)`;
};

// --- Echelle (pop/zoom) ---

export const popIn = (
  frame: number,
  startAt: number,
  fps: number
): number =>
  spring({ frame: frame - startAt, fps, config: { stiffness: 200, damping: 14 } });

export const gentleReveal = (
  frame: number,
  startAt: number,
  fps: number
): number =>
  spring({ frame: frame - startAt, fps, config: { stiffness: 60, damping: 20 } });

// --- SVG path drawing ---

export const drawPath = (
  frame: number,
  startAt: number,
  durationFrames: number,
  pathLength: number
): number => {
  const progress = interpolate(frame, [startAt, startAt + durationFrames], [0, 1], CLAMP);
  return pathLength * (1 - progress);
};

// --- Compteur numerique ---

export const countUp = (
  frame: number,
  startAt: number,
  durationFrames: number,
  targetValue: number,
  decimals = 0
): string => {
  const val = interpolate(frame, [startAt, startAt + durationFrames], [0, targetValue], CLAMP);
  return val.toFixed(decimals);
};

// --- Combinaisons courantes (opacity + transform) ---

/**
 * Retourne { opacity, transform } pour un element qui arrive par le bas.
 * Usage : <div style={appearFromBelow(frame, 30, fps)} />
 */
export const appearFromBelow = (
  frame: number,
  startAt: number,
  fps: number,
  distancePx = 40
): React.CSSProperties => ({
  opacity: fadeIn(frame, startAt, 15),
  transform: slideUp(frame, startAt, fps, distancePx),
});

import type React from "react";
