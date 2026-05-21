/**
 * ComparisonTable V2 Demo — Niger uranium 1970 vs 2025 (eres)
 *
 * Style "dossier" Souverain : fond bleu nuit + decor points + verdict + source.
 * Demontre kind="era" + verdict + 4 backgrounds disponibles.
 */

import React from "react";
import {
  ComparisonTable,
  UraniumIcon,
  MoneyIcon,
  PercentIcon,
  PeopleGroupIcon,
} from "../components/inserts/ComparisonTable";

export const COMPARISON_TABLE_DEMO_FRAMES = 220;

export const ComparisonTableDemo: React.FC = () => (
  <ComparisonTable
    background="dossier"
    title="Niger Uranium"
    subtitle="ce que la France a paye"
    colA={{
      label: "1970-1999",
      color: "#9aa0a8",
      subLabel: "monopole COGEMA",
      kind: "era",
    }}
    colB={{
      label: "2000-2024",
      color: "#e8b840",
      subLabel: "concurrence chine",
      kind: "era",
    }}
    rows={[
      {
        icon: <UraniumIcon size={140} color="#e6e9f0" />,
        label: "PART MONDIALE\nNIGER",
        valueA: "8%",
        valueB: "4%",
      },
      {
        icon: <MoneyIcon size={140} color="#e6e9f0" />,
        label: "PRIX MOYEN\n$ / kg",
        valueA: "23",
        valueB: "147",
      },
      {
        icon: <PercentIcon size={140} color="#e6e9f0" />,
        label: "ROYALTIES\nVERSEES NIGER",
        valueA: "5,5%",
        valueB: "12%",
      },
    ]}
    verdict="6x le prix · 2x les royalties"
    source="World Nuclear Association 2024, EITI Niger"
    underlineStyle="slab"
  />
);
