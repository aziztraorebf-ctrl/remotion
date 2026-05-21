// Timing Mansa Moussa - derive frame-precis depuis ElevenLabs forced-alignment
// Source : out/atlas-mansa-moussa/narration-v3-alignment.json
// Duration narration : 81.04s
// FPS = 30

const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);

export const T = {
  // === Scene 0 - Hook (0-4s) ===
  start: 0,
  particulesOrStart: sec(0.7),       // particules or commencent juste avant "s'effondrer" (1.0s)
  douzeAnsHook: sec(2.88),           // "douze ans" Hook

  // === Scene 1 - Setup (4-16s) ===
  maliAppears: sec(4.02),            // "Mali," debut scene 1
  empireSpread: sec(11.22),          // "...empire du Mali. Plus grand que..."
  secretReveal: sec(15.70),          // "Et il a un secret." (curious tag)

  // === Scene 2 - Densite Cesar (16-34s) ===
  moitieOrFirst: sec(18.94),         // "la moitie de l'or qui circule"
  moitieSerious: sec(22.04),         // "La moitie." [serious] - moment cle Q3 Kimi
  tombouctouAppears: sec(23.28),     // "Tombouctou compte plus de bibliotheques..."
  sankoreAppears: sec(27.76),        // "L'universite de Sankore"

  // === Scene 3 - Climax Hadj (34-50s) ===
  climaxPivot: sec(36.10),           // "Mais le moment qui marque l'histoire, c'est ca."
  douzeCouronnement: sec(37.62),     // "Douze ans apres son couronnement"
  couronnement: sec(38.64),
  mecqueDeparture: sec(40.50),       // "l'empereur du Mali part a La Mecque"
  mecqueWord: sec(41.46),            // "Mecque."
  soixanteHommes: sec(43.46),        // "soixante mille hommes"
  douzeMille: sec(45.00),            // "Douze mille esclaves"
  chameaux: sec(47.52),              // "quatre-vingts chameaux"

  // === Scene 4 - Consequence (50-62s) ===
  caireArrival: sec(54.76),          // "il distribue tellement d'or au Caire"
  caireEffondre: sec(57.00),         // "l'economie egyptienne s'effondre"
  douzeAnsChute: sec(58.68),         // "Pendant douze ans, le prix de l'or chute"
  unSeulHomme: sec(63.18),           // "Un seul homme." [serious] - moment cle Q3 Kimi
  continentEffondre: sec(64.90),     // "Un continent qui s'effondre"

  // === Scene 5 - CTA (62-81s) ===
  mansaReveal: sec(67.84),           // "Cet homme s'appelait Mansa Moussa"
  demandeQuestion: sec(70.20),       // "Demande qui est l'homme..."
  rockefeller: sec(73.94),
  bezos: sec(75.08),
  musk: sec(76.08),
  pourtantPivot: sec(77.58),         // "Et pourtant"
  mansaFinal: sec(80.14),            // "la vraie reponse, c'est Mansa Moussa"
  end: sec(81.04),
} as const;

export const DURATION_FRAMES = T.end + sec(0.5); // +0.5s tail for fade out
export const DURATION_SECONDS = 81.54;

// === Geographic coordinates ===
export const COORDS = {
  // Capitales et villes cles
  niani: { lon: -8.4, lat: 11.4 },           // capitale historique Mali
  tombouctou: { lon: -3.0026, lat: 16.7666 },
  caire: { lon: 31.2357, lat: 30.0444 },
  mecque: { lon: 39.8262, lat: 21.4225 },
  djenne: { lon: -4.5550, lat: 13.9054 },    // ville historique Mali

  // Mali centroid (pour zoom-in scene 1)
  maliCentroid: { lon: -3.5, lat: 17.0 },

  // Centroide vue Sahara (pour pitch 60° traversee)
  sahara: { lon: 10, lat: 22 },
} as const;

// === SFX volumes (template Atlas) ===
export const SFX_VOLUMES = {
  B_impact: 0.6,        // pulse markers villes
  C_inkdraw: 0.85,      // trace caravane
  D_thud: 1.5,          // cartouche stats
  E_ventSahara: 0.5,    // diegetic scene 3 (ducked sous narration)
} as const;

export const MUSIC_VOLUME_DEFAULT = 0.04;
export const MUSIC_VOLUME_DUCKED = 0.01;  // sur "Un seul homme. Un continent qui s'effondre."
