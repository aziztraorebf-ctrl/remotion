/**
 * PROTOTYPE — manipuler un objet : marche -> se penche -> RAMASSE (objet colle a la main) -> se
 * redresse en le tenant -> marche vers un contenant -> se penche -> DEPOSE (objet disparait, contenu+1)
 * -> repart. Transposition de rig/objectHandling.ts (machine a etats objectState) vers le personnage
 * Gemini, batie sur le "bend" deja valide (ProtoGeminiBendPickup.tsx).
 *
 * Principe-cle repris tel quel (objectHandling.ts commentaire) : l'objet est TOUJOURS colle a la
 * position REELLE de la main (calculee par la meme chaine de transform que le SVG, PAS une trajectoire
 * inventee) tant qu'il est tenu. JAMAIS de glissade autonome de l'objet vers une cible.
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
  bodyX: number; // translation horizontale globale (marche vers le contenant)
};

const BASE_HIP_X = 200, BASE_HIP_Y = 340;

function bendPose(bend: number): Omit<LimbAngles, "bodyX"> {
  const torsoDeg = bend * 70;
  const hipBack = -(torsoDeg / 90) * 70;
  const hipDrop = bend * 200 * (34 / 150);
  const frontArmAbs = 22;
  const armUpperFrontLocal = frontArmAbs - torsoDeg;
  return {
    torsoTilt: torsoDeg,
    headTilt: -torsoDeg * 0.15,
    hipXOffset: hipBack,
    hipYOffset: hipDrop,
    armUpperFront: armUpperFrontLocal, armLowerFront: bend > 0.5 ? -20 : -5,
    armUpperBack: 5, armLowerBack: 5,
    legUpperFront: 0, legLowerFront: 0, footFront: 0,
    legUpperBack: 0, legLowerBack: 0, footBack: 0,
  };
}

const IDLE: Omit<LimbAngles, "bodyX"> = bendPose(0);
const BEND_FULL: Omit<LimbAngles, "bodyX"> = bendPose(1);
const WALK_A: Omit<LimbAngles, "bodyX"> = {
  torsoTilt: 0, headTilt: 0, hipXOffset: 0, hipYOffset: 0,
  armUpperFront: -45, armLowerFront: -15,
  armUpperBack: 45, armLowerBack: -15,
  legUpperFront: -35, legLowerFront: 50, footFront: 0,
  legUpperBack: 30, legLowerBack: 20, footBack: 0,
};
const WALK_B: Omit<LimbAngles, "bodyX"> = {
  torsoTilt: 0, headTilt: 0, hipXOffset: 0, hipYOffset: 0,
  armUpperFront: 45, armLowerFront: -15,
  armUpperBack: -45, armLowerBack: -15,
  legUpperFront: 30, legLowerFront: 20, footFront: 0,
  legUpperBack: -35, legLowerBack: 50, footBack: 0,
};

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function lerpAngles<T extends Record<string, number>>(a: T, b: T, t: number): T {
  const out: Partial<T> = {};
  (Object.keys(a) as (keyof T)[]).forEach((k) => { out[k] = lerp(a[k], b[k], t) as T[keyof T]; });
  return out as T;
}
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Calcule la position SCENE de la main avant en suivant EXACTEMENT la meme chaine de transform que le
// SVG (hip translate -> torse rotate -> arm-upper translate+rotate -> arm-lower translate+rotate ->
// hand translate). Sans ca, coller l'objet "a l'oeil" recree le bug "glissade autonome" deja documente.
function computeFrontHandScene(a: Omit<LimbAngles, "bodyX">, bodyX: number) {
  const rot = (x: number, y: number, deg: number) => {
    const r = (deg * Math.PI) / 180;
    return [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)];
  };
  const hipX = BASE_HIP_X + a.hipXOffset + bodyX;
  const hipY = BASE_HIP_Y + a.hipYOffset;
  const [sx, sy] = rot(0, -135, a.torsoTilt);
  const shX = hipX + sx, shY = hipY + sy;
  const [ux, uy] = rot(0, 90, a.torsoTilt + a.armUpperFront);
  const elbowX = shX + ux, elbowY = shY + uy;
  const [lx, ly] = rot(0, 75, a.torsoTilt + a.armUpperFront + a.armLowerFront);
  return { x: elbowX + lx, y: elbowY + ly + 10 }; // +10 = offset du cercle main (cy=10 dans ArmFree)
}

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

const GeminiRigBend: React.FC<{ a: LimbAngles }> = ({ a }) => (
  <g transform={`translate(${BASE_HIP_X + a.hipXOffset + a.bodyX}, ${BASE_HIP_Y + a.hipYOffset})`}>
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

// Timeline : idle -> marche vers l'objet au sol -> se penche -> RAMASSE -> se redresse (tient l'objet)
// -> marche vers le contenant -> se penche -> DEPOSE (objet disparait) -> se redresse -> repart -> idle
const T = {
  fadeEnd: 15,
  walkStart: 15, walkEnterEnd: 25, walkEnd: 70,
  bendDownEnd: 95, fGrab: 100, holdEnd: 115,
  bendUpEnd: 140,
  walk2Start: 140, walk2EnterEnd: 150, walk2End: 210,
  bend2DownEnd: 235, fDrop: 240, hold2End: 250,
  bend2UpEnd: 275,
  walk3Start: 275, walk3EnterEnd: 285, walk3End: 320,
  stopEnd: 335,
};
const HALF_STEP = 14;

// Objet au sol (position depart), contenant (position arrivee) — coordonnees SCENE
// Calibre sur la position REELLE de la main au frame de ramassage (calculee via computeFrontHandScene
// a bend=1, bodyX=220 — pas une estimation a l'oeil), pour que l'objet ne "saute" pas au grab.
const GROUND_OBJ_X = 456, GROUND_OBJ_Y = 508;
const CONTAINER_X = 900, CONTAINER_Y = 500;

function walkCycle(frame: number, start: number, end: number) {
  const cf = frame - start;
  const stepIndex = Math.floor(cf / HALF_STEP);
  const localT = (cf % HALF_STEP) / HALF_STEP;
  const from = stepIndex % 2 === 0 ? WALK_A : WALK_B;
  const to = stepIndex % 2 === 0 ? WALK_B : WALK_A;
  return lerpAngles(from, to, localT);
}

export const PROTO_GEMINI_MANIPULATE_OBJECT_FRAMES = T.stopEnd + 20;

export const ProtoGeminiManipulateObject: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, T.fadeEnd], [0, 1], { extrapolateRight: "clamp" });

  let limb: Omit<LimbAngles, "bodyX">;
  let bodyX = 0;
  let label = "idle";

  if (frame < T.walkStart) {
    limb = IDLE; bodyX = 0;
  } else if (frame < T.walkEnterEnd) {
    const t = interpolate(frame, [T.walkStart, T.walkEnterEnd], [0, 1], { extrapolateRight: "clamp" });
    limb = lerpAngles(IDLE, WALK_A, easeInOutCubic(t));
    bodyX = interpolate(frame, [T.walkStart, T.walkEnd], [0, 220], { extrapolateRight: "clamp" });
    label = "marche vers l'objet";
  } else if (frame < T.walkEnd) {
    limb = walkCycle(frame, T.walkEnterEnd, T.walkEnd);
    bodyX = interpolate(frame, [T.walkStart, T.walkEnd], [0, 220], { extrapolateRight: "clamp" });
    label = "marche vers l'objet";
  } else if (frame < T.bendDownEnd) {
    const t = interpolate(frame, [T.walkEnd, T.bendDownEnd], [0, 1], { extrapolateRight: "clamp" });
    limb = lerpAngles(IDLE, BEND_FULL, easeInOutCubic(t)); bodyX = 220;
    label = "se penche vers l'objet";
  } else if (frame < T.holdEnd) {
    limb = BEND_FULL; bodyX = 220; label = frame < T.fGrab ? "se penche vers l'objet" : "ramasse (hold)";
  } else if (frame < T.bendUpEnd) {
    const t = interpolate(frame, [T.holdEnd, T.bendUpEnd], [0, 1], { extrapolateRight: "clamp" });
    limb = lerpAngles(BEND_FULL, IDLE, easeInOutCubic(t)); bodyX = 220;
    label = "se redresse, objet en main";
  } else if (frame < T.walk2EnterEnd) {
    const t = interpolate(frame, [T.walk2Start, T.walk2EnterEnd], [0, 1], { extrapolateRight: "clamp" });
    limb = lerpAngles(IDLE, WALK_A, easeInOutCubic(t));
    bodyX = interpolate(frame, [T.walk2Start, T.walk2End], [220, 620], { extrapolateRight: "clamp" });
    label = "transporte vers le contenant";
  } else if (frame < T.walk2End) {
    limb = walkCycle(frame, T.walk2EnterEnd, T.walk2End);
    bodyX = interpolate(frame, [T.walk2Start, T.walk2End], [220, 620], { extrapolateRight: "clamp" });
    label = "transporte vers le contenant";
  } else if (frame < T.bend2DownEnd) {
    const t = interpolate(frame, [T.walk2End, T.bend2DownEnd], [0, 1], { extrapolateRight: "clamp" });
    limb = lerpAngles(IDLE, BEND_FULL, easeInOutCubic(t)); bodyX = 620;
    label = "se penche au-dessus du contenant";
  } else if (frame < T.hold2End) {
    limb = BEND_FULL; bodyX = 620; label = frame < T.fDrop ? "se penche au-dessus du contenant" : "depose (hold)";
  } else if (frame < T.bend2UpEnd) {
    const t = interpolate(frame, [T.hold2End, T.bend2UpEnd], [0, 1], { extrapolateRight: "clamp" });
    limb = lerpAngles(BEND_FULL, IDLE, easeInOutCubic(t)); bodyX = 620;
    label = "se redresse";
  } else if (frame < T.walk3EnterEnd) {
    const t = interpolate(frame, [T.walk3Start, T.walk3EnterEnd], [0, 1], { extrapolateRight: "clamp" });
    limb = lerpAngles(IDLE, WALK_A, easeInOutCubic(t));
    bodyX = interpolate(frame, [T.walk3Start, T.walk3End], [620, 850], { extrapolateRight: "clamp" });
    label = "repart";
  } else if (frame < T.walk3End) {
    limb = walkCycle(frame, T.walk3EnterEnd, T.walk3End);
    bodyX = interpolate(frame, [T.walk3Start, T.walk3End], [620, 850], { extrapolateRight: "clamp" });
    label = "repart";
  } else if (frame < T.stopEnd) {
    const t = interpolate(frame, [T.walk3End, T.stopEnd], [0, 1], { extrapolateRight: "clamp" });
    limb = lerpAngles(WALK_A, IDLE, easeInOutCubic(t)); bodyX = 850;
    label = "arrive / idle";
  } else {
    limb = IDLE; bodyX = 850;
  }

  const a: LimbAngles = { ...limb, bodyX };

  // Machine a etats objet (repris de objectHandling.ts) : colle a la main tant que tenu, jamais de
  // glissade autonome vers une cible.
  const inHand = frame >= T.fGrab && frame < T.fDrop;
  const deposited = frame >= T.fDrop;
  const objectVisible = frame < T.fDrop;
  const handScene = computeFrontHandScene(limb, bodyX);
  const objX = inHand ? handScene.x : GROUND_OBJ_X;
  const objY = inHand ? handScene.y : GROUND_OBJ_Y;

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <div style={{ opacity: fade, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#2b2117", marginBottom: 4 }}>
          Manipuler un objet : ramasse (colle a la main reelle) -&gt; transporte -&gt; depose dans contenant
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#8a2b2b", marginBottom: 16 }}>{label}</div>
        <svg width={900} height={750} viewBox="-100 -60 1100 600">
          <line x1={-100} y1={500} x2={1000} y2={500} stroke="#2b2117" strokeWidth={2} opacity={0.3} />
          {/* Contenant (panier au sol) */}
          <g transform={`translate(${CONTAINER_X}, ${CONTAINER_Y})`}>
            <path d="M -35,0 L 35,0 L 28,45 L -28,45 Z" fill="#D2B48C" stroke="#1A1A1A" strokeWidth={4} strokeLinejoin="round" />
            {deposited && <circle cx={0} cy={20} r={10} fill="#5e3d22" stroke="#1A1A1A" strokeWidth={3} />}
          </g>
          <GeminiRigBend a={a} />
          {/* Objet au sol / en main (cabosse de cacao, simple ellipse brune) — dessine APRES le
              personnage pour rester visible PAR-DESSUS la main quand tenu (sinon le bras/torse le
              masque, bug trouve ici : l'objet etait invisible car dessine avant le rig). */}
          {objectVisible && (
            <ellipse cx={objX} cy={objY} rx={20} ry={16} fill="#4a2c14" stroke="#1A1A1A" strokeWidth={3} />
          )}
        </svg>
      </div>
    </AbsoluteFill>
  );
};
