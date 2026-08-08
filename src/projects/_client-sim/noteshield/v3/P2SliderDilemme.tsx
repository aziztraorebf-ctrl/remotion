// P2 — "Le dilemme visualise." 10.9 -> ~13.9s absolu (frame 280-358, 78f relatif au panneau).
//
// NOUVEAU (V3 mix incarne, storyboard GPT externe repris) : slider horizontal degrade
// rouge->bleu, curseur qui oscille entre les deux extremes puis se fige au centre pendant que
// la voix dit "discernement" (mot qui tombe ~48f apres le debut de ce panneau, cf STORYBOARD-V3
// § P2). Icone utilisateur frustre a gauche ("trop strict"), silhouette suspecte a droite
// ("trop laxe"). SVG maison, palette theme.ts (pas de nouvelle couleur inventee).
//
// Regle projet : spring() pour l'entree, interpolate() pour l'oscillation continue (mouvement
// pilote par le temps, pas un impact). Tout interpolate() clampe.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { NS_COLORS } from "../ui/theme";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const TRACK_X_START = 560;
const TRACK_X_END = 1360;
const TRACK_Y = 540;
const TRACK_CENTER = (TRACK_X_START + TRACK_X_END) / 2;

// Le mot "discernement" tombe ~48f apres le debut du panneau (cf brief remotion-composer,
// timing.ts P2 = 280-358f absolu, mot mesure a l'alignment ~ frame 391-413 absolu -> le curseur
// doit deja etre fige quand ce panneau cede la place a P3). Oscillation sur les premieres 48f,
// puis freeze centre.
const T_FREEZE_FRAME = 48;
const OSC_CYCLES = 2.4; // nombre d'allers-retours avant le freeze

