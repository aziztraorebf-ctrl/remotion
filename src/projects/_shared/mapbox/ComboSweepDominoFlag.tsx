/**
 * ComboSweepDominoFlag — HOOK combine : Sweep → Domino → Flag.
 *
 * Methode Aziz (assemblage de primitives). Progression : DECLENCHEUR → PROPAGATION → IDENTITE.
 *   Phase 1 (sweep)  : un faisceau allume le pays SOURCE (gold)
 *   Phase 2 (domino) : la couleur contamine les voisins par vagues (fill gold qui monte)
 *   Phase 3 (flags)  : chaque pays contamine recoit SON drapeau (clip dans la silhouette)
 *
 * Pilote par des VAGUES (waves[][]) : waves[0]=source, waves[1]=voisins... Les drapeaux
 * sont fournis par iso. Une seule Map en drift.
 *
 * Usage :
 *   <ComboSweepDominoFlag center={[3,16]} baseZoom={3.0}
 *     waves={[["MLI"],["BFA","NER"],["DZA","MRT"]]}
 *     flags={{MLI:{geoName:"Mali",code:"ml"}, BFA:{geoName:"Burkina Faso",code:"bf"}, ...}} />
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

export interface SDFFlag {
  geoName: string | string[];
  code: string; // ISO-2 flagcdn
}

export interface ComboSweepDominoFlagProps {
  center: [number, number];
  baseZoom?: number;
  waves: string[][];
  /** par ISO-3 : geometrie + code drapeau */
  flags: Record<string, SDFFlag>;
  accentColor?: string;
  /** frame de demarrage */
  startAt?: number;
  /** delai entre vagues */
  waveGap?: number;
  /** offset du drapeau apres la couleur (frames) */
  flagDelay?: number;
  driftAmplitude?: number;
  durationFrames?: number;
}

