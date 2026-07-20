/**
 * PROTOTYPE — cueillette-arbre : marche vers un arbre -> s'arrete -> LEVE le bras pour cueillir une
 * cabosse suspendue -> la ramene (objet colle a la main) -> redescend le bras (objet en main basse)
 * -> repart. Geste INEDIT (n'existe pas encore cote rig capsule non plus, contrairement aux 5
 * precedents transposes depuis StickRig/poses.ts).
 *
 * Angles de reference repris du test Gemini "reach-up" deja genere et VALIDE en silhouette
 * (out/_rnd/pose-bank-test/v2-reach-up.svg, session precedente 2026-07-02) : armUpperFront=-155,
 * armLowerFront=-10, headTilt=15 (tete suit la main). PAS d'angle invente cette fois — reutilisation
 * directe d'un SVG deja produit et compare a la reference de style.
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
// Marche RETOUR (main occupee par la cabosse) — meme principe que hand-basket-walk : le bras avant
// NE PEUT PAS suivre le grand balancier (+/-45) de la marche libre, sinon l'objet tenu "vole" de
// facon incoherente. Bras avant fige pres du corps (angle reduit), seules les jambes + bras arriere
// (libre) suivent le cycle normal. Bug trouve ici : la 1ere version reutilisait WALK_A/B integral
// (bras +/-45) alors que la main tenait la cabosse -> l'objet "disparaissait" visuellement car sa
// position calculee suivait un grand arc qui sort du cadre/passe derriere la jambe a certains frames.
const WALK_A_CARRY: LimbAngles = { ...WALK_A, armUpperFront: -10, armLowerFront: -5 };
const WALK_B_CARRY: LimbAngles = { ...WALK_B, armUpperFront: -10, armLowerFront: -5 };

// REACH_UP — angles repris tels quels du test v2-reach-up.svg (session precedente, deja valide)
const REACH_UP: LimbAngles = {
  torsoTilt: -2, headTilt: 15,
  armUpperFront: -155, armLowerFront: -10,
  armUpperBack: 15, armLowerBack: -10,
  legUpperFront: -2, legLowerFront: 0, footFront: 0,
  legUpperBack: 3, legLowerBack: 0, footBack: 0,
};
// Une fois la cabosse en main, le bras redescend a une position "porte a hauteur main" (repris de
// IDLE mais main fermee tenant l'objet — meme angle que IDLE suffit, l'objet suit la main)
const HOLD_LOW: LimbAngles = { ...IDLE };

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

const BASE_HIP_X = 200, BASE_HIP_Y = 340;

const GeminiRig: React.FC<{ a: LimbAngles; bodyX: number }> = ({ a, bodyX }) => (
  <g transform={`translate(${BASE_HIP_X + bodyX}, ${BASE_HIP_Y}) rotate(${a.torsoTilt})`}>
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

// Position SCENE de la main avant (meme chaine que le SVG : hip translate -> torse rotate ->
// arm-upper translate+rotate -> arm-lower translate+rotate -> hand translate).
function computeFrontHandScene(a: LimbAngles, bodyX: number) {
  const rot = (px: number, py: number, deg: number) => {
    const r = (deg * Math.PI) / 180;
    return [px * Math.cos(r) - py * Math.sin(r), px * Math.sin(r) + py * Math.cos(r)];
  };
  const hipX = BASE_HIP_X + bodyX, hipY = BASE_HIP_Y;
  const [sx, sy] = rot(0, -135, a.torsoTilt);
  const shX = hipX + sx, shY = hipY + sy;
  const [ux, uy] = rot(0, 90, a.torsoTilt + a.armUpperFront);
  const elbowX = shX + ux, elbowY = shY + uy;
  const [lx, ly] = rot(0, 75, a.torsoTilt + a.armUpperFront + a.armLowerFront);
  return { x: elbowX + lx, y: elbowY + ly + 10 };
}

const HALF_STEP = 14;
function walkCycle(frame: number, start: number, walkA: LimbAngles = WALK_A, walkB: LimbAngles = WALK_B) {
  const cf = frame - start;
  const stepIndex = Math.floor(cf / HALF_STEP);
  const localT = (cf % HALF_STEP) / HALF_STEP;
  const from = stepIndex % 2 === 0 ? walkA : walkB;
  const to = stepIndex % 2 === 0 ? walkB : walkA;
  return lerpAngles(from, to, localT);
}

const T = {
  fadeEnd: 15,
  walkStart: 15, walkEnterEnd: 25, walkEnd: 75,
  reachEnd: 100, fGrab: 105, holdEnd: 118,
  lowerEnd: 140,
  walk2Start: 140, walk2EnterEnd: 150, walk2End: 200,
  stopEnd: 215,
};

const TREE_X = 620, POD_X_LOCAL = 20, POD_Y = 130; // cabosse suspendue, position scene = TREE_X+20, POD_Y
const STOP_BODY_X = TREE_X - 90; // le corps s'arrete a distance de bras de l'arbre

export const PROTO_GEMINI_TREE_CUEILLETTE_FRAMES = T.stopEnd + 20;

export const ProtoGeminiTreeCueillette: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, T.fadeEnd], [0, 1], { extrapolateRight: "clamp" });

  let limb: LimbAngles;
  let bodyX = 0;
  let label = "idle";

  if (frame < T.walkStart) {
    limb = IDLE; bodyX = -250;
  } else if (frame < T.walkEnterEnd) {
    const t = interpolate(frame, [T.walkStart, T.walkEnterEnd], [0, 1], { extrapolateRight: "clamp" });
    limb = lerpAngles(IDLE, WALK_A, easeInOutCubic(t));
    bodyX = interpolate(frame, [T.walkStart, T.walkEnd], [-250, STOP_BODY_X], { extrapolateRight: "clamp" });
    label = "marche vers l'arbre";
  } else if (frame < T.walkEnd) {
    limb = walkCycle(frame, T.walkEnterEnd);
    bodyX = interpolate(frame, [T.walkStart, T.walkEnd], [-250, STOP_BODY_X], { extrapolateRight: "clamp" });
    label = "marche vers l'arbre";
  } else if (frame < T.reachEnd) {
    const t = interpolate(frame, [T.walkEnd, T.reachEnd], [0, 1], { extrapolateRight: "clamp" });
    limb = lerpAngles(IDLE, REACH_UP, easeInOutCubic(t)); bodyX = STOP_BODY_X;
    label = "leve le bras vers la cabosse";
  } else if (frame < T.holdEnd) {
    limb = REACH_UP; bodyX = STOP_BODY_X;
    label = frame < T.fGrab ? "leve le bras vers la cabosse" : "cueille (hold)";
  } else if (frame < T.lowerEnd) {
    const t = interpolate(frame, [T.holdEnd, T.lowerEnd], [0, 1], { extrapolateRight: "clamp" });
    limb = lerpAngles(REACH_UP, HOLD_LOW, easeInOutCubic(t)); bodyX = STOP_BODY_X;
    label = "redescend le bras, cabosse en main";
  } else if (frame < T.walk2EnterEnd) {
    const t = interpolate(frame, [T.walk2Start, T.walk2EnterEnd], [0, 1], { extrapolateRight: "clamp" });
    limb = lerpAngles(HOLD_LOW, WALK_A_CARRY, easeInOutCubic(t));
    bodyX = interpolate(frame, [T.walk2Start, T.walk2End], [STOP_BODY_X, STOP_BODY_X + 200], { extrapolateRight: "clamp" });
    label = "repart avec la cabosse";
  } else if (frame < T.walk2End) {
    limb = walkCycle(frame, T.walk2EnterEnd, WALK_A_CARRY, WALK_B_CARRY);
    bodyX = interpolate(frame, [T.walk2Start, T.walk2End], [STOP_BODY_X, STOP_BODY_X + 200], { extrapolateRight: "clamp" });
    label = "repart avec la cabosse";
  } else if (frame < T.stopEnd) {
    const t = interpolate(frame, [T.walk2End, T.stopEnd], [0, 1], { extrapolateRight: "clamp" });
    limb = lerpAngles(WALK_A_CARRY, IDLE, easeInOutCubic(t)); bodyX = STOP_BODY_X + 200;
    label = "arrive / idle";
  } else {
    limb = IDLE; bodyX = STOP_BODY_X + 200;
  }

  // Machine a etats objet : cabosse suspendue a l'arbre jusqu'au grab, puis colle a la main reelle
  const inHand = frame >= T.fGrab;
  const handScene = computeFrontHandScene(limb, bodyX);
  const podX = inHand ? handScene.x : TREE_X + POD_X_LOCAL;
  const podY = inHand ? handScene.y : POD_Y;

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <div style={{ opacity: fade, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#2b2117", marginBottom: 4 }}>
          Cueillette-arbre (INEDIT) : marche -&gt; leve le bras -&gt; cueille (angles repris de v2-reach-up.svg) -&gt; repart
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#8a2b2b", marginBottom: 16 }}>{label}</div>
        <svg width={1000} height={750} viewBox="-150 -220 1150 750">
          <line x1={-150} y1={500} x2={1000} y2={500} stroke="#2b2117" strokeWidth={2} opacity={0.3} />
          {/* Arbre simple : tronc + houppier, cabosse suspendue */}
          <g transform={`translate(${TREE_X}, 500)`}>
            <path d="M -14,0 L 14,0 L 10,-260 L -10,-260 Z" fill="#5e3d22" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
            <ellipse cx={0} cy={-320} rx={110} ry={90} fill="#6a8f5a" stroke="#1A1A1A" strokeWidth={4} />
          </g>
          <GeminiRig a={limb} bodyX={bodyX} />
          {/* Cabosse : suspendue a l'arbre (branche courte) ou en main */}
          {!inHand && (
            <line x1={TREE_X + POD_X_LOCAL} y1={POD_Y - 20} x2={TREE_X + POD_X_LOCAL} y2={POD_Y} stroke="#1A1A1A" strokeWidth={3} />
          )}
          <ellipse cx={podX} cy={podY} rx={18} ry={14} fill="#4a2c14" stroke="#1A1A1A" strokeWidth={3} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
