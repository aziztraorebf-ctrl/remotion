/**
 * Charte "Good News" — variation LUMINEUSE de la charte Souverain K&C.
 *
 * Le flux analytique/grave utilise navy sombre (#16213a). Le flux Good News
 * traduit la positivité : fond clair respirant, ivoire dominant, gold chaleureux,
 * navy réservé au texte et aux accents. Distingue visuellement les deux flux.
 */

export const GN = {
  // Fonds
  bgTop: "#fbf7ec", // ivoire très clair (haut du dégradé)
  bgBottom: "#f0e6cf", // ivoire chaud (bas) — respiration douce
  bgWarmGlow: "rgba(200,169,81,0.18)", // halo doré pour la luminosité

  // Encres / texte
  ink: "#16213a", // navy — texte principal sur fond clair
  inkSoft: "#3a4664", // navy adouci — corps secondaire

  // Accents
  gold: "#c8a951", // gold signature
  goldDeep: "#a8852f", // gold foncé pour contraste sur fond clair
  green: "#2f8f5b", // vert positif (bonne nouvelle) — accent ponctuel
  sky: "#3f72b0", // bleu macro (bascule internationale)

  // Lignes
  hairline: "rgba(22,33,58,0.15)",
} as const;
