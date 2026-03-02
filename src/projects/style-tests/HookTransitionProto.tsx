import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ============================================================
// HookTransition PROTOTYPE — Wipe horizontal encre (droite -> gauche)
//
// Concept : une vague d'encre arrive de droite, couvre l'ecran,
// puis repart vers la gauche pour reveler la scene suivante.
// Geste "tourner la page de manuscrit medievale".
//
// Duree : 50f total
//   Phase 1 (0-25f)  : encre arrive de droite (couvre)
//   Phase 2 (25-50f) : encre repart vers la gauche (revele)
//
// Demo : fond parchemin (avant) -> fond encre/noir (apres)
// ============================================================

const PARCHMENT = "#F5E6C8";
const INK_DEEP = "#0D0804";
const GOLD = "#C9A227";

const WIPE_DOWN_START = 0;
const WIPE_DOWN_END = 25;
const WIPE_UP_START = 25;
const WIPE_UP_END = 50;
const TOTAL_FRAMES = 90; // prototype: 20f avant + 50f transition + 20f apres

export const HookTransitionProto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 : rideau arrive de droite (0 -> 25f)
  const wipeInX = interpolate(
    frame,
    [WIPE_DOWN_START, WIPE_DOWN_END],
    [1920, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => t * t * (3 - 2 * t), // ease-in-out
    }
  );

  // Phase 2 : rideau repart vers la gauche (25 -> 50f) — spring naturel
  const wipeOutProgress = spring({
    frame: Math.max(0, frame - WIPE_UP_START),
    fps,
    config: { damping: 18, stiffness: 70 },
  });
  const wipeOutX = interpolate(wipeOutProgress, [0, 1], [0, -1920], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Le rideau est en phase entree jusqu'a f25, puis phase sortie
  const curtainX = frame < WIPE_UP_START ? wipeInX : wipeOutX;

  // La scene "apres" apparait quand le rideau a couvert l'ecran (f25+)
  const afterOpacity = interpolate(frame, [WIPE_UP_START, WIPE_UP_START + 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Scene AVANT — parchemin (visible f0-f25) */}
      <AbsoluteFill style={{ backgroundColor: PARCHMENT }}>
        <svg width="1920" height="1080" style={{ position: "absolute" }}>
          <rect x="24" y="24" width="1872" height="1032" fill="none" stroke={GOLD} strokeWidth={5} opacity={0.65} />
          <text
            x="960"
            y="500"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#1A1008"
            fontSize={72}
            fontFamily="Georgia, serif"
            fontStyle="italic"
            opacity={0.6}
          >
            Scene precedente
          </text>
          <text
            x="960"
            y="580"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#1A1008"
            fontSize={36}
            fontFamily="Georgia, serif"
            opacity={0.4}
          >
            (fond parchemin)
          </text>
        </svg>
      </AbsoluteFill>

      {/* Scene APRES — encre (revelee par le wipe) */}
      <AbsoluteFill style={{ backgroundColor: INK_DEEP, opacity: afterOpacity }}>
        <svg width="1920" height="1080" style={{ position: "absolute" }}>
          <rect x="24" y="24" width="1872" height="1032" fill="none" stroke={GOLD} strokeWidth={5} opacity={0.5} />
          <text
            x="960"
            y="500"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={PARCHMENT}
            fontSize={72}
            fontFamily="Georgia, serif"
            fontStyle="italic"
            opacity={0.7}
          >
            Scene suivante
          </text>
          <text
            x="960"
            y="580"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={PARCHMENT}
            fontSize={36}
            fontFamily="Georgia, serif"
            opacity={0.4}
          >
            (fond encre)
          </text>
        </svg>
      </AbsoluteFill>

      {/* RIDEAU ENCRE — le coeur de la transition */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: curtainX,
          width: "100%",
          height: "100%",
          backgroundColor: INK_DEEP,
          overflow: "hidden",
        }}
      >
        {/* Bord gauche du rideau — liseré or, bord de page */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 4,
            height: "100%",
            backgroundColor: GOLD,
            opacity: 0.6,
          }}
        />
        {/* Grain sur le rideau */}
        <svg
          width="1920"
          height="1080"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            mixBlendMode: "overlay",
            opacity: 0.07,
            pointerEvents: "none",
          }}
        >
          <defs>
            <filter id="grainTrans">
              <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="3" seed={frame % 8} />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>
          <rect width="1920" height="1080" filter="url(#grainTrans)" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
