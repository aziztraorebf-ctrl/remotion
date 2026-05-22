import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { Zap, Diamond, TrendingUp, Users, Flag, Crown, Globe, Shield } from "lucide-react";

export type GlitchIcon = "zap" | "diamond" | "trending" | "users" | "flag" | "crown" | "globe" | "shield";

export interface GlitchRevealProps {
  topLabel?: string;
  mainStat?: string;
  contextLabel?: string;
  icon?: GlitchIcon;
  subtitle?: string;
  bgColor?: string;
}

const GLITCH_CHARS = "!@#$%^&*<>?/|\\[]{}0123456789ABCDEF";

const FAKE_STATS = ["???", "ERR", "---", "###", "███", "∞∞∞", "NaN", "404"];

const pseudoRandom = (frame: number, slot: number): number => {
  const x = Math.sin(frame * 9.1 + slot * 7.3) * 43758.5453;
  return x - Math.floor(x);
};

const glitchedChar = (frame: number, pos: number): string => {
  const idx = Math.floor(pseudoRandom(frame, pos + 100) * GLITCH_CHARS.length);
  return GLITCH_CHARS[idx] ?? "X";
};

const buildGlitchedLabel = (label: string, frame: number): string => {
  return label
    .split("")
    .map((_, i) => glitchedChar(frame, i))
    .join("");
};

const ICON_MAP: Record<GlitchIcon, React.FC<{ size?: number; color?: string }>> = {
  zap: ({ size, color }) => <Zap size={size} color={color} />,
  diamond: ({ size, color }) => <Diamond size={size} color={color} />,
  trending: ({ size, color }) => <TrendingUp size={size} color={color} />,
  users: ({ size, color }) => <Users size={size} color={color} />,
  flag: ({ size, color }) => <Flag size={size} color={color} />,
  crown: ({ size, color }) => <Crown size={size} color={color} />,
  globe: ({ size, color }) => <Globe size={size} color={color} />,
  shield: ({ size, color }) => <Shield size={size} color={color} />,
};

