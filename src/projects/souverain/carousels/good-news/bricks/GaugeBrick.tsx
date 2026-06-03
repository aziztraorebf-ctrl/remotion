import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { GN } from "../theme";

/**
 * GaugeBrick — brique animée "jauge / compteur" pour une nouvelle chiffrée.
 * Arc qui se remplit + grand chiffre qui compte jusqu'à la valeur cible.
 * Charte Good News lumineuse. Fond transparent (posé sur le fond de slide).
 *
 * Ex : Kenya "90 %" renouvelable.
 */

export interface GaugeBrickProps {
  /** valeur cible (0-100) */
  value: number;
  /** suffixe affiché après le chiffre, ex "%" ou "" */
  suffix?: string;
  /** libellé court sous la jauge, ex "d'électricité renouvelable" */
  label?: string;
  /** couleur de l'arc actif (défaut gold) */
  arcColor?: string;
}

const SIZE = 460;
const STROKE = 30;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;
// On dessine un arc de 270° (gauge ouverte en bas).
const ARC_SPAN = 0.75; // 270/360

export const GaugeBrick: React.FC<GaugeBrickProps> = ({ value, suffix = "%", label, arcColor = GN.gold }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame, fps, config: { damping: 200, mass: 1.4 }, durationInFrames: 84 });
  const shown = value * progress;
  const filled = (shown / 100) * ARC_SPAN; // fraction du cercle remplie
  const dash = CIRC * ARC_SPAN;
  const offset = CIRC * filled;

  const popIn = interpolate(frame, [0, 14], [0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${popIn})` }}>
      <div style={{ position: "relative", width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} style={{ transform: "rotate(135deg)" }}>
          {/* rail */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={GN.hairline}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${CIRC}`}
          />
          {/* arc actif */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={arcColor}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${offset} ${CIRC}`}
            style={{
              // micro-respiration une fois la jauge pleine (anti-boucle-morte)
              filter: progress >= 0.999 ? `drop-shadow(0 0 ${6 + 5 * (0.5 + 0.5 * Math.sin(frame / 11))}px ${arcColor})` : undefined,
            }}
          />
        </svg>
        {/* chiffre central */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 150,
              fontWeight: 700,
              color: GN.ink,
              lineHeight: 1,
            }}
          >
            {Math.round(shown)}
            <span style={{ fontSize: 80, color: GN.goldDeep }}>{suffix}</span>
          </span>
          {label && (
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 30,
                color: GN.inkSoft,
                marginTop: 8,
                maxWidth: 340,
                textAlign: "center",
                lineHeight: 1.25,
              }}
            >
              {label}
            </span>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
