import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { COLORS, FONTS, SPRING_BRUT, BORDER } from "../config/theme";

interface BrutalistBarProps {
  value: number;
  maxValue?: number;
  startFrame: number;
  width?: number;
  height?: number;
  fillColor?: string;
  borderColor?: string;
  label?: string;
  showValue?: boolean;
  suffix?: string;
  locale?: string;
}

export const BrutalistBar: React.FC<BrutalistBarProps> = ({
  value,
  maxValue = value,
  startFrame,
  width = 500,
  height = 48,
  fillColor = COLORS.blue,
  borderColor = COLORS.white,
  label,
  showValue = true,
  suffix = "",
  locale = "fr-FR",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const visible = frame >= startFrame;
  if (!visible) return null;

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { ...SPRING_BRUT, mass: 0.8 },
  });

  const fillWidth = (value / maxValue) * width * progress;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {label && (
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 18,
            fontWeight: 400,
            color: COLORS.textPrimary,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          width,
          height,
          border: `${BORDER.width}px ${BORDER.style} ${borderColor}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: fillWidth,
            height: "100%",
            backgroundColor: fillColor,
          }}
        />
        {showValue && (
          <div
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontFamily: FONTS.mono,
              fontSize: 16,
              fontWeight: 700,
              color: COLORS.textPrimary,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {Math.round(value * progress).toLocaleString(locale)}
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
};
