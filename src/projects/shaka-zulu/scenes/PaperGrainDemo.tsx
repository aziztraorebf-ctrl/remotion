// Demo PaperGrain — montre le filtre transversal applique sur un fond avec elements varies
// Permet de valider l'intensite/baseFrequency avant application sur composition entiere

import React from "react";
import { AbsoluteFill } from "remotion";
import { PaperGrain } from "../components/PaperGrain";
import { SHAKA_PALETTE, SHAKA_FONTS } from "../components/AtlasShakaPalette";

interface PaperGrainDemoProps {
  durationFrames: number;
}

export const PaperGrainDemo: React.FC<PaperGrainDemoProps> = () => {
  return (
    <PaperGrain intensity={0.18} baseFrequency={0.85}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${SHAKA_PALETTE.PARCHEMIN} 0%, #d4b88c 100%)`,
        }}
      >
        <svg viewBox="0 0 1080 1920" style={{ width: "100%", height: "100%" }}>
          {/* Titre */}
          <text
            x="540"
            y="280"
            textAnchor="middle"
            fontFamily={SHAKA_FONTS.TITRE}
            fontSize="68"
            fontWeight="900"
            fill={SHAKA_PALETTE.BORDEAUX}
            letterSpacing="6"
          >
            PAPER GRAIN
          </text>
          <text
            x="540"
            y="340"
            textAnchor="middle"
            fontFamily={SHAKA_FONTS.CORPS}
            fontSize="26"
            fontWeight="500"
            fill="#3a2a18"
            letterSpacing="3"
            opacity="0.85"
          >
            FILTRE TRANSVERSAL DEMO
          </text>

          {/* Bandes de couleur pour voir l'effet sur differentes zones */}
          <rect x="80" y="450" width="920" height="160" fill={SHAKA_PALETTE.OR} opacity="0.85" />
          <text
            x="540"
            y="540"
            textAnchor="middle"
            fontFamily={SHAKA_FONTS.CORPS}
            fontSize="32"
            fill="#3a2a18"
            fontWeight="700"
          >
            OR
          </text>

          <rect x="80" y="650" width="920" height="160" fill={SHAKA_PALETTE.BORDEAUX} opacity="0.85" />
          <text
            x="540"
            y="740"
            textAnchor="middle"
            fontFamily={SHAKA_FONTS.CORPS}
            fontSize="32"
            fill={SHAKA_PALETTE.PARCHEMIN}
            fontWeight="700"
          >
            BORDEAUX
          </text>

          <rect x="80" y="850" width="920" height="160" fill="#0D0D0D" opacity="0.95" />
          <text
            x="540"
            y="940"
            textAnchor="middle"
            fontFamily={SHAKA_FONTS.CORPS}
            fontSize="32"
            fill={SHAKA_PALETTE.OR}
            fontWeight="700"
          >
            NOIR PROFOND
          </text>

          {/* Section detail typo */}
          <text
            x="540"
            y="1200"
            textAnchor="middle"
            fontFamily={SHAKA_FONTS.TITRE}
            fontSize="42"
            fill="#3a2a18"
            letterSpacing="5"
          >
            "IL EST NÉ PARIA"
          </text>
          <text
            x="540"
            y="1260"
            textAnchor="middle"
            fontFamily={SHAKA_FONTS.CORPS}
            fontSize="22"
            fill="#3a2a18"
            opacity="0.7"
            fontStyle="italic"
          >
            Test typographie sur fond grain papier
          </text>

          {/* Cartouche grain papier */}
          <rect
            x="180"
            y="1500"
            width="720"
            height="200"
            fill="none"
            stroke={SHAKA_PALETTE.OR}
            strokeWidth="2"
            opacity="0.75"
          />
          <text
            x="540"
            y="1580"
            textAnchor="middle"
            fontFamily={SHAKA_FONTS.CORPS}
            fontSize="20"
            fill="#3a2a18"
            opacity="0.85"
            letterSpacing="2"
          >
            BASE FREQUENCY 0.85
          </text>
          <text
            x="540"
            y="1620"
            textAnchor="middle"
            fontFamily={SHAKA_FONTS.CORPS}
            fontSize="20"
            fill="#3a2a18"
            opacity="0.85"
            letterSpacing="2"
          >
            INTENSITY 0.18
          </text>
          <text
            x="540"
            y="1660"
            textAnchor="middle"
            fontFamily={SHAKA_FONTS.CORPS}
            fontSize="20"
            fill="#3a2a18"
            opacity="0.85"
            letterSpacing="2"
          >
            MIX-BLEND-MODE OVERLAY
          </text>
        </svg>
      </AbsoluteFill>
    </PaperGrain>
  );
};
