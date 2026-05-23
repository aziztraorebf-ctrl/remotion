import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

export interface HighlightedQuoteProps {
  quote?: string;
  highlightWords?: string[];
  source?: string;
  author?: string;
  bgColor?: string;
  accentColor?: string;
  startFrame?: number;
}

const DEFAULT_QUOTE =
  "L'Afrique subsaharienne detient 30% des ressources minerales mondiales";
const DEFAULT_HIGHLIGHT_WORDS = ["30%", "ressources minerales mondiales"];
const DEFAULT_SOURCE = "Nations Unies, Rapport sur le developpement, 2023";

interface QuoteSegment {
  text: string;
  highlight: boolean;
}

function parseQuoteSegments(
  quote: string,
  highlightWords: string[]
): QuoteSegment[] {
  if (highlightWords.length === 0) {
    return [{ text: quote, highlight: false }];
  }

  // Sort by length descending to avoid partial matches of shorter words first
  const sorted = [...highlightWords].sort((a, b) => b.length - a.length);

  const segments: QuoteSegment[] = [];
  let remaining = quote;

  while (remaining.length > 0) {
    let matchFound = false;

    for (const word of sorted) {
      const idx = remaining.indexOf(word);
      if (idx === 0) {
        segments.push({ text: word, highlight: true });
        remaining = remaining.slice(word.length);
        matchFound = true;
        break;
      } else if (idx > 0) {
        segments.push({ text: remaining.slice(0, idx), highlight: false });
        segments.push({ text: word, highlight: true });
        remaining = remaining.slice(idx + word.length);
        matchFound = true;
        break;
      }
    }

    if (!matchFound) {
      segments.push({ text: remaining, highlight: false });
      remaining = "";
    }
  }

  return segments;
}

// Split quote text into lines by word-wrapping at ~40 chars per line
function splitIntoLines(quote: string, charsPerLine = 40): string[] {
  const words = quote.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current.length === 0 ? word : current + " " + word;
    if (candidate.length > charsPerLine && current.length > 0) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current.length > 0) {
    lines.push(current);
  }
  return lines;
}

