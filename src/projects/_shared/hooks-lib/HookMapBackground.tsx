/**
 * hooks-lib/HookMapBackground — FOND injectable pour la bibliotheque de hooks.
 *
 * Extrait la logique Mapbox commune aux 2 hooks prouves (KineticMaskSlam, ComboMaskSweep) :
 *   - 1 seule Map dark-v11 + palette GeoAfrique, projection mercator, drift continu (jamais de snap)
 *   - allumage progressif du/des pays focus en fin de hook
 *   - expose la `mapRef` au parent via onMapReady -> le hook peut projeter des coordonnees
 *     (ex: faire partir des faisceaux du centre d'un pays vers les bords de l'ecran)
 *
 * POURQUOI : rend les hooks AGNOSTIQUES au fond. Un hook recoit ce composant en `background`
 * (ou un autre fond : parchemin custom, fond uni). Le hook ne hardcode plus la <div> Mapbox.
 *
 * Le drift est frame-driven (useCurrentFrame + map.jumpTo) — JAMAIS flyTo/easeTo (incompat headless).
 * Render via scripts/render-mapbox.sh (WebGL headless).
 *
 * Doctrine : memory/projects/HOOKS-LIBRARY-PLAN.md.
 */

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { applyGeoAfriqueV5, MapboxBrandingHide } from "../mapbox/MapboxBase";
import { HOOK_COLORS } from "./theme";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// Reskin PARCHEMIN (palette War-Map, source SahelControlData.SAHEL_COLORS).
// Permet de rendre le fond agnostique : "dark" (Souverain) | "parchment" (War-Map top-down).
const PARCHMENT = { land: "#F5EFD6", ocean: "#C8D9E0", outline: "#3A2A18" } as const;

const applyParchment = (map: mapboxgl.Map) => {
  const layers = map.getStyle().layers ?? [];
  for (const l of layers) {
    if (l.type === "symbol") map.setLayoutProperty(l.id, "visibility", "none");
    if (l.id.includes("water") && l.type === "fill") {
      try { map.setPaintProperty(l.id, "fill-color", PARCHMENT.ocean); } catch {}
    }
    if (
      l.id === "land" || l.id.includes("landuse") || l.id.includes("landcover") ||
      l.id === "background" || l.id.includes("national-park")
    ) {
      try { map.setPaintProperty(l.id, "background-color", PARCHMENT.land); } catch {}
      try { map.setPaintProperty(l.id, "fill-color", PARCHMENT.land); } catch {}
    }
    if (l.id.includes("admin-0")) {
      try { map.setPaintProperty(l.id, "line-color", PARCHMENT.outline); } catch {}
    }
    if (l.id.includes("admin-1")) {
      try { map.setPaintProperty(l.id, "line-color", "rgba(58,42,24,0.25)"); } catch {}
    }
  }
  if (map.getLayer("background")) {
    try { map.setPaintProperty("background", "background-color", PARCHMENT.land); } catch {}
  }
};

