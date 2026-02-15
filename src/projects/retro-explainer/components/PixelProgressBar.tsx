import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { RETRO_COLORS } from "../config/theme";
import { loadFont } from "@remotion/google-fonts/PressStart2P";

const { fontFamily } = loadFont();

interface PixelProgressBarProps {
  progress: number; // 0-100 target
  startFrame?: number;
  durationFrames?: number;
  width?: number;
  height?: number;
  label?: string;
  color?: string;
  showPercentage?: boolean;
  segmented?: boolean;
}

export const PixelProgressBar: React.FC<PixelProgressBarProps> = ({
  progress,
  startFrame = 0,
  durationFrames = 30,
  width = 600,
  height = 32,
  label,
  color = RETRO_COLORS.uiGreen,
  showPercentage = true,
  segmented = true,
}) => {
  const frame = useCurrentFrame();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const currentProgress = interpolate(
    relativeFrame,
    [0, durationFrames],
    [0, progress],
    { extrapolateRight: "clamp" }
  );

  const segments = segmented ? 20 : 1;
  const filledSegments = Math.floor((currentProgress / 100) * segments);

  return (
    <div style={{ fontFamily }}>
      {label && (
        <div
          style={{
            fontSize: 12,
            color: RETRO_COLORS.textSecondary,
            marginBottom: 6,
            letterSpacing: 2,
          }}
        >
          {label}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width,
            height,
            backgroundColor: RETRO_COLORS.bgDark,
            border: `2px solid ${color}`,
            display: "flex",
            gap: segmented ? 2 : 0,
            padding: segmented ? 3 : 0,
            boxShadow: `0 0 10px ${color}30`,
          }}
        >
          {segmented
            ? Array.from({ length: segments }, (_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: "100%",
                    backgroundColor:
                      i < filledSegments ? color : "transparent",
                    boxShadow:
                      i < filledSegments ? `0 0 4px ${color}` : "none",
                  }}
                />
              ))
            : (
                <div
                  style={{
                    width: `${currentProgress}%`,
                    height: "100%",
                    backgroundColor: color,
                    boxShadow: `0 0 8px ${color}`,
                  }}
                />
              )}
        </div>
        {showPercentage && (
          <div
            style={{
              fontSize: 14,
              color,
              minWidth: 60,
              textShadow: `0 0 6px ${color}`,
            }}
          >
            {Math.round(currentProgress)}%
          </div>
        )}
      </div>
    </div>
  );
};
