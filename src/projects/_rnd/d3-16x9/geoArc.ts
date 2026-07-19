// geoArc — helpers pour les ARCS de flux sur le globe orthographique (Soudan Acte 3).
//
// Coeur du "ressenti carrefour" : un flux (or, drones) qui part d'un point geo et rejoint un autre
// point geo en SUIVANT LA COURBURE de la sphere (grand cercle), pas une ligne droite en pixels.
//
// Methode :
//  - geoInterpolate(A, B) donne une fonction t->[lon,lat] le long du grand cercle A->B.
//  - on echantillonne N points [lon,lat], on les projette avec la projection ortho courante :
//    geoPath rend automatiquement un LineString clippe par l'hemisphere visible (clipAngle 90).
//    => l'arc DISPARAIT tout seul quand il passe derriere le globe. C'est l'effet "vol sur la sphere".
//  - pointAlongArc(t) renvoie la position ECRAN du marqueur voyageur a une fraction t (ou null si
//    le point est sur la face cachee => on masque le marqueur).
//
// Pas de dependance a d3-shape : geoInterpolate est dans d3-geo (deja installe).
import { geoInterpolate, type GeoProjection } from "d3-geo";

export type LonLat = [number, number];

/** Echantillonne le grand cercle A->B en `samples` points [lon,lat]. */
export function greatCircle(a: LonLat, b: LonLat, samples = 64): LonLat[] {
  const interp = geoInterpolate(a, b);
  const pts: LonLat[] = [];
  for (let i = 0; i <= samples; i++) {
    pts.push(interp(i / samples) as LonLat);
  }
  return pts;
}

/**
 * Chemin SVG (d) de la portion revelee [0..reveal] du grand cercle A->B, projetee.
 * geoPath clippe nativement la partie derriere le globe.
 */
export function arcPathD(
  proj: GeoProjection,
  path: (obj: any) => string | null,
  a: LonLat,
  b: LonLat,
  reveal: number,
  samples = 64
): string {
  const r = Math.max(0, Math.min(1, reveal));
  if (r <= 0) return "";
  const full = greatCircle(a, b, samples);
  const cut = Math.max(1, Math.round(full.length * r));
  const revealed = full.slice(0, cut + 1);
  const d = path({ type: "LineString", coordinates: revealed } as any);
  return d || "";
}

/**
 * Position ECRAN {x,y} du marqueur a la fraction t du grand cercle A->B, ou null si le point
 * est derriere le globe (face cachee) — dans ce cas on ne dessine pas le marqueur.
 * `visible` = helper isVisible du socle (evite de dessiner un marqueur "fantome" a l'arriere).
 */
export function pointAlongArc(
  proj: GeoProjection,
  a: LonLat,
  b: LonLat,
  t: number,
  visible: (p: LonLat) => boolean
): { x: number; y: number } | null {
  const ll = geoInterpolate(a, b)(Math.max(0, Math.min(1, t))) as LonLat;
  if (!visible(ll)) return null;
  const xy = proj(ll);
  if (!xy) return null;
  return { x: xy[0], y: xy[1] };
}

/** Position ecran d'un point geo fixe (jeton, pulse), ou null si derriere le globe. */
export function projectPoint(
  proj: GeoProjection,
  ll: LonLat,
  visible: (p: LonLat) => boolean
): { x: number; y: number } | null {
  if (!visible(ll)) return null;
  const xy = proj(ll);
  if (!xy) return null;
  return { x: xy[0], y: xy[1] };
}

// --- Coordonnees geo reelles Acte 3 (from script + verif geo) --------------------------------
export const GEO = {
  jebelAmer: [24.9, 14.6] as LonLat, // Jebel Amer, Darfour Nord (mine or RSF)
  rsfToken: [24.2, 13.0] as LonLat, // jeton RSF (Darfour, cf livrable Mapbox)
  safToken: [32.5, 15.6] as LonLat, // jeton SAF (vallee du Nil / Khartoum)
  dubai: [55.27, 25.2] as LonLat,
  ankara: [32.85, 39.93] as LonLat,
  suakin: [37.33, 19.11] as LonLat, // ile de Suakin, mer Rouge
  cairo: [31.24, 30.04] as LonLat, // sortie or SAF -> Egypte
  sudanCenter: [30.0, 15.5] as LonLat,
};
