import { Composition, Folder } from "remotion";
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
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
      </Folder>

      

      
    </>
  );
};
