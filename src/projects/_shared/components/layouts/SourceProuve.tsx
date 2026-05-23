import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface SourceProuveProps {
  publication?: string;
  headline?: string;
  highlightText?: string;
  date?: string;
  publicationColor?: string;
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const ARTICLE_IN = 0;
const PUBLICATION_IN = 20;
const TITLE_IN = 30;
const HIGHLIGHT_TEXT_IN = 40;
const HIGHLIGHT_DRAW_START = 55;
const HIGHLIGHT_DRAW_DUR = 30;

const ART_X = 260;
const ART_Y = 180;
const ART_W = 1400;
const ART_H = 580;
const PAD = 60;

export const SourceProuve: React.FC<SourceProuveProps> = ({
  publication = "FINANCIAL TIMES",
  headline = "The hidden mechanisms behind the 2023 market crash and how insiders profited.",
  highlightText = "how insiders profited.",
  date = "12 MAI 2024",
  publicationColor = "#e63946",
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const articleSpring = spring({
    frame: Math.max(0, frame - ARTICLE_IN),
    fps,
    config: { mass: 1, damping: 16, stiffness: 100 },
  });
  const articleY = interpolate(articleSpring, [0, 1], [1080, 0]);

  const pubOpacity = interpolate(frame, [PUBLICATION_IN, PUBLICATION_IN + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleOpacity = interpolate(frame, [TITLE_IN, TITLE_IN + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const hlTextOpacity = interpolate(frame, [HIGHLIGHT_TEXT_IN, HIGHLIGHT_TEXT_IN + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const hlWidth = interpolate(
    frame,
    [HIGHLIGHT_DRAW_START, HIGHLIGHT_DRAW_START + HIGHLIGHT_DRAW_DUR],
    [0, 1280],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const headlineLines: string[] = [];
  const words = headline.split(" ");
  let currentLine = "";
  const maxCharsPerLine = 50;
  words.forEach((w) => {
    if ((currentLine + " " + w).trim().length > maxCharsPerLine && currentLine.length > 0) {
      headlineLines.push(currentLine.trim());
      currentLine = w;
    } else {
      currentLine = (currentLine + " " + w).trim();
    }
  });
  if (currentLine) headlineLines.push(currentLine.trim());

  const highlightLineIndex = headlineLines.findIndex((l) => l.includes(highlightText.split(" ")[0]));
  const hlLineIdx = highlightLineIndex >= 0 ? highlightLineIndex : headlineLines.length - 1;
  const lineH = 52;
  const titleStartY = ART_Y + PAD + 60 + 30 + 10;
  const hlY = titleStartY + hlLineIdx * lineH - 4;

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>

        {/* Drop shadow filter */}
        <defs>
          <filter id="shadow" x="-5%" y="-5%" width="110%" height="120%">
            <feDropShadow dx="0" dy="20" stdDeviation="15" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Article rectangle */}
        <g transform={`translate(0, ${articleY})`}>
          <rect
            x={ART_X}
            y={ART_Y}
            width={ART_W}
            height={ART_H}
            fill="#f2ebd9"
            filter="url(#shadow)"
          />

          {/* Publication name */}
          <text
            x={ART_X + PAD}
            y={ART_Y + PAD + 22}
            opacity={pubOpacity}
            style={{
              fontFamily: FONT_MONO,
              fontSize: 22,
              fontWeight: "bold",
              fill: publicationColor,
              letterSpacing: 4,
            }}
          >
            {publication}
          </text>

          {/* Date top-right */}
          {date && (
            <text
              x={ART_X + ART_W - PAD}
              y={ART_Y + PAD + 22}
              textAnchor="end"
              opacity={pubOpacity}
              style={{
                fontFamily: FONT_MONO,
                fontSize: 22,
                fill: "#888888",
                letterSpacing: 2,
              }}
            >
              {date}
            </text>
          )}

          {/* Separator under pub */}
          <line
            x1={ART_X + PAD}
            y1={ART_Y + PAD + 36}
            x2={ART_X + ART_W - PAD}
            y2={ART_Y + PAD + 36}
            stroke="#1a2535"
            strokeWidth={1}
            opacity={pubOpacity * 0.3}
          />

          {/* Gold highlight rectangle — behind text */}
          <rect
            x={ART_X + PAD}
            y={hlY}
            width={hlWidth}
            height={lineH - 4}
            fill="rgba(200, 169, 81, 0.4)"
          />

          {/* Headline lines */}
          {headlineLines.map((line, i) => (
            <text
              key={i}
              x={ART_X + PAD}
              y={titleStartY + i * lineH}
              opacity={i < hlLineIdx ? titleOpacity : hlTextOpacity}
              style={{
                fontFamily: FONT_MONO,
                fontSize: 34,
                fill: "#1a2535",
                letterSpacing: 1,
              }}
            >
              {line}
            </text>
          ))}
        </g>

      </svg>
    </AbsoluteFill>
  );
};
