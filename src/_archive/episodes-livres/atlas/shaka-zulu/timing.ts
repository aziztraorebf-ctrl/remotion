// Atlas Shaka Zulu — timing.ts
// Source : ElevenLabs Forced Alignment sur narration-v5.mp3
// Loss globale : 0.244 (confiance solide)
// DO NOT EDIT manuellement — timestamps derives de shaka-alignment.ts

export const FPS = 30;
export const AUDIO_DURATION_S = 150.32;
export const AUDIO_DURATION_FRAMES = Math.round(AUDIO_DURATION_S * FPS); // 4509

// ─── Segments principaux ────────────────────────────────────────────────────

export const SEGMENTS = {
  HOOK: {
    startS: 0.120,
    endS: 4.860,
    startFrame: 4,
    endFrame: 146,
    durationFrames: 142,
  },
  S1_GEO: {
    startS: 5.560,
    endS: 21.760,
    startFrame: 167,
    endFrame: 653,
    durationFrames: 486,
  },
  S2_MILITAIRE: {
    startS: 22.750,
    endS: 72.360,
    startFrame: 683,
    endFrame: 2171,
    durationFrames: 1488,
  },
  S3_EXPANSION: {
    startS: 73.160,
    endS: 93.460,
    startFrame: 2195,
    endFrame: 2804,
    durationFrames: 608,
  },
  S4_NANDI: {
    startS: 94.240,
    endS: 139.640,
    startFrame: 2827,
    endFrame: 4189,
    durationFrames: 1361,
  },
  S5_CTA: {
    startS: 140.489,
    endS: 150.230,
    startFrame: 4215,
    endFrame: 4507,
    durationFrames: 292,
  },
} as const;

// ─── S2 — sous-segments (structure 4 actes — synthese Aziz + Kimi) ──────────
// Chaque acte a son propre layout. Pas de triple-screen continu.
// A1/A2 = plein ecran insert + carte minoree. A3 = carte + warriors. A4 = triple-screen synthese 9s.

export const S2_ACTS = {
  A1_IKLWA: {
    label: "Iklwa — la lance courte",
    startS: 22.750,    // debut S2
    endS: 37.680,      // avant "Deuxieme"
    startFrame: 683,
    endFrame: 1130,
    durationFrames: 447,
    layout: "fullscreen-insert" as const,
  },
  A2_BOUCLIER: {
    label: "Bouclier — l'arme defensive devient offensive",
    startS: 37.680,    // "Deuxieme"
    endS: 49.780,      // avant "Troisieme"
    startFrame: 1130,
    endFrame: 1493,
    durationFrames: 363,
    layout: "fullscreen-insert" as const,
  },
  A3_CORNES: {
    label: "Cornes de buffle — warriors marchent sur la carte",
    startS: 49.780,    // "Troisieme"
    endS: 63.300,      // avant "A Gqokli"
    startFrame: 1493,
    endFrame: 1899,
    durationFrames: 406,
    layout: "map-with-sprites" as const,
  },
  A4_GQOKLI_SYNTHESE: {
    label: "Gqokli Hill + Triple-screen synthese (9s)",
    startS: 63.300,    // "A Gqokli Hill"
    endS: 72.360,      // fin S2
    startFrame: 1899,
    endFrame: 2171,
    durationFrames: 272,
    layout: "triple-screen-synthese" as const,
  },
} as const;

// ─── Inserts — pattern interrupts visuels ───────────────────────────────────
// Chaque insert est une Sequence independante qui overlay la composition.
// Duree typique : 4-8s. La narration continue pendant l'insert.

