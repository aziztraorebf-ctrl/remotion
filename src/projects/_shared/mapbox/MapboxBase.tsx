/**
 * MapboxBase — utilitaires partagés pour toutes les compositions Mapbox
 *
 * Usage :
 *   import { lerpCam, removeLabels, addCountryHighlight, STYLES } from "../_shared/mapbox/MapboxBase";
 *
 * IMPORTANT : Mapbox nécessite WebGL — ne peut pas rendre headless (CLI).
 * Toujours prévisualiser dans Remotion Studio. Audio validé via fichier mix séparé.
 */

import React from "react";
import mapboxgl from "mapbox-gl";

/**
 * MapboxBrandingHide — composant qui cache le logo Mapbox et l'attribution
 * via injection CSS. À placer dans toute composition Remotion utilisant Mapbox.
 *
 * Conformité légale : la suppression du logo via CSS est autorisée par les TOS Mapbox
 * SI une attribution est faite ailleurs (ex: description vidéo YouTube/TikTok).
 * Ajouter dans la description : "Cartographie : © Mapbox © OpenStreetMap contributors".
 */
export const MapboxBrandingHide: React.FC = () => (
  <style>{`
    .mapboxgl-ctrl-logo,
    .mapboxgl-ctrl-attrib,
    .mapboxgl-ctrl-bottom-left,
    .mapboxgl-ctrl-bottom-right { display: none !important; }
  `}</style>
);

// ---------------------------------------------------------------------------
// Styles disponibles — clé = nom court, valeur = URL Mapbox
// ---------------------------------------------------------------------------
export const MAPBOX_STYLES = {
  dark:       "mapbox://styles/mapbox/dark-v11",        // Type B analytique (DEFAUT)
  satellite:  "mapbox://styles/mapbox/satellite-v9",    // Hook depuis l'espace
  relief:     "mapbox://styles/mapbox/outdoors-v12",    // Topographie (Hannibal, traversées)
  light:      "mapbox://styles/mapbox/light-v11",       // Editorial / infographie
  navNight:   "mapbox://styles/mapbox/navigation-night-v1", // Routes / flux
} as const;

export type MapboxStyleKey = keyof typeof MAPBOX_STYLES;

// ---------------------------------------------------------------------------
// Style GéoAfrique V5 — palette validée Or Africain 2026-05-07
// Usage: dark-v11 de base + appliquer ces overrides dans style.load
// ---------------------------------------------------------------------------
export const STYLE_GEO_AFRIQUE_V5 = {
  water:  "#1a3a5c",  // océan bleu profond
  land:   "#4a4a4a",  // terres gris désaturé
  border: "#c8c8c8",  // frontières blanches subtiles
} as const;

/**
 * Applique les overrides palette GéoAfrique V5 sur une map dark-v11.
 * Appeler dans map.on("style.load", () => { applyGeoAfriqueV5(map); })
 */
export const applyGeoAfriqueV5 = (map: mapboxgl.Map) => {
  const layers = map.getStyle().layers ?? [];
  for (const layer of layers) {
    if (layer.type === "symbol") {
      map.setLayoutProperty(layer.id, "visibility", "none");
    }
    if (layer.id.includes("waterway") || layer.id.includes("wetland")) {
      map.setLayoutProperty(layer.id, "visibility", "none");
    }
  }
  const safe = (id: string, prop: string, val: unknown) => {
    try { if (map.getLayer(id)) (map.setPaintProperty as (id: string, prop: string, val: unknown) => void)(id, prop, val); } catch {}
  };
  safe("water",               "fill-color",       STYLE_GEO_AFRIQUE_V5.water);
  safe("water-shadow",        "fill-color",       STYLE_GEO_AFRIQUE_V5.water);
  safe("land",                "background-color", STYLE_GEO_AFRIQUE_V5.land);
  safe("landuse",             "fill-color",       STYLE_GEO_AFRIQUE_V5.land);
  safe("national-park",       "fill-color",       STYLE_GEO_AFRIQUE_V5.land);
  safe("landcover",           "fill-color",       STYLE_GEO_AFRIQUE_V5.land);
  safe("admin-0-boundary",    "line-color",       STYLE_GEO_AFRIQUE_V5.border);
  safe("admin-0-boundary",    "line-width",       2);
  safe("admin-0-boundary-disputed", "line-color", STYLE_GEO_AFRIQUE_V5.border);
  safe("admin-1-boundary",    "line-color",       "rgba(180,180,180,0.2)");
};

// ---------------------------------------------------------------------------
// Type caméra
// ---------------------------------------------------------------------------
export type CamState = {
  lon: number;
  lat: number;
  zoom: number;
  pitch: number;
  bearing: number;
};

// ---------------------------------------------------------------------------
// Interpolation caméra avec easing quadratique
// ---------------------------------------------------------------------------
export const easeCam = (t: number) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

