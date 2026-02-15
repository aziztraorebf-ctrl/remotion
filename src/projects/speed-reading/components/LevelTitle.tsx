import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["600"],
  subsets: ["latin"],
});

type LevelTitleProps = {
  name: string;
  accentColor: string;
};

export const LevelTitle: React.FC<LevelTitleProps> = ({
  name,
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
        right: 60,
        opacity,
        transform: `translateY(${translateY}px)`,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: accentColor,
          boxShadow: `0 0 8px ${accentColor}88`,
        }}
      />
      <div
        style={{
          fontFamily,
          fontSize: 30,
          fontWeight: 600,
          color: accentColor,
        }}
      >
        {name}
      </div>
    </div>
  );
};
