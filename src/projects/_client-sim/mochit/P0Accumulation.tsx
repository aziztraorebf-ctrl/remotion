// Panneau 0 — "Still juggling emails, spreadsheets, sticky notes?" (2.7s/81f).
// V5 (2026-08-08, breakdown comparatif Gemini+Kimi verifie contre l'original) : icones
// AGRANDIES x2 (visaient ~13-17% de largeur mais paraissaient ~8% a l'ecran -- l'echelle
// d'entree 0.7->1 sans overshoot + le monochrome les faisaient paraitre petites/plates),
// BICOLORES (rose + cyan, comme la reference qui utilise 2 couleurs par icone), et animees
// avec un vrai spring overshoot (scale depasse 1 puis se stabilise, pas un scale plat).
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MI_COLORS, MI_CLAMP as clamp } from "./theme";

const LINES = [
  { text: "STILL USING", y: 500, size: 78, weight: 400, color: MI_COLORS.charcoal, start: 2 },
  { text: "EMAILS", y: 660, size: 140, weight: 900, color: MI_COLORS.magenta, start: 10 },
  { text: "SPREADSHEETS", y: 810, size: 96, weight: 900, color: MI_COLORS.magenta, start: 18 },
  { text: "STICKY NOTES?", y: 930, size: 80, weight: 900, color: MI_COLORS.magenta, start: 26 },
];

export const P0Accumulation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineAnim = (start: number) => {
    const sp = spring({ frame: frame - start, fps, config: { damping: 14, stiffness: 220, mass: 0.7 }, durationInFrames: 9 });
    return { opacity: sp, y: interpolate(sp, [0, 1], [24, 0]), scale: interpolate(sp, [0, 1], [0.92, 1]) };
  };

  // spring avec overshoot visible (stiffness elevee + damping modere -> depasse 1 puis se stabilise)
  const iconAnim = (start: number) => {
    const sp = spring({ frame: frame - start, fps, config: { damping: 9, stiffness: 140, mass: 0.6 }, durationInFrames: 16 });
    return { opacity: interpolate(sp, [0, 0.3, 1], [0, 1, 1], clamp), scale: sp };
  };

  const envelope = iconAnim(10);
  const screenA = iconAnim(18);
  const note = iconAnim(26);

  return (
    <AbsoluteFill style={{ background: MI_COLORS.offWhite }}>
      <svg viewBox="0 -270 1080 2460" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <rect x="0" y="-270" width="1080" height="2460" fill={MI_COLORS.offWhite} />

        {LINES.map((l, i) => {
          const a = lineAnim(l.start);
          return (
            <text
              key={i}
              x="540"
              y={l.y}
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize={l.size}
              fontWeight={l.weight}
              fill={l.color}
              textAnchor="middle"
              opacity={a.opacity}
              transform={`translate(0, ${a.y}) scale(${a.scale})`}
              style={{ transformOrigin: `540px ${l.y}px` }}
            >
              {l.text}
            </text>
          );
        })}

        {/* icones bicolores agrandies (~190-210px = ~18-19% largeur), spring overshoot,
            groupees dans le tiers inferieur avec marge de 80px+ vs le texte au-dessus */}
        <g opacity={envelope.opacity} transform={`translate(240, 1350) scale(${envelope.scale})`} style={{ transformOrigin: "240px 1350px" }}>
          {/* ombre portee (profondeur) */}
          <ellipse cx="0" cy="118" rx="105" ry="14" fill={MI_COLORS.charcoal} opacity={0.08} />
          {/* corps enveloppe rose */}
          <path d="M-105,-65 L105,-65 L105,65 L-105,65 Z" fill={MI_COLORS.magenta} />
          {/* rabat cyan (2e couleur) */}
          <path d="M-105,-65 L0,20 L105,-65 Z" fill={MI_COLORS.cyan} />
          {/* liseré du rabat */}
          <path d="M-105,-65 L0,20 L105,-65" fill="none" stroke={MI_COLORS.offWhite} strokeWidth="6" strokeLinejoin="round" />
          {/* papier visible en transparence */}
          <rect x="-55" y="-40" width="110" height="60" rx="4" fill={MI_COLORS.offWhite} opacity={0.5} />
        </g>

        <g opacity={screenA.opacity} transform={`translate(540, 1350) scale(${screenA.scale})`} style={{ transformOrigin: "540px 1350px" }}>
          <ellipse cx="0" cy="130" rx="115" ry="14" fill={MI_COLORS.charcoal} opacity={0.08} />
          {/* pied ecran cyan (2e couleur, en arriere-plan) */}
          <rect x="-24" y="72" width="48" height="34" rx="4" fill={MI_COLORS.cyanDark} />
          <rect x="-60" y="98" width="120" height="14" rx="6" fill={MI_COLORS.cyanDark} />
          {/* corps ecran rose */}
          <rect x="-115" y="-80" width="230" height="152" rx="10" fill={MI_COLORS.magenta} />
          {/* zone d'affichage cyan clair */}
          <rect x="-95" y="-60" width="190" height="112" rx="4" fill={MI_COLORS.cyan} opacity={0.9} />
          {/* lignes de contenu blanches */}
          <rect x="-78" y="-42" width="156" height="16" rx="3" fill={MI_COLORS.offWhite} opacity={0.9} />
          <rect x="-78" y="-14" width="72" height="16" rx="3" fill={MI_COLORS.offWhite} opacity={0.65} />
          <rect x="6" y="-14" width="72" height="16" rx="3" fill={MI_COLORS.offWhite} opacity={0.65} />
          <rect x="-78" y="14" width="72" height="16" rx="3" fill={MI_COLORS.offWhite} opacity={0.65} />
        </g>

        <g opacity={note.opacity} transform={`translate(840, 1350) scale(${note.scale}) rotate(-6)`} style={{ transformOrigin: "840px 1350px" }}>
          <ellipse cx="0" cy="100" rx="90" ry="12" fill={MI_COLORS.charcoal} opacity={0.08} transform="rotate(6)" />
          {/* post-it cyan en arriere-plan (decale, 2e couleur) */}
          <rect x="-78" y="-68" width="156" height="156" rx="6" fill={MI_COLORS.cyan} opacity={0.5} transform="translate(14, 14)" />
          {/* post-it rose principal */}
          <rect x="-85" y="-85" width="170" height="170" rx="6" fill={MI_COLORS.magenta} />
          <path d="M-48,-36 H48 M-48,0 H48 M-48,36 H12" stroke={MI_COLORS.offWhite} strokeWidth="8" opacity={0.9} strokeLinecap="round" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
