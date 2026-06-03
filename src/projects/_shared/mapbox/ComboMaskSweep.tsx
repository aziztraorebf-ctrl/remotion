/**
 * ComboMaskSweep — HOOK combine : KineticMaskSlam → SweepRevealTerritory.
 *
 * Methode Aziz : combiner nos primitives pour creer des hooks originaux (comme FiberOptic).
 * Progression narrative : CHOC CHIFFRE → REVELATION CARTE → FOCUS PAYS (faisceau).
 *
 * Phases (@30fps) :
 *   0 → revealAt+30   : chiffre geant slamme, carte visible DANS le texte, zoom dans le "0"
 *                       qui revele la carte complete (= KineticMaskSlam)
 *   sweepAt → +sweepDur : un faisceau lumineux balaye le pays focus et revele sa couleur gold
 *                         (= SweepRevealTerritory), label apparait
 *
 * Une seule Map Mapbox en drift continu. Overlays enchaines.
 *
 * Usage :
 *   <ComboMaskSweep center={[-7,31]} baseZoom={4.6} bigText="70%"
 *     geoName={["Morocco","W. Sahara"]} boundaryIsos={["ESH"]} label="MAROC" />
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

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD = "#c8a951";
const IVORY = "#f2ebd9";
const NAVY = "#16213a";
const TOPO_PATH = "_shared/geo-data/countries-50m.json";

export interface ComboMaskSweepProps {
  center: [number, number];
  baseZoom?: number;
  bigText: string;
  subText?: string;
  geoName: string | string[];
  boundaryIsos?: string[];
  label: string;
  accentColor?: string;
  slamAt?: number;
  revealAt?: number;
  sweepAt?: number;
  sweepDur?: number;
  durationFrames?: number;
}

export const ComboMaskSweep: React.FC<ComboMaskSweepProps> = ({
  center,
  baseZoom = 4.6,
  bigText,
  subText,
  geoName,
  boundaryIsos = [],
  label,
  accentColor = GOLD,
  slamAt = 4,
  revealAt = 38,
  sweepAt = 74,
  sweepDur = 44,
  durationFrames = 150,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const isVertical = height > width;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("ComboMaskSweep init"));
  const [ready, setReady] = useState(false);
  const [rings, setRings] = useState<number[][][]>([]);
  const [geoHandle] = useState(() => delayRender("ComboMaskSweep geo"));
  const [pathData, setPathData] = useState("");
  const [bbox, setBbox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const effZoom = baseZoom + (isVertical ? 0 : -0.4);
  const borderId = "combo-border";

  // geometrie
  useEffect(() => {
    let cancelled = false;
    fetch(staticFile(TOPO_PATH))
      .then((r) => r.json())
      .then((topo) => {
        if (cancelled) return;
        const fc = feature(topo, topo.objects.countries) as unknown as { features: any[] };
        const names = Array.isArray(geoName) ? geoName : [geoName];
        const rs: number[][][] = [];
        for (const nm of names) {
          const f = fc.features.find((x) => x.properties?.name === nm);
          if (!f) continue;
          const g = f.geometry;
          if (g.type === "Polygon") rs.push(...(g.coordinates as number[][][]));
          else if (g.type === "MultiPolygon")
            rs.push(...(g.coordinates as number[][][][]).map((p) => p[0]));
        }
        setRings(rs);
        continueRender(geoHandle);
      })
      .catch(() => continueRender(geoHandle));
    return () => {
      cancelled = true;
    };
  }, [geoName, geoHandle]);

  // init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      return;
    }
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center, zoom: effZoom, pitch: 0, bearing: 0,
      interactive: false, attributionControl: false,
      preserveDrawingBuffer: true, fadeDuration: 0,
    });
    mapRef.current = map;
    map.on("style.load", () => {
      try { (map as any).setProjection?.("mercator"); } catch {}
      applyGeoAfriqueV5(map);
      if (!map.getSource("cb-source")) {
        map.addSource("cb-source", { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" });
      }
      const focus = [...boundaryIsos];
      // bordure du pays focus (allumee a la phase sweep)
      if (!map.getLayer(borderId)) {
        map.addLayer({
          id: borderId, type: "line", source: "cb-source",
          "source-layer": "country_boundaries",
          filter: ["in", ["get", "iso_3166_1_alpha_3"], ["literal", focus.length ? focus : ["___"]]],
          paint: { "line-color": accentColor, "line-width": 2.5, "line-opacity": 0 },
        });
      }
      setReady(true);
      continueRender(handle);
    });
    return () => { map.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // drift + reprojection + bordure
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    const driftBearing = interpolate(frame, [0, durationFrames], [-4, 4]);
    const driftZoom = effZoom + interpolate(frame, [0, durationFrames], [0, 0.2]);
    map.jumpTo({ center, zoom: driftZoom, bearing: driftBearing, pitch: 0 });

    if (rings.length) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      const parts: string[] = [];
      for (const ring of rings) {
        let seg = "";
        ring.forEach((coord, i) => {
          const p = map.project(coord as [number, number]);
          if (p.x < minX) minX = p.x; if (p.y < minY) minY = p.y;
          if (p.x > maxX) maxX = p.x; if (p.y > maxY) maxY = p.y;
          seg += `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        });
        seg += "Z"; parts.push(seg);
      }
      setPathData(parts.join(" "));
      setBbox({ x: minX, y: minY, w: maxX - minX, h: maxY - minY });
    }

    const borderOp = interpolate(frame - sweepAt, [0, 16], [0, 0.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    try { map.setPaintProperty(borderId, "line-opacity", borderOp); } catch {}
  }, [frame, ready, center, effZoom, durationFrames, sweepAt, rings]);

  // ── Phase 1 : KineticMaskSlam ────────────────────────────────────────────────
  const slam = spring({ frame: frame - slamAt, fps, config: { damping: 11, stiffness: 200, mass: 0.8 }, durationInFrames: 20 });
  const revealProg = interpolate(frame - revealAt, [0, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textScale = slam * (1 + revealProg * revealProg * 32);
  const veilOpacity = interpolate(frame - revealAt, [16, 28], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const maskActive = frame < revealAt + 28;
  const bigFontSize = isVertical ? width * 0.42 : height * 0.5;

  // ── Phase 2 : Sweep ──────────────────────────────────────────────────────────
  const sweepT = interpolate(frame - sweepAt, [0, sweepDur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelOp = interpolate(frame - sweepAt, [sweepDur * 0.6, sweepDur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const globalOpacity = interpolate(frame, [durationFrames - 10, durationFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const maskId = "combo-textmask";
  const revealGradId = "combo-reveal";
  const beamGradId = "combo-beam";
  const clipId = "combo-clip";
  const labelSize = isVertical ? 84 : 64;

  // sweep stops
  const front = sweepT, soft = 0.06;
  const revealStops = [{ o: 0, op: 1 }, { o: Math.max(0, front - soft), op: 1 }, { o: Math.min(1, front), op: 0 }, { o: 1, op: 0 }];
  const gradDir = isVertical ? { x1: "0%", y1: "0%", x2: "0%", y2: "100%" } : { x1: "0%", y1: "0%", x2: "100%", y2: "0%" };
  const beamHalf = 0.09;

  return (
    <AbsoluteFill style={{ background: NAVY, opacity: globalOpacity }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      <MapboxBrandingHide />

      {/* Phase 1 — voile texte-masque */}
      {maskActive && veilOpacity > 0.01 && (
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <defs>
            <mask id={maskId}>
              <rect x="0" y="0" width={width} height={height} fill="white" />
              <g transform={`translate(${width / 2} ${height / 2}) scale(${textScale}) translate(${-width / 2} ${-height / 2})`}>
                <text x={width / 2} y={height / 2} textAnchor="middle" dominantBaseline="central" fontFamily="'Bebas Neue','Impact',sans-serif" fontWeight={900} fontSize={bigFontSize} fill="black">{bigText}</text>
              </g>
            </mask>
          </defs>
          <rect x="0" y="0" width={width} height={height} fill={NAVY} opacity={veilOpacity} mask={`url(#${maskId})`} />
        </svg>
      )}

      {/* Phase 2 — sweep gold clippe dans le pays */}
      {pathData && bbox && frame >= sweepAt - 4 && (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <defs>
            <clipPath id={clipId}><path d={pathData} /></clipPath>
            <linearGradient id={revealGradId} {...gradDir}>
              {revealStops.map((s, i) => <stop key={i} offset={`${s.o * 100}%`} stopColor={accentColor} stopOpacity={s.op} />)}
            </linearGradient>
            <linearGradient id={beamGradId} {...gradDir}>
              <stop offset={`${Math.max(0, (sweepT - beamHalf) * 100)}%`} stopColor={IVORY} stopOpacity={0} />
              <stop offset={`${sweepT * 100}%`} stopColor={IVORY} stopOpacity={0.9} />
              <stop offset={`${Math.min(100, (sweepT + beamHalf) * 100)}%`} stopColor={IVORY} stopOpacity={0} />
            </linearGradient>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            <rect x={bbox.x} y={bbox.y} width={bbox.w} height={bbox.h} fill={`url(#${revealGradId})`} opacity={0.55} />
            {sweepT > 0 && sweepT < 1 && <rect x={bbox.x} y={bbox.y} width={bbox.w} height={bbox.h} fill={`url(#${beamGradId})`} />}
          </g>
        </svg>
      )}

      {/* Label */}
      <div style={{ position: "absolute", bottom: isVertical ? height * 0.12 : height * 0.08, left: 0, right: 0, textAlign: "center", opacity: labelOp }}>
        <span style={{ color: IVORY, fontSize: labelSize, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'Bebas Neue','Impact',sans-serif", textShadow: "0 4px 24px rgba(0,0,0,0.7)" }}>{label}</span>
        {subText && (
          <div style={{ marginTop: 10 }}>
            <span style={{ color: accentColor, fontSize: isVertical ? 32 : 28, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'IBM Plex Mono',monospace" }}>{subText}</span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export default ComboMaskSweep;
