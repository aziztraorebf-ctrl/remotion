import React from "react";
import { AbsoluteFill } from "remotion";

/**
 * GrainOverlay — grain SVG très subtil (feTurbulence) posé sur le fond.
 * Donne un effet "papier magazine" premium au lieu d'un aplat web plat.
 * Opacité volontairement basse (~3%). Déterministe (pas de random) → render-safe.
 */
export const GrainOverlay: React.FC<{ opacity?: number }> = ({ opacity = 0.04 }) => (
  <AbsoluteFill style={{ opacity, mixBlendMode: "multiply", pointerEvents: "none" }}>
    <svg width="100%" height="100%">
      <filter id="gn-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#gn-grain)" />
    </svg>
  </AbsoluteFill>
);
