/**
 * ComboFiberAuraPopup — HOOK combine : FiberOptic → Aura → GlassPopup.
 *
 * Methode Aziz (assemblage). Progression data storytelling : OU → QUOI SE PASSE → COMBIEN.
 *   Phase 1 (fiber) : la frontiere du pays se trace en laser dore (ou)
 *   Phase 2 (aura)  : une onde de choc concentrique jaillit d'un point geo precis (quoi)
 *   Phase 3 (popup) : un encart glassmorphism relie au point affiche la donnee (combien)
 *
 * Une seule Map en drift. Reprojection frame-driven pour le trace + map.project pour le point.
 *
 * Usage :
 *   <ComboFiberAuraPopup countryIso="SEN" geoName="Senegal" center={[-14.5,14.5]} baseZoom={5.8}
 *     label="SENEGAL" point={[-17.15,13.45]} popupTitle="SANGOMAR" popupValue="100 000 b/j" />
 *
 * IMPORTANT : render via scripts/render-mapbox.sh (WebGL headless).
 */

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { feature } from "topojson-client";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { applyGeoAfriqueV5, MapboxBrandingHide } from "./MapboxBase";
import { TypewriterText } from "../components/TypewriterText";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD = "#c8a951";
const IVORY = "#f2ebd9";
const NAVY = "#16213a";
const TOPO_PATH = "_shared/geo-data/countries-50m.json";

export interface ComboFiberAuraPopupProps {
  countryIso: string;
  geoName: string | string[];
  center: [number, number];
  baseZoom?: number;
  label: string;
  point: [number, number];
  popupTitle: string;
  popupValue?: string;
  accentColor?: string;
  drawAt?: number;
  drawDur?: number;
  auraAt?: number;
  popupAt?: number;
  durationFrames?: number;
}

