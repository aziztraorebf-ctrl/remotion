// Beat 1 — Hook (~11s)
// Audio: beat1/narration.mp3 (0→11.43s)
// Frame 0 = début du beat

export const FPS = 30;
export const DURATION_FRAMES = 343; // 11.43s * 30

export const AUDIO = "souverain/silicon-savannah/beat1/narration.mp3";
export const BG = "souverain/silicon-savannah/beat1/bg.png";
export const NAIROBI = "souverain/silicon-savannah/beat1/nairobi.jpg";

// Segments audio — frame relative (0 = début de CE beat)
export const SEG = {
  line1_start:  2,    // "En deux mille vingt-cinq..."
  kenya_reveal: 282,  // "Le Kenya."
  kenya_end:    300,
};
