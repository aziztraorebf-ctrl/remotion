// S3 Expansion — Atlas Shaka Zulu
// Territoire grandit + bar chart 1 500 -> 50 000 + ligne "20% vs 5% Europe"
// Duree : 20.3s (frames 2195 -> 2804 globale, 0 -> 608 local)

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SHAKA_PALETTE, SHAKA_FONTS } from "../components/AtlasShakaPalette";

export interface AtlasShakaS3ExpansionProps {
  durationFrames: number;
}

export const AtlasShakaS3Expansion: React.FC<AtlasShakaS3ExpansionProps> = ({ durationFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cercle territoire grandit : 50km -> 200km sur toute la duree
  const territoryRadius = interpolate(frame, [0, 400], [80, 350], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bar chart visible frames 150 -> 450
  const barchartVisible = frame >= 150 && frame < 450;
  const barchartLocalFrame = frame - 150;

  // Bar 1816 (1500) : fill animation 0 -> 100% sur 30 frames
  const bar1816Width = interpolate(barchartLocalFrame, [0, 30], [0, 1500 / 50000], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bar 1828 (50000) : fill 0 -> 100% de frame 60 a 100
  const bar1828Width = interpolate(barchartLocalFrame, [60, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Stats line "20% vs 5%" : apparait frame 200 (local barchart)
  const statsLineSpring = spring({
    frame: Math.max(0, barchartLocalFrame - 130),
    fps,
    config: { damping: 15, stiffness: 100 },
    from: 0,
    to: 1,
  });

  // Label "30 000 km²" apparait quand le territoire est plein (frame 400)
  const territoryLabelSpring = spring({
    frame: Math.max(0, frame - 400),
    fps,
    config: { damping: 15, stiffness: 100 },
    from: 0,
    to: 1,
  });

  // Fade global
  const opacity = interpolate(
    frame,
    [0, 12, durationFrames - 12, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: SHAKA_PALETTE.CARTE_FOND, opacity }}>
      {/* Fond carte fake */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${SHAKA_PALETTE.CARTE_FOND} 0%, #0A0805 100%)`,
        }}
      />

      {/* Cercle territoire qui grandit */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: territoryRadius * 2,
            height: territoryRadius * 2,
            borderRadius: "50%",
            background: `${SHAKA_PALETTE.BORDEAUX}40`,
            border: `3px solid ${SHAKA_PALETTE.BORDEAUX}`,
            boxShadow: `0 0 80px ${SHAKA_PALETTE.BORDEAUX}60`,
            transition: "none",
          }}
        />
      </AbsoluteFill>

      {/* Label "30 000 km²" */}
      {territoryLabelSpring > 0 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${territoryLabelSpring})`,
            fontSize: 88,
            fontWeight: 900,
            fontFamily: SHAKA_FONTS.TITRE,
            color: SHAKA_PALETTE.OR,
            letterSpacing: "0.04em",
            opacity: territoryLabelSpring,
            textShadow: "0 4px 20px rgba(0,0,0,0.9)",
          }}
        >
          ~30 000 km²
        </div>
      )}

      {/* Bar chart overlay */}
      {barchartVisible && (
        <AbsoluteFill
          style={{
            background: "rgba(13, 13, 13, 0.85)",
            justifyContent: "center",
            alignItems: "center",
            padding: 80,
          }}
        >
          <div style={{ width: 1200, maxWidth: "90%" }}>
            {/* Bar 1816 */}
            <div style={{ marginBottom: 40 }}>
              <div
                style={{
                  fontSize: 32,
                  color: SHAKA_PALETTE.PARCHEMIN,
                  fontFamily: SHAKA_FONTS.TITRE,
                  marginBottom: 8,
                }}
              >
                1816 — 1 500 guerriers
              </div>
              <div style={{ height: 60, background: "#1A1A1A", borderRadius: 4, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${bar1816Width * 100}%`,
                    height: "100%",
                    background: SHAKA_PALETTE.OR,
                    transition: "none",
                  }}
                />
              </div>
            </div>

            {/* Bar 1828 */}
            <div style={{ marginBottom: 60 }}>
              <div
                style={{
                  fontSize: 32,
                  color: SHAKA_PALETTE.PARCHEMIN,
                  fontFamily: SHAKA_FONTS.TITRE,
                  marginBottom: 8,
                }}
              >
                1828 — 50 000 guerriers
              </div>
              <div style={{ height: 60, background: "#1A1A1A", borderRadius: 4, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${bar1828Width * 100}%`,
                    height: "100%",
                    background: SHAKA_PALETTE.BORDEAUX,
                    transition: "none",
                  }}
                />
              </div>
            </div>

            {/* Stats line */}
            <div
              style={{
                fontSize: 38,
                fontWeight: 700,
                color: SHAKA_PALETTE.OR,
                textAlign: "center",
                opacity: statsLineSpring,
                transform: `translateY(${(1 - statsLineSpring) * 20}px)`,
                fontFamily: SHAKA_FONTS.TITRE,
                letterSpacing: "0.04em",
              }}
            >
              20 % de la population aux armes
              <div style={{ fontSize: 28, color: SHAKA_PALETTE.PARCHEMIN, marginTop: 12, fontWeight: 400 }}>
                vs 5 % en Europe
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
