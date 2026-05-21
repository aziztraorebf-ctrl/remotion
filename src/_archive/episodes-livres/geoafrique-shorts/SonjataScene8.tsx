// Scene 8 assembled — Mansa + Charte du Mande (18s)
// 8A: Sunjata Mansa devant Niani (109.34-118.22s narration, 9s clip, Seedance audio 30%)
// 8B: Proclamation Charte (118.24-126.94s narration, 9s clip, Seedance audio 30%)
// Total: 18s, narration continuous 109.34s - 126.94s

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
const SCENE8A_DURATION_S = 9;
const SCENE8A_FRAMES = SCENE8A_DURATION_S * FPS; // 270
const SCENE8B_DURATION_S = 9;
const SCENE8B_FRAMES = SCENE8B_DURATION_S * FPS; // 270
const TOTAL_FRAMES = SCENE8A_FRAMES + SCENE8B_FRAMES; // 540 = 18s

// -- Sub-clip start frames --
const START_8B = SCENE8A_FRAMES; // 270

// -- Assets --
const CLIP_8A = "assets/sonjata-papercraft/clips/scene8a-mansa-9s.mp4";
const CLIP_8B = "assets/sonjata-papercraft/clips/scene8b-charte-9s.mp4";
const NARRATION = "audio/sonjata-papercraft/sonjata-short-v2.mp3";

// -- Narration timestamps (forced alignment source of truth) --
// Scene 8: "Soundjata" 109.34s -> "Fouga." 126.94s
const NARRATION_START_S = 109.34;
const NARRATION_START_FRAMES = Math.round(NARRATION_START_S * FPS);

// Cutoff after "Fouga." at 126.94s -> relative: 126.94 - 109.34 = 17.60s
const NARRATION_END_RELATIVE_S = 126.94 - NARRATION_START_S;
const NARRATION_END_RELATIVE_FRAMES = Math.round(
  NARRATION_END_RELATIVE_S * FPS
); // ~528

export const SONJATA_SCENE8_FRAMES = TOTAL_FRAMES;

// Narration with fadeout after "Fouga." to prevent scene 9 bleed
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

export const SonjataScene8: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* 8A: Mansa devant Niani (frames 0-270), Seedance audio at 30% */}
      <Sequence from={0} durationInFrames={SCENE8A_FRAMES} premountFor={FPS}>
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(CLIP_8A)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Audio src={staticFile(CLIP_8A)} volume={0.3} />
        </AbsoluteFill>
      </Sequence>

      {/* 8B: Proclamation Charte (frames 270-540), Seedance audio at 30% */}
      <Sequence
        from={START_8B}
        durationInFrames={SCENE8B_FRAMES}
        premountFor={FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(CLIP_8B)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Audio src={staticFile(CLIP_8B)} volume={0.3} />
        </AbsoluteFill>
      </Sequence>

      {/* Narration: continuous from 109.34s, cutoff after "Fouga." */}
      <Sequence from={0} durationInFrames={TOTAL_FRAMES}>
        <NarrationWithCutoff />
      </Sequence>
    </AbsoluteFill>
  );
};
