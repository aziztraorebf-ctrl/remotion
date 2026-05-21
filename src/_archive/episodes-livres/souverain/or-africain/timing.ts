// timing.ts — Or Africain v5 (post Perplexity fact-check + Afrique du Sud 2026-05-07)
// Audio Beats 1-3a : narration-or-africain-FINAL.mp3 (master, 0->41.98s used jusqu'au debut Beat 3b)
// Audio Beat 3b v3 : narration-beat3b-v3.mp3 (17.72s, ajout "et meme l'Afrique du Sud" - 6e pays)
// Audio Beat 4 v2  : narration-beat4-v2.mp3  (22.20s, "principale mine d'uranium")
// Audio Beat 5 v2  : narration-beat5-v2.mp3  (9.04s, sans "Le Ghana a signe la loi")
// Audio CTA        : narration-or-africain-cta-v2.mp3 (6.56s)

export const FPS = 30;

// Asset paths
export const NARRATION_PATH =
  "/souverain/or-africain/audio/narration-or-africain-FINAL.mp3";
export const NARRATION_BEAT3B_V3_PATH =
  "/souverain/or-africain/audio/narration-beat3b-v3.mp3";
export const NARRATION_BEAT4_V2_PATH =
  "/souverain/or-africain/audio/narration-beat4-v2.mp3";
export const NARRATION_BEAT5_V2_PATH =
  "/souverain/or-africain/audio/narration-beat5-v2.mp3";
export const NARRATION_CTA_PATH =
  "/souverain/or-africain/audio/narration-or-africain-cta-v2.mp3";
export const MUSIC_PATH =
  "/souverain/or-africain/audio/music-v1.mp3";

// Beat 3b v3 (avec Afrique du Sud) — utilise dans la version Full publiee
export const BEAT3B_V3_AUDIO_S = 17.72;
export const BEAT3B_V3_DURATION_S = 17.92;
export const BEAT3B_V3_DURATION_FRAMES = Math.round(BEAT3B_V3_DURATION_S * FPS); // 538

export const BEAT4_V2_AUDIO_S = 22.20;
export const BEAT4_V2_DURATION_S = 22.40;
export const BEAT4_V2_DURATION_FRAMES = Math.round(BEAT4_V2_DURATION_S * FPS); // 672

export const BEAT5_V2_AUDIO_S = 9.04;
export const BEAT5_V2_DURATION_S = 10.04;
export const BEAT5_V2_DURATION_FRAMES = Math.round(BEAT5_V2_DURATION_S * FPS); // 301

export const CTA_AUDIO_S = 6.56;
export const CTA_DURATION_S = 7.0;
export const CTA_DURATION_FRAMES = Math.round(CTA_DURATION_S * FPS); // 210

// Total Short duration v5 : Beats 1-3a (master 0->41.98s = f0->f1259)
//                          + Beat 3b v3 (17.92s = 538f)  // +57f vs v2
//                          + Beat 4 v2  (22.40s = 672f)
//                          + Beat 5 v2  (10.04s = 301f)
//                          + CTA        (4.00s  = 120f)
//                          = f1259 + 538 + 672 + 301 + 120 = f2890 = 96.33s
export const TOTAL_FRAMES = 1259 + BEAT3B_V3_DURATION_FRAMES + BEAT4_V2_DURATION_FRAMES + BEAT5_V2_DURATION_FRAMES + CTA_DURATION_FRAMES; // 2890
export const TOTAL_SECONDS = TOTAL_FRAMES / FPS; // 96.33s

// Beat boundaries — absolute frames in the Full timeline (v5 with v3 Beat 3b)
const B3B_START = 1259;
const B3B_END   = B3B_START + BEAT3B_V3_DURATION_FRAMES;     // 1797
const B4_START  = B3B_END;                                    // 1797
const B4_END    = B4_START + BEAT4_V2_DURATION_FRAMES;       // 2469
const B5_START  = B4_END;                                     // 2469
const B5_END    = B5_START + BEAT5_V2_DURATION_FRAMES;       // 2770
const CTA_S     = B5_END;                                     // 2770
const CTA_E     = CTA_S + CTA_DURATION_FRAMES;               // 2890

