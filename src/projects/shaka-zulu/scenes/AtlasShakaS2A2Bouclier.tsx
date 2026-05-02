// S2 A2 Bouclier — Atlas Shaka Zulu
// Plein ecran bouclier + animation rotation poignet (boucle 4 directions warrior sprite)
// Duree : 12.1s (frames 1130 -> 1493 globale, 0 -> 363 local)

import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SHAKA_PALETTE, SHAKA_FONTS } from "../components/AtlasShakaPalette";

export interface AtlasShakaS2A2BouclierProps {
  imageVariant?: "gemini-parchemin" | "gemini-pixellab" | "pixellab-mcp";
  durationFrames: number;
}

export const AtlasShakaS2A2Bouclier: React.FC<AtlasShakaS2A2BouclierProps> = ({
  imageVariant = "gemini-parchemin",
  durationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imagePath =
    imageVariant === "gemini-parchemin"
      ? "atlas-shaka-zulu/inserts/gemini/bouclier-parchemin.png"
      : imageVariant === "gemini-pixellab"
      ? "atlas-shaka-zulu/inserts/gemini/bouclier-pixellab-style.png"
      : "atlas-shaka-zulu/inserts/pixellab/bouclier-side.png";

  // Spring scale d'apparition
  const scaleIn = spring({ frame, fps, config: { damping: 12, stiffness: 100 }, from: 0.7, to: 1 });

  // Rotation oscillante "tourner le poignet" : -15deg <-> +15deg pendant audio "tourner le poignet"
  // Effet plus subtil et lisible qu'un tour complet
  const inWristPhase = frame >= 120 && frame < 240;
  const wristRotation = inWristPhase ? Math.sin((frame - 120) * 0.15) * 15 : 0;

  // Fade in/out
  const opacity = interpolate(
    frame,
    [0, 15, durationFrames - 15, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: SHAKA_PALETTE.NOIR_PROFOND, opacity }}>
      {/* Bouclier centre avec rotation poignet */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            transform: `rotate(${wristRotation}deg) scale(${scaleIn})`,
            transformOrigin: "center center",
          }}
        >
          <Img
            src={staticFile(imagePath)}
            style={{
              width: 900,
              height: 900,
              objectFit: "contain",
              imageRendering: imageVariant === "pixellab-mcp" ? "pixelated" : "auto",
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Label haut */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 64,
          fontWeight: 900,
          fontFamily: SHAKA_FONTS.TITRE,
          color: SHAKA_PALETTE.OR,
          letterSpacing: "0.05em",
          textShadow: "0 4px 20px rgba(0, 0, 0, 0.9)",
        }}
      >
        Le bouclier
      </div>

      {/* Sublabel bas */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 36,
          fontWeight: 400,
          fontFamily: SHAKA_FONTS.CORPS,
          color: SHAKA_PALETTE.PARCHEMIN,
          fontStyle: "italic",
        }}
      >
        Arme défensive → offensive
      </div>
    </AbsoluteFill>
  );
};
