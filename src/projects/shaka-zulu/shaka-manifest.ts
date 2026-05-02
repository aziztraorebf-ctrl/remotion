// Atlas Shaka Zulu — Scene Manifest
// Source de verite visuelle pour TOUTE la composition.
// Modifier CE fichier pour changer textes, couleurs, positions, labels.
// Les composants Remotion lisent ce manifest — zero valeur hardcodee dans les composants.
//
// Timestamps : derives de ElevenLabs Forced Alignment (shaka-alignment.json, loss 0.244)
// Voir timing.ts pour les frames exactes.

import { SEGMENTS, S2_ACTS, INSERTS, NARRATIVE_BEATS, PALETTE, TRIPLE_SCREEN } from "./timing";

// ─── S0 — Hook ──────────────────────────────────────────────────────────────

export const HOOK_MANIFEST = {
  segment: SEGMENTS.HOOK,

  // Visuel : Shaka plein ecran (PixelLab breathing-idle OU Seedance papercraft — A DECIDER)
  // Option A : PixelLab sprites animation
  pixellab: {
    spritePath: "atlas-shaka-zulu/assets/shaka-mcp/animations/animating-a04dc52d/",
    animationType: "breathing-idle",
    scale: 3.0,
    position: { x: 0.5, y: 0.5 }, // centre ecran
  },

  // Texte hook (2 lignes, apparition sequentielle)
  lines: [
    {
      id: "paria",
      text: "Il est né paria.",
      appearsAtFrame: 0,
      color: PALETTE.PARCHEMIN,
      size: 72,
      weight: "700",
    },
    {
      id: "roi",
      text: "Il est mort roi.",
      appearsAtFrame: 20,
      color: PALETTE.OR,
      size: 72,
      weight: "700",
    },
  ],

  fade: { inDuration: 8, outDuration: 12 },
} as const;

// ─── S1 — Setup géo ─────────────────────────────────────────────────────────

export const S1_GEO_MANIFEST = {
  segment: SEGMENTS.S1_GEO,

  // Carte : globe ortho -> zoom KwaZulu-Natal
  map: {
    globeCenter: { lon: 20.0, lat: -15.0 },
    targetCenter: { lon: 31.0, lat: -28.5 },
    zoomGlobe: 1.2,
    zoomTarget: 6.0,
    zoomTransitionFrames: 60, // 2s de zoom in
    labelKwaZulu: "KwaZulu-Natal",
    labelColor: PALETTE.OR,
  },

  // Insert S1 : chiffre "1 500" geant sur fond noir
  insert: {
    ...INSERTS.S1_NOMBRE_1500,
    background: PALETTE.NOIR_PROFOND,
    lines: [
      {
        id: "nombre",
        text: "1 500",
        size: 180,
        color: PALETTE.OR,
        weight: "700",
        y: 0.42,
        animation: "counter",
        counterTarget: 1500,
        counterDuration: 40,
      },
      {
        id: "label",
        text: "personnes",
        size: 52,
        color: PALETTE.PARCHEMIN,
        weight: "400",
        y: 0.56,
        animation: "fade",
        appearsAtOffset: 15,
      },
    ],
  },

  fade: { inDuration: 10, outDuration: 10 },
} as const;

// ─── S2 — Innovations militaires (Structure 4 actes) ─────────────────────────
// Synthese Aziz + Kimi : pas de triple-screen continu. 3 actes plein ecran +
// triple-screen synthese 9s a la fin pour conclure sur Gqokli Hill.

