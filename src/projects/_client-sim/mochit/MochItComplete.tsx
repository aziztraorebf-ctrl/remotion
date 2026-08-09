// Composition complete MOCH-IT — test systeme A->Z (reproduction/depassement d'une pub Fiverr de
// reference, cf memory/client-sim-tests/INDEX.md). 5 segments, 465 frames/30fps = 15.5s exact.
// REFONTE V4 (2026-08-08) : P4WeDesignIntro retire -- doublon avec la 1ere capsule "WE DESIGN"
// de P2Workflow (repere par Aziz via diagnostic comparatif). Les 24 frames liberees vont a
// P2Workflow (114f au lieu de 90) pour laisser respirer l'entree de "WE DESIGN" comme dans
// l'original, plutot que d'etre perdues.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { P0Accumulation } from "./P0Accumulation";
import { P1Pivot } from "./P1Pivot";
import { P2Workflow } from "./P2Workflow";
import { P6BenefitReveal } from "./P6BenefitReveal";
import { P3Cta } from "./P3Cta";
import { MI_WIDTH, MI_HEIGHT } from "./theme";

export const MI_TOTAL_FPS = 30;
export const MI_TOTAL_FRAMES = 465; // 15.5s exact

const SEGMENTS = [
  { key: "p0", Comp: P0Accumulation, from: 0, durationInFrames: 81 },
  { key: "p1", Comp: P1Pivot, from: 81, durationInFrames: 93 },
  { key: "p2", Comp: P2Workflow, from: 174, durationInFrames: 114 },
  { key: "p6", Comp: P6BenefitReveal, from: 288, durationInFrames: 108 },
  { key: "p3", Comp: P3Cta, from: 396, durationInFrames: 69 },
];

// Letterbox : bandes noires haut/bas, format proche du 4:5 dans le cadre 9:16 -- observe sur
// l'original (concentre le regard, lecture "spot TV" plutot que "slide plein ecran").
// height explicite (pas top+bottom sur AbsoluteFill) -- bottom seul ne contraignait pas le rendu.
const LETTERBOX_HEIGHT = 140;
const CONTENT_HEIGHT = MI_HEIGHT - LETTERBOX_HEIGHT * 2;

export const MochItComplete: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <div style={{ position: "absolute", top: LETTERBOX_HEIGHT, left: 0, width: MI_WIDTH, height: CONTENT_HEIGHT, overflow: "hidden" }}>
        {SEGMENTS.map(({ key, Comp, from, durationInFrames }) => (
          <Sequence key={key} from={from} durationInFrames={durationInFrames} premountFor={15}>
            <Comp />
          </Sequence>
        ))}
      </div>
    </AbsoluteFill>
  );
};
