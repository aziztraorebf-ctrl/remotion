import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { SouverainScene } from "../_shared/components/SouverainScene";
import type { DarkCssBg } from "../_shared/components/SouverainScene";
import { LeSemeur } from "../_shared/components/layouts/LeSemeur";
import { Palimpseste } from "../_shared/components/layouts/Palimpseste";
import { ArbreAPalabres } from "../_shared/components/layouts/ArbreAPalabres";

const SCENE = 9 * 30;

const SCENES: Array<{ bg: DarkCssBg; label: string; component: React.FC }> = [
  {
    bg: "dark-dots-navy",
    label: "LeSemeur",
    component: () => <LeSemeur />,
  },
  {
    bg: "kraft-dark",
    label: "Palimpseste",
    component: () => <Palimpseste />,
  },
  {
    bg: "slate-medium",
    label: "ArbreAPalabres",
    component: () => <ArbreAPalabres />,
  },
];

export const Prototype_I_Vague3cShowcase: React.FC = () => {
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
                fontSize: 18, letterSpacing: 4,
                color: "rgba(200,169,81,0.5)",
                textTransform: "uppercase",
              }}>
                {`${i + 1}/3 — ${scene.label} · ${scene.bg}`}
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
