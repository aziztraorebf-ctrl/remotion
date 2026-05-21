// Timing Mansa Moussa V2 - integration des 3 inserts dataviz hors-carte
// Strategie : audio narration v3 (81.04s) joue en continu MAIS pause/duck pendant inserts
// Total final visee : ~110-115s (81s audio + ~30s inserts ducktes)
//
// Inserts ducktent la narration via :
//   <Audio startFrom={...} endAt={...} />  AVANT insert
//   [INSERT VISUAL FRAMES]                  pendant insert
//   <Audio startFrom={...} />               APRES insert (reprise narration)
//
// Source forced-alignment : out/atlas-mansa-moussa/narration-v3-alignment.json

const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);

// === DUREE DES INSERTS (peut etre ajustee) ===
export const INSERT_DURATION_FRAMES = sec(10); // 10s par insert (validee Aziz)

// === BEATS ORIGINAUX (narration uniquement) — depuis timing-mansa-moussa.ts ===
export const NARR = {
  start: 0,
  particulesOrStart: sec(0.7),
  douzeAnsHook: sec(2.88),
  maliAppears: sec(4.02),
  empireSpread: sec(11.22),
  secretReveal: sec(15.70),
  moitieOrFirst: sec(18.94),
  moitieSerious: sec(22.04),
  tombouctouAppears: sec(23.28),
  sankoreAppears: sec(27.76),
  climaxPivot: sec(36.10),
  douzeCouronnement: sec(37.62),
  couronnement: sec(38.64),
  mecqueDeparture: sec(40.50),
  mecqueWord: sec(41.46),
  soixanteHommes: sec(43.30), // ajuste -0.16s (Iter2 fix)
  douzeMille: sec(45.00),
  chameaux: sec(47.52),
  caireArrival: sec(54.76),
  caireEffondre: sec(57.00),
  douzeAnsChute: sec(58.68),
  unSeulHomme: sec(63.18),
  continentEffondre: sec(64.90),
  mansaReveal: sec(67.84),
  demandeQuestion: sec(70.20),
  rockefeller: sec(73.94),
  bezos: sec(75.08),
  musk: sec(76.08),
  pourtantPivot: sec(77.58),
  mansaFinal: sec(80.14),
  end: sec(81.04),
} as const;

// === PLACEMENT DES INSERTS DANS LA NARRATION ===
// Insert #1 PIE CHART : declenche apres "la moitie." [serious 22.04s]
//   -> narration pause de 22.5s a 22.5s+10s, scene continue ensuite a 22.5s relatif
// Insert #2 BAR CHART : declenche apres "quatre-vingts chameaux" 47.52s + 1s = 48.52s
//   -> narration pause, scene continue a 48.52s relatif
// Insert #3 LINE CHART : declenche apres "le prix de l'or chute" 58.68s + 1s = 59.68s
//   -> narration pause, scene continue a 59.68s relatif

// === SCENE BOUNDARIES (final timeline avec inserts ducktes) ===
// Calcul : on AJOUTE INSERT_DURATION_FRAMES a la timeline VISUELLE quand insert est actif
// La narration audio reprend EXACTEMENT au timestamp original APRES l'insert

// Triggers recales sur vraies fins de phrases (Whisper word-level alignment)
// Avant : insert 2 coupait en pleine phrase "chameaux qui portent chacun cent cinquante kilos d'or pur"
// Avant : insert 3 coupait en pleine phrase "le prix de l'or chute dans toute la Mediterranee"
const INSERT1_TRIGGER_NARR_FRAME = sec(22.7); // apres "la moitie." [serious] (mot fini a 22.62s)
const INSERT2_TRIGGER_NARR_FRAME = sec(51.3); // apres "...kilos d'or pur." (phrase finit a 51.04s)
const INSERT3_TRIGGER_NARR_FRAME = sec(62.5); // apres "...dans toute la Mediterranee." (phrase finit a 62.28s)

// === FINAL VIDEO TIMELINE (avec offsets cumulatifs) ===
// final_visual_frame = narr_frame + (n_inserts_passed * INSERT_DURATION_FRAMES)

const offsetForNarrFrame = (narrFrame: number): number => {
  let offset = 0;
  if (narrFrame > INSERT1_TRIGGER_NARR_FRAME) offset += INSERT_DURATION_FRAMES;
  if (narrFrame > INSERT2_TRIGGER_NARR_FRAME) offset += INSERT_DURATION_FRAMES;
  if (narrFrame > INSERT3_TRIGGER_NARR_FRAME) offset += INSERT_DURATION_FRAMES;
  return offset;
};

// Convert narration frame -> final visual frame
export const narrToVisual = (narrFrame: number): number =>
  narrFrame + offsetForNarrFrame(narrFrame);

