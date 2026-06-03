import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import mapboxgl from "mapbox-gl";
import {
  MapboxBrandingHide,
  MAPBOX_STYLES,
  applyGeoAfriqueV5,
} from "../../mapbox/MapboxBase";
import { BandeauNoir } from "./BandeauNoir";

// ─────────────────────────────────────────────────────────────────────────────
// OrAfricainMapBeat — Brique Mapbox + bandeau noir signature (Mode B)
//
// Carte plein écran avec country-highlights jaune/rouge selon le rôle narratif.
// Bandeau noir bas avec titre jaune + compteur X/Y optionnel.
//
// Camera "frame-driven" — lon/lat/zoom/pitch/bearing en props directs.
// Pour un mouvement caméra : utiliser un effet caller-côté (raré dans Short).
// ─────────────────────────────────────────────────────────────────────────────

export interface CountryHighlight {
  iso: string;            // ISO alpha-3 (ex: "COD", "CHN", "USA")
  color: string;          // ex: "#f4c534" or "#e84a4a"
  delayFrames?: number;   // délai apparition de ce highlight
}

export interface OrAfricainMapBeatProps {
  countries: CountryHighlight[];
  camera: {
    lon: number;
    lat: number;
    zoom: number;
    pitch?: number;
    bearing?: number;
  };
  cameraDrift?: {
    bearingDelta?: number;   // ex: +6 pour drift léger pendant le beat
    zoomDelta?: number;
    durationFrames: number;
  };
  bandeauText: string;
  bandeauHighlight?: string;
  compteur?: { current: number; total: number };
}

const TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const OrAfricainMapBeat: React.FC<OrAfricainMapBeatProps> = ({
  countries,
  camera,
  cameraDrift,
  bandeauText,
  bandeauHighlight,
  compteur,
}) => {
  const frame = useCurrentFrame();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [ready, setReady] = useState(false);

  // Calcul caméra animée avec drift léger optionnel
  const currentCam = (() => {
    const base = {
      lon:     camera.lon,
      lat:     camera.lat,
      zoom:    camera.zoom,
      pitch:   camera.pitch ?? 20,
      bearing: camera.bearing ?? 0,
    };
    if (!cameraDrift) return base;
    const t = Math.min(1, frame / cameraDrift.durationFrames);
    return {
      ...base,
      bearing: base.bearing + (cameraDrift.bearingDelta ?? 0) * t,
      zoom:    base.zoom + (cameraDrift.zoomDelta ?? 0) * t,
    };
  })();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: [camera.lon, camera.lat],
      zoom: camera.zoom,
      pitch: camera.pitch ?? 20,
      bearing: camera.bearing ?? 0,
      interactive: false,
      preserveDrawingBuffer: true,
      antialias: true,
    });

    map.on("style.load", () => {
      try {
        (map as mapboxgl.Map & { setProjection?: (p: string) => void })
          .setProjection?.("mercator");
      } catch {}
      applyGeoAfriqueV5(map);
      // Source partagée country-boundaries
      if (!map.getSource("cb-source")) {
        map.addSource("cb-source", {
          type: "vector",
          url: "mapbox://mapbox.country-boundaries-v1",
        });
      }
      setReady(true);
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Engine — update camera + country layers chaque frame
  useEffect(() => {
    if (!mapRef.current || !ready) return;
    const map = mapRef.current;

    map.jumpTo({
      center: [currentCam.lon, currentCam.lat],
      zoom: currentCam.zoom,
      pitch: currentCam.pitch,
      bearing: currentCam.bearing,
    });

    // Country highlights — fade in séquentiel
    countries.forEach(({ iso, color, delayFrames = 0 }) => {
      const fillId = `oa-fill-${iso}`;
      const borderId = `oa-border-${iso}`;

      if (!map.getLayer(fillId)) {
        map.addLayer({
          id: fillId,
          type: "fill",
          source: "cb-source",
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
          paint: { "fill-color": color, "fill-opacity": 0 },
        });
      }
      if (!map.getLayer(borderId)) {
        map.addLayer({
          id: borderId,
          type: "line",
          source: "cb-source",
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
          paint: { "line-color": color, "line-width": 2.5, "line-opacity": 0 },
        });
      }

      const fadeP = Math.max(0, Math.min(1, (frame - delayFrames) / 18));
      try {
        map.setPaintProperty(fillId, "fill-opacity", fadeP * 0.85);
        map.setPaintProperty(borderId, "line-opacity", fadeP * 0.95);
      } catch {}
    });
  });

  return (
    <AbsoluteFill style={{ background: "#0d1520" }}>
      <MapboxBrandingHide />
      <AbsoluteFill>
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>

      <BandeauNoir
        text={bandeauText}
        entityHighlight={bandeauHighlight}
        compteur={compteur}
        delayFrames={20}
      />
    </AbsoluteFill>
  );
};
