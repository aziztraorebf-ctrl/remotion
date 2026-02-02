import React from "react";
import { Expression } from "./types";
import { CHEEK_COLOR } from "./constants";

interface HeadProps {
  cx: number;
  cy: number;
  radius: number;
  color: string;
  fillColor: string;
  strokeWidth: number;
  tilt?: number;
  expression?: Expression;
}

export const Head: React.FC<HeadProps> = ({
  cx,
  cy,
  radius,
  color,
  fillColor,
  strokeWidth,
  tilt = 0,
  expression = "neutral",
}) => {
  const eyeOffsetX = radius * 0.3;
  const eyeY = cy - radius * 0.1;
  const mouthY = cy + radius * 0.35;

  const isExcitedOrHappy = expression === "happy" || expression === "excited";
  const isSurprised = expression === "surprised";
  const isExcited = expression === "excited";

  const eyeRadius = isSurprised || isExcited ? 5 : 3.5;

  return (
    <g
      style={{
        transform: `rotate(${tilt}deg)`,
        transformBox: "fill-box" as never,
        transformOrigin: `${cx}px ${cy + radius}px`,
      }}
    >
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={fillColor}
        stroke={color}
        strokeWidth={strokeWidth}
      />

      {isSurprised || isExcited ? (
        <>
          <circle
            cx={cx - eyeOffsetX}
            cy={eyeY}
            r={eyeRadius}
            fill="none"
            stroke={color}
            strokeWidth={2}
          />
          <circle
            cx={cx + eyeOffsetX}
            cy={eyeY}
            r={eyeRadius}
            fill="none"
            stroke={color}
            strokeWidth={2}
          />
          <circle
            cx={cx - eyeOffsetX}
            cy={eyeY}
            r={2}
            fill={color}
          />
          <circle
            cx={cx + eyeOffsetX}
            cy={eyeY}
            r={2}
            fill={color}
          />
        </>
      ) : (
        <>
          <circle cx={cx - eyeOffsetX} cy={eyeY} r={eyeRadius} fill={color} />
          <circle cx={cx + eyeOffsetX} cy={eyeY} r={eyeRadius} fill={color} />
        </>
      )}

      {expression === "neutral" && (
        <line
          x1={cx - radius * 0.2}
          y1={mouthY}
          x2={cx + radius * 0.2}
          y2={mouthY}
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      )}

      {expression === "happy" && (
        <path
          d={`M ${cx - radius * 0.25} ${mouthY - 2} Q ${cx} ${mouthY + 8} ${cx + radius * 0.25} ${mouthY - 2}`}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      )}

      {expression === "surprised" && (
        <ellipse
          cx={cx}
          cy={mouthY}
          rx={radius * 0.12}
          ry={radius * 0.18}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
        />
      )}

      {expression === "excited" && (
        <path
          d={`M ${cx - radius * 0.3} ${mouthY - 3} Q ${cx} ${mouthY + 12} ${cx + radius * 0.3} ${mouthY - 3}`}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      )}

      {isExcitedOrHappy && (
        <>
          <ellipse
            cx={cx - eyeOffsetX - 4}
            cy={eyeY + 8}
            rx={5}
            ry={3}
            fill={CHEEK_COLOR}
            opacity={0.6}
          />
          <ellipse
            cx={cx + eyeOffsetX + 4}
            cy={eyeY + 8}
            rx={5}
            ry={3}
            fill={CHEEK_COLOR}
            opacity={0.6}
          />
        </>
      )}
    </g>
  );
};
