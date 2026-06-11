// WARMAP PREMIUM KIT — briques réutilisables de la voie premium validée (modèle Proto24 / beat 2.4).
//
// Extrait de Proto24Extinction.tsx (validé Aziz 2026-06-11) pour généraliser à P2 (et P3/P4).
// Règles incarnées ici :
//   - Zone d'emprise = STATIQUE (croissance unique à l'installation puis figée ; contour déchiqueté
//     déterministe IMMOBILE). Pas de blob qui ondule.
//   - Path lisse fermé (Catmull-Rom → bézier) pour rendre une zone géo projetée.
//   - Fumée ambiante = PING-PONG (0→N→0) tant que la condition dure.
//   - Sprites marqueurs Gemini ancrés au pied (encre fine, ~0.22 vmin).
//
// NB : Proto24Extinction.tsx reste INTACT (compo de test validée). Ce kit sert la NOUVELLE P2 et au-delà.

import { interpolate, Easing } from "remotion";

export type GeoRing = [number, number][];
export type Pt = { x: number; y: number };
export type ProjectFn = (lon: number, lat: number) => Pt;
// Zone d'emprise transitoire (R-OBJ-3) : apparaît à startF, s'estompe à endF (1 active à la fois).
export type Zone = { center: [number, number]; rLon: number; rLat: number; startF: number; endF: number };

// ── ÉCHELLE CARTE LOCALE (R-OBJ-1 : taille ancrée à la carte, jamais à l'écran) ──
// Mesure combien de PIXELS représente 1° de longitude à (lon,lat) à la frame courante.
// Quand la caméra DÉZOOME, cette valeur diminue → les sprites dimensionnés avec elle rétrécissent
// proportionnellement à la carte (un objet de N km reste N km, ne grossit plus au pull-back).
// Usage : `const w = kmToPx(project, lon, lat) * widthInDegrees;` ou via mapScalePx ci-dessous.
export function mapScalePx(project: ProjectFn, lon: number, lat: number): number {
  const a = project(lon, lat);
  const b = project(lon + 0.5, lat); // 0.5° de longitude
  return Math.hypot(b.x - a.x, b.y - a.y) / 0.5; // px par degré de longitude
}

// Taille d'un sprite ancrée à la carte : `degWidth` = largeur voulue de l'objet en DEGRÉS de longitude.
// Renvoie la largeur en px à la frame courante. Borne min/max pour rester lisible aux zooms extrêmes.
export function spriteMapWidth(project: ProjectFn, lon: number, lat: number, degWidth: number,
  bounds?: { min: number; max: number }): number {
  const w = mapScalePx(project, lon, lat) * degWidth;
  if (!bounds) return w;
  return Math.max(bounds.min, Math.min(bounds.max, w));
}

// ── Palette premium P2 (décisions Aziz) ──
export const PAL = {
  RED_INK: "#8B3A3A",    // rouge-brique (emprise jihadiste)
  RED_DEEP: "#5A2424",   // rouge sourd (arrière de zone)
  STEEL: "#5E7FA0",      // bleu-acier (présence FR vivante)
  UN_BLUE: "#6E8FB0",    // bleu-ONU (MINUSMA, distinct des bases FR)
  INK: "#2A1C0E",        // encre brune (traits, labels)
  CEDEAO: "#C77B3A",     // orange-ocre (coalition CEDEAO)
} as const;

export const SMOKE_FRAMES = 9;

// Bruit déterministe par index d'angle (déchiqueture FIXE du contour) — stable, immobile.
export function jag(i: number): number {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1; // [-1, 1]
}

// ── ZONE D'EMPRISE STATIQUE ──
// Anneau géo déchiqueté qui s'INSTALLE une fois (scale grow 0.4→1 sur `install` frames à partir de
// `startF`) puis se FIGE. Contour déterministe (jag) IMMOBILE — aucune dépendance continue à frame.
export function buildStaticZone(opts: {
  frame: number;
  startF: number;
  center: [number, number];
  rLon: number;
  rLat: number;
  n?: number;
  install?: number;
  jagAmp?: number;
}): GeoRing {
  const { frame, startF, center, rLon, rLat } = opts;
  const n = opts.n ?? 20;
  const install = opts.install ?? 30;
  const jagAmp = opts.jagAmp ?? 0.22;
  const grow = interpolate(frame, [startF, startF + install], [0.4, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const rl = rLon * grow;
  const ra = rLat * grow;
  const ring: GeoRing = [];
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2;
    const f = 1 + jag(i) * jagAmp;
    ring.push([center[0] + Math.cos(ang) * rl * f, center[1] + Math.sin(ang) * ra * f]);
  }
  return ring;
}

// ── PATH LISSE FERMÉ (Catmull-Rom → bézier) à partir de points écran ──
export function smoothClosedPath(pts: Pt[]): string {
  if (pts.length < 3) return "";
  const n = pts.length;
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += `C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d + "Z";
}

// ── FUMÉE PING-PONG (ambiant) ──
// Retourne {idx, op} pour une fumée qui démarre à `startF` et boucle en ping-pong (0→8→0) sans raccord dur.
// op = fade-in court depuis startF. Rendu : <img fx-smoke/${idx}.png> imageRendering pixelated.
export function smokePingPong(opts: {
  frame: number;
  startF: number;
  fps: number;
  smokeFps?: number;
  fadeIn?: number;
}): { idx: number; op: number } | null {
  const { frame, startF, fps } = opts;
  const smokeFps = opts.smokeFps ?? 12;
  const fadeIn = opts.fadeIn ?? 14;
  const rel = frame - startF;
  if (rel < 0) return null;
  const pingpong = SMOKE_FRAMES > 1 ? (SMOKE_FRAMES - 1) * 2 : 1;
  const playFrame = Math.floor((rel / fps) * smokeFps);
  const phase = playFrame % pingpong;
  const idx = phase < SMOKE_FRAMES ? phase : pingpong - phase;
  const op = interpolate(rel, [0, fadeIn], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { idx, op };
}

// ── Interpolation couleur hex (#rrggbb) ──
export function lerpHex(a: string, b: string, t: number): string {
  const ah = a.replace("#", ""), bh = b.replace("#", "");
  const ar = parseInt(ah.slice(0, 2), 16), ag = parseInt(ah.slice(2, 4), 16), ab = parseInt(ah.slice(4, 6), 16);
  const br = parseInt(bh.slice(0, 2), 16), bg = parseInt(bh.slice(2, 4), 16), bb = parseInt(bh.slice(4, 6), 16);
  const r = Math.round(ar + (br - ar) * t), g = Math.round(ag + (bg - ag) * t), bl = Math.round(ab + (bb - ab) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}
