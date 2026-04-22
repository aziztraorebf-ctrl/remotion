// Scene 5 assembled — "La barre formait un arc" + "il l'arracha du sol"
// 5A: Ken Burns zoom-in on bent bar (52.94s - 58.28s narration, 6s clip)
// 5B: Baobab uprooting start/end frame (59.34s - 65.02s narration, 7s clip)
// Total: 13s, narration-only (no Seedance audio on either sub-clip)

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  useCurrentFrame,
  staticFile,
} from "remotion";

const FPS = 30;

// -- Sub-clip durations --
const SCENE5A_DURATION_S = 6;
const SCENE5A_FRAMES = SCENE5A_DURATION_S * FPS; // 180
const SCENE5B_DURATION_S = 7;
const SCENE5B_FRAMES = SCENE5B_DURATION_S * FPS; // 210
const TOTAL_FRAMES = SCENE5A_FRAMES + SCENE5B_FRAMES; // 390 = 13s

// -- Assets --
const KENBURNS_IMAGE =
  "assets/sonjata-papercraft/clips/scene5a-kenburns-source.png";
const BAOBAB_CLIP =
  "assets/sonjata-papercraft/clips/scene5b-baobab-startend-7s.mp4";
const NARRATION = "audio/sonjata-papercraft/sonjata-short-v2.mp3";

// -- Narration timestamps (forced alignment source of truth) --
// Scene 5 narration: "La barre" 52.94s -> "sol." 65.02s
const NARRATION_START_S = 52.94;
const NARRATION_START_FRAMES = Math.round(NARRATION_START_S * FPS);

// "sol." ends at 65.02s -> relative end = 65.02 - 52.94 = 12.08s
const NARRATION_END_RELATIVE_S = 65.02 - NARRATION_START_S;
const NARRATION_END_RELATIVE_FRAMES = Math.round(
  NARRATION_END_RELATIVE_S * FPS
); // ~362

export const SONJATA_SCENE5_FRAMES = TOTAL_FRAMES;

// 5A: Ken Burns push-in on bent bar image
const Scene5AKenBurns: React.FC = () => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, SCENE5A_FRAMES], [1.0, 1.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(frame, [0, SCENE5A_FRAMES], [0, -80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale}) translateY(${translateY}px)`,
        transformOrigin: "center 45%",
      }}
    >
      <Img
        src={staticFile(KENBURNS_IMAGE)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

// Narration with fadeout after "sol." to prevent scene 6 bleed
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

export const SonjataScene5: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* 5A: Ken Burns (0 - 180 frames) */}
      <Sequence from={0} durationInFrames={SCENE5A_FRAMES} premountFor={FPS}>
        <Scene5AKenBurns />
      </Sequence>

      {/* 5B: Baobab clip (180 - 390 frames) */}
      <Sequence
        from={SCENE5A_FRAMES}
        durationInFrames={SCENE5B_FRAMES}
        premountFor={FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(BAOBAB_CLIP)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Narration: continuous from 52.94s, cutoff after "sol." */}
      <Sequence from={0} durationInFrames={TOTAL_FRAMES}>
        <NarrationWithCutoff />
      </Sequence>
    </AbsoluteFill>
  );
};
