/**
 * LobitoVersionB — Carte sombre Atlas 2D flat + flèches AtlasAttackArrow.
 *
 * Même logique de données que Version A (flux data-driven par pays)
 * mais rendu ATLAS d3-geo parchemin assombri (palette validée session 2026-06-05).
 * Les flèches AtlasAttackArrow vivent DANS le <g> caméra SVG — elles héritent
 * du drift + tilt, s'orientent correctement, et utilisent une projection
 * centeredProjection(Copperbelt) pour que les waypoints lngLat tombent
 * exactement aux bons endroits sur la carte mercWide.
 *
 * Pari : le contraste flèche colorée sur fond sombre est plus lisible que
 * la carte cream belge (à valider par Aziz après comparaison).
 */

import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  ATLAS_COLORS,
  AtlasMercator,
  AtlasCartouche,
  AtlasLabel,
  AtlasPulseMarker,
  AtlasSubtleStars,
} from "../../atlas/_shared/atlas-components";
import { AtlasSharedDefs } from "../../atlas/_reference/mansa-moussa-v2/atlas-v2-shared-defs";
import { AtlasAttackArrow } from "../../atlas/_shared/AtlasAttackArrow";
import { centeredProjection } from "../../atlas/_shared/geoUtils";
import atlasData from "../../atlas/_shared/atlas-v2-data.json";
import {
  JALONS,
  fluxAt,
  fluxColor,
  jalonAt,
  tGlobalFromFrame,
  tonnageAt,
  FLUX_COLORS,
} from "./lobitoFluxData";

// ===========================================================================
// PROJECTION LOBITO — centrée Copperbelt, couvre Lobito→Dar es Salaam
// centre : 26.5°E, -11°N. pxPerDeg : 22 → couvre ~33° = 726px (pleine largeur)
// ===========================================================================
const PROJ_LOBITO = centeredProjection(26.5, -11.0, 22);

// ===========================================================================
// PALETTE "assombri" (validée Aziz 2026-06-05)
// ===========================================================================
const PAL = {
  saturate: 0.82,
  bgOverlay: 0.22,
};

// ===========================================================================
// TIMING
// ===========================================================================
const FPS = 30;
export const LOBITO_B_FRAMES = 30 * FPS; // 900f

const T_START = Math.round(1.6 * FPS);
const T_END   = LOBITO_B_FRAMES - Math.round(2.0 * FPS);

// ===========================================================================
// WAYPOINTS FLÈCHES (lngLat réels — projetés par PROJ_LOBITO dans AtlasAttackArrow)
// ===========================================================================
const WAYPOINTS_WEST = [
  { lon: 27.48, lat: -11.67 }, // Lubumbashi
  { lon: 25.47, lat: -10.72 }, // Kolwezi
  { lon: 22.22, lat: -10.71 }, // Luau (frontière)
  { lon: 19.91, lat: -11.78 }, // Luena
  { lon: 13.55, lat: -12.35 }, // Lobito
];
const WAYPOINTS_EAST = [
  { lon: 27.48, lat: -11.67 }, // Lubumbashi
  { lon: 31.0,  lat: -8.5  }, // vers Tanzanie
  { lon: 36.8,  lat: -7.4  }, // Tanzanie
  { lon: 39.28, lat: -6.82 }, // Dar es Salaam
];

