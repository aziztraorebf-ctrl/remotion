import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { SouverainScene } from "../_shared/components/SouverainScene";
import type { DarkCssBg } from "../_shared/components/SouverainScene";
import { ScaleShock } from "../_shared/components/layouts/ScaleShock";
import { Timeline } from "../_shared/components/layouts/Timeline";
import { IconStat } from "../_shared/components/layouts/IconStat";
import { OdometerFlip } from "../_shared/components/layouts/OdometerFlip";
import { CoinFlip } from "../_shared/components/layouts/CoinFlip";
import { GlitchReveal } from "../_shared/components/layouts/GlitchReveal";
import { SplitFlap } from "../_shared/components/layouts/SplitFlap";
import { RadarScan } from "../_shared/components/layouts/RadarScan";
import { BarRace } from "../_shared/components/layouts/BarRace";
import { StackedBars } from "../_shared/components/layouts/StackedBars";
import { ProcessFlow } from "../_shared/components/layouts/ProcessFlow";
import { PulseNumber } from "../_shared/components/layouts/PulseNumber";
import { RadarPing } from "../_shared/components/layouts/RadarPing";
import { TimelineFracture } from "../_shared/components/layouts/TimelineFracture";
import { NetworkGraph } from "../_shared/components/layouts/NetworkGraph";
import { IconGrid } from "../_shared/components/layouts/IconGrid";
import { BurnReveal } from "../_shared/components/layouts/BurnReveal";
import { ShatterReform } from "../_shared/components/layouts/ShatterReform";

const SCENE = 9 * 30;

const SCENES: Array<{ bg: DarkCssBg; label: string; component: React.FC }> = [
  { bg: "dark-dots-navy",  label: "1A — ScaleShock",       component: () => <ScaleShock /> },
  { bg: "slate-medium",    label: "1B — Timeline",          component: () => <Timeline /> },
  { bg: "dark-dots-brown", label: "1C — IconStat",          component: () => <IconStat /> },
  { bg: "dark-dots-navy",  label: "1D — OdometerFlip",      component: () => <OdometerFlip toValue="$2.3T" /> },
  { bg: "kraft-dark",      label: "1E — CoinFlip",          component: () => <CoinFlip /> },
  { bg: "slate-medium",    label: "1F — GlitchReveal",      component: () => <GlitchReveal /> },
  { bg: "dark-dots-navy",  label: "1G — SplitFlap",         component: () => <SplitFlap /> },
  { bg: "dark-dots-brown", label: "2A — RadarScan",         component: () => <RadarScan /> },
  { bg: "slate-medium",    label: "2B — BarRace",           component: () => <BarRace /> },
  { bg: "dark-dots-navy",  label: "2C — StackedBars",       component: () => <StackedBars /> },
  { bg: "kraft-dark",      label: "2D — ProcessFlow",       component: () => <ProcessFlow /> },
  { bg: "dark-dots-navy",  label: "2E — PulseNumber",       component: () => <PulseNumber /> },
  { bg: "slate-medium",    label: "2F — RadarPing",         component: () => <RadarPing /> },
  { bg: "dark-dots-brown", label: "2G — TimelineFracture",  component: () => <TimelineFracture /> },
  { bg: "dark-dots-navy",  label: "3A — NetworkGraph",      component: () => <NetworkGraph /> },
  { bg: "slate-medium",    label: "3B — IconGrid",          component: () => <IconGrid /> },
  { bg: "kraft-dark",      label: "3C — BurnReveal",        component: () => <BurnReveal /> },
  { bg: "dark-dots-navy",  label: "3D — ShatterReform",     component: () => <ShatterReform /> },
];

export const PROTO_R_FRAMES = SCENES.length * SCENE;

export const Prototype_R_Vague1RefactorShowcase: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {SCENES.map((scene, i) => {
        const Component = scene.component;
        return (
          <Sequence
            key={scene.label}
            from={i * SCENE}
            durationInFrames={SCENE}
            premountFor={fps}
          >
            <SouverainScene background={scene.bg} vignette>
              <Component />
            </SouverainScene>
            <AbsoluteFill
              style={{
                pointerEvents: "none",
                display: "flex",
                alignItems: "flex-end",
                padding: "0 60px 36px",
              }}
            >
              <div style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 18,
                letterSpacing: 4,
                color: "rgba(200,169,81,0.5)",
                textTransform: "uppercase",
              }}>
                {`${i + 1}/${SCENES.length} — ${scene.label} · ${scene.bg}`}
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
