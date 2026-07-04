/**
 * PROTOTYPE — test de MOUVEMENT sur 2 poses generees par Fugu Ultra (Sakana AI, via OpenRouter, 2026-07-02).
 * Meme protocole que ProtoGeminiPoseBankWalk : Fugu Ultra a produit un rig FK imbrique (translate au joint +
 * rotate, parent->enfant) sur un prompt texte-pur identique au test Gemini. Ce proto verifie si les 2 poses
 * (idle, walk-a) INTERPOLENT proprement (rig FK reel) ou decrochent (paths figes deguises en groupes).
 * Angles extraits a la main des 2 SVG bruts (out/_rnd/fugu-ultra-test/fugu-idle.svg et fugu-walk-a.svg).
 * Geometrie des segments = celle produite par Fugu (stroke epais type capsule pour walk-a, paths fermes pour
 * idle) -- on garde la version walk-a (stroke) pour les 2 poses, plus simple a interpoler.
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

// Angles extraits directement des rotate() du SVG brut Fugu Ultra.
const IDLE: LimbAngles = {
  torsoTilt: 0, headTilt: 0,
  armUpperFront: 3, armLowerFront: -2,
  armUpperBack: 4, armLowerBack: -2,
  legUpperFront: -2, legLowerFront: 1, footFront: 0,
  legUpperBack: 2, legLowerBack: -1, footBack: 0,
  hipX: 200, hipY: 350,
};
const WALK_A: LimbAngles = {
  torsoTilt: -4, headTilt: 3,
  armUpperFront: -62, armLowerFront: 34,
  armUpperBack: 45, armLowerBack: 15,
  legUpperFront: -35, legLowerFront: 50, footFront: -8,
  legUpperBack: 25, legLowerBack: 0, footBack: -10,
  hipX: 200, hipY: 352,
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

// Segments = ligne + stroke epais (geometrie brute produite par Fugu pour walk-a).
const ArmFront = ({ upper, lower }: { upper: number; lower: number }) => (
  <g transform={`rotate(${upper})`}>
    <path d="M0 0 L0 90" fill="none" stroke="#1A1A1A" strokeWidth={28} strokeLinecap="round" />
    <path d="M0 0 L0 90" fill="none" stroke="#FFFDD0" strokeWidth={20} strokeLinecap="round" />
    <g transform={`translate(0, 90) rotate(${lower})`}>
      <path d="M0 0 L0 75" fill="none" stroke="#1A1A1A" strokeWidth={24} strokeLinecap="round" />
      <path d="M0 0 L0 75" fill="none" stroke="#8B5A2B" strokeWidth={16} strokeLinecap="round" />
      <g transform="translate(0, 75)">
        <circle cx={0} cy={0} r={10} fill="#8B5A2B" stroke="#1A1A1A" strokeWidth={4} />
      </g>
    </g>
  </g>
);

const LegFront = ({ upper, lower, foot }: { upper: number; lower: number; foot: number }) => (
  <g transform={`rotate(${upper})`}>
    <path d="M0 0 L0 110" fill="none" stroke="#1A1A1A" strokeWidth={36} strokeLinecap="round" />
    <path d="M0 0 L0 110" fill="none" stroke="#2F4F4F" strokeWidth={28} strokeLinecap="round" />
    <g transform={`translate(0, 110) rotate(${lower})`}>
      <path d="M0 0 L0 90" fill="none" stroke="#1A1A1A" strokeWidth={34} strokeLinecap="round" />
      <path d="M0 0 L0 90" fill="none" stroke="#2F4F4F" strokeWidth={26} strokeLinecap="round" />
      <g transform={`translate(0, 90) rotate(${foot})`}>
        <path d="M-12 -5 C8 -10 35 -6 55 4 C61 7 61 15 54 18 L4 18 C-10 18 -20 7 -12 -5 Z" fill="#3E2723" stroke="#1A1A1A" strokeWidth={3} />
      </g>
    </g>
  </g>
);

const FuguRig: React.FC<{ a: LimbAngles }> = ({ a }) => (
  <g transform={`translate(${a.hipX}, ${a.hipY}) rotate(${a.torsoTilt})`}>
    {/* back arm+leg derriere (draw order fixe, profil) */}
    <g transform={`translate(0, -135) rotate(${a.armUpperBack})`}>
      <path d="M0 0 L0 90" fill="none" stroke="#1A1A1A" strokeWidth={28} strokeLinecap="round" />
      <path d="M0 0 L0 90" fill="none" stroke="#FFFDD0" strokeWidth={20} strokeLinecap="round" />
      <g transform={`translate(0, 90) rotate(${a.armLowerBack})`}>
        <path d="M0 0 L0 75" fill="none" stroke="#1A1A1A" strokeWidth={24} strokeLinecap="round" />
        <path d="M0 0 L0 75" fill="none" stroke="#8B5A2B" strokeWidth={16} strokeLinecap="round" />
        <circle cx={0} cy={75} r={10} fill="#8B5A2B" stroke="#1A1A1A" strokeWidth={4} />
      </g>
    </g>
    <g transform={`rotate(${a.legUpperBack})`}>
      <LegFront upper={0} lower={a.legLowerBack} foot={a.footBack} />
    </g>

    {/* torso + tete + chapeau (geometrie idle, statique) */}
    <path d="M-35 -130 C-22 -141 23 -141 36 -130 L43 -19 C34 -5 19 3 0 3 C-20 3 -35 -5 -43 -19 Z" fill="#FFFDD0" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
    <path d="M-35 -8 C-14 1 15 1 35 -8 L39 9 C17 20 -17 20 -39 9 Z" fill="#2F4F4F" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
    <g transform={`translate(0, -135) rotate(${a.headTilt})`}>
      <circle cx={6} cy={-39} r={28} fill="#8B5A2B" stroke="#1A1A1A" strokeWidth={4} />
      <circle cx={13} cy={-43} r={3.5} fill="#1A1A1A" />
      <circle cx={25} cy={-43} r={3.5} fill="#1A1A1A" />
      <path d="M-27 -64 C-8 -72 24 -72 43 -63 C24 -55 -7 -55 -27 -64 Z" fill="#D2B48C" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
      <path d="M-13 -68 L12 -107 L37 -67 C23 -60 2 -60 -13 -68 Z" fill="#D2B48C" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
    </g>

    {/* front leg+arm devant */}
    <g transform={`rotate(${a.legUpperFront})`}>
      <LegFront upper={0} lower={a.legLowerFront} foot={a.footFront} />
    </g>
    <g transform="translate(0, -135)">
      <ArmFront upper={a.armUpperFront} lower={a.armLowerFront} />
    </g>
  </g>
);

