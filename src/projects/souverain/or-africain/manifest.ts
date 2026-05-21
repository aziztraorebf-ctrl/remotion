// manifest.ts — Or Africain (serie Souverain)
// Source de verite visuelle. Toute modification visuelle passe par ce fichier.
// Timing derive de timing.ts — ne pas hardcoder de frames ici.

import { BEATS, AUDIO_SEGMENTS, FPS } from "./timing";

export const PALETTE = {
  fond: "#0a0a0a",
  or: "#f5d547",
  orange: "#e89b3c",
  rouge: "#d32f2f",
  blanc: "#ffffff",
  gris: "#4a4a4a",
} as const;

// Liant cross-beats : barre de progression dorée en bas d'écran
export const PROGRESS_BAR = {
  height: 3,         // px
  color: PALETTE.or,
  opacity: 0.6,
  y: 1880,           // px depuis haut (safe zone bas)
};

// Grille ledger financier en fond des frames texte-seul
export const LEDGER_GRID = {
  lineColor: "#ffffff",
  lineOpacity: 0.04,
  lineSpacing: 48,   // px entre chaque ligne horizontale
};

// Overlay grain/texture — asset PNG Gemini a generer
export const GRAIN_OVERLAY = {
  asset: "souverain/or-africain/assets/grain-overlay.png",
  opacity: 0.08,
};

// Source badges (credits data-journalism)
export const SOURCES = {
  bloomberg: "Bloomberg, nov. 2025",
  fmi: "FMI, 2026",
  ghana_law: "Ghana Minerals Income Investment Fund Act, 2026",
};

// ─────────────────────────────────────────────
// BEAT 1 — HOOK (f0 → f292, 0s → 9.74s)
// ─────────────────────────────────────────────
export const BEAT1 = {
  frames: BEATS.beat1,
  fond: PALETTE.fond,
  ledgerGrid: true,
  grainOverlay: true,

  compteur: {
    startValue: 1000,
    endValue: 5589,
    unit: "$/once",
    color: PALETTE.orange,
    glowColor: PALETTE.orange,
    glowIntensity: 0.4,         // proportionnel a la valeur
    fontSizePx: 180,
    label: "PRIX DE L'OR / ONCE",
    labelColor: PALETTE.gris,
    labelFontSizePx: 32,
    // Micro-vibration or sur le chiffre a chaque tranche 1000$
    tickFrames: [0, 30, 60, 90], // frames relatives depuis beat1.startFrame
  },

  recordBadge: {
    text: "RECORD HISTORIQUE",
    color: PALETTE.blanc,
    background: PALETTE.rouge,
    fontSizePx: 42,
    appearsAtFrame: AUDIO_SEGMENTS.records.startFrame,
    // Clignote 1.5s apres apparition
    blinkDurationFrames: 45,
  },

  textLines: [
    {
      text: "Le prix de l'or vient de battre tous les records.",
      appearsAtFrame: 0,
      fontSizePx: 38,
      color: PALETTE.blanc,
    },
    {
      text: "Six gouvernements se sont levés contre le Ghana.",
      appearsAtFrame: AUDIO_SEGMENTS.ghana_b1.startFrame,
      fontSizePx: 38,
      color: PALETTE.blanc,
    },
    {
      text: "Le Ghana a signé quand même.",
      appearsAtFrame: AUDIO_SEGMENTS.signe_b1.startFrame,
      fontSizePx: 38,
      color: PALETTE.or,  // or pour souligner la resistance
    },
  ],

  sfx: {
    tick: "souverain/or-africain/audio/sfx-map-ping.mp3",
    tickVolume: 0.4,
  },

  musique: {
    fadeInStartFrame: 90,  // 3s — kora entre apres le compteur
    fadeInEndFrame: 150,
    targetVolume: 0.6,
  },
};

