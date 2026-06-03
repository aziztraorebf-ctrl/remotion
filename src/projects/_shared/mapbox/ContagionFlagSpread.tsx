// ContagionFlagSpread.tsx — Template N4.1 : propagation d'alliance par vagues + drapeaux
// Combine DominoContagionFill (onde de choc geopolitique) avec FlagFillSequence (identite).
// Chaque pays atteint par la vague recoit d'abord une couleur, puis son drapeau s'allume.
// Raconte : AES (Alliance des États du Sahel), CEDEAO, BRICS Africa, etc.
//
// Technique :
//   - waves[][] : meme structure que DominoContagionFill (control narratif total)
//   - Etape 1 : couleur de contagion (fill-color) s'allume → onde de choc
//   - Etape 2 : drapeau (fill-pattern) remplace la couleur → identite du pays
//   - flagDelay : frames apres l'allumage couleur avant que le drapeau monte
//
// Usage :
//   <ContagionFlagSpread
//     waves={[["MLI"],["BFA"],["NER"]]}
//     flagDelay={20}
//     epicenterIso="MLI"
//     waveAt={15} waveGap={25} />

import React, { useEffect, useRef } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  applyGeoAfriqueV5,
  MapboxBrandingHide,
  MAPBOX_STYLES,
} from "./MapboxBase";
import { pushFlagToMap } from "./flagCanvas";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD   = "#c8a951";
const IVORY  = "#f2ebd9";
const NAVY   = "#16213a";

export interface ContagionFlagSpreadProps {
  // Vagues : waves[0] = epicentre, waves[1] = voisins, etc. (ISO 3166-1 alpha-3)
  waves: string[][];
  // Frame d'allumage de la premiere vague (defaut : 0)
  waveAt?: number;
  // Delai entre chaque vague (frames, defaut : 25)
  waveGap?: number;
  // ISO de l'epicentre (label + dot special)
  epicenterIso?: string;
  epicenterLabel?: string;
  // Couleur de la premiere "contamination" (avant le drapeau)
  contagionColor?: string;
  contagionOpacity?: number;
  // Duree du flash couleur avant que le drapeau remplace (frames)
  flagDelay?: number;
  // Duree du fade-in drapeau (frames)
  flagFadeFrames?: number;
  // Opacite finale du drapeau
  flagOpacity?: number;
  // Couleur frontiere
  borderColor?: string;
  // Camera
  center?: [number, number];
  baseZoom?: number;
  basePitch?: number;
  bearingStart?: number;
  bearingEnd?: number;
  flagCanvasSize?: number;
  children?: React.ReactNode;
}

