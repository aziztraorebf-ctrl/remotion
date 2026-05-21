/**
 * Demo A — Globe Mapbox + reticule sur Montreal + panel style CartoCaspian
 * Prouve generalite cross-continent (Niger -> Montreal) + style alternatif (caspian).
 */

import React from "react";
import { GlobeLocationReveal } from "../components/inserts/GlobeLocationReveal";

export const GLOBE_MONTREAL_FRAMES = 150;

export const GlobeMontrealDemo: React.FC = () => (
  <GlobeLocationReveal
    targetCoord={[-73.5728, 45.50283]}
    primaryLabel="MONTREAL"
    secondaryLabel="QUEBEC, CANADA"
    style="caspian"
    panelMode="city"
    durationFrames={GLOBE_MONTREAL_FRAMES}
    highlightColor="#a05a3a"
    accentColor="#a05a3a"
  />
);
