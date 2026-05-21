import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { easeInOutExpo } from "./lib/easing";
import type { CameraKeyframe } from "./MapPlatV3";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export type FlagColors = string[];
export type FlagOrientation = "vertical" | "horizontal";

type Props = {
  geojsonPath: string;
  keyframes: CameraKeyframe[];
  startFrame?: number;
  fadeInFrames?: number;
  flagColors: FlagColors;
  flagOrientation?: FlagOrientation;
  opacity?: number;
  // If provided, each band fades in sequentially at the given local frame offsets.
  // Length must match flagColors.length. Each band fades in over bandFadeFrames.
  bandStartFrames?: number[];
  bandFadeFrames?: number;
};

const interpolateCamera = (
  frame: number,
  keyframes: CameraKeyframe[]
): CameraKeyframe => {
  if (frame <= keyframes[0].frame) return keyframes[0];
  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (frame >= a.frame && frame <= b.frame) {
      const t = (frame - a.frame) / (b.frame - a.frame);
      const e = easeInOutExpo(t);
      return {
        frame,
        lon: a.lon + (b.lon - a.lon) * e,
        lat: a.lat + (b.lat - a.lat) * e,
        zoom: a.zoom + (b.zoom - a.zoom) * e,
      };
    }
  }
  return keyframes[keyframes.length - 1];
};

// Convert lat/lng polygon ring to SVG path "M x,y L x,y ... Z"
const ringToSvgPath = (
  ring: [number, number][],
  project: (lng: number, lat: number) => { x: number; y: number }
): string => {
  if (ring.length === 0) return "";
  let d = "";
  ring.forEach((pt, i) => {
    const { x, y } = project(pt[0], pt[1]);
    d += (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1) + " ";
  });
  d += "Z";
  return d;
};

const geometryToSvgPath = (
  geometry: any,
  project: (lng: number, lat: number) => { x: number; y: number }
): string => {
  if (!geometry) return "";
  if (geometry.type === "Polygon") {
    return geometry.coordinates.map((ring: [number, number][]) => ringToSvgPath(ring, project)).join(" ");
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates
      .flat()
      .map((ring: [number, number][]) => ringToSvgPath(ring, project))
      .join(" ");
  }
  return "";
};

export const FlagPatternOverlay: React.FC<Props> = ({
  geojsonPath,
  keyframes,
  startFrame = 0,
  fadeInFrames = 20,
  flagColors,
  flagOrientation = "vertical",
  opacity = 0.7,
  bandStartFrames,
  bandFadeFrames = 12,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("FlagPatternOverlay render"));
  const [geometry, setGeometry] = useState<any>(null);
  const [, forceUpdate] = useState(0);

  const localFrame = Math.max(0, frame - startFrame);
  const globalFadeOpacity = interpolate(
    localFrame,
    [0, fadeInFrames],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  const bandOpacities = flagColors.map((_, i) => {
    if (!bandStartFrames || bandStartFrames.length !== flagColors.length) {
      return 1;
    }
    const s = bandStartFrames[i];
    return interpolate(
      localFrame,
      [s, s + bandFadeFrames],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const cam = interpolateCamera(0, keyframes);

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: { version: 8, sources: {}, layers: [] },
      center: [cam.lon, cam.lat],
      zoom: cam.zoom,
      pitch: 0,
      bearing: 0,
      projection: { name: "mercator" },
      renderWorldCopies: true,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });

    mapRef.current = map;

    map.on("load", async () => {
      try {
        const res = await fetch(geojsonPath);
        const geojson = await res.json();
        const feature = geojson.type === "FeatureCollection" ? geojson.features[0] : geojson;
        setGeometry(feature.geometry);
        continueRender(handle);
      } catch (e) {
        console.error("FlagPatternOverlay geojson load error:", e);
        continueRender(handle);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [handle, geojsonPath, keyframes]);

  useEffect(() => {
    if (!mapRef.current) return;
    const cam = interpolateCamera(localFrame, keyframes);
    mapRef.current.jumpTo({ center: [cam.lon, cam.lat], zoom: cam.zoom });
    forceUpdate((n) => n + 1);
  }, [localFrame, keyframes]);

  if (!MAPBOX_TOKEN) return null;

  const project = (lng: number, lat: number) => {
    if (!mapRef.current) return { x: 0, y: 0 };
    return mapRef.current.project([lng, lat]);
  };

  const svgPath = geometry ? geometryToSvgPath(geometry, project) : "";
  const patternId = `flag-pattern-${flagColors.join("-").replace(/#/g, "")}`;
  const bandSize = 100; // px in pattern units
  const patternWidth = flagOrientation === "vertical" ? bandSize * flagColors.length : bandSize;
  const patternHeight = flagOrientation === "horizontal" ? bandSize * flagColors.length : bandSize;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Hidden Mapbox container - only used for project() coordinate conversion */}
      <div
        ref={containerRef}
        style={{ width, height, position: "absolute", top: 0, left: 0, visibility: "hidden" }}
      />
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0, opacity: globalFadeOpacity * opacity }}
      >
        <defs>
          <pattern
            id={patternId}
            x={0}
            y={0}
            width={patternWidth}
            height={patternHeight}
            patternUnits="userSpaceOnUse"
          >
            {flagColors.map((color, i) => {
              const bandOp = bandOpacities[i];
              if (flagOrientation === "vertical") {
                return (
                  <rect
                    key={i}
                    x={i * bandSize}
                    y={0}
                    width={bandSize}
                    height={patternHeight}
                    fill={color}
                    fillOpacity={bandOp}
                  />
                );
              }
              return (
                <rect
                  key={i}
                  x={0}
                  y={i * bandSize}
                  width={patternWidth}
                  height={bandSize}
                  fill={color}
                  fillOpacity={bandOp}
                />
              );
            })}
          </pattern>
        </defs>
        {svgPath && (
          <path d={svgPath} fill={`url(#${patternId})`} stroke="#FFFFFF" strokeWidth={1.5} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
