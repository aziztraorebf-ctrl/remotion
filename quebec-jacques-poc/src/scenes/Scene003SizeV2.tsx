import { AbsoluteFill, continueRender, delayRender, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { QuebecFlagSilhouette } from "../QuebecFlagSilhouette";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

type Cam = { frame: number; lon: number; lat: number; zoom: number; pitch: number; bearing: number };

// Local frame keyframes (relative to scene start)
// Scene 3 lasts ~750 frames (25s @ 30fps)
const KEYFRAMES: Cam[] = [
  { frame: 0,   lon: -75, lat: 58, zoom: 2.8, pitch: 0,  bearing: 0 },
  { frame: 90,  lon: -73, lat: 55, zoom: 3.4, pitch: 15, bearing: 0 },
  { frame: 240, lon: -71, lat: 52, zoom: 3.8, pitch: 25, bearing: -5 },
  { frame: 420, lon: -73, lat: 47, zoom: 4.5, pitch: 35, bearing: -15 },
  { frame: 600, lon: -73, lat: 49, zoom: 4.0, pitch: 25, bearing: -10 },
  { frame: 750, lon: -71, lat: 53, zoom: 3.5, pitch: 15, bearing: 0 },
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

// Force-alignment-based text triggers (local frame within scene)
// scene-003 starts at 9.779s globally, so subtract 9.779*30=293
const localTime = (globalSec: number) => Math.round((globalSec - 9.779) * 30);

interface TextOverlay {
  triggerFrame: number;
  exitFrame: number;
  text: string;
  position: "center-overlay" | "top-banner";
  fontSize: number;
}

const TEXT_OVERLAYS: TextOverlay[] = [
  { triggerFrame: localTime(11.5),  exitFrame: localTime(15.0),  text: "1 668 000 KM²",         position: "center-overlay", fontSize: 64 },
  { triggerFrame: localTime(15.5),  exitFrame: localTime(18.0),  text: "= 3× la France",       position: "center-overlay", fontSize: 56 },
  { triggerFrame: localTime(18.0),  exitFrame: localTime(21.5),  text: "+ Allemagne + Iran + Libye", position: "top-banner", fontSize: 38 },
  { triggerFrame: localTime(22.0),  exitFrame: localTime(25.0),  text: "2 000 KM",             position: "center-overlay", fontSize: 64 },
  { triggerFrame: localTime(26.5),  exitFrame: localTime(29.0),  text: "Montréal",             position: "top-banner", fontSize: 44 },
  { triggerFrame: localTime(29.5),  exitFrame: localTime(32.5),  text: "Nunavik · −40°C",      position: "top-banner", fontSize: 44 },
];

const W = 1280, H = 720;

export const Scene003SizeV2: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Mapbox GL Scene 3"));
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
      // Hide ALL text labels (city names, country names, road labels, etc)
      const layers = map.getStyle()?.layers ?? [];
      for (const layer of layers) {
        if (layer.type === "symbol") {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      }

      // Add terrain DEM for relief
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

  return (
    <AbsoluteFill style={{ backgroundColor: "#a8d8e8" }}>
      <div ref={containerRef} style={{ width: W, height: H, position: "absolute", top: 0, left: 0 }} />

      {/* Quebec silhouette projected on map */}
      <QuebecFlagSilhouette
        mapLon={cam.lon}
        mapLat={cam.lat}
        mapZoom={cam.zoom}
        mapW={W}
        mapH={H}
      />

      {/* Chapter indicator */}
      <div style={{
        position: "absolute", top: 18, left: 18,
        backgroundColor: "#cc0000",
        color: "white",
        fontFamily: "Helvetica Neue, Arial Black, sans-serif",
        fontWeight: 900,
        fontSize: 38,
        padding: "2px 14px",
        border: "3px solid white",
        boxShadow: "3px 3px 0 rgba(0,0,0,0.5)",
        transform: "rotate(-3deg)",
      }}>
        1
      </div>

      {/* Animated text overlays */}
      {TEXT_OVERLAYS.map((overlay, i) => {
        const visible = localFrame >= overlay.triggerFrame && localFrame <= overlay.exitFrame;
        if (!visible) return null;

        const age = localFrame - overlay.triggerFrame;
        const scaleSpring = spring({ frame: age, fps, config: { damping: 9, stiffness: 280, mass: 0.6 } });

        const isCenter = overlay.position === "center-overlay";

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: isCenter ? "50%" : 80,
              transform: `translate(-50%, ${isCenter ? "-50%" : "0"}) scale(${scaleSpring}) rotate(${isCenter ? -2 : 0}deg)`,
              fontFamily: "Helvetica Neue, Arial Black, sans-serif",
              fontWeight: 900,
              fontSize: overlay.fontSize,
              color: "white",
              textShadow: "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 0 18px rgba(0,0,0,0.7)",
              whiteSpace: "nowrap",
              letterSpacing: "-0.01em",
              pointerEvents: "none",
            }}
          >
            {overlay.text}
          </div>
        );
      })}

      {!MAPBOX_TOKEN && (
        <div style={{ position: "absolute", inset: 0, color: "white", padding: 40, fontSize: 24, backgroundColor: "#222" }}>
          REMOTION_MAPBOX_TOKEN missing
        </div>
      )}
    </AbsoluteFill>
  );
};
