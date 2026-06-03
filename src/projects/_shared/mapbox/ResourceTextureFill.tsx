// ResourceTextureFill.tsx — Template N2.1 : texture de ressource bichromie projetee dans un pays
// La ressource "remplit" le territoire — aucune chaine africaine ne fait ca.
// Usage : mainIso="DZA" resource="oil" pour "l'Algerie remplie de petrole"
// Combine avec FlagFillStatic pour les pays secondaires.

import React, { useEffect, useRef } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  applyGeoAfriqueV5,
  MapboxBrandingHide,
  MAPBOX_STYLES,
} from "./MapboxBase";
import { pushCanvas, countryFilter } from "./flagCanvas";
import { drawResourceTexture, resourceImageId, ResourceType } from "./resourceTextures";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD  = "#c8a951";
const IVORY = "#f2ebd9";
const NAVY  = "#16213a";

export interface ResourceCountry {
  iso: string;
  geoName?: string | string[]; // OBSOLETE : ignore, filtre par ISO
  boundaryIsos?: string[];
  resource: ResourceType;
  // Frame local auquel la texture apparait (defaut : 0)
  at?: number;
  fadeFrames?: number;
  opacity?: number;
  borderColor?: string;
}

export interface SecondaryFill {
  iso: string;
  color: string;
  borderColor?: string;
  at?: number;
}

export interface ResourceTextureFillProps {
  // Pays avec textures de ressource
  countries: ResourceCountry[];
  // Pays secondaires (couleur unie, contexte)
  secondary?: SecondaryFill[];
  // Camera
  center?: [number, number];
  baseZoom?: number;
  basePitch?: number;
  bearingStart?: number;
  bearingEnd?: number;
  // Taille des tiles texture (256 = bon compromis)
  textureSize?: number;
  // Enfants (overlays)
  children?: React.ReactNode;
}

export const ResourceTextureFill: React.FC<ResourceTextureFillProps> = ({
  countries,
  secondary = [],
  center = [20, 5],
  baseZoom = 4.0,
  basePitch = 0,
  bearingStart = -3,
  bearingEnd = 3,
  textureSize = 256,
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

        // Textures ressources (canvas pur, synchrone)
        const injectedTextures = new Set<ResourceType>();
        for (const entry of countries) {
          if (!injectedTextures.has(entry.resource)) {
            const canvas = drawResourceTexture(entry.resource, textureSize);
            pushCanvas(map, resourceImageId(entry.resource), canvas);
            injectedTextures.add(entry.resource);
          }
        }

        // Fond neutre
        const allIsos = [...countries.flatMap(c => [c.iso.toUpperCase(), ...(c.boundaryIsos ?? []).map(s => s.toUpperCase())]), ...secondary.map(s => s.iso.toUpperCase())];
        if (!map.getLayer("res-neutral")) {
          map.addLayer({
            id: "res-neutral", type: "fill",
            source: "cb", "source-layer": "country_boundaries",
            filter: ["!", ["in", ["get", "iso_3166_1_alpha_3"], ["literal", allIsos]]],
            paint: { "fill-color": IVORY, "fill-opacity": 0.04 },
          });
        }

        // Pays secondaires (couleur unie)
        for (const sec of secondary) {
          const iso = sec.iso.toUpperCase();
          const lid = `res-sec-${iso}`;
          const bid = `res-sec-b-${iso}`;
          if (!map.getLayer(lid)) {
            map.addLayer({
              id: lid, type: "fill",
              source: "cb", "source-layer": "country_boundaries",
              filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
              paint: { "fill-color": sec.color, "fill-opacity": 0 },
            });
          }
          if (!map.getLayer(bid)) {
            map.addLayer({
              id: bid, type: "line",
              source: "cb", "source-layer": "country_boundaries",
              filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
              paint: { "line-color": sec.borderColor ?? IVORY, "line-width": 1.0, "line-opacity": 0 },
            });
          }
        }

        // Layers texture par pays
        for (const entry of countries) {
          const iso = entry.iso.toUpperCase();
          const filter = countryFilter(iso, entry.boundaryIsos ?? []);

          const fillId   = `res-tex-${iso}`;
          const borderId = `res-tex-b-${iso}`;

          if (!map.getLayer(fillId)) {
            map.addLayer({
              id: fillId, type: "fill",
              source: "cb", "source-layer": "country_boundaries",
              filter,
              paint: { "fill-pattern": resourceImageId(entry.resource), "fill-opacity": 0 },
            });
          }
          if (!map.getLayer(borderId)) {
            map.addLayer({
              id: borderId, type: "line",
              source: "cb", "source-layer": "country_boundaries",
              filter,
              paint: {
                "line-color": entry.borderColor ?? GOLD,
                "line-width": 2.0,
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

    // Pays secondaires
    for (const sec of secondary) {
      const iso = sec.iso.toUpperCase();
      const delay = sec.at ?? 0;
      const op = interpolate(frame, [delay, delay + 30], [0, 0.55], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
      safe(`res-sec-${iso}`, "fill-opacity", op);
      safe(`res-sec-b-${iso}`, "line-opacity", op * 0.8);
    }

    // Pays texturés
    for (const entry of countries) {
      const iso = entry.iso.toUpperCase();
      const at  = entry.at ?? 0;
      const fd  = entry.fadeFrames ?? 35;
      const targetOp = entry.opacity ?? 0.85;

      if (frame < at) continue;
      const t = Math.min(1, (frame - at) / fd);
      const eased = 1 - Math.pow(1 - t, 3);

      safe(`res-tex-${iso}`, "fill-opacity", eased * targetOp);
      safe(`res-tex-b-${iso}`, "line-opacity", eased);
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

// ── Previews ───────────────────────────────────────────────────────────────────

// Afrique petrole + gaz + lithium
export const ResourceTextureFillPreviewAfrique: React.FC = () => (
  <ResourceTextureFill
    center={[20, 5]} baseZoom={3.5}
    countries={[
      { iso: "DZA", resource: "oil",   at: 0 },
      { iso: "NGA", resource: "oil",   at: 30 },
      { iso: "LBY", resource: "gas",   at: 60 },
      { iso: "COD", resource: "lithium", at: 90 },
      { iso: "ZMB", resource: "lithium", at: 120 },
      { iso: "ZWE", resource: "lithium", at: 150 },
      { iso: "GHA", resource: "gold",   at: 180 },
      { iso: "MLI", resource: "gold",   at: 210 },
      { iso: "ETH", resource: "agriculture", at: 240 },
    ]}
    secondary={[
      { iso: "MAR", color: "#c1272d", at: 0 },
      { iso: "TUN", color: "#e70013", at: 0 },
      { iso: "EGY", color: "#ce1126", at: 0 },
    ]}
  />
);

// Maroc phosphate
export const ResourceTextureFillPreviewMaroc: React.FC = () => (
  <ResourceTextureFill
    center={[-5, 31]} baseZoom={5.5}
    countries={[
      { iso: "MAR", boundaryIsos: ["ESH"], resource: "phosphate", at: 0 },
    ]}
    secondary={[
      { iso: "ESP", color: "#c60b1e", at: 30 },
      { iso: "DZA", color: "#006233", at: 30 },
    ]}
  />
);
