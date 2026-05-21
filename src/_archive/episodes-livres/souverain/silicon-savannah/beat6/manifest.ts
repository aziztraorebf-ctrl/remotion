// Beat 6 — La Question (~23s)
// Audio: beat6/narration.mp3 (0→23.1s)
// Frame 0 = début du beat (global frame 2826)

export const FPS = 30;
export const DURATION_FRAMES = 693; // 23.1s * 30

export const AUDIO = "souverain/silicon-savannah/beat6/narration.mp3";
export const BG = "souverain/silicon-savannah/beat6/bg.png"; // candidat diagonales subtiles

// Segments audio — frame relative (0 = début de CE beat)
export const SEG = {
  sorti:       0,   // "M-Pesa a sorti..." (2826-2826=0)
  rails:       138, // "Et les rails..." (2964-2826=138)
  bon_mauvais: 461, // "La question n'est pas..." (3287-2826=461)
  qui:         572, // "La question c'est : qui décide ?" (3398-2826=572)
  end:         663, // (3489-2826=663)
};
