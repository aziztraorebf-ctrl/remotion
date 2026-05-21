import React, { useRef } from "react";
import { interpolate, useCurrentFrame } from "remotion";

export interface SubLine {
  text: string;
  start: number;
  end: number;
}

// Affiche les sous-titres en permanence — garde le dernier texte visible entre deux segments.
// Pas de clignotement, pas de trous.
export const SubtitleBar: React.FC<{ lines: SubLine[] }> = ({ lines }) => {
  const frame = useCurrentFrame();
  const lastTextRef = useRef("");

  const active = lines.find(s => frame >= s.start && frame < s.end + 10) ?? null;

  if (active) {
    lastTextRef.current = active.text;
  }

  const text = active ? active.text : lastTextRef.current;

  const opacity = active
    ? interpolate(
        frame,
        [active.start, active.start + 6, active.end + 2, active.end + 10],
        [0, 1, 1, 0.55],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0.55;

  if (!text) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 140,
        left: "50%",
        transform: "translateX(-50%)",
        width: 920,
        textAlign: "center",
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 40,
        color: "#f0e8d8",
        letterSpacing: 1.5,
        lineHeight: 1.3,
        opacity,
        textShadow: "0 2px 14px rgba(0,0,0,0.95), 0 0 32px rgba(0,0,0,0.7)",
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      {text}
    </div>
  );
};
