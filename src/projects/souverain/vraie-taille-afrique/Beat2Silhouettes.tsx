/**
 * Beat2Silhouettes — 4 pays apparaissent sequentiellement dans l'Afrique
 * Projection : Equal Earth (geo-data-equalarea.json)
 * Fenetre : 600f = 20s (frames locales 0..599)
 *
 * Timeline :
 *   f0-f60   : carton "Projection Equal Earth" visible
 *   f10-f80  : USA glisse, tient, s'efface (contour reste)
 *   f90-f160 : Chine idem
 *   f170-f250: Europe idem
 *   f260-f340: Inde idem
 *   f340-f600: hold final — 4 contours ensemble + drift + pulse
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
  exitFrame:    number;
  startOffsetX: number;
  startOffsetY: number;
}

// Sync VO : chaque pays apparait au moment exact ou la voix l'enonce (forced alignment)
// USA   : "quarante-huit Etats americains" = f163 dans la VO, VO demarre a f0 du beat
// Chine : "La Chine" = f257
// Europe: "l'Europe" = f308
// Inde  : "l'Inde"  = f350
// Hold final : tous arrives apres f390, contours pulsent jusqu'a f600
const COUNTRIES: CountryConfig[] = [
  { key: "usa",    label: "Etats-Unis", color: PAL.usa,    appearFrame: 163, exitFrame: 230, startOffsetX: -800, startOffsetY: -700 },
  { key: "china",  label: "Chine",      color: PAL.china,  appearFrame: 257, exitFrame: 295, startOffsetX:  900, startOffsetY:  200 },
  { key: "europe", label: "Europe",     color: PAL.europe, appearFrame: 308, exitFrame: 340, startOffsetX:  100, startOffsetY: -900 },
  { key: "india",  label: "Inde",       color: PAL.india,  appearFrame: 350, exitFrame: 385, startOffsetX:  800, startOffsetY:  600 },
];

const HOLD_START     = 390; // tous arrives, hold final contours
const ZOOM_OUT_START = 450;

// ---------------------------------------------------------------------------
// Fond monde SVG — Equal Earth
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Silhouettes sequentielles — 1 pays a la fois, puis hold contours
// ---------------------------------------------------------------------------

const SilhouettesLayer: React.FC<{
  width: number; height: number; scale: number; frame: number; fps: number;
}> = ({ width, height, scale, frame, fps }) => {
  const cx = width / 2;
  const cy = height / 2;

  const overlays = geoData.overlays as Record<string, {
    path: string; cx: number; cy: number; dx: number; dy: number;
  }>;

  const isHold = frame >= HOLD_START;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <clipPath id="beat2-africa-clip">
          <path d={geoData.africa.path ?? ""} />
        </clipPath>
      </defs>

      <g transform={`translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`}>
        <g clipPath="url(#beat2-africa-clip)">
          {COUNTRIES.map((country) => {
            const overlay = overlays[country.key];
            if (!overlay) return null;

            const elapsed = Math.max(0, frame - country.appearFrame);

            // Glissement entree
            const slideIn = spring({
              frame:  elapsed,
              fps,
              config: { damping: 80, stiffness: 60 },
            });

            const tx = interpolate(slideIn, [0, 1],
              [overlay.dx + country.startOffsetX, overlay.dx],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const ty = interpolate(slideIn, [0, 1],
              [overlay.dy + country.startOffsetY, overlay.dy],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            const rot = interpolate(slideIn, [0, 1],
              [country.startOffsetX > 0 ? 12 : -12, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            // Opacite fill : monte a 0.65, puis descend a 0 a l'exit (sauf pendant le hold)
            let fillOpacity: number;
            let strokeOpacity: number;

            if (isHold) {
              // Hold final : contours seulement, pulse leger
              const holdElapsed = frame - HOLD_START;
              const pulse = 0.55 + Math.sin(holdElapsed / 25 + COUNTRIES.indexOf(country)) * 0.15;
              fillOpacity   = 0;
              strokeOpacity = pulse;
            } else if (frame >= country.exitFrame) {
              // Fade out fill apres l'exit
              fillOpacity = interpolate(
                frame,
                [country.exitFrame, country.exitFrame + 20],
                [0.65, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              strokeOpacity = fillOpacity * 0.8;
            } else {
              // Arrive et tient
              fillOpacity = spring({
                frame:  elapsed,
                fps,
                config: { damping: 80, stiffness: 55 },
                from: 0, to: 0.65,
              });
              strokeOpacity = Math.min(fillOpacity * 1.3, 0.85);
            }

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
                  strokeWidth={isHold ? 2.5 / scale : 1.5 / scale}
                  strokeOpacity={strokeOpacity}
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
// Labels pays — visibles seulement pendant la fenetre active du pays
// ---------------------------------------------------------------------------

const LabelsLayer: React.FC<{
  width: number; height: number; frame: number;
}> = ({ width, height, frame }) => {
  const overlays = geoData.overlays as Record<string, {
    cx: number; cy: number; dx: number; dy: number;
  }>;

  if (frame >= HOLD_START) return null;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {COUNTRIES.map((country) => {
        const overlay = overlays[country.key];
        if (!overlay) return null;

        const window = country.exitFrame - country.appearFrame;
        const fadeLen = Math.min(12, Math.floor(window / 4));
        const labelOpacity = interpolate(
          frame,
          [
            country.appearFrame,
            country.appearFrame + fadeLen,
            country.exitFrame - fadeLen,
            country.exitFrame,
          ],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        if (labelOpacity <= 0) return null;

        const x = overlay.cx + overlay.dx;
        const y = overlay.cy + overlay.dy - 24;

        return (
          <text
            key={country.key}
            x={x}
            y={y}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={32}
            fontFamily="Georgia, serif"
            fontWeight="700"
            opacity={labelOpacity}
            stroke="#1a1a1a"
            strokeWidth={4}
            paintOrder="stroke"
          >
            {country.label}
          </text>
        );
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Carton "Projection Equal Earth"
// ---------------------------------------------------------------------------

const ProjectionLabel: React.FC<{ width: number; frame: number }> = ({ width, frame }) => {
  const opacity = interpolate(frame, [0, 20, 55, 80], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  if (opacity <= 0) return null;
  return (
    <svg
      width={width}
      height={1920}
      viewBox={`0 0 ${width} 1920`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <g opacity={opacity}>
        <rect x={190} y={80} width={700} height={100} rx={8} fill="rgba(10,10,10,0.72)" />
        <text
          x={540}
          y={122}
          textAnchor="middle"
          fill="#d4c29d"
          fontSize={32}
          fontFamily="Georgia, serif"
          fontWeight="700"
        >
          Projection Equal Earth
        </text>
        <text
          x={540}
          y={158}
          textAnchor="middle"
          fill="#a89070"
          fontSize={22}
          fontFamily="Georgia, serif"
          fontStyle="italic"
        >
          Les surfaces sont exactes
        </text>
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

export const Beat2Silhouettes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const mapOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const zoomScale = interpolate(frame, [ZOOM_OUT_START, ZOOM_OUT_START + 45], [1, 0.88], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Drift pendant le hold
  const driftActive = Math.max(0, frame - HOLD_START);
  const driftX = Math.sin(driftActive / 55) * 3;
  const driftY = Math.sin(driftActive / 80) * 2;

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
        />
        <LabelsLayer width={width} height={height} frame={frame} />
      </AbsoluteFill>
      <ProjectionLabel width={width} frame={frame} />
    </AbsoluteFill>
  );
};

export const BEAT2_DURATION = 600;
export const BEAT2_SILHOUETTES_FRAMES = BEAT2_DURATION;
