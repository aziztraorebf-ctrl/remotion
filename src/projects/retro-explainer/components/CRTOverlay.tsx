import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { CRT_SETTINGS } from "../config/theme";

// CRT monitor effect overlay - scanlines, vignette, subtle flicker
export const CRTOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Subtle brightness flicker
  const flicker = interpolate(
    Math.sin(frame * 0.8) + Math.sin(frame * 1.3),
    [-2, 2],
    [0.97, 1.0]
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      {/* Scanlines */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent ${CRT_SETTINGS.scanlineSpacing - 1}px,
            rgba(0, 0, 0, ${CRT_SETTINGS.scanlineOpacity}) ${CRT_SETTINGS.scanlineSpacing - 1}px,
            rgba(0, 0, 0, ${CRT_SETTINGS.scanlineOpacity}) ${CRT_SETTINGS.scanlineSpacing}px
          )`,
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,${CRT_SETTINGS.vignetteIntensity}) 100%)`,
        }}
      />

      {/* Flicker layer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: `rgba(255,255,255,${(1 - flicker) * 0.5})`,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
};
