// FlagFillStatic.tsx — Template N1.1 : 1 pays principal + voisins couleurs unies
// Usage : <FlagFillStatic mainIso="MAR" secondaryCountries={[{iso:"ESP",color:"#c60b1e"},{iso:"FRA",color:"#002395"}]} />
// Derive de Beat0Hook.tsx + Beat1Phosphate.tsx. Reutilisable dans tout beat Souverain.

import React, { useEffect, useRef } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  applyGeoAfriqueV5,
  MapboxBrandingHide,
  MAPBOX_STYLES,
} from "./MapboxBase";
import { pushFlagToMap, pushCanvas, drawFlagCanvas } from "./flagCanvas";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD  = "#c8a951";
const IVORY = "#f2ebd9";
const NAVY  = "#16213a";

export interface SecondaryCountry {
  iso: string;
  color: string;
  borderColor?: string;
}

export interface FlagFillStaticProps {
  // Pays principal (son drapeau remplit sa silhouette)
  mainIso: string;
  // OBSOLETE : conserve pour compat, mais le filtre se fait par ISO (plus fiable en headless).
  mainGeoName?: string | string[];
  // ISO additionnels a fusionner dans la silhouette (ex: ["ESH"] pour le Sahara occidental)
  mainBoundaryIsos?: string[];
  // Opacite du drapeau principal (0-1)
  mainFlagOpacity?: number;
  // Couleur de la frontiere du pays principal
  mainBorderColor?: string;
  // Pays secondaires (fill-color unie, sans drapeau)
  secondaryCountries?: SecondaryCountry[];
  // Camera initiale
  center?: [number, number];
  baseZoom?: number;
  basePitch?: number;
  // Drift continu (bearing)
  bearingStart?: number;
  bearingEnd?: number;
  // Duree du fade-in du drapeau (en frames)
  fadeInFrames?: number;
  // Taille du canvas drapeau (512 recommande)
  flagCanvasSize?: number;
  // Enfants React (overlays CSS/SVG au-dessus de la carte)
  children?: React.ReactNode;
}

