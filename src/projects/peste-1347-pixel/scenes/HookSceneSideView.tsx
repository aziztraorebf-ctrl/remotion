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
  SideViewBackground,
  LANE_A_Y,
  LANE_B_Y,
  LANE_C_Y,
} from "../components/SideViewBackground";
import { HookTextOverlay } from "../components/HookTextOverlay";
import { CRTOverlay } from "../components/CRTOverlay";
import { PixelLabSprite } from "../components/PixelLabSprite";
import {
  computeAnchoredTop,
  computeDisplaySize,
  SIDEVIEW_DEBUG,
  SIDEVIEW_LAYER_Z,
  wrapScreenX,
} from "../config/sideViewFoundation";
import { SIDEVIEW_CHARACTER_ASSETS } from "../config/sideViewAssets";
import { SideViewDebugOverlay } from "../components/SideViewDebugOverlay";

// ============================================================
// HookSceneSideView - Side-view cinematic parallax version
//
// Replaces the old top-down HookScene for scenes 6-7.
// Scenes 1-5 (map) remain unchanged.
// Scene 6: Medieval street, 5-6 NPCs walking, "HUMAINS" stamp
// Scene 7: Same street darkens, NPCs slow to stillness,
//          "LES MEMES REFLEXES" typewriter, fade to black
// ============================================================

// Duration of scenes 1-5 combined (map portion)
const MAP_DURATION =
  HOOK_SCENE_STARTS[SCENE.REFRAME] +
  HOOK_SCENE_DURATIONS[SCENE.REFRAME] -
  HOOK_SCENE_STARTS[SCENE.ISSYK_KUL];

// Black cut between map and town
const BLACK_CUT_FRAMES = 2;

// Animation: one sprite frame every N Remotion frames
const SPRITE_FPS = 5;

// Walk speed in pixels per Remotion frame
const WALK_SPEED = 0.8;

// ============================================================
// NPC Definition - Side-View Lane System
// ============================================================

interface SideViewNPC {
  id: string;
  characterId: keyof typeof SIDEVIEW_CHARACTER_ASSETS;
  // Which lane (Y position)
  laneY: number;
  // Starting X position
  startX: number;
  // Walk direction: 1 = right (east), -1 = left (west), 0 = idle
  walkDir: -1 | 0 | 1;
  // Scale override (for child = smaller)
  scaleOverride?: number;
}

// 5 NPCs across 3 lanes, 1 unique character type per slot.
// Characters: merchant, monk, peasant-man, peasant-woman (no duplicates).
// Walk directions alternate to keep screen populated and feel natural.
// NPCs distributed evenly across the 1920px screen width.
// walkDir=1 starts left, walkDir=-1 starts right -> they walk toward center first.
// wrapX() ensures infinite loop across screen edges (no wall-walking).
const SIDE_VIEW_NPCS: SideViewNPC[] = [
  // --- LANE A (Y=790, far, slightly smaller) ---
  {
    id: "merchant-1",
    characterId: "merchant",
    laneY: LANE_A_Y,
    startX: 200,   // starts left, walks right
    walkDir: 1,
  },
  {
    id: "monk-1",
    characterId: "monk",
    laneY: LANE_A_Y,
    startX: 1200,  // starts right-center, walks left
    walkDir: -1,
  },
  // --- LANE B (Y=820, middle, standard) ---
  {
    id: "peasant-man-1",
    characterId: "peasantMan",
    laneY: LANE_B_Y,
    startX: 700,   // starts center, walks right
    walkDir: 1,
  },
  // --- LANE C (Y=850, near, slightly larger) ---
  {
    id: "peasant-woman-1",
    characterId: "peasantWoman",
    laneY: LANE_C_Y,
    startX: 400,   // starts left-center, walks right
    walkDir: 1,
  },
  {
    id: "merchant-2",
    characterId: "merchant",
    laneY: LANE_C_Y,
    startX: 1500,  // starts far right, walks left
    walkDir: -1,
  },
];

