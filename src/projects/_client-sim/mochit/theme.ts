// MOCH-IT — test systeme A->Z (reproduction/depassement d'une pub Fiverr de reference).
// Palette mesuree sur la reference (breakdown GPT-5.6 Sol, cf memory/client-sim-tests).
export const MI_COLORS = {
  magenta: "#F0005D",
  magentaAlt: "#E90059",
  navy: "#1D2734",
  offWhite: "#F2F2F4",
  whiteWarm: "#F4F4F6",
  charcoal: "#171B24",
  slate: "#657087",
  cardLight: "#F7F7F5",
  darkGray: "#3E4148",
  // ajoute V5 (2026-08-08) apres breakdown comparatif Gemini+Kimi : icones bicolores
  // (rose + cyan) au lieu de monochrome, comme la reference.
  cyan: "#5FD3E8",
  cyanDark: "#2E8FA3",
};

export const MI_WIDTH = 1080;
export const MI_HEIGHT = 2460;
export const MI_FPS = 30;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const MI_CLAMP = clamp;