export const INSERTS = {
  // S1 — chiffre "1 500" geant sur fond noir
  S1_NOMBRE_1500: {
    triggerS: 9.540,   // "Mille cinq cents personnes"
    triggerFrame: 286,
    durationFrames: 90, // 3s
  },

  // S2 A1 — iklwa plein ecran (frappe descendante rotateZ -45deg)
  S2_IKLWA: {
    triggerS: 31.820,  // "l'iklwa, courte, mortelle"
    triggerFrame: 955,
    durationFrames: 150,
  },

  // S2 A2 — bouclier plein ecran (boucle 4 rotations crochet)
  S2_BOUCLIER: {
    triggerS: 38.820,  // "le bouclier devient une arme"
    triggerFrame: 1165,
    durationFrames: 150,
  },

  // S2 A3 — formation cornes (warriors marchent sur bezier paths)
  S2_CORNES_FORMATION: {
    triggerS: 51.760,  // "la formation des cornes de buffle"
    triggerFrame: 1553,
    durationFrames: 200,
  },

  // S2 A4 — flash "90%" pertes Gqokli (Kimi Q5)
  S2_FLASH_90: {
    triggerS: 66.480,  // "quatre-vingt-dix pour cent"
    triggerFrame: 1994,
    durationFrames: 60, // 2s flash + pulse
  },

  // S2 A4 — triple-screen synthese (iklwa | bouclier | cornes cote a cote)
  S2_TRIPLE_SYNTHESE: {
    triggerS: 70.000,  // pendant "Pas une victoire. Une destruction totale."
    triggerFrame: 2100,
    durationFrames: 71, // ~2.4s avant fin S2
  },

  // S3 — bar chart 1 500 -> 50 000 + ligne "20% vs 5%"
  S3_BARCHART: {
    triggerS: 78.380,  // "Mille cinq cents guerriers en 1816"
    triggerFrame: 2352,
    durationFrames: 210, // 7s (couvre jusqu'a "20% de sa population")
  },

  // S4 — "4 000" + source JSA sur fond sombre
  S4_NOMBRE_4000: {
    triggerS: 120.120, // "quatre mille Zulus perirent"
    triggerFrame: 3604,
    durationFrames: 150, // 5s
  },

  // S5 — cascade Napoléon / Alexandre / Shaka
  S5_CASCADE_NAPOLEON: {
    triggerS: 143.280, // "on cite Napoleon"
    triggerFrame: 4298,
    durationFrames: 90, // 3s
  },
  S5_CASCADE_ALEXANDRE: {
    triggerS: 145.020, // "On cite Alexandre"
    triggerFrame: 4351,
    durationFrames: 90, // 3s
  },
  S5_CASCADE_SHAKA: {
    triggerS: 146.920, // "Qui cite Shaka ?"
    triggerFrame: 4408,
    durationFrames: 90, // 3s
  },
} as const;

// ─── Moments narratifs cles (pour animations carte / overlays) ───────────────

export const NARRATIVE_BEATS = {
  // S2 — resultats Gqokli Hill
  GQOKLI_HILL: {
    startS: 63.480, // "A Gqokli Hill"
    startFrame: 1904,
  },

  // S3 — pivot quantitatif 50 000
  CINQUANTE_MILLE: {
    startS: 82.060, // "Cinquante mille en 1828"
    startFrame: 2462,
  },

  // S4 — mort de Nandi
  NANDI_MEURT: {
    startS: 107.480, // "Nandi meurt"
    startFrame: 3225,
  },

  // S4 — decret deuil national
  DEUIL_NATIONAL: {
    startS: 109.360, // "Shaka decreete un deuil national"
    startFrame: 3281,
  },

  // S4 — assassinat
  ASSASSINAT: {
    startS: 132.540, // "Le vingt-deux septembre"
    startFrame: 3976,
  },
} as const;

// ─── Triple-screen S2 (composant signature) ─────────────────────────────────
// Reveal sequentiel : carte -> panel gauche +0.3s -> panel droit +0.6s
// Couleur separateurs : bordeaux (#8B1A1A)

export const TRIPLE_SCREEN = {
  REVEAL_DELAY_PANEL_LEFT_FRAMES: 9,   // +0.3s
  REVEAL_DELAY_PANEL_RIGHT_FRAMES: 18, // +0.6s
  SEPARATOR_COLOR: "#8B1A1A",          // bordeaux Zulu
} as const;

// ─── Palette Shaka Zulu ──────────────────────────────────────────────────────

export const PALETTE = {
  OR: "#C8A84B",
  BORDEAUX: "#8B1A1A",
  NOIR_PROFOND: "#0D0D0D",
  PARCHEMIN: "#F5E6C8",
  GRIS_ENNEMI: "#6B6B6B",
  // S4 : bascule palette or -> bordeaux a partir de la mort de Nandi
  S4_TRANSITION_FRAME: 3225, // = NARRATIVE_BEATS.NANDI_MEURT.startFrame
} as const;
