import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { RETRO_COLORS, RETRO_FONTS } from "../config/theme";
import { loadFont } from "@remotion/google-fonts/PressStart2P";

const { fontFamily } = loadFont();

interface RetroHUDProps {
  playerName: string;
  level: number;
  levelName: string;
  health: number; // 0-100
  xp: number; // 0-100
  score: number;
  showScore?: boolean;
}

export const RetroHUD: React.FC<RetroHUDProps> = ({
  playerName,
  level,
  levelName,
  health,
  xp,
  score,
  showScore = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animate bars filling
  const healthWidth = interpolate(frame, [0, 30], [0, health], {
    extrapolateRight: "clamp",
  });
  const xpWidth = interpolate(frame, [10, 40], [0, xp], {
    extrapolateRight: "clamp",
  });

  // Score counter animation
  const displayScore = Math.round(
    interpolate(frame, [0, 45], [0, score], { extrapolateRight: "clamp" })
  );

  // Entry animation
  const slideIn = spring({ frame, fps, config: { damping: 15, mass: 0.8 } });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: "20px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        fontFamily,
        zIndex: 10,
        transform: `translateY(${interpolate(slideIn, [0, 1], [-80, 0])}px)`,
      }}
    >
      {/* Left panel: Player info + bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            color: RETRO_COLORS.uiGreen,
            fontSize: 14,
            textShadow: `0 0 10px ${RETRO_COLORS.uiGreen}`,
          }}
        >
          {playerName}
        </div>

        {/* Health bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: RETRO_COLORS.uiRed, fontSize: 10 }}>HP</span>
          <div
            style={{
              width: 200,
              height: 16,
              backgroundColor: RETRO_COLORS.healthBarBg,
              border: `2px solid ${RETRO_COLORS.uiGreen}`,
              position: "relative",
              imageRendering: "pixelated",
            }}
          >
            <div
              style={{
                width: `${healthWidth}%`,
                height: "100%",
                backgroundColor:
                  healthWidth > 50
                    ? RETRO_COLORS.healthBar
                    : healthWidth > 25
                      ? RETRO_COLORS.uiYellow
                      : RETRO_COLORS.uiRed,
                transition: "background-color 0.3s",
              }}
            />
          </div>
        </div>

        {/* XP bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: RETRO_COLORS.uiCyan, fontSize: 10 }}>XP</span>
          <div
            style={{
              width: 200,
              height: 10,
              backgroundColor: RETRO_COLORS.healthBarBg,
              border: `2px solid ${RETRO_COLORS.uiCyan}`,
            }}
          >
            <div
              style={{
                width: `${xpWidth}%`,
                height: "100%",
                backgroundColor: RETRO_COLORS.xpBar,
              }}
            />
          </div>
        </div>
      </div>

      {/* Center: Level */}
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <div
          style={{
            color: RETRO_COLORS.uiYellow,
            fontSize: 12,
            textShadow: `0 0 8px ${RETRO_COLORS.uiYellow}`,
          }}
        >
          STAGE {level}
        </div>
        <div style={{ color: RETRO_COLORS.uiWhite, fontSize: 10 }}>
          {levelName}
        </div>
      </div>

      {/* Right: Score */}
      {showScore && (
        <div style={{ textAlign: "right" }}>
          <div style={{ color: RETRO_COLORS.uiGold, fontSize: 12 }}>SCORE</div>
          <div
            style={{
              color: RETRO_COLORS.textPrimary,
              fontSize: 18,
              textShadow: `0 0 10px ${RETRO_COLORS.uiGold}`,
            }}
          >
            {String(displayScore).padStart(6, "0")}
          </div>
        </div>
      )}
    </div>
  );
};
