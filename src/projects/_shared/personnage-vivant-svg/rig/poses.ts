/**
 * poses.ts — calcul de POSE d'un stick figure d'encre (R&D validee 2026-06-30, cacao).
 * Source de verite UNIQUE de la cinematique : utilise par le rig (StickRig) ET par les scenes
 * (pour coller un objet EXACTEMENT sur la main — zero divergence, plus de flottement).
 *
 * Repere LOCAL : origine (0,0) au SOL sous le bassin. y NEGATIF = vers le haut. Avant scale(facing).
 * Animation = fonction PURE des props (aucune frame ici). Le parent passe walkPhase (typiquement la frame).
 *
 * Principes appliques (feuille de route Gemini + web, validee a 100% par Aziz) :
 *  - FOOT-PLANT : le pied au sol ne glisse pas (gere au rendu dans StickRig via clamp sol).
 *  - COMPENSATION DU BASSIN au penche : le bassin RECULE + DESCEND quand le torse bascule (anti-bascule-arriere).
 *  - BRAS de recolte : pointe vers le SOL-avant (angle bas ~22°, INDEPENDANT du penche du torse).
 */

// dimensions du squelette (unites locales)
export const RIG = {
  HIP: 150,    // hauteur du bassin au repos
  LEG: 150,    // jambe (hanche->pied), genou au milieu
  TORSO: 150,  // bassin->epaules
  ARM: 120,    // epaule->main
  HEAD_R: 24,
} as const;

// easeInOutCubic (Gemini : jamais lineaire sur le penche)
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export type PoseInput = {
  walkPhase?: number; // phase continue (frame). cadence interne sin(walkPhase/6) — validee par Aziz
  moving?: boolean;   // true = marche ; false = arret (balancier eteint). ⚠️ CUT BRUTAL — voir moveAmt.
  moveAmt?: number;   // 0..1 amplitude CONTINUE du pas (remplace moving). Priorite sur moving si fourni.
                       // La scene doit faire decroitre moveAmt vers 0 sur ~12-15 frames AVANT l'arret complet
                       // (ex. interpolate(frame, [fArrive-15, fArrive], [1,0])) pour que le swing revienne
                       // a sa position neutre au lieu de se figer en pleine foulee (bug corrige 2026-07-01).
  bend?: number;      // 0 debout .. 1 penche (se baisser)
  armReach?: number;  // 0..1 extension du bras avant vers le sol-avant (ramasser)
  offerReach?: number; // 0..1 extension du bras avant vers l'HORIZONTALE (tendre/offrir un objet a qqn en face)
};

export type Pose = {
  b: number; r: number; be: number; phase: number; swingDeg: number;
  hipX: number; hipY: number; torsoDeg: number; shX: number; shY: number;
  frontHandX: number; frontHandY: number;
};

export function computePose({ walkPhase = 0, moving = true, moveAmt, bend = 0, armReach = 0, offerReach = 0 }: PoseInput): Pose {
  const { HIP, LEG, TORSO, ARM } = RIG;
  const b = Math.max(0, Math.min(1, bend));
  const r = Math.max(0, Math.min(1, armReach));
  const o = Math.max(0, Math.min(1, offerReach));
  const be = easeInOutCubic(b);

  const m = Math.max(0, Math.min(1, moveAmt ?? (moving ? 1 : 0)));
  const phase = walkPhase / 6;
  const stepAmp = m * (1 - b);
  const swing = Math.sin(phase) * stepAmp;
  const swingDeg = swing * 30; // ouverture jambes max ±30°

  const bobAmp = 0.07 * LEG; // bob du bassin ~7% de la jambe (poids)
  const hipBob = Math.abs(Math.sin(phase)) * bobAmp * stepAmp;
  const torsoDeg = be * 70;                 // 0 (vertical) -> 70° vers l'avant
  const hipBack = -(torsoDeg / 90) * 70;    // COMPENSATION : bassin recule
  const hipDrop = be * 34;                   // bassin descend (accroupissement leger)
  const hipX = hipBack;
  const hipY = -HIP + hipBob + hipDrop;

  const torsoRad = (torsoDeg * Math.PI) / 180;
  const shX = hipX + Math.sin(torsoRad) * TORSO;
  const shY = hipY - Math.cos(torsoRad) * TORSO;

  // bras avant (la main qui agit). angle 0 = vers le bas ; + = vers l'avant ; ~90 = horizontal (tendu devant).
  const frontWalkDeg = swingDeg * 0.6;
  const frontReachDeg = 22;  // vers le SOL-avant (ramasser), independant du torse
  const frontOfferDeg = 88;  // vers l'HORIZONTALE (tendre/offrir a qqn en face), independant du torse
  // offerReach a priorite (ecrase armReach/marche) : un bras qui offre ne se melange pas a la marche/recolte.
  const frontArmDeg = o > 0
    ? frontWalkDeg * (1 - o) + frontOfferDeg * o
    : frontWalkDeg * (1 - r) + frontReachDeg * r;
  const frontRad = (frontArmDeg * Math.PI) / 180;
  const frontHandX = shX + Math.sin(frontRad) * ARM;
  const frontHandY = shY + Math.cos(frontRad) * ARM;

  return { b, r, be, phase, swingDeg, hipX, hipY, torsoDeg, shX, shY, frontHandX, frontHandY };
}
