import { AbsoluteFill, useCurrentFrame, useVideoConfig, delayRender, continueRender } from "remotion";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export type CameraKeyframe = {
  frame: number;
  lon: number;
  lat: number;
  zoom: number;
};

type Props = {
  keyframes: CameraKeyframe[];
  startFrame?: number;
  backgroundColor?: string;
};

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

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
      const e = easeInOut(t);
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

const stripLabelsAndBorders = (map: mapboxgl.Map) => {
  const style = map.getStyle();
  if (!style?.layers) return;
  for (const layer of style.layers) {
    const id = layer.id.toLowerCase();
    const isLabel =
      layer.type === "symbol" ||
      id.includes("label") ||
      id.includes("place") ||
      id.includes("poi");
    const isBorder =
      id.includes("admin") || id.includes("boundary") || id.includes("border");
    const isRoad =
      id.includes("road") ||
      id.includes("highway") ||
      id.includes("street") ||
      id.includes("tunnel") ||
      id.includes("bridge") ||
      id.includes("path") ||
      id.includes("trail");
    if (isLabel || isBorder || isRoad) {
      try {
        map.removeLayer(layer.id);
      } catch {}
    }
  }
};

export const MapPlatV3: React.FC<Props> = ({
  keyframes,
  startFrame = 0,
  backgroundColor = "#a8d4e8",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("MapPlatV3 render"));
  const [ready, setReady] = useState(false);

  const localFrame = Math.max(0, frame - startFrame);

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
      style: "mapbox://styles/mapbox/outdoors-v12",
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

    map.on("load", () => {
      stripLabelsAndBorders(map);
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
  }, [handle, keyframes]);

  useEffect(() => {
    if (!mapRef.current || !ready) return;
    const cam = interpolateCamera(localFrame, keyframes);
    mapRef.current.jumpTo({
      center: [cam.lon, cam.lat],
      zoom: cam.zoom,
    });
  }, [localFrame, ready, keyframes]);

  if (!MAPBOX_TOKEN) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#222", color: "white", padding: 40, fontSize: 24 }}>
        REMOTION_MAPBOX_TOKEN env var manquante.
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <div
        ref={containerRef}
        style={{ width, height, position: "absolute", top: 0, left: 0 }}
      />
    </AbsoluteFill>
  );
};
