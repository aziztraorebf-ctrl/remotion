import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

type ProgressBarProps = {
  accentColor: string;
  totalFrames: number;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  accentColor,
  totalFrames,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [0, totalFrames], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const barWidth = 1520;
  const barHeight = 6;
  const barX = (1920 - barWidth) / 2;
  const barY = 980;

  return (
    <div
      style={{
        position: "absolute",
        left: barX,
        top: barY,
        width: barWidth,
        height: barHeight,
        borderRadius: barHeight / 2,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: "100%",
          borderRadius: barHeight / 2,
          backgroundColor: accentColor,
          boxShadow: `0 0 12px ${accentColor}88`,
          transition: "none",
        }}
      />
    </div>
  );
};
