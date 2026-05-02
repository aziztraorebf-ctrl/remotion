import { AbsoluteFill, useCurrentFrame, useVideoConfig, delayRender, continueRender, interpolate, Easing, spring } from "remotion";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const TOMBOUCTOU_LON = -3.0026;
const TOMBOUCTOU_LAT = 16.7666;

type CameraKeyframe = { frame: number; lon: number; lat: number; zoom: number; pitch: number; bearing: number };

const KEYFRAMES: CameraKeyframe[] = [
  { frame: 0,   lon: 5,             lat: 18,             zoom: 1.8, pitch: 0,  bearing: 0 },
  { frame: 120, lon: 0,             lat: 16,             zoom: 4.0, pitch: 30, bearing: 0 },
  { frame: 240, lon: TOMBOUCTOU_LON, lat: TOMBOUCTOU_LAT, zoom: 7.0, pitch: 60, bearing: 15 },
];

const MARKER_APPEAR_FRAME = 120;

export const AtlasGoogleEarthTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Google Earth style render"));
  const [ready, setReady] = useState(false);
  const [markerPos, setMarkerPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [KEYFRAMES[0].lon, KEYFRAMES[0].lat],
      zoom: KEYFRAMES[0].zoom,
      pitch: KEYFRAMES[0].pitch,
      bearing: KEYFRAMES[0].bearing,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });

    mapRef.current = map;

    map.on("style.load", () => {
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
    });

    map.on("load", () => {
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
  }, [handle]);

  const cam = (() => {
    for (let i = 0; i < KEYFRAMES.length - 1; i++) {
      const a = KEYFRAMES[i];
      const b = KEYFRAMES[i + 1];
      if (frame >= a.frame && frame <= b.frame) {
        const lon = interpolate(frame, [a.frame, b.frame], [a.lon, b.lon], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const lat = interpolate(frame, [a.frame, b.frame], [a.lat, b.lat], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const zoom = interpolate(frame, [a.frame, b.frame], [a.zoom, b.zoom], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const pitch = interpolate(frame, [a.frame, b.frame], [a.pitch, b.pitch], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const bearing = interpolate(frame, [a.frame, b.frame], [a.bearing, b.bearing], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return { lon, lat, zoom, pitch, bearing };
      }
    }
    const last = KEYFRAMES[KEYFRAMES.length - 1];
    return { lon: last.lon, lat: last.lat, zoom: last.zoom, pitch: last.pitch, bearing: last.bearing };
  })();

  useEffect(() => {
    if (!mapRef.current || !ready) return;
    mapRef.current.jumpTo({
      center: [cam.lon, cam.lat],
      zoom: cam.zoom,
      pitch: cam.pitch,
      bearing: cam.bearing,
    });
    const px = mapRef.current.project([TOMBOUCTOU_LON, TOMBOUCTOU_LAT]);
    setMarkerPos({ x: px.x, y: px.y });
  }, [cam.lon, cam.lat, cam.zoom, cam.pitch, cam.bearing, ready]);

  const markerProgress = spring({
    frame: frame - MARKER_APPEAR_FRAME,
    fps,
    config: { damping: 12, stiffness: 200 },
    durationInFrames: 30,
  });

  const pulseProgress = (frame - MARKER_APPEAR_FRAME) > 0
    ? ((frame - MARKER_APPEAR_FRAME) % 30) / 30
    : 0;
  const pulseScale = interpolate(pulseProgress, [0, 1], [1, 2.5]);
  const pulseOpacity = interpolate(pulseProgress, [0, 1], [0.7, 0]);

  if (!MAPBOX_TOKEN) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#222", color: "white", padding: 40, fontSize: 24 }}>
        REMOTION_MAPBOX_TOKEN env var manquante.
      </AbsoluteFill>
    );
  }

  const showMarker = frame >= MARKER_APPEAR_FRAME && markerPos;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div ref={containerRef} style={{ width, height, position: "absolute", top: 0, left: 0 }} />
      {showMarker && (
        <>
          <div
            style={{
              position: "absolute",
              left: markerPos.x - 30,
              top: markerPos.y - 30,
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: "#FFD700",
              transform: `scale(${pulseScale})`,
              opacity: pulseOpacity,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: markerPos.x - 18,
              top: markerPos.y - 18,
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: "#FFD700",
              border: "4px solid #FFFFFF",
              transform: `scale(${markerProgress})`,
              pointerEvents: "none",
              boxShadow: "0 0 20px rgba(255, 215, 0, 0.8)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: markerPos.x - 200,
              top: markerPos.y + 30,
              width: 400,
              textAlign: "center",
              fontFamily: "Helvetica, sans-serif",
              fontWeight: 900,
              fontSize: 56,
              color: "#FFFFFF",
              letterSpacing: 4,
              textShadow: "0 0 12px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,1)",
              opacity: markerProgress,
              pointerEvents: "none",
            }}
          >
            TOMBOUCTOU
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
