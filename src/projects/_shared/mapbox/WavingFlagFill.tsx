// WavingFlagFill.tsx — Template N3.1 : drapeau ondulant dans la silhouette du pays
// Le canvas est redessine frame par frame avec un decalage sinusoidal.
// Donne vie au territoire — aucune chaine africaine ne fait ca.
// Fonctionne en headless : updateImage() frame par frame.

import React, { useEffect, useRef } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  applyGeoAfriqueV5,
  MapboxBrandingHide,
  MAPBOX_STYLES,
} from "./MapboxBase";
import { pushCanvas, drawFlagCanvas, countryFilter } from "./flagCanvas";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD   = "#c8a951";
const IVORY  = "#f2ebd9";
const NAVY   = "#16213a";

export interface WavingFlagFillProps {
  mainIso: string;
  mainGeoName?: string | string[]; // OBSOLETE : ignore, filtre par ISO
  mainBoundaryIsos?: string[];
  mainFlagOpacity?: number;
  mainBorderColor?: string;
  // Amplitude de l'ondulation (pixels sur canvas 512)
  waveAmplitude?: number;
  // Longueur d'onde (fraction de la largeur canvas, 0.0-1.0)
  waveFrequency?: number;
  // Vitesse de l'ondulation (rad/frame)
  waveSpeed?: number;
  // Pays secondaires (couleur unie, contexte)
  secondary?: Array<{ iso: string; color: string }>;
  // Camera
  center?: [number, number];
  baseZoom?: number;
  basePitch?: number;
  bearingStart?: number;
  bearingEnd?: number;
  flagCanvasSize?: number;
  // Enfants
  children?: React.ReactNode;
}

