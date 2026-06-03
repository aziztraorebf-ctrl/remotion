import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { GN } from "../theme";

/**
 * BarsBrick — brique animée "classement / dépassement".
 * Deux barres horizontales : un challenger (gold) qui grandit et DÉPASSE
 * le leader historique (gris). Sert aux nouvelles de bascule de rang.
 *
 * Ex Maroc : Maroc (challenger) dépasse l'Afrique du Sud (leader).
 */

export interface BarsBrickProps {
  /** challenger qui monte */
  challengerName: string;
  challengerValue: number; // valeur finale (échelle libre)
  /** leader dépassé */
  leaderName: string;
  leaderValue: number;
  /** unité affichée (optionnelle), ex "" ou " pts" */
  unit?: string;
}

const BAR_W = 900;
const BAR_H = 130;
const GAP = 80;

export const BarsBrick: React.FC<BarsBrickProps> = ({
  challengerName,
  challengerValue,
  leaderName,
  leaderValue,
  unit = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const maxVal = Math.max(challengerValue, leaderValue);
  const grow = spring({ frame, fps, config: { damping: 200, mass: 1.4 }, durationInFrames: 84 });

  // Le leader est déjà là (statique), le challenger grandit jusqu'à le dépasser.
  const challengerNow = challengerValue * grow;
  const challengerW = (challengerNow / maxVal) * BAR_W;
  const leaderW = (leaderValue / maxVal) * BAR_W;

  const passed = challengerNow >= leaderValue;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <svg width={BAR_W + 90} height={2 * BAR_H + GAP + 140}>
        {/* Challenger (Maroc) — gold, grandit */}
        <g transform={`translate(40, 60)`}>
          <text x={0} y={-16} fontFamily="Georgia, serif" fontSize={40} fontWeight={700} fill={GN.ink}>
            {challengerName}
          </text>
          <rect x={0} y={0} width={BAR_W} height={BAR_H} rx={10} fill={GN.hairline} />
          <rect x={0} y={0} width={challengerW} height={BAR_H} rx={10} fill={passed ? GN.gold : GN.goldDeep} />
          <text
            x={challengerW - 26}
            y={BAR_H / 2 + 22}
            textAnchor="end"
            fontFamily="Georgia, serif"
            fontSize={64}
            fontWeight={700}
            fill="#fff"
            opacity={challengerW > 160 ? 1 : 0}
          >
            {Math.round(challengerNow)}
            {unit}
          </text>
          {passed && (
            <text
              x={BAR_W + 12}
              y={BAR_H / 2 + 18}
              fontSize={52}
              fill={GN.gold}
              style={{ transformOrigin: `${BAR_W + 28}px ${BAR_H / 2}px`, transform: `scale(${1 + 0.12 * (0.5 + 0.5 * Math.sin(frame / 10))})` }}
            >
              ★
            </text>
          )}
        </g>

        {/* Leader (Afrique du Sud) — gris, statique */}
        <g transform={`translate(40, ${BAR_H + GAP + 60})`}>
          <text x={0} y={-16} fontFamily="Georgia, serif" fontSize={40} fontWeight={700} fill={GN.inkSoft}>
            {leaderName}
          </text>
          <rect x={0} y={0} width={BAR_W} height={BAR_H} rx={10} fill={GN.hairline} />
          <rect x={0} y={0} width={leaderW} height={BAR_H} rx={10} fill="#b9b3a4" />
          <text
            x={leaderW - 26}
            y={BAR_H / 2 + 22}
            textAnchor="end"
            fontFamily="Georgia, serif"
            fontSize={64}
            fontWeight={700}
            fill="#fff"
          >
            {Math.round(leaderValue)}
            {unit}
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
