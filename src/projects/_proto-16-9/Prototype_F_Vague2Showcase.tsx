import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { SouverainScene } from "../_shared/components/SouverainScene";
import type { DarkCssBg } from "../_shared/components/SouverainScene";
import { FlowArrowsMap } from "../_shared/components/layouts/FlowArrowsMap";
import { StatComparisonGrid } from "../_shared/components/layouts/StatComparisonGrid";
import { CountryIsolateWithHatch } from "../_shared/components/layouts/CountryIsolateWithHatch";
import { LineChartDrawOn } from "../_shared/components/layouts/LineChartDrawOn";
import { ParadigmShiftTimeline } from "../_shared/components/layouts/ParadigmShiftTimeline";
import { HighlightedQuote } from "../_shared/components/layouts/HighlightedQuote";

// 6s par scene
const SCENE = 6 * 30;

const SCENES: Array<{ bg: DarkCssBg; label: string; component: React.FC }> = [
  {
    bg: "dark-dots-navy",
    label: "FlowArrowsMap",
    component: () => <FlowArrowsMap startFrame={15} />,
  },
  {
    bg: "dark-dots-brown",
    label: "StatComparisonGrid",
    component: () => <StatComparisonGrid startFrame={15} />,
  },
  {
    bg: "kraft-dark",
    label: "LineChartDrawOn",
    component: () => <LineChartDrawOn startFrame={15} />,
  },
  {
    bg: "slate-medium",
    label: "ParadigmShiftTimeline",
    component: () => <ParadigmShiftTimeline startFrame={15} />,
  },
  {
    bg: "paper-warm-dark",
    label: "HighlightedQuote",
    component: () => <HighlightedQuote startFrame={15} />,
  },
  {
    bg: "dark-dots-navy",
    label: "CountryIsolateWithHatch",
    component: () => <CountryIsolateWithHatch startFrame={15} />,
  },
];

export const Prototype_F_Vague2Showcase: React.FC = () => {
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

            {/* Label scene en bas gauche */}
            <AbsoluteFill
              style={{
                pointerEvents: "none",
                display: "flex",
                alignItems: "flex-end",
                padding: "0 60px 36px",
              }}
            >
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 18,
                  letterSpacing: 4,
                  color: "rgba(200,169,81,0.5)",
                  textTransform: "uppercase",
                }}
              >
                {`${i + 1}/6 — ${scene.label} · ${scene.bg}`}
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
