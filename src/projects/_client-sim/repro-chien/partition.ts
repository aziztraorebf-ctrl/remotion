// MOTEUR: objet/metaphore SVG (mascotte vectorielle animee par calques)
//
// PARTITION DU CHIEN — valeurs MESUREES sur la piece professionnelle, jamais inventees.
// Source : out/_r-and-d/corpus-kamotion/02_Doggy_with_segments_3.json (60 fps, 4,83 s)
//
// ⛔ POURQUOI CE FICHIER EXISTE : la doctrine dit "le modele dessine le statique, NOUS
// animons". Mais animer "au jugé" produit un mouvement plausible et faux. Chaque valeur
// ci-dessous vient d'une lecture des keyframes du fichier d'origine (nombre de cles,
// instants, amplitudes min/max). Un commentaire qui justifie une valeur jamais mesuree
// est un signal d'alarme -- il n'y en a pas ici.

export const FPS = 60;
export const DUREE_S = 4.83;
export const DUREE_FRAMES = Math.round(DUREE_S * FPS); // 290

// Le battement de base : la tete se replace toutes les ~0,33 s (17 cles sur 4,8 s).
// C'est ce pouls qui donne l'impression "vivant" -- tout le reste s'y accroche.
export const BATTEMENT_S = 0.33;

/**
 * Gestes mesures, par partie.
 * `cles` = instants en secondes releves dans le fichier d'origine.
 * `amplitude` = [min, max] reellement atteints (degres, pixels ou %).
 */
export const GESTES = {
  // La tete oscille : 17 cles de position. C'est le mouvement porteur.
  tete: {
    rotationDeg: { amplitude: [0, 15] as const, cles: [3.5, 3.67, 3.83, 4.17, 4.5] },
    positionPx: { amplitude: [-49.37, 50.63] as const, battement: BATTEMENT_S },
  },

  // ⭐ Les deux oreilles sont DEPHASEES : l'une demarre a 0,33 s, l'autre a 1,67 s.
  // Les animer en phase ferait un mouvement de robot -- c'est le decalage qui vit.
  oreilleGauche: {
    rotationDeg: { amplitude: [-9, 15] as const, cles: [0.33, 0.55, 0.77, 1.0, 3.65, 3.85, 4.05, 4.41, 4.61, 4.82] },
  },
  oreilleDroite: {
    rotationDeg: { amplitude: [-9, 15] as const, cles: [1.67, 1.88, 2.11, 2.33, 3.57, 3.77, 3.97, 4.33, 4.53, 4.73] },
  },

  // ⭐⭐ LE DETAIL QUI SE VOIT : l'iris bouge par PAIRES SERREES (0,33 -> 0,35 ;
  // 0,98 -> 1,00), soit ~0,02 s d'ecart = un SAUT, pas un glissement. Ce sont des
  // coups d'oeil : le regard change de cible instantanement, comme un vrai oeil.
  // Interpoler doucement entre ces deux cles tuerait tout l'effet.
  iris: {
    positionPx: {
      amplitude: [-33.66, 18.91] as const,
      sauts: [[0.33, 0.35], [0.98, 1.0], [1.65, 1.67], [2.32, 2.33]] as const,
    },
    // L'echelle descend a 80 % : c'est le plissement des yeux, pas un zoom.
    echellePct: { amplitude: [80, 100] as const, cles: [0.17, 0.5, 0.83, 1.17, 1.67, 1.83, 2.33, 2.5] },
    rotationDeg: { amplitude: [-5, 0] as const },
  },

  // Le sourcil droit est deux fois plus actif que le gauche (12 cles contre 6) :
  // c'est ce qui donne l'expression asymetrique, vivante.
  sourcilGauche: { rotationDeg: { amplitude: [-16, 0] as const, cles: [0.33, 0.5, 0.83, 1.17, 1.83, 2.17] } },
  sourcilDroit: {
    rotationDeg: { amplitude: [-16, 0] as const, cles: [0.33, 0.5, 0.83, 1.17, 1.5, 1.83, 2.17, 2.5, 3.5, 3.67, 4.17, 4.33] },
  },

  // La langue est la partie la plus mobile : +/-70 deg sur 14 cles.
  langue: {
    rotationDeg: { amplitude: [-70, 60] as const, cles: [0.17, 0.45, 0.73, 0.93, 1.17, 1.5, 1.78, 2.07, 2.27, 2.5, 3.5, 3.83, 4.17, 4.5] },
    echellePct: { amplitude: [77.84, 99] as const, cles: [3.5, 3.83, 4.17, 4.5] },
  },
} as const;

/**
 * ⛔ LES POCHOIRS — la raison d'etre de cette reproduction.
 * Chaque paire est mesuree dans le fichier d'origine : un calque `td:1` (la decoupe)
 * suivi immediatement d'un calque `tt:1` (le contenu). Mesure du 2026-08-29 : retirer
 * ces mattes change 50 % de l'image. Ce ne sont pas des finitions, c'est ce qui tient
 * le dessin ensemble.
 */
export const POCHOIRS = [
  { decoupe: "head-silhouette", contenu: "head-shading", raison: "l'ombre ne deborde pas du crane" },
  { decoupe: "head-silhouette", contenu: "decal", raison: "la bande du front epouse le crane" },
  { decoupe: "snout-silhouette", contenu: "tongue", raison: "la langue sort de la bouche sans deborder du museau" },
  { decoupe: "eye-l-silhouette", contenu: "iris-l", raison: "l'iris ne sort jamais de l'oeil" },
  { decoupe: "eye-r-silhouette", contenu: "iris-r", raison: "idem a droite" },
] as const;