export const S2_MILITAIRE_MANIFEST = {
  segment: SEGMENTS.S2_MILITAIRE,

  // ── A1 : Iklwa plein ecran (frappe descendante) ──
  a1Iklwa: {
    ...S2_ACTS.A1_IKLWA,
    insert: INSERTS.S2_IKLWA,
    pixellabPath: "atlas-shaka-zulu/inserts/pixellab/iklwa-side.png",
    geminiPath: "atlas-shaka-zulu/inserts/gemini/iklwa-parchemin.png",
    label: "L'iklwa",
    sublabel: "Lance courte — combat rapproché",
    labelColor: PALETTE.OR,
    // Animation Kimi Q3 : frappe descendante rotateZ -45deg sur 30 frames
    strikeAnimation: {
      fromRotation: 0,
      toRotation: -45,
      startFrameOffset: 17,  // relatif au debut de A1
      durationFrames: 30,
    },
    background: PALETTE.NOIR_PROFOND,
  },

  // ── A2 : Bouclier plein ecran (boucle 4 rotations crochet) ──
  a2Bouclier: {
    ...S2_ACTS.A2_BOUCLIER,
    insert: INSERTS.S2_BOUCLIER,
    pixellabPath: "atlas-shaka-zulu/inserts/pixellab/bouclier-front.png",
    geminiPath: "atlas-shaka-zulu/inserts/gemini/bouclier-parchemin.png",
    label: "Le bouclier",
    sublabel: "Arme défensive → offensive",
    labelColor: PALETTE.OR,
    // Animation Kimi Q3 : boucle 4 rotations warrior pour simuler crochet
    crochetAnimation: {
      spritePath: "atlas-shaka-zulu/characters/warrior/rotations/",
      sequence: ["south", "east", "north", "west"] as const,
      framesPerRotation: 8,
      loops: 3,
    },
    background: PALETTE.NOIR_PROFOND,
  },

  // ── A3 : Cornes — warriors marchent en formation sur la carte ──
  a3Cornes: {
    ...S2_ACTS.A3_CORNES,
    label: "Formation des cornes de buffle",
    labelColor: PALETTE.PARCHEMIN,
    // Carte plein ecran avec sprites positionnes via projection d3-geo
    map: {
      center: { lon: 30.7, lat: -28.1 }, // centre sur Gqokli
      zoom: 8.5,
    },
    // Warriors qui se deplacent sur bezier paths (Kimi Q2)
    warriorsFormation: {
      spritePath: "atlas-shaka-zulu/characters/warrior/animations/walking-38346bae/",
      centerWarriors: 4,    // centre fixe (chest)
      flankLeftWarriors: 3, // corne gauche
      flankRightWarriors: 3,// corne droite
      enemyDots: 6,         // points gris au centre (encerclement)
      // Bezier paths SVG pour les flancs (vers l'arriere de l'ennemi)
      flankPaths: {
        left:  "M 200,400 Q 400,200 600,400",   // exemple, a calibrer
        right: "M 1720,400 Q 1520,200 1320,400",
      },
      // Animation : sprites se positionnent via getPointAtLength
      animationDurationFrames: 200,
      startFrameOffset: 60, // demarre 2s apres debut A3
    },
    insertCornes: INSERTS.S2_CORNES_FORMATION,
  },

  // ── A4 : Gqokli Hill + Triple-screen synthese (9s) ──
  a4Synthese: {
    ...S2_ACTS.A4_GQOKLI_SYNTHESE,
    // Premiere partie : carte Gqokli + label + flash 90% (Kimi Q5)
    gqokliHill: {
      ...NARRATIVE_BEATS.GQOKLI_HILL,
      coords: { lon: 30.7, lat: -28.1 },
      label: "Gqokli Hill — 1818",
      labelColor: PALETTE.BORDEAUX,
      markerStyle: "battle" as const,
      // Pulsations radar (Kimi Q1)
      radarPulse: {
        rings: 3,
        ringDelay: 15,        // frames entre chaque ring
        maxRadiusPx: 200,
        color: PALETTE.BORDEAUX,
      },
    },
    // Insert flash "90%" (Kimi Q5) — 1 frame blanc + chiffre pulse
    flash90: {
      ...INSERTS.S2_FLASH_90,
      flashDurationFrames: 1,
      number: "90 %",
      numberColor: PALETTE.BORDEAUX,
      numberSize: 280,
      pulseSequence: [1, 1.2, 1, 1.2, 1],
      pulseDurationFrames: 30,
    },
    // Deuxieme partie : triple-screen synthese (~2.4s en fin de segment)
    // Ton idee originale : iklwa | bouclier | cornes cote a cote, point final visuel
    tripleSynthese: {
      ...INSERTS.S2_TRIPLE_SYNTHESE,
      ...TRIPLE_SCREEN,
      panels: [
        { type: "iklwa-image" as const,    label: "Iklwa" },
        { type: "bouclier-image" as const, label: "Bouclier" },
        { type: "cornes-schema" as const,  label: "Cornes" },
      ],
      panelLabelColor: PALETTE.OR,
    },
  },

  fade: { inDuration: 10, outDuration: 10 },
} as const;

// ─── S3 — Expansion ──────────────────────────────────────────────────────────

