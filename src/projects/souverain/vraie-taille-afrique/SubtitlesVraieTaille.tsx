// SubtitlesVraieTaille — karaoke style, beats 2/2b/3/4
// Beat5 exclu : sous-titres animes integres dans Beat5Final

import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";
import { VRAIE_TAILLE_WORDS } from "./subtitles-words";

const { fontFamily: anton } = loadFont();

const HIGHLIGHT = "#d4a93c"; // or Souverain

type Word = { word: string; start: number; end: number };

function buildPhrases(words: Word[], sceneStartS: number, sceneEndS: number) {
  const filtered = words.filter(
    (w) => w.start >= sceneStartS - 0.05 && w.end <= sceneEndS + 0.3
  );
  const phrases: { text: string; words: Word[]; start: number; end: number }[] = [];
  let current: Word[] = [];

  for (let i = 0; i < filtered.length; i++) {
    const w = filtered[i];
    const next = filtered[i + 1];
    current.push(w);
    const gap = next ? next.start - w.end : 999;
    if (gap > 0.45 || current.length >= 7 || !next) {
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
  phrase: { text: string; words: Word[]; start: number; end: number };
  sceneStartS: number;
  nextPhraseStart?: number;
  fontSize: number;
}> = ({ phrase, sceneStartS, nextPhraseStart, fontSize }) => {
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

  const r = parseInt(HIGHLIGHT.slice(1, 3), 16);
  const g = parseInt(HIGHLIGHT.slice(3, 5), 16);
  const b = parseInt(HIGHLIGHT.slice(5, 7), 16);

  const hardShadow = [
    "0 0 4px rgba(0,0,0,1)",
    "2px 2px 0 rgba(0,0,0,1)",
    "-2px -2px 0 rgba(0,0,0,1)",
    "2px -2px 0 rgba(0,0,0,1)",
    "-2px 2px 0 rgba(0,0,0,1)",
    "0 4px 12px rgba(0,0,0,0.9)",
  ].join(", ");

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
                  color: spoken ? HIGHLIGHT : "#fff",
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

export const SubtitlesVraieTaille: React.FC<{
  sceneStartS: number;
  sceneEndS: number;
  fontSize?: number;
  bottomOffset?: number;
}> = ({ sceneStartS, sceneEndS, fontSize = 52, bottomOffset = 80 }) => {
  const phrases = buildPhrases(VRAIE_TAILLE_WORDS, sceneStartS, sceneEndS);

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
            fontSize={fontSize}
          />
        </div>
      ))}
    </div>
  );
};
