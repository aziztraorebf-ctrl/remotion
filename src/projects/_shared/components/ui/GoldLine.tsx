import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface GoldLineProps {
  widthRatio?: number;   // fraction de la largeur totale (défaut 0.55)
  startFrame?: number;   // frame de début de l'animation (défaut 0)
  durationFrames?: number; // durée de l'étirement (défaut 18)
  color?: string;        // couleur centrale (défaut #d4a93c)
  marginBottom?: number;
}

export const GoldLine: React.FC<GoldLineProps> = ({
  widthRatio = 0.55,
  startFrame = 0,
  durationFrames = 18,
  color = "#d4a93c",
  marginBottom = 28,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const scaleX = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        width: width * widthRatio,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        transformOrigin: "center",
        transform: `scaleX(${scaleX})`,
        marginBottom,
      }}
    />
  );
};
