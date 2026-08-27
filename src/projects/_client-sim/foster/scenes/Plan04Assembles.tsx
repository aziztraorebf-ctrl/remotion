// MOTEUR: composition d'images generees + typo (l'assemblage du dossier)
/**
 * FOSTER — PLAN 4 (11,44 -> 13,59 s) : « ASSEMBLES »
 * ==================================================
 * Reference : public/_client-sim/_references/foster/foster-with-confidence.mp4
 *
 * CE QUE FAIT LA REFERENCE : six vignettes d'enfants arrivent UNE PAR UNE en
 * couronne autour du mot « Assembles », legerement inclinees, a des distances
 * variables du centre. Puis TOUT DISPARAIT D'UN COUP a 13,59 s.
 * La mecanique raconte l'ASSEMBLAGE D'UN DOSSIER DE PREUVES : chaque vignette
 * est une piece qui vient s'ajouter. C'est le sens du mot « Assembles » — le
 * produit rassemble les elements du dossier Ofsted.
 *
 * RYTHME MESURE (comptage des zones claires, frame par frame) : montee continue
 * de 11,44 a ~12,6 s (les 6 vignettes se posent sur ~1,2 s), plateau ensuite,
 * puis chute a zero a 13,59 s.
 *
 * POSITIONS MESUREES a la regle (cadre 1920x1080, vignettes ~265 px) :
 *   (900,155) (1255,305) (660,400) (1320,655) (665,795) (1010,890)
 *   « Assembles » centre, ligne de base ~y=530.
 *   ⚠️ 2 corrections successives sur ces positions :
 *   1) 1er releve sur grille grossiere : trop etale a gauche.
 *   2) 2e releve, nuage bien CENTRE (verifie par calcul : centre de gravite a
 *      +8 px du centre du cadre) mais trop RESSERRE — la reference etale ses
 *      vignettes sur 970 px en x (480..1450), nous seulement 660. Un nuage
 *      centre mais compact SE LIT comme decale : c'est l'amplitude qui
 *      manquait, pas le centrage. Positions dilatees autour de x=960.
 *
 * ⭐ NOTRE VERSION ASSUMEE (decision d'Aziz) : la reference utilise des PHOTOS
 * d'enfants ; nous utilisons des ILLUSTRATIONS VECTORIELLES generees (Gemini
 * Lite, planche de 6 vignettes decoupee).
 * Pourquoi : des photos d'enfants generees posent une question de droit a
 * l'image et de realisme trompeur qu'un client B2B souleverait ; l'illustration
 * l'evite. ⛔ Le SVG pur a ete ECARTE : notre doctrine dit que l'organique
 * (figures humaines) n'y fonctionne pas — d'ou le passage par Gemini.
 * ℹ️ Test concluant : Gemini genere des enfants en style illustratif, AUCUN refus.
 */

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/** Temps ABSOLU du debut du plan. */
const PLAN_START = 11.44;

const SFX = {
  /** Chaque vignette qui se pose. */
  place: "_client-sim/noteshield/sfx/click.mp3",
} as const;
const SFX_VOL = 0.5;

/**
 * Les 6 vignettes : position MESUREE sur la reference (centre de la vignette,
 * en pixels sur un cadre 1920x1080), instant d'apparition, et inclinaison.
 * Les rotations sont volontairement inegales : dans la reference aucune
 * vignette n'est parfaitement droite (elles sont « posees », pas alignees).
 */
const CARDS = [
  { src: "kid1.png", x: 870, y: 150, at: 11.62, rot: -3.5 },
  { src: "kid2.png", x: 1390, y: 290, at: 11.72, rot: 2.5 },
  { src: "kid3.png", x: 520, y: 405, at: 11.86, rot: -2.0 },
  { src: "kid4.png", x: 1480, y: 660, at: 12.02, rot: 3.0 },
  { src: "kid5.png", x: 530, y: 800, at: 12.20, rot: -2.5 },
  { src: "kid6.png", x: 990, y: 900, at: 12.38, rot: 1.8 },
] as const;

/** Taille mesuree d'une vignette dans la reference. */
const CARD = 252;

export const Plan04Assembles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const tAbs = PLAN_START + frame / fps;

  /**
   * LE FOND VERT — il est deja monte a la fin du plan 3 : ce plan s'ouvre
   * dessus. Profil repris a l'identique du plan 3 (mesure du canal vert par
   * bande), pour que le raccord soit invisible.
   */
  const greenBg =
    "linear-gradient(180deg," +
    " rgba(0,0,0,0) 38%," +
    " rgba(8,52,40,0.12) 48%," +
    " rgba(13,92,70,0.24) 58%," +
    " rgba(18,132,98,0.34) 68%," +
    " rgba(22,158,116,0.385) 78%," +
    " rgba(23,163,120,0.39) 86%," +
    " rgba(19,138,102,0.355) 94%," +
    " rgba(16,116,86,0.31) 100%)";

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ background: greenBg }} />

      {/* SFX : un son par vignette qui se pose. ⛔ pas de whoosh sur une UI. */}
      {CARDS.map((c) => (
        <Sequence
          key={c.src}
          from={Math.round((c.at - PLAN_START) * fps)}
          durationInFrames={Math.round(0.3 * fps)}
        >
          <Audio src={staticFile(SFX.place)} volume={SFX_VOL * 0.6} />
        </Sequence>
      ))}

      {/* LE MOT — centre, il reste en place pendant que les pieces s'ajoutent
          autour. C'est lui le sujet : les vignettes s'assemblent AUTOUR de lui. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 530,
          transform: "translateY(-50%)",
          textAlign: "center",
          fontFamily:
            '-apple-system, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: 70,
          fontWeight: 400,
          color: "#f0f0f2",
          letterSpacing: "-0.5px",
        }}
      >
        Assembles
      </div>

      {/* LES VIGNETTES — chacune se pose avec un spring : elle arrive de plus
          loin (echelle > 1) et se cale. Une piece qu'on POSE, pas qui apparait. */}
      {CARDS.map((c) => {
        const local = frame - Math.round((c.at - PLAN_START) * fps);
        const s = spring({
          frame: local,
          fps,
          config: { damping: 14, mass: 0.6, stiffness: 130 },
          durationInFrames: Math.round(0.45 * fps),
        });
        const appear = interpolate(local, [0, 4], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        /* Elle arrive legerement plus grande puis se cale a 1. */
        const scale = interpolate(s, [0, 1], [1.12, 1]);

        return (
          <div
            key={c.src}
            style={{
              position: "absolute",
              left: (c.x / 1920) * width - CARD / 2,
              top: (c.y / 1080) * height - CARD / 2,
              width: CARD,
              height: CARD,
              opacity: appear,
              transform: `rotate(${c.rot}deg) scale(${scale})`,
              /* Le cadre blanc epais facon polaroid, comme la reference. */
              background: "#fff",
              padding: 8,
              boxShadow: "0 14px 40px rgba(0,0,0,0.55)",
            }}
          >
            <Img
              src={staticFile(`_client-sim/foster/vignettes/${c.src}`)}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
