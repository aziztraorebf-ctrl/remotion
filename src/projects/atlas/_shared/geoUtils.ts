// geoUtils.ts — Pont Turf.js ↔ projection SVG Mercator Atlas
//
// Usage : importer lngLatToSvg + les helpers de mouvement.
// Toutes les fonctions prennent des coordonnées WGS84 (lon, lat) réelles
// et retournent des coordonnées SVG utilisables directement dans la carte Atlas.
//
// Prérequis : les POIs du json source doivent avoir {x, y, lon, lat}.
// makeMapCoord() de mapConfig.ts applique ensuite le transform caméra.

import * as turf from "@turf/turf";
import type { Feature, LineString } from "geojson";

// ─── PROJECTION SVG MERCATOR ────────────────────────────────────────────────
// Calibrée sur les POIs de pest-map-data.json (720×1280).
// On utilise 2 points d'ancrage connus pour dériver la projection linéaire.
// Niani  : lon=-8.386 lat=11.379  → x=210.56 y=737.35
// Florence: lon=11.255 lat=43.769  → x=321.3 y=462.5 (approx)
// La projection Mercator est : x = A*lon + B ; y = C*log(tan(π/4+lat*π/360)) + D

const SVG_W = 720;
const SVG_H = 1280;

// Ancres calibration (issues de peste-map-data.json)
const ANCHOR1 = { lon: -8.386, lat: 11.379, x: 210.56, y: 737.35 };
const ANCHOR2 = { lon: -3.014, lat: 16.787, x: 249.94, y: 696.46 };

// Coefficient X (longitude → SVG x) — linéaire en Mercator standard
const mercatorLonToX = (lon: number): number => {
  const dx = ANCHOR2.x - ANCHOR1.x;
  const dLon = ANCHOR2.lon - ANCHOR1.lon;
  const scale = dx / dLon;
  return ANCHOR1.x + (lon - ANCHOR1.lon) * scale;
};

// Coefficient Y (latitude → SVG y) — logarithmique en Mercator standard
const mercatorLatScale = (() => {
  const latToMerc = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  const m1 = latToMerc(ANCHOR1.lat);
  const m2 = latToMerc(ANCHOR2.lat);
  return (ANCHOR2.y - ANCHOR1.y) / (m2 - m1);
})();

const mercatorLatOffset = (() => {
  const latToMerc = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  return ANCHOR1.y - mercatorLatScale * latToMerc(ANCHOR1.lat);
})();

const mercatorLatToY = (lat: number): number => {
  const m = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  return mercatorLatScale * m + mercatorLatOffset;
};

/**
 * Convertit des coordonnées géographiques WGS84 en coordonnées SVG Atlas (720×1280).
 * Appliquer ensuite makeMapCoord(camScale, driftX, driftY)(svgX, svgY) pour l'écran.
 */
export const lngLatToSvg = (lon: number, lat: number): [number, number] => [
  mercatorLonToX(lon),
  mercatorLatToY(lat),
];

// ─── TYPES ──────────────────────────────────────────────────────────────────

export interface GeoPoint {
  lon: number;
  lat: number;
}

export interface GeoRoute {
  waypoints: GeoPoint[];
  totalKm?: number; // calculé automatiquement si absent
}

// ─── HELPER : construire une route GeoJSON depuis des waypoints ──────────────

export const buildRoute = (waypoints: GeoPoint[]): Feature<LineString> => {
  return turf.lineString(waypoints.map((p) => [p.lon, p.lat]));
};

/**
 * Longueur totale d'une route en kilomètres.
 */
export const routeLengthKm = (route: Feature<LineString>): number => {
  return turf.length(route, { units: "kilometers" });
};

// ─── MOUVEMENT : position à N% d'une route ──────────────────────────────────

/**
 * Retourne les coordonnées SVG d'un point à `progress` (0→1) le long d'une route.
 * Remplace l'interpolation linéaire naive lerp(svgA, svgB).
 *
 * @param route - LineString GeoJSON (buildRoute)
 * @param progress - 0 (départ) → 1 (arrivée)
 * @returns [svgX, svgY] — à passer dans makeMapCoord pour l'écran
 */
export const positionAlongRoute = (
  route: Feature<LineString>,
  progress: number
): [number, number] => {
  const totalKm = routeLengthKm(route);
  const distKm = Math.max(0, Math.min(1, progress)) * totalKm;
  const pt = turf.along(route, distKm, { units: "kilometers" });
  const [lon, lat] = pt.geometry.coordinates;
  return lngLatToSvg(lon, lat);
};

// ─── ORIENTATION : bearing pour orienter un sprite ──────────────────────────

/**
 * Bearing (direction) à `progress` le long d'une route — en degrés depuis le Nord.
 * Positif = est (sprite face east), négatif = ouest, ~0 = nord, ~±180 = sud.
 *
 * Usage : bearing > 0 && bearing < 180 → direction est → utiliser sprite "east"
 *         bearing < 0 || bearing > 180 → direction ouest → utiliser sprite "west"
 *         Math.abs(bearing) < 45 → nord → rotate(-90) sur sprite east
 *
 * @returns bearing en degrés -180..180
 */
