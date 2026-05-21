// Beat 4 — Le Prix (~26s)
// Audio: beat4/narration.mp3 (0→26.24s)
// Frame 0 = début du beat (global frame 1369)

export const FPS = 30;
export const DURATION_FRAMES = 787; // 26.24s * 30

export const AUDIO = "souverain/silicon-savannah/beat4/narration.mp3";
export const BG = "souverain/silicon-savannah/beat4/bg.png"; // candidat anthracite minimal

// Segments audio — frame relative (0 = début de CE beat)
export const SEG = {
  debut:    0,   // apparition visuelle avant voix
  intro:    60,  // "Mais voilà ce qu'on dit moins." (1429-1369=60)
  sh200:    97,  // "Deux cents shillings..." (1466-1369=97)
  sh50k:    279, // "Cinquante mille shillings..." (1648-1369=279)
  meme:     476, // "Même service..." (1845-1369=476)
  bareme:   668, // "C'est dans le barème officiel." (2037-1369=668)
  end:      757, // (2126-1369=757)
};
