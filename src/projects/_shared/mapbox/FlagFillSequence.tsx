// FlagFillSequence.tsx — Template N1.2 : drapeaux s'allument en sequence synchro voix
// Usage : countries[{iso, geoName, at, label?, borderColor?}]
// Chaque pays recoit son drapeau a l'instant `at` (frame local).
// Reste allume jusqu'a la fin. Parfait pour les beats "connexions diplomatiques/commerciales".

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
const GOLD  = "#c8a951";
const IVORY = "#f2ebd9";
const NAVY  = "#16213a";

export interface FlagSequenceEntry {
  iso: string;
  // OBSOLETE : ignore. Le filtre se fait par ISO.
  geoName?: string | string[];
  // ISO additionnels a fusionner dans la silhouette (ex: ["ESH"])
  boundaryIsos?: string[];
  // Frame local auquel ce pays s'allume
  at: number;
  // Duree du fade-in (defaut : 30f)
  fadeFrames?: number;
  // Opacite cible du drapeau (defaut : 0.80)
  opacity?: number;
  // Couleur de la frontiere allumee (defaut : GOLD)
  borderColor?: string;
  // Label CSS au-dessus du pays (gere en dehors — voir prop `renderLabel`)
  label?: string;
}

export interface FlagFillSequenceProps {
  countries: FlagSequenceEntry[];
  // Camera
  center?: [number, number];
  baseZoom?: number;
  basePitch?: number;
  bearingStart?: number;
  bearingEnd?: number;
  // Taille canvas drapeau
  flagCanvasSize?: number;
  // Fond neutre pour les pays non ciblés (ivory 4%)
  showNeutralFill?: boolean;
  // Enfants (overlays CSS/SVG)
  children?: React.ReactNode;
}

export const FlagFillSequence: React.FC<FlagFillSequenceProps> = ({
  countries,
  center = [20, 5],
  baseZoom = 4.0,
  basePitch = 0,
  bearingStart = -3,
  bearingEnd = 3,
  flagCanvasSize = 512,
  showNeutralFill = true,
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

        // Fond neutre (voisins non ciblés)
        if (showNeutralFill && !map.getLayer("seq-neutral")) {
          const allIsos = countries.flatMap(c => [c.iso.toUpperCase(), ...(c.boundaryIsos ?? []).map(s => s.toUpperCase())]);
          map.addLayer({
            id: "seq-neutral", type: "fill",
            source: "cb", "source-layer": "country_boundaries",
            filter: ["!", ["in", ["get", "iso_3166_1_alpha_3"], ["literal", allIsos]]],
            paint: { "fill-color": IVORY, "fill-opacity": 0.04 },
          });
        }

        // Layer par pays (ordre = ordre dans countries[])
        for (const entry of countries) {
          const iso = entry.iso.toUpperCase();
          const flagId = pushFlagToMap(map, iso, flagCanvasSize);

          // Filtre par ISO (fiable headless) — iso + boundaryIsos
          const filter = countryFilter(iso, entry.boundaryIsos ?? []);

          const fillId   = `seq-flag-${iso}`;
          const borderId = `seq-border-${iso}`;

          if (!map.getLayer(fillId)) {
            map.addLayer({
              id: fillId, type: "fill",
              source: "cb", "source-layer": "country_boundaries",
              filter,
              paint: { "fill-pattern": flagId, "fill-opacity": 0 },
            });
          }

          if (!map.getLayer(borderId)) {
            map.addLayer({
              id: borderId, type: "line",
              source: "cb", "source-layer": "country_boundaries",
              filter,
              paint: {
                "line-color": entry.borderColor ?? GOLD,
                "line-width": 1.8,
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
      const at  = entry.at;
      const fd  = entry.fadeFrames ?? 30;
      const targetOp = entry.opacity ?? 0.80;

      if (frame < at) continue;

      const progress = Math.min(1, (frame - at) / fd);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOut cubic

      safe(`seq-flag-${iso}`, "fill-opacity", eased * targetOp);
      safe(`seq-border-${iso}`, "line-opacity", eased * 0.9);
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

// ── Preview/test : CEDEAO s'allume pays par pays ──────────────────────────────

export const FlagFillSequencePreview: React.FC = () => (
  <FlagFillSequence
    center={[-5, 10]}
    baseZoom={4.2}
    countries={[
      { iso: "SEN", at: 0,   label: "SÉNÉGAL" },
      { iso: "MLI", at: 30,  label: "MALI" },
      { iso: "BFA", at: 60,  label: "BURKINA FASO" },
      { iso: "NGA", at: 90,  label: "NIGERIA" },
      { iso: "GHA", at: 120, label: "GHANA" },
      { iso: "CIV", at: 150, label: "CÔTE D'IVOIRE" },
      { iso: "GIN", at: 180, label: "GUINÉE" },
      { iso: "CMR", at: 210, label: "CAMEROUN" },
    ]}
  />
);