export const P2SliderDilemme: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 20, stiffness: 200 } });
  const entranceOpacity = interpolate(entrance, [0, 1], [0, 1], clamp);
  const entranceY = interpolate(entrance, [0, 1], [24, 0], clamp);

  // Oscillation amortie : amplitude decroit progressivement jusqu'a T_FREEZE_FRAME, ou le
  // curseur se retrouve exactement au centre (progress=0.5) -- pas de saut au moment du freeze.
  const oscProgress = Math.min(frame / T_FREEZE_FRAME, 1);
  const dampedAmp = (1 - oscProgress) * 0.42; // 0.42 = amplitude max autour du centre (0..1)
  const oscillation =
    frame < T_FREEZE_FRAME
      ? Math.sin(frame * (Math.PI * 2 * OSC_CYCLES) / T_FREEZE_FRAME) * dampedAmp
      : 0;
  const cursorProgress = 0.5 + oscillation; // 0..1 le long du track
  const cursorX = TRACK_X_START + cursorProgress * (TRACK_X_END - TRACK_X_START);

  const frozen = frame >= T_FREEZE_FRAME;
  // Leger halo de confirmation quand le curseur se fige (pulse court, pas de mouvement en boucle
  // infinie -- ce panneau est court, la certitude visuelle doit se lire vite).
  const freezeGlow = frozen
    ? interpolate(frame, [T_FREEZE_FRAME, T_FREEZE_FRAME + 12, T_FREEZE_FRAME + 30], [0, 1, 0.55], clamp)
    : 0;

  // Labels lateraux : entree legerement decalee (gauche puis droite), lisibilite avant
  // l'oscillation du curseur.
  const leftLabelOpacity = interpolate(frame, [6, 20], [0, 1], clamp);
  const rightLabelOpacity = interpolate(frame, [12, 26], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: NS_COLORS.navyDeep }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs>
          <linearGradient id="p2-track-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={NS_COLORS.red} />
            <stop offset="50%" stopColor={NS_COLORS.ivoryMuted} />
            <stop offset="100%" stopColor={NS_COLORS.cyan} />
          </linearGradient>
          <filter id="p2-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g opacity={entranceOpacity} transform={`translate(0, ${entranceY})`}>
          {/* Track */}
          <rect
            x={TRACK_X_START}
            y={TRACK_Y - 6}
            width={TRACK_X_END - TRACK_X_START}
            height={12}
            rx={6}
            fill="url(#p2-track-gradient)"
            opacity={0.85}
          />
          <line
            x1={TRACK_CENTER}
            y1={TRACK_Y - 26}
            x2={TRACK_CENTER}
            y2={TRACK_Y + 26}
            stroke={NS_COLORS.ivoryMuted}
            strokeWidth={2}
            strokeDasharray="4 6"
            opacity={0.5}
          />

          {/* Icone gauche -- utilisateur frustre (silhouette + trait tension) */}
          <g opacity={leftLabelOpacity} transform={`translate(${TRACK_X_START - 210}, ${TRACK_Y})`}>
            <circle cx={0} cy={-46} r={30} fill="none" stroke={NS_COLORS.red} strokeWidth={3} opacity={0.85} />
            <path d="M -14 -52 L -4 -42" stroke={NS_COLORS.red} strokeWidth={3} strokeLinecap="round" />
            <path d="M 14 -52 L 4 -42" stroke={NS_COLORS.red} strokeWidth={3} strokeLinecap="round" />
            <path d="M -12 -30 Q 0 -38 12 -30" stroke={NS_COLORS.red} strokeWidth={3} fill="none" strokeLinecap="round" />
            <path
              d="M -34 40 Q 0 10 34 40 L 34 60 L -34 60 Z"
              fill="none"
              stroke={NS_COLORS.red}
              strokeWidth={3}
              opacity={0.85}
            />
            <text
              x={0}
              y={104}
              textAnchor="middle"
              fill={NS_COLORS.ivory}
              fontFamily="'Space Grotesk', 'Inter', sans-serif"
              fontSize={22}
              fontWeight={600}
            >
              TROP STRICT
            </text>
            <text
              x={0}
              y={132}
              textAnchor="middle"
              fill={NS_COLORS.ivoryMuted}
              fontFamily="'IBM Plex Mono', monospace"
              fontSize={16}
              letterSpacing={1}
            >
              Productivité basse
            </text>
          </g>

          {/* Icone droite -- silhouette suspecte (contour flou/pointille) */}
          <g opacity={rightLabelOpacity} transform={`translate(${TRACK_X_END + 210}, ${TRACK_Y})`}>
            <circle
              cx={0}
              cy={-46}
              r={30}
              fill="none"
              stroke={NS_COLORS.cyan}
              strokeWidth={3}
              strokeDasharray="5 5"
              opacity={0.85}
            />
            <path
              d="M -34 40 Q 0 10 34 40 L 34 60 L -34 60 Z"
              fill="none"
              stroke={NS_COLORS.cyan}
              strokeWidth={3}
              strokeDasharray="5 5"
              opacity={0.85}
            />
            <text
              x={0}
              y={104}
              textAnchor="middle"
              fill={NS_COLORS.ivory}
              fontFamily="'Space Grotesk', 'Inter', sans-serif"
              fontSize={22}
              fontWeight={600}
            >
              TROP LAXE
            </text>
            <text
              x={0}
              y={132}
              textAnchor="middle"
              fill={NS_COLORS.ivoryMuted}
              fontFamily="'IBM Plex Mono', monospace"
              fontSize={16}
              letterSpacing={1}
            >
              Risque élevé
            </text>
          </g>

          {/* Halo de confirmation au freeze */}
          {freezeGlow > 0 && (
            <circle
              cx={cursorX}
              cy={TRACK_Y}
              r={44 + freezeGlow * 14}
              fill={NS_COLORS.cyan}
              opacity={freezeGlow * 0.18}
              filter="url(#p2-glow)"
            />
          )}

          {/* Curseur */}
          <g transform={`translate(${cursorX}, ${TRACK_Y})`}>
            <circle r={22} fill={NS_COLORS.navyPanel} stroke={NS_COLORS.ivory} strokeWidth={3} />
            <circle r={8} fill={frozen ? NS_COLORS.cyan : NS_COLORS.ivory} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
