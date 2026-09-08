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
 * ⭐ Durees etirees d'un facteur 1,1204 le 2026-09-08, pour caler sur la narration
 * GeoAfrique generee (23,08s reel, mesure ffprobe). Rythme RELATIF entre etats
 * intact — memes proportions que le decoupage valide sur l'animatic gris (20,6s) —
 * seule la duree absolue change. La voix porte le sens narratif, elle dicte le
 * tempo plutot que l'inverse (decision Aziz). Texte source :
 * out/_r-and-d/cauri/son/narration-texte-v2.txt (hors repo, gitignore).
 */
export const ETATS = [
  { id: 1, nom: "coquille", duree: 2.241, dit: "l'objet precieux" },
  { id: 2, nom: "semis", duree: 2.913, dit: "la rarete" },
  { id: 3, nom: "flux-long", duree: 5.826, dit: "la distance qui fait la valeur" },
  { id: 4, nom: "colonne", duree: 3.361, dit: "la valeur" },
  { id: 5, nom: "flux-court", duree: 2.689, dit: "1845 : le raccourci" },
  { id: 6, nom: "effondrement", duree: 3.137, dit: "l'effondrement" },
  { id: 7, nom: "calme", duree: 2.913, dit: "fin, permet la boucle" },
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

/**
 * Nombre d'exemplaires. Constant sur toute la piece — c'est ce qui interdit la coupe.
 *
 * ⭐ Baisse de 260 a 90 le 2026-09-06, apres le 1er rendu de la piece dessinee.
 * 260 etait un heritage de l'animatic, ou chaque particule etait un DISQUE de 4-7 px.
 * Avec des coquilles dessinees (10-34 px), la meme quantite sature : le semis lisait
 * l'abondance au lieu de la RARETE (le propos meme du § 4), et les grains du flux
 * fusionnaient en amas au lieu de rester des coquilles distinctes (mesure : zoom x8
 * sur l'etat 3, les ovales se recouvrent).
 *
 * ⭐ Le vrai gain n'est pas la separation, c'est la TAILLE : a 90 exemplaires on peut
 * porter le grain au-dessus du seuil de 18 px, donc GARDER la fente dans les flux.
 * R6 (la coquille reste reconnaissable dans ses 5 roles) redevient visible, alors
 * qu'a 260 la primitive etait perdue dans 4 etats sur 7.
 */
export const N = 90;

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

/**
 * ETAT 6 — l'effondrement : la colonne s'ecrase et fait un TAS.
 *
 * ⭐ Corrige le 2026-09-06 apres le 1er rendu dessine. La version precedente tirait x
 * uniformement sur 76 % de la largeur : les debris s'etalaient en bande reguliere sur
 * tout l'ecran — ca lisait « deplacement lateral », pas « effondrement ». Ce qui
 * manquait n'etait pas un dosage mais la FORME du tas.
 *
 * Une colonne qui s'ecroule retombe AUTOUR DE SON PIED : dense au centre (la ou la
 * colonne se tenait, VB.w * 0.5), se rarefiant vers les bords. On tire donc un ecart
 * au centre avec une puissance > 1, qui concentre pres de zero, et le tas est d'autant
 * plus HAUT qu'on est pres du centre — c'est le profil d'un tas, pas d'un tapis.
 */
const effondrement = (n: number): Cible[] => {
  const r = alea(97);
  const sol = VB.h * 0.83;
  const pied = VB.w * 0.5; // la colonne de l'etat 4 se tient au centre
  return Array.from({ length: n }, () => {
    // ecart au pied : puissance 1,9 => beaucoup de debris pres du centre, peu au loin
    const ecart = Math.pow(r(), 1.9) * VB.w * 0.34;
    const cote = r() < 0.5 ? -1 : 1;
    const x = pied + cote * ecart;
    // hauteur du tas : maximale au pied, nulle aux extremites
    const proximite = 1 - ecart / (VB.w * 0.34);
    const hauteurTas = Math.pow(proximite, 1.4) * VB.h * 0.17;
    return { x, y: sol - r() * hauteurTas };
  });
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

// --------------------------------------------------------------------------
// CAMERA — test du dispositif IRIS (R5 de l'analyse continuous-flow).
// Mesure sur la reference : le cadre est fixe ~55 % du temps, et TOUT changement
// d'echelle se produit PENDANT une transition, jamais en continu. On reprend
// cette regle telle quelle : la camera ne bouge QUE sur les 2 passages ci-dessous,
// et reste totalement fixe (zoom = 1) partout ailleurs — y compris pendant les
// 5 autres transitions, qui restent portees par le mouvement des particules seul.
// --------------------------------------------------------------------------

/**
 * Les 2 seuls passages ou la camera bouge, avec le zoom de DEPART et d'ARRIVEE.
 * zoom = 1 -> cadre normal. zoom > 1 -> on s'approche (la coquille deborde le cadre,
 * le semis qu'elle contenait devient visible en grand). zoom < 1 -> on s'eloigne.
 *
 * 1->2 : on ETAIT au contact de la coquille seule (zoom serre), on s'eloigne
 *        jusqu'au cadre normal, revelant au passage le semis deja en place.
 * 6->7 : symetrique inverse — on se rapproche jusqu'a ne plus voir qu'une coquille,
 *        exactement le cadrage de l'etat 1. C'est ce qui rend la boucle gratuite.
 */
export const IRIS = [
  { deEtat: "coquille", versEtat: "semis", zoomDepart: 2.4, zoomArrivee: 1.0 },
  { deEtat: "effondrement", versEtat: "calme", zoomDepart: 1.0, zoomArrivee: 2.4 },
] as const;

/**
 * Calcule le zoom courant (1 = cadre normal) pour un instant t (secondes).
 * En dehors des 2 fenetres IRIS : toujours 1 — la camera ne bouge pas ailleurs,
 * conformement a la mesure (cadre fixe hors transition).
 */
export const zoomCamera = (t: number): number => {
  for (const passage of IRIS) {
    const iVers = ETATS.findIndex((e) => e.nom === passage.versEtat);
    const debut = BORNES[iVers]; // le zoom se joue PENDANT la transformation de l'etat d'arrivee
    const dureeTransfo = ETATS[iVers].duree * PART_TRANSFORMATION;
    const fin = debut + dureeTransfo;
    if (t >= debut - 1e-6 && t <= fin) {
      const k = dureeTransfo > 0 ? (t - debut) / dureeTransfo : 1;
      const kk = k * k * (3 - 2 * k); // meme adoucissement que le reste de l'animatic
      return passage.zoomDepart + (passage.zoomArrivee - passage.zoomDepart) * kk;
    }
    // ⛔ TENIR la valeur AVANT la fenetre (corrige le 2026-09-06).
    // Avant : on retombait a 1 hors fenetre, y compris AVANT le 1er passage — donc le
    // zoom sautait de 1,00 a 2,40 en UNE frame a l'entree du raccord. Mesure sur le
    // rendu v4 : la coquille passe de 240 px a 576 px entre t=1,9 s et t=2,0 s. Un recul
    // qui commence par une coupe, sur une piece dont la contrainte est le ZERO COUPE.
    // L'etat 1 doit etre TENU au zoom de depart : on est au contact de la coquille,
    // et c'est de la qu'on recule.
    //
    // ⛔ On ne sort PAS de la boucle pour un t situe APRES la fenetre : il faut laisser
    // les passages suivants s'exprimer. Une 1re version faisait `if (t > fin) return
    // zoomArrivee` ici — le 2e IRIS (6->7) ne se declenchait alors jamais, le zoom
    // restait plat a 1,0 jusqu'a la fin (verifie par simulation sur les 618 frames).
    // La valeur d'apres-derniere-fenetre est donc rendue APRES la boucle.
    if (t < debut) return passage.zoomDepart;
  }
  // apres la derniere fenetre : on tient la valeur d'arrivee du dernier passage joue,
  // sinon la boucle de fin (6->7) se refermerait elle aussi par une coupe.
  const dernier = IRIS[IRIS.length - 1];
  return dernier.zoomArrivee;
};
