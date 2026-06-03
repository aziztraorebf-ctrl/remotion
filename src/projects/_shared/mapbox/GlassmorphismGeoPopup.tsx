/**
 * GlassmorphismGeoPopup — encarts d'information premium ancres a un point geographique.
 *
 * Plan Gemini (Chantier C — "effet vivant : habillage narratif", Playbook P5) :
 *   Encarts minimalistes (fond navy translucide glassmorphism, fine bordure or) relies
 *   par une ligne fine au point geo. Apparition sequentielle au rythme de la voix.
 *
 * Technique (specifiee par Gemini) :
 *   - Marqueurs HTML superposes a la carte (glassmorphism via backdrop-filter).
 *   - Ligne de liaison dessinee en SVG overlay : coords (x,y) projetees depuis (lng,lat)
 *     Mapbox A CHAQUE FRAME → la ligne et le dot suivent le drift de la camera.
 *
 * Positionnement hybride V/H :
 *   - Horizontal (16:9) : popups places sur les COTES (gauche/droite du point).
 *   - Vertical (9:16) : popups forces en HAUT/BAS du point (ecran etroit).
 *   (Override possible via step.side.)
 *
 * Usage :
 *   <GlassmorphismGeoPopup
 *     center={[-15, 14.5]} baseZoom={5.4}
 *     points={[
 *       { coord: [-17.15, 13.45], at: 14, title: "SANGOMAR", value: "100 000 b/j" },
 *       { coord: [-16.9, 16.5],  at: 48, title: "GTA",       value: "2,5 Tcf gaz" },
 *     ]}
 *   />
 *
 * IMPORTANT : render via scripts/render-mapbox.sh (WebGL headless).
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
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { applyGeoAfriqueV5, MapboxBrandingHide } from "./MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD = "#c8a951";
const IVORY = "#f2ebd9";

export interface GeoPopupStep {
  /** [lon, lat] du point ancre */
  coord: [number, number];
  /** Frame d'apparition (= beat voix) */
  at: number;
  title: string;
  value?: string;
  /** Force le cote du popup. Defaut : auto selon format + position. */
  side?: "left" | "right" | "top" | "bottom";
}

export interface GlassmorphismGeoPopupProps {
  center: [number, number];
  baseZoom?: number;
  /** ISO du pays a highlighter discretement (optionnel, contexte) */
  highlightIso?: string;
  points: GeoPopupStep[];
  accentColor?: string;
  driftAmplitude?: number;
  durationFrames?: number;
}

