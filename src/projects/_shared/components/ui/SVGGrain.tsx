import React from "react";
import { useVideoConfig } from "remotion";

interface SVGGrainProps {
  opacity?: number;  // défaut 0.12
  seed?: number;     // défaut 2 — changer pour varier le pattern
  baseFrequency?: number; // défaut 0.72
  numOctaves?: number;    // défaut 4
}

// Grain statique SVG pur (feTurbulence + feColorMatrix).
// Déterministe, zéro image externe, léger.
// Superposer sur AbsoluteFill avec pointerEvents:none.
export const SVGGrain: React.FC<SVGGrainProps> = ({
  opacity = 0.12,
  seed = 2,
  baseFrequency = 0.72,
  numOctaves = 4,
}) => {
  const { width, height } = useVideoConfig();

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <defs>
        <filter id={`grain-${seed}`} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={baseFrequency}
            numOctaves={numOctaves}
            seed={seed}
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix type="saturate" values="0" in="noise" result="greyNoise" />
          <feBlend in="SourceGraphic" in2="greyNoise" mode="overlay" result="blended" />
          <feComponentTransfer in="blended">
            <feFuncA type="linear" slope={opacity} />
          </feComponentTransfer>
        </filter>
      </defs>
      <rect width={width} height={height} filter={`url(#grain-${seed})`} fill="white" opacity={opacity} />
    </svg>
  );
};
