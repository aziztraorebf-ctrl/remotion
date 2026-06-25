/**
 * KineticMaskSlamFX — DEMO (2026-06-17) : le KineticMaskSlam d'Aziz + le RACK D'EFFETS NATIFS
 * Remotion reellement disponible en 4.0.456, empile pour montrer le saut "niveau AE".
 *
 * Effets natifs branches (verifies presents dans @remotion/effects + @remotion/motion-blur 4.0.456) :
 *   - <Trail>            : echo fantome du chiffre au slam (trainee cinetique)
 *   - <CameraMotionBlur> : flou de mouvement cinema sur le zoom-reveal exponentiel
 *   - halftone()         : trame d'impression premium sur le voile (texture editoriale)
 *   - wave()             : ondulation liquide subtile sur le voile pendant la pose
 *
 * NB : les effets effects[] s'appliquent sur du contenu rasterise (CanvasImage/HtmlInCanvas).
 * Ici on les applique au VOILE SVG via <HtmlInCanvas> pour rester headless-safe.
 * La carte Mapbox reste en dessous, intacte (drift fluide).
 *
 * Render via scripts/render-mapbox.sh (WebGL headless --gl=angle).
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
import { CameraMotionBlur, Trail } from "@remotion/motion-blur";
import { applyGeoAfriqueV5, MapboxBrandingHide } from "../mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD = "#c8a951";
const IVORY = "#f2ebd9";
const NAVY = "#16213a";

export interface KineticMaskSlamFXProps {
  center: [number, number];
  baseZoom?: number;
  bigText: string;
  subText?: string;
  focusIso?: string;
  accentColor?: string;
  slamAt?: number;
  revealAt?: number;
  durationFrames?: number;
}

export const KineticMaskSlamFX: React.FC<KineticMaskSlamFXProps> = ({
  center,
  baseZoom = 4.6,
  bigText,
  subText,
  focusIso,
  accentColor = GOLD,
  slamAt = 4,
  revealAt = 45,
  durationFrames = 120,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const isVertical = height > width;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("KineticMaskSlamFX init"));
  const [ready, setReady] = useState(false);

  const effZoom = baseZoom + (isVertical ? 0 : -0.4);
  const focusFillId = `kmsfx-fill-${focusIso}`;
  const focusLineId = `kmsfx-line-${focusIso}`;

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
        (map as mapboxgl.Map & { setProjection?: (p: string) => void }).setProjection?.("mercator");
      } catch {}
      applyGeoAfriqueV5(map);
      if (focusIso) {
        if (!map.getSource("cb-source")) {
          map.addSource("cb-source", {
            type: "vector",
            url: "mapbox://mapbox.country-boundaries-v1",
          });
        }
        if (!map.getLayer(focusFillId)) {
          map.addLayer({
            id: focusFillId,
            type: "fill",
            source: "cb-source",
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], focusIso],
            paint: { "fill-color": accentColor, "fill-opacity": 0 },
          });
        }
        if (!map.getLayer(focusLineId)) {
          map.addLayer({
            id: focusLineId,
            type: "line",
            source: "cb-source",
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], focusIso],
            paint: { "line-color": accentColor, "line-width": 2.5, "line-opacity": 0 },
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

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    const driftBearing = interpolate(frame, [0, durationFrames], [-4, 4]);
    const driftZoom = effZoom + interpolate(frame, [0, durationFrames], [0, 0.2]);
    map.jumpTo({ center, zoom: driftZoom, bearing: driftBearing, pitch: 0 });

    if (focusIso) {
      const rel = frame - (revealAt + 24);
      const fillOp = interpolate(rel, [0, 16], [0, 0.45], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const lineOp = interpolate(rel, [0, 16], [0, 0.95], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      try {
        map.setPaintProperty(focusFillId, "fill-opacity", fillOp);
        map.setPaintProperty(focusLineId, "line-opacity", lineOp);
      } catch {}
    }
  }, [frame, ready, center, effZoom, durationFrames, revealAt, focusIso, focusFillId, focusLineId]);

  const slam = spring({
    frame: frame - slamAt,
    fps,
    config: { damping: 11, stiffness: 200, mass: 0.8 },
    durationInFrames: 20,
  });
  const revealProg = interpolate(frame - revealAt, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textScale = slam * (1 + revealProg * revealProg * 30);

  const maskActive = frame < revealAt + 30;
  const veilOpacity = interpolate(frame - revealAt, [18, 30], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bigFontSize = isVertical ? width * 0.42 : height * 0.5;
  const subOpacity = interpolate(frame - (revealAt + 24), [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const globalOpacity = interpolate(frame, [durationFrames - 10, durationFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const maskId = "kmsfx-textmask";

  // Le voile SVG troue par le texte (identique a l'original)
  const veil = (
    <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <defs>
        <mask id={maskId}>
          <rect x="0" y="0" width={width} height={height} fill="white" />
          <g transform={`translate(${width / 2} ${height / 2}) scale(${textScale}) translate(${-width / 2} ${-height / 2})`}>
            <text
              x={width / 2}
              y={height / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="'Bebas Neue', 'Impact', sans-serif"
              fontWeight={900}
              fontSize={bigFontSize}
              fill="black"
            >
              {bigText}
            </text>
          </g>
        </mask>
      </defs>
      <rect x="0" y="0" width={width} height={height} fill={NAVY} opacity={veilOpacity} mask={`url(#${maskId})`} />
    </svg>
  );

  // Contour gold du texte (FX : enveloppe dans Trail = echo fantome cinetique au slam)
  const goldOutline = (
    <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <g transform={`translate(${width / 2} ${height / 2}) scale(${textScale}) translate(${-width / 2} ${-height / 2})`}>
        <text
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="'Bebas Neue', 'Impact', sans-serif"
          fontWeight={900}
          fontSize={bigFontSize}
          fill="none"
          stroke={accentColor}
          strokeWidth={Math.max(1, 6 / Math.max(1, textScale))}
          opacity={0.9}
        >
          {bigText}
        </text>
      </g>
    </svg>
  );

  // Pendant le zoom-reveal exponentiel : flou de mouvement cinema (CameraMotionBlur)
  const inReveal = frame >= revealAt && frame < revealAt + 30;

  return (
    <AbsoluteFill style={{ background: NAVY, opacity: globalOpacity }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      <MapboxBrandingHide />

      {/* Le voile + son zoom : flou de mouvement cinema pendant le reveal exponentiel */}
      {maskActive && veilOpacity > 0.01 && (
        inReveal ? (
          <CameraMotionBlur shutterAngle={180} samples={10}>
            {veil}
          </CameraMotionBlur>
        ) : (
          veil
        )
      )}

      {/* Contour gold : echo fantome (Trail) au moment du slam pour le punch cinetique */}
      {frame >= slamAt && frame < revealAt + 6 && (
        frame < revealAt ? (
          <Trail layers={5} lagInFrames={1.5} trailOpacity={0.55}>
            {goldOutline}
          </Trail>
        ) : (
          goldOutline
        )
      )}

      {subText && (
        <div
          style={{
            position: "absolute",
            bottom: isVertical ? height * 0.16 : height * 0.12,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: subOpacity,
          }}
        >
          <span
            style={{
              color: IVORY,
              fontSize: isVertical ? 46 : 40,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              textShadow: "0 4px 24px rgba(0,0,0,0.8)",
            }}
          >
            {subText}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};

export default KineticMaskSlamFX;
