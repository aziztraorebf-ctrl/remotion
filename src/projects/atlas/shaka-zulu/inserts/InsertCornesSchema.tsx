// Insert FORMATION CORNES DE BUFFLE — schema tactique anime en Remotion pur
// Pas de sprites PixelLab. Tout SVG : centre or + flancs bordeaux + ennemis gris
// Style "carte tactique militaire" type EuroPanorama / Vox
//
// Apparition sequentielle :
// 1. Titre + sous-titre + ligne separation
// 2. Centre (chest) qui apparait au milieu (or)
// 3. Ennemis gris au nord du centre
// 4. Flancs (cornes) bordeaux qui se dessinent depuis cotes -> arriere ennemi
// 5. Mouvement d'encerclement : flancs convergent vers l'arriere de l'ennemi
// 6. Cartouche bas : "Tactique Zulu — c.1816"

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { SHAKA_PALETTE, SHAKA_FONTS } from "../components/AtlasShakaPalette";

interface InsertCornesSchemaProps {
  durationFrames: number;
}

export const InsertCornesSchema: React.FC<InsertCornesSchemaProps> = ({ durationFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phases (total ~200f = 6.7s)
  const titleStart = 0;
  const centerStart = 18;
  const enemyStart = 50;
  const flanksStart = 80;
  const encircleStart = 130;
  const cartoucheStart = 170;

  const titleT = spring({ frame: frame - titleStart, fps, config: { damping: 16, stiffness: 180 }, from: 0, to: 1 });
  const centerT = spring({ frame: frame - centerStart, fps, config: { damping: 16, stiffness: 100 }, from: 0, to: 1 });
  const enemyT = spring({ frame: frame - enemyStart, fps, config: { damping: 18, stiffness: 120 }, from: 0, to: 1 });
  const flanksT = spring({ frame: frame - flanksStart, fps, config: { damping: 20, stiffness: 60 }, from: 0, to: 1 });
  const encircleT = spring({ frame: frame - encircleStart, fps, config: { damping: 20, stiffness: 80 }, from: 0, to: 1 });
  const cartoucheT = spring({ frame: frame - cartoucheStart, fps, config: { damping: 14, stiffness: 200 }, from: 0, to: 1 });

  // Pulse central : montre que le centre "fixe et epuise"
  const centerPulse = 1 + Math.sin(frame * 0.08) * 0.05;

  // Stroke dasharray pour effet "trait dessine" sur les flancs
  const flankPathLen = 600;
  const flankDashOffset = (1 - flanksT) * flankPathLen;

  // Position warriors flancs : interpolation depuis bord -> arriere ennemi
  const leftFlankX = interpolate(encircleT, [0, 1], [180, 480]);
  const leftFlankY = interpolate(encircleT, [0, 1], [800, 740]);
  const rightFlankX = interpolate(encircleT, [0, 1], [900, 600]);
  const rightFlankY = interpolate(encircleT, [0, 1], [800, 740]);

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
          <radialGradient id="centerGlow" cx="0.5" cy="0.5" r="0.6">
            <stop offset="0%" stopColor={SHAKA_PALETTE.OR} stopOpacity="0.6" />
            <stop offset="70%" stopColor={SHAKA_PALETTE.OR} stopOpacity="0.15" />
            <stop offset="100%" stopColor={SHAKA_PALETTE.OR} stopOpacity="0" />
          </radialGradient>
          <filter id="bordeauxGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="gridPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={SHAKA_PALETTE.OR} strokeWidth="0.5" opacity="0.1" />
          </pattern>
        </defs>

        {/* Fond grid tactique */}
        <rect x="0" y="0" width="1080" height="1920" fill="url(#gridPattern)" />

        {/* === TITRE === */}
        <g
          opacity={titleT}
          transform={`translate(540 200) scale(${0.85 + 0.15 * titleT})`}
        >
          <text
            x="0" y="0"
            textAnchor="middle"
            fontFamily={SHAKA_FONTS.TITRE}
            fontSize="54"
            fontWeight="900"
            fill={SHAKA_PALETTE.OR}
            letterSpacing="5"
          >
            CORNES DE BUFFLE
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
            IMPONDO ZANKOMO — TACTIQUE D'ENCERCLEMENT
          </text>
          <line
            x1="-260" y1="70" x2="260" y2="70"
            stroke={SHAKA_PALETTE.OR}
            strokeWidth="2"
            opacity="0.55"
          />
        </g>

        {/* === ENNEMI (groupe gris au nord) === */}
        {enemyT > 0.05 && (
          <g opacity={enemyT}>
            {[
              { x: 480, y: 600 }, { x: 540, y: 595 }, { x: 600, y: 605 },
              { x: 510, y: 640 }, { x: 570, y: 645 }, { x: 540, y: 670 },
            ].map((pos, i) => (
              <circle
                key={i}
                cx={pos.x} cy={pos.y} r="14"
                fill="#7a7a7a"
                stroke="#4a4a4a"
                strokeWidth="1.5"
              />
            ))}
            <text
              x="540" y="540"
              textAnchor="middle"
              fontFamily={SHAKA_FONTS.CORPS}
              fontSize="22"
              fontWeight="600"
              fill="#9e9e9e"
              letterSpacing="3"
              opacity={enemyT}
            >
              ENNEMI
            </text>
          </g>
        )}

        {/* === CENTRE (chest) qui fixe et epuise === */}
        {centerT > 0.05 && (
          <g opacity={centerT}>
            {/* Halo central or */}
            <circle
              cx="540" cy="900" r="180"
              fill="url(#centerGlow)"
              transform={`translate(540 900) scale(${centerPulse}) translate(-540 -900)`}
            />
            {/* Bloc centre solide */}
            <rect
              x="450" y="850" width="180" height="100"
              fill={SHAKA_PALETTE.OR}
              stroke="#a8862a"
              strokeWidth="3"
              rx="4"
            />
            {/* Mini-warriors symbolises */}
            {[0, 1, 2, 3].map(i => (
              <circle
                key={i}
                cx={465 + i * 50} cy={900} r="12"
                fill="#3a2a14"
              />
            ))}
            <text
              x="540" y="990"
              textAnchor="middle"
              fontFamily={SHAKA_FONTS.TITRE}
              fontSize="24"
              fontWeight="900"
              fill={SHAKA_PALETTE.OR}
              letterSpacing="3"
            >
              CENTRE
            </text>
            <text
              x="540" y="1018"
              textAnchor="middle"
              fontFamily={SHAKA_FONTS.CORPS}
              fontSize="18"
              fontWeight="400"
              fill={SHAKA_PALETTE.PARCHEMIN}
              fontStyle="italic"
              opacity="0.85"
            >
              fixe et épuise
            </text>
          </g>
        )}

        {/* === FLANCS (cornes) qui se dessinent === */}
        {flanksT > 0.05 && (
          <g>
            {/* Flanc gauche : courbe depuis bas-gauche vers nord-est de l'ennemi */}
            <path
              d="M 180 1100 Q 150 800, 480 600"
              stroke={SHAKA_PALETTE.BORDEAUX}
              strokeWidth="6"
              fill="none"
              strokeDasharray={flankPathLen}
              strokeDashoffset={flankDashOffset}
              filter="url(#bordeauxGlow)"
            />
            {/* Flanc droit : courbe depuis bas-droite vers nord-ouest de l'ennemi */}
            <path
              d="M 900 1100 Q 930 800, 600 600"
              stroke={SHAKA_PALETTE.BORDEAUX}
              strokeWidth="6"
              fill="none"
              strokeDasharray={flankPathLen}
              strokeDashoffset={flankDashOffset}
              filter="url(#bordeauxGlow)"
            />

            {/* Warriors flanc gauche (3 points qui avancent le long du path) */}
            {flanksT > 0.3 && [0, 0.4, 0.7].map((t, i) => {
              const tt = Math.min(1, flanksT * (1 - i * 0.15));
              // Bezier quadratique : P0=(180,1100), P1=(150,800), P2=(480,600)
              const x = (1 - tt) ** 2 * 180 + 2 * (1 - tt) * tt * 150 + tt ** 2 * 480;
              const y = (1 - tt) ** 2 * 1100 + 2 * (1 - tt) * tt * 800 + tt ** 2 * 600;
              return (
                <circle
                  key={`left-${i}`}
                  cx={x} cy={y} r="14"
                  fill={SHAKA_PALETTE.BORDEAUX}
                  stroke="#5a0e0e"
                  strokeWidth="2"
                />
              );
            })}
            {/* Warriors flanc droit */}
            {flanksT > 0.3 && [0, 0.4, 0.7].map((t, i) => {
              const tt = Math.min(1, flanksT * (1 - i * 0.15));
              const x = (1 - tt) ** 2 * 900 + 2 * (1 - tt) * tt * 930 + tt ** 2 * 600;
              const y = (1 - tt) ** 2 * 1100 + 2 * (1 - tt) * tt * 800 + tt ** 2 * 600;
              return (
                <circle
                  key={`right-${i}`}
                  cx={x} cy={y} r="14"
                  fill={SHAKA_PALETTE.BORDEAUX}
                  stroke="#5a0e0e"
                  strokeWidth="2"
                />
              );
            })}

            {/* Labels FLANCS */}
            <text
              x="100" y="1180"
              fontFamily={SHAKA_FONTS.TITRE}
              fontSize="22"
              fontWeight="900"
              fill={SHAKA_PALETTE.BORDEAUX}
              letterSpacing="3"
              opacity={flanksT}
            >
              CORNE GAUCHE
            </text>
            <text
              x="980" y="1180"
              textAnchor="end"
              fontFamily={SHAKA_FONTS.TITRE}
              fontSize="22"
              fontWeight="900"
              fill={SHAKA_PALETTE.BORDEAUX}
              letterSpacing="3"
              opacity={flanksT}
            >
              CORNE DROITE
            </text>
          </g>
        )}

        {/* === ENCERCLEMENT FINAL — texte d'impact === */}
        {encircleT > 0.5 && (
          <g opacity={encircleT}>
            <text
              x="540" y="1380"
              textAnchor="middle"
              fontFamily={SHAKA_FONTS.TITRE}
              fontSize="38"
              fontWeight="900"
              fill={SHAKA_PALETTE.OR}
              letterSpacing="4"
            >
              ENNEMI CERNÉ
            </text>
            <text
              x="540" y="1430"
              textAnchor="middle"
              fontFamily={SHAKA_FONTS.CORPS}
              fontSize="24"
              fontWeight="500"
              fill={SHAKA_PALETTE.PARCHEMIN}
              letterSpacing="3"
              fontStyle="italic"
              opacity="0.85"
            >
              avant qu'il ne comprenne
            </text>
          </g>
        )}

        {/* === CARTOUCHE BAS === */}
        {cartoucheT > 0.05 && (
          <g
            transform={`translate(540 1750) scale(${0.85 + 0.15 * cartoucheT})`}
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
              fontSize="26"
              fontWeight="900"
              fill="#3a2a18"
              letterSpacing="3"
            >
              GQOKLI HILL · 1818
            </text>
            <text
              x="0" y="26"
              textAnchor="middle"
              fontFamily={SHAKA_FONTS.CORPS}
              fontSize="20"
              fontWeight="500"
              fill="#3a2a18"
              letterSpacing="2"
              fontStyle="italic"
              opacity="0.85"
            >
              90 % de pertes chez l'ennemi
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
