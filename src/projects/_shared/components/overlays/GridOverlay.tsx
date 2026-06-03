import React from "react";
import { useVideoConfig } from "remotion";

interface GridOverlayProps {
  opacity?: number;
  spacing?: number;
  color?: string;
  noiseOpacity?: number;
}

export const GridOverlay: React.FC<GridOverlayProps> = ({
  opacity = 0.05,
  spacing = 80,
  color = "#c8a951",
  noiseOpacity = 0.025,
}) => {
  const { width, height } = useVideoConfig();

  const cols = Math.ceil(width / spacing) + 1;
  const rows = Math.ceil(height / spacing) + 1;

  const verticals = Array.from({ length: cols }, (_, i) => i * spacing);
  const horizontals = Array.from({ length: rows }, (_, i) => i * spacing);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Orthogonal grid */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, opacity }}
        viewBox={`0 0 ${width} ${height}`}
      >
        {verticals.map((x) => (
          <line
            key={`v${x}`}
            x1={x} y1={0}
            x2={x} y2={height}
            stroke={color}
            strokeWidth={0.5}
          />
        ))}
        {horizontals.map((y) => (
          <line
            key={`h${y}`}
            x1={0} y1={y}
            x2={width} y2={y}
            stroke={color}
            strokeWidth={0.5}
          />
        ))}
      </svg>

      {/* Micro-bruit : dégradé SVG turbulence simulé par petits dots stochastiques */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, opacity: noiseOpacity }}
        viewBox={`0 0 ${width} ${height}`}
      >
        <filter id="grid-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={width} height={height} filter="url(#grid-noise)" fill={color} />
      </svg>
    </div>
  );
};
