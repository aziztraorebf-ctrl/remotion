/**
 * Showcase Jour 4 — Group B : NewsClipping + DateBar
 *
 * 4 phases (90f = 3s chacune) :
 * Phase A (f0-90)    — NewsClipping variante "jauni"
 * Phase B (f90-180)  — NewsClipping variante "blanc"
 * Phase C (f180-270) — DateBar fullscreen variante "or"
 * Phase D (f270-360) — DateBar position bottom sur fond sombre
 */

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";

import { NewsClipping } from "../components/inserts/NewsClipping";
import { DateBar } from "../components/inserts/DateBar";

const PHASE_DUR = 90;
const FADE = 10;
export const JOUR4_SHOWCASE_B_FRAMES = PHASE_DUR * 4;

const phaseOpacity = (frame: number, start: number, end: number) =>
  interpolate(
    frame,
    [start, start + FADE, end - FADE, end],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

export const Jour4ShowcaseB: React.FC = () => {
  const frame = useCurrentFrame();

  const phases = [
    { start: 0, end: PHASE_DUR },
    { start: PHASE_DUR, end: PHASE_DUR * 2 },
    { start: PHASE_DUR * 2, end: PHASE_DUR * 3 },
    { start: PHASE_DUR * 3, end: PHASE_DUR * 4 },
  ];

  const localFrame = (phase: number) => Math.max(0, frame - phases[phase].start);

  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      {/* Phase A — NewsClipping jauni */}
      <AbsoluteFill style={{ opacity: phaseOpacity(frame, phases[0].start, phases[0].end) }}>
        <NewsClipping
          date="12 Novembre 2018"
          publication="Le Monde Afrique"
          headline="Le Niger exige 55% des royalties sur l'uranium"
          lead="Lors du sommet de l'UA à Abuja, le président Issoufou a remis en cause les contrats historiques signés sous la colonisation française."
          pullQuote="Nos ressources, notre souveraineté."
          variant="jauni"
          rotation={-1.5}
          key={`a-${localFrame(0)}`}
        />
      </AbsoluteFill>

      {/* Phase B — NewsClipping blanc */}
      <AbsoluteFill style={{ opacity: phaseOpacity(frame, phases[1].start, phases[1].end) }}>
        <NewsClipping
          date="7 Mars 2014"
          publication="Reuters Africa"
          headline="ORANO signs new uranium deal with Niger — terms undisclosed"
          lead="The French nuclear giant quietly renewed its Nigerien contracts, avoiding scrutiny from civil society groups who demanded transparency on pricing."
          pullQuote="Terms remain confidential per both parties."
          variant="blanc"
          rotation={1.2}
          key={`b-${localFrame(1)}`}
        />
      </AbsoluteFill>

      {/* Phase C — DateBar fullscreen */}
      <AbsoluteFill style={{ opacity: phaseOpacity(frame, phases[2].start, phases[2].end) }}>
        <DateBar
          date="26 JUILLET 2023"
          subtitle="Coup d'État — Niamey"
          variant="or"
          fullscreen
          key={`c-${localFrame(2)}`}
        />
      </AbsoluteFill>

      {/* Phase D — DateBar position bottom sur fond sombre */}
      <AbsoluteFill style={{ opacity: phaseOpacity(frame, phases[3].start, phases[3].end) }}>
        <AbsoluteFill style={{ background: "#0a1a12" }} />
        <DateBar
          date="12 NOVEMBRE 2018"
          subtitle="Sommet UA — Abuja"
          variant="or"
          position="bottom"
          key={`d-${localFrame(3)}`}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
