import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface CinematicBackgroundProps {
  startFrame?: number;
  fromColor?: string;
  toColor?: string;
  transitionFrames?: number;
  vignetteIntensity?: number;
}

export const CinematicBackground: React.FC<CinematicBackgroundProps> = ({
  startFrame = 0,
  fromColor = "#0a0a1a",
  toColor = "#1a0a0a",
  transitionFrames = 60,
  vignetteIntensity = 0.7,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [startFrame, startFrame + transitionFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Subtle pulsing glow in the center
  const pulsePhase = Math.sin(frame * 0.03) * 0.5 + 0.5;
  const glowSize = 40 + pulsePhase * 15;
  const glowOpacity = 0.08 + pulsePhase * 0.04;

  // Horizontal scan line for depth
  const scanY = ((frame * 0.5) % 120) / 120 * 100;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Base gradient that transitions */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(170deg, ${fromColor} 0%, ${toColor} 100%)`,
          opacity: 1 - progress,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(170deg, ${toColor} 0%, #200a15 50%, #0a0a1a 100%)`,
          opacity: progress,
        }}
      />

      {/* Center radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse ${glowSize}% ${glowSize}% at 50% 50%, rgba(255, 71, 87, ${glowOpacity}) 0%, transparent 100%)`,
        }}
      />

      {/* Subtle horizontal grid lines for depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(136, 146, 176, 0.03) 79px, rgba(136, 146, 176, 0.03) 80px)",
        }}
      />

      {/* Slow scan line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${scanY}%`,
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,71,87,0.06) 20%, rgba(255,71,87,0.1) 50%, rgba(255,71,87,0.06) 80%, transparent 100%)",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(0,0,0,${vignetteIntensity}) 100%)`,
        }}
      />
    </div>
  );
};
