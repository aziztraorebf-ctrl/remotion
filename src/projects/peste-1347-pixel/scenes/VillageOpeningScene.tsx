import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
} from "remotion";
import { PixelLabSprite } from "../components/PixelLabSprite";
import {
  computeAnchoredTop,
  computeDisplaySize,
  wrapScreenX,
} from "../config/sideViewFoundation";
import { SIDEVIEW_CHARACTER_ASSETS } from "../config/sideViewAssets";

// ============================================================
// VillageOpeningScene
//
// Scène d'ouverture AVANT la Peste. Village médiéval vivant,
// journée ensoleillée, 1347. Joie et normalité.
// Durée : 360 frames (12s @ 30fps)
// ============================================================

const SCENE_DURATION = 360;
const SPRITE_FPS = 6;

// Ground Y position (feet of NPCs in nearest lane)
const GROUND_Y = 900;
// Mid-lane Y
const MID_LANE_Y = 860;
// Far-lane Y
const FAR_LANE_Y = 820;

// Camera pan: slow drift right over 12s
const PAN_TOTAL_PX = 280;

// Building scale: native px * SCALE = display px
// Buildings are 160-200px native, we want ~400-500px on screen
const BUILDING_SCALE = 2.8;

// Building bottom anchored at ground Y
function buildingTop(nativeH: number): number {
  return GROUND_Y - nativeH * BUILDING_SCALE;
}

// NPC definitions
interface SceneNPC {
  id: string;
  characterId: keyof typeof SIDEVIEW_CHARACTER_ASSETS;
  laneY: number;
  startX: number;
  walkDir: -1 | 1;
  walkSpeed: number;
}

const SCENE_NPCS: SceneNPC[] = [
  {
    id: "merchant-1",
    characterId: "merchant",
    laneY: FAR_LANE_Y,
    startX: 300,
    walkDir: 1,
    walkSpeed: 1.4,
  },
  {
    id: "monk-1",
    characterId: "monk",
    laneY: FAR_LANE_Y,
    startX: 1300,
    walkDir: -1,
    walkSpeed: 0.9,
  },
  {
    id: "peasant-man-1",
    characterId: "peasantMan",
    laneY: MID_LANE_Y,
    startX: 800,
    walkDir: 1,
    walkSpeed: 1.2,
  },
  {
    id: "peasant-woman-1",
    characterId: "peasantWoman",
    laneY: GROUND_Y,
    startX: 500,
    walkDir: -1,
    walkSpeed: 1.0,
  },
  {
    id: "child-1",
    characterId: "child",
    laneY: GROUND_Y,
    startX: 1100,
    walkDir: 1,
    // Child runs faster, more energetic
    walkSpeed: 2.0,
  },
];

// Building layout: X position, asset path, native dimensions
const BLDG_BASE = "assets/peste-pixel/pixellab/buildings-test";

const BUILDINGS = [
  {
    id: "hut-left",
    path: `${BLDG_BASE}/hut-peasant-side.png`,
    nativeW: 120,
    nativeH: 160,
    x: 60,
    layer: "mid",
  },
  {
    id: "house-timber",
    path: `${BLDG_BASE}/house-side-test.png`,
    nativeW: 160,
    nativeH: 300,
    x: 360,
    layer: "front",
  },
  {
    id: "tavern",
    path: `${BLDG_BASE}/tavern-side.png`,
    nativeW: 200,
    nativeH: 260,
    x: 750,
    layer: "front",
  },
  {
    id: "house-stone",
    path: `${BLDG_BASE}/house-stone-side.png`,
    nativeW: 160,
    nativeH: 240,
    x: 1180,
    layer: "mid",
  },
  {
    id: "hut-right",
    path: `${BLDG_BASE}/hut-peasant-side.png`,
    nativeW: 120,
    nativeH: 160,
    x: 1520,
    layer: "mid",
  },
  {
    id: "house-timber-2",
    path: `${BLDG_BASE}/house-side-test.png`,
    nativeW: 160,
    nativeH: 300,
    x: 1760,
    layer: "front",
  },
];

// Sky: daytime gradient, warm and bright
const SKY_GRADIENT =
  "linear-gradient(180deg, #5B8FD4 0%, #7FB8E8 40%, #B8D9F2 70%, #E8C882 100%)";

// Ground cobblestone color (complements the tileset)
const GROUND_COLOR = "#6B5E4A";

// Text overlay timing
const TITLE_IN_FRAME = 20;
const TITLE_OUT_FRAME = 110;