export const ComboSweepDominoFlag: React.FC<ComboSweepDominoFlagProps> = ({
  center,
  baseZoom = 3.0,
  waves,
  flags,
  accentColor = GOLD,
  startAt = 8,
  waveGap = 22,
  flagDelay = 16,
  driftAmplitude = 0.5,
  durationFrames = 200,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("ComboSDF init"));
  const [ready, setReady] = useState(false);
  const [rings, setRings] = useState<Record<string, number[][][]>>({});
  const [geoHandle] = useState(() => delayRender("ComboSDF geo"));
  const [proj, setProj] = useState<Record<string, { d: string; bbox: { x: number; y: number; w: number; h: number } }>>({});

  const effZoom = baseZoom + (isVertical ? 0 : -0.4);
  const isoWave: Record<string, number> = {};
  waves.forEach((w, wi) => w.forEach((iso) => (isoWave[iso] = wi)));
  const allIso = Object.keys(isoWave);

  const fillId = (iso: string) => `sdf-fill-${iso}`;
  const lineId = (iso: string) => `sdf-line-${iso}`;

  // geometries
  useEffect(() => {
    let cancelled = false;
    fetch(staticFile(TOPO_PATH))
      .then((r) => r.json())
      .then((topo) => {
        if (cancelled) return;
        const fc = feature(topo, topo.objects.countries) as unknown as { features: any[] };
        const out: Record<string, number[][][]> = {};
        for (const iso of allIso) {
          const fl = flags[iso];
          if (!fl) continue;
          const names = Array.isArray(fl.geoName) ? fl.geoName : [fl.geoName];
          const rs: number[][][] = [];
          for (const nm of names) {
            const f = fc.features.find((x) => x.properties?.name === nm);
            if (!f) continue;
            const g = f.geometry;
            if (g.type === "Polygon") rs.push(...(g.coordinates as number[][][]));
            else if (g.type === "MultiPolygon") rs.push(...(g.coordinates as number[][][][]).map((p) => p[0]));
          }
          out[iso] = rs;
        }
        setRings(out);
        continueRender(geoHandle);
      })
      .catch(() => continueRender(geoHandle));
    return () => { cancelled = true; };
  }, [geoHandle]);

  // flag urls
  const flagUrl = (iso: string) => `https://flagcdn.com/w2560/${flags[iso]?.code}.png`;

  // init map
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
      if (!map.getLayer("sdf-neighbors")) {
        map.addLayer({ id: "sdf-neighbors", type: "fill", source: "cb-source", "source-layer": "country_boundaries",
          filter: ["!", ["in", ["get", "iso_3166_1_alpha_3"], ["literal", allIso]]],
          paint: { "fill-color": IVORY, "fill-opacity": 0.04 } });
      }
      for (const iso of allIso) {
        if (!map.getLayer(fillId(iso))) {
          map.addLayer({ id: fillId(iso), type: "fill", source: "cb-source", "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], iso], paint: { "fill-color": accentColor, "fill-opacity": 0 } });
        }
        if (!map.getLayer(lineId(iso))) {
          map.addLayer({ id: lineId(iso), type: "line", source: "cb-source", "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], iso], paint: { "line-color": accentColor, "line-width": 2, "line-opacity": 0 } });
        }
      }
      setReady(true);
      continueRender(handle);
    });
    return () => { map.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // drift + propagation + reprojection
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    const driftT = interpolate(frame, [0, durationFrames], [-1, 1]);
    map.jumpTo({
      center: [center[0] + (isVertical ? 0 : driftT * driftAmplitude), center[1] + (isVertical ? driftT * driftAmplitude : 0)],
      zoom: effZoom + interpolate(frame, [0, durationFrames], [0, 0.08]), bearing: 0, pitch: 0,
    });

    for (const iso of allIso) {
      const at = startAt + isoWave[iso] * waveGap;
      const rel = frame - at;
      const fillOp = interpolate(rel, [0, 6, 16], [0, 0.55, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const lineOp = interpolate(rel, [0, 8], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      try {
        map.setPaintProperty(fillId(iso), "fill-opacity", fillOp);
        map.setPaintProperty(lineId(iso), "line-opacity", lineOp);
      } catch {}
    }

    // reprojection des silhouettes (pour les drapeaux)
    const next: typeof proj = {};
    for (const iso of allIso) {
      const rs = rings[iso];
      if (!rs || !rs.length) continue;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      const parts: string[] = [];
      for (const ring of rs) {
        let seg = "";
        ring.forEach((coord, i) => {
          const p = map.project(coord as [number, number]);
          if (p.x < minX) minX = p.x; if (p.y < minY) minY = p.y;
          if (p.x > maxX) maxX = p.x; if (p.y > maxY) maxY = p.y;
          seg += `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        });
        seg += "Z"; parts.push(seg);
      }
      next[iso] = { d: parts.join(" "), bbox: { x: minX, y: minY, w: maxX - minX, h: maxY - minY } };
    }
    setProj(next);
  }, [frame, ready, center, effZoom, durationFrames, isVertical, driftAmplitude, rings]);

  const globalOpacity = interpolate(frame, [durationFrames - 10, durationFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: NAVY, opacity: globalOpacity }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      <MapboxBrandingHide />

      {/* Phase 3 : drapeaux clippes apparaissent apres la couleur (flagDelay) */}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <defs>
          {allIso.map((iso) => proj[iso] ? <clipPath key={iso} id={`sdf-clip-${iso}`}><path d={proj[iso].d} /></clipPath> : null)}
        </defs>
        {allIso.map((iso) => {
          const pr = proj[iso];
          if (!pr) return null;
          const at = startAt + isoWave[iso] * waveGap + flagDelay;
          const op = interpolate(frame - at, [0, 12], [0, 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          if (op <= 0.01) return null;
          return (
            <image key={iso} href={flagUrl(iso)} x={pr.bbox.x} y={pr.bbox.y} width={pr.bbox.w} height={pr.bbox.h}
              preserveAspectRatio="xMidYMid slice" clipPath={`url(#sdf-clip-${iso})`} opacity={op} />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

export default ComboSweepDominoFlag;
