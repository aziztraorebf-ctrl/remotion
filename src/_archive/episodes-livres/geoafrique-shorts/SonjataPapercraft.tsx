// SonjataPapercraft - Scene 1 + Scene 2 Compositions
// Pipeline: Seedance clip + ElevenLabs narration + keep-and-duck audio

import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  useCurrentFrame,
  staticFile,
} from "remotion";

// -- Global constants --
const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1920;

// -- Asset paths --
const CLIP_SCENE1 = "assets/sonjata-papercraft/clips/scene1-prophetie-12s.mp4";
const CLIP_SCENE2 = "assets/sonjata-papercraft/clips/scene2-humiliation-v2-13s.mp4";
const NARRATION_AUDIO = "audio/sonjata-papercraft/sonjata-short-v2.mp3";

// ============================================================
// SCENE 1 — Prophetie + naissance (0.08s - 11.46s)
// ============================================================
const SCENE1_DURATION_S = 12;
const SCENE1_DURATION_FRAMES = SCENE1_DURATION_S * FPS;
const NARRATION_START_S = 0.08;
const NARRATION_START_FRAMES = Math.round(NARRATION_START_S * FPS);

export const SONJATA_PAPERCRAFT_SCENE1_FRAMES = SCENE1_DURATION_FRAMES;

export const SonjataPapercraftScene1: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence
        from={0}
        durationInFrames={SCENE1_DURATION_FRAMES}
        premountFor={FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(CLIP_SCENE1)}
            muted
            style={{ width: WIDTH, height: HEIGHT, objectFit: "cover" }}
          />
          <Audio src={staticFile(CLIP_SCENE1)} volume={0.3} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={0} durationInFrames={SCENE1_DURATION_FRAMES}>
        <Audio
          src={staticFile(NARRATION_AUDIO)}
          startFrom={NARRATION_START_FRAMES}
          volume={1.0}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

// ============================================================
// SCENE 2 — Humiliation Sassouma (12.14s - 24.68s)
// With dialogue mute zone: narration muted 20.30-24.68s,
// Seedance dialogue audio plays instead
// ============================================================
const SCENE2_DURATION_S = 13;
const SCENE2_DURATION_FRAMES = SCENE2_DURATION_S * FPS;

// Narration for scene 2 starts at 12.14s in the full audio file
const SCENE2_NARRATION_START_S = 12.14;
const SCENE2_NARRATION_START_FRAMES = Math.round(SCENE2_NARRATION_START_S * FPS);

// Mute zone: narration muted during the insult dialogue
// "humiliait sa mere." ends at 20.82s, "Ton fils..." starts at 21.72s in narration
// "animal." ends at 25.60s in narration
// Mute from 21.72s to 25.60s (global timeline) = let Seedance voice play the insult
// Relative to scene 2 audio start (12.14s):
const MUTE_START_RELATIVE_S = 21.72 - SCENE2_NARRATION_START_S; // 9.58s
const MUTE_END_RELATIVE_S = 25.60 - SCENE2_NARRATION_START_S; // 13.46s (extends past clip end, clamped below)
const MUTE_START_FRAME = Math.round(MUTE_START_RELATIVE_S * FPS); // ~287
// Clamp to clip duration — narration resumes in scene 3, not within this clip
const MUTE_END_FRAME = Math.min(Math.round(MUTE_END_RELATIVE_S * FPS), SCENE2_DURATION_FRAMES); // clamped to 390

// Seedance dialogue audio: boost from 30% to 100% during mute zone
const DIALOGUE_START_FRAME = MUTE_START_FRAME;
const DIALOGUE_END_FRAME = MUTE_END_FRAME;

export const SONJATA_PAPERCRAFT_SCENE2_FRAMES = SCENE2_DURATION_FRAMES;

const NarrationWithMute: React.FC = () => {
  const frame = useCurrentFrame();

  // Narration volume: 1.0 normally, 0.0 during mute zone
  // Quick fade (3 frames) to avoid click
  const narrationVolume = interpolate(
    frame,
    [MUTE_START_FRAME - 3, MUTE_START_FRAME, MUTE_END_FRAME, MUTE_END_FRAME + 3],
    [1, 0, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <Audio
      src={staticFile(NARRATION_AUDIO)}
      startFrom={SCENE2_NARRATION_START_FRAMES}
      volume={narrationVolume}
    />
  );
};

const SeedanceAudioDuck: React.FC = () => {
  const frame = useCurrentFrame();

  // Seedance audio: 30% normally (ambient), 100% during dialogue mute zone
  const seedanceVolume = interpolate(
    frame,
    [DIALOGUE_START_FRAME - 3, DIALOGUE_START_FRAME, DIALOGUE_END_FRAME, DIALOGUE_END_FRAME + 3],
    [0.3, 1.0, 1.0, 0.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return <Audio src={staticFile(CLIP_SCENE2)} volume={seedanceVolume} />;
};

export const SonjataPapercraftScene2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Scene 2 video clip */}
      <Sequence
        from={0}
        durationInFrames={SCENE2_DURATION_FRAMES}
        premountFor={FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(CLIP_SCENE2)}
            muted
            style={{ width: WIDTH, height: HEIGHT, objectFit: "cover" }}
          />
          {/* Seedance audio: 30% ambient, ramps to 100% during dialogue */}
          <SeedanceAudioDuck />
        </AbsoluteFill>
      </Sequence>

      {/* Narration: plays at 100%, muted during dialogue zone */}
      <Sequence from={0} durationInFrames={SCENE2_DURATION_FRAMES}>
        <NarrationWithMute />
      </Sequence>
    </AbsoluteFill>
  );
};
