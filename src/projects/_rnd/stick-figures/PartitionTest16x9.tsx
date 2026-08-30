// MOTEUR: stick-figure — QUI : trois acteurs qui font un GESTE. Le sujet du banc d'essai EST
// le geste lui-meme (saluer, pointer, acquiescer), donc le registre de l'acteur est le seul
// possible : ni lieu (Mapbox), ni proportion (D3), ni objet (SVG).
//
// ============================================================================================
// BANC D'ESSAI — LE GESTE EN NOMBRES (2026-08-29)
// ============================================================================================
// Question d'Aziz : peut-on arreter de reprogrammer chaque geste ? Les trois gestes joues ici
// viennent de `partitions/gestes.ts` -- des TABLES DE NOMBRES, pas du code. Le meme "lever le
// bras" existe en ~70 lignes raisonnees dans `gestes/GestesExpressifs16x9.tsx` : comparer.

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Figure } from "../../_shared/stick-figure-svg/StickFigure";
import { poseA } from "../../_shared/stick-figure-svg/partitions/poses";
import { SALUER, POINTER, ACQUIESCER } from "../../_shared/stick-figure-svg/partitions/gestes";

const FOND = "#16213a";
const SOL = 620;

export const PartitionTest16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const trio = [
    { part: SALUER, x: 420, label: "SALUER" },
    { part: POINTER, x: 960, label: "POINTER" },
    { part: ACQUIESCER, x: 1500, label: "ACQUIESCER" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: FOND }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <line x1="120" y1={SOL} x2="1800" y2={SOL} stroke="#2b3a5c" strokeWidth={2} />
        {trio.map(({ part, x, label }) => (
          <g key={label}>
            <Figure
              x={x}
              y={SOL}
              phase={0}
              pose={poseA(part, frame)}
              color="#e8ecf5"
              scale={3.4}
            />
            <text
              x={x}
              y={SOL + 70}
              fill="#7d8aa8"
              fontSize={22}
              fontFamily="monospace"
              letterSpacing={3}
              textAnchor="middle"
            >
              {label}
            </text>
          </g>
        ))}
        <text x={120} y={110} fill="#e8ecf5" fontSize={40} fontFamily="sans-serif">
          Trois gestes, zero ligne de code d'animation
        </text>
        <text x={120} y={152} fill="#7d8aa8" fontSize={24} fontFamily="sans-serif">
          Chacun est une table de 5 a 7 cles, lue par poseA()
        </text>
      </svg>
    </AbsoluteFill>
  );
};
