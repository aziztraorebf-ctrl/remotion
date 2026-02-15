import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Sequence,
} from "remotion";
import { GridBackground } from "../components/GridBackground";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { AnimatedBar } from "../components/AnimatedBar";
import { ComparisonChart } from "../components/ComparisonChart";
import { LineChart } from "../components/LineChart";
import { DonutChart } from "../components/DonutChart";
import { FadeText } from "../components/FadeText";
import { COLORS } from "../config/theme";
import { AudioLayer } from "../audio/AudioLayer";
import { ParticleField } from "../components/ParticleField";
import { HouseShrink } from "../components/HouseShrink";
import { MoneyFlow } from "../components/MoneyFlow";
import { CinematicBackground } from "../components/CinematicBackground";
import { Hourglass } from "../components/Hourglass";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

// Interest growth curve data (25 years, showing exponential cost)
const INTEREST_CURVE = [
  { x: 0, y: 0 },
  { x: 0.08, y: 0.04 },
  { x: 0.16, y: 0.09 },
  { x: 0.24, y: 0.15 },
  { x: 0.32, y: 0.22 },
  { x: 0.4, y: 0.30 },
  { x: 0.48, y: 0.39 },
  { x: 0.56, y: 0.49 },
  { x: 0.64, y: 0.58 },
  { x: 0.72, y: 0.67 },
  { x: 0.8, y: 0.76 },
  { x: 0.88, y: 0.86 },
  { x: 0.96, y: 0.94 },
  { x: 1, y: 1 },
];

export const DataVizExplainer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // === ACT 1: HOOK (0-150 frames / 0-5s) ===
  // Big number that grabs attention

  // === ACT 2: THE SETUP (150-750 frames / 5-25s) ===
  // Show the loan, monthly payments look reasonable

  // === ACT 3: THE REVEAL (750-1350 frames / 25-45s) ===
  // Show the REAL cost with dramatic data viz

  // === ACT 4: CTA (1350-1800 frames / 45-60s) ===
  // Summary + call to action

  // Screen shake at reveal moment (act 3 starts at 980)
  const shakeActive = frame >= 980 && frame <= 1020;
  const shakeX = shakeActive ? Math.sin(frame * 7) * 3 : 0;
  const shakeY = shakeActive ? Math.cos(frame * 5) * 2 : 0;

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        fontFamily,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
        overflow: "hidden",
      }}
    >
      <GridBackground />

      {/* ===================== AUDIO ===================== */}
      <AudioLayer />

      {/* ===================== ACT 1: HOOK (0-250 / 8.3s) ===================== */}
      <Sequence from={0} durationInFrames={250}>
        <HookAct />
      </Sequence>

      {/* ===================== ACT 2: SETUP (250-980 / 24.3s) ===================== */}
      <Sequence from={250} durationInFrames={730}>
        <SetupAct />
      </Sequence>

      {/* ===================== ACT 3: REVEAL (980-1560 / 19.3s) ===================== */}
      <Sequence from={980} durationInFrames={580}>
        <RevealAct />
      </Sequence>

      {/* ===================== ACT 4: CTA (1560-2100 / 18s) ===================== */}
      <Sequence from={1560} durationInFrames={540}>
        <CtaAct />
      </Sequence>
    </div>
  );
};

