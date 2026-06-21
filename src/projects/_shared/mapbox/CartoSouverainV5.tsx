/**
 * CartoSouverainV5 — LA CIBLE CANONIQUE des cartes Souverain (l'equivalent carto du cobaye v9 data-viz).
 *
 * ⛔ POURQUOI CE FICHIER (2026-06-20) : l'audit carto a revele 8 registres carto en concurrence sans
 * cible canonique. Resultat = a chaque scene on derive, on rebricole la palette, on code une carte hors-charte.
 * CE composant fige LE registre Souverain moderne (navy/gris/or, GeoAfrique V5) UNE fois, prouve, parametrable.
 * Toute carte Souverain part de LUI. On ne re-applique plus des `safe()` ad-hoc beat par beat.
 *
 * REGISTRE (immuable — refs : public/_shared/refs/cartes/carte-souverain-geoafrique-v5.jpg + short Senegal) :
 *   - fond mer = navy profond, terres = gris ardoise, frontieres = blanc subtil (applyGeoAfriqueV5)
 *   - pays focus = rempli OR (#c8a951)
 *   - projection Mercator (headless-safe), frame-driven (jumpTo, JAMAIS flyTo/easeTo)
 *   - PITCH PARAMETRABLE : mode "flat" (pitch 0, vue large/situation) | mode "relief" (pitch 28-35, zoom pays,
 *     le relief "signature" valide Aziz). UNE cible, deux modes — pas deux registres.
 *
 * Doctrine : DOCTRINE-SOUVERAIN.md §3 + SOUVERAIN-VISUAL-PLAYBOOK.md. Briques : MapboxBase.tsx.
 * Gate : scripts/tools/carto-selfreview.py (a venir, brique 3).
 */
import React, { useEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import mapboxgl from "mapbox-gl";
import {
  MapboxBrandingHide,
  MAPBOX_STYLES,
  applyGeoAfriqueV5,
  addCountryHighlight,
  lerpCam,
  type CamState,
} from "./MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// Or canonique du pays focus (palette Souverain immuable)
export const SOUVERAIN_GOLD = "#c8a951";

export type CartoCamKey = CamState; // {lon, lat, zoom, pitch, bearing}

export type CartoSouverainV5Props = {
  /** Trajectoire camera : 2+ keyframes interpoles sur la duree (frame-driven). Pitch porte le mode flat/relief. */
  camKeys: { atProgress: number; cam: CamState }[];
  /** ISO-3 du/des pays a surligner en or (ex ["SEN"]). */
  focusIsos?: string[];
  /** Easing de la trajectoire (defaut cubic in-out). */
  children?: React.ReactNode;
  /** override couleur focus (defaut or canonique). */
  focusColor?: string;
  /** callback expose l'instance Map (apres style.load) pour overlays geo-ancres (marqueurs offshore, flux).
   *  Permet de projeter des coords lon/lat -> px ecran via map.project() dans une scene enfant. */
  onMapReady?: (map: mapboxgl.Map) => void;
};

/**
 * Interpole la camera le long des keyframes selon la progression [0..1] de la scene.
 * Frame-driven pur : aucune animation Mapbox interne.
 */
function camAtProgress(keys: { atProgress: number; cam: CamState }[], p: number): CamState {
  if (keys.length === 0) return { lon: 0, lat: 10, zoom: 1.5, pitch: 0, bearing: 0 };
  if (keys.length === 1) return keys[0].cam;
  // trouver le segment
  let a = keys[0], b = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (p >= keys[i].atProgress && p <= keys[i + 1].atProgress) { a = keys[i]; b = keys[i + 1]; break; }
  }
  const span = b.atProgress - a.atProgress || 1;
  const local = Math.max(0, Math.min(1, (p - a.atProgress) / span));
  return lerpCam(a.cam, b.cam, local);
}

export const CartoSouverainV5: React.FC<CartoSouverainV5Props> = ({ camKeys, focusIsos = [], children, focusColor, onMapReady }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const p = durationInFrames > 1 ? frame / (durationInFrames - 1) : 0;
  const cam = camAtProgress(camKeys, p);

  // init carte (pattern headless prouve : dark-v11 + setProjection mercator + applyGeoAfriqueV5)
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const first = camKeys[0]?.cam ?? { lon: 0, lat: 10, zoom: 1.5, pitch: 0, bearing: 0 };
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: [first.lon, first.lat],
      zoom: first.zoom,
      pitch: first.pitch,
      bearing: first.bearing,
      interactive: false,
      attributionControl: false,
    });
    map.on("style.load", () => {
      (map as unknown as { setProjection: (p: string) => void }).setProjection("mercator");
      applyGeoAfriqueV5(map);
      for (const iso of focusIsos) {
        addCountryHighlight(map, iso, focusColor ?? SOUVERAIN_GOLD, 0.85, 2, `v5-${iso}-`);
      }
      onMapReady?.(map);
    });
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // camera frame-driven (jumpTo, jamais flyTo/easeTo)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.jumpTo({ center: [cam.lon, cam.lat], zoom: cam.zoom, pitch: cam.pitch, bearing: cam.bearing });
  }, [frame, cam.lon, cam.lat, cam.zoom, cam.pitch, cam.bearing]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#16213a" }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      {children}
    </AbsoluteFill>
  );
};

export default CartoSouverainV5;
