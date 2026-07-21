import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
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
// PORTRAIT PECHEUR ANIME V2 — 2 phases seulement, PAS de parole.
// Corrige les 2 defauts de la v1 :
//   (1) BUSTE 100% FIXE : le fond et le buste (col compris) ne bougent JAMAIS.
//       Ils sont rendus HORS du wrapper qui tourne la tete. Zero transform.
//   (2) COLORISATION PROGRESSIVE zone par zone : chaque remplissage monte sur
//       ~15-20 frames, ECHELONNE (decale ~10-15f) en suivant le trace :
//         (a) peau -> (b) modele/ombres/barbe -> (c) traits (yeux/nez/bouche/
//         sourcils) -> (d) chapeau -> (e) col/buste EN DERNIER.
//       Jamais tout d'un coup.
//
//   PHASE REVELATION (~0-5s) : trace au trait (dashoffset) + colorisation ci-dessus.
//   PHASE VIVANT SUBTIL (~5s->fin) : clignements desynchronises + micro-inclinaison
//     de tete (+/-1 deg MAX) + chapeau qui suit. RIEN D'AUTRE (pas de bouche animee,
//     pas de buste qui bouge).
// Frame-driven only : useCurrentFrame + interpolate + sin. Zero CSS/keyframe.
// ---------------------------------------------------------------------------

export const PECHEUR_VISAGE_V2_FRAMES = 330; // 11s @ 30fps

const W = 1080;
const H = 1080;

// Coordonnees d'animation fournies.
const TETE_PIVOT = { x: 545, y: 700 };
const OG_CENTRE = { x: 443, y: 493 };
const OD_CENTRE = { x: 584, y: 492 };

// --- Reperes de phases (frames) ---
// Trace au trait.
const TRACE_START = 6;
const TRACE_DUR = 66; // fin trace ~ f72 (~2.4s)

// Colorisation ECHELONNEE (chaque zone : ~18f de fade, decalage ~14f).
// (a) peau, (b) modele+barbe, (c) traits, (d) chapeau, (e) col/buste.
const FILL_PEAU_START = 40; // peau 40 -> 58
const FILL_MODELE_START = 56; // modele/ombres/barbe 56 -> 74
const FILL_TRAITS_START = 72; // yeux/nez/joues/sourcils/bouche 72 -> 92
const FILL_CHAPEAU_START = 92; // chapeau 92 -> 112
const FILL_BUSTE_START = 112; // col/buste EN DERNIER 112 -> 134
const FILL_FADE = 19; // duree du fade-in de chaque zone

// Phase vivant.
const VIVANT_START = 150; // ~5s

