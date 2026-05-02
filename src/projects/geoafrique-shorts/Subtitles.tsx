// Subtitles — REUSABLE TEMPLATE — hybrid TikTok/Karaoke style
// Phrase-level display (from Whisper word groups), karaoke word highlight
// Stack: Anton font + 4-direction hard shadow + text-stroke + pill background = readable on ANY background
//
// Usage:
//   <Subtitles sceneStartS={83.94} sceneEndS={108.22} />
//   <Subtitles sceneStartS={0} sceneEndS={20} highlightColor="#E63946" />  // Thiaroye = blood red
//
// THEME PRESETS (change one prop):
//   highlightColor "#FFD84A" = gold (Sonjata, Abou Bakari — heroic/noble)
//   highlightColor "#E63946" = blood red (Thiaroye — tragedy/war)
//   highlightColor "#06D6A0" = green (geo / atlas)
//
// REQUIREMENTS:
//   - whisper-words.ts must contain the word-level transcription
//   - Generate via: scripts/tools/whisper-align.py <audio.mp3> -> regenerates whisper-words.ts

import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";
import { WHISPER_WORDS } from "./whisper-words";

const { fontFamily: anton } = loadFont();

type WordTimestamp = { word: string; start: number; end: number };

// -- Pre-processing: merge French elisions ("l", "d", "n", "s", "c", "qu", "j", "t", "m") with next word --
// Whisper transcribes "l'aide" as two tokens: "l" + "aide". We merge them into "l'aide".
function mergeElisions(
  words: { word: string; start: number; end: number }[]
): { word: string; start: number; end: number }[] {
  const ELISION_LETTERS = new Set(["l", "d", "n", "s", "c", "qu", "j", "t", "m"]);
  const result: { word: string; start: number; end: number }[] = [];
  let i = 0;
  while (i < words.length) {
    const w = words[i];
    const next = words[i + 1];
    const isElision = ELISION_LETTERS.has(w.word.toLowerCase());
    // Merge if: (1) this is an elision letter, (2) gap to next < 0.3s, (3) next word starts with vowel/h
    if (isElision && next && next.start - w.end < 0.4) {
      const nextStartsWithVowel = /^[aeiouhAEIOUHÀ-ÿ]/.test(next.word);
      if (nextStartsWithVowel) {
        result.push({
          word: `${w.word.toLowerCase()}'${next.word}`,
          start: w.start,
          end: next.end,
        });
        i += 2;
        continue;
      }
    }
    result.push(w);
    i++;
  }
  return result;
}

