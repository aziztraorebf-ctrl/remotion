import React from "react";

interface OutdoorBackgroundProps {
  skyColor?: string;
  grassColor?: string;
  horizonY?: number;
  horizonColor?: string;
  width?: number;
  height?: number;
}

export const OutdoorBackground: React.FC<OutdoorBackgroundProps> = ({
  skyColor = "#87CEEB",
  grassColor = "#90EE90",
  horizonY = 700,
  horizonColor = "#228B22",
  width = 1920,
  height = 1080,
}) => {
  return (
    <g>
      <rect x={0} y={0} width={width} height={horizonY} fill={skyColor} />
      <rect
        x={0}
        y={horizonY}
        width={width}
        height={height - horizonY}
        fill={grassColor}
      />
      <line
        x1={0}
        y1={horizonY}
        x2={width}
        y2={horizonY}
        stroke={horizonColor}
        strokeWidth={3}
      />
    </g>
  );
};
