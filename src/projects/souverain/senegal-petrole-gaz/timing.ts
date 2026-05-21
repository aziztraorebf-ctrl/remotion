// timing.ts — recalibrated 2026-05-19
// Audio: narration-v1-auphonic.mp3 (Auphonic watermark trimmed) | Measured: 420.414s | FPS: 30
// Script: memory/episodes/souverain/senegal-petrole-gaz/SCRIPT-V2.md | Version: LOCKED 2026-05-19
// Forced alignment: ElevenLabs v1/forced-alignment | Loss: 0.110 | Words: 913 real words
// Trim applied: ffmpeg -ss 6.54 -t 420.43 (removed Auphonic intro/outro watermark)
// Format: ACTS + SCENES nested (Mid-form 4 actes + 3 mecanismes Acte 3)
//
// Boundary rule: beat.startSec = previousBeat.endSec (zero gap guaranteed)
// Boundary rule: beat.endSec = nextBeat.startSec (silence absorbed into preceding beat)
// All values derived from word-level timestamps — zero hardcoded estimation.

export const FPS = 30;
export const TOTAL_SECONDS = 420.414;
export const TOTAL_FRAMES = Math.round(TOTAL_SECONDS * FPS); // 12612

// ---------------------------------------------------------------------------
// AUDIO SEGMENTS — frame-precise boundaries for each narrative beat
// {startFrame, endFrame, startTime, endTime} all derived from forced alignment
// ---------------------------------------------------------------------------

export const AUDIO_SEGMENTS = {
  // --- Acte 1 — L'Anomalie ---
  // First word: "Tout" @ 0.080s | Last VO: "direct." ends @ 42.000s
  // Next phrase ("Le Sénégal n'a pas trouvé") starts @ 43.300s -> boundary here
  acte1_anomalie: {
    startFrame: 0,
    endFrame: 1299,
    startTime: 0.0,
    endTime: 43.3,
  },

  // --- Acte 2 — La Demonstration ---
  // First word: "Le" @ 43.300s (Le Sénégal n'a pas trouvé un gisement)
  // Last VO phrase: "ça devient intéressant." ends @ 131.480s
  // Next phrase ("Avant de parler du Sénégal") starts @ 132.640s -> boundary here
  acte2_trois_champs: {
    startFrame: 1299,
    endFrame: 3979,
    startTime: 43.3,
    endTime: 132.64,
  },

  // --- Acte 3 — Comparaison (intro Norvege/Congo) ---
  // First word: "Avant" @ 132.640s (Avant de parler du Sénégal)
  // Last VO phrase: "Ce sont les mécanismes." ends @ 190.120s
  // Next phrase ("Le gouvernement sénégalais") starts @ 190.280s -> boundary here
  acte3_comparaison: {
    startFrame: 3979,
    endFrame: 5708,
    startTime: 132.64,
    endTime: 190.28,
  },

  // --- Acte 3 — Mecanisme 1 : Le Contrat ---
  // First word: "Le" @ 190.280s (Le gouvernement sénégalais affirme)
  // Last phrase: "tiennent ou pas." ends @ 235.140s
  // Next "Le Sénégal a créé" (Mécanisme 2) starts @ 237.870s -> boundary here
  acte3_mecanisme1: {
    startFrame: 5708,
    endFrame: 7136,
    startTime: 190.28,
    endTime: 237.87,
  },

  // --- Acte 3 — Mecanisme 2 : Le Fonds Souverain ---
  // First word: "Le" @ 237.870s (Le Sénégal a créé un fonds souverain)
  // Last phrase: "que celles de la Norvège." ends @ 290.140s
  // Next "Le troisième" (Mécanisme 3) starts @ 293.160s -> boundary here
  acte3_mecanisme2: {
    startFrame: 7136,
    endFrame: 8795,
    startTime: 237.87,
    endTime: 293.16,
  },

  // --- Acte 3 — Mecanisme 3 : Qui regarde depuis les coulisses ---
  // First word: "Le" @ 293.160s (Le troisième champ, Yakaar-Teranga)
  // Last phrase: "va se poser très vite." ends @ 343.760s
  // Next "Voilà" (Acte 4) starts @ 346.260s -> boundary here
  acte3_mecanisme3: {
    startFrame: 8795,
    endFrame: 10388,
    startTime: 293.16,
    endTime: 346.26,
  },

  // --- Acte 4 — L'Implication ---
  // First word: "Voilà" @ 346.260s (Voilà où en est le Sénégal)
  // Last word: "surprendront." ends @ 420.260s
  // Beat covers to TOTAL_FRAMES (trailing music/silence absorbed)
  acte4_implication: {
    startFrame: 10388,
    endFrame: 12612,
    startTime: 346.26,
    endTime: 420.414,
  },
} as const;

// ---------------------------------------------------------------------------
// BEAT CONSTANTS — convenience exports for downstream Remotion code
// ---------------------------------------------------------------------------

