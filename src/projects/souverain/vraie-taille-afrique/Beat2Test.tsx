/**
 * Beat2Test — validation pipeline projection corrigee
 *
 * Sequence :
 *   0-3s  : carte apparait, USA fade in
 *   3-6s  : Inde arrive, USA reduit a 40% opacity
 *   6-10s : zoom-out leger, les deux ensemble, hold final
 */

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import geoData from "./geo-data.json";

const PAL = {
  ocean:      "#bcd5e3",
  land:       "#ede5d3",
  landAfrica: "#d4a93c",
  border:     "#5a5a5a",
} as const;

const COLORS = {
  usa:   "#2a4a7a",
  india: "#8a5a10",
} as const;

export const BEAT2_TEST_FRAMES = 300; // 10s @ 30fps

// ---------------------------------------------------------------------------
// Fond monde SVG
// ---------------------------------------------------------------------------

const WorldMap: React.FC<{ width: number; height: number; scale: number }> = ({
  width, height, scale,
}) => {
  const africaIdSet = new Set(geoData.africa.paths.map((p) => String(p.id ?? "")));
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
        {geoData.world.paths.map((p) => {
          const isAfrica = africaIdSet.has(String(p.id ?? ""));
          return (
            <path
              key={String(p.id ?? Math.random())}
              d={p.d ?? ""}
              fill={isAfrica ? PAL.landAfrica : PAL.land}
              stroke={PAL.border}
              strokeWidth={0.5 / scale}
              strokeOpacity={0.6}
            />
          );
        })}
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Silhouette clippee sur contour exact Afrique
// ---------------------------------------------------------------------------

const Silhouette: React.FC<{
  overlayKey: "usa" | "india";
  fillOpacity: number;
  width: number;
  height: number;
  scale: number;
}> = ({ overlayKey, fillOpacity, width, height, scale }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const overlay = (geoData.overlays as any)[overlayKey] as {
    path: string; cx: number; cy: number; dx: number; dy: number;
  } | null;
  if (!overlay || fillOpacity <= 0.01) return null;

  const color = COLORS[overlayKey];
  const clipId = `clip-${overlayKey}`;
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
        <clipPath id={clipId}>
          <path d={geoData.africa.path ?? ""} />
        </clipPath>
      </defs>
      <g transform={`translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`}>
        <g clipPath={`url(#${clipId})`}>
          <g transform={`translate(${overlay.dx},${overlay.dy})`}>
            <path
              d={overlay.path}
              fill={color}
              fillOpacity={fillOpacity}
              stroke={color}
              strokeWidth={1.5 / scale}
              strokeOpacity={Math.min(fillOpacity * 1.6, 0.9)}
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Label pays
// ---------------------------------------------------------------------------

const CountryLabel: React.FC<{
  text: string;
  overlayKey: "usa" | "india";
  opacity: number;
  width: number;
  height: number;
}> = ({ text, overlayKey, opacity, width, height }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const overlay = (geoData.overlays as any)[overlayKey] as {
    cx: number; cy: number; dx: number; dy: number;
  } | null;
  if (!overlay || opacity <= 0.01) return null;

  const x = overlay.cx + overlay.dx;
  const y = overlay.cy + overlay.dy - 20;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <text
        x={x}
        y={y}
        textAnchor="middle"
        fill="#1a1a1a"
        fontSize={32}
        fontFamily="Georgia, serif"
        fontWeight="700"
        opacity={opacity}
      >
        {text}
      </text>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

export const Beat2Test: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const USA_APPEAR   = 10;   // ~0.3s
  const INDIA_APPEAR = 90;   // 3s
  const ZOOM_START   = 180;  // 6s

  // Carte fade-in
  const mapOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // USA : apparait fort, puis reduit quand Inde arrive
  const usaFadeIn = spring({
    frame: Math.max(0, frame - USA_APPEAR), fps,
    config: { damping: 80, stiffness: 55 },
    from: 0, to: 0.65,
  });
  const usaDim = spring({
    frame: Math.max(0, frame - INDIA_APPEAR), fps,
    config: { damping: 80, stiffness: 60 },
    from: 1, to: 0.4,
  });
  const usaOpacity = usaFadeIn * usaDim;

  // Inde : apparait a 3s
  const indiaOpacity = spring({
    frame: Math.max(0, frame - INDIA_APPEAR), fps,
    config: { damping: 80, stiffness: 55 },
    from: 0, to: 0.65,
  });

  // Labels
  const usaLabelOpacity = interpolate(frame,
    [USA_APPEAR + 15, USA_APPEAR + 35, INDIA_APPEAR, INDIA_APPEAR + 20],
    [0, 1, 1, 0.25],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const indiaLabelOpacity = interpolate(frame,
    [INDIA_APPEAR + 15, INDIA_APPEAR + 35],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Zoom-out leger a 6s — recule pour voir l'ensemble
  const zoomScale = interpolate(frame, [ZOOM_START, ZOOM_START + 45], [1, 0.88], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.ocean }}>
      <AbsoluteFill style={{ opacity: mapOpacity }}>
        <WorldMap width={width} height={height} scale={zoomScale} />
        <Silhouette overlayKey="usa"   fillOpacity={usaOpacity}   width={width} height={height} scale={zoomScale} />
        <Silhouette overlayKey="india" fillOpacity={indiaOpacity} width={width} height={height} scale={zoomScale} />
        <CountryLabel text="États-Unis" overlayKey="usa"   opacity={usaLabelOpacity}   width={width} height={height} />
        <CountryLabel text="Inde"       overlayKey="india" opacity={indiaLabelOpacity} width={width} height={height} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