// ─────────────────────────────────────────────
// BEAT 2 — CONTEXTE (f292 → f819, 9.74s → 27.3s)
// ─────────────────────────────────────────────
export const BEAT2 = {
  frames: BEATS.beat2,
  fond: PALETTE.fond,
  ledgerGrid: true,
  grainOverlay: true,

  graphique: {
    axeX: { debut: 2010, fin: 2026, labelColor: PALETTE.gris, fontSizePx: 28 },
    courbeOr: {
      color: PALETTE.orange,
      strokeWidth: 3,
      label: "+458%",
      labelColor: PALETTE.orange,
      // Animation : se dessine progressivement (stroke-dashoffset)
      animationStartFrame: BEATS.beat2.startFrame,
      animationEndFrame: BEATS.beat2.startFrame + 120,
    },
    courbeRoyalties: {
      color: PALETTE.gris,
      strokeWidth: 2,
      label: "5% — FIXE",
      labelColor: PALETTE.gris,
      // Apparait instantanement (stagnation = fait accompli)
      appearsAtFrame: BEATS.beat2.startFrame + 120,
    },
    // Zone entre les deux courbes = richesse captee multinationales
    fillZone: {
      color: "#1a1a1a",
      opacity: 0.8,
    },
    // Transition vers RIEN. : zone amber se vide progressivement
    drainAnimation: {
      startFrame: AUDIO_SEGMENTS.multinationales.startFrame,
      endFrame: AUDIO_SEGMENTS.rien.startFrame,
      drainColor: PALETTE.orange,
      drainOpacity: 0.3,
    },
  },

  rienMoment: {
    // Plein ecran RIEN. apres drain
    appearsAtFrame: AUDIO_SEGMENTS.rien.startFrame,
    text: "RIEN.",
    fontSizePx: 240,
    color: PALETTE.blanc,
    // Letter-spacing s'etire de 0 a 12px (etire le vide)
    letterSpacingStart: 0,
    letterSpacingEnd: 12,
    animationFrames: 15,
    // Micro-vibration apres stabilisation
    vibrationAmplitude: 1.5,   // px
    vibrationFrequency: 8,     // hz
  },
};

// ─────────────────────────────────────────────
// BEAT 3 — LE FAIT (f819 → f1679, 27.3s → 56s)
// ─────────────────────────────────────────────
export const BEAT3 = {
  frames: BEATS.beat3,

  // Phase A : globe spatial (f819 → f946)
  globeEntree: {
    startFrame: BEATS.beat3.startFrame,
    endFrame: AUDIO_SEGMENTS.cinq_mille_b3.startFrame,
    mapboxStyle: "STYLE_GEO_AFRIQUE_V5",
    cameraStart: { lat: 0, lng: 0, zoom: 0.5, pitch: 45 },  // vue espace
    latitudeLongitudeLines: { color: "#ffffff", opacity: 0.08, spacing: 30 },
  },

  // Insert flash $5000 (1.5s = 45 frames)
  insertCinqMille: {
    startFrame: AUDIO_SEGMENTS.cinq_mille_b3.startFrame,
    endFrame: AUDIO_SEGMENTS.cinq_mille_b3.startFrame + 45,
    text: "$5,000",
    subtext: "pour la première fois de l'histoire",
    color: PALETTE.or,
    fontSizePx: 160,
    fond: PALETTE.fond,
    // Pas de HUD permanent apres ce flash
  },

  // Phase B : zoom vers Ghana (f946 → f1084)
  globeZoomGhana: {
    startFrame: AUDIO_SEGMENTS.cinq_mille_b3.endFrame,
    endFrame: AUDIO_SEGMENTS.progressives.startFrame,
    cameraEnd: { lat: 7.9, lng: -1.0, zoom: 5.5, pitch: 30 },
    ghanaHighlight: { color: PALETTE.or, opacity: 0.5 },
    sfxWhoosh: "souverain/or-africain/audio/sfx-swoosh-zoomin.mp3",
    sfxVolume: 0.5,
    latitudeLongitudeLines: { color: "#ffffff", opacity: 0.08 },
  },

  // Phase C : Ghana stable, arc royalties (f1084 → f1259)
  arcRoyalties: {
    startFrame: AUDIO_SEGMENTS.progressives.startFrame,
    endFrame: AUDIO_SEGMENTS.etats_unis.startFrame,
    badge: {
      text: "5% → 12%",
      fontSizePx: 64,
      color: PALETTE.blanc,
      background: "rgba(0,0,0,0.7)",
      borderRadius: 12,
    },
  },

  // Phase D : drapeaux cascade (f1259 → f1651)
  drapeaux: {
    startFrame: AUDIO_SEGMENTS.etats_unis.startFrame,
    endFrame: AUDIO_SEGMENTS.investissements.startFrame,
    staggerFrames: 9,  // 0.3s entre chaque drapeau
    pays: [
      // Descriptions visuelles pour eviter drift Gemini vers drapeaux africains
      { nom: "USA", description: "bandes rouges-blanches + carré bleu étoilé haut-gauche" },
      { nom: "UK", description: "Union Jack — croix rouge + diagonales rouges-blanches sur fond bleu" },
      { nom: "Chine", description: "fond rouge uni + grande étoile jaune + 4 petites étoiles jaunes" },
      { nom: "Canada", description: "fond blanc + feuille érable rouge centrée + bandes rouges" },
      { nom: "Australie", description: "fond bleu + Union Jack haut-gauche + étoiles blanches Southern Cross" },
    ],
    // Arcs SVG depuis drapeaux vers Ghana sur le globe
    arcsVersGhana: {
      color: PALETTE.rouge,
      opacity: 0.6,
      strokeWidth: 1.5,
      animationStaggerFrames: 9,
    },
    positionY: 160,  // px depuis haut
    hauteurDrapeauPx: 70,
  },

  // Phase E : plein ecran rouge (f1651 → f1679)
  coupureRouge: {
    startFrame: AUDIO_SEGMENTS.investissements.startFrame,
    endFrame: BEATS.beat3.endFrame,
    fond: PALETTE.rouge,
    ligne1: "N'ALLEZ PAS PLUS LOIN.",
    ligne2: "CETTE LOI MENACE",
    ligne3: "NOS INVESTISSEMENTS.",
    fontSizePx: 76,
    color: PALETTE.blanc,
    guillemets: true,
    // Pas de sous-titres karaoke sur cette frame (le texte IS le message)
    karaoke: false,
    sfxBassRumble: "souverain/or-africain/audio/sfx-swoosh-pullback.mp3",
    sfxVolume: 0.6,
  },
};

