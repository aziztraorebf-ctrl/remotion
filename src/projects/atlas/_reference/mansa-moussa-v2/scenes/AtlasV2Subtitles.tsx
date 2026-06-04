// AtlasV2Subtitles — karaoke subtitle overlay for Atlas Mansa Moussa V2
// Words from Whisper forced-alignment (narration-v3). Cormorant Garamond, gold #D4A574.
// Disabled during inserts and during CTA (mansaReveal -> end).
// The narration is split across 4 audio segments interleaved with 3 inserts.
// We convert current visual frame -> narration seconds using AUDIO_SEGMENTS mapping.

import React, { useState, useEffect } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ATLAS_V2_NARRATION_WORDS } from "../atlas-v2-narration-words";
import { T, AUDIO_SEGMENTS } from "../../../../../_archive/episodes-livres/atlas/mansa-moussa/timing-mansa-moussa-v2";

const HIGHLIGHT_COLOR = "#D4A574";
const FONT_SIZE = 38;
const BOTTOM_OFFSET = 120;

// Converts the current visual frame to narration time in seconds.
// Returns null if we are currently inside an insert (no narration playing).
function visualFrameToNarrationSec(frame: number, fps: number): number | null {
  const currentSec = frame / fps;
  for (const seg of AUDIO_SEGMENTS) {
    const segStartSec = seg.visualStartFrame / fps;
    const segEndSec = (seg.visualStartFrame + seg.durationFrames) / fps;
    if (currentSec >= segStartSec && currentSec <= segEndSec) {
      const elapsed = currentSec - segStartSec;
      return seg.narrationStartSec + elapsed;
    }
  }
  return null;
}

// Group consecutive words into phrases: break on silence > 0.5s or every 7 words.
function buildPhrases(
  words: { word: string; start: number; end: number }[],
  startSec: number,
  endSec: number
): { text: string; words: { word: string; start: number; end: number }[]; start: number; end: number }[] {
  const scoped = words.filter((w) => w.start >= startSec - 0.05 && w.end <= endSec + 0.3);
  const phrases: { text: string; words: { word: string; start: number; end: number }[]; start: number; end: number }[] = [];
  let current: { word: string; start: number; end: number }[] = [];

  for (let i = 0; i < scoped.length; i++) {
    const w = scoped[i];
    const next = scoped[i + 1];
    current.push(w);
    const gap = next ? next.start - w.end : 999;
    const shouldBreak = gap > 0.5 || current.length >= 7;
    if (shouldBreak || !next) {
      phrases.push({
        text: current.map((c) => c.word).join(" "),
        words: [...current],
        start: current[0].start,
        end: current[current.length - 1].end,
      });
      current = [];
    }
  }
  return phrases;
}

const PhraseSubtitle: React.FC<{
  phrase: { text: string; words: { word: string; start: number; end: number }[]; start: number; end: number };
  nextPhraseStart: number | undefined;
  narrationSec: number;
  fontFamily: string;
}> = ({ phrase, nextPhraseStart, narrationSec, fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localStart = phrase.start;
  const localEnd = phrase.end;
  const displayEnd = nextPhraseStart ?? localEnd + 0.5;

  // Convert narration time boundaries to approximate frames for spring animation
  const startFrame = Math.round(localStart * fps);
  const endFrame = Math.round(displayEnd * fps);
  const currentFrame = Math.round(narrationSec * fps);

  const localFrame = currentFrame - startFrame;
  const displayDuration = endFrame - startFrame;

  if (localFrame < 0 || localFrame > displayDuration + 5) return null;

  const fadeIn = spring({ frame: localFrame, fps, config: { damping: 35, stiffness: 130 } });
  const fadeOut = interpolate(
    localFrame,
    [displayDuration - 5, displayDuration + 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  const hardShadow = [
    "0 0 6px rgba(0,0,0,1)",
    "2px 2px 0 rgba(0,0,0,0.9)",
    "-2px -2px 0 rgba(0,0,0,0.9)",
    "2px -2px 0 rgba(0,0,0,0.9)",
    "-2px 2px 0 rgba(0,0,0,0.9)",
    "0 4px 14px rgba(0,0,0,0.85)",
  ].join(", ");

  const r = parseInt(HIGHLIGHT_COLOR.slice(1, 3), 16);
  const g = parseInt(HIGHLIGHT_COLOR.slice(3, 5), 16);
  const b = parseInt(HIGHLIGHT_COLOR.slice(5, 7), 16);
  const colorGlow = [
    `0 0 20px rgba(${r},${g},${b},0.65)`,
    `0 0 8px rgba(${r},${g},${b},0.45)`,
    "0 0 4px rgba(0,0,0,1)",
    "2px 2px 0 rgba(0,0,0,0.9)",
    "-2px -2px 0 rgba(0,0,0,0.9)",
  ].join(", ");

  return (
    <div style={{ opacity, textAlign: "center", paddingLeft: 50, paddingRight: 50 }}>
      <div
        style={{
          display: "inline-block",
          background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%)",
          padding: "14px 24px",
          borderRadius: 10,
          backdropFilter: "blur(2px)",
          maxWidth: 640,
        }}
      >
        <p
          style={{
            fontFamily,
            fontSize: FONT_SIZE,
            fontWeight: 600,
            fontStyle: "italic",
            margin: 0,
            lineHeight: 1.2,
            letterSpacing: "0.04em",
            wordBreak: "break-word",
          }}
        >
          {phrase.words.map((w, i) => {
            const spoken = narrationSec >= w.start;
            return (
              <span
                key={i}
                style={{
                  color: spoken ? HIGHLIGHT_COLOR : "rgba(255,255,255,0.92)",
                  textShadow: spoken ? colorGlow : hardShadow,
                  WebkitTextStroke: "1px rgba(0,0,0,0.85)",
                  marginRight: 8,
                  display: "inline-block",
                  transition: "none",
                }}
              >
                {w.word}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
};

// narration goes from 0 to 81.04s. Disabled during inserts and from mansaReveal onward.
const NARRATION_END_SEC = 81.04;
const NARRATION_START_SEC = 0;

export const AtlasV2Subtitles: React.FC<{ fontFamily?: string }> = ({
  fontFamily = "Cormorant Garamond, Georgia, serif",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const narrationSec = visualFrameToNarrationSec(frame, fps);

  // Disabled if: inside an insert (narrationSec === null) or at/after mansaReveal narration time
  const mansaRevealNarrSec = 67.84;
  if (narrationSec === null || narrationSec >= mansaRevealNarrSec) return null;

  const phrases = buildPhrases(
    ATLAS_V2_NARRATION_WORDS,
    NARRATION_START_SEC,
    mansaRevealNarrSec
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: BOTTOM_OFFSET,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        pointerEvents: "none",
      }}
    >
      {phrases.map((phrase, i) => (
        <div key={i} style={{ position: "absolute", left: 0, right: 0 }}>
          <PhraseSubtitle
            phrase={phrase}
            nextPhraseStart={phrases[i + 1]?.start}
            narrationSec={narrationSec}
            fontFamily={fontFamily}
          />
        </div>
      ))}
    </div>
  );
};
