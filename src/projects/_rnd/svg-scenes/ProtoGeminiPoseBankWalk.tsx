/**
 * GeminiRig — rig FK canonique du personnage Souverain (text-to-SVG Gemini 3.1 Pro, 2026-07-02).
 * Hierarchie parent->enfant (translate au joint + rotate) pour interpolation fluide.
 * Exporte GeminiRig (composant parametre) + poses + helpers.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const PARCH = "#e8dcc0";

export type LimbAngles = {
  torsoTilt: number;
  headTilt: number;
  armUpperFront: number; armLowerFront: number;
  armUpperBack: number; armLowerBack: number;
  legUpperFront: number; legLowerFront: number; footFront: number;
  legUpperBack: number; legLowerBack: number; footBack: number;
  hipX: number; hipY: number;
};

export type FaceExpression = "none" | "neutral" | "smile" | "serious" | "surprise" | "angry";
export type FaceView = "profile" | "front";

export type GeminiRigProps = {
  a: LimbAngles;
  face?: FaceExpression;
  faceView?: FaceView;
  skinTone?: string;
  clothesColor?: string;
  pantsColor?: string;
  inkColor?: string;
  hatType?: "conical" | "cap" | "scarf" | "none";
  hatColor?: string;
};

export const WALK_A: LimbAngles = {
  torsoTilt: 5, headTilt: -5,
  armUpperFront: -35, armLowerFront: -20,
  armUpperBack: 40, armLowerBack: -20,
  legUpperFront: -45, legLowerFront: 45, footFront: 0,
  legUpperBack: 30, legLowerBack: 0, footBack: 45,
  hipX: 200, hipY: 365,
};
export const WALK_B: LimbAngles = {
  torsoTilt: 5, headTilt: -5,
  armUpperFront: 40, armLowerFront: -20,
  armUpperBack: -35, armLowerBack: -20,
  legUpperFront: 30, legLowerFront: 0, footFront: 45,
  legUpperBack: -45, legLowerBack: 45, footBack: 0,
  hipX: 200, hipY: 365,
};
export const IDLE: LimbAngles = {
  torsoTilt: 0, headTilt: 0,
  armUpperFront: -5, armLowerFront: 0,
  armUpperBack: 5, armLowerBack: 0,
  legUpperFront: 0, legLowerFront: 0, footFront: 0,
  legUpperBack: 0, legLowerBack: 0, footBack: 0,
  hipX: 200, hipY: 340,
};

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
export function lerpAngles(a: LimbAngles, b: LimbAngles, t: number): LimbAngles {
  const out: Partial<LimbAngles> = {};
  (Object.keys(a) as (keyof LimbAngles)[]).forEach((k) => {
    out[k] = lerp(a[k], b[k], t);
  });
  return out as LimbAngles;
}

const ArmSegment = ({
  upper, lower, skin, clothes, ink,
}: {
  upper: number; lower: number; skin: string; clothes: string; ink: string;
}) => (
  <g transform={`rotate(${upper})`}>
    <path d="M -7,40 L 7,40 L 6,90 L -6,90 Z" fill={skin} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -12,0 L 12,0 L 14,45 L -14,45 Z" fill={clothes} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
    <g transform={`translate(0, 90) rotate(${lower})`}>
      <path d="M -6,0 L 6,0 L 5,75 L -5,75 Z" fill={skin} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
      <g transform="translate(0, 75)">
        <circle cx={0} cy={10} r={12} fill={skin} stroke={ink} strokeWidth={4} />
      </g>
    </g>
  </g>
);

const LegSegment = ({
  upper, lower, foot, pants, skin, ink, soleColor,
}: {
  upper: number; lower: number; foot: number;
  pants: string; skin: string; ink: string; soleColor: string;
}) => (
  <g transform={`rotate(${upper})`}>
    <path d="M -13,0 L 13,0 L 10,110 L -10,110 Z" fill={pants} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
    <g transform={`translate(0, 110) rotate(${lower})`}>
      <path d="M -10,0 L 10,0 L 7,90 L -7,90 Z" fill={pants} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
      <g transform={`translate(0, 90) rotate(${foot})`}>
        <path
          d="M -7,0 L 7,0 L 9,8 L 22,12 C 24,13 24,16 22,16 L -9,16 C -11,16 -11,12 -9,8 Z"
          fill={skin} stroke={ink} strokeWidth={4} strokeLinejoin="round"
        />
        <path d="M -11,16 L 24,16 L 24,20 L -11,20 Z" fill={soleColor} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
      </g>
    </g>
  </g>
);

const Neck: React.FC<{ skin: string; ink: string; frontal: boolean }> = ({ skin, ink, frontal }) => {
  const w = frontal ? 10 : 8;
  return (
    <path
      d={`M ${-w},-135 L ${w},-135 L ${w * 0.8},-148 L ${-w * 0.8},-148 Z`}
      fill={skin} stroke={ink} strokeWidth={3} strokeLinejoin="round"
    />
  );
};

const FaceFeatures: React.FC<{
  face: FaceExpression;
  faceView: FaceView;
  ink: string;
  headCY: number;
}> = ({ face, faceView, ink, headCY }) => {
  if (face === "none") return null;

  const EYE_R = 3;
  const eyeY = headCY - 2;
  const browY = eyeY - 9;
  const mouthY = headCY + 12;
  const browAngle = face === "angry" ? 12 : face === "surprise" ? -8 : face === "serious" ? 4 : 0;
  const mouthW = face === "surprise" ? 0 : face === "smile" ? 7 : 5;

  const isProfile = faceView === "profile";

  const eye1X = isProfile ? 12 : -10;
  const eye2X = isProfile ? null : 10;
  const mouthCenterX = isProfile ? 10 : 0;

  return (
    <>
      <circle cx={eye1X} cy={eyeY} r={EYE_R} fill={ink} />
      {eye2X != null && <circle cx={eye2X} cy={eyeY} r={EYE_R} fill={ink} />}
      <line
        x1={eye1X - 5} y1={browY + browAngle * 0.3}
        x2={eye1X + 5} y2={browY - browAngle * 0.3}
        stroke={ink} strokeWidth={2.5} strokeLinecap="round"
      />
      {eye2X != null && (
        <line
          x1={eye2X - 5} y1={browY + browAngle * 0.3}
          x2={eye2X + 5} y2={browY - browAngle * 0.3}
          stroke={ink} strokeWidth={2.5} strokeLinecap="round"
        />
      )}
      {face === "surprise"
        ? <ellipse cx={mouthCenterX} cy={mouthY} rx={4} ry={5} fill={ink} />
        : <path
            d={`M ${mouthCenterX - mouthW} ${mouthY} q ${mouthW} ${face === "smile" ? 5 : face === "serious" ? -1 : 2} ${mouthW * 2} 0`}
            fill="none" stroke={ink} strokeWidth={2.5} strokeLinecap="round"
          />
      }
    </>
  );
};

const HatProfile: React.FC<{ hatType: string; hc: string; ink: string }> = ({ hatType, hc, ink }) => {
  if (hatType === "conical") {
    return (
      <path d="M -15,-22 Q 15,-36 40,-22 L 15,-80 Z" fill={hc} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
    );
  }
  if (hatType === "cap") {
    return (
      <>
        <path d="M -26 -16 A 26 26 0 0 1 26 -16 Z" fill={hc} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
        <path d="M 22 -14 L 50 -10 L 48 -4 L 20 -8 Z" fill={hc} stroke={ink} strokeWidth={3.5} strokeLinejoin="round" opacity={0.85} />
      </>
    );
  }
  if (hatType === "scarf") {
    return (
      <>
        <path d="M -26 -10 A 26 24 0 0 1 26 -10 Z" fill={hc} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
        <path d="M -22 -10 q -18 8 -30 2" fill="none" stroke={hc} strokeWidth={6} strokeLinecap="round" />
      </>
    );
  }
  return null;
};

const HatFront: React.FC<{ hatType: string; hc: string; ink: string }> = ({ hatType, hc, ink }) => {
  if (hatType === "conical") {
    return (
      <path d="M -50,-50 Q 0,-40 50,-50 L 0,-110 Z" fill={hc} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
    );
  }
  if (hatType === "cap") {
    return (
      <path d="M -28 -16 A 28 28 0 0 1 28 -16 Z" fill={hc} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
    );
  }
  if (hatType === "scarf") {
    return (
      <path d="M -28 -10 A 28 24 0 0 1 28 -10 Z" fill={hc} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
    );
  }
  return null;
};

export const GeminiRig: React.FC<GeminiRigProps> = ({
  a,
  face = "none",
  faceView = "profile",
  skinTone = "#8B5A2B",
  clothesColor = "#FFFDD0",
  pantsColor = "#2F4F4F",
  inkColor = "#1A1A1A",
  hatType = "conical",
  hatColor,
}) => {
  const ink = inkColor;
  const skin = skinTone;
  const clothes = clothesColor;
  const pants = pantsColor;
  const sole = "#3E2723";
  const isFrontal = faceView === "front";

  const defaultHatColor = hatType === "cap" ? "#5e7245" : hatType === "scarf" ? "#b5552f" : "#D2B48C";
  const hc = hatColor || defaultHatColor;

  if (isFrontal) {
    const legSpread = 18;
    return (
      <g transform={`translate(${a.hipX}, ${a.hipY})`}>
        {/* FRONTAL: jambes droites paralleles */}
        <g opacity={0.85}>
          <path d={`M ${-legSpread - 10},0 L ${-legSpread + 10},0 L ${-legSpread + 7},200 L ${-legSpread - 7},200 Z`} fill={pants} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
          <path d={`M ${legSpread - 10},0 L ${legSpread + 10},0 L ${legSpread + 7},200 L ${legSpread - 7},200 Z`} fill={pants} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
          <path d={`M ${-legSpread - 9},200 L ${-legSpread + 9},200 L ${-legSpread + 9},210 L ${-legSpread - 9},210 Z`} fill={sole} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
          <path d={`M ${legSpread - 9},200 L ${legSpread + 9},200 L ${legSpread + 9},210 L ${legSpread - 9},210 Z`} fill={sole} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
        </g>

        {/* ceinture */}
        <path d="M -22,0 L 22,0 L 21,15 L -21,15 Z" fill={pants} stroke={ink} strokeWidth={4} strokeLinejoin="round" />

        {/* torse frontal */}
        <path
          d="M -24,-135 C -24,-135 -28,-70 -22,0 L 22,0 C 28,-70 24,-135 24,-135 Z"
          fill={clothes} stroke={ink} strokeWidth={4} strokeLinejoin="round"
        />

        {/* bras frontaux */}
        <g transform="translate(-24, -135)" opacity={0.85}>
          <ArmSegment upper={10} lower={5} skin={skin} clothes={clothes} ink={ink} />
        </g>
        <g transform="translate(24, -135) scale(-1,1)" opacity={0.85}>
          <ArmSegment upper={10} lower={5} skin={skin} clothes={clothes} ink={ink} />
        </g>

        {/* cou */}
        <Neck skin={skin} ink={ink} frontal={true} />

        {/* tete */}
        <g transform={`translate(0, -135) rotate(${a.headTilt})`}>
          <HatFront hatType={hatType} hc={hc} ink={ink} />
          <circle cx={0} cy={-45} r={28} fill={skin} stroke={ink} strokeWidth={4} />
          <FaceFeatures face={face} faceView={faceView} ink={ink} headCY={-45} />
        </g>
      </g>
    );
  }

  return (
    <g transform={`translate(${a.hipX}, ${a.hipY}) rotate(${a.torsoTilt})`}>
      {/* back arm+leg */}
      <g transform={`translate(0, -135) rotate(${a.armUpperBack})`} opacity={0.85}>
        <path d="M -7,40 L 7,40 L 6,90 L -6,90 Z" fill={skin} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
        <path d="M -12,0 L 12,0 L 14,45 L -14,45 Z" fill={clothes} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
        <g transform={`translate(0, 90) rotate(${a.armLowerBack})`}>
          <path d="M -6,0 L 6,0 L 5,75 L -5,75 Z" fill={skin} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
          <circle cx={0} cy={85} r={12} fill={skin} stroke={ink} strokeWidth={4} />
        </g>
      </g>
      <g transform={`rotate(${a.legUpperBack})`} opacity={0.85}>
        <LegSegment upper={0} lower={a.legLowerBack} foot={a.footBack} pants={pants} skin={skin} ink={ink} soleColor={sole} />
      </g>

      {/* torso */}
      <path d="M -20,-135 C -20,-135 -25,-70 -18,0 L 18,0 C 25,-70 20,-135 20,-135 Z" fill={clothes} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
      <path d="M -18,0 L 18,0 L 17,15 L -17,15 Z" fill={pants} stroke={ink} strokeWidth={4} strokeLinejoin="round" />

      {/* cou */}
      <Neck skin={skin} ink={ink} frontal={false} />

      {/* tete */}
      <g transform={`translate(0, -135) rotate(${a.headTilt})`}>
        <HatProfile hatType={hatType} hc={hc} ink={ink} />
        <circle cx={0} cy={-45} r={28} fill={skin} stroke={ink} strokeWidth={4} />
        <FaceFeatures face={face} faceView={faceView} ink={ink} headCY={-45} />
      </g>

      {/* front leg+arm */}
      <g transform={`rotate(${a.legUpperFront})`}>
        <LegSegment upper={0} lower={a.legLowerFront} foot={a.footFront} pants={pants} skin={skin} ink={ink} soleColor={sole} />
      </g>
      <g transform="translate(0, -135)">
        <ArmSegment upper={a.armUpperFront} lower={a.armLowerFront} skin={skin} clothes={clothes} ink={ink} />
      </g>
    </g>
  );
};

export const PROTO_GEMINI_POSE_BANK_WALK_FRAMES = 180;

export const ProtoGeminiPoseBankWalk: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

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
          <GeminiRig a={pose} face="neutral" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
