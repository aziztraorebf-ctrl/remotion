/**
 * SahelCameras.ts — Caméras et données de navigation pour SahelWarMapEngine.
 *
 * Contenu : type CamKey, tous les tableaux de keyframes (SAHEL_CAM_KEYS, ACTE1_CAM_KEYS,
 * PARTIE1..4_CAM_KEYS, PROTO24_CAM_KEYS, ACTE2_CAM_KEYS), toutes les fonctions getXxxCam,
 * acte1BeatName, B1A, type Acte2Base, ACTE2_BASES, B1_FR_TOKEN, B1_CONVOY, B1_ARLIT_LABEL,
 * B1_MINE_ARLIT, B1_BASES_RELAY.
 *
 * Fonctions pures uniquement — pas de hook React, pas de closure sur état composant.
 * getPartie4Cam utilise interpolate (remotion) pour le driftAmp.
 */

import { interpolate } from "remotion";

export type CamKey = { f: number; lon: number; lat: number; zoom: number };

// ZOOM UNIFORME niveau hook (~4.75, décision Aziz 2026-06-07)
export const SAHEL_CAM_KEYS: CamKey[] = [
  { f: 0,     lon: -0.5, lat: 14.8, zoom: 4.75 },
  { f: 502,   lon: -0.5, lat: 14.8, zoom: 4.78 },
  { f: 572,   lon: -0.5, lat: 14.7, zoom: 4.8 },
  { f: 632,   lon: -0.5, lat: 14.7, zoom: 4.8 },
  { f: 900,   lon: -1.0, lat: 15.0, zoom: 4.75 },
  { f: 2167,  lon: -0.5, lat: 15.2, zoom: 4.78 },
  { f: 2630,  lon: 0.0,  lat: 15.8, zoom: 4.7 },
  { f: 4032,  lon: 0.3,  lat: 15.6, zoom: 4.72 },
  { f: 6322,  lon: -0.3, lat: 15.0, zoom: 4.75 },
  { f: 7014,  lon: -0.3, lat: 14.9, zoom: 4.75 },
  { f: 7279,  lon: 0.6,  lat: 16.2, zoom: 4.75 },
  { f: 8218,  lon: 0.8,  lat: 16.6, zoom: 4.8 },
  { f: 8683,  lon: 0.9,  lat: 16.8, zoom: 4.82 },
  { f: 9477,  lon: 0.85, lat: 16.6, zoom: 4.8 },
  { f: 10294, lon: 0.0,  lat: 15.0, zoom: 4.72 },
  { f: 11122, lon: 1.0,  lat: 15.0, zoom: 4.7 },
  { f: 12183, lon: -0.5, lat: 15.2, zoom: 4.68 },
  { f: 13150, lon: -0.5, lat: 15.5, zoom: 4.65 },
];

// ACTE 1 — TRACK CAMÉRA DÉDIÉ (RECALÉ V5 2026-06-15)
export const ACTE1_CAM_KEYS: CamKey[] = [
  { f: 0,    lon: -1.2, lat: 15.2, zoom: 4.62 },
  { f: 145,  lon: -2.0, lat: 14.6, zoom: 4.78 },
  { f: 217,  lon: -0.8, lat: 14.8, zoom: 4.74 },
  { f: 286,  lon:  0.6, lat: 15.2, zoom: 4.70 },
  { f: 361,  lon: -0.4, lat: 15.0, zoom: 4.55 },
  { f: 477,  lon: -0.4, lat: 14.7, zoom: 4.74 },
  { f: 539,  lon: -0.4, lat: 14.6, zoom: 4.78 },
  { f: 599,  lon: -0.4, lat: 14.6, zoom: 4.78 },
  { f: 684,  lon: -0.6, lat: 14.9, zoom: 4.70 },
  { f: 900,  lon: -0.85, lat: 15.05, zoom: 4.95 },
  { f: 1132, lon: -0.95, lat: 15.1,  zoom: 5.30 },
  { f: 1320, lon: -0.75, lat: 15.15, zoom: 5.32 },
  { f: 1420, lon: -0.2,  lat: 15.1,  zoom: 5.20 },
  { f: 1461, lon:  0.45, lat: 15.05, zoom: 5.28 },
  { f: 1700, lon:  0.15, lat: 15.05, zoom: 5.25 },
  { f: 1840, lon: -0.15, lat: 15.05, zoom: 5.18 },
  { f: 2096, lon: -0.15, lat: 15.05, zoom: 5.18 },
];

