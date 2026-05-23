import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { SenegalActe2Continu } from "./SenegalActe2Continu";
import { Beat9 } from "./beats/Beat9";

// SenegalActe2Full — assemblage final Acte 2
// SenegalActe2Continu : f0→2134    (71.1s) — Sangomar + GTA + Yakaar (1 seule Map, zéro cut)
// Beat9               : f2134→2650 (17.2s) — 60% / ni scandale ni jackpot
//
// Total : 2650 frames = 88.3s
// Narration Acte 2 démarre à 43.30s dans la voix-off complète

const CONTINU_START = 0;
const BEAT9_START   = 2134;
const TOTAL_FRAMES  = 2650;

const NARRATION_OFFSET_S  = 43.30;
const MUSIC_FADE_OUT_START_S = (TOTAL_FRAMES / 30) - 4;

export const SenegalActe2Full: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1520" }}>

      {/* Voix-off — tranche Acte 2 dans la narration complète */}
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v1-clean.mp3")}
        startFrom={Math.round(NARRATION_OFFSET_S * fps)}
        volume={1.0}
      />

      {/* Musique A — 18%, fade-out 4s avant la fin */}
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")}
        volume={(f) => {
          const s = f / fps;
          if (s >= MUSIC_FADE_OUT_START_S) {
            const t = (s - MUSIC_FADE_OUT_START_S) / 4;
            return 0.18 * Math.max(0, 1 - t);
          }
          return 0.18;
        }}
      />

      {/* Acte 2 Continu — une seule Map Mapbox, 5 phases */}
      <Sequence from={CONTINU_START} durationInFrames={BEAT9_START}>
        <SenegalActe2Continu />
      </Sequence>

      {/* Beat 9 — donut 60% */}
      <Sequence from={BEAT9_START} durationInFrames={TOTAL_FRAMES - BEAT9_START}>
        <Beat9 />
      </Sequence>

    </AbsoluteFill>
  );
};

export const SENEGAL_ACTE2_FULL_FRAMES = TOTAL_FRAMES;
