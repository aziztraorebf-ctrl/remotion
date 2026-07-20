/**
 * PROTOTYPE — cycle de marche "tete chargee" (panier sur la tete), test de la methode "1 pose par
 * appel Gemini + SVG source verbatim en patron" (session 2026-07-02, suite au test "1 seul appel pour
 * 5 poses" qui avait rate 3/5 poses par oubli d'instructions). idle -> walk-a/walk-b genere separement,
 * SVG source de idle donne a Gemini comme patron exact (pas juste une image PNG de reference — lecon
 * actee : image seule fait deriver la geometrie du personnage). Panier = shape ajoutee verbatim au
 * groupe "head" (suit son transform automatiquement).
 * Angles extraits de out/_rnd/pose-bank-test/v5-head-load-walk-a-fixed.svg et v5-head-load-walk-b-fixed.svg.
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

// Angles extraits de gemini-pose1.svg (idle, ground truth deja prouve)
const IDLE: LimbAngles = {
  torsoTilt: 0, headTilt: 0,
  armUpperFront: -5, armLowerFront: -5,
  armUpperBack: 5, armLowerBack: 5,
  legUpperFront: 0, legLowerFront: 0, footFront: 0,
  legUpperBack: 0, legLowerBack: 0, footBack: 0,
  hipX: 200, hipY: 340,
};
// Angles extraits de v5-head-load-walk-a-fixed.svg (1 appel cible, SVG source verbatim en patron).
// Bras ajustes manuellement (-160/160 -> -145/145) : les angles Gemini d'origine faisaient converger
// les mains au sommet du crane, traversant le chapeau au lieu de flanquer le panier sur les cotes.
const WALK_A: LimbAngles = {
  torsoTilt: 0, headTilt: 0,
  armUpperFront: -145, armLowerFront: 5,
  armUpperBack: 145, armLowerBack: -5,
  legUpperFront: -35, legLowerFront: 50, footFront: 0,
  legUpperBack: 30, legLowerBack: 20, footBack: 0,
  hipX: 200, hipY: 340,
};
// Angles extraits de v5-head-load-walk-b-fixed.svg (pas miroir, confirme par diff pixel), memes
// bras ajustes que WALK_A (le panier ne bouge pas, seules les jambes alternent).
const WALK_B: LimbAngles = {
  torsoTilt: 0, headTilt: 0,
  armUpperFront: -145, armLowerFront: 5,
  armUpperBack: 145, armLowerBack: -5,
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

const GeminiRigWithBasket: React.FC<{ a: LimbAngles }> = ({ a }) => (
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
      {/* Panier — remonte/elargi (rx 42->55, cy -130->-150) pour degager le sommet du chapeau et
          laisser les mains (bras a -145/145) le flanquer clairement sur les cotes sans le traverser */}
      <ellipse cx={0} cy={-150} rx={55} ry={16} fill="#D2B48C" stroke="#1A1A1A" strokeWidth={4} />
      <path d="M -55,-150 Q 0,-178 55,-150" fill="none" stroke="#1A1A1A" strokeWidth={4} />
    </g>

    <g transform={`rotate(${a.legUpperFront})`}>
      <LegFront upper={0} lower={a.legLowerFront} foot={a.footFront} />
    </g>
    <g transform="translate(0, -135)">
      <ArmFront upper={a.armUpperFront} lower={a.armLowerFront} />
    </g>
  </g>
);

// Timeline (30fps) : idle -> entre en marche chargee -> boucle walk-a/walk-b -> ralentit -> idle
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

export const PROTO_GEMINI_HEAD_LOAD_WALK_FRAMES = T.stopEnd + 20;

export const ProtoGeminiHeadLoadWalk: React.FC = () => {
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
    frame < T.walkStart ? "idle" :
    frame < T.walkEnd ? "marche chargee (panier tete)" :
    "arrive / idle";

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <div style={{ opacity: fade, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 24, color: "#2b2117", marginBottom: 4 }}>
          Test cycle "tete chargee" — poses generees 1-appel-par-pose, SVG source verbatim en patron
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#8a2b2b", marginBottom: 16 }}>{label}</div>
        <svg width={600} height={750} viewBox="-100 -60 400 600">
          <line x1={-100} y1={500} x2={300} y2={500} stroke="#2b2117" strokeWidth={2} opacity={0.3} />
          <GeminiRigWithBasket a={pose} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
