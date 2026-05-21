/**
 * Beat 2 — "Les États-Unis rentrent dedans. La Chine aussi. L'Europe entière. Et l'Inde."
 *
 * Approche : d3-geo SVG pur, meme projection pour fond + overlays
 * Silhouettes centrees sur l'Afrique via translate SVG
 * ClipPath CSS sur un div conteneur pour limiter le debordement
 */

import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AUDIO_SEGMENTS, BEATS } from "./timing";
import geoData from "./geo-data.json";

// Palette CartoCaspian reproduite en SVG
const PAL = {
  ocean:      "#bcd5e3",
  land:       "#ede5d3",
  landAfrica: "#d4a93c",
  border:     "#5a5a5a",
} as const;

// Couleurs silhouettes
const OVERLAY_COLORS = {
  usa:    "#2a4a7a",
  china:  "#7a2a2a",
  europe: "#2a5a2a",
  india:  "#8a5a10",
} as const;

// Timing apparition frames locales (0 = debut Beat 2)
const APPEAR = { usa: 8, china: 48, europe: 92, india: 130 } as const;

const LABELS = {
  usa:    "États-Unis",
  china:  "Chine",
  europe: "Europe",
  india:  "Inde",
} as const;

export const BEAT2_SVG_FRAMES = BEATS.beat2.durationInFrames;

type OverlayKey = keyof typeof OVERLAY_COLORS;

// ---------------------------------------------------------------------------
// Fond monde SVG
// ---------------------------------------------------------------------------

const WorldMap: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const africaIdSet = new Set(geoData.africa.paths.map((p) => String(p.id ?? "")));
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0 }}
    >
      {geoData.world.paths.map((p) => {
        const isAfrica = africaIdSet.has(String(p.id ?? ""));
        return (
          <path
            key={String(p.id ?? Math.random())}
            d={p.d ?? ""}
            fill={isAfrica ? PAL.landAfrica : PAL.land}
            stroke={PAL.border}
            strokeWidth={0.5}
            strokeOpacity={0.6}
          />
        );
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Overlay silhouette individuel
// ---------------------------------------------------------------------------

const OverlaySilhouette: React.FC<{
  overlayKey: OverlayKey;
  frame: number;
  fps: number;
  width: number;
  height: number;
  clipRect: { x: number; y: number; w: number; h: number };
}> = ({ overlayKey, frame, fps, width, height, clipRect }) => {
  const appearFrame = APPEAR[overlayKey];
  const localFrame = frame - appearFrame;
  if (localFrame < 0) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const overlay = (geoData.overlays as any)[overlayKey] as {
    path: string; cx: number; cy: number; dx: number; dy: number;
  } | null;
  if (!overlay) return null;

  const fillOpacity = spring({
    frame: localFrame,
    fps,
    config: { damping: 80, stiffness: 55, mass: 1 },
    from: 0,
    to: 0.58,
  });

  const slideProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 70, stiffness: 48, mass: 1 },
    from: 0,
    to: 1,
  });

  const currentDy = interpolate(slideProgress, [0, 1], [overlay.dy - 80, overlay.dy]);

  const labelOpacity = interpolate(localFrame, [22, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const color = OVERLAY_COLORS[overlayKey];
  const label = LABELS[overlayKey];

  // Centre du label = centre Afrique (cx du pays + dx)
  const labelX = overlay.cx + overlay.dx;
  const labelY = overlay.cy + currentDy - 24;

  const clipId = `clip-${overlayKey}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0, overflow: "visible" }}
    >
      <defs>
        {/* Clip exact sur le contour de l'Afrique */}
        <clipPath id={clipId}>
          <path d={geoData.africa.path ?? ""} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <g transform={`translate(${overlay.dx}, ${currentDy})`}>
          <path
            d={overlay.path}
            fill={color}
            fillOpacity={fillOpacity}
            stroke={color}
            strokeWidth={2}
            strokeOpacity={Math.min(fillOpacity * 1.6, 0.9)}
          />
        </g>
      </g>

      {/* Label hors clip pour qu il reste lisible */}
      <text
        x={labelX}
        y={labelY}
        textAnchor="middle"
        fill="#1a1a1a"
        fontSize={30}
        fontFamily="Georgia, serif"
        fontWeight="700"
        opacity={labelOpacity}
      >
        {label}
      </text>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Composant principal Beat 2
// ---------------------------------------------------------------------------

export const Beat2SilhouettesSVG: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const mapOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Zone clip = bounding box Afrique + marge 8%
  const af = geoData.africa;
  const mX = (af.w ?? 600) * 0.08;
  const mY = (af.h ?? 700) * 0.08;
  const clipRect = {
    x: (af.cx ?? width / 2) - (af.w ?? 600) / 2 - mX,
    y: (af.cy ?? height / 2) - (af.h ?? 700) / 2 - mY,
    w: (af.w ?? 600) + mX * 2,
    h: (af.h ?? 700) + mY * 2,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.ocean }}>
      <AbsoluteFill style={{ opacity: mapOpacity }}>
        {/* Fond monde */}
        <WorldMap width={width} height={height} />

        {/* Overlays silhouettes */}
        {(["usa", "china", "europe", "india"] as OverlayKey[]).map((key) => (
          <OverlaySilhouette
            key={key}
            overlayKey={key}
            frame={frame}
            fps={fps}
            width={width}
            height={height}
            clipRect={clipRect}
          />
        ))}
      </AbsoluteFill>

      <Audio
        src={staticFile(AUDIO_SEGMENTS.beat2.file)}
        startFrom={0}
        endAt={AUDIO_SEGMENTS.beat2.durationFrames}
      />
    </AbsoluteFill>
  );
};
