import { AbsoluteFill, useCurrentFrame, useVideoConfig, delayRender, continueRender } from "remotion";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const TOTAL_FRAMES = 300;

type CameraKeyframe = { frame: number; lon: number; lat: number; zoom: number; pitch: number; bearing: number };

const KEYFRAMES: CameraKeyframe[] = [
  { frame: 0,   lon: -71, lat: 53.0, zoom: 2.5,  pitch: 0,  bearing: 0 },
  { frame: 90,  lon: -71, lat: 53.0, zoom: 4.5,  pitch: 30, bearing: 0 },
  { frame: 180, lon: -70, lat: 48.5, zoom: 6.5,  pitch: 60, bearing: -25 },
  { frame: 300, lon: -67, lat: 49.0, zoom: 7.5,  pitch: 70, bearing: -45 },
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
        pitch: a.pitch + (b.pitch - a.pitch) * e,
        bearing: a.bearing + (b.bearing - a.bearing) * e,
      };
    }
  }
  return KEYFRAMES[KEYFRAMES.length - 1];
};

export const QuebecCinematic: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Mapbox GL JS render"));
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
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [cam.lon, cam.lat],
      zoom: cam.zoom,
      pitch: cam.pitch,
      bearing: cam.bearing,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });

    mapRef.current = map;

    map.on("load", () => {
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.8 });

      map.addLayer({
        id: "sky",
        type: "sky",
        paint: {
          "sky-type": "atmosphere",
          "sky-atmosphere-sun": [0.0, 90.0],
          "sky-atmosphere-sun-intensity": 15,
        },
      });

      const waitIdle = () => {
        if (map.areTilesLoaded() && map.isStyleLoaded()) {
          setReady(true);
          continueRender(handle);
        } else {
          map.once("idle", waitIdle);
        }
      };
      waitIdle();
    });

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
      pitch: cam.pitch,
      bearing: cam.bearing,
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
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div ref={containerRef} style={{ width, height, position: "absolute", top: 0, left: 0 }} />
    </AbsoluteFill>
  );
};
