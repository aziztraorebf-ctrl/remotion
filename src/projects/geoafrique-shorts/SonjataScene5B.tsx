// Scene 5B — Baobab arrache (start/end frame clip + narration)
// "Puis il marcha droit vers le plus grand baobab du village et il l'arracha du sol."
// Narration: ~59.34s - 65.02s in full audio
// No Seedance audio (start/end frame mode = no audio generated)

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
const DURATION_S = 7;
const DURATION_FRAMES = DURATION_S * FPS;

const CLIP = "assets/sonjata-papercraft/clips/scene5b-baobab-startend-7s.mp4";
const NARRATION_AUDIO = "audio/sonjata-papercraft/sonjata-short-v2.mp3";

// Scene 5B narration: "Puis" at 59.34s -> "sol." ends at 65.02s
// Duration: 5.68s. Clip is 7s -> mute narration after "sol."
const NARRATION_START_S = 59.34;
const NARRATION_START_FRAMES = Math.round(NARRATION_START_S * FPS);

// "sol." ends at 65.02s -> relative to clip start: 65.02 - 59.34 = 5.68s
const NARRATION_END_RELATIVE_FRAMES = Math.round(5.68 * FPS); // frame 170

export const SCENE5B_DURATION_FRAMES = DURATION_FRAMES;

const NarrationWithCutoff: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade out narration quickly after "sol." to prevent "Mais" from scene 6
  const volume = interpolate(
    frame,
    [NARRATION_END_RELATIVE_FRAMES - 3, NARRATION_END_RELATIVE_FRAMES],
    [1.0, 0.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <Audio
      src={staticFile(NARRATION_AUDIO)}
      startFrom={NARRATION_START_FRAMES}
      volume={volume}
    />
  );
};

export const SonjataScene5B: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence from={0} durationInFrames={DURATION_FRAMES} premountFor={FPS}>
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(CLIP)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={0} durationInFrames={DURATION_FRAMES}>
        <NarrationWithCutoff />
      </Sequence>
    </AbsoluteFill>
  );
};
