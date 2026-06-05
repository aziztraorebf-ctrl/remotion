/**
 * warmapVehicles — couche vehicules top-down pour SudanWarMapFlat (Etape B).
 *
 * Variante "PRESENTS" : plusieurs vehicules par faction defilent le long du
 * front. Chaque vehicule a un chemin geo (lon/lat) parametré par tGlobal :
 * il AVANCE vers l'est quand le RSF progresse (2023) et RECULE vers l'ouest
 * quand l'armee reprend (2025), ou inversement pour les blindes SAF.
 *
 * On NE fait PAS tourner le sprite (iso 3/4 view -> rotation laide). Le sens
 * du mouvement est porté par la translation + une legere trainee.
 *
 * geo-path = liste de [lon, lat] aux fractions tGlobal 0..1 (interpolees).
 */

export type Vehicle = {
  id: string;
  faction: "saf" | "rsf";
  sprite: "tank-td-blue" | "tech-td-red";
  kind: "tank" | "technical"; // symbole SVG top-down
  size: number;             // px a l'ecran (echelle de base)
  // chemin : couples (t, lon, lat). t = fraction tGlobal.
  path: { t: number; lon: number; lat: number }[];
  delay?: number;           // apparition decalee (frames)
};

// Front approximatif (autour de Khartoum / axe centre). Les chars SAF poussent
// depuis l'est (Port-Soudan / Atbara) vers Khartoum puis l'ouest. Les technicals
// RSF tiennent l'ouest (Darfour/Kordofan) et poussent vers l'est en 2023.

export const VEHICLES: Vehicle[] = [
  // --- RSF : poussee vers l'est 2023, repli ouest 2025 ---
  {
    id: "rsf-1", faction: "rsf", sprite: "tech-td-red", kind: "technical", size: 58,
    path: [
      { t: 0.0, lon: 27.0, lat: 14.6 },  // depart Kordofan
      { t: 0.4, lon: 31.8, lat: 14.9 },  // apogee : pres de Khartoum/Gezira
      { t: 0.7, lon: 29.0, lat: 14.2 },  // repli
      { t: 1.0, lon: 25.6, lat: 13.6 },  // Darfour (El Fasher)
    ],
  },
  {
    id: "rsf-2", faction: "rsf", sprite: "tech-td-red", kind: "technical", size: 50,
    path: [
      { t: 0.0, lon: 25.5, lat: 12.4 },
      { t: 0.4, lon: 30.5, lat: 13.8 },
      { t: 0.7, lon: 27.5, lat: 12.9 },
      { t: 1.0, lon: 24.9, lat: 12.2 },
    ],
    delay: 14,
  },
  {
    id: "rsf-3", faction: "rsf", sprite: "tech-td-red", kind: "technical", size: 46,
    path: [
      { t: 0.0, lon: 26.2, lat: 15.8 },
      { t: 0.4, lon: 30.0, lat: 15.6 },
      { t: 0.7, lon: 27.8, lat: 15.0 },
      { t: 1.0, lon: 25.2, lat: 14.6 },
    ],
    delay: 26,
  },
  // --- SAF : contre-attaque depuis l'est, reprend le centre 2024-2025 ---
  {
    id: "saf-1", faction: "saf", sprite: "tank-td-blue", kind: "tank", size: 58,
    path: [
      { t: 0.0, lon: 35.2, lat: 16.2 },  // est (Atbara/River Nile)
      { t: 0.4, lon: 34.0, lat: 15.8 },  // tient l'est pendant apogee RSF
      { t: 0.7, lon: 32.4, lat: 15.5 },  // reprend Khartoum
      { t: 1.0, lon: 30.2, lat: 14.8 },  // pousse vers le centre
    ],
  },
  {
    id: "saf-2", faction: "saf", sprite: "tank-td-blue", kind: "tank", size: 50,
    path: [
      { t: 0.0, lon: 36.0, lat: 17.4 },
      { t: 0.4, lon: 34.6, lat: 16.6 },
      { t: 0.7, lon: 33.2, lat: 14.4 },  // axe Gezira/Wad Madani
      { t: 1.0, lon: 31.4, lat: 13.9 },
    ],
    delay: 18,
  },
  {
    id: "saf-3", faction: "saf", sprite: "tank-td-blue", kind: "tank", size: 46,
    path: [
      { t: 0.0, lon: 34.4, lat: 14.2 },
      { t: 0.4, lon: 33.6, lat: 14.0 },
      { t: 0.7, lon: 32.0, lat: 15.2 },
      { t: 1.0, lon: 30.6, lat: 15.4 },
    ],
    delay: 32,
  },
];

