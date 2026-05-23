import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { SouverainScene } from "../_shared/components/SouverainScene";
import type { DarkCssBg } from "../_shared/components/SouverainScene";
import { LaCalebasse } from "../_shared/components/layouts/LaCalebasse";
import { LeCadranSolaire } from "../_shared/components/layouts/LeCadranSolaire";
import { Stratigraphie } from "../_shared/components/layouts/Stratigraphie";
import { LeSceau } from "../_shared/components/layouts/LeSceau";
import { PolyrythmieData } from "../_shared/components/layouts/PolyrythmieData";
import { NoeudTisserand } from "../_shared/components/layouts/NoeudTisserand";
import { LeSemeur } from "../_shared/components/layouts/LeSemeur";
import { Palimpseste } from "../_shared/components/layouts/Palimpseste";
import { ArbreAPalabres } from "../_shared/components/layouts/ArbreAPalabres";

const SCENE = 9 * 30;

const SCENES: Array<{ bg: DarkCssBg; label: string; component: React.FC }> = [
  { bg: "dark-dots-navy", label: "3A — LaCalebasse", component: () => <LaCalebasse /> },
  { bg: "slate-medium",   label: "3B — LeCadranSolaire", component: () => <LeCadranSolaire /> },
  { bg: "dark-dots-navy", label: "3C — Stratigraphie", component: () => <Stratigraphie /> },
  { bg: "kraft-dark",     label: "3D — LeSceau", component: () => <LeSceau /> },
  { bg: "dark-dots-navy", label: "3E — PolyrythmieData", component: () => <PolyrythmieData /> },
  { bg: "slate-medium",   label: "3F — NoeudTisserand", component: () => <NoeudTisserand /> },
  { bg: "dark-dots-navy", label: "3G — LeSemeur", component: () => <LeSemeur /> },
  { bg: "kraft-dark",     label: "3H — Palimpseste", component: () => <Palimpseste /> },
  { bg: "slate-medium",   label: "3I — ArbreAPalabres", component: () => <ArbreAPalabres /> },
];

export const Prototype_Q_Vague3CompleteShowcase: React.FC = () => {
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
                {`${i + 1}/9 — ${scene.label} · ${scene.bg}`}
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
