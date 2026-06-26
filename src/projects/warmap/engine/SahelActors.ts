/**
 * SahelActors.ts — Acteurs tactiques pour SahelWarMapEngine.
 *
 * Contenu : type A1Vehicle, ACTE1_VEHICLES, type Fighter, FIGHTERS,
 * interpFighter, interpA1Vehicle, blobPath.
 *
 * Fonctions pures uniquement — pas de hook React, pas de closure sur état composant.
 * ACTE1_VEHICLES référence A1.JNIM / A1.EIGS / A1.END importés depuis SahelTimings.
 */

import { A1 } from "./SahelTimings";

export type A1Vehicle = {
  id: string; sprite: string; faction: "jnim" | "eigs";
  size: number;
  appear: number; disappear: number;
  wp: { f: number; lon: number; lat: number }[];
};

export const ACTE1_VEHICLES: A1Vehicle[] = [
  // recalé V5
  // JNIM #1 : patrouille erratique centre Mali, converge vers point friction (lon -0.35)
  { id: "a1-jnim-1", sprite: "technical-jnim", faction: "jnim", size: 56,
    appear: A1.JNIM, disappear: A1.END,
    wp: [
      { f: 1132, lon: -1.6, lat: 14.9 }, { f: 1253, lon: -1.1, lat: 15.2 },
      { f: 1372, lon: -1.5, lat: 15.0 }, { f: 1507, lon: -0.9, lat: 15.1 },
      { f: 1689, lon: -0.7, lat: 14.95 }, { f: 1779, lon: -0.5, lat: 15.0 },
      { f: 1840, lon: -0.42, lat: 15.0 },
      { f: 1962, lon: -0.6, lat: 15.0 },
      { f: 2096, lon: -0.65, lat: 14.95 },
    ] },
  // JNIM #2 : seconde patrouille, plus au nord, reste en retrait
  { id: "a1-jnim-2", sprite: "technical-jnim", faction: "jnim", size: 54,
    appear: A1.JNIM + 60, disappear: A1.END,
    wp: [
      { f: 1168, lon: -0.9, lat: 15.3 }, { f: 1312, lon: -0.5, lat: 15.45 },
      { f: 1462, lon: -0.8, lat: 15.5 }, { f: 1689, lon: -0.6, lat: 15.3 },
      { f: 1840, lon: -0.5, lat: 15.25 }, { f: 2096, lon: -0.55, lat: 15.3 },
    ] },
  // EIGS : avance LINEAIRE depuis l'est (Niger) vers le point friction (lon -0.28)
  { id: "a1-eigs-1", sprite: "technical-eigs", faction: "eigs", size: 46,
    appear: A1.EIGS, disappear: A1.END,
    wp: [
      { f: 1461, lon: 1.5, lat: 15.0 }, { f: 1643, lon: 0.7, lat: 15.0 },
      { f: 1779, lon: 0.0, lat: 15.0 },
      { f: 1840, lon: -0.14, lat: 15.0 },
      { f: 1962, lon: 0.05, lat: 15.0 },
      { f: 2096, lon: 0.1, lat: 15.0 },
    ] },
];

export type Fighter = {
  id: string; faction: "jnim" | "eigs"; appear: number;
  wp: { f: number; lon: number; lat: number }[];
};

