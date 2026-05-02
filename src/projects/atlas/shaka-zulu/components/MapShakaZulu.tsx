// Carte d3-geo Atlas Shaka Zulu — SVG paths precomputes via precompute-shaka-zulu-data.mjs
// 3 vues : territoire (S1/S3 debut) | expansion (S3 climax) | mourning (S4)
// Pattern identique Mansa Moussa V2 : JSON statique + composant React pur SVG.

import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PALETTE } from "../timing";
import data from "../shaka-zulu-data.json";

// =============================================================================
// PALETTE CARTE
// =============================================================================
const MAP_COLORS = {
  ocean:        "#1A2A1A",   // vert très sombre, mer d'Arabie / Indien
  land:         "#4A3520",   // brun parchemin sombre — terres neutres
  landStroke:   "#2A1A08",   // contour terres
  kwazulu:      PALETTE.PARCHEMIN,  // #F5E6C8 — territoire zulu mis en avant
  kwazuluStroke: PALETTE.OR,        // #C8A84B
  empireOverlay: PALETTE.BORDEAUX,  // #8B1A1A — expansion empire
  markerBordeaux: PALETTE.BORDEAUX,
  markerOr:     PALETTE.OR,
  labelColor:   PALETTE.PARCHEMIN,
};

// Pays du territoire zoulou (mis en avant avec couleur PARCHEMIN)
const KWAZULU_ISO = new Set(["ZAF", "LSO", "SWZ", "MOZ"]);

// =============================================================================
// TYPES
// =============================================================================
export type MapMode = "territoire" | "expansion" | "mourning";

export interface MapShakaZuluProps {
  mode: MapMode;
  // Frames locaux (relatifs au début de la scène parente)
  revealStartFrame?: number;
  // Afficher les labels des lieux
  showLabels?: boolean;
  // Afficher markers pulsants (palais, batailles)
  showMarkers?: boolean;
  // Afficher le path impi (expansion uniquement)
  showImpiPath?: boolean;
  impiPathProgress?: number; // 0->1, contrôle avancement caravane
  // Filtre parchemin sur le <g> carte uniquement (pas composition entière)
  withGrain?: boolean;
  // Opacité globale (pour fade in/out externe)
  opacity?: number;
}

// =============================================================================
// MARKER PULSANT
// =============================================================================
const PulseMarker: React.FC<{
  x: number;
  y: number;
  color: string;
  size?: number;
  frame: number;
  delayFrames?: number;
}> = ({ x, y, color, size = 8, frame, delayFrames = 0 }) => {
  const f = Math.max(0, frame - delayFrames);
  const pulse = 0.5 + 0.5 * Math.abs(Math.sin(f * 0.08));
  const ringScale = 1 + 0.6 * Math.abs(Math.sin(f * 0.06));
  return (
    <g>
      <circle cx={x} cy={y} r={size * ringScale} fill="none" stroke={color} strokeWidth="1.5" opacity={0.3 * pulse} />
      <circle cx={x} cy={y} r={size * 0.6} fill={color} opacity={0.7 + 0.3 * pulse} />
      <circle cx={x} cy={y} r={size * 0.25} fill="#fff" opacity={0.9} />
    </g>
  );
};

// =============================================================================
// LABEL CARTE
// =============================================================================
const MapLabel: React.FC<{
  x: number;
  y: number;
  text: string;
  offsetX?: number;
  offsetY?: number;
  fontSize?: number;
  opacity?: number;
}> = ({ x, y, text, offsetX = 14, offsetY = -6, fontSize = 22, opacity = 1 }) => (
  <g opacity={opacity}>
    {/* Halo lisibilité */}
    <text
      x={x + offsetX}
      y={y + offsetY}
      fontFamily="'Cormorant Garamond', serif"
      fontSize={fontSize}
      fontWeight="700"
      fill="#000"
      stroke="#000"
      strokeWidth="4"
      strokeLinejoin="round"
      textAnchor="start"
      opacity={0.6}
    >
      {text}
    </text>
    <text
      x={x + offsetX}
      y={y + offsetY}
      fontFamily="'Cormorant Garamond', serif"
      fontSize={fontSize}
      fontWeight="700"
      fill={MAP_COLORS.labelColor}
      textAnchor="start"
    >
      {text}
    </text>
  </g>
);

// =============================================================================
// FILTRE GRAIN PARCHEMIN (appliqué sur <g> carte uniquement)
// =============================================================================
const GRAIN_FILTER_ID = "mapGrainShaka";

const MapGrainDefs: React.FC = () => (
  <defs>
    <filter id={GRAIN_FILTER_ID} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.65"
        numOctaves="3"
        stitchTiles="stitch"
        result="noise"
      />
      <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
      <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blended" />
      <feComponentTransfer in="blended">
        <feFuncA type="linear" slope="1" />
      </feComponentTransfer>
    </filter>

    {/* Filtre mourning-warp (S4) — baseFrequency animée via inline style sur feDisplacementMap */}
    <filter id="mourningWarp" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence
        id="mourningTurbulence"
        type="turbulence"
        baseFrequency="0.02"
        numOctaves="2"
        result="warpNoise"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="warpNoise"
        scale="0"
        xChannelSelector="R"
        yChannelSelector="G"
        id="mourningDisplace"
      />
    </filter>

    <radialGradient id="oceanGrad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stopColor="#1E3A2A" />
      <stop offset="100%" stopColor="#0A1A0E" />
    </radialGradient>
  </defs>
);

