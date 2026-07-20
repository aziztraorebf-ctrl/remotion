/**
 * ProtoFace — PROTOTYPE ISOLE R&D (session 2026-07-02, piste A "8 directions", 4e et derniere forme de
 * base du palier). Vue de FACE : le personnage marche DROIT vers la camera.
 * ⛔ Ne touche PAS a StickRig.tsx (sauf l'ajout partage tunicPattern/neckwear, fait separement) / poses.ts.
 *
 * REGLE DE PROJECTION (heritee de ProtoBack, meme physique — marcher vers/depuis la camera = axe Z) :
 *  - Le pas se lit sur l'axe Y ecran (profondeur), PAS sur X (identique au dos — c'est la MEME direction
 *    de deplacement, juste vue de l'autre cote). Pied qui avance vers la camera = DESCEND a l'ecran (Y
 *    augmente, se rapproche du sol/premier plan). Pied qui recule = MONTE (Y diminue).
 *  - DIFFERENCE avec le dos : la face est SYMETRIQUE gauche/droite (contrairement au dos qui gardait un
 *    tres leger near/far pour la lisibilite du gait) — de face, les 2 epaules/hanches sont a la MEME
 *    profondeur apparente, aucun biais.
 *  - Visage : premiere vue ou un visage simple est possible (2 points = yeux, pas de bouche — registre
 *    pictogramme digne, PAS de visage detaille/expressif).
 *
 * Sert AUSSI de banc d'essai pour la differenciation TORSE (demande Aziz 2026-07-02) : tunicPattern
 * (rayures/bordure de col) + neckwear (cravate/foulard noue), ajoutes a StickRig.tsx en meme temps.
 * 3 persos cote a cote montrent 3 combinaisons differentes.
 *
 * Banc d'essai anime (pas une compo de prod) : marche en boucle vers la camera, jugee en MOUVEMENT.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { computePose, RIG } from "../rig/poses";

const INK = "#2b2117";
const PARCH = "#e8dcc0";
const STRAW = "#d1b46b";
const STRAW_D = "#c39a4f";

const SHOULDER_HALF_W = 22;
const HIP_HALF_W = 13;
const TRACK_WIDTH = 0.16;
const LATERAL_SWAY = 0.035;
const DEPTH_AMP = 0.20;
const LIFT_AMP = 0.08;
const KNEE_FLARE = 0.035;

export const PASSER_FACE_FRAMES = 180;

type FaceProps = {
  tunicColor?: string;
  tunicPattern?: "none" | "stripes" | "collar";
  neckwear?: "none" | "tie" | "scarf-knot";
  neckwearColor?: string;
  hat?: "straw" | "cap" | "none";
  ink?: string;
  x?: number;
};

const CAP = "#5e7245", CAP_D = "#4a5c37";

const StickFace: React.FC<FaceProps & { frame: number }> = ({
  frame, tunicColor = PARCH, tunicPattern = "none", neckwear = "none", neckwearColor = "#8a3a2e",
  hat = "straw", ink = INK, x = 0,
}) => {
  const { LEG, HEAD_R, ARM } = RIG;
  const MAN_S = 1.4;
  const pose = computePose({ walkPhase: frame, moveAmt: 1, bend: 0 });
  const { phase, hipY, shY } = pose;

  // face SYMETRIQUE : pas de near/far, les 2 cotes a la meme profondeur (contrairement au dos)
  const shXL = -SHOULDER_HALF_W, shXR = SHOULDER_HALF_W;
  const hipXL = -HIP_HALF_W, hipXR = HIP_HALF_W;

  // meme physique Y-stride que ProtoBack, mais le SIGNE de "advance" est inverse (vers la camera = descend ecran)
  function legFaceView(side: 1 | -1, phaseOffset: number, hipX: number) {
    const p = phase + phaseOffset;
    const advance = Math.sin(p); // +1 = pied avant/vers camera -> DESCEND ecran (oppose du dos)
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
  const legL = legFaceView(-1, Math.PI, hipXL);
  const legR = legFaceView(1, 0, hipXR);

  const armSwing = (side: 1 | -1, phaseOffset: number) => Math.sin(phase + phaseOffset) * side * 6;
  const armLHandX = shXL + armSwing(-1, 0);
  const armLHandY = shY + ARM;
  const armRHandX = shXR + armSwing(1, Math.PI);
  const armRHandY = shY + ARM;

  const headX = 0, headY = shY - (HEAD_R + 14);
  const S = { stroke: ink, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  // draw-order par profondeur reelle : le pied le plus BAS ecran (le plus proche camera) devant
  const rightIsNear = legR.fy >= legL.fy;

  const LeftLeg = () => <path d={`M ${hipXL} ${hipY} L ${legL.kx} ${legL.ky} L ${legL.fx} ${legL.fy}`} {...S} strokeWidth={10.5} />;
  const RightLeg = () => <path d={`M ${hipXR} ${hipY} L ${legR.kx} ${legR.ky} L ${legR.fx} ${legR.fy}`} {...S} strokeWidth={10.5} />;

  return (
    <g transform={`translate(${x} 0) scale(${MAN_S})`} opacity={0.92}>
      {/* 1. bras + jambe les plus loin (derriere) */}
      <path d={`M ${shXL} ${shY} L ${armLHandX} ${armLHandY}`} {...S} strokeWidth={9} opacity={0.85} />
      {rightIsNear ? <LeftLeg /> : <RightLeg />}

      {/* 2. TORSE-POLYGONE face : symetrique, epaules > hanches */}
      <path
        d={`M ${hipXL} ${hipY} L ${shXL} ${shY} L ${shXR} ${shY} L ${hipXR} ${hipY} Z`}
        fill={tunicColor} stroke={ink} strokeWidth={4} strokeLinejoin="round"
      />
      {tunicPattern === "stripes" && [0.3, 0.5, 0.7].map((t, i) => {
        const px = shXL + (shXR - shXL) * t;
        return <line key={i} x1={px} y1={shY} x2={hipXL + (hipXR - hipXL) * t} y2={hipY} stroke={ink} strokeWidth={2} opacity={0.4} />;
      })}
      {tunicPattern === "collar" && (
        <path d={`M ${shXL} ${shY + 8} Q 0 ${shY + 22} ${shXR} ${shY + 8}`} fill="none" stroke={ink} strokeWidth={2.5} opacity={0.5} />
      )}
      {neckwear === "tie" && (
        <path d={`M -4 ${shY + 4} L 4 ${shY + 4} L 0 ${shY + 34} Z`} fill={neckwearColor} stroke={ink} strokeWidth={2.5} strokeLinejoin="round" />
      )}
      {neckwear === "scarf-knot" && (
        <g>
          <circle cx={0} cy={shY + 8} r={9} fill={neckwearColor} stroke={ink} strokeWidth={2.5} />
          <path d={`M -4 ${shY + 14} q -6 16 -2 26`} fill="none" stroke={neckwearColor} strokeWidth={6} strokeLinecap="round" />
        </g>
      )}

      {/* 3. nuque + tete AVEC visage simple (2 yeux, registre pictogramme — 1ere vue ou c'est possible) */}
      <line x1={0} y1={shY} x2={headX} y2={headY} {...S} strokeWidth={11} />
      <circle cx={headX} cy={headY} r={HEAD_R} fill={PARCH} stroke={ink} strokeWidth={6} />
      <circle cx={headX - 8} cy={headY - 2} r={2.4} fill={ink} />
      <circle cx={headX + 8} cy={headY - 2} r={2.4} fill={ink} />
      {hat === "straw" && (
        <g transform={`translate(${headX} ${headY})`}>
          <ellipse cx={0} cy={-20} rx={50} ry={13} fill={STRAW} stroke={ink} strokeWidth={4} />
          <path d="M -28 -22 C -20 -46 20 -46 28 -22 Z" fill={STRAW_D} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
        </g>
      )}
      {hat === "cap" && (
        <g transform={`translate(${headX} ${headY})`}>
          <path d="M -26 -16 A 26 26 0 0 1 26 -16 Z" fill={CAP} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
          <path d="M -10 -30 L 10 -30 L 8 -38 L -8 -38 Z" fill={CAP_D} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
        </g>
      )}

      {/* 4. bras + jambe les plus proches (devant) */}
      {rightIsNear ? <RightLeg /> : <LeftLeg />}
      <path d={`M ${shXR} ${shY} L ${armRHandX} ${armRHandY}`} {...S} strokeWidth={9} />
    </g>
  );
};

export const ProtoFace: React.FC = () => {
  const frame = useCurrentFrame();
  const W = 1920, H = 1080;
  const GROUND_Y = 700;

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <path d={`M0 ${GROUND_Y - 4} H ${W}`} stroke={INK} strokeWidth={2.4} opacity={0.3} fill="none" />
        <g transform={`translate(${W / 2} ${GROUND_Y})`}>
          {/* 3 persos cote a cote : demontre la differenciation torse (couleur + motif + accessoire cou) */}
          <StickFace frame={frame} x={-380} tunicColor="#e8dcc0" hat="straw" />
          <StickFace frame={frame} x={0} tunicColor="#6b8e5a" tunicPattern="stripes" neckwear="scarf-knot" neckwearColor="#b5552f" hat="cap" />
          <StickFace frame={frame} x={380} tunicColor="#4a6fa5" tunicPattern="collar" neckwear="tie" neckwearColor="#8a3a2e" hat="cap" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
