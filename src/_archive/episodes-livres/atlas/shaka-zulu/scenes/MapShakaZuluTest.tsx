// Scène de test pour MapShakaZulu — 3 modes en séquence
// territoire (0-90f) | expansion (90-180f) | mourning (180-270f)

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MapShakaZulu } from "../components/MapShakaZulu";
import { PaperGrain } from "../components/PaperGrain";
import { PALETTE } from "../timing";

export const MapShakaZuluTest: React.FC = () => {
  const frame = useCurrentFrame();

  const impiProgress = Math.min(1, Math.max(0, (frame - 90) / 90));

  return (
    <PaperGrain intensity={0.18}>
      <AbsoluteFill style={{ background: PALETTE.NOIR_PROFOND }}>
        <svg
          viewBox="0 0 720 1280"
          width="720"
          height="1280"
          style={{ position: "absolute", inset: 0 }}
        >
          {frame < 90 && (
            <MapShakaZulu
              mode="territoire"
              revealStartFrame={0}
              showLabels
              showMarkers
              showImpiPath={false}
            />
          )}
          {frame >= 90 && frame < 180 && (
            <MapShakaZulu
              mode="expansion"
              revealStartFrame={90}
              showLabels
              showMarkers
              showImpiPath
              impiPathProgress={impiProgress}
            />
          )}
          {frame >= 180 && (
            <MapShakaZulu
              mode="mourning"
              revealStartFrame={180}
              showLabels
              showMarkers
            />
          )}
          <text
            x="360"
            y="60"
            textAnchor="middle"
            fontFamily="'Inter', sans-serif"
            fontSize="28"
            fontWeight="700"
            fill={PALETTE.OR}
            opacity="0.8"
          >
            {frame < 90 ? "TERRITOIRE" : frame < 180 ? "EXPANSION" : "MOURNING"}
          </text>
        </svg>
      </AbsoluteFill>
    </PaperGrain>
  );
};
