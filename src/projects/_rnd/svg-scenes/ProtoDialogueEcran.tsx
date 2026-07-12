import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import {
  GeminiRig, IDLE,
  type LimbAngles, type FaceExpression,
} from "../../_shared/personnage-vivant-svg/rig/GeminiRig";

const BG = "#16213a";
const PARCH = "#e8dcc0";

export const PROTO_DIALOGUE_ECRAN_FRAMES = 180;

const DataScreen: React.FC<{ x: number; y: number; w: number; h: number; frame: number }> = ({ x, y, w, h, frame }) => {
  const barCount = 5;
  const barW = (w - 40) / barCount - 8;
  const colors = ["#e07a5f", "#3d8b6e", "#f2cc8f", "#5e7245", "#b5552f"];

  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="#1a2a4a" stroke="#3a5a8a" strokeWidth={3} />
      <rect x={x + 8} y={y + 8} width={w - 16} height={30} rx={4} fill="#0d1b30" />
      <circle cx={x + 22} cy={y + 23} r={5} fill="#e07a5f" />
      <circle cx={x + 36} cy={y + 23} r={5} fill="#f2cc8f" />
      <circle cx={x + 50} cy={y + 23} r={5} fill="#3d8b6e" />
      <text x={x + w / 2} y={y + 27} textAnchor="middle" fill="#5a7a9a" fontSize={12} fontFamily="sans-serif">
        DONNEES
      </text>

      {Array.from({ length: barCount }, (_, i) => {
        const maxH = h - 80;
        const targetH = [0.7, 0.45, 0.85, 0.55, 0.65][i] * maxH;
        const barH = interpolate(frame, [20 + i * 8, 50 + i * 8], [0, targetH], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const bx = x + 20 + i * (barW + 8);
        const by = y + h - 20 - barH;
        return (
          <g key={i}>
            <rect x={bx} y={by} width={barW} height={barH} rx={3} fill={colors[i]} opacity={0.85} />
            <text x={bx + barW / 2} y={y + h - 6} textAnchor="middle" fill="#5a7a9a" fontSize={9} fontFamily="sans-serif">
              {["2020", "2021", "2022", "2023", "2024"][i]}
            </text>
          </g>
        );
      })}
    </g>
  );
};

const SpeechBubble: React.FC<{
  x: number; y: number; text: string; tailDir: "left" | "right" | "center";
  opacity: number;
}> = ({ x, y, text, tailDir, opacity }) => {
  const lines = text.split("\n");
  const lineH = 22;
  const padX = 20;
  const padY = 14;
  const maxLineW = Math.max(...lines.map(l => l.length)) * 10;
  const bw = maxLineW + padX * 2;
  const bh = lines.length * lineH + padY * 2;
  const bx = x - bw / 2;
  const by = y - bh;

  const tailTipX = tailDir === "left" ? bx + bw * 0.25 : tailDir === "right" ? bx + bw * 0.75 : x;
  const tailTipY = by + bh + 18;

  return (
    <g opacity={opacity}>
      <rect x={bx} y={by} width={bw} height={bh} rx={12} fill={PARCH} stroke="#2b2117" strokeWidth={2} />
      <polygon
        points={`${tailTipX - 10},${by + bh} ${tailTipX + 10},${by + bh} ${tailTipX},${tailTipY}`}
        fill={PARCH} stroke="#2b2117" strokeWidth={2}
      />
      <rect x={tailTipX - 12} y={by + bh - 3} width={24} height={6} fill={PARCH} />
      {lines.map((line, i) => (
        <text key={i} x={x} y={by + padY + 16 + i * lineH} textAnchor="middle" fill="#2b2117" fontSize={16} fontFamily="sans-serif" fontWeight={i === 0 ? "bold" : "normal"}>
          {line}
        </text>
      ))}
    </g>
  );
};

export const ProtoDialogueEcran: React.FC = () => {
  const frame = useCurrentFrame();

  const exprPhase = Math.floor(frame / 60) % 3;
  const exprs: FaceExpression[] = ["neutral", "serious", "surprise"];
  const currentFace = exprs[exprPhase];

  const headTilt = interpolate(frame, [0, 90, 180], [0, 3, -2], { extrapolateRight: "clamp" });
  const pose: LimbAngles = { ...IDLE, hipX: 0, hipY: 0, headTilt };

  const bubble1Op = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bubble2Op = interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bubble3Op = interpolate(frame, [110, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BG }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>

        {/* --- SCENE 1 : Personnage devant ecran de donnees --- */}
        <text x={480} y={50} textAnchor="middle" fill={PARCH} fontSize={26} fontFamily="sans-serif" fontWeight="bold" letterSpacing={3}>
          DEVANT ECRAN / DONNEES
        </text>

        <DataScreen x={120} y={160} w={420} h={320} frame={frame} />

        <g transform="translate(680, 660) scale(1.4)">
          <GeminiRig a={{ ...IDLE, hipX: 0, hipY: 0, headTilt, armUpperFront: -70, armLowerFront: -60 }} face={currentFace} faceView="profile"
            skinTone="#8B5A2B" clothesColor="#3a6a5a" pantsColor="#2F4F4F"
            hatType="none" />
        </g>

        <text x={380} y={950} textAnchor="middle" fill="#7a7568" fontSize={16} fontFamily="sans-serif">
          Perso frontal + ecran data (barres animees)
        </text>

        {/* --- SCENE 2 : Dialogue avec bulles flottantes --- */}
        <text x={1340} y={50} textAnchor="middle" fill={PARCH} fontSize={26} fontFamily="sans-serif" fontWeight="bold" letterSpacing={3}>
          DIALOGUE — BULLES FLOTTANTES
        </text>

        <g transform="translate(1140, 700) scale(1.4)">
          <GeminiRig a={{ ...IDLE, hipX: 0, hipY: 0, headTilt: -2 }} face="serious" faceView="profile"
            skinTone="#8B5A2B" clothesColor="#b5552f" pantsColor="#2F4F4F"
            hatType="conical" hatColor="#D2B48C" />
        </g>
        <g transform="translate(1540, 700) scale(1.4)">
          <g transform="scale(-1,1)">
            <GeminiRig a={{ ...IDLE, hipX: 0, hipY: 0, headTilt: 2 }} face="neutral" faceView="profile"
              skinTone="#c68642" clothesColor="#3a6a5a" pantsColor="#3E2723"
              hatType="cap" hatColor="#5e7245" />
          </g>
        </g>

        <SpeechBubble x={1100} y={240} text={"Le prix a chute\nde 40% en 3 ans."} tailDir="right" opacity={bubble1Op} />
        <SpeechBubble x={1580} y={200} text={"Qui en profite ?"} tailDir="left" opacity={bubble2Op} />
        <SpeechBubble x={1100} y={380} text={"Pas les planteurs."} tailDir="right" opacity={bubble3Op} />

        <text x={1340} y={950} textAnchor="middle" fill="#7a7568" fontSize={16} fontFamily="sans-serif">
          2 persos + bulles de dialogue sequentielles
        </text>
      </svg>
    </AbsoluteFill>
  );
};
