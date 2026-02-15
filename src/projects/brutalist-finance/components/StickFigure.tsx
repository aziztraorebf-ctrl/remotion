import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../config/theme";

interface StickFigureProps {
  startFrame: number;
  size?: number;
  color?: string;
  strokeColor?: string;
  strokeWidth?: number;
  x?: number;
  y?: number;
}

export const StickFigure: React.FC<StickFigureProps> = ({
  startFrame,
  size = 100,
  color = COLORS.white,
  strokeColor = COLORS.blue,
  strokeWidth = 4,
  x = 0,
  y = 0,
}) => {
  const frame = useCurrentFrame();
  const visible = frame >= startFrame;

  if (!visible) return null;

  const headR = size * 0.18;
  const bodyW = size * 0.4;
  const bodyH = size * 0.5;
  const cx = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      {/* Head */}
      <circle
        cx={cx}
        cy={headR + strokeWidth}
        r={headR}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      {/* Body */}
      <rect
        x={cx - bodyW / 2}
        y={headR * 2 + strokeWidth + 4}
        width={bodyW}
        height={bodyH}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};
