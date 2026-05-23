import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { SouverainScene } from "../_shared/components/SouverainScene";
import { VoixDuPeuple } from "../_shared/components/layouts/VoixDuPeuple";
import { FaceAFace } from "../_shared/components/layouts/FaceAFace";
import { PortraitDossier } from "../_shared/components/layouts/PortraitDossier";

const SCENE_DURATION = 270;

export const Prototype_K_Vague5Showcase: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {/* Scene 1 — VoixDuPeuple */}
      <Sequence from={0} durationInFrames={SCENE_DURATION} premountFor={fps}>
        <SouverainScene background="slate-medium">
          <VoixDuPeuple />
        </SouverainScene>
      </Sequence>

      {/* Scene 2 — FaceAFace */}
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION} premountFor={fps}>
        <SouverainScene background="dark-dots-navy">
          <FaceAFace />
        </SouverainScene>
      </Sequence>

      {/* Scene 3 — PortraitDossier */}
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION} premountFor={fps}>
        <SouverainScene background="kraft-dark">
          <PortraitDossier />
        </SouverainScene>
      </Sequence>
    </AbsoluteFill>
  );
};
