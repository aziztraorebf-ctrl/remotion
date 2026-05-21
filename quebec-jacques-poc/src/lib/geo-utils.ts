// geo-utils.ts — Turf.js helpers pour quebec-jacques-poc (Mapbox + Remotion stack)
//
// Convention : on retourne du GeoJSON / coords WGS84 lat/lng.
// La conversion vers pixels se fait via map.project() au moment du render
// (sync caméra parfaite).
//
// Adapté de src/projects/atlas/_shared/geoUtils.ts (Atlas SVG projection)
// mais SANS la projection SVG custom (on utilise Mapbox map.project()).

import * as turf from "@turf/turf";
import type { Feature, LineString, Point, Polygon, MultiPolygon, FeatureCollection } from "geojson";

export type LonLat = [number, number];

export interface GeoPoint {
  lon: number;
  lat: number;
}

// ─── ROUTES & DISTANCES ─────────────────────────────────────────────────────

/**
 * Crée un LineString GeoJSON depuis une liste de waypoints {lon, lat}.
 */
export const buildRoute = (waypoints: GeoPoint[]): Feature<LineString> => {
  return turf.lineString(waypoints.map((p) => [p.lon, p.lat]));
};

/**
 * Longueur totale d'une route en kilomètres.
 */
export const routeLengthKm = (route: Feature<LineString>): number => {
  return turf.length(route, { units: "kilometers" });
};

/**
 * Distance directe entre 2 points (en km).
 */
export const getDistanceKm = (from: LonLat, to: LonLat): number => {
  return turf.distance(turf.point(from), turf.point(to), { units: "kilometers" });
};

// ─── GRAND CERCLE (route géodésique réaliste) ───────────────────────────────

/**
 * Génère un LineString suivant le grand cercle entre deux points.
 * C'est la VRAIE trajectoire la plus courte sur Terre (pas une ligne droite Mercator).
 *
 * @param from - point de départ [lon, lat]
 * @param to - point d'arrivée [lon, lat]
 * @param npoints - précision de la courbe (défaut 100)
 */
export const greatCircleRoute = (
  from: LonLat,
  to: LonLat,
  npoints = 100
): Feature<LineString> => {
  const gc = turf.greatCircle(turf.point(from), turf.point(to), { npoints });
  // greatCircle retourne Feature<LineString> OU Feature<MultiLineString> (cas trajets >180°)
  if (gc.geometry.type === "MultiLineString") {
    const coords = gc.geometry.coordinates.flat();
    return turf.lineString(coords);
  }
  return gc as Feature<LineString>;
};

// ─── POSITION & BEARING LE LONG D'UNE ROUTE ─────────────────────────────────

/**
 * Coordonnées lon/lat d'un point à `progress` (0→1) le long d'une route.
 */
export const positionAlongRoute = (
  route: Feature<LineString>,
  progress: number
): LonLat => {
  const totalKm = routeLengthKm(route);
  const distKm = Math.max(0, Math.min(1, progress)) * totalKm;
  const pt = turf.along(route, distKm, { units: "kilometers" });
  return pt.geometry.coordinates as LonLat;
};

/**
 * Bearing (direction en degrés, 0 = nord, 90 = est) à `progress` le long d'une route.
 */
export const bearingAlongRoute = (
  route: Feature<LineString>,
  progress: number
): number => {
  const totalKm = routeLengthKm(route);
  const distKm = Math.max(0, Math.min(0.999, progress)) * totalKm;
  const delta = Math.min(0.5, totalKm * 0.01);
  const ptA = turf.along(route, distKm, { units: "kilometers" });
  const ptB = turf.along(route, Math.min(distKm + delta, totalKm), { units: "kilometers" });
  return turf.bearing(ptA, ptB);
};

// ─── CARAVANE : N sprites en file indienne sur une route ────────────────────

/**
 * Retourne les coords lon/lat de N sprites en file indienne sur une route.
 * Sprite 0 = leader (le plus avancé), N-1 = queue.
 *
 * @param route - LineString (buildRoute ou greatCircleRoute)
 * @param progress - 0→1 (position du leader)
 * @param count - nombre de sprites
 * @param spacingKm - espacement entre chaque sprite en km
 */
