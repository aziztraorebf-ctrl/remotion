import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { interpolate } from "remotion";
import { SCENES, FPS } from "./timing-soundjata";

// ============================================================
// Soundjata - Transition Scenes (Trou B + Trou C)
// Ken Burns effect on still images with narration overlay
//
// Trou B "reaction" : 28.78s - 31.64s (86 frames)
//   Soundjata enfant au sol, zoom-in vers visage
//
// Trou C "neRamperaPlus" : 46.42s - 47.72s (39 frames)
//   Gros plan pieds plantes, leger zoom-out revelant barre tordue
// ============================================================

// Asset paths (staticFile resolves from public/)
const TROU_B_IMAGE =
  "assets/library/geoafrique/heros-oublies/soundjata/refs/acte2/trou-b-v2.png";
const TROU_C_IMAGE =
  "assets/library/geoafrique/heros-oublies/soundjata/refs/acte2/trou-c-v1.png";
const NARRATION_FULL =
  "assets/library/geoafrique/heros-oublies/soundjata/audio/narration-full.mp3";

// Durations derived from timing.ts scene boundaries
export const TROU_B_FRAMES = SCENES.reaction.end - SCENES.reaction.start;
export const TROU_C_FRAMES =
  SCENES.neRamperaPlus.end - SCENES.neRamperaPlus.start;

// Narration offsets in seconds (from master narration-full.mp3)
const NARRATION_OFFSET_B_S = 28.78;
const NARRATION_END_B_S = 31.64;
const NARRATION_OFFSET_C_S = 46.42;
const NARRATION_END_C_S = 47.72;

/**
 * Trou B — "reaction"
 * Ken Burns zoom-in on Soundjata's face (upper portion of image).
 * "Cette insulte va changer l'histoire de l'Afrique de l'Ouest."
 */
export const SoundjataReaction: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Slow zoom-in: scale 1.0 -> 1.3 over the full duration
  const scale = interpolate(frame, [0, TROU_B_FRAMES], [1.0, 1.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Image with Ken Burns zoom-in, centered on upper part (face) */}
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "50% 30%",
        }}
      >
        <Img
          src={staticFile(TROU_B_IMAGE)}
          style={{
            width,
            height,
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* Narration slice from master audio */}
      <Sequence from={0} durationInFrames={TROU_B_FRAMES} premountFor={1 * FPS}>
        <Audio
          src={staticFile(NARRATION_FULL)}
          startFrom={Math.round(NARRATION_OFFSET_B_S * FPS)}
          endAt={Math.round(NARRATION_END_B_S * FPS)}
          volume={1.0}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

/**
 * Trou C — "neRamperaPlus"
 * Ken Burns zoom-out revealing feet planted + twisted iron bar.
 * "Il ne rampera plus jamais."
 */
export const SoundjataNePlus: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Zoom-out: scale 1.2 -> 1.0 to reveal the full scene
  const scale = interpolate(frame, [0, TROU_C_FRAMES], [1.2, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Image with Ken Burns zoom-out, centered on lower portion (feet) */}
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "50% 70%",
        }}
      >
        <Img
          src={staticFile(TROU_C_IMAGE)}
          style={{
            width,
            height,
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* Narration slice from master audio */}
      <Sequence
        from={0}
        durationInFrames={TROU_C_FRAMES}
        premountFor={1 * FPS}
      >
        <Audio
          src={staticFile(NARRATION_FULL)}
          startFrom={Math.round(NARRATION_OFFSET_C_S * FPS)}
          endAt={Math.round(NARRATION_END_C_S * FPS)}
          volume={1.0}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
