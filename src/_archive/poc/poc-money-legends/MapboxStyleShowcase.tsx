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

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const STYLE_DURATION = 150; // 5s à 30fps par style

const STYLES = [
  {
    id: "dark-v11",
    url: "mapbox://styles/mapbox/dark-v11",
    label: "DARK",
    sublabel: "Data viz · Type B analytique",
    color: "#D4AF37",
    cam: { lon: -1.0, lat: 8.0, zoom: 3.8, pitch: 30, bearing: 0 },
  },
  {
    id: "satellite-v9",
    url: "mapbox://styles/mapbox/satellite-v9",
    label: "SATELLITE",
    sublabel: "Impact visuel · Hook d'ouverture",
    color: "#7EB8F7",
    cam: { lon: -1.0, lat: 8.0, zoom: 4.2, pitch: 45, bearing: -10 },
  },
  {
    id: "outdoors-v12",
    url: "mapbox://styles/mapbox/outdoors-v12",
    label: "RELIEF",
    sublabel: "Topographie · Hannibal / traversées",
    color: "#8BC34A",
    cam: { lon: -1.0, lat: 8.0, zoom: 4.0, pitch: 55, bearing: 15 },
  },
  {
    id: "light-v11",
    url: "mapbox://styles/mapbox/light-v11",
    label: "LIGHT",
    sublabel: "Editorial · Infographie classique",
    color: "#555555",
    cam: { lon: -1.0, lat: 8.0, zoom: 3.8, pitch: 20, bearing: 0 },
  },
  {
    id: "navigation-night-v1",
    url: "mapbox://styles/mapbox/navigation-night-v1",
    label: "NUIT NAVIGATION",
    sublabel: "Moderne · Routes et flux",
    color: "#64B5F6",
    cam: { lon: -1.0, lat: 8.0, zoom: 3.8, pitch: 35, bearing: -5 },
  },
];

const TOTAL_FRAMES = STYLES.length * STYLE_DURATION;

export const MapboxStyleShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Mapbox Style Showcase"));
  const [ready, setReady] = useState(false);
  const [currentStyleIdx, setCurrentStyleIdx] = useState(0);

  const styleIdx = Math.min(Math.floor(frame / STYLE_DURATION), STYLES.length - 1);
  const frameInStyle = frame % STYLE_DURATION;

  // Transition fade entre styles
  const fadeOut = interpolate(frameInStyle, [110, 140], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelOpacity = interpolate(frameInStyle, [15, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const activeStyle = STYLES[styleIdx];

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: STYLES[0].url,
      center: [STYLES[0].cam.lon, STYLES[0].cam.lat],
      zoom: STYLES[0].cam.zoom,
      pitch: STYLES[0].cam.pitch,
      bearing: STYLES[0].cam.bearing,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });

    mapRef.current = map;

    const addGhanaLayer = () => {
      if (!map.getSource("mapbox-country-boundaries")) {
        map.addSource("mapbox-country-boundaries", {
          type: "vector",
          url: "mapbox://mapbox.country-boundaries-v1",
        });
      }
      if (map.getLayer("ghana-fill"))   map.removeLayer("ghana-fill");
      if (map.getLayer("ghana-border")) map.removeLayer("ghana-border");
      map.addLayer({
        id: "ghana-fill",
        type: "fill",
        source: "mapbox-country-boundaries",
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
        paint: { "fill-color": "#D4AF37", "fill-opacity": 0.6 },
      });
      map.addLayer({
        id: "ghana-border",
        type: "line",
        source: "mapbox-country-boundaries",
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
        paint: { "line-color": "#FFD700", "line-width": 2.5, "line-opacity": 0.9 },
      });
    };

    map.on("style.load", () => {
      const layers = map.getStyle().layers ?? [];
      for (const layer of layers) {
        if (layer.type === "symbol") {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      }
      addGhanaLayer();
      setReady(true);
      continueRender(handle);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [handle]);

  // Changer le style quand on change de phase
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    if (styleIdx === currentStyleIdx) return;

    const map = mapRef.current;
    setCurrentStyleIdx(styleIdx);
    map.setStyle(STYLES[styleIdx].url);

    map.once("style.load", () => {
      const layers = map.getStyle().layers ?? [];
      for (const layer of layers) {
        if (layer.type === "symbol") {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      }
      if (!map.getSource("mapbox-country-boundaries")) {
        map.addSource("mapbox-country-boundaries", {
          type: "vector",
          url: "mapbox://mapbox.country-boundaries-v1",
        });
      }
      if (map.getLayer("ghana-fill"))   map.removeLayer("ghana-fill");
      if (map.getLayer("ghana-border")) map.removeLayer("ghana-border");
      map.addLayer({
        id: "ghana-fill",
        type: "fill",
        source: "mapbox-country-boundaries",
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
        paint: { "fill-color": "#D4AF37", "fill-opacity": 0.6 },
      });
      map.addLayer({
        id: "ghana-border",
        type: "line",
        source: "mapbox-country-boundaries",
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
        paint: { "line-color": "#FFD700", "line-width": 2.5, "line-opacity": 0.9 },
      });
    });
  }, [styleIdx, ready, currentStyleIdx]);

  // Mise à jour caméra
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const cam = STYLES[styleIdx].cam;
    mapRef.current.jumpTo({
      center: [cam.lon, cam.lat],
      zoom: cam.zoom,
      pitch: cam.pitch,
      bearing: cam.bearing,
    });
  }, [frame, ready, styleIdx]);

  // Compteur style (ex: "2 / 5")
  const counter = `${styleIdx + 1} / ${STYLES.length}`;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div
        ref={containerRef}
        style={{ width, height, position: "absolute", opacity: fadeOut }}
      />

      {/* Badge style en haut à gauche */}
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 48,
          opacity: labelOpacity,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.82)",
            border: `2px solid ${activeStyle.color}`,
            borderRadius: 8,
            padding: "10px 24px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontFamily: "Arial, sans-serif",
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            STYLE MAPBOX · {counter}
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 900,
              fontFamily: "Arial Black, sans-serif",
              color: activeStyle.color,
              letterSpacing: "0.08em",
            }}
          >
            {activeStyle.label}
          </div>
          <div
            style={{
              fontSize: 15,
              fontFamily: "Arial, sans-serif",
              color: "rgba(255,255,255,0.65)",
              marginTop: 2,
            }}
          >
            {activeStyle.sublabel}
          </div>
        </div>
      </div>

      {/* Barre de progression en bas */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: "rgba(255,255,255,0.1)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(frame / TOTAL_FRAMES) * 100}%`,
            backgroundColor: activeStyle.color,
            transition: "none",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const MAPBOX_STYLE_SHOWCASE_FRAMES = TOTAL_FRAMES;