export interface HookMapBackgroundProps {
  center: [number, number];
  baseZoom?: number;
  /**
   * Theme du fond — c'est ce qui rend les hooks AGNOSTIQUES :
   *   "dark"      = Souverain (dark-v11 + palette GeoAfrique, ocean profond)
   *   "parchment" = War-Map top-down (light-v11 reskin parchemin clair, encre)
   */
  theme?: "dark" | "parchment";
  /** Pays a allumer (ISO alpha-3). Plusieurs = alliance. */
  focusIsos?: string[];
  accentColor?: string;
  /** Frame ou l'allumage commence (sinon pas d'allumage). */
  litFrom?: number;
  /** Delai (frames) entre l'allumage de chaque pays focus = cascade/contagion sequentielle. */
  litStagger?: number;
  /** Opacite max du fill d'allumage (defaut 0.45). Monter pour une contagion "pleine". */
  litFillOpacity?: number;
  durationFrames?: number;
  /** Amplitude du drift (bearing oscillant + zoom). 0 = carte fixe. */
  driftAmount?: number;
  /** Punch-in zoom (switch rapide vers la zone) : a partir de `at`, +`delta` zoom sur `dur` frames. */
  punchZoom?: { at: number; delta: number; dur?: number };
  /**
   * Trajectoire camera (grammaire War-Map serree + pan). Liste de keyframes {f,lon,lat,zoom},
   * interpolees (easeInOut) comme le moteur Sahel. Quand fourni, REMPLACE center/drift/punchZoom :
   * la camera est serree (zoom ~4.5-4.8) et PANE narrativement. Le `center` reste le fallback.
   */
  camKeys?: { f: number; lon: number; lat: number; zoom: number }[];
  /**
   * GeoJSON de pays a charger (chemin staticFile). Quand fourni :
   *   - trace un CONTOUR NATIONAL EPAIS permanent (raccord exact War-Map P4)
   *   - l'allumage des focusIsos se fait sur CE GeoJSON (propriete `country`), pas sur
   *     les country-boundaries Mapbox -> geometrie identique a la vraie carte du projet.
   * Ex: "_shared/geo-data/sahel/sahel-countries.geojson" (props.country = MLI/BFA/NER).
   */
  countriesGeoJson?: string;
  /** Couleur du contour national epais (defaut = encre parchemin #3A2A18). */
  countryBorderColor?: string;
  /**
   * Callback : remonte la mapRef + une fonction project(lonLat)->{x,y} ecran,
   * pour que le hook parent puisse ancrer ses overlays sur la geo.
   * Appele a chaque frame une fois la carte prete.
   */
  onMapReady?: (ctx: {
    map: mapboxgl.Map;
    project: (lonLat: [number, number]) => { x: number; y: number };
    ready: boolean;
  }) => void;
}

