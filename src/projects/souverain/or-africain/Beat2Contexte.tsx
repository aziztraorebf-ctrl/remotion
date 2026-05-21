import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, spring, useCurrentFrame, useVideoConfig, staticFile } from "remotion";
import { BEATS, AUDIO_SEGMENTS, NARRATION_PATH } from "./timing";
import { BEAT2, PALETTE, PROGRESS_BAR } from "./manifest";
import { Subtitles } from "../../geoafrique-shorts/Subtitles";
import { OR_AFRICAIN_WORDS } from "./whisper-words-or-africain";

const BEAT_START = BEATS.beat2.startFrame;
const BEAT_END = BEATS.beat2.endFrame;
const BEAT_DURATION = BEAT_END - BEAT_START;
const BEAT_START_S = BEATS.beat2.startSec;
const BEAT_END_S = BEATS.beat2.endSec;

// Chart geometry — 1080x1920 portrait
const CHART = {
  left: 110,
  right: 970,
  top: 720,
  bottom: 1180,
  yearStart: 2010,
  yearEnd: 2026,
};
const CHART_WIDTH = CHART.right - CHART.left;
const CHART_HEIGHT = CHART.bottom - CHART.top;

// Or curve — exponential rise to +458%
// Years 2010..2026, normalized 0..1 then mapped to chart coords
function orCurvePoints(progress: number): string {
  // Sample 16 points (one per year)
  const N = 16;
  const points: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    if (t > progress) break;
    const x = CHART.left + t * CHART_WIDTH;
    // Exponential-ish growth, ends near top
    const y = CHART.bottom - Math.pow(t, 1.6) * (CHART_HEIGHT * 0.92);
    points.push([x, y]);
  }
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
}

function ProgressBar({ frame }: { frame: number }) {
  const progress = frame / BEAT_DURATION;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: PROGRESS_BAR.y,
        width: `${progress * 100}%`,
        height: PROGRESS_BAR.height,
        backgroundColor: PROGRESS_BAR.color,
        opacity: PROGRESS_BAR.opacity,
      }}
    />
  );
}

function PriceTicker({ frame }: { frame: number }) {
  // Visible after chart title settles
  const appearFrame = 30;
  const tickerOpacity = interpolate(
    frame,
    [appearFrame, appearFrame + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Price progresses 1200 -> 5589 in perfect sync with the or curve (frame 0..480)
  // Same easing (exp 1.6) so ticker and curve move together monotonically
  const t = interpolate(
    frame,
    [0, 480],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const eased = Math.pow(t, 1.6);
  const PRICE_START = 1200;
  const PRICE_END = 5589;
  const displayPrice = Math.round(PRICE_START + eased * (PRICE_END - PRICE_START));

  // Year label tracks the curve year (2010..2026)
  const year = 2010 + Math.round(t * 16);

  return (
    <div
      style={{
        position: "absolute",
        top: 470,
        right: 60,
        textAlign: "right",
        opacity: tickerOpacity,
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          fontSize: 22,
          color: "#9a9a9a",
          letterSpacing: "4px",
          marginBottom: 6,
        }}
      >
        ONCE D'OR · {year}
      </div>
      <div
        style={{
          fontSize: 56,
          color: PALETTE.orange,
          fontWeight: 800,
          letterSpacing: "-2px",
          textShadow: `0 0 14px ${PALETTE.orange}`,
        }}
      >
        ${displayPrice.toLocaleString("en-US")}
      </div>
    </div>
  );
}

function ChartTitle({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const appear = spring({ fps, frame, config: { damping: 200 } });
  const opacity = interpolate(appear, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top: 240,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 26,
          color: "#9a9a9a",
          letterSpacing: "8px",
          marginBottom: 14,
        }}
      >
        GHANA · 2010 — 2026
      </div>
      <div
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 56,
          color: PALETTE.blanc,
          fontWeight: 700,
          letterSpacing: "-1px",
          textShadow: "0 0 14px rgba(0,0,0,0.85)",
        }}
      >
        Le prix de l'or s'envole.
      </div>
      <div
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 56,
          color: "#c0c0c0",
          fontWeight: 700,
          letterSpacing: "-1px",
          fontStyle: "italic",
          textShadow: "0 0 14px rgba(0,0,0,0.85)",
        }}
      >
        Les royalties, jamais.
      </div>
    </div>
  );
}

