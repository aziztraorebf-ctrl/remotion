import React from "react";
import { useVideoConfig, Sequence, Series } from "remotion";
import { HookScene } from "./HookScene";
import { Stage1Scene } from "./Stage1Scene";
import { BossScene } from "./BossScene";
import { RevealScene } from "./RevealScene";
import { VictoryScene } from "./VictoryScene";
import { LevelTransition } from "../components/LevelTransition";
import { CRTOverlay } from "../components/CRTOverlay";
import { AudioLayer } from "../audio/AudioLayer";

// Total duration: ~30 seconds at 30fps = 900 frames
// Scene breakdown:
//   Hook:        0-180    (6s)   - Grab attention
//   Transition1: 180-240  (2s)   - STAGE 1
//   Stage1:      240-420  (6s)   - The loan amount
//   Transition2: 420-480  (2s)   - BOSS APPROACHING
//   Boss:        480-660  (6s)   - Compound interest boss
//   Reveal:      660-780  (4s)   - The real cost
//   Victory:     780-960  (6s)   - Strategy + CTA

export const RetroExplainer: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#0f0e17",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Series>
        {/* Hook: Attention grabber */}
        <Series.Sequence durationInFrames={180} name="hook">
          <HookScene />
        </Series.Sequence>

        {/* Transition to Stage 1 */}
        <Series.Sequence durationInFrames={60} name="transition-1">
          <LevelTransition
            stageNumber={1}
            stageName="L'EMPRUNT"
            subtitle="Tu empruntes 340 000 EUR"
          />
        </Series.Sequence>

        {/* Stage 1: The Loan */}
        <Series.Sequence durationInFrames={180} name="stage-1">
          <Stage1Scene />
        </Series.Sequence>

        {/* Transition to Boss */}
        <Series.Sequence durationInFrames={60} name="transition-boss">
          <LevelTransition
            stageNumber={2}
            stageName="BOSS FINAL"
            subtitle="Attention... danger imminent"
          />
        </Series.Sequence>

        {/* Boss: Compound Interest */}
        <Series.Sequence durationInFrames={180} name="boss">
          <BossScene />
        </Series.Sequence>

        {/* Reveal: The real cost */}
        <Series.Sequence durationInFrames={120} name="reveal">
          <RevealScene />
        </Series.Sequence>

        {/* Victory: Strategy + CTA */}
        <Series.Sequence durationInFrames={180} name="victory">
          <VictoryScene />
        </Series.Sequence>
      </Series>

      {/* CRT overlay on top of everything */}
      <CRTOverlay />

      {/* Audio layer */}
      <Sequence from={0} name="audio">
        <AudioLayer />
      </Sequence>
    </div>
  );
};
