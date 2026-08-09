// P1 — "That's not a people problem. That's a process problem." (3.1s/93f).
// V4 (2026-08-08, diagnostic comparatif verifie frame par frame contre l'original) : ajout des 3
// avatars remplis en stagger sous "PEOPLE PROBLEM" (l'original les a, notre V3 ne les avait pas --
// gros manque d'ancrage humain/emotionnel). Easing expo-out partout (cubic-bezier equivalent) pour
// des transitions qui "collent". Structure de base (cut net, PROCESS calibre, NOT renforce,
// wipe rectangle plein) conservee de la V3, deja validee sur ces points.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MI_COLORS, MI_CLAMP as clamp } from "./theme";

const EXPO_OUT = Easing.bezier(0.16, 1, 0.3, 1);

const T_NOT_ANTICIPATE = 3;
const T_AVATARS_START = 6; // avatars pop en stagger, doivent avoir le temps d'etre VUS avant le cut
const T_PEOPLE_OUT = 26; // laisse ~15f (0.5s) de lecture complete du "PEOPLE PROBLEM" + avatars
const T_WIPE_START = 26; // le wipe demarre au meme instant que le cut (pas avant, sinon PROCESS
const T_WIPE_DUR = 16; //   apparaitrait pendant que PEOPLE est encore visible)
const T_PROCESS_IN = 44;
const T_PROBLEM2_IN = 56;

