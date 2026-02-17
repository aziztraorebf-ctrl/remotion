import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";

// ============================================================
// MedievalTownBackground v5 -- PixelLab Pixflux low top-down
//
// PixelLab-generated background (320x180 native, upscaled 1920x1080).
// Low top-down perspective matches PixelLab character sprites natively.
// Characters are placed by Y position for natural depth sorting.
// ============================================================

// Walkable area: TRAPEZOID following the street perspective.
// The cobblestone street is narrow at the back (near church) and wide at the front.
// Characters MUST stay inside this trapezoid to avoid walking on rooftops/walls.
export const TOWN_Y_MIN = 520; // top of walkable area (furthest from camera)
export const TOWN_Y_MAX = 920; // bottom of walkable area (closest to camera)

// Trapezoid X boundaries as a function of Y position.
// At Y_MIN (back): street is ~300px wide, centered at 960
// At Y_MAX (front): street is ~1200px wide, centered at 960
const BACK_X_LEFT = 810;
const BACK_X_RIGHT = 1110;
const FRONT_X_LEFT = 360;
const FRONT_X_RIGHT = 1560;

// Returns the valid X range [xMin, xMax] for a given Y position.
export function walkableXRange(y: number): { xMin: number; xMax: number } {
  const t = Math.max(0, Math.min(1, (y - TOWN_Y_MIN) / (TOWN_Y_MAX - TOWN_Y_MIN)));
  return {
    xMin: Math.round(BACK_X_LEFT + t * (FRONT_X_LEFT - BACK_X_LEFT)),
    xMax: Math.round(BACK_X_RIGHT + t * (FRONT_X_RIGHT - BACK_X_RIGHT)),
  };
}

// Fountain obstacle: characters should not overlap the fountain (~960, 580-640)
export const FOUNTAIN_CENTER_X = 960;
export const FOUNTAIN_Y_MIN = 560;
export const FOUNTAIN_Y_MAX = 660;
export const FOUNTAIN_RADIUS_X = 80;

interface Props {
  localFrame: number;
  totalDuration: number;
  darkenOverlay?: number;
  /** If true, fade in over first 8 frames */
  layeredReveal?: boolean;
}

export const MedievalTownBackground: React.FC<Props> = ({
  localFrame,
  totalDuration,
  darkenOverlay = 0,
  layeredReveal = false,
}) => {
  // Reveal: simple fade in
  const opacity = layeredReveal
    ? interpolate(localFrame, [0, 8], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // Subtle Ken Burns: very slow zoom (1.0 -> 1.015) + slight pan
  const scale = interpolate(localFrame, [0, totalDuration], [1.0, 1.015], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const panX = interpolate(localFrame, [0, totalDuration], [0, -5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Town background -- PixelLab Pixflux low top-down */}
      <div
        style={{
          opacity,
          width: 1920,
          height: 1080,
          overflow: "hidden",
          transform: `scale(${scale}) translateX(${panX}px)`,
          transformOrigin: "center center",
        }}
      >
        <Img
          src={staticFile("assets/peste-pixel/pixellab/backgrounds/town-square-warm-1920x1080.png")}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1920,
            height: 1080,
            imageRendering: "pixelated",
          }}
        />
      </div>

      {/* Darken overlay for scene 7 transition */}
      {darkenOverlay > 0 && (
        <AbsoluteFill
          style={{ backgroundColor: `rgba(0, 0, 0, ${darkenOverlay})` }}
        />
      )}
    </AbsoluteFill>
  );
};