// ---------- ACT 1: HOOK (7.5 seconds / 225 frames) ----------
// Dark, tense, almost noir - immediate tension
const HookAct: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Flash effect
  const flashOpacity =
    frame < 10 ? interpolate(frame, [0, 5, 10], [0, 0.4, 0]) : 0;

  // Pulsing vignette that tightens
  const vignetteSize = interpolate(frame, [0, 150], [80, 50], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
      }}
    >
      {/* Dark cinematic background */}
      <CinematicBackground
        startFrame={0}
        fromColor="#050510"
        toColor="#0a0515"
        transitionFrames={60}
        vignetteIntensity={0.8}
      />

      {/* Sparse, slow particles - ominous feeling */}
      <ParticleField
        count={15}
        color="rgba(255, 71, 87, 0.3)"
        direction="down"
        startFrame={5}
        maxOpacity={0.5}
      />

      {/* Flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: COLORS.red,
          opacity: flashOpacity,
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 5,
        }}
      >
        <FadeText
          text="TON CREDIT IMMOBILIER"
          startFrame={5}
          fontSize={18}
          color={COLORS.textSecondary}
          fontWeight={600}
          letterSpacing={6}
          uppercase
        />

        <div style={{ height: 20 }} />

        <FadeText
          text="te coute presque le DOUBLE."
          startFrame={25}
          fontSize={52}
          color={COLORS.textPrimary}
          fontWeight={800}
          letterSpacing={-1}
          glowColor={COLORS.redGlow}
        />

        <div style={{ height: 30 }} />

        {/* The big multiplier */}
        {frame >= 55 && (
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
            }}
          >
            <FadeText
              text="x1.8"
              startFrame={55}
              fontSize={140}
              color={COLORS.red}
              fontWeight={900}
              letterSpacing={-3}
              glowColor={COLORS.redGlow}
            />
          </div>
        )}

        <div style={{ height: 20 }} />

        <FadeText
          text="Voici comment."
          startFrame={120}
          fontSize={22}
          color={COLORS.textMuted}
          fontWeight={500}
        />
      </div>

      {/* Tightening vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse ${vignetteSize}% ${vignetteSize}% at 50% 50%, transparent 0%, rgba(0,0,0,0.9) 100%)`,
          zIndex: 3,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

// ---------- ACT 2: SETUP (20 seconds / 600 frames) ----------
// Calm, blue tones - false sense of security, then hourglass draining
const SetupAct: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Background shifts from calm blue to slightly warmer as tension builds
  const tensionProgress = interpolate(frame, [0, 500], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
      }}
    >
      {/* Background: calm blue that slowly warms */}
      <CinematicBackground
        startFrame={0}
        fromColor="#080d1a"
        toColor="#0f0d18"
        transitionFrames={400}
        vignetteIntensity={0.5}
      />

      {/* Calm blue particles - slow, sparse */}
      <ParticleField
        count={20}
        color="rgba(52, 152, 255, 0.3)"
        direction="up"
        startFrame={0}
        maxOpacity={0.4}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          zIndex: 5,
          padding: "50px 80px",
        }}
      >
        {/* Left side: data viz content (70%) */}
        <div
          style={{
            flex: 7,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FadeText
            text="LE SCENARIO"
            startFrame={10}
            fontSize={14}
            color={COLORS.blue}
            fontWeight={700}
            letterSpacing={4}
            uppercase
          />

          <div style={{ height: 24 }} />

          {/* Key figures in cards */}
          <div
            style={{
              display: "flex",
              gap: 36,
              marginBottom: 30,
            }}
          >
            <StatCard
              label="Montant emprunte"
              startFrame={30}
              color={COLORS.green}
            >
              <AnimatedCounter
                startValue={0}
                endValue={340000}
                startFrame={35}
                durationFrames={40}
                suffix=" EUR"
                color={COLORS.green}
                fontSize={40}
              />
            </StatCard>

            <StatCard label="Duree" startFrame={50} color={COLORS.blue}>
              <AnimatedCounter
                startValue={0}
                endValue={25}
                startFrame={55}
                durationFrames={30}
                suffix=" ans"
                color={COLORS.blue}
                fontSize={40}
              />
            </StatCard>

            <StatCard label="Taux" startFrame={70} color={COLORS.gold}>
              <FadeText
                text="3.5%"
                startFrame={75}
                fontSize={40}
                color={COLORS.gold}
                fontWeight={800}
              />
            </StatCard>
          </div>

          {/* Monthly payment */}
          <FadeText
            text="MENSUALITE"
            startFrame={120}
            fontSize={13}
            color={COLORS.textMuted}
            fontWeight={600}
            letterSpacing={3}
            uppercase
          />
          <div style={{ height: 8 }} />
          <AnimatedCounter
            startValue={0}
            endValue={1715}
            startFrame={130}
            durationFrames={40}
            suffix=" EUR/mois"
            color={COLORS.green}
            fontSize={52}
          />

          <div style={{ height: 12 }} />

          <FadeText
            text="Ca a l'air raisonnable..."
            startFrame={200}
            fontSize={18}
            color={COLORS.textSecondary}
            fontWeight={400}
          />

          {/* Interest accumulation line chart */}
          <div style={{ marginTop: 24 }}>
            <LineChart
              data={INTEREST_CURVE}
              startFrame={300}
              width={560}
              height={180}
              color={COLORS.red}
              title="INTERETS ACCUMULES"
              xLabels={["An 1", "An 5", "An 10", "An 15", "An 20", "An 25"]}
              yLabels={["0", "68K", "136K", "204K", "272K"]}
              showDots={false}
            />
          </div>
        </div>

        {/* Right side: hourglass metaphor (30%) */}
        <div
          style={{
            flex: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {frame >= 240 && (
            <Hourglass
              startFrame={250}
              durationFrames={320}
              size={110}
            />
          )}

          {/* "Mais regarde..." text near hourglass */}
          {frame >= 350 && (
            <div style={{ marginTop: 20 }}>
              <FadeText
                text="Chaque mois..."
                startFrame={350}
                fontSize={14}
                color={COLORS.textMuted}
                fontWeight={500}
              />
            </div>
          )}
          {frame >= 400 && (
            <FadeText
              text="la banque prend sa part."
              startFrame={400}
              fontSize={14}
              color={COLORS.red}
              fontWeight={600}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// ---------- ACT 3: REVEAL (17.5 seconds / 525 frames) ----------
// Cinematic reveal: background shifts, metaphors + data viz combined
const RevealAct: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Phase 1 (0-120): Title + big comparison counters
  // Phase 2 (120-280): House metaphor + money flow
  // Phase 3 (280-420): Donut chart + bars
  // Phase 4 (420-525): Punchline + damage numbers

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
      }}
    >
      {/* Cinematic background - shifts from dark blue to dark red */}
      <CinematicBackground
        startFrame={0}
        fromColor={COLORS.bgPrimary}
        toColor="#1a0508"
        transitionFrames={90}
        vignetteIntensity={0.6}
      />

      {/* Red particles rising - appear with the reveal */}
      <ParticleField
        count={35}
        color="rgba(255, 71, 87, 0.5)"
        direction="up"
        startFrame={10}
        maxOpacity={0.8}
      />

      {/* Content layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 80px",
          zIndex: 5,
        }}
      >
        {/* ---- PHASE 1: Title + Numbers ---- */}
        <FadeText
          text="LA REALITE"
          startFrame={10}
          fontSize={16}
          color={COLORS.red}
          fontWeight={700}
          letterSpacing={6}
          uppercase
          glowColor={COLORS.redGlow}
        />

        <div style={{ height: 24 }} />

        {/* The big comparison */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 60,
            marginBottom: 20,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <FadeText
              text="EMPRUNTE"
              startFrame={30}
              fontSize={12}
              color={COLORS.textMuted}
              letterSpacing={3}
              uppercase
              fontWeight={600}
            />
            <div style={{ height: 8 }} />
            <AnimatedCounter
              startValue={0}
              endValue={340000}
              startFrame={35}
              durationFrames={30}
              suffix=" EUR"
              color={COLORS.green}
              fontSize={46}
            />
          </div>

          <FadeText
            text="--->"
            startFrame={70}
            fontSize={36}
            color={COLORS.textMuted}
            fontWeight={300}
          />

          <div style={{ textAlign: "center" }}>
            <FadeText
              text="REMBOURSE"
              startFrame={80}
              fontSize={12}
              color={COLORS.textMuted}
              letterSpacing={3}
              uppercase
              fontWeight={600}
            />
            <div style={{ height: 8 }} />
            <AnimatedCounter
              startValue={340000}
              endValue={612000}
              startFrame={90}
              durationFrames={50}
              suffix=" EUR"
              color={COLORS.red}
              fontSize={46}
            />
          </div>
        </div>

        {/* ---- PHASE 2: Visual metaphor - house shrinks, money flows to bank ---- */}
        {frame >= 120 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
              marginBottom: 10,
              position: "relative",
              width: "100%",
              height: 180,
            }}
          >
            <HouseShrink
              startFrame={125}
              shrinkFrame={160}
              interestRatio={0.8}
            />
          </div>
        )}

        {/* Money flying to bank - starts during house shrink */}
        {frame >= 150 && (
          <MoneyFlow
            startFrame={155}
            count={10}
            sourceX={500}
            sourceY={520}
            targetX={1450}
            targetY={380}
          />
        )}

        {/* ---- PHASE 3: Donut + bars (data viz part) ---- */}
        {frame >= 260 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 50,
            }}
          >
            <DonutChart
              segments={[
                { value: 340, color: COLORS.green, label: "Capital" },
                { value: 272, color: COLORS.red, label: "Interets" },
              ]}
              startFrame={265}
              size={190}
              strokeWidth={24}
              centerText="612K"
              centerSubText="COUT TOTAL"
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <AnimatedBar
                value={340}
                maxValue={612}
                startFrame={290}
                color={COLORS.green}
                label="CAPITAL REMBOURSE"
                suffix=" K EUR"
                width={380}
                height={32}
              />
              <AnimatedBar
                value={272}
                maxValue={612}
                startFrame={310}
                color={COLORS.red}
                label="INTERETS PAYES A LA BANQUE"
                suffix=" K EUR"
                width={380}
                height={32}
              />
            </div>
          </div>
        )}

        {/* ---- PHASE 4: Punchline ---- */}
        <div style={{ height: 20 }} />

        <FadeText
          text="+272 000 EUR d'interets = 80% du montant initial"
          startFrame={380}
          fontSize={22}
          color={COLORS.orange}
          fontWeight={700}
          glowColor="rgba(255, 159, 67, 0.25)"
        />

        {/* Damage numbers floating up from bottom */}
        {frame >= 400 &&
          Array.from({ length: 8 }, (_, i) => {
            const startF = 400 + i * 5;
            const relF = frame - startF;
            if (relF < 0 || relF > 40) return null;
            const x = 200 + i * 180 + Math.sin(i * 3.7) * 50;
            const y = interpolate(relF, [0, 40], [height - 50, height - 300]);
            const opacity = interpolate(
              relF,
              [0, 6, 30, 40],
              [0, 0.7, 0.7, 0]
            );
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  fontSize: 16,
                  fontWeight: 700,
                  color: COLORS.red,
                  opacity,
                  zIndex: 20,
                  fontVariantNumeric: "tabular-nums",
                  textShadow: `0 0 8px ${COLORS.redGlow}`,
                }}
              >
                -{(5000 + i * 9000).toLocaleString("fr-FR")} EUR
              </div>
            );
          })}
      </div>
    </div>
  );
};

