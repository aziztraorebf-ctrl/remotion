import React, { useMemo } from "react";
import {
  useCurrentFrame,
  interpolate,
  staticFile,
  Img,
} from "remotion";
import { loadFont as loadPressStart2P } from "@remotion/google-fonts/PressStart2P";
import { GridSpritesheetAnimator } from "../components/GridSpritesheetAnimator";

const { fontFamily: pressStart } = loadPressStart2P();

// ============================================================
// PIXEL WORLD V3 - Production-quality medieval town
//
// 10 seconds @ 30fps = 300 frames
// Built from CLEAN extracted tiles (no watermarks, no artifacts)
//
// Key differences from V2:
//   - Uses individual extracted tile PNGs (not spritesheet clipping)
//   - NO plague doctor (removed per Aziz request)
//   - Proper building assembly (wall + roof + door aligned)
//   - Clean ground tiles (no underground/water artifacts)
//   - Precise scaling and positioning
//   - Logical prop placement (near buildings, not floating)
//
// Layers:
//   0: Night sky parallax (dark, slowest)
//   1: Dusk mountains parallax (medium)
//   2: Buildings (assembled tile-by-tile)
//   3: Ground (stone platform)
//   4: Props (barrels, crates, wagon, market stall)
//   5: NPCs (peasants, static with gentle bob)
//   6: Rats (animated, scurrying)
//   7: Fire (animated, placed at logical locations)
//   8: Atmosphere (fog, vignette, scanlines)
//   9: HUD
// ============================================================

const SCALE = 4; // 16px base tile -> 64px display
const TILE = 16 * SCALE; // 64px per tile

// Tile paths (all extracted, clean)
const TILES = {
  skyNight: "assets/peste-pixel/town/extracted/parallax-sky-night.png",
  skyDusk: "assets/peste-pixel/town/extracted/parallax-sky-dusk.png",
  ground: "assets/peste-pixel/town/extracted/ground-surface.png",
  wallWood: "assets/peste-pixel/town/extracted/wall-wood.png",
  wallStone: "assets/peste-pixel/town/extracted/wall-stone.png",
  roofWoodLarge: "assets/peste-pixel/town/extracted/roof-wood-large.png",
  roofPlaster: "assets/peste-pixel/town/extracted/roof-plaster.png",
  roofStoneLarge: "assets/peste-pixel/town/extracted/roof-stone.png",
  roofAframeWood: "assets/peste-pixel/town/extracted/roof-aframe-wood.png",
  roofAframePlaster: "assets/peste-pixel/town/extracted/roof-aframe-plaster.png",
  roofWoodDark: "assets/peste-pixel/town/extracted/roof-wood-dark.png",
  chimney: "assets/peste-pixel/town/extracted/chimney.png",
  doorWood: "assets/peste-pixel/town/extracted/door-wood.png",
  doorDark: "assets/peste-pixel/town/extracted/door-dark.png",
  doorStone: "assets/peste-pixel/town/extracted/door-stone.png",
  windowGrid: "assets/peste-pixel/town/extracted/window-grid.png",
  windowCrate: "assets/peste-pixel/town/extracted/window-crate.png",
  barrel1: "assets/peste-pixel/town/extracted/barrel-1.png",
  barrel2: "assets/peste-pixel/town/extracted/barrel-2.png",
  crate1: "assets/peste-pixel/town/extracted/crate-1.png",
  crate2: "assets/peste-pixel/town/extracted/crate-2.png",
  signPost: "assets/peste-pixel/town/extracted/sign-post.png",
  wagonCovered: "assets/peste-pixel/town/extracted/wagon-covered.png",
  cartOpen: "assets/peste-pixel/town/extracted/cart-open.png",
  marketStall: "assets/peste-pixel/town/extracted/market-stall.png",
  marketShelf: "assets/peste-pixel/town/extracted/market-shelf.png",
  towerWindow: "assets/peste-pixel/town/extracted/tower-window.png",
} as const;

