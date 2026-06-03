import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { heroBouncePop } from "../../animations";

export interface MirrorBarSide {
  label: string;        // ex: "ENVOIE 200 KES"
  sublabel?: string;    // ex: "≈ 1,5€"
  pctFinal: number;     // valeur finale (ex: 5 ou 0.22)
  pctDecimals?: number; // décimales du compteur (ex: 0 ou 2)
  barRatio?: number;    // largeur relative de la barre (0-1). Défaut 1
  color: string;        // couleur de la barre + chiffre
}

interface HeroMirrorBarsProps {
  left: MirrorBarSide;
  right: MirrorBarSide;
  appearFrame: number;       // frame d'apparition des barres
  verdictFrame?: number;     // frame du "verdict" (vibration + pulse sur la barre alarmante)
  barDuration?: number;      // durée de croissance de la barre (frames). Défaut 25
  alarmColor?: string;       // couleur qui déclenche vibration/pulse au verdict. Défaut = left.color
  centerSlot?: React.ReactNode; // élément central optionnel (pièce, icône hero)
}

/**
 * HERO DATA — Barres comparatives miroir (doctrine SOUVERAIN-REMOTION-PLAYBOOK P7, métaphore physique).
 * Extrait de Silicon Savannah Beat4 (5% rouge vs 0.22% vert).
 *
 * Deux barres opposées qui s'allongent en parallèle (slide spring asynchrone, easing convexe),
 * count-up sur chaque chiffre, bounce overshoot final, et "verdict" optionnel (vibration + pulse
 * sur la barre alarmante). Slot central optionnel pour un objet hero (pièce, balance).
 *
 * Couleurs passées en prop (dynamiques par côté) — restent inline, conforme G7.
 */
const BarCol: React.FC<{
  side: MirrorBarSide;
  appearFrame: number;
  barDuration: number;
  alignRight: boolean;
  verdictFrame: number;
  isAlarm: boolean;
}> = ({ side, appearFrame, barDuration, alignRight, verdictFrame, isAlarm }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { label, sublabel, pctFinal, pctDecimals = 0, barRatio = 1, color } = side;

  const colOpacity = interpolate(frame, [appearFrame, appearFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const colSlide = interpolate(
    spring({ frame: frame - appearFrame, fps, config: { damping: 70, stiffness: 55 }, durationInFrames: 30 }),
    [0, 1],
    [alignRight ? -30 : 30, 0]
  );

  // Easing convexe sur la croissance de la barre
  const rawProg = interpolate(frame, [appearFrame, appearFrame + barDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barWidth = Math.pow(rawProg, 0.7) * 100;
  const barComplete = frame >= appearFrame + barDuration;

  // Verdict : vibration + pulse de luminosité sur la barre alarmante
  const barVibrate =
    isAlarm && barComplete && frame < appearFrame + barDuration + 20
      ? Math.sin((frame - (appearFrame + barDuration)) * 0.8) * 2
      : 0;
  const barHighlight = isAlarm
    ? interpolate(
        frame,
        [verdictFrame, verdictFrame + 8, verdictFrame + 16, verdictFrame + 24, verdictFrame + 32],
        [1, 1.6, 1, 1.6, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 1;
  const pctShake =
    isAlarm && frame >= verdictFrame && frame < verdictFrame + 12
      ? Math.sin((frame - verdictFrame) * 3.5) * 3
      : 0;

  // Count-up + bounce overshoot final
  const counterProg = interpolate(frame, [appearFrame, appearFrame + barDuration + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const counterVal = (counterProg * pctFinal).toFixed(pctDecimals);
  const pctScale = heroBouncePop(frame, appearFrame + barDuration, fps);

  const textAlign = alignRight ? "right" : "left";

  return (
    <div
      className="flex flex-col gap-3 w-full"
      style={{
        opacity: colOpacity,
        transform: `translateX(${colSlide}px)`,
        alignItems: alignRight ? "flex-end" : "flex-start",
      }}
    >
      <div style={{ textAlign, width: "100%" }}>
        <div className="text-ivory" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 35, letterSpacing: 3 }}>
          {label}
        </div>
        {sublabel && (
          <div className="text-gold" style={{ fontFamily: "monospace", fontSize: 24, opacity: 0.7 }}>
            {sublabel}
          </div>
        )}
      </div>

      <div
        className="w-full overflow-hidden rounded"
        style={{
          height: 70,
          background: `${color}22`,
          transform: `rotate(${barVibrate}deg)`,
          transformOrigin: alignRight ? "right center" : "left center",
          filter: `brightness(${barHighlight})`,
        }}
      >
        <div
          style={{
            width: `${barWidth * barRatio}%`,
            height: "100%",
            background: color,
            borderRadius: 4,
            boxShadow: `0 0 20px ${color}99`,
            marginLeft: alignRight ? "auto" : 0,
          }}
        />
      </div>

      <div
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 120,
          color,
          lineHeight: 1,
          transform: `scale(${pctScale}) translateX(${pctShake}px)`,
          transformOrigin: alignRight ? "right center" : "left center",
          textShadow: `0 0 30px ${color}88, 0 0 60px ${color}44`,
          width: "100%",
          textAlign,
        }}
      >
        {counterVal}%
      </div>
    </div>
  );
};

export const HeroMirrorBars: React.FC<HeroMirrorBarsProps> = ({
  left,
  right,
  appearFrame,
  verdictFrame = 999999,
  barDuration = 25,
  alarmColor,
  centerSlot,
}) => {
  const alarm = alarmColor ?? left.color;

  return (
    <div className="flex flex-row items-center justify-center w-full px-12">
      <div className="flex flex-col items-end justify-center" style={{ flex: "0 0 35%", paddingRight: 24 }}>
        <BarCol
          side={left}
          appearFrame={appearFrame}
          barDuration={barDuration}
          alignRight
          verdictFrame={verdictFrame}
          isAlarm={left.color === alarm}
        />
      </div>

      <div className="flex items-center justify-center shrink-0" style={{ width: 350 }}>
        {centerSlot}
      </div>

      <div className="flex flex-col items-start justify-center" style={{ flex: "0 0 35%", paddingLeft: 24 }}>
        <BarCol
          side={right}
          appearFrame={appearFrame}
          barDuration={barDuration}
          alignRight={false}
          verdictFrame={verdictFrame}
          isAlarm={right.color === alarm}
        />
      </div>
    </div>
  );
};
