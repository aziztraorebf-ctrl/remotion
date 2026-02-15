// Retro Gaming 16-bit Theme Configuration
// NES/SNES inspired palette with limited colors

export const RETRO_COLORS = {
  // Background layers
  bgDark: "#0f0e17",
  bgMedium: "#1a1a2e",
  bgLight: "#16213e",

  // UI colors
  uiGreen: "#00ff41",
  uiCyan: "#00e5ff",
  uiYellow: "#ffe66d",
  uiRed: "#ff6b6b",
  uiPurple: "#a855f7",
  uiOrange: "#ff9f43",
  uiWhite: "#e2e8f0",
  uiGold: "#ffd700",

  // Game elements
  healthBar: "#00ff41",
  healthBarBg: "#1a1a2e",
  xpBar: "#00e5ff",
  bossRed: "#ff4444",

  // Text
  textPrimary: "#ffffff",
  textSecondary: "#94a3b8",
  textAccent: "#00ff41",

  // Pixel grid overlay
  gridLine: "rgba(0, 255, 65, 0.03)",
} as const;

export const RETRO_FONTS = {
  pixel: "Press Start 2P",
  mono: "VT323",
  ui: "Silkscreen",
} as const;

// Scanline overlay settings
export const CRT_SETTINGS = {
  scanlineOpacity: 0.08,
  scanlineSpacing: 4,
  vignetteIntensity: 0.4,
  chromaticAberration: 1.5,
  glowColor: "rgba(0, 255, 65, 0.15)",
} as const;

// Animation timing (in frames at 30fps)
export const TIMING = {
  fps: 30,
  typewriterSpeed: 2, // frames per character
  barFillDuration: 30, // frames for a bar to fill
  transitionDuration: 30,
  sceneGap: 5,
} as const;
