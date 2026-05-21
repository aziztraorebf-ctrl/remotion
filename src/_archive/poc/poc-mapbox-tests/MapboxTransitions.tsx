import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MapboxBrandingHide, removeLabels, type CamState } from "../_shared/mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const MAPBOX_TRANSITIONS_FRAMES = 540; // 18s @ 30fps

const SEG = {
  FADE:      { start: 0,   end: 180, label: "FADE STYLES",        desc: "Light → Dark fondu progressif" },
  WIPE:      { start: 180, end: 360, label: "WIPE GÉOGRAPHIQUE",   desc: "Révélation qui suit la côte ouest" },
  MATCHCUT:  { start: 360, end: 540, label: "MATCH-CUT GÉO",      desc: "Zoom extrême → re-cadrage autre échelle" },
};

const CAM_WEST:  CamState = { lon: -5.0,  lat: 12.0, zoom: 3.5, pitch: 10, bearing: 0 };
const CAM_GHANA: CamState = { lon: -1.023, lat: 7.947, zoom: 5.5, pitch: 45, bearing: -5 };
const CAM_AFRIQUE: CamState = { lon: 20.0, lat: 5.0, zoom: 2.8, pitch: 0, bearing: 0 };
const CAM_ZOOM_IN: CamState = { lon: -1.023, lat: 7.947, zoom: 9.0, pitch: 60, bearing: 10 };

const easeQ = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const lerp = (a: number, b: number, t: number) => a + (b - a) * easeQ(Math.max(0, Math.min(1, t)));
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const Badge: React.FC<{ label: string; desc: string; opacity: number }> = ({ label, desc, opacity }) => (
  <div style={{ position: "absolute", top: 50, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity, pointerEvents: "none", zIndex: 10 }}>
    <div style={{ background: "rgba(26,18,9,0.82)", padding: "6px 22px", borderRadius: 4, fontFamily: "Georgia, serif", fontSize: 13, letterSpacing: 3, color: "#D4AF37", fontWeight: 700 }}>{label}</div>
    <div style={{ fontFamily: "Georgia, serif", fontSize: 10, letterSpacing: 1.5, color: "#555" }}>{desc}</div>
  </div>
);

