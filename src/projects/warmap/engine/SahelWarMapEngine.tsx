/**
 * SahelWarMapEngine — War-Map Long Format AES (Mali + Burkina Faso + Niger).
 *
 * Adapte de WarMapEngine.tsx (Sudan) pour le Sahel.
 * Differences cles :
 *   - Geographie : Mali + Burkina + Niger, centre lon -1.5 lat 15.5, zoom 4.2
 *   - GeoJSON : sahel-admin1.geojson (32 regions admin-1)
 *   - Factions : etat (bleu) / jnim (rouge) / conteste (or) au lieu de SAF/RSF
 *   - Duree : 13181 frames @30fps = 439.37s (narration-v1 forced-alignment)
 *   - Pas de freeze overlay (War-Map Long = carte permanente, overlays en incrustation)
 *   - 3 jetons-refugies geo-ancres : Djibo / Menaka / Tillaberi
 *   - Icones ressources geo-ancrees : or (Bamako/Ouagadougou), uranium+petrole (Niamey)
 *   - HUD : legende 3 factions + date jalon + label evenement
 *
 * Triggers visuels lies au forced-alignment (TIMING-V1-2026-06-07.md) :
 *   f1198  → JNIM zone rouge apparait
 *   f1471  → Burkina Faso s'allume
 *   f2009  → Niger s'allume
 *   f6798  → Liptako-Gourma pulse or
 *   f7014  → AES nee (overlay date)
 *   f7279  → Kidal s'allume seul
 *   f8683  → drapeau malien sur Kidal
 *   f10294 → jeton Djibo apparait
 *   f10349 → jeton Menaka apparait
 *   f10783 → jeton Tillaberi apparait
 *   f11032 → icone or Mali + Burkina
 *   f11122 → icone petrole Niger
 *   f12183 → "Sahéliens" — icones ressources restent
 *   f13169 → derniere phrase, extinction progressive
 */

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Loop,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { MapboxBrandingHide } from "../../_shared/mapbox/MapboxBase";
import { SahelAttackArrow } from "../_shared/SahelAttackArrow";
import { TerritorialExpansion, EXPANSION_REGIONS_ACT2 } from "../_shared/TerritorialExpansion";
import { RefugeeFlow, REFUGEE_FLOWS_ACT4 } from "../_shared/RefugeeFlow";
import { GeoConvergenceOverlay, GeoForce } from "../_shared/GeoConvergenceOverlay";
import { Partie1Origine } from "../parties/Partie1Origine";
import { Partie2Blocage } from "../parties/Partie2Blocage";
import {
  SAHEL_STATES,
  SAHEL_CITIES,
  SAHEL_VEHICLES,
  SAHEL_REFUGEES,
  sahelControlAt,
  sahelJalonAt,
  SAHEL_COLORS,
} from "./SahelControlData";
import type { Vehicle as SchemaVehicle, Refugee as SchemaRefugee, GeoPathPoint } from "../data/schema";
import type { SahelRenderContext } from "./SahelContext";
import { union } from "@turf/union";
import { featureCollection as turfFC } from "@turf/helpers";

// Helpers d'interpolation geo-path (meme logique que warmapVehicles.ts)

// ============================================================
// FUSION TERRITORIALE (B2) — dissout les régions admin-1 en grandes aires
// de contrôle par faction (union Turf). Règle d'or des reviews :
// "plus le découpage est fin, plus la couleur doit être UNIE". Memoïsé par
// signature de contrôle (ne recalcule l'union que si l'état change).
// bucket : 0=jnim, 0.5=conteste, 1=etat (on snap le ctrl continu au plus proche).
// ============================================================
const _fusionCache = new Map<string, any>();
const snapFaction = (c: number): number => (c < 0.25 ? 0 : c < 0.75 ? 0.5 : 1);

// byCountry=true → union par (pays, faction) : chaque masse appartient à 1 pays
// (nécessaire pour l'allumage séquentiel par pays). Sinon union par faction seule.
function buildFusedFC(
  baseFeatures: any[],
  ctrlByName: Record<string, number>,
  byCountry = false,
): any {
  const sig =
    (byCountry ? "C" : "F") +
    baseFeatures.map((f) => snapFaction(ctrlByName[f.properties.name] ?? 1)).join("");
  const cached = _fusionCache.get(sig);
  if (cached) return cached;

  const groups: Record<string, any[]> = {};
  for (const f of baseFeatures) {
    const fac = snapFaction(ctrlByName[f.properties.name] ?? 1);
    const key = byCountry ? `${f.properties.country}|${fac}` : String(fac);
    (groups[key] ||= []).push(f);
  }
  const fused: any[] = [];
  for (const key of Object.keys(groups)) {
    const polys = groups[key];
    let merged = polys[0];
    for (let i = 1; i < polys.length; i++) {
      try {
        const u = union(turfFC([merged, polys[i]]) as any);
        if (u) merged = u;
      } catch {
        // union échouée (géométrie invalide) → on garde tel quel
      }
    }
    const ctrlVal = byCountry ? parseFloat(key.split("|")[1]) : parseFloat(key);
    const country = byCountry ? key.split("|")[0] : null;
    merged.properties = {
      ctrl: ctrlVal,
      front: 1 - 2 * Math.abs(ctrlVal - 0.5),
      fused: true,
      country,
    };
    fused.push(merged);
  }
  const fc = { type: "FeatureCollection", features: fused };
  _fusionCache.set(sig, fc);
  return fc;
}
const interpPath = (path: GeoPathPoint[], t: number): [number, number] => {
  const x = Math.max(0, Math.min(1, t));
  if (x <= path[0].t) return [path[0].lon, path[0].lat];
  if (x >= path[path.length - 1].t) return [path[path.length - 1].lon, path[path.length - 1].lat];
  for (let i = 0; i < path.length - 1; i++) {
    if (x >= path[i].t && x <= path[i + 1].t) {
      const f = (x - path[i].t) / (path[i + 1].t - path[i].t);
      return [path[i].lon + (path[i + 1].lon - path[i].lon) * f, path[i].lat + (path[i + 1].lat - path[i].lat) * f];
    }
  }
  return [path[path.length - 1].lon, path[path.length - 1].lat];
};

// Triggers RÉELS Acte 1 (forced-alignment) — partagés par toutes les couches finales.
const A1 = {
  MALI: 150, BURKINA: 231, NIGER: 301, CEDEAO: 382, LIPTAKO: 502,
  FREEZE: 572, FREEZE_END: 632, DRIFT: 726,
  JNIM: 1198, EIGS: 1749, FRICTION: 2167, END: 2299,
} as const;

// ACTE 1 FINAL — PULSE RÉGION-PRÉCISE AU NOMMAGE.
// Quand la voix nomme un territoire, la/les région(s) admin-1 concernée(s) s'embrasent
// (flash couleur faction + halo) ~2-3s puis s'apaisent. Trigger = frame du mot (forced-align).
// regions = match sur properties.name du GeoJSON admin-1.
type RegionPulse = { key: string; faction: "jnim" | "eigs"; trigger: number; dur: number; regions: string[] };
const A1_REGION_PULSES: RegionPulse[] = [
  // "Il opère surtout dans les zones rurales — le centre du Mali" (f1411)
  { key: "jnim-mali", faction: "jnim", trigger: 1411, dur: 80, regions: ["Mopti", "Ségou"] },
  // "le nord du Burkina Faso" (f1454)
  { key: "jnim-bfa", faction: "jnim", trigger: 1454, dur: 90, regions: ["Sahel", "Nord", "Centre-Nord"] },
  // "la zone des trois frontières" (f1942)
  { key: "eigs-3f", faction: "eigs", trigger: 1942, dur: 80, regions: ["Ménaka", "Tillabéri"] },
  // "le nord-ouest du Niger" (f2009)
  { key: "eigs-niger", faction: "eigs", trigger: 2009, dur: 85, regions: ["Tillabéri", "Tahoua"] },
];

// B1 V3 — D-7 "on nomme → ça se dessine". Quand la voix nomme un territoire en B1, sa silhouette
// admin se redessine/teinte. Réutilise le mécanisme A1_REGION_PULSES (même boucle de reprojection).
// faction "jnim"=rouge (menace Mali), "eigs"=brun ; on ajoute une teinte via la couleur faction.
const ACTE2_REGION_PULSES: RegionPulse[] = [
  // "le nord du Mali s'embrase" → régions nord Mali se rallument [recalé v2 -27f]
  { key: "a2-mali", faction: "jnim", trigger: 2613, dur: 90, regions: ["Gao", "Kidal", "Tombouctou", "Mopti"] },
  // "Au Niger voisin" → Niger ouest se redessine [recalé v2 -59f]
  { key: "a2-niger", faction: "eigs", trigger: 3575, dur: 110, regions: ["Tillabéri", "Tahoua", "Agadez"] },
];

// ============================================================
// ACTE 1 FINAL — véhicules pilotés par FRAME ABSOLUE (fix immobilité tGlobal).
// JNIM = mouvement erratique (courbes, guérilla mobile). EIGS = linéaire (discipliné).
// Chaque véhicule : waypoints [frame, lon, lat]. Position = interpolation par frame.
// ============================================================
type A1Vehicle = {
  id: string; sprite: string; faction: "jnim" | "eigs";
  size: number; // px d'affichage (EIGS plus petit pour équilibrer)
  appear: number; disappear: number;
  wp: { f: number; lon: number; lat: number }[];
};
// Zone Liptako-Gourma (centre Mali / nord Burkina / ouest Niger), lon ~-1..2, lat ~13..16.
const ACTE1_VEHICLES: A1Vehicle[] = [
  // JNIM #1 : patrouille erratique centre Mali, converge vers point friction (lon -0.35)
  { id: "a1-jnim-1", sprite: "technical-jnim", faction: "jnim", size: 56,
    appear: A1.JNIM, disappear: A1.END,
    wp: [
      { f: 1198, lon: -1.6, lat: 14.9 }, { f: 1400, lon: -1.1, lat: 15.2 },
      { f: 1600, lon: -1.5, lat: 15.0 }, { f: 1800, lon: -0.9, lat: 15.1 },
      { f: 2000, lon: -0.7, lat: 14.95 }, { f: 2100, lon: -0.5, lat: 15.0 },
      { f: 2167, lon: -0.42, lat: 15.0 }, // arrive au contact (ouest du point friction)
      { f: 2230, lon: -0.6, lat: 15.0 },  // RECULE (répulsion ease-out-back)
      { f: 2299, lon: -0.65, lat: 14.95 },
    ] },
  // JNIM #2 : seconde patrouille, plus au nord, reste en retrait
  { id: "a1-jnim-2", sprite: "technical-jnim", faction: "jnim", size: 54,
    appear: A1.JNIM + 60, disappear: A1.END,
    wp: [
      { f: 1258, lon: -0.9, lat: 15.3 }, { f: 1500, lon: -0.5, lat: 15.45 },
      { f: 1750, lon: -0.8, lat: 15.5 }, { f: 2000, lon: -0.6, lat: 15.3 },
      { f: 2167, lon: -0.5, lat: 15.25 }, { f: 2299, lon: -0.55, lat: 15.3 },
    ] },
  // EIGS : avance LINÉAIRE depuis l'est (Niger) vers le point friction (lon -0.28)
  { id: "a1-eigs-1", sprite: "technical-eigs", faction: "eigs", size: 46,
    appear: A1.EIGS, disappear: A1.END,
    wp: [
      { f: 1749, lon: 1.5, lat: 15.0 }, { f: 1950, lon: 0.7, lat: 15.0 },
      { f: 2100, lon: 0.0, lat: 15.0 },
      { f: 2167, lon: -0.14, lat: 15.0 }, // arrive au contact (est du point friction)
      { f: 2230, lon: 0.05, lat: 15.0 },  // RECULE (répulsion)
      { f: 2299, lon: 0.1, lat: 15.0 },
    ] },
];
// ============================================================
// ACTE 1 FINAL — JETONS-COMBATTANTS (remplacent les véhicules sur ce format LONG).
// Décision Aziz 2026-06-07 + review Gemini+Kimi : véhicule = échelle absurde en plan
// large ; jeton circulaire = abstraction lisible à toute échelle. Les jetons SE DÉPLACENT
// AVEC INTENTION (arrivent → déploient/prennent territoire → front → reculent → se séparent).
// JNIM 4 jetons dispersés (rural ouest) · EIGS 3 jetons triangle serré (est trois-frontières).
// ============================================================
type Fighter = {
  id: string; faction: "jnim" | "eigs"; appear: number;
  wp: { f: number; lon: number; lat: number }[];
};
// Triggers : graines/arrivée AVANT la voix (JNIM nommé f1198, EIGS f1749).
// DISPERSION : positions bien espacées (>=0.5° entre jetons d'une faction) pour éviter
// l'agglutination. JNIM couvre un large arc rural ouest (Mopti->Centre-Nord BFA).
// EIGS occupe l'est (Ménaka/Tillabéri/Liptako est). Le front est à ~lon -0.2..0.2.
const FIGHTERS: Fighter[] = [
  // --- JNIM : 4 jetons DISPERSÉS sur le centre Mali + nord Burkina (rural diffus) ---
  { id: "j1", faction: "jnim", appear: 1000, wp: [ // ouest profond (Mopti/Ségou nord) — bien à l'ouest
    { f: 1000, lon: -2.9, lat: 14.85 }, { f: 1198, lon: -3.0, lat: 14.9 },
    { f: 2167, lon: -2.9, lat: 14.9 }, { f: 2299, lon: -3.0, lat: 14.85 } ] },
  { id: "j2", faction: "jnim", appear: 1030, wp: [ // centre-nord (avance vers le front à f2167)
    { f: 1030, lon: -1.7, lat: 15.6 }, { f: 1198, lon: -1.8, lat: 15.65 },
    { f: 2050, lon: -1.1, lat: 15.35 }, { f: 2167, lon: -0.5, lat: 15.15 }, { f: 2230, lon: -1.0, lat: 15.3 } ] },
  { id: "j3", faction: "jnim", appear: 1060, wp: [ // sud Burkina (Sahel/Djibo) — bien décollé vers le sud
    { f: 1060, lon: -1.5, lat: 14.0 }, { f: 1198, lon: -1.6, lat: 13.95 },
    { f: 2167, lon: -1.4, lat: 14.05 }, { f: 2299, lon: -1.6, lat: 14.0 } ] },
  { id: "j4", faction: "jnim", appear: 1090, wp: [ // centre-est EN RETRAIT (échelon arrière, ne colle pas le front)
    { f: 1090, lon: -0.7, lat: 14.6 }, { f: 1198, lon: -0.75, lat: 14.55 },
    { f: 2050, lon: -0.95, lat: 14.6 }, { f: 2167, lon: -0.9, lat: 14.55 }, { f: 2230, lon: -1.1, lat: 14.55 } ] },
  // --- EIGS : 3 jetons DISPERSÉS sur l'est (triangle large : Ménaka/Tillabéri/Liptako-est) ---
  { id: "e1", faction: "eigs", appear: 1560, wp: [ // pointe ouest EIGS (avance au front, garde l'écart)
    { f: 1560, lon: 1.1, lat: 15.0 }, { f: 1749, lon: 0.9, lat: 15.05 },
    { f: 2050, lon: 0.55, lat: 15.0 }, { f: 2167, lon: 0.3, lat: 15.0 }, { f: 2230, lon: 0.7, lat: 15.0 } ] },
  { id: "e2", faction: "eigs", appear: 1585, wp: [ // sud-est (Tillabéri Niger)
    { f: 1585, lon: 1.7, lat: 14.6 }, { f: 1749, lon: 1.8, lat: 14.55 },
    { f: 2167, lon: 1.6, lat: 14.6 }, { f: 2299, lon: 1.8, lat: 14.55 } ] },
  { id: "e3", faction: "eigs", appear: 1610, wp: [ // nord-est (Ménaka)
    { f: 1610, lon: 1.5, lat: 15.5 }, { f: 1749, lon: 1.6, lat: 15.6 },
    { f: 2167, lon: 1.4, lat: 15.5 }, { f: 2299, lon: 1.6, lat: 15.55 } ] },
];

const interpFighter = (wp: Fighter["wp"], frame: number): [number, number] => {
  if (frame <= wp[0].f) return [wp[0].lon, wp[0].lat];
  const last = wp[wp.length - 1];
  if (frame >= last.f) return [last.lon, last.lat];
  for (let i = 0; i < wp.length - 1; i++) {
    if (frame >= wp[i].f && frame <= wp[i + 1].f) {
      const t = (frame - wp[i].f) / (wp[i + 1].f - wp[i].f);
      const e = t * t * (3 - 2 * t); // smoothstep
      return [wp[i].lon + (wp[i + 1].lon - wp[i].lon) * e,
              wp[i].lat + (wp[i + 1].lat - wp[i].lat) * e];
    }
  }
  return [last.lon, last.lat];
};

const interpA1Vehicle = (wp: A1Vehicle["wp"], frame: number): [number, number] => {
  if (frame <= wp[0].f) return [wp[0].lon, wp[0].lat];
  const last = wp[wp.length - 1];
  if (frame >= last.f) return [last.lon, last.lat];
  for (let i = 0; i < wp.length - 1; i++) {
    if (frame >= wp[i].f && frame <= wp[i + 1].f) {
      const t = (frame - wp[i].f) / (wp[i + 1].f - wp[i].f);
      // easing doux (smoothstep) pour un déplacement non-robotique
      const e = t * t * (3 - 2 * t);
      return [wp[i].lon + (wp[i + 1].lon - wp[i].lon) * e,
              wp[i].lat + (wp[i + 1].lat - wp[i].lat) * e];
    }
  }
  return [last.lon, last.lat];
};

// Génère un path SVG de "tache" autour de (cx,cy). variant 'organic' = bords irréguliers
// doux (JNIM rural) ; 'angular' = contour plus géométrique/militaire (EIGS).
const blobPath = (cx: number, cy: number, r: number, variant: "organic" | "angular"): string => {
  const N = variant === "organic" ? 10 : 7;
  const seedAmp = variant === "organic" ? 0.28 : 0.12;
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    // rayon pseudo-aléatoire déterministe (pas de Math.random — sin-based)
    const wob = 1 + seedAmp * Math.sin(i * 12.9898 + (variant === "organic" ? 1.3 : 4.7));
    pts.push([cx + Math.cos(a) * r * wob, cy + Math.sin(a) * r * wob]);
  }
  if (variant === "angular") {
    // contour anguleux : lignes droites
    return pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join("") + "Z";
  }
  // organique : courbes lissées (quadratiques entre milieux de segments)
  let d = `M${((pts[0][0] + pts[N - 1][0]) / 2).toFixed(1)},${((pts[0][1] + pts[N - 1][1]) / 2).toFixed(1)}`;
  for (let i = 0; i < N; i++) {
    const next = pts[(i + 1) % N];
    const mid: [number, number] = [(pts[i][0] + next[0]) / 2, (pts[i][1] + next[1]) / 2];
    d += `Q${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)} ${mid[0].toFixed(1)},${mid[1].toFixed(1)}`;
  }
  return d + "Z";
};

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const SAHEL_FPS = 30;
// 439.37s narration + 3s fade out + 4s CTA = 446s -> arrondi a 13380 frames
export const SAHEL_DURATION = 13380;

// Bornes de la timeline carte (frames)
const T_START = Math.round(1.8 * SAHEL_FPS); // 54 frames — map pas encore visible, carton titre
const T_END = 13150;                          // ~438s — proche de la derniere syllabe

// ============================================================
// TRIGGERS AUDIO (depuis TIMING-V1-2026-06-07.md)
// ============================================================
const F_JNIM_ZONE     = 1198;  // "JNIM." — zone rouge apparait
const F_BURKINA       = 1471;  // "Faso" — Burkina s'allume
const F_NIGER         = 2009;  // "Niger." — Niger s'allume
const F_AES_NEE       = 7014;  // "née." — AES born overlay
const F_KIDAL_ALONE   = 7279;  // "Kidal." — Kidal s'allume
const F_KIDAL_FLAG    = 8683;  // "flotte" — drapeau malien sur Kidal
const F_REF_DJIBO     = 10294; // "Djibo," — jeton refugie Djibo
const F_REF_MENAKA    = 10349; // "Ménaka" — jeton refugie Menaka (2e occurrence)
const F_REF_TILLABERI = 10783; // "réel." — overlay humanitaire
const F_ICON_OR       = 11032; // "Mali" — icone or Mali + Burkina
const F_ICON_PETRO    = 11122; // "pétrole" — icone petrole Niger
const F_SAHELIENS     = 12183; // "Sahéliens." — phrase finale vision

// Triggers villes additionnels (depuis TIMING-V1)
const F_GAO           = 3989;  // "Gao," [recalé v2 -67f]
const F_MENAKA_BASE   = 4014;  // "Ménaka," (base militaire) [recalé v2 -68f]
const F_NIAMEY_BASE   = 4043;  // "Niamey." [recalé v2 -69f]
const F_DJIBO_REF     = 10294; // "Djibo," (réfugiés)

// SCRIPT: "Dans cette région, deux groupes armés se sont développés" (~f900)
// → la carte se COLORE (couleurs factions infusent). Avant : parchemin neutre (hook).
// Décision Aziz 2026-06-07 : carte neutre pendant tout le hook, montée du vide au plein.
const F_FACTIONS_INFUSE = 900;

// ============================================================
// TRIGGERS MAP ANIMATION — Act 2 + Act 3
// ============================================================

// SCRIPT: Act 2 — "s'embrase" → expansion territoriale JNIM 2012→2022
const F_EXPANSION_START = 2630; // "s'embrase"
const F_EXPANSION_END   = 4800; // "2022" (environ)

// SCRIPT: Act 2 — onde armes Libye → nord Mali (contexte ébullition)
const F_LIBYE_ARMES = 2630; // même déclencheur "s'embrase"

// SCRIPT: Act 3 — offensive FAMa + Africa Corps depuis Gao+Ménaka → Kidal (f8218→f8683)
const F_KIDAL_OFFENSIVE = 8218; // début offensive
const F_KIDAL_FLAG_VISIBLE = 8683; // "flotte" → flèches montrent le résultat

// SCRIPT: Act 3 — contre-offensive JNIM+CSP → Kidal (f9477)
const F_KIDAL_COUNTER = 9477;

// Coordonnées pour flèches tactiques Act 3
const GAO_COORD    = [-0.04, 16.27] as [number, number];
const MENAKA_COORD = [2.40, 15.92] as [number, number];
const KIDAL_COORD  = [1.44, 18.43] as [number, number];

// Coordonnées Libye (source armes) pour Act 2
const LIBYE_COORD  = [13.18, 32.90] as [number, number]; // Tripoli approximatif
const NORD_MALI_COORD = [1.44, 18.43] as [number, number]; // Kidal = porte d'entrée nord Mali

// ============================================================
// TRIGGERS HOOK — Acte 1 (depuis forced alignment narration-v1)
// SCRIPT: "Ils ont expulsé" → Mali blanc
// SCRIPT: "Rompu" → Burkina blanc
// SCRIPT: "Quitté" → Niger blanc + CEDEAO clignote
// SCRIPT: "quelque chose de nouveau" → vecteurs capitales → Liptako or
// SCRIPT: "Comment est-ce possible" → FIGÉE 2s
// ============================================================
const F_HOOK_MALI     = 150;   // "expulsé" → Mali s'allume blanc
const F_HOOK_BURKINA  = 231;   // "Rompu" → Burkina s'allume blanc
const F_HOOK_NIGER    = 301;   // "Quitté" → Niger s'allume blanc
const F_HOOK_CEDEAO   = 382;   // "continent." → anneau CEDEAO clignote orange → s'éteint
const F_HOOK_LIPTAKO  = 502;   // "nouveau." → vecteurs capitales + Liptako pulse or
const F_HOOK_FREEZE   = 572;   // "possible" → FIGÉE 2s (60 frames)
const F_HOOK_DRIFT    = 726;   // "répondre" → drift reprend

