import React, { useRef } from "react";
import { interpolate, useCurrentFrame } from "remotion";

export interface SubLine {
  text: string;
  start: number;
  end: number;
}

/**
 * HERO DATA — Sous-titre persistant (doctrine SOUVERAIN-REMOTION-PLAYBOOK P3).
 * Promotion du SubtitleBar de Silicon Savannah en composant _shared Tailwind.
 *
 * Garde le dernier texte visible entre deux segments (pas de clignotement, pas de trous).
 * Opacité en cascade : 0 → 1 (in) → 1 (hold) → 0.55 (fade doux entre segments).
 *
 * Couleur/typo via classe Tailwind (text-ivory). Position/ombre/opacity restent inline
 * (valeurs dynamiques + textShadow non tokenisable) — conforme self-review G7.
 */
export const SubtitleBarSouverain: React.FC<{ lines: SubLine[]; bottomPx?: number }> = ({
  lines,
  bottomPx = 140,
}) => {
  const frame = useCurrentFrame();
  const lastTextRef = useRef("");

  const active = lines.find((s) => frame >= s.start && frame < s.end + 10) ?? null;
  if (active) lastTextRef.current = active.text;
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
      className="absolute left-1/2 text-center text-ivory pointer-events-none"
      style={{
        bottom: bottomPx,
        transform: "translateX(-50%)",
        width: 920,
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 40,
        letterSpacing: 1.5,
        lineHeight: 1.3,
        opacity,
        textShadow: "0 2px 14px rgba(0,0,0,0.95), 0 0 32px rgba(0,0,0,0.7)",
        zIndex: 100,
      }}
    >
      {text}
    </div>
  );
};
