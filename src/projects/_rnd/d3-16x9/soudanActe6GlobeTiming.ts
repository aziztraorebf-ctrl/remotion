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
// ⚠️ RE-TIMÉ v2 (passe finale polish 2026-07-22) pour l'audio PAUSES v4 : acte6-verrou-institutionnel-v4pauses.mp3
// (139.73s, cf scripts/tools/soudan-audio/acte6-pauses-v4.json). Recalcul COMPLET depuis whisper-words-acte6.ts
// (370 mots, alignement ORIGINAL frais 2026-07-22) — pas un delta appliqué sur l'ancien re-timing v3 (dont
// les cut_s différaient légèrement, ex. 15.34 vs 15.24, 35.62 vs 34.08 : un alignement whisper affiné entre
// les deux passes rendait un delta additif non fiable). 5 cuts + prepend_silence_s=1.15 (silence en TÊTE,
// avant le tout premier mot "Une"). Table appliquée (orig whisper -> nouveau, calcul direct par segments) :
//   b1Start 0.00->1.15s · b1Outils 2.78->3.93s · b1RienMarche 11.60->12.75s · b2Start 15.56->17.99s ·
//   b2UnionAfricaine 17.88->20.31s · b2Suspendu 24.36->26.79s · b2MiseEcart 31.86->34.35s ·
//   b3Start 34.56->38.65s · b3Novembre 38.96->43.05s · b3Quatorze 43.30->47.39s · b3Russie 48.12->52.21s ·
//   b3Veto 49.94->54.03s · b3Neutre 64.80->68.89s · b4Start 68.46->73.71s · b4Tables 72.32->77.57s ·
//   b4Emirats 81.66->86.91s · b4Alimente 92.70->97.95s · b5Start 93.86->100.35s · b5Continue 102.88->109.37s ·
//   b5TreizeMillions 112.70->119.19s · b5Famine 117.16->123.65s · b5PireCrise 120.06->126.55s ·
//   b5Cloture 124.04->130.53s · fin voix (mot "faire") 133.14->139.63s (mesure ffprobe reelle 139.726s,
//   écart 3f = padding fin fichier, négligeable).
export const AUDIO_END = 4192; // 139.726s @30 : fin de la narration (mesure ffprobe réelle du nouvel audio)
// La compo est PROLONGEE au-dela de l'audio pour laisser la fin RESPIRER (dissolution en contours +
// noir, registre War-Map AES longue). ~4.77s de queue apres la voix (143 frames, constante conservée).
export const TOTAL_FRAMES = 4335; // AUDIO_END(4192) + queue(143) = 144.50s @30
export const A6_GLOBE_FRAMES = TOTAL_FRAMES;

export const AUDIO_FULL = "_shared/audio/soudan/acte6-verrou-institutionnel-v4pauses.mp3";

// Ancrages absolus (frame 0 = debut de l'acte). RE-TIMÉS v2 (cf table en tête de fichier, calcul direct
// depuis whisper-words-acte6.ts + manifest v4, PAS une correction incrémentale de l'ancien re-timing).
export const T = {
  // ===== BEAT 1 — on cherche l'arbitre (POSER) =====
  // Raccord Acte 5 (scaleMul ~2.2, Soudan) -> zoom-out narratif vers vue planetaire + voile qui se leve.
  b1Start: 34, // "Une guerre comme celle-la, normalement..." (apres prepend_silence 1.15s = 34.5f)
  b1Outils: 118, // "le monde a des outils pour l'arreter" (3.93s) — zoom-out amorce
  b1RienMarche: 382, // "rien n'a marche" (12.75s) — vue planetaire installee, le vide
  b1End: 540,

  // ===== BEAT 2 — l'UA ecartee (ECARTER) =====
  b2Start: 540, // "Le premier reflexe, c'est de se tourner vers l'Union africaine" (17.99s)
  b2UnionAfricaine: 609, // "l'Union africaine" (20.31s) — territoires UA s'illuminent
  b2Suspendu: 804, // "suspendu depuis le coup d'Etat de 2021" (26.79s) ⭐ Soudan DESATURE + icone ban
  b2MiseEcart: 1030, // "mise a l'ecart avant meme d'avoir commence" (34.35s)
  b2End: 1160,

  // ===== BEAT 3 — le veto (BLOQUER) — GLOBE + OVERLAY UI hemicycle =====
  b3Start: 1160, // "Reste l'echelon au-dessus : le Conseil de securite de l'ONU" (38.65s)
  b3Novembre: 1292, // "En novembre 2024, il tente d'imposer un cessez-le-feu" (43.05s) — overlay hemicycle apparait
  b3Quatorze: 1422, // "14 pays votent pour" (47.39s) ⭐ 14 sieges vert sauge s'allument
  b3Russie: 1566, // "La Russie vote contre" (52.21s) ⭐ 1 siege rouge brique
  b3Veto: 1621, // "son seul veto suffit a tout bloquer" (54.03s) — le rouge fige le vote
  b3Neutre: 2067, // "plus personne n'est vraiment neutre" (68.89s) — overlay fade, pont vers B4
  b3End: 2211,

  // ===== BEAT 4 — le paradoxe (REVELER) — INSERT SVG table de nego =====
  b4Start: 2211, // "Et ce n'est pas qu'une histoire de Conseil de securite..." (73.71s)
  b4Tables: 2327, // "autour des tables ou on negocie la paix" (77.57s) — cross-fade globe->insert table
  b4Emirats: 2607, // "il y a les Emirats" (86.91s) ⭐ jeton EMIRATS (repris Acte 5) spotlight
  b4Alimente: 2938, // "on demande d'eteindre l'incendie a celui qui l'alimente de l'autre main" (97.95s)
  b4End: 3010,

  // ===== BEAT 5 — cout humain + cloture (PESER) — retour globe =====
  b5Start: 3010, // "Dans ces conditions, les plans de paix se suivent et se ressemblent" (100.35s) — cross-fade retour globe
  b5Continue: 3281, // "la guerre, elle, continue" (109.37s)
  b5TreizeMillions: 3576, // "13,5 millions de personnes ont du fuir leur maison" (119.19s) ⭐ compteur + cercles concentriques
  b5Famine: 3709, // "La famine s'installe" (123.65s)
  b5PireCrise: 3796, // "la pire crise humanitaire de la planete" (126.55s)
  b5Cloture: 3916, // "Au fond, le probleme..." (130.53s) — la DISSOLUTION en contours commence ici
  b5Raison: 4205, // apres "...une bonne raison de ne pas le faire" (voix finit 139.63-139.73s ~4192f) — noir
  b5End: 4335, // queue de respiration (~4.77s apres la voix : Soudan + musique, puis noir)
};

// ⚠️ Noms/chiffres a l'ecran (verifier orthographe Wikipedia AVANT render, jamais deriver du whisper) :
//   "Union africaine", "Conseil de securite", "Emirats", "El-Fasher", "Nyala", "Khartoum".
//   Chiffres affiches : "14" (vote), "13,5 millions" (deplaces), "Nov. 2024" (label vote), "2021" (suspension UA).
// CTA : AUCUN (tranche Aziz 2026-07-19) — fin sur "bonne raison de ne pas le faire" puis noir.
