import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface CaviardageLine {
  official: string;
  real: string;
}

export interface CaviardageProps {
  lines?: CaviardageLine[];
  stampText?: string;
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const DOC_X = 360;
const DOC_Y = 160;
const DOC_W = 1200;
const DOC_H = 600;
const LINE_HEIGHT = 100;
const MARKER_H = 42;

const REDACT_DELAYS = [30, 55, 75, 90];
const REDACT_DURATION = 8;
const REVEAL_DELAYS = [38, 63, 83, 98];
const STAMP_START = 140;

const DEFAULT_LINES: CaviardageLine[] = [
  { official: "PARTENARIAT STRATEGIQUE", real: "DETTE SOUVERAINE" },
  { official: "DEVELOPPEMENT DURABLE",   real: "EXTRACTION TOTALE" },
  { official: "CROISSANCE INCLUSIVE",     real: "PROFITS EXPORTES" },
  { official: "TRANSFERT DE COMPETENCES", real: "DEPENDANCE TECHNIQUE" },
];

export const Caviardage: React.FC<CaviardageProps> = ({
  lines = DEFAULT_LINES,
  stampText = "DECLASSIFIE",
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const docOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const stampScale = spring({
    frame: Math.max(0, frame - STAMP_START),
    fps,
    config: { damping: 12, stiffness: 250, mass: 1 },
  });
  const stampOpacity = interpolate(frame, [STAMP_START, STAMP_START + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>
        {/* Document background */}
        <rect
          x={DOC_X} y={DOC_Y}
          width={DOC_W} height={DOC_H}
          fill="#f2ebd9"
          opacity={docOpacity}
          rx={4}
        />

        {/* Document lines */}
        {lines.map((line, i) => {
          const lineY = DOC_Y + 80 + i * LINE_HEIGHT;
          const markerY = lineY - 28;

          const redactStart = REDACT_DELAYS[i] ?? 30 + i * 20;
          const markerProgress = interpolate(
            frame,
            [redactStart, redactStart + REDACT_DURATION],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const revealStart = REVEAL_DELAYS[i] ?? redactStart + 8;
          const realOpacity = interpolate(
            frame,
            [revealStart, revealStart + 12],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // Vibration: 3 frames after redact starts
          const vibeFrame = frame - redactStart;
          const vibeX =
            vibeFrame === 0 ? 2 :
            vibeFrame === 1 ? -2 :
            vibeFrame === 2 ? 0 : 0;

          return (
            <g key={i}>
              {/* Official text */}
              <text
                x={DOC_X + 60 + vibeX}
                y={lineY}
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 38,
                  letterSpacing: 4,
                  fill: "#1a2535",
                  opacity: docOpacity,
                  textTransform: "uppercase",
                }}
              >
                {line.official}
              </text>

              {/* Black marker bar */}
              <rect
                x={DOC_X + 48}
                y={markerY}
                width={(DOC_W - 96) * markerProgress}
                height={MARKER_H}
                fill="#1a2535"
                rx={2}
              />

              {/* Real word revealed below */}
              <text
                x={DOC_X + 60}
                y={lineY + 42}
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 28,
                  letterSpacing: 5,
                  fill: "#c8a951",
                  opacity: realOpacity,
                  textTransform: "uppercase",
                }}
              >
                {line.real}
              </text>
            </g>
          );
        })}

        {/* Stamp — centered inside document, bottom quarter */}
        <g
          transform={`translate(960, 700) scale(${stampScale}) translate(-960, -700)`}
          opacity={stampOpacity}
        >
          <rect
            x={720} y={655}
            width={480} height={90}
            fill="none"
            stroke="#e63946"
            strokeWidth={6}
            rx={4}
          />
          <text
            x={960} y={710}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontFamily: FONT_MONO,
              fontSize: 44,
              letterSpacing: 8,
              fill: "#e63946",
              fontWeight: "bold",
            }}
          >
            {stampText}
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
