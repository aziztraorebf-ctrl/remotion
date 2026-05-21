// AUTO-GENERATED — audio-derived timing, DO NOT hardcode
// Source: narration-niger-uranium-v5-alignment.json | loss: 0.148
// Audio: narration-niger-uranium-v5.mp3 | Measured: 96.04s | FPS: 30
// Script: script-niger-uranium-v5.md | Version: LOCKED 2026-05-09
// Storyboarder: rebuilt from word-level alignment JSON

export const FPS = 30;
export const AUDIO_DURATION_S = 96.04;
export const TOTAL_FRAMES = 2881; // Math.round(96.04 * 30)

// CTA post-verdict : 5s après la fin de la narration
export const CTA_START_FRAME = 2881;
export const CTA_DURATION_FRAMES = 150; // 5s

// Buffer freeze-frame final 1s (pattern Souverain)
export const FREEZE_FRAME_S = 1.0;
export const TOTAL_DURATION_FRAMES = TOTAL_FRAMES + CTA_DURATION_FRAMES; // 3031

// Helper interne — ne pas utiliser en dehors de ce fichier
const sToF = (s: number) => Math.round(s * FPS);

// ─────────────────────────────────────────────────────────────────────────────
// BEATS — 7 beats narratifs alignes mot-par-mot sur le JSON alignment
// Chaque endFrame = endFrame du dernier mot du beat (silence absorbé dans beat)
// ─────────────────────────────────────────────────────────────────────────────
export const BEATS = {
  // Beat 1 — Hook (0–12.3s)
  // "Au Niger, sur le site minier d'Arlit [...] conteste sa responsabilité sur ce site précis."
  // Premier mot: "Au" (start=0.079) | Dernier mot: "précis." (end=12.319)
  hook: {
    startFrame: sToF(0.079),    // 2
    endFrame:   sToF(12.319),   // 370
    startS:     0.079,
    endS:       12.319,
  },

  // Beat 2 — Contexte 53 ans (12.6–27.4s)
  // "Le Niger extrait de l'uranium depuis cinquante-trois ans [...] Orano conteste ces chiffres."
  // Premier mot: "Le" (start=12.619) | Dernier mot: "chiffres." (end=27.399)
  contexte53ans: {
    startFrame: sToF(12.619),   // 379
    endFrame:   sToF(27.399),   // 822
    startS:     12.619,
    endS:       27.399,
  },

  // Beat 3 — Nationalisation juin 2025 (27.9–38.8s)
  // "En juin deux mille vingt-cinq [...] Orano parle d'expropriation."
  // Premier mot: "En" (start=27.920) | Dernier mot: "d'expropriation." (end=38.839)
  nationalisation: {
    startFrame: sToF(27.920),   // 838
    endFrame:   sToF(38.839),   // 1165
    startS:     27.920,
    endS:       38.839,
  },

  // Beat 4 — Bras de fer juridique (39.2–62.1s)
  // "Orano saisit le tribunal arbitral [...] tant que le litige n'est pas résolu."
  // Premier mot: "Orano" (start=39.159) | Dernier mot: "résolu." (end=62.079)
  brasDeFer: {
    startFrame: sToF(39.159),   // 1175
    endFrame:   sToF(62.079),   // 1862
    startS:     39.159,
    endS:       62.079,
  },

  // Beat 5 — Asymétrie quotidienne (62.1–82.5s)
  // "Et pendant ce temps, le Niger doit continuer [...] au Canada, au Kazakhstan."
  // Premier mot: "Et" (start=62.119) | Dernier mot: "Kazakhstan." (end=82.540)
  asymetrie: {
    startFrame: sToF(62.119),   // 1864
    endFrame:   sToF(82.540),   // 2476
    startS:     62.119,
    endS:       82.540,
  },

  // Beat 6 — Climax (82.7–88.7s)
  // "Une guerre d'usure devant les tribunaux [...] pas à Niamey."
  // Premier mot: "Une" (start=82.699) | Dernier mot: "Niamey." (end=88.699)
  climax: {
    startFrame: sToF(82.699),   // 2481
    endFrame:   sToF(88.699),   // 2661
    startS:     82.699,
    endS:       88.699,
  },

  // Beat 7 — Verdict CTA (88.8–96.0s)
  // "Orano a un portefeuille mondial [...] Pour l'instant."
  // Premier mot: "Orano" (start=88.779) | Dernier mot: "l'instant." (end=96.040)
  verdict: {
    startFrame: sToF(88.779),   // 2663
    endFrame:   sToF(96.040),   // 2881
    startS:     88.779,
    endS:       96.040,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// AUDIO_SEGMENTS — mots-pivots pour animer les overlays dynamiques
// Valeurs = frame de DEBUT du mot (startFrame du mot dans le JSON alignment)
// ─────────────────────────────────────────────────────────────────────────────
export const AUDIO_SEGMENTS = {
  // Beat 2 pivots — cascade de pourcentages
  beat2OranoPct:      sToF(17.779),  // 533  — "quatre-vingt-six" (word idx=87)
  beat2NigerPct:      sToF(23.199),  // 696  — "Neuf" virgule deux pour cent (word idx=111)

  // Beat 3 pivots — nodes timeline nationalisation
  beat3DateJuin:      sToF(28.139),  // 844  — "juin" (word idx=136)
  beat3Nationalise:   sToF(30.599),  // 918  — "nationalise" (word idx=150)
  beat3NiameyNode:    sToF(34.759),  // 1043 — "Niamey" parle de souveraineté (word idx=166)
  beat3OranoNode:     sToF(37.020),  // 1111 — "Orano" parle d'expropriation (word idx=176)

  // Beat 4 pivots — timeline juridique + chiffres
  beat4Stock1300:     sToF(44.680),  // 1340 — "Mille" trois cents tonnes (word idx=209)
  beat4Juillet:       sToF(51.399),  // 1542 — "juillet," Moscou (word idx=243)
  beat4Septembre:     sToF(55.779),  // 1673 — "septembre," tribunal interdit (word idx=261)

  // Beat 5 pivots — géographie approvisionnements Orano
  beat5Canada:        sToF(80.799),  // 2424 — "Canada," (word idx=394)
  beat5Kazakhstan:    sToF(81.799),  // 2454 — "Kazakhstan." (word idx=398)
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SECTIONS — alias pour compatibilite avec le code existant (pattern Or Africain)
// DEPRECATED: utiliser BEATS en priorite dans tout nouveau code
// ─────────────────────────────────────────────────────────────────────────────
export const SECTIONS = {
  hook:            BEATS.hook,
  partage:         BEATS.contexte53ans,
  nationalisation: BEATS.nationalisation,
  procedures:      BEATS.brasDeFer,
  etranglement:    BEATS.asymetrie,
  conclusion: {
    startFrame: BEATS.climax.startFrame,
    endFrame:   BEATS.verdict.endFrame,
    startS:     BEATS.climax.startS,
    endS:       BEATS.verdict.endS,
  },
} as const;
