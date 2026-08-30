// ============================================================================================
// LES GESTES, EN NOMBRES
// ============================================================================================
// Convention d'angle du socle (cf. tete de StickFigure.tsx) :
//   0 = le membre PEND · 90 = HORIZONTAL vers l'avant · 180 = LEVE a la verticale.
//
// ⭐ Comparer avec `gestes/GestesExpressifs16x9.tsx` : le meme geste "lever le bras" y fait
// ~70 lignes de code raisonne. Ici il fait 5 lignes de nombres, et se REGLE en changeant un
// nombre au lieu de reprogrammer.

import { DEBOUT, type Partition } from "./poses";

// SALUER — le bras monte vite, retombe mou, deux fois. Repos bas entre les cycles.
export const SALUER: Partition = {
  nom: "saluer",
  duree: 90,
  base: DEBOUT,
  cles: [
    { t: 0,  arm1Deg: 12, arm2Deg: -8, torsoDeg: 0 },
    { t: 14, arm1Deg: 118, arm2Deg: -10, torsoDeg: 2 },
    { t: 28, arm1Deg: 96, arm2Deg: -10, torsoDeg: 2 },
    { t: 42, arm1Deg: 118, arm2Deg: -10, torsoDeg: 2 },
    { t: 58, arm1Deg: 96, arm2Deg: -10, torsoDeg: 2 },
    { t: 74, arm1Deg: 12, arm2Deg: -8, torsoDeg: 0 },
    { t: 90, arm1Deg: 12, arm2Deg: -8, torsoDeg: 0 },
  ],
};

// POINTER — un seul bras part a l'horizontale et TIENT. C'est le maintien qui designe.
export const POINTER: Partition = {
  nom: "pointer",
  duree: 90,
  base: DEBOUT,
  cles: [
    { t: 0,  arm1Deg: 12, arm2Deg: -8, torsoDeg: 0, headTuck: 0 },
    { t: 12, arm1Deg: 94, arm2Deg: -12, torsoDeg: 4, headTuck: -0.25 },
    { t: 66, arm1Deg: 92, arm2Deg: -12, torsoDeg: 4, headTuck: -0.25 },
    { t: 82, arm1Deg: 12, arm2Deg: -8, torsoDeg: 0, headTuck: 0 },
    { t: 90, arm1Deg: 12, arm2Deg: -8, torsoDeg: 0, headTuck: 0 },
  ],
};

// ACQUIESCER — la tete seule. Prouve qu'une partition n'a pas besoin de toucher les bras.
export const ACQUIESCER: Partition = {
  nom: "acquiescer",
  duree: 60,
  base: DEBOUT,
  cles: [
    { t: 0,  headTuck: 0, torsoDeg: 0 },
    { t: 10, headTuck: 1.15, torsoDeg: 4 },
    { t: 20, headTuck: 0, torsoDeg: 0 },
    { t: 30, headTuck: 1.15, torsoDeg: 4 },
    { t: 42, headTuck: 0, torsoDeg: 0 },
    { t: 60, headTuck: 0, torsoDeg: 0 },
  ],
};

export const CATALOGUE = { SALUER, POINTER, ACQUIESCER };
