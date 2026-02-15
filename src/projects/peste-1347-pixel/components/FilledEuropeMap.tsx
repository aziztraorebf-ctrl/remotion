import React, { useMemo } from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  staticFile,
  delayRender,
  continueRender,
} from "remotion";
import * as d3Geo from "d3-geo";
import * as topojson from "topojson-client";
import { COLORS } from "../config/theme";
import { PLAGUE_DATA } from "../config/data";

interface FilledEuropeMapProps {
  startFrame: number;
  drawDuration: number;
  width?: number;
  height?: number;
}

// Europe-focused projection - slightly higher center for better framing
const EUROPE_CENTER: [number, number] = [15, 52];
const EUROPE_SCALE = 800;

const isEuropean = (feature: GeoJSON.Feature): boolean => {
  const bounds = d3Geo.geoBounds(feature);
  const [[lon1, lat1], [lon2, lat2]] = bounds;
  return lon1 > -25 && lon2 < 50 && lat1 > 30 && lat2 < 75;
};

export const FilledEuropeMap: React.FC<FilledEuropeMapProps> = ({
  startFrame,
  drawDuration,
  width = 950,
  height = 750,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elapsed = Math.max(0, frame - startFrame);

  const [countryPaths, setCountryPaths] = React.useState<
    Array<{ d: string; index: number }>
  >([]);
  const [handle] = React.useState(() =>
    delayRender("Loading countries map data")
  );

  React.useEffect(() => {
    fetch(staticFile("assets/peste-pixel/maps/countries-50m.json"))
      .then((r) => r.json())
      .then((topology) => {
        const countries = topojson.feature(
          topology,
          topology.objects.countries
        ) as unknown as GeoJSON.FeatureCollection;

        const projection = d3Geo
          .geoMercator()
          .center(EUROPE_CENTER)
          .scale(EUROPE_SCALE)
          .translate([width / 2, height / 2]);

        const pathGenerator = d3Geo.geoPath().projection(projection);
        const europeanCountries = countries.features.filter(isEuropean);

        const paths = europeanCountries.map((feature, index) => ({
          d: pathGenerator(feature) || "",
          index,
        }));

        setCountryPaths(paths);
        continueRender(handle);
      })
      .catch((err) => {
        console.error("Countries map load error:", err);
        continueRender(handle);
      });
  }, [handle, width, height]);

  const borderProgress = interpolate(
    elapsed,
    [0, drawDuration * 0.4],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const cities = useMemo(() => {
    if (countryPaths.length === 0) return [];

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
  }, [countryPaths, startFrame, drawDuration, width, height]);

  if (elapsed <= 0) return null;

  const estimatedPathLength = 15000;
  const totalCountries = countryPaths.length;

  return (
    <div style={{ position: "relative", width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <filter id="mapShadow" x="-2%" y="-2%" width="104%" height="104%">
            <feDropShadow
              dx="2"
              dy="3"
              stdDeviation="3"
              floodColor="rgba(0,0,0,0.2)"
            />
          </filter>

          <filter id="infectionGlow">
            <feGaussianBlur stdDeviation="6" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Country fills - solid green (image E style) */}
        {countryPaths.map(({ d, index }) => {
          const countryDelay =
            (index / totalCountries) * drawDuration * 0.3;
          const countryFillStart =
            startFrame + drawDuration * 0.2 + countryDelay;
          const countryOpacity = interpolate(
            frame,
            [countryFillStart, countryFillStart + 20],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <path
              key={`fill-${index}`}
              d={d}
              fill={COLORS.mapLand}
              fillOpacity={countryOpacity * 0.9}
              stroke={COLORS.mapBorder}
              strokeWidth={1.2}
              strokeOpacity={borderProgress}
              strokeDasharray={estimatedPathLength}
              strokeDashoffset={estimatedPathLength * (1 - borderProgress)}
              filter="url(#mapShadow)"
            />
          );
        })}

        {/* Lighter border lines on top */}
        {countryPaths.map(({ d, index }) => (
          <path
            key={`border-${index}`}
            d={d}
            fill="none"
            stroke={COLORS.mapBorder}
            strokeWidth={0.8}
            strokeOpacity={borderProgress * 0.5}
            strokeDasharray={estimatedPathLength}
            strokeDashoffset={estimatedPathLength * (1 - borderProgress)}
          />
        ))}

        {/* Infection dots */}
        {cities.map((city) => {
          if (frame < city.appearFrame) return null;

          const timeSinceAppear = frame - city.appearFrame;
          const pulse =
            Math.sin(frame * 0.1 + city.x * 0.01) * 0.15 + 0.85;

          const cityScale = spring({
            frame: timeSinceAppear,
            fps,
            config: { mass: 0.5, damping: 12, stiffness: 200 },
          });

          return (
            <g key={city.city}>
              {/* Outer glow halo */}
              <circle
                cx={city.x}
                cy={city.y}
                r={14 * cityScale}
                fill={COLORS.infectionGlow}
                opacity={0.4 * pulse * cityScale}
                filter="url(#infectionGlow)"
              />
              {/* Main red dot */}
              <circle
                cx={city.x}
                cy={city.y}
                r={6 * cityScale}
                fill={COLORS.infectionRed}
                opacity={0.95 * pulse * cityScale}
              />
              {/* Bright center */}
              <circle
                cx={city.x}
                cy={city.y}
                r={2.5 * cityScale}
                fill="#FF8A80"
                opacity={0.8 * cityScale}
              />
            </g>
          );
        })}

        {/* Infection route lines */}
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
                strokeWidth={1}
                strokeDasharray="4,3"
                opacity={0.35}
              />
            );
          })}
      </svg>
    </div>
  );
};
