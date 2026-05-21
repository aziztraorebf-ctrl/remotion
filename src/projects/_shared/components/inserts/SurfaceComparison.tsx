/**
 * SurfaceComparison — Insert réutilisable : N pays superposés sur un pays cible
 *
 * Principe : thetruesize.com — pays translatés à lat=0 avant projection Mercator
 * → tailles géographiquement exactes, clippées sur le contour exact du pays cible.
 *
 * Validé : "La Vraie Taille de l'Afrique" 2026-05-11
 * Doc technique : memory/tools/d3-geo-taille-comparative.md
 *
 * Usage :
 *   1. Générer un geo-data.json via scripts/precompute-vraie-taille.mjs (adapter pour autre pays cible)
 *   2. Définir OVERLAYS_CONFIG avec les pays à afficher
 *   3. Instancier <SurfaceComparison geoData={...} overlays={OVERLAYS_CONFIG} />
 */

import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OverlayGeoData {
  path: string;
  cx: number;
  cy: number;
  dx: number;
  dy: number;
  w: number;
  h: number;
}

export interface TargetGeoData {
  path: string | null;
  cx: number;
  cy: number;
  w: number;
  h: number;
  paths: Array<{ id: unknown; d: string }>;
}

export interface SurfaceGeoData {
  africa: TargetGeoData;
  overlays: Record<string, OverlayGeoData>;
  world: { paths: Array<{ id: unknown; d: string }> };
}

export interface OverlayConfig {
  key: string;
  label: string;
  color: string;
  appearFrame: number;
  // Direction d'entrée depuis hors-champ (pixels avant translate)
  startOffsetX: number;
  startOffsetY: number;
}

export interface SurfaceComparisonProps {
  geoData: SurfaceGeoData;
  overlays: OverlayConfig[];
  // Palette carte de fond
  palette?: {
    ocean: string;
    land: string;
    landTarget: string;
    border: string;
  };
  // Frame à partir de laquelle tous les pays sont arrivés → dim à 40%
  allArrivedFrame?: number;
  // Frame à partir de laquelle zoom-out commence
  zoomOutFrame?: number;
  zoomOutScale?: number;
}

const DEFAULT_PALETTE = {
  ocean:       "#bcd5e3",
  land:        "#ede5d3",
  landTarget:  "#d4a93c",
  border:      "#5a5a5a",
};

// ---------------------------------------------------------------------------
// Fond monde
// ---------------------------------------------------------------------------

const WorldMap: React.FC<{
  geoData: SurfaceGeoData;
  palette: typeof DEFAULT_PALETTE;
  width: number;
  height: number;
  scale: number;
}> = ({ geoData, palette, width, height, scale }) => {
  const targetIdSet = new Set(geoData.africa.paths.map((p) => String(p.id ?? "")));
  const cx = width / 2;
  const cy = height / 2;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <g transform={`translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`}>
        {geoData.world.paths.map((p) => (
          <path
            key={String(p.id ?? Math.random())}
            d={p.d ?? ""}
            fill={targetIdSet.has(String(p.id ?? "")) ? palette.landTarget : palette.land}
            stroke={palette.border}
            strokeWidth={0.5 / scale}
            strokeOpacity={0.6}
          />
        ))}
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Couche silhouettes
// ---------------------------------------------------------------------------

const SilhouettesLayer: React.FC<{
  geoData: SurfaceGeoData;
  overlays: OverlayConfig[];
  allArrivedFrame: number;
  width: number;
  height: number;
  scale: number;
  frame: number;
  fps: number;
}> = ({ geoData, overlays, allArrivedFrame, width, height, scale, frame, fps }) => {
  const cx = width / 2;
  const cy = height / 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <clipPath id="surface-comparison-clip">
          <path d={geoData.africa.path ?? ""} />
        </clipPath>
      </defs>
      <g transform={`translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`}>
        <g clipPath="url(#surface-comparison-clip)">
          {overlays.map((cfg) => {
            const overlay = geoData.overlays[cfg.key];
            if (!overlay) return null;

            const elapsed = Math.max(0, frame - cfg.appearFrame);

            const slideProgress = spring({ frame: elapsed, fps,
              config: { damping: 80, stiffness: 60 } });

            const tx = interpolate(slideProgress, [0, 1],
              [overlay.dx + cfg.startOffsetX, overlay.dx],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const ty = interpolate(slideProgress, [0, 1],
              [overlay.dy + cfg.startOffsetY, overlay.dy],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

            const rot = interpolate(slideProgress, [0, 1],
              [cfg.startOffsetX > 0 ? 12 : -12, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

            const arriveOpacity = spring({ frame: elapsed, fps,
              config: { damping: 80, stiffness: 55 }, from: 0, to: 0.65 });
            const dimFactor = spring({
              frame: Math.max(0, frame - allArrivedFrame), fps,
              config: { damping: 80, stiffness: 60 }, from: 1, to: 0.615 });
            const fillOpacity = arriveOpacity * dimFactor;

            return (
              <g key={cfg.key}
                transform={`translate(${tx},${ty}) rotate(${rot}, ${overlay.cx}, ${overlay.cy})`}>
                <path
                  d={overlay.path}
                  fill={cfg.color}
                  fillOpacity={fillOpacity}
                  stroke={cfg.color}
                  strokeWidth={1.5 / scale}
                  strokeOpacity={Math.min(fillOpacity * 1.5, 0.85)}
                />
              </g>
            );
          })}
        </g>
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

const LabelsLayer: React.FC<{
  geoData: SurfaceGeoData;
  overlays: OverlayConfig[];
  width: number;
  height: number;
  frame: number;
}> = ({ geoData, overlays, width, height, frame }) => (
  <svg
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
  >
    {overlays.map((cfg, idx) => {
      const overlay = geoData.overlays[cfg.key];
      if (!overlay) return null;
      const nextAppear = overlays[idx + 1]?.appearFrame ?? 9999;
      const labelOpacity = interpolate(
        frame,
        [cfg.appearFrame + 15, cfg.appearFrame + 35, nextAppear, nextAppear + 20],
        [0, 1, 1, 0.25],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
      return (
        <text
          key={cfg.key}
          x={overlay.cx + overlay.dx}
          y={overlay.cy + overlay.dy - 20}
          textAnchor="middle"
          fill="#1a1a1a"
          fontSize={30}
          fontFamily="Georgia, serif"
          fontWeight="700"
          opacity={labelOpacity}
        >
          {cfg.label}
        </text>
      );
    })}
  </svg>
);

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

export const SurfaceComparison: React.FC<SurfaceComparisonProps> = ({
  geoData,
  overlays,
  palette = DEFAULT_PALETTE,
  allArrivedFrame = 360,
  zoomOutFrame = 405,
  zoomOutScale = 0.88,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const mapOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const scale = interpolate(frame, [zoomOutFrame, zoomOutFrame + 45], [1, zoomOutScale], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: palette.ocean }}>
      <div style={{ position: "absolute", inset: 0, opacity: mapOpacity }}>
        <WorldMap geoData={geoData} palette={palette} width={width} height={height} scale={scale} />
        <SilhouettesLayer
          geoData={geoData} overlays={overlays} allArrivedFrame={allArrivedFrame}
          width={width} height={height} scale={scale} frame={frame} fps={fps}
        />
        <LabelsLayer geoData={geoData} overlays={overlays} width={width} height={height} frame={frame} />
      </div>
    </div>
  );
};
