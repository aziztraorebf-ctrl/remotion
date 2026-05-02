// S5 CTA — Atlas Shaka Zulu
// Cascade Napoleon / Alexandre / Shaka? + abonne-toi
// Duree : 9.7s (frames 4215 -> 4507 globale, 0 -> 292 local)

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SHAKA_PALETTE, SHAKA_FONTS } from "../components/AtlasShakaPalette";

export interface AtlasShakaS5CTAProps {
  durationFrames: number;
  // Frames locales (relatif au debut S5)
  napoleonFrame: number;
  alexandreFrame: number;
  shakaFrame: number;
  abonneToiFrame: number;
}

export const AtlasShakaS5CTA: React.FC<AtlasShakaS5CTAProps> = ({
  durationFrames,
  napoleonFrame,
  alexandreFrame,
  shakaFrame,
  abonneToiFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Springs pour cascade
  const napoleonSpring = spring({
    frame: Math.max(0, frame - napoleonFrame),
    fps,
    config: { damping: 15, stiffness: 120 },
    from: 0,
    to: 1,
  });
  const alexandreSpring = spring({
    frame: Math.max(0, frame - alexandreFrame),
    fps,
    config: { damping: 15, stiffness: 120 },
    from: 0,
    to: 1,
  });
  const shakaSpring = spring({
    frame: Math.max(0, frame - shakaFrame),
    fps,
    config: { damping: 12, stiffness: 100 },
    from: 0,
    to: 1,
  });
  const abonneToiSpring = spring({
    frame: Math.max(0, frame - abonneToiFrame),
    fps,
    config: { damping: 12, stiffness: 120 },
    from: 0,
    to: 1,
  });

  // Fade global
  const opacity = interpolate(
    frame,
    [0, 12, durationFrames - 20, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: SHAKA_PALETTE.NOIR_PROFOND, opacity }}>
      {/* Fond : silhouette Afrique en bordeaux */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${SHAKA_PALETTE.BORDEAUX}30 0%, ${SHAKA_PALETTE.NOIR_PROFOND} 70%)`,
        }}
      />

      {/* Cascade verticale */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 30 }}>
        {/* Napoleon */}
        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            fontFamily: SHAKA_FONTS.TITRE,
            color: "#7A7A7A",
            opacity: napoleonSpring * 0.85,
            transform: `translateY(${(1 - napoleonSpring) * 20}px)`,
            letterSpacing: "0.04em",
          }}
        >
          Napoléon
        </div>

        {/* Alexandre */}
        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            fontFamily: SHAKA_FONTS.TITRE,
            color: "#7A7A7A",
            opacity: alexandreSpring * 0.85,
            transform: `translateY(${(1 - alexandreSpring) * 20}px)`,
            letterSpacing: "0.04em",
          }}
        >
          Alexandre
        </div>

        {/* Shaka ? */}
        <div
          style={{
            fontSize: 132,
            fontWeight: 900,
            fontFamily: SHAKA_FONTS.TITRE,
            color: SHAKA_PALETTE.OR,
            opacity: shakaSpring,
            transform: `scale(${shakaSpring})`,
            letterSpacing: "0.05em",
            textShadow: "0 0 60px rgba(200, 168, 75, 0.6), 0 4px 20px rgba(0,0,0,0.9)",
            marginTop: 20,
          }}
        >
          Shaka ?
        </div>
      </AbsoluteFill>

      {/* Abonne-toi (bas) */}
      {abonneToiSpring > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 100,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: abonneToiSpring,
            transform: `translateY(${(1 - abonneToiSpring) * 30}px)`,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              fontFamily: SHAKA_FONTS.TITRE,
              color: SHAKA_PALETTE.OR,
              letterSpacing: "0.06em",
              textShadow: "0 4px 20px rgba(0,0,0,0.9)",
            }}
          >
            Abonne-toi
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: SHAKA_PALETTE.PARCHEMIN,
              marginTop: 12,
              fontStyle: "italic",
            }}
          >
            Il y en a d'autres comme lui.
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
