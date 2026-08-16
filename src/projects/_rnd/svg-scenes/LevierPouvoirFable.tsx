// MOTEUR: SVG — metaphore du levier (le Maroc tient le point d'appui du passage)
// INSERT statique premium — Gazoduc Acte 4B. Palette Souverain, aplats stricts.
// Pivot de rotation du bras : (960, 470). Le groupe #ensemble_pivotant est concu
// pour recevoir un transform rotate autour de ce point (transformOrigin 960px 470px).
// Chaque masse (#masse_afrique_ouest, #masse_europe, #masse_nigeria) est un groupe
// independant, adressable pour apparition/scale.

import React from "react";

const MONO = "Menlo, 'SF Mono', 'Courier New', monospace";

const C = {
  bgTop: "#0d1f38",
  bgBottom: "#050c1a",
  cyan: "#2E9FD4",
  cyanEdge: "#7FD8FF",
  gold: "#FFC742",
  goldDeep: "#D99E2B",
  goldDark: "#6b4f10",
  cream: "#e8ecf5",
  plate: "#0a1526",
};

const PIVOT_X = 960;
const PIVOT_Y = 470;

type PlaqueProps = {
  cx: number;
  cy: number;
  text: string;
  fontSize?: number;
  width?: number;
  goldAccent?: boolean;
};

