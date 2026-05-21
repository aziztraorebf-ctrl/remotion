import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { interpolate } from "remotion";

// ============================================================
// Soundjata - Actes I a III : Assemblage continu
// Duree totale : 47.72s = 1432 frames @ 30fps
// Format : 1080x1920 (9:16)
//
// Audio strategy:
//   Layer 1: narration-full.mp3 en continu (volume 1.0)
//   Layer 2: clips Seedance keep-and-duck (volume 0.3)
//   Iron-bar clip: muted
//   Ken Burns (Trou B, Trou C): pas d'audio propre
//
// Timeline (frames absolus @ 30fps):
//   f0-f364     acte1-setup-v1.mp4 (Seedance, keep-and-duck 30%)
//   f364-f379   silence/noir (0.52s gap)
//   f379-f470   iron-bar-v1.mp4 DEBUT (0-3.04s du clip, muted)
//   f473-f625   provocation.mp4 (Seedance, keep-and-duck 30%)
//   f625-f637   silence/noir (0.40s gap)
//   f637-f863   acte2-insulte.mp4 (Seedance, keep-and-duck 30%)
//   f863-f949   TROU B Ken Burns zoom-in trou-b-v2.png
//   f949-f962   silence/noir (0.42s gap)
//   f962-f1382  iron-bar-v1.mp4 SUITE (3.04s-15.06s du clip, muted)
//   f1382-f1393 silence/noir (0.34s gap)
//   f1393-f1432 TROU C Ken Burns zoom-out trou-c-v1.png
// ============================================================

const FPS = 30;
export const SOUNDJATA_ACTES_I_III_FRAMES = 1432;
export const SOUNDJATA_ACTES_I_III_ID = "SoundjataActes-I-III";

// -- Asset paths (all relative to public/) --
const ASSET_ROOT =
  "assets/library/geoafrique/heros-oublies/soundjata/";

const CLIPS = {
  acte1Setup: `${ASSET_ROOT}clips-validated/acte1-setup-v1.mp4`,
  provocation: `${ASSET_ROOT}clips-validated/acte2-setup-humiliation.mp4`,
  insulte: `${ASSET_ROOT}clips-validated/acte2-insulte.mp4`,
  ironBar: `${ASSET_ROOT}clips-validated/acte3-iron-bar-v1.mp4`,
};

const IMAGES = {
  trouB: `${ASSET_ROOT}refs/acte2/trou-b-v2.png`,
  trouC: `${ASSET_ROOT}refs/acte2/trou-c-v1.png`,
};

const NARRATION = `${ASSET_ROOT}audio/narration-full.mp3`;

// -- Timeline constants (absolute frames) --
const TIMELINE = {
  acte1Setup:    { from: 0,    duration: 364 },   // 0.00s - 12.12s
  ironBarPart1:  { from: 379,  duration: 91 },    // 12.64s - 15.68s (3.04s)
  provocation:   { from: 473,  duration: 152 },   // 15.76s - 20.82s
  insulte:       { from: 637,  duration: 226 },   // 21.22s - 28.78s
  trouB:         { from: 863,  duration: 86 },    // 28.78s - 31.64s
  ironBarPart2:  { from: 962,  duration: 420 },   // 32.06s - 46.08s
  trouC:         { from: 1393, duration: 39 },    // 46.42s - 47.72s
};

// Iron bar clip offsets (in clip-local frames)
const IRON_BAR_PART1_START_IN_CLIP = 0;
const IRON_BAR_PART2_START_IN_CLIP = Math.round(3.04 * FPS); // ~91 frames

// -- Ken Burns sub-components --

const KenBurnsTrouB: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Zoom-in: scale 1.0 -> 1.3 over 86 frames
  const scale = interpolate(
    frame,
    [0, TIMELINE.trouB.duration],
    [1.0, 1.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "50% 30%",
        }}
      >
        <Img
          src={staticFile(IMAGES.trouB)}
          style={{ width, height, objectFit: "cover" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const KenBurnsTrouC: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Zoom-out: scale 1.2 -> 1.0 over 39 frames
  const scale = interpolate(
    frame,
    [0, TIMELINE.trouC.duration],
    [1.2, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "50% 70%",
        }}
      >
        <Img
          src={staticFile(IMAGES.trouC)}
          style={{ width, height, objectFit: "cover" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// -- Main composition --

export const SoundjataActesI_III: React.FC = () => {
  const { width, height } = useVideoConfig();

  const videoStyle: React.CSSProperties = {
    width,
    height,
    objectFit: "cover" as const,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* === AUDIO: Narration continue sur toute la composition === */}
      <Audio
        src={staticFile(NARRATION)}
        startFrom={0}
        endAt={SOUNDJATA_ACTES_I_III_FRAMES}
        volume={1.0}
      />

      {/* === SEGMENT 1: Acte 1 Setup (Seedance, keep-and-duck 30%) === */}
      <Sequence
        from={TIMELINE.acte1Setup.from}
        durationInFrames={TIMELINE.acte1Setup.duration}
        premountFor={1 * FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(CLIPS.acte1Setup)}
            style={videoStyle}
            volume={0.3}
          />
        </AbsoluteFill>
      </Sequence>

      {/* === SEGMENT 2: Iron Bar Part 1 (muted, frames 0-3.04s du clip) === */}
      <Sequence
        from={TIMELINE.ironBarPart1.from}
        durationInFrames={TIMELINE.ironBarPart1.duration}
        premountFor={1 * FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(CLIPS.ironBar)}
            startFrom={IRON_BAR_PART1_START_IN_CLIP}
            style={videoStyle}
            muted
          />
        </AbsoluteFill>
      </Sequence>

      {/* === SEGMENT 3: Provocation (Seedance, keep-and-duck 30%) === */}
      <Sequence
        from={TIMELINE.provocation.from}
        durationInFrames={TIMELINE.provocation.duration}
        premountFor={1 * FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(CLIPS.provocation)}
            style={videoStyle}
            volume={0.3}
          />
        </AbsoluteFill>
      </Sequence>

      {/* === SEGMENT 4: Insulte (Seedance, keep-and-duck 30%) === */}
      <Sequence
        from={TIMELINE.insulte.from}
        durationInFrames={TIMELINE.insulte.duration}
        premountFor={1 * FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(CLIPS.insulte)}
            style={videoStyle}
            volume={0.3}
          />
        </AbsoluteFill>
      </Sequence>

      {/* === SEGMENT 5: Trou B - Ken Burns zoom-in === */}
      <Sequence
        from={TIMELINE.trouB.from}
        durationInFrames={TIMELINE.trouB.duration}
        premountFor={1 * FPS}
      >
        <KenBurnsTrouB />
      </Sequence>

      {/* === SEGMENT 6: Iron Bar Part 2 (muted, from 3.04s in clip) === */}
      <Sequence
        from={TIMELINE.ironBarPart2.from}
        durationInFrames={TIMELINE.ironBarPart2.duration}
        premountFor={1 * FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(CLIPS.ironBar)}
            startFrom={IRON_BAR_PART2_START_IN_CLIP}
            style={videoStyle}
            muted
          />
        </AbsoluteFill>
      </Sequence>

      {/* === SEGMENT 7: Trou C - Ken Burns zoom-out === */}
      <Sequence
        from={TIMELINE.trouC.from}
        durationInFrames={TIMELINE.trouC.duration}
        premountFor={1 * FPS}
      >
        <KenBurnsTrouC />
      </Sequence>
    </AbsoluteFill>
  );
};