// ─────────────────────────────────────────────
// BEAT 4 — LE TWIST (f1679 → f2564, 56s → 85.5s)
// ─────────────────────────────────────────────
export const BEAT4 = {
  frames: BEATS.beat4,
  fond: PALETTE.fond,

  carte: {
    type: "svg-afrique-2d",   // SVG geometrique pur — acceptable
    fondOcean: "#050a1a",
    fondTerre: "#1a1410",
    frontieres: { color: "#333333", width: 0.5 },
    latitudeLongitudeLines: { color: "#ffffff", opacity: 0.05 },
  },

  // Pays s'allument successivement
  paysHighlights: [
    {
      iso: "GH",
      nom: "Ghana",
      color: PALETTE.or,
      appearsAtFrame: BEATS.beat4.startFrame,
      pulse: true,
    },
    {
      iso: "ML",
      nom: "Mali",
      color: PALETTE.orange,
      appearsAtFrame: AUDIO_SEGMENTS.mali.startFrame,
      pulse: true,
      badge: { text: "$430M", fontSizePx: 56, color: PALETTE.blanc },
      source: { text: SOURCES.bloomberg, fontSizePx: 22, color: PALETTE.gris },
    },
    {
      iso: "BF",
      nom: "Burkina Faso",
      color: "#c47a28",
      appearsAtFrame: AUDIO_SEGMENTS.burkina.startFrame,
      pulse: true,
      badge: { text: "Code révisé", fontSizePx: 40, color: PALETTE.blanc },
    },
    {
      iso: "NE",
      nom: "Niger",
      color: "#d4872a",
      appearsAtFrame: AUDIO_SEGMENTS.niger.startFrame,
      pulse: true,
      badge: { text: "100% nationalisé", fontSizePx: 40, color: PALETTE.blanc },
    },
  ],

  // Connexion path SVG courbe entre les 4 pays
  connexionPath: {
    color: PALETTE.blanc,
    opacity: 0.4,
    strokeWidth: 1,
    animationEndFrame: AUDIO_SEGMENTS.quatre_pays.startFrame,
  },

  // Faisceaux lumineux verticaux depuis les pays
  faisceaux: {
    color: PALETTE.or,
    opacity: 0.15,
    heightPercent: 0.35,  // 35% de la hauteur ecran
  },

  // "4 PAYS. UN MÊME SIGNAL."
  compteurPays: {
    appearsAtFrame: AUDIO_SEGMENTS.quatre_pays.startFrame,
    text: "4 PAYS",
    subtext: "UN MÊME SIGNAL",
    fontSizePx: 80,
    subfontSizePx: 36,
    color: PALETTE.or,
    positionX: 80,   // px gauche
    positionY: 1600, // px haut
  },

  sfxGongs: [
    { frame: AUDIO_SEGMENTS.mali.startFrame, asset: "souverain/or-africain/audio/sfx-map-ping.mp3", volume: 0.5 },
    { frame: AUDIO_SEGMENTS.burkina.startFrame, asset: "souverain/or-africain/audio/sfx-map-ping.mp3", volume: 0.6 },
    { frame: AUDIO_SEGMENTS.niger.startFrame, asset: "souverain/or-africain/audio/sfx-map-ping.mp3", volume: 0.7 },
  ],
};

