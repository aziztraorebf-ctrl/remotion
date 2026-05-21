import { AbsoluteFill, useCurrentFrame, useVideoConfig, delayRender, continueRender, interpolate, Easing } from "remotion";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import parcheminReliefStyle from "../mapbox-styles/atlas-parchemin-mande-relief.json";
import maliPolygonData from "./mali-polygon.json";
import maliEmpire1300Data from "./mali-empire-1300-polygon.json";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const MALI_MODERN_POLYGON = maliPolygonData as [number, number][];
const MALI_EMPIRE_1300 = maliEmpire1300Data as [number, number][];

const FPS = 30;
const DURATION_FRAMES = 6 * FPS;

type CameraKeyframe = { frame: number; lon: number; lat: number; zoom: number; pitch: number; bearing: number };

// Camera : zoom out pour voir Empire qui deborde sur Atlantique/Senegal/Sahara
const KEYFRAMES: CameraKeyframe[] = [
  { frame: 0,                lon: -7, lat: 15, zoom: 2.8, pitch: 25, bearing: 0 },
  { frame: DURATION_FRAMES,  lon: -7, lat: 15, zoom: 3.0, pitch: 30, bearing: 5 },
];

const interpKey = (frame: number, axis: keyof Omit<CameraKeyframe, "frame">): number => {
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const a = KEYFRAMES[i];
    const b = KEYFRAMES[i + 1];
    if (frame >= a.frame && frame <= b.frame) {
      return interpolate(frame, [a.frame, b.frame], [a[axis], b[axis]], {
        easing: Easing.inOut(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
  }
  return KEYFRAMES[KEYFRAMES.length - 1][axis];
};

export const AtlasEmpireHaloTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Empire halo test render"));
  const [ready, setReady] = useState(false);
  const [maliModernPx, setMaliModernPx] = useState<string>("");
  const [maliEmpirePx, setMaliEmpirePx] = useState<string>("");

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      return;
    }
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: parcheminReliefStyle as mapboxgl.StyleSpecification,
      projection: { name: "globe" },
      center: [KEYFRAMES[0].lon, KEYFRAMES[0].lat],
      zoom: KEYFRAMES[0].zoom,
      pitch: KEYFRAMES[0].pitch,
      bearing: KEYFRAMES[0].bearing,
      interactive: false,
      attributionControl: false,
    });
    mapRef.current = map;
    map.on("load", () => {
      setReady(true);
      continueRender(handle);
    });
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [handle]);

  useEffect(() => {
    if (!mapRef.current || !ready) return;
    const lon = interpKey(frame, "lon");
    const lat = interpKey(frame, "lat");
    const zoom = interpKey(frame, "zoom");
    const pitch = interpKey(frame, "pitch");
    const bearing = interpKey(frame, "bearing");
    mapRef.current.jumpTo({ center: [lon, lat], zoom, pitch, bearing });

    const projectPoly = (poly: [number, number][]) =>
      poly
        .map(([lo, la]) => {
          const p = mapRef.current!.project([lo, la]);
          return `${p.x},${p.y}`;
        })
        .join(" ");

    setMaliModernPx(projectPoly(MALI_MODERN_POLYGON));
    setMaliEmpirePx(projectPoly(MALI_EMPIRE_1300));
  }, [frame, ready]);

  // Empire fade in 0.3s -> 1.5s
  const empireOpacity = interpolate(
    frame,
    [0.3 * FPS, 1.5 * FPS, 5 * FPS, 6 * FPS],
    [0, 1, 1, 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Mali moderne fade in 1.5s -> 2.5s (apparait APRES l'empire pour montrer "voila aujourd'hui")
  const maliModernOpacity = interpolate(
    frame,
    [1.8 * FPS, 2.5 * FPS, 5 * FPS, 6 * FPS],
    [0, 1, 1, 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Mention text 2.5s - 5.5s
  const mentionOpacity = interpolate(
    frame,
    [2.5 * FPS, 3 * FPS, 5 * FPS, 5.5 * FPS],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#1F2A4A" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />

      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="empireGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Empire Mali 1300 (Historical Basemaps) - dessous */}
        {maliEmpirePx && (
          <g opacity={empireOpacity}>
            <polygon points={maliEmpirePx} fill="#D4A574" fillOpacity={0.30} />
            <polyline
              points={maliEmpirePx}
              fill="none"
              stroke="#D4A574"
              strokeWidth="3"
              strokeOpacity="0.85"
              strokeDasharray="12 6"
              filter="url(#empireGlow)"
            />
          </g>
        )}

        {/* Mali moderne Natural Earth - dessus */}
        {maliModernPx && (
          <g opacity={maliModernOpacity}>
            <polygon points={maliModernPx} fill="#1F2A4A" fillOpacity={0.55} />
            <polyline
              points={maliModernPx}
              fill="none"
              stroke="#D4A574"
              strokeWidth="4"
              strokeOpacity="0.95"
              filter="url(#glow)"
            />
          </g>
        )}
      </svg>

      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: mentionOpacity,
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 400,
          fontSize: 24,
          color: "#F2E5C8",
          letterSpacing: 1.0,
          textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          pointerEvents: "none",
          padding: "0 60px",
          lineHeight: 1.4,
        }}
      >
        Empire du Mali XIVe siecle (Historical Basemaps, 1300)
        <br />
        Bordure pointillee = limite historique. Pleine = Mali moderne.
      </div>
    </AbsoluteFill>
  );
};
