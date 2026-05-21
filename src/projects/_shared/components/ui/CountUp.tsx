import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface CountUpProps {
  target: number;
  startFrame: number;
  endFrame: number;
  prefix?: string;     // ex: "$"
  suffix?: string;     // ex: "/JOUR"
  fontSize?: number;   // défaut 128
  color?: string;      // défaut #d4a93c
  locale?: string;     // défaut "en-US"
}

export const CountUp: React.FC<CountUpProps> = ({
  target,
  startFrame,
  endFrame,
  prefix = "$",
  suffix,
  fontSize = 128,
  color = "#d4a93c",
  locale = "en-US",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrySpring = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  const currentValue = Math.round(progress * target);
  const formatted = prefix + currentValue.toLocaleString(locale);

  const blurAmount = interpolate(entrySpring, [0, 1], [12, 0]);
  const opacity = interpolate(frame - startFrame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowIntensity = interpolate(frame, [startFrame, endFrame], [60, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <span
      style={{
        fontSize,
        fontWeight: 900,
        color,
        letterSpacing: "-0.02em",
        fontFamily: "Bebas Neue, Impact, Arial Black, sans-serif",
        display: "block",
        textAlign: "center",
        opacity,
        filter: `blur(${blurAmount}px) drop-shadow(0 0 ${glowIntensity}px ${color}99)`,
        lineHeight: 1,
      }}
    >
      {formatted}
      {suffix && (
        <span style={{ fontSize: fontSize * 0.35, letterSpacing: "0.15em", marginLeft: 8 }}>
          {suffix}
        </span>
      )}
    </span>
  );
};
