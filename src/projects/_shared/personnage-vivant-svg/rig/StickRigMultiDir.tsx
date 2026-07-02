/**
 * StickRigMultiDir — rig UNIFIE pour les 3 vues "profondeur/torsion" (3/4, dos, face), promu 2026-07-02
 * apres validation Aziz des 3 protos isoles (rnd-8dir/Proto3Quarter, ProtoBack, ProtoFace).
 *
 * Pourquoi un composant SEPARE de StickRig.tsx (profil) : le profil est un seul plan (pas de near/far),
 * les 3 autres vues partagent une architecture commune (torse 4-points, jambes near/far ou depth-stride).
 * Fusionner les 2 dans un seul fichier aurait rendu StickRig.tsx illisible. La scene narrative choisit
 * quel composant utiliser selon `view` (voir prop `view` ci-dessous qui inclut aussi "profile" en passthrough
 * vers StickRig si besoin d'une API unique cote scene — a la scene de trancher son propre routage).
 *
 * Props communes avec StickRig.tsx (ink/tunicColor/tunicPattern/neckwear/hat) : MEME registre visuel,
 * un perso peut changer de vue SANS changer d'identite visuelle (couleur/vetement/chapeau constants).
 *
 * ⛔ computePose() (poses.ts) reste la source de verite du TIMING. Ce fichier route juste vers la bonne
 * PROJECTION (multiDirection.ts) selon `view`.
 */
import React from "react";
import { computePose, RIG } from "./poses";
import { quarterLegPath, depthLegPath, torsoQuad } from "./multiDirection";

const DEFAULT_INK = "#2b2117";
const DEFAULT_TUNIC = "#e8dcc0";
const STRAW = "#d1b46b", STRAW_D = "#c39a4f";
const CAP = "#5e7245", CAP_D = "#4a5c37";
const DEFAULT_NECKWEAR = "#8a3a2e";

export type StickRigMultiDirProps = {
  view: "3quarter" | "back" | "face";
  walkPhase?: number;
  moveAmt?: number;
  ink?: string;
  tunicColor?: string;
  tunicPattern?: "none" | "stripes" | "collar";
  neckwear?: "none" | "tie" | "scarf-knot";
  neckwearColor?: string;
  hat?: "straw" | "cap" | "none";
  scale?: number;
};

// ratios de projection par vue (valides Aziz individuellement) — 3/4 = near/far marques, dos = near/far leger, face = symetrique
const VIEW_PARAMS = {
  "3quarter": { shOffX: 22, shOffYSh: 5, hipOffX: 14, hipOffYHip: 3, legLenFar: 0.88, strideFar: 0.6, farOpacity: 0.72, farStroke: 0.85, symmetric: false },
  back: { shOffX: 24, shOffYSh: 2, hipOffX: 13, hipOffYHip: 1.5, legLenFar: 0.95, strideFar: 0.85, farOpacity: 0.85, farStroke: 0.92, symmetric: false },
  face: { shOffX: 22, shOffYSh: 0, hipOffX: 13, hipOffYHip: 0, legLenFar: 1, strideFar: 1, farOpacity: 1, farStroke: 1, symmetric: true },
} as const;

