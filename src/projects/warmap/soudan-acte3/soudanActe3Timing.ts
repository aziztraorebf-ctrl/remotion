/**
 * Soudan Acte 3 — "Suivre l'or" — timing storyboard.
 * Ancrages frame-précis dérivés de whisper-p1/p2/p3.ts + offsets de concat (silences 0.7s aux jonctions).
 * Source audio : acte3-suivre-lor-FULL.mp3 (v7, ~126s réel avec silences).
 * 30fps. DO NOT EDIT sans re-vérifier contre les fichiers whisper-pX.ts si l'audio est régénéré.
 */

export const FPS = 30;

// Offsets absolus (frame 0 = début du fichier concat FULL) — silence 0.7s = 21 frames entre parties.
export const PART_OFFSETS = {
  p1: 0,
  p2: Math.round((38.02 + 0.7) * FPS), // = 1166
  p3: Math.round((38.02 + 0.7 + 50.88 + 0.7) * FPS), // = 2709
};

// BEAT 1 — Le paradoxe [partie 1]
export const BEAT1 = {
  start: PART_OFFSETS.p1 + 0, // "Cette guerre..."
  pourtant: PART_OFFSETS.p1 + Math.round(4.46 * FPS), // bascule "Pourtant"
  quelquUnPaie: PART_OFFSETS.p1 + Math.round(10.06 * FPS), // "Quelqu'un paie cette guerre"
  suivreArgent: PART_OFFSETS.p1 + Math.round(12.22 * FPS), // "Il faut suivre l'argent"
  end: PART_OFFSETS.p1 + Math.round(15.4 * FPS), // fin "et pourquoi"
};

// BEAT 2 — Le point de départ : le Darfour, plusieurs mines [partie 1]
export const BEAT2 = {
  start: PART_OFFSETS.p1 + Math.round(17.42 * FPS), // "Tout commence au Darfour"
  minesOr: PART_OFFSETS.p1 + Math.round(20.62 * FPS), // "plusieurs mines d'or" — apparition 2-3 objets mine
  end: PART_OFFSETS.p1 + Math.round(21.22 * FPS),
};

// BEAT 2bis — L'acte fondateur (Jebel Amer se distingue, Hemedti) [partie 1]
export const BEAT2BIS = {
  start: PART_OFFSETS.p1 + Math.round(22.24 * FPS), // "La plus importante d'entre elles"
  hemedtiNomme: PART_OFFSETS.p1 + Math.round(28.24 * FPS), // mot "Hemedti" (whisper: "Emmettie", NE PAS utiliser cette graphie à l'écran — vérifier Wikipédia)
  jetonApparait: PART_OFFSETS.p1 + Math.round(28.24 * FPS), // jeton portrait apparaît en synchro
  miliceTenait: PART_OFFSETS.p1 + Math.round(29.34 * FPS),
  devenueProprietaire: PART_OFFSETS.p1 + Math.round(32.14 * FPS),
  milliard: PART_OFFSETS.p1 + Math.round(37.12 * FPS), // halo or plus saturé, PAS de chiffre à l'écran (voix seule porte le montant)
  end: PART_OFFSETS.p1 + Math.round(38.02 * FPS),
};

// BEAT 3 — Le trajet vers Dubaï [partie 2]
export const BEAT3 = {
  start: PART_OFFSETS.p2 + 0, // "Depuis cette mine..." — Dubaï doit être visible AVANT que le marqueur parte
  dubaiApparait: PART_OFFSETS.p2 + Math.round(0 * FPS), // objet Dubaï apparaît dès le début du beat (avant "route précise")
  emiratsMot: PART_OFFSETS.p2 + Math.round(4.70 * FPS), // "Émirats arabes unis" — marqueur en cours de trajet
  premierImportateur: PART_OFFSETS.p2 + Math.round(7.10 * FPS), // "Les Émirats sont aujourd'hui le premier importateur"
  end: PART_OFFSETS.p2 + Math.round(12.26 * FPS),
};

