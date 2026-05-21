/**
 * MapboxSatelliteBeat — wrapper Mapbox satellite-v9 generic reutilisable
 * pour beats style Jacq Adi : fond satellite + pays surligne contour glow + slot children pour stickers.
 *
 * Pattern : satellite-v9 + removeLabels + addCountryHighlight + lerp camera entre keyframes
 *
 * Usage :
 *   <MapboxSatelliteBeat
 *     iso="COD"
 *     highlightColor="#ff8c00"
 *     keyframes={[
 *       { frame: 0,   lon: 0, lat: 10,  zoom: 1.2, pitch: 0, bearing: 0 },
 *       { frame: 120, lon: 23, lat: -2, zoom: 4.2, pitch: 30, bearing: 0 },
 *     ]}
 *   >
 *     <StickerOrChildren />
 *   </MapboxSatelliteBeat>
 */

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
import { MapboxBrandingHide, lerpCam, type CamState } from "./MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export type Keyframe = CamState & { frame: number };

export type MapboxSatelliteBeatProps = {
  iso?: string;
  highlightColor?: string;
  fillOpacity?: number;
  borderWidth?: number;
  keyframes: Keyframe[];
  children?: React.ReactNode;
  removeLabels?: boolean;
  extraIsos?: { iso: string; color: string; opacity?: number; border?: number }[];
};

const lerpFromKeyframes = (frame: number, kfs: Keyframe[]): CamState => {
  if (frame <= kfs[0].frame) return kfs[0];
  if (frame >= kfs[kfs.length - 1].frame) return kfs[kfs.length - 1];
  for (let i = 0; i < kfs.length - 1; i++) {
    const a = kfs[i];
    const b = kfs[i + 1];
    if (frame >= a.frame && frame <= b.frame) {
      const t = (frame - a.frame) / (b.frame - a.frame);
      return lerpCam(a, b, t);
    }
  }
  return kfs[kfs.length - 1];
};

export const MapboxSatelliteBeat: React.FC<MapboxSatelliteBeatProps> = ({
  iso,
  highlightColor = "#ff8c00",
  fillOpacity = 0.0,
  borderWidth = 3,
  keyframes,
  children,
  removeLabels: shouldRemoveLabels = true,
  extraIsos = [],
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() =>
    delayRender("MapboxSatelliteBeat", { timeoutInMilliseconds: 45000 })
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      console.warn("[MapboxSatelliteBeat] no MAPBOX_TOKEN — skipping map");
      continueRender(handle);
      return;
    }

    let safetyTimer: ReturnType<typeof setTimeout> | null = setTimeout(() => {
      console.warn("[MapboxSatelliteBeat] safety timeout — continuing render");
      continueRender(handle);
      safetyTimer = null;
    }, 30000);

    mapboxgl.accessToken = MAPBOX_TOKEN;

    let map: mapboxgl.Map;
    try {
      const kf0 = keyframes[0];
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: [kf0.lon, kf0.lat],
        zoom: kf0.zoom,
        pitch: kf0.pitch,
        bearing: kf0.bearing,
        interactive: false,
        attributionControl: false,
        preserveDrawingBuffer: true,
        fadeDuration: 0,
        projection: { name: "mercator" },
      });
    } catch (err) {
      console.error("[MapboxSatelliteBeat] map constructor error:", err);
      if (safetyTimer) { clearTimeout(safetyTimer); }
      continueRender(handle);
      return;
    }

    mapRef.current = map;

    map.on("error", (e) => {
      console.error("[MapboxSatelliteBeat] map error event:", e?.error?.message ?? e);
    });

    map.on("style.load", () => {
      if (shouldRemoveLabels) {
        const layers = map.getStyle().layers ?? [];
        for (const layer of layers) {
          if (layer.type === "symbol") {
            map.setLayoutProperty(layer.id, "visibility", "none");
          }
        }
      }

      // JACQ ADI STYLE: override water color to bright uniform blue
      // (satellite-streets-v12 normally shows real satellite ocean which is dark)
      try {
        const allLayers = map.getStyle().layers ?? [];
        for (const layer of allLayers) {
          if (layer.id === "water" || layer.id.startsWith("water")) {
            if (layer.type === "fill") {
              map.setPaintProperty(layer.id, "fill-color", "#1e6091");
              map.setPaintProperty(layer.id, "fill-opacity", 1.0);
            }
          }
        }
        // Background fallback (visible when satellite tiles not loaded yet)
        if (map.getLayer("background")) {
          map.setPaintProperty("background", "background-color", "#1e6091");
        }
      } catch (err) {
        console.warn("[MapboxSatelliteBeat] water override failed:", err);
      }

      // Country boundaries source partagee
      const COUNTRY_SRC = "country-boundaries-v1";
      if (!map.getSource(COUNTRY_SRC)) {
        map.addSource(COUNTRY_SRC, {
          type: "vector",
          url: "mapbox://mapbox.country-boundaries-v1",
        });
      }

      const addHl = (
        countryIso: string,
        color: string,
        opacity: number,
        bw: number,
        prefix: string,
      ) => {
        const fillId = `${prefix}fill-${countryIso}`;
        const borderId = `${prefix}border-${countryIso}`;
        if (map.getLayer(fillId)) map.removeLayer(fillId);
        if (map.getLayer(borderId)) map.removeLayer(borderId);

        map.addLayer({
          id: fillId,
          type: "fill",
          source: COUNTRY_SRC,
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], countryIso],
          paint: { "fill-color": color, "fill-opacity": opacity },
        });

        map.addLayer({
          id: borderId,
          type: "line",
          source: COUNTRY_SRC,
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], countryIso],
          paint: { "line-color": color, "line-width": bw, "line-opacity": 0.95 },
        });
      };

      if (iso) addHl(iso, highlightColor, fillOpacity, borderWidth, "main-");
      for (const ex of extraIsos) {
        addHl(ex.iso, ex.color, ex.opacity ?? 0.4, ex.border ?? 2, `extra-${ex.iso}-`);
      }

      setReady(true);
      // Wait for tiles to actually paint, not just style definition load.
      // 'idle' fires after all queued renders done AND tiles loaded.
      map.once("idle", () => {
        if (safetyTimer) { clearTimeout(safetyTimer); safetyTimer = null; }
        continueRender(handle);
      });
    });

    return () => {
      if (safetyTimer) { clearTimeout(safetyTimer); }
      map.remove();
      mapRef.current = null;
    };
  }, [handle, iso, highlightColor, fillOpacity, borderWidth, shouldRemoveLabels, extraIsos, keyframes]);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const cam = lerpFromKeyframes(frame, keyframes);
    mapRef.current.jumpTo({
      center: [cam.lon, cam.lat],
      zoom: cam.zoom,
      pitch: cam.pitch,
      bearing: cam.bearing,
    });
  }, [frame, ready, keyframes]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ width, height, position: "absolute" }} />
      {children}
    </AbsoluteFill>
  );
};
