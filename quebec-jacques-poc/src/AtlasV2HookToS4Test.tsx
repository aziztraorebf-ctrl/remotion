// Composition test : Hook + S1 + S2 + Insert1 + S3 + Insert2 + S4 + Insert3
// Validates : full carte sequence with all 3 inserts + audio sync + texture papier
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
import { AtlasV2S4Scene } from "./scenes/AtlasV2S4Scene";
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

export const AtlasV2HookToS4Test: React.FC = () => {
  const frame = useCurrentFrame();
  const vignetteOpacity = 0.85 + 0.15 * Math.sin(frame * 0.025);
  const insert1Start = T.insert1Start;
  const insert1End = T.insert1End;
  const insert2Start = T.insert2Start;
  const insert2End = T.insert2End;
  const insert3Start = T.insert3Start;
  const insert3End = T.insert3End;

  const audioSeg1 = AUDIO_SEGMENTS[0];
  const audioSeg2 = AUDIO_SEGMENTS[1];
  const audioSeg3 = AUDIO_SEGMENTS[2];
  const audioSeg4 = AUDIO_SEGMENTS[3];

  // S4 ends at unSeulHomme (CTA boundary)
  const endVisual = T.unSeulHomme + Math.round(2.5 * FPS);

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

      {/* Audio insert 1 Bambouk */}
      <Sequence from={insert1Start} durationInFrames={insert1End - insert1Start}>
        <Audio src={staticFile("atlas-mansa-moussa/insert-1-bambouk.mp3")} />
      </Sequence>

      {/* Audio segment 2: insert1End -> insert2Start */}
      <Sequence from={audioSeg2.visualStartFrame} durationInFrames={audioSeg2.durationFrames}>
        <Audio
          src={staticFile("atlas-mansa-moussa/narration-v3.mp3")}
          startFrom={Math.round(audioSeg2.narrationStartSec * FPS)}
          endAt={Math.round(audioSeg2.narrationEndSec * FPS)}
        />
      </Sequence>

      {/* Audio insert 2 Expeditions */}
      <Sequence from={insert2Start} durationInFrames={insert2End - insert2Start}>
        <Audio src={staticFile("atlas-mansa-moussa/insert-2-expeditions.mp3")} />
      </Sequence>

      {/* Audio segment 3: insert2End -> insert3Start */}
      <Sequence from={audioSeg3.visualStartFrame} durationInFrames={audioSeg3.durationFrames}>
        <Audio
          src={staticFile("atlas-mansa-moussa/narration-v3.mp3")}
          startFrom={Math.round(audioSeg3.narrationStartSec * FPS)}
          endAt={Math.round(audioSeg3.narrationEndSec * FPS)}
        />
      </Sequence>

      {/* Audio insert 3 Mediterranee */}
      <Sequence from={insert3Start} durationInFrames={insert3End - insert3Start}>
        <Audio src={staticFile("atlas-mansa-moussa/insert-3-mediterranee.mp3")} />
      </Sequence>

      {/* Audio segment 4: insert3End -> end (cap at endVisual) */}
      <Sequence
        from={audioSeg4.visualStartFrame}
        durationInFrames={Math.min(audioSeg4.durationFrames, endVisual - audioSeg4.visualStartFrame)}
      >
        <Audio
          src={staticFile("atlas-mansa-moussa/narration-v3.mp3")}
          startFrom={Math.round(audioSeg4.narrationStartSec * FPS)}
          endAt={Math.round(audioSeg4.narrationEndSec * FPS)}
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

        {/* S4 Consequence */}
        <AtlasV2S4Scene
          startFrame={T.caireArrival}
          endFrame={T.mansaReveal}
          beats={{
            caireArrival: T.caireArrival,
            caireEffondre: T.caireEffondre,
            douzeAnsChute: T.douzeAnsChute,
            unSeulHomme: T.unSeulHomme,
            continentEffondre: T.continentEffondre,
          }}
          insertStart={insert3Start}
          insertEnd={insert3End}
        />

        {/* Insert 3 Line Chart NOT YET BUILT — using Bar as placeholder for audio sync */}
        {/* For now we show a gold rect during insert3 window so audio plays without visual gap */}
        {frame >= insert3Start && frame < insert3End && (
          <rect x="0" y="0" width="720" height="1280" fill="#0F1530" />
        )}
        <WipeOverlay insertStart={insert3Start} insertEnd={insert3End} />

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

export const ATLAS_V2_HOOK_TO_S4_TEST_DURATION =
  T.unSeulHomme + Math.round(2.5 * FPS);