// BEAT 4 — Le trajet retour : les armes (marqueur se transforme à Dubaï) [partie 2]
export const BEAT4 = {
  start: PART_OFFSETS.p2 + Math.round(12.26 * FPS), // "Et cet argent ne reste pas à Dubaï"
  revientForme: PART_OFFSETS.p2 + Math.round(14.52 * FPS), // "Il revient sous une autre forme" — transformation marqueur doré→gris-métal
  achetentDrones: PART_OFFSETS.p2 + Math.round(17.44 * FPS), // "les paramilitaires achètent des drones" — marqueur en route vers RSF
  amnesty: PART_OFFSETS.p2 + Math.round(21.12 * FPS), // "Amnesty International"
  jetonRsfPulse: PART_OFFSETS.p2 + Math.round(25.76 * FPS), // "acheminés" — arrivée du marqueur, pulse RSF
  end: PART_OFFSETS.p2 + Math.round(30.88 * FPS), // fin "démentent"
};

// BEAT 5 — Le miroir : Turquie, SAF, Suakin [partie 2]
export const BEAT5 = {
  start: PART_OFFSETS.p2 + Math.round(32.58 * FPS), // "De l'autre côté du front"
  fournisseur: PART_OFFSETS.p2 + Math.round(34.38 * FPS), // "l'armée régulière a trouvé son propre fournisseur"
  turquieBayraktar: PART_OFFSETS.p2 + Math.round(37.78 * FPS), // "La Turquie lui vend ses drones Bayraktar" — marqueur entre par le nord
  enEchange: PART_OFFSETS.p2 + Math.round(41.14 * FPS),
  suakinNomme: PART_OFFSETS.p2 + Math.round(44.92 * FPS), // mot "Suakin" (whisper: "Swakine", NE PAS utiliser — vérifier Wikipédia) — objet dock apparaît en synchro
  end: PART_OFFSETS.p2 + Math.round(50.88 * FPS),
};

// BEAT 5bis — La nuance : SAF vend aussi (vers Égypte) [partie 3]
export const BEAT5BIS = {
  start: PART_OFFSETS.p3 + 0, // "Mais l'armée régulière n'a pas non plus les mains propres"
  vendOrHorsCircuit: PART_OFFSETS.p3 + Math.round(3.24 * FPS),
  routeNordEgypte: PART_OFFSETS.p3 + Math.round(7.04 * FPS), // "une bonne partie prend la route du nord, vers l'Égypte" — marqueur discret part vers le nord, fondu hors-cadre
  end: PART_OFFSETS.p3 + Math.round(11.8 * FPS),
};

// BEAT 6 — Le système, pas les camps [partie 3]
export const BEAT6 = {
  start: PART_OFFSETS.p3 + Math.round(11.8 * FPS), // "Ces deux camps se combattent depuis trois ans"
  memeOrPaie: PART_OFFSETS.p3 + Math.round(15.04 * FPS), // "le même or paie les deux côtés du front" (v7) — cadrage élargi, 4 flux visibles
  end: PART_OFFSETS.p3 + Math.round(19.96 * FPS),
};

// BEAT 7 — Sortie / pont vers Acte 4 [partie 3]
export const BEAT7 = {
  start: PART_OFFSETS.p3 + Math.round(19.96 * FPS), // "Ce qui fait durer cette guerre..."
  dubai: PART_OFFSETS.p3 + Math.round(23.54 * FPS),
  ankara: PART_OFFSETS.p3 + Math.round(26.18 * FPS),
  pauseAvantQuestion: PART_OFFSETS.p3 + Math.round(30.1 * FPS), // "[pause] Une question reste en suspens" — caméra stabilisée ici
  question: PART_OFFSETS.p3 + Math.round(33.58 * FPS), // "qui pourrait encore arrêter tout ça ?"
  end: PART_OFFSETS.p3 + Math.round(35.46 * FPS),
};

export const TOTAL_FRAMES = BEAT7.end; // ~3773 frames = ~125.8s à 30fps

// ⚠️ RAPPEL R-V5 : chaque objet figuratif (mine, Dubaï, jeton Hemedti, Suakin) doit apparaître EXACTEMENT
// synchro avec le mot qui le nomme — jamais avant (orphelin) ni après (redondant/tardif).
// ⚠️ Noms propres whisper corrompus (NE PAS utiliser à l'écran, vérifier Wikipédia) :
//   "Hemedti" transcrit "Emmettie" (p1) · "Suakin" transcrit "Swakine" (p2).
