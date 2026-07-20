/**
 * PROTOTYPE — marche en portant un panier A LA MAIN (pas sur la tete). Corrige l'echec de
 * ProtoGeminiHeadLoadWalk (2026-07-02) : le panier-sur-tete lisait comme "bras leves en V", illisible.
 * Mecanique reprise du rig capsule existant (StickRig.tsx carry="hand-basket", deja prouve) : le bras
 * AVANT pend le long du corps, main qui tient le panier a hauteur de hanche/genou, LEGER balancier
 * amorti par le poids pendant la marche (pas fige) ; le bras ARRIERE se balance librement, oppose aux
 * jambes. Chapeau reste seul sur la tete — pas de deuxieme objet en equilibre dessus.
 * Angles de jambes repris de v5-head-load-walk-a/b-fixed.svg (cycle de marche deja valide, fluide,
 * aucune dislocation). Seuls les bras changent par rapport a ce test precedent.
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
  hipX: number; hipY: number;
};

// idle : bras avant pend droit le long du corps (tient deja le panier au repos), bras arriere relache
const IDLE: LimbAngles = {
  torsoTilt: 0, headTilt: 0,
  armUpperFront: -5, armLowerFront: 0,
  armUpperBack: 5, armLowerBack: 5,
  legUpperFront: 0, legLowerFront: 0, footFront: 0,
  legUpperBack: 0, legLowerBack: 0, footBack: 0,
  hipX: 200, hipY: 340,
};
// walk-a : jambes reprises du test head-load (deja fluide). Bras avant (tient le panier) balance LEGER
// (+/-8 deg seulement, amorti par le poids) au lieu de suivre le grand swing normal du bras libre.
// Bras arriere (libre) suit le swing complet, oppose a la jambe avant.
const WALK_A: LimbAngles = {
  torsoTilt: 2, headTilt: -2,
  armUpperFront: -13, armLowerFront: 0,
  armUpperBack: 30, armLowerBack: -10,
  legUpperFront: -35, legLowerFront: 50, footFront: 0,
  legUpperBack: 30, legLowerBack: 20, footBack: 0,
  hipX: 200, hipY: 340,
};
const WALK_B: LimbAngles = {
  torsoTilt: 2, headTilt: -2,
  armUpperFront: 3, armLowerFront: 0,
  armUpperBack: -25, armLowerBack: -5,
  legUpperFront: 30, legLowerFront: 20, footFront: 0,
  legUpperBack: -35, legLowerBack: 50, footBack: 0,
  hipX: 200, hipY: 340,
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function lerpAngles(a: LimbAngles, b: LimbAngles, t: number): LimbAngles {
  const out: Partial<LimbAngles> = {};
  (Object.keys(a) as (keyof LimbAngles)[]).forEach((k) => { out[k] = lerp(a[k], b[k], t); });
  return out as LimbAngles;
}
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

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

// Bras qui tient le panier : coude quasi droit (le poids tire le bras vers le bas), la main referme
// sur l'anse a hauteur genou/hanche. Le panier est dessine ici, attache a la main (herite son transform).
const ArmWithBasket = ({ upper, lower }: { upper: number; lower: number }) => (
  <g transform={`rotate(${upper})`}>
    <path d="M -7,40 L 7,40 L 6,90 L -6,90 Z" fill="#8B5A2B" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
    <path d="M -12,0 L 12,0 L 14,45 L -14,45 Z" fill="#FFFDD0" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
    <g transform={`translate(0, 90) rotate(${lower})`}>
      <path d="M -6,0 L 6,0 L 5,75 L -5,75 Z" fill="#8B5A2B" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
      <g transform="translate(0, 75)">
        <circle cx={0} cy={10} r={12} fill="#8B5A2B" stroke="#1A1A1A" strokeWidth={4} />
        {/* Panier tenu par l'anse — pend sous la main */}
        <path d="M -18,18 Q 0,8 18,18" fill="none" stroke="#1A1A1A" strokeWidth={4} />
        <path d="M -22,20 L 22,20 L 18,52 L -18,52 Z" fill="#D2B48C" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
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

const GeminiRigHandBasket: React.FC<{ a: LimbAngles }> = ({ a }) => (
  <g transform={`translate(${a.hipX}, ${a.hipY}) rotate(${a.torsoTilt})`}>
    {/* bras arriere = LIBRE, balance normalement */}
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
    {/* bras avant = TIENT LE PANIER, pend le long du corps, balancier amorti */}
    <g transform="translate(0, -135)">
      <ArmWithBasket upper={a.armUpperFront} lower={a.armLowerFront} />
    </g>
  </g>
);

const T = {
  fadeEnd: 15,
  walkStart: 15,
  walkEnterEnd: 25,
  walkEnd: 140,
  stopEnd: 158,
};
const HALF_STEP = 14;

function walkCycle(frame: number, start: number, end: number): LimbAngles {
  const cf = frame - start;
  const stepIndex = Math.floor(cf / HALF_STEP);
  const localT = (cf % HALF_STEP) / HALF_STEP;
  const from = stepIndex % 2 === 0 ? WALK_A : WALK_B;
  const to = stepIndex % 2 === 0 ? WALK_B : WALK_A;
  return lerpAngles(from, to, localT);
}

export const PROTO_GEMINI_HAND_BASKET_WALK_FRAMES = T.stopEnd + 20;

export const ProtoGeminiHandBasketWalk: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, T.fadeEnd], [0, 1], { extrapolateRight: "clamp" });

  let pose: LimbAngles;
  if (frame < T.walkStart) {
    pose = IDLE;
  } else if (frame < T.walkEnterEnd) {
    const t = interpolate(frame, [T.walkStart, T.walkEnterEnd], [0, 1], { extrapolateRight: "clamp" });
    pose = lerpAngles(IDLE, WALK_A, easeInOutCubic(t));
  } else if (frame < T.walkEnd) {
    pose = walkCycle(frame, T.walkEnterEnd, T.walkEnd);
  } else if (frame < T.stopEnd) {
    const t = interpolate(frame, [T.walkEnd, T.stopEnd], [0, 1], { extrapolateRight: "clamp" });
    pose = lerpAngles(WALK_A, IDLE, easeInOutCubic(t));
  } else {
    pose = IDLE;
  }

  const label =
    frame < T.walkStart ? "idle (panier a la main)" :
    frame < T.walkEnd ? "marche, panier tenu a la main, bras libre balance" :
    "arrive / idle";

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <div style={{ opacity: fade, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 24, color: "#2b2117", marginBottom: 4 }}>
          Correction : panier tenu a la main (mecanique StickRig carry=hand-basket), pas sur la tete
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#8a2b2b", marginBottom: 16 }}>{label}</div>
        <svg width={600} height={750} viewBox="-100 -60 400 600">
          <line x1={-100} y1={500} x2={300} y2={500} stroke="#2b2117" strokeWidth={2} opacity={0.3} />
          <GeminiRigHandBasket a={pose} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
