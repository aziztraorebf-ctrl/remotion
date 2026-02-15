import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { RETRO_COLORS } from "../config/theme";

interface RetroBackgroundProps {
  variant?: "city" | "grid" | "stars";
  scrollSpeed?: number;
}

export const RetroBackground: React.FC<RetroBackgroundProps> = ({
  variant = "city",
  scrollSpeed = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const scrollOffset = frame * scrollSpeed;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        backgroundColor: RETRO_COLORS.bgDark,
        overflow: "hidden",
      }}
    >
      {/* Stars layer (far) */}
      {variant !== "grid" && (
        <div style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 60 }, (_, i) => {
            const x = ((i * 137.5 + scrollOffset * 0.2) % (width + 20)) - 10;
            const y = (i * 97.3) % height;
            const size = (i % 3) + 1;
            const twinkle = interpolate(
              Math.sin(frame * 0.1 + i * 2.3),
              [-1, 1],
              [0.3, 1]
            );
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: size,
                  height: size,
                  backgroundColor: RETRO_COLORS.uiWhite,
                  opacity: twinkle * 0.6,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Grid floor (for "grid" and "city" variants) */}
      {(variant === "grid" || variant === "city") && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "35%",
            perspective: 400,
            perspectiveOrigin: "50% 0%",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "200%",
              height: "200%",
              transform: `rotateX(60deg) translateY(${scrollOffset % 40}px)`,
              transformOrigin: "50% 0%",
              backgroundImage: `
                linear-gradient(${RETRO_COLORS.uiGreen}20 1px, transparent 1px),
                linear-gradient(90deg, ${RETRO_COLORS.uiGreen}20 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
              marginLeft: "-50%",
            }}
          />
        </div>
      )}

      {/* City skyline (for "city" variant) */}
      {variant === "city" && (
        <div
          style={{
            position: "absolute",
            bottom: "30%",
            left: 0,
            right: 0,
            height: 200,
          }}
        >
          {/* Buildings - pixel rectangles */}
          {[
            { x: 50, w: 80, h: 120 },
            { x: 160, w: 60, h: 180 },
            { x: 240, w: 100, h: 90 },
            { x: 380, w: 70, h: 150 },
            { x: 480, w: 90, h: 110 },
            { x: 600, w: 50, h: 170 },
            { x: 680, w: 110, h: 80 },
            { x: 820, w: 60, h: 140 },
            { x: 910, w: 80, h: 100 },
            { x: 1020, w: 70, h: 160 },
            { x: 1120, w: 90, h: 90 },
            { x: 1240, w: 60, h: 130 },
            { x: 1330, w: 100, h: 110 },
            { x: 1460, w: 80, h: 170 },
            { x: 1570, w: 70, h: 95 },
            { x: 1670, w: 90, h: 145 },
            { x: 1790, w: 60, h: 120 },
          ].map((b, i) => {
            const shiftX =
              ((b.x - scrollOffset * (0.3 + (i % 3) * 0.1)) % (width + 200)) -
              100;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: shiftX,
                  width: b.w,
                  height: b.h,
                  backgroundColor: RETRO_COLORS.bgMedium,
                  borderTop: `2px solid ${RETRO_COLORS.uiGreen}15`,
                  borderLeft: `1px solid ${RETRO_COLORS.uiGreen}10`,
                  borderRight: `1px solid ${RETRO_COLORS.uiGreen}10`,
                }}
              >
                {/* Windows */}
                {Array.from(
                  { length: Math.floor(b.h / 25) * Math.floor(b.w / 25) },
                  (_, j) => {
                    const col = j % Math.floor(b.w / 25);
                    const row = Math.floor(j / Math.floor(b.w / 25));
                    const isLit =
                      Math.sin(i * 7 + j * 13 + frame * 0.02) > 0.3;
                    return (
                      <div
                        key={j}
                        style={{
                          position: "absolute",
                          left: 8 + col * 25,
                          top: 8 + row * 25,
                          width: 10,
                          height: 12,
                          backgroundColor: isLit
                            ? RETRO_COLORS.uiYellow
                            : RETRO_COLORS.bgDark,
                          opacity: isLit ? 0.6 : 0.3,
                          boxShadow: isLit
                            ? `0 0 4px ${RETRO_COLORS.uiYellow}40`
                            : "none",
                        }}
                      />
                    );
                  }
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Grid-only: horizontal scan line */}
      {variant === "grid" && (
        <div
          style={{
            position: "absolute",
            top: (frame * 2) % height,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: RETRO_COLORS.uiGreen,
            opacity: 0.15,
            boxShadow: `0 0 20px ${RETRO_COLORS.uiGreen}40`,
          }}
        />
      )}
    </div>
  );
};
