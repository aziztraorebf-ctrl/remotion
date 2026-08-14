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
// ACTE 1 — TRIGGERS V6 (retiming 2026-08-06, script reecrit apres echec vues
// video V5 5vues/24h). Force-align sur aes-v6-acte1.alignment.json (offset 0,
// l'Acte1 demarre a f0 dans le moteur). Colonne V5 = ancienne valeur, pour audit.
//
// "Mali/Burkina/Niger" f10/32/70 (V5: 145/217/286, groupes cites ensemble en une
//   seule phrase en V6 au lieu d'un rythme separe -> beaucoup plus tot/compact)
// "bloc regional"/"creent...alliance" f359/488 (V5: CEDEAO f361/LIPTAKO f477) --
//   ⚠️ le texte V6 NE NOMME PLUS "CEDEAO" ni "Liptako-Gourma" dans le hook (dit
//   juste "ils claquent la porte de leur propre bloc regional...creent leur
//   propre alliance") -- meme INTENTION narrative (rupture bloc -> alliance),
//   recale sur les mots les plus proches. Ecart V5(361->477=116f) tres proche de
//   V6(359->488=129f) -- structure temporelle interne du hook globalement stable
//   ici malgre le texte reecrit.
// "Al-Qaida" f1886 / "Daech" f1942 (V5: "JNIM" f1132 / "EIGS" f1461) -- ⚠️ le
//   texte V6 NE NOMME PLUS les sigles JNIM/EIGS (dit "l'une liee a Al-Qaida,
//   l'autre a Daech") -- decision Aziz 2026-08-06 : GARDER les cartouches
//   visuels JNIM/EIGS, recales sur le nom du groupe parent le plus proche.
// "detestent/combattent" f1994 (V5: FRICTION f1840)
// "decennies" f2680 (V5: END f2096) -- proxy zone vide/rancoeurs, fin Acte1 (pas
//   de mot exact "rancoeurs" trouve par force-align, "decennies" juste avant)
// ============================================================
export const A1 = {
  MALI: 10, BURKINA: 32, NIGER: 70, CEDEAO: 359, LIPTAKO: 488,
  FREEZE: 539, FREEZE_END: 599, DRIFT: 684,
  JNIM: 1886, EIGS: 1942, FRICTION: 1994, END: 2680,
} as const;

// ============================================================
// ACTE 1 FINAL — PULSE RÉGION-PRÉCISE AU NOMMAGE
//
// ⚠️ RETIMING V6 (2026-08-06) : le texte V5 nommait JNIM/EIGS en 2 PHRASES
// SÉPARÉES ("Le premier s'appelle le JNIM...Le second s'appelle l'EIGS"),
// laissant 329f/11s entre A1.JNIM et A1.EIGS pour dérouler les 4 pulses en
// séquence (jnim-mali -> jnim-bfa -> eigs-3f -> eigs-niger). Le texte V6 dit
// "l'une liée à Al-Qaïda, l'autre à Daech" en UNE SEULE phrase rapide (56f/1.9s
// entre A1.JNIM=1886 et A1.EIGS=1942) -- le séquencement V5 chevaucherait.
// Décision Aziz (2026-08-06) : FUSIONNER en 2 pulses SIMULTANÉS par faction
// (jnim-mali + jnim-bfa ensemble sur "Al-Qaïda", eigs-3f + eigs-niger ensemble
// sur "Daech") au lieu de 4 pulses séquentiels -- respecte le nouveau rythme.
// ============================================================
export type RegionPulse = { key: string; faction: "jnim" | "eigs"; trigger: number; dur: number; regions: string[] };

export const A1_REGION_PULSES: RegionPulse[] = [
  { key: "jnim-mali", faction: "jnim", trigger: 1886, dur: 80, regions: ["Mopti", "Ségou"] },
  { key: "jnim-bfa", faction: "jnim", trigger: 1886, dur: 90, regions: ["Sahel", "Nord", "Centre-Nord"] },
  { key: "eigs-3f", faction: "eigs", trigger: 1942, dur: 80, regions: ["Ménaka", "Tillabéri"] },
  { key: "eigs-niger", faction: "eigs", trigger: 1942, dur: 85, regions: ["Tillabéri", "Tahoua"] },
];

