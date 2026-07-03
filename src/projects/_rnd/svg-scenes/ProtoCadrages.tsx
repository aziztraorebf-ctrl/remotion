import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  GeminiRig, IDLE, FaceView, FaceExpression,
  type LimbAngles,
} from "./ProtoGeminiPoseBankWalk";

const BG = "#16213a";

const panels: {
  label: string;
  scale: number;
  originY: number;
  view: FaceView;
  clothes: string;
  hat: "conical" | "cap" | "scarf" | "none";
  skin: string;
  pants: string;
  hatColor?: string;
}[] = [
  { label: "PLAN LARGE", scale: 0.9, originY: 680, view: "profile", clothes: "#FFFDD0", hat: "conical", skin: "#8B5A2B", pants: "#2F4F4F" },
  { label: "BUSTE PROFIL", scale: 1.8, originY: 900, view: "profile", clothes: "#b5552f", hat: "cap", skin: "#8B5A2B", pants: "#2F4F4F" },
  { label: "BUSTE FACE", scale: 1.8, originY: 900, view: "front", clothes: "#3a6a5a", hat: "scarf", skin: "#c68642", pants: "#3E2723" },
  { label: "GROS PLAN FACE", scale: 3.5, originY: 1200, view: "front", clothes: "#5a4a3a", hat: "none", skin: "#d4a76a", pants: "#2F4F4F" },
];

const COLS = panels.length;
const CELL_W = 1920 / COLS;

export const ProtoCadrages: React.FC = () => {
  const frame = useCurrentFrame();
  const expressionPhase = Math.floor(frame / 30) % 5;
  const faces: FaceExpression[] = ["neutral", "smile", "serious", "surprise", "angry"];
  const currentFace = faces[expressionPhase];

  const pose: LimbAngles = { ...IDLE, hipX: 0, hipY: 0 };

  return (
    <AbsoluteFill style={{ background: BG }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <defs>
          {panels.map((_, i) => (
            <clipPath key={i} id={`clip-${i}`}>
              <rect x={CELL_W * i} y={0} width={CELL_W} height={1080} />
            </clipPath>
          ))}
        </defs>

        {panels.map((p, i) => {
          const cx = CELL_W * i + CELL_W / 2;
          return (
            <g key={i} clipPath={`url(#clip-${i})`}>
              <rect x={CELL_W * i} y={0} width={CELL_W} height={1080} fill={BG} stroke="#3a4a6a" strokeWidth={2} />
              <g transform={`translate(${cx} ${p.originY}) scale(${p.scale})`}>
                <GeminiRig
                  a={pose}
                  face={currentFace}
                  faceView={p.view}
                  skinTone={p.skin}
                  clothesColor={p.clothes}
                  pantsColor={p.pants}
                  hatType={p.hat}
                  hatColor={p.hatColor}
                />
              </g>
              <rect x={CELL_W * i} y={1020} width={CELL_W} height={60} fill="rgba(0,0,0,0.5)" />
              <text x={cx} y={1055} textAnchor="middle" fill="#e8dcc0" fontSize={18} fontFamily="sans-serif" fontWeight="bold" letterSpacing={2}>
                {p.label}
              </text>
            </g>
          );
        })}

        <text x={960} y={45} textAnchor="middle" fill="#e8dcc0" fontSize={32} fontFamily="sans-serif" fontWeight="bold" letterSpacing={3}>
          GEMINI RIG — CADRAGES — {currentFace.toUpperCase()}
        </text>
      </svg>
    </AbsoluteFill>
  );
};