// Original tile sizes (px) - used for display scaling
const TILE_SIZES = {
  skyNight: { w: 480, h: 48 },
  skyDusk: { w: 480, h: 48 },
  ground: { w: 320, h: 32 },
  wallWood: { w: 160, h: 240 },
  wallStone: { w: 160, h: 240 },
  roofLarge: { w: 160, h: 104 },
  roofAframe: { w: 120, h: 104 },
  chimney: { w: 40, h: 104 },
  door: { w: 48, h: 48 },
  window: { w: 48, h: 48 },
  barrel: { w: 48, h: 48 },
  crate: { w: 48, h: 48 },
  signPost: { w: 48, h: 48 },
  wagonCovered: { w: 112, h: 80 },
  cartOpen: { w: 96, h: 48 },
  marketStall: { w: 128, h: 96 },
  marketShelf: { w: 96, h: 80 },
  towerWindow: { w: 80, h: 112 },
} as const;

// Ground level: bottom of screen where buildings sit
// Ground tile is 32px * SCALE = 128px from bottom
const GROUND_H = TILE_SIZES.ground.h * SCALE; // 128px

// ============================================================
// Parallax Sky - tiles horizontally, scrolls slowly
// ============================================================
const ParallaxLayer: React.FC<{
  src: string;
  srcW: number;
  srcH: number;
  speed: number;
  y: number;
  opacity?: number;
  frame: number;
}> = ({ src, srcW, srcH, speed, y, opacity = 1, frame }) => {
  const displayW = srcW * SCALE;
  const displayH = srcH * SCALE;
  const scrollX = -(frame * speed) % displayW;

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        width: "100%",
        height: displayH,
        overflow: "hidden",
        opacity,
      }}
    >
      {[0, 1, 2].map((i) => (
        <Img
          key={i}
          src={staticFile(src)}
          style={{
            position: "absolute",
            left: scrollX + i * displayW,
            top: 0,
            width: displayW,
            height: displayH,
            imageRendering: "pixelated",
          }}
        />
      ))}
    </div>
  );
};

// ============================================================
// Ground - scrolling stone platform with opaque backdrop
// ============================================================
const Ground: React.FC<{ frame: number; scrollSpeed: number }> = ({
  frame,
  scrollSpeed,
}) => {
  const displayW = TILE_SIZES.ground.w * SCALE;
  const scrollX = -(frame * scrollSpeed) % displayW;
  const tilesNeeded = Math.ceil(1920 / displayW) + 2;

  return (
    <>
      {/* Opaque backdrop behind ground - prevents parallax bleed */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: GROUND_H + 20,
          backgroundColor: "#1A1520",
          zIndex: 4,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: GROUND_H,
          overflow: "hidden",
          zIndex: 5,
        }}
      >
        {Array.from({ length: tilesNeeded }, (_, i) => (
          <Img
            key={i}
            src={staticFile(TILES.ground)}
            style={{
              position: "absolute",
              left: scrollX + i * displayW,
              bottom: 0,
              width: displayW,
              height: GROUND_H,
              imageRendering: "pixelated",
            }}
          />
        ))}
      </div>
    </>
  );
};

// ============================================================
// Building - properly assembled from wall + roof + door + windows
// ============================================================
interface BuildingConfig {
  wall: "wood" | "stone";
  roof: "wood-large" | "plaster" | "stone" | "aframe-wood" | "aframe-plaster" | "wood-dark";
  door: "wood" | "dark" | "stone";
  windows: number; // 0, 1, or 2
  chimney?: boolean;
}

const BUILDING_PRESETS: BuildingConfig[] = [
  { wall: "wood", roof: "wood-large", door: "wood", windows: 2, chimney: true },
  { wall: "stone", roof: "stone", door: "stone", windows: 1 },
  { wall: "wood", roof: "plaster", door: "dark", windows: 2 },
  { wall: "stone", roof: "wood-dark", door: "stone", windows: 1, chimney: true },
  { wall: "wood", roof: "aframe-wood", door: "wood", windows: 0 },
];

