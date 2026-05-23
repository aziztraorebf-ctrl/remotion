import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { getLength } from "@remotion/paths";

export interface EraEvent {
  year: string | number;
  label: string;
  sublabel?: string;
}

export interface ParadigmShiftTimelineProps {
  titleBefore?: string;
  titleAfter?: string;
  shiftYear?: string;
  shiftLabel?: string;
  eventsBefore?: EraEvent[];
  eventsAfter?: EraEvent[];
  colorBefore?: string;
  colorAfter?: string;
  bgColor?: string;
  startFrame?: number;
}

const DEFAULT_EVENTS_BEFORE: EraEvent[] = [
  { year: "1960", label: "INDEPENDANCE" },
  { year: "1990", label: "DEMOCRATIE" },
  { year: "2010", label: "CROISSANCE PECHE" },
];

const DEFAULT_EVENTS_AFTER: EraEvent[] = [
  { year: "2021", label: "PREMIER FORAGE" },
  { year: "2024", label: "PRODUCTION", sublabel: "35M BARILS" },
  { year: "2035", label: "OBJECTIF", sublabel: "145M BARILS" },
];

// Compute the path length of a horizontal SVG line for strokeDashoffset animation
const LINE_PATH = "M 0 0 L 1 0";
const LINE_LENGTH = (() => {
  try {
    return getLength(LINE_PATH);
  } catch {
    return 1;
  }
})();

