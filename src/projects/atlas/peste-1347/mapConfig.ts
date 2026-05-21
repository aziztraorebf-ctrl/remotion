// mapConfig.ts — Peste 1347 — source de vérité géographique
// Toutes les coordonnées POI proviennent de peste-map-data.json (d3-geo précompute).
// Helpers caméra et trajets déterministes : aucune coordonnée magique dans les composants.

import pesteData from "../../../../public/atlas/peste-1347/geo/peste-map-data.json";

// ─── DIMENSIONS CADRE ──────────────────────────────────────────────────────

export const WIDTH = pesteData.width;   // 720
export const HEIGHT = pesteData.height; // 1280
export const CENTER = { x: WIDTH / 2, y: HEIGHT / 2 };

// ─── STATIONS (mercLarge — vue par défaut Beats 1-3-6) ─────────────────────

type Station = { x: number; y: number };

const poi = pesteData.mercLarge.poi as Record<string, Station>;

export const STATIONS = {
  LONDRES:    poi.Londres,     // (271.2, 379.4)
  PARIS:      poi.Paris,       // (289.3, 409.8)
  STOCKHOLM:  poi.Stockholm,   // (404.5, 277.9)
  SICILE:     poi.Sicile,      // (370.0, 518.6)
  CAFFA:      poi.Caffa,       // (531.4, 450.8)
  LE_CAIRE:   poi.LeCaire,     // (501.0, 590.2)
  TOMBOUCTOU: poi.Tombouctou,
  NIANI:      poi.Niani,
  MAGHREB:    poi.Maghreb,
  FLORENCE:   poi.Florence,
  VENISE:     poi.Venise,
} as const;

export type StationKey = keyof typeof STATIONS;

// ─── PAYS INFECTÉS — coloriage cohérent Beats 2-3-4-5-6 ───────────────────
// Pays qui apparaissent rouges en fin de propagation Beat 2, persistent en Beat 3.
// Ordre = ordre approximatif d'infection historique (peste arrivée par Sicile,
// remonte vers Italie centrale, France, Angleterre, Scandinavie, etc.)

export const ISO_PLAGUE = [
  "ITA",  // Italie (Sicile = port d'entrée)
  "GRC",  // Grèce (route maritime byzantine)
  "FRA",  // France (Paris)
  "ESP",  // Espagne
  "PRT",  // Portugal
  "GBR",  // Royaume-Uni (Angleterre = focus Beat 3)
  "IRL",  // Irlande
  "BEL",  // Belgique
  "NLD",  // Pays-Bas
  "DEU",  // Allemagne
  "DNK",  // Danemark
  "SWE",  // Suède (Stockholm)
  "NOR",  // Norvège
  "POL",  // Pologne (voie hanséatique)
  "AUT",  // Autriche
  "CHE",  // Suisse
  "UKR",  // Crimée (Caffa = point d'origine)
] as const;

export const PLAGUE_COUNTRY_COLOR = "#a04545"; // rouge terne (Angleterre garde PLAGUE_RED_BRIGHT séparément)
export const PLAGUE_COUNTRY_OPACITY = 0.65;

// ─── ÉTAT CAMÉRA HÉRITÉ FIN BEAT 2 ─────────────────────────────────────────

export const INHERITED_FROM_BEAT2 = {
  scale: 1.04,
  driftX: 10,
  driftY: -10,
  wave: {
    cx: STATIONS.SICILE.x,
    cy: STATIONS.SICILE.y,
    r: 260,
    initialOpacity: 0.35,
  },
} as const;

// ─── HELPER CAMÉRA — cameraTo(station, scale, offset?) ─────────────────────
// Calcule (driftX, driftY) pour centrer une station à un zoom donné.
// AtlasMercator applique : screenX = (poi.x - cx) * scale + cx + driftX
// Donc pour centrer la station au milieu du cadre : driftX = (cx - poi.x) * scale
// offset permet de décaler légèrement (sortir un sprite du centre pour laisser
// place à une cartouche).

type CameraOffset = { dx?: number; dy?: number };

export const cameraTo = (
  stationKey: StationKey,
  scale: number,
  offset: CameraOffset = {}
): { scale: number; driftX: number; driftY: number } => {
  const s = STATIONS[stationKey];
  const { dx = 0, dy = 0 } = offset;
  return {
    scale,
    driftX: (CENTER.x - s.x) * scale + dx,
    driftY: (CENTER.y - s.y) * scale + dy,
  };
};

// ─── HELPER TRAJET — pathBetween(stationA, stationB, offset?) ──────────────

type PathOffset = {
  startDx?: number; startDy?: number;
  endDx?: number;   endDy?: number;
};

export const pathBetween = (
  fromKey: StationKey,
  toKey: StationKey,
  offset: PathOffset = {}
): { start: Station; end: Station } => {
  const from = STATIONS[fromKey];
  const to = STATIONS[toKey];
  const { startDx = 0, startDy = 0, endDx = 0, endDy = 0 } = offset;
  return {
    start: { x: from.x + startDx, y: from.y + startDy },
    end:   { x: to.x + endDx,     y: to.y + endDy     },
  };
};

// ─── HELPER MIDPOINT — pour cluster (PARIS + LONDRES)/2 etc. ───────────────

export const midpoint = (
  a: StationKey,
  b: StationKey,
  offset: { dx?: number; dy?: number } = {}
): Station => {
  const A = STATIONS[a];
  const B = STATIONS[b];
  const { dx = 0, dy = 0 } = offset;
  return {
    x: (A.x + B.x) / 2 + dx,
    y: (A.y + B.y) / 2 + dy,
  };
};

// ─── MAP COORD TRANSFORM (utilitaire screen-space) ─────────────────────────
// Convertit coord SVG brute en coord écran en tenant compte du transform caméra.
// Identique à makeMapCoord local des composants, centralisé ici.

export const makeMapCoord = (scale: number, driftX: number, driftY: number) => {
  const cx = CENTER.x;
  const cy = CENTER.y;
  return (x: number, y: number): [number, number] => [
    (x - cx) * scale + cx + driftX,
    (y - cy) * scale + cy + driftY,
  ];
};

// ─── PALETTE ÉPISODE (partagée par tous les beats) ────────────────────────

export const PALETTE = {
  OCEAN: "#1a2744",
  MALI_GOLD: "#c8960c",
  PLAGUE_RED: "#8b1a1a",
  PLAGUE_RED_BRIGHT: "#cc2222",
  TEXT_MUTED: "#c4a882",
  CREAM: "#f5e6c8",
  PARCHMENT: "#e8d7a8",
  PARCHMENT_DARK: "#c9b079",
  PARCHMENT_INK: "#3a2410",
} as const;

// ─── DATA ACCESSOR ─────────────────────────────────────────────────────────

export const MAP_DATA = pesteData;
export const MERC_LARGE = pesteData.mercLarge;
