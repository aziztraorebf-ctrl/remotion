/**
 * Animation hooks library — validated patterns from production sessions
 *
 * These hooks are asset-agnostic: they work on any SVG group or React element.
 * Validated on: RecraftFlotteTest (24 boat groups, 2026-03-09)
 *
 * Usage rule: import individual hooks, not the whole module.
 * All hooks require frame + fps from useCurrentFrame() / useVideoConfig().
 */

import {spring, interpolate} from 'remotion';

/**
 * Ocean swell — individual bobbing motion per element.
 * Each index gets a unique period, amplitude and phase so elements
 * never move in perfect sync (avoids the "marching ants" look).
 *
 * @returns translateY value in SVG user units (px)
 *
 * @example
 * const ty = useOceanSwell(i, frame);
 * <g transform={`translate(0,${ty})`}>
 */
export function useOceanSwell(index: number, frame: number): number {
  const period = 90 + index * 8;
  const amplitude = 3 + (index % 4) * 1.5;
  const phase = (index * 0.73) % (Math.PI * 2);
  return Math.sin((frame / period) * Math.PI * 2 + phase) * amplitude;
}

/**
 * Staggered spring entrance — elements fade in one by one.
 * Uses spring() for natural deceleration (not a linear fade).
 *
 * @param delayPerIndex - frames between each element's entrance (default: 4)
 * @returns opacity value 0 → 1
 *
 * @example
 * const opacity = useSpringEntrance(i, frame, fps);
 * <g opacity={opacity}>
 */
export function useSpringEntrance(
  index: number,
  frame: number,
  fps: number,
  delayPerIndex: number = 4
): number {
  return spring({
    frame: Math.max(0, frame - index * delayPerIndex),
    fps,
    config: {damping: 200},
    from: 0,
    to: 1,
  });
}

/**
 * Progressive drift — elements translate along an axis over time.
 * Clamped: stops at maxPx after totalFrames, never overshoots.
 *
 * @param directionPx - signed target displacement (negative = left, positive = right)
 * @param totalFrames - frame count over which the drift completes (default: 300)
 * @param indexOffset - small per-index variation so elements don't move identically (default: 2)
 * @returns translateX value in SVG user units (px)
 *
 * @example
 * const tx = useDrift(i, frame, -250); // drift left 250px
 * <g transform={`translate(${tx},0)`}>
 */
export function useDrift(
  index: number,
  frame: number,
  directionPx: number,
  totalFrames: number = 300,
  indexOffset: number = 2
): number {
  const target = directionPx < 0
    ? directionPx - index * indexOffset
    : directionPx + index * indexOffset;

  return interpolate(frame, [0, totalFrames], [0, target], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
}
