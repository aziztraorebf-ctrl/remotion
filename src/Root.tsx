import { Composition, Folder } from "remotion";
import { CarouselSouverain, CarouselSouverainProps } from "./projects/_shared/components/layouts/CarouselSouverain";
import { CAROUSELS } from "./projects/souverain/carousels/carousel-data";
import { Beat0Hook } from "./projects/souverain/maroc-batteries/beats/Beat0Hook";
import { Beat1Phosphate } from "./projects/souverain/maroc-batteries/beats/Beat1Phosphate";
import { Beat3bMapClean } from "./projects/souverain/carousels/hybrid/Beat3bMapClean";
import { Beat1HookClean } from "./projects/souverain/carousels/hybrid/Beat1HookClean";
import { CurveChartClean } from "./projects/souverain/carousels/hybrid/CurveChartClean";
import { GhanaMapClean } from "./projects/souverain/carousels/hybrid/GhanaMapClean";
import { AfriqueOuestMapClean } from "./projects/souverain/carousels/hybrid/AfriqueOuestMapClean";
import { CarouselSlideHybrid } from "./projects/souverain/carousels/hybrid/CarouselSlideHybrid";
import { CarouselCtaSlide } from "./projects/souverain/carousels/hybrid/CarouselCtaSlide";
import { SEGMENTS as MAROC_SEGMENTS } from "./projects/souverain/maroc-batteries/timing";
import { BlankComposition } from "./BlankComposition";
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
import { Beat1Hook as P1347_Beat1Hook } from "./projects/atlas/peste-1347/Beat1Hook";
import { Beat2Setup } from "./projects/atlas/peste-1347/Beat2Setup";
import { Beat3Densite } from "./projects/atlas/peste-1347/Beat3Densite";
import { Beat4Climax } from "./projects/atlas/peste-1347/Beat4Climax";
import { Beat5MaliVivant } from "./projects/atlas/peste-1347/Beat5MaliVivant";
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
import { Beat0Accroche as SenegalBeat0 } from "./projects/souverain/senegal-petrole-gaz/beats/Beat0Accroche";
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
import { MapboxOverlayLab, MAPBOX_OVERLAY_LAB_FRAMES } from "./projects/_shared/mapbox/MapboxOverlayLab";
import { MapboxOverlayLabV2, MAPBOX_OVERLAY_LAB_V2_FRAMES } from "./projects/_shared/mapbox/MapboxOverlayLabV2";
import { MapboxLottieShowcase, MAPBOX_LOTTIE_SHOWCASE_FRAMES } from "./projects/_shared/mapbox/MapboxLottieShowcase";
import { PetrolePatience, PETROLE_PATIENCE_FRAMES } from "./projects/_demos/petrole-patience/PetrolePatience";
import { PetrolePatienceShort, PETROLE_PATIENCE_SHORT_FRAMES } from "./projects/_demos/petrole-patience/PetrolePatienceShort";
import { AfriqueNumeriqueShort, AFRIQUE_NUMERIQUE_SHORT_FRAMES } from "./projects/_demos/afrique-numerique/AfriqueNumeriqueShort";
import { CobaltRDCShort, COBALT_RDC_SHORT_FRAMES } from "./projects/_demos/cobalt-rdc/CobaltRDCShort";
import { LAnomalieMontreal, ANOMALIE_MONTREAL_FRAMES } from "./projects/_demos/anomalie-montreal/LAnomalieMontreal";
import { ThumbnailBaril } from "./projects/_demos/petrole-patience/ThumbnailBaril";
import { ThumbnailNiger } from "./projects/_demos/niger-uranium/ThumbnailNiger";
import { ThumbnailMansa } from "./projects/_demos/mansa-moussa/ThumbnailMansa";
import { ThumbnailSonjataDemo } from "./projects/_demos/sonjata/ThumbnailSonjataDemo";

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
            durationInFrames={1095}
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
        <Composition id="Layout16-LaCalebasse" component={() => <LaCalebasse />} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="Layout16-LeCadranSolaire" component={() => <LeCadranSolaire />} durationInFrames={270} fps={30} width={1920} height={1080} />
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
          durationInFrames={270}
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
          durationInFrames={270}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-Stratigraphie"
          component={Stratigraphie}
          durationInFrames={270}
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
          durationInFrames={270}
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
          durationInFrames={270}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-Palimpseste"
          component={Palimpseste}
          durationInFrames={270}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-ArbreAPalabres"
          component={ArbreAPalabres}
          durationInFrames={270}
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

    </>
  );
};
