import React from "react";
import { AbsoluteFill, interpolate, staticFile, Img } from "remotion";
import {
  GROUND_Y,
  LANE_SCALE,
  MIN_NPC_SPACING,
  SIDEVIEW_COORDS,
  SIDEVIEW_LAYER_Z,
  SIDEVIEW_LANES,
} from "../config/sideViewFoundation";
import { SIDEVIEW_BACKGROUND_ASSETS } from "../config/sideViewAssets";

export { GROUND_Y, LANE_SCALE, MIN_NPC_SPACING };

// ============================================================
// SideViewBackground - Medieval street, 100% PixelLab assets
//
// Layer stack (back to front):
//   1. Sky gradient (CSS)
//   2. Wall strip behind buildings
//   3. Buildings row (zIndex=BUILDING_Z_INDEX, OUTSIDE fade wrapper)
//   4. Ground strip: PixelLab cobblestone tileset repeat-x
//   5. Ground contact shadow
//   6. Darkening overlay (scene 7)
//
// CRITICAL: Buildings div is NOT inside the opacity/scale wrapper.
// The opacity wrapper creates a stacking context that would trap
// the buildings z-index and prevent it from occluding far-lane NPCs.
// Buildings use their own opacity derived from the same fade value.
//
// GROUND_Y = 820 (floor at ~76% of 1080px height)
// ============================================================

export const LANE_A_Y = SIDEVIEW_LANES.A;
export const LANE_B_Y = SIDEVIEW_LANES.B;
export const LANE_C_Y = SIDEVIEW_LANES.C;

const BUILDINGS_NARROW = SIDEVIEW_BACKGROUND_ASSETS.buildings;

const BUILDING_UPSCALE = 4;
const BUILDING_NATIVE = 128;
const BUILDING_W = BUILDING_NATIVE * BUILDING_UPSCALE; // 512px
const BUILDING_H = BUILDING_W;
const BUILDING_NEG_MARGIN = -90;
const BUILDING_BOT_PUSH = 90;

// Z-index for buildings: LANE_A_Y=790 < 800 < LANE_B_Y=820 < LANE_C_Y=850
// Far-lane NPCs (790) go BEHIND buildings; mid and near-lane go IN FRONT
export const BUILDING_Z_INDEX = SIDEVIEW_BACKGROUND_ASSETS.layerZ.buildings;

// Cobblestone tileset: PixelLab sidescroller tile, 32px native, upscale x5
const COBBLE_TILE_PATH = SIDEVIEW_BACKGROUND_ASSETS.cobblestoneTile;
const COBBLE_NATIVE = 32;
const COBBLE_UPSCALE = 5;
const COBBLE_SIZE = COBBLE_NATIVE * COBBLE_UPSCALE; // 160px

const GROUND_STRIP_H = SIDEVIEW_COORDS.height - GROUND_Y; // 260px

interface Props {
  localFrame: number;
  totalDuration: number;
  darkenOverlay?: number;
  fadeInFrames?: number;
}

export const SideViewBackground: React.FC<Props> = ({
  localFrame,
  totalDuration,
  darkenOverlay = 0,
  fadeInFrames = 0,
}) => {
  const opacity =
    fadeInFrames > 0
      ? interpolate(localFrame, [0, fadeInFrames], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const scale = interpolate(localFrame, [0, totalDuration], [1.0, 1.015], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tilesNeeded = Math.ceil(SIDEVIEW_COORDS.width / COBBLE_SIZE) + 1;

  return (
    <AbsoluteFill>
      {/* Sky + ground base + cobblestone — inside scale/fade wrapper */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {/* Layer 1: Sky */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: SIDEVIEW_COORDS.width,
            height: GROUND_Y,
            background:
              "linear-gradient(180deg, #5a7fa0 0%, #8db4cc 35%, #c8b890 70%, #ddc898 100%)",
          }}
        />

        {/* Layer 2: Wall strip — fills gap behind building bottoms */}
        <div
          style={{
            position: "absolute",
            top: GROUND_Y - BUILDING_BOT_PUSH,
            left: 0,
            width: SIDEVIEW_COORDS.width,
            height: BUILDING_BOT_PUSH + GROUND_STRIP_H,
            backgroundColor: "#7a6e60",
          }}
        />

        {/* Layer 3: Ground — PixelLab cobblestone tileset repeat-x */}
        <div
          style={{
            position: "absolute",
            top: GROUND_Y,
            left: 0,
            width: SIDEVIEW_COORDS.width,
            height: GROUND_STRIP_H,
            overflow: "hidden",
          }}
        >
          {Array.from({ length: tilesNeeded }).map((_, i) => (
            <Img
              key={i}
              src={staticFile(COBBLE_TILE_PATH)}
              style={{
                position: "absolute",
                top: 0,
                left: i * COBBLE_SIZE,
                width: COBBLE_SIZE,
                height: COBBLE_SIZE,
                imageRendering: "pixelated",
              }}
            />
          ))}
        </div>

        {/* Layer 4: Ground contact shadow */}
        <div
          style={{
            position: "absolute",
            top: GROUND_Y - 4,
            left: 0,
            width: SIDEVIEW_COORDS.width,
            height: 36,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Buildings — OUTSIDE the opacity/scale wrapper to avoid stacking context trap */}
      {/* Their z-index=800 is now in the same stacking context as NPC z-indexes */}
      <div
        style={{
          position: "absolute",
          top: GROUND_Y - BUILDING_H + BUILDING_BOT_PUSH,
          left: 0,
          width: SIDEVIEW_COORDS.width,
          height: BUILDING_H,
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          zIndex: BUILDING_Z_INDEX,
          opacity,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {BUILDINGS_NARROW.map((src, i) => (
          <Img
            key={i}
            src={staticFile(src)}
            style={{
              width: BUILDING_W,
              height: BUILDING_H,
              imageRendering: "pixelated",
              objectFit: "fill",
              flexShrink: 0,
              marginLeft: i > 0 ? BUILDING_NEG_MARGIN : 0,
            }}
          />
        ))}
      </div>

      {/* Darkening overlay for scene 7 */}
      {darkenOverlay > 0 && (
        <AbsoluteFill
          style={{ backgroundColor: `rgba(0, 0, 0, ${darkenOverlay})` }}
        />
      )}
    </AbsoluteFill>
  );
};
