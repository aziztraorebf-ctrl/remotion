// Composition test : Hook + S1 + S2 (Segment A) + Insert Pie Chart + S2 (Segment B)
// Validates : Hook+S1 (already validated v2) + S2 + Insert Pie integration with wipes + audio split
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { ATLAS_COLORS } from "./atlas-v2-components";
import { AtlasFlagDefs } from "./atlas-v2-flags";
import { AtlasSharedDefs } from "./atlas-v2-shared-defs";
import { AtlasV2HookScene } from "./scenes/AtlasV2HookScene";
import { AtlasV2S1Scene } from "./scenes/AtlasV2S1Scene";
import { AtlasV2S2Scene } from "./scenes/AtlasV2S2Scene";
import { AtlasV2InsertPieChart } from "./scenes/AtlasV2InsertPieChart";
import {
  T,
  AUDIO_SEGMENTS,
  MUSIC_VOLUME_DEFAULT,
  INSERT_DURATION_FRAMES,
} from "./timing-mansa-moussa-v2";

const FPS = 30;

// Wipe duration (in frames) at insert boundaries
const WIPE_DURATION = Math.round(0.5 * FPS);

// Wipe overlay : at insert start (wipe-in cover the map -> reveal scene)
//                at insert end (wipe-out cover the scene -> reveal map)
const WipeOverlay: React.FC<{ insertStart: number; insertEnd: number }> = ({
  insertStart,
  insertEnd,
}) => {
  const frame = useCurrentFrame();

  // Wipe in : from insertStart - WIPE_DURATION to insertStart
  // covers the map gradually with cream/gold band sweeping down
  const wipeInActive = frame >= insertStart - WIPE_DURATION && frame < insertStart;
  // Wipe out : from insertEnd - WIPE_DURATION to insertEnd
  const wipeOutActive = frame >= insertEnd - WIPE_DURATION && frame < insertEnd;

  if (!wipeInActive && !wipeOutActive) return null;

  const wipeProgress = wipeInActive
    ? interpolate(frame, [insertStart - WIPE_DURATION, insertStart], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : interpolate(frame, [insertEnd - WIPE_DURATION, insertEnd], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  const wipeY = wipeProgress * 1280;

  return (
    <rect
      x="0"
      y={wipeY - 24}
      width="720"
      height="24"
      fill="url(#wipeGrad)"
      opacity="0.95"
    />
  );
};

export const AtlasV2HookS1S2Test: React.FC = () => {
  const frame = useCurrentFrame();
  const vignetteOpacity = 0.85 + 0.15 * Math.sin(frame * 0.025);
  // Insert 1 boundaries (visual frames)
  const insert1Start = T.insert1Start;
  const insert1End = T.insert1End;

  // Audio segment 1 covers up to insert1Start (visual frame)
  const audioSeg1 = AUDIO_SEGMENTS[0];
  const audioSeg2 = AUDIO_SEGMENTS[1];

  return (
    <AbsoluteFill style={{ backgroundColor: ATLAS_COLORS.bgBottom }}>
      {/* Audio segment 1: 0 -> insert1Start */}
      <Sequence from={audioSeg1.visualStartFrame} durationInFrames={audioSeg1.durationFrames}>
        <Audio
          src={staticFile("atlas-mansa-moussa/narration-v3.mp3")}
          startFrom={Math.round(audioSeg1.narrationStartSec * FPS)}
          endAt={Math.round(audioSeg1.narrationEndSec * FPS)}
        />
      </Sequence>

      {/* Audio segment 2: insert1End -> ... (after insert) */}
      <Sequence
        from={audioSeg2.visualStartFrame}
        durationInFrames={Math.min(audioSeg2.durationFrames, T.climaxPivot - audioSeg2.visualStartFrame)}
      >
        <Audio
          src={staticFile("atlas-mansa-moussa/narration-v3.mp3")}
          startFrom={Math.round(audioSeg2.narrationStartSec * FPS)}
          endAt={Math.round(audioSeg2.narrationEndSec * FPS)}
        />
      </Sequence>

      {/* Background music continuous */}
      <Audio
        src={staticFile("atlas-mansa-moussa/music/C-mande-contemplatif.mp3")}
        volume={MUSIC_VOLUME_DEFAULT}
      />

      <svg
        viewBox="0 0 720 1280"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <AtlasSharedDefs />
        <AtlasFlagDefs mode="official" bandWidth={14} />

        {/* Hook (0-4s) */}
        <AtlasV2HookScene startFrame={T.start} endFrame={T.maliAppears} />

        {/* S1 Setup (4-19s) - until S2 starts at moitieOrFirst */}
        <AtlasV2S1Scene startFrame={T.maliAppears} endFrame={T.moitieOrFirst} />

        {/* S2 Densite Cesar - starts at moitieOrFirst, ends at climaxPivot */}
        {/* Note: insert1 happens IN THE MIDDLE of S2 (between moitieSerious and tombouctouAppears) */}
        <AtlasV2S2Scene
          startFrame={T.moitieOrFirst}
          endFrame={T.climaxPivot}
          moitieSerious={T.moitieSerious}
          tombouctouAppears={T.tombouctouAppears}
          sankoreAppears={T.sankoreAppears}
          insertStart={insert1Start}
          insertEnd={insert1End}
        />

        {/* Insert Pie Chart (overlay during insert window) */}
        <AtlasV2InsertPieChart startFrame={insert1Start} endFrame={insert1End} />

        {/* Wipe transitions at insert boundaries */}
        <WipeOverlay insertStart={insert1Start} insertEnd={insert1End} />

        {/* Vignette globale qui respire */}
        <rect
          x="0"
          y="0"
          width="720"
          height="1280"
          fill="url(#vignette)"
          opacity={vignetteOpacity}
          pointerEvents="none"
        />
      </svg>
    </AbsoluteFill>
  );
};

// Duration: covers from start to climaxPivot (S3 begins) + 0.5s tail
export const ATLAS_V2_HOOK_S1_S2_TEST_DURATION = T.climaxPivot + Math.round(0.5 * FPS);
