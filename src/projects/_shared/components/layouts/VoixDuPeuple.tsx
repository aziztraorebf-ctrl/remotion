import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface VoixDuPeupleProps {
  quote?: string;
  speaker?: string;
  role?: string;
  year?: string;
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const OPENING_QUOTE_START = 5;
const WORDS_START = 15;
const WORD_DELAY = 3;
const CLOSING_QUOTE_START = 65;
const LINE_START = 80;
const IDENTITY_START = 100;
const LINE_LENGTH = 1400;

const DEFAULT_QUOTE = "La verite est rarement pure et n'est jamais simple dans les affaires d'Etat.";
const DEFAULT_WORD_DELAYS = [15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57];

export const VoixDuPeuple: React.FC<VoixDuPeupleProps> = ({
  quote = DEFAULT_QUOTE,
  speaker = "OSCAR WILDE",
  role = "DRAMATURGE",
  year = "1895",
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = quote.split(" ");
  const wordDelays = words.map((_, i) => WORDS_START + i * WORD_DELAY);
  const lastWordEnd = wordDelays[wordDelays.length - 1] + 10;
  const closingStart = Math.max(CLOSING_QUOTE_START, lastWordEnd);

  // Opening quote spring
  const openScale = spring({
    frame: Math.max(0, frame - OPENING_QUOTE_START),
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 100 },
  });

  // Closing quote spring
  const closeScale = spring({
    frame: Math.max(0, frame - closingStart),
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 100 },
  });

  // Separator line draw-on
  const lineProgress = interpolate(frame, [LINE_START, LINE_START + 30], [LINE_LENGTH, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Identity block
  const identityOpacity = interpolate(frame, [IDENTITY_START, IDENTITY_START + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const identityY = spring({
    frame: Math.max(0, frame - IDENTITY_START),
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });
  const identityTranslate = interpolate(identityY, [0, 1], [20, 0]);

  // Pulse on quotes (after they appear)
  const pulseFrame = frame > 120 ? (frame - 120) % 60 : 0;
  const pulseScale = interpolate(pulseFrame, [0, 30, 60], [1.0, 1.02, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const quotePulse = frame > 120 ? pulseScale : 1;

  const QUOTE_ZONE_X = 260;
  const QUOTE_ZONE_Y = 290;
  const QUOTE_ZONE_W = 1400;
  const CENTER_X = QUOTE_ZONE_X + QUOTE_ZONE_W / 2;

  // Break quote into lines (~40 chars each)
  const lineChunks: string[][] = [];
  let currentLine: string[] = [];
  let charCount = 0;
  words.forEach((word) => {
    if (charCount + word.length > 42 && currentLine.length > 0) {
      lineChunks.push(currentLine);
      currentLine = [word];
      charCount = word.length + 1;
    } else {
      currentLine.push(word);
      charCount += word.length + 1;
    }
  });
  if (currentLine.length) lineChunks.push(currentLine);

  const LINE_H = 64;
  const totalTextH = lineChunks.length * LINE_H;
  const textStartY = QUOTE_ZONE_Y + (500 - totalTextH) / 2 + 40;

  let wordIdx = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>

        {/* Opening guillemet */}
        <text
          x={QUOTE_ZONE_X}
          y={QUOTE_ZONE_Y + 150}
          style={{
            fontFamily: FONT_MONO,
            fontSize: 220 * openScale * quotePulse,
            fill: "#c8a951",
            opacity: 0.9,
          }}
        >
          {"\""}
        </text>

        {/* Quote text — word by word */}
        {lineChunks.map((lineWords, li) => {
          const lineY = textStartY + li * LINE_H;
          const lineText = lineWords.join(" ");
          const lineWordStart = wordIdx;
          wordIdx += lineWords.length;
          const lineDelay = wordDelays[lineWordStart] ?? WORDS_START;
          const lineOpacity = interpolate(frame, [lineDelay, lineDelay + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <text
              key={li}
              x={CENTER_X}
              y={lineY}
              textAnchor="middle"
              style={{
                fontFamily: FONT_MONO,
                fontSize: 42,
                fill: "#f2ebd9",
                opacity: lineOpacity,
              }}
            >
              {lineText}
            </text>
          );
        })}

        {/* Closing guillemet */}
        <text
          x={QUOTE_ZONE_X + QUOTE_ZONE_W - 50}
          y={QUOTE_ZONE_Y + 490}
          textAnchor="end"
          style={{
            fontFamily: FONT_MONO,
            fontSize: 220 * closeScale * quotePulse,
            fill: "#c8a951",
            opacity: 0.9,
          }}
        >
          {"\""}
        </text>

        {/* Separator line */}
        <line
          x1={QUOTE_ZONE_X}
          y1={790}
          x2={QUOTE_ZONE_X + QUOTE_ZONE_W}
          y2={790}
          stroke="#c8a951"
          strokeWidth={2}
          strokeDasharray={LINE_LENGTH}
          strokeDashoffset={lineProgress}
        />

        {/* Identity block */}
        <g opacity={identityOpacity} transform={`translate(0, ${identityTranslate})`}>
          <text
            x={CENTER_X}
            y={836}
            textAnchor="middle"
            style={{
              fontFamily: FONT_MONO,
              fontSize: 32,
              fontWeight: "bold",
              fill: "#f2ebd9",
              letterSpacing: 4,
            }}
          >
            {speaker}
          </text>
          <text
            x={CENTER_X}
            y={870}
            textAnchor="middle"
            style={{
              fontFamily: FONT_MONO,
              fontSize: 24,
              fill: "#c8a951",
              letterSpacing: 3,
            }}
          >
            {role}
            {year ? `  —  ` : ""}
            <tspan fill="#4a9eff">{year}</tspan>
          </text>
        </g>

      </svg>
    </AbsoluteFill>
  );
};
