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
// ⚠️ RE-TIMÉ pour l'audio PAUSES-SUR-ORIGINAL (assemblage) : acte6-verrou-institutionnel-PAUSES.mp3.
// 5 pauses déterministes insérées (scripts/tools/soudan-audio/acte6-pauses-sur-original.json). La méthode
// SUPPRIME le gap naturel (cut_s→resume_s) et le remplace par sil_s ; décalage d'un jalon = cumul de
// (sil_s - gap_naturel)*FPS pour toutes les pauses AVANT lui. Net total = +4.32s = +130 frames.
// Table appliquée (old→new) : b1End 476→518 · b2Start 477→519 · b2UnionAfricaine 536→578 ·
//   b2Suspendu 731→773 · b2MiseEcart 979→1016 · b2End 1117→1193 · b3Start 1118→1194 ·
//   b3Novembre 1169→1245 · b3Quatorze 1299→1375 · b3Russie 1444→1520 · b3Veto 1498→1574 ·
//   b3Neutre 1944→2020 · b3End 2086→2178 · b4Start 2087→2178 · b4Tables 2180→2272 ·
//   b4Emirats 2450→2542 · b4Alimente 2781→2872 · b4End 2920→3050 · b5Start 2921→3051 ·
//   b5Continue 3086→3216 · b5TreizeMillions 3381→3511 · b5Famine 3515→3645 · b5PireCrise 3602→3732 ·
//   b5Cloture 3860→3990 · b5Raison 4010→4140 · b5End 4140→4270 (b1Start/b1Outils/b1RienMarche : shift 0).
export const AUDIO_END = 4127; // 137.556s @30 : fin de la narration (audio pauses = durée ffprobe réelle)
// La compo est PROLONGEE au-dela de l'audio pour laisser la fin RESPIRER (dissolution en contours +
// noir, registre War-Map AES longue). ~5s de queue apres la voix (143 frames, constante).
export const TOTAL_FRAMES = 4270; // AUDIO_END(4127) + queue(143) = 142.33s @30
export const A6_GLOBE_FRAMES = TOTAL_FRAMES;

export const AUDIO_FULL = "_shared/audio/soudan/acte6-verrou-institutionnel-pauses.mp3";

// Ancrages absolus (frame 0 = debut de l'acte). RE-TIMÉS (cf table en tête de fichier).
export const T = {
  // ===== BEAT 1 — on cherche l'arbitre (POSER) =====
  // Raccord Acte 5 (scaleMul ~2.2, Soudan) -> zoom-out narratif vers vue planetaire + voile qui se leve.
  b1Start: 0, // "Une guerre comme celle-la, normalement..." (avant pause 1 : shift 0)
  b1Outils: 60, // "le monde a des outils pour l'arreter" (~2.0s) — zoom-out amorce (shift 0)
  b1RienMarche: 361, // "rien n'a marche" (12.04s) — vue planetaire installee, le vide (shift 0)
  b1End: 518,

  // ===== BEAT 2 — l'UA ecartee (ECARTER) =====
  b2Start: 519, // "Le premier reflexe, c'est de se tourner vers l'Union africaine"
  b2UnionAfricaine: 578, // "l'Union africaine" — territoires UA s'illuminent
  b2Suspendu: 773, // "suspendu depuis le coup d'Etat de 2021" ⭐ Soudan DESATURE (kaki->gris) + icone ban
  b2MiseEcart: 1016, // "mise a l'ecart avant meme d'avoir commence"
  b2End: 1193,

  // ===== BEAT 3 — le veto (BLOQUER) — GLOBE + OVERLAY UI hemicycle =====
  b3Start: 1194, // "Reste l'echelon au-dessus : le Conseil de securite de l'ONU"
  b3Novembre: 1245, // "En novembre 2024, il tente d'imposer un cessez-le-feu" — overlay hemicycle apparait
  b3Quatorze: 1375, // "14 pays votent pour" ⭐ 14 sieges vert sauge s'allument
  b3Russie: 1520, // "La Russie vote contre" ⭐ 1 siege rouge brique
  b3Veto: 1574, // "son seul veto suffit a tout bloquer" — le rouge fige le vote
  b3Neutre: 2020, // "plus personne n'est vraiment neutre" — overlay fade, pont vers B4
  b3End: 2178,

  // ===== BEAT 4 — le paradoxe (REVELER) — INSERT SVG table de nego =====
  b4Start: 2178, // "Et ce n'est pas qu'une histoire de Conseil de securite. Le meme probleme revient ailleurs"
  b4Tables: 2272, // "autour des tables ou on negocie la paix" — cross-fade globe->insert table
  b4Emirats: 2542, // "il y a les Emirats" ⭐ jeton EMIRATS (repris Acte 5) spotlight
  b4Alimente: 2872, // "on demande d'eteindre l'incendie a celui qui l'alimente de l'autre main"
  b4End: 3050,

  // ===== BEAT 5 — cout humain + cloture (PESER) — retour globe =====
  b5Start: 3051, // "Dans ces conditions, les plans de paix se suivent et se ressemblent" — cross-fade retour globe
  b5Continue: 3216, // "la guerre, elle, continue"
  b5TreizeMillions: 3511, // "13,5 millions de personnes ont du fuir leur maison" ⭐ compteur + cercles concentriques
  b5Famine: 3645, // "La famine s'installe"
  b5PireCrise: 3732, // "la pire crise humanitaire de la planete"
  b5Cloture: 3990, // "Au fond, le probleme..." — la DISSOLUTION en contours commence ici (sur la clôture parlée)
  b5Raison: 4140, // apres "...une bonne raison de ne pas le faire" (voix finit ~4127) — noir
  b5End: 4270, // queue de respiration (~5s apres la voix : Soudan + musique, puis noir)
};

// ⚠️ Noms/chiffres a l'ecran (verifier orthographe Wikipedia AVANT render, jamais deriver du whisper) :
//   "Union africaine", "Conseil de securite", "Emirats", "El-Fasher", "Nyala", "Khartoum".
//   Chiffres affiches : "14" (vote), "13,5 millions" (deplaces), "Nov. 2024" (label vote), "2021" (suspension UA).
// CTA : AUCUN (tranche Aziz 2026-07-19) — fin sur "bonne raison de ne pas le faire" puis noir.