// Coordonnées pivots hook
const LIPTAKO_CENTER = [-0.5, 14.5] as [number, number]; // Centre zone Liptako-Gourma
const BAMAKO_COORD   = [-7.99, 12.65] as [number, number];
const OUAGA_COORD    = [-1.52, 12.37] as [number, number];
const NIAMEY_COORD   = [2.12, 13.51] as [number, number];

// ============================================================
// CAMÉRA NARRATIVE — serrée sur le cœur du conflit, se déplace par acte
// (Décision Aziz 2026-06-07 : reproduire l'effet Soudan — vue serrée et lisible,
//  caméra qui suit l'action acte par acte, PAS la vue large lointaine.)
// Soudan référence : zoom 4.55-5.12. Sahel plus large -> on serre sur le cœur
// narratif (Liptako/Kidal/Ménaka), on n'essaie PAS de tout montrer.
// Keyframes [frame, lon, lat, zoom] — interpolées en continu (drift doux entre).
// ============================================================
type CamKey = { f: number; lon: number; lat: number; zoom: number };
// ZOOM UNIFORME niveau hook (~4.75, décision Aziz 2026-06-07 : ne pas dépasser —
// sur écran large c'est lisible, on voit les chars, serrer plus = bruyant + perd
// le territoire). Drift TRÈS doux. La caméra se recentre par acte mais garde ~4.75.
const SAHEL_CAM_KEYS: CamKey[] = [
  // HOOK : cœur Liptako-Gourma
  { f: 0,     lon: -0.5, lat: 14.8, zoom: 4.75 },
  { f: 502,   lon: -0.5, lat: 14.8, zoom: 4.78 }, // convergence Liptako
  { f: 572,   lon: -0.5, lat: 14.7, zoom: 4.8 },  // freeze (figé)
  { f: 632,   lon: -0.5, lat: 14.7, zoom: 4.8 },  // fin freeze
  // ACTE 1 suite — deux groupes armés : centre Mali + nord Burkina
  { f: 900,   lon: -1.0, lat: 15.0, zoom: 4.75 },
  { f: 2167,  lon: -0.5, lat: 15.2, zoom: 4.78 }, // "combattent"
  // ACTE 2 — embrasement / bases
  { f: 2630,  lon: 0.0,  lat: 15.8, zoom: 4.7 },
  { f: 4032,  lon: 0.3,  lat: 15.6, zoom: 4.72 }, // bases militaires [recalé v2 -68f]
  { f: 6322,  lon: -0.3, lat: 15.0, zoom: 4.75 }, // "déclencheur"
  { f: 7014,  lon: -0.3, lat: 14.9, zoom: 4.75 }, // AES née
  // ACTE 3 — Kidal : recentre vers le nord mais MÊME zoom (pas de sur-zoom)
  { f: 7279,  lon: 0.6,  lat: 16.2, zoom: 4.75 }, // Kidal s'allume
  { f: 8218,  lon: 0.8,  lat: 16.6, zoom: 4.8 },  // offensive Kidal
  { f: 8683,  lon: 0.9,  lat: 16.8, zoom: 4.82 }, // drapeau flotte
  { f: 9477,  lon: 0.85, lat: 16.6, zoom: 4.8 },  // contre-offensive
  // ACTE 4 — réfugiés
  { f: 10294, lon: 0.0,  lat: 15.0, zoom: 4.72 }, // jetons réfugiés
  { f: 11122, lon: 1.0,  lat: 15.0, zoom: 4.7 },  // ressources
  // ACTE 5 — perspective
  { f: 12183, lon: -0.5, lat: 15.2, zoom: 4.68 },
  { f: 13150, lon: -0.5, lat: 15.5, zoom: 4.65 },
];

// ============================================================
// ACTE 1 — TRACK CAMÉRA DÉDIÉ (plan validé upstream Gemini+Kimi 2026-06-07)
// Beats calés sur les triggers RÉELS du forced-alignment (pas les approx du plan).
// Principe : drift continu doux, pan Ouest->Est (Mali->Burkina->Niger = logique du
// regard), zoom subtil (décision Aziz : ne pas sur-zoomer). FREEZE total f572-632.
// Phase 1 choc politique (0-726) · Phase 2/3 groupes armés (726-2299).
// ============================================================
// Drift CONTINU léger partout (jamais immobile sauf freeze f572-632), + recentrages
// marqués sur les événements (la cam "va voir" l'action). Micro-keyframes intermédiaires
// pour que la 2e moitié ne soit jamais statique (retour Aziz : trop figée après ~22s).
const ACTE1_CAM_KEYS: CamKey[] = [
  { f: 0,    lon: -1.2, lat: 15.2, zoom: 4.62 }, // installation : vue large, drift lent
  { f: 150,  lon: -2.0, lat: 14.6, zoom: 4.78 }, // "expulsé" Mali : recentre ouest + zoom léger
  { f: 231,  lon: -0.8, lat: 14.8, zoom: 4.74 }, // "Rompu" Burkina : pan est
  { f: 301,  lon:  0.6, lat: 15.2, zoom: 4.70 }, // "Quitté" Niger : pan est encore
  { f: 382,  lon: -0.4, lat: 15.0, zoom: 4.55 }, // "continent" CEDEAO : zoom-OUT (voir les 3)
  { f: 502,  lon: -0.4, lat: 14.7, zoom: 4.74 }, // "nouveau" Liptako : recentre + zoom léger
  { f: 572,  lon: -0.4, lat: 14.6, zoom: 4.78 }, // "possible" : arrivée freeze
  { f: 632,  lon: -0.4, lat: 14.6, zoom: 4.78 }, // FREEZE identique (figé 2s)
  { f: 726,  lon: -0.6, lat: 14.9, zoom: 4.70 }, // "répondre" : drift reprend, reset doux
  // --- 2e moitié : ZOOM TACTIQUE (review zone2) — on DESCEND sur le terrain ---
  { f: 960,  lon: -0.85, lat: 15.05, zoom: 4.95 }, // transition : push-in commence
  { f: 1198, lon: -0.95, lat: 15.1,  zoom: 5.30 }, // "JNIM" : push-in MALI central (zoom tactique)
  { f: 1450, lon: -0.75, lat: 15.15, zoom: 5.32 }, // drift pendant patrouille JNIM (serré)
  { f: 1620, lon: -0.2,  lat: 15.1,  zoom: 5.20 }, // pan vers l'est (transition continue O->E)
  { f: 1749, lon:  0.45, lat: 15.05, zoom: 5.28 }, // "EIGS" : trois-frontières est (zoom tactique)
  { f: 1980, lon:  0.15, lat: 15.05, zoom: 5.25 }, // drift pendant avancée EIGS
  { f: 2167, lon: -0.15, lat: 15.05, zoom: 5.18 }, // "combattent" : recule un peu pour voir les 2
  { f: 2299, lon: -0.15, lat: 15.05, zoom: 5.18 }, // "séparément" : freeze final
];

const getActe1Cam = (frame: number): { lon: number; lat: number; zoom: number } => {
  const keys = ACTE1_CAM_KEYS;
  if (frame <= keys[0].f) return keys[0];
  if (frame >= keys[keys.length - 1].f) return keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (frame >= keys[i].f && frame <= keys[i + 1].f) {
      const a = keys[i], b = keys[i + 1];
      const t = (frame - a.f) / (b.f - a.f);
      const e = t * t * (3 - 2 * t); // smoothstep (drift cinématique)
      return {
        lon: a.lon + (b.lon - a.lon) * e,
        lat: a.lat + (b.lat - a.lat) * e,
        zoom: a.zoom + (b.zoom - a.zoom) * e,
      };
    }
  }
  return keys[keys.length - 1];
};

// Nom du beat courant (HUD debug du track caméra seul)
const acte1BeatName = (frame: number): string => {
  if (frame < 150) return "f0 · installation (drift lent)";
  if (frame < 231) return "f150 · MALI 'expulsé' (recentre O + zoom)";
  if (frame < 301) return "f231 · BURKINA 'Rompu' (pan E)";
  if (frame < 382) return "f301 · NIGER 'Quitté' (pan E)";
  if (frame < 502) return "f382 · CEDEAO 'continent' (zoom-OUT)";
  if (frame < 572) return "f502 · LIPTAKO 'nouveau' (recentre + zoom)";
  if (frame < 632) return "f572 · FREEZE 'possible' (2s figé)";
  if (frame < 1198) return "f726 · transition 'répondre' (reset)";
  if (frame < 1749) return "f1198 · JNIM (centre Mali)";
  if (frame < 2167) return "f1749 · EIGS (trois-frontières E)";
  if (frame < 2299) return "f2167 · 'combattent' (friction)";
  return "f2299 · 'séparément' (freeze final)";
};

// ============================================================
// ACTE 2 — CAMÉRA B1 V2 (refonte 2026-06-09 selon WARMAP-VIVANTE-GRAMMAIRE R-V3).
// PARTIE 1 (V5) — track caméra dédié. Avant f2102 = getActe1Cam (continuité parfaite,
// pas de coupe). Puis PULL BACK pour révéler le corridor Libye→Mali (source des armes),
// HOLD large pendant pulse + trait d'encre, puis push-in lent vers Mali central (vide d'État).
const PARTIE1_CAM_KEYS: CamKey[] = [
  { f: 2102, lon: -0.15, lat: 15.05, zoom: 5.18 }, // = fin Acte 1 (raccord exact)
  { f: 2200, lon:  3.5,  lat: 19.8,  zoom: 4.05 }, // PULL BACK : pan NE + zoom-out (Libye sud + nord Mali)
  { f: 2300, lon:  6.0,  lat: 21.5,  zoom: 3.75 }, // corridor complet (Sebha haut → Kidal bas dans le cadre)
  { f: 2520, lon:  4.5,  lat: 20.0,  zoom: 3.85 }, // HOLD large, drift lent (trait d'encre descend)
  { f: 2640, lon:  1.0,  lat: 17.6,  zoom: 4.55 }, // push-in vers nord Mali (taches posées)
  { f: 2743, lon: -0.6,  lat: 15.6,  zoom: 4.95 }, // "absent" : Mali central / nord Burkina
  { f: 2940, lon: -0.6,  lat: 15.3,  zoom: 5.05 }, // Ken Burns lent (vide d'État + hachures)
];
const getPartie1Cam = (frame: number): { lon: number; lat: number; zoom: number } => {
  if (frame <= PARTIE1_CAM_KEYS[0].f) return getActe1Cam(frame);
  const keys = PARTIE1_CAM_KEYS;
  if (frame >= keys[keys.length - 1].f) return keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (frame >= keys[i].f && frame <= keys[i + 1].f) {
      const a = keys[i], b = keys[i + 1];
      const t = (frame - a.f) / (b.f - a.f);
      const e = t * t * (3 - 2 * t); // smoothstep (drift cinématique)
      return {
        lon: a.lon + (b.lon - a.lon) * e,
        lat: a.lat + (b.lat - a.lat) * e,
        zoom: a.zoom + (b.zoom - a.zoom) * e,
      };
    }
  }
  return keys[keys.length - 1];
};

// PARTIE 2 (V5) — "Le Blocage". Raccord exact depuis fin Partie 1 (f2940). Cadre nord-Mali
// (bases Gao/Ménaka/Tessalit) pour l'installation FR/ONU → léger pull-back pour l'échec
// (timeline + expansion rouge) → push-in singularisé pendant l'extinction → pan SUD pour le
// débordement Burkina → cadre élargi Niger/CEDEAO (pont Partie 3). Caméra = chef d'orchestre.
const PARTIE2_CAM_KEYS: CamKey[] = [
  { f: 2940, lon: -0.6,  lat: 15.3,  zoom: 5.05 }, // = fin Partie 1 (raccord exact)
  { f: 3196, lon:  0.6,  lat: 16.8,  zoom: 4.55 }, // 2.1 Serval : cadre nord-Mali (bases Gao/Ménaka/Tessalit)
  { f: 3443, lon:  0.2,  lat: 16.6,  zoom: 4.35 }, // 2.2 présence FR : léger pull-back (convergence régionale)
  { f: 3660, lon:  0.0,  lat: 16.4,  zoom: 4.45 }, // 2.3 MINUSMA : recentre (points ONU)
  { f: 3887, lon: -0.4,  lat: 16.0,  zoom: 4.20 }, // 2.4 échec : pull-back large (timeline + rouge + extinction)
  { f: 4200, lon: -0.2,  lat: 15.8,  zoom: 4.30 }, // 2.4 mid : léger push-in (singularise l'extinction)
  { f: 4421, lon: -0.6,  lat: 15.2,  zoom: 4.45 }, // 2.5 villes/campagnes : centre Mali rural
  { f: 4955, lon: -1.0,  lat: 14.2,  zoom: 4.55 }, // 2.6 Burkina : pan SUD (débordement frontière)
  { f: 5380, lon:  0.4,  lat: 14.0,  zoom: 4.35 }, // Niger bascule : pan EST (Niamey)
  { f: 5640, lon: -0.3,  lat: 14.4,  zoom: 4.15 }, // CEDEAO : élargi (pont Partie 3)
];
const getPartie2Cam = (frame: number): { lon: number; lat: number; zoom: number } => {
  if (frame <= PARTIE2_CAM_KEYS[0].f) return getActe1Cam(frame);
  const keys = PARTIE2_CAM_KEYS;
  if (frame >= keys[keys.length - 1].f) return keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (frame >= keys[i].f && frame <= keys[i + 1].f) {
      const a = keys[i], b = keys[i + 1];
      const t = (frame - a.f) / (b.f - a.f);
      const e = t * t * (3 - 2 * t); // smoothstep
      return {
        lon: a.lon + (b.lon - a.lon) * e,
        lat: a.lat + (b.lat - a.lat) * e,
        zoom: a.zoom + (b.zoom - a.zoom) * e,
      };
    }
  }
  return keys[keys.length - 1];
};

// Prolonge l'Acte 1 : avant f2299 = getActe1Cam (continuité parfaite).
// RÈGLE R-V3 : ZOOM CONSTANT (~5.0), PAN SERRÉ uniquement, JAMAIS de pull-back continental.
//   (vérifié : à zoom 5.0 on voit ~38° lon — Bamako→Arlit tient sans dézoomer. Le pull-back
//    de la V1 ratée n'était donc PAS nécessaire géographiquement.)
// Trajectoire B1 : board clearing FIXE → avion FIXE sur Gao → PAN EST serré vers Arlit (uranium)
//   → PAN RETOUR serré sur le triangle Gao/Ménaka/Niamey (bases). Zoom verrouillé 5.0-5.2 partout.
// B1 triggers (narration-v2, recalés) : MINUSMA f3136 · phrase B "jour même" f3296 · Niger voisin f3575 ·
//   Areva/Arlit f3689 · bases Gao/Ménaka/Niamey f3989-4043 · END f4124.
// ============================================================
// B1 V3 CAMÉRA (D-2 Ken Burns permanent + D-3 zoom raconte). Jamais figée, jamais pull-back.
// Ev1 zoom IN nord Mali · Ev2 PAN lent Gao→Bamako (remplit les 16s + prépare MINUSMA, fix upstream) ·
// Ev4 zoom serré "11 jours" · Ev5 PAN est Mali→Niger · Ev6 Arlit · Ev7 PAN latéral + dézoom 5% max.
const ACTE2_CAM_KEYS: CamKey[] = [
  { f: 2299, lon: -0.15, lat: 15.05, zoom: 5.18 },  // RACCORD exact fin Acte 1
  { f: 2630, lon: -0.15, lat: 15.05, zoom: 5.18 },  // entrée B1
  { f: 2678, lon: -0.10, lat: 15.55, zoom: 5.40 },  // Ev1 : ZOOM IN nord Mali (board clearing fini) [recalé v2 -22f]
  { f: 2766, lon:  0.05, lat: 15.95, zoom: 5.45 },  // Ev2 : suit l'arrivée du jeton FR → Gao [recalé v2 -24f]
  { f: 3127, lon: -1.30, lat: 14.90, zoom: 5.30 },  // Ev2 KEN BURNS : PAN lent Gao→Bamako (remplit + prépare MINUSMA) [recalé v2 -63f]
  { f: 3296, lon: -1.30, lat: 14.90, zoom: 5.55 },  // Ev4 : ZOOM serré phrase B "le jour même" (tension) [recalé v2 -56f]
  // OVERLAY PRÉ-POSITIONNEMENT f3300→f3550 : la caméra SE CALME (quasi-immobile, micro-drift 0.06°)
  // pour ne pas se battre avec l'overlay figé (décision Aziz 2026-06-09). Reprend le PAN après.
  { f: 3320, lon: -1.30, lat: 14.90, zoom: 5.55 },  // entrée overlay : fige la position
  { f: 3565, lon: -1.27, lat: 14.91, zoom: 5.56 },  // fin overlay : micro-drift (vivant mais calme)
  { f: 3610, lon: -1.27, lat: 14.91, zoom: 5.56 },  // HOLD après overlay : on voit le point Mali persister (transition seamless)
  { f: 3680, lon: -0.10, lat: 15.20, zoom: 5.28 },  // REPRISE PAN est (après le hold du point)
  { f: 3700, lon:  4.20, lat: 16.95, zoom: 5.15 },  // Ev5/6 : PAN est serré → Niger/Arlit (zoom ~constant) [recalé v2 -72f]
  { f: 3830, lon:  4.70, lat: 17.25, zoom: 5.15 },  // Ev6 : Arlit cadré (convoi monte) [recalé v2 -70f]
  { f: 3891, lon:  4.70, lat: 17.25, zoom: 5.15 },  // maintien [recalé v2 -69f]
  { f: 4043, lon:  1.30, lat: 15.10, zoom: 4.60 },  // Ev7 : recentre barycentre triangle + dézoom léger (lisibilité 3 bases) [recalé v2 -69f]
  { f: 4124, lon:  1.30, lat: 15.05, zoom: 4.60 },  // fin B1 : stabilisé sur le triangle FR [recalé v2 -68f]
];

// ACTE 2 — triggers narration ABSOLUS (forced-align) + bases militaires France.
// Recalé v2 (narration-v2, phrase B "le jour même de la demande malienne") :
// décalage local mesuré -63f→-69f sur la zone MINUSMA→END (forced-alignment).
const B1A = {
  MINUSMA: 3136, ARMES: 3296, ARLIT: 3689, URANIUM: 3829,
  GAO: 3989, MENAKA: 4014, NIAMEY: 4043, END: 4124,
} as const;
type Acte2Base = { id: string; sprite: string; lon: number; lat: number; appear: number };
const ACTE2_BASES: Acte2Base[] = [
  { id: "fr-gao",    sprite: "base-france", lon: -0.04, lat: 16.27, appear: B1A.GAO },
  { id: "fr-menaka", sprite: "base-france", lon:  2.40, lat: 15.92, appear: B1A.MENAKA },
  { id: "fr-niamey", sprite: "base-france", lon:  2.12, lat: 13.51, appear: B1A.NIAMEY },
];

// ============================================================
// B1 V3 — ÉLÉMENTS MOBILES (WARMAP-VIVANTE-GRAMMAIRE D-6 : jeton-acteur > icône illustrative).
// JETON SOLDATS FR : ARRIVE de l'ouest → se pose sur Gao sur "la France envoie ses soldats" (f2700).
//   = ACTEUR sur la carte (pas un avion illustratif — critique Aziz #3). Queue cinétique (sillage).
// CONVOI uranium : véhicule-sprite = FLUX logistique (autorisé D-6). Part Niger-nord, monte (f3800).
// Trajectoires en degrés géo, projetées par frame (map.project). Convoi nez GAUCHE (axe horizontal).
// ============================================================
const B1_FR_TOKEN = {
  start: [-5.2, 16.6] as [number, number],   // ouest hors-cadre (vient "de France"/Bamako-ouest)
  end:   [-0.04, 16.27] as [number, number], // Gao (= 1re base FR clé)
  fStart: 2687, fEnd: 2766,                   // ~2.6s — entrée sur "la France envoie ses soldats" [recalé v2 -23f]
};
const B1_CONVOY = {
  start: [5.5, 17.6] as [number, number],     // Niger nord (mines, dans le cadre serré)
  end:   [4.7, 19.4] as [number, number],     // remonte vers le nord (vers France hors-cadre)
  fStart: 3729, fEnd: 3851,                    // ~4s — lent (extraction continue) [recalé v2 -71f/-69f]
};
const B1_ARLIT_LABEL = [5.5, 17.6] as [number, number]; // ancre label "Arlit"
const B1_MINE_ARLIT = [5.5, 17.6] as [number, number];  // picto mine (pulse avant convoi, DeepSeek)
// Ev7 : relay-line Gao→Ménaka→Niamey + emprise unique englobante (pas 3 jetons — fix upstream).
const B1_BASES_RELAY: { lon: number; lat: number; appear: number; name: string }[] = [
  { lon: -0.04, lat: 16.27, appear: 3989, name: "Gao" },     // [recalé v2 -67f]
  { lon:  2.40, lat: 15.92, appear: 4014, name: "Ménaka" },  // [recalé v2 -68f]
  { lon:  2.12, lat: 13.51, appear: 4043, name: "Niamey" },  // [recalé v2 -69f]
];

const getActe2Cam = (frame: number): { lon: number; lat: number; zoom: number } => {
  // Avant la fin Acte 1 : strictement la caméra Acte 1 (continuité).
  if (frame <= 2299) return getActe1Cam(frame);
  const keys = ACTE2_CAM_KEYS;
  if (frame >= keys[keys.length - 1].f) return keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (frame >= keys[i].f && frame <= keys[i + 1].f) {
      const a = keys[i], b = keys[i + 1];
      const t = (frame - a.f) / (b.f - a.f);
      const e = t * t * (3 - 2 * t);
      return {
        lon: a.lon + (b.lon - a.lon) * e,
        lat: a.lat + (b.lat - a.lat) * e,
        zoom: a.zoom + (b.zoom - a.zoom) * e,
      };
    }
  }
  return keys[keys.length - 1];
};

const getSahelCam = (frame: number): { lon: number; lat: number; zoom: number } => {
  const keys = SAHEL_CAM_KEYS;
  if (frame <= keys[0].f) return keys[0];
  if (frame >= keys[keys.length - 1].f) return keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (frame >= keys[i].f && frame <= keys[i + 1].f) {
      const a = keys[i], b = keys[i + 1];
      const t = (frame - a.f) / (b.f - a.f);
      // easing doux (smoothstep) pour un drift cinématique sans à-coups
      const e = t * t * (3 - 2 * t);
      return {
        lon: a.lon + (b.lon - a.lon) * e,
        lat: a.lat + (b.lat - a.lat) * e,
        zoom: a.zoom + (b.zoom - a.zoom) * e,
      };
    }
  }
  return keys[keys.length - 1];
};

