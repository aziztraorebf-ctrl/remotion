// Beat 12 — Mécanisme 2 : FONSIS + Piège de la Dette
// Acte 3 S3 — Sénégal Pétrole & Gaz
// Audio: 237.90s → 293.20s (55.3s = 1659f @ 30fps)

export const BEAT12_DURATION_FRAMES = 1659;
export const FPS = 30;

// Audio anchors (frames relatifs au début du beat)
// 237.90s = startFrom={7137} dans le fichier narration
export const SEG = {
  TITRE:      0,    // "Mécanisme 2 — Le fonds souverain."
  FONSIS:     426,  // "FONSIS." (252.10s → 14.2s → 426f)
  PIEGE:      564,  // "Mais voilà le piège." (~256.7s → 18.8s → 564f)
  DETTE:      660,  // "soixante-dix pour cent" (~259.9s → 22.0s → 660f)
  FMI:        930,  // "Le FMI tire la sonnette d'alarme." (~269.0s → 31.1s → 933f)
  PROCESSFLOW: 1110, // "FONSIS → Transfert possible → Budget général"
  PAUSE:      1590, // Pause 1.5s avant Mécanisme 3
  END:        1659, // "Mécanisme 3" (293.20s)
} as const;

export const DURATION_FRAMES = BEAT12_DURATION_FRAMES;
