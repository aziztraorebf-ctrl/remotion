// Scene 6 assembled — Exil, guerrier, messager
// 6A: Exil sunset (66.19s - 69.28s narration, 5s clip, no Seedance audio)
// 6B: Guerrier Mema (70.50s - 75.62s narration, 6s clip, WITH Seedance audio 30%)
// 6C: Messager arrive (76.30s - 82.98s narration, 6s clip, fire SFX at 30%)
// Total: 17s, narration continuous 66.19s - 82.98s

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
const SCENE6A_DURATION_S = 5;
const SCENE6A_FRAMES = SCENE6A_DURATION_S * FPS; // 150
const SCENE6B_DURATION_S = 6;
const SCENE6B_FRAMES = SCENE6B_DURATION_S * FPS; // 180
const SCENE6C_DURATION_S = 6;
const SCENE6C_FRAMES = SCENE6C_DURATION_S * FPS; // 180
const TOTAL_FRAMES = SCENE6A_FRAMES + SCENE6B_FRAMES + SCENE6C_FRAMES; // 510 = 17s

// -- Assets --
const CLIP_6A = "assets/sonjata-papercraft/clips/scene6a-exil-5s.mp4";
const CLIP_6B = "assets/sonjata-papercraft/clips/scene6b-guerrier-v2-6s.mp4";
const CLIP_6C = "assets/sonjata-papercraft/clips/scene6c-messager-6s.mp4";
const SFX_FIRE = "assets/sonjata-papercraft/sfx/fire-crackling-intense.mp3";
const NARRATION = "audio/sonjata-papercraft/sonjata-short-v2.mp3";

// -- Narration timestamps (forced alignment source of truth) --
// Scene 6: "Mais" 66.19s -> "pris." 82.98s
const NARRATION_START_S = 66.19;
const NARRATION_START_FRAMES = Math.round(NARRATION_START_S * FPS);

// Cutoff after "pris." at 82.98s -> relative: 82.98 - 66.19 = 16.79s
const NARRATION_END_RELATIVE_S = 82.98 - NARRATION_START_S;
const NARRATION_END_RELATIVE_FRAMES = Math.round(
  NARRATION_END_RELATIVE_S * FPS
); // ~504

export const SONJATA_SCENE6_FRAMES = TOTAL_FRAMES;

// Narration with fadeout after "pris." to prevent scene 7 bleed
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

export const SonjataScene6: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* 6A: Exil sunset (frames 0-150) */}
      <Sequence from={0} durationInFrames={SCENE6A_FRAMES} premountFor={FPS}>
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(CLIP_6A)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* 6B: Guerrier Mema (frames 150-330), with Seedance audio at 30% */}
      <Sequence
        from={SCENE6A_FRAMES}
        durationInFrames={SCENE6B_FRAMES}
        premountFor={FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(CLIP_6B)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Audio src={staticFile(CLIP_6B)} volume={0.3} />
        </AbsoluteFill>
      </Sequence>

      {/* 6C: Messager arrive (frames 330-510), with fire SFX at 30% */}
      <Sequence
        from={SCENE6A_FRAMES + SCENE6B_FRAMES}
        durationInFrames={SCENE6C_FRAMES}
        premountFor={FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(CLIP_6C)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Audio src={staticFile(SFX_FIRE)} volume={0.3} />
        </AbsoluteFill>
      </Sequence>

      {/* Narration: continuous from 66.19s, cutoff after "pris." */}
      <Sequence from={0} durationInFrames={TOTAL_FRAMES}>
        <NarrationWithCutoff />
      </Sequence>
    </AbsoluteFill>
  );
};