export const lerpCam = (a: CamState, b: CamState, t: number): CamState => {
  const e = easeCam(Math.max(0, Math.min(1, t)));
  return {
    lon:     a.lon     + (b.lon     - a.lon)     * e,
    lat:     a.lat     + (b.lat     - a.lat)     * e,
    zoom:    a.zoom    + (b.zoom    - a.zoom)    * e,
    pitch:   a.pitch   + (b.pitch   - a.pitch)   * e,
    bearing: a.bearing + (b.bearing - a.bearing) * e,
  };
};

// ---------------------------------------------------------------------------
// Caméras canoniques réutilisables
// ---------------------------------------------------------------------------
export const CAM_PRESETS: Record<string, CamState> = {
  // Vue depuis l'espace — point de départ universel
  space:         { lon: 0,      lat: 10,    zoom: 1.2, pitch: 0,  bearing: 0 },
  // Afrique de l'Ouest entière
  westAfrica:    { lon: -1.5,   lat: 12.0,  zoom: 3.4, pitch: 20, bearing: 0 },
  // Ghana gros plan
  ghana:         { lon: -1.023, lat: 7.95,  zoom: 5.2, pitch: 45, bearing: -5 },
  // Mali
  mali:          { lon: -2.0,   lat: 17.57, zoom: 4.8, pitch: 30, bearing: 15 },
  // Hannibal — vue Méditerranée + Alpes
  mediterranean: { lon: 10.0,   lat: 38.0,  zoom: 3.8, pitch: 35, bearing: 0 },
  // Empire Ghana historique (Mauritanie/Mali ouest)
  empireGhana:   { lon: -8.0,   lat: 16.0,  zoom: 4.5, pitch: 25, bearing: 0 },
};

// ---------------------------------------------------------------------------
// STANDARD APPROCHE PAYS (validé Aziz 2026-06-03, d'après Or Africain Beat4)
// Le "relief 3D" qu'Aziz aime = pitch 25-35° + zoom 4.5-4.8 + léger bearing.
// À utiliser comme DÉFAUT pour focus 1-4 pays (futurs beats). Différent de
// "altitude plate pitch 0" (Maroc Beat0/1) qui perd le relief.
// camCountryApproach génère un CamState centré sur un pays, incliné, avec
// un léger bearing pour le mouvement vivant.
// ---------------------------------------------------------------------------
export const CAM_COUNTRY_APPROACH_DEFAULTS = { zoom: 4.7, pitch: 32, bearing: 5 };

export const camCountryApproach = (
  center: [number, number],
  opts?: Partial<Pick<CamState, "zoom" | "pitch" | "bearing">>,
): CamState => ({
  lon: center[0],
  lat: center[1],
  zoom:    opts?.zoom    ?? CAM_COUNTRY_APPROACH_DEFAULTS.zoom,
  pitch:   opts?.pitch   ?? CAM_COUNTRY_APPROACH_DEFAULTS.pitch,
  bearing: opts?.bearing ?? CAM_COUNTRY_APPROACH_DEFAULTS.bearing,
});

// Vue "pull back" pour cadrer plusieurs pays au climax (recul + dé-incline)
export const CAM_MULTI_PULLBACK_DEFAULTS = { zoom: 3.4, pitch: 15, bearing: 0 };

// ---------------------------------------------------------------------------
// Supprimer tous les labels (noms pays, villes, routes)
// Appeler dans map.on("style.load", ...) pour carte épurée
// ---------------------------------------------------------------------------
export const removeLabels = (map: mapboxgl.Map) => {
  const layers = map.getStyle().layers ?? [];
  for (const layer of layers) {
    if (layer.type === "symbol") {
      map.setLayoutProperty(layer.id, "visibility", "none");
    }
  }
};

// ---------------------------------------------------------------------------
// Ajouter le highlight d'un pays par code ISO 3166-1 alpha-3
// ---------------------------------------------------------------------------
// ID de la source partagée country-boundaries — une seule instance par map
const COUNTRY_SOURCE_ID = "mapbox-country-boundaries";

// Enregistre la source partagée si absente, puis ajoute fill + border idempotents
export const addCountryHighlight = (
  map: mapboxgl.Map,
  iso: string,
  color: string,
  fillOpacity = 0.65,
  lineWidth = 2,
  idPrefix = ""
) => {
  const fillId   = `${idPrefix}fill-${iso}`;
  const borderId = `${idPrefix}border-${iso}`;

  // Source partagée — une seule pour tous les pays, survivre au Hot Reload
  if (!map.getSource(COUNTRY_SOURCE_ID)) {
    map.addSource(COUNTRY_SOURCE_ID, {
      type: "vector",
      url: "mapbox://mapbox.country-boundaries-v1",
    });
  }

  // Layers idempotents — supprimer avant de recréer
  if (map.getLayer(fillId))   map.removeLayer(fillId);
  if (map.getLayer(borderId)) map.removeLayer(borderId);

  map.addLayer({
    id: fillId,
    type: "fill",
    source: COUNTRY_SOURCE_ID,
    "source-layer": "country_boundaries",
    filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
    paint: { "fill-color": color, "fill-opacity": fillOpacity },
  });

  map.addLayer({
    id: borderId,
    type: "line",
    source: COUNTRY_SOURCE_ID,
    "source-layer": "country_boundaries",
    filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
    paint: { "line-color": color, "line-width": lineWidth, "line-opacity": 0.9 },
  });

  return { fillId, borderId };
};

