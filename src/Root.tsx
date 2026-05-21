import { Composition, Folder } from "remotion";
import { BlankComposition } from "./BlankComposition";
import { VerticalFlotteShort } from "./projects/geoafrique-shorts/components/VerticalFlotteShort";
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
import { RdcNoSenseFull, RDC_NO_SENSE_FRAMES, RDC_NO_SENSE_ID } from "./projects/geoafrique-shorts/rdc-no-sense/RdcNoSenseFull";
import { Beat1Hook, BEAT1_HOOK_FRAMES } from "./projects/souverain/or-africain/Beat1Hook";
import { Beat2Contexte, BEAT2_CONTEXTE_FRAMES } from "./projects/souverain/or-africain/Beat2Contexte";
import { Beat3aLeFait, BEAT3A_FRAMES } from "./projects/souverain/or-africain/Beat3aLeFait";
import { Beat3bPression, BEAT3B_FRAMES } from "./projects/souverain/or-africain/Beat3bPression";
import { Beat4LeTwist, BEAT4_FRAMES } from "./projects/souverain/or-africain/Beat4LeTwist";
import { Beat5Verdict, BEAT5_VERDICT_FRAMES } from "./projects/souverain/or-africain/Beat5Verdict";
import { OrAfricainCTA, OR_AFRICAIN_CTA_FRAMES } from "./projects/souverain/or-africain/OrAfricainCTA";
import { OrAfricainFull, OR_AFRICAIN_FULL_FRAMES } from "./projects/souverain/or-africain/OrAfricainFull";
import { FPS as OR_AFRICAIN_FPS } from "./projects/souverain/or-africain/timing";
import { CartoCaspianDemo, CARTO_CASPIAN_DEMO_FRAMES } from "./projects/_shared/demos/CartoCaspianDemo";
import { SmallMultiplesGridDemoA, SmallMultiplesGridDemoB, SMALL_MULTIPLES_GRID_DEMO_FRAMES } from "./projects/_shared/demos/SmallMultiplesGridDemo";
import { AtlasRealiste3DDemo, ATLAS_REALISTE_3D_DEMO_FRAMES } from "./projects/_shared/demos/AtlasRealiste3DDemo";
import { AtlasRealiste3DShowcase, ATLAS_REALISTE_3D_SHOWCASE_FRAMES } from "./projects/_shared/demos/AtlasRealiste3DShowcase";
import { KraftCardDemoA, KraftCardDemoB, KraftCardDemoC, KRAFT_CARD_DEMO_FRAMES } from "./projects/_shared/demos/KraftCardDemo";
import { KraftCardShowcase, KRAFT_CARD_SHOWCASE_FRAMES } from "./projects/_shared/demos/KraftCardShowcase";
import { KraftCardDocDemoPortrait, KraftCardDocDemoFlag, KRAFT_CARD_DOC_DEMO_FRAMES } from "./projects/_shared/demos/KraftCardDocClassifieDemo";
import { Jour4ShowcaseA, JOUR4_SHOWCASE_A_FRAMES } from "./projects/_shared/demos/Jour4ShowcaseA";
import { Jour4ShowcaseB, JOUR4_SHOWCASE_B_FRAMES } from "./projects/_shared/demos/Jour4ShowcaseB";
import { Jour4ShowcaseV2, JOUR4_SHOWCASE_V2_FRAMES } from "./projects/_shared/demos/Jour4ShowcaseV2";
import { OsintSplitScreenDemo, OSINT_DEMO_FRAMES } from "./projects/_shared/demos/OsintSplitScreenDemo";
import { SplitScreenDemo, SPLIT_SCREEN_DEMO_FRAMES } from "./projects/_shared/demos/SplitScreenDemo";
import { GlobeCountryRevealDemo, GLOBE_REVEAL_DEMO_FRAMES } from "./projects/_shared/demos/GlobeCountryRevealDemo";
import { EntityDiagramDemo, ENTITY_DIAGRAM_DEMO_FRAMES } from "./projects/_shared/demos/EntityDiagramDemo";
import { ComparisonTableDemo, COMPARISON_TABLE_DEMO_FRAMES } from "./projects/_shared/demos/ComparisonTableDemo";
import { GlobeCountryRevealMapboxDemo, GLOBE_MAPBOX_DEMO_FRAMES } from "./projects/_shared/demos/GlobeCountryRevealMapboxDemo";
import { GlobeMontrealDemo, GLOBE_MONTREAL_FRAMES } from "./projects/_shared/demos/GlobeMontrealDemo";
import { GlobeToMercatorDemo, GLOBE_TO_MERCATOR_FRAMES } from "./projects/_shared/demos/GlobeToMercatorDemo";
import {
  CaspianOriginalDemo,
  CaspianSepiaDemo,
  CaspianSmokeDemo,
  CaspianNoirDemo,
  CASPIAN_COMPARE_FRAMES,
} from "./projects/_shared/demos/CaspianPaletteCompareDemo";
import { AtlasShakaFull, SHAKA_TOTAL_FRAMES, SHAKA_FPS } from "./projects/atlas/shaka-zulu/AtlasShakaFull";
import { AtlasShakaHook } from "./projects/atlas/shaka-zulu/scenes/AtlasShakaHook";
import { AtlasShakaS1Geo } from "./projects/atlas/shaka-zulu/scenes/AtlasShakaS1Geo";
import { AtlasShakaS2A1Iklwa } from "./projects/atlas/shaka-zulu/scenes/AtlasShakaS2A1Iklwa";
import { AtlasShakaS2A2Bouclier } from "./projects/atlas/shaka-zulu/scenes/AtlasShakaS2A2Bouclier";
import { AtlasShakaS2A3Cornes } from "./projects/atlas/shaka-zulu/scenes/AtlasShakaS2A3Cornes";
import { AtlasShakaS2A4Synthese } from "./projects/atlas/shaka-zulu/scenes/AtlasShakaS2A4Synthese";
import { AtlasShakaS3Expansion } from "./projects/atlas/shaka-zulu/scenes/AtlasShakaS3Expansion";
import { AtlasShakaS4Nandi } from "./projects/atlas/shaka-zulu/scenes/AtlasShakaS4Nandi";
import { AtlasShakaS5CTA } from "./projects/atlas/shaka-zulu/scenes/AtlasShakaS5CTA";
import { InsertIklwaSchema } from "./projects/atlas/shaka-zulu/inserts/InsertIklwaSchema";
import { InsertBouclierSchema } from "./projects/atlas/shaka-zulu/inserts/InsertBouclierSchema";
import { InsertCornesSchema } from "./projects/atlas/shaka-zulu/inserts/InsertCornesSchema";
import { InsertNombre4000 } from "./projects/atlas/shaka-zulu/inserts/InsertNombre4000";
import { InsertNombre1500 } from "./projects/atlas/shaka-zulu/inserts/InsertNombre1500";
import { CornesFrameDemo } from "./projects/atlas/shaka-zulu/scenes/CornesFrameDemo";
import { CornesFrameNarrative } from "./projects/atlas/shaka-zulu/scenes/CornesFrameNarrative";
import { PaperGrainDemo } from "./projects/atlas/shaka-zulu/scenes/PaperGrainDemo";
import { MapShakaZuluTest } from "./projects/atlas/shaka-zulu/scenes/MapShakaZuluTest";
import { S2_ACTS as SHAKA_S2_ACTS, INSERTS as SHAKA_INSERTS, NARRATIVE_BEATS as SHAKA_BEATS, SEGMENTS as SHAKA_SEGMENTS } from "./projects/atlas/shaka-zulu/timing";
import { LightLeakTest, LIGHT_LEAK_TEST_FRAMES } from "./projects/atlas/shaka-zulu/tests/LightLeakTest";
import { LottieTest, LOTTIE_TEST_FRAMES } from "./projects/atlas/shaka-zulu/tests/LottieTest";
import { EmpireGhanaHook, EMPIRE_GHANA_HOOK_FRAMES } from "./projects/atlas/empire-ghana/EmpireGhanaHook";
import { Beat1Setup, BEAT1_SETUP_FRAMES } from "./projects/atlas/empire-ghana/scenes/Beat1Setup";
import { Beat2Density, BEAT2_DENSITY_FRAMES } from "./projects/atlas/empire-ghana/scenes/Beat2Density";
import { Beat3Barter, BEAT3_BARTER_FRAMES } from "./projects/atlas/empire-ghana/scenes/Beat3Barter";
import { Beat4Consequence, BEAT4_CONSEQUENCE_FRAMES } from "./projects/atlas/empire-ghana/scenes/Beat4Consequence";
import { Beat5CTA, BEAT5_CTA_FRAMES } from "./projects/atlas/empire-ghana/scenes/Beat5CTA";
import { Beat6CTA, BEAT6_CTA_FRAMES } from "./projects/atlas/empire-ghana/scenes/Beat6CTA";
import { EmpireGhanaFull, EMPIRE_GHANA_FULL_FRAMES } from "./projects/atlas/empire-ghana/EmpireGhanaFull";
import { SilentBarterTest, SILENT_BARTER_TEST_FRAMES } from "./projects/atlas/empire-ghana/tests/SilentBarterTest";
import { PaletteShowcase, PALETTE_SHOWCASE_FRAMES } from "./projects/atlas/empire-ghana/tests/PaletteShowcase";
import { HannibalPaletteShowcase, PALETTE_SHOWCASE_FRAMES as HANNIBAL_PALETTE_FRAMES } from "./projects/atlas/hannibal/tests/PaletteShowcase";
import { HannibalMapPOC, MAP_POC_FRAMES } from "./projects/atlas/hannibal/tests/MapProofOfConcept";
import { HookVersionA, HookVersionB, HookWithAudio, HOOK_FRAMES } from "./projects/atlas/hannibal/scenes/HookScene";
import { Beat1Context, BEAT1_FRAMES } from "./projects/atlas/hannibal/scenes/Beat1Context";
import { Beat2Rhone, BEAT2_FRAMES } from "./projects/atlas/hannibal/scenes/Beat2Rhone";
import { SilentBarterTestV3, SILENT_BARTER_V3_FRAMES } from "./projects/atlas/empire-ghana/tests/SilentBarterTestV3";
import { WalkToDestination } from "./projects/atlas/_blueprints/walk-to-destination/WalkToDestination";
import { Confrontation } from "./projects/atlas/_blueprints/confrontation/Confrontation";
import { OrbitalCity } from "./projects/atlas/_blueprints/orbital-city/OrbitalCity";
import { ZoomRevelation } from "./projects/atlas/_blueprints/zoom-revelation/ZoomRevelation";
import { ShakeImpact } from "./projects/atlas/_blueprints/shake-impact/ShakeImpact";
import { Alliance } from "./projects/atlas/_blueprints/alliance/Alliance";
import { EmpireExpansion } from "./projects/atlas/_blueprints/empire-expansion/EmpireExpansion";
import { Flashback } from "./projects/atlas/_blueprints/flashback/Flashback";
import { CameraTrackEntity } from "./projects/atlas/_blueprints/camera-track-entity/CameraTrackEntity";
import { DualEntitySequential } from "./projects/atlas/_blueprints/dual-entity-sequential/DualEntitySequential";
import { FormationMarch } from "./projects/atlas/_blueprints/formation-march/FormationMarch";
import { WaypointMarch } from "./projects/atlas/_blueprints/waypoint-march/WaypointMarch";
import { DutchTiltCollapse } from "./projects/atlas/_blueprints/dutch-tilt-collapse/DutchTiltCollapse";
import { PesteMapPreview } from "./projects/atlas/peste-1347/PesteMap";
import { Beat1Hook as P1347_Beat1Hook } from "./projects/atlas/peste-1347/Beat1Hook";
import { Beat2Setup } from "./projects/atlas/peste-1347/Beat2Setup";
import { Beat3Densite } from "./projects/atlas/peste-1347/Beat3Densite";
import { Beat4Climax } from "./projects/atlas/peste-1347/Beat4Climax";
import { Beat5MaliVivant } from "./projects/atlas/peste-1347/Beat5MaliVivant";
import { LabPhase1 } from "./projects/atlas/_lab-hannibal/scenes/LabPhase1";
import { LabPhase2 } from "./projects/atlas/_lab-hannibal/scenes/LabPhase2";
import { Conquete1759, CONQUETE_1759_FRAMES } from "./projects/atlas/quebec-poc/Conquete1759";
import { NouvelleFrance, NOUVELLE_FRANCE_FRAMES } from "./projects/atlas/quebec-poc/NouvelleFrance";
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
import { PocMoneyLegends, POC_MONEY_LEGENDS_FRAMES } from "./projects/poc-money-legends/PocMoneyLegends";
import { MapboxGhanaHighlight, MAPBOX_GHANA_FRAMES } from "./projects/poc-money-legends/MapboxGhanaHighlight";
import { GoldPriceCurve, GOLD_PRICE_CURVE_FRAMES } from "./projects/poc-money-legends/GoldPriceCurve";
import { MapboxAfricaMulti, MAPBOX_AFRICA_MULTI_FRAMES } from "./projects/poc-money-legends/MapboxAfricaMulti";
import { MapboxStyleShowcase, MAPBOX_STYLE_SHOWCASE_FRAMES } from "./projects/poc-money-legends/MapboxStyleShowcase";
import { MapboxTypeBVertical, MAPBOX_TYPE_B_VERTICAL_FRAMES } from "./projects/poc-money-legends/MapboxTypeBVertical";
import { MapboxD3Overlay, MAPBOX_D3_OVERLAY_FRAMES } from "./projects/poc-money-legends/MapboxD3Overlay";
import { StackShowcase, STACK_SHOWCASE_FRAMES } from "./projects/poc-money-legends/StackShowcase";
import { MapboxOceanColor, MAPBOX_OCEAN_COLOR_FRAMES, MapboxGeoAfriqueStyle, MAPBOX_GEO_AFRIQUE_STYLE_FRAMES, MapboxGeoAfriqueV2, MAPBOX_GEO_AFRIQUE_V2_FRAMES, MapboxGeoAfriqueV3, MAPBOX_GEO_AFRIQUE_V3_FRAMES, MapboxGeoAfriqueV4, MAPBOX_GEO_AFRIQUE_V4_FRAMES, MapboxGeoAfriqueV5, MAPBOX_GEO_AFRIQUE_V5_FRAMES } from "./projects/poc-money-legends/MapboxOceanColor";
import { MapboxTypeBVerticalV5, MAPBOX_TYPE_B_V5_FRAMES } from "./projects/poc-money-legends/MapboxTypeBVerticalV5";
import { MapboxMarqueurs, MAPBOX_MARQUEURS_FRAMES } from "./projects/poc-mapbox-tests/MapboxMarqueurs";
import { MapboxMarqueursV2, MAPBOX_MARQUEURS_V2_FRAMES } from "./projects/poc-mapbox-tests/MapboxMarqueursV2";
import { MapboxProjectionsTest, MAPBOX_PROJECTIONS_TEST_FRAMES } from "./projects/poc-mapbox-tests/MapboxProjectionsTest";
import {
  MapboxProjectionsV2Vertical,
  MapboxProjectionsV2Horizontal,
  MAPBOX_PROJECTIONS_V2_FRAMES,
} from "./projects/poc-mapbox-tests/MapboxProjectionsTestV2";
import { MapboxTextures, MAPBOX_TEXTURES_FRAMES } from "./projects/poc-mapbox-tests/MapboxTextures";
import { MapboxAnimations, MAPBOX_ANIMATIONS_FRAMES } from "./projects/poc-mapbox-tests/MapboxAnimations";
import { MapboxAnimationsV2, MAPBOX_ANIMATIONS_V2_FRAMES } from "./projects/poc-mapbox-tests/MapboxAnimationsV2";
import { MapboxHybrides, MAPBOX_HYBRIDES_FRAMES } from "./projects/poc-mapbox-tests/MapboxHybrides";
import { MapboxFlagPatterns, MAPBOX_FLAG_PATTERNS_FRAMES } from "./projects/poc-mapbox-tests/MapboxFlagPatterns";
import { MapboxTransitions, MAPBOX_TRANSITIONS_FRAMES } from "./projects/poc-mapbox-tests/MapboxTransitions";
import { MapboxTrellis3D, MAPBOX_TRELLIS_3D_FRAMES } from "./projects/poc-mapbox-tests/MapboxTrellis3D";
import { MapboxJohnnyHarris, MAPBOX_JOHNNY_HARRIS_FRAMES } from "./projects/poc-mapbox-tests/MapboxJohnnyHarris";
import { ShillingCoin3D, SHILLING_COIN_3D_FRAMES } from "./projects/poc-mapbox-tests/ShillingCoin3D";
import { MapboxShowcaseV2, MAPBOX_SHOWCASE_V2_FRAMES } from "./projects/poc-mapbox-tests/MapboxShowcaseV2";
import { NigerUraniumShort } from "./projects/souverain/niger-uranium/NigerUraniumShort";
import { SECTIONS as NIGER_SECTIONS, FPS as NIGER_FPS, TOTAL_DURATION_FRAMES as NIGER_TOTAL_FRAMES } from "./projects/souverain/niger-uranium/timing";
import { Beat1Hook as ZW_Beat1Hook } from "./projects/souverain/zimbabwe-lithium/Beat1Hook";
import { Beat2Tension } from "./projects/souverain/zimbabwe-lithium/Beat2Tension";
import { Beat4Transition } from "./projects/souverain/zimbabwe-lithium/Beat4Transition";
import { Beat5Demonstration } from "./projects/souverain/zimbabwe-lithium/Beat5Demonstration";
import { Beat6Question } from "./projects/souverain/zimbabwe-lithium/Beat6Question";
import { BEATS as ZW_BEATS, FPS as ZW_FPS } from "./projects/souverain/zimbabwe-lithium/timing";
import { Beat1Hook as SS_Beat1Hook } from "./projects/souverain/silicon-savannah/Beat1Hook";
import { Beat2Carte as SS_Beat2Carte, BEAT2_DURATION as SS_BEAT2_DURATION } from "./projects/souverain/silicon-savannah/Beat2Carte";
import { Beat3Miracle as SS_Beat3Miracle, BEAT3_DURATION as SS_BEAT3_DURATION } from "./projects/souverain/silicon-savannah/Beat3Miracle";
import { Beat4Prix as SS_Beat4Prix, BEAT4_DURATION as SS_BEAT4_DURATION } from "./projects/souverain/silicon-savannah/Beat4Prix";
import { Beat5Monopole as SS_Beat5Monopole, BEAT5_DURATION as SS_BEAT5_DURATION } from "./projects/souverain/silicon-savannah/Beat5Monopole";
import { Beat6Question as SS_Beat6Question, BEAT6_DURATION as SS_BEAT6_DURATION } from "./projects/souverain/silicon-savannah/Beat6Question";
import { Beat7Cta as SS_Beat7Cta, BEAT7_DURATION as SS_BEAT7_DURATION } from "./projects/souverain/silicon-savannah/Beat7Cta";
import { SiliconSavannahFull, SILICON_SAVANNAH_FULL_DURATION } from "./projects/souverain/silicon-savannah/SiliconSavannahFull";
import { SEG as SS_SEG, FPS as SS_FPS } from "./projects/souverain/silicon-savannah/manifest";
import { Beat2 as SS_Beat2_V2 } from "./projects/souverain/silicon-savannah/beat2/Beat2";
import { DURATION_FRAMES as SS_BEAT2_V2_FRAMES, FPS as SS_BEAT2_V2_FPS } from "./projects/souverain/silicon-savannah/beat2/manifest";
import { Beat1Anomalie as SPG_Beat1Anomalie } from "./projects/souverain/senegal-petrole-gaz/Beat1Anomalie";
import { Beat1AnomalieV2 as SPG_Beat1AnomalieV2 } from "./projects/souverain/senegal-petrole-gaz/Beat1AnomalieV2";
import { Beat1AnomalieV3 as SPG_Beat1AnomalieV3 } from "./projects/souverain/senegal-petrole-gaz/Beat1AnomalieV3";
import { Beat1AnomalieV4 as SPG_Beat1AnomalieV4 } from "./projects/souverain/senegal-petrole-gaz/Beat1AnomalieV4";
import { Beat1AnomalieV5 as SPG_Beat1AnomalieV5 } from "./projects/souverain/senegal-petrole-gaz/Beat1AnomalieV5";
import { TestWaveReveal } from "./projects/souverain/senegal-petrole-gaz/TestWaveReveal";
import { TestTextureA } from "./projects/souverain/senegal-petrole-gaz/TestTextureA";
import { TestTextureB } from "./projects/souverain/senegal-petrole-gaz/TestTextureB";
import { AUDIO_SEGMENTS as SPG_AUDIO_SEGMENTS, FPS as SPG_FPS } from "./projects/souverain/senegal-petrole-gaz/timing";
import { StyleTestLeMonde, STYLE_TEST_LE_MONDE_FRAMES } from "./projects/souverain/vraie-taille-afrique/StyleTestLeMonde";
import { Beat1Mercator, BEAT1_MERCATOR_FRAMES } from "./projects/souverain/vraie-taille-afrique/Beat1Mercator";
import { Beat2Silhouettes, BEAT2_SILHOUETTES_FRAMES } from "./projects/souverain/vraie-taille-afrique/Beat2Silhouettes";
import { Beat2EqualArea } from "./projects/souverain/vraie-taille-afrique/Beat2EqualArea";
import { Beat2SilhouettesSVG, BEAT2_SVG_FRAMES } from "./projects/souverain/vraie-taille-afrique/Beat2SilhouettesSVG";
import { Beat2Test, BEAT2_TEST_FRAMES } from "./projects/souverain/vraie-taille-afrique/Beat2Test";
import { Beat3Chiffre, BEAT3_DURATION } from "./projects/souverain/vraie-taille-afrique/Beat3Chiffre";
import { Beat4Mercator, BEAT4_DURATION } from "./projects/souverain/vraie-taille-afrique/Beat4Mercator";
import { Beat5Final, BEAT5_DURATION } from "./projects/souverain/vraie-taille-afrique/Beat5Final";
import { VraieTailleAfriqueBeats2to5, BEATS_2_5_DURATION } from "./projects/souverain/vraie-taille-afrique/VraieTailleAfrique";
import { TickerTapeHistoryDemo, TICKER_TAPE_DEMO_FRAMES } from "./projects/_shared/components/inserts/TickerTapeHistory";
import { CrossSectionDemo, CROSS_SECTION_DEMO_FRAMES } from "./projects/_shared/components/inserts/CrossSection";
import { WealthScaleDemo, WEALTH_SCALE_DEMO_FRAMES } from "./projects/_shared/components/inserts/WealthScale";
import { GoldVeinDemo, GOLD_VEIN_FRAMES } from "./projects/_shared/components/inserts/GoldVein";
import { EmpireOverlay, EMPIRE_OVERLAY_FRAMES } from "./projects/_shared/components/inserts/EmpireOverlay";
import { GlobalPulse, GLOBAL_PULSE_FRAMES, GlobalPulseV2, GLOBAL_PULSE_V2_FRAMES } from "./projects/_shared/components/inserts/GlobalPulse";
import { SpeechBubble } from "./projects/_shared/components/layouts/SpeechBubble";
import { PortraitGeometry } from "./projects/_shared/components/layouts/PortraitGeometry";
import { ArchiveFade } from "./projects/_shared/components/layouts/ArchiveFade";
import { CountdownReveal } from "./projects/_shared/components/layouts/CountdownReveal";
import { MilitaryMarchLine } from "./projects/_shared/components/layouts/MilitaryMarchLine";
import { FillScreen } from "./projects/_shared/components/layouts/FillScreen";
import { OdometerFlip } from "./projects/_shared/components/layouts/OdometerFlip";
import { RadarPing } from "./projects/_shared/components/layouts/RadarPing";
import { TypeReveal } from "./projects/_shared/components/layouts/TypeReveal";
import { BarRace } from "./projects/_shared/components/layouts/BarRace";
import { PulseNumber } from "./projects/_shared/components/layouts/PulseNumber";
import { StackedBars } from "./projects/_shared/components/layouts/StackedBars";
import { ScaleShock } from "./projects/_shared/components/layouts/ScaleShock";
import { Timeline } from "./projects/_shared/components/layouts/Timeline";
import { NetworkGraph } from "./projects/_shared/components/layouts/NetworkGraph";
import { IconGrid } from "./projects/_shared/components/layouts/IconGrid";
import { IconStat } from "./projects/_shared/components/layouts/IconStat";
import { ProcessFlow } from "./projects/_shared/components/layouts/ProcessFlow";
import { CoinFlip } from "./projects/_shared/components/layouts/CoinFlip";
import { GlitchReveal } from "./projects/_shared/components/layouts/GlitchReveal";
import { SplitFlap } from "./projects/_shared/components/layouts/SplitFlap";
import { TimelineFracture } from "./projects/_shared/components/layouts/TimelineFracture";
import { ScaleTilt } from "./projects/_shared/components/layouts/ScaleTilt";
import { RadarScan } from "./projects/_shared/components/layouts/RadarScan";
import { BurnReveal } from "./projects/_shared/components/layouts/BurnReveal";
import { ShatterReform } from "./projects/_shared/components/layouts/ShatterReform";
import { TypeWriter } from "./projects/_shared/components/layouts/TypeWriter";
import { WordExplode } from "./projects/_shared/components/layouts/WordExplode";

