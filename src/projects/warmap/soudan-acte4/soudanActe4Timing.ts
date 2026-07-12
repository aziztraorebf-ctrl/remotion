/**
 * Soudan Acte 4 — "Même les voisins sont aspirés" — timing storyboard.
 * Ancrages frame-précis dérivés de whisper-p1..p5.ts (mots individuels, cf whisper-align.py).
 * Source audio : acte4-voisins-aspires-FULL.mp3 (concat brute des 5 parties, AUCUN silence de jonction
 * ajouté par le pipeline generate-narration-expressive.py — contrairement à l'Acte 3, ne pas ajouter +0.7s).
 * 30fps. DO NOT EDIT sans re-vérifier contre les fichiers whisper-pX.ts si l'audio est régénéré.
 * ⚠️ Whisper transcrit "Khosty" (Kosti) et "adolescence" (l'essence) — erreurs phonétiques connues,
 * n'affectent pas le timing, mais NE JAMAIS utiliser ces graphies à l'écran (règle nom-propre-écran).
 */

export const FPS = 30;

// Offsets absolus (frame 0 = début du fichier concat FULL) — durées réelles ffprobe, PAS de silence ajouté.
export const PART_OFFSETS = {
  p1: 0,
  p2: Math.round(24.845351 * FPS), // = 745
  p3: Math.round((24.845351 + 22.244717) * FPS), // = 1413
  p4: Math.round((24.845351 + 22.244717 + 34.504853) * FPS), // = 2448
  p5: Math.round((24.845351 + 22.244717 + 34.504853 + 25.541950) * FPS), // = 3214
};

// BEAT 1 — Le retournement russe (+ pont depuis Acte 3) [partie 1]
export const BEAT1 = {
  start: PART_OFFSETS.p1 + 0, // "Personne n'a de réponse simple..."
  troisiemePays: PART_OFFSETS.p1 + Math.round(5.56 * FPS), // "troisième pays" — marqueur Moscou entre en scène
  changeDeCamp: PART_OFFSETS.p1 + Math.round(9.58 * FPS), // "vient de changer de camp"
  wagnerArmait: PART_OFFSETS.p1 + Math.round(13.18 * FPS), // "des réseaux liés à Wagner armaient..." — trait RSF qui s'estompe
  volteFace2024: PART_OFFSETS.p1 + Math.round(19.84 * FPS), // "2024, Moscou fait volte-face" — trait SAF net qui apparaît
  end: PART_OFFSETS.p1 + Math.round(24.74 * FPS),
};

// BEAT 2 — Le prix de ce revirement, chiffré (base navale Port-Soudan) [partie 2]
export const BEAT2 = {
  start: PART_OFFSETS.p2 + 0, // "Et cette nouvelle alliance..."
  portSoudanNomme: PART_OFFSETS.p2 + Math.round(6.22 * FPS), // "à Port-Soudan" — icône ancre/base pulse fort
  vingtCinqAns: PART_OFFSETS.p2 + Math.round(9.42 * FPS), // "un accord de 25 ans"
  troisCentsSoldats: PART_OFFSETS.p2 + Math.round(11.74 * FPS), // "jusqu'à 300 soldats russes"
  quatreNavires: PART_OFFSETS.p2 + Math.round(13.28 * FPS), // "et 4 navires de guerre"
  propulsionNucleaire: PART_OFFSETS.p2 + Math.round(16.32 * FPS), // "à propulsion nucléaire"
  soudanPasSigne: PART_OFFSETS.p2 + Math.round(18.32 * FPS), // "Le Soudan n'a encore rien signé"
  end: PART_OFFSETS.p2 + Math.round(22.14 * FPS),
};

// BEAT 3 — Le miroir égyptien, mode d'action (renseignement/coordination) [partie 3]
export const BEAT3 = {
  start: PART_OFFSETS.p3 + 0, // "et la Russie n'est pas seule..."
  egypteNommee: PART_OFFSETS.p3 + Math.round(5.56 * FPS), // "l'Égypte ne se contente plus de regarder" — marqueur part, halo SAF se renforce
  renseignement: PART_OFFSETS.p3 + Math.round(9.62 * FPS), // "passe surtout par le renseignement"
  coordonne: PART_OFFSETS.p3 + Math.round(11.34 * FPS), // "Elle coordonne aussi avec les généraux"
  end: PART_OFFSETS.p3 + Math.round(17.58 * FPS),
};

