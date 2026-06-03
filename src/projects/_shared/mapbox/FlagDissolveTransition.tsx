// FlagDissolveTransition.tsx — Template N3.2 : crossfade entre deux fill-patterns
// Un pays passe d'un drapeau a un autre (territoire conteste, changement d'influence, BRICS/AES...).
// Technique : 2 layers superposes, opacite A→(1-t) et B→t, canvas pur pour les deux.

import React, { useEffect, useRef } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  applyGeoAfriqueV5,
  MapboxBrandingHide,
  MAPBOX_STYLES,
} from "./MapboxBase";
import { pushFlagToMap, countryFilter } from "./flagCanvas";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD   = "#c8a951";
const IVORY  = "#f2ebd9";
const NAVY   = "#16213a";

export interface DissolveStep {
  iso: string;
  geoName?: string | string[]; // OBSOLETE : ignore, filtre par ISO
  boundaryIsos?: string[];
  // Flag A (depart) et B (arrivee)
  fromIso: string;
  toIso: string;
  // Frame local ou le crossfade commence
  dissolveAt: number;
  // Duree du crossfade (frames)
  dissolveDur?: number;
  // Opacite max
  opacity?: number;
  borderColor?: string;
}

export interface FlagDissolveTransitionProps {
  countries: DissolveStep[];
  secondary?: Array<{ iso: string; color: string }>;
  center?: [number, number];
  baseZoom?: number;
  basePitch?: number;
  bearingStart?: number;
  bearingEnd?: number;
  flagCanvasSize?: number;
  children?: React.ReactNode;
}

export const FlagDissolveTransition: React.FC<FlagDissolveTransitionProps> = ({
  countries,
  secondary = [],
  center = [20, 5],
  baseZoom = 4.0,
  basePitch = 0,
  bearingStart = -3,
  bearingEnd = 3,
  flagCanvasSize = 512,
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const setupRef     = useRef(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center, zoom: baseZoom, pitch: basePitch, bearing: bearingStart,
      interactive: false, attributionControl: false, fadeDuration: 0,
    });

    map.on("style.load", () => {
      try {
        (map as unknown as { setProjection: (p: string) => void }).setProjection("mercator");
        applyGeoAfriqueV5(map);

        if (!map.getSource("cb")) {
          map.addSource("cb", { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" });
        }

        // Pre-injecter tous les drapeaux necessaires
        const injected = new Set<string>();
        for (const c of countries) {
          if (!injected.has(c.fromIso)) { pushFlagToMap(map, c.fromIso, flagCanvasSize); injected.add(c.fromIso); }
          if (!injected.has(c.toIso))   { pushFlagToMap(map, c.toIso, flagCanvasSize);   injected.add(c.toIso); }
        }

        // Fond neutre
        const allIsos = countries.flatMap(c => [c.iso.toUpperCase(), ...(c.boundaryIsos ?? []).map(s => s.toUpperCase())]);
        if (!map.getLayer("dis-neutral")) {
          map.addLayer({
            id: "dis-neutral", type: "fill",
            source: "cb", "source-layer": "country_boundaries",
            filter: ["!", ["in", ["get", "iso_3166_1_alpha_3"], ["literal", allIsos]]],
            paint: { "fill-color": IVORY, "fill-opacity": 0.04 },
          });
        }

        // Pays secondaires
        for (const sec of secondary) {
          const secIso = sec.iso.toUpperCase();
          if (!map.getLayer(`dis-sec-${secIso}`)) {
            map.addLayer({
              id: `dis-sec-${secIso}`, type: "fill",
              source: "cb", "source-layer": "country_boundaries",
              filter: ["==", ["get", "iso_3166_1_alpha_3"], secIso],
              paint: { "fill-color": sec.color, "fill-opacity": 0.45 },
            });
          }
        }

        // 2 layers par pays : from et to
        for (const c of countries) {
          const iso = c.iso.toUpperCase();
          const filter = countryFilter(iso, c.boundaryIsos ?? []);

          if (!map.getLayer(`dis-from-${iso}`)) {
            map.addLayer({
              id: `dis-from-${iso}`, type: "fill",
              source: "cb", "source-layer": "country_boundaries",
              filter,
              paint: { "fill-pattern": `flag-${c.fromIso.toUpperCase()}`, "fill-opacity": 0 },
            });
          }
          if (!map.getLayer(`dis-to-${iso}`)) {
            map.addLayer({
              id: `dis-to-${iso}`, type: "fill",
              source: "cb", "source-layer": "country_boundaries",
              filter,
              paint: { "fill-pattern": `flag-${c.toIso.toUpperCase()}`, "fill-opacity": 0 },
            });
          }
          if (!map.getLayer(`dis-border-${iso}`)) {
            map.addLayer({
              id: `dis-border-${iso}`, type: "line",
              source: "cb", "source-layer": "country_boundaries",
              filter,
              paint: { "line-color": c.borderColor ?? GOLD, "line-width": 2.0, "line-opacity": 0 },
            });
          }
        }

        setupRef.current = true;
      } catch (_e) {}
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; setupRef.current = false; };
  }, []);

  // Engine frame
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const bearing = interpolate(frame, [0, durationInFrames], [bearingStart, bearingEnd], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    map.jumpTo({ center, zoom: baseZoom, pitch: basePitch, bearing });

    if (!setupRef.current) return;

    const safe = (id: string, prop: string, val: unknown) => {
      try { if (map.getLayer(id)) (map.setPaintProperty as (a: string, b: string, c: unknown) => void)(id, prop, val); } catch (_e) {}
    };

    for (const c of countries) {
      const iso = c.iso.toUpperCase();
      const maxOp = c.opacity ?? 0.80;
      const dur   = c.dissolveDur ?? 45;

      // Phase 1 : fade-in du drapeau FROM (0→dissolveAt)
      const introFrames = Math.min(40, c.dissolveAt);
      const introOp = Math.min(1, frame / Math.max(1, introFrames));

      if (frame < c.dissolveAt) {
        safe(`dis-from-${iso}`, "fill-opacity", introOp * maxOp);
        safe(`dis-to-${iso}`,   "fill-opacity", 0);
        safe(`dis-border-${iso}`, "line-opacity", introOp);
        continue;
      }

      // Phase 2 : crossfade
      const dt = Math.min(1, (frame - c.dissolveAt) / dur);
      const eased = 1 - Math.pow(1 - dt, 2); // easeOut

      safe(`dis-from-${iso}`, "fill-opacity", (1 - eased) * maxOp);
      safe(`dis-to-${iso}`,   "fill-opacity", eased * maxOp);
      safe(`dis-border-${iso}`, "line-opacity", 1.0);
    }
  });

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, backgroundColor: NAVY }} />
      <MapboxBrandingHide />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(to bottom,rgba(22,33,58,0.30) 0%,rgba(22,33,58,0.0) 40%,rgba(22,33,58,0.25) 100%)",
      }} />
      {children}
    </AbsoluteFill>
  );
};

// Preview : Mali & Burkina passent du drapeau France au drapeau Russie (AES)
export const FlagDissolveTransitionPreview: React.FC = () => (
  <FlagDissolveTransition
    center={[-5, 15]} baseZoom={4.5}
    countries={[
      { iso: "MLI", fromIso: "FRA", toIso: "RUS", dissolveAt: 60, dissolveDur: 50 },
      { iso: "BFA", fromIso: "FRA", toIso: "RUS", dissolveAt: 90, dissolveDur: 50 },
    ]}
    secondary={[
      { iso: "SEN", color: "#006233" },
      { iso: "NGA", color: "#008751" },
    ]}
  />
);