const Building: React.FC<{
  x: number;
  preset: number;
  frame: number;
  scrollSpeed: number;
}> = ({ x, preset, frame, scrollSpeed }) => {
  const config = BUILDING_PRESETS[preset % BUILDING_PRESETS.length];
  const scrolledX = x - frame * scrollSpeed;

  // Determine tile sources
  const wallSrc = config.wall === "wood" ? TILES.wallWood : TILES.wallStone;
  const wallW = TILE_SIZES.wallWood.w * SCALE; // 640
  const wallH = TILE_SIZES.wallWood.h * SCALE; // 960

  // Roof dimensions depend on type
  const isAframe = config.roof.startsWith("aframe");
  const roofW = isAframe ? TILE_SIZES.roofAframe.w * SCALE : TILE_SIZES.roofLarge.w * SCALE;
  const roofH = isAframe ? TILE_SIZES.roofAframe.h * SCALE : TILE_SIZES.roofLarge.h * SCALE;

  const roofSrcMap: Record<string, string> = {
    "wood-large": TILES.roofWoodLarge,
    "plaster": TILES.roofPlaster,
    "stone": TILES.roofStoneLarge,
    "aframe-wood": TILES.roofAframeWood,
    "aframe-plaster": TILES.roofAframePlaster,
    "wood-dark": TILES.roofWoodDark,
  };
  const roofSrc = roofSrcMap[config.roof];

  const doorSrcMap: Record<string, string> = {
    wood: TILES.doorWood,
    dark: TILES.doorDark,
    stone: TILES.doorStone,
  };
  const doorSrc = doorSrcMap[config.door];
  const doorW = TILE_SIZES.door.w * SCALE;
  const doorH = TILE_SIZES.door.h * SCALE;

  const windowSrc = config.windows > 0 ? TILES.windowGrid : null;
  const windowW = TILE_SIZES.window.w * SCALE;
  const windowH = TILE_SIZES.window.h * SCALE;

  // Show only first facade (top half of wall tile = rows 0-119)
  const visibleWallH = wallH * 0.50;

  // Total building height
  const totalH = roofH + visibleWallH;

  return (
    <div
      style={{
        position: "absolute",
        left: scrolledX,
        bottom: GROUND_H - 16, // overlap ground slightly for seamless join
        width: wallW,
        height: totalH,
        zIndex: 8,
      }}
    >
      {/* Roof - centered over wall */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: (wallW - roofW) / 2,
          width: roofW,
          height: roofH,
        }}
      >
        <Img
          src={staticFile(roofSrc)}
          style={{
            width: roofW,
            height: roofH,
            imageRendering: "pixelated",
          }}
        />
      </div>

      {/* Chimney - on the roof */}
      {config.chimney && (
        <div
          style={{
            position: "absolute",
            top: -TILE_SIZES.chimney.h * SCALE * 0.3,
            right: wallW * 0.15,
            width: TILE_SIZES.chimney.w * SCALE,
            height: TILE_SIZES.chimney.h * SCALE,
          }}
        >
          <Img
            src={staticFile(TILES.chimney)}
            style={{
              width: TILE_SIZES.chimney.w * SCALE,
              height: TILE_SIZES.chimney.h * SCALE,
              imageRendering: "pixelated",
            }}
          />
        </div>
      )}

      {/* Wall - clipped to visible portion, overlaps under roof */}
      <div
        style={{
          position: "absolute",
          top: roofH - 24, // deeper overlap under roof
          left: 0,
          width: wallW,
          height: visibleWallH,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile(wallSrc)}
          style={{
            width: wallW,
            height: wallH,
            imageRendering: "pixelated",
          }}
        />
      </div>

      {/* Door - centered at bottom of wall */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: (wallW - doorW) / 2,
          width: doorW,
          height: doorH,
        }}
      >
        <Img
          src={staticFile(doorSrc)}
          style={{
            width: doorW,
            height: doorH,
            imageRendering: "pixelated",
          }}
        />
      </div>

      {/* Windows - evenly spaced on wall */}
      {windowSrc &&
        Array.from({ length: config.windows }, (_, i) => {
          const spacing = wallW / (config.windows + 1);
          const wx = spacing * (i + 1) - windowW / 2;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: roofH + visibleWallH * 0.2,
                left: wx,
                width: windowW,
                height: windowH,
              }}
            >
              <Img
                src={staticFile(windowSrc)}
                style={{
                  width: windowW,
                  height: windowH,
                  imageRendering: "pixelated",
                }}
              />
            </div>
          );
        })}
    </div>
  );
};

