import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
} from "remotion";
import {
  HOOK_SCENE_STARTS,
  HOOK_SCENE_DURATIONS,
  SCENE,
} from "../config/hookTiming";
import { COLORS, CRT_SETTINGS } from "../config/theme";
import { PlagueSpreadMap } from "../components/PlagueSpreadMap";
import {
  MedievalTownBackground,
  TOWN_Y_MIN,
  TOWN_Y_MAX,
  walkableXRange,
} from "../components/MedievalTownBackground";
// Note: TOWN_Y_MIN/MAX used by dScale(), walkableXRange() used by clampToLane()
import { HookTextOverlay } from "../components/HookTextOverlay";
import { CRTOverlay } from "../components/CRTOverlay";
import { PixelLabSprite } from "../components/PixelLabSprite";

// Duration of scenes 1-5 combined (map portion)
const MAP_DURATION =
  HOOK_SCENE_STARTS[SCENE.REFRAME] +
  HOOK_SCENE_DURATIONS[SCENE.REFRAME] -
  HOOK_SCENE_STARTS[SCENE.ISSYK_KUL];

// 2 frames of black between map and town
const BLACK_CUT_FRAMES = 2;

// ============================================================
// PIXELLAB CHARACTER SYSTEM - Lane-based placement
// ============================================================
//
// Characters move in HORIZONTAL LANES at fixed Y positions.
// Each lane has X boundaries derived from the street trapezoid.
// No scatter, no flee. Scene 7 = gradual slowdown to stillness.
// ============================================================

// Animation: one sprite frame every N Remotion frames
const SPRITE_FPS = 5;

// Walk speed in pixels per Remotion frame (slow, contemplative)
const WALK_SPEED = 0.6;

// Depth scale: higher Y (closer to camera) = larger sprite
function dScale(y: number): number {
  const t = Math.max(0, Math.min(1, (y - TOWN_Y_MIN) / (TOWN_Y_MAX - TOWN_Y_MIN)));
  return 0.55 + t * 0.45;
}

// Base upscale for PixelLab 64px sprites
// 2.8 = proportional to the street scene without dominating the background
const BASE_UPSCALE = 2.8;

interface LaneNPC {
  id: string;
  basePath: string;
  animation: string;
  frameCount: number;
  nativeSize: number;
  // Lane Y position (fixed - character stays on this horizontal line)
  laneY: number;
  // Starting X position within the lane
  startX: number;
  // Walk direction: 1 = east, -1 = west, 0 = idle
  walkDir: -1 | 0 | 1;
  // PixelLab direction for the sprite
  facing: "east" | "west" | "south";
}

const PL = "assets/peste-pixel/pixellab/characters";

// 14 NPCs placed in lanes within the street trapezoid.
// Y positions chosen to avoid the fountain (Y ~560-660, center X ~960).
// Back NPCs are placed LEFT or RIGHT of center to avoid overlapping the fountain.
// Duplicate character types at different positions = realistic crowd density.
const LANE_NPCS: LaneNPC[] = [
  // --- BACK LANE (Y ~620-660, BELOW fountain, small sprites) ---
  // Fountain is at ~(960, 560-660). Characters here go LEFT or RIGHT of it.
  {
    id: "monk-1",
    basePath: `${PL}/monk`,
    animation: "walking", frameCount: 6, nativeSize: 64,
    laneY: 630, startX: 750, walkDir: 1, facing: "east",
  },
  {
    id: "noble-1",
    basePath: `${PL}/noble`,
    animation: "walking", frameCount: 6, nativeSize: 64,
    laneY: 670, startX: 1180, walkDir: 0, facing: "south",
  },
  {
    id: "merchant-back",
    basePath: `${PL}/merchant`,
    animation: "walking", frameCount: 6, nativeSize: 64,
    laneY: 660, startX: 750, walkDir: -1, facing: "west",
  },
  // --- MIDDLE-BACK LANE (Y ~700-740) ---
  {
    id: "peasant-man-1",
    basePath: `${PL}/peasant-man`,
    animation: "walking", frameCount: 6, nativeSize: 64,
    laneY: 700, startX: 620, walkDir: 1, facing: "east",
  },
  {
    id: "blacksmith-1",
    basePath: `${PL}/blacksmith`,
    animation: "walking", frameCount: 6, nativeSize: 64,
    laneY: 720, startX: 1200, walkDir: -1, facing: "west",
  },
  {
    id: "peasant-woman-1",
    basePath: `${PL}/peasant-woman`,
    animation: "walking", frameCount: 6, nativeSize: 64,
    laneY: 740, startX: 900, walkDir: 0, facing: "south",
  },
  // --- MIDDLE-FRONT LANE (Y ~770-810) ---
  {
    id: "merchant-2",
    basePath: `${PL}/merchant`,
    animation: "walking", frameCount: 6, nativeSize: 64,
    laneY: 770, startX: 1150, walkDir: 0, facing: "south",
  },
  {
    id: "peasant-man-2",
    basePath: `${PL}/peasant-man`,
    animation: "walking", frameCount: 6, nativeSize: 64,
    laneY: 790, startX: 500, walkDir: 1, facing: "east",
  },
  {
    id: "child-1",
    basePath: `${PL}/child`,
    animation: "walk", frameCount: 6, nativeSize: 48,
    laneY: 800, startX: 850, walkDir: 1, facing: "east",
  },
  {
    id: "monk-2",
    basePath: `${PL}/monk`,
    animation: "walking", frameCount: 6, nativeSize: 64,
    laneY: 810, startX: 1100, walkDir: -1, facing: "south",
  },
  // --- FRONT LANE (Y ~840-910, large sprites, closest to camera) ---
  {
    id: "blacksmith-2",
    basePath: `${PL}/blacksmith`,
    animation: "walking", frameCount: 6, nativeSize: 64,
    laneY: 840, startX: 700, walkDir: -1, facing: "west",
  },
  {
    id: "peasant-woman-2",
    basePath: `${PL}/peasant-woman`,
    animation: "walking", frameCount: 6, nativeSize: 64,
    laneY: 860, startX: 1250, walkDir: -1, facing: "west",
  },
  {
    id: "child-2",
    basePath: `${PL}/child`,
    animation: "walk", frameCount: 6, nativeSize: 48,
    laneY: 880, startX: 480, walkDir: 1, facing: "east",
  },
  {
    id: "peasant-man-3",
    basePath: `${PL}/peasant-man`,
    animation: "walking", frameCount: 6, nativeSize: 64,
    laneY: 910, startX: 1000, walkDir: -1, facing: "west",
  },
];

