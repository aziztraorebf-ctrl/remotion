import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MapboxBrandingHide } from "../../../_shared/mapbox/MapboxBase";

/**
 * GhanaMapClean — carte Mapbox PROPRE centrée sur le Ghana (or) avec léger
 * drift + zoom, fond bleu nuit doctrine. Aucun overlay (badge 5%→12%, labels,
 * sous-titres retirés). Pour slide 3 carrousel ("Le Ghana a exigé 10%...").
 * Format 1080x1350 (4:5).
 */

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD = "#c8a951";

const STYLE = {
  water: "#16213a",
  land: "#3a3a44",
  border: "#c8c8c8",
};

const GHANA_LON = -1.0232;
const GHANA_LAT = 7.9465;

// drift léger : vue Afrique de l'Ouest -> zoom doux vers Ghana
const CAM_START = { lon: 2, lat: 9, zoom: 3.6, pitch: 25, bearing: 4 };
const CAM_END = { lon: GHANA_LON, lat: GHANA_LAT, zoom: 4.8, pitch: 35, bearing: -3 };

const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

export const GhanaMapClean: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("GhanaMapClean Mapbox"));
  const [ready, setReady] = useState(false);

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
      center: [CAM_START.lon, CAM_START.lat],
      zoom: CAM_START.zoom,
      pitch: CAM_START.pitch,
      bearing: CAM_START.bearing,
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
      safe("admin-0-boundary-disputed", "line-color", STYLE.border);
      safe("admin-1-boundary", "line-color", "rgba(180,180,180,0.3)");

      if (!map.getLayer("ghana-fill")) {
        map.addLayer({
          id: "ghana-fill",
          type: "fill",
          source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
          paint: { "fill-color": GOLD, "fill-opacity": 0.85 },
        });
      }
      if (!map.getLayer("ghana-border")) {
        map.addLayer({
          id: "ghana-border",
          type: "line",
          source: { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" },
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
          paint: { "line-color": GOLD, "line-width": 3, "line-opacity": 1 },
        });
      }

      setReady(true);
      continueRender(handle);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [handle]);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const t = ease(interpolate(frame, [0, durationInFrames - 1], [0, 1], { extrapolateRight: "clamp" }));
    mapRef.current.jumpTo({
      center: [CAM_START.lon + (CAM_END.lon - CAM_START.lon) * t, CAM_START.lat + (CAM_END.lat - CAM_START.lat) * t],
      zoom: CAM_START.zoom + (CAM_END.zoom - CAM_START.zoom) * t,
      pitch: CAM_START.pitch + (CAM_END.pitch - CAM_START.pitch) * t,
      bearing: CAM_START.bearing + (CAM_END.bearing - CAM_START.bearing) * t,
    });
  }, [frame, ready, durationInFrames]);

  return (
    <AbsoluteFill style={{ backgroundColor: STYLE.water }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ width, height, position: "absolute" }} />
    </AbsoluteFill>
  );
};
