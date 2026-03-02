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
import { PixelWorldV5 } from "./projects/peste-1347-pixel/scenes/PixelWorldV5";
import { PixelWorldV6 } from "./projects/peste-1347-pixel/scenes/PixelWorldV6";
import { HookScene } from "./projects/peste-1347-pixel/scenes/HookScene";
import { HookSceneSideView } from "./projects/peste-1347-pixel/scenes/HookSceneSideView";
import { IsoVillageScene } from "./projects/peste-1347-pixel/scenes/IsoVillageScene";
import { VillageOpeningScene } from "./projects/peste-1347-pixel/scenes/VillageOpeningScene";
import { FPS as PESTE_FPS } from "./projects/peste-1347-pixel/config/timing";
import { HOOK_TOTAL_FRAMES } from "./projects/peste-1347-pixel/config/hookTiming";
import { HookBlocA } from "./projects/peste-1347-pixel/scenes/HookBlocA";
import { HookBlocB } from "./projects/peste-1347-pixel/scenes/HookBlocB";
import { HookBlocC } from "./projects/peste-1347-pixel/scenes/HookBlocC";
import { HookBlocD } from "./projects/peste-1347-pixel/scenes/HookBlocD";
import { HookBlocE } from "./projects/peste-1347-pixel/scenes/HookBlocE";
import { HookMaster } from "./projects/peste-1347-pixel/scenes/HookMaster";
import { Seg3Fuite } from "./projects/peste-1347-pixel/scenes/Seg3Fuite";
import { StyleSVG } from "./projects/style-tests/StyleSVG";
import { SVGVillageScene } from "./projects/style-tests/SVGVillageScene";
import { EngravingVillage } from "./projects/style-tests/EngravingVillage";
import StyleSketch from "./projects/style-tests/StyleSketch";
import StyleCutout from "./projects/style-tests/StyleCutout";
import StyleMotion from "./projects/style-tests/StyleMotion";
import StyleEngravings from "./projects/style-tests/StyleEngravings";
import { SideScrollProto } from "./projects/style-tests/SideScrollProto";
import { PaperCutProto } from "./projects/style-tests/PaperCutProto";
import { SideViewPrototypeCodex } from "./projects/style-tests/SideViewPrototypeCodex";
import { TopDownVillage } from "./projects/style-tests/TopDownVillage";
import { ParchmentTransition } from "./projects/style-tests/ParchmentTransition";
import { Enluminure } from "./projects/style-tests/Enluminure";
import { HookTransitionProto } from "./projects/style-tests/HookTransitionProto";
import { OrganicCharTest } from "./projects/style-tests/OrganicCharTest";
import { EnluminureGravureProto } from "./projects/style-tests/EnluminureGravureProto";
import { ParcheminMapProto } from "./projects/style-tests/ParcheminMapProto";
import { CharacterSheet } from "./projects/style-tests/CharacterSheet";
import { EffectsLab } from "./projects/style-tests/EffectsLab";
import { StyleShowcase } from "./projects/style-tests/showcase/StyleShowcase";
import { LionEtLaRiviere } from "./projects/silhouette-conte/scenes/LionEtLaRiviere";
import { VeilleurOmbre } from "./projects/veilleur-ombre/scenes/VeilleurOmbre";
import { TOTAL_FRAMES as VEILLEUR_FRAMES } from "./projects/veilleur-ombre/config/veilleurTiming";

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
          id="HookMaster"
          component={HookMaster}
          durationInFrames={2428}
          fps={PESTE_FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="Seg3Fuite"
          component={Seg3Fuite}
          durationInFrames={2620}
          fps={PESTE_FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="HookBlocA"
          component={HookBlocA}
          durationInFrames={706}
          fps={PESTE_FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="HookBlocB"
          component={HookBlocB}
          durationInFrames={1018}
          fps={PESTE_FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="HookBlocC"
          component={HookBlocC}
          durationInFrames={180}
          fps={PESTE_FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="HookBlocD"
          component={HookBlocD}
          durationInFrames={168}
          fps={PESTE_FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="HookBlocE"
          component={HookBlocE}
          durationInFrames={356}
          fps={PESTE_FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="HookBloc1"
          component={HookScene}
          durationInFrames={HOOK_TOTAL_FRAMES}
          fps={PESTE_FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="HookBloc1SideView"
          component={HookSceneSideView}
          durationInFrames={HOOK_TOTAL_FRAMES}
          fps={PESTE_FPS}
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
        <Composition
          id="PixelWorldV6"
          component={PixelWorldV6}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="IsoVillage"
          component={IsoVillageScene}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="VillageOpening"
          component={VillageOpeningScene}
          durationInFrames={360}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Folder name="style-tests">
        <Composition
          id="EngravingVillage"
          component={EngravingVillage}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="SVGVillageScene"
          component={SVGVillageScene}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="StyleSVG"
          component={StyleSVG}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="StyleSketch"
          component={StyleSketch}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="StyleCutout"
          component={StyleCutout}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="StyleMotion"
          component={StyleMotion}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="StyleEngravings"
          component={StyleEngravings}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="SideScrollProto"
          component={SideScrollProto}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="SideViewPrototypeCodexClean"
          component={SideViewPrototypeCodex}
          durationInFrames={360}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ debug: false }}
        />
        <Composition
          id="SideViewPrototypeCodexDebug"
          component={SideViewPrototypeCodex}
          durationInFrames={360}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ debug: true }}
        />
        <Composition
          id="TopDownVillage"
          component={TopDownVillage}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ParchmentTransition"
          component={ParchmentTransition}
          durationInFrames={360}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Enluminure"
          component={Enluminure}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="OrganicCharTest"
          component={OrganicCharTest}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="EnluminureGravureProto"
          component={EnluminureGravureProto}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ParcheminMapProto"
          component={ParcheminMapProto}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="CharacterSheet"
          component={CharacterSheet}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="EffectsLab"
          component={EffectsLab}
          durationInFrames={3000}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="StyleShowcase"
          component={StyleShowcase}
          durationInFrames={3000}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Folder name="silhouette-conte">
        <Composition
          id="LionEtLaRiviere"
          component={LionEtLaRiviere}
          durationInFrames={1800}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="VeilleurOmbre"
          component={VeilleurOmbre}
          durationInFrames={VEILLEUR_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Folder name="effect-lab">
        <Composition
          id="HookTransitionProto"
          component={HookTransitionProto}
          durationInFrames={90}
          fps={PESTE_FPS}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
