// Scene test Bloc D — Deformation S4 (MourningWarp + EchoMaternel)
// Carte mourning + cercles concentriques depuis palais + filtre warp

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MapShakaZulu } from "../components/MapShakaZulu";
import { MourningWarp } from "../components/MourningWarp";
import { PaperGrain } from "../components/PaperGrain";
import { PALETTE } from "../timing";
import { SHAKA_PALETTE } from "../components/AtlasShakaPalette";

export const MourningWarpTest: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <PaperGrain intensity={0.18}>
      <AbsoluteFill style={{ background: SHAKA_PALETTE.CARTE_FOND_TRAGIQUE }}>
        <svg
          viewBox="0 0 720 1280"
          width="720"
          height="1280"
          style={{ position: "absolute", inset: 0 }}
        >
          {/* Carte mourning en fond */}
          <MapShakaZulu
            mode="mourning"
            revealStartFrame={0}
            showLabels
            showMarkers
            withGrain={false}
          />

          {/* Echo Maternel — cercles + filtre warp */}
          <MourningWarp
            startFrame={30}
            maxIntensity={0.6}
            ringCount={5}
            ringDuration={90}
            ringInterval={25}
          />

          {/* Label debug */}
          <text
            x="360"
            y="60"
            textAnchor="middle"
            fontFamily="'Inter', sans-serif"
            fontSize="26"
            fontWeight="700"
            fill={PALETTE.BORDEAUX}
            opacity="0.9"
          >
            {`S4 MOURNING — f${frame}`}
          </text>
        </svg>
      </AbsoluteFill>
    </PaperGrain>
  );
};
