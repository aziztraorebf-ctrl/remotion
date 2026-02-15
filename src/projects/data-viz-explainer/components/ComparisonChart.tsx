import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS } from "../config/theme";

interface ComparisonItem {
  label: string;
  value: number;
  color: string;
}

interface ComparisonChartProps {
  items: ComparisonItem[];
  startFrame: number;
  width?: number;
  height?: number;
  barHeight?: number;
  gap?: number;
  maxValue?: number;
  suffix?: string;
  fontFamily?: string;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  items,
  startFrame,
  width = 800,
  height = 300,
  barHeight = 48,
  gap = 24,
  maxValue,
  suffix = "",
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const max = maxValue || Math.max(...items.map((i) => i.value));

  return (
    <div style={{ width, fontFamily }}>
      {items.map((item, index) => {
        const itemStart = startFrame + index * 12;
        const progress = spring({
          frame: frame - itemStart,
          fps,
          config: { damping: 18, mass: 0.6, stiffness: 80 },
        });

        const barW = (item.value / max) * (width - 200) * progress;

        const opacity = interpolate(frame, [itemStart - 5, itemStart + 5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const displayValue = Math.round(item.value * progress);

        return (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: gap,
              opacity,
            }}
          >
            {/* Label */}
            <div
              style={{
                width: 160,
                fontSize: 14,
                color: COLORS.textSecondary,
                fontWeight: 600,
                textAlign: "right",
                paddingRight: 16,
                letterSpacing: 0.5,
              }}
            >
              {item.label}
            </div>

            {/* Bar */}
            <div style={{ flex: 1, position: "relative" }}>
              <div
                style={{
                  height: barHeight,
                  backgroundColor: COLORS.bgCard,
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: barW,
                    height: "100%",
                    backgroundColor: item.color,
                    borderRadius: 6,
                    boxShadow: `0 0 20px ${item.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: 12,
                  }}
                >
                  {barW > 80 && (
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: COLORS.bgPrimary,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {displayValue.toLocaleString("fr-FR")}
                      {suffix}
                    </span>
                  )}
                </div>
              </div>
              {barW <= 80 && (
                <span
                  style={{
                    position: "absolute",
                    left: barW + 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 16,
                    fontWeight: 800,
                    color: item.color,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {displayValue.toLocaleString("fr-FR")}
                  {suffix}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
