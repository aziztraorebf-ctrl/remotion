/**
 * SequentialBorderPulse — illumination SEQUENTIELLE des frontieres (synchro syllabe).
 *
 * Plan Gemini (Chantier C, priorite HAUTE — "effet vivant : frontieres") :
 *   Chaque pays s'allume EXACTEMENT sur son beat : flash bordure gold (opacite 1.0 -> 0.8)
 *   + interieur qui se teinte subtilement + line-blur pour le glow. Effet "allumage de
 *   tableau de bord strategique" (Playbook P1 apparition sequentielle + P3 remplissage).
 *
 * Technique (specifiee par Gemini) :
 *   - Layers Mapbox 'line' + 'fill' SEPARES par pays.
 *   - Animation frame par frame de line-opacity / line-width / line-blur via useCurrentFrame.
 *   - Flash a l'allumage (overshoot opacite) puis stabilisation.
 *
 * Drift adaptatif V/H (Playbook P2) :
 *   - Vertical (9:16) : drift sur la latitude (haut/bas).
 *   - Horizontal (16:9) : drift sur la longitude (gauche/droite) pour maximiser l'espace.
 *
 * Usage :
 *   <SequentialBorderPulse
 *     center={[-3, 29]} baseZoom={4.2}
 *     sequence={[
 *       { iso: "MAR", at: 12, label: "MAROC" },
 *       { iso: "DZA", at: 40, label: "ALGERIE" },
 *       { iso: "MRT", at: 68, label: "MAURITANIE" },
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
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { applyGeoAfriqueV5, MapboxBrandingHide, COUNTRY_CENTERS } from "./MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD = "#c8a951";
const IVORY = "#f2ebd9";

export interface BorderPulseStep {
  /** ISO 3166-1 alpha-3 */
  iso: string;
  /** Frame d'allumage (= beat syllabe) */
  at: number;
  /** Label affiche (optionnel) */
  label?: string;
}

export interface SequentialBorderPulseProps {
  center: [number, number];
  baseZoom?: number;
  /** Sequence d'allumage : pays + frame + label */
  sequence: BorderPulseStep[];
  accentColor?: string;
  /** Amplitude du drift (degres). Defaut 1.2. */
  driftAmplitude?: number;
  durationFrames?: number;
}

export const SequentialBorderPulse: React.FC<SequentialBorderPulseProps> = ({
  center,
  baseZoom = 4.2,
  sequence,
  accentColor = GOLD,
  driftAmplitude = 1.2,
  durationFrames = 150,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("SequentialBorderPulse init"));
  const [ready, setReady] = useState(false);
  // Positions ecran des labels (projetees depuis le centre de chaque pays)
  const [labelPos, setLabelPos] = useState<Record<string, { x: number; y: number }>>(
    {}
  );

  const effZoom = baseZoom + (isVertical ? 0 : -0.5);

  const fillId = (iso: string) => `pulse-fill-${iso}`;
  const lineId = (iso: string) => `pulse-line-${iso}`;

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

      if (!map.getSource("cb-source")) {
        map.addSource("cb-source", {
          type: "vector",
          url: "mapbox://mapbox.country-boundaries-v1",
        });
      }

      // Un couple fill+line par pays de la sequence
      for (const step of sequence) {
        if (!map.getLayer(fillId(step.iso))) {
          map.addLayer({
            id: fillId(step.iso),
            type: "fill",
            source: "cb-source",
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], step.iso],
            paint: { "fill-color": accentColor, "fill-opacity": 0 },
          });
        }
        if (!map.getLayer(lineId(step.iso))) {
          map.addLayer({
            id: lineId(step.iso),
            type: "line",
            source: "cb-source",
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], step.iso],
            paint: {
              "line-color": accentColor,
              "line-width": 1,
              "line-opacity": 0,
              "line-blur": 0,
            },
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

  // ── Drive camera (drift adaptatif) + pulses sequentiels ─────────────────────
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;

    // Drift : latitude en vertical, longitude en horizontal
    const driftT = interpolate(frame, [0, durationFrames], [-1, 1]);
    const driftLon = isVertical ? 0 : driftT * driftAmplitude;
    const driftLat = isVertical ? driftT * driftAmplitude : 0;
    const driftZoom = effZoom + interpolate(frame, [0, durationFrames], [0, 0.12]);
    map.jumpTo({
      center: [center[0] + driftLon, center[1] + driftLat],
      zoom: driftZoom,
      bearing: 0,
      pitch: 0,
    });

    // Pulse par pays : flash a l'allumage, puis stabilisation
    for (const step of sequence) {
      const rel = frame - step.at;
      // line-opacity : 0 -> 1 (flash) -> 0.85 (stable)
      const lineOp = interpolate(rel, [0, 6, 14], [0, 1, 0.85], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      // line-width : overshoot a l'allumage (1 -> 4 -> 2.5)
      const lineW = interpolate(rel, [0, 6, 16], [1, 4, 2.5], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      // line-blur (glow) : pic au flash puis retombe
      const lineBlur = interpolate(rel, [0, 6, 20], [0, 6, 1.5], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      // interieur teinte subtilement (P3) : 0 -> 0.18
      const fillOp = interpolate(rel, [0, 14], [0, 0.18], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      // pulse perpetuel doux apres allumage (tableau de bord vivant)
      const breathe = rel > 16 ? 0.85 + 0.06 * Math.sin((rel - 16) * 0.12) : lineOp;
      try {
        map.setPaintProperty(
          lineId(step.iso),
          "line-opacity",
          rel > 16 ? breathe : lineOp
        );
        map.setPaintProperty(lineId(step.iso), "line-width", lineW);
        map.setPaintProperty(lineId(step.iso), "line-blur", lineBlur);
        map.setPaintProperty(fillId(step.iso), "fill-opacity", fillOp);
      } catch {}
    }

    // Projeter le centre de chaque pays pour positionner les labels
    const pos: Record<string, { x: number; y: number }> = {};
    for (const step of sequence) {
      const c = COUNTRY_CENTERS[step.iso];
      if (c) {
        const s = map.project(c);
        pos[step.iso] = { x: s.x, y: s.y };
      }
    }
    setLabelPos(pos);
  }, [
    frame,
    ready,
    center,
    effZoom,
    durationFrames,
    isVertical,
    driftAmplitude,
    sequence,
  ]);

  const globalOpacity = interpolate(
    frame,
    [durationFrames - 12, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const labelSize = isVertical ? 34 : 28;

  return (
    <AbsoluteFill style={{ background: "#16213a", opacity: globalOpacity }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      <MapboxBrandingHide />

      {/* Labels ancres au centre de chaque pays — apparaissent a l'allumage */}
      {sequence.map((step) => {
        if (!step.label || !labelPos[step.iso]) return null;
        const rel = frame - step.at;
        const op = interpolate(rel, [8, 20], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (op <= 0.01) return null;
        return (
          <div
            key={step.iso}
            style={{
              position: "absolute",
              left: labelPos[step.iso].x,
              top: labelPos[step.iso].y,
              transform: "translate(-50%, -50%)",
              opacity: op,
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
                textShadow: "0 2px 12px rgba(0,0,0,0.9)",
              }}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export default SequentialBorderPulse;