const Plaque: React.FC<PlaqueProps> = ({
  cx,
  cy,
  text,
  fontSize = 32,
  width,
  goldAccent = false,
}) => {
  const w = width ?? Math.round(text.length * fontSize * 0.62 + text.length * 2 + 44);
  const h = Math.round(fontSize * 1.72);
  return (
    <g>
      <rect
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={8}
        fill={C.plate}
        stroke={goldAccent ? C.gold : C.cyanEdge}
        strokeWidth={goldAccent ? 3 : 2}
        opacity={0.97}
      />
      <text
        x={cx}
        y={cy + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={MONO}
        fontSize={fontSize}
        fill={C.cream}
        letterSpacing={2}
      >
        {text}
      </text>
    </g>
  );
};

const Chevron: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <path
    d={`M ${x - 9} ${y - 10} L ${x + 9} ${y} L ${x - 9} ${y + 10}`}
    fill="none"
    stroke={C.goldDark}
    strokeWidth={5}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

export const LevierPouvoirFable: React.FC = () => {
  const beamY = 457;
  const beamH = 26;
  const beamX1 = 340;
  const beamX2 = 1580;
  const massR = 90;
  const massCyL = beamY - 8 - massR; // disc rests on its plateau
  const leftX = 440;
  const rightX = 1480;
  const nigeriaCx = 960;
  const nigeriaCy = 872;
  const nigeriaR = 100;

  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="lp_bg" cx="50%" cy="42%" r="75%">
          <stop offset="0%" stopColor={C.bgTop} />
          <stop offset="100%" stopColor={C.bgBottom} />
        </radialGradient>
        <linearGradient id="lp_gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD469" />
          <stop offset="100%" stopColor={C.goldDeep} />
        </linearGradient>
        <radialGradient id="lp_disc" cx="42%" cy="34%" r="80%">
          <stop offset="0%" stopColor="#46B7E8" />
          <stop offset="100%" stopColor="#1C6E9E" />
        </radialGradient>
        <radialGradient id="lp_disc_deep" cx="42%" cy="34%" r="80%">
          <stop offset="0%" stopColor="#2E86B4" />
          <stop offset="100%" stopColor="#14547E" />
        </radialGradient>
      </defs>

      {/* ============ FOND ============ */}
      <g id="fond">
        <rect x={0} y={0} width={1920} height={1080} fill="url(#lp_bg)" />
        <circle
          cx={PIVOT_X}
          cy={PIVOT_Y}
          r={560}
          fill="none"
          stroke={C.cyanEdge}
          strokeWidth={2}
          opacity={0.06}
        />
        <circle
          cx={PIVOT_X}
          cy={PIVOT_Y}
          r={780}
          fill="none"
          stroke={C.cyanEdge}
          strokeWidth={2}
          opacity={0.04}
        />
        {/* axe vertical du pouvoir : du titre au pivot */}
        <line
          x1={PIVOT_X}
          y1={172}
          x2={PIVOT_X}
          y2={420}
          stroke={C.cyanEdge}
          strokeWidth={2}
          opacity={0.1}
        />
        {/* ligne de sol */}
        <line
          x1={260}
          y1={744}
          x2={1660}
          y2={744}
          stroke={C.cyanEdge}
          strokeWidth={2}
          opacity={0.16}
        />
        <line
          x1={520}
          y1={762}
          x2={1400}
          y2={762}
          stroke={C.cyanEdge}
          strokeWidth={2}
          opacity={0.07}
        />
      </g>

      {/* ============ SOCLE (point d'appui du Maroc) ============ */}
      <g id="socle">
        <path
          d={`M ${PIVOT_X} 488 L 868 720 L 1052 720 Z`}
          fill={C.gold}
          fillOpacity={0.12}
          stroke={C.gold}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <rect
          x={830}
          y={720}
          width={260}
          height={16}
          rx={6}
          fill="url(#lp_gold)"
        />
      </g>

      {/* ============ FLUX SOURCE : le Nigeria alimente le pivot ============ */}
      <g id="flux_nigeria">
        <line
          x1={nigeriaCx}
          y1={nigeriaCy - nigeriaR - 6}
          x2={nigeriaCx}
          y2={520}
          stroke={C.gold}
          strokeWidth={4}
          strokeDasharray="14 12"
          opacity={0.8}
        />
        {/* fleche visible dans la zone claire du triangle, sous la plaque RABAT */}
        <path
          d={`M ${nigeriaCx} 636 L ${nigeriaCx - 13} 660 L ${nigeriaCx + 13} 660 Z`}
          fill={C.gold}
        />
      </g>

      {/* ============ MASSE SOURCE : NIGERIA ============ */}
      <g id="masse_nigeria">
        <circle
          cx={nigeriaCx}
          cy={nigeriaCy}
          r={nigeriaR + 14}
          fill="none"
          stroke={C.cyanEdge}
          strokeWidth={2}
          strokeDasharray="5 11"
          opacity={0.4}
        />
        <circle
          cx={nigeriaCx}
          cy={nigeriaCy}
          r={nigeriaR}
          fill="url(#lp_disc_deep)"
          stroke={C.cyanEdge}
          strokeWidth={3}
        />
        <Plaque cx={nigeriaCx} cy={nigeriaCy} text="NIGERIA" fontSize={32} />
      </g>

      {/* ============ ENSEMBLE PIVOTANT (bras + plateaux + masses) ============ */}
      {/* Rotation prevue autour de (960, 470) — transformOrigin: '960px 470px' */}
      <g id="ensemble_pivotant" data-pivot={`${PIVOT_X} ${PIVOT_Y}`}>
        <g id="bras">
          <rect
            x={beamX1}
            y={beamY}
            width={beamX2 - beamX1}
            height={beamH}
            rx={10}
            fill="url(#lp_gold)"
          />
          {/* flux de gaz : tout passe par le pivot */}
          <line
            x1={beamX1 + 30}
            y1={PIVOT_Y}
            x2={beamX2 - 30}
            y2={PIVOT_Y}
            stroke={C.goldDark}
            strokeWidth={5}
            strokeDasharray="20 16"
            opacity={0.7}
          />
          <Chevron x={620} y={PIVOT_Y} />
          <Chevron x={800} y={PIVOT_Y} />
          <Chevron x={1120} y={PIVOT_Y} />
          <Chevron x={1300} y={PIVOT_Y} />
        </g>

        <g id="plateau_gauche">
          <rect
            x={leftX - 85}
            y={beamY - 8}
            width={170}
            height={8}
            rx={4}
            fill={C.goldDeep}
          />
        </g>
        <g id="plateau_droit">
          <rect
            x={rightX - 85}
            y={beamY - 8}
            width={170}
            height={8}
            rx={4}
            fill={C.goldDeep}
          />
        </g>

        {/* masse gauche : la ressource */}
        <g id="masse_afrique_ouest">
          <circle
            cx={leftX}
            cy={massCyL}
            r={massR}
            fill="url(#lp_disc)"
            stroke={C.cyanEdge}
            strokeWidth={3}
          />
          {/* pictogramme flamme de gaz (aplats) */}
          <g transform={`translate(${leftX} ${massCyL + 2})`}>
            <path
              d="M0,-40 C15,-20 27,-4 27,13 C27,31 15,43 0,43 C-15,43 -27,31 -27,13 C-27,-4 -15,-20 0,-40 Z"
              fill={C.gold}
            />
            <path
              d="M0,-12 C7,-2 13,5 13,15 C13,25 7,31 0,31 C-7,31 -13,25 -13,15 C-13,5 -7,-2 0,-12 Z"
              fill="#125a84"
            />
          </g>
          <line
            x1={leftX}
            y1={236}
            x2={leftX}
            y2={massCyL - massR - 4}
            stroke={C.cyanEdge}
            strokeWidth={2}
            opacity={0.55}
          />
          <Plaque cx={leftX} cy={206} text="AFRIQUE DE L'OUEST" fontSize={32} />
        </g>

        {/* masse droite : la demande */}
        <g id="masse_europe">
          <circle
            cx={rightX}
            cy={massCyL}
            r={massR}
            fill="url(#lp_disc)"
            stroke={C.cyanEdge}
            strokeWidth={3}
          />
          {/* couronne de points (demande europeenne) */}
          <g transform={`translate(${rightX} ${massCyL})`}>
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
              return (
                <circle
                  key={i}
                  cx={Math.cos(a) * 48}
                  cy={Math.sin(a) * 48}
                  r={5}
                  fill={C.gold}
                />
              );
            })}
          </g>
          <line
            x1={rightX}
            y1={236}
            x2={rightX}
            y2={massCyL - massR - 4}
            stroke={C.cyanEdge}
            strokeWidth={2}
            opacity={0.55}
          />
          <Plaque cx={rightX} cy={206} text="EUROPE" fontSize={32} />
        </g>
      </g>

      {/* ============ PIVOT : le Maroc tient le point d'appui ============ */}
      <g id="pivot">
        <circle cx={PIVOT_X} cy={PIVOT_Y} r={64} fill={C.cyanEdge} opacity={0.08} />
        <circle cx={PIVOT_X} cy={PIVOT_Y} r={42} fill={C.gold} opacity={0.16} />
        <circle
          cx={PIVOT_X}
          cy={PIVOT_Y}
          r={52}
          fill="none"
          stroke={C.gold}
          strokeWidth={2}
          opacity={0.5}
        />
        <circle
          cx={PIVOT_X}
          cy={PIVOT_Y}
          r={26}
          fill={C.plate}
          stroke={C.gold}
          strokeWidth={6}
        />
        <circle cx={PIVOT_X} cy={PIVOT_Y} r={11} fill={C.gold} />
        {/* rayonnement en diagonale : le point de passage oblige */}
        {[45, 135, 225, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={PIVOT_X + Math.cos(rad) * 36}
              y1={PIVOT_Y + Math.sin(rad) * 36}
              x2={PIVOT_X + Math.cos(rad) * 50}
              y2={PIVOT_Y + Math.sin(rad) * 50}
              stroke={C.gold}
              strokeWidth={4}
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* ============ LABELS FIXES ============ */}
      <g id="label_rabat">
        <Plaque cx={PIVOT_X} cy={578} text="RABAT" fontSize={32} goldAccent />
      </g>

      <g id="label_levier_pouvoir">
        <Plaque
          cx={PIVOT_X}
          cy={112}
          text="LEVIER DE POUVOIR"
          fontSize={44}
          goldAccent
        />
      </g>
    </svg>
  );
};
