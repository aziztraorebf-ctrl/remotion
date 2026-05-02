// S2 A1 Iklwa — Atlas Shaka Zulu
// Plein ecran iklwa avec frappe descendante (rotateZ 0 -> -45deg sur 30 frames)
// Duree : 14.9s (frames 683 -> 1130 dans la video globale, 0 -> 447 en local)

import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SHAKA_PALETTE, SHAKA_FONTS } from "../components/AtlasShakaPalette";

export interface AtlasShakaS2A1IklwaProps {
  imageVariant?: "gemini-parchemin" | "gemini-pixellab" | "pixellab-mcp";
  durationFrames: number;
}

export const AtlasShakaS2A1Iklwa: React.FC<AtlasShakaS2A1IklwaProps> = ({
  imageVariant = "gemini-parchemin",
  durationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imagePath =
    imageVariant === "gemini-parchemin"
      ? "atlas-shaka-zulu/inserts/gemini/iklwa-parchemin.png"
      : imageVariant === "gemini-pixellab"
      ? "atlas-shaka-zulu/inserts/gemini/iklwa-pixellab-style.png"
      : "atlas-shaka-zulu/inserts/pixellab/iklwa-side.png";

  // Frappe descendante : 0 -> -45deg de frame 60 a 90 (synchro audio "L'iklwa")
  const rotation = interpolate(
    frame,
    [60, 90],
    [0, -45],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Spring scale d'apparition
  const scaleIn = spring({ frame, fps, config: { damping: 12, stiffness: 100 }, from: 0.7, to: 1 });

  // Fade in/out
  const opacity = interpolate(
    frame,
    [0, 15, durationFrames - 15, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: SHAKA_PALETTE.NOIR_PROFOND, opacity }}>
      {/* Iklwa image avec rotation */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            transform: `rotate(${rotation}deg) scale(${scaleIn})`,
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
        L'iklwa
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
        Lance courte — combat rapproché
      </div>
    </AbsoluteFill>
  );
};
