// Palette Atlas Shaka Zulu — composant utilitaire pour exporter les couleurs
// Importe depuis timing.ts mais expose aussi des derives utiles

import { PALETTE } from "../timing";

export const SHAKA_PALETTE = {
  ...PALETTE,
  // Derives
  NOIR_PROFOND: "#0D0D0D",
  CARTE_FOND: "#1A1208",      // brun tres sombre (avant Nandi)
  CARTE_FOND_TRAGIQUE: "#0D0000", // noir bordeaux (apres Nandi)
  TEXTE_PRIMAIRE: "#F5E6C8",
  TEXTE_SECONDAIRE: "#9E9E9E",
  // Bordures triple-screen synthese S2
  SEPARATEUR_BORDEAUX: "#8B1A1A",
} as const;

export const SHAKA_FONTS = {
  TITRE: '"Anton", "Bebas Neue", sans-serif',
  CORPS: '"Inter", system-ui, sans-serif',
  CALLIGRAPHIE: '"Cinzel", serif',
} as const;
