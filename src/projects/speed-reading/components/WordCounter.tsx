import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600"],
  subsets: ["latin"],
});

type WordCounterProps = {
  count: number;
  accentColor: string;
};

export const WordCounter: React.FC<WordCounterProps> = ({
  count,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 0.7]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        right: 60,
        opacity,
        display: "flex",
        alignItems: "baseline",
        gap: 6,
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 24,
          fontWeight: 600,
          color: accentColor,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {count}
      </div>
      <div
        style={{
          fontFamily,
          fontSize: 16,
          fontWeight: 400,
          color: "#64748B",
          letterSpacing: 1,
        }}
      >
        words
      </div>
    </div>
  );
};
