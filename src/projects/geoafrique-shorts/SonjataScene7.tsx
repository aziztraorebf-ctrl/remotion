// Scene 7 assembled — Kirina combat (24s)
// 7A: Soumaoro et son armee (83.94-88.74s narration, 6s clip, SFX war drums 30%)
// 7B: Ergot de coq (89.80-94.24s narration, 5s clip, Seedance audio 30%)
// 7C: Arc tir (95.48-102.48s narration, 7s clip, Seedance audio 30%)
// 7D: Soumaoro disparait (103.50-108.22s narration, 6s clip, Seedance audio 30%)
// Total: 24s, narration continuous 83.94s - 108.22s

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

const FPS = 30;

// -- Sub-clip durations --
const SCENE7A_DURATION_S = 6;
const SCENE7A_FRAMES = SCENE7A_DURATION_S * FPS; // 180
const SCENE7B_DURATION_S = 5;
const SCENE7B_FRAMES = SCENE7B_DURATION_S * FPS; // 150
const SCENE7C_DURATION_S = 7;
const SCENE7C_FRAMES = SCENE7C_DURATION_S * FPS; // 210
const SCENE7D_DURATION_S = 6;
const SCENE7D_FRAMES = SCENE7D_DURATION_S * FPS; // 180
const TOTAL_FRAMES =
  SCENE7A_FRAMES + SCENE7B_FRAMES + SCENE7C_FRAMES + SCENE7D_FRAMES; // 720 = 24s

// -- Sub-clip start frames --
const START_7B = SCENE7A_FRAMES; // 180
const START_7C = START_7B + SCENE7B_FRAMES; // 330
const START_7D = START_7C + SCENE7C_FRAMES; // 540

// -- Assets --
const CLIP_7A = "assets/sonjata-papercraft/clips/scene7a-soumaoro-6s.mp4";
const CLIP_7B = "assets/sonjata-papercraft/clips/scene7b-ergot-v2-5s.mp4";
const CLIP_7C = "assets/sonjata-papercraft/clips/scene7c-arc-tir-v2-7s.mp4";
const CLIP_7D = "assets/sonjata-papercraft/clips/scene7d-defaite-6s.mp4";
const SFX_DRUMS = "assets/sonjata-papercraft/sfx/war-drums-menacing.mp3";
const NARRATION = "audio/sonjata-papercraft/sonjata-short-v2.mp3";

// -- Narration timestamps (forced alignment source of truth) --
// Scene 7: "Le" 83.94s -> "jamais." 108.22s
const NARRATION_START_S = 83.94;
const NARRATION_START_FRAMES = Math.round(NARRATION_START_S * FPS);

// Cutoff after "jamais." at 108.22s -> relative: 108.22 - 83.94 = 24.28s
const NARRATION_END_RELATIVE_S = 108.22 - NARRATION_START_S;
const NARRATION_END_RELATIVE_FRAMES = Math.round(
  NARRATION_END_RELATIVE_S * FPS
); // ~729

export const SONJATA_SCENE7_FRAMES = TOTAL_FRAMES;

// Narration with fadeout after "jamais." to prevent scene 8 bleed
const NarrationWithCutoff: React.FC = () => {
  const frame = useCurrentFrame();

  const volume = interpolate(
    frame,
    [NARRATION_END_RELATIVE_FRAMES - 3, NARRATION_END_RELATIVE_FRAMES],
    [1.0, 0.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <Audio
      src={staticFile(NARRATION)}
      startFrom={NARRATION_START_FRAMES}
      volume={volume}
    />
  );
};

export const SonjataScene7: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* 7A: Soumaoro et son armee (frames 0-180), SFX war drums at 30% */}
      <Sequence from={0} durationInFrames={SCENE7A_FRAMES} premountFor={FPS}>
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(CLIP_7A)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Audio src={staticFile(SFX_DRUMS)} volume={0.3} />
        </AbsoluteFill>
      </Sequence>

      {/* 7B: Ergot de coq (frames 180-330), Seedance audio at 30% */}
      <Sequence
        from={START_7B}
        durationInFrames={SCENE7B_FRAMES}
        premountFor={FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(CLIP_7B)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Audio src={staticFile(CLIP_7B)} volume={0.3} />
        </AbsoluteFill>
      </Sequence>

      {/* 7C: Arc tir (frames 330-540), Seedance audio at 30% */}
      <Sequence
        from={START_7C}
        durationInFrames={SCENE7C_FRAMES}
        premountFor={FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(CLIP_7C)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Audio src={staticFile(CLIP_7C)} volume={0.3} />
        </AbsoluteFill>
      </Sequence>

      {/* 7D: Soumaoro disparait (frames 540-720), Seedance audio at 30% */}
      <Sequence
        from={START_7D}
        durationInFrames={SCENE7D_FRAMES}
        premountFor={FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(CLIP_7D)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Audio src={staticFile(CLIP_7D)} volume={0.3} />
        </AbsoluteFill>
      </Sequence>

      {/* Narration: continuous from 83.94s, cutoff after "jamais." */}
      <Sequence from={0} durationInFrames={TOTAL_FRAMES}>
        <NarrationWithCutoff />
      </Sequence>
    </AbsoluteFill>
  );
};
