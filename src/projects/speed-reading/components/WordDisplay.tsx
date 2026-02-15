import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { getFramesPerWord } from "../config/speedReadingConfig";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

type WordDisplayProps = {
  words: string[];
  wpm: number;
  accentColor: string;
  fontSize: number;
  showFlash: boolean;
};

export const WordDisplay: React.FC<WordDisplayProps> = ({
  words,
  wpm,
  accentColor,
  fontSize,
  showFlash,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const framesPerWord = getFramesPerWord(wpm, fps);
  const wordIndex = Math.min(
    Math.floor(frame / framesPerWord),
    words.length - 1
  );
  const currentWord = words[wordIndex];

  // Local frame within the current word display cycle
  const frameInWord = frame - Math.floor(wordIndex * framesPerWord);

  // Scale animation: slight pop-in per word
  const scaleSpring = spring({
    frame: frameInWord,
    fps,
    config: { damping: 200, stiffness: 300 },
  });
  const scale = interpolate(scaleSpring, [0, 1], [0.85, 1]);

  // Opacity: quick fade in
  const opacity = interpolate(frameInWord, [0, 3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Flash white on word change for high WPM
  const isNewWord = frameInWord === 0;
  const flashOpacity = showFlash && isNewWord ? 0.12 : 0;

  return (
    <>
      {/* Flash overlay */}
      {showFlash && (
        <AbsoluteFill
          style={{
            backgroundColor: "#FFFFFF",
            opacity: flashOpacity,
            pointerEvents: "none",
          }}
        />
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize,
            fontWeight: 700,
            color: accentColor,
            transform: `scale(${scale})`,
            opacity,
            textAlign: "center",
            letterSpacing: 2,
            textShadow: `0 0 40px ${accentColor}33`,
          }}
        >
          {currentWord}
        </div>
      </div>
    </>
  );
};
