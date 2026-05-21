/**
 * CrossSection — coupe geologique animee
 *
 * Concept : la surface (silhouette ville, sol) est visible en premier, puis les
 * couches souterraines se revelent une par une vers le bas avec labels et valeurs.
 * Duree nominale : 90 frames a 30fps.
 *
 * Timeline :
 *   f0–20  : surface seule (ciel, silhouette ville PNG, bande de sol)
 *   f20–60 : masque clipPath descend, couches revelee avec stagger (6f chacune)
 *   f60–75 : valeurs des couches fade in + overlay verre droite
 *   f75–90 : tagline fade in en bas
 *
 * Usage :
 *   <CrossSection
 *     surfaceLabel="Niger — 25 millions d'habitants"
 *     tagline="What's above. What's below."
 *     layers={[
 *       { name: "Uranium", color: "#4a6a8a", value: "$78/lb" },
 *       { name: "Or",      color: "#b8893f", value: "$2,340/oz" },
 *     ]}
 *   />
 */

import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LayerData {
  name: string;
  color: string;
  value: string;
}

export interface CrossSectionProps {
  surfaceLabel: string;
  tagline: string;
  layers: LayerData[];
}

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------

const PALETTE = {
  sky: "#03224c",
  soil: "#3d2a1a",
  ivory: "#d4c5a0",
  ivoryDim: "rgba(212, 197, 160, 0.6)",
  ivoryFaint: "rgba(212, 197, 160, 0.3)",
  gold: "#b8893f",
  terracotta: "#a05a3a",
} as const;

// ---------------------------------------------------------------------------
// Geometry constants (SVG viewport : 860 x 900 — container centre)
// ---------------------------------------------------------------------------

const SVG_W = 860;
const SVG_H = 900;
const SKY_H = 240;
const SURFACE_Y = 300; // top du rect sol
const SOIL_H = 60;
const LAYER_H = 120;
const LAYER_X_PAD = 60;

// ---------------------------------------------------------------------------
// CrossSection
// ---------------------------------------------------------------------------

