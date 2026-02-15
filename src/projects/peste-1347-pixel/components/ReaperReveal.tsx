import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SpritesheetAnimator } from "./SpriteAnimator";

interface ReaperRevealProps {
  startFrame: number;
  duration?: number;
}

// PassiveIdleReaper-Sheet.png: 240x48, 5 frames horizontal, 48x48 each
const REAPER_SRC = "assets/peste-pixel/sprites/reaper/PassiveIdleReaper-Sheet.png";
const REAPER_FRAMES = 5;
const REAPER_FRAME_W = 48;
const REAPER_FRAME_H = 48;
const REAPER_SCALE = 7; // 48 * 7 = 336px display

export const ReaperReveal: React.FC<ReaperRevealProps> = ({
  startFrame,
  duration = 60,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const elapsed = frame - startFrame;

  if (elapsed < 0 || elapsed > duration + 15) return null;

  // Spring in
  const revealScale = spring({
    frame: Math.max(0, elapsed),
    fps,
    config: { mass: 0.8, damping: 8, stiffness: 120 },
  });

  // Fade out in last 15 frames
  const fadeOut = interpolate(
    elapsed,
    [duration - 15, duration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const displayW = REAPER_FRAME_W * REAPER_SCALE;
  const displayH = REAPER_FRAME_H * REAPER_SCALE;

  return (
    <div
      style={{
        position: "absolute",
        left: width / 2 - displayW / 2,
        top: height / 2 - displayH / 2 - 40,
        transform: `scale(${revealScale})`,
        transformOrigin: "center center",
        opacity: fadeOut,
        zIndex: 18,
      }}
    >
      <SpritesheetAnimator
        src={REAPER_SRC}
        frameCount={REAPER_FRAMES}
        frameWidth={REAPER_FRAME_W}
        frameHeight={REAPER_FRAME_H}
        displayWidth={displayW}
        displayHeight={displayH}
        frameRate={8}
        loop
      />
    </div>
  );
};