const WordExplodeDemo: React.FC = () => <WordExplode />;

const TypeWriterDemo: React.FC = () => <TypeWriter />;

const ShatterReformDemo: React.FC = () => <ShatterReform />;

const BurnRevealDemo: React.FC = () => <BurnReveal />;

const RadarScanDemo: React.FC = () => <RadarScan />;

const ScaleTiltDemo: React.FC = () => <ScaleTilt />;

const GlitchRevealDemo: React.FC = () => <GlitchReveal />;

const TimelineFractureDemo: React.FC = () => <TimelineFracture />;

const SplitFlapDemo: React.FC = () => <SplitFlap />;

const CoinFlipDemo: React.FC = () => <CoinFlip />;

const PulseNumberDemo: React.FC = () => <PulseNumber />;
const TimelineDemo: React.FC = () => <Timeline />;
const NetworkGraphDemo: React.FC = () => <NetworkGraph />;
const IconGridDemo: React.FC = () => <IconGrid />;
const IconStatDemo: React.FC = () => <IconStat />;
const ProcessFlowDemo: React.FC = () => <ProcessFlow />;

const FillScreenDemo: React.FC = () => (
  <FillScreen
    fillPercent={60}
    centralValue="60%"
    topLabel="DES TERRES AFRICAINES"
    bottomLabel="vendues à des entreprises étrangères"
    fillColor="#8B3A2A"
    startFrame={0}
  />
);

