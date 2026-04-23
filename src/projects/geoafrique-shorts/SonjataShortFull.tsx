// Sonjata Papercraft — Full Short (hook + 10 scenes assembled)
// Total: ~151s (5s hook + 146s scenes 1-10)
// Hook: silent music (Option B), narration only, teases the "IL SE LEVE" climax
// Each scene has its own narration slice from sonjata-short-v2.mp3
// Background music: Minimax 2.6 Mande kora (Toumani Diabate style), starts at scene 1
//
// NEXT SESSION UPDATE (2026-04-22) — Cesar injections pending audio recharge:
//   Hook v2 narration : "Il ne pouvait pas marcher. Il a fonde un empire plus grand que l'Europe medievale."
//   (remplace l'actuel "Cet enfant ne peut pas se lever. Il fondera un empire africain.")
//   Rationale : chiffre-choc + pont universel Europe = +15-20% retention 0-5s
//   CTA narration : voir SonjataCTA.tsx pour nouveau texte avec "tu" direct.

import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
} from "remotion";

const FPS = 30;
const MUSIC_VOLUME = 0.15; // ~ -16.5dB under narration
const FADE_IN_FRAMES = 2 * FPS;
const FADE_OUT_FRAMES = 2 * FPS;

// -- Hook (opening) --
const HOOK_DURATION_S = 5;
const HOOK_FRAMES = HOOK_DURATION_S * FPS;

// -- Scene durations (from assembled clips) --
const SCENES = [
  { name: "scene1", file: "assets/sonjata-papercraft/clips/scene1-assembled.mp4", durationS: 12 },
  { name: "scene2", file: "assets/sonjata-papercraft/clips/scene2-assembled.mp4", durationS: 13 },
  { name: "scene3", file: "assets/sonjata-papercraft/clips/scene3-6panels-with-narration-v2.mp4", durationS: 13 },
  { name: "scene4", file: "assets/sonjata-papercraft/clips/scene4-final-keepandduck.mp4", durationS: 12 },
  { name: "scene5", file: "assets/sonjata-papercraft/clips/scene5-assembled.mp4", durationS: 13 },
  { name: "scene6", file: "assets/sonjata-papercraft/clips/scene6-assembled.mp4", durationS: 17 },
  { name: "scene7", file: "assets/sonjata-papercraft/clips/scene7-assembled.mp4", durationS: 24 },
  { name: "scene8", file: "assets/sonjata-papercraft/clips/scene8-assembled.mp4", durationS: 18 },
  { name: "scene9", file: "assets/sonjata-papercraft/clips/scene9-assembled.mp4", durationS: 8 },
  { name: "scene10", file: "assets/sonjata-papercraft/clips/scene10-assembled.mp4", durationS: 16 },
];

// Calculate start frames (scenes start AFTER the hook)
const sceneFrames = SCENES.map((s) => s.durationS * FPS);
const startFrames: number[] = [];
let cumulative = HOOK_FRAMES;
for (const f of sceneFrames) {
  startFrames.push(cumulative);
  cumulative += f;
}
const TOTAL_FRAMES = cumulative;
const SCENES_START_FRAME = HOOK_FRAMES;
const SCENES_DURATION = TOTAL_FRAMES - HOOK_FRAMES;

export const SONJATA_SHORT_FULL_FRAMES = TOTAL_FRAMES;

// Music starts at scene 1 (Option B: hook is silent except narration)
// Fade-in over 2s after scene 1 start, fade-out over 2s before total end
const musicVolume = (frame: number) => {
  const relativeFrame = frame; // frame inside <Sequence from={SCENES_START_FRAME}>, so 0-based
  const fadeIn = interpolate(
    relativeFrame,
    [0, FADE_IN_FRAMES],
    [0, MUSIC_VOLUME],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const fadeOut = interpolate(
    relativeFrame,
    [SCENES_DURATION - FADE_OUT_FRAMES, SCENES_DURATION],
    [MUSIC_VOLUME, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return Math.min(fadeIn, fadeOut);
};

export const SonjataShortFull: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Hook: silent opening with narration-only teaser */}
      <Sequence from={0} durationInFrames={HOOK_FRAMES} premountFor={FPS}>
        <OffthreadVideo
          src={staticFile("assets/sonjata-papercraft/hook/hook-struggle-5s.mp4")}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <Audio src={staticFile("audio/sonjata-papercraft/hook-narration.mp3")} />
      </Sequence>

      {/* 10 assembled scenes (each carries its own narration slice) */}
      {SCENES.map((scene, i) => (
        <Sequence
          key={scene.name}
          from={startFrames[i]}
          durationInFrames={sceneFrames[i]}
          premountFor={FPS}
        >
          <OffthreadVideo
            src={staticFile(scene.file)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>
      ))}

      {/* Background music — starts at scene 1, silence during hook */}
      <Sequence from={SCENES_START_FRAME} durationInFrames={SCENES_DURATION}>
        <Audio
          src={staticFile("audio/sonjata-papercraft/music-toumani.mp3")}
          volume={musicVolume}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
