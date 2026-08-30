// LA MECANIQUE DE L'ONBOARDING — relevee dans `12_BVaKTgmqgb.lottie`
// (kamotionstudio, 2000x4369, 60 fps, 275 frames).
//
// ⭐⭐ POURQUOI CE FICHIER EXISTE, ET PAS UNE COPIE DE LA PIECE.
// Mesure du .lottie source : sur 214 calques, **176 sont FIXES**. Les 38 animes
// le sont a 37/38 en OPACITE SEULE, plus un unique changement d'echelle. Aucune
// position, aucune rotation, aucune deformation.
// => la piece ne contient AUCUN geste a apprendre : c'est un decor tres fourni
// qui apparait et disparait en fondu. Son savoir-faire tient entierement dans
// les 3 regles ci-dessous. On les rejoue a l'identique ; le decor, lui, est le
// NOTRE (une repro d'interface tierce n'a aucune valeur en portfolio).
//
// LES 3 REGLES, relevees frame par frame :
//
// 1. CASCADE D'ENTREE — chaque element monte de 0 a 100 % sur 10 frames,
//    decale de 2 frames par rapport au precedent, DE HAUT EN BAS.
//    Releve : titre t=0, sous-titre t=2, app1 t=3, app2 t=4, app3 t=5,
//    section t=7, banniere t=9, membre1 t=11, membre2 t=13 ... membre7 t=23.
//
// 2. CASCADE DE SORTIE — meme pas de 2 frames, meme duree de 10 frames, mais
//    ⭐ EN ORDRE INVERSE : elle part du BAS. Releve : User 7 t=0, User 6 t=2,
//    ... User 1 t=12, puis banniere t=14, section t=16, apps t=18/20/22,
//    sous-titre t=24, titre t=26.
//    ⭐ C'est CA qui fait lire « l'ecran se range » plutot que « l'ecran
//    disparait » : il se replie dans l'ordre inverse de son deploiement.
//    ⛔ Reutiliser la cascade d'entree a l'envers du temps ne donne PAS le meme
//    resultat : l'ordre des elements doit s'inverser, pas seulement le sens.
//
// 3. LE REBOND D'ARRIVEE — le seul geste non-opacite de toute la piece.
//    `Go To Settings` : echelle 0 -> 110 % -> 100 %, sur t=102 / 120 / 134.
//    Soit 18 frames pour depasser, 14 pour revenir. Un depassement de 10 %.

/** Duree du fondu d'un element, en frames (releve : 10 a 60 fps). */
export const FONDU = 10;

/** Decalage entre deux elements consecutifs de la cascade (releve : 2). */
export const PAS = 2;

/**
 * Opacite d'un element de rang `rang` dans une cascade d'ENTREE.
 * Le rang 0 est le premier a entrer (le plus haut de l'ecran).
 */
export const entree = (frame: number, rang: number, debut = 0): number => {
  const t0 = debut + rang * PAS;
  if (frame <= t0) return 0;
  if (frame >= t0 + FONDU) return 1;
  return (frame - t0) / FONDU;
};

/**
 * Opacite d'un element de rang `rang` dans une cascade de SORTIE.
 * ⭐ `total` est necessaire : la sortie part du BAS, donc le dernier element
 * (rang le plus eleve) part EN PREMIER. C'est l'inversion d'ORDRE decrite
 * en regle 2 — pas une simple lecture a rebours du temps.
 */
export const sortie = (
  frame: number,
  rang: number,
  total: number,
  debut = 0,
): number => {
  const t0 = debut + (total - 1 - rang) * PAS;
  if (frame <= t0) return 1;
  if (frame >= t0 + FONDU) return 0;
  return 1 - (frame - t0) / FONDU;
};

/**
 * Echelle du rebond d'arrivee (regle 3), releve tel quel :
 * 0 % a t=0, 110 % a t=18, 100 % a t=32.
 */
export const rebond = (frame: number, debut: number): number => {
  const t = frame - debut;
  if (t <= 0) return 0;
  if (t <= 18) return (t / 18) * 1.1;
  if (t <= 32) return 1.1 - ((t - 18) / 14) * 0.1;
  return 1;
};