export const ParadigmShiftTimeline: React.FC<ParadigmShiftTimelineProps> = ({
  titleBefore = "ERE PRE-PETROLIERE",
  titleAfter = "ERE PETROLIERE",
  shiftYear = "2014",
  shiftLabel = "DECOUVERTE SANGOMAR",
  eventsBefore = DEFAULT_EVENTS_BEFORE,
  eventsAfter = DEFAULT_EVENTS_AFTER,
  colorBefore = "rgba(242,235,217,0.55)",
  colorAfter = "#c8a951",
  bgColor = "transparent",
  startFrame = 0,
}) => {
  const rawFrame = useCurrentFrame();
  const frame = rawFrame - startFrame;
  const { width, height, fps } = useVideoConfig();

  // Layout constants — all in SVG coordinate space
  const SVG_W = width;
  const SVG_H = height;
  const LINE_Y = SVG_H * 0.52;
  const PAD_H = SVG_W * 0.07;
  const LINE_X1 = PAD_H;
  const LINE_X2 = SVG_W - PAD_H;
  const LINE_TOTAL = LINE_X2 - LINE_X1;
  const SHIFT_X = SVG_W * 0.5;
  const FLASH_H_HALF = SVG_H * 0.18;
  const TICK_HALF = 12;

  // --- 1. Line draw-in (frame 0-30) ---
  const lineProgress = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const strokeDasharray = LINE_TOTAL;
  const strokeDashoffset = LINE_TOTAL * (1 - lineProgress);

  // --- 2. Events "before" appear (frame 30-50) ---
  const beforeProgress = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- 3. Flash (frame 45-60): scaleY 0 -> 1.5 -> 1 ---
  const flashScaleY = (() => {
    const grow = interpolate(frame, [45, 53], [0, 1.5], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const settle = interpolate(frame, [53, 60], [1.5, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    if (frame < 45) return 0;
    if (frame < 53) return grow;
    return settle;
  })();

  // --- Camera shake: 8 frames after flash (frame 45-53), deterministic ---
  const shakeFrame = frame - 45;
  const isShaking = shakeFrame >= 0 && shakeFrame < 8;
  const shakeX = isShaking ? Math.sin(shakeFrame * 2.7) * 3 : 0;
  const shakeY = isShaking ? Math.cos(shakeFrame * 3.1) * 2 : 0;

  // --- Flash blanc: opacity 1 at frames 45-46, then 0 ---
  const flashWhiteOpacity = (() => {
    if (frame === 45 || frame === 46) return 1;
    return 0;
  })();

  // --- Faisceau bleu persistant: visible after frame 47 ---
  const blueBeamOpacity = interpolate(frame, [47, 50], [0, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- 4. Events "after" appear (frame 55-90) ---
  const afterProgress = interpolate(frame, [55, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- 5. Era titles appear (frame 60+) ---
  const eraTitlesOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Shift year label (frame 48+) ---
  const shiftLabelOpacity = interpolate(frame, [48, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Spring for shift year pop-in ---
  const shiftYearSpring = spring({
    fps,
    frame: frame - 48,
    config: { damping: 70, stiffness: 80, mass: 1 },
  });
  const shiftYearScale = interpolate(shiftYearSpring, [0, 1], [0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Helper: compute X position for an event within a half of the timeline
  const getEventX = (
    index: number,
    total: number,
    side: "before" | "after"
  ): number => {
    if (total === 0) return side === "before" ? SHIFT_X - LINE_TOTAL * 0.2 : SHIFT_X + LINE_TOTAL * 0.2;
    const halfPad = LINE_TOTAL * 0.04;
    if (side === "before") {
      const usable = SHIFT_X - halfPad - LINE_X1;
      if (total === 1) return LINE_X1 + usable * 0.5;
      return LINE_X1 + (usable * index) / (total - 1);
    } else {
      const usable = LINE_X2 - (SHIFT_X + halfPad);
      if (total === 1) return SHIFT_X + halfPad + usable * 0.5;
      return SHIFT_X + halfPad + (usable * index) / (total - 1);
    }
  };

  // Helper: scramble year text (deterministic — no Math.random)
  const getScrambledYear = (
    evFrame: number,
    appearFrame: number,
    index: number,
    realYear: string | number
  ): string => {
    const scrambleActive = evFrame < appearFrame + 10;
    if (!scrambleActive) return String(realYear);
    const f = evFrame;
    const digits = String(Math.floor(((f * 31 + index * 17) % 90) + 10) * 10 + Math.floor((f * 7) % 10));
    return digits;
  };

  const LABEL_ABOVE_OFFSET = 52;
  const LABEL_BELOW_OFFSET = 52;

  // Compute per-event "appear frames" (absolute, relative to frame)
  // Before events: frame 30 + delay based on beforeProgress
  // After events: frame 55 + delay based on afterProgress
  const getBeforeAppearFrame = (i: number): number => {
    const delay = i * 5;
    // beforeProgress goes 0->1 from frame 30->50
    // event starts at beforeProgress = delay/20
    return 30 + delay;
  };

  const getAfterAppearFrame = (i: number): number => {
    const delay = i * 9;
    // afterProgress goes 0->1 from frame 55->90 (35 frames)
    return 55 + delay;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, overflow: "hidden" }}>
      {/* Subtle dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(200,169,81,0.10) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          pointerEvents: "none",
        }}
      />

      {/* Era titles — top section */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: LINE_Y * 0.38,
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          opacity: eraTitlesOpacity,
          pointerEvents: "none",
        }}
      >
        {/* Before title */}
        <div
          style={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            paddingBottom: 24,
            paddingRight: 32,
          }}
        >
          <span
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: Math.round(SVG_W * 0.022),
              color: colorBefore,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              textAlign: "center",
              lineHeight: 1.2,
              opacity: 0.35,
            }}
          >
            {titleBefore}
          </span>
        </div>
        {/* After title */}
        <div
          style={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            paddingBottom: 24,
            paddingLeft: 32,
          }}
        >
          <span
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: Math.round(SVG_W * 0.025),
              color: colorAfter,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              textAlign: "center",
              lineHeight: 1.2,
              fontWeight: 700,
              opacity: 1.0,
            }}
          >
            {titleAfter}
          </span>
        </div>
      </div>

      {/* Main SVG layer — wrapped in shake div */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transform: `translate(${shakeX}px, ${shakeY}px)`,
          pointerEvents: "none",
        }}
      >
        <svg
          width={SVG_W}
          height={SVG_H}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
        >
          {/* Defs: glow filter */}
          <defs>
            <filter id="pst-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="18" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="pst-glow-sm" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="pst-blue-beam" x="-400%" y="-400%" width="900%" height="900%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="pst-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colorBefore} stopOpacity="0.6" />
              <stop offset="47%" stopColor={colorBefore} stopOpacity="0.7" />
              <stop offset="50%" stopColor={colorAfter} stopOpacity="1" />
              <stop offset="53%" stopColor={colorAfter} stopOpacity="1" />
              <stop offset="100%" stopColor={colorAfter} stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* === HORIZONTAL TIMELINE LINE === */}
          <line
            x1={LINE_X1}
            y1={LINE_Y}
            x2={LINE_X2}
            y2={LINE_Y}
            stroke="url(#pst-line-grad)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
          />

          {/* === BEFORE ERA separator tint band (left half) === */}
          <rect
            x={LINE_X1}
            y={LINE_Y - FLASH_H_HALF * 2.5}
            width={SHIFT_X - LINE_X1}
            height={FLASH_H_HALF * 5}
            fill="rgba(242,235,217,0.03)"
            rx="0"
          />

          {/* === FLASH — vertical rupture bar (kept for scaleY transition) === */}
          {flashScaleY > 0 && (
            <g
              transform={`translate(${SHIFT_X}, ${LINE_Y}) scale(1, ${flashScaleY})`}
              style={{ transformOrigin: `${SHIFT_X}px ${LINE_Y}px` }}
            >
              {/* Glow halo behind bar */}
              <rect
                x={-24}
                y={-FLASH_H_HALF}
                width={48}
                height={FLASH_H_HALF * 2}
                fill={colorAfter}
                opacity={0.12}
                filter="url(#pst-glow)"
                rx="4"
              />
            </g>
          )}

          {/* === FAISCEAU BLEU PERSISTANT (replaces old flash bar) === */}
          {blueBeamOpacity > 0 && (
            <line
              x1={SHIFT_X}
              y1={LINE_Y - FLASH_H_HALF}
              x2={SHIFT_X}
              y2={LINE_Y + FLASH_H_HALF}
              stroke="#4a9eff"
              strokeWidth={3}
              opacity={blueBeamOpacity}
              style={{ filter: "drop-shadow(0 0 8px #4a9eff)" }}
            />
          )}

          {/* === BEFORE EVENTS === */}
          {eventsBefore.map((ev, i) => {
            const evX = getEventX(i, eventsBefore.length, "before");
            const delay = i * 5;
            const evProgress = interpolate(
              beforeProgress,
              [delay / 20, Math.min(1, (delay + 15) / 20)],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const evOpacity = evProgress * 0.35;
            const isAbove = i % 2 === 0;
            const labelY = isAbove
              ? LINE_Y - LABEL_ABOVE_OFFSET
              : LINE_Y + LABEL_BELOW_OFFSET;
            const connectorY1 = isAbove ? LINE_Y - TICK_HALF - 4 : LINE_Y + TICK_HALF + 4;
            const connectorY2 = isAbove ? labelY + 22 : labelY - 22;
            const translateY = isAbove
              ? interpolate(evProgress, [0, 1], [14, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : interpolate(evProgress, [0, 1], [-14, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });

            const appearFrame = getBeforeAppearFrame(i);
            const displayYear = getScrambledYear(frame, appearFrame, i, ev.year);

            return (
              <g
                key={`before-${i}`}
                opacity={evOpacity}
                transform={`translate(0, ${translateY})`}
              >
                {/* Connector tick (dashed) */}
                <line
                  x1={evX}
                  y1={connectorY1}
                  x2={evX}
                  y2={connectorY2}
                  stroke={colorBefore}
                  strokeWidth={1.5}
                  strokeOpacity={0.5}
                  strokeDasharray="3,3"
                />
                {/* Encoche verticale (replaces circle) */}
                <line
                  x1={evX}
                  y1={LINE_Y - TICK_HALF}
                  x2={evX}
                  y2={LINE_Y + TICK_HALF}
                  stroke={colorBefore}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
                {/* Tick mark horizontal de repere */}
                <line
                  x1={evX - 5}
                  y1={LINE_Y}
                  x2={evX + 5}
                  y2={LINE_Y}
                  stroke={colorBefore}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeOpacity={0.6}
                />
                {/* Year */}
                <text
                  x={evX}
                  y={isAbove ? labelY - 26 : labelY + 36}
                  textAnchor="middle"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize={Math.round(SVG_W * 0.016)}
                  fill={colorBefore}
                  opacity={0.6}
                  letterSpacing="0.08em"
                >
                  {displayYear}
                </text>
                {/* Label */}
                <text
                  x={evX}
                  y={isAbove ? labelY - 2 : labelY + 62}
                  textAnchor="middle"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize={Math.round(SVG_W * 0.013)}
                  fill={colorBefore}
                  opacity={0.7}
                  letterSpacing="0.06em"
                >
                  {ev.label}
                </text>
                {ev.sublabel && (
                  <text
                    x={evX}
                    y={isAbove ? labelY + 22 : labelY + 86}
                    textAnchor="middle"
                    fontFamily="IBM Plex Mono, monospace"
                    fontSize={Math.round(SVG_W * 0.011)}
                    fill={colorBefore}
                    opacity={0.5}
                    letterSpacing="0.05em"
                  >
                    {ev.sublabel}
                  </text>
                )}
              </g>
            );
          })}

          {/* === AFTER EVENTS === */}
          {eventsAfter.map((ev, i) => {
            const evX = getEventX(i, eventsAfter.length, "after");
            const delay = i * 9;
            const totalFrames = 35;
            const evProgress = interpolate(
              afterProgress,
              [delay / totalFrames, Math.min(1, (delay + 20) / totalFrames)],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const evOpacity = evProgress;
            const isAbove = i % 2 === 0;
            const labelY = isAbove
              ? LINE_Y - LABEL_ABOVE_OFFSET - 16
              : LINE_Y + LABEL_BELOW_OFFSET + 16;
            const connectorY1 = isAbove ? LINE_Y - TICK_HALF - 4 : LINE_Y + TICK_HALF + 4;
            const connectorY2 = isAbove ? labelY + 28 : labelY - 28;
            const translateY = isAbove
              ? interpolate(evProgress, [0, 1], [22, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : interpolate(evProgress, [0, 1], [-22, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });

            const appearFrame = getAfterAppearFrame(i);
            const displayYear = getScrambledYear(frame, appearFrame, i, ev.year);

            return (
              <g
                key={`after-${i}`}
                opacity={evOpacity}
                transform={`translate(0, ${translateY})`}
              >
                {/* Glow halo behind encoche */}
                <rect
                  x={evX - 16}
                  y={LINE_Y - TICK_HALF - 8}
                  width={32}
                  height={TICK_HALF * 2 + 16}
                  fill={colorAfter}
                  opacity={evOpacity * 0.15}
                  filter="url(#pst-glow-sm)"
                  rx="2"
                />
                {/* Connector tick */}
                <line
                  x1={evX}
                  y1={connectorY1}
                  x2={evX}
                  y2={connectorY2}
                  stroke={colorAfter}
                  strokeWidth={2}
                  strokeOpacity={0.7}
                />
                {/* Encoche verticale (replaces circles) */}
                <line
                  x1={evX}
                  y1={LINE_Y - TICK_HALF}
                  x2={evX}
                  y2={LINE_Y + TICK_HALF}
                  stroke={colorAfter}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
                {/* Tick mark horizontal de repere */}
                <line
                  x1={evX - 6}
                  y1={LINE_Y}
                  x2={evX + 6}
                  y2={LINE_Y}
                  stroke={colorAfter}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeOpacity={0.9}
                />
                {/* Year */}
                <text
                  x={evX}
                  y={isAbove ? labelY - 32 : labelY + 46}
                  textAnchor="middle"
                  fontFamily="Cinzel, serif"
                  fontSize={Math.round(SVG_W * 0.022)}
                  fill={colorAfter}
                  fontWeight="700"
                  letterSpacing="0.08em"
                  opacity={1.0}
                >
                  {displayYear}
                </text>
                {/* Label */}
                <text
                  x={evX}
                  y={isAbove ? labelY + 4 : labelY + 76}
                  textAnchor="middle"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize={Math.round(SVG_W * 0.016)}
                  fill="#f2ebd9"
                  letterSpacing="0.08em"
                  opacity={1.0}
                >
                  {ev.label}
                </text>
                {ev.sublabel && (
                  <text
                    x={evX}
                    y={isAbove ? labelY + 30 : labelY + 102}
                    textAnchor="middle"
                    fontFamily="IBM Plex Mono, monospace"
                    fontSize={Math.round(SVG_W * 0.013)}
                    fill={colorAfter}
                    opacity={0.8}
                    letterSpacing="0.06em"
                  >
                    {ev.sublabel}
                  </text>
                )}
              </g>
            );
          })}

          {/* === SHIFT YEAR label (center) === */}
          {flashScaleY > 0 && (
            <g
              opacity={shiftLabelOpacity}
              transform={`translate(${SHIFT_X}, ${LINE_Y}) scale(${shiftYearScale})`}
            >
              {/* Year badge */}
              <rect
                x={-72}
                y={FLASH_H_HALF + 18}
                width={144}
                height={50}
                rx="4"
                fill="rgba(11,13,23,0.85)"
                stroke={colorAfter}
                strokeWidth={1.5}
              />
              <text
                x={0}
                y={FLASH_H_HALF + 52}
                textAnchor="middle"
                fontFamily="Cinzel, serif"
                fontSize={Math.round(SVG_W * 0.022)}
                fill={colorAfter}
                fontWeight="700"
                letterSpacing="0.1em"
              >
                {shiftYear}
              </text>
              {/* Shift label below */}
              <text
                x={0}
                y={FLASH_H_HALF + 90}
                textAnchor="middle"
                fontFamily="IBM Plex Mono, monospace"
                fontSize={Math.round(SVG_W * 0.012)}
                fill="#f2ebd9"
                opacity={0.8}
                letterSpacing="0.12em"
              >
                {shiftLabel}
              </text>
            </g>
          )}

          {/* === ERA separator labels on line === */}
          <text
            x={LINE_X1 + 8}
            y={LINE_Y - 14}
            fontFamily="IBM Plex Mono, monospace"
            fontSize={Math.round(SVG_W * 0.011)}
            fill={colorBefore}
            opacity={eraTitlesOpacity * 0.35}
            letterSpacing="0.14em"
          >
            AVANT
          </text>
          <text
            x={LINE_X2 - 8}
            y={LINE_Y - 14}
            textAnchor="end"
            fontFamily="IBM Plex Mono, monospace"
            fontSize={Math.round(SVG_W * 0.011)}
            fill={colorAfter}
            opacity={eraTitlesOpacity * 0.7}
            letterSpacing="0.14em"
          >
            APRES
          </text>
        </svg>
      </div>

      {/* === FLASH BLANC 2 FRAMES — par-dessus tout === */}
      {flashWhiteOpacity > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: "white",
            opacity: flashWhiteOpacity,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
