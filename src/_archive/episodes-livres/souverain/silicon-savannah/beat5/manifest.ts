// Beat 5 — Le Monopole (~24s)
// Audio: beat5/narration.mp3 (0→24.33s)
// Frame 0 = début du beat (global frame 2126)

export const FPS = 30;
export const DURATION_FRAMES = 730; // 24.33s * 30

export const AUDIO = "souverain/silicon-savannah/beat5/narration.mp3";
export const BG = "souverain/silicon-savannah/beat5/bg.png"; // À générer

// Segments audio — frame relative (0 = début de CE beat)
export const SEG = {
  debut:      0,   // "a laissé M-PESA opérer"
  testlearn:  306, // "test and learn" — Whisper: 306f
  sept_ans:   339, // "7 ans" (cercle complet) — Whisper: 339f
  rails1:     574, // "Un seul service." — Whisper: 574f
  rails2:     632, // "Les rails de tout un pays." — Whisper: 632f
  end:        700,
};