// =============================================================================
// COMPOSANT PRINCIPAL
// =============================================================================
export const MapShakaZulu: React.FC<MapShakaZuluProps> = ({
  mode = "territoire",
  revealStartFrame = 0,
  showLabels = true,
  showMarkers = true,
  showImpiPath = false,
  impiPathProgress = 0,
  withGrain = true,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - revealStartFrame);

  // Reveal spring
  const revealT = spring({
    frame: localFrame,
    fps,
    config: { damping: 18, stiffness: 80 },
    from: 0,
    to: 1,
  });

  // Sélection dataset selon mode
  const mapData = mode === "expansion" ? data.expansion
    : mode === "mourning" ? data.mourning
    : data.territoire;

  const { countries, places } = mapData;

  // Ken Burns drift très doux
  const driftX = Math.sin(frame * 0.008) * 4;
  const driftY = Math.cos(frame * 0.007) * 3;

  // Scale léger pour effet respiration (mourning = légère pulsation)
  const breathScale = mode === "mourning"
    ? 1 + 0.004 * Math.sin(frame * 0.04)
    : 1.0;

  // Impi path — tracé progressif via strokeDashoffset
  const impiPathData = mode === "expansion" ? (data.expansion as typeof data.expansion) : null;
  const impiNordPath = impiPathData?.impiPathNord ?? "";
  const impiNordLength = 500; // approximation — mesuré visuellement
  const impiDashOffset = impiNordLength * (1 - impiPathProgress);

  const filterAttr = withGrain ? `url(#${GRAIN_FILTER_ID})` : undefined;

  return (
    <g opacity={opacity * revealT}>
      <MapGrainDefs />

      {/* Fond océan */}
      <rect x="0" y="0" width="720" height="1280" fill="url(#oceanGrad)" />

      {/* Carte pays — grain uniquement sur ce groupe */}
      <g
        transform={`translate(${driftX} ${driftY}) scale(${breathScale})`}
        filter={filterAttr}
        style={{ transformOrigin: "360px 640px" }}
      >
        {/* Pays de fond */}
        {countries.map((c) => (
          <path
            key={c.iso}
            d={c.d}
            fill={KWAZULU_ISO.has(c.iso) ? MAP_COLORS.kwazulu : MAP_COLORS.land}
            stroke={KWAZULU_ISO.has(c.iso) ? MAP_COLORS.kwazuluStroke : MAP_COLORS.landStroke}
            strokeWidth={KWAZULU_ISO.has(c.iso) ? "1.8" : "0.6"}
            strokeOpacity={KWAZULU_ISO.has(c.iso) ? "0.9" : "0.5"}
          />
        ))}

        {/* Overlay expansion empire — uniquement en mode expansion */}
        {mode === "expansion" && (
          <g opacity={interpolate(localFrame, [0, 45], [0, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            {countries
              .filter((c) => KWAZULU_ISO.has(c.iso))
              .map((c) => (
                <path
                  key={`overlay-${c.iso}`}
                  d={c.d}
                  fill={MAP_COLORS.empireOverlay}
                  stroke="none"
                  fillOpacity="0.25"
                />
              ))}
          </g>
        )}

        {/* Path impi (S3 expansion) */}
        {showImpiPath && impiNordPath && (
          <g>
            {/* Halo */}
            <path
              d={impiNordPath}
              fill="none"
              stroke={MAP_COLORS.markerOr}
              strokeWidth="8"
              strokeDasharray={impiNordLength}
              strokeDashoffset={impiDashOffset}
              strokeLinecap="round"
              opacity="0.2"
            />
            {/* Trait principal */}
            <path
              d={impiNordPath}
              fill="none"
              stroke={MAP_COLORS.markerBordeaux}
              strokeWidth="2.5"
              strokeDasharray={impiNordLength}
              strokeDashoffset={impiDashOffset}
              strokeLinecap="round"
            />
          </g>
        )}
      </g>

      {/* Markers + labels (hors filtre grain pour lisibilité) */}
      {showMarkers && places && localFrame > 15 && (
        <g
          opacity={interpolate(localFrame, [15, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        >
          {places.uMgungundlovu && (
            <PulseMarker
              x={places.uMgungundlovu[0]}
              y={places.uMgungundlovu[1]}
              color={MAP_COLORS.markerOr}
              size={10}
              frame={frame}
              delayFrames={20}
            />
          )}
          {places.GqokliHill && mode !== "territoire" && (
            <PulseMarker
              x={places.GqokliHill[0]}
              y={places.GqokliHill[1]}
              color={MAP_COLORS.markerBordeaux}
              size={7}
              frame={frame}
              delayFrames={30}
            />
          )}
          {places.eZiklatini && mode === "mourning" && (
            <PulseMarker
              x={places.eZiklatini[0]}
              y={places.eZiklatini[1]}
              color={MAP_COLORS.markerBordeaux}
              size={7}
              frame={frame}
              delayFrames={40}
            />
          )}
        </g>
      )}

      {showLabels && places && localFrame > 30 && (
        <g
          opacity={interpolate(localFrame, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        >
          {places.uMgungundlovu && (
            <MapLabel
              x={places.uMgungundlovu[0]}
              y={places.uMgungundlovu[1]}
              text="uMgungundlovu"
              fontSize={mode === "territoire" ? 22 : 16}
            />
          )}
          {places.GqokliHill && mode !== "territoire" && (
            <MapLabel
              x={places.GqokliHill[0]}
              y={places.GqokliHill[1]}
              text="Gqokli Hill"
              fontSize={16}
            />
          )}
          {mode === "territoire" && (
            <MapLabel
              x={360}
              y={200}
              text="KwaZulu-Natal"
              offsetX={-80}
              offsetY={0}
              fontSize={34}
              opacity={interpolate(localFrame, [45, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
            />
          )}
        </g>
      )}
    </g>
  );
};