const OdometerFlipDemo: React.FC = () => (
  <OdometerFlip
    toValue="1984"
    label="ANNÉE"
    subtitle="de la Conférence de Berlin"
    spinStartFrame={20}
  />
);

const BarRaceDemo: React.FC = () => <BarRace />;
const StackedBarsDemo: React.FC = () => <StackedBars />;
const ScaleShockDemo: React.FC = () => <ScaleShock />;

const RadarPingDemo: React.FC = () => (
  <RadarPing
    title="RESSOURCES AFRICAINES"
    stats={[
      { value: "$2.3T", label: "EXTRAITS", angle: 195, revealDelay: 50, ringRadius: 390 },
      { value: "54",    label: "PAYS",     angle: 345, revealDelay: 65, ringRadius: 390 },
    ]}
    startFrame={0}
  />
);

const SpeechBubbleDemo: React.FC = () => (
  <SpeechBubble
    quoteLines={[
      { text: "L’", highlight: false },
      { text: "impérialisme", highlight: true },
      { text: " est un système.", highlight: false },
      { text: "Nous ne sommes pas contre les hommes", highlight: false },
      { text: "mais contre le ", highlight: false },
      { text: "SYSTÈME.", highlight: true },
    ]}
    speaker="Thomas Sankara"
    speakerDetail="Ouagadougou, 1984"
    portraitSrc="_shared/assets/portraits/sankara.jpg"
    startFrame={0}
  />
);

