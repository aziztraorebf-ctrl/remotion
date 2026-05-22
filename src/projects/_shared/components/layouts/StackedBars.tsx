import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BarItem {
  id: string;
  label: string;
  value: number;
  displayValue: string;
}

interface StackedBarsProps {
  bars?: BarItem[];
  revealLabelsFrame?: number;
  title?: string;
  subtitle?: string;
  bgColor?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

// Base values designed for 1920h × 1080w — scaled at runtime via useVideoConfig
const BASE_BAR_MAX_HEIGHT = 1100;
const BASE_BAR_WIDTH = 140;
const BASE_X_POSITIONS = [140, 360, 580, 800];
const BASE_BARS_BOTTOM_OFFSET = 360; // distance from bottom where bars are anchored
const STAGGER_PER_BAR = 12;

const BAR_SPRING_CONFIG = { damping: 16, stiffness: 90, mass: 0.8 };
const LABEL_SPRING_CONFIG = { damping: 14, stiffness: 110 };
const ENTRY_SPRING_CONFIG = { damping: 14, stiffness: 100 };

const BAR_GRADIENT = "linear-gradient(to bottom, #FFE895 2%, #9B762A 15%, #9B762A 85%, #FFE895 98%)";
const DOT_GRID_BG =
  "radial-gradient(circle, rgba(200,169,81,0.15) 1.5px, transparent 1.5px)";

// ─── Single Bar ───────────────────────────────────────────────────────────────

interface SingleBarProps {
  bar: BarItem;
  index: number;
  maxValue: number;
  isTop: boolean;
  revealLabelsFrame: number;
  fps: number;
  barMaxHeight: number;
  barWidth: number;
  xPos: number;
  barsBottomOffset: number;
}

const SingleBar: React.FC<SingleBarProps> = ({
  bar,
  index,
  maxValue,
  isTop,
  revealLabelsFrame,
  fps,
  barMaxHeight,
  barWidth,
  xPos,
  barsBottomOffset,
}) => {
  const frame = useCurrentFrame();

  const triggerFrame = index * STAGGER_PER_BAR;
  const localFrame = Math.max(0, frame - triggerFrame);

  // Bar growth spring
  const barSpring = spring({
    frame: localFrame,
    fps,
    config: BAR_SPRING_CONFIG,
  });

  const barHeight = interpolate(
    barSpring,
    [0, 1],
    [0, barMaxHeight * (bar.value / maxValue)],
    { extrapolateRight: "clamp" }
  );

  // Glow opacity follows bar spring
  const glowOpacity = interpolate(barSpring, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Value label opacity above bar
  const valueOpacity = interpolate(barSpring, [0.3, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Hidden label: visible until revealLabelsFrame, then fades out
  const revealLocalFrame = Math.max(0, frame - revealLabelsFrame);
  const revealSpring = spring({
    frame: revealLocalFrame,
    fps,
    config: LABEL_SPRING_CONFIG,
  });

  const hiddenLabelOpacity = interpolate(revealSpring, [0, 1], [0.7, 0], {
    extrapolateRight: "clamp",
  });

  // Revealed label: appears from revealLabelsFrame
  const revealedOpacity = interpolate(revealSpring, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const revealedTranslateY = interpolate(revealSpring, [0, 1], [20, 0], {
    extrapolateRight: "clamp",
  });

  const glowColor = isTop
    ? "0 0 70px 16px rgba(253, 224, 139, 0.55)"
    : "0 0 50px 10px rgba(253, 224, 139, 0.35)";

  return (
    <div
      style={{
        position: "absolute",
        left: `${xPos}px`,
        bottom: `${barsBottomOffset}px`,
        width: `${barWidth}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Value label above bar */}
      <div
        style={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: "48px",
          fontWeight: 400,
          color: "#ffffff",
          textAlign: "center",
          marginBottom: "40px",
          opacity: valueOpacity,
          whiteSpace: "nowrap",
        }}
      >
        {bar.displayValue}
      </div>

      {/* Bar itself — grows upward by anchoring to bottom */}
      <div
        style={{
          width: `${barWidth}px`,
          height: `${barHeight}px`,
          backgroundImage: BAR_GRADIENT,
          borderRadius: "40px",
          boxShadow: glowOpacity > 0.05 ? glowColor : "none",
          opacity: glowOpacity > 0 ? 1 : 0,
          flexShrink: 0,
        }}
      />

      {/* Label bloc gris visible dès le départ, révélé en fondu */}
      <div
        style={{
          marginTop: "30px",
          width: `${barWidth}px`,
          height: "64px",
          borderRadius: "10px",
          background: "linear-gradient(180deg, #C4C4C4 0%, #5A5A5A 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: hiddenLabelOpacity,
          filter: hiddenLabelOpacity > 0.05 ? "blur(3px)" : "none",
        }}
      />

      {/* Revealed label */}
      <div
        style={{
          position: "absolute",
          bottom: "-94px",
          width: `${barWidth}px`,
          textAlign: "center",
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: "28px",
          fontWeight: 600,
          color: "#ffffff",
          opacity: revealedOpacity,
          transform: `translateY(${revealedTranslateY}px)`,
          letterSpacing: "0.1em",
        }}
      >
        {bar.label}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const StackedBars: React.FC<StackedBarsProps> = ({
  bars = [
    { id: "1", label: "OR",      value: 340, displayValue: "340Md" },
    { id: "2", label: "CUIVRE",  value: 210, displayValue: "210Md" },
    { id: "3", label: "DIAMANT", value: 134, displayValue: "134Md" },
    { id: "4", label: "COBALT",  value: 78,  displayValue: "78Md"  },
  ],
  revealLabelsFrame = 90,
  title = "EXTRACTION MINIÈRE",
  subtitle = "par minerai · Afrique 2023",
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const scaleW = width / 1080;
  const scaleH = height / 1920;

  const BAR_MAX_HEIGHT = Math.round(BASE_BAR_MAX_HEIGHT * scaleH);
  const BAR_WIDTH = Math.round(BASE_BAR_WIDTH * scaleW);
  const X_POSITIONS = BASE_X_POSITIONS.map((x) => Math.round(x * scaleW));
  const BARS_BOTTOM_OFFSET = Math.round(BASE_BARS_BOTTOM_OFFSET * scaleH);

  const maxValue = Math.max(...bars.map((b) => b.value));

  // Title entry
  const titleSpring = spring({ frame, fps, config: ENTRY_SPRING_CONFIG });
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleTranslateY = interpolate(titleSpring, [0, 1], [-24, 0], {
    extrapolateRight: "clamp",
  });

  // Subtitle entry (after all bars revealed)
  const subtitleDelay = bars.length * STAGGER_PER_BAR + 45;
  const subtitleLocalFrame = Math.max(0, frame - subtitleDelay);
  const subtitleSpring = spring({
    frame: subtitleLocalFrame,
    fps,
    config: ENTRY_SPRING_CONFIG,
  });
  const subtitleOpacity = interpolate(subtitleSpring, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        background: bgColor === "transparent" ? undefined : "radial-gradient(ellipse at 50% 60%, rgba(181,165,125,0.12) 0%, rgba(10,15,20,1) 70%)",
      }}
    >

      {/* Title */}
      <div
        className="uppercase w-full text-center absolute tracking-[0.2em]"
        style={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: "52px",
          color: "#9D8C65",
          top: "160px",
          opacity: titleOpacity,
          transform: `translateY(${titleTranslateY}px)`,
          letterSpacing: "0.18em",
        }}
      >
        {title}
      </div>

      {/* Bars container — full canvas, bars positioned absolutely */}
      <div
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        {bars.slice(0, 4).map((bar, i) => (
          <SingleBar
            key={bar.id}
            bar={bar}
            index={i}
            maxValue={maxValue}
            isTop={i === 0}
            revealLabelsFrame={revealLabelsFrame}
            fps={fps}
            barMaxHeight={BAR_MAX_HEIGHT}
            barWidth={BAR_WIDTH}
            xPos={X_POSITIONS[i]}
            barsBottomOffset={BARS_BOTTOM_OFFSET}
          />
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          top: Math.round(1700 * scaleH),
          left: "10%",
          right: "10%",
          opacity: subtitleOpacity,
        }}
      >
        <div style={{ height: 3, backgroundColor: "#B5A57D", width: "100%", borderRadius: 2 }} />
        <div
          style={{
            color: "#B5A57D",
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 36,
            textAlign: "center",
            marginTop: 20,
            letterSpacing: "0.1em",
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
