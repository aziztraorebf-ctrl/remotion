import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  staticFile,
  Img,
  interpolate,
} from "remotion";
import { PixelLabSprite } from "../components/PixelLabSprite";
import { PIXEL_SCALE, PIXELLAB_ASSET_PATHS, LUMINANCE } from "../config/pixellab";
import { COLORS, FONTS } from "../config/theme";

// -- Scene Config --
const FPS = 30;
const DURATION_SEC = 8;
const DURATION_FRAMES = FPS * DURATION_SEC;
const SCENE_WIDTH = 1920;
const SCENE_HEIGHT = 1080;

// Tile rendering config
const TILE_NATIVE = PIXEL_SCALE.TILE_SIZE; // 32px
const TILE_SCALE = PIXEL_SCALE.TILE_DISPLAY_SCALE; // 4x
const TILE_DISPLAY = TILE_NATIVE * TILE_SCALE; // 128px

// Character display size (upscaled from native)
const CHAR_DISPLAY = PIXEL_SCALE.DISPLAY_HEIGHT; // 224px
const CHILD_DISPLAY = 160; // smaller for the child

// -- Tileset Rendering --
// Uses pre-extracted cobblestone tile (wang_15, all corners upper)
// Upscaled 4x to 128x128 with nearest-neighbor, then CSS repeat
const COBBLE_TILE_PATH = `${PIXELLAB_ASSET_PATHS.tilesets}/cobblestone-full-4x.png`;

const TileGround: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage: `url(${staticFile(COBBLE_TILE_PATH)})`,
      backgroundRepeat: "repeat",
      backgroundSize: `${TILE_DISPLAY}px ${TILE_DISPLAY}px`,
      imageRendering: "pixelated",
    }}
  />
);

// -- Map Object (static prop) --
interface MapObjectProps {
  src: string;
  x: number;
  y: number;
  displayWidth: number;
  displayHeight: number;
}

const MapObject: React.FC<MapObjectProps> = ({
  src,
  x,
  y,
  displayWidth,
  displayHeight,
}) => (
  <Img
    src={staticFile(src)}
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: displayWidth,
      height: displayHeight,
      imageRendering: "pixelated",
    }}
  />
);

// -- Walking Character (moves across scene) --
interface WalkingCharacterProps {
  basePath: string;
  animation: string;
  direction: string;
  frameCount: number;
  displaySize: number;
  startX: number;
  endX: number;
  y: number;
  frameRate?: number;
}

const WalkingCharacter: React.FC<WalkingCharacterProps> = ({
  basePath,
  animation,
  direction,
  frameCount,
  displaySize,
  startX,
  endX,
  y,
  frameRate = 5,
}) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, DURATION_FRAMES], [startX, endX], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        zIndex: Math.round(y + displaySize),
      }}
    >
      <PixelLabSprite
        basePath={basePath}
        animation={animation}
        direction={direction}
        frameCount={frameCount}
        frameRate={frameRate}
        displaySize={displaySize}
        loop
      />
    </div>
  );
};

// -- Static Character (idle, no movement) --
interface StaticCharacterProps {
  basePath: string;
  direction: string;
  displaySize: number;
  x: number;
  y: number;
}

const StaticCharacter: React.FC<StaticCharacterProps> = ({
  basePath,
  direction,
  displaySize,
  x,
  y,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      zIndex: Math.round(y + displaySize),
    }}
  >
    <PixelLabSprite
      basePath={basePath}
      direction={direction}
      displaySize={displaySize}
    />
  </div>
);

// -- Scene Title Overlay --
const SceneTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20, DURATION_FRAMES - 20, DURATION_FRAMES], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 30,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: FONTS.title,
        fontSize: 18,
        color: COLORS.textPrimary,
        textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
        opacity,
        zIndex: 1000,
      }}
    >
      PIXELLAB V1 - VILLAGE TEST SCENE
    </div>
  );
};