export const StickRigMultiDir: React.FC<StickRigMultiDirProps> = ({
  view, walkPhase = 0, moveAmt = 1,
  ink = DEFAULT_INK, tunicColor = DEFAULT_TUNIC, tunicPattern = "none",
  neckwear = "none", neckwearColor = DEFAULT_NECKWEAR, hat = "straw", scale = 1.4,
}) => {
  const { LEG, HEAD_R, ARM } = RIG;
  const pose = computePose({ walkPhase, moveAmt, bend: 0 });
  const { phase, swingDeg, hipY: hipYBase, shY: shYBase } = pose;
  const P = VIEW_PARAMS[view];

  const torso = torsoQuad(0, 0, P.shOffX, P.shOffYSh, P.hipOffYHip, shYBase, hipYBase);
  // en 3/4/dos "front"=near, "back"=far. En face, les 2 cotes sont symetriques (pas de notion near/far).
  const shXNear = torso.shFrontX, shYNear = torso.shFrontY, shXFar = torso.shBackX, shYFar = torso.shBackY;
  const hipXNear = P.hipOffX, hipYNear = hipYBase + P.hipOffYHip, hipXFar = -P.hipOffX, hipYFar = hipYBase - P.hipOffYHip;

  const kneeBendBase = Math.max(0, Math.cos(phase)) * 14;

  let legNear, legFar, armNearHandX, armNearHandY, armFarHandX, armFarHandY;
  if (view === "3quarter") {
    legNear = quarterLegPath({ strideRatio: 1, lenRatio: 1, hipX: hipXNear, hipY: hipYNear, swingDeg, kneeBendBase });
    legFar = quarterLegPath({ strideRatio: -1 * P.strideFar, lenRatio: P.legLenFar, hipX: hipXFar, hipY: hipYFar, swingDeg, kneeBendBase });
    const armNearDeg = swingDeg * 0.6, armFarDeg = -swingDeg * 0.6 * P.strideFar;
    armNearHandX = shXNear + Math.sin((armNearDeg * Math.PI) / 180) * ARM;
    armNearHandY = shYNear + Math.cos((armNearDeg * Math.PI) / 180) * ARM;
    armFarHandX = shXFar + Math.sin((armFarDeg * Math.PI) / 180) * (ARM * P.legLenFar);
    armFarHandY = shYFar + Math.cos((armFarDeg * Math.PI) / 180) * (ARM * P.legLenFar);
  } else {
    // back / face : depth-stride. advanceSign : face avance vers camera (+1), dos vers le fond (-1).
    const advanceSign = view === "face" ? 1 : -1;
    legNear = depthLegPath({ side: 1, phaseOffset: 0, hipX: hipXNear, hipY: hipYNear, phase, advanceSign });
    legFar = depthLegPath({ side: -1, phaseOffset: Math.PI, hipX: hipXFar, hipY: hipYFar, phase, advanceSign });
    const armSwing = (side: 1 | -1, phaseOffset: number) => Math.sin(phase + phaseOffset) * side * 6;
    armNearHandX = shXNear + armSwing(1, Math.PI); armNearHandY = shYNear + ARM;
    armFarHandX = shXFar + armSwing(-1, 0); armFarHandY = shYFar + ARM * P.legLenFar;
  }

  const neckX = shXFar + (shXNear - shXFar) * (P.symmetric ? 0.5 : 0.6);
  const neckY = shYFar + (shYNear - shYFar) * (P.symmetric ? 0.5 : 0.6);
  const headX = P.symmetric ? 0 : neckX + 4;
  const headY = neckY - (HEAD_R + 14);

  const S = { stroke: ink, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  // draw-order : en 3/4 le near/far est un ecart de PROJECTION LATERALE fixe (far toujours derriere, comme
  // Proto3Quarter original) ; en depth-stride (back/face) c'est une vraie profondeur qui alterne pendant le
  // cycle de marche (pied le plus bas ecran = le plus proche) -> comparaison dynamique legitime seulement la.
  const nearIsFront = view === "3quarter" ? true : legNear.fy >= legFar.fy;

  const FarLeg = () => <path d={`M ${hipXFar} ${hipYFar} L ${legFar.kx} ${legFar.ky} L ${legFar.fx} ${legFar.fy}`} {...S} strokeWidth={10 * P.farStroke} opacity={P.farOpacity} />;
  const NearLeg = () => <path d={`M ${hipXNear} ${hipYNear} L ${legNear.kx} ${legNear.ky} L ${legNear.fx} ${legNear.fy}`} {...S} strokeWidth={11} />;

  // vue de dos = tete pleine sans visage ; face = visage (2 yeux) ; 3/4 = tete simple sans visage (profil de 3/4)
  const showFace = view === "face";

  return (
    <g transform={`scale(${scale})`} opacity={0.92}>
      {/* 1. bras far */}
      <path d={`M ${shXFar} ${shYFar} L ${armFarHandX} ${armFarHandY}`} {...S} strokeWidth={9 * P.farStroke} opacity={P.farOpacity} />
      {/* 2. jambe la plus loin ecran */}
      {nearIsFront ? <FarLeg /> : <NearLeg />}

      {/* 3. TORSE-POLYGONE : 4 points distincts, colorable + motifs */}
      <path
        d={`M ${hipXFar} ${hipYFar} L ${shXFar} ${shYFar} L ${shXNear} ${shYNear} L ${hipXNear} ${hipYNear} Z`}
        fill={tunicColor} fillOpacity={0.96} stroke={ink} strokeWidth={4} strokeLinejoin="round"
      />
      {tunicPattern === "stripes" && [0.3, 0.5, 0.7].map((t, i) => (
        <line key={i}
          x1={shXFar + (shXNear - shXFar) * t} y1={shYFar + (shYNear - shYFar) * t}
          x2={hipXFar + (hipXNear - hipXFar) * t} y2={hipYFar + (hipYNear - hipYFar) * t}
          stroke={ink} strokeWidth={2} opacity={0.4} />
      ))}
      {tunicPattern === "collar" && (
        <path d={`M ${shXFar + 6} ${shYFar + 10} Q ${neckX} ${neckY + 18} ${shXNear - 6} ${shYNear + 10}`} fill="none" stroke={ink} strokeWidth={2.5} opacity={0.5} />
      )}
      {neckwear === "tie" && (
        <path d={`M ${neckX - 4} ${neckY + 4} L ${neckX + 4} ${neckY + 4} L ${neckX} ${neckY + 34} Z`} fill={neckwearColor} stroke={ink} strokeWidth={2.5} strokeLinejoin="round" />
      )}
      {neckwear === "scarf-knot" && (
        <g>
          <circle cx={neckX} cy={neckY + 8} r={9} fill={neckwearColor} stroke={ink} strokeWidth={2.5} />
          <path d={`M ${neckX - 4} ${neckY + 14} q -6 16 -2 26`} fill="none" stroke={neckwearColor} strokeWidth={6} strokeLinecap="round" />
        </g>
      )}

      {/* 4. nuque + tete */}
      <line x1={neckX} y1={neckY} x2={headX} y2={headY} {...S} strokeWidth={11} />
      <circle cx={headX} cy={headY} r={HEAD_R} fill={view === "back" ? ink : "#e8dcc0"} opacity={view === "back" ? 0.9 : 1} stroke={ink} strokeWidth={6} />
      {showFace && (
        <>
          <circle cx={headX - 8} cy={headY - 2} r={2.4} fill={ink} />
          <circle cx={headX + 8} cy={headY - 2} r={2.4} fill={ink} />
        </>
      )}
      {hat === "straw" && (
        <g transform={`translate(${headX} ${headY})`}>
          <ellipse cx={view === "back" ? 0 : 4} cy={-20} rx={view === "back" ? 48 : 44} ry={view === "back" ? 16 : 13} fill={STRAW} stroke={ink} strokeWidth={4} />
          {view !== "back" && <path d="M -20 -22 C -12 -46 24 -46 30 -20 Z" fill={STRAW_D} stroke={ink} strokeWidth={4} strokeLinejoin="round" />}
        </g>
      )}
      {hat === "cap" && (
        <g transform={`translate(${headX} ${headY})`}>
          <path d="M -26 -16 A 26 26 0 0 1 26 -16 Z" fill={CAP} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
          {view === "face"
            ? <path d="M -10 -30 L 10 -30 L 8 -38 L -8 -38 Z" fill={CAP_D} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
            : <path d="M 22 -14 L 50 -10 L 48 -4 L 20 -8 Z" fill={CAP_D} stroke={ink} strokeWidth={3.5} strokeLinejoin="round" />}
        </g>
      )}

      {/* 5. jambe + bras les plus proches */}
      {nearIsFront ? <NearLeg /> : <FarLeg />}
      <path d={`M ${shXNear} ${shYNear} L ${armNearHandX} ${armNearHandY}`} {...S} strokeWidth={9} />
    </g>
  );
};
