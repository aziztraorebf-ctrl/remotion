/**
 * PROTOTYPE — marche -> se penche -> ramasse au sol -> se redresse -> repart. Transposition de la
 * mecanique "bend" du rig capsule (rig/poses.ts, computePose) vers le personnage Gemini, meme methode
 * que ProtoGeminiHandBasketWalk/ShoulderSackWalk (2026-07-02) : PAS d'angles devinés, calcul trigono-
 * metrique direct depuis la formule source.
 *
 * Formule reprise EXACTEMENT de poses.ts computePose(bend) :
 *   torsoDeg = bend * 70          (0 debout -> 70 penche complet)
 *   hipBack  = -(torsoDeg/90)*70  (COMPENSATION bassin recule, evite la bascule-arriere)
 *   hipDrop  = bend * 34          (bassin descend, accroupissement leger)
 *   frontArmDeg (ABSOLU, independant du torse) = 22 vers le sol-avant pour ramasser
 *     -> converti en angle LOCAL (notre bras herite deja rotate(torsoTilt) du parent) :
 *        armUpperFront_local = frontArmDeg_absolu - torsoDeg
 * Sans cette conversion, le bras "ramasse" dans le mauvais sens des lors que le torse est incline.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const PARCH = "#e8dcc0";

type LimbAngles = {
  torsoTilt: number;
  headTilt: number;
  hipXOffset: number; hipYOffset: number;
  armUpperFront: number; armLowerFront: number;
  armUpperBack: number; armLowerBack: number;
  legUpperFront: number; legLowerFront: number; footFront: number;
  legUpperBack: number; legLowerBack: number; footBack: number;
};

const BASE_HIP_X = 200, BASE_HIP_Y = 340;

function bendPose(bend: number): LimbAngles {
  const torsoDeg = bend * 70;
  const hipBack = -(torsoDeg / 90) * 70;
  // hipDrop proportionnel a NOS jambes (200 = 110 upper + 90 lower), pas la constante 34 empruntee
  // au systeme source (LEG=150 la-bas) — sinon le ratio drop/jambe est faux pour notre echelle.
  const hipDrop = bend * 200 * (34 / 150);
  const frontArmAbs = 22; // vise le sol-avant, ABSOLU (independant du torse)
  const armUpperFrontLocal = frontArmAbs - torsoDeg;
  return {
    torsoTilt: torsoDeg,
    headTilt: -torsoDeg * 0.15, // leger redressement de la nuque (poses.ts commentaire ligne 108)
    hipXOffset: hipBack,
    hipYOffset: hipDrop,
    armUpperFront: armUpperFrontLocal, armLowerFront: bend > 0.5 ? -20 : -5,
    armUpperBack: 5, armLowerBack: 5,
    // Jambes RESTENT DROITES (angle 0) — confirme dans poses.ts : stepAmp = moveAmt*(1-bend), donc
    // swingDeg=0 des que bend=1. Ce n'est PAS une flexion de genou active, le bassin descend en
    // ligne "droite" et le genou reste sur l'axe vertical hanche->pied (juste le pied garde un
    // petit décalage horizontal via toeX). Erreur precedente : j'avais invente une rotation de
    // jambe qui n'existe pas dans la source, ce qui cassait la silhouette (effet "planche/pompe").
    legUpperFront: 0, legLowerFront: 0, footFront: 0,
    legUpperBack: 0, legLowerBack: 0, footBack: 0,
  };
}

const IDLE: LimbAngles = { ...bendPose(0) };
const BEND_FULL: LimbAngles = { ...bendPose(1) };
// walk-a/b reprises du cycle deja valide (v5-head-load-walk), sans charge
const WALK_A: LimbAngles = {
  torsoTilt: 0, headTilt: 0, hipXOffset: 0, hipYOffset: 0,
  armUpperFront: -45, armLowerFront: -15,
  armUpperBack: 45, armLowerBack: -15,
  legUpperFront: -35, legLowerFront: 50, footFront: 0,
  legUpperBack: 30, legLowerBack: 20, footBack: 0,
};
const WALK_B: LimbAngles = {
  torsoTilt: 0, headTilt: 0, hipXOffset: 0, hipYOffset: 0,
  armUpperFront: 45, armLowerFront: -15,
  armUpperBack: -45, armLowerBack: -15,
  legUpperFront: 30, legLowerFront: 20, footFront: 0,
  legUpperBack: -35, legLowerBack: 50, footBack: 0,
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

// IMPORTANT : le groupe HANCHE ne fait que se POSITIONNER (translate) — il ne tourne PAS. Le torse
// pivote dans un sous-groupe SEPARE (rotate(torsoTilt) applique seulement a torse+bras+tete). Les
// jambes restent enfants directs du groupe hanche, donc VERTICALES dans l'espace absolu meme quand
// le torse penche a 70 deg — exactement le comportement de poses.ts (jambes non affectees par bend,
// seul le bassin translate + le torse pivote autour de lui). Bug precedent : jambes ET torse
// heritaient du meme rotate(torsoTilt), ce qui faisait pivoter tout le corps comme un bloc rigide
// (effet "planche/pompe" au lieu d'un vrai penche avec jambes plantees au sol).
const GeminiRigBend: React.FC<{ a: LimbAngles }> = ({ a }) => (
  <g transform={`translate(${BASE_HIP_X + a.hipXOffset}, ${BASE_HIP_Y + a.hipYOffset})`}>
    <g transform={`rotate(${a.legUpperBack})`}>
      <LegFront upper={0} lower={a.legLowerBack} foot={a.footBack} />
    </g>
    <g transform={`rotate(${a.legUpperFront})`}>
      <LegFront upper={0} lower={a.legLowerFront} foot={a.footFront} />
    </g>

    <g transform={`rotate(${a.torsoTilt})`}>
      <g transform={`translate(0, -135) rotate(${a.armUpperBack})`}>
        <ArmFree upper={0} lower={a.armLowerBack} />
      </g>

      <path d="M -20,-135 C -20,-135 -25,-70 -18,0 L 18,0 C 25,-70 20,-135 20,-135 Z" fill="#FFFDD0" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
      <path d="M -18,0 L 18,0 L 17,15 L -17,15 Z" fill="#2F4F4F" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
      <g transform={`translate(0, -135) rotate(${a.headTilt})`}>
        <path d="M -50,-50 Q 0,-40 50,-50 L 0,-110 Z" fill="#D2B48C" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
        <circle cx={0} cy={-45} r={28} fill="#8B5A2B" stroke="#1A1A1A" strokeWidth={4} />
        <circle cx={14} cy={-50} r={3} fill="#1A1A1A" />
      </g>

      <g transform="translate(0, -135)">
        <ArmFree upper={a.armUpperFront} lower={a.armLowerFront} />
      </g>
    </g>
  </g>
);

const T = {
  fadeEnd: 15,
  walkStart: 15,
  walkEnterEnd: 25,
  walkEnd: 80,
  bendDownEnd: 105,
  holdEnd: 125,
  bendUpEnd: 150,
  walk2Start: 150,
  walk2EnterEnd: 160,
  walk2End: 210,
  stopEnd: 225,
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

export const PROTO_GEMINI_BEND_PICKUP_FRAMES = T.stopEnd + 20;

export const ProtoGeminiBendPickup: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, T.fadeEnd], [0, 1], { extrapolateRight: "clamp" });

  let pose: LimbAngles;
  let label: string;
  if (frame < T.walkStart) {
    pose = IDLE; label = "idle";
  } else if (frame < T.walkEnterEnd) {
    const t = interpolate(frame, [T.walkStart, T.walkEnterEnd], [0, 1], { extrapolateRight: "clamp" });
    pose = lerpAngles(IDLE, WALK_A, easeInOutCubic(t)); label = "entre en marche";
  } else if (frame < T.walkEnd) {
    pose = walkCycle(frame, T.walkEnterEnd, T.walkEnd); label = "marche";
  } else if (frame < T.bendDownEnd) {
    const t = interpolate(frame, [T.walkEnd, T.bendDownEnd], [0, 1], { extrapolateRight: "clamp" });
    pose = lerpAngles(IDLE, BEND_FULL, easeInOutCubic(t)); label = "se penche";
  } else if (frame < T.holdEnd) {
    pose = BEND_FULL; label = "ramasse (hold)";
  } else if (frame < T.bendUpEnd) {
    const t = interpolate(frame, [T.holdEnd, T.bendUpEnd], [0, 1], { extrapolateRight: "clamp" });
    pose = lerpAngles(BEND_FULL, IDLE, easeInOutCubic(t)); label = "se redresse";
  } else if (frame < T.walk2EnterEnd) {
    const t = interpolate(frame, [T.walk2Start, T.walk2EnterEnd], [0, 1], { extrapolateRight: "clamp" });
    pose = lerpAngles(IDLE, WALK_A, easeInOutCubic(t)); label = "repart";
  } else if (frame < T.walk2End) {
    pose = walkCycle(frame, T.walk2EnterEnd, T.walk2End); label = "marche";
  } else if (frame < T.stopEnd) {
    const t = interpolate(frame, [T.walk2End, T.stopEnd], [0, 1], { extrapolateRight: "clamp" });
    pose = lerpAngles(WALK_A, IDLE, easeInOutCubic(t)); label = "arrive / idle";
  } else {
    pose = IDLE; label = "idle";
  }

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <div style={{ opacity: fade, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 24, color: "#2b2117", marginBottom: 4 }}>
          Transposition recolte-au-sol : marche -&gt; penche (compensation bassin) -&gt; ramasse -&gt; redresse -&gt; repart
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#8a2b2b", marginBottom: 16 }}>{label}</div>
        <svg width={600} height={750} viewBox="-100 -60 400 600">
          <line x1={-100} y1={500} x2={300} y2={500} stroke="#2b2117" strokeWidth={2} opacity={0.3} />
          <GeminiRigBend a={pose} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
