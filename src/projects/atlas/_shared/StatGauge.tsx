import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

type StatGaugeProps = {
  label: string;
  icon: string;
  fromValue: number;
  toValue: number;
  startFrame: number;
  durationFrames: number;
  position?: { top: number; right: number };
  color?: string;
  format?: (n: number) => string;
  hideRanges?: Array<[number, number]>;
};

export const StatGauge: React.FC<StatGaugeProps> = ({
  label,
  icon,
  fromValue,
  toValue,
  startFrame,
  durationFrames,
  position = { top: 80, right: 50 },
  color = "#E6C76E",
  format = (n) => Math.round(n).toLocaleString("fr-FR"),
  hideRanges = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const reveal = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 18, stiffness: 140 },
  });

  const fadeRamp = 8;
  const hideOpacity = (() => {
    let mult = 1;
    for (const [hStart, hEnd] of hideRanges) {
      if (frame >= hStart - fadeRamp && frame < hStart) {
        mult = Math.min(mult, interpolate(frame, [hStart - fadeRamp, hStart], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      } else if (frame >= hStart && frame < hEnd) {
        mult = 0;
      } else if (frame >= hEnd && frame < hEnd + fadeRamp) {
        mult = Math.min(mult, interpolate(frame, [hEnd, hEnd + fadeRamp], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      }
    }
    return mult;
  })();

  const progress = interpolate(
    frame,
    [startFrame + 8, startFrame + 8 + durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const value = fromValue + (toValue - fromValue) * progress;
  const delta = toValue - fromValue;
  const deltaSign = delta < 0 ? "-" : "+";

  return (
    <div
      style={{
        position: "absolute",
        top: position.top,
        right: position.right,
        opacity: reveal * hideOpacity,
        transform: `translateY(${(1 - reveal) * -20}px)`,
        background: "rgba(20, 14, 8, 0.72)",
        border: `1.5px solid ${color}`,
        borderRadius: 6,
        padding: "10px 16px 12px 16px",
        fontFamily: "monospace",
        color: "#F5E9C9",
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        minWidth: 180,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <span style={{ fontSize: 13, opacity: 0.75, letterSpacing: 1, textTransform: "uppercase" }}>
          {label}
        </span>
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          color,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {format(value)}
      </div>
      {progress > 0.05 && progress < 0.95 && (
        <div
          style={{
            fontSize: 14,
            color: delta < 0 ? "#FF8A6B" : "#9FE39F",
            fontVariantNumeric: "tabular-nums",
            marginTop: 2,
          }}
        >
          {deltaSign}
          {format(Math.abs(delta * progress))}
        </div>
      )}
    </div>
  );
};
