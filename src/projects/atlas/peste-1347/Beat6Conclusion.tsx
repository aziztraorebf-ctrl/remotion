// Beat6Conclusion — FINALE de l'episode "Peste 1347".
// "Deux epidemies, deux destins. Un desert entre les deux. La geographie n'est pas neutre."
//
// Construit via DA-BRIEF-GATE (--upstream Gemini 3.1 Pro + Kimi K2.5, plan valide avant code).
// Principe directeur (convergence des 2 experts) : UNE FIN SE SOUSTRAIT, elle n'additionne pas.
// On epure pour laisser le message dominer. Decisions Aziz :
//  - Sahara = FAILLE/isohyetes fines ocre (PAS un mur/glow = cliche).
//  - Phrase finale au CENTRE, ecriture "plume" (stroke-dasharray serif), finit pile sur "neutre".
//  - Image finale sur "neutre" : DESATURATION (rouge+or -> parchemin) + BATTEMENT des 2 zones.
// Mouvement maitre : pull-back lent continu (cubic-bezier), AUCUN cut, nettoyage ecran des f0.
//
// Source : PAS de bandeau source a l'ecran (decision Aziz 2026-06-08). La phrase finale
// "la geographie n'est pas neutre" est la THESE EDITORIALE de l'episode (conclusion d'auteur),
// pas une citation a attribuer. Les sources factuelles sont creditees dans les beats precedents
// (Beat 5 : Ibn Battuta, Rihla 1352 - World History Encyclopedia). La conclusion reste epuree.

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { AtlasMercator } from "../_shared/atlas-components";
import {
  WIDTH as W,
  HEIGHT as H,
  PALETTE,
  makeMapCoord,
  MERC_LARGE,
  ISO_PLAGUE,
} from "./mapConfig";

const { OCEAN, MALI_GOLD, PARCHMENT, PARCHMENT_INK } = PALETTE;
const PLAGUE_RED = PALETTE.PLAGUE_RED;
const PARCHMENT_NEUTRAL = "#c97d5a"; // terracotta de base (cible de la desaturation)

// Zone Mali (or), identique au Beat 5 pour la continuite.
const ISO_MALI_ZONE = new Set([
  "MLI", "SEN", "GMB", "GNB", "GIN", "BFA", "NER", "MRT",
  "GHA", "CIV", "TGO", "BEN", "NGA",
]);

// ─── PIVOTS LOCAUX (startFrom audio = 2975) ─────────────────────────────────
const HS = 2975;                 // frame audio de "Deux"
const F_DESERT      = 71;        // "Un desert" -> la faille se trace
const F_DESERT_END  = 103;       // "...les deux"
const F_GEO         = 135;       // "La geographie..."
const F_NEUTRE      = 168;       // "neutre." -> image finale (desaturation + battement)
const BEAT_DUR      = 210;       // ~7s (168 + respiration finale)

// Etat camera herite de la fin du Beat 5 (carte large Europe/Mali, continuite sans cut).
const INHERITED = { scale: 0.85, driftX: 0, driftY: 0 };

// Ligne de faille Sahara : polyline ouest->est ONDULEE dans la bande Sahel (y~678),
// entre le Maghreb et le Mali. Remplace data.saharaPath (ferme, faisait un cone brouillon).
// Aspect "faille geologique" naturel via ondulation sinusoidale douce.
const SAHARA_FAILLE_PATH =
  "M150.0,678.0 L188.5,681.8 L227.0,683.3 L265.5,681.4 L304.0,676.5 L342.5,670.8 " +
  "L381.0,666.7 L419.5,665.8 L458.0,668.2 L496.5,672.3 L535.0,675.7";


