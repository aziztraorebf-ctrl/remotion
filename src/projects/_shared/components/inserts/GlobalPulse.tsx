/**
 * Template Insert — GlobalPulse
 *
 * Carte Mapbox globe dark-v11. Point d'origine pulsant + arcs SVG great-circle
 * animés vers destinations mondiales. Panel données slide-in.
 *
 * Stack : Mapbox GL JS (globe) + overlay SVG React (map.project) + Remotion spring/interpolate
 * Durée : 150 frames (5s @ 30fps)
 *
 * Animation :
 *   f0–15   : globe fade-in + dot origine + anneaux pulse
 *   f30–75  : arc USA se trace (strokeDashoffset)
 *   f35–80  : arc France se trace (stagger +5f)
 *   f40–85  : arc Chine se trace (stagger +10f)
 *   f70–90  : dots destinations scale-up spring
 *   f85–100 : labels destinations fade-in
 *   f100–120: panel données slide-up spring
 *   permanent: anneaux origine sinus + dots destination micro-pulse
 */

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MapboxBrandingHide } from "../../mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const GLOBAL_PULSE_FRAMES = 150;

const NAVY   = "#03224c";
const GOLD   = "#f5b041";
const ARC    = "#e67e22";
const IVORY  = "#ede5d3";
const BLUE   = "#4a8fc4";

interface Destination {
  id: string;
  lonlat: [number, number];
  label: string;
  percentage: string;
  drawStart: number;
}

const DESTINATIONS: Destination[] = [
  { id: "usa",    lonlat: [-74.0,  40.7], label: "USA",    percentage: "15%", drawStart: 30 },
  { id: "france", lonlat: [  2.4,  48.9], label: "FRANCE", percentage: "57%", drawStart: 35 },
  { id: "china",  lonlat: [116.4,  39.9], label: "CHINE",  percentage: "28%", drawStart: 40 },
];

const ORIGIN_LONLAT: [number, number] = [7.39, 18.73];
const ARC_DRAW_DURATION = 45;
const PULSE_RINGS = 4;
const PULSE_MAX_R = 120;

export interface GlobalPulseProps {
  originLabel?: string;
  resourceName?: string;
  production?: string;
  worldShare?: string;
  dataSource?: string;
  destinations?: Destination[];
}

// Quadratic bezier arc between two screen points — control point lifted for globe curvature feel
function arcPath(
  ax: number, ay: number,
  bx: number, by: number,
  lift = 0.35
): string {
  const cx = (ax + bx) / 2;
  const cy = (ay + by) / 2 - Math.hypot(bx - ax, by - ay) * lift;
  return `M ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}`;
}

