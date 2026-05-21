import { AbsoluteFill, delayRender, continueRender, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { easeInOutExpo } from "./lib/easing";
import type { CameraKeyframe } from "./MapPlatV3";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

type Props = {
  lon: number;
  lat: number;
  keyframes: CameraKeyframe[];
  startFrame: number;
  color?: string;
  size?: number;
  label?: string;
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

export const GlowingPin: React.FC<Props> = ({
  lon,
  lat,
  keyframes,
  startFrame,
  color = "#FFD700",
  size = 20,
  label,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("GlowingPin"));
  const [, force] = useState(0);

  const local = Math.max(0, frame - startFrame);
  const popScale = spring({ frame: local, fps, config: { damping: 9, stiffness: 220, mass: 0.7 } });
  const pulse = 1 + 0.15 * Math.sin(local * 0.2);

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

  const showPin = frame >= startFrame && mapRef.current;
  const pixel = mapRef.current ? mapRef.current.project([lon, lat]) : { x: 0, y: 0 };

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div ref={containerRef} style={{ width, height, position: "absolute", top: 0, left: 0, visibility: "hidden" }} />
      {showPin && (
      <div
        style={{
          position: "absolute",
          left: pixel.x,
          top: pixel.y,
          transform: `translate(-50%, -50%) scale(${popScale})`,
        }}
      >
        <div
          style={{
            width: size * pulse,
            height: size * pulse,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 ${size * 1.5}px ${color}, 0 0 ${size * 3}px ${color}aa`,
            border: "2px solid #FFFFFF",
            transform: "translate(-50%, -50%)",
            position: "absolute",
            left: 0, top: 0,
          }}
        />
        {label && (
          <div
            style={{
              position: "absolute",
              left: size + 8,
              top: -10,
              padding: "4px 10px",
              background: "#FFFFFF",
              color: "#1a1a1a",
              fontFamily: "Montserrat, Helvetica Neue, Arial, sans-serif",
              fontWeight: 800,
              fontSize: 16,
              borderRadius: 4,
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            {label}
          </div>
        )}
      </div>
      )}
    </AbsoluteFill>
  );
};
