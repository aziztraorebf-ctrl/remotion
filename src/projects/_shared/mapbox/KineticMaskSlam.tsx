/**
 * KineticMaskSlam — HOOK d'ouverture : un CHIFFRE/MOT geant slamme, la carte n'est visible
 * qu'A L'INTERIEUR du texte, puis le texte zoome a l'infini pour devenir une fenetre qui
 * revele la carte complete.
 *
 * Idee Gemini #1 (Chantier HOOK, brief Aziz : punch frame 0, pas contemplatif).
 * Mecanique (seconde par seconde @30fps) :
 *   0-0.5s   : fond navy, le chiffre geant slamme au centre (spring rebond)
 *   0.5-1.5s : le texte sert de MASQUE → on voit la carte (en drift) seulement dans les lettres
 *   1.5-2.5s : scale exponentiel du texte jusqu'a ce qu'un contre-forme (trou) remplisse l'ecran
 *   2.5s+    : la carte pleine est revelee + le pays focus s'allume gold
 *
 * Contrainte tuiles respectee : la carte Mapbox fait un DRIFT FLUIDE continu (jamais de snap).
 * Toute la violence cinetique = overlay SVG (mask + scale), pas la camera.
 *
 * Usage :
 *   <KineticMaskSlam center={[-7,31]} baseZoom={4.6} bigText="90%"
 *     subText="DES RESERVES MONDIALES" focusIso="MAR" />
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
const NAVY = "#16213a";

export interface KineticMaskSlamProps {
  center: [number, number];
  baseZoom?: number;
  /** Gros texte/chiffre choc (ex: "90%") */
  bigText: string;
  /** Sous-texte sous le reveal (ex: "DES RESERVES MONDIALES") */
  subText?: string;
  /** Pays a allumer apres le reveal */
  focusIso?: string;
  accentColor?: string;
  /** Frame du slam */
  slamAt?: number;
  /** Frame du debut du zoom-reveal */
  revealAt?: number;
  durationFrames?: number;
}

export const KineticMaskSlam: React.FC<KineticMaskSlamProps> = ({
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
  const [handle] = useState(() => delayRender("KineticMaskSlam init"));
  const [ready, setReady] = useState(false);

  const effZoom = baseZoom + (isVertical ? 0 : -0.4);
  const focusFillId = `kms-fill-${focusIso}`;
  const focusLineId = `kms-line-${focusIso}`;

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

  // Drift fluide + allumage pays apres reveal
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

  // ── Animation du texte-masque ───────────────────────────────────────────────
  // Slam : scale rebond
  const slam = spring({
    frame: frame - slamAt,
    fps,
    config: { damping: 11, stiffness: 200, mass: 0.8 },
    durationInFrames: 20,
  });
  // Zoom-reveal : scale exponentiel apres revealAt
  const revealProg = interpolate(frame - revealAt, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // scale du texte : 1 (pose) → enorme (le trou remplit l'ecran)
  const textScale = slam * (1 + revealProg * revealProg * 30);

  // Apres le reveal complet, on masque le texte (la carte est pleine)
  const maskActive = frame < revealAt + 30;
  // opacite du voile navy (qui cache la carte hors-texte) : disparait au reveal
  const veilOpacity = interpolate(frame - revealAt, [18, 30], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bigFontSize = isVertical ? width * 0.42 : height * 0.5;
  const subOpacity = interpolate(frame - (revealAt + 24), [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const globalOpacity = interpolate(
    frame,
    [durationFrames - 10, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const maskId = "kms-textmask";

  return (
    <AbsoluteFill style={{ background: NAVY, opacity: globalOpacity }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      <MapboxBrandingHide />

      {/* Voile navy avec trou en forme de texte : la carte n'est visible que dans le texte */}
      {maskActive && veilOpacity > 0.01 && (
        <svg
          width={width}
          height={height}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <defs>
            <mask id={maskId}>
              {/* tout opaque (navy visible) sauf le texte (trou = carte visible) */}
              <rect x="0" y="0" width={width} height={height} fill="white" />
              <g
                transform={`translate(${width / 2} ${height / 2}) scale(${textScale}) translate(${-width / 2} ${-height / 2})`}
              >
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
          {/* le voile navy, troue par le texte */}
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill={NAVY}
            opacity={veilOpacity}
            mask={`url(#${maskId})`}
          />
        </svg>
      )}

      {/* Contour gold du texte pendant la pose (avant le zoom) pour le punch */}
      {frame >= slamAt && frame < revealAt + 6 && (
        <svg
          width={width}
          height={height}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <g
            transform={`translate(${width / 2} ${height / 2}) scale(${textScale}) translate(${-width / 2} ${-height / 2})`}
          >
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
      )}

      {/* Sous-texte apres reveal */}
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

export default KineticMaskSlam;
