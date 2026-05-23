import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export interface ParallaxeDioramaProps {
  label?: string;
  caption?: string;
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

export const ParallaxeDiorama: React.FC<ParallaxeDioramaProps> = ({
  label = "CHAPITRE III",
  caption = "TERRES RARES ET MINERAIS",
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();

  const layer0Op = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const layer1Op = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const layer2Op = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tx0 = interpolate(frame, [0, 180], [0, -12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tx1 = interpolate(frame, [0, 180], [0, -30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tx2 = interpolate(frame, [0, 180], [0, -60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, overflow: "hidden" }}>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1a2535" />
            <stop offset="100%" stopColor="#101620" />
          </linearGradient>
          <radialGradient id="vignette" cx="50%" cy="50%" rx="50%" ry="50%">
            <stop offset="60%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
          </radialGradient>
          <filter id="shadow0">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.4" />
          </filter>
          <filter id="shadow1">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Couche 0 — fond */}
        <g opacity={layer0Op} transform={`translate(${tx0}, 0)`}>
          <rect x={-20} y={0} width={1960} height={1080} fill="url(#bgGrad)" />
          {/* Lignes horizon subtiles */}
          {[300, 400, 500, 600].map((y) => (
            <line
              key={y}
              x1={-20} y1={y} x2={1940} y2={y}
              stroke="#4a9eff" strokeWidth={0.5} opacity={0.06}
            />
          ))}
        </g>

        {/* Couche 1 — terrain midground */}
        <g opacity={layer1Op} transform={`translate(${tx1}, 0)`} filter="url(#shadow0)">
          {/* Trapèze terrain gold */}
          <polygon
            points="-100,1080 2100,1080 1600,600 300,600"
            fill="#c8a951"
            opacity={0.18}
          />
          {/* Relief secondaire */}
          <polygon
            points="-100,1080 2100,1080 1800,720 100,720"
            fill="#c8a951"
            opacity={0.08}
          />
          {/* Points de données stylisés */}
          {[400, 700, 960, 1220, 1520].map((x, i) => (
            <circle key={i} cx={x} cy={590} r={4} fill="#c8a951" opacity={0.5} />
          ))}
          <polyline
            points="400,590 700,570 960,555 1220,575 1520,560"
            fill="none"
            stroke="#c8a951"
            strokeWidth={2}
            opacity={0.35}
          />
        </g>

        {/* Couche 2 — foreground cadre + texte */}
        <g opacity={layer2Op} transform={`translate(${tx2}, 0)`} filter="url(#shadow1)">
          {/* Cadre analytique */}
          <rect
            x={80} y={80} width={1800} height={920}
            fill="none"
            stroke="#4a9eff"
            strokeWidth={4}
            opacity={0.6}
          />
          {/* Coins accent gold */}
          <polyline points="80,80 80,140 140,80" fill="none" stroke="#c8a951" strokeWidth={3} />
          <polyline points="1880,80 1820,80 1880,140" fill="none" stroke="#c8a951" strokeWidth={3} />
          <polyline points="80,1000 80,940 140,1000" fill="none" stroke="#c8a951" strokeWidth={3} />
          <polyline points="1880,1000 1820,1000 1880,940" fill="none" stroke="#c8a951" strokeWidth={3} />

          {/* Label chapitre */}
          <text
            x={120} y={160}
            style={{ fontFamily: FONT_MONO, fontSize: 18, fill: "#4a9eff", letterSpacing: 6 }}
          >
            {label}
          </text>

          {/* Caption principal */}
          <text
            x={960} y={520}
            textAnchor="middle"
            style={{
              fontFamily: FONT_MONO,
              fontSize: 64,
              fontWeight: "bold",
              fill: "#f2ebd9",
              letterSpacing: 4,
            }}
          >
            {caption}
          </text>

          {/* Ligne décorative sous caption */}
          <line
            x1={480} y1={545} x2={1440} y2={545}
            stroke="#c8a951" strokeWidth={1} opacity={0.4}
          />

          {/* Coordonnées décoratives */}
          <text
            x={120} y={980}
            style={{ fontFamily: FONT_MONO, fontSize: 14, fill: "#f2ebd9", opacity: 0.4 }}
          >
            12°21'N 15°08'W
          </text>
          <text
            x={1800} y={980}
            textAnchor="end"
            style={{ fontFamily: FONT_MONO, fontSize: 14, fill: "#f2ebd9", opacity: 0.4 }}
          >
            SOUVERAIN ANALYTICS
          </text>
        </g>

        {/* Vignette par-dessus tout */}
        <rect x={0} y={0} width={1920} height={1080} fill="url(#vignette)" />
      </svg>
    </AbsoluteFill>
  );
};
