/**
 * theme.ts — Palette NorthShield (test client-sim #2).
 *
 * Palette DISTINCTE de Flowdesk (#0B1F3A/#FF6B1A) : NorthShield a son propre accent cyan,
 * pas orange. Brief client : "Bleu marine foncé / blanc cassé / accent cyan électrique.
 * Typographie géométrique épurée."
 */

export const NS_COLORS = {
  navyDeep: "#0A1628", // fond principal, plus profond que Flowdesk
  navyPanel: "#0F1F38", // panneaux/cartes sur fond navy
  ivory: "#F4F1EA", // texte principal / blanc cassé
  ivoryMuted: "#A8B0C0", // texte secondaire / labels
  cyan: "#00D9FF", // accent électrique — UNIQUEMENT actions/highlights
  cyanDim: "#00D9FF33", // cyan à 20% opacité, halos/borders discrets
  green: "#3DDC97", // score bas risque / autorisé
  amber: "#FFB020", // zone intermédiaire (non utilisée dans les 2 cas du brief, réservée)
  red: "#FF4D5E", // score haut risque / vérification requise
} as const;

export const NS_FONTS = {
  // Geometrique epure -- pas de police display narrative (Bebas) ici, registre produit SaaS.
  display: "'Space Grotesk', 'Inter', sans-serif",
  mono: "'IBM Plex Mono', monospace",
} as const;

export const NS_RADII = {
  card: 16,
  pill: 999,
  input: 8,
} as const;
