import { AbsoluteFill, continueRender, delayRender, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { QuebecFlagSilhouette } from "../QuebecFlagSilhouette";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

type Cam = { frame: number; lon: number; lat: number; zoom: number; pitch: number; bearing: number };

// Scene 1 : 0 → 8.539s = ~256 frames. Slow zoom-out on Quebec from a tilted view.
const KEYFRAMES: Cam[] = [
  { frame: 0,   lon: -71, lat: 52, zoom: 4.5, pitch: 35, bearing: -10 },
  { frame: 130, lon: -73, lat: 55, zoom: 3.5, pitch: 20, bearing: -5 },
  { frame: 256, lon: -75, lat: 58, zoom: 2.6, pitch: 0,  bearing: 0 },
];

const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const interpolateCamera = (frame: number): Cam => {
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

const W = 1280, H = 720;

export const Scene001IntroV2: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Mapbox GL Scene 1"));
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
      style: "mapbox://styles/mapbox/outdoors-v12",
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
      const layers = map.getStyle()?.layers ?? [];
      for (const layer of layers) {
        if (layer.type === "symbol") {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      }
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.4 });

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
    const cam = interpolateCamera(localFrame);
    mapRef.current.jumpTo({
      center: [cam.lon, cam.lat],
      zoom: cam.zoom,
      pitch: cam.pitch,
      bearing: cam.bearing,
    });
  }, [localFrame, ready]);

  const cam = interpolateCamera(localFrame);

  // Hook text overlay (the question "Vous connaissez le Québec?")
  const hookOpacity = interpolate(localFrame, [10, 30, 90, 110], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // QUIZ pop near the end
  const quizScale = spring({ frame: localFrame - 180, fps, config: { damping: 7, stiffness: 220, mass: 0.6 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#a8d8e8" }}>
      <div ref={containerRef} style={{ width: W, height: H, position: "absolute", top: 0, left: 0 }} />

      {/* Quebec silhouette */}
      <QuebecFlagSilhouette
        mapLon={cam.lon}
        mapLat={cam.lat}
        mapZoom={cam.zoom}
        mapW={W}
        mapH={H}
      />

      {/* Hook text */}
      <div style={{
        position: "absolute", left: "50%", top: 80,
        transform: `translateX(-50%) scale(${0.9 + hookOpacity * 0.1})`,
        opacity: hookOpacity,
        fontFamily: "Helvetica Neue, Arial Black, sans-serif",
        fontWeight: 900,
        fontSize: 52,
        color: "white",
        textShadow: "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
        whiteSpace: "nowrap",
      }}>
        Vous connaissez le Québec ?
      </div>

      {/* QUIZ! pop */}
      {localFrame >= 180 && (
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: `translate(-50%, -50%) scale(${quizScale}) rotate(-8deg)`,
          fontFamily: "Helvetica Neue, Arial Black, sans-serif",
          fontWeight: 900,
          fontSize: 140,
          color: "#FFD800",
          textShadow: "5px 5px 0 #cc0000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 0 30px rgba(0,0,0,0.7)",
          letterSpacing: "0.05em",
        }}>
          QUIZ !
        </div>
      )}
    </AbsoluteFill>
  );
};
