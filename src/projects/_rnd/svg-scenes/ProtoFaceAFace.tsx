import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import {
  GeminiRig, IDLE,
  type LimbAngles, type FaceExpression,
} from "./ProtoGeminiPoseBankWalk";

const BG = "#16213a";

const PERSO_A = {
  skin: "#8B5A2B",
  clothes: "#b5552f",
  pants: "#2F4F4F",
  hat: "conical" as const,
  hatColor: "#D2B48C",
};

const PERSO_B = {
  skin: "#c68642",
  clothes: "#3a6a5a",
  pants: "#3E2723",
  hat: "cap" as const,
  hatColor: "#5e7245",
};

const PERSO_C = {
  skin: "#d4a76a",
  clothes: "#5a4a3a",
  pants: "#2F4F4F",
  hat: "scarf" as const,
  hatColor: "#b5552f",
};

export const PROTO_FACE_A_FACE_FRAMES = 180;

export const ProtoFaceAFace: React.FC = () => {
  const frame = useCurrentFrame();

  const exprPhase = Math.floor(frame / 45) % 4;
  const exprsA: FaceExpression[] = ["neutral", "serious", "angry", "neutral"];
  const exprsB: FaceExpression[] = ["neutral", "neutral", "surprise", "smile"];
  const exprsC: FaceExpression[] = ["smile", "neutral", "serious", "neutral"];
  const faceA = exprsA[exprPhase];
  const faceB = exprsB[exprPhase];
  const faceC = exprsC[exprPhase];

  const headTiltA = interpolate(frame, [0, 60, 120, 180], [0, -3, 2, 0], { extrapolateRight: "clamp" });
  const headTiltB = interpolate(frame, [0, 60, 120, 180], [0, 2, -2, 0], { extrapolateRight: "clamp" });
  const headTiltC = interpolate(frame, [0, 60, 120, 180], [0, -2, 3, 0], { extrapolateRight: "clamp" });

  const poseA: LimbAngles = { ...IDLE, hipX: 0, hipY: 0, headTilt: headTiltA };
  const poseB: LimbAngles = { ...IDLE, hipX: 0, hipY: 0, headTilt: headTiltB };
  const poseC: LimbAngles = { ...IDLE, hipX: 0, hipY: 0, headTilt: headTiltC };

  return (
    <AbsoluteFill style={{ background: BG }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        {/* titre */}
        <text x={960} y={50} textAnchor="middle" fill="#e8dcc0" fontSize={28} fontFamily="sans-serif" fontWeight="bold" letterSpacing={3}>
          FACE-A-FACE — 2 PERSONNAGES (PROFIL)
        </text>

        {/* --- Scene 1 : dialogue 2 persos face-a-face en profil --- */}
        <g transform="translate(480, 680) scale(1.4)">
          <g transform="scale(1,1)">
            <GeminiRig a={poseA} face={faceA} faceView="profile"
              skinTone={PERSO_A.skin} clothesColor={PERSO_A.clothes} pantsColor={PERSO_A.pants}
              hatType={PERSO_A.hat} hatColor={PERSO_A.hatColor} />
          </g>
        </g>
        <g transform="translate(780, 680) scale(1.4)">
          <g transform="scale(-1,1)">
            <GeminiRig a={poseB} face={faceB} faceView="profile"
              skinTone={PERSO_B.skin} clothesColor={PERSO_B.clothes} pantsColor={PERSO_B.pants}
              hatType={PERSO_B.hat} hatColor={PERSO_B.hatColor} />
          </g>
        </g>
        <text x={630} y={920} textAnchor="middle" fill="#7a7568" fontSize={18} fontFamily="sans-serif">
          2 persos profil face-a-face
        </text>

        {/* --- Scene 2 : 3 persos alignes en frontal --- */}
        <text x={1440} y={130} textAnchor="middle" fill="#e8dcc0" fontSize={22} fontFamily="sans-serif" fontWeight="bold" letterSpacing={2}>
          GROUPE 3 — FRONTAL
        </text>
        <g transform="translate(1240, 640) scale(1.2)">
          <GeminiRig a={poseA} face={faceA} faceView="front"
            skinTone={PERSO_A.skin} clothesColor={PERSO_A.clothes} pantsColor={PERSO_A.pants}
            hatType={PERSO_A.hat} hatColor={PERSO_A.hatColor} />
        </g>
        <g transform="translate(1440, 620) scale(1.3)">
          <GeminiRig a={poseB} face={faceB} faceView="front"
            skinTone={PERSO_B.skin} clothesColor={PERSO_B.clothes} pantsColor={PERSO_B.pants}
            hatType={PERSO_B.hat} hatColor={PERSO_B.hatColor} />
        </g>
        <g transform="translate(1640, 640) scale(1.2)">
          <GeminiRig a={poseC} face={faceC} faceView="front"
            skinTone={PERSO_C.skin} clothesColor={PERSO_C.clothes} pantsColor={PERSO_C.pants}
            hatType={PERSO_C.hat} hatColor={PERSO_C.hatColor} />
        </g>
        <text x={1440} y={920} textAnchor="middle" fill="#7a7568" fontSize={18} fontFamily="sans-serif">
          3 persos differencies (vetements, peau, chapeau)
        </text>
      </svg>
    </AbsoluteFill>
  );
};