const PortraitGeometryDemo: React.FC = () => (
  <PortraitGeometry
    bgColor="#8B3A2A"
    shape="circle"
    portraitSrc="_shared/assets/portraits/nkrumah.jpg"
    countryName="GHANA"
    year="1957"
    statLine="1er président africain élu"
    startFrame={0}
  />
);

const ArchiveFadeDemo: React.FC = () => (
  <ArchiveFade
    imageSrc="_shared/assets/archive/berlin-1884.jpg"
    annotations={[
      { id: "ann0", text: "Aucun Africain\nprésent", anchorX: 0.40, anchorY: 0.56, labelX: 0.10, labelY: 0.40, appearAtFrame: 25 },
      { id: "ann1", text: "Afrique divisée\nen 26 jours", anchorX: 0.48, anchorY: 0.60, labelX: 0.58, labelY: 0.66, appearAtFrame: 45 },
    ]}
    stampLabel="BERLIN · 1884"
    stampDate="15 NOVEMBRE 1884"
    colorizeAtFrame={-1}
    startFrame={0}
  />
);

const CountdownRevealDemo: React.FC = () => (
  <CountdownReveal
    label="DEPUIS L'INDÉPENDANCE"
    subLabel="1960 — 2024"
    value={64}
    unit="ans"
    contextText={"et la France détient encore\n75% de l'uranium nigérien"}
    fillDegrees={340}
    startFrame={0}
    revealFrame={108}
  />
);