// Clamp X to stay within the street trapezoid at the given Y
function clampToLane(x: number, y: number): number {
  const { xMin, xMax } = walkableXRange(y);
  return Math.max(xMin, Math.min(xMax, x));
}

// Render one NPC with depth scaling and shadow
function renderLaneNPC(
  npc: LaneNPC,
  x: number,
  y: number,
  isWalking: boolean,
  spriteFps: number,
) {
  const ds = dScale(y);
  const sz = Math.round(npc.nativeSize * BASE_UPSCALE * ds);
  const shadowW = Math.round(sz * 0.8);
  const shadowH = Math.round(sz * 0.18);
  const GROUND_SINK = 4;

  return (
    <div
      key={npc.id}
      style={{
        position: "absolute",
        top: Math.round(y - sz + GROUND_SINK),
        left: Math.round(x - sz / 2),
        zIndex: Math.round(y),
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: -4 + GROUND_SINK,
          left: Math.round((sz - shadowW) / 2),
          width: shadowW,
          height: shadowH,
          background:
            "radial-gradient(ellipse, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, transparent 80%)",
          borderRadius: "50%",
          filter: "blur(2px)",
        }}
      />
      <PixelLabSprite
        basePath={npc.basePath}
        animation={isWalking ? npc.animation : undefined}
        direction={npc.facing}
        frameCount={npc.frameCount}
        frameRate={spriteFps}
        displaySize={sz}
        loop
      />
    </div>
  );
}

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  const isTextScene =
    frame >= HOOK_SCENE_STARTS[SCENE.REFRAME] ||
    frame >= HOOK_SCENE_STARTS[SCENE.REFLEXES];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgAct1 }}>
      {/* Scenes 1-5: Animated plague spread map */}
      <Sequence
        from={HOOK_SCENE_STARTS[SCENE.ISSYK_KUL]}
        durationInFrames={MAP_DURATION}
      >
        <PlagueSpreadMap globalFrame={frame} />
      </Sequence>

      {/* Scene 4: "MOITIE" stamp text */}
      <Sequence
        from={HOOK_SCENE_STARTS[SCENE.MOITIE]}
        durationInFrames={HOOK_SCENE_DURATIONS[SCENE.MOITIE]}
      >
        <HookTextOverlay
          text="MOITIE"
          mode="stamp"
          localFrame={frame - HOOK_SCENE_STARTS[SCENE.MOITIE]}
          color={COLORS.plagueRed}
          fontSize={72}
        />
      </Sequence>

      {/* Scene 5: "MALADIE" strikethrough */}
      <Sequence
        from={HOOK_SCENE_STARTS[SCENE.REFRAME]}
        durationInFrames={HOOK_SCENE_DURATIONS[SCENE.REFRAME]}
      >
        <HookTextOverlay
          text="MALADIE"
          mode="strikethrough"
          localFrame={frame - HOOK_SCENE_STARTS[SCENE.REFRAME]}
          color={COLORS.textPrimary}
          fontSize={56}
        />
      </Sequence>

      {/* 2 frames black cut between map and town */}
      <Sequence
        from={
          HOOK_SCENE_STARTS[SCENE.REFRAME] +
          HOOK_SCENE_DURATIONS[SCENE.REFRAME]
        }
        durationInFrames={BLACK_CUT_FRAMES}
      >
        <AbsoluteFill style={{ backgroundColor: "#000000" }} />
      </Sequence>

      {/* Scene 6: Living town square + 7 NPCs walking in lanes + "HUMAINS" */}
      <Sequence
        from={HOOK_SCENE_STARTS[SCENE.REVEAL]}
        durationInFrames={HOOK_SCENE_DURATIONS[SCENE.REVEAL]}
      >
        <MedievalTownBackground
          localFrame={frame - HOOK_SCENE_STARTS[SCENE.REVEAL]}
          totalDuration={HOOK_SCENE_DURATIONS[SCENE.REVEAL]}
          layeredReveal
        />

        {(() => {
          const localF = frame - HOOK_SCENE_STARTS[SCENE.REVEAL];
          // Characters fade in slightly after the background
          const charOpacity = interpolate(localF, [7, 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // Position each NPC in their lane with horizontal movement
          const positioned = LANE_NPCS.map((npc) => {
            const isW = npc.walkDir !== 0;
            const rawX = npc.startX + (isW ? localF * npc.walkDir * WALK_SPEED : 0);
            const fx = clampToLane(rawX, npc.laneY);
            return { npc, fx, fy: npc.laneY, isW };
          });
          // Y-sort: lower Y (further back) renders first
          positioned.sort((a, b) => a.fy - b.fy);

          return (
            <div style={{ opacity: charOpacity }}>
              {positioned.map(({ npc, fx, fy, isW }) =>
                renderLaneNPC(npc, fx, fy, isW, SPRITE_FPS),
              )}
            </div>
          );
        })()}

        <HookTextOverlay
          text="HUMAINS"
          mode="stamp"
          localFrame={Math.max(0, frame - HOOK_SCENE_STARTS[SCENE.REVEAL] - 15)}
          color={COLORS.gold}
          fontSize={64}
          position="bottom-center"
        />
      </Sequence>

      {/* Scene 7: Same town, characters gradually slow to stillness,
          scene darkens, typewriter text, fade to black.
          NO scatter, NO flee. The script says "les memes reflexes reviennent"
          -- this is philosophical reflection, not panic. */}
      <Sequence
        from={HOOK_SCENE_STARTS[SCENE.REFLEXES]}
        durationInFrames={HOOK_SCENE_DURATIONS[SCENE.REFLEXES]}
      >
        {(() => {
          const localF = frame - HOOK_SCENE_STARTS[SCENE.REFLEXES];
          const dur = HOOK_SCENE_DURATIONS[SCENE.REFLEXES];
          const scene6Dur = HOOK_SCENE_DURATIONS[SCENE.REVEAL];

          // Gradual darkening: starts subtle, becomes heavy
          const darken = interpolate(localF, [0, dur * 0.3, dur], [0, 0.2, 0.75], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // Characters fade out in the last third
          const charFade = interpolate(localF, [dur * 0.6, dur * 0.9], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // Speed multiplier: starts at 1.0 (normal), decelerates to 0 (frozen)
          const speedMult = interpolate(localF, [0, dur * 0.5, dur * 0.75], [1, 0.3, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // Sprite animation slows down too (fewer frame updates)
          const slowFps = Math.max(1, Math.round(SPRITE_FPS / Math.max(0.15, speedMult)));
          const isStill = speedMult < 0.05;

          // Each NPC continues from where they ended in scene 6,
          // but their movement decelerates smoothly
          const positioned = LANE_NPCS.map((npc) => {
            const isW = npc.walkDir !== 0;
            // Position at end of scene 6
            const s6EndX = npc.startX + (isW ? scene6Dur * npc.walkDir * WALK_SPEED : 0);
            // Additional movement in scene 7, decelerating
            const s7Offset = isW
              ? npc.walkDir * WALK_SPEED * localF * speedMult
              : 0;
            const rawX = s6EndX + s7Offset;
            const fx = clampToLane(rawX, npc.laneY);
            return { npc, fx, fy: npc.laneY, isW: isW && !isStill };
          });
          positioned.sort((a, b) => a.fy - b.fy);

          return (
            <>
              <MedievalTownBackground
                localFrame={scene6Dur + localF}
                totalDuration={scene6Dur + dur}
                darkenOverlay={darken}
              />

              <div style={{ opacity: charFade }}>
                {positioned.map(({ npc, fx, fy, isW }) =>
                  renderLaneNPC(npc, fx, fy, isW, slowFps),
                )}
              </div>

              {/* Text MUST be above all sprites (zIndex > any NPC Y value) */}
              <AbsoluteFill style={{ zIndex: 9999, pointerEvents: "none" }}>
                <HookTextOverlay
                  text="LES MEMES REFLEXES"
                  mode="typewriter"
                  localFrame={Math.max(0, localF - 15)}
                  color={COLORS.textPrimary}
                  fontSize={48}
                  position="center"
                />
              </AbsoluteFill>
            </>
          );
        })()}
      </Sequence>

      <CRTOverlay
        scanlineOpacity={
          isTextScene
            ? CRT_SETTINGS.scanlineOpacity * 0.55
            : CRT_SETTINGS.scanlineOpacity
        }
      />
    </AbsoluteFill>
  );
};