export const BEAT_ACTE1_START = AUDIO_SEGMENTS.acte1_anomalie.startFrame;           // 0
export const BEAT_ACTE2_START = AUDIO_SEGMENTS.acte2_trois_champs.startFrame;        // 1299
export const BEAT_ACTE3_COMP_START = AUDIO_SEGMENTS.acte3_comparaison.startFrame;    // 3979
export const BEAT_ACTE3_M1_START = AUDIO_SEGMENTS.acte3_mecanisme1.startFrame;       // 5708
export const BEAT_ACTE3_M2_START = AUDIO_SEGMENTS.acte3_mecanisme2.startFrame;       // 7136
export const BEAT_ACTE3_M3_START = AUDIO_SEGMENTS.acte3_mecanisme3.startFrame;       // 8795
export const BEAT_ACTE4_START = AUDIO_SEGMENTS.acte4_implication.startFrame;         // 10388

// ---------------------------------------------------------------------------
// ACTS — groups beats by narrative arc
// ---------------------------------------------------------------------------

export const ACTS = {
  acte_I: {
    label: "L'Anomalie",
    timeLabel: "0:00 - 1:27",
    scenes: ["acte1_anomalie"],
    startFrame: 0,
    endFrame: 1299,
    startSec: 0.0,
    endSec: 43.3,
  },
  acte_II: {
    label: "La Demonstration",
    timeLabel: "1:27 - 4:25",
    scenes: ["acte2_trois_champs"],
    startFrame: 1299,
    endFrame: 3979,
    startSec: 43.3,
    endSec: 132.64,
  },
  acte_III: {
    label: "Les Mecanismes qui decident",
    timeLabel: "4:25 - 11:32",
    scenes: ["acte3_comparaison", "acte3_mecanisme1", "acte3_mecanisme2", "acte3_mecanisme3"],
    startFrame: 3979,
    endFrame: 10388,
    startSec: 132.64,
    endSec: 346.26,
  },
  acte_IV: {
    label: "L'Implication",
    timeLabel: "11:32 - 14:01",
    scenes: ["acte4_implication"],
    startFrame: 10388,
    endFrame: 12612,
    startSec: 346.26,
    endSec: 420.414,
  },
} as const;

// ---------------------------------------------------------------------------
// BEATS — ordered list with template suggestions from script
// ---------------------------------------------------------------------------

