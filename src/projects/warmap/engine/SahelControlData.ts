/**
 * SahelControlData — donnees de controle territorial pour le War-Map Sahel AES.
 *
 * Source : sahel.warmap.json via l'adapter canonique.
 * Factions : etat (bleu), jnim (rouge), conteste (or).
 * 32 regions admin-1 : Mali (11) + Burkina Faso (13) + Niger (8).
 */
import sahelDataset from "../data/sahel.warmap.json";
import { canonicalToEngine } from "../data/adapter";
import type { WarMapDataset } from "../data/schema";

const _bundle = canonicalToEngine(sahelDataset as unknown as WarMapDataset);

export const SAHEL_STATES = _bundle.SUDAN_STATES;
export const SAHEL_CITIES = _bundle.CITIES;
export const SAHEL_JALONS = _bundle.JALONS;
export const SAHEL_VEHICLES = _bundle.VEHICLES;
export const SAHEL_REFUGEES = _bundle.REFUGEES;
export const sahelControlAt = _bundle.controlAt;
export const sahelJalonAt = _bundle.jalonAt;

// Palette Sahel — distincte de Sudan (parchemin commun, couleurs factions differentes)
export const SAHEL_COLORS = {
  land:      "#F5EFD6",   // parchemin clair
  ocean:     "#C8D9E0",   // eau douce-grise
  outline:   "#3A2A18",   // encre
  cream:     "#F5EFD6",
  ink:       "#2E1F0A",
  // factions
  etat:      "#3E6E9E",   // bleu forces gouvernementales (FAMa/FAN/FDS + Africa Corps)
  jnim:      "#B14B3C",   // rouge groupes armes (JNIM + EIGS)
  contested: "#C99A3A",   // or conteste / CSP
};
