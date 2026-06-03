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

// =====================================================================
// HERO DATA presets (doctrine memory/doctrines/SOUVERAIN-REMOTION-PLAYBOOK.md)
// Extraits de Silicon Savannah + validés par l'analyse Gemini 3.1 Pro.
// Briques de base du catalogue "HERO DATA" — réutiliser, ne pas réinventer.
// =====================================================================

/**
 * P1 — Le Chiffre-Événement : bounce à overshoot sur la valeur finale.
 * Retourne un scale qui dépasse la cible (1 → overshoot → 1) pour donner du
 * "poids" physique au chiffre quand le count-up s'arrête.
 * Recette validée Silicon Savannah Beat4 (damping:6, stiffness:200).
 * Usage : transform: `scale(${heroBouncePop(frame, valueLandFrame, fps)})`
 */
export const heroBouncePop = (
  frame: number,
  startAt: number,
  fps: number,
  overshoot = 1.06
): number => {
  const s = spring({ frame: frame - startAt, fps, config: { damping: 6, stiffness: 200 }, durationInFrames: 20 });
  return interpolate(s, [0, 1], [1, overshoot]);
};

/**
 * P3 — Reveal organique : opacity + micro translate-y avec spring.
 * Remplace le fondu plat (opacity seule) par une apparition vivante.
 * Diagnostic Gemini : "intégrer des micro-mouvements (translate-y 10px spring)
 * lors du reveal pour que l'apparition semble organique et non mécanique".
 * Usage : <div style={appearOrganic(frame, 30, fps)} />
 */
export const appearOrganic = (
  frame: number,
  startAt: number,
  fps: number,
  distancePx = 12
): React.CSSProperties => {
  const s = spring({ frame: frame - startAt, fps, config: { damping: 18, stiffness: 90 }, durationInFrames: 25 });
  return {
    opacity: interpolate(s, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(s, [0, 1], [distancePx, 0])}px)`,
  };
};

/**
 * P5 — Secondary motion : float sinusoïdal continu (drift vertical lent).
 * Maintient un objet vivant. periodFrames = durée d'un cycle complet.
 * Usage : transform: `translateY(${floatSin(frame, 6, 110)}px)`
 */
export const floatSin = (frame: number, amplitudePx = 6, periodFrames = 110): number =>
  Math.sin((frame / periodFrames) * Math.PI * 2) * amplitudePx;

/**
 * P5 — Secondary motion : glow oscillant (rayon de halo qui respire).
 * Retourne un rayon px à interpoler dans un box-shadow / drop-shadow.
 * Usage : boxShadow: `0 0 ${glowOscillate(frame, 20, 80)}px ...`
 */
export const glowOscillate = (frame: number, minPx = 20, maxPx = 80, speed = 9): number =>
  interpolate(Math.sin(frame / speed), [-1, 1], [minPx, maxPx]);

/**
 * P5 — Secondary motion : ping-ring (anneau concentrique qui pulse vers l'extérieur).
 * Retourne { scale, opacity } pour un anneau qui se répète tous les periodFrames.
 * Recette validée Silicon Savannah Beat4 (scale 0.9→2.4, opacity 0.5→0).
 * Usage : <div style={{ transform:`scale(${pingRing(frame).scale})`, opacity: pingRing(frame).opacity }} />
 */
export const pingRing = (
  frame: number,
  periodFrames = 50,
  scaleFrom = 0.9,
  scaleTo = 2.4
): { scale: number; opacity: number } => {
  const t = frame % periodFrames;
  return {
    scale: interpolate(t, [0, periodFrames - 1], [scaleFrom, scaleTo]),
    opacity: interpolate(t, [0, periodFrames * 0.4, periodFrames - 1], [0.5, 0.25, 0]),
  };
};

import type React from "react";