export const P1Pivot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wipeSpring = spring({ frame: frame - T_WIPE_START, fps, config: { damping: 18, stiffness: 100, mass: 1 }, durationInFrames: T_WIPE_DUR });
  const wipeNavy = interpolate(wipeSpring, [0, 1], [2400, 650], clamp);
  const wipeProgress = interpolate(frame, [T_WIPE_START, T_WIPE_START + T_WIPE_DUR], [0, 1], clamp);

  const notAnticipateScale = interpolate(frame, [T_NOT_ANTICIPATE, T_NOT_ANTICIPATE + 4, T_NOT_ANTICIPATE + 9], [1, 1.025, 1], clamp);

  // avatars remplis en stagger (0.1s d'ecart ~3f), spring avec overshoot visible (V5 : agrandis
  // + bicolores apres breakdown comparatif Gemini+Kimi -- trop petits/monochromes en V4)
  const avatarAnim = (index: number) => {
    const start = T_AVATARS_START + index * 3;
    const sp = spring({ frame: frame - start, fps, config: { damping: 9, stiffness: 150, mass: 0.6 }, durationInFrames: 14 });
    return { opacity: interpolate(sp, [0, 0.3, 1], [0, 1, 1], clamp), scale: sp };
  };

  const peopleOpacity = interpolate(frame, [T_PEOPLE_OUT - 3, T_PEOPLE_OUT + 3], [1, 0], { ...clamp, easing: EXPO_OUT });
  const problem1Opacity = interpolate(frame, [T_PEOPLE_OUT - 3, T_PEOPLE_OUT + 3], [1, 0], { ...clamp, easing: EXPO_OUT });

  const processSpring = spring({ frame: frame - T_PROCESS_IN, fps, config: { damping: 13, stiffness: 190, mass: 0.8 }, durationInFrames: 14 });
  const problem2Opacity = interpolate(frame, [T_PROBLEM2_IN, T_PROBLEM2_IN + 10], [0, 1], { ...clamp, easing: EXPO_OUT });

  return (
    <AbsoluteFill style={{ background: MI_COLORS.offWhite }}>
      <svg viewBox="0 -270 1080 2460" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="mi_grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M0,0 L60,0 L60,60" fill="none" stroke={MI_COLORS.charcoal} strokeWidth="1" opacity="0.05" />
          </pattern>
        </defs>

        <rect x="0" y="-270" width="1080" height="2460" fill={MI_COLORS.offWhite} />
        <rect x="0" y="-270" width="1080" height="2460" fill="url(#mi_grid)" opacity={interpolate(wipeProgress, [0, 1], [1, 0.4])} />

        {/* bascule navy : rectangle plein qui monte (toujours uniforme sur toute la largeur) */}
        <rect x="-50" y={wipeNavy} width="1180" height="3000" fill={MI_COLORS.navy} />
        <rect x="-50" y={wipeNavy} width="1180" height="6" fill={MI_COLORS.magenta} opacity={0.8} />

        {/* texte stable "THAT'S ... A" */}
        <text x="100" y="580" fontFamily="Arial, Helvetica, sans-serif" fontSize="90" fontWeight={900} fill={MI_COLORS.charcoal} letterSpacing={2}>
          THAT&apos;S
        </text>
        <text x="840" y="580" fontFamily="Arial, Helvetica, sans-serif" fontSize="90" fontWeight={900} fill={MI_COLORS.charcoal}>
          A
        </text>

        {/* NOT — jamais sous opacite 1, jamais masque */}
        <g opacity={peopleOpacity} transform={`translate(610, 530) scale(${notAnticipateScale}) translate(-610, -530)`}>
          <rect x="440" y="460" width="340" height="140" rx="70" fill={MI_COLORS.charcoal} />
          <rect x="452" y="472" width="316" height="116" rx="58" fill="none" stroke={MI_COLORS.whiteWarm} strokeWidth="3" strokeDasharray="8 8" />
          <text x="610" y="565" fontFamily="Arial, Helvetica, sans-serif" fontSize="95" fontWeight={900} fill={MI_COLORS.whiteWarm} textAnchor="middle" letterSpacing={4}>
            NOT
          </text>
          <line x1="380" y1="660" x2="860" y2="400" stroke={MI_COLORS.navy} strokeWidth="28" strokeLinecap="round" />
          <line x1="380" y1="660" x2="860" y2="400" stroke={MI_COLORS.whiteWarm} strokeWidth="12" strokeLinecap="round" />
        </g>

        {/* PEOPLE + 3 avatars bicolores agrandis (~200-260px de haut, V5) sous le texte */}
        <g opacity={peopleOpacity}>
          <text x="540" y="880" fontFamily="Arial, Helvetica, sans-serif" fontSize="170" fontWeight={900} fill={MI_COLORS.charcoal} textAnchor="middle" letterSpacing={8}>
            PEOPLE
          </text>
          {[
            { tx: 330, ty: 1120, r: 62, bodyW: 200, back: true },
            { tx: 540, ty: 1080, r: 74, bodyW: 236, back: false },
            { tx: 750, ty: 1120, r: 62, bodyW: 200, back: true },
          ].map((av, i) => {
            const a = avatarAnim(i);
            return (
              <g key={i} opacity={a.opacity} transform={`translate(${av.tx}, ${av.ty}) scale(${a.scale})`} style={{ transformOrigin: `${av.tx}px ${av.ty}px` }}>
                {/* corps : cyan pour les 2 personnages arriere (2e couleur), magenta pour celui du centre */}
                <path
                  d={`M${-av.bodyW / 2},228 C${-av.bodyW / 2},128 ${av.bodyW / 2},128 ${av.bodyW / 2},228 Z`}
                  fill={av.back ? MI_COLORS.cyanDark : MI_COLORS.magenta}
                />
                {/* col (2e couleur sur le personnage central, cree le contraste bicolore) */}
                {!av.back && <path d={`M-40,148 L0,180 L40,148 L40,175 L0,205 L-40,175 Z`} fill={MI_COLORS.cyan} />}
                <circle cx="0" cy="0" r={av.r} fill={av.back ? MI_COLORS.cyanDark : MI_COLORS.magenta} />
              </g>
            );
          })}
        </g>

        <text
          x="540"
          y="1450"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="130"
          fontWeight={400}
          fill={MI_COLORS.charcoal}
          textAnchor="middle"
          letterSpacing={12}
          opacity={problem1Opacity}
        >
          PROBLEM
        </text>

        {/* PROCESS — taille calibree pour tenir dans le cadre 1080px */}
        {frame >= T_PROCESS_IN - 2 && (
          <text
            x="540"
            y="960"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="168"
            fontWeight={900}
            fill={MI_COLORS.magenta}
            textAnchor="middle"
            letterSpacing={4}
            opacity={processSpring}
            transform={`scale(${interpolate(processSpring, [0, 1], [0.9, 1])})`}
            style={{ transformOrigin: "540px 900px" }}
          >
            PROCESS
          </text>
        )}

        <text
          x="540"
          y="1140"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="130"
          fontWeight={400}
          fill={MI_COLORS.whiteWarm}
          textAnchor="middle"
          letterSpacing={12}
          opacity={problem2Opacity}
        >
          PROBLEM
        </text>
      </svg>
    </AbsoluteFill>
  );
};
