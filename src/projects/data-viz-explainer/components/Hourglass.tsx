import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS } from "../config/theme";

interface HourglassProps {
  startFrame: number;
  durationFrames?: number;
  size?: number;
}

export const Hourglass: React.FC<HourglassProps> = ({
  startFrame,
  durationFrames = 200,
  size = 120,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const appear = interpolate(frame, [startFrame - 10, startFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sand levels
  const topSand = 1 - progress;
  const bottomSand = progress;

  // Falling grain stream
  const streamOpacity = progress > 0.02 && progress < 0.98 ? 0.8 : 0;

  // Subtle rotation wobble
  const wobble = Math.sin(frame * 0.08) * 1.5;

  const w = size;
  const h = size * 1.6;
  const half = h / 2;
  const glassInset = w * 0.15;
  const neckW = w * 0.08;

  // Year labels along the side
  const yearLabel = Math.floor(progress * 25);

  return (
    <div
      style={{
        opacity: appear,
        transform: `rotate(${wobble}deg)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Top glass outline */}
        <path
          d={`M ${glassInset} 8 L ${w - glassInset} 8 L ${w / 2 + neckW} ${half - 4} L ${w / 2 - neckW} ${half - 4} Z`}
          fill="none"
          stroke={COLORS.textMuted}
          strokeWidth="2"
          opacity={0.5}
        />

        {/* Bottom glass outline */}
        <path
          d={`M ${glassInset} ${h - 8} L ${w - glassInset} ${h - 8} L ${w / 2 + neckW} ${half + 4} L ${w / 2 - neckW} ${half + 4} Z`}
          fill="none"
          stroke={COLORS.textMuted}
          strokeWidth="2"
          opacity={0.5}
        />

        {/* Top sand */}
        {topSand > 0.02 && (
          <clipPath id="topClip">
            <path
              d={`M ${glassInset + 2} 10 L ${w - glassInset - 2} 10 L ${w / 2 + neckW} ${half - 5} L ${w / 2 - neckW} ${half - 5} Z`}
            />
          </clipPath>
        )}
        {topSand > 0.02 && (
          <rect
            x={glassInset}
            y={10 + (half - 14) * (1 - topSand)}
            width={w - glassInset * 2}
            height={(half - 14) * topSand}
            fill={COLORS.blue}
            opacity={0.6}
            clipPath="url(#topClip)"
            rx="2"
          />
        )}

        {/* Bottom sand */}
        {bottomSand > 0.02 && (
          <clipPath id="bottomClip">
            <path
              d={`M ${glassInset + 2} ${h - 10} L ${w - glassInset - 2} ${h - 10} L ${w / 2 + neckW} ${half + 5} L ${w / 2 - neckW} ${half + 5} Z`}
            />
          </clipPath>
        )}
        {bottomSand > 0.02 && (
          <rect
            x={glassInset}
            y={h - 10 - (half - 14) * bottomSand}
            width={w - glassInset * 2}
            height={(half - 14) * bottomSand}
            fill={COLORS.red}
            opacity={0.5}
            clipPath="url(#bottomClip)"
            rx="2"
          />
        )}

        {/* Falling stream */}
        <line
          x1={w / 2}
          y1={half - 3}
          x2={w / 2}
          y2={half + 3}
          stroke={COLORS.gold}
          strokeWidth="2"
          opacity={streamOpacity}
        />

        {/* Frame bars top/bottom */}
        <rect
          x={glassInset - 4}
          y={2}
          width={w - (glassInset - 4) * 2}
          height={5}
          rx="2"
          fill={COLORS.textMuted}
          opacity={0.4}
        />
        <rect
          x={glassInset - 4}
          y={h - 7}
          width={w - (glassInset - 4) * 2}
          height={5}
          rx="2"
          fill={COLORS.textMuted}
          opacity={0.4}
        />
      </svg>

      {/* Year counter below */}
      <div
        style={{
          marginTop: 8,
          fontSize: 13,
          fontWeight: 700,
          color: progress > 0.7 ? COLORS.red : COLORS.blue,
          fontFamily: "Inter",
          letterSpacing: 1,
        }}
      >
        {progress > 0.02 ? `ANNEE ${yearLabel}/25` : ""}
      </div>
    </div>
  );
};
