import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
  delayRender,
  continueRender,
  staticFile,
} from "remotion";
import { evolvePath } from "@remotion/paths";
import * as d3Geo from "d3-geo";
import * as topojson from "topojson-client";

// ============================================================
// SoundjataEmpireReveal — Compact Mali Empire reveal
// 146 frames @ 30fps = 4.86s
// Format : 1080x1920 (vertical Short)
//
// Timing (in frames):
//   0-20    : Carte parchemin apparait (fade-in)
//   20-80   : Les 4 pays de l'empire s'illuminent en or (un par un, ~15f chacun)
//   60-130  : Route de l'or se trace (Niani -> Tombouctou)
//   100-146 : Pulse subtil de l'empire
//
// Derive de HistoricalMap PART 2, compact pour Soundjata Acte VI.
// ============================================================

const W = 1080;
const H = 1920;

// -- Palette GeoAfrique (meme que HistoricalMap) --
const PAL = {
  land: "rgba(212, 203, 184, 0.4)", // plus transparent — laisse voir le parchemin dessous
  landStroke: "#B8A88C",
  gold: "#D4AF37",
  empireGold: "#E8C547",
  empireBorder: "#C9A227",
  empireGlow: "rgba(212, 175, 55, 0.18)",
} as const;

// Empire du Mali (Mali, Senegal, Guinee, Gambie)
const EMPIRE_MALI_ISO = [466, 686, 324, 270];

// Afrique de l'Ouest pour dessiner les frontieres voisines
const WEST_AFRICA_ISO = new Set([
  466, 562, 854, 288, 384, 694, 430, 624, 270, 324,
  686, 478, 768, 204, 566, 132, 180, 120, 140, 148,
]);

// Route de l'or : Niani -> Tombouctou
const ROUTE_GOLD: [number, number][] = [
  [-11.37, 11.37], [-10.5, 12.5], [-8.5, 13.8],
  [-6.0, 15.0], [-4.5, 16.0], [-3.0, 16.76],
];

function makeProjection() {
  return d3Geo
    .geoMercator()
    .center([-10, 15.5])
    .scale(2200)
    .translate([W / 2, H * 0.48]);
}

interface CountryFeature {
  id: number;
  path: string;
}

function useMapData() {
  const [countries, setCountries] = React.useState<CountryFeature[]>([]);
  const [handle] = React.useState(() =>
    delayRender("SoundjataEmpireReveal load")
  );

  React.useEffect(() => {
    fetch(staticFile("_shared/geo-data/countries-50m.json"))
      .then((r) => r.json())
      .then((topo) => {
        const geo = topojson.feature(
          topo,
          topo.objects.countries
        ) as unknown as GeoJSON.FeatureCollection;

        const proj = makeProjection();
        const pathGen = d3Geo.geoPath().projection(proj);

        const features: CountryFeature[] = geo.features
          .map((f) => {
            const d = pathGen(f);
            if (!d) return null;
            return { id: Number(f.id), path: d };
          })
          .filter(Boolean) as CountryFeature[];

        setCountries(features);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [handle]);

  return countries;
}

function buildCurvePath(
  coords: [number, number][],
  proj: d3Geo.GeoProjection
): string {
  const points = coords
    .map((c) => proj(c))
    .filter(Boolean) as [number, number][];
  if (points.length < 2) return "";

  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev[0] + curr[0]) / 2;
    const cpy = (prev[1] + curr[1]) / 2 - 15;
    d += ` Q ${cpx} ${cpy} ${curr[0]} ${curr[1]}`;
  }
  return d;
}

export const SoundjataEmpireReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const countries = useMapData();

  if (countries.length === 0) return <AbsoluteFill />;

  const proj = makeProjection();

  // Fade-in map overlay (0-20f)
  const mapOpacity = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });

  // Each empire country lights up with a delay (20f + 15f per country)
  const empireColors = EMPIRE_MALI_ISO.map((_, i) => {
    const startFrame = 20 + i * 15;
    return spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 20 },
      durationInFrames: 20,
    });
  });

  // Empire glow pulse (100-146f)
  const glowPulse =
    frame > 100
      ? Math.sin((frame - 100) * 0.2) * 0.3 + 0.7
      : 0;

  // Gold route reveal (60-130f)
  const routePath = buildCurvePath(ROUTE_GOLD, proj);
  const routeProgress = interpolate(frame, [60, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0.6, 0.3, 1),
  });
  const routeAnim = evolvePath(routeProgress, routePath);

  return (
    <AbsoluteFill>
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ opacity: mapOpacity }}
      >
        {/* West Africa countries (backdrop) */}
        <g>
          {countries.map((c) => {
            const isWA = WEST_AFRICA_ISO.has(c.id);
            if (!isWA) return null;

            const empireIdx = EMPIRE_MALI_ISO.indexOf(c.id);
            const isEmpire = empireIdx >= 0;

            let fill = PAL.land;
            if (isEmpire && empireColors[empireIdx] > 0) {
              const t = empireColors[empireIdx];
              // Interpolate land -> empire gold
              const r1 = 212, g1 = 203, b1 = 184;
              const r2 = parseInt(PAL.empireGold.slice(1, 3), 16);
              const g2 = parseInt(PAL.empireGold.slice(3, 5), 16);
              const b2 = parseInt(PAL.empireGold.slice(5, 7), 16);
              const r = Math.round(r1 + (r2 - r1) * t);
              const g = Math.round(g1 + (g2 - g1) * t);
              const b = Math.round(b1 + (b2 - b1) * t);
              const alpha = 0.4 + t * 0.5;
              fill = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            }

            return (
              <path
                key={c.id}
                d={c.path}
                fill={fill}
                stroke={
                  isEmpire && empireColors[empireIdx] > 0.5
                    ? PAL.empireBorder
                    : PAL.landStroke
                }
                strokeWidth={
                  isEmpire && empireColors[empireIdx] > 0.5 ? 2.5 : 1.2
                }
              />
            );
          })}
        </g>

        {/* Empire glow pulse overlay */}
        {glowPulse > 0 &&
          countries.map((c) => {
            const empireIdx = EMPIRE_MALI_ISO.indexOf(c.id);
            if (empireIdx < 0) return null;
            return (
              <path
                key={`glow-${c.id}`}
                d={c.path}
                fill={PAL.empireGlow}
                stroke="none"
                style={{ opacity: glowPulse }}
              />
            );
          })}

        {/* Gold route glow (wider stroke, translucent) */}
        {routeProgress > 0 && (
          <path
            d={routePath}
            fill="none"
            stroke={PAL.gold}
            strokeWidth={14}
            strokeOpacity={0.25}
            strokeLinecap="round"
            strokeDasharray={routeAnim.strokeDasharray}
            strokeDashoffset={routeAnim.strokeDashoffset}
          />
        )}

        {/* Gold route main line */}
        {routeProgress > 0 && (
          <path
            d={routePath}
            fill="none"
            stroke={PAL.gold}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={routeAnim.strokeDasharray}
            strokeDashoffset={routeAnim.strokeDashoffset}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
