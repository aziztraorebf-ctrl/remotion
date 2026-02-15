import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONTS, BORDER } from "../config/theme";

interface BlockItem {
  label: string;
  value: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

interface ComparisonBlocksProps {
  items: BlockItem[];
  startFrame: number;
  delay?: number;
  blockWidth?: number;
  blockHeight?: number;
  gap?: number;
}

export const ComparisonBlocks: React.FC<ComparisonBlocksProps> = ({
  items,
  startFrame,
  delay = 10,
  blockWidth = 380,
  blockHeight = 180,
  gap = 24,
}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", gap }}>
      {items.map((item, i) => {
        const visible = frame >= startFrame + i * delay;
        if (!visible) return <div key={i} style={{ width: blockWidth }} />;

        return (
          <div
            key={i}
            style={{
              width: blockWidth,
              height: blockHeight,
              backgroundColor: item.bgColor,
              border: `${BORDER.width}px ${BORDER.style} ${item.borderColor}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 14,
                fontWeight: 400,
                color: item.textColor,
                textTransform: "uppercase",
                letterSpacing: 2,
                opacity: 0.7,
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 42,
                fontWeight: 700,
                color: item.textColor,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {item.value}
            </div>
          </div>
        );
      })}
    </div>
  );
};
