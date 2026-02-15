import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../config/speedReadingConfig";

export const Background: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
      }}
    >
      {/* Subtle radial vignette for depth */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.6) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