export const FIGHTERS: Fighter[] = [
  // recalé V5
  // --- JNIM : 4 jetons DISPERSES sur le centre Mali + nord Burkina (rural diffus) ---
  { id: "j1", faction: "jnim", appear: 945, wp: [
    { f: 945, lon: -2.9, lat: 14.85 }, { f: 1132, lon: -3.0, lat: 14.9 },
    { f: 1840, lon: -2.9, lat: 14.9 }, { f: 2096, lon: -3.0, lat: 14.85 } ] },
  { id: "j2", faction: "jnim", appear: 973, wp: [
    { f: 973, lon: -1.7, lat: 15.6 }, { f: 1132, lon: -1.8, lat: 15.65 },
    { f: 1734, lon: -1.1, lat: 15.35 }, { f: 1840, lon: -0.5, lat: 15.15 }, { f: 1962, lon: -1.0, lat: 15.3 } ] },
  { id: "j3", faction: "jnim", appear: 1002, wp: [
    { f: 1002, lon: -1.5, lat: 14.0 }, { f: 1132, lon: -1.6, lat: 13.95 },
    { f: 1840, lon: -1.4, lat: 14.05 }, { f: 2096, lon: -1.6, lat: 14.0 } ] },
  { id: "j4", faction: "jnim", appear: 1030, wp: [
    { f: 1030, lon: -0.7, lat: 14.6 }, { f: 1132, lon: -0.75, lat: 14.55 },
    { f: 1734, lon: -0.95, lat: 14.6 }, { f: 1840, lon: -0.9, lat: 14.55 }, { f: 1962, lon: -1.1, lat: 14.55 } ] },
  // --- EIGS : 3 jetons DISPERSES sur l'est (triangle large : Menaka/Tillaberi/Liptako-est) ---
  { id: "e1", faction: "eigs", appear: 1348, wp: [
    { f: 1348, lon: 1.1, lat: 15.0 }, { f: 1461, lon: 0.9, lat: 15.05 },
    { f: 1734, lon: 0.55, lat: 15.0 }, { f: 1840, lon: 0.3, lat: 15.0 }, { f: 1962, lon: 0.7, lat: 15.0 } ] },
  { id: "e2", faction: "eigs", appear: 1363, wp: [
    { f: 1363, lon: 1.7, lat: 14.6 }, { f: 1461, lon: 1.8, lat: 14.55 },
    { f: 1840, lon: 1.6, lat: 14.6 }, { f: 2096, lon: 1.8, lat: 14.55 } ] },
  { id: "e3", faction: "eigs", appear: 1378, wp: [
    { f: 1378, lon: 1.5, lat: 15.5 }, { f: 1461, lon: 1.6, lat: 15.6 },
    { f: 1840, lon: 1.4, lat: 15.5 }, { f: 2096, lon: 1.6, lat: 15.55 } ] },
];

export const interpFighter = (wp: Fighter["wp"], frame: number): [number, number] => {
  if (frame <= wp[0].f) return [wp[0].lon, wp[0].lat];
  const last = wp[wp.length - 1];
  if (frame >= last.f) return [last.lon, last.lat];
  for (let i = 0; i < wp.length - 1; i++) {
    if (frame >= wp[i].f && frame <= wp[i + 1].f) {
      const t = (frame - wp[i].f) / (wp[i + 1].f - wp[i].f);
      const e = t * t * (3 - 2 * t);
      return [wp[i].lon + (wp[i + 1].lon - wp[i].lon) * e,
              wp[i].lat + (wp[i + 1].lat - wp[i].lat) * e];
    }
  }
  return [last.lon, last.lat];
};

export const interpA1Vehicle = (wp: A1Vehicle["wp"], frame: number): [number, number] => {
  if (frame <= wp[0].f) return [wp[0].lon, wp[0].lat];
  const last = wp[wp.length - 1];
  if (frame >= last.f) return [last.lon, last.lat];
  for (let i = 0; i < wp.length - 1; i++) {
    if (frame >= wp[i].f && frame <= wp[i + 1].f) {
      const t = (frame - wp[i].f) / (wp[i + 1].f - wp[i].f);
      const e = t * t * (3 - 2 * t);
      return [wp[i].lon + (wp[i + 1].lon - wp[i].lon) * e,
              wp[i].lat + (wp[i + 1].lat - wp[i].lat) * e];
    }
  }
  return [last.lon, last.lat];
};

export const blobPath = (cx: number, cy: number, r: number, variant: "organic" | "angular"): string => {
  const N = variant === "organic" ? 10 : 7;
  const seedAmp = variant === "organic" ? 0.28 : 0.12;
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const wob = 1 + seedAmp * Math.sin(i * 12.9898 + (variant === "organic" ? 1.3 : 4.7));
    pts.push([cx + Math.cos(a) * r * wob, cy + Math.sin(a) * r * wob]);
  }
  if (variant === "angular") {
    return pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join("") + "Z";
  }
  let d = `M${((pts[0][0] + pts[N - 1][0]) / 2).toFixed(1)},${((pts[0][1] + pts[N - 1][1]) / 2).toFixed(1)}`;
  for (let i = 0; i < N; i++) {
    const next = pts[(i + 1) % N];
    const mid: [number, number] = [(pts[i][0] + next[0]) / 2, (pts[i][1] + next[1]) / 2];
    d += `Q${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)} ${mid[0].toFixed(1)},${mid[1].toFixed(1)}`;
  }
  return d + "Z";
};
