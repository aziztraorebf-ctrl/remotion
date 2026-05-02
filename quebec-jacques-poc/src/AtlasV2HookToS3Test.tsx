// Composition cumulative test : Hook + S1 + S2 + Insert1 + S3 + Insert2
// Validates : Insert Bar Chart placement after S3 Climax Hadj + S3 fully integrated
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
import { AtlasV2S3Scene } from "./scenes/AtlasV2S3Scene";
import { AtlasV2InsertPieChart } from "./scenes/AtlasV2InsertPieChart";
import { AtlasV2InsertBarChart } from "./scenes/AtlasV2InsertBarChart";
import {
  T,
  AUDIO_SEGMENTS,
  MUSIC_VOLUME_DEFAULT,
} from "./timing-mansa-moussa-v2";

const FPS = 30;
const WIPE_DURATION = Math.round(0.5 * FPS);

const WipeOverlay: React.FC<{ insertStart: number; insertEnd: number }> = ({
  insertStart,
  insertEnd,
}) => {
  const frame = useCurrentFrame();

  const wipeInActive = frame >= insertStart - WIPE_DURATION && frame < insertStart;
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

export const AtlasV2HookToS3Test: React.FC = () => {
  const frame = useCurrentFrame();
  const vignetteOpacity = 0.85 + 0.15 * Math.sin(frame * 0.025);
  const insert1Start = T.insert1Start;
  const insert1End = T.insert1End;
  const insert2Start = T.insert2Start;
  const insert2End = T.insert2End;

  const audioSeg1 = AUDIO_SEGMENTS[0];
  const audioSeg2 = AUDIO_SEGMENTS[1];
  const audioSeg3 = AUDIO_SEGMENTS[2];

  return (
    <AbsoluteFill style={{ backgroundColor: ATLAS_COLORS.bgBottom }}>
      {/* Audio segment 1: 0 -> insert1Start (narration 0-22.5s) */}
      <Sequence from={audioSeg1.visualStartFrame} durationInFrames={audioSeg1.durationFrames}>
        <Audio
          src={staticFile("atlas-mansa-moussa/narration-v3.mp3")}
          startFrom={Math.round(audioSeg1.narrationStartSec * FPS)}
          endAt={Math.round(audioSeg1.narrationEndSec * FPS)}
        />
      </Sequence>

      {/* Audio insert 1 Bambouk (during pie chart) */}
      <Sequence from={insert1Start} durationInFrames={insert1End - insert1Start}>
        <Audio src={staticFile("atlas-mansa-moussa/insert-1-bambouk.mp3")} />
      </Sequence>

      {/* Audio segment 2: insert1End -> insert2Start (narration 22.5-48.52s) */}
      <Sequence from={audioSeg2.visualStartFrame} durationInFrames={audioSeg2.durationFrames}>
        <Audio
          src={staticFile("atlas-mansa-moussa/narration-v3.mp3")}
          startFrom={Math.round(audioSeg2.narrationStartSec * FPS)}
          endAt={Math.round(audioSeg2.narrationEndSec * FPS)}
        />
      </Sequence>

      {/* Audio insert 2 Expeditions (during bar chart) */}
      <Sequence from={insert2Start} durationInFrames={insert2End - insert2Start}>
        <Audio src={staticFile("atlas-mansa-moussa/insert-2-expeditions.mp3")} />
      </Sequence>

      {/* Audio segment 3: insert2End -> ... (narration 48.52-59.68s) - cap at end of test */}
      <Sequence
        from={audioSeg3.visualStartFrame}
        durationInFrames={Math.min(audioSeg3.durationFrames, T.caireArrival - audioSeg3.visualStartFrame)}
      >
        <Audio
          src={staticFile("atlas-mansa-moussa/narration-v3.mp3")}
          startFrom={Math.round(audioSeg3.narrationStartSec * FPS)}
          endAt={Math.round(audioSeg3.narrationEndSec * FPS)}
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

        {/* S1 Setup */}
        <AtlasV2S1Scene startFrame={T.maliAppears} endFrame={T.moitieOrFirst} />

        {/* S2 Densite Cesar */}
        <AtlasV2S2Scene
          startFrame={T.moitieOrFirst}
          endFrame={T.climaxPivot}
          moitieSerious={T.moitieSerious}
          tombouctouAppears={T.tombouctouAppears}
          sankoreAppears={T.sankoreAppears}
          insertStart={insert1Start}
          insertEnd={insert1End}
        />

        {/* Insert 1 Pie Chart */}
        <AtlasV2InsertPieChart startFrame={insert1Start} endFrame={insert1End} />
        <WipeOverlay insertStart={insert1Start} insertEnd={insert1End} />

        {/* S3 Climax Hadj */}
        <AtlasV2S3Scene
          startFrame={T.climaxPivot}
          endFrame={T.caireArrival}
          beats={{
            climaxPivot: T.climaxPivot,
            douzeCouronnement: T.douzeCouronnement,
            mecqueDeparture: T.mecqueDeparture,
            mecqueWord: T.mecqueWord,
            soixanteHommes: T.soixanteHommes,
            douzeMille: T.douzeMille,
            chameaux: T.chameaux,
          }}
        />

        {/* Insert 2 Bar Chart */}
        <AtlasV2InsertBarChart startFrame={insert2Start} endFrame={insert2End} />
        <WipeOverlay insertStart={insert2Start} insertEnd={insert2End} />

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

// Duration: from start to S4 begin (T.caireArrival) + 0.5s tail
export const ATLAS_V2_HOOK_TO_S3_TEST_DURATION = T.caireArrival + Math.round(0.5 * FPS);
