/**
 * Demo B end-to-end — globe -> reticule -> fade panel -> zoom Mercator Montreal
 *
 * Sequence (420 frames, 14s) :
 *   f0-60    : globe rotation vers Montreal (zoom 1.2 -> 1.6)
 *   f60-100  : reticule pulse + panel slide-up
 *   f100-160 : tient panel + reticule
 *   f160-180 : panel fade out + reticule fade out
 *   f180-260 : zoom intermediaire (zoom 1.6 -> 4.5, projection toujours globe)
 *   f260-320 : transition projection globe -> mercator (zoom 4.5 -> 7)
 *   f320-420 : zoom Mercator final sur centre-ville Montreal (zoom 7 -> 13)
 */

import React from "react";
import { GlobeLocationReveal } from "../components/inserts/GlobeLocationReveal";

export const GLOBE_TO_MERCATOR_FRAMES = 420;

const MTL: [number, number] = [-73.5728, 45.50283];

export const GlobeToMercatorDemo: React.FC = () => (
  <GlobeLocationReveal
    targetCoord={MTL}
    primaryLabel="MONTREAL"
    secondaryLabel="QUEBEC, CANADA"
    style="caspian"
    panelMode="city"
    durationFrames={GLOBE_TO_MERCATOR_FRAMES}
    highlightColor="#a05a3a"
    accentColor="#a05a3a"
    reticleStartFrame={60}
    reticleHideStart={170}
    panelHideStart={170}
    cameraKeyframes={[
      { frame: 0,   lon: MTL[0] - 35, lat: MTL[1] - 5, zoom: 1.2, projection: "globe" },
      { frame: 60,  lon: MTL[0],      lat: MTL[1],     zoom: 1.6, projection: "globe" },
      { frame: 160, lon: MTL[0],      lat: MTL[1],     zoom: 1.6, projection: "globe" },
      { frame: 220, lon: MTL[0],      lat: MTL[1],     zoom: 4.5, projection: "globe" },
      { frame: 280, lon: MTL[0],      lat: MTL[1],     zoom: 7,   projection: "mercator" },
      { frame: 360, lon: MTL[0],      lat: MTL[1],     zoom: 11,  projection: "mercator" },
      { frame: 420, lon: MTL[0],      lat: MTL[1],     zoom: 13,  projection: "mercator" },
    ]}
  />
);
