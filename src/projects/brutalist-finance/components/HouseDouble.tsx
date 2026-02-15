import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, SPRING_BRUT, BORDER } from "../config/theme";

interface HouseDoubleProps {
  startFrame: number;
  splitFrame: number;
  size?: number;
  realColor?: string;
  ghostColor?: string;
  strokeWidth?: number;
}

export const HouseDouble: React.FC<HouseDoubleProps> = ({
  startFrame,
  splitFrame,
  size = 200,
  realColor = COLORS.blue,
  ghostColor = COLORS.red,
  strokeWidth = BORDER.width,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const visible = frame >= startFrame;
  if (!visible) return null;

  const splitProgress =
    frame >= splitFrame
      ? spring({
          frame: frame - splitFrame,
          fps,
          config: { ...SPRING_BRUT, mass: 1.2 },
        })
      : 0;

  const roofH = size * 0.35;
  const bodyH = size * 0.55;
  const bodyW = size * 0.7;
  const cx = size / 2;

  const ghostOffset = splitProgress * size * 0.6;
  const ghostOpacity = interpolate(splitProgress, [0, 0.3, 1], [0, 0.6, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const House = ({
    offsetX,
    color,
    opacity,
    dashed,
  }: {
    offsetX: number;
    color: string;
    opacity: number;
    dashed: boolean;
  }) => (
    <g
      transform={`translate(${offsetX}, 0)`}
      opacity={opacity}
      strokeDasharray={dashed ? "8 4" : "none"}
    >
      {/* Roof - triangle */}
      <polygon
        points={`${cx},${strokeWidth} ${cx - bodyW / 2},${roofH} ${cx + bodyW / 2},${roofH}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="miter"
      />
      {/* Body - rectangle */}
      <rect
        x={cx - bodyW / 2}
        y={roofH}
        width={bodyW}
        height={bodyH}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      {/* Door */}
      <rect
        x={cx - bodyW * 0.12}
        y={roofH + bodyH * 0.45}
        width={bodyW * 0.24}
        height={bodyH * 0.55}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth * 0.75}
      />
    </g>
  );

  const totalWidth = size + (splitProgress > 0 ? size * 0.6 + size * 0.2 : 0);

  return (
    <svg
      width={totalWidth}
      height={size}
      viewBox={`0 0 ${totalWidth} ${size}`}
    >
      {/* Ghost house (behind) */}
      {splitProgress > 0 && (
        <House
          offsetX={ghostOffset + size * 0.2}
          color={ghostColor}
          opacity={ghostOpacity}
          dashed={true}
        />
      )}
      {/* Real house (front) */}
      <House offsetX={0} color={realColor} opacity={1} dashed={false} />
    </svg>
  );
};
