// ANIMATIC — squelette de timing de la piece « Le cauri ».
// Ce fichier ne contient AUCUN dessin : uniquement le decoupage temporel et les
// cibles de position des particules. Il est concu pour SURVIVRE a l'animatic :
// quand le dessin definitif arrivera, ce timing est repris tel quel, seule la
// matiere rendue change.
//
// Brief : out/_r-and-d/cauri/BRIEF-PIECE.md § 4 (chaine de formes, 7 etats).
// Contrainte maitresse : UNE SEULE PRISE, ZERO COUPE.

/**
 * Les 7 etats du § 4 du brief. Duree en SECONDES (convertie par fps a l'usage,
 * jamais de frame ecrite en dur — regle projet).
 *
 * Le reglage du rythme se fait ICI et nulle part ailleurs.
 *
 * ⭐ Point de tension du brief : l'etat 3 (le flux LONG) doit durer assez pour que
 * « long » se RESSENTE, alors que la piece entiere tient en 15-25 s. C'est le
 * curseur principal a discuter apres visionnage.
 */
export const ETATS = [
  { id: 1, nom: "coquille", duree: 2.0, dit: "l'objet precieux" },
  { id: 2, nom: "semis", duree: 2.6, dit: "la rarete" },
  { id: 3, nom: "flux-long", duree: 5.2, dit: "la distance qui fait la valeur" },
  { id: 4, nom: "colonne", duree: 3.0, dit: "la valeur" },
  { id: 5, nom: "flux-court", duree: 2.4, dit: "1845 : le raccourci" },
  { id: 6, nom: "effondrement", duree: 2.8, dit: "l'effondrement" },
  { id: 7, nom: "calme", duree: 2.6, dit: "fin, permet la boucle" },
] as const;

export type EtatNom = (typeof ETATS)[number]["nom"];

/** Duree totale de la piece, en secondes — derivee, jamais ecrite a la main. */
export const DUREE_TOTALE = ETATS.reduce((s, e) => s + e.duree, 0);

/**
 * Instant de DEBUT de chaque etat (secondes), derive des durees ci-dessus.
 * bornes[i] = debut de ETATS[i] ; bornes[ETATS.length] = fin de la piece.
 */
export const BORNES: number[] = ETATS.reduce<number[]>(
  (acc, e) => [...acc, acc[acc.length - 1] + e.duree],
  [0],
);

/**
 * Part de la duree d'un etat consacree a la TRANSFORMATION vers cet etat.
 * Le reste est une TENUE (la forme se laisse lire, immobile ou presque).
 *
 * C'est le parametre le plus important de l'animatic : trop de transformation et
 * la piece devient une bouillie continue, trop peu et on retombe sur des gestes
 * isoles — le defaut exact de nos 3 reproductions TED-Ed.
 */
export const PART_TRANSFORMATION = 0.55;

/** Nombre de particules. Constant sur toute la piece — c'est ce qui interdit la coupe. */
export const N = 260;

/** Cadre de travail (16:9 full HD). */
export const VB = { w: 1920, h: 1080 };

// --------------------------------------------------------------------------
// CIBLES — chaque etat donne une POSITION VOULUE pour chacune des N particules.
// Aucune particule n'apparait ni ne disparait jamais : elles se DEPLACENT.
// C'est la traduction litterale de « chaque forme est la matiere de la suivante ».
// --------------------------------------------------------------------------

export type Cible = { x: number; y: number };

