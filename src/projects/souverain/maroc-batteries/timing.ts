// AUTO-GENERATED via ElevenLabs v1/forced-alignment
// Audio: narration-maroc-v3.mp3 | Voice: z3gESu49naEZW8Af2Upm (GeoAfrique V2)
// Generated: 2026-05-30

export const FPS = 30;
export const AUDIO_FILE =
  "/souverain/maroc-batteries/audio/narration-maroc-v3.mp3";
export const TOTAL_DURATION_S = 109.48;
export const TOTAL_FRAMES = Math.round(TOTAL_DURATION_S * FPS); // 3284

// -------------------------------------------------------------------------
// SEGMENTS — boundaries aligned to forced-alignment word timestamps
// -------------------------------------------------------------------------
// beat0  : "Dans deux ans... il y a trois ans."
// beat1  : "Sous le sol marocain... milieu de gamme."
// beat2  : "Pendant des decennies... valeur ajoutee."
// beat3  : "Aujourd'hui, a Kenitra... mi-deux mille vingt-six."
// beat4  : "Pour le Maroc... geographie industrielle."
// beat5  : "Et ca pose une question... dans dix ans ?"
// -------------------------------------------------------------------------

export const SEGMENTS = {
  beat0_hook: {
    startFrame: 4,
    endFrame: 248,
    startS: 0.14,
    endS: 8.279,
    durationS: 8.14,
    label: "Dans deux ans... il y a trois ans.",
  },
  beat1_phosphate: {
    startFrame: 287,
    endFrame: 896,
    startS: 9.579,
    endS: 29.879,
    durationS: 20.3,
    label: "Sous le sol marocain... milieu de gamme.",
  },
  beat2_cailloux: {
    startFrame: 932,
    endFrame: 1300,
    startS: 31.059,
    endS: 43.319,
    durationS: 12.26,
    label: "Pendant des decennies... valeur ajoutee.",
  },
  beat3_acteurs: {
    startFrame: 1342,
    endFrame: 1817,
    startS: 44.719,
    endS: 60.579,
    durationS: 15.86,
    label: "Aujourd'hui, a Kenitra... mi-deux mille vingt-six.",
  },
  beat4_geographie: {
    startFrame: 1819,
    endFrame: 2942,
    startS: 60.639,
    endS: 98.059,
    durationS: 37.42,
    label: "Pour le Maroc... geographie industrielle.",
  },
  beat5_question: {
    startFrame: 2977,
    endFrame: 3284,
    startS: 99.22,
    endS: 109.479,
    durationS: 10.26,
    label: "Et ca pose une question... dans dix ans ?",
  },
} as const;

export type SegmentKey = keyof typeof SEGMENTS;

// -------------------------------------------------------------------------
// WORD-LEVEL timestamps (subset — key anchors per beat for subtitle use)
// -------------------------------------------------------------------------
// Format : [word, startS, endS]
// Full character-level JSON available from ElevenLabs response if needed.

