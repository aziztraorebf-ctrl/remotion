// ATLAS MANSA MOUSSA V2 — Composition finale
// Hook + S1 + S2 + Insert1 Pie + S3 + Insert2 Bar + S4 + Insert3 Line + CTA
// Audio: 4 segments narration + 3 inserts audio + music continue
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
import { AtlasV2InsertLineChart } from "./scenes/AtlasV2InsertLineChart";
import { AtlasV2CtaScene } from "./scenes/AtlasV2CtaScene";
import { AtlasV2Subtitles } from "./scenes/AtlasV2Subtitles";
import { AtlasV2CtaChaine, ATLAS_CTA_CHAINE_FRAMES } from "./scenes/AtlasV2CtaChaine";
import {
  T,
  AUDIO_SEGMENTS,
  TOTAL_DURATION_FRAMES,
  MUSIC_VOLUME_DEFAULT,
  CTA_CHAINE_START,
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
  return (
    <rect
      x="0"
      y={wipeProgress * 1280 - 24}
      width="720"
      height="24"
      fill="url(#wipeGrad)"
      opacity="0.95"
    />
  );
};

export const AtlasMansaMoussaV2Final: React.FC = () => {
  const frame = useCurrentFrame();
  const vignetteOpacity = 0.85 + 0.15 * Math.sin(frame * 0.025);
  const { insert1Start, insert1End, insert2Start, insert2End, insert3Start, insert3End } = T;
  const [audioSeg1, audioSeg2, audioSeg3, audioSeg4] = AUDIO_SEGMENTS;

  return (
    <AbsoluteFill style={{ backgroundColor: ATLAS_COLORS.bgBottom }}>
      {/* AUDIO SEGMENT 1 : 0 -> insert1Start */}
      <Sequence from={audioSeg1.visualStartFrame} durationInFrames={audioSeg1.durationFrames}>
        <Audio
          src={staticFile("atlas-mansa-moussa/narration-v3.mp3")}
          startFrom={Math.round(audioSeg1.narrationStartSec * FPS)}
          endAt={Math.round(audioSeg1.narrationEndSec * FPS)}
        />
      </Sequence>

      {/* AUDIO INSERT 1 Bambouk */}
      <Sequence from={insert1Start} durationInFrames={insert1End - insert1Start}>
        <Audio src={staticFile("atlas-mansa-moussa/insert-1-bambouk.mp3")} />
      </Sequence>

      {/* AUDIO SEGMENT 2 : insert1End -> insert2Start */}
      <Sequence from={audioSeg2.visualStartFrame} durationInFrames={audioSeg2.durationFrames}>
        <Audio
          src={staticFile("atlas-mansa-moussa/narration-v3.mp3")}
          startFrom={Math.round(audioSeg2.narrationStartSec * FPS)}
          endAt={Math.round(audioSeg2.narrationEndSec * FPS)}
        />
      </Sequence>

      {/* AUDIO INSERT 2 Expeditions */}
      <Sequence from={insert2Start} durationInFrames={insert2End - insert2Start}>
        <Audio src={staticFile("atlas-mansa-moussa/insert-2-expeditions.mp3")} />
      </Sequence>

      {/* AUDIO SEGMENT 3 : insert2End -> insert3Start */}
      <Sequence from={audioSeg3.visualStartFrame} durationInFrames={audioSeg3.durationFrames}>
        <Audio
          src={staticFile("atlas-mansa-moussa/narration-v3.mp3")}
          startFrom={Math.round(audioSeg3.narrationStartSec * FPS)}
          endAt={Math.round(audioSeg3.narrationEndSec * FPS)}
        />
      </Sequence>

      {/* AUDIO INSERT 3 Mediterranee */}
      <Sequence from={insert3Start} durationInFrames={insert3End - insert3Start}>
        <Audio src={staticFile("atlas-mansa-moussa/insert-3-mediterranee.mp3")} />
      </Sequence>

      {/* AUDIO SEGMENT 4 : insert3End -> end */}
      <Sequence
        from={audioSeg4.visualStartFrame}
        durationInFrames={TOTAL_DURATION_FRAMES - audioSeg4.visualStartFrame}
      >
        <Audio
          src={staticFile("atlas-mansa-moussa/narration-v3.mp3")}
          startFrom={Math.round(audioSeg4.narrationStartSec * FPS)}
          endAt={Math.round(audioSeg4.narrationEndSec * FPS)}
        />
      </Sequence>

      {/* MUSIC continue tout le film */}
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

        {/* HOOK (0 -> maliAppears) */}
        <AtlasV2HookScene startFrame={T.start} endFrame={T.maliAppears} />

        {/* S1 Setup */}
        <AtlasV2S1Scene startFrame={T.maliAppears} endFrame={T.moitieOrFirst} />

        {/* S2 Densite */}
        <AtlasV2S2Scene
          startFrame={T.moitieOrFirst}
          endFrame={T.climaxPivot}
          moitieSerious={T.moitieSerious}
          tombouctouAppears={T.tombouctouAppears}
          sankoreAppears={T.sankoreAppears}
          insertStart={insert1Start}
          insertEnd={insert1End}
        />

        {/* INSERT 1 Pie Chart */}
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

        {/* INSERT 2 Bar Chart */}
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

        {/* INSERT 3 Line Chart */}
        <AtlasV2InsertLineChart startFrame={insert3Start} endFrame={insert3End} />
        <WipeOverlay insertStart={insert3Start} insertEnd={insert3End} />

        {/* CTA */}
        <AtlasV2CtaScene startFrame={T.mansaReveal} endFrame={TOTAL_DURATION_FRAMES} />

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

      {/* BLOC 7 — Karaoke subtitles overlay (HTML, above SVG) */}
      <AtlasV2Subtitles />

      {/* CTA chaine + newsletter (HTML, par-dessus tout) */}
      <Sequence from={CTA_CHAINE_START} durationInFrames={ATLAS_CTA_CHAINE_FRAMES}>
        <AtlasV2CtaChaine />
      </Sequence>
    </AbsoluteFill>
  );
};

export const ATLAS_MANSA_MOUSSA_V2_FINAL_DURATION = TOTAL_DURATION_FRAMES;