// ============================================================
// VILLES — apparition progressive liee a l'audio
// Chaque ville apparait quand la narration la mentionne pour la premiere fois.
// ============================================================
// SÉQUENTIEL STRICT (anti-overcharging, décision Aziz 2026-06-07) :
// chaque ville a une FENÊTRE DE VIE [appear, hold] puis s'efface. Jamais
// d'accumulation permanente — à tout instant, 1-2 villes max à l'écran.
// hold = frame jusqu'à laquelle la ville reste, puis fade-out 30f.
type CityConfig = { name: string; appearFrame: number; hold: number };
const CITY_SCHEDULE: CityConfig[] = [
  // Bamako = ancre capitale, reste pendant le hook puis s'efface à l'entrée Acte 2
  { name: "Bamako",      appearFrame: T_START,        hold: 2600 },
  // Acte 2 — bases militaires (citées ensemble f4056-4112), s'effacent avant Kidal
  { name: "Gao",         appearFrame: F_GAO,          hold: 7200 },
  { name: "Ménaka",      appearFrame: F_MENAKA_BASE,  hold: 7200 },
  { name: "Niamey",      appearFrame: F_NIAMEY_BASE,  hold: 5800 },
  { name: "Ouagadougou", appearFrame: F_BURKINA,      hold: 2600 },
  // Acte 3 — Kidal seul (foyer narratif unique), reste tout l'acte Kidal
  { name: "Kidal",       appearFrame: F_KIDAL_ALONE,  hold: 9900 },
  // Acte 4 — villes réfugiés (citées au moment des flux)
  { name: "Djibo",       appearFrame: F_DJIBO_REF,    hold: 11800 },
  { name: "Tillabéri",   appearFrame: F_ICON_PETRO,   hold: 12200 },
];

// micro-wobble papier (signature Atlas)
const paperWobble = (frame: number, seed = 0) =>
  Math.sin((frame + seed) * 0.08) * 0.3;

// B3 : ville-clé par pays — apparaît AVEC l'allumage de l'état (cause→effet).
// "1 élément = 1 fonction narrative" : le point pulse = le foyer de l'état qui s'active.
const COUNTRY_KEY_CITY: Record<string, string> = {
  MLI: "Bamako",
  BFA: "Ouagadougou",
  NER: "Niamey",
};

// ============================================================
// ICONES RESSOURCES geo-ancrees
// ============================================================
type ResourceIcon = {
  id: string;
  kind: "or" | "uranium" | "petrole";
  lon: number;
  lat: number;
  appearFrame: number;
  label: string;
};

const RESOURCE_ICONS: ResourceIcon[] = [
  // or Mali (Bamako)
  { id: "or-mali",  kind: "or",     lon: -8.0,  lat: 12.65, appearFrame: F_ICON_OR,    label: "Or" },
  // or Burkina (Ouagadougou offset leger pour lisibilite)
  { id: "or-bf",    kind: "or",     lon: -0.8,  lat: 12.4,  appearFrame: F_ICON_OR,    label: "Or" },
  // uranium Niger (Agadez) — apparait avec le petrole
  { id: "uranium",  kind: "uranium",lon:  7.99,  lat: 16.97, appearFrame: F_ICON_PETRO, label: "Uranium" },
  // petrole Niger (Agadez region / Diffa region)
  { id: "petrole",  kind: "petrole",lon:  13.0,  lat: 15.3,  appearFrame: F_ICON_PETRO, label: "Pétrole" },
];

// SVG inline pour les icones ressources (top-down, encre parchemin)
const ResourceSVG: React.FC<{ kind: ResourceIcon["kind"]; size?: number }> = ({ kind, size = 40 }) => {
  if (kind === "or") {
    // lingot d'or stylise
    return (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <rect x="7" y="14" width="26" height="14" rx="3" fill="#C99A3A" stroke="#3A2A18" strokeWidth="1.5" />
        <rect x="11" y="10" width="18" height="6" rx="2" fill="#D4A843" stroke="#3A2A18" strokeWidth="1.2" />
        <line x1="14" y1="14" x2="14" y2="28" stroke="#3A2A18" strokeWidth="0.8" opacity="0.4" />
        <line x1="20" y1="14" x2="20" y2="28" stroke="#3A2A18" strokeWidth="0.8" opacity="0.4" />
        <line x1="26" y1="14" x2="26" y2="28" stroke="#3A2A18" strokeWidth="0.8" opacity="0.4" />
      </svg>
    );
  }
  if (kind === "uranium") {
    // cristal hexagonal stylise
    return (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <polygon points="20,6 32,13 32,27 20,34 8,27 8,13" fill="#7BB3C4" stroke="#3A2A18" strokeWidth="1.5" />
        <polygon points="20,12 27,16 27,24 20,28 13,24 13,16" fill="#9FCFDF" stroke="#3A2A18" strokeWidth="0.8" />
        <circle cx="20" cy="20" r="4" fill="#D0EAF0" stroke="#3A2A18" strokeWidth="0.8" />
      </svg>
    );
  }
  // petrole : goutte
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <path d="M20 8 C20 8 8 22 8 28 A12 12 0 0 0 32 28 C32 22 20 8 20 8Z" fill="#2A2A2A" stroke="#3A2A18" strokeWidth="1.5" />
      <path d="M16 28 A5 5 0 0 1 22 23" stroke="#555" strokeWidth="1.2" fill="none" />
    </svg>
  );
};

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
// Props de TEST (off par défaut → zéro impact sur la compo SahelWarMap réelle).
// Servent au test 10s "socle visuel" (DA-BRIEF-GATE Acte 1, session dédiée 2026-06-07) :
//   - fusionRegions : masque les frontières inter-régions de MÊME faction (aplats unis)
//   - geoVignette   : assombrit (sépia ~0.42) tout ce qui n'est PAS l'AES (3 pays)
//   - camStatic     : fige la caméra sur une frame donnée (isole l'effet des corrections)
export type SahelTestProps = {
  fusionRegions?: boolean;
  geoVignette?: boolean;
  geoVignetteOpacity?: number;
  camStatic?: { lon: number; lat: number; zoom: number } | null;
  controlFrameOverride?: number | null; // force l'état de contrôle d'une frame précise
  // B3 : allumage séquentiel des masses + points-villes pulsants + fronts draw-in.
  // sequentialIgnite mappe pays → frame d'allumage (test : Mali f20, BFA f110, NER f200).
  sequentialIgnite?: Record<string, number> | null;
  cityPulse?: boolean; // points-villes beige avec anneau pulsant, liés à l'allumage
  frontDraw?: boolean; // fronts entre factions qui se dessinent (dashoffset) en beige
  // ÉTAPE 1 reconstruction Acte 1 : track caméra SEUL (ordre Gemini).
  // Active le nouveau track ACTE1_CAM_KEYS + masque TOUT data/chrome + HUD debug.
  acte1CameraOnly?: boolean;
  // VERSION FINALE Acte 1 : active tout le pipeline reconstruit (nouveau track caméra,
  // fusion + vignette + allumage séquentiel + fronts draw + nouveaux artefacts CEDEAO
  // fissure / flèches Liptako / nettoyage f727 / véhicules différenciés). Remplace
  // l'ancien hook. Les Actes 2-5 restent OFF (compo isolée f0-2299).
  acte1Final?: boolean;
  // ACTE 2 : PROLONGE l'Acte 1 (ne recrée rien). Active tout le look acte1Final
  // (jetons + taches + palette estompée + fusion + grain/vignette) MAIS sans la borne
  // f2299 — la couche tactique persiste, la caméra continue, et les éléments B1+
  // (bases France, flux uranium/armes) s'ajoutent à partir de f2630.
  acte2?: boolean;
  // Overlay pré-positionnement (D-9 premium) : opacité du voile sur la carte (test léger vs moyen).
  prepoVeil?: number;
  // REFACTOR V5 — mode Partie 1 (canari/origine 2012). Active le look Acte 1
  // (jetons/taches/palette/grain) MAIS désactive les blocs B1 legacy (acte2) et
  // rend la couche <Partie1Origine> par-dessus. Récit V5, direction soustraction.
  partie1?: boolean;
  // REFACTOR V5 — mode Partie 2 (le blocage). Look Acte 1 + couche <Partie2Blocage>.
  // Legacy B1 OFF. Récit V5, "effort massif / échec" (points rigides sur surfaces fluides).
  partie2?: boolean;
};