// -- Phrase grouping --
// Group consecutive words into display phrases (break on silence gaps > 0.5s or every ~8 words)
// wordOverrides: replace specific words in the displayed text (e.g. {"laide": "bossue"} for audio corrections)
function buildPhrases(
  words: { word: string; start: number; end: number }[],
  sceneStartS: number,
  sceneEndS: number,
  wordOverrides: Record<string, string>
): { text: string; words: { word: string; start: number; end: number }[]; start: number; end: number }[] {
  const applyOverride = (w: string): string => {
    const bare = w.toLowerCase().replace(/[.,:!?]$/, "");
    const replacement = wordOverrides[bare];
    if (!replacement) return w;
    // Preserve trailing punctuation
    const trailing = w.match(/[.,:!?]$/);
    return replacement + (trailing ? trailing[0] : "");
  };

  // First merge elisions, then filter to scene range, then apply overrides
  const merged = mergeElisions(words);
  const sceneWords = merged
    .filter((w) => w.start >= sceneStartS - 0.05 && w.end <= sceneEndS + 0.3)
    .map((w) => ({ ...w, word: applyOverride(w.word) }));

  const phrases: { text: string; words: { word: string; start: number; end: number }[]; start: number; end: number }[] = [];
  let current: { word: string; start: number; end: number }[] = [];

  for (let i = 0; i < sceneWords.length; i++) {
    const w = sceneWords[i];
    const next = sceneWords[i + 1];
    current.push(w);

    const gap = next ? next.start - w.end : 999;
    const shouldBreak = gap > 0.45 || current.length >= 7;

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

// -- Single phrase subtitle --
const PhraseSubtitle: React.FC<{
  phrase: { text: string; words: { word: string; start: number; end: number }[]; start: number; end: number };
  sceneStartS: number;
  nextPhraseStart?: number;
  highlightColor: string;
  fontSize: number;
}> = ({ phrase, sceneStartS, nextPhraseStart, highlightColor, fontSize }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localStart = phrase.start - sceneStartS;
  const localEnd = phrase.end - sceneStartS;
  const displayEnd = nextPhraseStart ? nextPhraseStart - sceneStartS : localEnd + 0.4;

  const localFrame = frame - Math.round(localStart * fps);
  const displayDurationFrames = Math.round((displayEnd - localStart) * fps);

  if (localFrame < 0 || localFrame > displayDurationFrames + 5) return null;

  const fadeIn = spring({ frame: localFrame, fps, config: { damping: 35, stiffness: 130 } });
  const fadeOut = interpolate(
    localFrame,
    [displayDurationFrames - 5, displayDurationFrames + 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  const currentTimeSec = sceneStartS + frame / fps;

  // Hard shadow stack — survives ANY background (light, dark, busy)
  const hardShadow = [
    "0 0 4px rgba(0,0,0,1)",
    "2px 2px 0 rgba(0,0,0,1)",
    "-2px -2px 0 rgba(0,0,0,1)",
    "2px -2px 0 rgba(0,0,0,1)",
    "-2px 2px 0 rgba(0,0,0,1)",
    "0 4px 12px rgba(0,0,0,0.9)",
  ].join(", ");
  // Glow uses highlightColor at 70% opacity (any color)
  const r = parseInt(highlightColor.slice(1, 3), 16);
  const g = parseInt(highlightColor.slice(3, 5), 16);
  const b = parseInt(highlightColor.slice(5, 7), 16);
  const colorGlow = [
    `0 0 18px rgba(${r},${g},${b},0.7)`,
    "0 0 4px rgba(0,0,0,1)",
    "2px 2px 0 rgba(0,0,0,1)",
    "-2px -2px 0 rgba(0,0,0,1)",
    "2px -2px 0 rgba(0,0,0,1)",
    "-2px 2px 0 rgba(0,0,0,1)",
  ].join(", ");

  return (
    <div style={{ opacity, textAlign: "center", paddingLeft: 60, paddingRight: 60 }}>
      <div
        style={{
          display: "inline-block",
          background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.65) 100%)",
          padding: "16px 28px",
          borderRadius: 14,
          backdropFilter: "blur(2px)",
          maxWidth: 960,
        }}
      >
        <p
          style={{
            fontFamily: anton,
            fontSize,
            fontWeight: 400,
            margin: 0,
            lineHeight: 1.15,
            letterSpacing: "0.02em",
            wordBreak: "break-word",
            textTransform: "uppercase",
          }}
        >
          {phrase.words.map((w, i) => {
            const spoken = currentTimeSec >= w.start;
            return (
              <span
                key={i}
                style={{
                  color: spoken ? highlightColor : "#fff",
                  textShadow: spoken ? colorGlow : hardShadow,
                  WebkitTextStroke: "1.5px rgba(0,0,0,0.9)",
                  marginRight: 12,
                  display: "inline-block",
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

// -- Main Subtitles component --
// Props all optional except scene boundaries — sensible defaults for Sonjata/Abou Bakari.
export const Subtitles: React.FC<{
  sceneStartS: number;
  sceneEndS: number;
  highlightColor?: string;  // "#FFD84A" gold (default), "#E63946" red, "#06D6A0" green
  fontSize?: number;        // default 56
  bottomOffset?: number;    // default 160 (pixels from bottom)
  wordOverrides?: Record<string, string>;  // e.g. {"laide": "bossue"} for audio corrections
  words?: WordTimestamp[];  // override default WHISPER_WORDS (e.g. for CTA with separate audio)
}> = ({
  sceneStartS,
  sceneEndS,
  highlightColor = "#FFD84A",
  fontSize = 56,
  bottomOffset = 160,
  wordOverrides = {},
  words = WHISPER_WORDS,
}) => {
  const phrases = buildPhrases(words, sceneStartS, sceneEndS, wordOverrides);

  return (
    <div
      style={{
        position: "absolute",
        bottom: bottomOffset,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
      }}
    >
      {phrases.map((phrase, i) => (
        <div key={i} style={{ position: "absolute", left: 0, right: 0 }}>
          <PhraseSubtitle
            phrase={phrase}
            sceneStartS={sceneStartS}
            nextPhraseStart={phrases[i + 1]?.start}
            highlightColor={highlightColor}
            fontSize={fontSize}
          />
        </div>
      ))}
    </div>
  );
};
