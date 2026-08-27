// MOTEUR: typo pure + bascule chromatique (le pivot probleme -> solution)
/**
 * FOSTER — PLAN 3 (5,597 -> 11,44 s) : LE TEMPS PASSE, PUIS LE PIVOT
 * ==================================================================
 * Reference : public/_client-sim/_references/foster/foster-with-confidence.mp4
 *
 * ⭐ LE DOSSIER N'AVAIT QUE LA MOITIE : il annoncait « typo pure sur noir,
 * *Still unresolved,* mot par mot » et placait « Introducing » dans un autre
 * plan. En realite tout est DANS LE MEME PLAN, et son evenement central est le
 * BASCULEMENT NOIR -> VERT : c'est le pivot de la video, du probleme vers la
 * solution.
 *
 * DECOUPAGE MESURE :
 *   5,60 -> 6,00  noir, rien
 *   6,20          « 09:00 Am »            (seul, centre)
 *   6,80          « 04:00 Pm »            <- l'heure a CHANGE : le temps passe,
 *                                            la demande reste sans reponse
 *   7,40          « 04:00 Pm » s'estompe
 *   8,00          « Still unresolved, »   mot par mot
 *   8,60          « ... Still overwhelming »
 *   9,20          phrase complete
 *   9,80          la phrase s'estompe, LE DEGRADE VERT MONTE PAR LE BAS,
 *                 « Introducing » apparait
 *   10,40 -> 11,30 « Introducing x FosterWith »
 *   11,44         coupe (des rectangles blancs entrent : plan suivant)
 *
 * TYPOGRAPHIE MESUREE (a la regle, cadre 1920x1080) :
 *   « Still unresolved, Still overwhelming » : x=420 -> 1500 (1080 px),
 *   ligne de base y~545 (centre vertical), capitales ~45 px => police ~62 px.
 *   ⭐ Les mots DEJA ecrits sont BLANCS, le dernier arrive en GRIS puis
 *   s'eclaircit — ce n'est pas un fondu global.
 */

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/** Temps ABSOLU du debut du plan dans la reference. */
const PLAN_START = 5.597;

const SFX = {
  /** Apparition d'un mot / d'une heure. */
  tick: "_client-sim/noteshield/sfx/tone.mp3",
  /** Le pivot vers le vert. */
  swell: "_client-sim/noteshield/sfx/hit-weak.mp3",
} as const;
const SFX_VOL = 0.5;

/**
 * Police MESUREE puis CORRIGEE au rendu : la phrase « Still unresolved, Still
 * overwhelming » occupe **55 % de la largeur du cadre** dans la reference,
 * contre 48,4 % avec 62 px => 62 * (55/48,4) = 70 px.
 */
const FONT = 70;
const FONT_STACK =
  '-apple-system, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif';

