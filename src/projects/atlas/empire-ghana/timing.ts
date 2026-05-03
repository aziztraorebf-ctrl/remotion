// Atlas Empire du Ghana — timing.ts
// Source : ElevenLabs Forced Alignment sur narration-v1.mp3
// Loss globale : 0.094 (excellent — sous 0.10)
// DO NOT EDIT manuellement — timestamps derives de ghana-alignment.ts

export const FPS = 30;
export const AUDIO_DURATION_S = 104.92;
export const AUDIO_DURATION_FRAMES = Math.round(AUDIO_DURATION_S * FPS); // 3148

// ─── Segments principaux (6 beats Atlas) ────────────────────────────────────
// Pivots identifies depuis ghana-alignment.json :
//   Beat 0 hook       : 'Au' @ 0.159s -> 'près.' @ 5.10s
//   Beat 1 setup      : 'Wagadou.' @ 7.019s -> 'secret.' (~22s)
//   Beat 2 densite    : 'À' @ 22.519s -> 'd'esclaves.' (~48s)
//   Beat 3 climax     : 'Mais' @ 48.719s -> 'poids égal.' (~71s)
//   Beat 4 consequence: 'Ce' @ 71.739s -> 'Wagadou.' @ 92.939s (entree CTA)
//   Beat 5 CTA        : 'Wagadou.' @ 92.939s -> 'Wagadou.' @ 104.839s (fin)

export const SEGMENTS = {
  HOOK: {
    label: "Au cœur du Sahara, on troquait du sel contre de l'or. Au gramme près.",
    startS: 0.159,
    endS: 5.100,
    startFrame: 5,
    endFrame: 153,
    durationFrames: 148, // ~4.94s
  },
  S1_SETUP: {
    label: "Wagadou. Aujourd'hui, presque personne... Et il avait un secret.",
    startS: 7.019,
    endS: 22.519,
    startFrame: 211,
    endFrame: 676,
    durationFrames: 465, // ~15.5s (incluant pause naturelle)
  },
  S2_DENSITY: {
    label: "À Taghaza, au nord... d'or, de sel, et d'esclaves.",
    startS: 22.519,
    endS: 48.719,
    startFrame: 676,
    endFrame: 1462,
    durationFrames: 786, // ~26.2s
  },
  S3_BARTER: {
    label: "Mais le moment qui marque l'histoire... presque au poids égal.",
    startS: 48.719,
    endS: 71.739,
    startFrame: 1462,
    endFrame: 2152,
    durationFrames: 690, // ~23s
  },
  S4_CONSEQUENCE: {
    label: "Ce système a tenu cinq cents ans... cendres de Wagadou.",
    startS: 71.739,
    endS: 92.939,
    startFrame: 2152,
    endFrame: 2788,
    durationFrames: 636, // ~21.2s
  },
  S5_CTA: {
    label: "Wagadou. Cinq siècles de commerce mondial... Jamais Wagadou.",
    startS: 92.939,
    endS: 104.839,
    startFrame: 2788,
    endFrame: 3145,
    durationFrames: 357, // ~11.9s
  },
} as const;

export const TOTAL_FRAMES = AUDIO_DURATION_FRAMES;

// ─── Mots-pivots clés (pour synchronisation Pop-up Labels et animations) ────
// Utiles pour Idée 5 (Pop-up Labels Beat 2) et Idée 8 (Compteur Richesse)

export const KEY_WORDS = {
  // Hook
  TROQUAIT: { startS: 1.000, frame: Math.round(1.000 * FPS) }, // approx, ajuster apres test
  GRAMME_PRES: { startS: 4.480, frame: Math.round(4.480 * FPS) },

  // Beat 2 — chiffres a faire pop-up
  TAGHAZA: { startS: 23.5, frame: Math.round(23.5 * FPS) },
  QUATRE_VINGT_DIX: { startS: 28.5, frame: Math.round(28.5 * FPS) },
  BAMBOUK: { startS: 32.0, frame: Math.round(32.0 * FPS) },
  KOUMBI_SALEH: { startS: 39.0, frame: Math.round(39.0 * FPS) },
  VINGT_MILLE: { startS: 41.0, frame: Math.round(41.0 * FPS) },
  MOSQUEE: { startS: 43.5, frame: Math.round(43.5 * FPS) },
  TAXAIT: { startS: 45.0, frame: Math.round(45.0 * FPS) },
  ESCLAVES: { startS: 47.5, frame: Math.round(47.5 * FPS) },

  // Beat 3 — silent barter midpoint
  MARCHANDS_DEPOSAIENT: { startS: 53.0, frame: Math.round(53.0 * FPS) },
  ELOIGNAIENT: { startS: 56.5, frame: Math.round(56.5 * FPS) },
  ACHETEURS: { startS: 58.0, frame: Math.round(58.0 * FPS) },
  POSAIENT_OR: { startS: 60.5, frame: Math.round(60.5 * FPS) },
  SANS_UN_MOT: { startS: 63.5, frame: Math.round(63.5 * FPS) }, // MIDPOINT BALANCE EQUILIBRE
  POIDS_EGAL: { startS: 70.0, frame: Math.round(70.0 * FPS) },

  // Beat 4 — effondrement
  CINQ_CENTS_ANS: { startS: 73.5, frame: Math.round(73.5 * FPS) },
  ALMORAVIDES: { startS: 76.0, frame: Math.round(76.0 * FPS) },
  MILLE_SOIXANTE_SEIZE: { startS: 79.5, frame: Math.round(79.5 * FPS) },
  SECHERESSE: { startS: 82.5, frame: Math.round(82.5 * FPS) },
  EFFONDREMENT: { startS: 84.0, frame: Math.round(84.0 * FPS) },
  SUNDIATA: { startS: 88.5, frame: Math.round(88.5 * FPS) },
  EMPIRE_MALI_NAITRE: { startS: 90.5, frame: Math.round(90.5 * FPS) },

  // Beat 5 — CTA
  CINQ_SIECLES: { startS: 94.5, frame: Math.round(94.5 * FPS) },
  FLORENCE_VENISE: { startS: 101.5, frame: Math.round(101.5 * FPS) },
  JAMAIS_WAGADOU: { startS: 104.0, frame: Math.round(104.0 * FPS) },
} as const;

// ⚠️ NOTE : Les KEY_WORDS sont des estimations rapides.
// Pour la PRODUCTION, recuperer les timestamps exacts depuis ghana-alignment.ts
// via une recherche par mot dans GHANA_ALIGNMENT.

// ─── Helper pour trouver un mot dans alignment ──────────────────────────────
import { GHANA_ALIGNMENT } from "./ghana-alignment";

export function findWord(searchText: string, occurrence: number = 0): { startS: number; endS: number; startFrame: number; endFrame: number } | null {
  const matches = GHANA_ALIGNMENT.filter(w => w.text.trim() === searchText || w.text.trim().startsWith(searchText));
  if (!matches[occurrence]) return null;
  const w = matches[occurrence];
  return {
    startS: w.start,
    endS: w.end,
    startFrame: Math.round(w.start * FPS),
    endFrame: Math.round(w.end * FPS),
  };
}
