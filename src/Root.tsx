import { Composition, Folder, staticFile as staticFileRoot } from "remotion";
import { CarouselSouverain, CarouselSouverainProps } from "./projects/_shared/components/layouts/CarouselSouverain";
import { CAROUSELS } from "./projects/souverain/carousels/carousel-data";
import { Beat0Hook } from "./projects/souverain/maroc-batteries/beats/Beat0Hook";
import { Beat1Phosphate } from "./projects/souverain/maroc-batteries/beats/Beat1Phosphate";
import { Beat3Acteurs } from "./projects/souverain/maroc-batteries/beats/Beat3Acteurs";
import { Beat4Geographie } from "./projects/souverain/maroc-batteries/beats/Beat4Geographie";
import { Beat5Question } from "./projects/souverain/maroc-batteries/beats/Beat5Question";
import { MarocBatteriesShort, MAROC_SHORT_FRAMES } from "./projects/souverain/maroc-batteries/MarocBatteriesShort";
import { Beat3bMapClean } from "./projects/souverain/carousels/hybrid/Beat3bMapClean";
import { Beat1HookClean } from "./projects/souverain/carousels/hybrid/Beat1HookClean";
import { CurveChartClean } from "./projects/souverain/carousels/hybrid/CurveChartClean";
import { GhanaMapClean } from "./projects/souverain/carousels/hybrid/GhanaMapClean";
import { AfriqueOuestMapClean } from "./projects/souverain/carousels/hybrid/AfriqueOuestMapClean";
import { CarouselSlideHybrid } from "./projects/souverain/carousels/hybrid/CarouselSlideHybrid";
import { GoodNewsCarousel } from "./projects/souverain/carousels/good-news/GoodNewsCarousel";
import { GoodNewsSlideLight } from "./projects/souverain/carousels/good-news/GoodNewsSlideLight";
import { GoodNewsSlideMap } from "./projects/souverain/carousels/good-news/GoodNewsSlideMap";
import {
  hookProps as gnHook, ctaProps as gnCta,
  news0FactProps as gnN0F, news0MacroProps as gnN0M,
  news1FactProps as gnN1F, news1MacroProps as gnN1M,
  news2FactProps as gnN2F, news2MacroProps as gnN2M,
} from "./projects/souverain/carousels/good-news/slide-props";
import { CarouselCtaSlide } from "./projects/souverain/carousels/hybrid/CarouselCtaSlide";
import { CarouselSlideAtlas } from "./projects/souverain/carousels/hybrid/CarouselSlideAtlas";
import { AtlasFormat1SplitScreen } from "./projects/souverain/carousels/hybrid/AtlasFormat1SplitScreen";
import { AtlasFormat2CarteDeJeu } from "./projects/souverain/carousels/hybrid/AtlasFormat2CarteDeJeu";
import { AtlasFormat3SmartCrop } from "./projects/souverain/carousels/hybrid/AtlasFormat3SmartCrop";
import { AtlasFormat4PanneauOpaque } from "./projects/souverain/carousels/hybrid/AtlasFormat4PanneauOpaque";
import { SEGMENTS as MAROC_SEGMENTS } from "./projects/souverain/maroc-batteries/timing";
import { BlankComposition } from "./BlankComposition";
import { HeroDataShowcase, HERO_DATA_SHOWCASE_FRAMES } from "./projects/_shared/demos/HeroDataShowcase";
import { A3Cailloux, A3_CAILLOUX_FRAMES } from "./projects/souverain/maroc-batteries/A3Cailloux";
import { A6Question, A6_QUESTION_FRAMES } from "./projects/souverain/maroc-batteries/A6Question";
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
import { AtlasAttackArrowDemo } from "./projects/atlas/_shared/AtlasAttackArrowDemo";
import { AtlasEncirclementDemo } from "./projects/atlas/_shared/AtlasEncirclementDemo";
import { P1_OrthoLinksDemo, P1_FRAMES } from "./projects/warmap/_rnd/maxbellona/P1_OrthoLinks";
import { P2_FactionBadgeDemo, P2_FRAMES } from "./projects/warmap/_rnd/maxbellona/P2_FactionBadge";
import { P4_DashedFlowDemo, P4_FRAMES } from "./projects/warmap/_rnd/maxbellona/P4_DashedFlow";
import { P3_MapTransformDemo, P3_FRAMES } from "./projects/warmap/_rnd/maxbellona/P3_MapTransform";
import { P5_SplitScreenDemo, P5_FRAMES } from "./projects/warmap/_rnd/maxbellona/P5_SplitScreen";
import { P6_SplitLiveMapsDemo, P6_FRAMES } from "./projects/warmap/_rnd/maxbellona/P6_SplitLiveMaps";
import { AtlasCannesScene } from "./projects/atlas/_shared/AtlasCannesScene";
import { AtlasCannesHannibal } from "./projects/atlas/_shared/AtlasCannesHannibal";
import { AtlasMansaMoussaV2Final } from "./projects/atlas/_reference/mansa-moussa-v2/AtlasMansaMoussaV2Final";
import { TOTAL_DURATION_FRAMES as MANSA_V2_FRAMES } from "./projects/atlas/_reference/mansa-moussa-v2/timing-mansa-moussa-v2";
import { AtlasV2SaharanDropDemo, SAHARAN_DROP_DEMO_FRAMES } from "./projects/atlas/_reference/mansa-moussa-v2/scenes/AtlasV2SaharanDropDemo";
import { AtlasV2ConfrontationDemo, CONFRONTATION_DEMO_FRAMES } from "./projects/atlas/_reference/mansa-moussa-v2/scenes/AtlasV2ConfrontationDemo";
import { AtlasV2ArmyDeployDemo, AtlasV2ArmyDeploySeqDemo, ARMY_DEPLOY_DEMO_FRAMES } from "./projects/atlas/_reference/mansa-moussa-v2/scenes/AtlasV2ArmyDeployDemo";
import { AtlasV2EncerclementDemo, ENCERCLEMENT_DEMO_FRAMES } from "./projects/atlas/_reference/mansa-moussa-v2/scenes/AtlasV2EncerclementDemo";
import { Beat1Hook as P1347_Beat1Hook } from "./projects/atlas/peste-1347/Beat1Hook";
import { Beat2Setup } from "./projects/atlas/peste-1347/Beat2Setup";
import { Beat3Densite } from "./projects/atlas/peste-1347/Beat3Densite";
import { Beat4Climax } from "./projects/atlas/peste-1347/Beat4Climax";
import { Beat5MaliVivant } from "./projects/atlas/peste-1347/Beat5MaliVivant";
import { Beat6Conclusion } from "./projects/atlas/peste-1347/Beat6Conclusion";
import { PesteSubtitles } from "./projects/atlas/peste-1347/PesteSubtitles";
import { Prototype_A_MapboxSatelliteSenegal } from "./projects/_proto-16-9/Prototype_A_MapboxSatelliteSenegal";
import { Prototype_B_OdometerDataHero } from "./projects/_proto-16-9/Prototype_B_OdometerDataHero";
import { Prototype_C_CompositionTest } from "./projects/_proto-16-9/Prototype_C_CompositionTest";
import { Prototype_D_MapboxStyleComparison } from "./projects/_proto-16-9/Prototype_D_MapboxStyleComparison";
import { Prototype_E_BackgroundsShowcase } from "./projects/_proto-16-9/Prototype_E_BackgroundsShowcase";
import { Prototype_F_Vague2Showcase } from "./projects/_proto-16-9/Prototype_F_Vague2Showcase";
import { Prototype_G_Vague3Showcase } from "./projects/_proto-16-9/Prototype_G_Vague3Showcase";
import { Prototype_H_Vague3bShowcase } from "./projects/_proto-16-9/Prototype_H_Vague3bShowcase";
import { Prototype_I_Vague3cShowcase } from "./projects/_proto-16-9/Prototype_I_Vague3cShowcase";
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
import { LineChartDrawOn } from "./projects/_shared/components/layouts/LineChartDrawOn";
import { HighlightedQuote } from "./projects/_shared/components/layouts/HighlightedQuote";
import { StatComparisonGrid } from "./projects/_shared/components/layouts/StatComparisonGrid";
import { FlowArrowsMap } from "./projects/_shared/components/layouts/FlowArrowsMap";
import { ParadigmShiftTimeline } from "./projects/_shared/components/layouts/ParadigmShiftTimeline";
import { CountryIsolateWithHatch } from "./projects/_shared/components/layouts/CountryIsolateWithHatch";
import { LaCalebasse } from "./projects/_shared/components/layouts/LaCalebasse";
import { LeCadranSolaire } from "./projects/_shared/components/layouts/LeCadranSolaire";
import { Stratigraphie } from "./projects/_shared/components/layouts/Stratigraphie";
import { LeSceau } from "./projects/_shared/components/layouts/LeSceau";
import { PolyrythmieData } from "./projects/_shared/components/layouts/PolyrythmieData";
import { NoeudTisserand } from "./projects/_shared/components/layouts/NoeudTisserand";
import { LeSemeur } from "./projects/_shared/components/layouts/LeSemeur";
import { Palimpseste } from "./projects/_shared/components/layouts/Palimpseste";
import { ArbreAPalabres } from "./projects/_shared/components/layouts/ArbreAPalabres";
import { Caviardage } from "./projects/_shared/components/layouts/Caviardage";
import { FilRouge } from "./projects/_shared/components/layouts/FilRouge";
import { SovereignEclipse } from "./projects/_shared/components/layouts/SovereignEclipse";
import { Prototype_J_Vague4Showcase } from "./projects/_proto-16-9/Prototype_J_Vague4Showcase";
import { Prototype_K_Vague5Showcase } from "./projects/_proto-16-9/Prototype_K_Vague5Showcase";
import { Prototype_L_Vague6Showcase } from "./projects/_proto-16-9/Prototype_L_Vague6Showcase";
import { Prototype_M_Vague7Showcase } from "./projects/_proto-16-9/Prototype_M_Vague7Showcase";
import { Prototype_N_Vague8Showcase } from "./projects/_proto-16-9/Prototype_N_Vague8Showcase";
import { Prototype_O_Vague6ExpShowcase } from "./projects/_proto-16-9/Prototype_O_Vague6ExpShowcase";
import { ParallaxeDiorama } from "./projects/_shared/components/layouts/ParallaxeDiorama";
import { MosaiqueWax } from "./projects/_shared/components/layouts/MosaiqueWax";
import { MetamorphoseFiduciaire } from "./projects/_shared/components/layouts/MetamorphoseFiduciaire";
import { OrigamiCarto } from "./projects/_shared/components/layouts/OrigamiCarto";
import { LoomWeaver } from "./projects/_shared/components/layouts/LoomWeaver";
import { PortraitEditorial } from "./projects/_shared/components/layouts/PortraitEditorial";
import { TrombinoscapeStrategique } from "./projects/_shared/components/layouts/TrombinoscapeStrategique";
import { PortraitSilhouette } from "./projects/_shared/components/layouts/PortraitSilhouette";
import { MosaiqueActeurs } from "./projects/_shared/components/layouts/MosaiqueActeurs";
import { PassationPouvoir } from "./projects/_shared/components/layouts/PassationPouvoir";
import { VoixDuPeuple } from "./projects/_shared/components/layouts/VoixDuPeuple";
import { FaceAFace } from "./projects/_shared/components/layouts/FaceAFace";
import { PortraitDossier } from "./projects/_shared/components/layouts/PortraitDossier";
import { TextChoc } from "./projects/_shared/components/layouts/TextChoc";
import { SourceProuve } from "./projects/_shared/components/layouts/SourceProuve";
import { ChiffreChoc } from "./projects/_shared/components/layouts/ChiffreChoc";
import { CalqueDechire } from "./projects/_shared/components/layouts/CalqueDechire";
import { ScanInfrarouge } from "./projects/_shared/components/layouts/ScanInfrarouge";
import { EffetDomino } from "./projects/_shared/components/layouts/EffetDomino";
import { LoomWipe } from "./projects/_shared/components/layouts/LoomWipe";
import { Prototype_P_Vague4bShowcase } from "./projects/_proto-16-9/Prototype_P_Vague4bShowcase";
import { Prototype_Q_Vague3CompleteShowcase } from "./projects/_proto-16-9/Prototype_Q_Vague3CompleteShowcase";
import { Prototype_R_Vague1RefactorShowcase, PROTO_R_FRAMES } from "./projects/_proto-16-9/Prototype_R_Vague1RefactorShowcase";
import { ProtoEffect_Loupe } from "./projects/_proto-16-9/ProtoEffect_Loupe";
import { ProtoEffect_MapDraw } from "./projects/_proto-16-9/ProtoEffect_MapDraw";
import { VilleCompare } from "./projects/_rnd/svg-scenes/VilleCompare";
import { JetonsCompare } from "./projects/_rnd/svg-scenes/JetonsCompare";
import { Donut60Proto } from "./projects/_rnd/svg-scenes/Donut60Proto";
import { BarilHeroProto } from "./projects/_rnd/svg-scenes/BarilHeroProto";
import { EtatMajorCompare } from "./projects/_rnd/svg-scenes/EtatMajorCompare";
import { VilleGeminiAnimee } from "./projects/_rnd/svg-scenes/VilleGeminiAnimee";
import { EtatMajorGptAnimee } from "./projects/_rnd/svg-scenes/EtatMajorGptAnimee";
import { OffshoreCompare } from "./projects/_rnd/svg-scenes/OffshoreCompare";
import { OffshoreGeminiAnimee } from "./projects/_rnd/svg-scenes/OffshoreGeminiAnimee";
import { OffshoreGeminiAnimeeSFX } from "./projects/_rnd/svg-scenes/OffshoreGeminiAnimeeSFX";
import { ProfilCompare, DuoCompare, AnimalCompare } from "./projects/_rnd/svg-scenes/OrganiqueCompare";
import { DefenseCompare } from "./projects/_rnd/svg-scenes/DefenseCompare";
import { DefenseGptAnimee } from "./projects/_rnd/svg-scenes/DefenseGptAnimee";
import { CfaCompare } from "./projects/_rnd/svg-scenes/CfaCompare";
import { CfaFrancAnimee } from "./projects/_rnd/svg-scenes/CfaFrancAnimee";
import { CfaFrancAnimeeSFX } from "./projects/_rnd/svg-scenes/CfaFrancAnimeeSFX";
import { MineCompare } from "./projects/_rnd/svg-scenes/MineCompare";
import { DemiLuneCompare } from "./projects/_rnd/svg-scenes/DemiLuneCompare";
import { DemiLuneEncreColorisee } from "./projects/_rnd/svg-scenes/DemiLuneEncreColorisee";
import { DemiLuneBraiseAnimee } from "./projects/_rnd/svg-scenes/DemiLuneBraiseAnimee";
import { MurTopDownBraise } from "./projects/_rnd/svg-scenes/MurTopDownBraise";
import { Img2SvgCompare } from "./projects/_rnd/svg-scenes/Img2SvgCompare";
import { TopDown3Compare } from "./projects/_rnd/svg-scenes/TopDown3Compare";
import { GgwD3GeoMap } from "./projects/_rnd/svg-scenes/GgwD3GeoMap";
import { GgwD3GeoMapEncre } from "./projects/_rnd/svg-scenes/GgwD3GeoMapEncre";
import { GgwD3GeoMapSFX } from "./projects/_rnd/svg-scenes/GgwD3GeoMapSFX";
import { GgwD3GeoMapEncreSFX } from "./projects/_rnd/svg-scenes/GgwD3GeoMapEncreSFX";
import { MineGeminiAnimee } from "./projects/_rnd/svg-scenes/MineGeminiAnimee";
import { HeroGptAnimee } from "./projects/_rnd/svg-scenes/HeroGptAnimee";
import { CreusetAnimee } from "./projects/_rnd/svg-scenes/CreusetAnimee";
import { GraineStatic } from "./projects/_rnd/svg-scenes/GraineStatic";
import { GraineGeminiAnimee } from "./projects/_rnd/svg-scenes/GraineGeminiAnimee";
import { ProtoEffect_TypewriterStock } from "./projects/_proto-16-9/ProtoEffect_TypewriterStock";
import { ProtoEffect_Newspaper3D } from "./projects/_proto-16-9/ProtoEffect_Newspaper3D";
import { ProtoEffect_Loupe3D } from "./projects/_proto-16-9/ProtoEffect_Loupe3D";
import { ProtoEffect_MapDrawParchemin } from "./projects/_proto-16-9/ProtoEffect_MapDrawParchemin";
import { DemoLimogeageTemplates } from "./projects/_proto-16-9/DemoLimogeageTemplates";
import { ProtoEffect_Fracture } from "./projects/_proto-16-9/ProtoEffect_Fracture";
import { SenegalScene0 } from "./projects/_proto-16-9/SenegalScene0";
import { SenegalScene1 } from "./projects/_proto-16-9/SenegalScene1";
import { SenegalScene1Intro } from "./projects/_proto-16-9/SenegalScene1Intro";
import { SenegalScene1IntroCoin } from "./projects/_proto-16-9/SenegalScene1IntroCoin";
import { SenegalCoinSVGProbe } from "./projects/_proto-16-9/SenegalCoinSVGProbe";
import { IntroProtoC } from "./projects/_proto-16-9/IntroProtoC";
import { IntroProtoB } from "./projects/_proto-16-9/IntroProtoB";
import { IntroProtoA } from "./projects/_proto-16-9/IntroProtoA";
import { MatterCompare } from "./projects/_proto-16-9/MatterCompare";
import { MatterOnMap } from "./projects/_proto-16-9/MatterOnMap";
import { ProtoHera_ChartsParchemin } from "./projects/_proto-16-9/ProtoHera_ChartsParchemin";
import { ProtoHera_ChartOnMap } from "./projects/_proto-16-9/ProtoHera_ChartOnMap";
import { TealAssemblyEtat3, TEAL_ASSEMBLY_FRAMES } from "./projects/_rnd/cobaye-maroc-phosphate/TealAssemblyEtat3";
import { ProtoCarto_ContinentDraw } from "./projects/_proto-16-9/ProtoCarto_ContinentDraw";
import { ProtoCarto_OffshoreCut } from "./projects/_proto-16-9/ProtoCarto_OffshoreCut";
import { ProtoCarto_TerritoireDecoupe } from "./projects/_proto-16-9/ProtoCarto_TerritoireDecoupe";
import { ProtoCarto_CoucheTemps } from "./projects/_proto-16-9/ProtoCarto_CoucheTemps";
import { ProtoHera_TerminalNeon } from "./projects/_proto-16-9/ProtoHera_TerminalNeon";
import { ProtoHera_Sketch } from "./projects/_proto-16-9/ProtoHera_Sketch";
import { ProtoHera_Timeline } from "./projects/_proto-16-9/ProtoHera_Timeline";
import { HeraFidele_V08_ChartMap, HeraFidele_V13_Bars, HeraFidele_V01_Poll, HeraFidele_V10_Timeline, HeraFidele_V04_FlagsOnMap, HeraFidele_V02_PressArticle } from "./projects/_proto-16-9/ProtoHeraFidele_Repros";
import { HeraFidele_V03_KineticText, HeraFidele_V12_LineChart } from "./projects/_proto-16-9/ProtoHeraFidele_Repros2";
import { Beat0Accroche as SenegalBeat0 } from "./projects/souverain/senegal-petrole-gaz/beats/Beat0Accroche";
import { Beat0AccrocheV7 as SenegalBeat0V7 } from "./projects/souverain/senegal-petrole-gaz/beats/Beat0AccrocheV7";
import { Beat0PlaqueProto as SenegalBeat0Proto } from "./projects/souverain/senegal-petrole-gaz/beats/Beat0PlaqueProto";
import { Beat1 as SenegalBeat1 } from "./projects/souverain/senegal-petrole-gaz/beats/Beat1";
import { Beat2 as SenegalBeat2 } from "./projects/souverain/senegal-petrole-gaz/beats/Beat2";
import { Beat3 as SenegalBeat3 } from "./projects/souverain/senegal-petrole-gaz/beats/Beat3";
import { Beat5 as SenegalBeat5 } from "./projects/souverain/senegal-petrole-gaz/beats/Beat5";
import { Beat6 as SenegalBeat6 } from "./projects/souverain/senegal-petrole-gaz/beats/Beat6";
import { Beat7 as SenegalBeat7 } from "./projects/souverain/senegal-petrole-gaz/beats/Beat7";
import { Beat8 as SenegalBeat8 } from "./projects/souverain/senegal-petrole-gaz/beats/Beat8";
import { Beat9 as SenegalBeat9 } from "./projects/souverain/senegal-petrole-gaz/beats/Beat9";
import { Beat10 as SenegalBeat10 } from "./projects/souverain/senegal-petrole-gaz/beats/Beat10";
import { Beat11 as SenegalBeat11 } from "./projects/souverain/senegal-petrole-gaz/beats/Beat11";
import { Beat12 as SenegalBeat12 } from "./projects/souverain/senegal-petrole-gaz/beats/Beat12";
import { Beat13 as SenegalBeat13 } from "./projects/souverain/senegal-petrole-gaz/beats/Beat13";
import { Beat14 as SenegalBeat14 } from "./projects/souverain/senegal-petrole-gaz/beats/Beat14";
import { Beat14PhaseC } from "./projects/souverain/senegal-petrole-gaz/beats/Beat14PhaseC";
import { Beat12SvgDemo, BEAT12_SVG_DEMO_FRAMES } from "./projects/souverain/senegal-petrole-gaz/beats/Beat12SvgDemo";
import { SenegalActe2, SENEGAL_ACTE2_FRAMES } from "./projects/souverain/senegal-petrole-gaz/SenegalActe2";
import { SenegalPreviewActes12, SENEGAL_PREVIEW_ACTES12_FRAMES } from "./projects/souverain/senegal-petrole-gaz/SenegalPreviewActes12";
import { SenegalActe2Continu } from "./projects/souverain/senegal-petrole-gaz/SenegalActe2Continu";
import { SenegalActe2Full, SENEGAL_ACTE2_FULL_FRAMES } from "./projects/souverain/senegal-petrole-gaz/SenegalActe2Full";
import { PrototypeD3StackedBars } from "./projects/souverain/senegal-petrole-gaz/prototypes/PrototypeD3StackedBars";
import { MapboxCameraLab, MAPBOX_CAMERA_LAB_FRAMES } from "./projects/_shared/mapbox/MapboxCameraLab";
import { CartoSouverainV5Demo } from "./projects/_shared/mapbox/CartoSouverainV5Demo";
import { CartoSouverainV5RegionalDemo } from "./projects/_shared/mapbox/CartoSouverainV5RegionalDemo";
import { SceneGisementsV5 } from "./projects/souverain/senegal-petrole-gaz/beats/SceneGisementsV5";
import { SceneGisementsV5Effets } from "./projects/souverain/senegal-petrole-gaz/beats/SceneGisementsV5Effets";
import { SceneGisementsV3 } from "./projects/souverain/senegal-petrole-gaz/beats/SceneGisementsV3";
import { TokenShowcaseV5 } from "./projects/_shared/mapbox/_demos/TokenShowcaseV5";
import { SvgTokenCompare } from "./projects/_shared/mapbox/_demos/SvgTokenCompare";
import { CartoGeoStickTest } from "./projects/_shared/mapbox/CartoGeoStickTest";
import { MapboxOverlayLab, MAPBOX_OVERLAY_LAB_FRAMES } from "./projects/_shared/mapbox/MapboxOverlayLab";
import { MapboxOverlayLabV2, MAPBOX_OVERLAY_LAB_V2_FRAMES } from "./projects/_shared/mapbox/MapboxOverlayLabV2";
import { MapboxLottieShowcase, MAPBOX_LOTTIE_SHOWCASE_FRAMES } from "./projects/_shared/mapbox/MapboxLottieShowcase";
import { MapboxFlagFill } from "./projects/_shared/mapbox/MapboxFlagFill";
import { MapboxIsolateZone } from "./projects/_shared/mapbox/MapboxIsolateZone";
import { SequentialBorderPulse } from "./projects/_shared/mapbox/SequentialBorderPulse";
import { GlassmorphismGeoPopup } from "./projects/_shared/mapbox/GlassmorphismGeoPopup";
import { SequentialFlagReveal } from "./projects/_shared/mapbox/SequentialFlagReveal";
import { LottieGeoAura } from "./projects/_shared/mapbox/LottieGeoAura";
import { SweepRevealTerritory } from "./projects/_shared/mapbox/SweepRevealTerritory";
import { DominoContagionFill } from "./projects/_shared/mapbox/DominoContagionFill";
import { FiberOpticBorderDraw } from "./projects/_shared/mapbox/FiberOpticBorderDraw";
import { GeoFlowConnection } from "./projects/_shared/mapbox/GeoFlowConnection";
import { FiberOpticFlagInvade } from "./projects/_shared/mapbox/FiberOpticFlagInvade";
import { KineticMaskSlam } from "./projects/_shared/mapbox/KineticMaskSlam";
import { KineticMaskSlamFX } from "./projects/_shared/_demos/KineticMaskSlamFX";
import { KineticSlam3D } from "./projects/_shared/_demos/KineticSlam3D";
import { Country3DRise } from "./projects/_shared/_demos/Country3DRise";
import { Asset3DShowcase } from "./projects/_shared/_demos/Asset3DShowcase";
import { JetonWarMap3DCompare } from "./projects/_shared/_demos/JetonWarMap3DCompare";
import { RapidFireCountries } from "./projects/_shared/mapbox/RapidFireCountries";
import { ClassifiedRedactReveal } from "./projects/_shared/mapbox/ClassifiedRedactReveal";
import { MapCutaway } from "./projects/_shared/mapbox/MapCutaway";
import { ComboMaskSweep } from "./projects/_shared/mapbox/ComboMaskSweep";
import { ArteryDrain } from "./projects/_shared/hooks-lib/ArteryDrain";
import { CrosshairLock } from "./projects/_shared/hooks-lib/CrosshairLock";
import { RedlineContagion } from "./projects/_shared/hooks-lib/RedlineContagion";
import { MaskReveal } from "./projects/_shared/hooks-lib/MaskReveal";
import { HookAESActe1Proto } from "./projects/warmap/HookAESActe1Proto";
import { SoudanActe1Ouverture, SOUDAN_A1_DURATION, SOUDAN_A1_FPS } from "./projects/warmap/SoudanActe1Ouverture";
import { ComboSweepDominoFlag } from "./projects/_shared/mapbox/ComboSweepDominoFlag";
import { ComboFiberAuraPopup } from "./projects/_shared/mapbox/ComboFiberAuraPopup";
// ── N1-N4 Fill-Pattern templates (session 2026-06-03)
import { FlagFillStatic } from "./projects/_shared/mapbox/FlagFillStatic";
import { FlagFillSequence } from "./projects/_shared/mapbox/FlagFillSequence";
import { ResourceTextureFill } from "./projects/_shared/mapbox/ResourceTextureFill";
import { HeatGradientFill, PALETTE_PETROLE, PALETTE_LITHIUM } from "./projects/_shared/mapbox/HeatGradientFill";
import { WavingFlagFill } from "./projects/_shared/mapbox/WavingFlagFill";
import { FlagDissolveTransition } from "./projects/_shared/mapbox/FlagDissolveTransition";
import { ImageProjectionFill } from "./projects/_shared/mapbox/ImageProjectionFill";
import { PulsingRegionFill } from "./projects/_shared/mapbox/PulsingRegionFill";
import { ContagionFlagSpread } from "./projects/_shared/mapbox/ContagionFlagSpread";
import { GeoCountryPlaqueShowcase, GEO_COUNTRY_PLAQUE_SHOWCASE_FRAMES } from "./projects/_shared/mapbox/GeoCountryPlaqueShowcase";
import { PetrolePatience, PETROLE_PATIENCE_FRAMES } from "./projects/_demos/petrole-patience/PetrolePatience";
import { PetrolePatienceShort, PETROLE_PATIENCE_SHORT_FRAMES } from "./projects/_demos/petrole-patience/PetrolePatienceShort";
import { PetrolePatienceShort as PetrolePatienceShortV2, PETROLE_PATIENCE_SHORT_FRAMES as PETROLE_PATIENCE_SHORT_V2_FRAMES } from "./projects/souverain/petrole-patience-short/PetrolePatienceShort";
import { AfriqueNumeriqueShort, AFRIQUE_NUMERIQUE_SHORT_FRAMES } from "./projects/_demos/afrique-numerique/AfriqueNumeriqueShort";
import { CobaltRDCShort, COBALT_RDC_SHORT_FRAMES } from "./projects/_demos/cobalt-rdc/CobaltRDCShort";
import { LAnomalieMontreal, ANOMALIE_MONTREAL_FRAMES } from "./projects/_demos/anomalie-montreal/LAnomalieMontreal";
import { ThumbnailBaril } from "./projects/_demos/petrole-patience/ThumbnailBaril";
import { ThumbnailNiger } from "./projects/_demos/niger-uranium/ThumbnailNiger";
import { ThumbnailMansa } from "./projects/_demos/mansa-moussa/ThumbnailMansa";
import { ThumbnailSonjataDemo } from "./projects/_demos/sonjata/ThumbnailSonjataDemo";
import { ThumbnailAES } from "./projects/_demos/warmap-sahel/ThumbnailAES";
import { WarMapEngine, SUDAN_FPS, SUDAN_FLAT_DURATION, SUDAN_OVERLAY_DURATION, SUDAN_EPIC_DURATION } from "./projects/warmap/engine/WarMapEngine";
import { SahelWarMapEngine, SAHEL_FPS, SAHEL_DURATION } from "./projects/warmap/engine/SahelWarMapEngine";
import { SahelFriseOverlayDemo } from "./projects/warmap/_shared/SahelFriseOverlayDemo";
import { SahelPrepositionnementDemo } from "./projects/warmap/_shared/SahelPrepositionnementDemo";
import { GeoConvergenceDemo } from "./projects/warmap/_shared/GeoConvergenceDemo";
import { MapAnimationShowcase, SHOWCASE_FPS, SHOWCASE_DURATION } from "./projects/warmap/engine/MapAnimationShowcase";
import { LobitoWarmapScene, LOBITO_WARMAP_FRAMES } from "./projects/_rnd/lobito-corridor/LobitoWarmapScene";
import { LobitoVersionA, LOBITO_A_FRAMES } from "./projects/_rnd/lobito-corridor/LobitoVersionA";
import { LobitoVersionB, LOBITO_B_FRAMES } from "./projects/_rnd/lobito-corridor/LobitoVersionB";
import { MotoVintageMap } from "./projects/_shared/templates/travel-map/MotoVintageMap";
import { SatelliteTravelMap } from "./projects/_shared/templates/travel-map/SatelliteTravelMap";
import { GoldRouteAtlas } from "./projects/_shared/templates/travel-map/GoldRouteAtlas";
import { GoldRouteAtlasZoom } from "./projects/_shared/templates/travel-map/GoldRouteAtlasZoom";
import { GoldRoute8Dir } from "./projects/_shared/templates/travel-map/GoldRoute8Dir";
import { PocImmobilierQC } from "./projects/_rnd/poc-immobilier-qc/PocImmobilierQC";
import { PocMaliVideoGame } from "./projects/_rnd/poc-mali-videogame/PocMaliVideoGame";
import { ProtoFlag_Sahel } from "./projects/warmap/_rnd/decode-castile/ProtoFlag_Sahel";
import { ProtoBattle_Sahel } from "./projects/warmap/_rnd/decode-castile/ProtoBattle_Sahel";
import { ProtoPieces_Sahel } from "./projects/warmap/_rnd/decode-castile/ProtoPieces_Sahel";
import { ProtoSealAnim_Sahel } from "./projects/warmap/_rnd/decode-castile/ProtoSealAnim_Sahel";
import { MarocPhosphateCarte, MAROC_PHOSPHATE_FRAMES } from "./projects/_rnd/cobaye-maroc-phosphate/MarocPhosphateCarte";
import { MarocPhosphateDataHero, MAROC_DATAHERO_FRAMES } from "./projects/_rnd/cobaye-maroc-phosphate/MarocPhosphateDataHero";

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
      
      
      
      
      
      <Folder name="warmap-decode-castile">
        <Composition
          id="ProtoFlag-Sahel"
          component={ProtoFlag_Sahel}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ProtoBattle-Sahel"
          component={ProtoBattle_Sahel}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ProtoPieces-Sahel"
          component={ProtoPieces_Sahel}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ProtoSealAnim-Sahel"
          component={ProtoSealAnim_Sahel}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Folder name="atlas-peste-1347">
        <Composition
          id="HeroDataShowcase"
          component={HeroDataShowcase}
          durationInFrames={HERO_DATA_SHOWCASE_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="A3Cailloux"
          component={A3Cailloux}
          durationInFrames={A3_CAILLOUX_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="A6Question"
          component={A6Question}
          durationInFrames={A6_QUESTION_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="PesteMapPreview"
          component={PesteMapPreview}
          durationInFrames={150}
          fps={30}
          width={720}
          height={1280}
        />
        <Composition
          id="MaxBellona-P1-OrthoLinks"
          component={P1_OrthoLinksDemo}
          durationInFrames={P1_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MaxBellona-P2-FactionBadge"
          component={P2_FactionBadgeDemo}
          durationInFrames={P2_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MaxBellona-P4-DashedFlow"
          component={P4_DashedFlowDemo}
          durationInFrames={P4_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MaxBellona-P3-MapTransform"
          component={P3_MapTransformDemo}
          durationInFrames={P3_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MaxBellona-P5-SplitScreen"
          component={P5_SplitScreenDemo}
          durationInFrames={P5_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MaxBellona-P6-SplitLiveMaps"
          component={P6_SplitLiveMapsDemo}
          durationInFrames={P6_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="AtlasAttackArrowDemo"
          component={AtlasAttackArrowDemo}
          durationInFrames={220}
          fps={30}
          width={720}
          height={1280}
        />
        <Composition
          id="AtlasEncirclementDemo"
          component={AtlasEncirclementDemo}
          durationInFrames={220}
          fps={30}
          width={720}
          height={1280}
        />
        <Composition
          id="AtlasCannesScene"
          component={AtlasCannesScene}
          durationInFrames={290}
          fps={30}
          width={720}
          height={1280}
        />
        <Composition
          id="AtlasCannesHannibal"
          component={AtlasCannesHannibal}
          durationInFrames={600}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="AtlasMansaMoussaV2"
          component={AtlasMansaMoussaV2Final}
          durationInFrames={MANSA_V2_FRAMES}
          fps={30}
          width={720}
          height={1280}
        />
        <Composition
          id="AtlasV2SaharanDrop"
          component={AtlasV2SaharanDropDemo}
          durationInFrames={SAHARAN_DROP_DEMO_FRAMES}
          fps={30}
          width={720}
          height={1280}
        />
        <Composition
          id="AtlasV2Confrontation"
          component={AtlasV2ConfrontationDemo}
          durationInFrames={CONFRONTATION_DEMO_FRAMES}
          fps={30}
          width={720}
          height={1280}
        />
        <Composition
          id="AtlasV2ArmyDeploy"
          component={AtlasV2ArmyDeployDemo}
          durationInFrames={ARMY_DEPLOY_DEMO_FRAMES}
          fps={30}
          width={720}
          height={1280}
        />
        <Composition
          id="AtlasV2ArmyDeploySeq"
          component={AtlasV2ArmyDeploySeqDemo}
          durationInFrames={ARMY_DEPLOY_DEMO_FRAMES}
          fps={30}
          width={720}
          height={1280}
        />
        <Composition
          id="AtlasV2Encerclement"
          component={AtlasV2EncerclementDemo}
          durationInFrames={ENCERCLEMENT_DEMO_FRAMES}
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
          durationInFrames={449}
          fps={30}
          width={720}
          height={1280}
        />
        <Composition
          id="PesteBeat3Densite"
          component={Beat3Densite}
          durationInFrames={509}
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
        <Composition
          id="PesteBeat6Conclusion"
          component={Beat6Conclusion}
          durationInFrames={210}
          fps={30}
          width={720}
          height={1280}
        />
        <Composition
          id="PesteSubtitles"
          component={PesteSubtitles}
          durationInFrames={3120}
          fps={30}
          width={720}
          height={1280}
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
        <Folder name="senegal-petrole-gaz">
          <Composition
            id="Senegal-Beat0-Accroche"
            component={SenegalBeat0}
            durationInFrames={979}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Senegal-Beat0-Accroche-V7"
            component={SenegalBeat0V7}
            durationInFrames={979}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Senegal-Beat0-PlaqueProto"
            component={SenegalBeat0Proto}
            durationInFrames={360}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Senegal-Beat1"
            component={SenegalBeat1}
            durationInFrames={554}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Senegal-Beat2"
            component={SenegalBeat2}
            durationInFrames={313}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Senegal-Beat3"
            component={SenegalBeat3}
            durationInFrames={139}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Senegal-Beat5"
            component={SenegalBeat5}
            durationInFrames={260}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Senegal-Beat6"
            component={SenegalBeat6}
            durationInFrames={512}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Senegal-Beat7"
            component={SenegalBeat7}
            durationInFrames={1071}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Senegal-Beat8"
            component={SenegalBeat8}
            durationInFrames={546}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Senegal-Beat9"
            component={SenegalBeat9}
            durationInFrames={516}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Senegal-Beat10"
            component={SenegalBeat10}
            durationInFrames={1836}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Senegal-Beat11"
            component={SenegalBeat11}
            durationInFrames={1473}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Senegal-Beat12-SvgDemo"
            component={Beat12SvgDemo}
            durationInFrames={BEAT12_SVG_DEMO_FRAMES}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Senegal-Beat12"
            component={SenegalBeat12}
            durationInFrames={1618}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Senegal-Beat13"
            component={SenegalBeat13}
            durationInFrames={1540}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Senegal-Beat14-PhaseC-Test"
            component={Beat14PhaseC}
            durationInFrames={461}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Senegal-Beat14"
            component={SenegalBeat14}
            durationInFrames={2307}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Senegal-Acte2"
            component={SenegalActe2}
            durationInFrames={SENEGAL_ACTE2_FRAMES}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Senegal-Preview-Actes12"
            component={SenegalPreviewActes12}
            durationInFrames={SENEGAL_PREVIEW_ACTES12_FRAMES}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Senegal-Acte2-Continu"
            component={SenegalActe2Continu}
            durationInFrames={1760}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Senegal-Acte2-Full"
            component={SenegalActe2Full}
            durationInFrames={SENEGAL_ACTE2_FULL_FRAMES}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Senegal-Proto-D3-StackedBars"
            component={PrototypeD3StackedBars}
            durationInFrames={450}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Mapbox-Camera-Lab"
            component={MapboxCameraLab}
            durationInFrames={MAPBOX_CAMERA_LAB_FRAMES}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="CartoSouverainV5-CIBLE"
            component={CartoSouverainV5Demo}
            durationInFrames={150}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="CartoSouverainV5-REGIONAL"
            component={CartoSouverainV5RegionalDemo}
            durationInFrames={150}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="SceneGisementsV5"
            component={SceneGisementsV5}
            durationInFrames={1560}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="SceneGisementsV5Effets"
            component={SceneGisementsV5Effets}
            durationInFrames={1560}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="SceneGisementsV3"
            component={SceneGisementsV3}
            durationInFrames={2120}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="TokenShowcaseV5"
            component={TokenShowcaseV5}
            durationInFrames={600}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="SvgTokenCompare"
            component={SvgTokenCompare}
            durationInFrames={240}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="CartoGeoStickTest"
            component={CartoGeoStickTest}
            durationInFrames={30}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Mapbox-Overlay-Lab"
            component={MapboxOverlayLab}
            durationInFrames={MAPBOX_OVERLAY_LAB_FRAMES}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Mapbox-Overlay-Lab-V2"
            component={MapboxOverlayLabV2}
            durationInFrames={MAPBOX_OVERLAY_LAB_V2_FRAMES}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Mapbox-Lottie-Showcase"
            component={MapboxLottieShowcase}
            durationInFrames={MAPBOX_LOTTIE_SHOWCASE_FRAMES}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Petrole-Patience"
            component={PetrolePatience}
            durationInFrames={PETROLE_PATIENCE_FRAMES}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="Petrole-Patience-Short"
            component={PetrolePatienceShort}
            durationInFrames={PETROLE_PATIENCE_SHORT_FRAMES}
            fps={30}
            width={1080}
            height={1920}
          />
          <Composition
            id="Petrole-Patience-Short-V2"
            component={PetrolePatienceShortV2}
            durationInFrames={PETROLE_PATIENCE_SHORT_V2_FRAMES}
            fps={30}
            width={1080}
            height={1920}
          />
          <Composition
            id="Afrique-Numerique-Short"
            component={AfriqueNumeriqueShort}
            durationInFrames={AFRIQUE_NUMERIQUE_SHORT_FRAMES}
            fps={30}
            width={1080}
            height={1920}
          />
          <Composition
            id="Cobalt-RDC-Short"
            component={CobaltRDCShort}
            durationInFrames={COBALT_RDC_SHORT_FRAMES}
            fps={30}
            width={1080}
            height={1920}
          />
          <Composition
            id="L-Anomalie-Montreal"
            component={LAnomalieMontreal}
            durationInFrames={ANOMALIE_MONTREAL_FRAMES}
            fps={30}
            width={1920}
            height={1080}
          />
          {/* Thumbnails Sénégal Pétrole — variantes A/B/C */}
          <Composition
            id="Thumb-Senegal-A"
            component={ThumbnailBaril}
            durationInFrames={1}
            fps={30}
            width={1280}
            height={720}
            defaultProps={{ ratio: 18, variant: "A" as const }}
          />
          <Composition
            id="Thumb-Senegal-B"
            component={ThumbnailBaril}
            durationInFrames={1}
            fps={30}
            width={1280}
            height={720}
            defaultProps={{ ratio: 18, variant: "B" as const }}
          />
          <Composition
            id="Thumb-Senegal-C"
            component={ThumbnailBaril}
            durationInFrames={1}
            fps={30}
            width={1280}
            height={720}
            defaultProps={{ ratio: 18, variant: "C" as const }}
          />

          {/* Thumbnails Niger Uranium — test système réutilisable */}
          <Composition
            id="Thumb-Niger-A"
            component={ThumbnailNiger}
            durationInFrames={1}
            fps={30}
            width={1280}
            height={720}
            defaultProps={{ ratio: 12, variant: "A" as const }}
          />
          <Composition
            id="Thumb-Niger-B"
            component={ThumbnailNiger}
            durationInFrames={1}
            fps={30}
            width={1280}
            height={720}
            defaultProps={{ ratio: 12, variant: "B" as const }}
          />
          <Composition
            id="Thumb-Niger-C"
            component={ThumbnailNiger}
            durationInFrames={1}
            fps={30}
            width={1280}
            height={720}
            defaultProps={{ ratio: 12, variant: "C" as const }}
          />

          {/* Thumbnail Atlas — Mansa Moussa */}
          <Composition
            id="Thumb-Mansa-A"
            component={ThumbnailMansa}
            durationInFrames={1}
            fps={30}
            width={1280}
            height={720}
            defaultProps={{ variant: "A" as const }}
          />

          {/* Thumbnail Sonjata — Empire Mandé 1235 */}
          <Composition
            id="Thumb-Sonjata-A"
            component={ThumbnailSonjataDemo}
            durationInFrames={1}
            fps={30}
            width={1280}
            height={720}
            defaultProps={{ variant: "A" as const }}
          />

          {/* Thumbnail AES — "Ils ont chassé la France, l'ONU et la CEDEAO. Et après ?" */}
          <Composition
            id="Thumb-AES"
            component={ThumbnailAES}
            durationInFrames={1}
            fps={30}
            width={1280}
            height={720}
          />
        </Folder>






        
        
        
        
        
        
        
        <Composition id="Layout-SpeechBubble" component={SpeechBubbleDemo} durationInFrames={90} fps={30} width={1080} height={1920} />
        <Composition id="Layout-PortraitGeometry" component={PortraitGeometryDemo} durationInFrames={90} fps={30} width={1080} height={1920} />
        <Composition id="Layout-ArchiveFade" component={ArchiveFadeDemo} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="Layout-CountdownReveal" component={CountdownRevealDemo} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="Layout-MilitaryMarchLine" component={MilitaryMarchLineDemo} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Layout-FillScreen" component={FillScreenDemo} durationInFrames={90} fps={30} width={1080} height={1920} />
        <Composition id="Layout-OdometerFlip" component={OdometerFlipDemo} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Template-OdometerFlip" component={OdometerFlipDemo} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="Layout-RadarPing" component={RadarPingDemo} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Template-RadarPing" component={RadarPingDemo} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="Layout-BarRace" component={BarRaceDemo} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="Template-BarRace" component={BarRaceDemo} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="Layout-PulseNumber" component={PulseNumberDemo} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Template-PulseNumber" component={PulseNumberDemo} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="Layout-TypeReveal" component={() => <TypeReveal />} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Layout-StackedBars" component={StackedBarsDemo} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Template-StackedBars" component={StackedBarsDemo} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="Layout-ScaleShock" component={ScaleShockDemo} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Template-ScaleShock" component={ScaleShockDemo} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="Layout-Timeline" component={TimelineDemo} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="Template-Timeline" component={TimelineDemo} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="Layout-NetworkGraph" component={NetworkGraphDemo} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Template-NetworkGraph" component={NetworkGraphDemo} durationInFrames={210} fps={30} width={1920} height={1080} />
        <Composition id="Layout-IconGrid" component={IconGridDemo} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Template-IconGrid" component={IconGridDemo} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="Layout-IconStat" component={IconStatDemo} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Template-IconStat" component={IconStatDemo} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="Layout-ProcessFlow" component={ProcessFlowDemo} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Template-ProcessFlow" component={ProcessFlowDemo} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="Layout-CoinFlip" component={CoinFlipDemo} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Template-CoinFlip" component={CoinFlipDemo} durationInFrames={210} fps={30} width={1920} height={1080} />
        <Composition id="Layout-GlitchReveal" component={GlitchRevealDemo} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Template-GlitchReveal" component={GlitchRevealDemo} durationInFrames={210} fps={30} width={1920} height={1080} />
        <Composition id="Layout-SplitFlap" component={SplitFlapDemo} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Template-SplitFlap" component={SplitFlapDemo} durationInFrames={210} fps={30} width={1920} height={1080} />
        <Composition id="Layout-TimelineFracture" component={TimelineFractureDemo} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Template-TimelineFracture" component={TimelineFractureDemo} durationInFrames={210} fps={30} width={1920} height={1080} />
        <Composition id="Layout-ScaleTilt" component={ScaleTiltDemo} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Layout-RadarScan" component={RadarScanDemo} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Template-RadarScan" component={RadarScanDemo} durationInFrames={210} fps={30} width={1920} height={1080} />
        <Composition id="Layout-BurnReveal" component={BurnRevealDemo} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Template-BurnReveal" component={BurnRevealDemo} durationInFrames={210} fps={30} width={1920} height={1080} />
        <Composition id="Layout-ShatterReform" component={ShatterReformDemo} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Template-ShatterReform" component={ShatterReformDemo} durationInFrames={210} fps={30} width={1920} height={1080} />
        <Composition id="Layout-TypeWriter" component={TypeWriterDemo} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Layout-WordExplode" component={WordExplodeDemo} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Layout16-LineChartDrawOn" component={() => <LineChartDrawOn />} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="Layout16-HighlightedQuote" component={() => <HighlightedQuote />} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="Layout16-StatComparisonGrid" component={() => <StatComparisonGrid />} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="Layout16-FlowArrowsMap" component={() => <FlowArrowsMap />} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="Layout16-ParadigmShiftTimeline" component={() => <ParadigmShiftTimeline />} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="Layout16-CountryIsolateWithHatch" component={() => <CountryIsolateWithHatch />} durationInFrames={150} fps={30} width={1920} height={1080} />
        {/* ── CHANTIER C — Templates Mapbox hybrides V+H (Playbook P2/P2bis/P3/P4/P5) ── */}
        <Composition id="MapboxFlagFill-Maroc-V" component={() => <MapboxFlagFill countryIso="MAR" boundaryIsos={["ESH"]} geoName={["Morocco", "W. Sahara"]} center={[-9.5, 28.5]} baseZoom={4.7} flagCode="ma" label="MAROC" />} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="MapboxFlagFill-Maroc-H" component={() => <MapboxFlagFill countryIso="MAR" boundaryIsos={["ESH"]} geoName={["Morocco", "W. Sahara"]} center={[-9.5, 28.5]} baseZoom={4.7} flagCode="ma" label="MAROC" />} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="MapboxIsolateZone-Senegal-V" component={() => <MapboxIsolateZone countryIso="SEN" center={[-15.5, 14.2]} baseZoom={5.6} badge="SANGOMAR" badgeCoord={[-17.15, 13.45]} statValue="2,4 MDS $" statLabel="PRODUCTION ANNUELLE" countryName="SENEGAL" />} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="MapboxIsolateZone-Senegal-H" component={() => <MapboxIsolateZone countryIso="SEN" center={[-15.5, 14.2]} baseZoom={5.6} badge="SANGOMAR" badgeCoord={[-17.15, 13.45]} statValue="2,4 MDS $" statLabel="PRODUCTION ANNUELLE" countryName="SENEGAL" />} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="SequentialBorderPulse-Maghreb-V" component={() => <SequentialBorderPulse center={[-3, 29]} baseZoom={4.2} sequence={[{ iso: "MAR", at: 12, label: "MAROC" }, { iso: "DZA", at: 50, label: "ALGERIE" }, { iso: "MRT", at: 90, label: "MAURITANIE" }]} />} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="SequentialBorderPulse-Maghreb-H" component={() => <SequentialBorderPulse center={[-3, 29]} baseZoom={4.2} sequence={[{ iso: "MAR", at: 12, label: "MAROC" }, { iso: "DZA", at: 50, label: "ALGERIE" }, { iso: "MRT", at: 90, label: "MAURITANIE" }]} />} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="GlassmorphismGeoPopup-Senegal-V" component={() => <GlassmorphismGeoPopup center={[-15.2, 14.8]} baseZoom={5.4} highlightIso="SEN" points={[{ coord: [-17.15, 13.45], at: 14, title: "SANGOMAR", value: "100 000 b/j" }, { coord: [-16.9, 16.5], at: 56, title: "GTA", value: "2,5 Tcf gaz" }]} />} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="GlassmorphismGeoPopup-Senegal-H" component={() => <GlassmorphismGeoPopup center={[-15.2, 14.8]} baseZoom={5.4} highlightIso="SEN" points={[{ coord: [-17.15, 13.45], at: 14, title: "SANGOMAR", value: "100 000 b/j" }, { coord: [-16.9, 16.5], at: 56, title: "GTA", value: "2,5 Tcf gaz" }]} />} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="SequentialFlagReveal-Maghreb-V" component={() => <SequentialFlagReveal center={[-5, 27]} baseZoom={3.9} countries={[{ iso: "MAR", geoName: ["Morocco", "W. Sahara"], boundaryIsos: ["ESH"], flagCode: "ma", at: 12, label: "MAROC" }, { iso: "DZA", geoName: "Algeria", flagCode: "dz", at: 60, label: "ALGERIE" }, { iso: "MRT", geoName: "Mauritania", flagCode: "mr", at: 108, label: "MAURITANIE" }]} />} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="SequentialFlagReveal-Maghreb-H" component={() => <SequentialFlagReveal center={[-5, 27]} baseZoom={3.9} countries={[{ iso: "MAR", geoName: ["Morocco", "W. Sahara"], boundaryIsos: ["ESH"], flagCode: "ma", at: 12, label: "MAROC" }, { iso: "DZA", geoName: "Algeria", flagCode: "dz", at: 60, label: "ALGERIE" }, { iso: "MRT", geoName: "Mauritania", flagCode: "mr", at: 108, label: "MAURITANIE" }]} />} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="LottieGeoAura-Showcase-V" component={() => <LottieGeoAura center={[-14.5, 15.0]} baseZoom={5.6} highlightIso="SEN" auras={[{ coord: [-17.0, 14.7], asset: "shockwaveDiscovery", at: 8, sizeVmin: 42, label: "DECOUVERTE" }, { coord: [-13.5, 15.6], asset: "orbitalDataCrown", at: 36, sizeVmin: 38, label: "RESERVES" }, { coord: [-15.2, 13.4], asset: "networkFlow", at: 64, sizeVmin: 44, label: "EXPORT" }]} />} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="LottieGeoAura-Showcase-H" component={() => <LottieGeoAura center={[-14.5, 15.0]} baseZoom={5.6} highlightIso="SEN" auras={[{ coord: [-17.0, 14.7], asset: "shockwaveDiscovery", at: 8, sizeVmin: 42, label: "DECOUVERTE" }, { coord: [-13.5, 15.6], asset: "orbitalDataCrown", at: 36, sizeVmin: 38, label: "RESERVES" }, { coord: [-15.2, 13.4], asset: "networkFlow", at: 64, sizeVmin: 44, label: "EXPORT" }]} />} durationInFrames={150} fps={30} width={1920} height={1080} />
        {/* ── CHANTIER C v2 — idees Gemini (dynamisme + couleur) ── */}
        <Composition id="SweepRevealTerritory-Maroc-V" component={() => <SweepRevealTerritory countryIso="MAR" geoName={["Morocco", "W. Sahara"]} boundaryIsos={["ESH"]} center={[-9, 28.5]} baseZoom={4.6} label="MAROC" sweepAt={10} sweepDur={50} />} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="SweepRevealTerritory-Maroc-H" component={() => <SweepRevealTerritory countryIso="MAR" geoName={["Morocco", "W. Sahara"]} boundaryIsos={["ESH"]} center={[-9, 28.5]} baseZoom={4.6} label="MAROC" sweepAt={10} sweepDur={50} />} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="DominoContagionFill-Sahel-V" component={() => <DominoContagionFill center={[3, 16]} baseZoom={3.0} epicenterIso="MLI" epicenterLabel="MALI" waves={[["MLI"], ["BFA", "NER", "MRT", "DZA"], ["TCD", "NGA", "SEN", "GIN", "CIV"]]} waveAt={12} waveGap={26} />} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="DominoContagionFill-Sahel-H" component={() => <DominoContagionFill center={[3, 16]} baseZoom={3.0} epicenterIso="MLI" epicenterLabel="MALI" waves={[["MLI"], ["BFA", "NER", "MRT", "DZA"], ["TCD", "NGA", "SEN", "GIN", "CIV"]]} waveAt={12} waveGap={26} />} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="FiberOpticBorderDraw-Senegal-V" component={() => <FiberOpticBorderDraw countryIso="SEN" geoName="Senegal" center={[-14.5, 14.4]} baseZoom={5.8} label="SENEGAL" drawAt={8} drawDur={50} />} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="FiberOpticBorderDraw-Senegal-H" component={() => <FiberOpticBorderDraw countryIso="SEN" geoName="Senegal" center={[-14.5, 14.4]} baseZoom={5.8} label="SENEGAL" drawAt={8} drawDur={50} />} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="GeoFlowConnection-SilkRoad-H" component={() => <GeoFlowConnection title="THE SILK ROAD" accentColor="#e8c34a" sprite="plane" drawStartFrame={20} drawPerSegment={48} durationFrames={450} waypoints={[{ name: "Milan", coord: [9.19, 45.46], labelDy: 18 }, { name: "Venice", coord: [12.33, 45.44], labelDy: 28 }, { name: "Istanbul", coord: [28.98, 41.01], labelDy: 22 }, { name: "Tehran", coord: [51.39, 35.69], labelDy: 22 }, { name: "Mashhad", coord: [59.61, 36.3] }, { name: "Samarkand", coord: [66.97, 39.65], labelDy: -16 }, { name: "Kashgar", coord: [75.99, 39.47], labelDy: -16 }, { name: "Amritsar", coord: [74.87, 31.63], labelDx: 12 }]} />} durationInFrames={450} fps={30} width={1920} height={1080} />
        <Composition id="GeoFlowConnection-SilkRoad-V" component={() => <GeoFlowConnection title="THE SILK ROAD" accentColor="#e8c34a" sprite="plane" drawStartFrame={20} drawPerSegment={48} durationFrames={450} waypoints={[{ name: "Milan", coord: [9.19, 45.46], labelDy: 18 }, { name: "Venice", coord: [12.33, 45.44], labelDy: 28 }, { name: "Istanbul", coord: [28.98, 41.01], labelDy: 22 }, { name: "Tehran", coord: [51.39, 35.69], labelDy: 22 }, { name: "Mashhad", coord: [59.61, 36.3] }, { name: "Samarkand", coord: [66.97, 39.65], labelDy: -16 }, { name: "Kashgar", coord: [75.99, 39.47], labelDy: -16 }, { name: "Amritsar", coord: [74.87, 31.63], labelDx: 12 }]} />} durationInFrames={450} fps={30} width={1080} height={1920} />
        <Composition id="FiberOpticFlagInvade-Maghreb-V" component={() => <FiberOpticFlagInvade center={[-5, 27]} baseZoom={3.9} drawDur={22} invadeDur={20} countries={[{ iso: "MAR", geoName: ["Morocco", "W. Sahara"], boundaryIsos: ["ESH"], flagCode: "ma", at: 6, label: "MAROC" }, { iso: "DZA", geoName: "Algeria", flagCode: "dz", at: 56, label: "ALGERIE" }, { iso: "MRT", geoName: "Mauritania", flagCode: "mr", at: 106, label: "MAURITANIE" }]} />} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="FiberOpticFlagInvade-Maghreb-H" component={() => <FiberOpticFlagInvade center={[-5, 27]} baseZoom={3.9} drawDur={22} invadeDur={20} countries={[{ iso: "MAR", geoName: ["Morocco", "W. Sahara"], boundaryIsos: ["ESH"], flagCode: "ma", at: 6, label: "MAROC" }, { iso: "DZA", geoName: "Algeria", flagCode: "dz", at: 56, label: "ALGERIE" }, { iso: "MRT", geoName: "Mauritania", flagCode: "mr", at: 106, label: "MAURITANIE" }]} />} durationInFrames={180} fps={30} width={1920} height={1080} />
        {/* ── CHANTIER HOOK — templates d'ouverture (punch frame 0) ── */}
        <Composition id="KineticMaskSlam-Maroc-V" component={() => <KineticMaskSlam center={[-7, 31]} baseZoom={4.6} bigText="70%" subText="DU PHOSPHATE MONDIAL" focusIso="MAR" />} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="KineticMaskSlam-Maroc-H" component={() => <KineticMaskSlam center={[-7, 31]} baseZoom={4.6} bigText="70%" subText="DU PHOSPHATE MONDIAL" focusIso="MAR" />} durationInFrames={120} fps={30} width={1920} height={1080} />
        {/* ── DEMO 2026-06-17 : rack d'effets natifs Remotion (cartographier le plafond AE) ── */}
        <Composition id="KineticMaskSlamFX-Maroc-V" component={() => <KineticMaskSlamFX center={[-7, 31]} baseZoom={4.6} bigText="70%" subText="DU PHOSPHATE MONDIAL" focusIso="MAR" />} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="KineticSlam3D-Maroc-V" component={() => <KineticSlam3D bigText="70%" subText="DU PHOSPHATE MONDIAL" />} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="Country3DRise-Maroc-V" component={() => <Country3DRise geoName="Morocco" bigText="70%" subText="DU PHOSPHATE MONDIAL" />} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="Asset3DShowcase" component={Asset3DShowcase} durationInFrames={120} fps={30} width={1080} height={1080} />
        <Composition id="JetonWarMap3DCompare" component={JetonWarMap3DCompare} durationInFrames={120} fps={30} width={1920} height={1080} />
        {/* ── hooks-lib — bibliotheque de hooks agnostiques au fond (2026-06-15) ── */}
        <Composition id="ArteryDrain-Niger-V" component={() => <ArteryDrain center={[8.08, 17.6]} baseZoom={4.8} focusIso="NER" bigText="68t" subText="D'URANIUM PAR AN" rays={8} />} durationInFrames={110} fps={30} width={1080} height={1920} />
        <Composition id="ArteryDrain-Niger-H" component={() => <ArteryDrain center={[8.08, 17.6]} baseZoom={4.8} focusIso="NER" bigText="68t" subText="D'URANIUM PAR AN" rays={8} />} durationInFrames={110} fps={30} width={1920} height={1080} />
        {/* PROTOTYPE hook ouverture Acte 1 AES (CrosshairLock + audio V5, cale sur les 3 verbes) */}
        <Composition id="HookAES-Acte1-Proto" component={HookAESActe1Proto} durationInFrames={600} fps={30} width={1920} height={1080} />
        {/* MINI-RENDER VALIDATION — Soudan Acte 1 ouverture (carte + jeton Hemeti + forces RSF + contour, audio fact-check) */}
        <Composition id="SoudanActe1Ouverture" component={SoudanActe1Ouverture} durationInFrames={SOUDAN_A1_DURATION} fps={SOUDAN_A1_FPS} width={1920} height={1080} />
        {/* CrosshairLock — VRAI hook (tension viseur->lock). theme parchment=War-Map / dark=Souverain */}
        <Composition id="CrosshairLock-Mali-Parchment-V" component={() => <CrosshairLock center={[-2, 17]} baseZoom={4.6} theme="parchment" focusIso="MLI" label="MALI" subLabel="LE COEUR DU SAHEL" />} durationInFrames={110} fps={30} width={1080} height={1920} />
        <Composition id="CrosshairLock-Senegal-Dark-V" component={() => <CrosshairLock center={[-14.5, 14.5]} baseZoom={5.2} theme="dark" focusIso="SEN" label="SENEGAL" subLabel="CE QU'ON VOUS CACHE" />} durationInFrames={110} fps={30} width={1080} height={1920} />
        {/* AES horizontal 16:9 sur le vrai cadrage War-Map Sahel (3 pays) */}
        <Composition id="CrosshairLock-AES-Parchment-H" component={() => <CrosshairLock center={[-0.5, 14.8]} baseZoom={3.4} theme="parchment" focusIso={["MLI", "BFA", "NER"]} countriesGeoJson="_shared/geo-data/sahel/sahel-countries.geojson" label="LE SAHEL" subLabel="TROIS PAYS, UNE RUPTURE" question="COMMENT TROIS PAYS PAUVRES ONT DEFIE LA FRANCE ?" zoomPunch={1.7} durationFrames={300} />} durationInFrames={300} fps={30} width={1920} height={1080} />
        {/* CrosshairLock CAMERA SERREE + PAN (grammaire Acte 1 AES) */}
        <Composition id="CrosshairLock-AES-CamSerree-H" component={() => <CrosshairLock center={[-1.5, 15.2]} theme="parchment" focusIso={["MLI", "BFA", "NER"]} countriesGeoJson="_shared/geo-data/sahel/sahel-countries.geojson" camKeys={[{ f: 0, lon: -3.0, lat: 16.5, zoom: 4.7 }, { f: 90, lon: -1.5, lat: 15.0, zoom: 4.74 }, { f: 150, lon: -0.3, lat: 15.2, zoom: 4.5 }, { f: 230, lon: 1.0, lat: 15.6, zoom: 4.62 }, { f: 300, lon: 0.2, lat: 15.3, zoom: 4.6 }]} label="LE SAHEL" subLabel="TROIS PAYS, UNE RUPTURE" question="COMMENT TROIS PAYS PAUVRES ONT DEFIE LA FRANCE ?" durationFrames={300} />} durationInFrames={300} fps={30} width={1920} height={1080} />
        {/* RedlineContagion — hook conflit : contagion de la menace Mali->Burkina->Niger */}
        <Composition id="RedlineContagion-Sahel-H" component={() => <RedlineContagion center={[-0.5, 15.5]} baseZoom={4.0} theme="parchment" focusIso={["MLI", "BFA", "NER"]} epicenter={[-3.5, 18]} contagionAt={18} contagionGap={30} countriesGeoJson="_shared/geo-data/sahel/sahel-countries.geojson" threats={[[-1.5, 15.0], [0.2, 13.5], [2.0, 14.0]]} label="LE SAHEL" subLabel="LA MENACE S'ETEND" question="QUI ARME LES GROUPES QUI DEFERLENT ?" durationFrames={300} />} durationInFrames={300} fps={30} width={1920} height={1080} />
        {/* RedlineContagion CAMERA SERREE : la cam suit la contagion ouest->est */}
        <Composition id="RedlineContagion-CamSerree-H" component={() => <RedlineContagion center={[-1.0, 16.0]} theme="parchment" focusIso={["MLI", "BFA", "NER"]} epicenter={[-3.5, 18]} contagionAt={18} contagionGap={30} countriesGeoJson="_shared/geo-data/sahel/sahel-countries.geojson" camKeys={[{ f: 0, lon: -3.0, lat: 17.0, zoom: 4.7 }, { f: 80, lon: -1.5, lat: 15.6, zoom: 4.66 }, { f: 160, lon: 0.5, lat: 15.4, zoom: 4.6 }, { f: 300, lon: 0.0, lat: 15.5, zoom: 4.58 }]} threats={[[-1.5, 15.0], [0.2, 13.5], [2.0, 14.0]]} label="LE SAHEL" subLabel="LA MENACE S'ETEND" question="QUI ARME LES GROUPES QUI DEFERLENT ?" durationFrames={300} />} durationInFrames={300} fps={30} width={1920} height={1080} />
        {/* MaskReveal — hook chiffre/mot-masque (fusion Kinetic/Echo/Chromatic). prop effect. */}
        <Composition id="MaskReveal-AES-Echo-H" component={() => <MaskReveal center={[-0.5, 15.5]} baseZoom={3.4} theme="parchment" focusIso={["MLI", "BFA", "NER"]} countriesGeoJson="_shared/geo-data/sahel/sahel-countries.geojson" bigText="72" subText="MILLIONS D'HABITANTS" question="UN MARCHE DE 72 MILLIONS, SANS LA FRANCE ?" effect="echo" revealZoom={1.1} durationFrames={300} />} durationInFrames={300} fps={30} width={1920} height={1080} />
        <Composition id="MaskReveal-AES-Chromatic-H" component={() => <MaskReveal center={[-0.5, 15.5]} baseZoom={3.4} theme="parchment" focusIso={["MLI", "BFA", "NER"]} countriesGeoJson="_shared/geo-data/sahel/sahel-countries.geojson" bigText="AES" subText="ALLIANCE DES ETATS DU SAHEL" question="ET SI L'AVENIR DE L'AFRIQUE SE JOUAIT ICI ?" effect="chromatic" revealZoom={1.1} durationFrames={300} />} durationInFrames={300} fps={30} width={1920} height={1080} />
        {/* MaskReveal CAMERA SERREE : carte serree dans les lettres, pan apres reveal */}
        <Composition id="MaskReveal-CamSerree-H" component={() => <MaskReveal center={[-0.5, 15.5]} theme="parchment" focusIso={["MLI", "BFA", "NER"]} countriesGeoJson="_shared/geo-data/sahel/sahel-countries.geojson" camKeys={[{ f: 0, lon: -1.5, lat: 15.4, zoom: 4.7 }, { f: 96, lon: -0.8, lat: 15.4, zoom: 4.68 }, { f: 180, lon: 0.6, lat: 15.5, zoom: 4.6 }, { f: 300, lon: 0.0, lat: 15.4, zoom: 4.58 }]} bigText="AES" subText="ALLIANCE DES ETATS DU SAHEL" question="ET SI L'AVENIR DE L'AFRIQUE SE JOUAIT ICI ?" effect="echo" durationFrames={300} />} durationInFrames={300} fps={30} width={1920} height={1080} />
        <Composition id="RapidFireCountries-Afrique-V" component={() => <RapidFireCountries center={[0, 12]} baseZoom={3.0} cutFrames={5} flash={[{ code: "ng", name: "NIGERIA" }, { code: "gh", name: "GHANA" }, { code: "ci", name: "COTE D'IVOIRE" }, { code: "ml", name: "MALI" }, { code: "dz", name: "ALGERIE" }, { code: "ke", name: "KENYA" }]} focus={{ iso: "SEN", code: "sn", name: "SENEGAL" }} />} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="RapidFireCountries-Afrique-H" component={() => <RapidFireCountries center={[0, 12]} baseZoom={3.0} cutFrames={5} flash={[{ code: "ng", name: "NIGERIA" }, { code: "gh", name: "GHANA" }, { code: "ci", name: "COTE D'IVOIRE" }, { code: "ml", name: "MALI" }, { code: "dz", name: "ALGERIE" }, { code: "ke", name: "KENYA" }]} focus={{ iso: "SEN", code: "sn", name: "SENEGAL" }} />} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="ClassifiedRedactReveal-Senegal-V" component={() => <ClassifiedRedactReveal center={[-14.5, 14.5]} baseZoom={5.4} focusIso="SEN" stampText="CLASSIFIED" teaseText="CE QU'ON VOUS CACHE" />} durationInFrames={130} fps={30} width={1080} height={1920} />
        <Composition id="ClassifiedRedactReveal-Senegal-H" component={() => <ClassifiedRedactReveal center={[-14.5, 14.5]} baseZoom={5.4} focusIso="SEN" stampText="CLASSIFIED" teaseText="CE QU'ON VOUS CACHE" />} durationInFrames={130} fps={30} width={1920} height={1080} />
        {/* ── MapCutaway — insert reutilisable 4 modes (carte -> overlay -> retour) ── */}
        <Composition id="MapCutaway-Stat-V" component={() => <MapCutaway center={[-14.5, 14.5]} baseZoom={5.4} focusIso="SEN" mode="stat" bigText="2,4 MDS $" subText="PRODUCTION ANNUELLE" inAt={18} outAt={70} />} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="MapCutaway-Image-V" component={() => <MapCutaway center={[-2, 17]} baseZoom={4.6} focusIso="MLI" mode="image" image="_shared/flags-portraits/countries/mali-portrait.png" bigText="LE MALI" subText="COEUR DU SAHEL" inAt={18} outAt={70} />} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="MapCutaway-Flag-V" component={() => <MapCutaway center={[-1, 8]} baseZoom={5.0} focusIso="GHA" mode="flag" flagCode="gh" bigText="GHANA" inAt={18} outAt={70} />} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="MapCutaway-Reveal-V" component={() => <MapCutaway center={[-14.5, 14.5]} baseZoom={5.4} focusIso="SEN" mode="reveal" bigText="UN CONTRAT A 50 ANS" subText="SIGNE EN SECRET" inAt={18} outAt={70} />} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="MapCutaway-Stat-H" component={() => <MapCutaway center={[-14.5, 14.5]} baseZoom={5.4} focusIso="SEN" mode="stat" bigText="2,4 MDS $" subText="PRODUCTION ANNUELLE" inAt={18} outAt={70} />} durationInFrames={120} fps={30} width={1920} height={1080} />
        {/* ── COMBOS — hooks par assemblage de primitives ── */}
        <Composition id="ComboMaskSweep-Maroc-V" component={() => <ComboMaskSweep center={[-9, 28.5]} baseZoom={4.4} bigText="70%" subText="DU PHOSPHATE MONDIAL" geoName={["Morocco", "W. Sahara"]} boundaryIsos={["MAR", "ESH"]} label="MAROC" />} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="ComboMaskSweep-Maroc-H" component={() => <ComboMaskSweep center={[-9, 28.5]} baseZoom={4.4} bigText="70%" subText="DU PHOSPHATE MONDIAL" geoName={["Morocco", "W. Sahara"]} boundaryIsos={["MAR", "ESH"]} label="MAROC" />} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="ComboSweepDominoFlag-Sahel-V" component={() => <ComboSweepDominoFlag center={[3, 16]} baseZoom={2.9} waves={[["MLI"], ["BFA", "NER"], ["DZA", "MRT"]]} flags={{ MLI: { geoName: "Mali", code: "ml" }, BFA: { geoName: "Burkina Faso", code: "bf" }, NER: { geoName: "Niger", code: "ne" }, DZA: { geoName: "Algeria", code: "dz" }, MRT: { geoName: "Mauritania", code: "mr" } }} />} durationInFrames={200} fps={30} width={1080} height={1920} />
        <Composition id="ComboSweepDominoFlag-Sahel-H" component={() => <ComboSweepDominoFlag center={[3, 16]} baseZoom={2.9} waves={[["MLI"], ["BFA", "NER"], ["DZA", "MRT"]]} flags={{ MLI: { geoName: "Mali", code: "ml" }, BFA: { geoName: "Burkina Faso", code: "bf" }, NER: { geoName: "Niger", code: "ne" }, DZA: { geoName: "Algeria", code: "dz" }, MRT: { geoName: "Mauritania", code: "mr" } }} />} durationInFrames={200} fps={30} width={1920} height={1080} />
        <Composition id="ComboFiberAuraPopup-Senegal-V" component={() => <ComboFiberAuraPopup countryIso="SEN" geoName="Senegal" center={[-14.5, 14.4]} baseZoom={5.8} label="SENEGAL" point={[-17.15, 13.45]} popupTitle="SANGOMAR" popupValue="100 000 b/j" />} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="ComboFiberAuraPopup-Senegal-H" component={() => <ComboFiberAuraPopup countryIso="SEN" geoName="Senegal" center={[-14.5, 14.4]} baseZoom={5.8} label="SENEGAL" point={[-17.15, 13.45]} popupTitle="SANGOMAR" popupValue="100 000 b/j" />} durationInFrames={150} fps={30} width={1920} height={1080} />

        {/* ── N1 FONDATIONS ── */}
        <Composition id="FlagFillStatic-Maroc-V" component={() => <FlagFillStatic mainIso="MAR" mainBoundaryIsos={["ESH"]} center={[-5.5,32.0]} baseZoom={4.8} secondaryCountries={[{iso:"ESP",color:"#c60b1e"},{iso:"FRA",color:"#002395"},{iso:"DEU",color:"#dd0000"},{iso:"PRT",color:"#006600"}]} />} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="FlagFillStatic-Maroc-H" component={() => <FlagFillStatic mainIso="MAR" mainBoundaryIsos={["ESH"]} center={[-5.5,32.0]} baseZoom={4.8} secondaryCountries={[{iso:"ESP",color:"#c60b1e"},{iso:"FRA",color:"#002395"},{iso:"DEU",color:"#dd0000"},{iso:"PRT",color:"#006600"}]} />} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="FlagFillSequence-CEDEAO-V" component={() => <FlagFillSequence center={[-5,10]} baseZoom={4.2} countries={[{iso:"SEN",at:0},{iso:"MLI",at:30},{iso:"BFA",at:60},{iso:"NGA",at:90},{iso:"GHA",at:120},{iso:"CIV",at:150}]} />} durationInFrames={240} fps={30} width={1080} height={1920} />
        <Composition id="FlagFillSequence-CEDEAO-H" component={() => <FlagFillSequence center={[-5,10]} baseZoom={4.2} countries={[{iso:"SEN",at:0},{iso:"MLI",at:30},{iso:"BFA",at:60},{iso:"NGA",at:90},{iso:"GHA",at:120},{iso:"CIV",at:150}]} />} durationInFrames={240} fps={30} width={1920} height={1080} />

        {/* ── N2 TEXTURES ── */}
        <Composition id="ResourceTextureFill-Maroc-Phosphate-V" component={() => <ResourceTextureFill center={[-5,31]} baseZoom={5.5} countries={[{iso:"MAR",boundaryIsos:["ESH"],resource:"phosphate",at:0}]} secondary={[{iso:"ESP",color:"#c60b1e",at:30},{iso:"DZA",color:"#006233",at:30}]} />} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="ResourceTextureFill-Maroc-Phosphate-H" component={() => <ResourceTextureFill center={[-5,31]} baseZoom={5.5} countries={[{iso:"MAR",boundaryIsos:["ESH"],resource:"phosphate",at:0}]} secondary={[{iso:"ESP",color:"#c60b1e",at:30},{iso:"DZA",color:"#006233",at:30}]} />} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="ResourceTextureFill-Afrique-V" component={() => <ResourceTextureFill center={[20,5]} baseZoom={3.5} countries={[{iso:"DZA",resource:"oil",at:0},{iso:"NGA",resource:"oil",at:30},{iso:"COD",resource:"lithium",at:60},{iso:"ZMB",resource:"lithium",at:90},{iso:"GHA",resource:"gold",at:120}]} />} durationInFrames={240} fps={30} width={1080} height={1920} />
        <Composition id="ResourceTextureFill-Afrique-H" component={() => <ResourceTextureFill center={[20,5]} baseZoom={3.5} countries={[{iso:"DZA",resource:"oil",at:0},{iso:"NGA",resource:"oil",at:30},{iso:"COD",resource:"lithium",at:60},{iso:"ZMB",resource:"lithium",at:90},{iso:"GHA",resource:"gold",at:120}]} />} durationInFrames={240} fps={30} width={1920} height={1080} />
        <Composition id="HeatGradientFill-Petrole-V" component={() => <HeatGradientFill center={[20,5]} baseZoom={3.5} countries={[{iso:"NGA",intensity:1.0,at:0,rampFrames:90,palette:PALETTE_PETROLE},{iso:"LBY",intensity:0.85,at:30,rampFrames:80,palette:PALETTE_PETROLE},{iso:"DZA",intensity:0.75,at:50,rampFrames:80,palette:PALETTE_PETROLE},{iso:"AGO",intensity:0.70,at:70,rampFrames:75,palette:PALETTE_PETROLE}]} />} durationInFrames={200} fps={30} width={1080} height={1920} />
        <Composition id="HeatGradientFill-Petrole-H" component={() => <HeatGradientFill center={[20,5]} baseZoom={3.5} countries={[{iso:"NGA",intensity:1.0,at:0,rampFrames:90,palette:PALETTE_PETROLE},{iso:"LBY",intensity:0.85,at:30,rampFrames:80,palette:PALETTE_PETROLE},{iso:"DZA",intensity:0.75,at:50,rampFrames:80,palette:PALETTE_PETROLE},{iso:"AGO",intensity:0.70,at:70,rampFrames:75,palette:PALETTE_PETROLE}]} />} durationInFrames={200} fps={30} width={1920} height={1080} />

        {/* ── N3 EFFETS AVANCES ── */}
        <Composition id="WavingFlagFill-Maroc-V" component={() => <WavingFlagFill mainIso="MAR" mainBoundaryIsos={["ESH"]} center={[-5,31]} baseZoom={5.0} secondary={[{iso:"ESP",color:"#c60b1e"},{iso:"DZA",color:"#006233"}]} />} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="WavingFlagFill-Maroc-H" component={() => <WavingFlagFill mainIso="MAR" mainBoundaryIsos={["ESH"]} center={[-5,31]} baseZoom={5.0} secondary={[{iso:"ESP",color:"#c60b1e"},{iso:"DZA",color:"#006233"}]} />} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="FlagDissolveTransition-AES-V" component={() => <FlagDissolveTransition center={[-1,14]} baseZoom={4.5} countries={[{iso:"MLI",fromIso:"FRA",toIso:"RUS",dissolveAt:60,dissolveDur:50},{iso:"BFA",fromIso:"FRA",toIso:"RUS",dissolveAt:90,dissolveDur:50}]} />} durationInFrames={200} fps={30} width={1080} height={1920} />
        <Composition id="FlagDissolveTransition-AES-H" component={() => <FlagDissolveTransition center={[-1,14]} baseZoom={4.5} countries={[{iso:"MLI",fromIso:"FRA",toIso:"RUS",dissolveAt:60,dissolveDur:50},{iso:"BFA",fromIso:"FRA",toIso:"RUS",dissolveAt:90,dissolveDur:50}]} />} durationInFrames={200} fps={30} width={1920} height={1080} />
        <Composition id="PulsingRegionFill-Sahel-V" component={() => <PulsingRegionFill center={[20,12]} baseZoom={3.8} countries={[{iso:"MLI",color:"#e63946",at:0,period:55,opacityMin:0.20,opacityMax:0.65,showGlow:true},{iso:"BFA",color:"#e63946",at:15,period:60,opacityMin:0.20,opacityMax:0.60,showGlow:true},{iso:"NER",color:"#ff7800",at:30,period:70,opacityMin:0.15,opacityMax:0.50}]} />} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="PulsingRegionFill-Sahel-H" component={() => <PulsingRegionFill center={[20,12]} baseZoom={3.8} countries={[{iso:"MLI",color:"#e63946",at:0,period:55,opacityMin:0.20,opacityMax:0.65,showGlow:true},{iso:"BFA",color:"#e63946",at:15,period:60,opacityMin:0.20,opacityMax:0.60,showGlow:true},{iso:"NER",color:"#ff7800",at:30,period:70,opacityMin:0.15,opacityMax:0.50}]} />} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="ImageProjectionFill-Maroc-V" component={() => <ImageProjectionFill center={[-5,31]} baseZoom={5.2} countries={[{iso:"MAR",boundaryIsos:["ESH"],imageSrc:staticFileRoot("_shared/refs/textures/khouribga-mine-satellite.png"),goldColor:"#c8a951",navyColor:"#16213a",contrast:1.3,at:0}]} secondary={[{iso:"ESP",color:"#c60b1e"},{iso:"DZA",color:"#006233"}]} />} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="ImageProjectionFill-Maroc-H" component={() => <ImageProjectionFill center={[-5,31]} baseZoom={5.2} countries={[{iso:"MAR",boundaryIsos:["ESH"],imageSrc:staticFileRoot("_shared/refs/textures/khouribga-mine-satellite.png"),goldColor:"#c8a951",navyColor:"#16213a",contrast:1.3,at:0}]} secondary={[{iso:"ESP",color:"#c60b1e"},{iso:"DZA",color:"#006233"}]} />} durationInFrames={150} fps={30} width={1920} height={1080} />

        {/* ── PATTERN OR AFRICAIN généralisé : plaque pays + source + compteur + climax + pitch 32 ── */}
        <Composition id="GeoCountryPlaqueShowcase-V" component={GeoCountryPlaqueShowcase} durationInFrames={GEO_COUNTRY_PLAQUE_SHOWCASE_FRAMES} fps={30} width={1080} height={1920} />
        <Composition id="GeoCountryPlaqueShowcase-H" component={GeoCountryPlaqueShowcase} durationInFrames={GEO_COUNTRY_PLAQUE_SHOWCASE_FRAMES} fps={30} width={1920} height={1080} />

        {/* ── N4 COMBOS ── */}
        <Composition id="ContagionFlagSpread-AES-V" component={() => <ContagionFlagSpread center={[-1,14]} baseZoom={4.5} waves={[["MLI"],["BFA"],["NER"],["TCD","MRT"]]} waveAt={15} waveGap={30} epicenterIso="MLI" />} durationInFrames={240} fps={30} width={1080} height={1920} />
        <Composition id="ContagionFlagSpread-AES-H" component={() => <ContagionFlagSpread center={[-1,14]} baseZoom={4.5} waves={[["MLI"],["BFA"],["NER"],["TCD","MRT"]]} waveAt={15} waveGap={30} epicenterIso="MLI" />} durationInFrames={240} fps={30} width={1920} height={1080} />
        <Composition id="ContagionFlagSpread-BRICS-V" component={() => <ContagionFlagSpread center={[20,5]} baseZoom={3.5} waves={[["ZAF"],["EGY","ETH"],["NGA","DZA"],["COD","TZA","AGO"]]} waveAt={10} waveGap={35} epicenterIso="ZAF" />} durationInFrames={280} fps={30} width={1080} height={1920} />
        <Composition id="ContagionFlagSpread-BRICS-H" component={() => <ContagionFlagSpread center={[20,5]} baseZoom={3.5} waves={[["ZAF"],["EGY","ETH"],["NGA","DZA"],["COD","TZA","AGO"]]} waveAt={10} waveGap={35} epicenterIso="ZAF" />} durationInFrames={280} fps={30} width={1920} height={1080} />

        <Composition id="Layout16-LaCalebasse" component={() => <LaCalebasse />} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="Layout16-LeCadranSolaire" component={() => <LeCadranSolaire />} durationInFrames={700} fps={30} width={1920} height={1080} />
        <Composition id="Layout16-Stratigraphie" component={() => <Stratigraphie />} durationInFrames={180} fps={30} width={1920} height={1080} />
        {/* ── SILICON SAVANNAH ── */}
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
      </Folder>

      <Folder name="proto-16-9">
        <Composition
          id="ProtoA-MapboxSatelliteSenegal"
          component={Prototype_A_MapboxSatelliteSenegal}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ProtoB1-OdometerKraft"
          component={Prototype_B_OdometerDataHero}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ variant: "kraft" as const }}
        />
        <Composition
          id="ProtoB2-OdometerIvoire"
          component={Prototype_B_OdometerDataHero}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ variant: "ivoire" as const }}
        />
        <Composition
          id="ProtoB3-OdometerSlate"
          component={Prototype_B_OdometerDataHero}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ variant: "slate" as const }}
        />
        <Composition
          id="ProtoC-CompositionTest"
          component={Prototype_C_CompositionTest}
          durationInFrames={700}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ProtoD-MapboxStyleComparison"
          component={Prototype_D_MapboxStyleComparison}
          durationInFrames={450}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ProtoE-BackgroundsShowcase"
          component={Prototype_E_BackgroundsShowcase}
          durationInFrames={600}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ProtoF-Vague2Showcase"
          component={Prototype_F_Vague2Showcase}
          durationInFrames={1080}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ProtoG-Vague3Showcase"
          component={Prototype_G_Vague3Showcase}
          durationInFrames={810}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ProtoH-Vague3b-Showcase"
          component={Prototype_H_Vague3bShowcase}
          durationInFrames={810}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-LaCalebasse"
          component={LaCalebasse}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-LeCadranSolaire"
          component={LeCadranSolaire}
          durationInFrames={700}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-Stratigraphie"
          component={Stratigraphie}
          durationInFrames={700}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-LeSceau"
          component={LeSceau}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-PolyrythmieData"
          component={PolyrythmieData}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-NoeudTisserand"
          component={NoeudTisserand}
          durationInFrames={700}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ProtoI-Vague3c-Showcase"
          component={Prototype_I_Vague3cShowcase}
          durationInFrames={810}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-LeSemeur"
          component={LeSemeur}
          durationInFrames={700}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-Palimpseste"
          component={Palimpseste}
          durationInFrames={700}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-ArbreAPalabres"
          component={ArbreAPalabres}
          durationInFrames={700}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ProtoJ-Vague4-Showcase"
          component={Prototype_J_Vague4Showcase}
          durationInFrames={810}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-Caviardage"
          component={Caviardage}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-FilRouge"
          component={FilRouge}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-SovereignEclipse"
          component={SovereignEclipse}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ProtoK-Vague5-Showcase"
          component={Prototype_K_Vague5Showcase}
          durationInFrames={810}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-VoixDuPeuple"
          component={VoixDuPeuple}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-FaceAFace"
          component={FaceAFace}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-PortraitDossier"
          component={PortraitDossier}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ProtoL-Vague6-Showcase"
          component={Prototype_L_Vague6Showcase}
          durationInFrames={720}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-TextChoc"
          component={TextChoc}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-SourceProuve"
          component={SourceProuve}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-ChiffreChoc"
          component={ChiffreChoc}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ProtoM-Vague7-Showcase"
          component={Prototype_M_Vague7Showcase}
          durationInFrames={810}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-PortraitSilhouette"
          component={PortraitSilhouette}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-MosaiqueActeurs"
          component={MosaiqueActeurs}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-PassationPouvoir"
          component={PassationPouvoir}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ProtoN-Vague8-Showcase"
          component={Prototype_N_Vague8Showcase}
          durationInFrames={540}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-PortraitEditorial"
          component={PortraitEditorial}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-TrombinoscapeStrategique"
          component={TrombinoscapeStrategique}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ProtoO-Vague6Exp-Showcase"
          component={Prototype_O_Vague6ExpShowcase}
          durationInFrames={1200}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-ParallaxeDiorama"
          component={ParallaxeDiorama}
          durationInFrames={200}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-MosaiqueWax"
          component={MosaiqueWax}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-MetamorphoseFiduciaire"
          component={MetamorphoseFiduciaire}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-OrigamiCarto"
          component={OrigamiCarto}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-LoomWeaver"
          component={LoomWeaver}
          durationInFrames={220}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* Vague 4 manquants */}
        <Composition
          id="ProtoP-Vague4b-Showcase"
          component={Prototype_P_Vague4bShowcase}
          durationInFrames={660}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-CalqueDechire"
          component={CalqueDechire}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-ScanInfrarouge"
          component={ScanInfrarouge}
          durationInFrames={200}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-EffetDomino"
          component={EffetDomino}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-LoomWipe"
          component={LoomWipe}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ProtoQ-Vague3-Complete-Showcase"
          component={Prototype_Q_Vague3CompleteShowcase}
          durationInFrames={2430}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ProtoR-Vague1-Refactor-Showcase"
          component={Prototype_R_Vague1RefactorShowcase}
          durationInFrames={PROTO_R_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition id="ProtoEffect-Loupe" component={ProtoEffect_Loupe} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="ProtoEffect-MapDraw" component={ProtoEffect_MapDraw} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="RND-VilleCompare" component={VilleCompare} durationInFrames={60} fps={30} width={2200} height={1200} />
        <Composition id="RND-JetonsCompare" component={JetonsCompare} durationInFrames={90} fps={30} width={1920} height={1080} />
        <Composition id="RND-Donut60Proto" component={Donut60Proto} durationInFrames={90} fps={30} width={1920} height={1080} />
        <Composition id="RND-BarilHeroProto" component={BarilHeroProto} durationInFrames={100} fps={30} width={1920} height={1080} />
        <Composition id="RND-EtatMajorCompare" component={EtatMajorCompare} durationInFrames={60} fps={30} width={2200} height={1200} />
        <Composition id="RND-EtatMajorGptAnimee" component={EtatMajorGptAnimee} durationInFrames={150} fps={30} width={1080} height={1080} />
        <Composition id="RND-VilleGeminiAnimee" component={VilleGeminiAnimee} durationInFrames={150} fps={30} width={1080} height={1080} />
        <Composition id="RND-OffshoreCompare" component={OffshoreCompare} durationInFrames={60} fps={30} width={2200} height={1200} />
        <Composition id="RND-OffshoreGeminiAnimee" component={OffshoreGeminiAnimee} durationInFrames={180} fps={30} width={1080} height={1080} />
        <Composition id="RND-OffshoreGeminiAnimeeSFX" component={OffshoreGeminiAnimeeSFX} durationInFrames={180} fps={30} width={1080} height={1080} />
        <Composition id="RND-ProfilCompare" component={ProfilCompare} durationInFrames={60} fps={30} width={2200} height={1200} />
        <Composition id="RND-DuoCompare" component={DuoCompare} durationInFrames={60} fps={30} width={2200} height={1200} />
        <Composition id="RND-AnimalCompare" component={AnimalCompare} durationInFrames={60} fps={30} width={2200} height={1200} />
        <Composition id="RND-DefenseCompare" component={DefenseCompare} durationInFrames={60} fps={30} width={2200} height={1200} />
        <Composition id="RND-DefenseGptAnimee" component={DefenseGptAnimee} durationInFrames={180} fps={30} width={1080} height={1080} />
        <Composition id="RND-CfaCompare" component={CfaCompare} durationInFrames={60} fps={30} width={2048} height={1024} />
        <Composition id="RND-CfaFrancAnimee" component={CfaFrancAnimee} durationInFrames={180} fps={30} width={1080} height={1080} />
        <Composition id="RND-CfaFrancAnimeeSFX" component={CfaFrancAnimeeSFX} durationInFrames={180} fps={30} width={1080} height={1080} />
        <Composition id="RND-MineCompare" component={MineCompare} durationInFrames={60} fps={30} width={3840} height={1080} />
        <Composition id="RND-DemiLuneCompare" component={DemiLuneCompare} durationInFrames={60} fps={30} width={5760} height={1080} />
        <Composition id="RND-DemiLuneEncreColorisee" component={DemiLuneEncreColorisee} durationInFrames={210} fps={30} width={1920} height={1080} />
        <Composition id="RND-DemiLuneBraiseAnimee" component={DemiLuneBraiseAnimee} durationInFrames={210} fps={30} width={1920} height={1080} />
        <Composition id="RND-DemiLuneEncreVert" component={DemiLuneEncreColorisee} durationInFrames={210} fps={30} width={1080} height={1920} defaultProps={{ vertical: true }} />
        <Composition id="RND-DemiLuneBraiseVert" component={DemiLuneBraiseAnimee} durationInFrames={210} fps={30} width={1080} height={1920} defaultProps={{ vertical: true }} />
        <Composition id="RND-MurTopDownBraise" component={MurTopDownBraise} durationInFrames={240} fps={30} width={1920} height={1080} />
        <Composition id="RND-MurTopDownBraiseVert" component={MurTopDownBraise} durationInFrames={240} fps={30} width={1080} height={1920} defaultProps={{ vertical: true }} />
        <Composition id="RND-Img2SvgCompare" component={Img2SvgCompare} durationInFrames={60} fps={30} width={2160} height={1920} />
        <Composition id="RND-TopDown3Compare" component={TopDown3Compare} durationInFrames={60} fps={30} width={3240} height={1920} />
        <Composition id="RND-GgwD3GeoMap" component={GgwD3GeoMap} durationInFrames={250} fps={30} width={1080} height={1920} />
        <Composition id="RND-GgwD3GeoMapEncre" component={GgwD3GeoMapEncre} durationInFrames={250} fps={30} width={1080} height={1920} />
        <Composition id="RND-GgwD3GeoMapSFX" component={GgwD3GeoMapSFX} durationInFrames={250} fps={30} width={1080} height={1920} />
        <Composition id="RND-GgwD3GeoMapEncreSFX" component={GgwD3GeoMapEncreSFX} durationInFrames={250} fps={30} width={1080} height={1920} />
        <Composition id="RND-MineGeminiAnimee" component={MineGeminiAnimee} durationInFrames={840} fps={30} width={1920} height={1080} />
        <Composition id="RND-HeroGptAnimee" component={HeroGptAnimee} durationInFrames={520} fps={30} width={1920} height={1080} />
        <Composition id="RND-CreusetAnimee" component={CreusetAnimee} durationInFrames={420} fps={30} width={1920} height={1080} />
        <Composition id="RND-GraineStatic" component={GraineStatic} durationInFrames={60} fps={30} width={1920} height={1080} />
        <Composition id="RND-GraineGeminiAnimee" component={GraineGeminiAnimee} durationInFrames={480} fps={30} width={1920} height={1080} />
        <Composition id="ProtoEffect-TypewriterStock" component={ProtoEffect_TypewriterStock} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="ProtoEffect-Newspaper3D" component={ProtoEffect_Newspaper3D} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="ProtoEffect-Loupe3D" component={ProtoEffect_Loupe3D} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="ProtoEffect-MapDrawParchemin" component={ProtoEffect_MapDrawParchemin} durationInFrames={210} fps={30} width={1920} height={1080} />
        <Composition id="ProtoEffect-MapDrawParchemin-Narr" component={ProtoEffect_MapDrawParchemin} durationInFrames={252} fps={30} width={1920} height={1080} defaultProps={{ withNarration: true }} />
        <Composition id="DemoLimogeageTemplates" component={DemoLimogeageTemplates} durationInFrames={300} fps={30} width={1920} height={1080} />
        <Composition id="ProtoEffect-Fracture-Parchemin" component={ProtoEffect_Fracture} durationInFrames={700} fps={30} width={1920} height={1080} defaultProps={{ mode: "parchemin" }} />
        <Composition id="ProtoEffect-Fracture-Sombre" component={ProtoEffect_Fracture} durationInFrames={700} fps={30} width={1920} height={1080} defaultProps={{ mode: "sombre" }} />
        <Composition id="ProtoEffect-Fracture-Parchemin-Narr" component={ProtoEffect_Fracture} durationInFrames={700} fps={30} width={1920} height={1080} defaultProps={{ mode: "parchemin", withNarration: true }} />
        <Composition id="ProtoEffect-Fracture-Sombre-Narr" component={ProtoEffect_Fracture} durationInFrames={700} fps={30} width={1920} height={1080} defaultProps={{ mode: "sombre", withNarration: true }} />
        <Composition id="SenegalScene0" component={SenegalScene0} durationInFrames={970} fps={30} width={1920} height={1080} />
        <Composition id="SenegalScene1" component={SenegalScene1} durationInFrames={3015} fps={30} width={1920} height={1080} />
        <Composition id="SenegalScene1Intro" component={SenegalScene1Intro} durationInFrames={750} fps={30} width={1920} height={1080} />
        <Composition id="SenegalScene1IntroCoin" component={SenegalScene1IntroCoin} durationInFrames={900} fps={30} width={1920} height={1080} />
        <Composition id="SenegalCoinSVGProbe" component={SenegalCoinSVGProbe} durationInFrames={330} fps={30} width={1920} height={1080} />
        <Composition id="IntroProtoC" component={IntroProtoC} durationInFrames={270} fps={30} width={1920} height={1080} />
        <Composition id="IntroProtoB" component={IntroProtoB} durationInFrames={270} fps={30} width={1920} height={1080} />
        <Composition id="IntroProtoA" component={IntroProtoA} durationInFrames={270} fps={30} width={1920} height={1080} />
        <Composition id="MatterCompare" component={MatterCompare} durationInFrames={30} fps={30} width={1920} height={1080} />
        <Composition id="MatterOnMap-none" component={MatterOnMap} durationInFrames={30} fps={30} width={1920} height={1080} defaultProps={{ mode: "none" }} />
        <Composition id="MatterOnMap-canvas" component={MatterOnMap} durationInFrames={30} fps={30} width={1920} height={1080} defaultProps={{ mode: "canvas" }} />
        <Composition id="MatterOnMap-gemini" component={MatterOnMap} durationInFrames={30} fps={30} width={1920} height={1080} defaultProps={{ mode: "gemini" }} />
        <Composition id="ProtoHera-ChartsParchemin" component={ProtoHera_ChartsParchemin} durationInFrames={450} fps={30} width={1920} height={1080} />
        <Composition id="ProtoHera-ChartOnMap" component={ProtoHera_ChartOnMap} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="TealAssemblyEtat3" component={TealAssemblyEtat3} durationInFrames={TEAL_ASSEMBLY_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="ProtoCarto-ContinentDraw" component={ProtoCarto_ContinentDraw} durationInFrames={390} fps={30} width={1920} height={1080} />
        <Composition id="ProtoCarto-OffshoreCut" component={ProtoCarto_OffshoreCut} durationInFrames={330} fps={30} width={1920} height={1080} />
        <Composition id="ProtoCarto-TerritoireDecoupe" component={ProtoCarto_TerritoireDecoupe} durationInFrames={330} fps={30} width={1920} height={1080} />
        <Composition id="ProtoCarto-CoucheTemps" component={ProtoCarto_CoucheTemps} durationInFrames={360} fps={30} width={1920} height={1080} />
        <Composition id="ProtoHera-TerminalNeon" component={ProtoHera_TerminalNeon} durationInFrames={330} fps={30} width={1920} height={1080} />
        <Composition id="ProtoHera-Sketch" component={ProtoHera_Sketch} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="ProtoHera-Timeline" component={ProtoHera_Timeline} durationInFrames={210} fps={30} width={1920} height={1080} />
        <Composition id="HeraFidele-V08-ChartMap" component={HeraFidele_V08_ChartMap} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="HeraFidele-V13-Bars" component={HeraFidele_V13_Bars} durationInFrames={120} fps={30} width={1920} height={1080} />
        <Composition id="HeraFidele-V01-Poll" component={HeraFidele_V01_Poll} durationInFrames={120} fps={30} width={1920} height={1080} />
        <Composition id="HeraFidele-V10-Timeline" component={HeraFidele_V10_Timeline} durationInFrames={210} fps={30} width={1920} height={1080} />
        <Composition id="HeraFidele-V04-FlagsOnMap" component={HeraFidele_V04_FlagsOnMap} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="HeraFidele-V02-PressArticle" component={HeraFidele_V02_PressArticle} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="HeraFidele-V03-KineticText" component={HeraFidele_V03_KineticText} durationInFrames={120} fps={30} width={1920} height={1080} />
        <Composition id="HeraFidele-V12-LineChart" component={HeraFidele_V12_LineChart} durationInFrames={150} fps={30} width={1920} height={1080} />
      </Folder>

      <Folder name="Carousels">
        {CAROUSELS.flatMap((carousel) =>
          carousel.slides.map((_, slideIndex) => (
            <Composition
              key={`${carousel.id}-slide-${slideIndex}`}
              id={`carousel-${carousel.id}-slide-${slideIndex}`}
              component={CarouselSouverain as unknown as React.ComponentType<Record<string, unknown>>}
              durationInFrames={30}
              fps={30}
              width={1080}
              height={1920}
              defaultProps={{
                slides: carousel.slides,
                slideIndex,
                totalSlides: carousel.slides.length,
              }}
            />
          ))
        )}
      </Folder>

      <Folder name="MarocBatteries">
        <Composition
          id="MarocBatteries-Short"
          component={MarocBatteriesShort}
          durationInFrames={MAROC_SHORT_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="MarocBatteries-Beat0-Hook"
          component={Beat0Hook}
          durationInFrames={MAROC_SEGMENTS.beat0_hook.endFrame - MAROC_SEGMENTS.beat0_hook.startFrame}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="MarocBatteries-Beat1-Phosphate"
          component={Beat1Phosphate}
          durationInFrames={MAROC_SEGMENTS.beat1_phosphate.endFrame - MAROC_SEGMENTS.beat1_phosphate.startFrame}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="MarocBatteries-Beat3-Acteurs"
          component={Beat3Acteurs}
          durationInFrames={MAROC_SEGMENTS.beat3_acteurs.endFrame - MAROC_SEGMENTS.beat3_acteurs.startFrame}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="MarocBatteries-Beat4-Geographie"
          component={Beat4Geographie}
          durationInFrames={MAROC_SEGMENTS.beat4_geographie.endFrame - MAROC_SEGMENTS.beat4_geographie.startFrame}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="MarocBatteries-Beat5-Question"
          component={Beat5Question}
          durationInFrames={MAROC_SEGMENTS.beat5_question.endFrame - MAROC_SEGMENTS.beat5_question.startFrame}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>

      <Folder name="CarouselHybridTest">
        {/* Hook propre — compteur prix (rendre normal, pas Mapbox) */}
        <Composition
          id="hybrid-hook-clean"
          component={Beat1HookClean}
          durationInFrames={180}
          fps={30}
          width={1080}
          height={1350}
        />
        {/* Map propre 6 pays (rendre via render-mapbox.sh) en 4:5 */}
        <Composition
          id="hybrid-map-clean-6pays"
          component={Beat3bMapClean}
          durationInFrames={180}
          fps={30}
          width={1080}
          height={1350}
        />
        {/* Courbe propre (slide 2) — render normal */}
        <Composition
          id="hybrid-curve-clean"
          component={CurveChartClean}
          durationInFrames={180}
          fps={30}
          width={1080}
          height={1350}
        />
        {/* Carte Ghana propre (slide 3) — render via render-mapbox.sh */}
        <Composition
          id="hybrid-ghana-clean"
          component={GhanaMapClean}
          durationInFrames={180}
          fps={30}
          width={1080}
          height={1350}
        />
        {/* Carte Afrique Ouest propre (slide 5) — render via render-mapbox.sh */}
        <Composition
          id="hybrid-afrique-clean"
          component={AfriqueOuestMapClean}
          durationInFrames={180}
          fps={30}
          width={1080}
          height={1350}
        />
        {/* Slide 1 — Hook (compteur propre + titre) */}
        <Composition
          id="hybrid-slide-hook"
          component={CarouselSlideHybrid as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={180}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgClip: "_carousel-test/or-hook-clean.mp4",
            body: "Le Ghana a signé l'accord que 6 pays refusaient.",
            subtitle: "Et a tout changé pour l'Afrique.",
            slideIndex: 0,
            totalSlides: 8,
            textAnchor: "bottom",
            isHook: true,
          }}
        />
        {/* Slide 4 — "6 pays" (carte monde) */}
        <Composition
          id="hybrid-slide-6pays"
          component={CarouselSlideHybrid as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={180}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgClip: "_carousel-test/or-6pays-map-clean.mp4",
            highlight: "6 pays",
            body: "ont refusé de rejoindre l'accord. Trop risqué, disaient-ils.",
            slideIndex: 3,
            totalSlides: 8,
            textAnchor: "bottom",
          }}
        />
        {/* Slide 2 — "3%" (courbe) */}
        <Composition
          id="hybrid-slide-2"
          component={CarouselSlideHybrid as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={180}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgClip: "_carousel-test/or-curve-clean.mp4",
            highlight: "5%",
            body: "Depuis 2010, c'est tout ce que le Ghana touchait sur son or — que le prix soit à 1 000 ou 5 000 dollars l'once.",
            slideIndex: 1,
            totalSlides: 8,
            textAnchor: "bottom",
          }}
        />
        {/* Slide 3 — "10%" (carte Ghana) */}
        <Composition
          id="hybrid-slide-3"
          component={CarouselSlideHybrid as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={180}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgClip: "_carousel-test/or-ghana-clean.mp4",
            highlight: "5% → 12%",
            body: "En janvier 2026, l'or dépasse 5 000 dollars l'once. Le Ghana impose des royalties progressives selon le cours.",
            slideIndex: 2,
            totalSlides: 8,
            textAnchor: "bottom",
          }}
        />
        {/* Slide 5 — "signé seul" (carte Afrique Ouest) */}
        <Composition
          id="hybrid-slide-5"
          component={CarouselSlideHybrid as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={180}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgClip: "_carousel-test/or-afrique-clean.mp4",
            highlight: "Signé.",
            body: "Le Ghana a signé quand même. Les investisseurs ont suivi.",
            slideIndex: 4,
            totalSlides: 8,
            textAnchor: "bottom",
          }}
        />
        {/* Slide 6 — "48%" (carte Ghana réutilisée) */}
        <Composition
          id="hybrid-slide-6"
          component={CarouselSlideHybrid as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={180}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgClip: "_carousel-test/or-afrique-clean.mp4",
            highlight: "4 pays",
            body: "Mali, Burkina, Niger, Ghana : depuis deux ans, l'Afrique reprend le contrôle de son sous-sol.",
            slideIndex: 5,
            totalSlides: 8,
            textAnchor: "bottom",
          }}
        />
        {/* Slide 7 — "1 accord" (carte Afrique Ouest réutilisée) */}
        <Composition
          id="hybrid-slide-7"
          component={CarouselSlideHybrid as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={180}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgClip: "_carousel-test/or-ghana-clean.mp4",
            highlight: "1 signal.",
            body: "Discrètement, l'Afrique commence à changer les règles de son propre sous-sol.",
            slideIndex: 6,
            totalSlides: 8,
            textAnchor: "bottom",
          }}
        />
        {/* Slide 8 — CTA statique */}
        <Composition
          id="hybrid-slide-cta"
          component={CarouselCtaSlide as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            line1: "La vidéo complète est sur notre profil.",
            line2: "Clique sur notre nom @koraetcartes pour la regarder.",
            totalSlides: 8,
          }}
        />
      </Folder>

      <Folder name="CarouselHybridThiaroye">
        {/* Slide 1 — Hook : soldat agenouillé au camp (contain = fond navy) */}
        <Composition
          id="thiaroye-slide-01-hook"
          component={CarouselSlideHybrid as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgClip: "_carousel-test/thiaroye/slide1-hook.mp4",
            body: "Ils ont libéré la France.",
            subtitle: "300 sont tombés au retour.",
            slideIndex: 0,
            totalSlides: 9,
            textAnchor: "bottom",
            isHook: true,
          }}
        />
        {/* Slide 2 — Port de Dakar, retour */}
        <Composition
          id="thiaroye-slide-02-bateau"
          component={CarouselSlideHybrid as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgClip: "_carousel-test/thiaroye/slide2-bateau.mp4",
            highlight: "Décembre 1944",
            body: "Ils ont combattu pour la France. Ils rentrent au pays.",
            slideIndex: 1,
            totalSlides: 9,
            textAnchor: "bottom",
          }}
        />
        {/* Slide 3 — Négociation : 3 soldats autour de la table */}
        <Composition
          id="thiaroye-slide-03-nego"
          component={CarouselSlideHybrid as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgClip: "_carousel-test/thiaroye/slide3-nego.mp4",
            body: "Ils attendent leur solde. Calmes. Dignes. Une main s'ouvre, une demande. Rien de plus.",
            slideIndex: 2,
            totalSlides: 9,
            textAnchor: "bottom",
          }}
        />
        {/* Slide 4 — Fusillade */}
        <Composition
          id="thiaroye-slide-04-fusillade"
          component={CarouselSlideHybrid as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgClip: "_carousel-test/thiaroye/slide4-fusillade.mp4",
            highlight: "1er décembre 1944",
            body: "À l'aube, l'armée française ouvre le feu. Sur ses propres soldats.",
            slideIndex: 3,
            totalSlides: 9,
            textAnchor: "bottom",
          }}
        />
        {/* Slide 5 — Mains au sol, douilles (la demande devient silence) */}
        <Composition
          id="thiaroye-slide-05-mains"
          component={CarouselSlideHybrid as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgClip: "_carousel-test/thiaroye/slide5-mains.mp4",
            highlight: "80 morts officiels",
            body: "Peut-être 300. Peut-être plus. Personne ne sait. Personne ne veut savoir.",
            slideIndex: 4,
            totalSlides: 9,
            textAnchor: "bottom",
          }}
        />
        {/* Slide 6 — Photo effacée, visages blancs */}
        <Composition
          id="thiaroye-slide-06-photo"
          component={CarouselSlideHybrid as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgClip: "_carousel-test/thiaroye/slide6-photo.mp4",
            body: "Les archives se ferment. Les noms s'effacent. Tu n'as jamais appris leurs noms.",
            slideIndex: 5,
            totalSlides: 9,
            textAnchor: "bottom",
          }}
        />
        {/* Slide 7 — Biram Senghor, mur de portraits */}
        <Composition
          id="thiaroye-slide-07-biram"
          component={CarouselSlideHybrid as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgClip: "_carousel-test/thiaroye/slide7-biram.mp4",
            highlight: "80 ans après",
            body: "Le fils d'un des 300 de Thiaroye dépose plainte. En mars 2026, la justice tranche.",
            slideIndex: 6,
            totalSlides: 9,
            textAnchor: "bottom",
          }}
        />
        {/* Slide 8 — Pierre tombale, un seul nom */}
        <Composition
          id="thiaroye-slide-08-pierre"
          component={CarouselSlideHybrid as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgClip: "_carousel-test/thiaroye/slide8-pierre.mp4",
            body: "L'État dissimule. Le tribunal le dit. Un seul nom sur la pierre. Les autres attendent encore.",
            slideIndex: 7,
            totalSlides: 9,
            textAnchor: "bottom",
          }}
        />
        {/* Slide 9 — CTA */}
        <Composition
          id="thiaroye-slide-09-cta"
          component={CarouselCtaSlide as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            line1: "La vidéo complète est sur notre profil.",
            line2: "Clique sur notre nom @koraetcartes pour la regarder.",
            totalSlides: 9,
          }}
        />
      </Folder>

      <Folder name="CarouselMansaMoussa">
        {/* Slide 1 — Hook : globe animé + titre "L'HOMME LE PLUS RICHE" */}
        <Composition
          id="mansa-v2-slide-01-hook"
          component={AtlasFormat2CarteDeJeu as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgImage: "_carousel-test/mansa-moussa/mm-slide1-globe.mp4",
            isVideo: true,
            body: "Il a fait s'effondrer le cours de l'or mondial.",
            highlight: "Pendant 12 ans.",
            slideIndex: 0,
            totalSlides: 8,
          }}
        />
        {/* Slide 2 — Pie chart en animation (camembert s'ouvre) */}
        <Composition
          id="mansa-v2-slide-02-pie-anim"
          component={AtlasFormat2CarteDeJeu as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgImage: "_carousel-test/mansa-moussa/mm-slide2-pie-anim.mp4",
            isVideo: true,
            highlight: "50%",
            body: "de l'or mondial venait d'un seul empire. Le Mali.",
            slideIndex: 1,
            totalSlides: 8,
          }}
        />
        {/* Slide 3 — Pie chart complet 50%/50% */}
        <Composition
          id="mansa-v2-slide-03-pie-full"
          component={AtlasFormat2CarteDeJeu as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgImage: "_carousel-test/mansa-moussa/mm-slide3-pie-full.mp4",
            isVideo: true,
            body: "Tombouctou comptait plus de bibliothèques que Paris. 25 000 étudiants à l'université de Sankoré.",
            slideIndex: 2,
            totalSlides: 8,
          }}
        />
        {/* Slide 4 — Bar chart animé 3.6t→12t (validé) */}
        <Composition
          id="mansa-v2-slide-04-barchart"
          component={AtlasFormat2CarteDeJeu as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgImage: "_carousel-test/mansa-moussa/mm-slide4-barchart.mp4",
            isVideo: true,
            highlight: "12 tonnes d'or",
            body: "Marco Polo, Colomb, Vasco de Gama réunis. Mansa Moussa les dépasse tous.",
            slideIndex: 3,
            totalSlides: 8,
          }}
        />
        {/* Slide 5 — Courbe prix de l'or −50% (animée) */}
        <Composition
          id="mansa-v2-slide-05-linechart"
          component={AtlasFormat2CarteDeJeu as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgImage: "_carousel-test/mansa-moussa/mm-slide5-linechart.mp4",
            isVideo: true,
            highlight: "−50%",
            body: "Le prix de l'or au Caire s'effondre. L'économie égyptienne met 12 ans à se remettre.",
            slideIndex: 4,
            totalSlides: 8,
          }}
        />
        {/* Slide 6 — Portrait + comparaison Rockefeller/Bezos/Musk */}
        <Composition
          id="mansa-v2-slide-06-portrait"
          component={AtlasFormat2CarteDeJeu as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgImage: "_carousel-test/mansa-moussa/mm-slide6-portrait.mp4",
            isVideo: true,
            body: "Rockefeller, Bezos, Musk. La vraie réponse : Mansa Moussa. $400+ Mds. Inestimable.",
            slideIndex: 5,
            totalSlides: 8,
          }}
        />
        {/* Slide 7 — Carte finale "Tu savais ?" */}
        <Composition
          id="mansa-v2-slide-07-cta-scene"
          component={AtlasFormat2CarteDeJeu as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgImage: "_carousel-test/mansa-moussa/mm-slide7-cta-scene.mp4",
            isVideo: true,
            body: "L'Afrique regorge de figures comme lui. Tu n'en as probablement jamais entendu parler.",
            slideIndex: 6,
            totalSlides: 8,
          }}
        />
        {/* Slide 8 — CTA */}
        <Composition
          id="mansa-v2-slide-08-cta"
          component={CarouselCtaSlide as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            line1: "La vidéo complète est sur notre profil.",
            line2: "Clique sur notre nom @koraetcartes pour la regarder.",
            totalSlides: 8,
          }}
        />
      </Folder>

      <Folder name="CarouselAtlasTest">
        {/* FORMAT 1 — Split-Screen Éditorial */}
        <Composition
          id="atlas-f1-split"
          component={AtlasFormat1SplitScreen as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgImage: "_carousel-test/mansa-moussa/frames/caravane-clean.jpg",
            highlight: "12 tonnes d'or",
            body: "En 1324, il traverse l'Afrique vers La Mecque. 60 000 personnes.",
            slideIndex: 4,
            totalSlides: 8,
            imageHeightPct: 48,
          }}
        />
        {/* FORMAT 2 — Carte de Jeu (image statique) */}
        <Composition
          id="atlas-f2-carte"
          component={AtlasFormat2CarteDeJeu as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgImage: "_carousel-test/mansa-moussa/frames/caravane-clean.jpg",
            highlight: "12 tonnes d'or",
            body: "En 1324, il traverse l'Afrique vers La Mecque. 60 000 personnes.",
            slideIndex: 4,
            totalSlides: 8,
          }}
        />
        {/* FORMAT 2 — Carte de Jeu (clip vidéo bar chart animé) */}
        <Composition
          id="atlas-f2-carte-video"
          component={AtlasFormat2CarteDeJeu as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgImage: "_carousel-test/mansa-moussa/clip-barchart.mp4",
            isVideo: true,
            highlight: "12 tonnes d'or",
            body: "Marco Polo, Colomb, Vasco de Gama réunis. Mansa Moussa les dépasse tous.",
            slideIndex: 4,
            totalSlides: 8,
          }}
        />
        {/* FORMAT 3 — Smart Crop (zoom sur Mansa, labels hors cadre) */}
        <Composition
          id="atlas-f3-smartcrop"
          component={AtlasFormat3SmartCrop as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgImage: "_carousel-test/mansa-moussa/frames/caravane-clean.jpg",
            highlight: "12 tonnes d'or",
            body: "En 1324, il traverse l'Afrique vers La Mecque. 60 000 personnes.",
            slideIndex: 4,
            totalSlides: 8,
            zoomScale: 2.4,
            zoomX: -0.2,
            zoomY: 0.1,
          }}
        />
        {/* FORMAT 4a — Panneau Opaque bas */}
        <Composition
          id="atlas-f4a-panneau-bas"
          component={AtlasFormat4PanneauOpaque as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgImage: "_carousel-test/mansa-moussa/frames/caravane-clean.jpg",
            highlight: "12 tonnes d'or",
            body: "En 1324, il traverse l'Afrique vers La Mecque. 60 000 personnes.",
            slideIndex: 4,
            totalSlides: 8,
            panelPosition: "bottom",
          }}
        />
        {/* FORMAT 4b — Panneau Opaque droite */}
        <Composition
          id="atlas-f4b-panneau-droite"
          component={AtlasFormat4PanneauOpaque as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{
            bgImage: "_carousel-test/mansa-moussa/frames/caravane-clean.jpg",
            highlight: "12 tonnes d'or",
            body: "En 1324, il traverse l'Afrique vers La Mecque. 60 000 personnes.",
            slideIndex: 4,
            totalSlides: 8,
            panelPosition: "right",
          }}
        />
      </Folder>

      <Folder name="CarouselGoodNews">
        <Composition
          id="gn-preview"
          component={GoodNewsCarousel as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={150 * 8}
          fps={30}
          width={1080}
          height={1350}
        />
        <Composition
          id="gn-00-hook"
          component={GoodNewsSlideLight as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={165}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={gnHook}
        />
        <Composition
          id="gn-01-maroc-fait"
          component={GoodNewsSlideLight as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={gnN0F}
        />
        <Composition
          id="gn-02-maroc-macro"
          component={GoodNewsSlideLight as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={gnN0M}
        />
        <Composition
          id="gn-03-kenya-fait"
          component={GoodNewsSlideLight as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={gnN1F}
        />
        <Composition
          id="gn-04-kenya-macro"
          component={GoodNewsSlideLight as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={gnN1M}
        />
        <Composition
          id="gn-05-algerie-fait"
          component={GoodNewsSlideMap as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={gnN2F}
        />
        <Composition
          id="gn-06-algerie-macro"
          component={GoodNewsSlideLight as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={gnN2M}
        />
        <Composition
          id="gn-07-cta"
          component={GoodNewsSlideLight as unknown as React.ComponentType<Record<string, unknown>>}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={gnCta}
        />
      </Folder>

      <Folder name="rnd-warmap">
        {/* COBAYE — Maroc phosphate carte (RÉVÉLER) */}
        <Composition
          id="Cobaye-Maroc-Carte"
          component={MarocPhosphateCarte}
          durationInFrames={MAROC_PHOSPHATE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* COBAYE — Maroc phosphate data-viz "70%" (ÉCRASER, Data-Hero) */}
        <Composition
          id="Cobaye-Maroc-DataHero"
          component={MarocPhosphateDataHero}
          durationInFrames={MAROC_DATAHERO_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* LOBITO — versions comparatives A/B */}
        <Composition
          id="LobitoWarmapScene"
          component={LobitoWarmapScene}
          durationInFrames={LOBITO_WARMAP_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="LobitoVersionA"
          component={LobitoVersionA}
          durationInFrames={LOBITO_A_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="LobitoVersionB"
          component={LobitoVersionB}
          durationInFrames={LOBITO_B_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        {/* TEMPLATE PRINCIPAL VERTICAL (overlay Remotion, carte claire) — 3e pilier */}
        <Composition
          id="SudanWarMapVertical"
          component={WarMapEngine}
          durationInFrames={SUDAN_OVERLAY_DURATION}
          fps={SUDAN_FPS}
          width={1080}
          height={1920}
          defaultProps={{ withOverlay: true }}
        />
        {/* CULMINATION 60s — tout le stack combine */}
        <Composition
          id="SudanWarMapEpic60"
          component={WarMapEngine}
          durationInFrames={SUDAN_EPIC_DURATION}
          fps={SUDAN_FPS}
          width={1080}
          height={1920}
          defaultProps={{ epic: true }}
        />
        {/* 16:9 (long) + variante cercles-personnages */}
        <Composition
          id="WarMapEngine"
          component={WarMapEngine}
          durationInFrames={SUDAN_FLAT_DURATION}
          fps={SUDAN_FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="SudanWarMapTokensVertical"
          component={WarMapEngine}
          durationInFrames={SUDAN_FLAT_DURATION}
          fps={SUDAN_FPS}
          width={1080}
          height={1920}
          defaultProps={{ unitStyle: "token" as const }}
        />
      </Folder>

      <Folder name="warmap-sahel">
        {/* SAHEL AES — War-Map Long Format 7min19s — narration forced-aligned */}
        <Composition
          id="SahelWarMap"
          component={SahelWarMapEngine}
          durationInFrames={SAHEL_DURATION}
          fps={SAHEL_FPS}
          width={1920}
          height={1080}
        />
        {/* TEST 10s socle visuel Acte 1 (session dédiée 2026-06-07) — DA-BRIEF-GATE.
            Même frame de contrôle (pire mosaïque 2022-09-30) + même cadre que la version
            isolée, pour comparer apples-to-apples l'effet des 3 corrections.
            A = original isolé (corrections OFF) · B = corrigé (fusion + vignette + caméra). */}
        <Composition
          id="SahelActe1Test10s-A-Original"
          component={SahelWarMapEngine}
          defaultProps={{
            fusionRegions: false,
            geoVignette: false,
            camStatic: { lon: -0.5, lat: 14.6, zoom: 4.55 },
            controlFrameOverride: 2861,
          }}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="SahelActe1Test10s-B-Corrige"
          component={SahelWarMapEngine}
          defaultProps={{
            fusionRegions: true,
            geoVignette: true,
            geoVignetteOpacity: 0.42,
            camStatic: { lon: -0.5, lat: 14.6, zoom: 4.55 },
            controlFrameOverride: 2861,
          }}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* B2 — vraie fusion territoriale (union Turf) + vignette + caméra.
            La fusion-styling (B) ne suffisait pas : union des polygones par faction. */}
        <Composition
          id="SahelActe1Test10s-B2-Fusion"
          component={SahelWarMapEngine}
          defaultProps={{
            fusionRegions: true,
            geoVignette: true,
            geoVignetteOpacity: 0.42,
            camStatic: { lon: -0.5, lat: 14.6, zoom: 4.55 },
            controlFrameOverride: 2861,
          }}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* B3 — allumage séquentiel + points-villes pulsants beige + fronts draw-in.
            Sur B2 (fusion+vignette+caméra) on ajoute : la carte SE CONSTRUIT au rythme
            du récit (Mali→Burkina→Niger), villes liées à l'allumage de leur état. */}
        <Composition
          id="SahelActe1Test10s-B3-Sequentiel"
          component={SahelWarMapEngine}
          defaultProps={{
            fusionRegions: true,
            geoVignette: true,
            geoVignetteOpacity: 0.42,
            camStatic: { lon: -0.5, lat: 14.6, zoom: 4.55 },
            controlFrameOverride: 2861,
            sequentialIgnite: { MLI: 20, BFA: 110, NER: 200 },
            cityPulse: true,
            frontDraw: true,
          }}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* RECONSTRUCTION ACTE 1 — ÉTAPE 1 : track caméra SEUL (ordre Gemini).
            Carte neutre + nouveau track ACTE1_CAM_KEYS + HUD debug. On valide le
            rythme nu (drift O->E, pause f572, reprise) AVANT toute donnée/chrome.
            f0->2299 = fin Acte 1. Narration ON (sync voix), SFX/chrome OFF. */}
        <Composition
          id="SahelActe1-Step1-CameraTrack"
          component={SahelWarMapEngine}
          defaultProps={{ acte1CameraOnly: true }}
          durationInFrames={2300}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* ACTE 1 FINAL — version reconstruite (plan validé upstream + socle 6 mécaniques).
            Compo isolée f0-2299 (77s), Actes 2-5 alignés dans une passe ultérieure. */}
        <Composition
          id="SahelActe1-Final"
          component={SahelWarMapEngine}
          defaultProps={{ acte1Final: true }}
          durationInFrames={2126}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* ACTE 1 REFONTE — compo soeur de SahelActe1-Final (Task 1, filet reversible).
            Au depart STRICTEMENT identique a acte1Final ; look epure + hook crosshair en taches suivantes. */}
        <Composition
          id="SahelActe1-Refonte"
          component={SahelWarMapEngine}
          defaultProps={{ acte1Refonte: true }}
          durationInFrames={2126}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* PROTOS DA divergence (jetables) — concepts d'ouverture alternatifs (~10s). */}
        <Composition
          id="SahelActe1-ProtoFicelles"
          component={SahelWarMapEngine}
          defaultProps={{ acte1ProtoFicelles: true }}
          durationInFrames={2126}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="SahelActe1-ProtoVide"
          component={SahelWarMapEngine}
          defaultProps={{ acte1ProtoVide: true }}
          durationInFrames={2126}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* ACTE 2 Sahel — PROLONGE l'Acte 1 (même moteur). B1 = enjeu caché (bases + flux). */}
        <Composition
          id="SahelActe2"
          component={SahelWarMapEngine}
          defaultProps={{ acte2: true }}
          durationInFrames={4200}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* PARTIE 1 Sahel — canari/origine 2012 (refactor V5, direction soustraction).
            Look Acte 1 + couche <Partie1Origine>. Legacy B1 (acte2) OFF. */}
        <Composition
          id="SahelPartie1"
          component={SahelWarMapEngine}
          defaultProps={{ partie1: true }}
          durationInFrames={2940}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* PARTIE 2 Sahel — le blocage (intervention FR/ONU qui échoue 10 ans).
            Look Acte 1 + couche <Partie2Blocage>. Points rigides sur surfaces fluides. */}
        <Composition
          id="SahelPartie2"
          component={SahelWarMapEngine}
          defaultProps={{ partie2: true }}
          durationInFrames={5700}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* PARTIE 3 Sahel — la rupture (AES naît, Kidal repris, Moura, attaques 2026 repoussées).
            Look Acte 1 + couche <Partie3Rupture>. Inversion chromatique : l'avancée FAMa colore en BLEU. */}
        <Composition
          id="SahelPartie3"
          component={SahelWarMapEngine}
          defaultProps={{ partie3: true }}
          durationInFrames={9410}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* PARTIE 4 Sahel — le coût, le levier, la perspective (DERNIÈRE partie). Look Acte 1 + couche
            <Partie4Cout>. Arc 3 mouvements : coût humain (réfugiés/chiffre) → levier (or/uranium/pétrole) →
            perspective (confédération/CFA/dézoom) → extinction au noir. Render utile : --frames=9416-13440. */}
        <Composition
          id="SahelPartie4"
          component={SahelWarMapEngine}
          defaultProps={{ partie4: true }}
          durationInFrames={13500}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* DÉMO de référence du principe validé (Aziz 2026-06-14) : contours NATIONAUX colorés
            (1 ton/pays) + draw-in & pulse. Carte épurée, séquence Mali→Burkina→Niger. --frames=0-450. */}
        <Composition
          id="SahelCountryBordersTest"
          component={SahelWarMapEngine}
          defaultProps={{ countryBordersTest: true }}
          durationInFrames={450}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* PROTO 2.4 Sahel — extinction d'une base FR encerclée (refonte PREMIUM P2).
            2 versions à comparer : à-plat (pitch 0) vs relief 3D (pitch 32).
            Rendre la plage --frames=3850-4250 (le beat 2.4 vit là, frames absolues V5). */}
        <Composition
          id="SahelProto24Flat"
          component={SahelWarMapEngine}
          defaultProps={{ proto24: true, proto24Pitch: 0 }}
          durationInFrames={4260}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="SahelProto24Pitch"
          component={SahelWarMapEngine}
          defaultProps={{ proto24: true, proto24Pitch: 32 }}
          durationInFrames={4260}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* Overlay frise — DEMO isolée (valider design avant intégration carte) */}
        <Composition
          id="SahelFriseOverlayDemo"
          component={SahelFriseOverlayDemo}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* Overlay pré-positionnement — DEMO isolée (valider design avant intégration carte) */}
        <Composition
          id="SahelPrepositionnementDemo"
          component={SahelPrepositionnementDemo}
          durationInFrames={280}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* GeoConvergence — DEMO isolée (template DA : rayon d'action -> convergence le jour même) */}
        <Composition
          id="GeoConvergenceDemo"
          component={GeoConvergenceDemo}
          durationInFrames={290}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* SHOWCASE Map Animation — 3 briques visuelles en 40s */}
        <Composition
          id="MapAnimationShowcase"
          component={MapAnimationShowcase}
          durationInFrames={SHOWCASE_DURATION}
          fps={SHOWCASE_FPS}
          width={1920}
          height={1080}
        />
        {/* TEMPLATES travel-map (R&D autonomie freelance) — fonds Mapbox réels */}
        <Composition
          id="Template-MotoVintageMap"
          component={MotoVintageMap}
          durationInFrames={450}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-SatelliteTravelMap"
          component={SatelliteTravelMap}
          durationInFrames={450}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* Version NOTRE STACK : route de l'or Atlas (carte parchemin + caravane + HUD éditorial) */}
        <Composition
          id="Template-GoldRouteAtlas"
          component={GoldRouteAtlas}
          durationInFrames={450}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* Variante zoom agressif + territoires teintés or au passage (16:9) */}
        <Composition
          id="Template-GoldRouteAtlasZoom"
          component={GoldRouteAtlasZoom}
          durationInFrames={450}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* Version COMPLETE : marchand PixelLab 8 directions (orienté selon la route) */}
        <Composition
          id="Template-GoldRoute8Dir"
          component={GoldRoute8Dir}
          durationInFrames={450}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="RND-Nord-Donnees">
        <Composition
          id="PocImmobilierQC"
          component={PocImmobilierQC}
          durationInFrames={1995}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>

      <Folder name="RND-Atlas-VideoGame">
        <Composition
          id="PocMaliVideoGame"
          component={PocMaliVideoGame}
          durationInFrames={750}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

    </>
  );
};
