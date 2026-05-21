// lionTiming.ts — SCENE_TIMING produit par storyboarder
// Projet : Le Lion et la Riviere qui Parle (silhouette SVG, 1 min, 30fps)
// Audio mesure par ffprobe — 2026-02-24
// FPS : 30 | Total : 1800 frames (60.0s)

export const FPS = 30;

export const AUDIO_DURATION_FRAMES = {
  s1: 315,
  s2: 353,
  s3: 232,
  s4: 355,
} as const;

export const LION_SCENE_TIMING = {
  fps: 30,
  totalFrames: 1800,
  scenes: {
    s1: {
      startFrame: 0,
      durationInFrames: 450,
      endFrame: 449,
      audioSrc: "audio/silhouette-conte/s1_lion.mp3",
      audioStartFrame: 20,
      bgTop: "#FF6B1A",
      bgBottom: "#1A0500",
      description: "Savane crepuscule — lion marche arrogant, baobabs",
    },
    s2: {
      startFrame: 450,
      durationInFrames: 480,
      endFrame: 929,
      audioSrc: "audio/silhouette-conte/s2_riviere.mp3",
      audioStartFrame: 20,
      bgTop: "#0A0F2E",
      bgBottom: "#05081A",
      description: "Nuit bleue — riviere serpente, confrontation, lune",
    },
    s3: {
      startFrame: 930,
      durationInFrames: 350,
      endFrame: 1279,
      audioSrc: "audio/silhouette-conte/s3_enfant.mp3",
      audioStartFrame: 20,
      bgTop: "#F7B8A0",
      bgBottom: "#2C1A00",
      description: "Aube rose — enfant face au lion assis, cases en fond",
    },
    s4: {
      startFrame: 1280,
      durationInFrames: 520,
      endFrame: 1799,
      audioSrc: "audio/silhouette-conte/s4_gratitude.mp3",
      audioStartFrame: 20,
      bgTop: "#FFD060",
      bgBottom: "#FF7A00",
      description: "Aurore doree — lion s'incline, eau monte, explosion lumiere",
    },
  },
} as const;

// Frames absolus pour synchronisation animations
export const VISUAL_CUES = {
  // S1 : Savane crepuscule (0-449)
  s1_fade_in:       0,
  s1_audio_start:   20,
  s1_lion_enter:    30,
  s1_audio_end:     335,
  s1_fade_out:      430,

  // S2 : Nuit bleue (450-929)
  s2_fade_in:       450,
  s2_audio_start:   470,
  s2_river_appear:  480,
  s2_lion_approach: 530,
  s2_audio_end:     823,
  s2_fade_out:      910,

  // S3 : Aube rose (930-1279)
  s3_fade_in:       930,
  s3_audio_start:   950,
  s3_child_enter:   965,
  s3_audio_end:     1182,
  s3_fade_out:      1260,

  // S4 : Aurore doree (1280-1799)
  s4_fade_in:       1280,
  s4_audio_start:   1300,
  s4_lion_bow:      1315,
  s4_water_rise:    1360,
  s4_light_burst:   1450,
  s4_audio_end:     1655,
  s4_light_decay:   1660,
  s4_fade_out_start: 1750,
  s4_end:           1799,
} as const;
