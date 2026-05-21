// Beat 3 — Le Miracle (~25s)
// Audio: beat3/narration.mp3 (0→24.5s)
// Frame 0 = début du beat (global frame 724)

export const FPS = 30;
export const DURATION_FRAMES = 735; // 24.5s * 30

export const AUDIO = "souverain/silicon-savannah/beat3/narration.mp3";
export const BG = "souverain/silicon-savannah/beat3/bg.png"; // candidat lignes dorées — à valider

// Segments audio — frame relative (0 = début de CE beat)
export const SEG = {
  intro:    0,   // "Dix-huit ans plus tard." (724-724=0)
  kenyans:  37,  // "Neuf Kenyans sur dix..." (761-724=37)
  points:   247, // "Trois cent mille points..." (971-724=247)
  familles: 440, // "Des familles séparées..." (1164-724=440)
  fin:      638, // "C'était une révolution réelle." (1362-724=638)
  end:      705, // (1429-724=705)
};
