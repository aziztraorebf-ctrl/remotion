// MOTEUR: objet/metaphore SVG
//
// SHOWCASE — enchaine les 6 etats en continu, sur un fond qui simule la video de la cliente.
// ⛔ CE N'EST PAS UN LIVRABLE : les livrables sont les 6 .mov ProRes 4444 a fond transparent.
// Ici on cuit un fond pour pouvoir regarder le film en MP4 (le MP4 n'a pas de canal alpha).

import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { ChillMeterOverlay, type MeterState } from "./ChillMeterOverlay";

const FPS = 30;

// Duree de chaque etat, dans l'ordre de la progression du brief.
const STATES: { state: MeterState; dur: number; label: string }[] = [
  { state: "entrance", dur: 60, label: "1 - Entrance + power-on" },
  { state: "idle", dur: 75, label: "2 - Idle (loop)" },
  { state: "fill25", dur: 75, label: "3 - 0 to 25%" },
  { state: "fill50", dur: 105, label: "4 - 50%: frost builds" },
  { state: "fill75", dur: 105, label: "5 - 75%: bottom edge" },
  { state: "fill100", dur: 135, label: "6 - 100%: MAX CHILL" },
];

export const SHOWCASE_FRAMES = STATES.reduce((a, s) => a + s.dur, 0);

/** Son VRAI plateau, en image fixe : le compteur est le seul element qui bouge.
    Choix assume — on demontre l'habillage, pas un montage. Aucun pari sur "le bon moment"
    de sa reaction, et aucun extrait video tiers en mouvement. */
const FakeStage: React.FC = () => (
  <AbsoluteFill>
    <Img
      src={staticFile("_shared/rnd/abigirl-decor.png")}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </AbsoluteFill>
);

/** Cartouche discret nommant l etat en cours (showcase seulement). */
const StateLabel: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 8, dur - 12, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        top: 54,
        opacity: op,
        fontFamily: "ui-monospace, Menlo, monospace",
        fontSize: 22,
        letterSpacing: 3,
        textTransform: "uppercase",
        color: "#cfe9ff",
        background: "rgba(10,16,32,0.62)",
        border: "1px solid rgba(140,210,255,0.32)",
        borderRadius: 999,
        padding: "9px 20px",
      }}
    >
      {text}
    </div>
  );
};

export const ChillMeterShowcase: React.FC = () => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#171226" }}>
      <FakeStage />
      {STATES.map(({ state, dur, label }, i) => {
        const from = cursor;
        cursor += dur;
        return (
          <Sequence key={i} from={from} durationInFrames={dur} premountFor={FPS}>
            <ChillMeterOverlay state={state} />
            <StateLabel text={label} dur={dur} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
