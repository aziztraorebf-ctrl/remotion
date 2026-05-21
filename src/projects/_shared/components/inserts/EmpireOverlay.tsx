/**
 * Template Insert — EmpireOverlay
 *
 * Frontières d'un empire historique se superposent à la carte Mapbox moderne.
 * GeoJSON depuis world_1300.geojson (aourednik, CC BY-SA 4.0).
 * Villes historiques via SVG overlay + map.project().
 *
 * Stack : Mapbox GL JS + CartoCaspian Sepia + addLayer GeoJSON fill + SVG overlay React
 * Durée : 120 frames (4s @ 30fps)
 *
 * Animation :
 *   f0–15   : carte fade-in
 *   f15–45  : polygon empire fade-in (fill-opacity 0→0.7)
 *   f30–50  : titre + dates slide-up spring
 *   f45–60  : dots villes scale-up spring
 *   f60–80  : panel données slide-up spring
 *   f0–120  : zoom progressif 3.5→4.2 (drift centre empire)
 *   permanent: Niani pulse sinus
 */

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  addCountryHighlight,
  lerpCam,
  MapboxBrandingHide,
} from "../../mapbox/MapboxBase";
import {
  applyCartoCaspian,
  CartoCaspianOverlay,
  CASPIAN_SEPIA,
} from "../../mapbox/templates/CartoCaspian";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const EMPIRE_OVERLAY_FRAMES = 120;

interface CityDot {
  id: string;
  name: string;
  lonlat: [number, number];
  isCapital: boolean;
}

const MALI_CITIES: CityDot[] = [
  { id: "niani",    name: "Niani",    lonlat: [-8.3,  11.4], isCapital: true  },
  { id: "timbuktu", name: "Tombouctou", lonlat: [-3.0, 16.7], isCapital: false },
  { id: "djenne",   name: "Djenné",   lonlat: [-4.5,  13.9], isCapital: false },
];

const CAM_START = { lon:  0.0, lat: 15.0, zoom: 3.5, pitch: 0, bearing: 0 };
const CAM_END   = { lon: -4.0, lat: 15.0, zoom: 4.2, pitch: 0, bearing: 0 };

const GOLD   = "#d9b366";
const BORDER = "#a65933";
const IVORY  = "#ede5d3";
const DARK   = "#1a1510";

/**
 * Niveau de confiance géographique — INTERNE UNIQUEMENT, jamais affiché dans le rendu.
 * Claude le communique verbalement à Aziz lors de la création de chaque scène.
 *
 * precise     — époque moderne, frontières solides (données officielles ONU/Natural Earth)
 * estimated   — reconstruction historique basée sur sources académiques (aourednik, atlas)
 * approximate — très incertain : sources rares, frontières contestées ou empires très anciens
 *
 * Exemples :
 *   Ghana ~1050        → approximate  (Levtzion, peu de sources primaires)
 *   Mali ~1300         → estimated    (aourednik, atlas académiques)
 *   Songhaï ~1500      → estimated    (aourednik, sources arabes)
 *   Frontières modernes → precise     (Natural Earth / ONU)
 */
export type BorderConfidence = "precise" | "estimated" | "approximate";

export interface EmpireOverlayProps {
  empireName?: string;
  empireDate?: string;
  territory?: string;
  population?: string;
  capital?: string;
  modernCountries?: string[];
  geojsonFeatureName?: string;
  /** Source affichée discrètement dans le panel (ex: "aourednik / UNESCO") */
  borderSource?: string;
  /**
   * Niveau de confiance géographique — INTERNE, jamais rendu visuellement.
   * Claude le signale verbalement à Aziz lors de chaque création de scène.
   */
  borderConfidence?: BorderConfidence;
}

