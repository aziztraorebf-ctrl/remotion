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
import { SoundjataCharte, SOUNDJATA_CHARTE_FRAMES } from "./projects/geoafrique-shorts/SoundjataCharte";
import { SoundjataActeV, SOUNDJATA_ACTE_V_FRAMES } from "./projects/geoafrique-shorts/SoundjataActeV";
import { SoundjataReaction, SoundjataNePlus, TROU_B_FRAMES, TROU_C_FRAMES } from "./projects/geoafrique-shorts/SoundjataTransitions";
import { SoundjataActeVII, SOUNDJATA_ACTE_VII_FRAMES } from "./projects/geoafrique-shorts/SoundjataActeVII";
import { SoundjataClose, SOUNDJATA_CLOSE_FRAMES } from "./projects/geoafrique-shorts/SoundjataClose";
import { SoundjataShort, SOUNDJATA_SHORT_FRAMES } from "./projects/geoafrique-shorts/SoundjataShort";
import { SoundjataActesI_III, SOUNDJATA_ACTES_I_III_FRAMES, SOUNDJATA_ACTES_I_III_ID } from "./projects/geoafrique-shorts/SoundjataActesI_III";
import { SonjataPapercraftScene1, SONJATA_PAPERCRAFT_SCENE1_FRAMES, SonjataPapercraftScene2, SONJATA_PAPERCRAFT_SCENE2_FRAMES } from "./projects/geoafrique-shorts/SonjataPapercraft";
import { SonjataScene5AKenBurns, SCENE5A_DURATION_FRAMES } from "./projects/geoafrique-shorts/SonjataScene5AKenBurns";
import { SonjataScene5B, SCENE5B_DURATION_FRAMES } from "./projects/geoafrique-shorts/SonjataScene5B";
import { SonjataScene5, SONJATA_SCENE5_FRAMES } from "./projects/geoafrique-shorts/SonjataScene5";
import { SonjataScene6, SONJATA_SCENE6_FRAMES } from "./projects/geoafrique-shorts/SonjataScene6";
import { SonjataScene7, SONJATA_SCENE7_FRAMES } from "./projects/geoafrique-shorts/SonjataScene7";
import { SonjataScene8, SONJATA_SCENE8_FRAMES } from "./projects/geoafrique-shorts/SonjataScene8";
import { SonjataScene9, SONJATA_SCENE9_FRAMES } from "./projects/geoafrique-shorts/SonjataScene9";
import { SonjataScene10, SONJATA_SCENE10_FRAMES } from "./projects/geoafrique-shorts/SonjataScene10";
import { SonjataCTA, SONJATA_CTA_FRAMES } from "./projects/geoafrique-shorts/SonjataCTA";
import { SonjataShortFull, SONJATA_SHORT_FULL_FRAMES } from "./projects/geoafrique-shorts/SonjataShortFull";
import { AtlasShakaFull, SHAKA_TOTAL_FRAMES, SHAKA_FPS } from "./projects/shaka-zulu/AtlasShakaFull";
import { AtlasShakaHook } from "./projects/shaka-zulu/scenes/AtlasShakaHook";
import { AtlasShakaS1Geo } from "./projects/shaka-zulu/scenes/AtlasShakaS1Geo";
import { AtlasShakaS2A1Iklwa } from "./projects/shaka-zulu/scenes/AtlasShakaS2A1Iklwa";
import { AtlasShakaS2A2Bouclier } from "./projects/shaka-zulu/scenes/AtlasShakaS2A2Bouclier";
import { AtlasShakaS2A3Cornes } from "./projects/shaka-zulu/scenes/AtlasShakaS2A3Cornes";
import { AtlasShakaS2A4Synthese } from "./projects/shaka-zulu/scenes/AtlasShakaS2A4Synthese";
import { AtlasShakaS3Expansion } from "./projects/shaka-zulu/scenes/AtlasShakaS3Expansion";
import { AtlasShakaS4Nandi } from "./projects/shaka-zulu/scenes/AtlasShakaS4Nandi";
import { AtlasShakaS5CTA } from "./projects/shaka-zulu/scenes/AtlasShakaS5CTA";
import { InsertIklwaSchema } from "./projects/shaka-zulu/inserts/InsertIklwaSchema";
import { InsertBouclierSchema } from "./projects/shaka-zulu/inserts/InsertBouclierSchema";
import { InsertCornesSchema } from "./projects/shaka-zulu/inserts/InsertCornesSchema";
import { InsertNombre4000 } from "./projects/shaka-zulu/inserts/InsertNombre4000";
import { InsertNombre1500 } from "./projects/shaka-zulu/inserts/InsertNombre1500";
import { CornesFrameDemo } from "./projects/shaka-zulu/scenes/CornesFrameDemo";
import { CornesFrameNarrative } from "./projects/shaka-zulu/scenes/CornesFrameNarrative";
import { PaperGrainDemo } from "./projects/shaka-zulu/scenes/PaperGrainDemo";
import { MapShakaZuluTest } from "./projects/shaka-zulu/scenes/MapShakaZuluTest";
import { S2_ACTS as SHAKA_S2_ACTS, INSERTS as SHAKA_INSERTS, NARRATIVE_BEATS as SHAKA_BEATS, SEGMENTS as SHAKA_SEGMENTS } from "./projects/shaka-zulu/timing";
import { SubtitleTest, SUBTITLE_TEST_FRAMES } from "./projects/geoafrique-shorts/SubtitleTest";
import {
  ThiaroyeShortV5,
  THIAROYE_V5_FRAMES,
  THIAROYE_V5_WIDTH,
  THIAROYE_V5_HEIGHT,
  THIAROYE_V5_FPS,
} from "./projects/geoafrique-shorts/ThiaroyeShortV5";
import { SeedanceTest } from "./projects/geoafrique-shorts/SeedanceTest";
import { Beat01DollyInTest } from "./projects/geoafrique-shorts/Beat01DollyInTest";
import { Beat01OceanOverlayTest } from "./projects/geoafrique-shorts/Beat01OceanOverlayTest";
import { Beat03FleetManifest } from "./projects/geoafrique-shorts/components/Beat03FleetManifest";
import { HistoricalMap } from "./projects/geoafrique-shorts/components/HistoricalMap";
import { HistoricalMapGemini } from "./projects/geoafrique-shorts/components/HistoricalMapGemini";
import { HybridMapTest } from "./projects/geoafrique-shorts/components/HybridMapTest";
import { KirinaDateCard } from "./projects/geoafrique-shorts/components/KirinaDateCard";
import { TOTAL_FRAMES as ABOU_FRAMES } from "./projects/geoafrique-shorts/timing-abou-bakari";
import { BEATS as OLD_BEATS } from "./projects/geoafrique-shorts/timing";

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
          id="SoundjataCharte"
          component={SoundjataCharte}
          durationInFrames={SOUNDJATA_CHARTE_FRAMES}
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
          durationInFrames={OLD_BEATS.fleet.end - OLD_BEATS.fleet.start}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="HistoricalMap"
          component={HistoricalMap}
          durationInFrames={900}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="HistoricalMapGemini"
          component={HistoricalMapGemini}
          durationInFrames={900}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="HybridMapTest"
          component={HybridMapTest}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="KirinaDateCard"
          component={KirinaDateCard}
          durationInFrames={14}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SoundjataActeV"
          component={SoundjataActeV}
          durationInFrames={SOUNDJATA_ACTE_V_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SoundjataReaction"
          component={SoundjataReaction}
          durationInFrames={TROU_B_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SoundjataNePlus"
          component={SoundjataNePlus}
          durationInFrames={TROU_C_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SoundjataActeVII"
          component={SoundjataActeVII}
          durationInFrames={SOUNDJATA_ACTE_VII_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SoundjataClose"
          component={SoundjataClose}
          durationInFrames={SOUNDJATA_CLOSE_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SoundjataShort"
          component={SoundjataShort}
          durationInFrames={SOUNDJATA_SHORT_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id={SOUNDJATA_ACTES_I_III_ID}
          component={SoundjataActesI_III}
          durationInFrames={SOUNDJATA_ACTES_I_III_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SonjataPapercraftScene1"
          component={SonjataPapercraftScene1}
          durationInFrames={SONJATA_PAPERCRAFT_SCENE1_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SonjataPapercraftScene2"
          component={SonjataPapercraftScene2}
          durationInFrames={SONJATA_PAPERCRAFT_SCENE2_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SonjataScene5AKenBurns"
          component={SonjataScene5AKenBurns}
          durationInFrames={SCENE5A_DURATION_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SonjataScene5B"
          component={SonjataScene5B}
          durationInFrames={SCENE5B_DURATION_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SonjataScene5"
          component={SonjataScene5}
          durationInFrames={SONJATA_SCENE5_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SonjataScene6"
          component={SonjataScene6}
          durationInFrames={SONJATA_SCENE6_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SonjataScene7"
          component={SonjataScene7}
          durationInFrames={SONJATA_SCENE7_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SonjataScene8"
          component={SonjataScene8}
          durationInFrames={SONJATA_SCENE8_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SonjataScene9"
          component={SonjataScene9}
          durationInFrames={SONJATA_SCENE9_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SonjataScene10"
          component={SonjataScene10}
          durationInFrames={SONJATA_SCENE10_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SonjataCTA"
          component={SonjataCTA}
          durationInFrames={SONJATA_CTA_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SubtitleTest"
          component={SubtitleTest}
          durationInFrames={SUBTITLE_TEST_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SonjataShortFull"
          component={SonjataShortFull}
          durationInFrames={SONJATA_SHORT_FULL_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="ThiaroyeShortV5"
          component={ThiaroyeShortV5}
          durationInFrames={THIAROYE_V5_FRAMES}
          fps={THIAROYE_V5_FPS}
          width={THIAROYE_V5_WIDTH}
          height={THIAROYE_V5_HEIGHT}
        />
      </Folder>
      <Folder name="atlas-shaka-zulu">
        <Composition
          id="AtlasShakaFull"
          component={AtlasShakaFull}
          durationInFrames={SHAKA_TOTAL_FRAMES}
          fps={SHAKA_FPS}
          width={1080}
          height={1920}
          defaultProps={{
            imageVariant: "gemini-parchemin" as const,
            musicVariant: "ingoma" as const,
            musicVolume: 0.07,
          }}
        />
        <Composition
          id="AtlasShakaHook"
          component={AtlasShakaHook}
          durationInFrames={SHAKA_SEGMENTS.HOOK.durationFrames}
          fps={SHAKA_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="AtlasShakaS1Geo"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component={AtlasShakaS1Geo as any}
          durationInFrames={SHAKA_SEGMENTS.S1_GEO.durationFrames}
          fps={SHAKA_FPS}
          width={1080}
          height={1920}
          defaultProps={{
            durationFrames: SHAKA_SEGMENTS.S1_GEO.durationFrames,
            insertNombre1500: {
              triggerFrameLocal: SHAKA_INSERTS.S1_NOMBRE_1500.triggerFrame - SHAKA_SEGMENTS.S1_GEO.startFrame,
              durationFrames: SHAKA_INSERTS.S1_NOMBRE_1500.durationFrames,
            },
          }}
        />
        <Composition
          id="AtlasShakaS2A1Iklwa"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component={AtlasShakaS2A1Iklwa as any}
          durationInFrames={SHAKA_S2_ACTS.A1_IKLWA.durationFrames}
          fps={SHAKA_FPS}
          width={1080}
          height={1920}
          defaultProps={{
            imageVariant: "gemini-parchemin" as const,
            durationFrames: SHAKA_S2_ACTS.A1_IKLWA.durationFrames,
          }}
        />
        <Composition
          id="AtlasShakaS2A2Bouclier"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component={AtlasShakaS2A2Bouclier as any}
          durationInFrames={SHAKA_S2_ACTS.A2_BOUCLIER.durationFrames}
          fps={SHAKA_FPS}
          width={1080}
          height={1920}
          defaultProps={{
            imageVariant: "gemini-parchemin" as const,
            durationFrames: SHAKA_S2_ACTS.A2_BOUCLIER.durationFrames,
          }}
        />
        <Composition
          id="AtlasShakaS2A3Cornes"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component={AtlasShakaS2A3Cornes as any}
          durationInFrames={SHAKA_S2_ACTS.A3_CORNES.durationFrames}
          fps={SHAKA_FPS}
          width={1080}
          height={1920}
          defaultProps={{ durationFrames: SHAKA_S2_ACTS.A3_CORNES.durationFrames }}
        />
        <Composition
          id="AtlasShakaS2A4Synthese"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component={AtlasShakaS2A4Synthese as any}
          durationInFrames={SHAKA_S2_ACTS.A4_GQOKLI_SYNTHESE.durationFrames}
          fps={SHAKA_FPS}
          width={1080}
          height={1920}
          defaultProps={{
            durationFrames: SHAKA_S2_ACTS.A4_GQOKLI_SYNTHESE.durationFrames,
            imageVariant: "gemini-parchemin" as const,
          }}
        />
        <Composition
          id="AtlasShakaS3Expansion"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component={AtlasShakaS3Expansion as any}
          durationInFrames={SHAKA_SEGMENTS.S3_EXPANSION.durationFrames}
          fps={SHAKA_FPS}
          width={1080}
          height={1920}
          defaultProps={{ durationFrames: SHAKA_SEGMENTS.S3_EXPANSION.durationFrames }}
        />
        <Composition
          id="AtlasShakaS4Nandi"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component={AtlasShakaS4Nandi as any}
          durationInFrames={SHAKA_SEGMENTS.S4_NANDI.durationFrames}
          fps={SHAKA_FPS}
          width={1080}
          height={1920}
          defaultProps={{
            durationFrames: SHAKA_SEGMENTS.S4_NANDI.durationFrames,
            nandiMeurtFrameLocal: SHAKA_BEATS.NANDI_MEURT.startFrame - SHAKA_SEGMENTS.S4_NANDI.startFrame,
            insertNombre4000FrameLocal: SHAKA_INSERTS.S4_NOMBRE_4000.triggerFrame - SHAKA_SEGMENTS.S4_NANDI.startFrame,
            insertNombre4000Duration: SHAKA_INSERTS.S4_NOMBRE_4000.durationFrames,
          }}
        />
        <Composition
          id="AtlasShakaS5CTA"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component={AtlasShakaS5CTA as any}
          durationInFrames={SHAKA_SEGMENTS.S5_CTA.durationFrames}
          fps={SHAKA_FPS}
          width={1080}
          height={1920}
          defaultProps={{
            durationFrames: SHAKA_SEGMENTS.S5_CTA.durationFrames,
            napoleonFrame: SHAKA_INSERTS.S5_CASCADE_NAPOLEON.triggerFrame - SHAKA_SEGMENTS.S5_CTA.startFrame,
            alexandreFrame: SHAKA_INSERTS.S5_CASCADE_ALEXANDRE.triggerFrame - SHAKA_SEGMENTS.S5_CTA.startFrame,
            shakaFrame: SHAKA_INSERTS.S5_CASCADE_SHAKA.triggerFrame - SHAKA_SEGMENTS.S5_CTA.startFrame,
            abonneToiFrame: Math.round((148.100 - 140.489) * 30),
          }}
        />
        {/* Inserts Remotion pur (refait Vague 1B - philosophie Mansa Moussa) */}
        <Composition
          id="ShakaInsertIklwaSchema"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component={InsertIklwaSchema as any}
          durationInFrames={150}
          fps={SHAKA_FPS}
          width={1080}
          height={1920}
          defaultProps={{ durationFrames: 150 }}
        />
        <Composition
          id="ShakaInsertBouclierSchema"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component={InsertBouclierSchema as any}
          durationInFrames={280}
          fps={SHAKA_FPS}
          width={1080}
          height={1920}
          defaultProps={{ durationFrames: 280 }}
        />
        <Composition
          id="ShakaInsertCornesSchema"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component={InsertCornesSchema as any}
          durationInFrames={220}
          fps={SHAKA_FPS}
          width={1080}
          height={1920}
          defaultProps={{ durationFrames: 220 }}
        />
        <Composition
          id="ShakaInsertNombre4000"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component={InsertNombre4000 as any}
          durationInFrames={180}
          fps={SHAKA_FPS}
          width={1080}
          height={1920}
          defaultProps={{ durationFrames: 180 }}
        />
        <Composition
          id="ShakaInsertNombre1500"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component={InsertNombre1500 as any}
          durationInFrames={120}
          fps={SHAKA_FPS}
          width={1080}
          height={1920}
          defaultProps={{ durationFrames: 120 }}
        />
        {/* Vague 2 demos */}
        <Composition
          id="ShakaCornesFrameDemo"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component={CornesFrameDemo as any}
          durationInFrames={135}
          fps={SHAKA_FPS}
          width={1080}
          height={1920}
          defaultProps={{ durationFrames: 135 }}
        />
        <Composition
          id="ShakaCornesFrameNarrative"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component={CornesFrameNarrative as any}
          durationInFrames={150}
          fps={SHAKA_FPS}
          width={1080}
          height={1920}
          defaultProps={{ durationFrames: 150 }}
        />
        <Composition
          id="ShakaPaperGrainDemo"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component={PaperGrainDemo as any}
          durationInFrames={90}
          fps={SHAKA_FPS}
          width={1080}
          height={1920}
          defaultProps={{ durationFrames: 90 }}
        />
        <Composition
          id="ShakaMapTest"
          component={MapShakaZuluTest}
          durationInFrames={270}
          fps={SHAKA_FPS}
          width={720}
          height={1280}
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