// BEAT 4 — Le motif égyptien (le Nil s'illumine) [partie 3, suite]
// ⚠️ VIGILANCE STORYBOARD : candidat le + à risque de forcer un concept abstrait sur la carte, cf script.
export const BEAT4 = {
  start: PART_OFFSETS.p3 + Math.round(18.76 * FPS), // "L'Égypte n'agit pas par solidarité, mais par calcul"
  nilNomme: PART_OFFSETS.p3 + Math.round(22.60 * FPS), // "Le Nil traverse les deux pays" — le Nil pulse/se surligne
  redouteInfluence: PART_OFFSETS.p3 + Math.round(24.62 * FPS), // "elle redoute de voir le Soudan basculer"
  profondeurStrategique: PART_OFFSETS.p3 + Math.round(31.86 * FPS), // "C'est une profondeur stratégique" — phrase coup de poing, caméra stable
  end: PART_OFFSETS.p3 + Math.round(33.42 * FPS),
};

// BEAT 5 — Le coût civil (Kosti) [partie 4]
// Whisper : "Khosty" (phonétique) — écran doit afficher "Kosti", vérifié Wikipédia.
export const BEAT5 = {
  start: PART_OFFSETS.p4 + 0, // "Tous ces jeux de pouvoir extérieurs..."
  consequencesReelles: PART_OFFSETS.p4 + Math.round(2.48 * FPS), // "ont des conséquences bien réelles au Soudan"
  kostiNomme: PART_OFFSETS.p4 + Math.round(5.46 * FPS), // "À Kosti" — point s'allume sur la carte (Nil Blanc)
  date21Juin: PART_OFFSETS.p4 + Math.round(6.32 * FPS), // "le 21 juin 2026"
  droneFrappe: PART_OFFSETS.p4 + Math.round(10.16 * FPS), // "les paramilitaires frappent avec un drone"
  stationService: PART_OFFSETS.p4 + Math.round(10.78 * FPS), // "une station-service"
  civilsEssence: PART_OFFSETS.p4 + Math.round(12.16 * FPS), // "où des civils attendaient de l'essence" (whisper: "adolescence", ignorer)
  pasCibleMilitaire: PART_OFFSETS.p4 + Math.round(14.92 * FPS), // "Ce n'était pas une cible militaire"
  memesArmes: PART_OFFSETS.p4 + Math.round(17.40 * FPS), // "mais ce sont bien les mêmes armes venues de l'étranger"
  civilsPayentPrix: PART_OFFSETS.p4 + Math.round(23.34 * FPS), // "Et ce sont des civils qui en payent le prix"
  end: PART_OFFSETS.p4 + Math.round(25.48 * FPS),
};

// BEAT 6 — La bascule vers l'Acte 5 (synthèse, 4 puissances) [partie 5]
export const BEAT6 = {
  start: PART_OFFSETS.p5 + 0, // "Ce ne sont donc plus seulement deux camps soudanais..."
  quatrePuissances: PART_OFFSETS.p5 + Math.round(5.34 * FPS), // "quatre puissances étrangères" — dézoom, 4 flèches visibles ensemble
  peserIssue: PART_OFFSETS.p5 + Math.round(8.18 * FPS), // "plus intérêt à peser sur l'issue de cette guerre"
  pontActe5: PART_OFFSETS.p5 + Math.round(14.16 * FPS), // "Et pourtant, une organisation existe..." — pont, ne referme pas la boucle
  resteInactive: PART_OFFSETS.p5 + Math.round(22.60 * FPS), // "elle est restée inactive"
  end: PART_OFFSETS.p5 + Math.round(23.46 * FPS),
};

export const ACTE4_TOTAL_FRAMES = BEAT6.end;
