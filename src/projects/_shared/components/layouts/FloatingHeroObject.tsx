import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { floatSin, glowOscillate, pingRing } from "../../animations";

interface FloatingHeroObjectProps {
  /** Image à projeter (staticFile path). Sinon, passer un enfant (icône Lucide / SVG). */
  src?: string;
  children?: React.ReactNode;
  /** Frame d'apparition (entrée spring scale 0.3→1). Défaut 0. */
  appearFrame?: number;
  /** Taille du carré conteneur en px. Défaut 350. */
  size?: number;
  /** Couleur du halo + ring. Défaut gold #c8a951. */
  color?: string;
  /** Active le ping-ring concentrique. Défaut true. */
  ring?: boolean;
  /** Amplitude du float vertical (px). Défaut 6. */
  floatAmplitude?: number;
  /** Masque l'image en cercle (évite le carré visible d'un PNG sur fond non transparent). Défaut false. */
  clipCircle?: boolean;
  /** Balancement rotatif doux (rotateY sinusoïdal) — 2e secondary motion, donne du relief. Défaut false. */
  spin?: boolean;
}

/**
 * HERO DATA — Objet hero flottant + halo + ping-ring (doctrine SOUVERAIN-REMOTION-PLAYBOOK P5).
 * Pattern ABSENT du catalogue avant 2026-06-02 — extrait de Silicon Savannah (pièce, Nokia).
 *
 * Secondary motion permanent : un objet statique reste vivant via
 * float sinusoïdal + glow oscillant + anneau concentrique pulsant.
 * Évite l'effet "diaporama PowerPoint".
 *
 * Couleurs/halo restent inline (valeurs dynamiques rgba/box-shadow non tokenisables) — conforme G7.
 */
export const FloatingHeroObject: React.FC<FloatingHeroObjectProps> = ({
  src,
  children,
  appearFrame = 0,
  size = 350,
  color = "#c8a951",
  ring = true,
  floatAmplitude = 6,
  clipCircle = false,
  spin = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame: frame - appearFrame,
    fps,
    config: { damping: 14, stiffness: 90 },
    durationInFrames: 40,
  });
  const scale = interpolate(entry, [0, 1], [0.3, 1.0]);
  const float = floatSin(frame, floatAmplitude, 110);
  const glowRadius = glowOscillate(frame, 20, 80);
  const ringState = pingRing(frame);
  // 2e secondary motion : balancement rotatif doux (±12° en Y) — relief sans tour gadget
  const spinDeg = spin ? Math.sin(frame / 75) * 12 : 0;

  const baseTransform = `translateY(${float}px) scale(${scale})`;
  // L'objet (image/enfant) reçoit en plus le balancement rotatif ; le halo/ring restent stables.
  const objectTransform = spin
    ? `${baseTransform} perspective(800px) rotateY(${spinDeg}deg)`
    : baseTransform;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Halo glow oscillant (derrière) */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size,
          height: size,
          boxShadow: `0 0 ${glowRadius}px ${glowRadius / 2}px ${color}a6`,
          transform: baseTransform,
        }}
      />

      {/* Ping-ring concentrique */}
      {ring && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: size,
            height: size,
            border: `2px solid ${color}`,
            transform: `translateY(${float}px) scale(${ringState.scale})`,
            opacity: ringState.opacity,
          }}
        />
      )}

      {/* Objet hero : image OU enfant (icône/SVG) */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: size,
          height: size,
          transform: objectTransform,
          ...(clipCircle
            ? {
                borderRadius: "50%",
                overflow: "hidden",
                // Masque radial doux : le carré du PNG se fond dans le fond
                maskImage: "radial-gradient(circle at 50% 50%, #000 58%, transparent 72%)",
                WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 58%, transparent 72%)",
              }
            : {}),
        }}
      >
        {src ? (
          <Img
            src={staticFile(src)}
            style={{ width: size, height: size, objectFit: "contain" }}
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
};
