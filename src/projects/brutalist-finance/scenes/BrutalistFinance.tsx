import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  interpolate,
} from "remotion";
import { BrutalistBackground } from "../components/BrutalistBackground";
import { StampText } from "../components/StampText";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { BrutalistBar } from "../components/BrutalistBar";
import { SplitBar } from "../components/SplitBar";
import { BrutalistLineChart } from "../components/BrutalistLineChart";
import { ComparisonBlocks } from "../components/ComparisonBlocks";
import { StickFigure } from "../components/StickFigure";
import { HouseDouble } from "../components/HouseDouble";
import { StrategyPills } from "../components/StrategyPills";
import { GlitchTransition } from "../components/GlitchTransition";
import { AudioLayer } from "../audio/AudioLayer";
import { COLORS, FONTS, SCENE_TIMING, BORDER } from "../config/theme";

// Interest vs Capital curves (25 years, normalized 0-1)
// Capital portion grows over time, interest portion shrinks
// They cross around month 180 (year 15) = x: 0.6
const CAPITAL_CURVE = [
  { x: 0, y: 0.28 },
  { x: 0.1, y: 0.30 },
  { x: 0.2, y: 0.34 },
  { x: 0.3, y: 0.39 },
  { x: 0.4, y: 0.46 },
  { x: 0.5, y: 0.54 },
  { x: 0.6, y: 0.63 },
  { x: 0.7, y: 0.72 },
  { x: 0.8, y: 0.82 },
  { x: 0.9, y: 0.91 },
  { x: 1, y: 0.98 },
];

const INTEREST_CURVE = [
  { x: 0, y: 0.72 },
  { x: 0.1, y: 0.70 },
  { x: 0.2, y: 0.66 },
  { x: 0.3, y: 0.61 },
  { x: 0.4, y: 0.54 },
  { x: 0.5, y: 0.46 },
  { x: 0.6, y: 0.37 },
  { x: 0.7, y: 0.28 },
  { x: 0.8, y: 0.18 },
  { x: 0.9, y: 0.09 },
  { x: 1, y: 0.02 },
];

export const BrutalistFinance: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Screen shake at mecanisme start
  const shakeActive =
    frame >= SCENE_TIMING.mecanismeStart &&
    frame < SCENE_TIMING.mecanismeStart + 6;
  const shakeX = shakeActive ? Math.sin(frame * 9) * 4 : 0;
  const shakeY = shakeActive ? Math.cos(frame * 7) * 3 : 0;

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* AUDIO */}
      <AudioLayer />

      {/* ACT 1: HOOK (0-520 / 17.3s) */}
      <Sequence from={SCENE_TIMING.hookStart} durationInFrames={SCENE_TIMING.hookEnd - SCENE_TIMING.hookStart}>
        <HookAct />
      </Sequence>

      {/* GLITCH: Hook -> Setup */}
      <GlitchTransition startFrame={SCENE_TIMING.hookEnd - 2} durationFrames={3} intensity={14} />

      {/* ACT 2: SETUP (520-1620 / 36.7s) */}
      <Sequence from={SCENE_TIMING.setupStart} durationInFrames={SCENE_TIMING.setupEnd - SCENE_TIMING.setupStart}>
        <SetupAct />
      </Sequence>

      {/* GLITCH: Setup -> Mecanisme */}
      <GlitchTransition startFrame={SCENE_TIMING.setupEnd - 2} durationFrames={3} intensity={16} />

      {/* ACT 3: MECANISME (1620-2820 / 40s) */}
      <Sequence from={SCENE_TIMING.mecanismeStart} durationInFrames={SCENE_TIMING.mecanismeEnd - SCENE_TIMING.mecanismeStart}>
        <MecanismeAct />
      </Sequence>

      {/* GLITCH: Mecanisme -> Reveal */}
      <GlitchTransition startFrame={SCENE_TIMING.mecanismeEnd - 2} durationFrames={3} intensity={18} />

      {/* ACT 4: REVEAL + CTA (2820-4220 / 46.7s) */}
      <Sequence from={SCENE_TIMING.revealCtaStart} durationInFrames={SCENE_TIMING.revealCtaEnd - SCENE_TIMING.revealCtaStart}>
        <RevealCtaAct />
      </Sequence>
    </div>
  );
};

