import React from "react";
import { AbsoluteFill, useCurrentFrame, staticFile, Img } from "remotion";

// ============================================================
// IsoVillageScene - Isometric medieval village
// Assets: PixelLab iso tiles + iso buildings + top-down NPCs
// Resolution: 1920x1080
// ============================================================

const W = 1920;
const H = 1080;

// Isometric projection parameters
// TILE_W/TILE_H defines the diamond size on screen
const TILE_W = 128;
const TILE_H = 64;
// Origin: center-top of the grid, shifted left to center the 10x7 grid
const ORIGIN_X = W / 2;
const ORIGIN_Y = 280; // descendre pour voir les batiments entiers

// Convert grid coords to screen coords (top-left corner of tile)
function isoToScreen(isoX: number, isoY: number): { x: number; y: number } {
  const x = (isoX - isoY) * (TILE_W / 2) + ORIGIN_X;
  const y = (isoX + isoY) * (TILE_H / 2) + ORIGIN_Y;
  return { x, y };
}

// Grid layout - 10x7
const GRID_COLS = 10;
const GRID_ROWS = 7;

// Tile types
const T_COBBLE = 0;
const T_DIRT = 1;

// Map layout - streets are dirt, rest is cobblestone
const MAP: number[][] = Array.from({ length: GRID_ROWS }, (_, row) =>
  Array.from({ length: GRID_COLS }, (_, col) => {
    if (row === 3) return T_DIRT;
    if (col === 4) return T_DIRT;
    return T_COBBLE;
  })
);

// Buildings + props: anchor point is the BASE (feet on tile center)
const BSCALE = 2;
const BUILDINGS = [
  {
    isoX: 1, isoY: 1,
    asset: "house-iso.png",
    w: 160 * BSCALE, h: 200 * BSCALE,
    // center horizontally, anchor bottom to tile center
    offX: -(160 * BSCALE) / 2,
    offY: -(200 * BSCALE),
  },
  {
    isoX: 6, isoY: 1,
    asset: "chapel-iso.png",
    w: 160 * BSCALE, h: 220 * BSCALE,
    offX: -(160 * BSCALE) / 2,
    offY: -(220 * BSCALE),
  },
  {
    isoX: 1, isoY: 5,
    asset: "inn-iso.png",
    w: 180 * BSCALE, h: 220 * BSCALE,
    offX: -(180 * BSCALE) / 2,
    offY: -(220 * BSCALE),
  },
  {
    isoX: 8, isoY: 1,
    asset: "house-iso.png",
    w: 160 * BSCALE, h: 200 * BSCALE,
    offX: -(160 * BSCALE) / 2,
    offY: -(200 * BSCALE),
  },
  {
    isoX: 8, isoY: 5,
    asset: "chapel-iso.png",
    w: 160 * BSCALE, h: 220 * BSCALE,
    offX: -(160 * BSCALE) / 2,
    offY: -(220 * BSCALE),
  },
  // Props: table au centre de la place (intersection des rues)
  {
    isoX: 4, isoY: 1,
    asset: "prop-table.png",
    w: 68 * 2, h: 64 * 2,
    offX: -(68 * 2) / 2,
    offY: -(64 * 2),
  },
  {
    isoX: 4, isoY: 5,
    asset: "prop-table.png",
    w: 68 * 2, h: 64 * 2,
    offX: -(68 * 2) / 2,
    offY: -(64 * 2),
  },
];

// NPC sprite scale: building is ~300px tall on screen
// NPCs should be ~80-100px = scale 1.5 (native 64px)
const NPC_SCALE = 1.5;
const RENDER_FPS = 30;

interface NPC {
  id: string;
  sprite: string;
  direction: "east" | "west" | "north" | "south";
  frames: number;
  fps: number;
  axis: "x" | "y";
  fixedCoord: number;
  startCoord: number;
  endCoord: number;
  speed: number; // tiles per second
}

