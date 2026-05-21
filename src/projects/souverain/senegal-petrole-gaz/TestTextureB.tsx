// Version B — Grain SVG feTurbulence (zéro image externe, déterministe)
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const GoldLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const scaleX = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{
      width: width * 0.55, height: 2,
      background: "linear-gradient(90deg, transparent, #d4a93c, transparent)",
      transformOrigin: "center", transform: `scaleX(${scaleX})`,
      marginBottom: 28,
    }} />
  );
};

const CountUp: React.FC<{ target: number; startFrame: number; endFrame: number }> = ({ target, startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrySpring = spring({ frame: frame - startFrame, fps, config: { damping: 20, stiffness: 80 } });
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const currentValue = Math.round(progress * target);
  const formatted = "$" + currentValue.toLocaleString("en-US");
  const blurAmount = interpolate(entrySpring, [0, 1], [12, 0]);
  const opacity = interpolate(frame - startFrame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowIntensity = interpolate(frame, [startFrame, endFrame], [60, 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <span style={{
      fontSize: 128, fontWeight: 900, color: "#d4a93c",
      letterSpacing: "-0.02em", fontFamily: "Bebas Neue, Impact, Arial Black, sans-serif",
      display: "block", textAlign: "center", opacity,
      filter: `blur(${blurAmount}px) drop-shadow(0 0 ${glowIntensity}px #d4a93c99)`,
      lineHeight: 1,
    }}>
      {formatted}
    </span>
  );
};

const Badge: React.FC<{ label: string; appearFrame: number }> = ({ label, appearFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - appearFrame, fps, config: { damping: 22, stiffness: 120 } });
  const opacity = interpolate(frame - appearFrame, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(t, [0, 1], [0.85, 1]);
  return (
    <div style={{ opacity, transform: `scale(${scale})`, background: "#5a1010", border: "1.5px solid #8b2020", borderRadius: 4, padding: "5px 18px" }}>
      <span style={{ color: "#f5f0e8", fontSize: 22, fontWeight: 700, letterSpacing: "0.12em", fontFamily: "Bebas Neue, Impact, sans-serif" }}>
        {label}
      </span>
    </div>
  );
};

const Baseline: React.FC = () => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const opacity = interpolate(frame, [55, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", bottom: height * 0.055, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 24, opacity }}>
      <span style={{ color: "#d4a93c", fontSize: 16, letterSpacing: "0.2em", fontFamily: "sans-serif", fontWeight: 600 }}>SENEGAL</span>
      <span style={{ color: "#3a5a7a", fontSize: 14 }}>|</span>
      <span style={{ color: "#5a7a9a", fontSize: 15, letterSpacing: "0.12em", fontFamily: "sans-serif" }}>2024</span>
      <span style={{ color: "#3a5a7a", fontSize: 14 }}>|</span>
      <span style={{ color: "#4a6a8a", fontSize: 14, letterSpacing: "0.08em", fontFamily: "sans-serif" }}>Source : Woodside Energy</span>
    </div>
  );
};

// Grain SVG pur — feTurbulence + feColorMatrix
// Résultat : bruit subtil qui donne de la profondeur sans image externe
const SVGGrain: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <defs>
        <filter id="grain" x="0%" y="0%" width="100%" height="100%">
          {/* Bruit de base */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="4"
            seed="2"
            stitchTiles="stitch"
            result="noise"
          />
          {/* Convertir en niveaux de gris semi-transparent */}
          <feColorMatrix
            type="saturate"
            values="0"
            in="noise"
            result="greyNoise"
          />
          <feBlend in="SourceGraphic" in2="greyNoise" mode="overlay" result="blended" />
          <feComponentTransfer in="blended">
            <feFuncA type="linear" slope="0.12" />
          </feComponentTransfer>
        </filter>
      </defs>
      <rect width={width} height={height} filter="url(#grain)" fill="white" opacity="0.12" />
    </svg>
  );
};

export const TestTextureB: React.FC = () => {
  const frame = useCurrentFrame();
  const bgOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0b1f35" }}>
      {/* Radial navy */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at 50% 25%, #0e2240 0%, #070e1a 65%)",
        opacity: bgOpacity,
      }} />

      {/* Grain SVG — feTurbulence déterministe */}
      <SVGGrain />

      {/* Contenu */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: "12%", gap: 0 }}>
        <Badge label="PETROLE OFFSHORE" appearFrame={18} />
        <div style={{ marginTop: 20 }}><GoldLine /></div>
        <CountUp target={8000000} startFrame={22} endFrame={52} />
        <div style={{ marginTop: 10, opacity: interpolate(frame, [30, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <span style={{ color: "#6a8aaa", fontSize: 18, letterSpacing: "0.22em", fontFamily: "sans-serif", textTransform: "uppercase" }}>
            PAR JOUR
          </span>
        </div>
      </AbsoluteFill>

      <Baseline />
    </AbsoluteFill>
  );
};