// ---------- ACT 4: CTA (15 seconds / 450 frames) ----------
// Warm, hopeful - shift from red to green/gold, solutions exist
const CtaAct: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const ctaPulse = frame > 200 ? 0.6 + Math.sin(frame * 0.08) * 0.4 : 0;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
      }}
    >
      {/* Background: dark red -> warm dark green (hope) */}
      <CinematicBackground
        startFrame={0}
        fromColor="#150808"
        toColor="#081510"
        transitionFrames={120}
        vignetteIntensity={0.5}
      />

      {/* Green/gold particles - rising, hopeful */}
      <ParticleField
        count={25}
        color="rgba(0, 232, 135, 0.35)"
        direction="up"
        startFrame={10}
        maxOpacity={0.6}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 5,
        }}
      >
        {/* Summary comparison */}
        <ComparisonChart
          items={[
            { label: "Capital", value: 340000, color: COLORS.green },
            { label: "Interets", value: 272000, color: COLORS.red },
            { label: "Cout total", value: 612000, color: COLORS.purple },
          ]}
          startFrame={20}
          width={700}
          suffix=" EUR"
        />

        <div style={{ height: 36 }} />

        <FadeText
          text="Des strategies existent pour reduire ce cout."
          startFrame={100}
          fontSize={24}
          color={COLORS.textPrimary}
          fontWeight={600}
        />

        <div style={{ height: 20 }} />

        {/* Strategy pills - appear one by one */}
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { text: "Renegociation", frame: 140, color: COLORS.green },
            { text: "Remboursement anticipe", frame: 170, color: COLORS.blue },
            { text: "Apport plus eleve", frame: 200, color: COLORS.gold },
          ].map((item) => {
            const pillScale = spring({
              frame: frame - item.frame,
              fps,
              config: { damping: 12, mass: 0.5 },
            });
            return (
              <div
                key={item.text}
                style={{
                  backgroundColor: `${item.color}15`,
                  border: `1px solid ${item.color}40`,
                  borderRadius: 8,
                  padding: "12px 24px",
                  transform: `scale(${pillScale})`,
                  boxShadow: `0 0 20px ${item.color}10`,
                }}
              >
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: item.color,
                    fontFamily: "Inter",
                  }}
                >
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ height: 50 }} />

        {/* CTA - smooth pulse */}
        <div
          style={{
            fontSize: 16,
            color: COLORS.gold,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            fontFamily: "Inter",
            opacity: ctaPulse,
            textShadow: `0 0 20px ${COLORS.gold}50`,
          }}
        >
          ANALYSE COMPLETE DANS LA DESCRIPTION
        </div>
      </div>
    </div>
  );
};

// ---------- Utility: Stat Card ----------
const StatCard: React.FC<{
  label: string;
  startFrame: number;
  color: string;
  children: React.ReactNode;
}> = ({ label, startFrame, color, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, mass: 0.5 },
  });

  return (
    <div
      style={{
        backgroundColor: COLORS.bgCard,
        borderRadius: 12,
        padding: "24px 32px",
        textAlign: "center",
        transform: `scale(${scale})`,
        border: `1px solid ${color}20`,
        boxShadow: `0 0 30px ${color}08`,
        minWidth: 200,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: COLORS.textMuted,
          fontWeight: 600,
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 8,
          fontFamily: "Inter",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
};
