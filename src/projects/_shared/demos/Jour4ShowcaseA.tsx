/**
 * Showcase Jour 4 — Group A : BrutalHeadline + DataCard + BigStat
 *
 * 5 phases (90f = 3s chacune) :
 * Phase A (f0-90)    — BrutalHeadline variante "noir"
 * Phase B (f90-180)  — BrutalHeadline variante "rouge"
 * Phase C (f180-270) — DataCard variante "kraft"
 * Phase D (f270-360) — DataCard variante "dark"
 * Phase E (f360-450) — BigStat variante "noir"
 */

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";

import { BrutalHeadline } from "../components/inserts/BrutalHeadline";
import { DataCard } from "../components/inserts/DataCard";
import { BigStat } from "../components/inserts/BigStat";

const PHASE_DUR = 90;
const FADE = 10;
export const JOUR4_SHOWCASE_A_FRAMES = PHASE_DUR * 5;

const phaseOpacity = (frame: number, start: number, end: number) =>
  interpolate(
    frame,
    [start, start + FADE, end - FADE, end],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

const FakePhoto: React.FC<{ bg: string }> = ({ bg }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div style={{ color: "rgba(255,255,255,0.15)", fontSize: 60, fontFamily: "sans-serif" }}>
      PHOTO
    </div>
  </div>
);

export const Jour4ShowcaseA: React.FC = () => {
  const frame = useCurrentFrame();

  const phases = [
    { start: 0, end: PHASE_DUR },
    { start: PHASE_DUR, end: PHASE_DUR * 2 },
    { start: PHASE_DUR * 2, end: PHASE_DUR * 3 },
    { start: PHASE_DUR * 3, end: PHASE_DUR * 4 },
    { start: PHASE_DUR * 4, end: PHASE_DUR * 5 },
  ];

  const localFrame = (phase: number) => Math.max(0, frame - phases[phase].start);

  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      {/* Phase A — BrutalHeadline noir */}
      <AbsoluteFill style={{ opacity: phaseOpacity(frame, phases[0].start, phases[0].end) }}>
        <BrutalHeadline
          headline="L'URANIUM QUI VAUT UN EMPIRE"
          subline="Niger · 2006–2026"
          tag="SOUVERAIN"
          variant="noir"
          photo={<FakePhoto bg="#1a3a2a" />}
          key={`a-${localFrame(0)}`}
        />
      </AbsoluteFill>

      {/* Phase B — BrutalHeadline rouge */}
      <AbsoluteFill style={{ opacity: phaseOpacity(frame, phases[1].start, phases[1].end) }}>
        <BrutalHeadline
          headline="20 ANS DE PILLAGE SILENCIEUX"
          subline="Niger · Areva · ORANO"
          tag="INVESTIGATION"
          variant="rouge"
          photo={<FakePhoto bg="#2a1a1a" />}
          key={`b-${localFrame(1)}`}
        />
      </AbsoluteFill>

      {/* Phase C — DataCard kraft */}
      <AbsoluteFill style={{ opacity: phaseOpacity(frame, phases[2].start, phases[2].end) }}>
        <DataCard
          value="3 500 T"
          label="d'uranium extrait par an"
          source="AIEA, Rapport annuel 2022"
          context="2e producteur africain"
          country="Niger"
          variant="kraft"
          key={`c-${localFrame(2)}`}
        />
      </AbsoluteFill>

      {/* Phase D — DataCard dark */}
      <AbsoluteFill style={{ opacity: phaseOpacity(frame, phases[3].start, phases[3].end) }}>
        <DataCard
          value="$0.80"
          label="le kg d'uranium nigérien"
          source="contrats Areva 1975–2006"
          context="vs $40–80 sur le marché libre"
          country="AREVA payait"
          variant="dark"
          key={`d-${localFrame(3)}`}
        />
      </AbsoluteFill>

      {/* Phase E — BigStat noir */}
      <AbsoluteFill style={{ opacity: phaseOpacity(frame, phases[4].start, phases[4].end) }}>
        <BigStat
          value="$3.7B"
          unit="par an"
          label="extraits du sol nigérien"
          variant="noir"
          key={`e-${localFrame(4)}`}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
