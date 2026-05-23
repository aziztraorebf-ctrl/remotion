import React, { useEffect, useRef } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import mapboxgl from "mapbox-gl";
import {
  MapboxBrandingHide,
  MAPBOX_STYLES,
  applyGeoAfriqueV5,
} from "../../../_shared/mapbox/MapboxBase";

// Beat 2 — "Huit millions de dollars par jour..." (18.46s → 28.88s narration)
// Durée réelle : 10.42s / 312 frames
// Forced-alignment anchors (relatifs au début du beat) :
//   0s   — "Huit" → carte Sangomar + dot + chiffre immédiatement
//   1.76s — "C'est ce que le Sénégal sort..." → unité $/JOUR
//   9.16s — fin "d'indépendance." → fin du beat

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const SANGOMAR_CENTER = { lon: -17.15, lat: 13.45 };
const CAM_ZOOM_START = 7.5;
const CAM_ZOOM_END   = 8.8;
const GOLD = "#c8a951";
const RING_PERIOD  = 90;
const RING_STAGGER = 30;
const MAX_RING_RADIUS = 260;

// Anchors recalés sur forced-alignment
const F_DOT_APPEAR  = 0;         // 0s — "Huit" → tout apparaît d'emblée
const F_NUMBER_POP  = 0;         // 0s — chiffre pop immédiat (voix dit le chiffre)
const F_UNIT_APPEAR = 1.76 * 30; // 1.76s = 53f — "C'est ce que le Sénégal sort..."
const F_LABEL_GEO   = 0;         // 0s — SANGOMAR visible dès le début