// ============================================================
// Prop - individual clean tile placed in the world
// ============================================================
const Prop: React.FC<{
  src: string;
  w: number;
  h: number;
  x: number;
  bottomOffset?: number;
  frame: number;
  scrollSpeed: number;
  zIndex?: number;
}> = ({ src, w, h, x, bottomOffset = 0, frame, scrollSpeed, zIndex = 10 }) => {
  const displayW = w * SCALE;
  const displayH = h * SCALE;
  const scrolledX = x - frame * scrollSpeed;

  return (
    <div
      style={{
        position: "absolute",
        left: scrolledX,
        bottom: GROUND_H + bottomOffset,
        width: displayW,
        height: displayH,
        zIndex,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: displayW,
          height: displayH,
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
};

// ============================================================
// Peasant NPC - static sprite with gentle bob
// peasants.png: 512x384, ~64x48 per character frame
// 8 columns, 8 rows of different peasant variants
// ============================================================
const PeasantNPC: React.FC<{
  x: number;
  row: number;
  col: number;
  frame: number;
  scrollSpeed: number;
  flipX?: boolean;
  displayScale?: number;
}> = ({ x, row, col, frame, scrollSpeed, flipX = false, displayScale = 4 }) => {
  const scrolledX = x - frame * scrollSpeed;
  const bob = Math.sin((frame + col * 50 + row * 30) * 0.08) * 3;

  const frameW = 64;
  const frameH = 48;

  return (
    <div
      style={{
        position: "absolute",
        left: scrolledX,
        bottom: GROUND_H + bob - 8,
        zIndex: 18,
        width: frameW * displayScale,
        height: frameH * displayScale,
        overflow: "hidden",
        imageRendering: "pixelated",
        transform: flipX ? "scaleX(-1)" : undefined,
        backgroundImage: `url(${staticFile("assets/peste-pixel/sprites/peasants/peasants.png")})`,
        backgroundPosition: `${-col * frameW * displayScale}px ${-row * frameH * displayScale}px`,
        backgroundSize: `${512 * displayScale}px ${384 * displayScale}px`,
        backgroundRepeat: "no-repeat",
      }}
    />
  );
};

// ============================================================
// Running rats using GridSpritesheetAnimator
// rats.png: 160x256, 5 cols x 8 rows, 32x32 per frame
// Row 0 = run animation
// ============================================================
const RunningRats: React.FC<{ frame: number; scrollSpeed: number }> = ({
  frame,
  scrollSpeed,
}) => {
  const rats = useMemo(
    () => [
      { startX: -100, yOff: -20, speed: 4.2, delay: 15 },
      { startX: -180, yOff: -5, speed: 3.6, delay: 40 },
      { startX: -60, yOff: -35, speed: 4.8, delay: 60 },
      { startX: -220, yOff: -15, speed: 3.3, delay: 85 },
      { startX: -140, yOff: -8, speed: 3.9, delay: 110 },
      { startX: -300, yOff: -28, speed: 4.4, delay: 140 },
    ],
    []
  );

  return (
    <>
      {rats.map((rat, i) => {
        const elapsed = Math.max(0, frame - rat.delay);
        if (elapsed <= 0) return null;
        const rx = rat.startX + elapsed * rat.speed;
        if (rx > 2100) return null;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: rx,
              bottom: GROUND_H + rat.yOff,
              zIndex: 14,
            }}
          >
            <GridSpritesheetAnimator
              src="assets/peste-pixel/sprites/rats/rats.png"
              cols={5}
              rows={8}
              frameWidth={32}
              frameHeight={32}
              displayWidth={32 * 3}
              displayHeight={32 * 3}
              startRow={0}
              frameCount={5}
              frameRate={3}
              loop
            />
          </div>
        );
      })}
    </>
  );
};

