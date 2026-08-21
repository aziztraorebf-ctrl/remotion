// MOTEUR: clip genere (H3) + motion design React (pilier 4) par-dessus
//
// LE PLAN COMBINE — la conclusion du test "personnage vector plat" (2026-08-20).
//
// Ce que les 3 essais precedents ont etabli, mesure et vu :
//   - H3 porte LE VIVANT : le soupir du personnage (epaules, sourcils, yeux qui se ferment),
//     la matiere des objets (une vraie tour de papier, des feuilles dessinees). Rien de tout
//     cela n'est codable en deterministe a un cout raisonnable.
//   - H3 ne sait PAS ECRIRE : son calendrier sortait en charabia ("FLANE", chiffres decoratifs).
//     Toute lettre ou tout chiffre qui doit etre EXACT est hors de sa portee.
//   - Remotion porte LE LISIBLE : texte net, chiffres justes, timing au frame, revision au
//     parametre. C'est aussi ce qui tient la promesse commerciale du deterministe.
//
// => Le clip D est genere SANS calendrier (mur droit laisse vide par EMPTY WALL LOCK),
//    et le calendrier est pose ICI, en React. Meme seed que le clip C : seul le prompt change.
//
// C'est le pattern "Fable compose le decor, NOS composants animent" transpose a H3.

import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FPS = 30;
// Le clip H3 fait 9,417 s a 24 fps natif. En frames PROJET (30 fps) : 9.417 * 30 = 283.
const CLIP_FRAMES = 283;

export const MIXTE_FPS = FPS;
export const MIXTE_FRAMES = CLIP_FRAMES;

const PAPER = "#FFFFFF";
const INK = "#3C4654";
const RED = "#C4453C";
const SHADOW = "rgba(60, 70, 84, 0.18)";

// ---------------------------------------------------------------------------
// LE CALENDRIER — la brique deterministe. Position calee sur la zone que le prompt
// H3 laisse volontairement vide (mur, haut-droite).
// ---------------------------------------------------------------------------
const CAL_X = 1545;
const CAL_Y = 120;
const CAL_W = 210;
const CAL_H = 232;

// Les jours defilent : c'est LUI qui dit "le temps passe" pendant que l'homme s'enfonce.
// Cale sur la dramaturgie du clip : le soupir tombe vers 4-6 s (frames 120-180).
const JOURS: { day: string; at: number }[] = [
  { day: "02", at: 12 },
  { day: "03", at: 78 },
  { day: "04", at: 138 },
  { day: "05", at: 204 },
];

const CalendrierMural: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Il se POSE (spring) au lieu de fondre : un objet qui apparait doit arriver quelque part.
  const pose = spring({
    frame: frame - JOURS[0].at,
    fps,
    config: { mass: 0.7, damping: 14, stiffness: 180 },
    durationInFrames: 14,
  });
  const scale = interpolate(pose, [0, 1], [0.84, 1]);
  const opacity = interpolate(frame, [JOURS[0].at, JOURS[0].at + 7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let idx = 0;
  for (let i = 0; i < JOURS.length; i++) {
    if (frame >= JOURS[i].at) idx = i;
  }
  const jour = JOURS[idx];

  // Le flip de page : 5 frames, ecrase puis rebondit. Sans lui, le chiffre "saute" d'un
  // etat a l'autre et se lit comme un bug d'affichage, pas comme une page qui tourne.
  const sinceFlip = frame - jour.at;
  const flip =
    sinceFlip >= 0 && sinceFlip < 5
      ? interpolate(sinceFlip, [0, 5], [0, 1], { extrapolateRight: "clamp" })
      : 1;
  const flipScaleY = interpolate(flip, [0, 0.5, 1], [0.55, 1.04, 1]);

  if (frame < JOURS[0].at) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: CAL_X,
        top: CAL_Y,
        width: CAL_W,
        height: CAL_H,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center top",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: PAPER,
          borderRadius: 9,
          boxShadow: `0 8px 18px ${SHADOW}`,
        }}
      />
      {/* la reliure : deux anneaux, c'est ce qui dit "calendrier" en un coup d'oeil */}
      {[0.32, 0.68].map((p) => (
        <div
          key={p}
          style={{
            position: "absolute",
            left: CAL_W * p - 7,
            top: -8,
            width: 14,
            height: 18,
            borderRadius: 7,
            border: `3px solid ${INK}`,
            borderBottomColor: "transparent",
            opacity: 0.55,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 60,
          background: RED,
          borderRadius: "9px 9px 0 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: PAPER,
          fontFamily: "Georgia, serif",
          fontWeight: 700,
          fontSize: 27,
          letterSpacing: "0.18em",
        }}
      >
        MARS
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 60,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scaleY(${flipScaleY})`,
          transformOrigin: "center top",
        }}
      >
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            fontSize: 104,
            color: INK,
            lineHeight: 1,
          }}
        >
          {jour.day}
        </span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
export const OuvertureBureauMixte: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#F5EFE0" }}>
      {/* Le clip H3 : le personnage qui vit, les feuilles, la pile. Sans calendrier. */}
      {/* ⛔ TOUJOURS dans une <Sequence> : un OffthreadVideo nu lit la frame ABSOLUE de la
          composition et affiche sa derniere image FIGEE une fois le clip termine. */}
      <Sequence from={0} durationInFrames={CLIP_FRAMES}>
        <OffthreadVideo
          src={staticFile("_r-and-d/vector-plat/chemin-D-h3-sans-calendrier.mp4")}
          style={{ width: 1920, height: 1080, objectFit: "cover" }}
          muted
        />
      </Sequence>

      {/* Le calendrier deterministe, pose par-dessus : texte net, chiffres justes. */}
      <CalendrierMural />
    </AbsoluteFill>
  );
};
