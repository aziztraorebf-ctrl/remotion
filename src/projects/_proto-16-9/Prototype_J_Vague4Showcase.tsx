import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { SouverainScene } from "../_shared/components/SouverainScene";
import { Caviardage } from "../_shared/components/layouts/Caviardage";
import { FilRouge } from "../_shared/components/layouts/FilRouge";
import { SovereignEclipse } from "../_shared/components/layouts/SovereignEclipse";

const SCENE_DURATION = 270;

export const Prototype_J_Vague4Showcase: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {/* Scene 1 — Caviardage */}
      <Sequence from={0} durationInFrames={SCENE_DURATION} premountFor={fps}>
        <SouverainScene background="kraft-dark">
          <Caviardage />
        </SouverainScene>
      </Sequence>

      {/* Scene 2 — Fil Rouge */}
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION} premountFor={fps}>
        <SouverainScene background="dark-dots-navy">
          <FilRouge bgColor="#1a2535" />
        </SouverainScene>
      </Sequence>

      {/* Scene 3 — Sovereign Eclipse */}
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION} premountFor={fps}>
        <SouverainScene background="slate-medium">
          <SovereignEclipse />
        </SouverainScene>
      </Sequence>
    </AbsoluteFill>
  );
};
