// globeGeo — socle geo pour le proto A1 (globe orthographique 16:9).
// On decode le monde Natural Earth 110m (TopoJSON) UNE fois, et on expose:
//  - les features monde (contours pays)
//  - un graticule (grille lon/lat de la sphere)
//  - une projection orthographique dont la ROTATION est pilotee frame-driven
//  - un helper pour savoir si un point (lon,lat) est sur l'hemisphere visible (anti front/back).
//
// geoOrthographic clippe nativement l'hemisphere cache (preClip), donc les paths des pays
// caches sont automatiquement omis par geoPath — on n'a PAS a le gerer a la main pour le dessin.
// Le helper isVisible sert seulement pour placer des labels/points (qui ne sont pas des paths).
import { geoOrthographic, geoPath, geoGraticule10, geoCentroid, type GeoProjection } from "d3-geo";
import { feature } from "topojson-client";
import world110m from "../../../../public/_rnd/vox-repro/countries-110m.json";

export const W = 1920;
export const H = 1080;

type WorldFeature = {
  type: "Feature";
  properties: { name: string };
  geometry: any;
};

let _features: WorldFeature[] | null = null;

// Toutes les features pays, decodees une fois.
export function worldFeatures(): WorldFeature[] {
  if (_features) return _features;
  const fc = feature(world110m as any, (world110m as any).objects.countries) as any;
  _features = fc.features as WorldFeature[];
  return _features;
}

export function featureByName(name: string): WorldFeature | undefined {
  return worldFeatures().find((f) => f.properties.name === name);
}

// Centroide reel [lon,lat] du bloc Sahel (Mali+Niger+Burkina) — cible de la rotation.
export const SAHEL_TARGET: [number, number] = (() => {
  const names = ["Mali", "Niger", "Burkina Faso"];
  const feats = names.map(featureByName).filter(Boolean) as WorldFeature[];
  // moyenne des centroides des 3 pays (approx suffisante pour viser le centre)
  let lon = 0, lat = 0;
  for (const f of feats) {
    const c = geoCentroid(f as any);
    lon += c[0];
    lat += c[1];
  }
  return [lon / feats.length, lat / feats.length];
})();

// Le graticule (grille), en Feature unique.
export const GRATICULE = geoGraticule10();

// Rayon du globe a l'ecran (l'ortho a un rayon = scale). On veut un globe qui remplit ~78% de la hauteur.
export const GLOBE_R = Math.round((H * 0.78) / 2); // ~421

// Construit une projection ortho pour une rotation donnee [lambda, phi] (degres).
// lambda = rotation E/O (on tourne le globe pour amener une longitude au centre = -lon).
// phi    = inclinaison N/S (= -lat pour centrer une latitude).
export function orthoAt(rotLambda: number, rotPhi: number, cx = W / 2, cy = H / 2): GeoProjection {
  return geoOrthographic()
    .scale(GLOBE_R)
    .translate([cx, cy])
    .rotate([rotLambda, rotPhi])
    .clipAngle(90); // clip l'hemisphere arriere
}

export function pathOf(proj: GeoProjection) {
  return geoPath(proj);
}

// Un point (lon,lat) est-il sur la face visible pour une rotation donnee ?
// Angle entre le point et le centre-visible de la projection. > 90deg = derriere le globe.
export function isVisible(
  lonLat: [number, number],
  rotLambda: number,
  rotPhi: number
): boolean {
  // centre visible du globe = (-rotLambda, -rotPhi)
  const toRad = Math.PI / 180;
  const [lon, lat] = lonLat;
  const cLon = -rotLambda;
  const cLat = -rotPhi;
  // distance angulaire (loi des cosinus spherique)
  const cosd =
    Math.sin(lat * toRad) * Math.sin(cLat * toRad) +
    Math.cos(lat * toRad) * Math.cos(cLat * toRad) * Math.cos((lon - cLon) * toRad);
  return cosd > 0; // > 0 => angle < 90deg => visible
}
