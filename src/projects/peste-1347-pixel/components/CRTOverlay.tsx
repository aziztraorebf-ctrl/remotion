import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { CRT_SETTINGS } from "../config/theme";

interface CRTOverlayProps {
  scanlineOpacity?: number;
}

export const CRTOverlay: React.FC<CRTOverlayProps> = ({
  scanlineOpacity,
}) => {
  const effectiveScanlineOpacity = scanlineOpacity ?? CRT_SETTINGS.scanlineOpacity;
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Dual-frequency flicker for more organic CRT feel
  const flicker = interpolate(
    Math.sin(frame * 0.8) + Math.sin(frame * 1.3) + Math.sin(frame * 3.7) * 0.3,
    [-2.3, 2.3],
    [0.95, 1.0]
  );

  // Rolling scanline bar: slow sweep top-to-bottom every ~4 seconds
  const rollY = (frame * 2.5) % (height + 120) - 60;

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
            rgba(0, 0, 0, ${effectiveScanlineOpacity}) ${CRT_SETTINGS.scanlineSpacing - 1}px,
            rgba(0, 0, 0, ${effectiveScanlineOpacity}) ${CRT_SETTINGS.scanlineSpacing}px
          )`,
        }}
      />

      {/* Rolling scanline bar - sweeps down like a real CRT */}
      <div
        style={{
          position: "absolute",
          top: rollY,
          left: 0,
          width: "100%",
          height: 120,
          background: `linear-gradient(
            180deg,
            transparent 0%,
            rgba(0, 255, 65, 0.03) 30%,
            rgba(0, 255, 65, 0.06) 50%,
            rgba(0, 255, 65, 0.03) 70%,
            transparent 100%
          )`,
        }}
      />

      {/* Vignette - darker + subtle green tint for terminal mood */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,10,0,${CRT_SETTINGS.vignetteIntensity}) 100%)`,
        }}
      />

      {/* Flicker layer - stronger for visible brightness variation */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: `rgba(255,255,255,${(1 - flicker) * 0.6})`,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
};
