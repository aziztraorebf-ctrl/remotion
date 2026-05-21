// AUTO-GENERATED — audio-derived timing, DO NOT hardcode
// Source: narration-zimbabwe-v1-alignment.json
// Audio: narration-zimbabwe-v1.mp3 | Measured: 86.080s | FPS: 30
// Script: Zimbabwe Lithium V5 FINAL | Version: LOCKED 2026-05-12

export const FPS = 30;
export const AUDIO_DURATION_S = 86.080;
export const TOTAL_FRAMES = 2582; // Math.round(86.080 * 30)

// CTA post-verdict : 5s apres la fin de la narration
export const CTA_START_FRAME = 2582;
export const CTA_DURATION_FRAMES = 150; // 5s

// Buffer freeze-frame final 1s (pattern Souverain)
export const FREEZE_FRAME_S = 1.0;
export const TOTAL_DURATION_FRAMES = TOTAL_FRAMES + CTA_DURATION_FRAMES; // 2732

// Helper interne
const sToF = (s: number) => Math.round(s * FPS);

// ─────────────────────────────────────────────────────────────────────────────
// BEATS — 6 beats narratifs alignes sur silences mesures ffmpeg silencedetect
// Silences source: -35dB threshold, 0.5s min duration
// ─────────────────────────────────────────────────────────────────────────────
export const BEATS = {

  // Beat 1 — Hook (0s → 8.98s)
  // "Un pays de seize millions d'habitants a fait bouger le prix..."
  // Silence notable f212-f269 (1.88s) apres la phrase — zoom Zimbabwe continue
  hook: {
    startFrame: sToF(0),
    endFrame:   sToF(8.98),
    startS:     0,
    endS:       8.98,
  },

  // Beat 2 — Tension (8.98s → 19.88s)
  // "Le Zimbabwe. L'un des quatre premiers producteurs mondiaux de lithium..."
  // "...Transformee en Chine en composant de batterie — elle vaut quinze fois plus."
  tension: {
    startFrame: sToF(8.98),
    endFrame:   sToF(19.88),
    startS:     8.98,
    endS:       19.88,
  },

  // Beat 3 — Catalyseur (19.88s → 33.58s)
  // "Le gouvernement decouvre que les entreprises declarent le minerai moins cher..."
  // "...Plus dix pour cent a Shanghai en vingt-quatre heures."
  // Silence f968-f1007 (1.31s) apres "s'affolent" — +10% reste affiche
  catalyseur: {
    startFrame: sToF(19.88),
    endFrame:   sToF(33.58),
    startS:     19.88,
    endS:       33.58,
  },

  // Beat 4 — Transition (33.58s → 38.82s)
  // "Le Zimbabwe a gagne sa bataille industrielle. Mais a quel prix ?"
  // Silence f1148-f1164 (0.55s) — noir tenu, suspension maximale
  transition: {
    startFrame: sToF(33.58),
    endFrame:   sToF(38.82),
    startS:     33.58,
    endS:       38.82,
  },

  // Beat 5 — Demonstration (38.82s → 54.44s)
  // "Deux mois plus tard, la premiere usine de transformation du continent..."
  // "...La Chine a construit exactement ce que le Zimbabwe exigeait."
  // Silence f1587-f1633 (1.51s) — DataCard reste, zoom continue
  demonstration: {
    startFrame: sToF(38.82),
    endFrame:   sToF(54.44),
    startS:     38.82,
    endS:       54.44,
  },

  // Beat 6 — Question ouverte (54.44s → 86.08s)
  // "Le Zimbabwe a force la Chine a jouer selon ses regles..."
  // "...Qui a vraiment gagne ?"
  // Freeze-frame 1s avant fin (f2552) — pattern Souverain
  question: {
    startFrame: sToF(54.44),
    endFrame:   sToF(86.08),
    startS:     54.44,
    endS:       86.08,
  },

} as const;

