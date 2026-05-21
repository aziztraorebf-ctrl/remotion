// Beat03 Fleet — Scene Manifest
// Modifier CE fichier uniquement pour changer le look de la scene.
// Le composant Beat03Fleet lit ce manifest — zero valeur hardcodee dans le composant.

export const BEAT03_MANIFEST = {

  // --- Visuel de fond ---
  background: {
    color: "#2e2f3b",
    overlayOpacity: 0.45,
    asset: "assets/geoafrique/recraft-test/B3-fleet-portrait-v1.svg",
  },

  // --- Transitions d'entree/sortie du beat ---
  fade: {
    inDuration: 20,
    outDuration: 20,
  },

  // --- Lignes de texte ---
  // appearsAt : frame locale d'apparition
  // springConfig : optionnel, sinon fade simple
  lines: [
    {
      id: "count",
      text: "2 000",
      y: 0.42,
      size: 160,
      color: "#D4AF37",
      weight: "700",
      appearsAt: 0,
      animation: "counter",   // compteur 0 → 2000 sur 40 frames
      counterTarget: 2000,
      counterDuration: 40,
      spring: { damping: 12, stiffness: 140 },
    },
    {
      id: "pirogues",
      text: "pirogues",
      y: 0.50,
      size: 64,
      color: "#C8820A",
      weight: "400",
      appearsAt: 0,
      animation: "spring",
      spring: { damping: 12, stiffness: 140 },
    },
    {
      id: "eclaireurs",
      text: "200 éclaireurs",
      y: 0.60,
      size: 52,
      color: "#F5E6C8",
      weight: "400",
      appearsAt: 50,
      animation: "fade",
      fadeDuration: 20,
    },
    {
      id: "seulRevient",
      text: "UN SEUL REVIENT.",
      y: 0.72,
      size: 80,
      color: "#C1392B",
      weight: "700",
      appearsAt: 90,
      animation: "spring",
      spring: { damping: 8, stiffness: 100 },
    },
  ],

  // --- Glow filter sur les textes spring ---
  glow: {
    enabled: true,
    stdDeviation: 6,
  },

} as const;

export type Beat03Manifest = typeof BEAT03_MANIFEST;
