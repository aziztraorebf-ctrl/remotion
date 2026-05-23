import React, { useEffect, useRef } from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import mapboxgl from "mapbox-gl";
import {
  MapboxBrandingHide,
  MAPBOX_STYLES,
  applyGeoAfriqueV5,
} from "../../../_shared/mapbox/MapboxBase";

// Beat 8 — Acte 2 / Beat C — "Yakaar attend" (96.06s → 114.28s narration)
// Durée réelle : 18.22s / 546 frames
// Forced-alignment anchors (relatifs) :
//   0s    — "Et il y a" → dot bleu-cyan apparaît (f0)
//   5.37s — "Yakaar-Teranga." → color shift + pulse ralenti (f161)
//   8.90s — "personne n'a encore décidé" → "?" overlay apparaît (f267)
//   9.77s — "Il attend." → opacité max + quasi-statique (f293)
//   13.77s — "capitales" → vibration rapide (f413)

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const CYAN = "#a3d2e6";
const GOLD = "#c8a951";

// Yakaar-Teranga se situe au large des côtes sénégalaises (NW de Dakar)
const YAKAAR_CENTER = { lon: -18.0, lat: 14.2 };
const CAM_ZOOM = 6.0;

const F_DOT       = 0;
const F_SHIFT     = 161;
const F_QUESTION  = 267;
const F_ATTEND    = 293;
const F_VIBRATION = 413;

// Hook module-level pour accès dans useEffect pan
let frameGlobal = 0;

const MapboxYakaar: React.FC = () => {
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: [YAKAAR_CENTER.lon, YAKAAR_CENTER.lat],
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

  // Drift cinematique — atmosphère suspendue, caméra s'incline comme pour observer sous l'eau
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const f = Math.min(frameGlobal, 546);
    // Pan SW lent — dérive vers le large
    const lon = interpolate(f, [0, 546], [-18.0, -18.9], { extrapolateRight: "clamp" });
    const lat = interpolate(f, [0, 546], [14.2,  13.7],  { extrapolateRight: "clamp" });
    // Bearing : tourne dans le sens du doute, lentement puis s'accélère à la vibration
    const bearing = interpolate(f, [0, 260, 413, 546], [0, 6, 10, 14], { extrapolateRight: "clamp" });
    // Pitch : plonge progressivement — comme regarder sous la surface
    const pitch = interpolate(f, [0, 160, 293, 546], [0, 0, 22, 50], { extrapolateRight: "clamp" });
    // Zoom : s'approche doucement de la zone inexploitée
    const zoom = interpolate(f, [0, 200, 546], [6.0, 6.2, 6.6], { extrapolateRight: "clamp" });
    map.jumpTo({ center: [lon, lat], bearing, pitch, zoom });
  });

  return (
    <>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
    </>
  );
};

