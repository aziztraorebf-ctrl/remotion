import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// ---- Timing constants ----
// f0-10   : fade in fond
// f0-18   : ligne dorée s'étire
// f18-22  : flash + badge apparait
// f22-52  : countUp $0 → $8,000,000 (avec easing expo)
// f52-90  : stable + baseline fade in

// ---- Ligne dorée animée ----
const GoldLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const scaleX = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        width: width * 0.55,
        height: 2,
        background: "linear-gradient(90deg, transparent, #d4a93c, transparent)",
        transformOrigin: "center",
        transform: `scaleX(${scaleX})`,
        marginBottom: 28,
      }}
    />
  );
};

// ---- CountUp animé ----
const CountUp: React.FC<{ target: number; startFrame: number; endFrame: number }> = ({
  target,
  startFrame,
  endFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring pour l'entrée (blur + scale)
  const entrySpring = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  // Valeur countUp avec easing expo
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  const currentValue = Math.round(progress * target);

  const formatted = "$" + currentValue.toLocaleString("en-US");

  const blurAmount = interpolate(entrySpring, [0, 1], [12, 0]);
  const opacity = interpolate(frame - startFrame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow qui pulse légèrement pendant le countUp
  const glowIntensity = interpolate(frame, [startFrame, endFrame], [60, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <span
      style={{
        fontSize: 128,
        fontWeight: 900,
        color: "#d4a93c",
        letterSpacing: "-0.02em",
        fontFamily: "Bebas Neue, Impact, Arial Black, sans-serif",
        display: "block",
        textAlign: "center",
        opacity,
        filter: `blur(${blurAmount}px) drop-shadow(0 0 ${glowIntensity}px #d4a93c99)`,
        lineHeight: 1,
      }}
    >
      {formatted}
    </span>
  );
};

// ---- Badge label ----
const Badge: React.FC<{ label: string; appearFrame: number; color: string; borderColor: string }> = ({
  label,
  appearFrame,
  color,
  borderColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = spring({
    frame: frame - appearFrame,
    fps,
    config: { damping: 22, stiffness: 120 },
  });

  const opacity = interpolate(frame - appearFrame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(t, [0, 1], [0.85, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        background: color,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 4,
        padding: "5px 18px",
      }}
    >
      <span
        style={{
          color: "#f5f0e8",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "0.12em",
          fontFamily: "Bebas Neue, Impact, sans-serif",
        }}
      >
        {label}
      </span>
    </div>
  );
};

// ---- Baseline journalistique ----
const Baseline: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const opacity = interpolate(frame, [55, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: height * 0.055,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        opacity,
      }}
    >
      <span style={{ color: "#d4a93c", fontSize: 16, letterSpacing: "0.2em", fontFamily: "sans-serif", fontWeight: 600 }}>
        SENEGAL
      </span>
      <span style={{ color: "#3a5a7a", fontSize: 14 }}>|</span>
      <span style={{ color: "#5a7a9a", fontSize: 15, letterSpacing: "0.12em", fontFamily: "sans-serif" }}>
        2024
      </span>
      <span style={{ color: "#3a5a7a", fontSize: 14 }}>|</span>
      <span style={{ color: "#4a6a8a", fontSize: 14, letterSpacing: "0.08em", fontFamily: "sans-serif" }}>
        Source : Woodside Energy
      </span>
    </div>
  );
};

// ---- Fond : vague pétrole qui monte ----
const OilLevelBg: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // La ligne monte légèrement au fil du countUp — narrativement justifié
  const baseY = interpolate(frame, [22, 52], [height * 0.72, height * 0.65], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const buildWave = (offsetY: number, phase: number, amp: number): string => {
    const pts = 32;
    const segW = width / pts;
    let d = `M 0 ${offsetY}`;
    for (let i = 0; i <= pts; i++) {
      const x = i * segW;
      const y = offsetY + Math.sin((i / pts) * Math.PI * 5 + frame * 0.035 + phase) * amp;
      d += ` L ${x} ${y}`;
    }
    d += ` L ${width} ${height} L 0 ${height} Z`;
    return d;
  };

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const wave1 = buildWave(baseY, 0, 18);
  const wave2 = buildWave(baseY + 14, Math.PI * 0.65, 12);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="oilGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a2a1a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#041008" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path d={wave2} fill="#051a10" opacity={fadeIn * 0.5} />
      <path d={wave1} fill="url(#oilGrad)" opacity={fadeIn} />
    </svg>
  );
};

// ---- Composition principale ----
export const TestWaveReveal: React.FC = () => {
  const frame = useCurrentFrame();

  const bgOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#070e1a" }}>
      {/* Fond radial subtil */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 25%, #0e2240 0%, #070e1a 65%)",
          opacity: bgOpacity,
        }}
      />

      {/* Fond pétrole qui monte */}
      <OilLevelBg />

      {/* Contenu centré — légèrement au-dessus du centre */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: "12%",
          gap: 0,
        }}
      >
        {/* Badge */}
        <Badge label="PETROLE OFFSHORE" appearFrame={18} color="#5a1010" borderColor="#8b2020" />

        {/* Ligne dorée */}
        <div style={{ marginTop: 20 }}>
          <GoldLine />
        </div>

        {/* Grand chiffre countUp */}
        <CountUp target={8000000} startFrame={22} endFrame={52} />

        {/* Sous-unité */}
        <div
          style={{
            marginTop: 10,
            opacity: interpolate(frame, [30, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <span
            style={{
              color: "#6a8aaa",
              fontSize: 18,
              letterSpacing: "0.22em",
              fontFamily: "sans-serif",
              textTransform: "uppercase",
            }}
          >
            PAR JOUR
          </span>
        </div>
      </AbsoluteFill>

      {/* Baseline journalistique */}
      <Baseline />
    </AbsoluteFill>
  );
};
