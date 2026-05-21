import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { easeInOutExpo } from "./lib/easing";
import type { CameraKeyframe } from "./MapPlatV3";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

type Props = {
  geojsonPath: string;
  keyframes: CameraKeyframe[];
  startFrame?: number;
  fadeInFrames?: number;
  fillColor?: string;
  fillOpacity?: number;
  fillBlendMode?: "overlay" | "soft-light" | "screen" | "multiply" | "normal";
  glowColor?: string;
  borderColor?: string;
  pulse?: boolean;
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

const transparentStyle: mapboxgl.StyleSpecification = {
  version: 8,
  sources: {},
  layers: [],
};

export const GlowingRegionOverlay: React.FC<Props> = ({
  geojsonPath,
  keyframes,
  startFrame = 0,
  fadeInFrames = 15,
  fillColor = "#FFFFFF",
  fillOpacity = 0.15,
  fillBlendMode = "overlay",
  glowColor = "#FFFFFF",
  borderColor = "#FFFFFF",
  pulse = false,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("GlowingRegionOverlay render"));
  const [ready, setReady] = useState(false);

  const localFrame = Math.max(0, frame - startFrame);
  const fadeOpacity = interpolate(
    localFrame,
    [0, fadeInFrames],
    [0, 1],
    { extrapolateRight: "clamp" }
  );
  const pulseMul = pulse ? 0.7 + 0.3 * Math.sin(localFrame * 0.15) : 1;

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
      style: transparentStyle,
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

        map.addSource("region", { type: "geojson", data: geojson });

        // Fill layer (interior color, optional)
        map.addLayer({
          id: "region-fill",
          type: "fill",
          source: "region",
          paint: {
            "fill-color": fillColor,
            "fill-opacity": fillOpacity,
          },
        });

        // Glow layers (3 stacked line layers, decreasing opacity, increasing blur+width)
        // Outer glow (largest, blurriest, most transparent)
        map.addLayer({
          id: "region-glow-outer",
          type: "line",
          source: "region",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": glowColor,
            "line-width": 18,
            "line-blur": 12,
            "line-opacity": 0.35,
          },
        });

        // Mid glow
        map.addLayer({
          id: "region-glow-mid",
          type: "line",
          source: "region",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": glowColor,
            "line-width": 8,
            "line-blur": 4,
            "line-opacity": 0.6,
          },
        });

        // Inner soft glow
        map.addLayer({
          id: "region-glow-inner",
          type: "line",
          source: "region",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": glowColor,
            "line-width": 3,
            "line-blur": 1,
            "line-opacity": 0.8,
          },
        });

        // Sharp border line on top
        map.addLayer({
          id: "region-border",
          type: "line",
          source: "region",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": borderColor,
            "line-width": 1.5,
            "line-opacity": 1,
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
      } catch (e) {
        console.error("GlowingRegionOverlay load error:", e);
        continueRender(handle);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [handle, geojsonPath, keyframes, fillColor, fillOpacity, glowColor, borderColor]);

  useEffect(() => {
    if (!mapRef.current || !ready) return;
    const cam = interpolateCamera(localFrame, keyframes);
    mapRef.current.jumpTo({
      center: [cam.lon, cam.lat],
      zoom: cam.zoom,
    });

    // Apply fade-in + pulse to glow layers
    const effectiveOpacity = fadeOpacity * pulseMul;
    try {
      mapRef.current.setPaintProperty("region-glow-outer", "line-opacity", 0.35 * effectiveOpacity);
      mapRef.current.setPaintProperty("region-glow-mid", "line-opacity", 0.6 * effectiveOpacity);
      mapRef.current.setPaintProperty("region-glow-inner", "line-opacity", 0.8 * effectiveOpacity);
      mapRef.current.setPaintProperty("region-border", "line-opacity", fadeOpacity);
      mapRef.current.setPaintProperty("region-fill", "fill-opacity", fillOpacity * fadeOpacity);
    } catch {}
  }, [localFrame, ready, keyframes, fadeOpacity, pulseMul, fillOpacity]);

  if (!MAPBOX_TOKEN) {
    return null;
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: fillBlendMode === "normal" ? undefined : fillBlendMode }}>
      <div
        ref={containerRef}
        style={{
          width,
          height,
          position: "absolute",
          top: 0,
          left: 0,
          background: "transparent",
        }}
      />
    </AbsoluteFill>
  );
};
