/**
 * PROTOTYPE — immobile-contemplatif : personnage debout, respiration legere (leger mouvement de
 * torse/epaules en boucle continue, PAS une machine a etats), regarde l'horizon (tete legerement
 * relevee, fixe). Dernier geste du catalogue (2026-07-02) — le plus simple, pas de nouvelle mecanique
 * de membre, juste une boucle sinusoidale lente sur le torse pour eviter l'effet "statue figee".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const PARCH = "#e8dcc0";

type LimbAngles = {
  torsoTilt: number;
  headTilt: number;
  armUpperFront: number; armLowerFront: number;
  armUpperBack: number; armLowerBack: number;
  legUpperFront: number; legLowerFront: number; footFront: number;
  legUpperBack: number; legLowerBack: number; footBack: number;
  hipYOffset: number;
};

const LegFront = ({ upper, lower, foot }: { upper: number; lower: number; foot: number }) => (
  <g transform={`rotate(${upper})`}>
    <path d="M -13,0 L 13,0 L 10,110 L -10,110 Z" fill="#2F4F4F" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
    <g transform={`translate(0, 110) rotate(${lower})`}>
      <path d="M -10,0 L 10,0 L 7,90 L -7,90 Z" fill="#2F4F4F" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
      <g transform={`translate(0, 90) rotate(${foot})`}>
        <path
          d="M -7,0 L 7,0 L 9,8 L 22,12 C 24,13 24,16 22,16 L -9,16 C -11,16 -11,12 -9,8 Z"
          fill="#8B5A2B" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round"
        />
        <path d="M -11,16 L 24,16 L 24,20 L -11,20 Z" fill="#3E2723" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
      </g>
    </g>
  </g>
);

const ArmFree = ({ upper, lower }: { upper: number; lower: number }) => (
  <g transform={`rotate(${upper})`}>
    <path d="M -7,40 L 7,40 L 6,90 L -6,90 Z" fill="#8B5A2B" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
    <path d="M -12,0 L 12,0 L 14,45 L -14,45 Z" fill="#FFFDD0" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
    <g transform={`translate(0, 90) rotate(${lower})`}>
      <path d="M -6,0 L 6,0 L 5,75 L -5,75 Z" fill="#8B5A2B" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
      <g transform="translate(0, 75)">
        <circle cx={0} cy={10} r={12} fill="#8B5A2B" stroke="#1A1A1A" strokeWidth={4} />
      </g>
    </g>
  </g>
);

const GeminiRig: React.FC<{ a: LimbAngles }> = ({ a }) => (
  <g transform={`translate(200, ${340 + a.hipYOffset}) rotate(${a.torsoTilt})`}>
    <g transform={`translate(0, -135) rotate(${a.armUpperBack})`}>
      <ArmFree upper={0} lower={a.armLowerBack} />
    </g>
    <g transform={`rotate(${a.legUpperBack})`}>
      <LegFront upper={0} lower={a.legLowerBack} foot={a.footBack} />
    </g>

    <path d="M -20,-135 C -20,-135 -25,-70 -18,0 L 18,0 C 25,-70 20,-135 20,-135 Z" fill="#FFFDD0" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
    <path d="M -18,0 L 18,0 L 17,15 L -17,15 Z" fill="#2F4F4F" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
    <g transform={`translate(0, -135) rotate(${a.headTilt})`}>
      <path d="M -50,-50 Q 0,-40 50,-50 L 0,-110 Z" fill="#D2B48C" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
      <circle cx={0} cy={-45} r={28} fill="#8B5A2B" stroke="#1A1A1A" strokeWidth={4} />
      <circle cx={14} cy={-50} r={3} fill="#1A1A1A" />
    </g>

    <g transform={`rotate(${a.legUpperFront})`}>
      <LegFront upper={0} lower={a.legLowerFront} foot={a.footFront} />
    </g>
    <g transform="translate(0, -135)">
      <ArmFree upper={a.armUpperFront} lower={a.armLowerFront} />
    </g>
  </g>
);

const TOTAL_FRAMES = 150; // 5s a 30fps, boucle continue (pas de debut/fin narratif)
export const PROTO_GEMINI_CONTEMPLATIF_FRAMES = TOTAL_FRAMES;

export const ProtoGeminiContemplatif: React.FC = () => {
  const frame = useCurrentFrame();

  // Respiration : oscillation LENTE et FAIBLE amplitude (pas une marche, pas un geste — juste vivant).
  // Periode ~4s (120 frames a 30fps), amplitude torse 1.5deg, epaules (bras) 3deg, tete quasi fixe.
  const breathPhase = (frame / 120) * Math.PI * 2;
  const breath = Math.sin(breathPhase);

  const a: LimbAngles = {
    torsoTilt: breath * 1.5,
    headTilt: -8 + breath * 0.8, // tete relevee vers l'horizon (-8 base), tres leger suivi de la respiration
    armUpperFront: -5 + breath * 2,
    armLowerFront: -5,
    armUpperBack: 5 - breath * 2,
    armLowerBack: 5,
    legUpperFront: 0, legLowerFront: 0, footFront: 0,
    legUpperBack: 0, legLowerBack: 0, footBack: 0,
    hipYOffset: breath * 2, // leger mouvement vertical (inspire/expire)
  };

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 24, color: "#2b2117", marginBottom: 4 }}>
          Immobile-contemplatif : respiration legere en boucle, regarde l'horizon
        </div>
        <svg width={600} height={750} viewBox="-100 -60 400 600">
          <line x1={-100} y1={500} x2={300} y2={500} stroke="#2b2117" strokeWidth={2} opacity={0.3} />
          <GeminiRig a={a} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
