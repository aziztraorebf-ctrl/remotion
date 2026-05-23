import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import { KraftCardBackground } from "../_shared/components/inserts/KraftCardBackground";
import { OdometerFlip } from "../_shared/components/layouts/OdometerFlip";
import { RadarPing } from "../_shared/components/layouts/RadarPing";
import { ScaleShock } from "../_shared/components/layouts/ScaleShock";

/**
 * Vague 1 composition test — proves refactored templates are truly composable.
 * 3 scenes on Kraft background (ivoire) with transparent templates on top.
 * Each scene is 90 frames (3s at 30fps).
 */
export const Prototype_C_CompositionTest: React.FC = () => {
  const { fps } = useVideoConfig();
  const SCENE = 3 * fps;

  return (
    <AbsoluteFill>
      {/* Scene 1 — OdometerFlip on Kraft ivoire */}
      <Sequence from={0} durationInFrames={SCENE} premountFor={fps}>
        <KraftCardBackground variant="ivoire">
          <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <OdometerFlip
              toValue="100000"
              label="BARILS PAR JOUR"
              spinStartFrame={15}
              spinStagger={6}
              spinDuration={40}
            />
          </AbsoluteFill>
        </KraftCardBackground>
      </Sequence>

      {/* Scene 2 — RadarPing on Kraft kraft */}
      <Sequence from={SCENE} durationInFrames={SCENE} premountFor={fps}>
        <KraftCardBackground variant="kraft">
          <RadarPing
            title="RESSOURCES SENEGAL"
            stats={[
              { value: "8.5T", label: "RESERVES GAZ", angle: 195, revealDelay: 40, ringRadius: 390 },
              { value: "2.5B", label: "INVESTIS", angle: 345, revealDelay: 60, ringRadius: 390 },
            ]}
          />
        </KraftCardBackground>
      </Sequence>

      {/* Scene 3 — ScaleShock on Kraft slate */}
      <Sequence from={SCENE * 2} durationInFrames={SCENE} premountFor={fps}>
        <KraftCardBackground variant="slate">
          <ScaleShock
            topLabel="SUPERFICIE COMPAREE"
            labelLeft="Belgique"
            labelLeftSub="30 528 km2"
            labelRight="Senegal"
            labelRightSub="196 722 km2"
            subtitle="surface comparee"
            ratioScale={6.4}
          />
        </KraftCardBackground>
      </Sequence>
    </AbsoluteFill>
  );
};