export const VillageOpeningScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera pan spring: smooth start, constant drift
  const panProgress = interpolate(frame, [0, SCENE_DURATION], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const panX = panProgress * PAN_TOTAL_PX;

  // Scene fade in
  const fadeIn = spring({
    frame,
    fps,
    config: { damping: 40, stiffness: 120 },
    from: 0,
    to: 1,
  });

  // Title overlay opacity
  const titleOpacity = interpolate(
    frame,
    [TITLE_IN_FRAME, TITLE_IN_FRAME + 15, TITLE_OUT_FRAME - 15, TITLE_OUT_FRAME],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Sun rays subtle overlay (top-right warm glow)
  const sunGlowOpacity = interpolate(frame, [0, 60], [0, 0.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      {/* === LAYER 1: SKY === */}
      <AbsoluteFill style={{ background: SKY_GRADIENT }} />

      {/* === LAYER 2: SUN GLOW (top-right) === */}
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -200,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,220,100,0.6) 0%, rgba(255,200,60,0.2) 40%, transparent 70%)",
          opacity: sunGlowOpacity,
          pointerEvents: "none",
        }}
      />

      {/* === LAYER 3: BUILDINGS (with parallax) === */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${-panX * 0.8}px)`,
        }}
      >
        {BUILDINGS.map((b) => {
          const dispW = Math.round(b.nativeW * BUILDING_SCALE);
          const dispH = Math.round(b.nativeH * BUILDING_SCALE);
          const top = buildingTop(b.nativeH);
          const zIndex = b.layer === "front" ? 200 : 150;
          return (
            <Img
              key={b.id}
              src={staticFile(b.path)}
              style={{
                position: "absolute",
                left: b.x,
                top,
                width: dispW,
                height: dispH,
                imageRendering: "pixelated",
                zIndex,
              }}
            />
          );
        })}
      </div>

      {/* === LAYER 4: GROUND === */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1080 - GROUND_Y + 20,
          background: GROUND_COLOR,
          zIndex: 180,
        }}
      />

      {/* === LAYER 5: COBBLESTONE TILESET (ground surface) === */}
      <div
        style={{
          position: "absolute",
          top: GROUND_Y - 32,
          left: -panX,
          // Extend wider than screen for pan
          width: 1920 + PAN_TOTAL_PX + 64,
          height: 48,
          backgroundImage: `url(${staticFile("assets/peste-pixel/pixellab/tilesets/cobblestone-sideview.png")})`,
          // Tile the 64x64 spritesheet (showing top row = platform top tile)
          // We display it as a repeating strip using background-size
          backgroundRepeat: "repeat-x",
          backgroundSize: "64px 64px",
          backgroundPosition: "0 -16px",
          imageRendering: "pixelated",
          zIndex: 190,
        }}
      />

      {/* === LAYER 6: NPCS (with parallax, y-sort by lane) === */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${-panX}px)`,
        }}
      >
        {SCENE_NPCS.map((npc) => {
          const asset = SIDEVIEW_CHARACTER_ASSETS[npc.characterId];
          const sz = computeDisplaySize(asset.nativeSize, npc.laneY);
          const rawX =
            npc.startX + npc.walkDir * npc.walkSpeed * frame;
          const x = wrapScreenX(rawX, sz, 1920 + PAN_TOTAL_PX + 64);
          const top = computeAnchoredTop(npc.laneY, sz, asset.footAnchorY);
          const useFlipX = npc.walkDir === -1;
          const shadowW = Math.round(sz * 0.65);
          const shadowH = Math.round(sz * 0.1);

          return (
            <div
              key={npc.id}
              style={{
                position: "absolute",
                top,
                left: Math.round(x - sz / 2),
                zIndex: Math.round(npc.laneY),
              }}
            >
              {/* Ground shadow */}
              <div
                style={{
                  position: "absolute",
                  top: Math.round(sz * asset.footAnchorY) - Math.round(shadowH / 2),
                  left: Math.round((sz - shadowW) / 2),
                  width: shadowW,
                  height: shadowH,
                  background:
                    "radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 80%)",
                  borderRadius: "50%",
                  filter: "blur(2px)",
                }}
              />
              <PixelLabSprite
                basePath={asset.basePath}
                animation={asset.defaultAnimation}
                direction={asset.direction}
                frameCount={asset.frameCount}
                frameRate={SPRITE_FPS}
                displaySize={sz}
                flipX={useFlipX}
              />
            </div>
          );
        })}
      </div>

      {/* === LAYER 7: TITLE OVERLAY === */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 120,
          opacity: titleOpacity,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 42,
            color: "#FFFFFF",
            textShadow:
              "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
            letterSpacing: 2,
            lineHeight: 1.6,
          }}
        >
          L'Europe. 1347.
        </div>
      </div>
    </AbsoluteFill>
  );
};
