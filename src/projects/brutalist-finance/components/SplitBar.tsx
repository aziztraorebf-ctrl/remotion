import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { COLORS, FONTS, SPRING_BRUT, BORDER } from "../config/theme";

interface SplitBarProps {
  totalValue: number;
  splitValues: [number, number];
  splitColors: [string, string];
  splitLabels: [string, string];
  startFrame: number;
  splitFrame: number;
  width?: number;
  height?: number;
  borderColor?: string;
  locale?: string;
}

export const SplitBar: React.FC<SplitBarProps> = ({
  totalValue,
  splitValues,
  splitColors,
  splitLabels,
  startFrame,
  splitFrame,
  width = 600,
  height = 56,
  borderColor = COLORS.white,
  locale = "fr-FR",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const visible = frame >= startFrame;
  if (!visible) return null;

  const barProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { ...SPRING_BRUT, mass: 0.8 },
  });

  const splitProgress =
    frame >= splitFrame
      ? spring({
          frame: frame - splitFrame,
          fps,
          config: SPRING_BRUT,
        })
      : 0;

  const ratio1 = splitValues[0] / totalValue;
  const ratio2 = splitValues[1] / totalValue;

  const totalFill = width * barProgress;
  const fill1 = totalFill * (ratio1 + (1 - ratio1) * (1 - splitProgress));
  const fill2 = totalFill - fill1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div
        style={{
          width,
          height,
          border: `${BORDER.width}px ${BORDER.style} ${borderColor}`,
          position: "relative",
          overflow: "hidden",
          display: "flex",
        }}
      >
        <div
          style={{
            width: fill1,
            height: "100%",
            backgroundColor: splitColors[0],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "none",
          }}
        >
          {splitProgress > 0.5 && fill1 > 80 && (
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 14,
                fontWeight: 700,
                color: COLORS.textPrimary,
              }}
            >
              {splitValues[0].toLocaleString(locale)}
            </span>
          )}
        </div>
        {splitProgress > 0 && (
          <div
            style={{
              width: fill2,
              height: "100%",
              backgroundColor: splitColors[1],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "none",
            }}
          >
            {splitProgress > 0.5 && fill2 > 80 && (
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 14,
                  fontWeight: 700,
                  color: COLORS.textPrimary,
                }}
              >
                {splitValues[1].toLocaleString(locale)}
              </span>
            )}
          </div>
        )}
      </div>
      {splitProgress > 0.5 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 14,
              color: splitColors[0],
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {splitLabels[0]}
          </span>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 14,
              color: splitColors[1],
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {splitLabels[1]}
          </span>
        </div>
      )}
    </div>
  );
};
