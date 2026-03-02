export const SIDEVIEW_COORDS = {
  width: 1920,
  height: 1080,
  // Origin is top-left: x increases to the right, y increases downward.
  origin: "top-left",
} as const;

export const GROUND_Y = 820;

export const SIDEVIEW_LANES = {
  A: 790,
  B: 820,
  C: 850,
} as const;

export const LANE_SCALE: Record<number, number> = {
  [SIDEVIEW_LANES.A]: 0.92,
  [SIDEVIEW_LANES.B]: 1.0,
  [SIDEVIEW_LANES.C]: 1.08,
};

export const SIDEVIEW_LAYER_Z = {
  background: 100,
  buildings: 800,
  laneA: SIDEVIEW_LANES.A,
  laneB: SIDEVIEW_LANES.B,
  laneC: SIDEVIEW_LANES.C,
  textOverlay: 9999,
} as const;

export const BASE_UPSCALE = 4.0;
export const FOOT_ANCHOR_Y_DEFAULT = 0.875;
export const MIN_NPC_SPACING = 180;
export const WRAP_MARGIN = 120;

// Keep debug off by default for normal renders. Enable manually when calibrating.
export const SIDEVIEW_DEBUG = false;

export const wrapScreenX = (
  x: number,
  screenWidth: number = SIDEVIEW_COORDS.width,
  margin: number = WRAP_MARGIN,
): number => {
  const min = -margin;
  const max = screenWidth + margin;
  const range = max - min;
  return ((x - min) % range + range) % range + min;
};

export const computeDisplaySize = (
  nativeSize: number,
  laneY: number,
  scaleOverride?: number,
): number => {
  const laneScale = LANE_SCALE[laneY] ?? 1.0;
  const charScale = scaleOverride ?? 1.0;
  return Math.round(nativeSize * BASE_UPSCALE * laneScale * charScale);
};

export const computeAnchoredTop = (
  laneY: number,
  displaySize: number,
  footAnchorY: number = FOOT_ANCHOR_Y_DEFAULT,
): number => {
  return Math.round(laneY - displaySize * footAnchorY);
};