export const CrossSection: React.FC<CrossSectionProps> = ({
  surfaceLabel,
  tagline,
  layers,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const totalLayersHeight = layers.length * LAYER_H;

  // Masque qui descend pour reveler les couches souterraines
  const maskHeight = interpolate(
    frame,
    [20, 60],
    [SURFACE_Y + SOIL_H + 20, SURFACE_Y + SOIL_H + totalLayersHeight + 40],
    {
      easing: Easing.out(Easing.exp),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Opacite par couche (stagger 6f)
  const layerOpacity = (i: number): number =>
    interpolate(frame, [20 + i * 6, 35 + i * 6], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  // Valeurs des couches
  const textOpacity = interpolate(frame, [60, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline
  const taglineOpacity = interpolate(frame, [75, 88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Surface label (visible des f0)
  const surfaceLabelOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Overlay verre cote droit (visible a partir de f60)
  const overlayOpacity = interpolate(frame, [60, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Centrage du container dans le AbsoluteFill (1920x1080 typiquement)
  const containerLeft = Math.round((width - SVG_W) / 2);
  const containerTop = Math.round((height - SVG_H) / 2) - 80;

  return (
    <AbsoluteFill style={{ background: PALETTE.sky, position: "relative" }}>

      {/* Container centre 860px avec bordure ivoire */}
      <div
        style={{
          position: "absolute",
          left: containerLeft,
          top: containerTop,
          width: SVG_W,
          height: SVG_H,
          border: "1px solid rgba(212,197,160,0.4)",
          overflow: "hidden",
        }}
      >
        {/* SVG principal */}
        <svg
          width={SVG_W}
          height={SVG_H}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ display: "block" }}
        >
          <defs>
            {/* Masque de revelation vers le bas */}
            <clipPath id="revealMask">
              <rect x={0} y={0} width={SVG_W} height={maskHeight} />
            </clipPath>

            {/* Texture sol : legers traits horizontaux */}
            <pattern id="soilPattern" x={0} y={0} width={40} height={12} patternUnits="userSpaceOnUse">
              <line x1={0} y1={6} x2={40} y2={6} stroke={PALETTE.ivoryFaint} strokeWidth={0.5} />
            </pattern>

            {/* Ombre interne sur les couches geologiques */}
            <filter id="layer-depth">
              <feDropShadow dx="0" dy="-4" stdDeviation="6" floodColor="rgba(0,0,0,0.5)" />
            </filter>
          </defs>

          {/* ---------------------------------------------------------------- */}
          {/* CIEL */}
          {/* ---------------------------------------------------------------- */}
          <rect x={0} y={0} width={SVG_W} height={SKY_H + 20} fill={PALETTE.sky} />

          {/* Lueur horizon */}
          <ellipse
            cx={SVG_W / 2}
            cy={SURFACE_Y}
            rx={400}
            ry={60}
            fill={PALETTE.gold}
            opacity={0.08}
          />

          {/* ---------------------------------------------------------------- */}
          {/* SILHOUETTE VILLE AFRICAINE (PNG) */}
          {/* ---------------------------------------------------------------- */}
          <image
            href={staticFile("_shared/assets/templates-souverain/city-silhouette.png")}
            x={0}
            y={140}
            width={860}
            height={160}
            preserveAspectRatio="xMidYMid meet"
            opacity={0.85}
          />

          {/* ---------------------------------------------------------------- */}
          {/* SURFACE LABEL */}
          {/* ---------------------------------------------------------------- */}
          <text
            x={SVG_W / 2}
            y={126}
            textAnchor="middle"
            fill={PALETTE.ivory}
            fontSize={26}
            fontFamily="'Playfair Display', Georgia, serif"
            fontStyle="italic"
            fontWeight={500}
            letterSpacing="0.04em"
            opacity={surfaceLabelOpacity}
          >
            {surfaceLabel}
          </text>

          {/* ---------------------------------------------------------------- */}
          {/* BANDE DE SOL (surface) */}
          {/* ---------------------------------------------------------------- */}
          <rect
            x={0}
            y={SURFACE_Y}
            width={SVG_W}
            height={SOIL_H}
            fill={PALETTE.soil}
          />
          <rect
            x={0}
            y={SURFACE_Y}
            width={SVG_W}
            height={SOIL_H}
            fill="url(#soilPattern)"
          />
          {/* Lisere or sur la surface */}
          <line
            x1={0}
            y1={SURFACE_Y}
            x2={SVG_W}
            y2={SURFACE_Y}
            stroke={PALETTE.gold}
            strokeWidth={2}
            opacity={0.5}
          />

          {/* ---------------------------------------------------------------- */}
          {/* COUCHES SOUTERRAINES (clippees par revealMask) */}
          {/* ---------------------------------------------------------------- */}
          <g clipPath="url(#revealMask)">
            {layers.map((layer, i) => {
              const ly = SURFACE_Y + SOIL_H + i * LAYER_H;
              const op = layerOpacity(i);

              return (
                <g key={i} opacity={op}>
                  {/* Fond de la couche avec ombre interne */}
                  <rect
                    x={0}
                    y={ly}
                    width={SVG_W}
                    height={LAYER_H}
                    fill={layer.color}
                    filter="url(#layer-depth)"
                  />

                  {/* Texture legere sur la couche */}
                  <rect
                    x={0}
                    y={ly}
                    width={SVG_W}
                    height={LAYER_H}
                    fill="url(#soilPattern)"
                    opacity={0.4}
                  />

                  {/* Separateur entre couches */}
                  {i > 0 && (
                    <line
                      x1={0}
                      y1={ly}
                      x2={SVG_W}
                      y2={ly}
                      stroke={PALETTE.ivory}
                      strokeWidth={1}
                      opacity={0.3}
                    />
                  )}

                  {/* Indicateur de profondeur (trait vertical gauche) */}
                  <rect
                    x={0}
                    y={ly}
                    width={6}
                    height={LAYER_H}
                    fill={PALETTE.gold}
                    opacity={0.7}
                  />

                  {/* Label nom de la couche */}
                  <text
                    x={LAYER_X_PAD + 20}
                    y={ly + LAYER_H / 2 + 12}
                    fill={PALETTE.ivory}
                    fontSize={36}
                    fontWeight={700}
                    fontFamily="'Oswald', 'Arial Black', sans-serif"
                    letterSpacing="0.1em"
                  >
                    {layer.name}
                  </text>

                  {/* Valeur de la couche (fade in plus tardif) */}
                  <text
                    x={SVG_W - LAYER_X_PAD}
                    y={ly + LAYER_H / 2 + 11}
                    textAnchor="end"
                    fill={PALETTE.ivory}
                    fontSize={32}
                    fontWeight={400}
                    fontFamily="'Oswald', sans-serif"
                    letterSpacing="0.02em"
                    opacity={textOpacity}
                  >
                    {layer.value}
                  </text>
                </g>
              );
            })}

            {/* Fond sombre sous la derniere couche (profondeur infinie) */}
            <rect
              x={0}
              y={SURFACE_Y + SOIL_H + layers.length * LAYER_H}
              width={SVG_W}
              height={60}
              fill="#080808"
            />
          </g>
        </svg>

        {/* ------------------------------------------------------------------ */}
        {/* OVERLAY VERRE COTE DROIT (visible a partir de f60)                 */}
        {/* ------------------------------------------------------------------ */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "28%",
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(2px)",
            borderLeft: "1px solid rgba(212,197,160,0.2)",
            opacity: overlayOpacity,
          }}
        />

        {/* ------------------------------------------------------------------ */}
        {/* MASQUE FONDU BORDS GAUCHE ET DROIT                                 */}
        {/* ------------------------------------------------------------------ */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(90deg, #03224c 0%, transparent 8%, transparent 92%, #03224c 100%)",
          }}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TAGLINE — en dehors du container, position absolute en bas          */}
      {/* ------------------------------------------------------------------ */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          color: PALETTE.ivory,
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 42,
          fontStyle: "italic",
          fontWeight: 400,
          letterSpacing: "0.05em",
          opacity: taglineOpacity,
        }}
      >
        {tagline}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Demo
// ---------------------------------------------------------------------------

export const CROSS_SECTION_DEMO_FRAMES = 90;

export const CrossSectionDemo: React.FC = () => (
  <CrossSection
    surfaceLabel="Niger — 25 millions d'habitants"
    tagline="What's above. What's below."
    layers={[
      { name: "Uranium",  color: "#4a6a8a", value: "$78/lb"    },
      { name: "Or",       color: "#b8893f", value: "$2,340/oz" },
      { name: "Petrole",  color: "#1a1a1a", value: "$30B/an"   },
      { name: "Fer",      color: "#6a4a3a", value: "$8B/an"    },
    ]}
  />
);
