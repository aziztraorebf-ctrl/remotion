/**
 * Beat2EqualArea — test comparatif projection Equal Earth vs Mercator
 * Meme logique que Beat2Silhouettes mais utilise geo-data-equalarea.json
 * Render test uniquement — NE PAS inclure dans la composition finale sans validation Aziz
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

interface CountryConfig {
  key:          "usa" | "china" | "europe" | "india";
  label:        string;
  color:        string;
  appearFrame:  number;
  startOffsetX: number;
  startOffsetY: number;
}

const COUNTRIES: CountryConfig[] = [
  { key: "usa",    label: "Etats-Unis", color: PAL.usa,    appearFrame: 10,  startOffsetX: -800, startOffsetY: -700 },
  { key: "china",  label: "Chine",      color: PAL.china,  appearFrame: 90,  startOffsetX:  900, startOffsetY:  200 },
  { key: "europe", label: "Europe",     color: PAL.europe, appearFrame: 180, startOffsetX:  100, startOffsetY: -900 },
  { key: "india",  label: "Inde",       color: PAL.india,  appearFrame: 270, startOffsetX:  800, startOffsetY:  600 },
];

const ALL_DIM_FRAME  = 360;
const ZOOM_OUT_START = 405;

const WorldMap: React.FC<{ width: number; height: number; scale: number }> = ({
  width, height, scale,
}) => {
  const africaIdSet = new Set(
    (geoData.africa.paths as Array<{ id: unknown }>).map((p) => String(p.id ?? ""))
  );
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

const SilhouettesLayer: React.FC<{
  width: number; height: number; scale: number; frame: number; fps: number;
  pulseFactor: number;
}> = ({ width, height, scale, frame, fps, pulseFactor }) => {
  const cx = width / 2;
  const cy = height / 2;

  const overlays = geoData.overlays as Record<string, {
    path: string; cx: number; cy: number; dx: number; dy: number;
  }>;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <clipPath id="beat2ea-africa-clip">
          <path d={geoData.africa.path ?? ""} />
        </clipPath>
      </defs>

      <g transform={`translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`}>
        <g clipPath="url(#beat2ea-africa-clip)">
          {COUNTRIES.map((country) => {
            const overlay = overlays[country.key];
            if (!overlay) return null;

            const elapsed = Math.max(0, frame - country.appearFrame);

            const slideProgress = spring({
              frame:  elapsed,
              fps,
              config: { damping: 80, stiffness: 60 },
            });

            const tx = interpolate(slideProgress, [0, 1],
              [overlay.dx + country.startOffsetX, overlay.dx],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const ty = interpolate(slideProgress, [0, 1],
              [overlay.dy + country.startOffsetY, overlay.dy],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            const rot = interpolate(slideProgress, [0, 1],
              [country.startOffsetX > 0 ? 12 : -12, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            const arriveOpacity = spring({
              frame:  elapsed,
              fps,
              config: { damping: 80, stiffness: 55 },
              from: 0, to: 0.65,
            });
            const dimFactor = spring({
              frame:  Math.max(0, frame - ALL_DIM_FRAME),
              fps,
              config: { damping: 80, stiffness: 60 },
              from: 1, to: 0.615,
            });
            const fillOpacity = frame >= ALL_DIM_FRAME
              ? pulseFactor
              : arriveOpacity * dimFactor;

            return (
              <g
                key={country.key}
                transform={`translate(${tx},${ty}) rotate(${rot}, ${overlay.cx}, ${overlay.cy})`}
              >
                <path
                  d={overlay.path}
                  fill={country.color}
                  fillOpacity={fillOpacity}
                  stroke={country.color}
                  strokeWidth={1.5 / scale}
                  strokeOpacity={Math.min(fillOpacity * 1.5, 0.85)}
                />
              </g>
            );
          })}
        </g>
      </g>

      {/* Badge "Equal Earth" pour distinguer du render Mercator */}
      <rect x={16} y={16} width={220} height={44} rx={6} fill="rgba(0,0,0,0.65)" />
      <text x={126} y={44} textAnchor="middle" fill="#d4c29d" fontSize={20} fontFamily="Georgia, serif" fontStyle="italic">
        Projection Equal Earth
      </text>
    </svg>
  );
};

const LabelsLayer: React.FC<{
  width: number; height: number; frame: number;
}> = ({ width, height, frame }) => {
  const overlays = geoData.overlays as Record<string, {
    cx: number; cy: number; dx: number; dy: number;
  }>;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {COUNTRIES.map((country, idx) => {
        const overlay = overlays[country.key];
        if (!overlay) return null;

        const nextAppear = COUNTRIES[idx + 1]?.appearFrame ?? 9999;

        const labelOpacity = interpolate(
          frame,
          [country.appearFrame + 15, country.appearFrame + 35, nextAppear, nextAppear + 20],
          [0, 1, 1, 0.25],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const x = overlay.cx + overlay.dx;
        const y = overlay.cy + overlay.dy - 24;

        return (
          <text
            key={country.key}
            x={x}
            y={y}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={28}
            fontFamily="Georgia, serif"
            fontWeight="700"
            opacity={labelOpacity}
            stroke="#1a1a1a"
            strokeWidth={3}
            paintOrder="stroke"
          >
            {country.label}
          </text>
        );
      })}
    </svg>
  );
};

export const Beat2EqualArea: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const mapOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const zoomScale = interpolate(frame, [ZOOM_OUT_START, ZOOM_OUT_START + 45], [1, 0.88], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const driftActive = Math.max(0, frame - ALL_DIM_FRAME);
  const driftX = Math.sin(driftActive / 55) * 3;
  const driftY = Math.sin(driftActive / 80) * 2;

  const silhouettePulse = frame >= ALL_DIM_FRAME
    ? 0.40 + Math.sin(driftActive / 30) * 0.06
    : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.ocean }}>
      <AbsoluteFill
        style={{
          opacity: mapOpacity,
          transform: `translate(${driftX}px, ${driftY}px)`,
        }}
      >
        <WorldMap width={width} height={height} scale={zoomScale} />
        <SilhouettesLayer
          width={width}
          height={height}
          scale={zoomScale}
          frame={frame}
          fps={fps}
          pulseFactor={silhouettePulse}
        />
        <LabelsLayer width={width} height={height} frame={frame} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
