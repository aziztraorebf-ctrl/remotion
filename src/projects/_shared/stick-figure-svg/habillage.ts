// =============================================================================================
// ⭐⭐ HABILLAGE — LA BRIQUE A UTILISER POUR TOUT VETEMENT / ACCESSOIRE / OBJET TENU
//
// ⛔ NE RECALCULEZ JAMAIS LA GEOMETRIE DU CORPS A LA MAIN POUR POSER UN VETEMENT.
// Utilisez `bodyPoints()` ci-dessous. C'est LA source de verite : elle applique exactement les
// memes formules et les memes constantes que <Figure> (StickFigure.tsx), donc un overlay place
// avec ces points colle au corps frame pour frame — y compris pendant le bob de la marche.
//
// COUT REEL DE L'OUBLI (vecu 2026-07-28, scene du port) : un habillage improvise a la main a
// produit un vetement qui avalait le torse et les deux bras (aplat opaque de 22-29px sur un
// buste de 6.6px), lu comme "deux personnages superposes". 3 tentatives ratees + 1 agent dedie,
// pour un probleme que cette brique resolvait deja. La regle projet "ameliorer l'existant avant
// de creer" existe exactement pour ca.
//
// ---------------------------------------------------------------------------------------------
// COMMENT HABILLER UN PERSONNAGE — 3 NIVEAUX, DU PLUS SIMPLE AU PLUS LIBRE
// ---------------------------------------------------------------------------------------------
//
// NIVEAU 1 — un role deja fait (mineur / commercante / fonctionnaire / agriculteur) :
//     import { PersonnageRole } from "./identite/Roles";
//     <PersonnageRole x={x} y={sol} phase={phase} scale={sc} role="mineur" couleur={encre} />
//   -> corps + tenue + objet tenu + bras avant par-dessus. Rien a calculer.
//
// NIVEAU 2 — un vetement NEUF sur le corps du socle :
//     const bp = bodyPoints(phase, walkParams, torsoDeg);
//     <Figure ... hideArm1 />            {/* 1. corps nu, bras avant OMIS            */}
//     <MonVetement bp={bp} />            {/* 2. le vetement recouvre le corps        */}
//     <MonObjet main={...} />            {/* 3. l'objet tenu, sous la main           */}
//     <line x1={bp.sx} ... />            {/* 4. bras avant REDESSINE par-dessus      */}
//   ⛔ CET ORDRE EST OBLIGATOIRE (voir ORDRE_HABILLAGE ci-dessous).
//
// NIVEAU 3 — accessoire simple (chapeau, brassard, sac a dos) sans toucher aux bras :
//     const bp = bodyPoints(phase, walkParams, torsoDeg);
//     -> ancrer sur bp.headCx/headCy (tete), bp.sx/sy (epaule), bp.hx/hy (hanche).
//   Pas besoin de hideArm1 tant que l'accessoire ne recouvre pas le torse.
//
// ---------------------------------------------------------------------------------------------
// LES 4 REGLES QUI ONT COUTE CHER (chacune vient d'un bug rendu, pas d'une preference)
// ---------------------------------------------------------------------------------------------
//  1. ORDRE ARRIERE->AVANT. Dessiner la Figure ENTIERE puis le vetement par-dessus met le
//     vetement DERRIERE le personnage ("on voit le corps a travers le vetement"). Seul le bras
//     AVANT passe devant le vetement — jamais le buste ni les jambes.
//  2. LARGEUR. Le buste ne fait que ~6.6px a l'ecran a echelle 1.5, les bras ~5.9px. Un vetement
//     large de 22px les AVALE. Mesurer, ne pas estimer : un vetement large est une occlusion.
//  3. LE VETEMENT SUIT LE BOB. bodyPoints() l'applique deja (hy = HIP_Y_STANDING - bob). Un
//     overlay ancre a un point FIXE pendant que le corps rebondit se detache visiblement.
//  4. LA TUNIQUE NE DESCEND PAS SOUS ~hy+6. Plus bas, elle masque le ciseau des jambes — or le
//     mouvement des jambes EST la lecture de la marche.
// =============================================================================================

import {
  rad,
  TORSO_LENGTH,
  HIP_Y_STANDING,
  WALK_DEFAULT,
  type WalkParams,
} from "./StickFigure";

// Les points d'ancrage du corps, dans le repere LOCAL du personnage (avant scale).
// Memes noms que dans identite/Roles.tsx : les deux sont interchangeables.
export type BodyPoints = {
  hx: number; hy: number;         // hanche
  sx: number; sy: number;         // epaule (haut du buste)
  headCx: number; headCy: number; // centre de la tete (rayon = HEAD_RADIUS)
  torso: number;                  // angle du buste en degres
};

// ⭐ LA fonction a appeler. Reproduit EXACTEMENT le calcul interne de <Figure>.
// `phase` : la phase de marche [0,1[ (celle passee a <Figure>).
// `p`     : les memes WalkParams que ceux passes a <Figure> (bobAmp/lean/hipDrop comptent).
// `torsoOverride` : si la pose force un torsoDeg, le passer ici (sinon P.lean est utilise).
export const bodyPoints = (
  phase: number,
  p?: Partial<WalkParams>,
  torsoOverride?: number,
): BodyPoints => {
  const P = { ...WALK_DEFAULT, ...p };
  const a = phase * Math.PI * 2;
  const bob = Math.abs(Math.cos(a)) * P.bobAmp;
  const hx = 0;
  const hy = HIP_Y_STANDING - bob + P.hipDrop;
  const torso = torsoOverride !== undefined ? torsoOverride : P.lean;
  const sx = hx + Math.sin(rad(torso)) * TORSO_LENGTH;
  const sy = hy - Math.cos(rad(torso)) * TORSO_LENGTH;
  const headLen = 12;
  const headCx = sx + Math.sin(rad(torso)) * headLen + 3 * Math.cos(rad(torso));
  const headCy = sy - Math.cos(rad(torso)) * headLen + 3 * Math.sin(rad(torso));
  return { hx, hy, sx, sy, headCx, headCy, torso };
};

// Largeurs de reference MESUREES (unites locales) — bornes hautes a ne pas depasser sans
// verifier au rendu que le corps reste lisible dessous.
export const LARGEUR_REF = {
  buste: 4.5,          // le trait de buste du socle
  brasEpaisseur: 4,    // le trait de bras
  vetementEpaule: 5.2, // demi-largeur MAX d'un vetement a l'epaule
  vetementHanche: 7.2, // demi-largeur MAX a la hanche
} as const;

// L'ordre de rendu, sous forme exploitable (documentation executable : si un jour on ecrit un
// helper d'assemblage, il consomme cette liste au lieu de re-decrire l'ordre en commentaire).
export const ORDRE_HABILLAGE = [
  "1. <Figure hideArm1 /> — corps nu, bras AVANT omis",
  "2. tenue — recouvre buste/jambes/tete",
  "3. objet tenu — sous la main",
  "4. bras avant redessine — PAR-DESSUS tenue et objet",
] as const;
