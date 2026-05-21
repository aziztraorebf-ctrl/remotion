import { AbsoluteFill, useCurrentFrame, useVideoConfig, delayRender, continueRender } from "remotion";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const STADIA_API_KEY = process.env.REMOTION_STADIA_API_KEY ?? "";

const TOTAL_FRAMES = 240;

type CameraKeyframe = { frame: number; lon: number; lat: number; zoom: number };

const KEYFRAMES: CameraKeyframe[] = [
  { frame: 0,   lon: -71, lat: 53.0, zoom: 3.0 },
  { frame: 120, lon: -71, lat: 53.0, zoom: 4.5 },
  { frame: 240, lon: -68, lat: 49.0, zoom: 5.5 },
];

const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const interpolateCamera = (frame: number): CameraKeyframe => {
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const a = KEYFRAMES[i];
    const b = KEYFRAMES[i + 1];
    if (frame >= a.frame && frame <= b.frame) {
      const t = (frame - a.frame) / (b.frame - a.frame);
      const e = easeInOut(t);
      return {
        frame,
        lon: a.lon + (b.lon - a.lon) * e,
        lat: a.lat + (b.lat - a.lat) * e,
        zoom: a.zoom + (b.zoom - a.zoom) * e,
      };
    }
  }
  return KEYFRAMES[KEYFRAMES.length - 1];
};

const watercolorTileUrl = STADIA_API_KEY
  ? `https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg?api_key=${STADIA_API_KEY}`
  : `https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg`;

const watercolorStyle: mapboxgl.StyleSpecification = {
  version: 8,
  sources: {
    "stadia-watercolor": {
      type: "raster",
      tiles: [watercolorTileUrl],
      tileSize: 256,
      attribution:
        '© Stadia Maps © Stamen Design © OpenStreetMap',
      maxzoom: 16,
    },
  },
  layers: [
    {
      id: "watercolor-bg",
      type: "background",
      paint: { "background-color": "#f5f1e8" },
    },
    {
      id: "watercolor",
      type: "raster",
      source: "stadia-watercolor",
    },
  ],
};

export const MapWatercolorTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Watercolor map render"));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const cam = interpolateCamera(0);

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: watercolorStyle,
      center: [cam.lon, cam.lat],
      zoom: cam.zoom,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });

    mapRef.current = map;

    const waitIdle = () => {
      if (map.areTilesLoaded() && map.isStyleLoaded()) {
        setReady(true);
        continueRender(handle);
      } else {
        map.once("idle", waitIdle);
      }
    };
    map.on("load", waitIdle);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [handle]);

  useEffect(() => {
    if (!mapRef.current || !ready) return;
    const cam = interpolateCamera(frame);
    mapRef.current.jumpTo({
      center: [cam.lon, cam.lat],
      zoom: cam.zoom,
    });
  }, [frame, ready]);

  if (!MAPBOX_TOKEN) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#222", color: "white", padding: 40, fontSize: 24 }}>
        REMOTION_MAPBOX_TOKEN env var manquante.
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#f5f1e8" }}>
      <div ref={containerRef} style={{ width, height, position: "absolute", top: 0, left: 0 }} />
    </AbsoluteFill>
  );
};

export { TOTAL_FRAMES as WATERCOLOR_TEST_FRAMES };
