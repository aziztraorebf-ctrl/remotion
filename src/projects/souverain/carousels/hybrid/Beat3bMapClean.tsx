import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MapboxBrandingHide } from "../../../_shared/mapbox/MapboxBase";

/**
 * Beat3bMapClean — variante PROPRE de Beat3bPression pour carrousel hybride.
 *
 * Conserve : la Map Mapbox monde + l'animation des 6 pays qui s'allument en rouge
 *            + Ghana en or (la matière visuelle).
 * Retire    : CountryLabel, CountriesCounter ("PAYS QUI PROTESTENT" + compteur),
 *            Subtitles karaoké, ProgressBar, Audio narration, SFX.
 *
 * Le texte premium du carrousel vient PAR-DESSUS via CarouselSlideHybrid.
 * Format cible : 1080x1350 (4:5 Instagram). Caméra ajustée pour ce ratio.
 */

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const PALETTE = {
  or: "#c8a951",
  rouge: "#d32f2f",
};

const STYLE = {
  water: "#16213a", // fond bleu nuit doctrine Souverain (au lieu du #1a3a5c d'origine)
  land: "#3a3a44",
  border: "#c8c8c8",
  highlight: PALETTE.or,
  adversary: PALETTE.rouge,
  space: "#16213a",
};

// Vue monde calibrée pour 4:5 (plus carré que le 9:16 d'origine -> zoom légèrement réduit)
const CAM_GLOBAL = { lon: 12, lat: 28, zoom: 0.55, pitch: 0, bearing: 0 };

type Adversary = { iso: string; lon: number; lat: number; localStart: number };

// Révélation des 6 pays — rythme posé pour laisser respirer l'animation (~5s).
// Stagger ~24f entre chaque -> les 6 sont tous rouges vers f140 (~4.7s), puis hold jusqu'à f180.
const ADVERSARIES: Adversary[] = [
  { iso: "USA", lon: -98, lat: 39, localStart: 14 },
  { iso: "GBR", lon: -2, lat: 54, localStart: 38 },
  { iso: "CHN", lon: 105, lat: 35, localStart: 62 },
  { iso: "CAN", lon: -106, lat: 56, localStart: 86 },
  { iso: "AUS", lon: 134, lat: -25, localStart: 110 },
  { iso: "ZAF", lon: 25, lat: -29, localStart: 134 },
];

export const Beat3bMapClean: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Beat3bMapClean Mapbox"));
  const [ready, setReady] = useState(false);

  const activeAdversaries = ADVERSARIES.map((c) => ({
    ...c,
    visible: frame >= c.localStart,
    pulsePhase: frame - c.localStart,
  }));

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
      center: [CAM_GLOBAL.lon, CAM_GLOBAL.lat],
      zoom: CAM_GLOBAL.zoom,
      pitch: CAM_GLOBAL.pitch,
      bearing: CAM_GLOBAL.bearing,
      projection: { name: "mercator" },
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });

    mapRef.current = map;

    map.on("style.load", () => {
      const layers = map.getStyle().layers ?? [];
      for (const layer of layers) {
        if (layer.type === "symbol") {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
        if (layer.id.includes("waterway") || layer.id.includes("wetland")) {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      }

      const setPaint = map.setPaintProperty.bind(map) as unknown as (id: string, prop: string, val: unknown) => void;
      const safe = (id: string, prop: string, val: unknown) => {
        try { if (map.getLayer(id)) setPaint(id, prop, val); } catch {}
      };

      safe("water", "fill-color", STYLE.water);
      safe("water-shadow", "fill-color", STYLE.water);
      safe("land", "background-color", STYLE.land);
      safe("landuse", "fill-color", STYLE.land);
      safe("national-park", "fill-color", STYLE.land);
      safe("landcover", "fill-color", STYLE.land);
      safe("admin-0-boundary", "line-color", STYLE.border);
      safe("admin-0-boundary", "line-width", 2);
      safe("admin-0-boundary-disputed", "line-color", STYLE.border);
      safe("admin-0-boundary-disputed", "line-width", 2);
      safe("admin-1-boundary", "line-color", "rgba(180,180,180,0.3)");

      // Ghana en or — ancre visuelle
      if (!map.getLayer("ghana-fill")) {
        map.addLayer({
          id: "ghana-fill",
          type: "fill",
          source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
          paint: { "fill-color": STYLE.highlight, "fill-opacity": 0.85 },
        });
      }
      if (!map.getLayer("ghana-border")) {
        map.addLayer({
          id: "ghana-border",
          type: "line",
          source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
          paint: { "line-color": STYLE.highlight, "line-width": 3, "line-opacity": 1 },
        });
      }

      // 6 pays adverses — fill + border, invisibles au départ
      ADVERSARIES.forEach((c) => {
        if (!map.getLayer(`adv-fill-${c.iso}`)) {
          map.addLayer({
            id: `adv-fill-${c.iso}`,
            type: "fill",
            source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], c.iso],
            paint: { "fill-color": STYLE.adversary, "fill-opacity": 0 },
          });
        }
        if (!map.getLayer(`adv-border-${c.iso}`)) {
          map.addLayer({
            id: `adv-border-${c.iso}`,
            type: "line",
            source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], c.iso],
            paint: { "line-color": STYLE.adversary, "line-width": 2, "line-opacity": 0 },
          });
        }
      });

      setReady(true);
      continueRender(handle);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [handle]);

  // Vue monde fixe (pas de mouvement caméra ici) + opacités des pays par frame
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;

    const setPaint = (map.setPaintProperty as unknown as (id: string, prop: string, val: unknown) => void).bind(map);

    activeAdversaries.forEach((adv) => {
      try {
        if (!adv.visible) {
          setPaint(`adv-fill-${adv.iso}`, "fill-opacity", 0);
          setPaint(`adv-border-${adv.iso}`, "line-opacity", 0);
        } else {
          const fadeIn = Math.min(1, adv.pulsePhase / 12);
          const pulse = 0.6 + 0.12 * Math.sin((adv.pulsePhase / 18) * Math.PI * 2);
          setPaint(`adv-fill-${adv.iso}`, "fill-opacity", fadeIn * pulse);
          setPaint(`adv-border-${adv.iso}`, "line-opacity", fadeIn * 0.95);
        }
      } catch {}
    });
  }, [frame, ready, activeAdversaries]);

  return (
    <AbsoluteFill style={{ backgroundColor: STYLE.space }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ width, height, position: "absolute" }} />
    </AbsoluteFill>
  );
};
