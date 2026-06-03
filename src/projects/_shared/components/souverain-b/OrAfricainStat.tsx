import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BandeauNoir } from "./BandeauNoir";

// ─────────────────────────────────────────────────────────────────────────────
// OrAfricainStat — Brique stat brutale plein écran (Mode A Or Africain)
//
// Fond noir/dark, chiffre énorme animé count-up, mini-graphe linéaire optionnel,
// bandeau noir titré jaune en bas.
// ─────────────────────────────────────────────────────────────────────────────

export interface OrAfricainStatProps {
  value: number;                     // valeur cible du count-up
  valueDisplay?: (n: number) => string; // formateur optionnel
  prefix?: string;                   // ex: "$"
  suffix?: string;                   // ex: "B", "%"
  topLabel?: string;                 // mini-label en haut (ex: "CHIFFRE CHOC")
  subline?: string;                  // sous le chiffre
  bandeauText: string;               // texte du bandeau noir bas
  bandeauHighlight?: string;         // 2e ligne du bandeau
  valueColor?: string;
  background?: "noir" | "navy";      // défaut noir
  showMiniGraph?: boolean;
}

const COLORS = {
  yellow:    "#f4c534",
  yellowHi:  "#ffd84d",
  navy:      "#0d1520",
  black:     "#080a10",
  ivory:     "#f2ebd9",
  slate:     "rgba(242,235,217,0.55)",
};

export const OrAfricainStat: React.FC<OrAfricainStatProps> = ({
  value,
  valueDisplay,
  prefix = "",
  suffix = "",
  topLabel,
  subline,
  bandeauText,
  bandeauHighlight,
  valueColor = COLORS.yellowHi,
  background = "noir",
  showMiniGraph = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelP = spring({ frame, fps, config: { damping: 18 }, durationInFrames: 25 });
  const valueP = spring({ frame: frame - 8, fps, config: { damping: 100, stiffness: 80 }, durationInFrames: 50 });
  const sublineP = spring({ frame: frame - 40, fps, config: { damping: 18 }, durationInFrames: 25 });

  const currentValue = interpolate(valueP, [0, 1], [0, value], { extrapolateRight: "clamp" });
  const displayed = valueDisplay
    ? valueDisplay(currentValue)
    : Math.round(currentValue).toString();

  return (
    <AbsoluteFill style={{
      background: background === "noir" ? COLORS.black : COLORS.navy,
      backgroundImage: "radial-gradient(rgba(244,197,52,0.06) 1.5px, transparent 1.5px)",
      backgroundSize: "30px 30px",
    }}>
      {/* Top label */}
      {topLabel && (
        <div style={{
          position: "absolute", top: 100, left: 0, right: 0,
          textAlign: "center", opacity: labelP,
        }}>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 22,
            color: COLORS.yellow, letterSpacing: 6, textTransform: "uppercase",
          }}>{topLabel}</div>
        </div>
      )}

      {/* Centre — chiffre choc */}
      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 60px",
      }}>
        <div style={{
          fontFamily: "Georgia, serif",
          fontSize: 280,
          fontWeight: 700,
          color: valueColor,
          lineHeight: 1,
          opacity: Math.min(1, valueP * 1.4),
          transform: `scale(${0.88 + 0.12 * valueP})`,
          textShadow: `0 0 50px ${valueColor}66`,
          textAlign: "center",
        }}>
          {prefix}{displayed}{suffix}
        </div>

        {subline && (
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: 30,
            fontStyle: "italic",
            color: COLORS.slate,
            marginTop: 40,
            textAlign: "center",
            opacity: sublineP,
            maxWidth: 900,
            lineHeight: 1.3,
          }}>{subline}</div>
        )}

        {/* Mini-graphe linéaire optionnel — ligne ascendante simple */}
        {showMiniGraph && (
          <svg width="500" height="80" style={{ marginTop: 60, opacity: sublineP * 0.7 }}>
            <line
              x1={0} y1={70}
              x2={500 * Math.min(1, valueP)} y2={70 - 60 * Math.min(1, valueP)}
              stroke={COLORS.yellow}
              strokeWidth={4}
              strokeLinecap="round"
            />
            <circle
              cx={500 * Math.min(1, valueP)}
              cy={70 - 60 * Math.min(1, valueP)}
              r={8}
              fill={COLORS.yellowHi}
            />
          </svg>
        )}
      </AbsoluteFill>

      <BandeauNoir
        text={bandeauText}
        entityHighlight={bandeauHighlight}
        delayFrames={30}
      />
    </AbsoluteFill>
  );
};
