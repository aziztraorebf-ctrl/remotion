/**
 * Proto3Quarter — PROTOTYPE ISOLE R&D (session 2026-07-01, piste A "8 directions").
 * Teste la vue 3/4 (la plus dure des 3 vues du 1er palier : profil acquis / 3-4 / dos).
 * ⛔ Ne touche PAS a StickRig.tsx / poses.ts — computePose() reste la SOURCE DE VERITE du TIMING,
 * seul le TRACE (silhouette/projection) change. Decision Aziz : prototype isole avant integration.
 *
 * v2 (apres avis EXTERNES convergents Gemini 3.1 Pro + GPT-5.5, 2026-07-01, meme methode que
 * foot-plant/compensation-bassin) : le v1 ne faisait qu'ECRASER horizontalement le profil (X seul) ->
 * jambes en X symetrique, torse noye. Les 2 modeles convergent sur la MEME correction :
 *  - Hanches et epaules ont 2 points DISTINCTS (Near/Far), decales en X *ET* en Y (pas juste X).
 *  - Jambe FAR : plus courte (longueur ~0.85-0.92x), amplitude de foulee reduite (~0.6x), opacite/trait
 *    plus legers (simule l'eloignement).
 *  - Torse = polygone OPAQUE (pas juste semi-transparent) qui sert de MASQUE entre far et near.
 *  - Draw-order strict : bras FAR -> jambe FAR -> torse -> tete -> jambe NEAR -> bras NEAR.
 *  - Timing/phases INCHANGES (computePose ne sait rien de la vue — deja notre architecture).
 *
 * ⚠️ Remarque Aziz (2026-07-01) : le vrai test n'est PAS la pose statique mais la capacite du rig a
 * BOUGER dans plusieurs directions de facon credible. Ce fichier reste donc un banc d'essai anime
 * (marche en boucle), a juger en MOUVEMENT, pas sur une frame figee.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { computePose, RIG } from "../rig/poses";

const INK = "#2b2117";
const PARCH = "#e8dcc0";
const STRAW = "#d1b46b";
const STRAW_D = "#c39a4f";

// ---- constantes de projection 3/4 (ratios recommandes par Gemini+GPT, a tweaker visuellement) ----
const SHOULDER_OFFSET_X = 22; // demi-largeur epaules visible (near/far ecartees sur X)
const SHOULDER_OFFSET_Y = 5;  // near plus BAS (plus proche camera), far plus HAUT (plus loin)
const HIP_OFFSET_X = 14;
const HIP_OFFSET_Y = 3;
const LEG_LEN_FAR_RATIO = 0.88;   // jambe FAR plus courte que NEAR (foreshortening)
const STRIDE_FAR_RATIO = 0.6;     // amplitude de foulee FAR reduite vs NEAR
const FAR_OPACITY = 0.72;         // membres FAR plus legers (simule l'eloignement)
const FAR_STROKE_RATIO = 0.85;

export const PASSER3Q_FRAMES = 180;

export const Proto3Quarter: React.FC = () => {
  const frame = useCurrentFrame();
  const { LEG, HEAD_R, ARM } = RIG;
  const W = 1920, H = 1080;
  const GROUND_Y = 700;
  const MAN_S = 1.4;

  const pose = computePose({ walkPhase: frame, moveAmt: 1, bend: 0 });
  const { phase, swingDeg, hipY: hipYBase, shY: shYBase } = pose;

  // ---- TORSE : 2 points distincts (near/far) par epaule ET par hanche, decales X ET Y ----
  const shXNear = SHOULDER_OFFSET_X, shXFar = -SHOULDER_OFFSET_X;
  const shYNear = shYBase + SHOULDER_OFFSET_Y, shYFar = shYBase - SHOULDER_OFFSET_Y;
  const hipXNear = HIP_OFFSET_X, hipXFar = -HIP_OFFSET_X;
  const hipYNear = hipYBase + HIP_OFFSET_Y, hipYFar = hipYBase - HIP_OFFSET_Y;

  // ---- JAMBES : meme cinematique (swingDeg/kneeBend/foot-plant) que StickRig, mais NEAR et FAR
  // recoivent une amplitude ET une longueur DIFFERENTES (regle Gemini+GPT anti-X-symetrique) ----
  const kneeBendBase = Math.max(0, Math.cos(phase)) * 14;
  function legPath(strideRatio: number, lenRatio: number, hipX: number, hipY: number) {
    const legLen = LEG * lenRatio;
    const hipAngle = swingDeg * strideRatio;
    const rad = (hipAngle * Math.PI) / 180;
    const kx = hipX + Math.sin(rad) * (legLen * 0.5);
    const ky = hipY + Math.cos(rad) * (legLen * 0.5);
    const shinRad = ((hipAngle - kneeBendBase * lenRatio) * Math.PI) / 180;
    const fx = kx + Math.sin(shinRad) * (legLen * 0.5);
    let fy = ky + Math.cos(shinRad) * (legLen * 0.5);
    if (fy > 0) fy = 0; // FOOT-PLANT (identique StickRig)
    return { kx, ky, fx, fy };
  }
  // near et far sont en PHASE OPPOSEE (une jambe avance pendant que l'autre recule, comme en marche reelle)
  const legNear = legPath(1, 1.0, hipXNear, hipYNear);
  const legFar = legPath(-1 * STRIDE_FAR_RATIO, LEG_LEN_FAR_RATIO, hipXFar, hipYFar);

  // ---- BRAS : balancier oppose aux jambes (meme logique StickRig), near/far distincts ----
  const armNearDeg = swingDeg * 0.6;
  const armFarDeg = -swingDeg * 0.6 * STRIDE_FAR_RATIO;
  const armNearRad = (armNearDeg * Math.PI) / 180;
  const armFarRad = (armFarDeg * Math.PI) / 180;
  const armNearHandX = shXNear + Math.sin(armNearRad) * ARM;
  const armNearHandY = shYNear + Math.cos(armNearRad) * ARM;
  const armFarHandX = shXFar + Math.sin(armFarRad) * (ARM * LEG_LEN_FAR_RATIO);
  const armFarHandY = shYFar + Math.cos(armFarRad) * (ARM * LEG_LEN_FAR_RATIO);

  // tete : centree entre les 2 epaules, biaisee vers l'epaule NEAR (regle GPT : evite le "torse plat de face")
  const neckX = shXFar + (shXNear - shXFar) * 0.6;
  const neckY = shYFar + (shYNear - shYFar) * 0.6;
  const headX = neckX + 4;
  const headY = neckY - (HEAD_R + 14);

  const S = { stroke: INK, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <path d={`M0 ${GROUND_Y - 4} H ${W}`} stroke={INK} strokeWidth={2.4} opacity={0.3} fill="none" />

        <g transform={`translate(${W / 2} ${GROUND_Y}) scale(${MAN_S})`} opacity={0.92}>
          {/* 1. bras FAR (couche la plus reculee) */}
          <path d={`M ${shXFar} ${shYFar} L ${armFarHandX} ${armFarHandY}`} {...S} strokeWidth={9 * FAR_STROKE_RATIO} opacity={FAR_OPACITY} />
          {/* 2. jambe FAR (plus courte, amplitude reduite, plus legere) */}
          <path d={`M ${hipXFar} ${hipYFar} L ${legFar.kx} ${legFar.ky} L ${legFar.fx} ${legFar.fy}`} {...S} strokeWidth={10 * FAR_STROKE_RATIO} opacity={FAR_OPACITY} />

          {/* 3. TORSE : polygone OPAQUE reliant les 4 points distincts (masque entre far et near) */}
          <path
            d={`M ${hipXFar} ${hipYFar} L ${shXFar} ${shYFar} L ${shXNear} ${shYNear} L ${hipXNear} ${hipYNear} Z`}
            fill={PARCH} fillOpacity={0.94} stroke={INK} strokeWidth={4} strokeLinejoin="round"
          />

          {/* 4. cou + tete (par-dessus le torse) */}
          <line x1={neckX} y1={neckY} x2={headX} y2={headY} {...S} strokeWidth={11} />
          <circle cx={headX} cy={headY} r={HEAD_R} fill={PARCH} stroke={INK} strokeWidth={6} />
          <g transform={`translate(${headX} ${headY})`}>
            <ellipse cx={4} cy={-20} rx={44} ry={13} fill={STRAW} stroke={INK} strokeWidth={4} />
            <path d="M -20 -22 C -12 -46 24 -46 30 -20 Z" fill={STRAW_D} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          </g>

          {/* 5. jambe NEAR (pleine longueur/amplitude, opacite pleine, par-dessus le torse) */}
          <path d={`M ${hipXNear} ${hipYNear} L ${legNear.kx} ${legNear.ky} L ${legNear.fx} ${legNear.fy}`} {...S} strokeWidth={11} />

          {/* 6. bras NEAR (couche la plus proche) */}
          <path d={`M ${shXNear} ${shYNear} L ${armNearHandX} ${armNearHandY}`} {...S} strokeWidth={9} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