export const GlitchReveal: React.FC<GlitchRevealProps> = ({
  topLabel = "RESSOURCES",
  mainStat = "$40B",
  contextLabel = "EXTRACTION",
  icon = "diamond",
  subtitle = "AFRIQUE · 2024",
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Phase boundaries
  const PHASE_BLANK_END = 8;
  const PHASE_GLITCH_END = 60;
  const PHASE_STAB_END = 90;
  const PHASE_REVEAL_END = 180;

  const isBlank = frame < PHASE_BLANK_END;
  const isGlitching = frame >= PHASE_BLANK_END && frame < PHASE_GLITCH_END;
  const isStabilizing = frame >= PHASE_GLITCH_END && frame < PHASE_STAB_END;
  const isRevealed = frame >= PHASE_STAB_END;

  // Glitch intensity: 1 during full glitch, decreasing during stabilization
  const glitchIntensity = isGlitching
    ? 1
    : isStabilizing
    ? interpolate(frame, [PHASE_GLITCH_END, PHASE_STAB_END], [1, 0], { extrapolateRight: "clamp" })
    : 0;

  // Fake stat display
  const fakeStatIdx = Math.floor(pseudoRandom(frame, 42) * FAKE_STATS.length);
  const displayStat = isGlitching || isStabilizing ? FAKE_STATS[fakeStatIdx] : mainStat;

  // Label display: glitched or real
  const displayLabel =
    glitchIntensity > 0.5 ? buildGlitchedLabel(contextLabel, frame) : contextLabel;

  // Glitch color for text
  const glitchColorIdx = Math.floor(pseudoRandom(frame, 99) * 3);
  const glitchColors = ["#00fff0", "#ff00ff", "#c4a053"];
  const activeGlitchColor = glitchColors[glitchColorIdx] ?? "#00fff0";

  // Text color: glitch color during glitch, ivory when revealed
  const statColor = isRevealed
    ? "#f2ebd9"
    : isStabilizing
    ? interpolate(frame, [PHASE_GLITCH_END, PHASE_STAB_END], [0, 1], { extrapolateRight: "clamp" }) > 0.5
      ? "#c4a053"
      : activeGlitchColor
    : activeGlitchColor;

  // translateX glitch on text
  const glitchOffsetX = isGlitching
    ? (pseudoRandom(frame, 77) - 0.5) * 16 * glitchIntensity
    : isStabilizing
    ? (pseudoRandom(frame, 77) - 0.5) * 8 * glitchIntensity
    : 0;

  // skewX glitch
  const glitchSkewX = glitchIntensity > 0 ? (pseudoRandom(frame, 55) - 0.5) * 4 * glitchIntensity : 0;

  // Scanline
  const scanlineTop = (frame * 18) % height;
  const scanlineOpacity = isRevealed ? 0.04 : 0.12 * glitchIntensity + 0.04;

  // Glitch blocks (only during glitch/stab phases)
  const glitchBlocks = Array.from({ length: 7 }, (_, i) => ({
    top: pseudoRandom(frame + i, i * 13) * (height * 0.94),
    left: pseudoRandom(frame + i, i * 7) * (width * 0.83),
    width: 20 + pseudoRandom(frame, i * 11) * 180,
    height: 2 + pseudoRandom(frame, i * 5) * 6,
    color: i % 3 === 0 ? "#00fff0" : i % 3 === 1 ? "#ff00ff" : "#c4a053",
    opacity: (0.2 + pseudoRandom(frame + i, i) * 0.4) * glitchIntensity,
  }));

  // Icon spring reveal (starts at frame 90)
  const iconScale = spring({
    fps,
    frame: frame - PHASE_STAB_END,
    config: { damping: 80, stiffness: 60, mass: 1 },
  });
  const clampedIconScale = interpolate(iconScale, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  // Icon opacity derived from scale — always in DOM to reserve layout space
  const iconOpacity = clampedIconScale;

  // Top label fade in (starts frame 8)
  const topLabelOpacity = interpolate(frame, [PHASE_BLANK_END, PHASE_BLANK_END + 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Stat glow — more intense on reveal
  const statGlow = isRevealed
    ? "0 0 80px rgba(196,160,83,0.7), 0 0 160px rgba(196,160,83,0.35)"
    : "none";

  // Overall visibility
  const rootOpacity = isBlank ? 0 : 1;

  const IconComponent = ICON_MAP[icon];

  // Dot grid background
  const dotGridStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "radial-gradient(circle, rgba(196,160,83,0.20) 1px, transparent 1px)",
    backgroundSize: "28px 28px",
  };

  return (
    <div
      style={{
        width,
        height,
        background: bgColor,
        position: "relative",
        overflow: "hidden",
        opacity: rootOpacity,
        fontFamily: "Cinzel, serif",
      }}
    >
      {/* Dot grid */}
      <div style={dotGridStyle} />

      {/* Glitch blocks */}
      {glitchBlocks.map((block, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: block.top,
            left: block.left,
            width: block.width,
            height: block.height,
            background: block.color,
            opacity: block.opacity,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Scanline */}
      <div
        style={{
          position: "absolute",
          top: scanlineTop,
          left: 0,
          width: "100%",
          height: 2,
          background: `rgba(196,160,83,${scanlineOpacity})`,
          pointerEvents: "none",
        }}
      />

      {/* Top label */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "Cinzel, serif",
          fontSize: 48,
          color: "#c4a053",
          letterSpacing: "0.18em",
          opacity: topLabelOpacity,
          transform: `translateX(${glitchOffsetX * 0.4}px)`,
        }}
      >
        {topLabel}
      </div>

      {/* Icon — center of screen vertically */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* Icon — always in DOM to reserve layout space, opacity drives visibility */}
        <div
          style={{
            opacity: iconOpacity,
            color: "#c4a053",
            marginBottom: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Glow background */}
          <div
            style={{
              position: "absolute",
              width: 340,
              height: 340,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(196,160,83,0.18) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <IconComponent size={240} color="#c4a053" />
        </div>

        {/* Main stat */}
        <div
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: 220,
            color: statColor,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            transform: `translateX(${glitchOffsetX}px) skewX(${glitchSkewX}deg)`,
            textShadow: statGlow,
            transition: "none",
          }}
        >
          {displayStat}
        </div>

        {/* Context label */}
        <div
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 52,
            color: isRevealed ? "#c4a053" : activeGlitchColor,
            letterSpacing: "0.3em",
            marginTop: 32,
            transform: `translateX(${glitchOffsetX * 0.6}px)`,
            opacity: topLabelOpacity,
          }}
        >
          {displayLabel}
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 26,
          color: "#64748b",
          letterSpacing: "0.2em",
          opacity: isRevealed
            ? interpolate(frame, [PHASE_STAB_END, PHASE_STAB_END + 20], [0, 1], {
                extrapolateRight: "clamp",
              })
            : 0,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};
