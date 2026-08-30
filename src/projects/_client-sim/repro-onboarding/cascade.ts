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
