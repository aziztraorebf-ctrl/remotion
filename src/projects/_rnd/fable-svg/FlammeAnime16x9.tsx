import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import {
  FLAMME_DEFS,
  FLAMME_FOND,
  FLAMME_LUEUR,
  FLAMME_FOYER,
  FLAMMES,
  FUMEES,
  BRAISES,
} from "./flammeGroups";

export const FLAMME_ANIME_FRAMES = 300; // 10s

// ---------------------------------------------------------------------------
// SCENE FLAMME/BRAISE animee. Matiere = Fable 5 (statique) ; vie = code.
// Gestes (registre organique non-figuratif, jamais fait) :
//  - langues de flamme qui ONDULENT (rotate/scaleY sin, dephase par flamme,
//    ancre au pivot bas -> la base reste fixe, la pointe danse).
//  - lueur qui RESPIRE (opacite sin).
//  - fumee qui MONTE + se dissipe en boucle (translateY + fade).
//  - braises qui S'ELEVENT en boucle (translateY + fade avant le sommet).
// Aucun humain/animal -> pas d'uncanny (doctrine confirmee).
// ---------------------------------------------------------------------------

const W = 1920;
const H = 1080;

export const FlammeAnime16x9: React.FC = () => {
  const frame = useCurrentFrame();

  // lueur qui respire
  const glowPulse = 0.85 + 0.15 * Math.sin(frame / 16);

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a0e06" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: FLAMME_DEFS }} />

        <g dangerouslySetInnerHTML={{ __html: FLAMME_FOND }} />
        <g opacity={glowPulse} dangerouslySetInnerHTML={{ __html: FLAMME_LUEUR }} />

        {/* FUMEES : montent + se dissipent en boucle */}
        {FUMEES.map((f) => {
          const cycle = (frame / 90 + f.phase) % 1; // 0->1 en 3s
          const ty = -cycle * 160; // monte
          const op = interpolate(cycle, [0, 0.15, 0.7, 1], [0, 0.9, 0.6, 0]);
          const drift = Math.sin((frame / 40) + f.phase) * 14;
          return (
            <g
              key={f.id}
              opacity={op}
              transform={`translate(${drift} ${ty})`}
              dangerouslySetInnerHTML={{ __html: f.content }}
            />
          );
        })}

        {/* FLAMMES : ondulation ancree au pivot bas (base fixe, pointe danse) */}
        {FLAMMES.map((fl) => {
          const sway = Math.sin(frame / 7 + fl.phase) * fl.amp; // rotation deg
          const flick = 1 + 0.04 * Math.sin(frame / 5 + fl.phase * 2); // scaleY flicker
          return (
            <g
              key={fl.id}
              transform={`rotate(${sway} ${fl.pivotX} ${fl.pivotY}) translate(${fl.pivotX} ${fl.pivotY}) scale(1 ${flick}) translate(${-fl.pivotX} ${-fl.pivotY})`}
              dangerouslySetInnerHTML={{ __html: fl.content }}
            />
          );
        })}

        {/* FOYER (bûches + braises au sol) — respire un peu */}
        <g opacity={0.9 + 0.1 * Math.sin(frame / 11)} dangerouslySetInnerHTML={{ __html: FLAMME_FOYER }} />

        {/* BRAISES qui s'elevent en boucle */}
        {BRAISES.map((b, i) => {
          const cycle = (frame / 70 + b.phase) % 1;
          const ty = -cycle * 340; // monte haut
          const tx = Math.sin((frame / 22) + b.phase * 3) * 22; // zigzag
          const op = interpolate(cycle, [0, 0.1, 0.75, 1], [0, 0.95, 0.5, 0]);
          return (
            <circle
              key={i}
              cx={b.x + tx}
              cy={b.y0 + ty}
              r={b.r}
              fill={b.color}
              opacity={op}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
