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

// ---------------------------------------------------------------------------
// REFACTOR 2026-06-05 : la donnee provient desormais du SCHEMA CANONIQUE
// (src/projects/warmap/data/sudan.warmap.json) via l'adapter. SUDAN_STATES,
// JALONS, controlAt, jalonAt, CITIES sont RE-EXPORTES depuis le bundle.
// Ce fichier ne garde QUE les couleurs (COLORS/ATLAS, presentation).
// Voir memory/doctrines/WARMAP-RESEARCH-PLAYBOOK.md.
// Le JALONS hand-authored historique est conserve plus bas en reference (_LEGACY).
// ---------------------------------------------------------------------------
import sudanDataset from "../../warmap/data/sudan.warmap.json";
import { canonicalToEngine } from "../../warmap/adapter";
import type { WarMapDataset } from "../../warmap/schema";

const _bundle = canonicalToEngine(sudanDataset as unknown as WarMapDataset);
export const SUDAN_STATES = _bundle.SUDAN_STATES;
export const CITIES = _bundle.CITIES;
export const JALONS = _bundle.JALONS;
export const controlAt = _bundle.controlAt;
export const jalonAt = _bundle.jalonAt;

// Helper : construit un control map en partant d'un defaut SAF et en listant les exceptions
const ctrl = (rsf: string[], contested: string[] = []): Record<string, ControlVal> => {
  const m: Record<string, ControlVal> = {};
  for (const s of SUDAN_STATES) m[s] = 1; // SAF par defaut
  for (const s of rsf) m[s] = 0;
  for (const s of contested) m[s] = 0.5;
  return m;
};

// _LEGACY : jalons hand-authored d'origine (reference, plus consommes par le moteur).
const _LEGACY_JALONS: Jalon[] = [
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

// controlAt / jalonAt sont re-exportes depuis le bundle (haut du fichier).
// Reference _LEGACY conservee pour audit : void _LEGACY_JALONS.
void _LEGACY_JALONS;
