import { Composition } from "remotion";
import { QuebecFrame1 } from "./QuebecFrame1";
import { QuebecAnimated } from "./QuebecAnimated";
import { QuebecCinematic } from "./QuebecCinematic";
import { JacquesPOC } from "./JacquesPOC";
import { MapWatercolorTest } from "./MapWatercolorTest";
import { MapOutdoorsClean } from "./MapOutdoorsClean";
import { AtlasTombouctouProto } from "./AtlasTombouctouProto";
import { AtlasGoogleEarthTest } from "./AtlasGoogleEarthTest";
import { AtlasGoogleEarthNeutral } from "./AtlasGoogleEarthNeutral";
import { AtlasGoogleEarthParchment } from "./AtlasGoogleEarthParchment";
import { AtlasParcheminRelief } from "./AtlasParcheminRelief";
import { AtlasParcheminGlobe } from "./AtlasParcheminGlobe";
import { AtlasTombouctouShowcase, ATLAS_SHOWCASE_DURATION_FRAMES } from "./AtlasTombouctouShowcase";
import { AtlasEmpireHaloTest } from "./AtlasEmpireHaloTest";
import { AtlasMansaMoussaShowcase, MANSA_MOUSSA_DURATION_FRAMES } from "./AtlasMansaMoussaShowcase";
import { Scene001IntroV3 } from "./scenes/Scene001IntroV3";
import { GlowingQuebecTest } from "./GlowingQuebecTest";
import { MaliFlagTest } from "./MaliFlagTest";
import { POCV4Mali60s, POCV4_DURATION } from "./POCV4Mali60s";
import { AtlasV2VectorTest } from "./AtlasV2VectorTest";
import { AtlasV2GlobeTest } from "./AtlasV2GlobeTest";
import { AtlasV2SceneS3Test, ATLAS_V2_S3_DURATION } from "./AtlasV2SceneS3Test";
import { AtlasV2RotationDemo, ATLAS_V2_ROTATION_DEMO_DURATION } from "./AtlasV2RotationDemo";
import { AtlasV2NationalColorsDemo, ATLAS_V2_NATIONAL_COLORS_DEMO_DURATION } from "./AtlasV2NationalColorsDemo";
import { AtlasV2VocabDemo, ATLAS_V2_VOCAB_DEMO_DURATION } from "./AtlasV2VocabDemo";
import { AtlasV2Insert60000Demo, ATLAS_V2_INSERT_60000_DEMO_DURATION } from "./AtlasV2Insert60000Demo";
import { AtlasV2InsertBarChartDemo, ATLAS_V2_INSERT_BARCHART_DEMO_DURATION } from "./AtlasV2InsertBarChartDemo";
import { AtlasV2InsertPieChartDemo, ATLAS_V2_INSERT_PIECHART_DEMO_DURATION } from "./AtlasV2InsertPieChartDemo";
import { AtlasV2InsertLineChartDemo, ATLAS_V2_INSERT_LINECHART_DEMO_DURATION } from "./AtlasV2InsertLineChartDemo";
import { AtlasV2HookS1Test, ATLAS_V2_HOOK_S1_TEST_DURATION } from "./AtlasV2HookS1Test";
import { AtlasV2HookS1S2Test, ATLAS_V2_HOOK_S1_S2_TEST_DURATION } from "./AtlasV2HookS1S2Test";
import { AtlasV2HookToS3Test, ATLAS_V2_HOOK_TO_S3_TEST_DURATION } from "./AtlasV2HookToS3Test";
import { AtlasV2HookToS4Test, ATLAS_V2_HOOK_TO_S4_TEST_DURATION } from "./AtlasV2HookToS4Test";
import { AtlasV2RhythmDemo, ATLAS_V2_RHYTHM_DEMO_DURATION } from "./AtlasV2RhythmDemo";
import { AtlasV2BestVersionDemo, ATLAS_V2_BEST_VERSION_DURATION } from "./AtlasV2BestVersionDemo";
import { AtlasV2TiltTestS1, ATLAS_V2_TILT_TEST_S1_DURATION } from "./AtlasV2TiltTestS1";
import { AtlasV2RhythmTiltDemo, ATLAS_V2_RHYTHM_TILT_DEMO_DURATION } from "./AtlasV2RhythmTiltDemo";
import { AtlasIconifyCompareDemo, ATLAS_ICONIFY_COMPARE_DURATION } from "./AtlasIconifyCompareDemo";
import { AtlasMansaMoussaV2Final, ATLAS_MANSA_MOUSSA_V2_FINAL_DURATION } from "./AtlasMansaMoussaV2Final";
import { AtlasPixelLabTest } from "./AtlasPixelLabTest";
import { AtlasPixelZoomA, AtlasPixelMoveB, AtlasPixelZoomC, AtlasPixelFlatD, AtlasPixelFlatD2 } from "./AtlasPixelZoomTest";
import { AtlasWalkTest } from "./AtlasWalkTest";
import { AtlasWalkThenPray, AtlasWalkMeet } from "./AtlasWalkTest2";
import {
  AtlasV2MiniTest,
  AtlasV2MiniTestNoOverlay,
  AtlasV2MiniTestParchment30,
  AtlasV2MiniTestParchment70,
  AtlasV2MiniTestParchmentScreen,
  AtlasV2MiniTestParchmentOverlay,
  AtlasV2MiniTestSepiaFilter,
  AtlasV2MiniTestSepiaPlusGrain,
  AtlasV2MiniTestSepiaStrong,
} from "./AtlasV2MiniTest";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AtlasPixelLabTest"
        component={AtlasPixelLabTest}
        durationInFrames={150}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasPixelZoomA"
        component={AtlasPixelZoomA}
        durationInFrames={150}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasPixelMoveB"
        component={AtlasPixelMoveB}
        durationInFrames={210}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasPixelZoomC"
        component={AtlasPixelZoomC}
        durationInFrames={210}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasPixelFlatD"
        component={AtlasPixelFlatD}
        durationInFrames={180}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasPixelFlatD2"
        component={AtlasPixelFlatD2}
        durationInFrames={180}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasWalkTest"
        component={AtlasWalkTest}
        durationInFrames={240}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasWalkThenPray"
        component={AtlasWalkThenPray}
        durationInFrames={270}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasWalkMeet"
        component={AtlasWalkMeet}
        durationInFrames={270}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="JacquesPOC"
        component={JacquesPOC}
        durationInFrames={1188}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="QuebecFrame1"
        component={QuebecFrame1}
        durationInFrames={90}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="QuebecAnimated"
        component={QuebecAnimated}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="QuebecCinematic"
        component={QuebecCinematic}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="MapWatercolorTest"
        component={MapWatercolorTest}
        durationInFrames={240}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="MapOutdoorsClean"
        component={MapOutdoorsClean}
        durationInFrames={240}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="MapOutdoorsCleanMobile"
        component={MapOutdoorsClean}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AtlasTombouctouProto"
        component={AtlasTombouctouProto}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AtlasGoogleEarthTest"
        component={AtlasGoogleEarthTest}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AtlasGoogleEarthNeutral"
        component={AtlasGoogleEarthNeutral}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AtlasGoogleEarthParchment"
        component={AtlasGoogleEarthParchment}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AtlasParcheminRelief"
        component={AtlasParcheminRelief}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AtlasParcheminGlobe"
        component={AtlasParcheminGlobe}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AtlasTombouctouShowcase"
        component={AtlasTombouctouShowcase}
        durationInFrames={ATLAS_SHOWCASE_DURATION_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ musicVariant: "none" as const }}
      />
      <Composition
        id="AtlasTombouctouShowcaseMusicA"
        component={AtlasTombouctouShowcase}
        durationInFrames={ATLAS_SHOWCASE_DURATION_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ musicVariant: "A-sahara-ambient" as const }}
      />
      <Composition
        id="AtlasTombouctouShowcaseMusicB"
        component={AtlasTombouctouShowcase}
        durationInFrames={ATLAS_SHOWCASE_DURATION_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ musicVariant: "B-cesar-epique" as const }}
      />
      <Composition
        id="AtlasTombouctouShowcaseMusicC"
        component={AtlasTombouctouShowcase}
        durationInFrames={ATLAS_SHOWCASE_DURATION_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ musicVariant: "C-mande-contemplatif" as const }}
      />
      <Composition
        id="AtlasEmpireHaloTest"
        component={AtlasEmpireHaloTest}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MansaMoussaShowcaseMusicC"
        component={AtlasMansaMoussaShowcase}
        durationInFrames={MANSA_MOUSSA_DURATION_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ musicVariant: "C-mande-contemplatif" as const }}
      />
      <Composition
        id="Scene001IntroV3"
        component={Scene001IntroV3}
        durationInFrames={256}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ startFrame: 0 }}
      />
      <Composition
        id="GlowingQuebecTest"
        component={GlowingQuebecTest}
        durationInFrames={240}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="MaliFlagTest"
        component={MaliFlagTest}
        durationInFrames={240}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="POCV4Mali60s"
        component={POCV4Mali60s}
        durationInFrames={POCV4_DURATION}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="AtlasV2MiniTestNoOverlay"
        component={AtlasV2MiniTestNoOverlay}
        durationInFrames={90}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2MiniTestParchment30"
        component={AtlasV2MiniTestParchment30}
        durationInFrames={90}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2MiniTest"
        component={AtlasV2MiniTest}
        durationInFrames={90}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2MiniTestParchment70"
        component={AtlasV2MiniTestParchment70}
        durationInFrames={90}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2MiniTestParchmentScreen"
        component={AtlasV2MiniTestParchmentScreen}
        durationInFrames={90}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2MiniTestParchmentOverlay"
        component={AtlasV2MiniTestParchmentOverlay}
        durationInFrames={90}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2MiniTestSepiaFilter"
        component={AtlasV2MiniTestSepiaFilter}
        durationInFrames={90}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2MiniTestSepiaPlusGrain"
        component={AtlasV2MiniTestSepiaPlusGrain}
        durationInFrames={90}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2MiniTestSepiaStrong"
        component={AtlasV2MiniTestSepiaStrong}
        durationInFrames={90}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2VectorTest"
        component={AtlasV2VectorTest}
        durationInFrames={180}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2GlobeTest"
        component={AtlasV2GlobeTest}
        durationInFrames={300}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2SceneS3Test"
        component={AtlasV2SceneS3Test}
        durationInFrames={ATLAS_V2_S3_DURATION}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2RotationDemo"
        component={AtlasV2RotationDemo}
        durationInFrames={ATLAS_V2_ROTATION_DEMO_DURATION}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2NationalColorsDemo"
        component={AtlasV2NationalColorsDemo}
        durationInFrames={ATLAS_V2_NATIONAL_COLORS_DEMO_DURATION}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2VocabDemo"
        component={AtlasV2VocabDemo}
        durationInFrames={ATLAS_V2_VOCAB_DEMO_DURATION}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2Insert60000Demo"
        component={AtlasV2Insert60000Demo}
        durationInFrames={ATLAS_V2_INSERT_60000_DEMO_DURATION}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2InsertBarChartDemo"
        component={AtlasV2InsertBarChartDemo}
        durationInFrames={ATLAS_V2_INSERT_BARCHART_DEMO_DURATION}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2InsertPieChartDemo"
        component={AtlasV2InsertPieChartDemo}
        durationInFrames={ATLAS_V2_INSERT_PIECHART_DEMO_DURATION}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2InsertLineChartDemo"
        component={AtlasV2InsertLineChartDemo}
        durationInFrames={ATLAS_V2_INSERT_LINECHART_DEMO_DURATION}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2HookS1Test"
        component={AtlasV2HookS1Test}
        durationInFrames={ATLAS_V2_HOOK_S1_TEST_DURATION}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2HookS1S2Test"
        component={AtlasV2HookS1S2Test}
        durationInFrames={ATLAS_V2_HOOK_S1_S2_TEST_DURATION}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2HookToS3Test"
        component={AtlasV2HookToS3Test}
        durationInFrames={ATLAS_V2_HOOK_TO_S3_TEST_DURATION}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2HookToS4Test"
        component={AtlasV2HookToS4Test}
        durationInFrames={ATLAS_V2_HOOK_TO_S4_TEST_DURATION}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2RhythmDemo"
        component={AtlasV2RhythmDemo}
        durationInFrames={ATLAS_V2_RHYTHM_DEMO_DURATION}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2BestVersionDemo"
        component={AtlasV2BestVersionDemo}
        durationInFrames={ATLAS_V2_BEST_VERSION_DURATION}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2TiltTestS1"
        component={AtlasV2TiltTestS1}
        durationInFrames={ATLAS_V2_TILT_TEST_S1_DURATION}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasV2RhythmTiltDemo"
        component={AtlasV2RhythmTiltDemo}
        durationInFrames={ATLAS_V2_RHYTHM_TILT_DEMO_DURATION}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasIconifyCompareDemo"
        component={AtlasIconifyCompareDemo}
        durationInFrames={ATLAS_ICONIFY_COMPARE_DURATION}
        fps={30}
        width={720}
        height={1280}
      />
      <Composition
        id="AtlasMansaMoussaV2Final"
        component={AtlasMansaMoussaV2Final}
        durationInFrames={ATLAS_MANSA_MOUSSA_V2_FINAL_DURATION}
        fps={30}
        width={720}
        height={1280}
      />
    </>
  );
};
