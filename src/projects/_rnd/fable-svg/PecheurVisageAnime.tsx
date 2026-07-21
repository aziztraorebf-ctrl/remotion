import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import {
  PV_DEFS,
  PV_FOND,
  PV_BUSTE,
  PV_TETE_PEAU,
  PV_TETE_MODELE,
  PV_NEZ,
  PV_JOUES,
  PV_SOURCILS,
  PV_OEIL_GAUCHE,
  PV_OEIL_DROIT,
  PV_BARBE,
  PV_BOUCHE,
  PV_MENTON,
  PV_CHAPEAU,
  PV_TRACE_PATHS,
} from "./pecheurVisageGroups";

// ---------------------------------------------------------------------------
// PORTRAIT PECHEUR ANIME — 3 phases sequentielles, arsenal complet.
// Matiere = SVG statique Fable (groupes nommes). Vie = code React par frame.
//   PHASE 1 REVELATION (0-4s) : contours traces au crayon (dasharray->0),
//     puis remplissages en fade-in.
//   PHASE 2 VIVANT (4-9s, permanent) : clignements decales, respiration (rotate
//     tete + chapeau), micro-derive du regard.
//   PHASE 3 PAROLE (9-14s) : bouche animee en scaleY (ouverture varie).
// Frame-driven only : useCurrentFrame + interpolate + sin. Zero CSS/keyframe.
// ---------------------------------------------------------------------------

export const PECHEUR_VISAGE_FRAMES = 420; // 14s @ 30fps

const W = 1080;
const H = 1080;

// Coordonnees d'animation fournies.
const TETE_PIVOT = { x: 545, y: 700 };
const OG_CENTRE = { x: 443, y: 493 };
const OD_CENTRE = { x: 584, y: 492 };
const BOUCHE_CENTRE = { x: 509, y: 630 };

// Reperes de phases (frames).
const TRACE_START = 6;
const TRACE_DUR = 78; // fin trace ~ f84 (~2.8s)
const FILL_START = 54;
const FILL_END = 126; // fills complets ~4.2s
const VIVANT_START = 120; // ~4s
const PAROLE_START = 270; // 9s

const Inject: React.FC<{ html: string; opacity?: number; transform?: string }> = ({
  html,
  opacity = 1,
  transform,
}) => <g opacity={opacity} transform={transform} dangerouslySetInnerHTML={{ __html: html }} />;

// scaleY autour d'un centre (x,y) : translate(cx,cy) scale(1,s) translate(-cx,-cy).
const scaleYAround = (cx: number, cy: number, s: number) =>
  `translate(${cx} ${cy}) scale(1 ${s}) translate(${-cx} ${-cy})`;

const rotateAround = (cx: number, cy: number, deg: number) => `rotate(${deg} ${cx} ${cy})`;

// Clignement : renvoie le scaleY de l'oeil a une frame donnee.
// Cligne ~toutes les periode frames, fermeture rapide (~5f), decale par offset.
const blink = (frame: number, periode: number, offset: number): number => {
  const t = (frame - offset) % periode;
  if (t < 0 || t > 6) return 1;
  // t dans [0,6] : 1 -> 0.1 -> 1 (V-shape rapide)
  const half = 3;
  const k = t <= half ? t / half : (6 - t) / half; // 0->1->0
  return interpolate(k, [0, 1], [1, 0.1]);
};

