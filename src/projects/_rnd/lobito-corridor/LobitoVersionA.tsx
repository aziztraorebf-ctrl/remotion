/**
 * LobitoVersionA — "Carte belge" Mapbox, esthétique Sudan warmap.
 *
 * Reprend EXACTEMENT le style validé SudanWarMapEpic60 :
 *   - Fond cream #F2E5C8, régions colorées data-driven
 *   - HUD : date en haut, tonnage + légende en bas, bandeau événement
 *   - Grain papier multiply 0.28, vignette douce
 *   - micro-wobble plaques parchemin
 *
 * Différence Sudan → Lobito :
 *   - "control" (qui domine territorialement) → "flux" (quelle route domine)
 *   - Rouge = Chine (flux est), Or = transition, Vert = Lobito/Occident
 *   - Compteur = tonnage exporté (Mt) au lieu de morts
 *   - Pas de sprites véhicules — les flèches AtlasAttackArrow portent le flux
 *   - Les flèches sont DOM (absolute) positionnées car Mapbox pitch 0
 *
 * Note : les flèches (AtlasAttackArrow) utilisent d3-geo SVG — elles vivent
 * dans un <svg> superposé en AbsoluteFill par-dessus le canvas Mapbox.
 * map.project() convertit les points clés lngLat → pixels pour les ancrer.
 */

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MapboxBrandingHide } from "../../_shared/mapbox/MapboxBase";
import {
  JALONS,
  LOBITO_COUNTRIES,
  fluxAt,
  fluxColor,
  jalonAt,
  tGlobalFromFrame,
  tonnageAt,
  FLUX_COLORS,
} from "./lobitoFluxData";

// ===========================================================================
// PALETTE — identique Sudan (cream belt)
// ===========================================================================
const ATLAS = {
  cream:  "#F2E5C8",
  ocean:  "#A8C4D4",   // bleu clair Sud warmap (pas le bleu nuit Atlas)
  land:   "#E8DCC8",   // fond neutre très clair (pays hors corridor)
  outline:"#1A1A1A",
  ink:    "#3A2A18",
  saf:    "#3E6E9E",   // bleu SAF Sudan (réutilisé pour visuels légende)
};

// Couleurs pays Lobito injectées dans Mapbox via setFeatureState
// (on utilise addCountryHighlight dynamique chaque frame)
const CORRIDOR_ISOS = ["COD", "ZMB", "AGO"];
const PERIPHERAL_ISOS = ["TZA", "MOZ"];

// ===========================================================================
// TIMING
// ===========================================================================
const FPS = 30;
export const LOBITO_A_FRAMES = 30 * FPS; // 900f = 30s

const T_START = Math.round(1.6 * FPS);
const T_END   = LOBITO_A_FRAMES - Math.round(2.0 * FPS);

// micro-wobble parchemin (signature Sudan)
const paperWobble = (frame: number, seed = 0) =>
  Math.sin((frame + seed) * 0.08) * 0.4;

// ===========================================================================
// FLÈCHES — tracées en SVG absolu superposé sur le canvas Mapbox
// Les positions sont recalculées chaque frame via map.project()
// ===========================================================================
const ARROW_WEST = { // Lubumbashi → Kolwezi → Lobito
  id: "west",
  color: FLUX_COLORS.lobito,
  label: "LOBITO · ATLANTIQUE",
  points: [
    [27.48, -11.67], // Lubumbashi
    [25.47, -10.72], // Kolwezi
    [19.91, -11.78], // Luena
    [13.55, -12.35], // Lobito
  ] as [number, number][],
};
const ARROW_EAST = { // Lubumbashi → Tanzanie → Dar es Salaam
  id: "east",
  color: FLUX_COLORS.china,
  label: "DAR ES SALAAM · CHINE",
  points: [
    [27.48, -11.67],
    [30.8,  -8.5 ],
    [36.8,  -7.4 ],
    [39.28, -6.82],
  ] as [number, number][],
};

