// Beat 2 — Situer 2007 (~15s)
// Audio: beat2/narration.mp3 (0→14.66s)
// Frame 0 = début du beat (global frame 314)

export const FPS = 30;
export const DURATION_FRAMES = 440; // 14.66s * 30

export const AUDIO = "souverain/silicon-savannah/beat2/narration.mp3";
export const BG = "souverain/silicon-savannah/beat2/bg.png";
export const SEG23_ANTENNA = "souverain/silicon-savannah/beat2/seg23_antenna.png";
export const SEG23_NOKIA = "souverain/silicon-savannah/beat2/seg23_nokia.png";

// Segments audio — frame relative (0 = début de CE beat)
export const SEG = {
  debut:  0,   // "Tout commence en deux mille sept."
  mpesa:  50,  // "Safaricom lance M-Pesa..." (364-314=50)
  nokia:  313, // "Juste un réseau et un vieux Nokia." (627-314=313)
  end:    410, // (724-314=410)
};
