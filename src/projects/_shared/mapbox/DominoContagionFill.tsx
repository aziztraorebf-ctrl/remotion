/**
 * DominoContagionFill — la couleur "contamine" les pays de proche en proche (reaction en chaine).
 *
 * Idee Gemini #2 (Chantier C v2, axe Aziz : dynamisme + couleur + accrocher l'oeil).
 * Au lieu d'allumer un bloc de pays d'un coup, une teinte gold se propage en VAGUES depuis un
 * epicentre : la source pulse, puis les voisins, puis les voisins des voisins. Onde de choc
 * geopolitique qui raconte une expansion d'influence SANS aucune fleche.
 *
 * Technique :
 *   - Vraie carte Mapbox dessous (drift, voisins ivory, ocean navy).
 *   - Propagation pilotee par des VAGUES d'ISO fournies en prop (waves[][]) : controle narratif
 *     total (plus fiable qu'un calcul d'adjacence Turf automatique, et synchronisable a la voix).
 *   - Chaque vague : fill country-boundaries-v1 dont l'opacite monte avec un flash a l'allumage,
 *     reste allumee. Delai croissant entre vagues (stagger).
 *
 * Usage :
 *   <DominoContagionFill center={[3,15]} baseZoom={3.2}
 *     waves={[ ["MLI"], ["BFA","NER"], ["DZA","MRT","TCD","NGA"] ]}
 *     waveAt={12} waveGap={22} epicenterIso="MLI" />
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
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { applyGeoAfriqueV5, MapboxBrandingHide, COUNTRY_CENTERS } from "./MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD = "#c8a951";
const IVORY = "#f2ebd9";

export interface DominoContagionFillProps {
  center: [number, number];
  baseZoom?: number;
  /** Vagues de propagation : waves[0] = epicentre, waves[1] = voisins, etc. */
  waves: string[][];
  /** Frame d'allumage de la 1ere vague */
  waveAt?: number;
  /** Delai (frames) entre chaque vague */
  waveGap?: number;
  /** ISO de l'epicentre (pour un pulse marque + label optionnel) */
  epicenterIso?: string;
  epicenterLabel?: string;
  accentColor?: string;
  driftAmplitude?: number;
  durationFrames?: number;
}

export const DominoContagionFill: React.FC<DominoContagionFillProps> = ({
  center,
  baseZoom = 3.2,
  waves,
  waveAt = 12,
  waveGap = 22,
  epicenterIso,
  epicenterLabel,
  accentColor = GOLD,
  driftAmplitude = 0.6,
  durationFrames = 180,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("DominoContagion init"));
  const [ready, setReady] = useState(false);
  const [epiPos, setEpiPos] = useState<{ x: number; y: number } | null>(null);

  const effZoom = baseZoom + (isVertical ? 0 : -0.4);

  // Tous les ISO a plat + leur vague
  const isoWave: Record<string, number> = {};
  waves.forEach((w, wi) => w.forEach((iso) => (isoWave[iso] = wi)));
  const allIso = Object.keys(isoWave);

  const fillId = (iso: string) => `dom-fill-${iso}`;
  const lineId = (iso: string) => `dom-line-${iso}`;
  const neighborsId = "dom-neighbors";

  // Init map
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
      if (!map.getSource("cb-source")) {
        map.addSource("cb-source", {
          type: "vector",
          url: "mapbox://mapbox.country-boundaries-v1",
        });
      }
      if (!map.getLayer(neighborsId)) {
        map.addLayer({
          id: neighborsId,
          type: "fill",
          source: "cb-source",
          "source-layer": "country_boundaries",
          filter: ["!", ["in", ["get", "iso_3166_1_alpha_3"], ["literal", allIso]]],
          paint: { "fill-color": IVORY, "fill-opacity": 0.04 },
        });
      }
      for (const iso of allIso) {
        if (!map.getLayer(fillId(iso))) {
          map.addLayer({
            id: fillId(iso),
            type: "fill",
            source: "cb-source",
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
            paint: { "fill-color": accentColor, "fill-opacity": 0 },
          });
        }
        if (!map.getLayer(lineId(iso))) {
          map.addLayer({
            id: lineId(iso),
            type: "line",
            source: "cb-source",
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
            paint: { "line-color": accentColor, "line-width": 1.5, "line-opacity": 0 },
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

  // Drift + propagation
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    const driftT = interpolate(frame, [0, durationFrames], [-1, 1]);
    const driftLon = isVertical ? 0 : driftT * driftAmplitude;
    const driftLat = isVertical ? driftT * driftAmplitude : 0;
    map.jumpTo({
      center: [center[0] + driftLon, center[1] + driftLat],
      zoom: effZoom + interpolate(frame, [0, durationFrames], [0, 0.1]),
      bearing: 0,
      pitch: 0,
    });

    for (const iso of allIso) {
      const wave = isoWave[iso];
      const at = waveAt + wave * waveGap;
      const rel = frame - at;
      const isEpi = iso === epicenterIso;
      // fill : flash a l'allumage puis stable (epicentre plus intense)
      const peak = isEpi ? 0.7 : 0.5;
      const fillOp = interpolate(rel, [0, 6, 16], [0, peak + 0.15, peak], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      // pulse perpetuel doux apres allumage
      const breathe =
        rel > 16 ? peak + 0.05 * Math.sin((rel - 16) * 0.1) : fillOp;
      const lineOp = interpolate(rel, [0, 8], [0, 0.85], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const lineW = interpolate(rel, [0, 6, 16], [1, 3.5, 2], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      try {
        map.setPaintProperty(fillId(iso), "fill-opacity", rel > 16 ? breathe : fillOp);
        map.setPaintProperty(lineId(iso), "line-opacity", lineOp);
        map.setPaintProperty(lineId(iso), "line-width", lineW);
      } catch {}
    }

    if (epicenterIso && COUNTRY_CENTERS[epicenterIso]) {
      const s = map.project(COUNTRY_CENTERS[epicenterIso]);
      setEpiPos({ x: s.x, y: s.y });
    }
  }, [frame, ready, center, effZoom, durationFrames, isVertical, driftAmplitude]);

  const globalOpacity = interpolate(
    frame,
    [durationFrames - 12, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Onde concentrique a l'epicentre (renforce le point de depart)
  const epiRel = frame - waveAt;
  const labelSize = isVertical ? 40 : 32;

  return (
    <AbsoluteFill style={{ background: "#16213a", opacity: globalOpacity }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      <MapboxBrandingHide />

      {/* Onde a l'epicentre */}
      {epiPos && epiRel > 0 && (
        <svg
          width={width}
          height={height}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          {[0, 1, 2].map((i) => {
            const t = ((epiRel - i * 8) % 50) / 50;
            if (t < 0) return null;
            const r = interpolate(t, [0, 1], [10, 90]);
            const op = interpolate(t, [0, 0.2, 1], [0, 0.6, 0]);
            return (
              <circle
                key={i}
                cx={epiPos.x}
                cy={epiPos.y}
                r={r}
                fill="none"
                stroke={accentColor}
                strokeWidth={2}
                opacity={op}
              />
            );
          })}
        </svg>
      )}

      {/* Label epicentre */}
      {epiPos && epicenterLabel && (
        <div
          style={{
            position: "absolute",
            left: epiPos.x,
            top: epiPos.y,
            transform: "translate(-50%, -50%)",
            opacity: interpolate(frame - waveAt, [10, 24], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              color: IVORY,
              fontSize: labelSize,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              textShadow: "0 2px 14px rgba(0,0,0,0.95)",
            }}
          >
            {epicenterLabel}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};

export default DominoContagionFill;
