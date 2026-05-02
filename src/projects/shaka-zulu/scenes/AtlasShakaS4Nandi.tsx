// S4 Nandi — Atlas Shaka Zulu
// Bascule palette or -> bordeaux + insert "4 000" compteur sanglant spring lourd
// Duree : 45.4s (frames 2827 -> 4189 globale, 0 -> 1361 local)
//
// VAGUE 1 : palette transition + counter spring + texte JSA + dramaLine
// VAGUE 2 : ajouter Nandi spectre + fracture carte (Kimi Q4)

import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SHAKA_PALETTE, SHAKA_FONTS } from "../components/AtlasShakaPalette";
import { paletteTransition, backgroundTransition } from "../helpers/paletteTransition";
import { counterSpring } from "../helpers/counterSpring";
import { InsertNombre4000 } from "../inserts/InsertNombre4000";

export interface AtlasShakaS4NandiProps {
  durationFrames: number;
  // Frame locale a S4 ou Nandi meurt (NARRATIVE_BEATS.NANDI_MEURT - SEGMENTS.S4_NANDI.startFrame)
  nandiMeurtFrameLocal: number;
  // Frame locale du compteur 4000 (INSERTS.S4_NOMBRE_4000.triggerFrame - S4 startFrame)
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

  // Fond : assombrissement progressif
  const backgroundColor = backgroundTransition(
    frame,
    nandiMeurtFrameLocal,
    60,
    "#1A1208",
    "#0D0000"
  );

  // Compteur 4000 visible
  const insertVisible =
    frame >= insertNombre4000FrameLocal &&
    frame < insertNombre4000FrameLocal + insertNombre4000Duration;

  // Compteur spring
  const counter = counterSpring({
    frame,
    startFrame: insertNombre4000FrameLocal,
    target: 4000,
    counterDurationFrames: 30,
    fps,
    mass: 3,
    damping: 15,
    stiffness: 100,
  });

  // DramaLine "Pour n'avoir pas pleuré assez fort." apparait a la fin du counter (~frame 122s = local frame ~880)
  // En frame Remotion : 122.680s * 30 - S4 start * 30 = (122.680 - 94.240) * 30 = ~853
  const dramaLineFrame = 853;
  const dramaLineSpring = spring({
    frame: Math.max(0, frame - dramaLineFrame),
    fps,
    config: { damping: 15, stiffness: 80 },
    from: 0,
    to: 1,
  });
  const dramaLineVisible = frame >= dramaLineFrame;

  // Fade global
  const opacity = interpolate(
    frame,
    [0, 12, durationFrames - 15, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: backgroundColor, opacity }}>
      {/* Fond : carte stylisee qui change de palette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${accentColor}20 0%, ${backgroundColor} 70%)`,
        }}
      />

      {/* Insert "4 000" compteur sanglant — Remotion pur (InsertNombre4000) */}
      {insertVisible && (
        <Sequence from={insertNombre4000FrameLocal} durationInFrames={insertNombre4000Duration}>
          <InsertNombre4000 durationFrames={insertNombre4000Duration} />
        </Sequence>
      )}

      {/* Drama line */}
      {dramaLineVisible && (
        <div
          style={{
            position: "absolute",
            bottom: 100,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 56,
            fontWeight: 700,
            fontFamily: SHAKA_FONTS.TITRE,
            color: SHAKA_PALETTE.BORDEAUX,
            letterSpacing: "0.04em",
            opacity: dramaLineSpring,
            transform: `translateY(${(1 - dramaLineSpring) * 20}px)`,
            textShadow: "0 4px 20px rgba(0,0,0,0.9)",
          }}
        >
          Pour n'avoir pas pleuré assez fort.
        </div>
      )}
    </AbsoluteFill>
  );
};
