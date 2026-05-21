/**
 * Template C — Atlas Réaliste 3D (V3 — post-jury Jour 3, 2026-05-09)
 *
 * Pattern signature (verdict jury 3 LLMs : KEEP Phase C, REWORK Phase A+B) :
 *   - Style satellite-v9 + hillshade natif (texture terrain reelle)
 *   - PAS d'overlay monde gris (s'empilait sur Sahara naturellement noir = inutilisable)
 *   - Pays focus = fill couleur or saturee + bordure blanche fine
 *   - Cartouches noirs #0a0a0a + stroke or #E8B33A
 *   - 0 labels (regle Aziz)
 *
 * Usage :
 *   applyAtlasRealiste3D(map);   // satellite + hillshade
 *   addCountryFocus(map, "NER", ATLAS3D_PALETTE.accentOr);
 */

import mapboxgl from "mapbox-gl";

export const ATLAS3D_PALETTE = {
  accentOr:        "#d4a93c",
  accentTerracotta:"#a05a3a",
  accentIndigo:    "#3a4a6a",
  cartoucheBackground: "rgba(10,10,10,0.82)",
  cartoucheBorder: "#E8B33A",
  cartoucheText:   "#ffffff",
} as const;

const COUNTRY_SOURCE_ID  = "mapbox-country-boundaries";
const TERRAIN_SOURCE_ID  = "atlas3d-mapbox-dem";
const HILLSHADE_LAYER_ID = "atlas3d-hillshade";

const safe = (map: mapboxgl.Map, id: string, prop: string, val: unknown) => {
  try {
    if (map.getLayer(id)) {
      (map.setPaintProperty as (id: string, p: string, v: unknown) => void)(id, prop, val);
    }
  } catch {}
};

/**
 * Applique le style Atlas 3D sur une map satellite-v9.
 * - Masque tous les labels symboles
 * - Desature et eclaircit le satellite (lecture confortable du Sahara/zones arides)
 * - Ajoute hillshade natif Mapbox (texture relief)
 *
 * Appeler dans map.on("style.load").
 */
export const applyAtlasRealiste3D = (map: mapboxgl.Map) => {
  const layers = map.getStyle().layers ?? [];
  for (const layer of layers) {
    if (layer.type === "symbol") {
      map.setLayoutProperty(layer.id, "visibility", "none");
    }
  }
  // Desaturation + boost luminosite satellite
  safe(map, "satellite", "raster-saturation", -0.40);
  safe(map, "satellite", "raster-brightness-max", 0.95);
  safe(map, "satellite", "raster-brightness-min", 0.08);
  safe(map, "satellite", "raster-contrast", 0.06);

  // Hillshade natif — texture terrain relief
  if (!map.getSource(TERRAIN_SOURCE_ID)) {
    map.addSource(TERRAIN_SOURCE_ID, {
      type: "raster-dem",
      url: "mapbox://mapbox.mapbox-terrain-dem-v1",
      tileSize: 512,
      maxzoom: 14,
    });
  }
  if (!map.getLayer(HILLSHADE_LAYER_ID)) {
    map.addLayer({
      id: HILLSHADE_LAYER_ID,
      type: "hillshade",
      source: TERRAIN_SOURCE_ID,
      paint: {
        "hillshade-exaggeration": 0.75,
        "hillshade-shadow-color": "#1a1020",
        "hillshade-highlight-color": "#f0ead8",
        "hillshade-illumination-anchor": "viewport",
      },
    });
  }
};

/**
 * Ajoute le highlight pays focus SANS overlay monde.
 * Pattern Souverain V3 : satellite lisible partout, pays focus = fill or saturee + bordure blanche.
 *
 * @param iso       Code ISO 3166-1 alpha-3 du pays focus
 * @param color     Couleur du pays focus (ATLAS3D_PALETTE.accentOr par defaut)
 * @param fillOpacity Opacite du fill pays focus (0.6 par defaut)
 */
export const addCountryFocus = (
  map: mapboxgl.Map,
  iso: string,
  color: string = ATLAS3D_PALETTE.accentOr,
  fillOpacity = 0.60,
) => {
  if (!map.getSource(COUNTRY_SOURCE_ID)) {
    map.addSource(COUNTRY_SOURCE_ID, {
      type: "vector",
      url: "mapbox://mapbox.country-boundaries-v1",
    });
  }

  const focusFillId   = `atlas3d-focus-fill-${iso}`;
  const focusBorderId = `atlas3d-focus-border-${iso}`;

  if (map.getLayer(focusFillId))   map.removeLayer(focusFillId);
  if (map.getLayer(focusBorderId)) map.removeLayer(focusBorderId);

  map.addLayer({
    id: focusFillId,
    type: "fill",
    source: COUNTRY_SOURCE_ID,
    "source-layer": "country_boundaries",
    filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
    paint: {
      "fill-color": color,
      "fill-opacity": fillOpacity,
    },
  });

  map.addLayer({
    id: focusBorderId,
    type: "line",
    source: COUNTRY_SOURCE_ID,
    "source-layer": "country_boundaries",
    filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
    paint: {
      "line-color": "#ffffff",
      "line-width": 1.8,
      "line-opacity": 0.9,
    },
  });

  return { focusFillId, focusBorderId };
};

/**
 * Alias deprecated pour compatibilite ascendante.
 * @deprecated utiliser addCountryFocus (sans overlay monde)
 */
export const addCountryMask = addCountryFocus;
