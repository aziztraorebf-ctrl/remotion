import { PLAGUE_DATA, type PlagueDataPoint } from "./data";

// Additional cities for Hook narrative (not in main PLAGUE_DATA)
export const HOOK_CITIES: PlagueDataPoint[] = [
  { day: -3285, city: "Issyk-Kul", deaths: 0, lat: 42.5, lon: 77.0 },
  { day: -30, city: "Caffa", deaths: 2, lat: 45.0, lon: 35.4 },
];

// Trade routes for animated lines
export interface TradeRoute {
  id: string;
  points: [number, number][]; // [lon, lat] pairs
  color: string;
  label: string;
}

export const HOOK_ROUTES: TradeRoute[] = [
  {
    id: "silk-road",
    points: [
      [77.0, 42.5], // Issyk-Kul
      [52.0, 41.3], // via Samarkand area
      [35.4, 45.0], // Caffa
    ],
    color: "#D4A017",
    label: "Route de la soie",
  },
  {
    id: "galeres",
    points: [
      [35.4, 45.0], // Caffa
      [29.0, 41.0], // via Constantinople
      [23.7, 38.0], // via Grece
      [15.6, 38.2], // Messine
    ],
    color: "#D4A017",
    label: "Galeres genoises",
  },
];

// All plague cities for the "invasion" cascade (scene 4)
export const ALL_PLAGUE_CITIES = [...HOOK_CITIES, ...PLAGUE_DATA];

// Galley SVG path for ship sprites on maritime route
export const GALLEY_SVG_PATH =
  "M2 18 L6 20 L26 20 L30 18 L28 16 L4 16 Z M8 16 L8 10 L10 10 L10 16 M16 16 L16 6 L18 6 L18 16 M24 16 L24 10 L26 10 L26 16";