// -- Golden Hour Tint (Luminance Alpha) --
const GoldenHourOverlay: React.FC = () => (
  <AbsoluteFill
    style={{
      background: LUMINANCE.alpha.backgroundTint,
      pointerEvents: "none",
      zIndex: 999,
    }}
  />
);

// =============================================================
// Main Scene
// =============================================================
export const VillageTestScene: React.FC = () => {
  const charBase = PIXELLAB_ASSET_PATHS.characters;
  const objBase = PIXELLAB_ASSET_PATHS.mapObjects;

  return (
    <AbsoluteFill style={{ backgroundColor: "#2A2A1E" }}>
      {/* Layer 0: Ground tiles */}
      <TileGround />

      {/* Layer 1: Map objects (static props) */}
      {/* Fountain - center of the square */}
      <MapObject
        src={`${objBase}/fountain.png`}
        x={860}
        y={400}
        displayWidth={256}
        displayHeight={256}
      />
      {/* Market stall - left side */}
      <MapObject
        src={`${objBase}/market-stall.png`}
        x={200}
        y={250}
        displayWidth={320}
        displayHeight={320}
      />
      {/* Well - right side */}
      <MapObject
        src={`${objBase}/well.png`}
        x={1500}
        y={350}
        displayWidth={192}
        displayHeight={192}
      />
      {/* Cart - bottom right */}
      <MapObject
        src={`${objBase}/cart.png`}
        x={1400}
        y={700}
        displayWidth={256}
        displayHeight={256}
      />
      {/* Barrels near market stall */}
      <MapObject
        src={`${objBase}/barrel.png`}
        x={480}
        y={420}
        displayWidth={96}
        displayHeight={96}
      />
      <MapObject
        src={`${objBase}/barrel.png`}
        x={530}
        y={440}
        displayWidth={96}
        displayHeight={96}
      />

      {/* Layer 2-4: Characters (depth-sorted by Y position) */}

      {/* Peasant Man - walks east across the top */}
      <WalkingCharacter
        basePath={`${charBase}/peasant-man`}
        animation="walking"
        direction="east"
        frameCount={6}
        displaySize={CHAR_DISPLAY}
        startX={-200}
        endX={700}
        y={200}
        frameRate={5}
      />

      {/* Merchant - walks west across the middle */}
      <WalkingCharacter
        basePath={`${charBase}/merchant`}
        animation="walking"
        direction="west"
        frameCount={6}
        displaySize={CHAR_DISPLAY}
        startX={1800}
        endX={900}
        y={500}
        frameRate={5}
      />

      {/* Blacksmith - walks east near the bottom */}
      <WalkingCharacter
        basePath={`${charBase}/blacksmith`}
        animation="walking"
        direction="east"
        frameCount={6}
        displaySize={CHAR_DISPLAY}
        startX={100}
        endX={1200}
        y={700}
        frameRate={5}
      />

      {/* Child - runs east faster, middle area */}
      <WalkingCharacter
        basePath={`${charBase}/child`}
        animation="walk"
        direction="east"
        frameCount={6}
        displaySize={CHILD_DISPLAY}
        startX={300}
        endX={1500}
        y={600}
        frameRate={4}
      />

      {/* Plague Doctor - static, standing near the well (ominous) */}
      <StaticCharacter
        basePath={`${charBase}/plague-doctor-concept`}
        direction="south"
        displaySize={CHAR_DISPLAY}
        x={1550}
        y={550}
      />

      {/* Monk - static, near the fountain (praying) */}
      <StaticCharacter
        basePath={`${charBase}/monk`}
        direction="south"
        displaySize={CHAR_DISPLAY}
        x={780}
        y={580}
      />

      {/* Golden hour tint */}
      <GoldenHourOverlay />

      {/* Scene title */}
      <SceneTitle />
    </AbsoluteFill>
  );
};

export const VILLAGE_TEST_FPS = FPS;
export const VILLAGE_TEST_FRAMES = DURATION_FRAMES;
