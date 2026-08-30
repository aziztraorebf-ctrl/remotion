// ============================================================================================
// PARTITION DE GESTE — un geste est une TABLE DE NOMBRES, pas du code
// ============================================================================================
// ⭐ POURQUOI (mesure du 2026-08-29). Un geste ecrit en code coute ~70 lignes de raisonnement
// (ressorts, interpolations, cas particuliers) et n'est pas reutilisable : le suivant repart de
// zero. Le meme geste, chez un professionnel du Lottie, est une liste de cles : 7 nombres par
// membre. C'est ce format-la qu'on reprend -- pas ses VALEURS (calibrees pour ses proportions,
// elles ne transportent pas), seulement sa FORME.
//
// ⛔ Ce que la mesure a aussi montre : il n'existe AUCUN standard entre personnages pro. Sur 8
// pieces du corpus, le nombre de nulls va de 0 a 3, les precomps de 0 a 6, les formes animees de
// 0 a 11. On ne peut donc pas apprendre "le" format de l'industrie -- d'ou l'interet d'avoir le
// NOTRE, applique a un socle qu'on maitrise.
//
// GAIN VISE : ajouter un geste = poser une dizaine de nombres, et le MODIFIER = changer un
// nombre (pas reprogrammer). C'est l'argument "chaque geste est un parametre".

import { interpolate } from "remotion";
import type { Pose } from "../StickFigure";

// Une cle : la frame, puis les articulations touchees. Tout champ absent n'est pas pilote.
export type Cle = { t: number } & Pose;

export type Partition = {
  nom: string;
  duree: number;      // frames — au-dela, on reboucle
  cles: Cle[];
  // ⭐ Pose de fond appliquee sous toutes les cles. Sans elle, on recopie les memes
  // articulations inertes sur chaque ligne -- exactement la verbosite qu'on veut supprimer.
  base?: Pose;
};

// ⛔ STATION DEBOUT (mesure 2026-08-29). Avec phase=0 et sans leg*Deg, les deux jambes se
// superposent : le socle documente ce plancher (~16 deg de swing) et le corps se rend en UN
// SEUL trait. Une partition qui ne marche pas doit donc poser ses jambes explicitement.
export const DEBOUT: Pose = { leg1Deg: 7, leg2Deg: -7 };

// ⛔ PLAGES (lecon payee sur le douanier, 2026-08-29). Un membre dessine a plat casse au-dela
// d'une amplitude ; un stick figure n'a pas ce mur, mais garder des bornes evite la pantomime
// (verdict Aziz sur la v1 du geste "alerte" : "trop exagere").
export const PLAGES: Record<string, [number, number]> = {
  arm1Deg: [-30, 170],
  arm2Deg: [-30, 170],
  torsoDeg: [-25, 25],
  headTuck: [-10, 14],
};

const CHAMPS: (keyof Pose)[] = [
  "hipY", "torsoDeg", "leg1Deg", "leg2Deg", "arm1Deg", "arm2Deg",
  "arm1Len", "arm2Len", "headTuck", "leg1Knee", "leg2Knee",
];

// ⭐ ASYMETRIE (mesure du chien, 2026-08-29) : le mouvement naturel monte vite et retombe mou.
// Un aller-retour symetrique donne un essuie-glace. On applique donc une courbe differente
// selon qu'on MONTE vers la cle ou qu'on en REDESCEND.
const doux = (u: number, monte: boolean): number =>
  monte ? 1 - Math.pow(1 - u, 2.2) : Math.pow(u, 1.6);

/** Lit une partition a la frame donnee et rend la Pose interpolee. */
export const poseA = (part: Partition, frame: number): Pose => {
  const cles = part.cles;
  if (cles.length === 0) return {};
  const t = ((frame % part.duree) + part.duree) % part.duree;

  let a = cles[0];
  let b = cles[cles.length - 1];
  for (let i = 0; i < cles.length - 1; i++) {
    if (cles[i].t <= t && t <= cles[i + 1].t) {
      a = cles[i];
      b = cles[i + 1];
      break;
    }
  }
  if (t <= cles[0].t) return { ...(part.base ?? {}), ...extrait(cles[0]) };
  if (t >= b.t && b === cles[cles.length - 1] && a === cles[0] && cles.length > 1) {
    return { ...(part.base ?? {}), ...extrait(cles[cles.length - 1]) };
  }

  const span = b.t - a.t;
  const u = span <= 0 ? 0 : (t - a.t) / span;
  const out: Pose = { ...(part.base ?? {}) };
  for (const c of CHAMPS) {
    const va = a[c] as number | undefined;
    const vb = b[c] as number | undefined;
    if (va === undefined && vb === undefined) continue;
    const d = va ?? vb ?? 0;
    const f = vb ?? va ?? 0;
    const monte = Math.abs(f) > Math.abs(d);
    let v = interpolate(doux(u, monte), [0, 1], [d, f]);
    const lim = PLAGES[c as string];
    if (lim) v = Math.max(lim[0], Math.min(lim[1], v));
    (out[c] as number) = v;
  }
  // les cibles de main (IK) ne s'interpolent pas comme des angles : on prend la cle la plus proche
  const m = u < 0.5 ? a : b;
  if (m.hand1) out.hand1 = m.hand1;
  if (m.hand2) out.hand2 = m.hand2;
  return out;
};

const extrait = (c: Cle): Pose => {
  const out: Pose = {};
  for (const k of CHAMPS) if (c[k] !== undefined) (out[k] as number) = c[k] as number;
  if (c.hand1) out.hand1 = c.hand1;
  if (c.hand2) out.hand2 = c.hand2;
  return out;
};

/** Averti si une partition sort des plages (garde-fou, pas blocage). */
export const verifier = (part: Partition): string[] => {
  const avis: string[] = [];
  for (const c of part.cles) {
    for (const [champ, [lo, hi]] of Object.entries(PLAGES)) {
      const v = c[champ as keyof Pose] as number | undefined;
      if (v !== undefined && (v < lo || v > hi)) {
        avis.push(`${part.nom} f${c.t} ${champ}=${v} hors plage [${lo},${hi}]`);
      }
    }
  }
  return avis;
};
