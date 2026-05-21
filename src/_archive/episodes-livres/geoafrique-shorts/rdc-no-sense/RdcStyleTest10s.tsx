/**
 * Test 10s du style Jacq Adi (satellite-streets-v12 + bleu override + projection mercator).
 * Camera : zoom continu de l'espace vers la RDC.
 * Overlay : drapeau RDC plante au-dessus du pays + texte "RDC".
 */

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { MapboxSatelliteBeat, type Keyframe } from "../../_shared/mapbox/MapboxSatelliteBeat";
import { FlagPin } from "../../_shared/components/inserts/FlagPin";

const PALETTE = {
  gold: "#ffd700",
  orange: "#ff8c00",
};

export const RdcStyleTest10s: React.FC = () => {
  const frame = useCurrentFrame();

  // 10s = 300 frames @30fps
  const keyframes: Keyframe[] = [
    { frame: 0,   lon: 10,   lat: 5,    zoom: 1.6, pitch: 0, bearing: 0 },
    { frame: 150, lon: 20,   lat: 0,    zoom: 3.0, pitch: 0, bearing: 0 },
    { frame: 300, lon: 23.5, lat: -2.5, zoom: 4.2, pitch: 0, bearing: 0 },
  ];

  const titleOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <MapboxSatelliteBeat
      iso="COD"
      highlightColor={PALETTE.orange}
      fillOpacity={0.0}
      borderWidth={5}
      keyframes={keyframes}
    >
      <FlagPin
        flag="cd"
        entryAt={90}
        size={130}
        position={{ left: "52%", top: "44%" }}
        glowColor={PALETTE.gold}
      />
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "'Bebas Neue', 'Impact', sans-serif",
            fontSize: 96,
            fontWeight: 900,
            color: PALETTE.gold,
            letterSpacing: 8,
            textShadow: "0 4px 24px rgba(0,0,0,0.85)",
            opacity: titleOpacity,
          }}
        >
          REPUBLIQUE DEMOCRATIQUE DU CONGO
        </div>
      </AbsoluteFill>
    </MapboxSatelliteBeat>
  );
};

export const RDC_STYLE_TEST_10S_FRAMES = 300;
export const RDC_STYLE_TEST_10S_ID = "RdcStyleTest10s";
