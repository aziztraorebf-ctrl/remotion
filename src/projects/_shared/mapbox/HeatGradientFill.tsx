// HeatGradientFill.tsx — Template N2.2 : choropleth dynamique
// La couleur d'un pays "monte" d'une valeur (intensite 0→1) selon la voix/la narration.
// Usage narratif : "la production monte progressivement" → la couleur se rechauffe
// Chaque pays a sa propre couleur (fill-color rgba interpolee frame par frame).

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

// Palette choropleth : de "froid" (tres faible) a "chaud" (tres fort)
// Ces couleurs s'adaptent a la thematique (petrole, richesse, tension...)
export interface HeatPalette {
  low:  string;   // intensite faible — ex: "#1a3a5c"
  mid:  string;   // intensite moyenne — ex: "#c8a951"
  high: string;   // intensite elevee — ex: "#e63946"
}

export const PALETTE_PETROLE: HeatPalette  = { low: "#1a3a5c", mid: "#c8a951", high: "#e63946" };
export const PALETTE_RICHESSE: HeatPalette = { low: "#1a2e1a", mid: "#4a9e4a", high: "#c8a951" };
export const PALETTE_TENSION: HeatPalette  = { low: "#1a1a3c", mid: "#7a4ac8", high: "#e63946" };
export const PALETTE_GOLD: HeatPalette     = { low: "#1c1408", mid: "#8a6a20", high: "#ffd700" };
export const PALETTE_LITHIUM: HeatPalette  = { low: "#0a1a2a", mid: "#2a7ab8", high: "#00d4ff" };

// Interpolation lineaire entre 3 couleurs (low→mid a t=0.5, mid→high a t=1.0)
function lerpHeat(palette: HeatPalette, t: number): string {
  const clamped = Math.max(0, Math.min(1, t));
  const [r1, g1, b1] = hexToRgb(palette.low);
  const [r2, g2, b2] = hexToRgb(palette.mid);
  const [r3, g3, b3] = hexToRgb(palette.high);

  let r: number, g: number, b: number;
  if (clamped <= 0.5) {
    const u = clamped * 2;
    r = Math.round(r1 + (r2 - r1) * u);
    g = Math.round(g1 + (g2 - g1) * u);
    b = Math.round(b1 + (b2 - b1) * u);
  } else {
    const u = (clamped - 0.5) * 2;
    r = Math.round(r2 + (r3 - r2) * u);
    g = Math.round(g2 + (g3 - g2) * u);
    b = Math.round(b2 + (b3 - b2) * u);
  }
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export interface HeatCountry {
  iso: string;
  geoName?: string | string[]; // OBSOLETE : ignore, filtre par ISO
  boundaryIsos?: string[];
  // Valeur d'intensite (0.0 = froid, 1.0 = max)
  intensity: number;
  // Palette (defaut : PALETTE_PETROLE)
  palette?: HeatPalette;
  // Frame local de debut du fade-in (defaut : 0)
  at?: number;
  // Duree du fade-in en frames (defaut : 60 — "la couleur monte avec la voix")
  rampFrames?: number;
  // Opacite max du fill (defaut : 0.70)
  maxOpacity?: number;
  // Couleur frontiere
  borderColor?: string;
  borderWidth?: number;
}

export interface HeatGradientFillProps {
  countries: HeatCountry[];
  center?: [number, number];
  baseZoom?: number;
  basePitch?: number;
  bearingStart?: number;
  bearingEnd?: number;
  children?: React.ReactNode;
}

export const HeatGradientFill: React.FC<HeatGradientFillProps> = ({
  countries,
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
        if (!map.getLayer("heat-neutral")) {
          map.addLayer({
            id: "heat-neutral", type: "fill",
            source: "cb", "source-layer": "country_boundaries",
            filter: ["!", ["in", ["get", "iso_3166_1_alpha_3"], ["literal", allIsos]]],
            paint: { "fill-color": IVORY, "fill-opacity": 0.03 },
          });
        }

        // Layer par pays
        for (const entry of countries) {
          const iso = entry.iso.toUpperCase();
          const filter = countryFilter(iso, entry.boundaryIsos ?? []);

          const palette = entry.palette ?? PALETTE_PETROLE;
          const initColor = lerpHeat(palette, 0);

          if (!map.getLayer(`heat-fill-${iso}`)) {
            map.addLayer({
              id: `heat-fill-${iso}`, type: "fill",
              source: "cb", "source-layer": "country_boundaries",
              filter,
              paint: { "fill-color": initColor, "fill-opacity": 0 },
            });
          }
          if (!map.getLayer(`heat-border-${iso}`)) {
            map.addLayer({
              id: `heat-border-${iso}`, type: "line",
              source: "cb", "source-layer": "country_boundaries",
              filter,
              paint: {
                "line-color": entry.borderColor ?? GOLD,
                "line-width": entry.borderWidth ?? 1.5,
                "line-opacity": 0,
              },
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

    for (const entry of countries) {
      const iso = entry.iso.toUpperCase();
      const at  = entry.at ?? 0;
      const fd  = entry.rampFrames ?? 60;
      const maxOp = entry.maxOpacity ?? 0.70;
      const palette = entry.palette ?? PALETTE_PETROLE;

      if (frame < at) continue;

      // t : progression 0→1 sur rampFrames
      const t = Math.min(1, (frame - at) / fd);
      const eased = 1 - Math.pow(1 - t, 2); // easeOut quad

      // La couleur monte avec la voix (t=0 → cold, t=1 → target intensity)
      const currentIntensity = eased * entry.intensity;
      const color = lerpHeat(palette, currentIntensity);

      safe(`heat-fill-${iso}`, "fill-color", color);
      safe(`heat-fill-${iso}`, "fill-opacity", eased * maxOp);
      safe(`heat-border-${iso}`, "line-opacity", eased * 0.85);
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

// ── Preview : production petroliere Afrique (monte en 3 vagues) ───────────────

export const HeatGradientFillPreview: React.FC = () => (
  <HeatGradientFill
    center={[20, 5]} baseZoom={3.5}
    countries={[
      { iso: "NGA", intensity: 1.0,  at: 0,  rampFrames: 90, palette: PALETTE_PETROLE },
      { iso: "LBY", intensity: 0.85, at: 30, rampFrames: 80, palette: PALETTE_PETROLE },
      { iso: "DZA", intensity: 0.75, at: 50, rampFrames: 80, palette: PALETTE_PETROLE },
      { iso: "AGO", intensity: 0.70, at: 70, rampFrames: 75, palette: PALETTE_PETROLE },
      { iso: "GAB", intensity: 0.50, at: 90, rampFrames: 60, palette: PALETTE_PETROLE },
      { iso: "COG", intensity: 0.40, at: 90, rampFrames: 60, palette: PALETTE_PETROLE },
      // Pays lithium : palette differente
      { iso: "COD", intensity: 0.90, at: 120, rampFrames: 80, palette: PALETTE_LITHIUM },
      { iso: "ZMB", intensity: 0.80, at: 140, rampFrames: 70, palette: PALETTE_LITHIUM },
      { iso: "ZWE", intensity: 0.65, at: 160, rampFrames: 70, palette: PALETTE_LITHIUM },
    ]}
  />
);
