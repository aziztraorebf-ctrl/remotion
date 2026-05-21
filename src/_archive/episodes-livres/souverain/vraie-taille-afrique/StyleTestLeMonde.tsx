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
import { MapboxBrandingHide, removeLabels } from "../../_shared/mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// Camera : Afrique entiere centree, projection Mercator standard
// Zoom 2.5 = continent entier visible en 9:16
const CAM_START = { lon: 20.0, lat: 2.0, zoom: 2.3, pitch: 0, bearing: 0 };
const CAM_END   = { lon: 20.0, lat: 2.0, zoom: 2.6, pitch: 0, bearing: 0 };

export const STYLE_TEST_LE_MONDE_FRAMES = 150; // 5s at 30fps

// Style palette "Le Monde epure" — inspire de la capture validee
// Fond tres sombre, terres gris charbon, frontières fines et a peine visibles
// Palette v3 — fine-tune Gemini 3.1 Pro
// Contraste terre/eau accru + Afrique desaturee + Mercator plat
const PALETTE = {
  background:   "#3a3a35",  // cadre externe sombre (Le Monde)
  ocean:        "#9ca8b4",  // gris ardoise moyen — contraste net avec terres
  land:         "#e3dac5",  // beige chaud avec du corps
  landAfrica:   "#c2a672",  // ocre desature — hierarchie sans saturation excessive
  border:       "#ffffff",  // frontieres mondiales blanches 0.75px
  borderAfrica: "#ffffff",  // frontieres intra-africaines blanches
  labels:       "#4a4a4a",  // labels gris fonce
} as const;

export const StyleTestLeMonde: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("mapbox-style-test"));

  const progress = frame / STYLE_TEST_LE_MONDE_FRAMES;

  // Slow zoom-in pendant les 5s pour voir la carte en mouvement
  const zoom = interpolate(progress, [0, 1], [CAM_START.zoom, CAM_END.zoom], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade-in rapide sur les 15 premieres frames
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/empty-v9",
      center: [CAM_START.lon, CAM_START.lat],
      zoom: CAM_START.zoom,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      fadeDuration: 0,
      projection: { name: "mercator" },
    });

    mapRef.current = map;

    map.on("style.load", () => {
      // Style empty-v9 : aucun layer par defaut — tout ajouter manuellement

      // Fond ocean (background)
      map.addLayer({
        id: "background",
        type: "background",
        paint: { "background-color": PALETTE.ocean },
      });

      // Source Natural Earth pour terres + frontieres
      map.addSource("mapbox-terrain", {
        type: "vector",
        url: "mapbox://mapbox.mapbox-terrain-v2",
      });

      // Source pays pour terres + frontieres
      map.addSource("country-boundaries", {
        type: "vector",
        url: "mapbox://mapbox.country-boundaries-v1",
      });

      // Terres mondiales — beige chaud
      map.addLayer({
        id: "world-fill",
        type: "fill",
        source: "country-boundaries",
        "source-layer": "country_boundaries",
        paint: {
          "fill-color": PALETTE.land,
          "fill-opacity": 1,
        },
      });

      // Afrique highlight — ocre desature
      map.addLayer({
        id: "africa-fill",
        type: "fill",
        source: "country-boundaries",
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "continent_code"], "AF"],
        paint: {
          "fill-color": PALETTE.landAfrica,
          "fill-opacity": 1,
        },
      });

      // Frontieres mondiales blanches fines
      map.addLayer({
        id: "country-borders",
        type: "line",
        source: "country-boundaries",
        "source-layer": "country_boundaries",
        paint: {
          "line-color": PALETTE.border,
          "line-width": 0.75,
          "line-opacity": 0.6,
        },
      });

      continueRender(handle);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Update camera chaque frame
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setZoom(zoom);
    mapRef.current.setCenter([CAM_START.lon, CAM_START.lat]);
  });

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.background }}>
      <MapboxBrandingHide />
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%", opacity }}
      />

      {/* Label de test en overlay */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "Georgia, serif",
          fontSize: 28,
          color: "rgba(58,58,53,0.6)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}>
          Style Test — Le Monde épuré
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
