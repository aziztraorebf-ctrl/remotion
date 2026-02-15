import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Background } from "../components/Background";
import { COLORS, speedReadingConfig } from "../config/speedReadingConfig";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Question entrance
  const questionSpring = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  const questionOpacity = interpolate(questionSpring, [0, 1], [0, 1]);
  const questionY = interpolate(questionSpring, [0, 1], [30, 0]);

  // Total word count
  const totalWords = speedReadingConfig.levels.reduce(
    (sum, level) => sum + level.words.length,
    0
  );

  // Level badges from config
  const levels = speedReadingConfig.levels.map((level) => ({
    name: level.name,
    wpm: level.wpm,
    color: level.accentColor,
  }));

  // CTA entrance
  const ctaSpring = spring({
    frame,
    fps,
    delay: 60,
    config: { damping: 200 },
  });
  const ctaOpacity = interpolate(ctaSpring, [0, 1], [0, 1]);

  // Total words counter
  const wordsSpring = spring({
    frame,
    fps,
    delay: 40,
    config: { damping: 200 },
  });
  const wordsOpacity = interpolate(wordsSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill>
      <Background />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          gap: 30,
        }}
      >
        {/* Question */}
        <div
          style={{
            fontFamily,
            fontSize: 56,
            fontWeight: 700,
            color: COLORS.text,
            opacity: questionOpacity,
            transform: `translateY(${questionY}px)`,
            letterSpacing: 2,
          }}
        >
          What level did you reach?
        </div>

        {/* Level badges row */}
        <div
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 1400,
            opacity: questionOpacity,
          }}
        >
          {levels.map((level, i) => {
            const badgeSpring = spring({
              frame,
              fps,
              delay: 15 + i * 6,
              config: { damping: 15, stiffness: 200 },
            });
            const badgeScale = interpolate(badgeSpring, [0, 1], [0.5, 1]);
            const badgeOpacity = interpolate(badgeSpring, [0, 1], [0, 1]);

            return (
              <div
                key={level.name}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  opacity: badgeOpacity,
                  transform: `scale(${badgeScale})`,
                  minWidth: 100,
                }}
              >
                <div
                  style={{
                    fontFamily,
                    fontSize: 32,
                    fontWeight: 700,
                    color: level.color,
                    textShadow: `0 0 20px ${level.color}44`,
                  }}
                >
                  {level.wpm}
                </div>
                <div
                  style={{
                    fontFamily,
                    fontSize: 14,
                    fontWeight: 600,
                    color: COLORS.secondaryText,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                  }}
                >
                  {level.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Total words */}
        <div
          style={{
            fontFamily,
            fontSize: 22,
            fontWeight: 400,
            color: COLORS.secondaryText,
            opacity: wordsOpacity,
            marginTop: 10,
          }}
        >
          {totalWords} words total
        </div>

        {/* CTA */}
        <div
          style={{
            fontFamily,
            fontSize: 28,
            fontWeight: 400,
            color: COLORS.secondaryText,
            opacity: ctaOpacity,
            marginTop: 10,
            letterSpacing: 1,
          }}
        >
          Subscribe for more brain challenges
        </div>
      </div>
    </AbsoluteFill>
  );
};
