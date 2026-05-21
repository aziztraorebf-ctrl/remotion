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
import { MapboxBrandingHide, removeLabels } from "../_shared/mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const MAPBOX_HEATMAP_V2_FRAMES = 180; // 6s @ 30fps

const CAM = { lon: -2.0, lat: 13.5, zoom: 3.6, pitch: 0, bearing: 0 };

const POINTS = [
  { lon: -17.4, lat: 14.7, weight: 1.0 },  // Dakar
  { lon:  -3.0, lat: 16.8, weight: 0.9 },  // Tombouctou
  { lon:  -1.7, lat: 12.4, weight: 0.8 },  // Ouagadougou
  { lon:   7.9, lat: 16.9, weight: 0.75 }, // Agadez
  { lon:   2.1, lat: 13.5, weight: 0.7 },  // Niamey
  { lon:  -0.2, lat:  5.6, weight: 0.9 },  // Accra
  { lon:   3.4, lat:  6.5, weight: 0.95 }, // Lagos
];

// Centre des isochrones — Tombouctou
const TIMBUKTU: [number, number] = [-3.0, 16.8];

// Labels isochrones
const ISO_LABELS = ["500km", "1000km", "1500km"];
// Rayons en px ecran pour les 3 cercles
const ISO_RADII = [40, 80, 120];
// Circumference pour dasharray animation (2*pi*r)
const circum = (r: number) => 2 * Math.PI * r;

// ---------------------------------------------------------------------------
// Overlay SVG — Isochrones depuis Tombouctou
// ---------------------------------------------------------------------------
const IsochronesOverlay: React.FC<{
  frame: number;
  map: mapboxgl.Map | null;
}> = ({ frame, map }) => {
  if (!map) return null;

  const center = map.project(TIMBUKTU);

  return (
    <svg
      style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
      width="100%"
      height="100%"
    >
      {ISO_RADII.map((r, i) => {
        const c = circum(r);
        // Offset diminue chaque frame pour donner une rotation
        const offset = -(frame * 1.2 + i * 30) % c;

        return (
          <g key={i}>
            {/* Cercle isochrone anime */}
            <circle
              cx={center.x}
              cy={center.y}
              r={r}
              fill="none"
              stroke="#D4AF37"
              strokeWidth={1.2}
              strokeDasharray={`${c * 0.6} ${c * 0.4}`}
              strokeDashoffset={offset}
              opacity={0.55}
            />
            {/* Label a droite du cercle */}
            <text
              x={center.x + r + 6}
              y={center.y + 4}
              fill="#D4AF37"
              fontSize={9}
              fontFamily="Georgia, serif"
              letterSpacing={1.2}
              opacity={0.8}
            >
              {ISO_LABELS[i]}
            </text>
          </g>
        );
      })}
      {/* Point central Tombouctou */}
      <circle cx={center.x} cy={center.y} r={5} fill="#D4AF37" opacity={0.95} />
      <circle cx={center.x} cy={center.y} r={2} fill="#1a1209" opacity={1} />
      <text
        x={center.x + 10}
        y={center.y - 8}
        fill="#D4AF37"
        fontSize={9}
        fontFamily="Georgia, serif"
        letterSpacing={1.5}
        opacity={0.9}
      >
        TOMBOUCTOU
      </text>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Label titre
// ---------------------------------------------------------------------------
const TitleLabel: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 60,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      pointerEvents: "none",
    }}
  >
    <div
      style={{
        background: "rgba(255,255,255,0.82)",
        padding: "7px 24px",
        borderRadius: 4,
        fontFamily: "Georgia, serif",
        fontSize: 11,
        letterSpacing: 2.5,
        color: "#1a1209",
        fontWeight: 700,
        boxShadow: "0 1px 6px rgba(0,0,0,0.15)",
      }}
    >
      DENSITE COMMERCIALE — SAHEL XIIIe s.
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Composition principale
// ---------------------------------------------------------------------------
export const MapboxHeatmapV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("mapbox-heatmap-v2"));
  const [ready, setReady] = useState(false);

  // Initialisation carte
  useEffect(() => {
    if (!containerRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [CAM.lon, CAM.lat],
      zoom: CAM.zoom,
      pitch: CAM.pitch,
      bearing: CAM.bearing,
      interactive: false,
      preserveDrawingBuffer: true,
    });

    map.on("style.load", () => {
      removeLabels(map);

      // Source GeoJSON heatmap
      if (!map.getSource("heatmap-source")) {
        map.addSource("heatmap-source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: POINTS.map((p) => ({
              type: "Feature",
              geometry: { type: "Point", coordinates: [p.lon, p.lat] },
              properties: { weight: p.weight },
            })),
          },
        });
      }

      // Layer heatmap — palette or→orange→rouge
      if (!map.getLayer("heatmap-layer")) {
        map.addLayer({
          id: "heatmap-layer",
          type: "heatmap",
          source: "heatmap-source",
          paint: {
            "heatmap-weight": ["interpolate", ["linear"], ["get", "weight"], 0, 0, 1, 1],
            "heatmap-intensity": 1.0,
            "heatmap-radius": 50,
            "heatmap-opacity": 0.8,
            "heatmap-color": [
              "interpolate", ["linear"], ["heatmap-density"],
              0,   "rgba(0,0,0,0)",
              0.2, "rgba(212,175,55,0.4)",
              0.4, "rgba(230,150,30,0.65)",
              0.65,"rgba(200,80,10,0.8)",
              0.85,"rgba(180,30,5,0.9)",
              1.0, "rgba(150,0,0,1)",
            ],
          },
        });
      }

      mapRef.current = map;
      setReady(true);
      continueRender(handle);
    });

    return () => map.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Respiration : heatmap-intensity oscille via Math.sin
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const intensity = 0.8 + 0.4 * ((Math.sin(frame * 0.05) + 1) / 2);
    // heatmap-intensity varie entre 0.8 et 1.6
    mapRef.current.setPaintProperty("heatmap-layer", "heatmap-intensity", intensity);
  }, [frame, ready]);

  return (
    <AbsoluteFill style={{ background: "#e8e4dc" }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />

      {ready && (
        <IsochronesOverlay frame={frame} map={mapRef.current} />
      )}

      <TitleLabel />
    </AbsoluteFill>
  );
};