export const MapboxTransitions: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Deux instances map pour le fade (avant + après)
  const mapARef = useRef<mapboxgl.Map | null>(null);
  const mapBRef = useRef<mapboxgl.Map | null>(null);
  const containerARef = useRef<HTMLDivElement>(null);
  const containerBRef = useRef<HTMLDivElement>(null);
  const mapWipeRef = useRef<mapboxgl.Map | null>(null);
  const containerWipeRef = useRef<HTMLDivElement>(null);
  const mapMatchRef = useRef<mapboxgl.Map | null>(null);
  const containerMatchRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("mapbox-transitions"));
  const [handleB] = useState(() => delayRender("mapbox-transitions-b"));
  const [ready, setReady] = useState(false);
  const [readyB, setReadyB] = useState(false);
  const [readyCount, setReadyCount] = useState(0);

  // Map A — light-v11
  useEffect(() => {
    if (!containerARef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerARef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [CAM_WEST.lon, CAM_WEST.lat],
      zoom: CAM_WEST.zoom, pitch: CAM_WEST.pitch, bearing: CAM_WEST.bearing,
      interactive: false, preserveDrawingBuffer: true,
    });
    map.on("style.load", () => {
      removeLabels(map);
      mapARef.current = map;
      setReadyCount((c) => c + 1);
      continueRender(handle);
    });
    return () => map.remove();
  }, []);

  // Map B — dark-v11
  useEffect(() => {
    if (!containerBRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerBRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [CAM_WEST.lon, CAM_WEST.lat],
      zoom: CAM_WEST.zoom, pitch: CAM_WEST.pitch, bearing: CAM_WEST.bearing,
      interactive: false, preserveDrawingBuffer: true,
    });
    map.on("style.load", () => {
      removeLabels(map);
      if (map.getLayer("water")) map.setPaintProperty("water", "fill-color", "#03224c");
      if (map.getLayer("background")) map.setPaintProperty("background", "fill-color", "#2a1e0e");
      mapBRef.current = map;
      setReadyCount((c) => c + 1);
      continueRender(handleB);
    });
    return () => map.remove();
  }, []);

  // Map Wipe — light pour wipe géo
  useEffect(() => {
    if (!containerWipeRef.current) return;
    const map = new mapboxgl.Map({
      container: containerWipeRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [CAM_GHANA.lon, CAM_GHANA.lat],
      zoom: CAM_GHANA.zoom, pitch: CAM_GHANA.pitch, bearing: CAM_GHANA.bearing,
      interactive: false, preserveDrawingBuffer: true,
    });
    map.on("style.load", () => { removeLabels(map); mapWipeRef.current = map; });
    return () => map.remove();
  }, []);

  // Map Match-cut — satellite
  useEffect(() => {
    if (!containerMatchRef.current) return;
    const map = new mapboxgl.Map({
      container: containerMatchRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [CAM_AFRIQUE.lon, CAM_AFRIQUE.lat],
      zoom: CAM_AFRIQUE.zoom, pitch: CAM_AFRIQUE.pitch, bearing: CAM_AFRIQUE.bearing,
      interactive: false, preserveDrawingBuffer: true,
    });
    map.on("style.load", () => { mapMatchRef.current = map; });
    return () => map.remove();
  }, []);

  // Sync cameras
  useEffect(() => {
    if (readyCount < 2) return;

    if (frame < SEG.WIPE.start) {
      [mapARef.current, mapBRef.current].forEach((m) => m?.jumpTo({ center: [CAM_WEST.lon, CAM_WEST.lat], zoom: CAM_WEST.zoom, pitch: CAM_WEST.pitch, bearing: CAM_WEST.bearing }));
    } else if (frame < SEG.MATCHCUT.start && mapWipeRef.current) {
      mapWipeRef.current.jumpTo({ center: [CAM_GHANA.lon, CAM_GHANA.lat], zoom: CAM_GHANA.zoom, pitch: CAM_GHANA.pitch, bearing: CAM_GHANA.bearing });
    } else if (mapMatchRef.current) {
      const relFrame = frame - SEG.MATCHCUT.start;
      const total = SEG.MATCHCUT.end - SEG.MATCHCUT.start;
      const half = total / 2;
      if (relFrame < half) {
        // Phase 1 : zoom in extrême sur Ghana
        const t = relFrame / half;
        mapMatchRef.current.jumpTo({
          center: [lerp(CAM_AFRIQUE.lon, CAM_ZOOM_IN.lon, t), lerp(CAM_AFRIQUE.lat, CAM_ZOOM_IN.lat, t)],
          zoom: lerp(CAM_AFRIQUE.zoom, CAM_ZOOM_IN.zoom, t),
          pitch: lerp(CAM_AFRIQUE.pitch, CAM_ZOOM_IN.pitch, t),
          bearing: lerp(CAM_AFRIQUE.bearing, CAM_ZOOM_IN.bearing, t),
        });
      } else {
        // Phase 2 : re-cadrage vue large Afrique entière
        const t = (relFrame - half) / half;
        mapMatchRef.current.jumpTo({
          center: [lerp(CAM_ZOOM_IN.lon, CAM_AFRIQUE.lon, t), lerp(CAM_ZOOM_IN.lat, CAM_AFRIQUE.lat, t)],
          zoom: lerp(CAM_ZOOM_IN.zoom, CAM_AFRIQUE.zoom, t),
          pitch: lerp(CAM_ZOOM_IN.pitch, CAM_AFRIQUE.pitch, t),
          bearing: lerp(CAM_ZOOM_IN.bearing, CAM_AFRIQUE.bearing, t),
        });
      }
    }
  }, [frame, readyCount]);

  // Opacités
  const fadeT = clamp((frame - 30) / 120, 0, 1); // light → dark sur 4s (f30→f150)
  const lightOp = 1 - fadeT;
  const darkOp  = fadeT;

  // Wipe géo — masque SVG clipPath qui avance de gauche à droite
  const wipeProgress = clamp((frame - SEG.WIPE.start - 20) / 140, 0, 1);
  const wipeX = wipeProgress * width;

  // Match-cut — flash blanc au point de transition
  const relMatch = frame - SEG.MATCHCUT.start;
  const flashOp = interpolate(relMatch, [85, 90, 95], [0, 0.9, 0], { extrapolateRight: "clamp" });

  const currentSeg = frame < SEG.WIPE.start ? SEG.FADE : frame < SEG.MATCHCUT.start ? SEG.WIPE : SEG.MATCHCUT;
  const badgeOp = interpolate(frame, [currentSeg.start, currentSeg.start + 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#e8e4dc" }}>
      <MapboxBrandingHide />

      {/* FADE — 2 maps superposées */}
      {frame < SEG.WIPE.start && (
        <>
          <div ref={containerARef} style={{ position: "absolute", inset: 0, width, height, opacity: lightOp }} />
          <div ref={containerBRef} style={{ position: "absolute", inset: 0, width, height, opacity: darkOp }} />
          {/* Label transition */}
          <div style={{
            position: "absolute", bottom: 100, left: 0, right: 0, textAlign: "center", zIndex: 5,
            opacity: interpolate(frame, [60, 90], [0, 1], { extrapolateRight: "clamp" }),
            fontFamily: "Georgia, serif", fontSize: 11, letterSpacing: 2, color: "#D4AF37",
          }}>
            {fadeT < 0.5 ? "LIGHT — ÉDITORIAL" : "DARK — ANALYTIQUE"}
          </div>
        </>
      )}

      {/* WIPE GÉO — carte avec masque clipPath */}
      {frame >= SEG.WIPE.start && frame < SEG.MATCHCUT.start && (
        <>
          {/* Fond dark */}
          <div ref={containerBRef} style={{ position: "absolute", inset: 0, width, height }} />
          {/* Map light clippée par le wipe */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <div ref={containerWipeRef} style={{ position: "absolute", inset: 0, width, height }} />
            {/* Masque wipe — rectangle qui avance */}
            <div style={{
              position: "absolute", top: 0, left: wipeX, right: 0, bottom: 0,
              background: "rgba(26,18,9,0.95)",
            }} />
          </div>
          {/* Ligne du wipe */}
          <div style={{
            position: "absolute", top: 0, left: wipeX - 1, width: 2, height: "100%",
            background: "linear-gradient(to bottom, transparent, #D4AF37, transparent)",
            opacity: 0.8, zIndex: 5,
          }} />
        </>
      )}

      {/* MATCH-CUT — satellite zoom in → zoom out */}
      {frame >= SEG.MATCHCUT.start && (
        <>
          <div ref={containerMatchRef} style={{ position: "absolute", inset: 0, width, height }} />
          {/* Flash blanc au point de pivot */}
          <div style={{ position: "absolute", inset: 0, background: `rgba(255,255,255,${flashOp})`, pointerEvents: "none", zIndex: 5 }} />
          {/* Label phase */}
          <div style={{
            position: "absolute", bottom: 100, left: 0, right: 0, textAlign: "center", zIndex: 6,
            opacity: interpolate(relMatch, [20, 40], [0, 1], { extrapolateRight: "clamp" }),
            fontFamily: "Georgia, serif", fontSize: 11, letterSpacing: 2, color: "#ffffff",
          }}>
            {relMatch < 90 ? "ZOOM IN — ACCRA, GHANA" : "PULL BACK — AFRIQUE ENTIÈRE"}
          </div>
        </>
      )}

      <Badge label={currentSeg.label} desc={currentSeg.desc} opacity={badgeOp} />
    </AbsoluteFill>
  );
};
