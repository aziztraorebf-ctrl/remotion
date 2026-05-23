import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface MetamorphoseFiduciaireProps {
  symbolA?: string;
  symbolB?: string;
  inkColor?: string;
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const DROPS = [
  { cx: 960,  cy: 460, rMax: 35, delay: 40 },
  { cx: 1029, cy: 500, rMax: 35, delay: 43 },
  { cx: 1029, cy: 580, rMax: 35, delay: 46 },
  { cx: 960,  cy: 620, rMax: 35, delay: 49 },
  { cx: 891,  cy: 580, rMax: 35, delay: 52 },
  { cx: 891,  cy: 500, rMax: 35, delay: 55 },
  { cx: 960,  cy: 380, rMax: 25, delay: 58 },
  { cx: 1099, cy: 460, rMax: 25, delay: 61 },
  { cx: 1099, cy: 620, rMax: 25, delay: 64 },
  { cx: 960,  cy: 700, rMax: 25, delay: 67 },
  { cx: 821,  cy: 620, rMax: 25, delay: 70 },
  { cx: 821,  cy: 460, rMax: 25, delay: 73 },
  { cx: 960,  cy: 300, rMax: 18, delay: 76 },
  { cx: 1168, cy: 420, rMax: 18, delay: 79 },
  { cx: 1168, cy: 660, rMax: 18, delay: 82 },
];

export const MetamorphoseFiduciaire: React.FC<MetamorphoseFiduciaireProps> = ({
  symbolA = "₣",
  symbolB = "¥",
  inkColor = "#1a2535",
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Symbole A — visible 0-80f puis fade
  const symAOp = interpolate(frame, [40, 80], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ClipPath radius pour révéler symbole B (80-120f)
  const clipRadius = interpolate(frame, [80, 120], [0, 550], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gouttes opacity — fade out 120-150f
  const dropsOp = interpolate(frame, [120, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Springs pour chaque goutte
  const dropSprings = DROPS.map((d) =>
    spring({
      frame: Math.max(0, frame - d.delay),
      fps,
      config: { damping: 8, stiffness: 200, mass: 1 },
    })
  );

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <defs>
          <clipPath id="symbolBClip">
            <circle cx={960} cy={540} r={clipRadius} />
          </clipPath>
          <linearGradient id="bgFidu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f2ebd9" />
            <stop offset="100%" stopColor="#e8dfc8" />
          </linearGradient>
        </defs>

        {/* Fond document */}
        <rect x={0} y={0} width={1920} height={1080} fill="url(#bgFidu)" />

        {/* Symbole A */}
        <text
          x={960} y={620}
          textAnchor="middle"
          opacity={symAOp}
          style={{
            fontFamily: FONT_MONO,
            fontSize: 280,
            fontWeight: "bold",
            fill: inkColor,
          }}
        >
          {symbolA}
        </text>

        {/* Gouttes d'encre */}
        <g opacity={dropsOp}>
          {DROPS.map((drop, i) => {
            const sc = dropSprings[i] ?? 0;
            const r = drop.rMax * sc;
            return (
              <circle
                key={i}
                cx={drop.cx}
                cy={drop.cy}
                r={r}
                fill={inkColor}
                opacity={0.85}
              />
            );
          })}
        </g>

        {/* Symbole B révélé par clipPath */}
        <g clipPath="url(#symbolBClip)">
          <rect x={0} y={0} width={1920} height={1080} fill={inkColor} />
          <text
            x={960} y={620}
            textAnchor="middle"
            style={{
              fontFamily: FONT_MONO,
              fontSize: 280,
              fontWeight: "bold",
              fill: "#c8a951",
            }}
          >
            {symbolB}
          </text>
        </g>

        {/* Labels contexte */}
        <text
          x={480} y={900}
          textAnchor="middle"
          opacity={Math.min(1, symAOp + 0.2)}
          style={{ fontFamily: FONT_MONO, fontSize: 20, fill: inkColor, letterSpacing: 3, opacity: 0.5 }}
        >
          ANCIEN RÉGIME
        </text>
        <text
          x={1440} y={900}
          textAnchor="middle"
          opacity={interpolate(frame, [100, 130], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
          style={{ fontFamily: FONT_MONO, fontSize: 20, fill: "#c8a951", letterSpacing: 3 }}
        >
          NOUVELLE INFLUENCE
        </text>
      </svg>
    </AbsoluteFill>
  );
};
