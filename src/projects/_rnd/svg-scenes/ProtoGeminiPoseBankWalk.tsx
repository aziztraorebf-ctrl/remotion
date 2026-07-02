/**
 * PROTOTYPE — test de MOUVEMENT sur la banque de poses Gemini 3.1 Pro (text-to-SVG, 2026-07-02).
 * Gemini a produit un vrai rig FK imbrique (translate au joint + rotate, parent->enfant) contrairement
 * a GPT (paths en coordonnees absolues, pas de hierarchie). Ce proto verifie si on peut INTERPOLER les
 * angles entre walk-a et walk-b pour une vraie marche continue (pas juste un cut sec entre poses).
 * Angles extraits a la main des 2 SVG bruts (out/_rnd/pose-bank-test/gemini-pose2.svg et pose3.svg).
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

// walk-a (gemini-pose2.svg) et walk-b (gemini-pose3.svg) : memes valeurs, front/back inverses.
const WALK_A: LimbAngles = {
  torsoTilt: 5, headTilt: -5,
  armUpperFront: -35, armLowerFront: -20,
  armUpperBack: 40, armLowerBack: -20,
  legUpperFront: -45, legLowerFront: 45, footFront: 0,
  legUpperBack: 30, legLowerBack: 0, footBack: 45,
  hipX: 200, hipY: 365,
};
const WALK_B: LimbAngles = {
  torsoTilt: 5, headTilt: -5,
  armUpperFront: 40, armLowerFront: -20,
  armUpperBack: -35, armLowerBack: -20,
  legUpperFront: 30, legLowerFront: 0, footFront: 45,
  legUpperBack: -45, legLowerBack: 45, footBack: 0,
  hipX: 200, hipY: 365,
};
const IDLE: LimbAngles = {
  torsoTilt: 0, headTilt: 0,
  armUpperFront: -5, armLowerFront: 0,
  armUpperBack: 5, armLowerBack: 0,
  legUpperFront: 0, legLowerFront: 0, footFront: 0,
  legUpperBack: 0, legLowerBack: 0, footBack: 0,
  hipX: 200, hipY: 340,
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function lerpAngles(a: LimbAngles, b: LimbAngles, t: number): LimbAngles {
  const out: Partial<LimbAngles> = {};
  (Object.keys(a) as (keyof LimbAngles)[]).forEach((k) => {
    out[k] = lerp(a[k], b[k], t);
  });
  return out as LimbAngles;
}

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

const GeminiRig: React.FC<{ a: LimbAngles }> = ({ a }) => (
  <g transform={`translate(${a.hipX}, ${a.hipY}) rotate(${a.torsoTilt})`}>
    {/* back arm+leg derriere (draw order fixe, profil) */}
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

    {/* torso + tete + chapeau */}
    <path d="M -20,-135 C -20,-135 -25,-70 -18,0 L 18,0 C 25,-70 20,-135 20,-135 Z" fill="#FFFDD0" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
    <path d="M -18,0 L 18,0 L 17,15 L -17,15 Z" fill="#2F4F4F" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
    <g transform={`translate(0, -135) rotate(${a.headTilt})`}>
      <path d="M -50,-50 Q 0,-40 50,-50 L 0,-110 Z" fill="#D2B48C" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
      <circle cx={0} cy={-45} r={28} fill="#8B5A2B" stroke="#1A1A1A" strokeWidth={4} />
      <circle cx={14} cy={-50} r={3} fill="#1A1A1A" />
    </g>

    {/* front leg+arm devant */}
    <g transform={`rotate(${a.legUpperFront})`}>
      <LegFront upper={0} lower={a.legLowerFront} foot={a.footFront} />
    </g>
    <g transform={`translate(0, -135)`}>
      <ArmFront upper={a.armUpperFront} lower={a.armLowerFront} />
    </g>
  </g>
);

export const PROTO_GEMINI_POSE_BANK_WALK_FRAMES = 180;

export const ProtoGeminiPoseBankWalk: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // cycle de marche : idle (0-20) -> walk-a<->walk-b en boucle (20-140, ~14f par demi-pas, EASING) -> idle (140-180)
  const CYCLE_START = 20;
  const CYCLE_END = 140;
  const HALF_STEP = 14;
  let pose: LimbAngles;
  if (frame < CYCLE_START) {
    const t = interpolate(frame, [0, CYCLE_START], [0, 1], { extrapolateRight: "clamp" });
    pose = lerpAngles(IDLE, WALK_A, t);
  } else if (frame < CYCLE_END) {
    const cf = frame - CYCLE_START;
    const stepIndex = Math.floor(cf / HALF_STEP);
    const localT = (cf % HALF_STEP) / HALF_STEP;
    const from = stepIndex % 2 === 0 ? WALK_A : WALK_B;
    const to = stepIndex % 2 === 0 ? WALK_B : WALK_A;
    pose = lerpAngles(from, to, localT);
  } else {
    const t = interpolate(frame, [CYCLE_END, CYCLE_END + 20], [0, 1], { extrapolateRight: "clamp" });
    pose = lerpAngles(WALK_A, IDLE, t);
  }

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <div style={{ opacity: fade, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 26, color: "#2b2117", marginBottom: 20 }}>
          Test mouvement — rig FK Gemini 3.1 Pro (interpolation walk-a / walk-b, PAS un cut)
        </div>
        <svg width={500} height={750} viewBox="0 -60 400 600">
          <line x1={0} y1={500} x2={400} y2={500} stroke="#2b2117" strokeWidth={2} opacity={0.3} />
          <GeminiRig a={pose} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
