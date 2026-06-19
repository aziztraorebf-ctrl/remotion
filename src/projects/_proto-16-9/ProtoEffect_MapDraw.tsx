import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { SENEGAL_PATH, SENEGAL_PATH_LEN, SENEGAL_CENTROID } from "./senegalPath";

// PROTO EFFET CARTE QUI SE DESSINE (atlas vintage) — VRAIE geometrie Senegal
// (d3-geo + Natural Earth countries-50m, projetee Mercator dans une boite 900x700).
// Frontiere tracee (stroke-dashoffset) puis remplissage ocre + label, sur fond kraft.

const W = 1920;
const H = 1080;
const KRAFT = "#e8dcc0";
const KRAFT_DARK = "#d8c9a3";
const INK = "#4a3c28";
const OCRE = "#c8924a";
const OCRE_DARK = "#a8702f";
const DISPLAY = "Cinzel, serif";

// la geometrie est dans une boite 900x700 ; on la place centree-agrandie dans le 1920x1080
const MAP_SCALE = 1.25;
const MAP_X = W / 2 - (900 * MAP_SCALE) / 2;
const MAP_Y = H / 2 - (700 * MAP_SCALE) / 2;

export const ProtoEffect_MapDraw: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const draw = spring({ fps, frame: Math.max(0, frame - 10), config: { damping: 40, stiffness: 32 } });
  const fillOp = interpolate(frame, [60, 105], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelOp = interpolate(frame, [95, 125], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelSpacing = interpolate(frame, [95, 135], [14, 5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const gridV = Array.from({ length: 16 }, (_, i) => i * 128);
  const gridH = Array.from({ length: 9 }, (_, i) => i * 128);

  const labelX = MAP_X + SENEGAL_CENTROID[0] * MAP_SCALE;
  const labelY = MAP_Y + SENEGAL_CENTROID[1] * MAP_SCALE;

  return (
    <AbsoluteFill style={{ background: KRAFT }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="ocreFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={OCRE} />
            <stop offset="100%" stopColor={OCRE_DARK} />
          </linearGradient>
          <filter id="paperTex">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer><feFuncA type="linear" slope="0.06" /></feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
        </defs>

        <rect width={W} height={H} fill={KRAFT_DARK} filter="url(#paperTex)" opacity={0.5} />

        <g opacity={0.16} stroke={INK} strokeWidth={1}>
          {gridV.map((x) => <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />)}
          {gridH.map((y) => <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />)}
        </g>

        {/* VRAI Senegal */}
        <g transform={`translate(${MAP_X},${MAP_Y}) scale(${MAP_SCALE})`}>
          {/* ombre portee douce */}
          <path d={SENEGAL_PATH} fill={OCRE_DARK} opacity={fillOp * 0.25} transform="translate(6,8)" />
          {/* remplissage */}
          <path d={SENEGAL_PATH} fill="url(#ocreFill)" opacity={fillOp * 0.92} />
          {/* trace frontiere */}
          <path
            d={SENEGAL_PATH}
            fill="none"
            stroke={OCRE_DARK}
            strokeWidth={3.5}
            strokeLinejoin="round"
            strokeDasharray={SENEGAL_PATH_LEN}
            strokeDashoffset={SENEGAL_PATH_LEN * (1 - draw)}
          />
        </g>

        {/* rose des vents */}
        <g transform={`translate(${W - 170},${H - 170})`} opacity={0.5} stroke={INK} strokeWidth={2} fill="none">
          <circle r={54} />
          <circle r={38} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const rad = (a * Math.PI) / 180;
            return <line key={a} x1={0} y1={0} x2={Math.cos(rad) * 54} y2={Math.sin(rad) * 54} />;
          })}
          <path d="M0,-64 L7,0 L0,64 L-7,0 Z" fill={INK} stroke="none" opacity={0.8} />
        </g>
      </svg>

      {/* label pays (au centroide reel) */}
      <div style={{ position: "absolute", left: labelX, top: labelY, transform: "translate(-50%,-50%)", opacity: labelOp, fontFamily: DISPLAY, fontSize: 50, fontWeight: 700, color: "#3a2e1c", letterSpacing: `${labelSpacing}px`, textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}>
        SÉNÉGAL
      </div>
    </AbsoluteFill>
  );
};