/**
 * addCountryFlagFill — peint un DRAPEAU dans la silhouette d'un pays via fill-pattern Mapbox NATIF.
 *
 * ⛔ POURQUOI (grave 2026-06-21) : l'overlay SVG (clipPath + <image>) DERIVE au pitch — l'image
 * rectangulaire reste plate dans sa bbox alors que le pays devient un trapeze 3D incline → le drapeau
 * glisse/deborde. La solution GeoLes3/chaines premium = peindre la texture DANS Mapbox : c'est le moteur
 * qui drape le motif sur le terrain, donc il suit pitch+zoom+pan SANS dériver (le drapeau EST la carte).
 *
 * ⛔ LIMITE PROUVEE 2026-06-21 : le fill-pattern CARRELLE/bouillie au DEZOOM (la tuile garde sa taille pixel →
 *   quand le pays devient plus petit que la tuile, le drapeau se repete et devient illisible). Suit le terrain
 *   au pitch (pas de derive) MAIS pas robuste au dezoom. → Pour un drapeau-heros, PREFERER MapboxCountryFlagDecal
 *   (source image decoupee = pas de carrelage + pas de derive). Garder addCountryFlagFill pour des cas plats
 *   ou le pays reste grand a l'ecran. Doctrine : memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md.
 *
 * @param drawFlag fonction qui retourne le canvas drapeau (ex: (iso,size)=>drawFlagCanvas(iso,size))
 * @returns { fillId, patternId }
 */
export const addCountryFlagFill = (
  map: mapboxgl.Map,
  iso: string,
  drawFlag: (iso: string, size: number) => HTMLCanvasElement,
  opts: { size?: number; opacity?: number; idPrefix?: string; borderColor?: string; borderWidth?: number } = {}
) => {
  const { size = 1024, opacity = 1, idPrefix = "flagfill-", borderColor = "#f2efe6", borderWidth = 1.5 } = opts;
  const patternId = `flagpat-${iso}`;
  const fillId = `${idPrefix}fill-${iso}`;
  const borderId = `${idPrefix}border-${iso}`;

  if (!map.getSource(COUNTRY_SOURCE_ID)) {
    map.addSource(COUNTRY_SOURCE_ID, { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" });
  }

  // injecter le drapeau comme image-pattern (haute resolution = pas de carrelage a l'echelle pays)
  const canvas = drawFlag(iso, size);
  const ctx = canvas.getContext("2d")!;
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data as unknown as Uint8Array;
  if (!map.hasImage(patternId)) {
    map.addImage(patternId, { width: canvas.width, height: canvas.height, data });
  }

  if (map.getLayer(fillId)) map.removeLayer(fillId);
  if (map.getLayer(borderId)) map.removeLayer(borderId);

  map.addLayer({
    id: fillId,
    type: "fill",
    source: COUNTRY_SOURCE_ID,
    "source-layer": "country_boundaries",
    filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
    paint: { "fill-pattern": patternId, "fill-opacity": opacity },
  });
  map.addLayer({
    id: borderId,
    type: "line",
    source: COUNTRY_SOURCE_ID,
    "source-layer": "country_boundaries",
    filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
    paint: { "line-color": borderColor, "line-width": borderWidth, "line-opacity": 0.85 },
  });

  return { fillId, borderId, patternId };
};

// ---------------------------------------------------------------------------
// Codes ISO des pays africains fréquemment utilisés
// ---------------------------------------------------------------------------
export const ISO = {
  GHANA:   "GHA",
  MALI:    "MLI",
  BURKINA: "BFA",
  NIGER:   "NER",
  GUINEE:  "GIN",
  NIGERIA: "NGA",
  SENEGAL: "SEN",
  COTE_IVOIRE: "CIV",
  CAMEROUN: "CMR",
  ETHIOPIE: "ETH",
  KENYA:   "KEN",
  TANZANIE: "TZA",
  AFRIQUE_SUD: "ZAF",
  EGYPTE:  "EGY",
  MAROC:   "MAR",
  ALGERIE: "DZA",
  MAURITANIE: "MRT",
  CONGO_RDC: "COD",
  ANGOLA:  "AGO",
  MOZAMBIQUE: "MOZ",
} as const;

// ---------------------------------------------------------------------------
// Centres géographiques des pays (lon, lat)
// ---------------------------------------------------------------------------
export const COUNTRY_CENTERS: Record<string, [number, number]> = {
  GHA: [-1.023,  7.947],
  MLI: [-2.000, 17.571],
  BFA: [-1.562, 12.364],
  NER: [ 8.082, 17.608],
  GIN: [-11.307, 11.0],
  NGA: [ 8.675,  9.082],
  SEN: [-14.452, 14.497],
  CIV: [ -5.547,  7.540],
  ETH: [ 40.489,  9.145],
  EGY: [ 30.802, 26.820],
  MAR: [ -7.092, 31.791],
  DZA: [  2.632, 28.034],
  MRT: [-10.940, 20.250],
  COD: [ 23.656,  -2.877],
};