/**
 * ⭐⭐⭐ LE GLISSEMENT — PAR ELEMENT, pas par ecran. C'EST LE GESTE MANQUANT.
 *
 * ⛔ 2 ERREURS SUCCESSIVES avant d'arriver ici, les deux instructives :
 *
 * 1. V1 : aucun glissement. Mon scan du .lottie disait « 37/38 en opacite
 *    seule » — exact, et pourtant trompeur : le mouvement ne vient d'AUCUNE
 *    propriete de calque. Mesurer le FICHIER ne remplace pas mesurer l'IMAGE.
 *
 * 2. V3 : glissement de l'ECRAN ENTIER, d'un bloc. Mieux, mais l'activite
 *    mesuree restait a 4,33 % contre 11 % pour l'original sur l'entree.
 *    La mesure a montre pourquoi : notre animation etait FINIE a f30, celle de
 *    l'original culminait a f20-24 et continuait jusqu'a f40+.
 *
 * ⭐ LA VERITE, mesuree element par element sur le rendu de l'original :
 *      le TITRE (haut)      glisse de f4  a f28  (214 -> 80,  soit 134 px)
 *      la 1re PASTILLE (bas) glisse de f16 a f42  (668 -> 556, soit 112 px)
 *    Chaque element a SON glissement, decale exactement comme sa cascade
 *    d'opacite. Ce n'est pas un ecran qui monte : c'est chaque element qui
 *    monte EN ARRIVANT. D'ou une activite qui dure et qui culmine au milieu,
 *    au lieu de piquer au debut puis retomber.
 *
 * ⭐⭐ LA REGLE GENERALE, qui vaut au-dela de cette piece : un mouvement
 * d'ensemble applique en bloc et le meme mouvement applique par element
 * DECALE ne se ressemblent pas — le second a l'air vivant, le premier a l'air
 * d'un panneau qu'on pousse. Le decalage EST le geste.
 */
export const GLISSEMENT_PX = 120; // amplitude, mesuree (134 en haut, 112 en bas)
export const GLISSEMENT_DUREE = 26; // frames, mesurees (f4->f28, f16->f42)

/**
 * Decalage vertical d'un element de rang `rang` (0 = pose).
 * ⭐ Le rang decale le DEPART, exactement comme dans `entree()` : c'est ce qui
 * fait que le bas de l'ecran bouge encore quand le haut est deja pose.
 */
export const glissement = (frame: number, rang = 0, debut = 0): number => {
  const t = frame - debut - rang * PAS;
  if (t <= 0) return GLISSEMENT_PX;
  if (t >= GLISSEMENT_DUREE) return 0;
  // Exposant 4 : ajuste sur les 9 points mesures du titre (ecart moyen 2,6 px,
  // max 7,7 ; exposant 3 -> 8,6 de moyenne, exposant 5 -> 3,5).
  const p = t / GLISSEMENT_DUREE;
  return GLISSEMENT_PX * (1 - p) ** 4;
};

/**
 * ⭐⭐⭐ ANTICIPATION + DEPASSEMENT — reclames par 4 voix sur 4 au DA-brief
 * (Gemini, Kimi, GPT, Grok, 2026-08-30). C'est le point sur lequel ils
 * convergent le plus nettement, et tous le designent comme LA marque qui
 * separe l'amateur du professionnel.
 *
 * Le principe : un objet vivant ne part pas tout droit vers sa cible.
 *   1. il RECULE legerement d'abord (anticipation) — l'elan se prepare
 *   2. il DEPASSE sa cible (overshoot)
 *   3. il revient se poser
 * Sans ca, un mouvement a l'air « pousse » ; avec, il a l'air « lance ».
 *
 * ⛔ A DOSER : sur une interface, l'exces fait jouet. On reste sous 10 % de
 * depassement pour les elements de contenu, on va un peu plus loin (18 %)
 * uniquement sur L'ACTION CLE, celle que le recit designe.
 */

/**
 * Progression 0->1 avec anticipation puis depassement.
 * `recul` = amplitude du contre-mouvement (fraction, ex 0.06)
 * `depassement` = amplitude du depassement (fraction, ex 0.10)
 */
export const elan = (
  p: number,
  recul = 0.06,
  depassement = 0.1,
): number => {
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  // 1er quart : le contre-mouvement (on part a l'envers)
  if (p < 0.25) {
    const q = p / 0.25;
    return -recul * Math.sin(q * Math.PI);
  }
  // le reste : course vers la cible avec depassement puis retour
  const q = (p - 0.25) / 0.75;
  const base = 1 - (1 - q) ** 3;
  return base + depassement * Math.sin(q * Math.PI) * (1 - q * 0.35);
};

/**
 * Le meme elan, applique a un DEPLACEMENT en pixels (retourne le decalage
 * restant, 0 = pose). Remplace `glissement()` sur les elements auxquels on
 * veut donner de la vie.
 */
export const glissementVivant = (
  frame: number,
  rang = 0,
  debut = 0,
  amplitude = GLISSEMENT_PX,
): number => {
  const t = frame - debut - rang * PAS;
  if (t <= 0) return amplitude;
  if (t >= GLISSEMENT_DUREE) return 0;
  return amplitude * (1 - elan(t / GLISSEMENT_DUREE));
};

/**
 * L'ACTION CLE — l'echelle d'un element qui doit ATTIRER l'oeil au moment ou
 * le recit le designe (chez nous : l'interrupteur « Contacts »).
 * Depassement volontairement plus marque (18 %), c'est le seul endroit ou on
 * s'autorise ce niveau.
 */
export const pulsationCle = (frame: number, debut: number, duree = 20): number => {
  const t = frame - debut;
  if (t <= 0 || t >= duree) return 1;
  const p = t / duree;
  return 1 + 0.18 * Math.sin(p * Math.PI) * (1 - p * 0.4);
};
