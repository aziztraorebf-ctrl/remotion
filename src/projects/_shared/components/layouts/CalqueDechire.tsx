import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

export interface CalqueDechireProps {
  officialText?: string;
  bodyLines?: string[];
  statLabel?: string;
  sourceLabel?: string;
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const TEAR_LEFT =
  "M 960 140 C 952 178, 968 216, 948 254 C 928 292, 978 330, 954 368 C 930 406, 966 444, 946 482 C 926 520, 972 558, 950 596 C 928 634, 962 672, 942 710 C 922 748, 968 786, 948 824 C 928 862, 960 900, 960 940 L 360 940 L 360 140 Z";

const TEAR_RIGHT =
  "M 960 140 C 968 178, 952 216, 972 254 C 992 292, 942 330, 966 368 C 990 406, 954 444, 974 482 C 994 520, 948 558, 970 596 C 992 634, 958 672, 978 710 C 998 748, 952 786, 972 824 C 992 862, 960 900, 960 940 L 1560 940 L 1560 140 Z";

const DEFAULT_LINES = [
  "Dans le cadre du partenariat stratégique bilatéral,",
  "les parties prenantes s'engagent à consolider",
  "les mécanismes de coopération mutuellement bénéfiques.",
];

export const CalqueDechire: React.FC<CalqueDechireProps> = ({
  officialText = "COMMUNIQUÉ OFFICIEL",
  bodyLines = DEFAULT_LINES,
  statLabel = "DETTE CACHÉE : 4,7 Mds $",
  sourceLabel = "Données non publiées — audit externe 2023",
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tearSpring = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 14, stiffness: 280, mass: 1 },
  });

  const leftTX = interpolate(tearSpring, [0, 1], [0, -860], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const leftRot = interpolate(tearSpring, [0, 1], [0, -8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightTX = interpolate(tearSpring, [0, 1], [0, 860], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightRot = interpolate(tearSpring, [0, 1], [0, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const revealSpring = spring({
    frame: Math.max(0, frame - 80),
    fps,
    config: { damping: 20, stiffness: 120 },
  });

  const docOp = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <defs>
          <filter id="docShadow">
            <feDropShadow dx={0} dy={8} stdDeviation={24} floodOpacity={0.35} />
          </filter>
          <clipPath id="leftClip">
            <path d={TEAR_LEFT} />
          </clipPath>
          <clipPath id="rightClip">
            <path d={TEAR_RIGHT} />
          </clipPath>
        </defs>

        {/* Fond révélé */}
        <rect x={0} y={0} width={1920} height={1080} fill="#1a2535" />

        {/* Stat révélée */}
        <g opacity={revealSpring}>
          <text
            x={960} y={480}
            textAnchor="middle"
            style={{
              fontFamily: FONT_MONO,
              fontSize: 72,
              fontWeight: "bold",
              fill: "#e63946",
              letterSpacing: "0.06em",
            }}
          >
            {statLabel}
          </text>
          <text
            x={960} y={570}
            textAnchor="middle"
            style={{
              fontFamily: FONT_MONO,
              fontSize: 28,
              fill: "#c8a951",
              letterSpacing: "0.04em",
            }}
          >
            {sourceLabel}
          </text>
        </g>

        {/* Moitié gauche du document */}
        <g
          opacity={docOp}
          clipPath="url(#leftClip)"
          transform={`translate(${leftTX},0) rotate(${leftRot}, 360, 540)`}
        >
          <rect x={360} y={140} width={600} height={800} fill="#f2ebd9" rx={4} filter="url(#docShadow)" />
          <text
            x={660} y={240}
            textAnchor="middle"
            style={{ fontFamily: FONT_MONO, fontSize: 36, fontWeight: "bold", fill: "#1a2535", letterSpacing: "0.18em" }}
          >
            {officialText}
          </text>
          {bodyLines.map((line, i) => (
            <text
              key={i}
              x={660} y={340 + i * 52}
              textAnchor="middle"
              style={{ fontFamily: FONT_MONO, fontSize: 22, fill: "#4a4a4a" }}
            >
              {line}
            </text>
          ))}
        </g>

        {/* Moitié droite du document */}
        <g
          opacity={docOp}
          clipPath="url(#rightClip)"
          transform={`translate(${rightTX},0) rotate(${rightRot}, 1560, 540)`}
        >
          <rect x={960} y={140} width={600} height={800} fill="#f2ebd9" rx={4} filter="url(#docShadow)" />
          <text
            x={1260} y={240}
            textAnchor="middle"
            style={{ fontFamily: FONT_MONO, fontSize: 36, fontWeight: "bold", fill: "#1a2535", letterSpacing: "0.18em" }}
          >
            {officialText}
          </text>
          {bodyLines.map((line, i) => (
            <text
              key={i}
              x={1260} y={340 + i * 52}
              textAnchor="middle"
              style={{ fontFamily: FONT_MONO, fontSize: 22, fill: "#4a4a4a" }}
            >
              {line}
            </text>
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
