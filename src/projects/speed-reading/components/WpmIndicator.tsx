import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

type WpmIndicatorProps = {
  wpm: number;
  accentColor: string;
};

export const WpmIndicator: React.FC<WpmIndicatorProps> = ({
  wpm,
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
  const translateY = interpolate(entrance, [0, 1], [-20, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: 40,
        left: 60,
        opacity,
        transform: `translateY(${translateY}px)`,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 28,
          fontWeight: 400,
          color: "#94A3B8",
          letterSpacing: 1,
        }}
      >
        WPM
      </div>
      <div
        style={{
          fontFamily,
          fontSize: 36,
          fontWeight: 700,
          color: accentColor,
        }}
      >
        {wpm}
      </div>
    </div>
  );
};