// ==================== ACT 1: HOOK (17.3s / 520 frames) ====================
// Noir pur, rouge signal, choc immediat
const HookAct: React.FC = () => {
  const frame = useCurrentFrame();

  // Black pulse at frame ~480 (teaser before transition)
  const pulseOpacity =
    frame >= 480 && frame < 484
      ? interpolate(frame, [480, 482, 484], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <BrutalistBackground color={COLORS.bgHook} />

      {/* Content centered */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          zIndex: 5,
        }}
      >
        {/* "x1.8" - massive red stamp */}
        <StampText
          text="x1.8"
          startFrame={30}
          fontSize={140}
          color={COLORS.red}
          fontFamily={FONTS.mono}
          offsetShadow
          shadowColor="rgba(230, 57, 70, 0.3)"
        />

        <div style={{ height: 32 }} />

        {/* Counter: 300 000 -> 540 000 */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
          <AnimatedCounter
            startValue={300000}
            endValue={300000}
            startFrame={60}
            durationFrames={1}
            suffix=" EUR"
            color={COLORS.white}
            fontSize={48}
          />
          <StampText
            text="--->"
            startFrame={90}
            fontSize={36}
            color={COLORS.textMuted}
            fontWeight={400}
            fontFamily={FONTS.mono}
            uppercase={false}
          />
          <AnimatedCounter
            startValue={300000}
            endValue={540000}
            startFrame={100}
            durationFrames={60}
            suffix=" EUR"
            color={COLORS.red}
            fontSize={64}
          />
        </div>

        <div style={{ height: 48 }} />

        {/* "Presque... le double." */}
        <StampText
          text="Presque le double."
          startFrame={200}
          fontSize={32}
          color={COLORS.textMuted}
          fontWeight={400}
          uppercase={false}
          letterSpacing={0}
        />

        <div style={{ height: 64 }} />

        {/* "PAGE 47. POLICE TAILLE 8." */}
        <StampText
          text="Page 47. Police taille 8."
          startFrame={350}
          fontSize={28}
          color={COLORS.white}
          fontFamily={FONTS.mono}
          fontWeight={400}
        />

        <div style={{ height: 16 }} />

        <StampText
          text="T'as juste pas regarde."
          startFrame={420}
          fontSize={24}
          color={COLORS.textMuted}
          fontWeight={400}
          uppercase={false}
          letterSpacing={0}
        />
      </div>

      {/* Black pulse overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: COLORS.black,
          opacity: pulseOpacity,
          zIndex: 10,
        }}
      />
    </div>
  );
};

// ==================== ACT 2: SETUP (36.7s / 1100 frames) ====================
// Bleute, calme trompeur, presentation Thomas
const SetupAct: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <BrutalistBackground color={COLORS.bgSetup} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          padding: "60px 80px",
          zIndex: 5,
        }}
      >
        {/* Thomas presentation */}
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <StickFigure
            startFrame={15}
            size={120}
            color={COLORS.white}
            strokeColor={COLORS.blue}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <StampText
              text="Thomas"
              startFrame={15}
              fontSize={56}
              color={COLORS.white}
            />
            {/* Profile data blocks */}
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { label: "34 ans", frame: 30 },
                { label: "62K/an", frame: 38 },
                { label: "1 enfant", frame: 46 },
              ].map((item) => (
                <div key={item.label}>
                  {frame >= item.frame && (
                    <div
                      style={{
                        fontFamily: FONTS.mono,
                        fontSize: 18,
                        fontWeight: 700,
                        color: COLORS.blue,
                        border: `${BORDER.width}px ${BORDER.style} ${COLORS.blue}`,
                        padding: "8px 16px",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      {item.label}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ height: 48 }} />

        {/* Loan details */}
        <StampText
          text="320 000 EUR | 25 ans | 3.5%"
          startFrame={120}
          fontSize={36}
          color={COLORS.white}
          fontFamily={FONTS.mono}
        />

        <div style={{ height: 32 }} />

        {/* Monthly payment bar */}
        <StampText
          text="Mensualite"
          startFrame={240}
          fontSize={18}
          color={COLORS.textMuted}
          fontFamily={FONTS.mono}
        />
        <div style={{ height: 8 }} />
        <BrutalistBar
          value={1600}
          maxValue={3800}
          startFrame={260}
          width={700}
          height={56}
          fillColor={COLORS.blue}
          label=""
          suffix=" EUR/mois"
        />

        <div style={{ height: 24 }} />

        {/* Salary context bar */}
        <StampText
          text="Salaire net"
          startFrame={360}
          fontSize={18}
          color={COLORS.textMuted}
          fontFamily={FONTS.mono}
        />
        <div style={{ height: 8 }} />
        <BrutalistBar
          value={3800}
          maxValue={3800}
          startFrame={380}
          width={700}
          height={56}
          fillColor={COLORS.white}
          borderColor={COLORS.white}
          suffix=" EUR"
        />

        <div style={{ height: 24 }} />

        {/* 42% taux d'effort */}
        <StampText
          text="42%"
          startFrame={480}
          fontSize={72}
          color={COLORS.blue}
          fontFamily={FONTS.mono}
          offsetShadow
          shadowColor="rgba(0, 102, 255, 0.2)"
        />
        <StampText
          text="Taux d'effort"
          startFrame={500}
          fontSize={18}
          color={COLORS.textMuted}
          fontFamily={FONTS.mono}
        />

        <div style={{ height: 48 }} />

        {/* "SIGNE." - red stamp */}
        <div style={{ alignSelf: "center" }}>
          <StampText
            text="Signe."
            startFrame={600}
            fontSize={80}
            color={COLORS.red}
            offsetShadow
            shadowColor="rgba(230, 57, 70, 0.3)"
          />
        </div>

        <div style={{ height: 48 }} />

        {/* "COUT TOTAL DU CREDIT" - starts small, zooms */}
        {frame >= 850 && (
          <div style={{ alignSelf: "center" }}>
            <CoutTotalZoom startFrame={850} />
          </div>
        )}
      </div>
    </div>
  );
};

// Zoom text helper for "COUT TOTAL DU CREDIT"
const CoutTotalZoom: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const relFrame = frame - startFrame;

  const fontSize = interpolate(relFrame, [0, 30], [14, 72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(relFrame, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        fontFamily: FONTS.display,
        fontSize,
        fontWeight: 700,
        color: COLORS.yellow,
        textTransform: "uppercase",
        letterSpacing: 3,
        opacity,
      }}
    >
      Cout total du credit
    </div>
  );
};

// ==================== ACT 3: MECANISME (40s / 1200 frames) ====================
// Rougeatre, colere, les interets mangent le capital
const MecanismeAct: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <BrutalistBackground color={COLORS.bgMecanisme} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          padding: "50px 80px",
          zIndex: 5,
        }}
      >
        {/* "ARNAQUE" barre / "MECANISME" */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <StampText
            text="Arnaque"
            startFrame={15}
            fontSize={48}
            color={COLORS.textMuted}
            strikethrough
          />
          <StampText
            text="Mecanisme"
            startFrame={30}
            fontSize={48}
            color={COLORS.red}
          />
        </div>

        <div style={{ height: 40 }} />

        {/* Split bar: 1600 EUR -> Capital 670 + Interets 930 */}
        <StampText
          text="Mois 1 : 1 600 EUR"
          startFrame={120}
          fontSize={28}
          color={COLORS.white}
          fontFamily={FONTS.mono}
        />
        <div style={{ height: 16 }} />
        <SplitBar
          totalValue={1600}
          splitValues={[670, 930]}
          splitColors={[COLORS.blue, COLORS.red]}
          splitLabels={["Capital: 670 EUR", "Interets: 930 EUR"]}
          startFrame={150}
          splitFrame={240}
          width={700}
          height={64}
          borderColor={COLORS.red}
        />

        <div style={{ height: 16 }} />

        {/* "58% POUR LA BANQUE" */}
        <StampText
          text="58% pour la banque"
          startFrame={340}
          fontSize={42}
          color={COLORS.red}
          fontFamily={FONTS.mono}
          offsetShadow
          shadowColor="rgba(230, 57, 70, 0.25)"
        />

        <div style={{ height: 48 }} />

        {/* Line chart: Interets vs Capital sur 25 ans */}
        <StampText
          text="Interets vs Capital - 25 ans"
          startFrame={420}
          fontSize={18}
          color={COLORS.textMuted}
          fontFamily={FONTS.mono}
        />
        <div style={{ height: 8 }} />
        <BrutalistLineChart
          data={CAPITAL_CURVE}
          secondaryData={INTEREST_CURVE}
          startFrame={440}
          width={800}
          height={280}
          color={COLORS.blue}
          secondaryColor={COLORS.red}
          xLabels={["An 1", "An 5", "An 10", "An 15", "An 20", "An 25"]}
          yLabels={["0", "400", "800", "1 200", "1 600"]}
          borderColor={COLORS.red}
          drawDuration={90}
        />

        <div style={{ height: 16 }} />

        {/* "15 ans" callout */}
        <StampText
          text="15 ans avant croisement"
          startFrame={580}
          fontSize={28}
          color={COLORS.yellow}
          fontFamily={FONTS.mono}
        />

        <div style={{ height: 48 }} />

        {/* Cumulated interest counter */}
        <StampText
          text="Interets cumules"
          startFrame={750}
          fontSize={18}
          color={COLORS.textMuted}
          fontFamily={FONTS.mono}
        />
        <div style={{ height: 8 }} />
        <AnimatedCounter
          startValue={0}
          endValue={256000}
          startFrame={770}
          durationFrames={70}
          suffix=" EUR"
          color={COLORS.red}
          fontSize={80}
        />

        <div style={{ height: 32 }} />

        <StampText
          text="Ca s'accumule. Silencieusement."
          startFrame={900}
          fontSize={28}
          color={COLORS.textMuted}
          fontWeight={400}
          uppercase={false}
          letterSpacing={0}
        />
      </div>
    </div>
  );
};

