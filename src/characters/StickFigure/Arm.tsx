import React from "react";

interface ArmProps {
  startX: number;
  startY: number;
  length: number;
  color: string;
  strokeWidth: number;
  rotation?: number;
  side: "left" | "right";
  handRadius?: number;
}

export const Arm: React.FC<ArmProps> = ({
  startX,
  startY,
  length,
  color,
  strokeWidth,
  rotation = 0,
  side,
  handRadius = 6,
}) => {
  const baseAngle = side === "left" ? -15 : 15;
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
      <circle
        cx={endX}
        cy={endY}
        r={handRadius}
        fill={color}
      />
    </g>
  );
};