export const BEATS = {
  beat1: {
    startFrame: 0,
    endFrame:   292,
    startSec:   0.000,
    endSec:     9.740,
  },
  beat2: {
    startFrame: 292,
    endFrame:   819,
    startSec:   9.740,
    endSec:     27.300,
  },
  beat3: {
    // Beat 3a uses master (819 -> 1259), Beat 3b uses v2 (1259 -> 1740)
    startFrame: 819,
    endFrame:   B3B_END, // 1740
    startSec:   27.300,
    endSec:     B3B_END / FPS,
  },
  beat4: {
    // Beat 4 v2 (own audio file, 22.40s)
    startFrame: B4_START, // 1740
    endFrame:   B4_END,   // 2412
    startSec:   B4_START / FPS,
    endSec:     B4_END / FPS,
  },
  beat5: {
    // Beat 5 v2
    startFrame: B5_START, // 2412
    endFrame:   B5_END,   // 2713
    startSec:   B5_START / FPS,
    endSec:     B5_END / FPS,
  },
  cta: {
    startFrame: CTA_S, // 2713
    endFrame:   CTA_E, // 2833
    startSec:   CTA_S / FPS,
    endSec:     CTA_E / FPS,
  },
};

// Word-level beat timestamps for animations
export const AUDIO_SEGMENTS = {
  // Beat 1 — Hook (master, ABSOLUTE frames)
  records:  { startFrame: 65,  endFrame: 81 },
  ghana_b1: { startFrame: 222, endFrame: 233 },
  signe_b1: { startFrame: 275, endFrame: 300 },

  // Beat 2 — Contexte (master, ABSOLUTE frames)
  cinq_pct:        { startFrame: 423, endFrame: 440 },
  royalties_b2:    { startFrame: 446, endFrame: 473 },
  multinationales: { startFrame: 631, endFrame: 659 },
  rien:            { startFrame: 809, endFrame: 819 },

  // Beat 3a — Le Fait (master, ABSOLUTE frames, jusqu'a etats_unis qui declenche transition vers Beat 3b)
  cinq_mille_b3:  { startFrame: 946,  endFrame: 963 },
  premiere_fois:  { startFrame: 998,  endFrame: 1008 },
  progressives:   { startFrame: 1084, endFrame: 1148 },
  douze_pct:      { startFrame: 1192, endFrame: 1211 },
  etats_unis:     { startFrame: 1259, endFrame: 1271 },
  // Note : etats_unis.startFrame == B3B_START, juste un marqueur d'handoff.

  // Beat 3b v3 — La Pression (RELATIVE frames depuis B3B_START=1259)
  // Audio narration-beat3b-v3.mp3 (17.72s, 538 frames pad) — INCLUT Afrique du Sud
  present_doc: {
    // "présentent un document conjoint" -> 7.179s rel
    startFrame: 215,
    endFrame:   229,
  },
  ghaneen: {
    // "...au gouvernement ghanéen." -> 9.679s -> 10.119s rel
    startFrame: 290,
    endFrame:   304,
  },
  investissements: {
    // "Cette loi menace nos investissements." -> 14.559s -> 15.239s rel
    startFrame: 437,
    endFrame:   457,
  },
  signe_b3: {
    // "Le Ghana a signé quand même." -> 17.000s -> 17.719s rel
    startFrame: 510,
    endFrame:   532,
  },

  // Beat 4 v2 — Le Twist (RELATIVE frames depuis B4_START=1740)
  // Audio narration-beat4-v2.mp3 (22.20s, 672 frames pad)
  cas_isole: {
    // "n'est pas un cas isolé." -> 1.579s -> 1.979s
    startFrame: 47,
    endFrame:   59,
  },
  mali: {
    // "Le Mali" -> 7.159s -> 7.440s
    startFrame: 215,
    endFrame:   223,
  },
  barrick: {
    // "Barrick Mining" -> 9.179s -> 10.119s
    startFrame: 275,
    endFrame:   304,
  },
  quatre_cent_millions: {
    // "quatre cent trente millions de dollars" -> 10.679s -> 12.480s
    startFrame: 320,
    endFrame:   374,
  },
  burkina: {
    // "Le Burkina Faso" -> 13.579s -> 14.539s
    startFrame: 407,
    endFrame:   436,
  },
  niger: {
    // "Le Niger" -> 16.799s -> 17.299s
    startFrame: 504,
    endFrame:   519,
  },
  uranium: {
    // "principale mine d'uranium." -> 18.440s -> 20.099s
    startFrame: 553,
    endFrame:   603,
  },
  quatre_pays: {
    // "Quatre pays." -> 20.239s -> 21.260s
    startFrame: 607,
    endFrame:   638,
  },
  signal: {
    // "Un même signal." -> 21.319s -> 22.200s
    startFrame: 640,
    endFrame:   666,
  },

  // Beat 5 v2 — Verdict (RELATIVE frames depuis B5_START)
  afrique_change: { startFrame: 4,   endFrame: 43 },
  sous_sol:       { startFrame: 90,  endFrame: 107 },
  discretement:   { startFrame: 155, endFrame: 180 },
  parle:          { startFrame: 226, endFrame: 270 },

  // CTA — RELATIVE frames depuis CTA_S
  abonne_toi: { startFrame: 100, endFrame: 118 },
};
