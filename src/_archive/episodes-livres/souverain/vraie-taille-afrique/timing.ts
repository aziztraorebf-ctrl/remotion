// timing.ts — La vraie taille de l'Afrique
// Audio: refonte 2026-05-12 | 5 fichiers narration-beat{1-5}.mp3 | ffprobe + forced alignment
// Format: BEATS flat (Short Souverain ~68s) | 1080x1920 vertical
// Version: LOCKED 2026-05-12

export const FPS = 30;
export const DURATION_IN_FRAMES = 2143; // 71.43s total (Beat5 elargi 360->420f)

// ---------------------------------------------------------------------------
// AUDIO SEGMENTS
// startFrame = frame absolue dans la composition où l'audio démarre
// durationFrames = durée réelle de l'audio (Math.round(secondes * FPS))
// ---------------------------------------------------------------------------

export const AUDIO_SEGMENTS = {
  // VO: "Tu connais cette carte. Mais tu ne connais pas l'Afrique."
  beat1: {
    file: "souverain/vraie-taille-afrique/audio/narration-beat1.mp3",
    startFrame: 0,
    durationFrames: 108, // 3.60s * 30 = 108f
  },
  // VO: "Voici la vraie projection [...] L'Afrique les contient tous."
  beat2: {
    file: "souverain/vraie-taille-afrique/audio/narration-beat2.mp3",
    startFrame: 150, // début Beat 2 (5s)
    durationFrames: 427, // 14.24s * 30 = 427.2 -> 427f
  },
  // VO: "Trente virgule trois millions de kilomètres carrés."
  beat3: {
    file: "souverain/vraie-taille-afrique/audio/narration-beat3.mp3",
    startFrame: 793, // beat2b finit f778 + 15f respiration = 793
    durationFrames: 98, // 3.28s * 30 = 98.4 -> 98f
  },
  // VO: "Sur la carte Mercator [...] dans tous les manuels scolaires du monde."
  beat4: {
    file: "souverain/vraie-taille-afrique/audio/narration-beat4.mp3",
    startFrame: 1033, // 990 + 43 = 1033
    durationFrames: 686, // 22.88s * 30 = 686.4 -> 686f
  },
  // VO: "Maintenant tu sais [...] Partage cette vidéo."
  beat5: {
    file: "souverain/vraie-taille-afrique/audio/narration-beat5.mp3",
    startFrame: 1783, // 1740 + 43 = 1783
    durationFrames: 346, // 11.52s * 30 = 345.6 -> 346f
  },
} as const;

// ---------------------------------------------------------------------------
// BEATS — fenêtres visuelles (Sequence from/durationInFrames)
// ---------------------------------------------------------------------------

export const BEATS = {
  // Beat 1 — Carte Mercator statique | 5s | VO 3.60s + 1.40s hold
  beat1: { from: 0,    durationInFrames: 150  },
  // Beat 2 — Animation silhouettes | 20s | VO 14.24s + 5.76s animation post-VO
  beat2: { from: 150,  durationInFrames: 600  },
  // Beat 3 — Chiffre "30,3 M km²" | 8s | VO 3.28s + hold
  beat3: { from: 793,  durationInFrames: 240  },
  // Beat 4 — Explication Mercator/Groenland | 25s | VO 22.88s + hold
  beat4: { from: 1033, durationInFrames: 750  },
  // Beat 5 — Punchline + CTA | 14s | VO 11.52s + 1s silence + fondu
  beat5: { from: 1783, durationInFrames: 420  },
} as const;

// ---------------------------------------------------------------------------
// CONSTANTES UTILES
// ---------------------------------------------------------------------------

export const BEAT1_START = BEATS.beat1.from;   // 0
export const BEAT2_START = BEATS.beat2.from;   // 150
export const BEAT3_START = BEATS.beat3.from;   // 793
export const BEAT4_START = BEATS.beat4.from;   // 1033
export const BEAT5_START = BEATS.beat5.from;   // 1783

// beat2b : demarre 1.5s apres fin beat2 VO (beat2 VO finit f577, +45f pause = f622, dure 156f => finit f778)
export const BEAT2B_START_FRAME = AUDIO_SEGMENTS.beat2.startFrame + AUDIO_SEGMENTS.beat2.durationFrames + 45; // 622
export const BEAT2B_DURATION_FRAMES = 156; // 5.2s * 30

// Frame où la VO se termine dans chaque beat
export const BEAT1_VO_END = AUDIO_SEGMENTS.beat1.startFrame + AUDIO_SEGMENTS.beat1.durationFrames; // 108
export const BEAT2_VO_END = AUDIO_SEGMENTS.beat2.startFrame + AUDIO_SEGMENTS.beat2.durationFrames; // 577
export const BEAT2B_VO_END = BEAT2B_START_FRAME + BEAT2B_DURATION_FRAMES; // 778
export const BEAT3_VO_END = AUDIO_SEGMENTS.beat3.startFrame + AUDIO_SEGMENTS.beat3.durationFrames; // 891
export const BEAT4_VO_END = AUDIO_SEGMENTS.beat4.startFrame + AUDIO_SEGMENTS.beat4.durationFrames; // 1719
export const BEAT5_VO_END = AUDIO_SEGMENTS.beat5.startFrame + AUDIO_SEGMENTS.beat5.durationFrames; // 2129

// Silences post-VO par beat
export const BEAT1_SILENCE_FRAMES = BEATS.beat1.durationInFrames - AUDIO_SEGMENTS.beat1.durationFrames; // 42f = 1.40s
export const BEAT2_SILENCE_FRAMES = BEATS.beat2.durationInFrames - AUDIO_SEGMENTS.beat2.durationFrames; // 173f = 5.77s
export const BEAT3_SILENCE_FRAMES = BEATS.beat3.from + BEATS.beat3.durationInFrames - BEAT3_VO_END;    // 135f = 4.5s
export const BEAT4_SILENCE_FRAMES = BEATS.beat4.from + BEATS.beat4.durationInFrames - BEAT4_VO_END;    // 97f = 3.23s
export const BEAT5_SILENCE_FRAMES = 0; // VO occupe toute la fenetre (346f sur 360f = 14f de marge)
