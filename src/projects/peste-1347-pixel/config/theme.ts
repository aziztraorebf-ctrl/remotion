import { loadFont as loadPressStart2P } from "@remotion/google-fonts/PressStart2P";
import { loadFont as loadVT323 } from "@remotion/google-fonts/VT323";

const { fontFamily: pressStart2P } = loadPressStart2P();
const { fontFamily: vt323 } = loadVT323();

// Dark medieval palette for plague content
export const COLORS = {
  // Backgrounds per act
  bgAct1: "#050505",
  bgAct2: "#1A0F0A",
  bgAct3: "#1A0808",

  // Data
  plagueRed: "#C62828",
  covidBlue: "#1565C0",
  gold: "#D4A017",

  // Text
  textPrimary: "#E8D5B5",
  textSecondary: "#8B7355",
  textDanger: "#FF4444",

  // Map - parchment style (image E direction)
  mapLand: "#2D6B30",
  mapLandLight: "#3E8B42",
  mapBorder: "rgba(255, 248, 230, 0.7)",
  mapBorderDark: "rgba(0, 0, 0, 0.3)",
  mapSea: "transparent",
  infectionRed: "#D32F2F",
  infectionGlow: "rgba(211, 47, 47, 0.5)",

  // Parchment background
  parchmentVignette: "rgba(80, 50, 20, 0.6)",

  // Terminal system
  terminalGreen: "#00FF41",
  terminalGreenDim: "rgba(0, 255, 65, 0.6)",
  terminalGreenFaint: "rgba(0, 255, 65, 0.03)",

  // Ticker
  tickerBg: "rgba(0, 0, 0, 0.85)",
  tickerBorder: "rgba(0, 255, 65, 0.2)",

  // Grid overlay
  gridLine: "rgba(0, 255, 65, 0.03)",

  // Green phosphorescent terminal background
  bgGreenDark: "#001A0A",
  bgGreenBright: "#003315",

  // Data panel
  panelBg: "rgba(0, 0, 0, 0.5)",
  panelBorder: "rgba(0, 255, 65, 0.2)",
} as const;

export const FONTS = {
  title: pressStart2P,
  body: vt323,
} as const;

// CRT effect settings (adapted from retro-explainer, darker for plague)
export const CRT_SETTINGS = {
  scanlineOpacity: 0.22,
  scanlineSpacing: 3,
  vignetteIntensity: 0.75,
} as const;

// Base pixel size for low-res aesthetic
export const PIXEL_SIZE = 4;
