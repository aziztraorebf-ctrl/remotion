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
import {
  HOOK_CITIES,
  HOOK_ROUTES,
  ALL_PLAGUE_CITIES,
  GALLEY_SVG_PATH,
} from "../config/hookData";
import {
  HOOK_SCENE_STARTS,
  HOOK_SCENE_DURATIONS,
  SCENE,
} from "../config/hookTiming";

interface PlagueSpreadMapProps {
  globalFrame: number; // absolute frame within Hook
}

// Camera states for each scene
const CAMERA_STATES = [
  { centerX: 77, centerY: 42.5, scale: 1200 }, // Scene 1: Issyk-Kul zoom
  { centerX: 55, centerY: 43, scale: 800 }, // Scene 2: Pan to Caffa
  { centerX: 25, centerY: 42, scale: 600 }, // Scene 3: Dezoom Mediterranean
  { centerX: 15, centerY: 50, scale: 500 }, // Scene 4: Full Europe
  { centerX: 15, centerY: 50, scale: 500 }, // Scene 5: Same (reframe)
];

// Determine current scene index from global frame
const getSceneIndex = (globalFrame: number): number => {
  for (let i = HOOK_SCENE_STARTS.length - 1; i >= 0; i--) {
    if (globalFrame >= HOOK_SCENE_STARTS[i]) return i;
  }
  return 0;
};

// Map viewport
const MAP_WIDTH = 1920;
const MAP_HEIGHT = 1080;

// Eurasian filter -- wider than European to include Central Asia
const isEurasian = (feature: GeoJSON.Feature): boolean => {
  const bounds = d3Geo.geoBounds(feature);
  const [[lon1, lat1], [lon2, lat2]] = bounds;
  return lon1 > -25 && lon2 < 90 && lat1 > 20 && lat2 < 75;
};

// Major cities for invasion cascade (appear first, slower stagger)
const MAJOR_CITIES = new Set([
  "Messine",
  "Marseille",
  "Paris",
  "Londres",
  "Florence",
  "Venise",
]);

