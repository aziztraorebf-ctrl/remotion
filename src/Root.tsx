import { Composition, Folder } from "remotion";
import { BlankComposition } from "./BlankComposition";
import { CharacterTest } from "./projects/hello-world/scenes/CharacterTest";
import { HelloWorld } from "./projects/hello-world/scenes/HelloWorld";
import { SpeedReading } from "./projects/speed-reading/scenes/SpeedReading";
import {
  speedReadingConfig,
  getTotalDurationInFrames,
} from "./projects/speed-reading/config/speedReadingConfig";
import { RetroExplainer } from "./projects/retro-explainer/scenes/RetroExplainer";
import { DataVizExplainer } from "./projects/data-viz-explainer/scenes/DataVizExplainer";
import { BrutalistFinance } from "./projects/brutalist-finance/scenes/BrutalistFinance";
import { SCENE_TIMING } from "./projects/brutalist-finance/config/theme";
import { PestePixelScene } from "./projects/peste-1347-pixel/scenes/PestePixelScene";
import { StyleTestScene } from "./projects/peste-1347-pixel/scenes/StyleTestScene";
import { RecraftDemoScene } from "./projects/peste-1347-pixel/scenes/RecraftDemoScene";
import { SeedanceDemoScene } from "./projects/peste-1347-pixel/scenes/SeedanceDemoScene";
import { HD2DMockup } from "./projects/peste-1347-pixel/scenes/HD2DMockup";
import { PoorMansSpine } from "./projects/peste-1347-pixel/scenes/PoorMansSpine";
import { ParchmentHook } from "./projects/peste-1347-pixel/scenes/ParchmentHook";
import { PixelWorldDemo } from "./projects/peste-1347-pixel/scenes/PixelWorldDemo";
import { PixelWorldV2 } from "./projects/peste-1347-pixel/scenes/PixelWorldV2";
import { PixelWorldV3 } from "./projects/peste-1347-pixel/scenes/PixelWorldV3";
import { PixelWorldV4 } from "./projects/peste-1347-pixel/scenes/PixelWorldV4";
import { PixelWorldV5 } from "./projects/peste-1347-pixel/scenes/PixelWorldV5";
import { TOTAL_FRAMES as PESTE_TOTAL_FRAMES, FPS as PESTE_FPS } from "./projects/peste-1347-pixel/config/timing";

const speedReadingDuration = getTotalDurationInFrames(speedReadingConfig);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="hello-world">
        <Composition
          id="BlankComposition"
          component={BlankComposition}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="CharacterTest"
          component={CharacterTest}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="HelloWorld"
          component={HelloWorld}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Folder name="brain-challenges">
        <Composition
          id="SpeedReading"
          component={SpeedReading}
          durationInFrames={speedReadingDuration}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Folder name="retro-explainer">
        <Composition
          id="RetroExplainer"
          component={RetroExplainer}
          durationInFrames={960}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Folder name="data-viz-explainer">
        <Composition
          id="DataVizExplainer"
          component={DataVizExplainer}
          durationInFrames={2100}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Folder name="brutalist-finance">
        <Composition
          id="BrutalistFinance"
          component={BrutalistFinance}
          durationInFrames={SCENE_TIMING.totalFrames}
          fps={SCENE_TIMING.fps}
          width={1920}
          height={1080}
        />
      </Folder>
      <Folder name="peste-1347-pixel">
        <Composition
          id="PestePixelArt"
          component={PestePixelScene}
          durationInFrames={PESTE_TOTAL_FRAMES}
          fps={PESTE_FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="StyleTest"
          component={StyleTestScene}
          durationInFrames={600}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="RecraftDemo"
          component={RecraftDemoScene}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="SeedanceDemo"
          component={SeedanceDemoScene}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="HD2DMockup"
          component={HD2DMockup}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="PoorMansSpine"
          component={PoorMansSpine}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ParchmentHook"
          component={ParchmentHook}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="PixelWorldDemo"
          component={PixelWorldDemo}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="PixelWorldV2"
          component={PixelWorldV2}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="PixelWorldV3"
          component={PixelWorldV3}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="PixelWorldV4"
          component={PixelWorldV4}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="PixelWorldV5"
          component={PixelWorldV5}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
