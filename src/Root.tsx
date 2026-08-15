import { Composition, Folder, staticFile as staticFileRoot, useCurrentFrame } from "remotion";
import { B1Hook, B1_HOOK_FRAMES, B1_HOOK_FPS } from "./projects/souverain/cacao-chocolat-short/beats/B1Hook";
import { B2Source, B2_SOURCE_FRAMES, B2_SOURCE_FPS } from "./projects/souverain/cacao-chocolat-short/beats/B2Source";
import { VergerPreviewB3, VergerPreviewReverdit, VergerPreviewFissure } from "./projects/souverain/cacao-chocolat-short/components/VergerPreview";
import { TabletteMorphPreview0, TabletteMorphPreview1 } from "./projects/souverain/cacao-chocolat-short/components/TabletteMorphBarre";
import { B3Extraction, B3_EXTRACTION_FRAMES, B3_EXTRACTION_FPS } from "./projects/souverain/cacao-chocolat-short/beats/B3Extraction";
import { B4Lien, B4Fade, B4_RENVERSEMENT_FRAMES, B4_RENVERSEMENT_FPS } from "./projects/souverain/cacao-chocolat-short/beats/B4Renversement";
import { B5Pont, B5_PONT_FRAMES, B5_PONT_FPS } from "./projects/souverain/cacao-chocolat-short/beats/B5Pont";
import { B5PontH, B5_PONT_H_FRAMES, B5_PONT_H_FPS } from "./projects/souverain/cacao-chocolat-short/beats/B5PontH";
import { ProtoPlanteur, PROTO_PLANTEUR_FRAMES } from "./projects/souverain/cacao-chocolat-short/beats/ProtoPlanteur";
import { RecolteAuSol, RECOLTE_AU_SOL_FRAMES } from "./projects/_shared/personnage-vivant-svg/scenes-proto/RecolteAuSol";
import { PasserObjetMainAMain, PASSER_OBJET_FRAMES } from "./projects/_shared/personnage-vivant-svg/scenes-proto/PasserObjetMainAMain";
import { Proto3Quarter, PASSER3Q_FRAMES } from "./projects/_shared/personnage-vivant-svg/rnd-8dir/Proto3Quarter";
import { ProtoBack, PASSER_BACK_FRAMES } from "./projects/_shared/personnage-vivant-svg/rnd-8dir/ProtoBack";
import { ProtoFace, PASSER_FACE_FRAMES } from "./projects/_shared/personnage-vivant-svg/rnd-8dir/ProtoFace";
import { ProtoMultiDirTest, PASSER_MULTIDIR_TEST_FRAMES } from "./projects/_shared/personnage-vivant-svg/rnd-8dir/ProtoMultiDirTest";
import { SceneMultiPlanTest, SCENE_MULTIPLAN_TEST_FRAMES } from "./projects/_shared/personnage-vivant-svg/rnd-8dir/SceneMultiPlanTest";
import { HistoirePlanteur, HISTOIRE_PLANTEUR_FRAMES } from "./projects/souverain/cacao-chocolat-short/_rnd/HistoirePlanteur";
import { HistoireGGW, HISTOIRE_GGW_FRAMES } from "./projects/_rnd/svg-scenes/HistoireGGW";
import { CacaoChaineValeur16x9, CACAO_CHAINE_16X9_FRAMES } from "./projects/_rnd/svg-scenes/CacaoChaineValeur16x9";
import { VoxPapercutAvion16x9, VOX_PAPERCUT_AVION_FRAMES } from "./projects/_rnd/svg-scenes/VoxPapercutAvion16x9";
import { DetteFmiMecanismeSVG, DETTE_FMI_MECANISME_FRAMES } from "./projects/_rnd/svg-scenes/DetteFmiMecanismeSVG";
import { GlobeSahel16x9, GLOBE_SAHEL_FRAMES } from "./projects/_rnd/d3-16x9/GlobeSahel16x9";
import { GlobeToParchemin16x9, GLOBE_PARCHEMIN_FRAMES } from "./projects/_rnd/d3-16x9/GlobeToParchemin16x9";
import { SahelJetonsDezoom16x9, SAHEL_JETONS_FRAMES } from "./projects/_rnd/d3-16x9/SahelJetonsDezoom16x9";
import { JetonsComparatif16x9, JETONS_COMPARATIF_FRAMES } from "./projects/_rnd/d3-16x9/JetonsComparatif16x9";
import { ForceNetworkProto16x9, FORCE_NETWORK_FRAMES } from "./projects/_rnd/d3-16x9/ForceNetworkProto16x9";
import { Globe2Proto16x9, GLOBE2_FRAMES } from "./projects/_rnd/d3-16x9/Globe2Proto16x9";
import { SoudanActe4B6Globe, ACTE4_B6_FRAMES } from "./projects/_rnd/d3-16x9/SoudanActe4B6Globe";
import { SoudanActe4B1toB4Globe, ACTE4_B1B4_FRAMES } from "./projects/_rnd/d3-16x9/SoudanActe4B1toB4Globe";
import { SoudanActe4B1B2Globe, ACTE4_B1B2_FRAMES } from "./projects/_rnd/d3-16x9/SoudanActe4B1B2Globe";
import { SoudanActe4B3Globe, ACTE4_B3_FRAMES } from "./projects/_rnd/d3-16x9/SoudanActe4B3Globe";
import { ProtoGazoducArcContinu, PROTO_GAZODUC_ARC_FRAMES } from "./projects/_rnd/d3-16x9/ProtoGazoducArcContinu";
import { ProtoGazoducCartePlate, PROTO_GAZODUC_PLATE_FRAMES } from "./projects/_rnd/d3-16x9/ProtoGazoducCartePlate";
import { ProtoGazoducAfriqueComplete, PROTO_GAZODUC_AFRIQUE_COMPLETE_FRAMES } from "./projects/_rnd/d3-16x9/ProtoGazoducAfriqueComplete";
import { SoudanActe4B4Nil, ACTE4_B4_FRAMES } from "./projects/_rnd/d3-16x9/SoudanActe4B4Nil";
import { PieMorphProto16x9, PIE_MORPH_FRAMES } from "./projects/_rnd/d3-16x9/PieMorphProto16x9";
import { SplitScreenProto16x9, SPLIT_SCREEN_FRAMES } from "./projects/_rnd/d3-16x9/SplitScreenProto16x9";
import { ChartogramProto16x9, CHARTOGRAM_FRAMES } from "./projects/_rnd/d3-16x9/ChartogramProto16x9";
import { SankeyProto16x9, SANKEY_FRAMES } from "./projects/_rnd/d3-16x9/SankeyProto16x9";
import { CartogramProto16x9, CARTOGRAM_FRAMES } from "./projects/_rnd/d3-16x9/CartogramProto16x9";
import { NeonTerminalAnime16x9, NEON_TERMINAL_FRAMES } from "./projects/_rnd/fable-svg/NeonTerminalAnime16x9";
import { PecheurVisageAnime, PECHEUR_VISAGE_FRAMES } from "./projects/_rnd/fable-svg/PecheurVisageAnime";
import { PecheurVisageAnimeV2, PECHEUR_VISAGE_V2_FRAMES } from "./projects/_rnd/fable-svg/PecheurVisageAnimeV2";
import { FlammeAnime16x9, FLAMME_ANIME_FRAMES } from "./projects/_rnd/fable-svg/FlammeAnime16x9";
import { PecheurPersoAnime, PECHEUR_PERSO_FRAMES } from "./projects/_rnd/fable-svg/PecheurPersoAnime";
import { VillageParallaxeAnime, VILLAGE_PARALLAXE_FRAMES } from "./projects/_rnd/fable-svg/VillageParallaxeAnime";
import { ProtoInsertMatiereConduite, PROTO_INSERT_MATIERE_FRAMES } from "./projects/_rnd/svg-scenes/ProtoInsertMatiereConduite";
import { ProtoTroisGisementsInserts, PROTO_TROIS_GISEMENTS_FRAMES } from "./projects/_rnd/svg-scenes/ProtoTroisGisementsInserts";
import { PortDecorStatique } from "./projects/_rnd/svg-scenes/PortDecorStatique";
import { GazoducAeroportFable5Test, GAZODUC_AEROPORT_FABLE5_FRAMES } from "./projects/_rnd/svg-scenes/GazoducAeroportFable5Test";
import { PortVivant16x9, PORT_VIVANT_FRAMES } from "./projects/_rnd/svg-scenes/PortVivant16x9";
import { FunambuleDecorTest16x9 } from "./projects/_rnd/svg-scenes/FunambuleDecorTest16x9";
import { PorteurCharge16x9, PORTEUR_CHARGE_FRAMES } from "./projects/_rnd/svg-scenes/PorteurCharge16x9";
import { PorteurNarre16x9, PORTEUR_NARRE_FRAMES } from "./projects/_rnd/svg-scenes/PorteurNarre16x9";
import { PorteurRiche16x9 } from "./projects/_rnd/svg-scenes/PorteurRiche16x9";
import { PorteurPousse16x9 } from "./projects/_rnd/svg-scenes/PorteurPousse16x9";
import { PorteurGrille16x9 } from "./projects/_rnd/svg-scenes/PorteurGrille16x9";
import { CartePanneau16x9, CARTE_PANNEAU_FRAMES } from "./projects/_rnd/d3-16x9/CartePanneau16x9";
import { SoudanActe3GlobeProto16x9, PROTO_FRAMES as SOUDAN_A3_GLOBE_FRAMES } from "./projects/_rnd/d3-16x9/SoudanActe3GlobeProto16x9";
import { SoudanActe3GlobeInsert, SOUDAN_A3_INSERT_FRAMES } from "./projects/_rnd/d3-16x9/SoudanActe3GlobeInsert";
import { SoudanActe3GlobeMinesProto, GLOBE_MINES_PROTO_FRAMES } from "./projects/_rnd/d3-16x9/SoudanActe3GlobeMinesProto";
import { SoudanActe3Section1Globe, SECTION1_GLOBE_FRAMES } from "./projects/_rnd/d3-16x9/SoudanActe3Section1Globe";
import { SoudanActe5Globe, SOUDAN_A5_GLOBE_FRAMES } from "./projects/_rnd/d3-16x9/SoudanActe5Globe";
import { SoudanActe6Globe, SOUDAN_A6_GLOBE_FRAMES } from "./projects/_rnd/d3-16x9/SoudanActe6Globe";
import { ProtoGazoducZoomRobuste, PROTO_GAZODUC_ZOOM_FRAMES } from "./projects/_rnd/d3-16x9/ProtoGazoducZoomRobuste";
import { ProtoGazoducGlobeFusion, PROTO_GAZODUC_FUSION_FRAMES } from "./projects/_rnd/d3-16x9/ProtoGazoducGlobeFusion";
import { GazoducActe1Hook, GAZODUC_A1_FRAMES } from "./projects/souverain/gazoduc-aagp-tsgp/GazoducActe1Hook";
import { GazoducActe2AAGP, GAZODUC_A2_FRAMES } from "./projects/souverain/gazoduc-aagp-tsgp/GazoducActe2AAGP";
import { GazoducActe2SignatureFreetown, GazoducActe2SignatureFlashback, GAZODUC_A2_SIGNATURE_FREETOWN_FRAMES, GAZODUC_A2_SIGNATURE_FLASHBACK_FRAMES } from "./projects/souverain/gazoduc-aagp-tsgp/GazoducActe2Signature";
import { GazoducActe2Financement, GAZODUC_A2_FINANCEMENT_FRAMES } from "./projects/souverain/gazoduc-aagp-tsgp/GazoducActe2Financement";
import { GazoducActe2Montage, GAZODUC_A2_MONTAGE_FRAMES } from "./projects/souverain/gazoduc-aagp-tsgp/GazoducActe2Montage";
import { GazoducActe3CarteTSGP } from "./projects/souverain/gazoduc-aagp-tsgp/GazoducActe3CarteTSGP";
import { GazoducActe3InsertSecurite } from "./projects/souverain/gazoduc-aagp-tsgp/GazoducActe3InsertSecurite";
import { GazoducActe3InsertParadoxe } from "./projects/souverain/gazoduc-aagp-tsgp/GazoducActe3InsertParadoxe";
import { GazoducActe3Montage, GAZODUC_A3_MONTAGE_FRAMES } from "./projects/souverain/gazoduc-aagp-tsgp/GazoducActe3Montage";
import { GAZODUC_A3_CARTE_TSGP_FRAMES, GAZODUC_A3_INSERT_SECURITE_FRAMES, GAZODUC_A3_INSERT_PARADOXE_FRAMES } from "./projects/souverain/gazoduc-aagp-tsgp/GazoducActe3Timing";
import { ProtoA2CameraProche, ProtoA2VoisinsVisibles, ProtoA2Mix, ProtoA2CameraContinueSurMix, ProtoA2CameraContinue13Jalons, PROTO_A2_COMPARE_FRAMES, PROTO_A2_13JALONS_FRAMES } from "./projects/_rnd/d3-16x9/ProtoGazoducA2CameraVsVoisins";
import { DuelKimiGlm } from "./projects/_rnd/svg-scenes/DuelKimiGlm";
import { BlueprintDerrickK3 } from "./projects/_rnd/svg-scenes/BlueprintDerrickK3";
import { VisionKostiK3 } from "./projects/_rnd/svg-scenes/VisionKostiK3";
import { VisionKhartoumK3 } from "./projects/_rnd/svg-scenes/VisionKhartoumK3";
import { KostiInsertSVG } from "./projects/warmap/soudan-acte4/KostiInsertSVG";
import { Audio as RAudio, Sequence as RSequence, staticFile as rStaticFile, AbsoluteFill as RAbsoluteFill } from "remotion";
import { CacaoChocolatFull, CACAO_FULL_FRAMES } from "./projects/souverain/cacao-chocolat-short/CacaoChocolatFull";
import { UsinePreviewCacao, UsinePreviewIvoire, UsinePreviewIvoireDouce, UsinePreviewIvoireDouceChemVerte } from "./projects/souverain/cacao-chocolat-short/components/UsineConstruction";
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
import { KostiFrappeProto, KOSTI_PROTO_FRAMES } from "./projects/warmap/_rnd/KostiFrappeProto";
import { KostiFrappeProtoV2, KOSTI_V2_FRAMES } from "./projects/warmap/_rnd/KostiFrappeProtoV2";
import { KostiFrappeProtoV3, KOSTI_V3_FRAMES } from "./projects/warmap/_rnd/KostiFrappeProtoV3";
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
import { ProtoEffect_Loupe } from "./projects/_proto-16-9/ProtoEffect_Loupe";
import { ProtoEffect_MapDraw } from "./projects/_proto-16-9/ProtoEffect_MapDraw";
import { GgwHookEncreVivant } from "./projects/_rnd/svg-scenes/GgwHookEncreVivant";
import { B2LigneBrisee } from "./projects/_rnd/svg-scenes/B2LigneBrisee";
import { B3Malentendu } from "./projects/_rnd/svg-scenes/B3Malentendu";
import { DefenseCompare } from "./projects/_rnd/svg-scenes/DefenseCompare";
import { CfaCompare } from "./projects/_rnd/svg-scenes/CfaCompare";
import { B4Demilune } from "./projects/_rnd/svg-scenes/B4Demilune";
import { B5LaPreuve } from "./projects/_rnd/svg-scenes/B5LaPreuve";
import { B6Outro } from "./projects/_rnd/svg-scenes/B6Outro";
import { B7MosaiqueFinal } from "./projects/_rnd/svg-scenes/B7MosaiqueFinal";
import { WhiteboardTest } from "./projects/_rnd/svg-scenes/WhiteboardTest";
import { FoyerColorTest } from "./projects/_rnd/svg-scenes/FoyerColorTest";
import { FluxPetroleAnimee } from "./projects/_rnd/svg-scenes/FluxPetroleAnimee";
import { JetonsQwenDemo } from "./projects/_rnd/svg-scenes/JetonsQwenDemo";
import { JetonsGlmDemo } from "./projects/_rnd/svg-scenes/JetonsGlmDemo";
import { CfaMidformTest } from "./projects/_rnd/svg-scenes/CfaMidformTest";
import { PiliersGouffre16x9, PILIERS_GOUFFRE_FRAMES } from "./projects/_rnd/svg-scenes/PiliersGouffre16x9";
import { GraineStatic } from "./projects/_rnd/svg-scenes/GraineStatic";
import { IngaH16x9, INGA_H_FRAMES } from "./projects/_rnd/svg-scenes/IngaH16x9";
import { IngaV9x16, INGA_V_FRAMES } from "./projects/_rnd/svg-scenes/IngaV9x16";
import { IngaEncreH, INGA_ENCRE_H_FRAMES } from "./projects/_rnd/svg-scenes/IngaEncreH";
import { IngaNarratifParchemin, IngaNarratifBlanc, INGA_NARRATIF_FRAMES } from "./projects/_rnd/svg-scenes/IngaNarratif";
import { IngaMondeVivant, INGA_MONDE_FRAMES } from "./projects/_rnd/svg-scenes/IngaMondeVivant";
import { IngaMondeV2, INGA_MONDE_V2_FRAMES } from "./projects/_rnd/svg-scenes/IngaMondeV2";
import { IngaDualScene, INGA_DUAL_FRAMES } from "./projects/_rnd/svg-scenes/IngaDualScene";
import { IngaSplitScreen, INGA_SPLIT_FRAMES } from "./projects/_rnd/svg-scenes/IngaSplitScreen";
import { CargoVoyage16x9, CARGO_VOYAGE_FRAMES } from "./projects/_rnd/svg-scenes/CargoVoyage16x9";
import { CargoVoyage16x9_LibreInspire, CARGO_VOYAGE_LI_FRAMES } from "./projects/_rnd/svg-scenes/CargoVoyage16x9_LibreInspire";
import { PortDechargement16x9, PORT_DECHARGEMENT_FRAMES } from "./projects/_rnd/svg-scenes/PortDechargement16x9";
import { RetourAuChamp16x9, RETOUR_CHAMP_FRAMES } from "./projects/_rnd/svg-scenes/RetourAuChamp16x9";
import { ProtoGeminiPoseBankWalk, PROTO_GEMINI_POSE_BANK_WALK_FRAMES } from "./projects/_rnd/svg-scenes/ProtoGeminiPoseBankWalk";
import { ProtoGeminiActionChain, PROTO_GEMINI_ACTION_CHAIN_FRAMES } from "./projects/_rnd/svg-scenes/ProtoGeminiActionChain";
import { ProtoGeminiPaletteDemo, PROTO_GEMINI_PALETTE_DEMO_FRAMES } from "./projects/_rnd/svg-scenes/ProtoGeminiPaletteDemo";
import { ProtoGeminiOfferScene, PROTO_GEMINI_OFFER_SCENE_FRAMES } from "./projects/_rnd/svg-scenes/ProtoGeminiOfferScene";
import { ProtoGeminiHeadLoadWalk, PROTO_GEMINI_HEAD_LOAD_WALK_FRAMES } from "./projects/_rnd/svg-scenes/ProtoGeminiHeadLoadWalk";
import { ProtoGeminiHandBasketWalk, PROTO_GEMINI_HAND_BASKET_WALK_FRAMES } from "./projects/_rnd/svg-scenes/ProtoGeminiHandBasketWalk";
import { ProtoGeminiShoulderSackWalk, PROTO_GEMINI_SHOULDER_SACK_WALK_FRAMES } from "./projects/_rnd/svg-scenes/ProtoGeminiShoulderSackWalk";
import { ProtoGeminiBendPickup, PROTO_GEMINI_BEND_PICKUP_FRAMES } from "./projects/_rnd/svg-scenes/ProtoGeminiBendPickup";
import { ProtoGeminiManipulateObject, PROTO_GEMINI_MANIPULATE_OBJECT_FRAMES } from "./projects/_rnd/svg-scenes/ProtoGeminiManipulateObject";
import { ProtoGeminiHandoff, PROTO_GEMINI_HANDOFF_FRAMES } from "./projects/_rnd/svg-scenes/ProtoGeminiHandoff";
import { ProtoGeminiTreeCueillette, PROTO_GEMINI_TREE_CUEILLETTE_FRAMES } from "./projects/_rnd/svg-scenes/ProtoGeminiTreeCueillette";
import { ProtoGeminiContemplatif, PROTO_GEMINI_CONTEMPLATIF_FRAMES } from "./projects/_rnd/svg-scenes/ProtoGeminiContemplatif";
import { ProtoFaceExpressions } from "./projects/_rnd/svg-scenes/ProtoFaceExpressions";
import { ProtoCadrages } from "./projects/_rnd/svg-scenes/ProtoCadrages";
import { ProtoFaceAFace, PROTO_FACE_A_FACE_FRAMES } from "./projects/_rnd/svg-scenes/ProtoFaceAFace";
import { ProtoDialogueEcran, PROTO_DIALOGUE_ECRAN_FRAMES } from "./projects/_rnd/svg-scenes/ProtoDialogueEcran";
import { ProtoDataVizEncre, PROTO_DATAVIZ_ENCRE_FRAMES } from "./projects/_rnd/svg-scenes/ProtoDataVizEncre";
import { ProtoDataVizPleinEcran, PROTO_DATAVIZ_PLEIN_ECRAN_FRAMES } from "./projects/_rnd/svg-scenes/ProtoDataVizPleinEcran";
import { ProtoNarratifPlusData, PROTO_NARRATIF_PLUS_DATA_FRAMES } from "./projects/_rnd/svg-scenes/ProtoNarratifPlusData";
import { ProtoCueilletteGrosPlan16x9, PROTO_CUEILLETTE_GROS_PLAN_FRAMES } from "./projects/_rnd/svg-scenes/ProtoCueilletteGrosPlan16x9";
import { PecheurSurpeche16x9, PECHEUR_SURPECHE_FRAMES } from "./projects/_rnd/svg-scenes/PecheurSurpeche16x9";
import { PecheurSurpecheSeedance16x9, PECHEUR_SEEDANCE_FRAMES } from "./projects/_rnd/svg-scenes/PecheurSurpecheSeedance16x9";
import { ProtoMap2dEncre, PROTO_MAP2D_ENCRE_FRAMES } from "./projects/_rnd/svg-scenes/ProtoMap2dEncre";
import { ProtoInsertTactiqueTopDown, PROTO_INSERT_TACTIQUE_TOPDOWN_FRAMES } from "./projects/_rnd/svg-scenes/ProtoInsertTactiqueTopDown";
import { ProtoAssemblageKhartoumBeat5, PROTO_ASSEMBLAGE_KHARTOUM_BEAT5_FRAMES } from "./projects/_rnd/svg-scenes/ProtoAssemblageKhartoumBeat5";
import { ProtoSolPortraitRigTest, PROTO_SOL_PORTRAIT_RIG_TEST_FRAMES } from "./projects/_rnd/svg-scenes/ProtoSolPortraitRigTest";
import { ProtoSolFullbodyRigTest, PROTO_SOL_FULLBODY_RIG_TEST_FRAMES } from "./projects/_rnd/svg-scenes/ProtoSolFullbodyRigTest";
import { ProtoSolCargoSceneTest, PROTO_SOL_CARGO_SCENE_TEST_FRAMES } from "./projects/_rnd/svg-scenes/ProtoSolCargoSceneTest";
import { ProtoSolUsineSceneTest, PROTO_SOL_USINE_SCENE_TEST_FRAMES } from "./projects/_rnd/svg-scenes/ProtoSolUsineSceneTest";
import { ProtoAtlasMercator16x9, PROTO_ATLAS_MERCATOR_16X9_FRAMES } from "./projects/_rnd/svg-scenes/ProtoAtlasMercator16x9";
import { ProtoAtlasMondePalimpseste, PROTO_ATLAS_MONDE_PALIMPSESTE_FRAMES } from "./projects/_rnd/svg-scenes/ProtoAtlasMondePalimpseste";
import { ProtoAtlasMondeCameraTest, PROTO_ATLAS_MONDE_CAMERA_TEST_FRAMES } from "./projects/_rnd/svg-scenes/ProtoAtlasMondeCameraTest";
import { ProtoMapboxMondeGrisTest, PROTO_MAPBOX_MONDE_GRIS_TEST_FRAMES } from "./projects/_rnd/svg-scenes/ProtoMapboxMondeGrisTest";
import { ProtoAtlasMondeGrisSVG, PROTO_ATLAS_MONDE_GRIS_SVG_FRAMES } from "./projects/_rnd/svg-scenes/ProtoAtlasMondeGrisSVG";
import { GazoducH3IntegrationTest, GAZODUC_H3_INTEGRATION_TEST_FRAMES } from "./projects/_rnd/svg-scenes/GazoducH3IntegrationTest";
import { GazoducH3IntegrationTestReal, GAZODUC_H3_INTEGRATION_TEST_REAL_FRAMES } from "./projects/_rnd/svg-scenes/GazoducH3IntegrationTestReal";
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
import { Beat0Accroche as SenegalBeat0 } from "./projects/souverain/senegal-petrole-gaz/beats/Beat0Accroche";
import { Beat0AccrocheV7 as SenegalBeat0V7 } from "./projects/souverain/senegal-petrole-gaz/beats/Beat0AccrocheV7";
import { Beat0PlaqueProto as SenegalBeat0Proto } from "./projects/souverain/senegal-petrole-gaz/beats/Beat0PlaqueProto";
import { Beat1 as SenegalBeat1 } from "./projects/souverain/senegal-petrole-gaz/beats/Beat1";
import { Scene1Hook as SenegalShortD3Scene1Hook } from "./projects/souverain/senegal-petrole-gaz-short-d3/Scene1Hook";
import { Scene2Paradoxe as SenegalShortD3Scene2Paradoxe } from "./projects/souverain/senegal-petrole-gaz-short-d3/Scene2Paradoxe";
import { Scene3Comparaison as SenegalShortD3Scene3Comparaison } from "./projects/souverain/senegal-petrole-gaz-short-d3/Scene3Comparaison";
import { Scene4Dette as SenegalShortD3Scene4Dette } from "./projects/souverain/senegal-petrole-gaz-short-d3/Scene4Dette";
import { Scene5Cta as SenegalShortD3Scene5Cta } from "./projects/souverain/senegal-petrole-gaz-short-d3/Scene5Cta";
import { ShortComplet as SenegalShortD3ShortComplet, SHORT_COMPLET_FRAMES } from "./projects/souverain/senegal-petrole-gaz-short-d3/ShortComplet";
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
import { SceneGisementsV3 } from "./projects/souverain/senegal-petrole-gaz/beats/SceneGisementsV3";
import { SceneComparaisonV3, SCENE_COMPARAISON_V3_FRAMES } from "./projects/souverain/senegal-petrole-gaz/beats/SceneComparaisonV3";
import { SceneContratV3, SCENE_CONTRAT_V3_FRAMES } from "./projects/souverain/senegal-petrole-gaz/beats/SceneContratV3";
import { SceneDetteV3, SCENE_DETTE_V3_FRAMES } from "./projects/souverain/senegal-petrole-gaz/beats/SceneDetteV3";
import { SceneCoulissesV3, SCENE_COULISSES_V3_FRAMES } from "./projects/souverain/senegal-petrole-gaz/beats/SceneCoulissesV3";
import { SceneBilanV3, SCENE_BILAN_V3_FRAMES } from "./projects/souverain/senegal-petrole-gaz/beats/SceneBilanV3";
import { SceneBonusV3, SCENE_BONUS_V3_FRAMES } from "./projects/souverain/senegal-petrole-gaz/beats/SceneBonusV3";
import { ShortComplet as CfaShort9x16ShortComplet, CFA_SHORT_TOTAL_FRAMES } from "./projects/souverain/cfa-short-9x16/ShortComplet";
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
import { KhartoumEtatMajorSVG, KHARTOUM_EM_FRAMES, KHARTOUM_EM_FPS } from "./projects/warmap/KhartoumEtatMajorSVG";
import { KhartoumFxDemo, KHARTOUM_FX_FRAMES, KHARTOUM_FX_FPS } from "./projects/warmap/_rnd/KhartoumFxDemo";
import { ProtoSilhouetteRiseFx, PROTO_SILHOUETTE_FRAMES, PROTO_SILHOUETTE_FPS } from "./projects/warmap/_rnd/ProtoSilhouetteRiseFx";
import { VoxReproMaster, VOX_REPRO_FRAMES, VOX_REPRO_FPS } from "./projects/_rnd/vox-repro/VoxReproMaster";
import { Scene1Rise, SCENE1_FRAMES, SCENE1_FPS } from "./projects/_rnd/vox-repro/Scene1Rise";
import { Scene2JetsStrike, SCENE2_FRAMES, SCENE2_FPS } from "./projects/_rnd/vox-repro/Scene2JetsStrike";
import { Scene3Blockade, SCENE3_FRAMES, SCENE3_FPS } from "./projects/_rnd/vox-repro/Scene3Blockade";
import { KhartoumChocSVG, KHARTOUM_CHOC_FRAMES, KHARTOUM_CHOC_FPS } from "./projects/warmap/KhartoumChocSVG";
import { FrontOuvertSVG, FRONT_OUVERT_FRAMES, FRONT_OUVERT_FPS } from "./projects/warmap/FrontOuvertSVG";
import { OrDarfourHook, OR_DARFOUR_HOOK_FRAMES, OR_DARFOUR_HOOK_FPS } from "./projects/warmap/soudan-hook/OrDarfourHook";
import { SoudanSocleTest, SOUDAN_SOCLE_FRAMES, SOUDAN_SOCLE_FPS } from "./projects/warmap/SoudanSocleTest";
import { SoudanHighlightTest, SOUDAN_HL_FRAMES, SOUDAN_HL_FPS } from "./projects/warmap/SoudanHighlightTest";
import { SoudanMouvementTest, SOUDAN_MVT_FRAMES, SOUDAN_MVT_FPS } from "./projects/warmap/SoudanMouvementTest";
import { SoudanTestFinal, SOUDAN_TF_FRAMES, SOUDAN_TF_FPS } from "./projects/warmap/SoudanTestFinal";
import { SoudanActe1, SOUDAN_A1_FRAMES as SOUDAN_ACTE1_FRAMES, SOUDAN_A1_FPS as SOUDAN_ACTE1_FPS } from "./projects/warmap/soudan-acte1/SoudanActe1";
import { TwoFaceTokenTest } from "./projects/warmap/soudan-acte2/TwoFaceTokenTest";
import { SoudanActe2, SOUDAN_A2_FRAMES, SOUDAN_A2_FPS } from "./projects/warmap/soudan-acte2/SoudanActe2";
import { SoudanActe3, Section1 as SoudanActe3Section1, S1_FRAMES as SOUDAN_A3_S1_FRAMES, SOUDAN_A3_FRAMES, SOUDAN_A3_FPS } from "./projects/warmap/soudan-acte3/SoudanActe3";
import { SoudanActe4, SOUDAN_A4_FRAMES, SOUDAN_A4_FPS } from "./projects/warmap/soudan-acte4/SoudanActe4";
// Section 1 Mapbox isolée (beats 1-2-2bis, 1166 frames) — pour concat avec l'insert globe D3 (assemblage Acte 3 version GLOBE)
const SoudanActe3Section1Only: React.FC = () => (
  <RAbsoluteFill style={{ backgroundColor: "#000" }}>
    <SoudanActe3Section1 sectionOffset={0} />
  </RAbsoluteFill>
);
import { SoudanActe5, SOUDAN_A5_FRAMES, SOUDAN_A5_FPS } from "./projects/warmap/soudan-acte5/SoudanActe5";
import { PortSoudanJetonCompare, PORT_SOUDAN_COMPARE_FRAMES, PORT_SOUDAN_COMPARE_FPS } from "./projects/warmap/_rnd/PortSoudanJetonCompare";
import { GlobeSoudanDubaiTest, GLOBE_SOUDAN_DUBAI_TEST_FRAMES } from "./projects/warmap/soudan-acte3/_rnd/GlobeSoudanDubaiTest";
import { BlocRapportForceTest } from "./projects/warmap/soudan-acte2/BlocRapportForceTest";
import { GeoFlowConnectionTest, GFC_TEST_FRAMES, GFC_TEST_FPS } from "./projects/warmap/GeoFlowConnectionTest";
import { BlocImpasseB6Test } from "./projects/warmap/soudan-acte2/BlocImpasseB6Test";
import { BLOC_B6_FRAMES, BLOC_B6_FPS } from "./projects/warmap/soudan-acte2/BlocImpasseB6";
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
import { WarmapCfaInsertSVG, WARMAP_CFA_INSERT_FRAMES } from "./projects/warmap/parties/WarmapCfaInsertSVG";
import { LiptakoRevealSVG9x16 } from "./projects/warmap/shorts/aes-short-90s/LiptakoRevealSVG9x16";
import { ResourcesRevealSVG9x16 } from "./projects/warmap/shorts/aes-short-90s/ResourcesRevealSVG9x16";
import { CtaCard } from "./projects/warmap/shorts/aes-short-90s/CtaCard";
import { AesShortPart1 } from "./projects/warmap/shorts/aes-short-90s/AesShortPart1";
import { AesShortPart2 } from "./projects/warmap/shorts/aes-short-90s/AesShortPart2";
import { AesShortFull } from "./projects/warmap/shorts/aes-short-90s/AesShortFull";
import { GlobeRecitProto as SoudanShortGlobeRecitProto, GLOBE_RECIT_FRAMES as SOUDAN_SHORT_GLOBE_FRAMES } from "./projects/warmap/shorts/soudan-short/d3-globe/GlobeRecitProto";
import { GlobeRecitProto as SoudanShortGlobeZoomVariant } from "./projects/warmap/shorts/soudan-short/d3-globe/GlobeRecitProto_ZoomVariant";
import { GlobeRecitProto as SoudanShortGlobeDriftVariant } from "./projects/warmap/shorts/soudan-short/d3-globe/GlobeRecitProto_DriftVariant";
import { MotoVintageMap } from "./projects/_shared/templates/travel-map/MotoVintageMap";
import { SatelliteTravelMap } from "./projects/_shared/templates/travel-map/SatelliteTravelMap";
import { GoldRouteAtlas } from "./projects/_shared/templates/travel-map/GoldRouteAtlas";
import { GoldRouteAtlasZoom } from "./projects/_shared/templates/travel-map/GoldRouteAtlasZoom";
import { GoldRoute8Dir } from "./projects/_shared/templates/travel-map/GoldRoute8Dir";
import { MarocPhosphateCarte, MAROC_PHOSPHATE_FRAMES } from "./projects/_rnd/cobaye-maroc-phosphate/MarocPhosphateCarte";
import { MarocPhosphateDataHero, MAROC_DATAHERO_FRAMES } from "./projects/_rnd/cobaye-maroc-phosphate/MarocPhosphateDataHero";
import { HalftoneDemo } from "./projects/_rnd/cutout-halftone/HalftoneDemo";
import { EnchainementGestesValides, ENCHAINEMENT_FRAMES } from "./projects/_rnd/fable-libre/EnchainementGestesValides";
import { EnchainementGestesExpressifs, EXPRESSIFS_FRAMES } from "./projects/_rnd/fable-libre/EnchainementGestesExpressifs";
import { TestPoseSolOptions } from "./projects/_rnd/fable-libre/TestPoseSolOptions";
import { TestPoseSolRound2 } from "./projects/_rnd/fable-libre/TestPoseSolRound2";
import { PoseSolPortee } from "./projects/_rnd/fable-libre/PoseSolPortee";
import { EnchainementGestesExpressifsSol, EXPRESSIFS_SOL_FRAMES } from "./projects/_rnd/fable-libre/EnchainementGestesExpressifsSol";
import { SceneCreancier, CREANCIER_FRAMES } from "./projects/_rnd/fable-libre/SceneCreancier";
import { SceneUnSeulPecheur, UN_SEUL_PECHEUR_FRAMES } from "./projects/_rnd/fable-libre/SceneUnSeulPecheur";
import { FlowdeskAbstrait2A, FLOWDESK_ABSTRAIT_FRAMES, FLOWDESK_ABSTRAIT_FPS } from "./projects/_client-sim/flowdesk/FlowdeskAbstrait2A";
import { FlowdeskAbstraitV3, FLOWDESK_V3_FRAMES, FLOWDESK_V3_FPS } from "./projects/_client-sim/flowdesk/FlowdeskAbstraitV3";
import { FlowdeskAbstraitV4, FLOWDESK_V4_FRAMES, FLOWDESK_V4_FPS } from "./projects/_client-sim/flowdesk/FlowdeskAbstraitV4";
import { FlowdeskPersonne2B, FLOWDESK_PERSONNE_FRAMES, FLOWDESK_PERSONNE_FPS } from "./projects/_client-sim/flowdesk/FlowdeskPersonne2B";
import { DashboardLowRiskStill, DashboardHighRiskStill, DashboardLowRiskLaptopStill, DashboardHighRiskLaptopStill, NS_DASHBOARD_FRAMES, NS_DASHBOARD_FPS } from "./projects/_client-sim/noteshield/ui/DashboardScreenStill";
import { CursorTestComp, NS_CURSOR_TEST_FRAMES, NS_CURSOR_TEST_FPS } from "./projects/_client-sim/noteshield/ui/CursorTestComp";
import { NorthShieldV3, NS_V3_FRAMES, NS_V3_FPS } from "./projects/_client-sim/noteshield/NorthShieldV3";
import { P1Pivot } from "./projects/_client-sim/mochit/P1Pivot";
import { P2Workflow } from "./projects/_client-sim/mochit/P2Workflow";
import { P3Cta } from "./projects/_client-sim/mochit/P3Cta";
import { MochItComplete, MI_TOTAL_FRAMES, MI_TOTAL_FPS } from "./projects/_client-sim/mochit/MochItComplete";
import { MI_WIDTH, MI_HEIGHT, MI_FPS } from "./projects/_client-sim/mochit/theme";

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
          id="D3-A1-GlobeSahel16x9"
          component={GlobeSahel16x9}
          durationInFrames={GLOBE_SAHEL_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="D3-ForceNetwork-Proto16x9"
          component={ForceNetworkProto16x9}
          durationInFrames={FORCE_NETWORK_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="D3-Globe2-Proto16x9"
          component={Globe2Proto16x9}
          durationInFrames={GLOBE2_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="D3-SoudanActe4-B6-Globe"
          component={SoudanActe4B6Globe}
          durationInFrames={ACTE4_B6_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="D3-SoudanActe4-B1B4-Globe"
          component={SoudanActe4B1toB4Globe}
          durationInFrames={ACTE4_B1B4_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="D3-SoudanActe4-B1B2-Globe"
          component={SoudanActe4B1B2Globe}
          durationInFrames={ACTE4_B1B2_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="D3-SoudanActe4-B3-Globe"
          component={SoudanActe4B3Globe}
          durationInFrames={ACTE4_B3_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="D3-SoudanActe4-B4-Nil"
          component={SoudanActe4B4Nil}
          durationInFrames={ACTE4_B4_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="D3-PieMorph-Proto16x9"
          component={PieMorphProto16x9}
          durationInFrames={PIE_MORPH_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="D3-SplitScreen-Proto16x9"
          component={SplitScreenProto16x9}
          durationInFrames={SPLIT_SCREEN_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="D3-Chartogram-Proto16x9"
          component={ChartogramProto16x9}
          durationInFrames={CHARTOGRAM_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="D3-Sankey-Proto16x9"
          component={SankeyProto16x9}
          durationInFrames={SANKEY_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="D3-Cartogram-Proto16x9"
          component={CartogramProto16x9}
          durationInFrames={CARTOGRAM_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Fable-NeonTerminal-Anime16x9"
          component={NeonTerminalAnime16x9}
          durationInFrames={NEON_TERMINAL_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Fable-PecheurVisage-Anime"
          component={PecheurVisageAnime}
          durationInFrames={PECHEUR_VISAGE_FRAMES}
          fps={30}
          width={1080}
          height={1080}
        />
        <Composition
          id="Fable-PecheurVisage-Anime-V2"
          component={PecheurVisageAnimeV2}
          durationInFrames={PECHEUR_VISAGE_V2_FRAMES}
          fps={30}
          width={1080}
          height={1080}
        />
        <Composition
          id="Fable-Flamme-Anime16x9"
          component={FlammeAnime16x9}
          durationInFrames={FLAMME_ANIME_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Fable-PecheurPerso-Anime"
          component={PecheurPersoAnime}
          durationInFrames={PECHEUR_PERSO_FRAMES}
          fps={30}
          width={1080}
          height={1080}
        />
        <Composition
          id="Fable-VillageParallaxe-Anime"
          component={VillageParallaxeAnime}
          durationInFrames={VILLAGE_PARALLAXE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="RND-PortDecorStatique"
          component={PortDecorStatique}
          durationInFrames={1}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="RND-PortVivant16x9"
          component={PortVivant16x9}
          durationInFrames={PORT_VIVANT_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* ===== TEST DU DECOR — 3 variantes, SEUL LE FOND CHANGE =====
             Hypothese Aziz : le funambule tient-il grace au VIDE ou a l'ABSENCE DE CONCURRENCE ?
             975 frames = 32.5s (la partie funambule seule ; la scene 1994 est hors perimetre). */}
        <Composition
          id="Funambule-A-Vide"
          component={FunambuleDecorTest16x9}
          defaultProps={{ fond: "vide" as const }}
          durationInFrames={975}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Funambule-B-Attenue"
          component={FunambuleDecorTest16x9}
          defaultProps={{ fond: "attenue" as const }}
          durationInFrames={975}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Funambule-C-Plein"
          component={FunambuleDecorTest16x9}
          defaultProps={{ fond: "plein" as const }}
          durationInFrames={975}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* 2e manche : MEME decor que B, mais il REAGIT au geste central.
             Si D bat B, c'est la REACTION qui l'explique — pas un dessin different. */}
        <Composition
          id="Funambule-D-Reactif"
          component={FunambuleDecorTest16x9}
          defaultProps={{ fond: "reactif" as const }}
          durationInFrames={975}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* ⭐ LE PORTEUR — 1re scene demonstrative ou le personnage AGIT (le funambule SUBIT). */}
        <Composition
          id="Porteur-Charge"
          component={PorteurCharge16x9}
          durationInFrames={PORTEUR_CHARGE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* ⭐⭐ Le porteur NARRE : chaque geste tombe sur un mot reel (forced-align). */}
        <Composition
          id="Porteur-Narre"
          component={PorteurNarre16x9}
          durationInFrames={PORTEUR_NARRE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* Test : MEME scene, MEME voix, MEMES timings — seul LE CORPS change (personnage habille). */}
        <Composition
          id="Porteur-Riche"
          component={PorteurRiche16x9}
          durationInFrames={PORTEUR_NARRE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* 3 ajouts testes ensemble : zoom push-in + sol qui flechit + compteur.
             MEME code pour les 2 personnages (prop `perso`) — sinon la comparaison ne vaut rien. */}
        <Composition
          id="Porteur-Pousse-Stick"
          component={PorteurPousse16x9}
          defaultProps={{ perso: "stick" as const }}
          durationInFrames={PORTEUR_NARRE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Porteur-Pousse-Habille"
          component={PorteurPousse16x9}
          defaultProps={{ perso: "habille" as const }}
          durationInFrames={PORTEUR_NARRE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* 3e manche : grille FIXE vs DEFORMEE (le camembert est identique dans les 2, donc il
             n'interfere pas avec la comparaison). Zoom + sol qui flechit conserves. */}
        <Composition
          id="Porteur-Grille-Fixe"
          component={PorteurGrille16x9}
          defaultProps={{ perso: "stick" as const, grille: "fixe" as const }}
          durationInFrames={PORTEUR_NARRE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Porteur-Grille-Deformee"
          component={PorteurGrille16x9}
          defaultProps={{ perso: "stick" as const, grille: "deformee" as const }}
          durationInFrames={PORTEUR_NARRE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="D3-A1K1-GlobeToParchemin16x9"
          component={GlobeToParchemin16x9}
          durationInFrames={GLOBE_PARCHEMIN_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="D3-Jetons-SahelDezoom16x9"
          component={SahelJetonsDezoom16x9}
          durationInFrames={SAHEL_JETONS_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="D3-Jetons-Comparatif16x9"
          component={JetonsComparatif16x9}
          durationInFrames={JETONS_COMPARATIF_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="D3-A5-CartePanneau16x9"
          component={CartePanneau16x9}
          durationInFrames={CARTE_PANNEAU_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="D3-SoudanActe3-GlobeProto16x9"
          component={SoudanActe3GlobeProto16x9}
          durationInFrames={SOUDAN_A3_GLOBE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ theme: "space" as const }}
        />
        <Composition
          id="D3-SoudanActe3-GlobeProto16x9-Parchemin"
          component={SoudanActe3GlobeProto16x9}
          durationInFrames={SOUDAN_A3_GLOBE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ theme: "parchemin" as const }}
        />
        <Composition
          id="D3-SoudanActe3-GlobeProto16x9-Mixte"
          component={SoudanActe3GlobeProto16x9}
          durationInFrames={SOUDAN_A3_GLOBE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ theme: "mixte" as const }}
        />
        <Composition
          id="D3-SoudanActe3-GlobeProto16x9-Mixte-Token"
          component={SoudanActe3GlobeProto16x9}
          durationInFrames={SOUDAN_A3_GLOBE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ theme: "mixte" as const, variant: "token" as const }}
        />
        <Composition
          id="D3-SoudanActe3-GlobeProto16x9-Mixte-Zoom"
          component={SoudanActe3GlobeProto16x9}
          durationInFrames={SOUDAN_A3_GLOBE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ theme: "mixte" as const, variant: "zoom" as const }}
        />
        <Composition
          id="D3-SoudanActe3-GlobeInsert"
          component={SoudanActe3GlobeInsert}
          durationInFrames={SOUDAN_A3_INSERT_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* PROTO calage (2026-07-19) : beat 2 mines+portrait en GLOBE topdown, contours renforcés (v2 retour Aziz) */}
        <Composition
          id="D3-SoudanActe3-GlobeMines-Marque"
          component={SoudanActe3GlobeMinesProto}
          durationInFrames={GLOBE_MINES_PROTO_FRAMES}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ scaleVariant: "topdown" as const, borderVariant: "marque" as const }}
        />
        <Composition
          id="D3-SoudanActe3-GlobeMines-Fort"
          component={SoudanActe3GlobeMinesProto}
          durationInFrames={GLOBE_MINES_PROTO_FRAMES}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ scaleVariant: "topdown" as const, borderVariant: "fort" as const }}
        />
        {/* Section 1 Acte 3 en GLOBE D3 integral. SVG "puits sans fond" SUPPRIME (Aziz 2026-07-22) :
            demarre directement sur la carte des mines du Darfour (frontieres RSF/SAF, jetons, 3 mines,
            portrait Hemedti). Audio p1 re-coupe a 17.30s. Fondu d'entree doux [0,20]. */}
        <Composition
          id="D3-SoudanActe3-Section1Globe"
          component={SoudanActe3Section1Globe}
          durationInFrames={SECTION1_GLOBE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* Acte 5 "Le réseau qui arme dans l'ombre" — GLOBE D3 INTÉGRAL (Émirats→Libye/Haftar→El-Fasher) */}
        <Composition
          id="D3-SoudanActe5-Globe"
          component={SoudanActe5Globe}
          durationInFrames={SOUDAN_A5_GLOBE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* Acte 6 "Pourquoi personne ne l'arrête" — GLOBE D3 + overlay vote ONU (B3) + insert table (B4).
            2 VARIANTES B1 à comparer (Aziz 2026-07-20) : -Nu (globe nu, reco) vs -Jetons (ONU+UA posés). */}
        <Composition
          id="D3-SoudanActe6-Globe-Nu"
          component={SoudanActe6Globe}
          durationInFrames={SOUDAN_A6_GLOBE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ showInstitutionTokens: false }}
        />
        <Composition
          id="D3-SoudanActe6-Globe-Jetons"
          component={SoudanActe6Globe}
          durationInFrames={SOUDAN_A6_GLOBE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ showInstitutionTokens: true }}
        />
        {/* Gazoduc AAGP vs TSGP — Acte 1 "L'anomalie" (hook), globe D3 (occlusion reelle des 2
            tracés qui divergent + reveal en cascade par pays + starfield porté du Short 9:16). */}
        <Composition
          id="D3-Gazoduc-Acte1-Hook"
          component={GazoducActe1Hook}
          durationInFrames={GAZODUC_A1_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* Gazoduc AAGP vs TSGP — Acte 2 "AAGP" (Partie 2 script), carte D3 plate (rupture de
            registre assumee vs le globe Acte 1, fondu enchaine entre les 2, PAS de morphing de
            projection — decision Aziz 2026-08-03). Fichier neuf, briques importees/adaptees
            (InsertEchelle/PaysTrace recrees sur le modele Acte 1, geo/camera du proto
            ProtoGazoducAfriqueComplete.tsx). Cf da-brief-acte2/BREAKDOWN-ACTE2.md pour le detail
            frame-precis des 5 beats. */}
        <Composition
          id="D3-Gazoduc-Acte2-AAGP"
          component={GazoducActe2AAGP}
          durationInFrames={GAZODUC_A2_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* Gazoduc Acte 2 — Insert SVG "signature", joué en 2 temps distincts du montage (cf en-tête
            GazoducActe2Signature.tsx) : Freetown (décor+bannières grises) puis Flashback 2016
            (bannières colorées + signatures synchronisées + sceau). */}
        <Composition
          id="D3-Gazoduc-Acte2-Signature-Freetown"
          component={GazoducActe2SignatureFreetown}
          durationInFrames={GAZODUC_A2_SIGNATURE_FREETOWN_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="D3-Gazoduc-Acte2-Signature-Flashback"
          component={GazoducActe2SignatureFlashback}
          durationInFrames={GAZODUC_A2_SIGNATURE_FLASHBACK_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* Gazoduc Acte 2 — Insert SVG "financement" (chéquier absent + tuyau virtuel + Mauritanie),
            joué après le segment carte. Base statique Gemini 3.1 Pro (choix Aziz 2026-08-04). */}
        <Composition
          id="D3-Gazoduc-Acte2-Financement"
          component={GazoducActe2Financement}
          durationInFrames={GAZODUC_A2_FINANCEMENT_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* Gazoduc Acte 2 — MONTAGE FINAL des 4 segments (Freetown → Carte → Flashback 2016 →
            Financement), audio narration-p2.mp3 synchronisé par segment (startFrom réel). */}
        <Composition
          id="D3-Gazoduc-Acte2-Montage"
          component={GazoducActe2Montage}
          durationInFrames={GAZODUC_A2_MONTAGE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* Gazoduc Acte 3 "TSGP" (Partie 3 script) — carte D3 tracé Nigeria->Niger->Algérie (cyan,
            micro-haltes caméra + comparateur financier), réutilise le mécanisme exact de l'Acte 2. */}
        <Composition
          id="D3-Gazoduc-Acte3-CarteTSGP"
          component={GazoducActe3CarteTSGP}
          durationInFrames={GAZODUC_A3_CARTE_TSGP_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* Gazoduc Acte 3 — Insert SVG scène-lieu "aéroport de Niamey" (décor architectural qui vit
            puis se fige au climax "35 morts"). Revirement Aziz 2026-08-05 : remplace la carte
            abstraite du 1er DA-brief par une vraie scène-lieu, cf PLAN-ACTES2-5.md § SEGMENT B. */}
        <Composition
          id="D3-Gazoduc-Acte3-InsertSecurite"
          component={GazoducActe3InsertSecurite}
          durationInFrames={GAZODUC_A3_INSERT_SECURITE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* Gazoduc Acte 3 — Insert SVG clôture "paradoxe" Maroc/Algérie, split-screen clipPath sur
            la carte déjà tracée (DA-brief-gate tranché : évite la redite avec le dispositif
            "médaillons/cadenas" déjà utilisé ailleurs dans le projet). */}
        <Composition
          id="D3-Gazoduc-Acte3-InsertParadoxe"
          component={GazoducActe3InsertParadoxe}
          durationInFrames={GAZODUC_A3_INSERT_PARADOXE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* Gazoduc Acte 3 — MONTAGE FINAL des 3 segments (Carte TSGP → Insert Sécurité → Insert
            Paradoxe), audio narration-p3.mp3 synchronisé par segment (startFrom réel). */}
        <Composition
          id="D3-Gazoduc-Acte3-Montage"
          component={GazoducActe3Montage}
          durationInFrames={GAZODUC_A3_MONTAGE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* PROTO comparatif 10s (2026-08-03) — retour Aziz sur le 1er rendu Acte 2 : fond trop
            sombre, ouverture statique, vide autour du continent "ne marche pas". Variante A =
            camera toujours resserree ; Variante B = memes reglages camera large MAIS geo etendue
            (voisins Ameriqe du Sud/Europe/Moyen-Orient visibles). A trancher par Aziz avant
            d'appliquer au fichier de prod GazoducActe2AAGP.tsx. */}
        <Composition
          id="RND-ProtoA2-CameraProche"
          component={ProtoA2CameraProche}
          durationInFrames={PROTO_A2_COMPARE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="RND-ProtoA2-VoisinsVisibles"
          component={ProtoA2VoisinsVisibles}
          durationInFrames={PROTO_A2_COMPARE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* MIX (Aziz 2026-08-03) : camera resserree (A) + voisins visibles (B) — A seule laisse
            encore du vide au jugement d'Aziz, B seule dilue le sujet. */}
        <Composition
          id="RND-ProtoA2-Mix"
          component={ProtoA2Mix}
          durationInFrames={PROTO_A2_COMPARE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* CAMERA CONTINUE (2026-08-03) — Regle 1 du cadre REVISION-V2-APRES-REJET-V1.md : position
            recalculee CHAQUE FRAME le long du trace complet (anticipation + sillage), remplace le
            systeme camFor/lerpCam a 3-4 points fixes. Construite sur la geo elargie du Mix deja
            valide (voisins visibles). Convergence Gemini + agent Map Animation sur ce mecanisme. */}
        <Composition
          id="RND-ProtoA2-CameraContinue"
          component={ProtoA2CameraContinueSurMix}
          durationInFrames={PROTO_A2_COMPARE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* Meme mecanisme de camera continue, teste sur les 13 VRAIS jalons AAGP (Nigeria->Maroc,
            20s) — le test a 4 jalons proches ne faisait quasiment pas bouger la camera (echantillon
            trop court, Aziz 2026-08-03). */}
        <Composition
          id="RND-ProtoA2-CameraContinue13Jalons"
          component={ProtoA2CameraContinue13Jalons}
          durationInFrames={PROTO_A2_13JALONS_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* PROTO isole (2026-08-02) — preuve objective que globeR pilote TOUS les cercles de sphere
            (pas de reproduction du bug scaleMul documente sur GazoducActe1Hook). Zoom ample
            scaleMul 1.3->4.4, ne touche a aucun fichier existant. */}
        <Composition
          id="RND-ProtoGazoducZoomRobuste"
          component={ProtoGazoducZoomRobuste}
          durationInFrames={PROTO_GAZODUC_ZOOM_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* PROTO FUSION (2026-08-02) — combine l'amplitude de camera du proto Zoom Robuste avec
            l'arc en S (windingPathD) qui corrige la ligne quasi droite du proto Arc Continu. */}
        <Composition
          id="RND-ProtoGazoducGlobeFusion"
          component={ProtoGazoducGlobeFusion}
          durationInFrames={PROTO_GAZODUC_FUSION_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="KostiFrappeProto"
          component={KostiFrappeProto}
          durationInFrames={KOSTI_PROTO_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="KostiFrappeProtoV2"
          component={KostiFrappeProtoV2}
          durationInFrames={KOSTI_V2_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="KostiFrappeProtoV3"
          component={KostiFrappeProtoV3}
          durationInFrames={KOSTI_V3_FRAMES}
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
            id="SceneGisementsV3"
            component={SceneGisementsV3}
            durationInFrames={2151}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="SceneComparaisonV3"
            component={SceneComparaisonV3}
            durationInFrames={SCENE_COMPARAISON_V3_FRAMES}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="SceneContratV3"
            component={SceneContratV3}
            durationInFrames={SCENE_CONTRAT_V3_FRAMES}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="SceneDetteV3"
            component={SceneDetteV3}
            durationInFrames={SCENE_DETTE_V3_FRAMES}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="SceneCoulissesV3"
            component={SceneCoulissesV3}
            durationInFrames={SCENE_COULISSES_V3_FRAMES}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="SceneBilanV3"
            component={SceneBilanV3}
            durationInFrames={SCENE_BILAN_V3_FRAMES}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="SceneBonusV3"
            component={SceneBonusV3}
            durationInFrames={SCENE_BONUS_V3_FRAMES}
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
        <Folder name="senegal-petrole-gaz-short-d3">
          <Composition
            id="SenegalShortD3-Scene1-Hook"
            component={SenegalShortD3Scene1Hook}
            durationInFrames={288}
            fps={30}
            width={1080}
            height={1920}
          />
          <Composition
            id="SenegalShortD3-Scene2-Paradoxe"
            component={SenegalShortD3Scene2Paradoxe}
            durationInFrames={489}
            fps={30}
            width={1080}
            height={1920}
          />
          <Composition
            id="SenegalShortD3-Scene3-Comparaison"
            component={SenegalShortD3Scene3Comparaison}
            durationInFrames={1534}
            fps={30}
            width={1080}
            height={1920}
          />
          <Composition
            id="SenegalShortD3-Scene4-Dette"
            component={SenegalShortD3Scene4Dette}
            durationInFrames={605}
            fps={30}
            width={1080}
            height={1920}
          />
          <Composition
            id="SenegalShortD3-Scene5-Cta"
            component={SenegalShortD3Scene5Cta}
            durationInFrames={451}
            fps={30}
            width={1080}
            height={1920}
          />
          <Composition
            id="SenegalShortD3-COMPLET"
            component={SenegalShortD3ShortComplet}
            durationInFrames={SHORT_COMPLET_FRAMES}
            fps={30}
            width={1080}
            height={1920}
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
        <Composition id="KhartoumEtatMajorSVG" component={KhartoumEtatMajorSVG} durationInFrames={KHARTOUM_EM_FRAMES} fps={KHARTOUM_EM_FPS} width={1920} height={1080} />
        <Composition id="KhartoumFxDemo" component={KhartoumFxDemo} durationInFrames={KHARTOUM_FX_FRAMES} fps={KHARTOUM_FX_FPS} width={1920} height={1080} />
        <Composition id="ProtoSilhouetteRiseFx-A-Parchemin" component={ProtoSilhouetteRiseFx} durationInFrames={PROTO_SILHOUETTE_FRAMES} fps={PROTO_SILHOUETTE_FPS} width={1920} height={1080} defaultProps={{ epure: false }} />
        <Composition id="ProtoSilhouetteRiseFx-B-Epure" component={ProtoSilhouetteRiseFx} durationInFrames={PROTO_SILHOUETTE_FRAMES} fps={PROTO_SILHOUETTE_FPS} width={1920} height={1080} defaultProps={{ epure: true }} />
        {/* VOX REPRO — reproduction fidele reference YouTube MoSidd (world-atlas+TopoJSON+d3-geo, ZERO Mapbox) */}
        <Composition id="VoxReproMaster" component={VoxReproMaster} durationInFrames={VOX_REPRO_FRAMES} fps={VOX_REPRO_FPS} width={1920} height={1080} />
        <Composition id="VoxReproScene1" component={Scene1Rise} durationInFrames={SCENE1_FRAMES} fps={SCENE1_FPS} width={1920} height={1080} />
        <Composition id="VoxReproScene2" component={Scene2JetsStrike} durationInFrames={SCENE2_FRAMES} fps={SCENE2_FPS} width={1920} height={1080} />
        <Composition id="VoxReproScene3" component={Scene3Blockade} durationInFrames={SCENE3_FRAMES} fps={SCENE3_FPS} width={1920} height={1080} />
        {/* Moteur d'affrontement 2 factions (warmapChoc) — 2 variantes d'habillage du meme moteur */}
        <Composition id="KhartoumChocSVG" component={KhartoumChocSVG} durationInFrames={KHARTOUM_CHOC_FRAMES} fps={KHARTOUM_CHOC_FPS} width={1920} height={1080} />
        <Composition id="FrontOuvertSVG" component={FrontOuvertSVG} durationInFrames={FRONT_OUVERT_FRAMES} fps={FRONT_OUVERT_FPS} width={1920} height={1080} />
        {/* Beat 6 Acte 2 Soudan — impasse militaire (SAF pousse et echoue), registre etat-major */}
        <Composition id="BlocImpasseB6Test" component={BlocImpasseB6Test} durationInFrames={BLOC_B6_FRAMES} fps={BLOC_B6_FPS} width={1920} height={1080} />
        {/* HOOK d'ouverture Soudan — "l'or du Darfour" reskin parchemin/encre + continuation */}
        <Composition id="OrDarfourHook" component={OrDarfourHook} durationInFrames={OR_DARFOUR_HOOK_FRAMES} fps={OR_DARFOUR_HOOK_FPS} width={1920} height={1080} />
        {/* SOCLE carte Soudan (grammaire AES : Soudan crème + voisins kaki + contour permanent + halos locaux) */}
        {/* 2 variantes comparatives : A = grand bloc vide (AES pur) · B = états très pâles */}
        <Composition id="SoudanSocleTest-A-BlocVide" component={SoudanSocleTest} durationInFrames={SOUDAN_SOCLE_FRAMES} fps={SOUDAN_SOCLE_FPS} width={1920} height={1080} defaultProps={{ stateLines: 0 }} />
        <Composition id="SoudanSocleTest-B-EtatsPales" component={SoudanSocleTest} durationInFrames={SOUDAN_SOCLE_FRAMES} fps={SOUDAN_SOCLE_FPS} width={1920} height={1080} defaultProps={{ stateLines: 0.15 }} />
        {/* "on nomme → ça se trace" : contour d'état coloré qui se dessine au mot (option C) */}
        <Composition id="SoudanHighlightTest" component={SoudanHighlightTest} durationInFrames={SOUDAN_HL_FRAMES} fps={SOUDAN_HL_FPS} width={1920} height={1080} />
        {/* MOUVEMENT : jetons qui se déplacent + sillage derrière + highlight au passage (valide socle 100%) */}
        <Composition id="SoudanMouvementTest" component={SoudanMouvementTest} durationInFrames={SOUDAN_MVT_FRAMES} fps={SOUDAN_MVT_FPS} width={1920} height={1080} />
        {/* TEST FINAL : régions persistantes + jetons + arrivée qui allume + zoom serré + base iso + retour vide */}
        <Composition id="SoudanTestFinal" component={SoudanTestFinal} durationInFrames={SOUDAN_TF_FRAMES} fps={SOUDAN_TF_FPS} width={1920} height={1080} />
        <Composition id="SoudanActe1" component={SoudanActe1} durationInFrames={SOUDAN_ACTE1_FRAMES} fps={SOUDAN_ACTE1_FPS} width={1920} height={1080} />
        {/* Acte 3 — test isolé GeoFlowConnection : trajet Darfour->Dubaï aller-retour + transformation marqueur */}
        <Composition id="GeoFlowConnectionTest" component={GeoFlowConnectionTest} durationInFrames={GFC_TEST_FRAMES} fps={GFC_TEST_FPS} width={1920} height={1080} />
        {/* Acte 2 — proto isolé du jeton 2-visages (converge -> fusion -> fend -> split) */}
        <Composition id="TwoFaceTokenTest" component={TwoFaceTokenTest} durationInFrames={300} fps={30} width={1920} height={1080} />
        {/* Acte 2 "Blocage" — beats 1-4 câblés (carte + jeton 2-visages) ; beats 5-9 en cours */}
        <Composition id="SoudanActe2" component={SoudanActe2} durationInFrames={SOUDAN_A2_FRAMES} fps={SOUDAN_A2_FPS} width={1920} height={1080} />
        {/* Acte 2 beat 6 — proto isolé du bloc rapport de force (puissance vs territoire) */}
        <Composition id="BlocRapportForceTest" component={BlocRapportForceTest} durationInFrames={300} fps={30} width={1920} height={1080} />
        {/* Acte 3 "Suivre l'or" — 100% carte, GeoFlowConnection + drapeaux persistants */}
        <Composition id="SoudanActe3" component={SoudanActe3} durationInFrames={SOUDAN_A3_FRAMES} fps={SOUDAN_A3_FPS} width={1920} height={1080} />
        {/* Section 1 seule (beats 1-2-2bis, 1166 frames) — assemblage Acte 3 version GLOBE D3 */}
        <Composition id="SoudanActe3-Section1" component={SoudanActe3Section1Only} durationInFrames={SOUDAN_A3_S1_FRAMES} fps={SOUDAN_A3_FPS} width={1920} height={1080} />
        {/* Acte 4 "Même les voisins sont aspirés" — 100% carte, Russie/Égypte + DroneStrikeImpact Kosti */}
        <Composition id="SoudanActe4" component={SoudanActe4} durationInFrames={SOUDAN_A4_FRAMES} fps={SOUDAN_A4_FPS} width={1920} height={1080} />
        {/* Acte 5 "Le réseau qui arme dans l'ombre" — 100% carte, Émirats→Libye/Haftar→El-Fasher */}
        <Composition id="SoudanActe5" component={SoudanActe5} durationInFrames={SOUDAN_A5_FRAMES} fps={SOUDAN_A5_FPS} width={1920} height={1080} />
        {/* PROTO ISOLE — globe rotatif night-mode Darfour->Dubai, teste si ca peut remplacer camera suiveuse Mercator beat 3 */}
        <Composition id="GlobeSoudanDubaiTest" component={GlobeSoudanDubaiTest} durationInFrames={GLOBE_SOUDAN_DUBAI_TEST_FRAMES} fps={30} width={1920} height={1080} />
        {/* PROTO ISOLE — comparaison 2 propositions jeton Port-Soudan (navale iso vs cartouche ancre), session 10 */}
        <Composition id="PortSoudanJetonCompare" component={PortSoudanJetonCompare} durationInFrames={PORT_SOUDAN_COMPARE_FRAMES} fps={PORT_SOUDAN_COMPARE_FPS} width={1920} height={1080} />
        {/* Insert Beat1Paradoxe FINAL adopte (concept A, Sol) — rendu isole pour validation avant integration */}
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
        <Composition id="ProtoEffect-Loupe" component={ProtoEffect_Loupe} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="ProtoEffect-MapDraw" component={ProtoEffect_MapDraw} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="RND-DefenseCompare" component={DefenseCompare} durationInFrames={60} fps={30} width={2200} height={1200} />
        <Composition id="RND-CfaCompare" component={CfaCompare} durationInFrames={60} fps={30} width={2048} height={1024} />
        <Composition id="RND-GgwHookEncreVivant" component={GgwHookEncreVivant} durationInFrames={640} fps={30} width={1080} height={1920} />
        <Composition id="RND-B2LigneBrisee" component={B2LigneBrisee} durationInFrames={606} fps={30} width={1080} height={1920} />
        <Composition id="RND-B3Malentendu" component={B3Malentendu} durationInFrames={468} fps={30} width={1080} height={1920} />
        <Composition id="RND-B4Demilune" component={B4Demilune} durationInFrames={750} fps={30} width={1080} height={1920} />
        <Composition id="RND-B5LaPreuve" component={B5LaPreuve} durationInFrames={424} fps={30} width={1080} height={1920} />
        <Composition id="RND-B6Outro" component={B6Outro} durationInFrames={690} fps={30} width={1080} height={1920} />
        <Composition id="RND-B7MosaiqueFinal" component={B7MosaiqueFinal} durationInFrames={642} fps={30} width={1080} height={1920} />
        <Composition id="RND-WhiteboardTest" component={WhiteboardTest} durationInFrames={200} fps={30} width={1080} height={1920} />
        <Composition id="RND-FoyerColorTest" component={FoyerColorTest} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="RND-GazoducAeroportFable5Test" component={GazoducAeroportFable5Test} durationInFrames={GAZODUC_AEROPORT_FABLE5_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-GazoducH3IntegrationTest" component={GazoducH3IntegrationTest} durationInFrames={GAZODUC_H3_INTEGRATION_TEST_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-GazoducH3IntegrationTestReal" component={GazoducH3IntegrationTestReal} durationInFrames={GAZODUC_H3_INTEGRATION_TEST_REAL_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-FluxPetroleAnimee" component={FluxPetroleAnimee} durationInFrames={210} fps={30} width={1080} height={1080} />
        <Composition id="RND-JetonsQwenDemo" component={JetonsQwenDemo} durationInFrames={150} fps={30} width={1000} height={640} />
        <Composition id="RND-JetonsGlmDemo" component={JetonsGlmDemo} durationInFrames={150} fps={30} width={1000} height={640} />
        <Composition id="RND-CfaMidformTest" component={CfaMidformTest} durationInFrames={1264} fps={30} width={1920} height={1080} />
        <Composition id="RND-PiliersGouffre" component={PiliersGouffre16x9} durationInFrames={PILIERS_GOUFFRE_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-EnchainementGestesValides" component={EnchainementGestesValides} durationInFrames={ENCHAINEMENT_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-EnchainementGestesExpressifs" component={EnchainementGestesExpressifs} durationInFrames={EXPRESSIFS_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-SceneCreancier" component={SceneCreancier} durationInFrames={CREANCIER_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-SceneUnSeulPecheur" component={SceneUnSeulPecheur} durationInFrames={UN_SEUL_PECHEUR_FRAMES} fps={30} width={1920} height={1080} />
        {/* PROTOTYPE JETABLE (2026-08-03) — comparatif pose "au sol", a retirer apres decision d'Aziz */}
        <Composition id="RND-TestPoseSolOptions" component={TestPoseSolOptions} durationInFrames={30} fps={30} width={1920} height={1080} />
        <Composition id="RND-TestPoseSolRound2" component={TestPoseSolRound2} durationInFrames={30} fps={30} width={1920} height={1080} />
        {/* ⭐ ROUND 3 (2026-08-03) — P_SOL PORTEE grace au parametre `headTuck` manquant a <Stick> */}
        <Composition id="RND-PoseSolPortee" component={PoseSolPortee} durationInFrames={45} fps={30} width={1920} height={1080} />
        <Composition id="RND-EnchainementGestesExpressifsSol" component={EnchainementGestesExpressifsSol} durationInFrames={EXPRESSIFS_SOL_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="WarmapCfaInsertSVG" component={WarmapCfaInsertSVG} durationInFrames={WARMAP_CFA_INSERT_FRAMES} fps={30} width={1920} height={1080} />
        {/* LiptakoRevealSVG-Test / ResourcesRevealSVG-Test RETIRÉES (2026-07-04) : intégration réelle
            faite et validée dans Partie3Rupture.tsx / Partie4Cout.tsx (SahelPartie3 / SahelPartie4). */}
        <Composition id="RND-GraineStatic" component={GraineStatic} durationInFrames={60} fps={30} width={1920} height={1080} />
        <Composition id="RND-IngaH16x9" component={IngaH16x9} durationInFrames={INGA_H_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-IngaV9x16" component={IngaV9x16} durationInFrames={INGA_V_FRAMES} fps={30} width={1080} height={1920} />
        <Composition id="RND-IngaEncreH" component={IngaEncreH} durationInFrames={INGA_ENCRE_H_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoGazoducArcContinu" component={ProtoGazoducArcContinu} durationInFrames={PROTO_GAZODUC_ARC_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoGazoducCartePlate" component={ProtoGazoducCartePlate} durationInFrames={PROTO_GAZODUC_PLATE_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoGazoducAfriqueComplete" component={ProtoGazoducAfriqueComplete} durationInFrames={PROTO_GAZODUC_AFRIQUE_COMPLETE_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-IngaNarratif-Parchemin" component={IngaNarratifParchemin} durationInFrames={INGA_NARRATIF_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-IngaNarratif-Blanc" component={IngaNarratifBlanc} durationInFrames={INGA_NARRATIF_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-IngaMondeVivant" component={IngaMondeVivant} durationInFrames={INGA_MONDE_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-IngaMondeV2" component={IngaMondeV2} durationInFrames={INGA_MONDE_V2_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-IngaDualScene" component={IngaDualScene} durationInFrames={INGA_DUAL_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-IngaSplitScreen" component={IngaSplitScreen} durationInFrames={INGA_SPLIT_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-CargoVoyage16x9" component={CargoVoyage16x9} durationInFrames={CARGO_VOYAGE_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-CargoVoyage16x9-LibreInspire" component={CargoVoyage16x9_LibreInspire} durationInFrames={CARGO_VOYAGE_LI_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-PortDechargement16x9" component={PortDechargement16x9} durationInFrames={PORT_DECHARGEMENT_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-RetourAuChamp16x9" component={RetourAuChamp16x9} durationInFrames={RETOUR_CHAMP_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoGeminiPoseBankWalk" component={ProtoGeminiPoseBankWalk} durationInFrames={PROTO_GEMINI_POSE_BANK_WALK_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoGeminiActionChain" component={ProtoGeminiActionChain} durationInFrames={PROTO_GEMINI_ACTION_CHAIN_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoGeminiPaletteDemo" component={ProtoGeminiPaletteDemo} durationInFrames={PROTO_GEMINI_PALETTE_DEMO_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoGeminiOfferScene" component={ProtoGeminiOfferScene} durationInFrames={PROTO_GEMINI_OFFER_SCENE_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoGeminiHeadLoadWalk" component={ProtoGeminiHeadLoadWalk} durationInFrames={PROTO_GEMINI_HEAD_LOAD_WALK_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoGeminiHandBasketWalk" component={ProtoGeminiHandBasketWalk} durationInFrames={PROTO_GEMINI_HAND_BASKET_WALK_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoGeminiShoulderSackWalk" component={ProtoGeminiShoulderSackWalk} durationInFrames={PROTO_GEMINI_SHOULDER_SACK_WALK_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoGeminiBendPickup" component={ProtoGeminiBendPickup} durationInFrames={PROTO_GEMINI_BEND_PICKUP_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoGeminiManipulateObject" component={ProtoGeminiManipulateObject} durationInFrames={PROTO_GEMINI_MANIPULATE_OBJECT_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoGeminiHandoff" component={ProtoGeminiHandoff} durationInFrames={PROTO_GEMINI_HANDOFF_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoGeminiTreeCueillette" component={ProtoGeminiTreeCueillette} durationInFrames={PROTO_GEMINI_TREE_CUEILLETTE_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoGeminiContemplatif" component={ProtoGeminiContemplatif} durationInFrames={PROTO_GEMINI_CONTEMPLATIF_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoFaceExpressions" component={ProtoFaceExpressions} durationInFrames={120} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoCadrages" component={ProtoCadrages} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoFaceAFace" component={ProtoFaceAFace} durationInFrames={PROTO_FACE_A_FACE_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoDialogueEcran" component={ProtoDialogueEcran} durationInFrames={PROTO_DIALOGUE_ECRAN_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoDataVizEncre" component={ProtoDataVizEncre} durationInFrames={PROTO_DATAVIZ_ENCRE_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoDataVizPleinEcran" component={ProtoDataVizPleinEcran} durationInFrames={PROTO_DATAVIZ_PLEIN_ECRAN_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoNarratifPlusData" component={ProtoNarratifPlusData} durationInFrames={PROTO_NARRATIF_PLUS_DATA_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoCueilletteGrosPlan16x9" component={ProtoCueilletteGrosPlan16x9} durationInFrames={PROTO_CUEILLETTE_GROS_PLAN_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-PecheurSurpeche16x9" component={PecheurSurpeche16x9} durationInFrames={PECHEUR_SURPECHE_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-PecheurSurpecheSeedance16x9" component={PecheurSurpecheSeedance16x9} durationInFrames={PECHEUR_SEEDANCE_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoMap2dEncre" component={ProtoMap2dEncre} durationInFrames={PROTO_MAP2D_ENCRE_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoInsertTactiqueTopDown" component={ProtoInsertTactiqueTopDown} durationInFrames={PROTO_INSERT_TACTIQUE_TOPDOWN_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoAssemblageKhartoumBeat5" component={ProtoAssemblageKhartoumBeat5} durationInFrames={PROTO_ASSEMBLAGE_KHARTOUM_BEAT5_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoSolPortraitRigTest" component={ProtoSolPortraitRigTest} durationInFrames={PROTO_SOL_PORTRAIT_RIG_TEST_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoSolFullbodyRigTest" component={ProtoSolFullbodyRigTest} durationInFrames={PROTO_SOL_FULLBODY_RIG_TEST_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoSolCargoSceneTest" component={ProtoSolCargoSceneTest} durationInFrames={PROTO_SOL_CARGO_SCENE_TEST_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoSolUsineSceneTest" component={ProtoSolUsineSceneTest} durationInFrames={PROTO_SOL_USINE_SCENE_TEST_FRAMES} fps={30} width={1080} height={1920} />
        <Composition id="RND-ProtoAtlasMercator16x9" component={ProtoAtlasMercator16x9} durationInFrames={PROTO_ATLAS_MERCATOR_16X9_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoAtlasMondePalimpseste" component={ProtoAtlasMondePalimpseste} durationInFrames={PROTO_ATLAS_MONDE_PALIMPSESTE_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoAtlasMondeCameraTest" component={ProtoAtlasMondeCameraTest} durationInFrames={PROTO_ATLAS_MONDE_CAMERA_TEST_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoMapboxMondeGrisTest" component={ProtoMapboxMondeGrisTest} durationInFrames={PROTO_MAPBOX_MONDE_GRIS_TEST_FRAMES} fps={30} width={1920} height={1080} />
        <Composition id="RND-ProtoAtlasMondeGrisSVG" component={ProtoAtlasMondeGrisSVG} durationInFrames={PROTO_ATLAS_MONDE_GRIS_SVG_FRAMES} fps={30} width={1920} height={1080} />
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
        <Composition id="SenegalScene1IntroCoin" component={SenegalScene1IntroCoin} durationInFrames={641} fps={30} width={1920} height={1080} />
        <Composition id="SenegalCoinSVGProbe" component={SenegalCoinSVGProbe} durationInFrames={330} fps={30} width={1920} height={1080} />
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
        {/* R&D — Cutout halftone + stroke offset (technique Vox-style) */}
        <Composition
          id="RND-CutoutHalftone"
          component={HalftoneDemo}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
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
        {/* ACTE 1 FINAL — hook pur (retiming V6 2026-08-06). Le decoupage narratif a BOUGE entre
            V5 et V6 : en V5, PARTIE 0 (hook) contenait deja les groupes JNIM/EIGS, PARTIE 1
            commencait a "2012". En V6, JNIM/EIGS ont migre DANS le texte de PARTIE 1 (juste apres
            "Tout commence en 2012"). Le CODE JNIM/EIGS n'a pas bouge (reste dans SahelWarMapEngine,
            actif via isFinalLook qui couvre acte1Final ET partie1) -- seule la FRONTIERE DE RENDER
            entre les 2 segments a change : Acte1 s'arrete maintenant a la fin du hook pur (avant
            "2012", ~f1130), Partie1 (composition separee) couvre 2012+JNIM/EIGS+vide d'Etat.
            Render utile : --frames=0-1103 (etait 0-2299 en V5) — jonction jointive avec SahelPartie1
            (0 trou/0 chevauchement), vérifiée par check-frame-continuity.py 2026-08-06. */}
        <Composition
          id="SahelActe1-Final"
          component={SahelWarMapEngine}
          defaultProps={{ acte1Final: true }}
          durationInFrames={1150}
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
            Look Acte 1 + couche <Partie1Origine>. Legacy B1 (acte2) OFF.
            Retiming V6 (2026-08-06) : couvre maintenant AUSSI JNIM/EIGS (migres du hook vers cette
            partie dans le nouveau texte, cf commentaire SahelActe1-Final ci-dessus). Render utile :
            --frames=1103-2895 (etait 2055-2939 en V5 -- la partie demarre bien plus tot car le
            hook V6 est beaucoup plus compact ; fin=2895=exactement le marker "### PARTIE 2" mesure
            dans narration-v6-full.alignment.json). Jonction jointive verifiee (check-frame-continuity.py)
            avec SahelActe1-Final (debut) et SahelPartie2 (fin). durationInFrames=2940 reste suffisant. */}
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
            Look Acte 1 + couche <Partie2Blocage>. Points rigides sur surfaces fluides.
            durationInFrames étendu 5700→6119 (2026-07-01) puis 6119→7111 (retiming V6 2026-08-06) :
            couvre maintenant jusqu'au marker "### PARTIE 3" (f7111, mesuré directement dans
            narration-v6-full.alignment.json) — jonction jointive 0 trou/0 chevauchement avec
            SahelPartie3, vérifiée par check-frame-continuity.py. Render utile : --frames=2895-7111. */}
        <Composition
          id="SahelPartie2"
          component={SahelWarMapEngine}
          defaultProps={{ partie2: true }}
          durationInFrames={7111}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* PARTIE 3 Sahel — la rupture (AES naît, Kidal repris, Moura, attaques 2026 repoussées).
            Look Acte 1 + couche <Partie3Rupture>. Inversion chromatique : l'avancée FAMa colore en BLEU.
            durationInFrames 9410->10794 (retiming V6 2026-08-06) : F_END recalé sur le nouveau texte/audio
            (marker "### PARTIE 4" mesuré juste après "autre."). Voir Partie3Rupture.tsx tête de fichier. */}
        <Composition
          id="SahelPartie3"
          component={SahelWarMapEngine}
          defaultProps={{ partie3: true }}
          durationInFrames={10794}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* PARTIE 4 Sahel — le coût, le levier, la perspective (DERNIÈRE partie). Look Acte 1 + couche
            <Partie4Cout>. Arc 3 mouvements : coût humain (réfugiés/chiffre) → levier (or/uranium/pétrole) →
            perspective (confédération/CFA/dézoom) → extinction au noir. Render utile : --frames=10432-15019.
            durationInFrames 13500->15019 (retiming V6 2026-08-06) : F_END recalé sur le nouveau texte/audio
            (script V6 réécrit, +~50s vs V5 sur cette dernière partie ; offset audio corrigé +2895, pas
            +3196 — voir Partie4Cout.tsx tête de fichier, MÊME BIAIS probable sur SahelPartie3 à vérifier). */}
        <Composition
          id="SahelPartie4"
          component={SahelWarMapEngine}
          defaultProps={{ partie4: true }}
          durationInFrames={15019}
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

      <Folder name="cacao-chocolat-short">
        <Composition
          id="Cacao-B1Hook"
          component={B1Hook}
          durationInFrames={B1_HOOK_FRAMES}
          fps={B1_HOOK_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="Cacao-B2Source"
          component={B2Source}
          durationInFrames={B2_SOURCE_FRAMES}
          fps={B2_SOURCE_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="Cacao-VergerB3"
          component={VergerPreviewB3}
          durationInFrames={60}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Cacao-VergerReverdit"
          component={VergerPreviewReverdit}
          durationInFrames={60}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Cacao-VergerFissure"
          component={VergerPreviewFissure}
          durationInFrames={60}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Cacao-TabletteMorph0"
          component={TabletteMorphPreview0}
          durationInFrames={30}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Cacao-TabletteMorph1"
          component={TabletteMorphPreview1}
          durationInFrames={30}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Cacao-B3Extraction"
          component={B3Extraction}
          durationInFrames={B3_EXTRACTION_FRAMES}
          fps={B3_EXTRACTION_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="Cacao-B4-Lien"
          component={B4Lien}
          durationInFrames={B4_RENVERSEMENT_FRAMES}
          fps={B4_RENVERSEMENT_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="Cacao-B4-Fade"
          component={B4Fade}
          durationInFrames={B4_RENVERSEMENT_FRAMES}
          fps={B4_RENVERSEMENT_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="Cacao-B5Pont"
          component={B5Pont}
          durationInFrames={B5_PONT_FRAMES}
          fps={B5_PONT_FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="Cacao-B5PontH-16x9"
          component={B5PontH}
          durationInFrames={B5_PONT_H_FRAMES}
          fps={B5_PONT_H_FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="Cacao-ProtoPlanteur-16x9"
          component={ProtoPlanteur}
          durationInFrames={PROTO_PLANTEUR_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="PersoVivant-RecolteAuSol"
          component={RecolteAuSol}
          durationInFrames={RECOLTE_AU_SOL_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="PersoVivant-PasserObjetMainAMain"
          component={PasserObjetMainAMain}
          durationInFrames={PASSER_OBJET_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="RND-8dir-Proto3Quarter"
          component={Proto3Quarter}
          durationInFrames={PASSER3Q_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="RND-8dir-ProtoBack"
          component={ProtoBack}
          durationInFrames={PASSER_BACK_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="RND-8dir-ProtoFace"
          component={ProtoFace}
          durationInFrames={PASSER_FACE_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="RND-8dir-ProtoMultiDirTest"
          component={ProtoMultiDirTest}
          durationInFrames={PASSER_MULTIDIR_TEST_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="RND-8dir-SceneMultiPlanTest"
          component={SceneMultiPlanTest}
          durationInFrames={SCENE_MULTIPLAN_TEST_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Cacao-HistoirePlanteur"
          component={HistoirePlanteur}
          durationInFrames={HISTOIRE_PLANTEUR_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Cacao-ChaineValeur-16x9"
          component={CacaoChaineValeur16x9}
          durationInFrames={CACAO_CHAINE_16X9_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Vox-Papercut-Avion-16x9"
          component={VoxPapercutAvion16x9}
          durationInFrames={VOX_PAPERCUT_AVION_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="RND-DetteFmiMecanismeSVG"
          component={DetteFmiMecanismeSVG}
          durationInFrames={DETTE_FMI_MECANISME_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="GGW-HistoirePlanteurs"
          component={HistoireGGW}
          durationInFrames={HISTOIRE_GGW_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Cacao-FULL"
          component={CacaoChocolatFull}
          durationInFrames={CACAO_FULL_FRAMES}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Cacao-UsineCacao"
          component={UsinePreviewCacao}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Cacao-UsineIvoire"
          component={UsinePreviewIvoire}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Cacao-UsineIvoireDouce"
          component={UsinePreviewIvoireDouce}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Cacao-UsineIvoireDouceChemVerte"
          component={UsinePreviewIvoireDouceChemVerte}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>

      <Composition
        id="Test-LiptakoRevealSVG9x16"
        component={() => {
          const frame = useCurrentFrame();
          return <LiptakoRevealSVG9x16 frame={frame} inAt={0} outAt={700} width={1080} height={1920} fps={30} />;
        }}
        durationInFrames={700}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CtaCard-V"
        component={CtaCard}
        durationInFrames={235}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AES-Short-Part1"
        component={AesShortPart1}
        durationInFrames={1080}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AES-Short-Part2"
        component={AesShortPart2}
        durationInFrames={1680}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AES-Short-Full"
        component={AesShortFull}
        durationInFrames={2802}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Test-ResourcesRevealSVG9x16"
        component={() => {
          const frame = useCurrentFrame();
          return <ResourcesRevealSVG9x16 frame={frame} inAt={0} outAt={790} width={1080} height={1920} fps={30} />;
        }}
        durationInFrames={790}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Duel-KimiK3-vs-GLM"
        component={DuelKimiGlm}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={960}
      />
      <Composition
        id="Blueprint-Derrick-K3"
        component={BlueprintDerrickK3}
        durationInFrames={120}
        fps={30}
        width={1600}
        height={900}
      />
      <Composition
        id="Vision-Kosti-K3"
        component={VisionKostiK3}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Vision-Khartoum-K3"
        component={VisionKhartoumK3}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Kosti Beat 5 en ISOLE (SVG pur, pas de Mapbox) — reproduit Section4 de SoudanActe4 :
          KostiInsertSVG + audio p4 + SFX, F4 en frames locales @30fps. Pour re-render/valider la scene seule. */}
      <Composition
        id="Kosti-Beat5-Standalone"
        component={() => (
          <RAbsoluteFill style={{ backgroundColor: "#d9c092" }}>
            <RAudio src={rStaticFile("_shared/audio/soudan/acte4-voisins-aspires-p4.mp3")} />
            <RSequence from={164} durationInFrames={22}>
              <RAudio src={rStaticFile("_shared/sfx/ui/node-appear.mp3")} volume={0.45} />
            </RSequence>
            <RSequence from={305} durationInFrames={24}>
              <RAudio src={rStaticFile("_shared/sfx/impact/impact.mp3")} volume={0.55} />
            </RSequence>
            <KostiInsertSVG f4={{
              kostiNomme: 164, droneFrappe: 305, stationService: 323,
              civilsEssence: 365, pasCibleMilitaire: 448, civilsPayentPrix: 700, end: 766,
            }} />
          </RAbsoluteFill>
        )}
        durationInFrames={766}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="CfaShort9x16-COMPLET"
        component={CfaShort9x16ShortComplet}
        durationInFrames={CFA_SHORT_TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Proto globe D3 adapte 9:16 pour le Short Soudan (branche feat/soudan-short-9x16).
          Couvre Mouvement A + Pivot + Mouvement B (jusqu'au climax "incendie/main") — la Chute et
          le CTA sont d'autres scenes visuelles (cf timing.ts), pas rendues ici. */}
      <Composition
        id="SoudanShort-GlobeRecit-Proto"
        component={SoudanShortGlobeRecitProto}
        durationInFrames={SOUDAN_SHORT_GLOBE_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Test A/B mouvement camera post-trace (retour Aziz 2026-08-01) — 2 variantes a comparer */}
      <Composition
        id="SoudanShort-GlobeRecit-ZoomVariant"
        component={SoudanShortGlobeZoomVariant}
        durationInFrames={SOUDAN_SHORT_GLOBE_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SoudanShort-GlobeRecit-DriftVariant"
        component={SoudanShortGlobeDriftVariant}
        durationInFrames={SOUDAN_SHORT_GLOBE_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Client-sim Flowdesk — Volet 2A, registre abstrait geometrique (4 panneaux Fable5). */}
      <Composition
        id="Flowdesk-Abstrait-2A"
        component={FlowdeskAbstrait2A}
        durationInFrames={FLOWDESK_ABSTRAIT_FRAMES}
        fps={FLOWDESK_ABSTRAIT_FPS}
        width={1920}
        height={1080}
      />

      {/* Client-sim Flowdesk — V3, refonte semantique (vocabulaire nomme + plein cadre + principes motion design). */}
      <Composition
        id="Flowdesk-Abstrait-V3"
        component={FlowdeskAbstraitV3}
        durationInFrames={FLOWDESK_V3_FRAMES}
        fps={FLOWDESK_V3_FPS}
        width={1920}
        height={1080}
      />

      {/* Client-sim Flowdesk — V4, hybride 2A+2B (clips video personnage integres dans le registre abstrait). */}
      <Composition
        id="Flowdesk-Abstrait-V4"
        component={FlowdeskAbstraitV4}
        durationInFrames={FLOWDESK_V4_FRAMES}
        fps={FLOWDESK_V4_FPS}
        width={1920}
        height={1080}
      />

      {/* Client-sim Flowdesk — Volet 2B, registre personne/emotion (silhouette MiniMax H3). */}
      <Composition
        id="Flowdesk-Personne-2B"
        component={FlowdeskPersonne2B}
        durationInFrames={FLOWDESK_PERSONNE_FRAMES}
        fps={FLOWDESK_PERSONNE_FPS}
        width={1920}
        height={1080}
      />

      {/* Client-sim NorthShield — Ecrans UI dashboard fictifs (reference visuelle avant storyboard). */}
      <Composition
        id="NorthShield-Dashboard-LowRisk"
        component={DashboardLowRiskStill}
        durationInFrames={NS_DASHBOARD_FRAMES}
        fps={NS_DASHBOARD_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="NorthShield-Dashboard-HighRisk"
        component={DashboardHighRiskStill}
        durationInFrames={NS_DASHBOARD_FRAMES}
        fps={NS_DASHBOARD_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="NorthShield-Dashboard-LowRisk-Laptop"
        component={DashboardLowRiskLaptopStill}
        durationInFrames={NS_DASHBOARD_FRAMES}
        fps={NS_DASHBOARD_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="NorthShield-Dashboard-HighRisk-Laptop"
        component={DashboardHighRiskLaptopStill}
        durationInFrames={NS_DASHBOARD_FRAMES}
        fps={NS_DASHBOARD_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="NorthShield-Cursor-Test"
        component={CursorTestComp}
        durationInFrames={NS_CURSOR_TEST_FRAMES}
        fps={NS_CURSOR_TEST_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="NorthShield-V3"
        component={NorthShieldV3}
        durationInFrames={NS_V3_FRAMES}
        fps={NS_V3_FPS}
        width={1920}
        height={1080}
      />

      <Composition
        id="MochIt-P1-Pivot"
        component={P1Pivot}
        durationInFrames={93}
        fps={MI_FPS}
        width={MI_WIDTH}
        height={MI_HEIGHT}
      />
      <Composition
        id="MochIt-P2-Workflow"
        component={P2Workflow}
        durationInFrames={90}
        fps={MI_FPS}
        width={MI_WIDTH}
        height={MI_HEIGHT}
      />
      <Composition
        id="MochIt-P3-Cta"
        component={P3Cta}
        durationInFrames={69}
        fps={MI_FPS}
        width={MI_WIDTH}
        height={MI_HEIGHT}
      />
      <Composition
        id="MochIt-Complete"
        component={MochItComplete}
        durationInFrames={MI_TOTAL_FRAMES}
        fps={MI_TOTAL_FPS}
        width={MI_WIDTH}
        height={MI_HEIGHT}
      />

      {/* PROTOTYPE R&D jetable (2026-08-14) — insert H3 "matière" sur carte. À supprimer si non retenu. */}
      <Composition
        id="Proto-InsertMatiere-Conduite"
        component={ProtoInsertMatiereConduite}
        durationInFrames={PROTO_INSERT_MATIERE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* PROTOTYPE R&D jetable (2026-08-15) — 3 mini-inserts SIMULTANÉS (gisements Sénégal). */}
      <Composition
        id="Proto-TroisGisements-Inserts"
        component={ProtoTroisGisementsInserts}
        durationInFrames={PROTO_TROIS_GISEMENTS_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

    </>
  );
};