// B1 V3 — ACTE 2 pulses de régions
export const ACTE2_REGION_PULSES: RegionPulse[] = [
  { key: "a2-mali", faction: "jnim", trigger: 2613, dur: 90, regions: ["Gao", "Kidal", "Tombouctou", "Mopti"] },
  { key: "a2-niger", faction: "eigs", trigger: 3575, dur: 110, regions: ["Tillabéri", "Tahoua", "Agadez"] },
];

// ============================================================
// TRIGGERS AUDIO V6 (retiming 2026-08-06, voir bloc A1 ci-dessus pour le detail
// du texte). F_JNIM_ZONE = doublon historique de A1.JNIM, alignes ensemble.
// F_BURKINA/F_NIGER (Acte1, apparition label Ouagadougou) : AUCUNE ville n'est
// nommee dans le hook V6 -- fallback proportionnel (ratio A1.END 2680/2096=1.28
// applique aux anciennes valeurs), pas une mesure texte. F_NIGER semble inutilise
// dans le moteur (aucun usage trouve hors CITY_SCHEDULE indirect) -- garde par
// coherence, a verifier si mort au prochain nettoyage.
// F_AES_NEE..F_SAHELIENS : zone Partie2/3/4, mesures via aes-v6-actes234
// (offset absolu +3196, coherent avec Partie2Blocage.tsx/Partie3Rupture.tsx).
// ============================================================
export const F_JNIM_ZONE     = 1886; // = A1.JNIM (etait 1132, doublon historique)
export const F_BURKINA       = 1758; // fallback proportionnel (etait 1375, pas de mot-ancre V6)
export const F_NIGER         = 2161; // fallback proportionnel (etait 1690, pas de mot-ancre V6, semble inutilise)
export const F_AES_NEE       = 8070; // "testee" (etait 7014, +1056f/+35.2s -- meme mot-ancre que F_EPREUVE de Partie3Rupture.tsx)
export const F_KIDAL_ALONE   = 8203; // "Kidal." isole (etait 7279, +924f/+30.8s -- meme mot-ancre que F_KIDAL de Partie3Rupture.tsx)
export const F_KIDAL_FLAG    = 9222; // "FLOTTE" (etait 8683, +539f/+18.0s -- meme mot-ancre que F_FLOTTE de Partie3Rupture.tsx)
export const F_REF_DJIBO     = 11135; // "Djibo" (etait 10294, +841f/+28.0s -- meme mot-ancre que F_DJIBO de Partie4Cout.tsx)
export const F_REF_MENAKA    = 11159; // "Menaka" (etait 10349, +810f/+27.0s -- meme mot-ancre que F_MENAKA de Partie4Cout.tsx)
export const F_REF_TILLABERI = 11189; // "Tillaberi" (etait 10783, +406f/+13.5s -- meme mot-ancre que F_TILLABERI de Partie4Cout.tsx)
export const F_ICON_OR       = 12637; // "l'or" (etait 11032, +1605f/+53.5s -- mesure isolement, distinct de F_ICON_PETRO)
export const F_ICON_PETRO    = 12784; // "petrole" (etait 11122, +1662f/+55.4s -- meme mot-ancre que F_PETROLE de Partie4Cout.tsx)
export const F_SAHELIENS     = 14528; // "echoue" proxy (etait 12183, +2345f/+78.2s -- pas de mot "sahéliens" isole trouve, proxy zone perspective finale, cf F_REUSSIR de Partie4Cout.tsx)

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
// TRIGGERS HOOK — Acte 1 V6 (retiming 2026-08-06, memes valeurs que le bloc A1
// ci-dessus -- F_HOOK_* est le jeu REELLEMENT consomme par le moteur, cf usages).
// ============================================================
export const F_HOOK_MALI     = 10;
export const F_HOOK_BURKINA  = 32;
export const F_HOOK_NIGER    = 70;
export const F_HOOK_CEDEAO   = 359;
export const F_HOOK_LIPTAKO  = 488;
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
