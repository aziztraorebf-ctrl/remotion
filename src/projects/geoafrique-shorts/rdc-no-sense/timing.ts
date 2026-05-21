/**
 * RDC No Sense — Frame timing audio-anchored
 * Source: src/projects/geoafrique-shorts/rdc-no-sense/audio/segments.json
 * Audio: narration-v1.mp3, 178.40s, 5352 frames @30fps
 * Final composition: 5400 frames (180.00s) — 48f silence end for music fade-out
 */

export const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);

export const AUDIO = {
  durationS: 178.4,
  durationF: 5352,
} as const;

export const TOTAL_FRAMES = 5400;
export const FINAL_FADE_FRAMES = 30;

export const AUDIO_SEGMENTS = {
  BEAT1_HOOK:       sec(0.0),     // f 0
  BEAT2_TAILLE:     sec(14.12),   // f 423   "couvre"
  BEAT2_FRANCE:     sec(26.34),   // f 790   "France"
  BEAT3_FRONTIERES: sec(39.44),   // f 1183  "touche"
  BEAT3_NEUF:       sec(42.02),   // f 1260  "Neuf"
  BEAT3_BERLIN:     sec(64.12),   // f 1923  "négociées"
  BEAT4_MONSTRE:    sec(73.38),   // f 2201  "monstre"
  BEAT4_FLEUVE:     sec(74.70),   // f 2240  "fleuve"
  BEAT4_DEBIT:      sec(80.62),   // f 2418  "débit"
  BEAT4_EQUATEUR:   sec(86.24),   // f 2587  "équateur"
  BEAT5_FORET:      sec(99.14),   // f 2974  "Autour"
  BEAT5_HECTARES:   sec(105.98),  // f 3179  "hectares"
  BEAT5_POUMON:     sec(114.56),  // f 3436  "poumon"
  BEAT6_HABITANTS:  sec(121.86),  // f 3655  "habitants"
  BEAT6_LANGUES:    sec(124.24),  // f 3727  "langues"
  BEAT6_KINSHASA:   sec(138.92),  // f 4167  "Kinshasa"
  BEAT7_TRESOR:     sec(146.48),  // f 4394  "trésor"
  BEAT7_COBALT:     sec(150.96),  // f 4528  "cobalt"
  BEAT7_PAUVRE:     sec(166.52),  // f 4995  "pauvres"
  BEAT8_CHUTE:      sec(168.78),  // f 5063  "Voilà"
  END:              TOTAL_FRAMES,
} as const;

export const BEAT_RANGES = {
  BEAT1:  { start: AUDIO_SEGMENTS.BEAT1_HOOK,       end: AUDIO_SEGMENTS.BEAT2_TAILLE },
  BEAT2a: { start: AUDIO_SEGMENTS.BEAT2_TAILLE,     end: AUDIO_SEGMENTS.BEAT2_FRANCE },
  BEAT2b: { start: AUDIO_SEGMENTS.BEAT2_FRANCE,     end: AUDIO_SEGMENTS.BEAT3_FRONTIERES },
  BEAT3a: { start: AUDIO_SEGMENTS.BEAT3_FRONTIERES, end: AUDIO_SEGMENTS.BEAT3_NEUF },
  BEAT3b: { start: AUDIO_SEGMENTS.BEAT3_NEUF,       end: AUDIO_SEGMENTS.BEAT3_BERLIN },
  BEAT3c: { start: AUDIO_SEGMENTS.BEAT3_BERLIN,     end: AUDIO_SEGMENTS.BEAT4_MONSTRE },
  BEAT4a: { start: AUDIO_SEGMENTS.BEAT4_MONSTRE,    end: AUDIO_SEGMENTS.BEAT4_DEBIT },
  BEAT4b: { start: AUDIO_SEGMENTS.BEAT4_DEBIT,      end: AUDIO_SEGMENTS.BEAT5_FORET },
  BEAT5:  { start: AUDIO_SEGMENTS.BEAT5_FORET,      end: AUDIO_SEGMENTS.BEAT6_HABITANTS },
  BEAT6:  { start: AUDIO_SEGMENTS.BEAT6_HABITANTS,  end: AUDIO_SEGMENTS.BEAT7_TRESOR },
  BEAT7:  { start: AUDIO_SEGMENTS.BEAT7_TRESOR,     end: AUDIO_SEGMENTS.BEAT8_CHUTE },
  BEAT8:  { start: AUDIO_SEGMENTS.BEAT8_CHUTE,      end: TOTAL_FRAMES },
} as const;

export type BeatKey = keyof typeof BEAT_RANGES;

export const beatDuration = (key: BeatKey): number =>
  BEAT_RANGES[key].end - BEAT_RANGES[key].start;