// Approximate SVG path length for a quadratic bezier (3-point sampling)
function approxPathLen(ax: number, ay: number, bx: number, by: number, lift = 0.35): number {
  const cx = (ax + bx) / 2;
  const cy = (ay + by) / 2 - Math.hypot(bx - ax, by - ay) * lift;
  let len = 0;
  let px = ax, py = ay;
  const N = 20;
  for (let i = 1; i <= N; i++) {
    const t = i / N;
    const x = (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * cx + t * t * bx;
    const y = (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * cy + t * t * by;
    len += Math.hypot(x - px, y - py);
    px = x; py = y;
  }
  return len;
}

export const GlobalPulse: React.FC<GlobalPulseProps> = ({
  originLabel  = "NIGER",
  resourceName = "URANIUM NIGÉRIEN",
  production   = "3 500 T/an",
  worldShare   = "7%",
  dataSource   = "AIEA 2023",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const handleRef    = useRef<number | null>(null);
  const [mapReady, setMapReady]       = useState(false);
  const [originPx, setOriginPx]       = useState<{ x: number; y: number } | null>(null);
  const [destPixels, setDestPixels]   = useState<Record<string, { x: number; y: number }>>({});

  // Init Mapbox globe
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    handleRef.current = delayRender("GlobalPulse map init");
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [15.0, 20.0],
      zoom: 1.8,
      pitch: 0,
      bearing: 0,
      interactive: false,
      preserveDrawingBuffer: true,
      attributionControl: false,
      projection: { name: "globe" } as mapboxgl.ProjectionSpecification,
    });

    mapRef.current = map;

    map.on("style.load", () => {
      // Globe atmosphere
      map.setFog({
        color: "rgba(0, 10, 30, 0.85)",
        "high-color": "rgba(0, 5, 20, 1)",
        "horizon-blend": 0.04,
        "space-color": "#000814",
        "star-intensity": 0.6,
      } as mapboxgl.FogSpecification);

      // Hide labels
      map.getStyle().layers?.forEach((layer) => {
        if (layer.type === "symbol") {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      });

      setMapReady(true);
      if (handleRef.current !== null) {
        continueRender(handleRef.current);
        handleRef.current = null;
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Project coordinates every frame
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const op = map.project(ORIGIN_LONLAT as mapboxgl.LngLatLike);
    setOriginPx({ x: op.x, y: op.y });

    const dp: Record<string, { x: number; y: number }> = {};
    for (const dest of DESTINATIONS) {
      const pt = map.project(dest.lonlat as mapboxgl.LngLatLike);
      dp[dest.id] = { x: pt.x, y: pt.y };
    }
    setDestPixels(dp);
  });

  // --- Animations ---
  const globeOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Origin dot pulse rings (staggered sinus per ring)
  const rings = Array.from({ length: PULSE_RINGS }, (_, i) => {
    const offset = i * (fps / PULSE_RINGS);
    const t = ((frame - offset) % fps) / fps;
    const r  = PULSE_MAX_R * t;
    const op = (1 - t) * 0.5 * Math.max(0, interpolate(frame, [5, 20], [0, 1], { extrapolateRight: "clamp" }));
    return { r, op };
  });

  // Panel slide-up
  const panelSpring = spring({ frame: frame - 100, fps, config: { damping: 80, stiffness: 60 } });
  const panelY  = interpolate(panelSpring, [0, 1], [60, 0], { extrapolateRight: "clamp" });
  const panelOp = interpolate(frame, [100, 118], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000814" }}>
      {/* Mapbox globe */}
      <div
        ref={mapContainer}
        style={{ position: "absolute", inset: 0, opacity: globeOpacity }}
      />

      <MapboxBrandingHide />

      {/* SVG overlay — arcs + dots */}
      {mapReady && originPx && (
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
          viewBox="0 0 1080 1920"
          preserveAspectRatio="none"
        >
          {/* Arcs */}
          {DESTINATIONS.map((dest) => {
            const dp = destPixels[dest.id];
            if (!dp) return null;

            const { x: ax, y: ay } = originPx;
            const { x: bx, y: by } = dp;
            const d  = arcPath(ax, ay, bx, by);
            const len = approxPathLen(ax, ay, bx, by);

            const progress = interpolate(
              frame,
              [dest.drawStart, dest.drawStart + ARC_DRAW_DURATION],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const dashOffset = len * (1 - progress);

            // Leading dot position along bezier
            const t = progress;
            const cx2 = (ax + bx) / 2;
            const cy2 = (ay + by) / 2 - Math.hypot(bx - ax, by - ay) * 0.35;
            const lx = (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * cx2 + t * t * bx;
            const ly = (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * cy2 + t * t * by;

            return (
              <g key={dest.id}>
                {/* Glow layer */}
                <path
                  d={d}
                  fill="none"
                  stroke={ARC}
                  strokeWidth={6}
                  strokeDasharray={len}
                  strokeDashoffset={dashOffset}
                  opacity={0.25}
                  strokeLinecap="round"
                  style={{ filter: `blur(4px)` }}
                />
                {/* Arc */}
                <path
                  d={d}
                  fill="none"
                  stroke={ARC}
                  strokeWidth={2}
                  strokeDasharray={len}
                  strokeDashoffset={dashOffset}
                  opacity={progress > 0 ? 0.9 : 0}
                  strokeLinecap="round"
                />
                {/* Leading dot */}
                {progress > 0 && progress < 1 && (
                  <circle cx={lx} cy={ly} r={4} fill={IVORY} opacity={0.9} />
                )}
              </g>
            );
          })}

          {/* Destination dots + labels */}
          {DESTINATIONS.map((dest) => {
            const dp = destPixels[dest.id];
            if (!dp) return null;

            const dotScale = interpolate(
              spring({ frame: frame - 70, fps, config: { damping: 70, stiffness: 70 } }),
              [0, 1], [0, 1],
              { extrapolateRight: "clamp" }
            );
            const labelOp = interpolate(frame, [85, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const microPulse = 1 + 0.12 * Math.sin(frame / 10 + DESTINATIONS.indexOf(dest));

            return (
              <g key={`dest-${dest.id}`}>
                {/* Pulse ring */}
                <circle
                  cx={dp.x} cy={dp.y}
                  r={22 * dotScale * microPulse}
                  fill="none"
                  stroke={BLUE}
                  strokeWidth={1}
                  opacity={0.3 * dotScale}
                />
                {/* Dot */}
                <circle
                  cx={dp.x} cy={dp.y}
                  r={7 * dotScale}
                  fill={IVORY}
                  opacity={dotScale}
                />
                {/* Label */}
                <text
                  x={dp.x}
                  y={dp.y - 22}
                  textAnchor="middle"
                  fontSize={26}
                  fontFamily="'Arial Narrow', Arial, sans-serif"
                  fontWeight="bold"
                  fill={IVORY}
                  opacity={labelOp}
                  letterSpacing="0.1em"
                >
                  {dest.label}
                </text>
                <text
                  x={dp.x}
                  y={dp.y - 46}
                  textAnchor="middle"
                  fontSize={22}
                  fontFamily="Arial, sans-serif"
                  fill={GOLD}
                  opacity={labelOp}
                >
                  {dest.percentage}
                </text>
              </g>
            );
          })}

          {/* Origin dot + pulse rings */}
          <g>
            {rings.map(({ r, op }, i) => (
              <circle
                key={i}
                cx={originPx.x} cy={originPx.y}
                r={r}
                fill="none"
                stroke={BLUE}
                strokeWidth={1.5}
                opacity={op}
              />
            ))}
            {/* Outer glow */}
            <circle cx={originPx.x} cy={originPx.y} r={18} fill={GOLD} opacity={0.15} style={{ filter: "blur(8px)" }} />
            {/* Core */}
            <circle cx={originPx.x} cy={originPx.y} r={10} fill={GOLD} opacity={0.95} />
            <circle cx={originPx.x} cy={originPx.y} r={5}  fill="#fff"  opacity={0.8}  />
            {/* Label */}
            <text
              x={originPx.x + 16}
              y={originPx.y + 5}
              fontSize={24}
              fontFamily="'Arial Narrow', Arial, sans-serif"
              fontWeight="bold"
              fill={IVORY}
              letterSpacing="0.12em"
              opacity={interpolate(frame, [5, 20], [0, 1], { extrapolateRight: "clamp" })}
            >
              {originLabel}
            </text>
          </g>
        </svg>
      )}

      {/* Data panel */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: "50%",
          transform: `translateX(-50%) translateY(${panelY}px)`,
          opacity: panelOp,
          background: "rgba(3, 12, 30, 0.88)",
          borderRadius: 16,
          padding: "24px 40px",
          minWidth: 460,
          backdropFilter: "blur(6px)",
          border: `1px solid rgba(212, 169, 60, 0.3)`,
          textAlign: "center",
        }}
      >
        <div style={{
          fontFamily: "'Arial Narrow', Arial, sans-serif",
          fontSize: 28,
          fontWeight: "bold",
          color: GOLD,
          letterSpacing: "0.15em",
          marginBottom: 16,
        }}>
          {resourceName}
        </div>
        {[
          ["PRODUCTION", production],
          ["PART mondiale", worldShare],
        ].map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, gap: 32 }}>
            <span style={{ fontFamily: "Arial, sans-serif", fontSize: 20, fontWeight: "bold", color: GOLD, letterSpacing: "0.1em" }}>
              {label}
            </span>
            <span style={{ fontFamily: "Georgia, serif", fontSize: 20, color: IVORY }}>
              {value}
            </span>
          </div>
        ))}
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "rgba(230, 210, 180, 0.45)", marginTop: 10 }}>
          Source : {dataSource}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// V2 — Zoom-in Niger → dézoom progressif pendant tracé des arcs
// Pulse amplifié (rayon 2x plus grand au zoom serré)
// ─────────────────────────────────────────────────────────────────────────────

export const GLOBAL_PULSE_V2_FRAMES = 150;

// Caméra : commence zoomé sur Niger, dézoom pendant que les arcs se tracent
const CAM_V2_START = { lon: 8.5, lat: 17.5, zoom: 4.2 };
const CAM_V2_MID   = { lon: 8.0, lat: 20.0, zoom: 2.8 };
const CAM_V2_END   = { lon: 15.0, lat: 22.0, zoom: 2.2 };

// Arc draw commence plus tard pour laisser le pulse s'installer
const DESTINATIONS_V2: Destination[] = [
  { id: "usa",    lonlat: [-74.0, 40.7], label: "USA",    percentage: "15%", drawStart: 50 },
  { id: "france", lonlat: [  2.4, 48.9], label: "FRANCE", percentage: "57%", drawStart: 55 },
  { id: "china",  lonlat: [116.4, 39.9], label: "CHINE",  percentage: "28%", drawStart: 60 },
];

const PULSE_MAX_R_V2 = 420;
const PULSE_RINGS_V2 = 5;

export const GlobalPulseV2: React.FC<GlobalPulseProps> = ({
  originLabel  = "NIGER",
  resourceName = "URANIUM NIGÉRIEN",
  production   = "3 500 T/an",
  worldShare   = "7%",
  dataSource   = "AIEA 2023",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const handleRef    = useRef<number | null>(null);
  const [mapReady, setMapReady]     = useState(false);
  const [originPx, setOriginPx]     = useState<{ x: number; y: number } | null>(null);
  const [destPixels, setDestPixels] = useState<Record<string, { x: number; y: number }>>({});

  // Camera zoom interpolation — 3 keyframes
  const zoom = frame < 60
    ? interpolate(frame, [0, 60],  [CAM_V2_START.zoom, CAM_V2_MID.zoom], { extrapolateRight: "clamp" })
    : interpolate(frame, [60, 120], [CAM_V2_MID.zoom, CAM_V2_END.zoom],  { extrapolateRight: "clamp" });

  const camLon = frame < 60
    ? interpolate(frame, [0, 60],  [CAM_V2_START.lon, CAM_V2_MID.lon], { extrapolateRight: "clamp" })
    : interpolate(frame, [60, 120], [CAM_V2_MID.lon, CAM_V2_END.lon],  { extrapolateRight: "clamp" });

  const camLat = frame < 60
    ? interpolate(frame, [0, 60],  [CAM_V2_START.lat, CAM_V2_MID.lat], { extrapolateRight: "clamp" })
    : interpolate(frame, [60, 120], [CAM_V2_MID.lat, CAM_V2_END.lat],  { extrapolateRight: "clamp" });

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    handleRef.current = delayRender("GlobalPulseV2 map init");
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [CAM_V2_START.lon, CAM_V2_START.lat],
      zoom: CAM_V2_START.zoom,
      pitch: 0,
      bearing: 0,
      interactive: false,
      preserveDrawingBuffer: true,
      attributionControl: false,
      projection: { name: "globe" } as mapboxgl.ProjectionSpecification,
    });

    mapRef.current = map;

    map.on("style.load", () => {
      map.setFog({
        color: "rgba(0, 10, 30, 0.85)",
        "high-color": "rgba(0, 5, 20, 1)",
        "horizon-blend": 0.04,
        "space-color": "#000814",
        "star-intensity": 0.6,
      } as mapboxgl.FogSpecification);

      map.getStyle().layers?.forEach((layer) => {
        if (layer.type === "symbol") {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      });

      setMapReady(true);
      if (handleRef.current !== null) {
        continueRender(handleRef.current);
        handleRef.current = null;
      }
    });

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Camera + project every frame
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    map.setCenter([camLon, camLat]);
    map.setZoom(zoom);

    const op = map.project(ORIGIN_LONLAT as mapboxgl.LngLatLike);
    setOriginPx({ x: op.x, y: op.y });

    const dp: Record<string, { x: number; y: number }> = {};
    for (const dest of DESTINATIONS_V2) {
      const pt = map.project(dest.lonlat as mapboxgl.LngLatLike);
      dp[dest.id] = { x: pt.x, y: pt.y };
    }
    setDestPixels(dp);
  });

  const globeOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Pulse rings — plus grands, stagger plus ample
  const rings = Array.from({ length: PULSE_RINGS_V2 }, (_, i) => {
    const offset = i * (fps / PULSE_RINGS_V2);
    const t = Math.max(0, ((frame - offset) % fps)) / fps;
    const r  = PULSE_MAX_R_V2 * t;
    const op = (1 - t) * 0.85 * Math.max(0, interpolate(frame, [5, 20], [0, 1], { extrapolateRight: "clamp" }));
    return { r, op };
  });

  const panelSpring = spring({ frame: frame - 110, fps, config: { damping: 80, stiffness: 60 } });
  const panelY  = interpolate(panelSpring, [0, 1], [60, 0], { extrapolateRight: "clamp" });
  const panelOp = interpolate(frame, [110, 128], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000814" }}>
      <div ref={mapContainer} style={{ position: "absolute", inset: 0, opacity: globeOpacity }} />
      <MapboxBrandingHide />

      {mapReady && originPx && (
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
          viewBox="0 0 1080 1920"
          preserveAspectRatio="none"
        >
          {/* Arcs */}
          {DESTINATIONS_V2.map((dest) => {
            const dp = destPixels[dest.id];
            if (!dp) return null;
            const { x: ax, y: ay } = originPx;
            const { x: bx, y: by } = dp;
            const d   = arcPath(ax, ay, bx, by);
            const len = approxPathLen(ax, ay, bx, by);
            const progress = interpolate(frame, [dest.drawStart, dest.drawStart + ARC_DRAW_DURATION], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const dashOffset = len * (1 - progress);
            const t = progress;
            const cx2 = (ax + bx) / 2;
            const cy2 = (ay + by) / 2 - Math.hypot(bx - ax, by - ay) * 0.35;
            const lx = (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * cx2 + t * t * bx;
            const ly = (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * cy2 + t * t * by;

            return (
              <g key={dest.id}>
                <path d={d} fill="none" stroke={ARC} strokeWidth={8} strokeDasharray={len} strokeDashoffset={dashOffset} opacity={0.2} strokeLinecap="round" style={{ filter: "blur(5px)" }} />
                <path d={d} fill="none" stroke={ARC} strokeWidth={2.5} strokeDasharray={len} strokeDashoffset={dashOffset} opacity={progress > 0 ? 0.9 : 0} strokeLinecap="round" />
                {progress > 0 && progress < 1 && <circle cx={lx} cy={ly} r={5} fill={IVORY} opacity={0.95} />}
              </g>
            );
          })}

          {/* Destination dots + labels */}
          {DESTINATIONS_V2.map((dest, idx) => {
            const dp = destPixels[dest.id];
            if (!dp) return null;
            const dotScale = interpolate(spring({ frame: frame - 85, fps, config: { damping: 70, stiffness: 70 } }), [0, 1], [0, 1], { extrapolateRight: "clamp" });
            const labelOp  = interpolate(frame, [95, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const mp = 1 + 0.12 * Math.sin(frame / 10 + idx);
            return (
              <g key={`dest-${dest.id}`}>
                <circle cx={dp.x} cy={dp.y} r={24 * dotScale * mp} fill="none" stroke={BLUE} strokeWidth={1} opacity={0.3 * dotScale} />
                <circle cx={dp.x} cy={dp.y} r={8 * dotScale} fill={IVORY} opacity={dotScale} />
                <text x={dp.x} y={dp.y - 24} textAnchor="middle" fontSize={28} fontFamily="'Arial Narrow', Arial, sans-serif" fontWeight="bold" fill={IVORY} opacity={labelOp} letterSpacing="0.1em">{dest.label}</text>
                <text x={dp.x} y={dp.y - 50} textAnchor="middle" fontSize={24} fontFamily="Arial, sans-serif" fill={GOLD} opacity={labelOp}>{dest.percentage}</text>
              </g>
            );
          })}

          {/* Origin pulse rings */}
          {rings.map(({ r, op }, i) => (
            <circle key={i} cx={originPx.x} cy={originPx.y} r={r} fill="none" stroke={BLUE} strokeWidth={2.5} opacity={op} />
          ))}
          <circle cx={originPx.x} cy={originPx.y} r={36} fill={GOLD} opacity={0.18} style={{ filter: "blur(14px)" }} />
          <circle cx={originPx.x} cy={originPx.y} r={16} fill={GOLD} opacity={0.95} />
          <circle cx={originPx.x} cy={originPx.y} r={8}  fill="#fff"  opacity={0.85}  />
          <text x={originPx.x + 18} y={originPx.y + 6} fontSize={26} fontFamily="'Arial Narrow', Arial, sans-serif" fontWeight="bold" fill={IVORY} letterSpacing="0.12em" opacity={interpolate(frame, [5, 20], [0, 1], { extrapolateRight: "clamp" })}>{originLabel}</text>
        </svg>
      )}

      {/* Data panel */}
      <div style={{ position: "absolute", bottom: 80, left: "50%", transform: `translateX(-50%) translateY(${panelY}px)`, opacity: panelOp, background: "rgba(3, 12, 30, 0.88)", borderRadius: 16, padding: "24px 40px", minWidth: 460, backdropFilter: "blur(6px)", border: `1px solid rgba(212, 169, 60, 0.3)`, textAlign: "center" }}>
        <div style={{ fontFamily: "'Arial Narrow', Arial, sans-serif", fontSize: 28, fontWeight: "bold", color: GOLD, letterSpacing: "0.15em", marginBottom: 16 }}>{resourceName}</div>
        {[["PRODUCTION", production], ["PART mondiale", worldShare]].map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, gap: 32 }}>
            <span style={{ fontFamily: "Arial, sans-serif", fontSize: 20, fontWeight: "bold", color: GOLD, letterSpacing: "0.1em" }}>{label}</span>
            <span style={{ fontFamily: "Georgia, serif", fontSize: 20, color: IVORY }}>{value}</span>
          </div>
        ))}
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "rgba(230, 210, 180, 0.45)", marginTop: 10 }}>Source : {dataSource}</div>
      </div>
    </AbsoluteFill>
  );
};