// ==================== ACT 4: REVEAL + CTA (46.7s / 1400 frames) ====================
// Phase 1 (0-950): Fond rouge, revelation
// Phase 2 (950-1400): Fond blanc, CTA
const RevealCtaAct: React.FC = () => {
  const frame = useCurrentFrame();

  const isCtaPhase = frame >= 950;
  const bgColor = isCtaPhase ? COLORS.bgCta : COLORS.bgReveal;
  const textColor = isCtaPhase ? COLORS.textDark : COLORS.white;

  // Pulse on "80%" - 2 frame shake
  const shakePercent = frame >= 750 && frame < 754;
  const percentShakeX = shakePercent ? Math.sin(frame * 11) * 3 : 0;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <BrutalistBackground color={bgColor} />

      {/* REVEAL PHASE */}
      {!isCtaPhase && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "50px 80px",
            zIndex: 5,
          }}
        >
          {/* "576 000 EUR" - massive stamp */}
          <AnimatedCounter
            startValue={320000}
            endValue={576000}
            startFrame={30}
            durationFrames={60}
            suffix=" EUR"
            color={COLORS.white}
            fontSize={110}
          />

          <div style={{ height: 40 }} />

          {/* Comparison blocks */}
          <ComparisonBlocks
            items={[
              {
                label: "Emprunte",
                value: "320 000 EUR",
                bgColor: "transparent",
                textColor: COLORS.white,
                borderColor: COLORS.white,
              },
              {
                label: "Rembourse",
                value: "576 000 EUR",
                bgColor: COLORS.yellow,
                textColor: COLORS.textDark,
                borderColor: COLORS.textDark,
              },
            ]}
            startFrame={150}
            delay={15}
            blockWidth={360}
            blockHeight={160}
          />

          <div style={{ height: 40 }} />

          {/* "256 000 EUR" - interest total */}
          <StampText
            text="256 000 EUR d'interets purs"
            startFrame={300}
            fontSize={42}
            color={COLORS.yellow}
            fontFamily={FONTS.mono}
          />

          <div style={{ height: 48 }} />

          {/* House double metaphor */}
          <div style={{ alignSelf: "center" }}>
            <HouseDouble
              startFrame={380}
              splitFrame={450}
              size={180}
              realColor={COLORS.white}
              ghostColor={COLORS.yellow}
              strokeWidth={BORDER.width}
            />
          </div>

          <div style={{ height: 24 }} />

          <StampText
            text="Tu paies presque une deuxieme maison"
            startFrame={520}
            fontSize={28}
            color={COLORS.white}
            fontWeight={400}
            uppercase={false}
            letterSpacing={0}
          />

          <div style={{ height: 48 }} />

          {/* "80%" with shake */}
          <div style={{ transform: `translateX(${percentShakeX}px)` }}>
            <StampText
              text="80%"
              startFrame={750}
              fontSize={120}
              color={COLORS.yellow}
              fontFamily={FONTS.mono}
              offsetShadow
              shadowColor="rgba(0, 0, 0, 0.4)"
            />
          </div>
          <StampText
            text="du montant emprunte"
            startFrame={770}
            fontSize={24}
            color={COLORS.white}
            fontFamily={FONTS.mono}
          />
        </div>
      )}

      {/* CTA PHASE - fond blanc */}
      {isCtaPhase && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "50px 80px",
            zIndex: 5,
          }}
        >
          {/* Strategy pills */}
          <StrategyPills
            pills={[
              { label: "Renegociation", bgColor: COLORS.blue, textColor: COLORS.white },
              { label: "Anticipe", bgColor: COLORS.blue, textColor: COLORS.white },
              { label: "Apport", bgColor: COLORS.blue, textColor: COLORS.white },
            ]}
            startFrame={30}
            delay={12}
            fontSize={28}
          />

          <div style={{ height: 48 }} />

          {/* Key message */}
          <div
            style={{
              border: `${BORDER.width}px ${BORDER.style} ${COLORS.yellow}`,
              padding: "24px 48px",
            }}
          >
            <StampText
              text="Cout total > Mensualite"
              startFrame={100}
              fontSize={48}
              color={COLORS.textDark}
              fontFamily={FONTS.mono}
            />
          </div>

          <div style={{ height: 32 }} />

          <StampText
            text="C'est CA qu'il faut regarder."
            startFrame={160}
            fontSize={28}
            color={COLORS.textDark}
            fontWeight={400}
            uppercase={false}
            letterSpacing={0}
          />

          <div style={{ height: 64 }} />

          {/* Subscribe button - brutal rectangle */}
          {frame >= 1150 && (
            <SubscribeButton startFrame={1150} />
          )}

          <div style={{ height: 24 }} />

          {/* Disclaimer */}
          <StampText
            text="Ceci n'est pas un conseil financier"
            startFrame={1250}
            fontSize={16}
            color={COLORS.textMuted}
            fontWeight={400}
            fontFamily={FONTS.mono}
            uppercase={false}
            letterSpacing={0}
          />
        </div>
      )}
    </div>
  );
};

// Subscribe button with subtle pulse
const SubscribeButton: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const relFrame = frame - startFrame;

  const pulseOpacity = 0.85 + Math.sin(relFrame * 0.1) * 0.15;

  return (
    <div
      style={{
        backgroundColor: COLORS.red,
        border: `${BORDER.width}px ${BORDER.style} ${COLORS.textDark}`,
        padding: "20px 64px",
        opacity: pulseOpacity,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 28,
          fontWeight: 700,
          color: COLORS.white,
          textTransform: "uppercase",
          letterSpacing: 3,
        }}
      >
        S'abonner
      </div>
    </div>
  );
};
