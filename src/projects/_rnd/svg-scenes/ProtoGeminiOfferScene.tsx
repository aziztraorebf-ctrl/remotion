/**
 * PROTOTYPE — scene narrative test : marche -> arret -> OFFRE (bras tendu, geste "voici/tiens") -> repart.
 * Dernier test de la session 2026-07-02, suite au retrait du squat (registre marginal, incoherence de
 * personnage). Set de 5 poses (idle/walk-a/walk-b/offer/reach-up) genere en UN SEUL appel Gemini avec
 * personnage FIGE (couleurs hex explicites dans le prompt) — LEÇON appliquee suite a l'echec squat.
 * Verifie : couleurs IDENTIQUES sur les 5 SVG (grep), hipY coherent en interne (280 idle/offer/reach-up,
 * 298 walk-a/walk-b — proche, pas de saut brutal comme le squat qui passait de 340 a 415).
 * Cas d'usage vise : le patron narratif le plus frequent dans nos scenes Souverain — un personnage qui
 * marche vers la camera/un autre perso puis tend/montre un objet (feve de cacao, outil, recolte).
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

// Angles extraits de out/_rnd/pose-bank-test/v2-*.svg (1 seul appel Gemini, personnage fige)
const IDLE: LimbAngles = {
  torsoTilt: 0, headTilt: 0,
  armUpperFront: -3, armLowerFront: -5,
  armUpperBack: 8, armLowerBack: -5,
  legUpperFront: -2, legLowerFront: 0, footFront: 0,
  legUpperBack: 3, legLowerBack: 0, footBack: 0,
  hipX: 200, hipY: 280,
};
const WALK_A: LimbAngles = {
  torsoTilt: 3, headTilt: -3,
  armUpperFront: -45, armLowerFront: -15,
  armUpperBack: 45, armLowerBack: -15,
  legUpperFront: -30, legLowerFront: 15, footFront: -5,
  legUpperBack: 40, legLowerBack: 0, footBack: 25,
  hipX: 200, hipY: 298,
};
const WALK_B: LimbAngles = {
  torsoTilt: 3, headTilt: -3,
  armUpperFront: 45, armLowerFront: -15,
  armUpperBack: -45, armLowerBack: -15,
  legUpperFront: 40, legLowerFront: 0, footFront: 25,
  legUpperBack: -30, legLowerBack: 15, footBack: -5,
  hipX: 200, hipY: 298,
};
const OFFER: LimbAngles = {
  torsoTilt: 0, headTilt: 0,
  armUpperFront: -85, armLowerFront: 0,
  armUpperBack: 10, armLowerBack: -5,
  legUpperFront: -2, legLowerFront: 0, footFront: 0,
  legUpperBack: 3, legLowerBack: 0, footBack: 0,
  hipX: 200, hipY: 280,
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

const ArmFront = ({ upper, lower }: { upper: number; lower: number }) => (
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
  <g transform={`translate(${a.hipX}, ${a.hipY}) rotate(${a.torsoTilt})`}>
    <g transform={`translate(0, -135) rotate(${a.armUpperBack})`}>
      <path d="M -7,40 L 7,40 L 6,90 L -6,90 Z" fill="#8B5A2B" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
      <path d="M -12,0 L 12,0 L 14,45 L -14,45 Z" fill="#FFFDD0" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
      <g transform={`translate(0, 90) rotate(${a.armLowerBack})`}>
        <path d="M -6,0 L 6,0 L 5,75 L -5,75 Z" fill="#8B5A2B" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
        <circle cx={0} cy={85} r={12} fill="#8B5A2B" stroke="#1A1A1A" strokeWidth={4} />
      </g>
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
      <ArmFront upper={a.armUpperFront} lower={a.armLowerFront} />
    </g>
  </g>
);

// Timeline (30fps) : idle -> marche vers camera -> arret -> OFFRE (bras tendu) -> hold -> repart -> idle
const T = {
  fadeEnd: 15,
  walk1Start: 15,
  walk1End: 90,
  stopEnd: 108,
  offerEnd: 122,
  holdEnd: 155,
  lowerEnd: 168,
  walk2Start: 168,
  walk2End: 220,
  stopFinalEnd: 235,
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

export const PROTO_GEMINI_OFFER_SCENE_FRAMES = T.stopFinalEnd + 20;

export const ProtoGeminiOfferScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, T.fadeEnd], [0, 1], { extrapolateRight: "clamp" });

  let pose: LimbAngles;
  if (frame < T.fadeEnd) {
    pose = IDLE;
  } else if (frame < T.walk1End) {
    const enterT = interpolate(frame, [T.walk1Start, T.walk1Start + 10], [0, 1], { extrapolateRight: "clamp" });
    pose = frame < T.walk1Start + 10 ? lerpAngles(IDLE, WALK_A, enterT) : walkCycle(frame, T.walk1Start, T.walk1End);
  } else if (frame < T.stopEnd) {
    const t = interpolate(frame, [T.walk1End, T.stopEnd], [0, 1], { extrapolateRight: "clamp" });
    pose = lerpAngles(WALK_A, IDLE, t);
  } else if (frame < T.offerEnd) {
    const t = interpolate(frame, [T.stopEnd, T.offerEnd], [0, 1], { extrapolateRight: "clamp" });
    pose = lerpAngles(IDLE, OFFER, easeInOutCubic(t));
  } else if (frame < T.holdEnd) {
    pose = OFFER;
  } else if (frame < T.lowerEnd) {
    const t = interpolate(frame, [T.holdEnd, T.lowerEnd], [0, 1], { extrapolateRight: "clamp" });
    pose = lerpAngles(OFFER, IDLE, easeInOutCubic(t));
  } else if (frame < T.walk2End) {
    const enterT = interpolate(frame, [T.walk2Start, T.walk2Start + 10], [0, 1], { extrapolateRight: "clamp" });
    pose = frame < T.walk2Start + 10 ? lerpAngles(IDLE, WALK_A, enterT) : walkCycle(frame, T.walk2Start, T.walk2End);
  } else if (frame < T.stopFinalEnd) {
    const t = interpolate(frame, [T.walk2End, T.stopFinalEnd], [0, 1], { extrapolateRight: "clamp" });
    pose = lerpAngles(WALK_A, IDLE, t);
  } else {
    pose = IDLE;
  }

  const label =
    frame < T.walk1Start ? "idle" :
    frame < T.walk1End ? "marche" :
    frame < T.stopEnd ? "arret" :
    frame < T.offerEnd ? "tend le bras" :
    frame < T.holdEnd ? "offre (hold)" :
    frame < T.lowerEnd ? "rabaisse le bras" :
    frame < T.walk2End ? "repart" :
    "arrive / idle";

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <div style={{ opacity: fade, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 26, color: "#2b2117", marginBottom: 4 }}>
          Scene narrative — marche -&gt; arret -&gt; OFFRE (bras tendu) -&gt; repart (pose bank 1 seul appel, perso fige)
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#8a2b2b", marginBottom: 16 }}>{label}</div>
        <svg width={600} height={750} viewBox="-100 -60 400 600">
          <line x1={-100} y1={500} x2={300} y2={500} stroke="#2b2117" strokeWidth={2} opacity={0.3} />
          <GeminiRig a={pose} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
