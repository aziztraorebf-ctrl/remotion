/**
 * Constants partagees RDC No Sense.
 * Toutes les coordonnees verifiees via Mapbox geocoding + Natural Earth.
 */

export const NARRATION_PATH = "/geoafrique/rdc-no-sense/narration-v1.mp3";
export const MUSIC_PATH = "/geoafrique/rdc-no-sense/music-v1.mp3";
export const FINAL_MIX_PATH = "/geoafrique/rdc-no-sense/final-mix.mp3";

export const PALETTE = {
  navy: "#0a1929",
  gold: "#ffd700",
  orange: "#ff8c00",
  cream: "#f5e7c8",
  ivory: "#ece4d3",
  forest: "#4caf50",
  river: "#00d4ff",
  red: "#d32f2f",
  paper: "#d4c29d",
} as const;

// Coordonnees RDC
export const RDC = {
  iso3: "COD",
  iso2: "cd",
  name: "Dem. Rep. Congo",
  capital: { name: "Kinshasa", lon: 15.2663, lat: -4.4419 },
  lubumbashi: { name: "Lubumbashi", lon: 27.4794, lat: -11.6647 },
  center: { lon: 23.5, lat: -2.5 }, // centre approx RDC
} as const;

// 9 voisins de la RDC avec ISO + coords approx capitale
export const RDC_NEIGHBORS = [
  { iso3: "AGO", iso2: "ao", name: "Angola", lon: 13.23, lat: -8.83 },
  { iso3: "ZMB", iso2: "zm", name: "Zambie", lon: 28.32, lat: -15.39 },
  { iso3: "TZA", iso2: "tz", name: "Tanzanie", lon: 35.74, lat: -6.17 },
  { iso3: "BDI", iso2: "bi", name: "Burundi", lon: 29.36, lat: -3.38 },
  { iso3: "RWA", iso2: "rw", name: "Rwanda", lon: 30.06, lat: -1.94 },
  { iso3: "UGA", iso2: "ug", name: "Ouganda", lon: 32.58, lat: 0.34 },
  { iso3: "SSD", iso2: "ss", name: "Soudan du Sud", lon: 31.58, lat: 4.85 },
  { iso3: "CAF", iso2: "cf", name: "RCA", lon: 18.55, lat: 4.37 },
  { iso3: "COG", iso2: "cg", name: "Congo-Brazzaville", lon: 15.28, lat: -4.27 },
] as const;

// Cameras Mapbox (CamState)
export const CAMS = {
  space: { lon: 5, lat: 5, zoom: 1.4, pitch: 0, bearing: 0 },
  africa: { lon: 18, lat: 0, zoom: 2.6, pitch: 0, bearing: 0 },
  rdcWide: { lon: 23.5, lat: -2.5, zoom: 4.2, pitch: 0, bearing: 0 },
  rdcWithNeighbors: { lon: 23.5, lat: -2.5, zoom: 3.6, pitch: 10, bearing: 0 },
  congoRiver: { lon: 20.0, lat: -1.5, zoom: 5.0, pitch: 25, bearing: 30 },
  rdcCloseForest: { lon: 23.5, lat: -1.0, zoom: 4.6, pitch: 0, bearing: 0 },
} as const;