// ─────────────────────────────────────────────────────────────────────────────
// AUDIO_SEGMENTS — mots-pivots pour animer les overlays dynamiques
// Valeurs = frame de DEBUT du mot (depuis alignment JSON caractere par caractere)
// ─────────────────────────────────────────────────────────────────────────────
export const AUDIO_SEGMENTS = {

  // Beat 1 pivots
  beat1SeizeMillions:   sToF(0.63),    // f18  — "seize millions"
  beat1DixPourCent:     sToF(5.44),    // f163 — "dix pour cent" (dans le hook)

  // Beat 2 pivots
  beat2Lithium:         sToF(12.87),   // f386 — "lithium" — apparition DataCard producteur
  beat2MineraiPartait:  sToF(19.28),   // f578 — "Le minerai partait" — fleche Zimbabwe→Chine
  beat2QuinzeFois:      sToF(31.16),   // f934 — "quinze fois" — BigStat ×15

  // Beat 3 pivots
  beat3Gouvernement:    sToF(33.64),   // f1009 — "gouvernement" — CartoCaspian NOIR switch
  beat3MoinsTaxes:      sToF(39.30),   // f1179 — "moins de taxes" — KraftCard classifie
  beat3Interdit:        sToF(41.42),   // f1242 — "interdit tout export" — barriere SVG
  beat3Shanghai:        sToF(51.42),   // f1542 — "Shanghai" — BigStat +10% rouge

  // Beat 4 pivots
  beat4BatailleIndustrielle: sToF(55.95), // f1678 — "bataille industrielle"
  beat4QuelPrix:        sToF(58.04),   // f1741 — "quel prix" — fondu noir

  // Beat 5 pivots
  beat5UsineTransfo:    sToF(61.56),   // f1846 — "usine de transformation" — BrutalHeadline
  beat5HuayouCobalt:    sToF(66.27),   // f1987 — "Huayou Cobalt" — KraftCard identite
  beat5Chinoise:        sToF(67.63),   // f2028 — "Chinoise." — drapeau chinois pulse

  // Beat 6 pivots
  beat6ZimbabweForce:   sToF(77.82),   // f2334 — "Zimbabwe a force" — texte gauche
  beat6SelonSesRegles:  sToF(79.61),   // f2388 — "selon ses regles" — texte droite
  beat6ABati:           sToF(82.89),   // f2486 — "bati" — split final
  beat6QuiAVraiment:    sToF(84.91),   // f2547 — "Qui a vraiment" — question plein ecran
  beat6FreezeFrame:     sToF(85.08),   // f2552 — freeze 1s avant fin

} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SILENCES — fenetres visuelles obligatoires (mouvement permanent R-SILENCE)
// Chaque silence = beat visuel dedie, jamais ecran statique
// ─────────────────────────────────────────────────────────────────────────────
export const SILENCES = {
  afterHook:        { startFrame: sToF(7.09),  endFrame: sToF(8.98),  durationS: 1.88 }, // zoom Zimbabwe pulse
  afterCatalyseur:  { startFrame: sToF(32.27), endFrame: sToF(33.58), durationS: 1.31 }, // +10% reste affiche
  transitionNoir:   { startFrame: sToF(52.93), endFrame: sToF(54.44), durationS: 1.51 }, // noir tenu "quel prix"
  afterChinoise:    { startFrame: sToF(58.64), endFrame: sToF(59.86), durationS: 1.22 }, // drapeau reste
  beforeQuestion:   { startFrame: sToF(71.72), endFrame: sToF(72.76), durationS: 1.04 }, // pause pre-verdict
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATES — palette par beat (pattern Niger replique)
// ─────────────────────────────────────────────────────────────────────────────
export const TEMPLATES = {
  beat1: 'MapboxGeoAfriqueV5',   // globe → Zimbabwe highlight or
  beat2: 'MapboxGeoAfriqueV5',   // zoom Zimbabwe + fleche export
  beat3: 'CartoCaspianNoir',     // switch noir pour climax ban
  beat4: 'FondNoir',             // suspension maximale
  beat5: 'CartoCaspianSepia',    // mine Arcadia + inserts usine
  beat6: 'FondNoir',             // question finale
} as const;
