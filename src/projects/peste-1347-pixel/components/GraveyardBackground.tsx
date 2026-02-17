import React from "react";
import { Img, interpolate, staticFile } from "remotion";

interface GraveyardBackgroundProps {
  localFrame: number;
  totalDuration: number; // total frames for this scene
  fadeInDuration?: number; // frames for crossfade entrance
  kenBurnsZoom?: number; // target zoom (e.g. 1.05)
  darkenOverlay?: number; // 0-1, progressive dark overlay
}

// CraftPix graveyard background_4 has 7 layers (576x324 native)
// Layer 1 = deepest sky, Layer 7 = foreground
const LAYER_COUNT = 7;
const PARALLAX_FACTORS = [0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.15];

// Path with spaces -- staticFile handles URL encoding
const getLayerPath = (layerIndex: number) =>
  staticFile(
    `assets/peste-pixel/craftpix/graveyard/background 4/${layerIndex + 1}.png`,
  );

export const GraveyardBackground: React.FC<GraveyardBackgroundProps> = ({
  localFrame,
  totalDuration,
  fadeInDuration = 0,
  kenBurnsZoom = 1.05,
  darkenOverlay = 0,
}) => {
  // Entrance fade
  const entranceOpacity =
    fadeInDuration > 0
      ? interpolate(localFrame, [0, fadeInDuration], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  // Ken Burns zoom
  const zoom = interpolate(localFrame, [0, totalDuration], [1.0, kenBurnsZoom], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        width: 1920,
        height: 1080,
        overflow: "hidden",
        opacity: entranceOpacity,
      }}
    >
      {Array.from({ length: LAYER_COUNT }).map((_, i) => {
        const parallaxOffset = localFrame * PARALLAX_FACTORS[i];

        return (
          <Img
            key={i}
            src={getLayerPath(i)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              imageRendering: "pixelated",
              transform: `scale(${zoom}) translateX(${-parallaxOffset}px)`,
              transformOrigin: "center center",
            }}
          />
        );
      })}

      {/* Darken overlay for scene 7 progressive darkness */}
      {darkenOverlay > 0 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#000000",
            opacity: darkenOverlay,
          }}
        />
      )}
    </div>
  );
};
