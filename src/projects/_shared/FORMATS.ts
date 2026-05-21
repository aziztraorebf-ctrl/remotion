/**
 * Grilles de format video — source de verite unique.
 * Importer depuis ici, jamais recalculer dans les beats.
 */

export const FORMAT_916 = {
  W: 1080,
  H: 1920,
  safeTop: 288,
  safeBottom: 192,
  safeBottomY: 1728,
  sidePad: 30,
  colPad: 54,
  splitX: 540,
} as const;

export const FORMAT_169 = {
  W: 1920,
  H: 1080,
  safeTop: 108,
  safeBottom: 108,
  safeBottomY: 972,
  sidePad: 96,
  colPad: 80,
  splitX: 960,
} as const;

export type VideoFormat = typeof FORMAT_916 | typeof FORMAT_169;
