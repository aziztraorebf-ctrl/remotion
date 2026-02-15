import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily: spaceGrotesk } = loadSpaceGrotesk();
const { fontFamily: jetBrainsMono } = loadJetBrainsMono();

export const COLORS = {
  black: "#0A0A0F",
  white: "#F5F5F5",
  red: "#E63946",
  blue: "#0066FF",
  yellow: "#FFD600",

  bgHook: "#0A0A0F",
  bgSetup: "#0B1220",
  bgMecanisme: "#150A0A",
  bgReveal: "#E63946",
  bgCta: "#F5F5F5",

  textPrimary: "#F5F5F5",
  textDark: "#0A0A0F",
  textMuted: "#666666",
  gridLine: "#222222",
  barBg: "#1a1a1a",
} as const;

export const FONTS = {
  display: spaceGrotesk,
  mono: jetBrainsMono,
} as const;

export const SPRING_BRUT = {
  damping: 20,
  stiffness: 180,
} as const;

// Timings resserres pour coller a la duree reelle de la voix generee
// Hook: 14.3s voix + marge = 520 frames
// Setup: 32.7s voix + marge = 1100 frames
// Mecanisme: 36.0s voix + marge = 1200 frames
// Reveal+CTA: 40.7s voix + marge = 1400 frames
export const SCENE_TIMING = {
  fps: 30,
  hookStart: 0,
  hookEnd: 520,
  setupStart: 520,
  setupEnd: 1620,
  mecanismeStart: 1620,
  mecanismeEnd: 2820,
  revealCtaStart: 2820,
  revealCtaEnd: 4220,
  totalFrames: 4220,
} as const;

export const BORDER = {
  width: 4,
  style: "solid",
} as const;
