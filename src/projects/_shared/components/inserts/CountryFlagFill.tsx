/**
 * CountryFlagFill — drapeau qui remplit la silhouette exacte d'un pays.
 *
 * Pattern Jacq Adi signature : le drapeau ne flotte pas, il REMPLIT la forme du pays.
 * Realise via SVG <clipPath> sur le path issu de Natural Earth + <image> drapeau.
 *
 * Usage :
 *   <CountryFlagFill
 *     countryName="Dem. Rep. Congo"
 *     flag="cd"
 *     width={1200}
 *     height={900}
 *     glowColor="#ff8c00"
 *   />
 *
 * Lecture du TopoJSON : countries-50m.json (Natural Earth 50m) — deja dans public/_shared/geo-data/
 */

import React, { useMemo } from "react";
import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
import { staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type Topology = {
  type: "Topology";
  objects: Record<string, unknown>;
  arcs: number[][][];
  transform?: unknown;
};

// Chargement synchronous via staticFile + fetch dans useMemo n'est pas possible.
// On lit le fichier au build via import. Workaround : import JSON.
// Ici on passe le topology par prop pour eviter le bundling lourd du JSON.
//
// Mais pour ergonomie : on accepte aussi un chargement lazy avec un fallback.

export type CountryFlagFillProps = {
  topology: Topology;
  countryName: string; // nom dans le TopoJSON (ex: "Dem. Rep. Congo")
  flag: string; // ISO-2 lowercase pour flagcdn
  width: number;
  height: number;
  glowColor?: string;
  borderWidth?: number;
  entryAt?: number;
  showLabel?: string;
  flagOpacity?: number;
};

export const CountryFlagFill: React.FC<CountryFlagFillProps> = ({
  topology,
  countryName,
  flag,
  width,
  height,
  glowColor = "#ff8c00",
  borderWidth = 4,
  entryAt = 0,
  showLabel,
  flagOpacity = 0.95,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relFrame = frame - entryAt;

  const { pathD, bounds, centroid, label } = useMemo(() => {
    const fc = feature(
      topology as any,
      (topology.objects as any).countries
    ) as unknown as { type: "FeatureCollection"; features: any[] };
    const feat = fc.features.find(
      (f) => f.properties?.name === countryName
    );
    if (!feat) {
      return { pathD: "", bounds: [[0, 0], [0, 0]], centroid: [width / 2, height / 2], label: "" };
    }

    const projection = geoMercator().fitExtent(
      [[40, 40], [width - 40, height - 40]],
      feat
    );
    const path = geoPath(projection);
    const d = path(feat) ?? "";
    const b = path.bounds(feat);
    const c = path.centroid(feat);
    return { pathD: d, bounds: b, centroid: c, label: feat.properties?.name ?? "" };
  }, [topology, countryName, width, height]);

  const clipId = `flag-clip-${flag}-${countryName.replace(/\s+/g, "-")}`;
  const flagUrl = `https://flagcdn.com/w2560/${flag}.png`;

  const scaleEntry = spring({
    fps,
    frame: Math.max(0, relFrame),
    config: { damping: 14, stiffness: 90, mass: 0.7 },
  });

  const glowPulse = 0.6 + 0.4 * Math.sin((frame - entryAt) / 22);

  const labelOpacity = interpolate(
    relFrame,
    [30, 60],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // bounding box for the <image> inside clipPath
  const [[x0, y0], [x1, y1]] = bounds;
  const bbX = x0;
  const bbY = y0;
  const bbW = x1 - x0;
  const bbH = y1 - y0;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `scale(${scaleEntry})`,
        transformOrigin: `${centroid[0]}px ${centroid[1]}px`,
      }}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={pathD} />
        </clipPath>
        <filter id={`glow-${clipId}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Glow halo behind flag */}
      <path
        d={pathD}
        fill="none"
        stroke={glowColor}
        strokeWidth={borderWidth + 6}
        opacity={glowPulse * 0.7}
        filter={`url(#glow-${clipId})`}
      />

      {/* Flag image clipped to country shape */}
      <image
        href={flagUrl}
        x={bbX}
        y={bbY}
        width={bbW}
        height={bbH}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
        opacity={flagOpacity}
      />

      {/* Crisp border on top */}
      <path
        d={pathD}
        fill="none"
        stroke={glowColor}
        strokeWidth={borderWidth}
        strokeLinejoin="round"
        opacity={0.95}
      />

      {/* Optional label */}
      {showLabel && (
        <text
          x={centroid[0]}
          y={y1 + 60}
          textAnchor="middle"
          opacity={labelOpacity}
          style={{
            fontFamily: "'Bebas Neue', 'Impact', sans-serif",
            fontSize: 64,
            fill: "white",
            letterSpacing: 6,
            textShadow: "0 4px 16px rgba(0,0,0,0.8)",
          }}
        >
          {showLabel}
        </text>
      )}
    </svg>
  );
};
