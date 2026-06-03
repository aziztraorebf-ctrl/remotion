import { AbsoluteFill, useCurrentFrame, useVideoConfig, delayRender, continueRender, interpolate, Easing } from "remotion";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import parcheminReliefStyle from "../mapbox-styles/atlas-parchemin-mande-relief.json";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const TOMBOUCTOU_LON = -3.0026;
const TOMBOUCTOU_LAT = 16.7666;

type CameraKeyframe = { frame: number; lon: number; lat: number; zoom: number; pitch: number; bearing: number };

const KEYFRAMES: CameraKeyframe[] = [
  { frame: 0,   lon: 5,             lat: 18,             zoom: 1.8, pitch: 0,  bearing: 0 },
  { frame: 120, lon: 0,             lat: 16,             zoom: 4.0, pitch: 30, bearing: 0 },
  { frame: 240, lon: TOMBOUCTOU_LON, lat: TOMBOUCTOU_LAT, zoom: 5.5, pitch: 60, bearing: 15 },
];

export const AtlasParcheminRelief: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Parchemin relief render"));
  const [ready, setReady] = useState(false);

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
      map.setTerrain({ source: "mapbox-terrain-dem", exaggeration: 1.5 });
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
  }, [cam.lon, cam.lat, cam.zoom, cam.pitch, cam.bearing, ready]);

  if (!MAPBOX_TOKEN) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#222", color: "white", padding: 40, fontSize: 24 }}>
        REMOTION_MAPBOX_TOKEN env var manquante.
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#E8DBB0" }}>
      <div ref={containerRef} style={{ width, height, position: "absolute", top: 0, left: 0 }} />
    </AbsoluteFill>
  );
};