// === T : final visual frames pour tous les beats ===
export const T = {
  // Scene 0 - Hook (0-4s)
  start: narrToVisual(NARR.start),
  particulesOrStart: narrToVisual(NARR.particulesOrStart),
  douzeAnsHook: narrToVisual(NARR.douzeAnsHook),

  // Scene 1 - Setup (4-16s)
  maliAppears: narrToVisual(NARR.maliAppears),
  empireSpread: narrToVisual(NARR.empireSpread),
  secretReveal: narrToVisual(NARR.secretReveal),

  // Scene 2 - Densite (16-22.5s narration, then INSERT 1, then continue)
  moitieOrFirst: narrToVisual(NARR.moitieOrFirst),
  moitieSerious: narrToVisual(NARR.moitieSerious),

  // INSERT 1 PIE CHART (10s)
  insert1Start: narrToVisual(INSERT1_TRIGGER_NARR_FRAME),
  insert1End: narrToVisual(INSERT1_TRIGGER_NARR_FRAME) + INSERT_DURATION_FRAMES,

  // Scene 2 cont. (22.5s narration)
  tombouctouAppears: narrToVisual(NARR.tombouctouAppears),
  sankoreAppears: narrToVisual(NARR.sankoreAppears),

  // Scene 3 - Climax Hadj (34-48.52s)
  climaxPivot: narrToVisual(NARR.climaxPivot),
  douzeCouronnement: narrToVisual(NARR.douzeCouronnement),
  couronnement: narrToVisual(NARR.couronnement),
  mecqueDeparture: narrToVisual(NARR.mecqueDeparture),
  mecqueWord: narrToVisual(NARR.mecqueWord),
  soixanteHommes: narrToVisual(NARR.soixanteHommes),
  douzeMille: narrToVisual(NARR.douzeMille),
  chameaux: narrToVisual(NARR.chameaux),

  // INSERT 2 BAR CHART (10s)
  insert2Start: narrToVisual(INSERT2_TRIGGER_NARR_FRAME),
  insert2End: narrToVisual(INSERT2_TRIGGER_NARR_FRAME) + INSERT_DURATION_FRAMES,

  // Scene 4 - Consequence (50-59.68s)
  caireArrival: narrToVisual(NARR.caireArrival),
  caireEffondre: narrToVisual(NARR.caireEffondre),
  douzeAnsChute: narrToVisual(NARR.douzeAnsChute),

  // INSERT 3 LINE CHART (10s)
  insert3Start: narrToVisual(INSERT3_TRIGGER_NARR_FRAME),
  insert3End: narrToVisual(INSERT3_TRIGGER_NARR_FRAME) + INSERT_DURATION_FRAMES,

  // Scene 4 cont. + Scene 5 CTA
  unSeulHomme: narrToVisual(NARR.unSeulHomme),
  continentEffondre: narrToVisual(NARR.continentEffondre),
  mansaReveal: narrToVisual(NARR.mansaReveal),
  demandeQuestion: narrToVisual(NARR.demandeQuestion),
  rockefeller: narrToVisual(NARR.rockefeller),
  bezos: narrToVisual(NARR.bezos),
  musk: narrToVisual(NARR.musk),
  pourtantPivot: narrToVisual(NARR.pourtantPivot),
  mansaFinal: narrToVisual(NARR.mansaFinal),
  end: narrToVisual(NARR.end),
} as const;

const CTA_CHAINE_FRAMES = Math.round(9.75 * FPS); // 293 frames (atlas-cta-narration-v1.mp3)
export const CTA_CHAINE_START = T.end + sec(0.4); // 0.4s overlap depuis fin narration
export const TOTAL_DURATION_FRAMES = CTA_CHAINE_START + CTA_CHAINE_FRAMES;
export const TOTAL_DURATION_SECONDS = TOTAL_DURATION_FRAMES / FPS;

// === SCENE BOUNDARIES (visual frames) ===
export const SCENE = {
  hookStart: T.start,
  hookEnd: T.maliAppears,
  s1Start: T.maliAppears,
  s1End: T.moitieOrFirst,
  s2Start: T.moitieOrFirst,
  s2End: T.climaxPivot, // includes INSERT1
  s3Start: T.climaxPivot,
  s3End: T.caireArrival, // includes INSERT2
  s4Start: T.caireArrival,
  s4End: T.mansaReveal, // includes INSERT3
  ctaStart: T.mansaReveal,
  ctaEnd: T.end,
} as const;

// === GEOGRAPHIC COORDINATES ===
export const COORDS = {
  niani: { lon: -8.4, lat: 11.4 },
  tombouctou: { lon: -3.0026, lat: 16.7666 },
  caire: { lon: 31.2357, lat: 30.0444 },
  mecque: { lon: 39.8262, lat: 21.4225 },
  djenne: { lon: -4.5550, lat: 13.9054 },
  maliCentroid: { lon: -3.5, lat: 17.0 },
  sahara: { lon: 10, lat: 22 },
} as const;

// === SFX volumes ===
export const SFX_VOLUMES = {
  B_impact: 0.6,
  C_inkdraw: 0.85,
  D_thud: 1.5,
  E_ventSahara: 0.5,
} as const;

export const MUSIC_VOLUME_DEFAULT = 0.04;
export const MUSIC_VOLUME_DUCKED = 0.01;

// === AUDIO TIMING (narration with inserts) ===
// Audio splits in 4 segments separated by inserts:
//   Audio segment 1 : narration[0 -> 22.5s] -> visual[0 -> insert1Start]
//   Audio segment 2 : narration[22.5 -> 48.52s] -> visual[insert1End -> insert2Start]
//   Audio segment 3 : narration[48.52 -> 59.68s] -> visual[insert2End -> insert3Start]
//   Audio segment 4 : narration[59.68 -> 81.04s] -> visual[insert3End -> end]

export const AUDIO_SEGMENTS = [
  {
    visualStartFrame: T.start,
    narrationStartSec: 0,
    narrationEndSec: 22.7,
    durationFrames: T.insert1Start - T.start,
  },
  {
    visualStartFrame: T.insert1End,
    narrationStartSec: 22.7,
    narrationEndSec: 51.3,
    durationFrames: T.insert2Start - T.insert1End,
  },
  {
    visualStartFrame: T.insert2End,
    narrationStartSec: 51.3,
    narrationEndSec: 62.5,
    durationFrames: T.insert3Start - T.insert2End,
  },
  {
    visualStartFrame: T.insert3End,
    narrationStartSec: 62.5,
    narrationEndSec: 81.04,
    durationFrames: TOTAL_DURATION_FRAMES - T.insert3End,
  },
] as const;
