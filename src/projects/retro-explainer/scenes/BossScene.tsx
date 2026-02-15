import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { BossReveal } from "../components/BossReveal";

export const BossScene: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <div style={{ width, height, position: "relative" }}>
      <BossReveal
        bossName="INTERETS COMPOSES"
        bossSubtitle="Le monstre invisible de ton credit"
      />
    </div>
  );
};
