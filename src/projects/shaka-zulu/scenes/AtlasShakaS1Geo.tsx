// S1 Setup geo — Atlas Shaka Zulu
// Globe ortho zoom KwaZulu-Natal + insert "1 500" geant 3s
// Duree : 16.2s (frames 167 -> 653 globale, 0 -> 486 local)
//
// VAGUE 1 : version simplifiee sans d3-geo (cercle + label).
// VAGUE 2 : remplacer par vraie carte d3-geo + Natural Earth.

import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SHAKA_PALETTE, SHAKA_FONTS } from "../components/AtlasShakaPalette";
import { AtlasShakaInsert } from "../components/AtlasShakaInsert";

export interface AtlasShakaS1GeoProps {
  durationFrames: number;
  // Insert "1 500" trigger (relatif au debut de S1)
  insertNombre1500: { triggerFrameLocal: number; durationFrames: number };
}

export const AtlasShakaS1Geo: React.FC<AtlasShakaS1GeoProps> = ({
  durationFrames,
  insertNombre1500,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Globe ortho fake : grand cercle radial gradient qui zoom
  const zoom = interpolate(frame, [0, 60], [1.0, 2.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulse subtil sur le cercle KwaZulu-Natal
  const pulse = 1 + Math.sin(frame * 0.05) * 0.03;

  // Label "KwaZulu-Natal" apparait frame 30
  const labelSpring = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 15, stiffness: 120 },
    from: 0,
    to: 1,
  });

  // Insert "1 500" : visible pendant durationFrames a partir de triggerFrameLocal
  const insertVisible =
    frame >= insertNombre1500.triggerFrameLocal &&
    frame < insertNombre1500.triggerFrameLocal + insertNombre1500.durationFrames;

  // Fade global
  const opacity = interpolate(
    frame,
    [0, 12, durationFrames - 12, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: SHAKA_PALETTE.CARTE_FOND, opacity }}>
      {/* Fake globe : grand cercle radial gradient zoom */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: 1200,
            height: 1200,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, ${SHAKA_PALETTE.PARCHEMIN} 0%, ${SHAKA_PALETTE.OR}90 30%, ${SHAKA_PALETTE.BORDEAUX}70 60%, ${SHAKA_PALETTE.CARTE_FOND} 90%)`,
            transform: `scale(${zoom * pulse})`,
            opacity: 0.85,
            boxShadow: "inset -40px -40px 100px rgba(0,0,0,0.5), 0 0 100px rgba(200, 168, 75, 0.3)",
          }}
        />
      </AbsoluteFill>

      {/* Marker KwaZulu-Natal */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "55%",
          transform: "translate(-50%, -50%)",
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: SHAKA_PALETTE.BORDEAUX,
          boxShadow: `0 0 30px ${SHAKA_PALETTE.BORDEAUX}, 0 0 60px ${SHAKA_PALETTE.BORDEAUX}80`,
          opacity: labelSpring,
        }}
      />

      {/* Label */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "62%",
          transform: `translate(-50%, 0) scale(${labelSpring})`,
          fontSize: 56,
          fontWeight: 900,
          fontFamily: SHAKA_FONTS.TITRE,
          color: SHAKA_PALETTE.OR,
          letterSpacing: "0.08em",
          opacity: labelSpring,
          textShadow: "0 4px 20px rgba(0,0,0,0.9)",
        }}
      >
        KwaZulu-Natal
      </div>

      {/* Insert "1 500" overlay */}
      {insertVisible && (
        <div
          style={{
            position: "absolute",
            inset: 0,
          }}
        >
          <Sequence
            from={insertNombre1500.triggerFrameLocal}
            durationInFrames={insertNombre1500.durationFrames}
          >
            <AtlasShakaInsert
              bigText="1 500"
              bigTextColor={SHAKA_PALETTE.OR}
              bigTextSize={280}
              sublabel="personnes"
              sublabelColor={SHAKA_PALETTE.PARCHEMIN}
              totalDurationFrames={insertNombre1500.durationFrames}
            />
          </Sequence>
        </div>
      )}
    </AbsoluteFill>
  );
};
