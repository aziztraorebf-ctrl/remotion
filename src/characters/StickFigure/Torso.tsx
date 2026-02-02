import React from "react";

interface TorsoProps {
  topX: number;
  topY: number;
  length: number;
  color: string;
  strokeWidth: number;
}

export const Torso: React.FC<TorsoProps> = ({
  topX,
  topY,
  length,
  color,
  strokeWidth,
}) => {
  return (
    <line
      x1={topX}
      y1={topY}
      x2={topX}
      y2={topY + length}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  );
};
