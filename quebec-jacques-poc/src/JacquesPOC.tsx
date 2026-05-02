import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Scene001IntroV2 as Scene001Intro } from "./scenes/Scene001IntroV2";
import { Scene002Title } from "./scenes/Scene002Title";
import { Scene003SizeV2 as Scene003Size } from "./scenes/Scene003SizeV2";
import { Scene004RiverV2 as Scene004River } from "./scenes/Scene004RiverV2";

// Force alignment timestamps (seconds → frames at 30fps)
const TIMELINE = {
  scene001: { start: 0,      end: 8.539  },
  scene002: { start: 8.539,  end: 9.779  },
  scene003: { start: 9.779,  end: 34.639 },
  scene004: { start: 34.639, end: 38.639 },
};

const toFrame = (seconds: number) => Math.round(seconds * 30);

const SCENE_FRAMES = {
  s1Start: toFrame(TIMELINE.scene001.start),
  s2Start: toFrame(TIMELINE.scene002.start),
  s3Start: toFrame(TIMELINE.scene003.start),
  s4Start: toFrame(TIMELINE.scene004.start),
  total:   toFrame(TIMELINE.scene004.end) + 30,
};

export const JacquesPOC: React.FC = () => {
  const frame = useCurrentFrame();

  const currentScene =
    frame < SCENE_FRAMES.s2Start ? 1 :
    frame < SCENE_FRAMES.s3Start ? 2 :
    frame < SCENE_FRAMES.s4Start ? 3 : 4;

  const transitionOpacity = (sceneStartFrame: number) =>
    interpolate(frame, [sceneStartFrame, sceneStartFrame + 6], [0, 1], {
      extrapolateLeft: "extend",
      extrapolateRight: "clamp",
    });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("assets/audio/narration.mp3")} />

      {currentScene === 1 && (
        <AbsoluteFill style={{ opacity: transitionOpacity(SCENE_FRAMES.s1Start) }}>
          <Scene001Intro startFrame={SCENE_FRAMES.s1Start} />
        </AbsoluteFill>
      )}

      {currentScene === 2 && (
        <AbsoluteFill style={{ opacity: transitionOpacity(SCENE_FRAMES.s2Start) }}>
          <Scene002Title startFrame={SCENE_FRAMES.s2Start} />
        </AbsoluteFill>
      )}

      {currentScene === 3 && (
        <AbsoluteFill style={{ opacity: transitionOpacity(SCENE_FRAMES.s3Start) }}>
          <Scene003Size startFrame={SCENE_FRAMES.s3Start} />
        </AbsoluteFill>
      )}

      {currentScene === 4 && (
        <AbsoluteFill style={{ opacity: transitionOpacity(SCENE_FRAMES.s4Start) }}>
          <Scene004River startFrame={SCENE_FRAMES.s4Start} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export { SCENE_FRAMES };