export const S3_EXPANSION_MANIFEST = {
  segment: SEGMENTS.S3_EXPANSION,

  // Carte : territoire grandit + fleches Mfecane bezier animees
  map: {
    center: { lon: 31.0, lat: -28.5 },
    zoom: 6.0,
    territoryColor: PALETTE.BORDEAUX,
    territoryOpacity: 0.35,
    arrowColor: PALETTE.OR,
    // Expansion : 1816 -> 1828
    expansionKeyframes: [
      { frame: 0, radiusKm: 50 },      // debut S3
      { frame: 300, radiusKm: 120 },   // milieu
      { frame: 600, radiusKm: 200 },   // apogee ~30 000 km2
    ],
  },

  // Insert : bar chart 1 500 -> 50 000
  insertBarchart: {
    ...INSERTS.S3_BARCHART,
    background: PALETTE.NOIR_PROFOND,
    bars: [
      {
        id: "1816",
        label: "1816",
        value: 1500,
        maxValue: 50000,
        color: PALETTE.OR,
        animateFrom: 0,
        animateDuration: 30,
      },
      {
        id: "1828",
        label: "1828",
        value: 50000,
        maxValue: 50000,
        color: PALETTE.BORDEAUX,
        animateFrom: 40,
        animateDuration: 40,
      },
    ],
    // Ligne % population armée
    statsLine: {
      text: "20 % de la population aux armes — vs 5 % en Europe",
      color: PALETTE.PARCHEMIN,
      size: 38,
      appearsAtOffset: 100,
    },
  },

  // Label territoire final
  territoryLabel: {
    text: "~30 000 km²",
    color: PALETTE.OR,
    size: 52,
    position: { lon: 31.0, lat: -27.5 },
    appearsAtFrame: NARRATIVE_BEATS.CINQUANTE_MILLE.startFrame - SEGMENTS.S3_EXPANSION.startFrame,
  },

  fade: { inDuration: 10, outDuration: 10 },
} as const;

// ─── S4 — Spirale Nandi ───────────────────────────────────────────────────────

export const S4_NANDI_MANIFEST = {
  segment: SEGMENTS.S4_NANDI,

  // Bascule palette : or -> bordeaux progressive (debut a la mort de Nandi)
  paletteTransition: {
    startFrame: NARRATIVE_BEATS.NANDI_MEURT.startFrame - SEGMENTS.S4_NANDI.startFrame,
    durationFrames: 60, // 2s de transition
    fromColor: PALETTE.OR,
    toColor: PALETTE.BORDEAUX,
  },

  // Fond : assombrissement progressif apres mort Nandi
  background: {
    colorBefore: "#1A1208",   // brun tres sombre (chaud)
    colorAfter: "#0D0000",    // noir bordeaux (froid)
    transitionAtFrame: NARRATIVE_BEATS.NANDI_MEURT.startFrame - SEGMENTS.S4_NANDI.startFrame,
  },

  // Insert S4 : "4 000" — compteur sanglant Kimi Q4 (spring lourd)
  insertNombre4000: {
    ...INSERTS.S4_NOMBRE_4000,
    background: "#0D0000",
    lines: [
      {
        id: "nombre",
        text: "4 000",
        size: 220,                  // plus gros (Kimi : "poids physique")
        color: PALETTE.BORDEAUX,
        weight: "700",
        y: 0.38,
        animation: "counter-spring", // counter + spring lourd
        counterTarget: 4000,
        counterDuration: 30,
        // Spring Kimi Q4 : mass 3, damping 15 = sensation poids
        spring: { mass: 3, damping: 15, stiffness: 100 },
        // Drop-shadow rouge sang
        dropShadow: "0 10px 20px rgba(139, 0, 0, 0.8)",
      },
      {
        id: "label",
        text: "Zulus périrent",
        size: 48,
        color: PALETTE.PARCHEMIN,
        weight: "400",
        y: 0.55,
        animation: "fade",
        appearsAtOffset: 15,
      },
      {
        id: "source",
        text: "Source : James Stuart Archive",
        size: 28,
        color: "#9E9E9E",
        weight: "300",
        y: 0.72,
        animation: "fade",
        appearsAtOffset: 30,
      },
    ],
  },

  // [VAGUE 2] Fracture de la carte a la mort de Nandi (Kimi Q4)
  // A prototyper sur mini-render avant integration finale.
  fractureCarte: {
    enabled: false, // VAGUE 2
    triggerFrame: NARRATIVE_BEATS.NANDI_MEURT.startFrame,
    durationFrames: 15,
    // Approche : 2 paths SVG (normal + jagged) interpoles via d3.interpolate
    // + filter SVG displacement avec noise anime
    notes: "Tester avec d3.interpolate sur paths simples avant prod",
  },

  // [VAGUE 2] Nandi spectre sur la carte (Kimi Q2)
  nandiSpectre: {
    enabled: false, // VAGUE 2
    triggerFrame: NARRATIVE_BEATS.NANDI_MEURT.startFrame + 60, // 2s apres mort
    durationFrames: 90, // 3s
    // Sprite a generer via PixelLab create_character (femme age mur, tenue Zulu)
    spritePath: "atlas-shaka-zulu/characters/nandi/", // a creer
    position: { lon: 31.0, lat: -27.5 }, // nord KwaZulu (origine clan)
    opacityPeak: 0.5,
    blendMode: "screen" as const,
  },

  // [VAGUE 3] Date 22 sept 1828 calligraphie SVG (Kimi Q5)
  dateAssassinat: {
    enabled: false, // VAGUE 3
    triggerS: 132.540, // "Le vingt-deux septembre"
    durationFrames: 60, // 2s
    text: "22 septembre 1828",
    color: "#A88A3D", // or terni
    fontFamily: "Cinzel", // calligraphie
    background: "#000000",
    strokeAnimation: true, // stroke-dashoffset
  },

  // Texte "pour n'avoir pas pleuré assez fort"
  dramaLine: {
    text: "Pour n'avoir pas pleuré assez fort.",
    appearsAtS: 122.680, // mot "assez"
    color: PALETTE.BORDEAUX,
    size: 52,
    weight: "700",
    position: { y: 0.82 },
  },

  fade: { inDuration: 10, outDuration: 15 },
} as const;

