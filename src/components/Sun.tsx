import React from "react";

interface SunProps {
  cx?: number;
  cy?: number;
  radius?: number;
  color?: string;
  showRays?: boolean;
  rayCount?: number;
  rayLength?: number;
}

export const Sun: React.FC<SunProps> = ({
  cx = 1700,
  cy = 120,
  radius = 40,
  color = "#FFD93D",
  showRays = true,
  rayCount = 8,
  rayLength = 20,
}) => {
  const rays: React.ReactNode[] = [];

  if (showRays) {
    for (let i = 0; i < rayCount; i++) {
      const angle = (i * 360) / rayCount;
      const radians = (angle * Math.PI) / 180;
      const startX = cx + Math.cos(radians) * (radius + 5);
      const startY = cy + Math.sin(radians) * (radius + 5);
      const endX = cx + Math.cos(radians) * (radius + 5 + rayLength);
      const endY = cy + Math.sin(radians) * (radius + 5 + rayLength);

      rays.push(
        <line
          key={`ray-${i}`}
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
        />
      );
    }
  }

  return (
    <g>
      <circle cx={cx} cy={cy} r={radius} fill={color} />
      {rays}
    </g>
  );
};
