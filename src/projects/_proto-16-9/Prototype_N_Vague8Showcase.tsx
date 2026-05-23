import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { SouverainScene } from "../_shared/components/SouverainScene";
import { PortraitEditorial } from "../_shared/components/layouts/PortraitEditorial";
import { TrombinoscapeStrategique } from "../_shared/components/layouts/TrombinoscapeStrategique";

const SCENE_DURATION = 270;

export const Prototype_N_Vague8Showcase: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>

      {/* Scene 1 — PortraitEditorial */}
      <Sequence from={0} durationInFrames={SCENE_DURATION} premountFor={fps}>
        <SouverainScene background="kraft-dark">
          <PortraitEditorial
            rubrique="INVESTIGATION"
            titre={["LES RESEAUX INVISIBLES", "DE L'EXTRACTION MINIERE"]}
            sousTitre="Analyse des flux financiers en Afrique de l'Ouest"
            stats={[
              { label: "FLUX FINANCIER", valeur: "4.2 Mrd $" },
              { label: "ACTEURS IMPLIQUES", valeur: "127 Entites" },
              { label: "IMPACT REGIONAL", valeur: "Critique" },
            ]}
            source="SOURCE : THE ECONOMIST INTELLIGENCE"
          />
        </SouverainScene>
      </Sequence>

      {/* Scene 2 — TrombinoscapeStrategique */}
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION} premountFor={fps}>
        <SouverainScene background="slate-medium">
          <TrombinoscapeStrategique
            titre="CARTOGRAPHIE DU POUVOIR"
            portraits={[
              { name: "GEN. AMADOU FALL", role: "CHEF D'ETAT-MAJOR", pouvoir: 85, statutColor: "#e63946" },
              { name: "DR. FATOU DIOP", role: "MIN. FINANCES", pouvoir: 92, statutColor: "#4a9eff" },
              { name: "MARCUS OBIANG", role: "DIR. RENSEIGNEMENTS", pouvoir: 78, statutColor: "#c8a951" },
              { name: "SOULEYMANE KEITA", role: "CONSEILLER SPECIAL", pouvoir: 65, statutColor: "#4a9eff" },
              { name: "COL. YASMINA TALL", role: "FORCES SPECIALES", pouvoir: 88, statutColor: "#e63946" },
              { name: "AMB. CLAIRE SECK", role: "DIPLOMATIE", pouvoir: 71, statutColor: "#c8a951" },
            ]}
            arcs={[[0, 2], [1, 3], [2, 4], [0, 4]]}
          />
        </SouverainScene>
      </Sequence>

    </AbsoluteFill>
  );
};
