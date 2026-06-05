/**
 * sudanControlData — serie temporelle du controle territorial (RSF vs SAF)
 * Guerre civile soudanaise 2023 -> 2026.
 *
 * Source narrative (recherche legere OSINT, 2026-06-05) :
 *   PolGeoNow, Wikipedia "Sudanese civil war (2023-present)", ACLED, EUAA.
 *   Niveau de granularite = etat (admin-1), comme les trackers OSINT presentent
 *   le Soudan. Les valeurs sont ESTIMEES ("in a nutshell"), conformes a la
 *   convention du genre (disclaimer obligatoire).
 *
 * control: 1 = SAF (armee, bleu)  |  0 = RSF (paramilitaire, rouge)  |  0.5 = conteste
 * On interpole lineairement entre jalons -> le polygone "change de camp" en
 * fondu de couleur, ce qui donne le sentiment du front qui avance jour par jour.
 *
 * 17 etats Natural Earth (noms exacts du geojson sudan-states.geojson).
 */

export type ControlVal = number; // 0..1

export type Jalon = {
  date: string;          // YYYY.MM.DD affiche
  label: string;         // evenement-cle (sous-titre bas de cadre)
  control: Record<string, ControlVal>;
  // pertes cumulees estimees (compteur Casualties) — ESTIME, ordre de grandeur
  casualties: number;
};

// Etats (cle = name du geojson)
export const SUDAN_STATES = [
  "Northern", "River Nile", "Red Sea", "Kassala", "Gedarif",
  "Khartoum", "Gezira", "White Nile", "Blue Nile", "Sennar",
  "North Kordufan", "South Kordufan",
  "North Darfur", "Western Darfur", "Central Darfur", "Southern Darfur", "Eastern Darfur",
] as const;

// Helper : construit un control map en partant d'un defaut SAF et en listant les exceptions
const ctrl = (rsf: string[], contested: string[] = []): Record<string, ControlVal> => {
  const m: Record<string, ControlVal> = {};
  for (const s of SUDAN_STATES) m[s] = 1; // SAF par defaut
  for (const s of rsf) m[s] = 0;
  for (const s of contested) m[s] = 0.5;
  return m;
};

export const JALONS: Jalon[] = [
  {
    // Avant-guerre : tout "neutre" -> on demarre SAF-tenu nominal
    date: "2023.04.15",
    label: "La guerre eclate — Khartoum bascule dans la bataille",
    control: ctrl([], ["Khartoum"]),
    casualties: 0,
  },
  {
    // Ete 2023 : RSF tient Khartoum + balaye le Darfour
    date: "2023.08.01",
    label: "Le RSF s'empare de Khartoum et du Darfour",
    control: ctrl(
      ["Khartoum", "North Darfur", "Western Darfur", "Central Darfur", "Southern Darfur", "Eastern Darfur"],
      ["North Kordufan", "South Kordufan"]
    ),
    casualties: 5200,
  },
  {
    // Dec 2023 : apogee RSF — prise de Wad Madani (Gezira)
    date: "2023.12.18",
    label: "Apogee du RSF — chute de Wad Madani",
    control: ctrl(
      ["Khartoum", "Gezira", "North Darfur", "Western Darfur", "Central Darfur", "Southern Darfur", "Eastern Darfur", "South Kordufan"],
      ["North Kordufan", "Sennar", "White Nile"]
    ),
    casualties: 13400,
  },
  {
    // 2024 : SAF contre-attaque, reprend Sennar/White Nile, conteste Khartoum
    date: "2024.10.01",
    label: "L'armee contre-attaque depuis l'est",
    control: ctrl(
      ["Khartoum", "Gezira", "North Darfur", "Western Darfur", "Central Darfur", "Southern Darfur", "Eastern Darfur"],
      ["Khartoum", "North Kordufan", "South Kordufan"]
    ),
    casualties: 22600,
  },
  {
    // Jan-Mars 2025 : SAF reprend Wad Madani puis Khartoum
    date: "2025.03.26",
    label: "L'armee reprend Wad Madani puis Khartoum",
    control: ctrl(
      ["North Darfur", "Western Darfur", "Central Darfur", "Southern Darfur", "Eastern Darfur"],
      ["North Kordufan", "South Kordufan"]
    ),
    casualties: 31200,
  },
  {
    // 2025-2026 : partition de fait — El Fasher tombe, RSF tient tout le Darfour
    date: "2026.05.01",
    label: "Partition de fait — l'ouest au RSF, l'est a l'armee",
    control: ctrl(
      ["North Darfur", "Western Darfur", "Central Darfur", "Southern Darfur", "Eastern Darfur"],
      ["South Kordufan", "North Kordufan"]
    ),
    casualties: 41000,
  },
];

// Villes-cle pour les marqueurs flottants (lon, lat)
export const CITIES: { name: string; lon: number; lat: number }[] = [
  { name: "Khartoum", lon: 32.53, lat: 15.50 },
  { name: "Port-Soudan", lon: 37.22, lat: 19.62 },
  { name: "El Fasher", lon: 25.35, lat: 13.63 },
  { name: "Nyala", lon: 24.88, lat: 12.05 },
  { name: "Wad Madani", lon: 33.52, lat: 14.40 },
];

export const COLORS = {
  saf: "#2f6db5",      // bleu armee
  rsf: "#c0392b",      // rouge paramilitaire
  contested: "#b8860b",// or terne (zone disputee)
  safGlow: "#5fa8e8",
  rsfGlow: "#e8745f",
};

// Palette PARCHEMIN ATLAS (Mansa Moussa / Ghana) — validee Aziz 2026-06-05
// Le fond se tait, la donnee parle. Flat top-down, zero satellite.
export const ATLAS = {
  ocean:     "#3A5A7E",  // ocean bleu sourd
  land:      "#F2E5C8",  // cream parchemin (terres neutres)
  cream:     "#F2E5C8",  // plaque
  ink:       "#3A2A18",  // encre (texte sur cream)
  outline:   "#1A1A1A",  // outline noir mat
  gold:      "#D4A574",  // or empire (accents)
  terracotta:"#C97D5A",
  // factions reskin parchemin : on garde rouge/bleu mais legerement desatures
  saf:       "#3E6E9E",  // bleu armee, ton parchemin
  rsf:       "#B14B3C",  // rouge brique RSF
  contested: "#C99A3A",  // or conteste
} as const;

// Interpole la valeur de controle d'un etat a une date-fraction globale (0..1)
export const controlAt = (state: string, tGlobal: number): ControlVal => {
  const n = JALONS.length;
  const x = Math.max(0, Math.min(1, tGlobal)) * (n - 1);
  const i = Math.floor(x);
  const f = x - i;
  if (i >= n - 1) return JALONS[n - 1].control[state] ?? 1;
  const a = JALONS[i].control[state] ?? 1;
  const b = JALONS[i + 1].control[state] ?? 1;
  return a + (b - a) * f;
};

// Renvoie l'index de jalon courant + fraction, pour date/label/casualties
export const jalonAt = (tGlobal: number) => {
  const n = JALONS.length;
  const x = Math.max(0, Math.min(1, tGlobal)) * (n - 1);
  const i = Math.min(n - 1, Math.floor(x));
  const f = x - Math.floor(x);
  return { i, f, jalon: JALONS[i] };
};
