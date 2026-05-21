import { AbsoluteFill, delayRender, continueRender, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { easeInOutExpo } from "./lib/easing";
import { greatCircleRoute, caravanePositions } from "./lib/geo-utils";
import type { CameraKeyframe } from "./MapPlatV3";
import type { Feature, LineString } from "geojson";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

type Props = {
  // Either provide from/to (great-circle generated) OR provide a pre-built route
  from?: [number, number];
  to?: [number, number];
  route?: Feature<LineString>;
  // Animation
  keyframes: CameraKeyframe[];
  startFrame: number;
  travelDurationFrames?: number;
  // Caravan
  count?: number;
  spacingKm?: number;
  dotRadius?: number;
  dotColor?: string;
  dotGlow?: boolean;
  leaderRadius?: number;
  leaderColor?: string;
};

const interpolateCamera = (frame: number, kfs: CameraKeyframe[]): CameraKeyframe => {
  if (frame <= kfs[0].frame) return kfs[0];
  for (let i = 0; i < kfs.length - 1; i++) {
    const a = kfs[i], b = kfs[i + 1];
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
  return kfs[kfs.length - 1];
};

export const AnimatedCaravan: React.FC<Props> = ({
  from,
  to,
  route: providedRoute,
  keyframes,
  startFrame,
  travelDurationFrames = 180,
  count = 25,
  spacingKm = 150,
  dotRadius = 5,
  dotColor = "#FFD700",
  dotGlow = true,
  leaderRadius = 8,
  leaderColor = "#FFFFFF",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("AnimatedCaravan"));
  const [, force] = useState(0);

  const local = Math.max(0, frame - startFrame);
  const progress = interpolate(local, [0, travelDurationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Build route once (memoized)
  const route = useMemo<Feature<LineString>>(() => {
    if (providedRoute) return providedRoute;
    if (from && to) return greatCircleRoute(from, to, 100);
    throw new Error("AnimatedCaravan requires either route OR (from + to)");
  }, [providedRoute, from, to]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) { continueRender(handle); return; }
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const cam = interpolateCamera(0, keyframes);
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: { version: 8, sources: {}, layers: [] },
      center: [cam.lon, cam.lat],
      zoom: cam.zoom,
      pitch: 0, bearing: 0,
      projection: { name: "mercator" },
      interactive: false, attributionControl: false,
      preserveDrawingBuffer: true, fadeDuration: 0,
    });
    mapRef.current = map;
    map.on("load", () => continueRender(handle));
    return () => { map.remove(); mapRef.current = null; };
  }, [handle, keyframes]);

  useEffect(() => {
    if (!mapRef.current) return;
    const cam = interpolateCamera(local, keyframes);
    mapRef.current.jumpTo({ center: [cam.lon, cam.lat], zoom: cam.zoom });
    force((n) => n + 1);
  }, [local, keyframes]);

  if (!MAPBOX_TOKEN) return null;

  // Compute caravan positions and project to pixels
  const showCaravan = mapRef.current && frame >= startFrame;
  let pixels: Array<{ x: number; y: number }> = [];
  if (showCaravan) {
    const positions = caravanePositions(route, progress, count, spacingKm);
    pixels = positions.map(([lng, lat]) => mapRef.current!.project([lng, lat]));
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div ref={containerRef} style={{ width, height, position: "absolute", top: 0, left: 0, visibility: "hidden" }} />
      {showCaravan && (
        <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
          {dotGlow && (
            <defs>
              <filter id="caravan-glow">
                <feGaussianBlur stdDeviation="2" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          )}
          {pixels.map((p, i) => {
            const isLeader = i === 0;
            const radius = isLeader ? leaderRadius : dotRadius;
            const color = isLeader ? leaderColor : dotColor;
            // Fade tail dots based on position (leader = full opacity, tail = lighter)
            const opacity = isLeader ? 1 : Math.max(0.4, 1 - (i / count) * 0.6);
            return (
              <circle
                key={i}
                cx={p.x.toFixed(1)}
                cy={p.y.toFixed(1)}
                r={radius}
                fill={color}
                opacity={opacity}
                filter={dotGlow ? "url(#caravan-glow)" : undefined}
                stroke={isLeader ? "#FFFFFF" : undefined}
                strokeWidth={isLeader ? 2 : 0}
              />
            );
          })}
        </svg>
      )}
    </AbsoluteFill>
  );
};
