import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface TextChocProps {
  words?: string[];
  accentIndex?: number;
  accentColor?: string;
  fontSize?: number;
  underlineAccent?: boolean;
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const DEFAULT_WORDS = ["THIS", "IS", "HOW", "THEY", "FOOLED", "THE", "WORLD"];
const WORD_DELAYS = [0, 15, 28, 39, 48, 55, 60];
const UNDERLINE_DELAY = 65;

function getWordDelays(wordCount: number): number[] {
  if (wordCount <= WORD_DELAYS.length) return WORD_DELAYS.slice(0, wordCount);
  const delays: number[] = [];
  for (let i = 0; i < wordCount; i++) {
    if (i < WORD_DELAYS.length) {
      delays.push(WORD_DELAYS[i]);
    } else {
      const prev = delays[i - 1];
      const gap = Math.max(4, 8 - i);
      delays.push(prev + gap);
    }
  }
  return delays;
}

export const TextChoc: React.FC<TextChocProps> = ({
  words = DEFAULT_WORDS,
  accentIndex,
  accentColor = "#e63946",
  fontSize = 96,
  underlineAccent = true,
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accent = accentIndex !== undefined ? accentIndex : words.length - 1;
  const delays = getWordDelays(words.length);

  const WORD_GAP = 20;
  const LINE_HEIGHT = fontSize * 1.3;
  const MAX_LINE_W = 1720;

  const lines: string[][] = [];
  let currentLine: string[] = [];
  let estimatedW = 0;
  const charW = fontSize * 0.62;
  words.forEach((w) => {
    const wW = w.length * charW;
    if (currentLine.length > 0 && estimatedW + WORD_GAP + wW > MAX_LINE_W) {
      lines.push(currentLine);
      currentLine = [w];
      estimatedW = wW;
    } else {
      if (currentLine.length > 0) estimatedW += WORD_GAP;
      currentLine.push(w);
      estimatedW += wW;
    }
  });
  if (currentLine.length > 0) lines.push(currentLine);

  const totalH = lines.length * LINE_HEIGHT;
  const startY = (1080 - totalH) / 2 + fontSize * 0.75;

  let wordIdx = 0;
  const wordElements: React.ReactNode[] = [];

  lines.forEach((lineWords, li) => {
    const lineY = startY + li * LINE_HEIGHT;

    const lineW = lineWords.reduce((acc, w, wi) => acc + w.length * charW + (wi > 0 ? WORD_GAP : 0), 0);
    let curX = (1920 - lineW) / 2;

    lineWords.forEach((word, wi) => {
      const idx = wordIdx++;
      const delay = delays[idx] ?? delays[delays.length - 1] + (idx - delays.length + 1) * 5;
      const wW = word.length * charW;
      const cx = curX + wW / 2;

      const sc = spring({
        frame: Math.max(0, frame - delay),
        fps,
        config: { mass: 1, damping: 14, stiffness: 120 },
      });
      const op = interpolate(frame, [delay, delay + 8], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const isAccent = idx === accent;
      const color = isAccent ? accentColor : "#f2ebd9";

      wordElements.push(
        <text
          key={`w-${idx}`}
          x={cx}
          y={lineY}
          textAnchor="middle"
          opacity={op}
          style={{
            fontFamily: FONT_MONO,
            fontSize,
            fontWeight: "bold",
            fill: color,
            transform: `scale(${sc})`,
            transformOrigin: `${cx}px ${lineY}px`,
            letterSpacing: 2,
          }}
        >
          {word}
        </text>
      );

      if (isAccent && underlineAccent) {
        const underW = wW;
        const ulProgress = interpolate(
          frame,
          [delay + UNDERLINE_DELAY, delay + UNDERLINE_DELAY + 8],
          [underW, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        wordElements.push(
          <line
            key={`ul-${idx}`}
            x1={curX}
            y1={lineY + 12}
            x2={curX + underW}
            y2={lineY + 12}
            stroke={accentColor}
            strokeWidth={4}
            strokeDasharray={underW}
            strokeDashoffset={ulProgress}
          />
        );
      }

      curX += wW + WORD_GAP;
    });
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>
        {wordElements}
      </svg>
    </AbsoluteFill>
  );
};
