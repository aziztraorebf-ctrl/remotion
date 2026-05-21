// Beat 7 — CTA (~6s)
// Audio: beat7/narration.mp3 (0→5.78s)
// Frame 0 = début du beat (global frame 3489)

export const FPS = 30;
export const DURATION_FRAMES = 248; // 5.78s narration + 2.5s outro fade

export const AUDIO = "souverain/silicon-savannah/beat7/narration.mp3";
export const BG = "souverain/silicon-savannah/beat7/bg.png"; // À générer

// Segments audio — frame relative (0 = début de CE beat)
export const SEG = {
  pays:    0,   // "Et dans ton pays..." (3489-3489=0)
  etat:    103, // "Une entreprise privée ou l'État ?" (3592-3489=103)
  reponds: 140, // "Réponds en commentaire." (3629-3489=140)
  end:     173,
};
