import React, { useMemo } from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  staticFile,
} from "remotion";
import * as d3Geo from "d3-geo";
import * as topojson from "topojson-client";
import { COLORS, FONTS } from "../config/theme";
import { PLAGUE_DATA } from "../config/data";

// We load the TopoJSON at build time via staticFile + fetch
// But for Remotion we use delayRender/continueRender pattern
import { delayRender, continueRender } from "remotion";

interface TerminalEuropeMapProps {
  startFrame: number;
  drawDuration: number;
  width?: number;
  height?: number;
}

// Europe-focused projection bounds
const EUROPE_CENTER: [number, number] = [15, 50];
const EUROPE_SCALE = 800;

export const TerminalEuropeMap: React.FC<TerminalEuropeMapProps> = ({
  startFrame,
  drawDuration,
  width = 1600,
  height = 850,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elapsed = Math.max(0, frame - startFrame);

  // Load TopoJSON data
  const [landPaths, setLandPaths] = React.useState<string[]>([]);
  const [handle] = React.useState(() => delayRender("Loading map data"));

  React.useEffect(() => {
    fetch(staticFile("assets/peste-pixel/maps/land-50m.json"))
      .then((r) => r.json())
      .then((topology) => {
        const land = topojson.feature(
          topology,
          topology.objects.land
        ) as unknown as GeoJSON.FeatureCollection;

        // Create projection focused on Europe
        const projection = d3Geo
          .geoMercator()
          .center(EUROPE_CENTER)
          .scale(EUROPE_SCALE)
          .translate([width / 2, height / 2]);

        const pathGenerator = d3Geo.geoPath().projection(projection);

        const paths = land.features.map((feature) => {
          return pathGenerator(feature) || "";
        });

        setLandPaths(paths);
        continueRender(handle);
      })
      .catch((err) => {
        console.error("Map load error:", err);
        continueRender(handle);
      });
  }, [handle, width, height]);

  // Draw progress: stroke-dasharray animation
  const drawProgress = interpolate(
    elapsed,
    [0, drawDuration * 0.6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Fill progress: land fills in after outline
  const fillProgress = interpolate(
    elapsed,
    [drawDuration * 0.4, drawDuration * 0.8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Grid lines
  const gridLines = useMemo(() => {
    const lines: React.ReactElement[] = [];
    const spacing = 60;
    for (let x = 0; x <= width; x += spacing) {
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke={COLORS.terminalGreen}
          strokeWidth={0.5}
          opacity={0.08}
        />
      );
    }
    for (let y = 0; y <= height; y += spacing) {
      lines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke={COLORS.terminalGreen}
          strokeWidth={0.5}
          opacity={0.08}
        />
      );
    }
    return lines;
  }, [width, height]);

  // City positions via projection
  const cities = useMemo(() => {
    if (landPaths.length === 0) return [];

    const projection = d3Geo
      .geoMercator()
      .center(EUROPE_CENTER)
      .scale(EUROPE_SCALE)
      .translate([width / 2, height / 2]);

    return PLAGUE_DATA.map((point) => {
      const projected = projection([point.lon, point.lat]);
      if (!projected) return null;
      const cityDelay = (point.day / 900) * drawDuration;
      return {
        ...point,
        x: projected[0],
        y: projected[1],
        appearFrame: startFrame + cityDelay,
      };
    }).filter(Boolean) as Array<
      (typeof PLAGUE_DATA)[number] & {
        x: number;
        y: number;
        appearFrame: number;
      }
    >;
  }, [landPaths, startFrame, drawDuration, width, height]);

  if (elapsed <= 0) return null;

  // Estimate total path length for stroke animation
  const estimatedPathLength = 20000;

  return (
    <div style={{ position: "relative", width, height }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Grid overlay */}
        <g opacity={drawProgress * 0.8}>{gridLines}</g>

        {/* Land outlines - drawn progressively */}
        {landPaths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill={COLORS.mapLand}
            fillOpacity={fillProgress * 0.6}
            stroke={COLORS.terminalGreen}
            strokeWidth={1.5}
            strokeOpacity={0.7}
            strokeDasharray={estimatedPathLength}
            strokeDashoffset={estimatedPathLength * (1 - drawProgress)}
          />
        ))}

        {/* Infection spread: concentric circles */}
        {cities.map((city) => {
          if (frame < city.appearFrame) return null;

          const timeSinceAppear = frame - city.appearFrame;
          const spreadRadius = interpolate(
            timeSinceAppear,
            [0, 60],
            [0, 100],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // Stronger pulse for more "alive" radar feel
          const pulse = Math.sin(frame * 0.12 + city.x * 0.01) * 0.2 + 0.8;

          const cityScale = spring({
            frame: timeSinceAppear,
            fps,
            config: { mass: 0.5, damping: 12, stiffness: 200 },
          });

          return (
            <g key={city.city}>
              {/* Concentric radar rings */}
              {[0.25, 0.5, 0.75, 1.0].map((ringPct, ri) => {
                const r = spreadRadius * ringPct;
                if (r < 2) return null;
                return (
                  <circle
                    key={ri}
                    cx={city.x}
                    cy={city.y}
                    r={r}
                    fill="none"
                    stroke={COLORS.infectionRed}
                    strokeWidth={ri === 3 ? 1.5 : 0.8}
                    opacity={
                      (0.6 - ri * 0.12) *
                      pulse *
                      cityScale
                    }
                  />
                );
              })}

              {/* Center glow - bigger, more visible */}
              <circle
                cx={city.x}
                cy={city.y}
                r={8 * cityScale}
                fill={COLORS.infectionRed}
                opacity={0.95 * pulse * cityScale}
              />
              <circle
                cx={city.x}
                cy={city.y}
                r={22 * cityScale}
                fill={COLORS.infectionRed}
                opacity={0.25 * pulse * cityScale}
              />

              {/* City name */}
              <text
                x={city.x}
                y={city.y - 20}
                textAnchor="middle"
                fontFamily={FONTS.body}
                fontSize={18}
                fill={COLORS.terminalGreen}
                opacity={cityScale * 0.85}
                style={
                  {
                    textShadow: "0 0 8px rgba(0,255,65,0.4)",
                  } as React.CSSProperties
                }
              >
                {city.city.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* Infection route lines between cities */}
        {cities.length > 1 &&
          cities.map((city, i) => {
            if (i === 0) return null;
            const prevCity = cities[i - 1];
            if (!prevCity || frame < city.appearFrame) return null;

            const lineProgress = interpolate(
              frame,
              [prevCity.appearFrame, city.appearFrame],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            if (lineProgress <= 0) return null;

            const dx = city.x - prevCity.x;
            const dy = city.y - prevCity.y;
            const endX = prevCity.x + dx * lineProgress;
            const endY = prevCity.y + dy * lineProgress;

            return (
              <line
                key={`route-${i}`}
                x1={prevCity.x}
                y1={prevCity.y}
                x2={endX}
                y2={endY}
                stroke={COLORS.infectionRed}
                strokeWidth={1.5}
                strokeDasharray="6,4"
                opacity={0.6}
              />
            );
          })}
      </svg>
    </div>
  );
};