export const Beat6Conclusion: React.FC = () => {
  const localF = useCurrentFrame();

  // ── CAMERA : pull-back lent CONTINU sur 6.5s (un seul mouvement, aucun cut). ──
  // easing cubic-bezier (ease-out) : recul fluide qui ralentit vers la fin (gravite).
  const pullback = interpolate(localF, [0, BEAT_DUR], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 1, 0.5, 1),
  });
  const camScale = INHERITED.scale - 0.12 * pullback; // 0.85 -> 0.73 (recul doux)
  // micro-drift sinusoidal tres lent (carte vivante, jamais figee morte)
  const driftX = INHERITED.driftX + Math.sin(localF * 0.012) * 4;
  const driftY = INHERITED.driftY + Math.cos(localF * 0.010) * 3 - 8 * pullback;

  const camTransform =
    `translate(${W / 2 + driftX} ${H / 2 + driftY}) scale(${camScale}) translate(${-W / 2} ${-H / 2})`;

  // ── DESATURATION finale (sur "neutre") : rouge+or -> parchemin neutre. ──
  // La geographie redevient un simple bout de papier (idee Gemini, validee Aziz).
  // desaturation PARTIELLE (0.62) : la carte tend vers le parchemin mais garde une trace
  // du rouge/or (sinon l'antithese disparait totalement au moment cle). Idee Gemini, dosee.
  const desat = interpolate(localF, [F_NEUTRE, F_NEUTRE + 30], [0, 0.62], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const lerpColor = (from: string, to: string, t: number) => {
    const f = from.match(/\w\w/g)!.map((h) => parseInt(h, 16));
    const g = to.match(/\w\w/g)!.map((h) => parseInt(h, 16));
    const c = f.map((v, i) => Math.round(v + (g[i] - v) * t));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  };
  const europeColor = lerpColor(PLAGUE_RED.replace("#", ""), PARCHMENT_NEUTRAL.replace("#", ""), desat);
  const maliColor = lerpColor(MALI_GOLD.replace("#", ""), PARCHMENT_NEUTRAL.replace("#", ""), desat);

  // ── BATTEMENT final des 2 zones (sur "neutre", idee Kimi) : un pulse commun. ──
  const heartbeat =
    localF >= F_NEUTRE
      ? 1 - 0.18 * Math.max(0, Math.sin((localF - F_NEUTRE) * 0.5)) *
          interpolate(localF, [F_NEUTRE, F_NEUTRE + 24], [1, 0], { extrapolateRight: "clamp" })
      : 1;

  // opacite de fond des 2 zones (avant desat, plein ; pendant respiration finale, leger retrait)
  const zonesOpacity = interpolate(localF, [F_GEO, F_GEO + 30], [1, 0.7], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  }) * heartbeat;

  // ── FAILLE SAHARA (sur "Un desert entre les deux") : isohyetes fines ocre, PAS un mur. ──
  // Plusieurs lignes paralleles fines qui se tracent (stroke-dasharray), couleur ocre/encre,
  // SANS glow. Materialise l'aridite/le vide, pas une frontiere politique.
  const failleProgress = interpolate(localF, [F_DESERT, F_DESERT_END], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.4, 1),
  });
  const SAHARA_LEN = 760; // longueur approx du path
  // isohyetes : ocre FONCE (contraste sur le terracotta clair) + trait plus marque pour
  // qu'elles se LISENT (1er render : trop discretes, invisibles). 3 lignes principales.
  const failleLines = [
    { offset: 0,   op: 0.85, color: "#5a3d1a", w: 2.4 },  // ligne maitresse, brun-ocre fonce
    { offset: -13, op: 0.45, color: "#7a5a30", w: 1.5 },
    { offset: 13,  op: 0.45, color: "#7a5a30", w: 1.5 },
    { offset: -26, op: 0.22, color: "#8a6a3e", w: 1.1 },
    { offset: 26,  op: 0.22, color: "#8a6a3e", w: 1.1 },
  ];

  // ── VIGNETTAGE (sur la phrase finale) : assombrit les bords, focalise le centre/texte. ──
  // Plus marque (1er render : trop leger, la phrase ne ressortait pas).
  const vignette = interpolate(localF, [F_GEO, F_GEO + 35], [0, 0.85], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // bandeau sombre derriere le texte (le detache du fond clair de la carte)
  const textBandOpacity = interpolate(localF, [F_GEO, F_GEO + 20], [0, 0.55], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── PHRASE FINALE "La geographie n'est pas neutre" : ecriture plume (stroke-dasharray). ──
  // Au CENTRE (espace negatif), serif. Le trace finit pile sur "neutre" (f168).
  const penProgress = interpolate(localF, [F_GEO, F_NEUTRE], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.5, 1),
  });
  // remplissage encre apres le trace du contour
  const inkFill = interpolate(localF, [F_NEUTRE - 8, F_NEUTRE + 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const globalFadeIn = interpolate(localF, [0, 12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const finalFadeOut = interpolate(localF, [BEAT_DUR - 18, BEAT_DUR], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const TEXT = "La géographie n'est pas neutre";
  const FONT_SIZE = 36; // reduit (42 debordait les bords a 720px)
  // longueur de path approx pour le stroke-dasharray (chars * largeur moyenne)
  const textPathLen = TEXT.length * 22;

  return (
    <AbsoluteFill style={{ backgroundColor: OCEAN, opacity: finalFadeOut }}>
      <Sequence from={0} premountFor={30}>
        <Audio
          src={staticFile("atlas/peste-1347/audio/narration-v1.mp3")}
          startFrom={HS}
          volume={1}
          trimAfter={HS + BEAT_DUR}
        />
      </Sequence>
      {/* Musique retirée : posée en 1 piste continue au concat final. */}

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ opacity: globalFadeIn }}>
        <rect x={0} y={0} width={W} height={H} fill={OCEAN} />

        <AtlasMercator
          countries={MERC_LARGE.countries}
          highlightFills={{}}
          driftX={driftX} driftY={driftY} scale={camScale}
          width={W} height={H}
        />

        <g transform={camTransform}>
          {/* MALI or (desature sur "neutre") */}
          {(MERC_LARGE.countries as Array<{ iso: string; d: string }>)
            .filter((c) => ISO_MALI_ZONE.has(c.iso))
            .map((c) => (
              <path key={`mali-${c.iso}`} d={c.d}
                    fill={maliColor} fillOpacity={0.42 * zonesOpacity}
                    stroke={PARCHMENT_INK} strokeOpacity={0.45} strokeWidth={0.6 / camScale}
                    strokeLinejoin="round" />
            ))}

          {/* EUROPE rouge peste (desature sur "neutre").
              CLIP a l'Europe continentale : FRA/NOR/NLD/PRT/SWE ont des territoires lointains
              (Guyane, Svalbard, Caraibes, Acores) qui rougissaient en pleine mer. Le clipPath
              ne garde que la zone europeenne. (meme nature que le bug mainlandBox des drapeaux). */}
          <defs>
            <clipPath id="europeClip">
              <rect x={118} y={236} width={470} height={328} />
            </clipPath>
          </defs>
          <g clipPath="url(#europeClip)">
            {(MERC_LARGE.countries as Array<{ iso: string; d: string }>)
              .filter((c) => ISO_PLAGUE.includes(c.iso as typeof ISO_PLAGUE[number]))
              .map((c) => (
                <path key={`eu-${c.iso}`} d={c.d}
                      fill={europeColor} fillOpacity={0.74 * zonesOpacity} />
              ))}
          </g>

          {/* FAILLE SAHARA — isohyetes fines ocre (sur "Un desert entre les deux") */}
          {failleProgress > 0.001 &&
            failleLines.map((ln, i) => (
              <path
                key={`faille-${i}`}
                d={SAHARA_FAILLE_PATH}
                fill="none"
                stroke={ln.color}
                strokeOpacity={ln.op * Math.min(1, failleProgress * 1.4)}
                strokeWidth={ln.w / camScale}
                strokeLinecap="round"
                strokeDasharray={SAHARA_LEN}
                strokeDashoffset={SAHARA_LEN * (1 - failleProgress)}
                transform={`translate(0 ${ln.offset})`}
              />
            ))}
        </g>

        {/* VIGNETTAGE radial (focalise le centre) — overlay SVG, headless-safe */}
        {vignette > 0.01 && (
          <>
            <defs>
              <radialGradient id="vig" cx="50%" cy="46%" r="62%">
                <stop offset="55%" stopColor="#000000" stopOpacity={0} />
                <stop offset="100%" stopColor="#0a1020" stopOpacity={vignette} />
              </radialGradient>
            </defs>
            <rect x={0} y={0} width={W} height={H} fill="url(#vig)" />
          </>
        )}

        {/* PHRASE FINALE — au centre, ecriture "plume" (contour stroke-dasharray puis fill encre).
            Bandeau sombre derriere pour la detacher du fond clair de la carte. */}
        {penProgress > 0.001 && (
          <g>
            {/* bandeau sombre (gradient horizontal qui s'estompe sur les cotes) */}
            <defs>
              <linearGradient id="textband" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#0a1020" stopOpacity={0} />
                <stop offset="20%" stopColor="#0a1020" stopOpacity={textBandOpacity} />
                <stop offset="80%" stopColor="#0a1020" stopOpacity={textBandOpacity} />
                <stop offset="100%" stopColor="#0a1020" stopOpacity={0} />
              </linearGradient>
            </defs>
            <rect x={0} y={H * 0.47 - 34} width={W} height={56} fill="url(#textband)" />
            {/* contour qui se trace (la plume) */}
            <text
              x={W / 2} y={H * 0.47}
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize={FONT_SIZE} fontWeight={700} letterSpacing={1}
              fill="none"
              stroke={PARCHMENT}
              strokeWidth={1.1}
              strokeDasharray={textPathLen}
              strokeDashoffset={textPathLen * (1 - penProgress)}
            >
              {TEXT}
            </text>
            {/* remplissage encre clair (apres le trace) */}
            <text
              x={W / 2} y={H * 0.47}
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize={FONT_SIZE} fontWeight={700} letterSpacing={1}
              fill={PARCHMENT}
              fillOpacity={inkFill}
            >
              {TEXT}
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
