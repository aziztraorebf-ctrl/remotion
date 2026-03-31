import { Composition, Folder } from "remotion";
import { BlankComposition } from "./BlankComposition";
import { FPS as PESTE_FPS } from "./projects/peste-1347-pixel/config/timing";
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
import { TopDownVillage } from "./projects/style-tests/TopDownVillage";
import { ParchmentTransition } from "./projects/style-tests/ParchmentTransition";
import { Enluminure } from "./projects/style-tests/Enluminure";
import { HookTransitionProto } from "./projects/style-tests/HookTransitionProto";
import { OrganicCharTest } from "./projects/style-tests/OrganicCharTest";
import { EnluminureGravureProto } from "./projects/style-tests/EnluminureGravureProto";
import { ParcheminMapProto } from "./projects/style-tests/ParcheminMapProto";
import { CharacterSheet } from "./projects/style-tests/CharacterSheet";
import { EffectsLab } from "./projects/style-tests/EffectsLab";
import { GeoLabBW } from "./projects/style-tests/GeoLabBW";
import { RecraftFlotteTest } from "./projects/style-tests/RecraftFlotteTest";
import { VerticalFlotteShort } from "./projects/geoafrique-shorts/components/VerticalFlotteShort";
import { GeoStyleShowcase } from "./projects/style-tests/GeoStyleShowcase";
import { GeoAdvanced } from "./projects/style-tests/GeoAdvanced";
import { GeoAdvancedV2 } from "./projects/style-tests/GeoAdvancedV2";
import { GeoShortProto } from "./projects/style-tests/GeoShortProto";
import { GeoShortV2 } from "./projects/style-tests/GeoShortV2";
import { GeoShortTaiwan } from "./projects/style-tests/GeoShortTaiwan";
import { InfoShortDollar } from "./projects/style-tests/InfoShortDollar";
import { ParcheminLab } from "./projects/style-tests/ParcheminLab";
import { StickFigureProto } from "./projects/style-tests/StickFigureProto";
import { CharInteractionDemo } from "./projects/style-tests/CharInteractionDemo";
import { AmanirenasBattleMap } from "./projects/style-tests/AmanirenasBattleMap";
import { HannibalNarration } from "./projects/style-tests/HannibalNarration";
import { HannibalAlpesSequence } from "./projects/style-tests/HannibalAlpesSequence";
import { StyleShowcase } from "./projects/style-tests/showcase/StyleShowcase";
import { LionEtLaRiviere } from "./projects/silhouette-conte/scenes/LionEtLaRiviere";
import { VeilleurOmbre } from "./projects/veilleur-ombre/scenes/VeilleurOmbre";
import { SilhouetteShowcase } from "./projects/veilleur-ombre/scenes/SilhouetteShowcase";
import { ColorComparison } from "./projects/veilleur-ombre/scenes/ColorComparison";
import { ContrastLab } from "./projects/veilleur-ombre/scenes/ContrastLab";
import { NightPaletteFinal } from "./projects/veilleur-ombre/scenes/NightPaletteFinal";
import { NightPaletteFinalV2 } from "./projects/veilleur-ombre/scenes/NightPaletteFinalV2";
import { UnParmiTous } from "./projects/silhouette-questions/scenes/UnParmiTous";
import { TOTAL_FRAMES as VEILLEUR_FRAMES } from "./projects/veilleur-ombre/config/veilleurTiming";
import { AbouBakariShort } from "./projects/geoafrique-shorts/AbouBakariShort";
import { ThiaroyeShort } from "./projects/geoafrique-shorts/ThiaroyeShort";
import { SeedanceTest } from "./projects/geoafrique-shorts/SeedanceTest";
import { Beat01DollyInTest } from "./projects/geoafrique-shorts/Beat01DollyInTest";
import { Beat01OceanOverlayTest } from "./projects/geoafrique-shorts/Beat01OceanOverlayTest";
import { Beat03FleetManifest } from "./projects/geoafrique-shorts/components/Beat03FleetManifest";
import { TOTAL_FRAMES_WITH_CTA as ABOU_FRAMES, BEATS } from "./projects/geoafrique-shorts/timing";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="geoafrique-shorts">
        <Composition
          id="AbouBakariShort"
          component={AbouBakariShort}
          durationInFrames={ABOU_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="ThiaroyeShort"
          component={ThiaroyeShort}
          durationInFrames={3302}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="VerticalFlotteShort"
          component={VerticalFlotteShort}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Beat01DollyInTest"
          component={Beat01DollyInTest}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Beat01OceanOverlayTest"
          component={Beat01OceanOverlayTest}
          durationInFrames={408}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SeedanceTest"
          component={SeedanceTest}
          durationInFrames={450}
          fps={30}
          width={1280}
          height={720}
        />
        <Composition
          id="Beat03FleetManifest"
          component={Beat03FleetManifest}
          durationInFrames={BEATS.fleet.end - BEATS.fleet.start}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
      <Folder name="peste-1347">
        <Composition
          id="HookMaster"
          component={HookMaster}
          durationInFrames={2428}
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
          id="Seg3Fuite"
          component={Seg3Fuite}
          durationInFrames={2588}
          fps={PESTE_FPS}
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
          id="GeoLabBW"
          component={GeoLabBW}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="GeoStyleShowcase"
          component={GeoStyleShowcase}
          durationInFrames={2100}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="GeoAdvanced"
          component={GeoAdvanced}
          durationInFrames={1200}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="GeoAdvancedV2"
          component={GeoAdvancedV2}
          durationInFrames={1500}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="GeoShortProto"
          component={GeoShortProto}
          durationInFrames={1350}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="GeoShortV2"
          component={GeoShortV2}
          durationInFrames={1800}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="GeoShortTaiwan"
          component={GeoShortTaiwan}
          durationInFrames={2160}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="InfoShortDollar"
          component={InfoShortDollar}
          durationInFrames={2100}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="StickFigureProto"
          component={StickFigureProto}
          durationInFrames={1800}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="CharInteractionDemo"
          component={CharInteractionDemo}
          durationInFrames={1800}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ParcheminLab"
          component={ParcheminLab}
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
        <Composition
          id="RecraftFlotteTest"
          component={RecraftFlotteTest}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="AmanirenasBattleMap"
          component={AmanirenasBattleMap}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="HannibalNarration"
          component={HannibalNarration}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="HannibalAlpesSequence"
          component={HannibalAlpesSequence}
          durationInFrames={542}
          fps={30}
          width={1080}
          height={1920}
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
      </Folder>
      <Folder name="veilleur-ombre">
        <Composition
          id="VeilleurOmbre"
          component={VeilleurOmbre}
          durationInFrames={VEILLEUR_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="SilhouetteShowcase"
          component={SilhouetteShowcase}
          durationInFrames={1200}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ColorComparison"
          component={ColorComparison}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ContrastLab"
          component={ContrastLab}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="NightPaletteFinal"
          component={NightPaletteFinal}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="NightPaletteFinalV2"
          component={NightPaletteFinalV2}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Folder name="silhouette-questions">
        <Composition
          id="UnParmiTous"
          component={UnParmiTous}
          durationInFrames={3600}
          fps={30}
          width={1080}
          height={1920}
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
        <Composition
          id="BlankComposition"
          component={BlankComposition}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
