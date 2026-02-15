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

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

type TransitionSceneProps = {
  message: string;
  accentColor: string;
};

export const TransitionScene: React.FC<TransitionSceneProps> = ({
  message,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const translateY = interpolate(entrance, [0, 1], [20, 0]);

  // Checkmark scale animation
  const checkSpring = spring({
    frame,
    fps,
    delay: 5,
    config: { damping: 12, stiffness: 200 },
  });
  const checkScale = interpolate(checkSpring, [0, 1], [0, 1]);

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
        {/* Checkmark circle */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: `${accentColor}22`,
            border: `3px solid ${accentColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${checkScale})`,
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke={accentColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Success message */}
        <div
          style={{
            fontFamily,
            fontSize: 42,
            fontWeight: 700,
            color: accentColor,
            opacity,
            transform: `translateY(${translateY}px)`,
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          {message}
        </div>
      </div>
    </AbsoluteFill>
  );
};
