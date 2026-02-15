// Data Viz Explainer - Clean, modern data visualization theme
// Inspired by Bloomberg Terminal meets Kurzgesagt clarity

export const COLORS = {
  // Backgrounds - deep dark for contrast
  bgPrimary: "#0a0a1a",
  bgSecondary: "#111127",
  bgCard: "#181838",
  bgCardHover: "#1e1e45",

  // Accent colors - bold, high contrast
  green: "#00e887",
  greenDark: "#00b368",
  greenGlow: "rgba(0, 232, 135, 0.3)",

  red: "#ff4757",
  redDark: "#c0392b",
  redGlow: "rgba(255, 71, 87, 0.3)",

  blue: "#3498ff",
  blueDark: "#2176d6",
  blueGlow: "rgba(52, 152, 255, 0.25)",

  gold: "#ffc312",
  goldDark: "#d4a00a",

  orange: "#ff9f43",
  purple: "#a55eea",

  // Text
  textPrimary: "#ffffff",
  textSecondary: "#8892b0",
  textMuted: "#4a5568",

  // Grid & structural
  gridLine: "rgba(136, 146, 176, 0.08)",
  gridLineBright: "rgba(136, 146, 176, 0.15)",
  divider: "rgba(136, 146, 176, 0.12)",
} as const;

export const FONTS = {
  display: "Inter",
  mono: "JetBrains Mono",
} as const;

// Scene timing (frames at 30fps)
export const SCENE_TIMING = {
  fps: 30,
  // Hook: 0-5s (0-150f)
  hookStart: 0,
  hookEnd: 150,
  // Problem viz: 5-25s (150-750f)
  problemStart: 150,
  problemEnd: 750,
  // Reveal: 25-45s (750-1350f)
  revealStart: 750,
  revealEnd: 1350,
  // CTA: 45-60s (1350-1800f)
  ctaStart: 1350,
  ctaEnd: 1800,
  // Total
  totalFrames: 1800,
} as const;
