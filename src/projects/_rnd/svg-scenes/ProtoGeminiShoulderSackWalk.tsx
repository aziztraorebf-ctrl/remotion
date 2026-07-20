/**
 * PROTOTYPE — marche avec un BALUCHON/SAC SUR L'EPAULE, torse penche en avant, cadence RALENTIE
 * pour vendre le poids. Meme principe que ProtoGeminiHandBasketWalk (mecanique volee au rig capsule
 * StickRig.tsx, carry="shoulder-sack") : la main avant remonte pres de l'epaule tenir la sangle (coude
 * plie serre), le sac est dessine SUR l'epaule/dos (derriere le bras, devant le torse). Bras arriere
 * = libre, balance normalement mais un peu moins ample (porte un poids ralentit tout le corps).
 * Torse tilte en avant (+8deg) pour lire "effort" ; cycle de marche 2x plus lent (HALF_STEP 14->24)
 * que la marche neutre pour vendre visuellement la charge.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const PARCH = "#e8dcc0";
const SACK = "#7a5230", SACK_D = "#5e3d22";

type LimbAngles = {
  torsoTilt: number;
  headTilt: number;
  armUpperFront: number; armLowerFront: number;
  armUpperBack: number; armLowerBack: number;
  legUpperFront: number; legLowerFront: number; footFront: number;
  legUpperBack: number; legLowerBack: number; footBack: number;
  hipX: number; hipY: number;
};

const IDLE: LimbAngles = {
  torsoTilt: 5, headTilt: 3,
  armUpperFront: 20, armLowerFront: -170,
  armUpperBack: 5, armLowerBack: 5,
  legUpperFront: 0, legLowerFront: 0, footFront: 0,
  legUpperBack: 0, legLowerBack: 0, footBack: 0,
  hipX: 200, hipY: 340,
};
// walk-a/b : jambes reprises du cycle deja valide (v5-head-load-walk), amplitude reduite (-35/30 -> -26/22)
// car le poids raccourcit la foulee. Torse penche +8deg (effort), bras avant fige pres de l'epaule
// (tient la sangle, ne balance pas), bras arriere balance mais amorti (poids ralentit tout le corps).
const WALK_A: LimbAngles = {
  torsoTilt: 8, headTilt: 4,
  armUpperFront: 20, armLowerFront: -170,
  armUpperBack: 22, armLowerBack: -8,
  legUpperFront: -26, legLowerFront: 42, footFront: 0,
  legUpperBack: 22, legLowerBack: 16, footBack: 0,
  hipX: 200, hipY: 340,
};
const WALK_B: LimbAngles = {
  torsoTilt: 8, headTilt: 4,
  armUpperFront: 20, armLowerFront: -170,
  armUpperBack: -18, armLowerBack: -4,
  legUpperFront: 22, legLowerFront: 16, footFront: 0,
  legUpperBack: -26, legLowerBack: 42, footBack: 0,
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

// Bras qui tient la sangle : coude serre pres du corps, main remonte pres de l'epaule/cou.
const ArmSackStrap = ({ upper, lower }: { upper: number; lower: number }) => (
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

const GeminiRigShoulderSack: React.FC<{ a: LimbAngles }> = ({ a }) => (
  <g transform={`translate(${a.hipX}, ${a.hipY}) rotate(${a.torsoTilt})`}>
    {/* bras arriere = libre, balance amorti */}
    <g transform={`translate(0, -135) rotate(${a.armUpperBack})`}>
      <ArmFree upper={0} lower={a.armLowerBack} />
    </g>
    <g transform={`rotate(${a.legUpperBack})`}>
      <LegFront upper={0} lower={a.legLowerBack} foot={a.footBack} />
    </g>

    {/* Sac sur l'epaule/dos — repositionne a hauteur d'epaule/haut du dos (y=-100, PAS -160 qui
        chevauchait la tete a -135-45=-180), decale en arriere (x=-28) derriere le torse */}
    <g transform="translate(-28, -100)">
      <ellipse cx={-22} cy={-26} rx={34} ry={40} fill={SACK} stroke="#1A1A1A" strokeWidth={4} transform="rotate(-10 -22 -26)" />
      <path d="M -40 -50 q -6 -16 4 -26" fill="none" stroke={SACK_D} strokeWidth={4} strokeLinecap="round" />
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
    {/* bras avant = tient la sangle, fige pres de l'epaule */}
    <g transform="translate(0, -135)">
      <ArmSackStrap upper={a.armUpperFront} lower={a.armLowerFront} />
    </g>
  </g>
);

// Cadence 2x plus lente que hand-basket (HALF_STEP 14 -> 24) pour vendre le poids du sac
const T = {
  fadeEnd: 15,
  walkStart: 15,
  walkEnterEnd: 30,
  walkEnd: 190,
  stopEnd: 210,
};
const HALF_STEP = 24;

function walkCycle(frame: number, start: number, end: number): LimbAngles {
  const cf = frame - start;
  const stepIndex = Math.floor(cf / HALF_STEP);
  const localT = (cf % HALF_STEP) / HALF_STEP;
  const from = stepIndex % 2 === 0 ? WALK_A : WALK_B;
  const to = stepIndex % 2 === 0 ? WALK_B : WALK_A;
  return lerpAngles(from, to, localT);
}

export const PROTO_GEMINI_SHOULDER_SACK_WALK_FRAMES = T.stopEnd + 20;

export const ProtoGeminiShoulderSackWalk: React.FC = () => {
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
    frame < T.walkStart ? "idle, sac sur l'epaule" :
    frame < T.walkEnd ? "marche lente, penchee, sac lourd" :
    "arrive / idle";

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <div style={{ opacity: fade, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 24, color: "#2b2117", marginBottom: 4 }}>
          Test 2 : baluchon sur l'epaule, torse penche, cadence ralentie (poids)
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#8a2b2b", marginBottom: 16 }}>{label}</div>
        <svg width={600} height={750} viewBox="-100 -60 400 600">
          <line x1={-100} y1={500} x2={300} y2={500} stroke="#2b2117" strokeWidth={2} opacity={0.3} />
          <GeminiRigShoulderSack a={pose} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
