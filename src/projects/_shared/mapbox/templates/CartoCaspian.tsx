/**
 * Template B — Carto Caspian
 *
 * Style Mapbox inspire de Caspian Report, raffine pour Souverain :
 *   ocean   #bcd5e3 (bleu pale uni + grain subtil)
 *   terre   #ede5d3 (creme/blanc casse)
 *   borders #5a5a5a opacity 0.6 weight 0.5px (trait fin)
 *   labels  AUCUN (regle Aziz cross-templates)
 *   highlights palette Souverain : or / terracotta / indigo
 *
 * Decisions Aziz lockees 2026-05-09 :
 *   - texture ocean : aplat + grain subtil (pas aquarelle full Caspian)
 *   - densite : epuree Souverain (1 pays + 1-2 pins max), pas Mali/Niger/Chad multi-pins
 *
 * Usage standard :
 *   import { applyCartoCaspian, CASPIAN_PALETTE, CartoCaspianOverlay } from "../_shared/mapbox/templates/CartoCaspian";
 *
 *   map.on("style.load", () => {
 *     applyCartoCaspian(map);
 *     addCountryHighlight(map, ISO.NIGER, CASPIAN_PALETTE.highlightOr, 0.55);
 *   });
 *
 *   <AbsoluteFill>
 *     <MapboxBrandingHide />
 *     <div ref={mapContainer} />
 *     <CartoCaspianOverlay />
 *   </AbsoluteFill>
 */

import React from "react";
import { staticFile } from "remotion";
import mapboxgl from "mapbox-gl";

export const CASPIAN_PALETTE = {
  water:        "#bcd5e3",
  land:         "#ede5d3",
  landAlt:      "#f5f0e6",
  border:       "#5a5a5a",
  borderOpacity: 0.6,
  borderWidth:  0.5,
  highlightOr:        "#d4a93c",
  highlightTerracotta: "#a05a3a",
  highlightIndigo:    "#3a4a6a",
} as const;

// Variantes Niger uranium — recherche lisibilite + caractere narratif (Jour 5)
export const CASPIAN_SEPIA = {
  water:        "#a8c2d4",
  land:         "#d8c9a8",
  landAlt:      "#e3d6b8",
  border:       "#3a2f20",
  borderOpacity: 0.85,
  borderWidth:  0.7,
  highlightOr:        "#c08820",
  highlightTerracotta: "#8b4a2c",
  highlightIndigo:    "#2a3552",
} as const;

export const CASPIAN_SMOKE = {
  water:        "#9eb5c4",
  land:         "#c8c0ad",
  landAlt:      "#d4ccb8",
  border:       "#2a2a2a",
  borderOpacity: 0.85,
  borderWidth:  0.7,
  highlightOr:        "#b88a2a",
  highlightTerracotta: "#8b3f2a",
  highlightIndigo:    "#2a3552",
} as const;

export const CASPIAN_NOIR = {
  water:        "#1a2842",
  land:         "#3a3528",
  landAlt:      "#4a4332",
  border:       "#7a6c50",
  borderOpacity: 0.7,
  borderWidth:  0.7,
  highlightOr:        "#d4a93c",
  highlightTerracotta: "#c46a3a",
  highlightIndigo:    "#6a7aa0",
} as const;

export type CaspianPaletteShape = {
  readonly water: string;
  readonly land: string;
  readonly landAlt: string;
  readonly border: string;
  readonly borderOpacity: number;
  readonly borderWidth: number;
  readonly highlightOr: string;
  readonly highlightTerracotta: string;
  readonly highlightIndigo: string;
};

const safe = (
  map: mapboxgl.Map,
  id: string,
  prop: string,
  val: unknown,
  kind: "paint" | "layout" = "paint",
) => {
  try {
    if (!map.getLayer(id)) return;
    if (kind === "paint") {
      (map.setPaintProperty as (id: string, p: string, v: unknown) => void)(id, prop, val);
    } else {
      (map.setLayoutProperty as (id: string, p: string, v: unknown) => void)(id, prop, val);
    }
  } catch {}
};

export const applyCartoCaspian = (
  map: mapboxgl.Map,
  palette: CaspianPaletteShape = CASPIAN_PALETTE,
) => {
  const layers = map.getStyle().layers ?? [];

  for (const layer of layers) {
    if (layer.type === "symbol") {
      map.setLayoutProperty(layer.id, "visibility", "none");
    }
    if (layer.id.includes("waterway") || layer.id.includes("wetland")) {
      map.setLayoutProperty(layer.id, "visibility", "none");
    }
  }

  safe(map, "water",         "fill-color",       palette.water);
  safe(map, "water-shadow",  "fill-color",       palette.water);

  safe(map, "land",          "background-color", palette.land);
  safe(map, "landuse",       "fill-color",       palette.land);
  safe(map, "landcover",     "fill-color",       palette.land);
  safe(map, "national-park", "fill-color",       palette.land);

  safe(map, "admin-0-boundary",          "line-color",   palette.border);
  safe(map, "admin-0-boundary",          "line-width",   palette.borderWidth);
  safe(map, "admin-0-boundary",          "line-opacity", palette.borderOpacity);
  safe(map, "admin-0-boundary-disputed", "line-color",   palette.border);
  safe(map, "admin-0-boundary-disputed", "line-opacity", palette.borderOpacity);
  safe(map, "admin-1-boundary",          "line-color",   palette.border);
  safe(map, "admin-1-boundary",          "line-opacity", 0.25);
};

/**
 * Overlay grain papier — texture PNG subtile en blend multiply opacity 0.08.
 * A poser au-dessus du <div ref={mapContainer}> dans l'<AbsoluteFill>.
 *
 * Le PNG `grain-paper-bcd5e3.png` doit etre genere une fois via Gemini puis
 * place dans `public/souverain/_shared/textures/`. Si absent, l'overlay est
 * silencieusement masque (fallback gracieux).
 */
export const CartoCaspianOverlay: React.FC<{ opacity?: number }> = ({
  opacity = 0.08,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundImage: `url(${staticFile("souverain/_shared/textures/grain-paper-bcd5e3.png")})`,
      backgroundSize: "512px 512px",
      backgroundRepeat: "repeat",
      mixBlendMode: "multiply",
      opacity,
      pointerEvents: "none",
    }}
  />
);
