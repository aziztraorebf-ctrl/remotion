// Demo isolee du composant CornesFrame — pour validation visuelle Aziz avant integration aux scenes
// 3 phases : ouverture (0-1.5s), maintien (1.5-3s), fermeture (3-4.5s)

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { CornesFrame } from "../components/CornesFrame";
import { SHAKA_PALETTE } from "../components/AtlasShakaPalette";

interface CornesFrameDemoProps {
  durationFrames: number;
}

export const CornesFrameDemo: React.FC<CornesFrameDemoProps> = ({ durationFrames }) => {
  const frame = useCurrentFrame();

  // Phase manuelle pour bien voir l'animation
  const phase = interpolate(
    frame,
    [0, durationFrames * 0.3, durationFrames * 0.7, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: SHAKA_PALETTE.NOIR_PROFOND }}>
      <svg viewBox="0 0 1080 1920" style={{ width: "100%", height: "100%" }}>
        {/* Indicateur centre (point ennemi a encercler) */}
        <circle cx="540" cy="960" r="6" fill={SHAKA_PALETTE.BORDEAUX} opacity="0.6" />
        {/* Texte explicatif */}
        <text
          x="540"
          y="200"
          textAnchor="middle"
          fontFamily='"Anton", sans-serif'
          fontSize="48"
          fill={SHAKA_PALETTE.OR}
          letterSpacing="4"
        >
          CORNES DE BUFFLE
        </text>
        <text
          x="540"
          y="250"
          textAnchor="middle"
          fontFamily='"Inter", sans-serif'
          fontSize="22"
          fill={SHAKA_PALETTE.PARCHEMIN}
          letterSpacing="2"
          opacity="0.7"
        >
          ENCERCLEMENT TACTIQUE — DEMO
        </text>

        {/* Cornes au centre, plus grandes pour la demo */}
        <CornesFrame
          durationFrames={durationFrames}
          phaseOverride={phase}
          centerX={540}
          centerY={1200}
          scale={1.6}
        />

        <text
          x="540"
          y="1700"
          textAnchor="middle"
          fontFamily='"Inter", sans-serif'
          fontSize="20"
          fill={SHAKA_PALETTE.PARCHEMIN}
          letterSpacing="2"
          opacity="0.55"
          fontStyle="italic"
        >
          2 arcs Bezier — ouverture / maintien / fermeture
        </text>
      </svg>
    </AbsoluteFill>
  );
};
