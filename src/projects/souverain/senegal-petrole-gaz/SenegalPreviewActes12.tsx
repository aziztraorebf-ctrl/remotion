import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { Beat1 } from "./beats/Beat1";
import { Beat2 } from "./beats/Beat2";
import { Beat3 } from "./beats/Beat3";
import { Beat5 } from "./beats/Beat5";
import { Beat6 } from "./beats/Beat6";
import { Beat7 } from "./beats/Beat7";
import { Beat8 } from "./beats/Beat8";
import { Beat9 } from "./beats/Beat9";

// Preview Actes 1+2 — assemblage complet avec audio
// ─── Acte 1 ───────────────────────────────────────
// Beat1 : 0..554f        (18.47s) — Flyover + chiffres clés
// Beat2 : 554..867f      (10.43s) — Sangomar $/jour
// Beat3 : 867..1006f     (4.63s)  — Répartition revenus
// Beat5 : 1006..1266f    (8.67s)  — Chronologie
// ─── Acte 2 ───────────────────────────────────────
// Beat6 : 1266..1778f    (17.06s) — Sangomar Woodside
// Beat7 : 1778..2849f    (35.70s) — GTA + arc export
// Beat8 : 2849..3395f    (18.22s) — Yakaar attend
// Beat9 : 3395..3911f    (17.20s) — 60%

const B1 = 0;
const B2 = 554;
const B3 = 867;
const B5 = 1006;
const B6 = 1266;
const B7 = 1778;
const B8 = 2849;
const B9 = 3395;
const TOTAL = 3911;

// Musique : volume 18%, fade-out 6s avant la fin
const MUSIC_FADE_START_S = (TOTAL / 30) - 6;

export const SenegalPreviewActes12: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1520" }}>

      {/* Voix-off complète — depuis le début */}
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v1-clean.mp3")}
        startFrom={0}
        volume={1.0}
      />

      {/* Musique A — 18%, fade-out 6s avant fin */}
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")}
        volume={(f) => {
          const s = f / fps;
          if (s >= MUSIC_FADE_START_S) {
            const t = (s - MUSIC_FADE_START_S) / 6;
            return 0.18 * Math.max(0, 1 - t);
          }
          return 0.18;
        }}
      />

      {/* ── Acte 1 ── */}
      <Sequence from={B1} durationInFrames={B2 - B1}>
        <Beat1 />
      </Sequence>
      <Sequence from={B2} durationInFrames={B3 - B2}>
        <Beat2 />
      </Sequence>
      <Sequence from={B3} durationInFrames={B5 - B3}>
        <Beat3 />
      </Sequence>
      <Sequence from={B5} durationInFrames={B6 - B5}>
        <Beat5 />
      </Sequence>

      {/* ── Acte 2 ── */}
      <Sequence from={B6} durationInFrames={B7 - B6}>
        <Beat6 />
      </Sequence>
      <Sequence from={B7} durationInFrames={B8 - B7}>
        <Beat7 />
      </Sequence>
      <Sequence from={B8} durationInFrames={B9 - B8}>
        <Beat8 />
      </Sequence>
      <Sequence from={B9} durationInFrames={TOTAL - B9}>
        <Beat9 />
      </Sequence>

    </AbsoluteFill>
  );
};

export const SENEGAL_PREVIEW_ACTES12_FRAMES = TOTAL;
