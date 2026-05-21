/**
 * OrAfricainFull v4 — composition master 94.4s (post Perplexity fact-check 2026-05-07)
 *
 * Segments :
 *  Beat1 Hook -> Beat2 Contexte -> Beat3a Le Fait -> Beat3b Pression v2 (document conjoint)
 *  -> Beat4 Le Twist v2 (principale mine d'uranium) -> Beat5 Verdict v2 -> CTA.
 *
 * Architecture audio :
 * - Beats 1-3a partagent le master narration-or-africain-FINAL.mp3 (startFrom/endAt).
 * - Beat 3b v2, Beat 4 v2, Beat 5 v2, CTA ont chacun leur propre fichier audio.
 * - Beat1 et Beat5 recoivent globalMusic={true} pour desactiver leur <Audio musique> interne.
 *   La musique globale est jouee une seule fois au niveau Full (fade-in -> plateau -> fade-out).
 *
 * Render : Mapbox WebGL requis -> ./scripts/render-mapbox.sh OrAfricainFull out.mp4
 */

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  FPS,
  TOTAL_FRAMES,
  MUSIC_PATH,
  BEATS,
  AUDIO_SEGMENTS,
  BEAT3B_V3_DURATION_FRAMES,
  BEAT4_V2_DURATION_FRAMES,
  BEAT5_V2_DURATION_FRAMES,
  CTA_DURATION_FRAMES,
} from "./timing";
import { Beat1Hook } from "./Beat1Hook";
import { Beat2Contexte } from "./Beat2Contexte";
import { Beat3aLeFait } from "./Beat3aLeFait";
import { Beat3bPression } from "./Beat3bPression";
import { Beat4LeTwist } from "./Beat4LeTwist";
import { Beat5Verdict } from "./Beat5Verdict";
import { OrAfricainCTA } from "./OrAfricainCTA";
import { MapboxBrandingHide } from "../../_shared/mapbox/MapboxBase";

// Beat boundaries (absolute frames, derived from timing.ts BEATS)
const BEAT1_START = BEATS.beat1.startFrame;  // 0
const BEAT2_START = BEATS.beat2.startFrame;  // 292
const BEAT3A_START = 819;                     // master Beat 3a starts here
const BEAT3B_START = 1259;                    // f1259 — handoff to Beat 3b v2
const BEAT4_START = BEATS.beat4.startFrame;  // 1740
const BEAT5_START = BEATS.beat5.startFrame;  // 2412
const CTA_START = BEATS.cta.startFrame;       // 2713
const FULL_END = BEATS.cta.endFrame;          // 2833

const BEAT_BOUNDARIES = [
  BEAT2_START,
  BEAT3A_START,
  BEAT3B_START,
  BEAT4_START,
  BEAT5_START,
  CTA_START,
];
const TRANSITION_FADE = 4;

const TransitionFades: React.FC = () => {
  const frame = useCurrentFrame();
  let maxOpacity = 0;
  for (const b of BEAT_BOUNDARIES) {
    if (frame < b - TRANSITION_FADE || frame > b + TRANSITION_FADE) continue;
    const dist = Math.abs(frame - b);
    const op = interpolate(dist, [0, TRANSITION_FADE], [0.55, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    if (op > maxOpacity) maxOpacity = op;
  }
  if (maxOpacity <= 0) return null;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        opacity: maxOpacity,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
};

// Global music timeline
const MUSIC_FADE_IN_START = 90;
const MUSIC_FADE_IN_END = 150;
const MUSIC_TARGET_VOL = 0.10;
// Beat 5 v2 trigger : "Discrètement" rel frame 155 + BEAT5_START absolute, "parle." rel frame 270.
const MUSIC_FADE_OUT_START = BEAT5_START + AUDIO_SEGMENTS.discretement.startFrame;
const MUSIC_FADE_OUT_END = BEAT5_START + AUDIO_SEGMENTS.parle.endFrame;

export const OrAfricainFull: React.FC = () => {
  return (
    <AbsoluteFill>
      <MapboxBrandingHide />

      {/* SEGMENT 1 — Beat 1 Hook */}
      <Sequence from={BEAT1_START} durationInFrames={BEAT2_START - BEAT1_START}>
        <Beat1Hook globalMusic />
      </Sequence>

      {/* SEGMENT 2 — Beat 2 Contexte */}
      <Sequence from={BEAT2_START} durationInFrames={BEAT3A_START - BEAT2_START}>
        <Beat2Contexte />
      </Sequence>

      {/* SEGMENT 3 — Beat 3a Le Fait */}
      <Sequence from={BEAT3A_START} durationInFrames={BEAT3B_START - BEAT3A_START}>
        <Beat3aLeFait />
      </Sequence>

      {/* SEGMENT 4 — Beat 3b Pression v3 (document conjoint + Afrique du Sud) */}
      <Sequence from={BEAT3B_START} durationInFrames={BEAT3B_V3_DURATION_FRAMES}>
        <Beat3bPression />
      </Sequence>

      {/* SEGMENT 5 — Beat 4 Le Twist v2 (principale mine d'uranium) */}
      <Sequence from={BEAT4_START} durationInFrames={BEAT4_V2_DURATION_FRAMES}>
        <Beat4LeTwist />
      </Sequence>

      {/* SEGMENT 6 — Beat 5 Verdict v2 */}
      <Sequence from={BEAT5_START} durationInFrames={BEAT5_V2_DURATION_FRAMES}>
        <Beat5Verdict globalMusic />
      </Sequence>

      {/* SEGMENT 7 — CTA */}
      <Sequence from={CTA_START} durationInFrames={CTA_DURATION_FRAMES}>
        <OrAfricainCTA />
      </Sequence>

      <TransitionFades />

      {/* GLOBAL MUSIC */}
      <Audio
        src={staticFile(MUSIC_PATH)}
        volume={(f) => {
          const fadeIn = interpolate(
            f,
            [MUSIC_FADE_IN_START, MUSIC_FADE_IN_END],
            [0, MUSIC_TARGET_VOL],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const fadeOut = interpolate(
            f,
            [MUSIC_FADE_OUT_START, MUSIC_FADE_OUT_END],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return fadeIn * fadeOut;
        }}
      />
    </AbsoluteFill>
  );
};

export const OR_AFRICAIN_FULL_FRAMES = FULL_END;