export const SahelWarMapEngine: React.FC<SahelTestProps> = ({
  fusionRegions = false,
  geoVignette = false,
  geoVignetteOpacity = 0.42,
  camStatic = null,
  controlFrameOverride = null,
  sequentialIgnite = null,
  cityPulse = false,
  frontDraw = false,
  acte1CameraOnly = false,
  acte1Final = false,
  acte2 = false,
  prepoVeil = 0.70, // validé Aziz 2026-06-09 (carte en sourdine, overlay net)
  partie1 = false,
  partie2 = false,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // ACTE 2 prolonge l'Acte 1 : tout le LOOK acte1Final s'applique aussi en acte2.
  // `isFinalLook` = pilote le rendu visuel (jetons, taches, palette, fusion, grain).
  // `acte1Final` seul reste pour ce qui est BORNÉ à l'Acte 1 (respiration finale f2299).
  // partie1/partie2 héritent du LOOK Acte 1 (jetons/taches/palette/grain) comme acte2,
  // mais SANS les blocs B1 legacy (qui restent gated sur `acte2` seul).
  const isFinalLook = acte1Final || acte2 || partie1 || partie2;
  // `isPartie` = un mode Partie V5 actif (factorise les gates communs).
  const isPartie = partie1 || partie2;

  // VERSION FINALE Acte 1 : dérive les sous-mécaniques du socle validé.
  // Allumage séquentiel calé sur les triggers RÉELS (Mali f150, BFA f231, NER f301).
  // On surcharge les flags effectifs (eff*) sans muter les props d'origine.
  const effFusion = isFinalLook ? true : fusionRegions;
  const effVignette = isFinalLook ? true : geoVignette;
  const effVignetteOp = isFinalLook ? 0.42 : geoVignetteOpacity;
  const effCityPulse = isFinalLook ? true : cityPulse;
  const effFrontDraw = isFinalLook ? true : frontDraw;
  const effSeqIgnite = isFinalLook
    ? { MLI: A1.MALI, BFA: A1.BURKINA, NER: A1.NIGER }
    : sequentialIgnite;
  // Acte 1 final + Acte 2 utilisent le nouveau track caméra.
  const useActe1Cam = isFinalLook || acte1CameraOnly;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  // B2 : features admin-1 brutes conservées pour recalculer la fusion quand le contrôle change.
  const baseFeaturesRef = useRef<any[] | null>(null);
  const [handle] = useState(() =>
    delayRender("SahelWarMapEngine", { timeoutInMilliseconds: 60000 })
  );
  const [ready, setReady] = useState(false);
  const [cityPx, setCityPx] = useState<{ name: string; x: number; y: number }[]>([]);
  const [vehPx, setVehPx] = useState<{ id: string; x: number; y: number; dx: number; dy: number }[]>([]);
  // B1 V2 : sprites mobiles (avion/convoi) projetés par frame (pos courante + heading + tête de veine).
  const [b1PlanePx, setB1PlanePx] = useState<{ x: number; y: number; deg: number; trail: {x:number;y:number}[] } | null>(null);
  const [b1ConvoyPx, setB1ConvoyPx] = useState<{ x: number; y: number; deg: number; trail: {x:number;y:number}[] } | null>(null);
  // B1 V2 : emprises de bases (cercle géo reprojeté en path SVG, pour le tracé stroke-dashoffset "dessiné main").
  const [b1BasePx, setB1BasePx] = useState<{ id: string; cx: number; cy: number; rx: number; appear: number }[]>([]);
  const [b1ArlitPx, setB1ArlitPx] = useState<{ x: number; y: number } | null>(null);
  const [refPx, setRefPx] = useState<{ id: string; x: number; y: number; dx: number; dy: number }[]>([]);
  // Point Mali persistant (transition overlay->carte) : position ÉCRAN du point "Mali" de l'overlay
  // (center={470,290} dans repère 1280×720, scale 1.12, centré 1920×1080). La caméra est en HOLD
  // pendant la transition, donc une position écran fixe = seamless avec le point de l'overlay.
  const b1MaliDotPx = { x: 960 + (470 - 640) * 1.12, y: 540 + (290 - 360) * 1.12 };
  const [iconPx, setIconPx] = useState<{ id: string; x: number; y: number }[]>([]);
  // CORRECTION B (test) : silhouette AES reprojetée en pixels (paths SVG) pour le masque vignette.
  const [aesPaths, setAesPaths] = useState<string[]>([]);
  // B3 frontDraw : contours des masses fusionnées reprojetés, groupés par pays (draw-in).
  const [frontPaths, setFrontPaths] = useState<{ country: string; d: string; len: number }[]>([]);
  // ACTE 1 FINAL : véhicules pilotés par frame absolue (position + direction + traînée).
  const [a1VehPx, setA1VehPx] = useState<{ id: string; x: number; y: number; dx: number; dy: number; trail: {x:number;y:number}[] }[]>([]);
  // ACTE 1 FINAL : foyers des taches d'influence (JNIM centre Mali, EIGS est) reprojetés.
  const [a1ZonePx, setA1ZonePx] = useState<{ jnim: {x:number;y:number}|null; eigs: {x:number;y:number}|null }>({ jnim: null, eigs: null });
  // ACTE 1 FINAL : jetons-combattants reprojetés (position + direction).
  const [fighterPx, setFighterPx] = useState<{ id: string; x: number; y: number; dx: number; dy: number }[]>([]);
  // ACTE 2 : bases militaires (sprites Gemini) reprojetées par frame.
  const [acte2BasePx, setActe2BasePx] = useState<{ id: string; x: number; y: number }[]>([]);
  // ACTE 1 FINAL : "graines" (futures positions des jetons) reprojetées — comblent le trou 25-40s.
  const [seedPx, setSeedPx] = useState<{ id: string; faction: string; x: number; y: number }[]>([]);
  // ACTE 1 FINAL : pulse région-précise au nommage (silhouettes admin-1 reprojetées par pulse actif).
  const [pulsePx, setPulsePx] = useState<{ key: string; faction: string; trigger: number; d: string }[]>([]);
  const [hookPx, setHookPx] = useState<{
    bamako: { x: number; y: number } | null;
    ouaga: { x: number; y: number } | null;
    niamey: { x: number; y: number } | null;
    liptako: { x: number; y: number } | null;
  }>({ bamako: null, ouaga: null, niamey: null, liptako: null });

  // REFACTOR V5 : contexte passe aux <PartieX>. Rempli dans la boucle frame
  // (apres jumpTo), expose project() (closure capturant la map courante) + etat.
  const [sahelCtx, setSahelCtx] = useState<SahelRenderContext | null>(null);

  // tGlobal : fraction 0..1 sur la duree utile (T_START -> T_END)
  const span = T_END - T_START;
  const local = Math.max(0, Math.min(span, frame - T_START));
  const tGlobal = local / span;

  const { jalon, i: jIndex } = sahelJalonAt(tGlobal);

  // ============================================================
  // INIT MAP
  // ============================================================
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      return;
    }

    let safety: ReturnType<typeof setTimeout> | null = setTimeout(() => {
      continueRender(handle);
      safety = null;
    }, 45000);

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      // Centre Sahel : entre Mali, Burkina, Niger
      center: [-1.5, 15.5],
      zoom: 4.2,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
      projection: { name: "mercator" },
    });
    mapRef.current = map;

    map.on("error", (e) => console.error("[Sahel] error:", e?.error?.message ?? e));

    map.on("style.load", async () => {
      // RESKIN PARCHEMIN (meme traitement que Sudan)
      try {
        const layers = map.getStyle().layers ?? [];
        for (const l of layers) {
          if (l.type === "symbol") map.setLayoutProperty(l.id, "visibility", "none");
          if (l.id.includes("water") && l.type === "fill") {
            map.setPaintProperty(l.id, "fill-color", SAHEL_COLORS.ocean);
          }
          if (
            l.id === "land" || l.id.includes("landuse") || l.id.includes("landcover") ||
            l.id === "background" || l.id.includes("national-park")
          ) {
            try { map.setPaintProperty(l.id, "background-color", SAHEL_COLORS.land); } catch {}
            try { map.setPaintProperty(l.id, "fill-color", SAHEL_COLORS.land); } catch {}
          }
          if (l.id.includes("admin-0")) {
            map.setPaintProperty(l.id, "line-color", SAHEL_COLORS.outline);
          }
          if (l.id.includes("admin-1")) {
            map.setPaintProperty(l.id, "line-color", "rgba(58,42,24,0.25)");
          }
        }
        if (map.getLayer("background")) {
          map.setPaintProperty("background", "background-color", SAHEL_COLORS.land);
        }
      } catch (e) { console.warn("[Sahel] reskin partial:", e); }

      // Charger sahel-admin1.geojson (32 regions)
      const res = await fetch(staticFile("_shared/geo-data/sahel/sahel-admin1.geojson"));
      const fc = await res.json();
      // Initialiser toutes les regions a ctrl=1 (etat)
      for (const f of fc.features) {
        f.properties.ctrl = 1;
        f.properties.front = 0;
      }
      // B2 : conserver une copie profonde des features admin-1 brutes pour la fusion.
      baseFeaturesRef.current = JSON.parse(JSON.stringify(fc.features));
      map.addSource("sahel", { type: "geojson", data: fc });

      // Remplissage data-driven : 0=jnim (rouge), 0.5=conteste (or), 1=etat (bleu)
      map.addLayer({
        id: "sahel-fill",
        type: "fill",
        source: "sahel",
        paint: {
          "fill-color": [
            "interpolate", ["linear"], ["get", "ctrl"],
            0,    SAHEL_COLORS.jnim,
            0.30, SAHEL_COLORS.jnim,
            0.5,  SAHEL_COLORS.contested,
            0.70, SAHEL_COLORS.etat,
            1,    SAHEL_COLORS.etat,
          ],
          "fill-color-transition": { duration: 400, delay: 0 },
          // Si allumage séquentiel, l'opacité vient de igniteOp (par pays), défaut 0.
          // Sinon 0.82 constant. coalesce → fallback si la prop est absente.
          "fill-opacity": effSeqIgnite
            ? (["coalesce", ["get", "igniteOp"], 0] as any)
            : 0.82,
        } as any,
      });

      // (Trame hachurée Mapbox retirée → remplacée par un GRAIN PAPIER plein écran
      //  en overlay SVG, plus homogène et plus premium. Voir bloc "GRAIN" en fin de rendu.)

      // Glow de front (zones contestees)
      map.addLayer({
        id: "sahel-front-glow",
        type: "line",
        source: "sahel",
        paint: {
          "line-color": SAHEL_COLORS.contested,
          "line-width": ["interpolate", ["linear"], ["get", "front"], 0, 0, 1, 5],
          "line-opacity": ["interpolate", ["linear"], ["get", "front"], 0, 0, 1, 0.9],
          "line-blur": 3,
        },
      });

      // Frontieres inter-regions (attenuees).
      // CORRECTION A (fusion) : si fusionRegions, on quasi-supprime ces lignes internes
      // → les régions de MÊME faction forment un aplat uni (effet "macro-zone" du Soudan).
      // Les vraies séparations restent lisibles par le changement de couleur de faction.
      map.addLayer({
        id: "sahel-line",
        type: "line",
        source: "sahel",
        // En mode fusion, la source ne contient QUE les masses dissoutes →
        // cette ligne trace les FRONTS entre factions (lisible, pas la mosaïque).
        // B3 frontDraw : le front beige est dessiné en SVG (draw-in dashoffset),
        // donc on éteint cette ligne Mapbox pour éviter le double tracé.
        paint: {
          "line-color": SAHEL_COLORS.outline,
          "line-width": fusionRegions ? 1.4 : 0.8,
          // acte1Final : régions internes plus discrètes → le contour national (3.4px)
          // domine = hiérarchie de lecture (compartimenter les 3 pays).
          "line-opacity": frontDraw ? 0 : isFinalLook ? 0.30 : fusionRegions ? 0.55 : 0.25,
        },
      });

      // Contour national epais
      map.addLayer({
        id: "sahel-outline",
        type: "line",
        source: "sahel",
        paint: { "line-color": SAHEL_COLORS.outline, "line-width": 2.6, "line-opacity": 0.9 },
      });

      // PULSE DE FRONTIÈRE NATIONALE (idée Aziz 2026-06-07) : surligne le pays cité
      // au mot exact, en doré, avec largeur/opacité animées par frame. Réutilisable.
      // Source = contours nationaux dissous (Mali/Burkina/Niger).
      try {
        const resC = await fetch(staticFile("_shared/geo-data/sahel/sahel-countries.geojson"));
        const fcC = await resC.json();
        for (const f of fcC.features) f.properties.pulse = 0; // 0 = invisible
        map.addSource("sahel-countries", { type: "geojson", data: fcC });
        // glow large (dessous)
        map.addLayer({
          id: "sahel-country-pulse-glow",
          type: "line",
          source: "sahel-countries",
          paint: {
            "line-color": "#E8B84B",
            "line-width": ["interpolate", ["linear"], ["get", "pulse"], 0, 0, 1, 16],
            "line-opacity": ["interpolate", ["linear"], ["get", "pulse"], 0, 0, 1, 0.35],
            "line-blur": 4,
          },
        });
        // HIÉRARCHIE FRONTIÈRES (DA-brief acte1Final) : contour NATIONAL permanent épais
        // (frontières des 3 pays AES nettes) — aide à compartimenter Mali/Burkina/Niger.
        // Posé SOUS le pulse doré. Les lignes régionales internes (sahel-line) restent fines.
        if (isFinalLook) {
          map.addLayer({
            id: "sahel-country-border",
            type: "line",
            source: "sahel-countries",
            paint: {
              "line-color": SAHEL_COLORS.outline,
              "line-width": 3.4,
              "line-opacity": 0.92,
            },
          }, "sahel-country-pulse-glow");
        }
        // trait net (dessus)
        map.addLayer({
          id: "sahel-country-pulse",
          type: "line",
          source: "sahel-countries",
          paint: {
            "line-color": "#E8B84B",
            "line-width": ["interpolate", ["linear"], ["get", "pulse"], 0, 0, 1, 5],
            "line-opacity": ["interpolate", ["linear"], ["get", "pulse"], 0, 0, 1, 1],
          },
        });
      } catch (e) { console.warn("[Sahel] country pulse layer skipped:", e); }

      setReady(true);
      map.once("idle", () => {
        if (safety) { clearTimeout(safety); safety = null; }
        continueRender(handle);
      });
    });

    return () => {
      if (safety) clearTimeout(safety);
      map.remove();
      mapRef.current = null;
    };
  }, [handle]);

  // ============================================================
  // UPDATE PAR FRAME
  // ============================================================
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;

    // TEST : controlFrameOverride fige l'état territorial sur une frame donnée
    // (pour le test 10s on isole l'effet des corrections sur le PIRE cas de mosaïque).
    const ctrlSpan = T_END - T_START;
    const ctrlLocal =
      controlFrameOverride != null
        ? Math.max(0, Math.min(ctrlSpan, controlFrameOverride - T_START))
        : local;
    const ctrlTGlobal = ctrlLocal / ctrlSpan;

    // Mettre a jour les couleurs de controle
    const src = map.getSource("sahel") as mapboxgl.GeoJSONSource | undefined;
    if (acte1CameraOnly) {
      // ÉTAPE 1 : carte NEUTRE (aucune donnée territoriale) — on valide le rythme caméra nu.
      if (src) src.setData({ type: "FeatureCollection", features: [] } as any);
    } else if (src) {
      if (effFusion && baseFeaturesRef.current) {
        // B2/B3 : fusion territoriale (union Turf, memoïsée). 3 masses (ou par pays si séquentiel).
        const ctrlByName: Record<string, number> = {};
        for (const name of SAHEL_STATES) ctrlByName[name] = sahelControlAt(name, ctrlTGlobal);
        const byCountry = !!effSeqIgnite;
        const fusedFC = buildFusedFC(baseFeaturesRef.current, ctrlByName, byCountry);
        // Allumage par pays : montée 0→0.82 en EASE (cubic-bezier doux, pas linéaire).
        // STAGGER : le fill monte d'abord, le front+ville suivent (gérés en SVG).
        if (effSeqIgnite) {
          // Nettoyage cognitif f726 : après le freeze, les couleurs politiques baissent
          // (0.82→~0.35) pour faire place à la couche tactique (groupes armés).
          let dim = isFinalLook
            ? interpolate(frame, [A1.DRIFT, A1.DRIFT + 40], [1, 0.42], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              })
            : 1;
          // B1 V2 BOARD CLEARING (R-V1) : en acte2, on pousse les aplats de contrôle
          // ENCORE plus bas (0.42 → 0.20) sur f2630→f2820 pour libérer le registre
          // enjeu-français. Le décor géopolitique reste lisible mais s'efface au profit
          // des sprites/veines/emprises. Multiplicatif sur le dim existant.
          if (acte2) {
            const b1 = interpolate(frame, [2630, 2700], [1, 0.48], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            dim = dim * b1; // 0.42 * 0.48 ≈ 0.20 — board clearing court (2s)
          }
          for (const f of (fusedFC as any).features) {
            const ign = effSeqIgnite[f.properties.country as string];
            const base =
              ign == null
                ? 0.82
                : interpolate(frame, [ign, ign + 26], [0, 0.82], {
                    extrapolateLeft: "clamp", extrapolateRight: "clamp",
                    easing: Easing.bezier(0.4, 0, 0.2, 1),
                  });
            f.properties.igniteOp = base * dim;
          }
        }
        src.setData(fusedFC as any);

        // B3 frontDraw : reprojeter les contours des masses en paths SVG (par pays)
        // pour le draw-in (stroke-dashoffset). Longueur estimée pour le dasharray.
        if (effFrontDraw) {
          const fps2: { country: string; d: string; len: number }[] = [];
          for (const feat of (fusedFC as any).features) {
            const ctry = (feat.properties.country as string) || "AES";
            const geom = feat.geometry;
            const polys = geom.type === "MultiPolygon" ? geom.coordinates : [geom.coordinates];
            for (const poly of polys) {
              for (const ring of poly) {
                let d = "";
                let len = 0;
                let prev: { x: number; y: number } | null = null;
                for (let i = 0; i < ring.length; i++) {
                  const p = map.project(ring[i] as [number, number]);
                  d += (i === 0 ? "M" : "L") + p.x.toFixed(1) + "," + p.y.toFixed(1);
                  if (prev) len += Math.hypot(p.x - prev.x, p.y - prev.y);
                  prev = p;
                }
                d += "Z";
                fps2.push({ country: ctry, d, len: Math.max(len, 1) });
              }
            }
          }
          setFrontPaths(fps2);
        }
      } else if ((src as any)._data) {
        const data = (src as any)._data;
        for (const f of data.features) {
          const name = f.properties.name as string;
          if (SAHEL_STATES.includes(name)) {
            const c = sahelControlAt(name, ctrlTGlobal);
            f.properties.ctrl = c;
            f.properties.front = 1 - 2 * Math.abs(c - 0.5);
          }
        }
        src.setData(data);
      }
    }

    // CARTE COLORÉE DÈS LE DÉPART (décision Aziz 2026-06-07, revenant sur "neutre") :
    // ce qui rendait le Soudan lisible = territoire coloré dès le jour 1, ressort sur
    // le parchemin. La carte neutre rendait le hook abstrait/illisible. On garde donc
    // fill-opacity 0.82 constant (défini dans le style de la couche).
    // (B1 V2 board clearing des aplats : géré via igniteOp ligne ~1047, multiplicatif,
    //  car fill-opacity utilise une expression coalesce qu'un setPaintProperty écraserait.)

    // PULSE DE FRONTIÈRE NATIONALE — surligne le pays cité au mot exact (hook).
    // Mali f151, Burkina f231, Niger f301. Pulse fort ~1.5s puis retombe.
    const srcC = map.getSource("sahel-countries") as mapboxgl.GeoJSONSource | undefined;
    if (srcC && (srcC as any)._data) {
      const dataC = (srcC as any)._data;
      const pulseFor = (start: number) => {
        // montée 12f → tient 30f → descente 30f (pulse net puis calme)
        const p = interpolate(frame, [start, start + 12, start + 42, start + 72], [0, 1, 1, 0.15], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        // léger battement pendant le maintien
        const beat = frame > start + 12 && frame < start + 42 ? 1 + 0.12 * Math.sin((frame - start) * 0.4) : 1;
        return frame < start ? 0 : p * beat;
      };
      let changed = false;
      for (const f of dataC.features) {
        const cc = f.properties.country;
        // ÉTAPE 1 : pulse national désactivé en track caméra seul (carte pure).
        const newPulse = acte1CameraOnly ? 0 :
          cc === "MLI" ? pulseFor(F_HOOK_MALI) :
          cc === "BFA" ? pulseFor(F_HOOK_BURKINA) :
          cc === "NER" ? pulseFor(F_HOOK_NIGER) : 0;
        if (f.properties.pulse !== newPulse) { f.properties.pulse = newPulse; changed = true; }
      }
      if (changed) srcC.setData(dataC);
    }

    // CAMÉRA NARRATIVE serrée (getSahelCam) — suit l'action acte par acte.
    // FIGÉE pendant "Comment est-ce possible?" (f572→f632 = 2s).
    const hookFreeze = frame >= F_HOOK_FREEZE && frame < F_HOOK_FREEZE + 60;
    let camLon: number, camLat: number, camZoom: number;
    if (useActe1Cam) {
      // Track caméra dédié Acte 1 (Étape 1 + version finale), FREEZE total f572-632.
      // En acte2 : getActe2Cam prolonge (avant f2299 = identique Acte 1, après = mouvements B1).
      const a1Freeze = frame >= A1.FREEZE && frame < A1.FREEZE_END;
      const camFn = partie2 ? getPartie2Cam : partie1 ? getPartie1Cam : acte2 ? getActe2Cam : getActe1Cam;
      const cam = a1Freeze ? camFn(A1.FREEZE) : camFn(frame);
      camLon = cam.lon; camLat = cam.lat; camZoom = cam.zoom;
    } else if (camStatic) {
      // CORRECTION C (test) : caméra qui GLISSE en continu — léger zoom-in + dérive
      // douce vers le centre sur ~10s (300 frames), easing ease-in-out.
      const e = interpolate(frame, [0, 300], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      });
      camLon = camStatic.lon;
      camLat = camStatic.lat + e * 0.25; // dérive douce vers le nord (Liptako)
      camZoom = camStatic.zoom + e * 0.55; // zoom-in continu
    } else {
      const cam = hookFreeze ? getSahelCam(F_HOOK_FREEZE) : getSahelCam(frame);
      camLon = cam.lon; camLat = cam.lat; camZoom = cam.zoom;
    }
    map.jumpTo({ center: [camLon, camLat], zoom: camZoom, pitch: 0, bearing: 0 });

    // PARTIE 1 (V5) — VIDE D'ÉTAT (beat 1.3) : au mot "absent" (f2743), l'opacité du
    // fill de contrôle CHUTE (l'État rural s'évapore). On multiplie l'expression
    // d'opacité existante par un facteur décroissant (garde la structure coalesce).
    if (partie1 && map.getLayer("sahel-fill")) {
      const F_ABSENT = 2743;
      const voidFactor = interpolate(frame, [F_ABSENT, F_ABSENT + 70], [1, 0.16], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
      });
      const baseOp: any = effSeqIgnite
        ? ["coalesce", ["get", "igniteOp"], 0]
        : 0.82;
      try {
        map.setPaintProperty("sahel-fill", "fill-opacity",
          (["*", baseOp, voidFactor] as any));
      } catch {}
    }

    // PARTIE 2 (V5) — CARTE CALME pour l'installation FR/ONU (DA : "sécurité apparente"
    // avant la tempête). Le fill de contrôle (rouge/orange Acte 1) baisse à ~0.42 au début
    // (board clearing f3050), pour que les bases FR + surfaces rouges DÉDIÉES P2 (couche
    // <Partie2Blocage>) se lisent clairement par-dessus. Reste calme tout P2.
    if (partie2 && map.getLayer("sahel-fill")) {
      const calmFactor = interpolate(frame, [3050, 3120], [1, 0.42], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
      });
      const baseOp: any = effSeqIgnite
        ? ["coalesce", ["get", "igniteOp"], 0]
        : 0.82;
      try {
        map.setPaintProperty("sahel-fill", "fill-opacity",
          (["*", baseOp, calmFactor] as any));
      } catch {}
    }

    // CORRECTION B (test) : reprojeter la silhouette AES (3 pays) en paths SVG pixels
    // pour le masque-trou de la vignette géographique.
    if (effVignette && srcC && (srcC as any)._data) {
      const fcC = (srcC as any)._data;
      const paths: string[] = [];
      for (const feat of fcC.features) {
        const geom = feat.geometry;
        const polys = geom.type === "MultiPolygon" ? geom.coordinates : [geom.coordinates];
        for (const poly of polys) {
          for (const ring of poly) {
            let d = "";
            for (let i = 0; i < ring.length; i++) {
              const p = map.project(ring[i] as [number, number]);
              d += (i === 0 ? "M" : "L") + p.x.toFixed(1) + "," + p.y.toFixed(1);
            }
            d += "Z";
            paths.push(d);
          }
        }
      }
      setAesPaths(paths);
    }

    // Projections pivots hook (capitales + Liptako-Gourma)
    const pBamako  = map.project(BAMAKO_COORD);
    const pOuaga   = map.project(OUAGA_COORD);
    const pNiamey  = map.project(NIAMEY_COORD);
    const pLiptako = map.project(LIPTAKO_CENTER);
    setHookPx({
      bamako:  { x: pBamako.x,  y: pBamako.y  },
      ouaga:   { x: pOuaga.x,   y: pOuaga.y   },
      niamey:  { x: pNiamey.x,  y: pNiamey.y  },
      liptako: { x: pLiptako.x, y: pLiptako.y },
    });

    // Projeter les villes
    const proj = SAHEL_CITIES.map((c) => {
      const p = map.project([c.lon, c.lat]);
      return { name: c.name, x: p.x, y: p.y };
    });
    setCityPx(proj);

    // Projeter les vehicules
    const dt = 0.012;
    const vproj = (SAHEL_VEHICLES as SchemaVehicle[]).map((v) => {
      const [lon, lat] = interpPath(v.path, tGlobal);
      const [lon2, lat2] = interpPath(v.path, Math.max(0, tGlobal - dt));
      const p = map.project([lon, lat]);
      const pPrev = map.project([lon2, lat2]);
      return { id: v.id, x: p.x, y: p.y, dx: p.x - pPrev.x, dy: p.y - pPrev.y };
    });
    setVehPx(vproj);

    // ACTE 1 FINAL : projeter les véhicules pilotés par FRAME absolue (mouvement réel).
    if (isFinalLook) {
      const a1proj = ACTE1_VEHICLES.map((v) => {
        const [lon, lat] = interpA1Vehicle(v.wp, frame);
        const [lon2, lat2] = interpA1Vehicle(v.wp, frame - 2);
        const p = map.project([lon, lat]);
        const pPrev = map.project([lon2, lat2]);
        // traînée : positions échantillonnées sur les ~50 dernières frames (review zone2).
        const trail: {x:number;y:number}[] = [];
        for (let dk = 6; dk <= 54; dk += 8) {
          const [tl, ta] = interpA1Vehicle(v.wp, frame - dk);
          const tp = map.project([tl, ta]);
          trail.push({ x: tp.x, y: tp.y });
        }
        return { id: v.id, x: p.x, y: p.y, dx: p.x - pPrev.x, dy: p.y - pPrev.y, trail };
      });
      setA1VehPx(a1proj);
      // Foyers des taches d'influence (review zone2) : projeter pour échelle px constante.
      const pJ = map.project([-1.4, 14.9] as [number, number]); // centre de l'arc JNIM (rural ouest)
      const pE = map.project([1.3, 15.0] as [number, number]);  // centre du triangle EIGS (est)
      setA1ZonePx({ jnim: { x: pJ.x, y: pJ.y }, eigs: { x: pE.x, y: pE.y } });
      // jetons-combattants (frame-driven, se déplacent avec intention)
      const fproj = FIGHTERS.map((ft) => {
        const [lon, lat] = interpFighter(ft.wp, frame);
        const [lon2, lat2] = interpFighter(ft.wp, frame - 3);
        const p = map.project([lon, lat]);
        const pPrev = map.project([lon2, lat2]);
        return { id: ft.id, x: p.x, y: p.y, dx: p.x - pPrev.x, dy: p.y - pPrev.y };
      });
      setFighterPx(fproj);
      // ACTE 2 : bases militaires reprojetées (sprites posés en lon/lat).
      if (acte2) {
        setActe2BasePx(ACTE2_BASES.map((b) => {
          const p = map.project([b.lon, b.lat] as [number, number]);
          return { id: b.id, x: p.x, y: p.y };
        }));

        // --- B1 V3 : JETON SOLDATS FR mobile (acteur qui arrive de l'ouest → Gao) ---
        {
          const P = B1_FR_TOKEN;
          if (frame >= P.fStart - 4) {
            const tRaw = (frame - P.fStart) / (P.fEnd - P.fStart);
            const t = Math.max(0, Math.min(1, tRaw));
            const te = 1 - Math.pow(1 - t, 3); // ease-out (arrive vite, se pose en douceur)
            const lon = P.start[0] + (P.end[0] - P.start[0]) * te;
            const lat = P.start[1] + (P.end[1] - P.start[1]) * te;
            const cur = map.project([lon, lat] as [number, number]);
            // queue cinétique : positions récentes (sillage) — uniquement en mouvement
            const trail: { x: number; y: number }[] = [];
            if (t < 1) {
              const N = 8;
              for (let i = 0; i <= N; i++) {
                const tt = Math.max(0, te - (i / N) * 0.18);
                const pl = map.project([P.start[0] + (P.end[0] - P.start[0]) * tt,
                                         P.start[1] + (P.end[1] - P.start[1]) * tt] as [number, number]);
                trail.push({ x: pl.x, y: pl.y });
              }
            }
            setB1PlanePx({ x: cur.x, y: cur.y, deg: 0, trail });
          } else {
            setB1PlanePx(null);
          }
        }

        // --- B1 V2 : CONVOI mobile (trace une veine ocre permanente) ---
        {
          const C = B1_CONVOY;
          if (frame >= C.fStart - 4 && frame <= C.fEnd + 200) {
            const tRaw = (frame - C.fStart) / (C.fEnd - C.fStart);
            const t = Math.max(0, Math.min(1, tRaw));
            const te = t * t * (3 - 2 * t); // smoothstep (lent, régulier)
            const lon = C.start[0] + (C.end[0] - C.start[0]) * te;
            const lat = C.start[1] + (C.end[1] - C.start[1]) * te;
            const cur = map.project([lon, lat] as [number, number]);
            const s = map.project(C.start), e = map.project(C.end);
            const deg = (Math.atan2(e.y - s.y, e.x - s.x) * 180) / Math.PI; // sprite nez GAUCHE → +0 offset (corrigé au rendu)
            const trail: { x: number; y: number }[] = [];
            const N = 12;
            for (let i = 0; i <= N; i++) {
              const tt = (i / N) * te;
              const pl = map.project([C.start[0] + (C.end[0] - C.start[0]) * tt,
                                       C.start[1] + (C.end[1] - C.start[1]) * tt] as [number, number]);
              trail.push({ x: pl.x, y: pl.y });
            }
            setB1ConvoyPx({ x: cur.x, y: cur.y, deg, trail });
          } else {
            setB1ConvoyPx(null);
          }
          const al = map.project(B1_MINE_ARLIT);
          setB1ArlitPx({ x: al.x, y: al.y });
        }

        // --- B1 V3 : RELAY bases (3 villes, reprojetées pour relay-line + emprise englobante) ---
        setB1BasePx(B1_BASES_RELAY.map((b) => {
          const c = map.project([b.lon, b.lat] as [number, number]);
          const edge = map.project([b.lon + 0.45, b.lat] as [number, number]);
          const rx = Math.abs(edge.x - c.x);
          return { id: b.name, cx: c.x, cy: c.y, rx, appear: b.appear };
        }));
      }
      // graines : projetées aux positions de DÉPART des jetons (où ils vont éclore).
      const sproj = FIGHTERS.map((ft) => {
        const p = map.project([ft.wp[0].lon, ft.wp[0].lat]);
        return { id: ft.id, faction: ft.faction, x: p.x, y: p.y };
      });
      setSeedPx(sproj);

      // PULSE RÉGION-PRÉCISE : reprojeter les silhouettes admin-1 des pulses ACTIFS.
      // (fenêtre : trigger-10 → trigger+dur+30 pour le fade-out)
      if (baseFeaturesRef.current) {
        const activePulses: { key: string; faction: string; trigger: number; d: string }[] = [];
        // B1 V3 (D-7) : en acte2 on ajoute les pulses de toponymes Acte 2 (Mali/Niger redessinés).
        const pulseList = acte2 ? [...A1_REGION_PULSES, ...ACTE2_REGION_PULSES] : A1_REGION_PULSES;
        for (const pulse of pulseList) {
          if (frame < pulse.trigger - 10 || frame > pulse.trigger + pulse.dur + 30) continue;
          for (const feat of baseFeaturesRef.current) {
            const nm = (feat.properties.name || feat.properties.NAME_1 || feat.properties.shapeName) as string;
            if (!pulse.regions.includes(nm)) continue;
            const geom = feat.geometry;
            const polys = geom.type === "MultiPolygon" ? geom.coordinates : [geom.coordinates];
            for (const poly of polys) {
              for (const ring of poly) {
                let d = "";
                for (let i = 0; i < ring.length; i++) {
                  const p = map.project(ring[i] as [number, number]);
                  d += (i === 0 ? "M" : "L") + p.x.toFixed(1) + "," + p.y.toFixed(1);
                }
                d += "Z";
                activePulses.push({ key: pulse.key + "-" + nm, faction: pulse.faction, trigger: pulse.trigger, d });
              }
            }
          }
        }
        setPulsePx(activePulses);
      }
    }

    // Projeter les refugies
    const rproj = (SAHEL_REFUGEES as SchemaRefugee[]).map((r) => {
      const [lon, lat] = interpPath(r.path, tGlobal);
      const [lon2, lat2] = interpPath(r.path, Math.max(0, tGlobal - dt));
      const p = map.project([lon, lat]);
      const pPrev = map.project([lon2, lat2]);
      return { id: r.id, x: p.x, y: p.y, dx: p.x - pPrev.x, dy: p.y - pPrev.y };
    });
    setRefPx(rproj);

    // Projeter les icones ressources
    const iproj = RESOURCE_ICONS.map((icon) => {
      const p = map.project([icon.lon, icon.lat]);
      return { id: icon.id, x: p.x, y: p.y };
    });
    setIconPx(iproj);

    // REFACTOR V5 : construire le contexte passe aux <PartieX>. La closure
    // project() capture la `map` courante (deja positionnee par jumpTo ci-dessus).
    // breathe = battement lent partage (color-pacing). controlAt = tGlobal pour l'instant.
    const breathe = 0.5 + 0.5 * Math.sin(frame * 0.05);
    setSahelCtx({
      frame,
      width,
      height,
      project: (lon: number, lat: number) => {
        const p = map.project([lon, lat] as [number, number]);
        return { x: p.x, y: p.y };
      },
      controlAt: tGlobal,
      breathe,
    });

    const h = delayRender(`sahel-frame-${frame}`, { timeoutInMilliseconds: 40000 });
    let done = false;
    const finish = () => { if (!done) { done = true; continueRender(h); } };
    map.once("idle", finish);
    setTimeout(finish, map.areTilesLoaded() ? 300 : 1200);
  }, [frame, ready, tGlobal]);

  // ============================================================
  // LOGIQUE HOOK — ACTE 1 (script-first, tracé phrase par phrase)
  // ============================================================

  // ============================================================
  // ALLUMAGE PREMIUM "trace → infuse" (DA-BRIEF-GATE Acte 1, consensus Gemini+Kimi)
  // Au lieu d'un flash blanc plat : le halo coloré (couleur faction, PAS blanc)
  // infuse depuis la capitale, monte net, puis se MAINTIENT (les 3 pays restent
  // allumés jusqu'au freeze — ils forment le triangle qui se fige).
  // ============================================================
  // Phase "infuse" : montée 0→1 sur 14 frames, puis maintien (pas de fade-out :
  // le pays reste allumé jusqu'au freeze, signature du hook).
  const ignite = (start: number) =>
    interpolate(frame, [start, start + 14], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
  // SCRIPT: "Ils ont expulsé" → Mali infuse (f150)
  const hookMaliOp = ignite(F_HOOK_MALI);
  // SCRIPT: "Rompu leurs alliances" → Burkina infuse (f231)
  const hookBurkinaOp = ignite(F_HOOK_BURKINA);
  // SCRIPT: "Quitté la principale organisation" → Niger infuse (f301)
  const hookNigerOp = ignite(F_HOOK_NIGER);
  // "trace" : le contour se dessine vite (0→1 sur 10 frames) juste avant l'infuse
  const trace = (start: number) =>
    interpolate(frame, [start, start + 10], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
  const hookMaliTrace = trace(F_HOOK_MALI);
  const hookBurkinaTrace = trace(F_HOOK_BURKINA);
  const hookNigerTrace = trace(F_HOOK_NIGER);
  // Heartbeat : une fois allumés, les pays "respirent" légèrement (opacité oscille).
  // Démarre après le 3e allumage, subtil (amplitude 0.08), continue dans le freeze.
  const hookHeartbeat = frame > F_HOOK_NIGER + 14
    ? 0.92 + 0.08 * Math.sin((frame - F_HOOK_NIGER) * 0.10)
    : 1;

  // SCRIPT: "continent." → anneau CEDEAO "néon qui grille" (f382)
  // 3 pulses francs (scale + opacité) → SNAP → gris cendre mort.
  // (choix Aziz 2026-06-07 : néon qui grille, pas fissure ni fondu doux)
  const CEDEAO_PULSES_END = F_HOOK_CEDEAO + 60; // 3 pulses sur 60 frames (2s)
  const CEDEAO_DEAD = CEDEAO_PULSES_END + 12;   // snap puis gris cendre
  const cedeaoOp = (() => {
    if (frame < F_HOOK_CEDEAO) return 0;
    if (frame > CEDEAO_DEAD + 30) return 0; // disparait apres le freeze
    return 1; // toujours visible une fois apparu (la COULEUR change, pas l'opacité)
  })();
  // Intensité orange du pulse (0 = éteint, 1 = plein orange). 3 cycles sur 60f.
  const cedeaoPulse = (() => {
    if (frame < F_HOOK_CEDEAO || frame > CEDEAO_PULSES_END) return 0;
    const local = frame - F_HOOK_CEDEAO;
    return Math.max(0, Math.sin(local * Math.PI * 3 / 60)) * 0.9;
  })();
  // Scale du pulse (1.0 → 1.06 au pic de chaque cycle)
  const cedeaoScale = 1 + cedeaoPulse * 0.06;
  // Transition vers gris cendre après le snap (0 = orange vivant, 1 = cendre mort)
  const cedeaoDeath = interpolate(frame, [CEDEAO_PULSES_END, CEDEAO_DEAD], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // SCRIPT: "quelque chose de nouveau." → vecteurs capitales convergent + Liptako pulse or (f502)
  const liptakoProgress = interpolate(frame, [F_HOOK_LIPTAKO, F_HOOK_LIPTAKO + 45], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const liptakoPulse = (() => {
    if (frame < F_HOOK_LIPTAKO) return 0;
    if (frame > F_HOOK_FREEZE + 120) return 0;
    const localF = frame - F_HOOK_LIPTAKO;
    // pulse régulier tant que la carte est figée, puis disparaît
    const pulse = 0.65 + 0.35 * Math.sin(localF * 0.18);
    if (frame > F_HOOK_FREEZE + 60) {
      return pulse * interpolate(frame, [F_HOOK_FREEZE + 60, F_HOOK_FREEZE + 120], [1, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
    }
    return pulse;
  })();

  // SCRIPT: "Comment est-ce possible ?" → FIGÉE 2s (f572 = 19.08s)
  const hookFreezeActive = frame >= F_HOOK_FREEZE && frame < F_HOOK_FREEZE + 60;

  // ============================================================
  // MAP ANIMATION — FLÈCHES TACTIQUES (Act 2 + Act 3 + hook upgrade)
  // ============================================================

  // SCRIPT: Act 2 — onde armes Libye → nord Mali (f2630 "s'embrase")
  // Flèche unique Libye→Kidal, se dessine en 60 frames
  const libArrowProgress = interpolate(
    frame,
    [F_LIBYE_ARMES, F_LIBYE_ARMES + 60],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // Disparaît après 5s (150 frames) pour ne pas polluer l'écran
  const libArrowOp = interpolate(
    frame,
    [F_LIBYE_ARMES + 120, F_LIBYE_ARMES + 180],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // SCRIPT: Act 3 — FAMa depuis Gao → Kidal (f8218, 45 frames)
  const famaArrowProgress = interpolate(
    frame,
    [F_KIDAL_OFFENSIVE, F_KIDAL_OFFENSIVE + 45],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // Gao part 30 frames avant Ménaka (doctrine : délai entre les deux branches de la tenaille)
  const africaCorpsProgress = interpolate(
    frame,
    [F_KIDAL_OFFENSIVE + 30, F_KIDAL_OFFENSIVE + 75],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // Les deux flèches s'effacent après que le drapeau malien flotte (f8683 + 60)
  const kidalArrowOp = interpolate(
    frame,
    [F_KIDAL_FLAG_VISIBLE + 30, F_KIDAL_FLAG_VISIBLE + 90],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // SCRIPT: Act 3 — contre-offensive JNIM+CSP → Kidal (f9477)
  // Direction inverse : Kidal → est (contre-attaque)
  const counterProgress = interpolate(
    frame,
    [F_KIDAL_COUNTER, F_KIDAL_COUNTER + 45],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const counterOp = interpolate(
    frame,
    [F_KIDAL_COUNTER + 90, F_KIDAL_COUNTER + 150],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ============================================================
  // OPACITES HUD
  // ============================================================
  const hudOp = interpolate(frame, [T_START - 2, T_START + 12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // Overlay GeoConvergence f3300→f3550 : masquer le HUD (légende + timeline) pour éviter
  // l'incohérence "timeline 2017 sous un overlay 2013" (DA 2026-06-10) + désencombrer.
  const overlayHudFade = acte2
    ? interpolate(frame, [3290, 3315, 3540, 3565], [1, 0, 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  const hudOpEff = hudOp * overlayHudFade;
  const introOp = interpolate(frame, [0, 8, T_START - 8, T_START + 4], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const outroOp = interpolate(frame, [SAHEL_DURATION - 24, SAHEL_DURATION], [0, 0.5], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // CTA final
  const CTA_START = 13200;
  const CTA_HOLD = 180;

  // Plaque parchemin reutilisable
  const plaque: React.CSSProperties = {
    background: SAHEL_COLORS.cream,
    border: `2px solid ${SAHEL_COLORS.ink}`,
    borderRadius: 6,
    color: SAHEL_COLORS.ink,
    boxShadow: "0 4px 18px rgba(0,0,0,0.28)",
  };

  // ============================================================
  // TAMPONS ACRONYMES ACTE 1 — cartouches CENTRE semi-transparents
  // (apparaît au mot exact, tient ~4s, disparaît). BEAT 3 JNIM / BEAT 4 EIGS.
  // ============================================================
  const stampOp = (start: number) =>
    interpolate(frame, [start, start + 12, start + 110, start + 140], [0, 1, 1, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
  // acte1Final : décalage +25f (le tampon apparaît au mot "Al-Qaïda"/"Daesh",
  // pas en même temps que la zone — anti-redondance avec la voix, plan upstream).
  const stampDelay = isFinalLook ? 25 : 0;
  const jnimStampOp = stampOp(F_JNIM_ZONE + stampDelay);   // f1198 (+25) "JNIM."
  const eigsStampOp = stampOp(1749 + stampDelay);          // f1749 (+25) "l'EIGS."

  // ============================================================
  // LOGIQUE KIDAL (s'allume en or a F_KIDAL_ALONE, reste bleu a F_KIDAL_FLAG)
  // Cela se fait via le controle territorial (deja dans le JSON),
  // mais on peut aussi ajouter un highlight visuel supplementaire
  // ============================================================
  const kidalHighlightOp = (() => {
    if (frame < F_KIDAL_ALONE) return 0;
    if (frame < F_KIDAL_FLAG) {
      // pulse or sur Kidal
      return interpolate(frame, [F_KIDAL_ALONE, F_KIDAL_ALONE + 20], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
    }
    // apres flag malien, le pulse s'eteint (la couleur carte prend le relais)
    return interpolate(frame, [F_KIDAL_FLAG, F_KIDAL_FLAG + 30], [1, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
  })();

  // ============================================================
  // OVERLAY AES NEE (frame ~7014)
  // ============================================================
  const aesOverlayOp = (() => {
    if (frame < F_AES_NEE) return 0;
    const fadeIn = interpolate(frame, [F_AES_NEE, F_AES_NEE + 18], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    const fadeOut = interpolate(frame, [F_AES_NEE + 240, F_AES_NEE + 300], [1, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    return Math.min(fadeIn, fadeOut);
  })();

  // ÉTAPE 1 : en mode track caméra seul, on masque TOUTE la couche narrative
  // (hook, flèches, véhicules, villes, HUD) pour valider le rythme caméra nu.
  const showChrome = ready && !acte1CameraOnly;

  // ============================================================
  // ACTE 1 FINAL — artefacts narratifs (plan validé upstream)
  // ============================================================
  // CEDEAO (f382) : anneau beige qui SE ROMPT (stroke-dasharray dont les espaces
  // s'allongent = le lien se dissout). Apparaît, tient, puis fissure. (choix Aziz : fissure)
  const cedeaoAppear = interpolate(frame, [A1.CEDEAO, A1.CEDEAO + 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const cedeaoBreak = interpolate(frame, [A1.CEDEAO + 45, A1.CEDEAO + 95], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic),
  });
  const cedeaoFade = interpolate(frame, [A1.CEDEAO + 95, A1.CEDEAO + 120], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const cedeaoOpA1 = cedeaoAppear * cedeaoFade;

  // Flèches Liptako (f502) : 3 traits beige continus capitales→centre qui se DESSINENT
  // (stroke-dashoffset), puis pulse or UNIQUE à l'arrivée ("soudure" de l'alliance).
  const arrowDraw = interpolate(frame, [A1.LIPTAKO, A1.LIPTAKO + 50], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const arrowFade = interpolate(frame, [A1.FREEZE + 40, A1.FREEZE + 80], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const weldPulse = interpolate(frame, [A1.LIPTAKO + 48, A1.LIPTAKO + 62, A1.LIPTAKO + 90],
    [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Nettoyage cognitif (f726) : les couleurs politiques baissent (0.82→0.3) pour faire
  // place à la couche tactique. "éteindre la géopolitique pour allumer la tactique".
  const politicalDim = interpolate(frame, [A1.DRIFT, A1.DRIFT + 40], [1, 0.42], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // TACHES D'INFLUENCE : grandissent AVEC l'arrivée des jetons (le territoire se prend
  // au fur et à mesure que les combattants se déploient), se touchent à f2167 puis se
  // REPOUSSENT. JNIM dès f1000 (arrivée jetons), EIGS dès f1560.
  const jnimZoneGrow = interpolate(frame,
    [1000, 1000 + 320, A1.FRICTION, A1.FRICTION + 40],
    [0, 1, 1, 0.85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const eigsZoneGrow = interpolate(frame,
    [1560, 1560 + 280, A1.FRICTION, A1.FRICTION + 40],
    [0, 1, 1, 0.85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // ============================================================
  // ACTE 2 / B1 — BOARD CLEARING (R-V1, WARMAP-VIVANTE-GRAMMAIRE).
  // Condition n°1 : au début de B1, "faire le deuil de l'Acte 1" — estomper la couche
  // tactique (jetons-combattants) pour libérer le plateau au registre géopolitique.
  // JAMAIS 0 (la trace reste fantôme). Jetons → 0.18 ; taches → 0.55 (décor permanent).
  // Geste "gel/pierre" (vibrance Aziz) : désaturation rapide perçue via la chute d'opacité.
  // f2630 (début Acte 2) → f2780 (~5s).
  // B1 V3 : board clearing COURT (2s, f2630→f2690) — transition rapide, PAS 19s de vide (critique Aziz #2).
  // PARTIE 1 (V5) : board clearing recalé sur "bascule" (f2102, alignment V5).
  // Décision Aziz : table rase quasi-totale (jetons → 0.05, on revient à 2012).
  // Fondu f2055→f2115 (~2s). Taches d'influence → 0.05 idem.
  const P1_CLEAR_A = 2055;
  const P1_CLEAR_B = 2115;
  // PARTIE 2 (V5) : board clearing LÉGER avant Serval (f3196). Jetons Acte1 → 0.15
  // (fantômes) pour installer les bases FR sur une carte lisible. Le rouge (jihadisme)
  // REVIENT en surfaces dédiées P2 au beat 2.4. Fondu f3050→f3120 (~2.3s).
  const P2_CLEAR_A = 3050;
  const P2_CLEAR_B = 3120;
  const b1FighterClear = acte2
    ? interpolate(frame, [2630, 2690], [1, 0.18],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) })
    : partie1
    ? interpolate(frame, [P1_CLEAR_A, P1_CLEAR_B], [1, 0.05],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) })
    : partie2
    ? interpolate(frame, [P2_CLEAR_A, P2_CLEAR_B], [1, 0.15],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) })
    : 1;
  const b1ZoneClear = acte2
    ? interpolate(frame, [2630, 2690], [1, 0.12],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) })
    : partie1
    ? interpolate(frame, [P1_CLEAR_A, P1_CLEAR_B], [1, 0.05],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) })
    : partie2
    ? interpolate(frame, [P2_CLEAR_A, P2_CLEAR_B], [1, 0.12],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) })
    : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: SAHEL_COLORS.ocean, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <MapboxBrandingHide />

      {/* Narration principale — audio V5 (narration-v2.mp3 supprimé au ménage 2026-06-10).
          NB : l'Acte 1 est encore calé sur les triggers V1/V2 ; la SYNCHRO V5 sera recalée en Task 8.
          Pour le baseline non-régression on render --muted (audio sans effet sur les pixels). */}
      <Audio src={staticFile("_shared/audio/sahel-warmap/narration-v5-expressive.mp3")} />

      {/* Musique de fond (score Soudan reutilise, 60s -> loop sur 439s).
          Volume bas pour laisser respirer voix + SFX. */}
      <Loop durationInFrames={60 * SAHEL_FPS}>
        <Audio src={staticFile("_shared/audio/sudan-warmap/score-epic.mp3")} volume={0.10} />
      </Loop>

      {/* ======================================================
          SFX HOOK — 3 signature uniquement (anti-surcharge mix).
          Sequence (jamais frame===X — regle projet). Volumes calibres
          pour ne pas concurrencer la voix + musique.
          ====================================================== */}
      {/* SFX gated : masqués en mode track caméra seul (on valide le rythme nu). */}
      {!acte1CameraOnly && (
        <>
          {/* boom sourd x3 — allumage des 3 pays */}
          <Sequence from={F_HOOK_MALI} durationInFrames={Math.ceil(1.2 * SAHEL_FPS)}>
            <Audio src={staticFile("_shared/sfx/warmap/boom-coup.mp3")} volume={0.55} />
          </Sequence>
          <Sequence from={F_HOOK_BURKINA} durationInFrames={Math.ceil(1.2 * SAHEL_FPS)}>
            <Audio src={staticFile("_shared/sfx/warmap/boom-coup.mp3")} volume={0.55} />
          </Sequence>
          <Sequence from={F_HOOK_NIGER} durationInFrames={Math.ceil(1.2 * SAHEL_FPS)}>
            <Audio src={staticFile("_shared/sfx/warmap/boom-coup.mp3")} volume={0.55} />
          </Sequence>
          {/* snap electrique — mort de l'anneau CEDEAO (au moment du pic du 3e pulse) */}
          <Sequence from={F_HOOK_CEDEAO + 60} durationInFrames={Math.ceil(1.0 * SAHEL_FPS)}>
            <Audio src={staticFile("_shared/sfx/warmap/cedeao-snap.mp3")} volume={0.50} />
          </Sequence>
          {/* gong grave — impact convergence Liptako (au freeze) */}
          <Sequence from={F_HOOK_FREEZE} durationInFrames={Math.ceil(2.5 * SAHEL_FPS)}>
            <Audio src={staticFile("_shared/sfx/warmap/liptako-gong.mp3")} volume={0.58} />
          </Sequence>
        </>
      )}

      {/* ======================================================
          SFX B1 V2 (acte2) — sobres, plancher 0.50, dans <Sequence> (jamais frame===X).
          Board clearing (gong rappel "fin de chapitre") · avion (whoosh whip) ·
          convoi (grondement bas) · emprises bases (ink-spread cascade ×3).
          ====================================================== */}
      {acte2 && !acte1CameraOnly && (
        <>
          {/* board clearing : gong discret = "on tourne la page de l'Acte 1" [recalé v2 -27f] */}
          <Sequence from={2613} durationInFrames={Math.ceil(2.5 * SAHEL_FPS)}>
            <Audio src={staticFile("_shared/sfx/warmap/liptako-gong.mp3")} volume={0.42} />
          </Sequence>
          {/* jeton soldats FR arrive — whoosh discret à l'entrée (B1_FR_TOKEN.fStart 2687) [recalé v2 -23f] */}
          <Sequence from={2685} durationInFrames={Math.ceil(1.0 * SAHEL_FPS)}>
            <Audio src={staticFile("_shared/sfx/warmap/arrow-whoosh.mp3")} volume={0.5} />
          </Sequence>
          {/* pose du jeton sur Gao — ink-spread léger [recalé v2 -23f] */}
          <Sequence from={2762} durationInFrames={Math.ceil(1.2 * SAHEL_FPS)}>
            <Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} volume={0.45} />
          </Sequence>
          {/* convoi — grondement bas continu (tension-drone) pendant la montée (B1_CONVOY 3729-3851) [recalé v2 -71f] */}
          <Sequence from={3719} durationInFrames={Math.ceil(5.0 * SAHEL_FPS)}>
            <Audio src={staticFile("_shared/sfx/warmap/tension-drone.mp3")} volume={0.32} />
          </Sequence>
          {/* emprises bases — ink-spread en cascade (Gao/Ménaka/Niamey) */}
          <Sequence from={B1A.GAO} durationInFrames={Math.ceil(1.5 * SAHEL_FPS)}>
            <Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} volume={0.52} />
          </Sequence>
          <Sequence from={B1A.MENAKA + 8} durationInFrames={Math.ceil(1.5 * SAHEL_FPS)}>
            <Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} volume={0.5} />
          </Sequence>
          <Sequence from={B1A.NIAMEY + 16} durationInFrames={Math.ceil(1.5 * SAHEL_FPS)}>
            <Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} volume={0.5} />
          </Sequence>
        </>
      )}

      {/* Filtre papier sepia */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="paperSahel">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.95  0 0 0 0 0.9  0 0 0 0 0.78  0 0 0 0.04 0" />
        </filter>
      </svg>

      <div ref={containerRef} style={{ width, height, position: "absolute" }} />

      {/* ======================================================
          CORRECTION B (test) — VIGNETTAGE GÉOGRAPHIQUE
          Sépia sombre sur tout ce qui n'est PAS l'AES (3 pays). Fait "popper"
          le Sahel = contraste par le calme. Masque-trou = silhouette AES reprojetée.
          Placé SOUS la couche narrative → véhicules/labels restent nets sur l'AES.
          ====================================================== */}
      {effVignette && aesPaths.length > 0 && (
        <svg width={width} height={height}
          style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
          <defs>
            <mask id="aesHole">
              <rect x="0" y="0" width={width} height={height} fill="white" />
              {aesPaths.map((d, i) => (
                <path key={i} d={d} fill="black" />
              ))}
            </mask>
          </defs>
          {/* couche sépia sombre, trouée sur l'AES */}
          <rect x="0" y="0" width={width} height={height}
            fill="#241809"
            fillOpacity={effVignetteOp}
            mask="url(#aesHole)" />
        </svg>
      )}

      {/* ======================================================
          B3 — FRONTS QUI SE DESSINENT (draw-in stroke-dashoffset)
          Le contour de chaque masse se trace en beige quand son pays s'allume.
          Mouvement continu + sens (la ligne de contrôle s'établit). Réf FiberOpticBorderDraw.
          ====================================================== */}
      {effFrontDraw && frontPaths.length > 0 && (
        <svg width={width} height={height}
          style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
          {frontPaths.map((fp, i) => {
            const ignF = effSeqIgnite?.[fp.country] ?? 0;
            // draw-in sur 40 frames depuis l'allumage du pays
            const draw = interpolate(frame, [ignF, ignF + 40], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
              easing: Easing.inOut(Easing.cubic),
            });
            if (draw <= 0) return null;
            const offset = fp.len * (1 - draw);
            return (
              <path key={i} d={fp.d} fill="none" stroke="#F3E9C8" strokeWidth={2.2}
                strokeLinejoin="round" strokeLinecap="round"
                strokeDasharray={fp.len} strokeDashoffset={offset}
                style={{ filter: "drop-shadow(0 0 3px rgba(243,233,200,0.5))" }} />
            );
          })}
        </svg>
      )}

      {/* ======================================================
          ACTE 1 FINAL — CEDEAO (f382) : anneau beige qui SE ROMPT
          stroke-dasharray dont les espaces s'allongent = le lien se dissout.
          (choix Aziz : fissure, pas onde radar — ajustable au render)
          ====================================================== */}
      {isFinalLook && showChrome && cedeaoOpA1 > 0 && hookPx.liptako && (() => {
        const cx = hookPx.liptako.x, cy = hookPx.liptako.y - 20;
        const R = 230; // englobe les 3 pays autour du Liptako
        // dash : au repos trait quasi-plein (dash 40, gap 6) → en rupture les gaps
        // grandissent (gap 6→60) = la frontière se fissure et lâche.
        const gap = 6 + cedeaoBreak * 70;
        const dash = 40 - cedeaoBreak * 18;
        return (
          <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
            <circle cx={cx} cy={cy} r={R} fill="none" stroke="#F3E9C8"
              strokeWidth={2.5} strokeLinecap="round"
              strokeDasharray={`${dash} ${gap}`}
              opacity={cedeaoOpA1 * (0.72 - cedeaoBreak * 0.3)} />
            {/* label CEDEAO discret en haut de l'anneau, s'efface à la rupture */}
            <text x={cx} y={cy - R - 10} textAnchor="middle"
              fontFamily="'Roboto Condensed', sans-serif" fontSize={20} fontWeight={700}
              letterSpacing={4} fill="#F3E9C8" opacity={cedeaoOpA1 * (1 - cedeaoBreak)}>
              CEDEAO
            </text>
          </svg>
        );
      })()}

      {/* ======================================================
          ACTE 1 FINAL — FLÈCHES LIPTAKO (f502) : 3 traits beige continus
          capitales→centre qui se dessinent (dashoffset) + pulse or unique "soudure".
          ====================================================== */}
      {isFinalLook && showChrome && arrowDraw > 0 && hookPx.liptako &&
        hookPx.bamako && hookPx.ouaga && hookPx.niamey && (() => {
        const L = hookPx.liptako;
        const caps = [hookPx.bamako, hookPx.ouaga, hookPx.niamey];
        return (
          <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
            {caps.map((cap, i) => {
              if (!cap) return null;
              const len = Math.hypot(L.x - cap.x, L.y - cap.y);
              const off = len * (1 - arrowDraw);
              return (
                <line key={i} x1={cap.x} y1={cap.y} x2={L.x} y2={L.y}
                  stroke="#F3E9C8" strokeWidth={3.5 * arrowDraw + 0.5} strokeLinecap="round"
                  strokeDasharray={len} strokeDashoffset={off}
                  opacity={0.85 * arrowFade}
                  style={{ filter: "drop-shadow(0 0 2px rgba(243,233,200,0.4))" }} />
              );
            })}
            {/* pulse or UNIQUE "soudure" au centre à l'arrivée */}
            {weldPulse > 0 && (
              <circle cx={L.x} cy={L.y} r={18 + weldPulse * 34} fill="none"
                stroke={SAHEL_COLORS.contested} strokeWidth={4}
                opacity={weldPulse * 0.9} />
            )}
          </svg>
        );
      })()}

      {/* Grain papier */}
      <AbsoluteFill style={{ filter: "url(#paperSahel)", opacity: 0.25, pointerEvents: "none", mixBlendMode: "multiply" }} />

      {/* Vignette parchemin */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 62%, rgba(40,28,16,0.22) 100%)",
        }}
      />

      {/* ======================================================
          HOOK ACTE 1 — Pays qui s'allument + Liptako pulse
          Chaque événement tracé depuis le script V4 phrase par phrase
          ====================================================== */}

      {/* SCRIPT: allumage "trace → infuse" des 3 pays (couleur faction, PAS blanc).
          Halo bleu état qui infuse depuis la capitale + glow par double-cercle
          (stroke épais opacité basse, JAMAIS filter:blur). Heartbeat une fois allumé.
          Les 3 restent allumés jusqu'au freeze (forment le triangle qui se fige). */}
      {!acte1CameraOnly && !isFinalLook && [
        { op: hookMaliOp, tr: hookMaliTrace, px: hookPx.bamako, r: 150, fallback: { left: "20%", top: "55%" } },
        { op: hookBurkinaOp, tr: hookBurkinaTrace, px: hookPx.ouaga, r: 120, fallback: { left: "47%", top: "58%" } },
        { op: hookNigerOp, tr: hookNigerTrace, px: hookPx.niamey, r: 130, fallback: { left: "60%", top: "52%" } },
      ].map((c, i) => c.op > 0 && (
        <AbsoluteFill key={`ignite-${i}`} style={{ pointerEvents: "none" }}>
          {/* INFUSE : halo bleu état qui monte depuis la capitale */}
          <div style={{
            position: "absolute",
            left: c.px ? c.px.x - c.r : c.fallback.left,
            top: c.px ? c.px.y - c.r : c.fallback.top,
            width: c.r * 2, height: c.r * 2,
            background: `radial-gradient(circle, rgba(62,110,158,${c.op * 0.55 * hookHeartbeat}) 0%, rgba(62,110,158,${c.op * 0.18}) 45%, rgba(62,110,158,0) 72%)`,
            borderRadius: "50%",
          }} />
          {/* GLOW : anneau stroke épais opacité basse (pas de blur CSS) */}
          {c.px && (
            <div style={{
              position: "absolute",
              left: c.px.x - c.r * 0.7, top: c.px.y - c.r * 0.7,
              width: c.r * 1.4, height: c.r * 1.4,
              border: `${6 * c.tr}px solid rgba(62,110,158,${c.op * 0.22})`,
              borderRadius: "50%",
            }} />
          )}
        </AbsoluteFill>
      ))}

      {/* SCRIPT: "continent." → anneau CEDEAO "néon qui grille" (f382)
          3 pulses orange francs (scale + glow) → SNAP → gris cendre mort.
          Couleur interpolée orange vivant → cendre via cedeaoDeath. */}
      {cedeaoOp > 0 && showChrome && !isFinalLook && hookPx.liptako && (() => {
        // orange vivant (255,140,0) → gris cendre (139,115,85)
        const r = Math.round(255 + (139 - 255) * cedeaoDeath);
        const g = Math.round(140 + (115 - 140) * cedeaoDeath);
        const b = Math.round(0 + (85 - 0) * cedeaoDeath);
        const ringColor = `rgb(${r},${g},${b})`;
        const baseAlpha = 0.35 + cedeaoPulse; // pulse fait briller le trait
        const deadAlpha = 0.5 * (1 - cedeaoDeath) + 0.28 * cedeaoDeath;
        const alpha = Math.min(1, Math.max(deadAlpha, baseAlpha));
        return (
          <AbsoluteFill style={{ pointerEvents: "none" }}>
            <div style={{
              position: "absolute",
              left: hookPx.liptako.x - 330, top: hookPx.liptako.y - 235,
              width: 660, height: 470,
              border: `${3 + cedeaoPulse * 2}px solid ${ringColor}`,
              opacity: alpha,
              borderRadius: "50%",
              transform: `scale(${cedeaoScale})`,
              // glow par stroke épais derrière (PAS filter:blur) : box-shadow inset/outset léger
              boxShadow: `0 0 ${cedeaoPulse * 22}px ${cedeaoPulse * 5}px rgba(255,140,0,${cedeaoPulse * 0.4})`,
            }} />
            <div style={{
              position: "absolute",
              left: hookPx.liptako.x - 36, top: hookPx.liptako.y - 290,
              fontSize: 15, fontWeight: 700, letterSpacing: 3,
              color: ringColor, opacity: alpha,
              textTransform: "uppercase" as const,
            }}>CEDEAO</div>
          </AbsoluteFill>
        );
      })()}

      {/* SCRIPT: "quelque chose de nouveau." → 3 flèches capitales → Liptako + pulse or (f502)
          Upgrade : SahelAttackArrow (flèches qui POUSSENT) au lieu de <line> statiques */}
      {liptakoProgress > 0 && showChrome && !isFinalLook && (
        <>
          {/* Flèche Bamako → Liptako (or profond + épaisse pour contraste sur parchemin) */}
          <SahelAttackArrow
            map={mapRef.current}
            waypoints={[BAMAKO_COORD, LIPTAKO_CENTER]}
            progress={liptakoProgress}
            color="#A8791E"
            strokeWidth={5}
            headType="arrow"
            marchingFrame={frame}
            opacity={0.95}
            width={width}
            height={height}
          />
          {/* Flèche Ouagadougou → Liptako (légère décalée) */}
          <SahelAttackArrow
            map={mapRef.current}
            waypoints={[OUAGA_COORD, LIPTAKO_CENTER]}
            progress={Math.max(0, liptakoProgress - 0.15)}
            color="#A8791E"
            strokeWidth={5}
            headType="arrow"
            marchingFrame={frame}
            opacity={0.92}
            width={width}
            height={height}
          />
          {/* Flèche Niamey → Liptako (décalée davantage) */}
          <SahelAttackArrow
            map={mapRef.current}
            waypoints={[NIAMEY_COORD, LIPTAKO_CENTER]}
            progress={Math.max(0, liptakoProgress - 0.30)}
            color="#A8791E"
            strokeWidth={5}
            headType="arrow"
            marchingFrame={frame}
            opacity={0.90}
            width={width}
            height={height}
          />
          {/* Pulse or Liptako-Gourma (climax) — halo + onde de choc à l'impact */}
          {liptakoPulse > 0 && hookPx.liptako && (
            <>
              {/* Halo doré pulsant */}
              <div style={{
                position: "absolute",
                left: hookPx.liptako.x - 90,
                top: hookPx.liptako.y - 90,
                width: 180, height: 180,
                background: `radial-gradient(circle, rgba(168,121,30,${liptakoPulse * 0.85}) 0%, rgba(201,154,58,${liptakoPulse * 0.35}) 40%, rgba(201,154,58,0) 72%)`,
                borderRadius: "50%",
                pointerEvents: "none",
              }} />
              {/* Onde de choc dorée à l'impact (f572 = arrivée des flèches) : cercle qui s'étend */}
              {(() => {
                const shock = interpolate(frame, [F_HOOK_FREEZE, F_HOOK_FREEZE + 30], [0, 1], {
                  extrapolateLeft: "clamp", extrapolateRight: "clamp",
                });
                if (shock <= 0 || shock >= 1) return null;
                const sz = 80 + shock * 260;
                return (
                  <div style={{
                    position: "absolute",
                    left: hookPx.liptako.x - sz / 2,
                    top: hookPx.liptako.y - sz / 2,
                    width: sz, height: sz,
                    border: `${4 * (1 - shock)}px solid rgba(168,121,30,${(1 - shock) * 0.9})`,
                    borderRadius: "50%",
                    pointerEvents: "none",
                  }} />
                );
              })()}
            </>
          )}
        </>
      )}

      {/* SCRIPT: "Comment est-ce possible ?" → carton figé sur la carte (f572, 2s).
          ACTE 1 FINAL : retiré (la voix pose déjà la question — doubler en texte = redondant). */}
      {hookFreezeActive && !isFinalLook && (
        <div style={{
          position: "absolute", bottom: 140, left: 0, right: 0,
          textAlign: "center", pointerEvents: "none",
          opacity: interpolate(frame, [F_HOOK_FREEZE, F_HOOK_FREEZE + 8, F_HOOK_FREEZE + 52, F_HOOK_FREEZE + 60], [0, 1, 1, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }),
        }}>
          <div style={{
            display: "inline-block",
            background: `rgba(245,239,214,0.92)`,
            border: `2px solid ${SAHEL_COLORS.ink}`,
            borderRadius: 6, padding: "14px 32px",
            color: SAHEL_COLORS.ink,
            fontSize: 32, fontWeight: 700,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            letterSpacing: 0.5,
            boxShadow: "0 4px 18px rgba(0,0,0,0.28)",
          }}>
            Comment est-ce possible ?
          </div>
        </div>
      )}

      {/* ======================================================
          MAP ANIMATION — ACT 2 : EXPANSION TERRITORIALE JNIM
          SCRIPT: "s'embrase" f2630 → expansion rouge 2012→2022
          ====================================================== */}
      {showChrome && !acte2 && frame >= F_EXPANSION_START && frame < F_EXPANSION_END + 100 && (
        <TerritorialExpansion
          map={mapRef.current}
          regions={EXPANSION_REGIONS_ACT2}
          startFrame={F_EXPANSION_START}
          endFrame={F_EXPANSION_END}
          frame={frame}
          color={SAHEL_COLORS.jnim}
          maxOpacity={0.42}
          fadeOutFrames={90}
          width={width}
          height={height}
        />
      )}

      {/* ======================================================
          MAP ANIMATION — ACT 2 : ONDE ARMES LIBYE → NORD MALI
          SCRIPT: "s'embrase" f2630 — flux armements depuis Libye
          ====================================================== */}
      {showChrome && !acte2 && libArrowProgress > 0 && (
        <SahelAttackArrow
          map={mapRef.current}
          waypoints={[LIBYE_COORD, NORD_MALI_COORD]}
          progress={libArrowProgress}
          color="#6B3A2A"
          strokeWidth={3}
          headType="arrow"
          marchingFrame={frame}
          opacity={Math.min(libArrowProgress, libArrowOp)}
          width={width}
          height={height}
        />
      )}

      {/* ======================================================
          MAP ANIMATION — ACT 3 : TENAILLE KIDAL (FAMa + Africa Corps)
          SCRIPT: f8218 → offensive depuis Gao + Ménaka → Kidal
          ====================================================== */}
      {showChrome && !acte2 && famaArrowProgress > 0 && (
        <SahelAttackArrow
          map={mapRef.current}
          waypoints={[GAO_COORD, KIDAL_COORD]}
          progress={famaArrowProgress}
          color={SAHEL_COLORS.etat}
          strokeWidth={5}
          headType="arrow"
          marchingFrame={frame}
          opacity={kidalArrowOp}
          width={width}
          height={height}
        />
      )}
      {showChrome && !acte2 && africaCorpsProgress > 0 && (
        <SahelAttackArrow
          map={mapRef.current}
          waypoints={[MENAKA_COORD, KIDAL_COORD]}
          progress={africaCorpsProgress}
          color={SAHEL_COLORS.etat}
          strokeWidth={4}
          headType="arrow"
          marchingFrame={frame}
          opacity={kidalArrowOp}
          width={width}
          height={height}
        />
      )}

      {/* ======================================================
          MAP ANIMATION — ACT 3 : CONTRE-OFFENSIVE JNIM+CSP
          SCRIPT: f9477 — contre-offensive depuis l'est
          ====================================================== */}
      {showChrome && !acte2 && counterProgress > 0 && (
        <SahelAttackArrow
          map={mapRef.current}
          waypoints={[MENAKA_COORD, KIDAL_COORD]}
          progress={counterProgress}
          color={SAHEL_COLORS.jnim}
          strokeWidth={4}
          headType="arrow"
          marchingFrame={frame}
          opacity={counterOp}
          width={width}
          height={height}
        />
      )}

      {/* ======================================================
          MAP ANIMATION — ACT 4 : FLUX RÉFUGIÉS
          SCRIPT: f10294 "Djibo" / f10349 "Ménaka" / f10783 "réel."
          ====================================================== */}
      {showChrome && frame >= F_REF_DJIBO && (
        <RefugeeFlow
          map={mapRef.current}
          flows={REFUGEE_FLOWS_ACT4}
          frame={frame}
          color="#3A2A18"
          baseWidth={5}
          width={width}
          height={height}
        />
      )}

      {/* ======================================================
          ACTE 1 FINAL — PULSE RÉGION-PRÉCISE AU NOMMAGE
          La voix nomme un territoire → sa silhouette admin-1 s'embrase
          (fill faction + contour + halo) ~2-3s puis s'apaise. Grammaire
          cohérente avec l'allumage initial des 3 pays.
          ====================================================== */}
      {isFinalLook && showChrome && pulsePx.length > 0 && (
        <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
          <defs>
            <filter id="pulseGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {pulsePx.map((pz) => {
            const col = pz.faction === "jnim" ? "#C25A45" : "#7A4A38"; // jnim clair / eigs sombre
            // enveloppe : rise (trigger..+18) → hold → fall (+dur..+dur+30)
            const rise = interpolate(frame, [pz.trigger, pz.trigger + 18], [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const fall = interpolate(frame, [pz.trigger + 60, pz.trigger + 90], [1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const env = Math.min(rise, fall);
            if (env <= 0.001) return null;
            // respiration sin pendant le hold
            const breathe = 0.85 + 0.15 * Math.sin((frame - pz.trigger) * 0.22);
            const op = env * breathe;
            return (
              <g key={pz.key}>
                <path d={pz.d} fill={col} opacity={op * 0.34} />
                <path d={pz.d} fill="none" stroke={col} strokeWidth={2.6}
                  opacity={op * 0.9} filter="url(#pulseGlow)" />
              </g>
            );
          })}
        </svg>
      )}

      {/* ======================================================
          ACTE 1 FINAL — GRAINES (comblent le trou 25-40s, review jetons)
          Avant l'éclosion des jetons : petits points pulsants aux futures positions
          (= "deux groupes se sont développés au fil des années"). Apparaissent f750,
          pulsent, puis s'éteignent quand leur jeton éclot. Suivent la voix.
          ====================================================== */}
      {isFinalLook && showChrome && frame >= 750 && (
        <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
          {seedPx.map((s) => {
            const ft = FIGHTERS.find((f) => f.id === s.id);
            if (!ft) return null;
            // graine visible de f750 jusqu'à l'éclosion du jeton (ft.appear + 6)
            const seedStart = ft.faction === "jnim" ? 760 : 1360; // JNIM dès 25s, EIGS plus tard
            if (frame < seedStart || frame > ft.appear + 6) return null;
            const sIn = interpolate(frame, [seedStart, seedStart + 20], [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const sOut = interpolate(frame, [ft.appear - 10, ft.appear + 6], [1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const op = sIn * sOut;
            const seed = s.id.charCodeAt(1) * 11;
            const pulse = 0.6 + 0.4 * Math.sin((frame + seed) * 0.12);
            const col = s.faction === "jnim" ? SAHEL_COLORS.jnim : "#2E2A1E";
            return (
              <g key={s.id} opacity={op}>
                {/* anneau pulsant */}
                <circle cx={s.x} cy={s.y} r={6 + pulse * 7} fill="none"
                  stroke={col} strokeWidth={1.5} opacity={0.5 * (1 - pulse * 0.5)} />
                {/* point central */}
                <circle cx={s.x} cy={s.y} r={4} fill={col} opacity={0.85} />
              </g>
            );
          })}
        </svg>
      )}

      {/* ======================================================
          ACTE 1 FINAL — TACHES D'INFLUENCE (review zone2)
          Zones de contrôle qui GRANDISSENT depuis le foyer (JNIM rouge organique
          centre Mali / EIGS sombre géométrique est). Donnent du sens au mouvement
          des véhicules + comblent le vide. Sous les véhicules (qui roulent dessus).
          ====================================================== */}
      {isFinalLook && showChrome && (jnimZoneGrow > 0 || eigsZoneGrow > 0) && a1ZonePx.jnim && a1ZonePx.eigs && (() => {
        // FRONT = milieu entre les 2 foyers. Les taches S'ARRÊTENT au front (clipPath)
        // → plus de "muddy overlap" brun trouble au centre (décision Aziz). Ligne beige nette.
        const frontX = (a1ZonePx.jnim.x + a1ZonePx.eigs.x) / 2;
        return (
        <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
          <defs>
            <clipPath id="clipJnim"><rect x={0} y={0} width={frontX} height={height} /></clipPath>
            <clipPath id="clipEigs"><rect x={frontX} y={0} width={width - frontX} height={height} /></clipPath>
          </defs>
          {/* JNIM : tache rouge organique, clippée à GAUCHE du front */}
          {jnimZoneGrow > 0 && (
            <path d={blobPath(a1ZonePx.jnim.x, a1ZonePx.jnim.y, 200 * jnimZoneGrow, "organic")}
              clipPath="url(#clipJnim)"
              fill={SAHEL_COLORS.jnim} fillOpacity={0.32 * Math.min(1, jnimZoneGrow * 2) * b1ZoneClear}
              stroke={SAHEL_COLORS.jnim} strokeOpacity={0.45 * Math.min(1, jnimZoneGrow * 2) * b1ZoneClear}
              strokeWidth={1.5} />
          )}
          {/* EIGS : tache sombre anguleuse, clippée à DROITE du front */}
          {eigsZoneGrow > 0 && (
            <path d={blobPath(a1ZonePx.eigs.x, a1ZonePx.eigs.y, 165 * eigsZoneGrow, "angular")}
              clipPath="url(#clipEigs)"
              fill="#3E2A18" fillOpacity={0.32 * Math.min(1, eigsZoneGrow * 2) * b1ZoneClear}
              stroke="#3E2A18" strokeOpacity={0.5 * Math.min(1, eigsZoneGrow * 2) * b1ZoneClear}
              strokeWidth={1.5} />
          )}
          {/* Ligne de front beige nette là où elles se touchent (visible quand les 2 grandes) */}
          {jnimZoneGrow > 0.3 && eigsZoneGrow > 0.3 && (
            <line x1={frontX} y1={a1ZonePx.jnim.y - 130} x2={frontX} y2={a1ZonePx.jnim.y + 130}
              stroke="#F3E9C8" strokeWidth={2.5} strokeDasharray="8 5"
              opacity={0.55 * Math.min(1, eigsZoneGrow * 2)} />
          )}
        </svg>
        );
      })()}

      {/* ======================================================
          VEHICULES (JNIM/EIGS rouge, FAMa bleu, CSP or) — legacy Actes 2-5.
          En acte1Final, on utilise ACTE1_VEHICLES (frame-driven) à la place.
          ====================================================== */}
      {showChrome && !isFinalLook &&
        (SAHEL_VEHICLES as SchemaVehicle[]).map((v) => {
          const pos = vehPx.find((p) => p.id === v.id);
          if (!pos) return null;
          // SÉQUENTIEL STRICT (fix Aziz 2026-06-07) : chaque véhicule a une FENÊTRE
          // DE VIE [appear, disappear] puis s'estompe. Plus de véhicules qui traînent
          // tout le long. Les JNIM/EIGS de l'Acte 1 vivent pendant leur séquence
          // (zone armée → confrontation f2167 → s'estompent f2299).
          const fId = v.faction as string;
          const isEigs = v.id === "eigs-1";
          let appear: number, disappear: number;
          if (fId === "jnim") {
            // JNIM : apparaît avec sa zone (BEAT 3 f1396 "centre Mali"), part fin confrontation
            appear = 1396; disappear = 2299;
          } else if (isEigs) {
            // EIGS : apparaît BEAT 4 (f1815 "l'est"), part fin confrontation
            appear = 1815; disappear = 2299;
          } else if (fId === "etat") {
            // FAMa : Acte 3 Kidal (tenaille), part après le drapeau
            appear = F_KIDAL_OFFENSIVE; disappear = F_KIDAL_FLAG_VISIBLE + 120;
          } else {
            // CSP / conteste : Acte 3 contre-offensive
            appear = F_KIDAL_COUNTER; disappear = F_KIDAL_COUNTER + 240;
          }
          appear += (v.delay ?? 0);
          // fenêtre de vie : pop-in 20f → maintien → fade-out 30f à disappear
          const pop = interpolate(
            frame,
            [appear, appear + 20, disappear, disappear + 30],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp",
              easing: Easing.bezier(0.2, 0.9, 0.3, 1) }
          );
          if (pop <= 0) return null;
          const mag = Math.hypot(pos.dx, pos.dy);
          const moving = mag > 0.1;
          const ang = Math.atan2(pos.dy, pos.dx);
          // Offset d'orientation du sprite : les technical-* Sahel pointent vers la
          // DROITE (offset 0) ; les sprites Soudan (tank-td-*, tech-td-*) pointent
          // vers le HAUT (offset +90). On adapte selon le sprite.
          const spritePointsUp = v.sprite.startsWith("tank-td") || v.sprite.startsWith("tech-td");
          const headingDeg = moving ? (ang * 180) / Math.PI + (spritePointsUp ? 90 : 0) : 0;
          const trailLen = Math.min(38, mag * 6 + 8);
          // couleur de la trainee selon faction
          const factionId = v.faction as string;
          const col =
            factionId === "jnim" ? SAHEL_COLORS.jnim :
            factionId === "etat" ? SAHEL_COLORS.etat :
            SAHEL_COLORS.contested;
          // 16:9 = carte plus grande a l'ecran -> sprites x2.5 vs Sudan vertical
          const vSize = v.size * 2.5;
          return (
            <div key={v.id} style={{ position: "absolute", left: pos.x, top: pos.y,
                transform: `translate(-50%, -50%) scale(${pop})`, opacity: pop, pointerEvents: "none" }}>
              {moving && (
                <div style={{ position: "absolute", left: 0, top: 0, width: trailLen, height: 6,
                  transform: `translate(-100%, -50%) rotate(${(ang * 180) / Math.PI}deg)`,
                  transformOrigin: "100% 50%",
                  background: `linear-gradient(90deg, rgba(0,0,0,0), ${col})`,
                  borderRadius: 4, opacity: 0.45 }} />
              )}
              {/* ombre portee */}
              <div style={{ position: "absolute", left: "50%", top: "54%", width: vSize * 0.7, height: vSize * 0.28,
                transform: "translate(-50%,-50%)", background: "rgba(26,18,9,0.22)", borderRadius: "50%", filter: "blur(3px)" }} />
              <img
                src={staticFile(`_shared/sprites/warmap/${v.sprite}.png`)}
                style={{ width: vSize, height: vSize, objectFit: "contain", display: "block",
                  transform: `rotate(${headingDeg}deg)`,
                  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }}
              />
            </div>
          );
        })}

      {/* ======================================================
          ACTE 1 FINAL — JETONS-COMBATTANTS (remplacent les véhicules).
          Cercle parchemin + bordure faction + silhouette hachurée. Apparition
          spring + onde de choc. Se DÉPLACENT avec intention (déploiement/front/recul).
          Respiration organique (scale sin, phase par jeton). Pas de glissement sans but.
          ====================================================== */}
      {isFinalLook && showChrome &&
        FIGHTERS.map((ft) => {
          const pos = fighterPx.find((p) => p.id === ft.id);
          if (!pos || frame < ft.appear) return null;
          // apparition : spring-like (scale 0 -> overshoot -> 1) sur 22 frames
          const ap = interpolate(frame, [ft.appear, ft.appear + 12, ft.appear + 22],
            [0, 1.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic) });
          const fadeIn = interpolate(frame, [ft.appear, ft.appear + 10], [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          // respiration (phase décalée par id pour éviter le sync robotique)
          const seed = ft.id.charCodeAt(1) * 7;
          const breathe = 1 + 0.05 * Math.sin((frame + seed) * 0.08);
          const D = 58; // diamètre écran-constant (lisible toute échelle)
          const border = ft.faction === "jnim" ? SAHEL_COLORS.jnim : "#2E2A1E";
          const sprite = ft.faction === "jnim" ? "fighter-jnim" : "fighter-eigs";
          // onde de choc au spawn (cercle qui part du jeton, 15f)
          const ripple = interpolate(frame, [ft.appear, ft.appear + 15], [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <React.Fragment key={ft.id}>
              {ripple > 0 && ripple < 1 && (
                <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
                  <circle cx={pos.x} cy={pos.y} r={D * 0.5 + ripple * D * 0.9}
                    fill="none" stroke={border} strokeWidth={2.5} opacity={(1 - ripple) * 0.7} />
                </svg>
              )}
              <div style={{ position: "absolute", left: pos.x, top: pos.y,
                  transform: `translate(-50%, -50%) scale(${ap * breathe})`,
                  opacity: fadeIn * b1FighterClear, pointerEvents: "none" }}>
                {/* ombre portée renforcée (le jeton FLOTTE au-dessus du parchemin =
                    hiérarchie visuelle : acteurs > décor) */}
                <div style={{ position: "absolute", left: "50%", top: "70%", width: D * 0.82, height: D * 0.26,
                  transform: "translate(-50%,-50%)", background: "rgba(40,27,8,0.42)",
                  borderRadius: "50%", filter: "blur(6px)" }} />
                {/* jeton circulaire : fond parchemin + silhouette clippée + bordure faction */}
                <div style={{ width: D, height: D, borderRadius: "50%", overflow: "hidden",
                  background: SAHEL_COLORS.cream, border: `3.5px solid ${border}`,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.3)" }}>
                  <img src={staticFile(`_shared/sprites/warmap/${sprite}.png`)}
                    style={{ width: "118%", height: "118%", objectFit: "cover", objectPosition: "top center",
                      transform: "translate(-8%, 2%)", display: "block" }} />
                </div>
              </div>
            </React.Fragment>
          );
        })}

      {/* ======================================================
          ACTE 1 FINAL — ONDES DE FRICTION (f2167 "combattent")
          Entre la zone JNIM et la zone EIGS : ondes de choc SVG concentriques
          qui pulsent au point de contact (PAS d'explosion — "répulsion").
          ====================================================== */}
      {isFinalLook && showChrome && frame >= A1.FRICTION && frame < A1.END + 20 && (() => {
        // point de friction = entre le jeton JNIM le plus à l'est (j2) et EIGS le plus à l'ouest (e1).
        const jnim = fighterPx.find((p) => p.id === "j2");
        const eigs = fighterPx.find((p) => p.id === "e1");
        if (!jnim || !eigs) return null;
        const fx = (jnim.x + eigs.x) / 2, fy = (jnim.y + eigs.y) / 2;
        // 3 ondes décalées, period 30f
        return (
          <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
            {[0, 1, 2].map((k) => {
              const local = (frame - A1.FRICTION - k * 10) % 36;
              if (local < 0) return null;
              const t = local / 36;
              return (
                <circle key={k} cx={fx} cy={fy} r={8 + t * 40} fill="none"
                  stroke="#F3E9C8" strokeWidth={2.4} opacity={(1 - t) * 0.65} />
              );
            })}
            {/* flash bref au centre toutes les ~36f */}
            <circle cx={fx} cy={fy} r={6} fill="#F3E9C8"
              opacity={0.5 * (1 - ((frame - A1.FRICTION) % 36) / 36)} />
          </svg>
        );
      })()}

      {/* ======================================================
          REFUGIES — jetons-visage geo-ancres (Djibo/Menaka/Tillaberi)
          Chaque jeton a son propre trigger frame audio
          ====================================================== */}
      {showChrome && !isFinalLook &&
        (SAHEL_REFUGEES as SchemaRefugee[]).map((r) => {
          const pos = refPx.find((p) => p.id === r.id);
          if (!pos) return null;
          // trigger frame specifique selon le jeton
          const triggerFrame =
            r.id === "ref-djibo"    ? F_REF_DJIBO :
            r.id === "ref-menaka"   ? F_REF_MENAKA :
            F_REF_TILLABERI;
          if (frame < triggerFrame) return null;
          const pop = interpolate(frame, [triggerFrame, triggerFrame + 18], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          if (pop <= 0) return null;
          const mag = Math.hypot(pos.dx, pos.dy);
          const ang = Math.atan2(pos.dy, pos.dx);
          const d = r.size;
          return (
            <div key={r.id} style={{ position: "absolute", left: pos.x, top: pos.y,
                transform: `translate(-50%, -50%) scale(${pop})`, opacity: pop, pointerEvents: "none" }}>
              {/* trainee de deplacement */}
              {mag > 0.1 && (
                <div style={{ position: "absolute", left: 0, top: 0, width: Math.min(30, mag * 6 + 6), height: 5,
                  transform: `translate(-100%, -50%) rotate(${(ang * 180) / Math.PI}deg)`, transformOrigin: "100% 50%",
                  background: `linear-gradient(90deg, rgba(0,0,0,0), ${SAHEL_COLORS.ink})`,
                  borderRadius: 4, opacity: 0.28 }} />
              )}
              {/* jeton-visage */}
              <div style={{ width: d, height: d, borderRadius: "50%", background: SAHEL_COLORS.cream,
                border: `3px solid ${SAHEL_COLORS.ink}`,
                boxShadow: `0 2px 7px rgba(0,0,0,0.38), 0 0 0 2px ${SAHEL_COLORS.cream}`,
                overflow: "hidden", position: "relative" }}>
                <img
                  src={staticFile("_shared/sprites/warmap/portrait-civil.png")}
                  style={{ width: "122%", height: "122%", objectFit: "cover",
                    objectPosition: "50% 14%", position: "absolute", left: "-11%", top: "-6%" }}
                />
              </div>
            </div>
          );
        })}

      {/* ======================================================
          ICONES RESSOURCES geo-ancrees
          ====================================================== */}
      {showChrome &&
        RESOURCE_ICONS.map((icon) => {
          if (frame < icon.appearFrame) return null;
          const pos = iconPx.find((p) => p.id === icon.id);
          if (!pos) return null;
          const pop = interpolate(frame, [icon.appearFrame, icon.appearFrame + 20], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 0.9, 0.3, 1),
          });
          return (
            <div key={icon.id} style={{ position: "absolute", left: pos.x, top: pos.y,
                transform: `translate(-50%, -50%) scale(${pop})`, opacity: pop, pointerEvents: "none" }}>
              {/* ombre */}
              <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)",
                width: 36, height: 8, background: "rgba(26,18,9,0.2)", borderRadius: "50%", filter: "blur(3px)" }} />
              {/* icone */}
              <div style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.35))" }}>
                <ResourceSVG kind={icon.kind} size={44} />
              </div>
              {/* label */}
              <div style={{ ...plaque, marginTop: 4, padding: "2px 8px", fontSize: 13, fontWeight: 700,
                textAlign: "center", letterSpacing: 0.8, whiteSpace: "nowrap", borderWidth: 1 }}>
                {icon.label}
              </div>
            </div>
          );
        })}

      {/* ======================================================
          B3 — POINTS-VILLES PULSANTS liés à l'allumage de l'état.
          Quand un état s'allume, sa ville-clé apparaît : point beige plein +
          anneau qui pulse (scale+opacity). Cause→effet lisible sans la voix.
          ====================================================== */}
      {showChrome && effCityPulse && effSeqIgnite &&
        Object.entries(effSeqIgnite).map(([country, ignF]) => {
          const cityName = COUNTRY_KEY_CITY[country];
          if (!cityName) return null;
          const cityPos = cityPx.find((c) => c.name === cityName);
          // STAGGER : la ville apparaît 10f APRÈS le fill du pays (fond→contour→ville).
          const cityStart = ignF + 10;
          if (!cityPos || frame < cityStart) return null;
          const appearOp = interpolate(frame, [cityStart, cityStart + 16], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          // HIÉRARCHIE PULSE (plan upstream) : 3 ondes à l'apparition PUIS calme.
          // Évite le "sapin de Noël" (anneaux qui pulsent en boucle tout l'acte).
          const sinceCity = frame - cityStart;
          const PULSE_PERIOD = 42;
          const PULSE_COUNT = 3;
          const inPulsePhase = sinceCity < PULSE_PERIOD * PULSE_COUNT;
          const t = (sinceCity % PULSE_PERIOD) / PULSE_PERIOD;
          const ringScale = 1 + t * 1.4;
          // l'onde s'éteint progressivement sur les 3 pulses puis disparaît
          const pulseFade = inPulsePhase
            ? 1 - sinceCity / (PULSE_PERIOD * PULSE_COUNT)
            : 0;
          const ringOp = (1 - t) * 0.7 * appearOp * pulseFade;
          const BEIGE = "#F3E9C8"; // beige clair lumineux (demande Aziz)
          return (
            <div key={`pulse-${country}`} style={{ position: "absolute", left: cityPos.x, top: cityPos.y,
                transform: "translate(-50%, -50%)", opacity: appearOp, pointerEvents: "none" }}>
              {/* anneau pulsant */}
              <div style={{ position: "absolute", left: "50%", top: "50%",
                width: 22, height: 22, marginLeft: -11, marginTop: -11, borderRadius: "50%",
                border: `2.5px solid ${BEIGE}`,
                transform: `scale(${ringScale})`, opacity: ringOp }} />
              {/* point plein beige + halo doux */}
              <div style={{ position: "absolute", left: "50%", top: "50%",
                width: 12, height: 12, marginLeft: -6, marginTop: -6, borderRadius: "50%",
                background: BEIGE, border: "2px solid rgba(46,31,10,0.55)",
                boxShadow: `0 0 8px ${BEIGE}` }} />
              {/* label ville — ENCRE sur halo réserve parchemin (anti-slop, DA downstream :
                  plus de cartouche blanc qui "flotte" sur le parchemin). */}
              <div style={{ position: "absolute", left: "50%", top: 14,
                transform: "translateX(-50%)", marginTop: 6, fontSize: 16,
                fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase", whiteSpace: "nowrap",
                color: SAHEL_COLORS.ink,
                WebkitTextStroke: `3px ${SAHEL_COLORS.land}`,
                paintOrder: "stroke fill",
                textShadow: `0 1px 2px ${SAHEL_COLORS.land}` }}>
                {cityName}
              </div>
            </div>
          );
        })}

      {/* ======================================================
          VILLES — apparition progressive liee a l'audio
          Chaque ville pop exactement quand la narration la cite.
          ====================================================== */}
      {showChrome && !effCityPulse &&
        CITY_SCHEDULE.map(({ name, appearFrame, hold }) => {
          const cityPos = cityPx.find((c) => c.name === name);
          if (!cityPos) return null;
          if (frame < appearFrame || frame > hold + 30) return null;
          // fenêtre de vie : fade-in 18f → maintien → fade-out 30f à hold (séquentiel)
          const cityOp = interpolate(
            frame,
            [appearFrame, appearFrame + 18, hold, hold + 30],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          ) * hudOp;
          if (cityOp <= 0) return null;
          return (
            <div key={name} style={{ position: "absolute", left: cityPos.x, top: cityPos.y,
                transform: `translate(-50%, -50%) rotate(${paperWobble(frame, name.length * 7)}deg)`,
                opacity: cityOp, pointerEvents: "none" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: SAHEL_COLORS.ink,
                margin: "0 auto", border: `2px solid ${SAHEL_COLORS.cream}` }} />
              <div style={{ ...plaque, marginTop: 4, padding: "3px 10px", fontSize: 16, fontWeight: 700,
                letterSpacing: 1.1, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                {name}
              </div>
            </div>
          );
        })}

      {/* ======================================================
          HUD PRINCIPAL — legende + date + evenement (masqué en track caméra seul)
          ====================================================== */}
      {!acte1CameraOnly && <>
      {/* Legende factions — haut gauche */}
      <div style={{ position: "absolute", top: 40, left: 44, opacity: hudOpEff,
          transform: `rotate(${paperWobble(frame, 3)}deg)` }}>
        <div style={{ ...plaque, padding: "12px 20px" }}>
          <div style={{ fontSize: 13, letterSpacing: 3, opacity: 0.65, fontWeight: 700,
            textTransform: "uppercase", marginBottom: 10 }}>Contrôle territorial</div>
          <FactionLegend color={SAHEL_COLORS.etat}      label="Forces gouvernementales" />
          <FactionLegend color={SAHEL_COLORS.contested}  label="Contesté / CSP" />
          <FactionLegend color={SAHEL_COLORS.jnim}      label="JNIM / EIGS" />
        </div>
      </div>

      {/* Date + jalon — haut droite (compteur précis qui SAUTE).
          ACTE 1 FINAL : remplacé par la TIMELINE GRADUÉE bas-écran (curseur qui glisse
          en continu) — la date précise créait de la confusion (saut sans lien à l'écran).
          Décision Aziz 2026-06-08, brief Gemini+Kimi convergent. */}
      {!isFinalLook && (
        <div style={{ position: "absolute", top: 40, right: 46, opacity: hudOp,
            transform: `rotate(${paperWobble(frame, 11)}deg)` }}>
          <div style={{ ...plaque, padding: "12px 22px", textAlign: "right" }}>
            <div style={{ fontSize: 42, fontWeight: 800, fontVariantNumeric: "tabular-nums",
              letterSpacing: 1, fontFamily: "Georgia, serif" }}>
              {jalon.date.replace(/\./g, "·")}
            </div>
          </div>
        </div>
      )}

      {/* Evenement bas — VIRÉ en acte1Final (décision Aziz : confusant + raconte les
          coups d'État, autre histoire que la voix Acte 1. On garde juste légende + date). */}
      {!isFinalLook && (
        <div style={{ position: "absolute", bottom: 50, left: 0, right: 0, textAlign: "center",
            opacity: hudOp, padding: "0 80px" }}>
          <div style={{ ...plaque, display: "inline-block", padding: "12px 28px", fontSize: 26,
            fontWeight: 600, letterSpacing: 0.3, maxWidth: 960 }}>
            {jalon.label}
          </div>
        </div>
      )}

      {/* ======================================================
          ACTE 1 FINAL — TIMELINE GRADUÉE (remplace le compteur date qui sautait)
          Curseur qui GLISSE en continu sur un axe 2020.5→2022.2, année sur le curseur.
          Encoches aux événements (JNIM/EIGS/Friction). Position remontée (Option B)
          → la source reste lisible en dessous. Blueprint série.
          ====================================================== */}
      {isFinalLook && showChrome && !isPartie && (() => {
        // PARTIE 1/2 (V5) : timeline Acte 1 MASQUÉE — le récit V5 redémarre la timeline à 2012
        // (cartouche encre "2012" de <Partie1Origine> suffit). Évite le chevauchement.
        // B1 V3 (D-4 timeline vivante) : en acte2, l'axe se RÉ-ÉTALONNE sur la période de
        // l'enjeu français (2013 Serval → 2024 AES). Le curseur GLISSE pendant tout B1
        // (f2630→f4162 mappé 2013→2022) → fini le curseur figé de V2 (critique Aziz #1).
        // Acte 1 (non-acte2) garde son axe 2020.5→2022.2.
        const AX_Y0 = acte2 ? 2013 : 2020.5;
        const AX_Y1 = acte2 ? 2024 : 2022.2;
        const yearNow = acte2
          ? interpolate(frame, [2630, B1A.END], [2013, 2022], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            })
          : interpolate(frame, [A1.MALI, A1.END], [AX_Y0, AX_Y1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
        // géométrie du bandeau
        const X0 = 175, X1 = width - 250, Y = height - 96;
        const span = AX_Y1 - AX_Y0;
        const tx = (yr: number) => X0 + ((yr - AX_Y0) / span) * (X1 - X0);
        const YEARS = acte2 ? [2014, 2017, 2020, 2023] : [2021, 2022];
        const EV: { yr: number; lbl: string; col: string }[] = acte2
          ? [
              { yr: 2013, lbl: "France", col: "#2E3A59" },
              { yr: 2015, lbl: "MINUSMA", col: "#3B5E7B" },
            ]
          : [
              { yr: interpolate(A1.JNIM, [A1.MALI, A1.END], [AX_Y0, AX_Y1]), lbl: "JNIM", col: SAHEL_COLORS.jnim },
              { yr: interpolate(A1.EIGS, [A1.MALI, A1.END], [AX_Y0, AX_Y1]), lbl: "EIGS", col: "#7A4A38" },
              { yr: interpolate(A1.FRICTION, [A1.MALI, A1.END], [AX_Y0, AX_Y1]), lbl: "Friction", col: SAHEL_COLORS.contested },
            ];
        const cx = tx(yearNow);
        // apparition douce du bandeau (suit le HUD ; masqué pendant l'overlay GeoConvergence)
        const op = hudOpEff;
        return (
          <div style={{ position: "absolute", left: 0, top: 0, width, height, opacity: op, pointerEvents: "none" }}>
            <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
              {/* plaque de fond */}
              <rect x={X0 - 28} y={Y - 36} width={(X1 + 32) - (X0 - 28)} height={76} rx={8}
                fill="rgba(243,233,200,0.84)" stroke="rgba(46,31,10,0.72)" strokeWidth={2} />
              {/* ligne de base */}
              <line x1={X0} y1={Y} x2={X1} y2={Y} stroke={SAHEL_COLORS.ink} strokeWidth={3} />
              {/* graduations années */}
              {YEARS.map((yr) => (
                <g key={yr}>
                  <line x1={tx(yr)} y1={Y - 9} x2={tx(yr)} y2={Y + 9} stroke={SAHEL_COLORS.ink} strokeWidth={3} />
                  <text x={tx(yr)} y={Y + 30} fill={SAHEL_COLORS.ink} fontSize={24} fontWeight={700}
                    fontFamily="Georgia, serif" textAnchor="middle">{yr}</text>
                </g>
              ))}
              {/* encoches événements (apparaissent une fois atteintes).
                  FLASH au passage du curseur : quand le curseur croise l'encoche
                  (yearNow ≈ e.yr), le label pulse brièvement → connecte œil/temps/action. */}
              {EV.map((e) => {
                const reached = yearNow >= e.yr - 0.02;
                const ev = interpolate(yearNow, [e.yr - 0.05, e.yr], [0, 1], {
                  extrapolateLeft: "clamp", extrapolateRight: "clamp",
                });
                if (!reached && ev <= 0) return null;
                // flash : pic au moment où le curseur passe l'encoche, retombe vite
                const cross = Math.abs(yearNow - e.yr);
                const flash = interpolate(cross, [0, 0.04], [1, 0], {
                  extrapolateLeft: "clamp", extrapolateRight: "clamp",
                });
                const lblSize = 15 + 5 * flash;   // grossit au passage (robuste headless)
                const lblY = Y - 26 - 5 * flash;
                return (
                  <g key={e.lbl} opacity={ev}>
                    <line x1={tx(e.yr)} y1={Y - 21} x2={tx(e.yr)} y2={Y}
                      stroke={e.col} strokeWidth={3 + 1.5 * flash} />
                    {/* halo de flash sous le label */}
                    {flash > 0.05 && (
                      <circle cx={tx(e.yr)} cy={Y - 30} r={14 * flash}
                        fill={e.col} opacity={0.18 * flash} />
                    )}
                    <text x={tx(e.yr)} y={lblY} fill={e.col}
                      fontSize={lblSize} fontWeight={700} fontFamily="Georgia, serif"
                      textAnchor="middle">{e.lbl}</text>
                  </g>
                );
              })}
              {/* curseur qui glisse */}
              <line x1={cx} y1={Y - 15} x2={cx} y2={Y + 15} stroke={SAHEL_COLORS.contested} strokeWidth={4} />
              <circle cx={cx} cy={Y} r={9} fill={SAHEL_COLORS.contested}
                stroke={SAHEL_COLORS.ink} strokeWidth={2} />
              {/* plaquette année sur le curseur */}
              <rect x={cx - 34} y={Y - 62} width={68} height={34} rx={5}
                fill={SAHEL_COLORS.cream} stroke={SAHEL_COLORS.contested} strokeWidth={2} />
              <text x={cx} y={Y - 38} fill={SAHEL_COLORS.ink} fontSize={26} fontWeight={800}
                fontFamily="Georgia, serif" textAnchor="middle">{Math.floor(yearNow)}</text>
            </svg>
          </div>
        );
      })()}

      {/* Source bas droite */}
      <div style={{ position: "absolute", bottom: 20, right: 30, fontSize: 12,
          color: SAHEL_COLORS.cream, opacity: hudOp * 0.65 }}>
        Données estimées · Sources : Wikipedia, ONU, HRW, UNHCR
      </div>
      </>}

      {/* ======================================================
          ÉTAPE 1 — HUD DEBUG (track caméra seul) : frame + nom du beat.
          Pour valider le rythme du drift + pause f572 + reprise.
          ====================================================== */}
      {acte1CameraOnly && (
        <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)",
            fontFamily: "monospace", fontSize: 22, fontWeight: 700, color: "#F3E9C8",
            background: "rgba(36,24,9,0.82)", padding: "10px 24px", borderRadius: 6,
            letterSpacing: 1, whiteSpace: "nowrap" }}>
          {`f${String(frame).padStart(4, "0")}  ·  ${acte1BeatName(frame)}`}
        </div>
      )}

      {/* ======================================================
          OVERLAY AES NEE (frame ~7014)
          ====================================================== */}
      {/* TAMPONS ACRONYMES ACTE 1.
          - Actes 2-5 (legacy) : centrés semi-transparents.
          - acte1Final : DÉCALÉS (haut-droite) avec liseré faction, ne cachent PAS la
            zone (plan upstream : "ne pas couvrir la zone dont on parle"). Le tampon
            apparaît au mot (stampOp décalé). */}
      {jnimStampOp > 0 && !isFinalLook && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center",
            opacity: jnimStampOp * 0.92, pointerEvents: "none" }}>
          <div style={{ ...plaque, padding: "16px 34px", textAlign: "center",
              background: "rgba(245,239,214,0.86)", borderColor: SAHEL_COLORS.jnim, borderWidth: 2,
              transform: `rotate(${paperWobble(frame, 4)}deg)` }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: SAHEL_COLORS.jnim, letterSpacing: 1 }}>
              JNIM
            </div>
            <div style={{ fontSize: 16, marginTop: 4, opacity: 0.7, fontWeight: 600, letterSpacing: 2,
              textTransform: "uppercase" }}>lié à Al-Qaïda</div>
          </div>
        </AbsoluteFill>
      )}
      {eigsStampOp > 0 && !isFinalLook && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center",
            opacity: eigsStampOp * 0.92, pointerEvents: "none" }}>
          <div style={{ ...plaque, padding: "16px 34px", textAlign: "center",
              background: "rgba(245,239,214,0.86)", borderColor: "#9C5A2E", borderWidth: 2,
              transform: `rotate(${paperWobble(frame, 6)}deg)` }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#9C5A2E", letterSpacing: 1 }}>
              EIGS
            </div>
            <div style={{ fontSize: 16, marginTop: 4, opacity: 0.7, fontWeight: 600, letterSpacing: 2,
              textTransform: "uppercase" }}>lié à Daesh</div>
          </div>
        </AbsoluteFill>
      )}
      {/* acte1Final : tampons COMPACTS + semi-transparents, centre-haut (au-dessus de la
          zone d'action située vers le bas-centre). Visible où est l'œil, sans cacher
          les véhicules. S'efface vite (géré par stampOp). */}
      {isFinalLook && jnimStampOp > 0 && (
        <div style={{ position: "absolute", top: "26%", left: "50%",
            transform: "translateX(-50%)", opacity: jnimStampOp * 0.95, pointerEvents: "none" }}>
          <div style={{ display: "inline-flex", alignItems: "baseline", gap: 10,
              padding: "8px 20px", borderRadius: 5,
              background: "rgba(40,28,14,0.78)", border: `2px solid ${SAHEL_COLORS.jnim}` }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: "#F3E9C8", letterSpacing: 1,
              fontFamily: "'Roboto Condensed', sans-serif" }}>JNIM</span>
            <span style={{ fontSize: 14, opacity: 0.82, fontWeight: 600, letterSpacing: 2,
              textTransform: "uppercase", color: "#F3E9C8" }}>lié à Al-Qaïda</span>
          </div>
        </div>
      )}
      {isFinalLook && eigsStampOp > 0 && (
        <div style={{ position: "absolute", top: "26%", left: "50%",
            transform: "translateX(-50%)", opacity: eigsStampOp * 0.95, pointerEvents: "none" }}>
          <div style={{ display: "inline-flex", alignItems: "baseline", gap: 10,
              padding: "8px 20px", borderRadius: 5,
              background: "rgba(40,28,14,0.78)", border: "2px solid #8a7a55" }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: "#F3E9C8", letterSpacing: 1,
              fontFamily: "'Roboto Condensed', sans-serif" }}>EIGS</span>
            <span style={{ fontSize: 14, opacity: 0.82, fontWeight: 600, letterSpacing: 2,
              textTransform: "uppercase", color: "#F3E9C8" }}>lié à Daesh</span>
          </div>
        </div>
      )}

      {/* Cartouche AES au CENTRE, semi-transparent (décision Aziz 2026-06-07 :
          les cartouches narratifs apparaissent au centre où est l'œil, pas sur le bord). */}
      {aesOverlayOp > 0 && !acte1CameraOnly && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center",
            opacity: aesOverlayOp * 0.92, pointerEvents: "none" }}>
          <div style={{ ...plaque, padding: "22px 40px", textAlign: "center",
              background: "rgba(245,239,214,0.86)",
              borderColor: SAHEL_COLORS.contested, borderWidth: 2,
              transform: `rotate(${paperWobble(frame, 5)}deg)` }}>
            <div style={{ fontSize: 15, letterSpacing: 4, fontWeight: 700,
              textTransform: "uppercase", opacity: 0.65, marginBottom: 6 }}>
              16 septembre 2023
            </div>
            <div style={{ fontSize: 34, fontWeight: 800, color: SAHEL_COLORS.contested, lineHeight: 1.1 }}>
              Alliance des États<br />du Sahel
            </div>
            <div style={{ fontSize: 17, marginTop: 8, opacity: 0.75, fontWeight: 500 }}>
              Charte du Liptako-Gourma
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ======================================================
          CARTON TITRE INTRO
          ====================================================== */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center",
          opacity: introOp, pointerEvents: "none" }}>
        <div style={{ ...plaque, textAlign: "center", padding: "34px 60px",
            transform: `rotate(${paperWobble(frame, 1)}deg)` }}>
          <div style={{ fontSize: 20, letterSpacing: 8, opacity: 0.70, fontWeight: 700,
            textTransform: "uppercase" }}>Sahel</div>
          <div style={{ fontSize: 64, fontWeight: 800, marginTop: 8,
            fontFamily: "'Cormorant Garamond', Georgia, serif", lineHeight: 1.08 }}>
            Tout a changé en trois ans
          </div>
          <div style={{ fontSize: 22, opacity: 0.75, marginTop: 10, fontWeight: 600 }}>
            2020 — 2026
          </div>
        </div>
      </AbsoluteFill>

      {/* Fade out final */}
      <AbsoluteFill style={{ background: "#1A1209", opacity: outroOp, pointerEvents: "none" }} />

      {/* ======================================================
          CTA FINAL (apres la narration, ~13200->13380)
          ====================================================== */}
      {(() => {
        const local = frame - CTA_START;
        if (local < 0 || local > CTA_HOLD) return null;
        const op = Math.min(
          interpolate(local, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          interpolate(local, [CTA_HOLD - 14, CTA_HOLD], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        );
        return (
          <AbsoluteFill style={{ opacity: op, justifyContent: "center", alignItems: "center",
              fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            <div style={{ background: `${SAHEL_COLORS.cream}D0`, border: `2px solid ${SAHEL_COLORS.ink}`,
                borderRadius: 10, padding: "22px 40px", textAlign: "center",
                color: SAHEL_COLORS.ink, maxWidth: 820, boxShadow: "0 8px 30px rgba(0,0,0,0.25)" }}>
              <div style={{ fontSize: 16, letterSpacing: 4, fontWeight: 700,
                textTransform: "uppercase", opacity: 0.55, marginBottom: 10 }}>
                Analyse complète
              </div>
              <div style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.3 }}>
                Le Sahel et l'Alliance des États
              </div>
              <div style={{ fontSize: 22, fontWeight: 500, opacity: 0.75, marginTop: 4 }}>
                sur la chaîne
              </div>
              <div style={{ marginTop: 14, fontSize: 20, fontWeight: 700, letterSpacing: 2, opacity: 0.65 }}>
                @koraetcartes
              </div>
            </div>
          </AbsoluteFill>
        );
      })()}

      {/* ======================================================
          ACTE 2 — B1 V3 (refonte DYNAMISME 2026-06-09, WARMAP-VIVANTE-GRAMMAIRE D-0..D-7).
          Jeton SOLDATS FR (acteur, pas avion) arrive → Gao. Convoi uranium = flux. Emprise UNIQUE
          relie 3 villes (relay-line, pas 3 jetons). Picto mine Arlit. Couleurs désaturées multiply.
          Pulse = onde radar. Pop ville = ink-spread. [code B1 legacy — refonte V5 en cours, voir STATUS.md]
          ====================================================== */}
      {acte2 && showChrome && (() => {
        const INK = "#2a2018";
        const FR  = "#2E3A59";      // France bleu-encre désaturé
        const URA = "#B85C38";      // ocre uranium chaud
        // RESPIRATION FINALE B1 (f4072→f4094) : tout passe à 0.6 (color pacing froid, D-5). [recalé v2 -68f]
        const b1Breathe = interpolate(frame, [4072, 4094], [1, 0.6],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const path = (pts: {x:number;y:number}[]) =>
          pts.map((p, i) => (i === 0 ? "M" : "L") + p.x.toFixed(1) + "," + p.y.toFixed(1)).join(" ");
        // EMPRISE STRATÉGIQUE (Ev5) : triangle qui se dessine f3399→f3525 [recalé v2 -51f/-55f].
        const stratDraw = interpolate(frame, [3399, 3525], [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
        // EMPRISE FR ENGLOBANTE (Ev7, fix upstream) : se diffuse après les 3 villes f4043→f4112 [recalé v2 -69f/-68f].
        const empriseDraw = interpolate(frame, [4043, 4112], [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
        // RELAY-LINE Gao→Ménaka→Niamey : se dessine f3989→f4073 (suit les pops) [recalé v2 -67f].
        const relayDraw = interpolate(frame, [3989, 4073], [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        // onde radar réutilisable (pulse anti-slop : stroke qui grandit + opacity→0)
        const radar = (cx: number, cy: number, t0: number, col: string, rmax: number) => {
          const local = (frame - t0) % 36;
          if (frame < t0 || local < 0) return null;
          const p = local / 36;
          return <circle cx={cx} cy={cy} r={6 + p * rmax} fill="none" stroke={col}
            strokeWidth={2.4} opacity={(1 - p) * 0.6 * b1Breathe} />;
        };
        return (
          <>
            {/* --- SVG layer : veines + emprises + relay (multiply = encre dans le papier) --- */}
            <svg width={width} height={height}
              style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", mixBlendMode: "multiply" }}>
              {/* EMPRISE STRATÉGIQUE — triangle Mali-Niger (Ev5) */}
              {stratDraw > 0 && empriseDraw <= 0 && b1BasePx.length === 3 && (() => {
                const tri = [b1BasePx[0], b1BasePx[1], b1BasePx[2], b1BasePx[0]].map((b) => ({ x: b.cx, y: b.cy }));
                return (
                  <path d={path(tri)} fill={INK} fillOpacity={0.06 * b1Breathe}
                    stroke={INK} strokeOpacity={0.45 * b1Breathe} strokeWidth={1.8}
                    strokeDasharray={1600} strokeDashoffset={1600 * (1 - stratDraw)} strokeLinejoin="round" />
                );
              })()}
              {/* EMPRISE FR GAO (Ev2) : prend le relais du jeton qui se fond — petite zone qui s'allume sur Gao */}
              {frame >= B1_FR_TOKEN.fEnd && b1BasePx.length === 3 && (() => {
                const gao = b1BasePx[0];
                const draw = interpolate(frame, [B1_FR_TOKEN.fEnd, B1_FR_TOKEN.fEnd + 40], [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
                // disparaît quand l'emprise englobante finale arrive (évite doublon) [recalé v2 -68f]
                const fade = interpolate(frame, [4032, 4072], [1, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                if (fade <= 0) return null;
                const circ = 2 * Math.PI * gao.rx;
                return (
                  <circle cx={gao.cx} cy={gao.cy} r={gao.rx} fill={FR} fillOpacity={0.12 * draw * fade * b1Breathe}
                    stroke={FR} strokeOpacity={0.6 * draw * fade * b1Breathe} strokeWidth={2}
                    strokeDasharray={circ} strokeDashoffset={circ * (1 - draw)} />
                );
              })()}
              {/* VEINE CONVOI uranium (Ev6) — trace ocre permanente */}
              {b1ConvoyPx && b1ConvoyPx.trail.length > 1 && (
                <path d={path(b1ConvoyPx.trail)} fill="none"
                  stroke={URA} strokeWidth={2.0} strokeOpacity={0.65 * b1Breathe} strokeLinecap="round" />
              )}
              {/* RELAY-LINE Gao→Ménaka→Niamey (Ev7, fix upstream : itinéraire, pas énumération) */}
              {relayDraw > 0 && b1BasePx.length === 3 && (() => {
                const pts = b1BasePx.map((b) => ({ x: b.cx, y: b.cy }));
                const d = path(pts);
                const len = 2000;
                return <path d={d} fill="none" stroke={FR} strokeWidth={2}
                  strokeOpacity={0.6 * b1Breathe} strokeDasharray={len}
                  strokeDashoffset={len * (1 - relayDraw)} strokeLinecap="round" strokeLinejoin="round" />;
              })()}
              {/* EMPRISE FR ENGLOBANTE (Ev7) : une seule zone qui relie les 3 villes ("la France sécurise CE triangle") */}
              {empriseDraw > 0 && b1BasePx.length === 3 && (() => {
                const tri = [b1BasePx[0], b1BasePx[1], b1BasePx[2], b1BasePx[0]].map((b) => ({ x: b.cx, y: b.cy }));
                return (
                  <path d={path(tri)} fill={FR} fillOpacity={0.14 * empriseDraw * b1Breathe}
                    stroke={FR} strokeOpacity={0.6 * empriseDraw * b1Breathe} strokeWidth={2} strokeLinejoin="round" />
                );
              })()}
            </svg>

            {/* --- SVG pulses (radar) : Serval/Barkhane/MINUSMA Mali + mine Arlit --- */}
            <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
              {/* SERVAL (f3019) : onde radar bleu-France sur le Mali — meublage 8-22s (D-7 toponyme nommé) */}
              {frame >= 3019 && frame < 3019 + 90 && a1ZonePx.jnim &&
                radar(a1ZonePx.jnim.x, a1ZonePx.jnim.y, 3019, FR, 80)}
              {/* BARKHANE (f3059) : 2e onde, plus large (l'opération s'étend) */}
              {frame >= 3059 && frame < 3059 + 90 && a1ZonePx.jnim &&
                radar(a1ZonePx.jnim.x, a1ZonePx.jnim.y, 3059, FR, 100)}
              {/* MINUSMA : onde radar bleu clair sur le Mali (Ev3, territoire pas que capitale) */}
              {frame >= B1A.MINUSMA && frame < B1A.MINUSMA + 150 && a1ZonePx.jnim &&
                radar(a1ZonePx.jnim.x, a1ZonePx.jnim.y, B1A.MINUSMA, "#3B5E7B", 90)}
              {/* MINE ARLIT : onde ocre 1× juste avant le convoi (Ev6, DeepSeek) */}
              {b1ArlitPx && frame >= B1A.ARLIT && frame < B1A.ARLIT + 40 &&
                radar(b1ArlitPx.x, b1ArlitPx.y, B1A.ARLIT, URA, 30)}
            </svg>

            {/* --- LABEL OPÉRATION FR (Serval → Barkhane) sur le Mali — meublage 8-22s --- */}
            {frame >= 3019 && frame < B1A.MINUSMA && a1ZonePx.jnim && (() => {
              const o = interpolate(frame, [3019, 3037, 3120, B1A.MINUSMA], [0, 1, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * b1Breathe;
              if (o <= 0) return null;
              const label = frame >= 3059 ? "Serval, puis Barkhane" : "Serval";
              return (
                <div style={{ position: "absolute", left: a1ZonePx.jnim.x, top: a1ZonePx.jnim.y - 40,
                    transform: "translate(-50%,-50%)", opacity: o, pointerEvents: "none",
                    fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 700,
                    color: FR, letterSpacing: 1, textShadow: "0 1px 3px rgba(243,233,200,0.95)" }}>
                  {label}
                </div>
              );
            })()}

            {/* --- LABEL ARLIT + picto mine (Ev6) --- */}
            {b1ArlitPx && frame >= B1A.ARLIT && (() => {
              const o = interpolate(frame, [B1A.ARLIT, B1A.ARLIT + 18], [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * b1Breathe;
              return (
                <>
                  {/* picto mine : petit losange noir (extraction) */}
                  <div style={{ position: "absolute", left: b1ArlitPx.x, top: b1ArlitPx.y,
                      transform: "translate(-50%,-50%) rotate(45deg)", width: 10, height: 10,
                      background: INK, opacity: o * 0.85, pointerEvents: "none" }} />
                  <div style={{ position: "absolute", left: b1ArlitPx.x, top: b1ArlitPx.y - 24,
                      transform: "translate(-50%,-50%)", opacity: o, pointerEvents: "none",
                      fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 19, fontWeight: 600,
                      color: INK, letterSpacing: 1, textShadow: "0 1px 2px rgba(243,233,200,0.9)" }}>
                    Arlit
                  </div>
                </>
              );
            })()}

            {/* --- 3 VILLES : ink-spread + label + insigne FR aux coudes du relay (Ev7) --- */}
            {b1BasePx.map((b) => {
              const sp = interpolate(frame, [b.appear, b.appear + 22], [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }) * b1Breathe;
              if (sp <= 0) return null;
              return (
                <div key={b.id} style={{ position: "absolute", left: b.cx, top: b.cy,
                    transform: "translate(-50%,-50%)", opacity: sp, pointerEvents: "none" }}>
                  <div style={{ position: "absolute", left: "50%", top: "50%", width: 34, height: 34,
                    transform: "translate(-50%,-50%)",
                    background: "radial-gradient(circle, rgba(243,233,200,0.92) 35%, rgba(243,233,200,0) 70%)" }} />
                  <img src={staticFile("_shared/sprites/warmap/base-france.png")}
                    style={{ position: "relative", width: 26, height: 26, objectFit: "contain", display: "block",
                      mixBlendMode: "multiply" }} />
                  {/* label décalé par ville (anti-chevauchement) : Gao au-dessus, Ménaka à droite, Niamey en bas */}
                  {(() => {
                    const off = b.id === "Gao" ? { top: -20, left: "50%", tx: "-50%" }
                      : b.id === "Ménaka" ? { top: 0, left: "120%", tx: "0%" }
                      : { top: 20, left: "50%", tx: "-50%" };
                    return (
                      <div style={{ position: "absolute", left: off.left, top: off.top,
                        transform: `translate(${off.tx},-50%)`,
                        fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontWeight: 600,
                        color: INK, whiteSpace: "nowrap", textShadow: "0 1px 3px rgba(243,233,200,1)" }}>{b.id}</div>
                    );
                  })()}
                </div>
              );
            })}

            {/* --- JETON SOLDATS FR (Ev2) : arrive de l'ouest → Gao, PUIS se fond (l'emprise prend le relais) --- */}
            {b1PlanePx && (() => {
              const P = B1_FR_TOKEN;
              // l'acteur a joué son rôle : après la pose il se FOND (f2860→f2960), l'emprise FR reste.
              const frFade = interpolate(frame, [P.fEnd + 70, P.fEnd + 170], [1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              if (frFade <= 0) return null;
              const D = 60;
              const moving = frame <= P.fEnd;
              // queue cinétique (sillage) uniquement pendant le mouvement
              const tail = moving ? b1PlanePx.trail.slice(1, 5) : [];
              return (
                <>
                  {tail.map((pt, i) => (
                    <div key={"frtail" + i} style={{ position: "absolute", left: pt.x, top: pt.y,
                        transform: "translate(-50%,-50%)", opacity: (0.22 - i * 0.05) * b1Breathe,
                        width: D, height: D, borderRadius: "50%", overflow: "hidden",
                        background: SAHEL_COLORS.cream, border: `3px solid ${FR}`, pointerEvents: "none" }}>
                      <img src={staticFile("_shared/sprites/warmap/fighter-france.png")}
                        style={{ width: "118%", height: "118%", objectFit: "cover", objectPosition: "top center",
                          transform: "translate(-8%, 2%)", display: "block" }} />
                    </div>
                  ))}
                  <div style={{ position: "absolute", left: b1PlanePx.x, top: b1PlanePx.y,
                      transform: "translate(-50%,-50%)", opacity: b1Breathe * frFade, pointerEvents: "none" }}>
                    {/* ombre portée (ancrage) */}
                    <div style={{ position: "absolute", left: "50%", top: "72%", width: D * 0.8, height: D * 0.24,
                      transform: "translate(-50%,-50%)", background: "rgba(40,27,8,0.4)",
                      borderRadius: "50%", filter: "blur(5px)" }} />
                    <div style={{ width: D, height: D, borderRadius: "50%", overflow: "hidden",
                      background: SAHEL_COLORS.cream, border: `3.5px solid ${FR}`,
                      boxShadow: "0 4px 10px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.3)" }}>
                      <img src={staticFile("_shared/sprites/warmap/fighter-france.png")}
                        style={{ width: "118%", height: "118%", objectFit: "cover", objectPosition: "top center",
                          transform: "translate(-8%, 2%)", display: "block" }} />
                    </div>
                  </div>
                </>
              );
            })()}

            {/* --- CONVOI uranium (Ev6) : véhicule-sprite = flux logistique --- */}
            {b1ConvoyPx && (() => {
              const C = B1_CONVOY;
              const fadeOut = interpolate(frame, [C.fEnd + 30, C.fEnd + 70], [1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const fadeIn = interpolate(frame, [C.fStart, C.fStart + 12], [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const o = Math.min(fadeIn, fadeOut) * b1Breathe;
              if (o <= 0) return null;
              const W = 120;
              return (
                <div style={{ position: "absolute", left: b1ConvoyPx.x, top: b1ConvoyPx.y,
                    transform: "translate(-50%,-50%)", opacity: o, pointerEvents: "none" }}>
                  <div style={{ position: "absolute", left: "50%", top: "50%", width: W * 0.85, height: W * 0.85,
                    transform: "translate(-50%,-50%)",
                    background: "radial-gradient(circle, rgba(243,233,200,0.92) 30%, rgba(243,233,200,0) 70%)" }} />
                  <img src={staticFile("_shared/sprites/warmap/convoi-uranium.png")}
                    style={{ width: W, height: "auto", objectFit: "contain", display: "block",
                      transform: `rotate(${b1ConvoyPx.deg + 180}deg)`,
                      filter: "drop-shadow(0 1px 3px rgba(40,32,24,0.5))" }} />
                </div>
              );
            })()}

            {/* POINT MALI PERSISTANT (idée Aziz) : ancré sur le CENTRE du cadrage Mali (= là où
                l'overlay montre "Mali"), géo-projeté. Apparaît avec l'overlay et RESTE après sa
                disparition (hold caméra f3565-3610) → transition seamless "l'overlay se résorbe
                dans la carte". Opacity monte à f3320, reste jusqu'à la reprise du PAN. */}
            {b1MaliDotPx && (() => {
              const op = Math.min(
                interpolate(frame, [3320, 3350], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                interpolate(frame, [3660, 3690], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) // s'efface quand le PAN repart
              );
              if (op <= 0) return null;
              const pulse = 1 + 0.14 * Math.sin(frame * 0.08);
              return (
                <div style={{ position: "absolute", left: b1MaliDotPx.x, top: b1MaliDotPx.y,
                  transform: "translate(-50%,-50%)", opacity: op, pointerEvents: "none" }}>
                  <div style={{ width: 18 * pulse, height: 18 * pulse, borderRadius: "50%",
                    border: "2px solid #C9A227", opacity: 0.55 }} />
                  <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
                    width: 10, height: 10, borderRadius: "50%", background: "#2E3A59",
                    boxShadow: "0 0 7px rgba(46,58,89,0.55)" }} />
                </div>
              );
            })()}

            {/* === OVERLAY GEOCONVERGENCE (D-9 premium + jetons incarnés D-6, template DA 2026-06-10) ===
                Répond à la phrase B "pourquoi le jour même ?" : forces FR DÉJÀ là (rayon d'action)
                qui CONVERGENT le jour même. Voile semi-transp (prepoVeil) — carte vivante derrière.
                3 jetons soldats FR DISTINCTS (même armée, pas clones). Démarre après "le jour même". */}
            <GeoConvergenceOverlay
              startFrame={3300}
              holdFrames={250}
              trigger={70}
              veilAlpha={prepoVeil}
              scale={1.12}
              surtitle="Janvier 2013"
              center={{ x: 470, y: 290 }}
              total={1650}
              footer="soldats français déjà sur place"
              forces={[
                { op: "Épervier", country: "Tchad",         effectif: 950, token: "_shared/sprites/warmap/fr-epervier.png", angleDeg: 6,   radius: 470, reach: 200, appearAt: 20 },
                { op: "Sabre",    country: "Burkina Faso",  effectif: 250, effectifText: "250 soldats · forces spéciales", token: "_shared/sprites/warmap/fr-sabre.png", angleDeg: 54, radius: 330, reach: 150, appearAt: 32 },
                { op: "Licorne",  country: "Côte d'Ivoire", effectif: 450, token: "_shared/sprites/warmap/fr-licorne.png", angleDeg: 108, radius: 330, reach: 170, appearAt: 44 },
              ] as GeoForce[]}
            />
          </>
        );
      })()}

      {/* ======================================================
          POLISH PREMIUM GLOBAL (acte1Final — blueprint série)
          Ordre : grain papier → vignette cinéma → respiration finale.
          Posés au sommet de la pile = au-dessus de toute la carte.
          ====================================================== */}
      {/* REFACTOR V5 — couches Partie (canari/blocage), SOUS le grain papier.
          Encre/taches dessinées par-dessus la carte+jetons, sous la texture d'archive. */}
      {partie1 && <Partie1Origine ctx={sahelCtx} />}
      {partie2 && <Partie2Blocage ctx={sahelCtx} />}

      {isFinalLook && (() => {
        // RESPIRATION FINALE : sur les ~2.5 dernières secondes (f2220→END),
        // léger assombrissement progressif = suspension avant l'Acte 2.
        // En acte2, PAS d'assombrissement à f2299 (le récit continue sans coupure).
        const finalDarken = acte2 ? 0 : interpolate(frame, [2220, A1.END], [0, 0.22], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        return (
          <>
            {/* GRAIN PAPIER plein écran — texture "document d'archive" homogène */}
            <AbsoluteFill style={{
              backgroundImage: `url(${staticFile("_shared/sprites/warmap/paper-grain.png")})`,
              backgroundRepeat: "repeat",
              opacity: 0.5,
              mixBlendMode: "overlay",
              pointerEvents: "none",
            }} />
            {/* VIGNETTE CINÉMA — coins assombris, concentre l'œil sur le Sahel */}
            <AbsoluteFill style={{
              background: "radial-gradient(ellipse 72% 72% at 50% 48%, rgba(0,0,0,0) 55%, rgba(20,14,6,0.18) 88%, rgba(16,11,5,0.32) 100%)",
              pointerEvents: "none",
            }} />
            {/* RESPIRATION FINALE — assombrissement de suspension */}
            {finalDarken > 0 && (
              <AbsoluteFill style={{
                background: "#140E06", opacity: finalDarken, pointerEvents: "none",
              }} />
            )}
          </>
        );
      })()}
    </AbsoluteFill>
  );
};

const FactionLegend: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
    <div style={{ width: 16, height: 16, borderRadius: 3, background: color,
      border: "1.5px solid rgba(26,18,9,0.5)", flexShrink: 0 }} />
    <span style={{ fontSize: 15, fontWeight: 600, color: SAHEL_COLORS.ink }}>{label}</span>
  </div>
);