const NPCS: NPC[] = [
  {
    id: "peasant1",
    sprite: "assets/peste-pixel/pixellab/characters/peasant-man/animations/walking/east",
    direction: "east",
    frames: 6,
    fps: 8,
    axis: "x",
    fixedCoord: 3,
    startCoord: 0,
    endCoord: 9,
    speed: 0.6,
  },
  {
    id: "monk1",
    sprite: "assets/peste-pixel/pixellab/characters/monk/animations/walking/east",
    direction: "west",
    frames: 6,
    fps: 8,
    axis: "x",
    fixedCoord: 3,
    startCoord: 9,
    endCoord: 0,
    speed: 0.5,
  },
  {
    id: "merchant1",
    sprite: "assets/peste-pixel/pixellab/characters/merchant/animations/walking/south",
    direction: "south",
    frames: 6,
    fps: 8,
    axis: "y",
    fixedCoord: 4,
    startCoord: 0,
    endCoord: 6,
    speed: 0.5,
  },
  {
    id: "peasant2",
    sprite: "assets/peste-pixel/pixellab/characters/peasant-man/animations/walking/east",
    direction: "north",
    frames: 6,
    fps: 8,
    axis: "y",
    fixedCoord: 4,
    startCoord: 6,
    endCoord: 0,
    speed: 0.4,
  },
];

// Ground layer
function IsoGround() {
  const tiles: React.ReactNode[] = [];

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const { x, y } = isoToScreen(col, row);
      const tileType = MAP[row][col];
      const asset =
        tileType === T_COBBLE
          ? "assets/peste-pixel/opengameart/ground-cobble-oga.png"
          : "assets/peste-pixel/pixellab/iso-tiles/dirt-iso-v2.png";
      const zIndex = col + row;

      tiles.push(
        <Img
          key={`tile-${col}-${row}`}
          src={staticFile(asset)}
          style={{
            position: "absolute",
            left: x - TILE_W / 2,
            top: y - TILE_H / 2,
            width: TILE_W,
            height: TILE_H,
            imageRendering: "pixelated",
            zIndex,
          }}
        />
      );
    }
  }

  return <>{tiles}</>;
}

// Buildings layer
function IsoBuildings() {
  return (
    <>
      {BUILDINGS.map((b, i) => {
        const { x, y } = isoToScreen(b.isoX, b.isoY);
        // zIndex: buildings sort above their tile, +0.5 to float above ground
        const zIndex = b.isoX + b.isoY + 0.5;
        return (
          <Img
            key={`building-${i}`}
            src={staticFile(`assets/peste-pixel/pixellab/iso-buildings/${b.asset}`)}
            style={{
              position: "absolute",
              left: x + b.offX,
              top: y + b.offY,
              width: b.w,
              height: b.h,
              imageRendering: "pixelated",
              zIndex,
            }}
          />
        );
      })}
    </>
  );
}

// NPC sprite component
function IsoNPC({ npc, frame }: { npc: NPC; frame: number }) {
  const secondsElapsed = frame / RENDER_FPS;
  const tilesWalked = secondsElapsed * npc.speed;

  const totalDist = Math.abs(npc.endCoord - npc.startCoord);
  const dir = npc.endCoord > npc.startCoord ? 1 : -1;
  const currentCoord = npc.startCoord + ((tilesWalked % totalDist) * dir);

  const isoX = npc.axis === "x" ? currentCoord : npc.fixedCoord;
  const isoY = npc.axis === "y" ? currentCoord : npc.fixedCoord;

  const { x, y } = isoToScreen(isoX, isoY);
  const spriteSize = 64 * NPC_SCALE;

  // Sort above the tile they're standing on
  const zIndex = Math.floor(isoX) + Math.floor(isoY) + 1;

  // Animation frame from sprite fps
  const animFrame = Math.floor(secondsElapsed * npc.fps) % npc.frames;
  const framePadded = String(animFrame).padStart(3, "0");
  const src = staticFile(`${npc.sprite}/frame_${framePadded}.png`);

  // Flip when going west but only have east sprite
  const flipX = npc.direction === "west" && npc.sprite.endsWith("/east");

  return (
    <Img
      src={src}
      style={{
        position: "absolute",
        left: x - spriteSize / 2,
        top: y - spriteSize,
        width: spriteSize,
        height: spriteSize,
        imageRendering: "pixelated",
        zIndex,
        transform: flipX ? "scaleX(-1)" : undefined,
      }}
    />
  );
}

// Main scene
export function IsoVillageScene() {
  const frame = useCurrentFrame();

  const skyStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, #4a8bc4 0%, #87ceeb 45%, #c8e6f0 100%)",
    zIndex: 0,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#4a8bc4", overflow: "hidden" }}>
      <div style={skyStyle} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <IsoGround />
        <IsoBuildings />
        {NPCS.map((npc) => (
          <IsoNPC key={npc.id} npc={npc} frame={frame} />
        ))}
      </div>
    </AbsoluteFill>
  );
}