/** Generateur pseudo-aleatoire deterministe (meme rendu a chaque render). */
export const alea = (graine: number): (() => number) => {
  let s = graine >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

/**
 * ETAT 1 — une coquille, seule, centree.
 * Placeholder de forme : un ovale plein legerement aplati, les particules
 * remplissant sa surface. Le DESSIN definitif remplacera cette silhouette ;
 * la mecanique de morphing, elle, ne changera pas.
 */
const coquille = (n: number): Cible[] => {
  const r = alea(11);
  const cx = VB.w / 2;
  const cy = VB.h / 2;
  const rx = 120;
  const ry = 86;
  return Array.from({ length: n }, () => {
    // racine carree = repartition uniforme en SURFACE (sans elle, tout s'agglutine au centre)
    const rad = Math.sqrt(r());
    const ang = r() * Math.PI * 2;
    return { x: cx + Math.cos(ang) * rx * rad, y: cy + Math.sin(ang) * ry * rad };
  });
};

/** ETAT 2 — semis RARE et espace : peu d'occupation, beaucoup de vide. */
const semis = (n: number): Cible[] => {
  const r = alea(29);
  return Array.from({ length: n }, () => ({
    x: VB.w * (0.22 + r() * 0.56),
    y: VB.h * (0.24 + r() * 0.52),
  }));
};

/**
 * ETAT 3 — le flux LONG et tenu. Le trajet traverse tout l'ecran en diagonale
 * douce : c'est LE plan qui doit se lire comme « loin ».
 * ⭐ La distance est le personnage principal (brief § 4).
 */
const fluxLong = (n: number): Cible[] => {
  const r = alea(43);
  const x0 = VB.w * 0.06;
  const y0 = VB.h * 0.74;
  const x1 = VB.w * 0.94;
  const y1 = VB.h * 0.3;
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    // legere courbure : un trait parfaitement droit lit « graphique », pas « voyage »
    const creux = Math.sin(t * Math.PI) * VB.h * 0.07;
    return {
      x: x0 + (x1 - x0) * t,
      y: y0 + (y1 - y0) * t + creux + (r() - 0.5) * 26,
    };
  });
};

/** ETAT 4 — la colonne verticale haute : la valeur accumulee, dense et fine. */
const colonne = (n: number): Cible[] => {
  const r = alea(67);
  const cx = VB.w * 0.5;
  const bas = VB.h * 0.86;
  const haut = VB.h * 0.16;
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return { x: cx + (r() - 0.5) * 74, y: bas + (haut - bas) * t };
  });
};

/**
 * ETAT 5 — le 2e flux : COURT et MASSIF, arrivant par la droite.
 * L'ecart avec l'etat 3 porte tout le sens : meme nombre de particules, trajet
 * bien plus court, donc densite visiblement superieure.
 */
const fluxCourt = (n: number): Cible[] => {
  const r = alea(83);
  const x0 = VB.w * 0.68;
  const x1 = VB.w * 0.52;
  const cy = VB.h * 0.42;
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return {
      x: x0 + (x1 - x0) * t + (r() - 0.5) * 40,
      y: cy + (r() - 0.5) * 150,
    };
  });
};

/** ETAT 6 — l'effondrement : la colonne s'ecrase, tout retombe et s'etale au sol. */
const effondrement = (n: number): Cible[] => {
  const r = alea(97);
  const sol = VB.h * 0.83;
  return Array.from({ length: n }, () => ({
    x: VB.w * (0.12 + r() * 0.76),
    // tas : plus dense pres du sol, quelques particules encore en l'air
    y: sol - Math.pow(r(), 2.2) * VB.h * 0.2,
  }));
};

/** ETAT 7 — retour au calme : un semis apaise, proche de l'etat 2, pour boucler. */
const calme = (n: number): Cible[] => {
  const r = alea(29); // meme graine que le semis : la fin RIME avec le debut
  return Array.from({ length: n }, () => ({
    x: VB.w * (0.22 + r() * 0.56),
    y: VB.h * (0.3 + r() * 0.42),
  }));
};

/** Les 7 jeux de cibles, dans l'ordre du brief. */
export const CIBLES: Record<EtatNom, Cible[]> = {
  coquille: coquille(N),
  semis: semis(N),
  "flux-long": fluxLong(N),
  colonne: colonne(N),
  "flux-court": fluxCourt(N),
  effondrement: effondrement(N),
  calme: calme(N),
};