export const PlagueSpreadMap: React.FC<PlagueSpreadMapProps> = ({
  globalFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIndex = Math.min(getSceneIndex(globalFrame), 4); // clamp to scenes 0-4

  const [countryPaths, setCountryPaths] = React.useState<
    Array<{ d: string; index: number }>
  >([]);
  const [handle] = React.useState(() =>
    delayRender("Loading countries map data for PlagueSpreadMap"),
  );

  // Animate camera between states using spring
  const camera = useMemo(() => {
    const current = CAMERA_STATES[sceneIndex];
    const prev =
      sceneIndex > 0 ? CAMERA_STATES[sceneIndex - 1] : CAMERA_STATES[0];
    const localFrame = globalFrame - HOOK_SCENE_STARTS[sceneIndex];

    const t = spring({
      frame: localFrame,
      fps,
      config: { mass: 1, damping: 18, stiffness: 80 },
    });

    return {
      centerX: interpolate(t, [0, 1], [prev.centerX, current.centerX]),
      centerY: interpolate(t, [0, 1], [prev.centerY, current.centerY]),
      scale: interpolate(t, [0, 1], [prev.scale, current.scale]),
    };
  }, [sceneIndex, globalFrame, fps]);

  // Load map data
  React.useEffect(() => {
    fetch(staticFile("assets/peste-pixel/maps/countries-50m.json"))
      .then((r) => r.json())
      .then((topology) => {
        const countries = topojson.feature(
          topology,
          topology.objects.countries,
        ) as unknown as GeoJSON.FeatureCollection;

        // Store all features; projection will be applied per-render based on camera
        const eurasianCountries = countries.features.filter(isEurasian);
        // Use a wide initial projection for path generation
        const projection = d3Geo
          .geoMercator()
          .center([40, 45])
          .scale(500)
          .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);

        const pathGenerator = d3Geo.geoPath().projection(projection);
        const paths = eurasianCountries.map((feature, index) => ({
          d: pathGenerator(feature) || "",
          index,
        }));

        setCountryPaths(paths);
        continueRender(handle);
      })
      .catch((err) => {
        console.error("PlagueSpreadMap load error:", err);
        continueRender(handle);
      });
  }, [handle]);

  // Project cities based on current camera
  const projection = useMemo(() => {
    return d3Geo
      .geoMercator()
      .center([camera.centerX, camera.centerY])
      .scale(camera.scale)
      .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);
  }, [camera]);

  // Generate country paths based on current camera
  const currentPaths = useMemo(() => {
    if (countryPaths.length === 0) return [];
    const pathGenerator = d3Geo.geoPath().projection(projection);

    // Re-fetch topology for re-projection would be expensive,
    // so we use transform on the SVG group instead
    return countryPaths;
  }, [countryPaths, projection]);

  // Project hook cities (Issyk-Kul, Caffa)
  const hookCityPositions = useMemo(() => {
    return HOOK_CITIES.map((city) => {
      const projected = projection([city.lon, city.lat]);
      return projected
        ? { ...city, x: projected[0], y: projected[1] }
        : null;
    }).filter(Boolean) as Array<
      (typeof HOOK_CITIES)[number] & { x: number; y: number }
    >;
  }, [projection]);

  // Project all plague cities for invasion cascade
  const allCityPositions = useMemo(() => {
    return ALL_PLAGUE_CITIES.map((city) => {
      const projected = projection([city.lon, city.lat]);
      return projected
        ? { ...city, x: projected[0], y: projected[1] }
        : null;
    }).filter(Boolean) as Array<
      (typeof ALL_PLAGUE_CITIES)[number] & { x: number; y: number }
    >;
  }, [projection]);

  // Project route points
  const routePaths = useMemo(() => {
    return HOOK_ROUTES.map((route) => {
      const projected = route.points
        .map((p) => projection(p))
        .filter(Boolean) as [number, number][];
      const d = projected
        .map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`)
        .join(" ");
      return { ...route, d, points: projected };
    });
  }, [projection]);

  // Camera transform -- apply camera as SVG transform for smooth animation
  // Instead of re-projecting all paths, we scale/translate the base projection
  const cameraTransform = useMemo(() => {
    // Base projection is centered at [40, 45] scale 500
    const baseScale = 500;
    const baseCenterX = 40;
    const baseCenterY = 45;

    const scaleFactor = camera.scale / baseScale;

    // Calculate translation needed to recenter
    const baseProjCenter = d3Geo
      .geoMercator()
      .center([baseCenterX, baseCenterY])
      .scale(baseScale)
      .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);

    const cameraProjCenter = d3Geo
      .geoMercator()
      .center([camera.centerX, camera.centerY])
      .scale(camera.scale)
      .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);

    // Project a reference point through both
    const refBase = baseProjCenter([camera.centerX, camera.centerY]);
    const refCamera = cameraProjCenter([camera.centerX, camera.centerY]);

    if (!refBase || !refCamera) {
      return `scale(${scaleFactor})`;
    }

    const tx = refCamera[0] - refBase[0] * scaleFactor;
    const ty = refCamera[1] - refBase[1] * scaleFactor;

    return `translate(${tx}, ${ty}) scale(${scaleFactor})`;
  }, [camera]);

  // -- Scene-specific visibility logic --

  // Scene 1: Issyk-Kul dot appears
  const issykKulCity = hookCityPositions.find(
    (c) => c.city === "Issyk-Kul",
  );
  const showIssykKul =
    sceneIndex >= SCENE.ISSYK_KUL && issykKulCity;

  // Scene 2: Route Issyk-Kul -> Caffa + Caffa dot
  const showSilkRoad = sceneIndex >= SCENE.CATAPULTE;
  const caffaCity = hookCityPositions.find((c) => c.city === "Caffa");
  const showCaffa = sceneIndex >= SCENE.CATAPULTE && caffaCity;

  // Scene 2: Silk road progress
  const silkRoadProgress =
    sceneIndex >= SCENE.CATAPULTE
      ? interpolate(
          globalFrame - HOOK_SCENE_STARTS[SCENE.CATAPULTE],
          [0, HOOK_SCENE_DURATIONS[SCENE.CATAPULTE] * 0.7],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : 0;

  // Scene 3: Maritime route + galley progress
  const showGaleres = sceneIndex >= SCENE.GALERES;
  const galeresProgress =
    sceneIndex >= SCENE.GALERES
      ? interpolate(
          globalFrame - HOOK_SCENE_STARTS[SCENE.GALERES],
          [0, HOOK_SCENE_DURATIONS[SCENE.GALERES] * 0.8],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : 0;

  // Scene 3: Messine dot
  const messineCity = allCityPositions.find((c) => c.city === "Messine");
  const showMessine =
    sceneIndex >= SCENE.GALERES && galeresProgress > 0.9 && messineCity;

  // Scene 4: Invasion cascade
  const isInvasion = sceneIndex >= SCENE.MOITIE;
  const invasionLocalFrame = isInvasion
    ? globalFrame - HOOK_SCENE_STARTS[SCENE.MOITIE]
    : 0;

  // Fade out for scene 5 (reframe)
  const mapOpacity =
    sceneIndex >= SCENE.REFRAME
      ? interpolate(
          globalFrame - HOOK_SCENE_STARTS[SCENE.REFRAME],
          [0, HOOK_SCENE_DURATIONS[SCENE.REFRAME] * 0.5],
          [1, 0.1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : 1;

  const estimatedPathLength = 15000;

  // Render infection dot helper
  const renderInfectionDot = (
    x: number,
    y: number,
    key: string,
    appearProgress: number,
  ) => {
    if (appearProgress <= 0) return null;
    const pulse = Math.sin(globalFrame * 0.1 + x * 0.01) * 0.15 + 0.85;
    const scale = Math.min(appearProgress, 1);

    return (
      <g key={key}>
        <circle
          cx={x}
          cy={y}
          r={14 * scale}
          fill={COLORS.infectionGlow}
          opacity={0.4 * pulse * scale}
          filter="url(#infectionGlow)"
        />
        <circle
          cx={x}
          cy={y}
          r={6 * scale}
          fill={COLORS.infectionRed}
          opacity={0.95 * pulse * scale}
        />
        <circle cx={x} cy={y} r={2.5 * scale} fill="#FF8A80" opacity={0.8 * scale} />
      </g>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        width: MAP_WIDTH,
        height: MAP_HEIGHT,
        opacity: mapOpacity,
      }}
    >
      <svg
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      >
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

        {/* Camera-animated group */}
        <g transform={cameraTransform}>
          {/* Country fills */}
          {currentPaths.map(({ d, index }) => (
            <path
              key={`fill-${index}`}
              d={d}
              fill={COLORS.mapLand}
              fillOpacity={0.9}
              stroke={COLORS.mapBorder}
              strokeWidth={1.2 / (camera.scale / 500)}
              strokeOpacity={1}
              filter="url(#mapShadow)"
            />
          ))}

          {/* Country border lines */}
          {currentPaths.map(({ d, index }) => (
            <path
              key={`border-${index}`}
              d={d}
              fill="none"
              stroke={COLORS.mapBorder}
              strokeWidth={0.8 / (camera.scale / 500)}
              strokeOpacity={0.5}
            />
          ))}

          {/* Silk Road route (scene 2+) */}
          {showSilkRoad && routePaths[0] && silkRoadProgress > 0 && (
            <path
              d={routePaths[0].d}
              fill="none"
              stroke={COLORS.gold}
              strokeWidth={2}
              strokeDasharray="8,4"
              strokeDashoffset={
                estimatedPathLength * (1 - silkRoadProgress)
              }
              opacity={0.8}
            />
          )}

          {/* Maritime route (scene 3+) */}
          {showGaleres && routePaths[1] && galeresProgress > 0 && (
            <path
              d={routePaths[1].d}
              fill="none"
              stroke={COLORS.gold}
              strokeWidth={2}
              strokeDasharray="8,4"
              strokeDashoffset={
                estimatedPathLength * (1 - galeresProgress)
              }
              opacity={0.8}
            />
          )}

          {/* Galley sprites on maritime route (scene 3) */}
          {showGaleres &&
            routePaths[1] &&
            routePaths[1].points.length >= 2 &&
            [0, 0.15, 0.3].map((offset, gi) => {
              const progress = Math.max(
                0,
                Math.min(1, galeresProgress - offset),
              );
              if (progress <= 0) return null;

              const pts = routePaths[1].points;
              // Interpolate position along route segments
              const totalSegments = pts.length - 1;
              const segFloat = progress * totalSegments;
              const segIndex = Math.min(
                Math.floor(segFloat),
                totalSegments - 1,
              );
              const segProgress = segFloat - segIndex;

              const x = interpolate(
                segProgress,
                [0, 1],
                [pts[segIndex][0], pts[segIndex + 1][0]],
              );
              const y = interpolate(
                segProgress,
                [0, 1],
                [pts[segIndex][1], pts[segIndex + 1][1]],
              );

              // Oscillation for wave effect
              const waveY =
                Math.sin(globalFrame * 0.15 + gi * 2.1) * 1.5;

              return (
                <g
                  key={`galley-${gi}`}
                  transform={`translate(${x}, ${y + waveY}) scale(0.8)`}
                >
                  <path
                    d={GALLEY_SVG_PATH}
                    fill={COLORS.gold}
                    opacity={0.9}
                    stroke="none"
                  />
                </g>
              );
            })}

          {/* Issyk-Kul dot (scene 1+) */}
          {showIssykKul &&
            issykKulCity &&
            renderInfectionDot(
              issykKulCity.x,
              issykKulCity.y,
              "issyk-kul",
              spring({
                frame:
                  globalFrame -
                  HOOK_SCENE_STARTS[SCENE.ISSYK_KUL] -
                  30,
                fps,
                config: { mass: 0.5, damping: 12, stiffness: 200 },
              }),
            )}

          {/* Caffa dot (scene 2+) */}
          {showCaffa &&
            caffaCity &&
            renderInfectionDot(
              caffaCity.x,
              caffaCity.y,
              "caffa",
              spring({
                frame:
                  globalFrame -
                  HOOK_SCENE_STARTS[SCENE.CATAPULTE] -
                  Math.floor(
                    HOOK_SCENE_DURATIONS[SCENE.CATAPULTE] * 0.6,
                  ),
                fps,
                config: { mass: 0.5, damping: 12, stiffness: 200 },
              }),
            )}

          {/* Messine dot (end of scene 3) */}
          {showMessine &&
            messineCity &&
            renderInfectionDot(
              messineCity.x,
              messineCity.y,
              "messine",
              1,
            )}

          {/* Invasion cascade (scene 4) */}
          {isInvasion &&
            allCityPositions.map((city, i) => {
              // Skip cities already shown individually
              if (
                city.city === "Issyk-Kul" ||
                city.city === "Caffa" ||
                city.city === "Messine"
              )
                return null;

              const isMajor = MAJOR_CITIES.has(city.city);
              // Major cities appear first with 5-frame stagger,
              // then minor cities in burst with 2-frame stagger
              const majorCount = allCityPositions.filter((c) =>
                MAJOR_CITIES.has(c.city),
              ).length;
              const majorIndex = allCityPositions
                .filter((c) => MAJOR_CITIES.has(c.city))
                .indexOf(city);
              const minorIndex = allCityPositions
                .filter(
                  (c) =>
                    !MAJOR_CITIES.has(c.city) &&
                    c.city !== "Issyk-Kul" &&
                    c.city !== "Caffa" &&
                    c.city !== "Messine",
                )
                .indexOf(city);

              let staggerFrame: number;
              if (isMajor) {
                staggerFrame = majorIndex * 5;
              } else {
                // Minor cities start after all majors
                staggerFrame = majorCount * 5 + minorIndex * 2;
              }

              const appearProgress = interpolate(
                invasionLocalFrame,
                [staggerFrame, staggerFrame + 6],
                [0, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                },
              );

              return renderInfectionDot(
                city.x,
                city.y,
                `invasion-${city.city}`,
                appearProgress,
              );
            })}
        </g>

          {/* City labels -- inside camera group, fontSize inversed to keep constant visual size */}
          {showIssykKul && issykKulCity && (
            <text
              x={issykKulCity.x}
              y={issykKulCity.y - 20 / (camera.scale / 500)}
              fill={COLORS.textPrimary}
              fontSize={14 / (camera.scale / 500)}
              fontFamily="'Press Start 2P', monospace"
              textAnchor="middle"
              opacity={interpolate(
                globalFrame - HOOK_SCENE_STARTS[SCENE.ISSYK_KUL],
                [40, 55],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              )}
            >
              ISSYK-KUL
            </text>
          )}

          {showCaffa && caffaCity && (
            <text
              x={caffaCity.x}
              y={caffaCity.y - 20 / (camera.scale / 500)}
              fill={COLORS.textPrimary}
              fontSize={14 / (camera.scale / 500)}
              fontFamily="'Press Start 2P', monospace"
              textAnchor="middle"
              opacity={interpolate(
                globalFrame -
                  HOOK_SCENE_STARTS[SCENE.CATAPULTE] -
                  Math.floor(HOOK_SCENE_DURATIONS[SCENE.CATAPULTE] * 0.6),
                [0, 15],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              )}
            >
              CAFFA
            </text>
          )}

          {showMessine && messineCity && (
            <text
              x={messineCity.x}
              y={messineCity.y - 20 / (camera.scale / 500)}
              fill={COLORS.textPrimary}
              fontSize={14 / (camera.scale / 500)}
              fontFamily="'Press Start 2P', monospace"
              textAnchor="middle"
              opacity={1}
            >
              MESSINE
            </text>
          )}
      </svg>
    </div>
  );
};
