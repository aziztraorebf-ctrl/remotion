// Composant insert reutilisable — Atlas Shaka Zulu
// Utilise pour : iklwa S2 A1, bouclier S2 A2, "1 500" S1, "4 000" S4, "90%" Gqokli
//
// Affiche : background + visual (image OU texte geant) + label optionnel + sublabel optionnel
// Animation : fade in/out via interpolate, optional scale/rotation

import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export interface AtlasShakaInsertProps {
  // Visuel principal
  imagePath?: string;       // ex: "atlas-shaka-zulu/inserts/gemini/iklwa-parchemin.png"
  bigText?: string;         // alternative a l'image (ex: "1 500", "4 000", "90 %")
  bigTextColor?: string;
  bigTextSize?: number;

  // Labels textuels
  label?: string;
  sublabel?: string;
  labelColor?: string;
  sublabelColor?: string;

  // Layout & animation
  background?: string;      // defaut noir profond
  fadeInFrames?: number;    // defaut 10
  fadeOutFrames?: number;   // defaut 10
  totalDurationFrames: number;

  // Optional : rotation animee (S2 iklwa frappe)
  rotateFromDeg?: number;
  rotateToDeg?: number;
  rotateStartFrame?: number;
  rotateDurationFrames?: number;

  // Optional : spring scale (S4 compteur)
  springScale?: { mass: number; damping: number; stiffness: number };
}

const PALETTE = {
  NOIR: "#0D0D0D",
  PARCHEMIN: "#F5E6C8",
  OR: "#C8A84B",
};

export const AtlasShakaInsert: React.FC<AtlasShakaInsertProps> = ({
  imagePath,
  bigText,
  bigTextColor = "#C8A84B",
  bigTextSize = 220,
  label,
  sublabel,
  labelColor = "#F5E6C8",
  sublabelColor = "#9E9E9E",
  background = PALETTE.NOIR,
  fadeInFrames = 10,
  fadeOutFrames = 10,
  totalDurationFrames,
  rotateFromDeg = 0,
  rotateToDeg = 0,
  rotateStartFrame = 0,
  rotateDurationFrames = 30,
  springScale,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in/out global
  const opacity = interpolate(
    frame,
    [0, fadeInFrames, totalDurationFrames - fadeOutFrames, totalDurationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Rotation (iklwa strike)
  const rotation = rotateFromDeg !== rotateToDeg
    ? interpolate(
        frame,
        [rotateStartFrame, rotateStartFrame + rotateDurationFrames],
        [rotateFromDeg, rotateToDeg],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  // Spring scale (compteur sanglant 4000)
  const scale = springScale
    ? spring({ frame, fps, config: springScale, from: 0.5, to: 1 })
    : 1;

  return (
    <AbsoluteFill style={{ background, opacity, justifyContent: "center", alignItems: "center" }}>
      {/* Visuel principal */}
      <div style={{ transform: `rotate(${rotation}deg) scale(${scale})`, marginBottom: 40 }}>
        {imagePath && (
          <Img
            src={staticFile(imagePath)}
            style={{ maxHeight: 700, maxWidth: 900, objectFit: "contain" }}
          />
        )}
        {bigText && (
          <div
            style={{
              fontSize: bigTextSize,
              fontWeight: 900,
              color: bigTextColor,
              fontFamily: '"Anton", "Bebas Neue", sans-serif',
              letterSpacing: "0.02em",
              textShadow: "0 10px 30px rgba(139, 0, 0, 0.7), 0 0 60px rgba(139, 0, 0, 0.3)",
            }}
          >
            {bigText}
          </div>
        )}
      </div>

      {/* Label */}
      {label && (
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: labelColor,
            marginTop: 20,
            letterSpacing: "0.05em",
            textAlign: "center",
          }}
        >
          {label}
        </div>
      )}

      {/* Sublabel */}
      {sublabel && (
        <div
          style={{
            fontSize: 32,
            fontWeight: 400,
            color: sublabelColor,
            marginTop: 16,
            fontStyle: "italic",
            textAlign: "center",
            maxWidth: 1200,
          }}
        >
          {sublabel}
        </div>
      )}
    </AbsoluteFill>
  );
};
