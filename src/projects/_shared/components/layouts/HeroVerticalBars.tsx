import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { heroBouncePop } from "../../animations";

export interface VerticalBarSide {
  label: string;        // ex: "EXPORTÉ BRUT"
  sublabel?: string;    // ex: "matière première"
  pctFinal: number;     // valeur finale (ex: 8 ou 92)
  pctDecimals?: number; // décimales du compteur
  color: string;        // couleur de la barre + chiffre
}

interface HeroVerticalBarsProps {
  left: VerticalBarSide;
  right: VerticalBarSide;
  appearFrame: number;
  verdictFrame?: number;     // frame du verdict (pulse sur la barre dominante)
  barDuration?: number;      // durée de montée (frames). Défaut 30
  maxBarHeight?: number;     // hauteur px de la zone barre (100% = pleine). Défaut 620
  barWidth?: number;         // largeur px de chaque barre. Défaut 150
  dominantColor?: string;    // couleur qui "pulse" au verdict. Défaut = right.color
  centerSlot?: React.ReactNode; // objet hero entre les deux barres
  centerWidth?: number;      // largeur px du slot central. Défaut 340
}

/**
 * HERO DATA — Barres comparatives VERTICALES (doctrine SOUVERAIN-REMOTION-PLAYBOOK P7).
 * Frère vertical de HeroMirrorBars. Deux colonnes qui montent depuis le bas : le contraste
 * de HAUTEUR incarne le déséquilibre (la barre dominante écrase visuellement l'autre) et
 * remplit l'espace vertical de l'écran (anti-vide).
 *
 * Label au-dessus de chaque barre, % au pied (sous la barre, ancré au sol). Slot central
 * (objet hero) entre les deux colonnes. Count-up + bounce overshoot + verdict pulse.
 */
const VBar: React.FC<{
  side: VerticalBarSide;
  appearFrame: number;
  barDuration: number;
  maxBarHeight: number;
  barWidth: number;
  verdictFrame: number;
  isDominant: boolean;
}> = ({ side, appearFrame, barDuration, maxBarHeight, barWidth, verdictFrame, isDominant }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { label, sublabel, pctFinal, pctDecimals = 0, color } = side;

  const opacity = interpolate(frame, [appearFrame, appearFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Montée easing convexe (depuis le sol)
  const rawProg = interpolate(frame, [appearFrame, appearFrame + barDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barH = Math.pow(rawProg, 0.75) * (pctFinal / 100) * maxBarHeight;

  // Verdict : pulse de luminosité sur la barre dominante
  const highlight = isDominant
    ? interpolate(
        frame,
        [verdictFrame, verdictFrame + 8, verdictFrame + 16, verdictFrame + 24, verdictFrame + 32],
        [1, 1.5, 1, 1.5, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 1;

  // Count-up + bounce overshoot final
  const counterProg = interpolate(frame, [appearFrame, appearFrame + barDuration + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const counterVal = (counterProg * pctFinal).toFixed(pctDecimals);
  const pctScale = heroBouncePop(frame, appearFrame + barDuration, fps);

  return (
    <div className="flex flex-col items-center justify-end" style={{ opacity, height: maxBarHeight + 180 }}>
      {/* Label au-dessus */}
      <div className="text-center" style={{ marginBottom: 14 }}>
        <div className="text-ivory" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: 2, lineHeight: 1 }}>
          {label}
        </div>
        {sublabel && (
          <div style={{ fontFamily: "monospace", fontSize: 22, color, opacity: 0.75, marginTop: 2 }}>
            {sublabel}
          </div>
        )}
      </div>

      {/* Track + barre qui monte */}
      <div
        className="rounded-t-md overflow-hidden flex items-end"
        style={{ width: barWidth, height: maxBarHeight, background: `${color}1a` }}
      >
        <div
          style={{
            width: "100%",
            height: barH,
            background: `linear-gradient(to top, ${color}, ${color}cc)`,
            boxShadow: `0 0 26px ${color}88`,
            filter: `brightness(${highlight})`,
            borderRadius: "6px 6px 0 0",
          }}
        />
      </div>

      {/* % au pied, ancré au sol */}
      <div
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 96,
          color,
          lineHeight: 1,
          marginTop: 10,
          transform: `scale(${pctScale})`,
          textShadow: `0 0 28px ${color}88`,
        }}
      >
        {counterVal}%
      </div>
    </div>
  );
};

export const HeroVerticalBars: React.FC<HeroVerticalBarsProps> = ({
  left,
  right,
  appearFrame,
  verdictFrame = 999999,
  barDuration = 30,
  maxBarHeight = 620,
  barWidth = 150,
  dominantColor,
  centerSlot,
  centerWidth = 340,
}) => {
  const dom = dominantColor ?? right.color;

  return (
    <div className="flex flex-row items-end justify-center w-full" style={{ gap: 8 }}>
      <VBar
        side={left}
        appearFrame={appearFrame}
        barDuration={barDuration}
        maxBarHeight={maxBarHeight}
        barWidth={barWidth}
        verdictFrame={verdictFrame}
        isDominant={left.color === dom}
      />

      <div className="flex items-center justify-center shrink-0" style={{ width: centerWidth, height: maxBarHeight + 180 }}>
        {centerSlot}
      </div>

      <VBar
        side={right}
        appearFrame={appearFrame}
        barDuration={barDuration}
        maxBarHeight={maxBarHeight}
        barWidth={barWidth}
        verdictFrame={verdictFrame}
        isDominant={right.color === dom}
      />
    </div>
  );
};
