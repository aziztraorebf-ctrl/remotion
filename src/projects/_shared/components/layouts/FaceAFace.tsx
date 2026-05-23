import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface FaceAFaceStat {
  value: string;
  label: string;
}

export interface FaceAFaceEntity {
  name: string;
  stats: FaceAFaceStat[];
}

export interface FaceAFaceVerdict {
  symbol: string;
  label?: string;
}

export interface FaceAFaceProps {
  entityA?: FaceAFaceEntity;
  entityB?: FaceAFaceEntity;
  verdict?: FaceAFaceVerdict;
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const LINE_START = 10;
const ENTITY_A_START = 25;
const ENTITY_A_STATS = [40, 55, 70];
const ENTITY_B_START = 40;
const ENTITY_B_STATS = [55, 70, 85];
const VERDICT_START = 110;

const LINE_H = 880;
const STAT_Y = [320, 460, 600];

const DEFAULT_A: FaceAFaceEntity = {
  name: "ETATS-UNIS",
  stats: [
    { value: "25.4T$", label: "PIB NOMINAL" },
    { value: "801B$",  label: "BUDGET DEFENSE" },
    { value: "331M",   label: "POPULATION" },
  ],
};
const DEFAULT_B: FaceAFaceEntity = {
  name: "CHINE",
  stats: [
    { value: "17.9T$", label: "PIB NOMINAL" },
    { value: "293B$",  label: "BUDGET DEFENSE" },
    { value: "1.4B",   label: "POPULATION" },
  ],
};
const DEFAULT_VERDICT: FaceAFaceVerdict = { symbol: "VS", label: "TENSION MAXIMALE" };

export const FaceAFace: React.FC<FaceAFaceProps> = ({
  entityA = DEFAULT_A,
  entityB = DEFAULT_B,
  verdict = DEFAULT_VERDICT,
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Central line draw
  const lineProgress = interpolate(frame, [LINE_START, LINE_START + 30], [LINE_H, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Entity A header
  const aHeaderScale = spring({ frame: Math.max(0, frame - ENTITY_A_START), fps, config: { damping: 12, mass: 0.8, stiffness: 90 } });
  const aHeaderOpacity = interpolate(frame, [ENTITY_A_START, ENTITY_A_START + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Entity B header
  const bHeaderScale = spring({ frame: Math.max(0, frame - ENTITY_B_START), fps, config: { damping: 12, mass: 0.8, stiffness: 90 } });
  const bHeaderOpacity = interpolate(frame, [ENTITY_B_START, ENTITY_B_START + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Verdict spring
  const verdictScale = spring({ frame: Math.max(0, frame - VERDICT_START), fps, config: { damping: 10, mass: 1.2, stiffness: 120 } });

  const CENTER_A = 100 + 760 / 2; // 480
  const CENTER_B = 1060 + 760 / 2; // 1440

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>

        {/* Central line */}
        <line
          x1={960} y1={100}
          x2={960} y2={980}
          stroke="#f2ebd9"
          strokeWidth={2}
          strokeDasharray={LINE_H}
          strokeDashoffset={lineProgress}
        />

        {/* Entity A header */}
        <text
          x={CENTER_A}
          y={180}
          textAnchor="middle"
          opacity={aHeaderOpacity}
          style={{
            fontFamily: FONT_MONO,
            fontSize: 52,
            fontWeight: "bold",
            fill: "#c8a951",
            letterSpacing: 4,
            transform: `scale(${aHeaderScale})`,
            transformOrigin: `${CENTER_A}px 180px`,
          }}
        >
          {entityA.name}
        </text>

        {/* Entity A stats */}
        {entityA.stats.map((stat, i) => {
          const delay = ENTITY_A_STATS[i] ?? 40 + i * 15;
          const translateY = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, mass: 1, stiffness: 100 } });
          const ty = interpolate(translateY, [0, 1], [-30, 0]);
          const op = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <g key={i} transform={`translate(0, ${ty})`} opacity={op}>
              <text x={CENTER_A} y={STAT_Y[i]} textAnchor="middle"
                style={{ fontFamily: FONT_MONO, fontSize: 72, fontWeight: "bold", fill: "#c8a951" }}>
                {stat.value}
              </text>
              <text x={CENTER_A} y={STAT_Y[i] + 36} textAnchor="middle"
                style={{ fontFamily: FONT_MONO, fontSize: 22, fill: "#f2ebd9", letterSpacing: 3 }}>
                {stat.label}
              </text>
            </g>
          );
        })}

        {/* Entity B header */}
        <text
          x={CENTER_B}
          y={180}
          textAnchor="middle"
          opacity={bHeaderOpacity}
          style={{
            fontFamily: FONT_MONO,
            fontSize: 52,
            fontWeight: "bold",
            fill: "#4a9eff",
            letterSpacing: 4,
            transform: `scale(${bHeaderScale})`,
            transformOrigin: `${CENTER_B}px 180px`,
          }}
        >
          {entityB.name}
        </text>

        {/* Entity B stats */}
        {entityB.stats.map((stat, i) => {
          const delay = ENTITY_B_STATS[i] ?? 55 + i * 15;
          const translateY = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, mass: 1, stiffness: 100 } });
          const ty = interpolate(translateY, [0, 1], [-30, 0]);
          const op = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <g key={i} transform={`translate(0, ${ty})`} opacity={op}>
              <text x={CENTER_B} y={STAT_Y[i]} textAnchor="middle"
                style={{ fontFamily: FONT_MONO, fontSize: 72, fontWeight: "bold", fill: "#4a9eff" }}>
                {stat.value}
              </text>
              <text x={CENTER_B} y={STAT_Y[i] + 36} textAnchor="middle"
                style={{ fontFamily: FONT_MONO, fontSize: 22, fill: "#f2ebd9", letterSpacing: 3 }}>
                {stat.label}
              </text>
            </g>
          );
        })}

        {/* Verdict badge */}
        <g transform={`translate(960, 540) scale(${verdictScale}) translate(-960, -540)`}>
          <circle cx={960} cy={540} r={80} fill="#1a2535" stroke="#f2ebd9" strokeWidth={4} />
          <text x={960} y={548} textAnchor="middle" dominantBaseline="middle"
            style={{ fontFamily: FONT_MONO, fontSize: 40, fontWeight: "bold", fill: "#f2ebd9", letterSpacing: 3 }}>
            {verdict.symbol}
          </text>
          {verdict.label && (
            <text x={960} y={640} textAnchor="middle"
              style={{ fontFamily: FONT_MONO, fontSize: 18, fill: "#f2ebd9", letterSpacing: 3 }}>
              {verdict.label}
            </text>
          )}
        </g>

      </svg>
    </AbsoluteFill>
  );
};
