import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { GridSpritesheetAnimator } from "../components/GridSpritesheetAnimator";

// Each test case renders one character animation in isolation
// Purpose: visually verify correct row mappings, animation frames, and display
const SPRITE_TESTS = [
  // --- townsfolk-1 ---
  {
    label: "TF1-Char1 IDLE (row0, 4f)",
    src: "assets/peste-pixel/sprites/townsfolk/townsfolk-1.png",
    cols: 8, rows: 15, fw: 32, fh: 32,
    startRow: 0, frameCount: 4,
  },
  {
    label: "TF1-Char1 WALK-DOWN (row1, 8f)",
    src: "assets/peste-pixel/sprites/townsfolk/townsfolk-1.png",
    cols: 8, rows: 15, fw: 32, fh: 32,
    startRow: 1, frameCount: 8,
  },
  {
    label: "TF1-Char1 WALK-LEFT (row2, 8f)",
    src: "assets/peste-pixel/sprites/townsfolk/townsfolk-1.png",
    cols: 8, rows: 15, fw: 32, fh: 32,
    startRow: 2, frameCount: 8,
  },
  {
    label: "TF1-Char4 IDLE (row11, 4f)",
    src: "assets/peste-pixel/sprites/townsfolk/townsfolk-1.png",
    cols: 8, rows: 15, fw: 32, fh: 32,
    startRow: 11, frameCount: 4,
  },
  {
    label: "TF1-Char4 WALK-DOWN (row12, 8f)",
    src: "assets/peste-pixel/sprites/townsfolk/townsfolk-1.png",
    cols: 8, rows: 15, fw: 32, fh: 32,
    startRow: 12, frameCount: 8,
  },
  // --- townsfolk-2 ---
  {
    label: "TF2-Char1 IDLE (row0, 4f)",
    src: "assets/peste-pixel/sprites/townsfolk/townsfolk-2.png",
    cols: 8, rows: 15, fw: 32, fh: 32,
    startRow: 0, frameCount: 4,
  },
  {
    label: "TF2-Char1 WALK-DOWN (row1, 8f)",
    src: "assets/peste-pixel/sprites/townsfolk/townsfolk-2.png",
    cols: 8, rows: 15, fw: 32, fh: 32,
    startRow: 1, frameCount: 8,
  },
  {
    label: "TF2-Char3 WALK-DOWN (row9, 8f)",
    src: "assets/peste-pixel/sprites/townsfolk/townsfolk-2.png",
    cols: 8, rows: 15, fw: 32, fh: 32,
    startRow: 9, frameCount: 8,
  },
  // --- Walking test: character moves laterally while animating ---
  {
    label: "TF1-Char1 WALK-LEFT + MOVE (row2, 8f)",
    src: "assets/peste-pixel/sprites/townsfolk/townsfolk-1.png",
    cols: 8, rows: 15, fw: 32, fh: 32,
    startRow: 2, frameCount: 8,
    walking: true, walkDirection: -1, // moves left
  },
  {
    label: "TF2-Char1 WALK-LEFT + MOVE (row2, 8f) flipX",
    src: "assets/peste-pixel/sprites/townsfolk/townsfolk-2.png",
    cols: 8, rows: 15, fw: 32, fh: 32,
    startRow: 2, frameCount: 8,
    flipX: true,
    walking: true, walkDirection: 1, // flipped = walks right visually
  },
] as const;

const SCALE = 5; // big enough to see clearly
const COLS = 5; // grid layout
const CELL_W = 320;
const CELL_H = 280;

export const SpriteUnitTest: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#333333" }}>
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 20,
          color: "#FFD700",
          fontFamily: "monospace",
          fontSize: 24,
          fontWeight: "bold",
        }}
      >
        SPRITE UNIT TEST -- frame {frame}
      </div>

      {/* Grid of sprite tests */}
      {SPRITE_TESTS.map((test, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const x = 20 + col * CELL_W;
        const y = 60 + row * CELL_H;

        // Walking offset for walking tests
        const walkX =
          "walking" in test && test.walking
            ? (test.walkDirection ?? 0) * (frame % 120) * 0.8
            : 0;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: CELL_W - 10,
              height: CELL_H - 10,
              border: "1px solid #666",
              borderRadius: 4,
            }}
          >
            {/* Label */}
            <div
              style={{
                color: "#FFFFFF",
                fontFamily: "monospace",
                fontSize: 12,
                padding: "4px 8px",
                background: "rgba(0,0,0,0.6)",
              }}
            >
              {test.label}
            </div>

            {/* Ground line reference */}
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 0,
                right: 0,
                height: 2,
                backgroundColor: "#00FF41",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 4,
                left: 4,
                color: "#00FF41",
                fontFamily: "monospace",
                fontSize: 10,
              }}
            >
              ground line
            </div>

            {/* Character -- anchored: bottom of sprite on ground line */}
            <div
              style={{
                position: "absolute",
                bottom: 22, // 20px ground line + 2px line height
                left: (CELL_W - 10) / 2 - (test.fw * SCALE) / 2 + walkX,
              }}
            >
              <GridSpritesheetAnimator
                src={test.src}
                cols={test.cols}
                rows={test.rows}
                frameWidth={test.fw}
                frameHeight={test.fh}
                displayWidth={test.fw * SCALE}
                displayHeight={test.fh * SCALE}
                startRow={test.startRow}
                frameCount={test.frameCount}
                frameRate={6}
                loop
                flipX={"flipX" in test ? (test.flipX ?? false) : false}
              />
            </div>

            {/* Shadow ellipse */}
            <div
              style={{
                position: "absolute",
                bottom: 16,
                left: (CELL_W - 10) / 2 - 30 + walkX,
                width: 60,
                height: 8,
                background:
                  "radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)",
                borderRadius: "50%",
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
