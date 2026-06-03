import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { heroBouncePop } from "../../animations";

interface CountUpProps {
  target: number;
  startFrame: number;
  endFrame: number;
  prefix?: string;     // ex: "$"
  suffix?: string;     // ex: "/JOUR"
  fontSize?: number;   // défaut 128
  color?: string;      // défaut gold #c8a951
  locale?: string;     // défaut "en-US"
  decimals?: number;   // HERO DATA : décimales (ex: 2 pour "0.22%"). Défaut 0 (toLocaleString entier)
  bounce?: boolean;    // HERO DATA : preset "hero" — overshoot scale sur la valeur finale (P1)
}

/**
 * Compteur animé 0 → target avec glow doré.
 * Preset HERO DATA (bounce + decimals) : voir SOUVERAIN-REMOTION-PLAYBOOK P1 (Chiffre-Événement).
 * - decimals : permet les valeurs fractionnaires ("0.22%") via toFixed au lieu de Math.round.
 * - bounce : ajoute l'overshoot physique (scale 1→1.06→1) quand le count-up s'arrête à endFrame.
 */
export const CountUp: React.FC<CountUpProps> = ({
  target,
  startFrame,
  endFrame,
  prefix = "$",
  suffix,
  fontSize = 128,
  color = "#c8a951",
  locale = "en-US",
  decimals = 0,
  bounce = false,
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

  // HERO DATA : décimales paramétriques (toFixed) ou entier formaté (toLocaleString)
  const rawValue = progress * target;
  const valueStr =
    decimals > 0
      ? rawValue.toFixed(decimals)
      : Math.round(rawValue).toLocaleString(locale);
  const formatted = prefix + valueStr;

  const blurAmount = interpolate(entrySpring, [0, 1], [12, 0]);
  const opacity = interpolate(frame - startFrame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowIntensity = interpolate(frame, [startFrame, endFrame], [60, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // HERO DATA : overshoot physique sur la valeur finale (P1). Déclenché à endFrame.
  const bounceScale = bounce ? heroBouncePop(frame, endFrame, fps) : 1;

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
        transform: `scale(${bounceScale})`,
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