// ===========================================================================
// COMPOSANT
// ===========================================================================
export const LobitoVersionA: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const [handle]     = useState(() => delayRender("LobitoA", { timeoutInMilliseconds: 60000 }));
  const [ready, setReady] = useState(false);
  // pixels pour les flèches SVG
  const [arrowPixels, setArrowPixels] = useState<
    { id: string; pts: { x: number; y: number }[] }[]
  >([]);

  const tGlobal = tGlobalFromFrame(frame, T_START, T_END);
  const { jalon, i: jIdx, f: jFrac } = jalonAt(tGlobal);
  const nextJalon = JALONS[Math.min(JALONS.length - 1, jIdx + 1)];
  const currentTonnage = tonnageAt(tGlobal);

  // flux moyen pour opacité des flèches
  const avgFluxCOD = fluxAt("COD", tGlobal);
  const arrowWestOp = interpolate(avgFluxCOD, [0.1, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrowEastOp = interpolate(avgFluxCOD, [0.0, 0.3], [1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // progress de dessin des flèches (se dessinent progressivement avec tGlobal)
  const westProgress = interpolate(tGlobal, [0.4, 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eastProgress = interpolate(tGlobal, [0.0, 0.5], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ---------------------------------------------------------------------------
  // Init Mapbox
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = process.env.REMOTION_MAPBOX_TOKEN ?? "";
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [22.0, -10.0],
      zoom: 3.6,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
      projection: { name: "mercator" } as any,
    });
    mapRef.current = map;

    map.on("style.load", async () => {
      // Reskin cream belge (plus clair que Sudan — fond vraiment blanc cassé)
      const layers = map.getStyle().layers ?? [];
      for (const l of layers) {
        if (l.type === "symbol") map.setLayoutProperty(l.id, "visibility", "none");
        if (l.id.includes("water")) {
          try { map.setPaintProperty(l.id, "fill-color", ATLAS.ocean); } catch {}
        }
        if (l.id === "land" || l.id.includes("landuse") || l.id.includes("landcover") ||
            l.id === "background" || l.id.includes("national-park")) {
          try { map.setPaintProperty(l.id, "background-color", ATLAS.land); } catch {}
          try { map.setPaintProperty(l.id, "fill-color", ATLAS.land); } catch {}
        }
        if (l.id.includes("admin-0")) {
          map.setPaintProperty(l.id, "line-color", ATLAS.outline);
          map.setPaintProperty(l.id, "line-width", 1.2);
        }
        if (l.id.includes("admin-1")) map.setPaintProperty(l.id, "line-color", "rgba(58,42,24,0.15)");
      }

      // Source pays corridors (country-boundaries Mapbox)
      if (!map.getSource("corridor-countries")) {
        map.addSource("corridor-countries", {
          type: "vector",
          url: "mapbox://mapbox.country-boundaries-v1",
        });
      }

      // Layer fill data-driven (mis à jour chaque frame via setPaintProperty)
      if (!map.getLayer("corridor-fill")) {
        map.addLayer({
          id: "corridor-fill",
          type: "fill",
          source: "corridor-countries",
          "source-layer": "country_boundaries",
          filter: ["in", ["get", "iso_3166_1_alpha_3"], ["literal", [...CORRIDOR_ISOS, ...PERIPHERAL_ISOS]]],
          paint: { "fill-color": FLUX_COLORS.china, "fill-opacity": 0.72 },
        });
      }
      // Outline corridor
      if (!map.getLayer("corridor-line")) {
        map.addLayer({
          id: "corridor-line",
          type: "line",
          source: "corridor-countries",
          "source-layer": "country_boundaries",
          filter: ["in", ["get", "iso_3166_1_alpha_3"], ["literal", CORRIDOR_ISOS]],
          paint: { "line-color": ATLAS.outline, "line-width": 2.2, "line-opacity": 0.7 },
        });
      }
      // Glow de front — pays en transition
      if (!map.getLayer("corridor-glow")) {
        map.addLayer({
          id: "corridor-glow",
          type: "line",
          source: "corridor-countries",
          "source-layer": "country_boundaries",
          filter: ["in", ["get", "iso_3166_1_alpha_3"], ["literal", CORRIDOR_ISOS]],
          paint: { "line-color": FLUX_COLORS.contested, "line-width": 4, "line-opacity": 0, "line-blur": 4 },
        });
      }

      setReady(true);
      map.once("idle", () => continueRender(handle));
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [handle]);

  // ---------------------------------------------------------------------------
  // Update frame
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;

    // Caméra légère drift (style Sudan)
    const camLon  = interpolate(tGlobal, [0, 1], [22.0, 20.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const camZoom = interpolate(frame, [0, T_START, T_END, LOBITO_A_FRAMES], [3.4, 3.7, 3.8, 3.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    map.jumpTo({ center: [camLon, -10.5], zoom: camZoom, pitch: 0, bearing: 0 });

    // Couleurs data-driven par pays
    const codColor  = fluxColor(fluxAt("COD", tGlobal));
    const zmbColor  = fluxColor(fluxAt("ZMB", tGlobal));
    const agoColor  = fluxColor(fluxAt("AGO", tGlobal));
    const tzaColor  = fluxColor(fluxAt("TZA", tGlobal) * 0.4); // périphérique, atténué
    const mozColor  = fluxColor(fluxAt("MOZ", tGlobal) * 0.3);

    // Mapbox ne supporte pas la couleur par feature individuelle via setPaintProperty
    // sans data-join. On utilise plusieurs layers filtrés par ISO.
    const updateCountry = (iso: string, color: string, opacity: number) => {
      const fillId = `flux-fill-${iso}`;
      if (!map.getLayer(fillId)) {
        if (!map.getSource("corridor-countries")) return;
        map.addLayer({
          id: fillId,
          type: "fill",
          source: "corridor-countries",
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
          paint: { "fill-color": color, "fill-opacity": opacity, "fill-color-transition": { duration: 400, delay: 0 } },
        });
      } else {
        (map.setPaintProperty as (id: string, prop: string, val: unknown) => void)(fillId, "fill-color", color);
        // glow de transition : intensité quand valeur proche de 0.5
        const fluxVal = fluxAt(iso, tGlobal);
        const glowInt = 1 - 2 * Math.abs(fluxVal - 0.5);
        const glowId = `flux-glow-${iso}`;
        if (!map.getLayer(glowId)) {
          map.addLayer({
            id: glowId,
            type: "line",
            source: "corridor-countries",
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
            paint: { "line-color": FLUX_COLORS.contested, "line-width": 5, "line-opacity": glowInt * 0.8, "line-blur": 3 },
          });
        } else {
          (map.setPaintProperty as (id: string, prop: string, val: unknown) => void)(glowId, "line-opacity", glowInt * 0.8);
        }
      }
    };

    updateCountry("COD", codColor, 0.78);
    updateCountry("ZMB", zmbColor, 0.72);
    updateCountry("AGO", agoColor, 0.70);
    updateCountry("TZA", tzaColor, 0.40);
    updateCountry("MOZ", mozColor, 0.35);

    // Projeter points des flèches en pixels
    const arrows = [ARROW_WEST, ARROW_EAST].map((a) => ({
      id: a.id,
      pts: a.points.map(([lon, lat]) => {
        const p = map.project([lon, lat]);
        return { x: p.x, y: p.y };
      }),
    }));
    setArrowPixels(arrows);

    const h = delayRender(`lobitoA-frame-${frame}`, { timeoutInMilliseconds: 40000 });
    let done = false;
    const finish = () => { if (!done) { done = true; continueRender(h); } };
    map.once("idle", finish);
    setTimeout(finish, map.areTilesLoaded() ? 300 : 1200);
  }, [frame, ready, tGlobal]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  const hudOp = interpolate(frame, [T_START - 2, T_START + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const introOp = interpolate(frame, [0, 6, T_START - 6, T_START + 4], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [LOBITO_A_FRAMES - 18, LOBITO_A_FRAMES], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const plaque: React.CSSProperties = {
    background: ATLAS.cream,
    border: `2px solid ${ATLAS.ink}`,
    borderRadius: 6,
    color: ATLAS.ink,
    boxShadow: "0 4px 18px rgba(0,0,0,0.28)",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  };

  // Flèche SVG tracée depuis les pixels projetés
  const drawArrow = (id: string, pts: { x: number; y: number }[], color: string, progress: number, opacity: number) => {
    if (pts.length < 2 || progress <= 0 || opacity <= 0) return null;
    const n = Math.max(2, Math.floor(pts.length * Math.max(0.02, progress)));
    const sub = pts.slice(0, n);
    if (sub.length < 2) return null;
    const d = "M" + sub.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L");
    // tête de flèche
    const last = sub[sub.length - 1];
    const prev = sub[sub.length - 2];
    const ang = Math.atan2(last.y - prev.y, last.x - prev.x);
    const headLen = 18;
    const hx1 = last.x - headLen * Math.cos(ang - 0.4);
    const hy1 = last.y - headLen * Math.sin(ang - 0.4);
    const hx2 = last.x - headLen * Math.cos(ang + 0.4);
    const hy2 = last.y - headLen * Math.sin(ang + 0.4);
    return (
      <g key={id} opacity={opacity}>
        {/* Halo glow */}
        <path d={d} fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" opacity={0.18} />
        {/* Tracé principal */}
        <path d={d} fill="none" stroke={color} strokeWidth={4.5} strokeLinecap="round" strokeDasharray="0" />
        {/* Tête */}
        <path d={`M ${last.x},${last.y} L ${hx1},${hy1} M ${last.x},${last.y} L ${hx2},${hy2}`}
          fill="none" stroke={color} strokeWidth={4.5} strokeLinecap="round" />
      </g>
    );
  };

  const westPts = arrowPixels.find(a => a.id === "west")?.pts ?? [];
  const eastPts = arrowPixels.find(a => a.id === "east")?.pts ?? [];

  return (
    <AbsoluteFill style={{ backgroundColor: ATLAS.ocean, fontFamily: "'Cormorant Garamond', Georgia, serif", opacity: fadeOut }}>
      <MapboxBrandingHide />

      {/* Audio */}
      <Audio src={staticFile("atlas/_rnd/lobito/audio/narration-a3.mp3")} volume={1} />
      <Audio src={staticFile("souverain/maroc-batteries/audio/music-A-tension-industrielle.mp3")}
        volume={interpolate(frame, [0, 30, LOBITO_A_FRAMES - 40, LOBITO_A_FRAMES], [0, 0.14, 0.14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />

      {/* Filtre papier */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="paperA">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.95  0 0 0 0 0.9  0 0 0 0 0.78  0 0 0 0.04 0" />
        </filter>
      </svg>

      {/* Carte Mapbox */}
      <div ref={containerRef} style={{ width, height, position: "absolute" }} />

      {/* Grain papier */}
      <AbsoluteFill style={{ filter: "url(#paperA)", opacity: 0.28, pointerEvents: "none", mixBlendMode: "multiply" }} />
      {/* Vignette */}
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 62%, rgba(40,28,16,0.22) 100%)" }} />

      {/* FLÈCHES SVG superposées */}
      <svg style={{ position: "absolute", top: 0, left: 0, width, height, pointerEvents: "none" }}>
        {drawArrow("east", eastPts, FLUX_COLORS.china, eastProgress, arrowEastOp * hudOp)}
        {drawArrow("west", westPts, FLUX_COLORS.lobito, westProgress, arrowWestOp * hudOp)}
      </svg>

      {/* HUD PORTRAIT — date + compteur (style Sudan exact) */}
      {/* Date / titre haut */}
      <div style={{ position: "absolute", top: 100, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: hudOp }}>
        <div style={{ ...plaque, padding: "14px 32px", textAlign: "center", transform: `rotate(${paperWobble(frame, 11)}deg)` }}>
          <div style={{ fontSize: 54, fontWeight: 800, fontVariantNumeric: "tabular-nums", letterSpacing: 1, lineHeight: 1 }}>
            {jalon.date}
          </div>
          <div style={{ fontSize: 22, opacity: 0.7, fontWeight: 600, marginTop: 3 }}>
            Corridor de Lobito
          </div>
        </div>
      </div>

      {/* Bas — tonnage + légende + événement (style Sudan) */}
      <div style={{ position: "absolute", bottom: 220, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: hudOp, padding: "0 50px" }}>
        <div style={{ ...plaque, padding: "12px 32px", textAlign: "center", transform: `rotate(${paperWobble(frame, 3)}deg)` }}>
          <div style={{ fontSize: 17, letterSpacing: 3, opacity: 0.7, fontWeight: 700, textTransform: "uppercase" }}>
            Cobalt exporté · estimé
          </div>
          <div style={{ fontSize: 54, fontWeight: 800, fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>
            {currentTonnage.toFixed(1)} Mt
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 8, justifyContent: "center", fontSize: 17, fontWeight: 600 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 3, background: FLUX_COLORS.china }} />
              Route Chine (Est)
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 3, background: FLUX_COLORS.lobito }} />
              Route Lobito (Ouest)
            </span>
          </div>
        </div>
        <div style={{ ...plaque, padding: "12px 28px", fontSize: 28, fontWeight: 600, textAlign: "center", maxWidth: 900 }}>
          {jalon.label}
        </div>
      </div>

      {/* Source */}
      <div style={{ position: "absolute", bottom: 186, left: 0, right: 0, textAlign: "center", fontSize: 14, color: ATLAS.ink, opacity: hudOp * 0.55 }}>
        Données estimées · Sources : ITRI, USGS, Benchmark Mineral Intelligence
      </div>

      {/* Carton intro */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: introOp, pointerEvents: "none" }}>
        <div style={{ ...plaque, textAlign: "center", padding: "30px 48px", transform: `rotate(${paperWobble(frame, 1)}deg)`, maxWidth: 880 }}>
          <div style={{ fontSize: 20, letterSpacing: 8, opacity: 0.7, fontWeight: 700, textTransform: "uppercase" }}>Afrique centrale</div>
          <div style={{ fontSize: 56, fontWeight: 800, marginTop: 8, lineHeight: 1.08 }}>Le corridor de Lobito</div>
          <div style={{ fontSize: 22, opacity: 0.8, marginTop: 8, fontWeight: 600 }}>2000 — 2024</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
