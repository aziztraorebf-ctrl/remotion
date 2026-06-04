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

// Fonction de projection WGS84 → SVG (720×1280). Toute projection Atlas a ce type.
export type Projection = (lon: number, lat: number) => [number, number];

// Point d'ancrage de calibration : une coord géo connue ET sa position écran connue.
export interface ProjAnchor {
  lon: number;
  lat: number;
  x: number;
  y: number;
}

const latToMerc = (lat: number): number =>
  Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));

/**
 * FACTORY — construit une projection Mercator linéaire à partir de 2 ancres connues.
 * X est linéaire en longitude, Y logarithmique en latitude (Mercator standard).
 * C'est la généralisation de l'ancienne projection figée : chaque épisode/région
 * Atlas a SA paire d'ancres (voir PROJECTION_ANCHORS). Ne JAMAIS réutiliser les
 * ancres d'une région pour une autre — les coords tomberaient hors champ.
 *
 *   const proj = makeLngLatToSvg(anchorA, anchorB);
 *   const [x, y] = proj(lon, lat);
 */
export const makeLngLatToSvg = (a: ProjAnchor, b: ProjAnchor): Projection => {
  // X linéaire
  const xScale = (b.x - a.x) / (b.lon - a.lon);
  const lonToX = (lon: number) => a.x + (lon - a.lon) * xScale;
  // Y logarithmique (Mercator)
  const yScale = (b.y - a.y) / (latToMerc(b.lat) - latToMerc(a.lat));
  const yOffset = a.y - yScale * latToMerc(a.lat);
  const latToY = (lat: number) => yScale * latToMerc(lat) + yOffset;
  return (lon, lat) => [lonToX(lon), latToY(lat)];
};

/**
 * FACTORY ALTERNATIVE — projection centrée plus intuitive pour une NOUVELLE région
 * sans carte pré-projetée : on donne le centre géo (placé au milieu du cadre) et
 * une échelle en pixels par degré de longitude. Y reste Mercator (correct aux
 * latitudes moyennes). Pratique pour cadrer une bataille (Cannes, Thermopyles)
 * dont on connaît le centre et l'emprise voulue, sans avoir 2 ancres écran.
 */
export const centeredProjection = (
  centerLon: number,
  centerLat: number,
  pxPerDegLon: number,
  cx = SVG_W / 2,
  cy = SVG_H / 2,
): Projection => {
  // 1° lon = pxPerDegLon px. En Mercator, l'échelle Y suit la même densité au centre.
  const mercCenter = latToMerc(centerLat);
  // dériver px par unité Mercator pour que l'échelle soit isotrope au centre :
  // d(merc)/d(lat) au centre = 1/cos(lat) en rad ; px/° lat ≈ px/° lon → on aligne
  // via la densité Mercator pour rester cohérent verticalement.
  const pxPerMerc = (pxPerDegLon * 180) / Math.PI; // unités Mercator → px
  return (lon, lat) => [
    cx + (lon - centerLon) * pxPerDegLon,
    cy - (latToMerc(lat) - mercCenter) * pxPerMerc,
  ];
};

// ─── CATALOGUE D'ANCRAGES PAR RÉGION ─────────────────────────────────────────
// Chaque épisode Atlas hors Afrique de l'Ouest a SA projection. Ajouter ici les
// régions au fur et à mesure (1 entrée = 1 projection prête à l'emploi).
export const PROJECTIONS = {
  // Afrique de l'Ouest (Mali / Peste 1347) — ancres historiques peste-map-data.json.
  // = l'ancienne projection figée, conservée à l'identique (zéro régression).
  mali: makeLngLatToSvg(
    { lon: -8.386, lat: 11.379, x: 210.56, y: 737.35 }, // Niani
    { lon: -3.014, lat: 16.787, x: 249.94, y: 696.46 }, // Tombouctou
  ),
  // Méditerranée occidentale (Hannibal, vue large Carthage→Rome) — centrée Italie sud.
  mediterranee: centeredProjection(15.5, 41.0, 90),
  // Bataille de Cannes (échelle LOCALE plaine, ~3 km de front) — centrée sur le
  // dispositif tactique. Étalement ~180×230 px, centré cadre. Pour le multi-flèches
  // d'encerclement (cas où mapanimation échoue : confrontation localisée sans trajet).
  cannae: centeredProjection(16.1, 41.32, 1100),
  // Europe (Napoléon) — centrée Europe centrale, échelle moyenne continentale.
  europe: centeredProjection(15.0, 48.0, 26),
  // Grèce (Thermopyles) — centrée golfe Maliaque, échelle locale très serrée.
  grece: centeredProjection(22.5, 38.9, 130),
} as const satisfies Record<string, Projection>;

/**
 * Projection par DÉFAUT (Afrique de l'Ouest / Mali). Conservée pour zéro régression :
 * tout code existant qui importe lngLatToSvg garde exactement le même résultat.
 * Pour une autre région, passer une projection de PROJECTIONS aux helpers de route.
 */
export const lngLatToSvg: Projection = PROJECTIONS.mali;

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
  progress: number,
  proj: Projection = lngLatToSvg
): [number, number] => {
  const totalKm = routeLengthKm(route);
  const distKm = Math.max(0, Math.min(1, progress)) * totalKm;
  const pt = turf.along(route, distKm, { units: "kilometers" });
  const [lon, lat] = pt.geometry.coordinates;
  return proj(lon, lat);
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
  spacingKm = 0.3,
  proj: Projection = lngLatToSvg
): Array<[number, number]> => {
  const totalKm = routeLengthKm(route);
  const leaderKm = Math.max(0, Math.min(1, progress)) * totalKm;
  return Array.from({ length: count }, (_, i) => {
    const memberKm = Math.max(0, leaderKm - i * spacingKm);
    const pt = turf.along(route, memberKm, { units: "kilometers" });
    const [lon, lat] = pt.geometry.coordinates;
    return proj(lon, lat);
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

// ─── ROUTE COURBE (spline) PAR WAYPOINTS — pour l'enveloppement ───────────────

/**
 * Génère un LineString GeoJSON COURBE passant par des waypoints, via une spline
 * Catmull-Rom évaluée en coords géo (lon/lat). Contrairement à buildRoute (polyligne
 * à angles secs) et greatCircleRoute (2 points seulement), donne un arc DOUX à 3+
 * points — indispensable pour une aile d'enveloppement qui contourne (Cannes).
 *
 * @param waypoints - min 2 points (2 → ligne droite)
 * @param npointsPerSeg - densité d'échantillonnage par segment (def 24)
 */
export const bezierRoute = (
  waypoints: GeoPoint[],
  npointsPerSeg = 24,
): Feature<LineString> => {
  if (waypoints.length < 3) return buildRoute(waypoints);
  const pts = waypoints.map((p) => [p.lon, p.lat] as [number, number]);
  const out: [number, number][] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    for (let s = 0; s < npointsPerSeg; s++) {
      const t = s / npointsPerSeg;
      const t2 = t * t;
      const t3 = t2 * t;
      // Catmull-Rom (tension 0.5)
      const lon =
        0.5 *
        (2 * p1[0] +
          (-p0[0] + p2[0]) * t +
          (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
          (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
      const lat =
        0.5 *
        (2 * p1[1] +
          (-p0[1] + p2[1]) * t +
          (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
          (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
      out.push([lon, lat]);
    }
  }
  out.push(pts[pts.length - 1]);
  return turf.lineString(out);
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
