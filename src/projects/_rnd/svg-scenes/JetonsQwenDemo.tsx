/**
 * JetonsQwenDemo — planche de demo ANIMEE des 5 jetons SVG generes par Qwen3.6-35B-A3B.
 *
 * R&D 2026-06-24. Test du remplacement de GPT-5.5/Gemini par Qwen ($0.14/$1) pour les jetons de carte
 * Souverain. Les jetons sont animes par la variable f (frame) — c'est leur usage reel sur Mapbox.
 * Cadre hexagonal navy/or pour reproduire le contexte TokenFrame de la carte.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  SvgGasQwen, SvgOilQwen, SvgSonarQwen, SvgExportQwen, SvgReserveQwen,
} from "./GisementTokensQwen";

const NAVY = "#16213a";
const OR = "#c8a951";

// cadre hexagonal (approx du TokenFrame) rayon ~62
const HEX = "M0,-62 L54,-31 L54,31 L0,62 L-54,31 L-54,-31 Z";

const Cell: React.FC<{ x: number; y: number; label: string; children: React.ReactNode }> = ({
  x, y, label, children,
}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={HEX} fill="#0f1830" stroke={OR} strokeWidth={2} opacity={0.9} />
    <g transform="scale(1.15)">{children}</g>
    <text x={0} y={92} fill="#f2efe6" fontSize={20} textAnchor="middle" fontFamily="monospace">
      {label}
    </text>
  </g>
);

export const JetonsQwenDemo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <svg viewBox="0 0 1000 640" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <text x={500} y={48} fill={OR} fontSize={24} textAnchor="middle" fontFamily="monospace" letterSpacing={3}>
          JETONS SVG — QWEN3.6 (anime)
        </text>
        <Cell x={200} y={230} label="gas"><SvgGasQwen f={f} /></Cell>
        <Cell x={500} y={230} label="oil"><SvgOilQwen f={f} /></Cell>
        <Cell x={800} y={230} label="sonar"><SvgSonarQwen f={f} /></Cell>
        <Cell x={350} y={470} label="export"><SvgExportQwen f={f} /></Cell>
        <Cell x={650} y={470} label="reserve"><SvgReserveQwen f={f} /></Cell>
      </svg>
    </AbsoluteFill>
  );
};

export default JetonsQwenDemo;
