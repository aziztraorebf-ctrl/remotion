/**
 * SahelTimings.ts — Données pures de timing et de configuration pour SahelWarMapEngine.
 *
 * Contenu : triggers audio (A1, F_*), pulses régions, fenêtres masquage,
 * fonctions pures (contourHideFactor, mapHideFactor, countryPulseAt),
 * coordonnées pivots, CITY_SCHEDULE, RESOURCE_ICONS.
 *
 * Aucun hook React, aucune closure sur état composant — 100% pur.
 */

import { interpolate } from "remotion";
import React from "react";

// ============================================================
// ACTE 1 — triggers RÉELS (forced-alignment narration V5, 2026-06-15)
// ============================================================
export const A1 = {
  MALI: 145, BURKINA: 217, NIGER: 286, CEDEAO: 361, LIPTAKO: 477,
  FREEZE: 539, FREEZE_END: 599, DRIFT: 684,
  JNIM: 1132, EIGS: 1461, FRICTION: 1840, END: 2096,
} as const;

// ============================================================
// ACTE 1 FINAL — PULSE RÉGION-PRÉCISE AU NOMMAGE
// ============================================================
export type RegionPulse = { key: string; faction: "jnim" | "eigs"; trigger: number; dur: number; regions: string[] };

export const A1_REGION_PULSES: RegionPulse[] = [
  { key: "jnim-mali", faction: "jnim", trigger: 1411, dur: 80, regions: ["Mopti", "Ségou"] },
  { key: "jnim-bfa", faction: "jnim", trigger: 1454, dur: 90, regions: ["Sahel", "Nord", "Centre-Nord"] },
  { key: "eigs-3f", faction: "eigs", trigger: 1942, dur: 80, regions: ["Ménaka", "Tillabéri"] },
  { key: "eigs-niger", faction: "eigs", trigger: 2009, dur: 85, regions: ["Tillabéri", "Tahoua"] },
];

// B1 V3 — ACTE 2 pulses de régions
export const ACTE2_REGION_PULSES: RegionPulse[] = [
  { key: "a2-mali", faction: "jnim", trigger: 2613, dur: 90, regions: ["Gao", "Kidal", "Tombouctou", "Mopti"] },
  { key: "a2-niger", faction: "eigs", trigger: 3575, dur: 110, regions: ["Tillabéri", "Tahoua", "Agadez"] },
];

// ============================================================
// TRIGGERS AUDIO (depuis TIMING-V1-2026-06-07.md)
// ============================================================
export const F_JNIM_ZONE     = 1132;
export const F_BURKINA       = 1375;
export const F_NIGER         = 1690;
export const F_AES_NEE       = 7014;
export const F_KIDAL_ALONE   = 7279;
export const F_KIDAL_FLAG    = 8683;
export const F_REF_DJIBO     = 10294;
export const F_REF_MENAKA    = 10349;
export const F_REF_TILLABERI = 10783;
export const F_ICON_OR       = 11032;
export const F_ICON_PETRO    = 11122;
export const F_SAHELIENS     = 12183;

// Triggers villes additionnels
export const F_GAO           = 3989;
export const F_MENAKA_BASE   = 4014;
export const F_NIAMEY_BASE   = 4043;
export const F_DJIBO_REF     = 10294;

// Infusion factions
export const F_FACTIONS_INFUSE = 900;

// ============================================================
// TRIGGERS MAP ANIMATION — Act 2 + Act 3
// ============================================================
export const F_EXPANSION_START = 2630;
export const F_EXPANSION_END   = 4800;
export const F_LIBYE_ARMES = 2630;

export const F_KIDAL_OFFENSIVE = 8218;
export const F_KIDAL_FLAG_VISIBLE = 8683;
export const F_KIDAL_COUNTER = 9477;

// Coordonnées pour flèches tactiques Act 3
export const GAO_COORD    = [-0.04, 16.27] as [number, number];
export const MENAKA_COORD = [2.40, 15.92] as [number, number];
export const KIDAL_COORD  = [1.44, 18.43] as [number, number];

// Coordonnées Libye (source armes) pour Act 2
export const LIBYE_COORD  = [13.18, 32.90] as [number, number];
export const NORD_MALI_COORD = [1.44, 18.43] as [number, number];

// ============================================================
// TRIGGERS HOOK — Acte 1 (forced alignment narration-v1, recalés V5)
// ============================================================
export const F_HOOK_MALI     = 145;
export const F_HOOK_BURKINA  = 217;
export const F_HOOK_NIGER    = 286;
export const F_HOOK_CEDEAO   = 361;
export const F_HOOK_LIPTAKO  = 477;
export const F_HOOK_FREEZE   = 539;
export const F_HOOK_DRIFT    = 684;

// ============================================================
// CONTOURS NATIONAUX — pulses pays (Aziz 2026-06-13)
// ============================================================
export type CountryISO = "MLI" | "BFA" | "NER";

export const COUNTRY_PULSES: { f: number; c: CountryISO }[] = [
  { f: 1324, c: "MLI" }, { f: 1360, c: "BFA" }, { f: 1689, c: "NER" },
  { f: 2442, c: "MLI" }, { f: 3723, c: "MLI" },
  { f: 4858, c: "MLI" }, { f: 4976, c: "BFA" }, { f: 5380, c: "NER" },
  { f: 6255, c: "NER" }, { f: 7083, c: "MLI" }, { f: 7240, c: "MLI" },
  { f: 8117, c: "MLI" }, { f: 8158, c: "MLI" },
  { f: 10709, c: "MLI" }, { f: 10729, c: "BFA" }, { f: 10851, c: "NER" },
];

