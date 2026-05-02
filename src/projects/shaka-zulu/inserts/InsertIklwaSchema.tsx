// Insert IKLWA — schema technique anime en Remotion pur (philosophie Mansa Moussa V2)
// Pas d'image externe. Tout SVG + spring + interpolate.
//
// Apparition sequentielle :
// 1. Titre + sous-titre + ligne separation
// 2. Silhouette iklwa qui se dessine (stroke-dashoffset)
// 3. Mesures avec lignes guides (lame 30cm, hampe 60cm)
// 4. Comparaison avec lance longue (silhouette grise)
// 5. Cartouche bas : "Innovation militaire — Shaka Zulu, c.1816"

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { SHAKA_PALETTE, SHAKA_FONTS } from "../components/AtlasShakaPalette";

interface InsertIklwaSchemaProps {
  durationFrames: number;
}

export const InsertIklwaSchema: React.FC<InsertIklwaSchemaProps> = ({ durationFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phases (en frames locales, total ~150f = 5s)
  const titleStart = 0;
  const iklwaStart = 18;
  const measuresStart = 60;
  const compareStart = 90;
  const cartoucheStart = 120;

  const titleT = spring({ frame: frame - titleStart, fps, config: { damping: 16, stiffness: 180 }, from: 0, to: 1 });
  const iklwaT = spring({ frame: frame - iklwaStart, fps, config: { damping: 18, stiffness: 80 }, from: 0, to: 1 });
  const measuresT = spring({ frame: frame - measuresStart, fps, config: { damping: 16, stiffness: 140 }, from: 0, to: 1 });
  const compareT = spring({ frame: frame - compareStart, fps, config: { damping: 16, stiffness: 140 }, from: 0, to: 1 });
  const cartoucheT = spring({ frame: frame - cartoucheStart, fps, config: { damping: 14, stiffness: 200 }, from: 0, to: 1 });

  // Stroke dasharray pour effet "dessin a la main" iklwa
  const iklwaPathLen = 1200;
  const iklwaDashOffset = (1 - iklwaT) * iklwaPathLen;

  // Fade global
  const opacity = interpolate(
    frame,
    [0, 10, durationFrames - 12, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: SHAKA_PALETTE.NOIR_PROFOND, opacity }}>
      <svg viewBox="0 0 1080 1920" style={{ width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="bladeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7a7a7a" />
            <stop offset="50%" stopColor="#d8d8d8" />
            <stop offset="100%" stopColor="#7a7a7a" />
          </linearGradient>
          <linearGradient id="shaftGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b6234" />
            <stop offset="100%" stopColor="#5a3d1f" />
          </linearGradient>
          <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* === TITRE === */}
        <g
          opacity={titleT}
          transform={`translate(540 220) scale(${0.85 + 0.15 * titleT})`}
        >
          <text
            x="0" y="0"
            textAnchor="middle"
            fontFamily={SHAKA_FONTS.TITRE}
            fontSize="64"
            fontWeight="900"
            fill={SHAKA_PALETTE.OR}
            letterSpacing="6"
          >
            L'IKLWA
          </text>
          <text
            x="0" y="46"
            textAnchor="middle"
            fontFamily={SHAKA_FONTS.CORPS}
            fontSize="28"
            fontWeight="500"
            fill={SHAKA_PALETTE.PARCHEMIN}
            letterSpacing="4"
            opacity="0.85"
          >
            INNOVATION MILITAIRE — c.1816
          </text>
          <line
            x1="-200" y1="70" x2="200" y2="70"
            stroke={SHAKA_PALETTE.OR}
            strokeWidth="2"
            opacity="0.55"
          />
        </g>

        {/* === IKLWA SCHEMA SVG === */}
        {/* Echelle: hampe 60cm + lame 30cm = total 90cm (l'iklwa courte) */}
        {/* Position centrale: 540, 700 -> 1280 vertical */}

        <g opacity={iklwaT}>
          {/* HAMPE (manche bois) */}
          <rect
            x="525" y="700"
            width="30" height="380"
            fill="url(#shaftGrad)"
            stroke={SHAKA_PALETTE.OR}
            strokeWidth="1.5"
            opacity={iklwaT}
          />
          {/* Pommeau bas */}
          <rect
            x="515" y="1080"
            width="50" height="20"
            fill="#3d2a14"
            stroke={SHAKA_PALETTE.OR}
            strokeWidth="1.5"
            opacity={iklwaT}
          />
          {/* Lame (forme en feuille) */}
          <path
            d="M 540 700
               C 470 660, 470 540, 540 480
               C 610 540, 610 660, 540 700 Z"
            fill="url(#bladeGrad)"
            stroke={SHAKA_PALETTE.OR}
            strokeWidth="2"
            strokeDasharray={iklwaPathLen}
            strokeDashoffset={iklwaDashOffset}
            opacity={iklwaT}
          />
          {/* Arete centrale */}
          <line
            x1="540" y1="490" x2="540" y2="695"
            stroke="#5a5a5a"
            strokeWidth="1.5"
            opacity={iklwaT * 0.7}
          />
          {/* Reflet lame */}
          <path
            d="M 510 540 C 500 600, 500 680, 530 695"
            stroke="#fff"
            strokeWidth="1.5"
            fill="none"
            opacity={iklwaT * 0.4}
          />
        </g>

        {/* === MESURES === */}
        {measuresT > 0.05 && (
          <g opacity={measuresT}>
            {/* Cote lame : 30 cm */}
            <line x1="640" y1="480" x2="700" y2="480" stroke={SHAKA_PALETTE.OR} strokeWidth="1.5" opacity="0.7" />
            <line x1="640" y1="700" x2="700" y2="700" stroke={SHAKA_PALETTE.OR} strokeWidth="1.5" opacity="0.7" />
            <line x1="690" y1="480" x2="690" y2="700"
              stroke={SHAKA_PALETTE.OR} strokeWidth="2"
              markerStart="url(#arrowUp)" markerEnd="url(#arrowDown)"
              opacity="0.9"
            />
            <text
              x="730" y="600"
              fontFamily={SHAKA_FONTS.CORPS}
              fontSize="32"
              fontWeight="700"
              fill={SHAKA_PALETTE.OR}
            >
              30 cm
            </text>
            <text
              x="730" y="630"
              fontFamily={SHAKA_FONTS.CORPS}
              fontSize="20"
              fontWeight="400"
              fill={SHAKA_PALETTE.PARCHEMIN}
              opacity="0.75"
              fontStyle="italic"
            >
              lame
            </text>

            {/* Cote hampe : 60 cm */}
            <line x1="500" y1="700" x2="440" y2="700" stroke={SHAKA_PALETTE.OR} strokeWidth="1.5" opacity="0.7" />
            <line x1="500" y1="1080" x2="440" y2="1080" stroke={SHAKA_PALETTE.OR} strokeWidth="1.5" opacity="0.7" />
            <line x1="450" y1="700" x2="450" y2="1080"
              stroke={SHAKA_PALETTE.OR} strokeWidth="2"
              opacity="0.9"
            />
            <text
              x="380" y="900"
              fontFamily={SHAKA_FONTS.CORPS}
              fontSize="32"
              fontWeight="700"
              fill={SHAKA_PALETTE.OR}
              textAnchor="end"
            >
              60 cm
            </text>
            <text
              x="380" y="930"
              fontFamily={SHAKA_FONTS.CORPS}
              fontSize="20"
              fontWeight="400"
              fill={SHAKA_PALETTE.PARCHEMIN}
              opacity="0.75"
              fontStyle="italic"
              textAnchor="end"
            >
              hampe
            </text>
          </g>
        )}

        {/* === COMPARAISON LANCE LONGUE === */}
        {compareT > 0.05 && (
          <g opacity={compareT * 0.6}>
            {/* Silhouette lance longue ennemie (gris fade a droite) */}
            <line
              x1="900" y1="350"
              x2="900" y2="1200"
              stroke="#5a5a5a"
              strokeWidth="6"
              opacity={compareT * 0.5}
            />
            <path
              d="M 900 350 L 880 380 L 920 380 Z"
              fill="#5a5a5a"
              opacity={compareT * 0.5}
            />
            <text
              x="900" y="1240"
              textAnchor="middle"
              fontFamily={SHAKA_FONTS.CORPS}
              fontSize="22"
              fontWeight="500"
              fill="#7a7a7a"
              fontStyle="italic"
              opacity={compareT}
            >
              Lance longue (~2,4 m)
            </text>
            {/* Croix barre rouge */}
            <line
              x1="850" y1="700" x2="950" y2="800"
              stroke={SHAKA_PALETTE.BORDEAUX}
              strokeWidth="6"
              opacity={compareT}
              filter="url(#goldGlow)"
            />
            <line
              x1="950" y1="700" x2="850" y2="800"
              stroke={SHAKA_PALETTE.BORDEAUX}
              strokeWidth="6"
              opacity={compareT}
              filter="url(#goldGlow)"
            />
          </g>
        )}

        {/* === CARTOUCHE BAS === */}
        {cartoucheT > 0.05 && (
          <g
            transform={`translate(540 1700) scale(${0.85 + 0.15 * cartoucheT})`}
            opacity={cartoucheT}
          >
            <rect
              x="-380" y="-50" width="760" height="100"
              fill={SHAKA_PALETTE.PARCHEMIN}
              stroke={SHAKA_PALETTE.OR}
              strokeWidth="3"
              rx="6"
            />
            <text
              x="0" y="-8"
              textAnchor="middle"
              fontFamily={SHAKA_FONTS.TITRE}
              fontSize="28"
              fontWeight="900"
              fill="#3a2a18"
              letterSpacing="3"
            >
              COMBAT AU CORPS À CORPS
            </text>
            <text
              x="0" y="28"
              textAnchor="middle"
              fontFamily={SHAKA_FONTS.CORPS}
              fontSize="22"
              fontWeight="500"
              fill="#3a2a18"
              letterSpacing="2"
              fontStyle="italic"
              opacity="0.85"
            >
              L'ennemi doit s'engager — pas d'esquive
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
