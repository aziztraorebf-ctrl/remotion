import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { GridSpritesheetAnimator } from "./GridSpritesheetAnimator";

interface RatSwarmProps {
  startFrame: number;
  endFrame: number;
  y: number;
  count?: number;
  direction?: "left" | "right";
}

// Rats spritesheet: 160x256, 5 cols x 8 rows, 32x32 per frame
// Row 0 = idle/run animation (5 frames)
const RAT_SRC = "assets/peste-pixel/sprites/rats/rats.png";
const RAT_COLS = 5;
const RAT_ROWS = 8;
const RAT_FRAME_W = 32;
const RAT_FRAME_H = 32;
const RAT_SCALE = 3; // 32 * 3 = 96px display
const RAT_DISPLAY = RAT_FRAME_W * RAT_SCALE;

export const RatSwarm: React.FC<RatSwarmProps> = ({
  startFrame,
  endFrame,
  y,
  count = 5,
  direction = "right",
}) => {
  const frame = useCurrentFrame();

  // Generate fixed positions for each rat (seeded by index)
  const rats = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      offsetX: i * 180 + ((i * 73) % 60),
      speedMult: 0.85 + ((i * 37) % 30) / 100,
      frameOffset: (i * 3) % 5,
    }));
  }, [count]);

  if (frame < startFrame || frame > endFrame) return null;

  const duration = endFrame - startFrame;

  return (
    <>
      {rats.map((rat, i) => {
        const progress = interpolate(
          frame - startFrame,
          [0, duration],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // Travel from off-screen to off-screen
        const totalTravel = 1920 + count * 200;
        const baseX = direction === "right"
          ? -200 - rat.offsetX + progress * totalTravel * rat.speedMult
          : 1920 + rat.offsetX - progress * totalTravel * rat.speedMult;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: baseX,
              top: y,
              zIndex: 12,
            }}
          >
            <GridSpritesheetAnimator
              src={RAT_SRC}
              cols={RAT_COLS}
              rows={RAT_ROWS}
              frameWidth={RAT_FRAME_W}
              frameHeight={RAT_FRAME_H}
              displayWidth={RAT_DISPLAY}
              displayHeight={RAT_DISPLAY}
              startRow={0}
              frameCount={RAT_COLS}
              frameRate={4}
              flipX={direction === "left"}
            />
          </div>
        );
      })}
    </>
  );
};
