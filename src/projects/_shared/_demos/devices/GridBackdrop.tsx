/**
 * GridBackdrop — fond SVG "plan technique", dessine et ANIME, pas photographie.
 *
 * Pourquoi un fond dessine plutot qu'une photo (arbitrage du 2026-08-26) :
 * une photo porte des contraintes CACHEES qu'on ne controle pas — une echelle
 * implicite, une direction de lumiere figee, un angle de prise de vue, une
 * profondeur de champ. Il faut faire coincider l'objet 3D avec quatre choses
 * qu'on n'a pas choisies, et chaque ecart se voit (tasse geante, ombre fausse).
 * Un fond dessine n'a aucune de ces contraintes : on decide de tout, et surtout
 * TOUT EST UN PARAMETRE — donc adaptable a la charte d'un client en changeant
 * trois valeurs. C'est la difference entre un one-shot et une brique.
 *
 * Registre : la grille d'ingenieur du plan d'ouverture de "Foster With
 * Confidence" (tapis de decoupe quadrille), mais vivante — la grille respire,
 * des reperes de mesure se tracent, un halo suit l'objet.
 */

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

export type GridPalette = {
  /** Fond profond, derriere tout. */
  base: string;
  /** Couleur de la nappe centrale (le "tapis"). */
  mat: string;
  /** Lignes fines de la grille. */
  line: string;
  /** Lignes fortes tous les N carreaux. */
  lineStrong: string;
  /** Accent : reperes, graduations, halo. */
  accent: string;
};

/** Palette par defaut — le bleu-teal du tapis de decoupe de la reference. */
export const GRID_TEAL: GridPalette = {
  base: "#08131c",
  mat: "#0e2a38",
  line: "#2f6b80",
  lineStrong: "#4a8fa6",
  accent: "#6FD08C",
};

/** Variante sombre neutre, pour un client sans couleur forte. */
export const GRID_SLATE: GridPalette = {
  base: "#0b0d10",
  mat: "#151a20",
  line: "#2a323c",
  lineStrong: "#3d4854",
  accent: "#8fa4bd",
};

export const GridBackdrop: React.FC<{
  palette?: GridPalette;
  /** Taille d'un carreau en px. Tout le reste s'y accroche. */
  cell?: number;
  /** Le fond "respire" : leger zoom lent, pour qu'il ne soit jamais mort. */
  breathe?: boolean;
}> = ({ palette = GRID_TEAL, cell = 64, breathe = true }) => {
  const frame = useCurrentFrame();

  /**
   * Respiration : 1.5 % d'amplitude sur toute la duree. Assez pour que l'oeil
   * ne lise pas une image fixe, trop peu pour qu'on remarque le mouvement.
   */
  const breath = breathe
    ? 1 + 0.015 * Math.sin((frame / 90) * Math.PI)
    : 1;

  /** Les graduations se tracent au demarrage, de gauche a droite. */
  const draw = interpolate(frame, [6, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  /** Le halo central monte doucement — c'est lui qui "pose" l'objet. */
  const halo = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: palette.base, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${breath})` }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Nappe centrale : un tapis pose sur le fond, pas un aplat plein cadre. */}
            <radialGradient id="matFade" cx="50%" cy="48%" r="72%">
              <stop offset="0%" stopColor={palette.mat} stopOpacity="1" />
              <stop offset="70%" stopColor={palette.mat} stopOpacity="0.92" />
              <stop offset="100%" stopColor={palette.base} stopOpacity="0" />
            </radialGradient>

            {/* Halo derriere l'objet — remplace l'ombre portee d'une photo. */}
            <radialGradient id="halo" cx="50%" cy="52%" r="34%">
              <stop offset="0%" stopColor={palette.accent} stopOpacity="0.13" />
              <stop offset="100%" stopColor={palette.accent} stopOpacity="0" />
            </radialGradient>

            {/* Grille fine, repetee par pattern : un seul noeud pour tout le fond. */}
            <pattern
              id="grid"
              width={cell}
              height={cell}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${cell} 0 L 0 0 0 ${cell}`}
                fill="none"
                stroke={palette.line}
                strokeWidth="1"
                strokeOpacity="0.45"
              />
            </pattern>
            {/* Grille forte tous les 4 carreaux. */}
            <pattern
              id="gridStrong"
              width={cell * 4}
              height={cell * 4}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${cell * 4} 0 L 0 0 0 ${cell * 4}`}
                fill="none"
                stroke={palette.lineStrong}
                strokeWidth="1.6"
                strokeOpacity="0.55"
              />
            </pattern>

            {/* La nappe masque la grille : elle s'arrete avec le tapis. */}
            <mask id="matMask">
              <rect width="1920" height="1080" fill="url(#matFade)" />
            </mask>
          </defs>

          <rect width="1920" height="1080" fill="url(#matFade)" />
          <g mask="url(#matMask)">
            <rect width="1920" height="1080" fill="url(#grid)" />
            <rect width="1920" height="1080" fill="url(#gridStrong)" />
          </g>
          <rect width="1920" height="1080" fill="url(#halo)" opacity={halo} />

          {/* Graduations hautes — le detail qui signe le registre "plan technique". */}
          <g
            stroke={palette.lineStrong}
            strokeWidth="1.4"
            strokeOpacity="0.7"
            mask="url(#matMask)"
          >
            {Array.from({ length: 30 }).map((_, i) => {
              const x = 120 + i * cell;
              const long = i % 4 === 0;
              const appear = interpolate(draw, [i / 40, i / 40 + 0.3], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <line
                  key={i}
                  x1={x}
                  y1={92}
                  x2={x}
                  y2={92 + (long ? 22 : 12)}
                  opacity={appear}
                />
              );
            })}
          </g>

          {/* Deux reperes d'axe qui encadrent l'objet, comme sur un plan cote. */}
          <g stroke={palette.accent} strokeWidth="1.5" strokeOpacity={0.5 * draw}>
            <line x1="120" y1="540" x2={120 + 640 * draw} y2="540" />
            <line x1="1800" y1="540" x2={1800 - 640 * draw} y2="540" />
          </g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
