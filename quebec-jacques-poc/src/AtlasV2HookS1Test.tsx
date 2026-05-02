// Composition test : Hook (0-4s) + S1 Setup (4-16s) avec audio narration v3 (premiers 16s)
// But : valider Hook (globe + particules + titre) + S1 (crossfade + Mali drapeau + Empire reveal)
import {
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { AtlasDefs, ATLAS_COLORS } from "./atlas-v2-components";
import { AtlasFlagDefs } from "./atlas-v2-flags";
import { AtlasV2HookScene } from "./scenes/AtlasV2HookScene";
import { AtlasV2S1Scene } from "./scenes/AtlasV2S1Scene";
import { T, MUSIC_VOLUME_DEFAULT } from "./timing-mansa-moussa-v2";

const FPS = 30;

export const AtlasV2HookS1Test: React.FC = () => {
  const frame = useCurrentFrame();
  // Vignette qui respire : opacity oscille lentement
  const vignetteOpacity = 0.85 + 0.15 * Math.sin(frame * 0.025);
  return (
    <AbsoluteFill style={{ backgroundColor: ATLAS_COLORS.bgBottom }}>
      <Audio
        src={staticFile("atlas-mansa-moussa/narration-v3.mp3")}
        endAt={Math.round(16 * FPS)}
      />
      <Audio
        src={staticFile("atlas-mansa-moussa/music/C-mande-contemplatif.mp3")}
        volume={MUSIC_VOLUME_DEFAULT}
        endAt={Math.round(16 * FPS)}
      />

      <svg
        viewBox="0 0 720 1280"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <AtlasDefs />
        <AtlasFlagDefs mode="official" bandWidth={14} />

        <AtlasV2HookScene startFrame={T.start} endFrame={T.maliAppears} />
        <AtlasV2S1Scene startFrame={T.maliAppears} endFrame={T.moitieOrFirst} />

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

// Duration: covers Hook (0) -> end of S1 (T.moitieOrFirst = ~18.94s + small tail)
export const ATLAS_V2_HOOK_S1_TEST_DURATION = T.moitieOrFirst + Math.round(0.5 * FPS);
