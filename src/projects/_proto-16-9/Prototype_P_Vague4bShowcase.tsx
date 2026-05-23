import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { SouverainScene } from "../_shared/components/SouverainScene";
import { CalqueDechire } from "../_shared/components/layouts/CalqueDechire";
import { ScanInfrarouge } from "../_shared/components/layouts/ScanInfrarouge";
import { EffetDomino } from "../_shared/components/layouts/EffetDomino";
import { LoomWipe } from "../_shared/components/layouts/LoomWipe";

// 3 scenes × 210f + 1 transition × 90f = 720f — on coupe à 660f (3 templates + wipe final)
// Structure : CalqueDechiré (180f) | ScanInfrarouge (200f) | EffetDomino (210f) | LoomWipe (90f)
const DUR_1 = 180;
const DUR_2 = 200;
const DUR_3 = 210;
const DUR_T = 90;

export const Prototype_P_Vague4bShowcase: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>

      {/* 4.1 — CalqueDéchiré */}
      <Sequence from={0} durationInFrames={DUR_1} premountFor={fps}>
        <SouverainScene background="dark-dots-navy">
          <CalqueDechire
            officialText="COMMUNIQUÉ OFFICIEL"
            statLabel="DETTE CACHÉE : 4,7 Mds $"
            sourceLabel="Données non publiées — audit externe 2023"
          />
        </SouverainScene>
      </Sequence>

      {/* 4.2 — ScanInfrarouge */}
      <Sequence from={DUR_1} durationInFrames={DUR_2} premountFor={fps}>
        <ScanInfrarouge />
      </Sequence>

      {/* 4.4 — EffetDomino */}
      <Sequence from={DUR_1 + DUR_2} durationInFrames={DUR_3} premountFor={fps}>
        <SouverainScene background="dark-dots-navy">
          <EffetDomino
            impactText="5 COUPS D'ÉTAT EN 3 ANS"
            impactSubText="Sahel — 2020–2023"
          />
        </SouverainScene>
      </Sequence>

      {/* 4.T1 — LoomWipe (transition finale) */}
      <Sequence from={DUR_1 + DUR_2 + DUR_3 - 30} durationInFrames={DUR_T} premountFor={fps}>
        <LoomWipe />
      </Sequence>

    </AbsoluteFill>
  );
};
