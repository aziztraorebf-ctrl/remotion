// S0 Hook — Atlas Shaka Zulu
// Plein ecran Shaka (PixelLab breathing-idle) + 2 lignes texte cascade
// Duree : 4.74s (frames 4 -> 146)

import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { SHAKA_PALETTE, SHAKA_FONTS } from "../components/AtlasShakaPalette";
import { getSpriteFramePath } from "../helpers/spritePlayer";

export const AtlasShakaHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sprite Shaka breathing-idle (4 frames, slow loop)
  const spritePath = getSpriteFramePath(frame, {
    basePath: "atlas-shaka-zulu/characters/shaka/animations/animating-d4924c9b",
    direction: "south",
    totalFrames: 4,
    framesPerSpriteFrame: 12, // ralenti pour breathing (48 frames pour cycle complet)
    startFrame: 0,
  });

  // Halo dore derriere Shaka
  const haloOpacity = interpolate(frame, [0, 30, 142], [0, 0.4, 0.4], {
    extrapolateRight: "clamp",
  });

  // Texte ligne 1 "Il est ne paria." apparait frame 0
  const line1Spring = spring({ frame, fps, config: { damping: 15, stiffness: 120 }, from: 0, to: 1 });

  // Texte ligne 2 "Il est mort roi." apparait frame 50 (synchro avec audio "Il est mort")
  const line2Frame = Math.max(0, frame - 50);
  const line2Spring = spring({ frame: line2Frame, fps, config: { damping: 15, stiffness: 120 }, from: 0, to: 1 });
  const line2Visible = frame >= 50;

  // Fade out final
  const opacity = interpolate(frame, [130, 142], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: SHAKA_PALETTE.NOIR_PROFOND, opacity }}>
      {/* Halo dore */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${SHAKA_PALETTE.OR}40 0%, transparent 60%)`,
          opacity: haloOpacity,
        }}
      />

      {/* Sprite Shaka */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Img
          src={staticFile(spritePath)}
          style={{
            width: 920,
            height: 920,
            imageRendering: "pixelated",
            objectFit: "contain",
            filter: "drop-shadow(0 10px 40px rgba(0, 0, 0, 0.8))",
          }}
        />
      </AbsoluteFill>

      {/* Texte ligne 1 */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 84,
          fontWeight: 900,
          fontFamily: SHAKA_FONTS.TITRE,
          color: SHAKA_PALETTE.PARCHEMIN,
          letterSpacing: "0.04em",
          opacity: line1Spring,
          transform: `translateY(${(1 - line1Spring) * -30}px)`,
          textShadow: "0 4px 20px rgba(0, 0, 0, 0.9)",
        }}
      >
        Il est né paria.
      </div>

      {/* Texte ligne 2 */}
      {line2Visible && (
        <div
          style={{
            position: "absolute",
            bottom: 140,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 84,
            fontWeight: 900,
            fontFamily: SHAKA_FONTS.TITRE,
            color: SHAKA_PALETTE.OR,
            letterSpacing: "0.04em",
            opacity: line2Spring,
            transform: `translateY(${(1 - line2Spring) * 30}px)`,
            textShadow: "0 4px 20px rgba(139, 0, 0, 0.6)",
          }}
        >
          Il est mort roi.
        </div>
      )}
    </AbsoluteFill>
  );
};