export const bearingAlongRoute = (
  route: Feature<LineString>,
  progress: number
): number => {
  const totalKm = routeLengthKm(route);
  const distKm = Math.max(0, Math.min(0.999, progress)) * totalKm;
  const delta = Math.min(0.5, totalKm * 0.01); // 1% de la route ou 500m
  const ptA = turf.along(route, distKm, { units: "kilometers" });
  const ptB = turf.along(route, Math.min(distKm + delta, totalKm), { units: "kilometers" });
  return turf.bearing(ptA, ptB);
};

/**
 * Retourne "east" | "west" | "north" | "south" selon le bearing.
 */
export const directionAlongRoute = (
  route: Feature<LineString>,
  progress: number
): "east" | "west" | "north" | "south" => {
  const b = bearingAlongRoute(route, progress);
  const abs = Math.abs(b);
  if (abs < 45) return "north";
  if (abs > 135) return "south";
  return b > 0 ? "east" : "west";
};

/**
 * Angle de rotation CSS pour orienter un sprite "east" vers le bearing réel.
 * Si le sprite fait face à l'est (→), on lui applique (bearing - 90)°.
 * Ex: north → -90°, south → 90°, west → 180°, east → 0°
 */
export const rotationFromBearing = (bearing: number): number => {
  return bearing - 90;
};

// ─── FILE INDIENNE : N sprites espacés sur une route ────────────────────────

/**
 * Retourne les coordonnées SVG de N sprites en file indienne sur une route.
 * Le sprite 0 est en tête (le plus avancé), le sprite N-1 est en queue.
 * Chaque membre est espacé de `spacingKm` km.
 *
 * @param route - LineString GeoJSON
 * @param progress - position du leader (0→1)
 * @param count - nombre de membres
 * @param spacingKm - espacement en km entre chaque membre (défaut 0.3km = 300m)
 * @returns tableau de [svgX, svgY] pour chaque membre
 */
export const caravanePositions = (
  route: Feature<LineString>,
  progress: number,
  count: number,
  spacingKm = 0.3
): Array<[number, number]> => {
  const totalKm = routeLengthKm(route);
  const leaderKm = Math.max(0, Math.min(1, progress)) * totalKm;
  return Array.from({ length: count }, (_, i) => {
    const memberKm = Math.max(0, leaderKm - i * spacingKm);
    const pt = turf.along(route, memberKm, { units: "kilometers" });
    const [lon, lat] = pt.geometry.coordinates;
    return lngLatToSvg(lon, lat);
  });
};

// ─── ARC GÉODÉSIQUE : route maritime courbe ──────────────────────────────────

/**
 * Génère un LineString GeoJSON suivant un grand cercle (route maritime réaliste).
 * Passer ce LineString à positionAlongRoute() pour animer un bateau dessus.
 *
 * @param from - point de départ {lon, lat}
 * @param to - point d'arrivée {lon, lat}
 * @param npoints - précision de la courbe (défaut 64)
 */
export const greatCircleRoute = (
  from: GeoPoint,
  to: GeoPoint,
  npoints = 64
): Feature<LineString> => {
  const gc = turf.greatCircle(
    turf.point([from.lon, from.lat]),
    turf.point([to.lon, to.lat]),
    { npoints }
  );
  // greatCircle retourne un Feature<LineString> ou Feature<MultiLineString>
  if (gc.geometry.type === "MultiLineString") {
    // Aplatir en LineString simple (cas des trajets qui croisent ±180°)
    const coords = gc.geometry.coordinates.flat();
    return turf.lineString(coords);
  }
  return gc as Feature<LineString>;
};

// ─── ROUTES PRÉDÉFINIES PESTE 1347 ──────────────────────────────────────────
// Waypoints historiquement documentés pour les routes commerciales Mali-Europe.

export const ROUTES_GEO = {
  // Route caravane or : Niani → Tombouctou → Sidjilmassa (Maroc) → Tunis → côte
  CARAVANE_OR: buildRoute([
    { lon: -8.386, lat: 11.379 },   // Niani (capitale Mali)
    { lon: -3.014, lat: 16.787 },   // Tombouctou
    { lon: -4.5,   lat: 22.0   },   // Sahara central (Taoudenni)
    { lon: -4.5,   lat: 28.0   },   // Sahara nord
    { lon: -5.0,   lat: 34.0   },   // Maghreb (Sidjilmassa/Fès)
  ]),

  // Route maritime : Maghreb → Florence (via Méditerranée)
  MARITIME_FLORENCE: greatCircleRoute(
    { lon: -5.0,   lat: 34.0 },     // Maghreb
    { lon: 11.255, lat: 43.769 }    // Florence
  ),

  // Route maritime : Florence → Venise
  MARITIME_VENISE: greatCircleRoute(
    { lon: 11.255, lat: 43.769 },   // Florence
    { lon: 12.336, lat: 45.434 }    // Venise
  ),
} as const;
