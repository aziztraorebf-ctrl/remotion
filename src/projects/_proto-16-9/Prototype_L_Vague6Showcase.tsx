import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { SouverainScene } from "../_shared/components/SouverainScene";
import { TextChoc } from "../_shared/components/layouts/TextChoc";
import { SourceProuve } from "../_shared/components/layouts/SourceProuve";
import { ChiffreChoc } from "../_shared/components/layouts/ChiffreChoc";

const SCENE_DURATION = 240;

export const Prototype_L_Vague6Showcase: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {/* Scene 1 — TextChoc */}
      <Sequence from={0} durationInFrames={SCENE_DURATION} premountFor={fps}>
        <SouverainScene background="dark-dots-navy">
          <TextChoc
            words={["ILS", "ONT", "VOLE", "63", "MILLIARDS", "AU", "PEUPLE"]}
            accentIndex={6}
            accentColor="#e63946"
            underlineAccent={true}
          />
        </SouverainScene>
      </Sequence>

      {/* Scene 2 — SourceProuve */}
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION} premountFor={fps}>
        <SouverainScene background="slate-medium">
          <SourceProuve
            publication="REUTERS"
            headline="African oil revenues mismanaged — $63B unaccounted for over a decade of extraction."
            highlightText="$63B unaccounted"
            date="18 MARS 2024"
            publicationColor="#e63946"
          />
        </SouverainScene>
      </Sequence>

      {/* Scene 3 — ChiffreChoc */}
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION} premountFor={fps}>
        <SouverainScene background="dark-dots-navy">
          <ChiffreChoc
            value="63B"
            prefix="$"
            context1="REVENUS PETROLIERS DETOURNES"
            context2="Sur 10 ans d'extraction en Afrique subsaharienne"
            valueColor="#c8a951"
          />
        </SouverainScene>
      </Sequence>
    </AbsoluteFill>
  );
};