// ============================================================
// FENÊTRES D'EFFACEMENT des contours nationaux (Aziz 2026-06-13)
// ============================================================
export const CONTOUR_HIDE_WINDOWS: { from: number; to: number }[] = [
  { from: 6118, to: 6800 },
  { from: 8560, to: 8920 },
  { from: 10047, to: 10574 },
  { from: 10647, to: 11433 },
  { from: 11869, to: 12273 },
];

// facteur 1 = contours visibles, 0 = effacés. Fondu de 30f aux bords.
export const contourHideFactor = (frame: number): number => {
  let f = 1;
  for (const w of CONTOUR_HIDE_WINDOWS) {
    const inside = interpolate(frame, [w.from - 30, w.from, w.to, w.to + 30], [1, 0, 0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    f = Math.min(f, inside);
  }
  return f;
};

// ============================================================
// MAP_HIDE_WINDOWS : fenêtres où la carte Mapbox est CARRÉMENT MASQUÉE
// ============================================================
export const MAP_HIDE_WINDOWS: { from: number; to: number }[] = [
  { from: 10647, to: 11433 },
];

// 1 = carte visible, 0 = carte masquée. Fondu 14f aux bords.
export const mapHideFactor = (frame: number): number => {
  let f = 1;
  for (const w of MAP_HIDE_WINDOWS) {
    const inside = interpolate(frame, [w.from - 14, w.from + 2, w.to - 2, w.to + 14], [1, 0, 0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    f = Math.min(f, inside);
  }
  return f;
};

// pulse 0..1 pour un pays à une frame
export const countryPulseAt = (country: CountryISO, frame: number): number => {
  let best = 0;
  for (const p of COUNTRY_PULSES) {
    if (p.c !== country || frame < p.f) continue;
    const v =
      frame < p.f + 10 ? (frame - p.f) / 10 :
      frame < p.f + 40 ? 1 :
      frame < p.f + 80 ? 1 - (frame - p.f - 40) / 40 : 0;
    if (v > best) best = v;
  }
  return Math.max(0, Math.min(1, best));
};

// ============================================================
// COORDONNÉES PIVOTS HOOK
// ============================================================
export const LIPTAKO_CENTER = [-0.5, 14.5] as [number, number];
export const BAMAKO_COORD   = [-7.99, 12.65] as [number, number];
export const OUAGA_COORD    = [-1.52, 12.37] as [number, number];
export const NIAMEY_COORD   = [2.12, 13.51] as [number, number];

// ============================================================
// VILLES — apparition progressive liée à l'audio
// ============================================================
export type CityConfig = { name: string; appearFrame: number; hold: number };

export const CITY_SCHEDULE: CityConfig[] = [
  { name: "Bamako",      appearFrame: Math.round(1.8 * 30),  hold: 2600 },
  { name: "Gao",         appearFrame: F_GAO,                 hold: 7200 },
  { name: "Ménaka",      appearFrame: F_MENAKA_BASE,         hold: 7200 },
  { name: "Niamey",      appearFrame: F_NIAMEY_BASE,         hold: 5800 },
  { name: "Ouagadougou", appearFrame: F_BURKINA,             hold: 2600 },
  { name: "Kidal",       appearFrame: F_KIDAL_ALONE,         hold: 9900 },
  { name: "Djibo",       appearFrame: F_DJIBO_REF,           hold: 11800 },
  { name: "Tillabéri",   appearFrame: F_ICON_PETRO,          hold: 12200 },
];

// micro-wobble papier (signature Atlas)
export const paperWobble = (frame: number, seed = 0): number =>
  Math.sin((frame + seed) * 0.08) * 0.3;

// Ville-clé par pays
export const COUNTRY_KEY_CITY: Record<string, string> = {
  MLI: "Bamako",
  BFA: "Ouagadougou",
  NER: "Niamey",
};

// ============================================================
// ICONES RESSOURCES geo-ancrées
// ============================================================
export type ResourceIcon = {
  id: string;
  kind: "or" | "uranium" | "petrole";
  lon: number;
  lat: number;
  appearFrame: number;
  label: string;
};

export const RESOURCE_ICONS: ResourceIcon[] = [
  { id: "or-mali",  kind: "or",     lon: -8.0,  lat: 12.65, appearFrame: F_ICON_OR,    label: "Or" },
  { id: "or-bf",    kind: "or",     lon: -0.8,  lat: 12.4,  appearFrame: F_ICON_OR,    label: "Or" },
  { id: "uranium",  kind: "uranium",lon:  7.99,  lat: 16.97, appearFrame: F_ICON_PETRO, label: "Uranium" },
  { id: "petrole",  kind: "petrole",lon:  13.0,  lat: 15.3,  appearFrame: F_ICON_PETRO, label: "Pétrole" },
];

// SVG inline pour les icones ressources (top-down, encre parchemin)
export const ResourceSVG: React.FC<{ kind: ResourceIcon["kind"]; size?: number }> = ({ kind, size = 40 }) => {
  if (kind === "or") {
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
    return (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <polygon points="20,6 32,13 32,27 20,34 8,27 8,13" fill="#7BB3C4" stroke="#3A2A18" strokeWidth="1.5" />
        <polygon points="20,12 27,16 27,24 20,28 13,24 13,16" fill="#9FCFDF" stroke="#3A2A18" strokeWidth="0.8" />
        <circle cx="20" cy="20" r="4" fill="#D0EAF0" stroke="#3A2A18" strokeWidth="0.8" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <path d="M20 8 C20 8 8 22 8 28 A12 12 0 0 0 32 28 C32 22 20 8 20 8Z" fill="#2A2A2A" stroke="#3A2A18" strokeWidth="1.5" />
      <path d="M16 28 A5 5 0 0 1 22 23" stroke="#555" strokeWidth="1.2" fill="none" />
    </svg>
  );
};