export const WavingFlagFill: React.FC<WavingFlagFillProps> = ({
  mainIso,
  mainGeoName,
  mainBoundaryIsos = [],
  mainFlagOpacity = 0.85,
  mainBorderColor = GOLD,
  waveAmplitude = 18,
  waveFrequency = 0.018,
  waveSpeed = 0.12,
  secondary = [],
  center = [20, 5],
  baseZoom = 4.0,
  basePitch = 0,
  bearingStart = -3,
  bearingEnd = 3,
  flagCanvasSize = 512,
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const containerRef  = useRef<HTMLDivElement>(null);
  const mapRef        = useRef<mapboxgl.Map | null>(null);
  const setupRef      = useRef(false);
  // Canvas source + canvas destination waving
  const srcCanvasRef  = useRef<HTMLCanvasElement | null>(null);
  const waveCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const iso = mainIso.toUpperCase();
  const mainFocusIsos = [iso, ...mainBoundaryIsos.map(s => s.toUpperCase())];
  const mainFilter = countryFilter(iso, mainBoundaryIsos);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Canvas source du drapeau (static, dessin une fois)
    const src = drawFlagCanvas(iso, flagCanvasSize);
    srcCanvasRef.current = src;

    // Canvas destination (ondulation appliquee frame par frame)
    const wave = document.createElement("canvas");
    wave.width = flagCanvasSize; wave.height = flagCanvasSize;
    waveCanvasRef.current = wave;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center, zoom: baseZoom, pitch: basePitch, bearing: bearingStart,
      interactive: false, attributionControl: false, fadeDuration: 0,
    });

    map.on("style.load", () => {
      try {
        (map as unknown as { setProjection: (p: string) => void }).setProjection("mercator");
        applyGeoAfriqueV5(map);

        if (!map.getSource("cb")) {
          map.addSource("cb", { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" });
        }

        // Injecter une premiere fois le canvas (f0)
        pushCanvas(map, `flag-wave-${iso}`, src);

        // Pays secondaires
        for (const sec of secondary) {
          const secIso = sec.iso.toUpperCase();
          if (!map.getLayer(`wave-sec-${secIso}`)) {
            map.addLayer({
              id: `wave-sec-${secIso}`, type: "fill",
              source: "cb", "source-layer": "country_boundaries",
              filter: ["==", ["get", "iso_3166_1_alpha_3"], secIso],
              paint: { "fill-color": sec.color, "fill-opacity": 0 },
            });
          }
        }

        // Fond neutre
        const excludedIsos = [...mainFocusIsos, ...secondary.map(s => s.iso.toUpperCase())];
        if (!map.getLayer("wave-neutral")) {
          map.addLayer({
            id: "wave-neutral", type: "fill",
            source: "cb", "source-layer": "country_boundaries",
            filter: ["!", ["in", ["get", "iso_3166_1_alpha_3"], ["literal", excludedIsos]]],
            paint: { "fill-color": IVORY, "fill-opacity": 0.04 },
          });
        }

        // Layer drapeau ondulant
        if (!map.getLayer("wave-flag")) {
          map.addLayer({
            id: "wave-flag", type: "fill",
            source: "cb", "source-layer": "country_boundaries",
            filter: mainFilter,
            paint: { "fill-pattern": `flag-wave-${iso}`, "fill-opacity": 0 },
          });
        }

        // Frontiere
        if (!map.getLayer("wave-border")) {
          map.addLayer({
            id: "wave-border", type: "line",
            source: "cb", "source-layer": "country_boundaries",
            filter: mainFilter,
            paint: { "line-color": mainBorderColor, "line-width": 2.0, "line-opacity": 0 },
          });
        }

        setupRef.current = true;
      } catch (_e) {}
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; setupRef.current = false; };
  }, []);

  // Engine frame — redessine l'ondulation a chaque frame
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const bearing = interpolate(frame, [0, durationInFrames], [bearingStart, bearingEnd], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    map.jumpTo({ center, zoom: baseZoom, pitch: basePitch, bearing });

    if (!setupRef.current || !srcCanvasRef.current || !waveCanvasRef.current) return;

    const src   = srcCanvasRef.current;
    const dst   = waveCanvasRef.current;
    const srcCtx = src.getContext("2d")!;
    const dstCtx = dst.getContext("2d")!;
    const S = flagCanvasSize;

    // Redessiner avec distorsion sinusoïdale horizontale
    const phase = frame * waveSpeed;
    const srcData = srcCtx.getImageData(0, 0, S, S);
    const dstData = dstCtx.createImageData(S, S);
    const src32  = srcData.data;
    const dst32  = dstData.data;

    for (let y = 0; y < S; y++) {
      // Decalage horizontal : amplitude varie le long de X (bord gauche fixe → bord droit max)
      const wave = Math.sin(y * waveFrequency * Math.PI * 2 + phase) * waveAmplitude;
      for (let x = 0; x < S; x++) {
        // Coordonnee source (avec decalage + modulo pour le wrapping)
        const srcX = ((Math.round(x + wave) % S) + S) % S;
        const dstIdx = (y * S + x) * 4;
        const srcIdx = (y * S + srcX) * 4;
        dst32[dstIdx]     = src32[srcIdx];
        dst32[dstIdx + 1] = src32[srcIdx + 1];
        dst32[dstIdx + 2] = src32[srcIdx + 2];
        dst32[dstIdx + 3] = src32[srcIdx + 3];
      }
    }

    dstCtx.putImageData(dstData, 0, 0);

    // Mettre a jour l'image dans Mapbox
    pushCanvas(map, `flag-wave-${iso}`, dst);

    const safe = (id: string, prop: string, val: unknown) => {
      try { if (map.getLayer(id)) (map.setPaintProperty as (a: string, b: string, c: unknown) => void)(id, prop, val); } catch (_e) {}
    };

    // Fade-in sur 40f
    const op = Math.min(1, frame / 40);
    safe("wave-flag", "fill-opacity", op * mainFlagOpacity);
    safe("wave-border", "line-opacity", op);

    // Pays secondaires
    for (const sec of secondary) {
      safe(`wave-sec-${sec.iso.toUpperCase()}`, "fill-opacity", op * 0.55);
    }
  });

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, backgroundColor: NAVY }} />
      <MapboxBrandingHide />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(to bottom,rgba(22,33,58,0.30) 0%,rgba(22,33,58,0.0) 40%,rgba(22,33,58,0.25) 100%)",
      }} />
      {children}
    </AbsoluteFill>
  );
};

// Preview : drapeau Maroc ondulant
export const WavingFlagFillPreview: React.FC = () => (
  <WavingFlagFill
    mainIso="MAR"
    mainBoundaryIsos={["ESH"]}
    center={[-5, 31]}
    baseZoom={5.0}
    secondary={[
      { iso: "ESP", color: "#c60b1e" },
      { iso: "DZA", color: "#006233" },
    ]}
  />
);