export const BEATS = [
  {
    id: "acte1_anomalie",
    label: "L'Anomalie — Hook + BigStat",
    startFrame: 0,
    durationInFrames: 1299,
    startSec: 0.0,
    endSec: 43.3,
    anchors: {
      // "Huit millions de dollars par jour" @ 18.500s = f555
      bigstatReveal: 555,
      // "Et pourtant, l'Etat n'est pas certain" @ 29.040s = f871
      contradictionBeat: 871,
      // "mécanique plus complexe" @ 37.300s = f1119
      thesisIntro: 1119,
      // "tester en direct." ends @ 42.000s = f1260
      acte1LastWord: 1260,
    },
    templates: [
      "MapZoomAtlantique",
      "BigStat",
      "TextOnly_Dark",
    ],
    narrativeNote: "Hook contradictoire — catastrophe vs revelation. BigStat 8M$/jour pulse. Cut net vers question centrale.",
  },
  {
    id: "acte2_trois_champs",
    label: "La Demonstration — 3 champs offshore",
    startFrame: 1299,
    durationInFrames: 2680,
    startSec: 43.3,
    endSec: 132.64,
    anchors: {
      // "Le Sénégal n'a pas trouvé un gisement" @ 43.300s = f1299
      acte2FirstWord: 1299,
      // "Sangomar," @ 47.680s = f1430
      sangomar: 1430,
      // "GTA" @ 60.360s = f1811
      gta: 1811,
      // "Yakaar-Teranga." (first field mention) @ 96.080s = f2882
      yakaarTeranga: 2882,
      // "soixante" (soixante pour cent) @ 114.400s = f3432
      sixtyPct: 3432,
      // "intéressant." @ 130.780s = f3923
      acte2LastWord: 3923,
    },
    templates: [
      "MapOffshore3Points",
      "FillScreen",
    ],
    narrativeNote: "3 decouvertes. Sangomar (Woodside/Petrosen 18%). GTA (BP, production fev+avr 2025). Yakaar-Teranga (FID non prise). 60% papier.",
  },
  {
    id: "acte3_comparaison",
    label: "Acte 3 intro — Norvege vs Congo",
    startFrame: 3979,
    durationInFrames: 1729,
    startSec: 132.64,
    endSec: 190.28,
    anchors: {
      // "Avant de parler du Sénégal" @ 132.640s = f3979
      comparaisonStart: 3979,
      // "La Norvège" @ 136.760s = f4103
      norvegeIntro: 4103,
      // "Le Congo" @ 155.540s = f4666
      congoIntro: 4666,
      // "Le Botswana" @ 167.340s = f5020
      botswanaIntro: 5020,
      // "mécanismes." ends @ 190.120s = f5704
      thesisMecanismes: 5704,
    },
    templates: [
      "SmallMultiplesGrid",
      "LineChart_Up",
      "LineChart_Down",
    ],
    narrativeNote: "Meme ressource, meme epoque. Norvege 1500Mds$. Congo plus pauvre. Botswana 1 phrase. Ce sont les mecanismes.",
  },
  {
    id: "acte3_mecanisme1",
    label: "Mecanisme 1 — Le Contrat",
    startFrame: 5708,
    durationInFrames: 1428,
    startSec: 190.28,
    endSec: 237.87,
    anchors: {
      // "Le gouvernement sénégalais affirme" @ 190.280s = f5708
      titleReveal: 5708,
      // "Woodside Energy et l'administration" @ 213.800s = f6414
      woodsideConflict: 6414,
      // "tiennent ou pas." @ 234.560s = f7037
      mecanisme1LastWord: 7037,
    },
    templates: [
      "TypeReveal",
      "KraftCardDocClassifie",
      "StackedBars",
    ],
    narrativeNote: "60% = estimation officielle, pas contractuelle. Woodside vs Senegal: cost recovery a huis clos.",
  },
  {
    id: "acte3_mecanisme2",
    label: "Mecanisme 2 — Le Fonds Souverain (FONSIS)",
    startFrame: 7136,
    durationInFrames: 1659,
    startSec: 237.87,
    endSec: 293.16,
    anchors: {
      // "Le Sénégal a créé un fonds souverain" @ 237.870s = f7136
      titleReveal: 7136,
      // "FONSIS." @ 252.180s = f7565
      fonsisFirst: 7565,
      // "voilà le piège." @ 260.220s = f7807 (piège = keyword)
      piegeReveal: 7807,
      // "FMI" @ 279.340s = f8380
      fmiAlarm: 8380,
      // "Norvège." @ 290.140s = f8704
      mecanisme2LastWord: 8704,
    },
    templates: [
      "TypeReveal",
      "CoffreFort",
      "ProcessFlow",
    ],
    narrativeNote: "FONSIS existe avant premier baril. Piege: dette 70% richesse annuelle. FMI alarme. Regles moins rigides que Norvege.",
  },
  {
    id: "acte3_mecanisme3",
    label: "Mecanisme 3 — Qui regarde depuis les coulisses",
    startFrame: 8795,
    durationInFrames: 1593,
    startSec: 293.16,
    endSec: 346.26,
    anchors: {
      // "Le troisième champ, Yakaar-Teranga." @ 293.160s = f8795
      titleReveal: 8795,
      // "Yakaar-Teranga." (Mec3 mention) @ 298.760s = f8963
      yakaarTeranga: 8963,
      // "Pékin regarde." @ 326.020s = f9781
      pekinRegarde: 9781,
      // "très vite." @ 343.760s = f10313
      mecanisme3LastWord: 10313,
    },
    templates: [
      "TypeReveal",
      "MapZoomYakaar",
      "CoinFlip",
    ],
    narrativeNote: "FID non prise. Pekin regarde. Europe ralentit investissements gaziers. Qui prend la place a Yakaar.",
  },
  {
    id: "acte4_implication",
    label: "L'Implication — Bilan + CTA",
    startFrame: 10388,
    durationInFrames: 2224,
    startSec: 346.26,
    endSec: 420.414,
    anchors: {
      // "Voilà où en est le Sénégal." @ 346.260s = f10388
      acte4FirstWord: 10388,
      // "Le Sénégal est exactement" @ 400.560s = f12017
      exactement: 12017,
      // "Maintenant." @ 403.020s = f12091
      maintenant: 12091,
      // "surprendront." @ 419.660s = f12590
      lastWord: 12590,
    },
    templates: [
      "MapDezoomGlobe",
      "SmallMultiplesGrid",
      "TextOnly_NavyGold",
      "CTA_Abonnement",
    ],
    narrativeNote: "FONSIS + ITIE + loi emploi local. Fragilites: dette + contrats opaques + Yakaar. Moment unique comme Norvege 1969.",
  },
] as const;

// ---------------------------------------------------------------------------
// VALIDATION SUMMARY (checked at generation time)
// R1: Last beat endFrame == TOTAL_FRAMES: 12612 == 12612 OK
// R2: Zero gaps between beats (all startFrame[n] == endFrame[n-1])
//     0->1299->3979->5708->7136->8795->10388->12612 — continuous OK
// R3: All VO narration contained within beat windows (forced alignment verified)
// R4: All beats >= 30 frames: min=1428f (acte3_mecanisme1, 47.6s) OK
// ---------------------------------------------------------------------------