export const HighlightedQuote: React.FC<HighlightedQuoteProps> = ({
  quote = DEFAULT_QUOTE,
  highlightWords = DEFAULT_HIGHLIGHT_WORDS,
  source = DEFAULT_SOURCE,
  author,
  bgColor = "transparent",
  accentColor = "#c8a951",
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const localFrame = frame - startFrame;

  // Parse segments for inline highlighting
  const segments = parseQuoteSegments(quote, highlightWords || []);

  // Index of highlight segments only (for spring animations)
  const highlightSegments = segments
    .map((seg, idx) => ({ seg, idx }))
    .filter(({ seg }) => seg.highlight);

  // Compute highlight spring animations — each starts at frame 20 + i * 20
  const highlightScales = highlightSegments.map((_entry, i) => {
    const highlightStart = 20 + i * 20;
    return spring({
      fps,
      frame: Math.max(0, localFrame - highlightStart),
      config: {
        damping: 20,
        stiffness: 120,
        mass: 0.8,
      },
    });
  });

  // Map highlight index by segment index
  const highlightIndexMap = new Map<number, number>();
  highlightSegments.forEach(({ idx }, i) => {
    highlightIndexMap.set(idx, i);
  });

  // Split quote into display lines for wipe-per-line animation
  const lines = splitIntoLines(quote, 42);

  // Per-line clip-path wipe: each line delayed by 8 frames, starts at frame 0
  const lineWipes = lines.map((_line, i) => {
    const lineStart = i * 8;
    const lineEnd = lineStart + 24;
    const wipeProgress = interpolate(
      localFrame,
      [lineStart, lineEnd],
      [100, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );
    return wipeProgress;
  });

  // Bottom horizontal line fade-in at frame 15
  const lineBarOpacity = interpolate(localFrame, [15, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Source appears after all highlights
  const totalHighlights = highlightSegments.length;
  const sourceStart = 20 + totalHighlights * 20 + 10;
  const sourceOpacity = interpolate(
    localFrame,
    [sourceStart, sourceStart + 20],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const zonePx = Math.round(width * 0.7);

  return (
    <AbsoluteFill
      style={{
        background: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Central zone */}
      <div
        style={{
          width: zonePx,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          gap: 28,
        }}
      >
        {/* Watermark guillemet */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 80,
            fontSize: 320,
            fontFamily: "serif",
            color: "rgba(200,169,81,0.06)",
            lineHeight: 1,
            pointerEvents: "none",
            zIndex: 0,
            userSelect: "none",
          }}
        >
          {'"'}
        </div>

        {/* Content block — above watermark */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {/* Author line */}
          {author && (
            <div
              style={{
                fontSize: 28,
                fontFamily: '"IBM Plex Mono", monospace',
                color: "rgba(200,169,81,0.8)",
                fontStyle: "italic",
                letterSpacing: "0.03em",
              }}
            >
              {author}
            </div>
          )}

          {/* Quote text — rendered line by line with wipe animation */}
          <div
            style={{
              fontSize: 52,
              fontFamily: '"IBM Plex Mono", monospace',
              fontWeight: 700,
              color: "#f2ebd9",
              lineHeight: 1.4,
              wordBreak: "break-word",
            }}
          >
            {lines.map((line, lineIdx) => {
              // For each display line, render the segments that belong to it
              // We re-parse segments for this line substring
              const lineSegments = parseQuoteSegments(
                line,
                highlightWords || []
              );
              const clipBottom = lineWipes[lineIdx] ?? 0;

              return (
                <div
                  key={lineIdx}
                  style={{
                    display: "block",
                    clipPath: `inset(0 0 ${clipBottom}% 0)`,
                    overflow: "hidden",
                  }}
                >
                  {lineSegments.map((seg, segIdx) => {
                    if (!seg.highlight) {
                      return <span key={segIdx}>{seg.text}</span>;
                    }

                    // Find the global segment index to get spring scale
                    // Match by text content across all segments
                    const globalSegIdx = segments.findIndex(
                      (s, si) =>
                        s.highlight &&
                        s.text === seg.text &&
                        !lineSegments
                          .slice(0, segIdx)
                          .some(
                            (prev) => prev.highlight && prev.text === seg.text
                          ) &&
                        si >= 0
                    );
                    const hiIdx =
                      globalSegIdx >= 0
                        ? (highlightIndexMap.get(globalSegIdx) ?? 0)
                        : 0;
                    const scaleX = highlightScales[hiIdx] ?? 1;

                    return (
                      <span
                        key={segIdx}
                        style={{
                          position: "relative",
                          display: "inline",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {/* Highlight backdrop — gold bg, navy text */}
                        <span
                          style={{
                            position: "absolute",
                            inset: "-4px -6px",
                            borderRadius: 6,
                            backgroundColor: "#c8a951",
                            transformOrigin: "left center",
                            transform: `scaleX(${scaleX})`,
                            pointerEvents: "none",
                          }}
                        />
                        {/* Text on top — navy for highlighted words */}
                        <span
                          style={{
                            position: "relative",
                            color: "#1a2535",
                          }}
                        >
                          {seg.text}
                        </span>
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Bottom horizontal accent line */}
          <div
            style={{
              width: 60,
              height: 2,
              backgroundColor: "#c8a951",
              borderRadius: 1,
              alignSelf: "flex-start",
              opacity: lineBarOpacity,
            }}
          />

          {/* Source — bottom right, small, italic */}
          {source && (
            <div
              style={{
                alignSelf: "flex-end",
                fontSize: 16,
                fontFamily: '"IBM Plex Mono", monospace',
                color: "rgba(200,169,81,0.4)",
                fontStyle: "italic",
                opacity: sourceOpacity,
                letterSpacing: "0.02em",
              }}
            >
              {source}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default HighlightedQuote;
