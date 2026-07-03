import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { StickRig } from "../../_shared/personnage-vivant-svg/rig/StickRig";

const SKIN = "#c68642";
const INK = "#2b2117";
const BG = "#16213a";

const expressions = [
  { face: "none" as const, label: "SANS VISAGE" },
  { face: "neutral" as const, label: "NEUTRE" },
  { face: "smile" as const, label: "SOURIRE" },
  { face: "serious" as const, label: "SERIEUX" },
  { face: "surprise" as const, label: "SURPRISE" },
  { face: "angry" as const, label: "COLERE" },
] as const;

const COLS = expressions.length;
const CELL_W = 1920 / COLS;

export const ProtoFaceExpressions: React.FC = () => {
  const frame = useCurrentFrame();
  const walkPhase = frame;

  return (
    <AbsoluteFill style={{ background: BG }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <text x={960} y={80} textAnchor="middle" fill="#e8dcc0" fontSize={42} fontFamily="sans-serif" fontWeight="bold" letterSpacing={4}>
          TRIO MINIMUM : YEUX + SOURCIL + BOUCHE
        </text>
        <text x={960} y={130} textAnchor="middle" fill="#7a7568" fontSize={24} fontFamily="sans-serif">
          Avant / Apres — 5 expressions sur le meme rig capsule
        </text>

        {expressions.map((expr, i) => {
          const cx = CELL_W * i + CELL_W / 2;
          const isOriginal = expr.face === "none";
          const moveAmt = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

          return (
            <g key={expr.face} transform={`translate(${cx} 680)`}>
              <StickRig
                walkPhase={walkPhase}
                moveAmt={moveAmt}
                ink={INK}
                tunicColor={isOriginal ? "#e8dcc0" : "#b5552f"}
                hat={isOriginal ? "straw" : "cap"}
                face={expr.face}
                skinTone={isOriginal ? undefined : SKIN}
              />
              <text y={80} textAnchor="middle" fill={isOriginal ? "#7a7568" : "#e8dcc0"} fontSize={22} fontFamily="sans-serif" fontWeight="bold" letterSpacing={2}>
                {expr.label}
              </text>
              {isOriginal && (
                <text y={110} textAnchor="middle" fill="#d44b2f" fontSize={16} fontFamily="sans-serif">
                  (actuel)
                </text>
              )}
            </g>
          );
        })}

        <line x1={CELL_W} y1={200} x2={CELL_W} y2={900} stroke="#d44b2f" strokeWidth={3} strokeDasharray="12 6" />
        <text x={CELL_W / 2} y={920} textAnchor="middle" fill="#d44b2f" fontSize={18} fontFamily="sans-serif">
          AVANT
        </text>
        <text x={CELL_W * 3.5} y={920} textAnchor="middle" fill="#e8dcc0" fontSize={18} fontFamily="sans-serif">
          APRES (5 expressions)
        </text>
      </svg>
    </AbsoluteFill>
  );
};