export const PecheurVisageAnime: React.FC = () => {
  const frame = useCurrentFrame();
  useVideoConfig();

  // --- PHASE 1 : fills fade-in progressifs (echelonnes) ---
  const fillBase = interpolate(frame, [FILL_START, FILL_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fillPeau = interpolate(frame, [FILL_START, FILL_START + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fillTraits = interpolate(frame, [FILL_START + 30, FILL_END + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fillChapeau = interpolate(frame, [FILL_START + 12, FILL_START + 56], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- PHASE 2 : vivant (respiration, derive, clignement) ---
  // Amplitude qui monte doucement au demarrage du vivant.
  const vivantIn = interpolate(frame, [VIVANT_START, VIVANT_START + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Respiration : rotate lent +/-1.5 deg (sin), autour de tete-pivot.
  const breatheDeg = 1.5 * vivantIn * Math.sin((frame - VIVANT_START) / 34);
  // Derive lente du regard/tete : petit offset horizontal supplementaire.
  const driftDeg = 0.6 * vivantIn * Math.sin((frame - VIVANT_START) / 71 + 1.2);
  const teteDeg = breatheDeg + driftDeg;

  // Chapeau : suit la tete + micro-oscillation propre (leger retard, effet paille).
  const chapeauDeg = -3 + teteDeg * 0.9 + 0.5 * vivantIn * Math.sin((frame - VIVANT_START) / 26 + 0.5);

  // Clignements decales : oeil gauche periode 76f, droit 76f mais offset different.
  // (une frame ~ 33ms ; ~2.5s = 75f). Decalage naturel de 3f entre les deux yeux.
  const ogScale = frame >= VIVANT_START - 10 ? blink(frame, 76, 40) : 1;
  const odScale = frame >= VIVANT_START - 10 ? blink(frame, 82, 43) : 1;

  // --- PHASE 3 : parole (bouche scaleY, varie pas mecanique) ---
  const paroleIn = interpolate(frame, [PAROLE_START, PAROLE_START + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Superposition de sinus a frequences differentes -> rythme "parle" irregulier.
  const pf = frame - PAROLE_START;
  const speakRaw =
    0.5 +
    0.32 * Math.sin(pf / 3.1) +
    0.18 * Math.sin(pf / 6.7 + 1.0) +
    0.12 * Math.sin(pf / 2.1 + 2.3);
  // Clamp dans [0,1] puis mappe le scaleY bouche entre ~0.55 (fermee) et ~1.35 (ouverte).
  const speakClamped = Math.max(0, Math.min(1, speakRaw));
  const boucheScale = 1 + paroleIn * interpolate(speakClamped, [0, 1], [-0.42, 0.34]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#c9b28c" }}>
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs dangerouslySetInnerHTML={{ __html: PV_DEFS }} />

        {/* Fond toujours present (le portrait nait dessus). */}
        <Inject html={PV_FOND} />

        {/* GROUPE TETE ENTIERE anime en respiration (rotate autour du pivot). */}
        <g transform={rotateAround(TETE_PIVOT.x, TETE_PIVOT.y, teteDeg)}>
          {/* Buste (fills fade-in). */}
          <Inject html={PV_BUSTE} opacity={fillBase} />

          {/* Peau (silhouette) fade-in. */}
          <Inject html={PV_TETE_PEAU} opacity={fillPeau} />
          {/* Modele (ombres/lumieres/oreille) fade-in. */}
          <Inject html={PV_TETE_MODELE} opacity={fillBase} />
          {/* Barbe. */}
          <Inject html={PV_BARBE} opacity={fillBase} />

          {/* Traits fins : nez, joues, sourcils. */}
          <Inject html={PV_SOURCILS} opacity={fillTraits} />
          <Inject html={PV_NEZ} opacity={fillTraits} />
          <Inject html={PV_JOUES} opacity={fillTraits} />

          {/* YEUX : chacun dans un wrapper scaleY autour de son centre (clip suit). */}
          <g
            opacity={fillTraits}
            transform={scaleYAround(OG_CENTRE.x, OG_CENTRE.y, ogScale)}
            dangerouslySetInnerHTML={{ __html: PV_OEIL_GAUCHE }}
          />
          <g
            opacity={fillTraits}
            transform={scaleYAround(OD_CENTRE.x, OD_CENTRE.y, odScale)}
            dangerouslySetInnerHTML={{ __html: PV_OEIL_DROIT }}
          />

          {/* BOUCHE : wrapper scaleY autour de bouche-centre (parole phase 3). */}
          <g
            opacity={fillTraits}
            transform={scaleYAround(BOUCHE_CENTRE.x, BOUCHE_CENTRE.y, boucheScale)}
            dangerouslySetInnerHTML={{ __html: PV_BOUCHE }}
          />

          {/* Menton + contour secondaire. */}
          <Inject html={PV_MENTON} opacity={fillTraits} />

          {/* CHAPEAU : contenu interne, wrapper rotate propre. */}
          <g
            opacity={fillChapeau}
            transform={rotateAround(540, 330, chapeauDeg)}
            dangerouslySetInnerHTML={{ __html: PV_CHAPEAU }}
          />
        </g>

        {/* PHASE 1 : contours traces au crayon PAR-DESSUS (dasharray -> 0). */}
        {/* Ils s'estompent une fois les fills poses pour ne pas doubler le trait. */}
        {PV_TRACE_PATHS.map((p, i) => {
          const start = TRACE_START + i * 8;
          const draw = interpolate(frame, [start, start + TRACE_DUR], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          // Le trait crayon reste visible pendant le trace, puis fade quand les
          // fills prennent le relais (le vrai contour est deja dans les fills).
          const crayonFade = interpolate(frame, [FILL_START + 20, FILL_END], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          if (draw <= 0.001 && frame < start) return null;
          const dash = p.len;
          const offset = dash * (1 - draw);
          return (
            <path
              key={i}
              d={p.d}
              fill="none"
              stroke={p.color}
              strokeWidth={p.w}
              strokeLinecap="round"
              strokeDasharray={dash}
              strokeDashoffset={offset}
              opacity={p.op * crayonFade}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
