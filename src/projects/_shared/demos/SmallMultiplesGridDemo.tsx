/**
 * Demo SmallMultiplesGrid V2
 * 2 compositions : variante cream (A) + variante kraft (B)
 * Avatars Gemini generes : niger/mali/burkina portraits B&W
 */

import React from "react";
import { staticFile } from "remotion";
import { SmallMultiplesGrid } from "../components/inserts/SmallMultiplesGrid";

export const SMALL_MULTIPLES_GRID_DEMO_FRAMES = 180;

const NIGER_DATA   = [0.15, 0.22, 0.28, 0.45, 0.72, 0.85, 0.68, 0.52, 0.44, 0.38];
const MALI_DATA    = [0.55, 0.58, 0.62, 0.65, 0.50, 0.42, 0.71, 0.82, 0.78, 0.60];
const BURKINA_DATA = [0.20, 0.28, 0.33, 0.41, 0.52, 0.64, 0.73, 0.82, 0.90, 0.95];

const ITEMS = [
  {
    entity: "Niger",
    image: staticFile("_shared/flags-portraits/countries/niger-portrait.png"),
    data: NIGER_DATA,
    annotation: "Pic 2010",
    source: "World Bank, 2023",
  },
  {
    entity: "Mali",
    image: staticFile("_shared/flags-portraits/countries/mali-portrait.png"),
    data: MALI_DATA,
    annotation: "Chute 2014",
    source: "FMI, Art. IV 2023",
  },
  {
    entity: "Burkina",
    image: staticFile("_shared/flags-portraits/countries/burkina-portrait.png"),
    data: BURKINA_DATA,
    annotation: "+74% sur 10 ans",
    source: "BCEAO, 2023",
  },
];

const X_LABELS = ["1990", "2000", "2010", "2020"];

// Variante A — fond creme clair
export const SmallMultiplesGridDemoA: React.FC = () => (
  <SmallMultiplesGrid
    items={ITEMS}
    xLabels={X_LABELS}
    variant="cream"
  />
);

// Variante B — fond kraft affirme
export const SmallMultiplesGridDemoB: React.FC = () => (
  <SmallMultiplesGrid
    items={ITEMS}
    xLabels={X_LABELS}
    variant="kraft"
  />
);
