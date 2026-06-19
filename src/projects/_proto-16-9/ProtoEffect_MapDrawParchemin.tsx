/**
 * PROTO CARTE QUI SE DESSINE — PARCHEMIN QUADRILLE (reproduction fidele d'une video de ref
 * "paper animator" fournie par Aziz). Sequence observee (~5s @30fps) :
 *   0.0s : fond seul (parchemin clair + grille fine + reliefs decoratifs pales + rose des vents)
 *   ~0.3-1.0s : le REMPLISSAGE ocre du pays apparait/monte (le fill MENE, pas le trace)
 *   ~1.0-2.0s : le CONTOUR brun tres fonce se trace par-dessus (precision des frontieres)
 *   ~2.2s+ : label "SENEGAL" (serif, lettres espacees) + ville "Dakar" (point + texte) → etat stable
 *
 * VRAIE geometrie Senegal (d3-geo + Natural Earth) via senegalPath.ts. Pas de 3D (demande Aziz).
 * Couleurs echantillonnees sur la video source.
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, Audio, Sequence, staticFile } from "remotion";
import { SENEGAL_PATH, SENEGAL_PATH_LEN, SENEGAL_CENTROID } from "./senegalPath";

const W = 1920;
const H = 1080;

// === APPROPRIATION SOUVERAIN (pas une copie du template) ===
// Parchemin clair GARDE (registre matiere). Mais charte Souverain : contour NAVY + label/ville OR.
// Grille gardee (commune a l'industrie) mais TEINTEE or-sable lumineuse (notre signature, jamais sombre).
const PARCH = "#e4ddca"; // parchemin clair (un cran plus chaud/lumineux)
const PARCH_DARK = "#d6cdb4";
const GRID = "#c2a96a"; // grille teintee or-sable, lumineuse (appropriation couleur)
const OCRE = "#e7bd78"; // remplissage haut (clair chaud)
const OCRE_MID = "#d2ad66";
const OCRE_DARK = "#bf9442";
const NAVY = "#16213a"; // contour pays + compteur = charte Souverain

// Geometrie dans une boite 900x700 ; placee centree-agrandie dans 1920x1080.
// Legere remontee (-40) : le compteur central reste dans le pays, le sous-titre respire en bas.
const MAP_SCALE = 1.2;
const MAP_X = W / 2 - (900 * MAP_SCALE) / 2;
const MAP_Y = H / 2 - (700 * MAP_SCALE) / 2 - 40;

// Grille : ~185px (mesure 123px @1280 -> ~185 @1920), legerement decalee comme la ref
const GRID_STEP = 185;
const GRID_OFFSET_X = 40;
const GRID_OFFSET_Y = 28;

export const ProtoEffect_MapDrawParchemin: React.FC<{ withNarration?: boolean; noExitFade?: boolean }> = ({
  withNarration = false,
  noExitFade = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // CALAGE AUDIO (narration-v3-VALIDEE) — mesure Whisper :
  //   "8 millions" @5.52s (f166) · "dollars" @6.04s (f181) · "chaque jour" @7.0s (f210).
  // DECISION Aziz : le compteur CULMINE ~1s AVANT la voix (l'image precede l'oreille = vivacite).
  //   → culmination a f150 (5.0s), la voix dit "dollars" a f181. Puis le 8M RESPIRE jusqu'a la fin.

  // Le REMPLISSAGE mene : enchaine tot pour laisser le compteur respirer ensuite.
  const fillStart = 6;
  const fillProg = spring({ fps, frame: Math.max(0, frame - fillStart), config: { damping: 30, stiffness: 50 } });
  // wipe : on revele le fill du bas vers le haut via un clip rectangulaire
  const fillRevealY = interpolate(fillProg, [0, 1], [1, 0]); // 1 = rien, 0 = tout

  // Le CONTOUR suit, une fois le fill bien engage.
  const drawStart = 16;
  const draw = spring({ fps, frame: Math.max(0, frame - drawStart), config: { damping: 38, stiffness: 34 } });

  // COUNT-UP (foyer central, A LA PLACE du nom) : 0 $ → 8 000 000 $.
  // Cale pour culminer ~f150 (1s AVANT le mot "dollars" f181) : start f78, dur 72.
  const countStart = 78;
  const countDur = 72;
  const countEnd = countStart + countDur;
  const countT = interpolate(frame, [countStart, countEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const eased = 1 - Math.pow(1 - countT, 3); // ease-out cubic
  const TARGET = 8_000_000;
  const amount = Math.round((eased * TARGET) / 1000) * 1000; // arrondi au millier (odometre propre)
  const countOp = interpolate(frame, [countStart - 8, countStart + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // pop a l'arrivee sur la cible + RESPIRATION continue ensuite (ne fige pas mort)
  const landPop = spring({ fps, frame: Math.max(0, frame - countEnd), config: { damping: 9, stiffness: 220 } });
  const breathe = frame > countEnd ? 1 + 0.012 * Math.sin((frame - countEnd) * 0.14) : 1;
  const landScale = (1 + 0.06 * landPop * (frame < countEnd + 18 ? 1 : 0)) * breathe;

  // TRANSITION DE SORTIE : leger fondu global sur les 14 dernieres frames (raccord vers le corps).
  const exitOp = noExitFade ? 1 : interpolate(frame, [durationInFrames - 14, durationInFrames - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const gridV = Array.from({ length: Math.ceil(W / GRID_STEP) + 1 }, (_, i) => GRID_OFFSET_X + i * GRID_STEP);
  const gridH = Array.from({ length: Math.ceil(H / GRID_STEP) + 1 }, (_, i) => GRID_OFFSET_Y + i * GRID_STEP);

  // Foyer central = centroide du pays (la ou etait le nom)
  const centerX = MAP_X + SENEGAL_CENTROID[0] * MAP_SCALE;
  const centerY = MAP_Y + SENEGAL_CENTROID[1] * MAP_SCALE;

  const amountStr = amount.toLocaleString("fr-FR").replace(/ | /g, " ") + " $";

  return (
    <AbsoluteFill style={{ background: PARCH, opacity: exitOp }}>
      {/* NARRATION + MUSIQUE reelles (pour juger le timing) — actif si withNarration */}
      {withNarration && (
        <>
          <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3")} volume={1} />
          <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")} volume={0.16} />
        </>
      )}
      {/* SFX odometre cale sur le count-up (tick existant du projet Senegal, ~3s) */}
      <Sequence from={countStart} durationInFrames={countDur + 6}>
        <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/sfx/sfx-odometer-tick.mp3")} volume={0.5} />
      </Sequence>

      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="ocreFillP" x1="0" y1="0" x2="0.25" y2="1">
            <stop offset="0%" stopColor={OCRE} />
            <stop offset="55%" stopColor={OCRE_MID} />
            <stop offset="100%" stopColor={OCRE_DARK} />
          </linearGradient>
          {/* texture papier sur le fond */}
          <filter id="paperTexP">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" seed="7" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.07" />
            </feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
          {/* texture papier vieilli sur le remplissage ocre (taches) */}
          <filter id="ocreTex">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="3" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.12" />
            </feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
          {/* masque wipe bas->haut pour le remplissage */}
          <clipPath id="fillWipe">
            <rect x="0" y="0" width={W} height={H * (1 - fillRevealY)} transform={`translate(0, ${H * fillRevealY})`} />
          </clipPath>
        </defs>

        {/* fond papier texture */}
        <rect width={W} height={H} fill={PARCH_DARK} filter="url(#paperTexP)" opacity={0.55} />

        {/* (rose des vents + courbes deco RETIREES : marqueurs 'template stock', appropriation Aziz) */}

        {/* GRILLE fine */}
        <g stroke={GRID} strokeWidth={1.6} opacity={0.7}>
          {gridV.map((x) => (
            <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />
          ))}
          {gridH.map((y) => (
            <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />
          ))}
        </g>

        {/* CARTE */}
        <g transform={`translate(${MAP_X},${MAP_Y}) scale(${MAP_SCALE})`}>
          {/* remplissage ocre (wipe bas->haut), texture vieilli */}
          <g clipPath="url(#fillWipe)" transform={`scale(${1 / MAP_SCALE})`}>
            <g transform={`scale(${MAP_SCALE})`}>
              <path d={SENEGAL_PATH} fill="url(#ocreFillP)" filter="url(#ocreTex)" />
            </g>
          </g>

          {/* trace du contour NAVY par-dessus (charte Souverain) */}
          <path
            d={SENEGAL_PATH}
            fill="none"
            stroke={NAVY}
            strokeWidth={4.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={SENEGAL_PATH_LEN}
            strokeDashoffset={SENEGAL_PATH_LEN * (1 - draw)}
          />
        </g>

        {/* (Sangomar + Dakar RETIRES : un seul foyer = le compteur. Decision Aziz.) */}
      </svg>

      {/* COUNT-UP central, A LA PLACE du nom : 0 $ → 8 000 000 $ */}
      <div
        style={{
          position: "absolute",
          left: centerX,
          top: centerY,
          transform: `translate(-50%,-50%) scale(${landScale})`,
          opacity: countOp,
          textAlign: "center",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        {/* chiffre nu sur la carte (pas de cartouche) — ombre claire pour le detacher de l'ocre */}
        <div
          style={{
            fontFamily: "'Bebas Neue','Impact',sans-serif",
            fontSize: 104,
            color: NAVY,
            letterSpacing: "1px",
            lineHeight: 1,
            textShadow: "0 2px 0 rgba(255,255,255,0.45), 0 4px 18px rgba(22,33,58,0.25)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {amountStr}
        </div>
      </div>

      {/* (Sous-titre du bas RETIRE : il doublait la voix mot pour mot. Decision Aziz —
          la voix porte le texte, l'ecran montre le compteur. Pas de redondance.) */}
    </AbsoluteFill>
  );
};

export default ProtoEffect_MapDrawParchemin;