export const WORD_ANCHORS: Record<SegmentKey, [string, number, number][]> = {
  beat0_hook: [
    ["Dans", 0.14, 0.359],
    ["batterie", 1.759, 2.079],
    ["voiture", 2.559, 2.919],
    ["électrique", 3.0, 3.559],
    ["sortira", 3.639, 4.099],
    ["usine", 6.0, 6.359],
    ["trois", 7.799, 8.059],
    ["ans", 8.119, 8.279],
  ],
  beat1_phosphate: [
    ["Sous", 9.579, 9.679],
    ["marocain", 10.199, 11.139],
    ["soixante-dix", 11.599, 12.119],
    ["phosphate", 13.88, 14.479],
    ["équiper", 15.92, 16.44],
    ["deux", 18.76, 18.819],
    ["mille", 18.899, 19.079],
    ["quarante", 19.139, 19.559],
    ["phosphate", 20.879, 21.559],
    ["batteries", 22.819, 23.159],
    ["génération", 23.6, 24.899],
    ["gamme", 29.519, 29.879],
  ],
  beat2_cailloux: [
    ["Pendant", 31.059, 31.319],
    ["décennies", 31.559, 32.079],
    ["Maroc", 32.719, 33.02],
    ["exportait", 33.119, 33.619],
    ["phosphate", 33.819, 34.299],
    ["brut", 34.36, 34.759],
    ["cailloux", 35.639, 36.079],
    ["bas", 37.04, 37.2],
    ["prix", 37.279, 37.68],
    ["transformaient", 39.399, 40.059],
    ["raffinaient", 40.759, 41.299],
    ["encaissaient", 41.819, 42.279],
    ["valeur", 42.439, 42.7],
    ["ajoutée", 42.779, 43.319],
  ],
  beat3_acteurs: [
    ["Aujourd'hui", 44.719, 45.299],
    ["Kénitra", 45.539, 46.159],
    ["gigafactory", 46.84, 47.639],
    ["cent", 47.959, 48.119],
    ["cinquante-six", 48.159, 48.659],
    ["hectares", 48.759, 49.219],
    ["terre", 49.739, 50.159],
    ["Gotion", 51.02, 51.479],
    ["High-Tech", 51.539, 52.199],
    ["chinois", 52.479, 52.979],
    ["Volkswagen", 53.639, 54.439],
    ["quarante", 54.879, 55.159],
    ["actionnaire", 55.659, 56.379],
    ["Démarrage", 57.18, 58.18],
    ["mi-deux", 58.34, 58.579],
    ["mille", 58.659, 58.759],
    ["vingt-six", 58.84, 60.579],
  ],
  beat4_geographie: [
    ["Maroc", 60.939, 61.799],
    ["sortir", 61.899, 62.359],
    ["fournisseur", 63.479, 64.019],
    ["matière", 64.18, 64.519],
    ["première", 64.58, 65.18],
    ["L'OCP", 66.019, 67.08],
    ["géant", 67.36, 67.619],
    ["phosphates", 68.779, 69.979],
    ["fabrique", 70.099, 70.459],
    ["désormais", 70.5, 70.959],
    ["composants", 71.18, 72.059],
    ["batteries", 73.68, 74.18],
    ["l'Europe", 75.459, 76.419],
    ["réduire", 76.559, 76.919],
    ["dépendance", 77.139, 77.639],
    ["Chine", 78.0, 78.379],
    ["délocaliser", 78.72, 79.359],
    ["Volkswagen", 80.5, 81.259],
    ["investit", 81.339, 81.859],
    ["Maroc", 83.36, 83.779],
    ["deux", 84.18, 84.279],
    ["heures", 84.4, 84.559],
    ["bateau", 84.739, 85.019],
    ["Espagne", 85.139, 85.799],
    ["Maroc", 86.86, 87.179],
    ["choisit", 87.339, 87.659],
    ["Chine", 88.36, 88.599],
    ["l'Europe", 88.739, 89.299],
    ["l'endroit", 90.579, 91.22],
    ["fabriquent", 91.86, 92.259],
    ["ensemble", 92.279, 92.839],
    ["diplomatie", 94.5, 95.199],
    ["géographie", 96.559, 97.199],
    ["industrielle", 97.259, 98.059],
  ],
  beat5_question: [
    ["Et", 99.22, 99.279],
    ["question", 99.9, 100.259],
    ["personne", 100.54, 100.979],
    ["formule", 101.18, 101.499],
    ["encore", 101.54, 101.839],
    ["clairement", 101.9, 102.339],
    ["Maroc", 104.04, 104.139],
    ["contrôle", 104.199, 104.599],
    ["phosphate", 105.079, 105.599],
    ["ET", 105.659, 105.939],
    ["l'assemblage", 106.019, 107.319],
    ["fixe", 107.659, 107.919],
    ["prix", 108.159, 108.299],
    ["batterie", 108.599, 108.919],
    ["dix", 109.18, 109.339],
    ["ans", 109.379, 109.459],
  ],
};
