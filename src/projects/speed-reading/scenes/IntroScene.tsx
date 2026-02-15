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
import { COLORS } from "../config/speedReadingConfig";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

type IntroSceneProps = {
  title: string;
  subtitle: string;
};

export const IntroScene: React.FC<IntroSceneProps> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title entrance
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const titleY = interpolate(titleSpring, [0, 1], [40, 0]);

  // Subtitle entrance with delay
  const subtitleSpring = spring({
    frame,
    fps,
    delay: 15,
    config: { damping: 200 },
  });
  const subtitleOpacity = interpolate(subtitleSpring, [0, 1], [0, 1]);
  const subtitleY = interpolate(subtitleSpring, [0, 1], [20, 0]);

  // Decorative line
  const lineSpring = spring({
    frame,
    fps,
    delay: 25,
    config: { damping: 200 },
  });
  const lineWidth = interpolate(lineSpring, [0, 1], [0, 200]);

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
        }}
      >
        {/* Title */}
        <div
          style={{
            fontFamily,
            fontSize: 80,
            fontWeight: 700,
            color: COLORS.text,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            letterSpacing: 3,
          }}
        >
          {title}
        </div>

        {/* Decorative line */}
        <div
          style={{
            width: lineWidth,
            height: 3,
            backgroundColor: COLORS.level1,
            marginTop: 30,
            marginBottom: 30,
            borderRadius: 2,
            boxShadow: `0 0 20px ${COLORS.level1}44`,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontFamily,
            fontSize: 32,
            fontWeight: 400,
            color: COLORS.secondaryText,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            letterSpacing: 1,
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
