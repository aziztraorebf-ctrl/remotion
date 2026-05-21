/**
 * WealthScale — balance de justice animee SVG pur
 *
 * Concept : plateau gauche (ressource) s'abaisse lourdement,
 * plateau droit (peuple) remonte, desequilibre chiffre revele,
 * punchline finale. Duree 90 frames a 30fps.
 *
 * Palette :
 *   Fond       #03224c
 *   Ivoire     #d4c5a0
 *   Or sourd   #b8893f
 *   Terre cuite #a05a3a
 *
 * Usage :
 *   <WealthScale
 *     resourceLabel="Uranium extrait"
 *     extractionAmount="$47B extracted"
 *     gdpPerCapita="$847 GDP per capita"
 *     punchline="Rich soil. Poor country."
 *     resourceIcon="uranium"
 *   />
 */

import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type ResourceIcon = "gold" | "uranium" | "oil" | "diamond";

export interface WealthScaleProps {
  resourceLabel: string;
  extractionAmount: string;
  gdpPerCapita: string;
  punchline: string;
  resourceIcon: ResourceIcon;
}

// --- Palette ---
const COLOR_BG = "#03224c";
const COLOR_IVORY = "#d4c5a0";
const COLOR_GOLD = "#b8893f";
const COLOR_TERRACOTTA = "#a05a3a";

// --- Icones SVG inline (fallback oil/diamond) ---

const IconOil: React.FC = () => (
  <g>
    {/* Goutte stylisee */}
    <path
      d="M0,-30 C16,-10 22,10 18,20 C14,34 -14,34 -18,20 C-22,10 -16,-10 0,-30 Z"
      fill={COLOR_TERRACOTTA}
    />
    <path
      d="M0,-18 C8,-5 10,6 8,14 C5,22 -5,22 -8,14 C-10,6 -8,-5 0,-18 Z"
      fill={COLOR_IVORY}
      opacity={0.4}
    />
  </g>
);

const IconDiamond: React.FC = () => (
  <g>
    {/* Losange simple */}
    <polygon
      points="0,-30 24,0 0,30 -24,0"
      fill={COLOR_GOLD}
      stroke={COLOR_IVORY}
      strokeWidth="2"
    />
    <polygon
      points="0,-18 14,0 0,18 -14,0"
      fill={COLOR_IVORY}
      opacity={0.3}
    />
  </g>
);

function renderResourceIcon(icon: ResourceIcon): React.ReactNode {
  switch (icon) {
    case "gold":
    case "uranium":
      // gold-nugget.png remplace IconGold et IconUranium
      return (
        <image
          href={staticFile("_shared/assets/templates-souverain/gold-nugget.png")}
          x="-40"
          y="-60"
          width="80"
          height="80"
          filter="url(#gold-glow)"
        />
      );
    case "oil":
      return <IconOil />;
    case "diamond":
      return <IconDiamond />;
  }
}

// --- Composant principal ---

