import { AbsoluteFill, continueRender, delayRender, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { QuebecFlagSilhouette } from "../QuebecFlagSilhouette";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

type Cam = { frame: number; lon: number; lat: number; zoom: number; pitch: number; bearing: number };

// Scene 4 : 34.639 → 38.639s = ~120 frames. Cinematic fly-to over the St Lawrence river
const KEYFRAMES: Cam[] = [
  { frame: 0,   lon: -71, lat: 50, zoom: 4.0, pitch: 30, bearing: 0   },
  { frame: 60,  lon: -69, lat: 48, zoom: 5.5, pitch: 55, bearing: -25 },
  { frame: 120, lon: -67, lat: 49, zoom: 6.0, pitch: 65, bearing: -40 },
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

export const Scene004RiverV2: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Mapbox GL Scene 4"));
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
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.8 });

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

  const titleScale = spring({ frame: localFrame, fps, config: { damping: 9, stiffness: 250 } });
  const subtitleOpacity = interpolate(localFrame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#001a4d" }}>
      <div ref={containerRef} style={{ width: W, height: H, position: "absolute", top: 0, left: 0 }} />

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
        2
      </div>

      {/* Title */}
      <div style={{
        position: "absolute", top: 80, left: "50%",
        transform: `translateX(-50%) scale(${titleScale})`,
        fontFamily: "Helvetica Neue, Arial Black, sans-serif",
        fontWeight: 900,
        fontSize: 48,
        color: "white",
        textShadow: "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
        whiteSpace: "nowrap",
      }}>
        Le Fleuve Saint-Laurent
      </div>

      {/* Subtitle */}
      <div style={{
        position: "absolute", bottom: 60, left: "50%",
        transform: "translateX(-50%)",
        opacity: subtitleOpacity,
        fontFamily: "Helvetica Neue, Arial, sans-serif",
        fontWeight: 700,
        fontSize: 32,
        fontStyle: "italic",
        color: "white",
        textShadow: "2px 2px 0 #000, 0 0 18px rgba(0,0,0,0.8)",
      }}>
        « La colonne vertébrale du Québec »
      </div>
    </AbsoluteFill>
  );
};