const MilitaryMarchLineDemo: React.FC = () => (
  <MilitaryMarchLine
    title="HANNIBAL"
    date="218 AV. J.-C."
    stat="37 ELEPHANTS DE GUERRE"
    iconEmoji="🐘"
    mapImageSrc="_shared/assets/templates-souverain/map-mediteranee-sepia.png"
    waypoints={[
      { id: "carthage",  label: "CARTHAGE",  x: 0.52, y: 0.60, state: "past",    style: "ripple"  },
      { id: "rome",      label: "ROME",      x: 0.60, y: 0.38, state: "future",  style: "empty"   },
      { id: "les-alpes", label: "LES ALPES", x: 0.55, y: 0.25, state: "current", style: "filled"  },
    ]}
    pathPoints={[
      { x: 0.05, y: 0.61 }, { x: 0.18, y: 0.61 }, { x: 0.35, y: 0.60 },
      { x: 0.52, y: 0.60 }, { x: 0.57, y: 0.52 }, { x: 0.60, y: 0.38 },
      { x: 0.58, y: 0.30 }, { x: 0.55, y: 0.25 },
    ]}
    startFrame={0}
  />
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="poc-money-legends">
        <Composition
          id="PocMoneyLegends"
          component={PocMoneyLegends}
          durationInFrames={POC_MONEY_LEGENDS_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MapboxGhanaHighlight"
          component={MapboxGhanaHighlight}
          durationInFrames={MAPBOX_GHANA_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="GoldPriceCurve"
          component={GoldPriceCurve}
          durationInFrames={GOLD_PRICE_CURVE_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="MapboxAfricaMulti"
          component={MapboxAfricaMulti}
          durationInFrames={MAPBOX_AFRICA_MULTI_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MapboxStyleShowcase"
          component={MapboxStyleShowcase}
          durationInFrames={MAPBOX_STYLE_SHOWCASE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MapboxTypeBVertical"
          component={MapboxTypeBVertical}
          durationInFrames={MAPBOX_TYPE_B_VERTICAL_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="MapboxD3Overlay"
          component={MapboxD3Overlay}
          durationInFrames={MAPBOX_D3_OVERLAY_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="StackShowcase"
          component={StackShowcase}
          durationInFrames={STACK_SHOWCASE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MapboxOceanColor"
          component={MapboxOceanColor}
          durationInFrames={MAPBOX_OCEAN_COLOR_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MapboxGeoAfriqueStyle"
          component={MapboxGeoAfriqueStyle}
          durationInFrames={MAPBOX_GEO_AFRIQUE_STYLE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MapboxGeoAfriqueV2"
          component={MapboxGeoAfriqueV2}
          durationInFrames={MAPBOX_GEO_AFRIQUE_V2_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="MapboxGeoAfriqueV3"
          component={MapboxGeoAfriqueV3}
          durationInFrames={MAPBOX_GEO_AFRIQUE_V3_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="MapboxGeoAfriqueV4"
          component={MapboxGeoAfriqueV4}
          durationInFrames={MAPBOX_GEO_AFRIQUE_V4_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="MapboxGeoAfriqueV5"
          component={MapboxGeoAfriqueV5}
          durationInFrames={MAPBOX_GEO_AFRIQUE_V5_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="MapboxTypeBVerticalV5"
          component={MapboxTypeBVerticalV5}
          durationInFrames={MAPBOX_TYPE_B_V5_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
      <Folder name="poc-mapbox-tests">
        <Composition
          id="MapboxMarqueurs"
          component={MapboxMarqueurs}
          durationInFrames={MAPBOX_MARQUEURS_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MapboxMarqueursV2"
          component={MapboxMarqueursV2}
          durationInFrames={MAPBOX_MARQUEURS_V2_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="MapboxProjectionsTest"
          component={MapboxProjectionsTest}
          durationInFrames={MAPBOX_PROJECTIONS_TEST_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="MapboxProjectionsV2Vertical"
          component={MapboxProjectionsV2Vertical}
          durationInFrames={MAPBOX_PROJECTIONS_V2_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="MapboxProjectionsV2Horizontal"
          component={MapboxProjectionsV2Horizontal}
          durationInFrames={MAPBOX_PROJECTIONS_V2_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MapboxTextures"
          component={MapboxTextures}
          durationInFrames={MAPBOX_TEXTURES_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="MapboxAnimations"
          component={MapboxAnimations}
          durationInFrames={MAPBOX_ANIMATIONS_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="MapboxAnimationsV2"
          component={MapboxAnimationsV2}
          durationInFrames={MAPBOX_ANIMATIONS_V2_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="MapboxHybrides"
          component={MapboxHybrides}
          durationInFrames={MAPBOX_HYBRIDES_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="MapboxFlagPatterns"
          component={MapboxFlagPatterns}
          durationInFrames={MAPBOX_FLAG_PATTERNS_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="MapboxTransitions"
          component={MapboxTransitions}
          durationInFrames={MAPBOX_TRANSITIONS_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="MapboxShowcaseV2"
          component={MapboxShowcaseV2}
          durationInFrames={MAPBOX_SHOWCASE_V2_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="MapboxTrellis3D"
          component={MapboxTrellis3D}
          durationInFrames={MAPBOX_TRELLIS_3D_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MapboxJohnnyHarris"
          component={MapboxJohnnyHarris}
          durationInFrames={MAPBOX_JOHNNY_HARRIS_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ShillingCoin3D"
          component={ShillingCoin3D}
          durationInFrames={SHILLING_COIN_3D_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
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
      <Folder name="tests-isoles">
        <Composition
          id="LightLeakTest"
          component={LightLeakTest}
          durationInFrames={LIGHT_LEAK_TEST_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="LottieTest"
          component={LottieTest}
          durationInFrames={LOTTIE_TEST_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SilentBarterTest"
          component={SilentBarterTest}
          durationInFrames={SILENT_BARTER_TEST_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="PaletteShowcase"
          component={PaletteShowcase}
          durationInFrames={PALETTE_SHOWCASE_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SilentBarterTestV3"
          component={SilentBarterTestV3}
          durationInFrames={SILENT_BARTER_V3_FRAMES}
          fps={30}
          width={1080}
          height={1920}
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
      <Folder name="atlas-peste-1347">
        <Composition
          id="PesteMapPreview"
          component={PesteMapPreview}
          durationInFrames={150}
          fps={30}
          width={720}
          height={1280}
        />
        <Composition
          id="PesteBeat1Hook"
          component={P1347_Beat1Hook}
          durationInFrames={225}
          fps={30}
          width={720}
          height={1280}
        />
        <Composition
          id="PesteBeat2Setup"
          component={Beat2Setup}
          durationInFrames={691}
          fps={30}
          width={720}
          height={1280}
        />
        <Composition
          id="PesteBeat3Densite"
          component={Beat3Densite}
          durationInFrames={1223}
          fps={30}
          width={720}
          height={1280}
        />
        <Composition
          id="PesteBeat4Climax"
          component={Beat4Climax}
          durationInFrames={1050}
          fps={30}
          width={720}
          height={1280}
        />
        <Composition
          id="PesteBeat5MaliVivant"
          component={Beat5MaliVivant}
          durationInFrames={651}
          fps={30}
          width={720}
          height={1280}
        />
      </Folder>
      <Folder name="atlas-empire-ghana">
        <Composition
          id="EmpireGhanaHook"
          component={EmpireGhanaHook}
          durationInFrames={EMPIRE_GHANA_HOOK_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="EmpireGhanaBeat1Setup"
          component={Beat1Setup}
          durationInFrames={BEAT1_SETUP_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="EmpireGhanaBeat2Density"
          component={Beat2Density}
          durationInFrames={BEAT2_DENSITY_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="EmpireGhanaBeat3Barter"
          component={Beat3Barter}
          durationInFrames={BEAT3_BARTER_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="EmpireGhanaBeat4Consequence"
          component={Beat4Consequence}
          durationInFrames={BEAT4_CONSEQUENCE_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="EmpireGhanaBeat5CTA"
          component={Beat5CTA}
          durationInFrames={BEAT5_CTA_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="EmpireGhanaBeat6CTA"
          component={Beat6CTA}
          durationInFrames={BEAT6_CTA_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="EmpireGhanaFull"
          component={EmpireGhanaFull}
          durationInFrames={EMPIRE_GHANA_FULL_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
      <Folder name="atlas-blueprints">
        <Composition
          id="Atlas-BP-WalkToDestination"
          component={WalkToDestination}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Atlas-BP-Confrontation"
          component={Confrontation}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Atlas-BP-OrbitalCity"
          component={OrbitalCity}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Atlas-BP-ZoomRevelation"
          component={ZoomRevelation}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Atlas-BP-ShakeImpact"
          component={ShakeImpact}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Atlas-BP-Alliance"
          component={Alliance}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Atlas-BP-EmpireExpansion"
          component={EmpireExpansion}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Atlas-BP-Flashback"
          component={Flashback}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Atlas-BP-CameraTrackEntity"
          component={CameraTrackEntity}
          durationInFrames={210}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Atlas-BP-DualEntitySequential"
          component={DualEntitySequential}
          durationInFrames={690}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Atlas-BP-FormationMarch"
          component={FormationMarch}
          durationInFrames={636}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Atlas-BP-WaypointMarch"
          component={WaypointMarch}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Atlas-BP-DutchTiltCollapse"
          component={DutchTiltCollapse}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
      <Folder name="Quebec-POC">
        <Composition
          id="QuebecConquete1759"
          component={Conquete1759}
          durationInFrames={CONQUETE_1759_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="QuebecNouvelleFrance"
          component={NouvelleFrance}
          durationInFrames={NOUVELLE_FRANCE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Folder name="lab-hannibal">
        <Composition
          id="HannibalHookA"
          component={HookVersionA}
          durationInFrames={HOOK_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="HannibalHookB"
          component={HookVersionB}
          durationInFrames={HOOK_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="HannibalHookAudioA"
          component={HookWithAudio}
          durationInFrames={HOOK_FRAMES}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ version: "A" as const }}
        />
        <Composition
          id="HannibalHookAudioB"
          component={HookWithAudio}
          durationInFrames={HOOK_FRAMES}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ version: "B" as const }}
        />
        <Composition
          id="HannibalBeat1"
          component={Beat1Context}
          durationInFrames={BEAT1_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="HannibalBeat2"
          component={Beat2Rhone}
          durationInFrames={BEAT2_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="HannibalMapPOC"
          component={HannibalMapPOC}
          durationInFrames={MAP_POC_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="HannibalPaletteShowcase"
          component={HannibalPaletteShowcase}
          durationInFrames={HANNIBAL_PALETTE_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="LabHannibalPhase1"
          component={LabPhase1}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="LabHannibalPhase2"
          component={LabPhase2}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
      <Folder name="souverain-templates-library">
        <Composition
          id="TemplateB-CartoCaspianDemo"
          component={CartoCaspianDemo}
          durationInFrames={CARTO_CASPIAN_DEMO_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Insert-SmallMultiplesGridDemoA-Cream"
          component={SmallMultiplesGridDemoA}
          durationInFrames={SMALL_MULTIPLES_GRID_DEMO_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Insert-SmallMultiplesGridDemoB-Kraft"
          component={SmallMultiplesGridDemoB}
          durationInFrames={SMALL_MULTIPLES_GRID_DEMO_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="TemplateC-AtlasRealiste3DDemo"
          component={AtlasRealiste3DDemo}
          durationInFrames={ATLAS_REALISTE_3D_DEMO_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="TemplateC-AtlasRealiste3DShowcase"
          component={AtlasRealiste3DShowcase}
          durationInFrames={ATLAS_REALISTE_3D_SHOWCASE_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="TemplateD-KraftCardShowcase"
          component={KraftCardShowcase}
          durationInFrames={KRAFT_CARD_SHOWCASE_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="TemplateD-KraftCardDocClassifie-Portrait"
          component={KraftCardDocDemoPortrait}
          durationInFrames={KRAFT_CARD_DOC_DEMO_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="TemplateD-KraftCardDocClassifie-Flag"
          component={KraftCardDocDemoFlag}
          durationInFrames={KRAFT_CARD_DOC_DEMO_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="TemplateD-KraftCardDemoA-Kraft"
          component={KraftCardDemoA}
          durationInFrames={KRAFT_CARD_DEMO_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="TemplateD-KraftCardDemoB-Slate"
          component={KraftCardDemoB}
          durationInFrames={KRAFT_CARD_DEMO_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="TemplateD-KraftCardDemoC-Collage"
          component={KraftCardDemoC}
          durationInFrames={KRAFT_CARD_DEMO_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Jour4-ShowcaseA-BrutalHeadline-DataCard-BigStat"
          component={Jour4ShowcaseA}
          durationInFrames={JOUR4_SHOWCASE_A_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Jour4-ShowcaseB-NewsClipping-DateBar"
          component={Jour4ShowcaseB}
          durationInFrames={JOUR4_SHOWCASE_B_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Jour4-ShowcaseV2-Iterations"
          component={Jour4ShowcaseV2}
          durationInFrames={JOUR4_SHOWCASE_V2_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Insert-TickerTapeHistoryDemo"
          component={TickerTapeHistoryDemo}
          durationInFrames={TICKER_TAPE_DEMO_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Insert-CrossSectionDemo"
          component={CrossSectionDemo}
          durationInFrames={CROSS_SECTION_DEMO_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Insert-WealthScaleDemo"
          component={WealthScaleDemo}
          durationInFrames={WEALTH_SCALE_DEMO_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Insert-GoldVeinDemo"
          component={GoldVeinDemo}
          durationInFrames={GOLD_VEIN_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Insert-EmpireOverlayDemo"
          component={EmpireOverlay}
          durationInFrames={EMPIRE_OVERLAY_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Insert-GlobalPulseDemo"
          component={GlobalPulse}
          durationInFrames={GLOBAL_PULSE_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Insert-GlobalPulseV2Demo"
          component={GlobalPulseV2}
          durationInFrames={GLOBAL_PULSE_V2_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Insert-OsintSplitScreenDemo"
          component={OsintSplitScreenDemo}
          durationInFrames={OSINT_DEMO_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Insert-SplitScreenDemo"
          component={SplitScreenDemo}
          durationInFrames={SPLIT_SCREEN_DEMO_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Insert-GlobeCountryRevealDemo"
          component={GlobeCountryRevealDemo}
          durationInFrames={GLOBE_REVEAL_DEMO_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Insert-EntityDiagramDemo"
          component={EntityDiagramDemo}
          durationInFrames={ENTITY_DIAGRAM_DEMO_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Insert-ComparisonTableDemo"
          component={ComparisonTableDemo}
          durationInFrames={COMPARISON_TABLE_DEMO_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Insert-GlobeCountryRevealMapboxDemo"
          component={GlobeCountryRevealMapboxDemo}
          durationInFrames={GLOBE_MAPBOX_DEMO_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Insert-GlobeMontrealDemo"
          component={GlobeMontrealDemo}
          durationInFrames={GLOBE_MONTREAL_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Insert-GlobeToMercatorDemo"
          component={GlobeToMercatorDemo}
          durationInFrames={GLOBE_TO_MERCATOR_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Caspian-Original"
          component={CaspianOriginalDemo}
          durationInFrames={CASPIAN_COMPARE_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Caspian-Sepia"
          component={CaspianSepiaDemo}
          durationInFrames={CASPIAN_COMPARE_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Caspian-Smoke"
          component={CaspianSmokeDemo}
          durationInFrames={CASPIAN_COMPARE_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Caspian-Noir"
          component={CaspianNoirDemo}
          durationInFrames={CASPIAN_COMPARE_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
      <Folder name="souverain">
        <Composition
          id="OrAfricainBeat1"
          component={Beat1Hook}
          durationInFrames={BEAT1_HOOK_FRAMES}
          fps={OR_AFRICAIN_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="OrAfricainBeat2"
          component={Beat2Contexte}
          durationInFrames={BEAT2_CONTEXTE_FRAMES}
          fps={OR_AFRICAIN_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="OrAfricainBeat3a"
          component={Beat3aLeFait}
          durationInFrames={BEAT3A_FRAMES}
          fps={OR_AFRICAIN_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="OrAfricainBeat3b"
          component={Beat3bPression}
          durationInFrames={BEAT3B_FRAMES}
          fps={OR_AFRICAIN_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="OrAfricainBeat4"
          component={Beat4LeTwist}
          durationInFrames={BEAT4_FRAMES}
          fps={OR_AFRICAIN_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="OrAfricainBeat5"
          component={Beat5Verdict}
          durationInFrames={BEAT5_VERDICT_FRAMES}
          fps={OR_AFRICAIN_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="OrAfricainCTA"
          component={OrAfricainCTA}
          durationInFrames={OR_AFRICAIN_CTA_FRAMES}
          fps={OR_AFRICAIN_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="OrAfricainFull"
          component={OrAfricainFull}
          durationInFrames={OR_AFRICAIN_FULL_FRAMES}
          fps={OR_AFRICAIN_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="ZW-Beat1Hook"
          component={ZW_Beat1Hook}
          durationInFrames={ZW_BEATS.hook.endFrame - ZW_BEATS.hook.startFrame}
          fps={ZW_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="ZW-Beat2Tension"
          component={Beat2Tension}
          durationInFrames={ZW_BEATS.tension.endFrame - ZW_BEATS.tension.startFrame}
          fps={ZW_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="ZW-Beat4Transition"
          component={Beat4Transition}
          durationInFrames={ZW_BEATS.transition.endFrame - ZW_BEATS.transition.startFrame}
          fps={ZW_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="ZW-Beat5Demonstration"
          component={Beat5Demonstration}
          durationInFrames={ZW_BEATS.demonstration.endFrame - ZW_BEATS.demonstration.startFrame}
          fps={ZW_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="ZW-Beat6Question"
          component={Beat6Question}
          durationInFrames={ZW_BEATS.question.endFrame - ZW_BEATS.question.startFrame}
          fps={ZW_FPS}
          width={1080}
          height={1920}
        />
        <Composition id="Layout-SpeechBubble" component={SpeechBubbleDemo} durationInFrames={90} fps={30} width={1080} height={1920} />
        <Composition id="Layout-PortraitGeometry" component={PortraitGeometryDemo} durationInFrames={90} fps={30} width={1080} height={1920} />
        <Composition id="Layout-ArchiveFade" component={ArchiveFadeDemo} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="Layout-CountdownReveal" component={CountdownRevealDemo} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="Layout-MilitaryMarchLine" component={MilitaryMarchLineDemo} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Layout-FillScreen" component={FillScreenDemo} durationInFrames={90} fps={30} width={1080} height={1920} />
        <Composition id="Layout-OdometerFlip" component={OdometerFlipDemo} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Layout-RadarPing" component={RadarPingDemo} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Layout-BarRace" component={BarRaceDemo} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="Layout-PulseNumber" component={PulseNumberDemo} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Layout-TypeReveal" component={() => <TypeReveal />} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Layout-StackedBars" component={StackedBarsDemo} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Layout-ScaleShock" component={ScaleShockDemo} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Layout-Timeline" component={TimelineDemo} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="Layout-NetworkGraph" component={NetworkGraphDemo} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Layout-IconGrid" component={IconGridDemo} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Layout-IconStat" component={IconStatDemo} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Layout-ProcessFlow" component={ProcessFlowDemo} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Layout-CoinFlip" component={CoinFlipDemo} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Layout-GlitchReveal" component={GlitchRevealDemo} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Layout-SplitFlap" component={SplitFlapDemo} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Layout-TimelineFracture" component={TimelineFractureDemo} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Layout-ScaleTilt" component={ScaleTiltDemo} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Layout-RadarScan" component={RadarScanDemo} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Layout-BurnReveal" component={BurnRevealDemo} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Layout-ShatterReform" component={ShatterReformDemo} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Layout-TypeWriter" component={TypeWriterDemo} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Layout-WordExplode" component={WordExplodeDemo} durationInFrames={210} fps={30} width={1080} height={1920} />
        {/* ── SILICON SAVANNAH ── */}
        <Composition
          id="SS-Beat1Hook"
          component={SS_Beat1Hook}
          durationInFrames={SS_SEG.hook_kenya.end + 30}
          fps={SS_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="SS-Beat2Carte"
          component={SS_Beat2Carte}
          durationInFrames={SS_BEAT2_DURATION}
          fps={SS_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="SS-Beat3Miracle"
          component={SS_Beat3Miracle}
          durationInFrames={SS_BEAT3_DURATION}
          fps={SS_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="SS-Beat4Prix"
          component={SS_Beat4Prix}
          durationInFrames={SS_BEAT4_DURATION}
          fps={SS_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="SS-Beat5Monopole"
          component={SS_Beat5Monopole}
          durationInFrames={SS_BEAT5_DURATION}
          fps={SS_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="SS-Beat6Question"
          component={SS_Beat6Question}
          durationInFrames={SS_BEAT6_DURATION}
          fps={SS_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="SS-Beat7Cta"
          component={SS_Beat7Cta}
          durationInFrames={SS_BEAT7_DURATION}
          fps={SS_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="SiliconSavannahFull"
          component={SiliconSavannahFull}
          durationInFrames={SILICON_SAVANNAH_FULL_DURATION}
          fps={SS_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="SS-Beat2-V2"
          component={SS_Beat2_V2}
          durationInFrames={SS_BEAT2_V2_FRAMES}
          fps={SS_BEAT2_V2_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="NigerUraniumShort"
          component={NigerUraniumShort}
          durationInFrames={NIGER_TOTAL_FRAMES}
          fps={NIGER_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="StyleTestLeMonde"
          component={StyleTestLeMonde}
          durationInFrames={STYLE_TEST_LE_MONDE_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="VraieTailleAfrique-Beat1"
          component={Beat1Mercator}
          durationInFrames={BEAT1_MERCATOR_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="VraieTailleAfrique-Beat2"
          component={Beat2Silhouettes}
          durationInFrames={BEAT2_SILHOUETTES_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="VraieTailleAfrique-Beat2-SVG"
          component={Beat2SilhouettesSVG}
          durationInFrames={BEAT2_SVG_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="VraieTailleAfrique-Beat2-Test"
          component={Beat2Test}
          durationInFrames={BEAT2_TEST_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="VraieTailleAfrique-Beat3"
          component={Beat3Chiffre}
          durationInFrames={BEAT3_DURATION}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="VraieTailleAfrique-Beat4"
          component={Beat4Mercator}
          durationInFrames={BEAT4_DURATION}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="VraieTailleAfrique-Beat5"
          component={Beat5Final}
          durationInFrames={BEAT5_DURATION}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="VraieTailleAfrique-Beats2to5"
          component={VraieTailleAfriqueBeats2to5}
          durationInFrames={BEATS_2_5_DURATION}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="VraieTailleAfrique-Beat2-EqualArea"
          component={Beat2EqualArea}
          durationInFrames={600}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>

      <Folder name="Senegal-Petrole-Gaz">
        <Composition
          id="SPG-Beat1-Anomalie"
          component={SPG_Beat1Anomalie}
          durationInFrames={SPG_AUDIO_SEGMENTS.acte1_anomalie.endFrame - SPG_AUDIO_SEGMENTS.acte1_anomalie.startFrame}
          fps={SPG_FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="SPG-Beat1-AnomalieV2"
          component={SPG_Beat1AnomalieV2}
          durationInFrames={SPG_AUDIO_SEGMENTS.acte1_anomalie.endFrame - SPG_AUDIO_SEGMENTS.acte1_anomalie.startFrame}
          fps={SPG_FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="SPG-Beat1-AnomalieV3"
          component={SPG_Beat1AnomalieV3}
          durationInFrames={SPG_AUDIO_SEGMENTS.acte1_anomalie.endFrame - SPG_AUDIO_SEGMENTS.acte1_anomalie.startFrame}
          fps={SPG_FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="SPG-Beat1-AnomalieV4"
          component={SPG_Beat1AnomalieV4}
          durationInFrames={SPG_AUDIO_SEGMENTS.acte1_anomalie.endFrame - SPG_AUDIO_SEGMENTS.acte1_anomalie.startFrame}
          fps={SPG_FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="SPG-Beat1-AnomalieV5"
          component={SPG_Beat1AnomalieV5}
          durationInFrames={SPG_AUDIO_SEGMENTS.acte1_anomalie.endFrame - SPG_AUDIO_SEGMENTS.acte1_anomalie.startFrame}
          fps={SPG_FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="SPG-TestWaveReveal"
          component={TestWaveReveal}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="SPG-TestWaveReveal-169"
          component={TestWaveReveal}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="SPG-TestTextureA"
          component={TestTextureA}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="SPG-TestTextureB"
          component={TestTextureB}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="RDC-No-Sense">
        <Composition
          id={RDC_NO_SENSE_ID}
          component={RdcNoSenseFull}
          durationInFrames={RDC_NO_SENSE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
