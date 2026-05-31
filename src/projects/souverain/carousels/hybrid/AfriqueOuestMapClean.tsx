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
 * AfriqueOuestMapClean — carte Mapbox PROPRE Afrique de l'Ouest : Ghana (or) +
 * Mali, Burkina, Niger qui s'allument en orange/bronze (les pays qui suivent).
 * Aucun overlay (labels pays, code minier, sous-titres retirés).
 * Pour slide 5 carrousel ("Le Ghana a signé seul. Les autres ont suivi.").
 * Format 1080x1350 (4:5).
 */

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD = "#c8a951";

const STYLE = { water: "#16213a", land: "#3a3a44", border: "#c8c8c8" };

// Vue Afrique de l'Ouest (Ghana au centre-bas, Sahel au-dessus)
const CAM = { lon: 0, lat: 14, zoom: 3.4, pitch: 28, bearing: 0 };

type Follower = { iso: string; color: string; localStart: number };
const FOLLOWERS: Follower[] = [
  { iso: "MLI", color: "#e89b3c", localStart: 20 },  // Mali
  { iso: "BFA", color: "#d4872a", localStart: 50 },  // Burkina
  { iso: "NER", color: "#c2761f", localStart: 80 },  // Niger
];

export const AfriqueOuestMapClean: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("AfriqueOuestMapClean Mapbox"));
  const [ready, setReady] = useState(false);

  const active = FOLLOWERS.map((c) => ({ ...c, visible: frame >= c.localStart, phase: frame - c.localStart }));

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) { continueRender(handle); return; }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [CAM.lon, CAM.lat],
      zoom: CAM.zoom,
      pitch: CAM.pitch,
      bearing: CAM.bearing,
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
        if (layer.type === "symbol") map.setLayoutProperty(layer.id, "visibility", "none");
        if (layer.id.includes("waterway") || layer.id.includes("wetland")) map.setLayoutProperty(layer.id, "visibility", "none");
      }

      const setPaint = map.setPaintProperty.bind(map) as unknown as (id: string, prop: string, val: unknown) => void;
      const safe = (id: string, prop: string, val: unknown) => { try { if (map.getLayer(id)) setPaint(id, prop, val); } catch {} };

      safe("water", "fill-color", STYLE.water);
      safe("water-shadow", "fill-color", STYLE.water);
      safe("land", "background-color", STYLE.land);
      safe("landuse", "fill-color", STYLE.land);
      safe("national-park", "fill-color", STYLE.land);
      safe("landcover", "fill-color", STYLE.land);
      safe("admin-0-boundary", "line-color", STYLE.border);
      safe("admin-0-boundary", "line-width", 2);
      safe("admin-1-boundary", "line-color", "rgba(180,180,180,0.3)");

      // Ghana en or
      if (!map.getLayer("ghana-fill")) {
        map.addLayer({
          id: "ghana-fill", type: "fill",
          source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
          paint: { "fill-color": GOLD, "fill-opacity": 0.9 },
        });
        map.addLayer({
          id: "ghana-border", type: "line",
          source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
          paint: { "line-color": GOLD, "line-width": 3 },
        });
      }

      // Pays qui suivent — orange, invisibles au départ
      FOLLOWERS.forEach((c) => {
        if (!map.getLayer(`fol-fill-${c.iso}`)) {
          map.addLayer({
            id: `fol-fill-${c.iso}`, type: "fill",
            source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], c.iso],
            paint: { "fill-color": c.color, "fill-opacity": 0 },
          });
          map.addLayer({
            id: `fol-border-${c.iso}`, type: "line",
            source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], c.iso],
            paint: { "line-color": c.color, "line-width": 2, "line-opacity": 0 },
          });
        }
      });

      setReady(true);
      continueRender(handle);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [handle]);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    const setPaint = (map.setPaintProperty as unknown as (id: string, prop: string, val: unknown) => void).bind(map);
    active.forEach((c) => {
      try {
        if (!c.visible) {
          setPaint(`fol-fill-${c.iso}`, "fill-opacity", 0);
          setPaint(`fol-border-${c.iso}`, "line-opacity", 0);
        } else {
          const fadeIn = Math.min(1, c.phase / 14);
          setPaint(`fol-fill-${c.iso}`, "fill-opacity", fadeIn * 0.82);
          setPaint(`fol-border-${c.iso}`, "line-opacity", fadeIn * 0.95);
        }
      } catch {}
    });
  }, [frame, ready, active]);

  return (
    <AbsoluteFill style={{ backgroundColor: STYLE.water }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ width, height, position: "absolute" }} />
    </AbsoluteFill>
  );
};