// ─── S5 — CTA ────────────────────────────────────────────────────────────────

export const S5_CTA_MANIFEST = {
  segment: SEGMENTS.S5_CTA,

  // Cascade : Napoléon / Alexandre / Shaka (3 lignes, apparition sequentielle)
  cascade: [
    {
      id: "napoleon",
      insert: INSERTS.S5_CASCADE_NAPOLEON,
      text: "Napoléon",
      color: "#9E9E9E",   // gris
      size: 72,
      strikethrough: false,
    },
    {
      id: "alexandre",
      insert: INSERTS.S5_CASCADE_ALEXANDRE,
      text: "Alexandre",
      color: "#9E9E9E",   // gris
      size: 72,
      strikethrough: false,
    },
    {
      id: "shaka",
      insert: INSERTS.S5_CASCADE_SHAKA,
      text: "Shaka ?",
      color: PALETTE.OR,
      size: 88,
      weight: "700",
      emphasis: true,
    },
  ],

  // Fond : carte Afrique silhouette (meme pattern Mansa Moussa CTA)
  background: {
    type: "africa-map" as const,
    fillColor: PALETTE.BORDEAUX,
    opacity: 0.15,
  },

  // Call to action texte
  cta: {
    text: "Abonne-toi",
    appearsAtS: 148.100,
    color: PALETTE.OR,
    size: 64,
    weight: "700",
    sublabel: "Il y en a d'autres comme lui.",
    sublabelColor: PALETTE.PARCHEMIN,
  },

  fade: { inDuration: 10, outDuration: 20 },
} as const;

// ─── Helpers transverses (carte vivante — Kimi Q1) ─────────────────────────

// [VAGUE 2] Parallaxe 3 couches sur la carte (S1, S3, S5)
export const MAP_PARALLAX = {
  enabled: false, // VAGUE 2
  layers: [
    { id: "relief",     speedPxPerFrame: 0.2 },
    { id: "rivieres",   speedPxPerFrame: 0.5 },
    { id: "frontieres", speedPxPerFrame: 0.8 },
  ],
} as const;

// [VAGUE 2] Pattern hatch qui derive sur les territoires
export const MAP_PATTERN_DRIFT = {
  enabled: false, // VAGUE 2
  rotationDegPerFrame: 0.05,
  patternId: "hatch",
} as const;

// [VAGUE 3] Micro-interrupts S1
export const S1_MICRO_INTERRUPTS = {
  enabled: false, // VAGUE 3
  // "Deux fois debout" — barre de vie RPG pixel art (Kimi Q5)
  lifeBar: {
    triggerS: 19.580, // "debout"
    durationFrames: 60,
    hearts: 2,
  },
} as const;

// ─── Export unique ────────────────────────────────────────────────────────────

export const SHAKA_MANIFEST = {
  hook: HOOK_MANIFEST,
  s1Geo: S1_GEO_MANIFEST,
  s2Militaire: S2_MILITAIRE_MANIFEST,
  s3Expansion: S3_EXPANSION_MANIFEST,
  s4Nandi: S4_NANDI_MANIFEST,
  s5Cta: S5_CTA_MANIFEST,
  // Helpers transverses
  mapParallax: MAP_PARALLAX,
  mapPatternDrift: MAP_PATTERN_DRIFT,
  s1MicroInterrupts: S1_MICRO_INTERRUPTS,
} as const;
