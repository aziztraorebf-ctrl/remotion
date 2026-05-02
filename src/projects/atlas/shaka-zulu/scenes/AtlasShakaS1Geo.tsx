// S1 Setup geo — Atlas Shaka Zulu
// Carte d3-geo reelle KwaZulu-Natal via AtlasMercator
// Duree : 16.2s (frames 167 -> 653 globale, 0 -> 486 local)

import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import {
  AtlasMercator,
  AtlasLabel,
  AtlasPulseMarker,
  AtlasCartouche,
  AtlasDefs,
} from "../../_shared/atlas-components";
import shakaData from "../../_shared/shaka-zulu-data.json";
import { SHAKA_PALETTE } from "../components/AtlasShakaPalette";
import { InsertNombre1500 } from "../inserts/InsertNombre1500";

export interface AtlasShakaS1GeoProps {
  durationFrames: number;
  insertNombre1500: { triggerFrameLocal: number; durationFrames: number };
}

export const AtlasShakaS1Geo: React.FC<AtlasShakaS1GeoProps> = ({
  durationFrames,
  insertNombre1500,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera : zoom continu 0.9 -> 1.15 sur les 8 premieres secondes
  const scale = interpolate(frame, [0, fps * 8], [0.9, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Drift lent pour donner vie a la carte
  const driftX = Math.sin(frame * 0.012) * 14;
  const driftY = Math.cos(frame * 0.009) * 8;

  // Fade global
  const opacity = interpolate(
    frame,
    [0, 12, durationFrames - 12, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Insert "1 500" : visible pendant durationFrames a partir de triggerFrameLocal
  const insertVisible =
    frame >= insertNombre1500.triggerFrameLocal &&
    frame < insertNombre1500.triggerFrameLocal + insertNombre1500.durationFrames;

  const territoire = shakaData.territoire;
  const places = territoire.places as unknown as Record<string, [number, number]>;

  // ZAF = Afrique du Sud (royaume Zulu) en creme, voisins en terracotta
  const highlightFills: Record<string, string> = {
    ZAF: "#F5EBD8",
    SWZ: "#E8D8C0",
    LSO: "#E8D8C0",
  };

  return (
    <AbsoluteFill style={{ background: "#1A1F3A", opacity }}>
      <svg
        width="720"
        height="1280"
        viewBox="0 0 720 1280"
        style={{ position: "absolute", inset: 0 }}
      >
        <AtlasDefs />

        {/* Fond radial sombre */}
        <rect width="720" height="1280" fill="url(#bgGrad)" />

        {/* Carte plate Africa du Sud + voisins */}
        <AtlasMercator
          countries={territoire.countries as { iso: string; d: string }[]}
          highlightIso={["ZAF", "SWZ", "LSO"]}
          highlightFills={highlightFills}
          scale={scale}
          driftX={driftX}
          driftY={driftY}
        />

        {/* Marqueur capital Zulu */}
        <AtlasPulseMarker
          coord={places["uMgungundlovu"]}
          beatStart={30}
          color={SHAKA_PALETTE.BORDEAUX}
        />

        {/* Marqueur Gqokli Hill */}
        <AtlasPulseMarker
          coord={places["GqokliHill"]}
          beatStart={60}
          color={SHAKA_PALETTE.OR}
          ringInner={3}
          ringOuter={12}
        />

        {/* Labels lieux cles */}
        <AtlasLabel
          coord={places["uMgungundlovu"]}
          text="uMgungundlovu"
          appearAt={30}
          offsetY={-42}
          fontSize={22}
        />
        <AtlasLabel
          coord={places["GqokliHill"]}
          text="Gqokli Hill"
          appearAt={60}
          offsetX={-80}
          offsetY={-38}
          fontSize={20}
        />

        {/* Cartouche "ROYAUME ZULU — 1816" : apparait apres le zoom (frame 60) */}
        <AtlasCartouche
          appearAt={60}
          disappearAt={durationFrames - 20}
          text="ROYAUME ZULU"
          subtext="1816"
          x={360}
          y={200}
          fontSize={38}
        />

        {/* Vignette */}
        <rect width="720" height="1280" fill="url(#vignette)" />
      </svg>

      {/* Insert "1 500" overlay — Remotion pur (InsertNombre1500) */}
      {insertVisible && (
        <div style={{ position: "absolute", inset: 0 }}>
          <Sequence
            from={insertNombre1500.triggerFrameLocal}
            durationInFrames={insertNombre1500.durationFrames}
          >
            <InsertNombre1500 durationFrames={insertNombre1500.durationFrames} />
          </Sequence>
        </div>
      )}
    </AbsoluteFill>
  );
};