export const getActe1Cam = (frame: number): { lon: number; lat: number; zoom: number } => {
  const keys = ACTE1_CAM_KEYS;
  if (frame <= keys[0].f) return keys[0];
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

// Nom du beat courant (HUD debug du track caméra seul)
export const acte1BeatName = (frame: number): string => {
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

// PARTIE 1 (V5) — caméra Pull Back corridor Libye→Mali
export const PARTIE1_CAM_KEYS: CamKey[] = [
  { f: 2102, lon: -0.15, lat: 15.05, zoom: 5.18 },
  { f: 2200, lon:  3.5,  lat: 19.8,  zoom: 4.05 },
  { f: 2300, lon:  6.0,  lat: 21.5,  zoom: 3.75 },
  { f: 2520, lon:  4.5,  lat: 20.0,  zoom: 3.85 },
  { f: 2640, lon:  1.0,  lat: 17.6,  zoom: 4.55 },
  { f: 2743, lon: -0.6,  lat: 15.6,  zoom: 4.95 },
  { f: 2940, lon: -0.6,  lat: 15.3,  zoom: 5.05 },
];

export const getPartie1Cam = (frame: number): { lon: number; lat: number; zoom: number } => {
  if (frame <= PARTIE1_CAM_KEYS[0].f) return getActe1Cam(frame);
  const keys = PARTIE1_CAM_KEYS;
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

// PARTIE 2 (V5) — "Le Blocage" (refonte premium 2026-06-11, zoom ~5.6-6.4)
export const PARTIE2_CAM_KEYS: CamKey[] = [
  { f: 2940, lon: -0.6,  lat: 15.3,  zoom: 5.05 },
  { f: 3196, lon:  0.6,  lat: 16.9,  zoom: 5.70 },
  { f: 3443, lon:  1.5,  lat: 14.2,  zoom: 3.70 },
  { f: 3640, lon:  1.5,  lat: 14.2,  zoom: 3.70 },
  { f: 3700, lon:  0.0,  lat: 17.2,  zoom: 5.55 },
  { f: 3887, lon:  0.30, lat: 16.60, zoom: 6.00 },
  { f: 3980, lon:  0.05, lat: 16.35, zoom: 6.35 },
  { f: 4050, lon:  1.20, lat: 16.10, zoom: 6.20 },
  { f: 4110, lon:  1.20, lat: 18.20, zoom: 5.95 },
  { f: 4200, lon:  0.80, lat: 17.40, zoom: 5.70 },
  { f: 4421, lon: -1.20, lat: 15.60, zoom: 5.55 },
  { f: 4955, lon: -1.50, lat: 12.40, zoom: 4.80 },
  // Niger/CEDEAO (f5380-6118) — RE-ÉLARGI (2026-07-04, retour Aziz précisé après un 1er resserrement) :
  // la menace CEDEAO a une vraie géographie (pays côtiers CI/Ghana/Bénin/Nigeria) qui doit être visible
  // pour porter le pulse+flèches vers Niamey — le zoom serré (5.20-5.30, session précédente ce jour)
  // ne montrait aucun de ces pays. Centre décalé sud pour cadrer golfe de Guinée + Niger ensemble.
  { f: 5380, lon:  2.50, lat: 11.20, zoom: 4.35 },
  { f: 5520, lon:  2.30, lat: 10.80, zoom: 4.30 },
  { f: 5640, lon:  2.20, lat: 10.60, zoom: 4.28 },
];

export const getPartie2Cam = (frame: number): { lon: number; lat: number; zoom: number } => {
  if (frame <= PARTIE2_CAM_KEYS[0].f) return getActe1Cam(frame);
  const keys = PARTIE2_CAM_KEYS;
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

// PARTIE 3 — "La Rupture" (caméra SUIVEUSE, refonte Aziz 2026-06-12)
export const PARTIE3_CAM_KEYS: CamKey[] = [
  { f: 6118, lon: 1.40, lat: 14.20, zoom: 4.55 },
  { f: 6400, lon: 0.50, lat: 14.40, zoom: 4.55 },
  { f: 6616, lon: 0.55, lat: 14.45, zoom: 4.60 },
  { f: 6760, lon: 0.55, lat: 14.45, zoom: 4.62 },
  { f: 6980, lon: 1.30, lat: 17.20, zoom: 5.55 },
  { f: 7083, lon: 1.44, lat: 18.43, zoom: 6.35 },
  { f: 7319, lon: 1.44, lat: 18.30, zoom: 6.10 },
  { f: 7720, lon: 0.30, lat: 16.60, zoom: 6.10 },
  { f: 7950, lon: 0.85, lat: 17.45, zoom: 6.20 },
  { f: 8132, lon: 1.44, lat: 18.43, zoom: 6.45 },
  { f: 8320, lon: 1.44, lat: 18.43, zoom: 6.45 },
  { f: 8580, lon: -3.95, lat: 14.92, zoom: 6.00 },
  { f: 8900, lon: -3.95, lat: 14.92, zoom: 6.05 },
  { f: 9121, lon: 0.50, lat: 13.60, zoom: 5.85 },
  { f: 9280, lon: 0.30, lat: 13.70, zoom: 5.75 },
  { f: 9372, lon: 0.30, lat: 13.90, zoom: 5.55 },
  { f: 9410, lon: 0.30, lat: 13.95, zoom: 5.50 },
];

export const getPartie3Cam = (frame: number): { lon: number; lat: number; zoom: number } => {
  const driftLon = Math.sin(frame * 0.012) * 0.05;
  const driftLat = Math.cos(frame * 0.009) * 0.035;
  const withDrift = (c: { lon: number; lat: number; zoom: number }) => ({ lon: c.lon + driftLon, lat: c.lat + driftLat, zoom: c.zoom });
  if (frame <= PARTIE3_CAM_KEYS[0].f) return withDrift(PARTIE3_CAM_KEYS[0]);
  const keys = PARTIE3_CAM_KEYS;
  if (frame >= keys[keys.length - 1].f) return withDrift(keys[keys.length - 1]);
  for (let i = 0; i < keys.length - 1; i++) {
    if (frame >= keys[i].f && frame <= keys[i + 1].f) {
      const a = keys[i], b = keys[i + 1];
      const t = (frame - a.f) / (b.f - a.f);
      const e = t * t * (3 - 2 * t);
      return withDrift({
        lon: a.lon + (b.lon - a.lon) * e,
        lat: a.lat + (b.lat - a.lat) * e,
        zoom: a.zoom + (b.zoom - a.zoom) * e,
      });
    }
  }
  return withDrift(keys[keys.length - 1]);
};

// PARTIE 4 — Le Coût, le Levier, la Perspective (conclusion)
export const PARTIE4_CAM_KEYS: CamKey[] = [
  { f: 9416, lon: 0.50, lat: 14.55, zoom: 5.70 },
  { f: 9700, lon: 0.55, lat: 14.70, zoom: 5.78 },
  { f: 9850, lon: 0.65, lat: 14.85, zoom: 5.78 },
  { f: 10047, lon: 0.60, lat: 14.78, zoom: 5.72 },
  { f: 10594, lon: -2.0, lat: 13.6, zoom: 5.05 },
  { f: 10667, lon: -6.5, lat: 13.4, zoom: 6.2 },
  { f: 10729, lon: -1.7, lat: 12.9, zoom: 6.2 },
  { f: 10804, lon: 2.0, lat: 14.6, zoom: 6.0 },
  { f: 11080, lon: 2.0, lat: 14.6, zoom: 5.9 },
  { f: 11200, lon: -0.5, lat: 14.2, zoom: 4.95 },
  { f: 11449, lon: -0.9, lat: 14.4, zoom: 5.05 },
  { f: 11613, lon: -0.6, lat: 14.2, zoom: 5.20 },
  { f: 11760, lon: -0.6, lat: 14.2, zoom: 5.18 },
  { f: 11869, lon: -0.8, lat: 14.3, zoom: 4.95 },
  { f: 12297, lon: -0.8, lat: 14.3, zoom: 4.80 },
  { f: 12520, lon: -0.8, lat: 14.4, zoom: 4.85 },
  { f: 12640, lon: -1.4, lat: 13.9, zoom: 5.15 },
  { f: 12760, lon: -0.6, lat: 14.0, zoom: 5.15 },
  { f: 12880, lon: -0.4, lat: 14.4, zoom: 5.05 },
  { f: 13030, lon: 0.2, lat: 14.5, zoom: 4.95 },
  { f: 13082, lon: 0.2, lat: 14.5, zoom: 4.95 },
  { f: 13290, lon: 0.0, lat: 14.6, zoom: 4.90 },
  { f: 13500, lon: 0.0, lat: 14.6, zoom: 4.90 },
];

export const getPartie4Cam = (frame: number): { lon: number; lat: number; zoom: number } => {
  const driftAmp = interpolate(frame, [12200, 12640], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const driftLon = Math.sin(frame * 0.011) * 0.05 * driftAmp;
  const driftLat = Math.cos(frame * 0.009) * 0.035 * driftAmp;
  const withDrift = (c: { lon: number; lat: number; zoom: number }) => ({ lon: c.lon + driftLon, lat: c.lat + driftLat, zoom: c.zoom });
  const keys = PARTIE4_CAM_KEYS;
  if (frame <= keys[0].f) return withDrift(keys[0]);
  if (frame >= keys[keys.length - 1].f) return withDrift(keys[keys.length - 1]);
  for (let i = 0; i < keys.length - 1; i++) {
    if (frame >= keys[i].f && frame <= keys[i + 1].f) {
      const a = keys[i], b = keys[i + 1];
      const t = (frame - a.f) / (b.f - a.f);
      const e = t * t * (3 - 2 * t);
      return withDrift({
        lon: a.lon + (b.lon - a.lon) * e,
        lat: a.lat + (b.lat - a.lat) * e,
        zoom: a.zoom + (b.zoom - a.zoom) * e,
      });
    }
  }
  return withDrift(keys[keys.length - 1]);
};

// PROTO 2.4 CAMÉRA — extinction des bases FR encerclées
export const PROTO24_CAM_KEYS: CamKey[] = [
  { f: 3887, lon: 0.30, lat: 16.60, zoom: 6.00 },
  { f: 3980, lon: 0.05, lat: 16.35, zoom: 6.35 },
  { f: 4050, lon: 1.20, lat: 16.10, zoom: 6.20 },
  { f: 4110, lon: 1.20, lat: 18.20, zoom: 5.95 },
  { f: 4160, lon: 0.80, lat: 17.60, zoom: 5.60 },
];

export const getProto24Cam = (frame: number): { lon: number; lat: number; zoom: number } => {
  const keys = PROTO24_CAM_KEYS;
  if (frame <= keys[0].f) return keys[0];
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

// ACTE 2 (B1 V3) — caméra Ken Burns permanent, jamais pull-back
export const ACTE2_CAM_KEYS: CamKey[] = [
  { f: 2299, lon: -0.15, lat: 15.05, zoom: 5.18 },
  { f: 2630, lon: -0.15, lat: 15.05, zoom: 5.18 },
  { f: 2678, lon: -0.10, lat: 15.55, zoom: 5.40 },
  { f: 2766, lon:  0.05, lat: 15.95, zoom: 5.45 },
  { f: 3127, lon: -1.30, lat: 14.90, zoom: 5.30 },
  { f: 3296, lon: -1.30, lat: 14.90, zoom: 5.55 },
  { f: 3320, lon: -1.30, lat: 14.90, zoom: 5.55 },
  { f: 3565, lon: -1.27, lat: 14.91, zoom: 5.56 },
  { f: 3610, lon: -1.27, lat: 14.91, zoom: 5.56 },
  { f: 3680, lon: -0.10, lat: 15.20, zoom: 5.28 },
  { f: 3700, lon:  4.20, lat: 16.95, zoom: 5.15 },
  { f: 3830, lon:  4.70, lat: 17.25, zoom: 5.15 },
  { f: 3891, lon:  4.70, lat: 17.25, zoom: 5.15 },
  { f: 4043, lon:  1.30, lat: 15.10, zoom: 4.60 },
  { f: 4124, lon:  1.30, lat: 15.05, zoom: 4.60 },
];

// ACTE 2 — triggers narration ABSOLUS (forced-align, recalé v2)
export const B1A = {
  MINUSMA: 3136, ARMES: 3296, ARLIT: 3689, URANIUM: 3829,
  GAO: 3989, MENAKA: 4014, NIAMEY: 4043, END: 4124,
} as const;

export type Acte2Base = { id: string; sprite: string; lon: number; lat: number; appear: number };

export const ACTE2_BASES: Acte2Base[] = [
  { id: "fr-gao",    sprite: "base-france", lon: -0.04, lat: 16.27, appear: B1A.GAO },
  { id: "fr-menaka", sprite: "base-france", lon:  2.40, lat: 15.92, appear: B1A.MENAKA },
  { id: "fr-niamey", sprite: "base-france", lon:  2.12, lat: 13.51, appear: B1A.NIAMEY },
];

// B1 V3 — ÉLÉMENTS MOBILES
export const B1_FR_TOKEN = {
  start: [-5.2, 16.6] as [number, number],
  end:   [-0.04, 16.27] as [number, number],
  fStart: 2687, fEnd: 2766,
};

export const B1_CONVOY = {
  start: [5.5, 17.6] as [number, number],
  end:   [4.7, 19.4] as [number, number],
  fStart: 3729, fEnd: 3851,
};

export const B1_ARLIT_LABEL = [5.5, 17.6] as [number, number];
export const B1_MINE_ARLIT  = [5.5, 17.6] as [number, number];

export const B1_BASES_RELAY: { lon: number; lat: number; appear: number; name: string }[] = [
  { lon: -0.04, lat: 16.27, appear: 3989, name: "Gao" },
  { lon:  2.40, lat: 15.92, appear: 4014, name: "Ménaka" },
  { lon:  2.12, lat: 13.51, appear: 4043, name: "Niamey" },
];

export const getActe2Cam = (frame: number): { lon: number; lat: number; zoom: number } => {
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

export const getSahelCam = (frame: number): { lon: number; lat: number; zoom: number } => {
  const keys = SAHEL_CAM_KEYS;
  if (frame <= keys[0].f) return keys[0];
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
