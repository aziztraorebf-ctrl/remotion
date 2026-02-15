import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS } from "../config/theme";

interface GridBackgroundProps {
  gridSize?: number;
  pulseSpeed?: number;
  showScanline?: boolean;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({
  gridSize = 60,
  pulseSpeed = 0.02,
  showScanline = true,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Subtle grid pulse
  const gridOpacity = interpolate(
    Math.sin(frame * pulseSpeed),
    [-1, 1],
    [0.04, 0.1]
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: COLORS.bgPrimary,
      }}
    >
      {/* Gradient radial center glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, ${COLORS.bgSecondary} 0%, ${COLORS.bgPrimary} 70%)`,
        }}
      />

      {/* Grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${COLORS.gridLine} 1px, transparent 1px),
            linear-gradient(90deg, ${COLORS.gridLine} 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          opacity: gridOpacity,
        }}
      />

      {/* Horizontal scan line */}
      {showScanline && (
        <div
          style={{
            position: "absolute",
            top: (frame * 1.5) % (height + 100) - 50,
            left: 0,
            right: 0,
            height: 1,
            background: `linear-gradient(90deg, transparent 0%, ${COLORS.blue}20 30%, ${COLORS.blue}30 50%, ${COLORS.blue}20 70%, transparent 100%)`,
            boxShadow: `0 0 30px ${COLORS.blueGlow}`,
          }}
        />
      )}

      {/* Subtle vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 50%, ${COLORS.bgPrimary} 100%)`,
          opacity: 0.6,
        }}
      />
    </div>
  );
};