export const GlassmorphismGeoPopup: React.FC<GlassmorphismGeoPopupProps> = ({
  center,
  baseZoom = 5.4,
  highlightIso,
  points,
  accentColor = GOLD,
  driftAmplitude = 0.8,
  durationFrames = 150,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("GlassmorphismGeoPopup init"));
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState<Record<number, { x: number; y: number }>>(
    {}
  );

  const effZoom = baseZoom + (isVertical ? 0 : -0.5);

  // Offsets de l'encart par rapport au point (px), selon cote
  const OFFSET = isVertical ? 220 : 260;
  const offsetFor = (side: GeoPopupStep["side"]) => {
    switch (side) {
      case "left":
        return { dx: -OFFSET, dy: 0 };
      case "right":
        return { dx: OFFSET, dy: 0 };
      case "top":
        return { dx: 0, dy: -OFFSET };
      case "bottom":
        return { dx: 0, dy: OFFSET };
      default:
        // auto : vertical → haut/bas alterne ; horizontal → gauche/droite alterne
        return { dx: 0, dy: 0 };
    }
  };

  // ── Init map ──────────────────────────────────────────────────────────────
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
      center,
      zoom: effZoom,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });
    mapRef.current = map;

    map.on("style.load", () => {
      try {
        (map as mapboxgl.Map & { setProjection?: (p: string) => void }).setProjection?.(
          "mercator"
        );
      } catch {}
      applyGeoAfriqueV5(map);

      if (highlightIso) {
        if (!map.getSource("cb-source")) {
          map.addSource("cb-source", {
            type: "vector",
            url: "mapbox://mapbox.country-boundaries-v1",
          });
        }
        if (!map.getLayer("hl-fill")) {
          map.addLayer({
            id: "hl-fill",
            type: "fill",
            source: "cb-source",
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], highlightIso],
            paint: { "fill-color": accentColor, "fill-opacity": 0.1 },
          });
        }
        if (!map.getLayer("hl-line")) {
          map.addLayer({
            id: "hl-line",
            type: "line",
            source: "cb-source",
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], highlightIso],
            paint: { "line-color": accentColor, "line-width": 1.5, "line-opacity": 0.5 },
          });
        }
      }

      setReady(true);
      continueRender(handle);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Drive camera (drift) + projeter points ──────────────────────────────────
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;

    const driftT = interpolate(frame, [0, durationFrames], [-1, 1]);
    const driftLon = isVertical ? 0 : driftT * driftAmplitude;
    const driftLat = isVertical ? driftT * driftAmplitude : 0;
    const driftZoom = effZoom + interpolate(frame, [0, durationFrames], [0, 0.1]);
    map.jumpTo({
      center: [center[0] + driftLon, center[1] + driftLat],
      zoom: driftZoom,
      bearing: 0,
      pitch: 0,
    });

    const pos: Record<number, { x: number; y: number }> = {};
    points.forEach((p, i) => {
      const s = map.project(p.coord);
      pos[i] = { x: s.x, y: s.y };
    });
    setScreen(pos);
  }, [
    frame,
    ready,
    center,
    effZoom,
    durationFrames,
    isVertical,
    driftAmplitude,
    points,
  ]);

  const globalOpacity = interpolate(
    frame,
    [durationFrames - 12, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Resolution du cote auto (alternance selon format)
  const resolveOffset = (step: GeoPopupStep, i: number) => {
    if (step.side) return offsetFor(step.side);
    if (isVertical) {
      return i % 2 === 0
        ? { dx: 0, dy: -OFFSET }
        : { dx: 0, dy: OFFSET };
    }
    return i % 2 === 0 ? { dx: -OFFSET, dy: 0 } : { dx: OFFSET, dy: 0 };
  };

  const titleSize = isVertical ? 30 : 24;
  const valueSize = isVertical ? 40 : 32;

  return (
    <AbsoluteFill style={{ background: "#16213a", opacity: globalOpacity }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      <MapboxBrandingHide />

      {/* SVG overlay : lignes de liaison point → encart */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {points.map((step, i) => {
          const sp = screen[i];
          if (!sp) return null;
          const rel = frame - step.at;
          const lineProg = interpolate(rel, [0, 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          if (lineProg <= 0.01) return null;
          const { dx, dy } = resolveOffset(step, i);
          const endX = sp.x + dx;
          const endY = sp.y + dy;
          const curX = sp.x + (endX - sp.x) * lineProg;
          const curY = sp.y + (endY - sp.y) * lineProg;
          const pulse = 1 + 0.3 * Math.sin(frame * 0.18);
          return (
            <g key={i} opacity={lineProg}>
              {/* dot ancre au point geo */}
              <circle cx={sp.x} cy={sp.y} r={9 * pulse} fill="none" stroke={accentColor} strokeWidth={1.5} opacity={0.5} />
              <circle cx={sp.x} cy={sp.y} r={4} fill={accentColor} />
              {/* ligne fine de liaison */}
              <line
                x1={sp.x}
                y1={sp.y}
                x2={curX}
                y2={curY}
                stroke={accentColor}
                strokeWidth={1.5}
                strokeOpacity={0.8}
              />
            </g>
          );
        })}
      </svg>

      {/* Encarts glassmorphism (HTML pour backdrop-filter) */}
      {points.map((step, i) => {
        const sp = screen[i];
        if (!sp) return null;
        const rel = frame - step.at;
        const appear = spring({
          frame: rel - 8,
          fps: 30,
          config: { damping: 16, stiffness: 120, mass: 0.8 },
          durationInFrames: 18,
        });
        if (appear <= 0.01) return null;
        const { dx, dy } = resolveOffset(step, i);
        const boxX = sp.x + dx;
        const boxY = sp.y + dy;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: boxX,
              top: boxY,
              transform: `translate(-50%, -50%) scale(${appear})`,
              opacity: appear,
              pointerEvents: "none",
              background: "rgba(22,33,58,0.55)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: `1px solid ${accentColor}`,
              borderRadius: 8,
              padding: isVertical ? "14px 20px" : "12px 18px",
              minWidth: isVertical ? 180 : 160,
              boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
            }}
          >
            <div
              style={{
                color: accentColor,
                fontSize: titleSize,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
              }}
            >
              {step.title}
            </div>
            {step.value && (
              <div
                style={{
                  color: IVORY,
                  fontSize: valueSize,
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  marginTop: 6,
                  fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                }}
              >
                {step.value}
              </div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export default GlassmorphismGeoPopup;
