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
 * Piste SINUEUSE A->B (inspiration GPT-5.6 Sol : une route de contrebande serpente, ce n'est pas une
 * ligne GPS droite). = grand cercle + ondulation sinusoïdale PERPENDICULAIRE en degrés (amplitude `amp`,
 * `waves` oscillations). Reste géo-cohérente (autour du vrai trajet), juste organique.
 */
export function windingCircle(a: LonLat, b: LonLat, amp = 0.9, waves = 2.5, samples = 80): LonLat[] {
  const base = greatCircle(a, b, samples);
  // direction moyenne A->B pour la perpendiculaire (approx plane, suffisant à cette échelle)
  const dLon = b[0] - a[0];
  const dLat = b[1] - a[1];
  const len = Math.hypot(dLon, dLat) || 1;
  const perpLon = -dLat / len; // perpendiculaire unitaire
  const perpLat = dLon / len;
  return base.map((p, i) => {
    const t = i / (base.length - 1);
    const env = Math.sin(t * Math.PI); // amplitude nulle aux extrémités (part et arrive droit)
    const off = Math.sin(t * Math.PI * waves) * amp * env;
    return [p[0] + perpLon * off, p[1] + perpLat * off] as LonLat;
  });
}

/** Chemin SVG de la portion révélée [0..reveal] d'une piste sinueuse (cf windingCircle). */
export function windingPathD(
  proj: GeoProjection,
  path: (obj: any) => string | null,
  a: LonLat,
  b: LonLat,
  reveal: number,
  amp = 0.9,
  waves = 2.5,
  samples = 80
): string {
  const r = Math.max(0, Math.min(1, reveal));
  if (r <= 0) return "";
  const full = windingCircle(a, b, amp, waves, samples);
  const cut = Math.max(1, Math.round(full.length * r));
  const d = path({ type: "LineString", coordinates: full.slice(0, cut + 1) } as any);
  return d || "";
}

/** Position écran {x,y} à la fraction t d'une piste sinueuse, ou null si derrière le globe. */
export function pointAlongWinding(
  proj: GeoProjection,
  a: LonLat,
  b: LonLat,
  t: number,
  visible: (p: LonLat) => boolean,
  amp = 0.9,
  waves = 2.5,
  samples = 80
): { x: number; y: number } | null {
  const pts = windingCircle(a, b, amp, waves, samples);
  const idx = Math.max(0, Math.min(pts.length - 1, Math.round(Math.max(0, Math.min(1, t)) * (pts.length - 1))));
  const ll = pts[idx];
  if (!visible(ll)) return null;
  const xy = proj(ll);
  return xy ? { x: xy[0], y: xy[1] } : null;
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
  // --- Acte 5 "Le reseau qui arme dans l'ombre" (verif WebSearch 2026-07-17, cf script v6) ---
  abuDhabi: [54.37, 24.45] as LonLat, // Emirats — origine du financement
  kufra: [23.28, 24.18] as LonLat, // Libye SE — depart corridor (bataillon Subul al-Salam, LNA)
  benghazi: [20.07, 32.11] as LonLat, // Libye NE — siege politique Haftar/LNA
  elFasher: [25.35, 13.63] as LonLat, // Soudan, Darfour — arrivee corridor (deja dans sudan.warmap.json)
  libyaCenter: [17.5, 26.5] as LonLat, // point de repos camera sur le territoire libyen
  // --- Acte 6 "Pourquoi personne ne l'arrete" (verrou institutionnel, verif 2026-07-20) ---
  khartoum: [32.53, 15.5] as LonLat, // capitale — foyer de deplacement (cercles concentriques B5)
  nyala: [24.88, 12.05] as LonLat, // Darfour Sud — 2e foyer de deplacement B5
  addisAbeba: [38.74, 9.03] as LonLat, // siege Union africaine (jeton institutionnel B1 optionnel)
  newYork: [-73.97, 40.7] as LonLat, // siege ONU (jeton institutionnel B1 optionnel)
  // --- Acte 4 "Meme les voisins sont aspires" (Russie/Egypte, verif 2026-07-20) ---
  moscou: [37.62, 55.75] as LonLat, // Russie — base navale Port-Soudan + bascule RSF->SAF 2024
  portSoudan: [37.22, 19.62] as LonLat, // Port-Soudan, mer Rouge (base navale russe negociee)
};