export const FlagFillStatic: React.FC<FlagFillStaticProps> = ({
  mainIso,
  mainGeoName,
  mainBoundaryIsos = [],
  mainFlagOpacity = 0.80,
  mainBorderColor = GOLD,
  secondaryCountries = [],
  center = [20, 5],
  baseZoom = 4.0,
  basePitch = 0,
  bearingStart = -3,
  bearingEnd = 3,
  fadeInFrames = 40,
  flagCanvasSize = 512,
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const setupRef     = useRef(false);

  // Filtre Mapbox par ISO (fiable en headless) — iso principal + boundaryIsos fusionnes.
  // mainGeoName est ignore (le filtre "name" ne matche pas country-boundaries-v1 en headless).
  const mainIsoUpper = mainIso.toUpperCase();
  const mainFocusIsos = [mainIsoUpper, ...mainBoundaryIsos.map(s => s.toUpperCase())];
  const mainFilter: mapboxgl.Expression = ["in", ["get", "iso_3166_1_alpha_3"], ["literal", mainFocusIsos]];

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const bearing0 = bearingStart;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center, zoom: baseZoom, pitch: basePitch, bearing: bearing0,
      interactive: false, attributionControl: false, fadeDuration: 0,
    });

    map.on("style.load", () => {
      try {
        (map as unknown as { setProjection: (p: string) => void }).setProjection("mercator");
        applyGeoAfriqueV5(map);

        if (!map.getSource("cb")) {
          map.addSource("cb", { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" });
        }

        // Drapeau principal : canvas pur, synchrone, disponible a f0
        const flagId = pushFlagToMap(map, mainIsoUpper, flagCanvasSize);

        // Layer drapeau principal
        if (!map.getLayer("main-flag")) {
          map.addLayer({
            id: "main-flag", type: "fill",
            source: "cb", "source-layer": "country_boundaries",
            filter: mainFilter,
            paint: { "fill-pattern": flagId, "fill-opacity": 0 },
          });
        }

        // Frontiere pays principal
        if (!map.getLayer("main-border")) {
          map.addLayer({
            id: "main-border", type: "line",
            source: "cb", "source-layer": "country_boundaries",
            filter: mainFilter,
            paint: { "line-color": mainBorderColor, "line-width": 2.0, "line-opacity": 0 },
          });
        }

        // Pays secondaires (couleur unie)
        for (const sec of secondaryCountries) {
          const secIso = sec.iso.toUpperCase();
          const lid = `sec-fill-${secIso}`;
          const bid = `sec-border-${secIso}`;
          if (!map.getLayer(lid)) {
            map.addLayer({
              id: lid, type: "fill",
              source: "cb", "source-layer": "country_boundaries",
              filter: ["==", ["get", "iso_3166_1_alpha_3"], secIso],
              paint: { "fill-color": sec.color, "fill-opacity": 0 },
            });
          }
          if (!map.getLayer(bid)) {
            map.addLayer({
              id: bid, type: "line",
              source: "cb", "source-layer": "country_boundaries",
              filter: ["==", ["get", "iso_3166_1_alpha_3"], secIso],
              paint: { "line-color": sec.borderColor ?? IVORY, "line-width": 1.2, "line-opacity": 0 },
            });
          }
        }

        // Voisins neutres (reste du monde, fond subtil ivory)
        const excludedIsos = [...mainFocusIsos, ...secondaryCountries.map(s => s.iso.toUpperCase())];
        if (!map.getLayer("neighbors-neutral")) {
          map.addLayer({
            id: "neighbors-neutral", type: "fill",
            source: "cb", "source-layer": "country_boundaries",
            filter: ["!", ["in", ["get", "iso_3166_1_alpha_3"], ["literal", excludedIsos]]],
            paint: { "fill-color": IVORY, "fill-opacity": 0.04 },
          });
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

    // Drift bearing continu
    const bearing = interpolate(frame, [0, durationInFrames], [bearingStart, bearingEnd], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    map.jumpTo({ center, zoom: baseZoom, pitch: basePitch, bearing });

    if (!setupRef.current) return;

    const safe = (id: string, prop: string, val: unknown) => {
      try { if (map.getLayer(id)) (map.setPaintProperty as (a: string, b: string, c: unknown) => void)(id, prop, val); } catch (_e) {}
    };

    // Fade-in drapeau principal
    const flagOp = interpolate(frame, [0, fadeInFrames], [0, mainFlagOpacity], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    safe("main-flag", "fill-opacity", flagOp);
    safe("main-border", "line-opacity", interpolate(frame, [0, fadeInFrames], [0, 0.9], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    }));

    // Pays secondaires (fade-in decale de fadeInFrames/2)
    const secDelay = fadeInFrames * 0.5;
    for (const sec of secondaryCountries) {
      const secIso = sec.iso.toUpperCase();
      const secOp = interpolate(frame, [secDelay, secDelay + fadeInFrames], [0, 0.65], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
      safe(`sec-fill-${secIso}`, "fill-opacity", secOp);
      safe(`sec-border-${secIso}`, "line-opacity", secOp * 0.9);
    }
  });

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, backgroundColor: NAVY }} />
      <MapboxBrandingHide />
      {/* Vignette subtile */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(to bottom,rgba(22,33,58,0.30) 0%,rgba(22,33,58,0.0) 40%,rgba(22,33,58,0.25) 100%)",
      }} />
      {children}
    </AbsoluteFill>
  );
};

// ── Version autonome pour previews/tests ─────────────────────────────────────

export const FlagFillStaticPreview: React.FC = () => (
  <FlagFillStatic
    mainIso="MAR"
    mainBoundaryIsos={["ESH"]}
    center={[-5.5, 32.0]}
    baseZoom={4.8}
    secondaryCountries={[
      { iso: "ESP", color: "#c60b1e" },
      { iso: "FRA", color: "#002395" },
      { iso: "DEU", color: "#dd0000" },
      { iso: "PRT", color: "#006600" },
    ]}
  />
);
