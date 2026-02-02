import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

interface OrangeOrbProps {
  cx?: number;
  cy?: number;
  startFrame?: number;
  minRadius?: number;
  maxRadius?: number;
  color?: string;
}

export const OrangeOrb: React.FC<OrangeOrbProps> = ({
  cx = 1300,
  cy = 660,
  startFrame = 0,
  minRadius = 5,
  maxRadius = 20,
  color = "#FF6B35",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appearProgress = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 100 },
  });

  const opacity = interpolate(appearProgress, [0, 1], [0, 1]);

  const radius = interpolate(
    frame,
    [startFrame, startFrame + fps * 7],
    [minRadius, maxRadius],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const pulsePhase = (frame - startFrame) % (fps * 0.8);
  const pulse = interpolate(
    pulsePhase,
    [0, (fps * 0.8) / 2, fps * 0.8],
    [0, 2, 0]
  );

  if (frame < startFrame) return null;

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={(radius + pulse) * 1.5}
        fill={color}
        opacity={opacity * 0.2}
      />
      <circle
        cx={cx}
        cy={cy}
        r={radius + pulse}
        fill={color}
        opacity={opacity * 0.8}
      />
    </g>
  );
};