export const WealthScale: React.FC<WealthScaleProps> = ({
  resourceLabel,
  extractionAmount,
  gdpPerCapita,
  punchline,
  resourceIcon,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Structure fade in f0-15
  const structureOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Icones apparaissent f15-30 via spring scale
  const iconScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Rotation bras f30-55 : plateau ressource (gauche) descend -> angle negatif
  const tiltAngle = interpolate(frame, [30, 55], [0, -28], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Stats apparaissent f55-70
  const statsOpacity = interpolate(frame, [55, 67], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Punchline f70-90
  const punchlineOpacity = interpolate(frame, [70, 84], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow plateau ressource apres f70
  const resourceGlow = interpolate(frame, [70, 82], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Translations approx des plateaux dans l'espace 1080x1920
  // SVG : 900x700, centree dans 1080x1920 => offset top = (1920-700)/2 = 610
  // Point pivot SVG (450,420) => ecran (90+450, 610+420) = (540, 1030)
  // Plateau gauche SVG (150,500) => apres tilt : position approximative pour overlay texte
  // On calcule les offsets HTML a partir de la geometrie SVG

  // SVG positionne avec marginLeft=(1080-900)/2=90, marginTop=(1920-700)/2=610
  const svgLeft = 90;
  const svgTop = 610;
  const pivotX = 450;
  const pivotY = 420;

  // Positions des plateaux dans SVG avant rotation
  const leftPlatformSvgX = 150;
  const rightPlatformSvgX = 750;
  const platformSvgY = 490; // sommet du plateau

  // Apres rotation du bras de tiltAngle autour de (pivotX, pivotY),
  // chaque plateau subit une contre-rotation donc reste horizontal.
  // La position (x, y) dans le SVG apres rotation du bras :
  const tiltRad = (tiltAngle * Math.PI) / 180;
  const cosT = Math.cos(tiltRad);
  const sinT = Math.sin(tiltRad);

  const rotatePoint = (x: number, y: number) => {
    const dx = x - pivotX;
    const dy = y - pivotY;
    return {
      x: pivotX + dx * cosT - dy * sinT,
      y: pivotY + dx * sinT + dy * cosT,
    };
  };

  // Centre du plateau en SVG apres rotation du bras
  const leftCenter = rotatePoint(leftPlatformSvgX, platformSvgY);
  const rightCenter = rotatePoint(rightPlatformSvgX, platformSvgY);

  // Position en pixels ecran (par rapport au SVG positionne)
  const leftScreenX = svgLeft + leftCenter.x;
  const leftScreenY = svgTop + leftCenter.y;
  const rightScreenX = svgLeft + rightCenter.x;
  const rightScreenY = svgTop + rightCenter.y;

  return (
    <AbsoluteFill style={{ background: COLOR_BG }}>
      {/* SVG Balance */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: structureOpacity,
        }}
      >
        <svg
          width={900}
          height={700}
          viewBox="0 0 900 700"
          style={{ overflow: "visible" }}
        >
          <defs>
            <filter id="gold-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feComponentTransfer in="blur" result="glow1">
                <feFuncA type="linear" slope={2} />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="glow1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Pied central (triangle/colonne) */}
          <path
            d="M420,420 L380,650 L520,650 L480,420 Z"
            fill={COLOR_IVORY}
            opacity={0.9}
          />
          {/* Base du pied */}
          <rect x={340} y={640} width={220} height={20} rx={6} fill={COLOR_IVORY} opacity={0.7} />

          {/* Point de pivot */}
          <circle cx={450} cy={420} r={12} fill={COLOR_GOLD} />

          {/* Groupe bras rotatif */}
          <g style={{ transform: `rotate(${tiltAngle}deg)`, transformOrigin: "450px 420px" }}>
            {/* Bras horizontal */}
            <line
              x1={150}
              y1={420}
              x2={750}
              y2={420}
              stroke={COLOR_IVORY}
              strokeWidth={5}
              strokeLinecap="round"
            />

            {/* Fil gauche */}
            <line
              x1={150}
              y1={420}
              x2={150}
              y2={490}
              stroke={COLOR_IVORY}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.8}
            />

            {/* Fil droit */}
            <line
              x1={750}
              y1={420}
              x2={750}
              y2={490}
              stroke={COLOR_IVORY}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.8}
            />

            {/* Plateau gauche (ressource) avec contre-rotation */}
            <g
              style={{
                transform: `rotate(${-tiltAngle}deg)`,
                transformOrigin: "150px 490px",
              }}
            >
              {/* Glow gold (apres f70) */}
              <ellipse
                cx={150}
                cy={500}
                rx={72}
                ry={20}
                fill={COLOR_GOLD}
                opacity={resourceGlow * 0.35}
                style={{ filter: "blur(12px)" }}
              />
              {/* Plateau */}
              <ellipse cx={150} cy={490} rx={62} ry={14} fill={COLOR_IVORY} opacity={0.85} />
              <ellipse cx={150} cy={494} rx={62} ry={14} fill={COLOR_IVORY} opacity={0.4} />
              {/* Icone ressource — PNG gold-nugget avec glow */}
              <g
                style={{
                  transform: `translate(150px, 450px) scale(${iconScale})`,
                  transformOrigin: "0px 0px",
                }}
              >
                {renderResourceIcon(resourceIcon)}
              </g>
            </g>

            {/* Plateau droit (peuple) avec contre-rotation */}
            <g
              style={{
                transform: `rotate(${-tiltAngle}deg)`,
                transformOrigin: "750px 490px",
              }}
            >
              {/* Plateau */}
              <ellipse cx={750} cy={490} rx={62} ry={14} fill={COLOR_IVORY} opacity={0.85} />
              <ellipse cx={750} cy={494} rx={62} ry={14} fill={COLOR_IVORY} opacity={0.4} />
              {/* Icone peuple — PNG people-icon */}
              <g
                style={{
                  transform: `translate(750px, 440px) scale(${iconScale})`,
                  transformOrigin: "0px 0px",
                }}
              >
                <image
                  href={staticFile("_shared/assets/templates-souverain/people-icon.png")}
                  x="-35"
                  y="-55"
                  width="70"
                  height="70"
                />
              </g>
            </g>
          </g>
        </svg>
      </AbsoluteFill>

      {/* Texte extractionAmount — au-dessus plateau gauche */}
      <div
        style={{
          position: "absolute",
          left: leftScreenX - 140,
          top: leftScreenY - 130,
          width: 280,
          textAlign: "center",
          opacity: statsOpacity,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            color: COLOR_GOLD,
            fontFamily: "'Oswald', 'Arial Black', sans-serif",
            fontSize: 38,
            letterSpacing: "0.04em",
            lineHeight: 1.1,
            textShadow: "0px 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          {resourceLabel}
        </div>
        <div
          style={{
            color: COLOR_GOLD,
            fontFamily: "'Oswald', 'Arial Black', sans-serif",
            fontSize: 32,
            fontWeight: 700,
            marginTop: 6,
            textShadow: "0px 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          {extractionAmount}
        </div>
      </div>

      {/* Texte gdpPerCapita — au-dessus plateau droit */}
      <div
        style={{
          position: "absolute",
          left: rightScreenX - 140,
          top: rightScreenY - 130,
          width: 280,
          textAlign: "center",
          opacity: statsOpacity,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            color: COLOR_IVORY,
            fontFamily: "'Oswald', 'Arial Black', sans-serif",
            fontSize: 38,
            letterSpacing: "0.04em",
            lineHeight: 1.1,
            textShadow: "0px 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          Population
        </div>
        <div
          style={{
            color: COLOR_IVORY,
            fontFamily: "'Oswald', 'Arial Black', sans-serif",
            fontSize: 32,
            fontWeight: 700,
            marginTop: 6,
            textShadow: "0px 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          {gdpPerCapita}
        </div>
      </div>

      {/* Punchline — bas de l'ecran */}
      <div
        style={{
          position: "absolute",
          bottom: 140,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: punchlineOpacity,
          pointerEvents: "none",
          padding: "0 80px",
        }}
      >
        <div
          style={{
            color: COLOR_IVORY,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 58,
            fontStyle: "italic",
            lineHeight: 1.3,
            textShadow: `0 0 60px rgba(184,137,63,0.5)`,
          }}
        >
          {punchline}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Demo ---

export const WEALTH_SCALE_DEMO_FRAMES = 90;

export const WealthScaleDemo: React.FC = () => (
  <WealthScale
    resourceLabel="Uranium extrait"
    extractionAmount="$47B extracted"
    gdpPerCapita="$847 GDP per capita"
    punchline="Rich soil. Poor country."
    resourceIcon="uranium"
  />
);
