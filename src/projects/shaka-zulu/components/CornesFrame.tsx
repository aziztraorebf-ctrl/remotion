// Cornes de buffle — composant signature reutilisable aux transitions de segments
// Convergence Jury Pass 1 (3/3 LLMs) + Pass 2 (verdict : geometrique 2 arcs Bezier exclusivement, pas Recraft, pas Gemini)
//
// Approche tactique : ce n'est PAS une illustration biologique. C'est l'OUTIL DE GUERRE.
// Animation : 2 arcs Bezier qui s'OUVRENT (encerclement) puis se REFERMENT (engloutissement).
// stroke-width et courbure animes via spring.
//
// Usage typique : aux transitions S1→S2, S2→S3, S3→S4
// Duree typique : 1 a 1.5s (30-45 frames a 30fps)

import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SHAKA_PALETTE } from "./AtlasShakaPalette";

interface CornesFrameProps {
  durationFrames: number;
  variant?: "open" | "close" | "pulse";
  centerX?: number;
  centerY?: number;
  scale?: number;
  // Phase de l'animation : 0 = ferme, 1 = ouvert max
  // Si non fourni, anime automatiquement open->close sur durationFrames
  phaseOverride?: number;
}

export const CornesFrame: React.FC<CornesFrameProps> = ({
  durationFrames,
  variant = "open",
  centerX = 540,
  centerY = 960,
  scale = 1,
  phaseOverride,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation par defaut : ouverture rapide, maintien, fermeture
  const openT = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
    from: 0,
    to: 1,
  });

  const closeT = interpolate(
    frame,
    [durationFrames * 0.7, durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  let phase: number;
  if (phaseOverride !== undefined) {
    phase = phaseOverride;
  } else if (variant === "open") {
    phase = openT;
  } else if (variant === "close") {
    phase = 1 - closeT;
  } else {
    // pulse : ouvre puis ferme
    phase = openT * (1 - closeT);
  }

  // Geometrie tactique :
  // Centre = ennemi a encercler. Cornes partent du centre vers l'exterieur en arc.
  // Phase 0 : pointes alignees au centre (ferme)
  // Phase 1 : pointes ecartees a 200px de chaque cote (ouvert)
  const reach = 220 * phase;
  const armLength = 280 * phase;
  const strokeWidth = 4 + 6 * phase;

  // Corne gauche : arc Bezier qui part du centre, s'ecarte vers la gauche, puis revient vers l'avant
  const leftCorne = `
    M 0 0
    C ${-reach * 0.4} ${-armLength * 0.3}, ${-reach} ${-armLength * 0.7}, ${-reach * 1.05} ${-armLength}
  `;
  const rightCorne = `
    M 0 0
    C ${reach * 0.4} ${-armLength * 0.3}, ${reach} ${-armLength * 0.7}, ${reach * 1.05} ${-armLength}
  `;

  // Centre = poitrine du buffle (ligne courte)
  const chestWidth = 30 * phase;

  return (
    <g
      transform={`translate(${centerX} ${centerY}) scale(${scale})`}
      opacity={phase}
    >
      {/* Corne gauche */}
      <path
        d={leftCorne}
        fill="none"
        stroke={SHAKA_PALETTE.OR}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={0.95}
      />
      {/* Corne droite */}
      <path
        d={rightCorne}
        fill="none"
        stroke={SHAKA_PALETTE.OR}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={0.95}
      />
      {/* Poitrine — ligne courte horizontale au centre */}
      <line
        x1={-chestWidth}
        y1={0}
        x2={chestWidth}
        y2={0}
        stroke={SHAKA_PALETTE.BORDEAUX}
        strokeWidth={strokeWidth * 0.8}
        strokeLinecap="round"
        opacity={0.85}
      />
      {/* Pointe corne gauche (renforcee) */}
      <circle
        cx={-reach * 1.05}
        cy={-armLength}
        r={strokeWidth * 0.6}
        fill={SHAKA_PALETTE.OR}
        opacity={0.95}
      />
      {/* Pointe corne droite */}
      <circle
        cx={reach * 1.05}
        cy={-armLength}
        r={strokeWidth * 0.6}
        fill={SHAKA_PALETTE.OR}
        opacity={0.95}
      />
    </g>
  );
};
