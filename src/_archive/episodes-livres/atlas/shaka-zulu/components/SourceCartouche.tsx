// Cartouche source academique reutilisable — Atlas Shaka Zulu
// Convergence Jury Pass 2 (Kimi + Grok + Gemini) : marque de fabrique "Atlas documentaire serieux"
//
// Usage : <SourceCartouche author="J. LABAND" title="The Rise and Fall of the Zulu Kingdom" appearAt={120} />
//
// Position fixe en bas (y=1820 par defaut) pour ne pas chevaucher cartouche pied insert.
// Apparition spring + fade avec la duree restante du parent.

import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SHAKA_PALETTE, SHAKA_FONTS } from "./AtlasShakaPalette";

interface SourceCartoucheProps {
  author: string;
  title: string;
  appearAt: number;
  parentDurationFrames: number;
  y?: number;
}

export const SourceCartouche: React.FC<SourceCartoucheProps> = ({
  author,
  title,
  appearAt,
  parentDurationFrames,
  y = 1820,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 18, stiffness: 160 },
    from: 0,
    to: 1,
  });

  const fadeOut = interpolate(
    frame,
    [parentDurationFrames - 12, parentDurationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = t * fadeOut;

  return (
    <g opacity={opacity} transform={`translate(540 ${y})`}>
      <rect
        x="-340"
        y="-22"
        width="680"
        height="44"
        fill="transparent"
        stroke={SHAKA_PALETTE.OR}
        strokeWidth="1"
        opacity="0.55"
      />
      <line
        x1="-310"
        y1="0"
        x2="-280"
        y2="0"
        stroke={SHAKA_PALETTE.OR}
        strokeWidth="1.5"
        opacity="0.85"
      />
      <line
        x1="280"
        y1="0"
        x2="310"
        y2="0"
        stroke={SHAKA_PALETTE.OR}
        strokeWidth="1.5"
        opacity="0.85"
      />
      <text
        x="0"
        y="7"
        textAnchor="middle"
        fontFamily={SHAKA_FONTS.CORPS}
        fontSize="22"
        fontWeight="700"
        fill={SHAKA_PALETTE.PARCHEMIN}
        letterSpacing="3"
        opacity="0.95"
        stroke="#0D0D0D"
        strokeWidth="0.5"
      >
        SOURCE · {author.toUpperCase()} · {title.toUpperCase()}
      </text>
    </g>
  );
};
