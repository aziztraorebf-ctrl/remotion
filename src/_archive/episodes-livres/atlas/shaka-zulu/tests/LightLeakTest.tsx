import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { LightLeak } from "@remotion/light-leaks";

// Test composition isolee — NE PAS toucher AtlasShakaFull.tsx
// Objectif : comparer 2 variantes light-leak pour la mort de Nandi (S4)
// Duree : 150 frames (5s a 30fps)
// Variante A (0-60f) : seed=42, hueShift=0, opacite plafonnee 0.35 — choc chaud controle
// Variante B (75-150f) : seed=7, hueShift=300 (blanc/violet froid) — choc froid

export const LIGHT_LEAK_TEST_FRAMES = 150;

export const LightLeakTest: React.FC = () => {
  const frame = useCurrentFrame();

  // Variante A : fond bordeaux + leak orange controle (0-60f)
  const varABg = interpolate(frame, [0, 55, 65], [1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const varALeakOpacity = interpolate(frame, [10, 25, 40, 55], [0, 0.35, 0.35, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pause noire (60-75f)
  const pauseNoire = interpolate(frame, [55, 65, 70, 80], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Variante B : fond bordeaux + leak blanc/froid (75-150f)
  const varBBg = interpolate(frame, [75, 80, 130, 145], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const varBLeakOpacity = interpolate(frame, [85, 100, 120, 135], [0, 0.45, 0.45, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const label = frame < 65 ? "A: hueShift=0 (orange) opacity cap 0.35" : frame < 80 ? "--- PAUSE NOIRE ---" : "B: hueShift=300 (blanc/froid) opacity cap 0.45";

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0A" }}>
      {/* Variante A — fond bordeaux */}
      <AbsoluteFill style={{ backgroundColor: "#5C1A1A", opacity: varABg }} />
      {/* Variante A — light leak orange, opacite controlee */}
      <AbsoluteFill style={{ opacity: varALeakOpacity }}>
        <LightLeak seed={42} hueShift={0} durationInFrames={LIGHT_LEAK_TEST_FRAMES} />
      </AbsoluteFill>

      {/* Pause noire intercalaire */}
      <AbsoluteFill style={{ backgroundColor: "#000000", opacity: pauseNoire }} />

      {/* Variante B — fond bordeaux */}
      <AbsoluteFill style={{ backgroundColor: "#5C1A1A", opacity: varBBg }} />
      {/* Variante B — light leak blanc/froid */}
      <AbsoluteFill style={{ opacity: varBLeakOpacity }}>
        <LightLeak seed={7} hueShift={300} durationInFrames={LIGHT_LEAK_TEST_FRAMES} />
      </AbsoluteFill>

      {/* Label */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 80,
        }}
      >
        <span
          style={{
            color: "#D4A574",
            fontFamily: "serif",
            fontSize: 28,
            opacity: 0.7,
            textShadow: "0 1px 4px #000",
          }}
        >
          {label}
        </span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
