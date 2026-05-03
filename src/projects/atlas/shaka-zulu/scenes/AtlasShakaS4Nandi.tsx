// S4 Nandi — Atlas Shaka Zulu
// AtlasMercator projection mourning + MourningWarp + bascule palette or->bordeaux
// Insert "4 000" compteur sanglant + dramaLine finale
// Duree : 45.4s (frames 2827 -> 4189 globale, 0 -> 1361 local)

import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SHAKA_PALETTE, SHAKA_FONTS } from "../components/AtlasShakaPalette";
import { MourningWarp } from "../components/MourningWarp";
import { paletteTransition, backgroundTransition } from "../helpers/paletteTransition";
import { counterSpring } from "../helpers/counterSpring";
import { InsertNombre4000 } from "../inserts/InsertNombre4000";
import {
  AtlasMercator,
  AtlasDefs,
} from "../../_shared/atlas-components";
import shakaData from "../../_shared/shaka-zulu-data.json";

export interface AtlasShakaS4NandiProps {
  durationFrames: number;
  nandiMeurtFrameLocal: number;
  insertNombre4000FrameLocal: number;
  insertNombre4000Duration: number;
}

export const AtlasShakaS4Nandi: React.FC<AtlasShakaS4NandiProps> = ({
  durationFrames,
  nandiMeurtFrameLocal,
  insertNombre4000FrameLocal,
  insertNombre4000Duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bascule palette or -> bordeaux a la mort de Nandi
  const accentColor = paletteTransition(
    frame,
    nandiMeurtFrameLocal,
    60,
    SHAKA_PALETTE.OR,
    SHAKA_PALETTE.BORDEAUX
  );

  const backgroundColor = backgroundTransition(
    frame,
    nandiMeurtFrameLocal,
    60,
    "#1A1208",
    "#0D0000"
  );

  // Camera : zoom leger sur ZAF, pull-back progressif (moins agressif que S3)
  const camScale = interpolate(frame, [0, durationFrames], [1.8, 1.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const camX = 360 - 420 * camScale;
  const camY = 640 - 720 * camScale;
  const driftX = Math.sin(frame * 0.006) * 3;
  const driftY = Math.cos(frame * 0.005) * 2;

  // Pays ZAF bascule or -> bordeaux fonce avec la mort de Nandi
  const mourning = shakaData.mourning;
  const countries = mourning.countries as { iso: string; d: string }[];

  // Couleur ZAF : or avant Nandi meurt, bordeaux fonce apres
  function lerpHex(t: number, c1: string, c2: string): string {
    const r1 = parseInt(c1.slice(1, 3), 16);
    const g1 = parseInt(c1.slice(3, 5), 16);
    const b1 = parseInt(c1.slice(5, 7), 16);
    const r2 = parseInt(c2.slice(1, 3), 16);
    const g2 = parseInt(c2.slice(3, 5), 16);
    const b2 = parseInt(c2.slice(5, 7), 16);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return `rgb(${r},${g},${b})`;
  }

  const paletteT = interpolate(
    frame,
    [nandiMeurtFrameLocal, nandiMeurtFrameLocal + 90],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const zafColor = lerpHex(paletteT, "#C8A84B", "#4A0A0A");

  const highlightFills: Record<string, string> = {
    ZAF: zafColor,
  };

  // Contour ZAF pulse bordeaux (s'intensifie apres mort Nandi)
  const pulseT = (frame % (fps * 3)) / (fps * 3);
  const borderOpacity = interpolate(paletteT, [0, 1], [0.3, 0.7]) +
    interpolate(paletteT, [0, 1], [0.1, 0.25]) * Math.sin(pulseT * Math.PI * 2);
  const borderWidth = 1.5 + paletteT * 2;
  const zafPath = countries.find((c) => c.iso === "ZAF")?.d ?? "";

  // Insert 4000 visible
  const insertVisible =
    frame >= insertNombre4000FrameLocal &&
    frame < insertNombre4000FrameLocal + insertNombre4000Duration;

  // DramaLine "Pour n'avoir pas pleuré assez fort."
  const dramaLineFrame = 853;
  const dramaLineSpring = spring({
    frame: Math.max(0, frame - dramaLineFrame),
    fps,
    config: { damping: 15, stiffness: 80 },
    from: 0,
    to: 1,
  });

  // Fade global
  const opacity = interpolate(
    frame,
    [0, 12, durationFrames - 15, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: backgroundColor, opacity }}>

      {/* Carte mourning avec camera */}
      <svg
        width="720"
        height="1280"
        viewBox="0 0 720 1280"
        style={{ position: "absolute", inset: 0 }}
      >
        <AtlasDefs />
        <rect width="720" height="1280" fill="url(#bgGrad)" />

        <g transform={`translate(${camX + driftX} ${camY + driftY}) scale(${camScale})`}>

          <AtlasMercator
            countries={countries}
            highlightIso={["ZAF"]}
            highlightFills={highlightFills}
            scale={1}
            driftX={0}
            driftY={0}
          />

          {/* Contour bordeaux ZAF */}
          {zafPath && (
            <path
              d={zafPath}
              fill="none"
              stroke={SHAKA_PALETTE.BORDEAUX}
              strokeWidth={borderWidth / camScale}
              strokeOpacity={borderOpacity}
              strokeLinejoin="round"
            />
          )}

          {/* MourningWarp — cercles concentriques depuis uMgungundlovu */}
          <MourningWarp
            startFrame={nandiMeurtFrameLocal}
            maxIntensity={0.55}
            ringCount={5}
            ringDuration={100}
            ringInterval={35}
          />

        </g>

        <rect width="720" height="1280" fill="url(#vignette)" />
      </svg>

      {/* Halo radial accentue apres mort Nandi */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 55%, ${accentColor}18 0%, transparent 65%)`,
        }}
      />

      {/* Insert "4 000" compteur sanglant */}
      {insertVisible && (
        <Sequence from={insertNombre4000FrameLocal} durationInFrames={insertNombre4000Duration}>
          <InsertNombre4000 durationFrames={insertNombre4000Duration} />
        </Sequence>
      )}

      {/* Drama line finale */}
      {frame >= dramaLineFrame && (
        <div
          style={{
            position: "absolute",
            bottom: 100,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 52,
            fontWeight: 700,
            fontFamily: SHAKA_FONTS.TITRE,
            color: SHAKA_PALETTE.BORDEAUX,
            letterSpacing: "0.04em",
            opacity: dramaLineSpring,
            transform: `translateY(${(1 - dramaLineSpring) * 20}px)`,
            textShadow: "0 4px 20px rgba(0,0,0,0.9)",
            padding: "0 60px",
          }}
        >
          Pour n'avoir pas pleuré assez fort.
        </div>
      )}
    </AbsoluteFill>
  );
};