export const ContagionFlagSpread: React.FC<ContagionFlagSpreadProps> = ({
  waves,
  waveAt = 0,
  waveGap = 25,
  epicenterIso,
  contagionColor = GOLD,
  contagionOpacity = 0.55,
  flagDelay = 20,
  flagFadeFrames = 30,
  flagOpacity = 0.80,
  borderColor = GOLD,
  center = [0, 15],
  baseZoom = 4.0,
  basePitch = 0,
  bearingStart = -3,
  bearingEnd = 3,
  flagCanvasSize = 512,
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const setupRef     = useRef(false);

  // Aplatir toutes les ISO dans l'ordre des vagues + calculer le frame d'allumage
  const allEntries: Array<{ iso: string; waveFrame: number }> = [];
  for (let w = 0; w < waves.length; w++) {
    const wf = waveAt + w * waveGap;
    for (const iso of waves[w]) {
      allEntries.push({ iso: iso.toUpperCase(), waveFrame: wf });
    }
  }

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

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

        // Pre-injecter tous les drapeaux (synchrone, canvas pur)
        for (const { iso } of allEntries) {
          pushFlagToMap(map, iso, flagCanvasSize);
        }

        // Fond neutre
        const allIsos = allEntries.map(e => e.iso);
        if (!map.getLayer("cf-neutral")) {
          map.addLayer({
            id: "cf-neutral", type: "fill",
            source: "cb", "source-layer": "country_boundaries",
            filter: ["!", ["in", ["get", "iso_3166_1_alpha_3"], ["literal", allIsos]]],
            paint: { "fill-color": IVORY, "fill-opacity": 0.04 },
          });
        }

        // Pour chaque pays : layer couleur (contagion) + layer drapeau (identite)
        for (const { iso } of allEntries) {
          const filter: mapboxgl.Expression = ["==", ["get", "iso_3166_1_alpha_3"], iso];

          // Couleur contagion (flash rapide)
          if (!map.getLayer(`cf-color-${iso}`)) {
            map.addLayer({
              id: `cf-color-${iso}`, type: "fill",
              source: "cb", "source-layer": "country_boundaries",
              filter,
              paint: { "fill-color": contagionColor, "fill-opacity": 0 },
            });
          }

          // Drapeau (remplace la couleur apres flagDelay)
          if (!map.getLayer(`cf-flag-${iso}`)) {
            map.addLayer({
              id: `cf-flag-${iso}`, type: "fill",
              source: "cb", "source-layer": "country_boundaries",
              filter,
              paint: { "fill-pattern": `flag-${iso}`, "fill-opacity": 0 },
            });
          }

          // Frontiere
          if (!map.getLayer(`cf-border-${iso}`)) {
            map.addLayer({
              id: `cf-border-${iso}`, type: "line",
              source: "cb", "source-layer": "country_boundaries",
              filter,
              paint: { "line-color": borderColor, "line-width": 1.8, "line-opacity": 0 },
            });
          }
        }

        // Epicentre : dot CSS sera gere via React
        setupRef.current = true;
      } catch (_e) {}
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; setupRef.current = false; };
  }, []);

  // Engine frame
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const bearing = interpolate(frame, [0, durationInFrames], [bearingStart, bearingEnd], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    map.jumpTo({ center, zoom: baseZoom, pitch: basePitch, bearing });

    if (!setupRef.current) return;

    const safe = (id: string, prop: string, val: unknown) => {
      try { if (map.getLayer(id)) (map.setPaintProperty as (a: string, b: string, c: unknown) => void)(id, prop, val); } catch (_e) {}
    };

    for (const { iso, waveFrame } of allEntries) {
      if (frame < waveFrame) continue;

      const elapsed = frame - waveFrame;

      // Phase 1 : couleur contagion (de waveFrame a waveFrame + flagDelay)
      // Flash d'allumage puis disparait progressivement quand le drapeau arrive
      const colorFadeIn  = Math.min(1, elapsed / 15); // flash rapide
      const flagElapsed  = elapsed - flagDelay;
      const flagProgress = flagElapsed >= 0 ? Math.min(1, flagElapsed / flagFadeFrames) : 0;
      const flagEased    = 1 - Math.pow(1 - flagProgress, 3);

      // La couleur cede progressivement la place au drapeau
      const colorOpacity = colorFadeIn * contagionOpacity * (1 - flagEased);
      const flagFillOp   = flagEased * flagOpacity;

      safe(`cf-color-${iso}`, "fill-opacity", colorOpacity);
      safe(`cf-flag-${iso}`,  "fill-opacity", flagFillOp);
      safe(`cf-border-${iso}`, "line-opacity", colorFadeIn * 0.85);
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

// ── Previews ───────────────────────────────────────────────────────────────────

// AES — Alliance des États du Sahel (Mali, Burkina, Niger) + propagation regionale
export const ContagionFlagSpreadPreviewAES: React.FC = () => (
  <ContagionFlagSpread
    center={[-1, 14]} baseZoom={4.5}
    waves={[
      ["MLI"],
      ["BFA"],
      ["NER"],
      ["TCD", "MRT"],
    ]}
    waveAt={15} waveGap={30}
    epicenterIso="MLI"
    contagionColor="#c8a951"
    flagDelay={20}
  />
);

// BRICS Africa — vague de l'influence BRICS sur l'Afrique
export const ContagionFlagSpreadPreviewBRICS: React.FC = () => (
  <ContagionFlagSpread
    center={[20, 5]} baseZoom={3.5}
    waves={[
      ["ZAF"],
      ["EGY", "ETH"],
      ["NGA", "DZA"],
      ["COD", "TZA", "AGO"],
    ]}
    waveAt={10} waveGap={35}
    epicenterIso="ZAF"
    contagionColor="#c8a951"
    flagDelay={25}
  />
);