// ─────────────────────────────────────────────
// BEAT 5 V2 — VERDICT (f2564 → f2865, 85.5s → 95.5s, 10.04s)
// V2 : "Le Ghana a signé la loi" SUPPRIMÉ (3e occurrence redondante).
// Audio : narration-beat5-v2.mp3 (9.04s + 1s pad).
// AUDIO_SEGMENTS.afrique_change/discretement/parle sont en frames RELATIVES.
// ─────────────────────────────────────────────
export const BEAT5 = {
  frames: BEATS.beat5,
  fond: PALETTE.fond,
  grainOverlay: true,

  // 3 lignes serif (était 4 dans v1). Frames RELATIVES au début Beat 5.
  lignes: [
    {
      text: "L'Afrique commence à changer les règles",
      subtext: "de son propre sous-sol.",
      appearsAtFrame: AUDIO_SEGMENTS.afrique_change.startFrame, // rel: 4
      fontSizePx: 52,
      fontFamily: "Garamond, Georgia, serif",
      color: PALETTE.blanc,
      textShadow: [
        { color: "rgba(245,213,71,0.12)", blur: 20, x: 0, y: 0 },
        { color: "rgba(0,0,0,0.8)", blur: 4, x: 2, y: 2 },
        { color: "rgba(255,255,255,0.05)", blur: 1, x: -1, y: -1 },
      ],
    },
    {
      text: "Discrètement.",
      appearsAtFrame: AUDIO_SEGMENTS.discretement.startFrame, // rel: 155
      fontSizePx: 64,
      fontFamily: "Garamond, Georgia, serif",
      fontStyle: "italic",
      color: PALETTE.blanc,
      flashColor: PALETTE.rouge,
      flashDurationFrames: 6,
    },
    {
      text: "Sans que personne n'en parle.",
      appearsAtFrame: AUDIO_SEGMENTS.parle.startFrame, // rel: 226
      fontSizePx: 48,
      fontFamily: "Garamond, Georgia, serif",
      color: PALETTE.gris,
    },
  ],

  // Badge closure — boucle avec Beat 1 (compteur $5,589)
  closureBadge: {
    text: "$5,589",
    fontSizePx: 26,
    color: PALETTE.or,
    positionX: 850,  // px gauche depuis bord gauche (1080 - 230 = 850)
    positionY: 160,  // px haut
    opacity: 0.5,
  },

  musique: {
    fadeOutStartFrame: AUDIO_SEGMENTS.discretement.startFrame, // rel: 155
    fadeOutEndFrame: AUDIO_SEGMENTS.parle.endFrame, // rel: 270
    targetVolume: 0,
  },
};

// ─────────────────────────────────────────────
// CTA (f2912 → f3030, 97s → 101s)
// ─────────────────────────────────────────────
export const CTA = {
  frames: BEATS.cta,
  fond: PALETTE.fond,
  grainOverlay: true,

  texte: {
    text: "Si la vidéo t'a plu — like, commente, abonne-toi.",
    ligne2: "Le lien de la newsletter est en description.",
    fontSizePx: 44,
    color: PALETTE.blanc,
    appearsAtFrame: BEATS.cta.startFrame,
    fadeInFrames: 15,
  },

  // Scintillement subtil derniere image (impression "a suivre")
  scintillement: {
    startFrame: BEATS.cta.endFrame - 15,
    endFrame: BEATS.cta.endFrame,
    color: PALETTE.or,
    opacity: 0.1,
  },

  musique: { volume: 0 },  // silence complet CTA
};
