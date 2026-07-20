/**
 * Timing GLOBE D3 — Soudan Acte 6 "Pourquoi personne ne l'arrête" (133.24s @30fps = 3997 frames).
 *
 * Acte FINAL du mid-form (verrou institutionnel UA/ONU + paradoxe des mediateurs + conclusion ouverte).
 * Registre = GLOBE D3 (continuite Acte 5) + overlay UI (B3 vote) + insert SVG (B4 table de nego).
 *
 * Ancrages DERIVES DU FORCED-ALIGNMENT (Whisper API OpenAI) de l'audio verrouille :
 *   public/_shared/audio/soudan/acte6-verrou-institutionnel.mp3 (133.24s, 5 parties p1-p5).
 *   Alignement : whisper-words-acte6.ts (370 mots). Frame 0 = debut de l'acte, audio joue en entier.
 *
 * ⚠️ CORRECTION STORYBOARD (2026-07-20, verif code Acte 5 reel) : l'Acte 5 NE finit PAS en vue
 * planetaire — il finit RE-ZOOME (scaleMul 2.2, region Soudan lon32/lat17, voile "isoler le systeme"
 * actif). Donc B1 = raccord EXACT sur cet etat PUIS zoom-out narratif vers vue planetaire.
 */

export const FPS = 30;
export const AUDIO_END = 3997; // 133.24s @30 : fin de la narration
// La compo est PROLONGEE au-dela de l'audio pour laisser la fin RESPIRER (dissolution en contours +
// noir + phrase typewriter, registre War-Map AES longue). ~5s de queue apres la voix.
export const TOTAL_FRAMES = 4140; // 138s @30
export const A6_GLOBE_FRAMES = TOTAL_FRAMES;

export const AUDIO_FULL = "_shared/audio/soudan/acte6-verrou-institutionnel.mp3";

// Ancrages absolus (frame 0 = debut de l'acte). Derives du whisper — NE PAS deviner au juge.
export const T = {
  // ===== BEAT 1 — on cherche l'arbitre (POSER) =====
  // Raccord Acte 5 (scaleMul ~2.2, Soudan) -> zoom-out narratif vers vue planetaire + voile qui se leve.
  b1Start: 0, // "Une guerre comme celle-la, normalement..."
  b1Outils: 60, // "le monde a des outils pour l'arreter" (~2.0s) — zoom-out amorce
  b1RienMarche: 361, // "rien n'a marche" (12.04s) — vue planetaire installee, le vide
  b1End: 476,

  // ===== BEAT 2 — l'UA ecartee (ECARTER) =====
  b2Start: 477, // "Le premier reflexe, c'est de se tourner vers l'Union africaine"
  b2UnionAfricaine: 536, // "l'Union africaine" (17.88s) — territoires UA s'illuminent
  b2Suspendu: 731, // "suspendu depuis le coup d'Etat de 2021" (24.36s) ⭐ Soudan DESATURE (kaki->gris) + icone ban
  b2MiseEcart: 979, // "mise a l'ecart avant meme d'avoir commence" (32.62s)
  b2End: 1117,

  // ===== BEAT 3 — le veto (BLOQUER) — GLOBE + OVERLAY UI hemicycle =====
  b3Start: 1118, // "Reste l'echelon au-dessus : le Conseil de securite de l'ONU" (37.28s)
  b3Novembre: 1169, // "En novembre 2024, il tente d'imposer un cessez-le-feu" (38.96s) — overlay hemicycle apparait
  b3Quatorze: 1299, // "14 pays votent pour" (43.30s) ⭐ 14 sieges vert sauge s'allument
  b3Russie: 1444, // "La Russie vote contre" (48.12s) ⭐ 1 siege rouge brique
  b3Veto: 1498, // "son seul veto suffit a tout bloquer" (49.94s) — le rouge fige le vote
  b3Neutre: 1944, // "plus personne n'est vraiment neutre" (64.80s) — overlay fade, pont vers B4
  b3End: 2086,

  // ===== BEAT 4 — le paradoxe (REVELER) — INSERT SVG table de nego =====
  b4Start: 2087, // "Et ce n'est pas qu'une histoire de Conseil de securite. Le meme probleme revient ailleurs"
  b4Tables: 2180, // "autour des tables ou on negocie la paix" (72.68s) — cross-fade globe->insert table
  b4Emirats: 2450, // "il y a les Emirats" (81.66s) ⭐ jeton EMIRATS (repris Acte 5) spotlight
  b4Alimente: 2781, // "on demande d'eteindre l'incendie a celui qui l'alimente de l'autre main" (92.70s)
  b4End: 2920,

  // ===== BEAT 5 — cout humain + cloture (PESER) — retour globe =====
  b5Start: 2921, // "Dans ces conditions, les plans de paix se suivent et se ressemblent" — cross-fade retour globe
  b5Continue: 3086, // "la guerre, elle, continue" (102.88s)
  b5TreizeMillions: 3381, // "13,5 millions de personnes ont du fuir leur maison" (112.70s) ⭐ compteur + cercles concentriques
  b5Famine: 3515, // "La famine s'installe" (117.16s)
  b5PireCrise: 3602, // "la pire crise humanitaire de la planete" (120.06s)
  b5Cloture: 3860, // "Au fond, le probleme..." — la DISSOLUTION en contours commence ici (sur la clôture parlée)
  b5Raison: 4010, // apres "...une bonne raison de ne pas le faire" (voix finit 3964) — noir + typewriter
  b5End: 4140, // queue de respiration (phrase typewriter tenue puis noir)
};

// ⚠️ Noms/chiffres a l'ecran (verifier orthographe Wikipedia AVANT render, jamais deriver du whisper) :
//   "Union africaine", "Conseil de securite", "Emirats", "El-Fasher", "Nyala", "Khartoum".
//   Chiffres affiches : "14" (vote), "13,5 millions" (deplaces), "Nov. 2024" (label vote), "2021" (suspension UA).
// CTA : AUCUN (tranche Aziz 2026-07-19) — fin sur "bonne raison de ne pas le faire" puis noir.
