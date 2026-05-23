import React, { useEffect, useRef } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import mapboxgl from "mapbox-gl";
import {
  MapboxBrandingHide,
  MAPBOX_STYLES,
  applyGeoAfriqueV5,
} from "../../../_shared/mapbox/MapboxBase";
import { MapboxPulse } from "../../../_shared/components/layouts/MapboxPulse";

// Beat 5 — "Entre la malédiction pétrolière et l'eldorado..." (33.38s → 42.02s)
// Durée réelle : 8.64s / 259 frames
// Forced-alignment anchors (relatifs) :
//   0s   — "Entre" → carte Yakaar visible
//   2.1s — "Yakaar-Teranga" mentionné → label apparaît
//   8.64s — fin "direct." → fin du beat

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const YAKAAR_CENTER = { lon: -17.50, lat: 14.80 };
const CAM_ZOOM = 7.5;
const LABEL_FRAME = Math.round(2.1 * 30); // 63f — "Yakaar-Teranga" dans la narration

const MapboxYakaar: React.FC = () => {
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: [YAKAAR_CENTER.lon, YAKAAR_CENTER.lat],
      zoom: CAM_ZOOM,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
    });

    map.on("style.load", () => {
      (map as unknown as { setProjection: (p: string) => void }).setProjection("mercator");
      applyGeoAfriqueV5(map);
      const safe = (id: string, prop: string, val: unknown) => {
        try { if (map.getLayer(id)) (map.setPaintProperty as (id: string, prop: string, val: unknown) => void)(id, prop, val); } catch {}
      };
      safe("land",         "background-color", "#5a5a5a");
      safe("landuse",      "fill-color",       "#5a5a5a");
      safe("landcover",    "fill-color",       "#545454");
      safe("water",        "fill-color",       "#2a4f72");
      safe("water-shadow", "fill-color",       "#2a4f72");
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  return (
    <>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
    </>
  );
};

export const Beat5: React.FC = () => {
  return (
    <AbsoluteFill>
      <MapboxPulse
        mapboxChildren={<MapboxYakaar />}
        label="YAKAAR-TERANGA"
        sublabel="GISEMENT GAZIER"
        pulseColor="#4db8ff"
        labelTriggerFrame={LABEL_FRAME}
        cx={0.5}
        cy={0.5}
      />
    </AbsoluteFill>
  );
};

export default Beat5;