function Chart({ frame }: { frame: number }) {
  // Or curve now stretches across the full beat — climbs slowly until just before the cut-to-black.
  // Cut-to-black at f499; we finish the curve at f480 to land the climax right before the silence.
  const orStart = 0;
  const orEnd = 480;
  const orProgress = interpolate(
    frame,
    [orStart, orEnd],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Drain animation — fill zone fades out as "Rien" approaches
  // multinationales: f631-f659 absolute => f339-f367 relative to beat
  // rien: f809-f819 absolute => f517-f527 relative to beat
  const drainStart = AUDIO_SEGMENTS.multinationales.startFrame - BEAT_START;
  const drainEnd = AUDIO_SEGMENTS.rien.startFrame - BEAT_START;
  // Fill follows curve growth, then drains in the final phase
  const baseFillOpacity = interpolate(
    frame,
    [40, drainStart, drainEnd],
    [0, 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // Subtle "breathing" pulse on the amber fill during the wait phase
  const inWaitPhase = frame > 200 && frame < drainStart;
  const pulse = inWaitPhase ? Math.sin((frame / 75) * Math.PI * 2) * 0.05 : 0;
  const fillOpacity = Math.max(0, baseFillOpacity + pulse);

  const orPath = orCurvePoints(orProgress);
  const orEndY = CHART.bottom - 0.92 * CHART_HEIGHT;

  // Fill zone — under the or curve, down to the X axis
  // Only fills up to the current progress on the curve
  const N = 16;
  const fillPoints: string[] = [];
  const visiblePoints = Math.ceil(N * orProgress);
  for (let i = 0; i <= visiblePoints; i++) {
    const t = Math.min(i / N, orProgress);
    const x = CHART.left + t * CHART_WIDTH;
    const y = CHART.bottom - Math.pow(t, 1.6) * (CHART_HEIGHT * 0.92);
    fillPoints.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  // Close down to bottom axis
  if (visiblePoints > 0) {
    const lastX = CHART.left + Math.min(orProgress, 1) * CHART_WIDTH;
    fillPoints.push(`L${lastX.toFixed(1)},${CHART.bottom.toFixed(1)}`);
    fillPoints.push(`L${CHART.left.toFixed(1)},${CHART.bottom.toFixed(1)}`);
    fillPoints.push("Z");
  }
  const fillPath = fillPoints.join(" ");

  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      {/* Chart frame — left and bottom axis */}
      <line
        x1={CHART.left}
        y1={CHART.top}
        x2={CHART.left}
        y2={CHART.bottom}
        stroke="#5a5a5a"
        strokeWidth={1}
      />
      <line
        x1={CHART.left}
        y1={CHART.bottom}
        x2={CHART.right}
        y2={CHART.bottom}
        stroke="#5a5a5a"
        strokeWidth={1}
      />

      {/* X axis labels */}
      <text
        x={CHART.left}
        y={CHART.bottom + 36}
        fill="#7a7a7a"
        fontSize={24}
        fontFamily="monospace"
        textAnchor="start"
      >
        2010
      </text>
      <text
        x={CHART.right}
        y={CHART.bottom + 36}
        fill="#7a7a7a"
        fontSize={24}
        fontFamily="monospace"
        textAnchor="end"
      >
        2026
      </text>

      {/* Fill zone — wealth captured */}
      <path d={fillPath} fill={PALETTE.orange} opacity={fillOpacity} />

      {/* Or curve animated */}
      <path
        d={orPath}
        stroke={PALETTE.orange}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          filter: `drop-shadow(0 0 8px ${PALETTE.orange})`,
        }}
      />

      {/* +458% / COURS DE L'OR label — anchored TOP-LEFT above chart, never inside the amber zone */}
      {orProgress >= 0.95 && (
        <g
          style={{
            opacity: interpolate(orProgress, [0.95, 1.0], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <text
            x={CHART.left + 12}
            y={CHART.top - 70}
            fill={PALETTE.orange}
            fontSize={56}
            fontFamily="Georgia, serif"
            fontWeight={700}
            textAnchor="start"
            style={{ filter: `drop-shadow(0 0 6px ${PALETTE.orange})` }}
          >
            +458%
          </text>
          <text
            x={CHART.left + 12}
            y={CHART.top - 30}
            fill={PALETTE.orange}
            fontSize={26}
            fontFamily="monospace"
            textAnchor="start"
            opacity={0.85}
            letterSpacing="3"
          >
            COURS DE L'OR
          </text>
        </g>
      )}
    </svg>
  );
}

function RienMoment({ frame }: { frame: number }) {
  const startRel = AUDIO_SEGMENTS.rien.startFrame - BEAT_START;
  if (frame < startRel) return null;

  const localFrame = frame - startRel;
  const animFrames = BEAT2.rienMoment.animationFrames;

  const letterSpacing = interpolate(
    localFrame,
    [0, animFrames],
    [BEAT2.rienMoment.letterSpacingStart, BEAT2.rienMoment.letterSpacingEnd],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const scaleIn = interpolate(
    localFrame,
    [0, 8],
    [1.4, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = interpolate(
    localFrame,
    [0, 6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Vibration after stabilization
  const vibFrame = localFrame - animFrames;
  const vibX = vibFrame > 0
    ? Math.sin(vibFrame * (BEAT2.rienMoment.vibrationFrequency / 30) * Math.PI * 2) * BEAT2.rienMoment.vibrationAmplitude
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: BEAT2.rienMoment.fontSizePx,
          fontWeight: 900,
          color: BEAT2.rienMoment.color,
          letterSpacing: `${letterSpacing}px`,
          transform: `scale(${scaleIn}) translateX(${vibX}px)`,
          opacity,
          textShadow: "0 0 30px rgba(255,255,255,0.15)",
        }}
      >
        RIEN.
      </div>
    </AbsoluteFill>
  );
}

export const Beat2Contexte: React.FC = () => {
  const frame = useCurrentFrame();
  // Composition is standalone — frame 0 = start of beat. No offset needed.
  const clampedRel = Math.max(0, Math.min(frame, BEAT_DURATION - 1));

  // Cut-to-black starts ~0.6s before the word "Rien" so the word lands in pure black
  const RIEN_CUT_LEAD_FRAMES = 18; // ~0.6s @ 30fps
  const rienCutFrame = AUDIO_SEGMENTS.rien.startFrame - BEAT_START - RIEN_CUT_LEAD_FRAMES;
  const rienStartRel = AUDIO_SEGMENTS.rien.startFrame - BEAT_START;
  const isRienMoment = clampedRel >= rienCutFrame;

  return (
    <AbsoluteFill style={{ backgroundColor: BEAT2.fond }}>
      {/* Background — same parchment as Beat 1 for continuity */}
      {!isRienMoment && (
        <>
          <Img
            src={staticFile("/souverain/or-africain/backgrounds/beat1-bg-v4-parchemin-modern.png")}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 1.0,
              filter: "brightness(1.18) contrast(0.96)",
            }}
          />
          <AbsoluteFill
            style={{
              background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)",
              pointerEvents: "none",
            }}
          />

          <ChartTitle frame={clampedRel} />
          <Chart frame={clampedRel} />
          <PriceTicker frame={clampedRel} />
        </>
      )}

      {/* Cut-to-black during the lead-up + RIEN. when word is spoken */}
      {isRienMoment && (
        <AbsoluteFill style={{ backgroundColor: "#000000" }} />
      )}
      <RienMoment frame={clampedRel} />

      {!isRienMoment && <ProgressBar frame={clampedRel} />}

      {/* TikTok karaoke subtitles — cut at rienCutFrame to avoid double-RIEN spoiler */}
      {!isRienMoment && (
        <Subtitles
          sceneStartS={BEAT_START_S}
          sceneEndS={BEAT_END_S}
          highlightColor="#f5d547"
          fontSize={56}
          bottomOffset={480}
          words={OR_AFRICAIN_WORDS}
        />
      )}

      {/* Narration */}
      <Audio src={staticFile(NARRATION_PATH)} startFrom={BEAT_START} endAt={BEAT_END} />
    </AbsoluteFill>
  );
};

export const BEAT2_CONTEXTE_FRAMES = BEAT_DURATION;
