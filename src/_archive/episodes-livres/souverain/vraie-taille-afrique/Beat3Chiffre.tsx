/**
 * Beat3Chiffre — climax "30,3 M km2"
 * Fenetre : 240f = 8s (frames locales 0..239)
 * VO "Trente virgule trois millions de kilometres carres." = 89f
 *
 * - Heritage Beat 2 : les 4 silhouettes restent a 40% opacity
 * - Compteur 0->30,3 sur 30f au debut, spring()
 * - Chiffre pulse leger post-VO
 * - Label source bas-droite
 */

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import geoData from "./geo-data-equalarea.json";

const PAL = {
  ocean:      "#bcd5e3",
  land:       "#ede5d3",
  landAfrica: "#d4a93c",
  border:     "#5a5a5a",
  usa:        "#2a4a7a",
  china:      "#c0392b",
  europe:     "#2d6a3a",
  india:      "#8a5a10",
} as const;

const COUNTRY_COLORS: Record<string, string> = {
  usa:    PAL.usa,
  china:  PAL.china,
  europe: PAL.europe,
  india:  PAL.india,
};

// Frame locale ou le chiffre commence a compter
const COUNT_START = 5;
// Frame locale post-VO pour le pulse (VO = 89f)
const PULSE_START = 95;

// ---------------------------------------------------------------------------
// Fond monde + silhouettes heritees (figees a leur position finale Beat 2)
// ---------------------------------------------------------------------------

const StaticMap: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const africaIdSet = new Set(
    (geoData.africa.paths as Array<{ id: unknown }>).map((p) => String(p.id ?? ""))
  );
  const cx = width / 2;
  const cy = height / 2;
  const scale = 0.88; // zoom-out final de Beat 2

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <g transform={`translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`}>
        {(geoData.world.paths as Array<{ id: unknown; d: string }>).map((p) => {
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

const StaticSilhouettes: React.FC<{ width: number; height: number; frame: number }> = ({ width, height, frame }) => {
  const overlays = geoData.overlays as Record<string, {
    path: string; dx: number; dy: number; cx: number; cy: number;
  }>;
  const cx = width / 2;
  const cy = height / 2;
  const scale = 0.88;

  // Drift lent — empêche le freeze visuel
  const driftX = Math.sin(frame / 60) * 2.5;
  const driftY = Math.sin(frame / 85) * 1.8;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0, transform: `translate(${driftX}px, ${driftY}px)` }}
    >
      <defs>
        <clipPath id="beat3-africa-clip">
          <path d={geoData.africa.path ?? ""} />
        </clipPath>
      </defs>
      <g transform={`translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`}>
        <g clipPath="url(#beat3-africa-clip)">
          {Object.entries(COUNTRY_COLORS).map(([key, color], idx) => {
            const overlay = overlays[key];
            if (!overlay) return null;
            // Pulse opacity decale par pays — chacun pulse a son propre rythme
            const pulse = 0.35 + Math.sin(frame / 28 + idx * 1.1) * 0.10;
            return (
              <g key={key} transform={`translate(${overlay.dx},${overlay.dy})`}>
                <path
                  d={overlay.path}
                  fill={color}
                  fillOpacity={pulse}
                  stroke={color}
                  strokeWidth={1.5 / scale}
                  strokeOpacity={pulse * 1.4}
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
// Compteur 0 -> 30,3
// ---------------------------------------------------------------------------

const CountUpChiffre: React.FC<{
  frame: number;
  fps: number;
  width: number;
  height: number;
}> = ({ frame, fps, width, height }) => {
  const elapsed = Math.max(0, frame - COUNT_START);

  // Spring pour le progress du compteur — arrive a 1 en ~30f
  const countProgress = spring({
    frame:  elapsed,
    fps,
    config: { damping: 100, stiffness: 150 },
  });

  const currentValue = interpolate(countProgress, [0, 1], [0, 30.3], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const displayMain   = currentValue.toFixed(1).replace(".", ",");

  // Fade-in global du chiffre
  const fadeIn = interpolate(elapsed, [0, 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Pulse leger post-VO : scale 1.0 -> 1.04 -> 1.0 sur ~30f
  const pulseElapsed = Math.max(0, frame - PULSE_START);
  const pulseProgress = spring({
    frame:  pulseElapsed,
    fps,
    config: { damping: 60, stiffness: 120 },
    from: 1, to: 1.04,
  });
  const pulseScale = frame < PULSE_START + 60
    ? interpolate(pulseElapsed, [0, 30, 60], [1, 1.04, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      })
    : 1;

  const cx = width / 2;
  const cy = Math.round(height * 0.28); // haut de l'Afrique

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <g
        transform={`translate(${cx},${cy}) scale(${pulseScale}) translate(${-cx},${-cy})`}
        opacity={fadeIn}
      >
        {/* Fond semi-transparent derriere le chiffre */}
        <rect
          x={cx - 280}
          y={cy - 72}
          width={560}
          height={110}
          rx={8}
          fill="rgba(0,0,0,0.45)"
        />
        {/* Chiffre principal + suffixe sur une seule ligne centrée */}
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          fill={PAL.landAfrica}
          fontFamily="Georgia, serif"
          fontWeight="700"
          dominantBaseline="auto"
        >
          <tspan fontSize={96}>{displayMain}</tspan>
          <tspan fontSize={54} dy="-8"> M km²</tspan>
        </text>
      </g>

      {/* Source bas-droite */}
      <text
        x={width - 24}
        y={height - 40}
        textAnchor="end"
        fill="#5a5a5a"
        fontSize={20}
        fontFamily="Georgia, serif"
        fontStyle="italic"
        opacity={fadeIn}
      >
        Source : CIA World Factbook / FAO, 2024
      </text>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

export const Beat3Chiffre: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.ocean }}>
      <StaticMap width={width} height={height} />
      <StaticSilhouettes width={width} height={height} frame={frame} />
      <CountUpChiffre frame={frame} fps={fps} width={width} height={height} />
    </AbsoluteFill>
  );
};

export const BEAT3_DURATION = 240;
