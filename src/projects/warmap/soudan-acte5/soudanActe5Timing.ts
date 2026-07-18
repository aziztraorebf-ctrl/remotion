/**
 * Soudan Acte 5 — "Le réseau qui arme dans l'ombre" — timing storyboard.
 * Ancrages frame-précis dérivés du forced-alignment ElevenLabs v1 (scripts/warmap/soudan-acte5-align.py),
 * source : acte5-reseau-ombre-alignment.json (198 mots, loss=0.107).
 * Source audio : acte5-reseau-ombre.mp3 (concat brute des 4 parties, AUCUN silence de jonction ajouté
 * par generate-narration-expressive.py — cohérent avec le pattern Acte 4).
 * 30fps. DO NOT EDIT sans re-vérifier contre acte5-reseau-ombre-alignment.json si l'audio est régénéré.
 */

export const FPS = 30;

// Offsets absolus (frame 0 = début du fichier concat FULL) — durées réelles ffprobe.
export const PART_OFFSETS = {
  p1: 0,
  p2: Math.round(30.650340 * FPS), // = 920
  p3: Math.round((30.650340 + 18.250884) * FPS), // = 1467
  p4: Math.round((30.650340 + 18.250884 + 17.043447) * FPS), // = 1978
};

// BEAT 1 — Pont depuis l'Acte 4, la chaîne posée d'un coup [partie 1]
export const BEAT1 = {
  start: PART_OFFSETS.p1 + 0, // "Cette organisation, on y reviendra..."
  resteImpasse: PART_OFFSETS.p1 + Math.round(5.70 * FPS), // "elle reste dans l'impasse" — dézoom amorce
  circuitExterieur: PART_OFFSETS.p1 + Math.round(9.00 * FPS), // "un circuit extérieur"
  golfeFinance: PART_OFFSETS.p1 + Math.round(11.04 * FPS), // "Un pays du Golfe finance" — territoire libyen entre en cadre
  installeLibye: PART_OFFSETS.p1 + Math.round(12.48 * FPS), // "installé en Libye" — territoire passe neutre→actif
  end: PART_OFFSETS.p1 + Math.round(15.60 * FPS),
};

// BEAT 2 — Maillon 1 : qui finance [partie 1, suite]
export const BEAT2 = {
  start: PART_OFFSETS.p1 + Math.round(17.44 * FPS), // "Ce pays, c'est les Émirats arabes unis"
  emiratsNommes: PART_OFFSETS.p1 + Math.round(18.58 * FPS), // "Émirats" — point Abou Dabi s'allume
  dateEnquete: PART_OFFSETS.p1 + Math.round(20.46 * FPS), // "vingt-neuf juin deux mille vingt-six"
  sourcesNommees: PART_OFFSETS.p1 + Math.round(22.26 * FPS), // "Lighthouse Reports et Der Spiegel" — médaillon presse discret
  campsEntrainement: PART_OFFSETS.p1 + Math.round(29.92 * FPS), // "des camps d'entraînement" — jeton camp unique (max 1, cf densité)
  end: PART_OFFSETS.p1 + Math.round(30.65 * FPS),
};

// BEAT 3 — Maillon 2 : qui sert d'intermédiaire [partie 2]
export const BEAT3 = {
  start: PART_OFFSETS.p2 + 0, // "En Libye, ce réseau s'appuie sur les forces du maréchal Haftar..."
  haftarNomme: PART_OFFSETS.p2 + Math.round(3.46 * FPS), // "maréchal Haftar" — teinte de contrôle est-libyen (Benghazi/Kufra)
  rapportOnu: PART_OFFSETS.p2 + Math.round(8.58 * FPS), // "Un rapport des Nations unies" — tampon ONU discret
  dateRapport: PART_OFFSETS.p2 + Math.round(11.92 * FPS), // "avril deux mille vingt-six"
  corridor: PART_OFFSETS.p2 + Math.round(13.02 * FPS), // "ce corridor" — trait COMMENCE à se tracer depuis Kufra (Beat3→4 = 1 seule variable continue)
  armes: PART_OFFSETS.p2 + Math.round(14.58 * FPS), // "Des armes," — pulse 1/3 (objet synchronisé mot-à-mot)
  carburant: PART_OFFSETS.p2 + Math.round(15.20 * FPS), // "du carburant," — pulse 2/3
  combattants: PART_OFFSETS.p2 + Math.round(16.14 * FPS), // "des combattants" — pulse 3/3
  end: PART_OFFSETS.p2 + Math.round(18.25 * FPS),
};

// BEAT 4 — Maillon 3 : où ça arrive — la chaîne se boucle [partie 3]
export const BEAT4 = {
  start: PART_OFFSETS.p3 + 0, // "Et cette route, on la retrouve à El-Fasher..."
  elFasherNomme: PART_OFFSETS.p3 + Math.round(1.58 * FPS), // "El-Fasher" — le MÊME trait (suspendu Beat3) reprend et rejoint le point
  siegeVille: PART_OFFSETS.p3 + Math.round(3.16 * FPS), // "le siège de la ville"
  combattantsRepere: PART_OFFSETS.p3 + Math.round(7.30 * FPS), // "on les y a repérés" — impact discret sur El-Fasher
  resumons: PART_OFFSETS.p3 + Math.round(10.80 * FPS), // "Résumons." — glow synchronisé 3 points, ZÉRO texte
  end: PART_OFFSETS.p3 + Math.round(17.04 * FPS),
};

// BEAT 5 — Phrase de clôture, coup de poing (pont vers l'Acte 6) [partie 4]
export const BEAT5 = {
  start: PART_OFFSETS.p4 + 0, // "Ce réseau est donc documenté..."
  documente: PART_OFFSETS.p4 + Math.round(0.72 * FPS), // "documenté" — carte se fige (traits/points silencieux)
  etPourtant: PART_OFFSETS.p4 + Math.round(5.64 * FPS), // "Et pourtant," — contraste : El-Fasher SEUL continue de pulser
  continueFonctionner: PART_OFFSETS.p4 + Math.round(6.82 * FPS), // "il continue de fonctionner"
  institutions: PART_OFFSETS.p4 + Math.round(11.14 * FPS), // "les institutions" — carte s'assombrit en périphérie, pont Acte 6
  end: PART_OFFSETS.p4 + Math.round(14.16 * FPS),
};

export const TOTAL_FRAMES = PART_OFFSETS.p4 + Math.round(14.164172 * FPS); // = 2400 (80.11s)