// Render one side-view NPC with lane scaling and shadow
function renderSideNPC(
  npc: SideViewNPC,
  x: number,
  isWalking: boolean,
  spriteFps: number,
  opacity: number = 1,
) {
  const asset = SIDEVIEW_CHARACTER_ASSETS[npc.characterId];
  const sz = computeDisplaySize(asset.nativeSize, npc.laneY, npc.scaleOverride);
  const shadowW = Math.round(sz * 0.7);
  const shadowH = Math.round(sz * 0.12);

  // Side-view: character faces the direction they walk
  // walkDir=1 -> east (right), walkDir=-1 -> use east sprite + flipX
  // walkDir=0 -> east static (idle facing right)
  const useFlipX = npc.walkDir === -1;
  const direction = asset.direction;
  const top = computeAnchoredTop(npc.laneY, sz, asset.footAnchorY);

  return (
    <div
      key={npc.id}
      style={{
        position: "absolute",
        // Anchor feet to laneY via manifest-driven footAnchorY.
        top,
        left: Math.round(x - sz / 2),
        // Z-sort: laneY direct (no opacity wrapper = no stacking context pollution)
        // LANE_A_Y=790 < BUILDING_Z_INDEX=800 < LANE_B_Y=820 < LANE_C_Y=850
        zIndex: Math.round(npc.laneY),
        opacity,
        // Drop-shadow for readability against background
        filter: "drop-shadow(0 0 3px rgba(0,0,0,0.95))",
      }}
    >
      {/* Ground shadow - positioned at foot level (sz * foot_y) */}
      <div
        style={{
          position: "absolute",
          top: Math.round(sz * asset.footAnchorY) - Math.round(shadowH / 2),
          left: Math.round((sz - shadowW) / 2),
          width: shadowW,
          height: shadowH,
          background:
            "radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 60%, transparent 80%)",
          borderRadius: "50%",
          filter: "blur(2px)",
        }}
      />
      <PixelLabSprite
        basePath={asset.basePath}
        animation={isWalking ? asset.defaultAnimation : undefined}
        direction={direction}
        frameCount={asset.frameCount}
        frameRate={spriteFps}
        displaySize={sz}
        flipX={useFlipX}
        loop
      />
    </div>
  );
}

