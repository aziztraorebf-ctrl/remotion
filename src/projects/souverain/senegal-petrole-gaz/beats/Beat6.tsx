import React, { useEffect, useRef } from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import mapboxgl from "mapbox-gl";
import {
  MapboxBrandingHide,
  MAPBOX_STYLES,
  applyGeoAfriqueV5,
} from "../../../_shared/mapbox/MapboxBase";

// Beat 6 — Acte 2 / Beat A — "Sangomar" (43.30s → 60.36s narration)
// Durée réelle : 17.06s / 512 frames
// Forced-alignment anchors (relatifs) :
//   0s    — "Le" → map apparaît
//   4.36s — "Sangomar," → dot émerge du fond marin (f131)
//   6.56s — "pétrole brut" → label PÉTROLE BRUT (f197)
//   8.70s — "Woodside" → sous-label opérateur (f261)
//   11.60s — "Petrosen" → PETROSEN 18% (f348)

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD = "#c8a951";
const SANGOMAR = { lon: -17.15, lat: 13.45 };
const CAM_ZOOM = 7.2;

const F_DOT    = Math.round(4.36 * 30);  // 131f
const F_LABEL  = Math.round(6.56 * 30);  // 197f
const F_WOODSIDE = Math.round(8.70 * 30); // 261f
const F_PETROSEN = Math.round(11.60 * 30); // 348f

const MapboxSangomar: React.FC = () => {
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: [SANGOMAR.lon, SANGOMAR.lat],
      zoom: CAM_ZOOM,
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

  // Drift cinematique agressif — survol plongeant sur Sangomar
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const f = Math.min(frame, 512);
    // Pan lent vers le large pendant que la caméra plonge
    const lon = interpolate(f, [0, 200, 512], [-17.15, -17.35, -17.70], { extrapolateRight: "clamp" });
    const lat = interpolate(f, [0, 512],       [13.45,  13.20],          { extrapolateRight: "clamp" });
    // Bearing : reste stable au début (labels lisibles), puis tourne
    const bearing = interpolate(f, [0, 150, 350, 512], [0, -3, -12, -18], { extrapolateRight: "clamp" });
    // Pitch : plat pendant que le dot apparaît, plonge ensuite
    const pitch = interpolate(f, [0, 130, 300, 512], [0, 0, 28, 45], { extrapolateRight: "clamp" });
    // Zoom in progressif
    const zoom = interpolate(f, [0, 200, 512], [7.2, 7.4, 7.8], { extrapolateRight: "clamp" });
    map.jumpTo({ center: [lon, lat], bearing, pitch, zoom });
  });

  return (
    <>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
    </>
  );
};

// Hook local pour useCurrentFrame dans MapboxSangomar
let frame = 0;