/** Fondu d'entree/sortie d'un element, en temps ABSOLU. */
const fade = (t: number, inA: number, inB: number, outA: number, outB: number) =>
  interpolate(t, [inA, inB, outA, outB], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

/**
 * Les mots de la phrase, avec leur instant d'apparition MESURE.
 * Un mot deja pose reste BLANC ; celui qui arrive est gris puis s'eclaircit.
 */
const WORDS: { w: string; at: number }[] = [
  { w: "Still", at: 7.95 },
  { w: "unresolved,", at: 8.15 },
  { w: "Still", at: 8.55 },
  { w: "overwhelming", at: 8.85 },
];

const INTRO: { w: string; at: number }[] = [
  { w: "Introducing", at: 9.75 },
  { w: "x", at: 10.35 },
  { w: "FosterWith", at: 10.75 },
];

export const Plan03Typo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tAbs = PLAN_START + frame / fps;

  /**
   * LE PIVOT — le degrade vert MONTE PAR LE BAS a partir de 9,75 s.
   * Mesure : a 9,80 s il occupe deja le tiers bas, a 10,40 s la moitie.
   * C'est ce basculement qui fait passer la video du probleme a la solution.
   */
  const green = interpolate(tAbs, [9.6, 10.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const clockA = fade(tAbs, 6.05, 6.25, 6.55, 6.75);
  const clockB = fade(tAbs, 6.65, 6.85, 7.25, 7.55);
  const phrase = fade(tAbs, 7.9, 8.1, 9.45, 9.8);
  /* ⛔ Pas de fade de sortie ici : « Introducing x FosterWith » est encore a
     l'ecran quand la coupe tombe a 11,44 s (verifie sur la reference). Des
     bornes egales feraient planter interpolate (« strictly monotonically
     increasing »), donc on borne au-dela de la fin du plan. */
  const intro = fade(tAbs, 9.7, 9.95, 12.5, 13.0);

  const line: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    /* La reference place la ligne un peu AU-DESSUS du centre (mesure : ligne
       de base y~545 mais bloc centre plus haut), pas exactement a 50 %. */
    top: "46.5%",
    transform: "translateY(-50%)",
    textAlign: "center",
    fontFamily: FONT_STACK,
    fontSize: FONT,
    fontWeight: 400,
    letterSpacing: "-0.5px",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* SFX : une pulsation par apparition, puis la montee du pivot. */}
      {[6.15, 6.75].map((at) => (
        <Sequence
          key={at}
          from={Math.round((at - PLAN_START) * fps)}
          durationInFrames={Math.round(0.35 * fps)}
        >
          <Audio src={staticFile(SFX.tick)} volume={SFX_VOL * 0.55} />
        </Sequence>
      ))}
      <Sequence
        from={Math.round((9.6 - PLAN_START) * fps)}
        durationInFrames={Math.round(1.2 * fps)}
      >
        <Audio src={staticFile(SFX.swell)} volume={SFX_VOL * 0.7} />
      </Sequence>

      {/* LE DEGRADE VERT — il monte par le bas. Teinte relevee sur la
          reference : un vert profond, presque sapin, qui s'eteint vers le noir. */}
      <AbsoluteFill
        style={{
          background:
            /*
              PROFIL MESURE sur la reference (canal vert moyen par bande de 10 %
              de hauteur, frame 11,30 s) :
                40-50 % : 12   50-60 % : 28   60-70 % : 42
                70-80 % : 58   80-90 % : 59   **90-100 % : 49 (ca REDESCEND)**
              => ce n'est pas un halo centre sous le cadre : c'est une BANDE
              lumineuse dont le coeur est vers 85 % de hauteur et qui s'attenue
              au bord inferieur.
              ⛔ Ma v1 saturait (halo trop haut), ma v2 sur-corrigeait (max 34
              contre 59 attendu). On modelise ici le profil reel avec un
              degrade lineaire a paliers.
            */
            /* Alphas divises par 2,55 : facteur MESURE au rendu v3, qui avait
               la bonne FORME mais etait 2,55x trop lumineux (159 de vert moyen
               au coeur contre 59 attendu). */
            "linear-gradient(180deg," +
            " rgba(0,0,0,0) 38%," +
            " rgba(8,52,40,0.12) 48%," +
            " rgba(13,92,70,0.24) 58%," +
            " rgba(18,132,98,0.34) 68%," +
            " rgba(22,158,116,0.385) 78%," +
            " rgba(23,163,120,0.39) 86%," +
            " rgba(19,138,102,0.355) 94%," +
            " rgba(16,116,86,0.31) 100%)",
          opacity: green,
        }}
      />

      {/* LES HEURES — « 09:00 Am » puis « 04:00 Pm » : le temps passe et la
          demande reste sans reponse. C'est ce qui justifie « Still unresolved ». */}
      <div style={{ ...line, opacity: clockA, color: "#e8e8ea" }}>09:00 Am</div>
      <div style={{ ...line, opacity: clockB, color: "#e8e8ea" }}>04:00 Pm</div>

      {/* LA PHRASE — mot par mot. Un mot pose reste blanc, celui qui arrive est
          gris et s'eclaircit : c'est ce qui donne la sensation d'ecriture. */}
      <div style={{ ...line, opacity: phrase }}>
        {WORDS.map(({ w, at }, i) => {
          const appear = interpolate(tAbs, [at, at + 0.22], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const settle = interpolate(tAbs, [at + 0.1, at + 0.5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const g = Math.round(150 + 82 * settle);
          return (
            <span
              key={`${w}-${i}`}
              style={{
                opacity: appear,
                color: `rgb(${g},${g},${g + 2})`,
                marginRight: 14,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>

      {/* LE PIVOT — « Introducing x FosterWith » sur le vert. */}
      <div style={{ ...line, opacity: intro }}>
        {INTRO.map(({ w, at }, i) => {
          const appear = interpolate(tAbs, [at, at + 0.25], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const settle = interpolate(tAbs, [at + 0.1, at + 0.55], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const g = Math.round(150 + 85 * settle);
          return (
            <span
              key={`${w}-${i}`}
              style={{
                opacity: appear,
                color: `rgb(${g},${g},${g + 2})`,
                marginRight: 14,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
