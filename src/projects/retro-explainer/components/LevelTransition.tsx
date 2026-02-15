import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { RETRO_COLORS } from "../config/theme";
import { loadFont } from "@remotion/google-fonts/PressStart2P";

const { fontFamily } = loadFont();

interface LevelTransitionProps {
  stageNumber: number;
  stageName: string;
  subtitle?: string;
}

export const LevelTransition: React.FC<LevelTransitionProps> = ({
  stageNumber,
  stageName,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Wipe-in animation (two bars closing from top/bottom)
  const wipeProgress = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Text appearance
  const textScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, mass: 0.5 },
  });

  // Stage number bounce
  const numberScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 8, mass: 0.3 },
  });

  // Subtitle fade
  const subtitleOpacity = interpolate(frame, [25, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Stars/sparkle effect
  const sparkles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2 + frame * 0.05;
    const radius = 180 + Math.sin(frame * 0.1 + i) * 20;
    return {
      x: width / 2 + Math.cos(angle) * radius,
      y: height / 2 + Math.sin(angle) * radius,
      opacity: interpolate(
        Math.sin(frame * 0.2 + i * 0.8),
        [-1, 1],
        [0.2, 1]
      ),
    };
  });

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: RETRO_COLORS.bgDark,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Wipe bars */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: `${wipeProgress * 50}%`,
          backgroundColor: RETRO_COLORS.bgMedium,
          borderBottom: `3px solid ${RETRO_COLORS.uiGreen}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: `${wipeProgress * 50}%`,
          backgroundColor: RETRO_COLORS.bgMedium,
          borderTop: `3px solid ${RETRO_COLORS.uiGreen}`,
        }}
      />

      {/* Sparkles */}
      {sparkles.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: s.x,
            top: s.y,
            width: 4,
            height: 4,
            backgroundColor: RETRO_COLORS.uiYellow,
            opacity: s.opacity,
            boxShadow: `0 0 6px ${RETRO_COLORS.uiYellow}`,
          }}
        />
      ))}

      {/* Center content */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          fontFamily,
        }}
      >
        {/* Stage number */}
        <div
          style={{
            fontSize: 64,
            color: RETRO_COLORS.uiYellow,
            textShadow: `0 0 30px ${RETRO_COLORS.uiYellow}, 0 4px 0 ${RETRO_COLORS.uiOrange}`,
            transform: `scale(${numberScale})`,
            marginBottom: 16,
          }}
        >
          STAGE {stageNumber}
        </div>

        {/* Stage name */}
        <div
          style={{
            fontSize: 24,
            color: RETRO_COLORS.uiGreen,
            textShadow: `0 0 15px ${RETRO_COLORS.uiGreen}`,
            transform: `scale(${textScale})`,
            letterSpacing: 4,
          }}
        >
          {stageName}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              fontSize: 14,
              color: RETRO_COLORS.textSecondary,
              marginTop: 20,
              opacity: subtitleOpacity,
              letterSpacing: 2,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* Decorative lines */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 40,
          right: "60%",
          height: 2,
          backgroundColor: RETRO_COLORS.uiGreen,
          opacity: 0.3,
          transform: `translateY(-50%) scaleX(${textScale})`,
          transformOrigin: "right center",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: 40,
          left: "60%",
          height: 2,
          backgroundColor: RETRO_COLORS.uiGreen,
          opacity: 0.3,
          transform: `translateY(-50%) scaleX(${textScale})`,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
};
