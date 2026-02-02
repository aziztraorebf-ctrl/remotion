import React from "react";

interface LegProps {
  startX: number;
  startY: number;
  length: number;
  color: string;
  strokeWidth: number;
  rotation?: number;
  side: "left" | "right";
  footWidth?: number;
  footHeight?: number;
}

export const Leg: React.FC<LegProps> = ({
  startX,
  startY,
  length,
  color,
  strokeWidth,
  rotation = 0,
  side,
  footWidth = 8,
  footHeight = 5,
}) => {
  const baseAngle = side === "left" ? -8 : 8;
  const totalAngle = baseAngle + rotation;
  const radians = (totalAngle * Math.PI) / 180;

  const endX = startX + Math.sin(radians) * length;
  const endY = startY + Math.cos(radians) * length;

  return (
    <g>
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <ellipse
        cx={endX}
        cy={endY}
        rx={footWidth}
        ry={footHeight}
        fill={color}
      />
    </g>
  );
};
