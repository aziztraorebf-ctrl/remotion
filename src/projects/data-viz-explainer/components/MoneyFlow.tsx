import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS } from "../config/theme";

interface Bill {
  startX: number;
  startY: number;
  delay: number;
  speed: number;
  rotation: number;
  size: number;
}

interface MoneyFlowProps {
  startFrame: number;
  count?: number;
  targetX?: number;
  targetY?: number;
  sourceX?: number;
  sourceY?: number;
}

export const MoneyFlow: React.FC<MoneyFlowProps> = ({
  startFrame,
  count = 12,
  targetX = 1600,
  targetY = 400,
  sourceX = 400,
  sourceY = 500,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bills = useMemo<Bill[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const hash = Math.sin(i * 317.1 + 42) * 43758.5;
      const h2 = Math.sin(i * 523.7 + 42) * 13758.3;
      const h3 = Math.sin(i * 731.3 + 42) * 23421.6;
      return {
        startX: sourceX + ((hash - Math.floor(hash)) - 0.5) * 200,
        startY: sourceY + ((h2 - Math.floor(h2)) - 0.5) * 100,
        delay: i * 4,
        speed: 0.8 + (h3 - Math.floor(h3)) * 0.4,
        rotation: ((hash - Math.floor(hash)) - 0.5) * 40,
        size: 28 + (h2 - Math.floor(h2)) * 12,
      };
    });
  }, [count, sourceX, sourceY]);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* Bank silhouette at target */}
      <svg
        style={{
          position: "absolute",
          left: targetX - 50,
          top: targetY - 60,
        }}
        width="100"
        height="80"
        viewBox="0 0 100 80"
      >
        {/* Pillars */}
        <rect x="10" y="25" width="10" height="45" fill={COLORS.redDark} opacity={0.6} rx="1" />
        <rect x="35" y="25" width="10" height="45" fill={COLORS.redDark} opacity={0.6} rx="1" />
        <rect x="55" y="25" width="10" height="45" fill={COLORS.redDark} opacity={0.6} rx="1" />
        <rect x="80" y="25" width="10" height="45" fill={COLORS.redDark} opacity={0.6} rx="1" />
        {/* Roof triangle */}
        <polygon points="50,0 -5,25 105,25" fill={COLORS.red} opacity={0.7} />
        {/* Base */}
        <rect x="0" y="70" width="100" height="10" fill={COLORS.redDark} opacity={0.6} rx="1" />
        {/* EUR text */}
        <text
          x="50"
          y="55"
          textAnchor="middle"
          fontSize="16"
          fontWeight="800"
          fill={COLORS.red}
          fontFamily="Inter"
          opacity={0.8}
        >
          BANQUE
        </text>
      </svg>

      {/* Flying bills */}
      {bills.map((bill, i) => {
        const billFrame = frame - startFrame - bill.delay;
        if (billFrame < 0) return null;

        const cycleDuration = 50 / bill.speed;
        const cycleFrame = billFrame % cycleDuration;
        const progress = cycleFrame / cycleDuration;

        const x = interpolate(progress, [0, 1], [bill.startX, targetX]);
        const y = interpolate(progress, [0, 1], [bill.startY, targetY]);

        // Arc path - bills fly in a curve
        const arcY = y - Math.sin(progress * Math.PI) * 80;

        const opacity = interpolate(
          progress,
          [0, 0.1, 0.85, 1],
          [0, 0.9, 0.9, 0]
        );

        const rot = bill.rotation + progress * 360;
        const scale = interpolate(progress, [0, 0.5, 1], [0.6, 1, 0.3]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: arcY,
              opacity,
              transform: `rotate(${rot}deg) scale(${scale})`,
            }}
          >
            {/* Simple bill representation */}
            <svg width={bill.size} height={bill.size * 0.6} viewBox="0 0 40 24">
              <rect
                x="0"
                y="0"
                width="40"
                height="24"
                rx="3"
                fill={COLORS.green}
                opacity={0.9}
              />
              <rect
                x="2"
                y="2"
                width="36"
                height="20"
                rx="2"
                fill="none"
                stroke={COLORS.greenDark}
                strokeWidth="1"
              />
              <text
                x="20"
                y="16"
                textAnchor="middle"
                fontSize="11"
                fontWeight="800"
                fill={COLORS.bgPrimary}
                fontFamily="Inter"
              >
                EUR
              </text>
            </svg>
          </div>
        );
      })}
    </div>
  );
};
