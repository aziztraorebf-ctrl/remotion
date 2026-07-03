/**
 * PROTOTYPE — 2 personnages, transfert d'objet main-a-main. A marche puis s'arrete face a B (immobile),
 * les deux tendent le bras horizontalement (meme mecanique "offer" que ProtoGeminiOfferScene), l'objet
 * passe de la main de A a la main de B au moment du contact (point FIGE, pas recalcule chaque frame —
 * meme principe que rig/objectHandling.ts handoffState).
 *
 * Formule bras tendu horizontal reprise du OFFER deja prouve (ProtoGeminiOfferScene.tsx,
 * armUpperFront=-85 armLowerFront=0) — PAS de nouvel angle devine, reutilise directement.
 * Personnage B = MIROIR de A (scale(-1,1) sur tout son groupe), donc son bras "avant" pointe a gauche
 * automatiquement sans recalcul d'angle separe.
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
};

const IDLE: LimbAngles = {
  torsoTilt: 0, headTilt: 0,
  armUpperFront: -5, armLowerFront: -5,
  armUpperBack: 5, armLowerBack: 5,
  legUpperFront: 0, legLowerFront: 0, footFront: 0,
  legUpperBack: 0, legLowerBack: 0, footBack: 0,
};
const WALK_A: LimbAngles = {
  torsoTilt: 0, headTilt: 0,
  armUpperFront: -45, armLowerFront: -15,
  armUpperBack: 45, armLowerBack: -15,
  legUpperFront: -35, legLowerFront: 50, footFront: 0,
  legUpperBack: 30, legLowerBack: 20, footBack: 0,
};
const WALK_B: LimbAngles = {
  torsoTilt: 0, headTilt: 0,
  armUpperFront: 45, armLowerFront: -15,
  armUpperBack: -45, armLowerBack: -15,
  legUpperFront: 30, legLowerFront: 20, footFront: 0,
  legUpperBack: -35, legLowerBack: 50, footBack: 0,
};
// OFFER — repris tel quel de ProtoGeminiOfferScene.tsx (deja valide en rendu, bras tendu horizontal)
const OFFER: LimbAngles = {
  torsoTilt: 0, headTilt: 0,
  armUpperFront: -85, armLowerFront: 0,
  armUpperBack: 10, armLowerBack: -5,
  legUpperFront: 0, legLowerFront: 0, footFront: 0,
  legUpperBack: 0, legLowerBack: 0, footBack: 0,
};

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
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

// facing=1 -> normal (regarde/marche vers la droite). facing=-1 -> scale(-1,1), tout le rig se
// reflechit horizontalement (B regarde vers la gauche, son bras "avant" pointe donc a gauche
// automatiquement, sans recalculer d'angle separe).
const GeminiRig: React.FC<{ a: LimbAngles; x: number; facing: 1 | -1 }> = ({ a, x, facing }) => (
  <g transform={`translate(${x}, 340) scale(${facing}, 1) rotate(${a.torsoTilt})`}>
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

// Position SCENE de la main avant (meme chaine hip->torse->arm-upper->arm-lower->hand que le SVG),
// avec le facing applique (scale(-1,1) reflechit X autour de x=0 local avant translate).
function computeFrontHandScene(a: LimbAngles, x: number, facing: 1 | -1) {
  const rot = (px: number, py: number, deg: number) => {
    const r = (deg * Math.PI) / 180;
    return [px * Math.cos(r) - py * Math.sin(r), px * Math.sin(r) + py * Math.cos(r)];
  };
  const hipY = 340;
  const [sx, sy] = rot(0, -135, a.torsoTilt);
  const shX = sx, shY = hipY + sy; // local, avant facing/translate
  const [ux, uy] = rot(0, 90, a.torsoTilt + a.armUpperFront);
  const elbowX = shX + ux, elbowY = shY + uy;
  const [lx, ly] = rot(0, 75, a.torsoTilt + a.armUpperFront + a.armLowerFront);
  const localX = elbowX + lx, localY = elbowY + ly + 10;
  return { x: x + localX * facing, y: localY };
}

const HALF_STEP = 14;
function walkCycle(frame: number, start: number, end: number) {
  const cf = frame - start;
  const stepIndex = Math.floor(cf / HALF_STEP);
  const localT = (cf % HALF_STEP) / HALF_STEP;
  const from = stepIndex % 2 === 0 ? WALK_A : WALK_B;
  const to = stepIndex % 2 === 0 ? WALK_B : WALK_A;
  return lerpAngles(from, to, localT);
}

const T = {
  fadeEnd: 15,
  walkStart: 15, walkEnterEnd: 25, walkEnd: 90,
  stopEnd: 105,
  offerEnd: 130, // A et B tendent le bras (A un peu avant B, decalage 6f comme la source)
  fHold: 145,
  fRelease: 159,
  retractEnd: 180,
  finalIdleEnd: 195,
};

const A_START_X = -80, A_STOP_X = 620;
const B_X = 900;

export const PROTO_GEMINI_HANDOFF_FRAMES = T.finalIdleEnd + 20;

export const ProtoGeminiHandoff: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, T.fadeEnd], [0, 1], { extrapolateRight: "clamp" });

  // ---- A : marche puis s'arrete, tend le bras ----
  const aX = interpolate(frame, [T.walkStart, T.walkEnd], [A_START_X, A_STOP_X], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  let aLimb: LimbAngles;
  let aLabel = "idle";
  if (frame < T.walkStart) {
    aLimb = IDLE;
  } else if (frame < T.walkEnterEnd) {
    const t = interpolate(frame, [T.walkStart, T.walkEnterEnd], [0, 1], { extrapolateRight: "clamp" });
    aLimb = lerpAngles(IDLE, WALK_A, easeInOutCubic(t)); aLabel = "A marche";
  } else if (frame < T.walkEnd) {
    aLimb = walkCycle(frame, T.walkEnterEnd, T.walkEnd); aLabel = "A marche";
  } else if (frame < T.offerEnd) {
    const t = interpolate(frame, [T.walkEnd, T.offerEnd], [0, 1], { extrapolateRight: "clamp" });
    aLimb = lerpAngles(IDLE, OFFER, easeInOutCubic(t)); aLabel = "A tend le bras";
  } else if (frame < T.fRelease) {
    aLimb = OFFER; aLabel = frame < T.fHold ? "A tend le bras" : "contact — transfert";
  } else if (frame < T.retractEnd) {
    const t = interpolate(frame, [T.fRelease, T.retractEnd], [0, 1], { extrapolateRight: "clamp" });
    aLimb = lerpAngles(OFFER, IDLE, easeInOutCubic(t)); aLabel = "A retire le bras";
  } else {
    aLimb = IDLE; aLabel = "idle";
  }

  // ---- B : immobile, tend le bras en miroir avec un leger decalage (6f, comme la source) ----
  const bOfferStart = T.walkEnd + 6, bOfferEnd = T.offerEnd + 6;
  let bLimb: LimbAngles;
  if (frame < bOfferStart) {
    bLimb = IDLE;
  } else if (frame < bOfferEnd) {
    const t = interpolate(frame, [bOfferStart, bOfferEnd], [0, 1], { extrapolateRight: "clamp" });
    bLimb = lerpAngles(IDLE, OFFER, easeInOutCubic(t));
  } else if (frame < T.fRelease) {
    bLimb = OFFER;
  } else if (frame < T.retractEnd) {
    const t = interpolate(frame, [T.fRelease, T.retractEnd], [0, 1], { extrapolateRight: "clamp" });
    bLimb = lerpAngles(OFFER, IDLE, easeInOutCubic(t));
  } else {
    bLimb = IDLE;
  }

  // Machine a etats objet (handoffState, meme principe que objectHandling.ts) : point de contact
  // FIGE calcule UNE FOIS a fHold (pas recalcule a chaque frame du hold, sinon micro-tremblement).
  const aHandNow = computeFrontHandScene(aLimb, aX, 1);
  const bHandNow = computeFrontHandScene(bLimb, B_X, -1);
  const aHandAtHold = computeFrontHandScene(OFFER, A_STOP_X, 1);
  const bHandAtHold = computeFrontHandScene(OFFER, B_X, -1);
  const contactX = (aHandAtHold.x + bHandAtHold.x) / 2;
  const contactY = aHandAtHold.y;

  let objX: number, objY: number, label: string;
  if (frame < T.fHold) {
    objX = aHandNow.x; objY = aHandNow.y; label = "objet chez A";
  } else if (frame < T.fRelease) {
    objX = contactX; objY = contactY; label = "HOLD — contact";
  } else {
    objX = bHandNow.x; objY = bHandNow.y; label = "objet chez B";
  }

  const sceneLabel = frame < T.walkEnd ? aLabel : frame < T.fHold ? "les deux tendent le bras" : label;

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <div style={{ opacity: fade, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#2b2117", marginBottom: 4 }}>
          Passer un objet main-a-main : A marche -&gt; tendent le bras -&gt; contact (point fige) -&gt; B repart avec
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#8a2b2b", marginBottom: 16 }}>{sceneLabel}</div>
        <svg width={1100} height={750} viewBox="-150 -60 1300 600">
          <line x1={-150} y1={500} x2={1150} y2={500} stroke="#2b2117" strokeWidth={2} opacity={0.3} />
          <GeminiRig a={aLimb} x={aX} facing={1} />
          <GeminiRig a={bLimb} x={B_X} facing={-1} />
          <ellipse cx={objX} cy={objY} rx={18} ry={14} fill="#4a2c14" stroke="#1A1A1A" strokeWidth={3} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