export const Beat2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: [SANGOMAR_CENTER.lon, SANGOMAR_CENTER.lat],
      zoom: CAM_ZOOM_START,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
    });

    map.on("style.load", () => {
      (map as unknown as { setProjection: (p: string) => void }).setProjection("mercator");
      applyGeoAfriqueV5(map);
      const safe = (id: string, prop: string, val: unknown) => {
        try { if (map.getLayer(id)) (map.setPaintProperty as (id: string, prop: string, val: unknown) => void)(id, prop, val); } catch {}
      };
      safe("land",         "background-color", "#5a5a5a");
      safe("landuse",      "fill-color",       "#5a5a5a");
      safe("landcover",    "fill-color",       "#545454");
      safe("water",        "fill-color",       "#2a4f72");
      safe("water-shadow", "fill-color",       "#2a4f72");
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Zoom-in progressif 0→3s
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const ZOOM_FRAMES = 3 * 30;
    const raw  = Math.max(0, Math.min(1, frame / ZOOM_FRAMES));
    const ease = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;
    map.jumpTo({ zoom: CAM_ZOOM_START + (CAM_ZOOM_END - CAM_ZOOM_START) * ease });
  }, [frame]);

  const PX = width / 2;
  const PY = height / 2;

  const rings = [0, 1, 2].map((i) => {
    const localF = Math.max(0, frame - F_DOT_APPEAR - i * RING_STAGGER);
    const progress = (localF % RING_PERIOD) / RING_PERIOD;
    const radius = progress * MAX_RING_RADIUS;
    const opacity = interpolate(progress, [0, 0.15, 0.7, 1], [0, 0.75, 0.35, 0], { extrapolateRight: "clamp" });
    return { radius, opacity };
  });

  const dotP = spring({ frame: frame - F_DOT_APPEAR, fps, config: { damping: 14, stiffness: 220 }, durationInFrames: 18 });
  const dotScale = interpolate(dotP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const sinePulse = Math.sin((frame / 30) * Math.PI * 2);
  const dotGlow = interpolate(sinePulse, [-1, 1], [0.65, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const crossP = spring({ frame: frame - F_DOT_APPEAR + 4, fps, config: { damping: 20, stiffness: 100 }, durationInFrames: 22 });
  const crossScale = interpolate(crossP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const CROSS_ARM = 32;

  // Chiffre — pop immédiat avec overshoot fort
  const numberP = spring({ frame: frame - F_NUMBER_POP, fps, config: { damping: 10, stiffness: 200 }, durationInFrames: 30 });
  const numberScale = interpolate(numberP, [0, 1], [0.3, 1], { extrapolateRight: "clamp" });
  const numberOpacity = interpolate(numberP, [0, 0.15, 1], [0, 1, 1], { extrapolateRight: "clamp" });
  const heartScale = interpolate(sinePulse, [-1, 1], [1, 1.02], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // $/JOUR — apparaît à 1.76s quand la voix dit "C'est ce que le Sénégal sort..."
  const unitP = spring({ frame: frame - F_UNIT_APPEAR, fps, config: { damping: 18, stiffness: 140 }, durationInFrames: 25 });
  const unitOpacity = interpolate(unitP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const unitY = interpolate(unitP, [0, 1], [20, 0], { extrapolateRight: "clamp" });

  const labelGeoOpacity = interpolate(Math.max(0, frame - F_LABEL_GEO), [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1520" }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />

      <div
        style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, transparent 45%, rgba(13,21,32,0.45) 100%)",
          pointerEvents: "none",
        }}
      />

      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {rings.map((ring, i) => (
          <circle key={i} cx={PX} cy={PY} r={ring.radius} stroke={GOLD} strokeWidth={2} fill="none" opacity={ring.opacity} />
        ))}
        <circle cx={PX} cy={PY} r={20} stroke={GOLD} strokeWidth={1} fill="none" opacity={0.35 * dotScale} />
        <line x1={PX} y1={PY - 12} x2={PX} y2={PY - 12 - CROSS_ARM * crossScale} stroke={GOLD} strokeWidth={1.5} opacity={0.85} />
        <line x1={PX} y1={PY + 12} x2={PX} y2={PY + 12 + CROSS_ARM * crossScale} stroke={GOLD} strokeWidth={1.5} opacity={0.85} />
        <line x1={PX - 12} y1={PY} x2={PX - 12 - CROSS_ARM * crossScale} y2={PY} stroke={GOLD} strokeWidth={1.5} opacity={0.85} />
        <line x1={PX + 12} y1={PY} x2={PX + 12 + CROSS_ARM * crossScale} y2={PY} stroke={GOLD} strokeWidth={1.5} opacity={0.85} />
        <circle cx={PX} cy={PY} r={7 * dotScale} fill={GOLD} opacity={dotGlow} />
        <circle cx={PX} cy={PY} r={16 * dotScale} fill={GOLD} opacity={dotGlow * 0.22} />
      </svg>

      {/* Chiffre 8 000 000 — pop immédiat avec la voix */}
      <div className="absolute left-0 right-0 flex justify-center items-center"
        style={{ top: 0, bottom: height * 0.08, opacity: numberOpacity }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 220, fontWeight: 900, lineHeight: 1, color: "#f2ebd9",
          textShadow: "0 0 30px rgba(200,169,81,0.5), 0 0 80px rgba(200,169,81,0.2)",
          transform: `scale(${numberScale * heartScale})`,
          letterSpacing: "-0.02em", transformOrigin: "center center",
        }}>
          8 000 000
        </div>
      </div>

      {/* $/JOUR + SANGOMAR — bloc unifié en bas, apparaît à 1.76s */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 60,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        opacity: unitOpacity, transform: `translateY(${unitY}px)`,
      }}>
        <div style={{ width: 320, height: 2, backgroundColor: GOLD, opacity: 0.7 }} />
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 72, fontWeight: 700,
          color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase",
          textShadow: "0 0 20px rgba(200,169,81,0.6)",
        }}>
          $/JOUR
        </div>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 28, fontWeight: 400,
          color: "rgba(242,235,217,0.65)", letterSpacing: "0.2em", textTransform: "uppercase",
        }}>
          JUIN 2024 — DAKAR
        </div>
        {/* SANGOMAR — intégré comme légende du chiffre */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10, marginTop: 4,
          opacity: labelGeoOpacity,
        }}>
          <div style={{ width: 3, height: 24, backgroundColor: GOLD }} />
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 36, fontWeight: 600,
            color: GOLD, letterSpacing: "0.18em", textTransform: "uppercase",
          }}>
            GISEMENT SANGOMAR
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Beat2;
