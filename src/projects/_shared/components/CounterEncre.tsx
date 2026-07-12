import React from "react";
import { spring, interpolate } from "remotion";
import { PARCH, PARCH_DIM } from "../svg-library/palette";

export interface CounterEncreProps {
  x: number;
  y: number;
  /** Valeur finale atteinte par le roll-up (compteur animé de 0 à target). */
  target: number;
  frame: number;
  fps: number;
  /**
   * "badge" : petit compteur encadré en pointillés, unité inline (ex: "6%"), label dessous.
   *   Registre compact — CounterEncre original (ProtoDataVizEncre).
   * "display" : gros chiffre plein écran, unité/légende affichée après un délai, avec
   *   ligne séparatrice + note optionnelle en couleur d'accent. Registre plein écran —
   *   CounterFull original (ProtoDataVizPleinEcran).
   */
  variant?: "badge" | "display";
  /** Unité affichée immédiatement après la valeur (variant "badge"), ex: "%". */
  unit?: string;
  /** Libellé sous la valeur (variant "badge") ou légende sous le gros chiffre (variant "display"). */
  label?: string;
  /** Note secondaire affichée sous la légende, en `accentColor` (variant "display" uniquement). */
  note?: string;
  /**
   * Couleur d'accent pour la note (variant "display"). Défaut "#e07a5f" (terracotta cacao),
   * hors palette encre/parchemin de base — c'est une couleur de donnée (mise en évidence
   * d'un chiffre choc), pas une couleur de registre visuel, donc non extraite dans palette.ts.
   */
  accentColor?: string;
  /** Formatteur de la valeur affichée (ex: séparateurs de milliers). */
  formatValue?: (value: number) => string;
  startFrame?: number;
}

/**
 * Compteur numérique "roll-up" animé (spring-based), style encre/parchemin.
 * Unifie CounterEncre (ProtoDataVizEncre) et CounterFull (ProtoDataVizPleinEcran).
 */
export const CounterEncre: React.FC<CounterEncreProps> = ({
  x,
  y,
  target,
  frame,
  fps,
  variant = "badge",
  unit = "",
  label,
  note,
  accentColor = "#e07a5f",
  formatValue = (v) => String(v),
  startFrame = 10,
}) => {
  const progress = spring({ frame: frame - startFrame, fps, config: { damping: 15, mass: 1 } });
  const value = Math.round(target * progress);

  if (variant === "display") {
    const unitOp = interpolate(frame, [startFrame + 50, startFrame + 70], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <g>
        <text x={x} y={y} textAnchor="middle" fill={PARCH} fontSize={180} fontFamily="Georgia, serif" fontWeight="bold">
          {formatValue(value)}
        </text>
        <g opacity={unitOp}>
          {label && (
            <text x={x} y={y + 80} textAnchor="middle" fill={PARCH_DIM} fontSize={36} fontFamily="Georgia, serif" fontStyle="italic">
              {label}
            </text>
          )}
          <line x1={x - 260} y1={y + 100} x2={x + 260} y2={y + 100} stroke={PARCH_DIM} strokeWidth={1} opacity={0.4} />
          {note && (
            <text x={x} y={y + 160} textAnchor="middle" fill={accentColor} fontSize={28} fontFamily="Georgia, serif">
              {note}
            </text>
          )}
        </g>
      </g>
    );
  }

  return (
    <g>
      <rect x={x - 70} y={y - 30} width={140} height={70} rx={8} fill="none" stroke={PARCH_DIM} strokeWidth={1.5} strokeDasharray="8 4" />
      <text x={x} y={y + 8} textAnchor="middle" fill={PARCH} fontSize={36} fontFamily="Georgia, serif" fontWeight="bold">
        {formatValue(value)}
        {unit}
      </text>
      {label && (
        <text x={x} y={y + 30} textAnchor="middle" fill={PARCH_DIM} fontSize={13} fontFamily="Georgia, serif" fontStyle="italic">
          {label}
        </text>
      )}
    </g>
  );
};
