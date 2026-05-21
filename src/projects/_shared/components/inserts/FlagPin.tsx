/**
 * FlagPin — drapeau circulaire avec entry spring bounce + float idle (style Jacq Adi).
 *
 * Usage :
 *   <FlagPin flag="cd" entryAt={60} size={140} position={{ left: '50%', top: 280 }} />
 *
 * Drapeaux servis depuis flagcdn.com (PNG haute res, gratuit, CDN public).
 */

import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export type FlagPinProps = {
  flag: string; // ISO 3166-1 alpha-2 lowercase (cd, fr, us, ...)
  entryAt?: number; // frame at which entry animation starts
  size?: number;
  position?: React.CSSProperties;
  glowColor?: string;
  showRing?: boolean;
  float?: boolean;
};

export const FlagPin: React.FC<FlagPinProps> = ({
  flag,
  entryAt = 0,
  size = 140,
  position = { left: "50%", top: "40%" },
  glowColor = "#ffd700",
  showRing = true,
  float = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relFrame = frame - entryAt;
  if (relFrame < 0) return null;

  const scale = spring({
    fps,
    frame: relFrame,
    config: { damping: 10, stiffness: 110, mass: 0.6 },
  });

  const floatY = float
    ? Math.sin((frame - entryAt) / 18) * 6
    : 0;

  const ringOpacity = interpolate(relFrame, [0, 20], [0, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // flagcdn.com cdn — w320, w640, w1280, w2560 available
  const url = `https://flagcdn.com/w640/${flag}.png`;

  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        transform: `translate(-50%, -50%) translateY(${floatY}px) scale(${scale})`,
        ...position,
        pointerEvents: "none",
      }}
    >
      {showRing && (
        <div
          style={{
            position: "absolute",
            inset: -10,
            borderRadius: "50%",
            border: `3px solid ${glowColor}`,
            opacity: ringOpacity,
            boxShadow: `0 0 32px ${glowColor}`,
          }}
        />
      )}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          border: "4px solid white",
          boxShadow: "0 8px 24px rgba(0,0,0,0.55)",
          backgroundColor: "#000",
        }}
      >
        <img
          src={url}
          alt={`${flag} flag`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
};