export const Beat8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  frameGlobal = frame;

  const PX = width * 0.5;
  const PY = height * 0.52;

  // Dot bleu-cyan — apparition spring
  const dotP = spring({ frame: frame - F_DOT, fps, config: { damping: 10, stiffness: 280 }, durationInFrames: 30 });
  const dotScale = interpolate(dotP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const dotOpacity = interpolate(dotP, [0, 0.1, 1], [0, 1, 1], { extrapolateRight: "clamp" });

  // Pulse — ralentit après Yakaar-Teranga (f161)
  const pulsePeriod = frame >= F_SHIFT
    ? interpolate(frame, [F_SHIFT, F_SHIFT + 120], [45, 90], { extrapolateRight: "clamp" })
    : 30;
  const sinePulse = Math.sin((frame / pulsePeriod) * Math.PI * 2);
  const dotGlow = interpolate(sinePulse, [-1, 1], [0.5, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Couleur : cyan → or légèrement après F_SHIFT (tension)
  const shiftP = spring({ frame: frame - F_SHIFT, fps, config: { damping: 20, stiffness: 120 }, durationInFrames: 45 });
  const colorMix = interpolate(shiftP, [0, 1], [0, 0.35], { extrapolateRight: "clamp" });
  // Interpolation RGB simple cyan → or
  const dotR = Math.round(163 + (200 - 163) * colorMix);
  const dotG = Math.round(210 + (169 - 210) * colorMix);
  const dotB = Math.round(230 + (81 - 230) * colorMix);
  const dotColor = `rgb(${dotR},${dotG},${dotB})`;

  // Rings pulsants
  const RING_PERIOD = frame >= F_SHIFT ? 110 : 70;
  const rings = [0, 1, 2].map((i) => {
    const localF = Math.max(0, frame - F_DOT - i * 35);
    const progress = (localF % RING_PERIOD) / RING_PERIOD;
    return {
      radius: progress * 180,
      opacity: interpolate(progress, [0, 0.12, 0.65, 1], [0, 0.45, 0.18, 0], { extrapolateRight: "clamp" }) * dotOpacity,
    };
  });

  // "?" overlay — apparition spring
  const questionP = spring({ frame: frame - F_QUESTION, fps, config: { damping: 20, stiffness: 120 }, durationInFrames: 26 });
  const questionScale = interpolate(questionP, [0, 1], [0.6, 1], { extrapolateRight: "clamp" });
  const questionOpacity = interpolate(questionP, [0, 1], [0, 0.45], { extrapolateRight: "clamp" });

  // "Il attend." — max opacity quasi-statique
  const attendP = spring({ frame: frame - F_ATTEND, fps, config: { damping: 25, stiffness: 200 }, durationInFrames: 20 });
  const attendOpacity = interpolate(attendP, [0, 1], [0.45, 0.62], { extrapolateRight: "clamp" });
  // Mise à jour de l'opacité du "?" après F_ATTEND
  const finalQuestionOpacity = frame >= F_ATTEND ? attendOpacity : questionOpacity;

  // Vibration au mot "capitales" (f413)
  const vibX = frame >= F_VIBRATION && frame < F_VIBRATION + 60
    ? Math.sin((frame - F_VIBRATION) * 1.8) * 4 * interpolate(frame, [F_VIBRATION, F_VIBRATION + 60], [1, 0], { extrapolateRight: "clamp" })
    : 0;
  const vibY = frame >= F_VIBRATION && frame < F_VIBRATION + 60
    ? Math.cos((frame - F_VIBRATION) * 2.3) * 3 * interpolate(frame, [F_VIBRATION, F_VIBRATION + 60], [1, 0], { extrapolateRight: "clamp" })
    : 0;

  // Label "YAKAAR-TERANGA" — slide from right à F_SHIFT
  const labelP = spring({ frame: frame - F_SHIFT, fps, config: { damping: 18, stiffness: 180 }, durationInFrames: 22 });
  const labelX = interpolate(labelP, [0, 1], [30, 0], { extrapolateRight: "clamp" });
  const labelOpacity = interpolate(labelP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // Sous-label "GAZ NATUREL NON EXPLOITÉ" — fade in après label
  const sublabelP = spring({ frame: frame - (F_SHIFT + 25), fps, config: { damping: 18, stiffness: 160 }, durationInFrames: 18 });
  const sublabelOpacity = interpolate(sublabelP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1520" }}>
      <MapboxYakaar />

      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 48%, rgba(13,21,32,0.45) 100%)", pointerEvents: "none" }} />

      {/* "?" overlay centré — semi-transparent, massive */}
      {questionScale > 0.01 && (
        <div style={{
          position: "absolute",
          left: 0, right: 0,
          top: height * 0.08,
          display: "flex", justifyContent: "center",
          opacity: finalQuestionOpacity,
          transform: `scale(${questionScale}) translateX(${vibX}px) translateY(${vibY}px)`,
          pointerEvents: "none",
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 480, fontWeight: 700,
            color: "#88929c",
            lineHeight: 1,
            filter: "blur(2px)",
            userSelect: "none",
          }}>
            ?
          </div>
        </div>
      )}

      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>

        {/* Rings */}
        {rings.map((ring, i) => (
          <circle key={i} cx={PX + vibX} cy={PY + vibY} r={ring.radius}
            stroke={CYAN} strokeWidth={1.2} fill="none" opacity={ring.opacity} />
        ))}

        {/* Dot Yakaar */}
        <circle cx={PX + vibX} cy={PY + vibY} r={16 * dotScale} fill={dotColor} opacity={dotGlow * dotOpacity} />
        <circle cx={PX + vibX} cy={PY + vibY} r={32 * dotScale} fill={dotColor} opacity={dotGlow * 0.15 * dotOpacity} />
      </svg>

      {/* Icone derrick SVG inline — cyan pour Yakaar (gaz non exploite) */}
      {labelOpacity > 0.01 && (
        <div style={{
          position: "absolute",
          left: PX + 32,
          top: PY - 128,
          opacity: labelOpacity * 0.80,
          transform: `translateX(${labelX}px)`,
          pointerEvents: "none",
        }}>
          <svg width="40" height="40" viewBox="0 0 44 44" fill="none">
            <line x1="22" y1="6" x2="8" y2="38" stroke={CYAN} strokeWidth="2" strokeLinecap="round"/>
            <line x1="22" y1="6" x2="36" y2="38" stroke={CYAN} strokeWidth="2" strokeLinecap="round"/>
            <line x1="22" y1="6" x2="22" y2="38" stroke={CYAN} strokeWidth="2" strokeLinecap="round"/>
            <line x1="6" y1="38" x2="38" y2="38" stroke={CYAN} strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="13" y1="22" x2="31" y2="22" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round"/>
            <rect x="18" y="4" width="8" height="4" rx="1" fill={CYAN} opacity="0.6"/>
            {/* Croix indiquant "non exploite" */}
            <line x1="17" y1="30" x2="27" y2="36" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="27" y1="30" x2="17" y2="36" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      )}

      {/* Label YAKAAR-TERANGA */}
      <div style={{
        position: "absolute",
        left: PX + 30,
        top: PY - 80,
        opacity: labelOpacity,
        transform: `translateX(${labelX}px)`,
        pointerEvents: "none",
      }}>
        <div style={{
          backgroundColor: "rgba(13,21,37,0.88)",
          borderLeft: `4px solid ${CYAN}`,
          padding: "8px 18px 6px 14px",
          display: "flex", flexDirection: "column", gap: 3,
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 22, fontWeight: 700,
            color: "#f2ebd9", letterSpacing: "0.14em",
            textTransform: "uppercase", whiteSpace: "nowrap",
          }}>
            YAKAAR-TERANGA
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 13, fontWeight: 500,
            color: CYAN, letterSpacing: "0.12em",
            textTransform: "uppercase",
            opacity: sublabelOpacity,
          }}>
            GAZ NATUREL — NON EXPLOITE
          </div>
        </div>
      </div>

      {/* "Il attend." — texte éditorial bas de frame, après F_ATTEND */}
      {frame >= F_ATTEND && (
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 80,
          display: "flex", justifyContent: "center",
          opacity: interpolate(frame, [F_ATTEND, F_ATTEND + 20], [0, 0.75], { extrapolateRight: "clamp" }),
          pointerEvents: "none",
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 18, fontWeight: 400,
            color: "rgba(242,235,217,0.70)", letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontStyle: "italic",
          }}>
            IL ATTEND.
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export default Beat8;
