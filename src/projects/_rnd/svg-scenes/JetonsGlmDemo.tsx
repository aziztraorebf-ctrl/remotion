/**
 * JetonsGlmDemo — planche de demo ANIMEE des 5 jetons SVG generes par GLM-5.2.
 * R&D 2026-06-24. Pendant de JetonsQwenDemo, pour comparer le rendu anime des deux low-cost.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  SvgGasGlm, SvgOilGlm, SvgSonarGlm, SvgExportGlm, SvgReserveGlm,
} from "./GisementTokensGlm";

const NAVY = "#16213a";
const OR = "#c8a951";
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

export const JetonsGlmDemo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <svg viewBox="0 0 1000 640" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <text x={500} y={48} fill={OR} fontSize={24} textAnchor="middle" fontFamily="monospace" letterSpacing={3}>
          JETONS SVG — GLM-5.2 (anime)
        </text>
        <Cell x={200} y={230} label="gas"><SvgGasGlm f={f} /></Cell>
        <Cell x={500} y={230} label="oil"><SvgOilGlm f={f} /></Cell>
        <Cell x={800} y={230} label="sonar"><SvgSonarGlm f={f} /></Cell>
        <Cell x={350} y={470} label="export"><SvgExportGlm f={f} /></Cell>
        <Cell x={650} y={470} label="reserve"><SvgReserveGlm f={f} /></Cell>
      </svg>
    </AbsoluteFill>
  );
};

export default JetonsGlmDemo;
