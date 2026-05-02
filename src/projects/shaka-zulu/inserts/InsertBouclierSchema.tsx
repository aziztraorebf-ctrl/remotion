// Insert BOUCLIER — schema technique anime en Remotion pur
// Pas d'image. SVG dataviz : bouclier ovale + sequence "crochet du poignet" en 3 frames step-by-step
//
// Apparition sequentielle :
// 1. Titre + sous-titre
// 2. Bouclier face (silhouette ovale + manche vertical + cowhide pattern)
// 3. Sequence 3 etapes (frames cinematiques) :
//    a. Bouclier ennemi face : "Position initiale"
//    b. Crochet : fleche de rotation + bouclier penche : "Tourner le poignet"
//    c. Flanc expose : silhouette ennemi + zone rouge clignotante : "Coup fatal"
// 4. Cartouche bas : "Defense -> Offense"

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { SHAKA_PALETTE, SHAKA_FONTS } from "../components/AtlasShakaPalette";

interface InsertBouclierSchemaProps {
  durationFrames: number;
}

const ZuluShield: React.FC<{ x: number; y: number; rotation?: number; scale?: number; opacity?: number }> = ({
  x, y, rotation = 0, scale = 1, opacity = 1
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`} opacity={opacity}>
    {/* Ovale principal */}
    <ellipse cx="0" cy="0" rx="70" ry="120" fill="#5a3d1f" stroke="#1a1a1a" strokeWidth="3" />
    {/* Patches cowhide blancs */}
    <ellipse cx="-25" cy="-50" rx="22" ry="18" fill="#f5e6c8" opacity="0.85" />
    <ellipse cx="20" cy="20" rx="18" ry="25" fill="#f5e6c8" opacity="0.85" />
    <ellipse cx="-15" cy="60" rx="16" ry="14" fill="#f5e6c8" opacity="0.85" />
    {/* Manche vertical */}
    <line x1="0" y1="-130" x2="0" y2="130" stroke="#3d2a14" strokeWidth="6" />
    <circle cx="0" cy="-128" r="6" fill="#3d2a14" />
    <circle cx="0" cy="128" r="6" fill="#3d2a14" />
  </g>
);

export const InsertBouclierSchema: React.FC<InsertBouclierSchemaProps> = ({ durationFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phases
  const titleStart = 0;
  const shieldStart = 18;
  const step1Start = 50;
  const step2Start = 100;
  const step3Start = 160;
  const cartoucheStart = 220;

  const titleT = spring({ frame: frame - titleStart, fps, config: { damping: 16, stiffness: 180 }, from: 0, to: 1 });
  const shieldT = spring({ frame: frame - shieldStart, fps, config: { damping: 18, stiffness: 80 }, from: 0, to: 1 });
  const step1T = spring({ frame: frame - step1Start, fps, config: { damping: 16, stiffness: 140 }, from: 0, to: 1 });
  const step2T = spring({ frame: frame - step2Start, fps, config: { damping: 16, stiffness: 140 }, from: 0, to: 1 });
  const step3T = spring({ frame: frame - step3Start, fps, config: { damping: 16, stiffness: 140 }, from: 0, to: 1 });
  const cartoucheT = spring({ frame: frame - cartoucheStart, fps, config: { damping: 14, stiffness: 200 }, from: 0, to: 1 });

  // Pulse rouge sur la zone fatale (step 3)
  const fatalPulse = step3T > 0.5 ? 0.3 + 0.5 * Math.abs(Math.sin(frame * 0.2)) : 0;

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
          <filter id="redGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* === TITRE === */}
        <g
          opacity={titleT}
          transform={`translate(540 200) scale(${0.85 + 0.15 * titleT})`}
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
            LE BOUCLIER
          </text>
          <text
            x="0" y="46"
            textAnchor="middle"
            fontFamily={SHAKA_FONTS.CORPS}
            fontSize="26"
            fontWeight="500"
            fill={SHAKA_PALETTE.PARCHEMIN}
            letterSpacing="4"
            opacity="0.85"
          >
            ISIHLANGU — TECHNIQUE DU CROCHET
          </text>
          <line
            x1="-200" y1="70" x2="200" y2="70"
            stroke={SHAKA_PALETTE.OR}
            strokeWidth="2"
            opacity="0.55"
          />
        </g>

        {/* === SEQUENCE 3 ETAPES === */}
        {/* Layout vertical : etape 1 en haut, 2 milieu, 3 bas. Format portrait 1080x1920 */}

        {/* ETAPE 1 — Position initiale */}
        {step1T > 0.05 && (
          <g opacity={step1T}>
            <text
              x="200" y="450"
              fontFamily={SHAKA_FONTS.TITRE}
              fontSize="32"
              fontWeight="900"
              fill={SHAKA_PALETTE.OR}
              letterSpacing="3"
            >
              1.
            </text>
            <text
              x="280" y="450"
              fontFamily={SHAKA_FONTS.CORPS}
              fontSize="28"
              fontWeight="600"
              fill={SHAKA_PALETTE.PARCHEMIN}
              letterSpacing="2"
            >
              Position initiale
            </text>
            <ZuluShield x={400} y={580} scale={0.7} />
            <ZuluShield x={680} y={580} scale={0.7} opacity={0.65} />
            <text
              x="400" y="730"
              textAnchor="middle"
              fontFamily={SHAKA_FONTS.CORPS}
              fontSize="20"
              fontWeight="400"
              fill={SHAKA_PALETTE.OR}
              fontStyle="italic"
            >
              Shaka
            </text>
            <text
              x="680" y="730"
              textAnchor="middle"
              fontFamily={SHAKA_FONTS.CORPS}
              fontSize="20"
              fontWeight="400"
              fill="#7a7a7a"
              fontStyle="italic"
            >
              Ennemi
            </text>
          </g>
        )}

        {/* ETAPE 2 — Crochet du poignet */}
        {step2T > 0.05 && (
          <g opacity={step2T}>
            <text
              x="200" y="900"
              fontFamily={SHAKA_FONTS.TITRE}
              fontSize="32"
              fontWeight="900"
              fill={SHAKA_PALETTE.OR}
              letterSpacing="3"
            >
              2.
            </text>
            <text
              x="280" y="900"
              fontFamily={SHAKA_FONTS.CORPS}
              fontSize="28"
              fontWeight="600"
              fill={SHAKA_PALETTE.PARCHEMIN}
              letterSpacing="2"
            >
              Crochet du poignet
            </text>
            <ZuluShield x={400} y={1030} scale={0.7} rotation={20} />
            <ZuluShield x={680} y={1030} scale={0.7} rotation={45 * step2T} opacity={0.85} />
            {/* Fleche rotation */}
            <path
              d="M 540 1000 Q 600 970, 660 1000"
              stroke={SHAKA_PALETTE.OR}
              strokeWidth="4"
              fill="none"
              markerEnd="url(#arrowhead)"
              opacity={step2T}
            />
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <path d="M0,0 L0,6 L9,3 z" fill={SHAKA_PALETTE.OR} />
              </marker>
            </defs>
          </g>
        )}

        {/* ETAPE 3 — Flanc expose */}
        {step3T > 0.05 && (
          <g opacity={step3T}>
            <text
              x="200" y="1350"
              fontFamily={SHAKA_FONTS.TITRE}
              fontSize="32"
              fontWeight="900"
              fill={SHAKA_PALETTE.BORDEAUX}
              letterSpacing="3"
            >
              3.
            </text>
            <text
              x="280" y="1350"
              fontFamily={SHAKA_FONTS.CORPS}
              fontSize="28"
              fontWeight="600"
              fill={SHAKA_PALETTE.BORDEAUX}
              letterSpacing="2"
            >
              Flanc exposé
            </text>
            <ZuluShield x={400} y={1480} scale={0.7} rotation={20} />
            <ZuluShield x={680} y={1480} scale={0.7} rotation={90} opacity={0.6} />
            {/* Ennemi silhouette + zone fatale rouge */}
            <circle
              cx="780" cy="1480" r="40"
              fill="none"
              stroke={SHAKA_PALETTE.BORDEAUX}
              strokeWidth="4"
              opacity={fatalPulse}
              filter="url(#redGlow)"
            />
            <circle
              cx="780" cy="1480" r="20"
              fill={SHAKA_PALETTE.BORDEAUX}
              opacity={fatalPulse}
            />
            <text
              x="540" y="1640"
              textAnchor="middle"
              fontFamily={SHAKA_FONTS.TITRE}
              fontSize="36"
              fontWeight="900"
              fill={SHAKA_PALETTE.BORDEAUX}
              letterSpacing="4"
              opacity={step3T}
            >
              UN SEUL MOUVEMENT. FATAL.
            </text>
          </g>
        )}

        {/* === CARTOUCHE BAS === */}
        {cartoucheT > 0.05 && (
          <g
            transform={`translate(540 1820) scale(${0.85 + 0.15 * cartoucheT})`}
            opacity={cartoucheT}
          >
            <rect
              x="-360" y="-40" width="720" height="80"
              fill={SHAKA_PALETTE.PARCHEMIN}
              stroke={SHAKA_PALETTE.OR}
              strokeWidth="3"
              rx="6"
            />
            <text
              x="0" y="8"
              textAnchor="middle"
              fontFamily={SHAKA_FONTS.TITRE}
              fontSize="26"
              fontWeight="900"
              fill="#3a2a18"
              letterSpacing="3"
            >
              DÉFENSIVE → OFFENSIVE
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