// ============================================================
// Animated fire using individual frame PNGs
// fire/red/Group 4 - N/Group 4 - N_1..8.png (32x48 per frame)
// ============================================================
const FireFX: React.FC<{
  x: number;
  bottomOffset: number;
  frame: number;
  scrollSpeed: number;
  variant?: number;
  size?: number;
}> = ({ x, bottomOffset, frame, scrollSpeed, variant = 1, size = 3 }) => {
  const scrolledX = x - frame * scrollSpeed;
  const spriteIndex = (Math.floor(frame / 5) % 8) + 1;
  const path = `assets/peste-pixel/fire/red/Group 4 - ${variant}/Group 4 - ${variant}_${spriteIndex}.png`;

  return (
    <div
      style={{
        position: "absolute",
        left: scrolledX,
        bottom: GROUND_H + bottomOffset,
        zIndex: 15,
      }}
    >
      <Img
        src={staticFile(path)}
        style={{
          width: 32 * size,
          height: 48 * size,
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
};

// ============================================================
// Game HUD - minimal, clean, period-appropriate
// ============================================================
const GameHUD: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Death toll counter - slowly ticks up
  const deathCount = Math.floor(
    interpolate(frame, [0, 300], [25000000, 25000064], {
      extrapolateRight: "clamp",
    })
  );

  // Format with spaces as thousands separator
  const formatted = deathCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        opacity,
        zIndex: 50,
      }}
    >
      {/* Hearts */}
      <div style={{ display: "flex", gap: 6 }}>
        {[true, true, true, false].map((full, i) => (
          <span
            key={i}
            style={{
              fontFamily: pressStart,
              fontSize: 16,
              color: full ? "#E63946" : "#333",
              textShadow: full
                ? "0 0 8px rgba(230,57,70,0.4)"
                : "none",
            }}
          >
            {full ? "\u2665" : "\u2661"}
          </span>
        ))}
      </div>

      {/* Title */}
      <span
        style={{
          fontFamily: pressStart,
          fontSize: 10,
          color: "#D4A017",
          textShadow: "1px 1px 0 #000, -1px -1px 0 #000",
          letterSpacing: 1,
        }}
      >
        PESTE NOIRE - 1347
      </span>

      {/* Death counter */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontFamily: pressStart,
            fontSize: 8,
            color: "#888",
            textShadow: "1px 1px 0 #000",
          }}
        >
          MORTS
        </span>
        <span
          style={{
            fontFamily: pressStart,
            fontSize: 12,
            color: "#ccc",
            textShadow: "1px 1px 0 #000",
          }}
        >
          {formatted}
        </span>
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPOSITION
// ============================================================
export const PixelWorldV3: React.FC = () => {
  const frame = useCurrentFrame();

  // Camera pan speed - consistent across all scrolling elements
  const SCROLL = 1.5;

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#060610",
      }}
    >
      {/* === LAYER 0: Night sky - slowest parallax === */}
      <ParallaxLayer
        src={TILES.skyNight}
        srcW={TILE_SIZES.skyNight.w}
        srcH={TILE_SIZES.skyNight.h}
        speed={0.2}
        y={0}
        frame={frame}
      />

      {/* === LAYER 1: Dusk mountains - medium parallax, positioned as distant silhouette === */}
      <ParallaxLayer
        src={TILES.skyDusk}
        srcW={TILE_SIZES.skyDusk.w}
        srcH={TILE_SIZES.skyDusk.h}
        speed={0.5}
        y={TILE_SIZES.skyNight.h * SCALE - 20}
        opacity={0.35}
        frame={frame}
      />

      {/* Dark backdrop for building zone - prevents parallax bleed */}
      <div
        style={{
          position: "absolute",
          top: TILE_SIZES.skyNight.h * SCALE,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(180deg, #060610 0%, #0A0A18 30%, #0E0B14 100%)",
          zIndex: 1,
        }}
      />

      {/* === LAYER 2: Buildings - closer together for dense medieval town feel === */}
      <Building x={50} preset={0} frame={frame} scrollSpeed={SCROLL} />
      <Building x={680} preset={1} frame={frame} scrollSpeed={SCROLL} />
      <Building x={1250} preset={2} frame={frame} scrollSpeed={SCROLL} />
      <Building x={1800} preset={3} frame={frame} scrollSpeed={SCROLL} />
      <Building x={2350} preset={4} frame={frame} scrollSpeed={SCROLL} />
      <Building x={2800} preset={0} frame={frame} scrollSpeed={SCROLL} />

      {/* === LAYER 3: Ground === */}
      <Ground frame={frame} scrollSpeed={SCROLL} />

      {/* === LAYER 4: Props - placed between buildings === */}

      {/* Between building 1 and 2 */}
      <Prop
        src={TILES.barrel1}
        w={TILE_SIZES.barrel.w}
        h={TILE_SIZES.barrel.h}
        x={560}
        bottomOffset={-8}
        frame={frame}
        scrollSpeed={SCROLL}
      />
      <Prop
        src={TILES.crate1}
        w={TILE_SIZES.crate.w}
        h={TILE_SIZES.crate.h}
        x={610}
        bottomOffset={-8}
        frame={frame}
        scrollSpeed={SCROLL}
      />

      {/* Between building 2 and 3 */}
      <Prop
        src={TILES.signPost}
        w={TILE_SIZES.signPost.w}
        h={TILE_SIZES.signPost.h}
        x={1120}
        bottomOffset={-4}
        frame={frame}
        scrollSpeed={SCROLL}
      />
      <Prop
        src={TILES.barrel2}
        w={TILE_SIZES.barrel.w}
        h={TILE_SIZES.barrel.h}
        x={1170}
        bottomOffset={-8}
        frame={frame}
        scrollSpeed={SCROLL}
      />

      {/* Plague wagon between building 3 and 4 */}
      <Prop
        src={TILES.wagonCovered}
        w={TILE_SIZES.wagonCovered.w}
        h={TILE_SIZES.wagonCovered.h}
        x={1650}
        bottomOffset={-4}
        frame={frame}
        scrollSpeed={SCROLL}
        zIndex={12}
      />

      {/* Between building 4 and 5 */}
      <Prop
        src={TILES.barrel1}
        w={TILE_SIZES.barrel.w}
        h={TILE_SIZES.barrel.h}
        x={2250}
        bottomOffset={-8}
        frame={frame}
        scrollSpeed={SCROLL}
      />
      <Prop
        src={TILES.crate2}
        w={TILE_SIZES.crate.w}
        h={TILE_SIZES.crate.h}
        x={2300}
        bottomOffset={-8}
        frame={frame}
        scrollSpeed={SCROLL}
      />

      {/* === LAYER 5: Peasant NPCs - placed between buildings === */}
      {/* Near first gap - 2 peasants */}
      <PeasantNPC x={570} row={0} col={0} frame={frame} scrollSpeed={SCROLL} />
      <PeasantNPC
        x={620}
        row={1}
        col={1}
        frame={frame}
        scrollSpeed={SCROLL}
        flipX
      />

      {/* Near sign post */}
      <PeasantNPC x={1100} row={2} col={2} frame={frame} scrollSpeed={SCROLL} />

      {/* Near wagon */}
      <PeasantNPC
        x={1580}
        row={3}
        col={0}
        frame={frame}
        scrollSpeed={SCROLL}
        flipX
      />

      {/* Near last buildings */}
      <PeasantNPC x={2200} row={0} col={3} frame={frame} scrollSpeed={SCROLL} />
      <PeasantNPC x={2700} row={1} col={2} frame={frame} scrollSpeed={SCROLL} flipX />

      {/* === LAYER 6: Rats === */}
      <RunningRats frame={frame} scrollSpeed={SCROLL} />

      {/* === LAYER 7: Fire FX - placed at logical locations === */}
      {/* Torch near first gap */}
      <FireFX
        x={540}
        bottomOffset={50}
        frame={frame}
        scrollSpeed={SCROLL}
        variant={1}
        size={3}
      />
      {/* Burning debris between buildings */}
      <FireFX
        x={1140}
        bottomOffset={0}
        frame={frame}
        scrollSpeed={SCROLL}
        variant={2}
        size={4}
      />
      {/* Fire near wagon */}
      <FireFX
        x={1720}
        bottomOffset={0}
        frame={frame}
        scrollSpeed={SCROLL}
        variant={3}
        size={3}
      />

      {/* === LAYER 8: Atmosphere === */}

      {/* Subtle ambient fog */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 30,
          pointerEvents: "none",
          background: `radial-gradient(ellipse at ${50 + Math.sin(frame * 0.015) * 8}% 65%, rgba(40,30,20,0.15) 0%, transparent 70%)`,
        }}
      />

      {/* Night blue color grading - darkens bright areas */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 31,
          pointerEvents: "none",
          backgroundColor: "rgba(10, 15, 40, 0.35)",
          mixBlendMode: "multiply",
        }}
      />
      {/* Extra warmth from fire - subtle orange glow at bottom */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 32,
          pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 85%, rgba(180,80,20,0.08) 0%, transparent 50%)",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 55,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Subtle scanlines - very faint, retro feel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 60,
          pointerEvents: "none",
          background:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 4px)",
          mixBlendMode: "multiply",
        }}
      />

      {/* === LAYER 9: HUD === */}
      <GameHUD frame={frame} />
    </div>
  );
};