export const EmpireOverlay: React.FC<EmpireOverlayProps> = ({
  empireName          = "EMPIRE\nDU MALI",
  empireDate          = "1235 — 1645",
  territory           = "2,5 millions km²",
  population          = "40–50 millions",
  capital             = "Niani",
  modernCountries     = ["MALI", "SÉNÉGAL", "GUINÉE"],
  geojsonFeatureName = "Mali",
  borderSource       = "aourednik / UNESCO",
  borderConfidence   = "estimated",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const handleRef    = useRef<number | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [cityPixels, setCityPixels] = useState<Record<string, { x: number; y: number }>>({});

  // Camera lerp
  const camT = interpolate(frame, [0, EMPIRE_OVERLAY_FRAMES], [0, 1], { extrapolateRight: "clamp" });
  const cam  = lerpCam(CAM_START, CAM_END, camT);

  // Init Mapbox
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    handleRef.current = delayRender("EmpireOverlay map init");
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [CAM_START.lon, CAM_START.lat],
      zoom: CAM_START.zoom,
      pitch: CAM_START.pitch,
      bearing: CAM_START.bearing,
      interactive: false,
      preserveDrawingBuffer: true,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on("style.load", () => {
      applyCartoCaspian(map, CASPIAN_SEPIA);

      // Load world_1300 GeoJSON and add empire polygon
      fetch(staticFile("_shared/geo-data/world_1300.geojson"))
        .then((r) => r.json())
        .then((geojson) => {
          // Filter to the empire feature
          const empireFeature = geojson.features.find(
            (f: GeoJSON.Feature) =>
              (f.properties as Record<string, string>)?.NAME === geojsonFeatureName
          );

          const empireGeo = empireFeature
            ? { type: "FeatureCollection", features: [empireFeature] }
            : geojson;

          map.addSource("empire", {
            type: "geojson",
            data: empireGeo as GeoJSON.GeoJSON,
          });

          map.addLayer({
            id: "empire-fill",
            type: "fill",
            source: "empire",
            paint: {
              "fill-color": GOLD,
              "fill-opacity": 0,
            },
          });

          map.addLayer({
            id: "empire-border",
            type: "line",
            source: "empire",
            paint: {
              "line-color": BORDER,
              "line-width": 3,
              "line-opacity": 0,
            },
          });

          setMapReady(true);
          if (handleRef.current !== null) {
            continueRender(handleRef.current);
            handleRef.current = null;
          }
        })
        .catch((err) => {
          console.error("GeoJSON load error:", err);
          setMapReady(true);
          if (handleRef.current !== null) {
            continueRender(handleRef.current);
            handleRef.current = null;
          }
        });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [geojsonFeatureName]);

  // Camera + polygon opacity update on each frame
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    map.setCenter([cam.lon, cam.lat]);
    map.setZoom(cam.zoom);
    map.setPitch(cam.pitch);
    map.setBearing(cam.bearing);

    // Empire polygon fade f15→45
    const polyOpacity = interpolate(frame, [15, 45], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const borderOpacity = interpolate(frame, [15, 45], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    if (map.getLayer("empire-fill")) {
      map.setPaintProperty("empire-fill", "fill-opacity", polyOpacity);
    }
    if (map.getLayer("empire-border")) {
      map.setPaintProperty("empire-border", "line-opacity", borderOpacity);
    }

    // Compute city pixel positions
    const pixels: Record<string, { x: number; y: number }> = {};
    for (const city of MALI_CITIES) {
      const pt = map.project(city.lonlat as mapboxgl.LngLatLike);
      pixels[city.id] = { x: pt.x, y: pt.y };
    }
    setCityPixels(pixels);
  });

  // --- Animations ---

  const mapOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Title slide-up f30→50
  const titleY = interpolate(
    spring({ frame: frame - 30, fps, config: { damping: 80, stiffness: 60 } }),
    [0, 1], [40, 0],
    { extrapolateRight: "clamp" }
  );
  const titleOp = interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Panel slide-up f60→80
  const panelY = interpolate(
    spring({ frame: frame - 60, fps, config: { damping: 80, stiffness: 60 } }),
    [0, 1], [60, 0],
    { extrapolateRight: "clamp" }
  );
  const panelOp = interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // City dots scale f45→60
  const cityScale = interpolate(
    spring({ frame: frame - 45, fps, config: { damping: 70, stiffness: 70 } }),
    [0, 1], [0, 1],
    { extrapolateRight: "clamp" }
  );

  // Niani pulse permanent (capital dot)
  const nianPulse = 1 + 0.25 * Math.sin(frame / 12);

  // Modern countries list opacity
  const modernOp = interpolate(frame, [65, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: DARK }}>
      {/* Mapbox */}
      <div
        ref={mapContainer}
        style={{
          position: "absolute",
          inset: 0,
          opacity: mapOpacity,
        }}
      />

      <CartoCaspianOverlay opacity={0.06} />
      <MapboxBrandingHide />

      {/* SVG overlay — city dots */}
      {mapReady && (
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
          viewBox="0 0 1080 1920"
          preserveAspectRatio="none"
        >
          {MALI_CITIES.map((city) => {
            const px = cityPixels[city.id];
            if (!px) return null;
            const sc = city.isCapital ? nianPulse * cityScale : cityScale;
            return (
              <g key={city.id} transform={`translate(${px.x}, ${px.y})`}>
                {city.isCapital && (
                  <circle
                    r={28 * sc}
                    fill="none"
                    stroke={GOLD}
                    strokeWidth={1.5}
                    opacity={0.35 * cityScale}
                  />
                )}
                <circle
                  r={city.isCapital ? 10 * sc : 7 * sc}
                  fill={GOLD}
                  stroke={BORDER}
                  strokeWidth={city.isCapital ? 3 : 2}
                  opacity={cityScale}
                />
                <text
                  x={city.isCapital ? 14 : 11}
                  y={5}
                  fontSize={city.isCapital ? 28 : 24}
                  fontFamily="Georgia, serif"
                  fill={IVORY}
                  opacity={cityScale}
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
                >
                  {city.name}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 60,
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
        }}
      >
        {empireName.split("\n").map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: i === 0 ? 120 : 108,
              fontWeight: "bold",
              color: IVORY,
              lineHeight: 1.0,
              letterSpacing: "0.04em",
              textShadow: `0 2px 20px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.7)`,
            }}
          >
            {line}
          </div>
        ))}
        <div
          style={{
            fontFamily: "'Arial Narrow', Arial, sans-serif",
            fontSize: 56,
            fontWeight: "bold",
            color: GOLD,
            letterSpacing: "0.08em",
            marginTop: 12,
            textShadow: `0 2px 12px rgba(0,0,0,0.8)`,
          }}
        >
          {empireDate}
        </div>
      </div>

      {/* Data panel */}
      <div
        style={{
          position: "absolute",
          bottom: 160,
          right: 40,
          opacity: panelOp,
          transform: `translateY(${panelY}px)`,
          background: "rgba(26, 21, 16, 0.88)",
          borderRadius: 16,
          padding: "28px 36px",
          minWidth: 380,
          backdropFilter: "blur(4px)",
          borderLeft: `3px solid ${GOLD}`,
        }}
      >
        {[
          ["TERRITOIRE", territory],
          ["POPULATION", population],
          ["CAPITALE", capital],
        ].map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontFamily: "Arial, sans-serif", fontSize: 22, fontWeight: "bold", color: GOLD, letterSpacing: "0.12em" }}>
              {label}
            </span>
            <span style={{ fontFamily: "Georgia, serif", fontSize: 22, color: IVORY }}>
              {value}
            </span>
          </div>
        ))}
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 14, color: "rgba(230, 210, 180, 0.5)", marginTop: 8 }}>
          Source : {borderSource}
        </div>
      </div>

      {/* Modern countries list */}
      <div
        style={{
          position: "absolute",
          bottom: 170,
          left: 60,
          opacity: modernOp,
        }}
      >
        {modernCountries.map((c) => (
          <div
            key={c}
            style={{
              fontFamily: "'Arial Narrow', Arial, sans-serif",
              fontSize: 30,
              fontWeight: "bold",
              color: "rgba(237, 229, 211, 0.6)",
              letterSpacing: "0.14em",
              lineHeight: 1.5,
            }}
          >
            {c}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
