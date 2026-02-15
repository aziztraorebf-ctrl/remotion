import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONTS, BORDER } from "../config/theme";

interface Pill {
  label: string;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
}

interface StrategyPillsProps {
  pills: Pill[];
  startFrame: number;
  delay?: number;
  fontSize?: number;
  paddingH?: number;
  paddingV?: number;
  gap?: number;
}

export const StrategyPills: React.FC<StrategyPillsProps> = ({
  pills,
  startFrame,
  delay = 8,
  fontSize = 22,
  paddingH = 24,
  paddingV = 12,
  gap = 16,
}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap }}>
      {pills.map((pill, i) => {
        const visible = frame >= startFrame + i * delay;
        if (!visible) return null;

        return (
          <div
            key={i}
            style={{
              backgroundColor: pill.bgColor ?? COLORS.blue,
              border: `${BORDER.width}px ${BORDER.style} ${pill.borderColor ?? pill.bgColor ?? COLORS.blue}`,
              padding: `${paddingV}px ${paddingH}px`,
              fontFamily: FONTS.display,
              fontSize,
              fontWeight: 700,
              color: pill.textColor ?? COLORS.textDark,
              textTransform: "uppercase",
              letterSpacing: 2,
              lineHeight: 1,
            }}
          >
            {pill.label}
          </div>
        );
      })}
    </div>
  );
};
