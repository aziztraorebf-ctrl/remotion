// Subtitle style test — Scene 7 narration segment (25s x 1 style)
// Style: TikTok/Karaoke hybrid
//   - Phrase entiere visible en blanc (style TikTok, lisible)
//   - Mots s'allument en or au fur et a mesure (progression lineaire sur duree phrase)
//   - fontSize 44px, padding genereux, pas de debordement
// Total: 25s

import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Cinzel";

const { fontFamily: cinzel } = loadFont();

const FPS = 30;
const SEGMENT_S = 25;
export const SUBTITLE_TEST_FRAMES = Math.round(SEGMENT_S * FPS); // 750

const NARRATION = "audio/sonjata-papercraft/sonjata-short-v2.mp3";
// Scene 7 starts at 83.94s in master
const NARRATION_OFFSET_S = 83.94;
const NARRATION_OFFSET_FRAMES = Math.round(NARRATION_OFFSET_S * FPS);

const CLIP_7A = "assets/sonjata-papercraft/clips/scene7a-soumaoro-6s.mp4";
const CLIP_7B = "assets/sonjata-papercraft/clips/scene7b-ergot-v2-5s.mp4";
const CLIP_7C = "assets/sonjata-papercraft/clips/scene7c-arc-tir-v2-7s.mp4";
const CLIP_7D = "assets/sonjata-papercraft/clips/scene7d-defaite-6s.mp4";

// Phrase timestamps — from forced alignment on scene7 extract (phrase-level, reliable)
// start/end are relative to scene 7 start (83.94s)
const PHRASES = [
  { text: "Le sorcier Soumaoro semblait invincible.", start: 0.10, end: 3.16 },
  { text: "Sa magie noire le rendait immortel.", start: 1.66, end: 5.82 },
  { text: "Mais Soundjata connaissait son secret.", start: 5.86, end: 7.68 },
  { text: "La seule chose qui pouvait le vaincre :", start: 7.72, end: 8.72 },
  { text: "une fleche avec un ergot de coq blanc.", start: 8.72, end: 10.28 },
  { text: "Une simple plume d'oiseau.", start: 11.54, end: 14.70 },
  { text: "La fleche fut tiree.", start: 14.74, end: 18.54 },
  { text: "Soumaoro hurla. Et disparut pour toujours.", start: 19.60, end: 21.92 },
  { text: "Il ne reviendrait jamais.", start: 22.72, end: 24.24 },
];

// -- Background video --
const BgVideo: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={6 * FPS} premountFor={FPS}>
      <OffthreadVideo src={staticFile(CLIP_7A)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Sequence>
    <Sequence from={6 * FPS} durationInFrames={5 * FPS} premountFor={FPS}>
      <OffthreadVideo src={staticFile(CLIP_7B)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Sequence>
    <Sequence from={11 * FPS} durationInFrames={7 * FPS} premountFor={FPS}>
      <OffthreadVideo src={staticFile(CLIP_7C)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Sequence>
    <Sequence from={18 * FPS} durationInFrames={7 * FPS} premountFor={FPS}>
      <OffthreadVideo src={staticFile(CLIP_7D)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Sequence>
    {/* Gradient bas pour lisibilite sous-titres */}
    <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.0) 45%)" }} />
  </AbsoluteFill>
);

// -- Hybrid subtitle: TikTok fade-in + karaoke word highlight --
const HybridSubtitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeSec = frame / FPS;

  // Find active phrase: the most recent one whose start has passed
  const activeIdx = PHRASES.reduce((best, p, i) => {
    if (currentTimeSec >= p.start && currentTimeSec < p.end + 0.5) return i;
    return best;
  }, -1);

  if (activeIdx < 0) return null;
  const phrase = PHRASES[activeIdx];

  const localFrame = frame - Math.round(phrase.start * FPS);
  const phraseDurationFrames = Math.round((phrase.end - phrase.start) * FPS);

  // Fade in (spring) + fade out near end
  const fadeIn = spring({ frame: localFrame, fps, config: { damping: 30, stiffness: 120 } });
  const fadeOut = interpolate(
    localFrame,
    [phraseDurationFrames - 6, phraseDurationFrames + 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  // Word-level karaoke: linear interpolation across phrase duration
  const phraseWords = phrase.text.split(" ");
  const wordCount = phraseWords.length;
  // Progress 0->1 over phrase duration
  const progress = interpolate(
    localFrame,
    [0, phraseDurationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // Word i lights up when progress > i / wordCount
  const litUpTo = Math.floor(progress * wordCount);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 160 }}>
      <div
        style={{
          opacity,
          textAlign: "center",
          paddingLeft: 80,
          paddingRight: 80,
          maxWidth: 1080,
        }}
      >
        <p
          style={{
            fontFamily: cinzel,
            fontSize: 44,
            fontWeight: 700,
            margin: 0,
            lineHeight: 1.5,
            wordBreak: "break-word",
          }}
        >
          {phraseWords.map((word, i) => (
            <span
              key={i}
              style={{
                color: i <= litUpTo ? "#D4A843" : "rgba(255,255,255,0.85)",
                textShadow:
                  i <= litUpTo
                    ? "0 0 16px rgba(212,168,67,0.6), 2px 2px 6px rgba(0,0,0,0.9)"
                    : "2px 2px 6px rgba(0,0,0,0.9)",
                marginRight: 10,
                display: "inline-block",
              }}
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </AbsoluteFill>
  );
};

export const SubtitleTest: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <BgVideo />
      <HybridSubtitle />
      <Audio
        src={staticFile(NARRATION)}
        startFrom={NARRATION_OFFSET_FRAMES}
        volume={1.0}
      />
    </AbsoluteFill>
  );
};
