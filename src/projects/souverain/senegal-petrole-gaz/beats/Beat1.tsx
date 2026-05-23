import React, { useEffect, useRef } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import mapboxgl from "mapbox-gl";
import {
  MapboxBrandingHide,
  MAPBOX_STYLES,
  applyGeoAfriqueV5,
  addCountryHighlight,
  ISO,
} from "../../../_shared/mapbox/MapboxBase";

// Beat 1 — Segment A (0:00 – 0:12)
// Carte GéoAfrique V5 plein écran — Mercator top-down
// Sénégal highlight gold + label apparaît à 10s
// Zoom progressif 0s→10s, stable 10s→12s

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// Caméra Mercator — vue Afrique de l'Ouest → Sénégal côte
const CAM_START = { lon: -10.00, lat: 12.00, zoom: 3.5, pitch: 0, bearing: 0 };
const CAM_END   = { lon: -15.50, lat: 14.50, zoom: 6.5, pitch: 0, bearing: 0 };

const DURATION_S  = 18.46; // durée réelle narration (forced-alignment)
const LABEL_START_S = 3.0; // label apparaît pendant le flyover pour ancrer le sujet

const SENEGAL_GOLD = "#c8a951";

export const Beat1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const DURATION_F    = Math.round(DURATION_S * fps);
  const LABEL_FRAME   = Math.round(LABEL_START_S * fps);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);

  // Init carte
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: [CAM_START.lon, CAM_START.lat],
      zoom: CAM_START.zoom,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
    });

    map.on("style.load", () => {
      (map as unknown as { setProjection: (p: string) => void }).setProjection("mercator");
      applyGeoAfriqueV5(map);
      // Palette éclaircie — terres plus claires, océan moins profond
      const safe = (id: string, prop: string, val: unknown) => {
        try { if (map.getLayer(id)) (map.setPaintProperty as (id: string, prop: string, val: unknown) => void)(id, prop, val); } catch {}
      };
      safe("land",      "background-color", "#5a5a5a");
      safe("landuse",   "fill-color",       "#5a5a5a");
      safe("landcover", "fill-color",       "#545454");
      safe("water",     "fill-color",       "#2a4f72");
      safe("water-shadow", "fill-color",    "#2a4f72");
      addCountryHighlight(map, ISO.SENEGAL, SENEGAL_GOLD, 0.55, 2, "b1-");
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Mouvement caméra — zoom sur 85% de la durée, stable ensuite
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const ZOOM_FRAMES = Math.round(DURATION_F * 0.85);
    const raw  = Math.max(0, Math.min(1, frame / Math.max(1, ZOOM_FRAMES)));
    // Ease-in-out cubic — démarre vite, ralentit en arrivant
    const ease = raw < 0.5
      ? 4 * raw * raw * raw
      : 1 - Math.pow(-2 * raw + 2, 3) / 2;

    map.jumpTo({
      center: [
        CAM_START.lon + (CAM_END.lon - CAM_START.lon) * ease,
        CAM_START.lat + (CAM_END.lat - CAM_START.lat) * ease,
      ],
      zoom: CAM_START.zoom + (CAM_END.zoom - CAM_START.zoom) * ease,
    });
  }, [frame, DURATION_F]);

  // Label spring — apparaît à LABEL_FRAME
  const labelP = spring({
    frame: frame - LABEL_FRAME,
    fps,
    config: { damping: 18, stiffness: 140 },
    durationInFrames: 20,
  });
  const labelOpacity = interpolate(labelP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const labelY       = interpolate(labelP, [0, 1], [-12, 0], { extrapolateRight: "clamp" });

  // Position label — centré sur Sénégal dans la vue finale (approximation screen-space)
  // Sénégal est à ~[-14.5, 14.5] — en vue finale zoom 6.5 centré sur [-15.5, 14.5]
  // Le pays apparaît légèrement à droite du centre
  const LABEL_X = width * 0.54;
  const LABEL_Y = height * 0.42;

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a2535" }}>
      <MapboxBrandingHide />

      {/* Carte plein écran */}
      <div
        ref={containerRef}
        style={{ position: "absolute", inset: 0, width, height }}
      />

      {/* Vignette très légère — bords uniquement */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 60%, rgba(10,15,25,0.35) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Label SÉNÉGAL — style bandeau atlas */}
      <div
        style={{
          position: "absolute",
          left: LABEL_X,
          top: LABEL_Y,
          transform: `translateY(${labelY}px)`,
          opacity: labelOpacity,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 0,
        }}
      >
        {/* Bandeau pays */}
        <div
          style={{
            backgroundColor: "rgba(26,37,53,0.88)",
            padding: "8px 20px 7px 20px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 4,
              height: 22,
              backgroundColor: SENEGAL_GOLD,
              flexShrink: 0,
            }}
          />
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 26,
              fontWeight: 700,
              color: "#f2ebd9",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            SÉNÉGAL
          </div>
        </div>
        {/* Sous-ligne gold — production depuis juin 2024 */}
        <div
          style={{
            backgroundColor: "rgba(26,37,53,0.75)",
            padding: "5px 20px 5px 34px",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 18,
            fontWeight: 400,
            color: SENEGAL_GOLD,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          PÉTROLE & GAZ — DEPUIS 2024
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Beat1;
