// Insert "4 000 ZULUS PERIRENT" — chiffre choquant + cartouche source historique
// Remotion pur, philosophie Mansa Moussa V2 (typographie + cartouche citation)
//
// Apparition sequentielle :
// 1. Compteur 0 -> 4000 avec spring lourd (mass 3, damping 15)
// 2. Label "Zulus perirent" en parchemin
// 3. Texte dramatique "Pour n'avoir pas pleure assez fort"
// 4. Cartouche bas : "James Stuart Archive · 1928"

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { SHAKA_PALETTE, SHAKA_FONTS } from "../components/AtlasShakaPalette";

interface InsertNombre4000Props {
  durationFrames: number;
}

export const InsertNombre4000: React.FC<InsertNombre4000Props> = ({ durationFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phases
  const counterStart = 0;
  const labelStart = 25;
  const dramaStart = 80;
  const cartoucheStart = 130;

  const counterValue = Math.floor(
    interpolate(frame, [counterStart, counterStart + 30], [0, 4000], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const counterScale = spring({
    frame: frame - counterStart,
    fps,
    config: { mass: 3, damping: 15, stiffness: 100 },
    from: 0.5,
    to: 1,
  });
  const labelT = spring({ frame: frame - labelStart, fps, config: { damping: 16, stiffness: 140 }, from: 0, to: 1 });
  const dramaT = spring({ frame: frame - dramaStart, fps, config: { damping: 18, stiffness: 80 }, from: 0, to: 1 });
  const cartoucheT = spring({ frame: frame - cartoucheStart, fps, config: { damping: 14, stiffness: 200 }, from: 0, to: 1 });

  // Pulse rouge sang continu
  const pulse = 1 + Math.sin(frame * 0.06) * 0.025;

  // Fade global
  const opacity = interpolate(
    frame,
    [0, 8, durationFrames - 12, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: "#0a0000", opacity }}>
      <svg viewBox="0 0 1080 1920" style={{ width: "100%", height: "100%" }}>
        <defs>
          <radialGradient id="bloodGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={SHAKA_PALETTE.BORDEAUX} stopOpacity="0.4" />
            <stop offset="100%" stopColor={SHAKA_PALETTE.BORDEAUX} stopOpacity="0" />
          </radialGradient>
          <filter id="bloodShadow">
            <feDropShadow dx="0" dy="14" stdDeviation="20" floodColor="#8B1A1A" floodOpacity="0.85" />
          </filter>
        </defs>

        {/* Halo rouge derriere le chiffre */}
        <circle
          cx="540" cy="780" r="500"
          fill="url(#bloodGlow)"
          opacity={counterScale}
        />

        {/* === COMPTEUR 4 000 === */}
        <g
          transform={`translate(540 800) scale(${counterScale * pulse})`}
        >
          <text
            x="0" y="0"
            textAnchor="middle"
            fontFamily={SHAKA_FONTS.TITRE}
            fontSize="320"
            fontWeight="900"
            fill={SHAKA_PALETTE.BORDEAUX}
            letterSpacing="-4"
            filter="url(#bloodShadow)"
          >
            {counterValue.toLocaleString("fr-FR").replace(/ /g, " ")}
          </text>
        </g>

        {/* Label "Zulus périrent" */}
        {labelT > 0.05 && (
          <g opacity={labelT} transform={`translate(540 980) scale(${0.9 + 0.1 * labelT})`}>
            <text
              x="0" y="0"
              textAnchor="middle"
              fontFamily={SHAKA_FONTS.TITRE}
              fontSize="56"
              fontWeight="700"
              fill={SHAKA_PALETTE.PARCHEMIN}
              letterSpacing="6"
            >
              ZULUS PÉRIRENT
            </text>
            <line
              x1="-180" y1="22" x2="180" y2="22"
              stroke={SHAKA_PALETTE.BORDEAUX}
              strokeWidth="2"
              opacity={labelT * 0.7}
            />
          </g>
        )}

        {/* Texte drame */}
        {dramaT > 0.05 && (
          <g opacity={dramaT} transform={`translate(540 1280)`}>
            <text
              x="0" y="0"
              textAnchor="middle"
              fontFamily={SHAKA_FONTS.CORPS}
              fontSize="42"
              fontWeight="500"
              fill={SHAKA_PALETTE.BORDEAUX}
              letterSpacing="2"
              fontStyle="italic"
            >
              Pour n'avoir pas pleuré
            </text>
            <text
              x="0" y="56"
              textAnchor="middle"
              fontFamily={SHAKA_FONTS.CORPS}
              fontSize="42"
              fontWeight="500"
              fill={SHAKA_PALETTE.BORDEAUX}
              letterSpacing="2"
              fontStyle="italic"
            >
              assez fort.
            </text>
          </g>
        )}

        {/* === CARTOUCHE SOURCE === */}
        {cartoucheT > 0.05 && (
          <g
            transform={`translate(540 1700) scale(${0.85 + 0.15 * cartoucheT})`}
            opacity={cartoucheT}
          >
            <rect
              x="-340" y="-45" width="680" height="90"
              fill={SHAKA_PALETTE.PARCHEMIN}
              stroke={SHAKA_PALETTE.OR}
              strokeWidth="3"
              rx="6"
            />
            <text
              x="0" y="-8"
              textAnchor="middle"
              fontFamily={SHAKA_FONTS.TITRE}
              fontSize="26"
              fontWeight="900"
              fill="#3a2a18"
              letterSpacing="3"
            >
              JAMES STUART ARCHIVE
            </text>
            <text
              x="0" y="22"
              textAnchor="middle"
              fontFamily={SHAKA_FONTS.CORPS}
              fontSize="20"
              fontWeight="500"
              fill="#3a2a18"
              letterSpacing="2"
              fontStyle="italic"
              opacity="0.85"
            >
              Témoignages oraux Zulu · publié 1976
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
