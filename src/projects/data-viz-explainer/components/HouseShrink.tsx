import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS } from "../config/theme";

interface HouseShrinkProps {
  startFrame: number;
  shrinkFrame: number;
  interestRatio?: number;
}

export const HouseShrink: React.FC<HouseShrinkProps> = ({
  startFrame,
  shrinkFrame,
  interestRatio = 0.8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // House appears
  const appear = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  // House shrinks as interest "eats" it
  const shrinkProgress = spring({
    frame: frame - shrinkFrame,
    fps,
    config: { damping: 25, mass: 1.5, stiffness: 30 },
  });

  const houseScale = interpolate(shrinkProgress, [0, 1], [1, 1 - interestRatio * 0.6]);

  // Interest bar grows inversely
  const interestHeight = interpolate(shrinkProgress, [0, 1], [0, 120]);

  // Color shift: house goes from green to desaturated
  const houseOpacity = interpolate(shrinkProgress, [0, 1], [1, 0.5]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 30,
        opacity: appear,
        transform: `scale(${appear})`,
      }}
    >
      {/* House SVG */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${houseScale})`,
          transformOrigin: "bottom center",
          transition: "transform 0.1s",
        }}
      >
        <svg width="120" height="130" viewBox="0 0 120 130" style={{ opacity: houseOpacity }}>
          {/* Roof */}
          <polygon
            points="60,5 5,55 115,55"
            fill={COLORS.green}
            stroke={COLORS.greenDark}
            strokeWidth="2"
          />
          {/* Body */}
          <rect
            x="15"
            y="55"
            width="90"
            height="70"
            fill={COLORS.green}
            stroke={COLORS.greenDark}
            strokeWidth="2"
            rx="2"
          />
          {/* Door */}
          <rect x="45" y="85" width="30" height="40" fill={COLORS.bgPrimary} rx="2" />
          {/* Window left */}
          <rect x="22" y="65" width="18" height="18" fill={COLORS.bgPrimary} rx="1" />
          {/* Window right */}
          <rect x="80" y="65" width="18" height="18" fill={COLORS.bgPrimary} rx="1" />
          {/* Euro sign on door */}
          <text
            x="60"
            y="112"
            textAnchor="middle"
            fontSize="18"
            fontWeight="700"
            fill={COLORS.green}
            fontFamily="Inter"
          >
            EUR
          </text>
        </svg>
        <div
          style={{
            marginTop: 8,
            fontSize: 13,
            color: COLORS.textSecondary,
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
            fontFamily: "Inter",
          }}
        >
          TON BIEN
        </div>
      </div>

      {/* VS arrow */}
      {shrinkProgress > 0.1 && (
        <div
          style={{
            fontSize: 28,
            color: COLORS.textMuted,
            fontWeight: 300,
            opacity: interpolate(shrinkProgress, [0.1, 0.3], [0, 1], {
              extrapolateRight: "clamp",
            }),
            marginBottom: 40,
          }}
        >
          vs
        </div>
      )}

      {/* Interest monster growing */}
      {shrinkProgress > 0.05 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: interpolate(shrinkProgress, [0.05, 0.2], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          {/* Red bar representing interest */}
          <div
            style={{
              width: 80,
              height: interestHeight,
              backgroundColor: COLORS.red,
              borderRadius: "6px 6px 2px 2px",
              boxShadow: `0 0 20px ${COLORS.redGlow}, 0 0 40px ${COLORS.redGlow}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: interestHeight > 30 ? 30 : 0,
            }}
          >
            {interestHeight > 40 && (
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#fff",
                  fontFamily: "Inter",
                }}
              >
                +80%
              </div>
            )}
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 13,
              color: COLORS.red,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              fontFamily: "Inter",
            }}
          >
            INTERETS
          </div>
        </div>
      )}
    </div>
  );
};