export const HookMapBackground: React.FC<HookMapBackgroundProps> = ({
  center,
  baseZoom = 4.6,
  theme = "dark",
  focusIsos = [],
  accentColor = HOOK_COLORS.gold,
  litFrom,
  litStagger = 0,
  litFillOpacity = 0.45,
  durationFrames = 120,
  driftAmount = 1,
  punchZoom,
  camKeys,
  countriesGeoJson,
  countryBorderColor = "#3A2A18",
  onMapReady,
}) => {
  const mapStyle = theme === "parchment"
    ? "mapbox://styles/mapbox/light-v11"
    : "mapbox://styles/mapbox/dark-v11";
  const bgColor = theme === "parchment" ? PARCHMENT.land : HOOK_COLORS.navy;
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("HookMapBackground init"));
  const [ready, setReady] = useState(false);

  const effZoom = baseZoom + (isVertical ? 0 : -0.4);
  const fillIds = focusIsos.map((iso) => `hookbg-fill-${iso}`);
  const lineIds = focusIsos.map((iso) => `hookbg-line-${iso}`);

  // init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      return;
    }
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: mapStyle,
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
    map.on("style.load", async () => {
      try {
        (map as mapboxgl.Map & { setProjection?: (p: string) => void }).setProjection?.("mercator");
      } catch {}
      if (theme === "parchment") applyParchment(map);
      else applyGeoAfriqueV5(map);

      if (countriesGeoJson) {
        // MODE RACCORD : GeoJSON pays custom (propriete `country`). Contour national epais
        // permanent + allumage via ce GeoJSON -> geometrie identique a la vraie carte du projet.
        try {
          const res = await fetch(staticFile(countriesGeoJson));
          const fc = await res.json();
          if (!map.getSource("hookbg-countries")) {
            map.addSource("hookbg-countries", { type: "geojson", data: fc });
          }
          // fill d'allumage (un layer par pays focus, filtre sur `country`)
          focusIsos.forEach((iso, i) => {
            if (!map.getLayer(fillIds[i])) {
              map.addLayer({
                id: fillIds[i],
                type: "fill",
                source: "hookbg-countries",
                filter: ["==", ["get", "country"], iso],
                paint: { "fill-color": accentColor, "fill-opacity": 0 },
              });
            }
          });
          // contour national EPAIS permanent (raccord P4)
          if (!map.getLayer("hookbg-country-border")) {
            map.addLayer({
              id: "hookbg-country-border",
              type: "line",
              source: "hookbg-countries",
              paint: { "line-color": countryBorderColor, "line-width": 3.4, "line-opacity": 0.92 },
            });
          }
          // trait d'accent au-dessus (s'allume au litFrom)
          focusIsos.forEach((iso, i) => {
            if (!map.getLayer(lineIds[i])) {
              map.addLayer({
                id: lineIds[i],
                type: "line",
                source: "hookbg-countries",
                filter: ["==", ["get", "country"], iso],
                paint: { "line-color": accentColor, "line-width": 4, "line-opacity": 0 },
              });
            }
          });
        } catch (e) {
          console.warn("[HookMapBackground] countriesGeoJson skipped:", e);
        }
      } else if (focusIsos.length) {
        // MODE GENERIQUE : country-boundaries Mapbox.
        if (!map.getSource("hookbg-cb")) {
          map.addSource("hookbg-cb", {
            type: "vector",
            url: "mapbox://mapbox.country-boundaries-v1",
          });
        }
        focusIsos.forEach((iso, i) => {
          if (!map.getLayer(fillIds[i])) {
            map.addLayer({
              id: fillIds[i],
              type: "fill",
              source: "hookbg-cb",
              "source-layer": "country_boundaries",
              filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
              paint: { "fill-color": accentColor, "fill-opacity": 0 },
            });
          }
          if (!map.getLayer(lineIds[i])) {
            map.addLayer({
              id: lineIds[i],
              type: "line",
              source: "hookbg-cb",
              "source-layer": "country_boundaries",
              filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
              paint: { "line-color": accentColor, "line-width": 2.5, "line-opacity": 0 },
            });
          }
        });
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

  // drift + allumage + remontee mapRef au parent (frame-driven)
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    if (camKeys && camKeys.length) {
      // TRAJECTOIRE camera serree + pan (grammaire War-Map). Interpolation easeInOut entre keyframes.
      const ks = camKeys;
      let a = ks[0], b = ks[ks.length - 1], t = 1;
      if (frame <= ks[0].f) { a = b = ks[0]; t = 0; }
      else if (frame >= ks[ks.length - 1].f) { a = b = ks[ks.length - 1]; t = 0; }
      else {
        for (let i = 0; i < ks.length - 1; i++) {
          if (frame >= ks[i].f && frame < ks[i + 1].f) {
            a = ks[i]; b = ks[i + 1];
            const span = b.f - a.f || 1;
            t = (frame - a.f) / span;
            break;
          }
        }
      }
      const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOut quadratique
      map.jumpTo({
        center: [a.lon + (b.lon - a.lon) * e, a.lat + (b.lat - a.lat) * e],
        zoom: a.zoom + (b.zoom - a.zoom) * e,
        bearing: 0,
        pitch: 0,
      });
    } else {
      const driftBearing = interpolate(frame, [0, durationFrames], [-4 * driftAmount, 4 * driftAmount]);
      let z = effZoom + interpolate(frame, [0, durationFrames], [0, 0.2 * driftAmount]);
      if (punchZoom) {
        const pz = interpolate(frame - punchZoom.at, [0, punchZoom.dur ?? 14], [0, punchZoom.delta], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        z += pz;
      }
      map.jumpTo({ center, zoom: z, bearing: driftBearing, pitch: 0 });
    }

    if (litFrom != null && focusIsos.length) {
      // chaque pays s'allume a litFrom + i*litStagger (cascade/contagion si litStagger>0)
      fillIds.forEach((id, i) => {
        const rel = frame - (litFrom + i * litStagger);
        const fillOp = interpolate(rel, [0, 16], [0, litFillOpacity], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        try { map.setPaintProperty(id, "fill-opacity", fillOp); } catch {}
      });
      lineIds.forEach((id, i) => {
        const rel = frame - (litFrom + i * litStagger);
        const lineOp = interpolate(rel, [0, 16], [0, 0.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        try { map.setPaintProperty(id, "line-opacity", lineOp); } catch {}
      });
    }

    if (onMapReady) {
      onMapReady({
        map,
        project: (lonLat) => {
          const p = map.project(lonLat);
          return { x: p.x, y: p.y };
        },
        ready,
      });
    }
  }, [frame, ready, center, effZoom, durationFrames, driftAmount, punchZoom, camKeys, litFrom, litStagger, litFillOpacity, focusIsos, fillIds, lineIds, onMapReady]);

  return (
    <AbsoluteFill style={{ background: bgColor }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      <MapboxBrandingHide />
    </AbsoluteFill>
  );
};

export default HookMapBackground;
