import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700"],
  subsets: ["latin"],
});

type CountdownProps = {
  accentColor: string;
  levelName: string;
  wpm: number;
};

export const Countdown: React.FC<CountdownProps> = ({
  accentColor,
  levelName,
  wpm,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // First 2 seconds: show level name + WPM info
  // Last 3 seconds: countdown 3-2-1
  const infoPhase = frame < 2 * fps;
  const countdownStartFrame = 2 * fps;

  // Info phase animations
  const infoEntrance = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  const infoOpacity = infoPhase
    ? interpolate(infoEntrance, [0, 1], [0, 1])
    : interpolate(frame, [countdownStartFrame - 5, countdownStartFrame], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  // Countdown phase (3 seconds after info)
  const countdownFrame = frame - countdownStartFrame;
  const secondIndex = Math.floor(countdownFrame / fps);
  const number = 3 - secondIndex;
  const frameInSecond = countdownFrame - secondIndex * fps;

  // Scale bounce per number
  const scaleSpring = spring({
    frame: Math.max(0, frameInSecond),
    fps,
    config: { damping: 8, stiffness: 200 },
  });
  const countScale = interpolate(scaleSpring, [0, 1], [0.3, 1]);

  // Fade out at end of each second
  const countOpacity = interpolate(
    frameInSecond,
    [0, 3, fps - 6, fps - 1],
    [0, 1, 1, 0.2],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const showCountdown = !infoPhase && number >= 1 && number <= 3;

  return (
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
      }}
    >
      {/* Level name + WPM info */}
      <div
        style={{
          opacity: infoOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          position: "absolute",
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 48,
            fontWeight: 700,
            color: accentColor,
            letterSpacing: 4,
            textTransform: "uppercase",
            textShadow: `0 0 30px ${accentColor}44`,
          }}
        >
          {levelName}
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 28,
            fontWeight: 600,
            color: "#94A3B8",
            letterSpacing: 2,
          }}
        >
          {wpm} words per minute
        </div>
      </div>

      {/* Countdown number */}
      {showCountdown && (
        <div
          style={{
            fontFamily,
            fontSize: 200,
            fontWeight: 700,
            color: accentColor,
            transform: `scale(${countScale})`,
            opacity: countOpacity,
            textShadow: `0 0 60px ${accentColor}44`,
          }}
        >
          {number}
        </div>
      )}
    </div>
  );
};
