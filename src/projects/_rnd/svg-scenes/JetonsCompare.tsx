// JetonsCompare.tsx — banc d'essai : jetons SVG GPT-5.5 (llm-gen-svg) dans le TokenFrame hexagonal,
// vs le jeton gaz "bougie" code a la main. Pour juger la bascule vers une famille SVG coherente.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SvgGas, SvgOil, SvgSonar, SvgExport, SvgReserve } from "../../_shared/mapbox/GisementTokensSVG";
import { GasFlareToken } from "../../_shared/mapbox/GisementTokens";

const NAVY = "#16213a", GOLD = "#c8a951", IVORY = "#f2efe6";

// hexagone pointe en haut, rayon r
const hex = (r: number) => {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i - 90);
    pts.push(`${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
};

// cadre hexagonal navy + liseré or + halo (copie de TokenFrame mode navy, pour le banc)
const Frame: React.FC<{ x: number; y: number; frame: number; label: string; children: React.ReactNode }> = ({
  x, y, frame, label, children,
}) => {
  const r = 90;
  const halo = 0.22 + 0.12 * Math.sin(frame / 70);
  return (
    <g transform={`translate(${x} ${y})`}>
      <polygon points={hex(r)} fill={NAVY} fillOpacity={0.92} />
      <polygon points={hex(r - 12)} fill="none" stroke={IVORY} strokeWidth={1.6} opacity={0.28} />
      <g transform="scale(2)">{children}</g>
      <polygon points={hex(r)} fill="none" stroke={GOLD} strokeWidth={5} />
      <polygon points={hex(r + 14)} fill="none" stroke={GOLD} strokeWidth={2} opacity={halo} />
      <text x={0} y={r + 46} textAnchor="middle" fontFamily="'Bebas Neue',sans-serif" fontSize={30} letterSpacing={1} fill={IVORY}>{label}</text>
    </g>
  );
};

export const JetonsCompare: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <text x={960} y={90} textAnchor="middle" fontFamily="'Bebas Neue',sans-serif" fontSize={48} letterSpacing={2} fill={GOLD}>
          JETONS SVG GPT-5.5 — banc d'essai
        </text>

        {/* ligne 1 : gaz bougie (actuel) vs gaz GPT */}
        <Frame x={420} y={340} frame={frame} label="GAZ — bougie (actuel)">
          {/* GasFlareToken attend x,y,scale,frame mais rend un fragment centre 0,0 */}
          <GasFlareToken x={0} y={0} scale={1} frame={frame} />
        </Frame>
        <Frame x={760} y={340} frame={frame} label="GAZ — GPT-5.5">
          <SvgGas f={frame} />
        </Frame>
        <Frame x={1160} y={340} frame={frame} label="PETROLE — GPT-5.5">
          <SvgOil f={frame} />
        </Frame>
        <Frame x={1500} y={340} frame={frame} label="SONAR — GPT-5.5">
          <SvgSonar f={frame} />
        </Frame>

        {/* ligne 2 : export + reserve */}
        <Frame x={760} y={760} frame={frame} label="EXPORT — GPT-5.5">
          <SvgExport f={frame} />
        </Frame>
        <Frame x={1160} y={760} frame={frame} label="RESERVE — GPT-5.5">
          <SvgReserve f={frame} />
        </Frame>
      </svg>
    </AbsoluteFill>
  );
};

export default JetonsCompare;
