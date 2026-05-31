import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

/**
 * CarouselCtaSlide — slide CTA statique (fin de carrousel). Fond navy doctrine,
 * logo K&C, flèche play, message d'action vers le profil. Pas de clip vidéo.
 * Format 1080x1350 (4:5).
 */

const NAVY = "#16213a";
const GOLD = "#c8a951";
const IVORY = "#f5efe0";

export interface CarouselCtaSlideProps {
  line1: string;
  line2: string;
  totalSlides: number;
}

function ProgressBar({ total }: { total: number }) {
  return (
    <div style={{ display: "flex", gap: 8, width: "100%" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, backgroundColor: GOLD }} />
      ))}
    </div>
  );
}

// Cadence typewriter : 1 lettre toutes les CHARS_PER_FRAME frames
const TYPE_START = 14;          // début de la frappe (laisse le temps à la flèche d'apparaître)
const FRAMES_PER_CHAR = 1.6;    // ~19 lettres/s à 30fps — lisible mais soutenu

export const CarouselCtaSlide: React.FC<CarouselCtaSlideProps> = ({ line1, line2, totalSlides }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [4, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Typewriter ligne 1
  const charsTyped = Math.max(0, Math.floor((frame - TYPE_START) / FRAMES_PER_CHAR));
  const typedText = line1.slice(0, Math.min(charsTyped, line1.length));
  const typingDone = charsTyped >= line1.length;
  const typeEndFrame = TYPE_START + line1.length * FRAMES_PER_CHAR;

  // Curseur clignotant pendant la frappe
  const cursorOn = !typingDone && Math.floor(frame / 8) % 2 === 0;

  // Ligne 2 apparaît après la frappe (fade + léger slide depuis le bas)
  const line2Op = interpolate(frame, [typeEndFrame + 6, typeEndFrame + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Y = interpolate(frame, [typeEndFrame + 6, typeEndFrame + 24], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Flèche play : pulse doux une fois la ligne 2 visible
  const arrowPulse = typingDone ? 1 + 0.06 * Math.sin((frame / 14) * Math.PI * 2) : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(200,169,81,0.08) 0%, transparent 62%)" }} />

      {/* Header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "28px 40px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 18, color: GOLD, letterSpacing: 4, fontWeight: 700 }}>K&amp;C</span>
        </div>
        <ProgressBar total={totalSlides} />
      </div>

      {/* Centre : flèche play + message */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 80px", opacity: fadeIn }}>
        <div style={{ width: 96, height: 96, borderRadius: "50%", border: `3px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 48, transform: `scale(${arrowPulse})` }}>
          <div style={{ width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderLeft: `30px solid ${GOLD}`, marginLeft: 8 }} />
        </div>
        {/* Ligne 1 — typewriter (hauteur réservée pour éviter le saut de layout) */}
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: 56, fontWeight: 700, color: IVORY, lineHeight: 1.25, textAlign: "center", margin: "0 0 28px", minHeight: 140 }}>
          {typedText}
          <span style={{ opacity: cursorOn ? 1 : 0, color: GOLD, fontWeight: 400 }}>|</span>
        </h2>
        {/* Ligne 2 — apparaît après la frappe */}
        <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 40, color: GOLD, textAlign: "center", lineHeight: 1.3, margin: 0, opacity: line2Op, transform: `translateY(${line2Y}px)` }}>
          {line2}
        </p>
      </AbsoluteFill>

      {/* Footer */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 0 36px", textAlign: "center" }}>
        <span style={{ color: GOLD, fontSize: 24, letterSpacing: 3, fontWeight: 700 }}>@koraetcartes</span>
      </div>
    </AbsoluteFill>
  );
};
