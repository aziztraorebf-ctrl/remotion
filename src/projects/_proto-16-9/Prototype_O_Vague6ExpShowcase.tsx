import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { SouverainScene } from "../_shared/components/SouverainScene";
import { ParallaxeDiorama } from "../_shared/components/layouts/ParallaxeDiorama";
import { MosaiqueWax } from "../_shared/components/layouts/MosaiqueWax";
import { MetamorphoseFiduciaire } from "../_shared/components/layouts/MetamorphoseFiduciaire";
import { OrigamiCarto } from "../_shared/components/layouts/OrigamiCarto";
import { LoomWeaver } from "../_shared/components/layouts/LoomWeaver";

const SCENE_DUR = 240;

export const Prototype_O_Vague6ExpShowcase: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>

      {/* 6.1 — ParallaxeDiorama */}
      <Sequence from={0} durationInFrames={SCENE_DUR} premountFor={fps}>
        <SouverainScene background="dark-dots-navy">
          <ParallaxeDiorama
            label="CHAPITRE III"
            caption="TERRES RARES ET MINERAIS"
          />
        </SouverainScene>
      </Sequence>

      {/* 6.2 — MosaïqueWax */}
      <Sequence from={SCENE_DUR} durationInFrames={SCENE_DUR} premountFor={fps}>
        <SouverainScene background="slate-medium">
          <MosaiqueWax
            title="TEXTILE ET IDENTITE"
            subtitle="LE MOTIF QUI PARLE"
          />
        </SouverainScene>
      </Sequence>

      {/* 6.3 — MétamorphoseFiduciaire */}
      <Sequence from={SCENE_DUR * 2} durationInFrames={SCENE_DUR} premountFor={fps}>
        <MetamorphoseFiduciaire
          symbolA="₣"
          symbolB="¥"
          inkColor="#1a2535"
        />
      </Sequence>

      {/* 6.4 — OrigamiCarto */}
      <Sequence from={SCENE_DUR * 3} durationInFrames={SCENE_DUR} premountFor={fps}>
        <SouverainScene background="dark-dots-navy">
          <OrigamiCarto
            title="CARTOGRAPHIE DES ENJEUX"
            labels={[
              "NORD-OUEST | RESSOURCES",
              "NORD-EST | POPULATIONS",
              "SUD-OUEST | CLIMAT",
              "SUD-EST | DEVELOPPEMENT",
            ]}
          />
        </SouverainScene>
      </Sequence>

      {/* 6.5 — LoomWeaver */}
      <Sequence from={SCENE_DUR * 4} durationInFrames={SCENE_DUR} premountFor={fps}>
        <SouverainScene background="dark-dots-navy">
          <LoomWeaver title="ALLIANCES & INTERDEPENDANCES" />
        </SouverainScene>
      </Sequence>

    </AbsoluteFill>
  );
};
