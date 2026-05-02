// Insert "1 500 PERSONNES" — origine humble du clan Zulu (Remotion pur)
// Apparition: compteur 0->1500, label "personnes", cartouche "Le clan Zulu, c.1816"

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { SHAKA_PALETTE, SHAKA_FONTS } from "../components/AtlasShakaPalette";

interface InsertNombre1500Props {
  durationFrames: number;
}

export const InsertNombre1500: React.FC<InsertNombre1500Props> = ({ durationFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const counterStart = 0;
  const labelStart = 25;
  const cartoucheStart = 50;

  const counterValue = Math.floor(
    interpolate(frame, [counterStart, counterStart + 30], [0, 1500], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const counterScale = spring({
    frame: frame - counterStart,
    fps,
    config: { damping: 14, stiffness: 100 },
    from: 0.6,
    to: 1,
  });
  const labelT = spring({ frame: frame - labelStart, fps, config: { damping: 16, stiffness: 140 }, from: 0, to: 1 });
  const cartoucheT = spring({ frame: frame - cartoucheStart, fps, config: { damping: 14, stiffness: 200 }, from: 0, to: 1 });

  const opacity = interpolate(
    frame,
    [0, 8, durationFrames - 12, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: SHAKA_PALETTE.NOIR_PROFOND, opacity }}>
      <svg viewBox="0 0 1080 1920" style={{ width: "100%", height: "100%" }}>
        <defs>
          <radialGradient id="goldGlowSoft" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={SHAKA_PALETTE.OR} stopOpacity="0.3" />
            <stop offset="100%" stopColor={SHAKA_PALETTE.OR} stopOpacity="0" />
          </radialGradient>
          <filter id="goldShadow">
            <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#000" floodOpacity="0.7" />
          </filter>
        </defs>

        {/* Halo doré */}
        <circle cx="540" cy="800" r="450" fill="url(#goldGlowSoft)" opacity={counterScale} />

        {/* === COMPTEUR === */}
        <g transform={`translate(540 820) scale(${counterScale})`}>
          <text
            x="0" y="0"
            textAnchor="middle"
            fontFamily={SHAKA_FONTS.TITRE}
            fontSize="320"
            fontWeight="900"
            fill={SHAKA_PALETTE.OR}
            letterSpacing="-4"
            filter="url(#goldShadow)"
          >
            {counterValue.toLocaleString("fr-FR").replace(/ /g, " ")}
          </text>
        </g>

        {/* Label "personnes" */}
        {labelT > 0.05 && (
          <g opacity={labelT} transform={`translate(540 1010) scale(${0.9 + 0.1 * labelT})`}>
            <text
              x="0" y="0"
              textAnchor="middle"
              fontFamily={SHAKA_FONTS.TITRE}
              fontSize="56"
              fontWeight="700"
              fill={SHAKA_PALETTE.PARCHEMIN}
              letterSpacing="6"
            >
              PERSONNES
            </text>
            <line
              x1="-160" y1="22" x2="160" y2="22"
              stroke={SHAKA_PALETTE.OR}
              strokeWidth="2"
              opacity={labelT * 0.7}
            />
          </g>
        )}

        {/* === CARTOUCHE === */}
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
              LE CLAN ZULU
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
              KwaZulu-Natal · vers 1816
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