// ===========================================================================
// COMPOSANT
// ===========================================================================
export const LobitoVersionB: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tGlobal = tGlobalFromFrame(frame, T_START, T_END);
  const { jalon } = jalonAt(tGlobal);
  const currentTonnage = tonnageAt(tGlobal);

  // Couleurs pays dynamiques
  const codColor = fluxColor(fluxAt("COD", tGlobal));
  const zmbColor = fluxColor(fluxAt("ZMB", tGlobal));
  const agoColor = fluxColor(fluxAt("AGO", tGlobal));

  const countries = atlasData.mercWide.countries as { iso: string; d: string }[];

  // Camera : drift + tilt assombri (grammaire Atlas)
  const localF = Math.max(0, frame - T_START);
  const driftX = Math.sin(localF * 0.014) * 9;
  const driftY = Math.cos(localF * 0.011) * 6;
  const camZoom = interpolate(localF, [0, 80, T_END - T_START], [1.80, 2.10, 2.10], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tilt = 5;
  const skewX = tilt * 0.15;
  const scaleY = 1 - tilt * 0.008;

  // Focus sur le centre du corridor (Copperbelt region dans repère mercWide)
  // Copperbelt ~ MW.kolwezi [460, 940] calibré session précédente
  const focusX = 450, focusY = 940;
  const camT = `translate(${360 + driftX} ${640 + driftY}) scale(${camZoom} ${camZoom * scaleY}) skewX(${skewX}) translate(${-focusX} ${-focusY})`;

  // Progress des flèches
  const avgFlux = fluxAt("COD", tGlobal);
  const eastProgress = interpolate(tGlobal, [0.0, 0.5], [0.25, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const westProgress = interpolate(tGlobal, [0.35, 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrowWestOp = interpolate(avgFlux, [0.1, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrowEastOp = interpolate(avgFlux, [0.0, 0.3], [1, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Pulse marker Copperbelt (point source)
  const copperbeltSvg = PROJ_LOBITO(27.48, -11.67);

  // HUD
  const hudOp = interpolate(frame, [T_START - 2, T_START + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    * interpolate(frame, [LOBITO_B_FRAMES - 20, LOBITO_B_FRAMES], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const introOp = interpolate(frame, [0, 6, T_START - 6, T_START + 4], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const SVG_W = 720, SVG_H = 1280;

  return (
    <AbsoluteFill>
      {/* Audio */}
      <Audio src={staticFile("atlas/_rnd/lobito/audio/narration-a3.mp3")} volume={1} />
      <Audio src={staticFile("souverain/maroc-batteries/audio/music-A-tension-industrielle.mp3")}
        volume={interpolate(frame, [0, 30, LOBITO_B_FRAMES - 40, LOBITO_B_FRAMES], [0, 0.14, 0.14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ width: "100%", height: "100%", filter: `saturate(${PAL.saturate})` }}
      >
        <AtlasSharedDefs />

        {/* Fond + étoiles */}
        <rect x="0" y="0" width={SVG_W} height={SVG_H} fill="url(#bgGrad)" />
        <AtlasSubtleStars opacity={0.45} />

        {/* CARTE + FLÈCHES dans le même groupe caméra */}
        <g transform={camT}>
          {/* Carte Atlas mercWide — pays colorés selon flux */}
          <AtlasMercator
            countries={countries}
            highlightFills={{ COD: codColor, ZMB: zmbColor, AGO: agoColor }}
            oceanColor={ATLAS_COLORS.oceanDeep}
            landColor={ATLAS_COLORS.land}
            strokeColor={ATLAS_COLORS.landStroke}
          />

          {/* FLÈCHE EST (Chine) — rouge brique */}
          <AtlasAttackArrow
            waypoints={WAYPOINTS_EAST}
            progress={eastProgress}
            color={FLUX_COLORS.china}
            strokeWidth={4.5}
            headType="arrow"
            marchingFrame={frame}
            opacity={arrowEastOp * hudOp}
            projection={PROJ_LOBITO}
            curved={false}
          />

          {/* FLÈCHE OUEST (Lobito) — vert atlas, plus épaisse (la "nouvelle" route) */}
          <AtlasAttackArrow
            waypoints={WAYPOINTS_WEST}
            progress={westProgress}
            color={FLUX_COLORS.lobito}
            strokeWidth={6}
            headType="arrow"
            marchingFrame={frame}
            opacity={arrowWestOp * hudOp}
            projection={PROJ_LOBITO}
            curved={false}
          />

          {/* Point source : Copperbelt */}
          <AtlasPulseMarker
            coord={[copperbeltSvg[0], copperbeltSvg[1]]}
            beatStart={T_START + 20}
            color={ATLAS_COLORS.empireGold}
          />

          {/* Labels */}
          <AtlasLabel
            coord={[copperbeltSvg[0], copperbeltSvg[1]]}
            text="COPPERBELT"
            appearAt={T_START + 30}
            fontSize={14}
          />
        </g>

        {/* Cartouche date — hors caméra, droit */}
        {frame >= T_START && (
          <g opacity={hudOp}>
            {/* Date haut centre */}
            <g transform={`translate(360 130)`}>
              <rect x="-160" y="-40" width="320" height="76" rx="8"
                fill={ATLAS_COLORS.cream} stroke={ATLAS_COLORS.textInk} strokeWidth="2" />
              <text x="0" y="5" textAnchor="middle" fontFamily="Georgia, serif"
                fontSize="46" fontWeight="800" fill={ATLAS_COLORS.textInk}
                >
                {jalon.date}
              </text>
              <text x="0" y="28" textAnchor="middle" fontFamily="Cormorant Garamond, serif"
                fontSize="18" fontWeight="600" fill={ATLAS_COLORS.textInk} opacity="0.65">
                Corridor de Lobito
              </text>
            </g>

            {/* Bas — tonnage + légende */}
            <g transform="translate(360 1100)">
              <rect x="-260" y="-58" width="520" height="112" rx="8"
                fill={ATLAS_COLORS.cream} stroke={ATLAS_COLORS.textInk} strokeWidth="2" />
              <text x="0" y="-25" textAnchor="middle" fontFamily="Georgia, serif"
                fontSize="14" fontWeight="700" fill={ATLAS_COLORS.textInk} opacity="0.65"
                letterSpacing="2.5" style={{ textTransform: "uppercase" } as any}>
                COBALT EXPORTÉ · ESTIMÉ
              </text>
              <text x="0" y="10" textAnchor="middle" fontFamily="Georgia, serif"
                fontSize="46" fontWeight="800" fill={ATLAS_COLORS.textInk}>
                {currentTonnage.toFixed(1)} Mt
              </text>
              {/* Légende couleurs */}
              <rect x="-140" y="22" width="14" height="14" rx="3" fill={FLUX_COLORS.china} />
              <text x="-120" y="34" fontFamily="Cormorant Garamond, serif" fontSize="17"
                fontWeight="600" fill={ATLAS_COLORS.textInk}>Route Chine (Est)</text>
              <rect x="18" y="22" width="14" height="14" rx="3" fill={FLUX_COLORS.lobito} />
              <text x="38" y="34" fontFamily="Cormorant Garamond, serif" fontSize="17"
                fontWeight="600" fill={ATLAS_COLORS.textInk}>Route Lobito (Ouest)</text>
            </g>

            {/* Bandeau événement bas */}
            <g transform="translate(360 1210)">
              <rect x="-310" y="-28" width="620" height="52" rx="7"
                fill={ATLAS_COLORS.cream} stroke={ATLAS_COLORS.textInk} strokeWidth="1.8" />
              <text x="0" y="8" textAnchor="middle" fontFamily="Cormorant Garamond, serif"
                fontSize="26" fontWeight="600" fill={ATLAS_COLORS.textInk}>
                {jalon.label}
              </text>
            </g>
          </g>
        )}

        {/* Voile sombre */}
        {PAL.bgOverlay > 0 && <rect x="0" y="0" width={SVG_W} height={SVG_H} fill="#0a0d14" opacity={PAL.bgOverlay} />}
        {/* Vignette */}
        <rect x="0" y="0" width={SVG_W} height={SVG_H} fill="url(#vignette)" />

        {/* Carton intro */}
        {introOp > 0 && (
          <g opacity={introOp}>
            <rect x="100" y="530" width="520" height="220" rx="12"
              fill={ATLAS_COLORS.cream} stroke={ATLAS_COLORS.textInk} strokeWidth="2.5" />
            <text x="360" y="598" textAnchor="middle" fontFamily="Cormorant Garamond, serif"
              fontSize="18" fontWeight="700" fill={ATLAS_COLORS.textInk} opacity="0.65"
              letterSpacing="6" style={{ textTransform: "uppercase" } as any}>
              AFRIQUE CENTRALE
            </text>
            <text x="360" y="658" textAnchor="middle" fontFamily="Cormorant Garamond, serif"
              fontSize="52" fontWeight="800" fill={ATLAS_COLORS.textInk}>
              Corridor de Lobito
            </text>
            <text x="360" y="702" textAnchor="middle" fontFamily="Cormorant Garamond, serif"
              fontSize="22" fontWeight="600" fill={ATLAS_COLORS.textInk} opacity="0.75">
              2000 — 2024
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
