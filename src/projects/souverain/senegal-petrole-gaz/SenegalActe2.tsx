import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { Beat6 } from "./beats/Beat6";
import { Beat7 } from "./beats/Beat7";
import { Beat8 } from "./beats/Beat8";
import { Beat9 } from "./beats/Beat9";

// Acte 2 — assemblage des 4 beats avec audio synchronise
// Beat6 : 0..512f      (17.06s) — Sangomar
// Beat7 : 512..1583f   (35.70s) — GTA + arc export
// Beat8 : 1583..2129f  (18.22s) — Yakaar attend
// Beat9 : 2129..2645f  (17.20s) — 60%

const BEAT6_START = 0;
const BEAT7_START = 512;
const BEAT8_START = 1583;
const BEAT9_START = 2129;
const TOTAL_FRAMES = 2645;

// Narration : Acte 2 demarre a 43.30s dans la voix-off complete
const NARRATION_OFFSET_S = 43.30;

// Musique A : volume 18%, fade-out sur les 4 dernières secondes
const MUSIC_FADE_OUT_START_S = (TOTAL_FRAMES / 30) - 4;

export const SenegalActe2: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1520" }}>

      {/* Voix-off — décalée depuis le début de l'acte 2 dans la narration complète */}
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

      {/* Beat 6 — Sangomar */}
      <Sequence from={BEAT6_START} durationInFrames={BEAT7_START - BEAT6_START}>
        <Beat6 />
      </Sequence>

      {/* Beat 7 — GTA + arc export */}
      <Sequence from={BEAT7_START} durationInFrames={BEAT8_START - BEAT7_START}>
        <Beat7 />
      </Sequence>

      {/* Beat 8 — Yakaar attend */}
      <Sequence from={BEAT8_START} durationInFrames={BEAT9_START - BEAT8_START}>
        <Beat8 />
      </Sequence>

      {/* Beat 9 — 60% */}
      <Sequence from={BEAT9_START} durationInFrames={TOTAL_FRAMES - BEAT9_START}>
        <Beat9 />
      </Sequence>

    </AbsoluteFill>
  );
};

export const SENEGAL_ACTE2_FRAMES = TOTAL_FRAMES;
