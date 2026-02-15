import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
  Sequence,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Background } from "../components/Background";
import { WpmGauge } from "../components/WpmGauge";
import { COLORS } from "../config/speedReadingConfig";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "800"],
  subsets: ["latin"],
});

type HookSceneProps = {
  question: string;
  title: string;
  maxWpm: number;
};

export const HookScene: React.FC<HookSceneProps> = ({
  question,
  title,
  maxWpm,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0-2s): Question with pulse on "YOUR"
  const questionEntrance = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  const questionOpacity = interpolate(questionEntrance, [0, 1], [0, 1]);
  const questionScale = interpolate(questionEntrance, [0, 1], [0.9, 1]);

  // Pulse effect on "YOUR" - cycles every 0.8s
  const pulseCycle = (frame % Math.round(0.8 * fps)) / (0.8 * fps);
  const pulseScale = 1 + 0.08 * Math.sin(pulseCycle * Math.PI * 2);

  // Phase 2 (2-4s): WPM gauge
  const gaugePhase = frame >= 2 * fps;

  // Phase 3 (4-6s): Title
  const titlePhase = frame >= 4 * fps;
  const titleSpring = titlePhase
    ? spring({
        frame: frame - 4 * fps,
        fps,
        config: { damping: 15, stiffness: 200 },
      })
    : 0;
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const titleScale = interpolate(titleSpring, [0, 1], [0.7, 1]);

  // Fade out question when gauge starts
  const questionFadeOut = gaugePhase
    ? interpolate(frame, [2 * fps, 2.5 * fps], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // Fade out gauge when title starts
  const gaugeFadeOut = titlePhase
    ? interpolate(frame, [4 * fps, 4.3 * fps], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // Render the question with highlighted "YOUR"
  const parts = question.split("YOUR");

  return (
    <AbsoluteFill>
      <Background />

      {/* Phase 1: Question */}
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
          opacity: questionOpacity * questionFadeOut,
          transform: `scale(${questionScale})`,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 72,
            fontWeight: 700,
            color: COLORS.text,
            textAlign: "center",
            display: "flex",
            alignItems: "baseline",
            gap: 16,
          }}
        >
          {parts[0]}
          <span
            style={{
              color: COLORS.inhuman,
              fontWeight: 800,
              fontSize: 80,
              transform: `scale(${pulseScale})`,
              display: "inline-block",
              textShadow: `0 0 30px ${COLORS.inhuman}66`,
            }}
          >
            YOUR
          </span>
          {parts[1]}
        </div>
      </div>

      {/* Phase 2: WPM Gauge */}
      {gaugePhase && (
        <Sequence from={2 * fps} layout="none">
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
              opacity: gaugeFadeOut,
            }}
          >
            <WpmGauge maxWpm={maxWpm} />
          </div>
        </Sequence>
      )}

      {/* Phase 3: Title */}
      {titlePhase && (
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
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 80,
              fontWeight: 700,
              color: COLORS.text,
              letterSpacing: 4,
              textShadow: `0 0 40px rgba(255, 255, 255, 0.15)`,
            }}
          >
            {title}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
