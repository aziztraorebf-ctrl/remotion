/**
 * multiDirection.ts — briques PARTAGEES pour les vues 3/4, DOS et FACE (systeme "8 directions", palier 1
 * complete 2026-07-02 : profil (StickRig.tsx historique) + 3/4 + dos + face, validees Aziz en mouvement,
 * chacune apres revue croisee Gemini 3.1 Pro + GPT-5.5).
 *
 * Extrait de rnd-8dir/Proto3Quarter.tsx + ProtoBack.tsx + ProtoFace.tsx (qui dupliquaient chacun leur
 * propre projection) pour que la SCENE NARRATIVE (perso qui change de vue en cours de mouvement,
 * avance/recule/tourne) puisse piloter les 4 vues depuis UNE SEULE source de verite de projection.
 *
 * ⛔ computePose() (poses.ts) reste la SOURCE DE VERITE du TIMING (bassin/epaule/bras). Ce fichier ne fait
 * QUE la PROJECTION (comment une jambe/un torse se dessine selon l'angle de vue) — zero logique de frame.
 *
 * 2 FAMILLES DE PROJECTION DE JAMBE (regles Gemini+GPT 2026-07-01/02, ne PAS reinventer) :
 *  - LATERALE (profil, 3/4) : le pas se lit sur l'axe X ecran (angle d'ouverture). En 3/4, near/far
 *    recoivent une longueur ET une amplitude DIFFERENTES (anti-symetrie, sinon ca relit "profil compresse").
 *  - PROFONDEUR (dos, face) : le pas se lit sur l'axe Y ecran (raccourci/foreshortening), PAS X. Pied qui
 *    avance vers le fond (dos) ou vers la camera (face) change l'axe Y ; X reste une piste etroite fixe.
 *    Dos et face partagent la MEME formule, seul le SIGNE de `advance` s'inverse (avance vers la camera vs
 *    vers le fond = directions opposees sur l'ecran).
 */
import { RIG } from "./poses";

export type ViewMode = "3quarter" | "back" | "face";

export type LegPoint = { kx: number; ky: number; fx: number; fy: number };

// ---- projection LATERALE (3/4) : near/far distincts en longueur ET amplitude, foot-plant ----
export type QuarterLegParams = {
  strideRatio: number; // signe + amplitude (near=1, far=-1*STRIDE_FAR_RATIO)
  lenRatio: number;    // 1.0 near, ~0.88 far (foreshortening)
  hipX: number; hipY: number;
  swingDeg: number; kneeBendBase: number;
};
export function quarterLegPath({ strideRatio, lenRatio, hipX, hipY, swingDeg, kneeBendBase }: QuarterLegParams): LegPoint {
  const { LEG } = RIG;
  const legLen = LEG * lenRatio;
  const hipAngle = swingDeg * strideRatio;
  const rad = (hipAngle * Math.PI) / 180;
  const kx = hipX + Math.sin(rad) * (legLen * 0.5);
  const ky = hipY + Math.cos(rad) * (legLen * 0.5);
  const shinRad = ((hipAngle - kneeBendBase * lenRatio) * Math.PI) / 180;
  const fx = kx + Math.sin(shinRad) * (legLen * 0.5);
  let fy = ky + Math.cos(shinRad) * (legLen * 0.5);
  if (fy > 0) fy = 0; // FOOT-PLANT
  return { kx, ky, fx, fy };
}

// ---- projection PROFONDEUR (dos/face) : stride en Y, X quasi-fixe (regle GPT+Gemini anti-pas-chasse) ----
export type DepthLegParams = {
  side: 1 | -1;          // -1 gauche, +1 droite (piste X)
  phaseOffset: number;   // dephasage entre les 2 jambes (Math.PI = opposition)
  hipX: number; hipY: number;
  phase: number;
  advanceSign: 1 | -1;   // +1 = face (avance vers camera -> Y augmente/descend ecran)
                          // -1 = dos (avance vers le fond -> Y diminue/monte ecran)
};
const TRACK_WIDTH = 0.16, LATERAL_SWAY = 0.035, DEPTH_AMP = 0.20, LIFT_AMP = 0.08, KNEE_FLARE = 0.035;
export function depthLegPath({ side, phaseOffset, hipX, hipY, phase, advanceSign }: DepthLegParams): LegPoint {
  const { LEG } = RIG;
  const p = phase + phaseOffset;
  const advance = Math.sin(p) * advanceSign;
  const swing = Math.max(0, Math.cos(p));
  const trackX = hipX + side * TRACK_WIDTH * LEG * 0.5;
  const footX = trackX + side * LATERAL_SWAY * LEG * Math.sin(p) * 0.4;
  const footY = hipY + LEG * 0.5 + DEPTH_AMP * LEG * advance - LIFT_AMP * LEG * swing;
  const kneeX = (hipX + footX) / 2 + side * KNEE_FLARE * LEG * swing;
  const kneeY = (hipY + footY) / 2 - 0.06 * LEG * swing;
  let fy = footY;
  if (fy > 0) fy = 0; // FOOT-PLANT
  return { kx: kneeX, ky: kneeY, fx: footX, fy };
}

// ---- TORSE : 4 points distincts (2 epaules + 2 hanches), formule commune 3/4 ET dos (near/far) ----
export type TorsoQuad = { shBackX: number; shBackY: number; shFrontX: number; shFrontY: number; hipBackX: number; hipBackY: number; hipFrontX: number; hipFrontY: number };
export function torsoQuad(shX: number, hipX: number, offsetX: number, offsetYSh: number, offsetYHip: number, shYBase: number, hipYBase: number): TorsoQuad {
  return {
    shFrontX: shX + offsetX, shFrontY: shYBase + offsetYSh,
    shBackX: shX - offsetX, shBackY: shYBase - offsetYSh,
    hipFrontX: hipX + offsetX, hipFrontY: hipYBase + offsetYHip,
    hipBackX: hipX - offsetX, hipBackY: hipYBase - offsetYHip,
  };
}
