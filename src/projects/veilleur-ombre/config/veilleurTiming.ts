// veilleurTiming.ts v4 (restaure — v6 abandonnee)
// Projet : Le Veilleur de l'Ombre (40s, 30fps = 1200 frames)
// Durees audio mesurees par ffprobe — 2026-02-24
// v4 : oiseau traverse TOUT l'ecran (flash complet), pose + n4 enchaines

export const FPS = 30;
export const TOTAL_FRAMES = 1200; // 40s

export const AUDIO_FRAMES = {
  n1: 115, // n1_village.mp3 : 3.81s
  n2: 340, // n2_ombre.mp3 : 11.33s
  n3: 261, // n3_oiseau.mp3 : 8.68s
  n4: 173, // n4_sage.mp3 : 5.76s
} as const;

export const SCENES = {
  s1: {
    startFrame: 0,
    durationInFrames: 150,
    audioStartFrame: 20,
    audioSrc: "audio/veilleur-ombre/n1_village.mp3",
  },
  s2: {
    startFrame: 150,
    durationInFrames: 360,
    audioStartFrame: 15,
    audioSrc: "audio/veilleur-ombre/n2_ombre.mp3",
  },
  s3: {
    startFrame: 510,
    durationInFrames: 330,
    audioStartFrame: 15,
    audioSrc: "audio/veilleur-ombre/n3_oiseau.mp3",
  },
  s4: {
    startFrame: 840,
    durationInFrames: 360,
    audioSrc: "audio/veilleur-ombre/n4_sage.mp3",
  },
} as const;

// n4 demarre a ce frame absolu (pose + courte pause)
export const N4_START = 811;

export const CUES = {
  moon_pulse_start:      0,

  arm_raise_start:       175,
  arm_raise_end:         240,
  windows_light_start:   200,
  windows_light_end:     340,

  // S3 — oiseau traverse tout l'ecran, vire, se pose
  // n3 audio : f525-f786
  bird_enter:            520,
  bird_midscreen:        620,   // pic du flash
  bird_exit_right:       700,
  bird_turn:             710,
  bird_slowdown:         740,
  bird_land:             785,
  bird_wings_fold:       815,

  house_appear_start:    745,
  house_appear_end:      800,

  // S4
  sage_glow_start:       850,
  // "pour que les etoiles puissent nous parler" ~ f916 (N4_START=811 + ~105f)
  sage_arm_rise_s4:      870,   // bras remonte lentement pendant la reponse
  stars_vivid_start:     916,   // etoiles s'intensifient sur "les etoiles"
  stars_vivid_peak:      950,   // pic d'intensite
  stars_vivid_end:       1080,  // retombe au fondu
  moon_descend_start:    920,
  moon_becomes_fire:     1060,
  sage_glow_peak:        980,
  sage_glow_end:         1100,
  horizon_pulse:         1120,
  fade_out_start:        1130,
  fade_out_end:          1200,
} as const;