export const caravanePositions = (
  route: Feature<LineString>,
  progress: number,
  count: number,
  spacingKm = 50
): LonLat[] => {
  const totalKm = routeLengthKm(route);
  const leaderKm = Math.max(0, Math.min(1, progress)) * totalKm;
  return Array.from({ length: count }, (_, i) => {
    const memberKm = Math.max(0, leaderKm - i * spacingKm);
    const pt = turf.along(route, memberKm, { units: "kilometers" });
    return pt.geometry.coordinates as LonLat;
  });
};

// ─── PAYS : centroïde, bbox, fit camera ─────────────────────────────────────

type CountryGeometry = Feature<Polygon | MultiPolygon> | FeatureCollection;

/**
 * Centre géométrique d'un pays (centroïde du polygone).
 */
export const getCountryCenter = (geojson: CountryGeometry): LonLat => {
  const c = turf.centroid(geojson as any);
  return c.geometry.coordinates as LonLat;
};

/**
 * Bounding box d'un pays : [minLon, minLat, maxLon, maxLat].
 */
export const getCountryBbox = (geojson: CountryGeometry): [number, number, number, number] => {
  return turf.bbox(geojson) as [number, number, number, number];
};

/**
 * Calcule center + zoom Mapbox pour qu'un pays remplisse parfaitement le viewport.
 * Padding en pixels.
 *
 * @param geojson - Feature ou FeatureCollection du pays
 * @param viewportWidth - largeur viewport en pixels (ex: 1280)
 * @param viewportHeight - hauteur viewport en pixels (ex: 720)
 * @param padding - marge en pixels (défaut 80)
 */
export const fitCameraToCountry = (
  geojson: CountryGeometry,
  viewportWidth: number,
  viewportHeight: number,
  padding = 80
): { center: LonLat; zoom: number } => {
  const [minLon, minLat, maxLon, maxLat] = getCountryBbox(geojson);
  const center: LonLat = [(minLon + maxLon) / 2, (minLat + maxLat) / 2];

  // Approximation Mercator : on calcule le zoom qui fait tenir bbox dans viewport
  // Largeur d'une tile = 256px, world width à zoom 0 = 256px
  // World width à zoom Z = 256 * 2^Z
  // 360° = world width → 1° = world width / 360
  const lonSpan = maxLon - minLon;
  // Pour la latitude, on doit projeter en Mercator car la projection n'est pas linéaire
  const latToMerc = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  const mercSpan = latToMerc(maxLat) - latToMerc(minLat);
  // En Mercator, world height (entre lat -85 et +85) ≈ 2π (en unités Mercator)
  // Donc latSpanInWorld = mercSpan / (2π)

  const horizontalZoom = Math.log2((viewportWidth - 2 * padding) * 360 / (lonSpan * 256));
  const verticalZoom = Math.log2((viewportHeight - 2 * padding) * 2 * Math.PI / (mercSpan * 256));

  const zoom = Math.min(horizontalZoom, verticalZoom);
  return { center, zoom };
};

// ─── ROUTES PREDEFINIES POUR EPISODES AFRIQUE ───────────────────────────────

/**
 * Pèlerinage de Mansa Moussa (1324) : Niani → Tombouctou → Caire → La Mecque
 */
export const PILGRIMAGE_MANSA_MOUSSA = buildRoute([
  { lon: -8.386, lat: 11.379 },  // Niani (ancienne capitale Mali)
  { lon: -3.014, lat: 16.787 },  // Tombouctou
  { lon: 13.0,   lat: 21.0   },  // Sahara central
  { lon: 31.234, lat: 30.046 },  // Le Caire
  { lon: 39.83,  lat: 21.42  },  // La Mecque
]);

/**
 * Route caravanière de l'or : Niani → Tombouctou → Taoudenni → Sijilmasa
 */
export const ROUTE_OR_NIANI_SIJILMASA = buildRoute([
  { lon: -8.386, lat: 11.379 },  // Niani
  { lon: -3.014, lat: 16.787 },  // Tombouctou
  { lon: -4.0,   lat: 22.7   },  // Taoudenni (mines de sel)
  { lon: -4.27,  lat: 31.62  },  // Sijilmasa (Maroc)
]);
