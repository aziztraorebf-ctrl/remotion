// FPS defined locally to avoid circular import with timing.ts
const FPS = 30;

// Hook scene durations in seconds (PROVISIONAL - will be recalibrated after ElevenLabs audio)
const HOOK_DURATIONS_SEC = [8, 10, 8, 3, 3, 6, 5] as const;

// Convert to frames
const HOOK_DURATIONS = HOOK_DURATIONS_SEC.map((s) => s * FPS) as unknown as [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

// Cumulative start frames for each scene
export const HOOK_SCENE_STARTS = HOOK_DURATIONS.reduce<number[]>(
  (acc, _dur, i) => {
    if (i === 0) return [0];
    return [...acc, acc[i - 1] + HOOK_DURATIONS[i - 1]];
  },
  [],
) as [number, number, number, number, number, number, number];

export const HOOK_SCENE_DURATIONS = HOOK_DURATIONS;

export const HOOK_TOTAL_FRAMES = HOOK_DURATIONS.reduce((a, b) => a + b, 0);

// Scene indices for readability
export const SCENE = {
  ISSYK_KUL: 0,
  CATAPULTE: 1,
  GALERES: 2,
  MOITIE: 3,
  REFRAME: 4,
  REVEAL: 5,
  REFLEXES: 6,
} as const;
