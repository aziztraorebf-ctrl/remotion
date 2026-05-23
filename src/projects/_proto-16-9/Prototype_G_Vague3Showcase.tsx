import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { SouverainScene } from "../_shared/components/SouverainScene";
import type { DarkCssBg } from "../_shared/components/SouverainScene";
import { LaCalebasse } from "../_shared/components/layouts/LaCalebasse";
import { LeCadranSolaire } from "../_shared/components/layouts/LeCadranSolaire";
import { Stratigraphie } from "../_shared/components/layouts/Stratigraphie";

const SCENE = 9 * 30; // 9s per scene — LeCadranSolaire needs more time

const SCENES: Array<{ bg: DarkCssBg; label: string; component: React.FC }> = [
  {
    bg: "dark-dots-navy",
    label: "LaCalebasse",
    component: () => <LaCalebasse startFrame={15} />,
  },
  {
    bg: "slate-medium",
    label: "LeCadranSolaire",
    component: () => <LeCadranSolaire startFrame={15} />,
  },
  {
    bg: "kraft-dark",
    label: "Stratigraphie",
    component: () => <Stratigraphie startFrame={15} />,
  },
];

export const Prototype_G_Vague3Showcase: React.FC = () => {
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
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 18,
                  letterSpacing: 4,
                  color: "rgba(200,169,81,0.5)",
                  textTransform: "uppercase",
                }}
              >
                {`${i + 1}/3 — ${scene.label} · ${scene.bg}`}
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
