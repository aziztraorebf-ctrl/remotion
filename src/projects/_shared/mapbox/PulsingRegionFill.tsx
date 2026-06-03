// PulsingRegionFill.tsx — Template N3.4 : territoire qui respire (opacity sin)
// Toute la zone pulse — different du dot pulse qui est un point.
// C'est le territoire entier qui est "vivant / sous tension".
// Supporte plusieurs zones avec des frequences/phases decalees.

import React, { useEffect, useRef } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  applyGeoAfriqueV5,
  MapboxBrandingHide,
  MAPBOX_STYLES,
} from "./MapboxBase";
import { countryFilter } from "./flagCanvas";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD   = "#c8a951";
const IVORY  = "#f2ebd9";
const NAVY   = "#16213a";
const RED    = "#e63946";

export interface PulsingCountry {
  iso: string;
  geoName?: string | string[]; // OBSOLETE : ignore, filtre par ISO
  boundaryIsos?: string[];
  // Couleur de la zone (fill-color)
  color?: string;
  // Opacite min et max du pulse
  opacityMin?: number;
  opacityMax?: number;
  // Periode du pulse en frames (defaut : 60f = 2s a 30fps)
  period?: number;
  // Phase de depart en radians (pour decaler les pulses entre pays)
  phaseOffset?: number;
  // Frame de debut
  at?: number;
  // Frontiere
  borderColor?: string;
  borderWidth?: number;
  // Lueur externe (glow) via un layer line+blur
  showGlow?: boolean;
  glowColor?: string;
  glowWidth?: number;
}

export interface PulsingRegionFillProps {
  countries: PulsingCountry[];
  secondary?: Array<{ iso: string; color: string; opacity?: number }>;
  center?: [number, number];
  baseZoom?: number;
  basePitch?: number;
  bearingStart?: number;
  bearingEnd?: number;
  children?: React.ReactNode;
}

export const PulsingRegionFill: React.FC<PulsingRegionFillProps> = ({
  countries,
  secondary = [],
  center = [20, 5],
  baseZoom = 4.0,
  basePitch = 0,
  bearingStart = -3,
  bearingEnd = 3,
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

        // Fond neutre
        const allIsos = countries.flatMap(c => [c.iso.toUpperCase(), ...(c.boundaryIsos ?? []).map(s => s.toUpperCase())]);
        if (!map.getLayer("pulse-neutral")) {
          map.addLayer({
            id: "pulse-neutral", type: "fill",
            source: "cb", "source-layer": "country_boundaries",
            filter: ["!", ["in", ["get", "iso_3166_1_alpha_3"], ["literal", allIsos]]],
            paint: { "fill-color": IVORY, "fill-opacity": 0.04 },
          });
        }

        // Pays secondaires
        for (const sec of secondary) {
          const secIso = sec.iso.toUpperCase();
          if (!map.getLayer(`pulse-sec-${secIso}`)) {
            map.addLayer({
              id: `pulse-sec-${secIso}`, type: "fill",
              source: "cb", "source-layer": "country_boundaries",
              filter: ["==", ["get", "iso_3166_1_alpha_3"], secIso],
              paint: { "fill-color": sec.color, "fill-opacity": sec.opacity ?? 0.30 },
            });
          }
        }

        // Layers pulse par pays
        for (const c of countries) {
          const iso = c.iso.toUpperCase();
          const color = c.color ?? RED;
          const borderColor = c.borderColor ?? color;

          const filter = countryFilter(iso, c.boundaryIsos ?? []);

          if (!map.getLayer(`pulse-fill-${iso}`)) {
            map.addLayer({
              id: `pulse-fill-${iso}`, type: "fill",
              source: "cb", "source-layer": "country_boundaries",
              filter,
              paint: { "fill-color": color, "fill-opacity": 0 },
            });
          }
          if (!map.getLayer(`pulse-border-${iso}`)) {
            map.addLayer({
              id: `pulse-border-${iso}`, type: "line",
              source: "cb", "source-layer": "country_boundaries",
              filter,
              paint: { "line-color": borderColor, "line-width": c.borderWidth ?? 1.8, "line-opacity": 0 },
            });
          }

          // Lueur externe (glow)
          if (c.showGlow) {
            const glowColor = c.glowColor ?? color;
            if (!map.getLayer(`pulse-glow-${iso}`)) {
              map.addLayer({
                id: `pulse-glow-${iso}`, type: "line",
                source: "cb", "source-layer": "country_boundaries",
                filter,
                paint: {
                  "line-color": glowColor,
                  "line-width": c.glowWidth ?? 10,
                  "line-opacity": 0,
                  "line-blur": 6,
                },
              });
            }
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
      const iso    = c.iso.toUpperCase();
      const at     = c.at ?? 0;
      const period = c.period ?? 60;
      const opMin  = c.opacityMin ?? 0.15;
      const opMax  = c.opacityMax ?? 0.55;
      const phase  = c.phaseOffset ?? 0;

      if (frame < at) continue;

      // Fade-in sur 20f au demarrage
      const fadeIn = Math.min(1, (frame - at) / 20);

      // Pulse sinusoidal
      const t = (frame - at) / period;
      const pulse = (Math.sin(t * Math.PI * 2 + phase) + 1) / 2; // 0→1
      const opacity = (opMin + (opMax - opMin) * pulse) * fadeIn;

      safe(`pulse-fill-${iso}`, "fill-opacity", opacity);
      safe(`pulse-border-${iso}`, "line-opacity", (0.5 + pulse * 0.5) * fadeIn);

      if (c.showGlow) {
        safe(`pulse-glow-${iso}`, "line-opacity", pulse * 0.4 * fadeIn);
      }
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

// Preview : zones de tension / points chauds africains
export const PulsingRegionFillPreview: React.FC = () => (
  <PulsingRegionFill
    center={[20, 12]} baseZoom={3.8}
    countries={[
      { iso: "MLI", color: "#e63946", at: 0,  period: 55, phaseOffset: 0,           opacityMin: 0.20, opacityMax: 0.65, showGlow: true, glowColor: "#e63946" },
      { iso: "BFA", color: "#e63946", at: 15, period: 60, phaseOffset: Math.PI/3,   opacityMin: 0.20, opacityMax: 0.60, showGlow: true },
      { iso: "NER", color: "#ff7800", at: 30, period: 70, phaseOffset: Math.PI/1.5, opacityMin: 0.15, opacityMax: 0.50 },
      { iso: "SSD", color: "#ff3333", at: 45, period: 50, phaseOffset: Math.PI/4,   opacityMin: 0.25, opacityMax: 0.65, showGlow: true },
    ]}
    secondary={[
      { iso: "SEN", color: "#006233", opacity: 0.25 },
      { iso: "NGA", color: "#008751", opacity: 0.20 },
      { iso: "GHA", color: "#006b3f", opacity: 0.15 },
    ]}
  />
);