// ---------------------------------------------------------------------------
// REFUGIES — jetons-visage qui SE DEPLACENT sur la carte (regle Aziz : tout sur
// la carte). Fuient les zones de conflit (Khartoum, Darfour) vers les frontieres
// (est / Tchad a l'ouest). Apparaissent apres l'overlay "deplaces".
// ---------------------------------------------------------------------------
export type Refugee = {
  id: string;
  portrait: "portrait-civil";
  size: number;
  appearT: number; // fraction tGlobal d'apparition
  path: { t: number; lon: number; lat: number }[];
};

export const REFUGEES: Refugee[] = [
  // depuis Khartoum vers l'est (Gedaref/frontiere) — la grande fuite
  {
    id: "ref-1", portrait: "portrait-civil", size: 56, appearT: 0.34,
    path: [
      { t: 0.34, lon: 32.5, lat: 15.4 },
      { t: 0.6, lon: 34.4, lat: 14.6 },
      { t: 1.0, lon: 36.0, lat: 14.2 },  // vers Gedaref/Kassala
    ],
  },
  // depuis le Darfour vers l'ouest (Tchad)
  {
    id: "ref-2", portrait: "portrait-civil", size: 50, appearT: 0.4,
    path: [
      { t: 0.4, lon: 25.3, lat: 13.6 },
      { t: 0.7, lon: 23.4, lat: 13.3 },
      { t: 1.0, lon: 21.9, lat: 13.0 },  // frontiere tchadienne
    ],
  },
  // depuis Gezira vers le sud-est
  {
    id: "ref-3", portrait: "portrait-civil", size: 46, appearT: 0.46,
    path: [
      { t: 0.46, lon: 33.4, lat: 14.3 },
      { t: 0.75, lon: 34.6, lat: 13.6 },
      { t: 1.0, lon: 35.4, lat: 13.2 },
    ],
  },
];

export const refugeePos = (r: Refugee, t: number): [number, number] => {
  const p = r.path;
  const x = Math.max(0, Math.min(1, t));
  if (x <= p[0].t) return [p[0].lon, p[0].lat];
  if (x >= p[p.length - 1].t) return [p[p.length - 1].lon, p[p.length - 1].lat];
  for (let i = 0; i < p.length - 1; i++) {
    if (x >= p[i].t && x <= p[i + 1].t) {
      const f = (x - p[i].t) / (p[i + 1].t - p[i].t);
      return [p[i].lon + (p[i + 1].lon - p[i].lon) * f, p[i].lat + (p[i + 1].lat - p[i].lat) * f];
    }
  }
  return [p[p.length - 1].lon, p[p.length - 1].lat];
};

// interpole [lon,lat] d'un vehicule a une fraction t
export const vehiclePos = (v: Vehicle, t: number): [number, number] => {
  const p = v.path;
  const x = Math.max(0, Math.min(1, t));
  if (x <= p[0].t) return [p[0].lon, p[0].lat];
  if (x >= p[p.length - 1].t) return [p[p.length - 1].lon, p[p.length - 1].lat];
  for (let i = 0; i < p.length - 1; i++) {
    if (x >= p[i].t && x <= p[i + 1].t) {
      const f = (x - p[i].t) / (p[i + 1].t - p[i].t);
      return [p[i].lon + (p[i + 1].lon - p[i].lon) * f, p[i].lat + (p[i + 1].lat - p[i].lat) * f];
    }
  }
  return [p[p.length - 1].lon, p[p.length - 1].lat];
};
