/**
 * EntityDiagram V2 Demo — Niger uranium (Areva/Orano + Cominak/Somair + Etat Niger)
 *
 * Style "dossier d'enquete Souverain" : fond bleu nuit, grain papier,
 * tampon DOSSIER, edges typees (direct/suspecte/declare).
 */

import React from "react";
import {
  EntityDiagram,
  FactoryIcon,
  FlagIcon,
  CrownIcon,
  BankIcon,
} from "../components/inserts/EntityDiagram";

export const ENTITY_DIAGRAM_DEMO_FRAMES = 200;

export const EntityDiagramDemo: React.FC = () => (
  <EntityDiagram
    background="dossier"
    accentColor="#e8b840"
    dossierNumber="N°2024-NER-07"
    dossierDate="2024-09-14"
    title="Uranium d'Arlit"
    subtitle="qui possede quoi"
    source="EITI Niger 2023, Areva archives 2014"
    nodes={[
      {
        id: "orano",
        x: 200,
        y: 1280,
        label: "ORANO",
        subtitle: "ex-Areva",
        osintMeta: "Paris · 86%",
        icon: <BankIcon color="#5b9bb5" w={200} />,
        color: "#5b9bb5",
      },
      {
        id: "cominak",
        x: 540,
        y: 1280,
        label: "SOMAIR/COMINAK",
        subtitle: "Mines Arlit",
        osintMeta: "16°N · 7°E",
        icon: <FactoryIcon color="#e8b840" w={200} />,
        color: "#e8b840",
        pivot: true,
      },
      {
        id: "niger",
        x: 880,
        y: 1280,
        label: "ETAT NIGER",
        subtitle: "actionnaire",
        osintMeta: "14% · SOPAMIN",
        icon: <FlagIcon color="#c45a4a" w={200} />,
        color: "#c45a4a",
      },
    ]}
    edges={[
      { from: "orano", to: "cominak", arrow: "to", kind: "direct", label: "controle 63%" },
      { from: "niger", to: "cominak", arrow: "to", kind: "declared", label: "part 14%" },
    ]}
    parentLabel="URANIUM ARLIT"
    parentBoxConnects={["orano", "niger"]}
  />
);