export const PROTO_FUGU_POSE_BANK_WALK_FRAMES = 120;

export const ProtoFuguPoseBankWalk: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // idle (0-20) -> walk-a (20-60, ease) -> retour idle (60-100) -> hold idle (100-120)
  const T1 = 20, T2 = 60, T3 = 100;
  let pose: LimbAngles;
  if (frame < T1) {
    pose = IDLE;
  } else if (frame < T2) {
    const t = interpolate(frame, [T1, T2], [0, 1], { extrapolateRight: "clamp" });
    pose = lerpAngles(IDLE, WALK_A, t);
  } else if (frame < T3) {
    const t = interpolate(frame, [T2, T3], [0, 1], { extrapolateRight: "clamp" });
    pose = lerpAngles(WALK_A, IDLE, t);
  } else {
    pose = IDLE;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <div style={{ opacity: fade, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#2b2117", marginBottom: 20, textAlign: "center" }}>
          Test mouvement -- rig FK Fugu Ultra (Sakana AI) -- interpolation idle {"->"} walk-a {"->"} idle
        </div>
        <svg width={500} height={750} viewBox="0 -60 400 600">
          <line x1={0} y1={500} x2={400} y2={500} stroke="#2b2117" strokeWidth={2} opacity={0.3} />
          <FuguRig a={pose} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
