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
const F_GAO           = 4056;  // "Gao,"
const F_MENAKA_BASE   = 4082;  // "Ménaka," (base militaire)
const F_NIAMEY_BASE   = 4112;  // "Niamey."
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
  { f: 4100,  lon: 0.3,  lat: 15.6, zoom: 4.72 }, // bases militaires
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
  // --- 2e moitié : drift continu + recentrages marqués sur événements ---
  { f: 960,  lon: -0.9, lat: 15.05, zoom: 4.71 }, // drift doux vers centre Mali (transition)
  { f: 1198, lon: -1.1, lat: 15.2, zoom: 4.74 }, // "JNIM" : recentre marqué centre Mali + zoom léger
  { f: 1450, lon: -0.8, lat: 15.1, zoom: 4.73 }, // drift continu pendant patrouille JNIM
  { f: 1749, lon:  0.5, lat: 15.0, zoom: 4.74 }, // "EIGS" : recentre marqué trois-frontières est
  { f: 1980, lon:  0.2, lat: 15.0, zoom: 4.74 }, // drift continu pendant patrouille EIGS
  { f: 2167, lon: -0.1, lat: 15.05, zoom: 4.82 }, // "combattent" : resserre marqué sur friction
  { f: 2299, lon: -0.1, lat: 15.05, zoom: 4.82 }, // "séparément" : freeze final
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
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // VERSION FINALE Acte 1 : dérive les sous-mécaniques du socle validé.
  // Allumage séquentiel calé sur les triggers RÉELS (Mali f150, BFA f231, NER f301).
  // On surcharge les flags effectifs (eff*) sans muter les props d'origine.
  const effFusion = acte1Final ? true : fusionRegions;
  const effVignette = acte1Final ? true : geoVignette;
  const effVignetteOp = acte1Final ? 0.42 : geoVignetteOpacity;
  const effCityPulse = acte1Final ? true : cityPulse;
  const effFrontDraw = acte1Final ? true : frontDraw;
  const effSeqIgnite = acte1Final
    ? { MLI: A1.MALI, BFA: A1.BURKINA, NER: A1.NIGER }
    : sequentialIgnite;
  // Acte 1 final utilise le nouveau track caméra (comme le mode cameraOnly).
  const useActe1Cam = acte1Final || acte1CameraOnly;

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
  const [refPx, setRefPx] = useState<{ id: string; x: number; y: number; dx: number; dy: number }[]>([]);
  const [iconPx, setIconPx] = useState<{ id: string; x: number; y: number }[]>([]);
  // CORRECTION B (test) : silhouette AES reprojetée en pixels (paths SVG) pour le masque vignette.
  const [aesPaths, setAesPaths] = useState<string[]>([]);
  // B3 frontDraw : contours des masses fusionnées reprojetés, groupés par pays (draw-in).
  const [frontPaths, setFrontPaths] = useState<{ country: string; d: string; len: number }[]>([]);
  // ACTE 1 FINAL : véhicules pilotés par frame absolue (position + direction).
  const [a1VehPx, setA1VehPx] = useState<{ id: string; x: number; y: number; dx: number; dy: number }[]>([]);
  const [hookPx, setHookPx] = useState<{
    bamako: { x: number; y: number } | null;
    ouaga: { x: number; y: number } | null;
    niamey: { x: number; y: number } | null;
    liptako: { x: number; y: number } | null;
  }>({ bamako: null, ouaga: null, niamey: null, liptako: null });

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
          "line-opacity": frontDraw ? 0 : fusionRegions ? 0.55 : 0.25,
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
          const dim = acte1Final
            ? interpolate(frame, [A1.DRIFT, A1.DRIFT + 40], [1, 0.42], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              })
            : 1;
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
      const a1Freeze = frame >= A1.FREEZE && frame < A1.FREEZE_END;
      const cam = a1Freeze ? getActe1Cam(A1.FREEZE) : getActe1Cam(frame);
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
    if (acte1Final) {
      const a1proj = ACTE1_VEHICLES.map((v) => {
        const [lon, lat] = interpA1Vehicle(v.wp, frame);
        const [lon2, lat2] = interpA1Vehicle(v.wp, frame - 2);
        const p = map.project([lon, lat]);
        const pPrev = map.project([lon2, lat2]);
        return { id: v.id, x: p.x, y: p.y, dx: p.x - pPrev.x, dy: p.y - pPrev.y };
      });
      setA1VehPx(a1proj);
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
  const stampDelay = acte1Final ? 25 : 0;
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

  return (
    <AbsoluteFill style={{ backgroundColor: SAHEL_COLORS.ocean, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <MapboxBrandingHide />

      {/* Narration principale */}
      <Audio src={staticFile("_shared/audio/sahel-warmap/narration-v1.mp3")} />

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
      {acte1Final && showChrome && cedeaoOpA1 > 0 && hookPx.liptako && (() => {
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
      {acte1Final && showChrome && arrowDraw > 0 && hookPx.liptako &&
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
      {!acte1CameraOnly && !acte1Final && [
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
      {cedeaoOp > 0 && showChrome && !acte1Final && hookPx.liptako && (() => {
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
      {liptakoProgress > 0 && showChrome && !acte1Final && (
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

      {/* SCRIPT: "Comment est-ce possible ?" → carton figé sur la carte (f572, 2s) */}
      {hookFreezeActive && (
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
      {showChrome && frame >= F_EXPANSION_START && frame < F_EXPANSION_END + 100 && (
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
      {showChrome && libArrowProgress > 0 && (
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
      {showChrome && famaArrowProgress > 0 && (
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
      {showChrome && africaCorpsProgress > 0 && (
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
      {showChrome && counterProgress > 0 && (
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
          VEHICULES (JNIM/EIGS rouge, FAMa bleu, CSP or) — legacy Actes 2-5.
          En acte1Final, on utilise ACTE1_VEHICLES (frame-driven) à la place.
          ====================================================== */}
      {showChrome && !acte1Final &&
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
          ACTE 1 FINAL — VÉHICULES frame-driven (mouvement réel + but narratif).
          JNIM pickup rouge (erratique) · EIGS blindé sombre (linéaire). Orientés
          selon la trajectoire, traînée de poussière, ombre portée.
          ====================================================== */}
      {acte1Final && showChrome &&
        ACTE1_VEHICLES.map((v) => {
          const pos = a1VehPx.find((p) => p.id === v.id);
          if (!pos) return null;
          const pop = interpolate(frame, [v.appear, v.appear + 20, v.disappear, v.disappear + 30],
            [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp",
              easing: Easing.bezier(0.2, 0.9, 0.3, 1) });
          if (pop <= 0) return null;
          const mag = Math.hypot(pos.dx, pos.dy);
          const moving = mag > 0.05;
          const ang = Math.atan2(pos.dy, pos.dx);
          // sprites technical-* pointent vers le HAUT -> offset +90 par rapport au cap.
          const headingDeg = moving ? (ang * 180) / Math.PI + 90 : 0;
          const trailLen = Math.min(40, mag * 8 + 6);
          const col = v.faction === "jnim" ? SAHEL_COLORS.jnim : "#3E2A18";
          return (
            <div key={v.id} style={{ position: "absolute", left: pos.x, top: pos.y,
                transform: `translate(-50%, -50%) scale(${pop})`, opacity: pop, pointerEvents: "none" }}>
              {moving && (
                <div style={{ position: "absolute", left: 0, top: 0, width: trailLen, height: 6,
                  transform: `translate(-100%, -50%) rotate(${(ang * 180) / Math.PI}deg)`,
                  transformOrigin: "100% 50%",
                  background: `linear-gradient(90deg, rgba(0,0,0,0), ${col})`,
                  borderRadius: 4, opacity: 0.4 }} />
              )}
              {/* ombre portée */}
              <div style={{ position: "absolute", left: "50%", top: "56%", width: v.size * 0.6,
                height: v.size * 0.24, transform: "translate(-50%,-50%)",
                background: "rgba(26,18,9,0.25)", borderRadius: "50%", filter: "blur(3px)" }} />
              <img src={staticFile(`_shared/sprites/warmap/${v.sprite}.png`)}
                style={{ width: v.size, height: v.size, objectFit: "contain", display: "block",
                  transform: `rotate(${headingDeg}deg)`,
                  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }} />
            </div>
          );
        })}

      {/* ======================================================
          ACTE 1 FINAL — ONDES DE FRICTION (f2167 "combattent")
          Entre la zone JNIM et la zone EIGS : ondes de choc SVG concentriques
          qui pulsent au point de contact (PAS d'explosion — "répulsion").
          ====================================================== */}
      {acte1Final && showChrome && frame >= A1.FRICTION && frame < A1.END + 20 && (() => {
        // point de friction = entre les véhicules JNIM (ouest) et EIGS (est).
        const jnim = a1VehPx.find((p) => p.id === "a1-jnim-1");
        const eigs = a1VehPx.find((p) => p.id === "a1-eigs-1");
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
      {showChrome && !acte1Final &&
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
              {/* label ville */}
              <div style={{ ...plaque, position: "absolute", left: "50%", top: 14,
                transform: "translateX(-50%)", marginTop: 6, padding: "3px 10px", fontSize: 16,
                fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase", whiteSpace: "nowrap" }}>
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
      <div style={{ position: "absolute", top: 40, left: 44, opacity: hudOp,
          transform: `rotate(${paperWobble(frame, 3)}deg)` }}>
        <div style={{ ...plaque, padding: "12px 20px" }}>
          <div style={{ fontSize: 13, letterSpacing: 3, opacity: 0.65, fontWeight: 700,
            textTransform: "uppercase", marginBottom: 10 }}>Contrôle territorial</div>
          <FactionLegend color={SAHEL_COLORS.etat}      label="Forces gouvernementales" />
          <FactionLegend color={SAHEL_COLORS.contested}  label="Contesté / CSP" />
          <FactionLegend color={SAHEL_COLORS.jnim}      label="JNIM / EIGS" />
        </div>
      </div>

      {/* Date + jalon — haut droite */}
      <div style={{ position: "absolute", top: 40, right: 46, opacity: hudOp,
          transform: `rotate(${paperWobble(frame, 11)}deg)` }}>
        <div style={{ ...plaque, padding: "12px 22px", textAlign: "right" }}>
          <div style={{ fontSize: 42, fontWeight: 800, fontVariantNumeric: "tabular-nums",
            letterSpacing: 1, fontFamily: "Georgia, serif" }}>
            {jalon.date.replace(/\./g, "·")}
          </div>
        </div>
      </div>

      {/* Evenement bas */}
      <div style={{ position: "absolute", bottom: 50, left: 0, right: 0, textAlign: "center",
          opacity: hudOp, padding: "0 80px" }}>
        <div style={{ ...plaque, display: "inline-block", padding: "12px 28px", fontSize: 26,
          fontWeight: 600, letterSpacing: 0.3, maxWidth: 960 }}>
          {jalon.label}
        </div>
      </div>

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
      {jnimStampOp > 0 && !acte1Final && (
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
      {eigsStampOp > 0 && !acte1Final && (
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
      {acte1Final && jnimStampOp > 0 && (
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
      {acte1Final && eigsStampOp > 0 && (
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
