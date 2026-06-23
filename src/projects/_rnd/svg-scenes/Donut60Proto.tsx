// Donut60Proto.tsx — proto isole du pivot 60% en DONUT (plein ecran navy serie).
// Pour comparer avec le baril-jauge avant de trancher. Ne touche PAS la scene.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";

const { fontFamily: BEBAS } = loadBebas();
const NAVY = "#16213a", GOLD = "#c8a951", GREY = "#5a5a5a", IVORY = "#f2efe6";
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const W = 1920, H = 1080;

export const Donut60Proto: React.FC = () => {
  const frame = useCurrentFrame();
  // sequence condensee pour le proto (0->90f) : remplit 0->60% sur f10-70
  const donutFill = interpolate(frame, [10, 70], [0, 0.6], clamp);
  const num = Math.round(interpolate(frame, [10, 70], [0, 60], clamp));
  const labelOp = interpolate(frame, [70, 85], [0, 1], clamp);
  const qOp = interpolate(frame, [0, 20], [0, 1], clamp);

  const CX = W / 2, CY = 470, R = 175, SW = 42;
  const CIRC = 2 * Math.PI * R;

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      {/* question amorce */}
      <div style={{ position: "absolute", top: 150, width: "100%", textAlign: "center", opacity: qOp, color: IVORY, fontFamily: BEBAS, fontSize: 50, letterSpacing: "0.04em" }}>
        Sur tout cet argent, combien reste au Sénégal&nbsp;?
      </div>

      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {/* anneau fond (40% qui partent) */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={GREY} strokeWidth={SW} opacity={0.4} />
        {/* arc part nationale or (depart haut) */}
        <circle
          cx={CX} cy={CY} r={R} fill="none" stroke={GOLD} strokeWidth={SW} strokeLinecap="round"
          strokeDasharray={`${donutFill * CIRC} ${CIRC}`}
          transform={`rotate(-90 ${CX} ${CY})`}
        />
        {/* chiffre hero centre */}
        <text x={CX} y={CY + 30} textAnchor="middle" fontFamily={BEBAS} fontSize={130} fill={GOLD}>{num}%</text>
        <text x={CX} y={CY + 78} textAnchor="middle" fontFamily={BEBAS} fontSize={26} letterSpacing="0.18em" fill={IVORY} opacity={labelOp * 0.7}>RESTE AU SÉNÉGAL</text>
        {/* legende */}
        <g opacity={labelOp}>
          <circle cx={CX - 220} cy={CY + R + 70} r={8} fill={GOLD} />
          <text x={CX - 202} y={CY + R + 78} fontFamily={BEBAS} fontSize={28} letterSpacing="0.08em" fill={IVORY}>~60% ÉTAT</text>
          <circle cx={CX + 70} cy={CY + R + 70} r={8} fill={GREY} />
          <text x={CX + 88} y={CY + R + 78} fontFamily={BEBAS} fontSize={28} letterSpacing="0.08em" fill={IVORY} opacity={0.65}>~40% COMPAGNIES</text>
        </g>
      </svg>

      {/* nuance */}
      <div style={{ position: "absolute", top: 830, width: "100%", textAlign: "center", opacity: labelOp, color: IVORY, fontFamily: BEBAS, fontSize: 40, letterSpacing: "0.05em", lineHeight: 1.4 }}>
        La moyenne des pays producteurs émergents.<br />
        <span style={{ fontSize: 32, opacity: 0.74 }}>Ni un scandale, ni un jackpot.</span>
      </div>
    </AbsoluteFill>
  );
};

export default Donut60Proto;
