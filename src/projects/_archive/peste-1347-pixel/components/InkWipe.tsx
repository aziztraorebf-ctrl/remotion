import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ============================================================
// InkWipe — Transition wipe encre horizontal (droite -> gauche)
// Geste "tourner la page de manuscrit medieval"
//
// Usage :
//   <InkWipe durationInFrames={50} />
//
// Architecture :
//   Phase 1 (0 -> mid)    : rideau arrive de droite (couvre)
//   Phase 2 (mid -> total): rideau repart gauche (revele scene suivante)
// ============================================================

const INK_DEEP = "#0D0804";
const GOLD = "#C9A227";

interface InkWipeProps {
  durationInFrames: number;
}

export const InkWipe: React.FC<InkWipeProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mid = Math.floor(durationInFrames / 2);

  // Phase 1 : rideau arrive de droite
  const wipeInX = interpolate(
    frame,
    [0, mid],
    [1920, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => t * t * (3 - 2 * t),
    }
  );

  // Phase 2 : rideau repart vers la gauche — spring pour inertie naturelle
  const wipeOutProgress = spring({
    frame: Math.max(0, frame - mid),
    fps,
    config: { damping: 18, stiffness: 70 },
  });
  const wipeOutX = interpolate(wipeOutProgress, [0, 1], [0, -1920], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const curtainX = frame < mid ? wipeInX : wipeOutX;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: curtainX,
          width: "100%",
          height: "100%",
          backgroundColor: INK_DEEP,
          overflow: "hidden",
        }}
      >
        {/* Bord gauche du rideau — liseré or, evoque le dos d'un manuscrit */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 4,
            height: "100%",
            backgroundColor: GOLD,
            opacity: 0.6,
          }}
        />
        {/* Grain sur le rideau */}
        <svg
          width="1920"
          height="1080"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            mixBlendMode: "overlay",
            opacity: 0.07,
            pointerEvents: "none",
          }}
        >
          <defs>
            <filter id="grainInkWipe">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.62"
                numOctaves="3"
                seed={frame % 8}
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>
          <rect width="1920" height="1080" filter="url(#grainInkWipe)" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
