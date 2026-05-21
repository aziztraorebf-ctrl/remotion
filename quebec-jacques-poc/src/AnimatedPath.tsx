import { AbsoluteFill, delayRender, continueRender, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { easeInOutExpo } from "./lib/easing";
import { greatCircleRoute } from "./lib/geo-utils";
import type { CameraKeyframe } from "./MapPlatV3";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

type Props = {
  // Two anchor points: from and to (lon, lat)
  from: [number, number];
  to: [number, number];
  // If true (default), use great-circle (geodesic) route - geographically accurate.
  // If false, fallback to Bezier curve (legacy mode).
  useGreatCircle?: boolean;
  // Bezier curve control point offset (perpendicular to line, in lat/lng units) - legacy only
  curveOffset?: number;
  // Number of points to sample on great circle (more = smoother, slower)
  greatCirclePoints?: number;
  keyframes: CameraKeyframe[];
  startFrame: number;
  drawDurationFrames?: number;
  color?: string;
  strokeWidth?: number;
  dashed?: boolean;
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

export const AnimatedPath: React.FC<Props> = ({
  from,
  to,
  useGreatCircle = true,
  curveOffset = 5,
  greatCirclePoints = 80,
  keyframes,
  startFrame,
  drawDurationFrames = 90,
  color = "#FFA500",
  strokeWidth = 4,
  dashed = false,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("AnimatedPath"));
  const [, force] = useState(0);

  const local = Math.max(0, frame - startFrame);
  const drawProgress = interpolate(local, [0, drawDurationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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

  let pathD = "";
  if (mapRef.current && frame >= startFrame) {
    const project = (lng: number, lat: number) => mapRef.current!.project([lng, lat]);

    if (useGreatCircle) {
      // Geodesic route via Turf - geographically accurate
      const route = greatCircleRoute(from, to, greatCirclePoints);
      const coords = route.geometry.coordinates;
      const pts = coords.map(([lng, lat]) => project(lng, lat));
      pathD = pts
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)},${p.y.toFixed(1)}`)
        .join(" ");
    } else {
      // Legacy Bezier mode (fallback)
      const p1 = project(from[0], from[1]);
      const p2 = project(to[0], to[1]);
      const midLng = (from[0] + to[0]) / 2;
      const midLat = (from[1] + to[1]) / 2 + curveOffset;
      const ctrl = project(midLng, midLat);
      pathD = `M ${p1.x.toFixed(1)},${p1.y.toFixed(1)} Q ${ctrl.x.toFixed(1)},${ctrl.y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div ref={containerRef} style={{ width, height, position: "absolute", top: 0, left: 0, visibility: "hidden" }} />
      {pathD && (
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <filter id="path-glow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={dashed ? "12 8" : "5000"}
          strokeDashoffset={dashed ? 0 : 5000 * (1 - drawProgress)}
          filter="url(#path-glow)"
        />
      </svg>
      )}
    </AbsoluteFill>
  );
};