// Rampe de fade-in generique d'une zone (0->1 sur FILL_FADE frames).
const zoneFill = (frame: number, start: number): number =>
  interpolate(frame, [start, start + FILL_FADE], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// scaleY autour d'un centre (x,y) : translate(cx,cy) scale(1,s) translate(-cx,-cy).
const scaleYAround = (cx: number, cy: number, s: number) =>
  `translate(${cx} ${cy}) scale(1 ${s}) translate(${-cx} ${-cy})`;

const rotateAround = (cx: number, cy: number, deg: number) => `rotate(${deg} ${cx} ${cy})`;

// Clignement : renvoie le scaleY de l'oeil a une frame donnee.
// Cligne ~toutes les "periode" frames, fermeture rapide (~6f), decale par offset.
const blink = (frame: number, periode: number, offset: number): number => {
  const t = ((frame - offset) % periode + periode) % periode;
  if (t > 6) return 1;
  // t dans [0,6] : 1 -> 0.1 -> 1 (V-shape rapide)
  const half = 3;
  const k = t <= half ? t / half : (6 - t) / half; // 0->1->0
  return interpolate(k, [0, 1], [1, 0.1]);
};

export const PecheurVisageAnimeV2: React.FC = () => {
  const frame = useCurrentFrame();

  // --- PHASE 1 : colorisation echelonnee zone par zone ---
  const fillPeau = zoneFill(frame, FILL_PEAU_START);
  const fillModele = zoneFill(frame, FILL_MODELE_START);
  const fillTraits = zoneFill(frame, FILL_TRAITS_START);
  const fillChapeau = zoneFill(frame, FILL_CHAPEAU_START);
  const fillBuste = zoneFill(frame, FILL_BUSTE_START);

  // --- PHASE 2 : vivant (respiration tete + clignement). Buste EXCLU. ---
  const vivantIn = interpolate(frame, [VIVANT_START, VIVANT_START + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Micro-inclinaison de tete TRES legere : rotate +/-1 deg MAX autour du pivot.
  // Superposition de 2 sinus lents pour une respiration non mecanique, plafonnee a 1 deg.
  const breathe = 0.7 * Math.sin((frame - VIVANT_START) / 46) + 0.3 * Math.sin((frame - VIVANT_START) / 71 + 1.1);
  const teteDeg = vivantIn * breathe; // amplitude max ~1 deg

  // Chapeau : suit la tete (leger retard/attenuation pour un effet paille souple).
  // -3 = pose de base du chapeau (comme v1), + suivi attenue de la tete.
  const chapeauDeg = -3 + teteDeg * 0.85;

  // Clignements DESYNCHRONISES : periodes differentes (75f et 82f), offsets differents.
  const ogScale = frame >= VIVANT_START - 20 ? blink(frame, 75, 30) : 1;
  const odScale = frame >= VIVANT_START - 20 ? blink(frame, 82, 58) : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: "#c9b28c" }}>
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs dangerouslySetInnerHTML={{ __html: PV_DEFS }} />

        {/* ===== ZONE FIXE (JAMAIS de transform) ===== */}
        {/* Fond : toujours present, immobile. */}
        <g dangerouslySetInnerHTML={{ __html: PV_FOND }} />
        {/* Buste + col : colorisation en DERNIER, mais AUCUN mouvement. */}
        <g opacity={fillBuste} dangerouslySetInnerHTML={{ __html: PV_BUSTE }} />

        {/* ===== TETE (seule zone animee : respiration rotate autour du pivot) ===== */}
        <g transform={rotateAround(TETE_PIVOT.x, TETE_PIVOT.y, teteDeg)}>
          {/* (a) Peau (silhouette) — se remplit en premier. */}
          <g opacity={fillPeau} dangerouslySetInnerHTML={{ __html: PV_TETE_PEAU }} />
          {/* (b) Modele (ombres/lumieres/oreille) + barbe — ensuite. */}
          <g opacity={fillModele} dangerouslySetInnerHTML={{ __html: PV_TETE_MODELE }} />
          <g opacity={fillModele} dangerouslySetInnerHTML={{ __html: PV_BARBE }} />

          {/* (c) Traits fins — sourcils, nez, joues, yeux, bouche. */}
          <g opacity={fillTraits} dangerouslySetInnerHTML={{ __html: PV_SOURCILS }} />
          <g opacity={fillTraits} dangerouslySetInnerHTML={{ __html: PV_NEZ }} />
          <g opacity={fillTraits} dangerouslySetInnerHTML={{ __html: PV_JOUES }} />

          {/* YEUX : chacun dans un wrapper scaleY autour de son centre (clignement). */}
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

          {/* BOUCHE : STATIQUE en v2 (aucune animation de parole). */}
          <g opacity={fillTraits} dangerouslySetInnerHTML={{ __html: PV_BOUCHE }} />

          {/* Menton + contour secondaire. */}
          <g opacity={fillTraits} dangerouslySetInnerHTML={{ __html: PV_MENTON }} />

          {/* (d) CHAPEAU : contenu interne, wrapper rotate propre (suit la tete). */}
          <g
            opacity={fillChapeau}
            transform={rotateAround(540, 330, chapeauDeg)}
            dangerouslySetInnerHTML={{ __html: PV_CHAPEAU }}
          />
        </g>

        {/* ===== PHASE 1 : contours traces au crayon PAR-DESSUS (dashoffset -> 0) ===== */}
        {/* Ils s'estompent une fois les fills poses pour ne pas doubler le trait. */}
        {PV_TRACE_PATHS.map((p, i) => {
          const start = TRACE_START + i * 7;
          const draw = interpolate(frame, [start, start + TRACE_DUR], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          // Le trait crayon reste visible pendant le trace, puis fade quand la
          // colorisation prend le relais (le vrai contour est dans les fills).
          const crayonFade = interpolate(frame, [FILL_TRAITS_START, FILL_CHAPEAU_START], [1, 0], {
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
