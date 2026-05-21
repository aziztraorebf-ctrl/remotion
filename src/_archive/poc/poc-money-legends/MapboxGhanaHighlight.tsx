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

const GHANA_LON = -1.0232;
const GHANA_LAT = 7.9465;

type CameraKeyframe = {
  frame: number;
  lon: number;
  lat: number;
  zoom: number;
  pitch: number;
  bearing: number;
};

// Zoom depuis espace vers Ghana
const KEYFRAMES: CameraKeyframe[] = [
  { frame: 0,   lon: 0,         lat: 10,       zoom: 1.2, pitch: 0,  bearing: 0 },
  { frame: 60,  lon: -2,        lat: 8,        zoom: 3.5, pitch: 20, bearing: 0 },
  { frame: 120, lon: GHANA_LON, lat: GHANA_LAT, zoom: 5.8, pitch: 45, bearing: -5 },
];

const lerpCamera = (frame: number): CameraKeyframe => {
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const a = KEYFRAMES[i];
    const b = KEYFRAMES[i + 1];
    if (frame >= a.frame && frame <= b.frame) {
      const t = (frame - a.frame) / (b.frame - a.frame);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      return {
        frame,
        lon: a.lon + (b.lon - a.lon) * ease,
        lat: a.lat + (b.lat - a.lat) * ease,
        zoom: a.zoom + (b.zoom - a.zoom) * ease,
        pitch: a.pitch + (b.pitch - a.pitch) * ease,
        bearing: a.bearing + (b.bearing - a.bearing) * ease,
      };
    }
  }
  return KEYFRAMES[KEYFRAMES.length - 1];
};

export const MapboxGhanaHighlight: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Mapbox Ghana highlight"));
  const [ready, setReady] = useState(false);

  const labelOpacity = interpolate(frame, [100, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
      center: [KEYFRAMES[0].lon, KEYFRAMES[0].lat],
      zoom: KEYFRAMES[0].zoom,
      pitch: KEYFRAMES[0].pitch,
      bearing: KEYFRAMES[0].bearing,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });

    mapRef.current = map;

    map.on("style.load", () => {
      // Supprimer tous les labels (noms pays, villes, routes)
      const layers = map.getStyle().layers ?? [];
      for (const layer of layers) {
        if (layer.type === "symbol") {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      }

      // Highlight Ghana en couleur or
      if (!map.getLayer("ghana-fill")) map.addLayer({
        id: "ghana-fill",
        type: "fill",
        source: {
          type: "vector",
          url: "mapbox://mapbox.country-boundaries-v1",
        },
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
        paint: {
          "fill-color": "#D4AF37",
          "fill-opacity": 0.6,
        },
      });

      // Bordure Ghana
      if (!map.getLayer("ghana-border")) map.addLayer({
        id: "ghana-border",
        type: "line",
        source: {
          type: "vector",
          url: "mapbox://mapbox.country-boundaries-v1",
        },
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "GHA"],
        paint: {
          "line-color": "#FFD700",
          "line-width": 2.5,
          "line-opacity": 0.9,
        },
      });

      // Point lumineux centré sur Ghana
      if (!map.getSource("ghana-point")) map.addSource("ghana-point", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: { type: "Point", coordinates: [GHANA_LON, GHANA_LAT] },
              properties: { name: "GHANA" },
            },
          ],
        },
      });

      if (!map.getLayer("ghana-pulse")) map.addLayer({
        id: "ghana-pulse",
        type: "circle",
        source: "ghana-point",
        paint: {
          "circle-radius": 8,
          "circle-color": "#FFD700",
          "circle-opacity": 0.9,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      setReady(true);
      continueRender(handle);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [handle]);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const cam = lerpCamera(frame);
    mapRef.current.jumpTo({
      center: [cam.lon, cam.lat],
      zoom: cam.zoom,
      pitch: cam.pitch,
      bearing: cam.bearing,
    });
  }, [frame, ready]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div ref={containerRef} style={{ width, height, position: "absolute" }} />

      {/* Label GHANA avec opacité progressive */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          opacity: labelOpacity,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.75)",
            border: "2px solid #D4AF37",
            borderRadius: 8,
            padding: "14px 32px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 42,
              fontWeight: 900,
              fontFamily: "Arial Black, sans-serif",
              color: "#D4AF37",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            GHANA
          </div>
          <div
            style={{
              fontSize: 20,
              fontFamily: "Arial, sans-serif",
              color: "rgba(255,255,255,0.8)",
              marginTop: 4,
              letterSpacing: "0.06em",
            }}
          >
            1er producteur d'or d'Afrique de l'Ouest
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const MAPBOX_GHANA_FRAMES = 180;
