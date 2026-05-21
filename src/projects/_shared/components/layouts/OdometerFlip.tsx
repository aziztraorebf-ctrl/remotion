import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// ─── Constants ────────────────────────────────────────────────────────────────

const CASE_WIDTH = 240;
const CASE_HEIGHT = 300;
const DIGIT_FONT_SIZE = 220;
const CASE_BG = "#0a0f1a";
const GOLD_COLOR = "#c8a951";
const BORDER_COLOR = "#c8a951";
const FONT_FAMILY = '"IBM Plex Mono", "Space Mono", monospace';
const LABEL_FONT = '"Inter", sans-serif';

// Chiffres dans le rouleau — on boucle 0-9
const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

// ─── Types ────────────────────────────────────────────────────────────────────

interface OdometerFlipProps {
  toValue: string;
  label?: string;
  subtitle?: string;
  spinStartFrame?: number;
  spinStagger?: number;
  spinDuration?: number;
}

// ─── Single digit case ────────────────────────────────────────────────────────

interface DigitCaseProps {
  toDigit: string;
  triggerFrame: number;
  spinDuration: number;
  frame: number;
  fps: number;
  index: number;
}

function DigitCase({ toDigit, triggerFrame, spinDuration, frame, fps, index }: DigitCaseProps) {
  const targetIndex = DIGITS.indexOf(toDigit);
  // Si le caractere n'est pas un chiffre (ex: ":"), afficher statique
  const isNumeric = targetIndex !== -1;

  // ── Entry spring — la case tombe du haut ──────────────────────────────────
  const entryProgress = spring({
    frame: frame - (triggerFrame - 15),
    fps,
    config: { damping: 80, stiffness: 60 },
  });
  const caseOpacity = interpolate(entryProgress, [0, 1], [0, 1]);
  const caseTranslateY = interpolate(entryProgress, [0, 1], [30, 0]);

  // ── Slot machine spin ──────────────────────────────────────────────────────
  // Phase 1 : spin rapide lineaire pendant spinDuration frames
  // Phase 2 : spring overshoot qui s'arrete sur le bon index
  const relFrame = frame - triggerFrame;

  // Nombre de tours complets pendant la phase rapide (+ stagger par index pour effet cascade)
  const SPIN_LOOPS = 2 + index * 0.5;
  const spinEndIndex = SPIN_LOOPS * 10 + targetIndex;

  // Phase rapide : 0 → spinEndIndex sur spinDuration frames (lineaire, rapide)
  const fastProgress = interpolate(relFrame, [0, spinDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fastScrollIndex = fastProgress * spinEndIndex;

  // Phase spring : overshoot sur targetIndex avec rebond
  const springProgress = spring({
    frame: relFrame - spinDuration,
    fps,
    config: { damping: 18, stiffness: 140, mass: 0.8 },
  });
  // spring va de l'index juste avant le target (apres les tours) vers le target exact
  const springScrollIndex = interpolate(springProgress, [0, 1], [spinEndIndex - 1.5, targetIndex], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Merge : avant spinDuration = fast, apres = spring
  const scrollIndex = relFrame < spinDuration ? fastScrollIndex : springScrollIndex;

  // translateY du strip : chaque chiffre fait CASE_HEIGHT px de haut
  // index 0 = "0" en haut. translateY negatif = on descend dans le strip.
  const stripTranslateY = isNumeric ? -scrollIndex * CASE_HEIGHT : 0;

  const digitStyle: React.CSSProperties = {
    fontSize: DIGIT_FONT_SIZE,
    fontFamily: FONT_FAMILY,
    lineHeight: 1,
    userSelect: "none",
    height: CASE_HEIGHT,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  return (
    <div
      style={{
        opacity: caseOpacity,
        transform: `translateY(${caseTranslateY}px)`,
        border: `4px solid ${BORDER_COLOR}`,
        borderRadius: 16,
        width: CASE_WIDTH,
        height: CASE_HEIGHT,
        position: "relative",
        overflow: "hidden",
        backgroundColor: CASE_BG,
        flexShrink: 0,
      }}
    >
      {isNumeric ? (
        /* Rouleau vertical — strip de 10 chiffres */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            transform: `translateY(${stripTranslateY}px)`,
            willChange: "transform",
          }}
        >
          {DIGITS.map((d) => (
            <span
              key={d}
              className="text-ivory font-black"
              style={digitStyle}
            >
              {d}
            </span>
          ))}
        </div>
      ) : (
        /* Caractere non-numerique — statique centre */
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-ivory font-black" style={{ fontSize: DIGIT_FONT_SIZE, fontFamily: FONT_FAMILY, lineHeight: 1 }}>
            {toDigit}
          </span>
        </div>
      )}

      {/* Gradients haut/bas pour effet de fondu profondeur */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "35%",
          background: `linear-gradient(to bottom, ${CASE_BG}, transparent)`,
          zIndex: 5,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "35%",
          background: `linear-gradient(to top, ${CASE_BG}, transparent)`,
          zIndex: 5,
          pointerEvents: "none",
        }}
      />

      {/* DIVIDER LINE — ligne dorée au centre */}
      <div
        className="absolute left-0 w-full z-10"
        style={{
          height: 2,
          top: "50%",
          backgroundColor: GOLD_COLOR,
        }}
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function OdometerFlip({
  toValue,
  label,
  subtitle,
  spinStartFrame = 20,
  spinStagger = 12,
  spinDuration = 30,
}: OdometerFlipProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const digits = Array.from({ length: toValue.length }, (_, i) => ({
    toDigit: toValue[i],
    triggerFrame: spinStartFrame + i * spinStagger,
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: "#060a10" }}>
      {/* Label decoratif */}
      {label && (
        <div
          className="absolute left-0 right-0 text-center text-slate uppercase font-light tracking-[0.5em]"
          style={{ top: 160, fontFamily: LABEL_FONT, fontSize: 24, opacity: 0.65 }}
        >
          {label}
        </div>
      )}

      {/* Cases — centrees verticalement */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-row gap-3 items-stretch">
          {digits.map((d, i) => (
            <DigitCase
              key={i}
              index={i}
              toDigit={d.toDigit}
              triggerFrame={d.triggerFrame}
              spinDuration={spinDuration}
              frame={frame}
              fps={fps}
            />
          ))}
        </div>
      </div>

      {/* Separateur or + subtitle */}
      {subtitle && (
        <div
          className="absolute left-0 right-0 flex flex-col items-center"
          style={{ top: "calc(50% + 180px)" }}
        >
          <div className="bg-gold mb-6" style={{ width: 500, height: 3 }} />
          <div
            className="text-ivory font-normal tracking-wide text-center"
            style={{ fontFamily: LABEL_FONT, fontSize: 36 }}
          >
            {subtitle}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
}