export const HookSceneSideView: React.FC = () => {
  const frame = useCurrentFrame();

  const isTextScene =
    frame >= HOOK_SCENE_STARTS[SCENE.REFRAME] ||
    frame >= HOOK_SCENE_STARTS[SCENE.REFLEXES];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgAct1 }}>
      {/* Scenes 1-5: Animated plague spread map (unchanged) */}
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

      {/* Black cut between map and town */}
      <Sequence
        from={
          HOOK_SCENE_STARTS[SCENE.REFRAME] +
          HOOK_SCENE_DURATIONS[SCENE.REFRAME]
        }
        durationInFrames={BLACK_CUT_FRAMES}
      >
        <AbsoluteFill style={{ backgroundColor: "#000000" }} />
      </Sequence>

      {/* Scene 6: Side-view medieval street + walking NPCs + "HUMAINS" */}
      <Sequence
        from={HOOK_SCENE_STARTS[SCENE.REVEAL] + BLACK_CUT_FRAMES}
        durationInFrames={HOOK_SCENE_DURATIONS[SCENE.REVEAL] - BLACK_CUT_FRAMES}
      >
        <SideViewBackground
          localFrame={frame - HOOK_SCENE_STARTS[SCENE.REVEAL] - BLACK_CUT_FRAMES}
          totalDuration={HOOK_SCENE_DURATIONS[SCENE.REVEAL] - BLACK_CUT_FRAMES}
          fadeInFrames={8}
        />

        {(() => {
          const localF = frame - HOOK_SCENE_STARTS[SCENE.REVEAL] - BLACK_CUT_FRAMES;
          // Characters fade in after the background
          const charOpacity = interpolate(localF, [8, 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // Position each NPC with horizontal movement
          const positioned = SIDE_VIEW_NPCS.map((npc) => {
            const isW = npc.walkDir !== 0;
            const rawX =
              npc.startX + (isW ? localF * npc.walkDir * WALK_SPEED : 0);
            return { npc, x: wrapScreenX(rawX), isW };
          });
          // Sort by lane Y for proper z-ordering
          positioned.sort((a, b) => a.npc.laneY - b.npc.laneY);

          return (
            <>
              {positioned.map(({ npc, x, isW }) =>
                renderSideNPC(npc, x, isW, SPRITE_FPS, charOpacity),
              )}
              <SideViewDebugOverlay
                enabled={SIDEVIEW_DEBUG}
                npcs={positioned.map(({ npc, x }) => {
                  const asset = SIDEVIEW_CHARACTER_ASSETS[npc.characterId];
                  const sz = computeDisplaySize(
                    asset.nativeSize,
                    npc.laneY,
                    npc.scaleOverride,
                  );
                  const top = computeAnchoredTop(npc.laneY, sz, asset.footAnchorY);
                  return {
                    id: npc.id,
                    x,
                    laneY: npc.laneY,
                    footY: top + sz * asset.footAnchorY,
                    zIndex: Math.round(npc.laneY),
                  };
                })}
              />
            </>
          );
        })()}

        <HookTextOverlay
          text="HUMAINS"
          mode="stamp"
          localFrame={Math.max(
            0,
            frame - HOOK_SCENE_STARTS[SCENE.REVEAL] - BLACK_CUT_FRAMES - 15,
          )}
          color={COLORS.gold}
          fontSize={64}
          position="bottom-center"
        />
      </Sequence>

      {/* Scene 7: Same street darkens, NPCs decelerate, typewriter text */}
      <Sequence
        from={HOOK_SCENE_STARTS[SCENE.REFLEXES]}
        durationInFrames={HOOK_SCENE_DURATIONS[SCENE.REFLEXES]}
      >
        {(() => {
          const localF = frame - HOOK_SCENE_STARTS[SCENE.REFLEXES];
          const dur = HOOK_SCENE_DURATIONS[SCENE.REFLEXES];
          const scene6Dur = HOOK_SCENE_DURATIONS[SCENE.REVEAL];

          // Gradual darkening
          const darken = interpolate(
            localF,
            [0, dur * 0.3, dur],
            [0, 0.2, 0.75],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          // Characters fade out in the last third
          const charFade = interpolate(
            localF,
            [dur * 0.6, dur * 0.9],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          // Speed multiplier: 1.0 -> 0 (frozen)
          const speedMult = interpolate(
            localF,
            [0, dur * 0.5, dur * 0.75],
            [1, 0.3, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          // Sprite animation slows down too
          const slowFps = Math.max(
            1,
            Math.round(SPRITE_FPS / Math.max(0.15, speedMult)),
          );
          const isStill = speedMult < 0.05;

          // NPCs continue from scene 6 end position, decelerating
          const positioned = SIDE_VIEW_NPCS.map((npc) => {
            const isW = npc.walkDir !== 0;
            // Position at end of scene 6
            const s6EndX =
              npc.startX + (isW ? scene6Dur * npc.walkDir * WALK_SPEED : 0);
            // Additional movement in scene 7, decelerating
            const s7Offset = isW
              ? npc.walkDir * WALK_SPEED * localF * speedMult
              : 0;
            const rawX = s6EndX + s7Offset;
            return { npc, x: wrapScreenX(rawX), isW: isW && !isStill };
          });
          positioned.sort((a, b) => a.npc.laneY - b.npc.laneY);

          return (
            <>
              <SideViewBackground
                localFrame={scene6Dur + localF}
                totalDuration={scene6Dur + dur}
                darkenOverlay={darken}
              />

              {positioned.map(({ npc, x, isW }) =>
                renderSideNPC(npc, x, isW, slowFps, charFade),
              )}
              <SideViewDebugOverlay
                enabled={SIDEVIEW_DEBUG}
                npcs={positioned.map(({ npc, x }) => {
                  const asset = SIDEVIEW_CHARACTER_ASSETS[npc.characterId];
                  const sz = computeDisplaySize(
                    asset.nativeSize,
                    npc.laneY,
                    npc.scaleOverride,
                  );
                  const top = computeAnchoredTop(npc.laneY, sz, asset.footAnchorY);
                  return {
                    id: npc.id,
                    x,
                    laneY: npc.laneY,
                    footY: top + sz * asset.footAnchorY,
                    zIndex: Math.round(npc.laneY),
                  };
                })}
              />

              {/* Text above all sprites */}
              <AbsoluteFill
                style={{ zIndex: SIDEVIEW_LAYER_Z.textOverlay, pointerEvents: "none" }}
              >
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