export const ComboFiberAuraPopup: React.FC<ComboFiberAuraPopupProps> = ({
  countryIso,
  geoName,
  center,
  baseZoom = 5.8,
  label,
  point,
  popupTitle,
  popupValue,
  accentColor = GOLD,
  drawAt = 6,
  drawDur = 40,
  auraAt = 50,
  popupAt = 66,
  durationFrames = 150,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const isVertical = height > width;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("ComboFAP init"));
  const [ready, setReady] = useState(false);
  const [rings, setRings] = useState<number[][][]>([]);
  const [geoHandle] = useState(() => delayRender("ComboFAP geo"));
  const [paths, setPaths] = useState<{ d: string; len: number }[]>([]);
  const [ptScreen, setPtScreen] = useState<{ x: number; y: number } | null>(null);

  const effZoom = baseZoom + (isVertical ? 0 : -0.5);
  const fillId = `fap-fill-${countryIso}`;

  useEffect(() => {
    let cancelled = false;
    fetch(staticFile(TOPO_PATH)).then((r) => r.json()).then((topo) => {
      if (cancelled) return;
      const fc = feature(topo, topo.objects.countries) as unknown as { features: any[] };
      const names = Array.isArray(geoName) ? geoName : [geoName];
      const rs: number[][][] = [];
      for (const nm of names) {
        const f = fc.features.find((x) => x.properties?.name === nm);
        if (!f) continue;
        const g = f.geometry;
        if (g.type === "Polygon") rs.push(...(g.coordinates as number[][][]));
        else if (g.type === "MultiPolygon") rs.push(...(g.coordinates as number[][][][]).map((p) => p[0]));
      }
      setRings(rs);
      continueRender(geoHandle);
    }).catch(() => continueRender(geoHandle));
    return () => { cancelled = true; };
  }, [geoName, geoHandle]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) { continueRender(handle); return; }
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current, style: "mapbox://styles/mapbox/dark-v11",
      center, zoom: effZoom, pitch: 0, bearing: 0,
      interactive: false, attributionControl: false, preserveDrawingBuffer: true, fadeDuration: 0,
    });
    mapRef.current = map;
    map.on("style.load", () => {
      try { (map as any).setProjection?.("mercator"); } catch {}
      applyGeoAfriqueV5(map);
      if (!map.getSource("cb-source")) map.addSource("cb-source", { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" });
      if (!map.getLayer("fap-neighbors")) {
        map.addLayer({ id: "fap-neighbors", type: "fill", source: "cb-source", "source-layer": "country_boundaries",
          filter: ["!=", ["get", "iso_3166_1_alpha_3"], countryIso], paint: { "fill-color": IVORY, "fill-opacity": 0.05 } });
      }
      if (!map.getLayer(fillId)) {
        map.addLayer({ id: fillId, type: "fill", source: "cb-source", "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], countryIso], paint: { "fill-color": accentColor, "fill-opacity": 0 } });
      }
      setReady(true);
      continueRender(handle);
    });
    return () => { map.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    const driftBearing = interpolate(frame, [0, durationFrames], [-2.5, 2.5]);
    map.jumpTo({ center, zoom: effZoom + interpolate(frame, [0, durationFrames], [0, 0.12]), bearing: driftBearing, pitch: 0 });

    if (rings.length) {
      const out: { d: string; len: number }[] = [];
      for (const ring of rings) {
        let seg = ""; let len = 0; let prev: { x: number; y: number } | null = null;
        ring.forEach((coord, i) => {
          const p = map.project(coord as [number, number]);
          seg += `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
          if (prev) len += Math.hypot(p.x - prev.x, p.y - prev.y);
          prev = p;
        });
        seg += "Z"; out.push({ d: seg, len: Math.max(1, len) });
      }
      setPaths(out);
    }
    // fill interieur monte apres le trace
    const afterDraw = frame - (drawAt + drawDur);
    const fillOp = interpolate(afterDraw, [0, 16], [0, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    try { map.setPaintProperty(fillId, "fill-opacity", fillOp); } catch {}

    const s = map.project(point);
    setPtScreen({ x: s.x, y: s.y });
  }, [frame, ready, center, effZoom, durationFrames, drawAt, drawDur, point, rings]);

  const drawT = interpolate(frame - drawAt, [0, drawDur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const globalOpacity = interpolate(frame, [durationFrames - 10, durationFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelOp = interpolate(frame - drawAt, [drawDur * 0.7, drawDur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // popup
  const popupSpring = spring({ frame: frame - popupAt, fps, config: { damping: 14, stiffness: 130 }, durationInFrames: 16 });
  const popOffset = isVertical ? 200 : 240;
  const labelSize = isVertical ? 70 : 56;
  const glowId = "fap-glow";

  return (
    <AbsoluteFill style={{ background: NAVY, opacity: globalOpacity }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      <MapboxBrandingHide />

      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <defs>
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Phase 1 — trace fibre optique */}
        {paths.map((p, i) => (
          <path key={i} d={p.d} fill="none" stroke={accentColor} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={`${p.len * drawT} ${p.len}`} filter={`url(#${glowId})`} opacity={0.95} />
        ))}

        {/* Phase 2 — onde de choc a l'epicentre */}
        {ptScreen && frame >= auraAt && [0, 1, 2].map((i) => {
          const t = ((frame - auraAt - i * 7) % 45) / 45;
          if (t < 0) return null;
          const r = interpolate(t, [0, 1], [8, 70]);
          const op = interpolate(t, [0, 0.2, 1], [0, 0.6, 0]);
          return <circle key={i} cx={ptScreen.x} cy={ptScreen.y} r={r} fill="none" stroke={accentColor} strokeWidth={2} opacity={op} />;
        })}
        {ptScreen && frame >= auraAt && <circle cx={ptScreen.x} cy={ptScreen.y} r={4} fill={accentColor} opacity={interpolate(frame - auraAt, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />}

        {/* Phase 3 — ligne de liaison vers popup */}
        {ptScreen && popupSpring > 0.05 && (
          <line x1={ptScreen.x} y1={ptScreen.y} x2={ptScreen.x} y2={ptScreen.y - popOffset * popupSpring}
            stroke={accentColor} strokeWidth={1.5} strokeOpacity={0.8} />
        )}
      </svg>

      {/* Phase 3 — encart glassmorphism (textes typewriter) */}
      {ptScreen && popupSpring > 0.05 && (
        <div style={{
          position: "absolute", left: ptScreen.x, top: ptScreen.y - popOffset,
          transform: `translate(-50%,-50%) scale(${popupSpring})`, opacity: popupSpring, pointerEvents: "none",
          background: "rgba(22,33,58,0.6)", border: `1px solid ${accentColor}`, borderRadius: 8,
          padding: isVertical ? "14px 22px" : "12px 20px", minWidth: isVertical ? 190 : 170,
          boxShadow: "0 8px 32px rgba(0,0,0,0.45)", textAlign: "center",
        }}>
          <TypewriterText text={popupTitle} startAt={popupAt + 6} speed={1.5} as="div"
            style={{ color: accentColor, fontSize: isVertical ? 28 : 22, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'IBM Plex Mono',monospace" }} />
          {popupValue && (
            <TypewriterText text={popupValue} startAt={popupAt + 6 + popupTitle.length * 1.5 + 4} speed={1.5} as="div"
              style={{ color: IVORY, fontSize: isVertical ? 40 : 32, fontWeight: 800, marginTop: 6, fontFamily: "'Bebas Neue','Impact',sans-serif" }} />
          )}
        </div>
      )}

      {/* Label pays */}
      <div style={{ position: "absolute", bottom: isVertical ? height * 0.1 : height * 0.07, left: 0, right: 0, textAlign: "center", opacity: labelOp }}>
        <span style={{ color: IVORY, fontSize: labelSize, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'Bebas Neue','Impact',sans-serif", textShadow: "0 4px 24px rgba(0,0,0,0.7)" }}>{label}</span>
      </div>
    </AbsoluteFill>
  );
};

export default ComboFiberAuraPopup;