export const Beat6: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  frame = f;

  const PX = width * 0.42;
  const PY = height * 0.5;

  // Dot — émerge du fond marin (scale 0.05→1, upward translate)
  const dotP = spring({ frame: f - F_DOT, fps, config: { damping: 8, stiffness: 350 }, durationInFrames: 25 });
  const dotScale = interpolate(dotP, [0, 1], [0.05, 1], { extrapolateRight: "clamp" });
  const dotY = interpolate(dotP, [0, 1], [30, 0], { extrapolateRight: "clamp" });
  const dotOpacity = interpolate(dotP, [0, 0.08, 1], [0, 1, 1], { extrapolateRight: "clamp" });
  const sinePulse = Math.sin((f / 45) * Math.PI * 2);
  const dotGlow = interpolate(sinePulse, [-1, 1], [0.65, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Rings
  const RING_PERIOD = 90;
  const rings = [0, 1, 2].map((i) => {
    const localF = Math.max(0, f - F_DOT - i * 30);
    const progress = (localF % RING_PERIOD) / RING_PERIOD;
    return {
      radius: progress * 160,
      opacity: interpolate(progress, [0, 0.15, 0.7, 1], [0, 0.6, 0.25, 0], { extrapolateRight: "clamp" }),
    };
  });

  // Label plate — slide-in depuis droite
  const labelP = spring({ frame: f - F_LABEL, fps, config: { damping: 18, stiffness: 200 }, durationInFrames: 20 });
  const labelX = interpolate(labelP, [0, 1], [40, 0], { extrapolateRight: "clamp" });
  const labelOpacity = interpolate(labelP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // Woodside sous-label
  const woodsideP = spring({ frame: f - F_WOODSIDE, fps, config: { damping: 18, stiffness: 180 }, durationInFrames: 18 });
  const woodsideOpacity = interpolate(woodsideP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const woodsideY = interpolate(woodsideP, [0, 1], [10, 0], { extrapolateRight: "clamp" });

  // Petrosen 18%
  const petrosenP = spring({ frame: f - F_PETROSEN, fps, config: { damping: 18, stiffness: 180 }, durationInFrames: 18 });
  const petrosenOpacity = interpolate(petrosenP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const petrosenY = interpolate(petrosenP, [0, 1], [8, 0], { extrapolateRight: "clamp" });

  const LABEL_X = PX + 40;
  const LABEL_Y = PY - 75;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1520" }}>
      <MapboxSangomar />

      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 50%, rgba(13,21,32,0.4) 100%)", pointerEvents: "none" }} />

      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {rings.map((ring, i) => (
          <circle key={i} cx={PX} cy={PY} r={ring.radius} stroke={GOLD} strokeWidth={1.5} fill="none" opacity={ring.opacity} />
        ))}
        <circle cx={PX} cy={PY} r={14 * dotScale} fill={GOLD} opacity={dotGlow * dotOpacity}
          style={{ transform: `translateY(${dotY}px)` }} />
        <circle cx={PX} cy={PY} r={28 * dotScale} fill={GOLD} opacity={dotGlow * 0.18 * dotOpacity} />
        {/* Faisceau lumineux ascendant */}
        <ellipse cx={PX} cy={PY - 60 * dotScale} rx={8 * dotScale} ry={50 * dotScale}
          fill={GOLD} opacity={0.12 * dotOpacity} />
      </svg>

      {/* Icone plateforme petroliere SVG inline */}
      {labelOpacity > 0.01 && (
        <div style={{
          position: "absolute",
          left: PX - 30,
          top: PY - 108,
          opacity: labelOpacity * 0.85,
          transform: `translateX(${labelX}px)`,
          pointerEvents: "none",
        }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <line x1="22" y1="6" x2="8" y2="38" stroke={GOLD} strokeWidth="2" strokeLinecap="round"/>
            <line x1="22" y1="6" x2="36" y2="38" stroke={GOLD} strokeWidth="2" strokeLinecap="round"/>
            <line x1="22" y1="6" x2="22" y2="38" stroke={GOLD} strokeWidth="2" strokeLinecap="round"/>
            <line x1="6" y1="38" x2="38" y2="38" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="13" y1="22" x2="31" y2="22" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
            <rect x="18" y="4" width="8" height="4" rx="1" fill={GOLD} opacity="0.7"/>
          </svg>
        </div>
      )}

      {/* Label plate SANGOMAR */}
      <div style={{
        position: "absolute",
        left: LABEL_X,
        top: LABEL_Y,
        opacity: labelOpacity,
        transform: `translateX(${labelX}px)`,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}>
        <div style={{
          backgroundColor: "rgba(13,21,37,0.92)",
          borderLeft: `4px solid ${GOLD}`,
          padding: "10px 20px 8px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 28, fontWeight: 700,
            color: "#f2ebd9", letterSpacing: "0.16em",
            textTransform: "uppercase", whiteSpace: "nowrap",
          }}>
            SANGOMAR
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 16, fontWeight: 500,
            color: GOLD, letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
            PÉTROLE BRUT
          </div>
        </div>

        {/* Woodside */}
        <div style={{
          backgroundColor: "rgba(13,21,37,0.75)",
          padding: "6px 20px 6px 20px",
          opacity: woodsideOpacity,
          transform: `translateY(${woodsideY}px)`,
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 13, fontWeight: 400,
            color: "rgba(242,235,217,0.60)", letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}>
            OPÉRATEUR — WOODSIDE ENERGY
          </div>
        </div>

        {/* Petrosen 18% */}
        <div style={{
          backgroundColor: "rgba(13,21,37,0.70)",
          padding: "5px 20px 6px 20px",
          opacity: petrosenOpacity,
          transform: `translateY(${petrosenY}px)`,
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 14, fontWeight: 600,
            color: GOLD, letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}>
            PETROSEN — 18%
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Beat6;
