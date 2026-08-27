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
 * de 11,44 a ~12,6 s (les 6 vignettes se posent sur ~1,2 s), puis chute a zero
 * a 13,59 s.
 *
 * ⭐⭐ LES VIGNETTES NE SONT PAS IMMOBILES — ELLES ORBITENT (retour d'Aziz).
 * Ma v3 les posait puis les figeait : « ca fait une version cheap, ce n'est pas
 * du tout pareil ». Mesure du nuage entier (centre de gravite + rayon moyen des
 * pixels clairs, le mot et le watermark masques) :
 *     t=12,60 -> rayon 441 px      t=13,00 -> 394      t=13,48 -> 381
 * Le rayon DECROIT continument et le mouvement S'AMORTIT (-15 px par pas de
 * 0,08 s au debut, -2 px a la fin), pendant que chaque vignette change de
 * position ANGULAIRE.
 * => c'est une **CONTRACTION EN SPIRALE** : elles convergent vers le mot en
 * tournant autour de lui, et ca ralentit. Le mot, lui, reste FIXE.
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
/**
 * Positions en POLAIRE autour du centre du cadre — c'est ce qui permet de les
 * faire ORBITER. `a0` = angle de depart (degres, 0 = droite, sens horaire),
 * `r0` = rayon de depart en px. Les valeurs derivent des positions relevees a
 * la regle, converties en polaire.
 * ⚠️ Rayons volontairement INEGAUX : dans la reference les vignettes ne sont pas
 * sur un cercle parfait, elles sont a des distances variables du mot.
 */
const CARDS = [
  { src: "kid1.png", a0: -104, r0: 412, at: 11.62, rot: -3.5 },
  { src: "kid2.png", a0: -30, r0: 516, at: 11.72, rot: 2.5 },
  { src: "kid3.png", a0: 197, r0: 474, at: 11.86, rot: -2.0 },
  { src: "kid4.png", a0: 13, r0: 550, at: 12.02, rot: 3.0 },
  { src: "kid5.png", a0: 150, r0: 516, at: 12.20, rot: -2.5 },
  { src: "kid6.png", a0: 85, r0: 377, at: 12.38, rot: 1.8 },
] as const;

/**
 * L'ORBITE — parametres CALES sur la mesure :
 * le rayon moyen passe de 441 a 381 px entre 12,60 et 13,48 s en s'amortissant.
 * On applique donc une contraction amortie a partir de la pose de chaque
 * vignette, et une rotation lente et constante du nuage entier.
 */
/**
 * ⭐ VITESSE ANGULAIRE MESUREE, pas dosee (retour d'Aziz : « ca devrait etre 2 a
 * 3 fois plus rapide, la c'est presque statique »).
 * Methode : angle du CENTRE DE GRAVITE du nuage frame par frame (il tourne a la
 * meme vitesse que les vignettes puisque le nuage n'est pas symetrique).
 *   valeurs relevees entre 12,45 et 13,49 s : 30 a 152 deg/s
 *   => moyenne 83 deg/s, mediane 89. Sur les 2,15 s du plan : ~180 deg, un
 *      DEMI-TOUR complet.
 * ⛔ Ma v8 tournait a 11 deg/s, soit **7,5x trop lent** — d'ou l'impression de
 * statique. Une valeur choisie « pour que ca ne file pas » sans la mesurer.
 */
const ORBIT_DEG_PER_SEC = 83;
/**
 * ⭐ Contraction RESOLUE, pas dosee.
 * J'ai ajuste ce parametre 4 fois dans les deux sens (trop faible, puis trop
 * fort) avant de poser le systeme. Cibles mesurees sur la reference :
 *     rayon moyen du nuage = 443 px a t=12,60 s  et  385 px a t=13,40 s
 * Avec damp(t) = 1 - exp(-K*(t - 12,38)) et K = 1,4 :
 *     damp(12,60) = 0,265   damp(13,40) = 0,760
 * Deux equations R0*(1 - C*damp) = cible, deux inconnues :
 *     => CONTRACT = 0,247   et rayon moyen de depart R0 = 474 px
 * Verifie : 443,1 et 385,1 px. **Resoudre le systeme au lieu d'ajuster un
 * parametre a la fois — c'etait la sortie de boucle.**
 */
const ORBIT_DAMP_K = 1.4;
const CONTRACT = 0.247;

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
          /* 70 -> 88 px : retour d'Aziz, « le mot au milieu devrait etre
             legerement plus grand ». */
          fontSize: 88,
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
        /* ⛔ La ROTATION est pilotee par le temps du PLAN, pas par la pose de
           chaque vignette : Aziz veut qu'elle « tienne durant toute la duree de
           la scene ». Une vignette qui arrive tard rejoint le nuage deja en
           rotation, elle ne repart pas de son angle initial. */
        const since = frame / fps;
        /*
          ⛔ La CONTRACTION, elle, est pilotee par le temps du PLAN, pas par
          celui de chaque vignette : sinon les dernieres posees (a 12,38 s)
          n'ont pas le temps de converger et le rayon moyen stagne.
          Mesure v5 : on s'arretait a 407 px la ou la reference descend a 385.
        */
        /* ⛔ Elle demarre quand les 6 vignettes sont POSEES (12,38 s), pas au
           debut du plan : sinon elle a deja tout consomme a 12,60 s et le nuage
           part trop serre (mesure v6 : 410 px la ou la reference est a 443). */
        const tPlan = Math.max(0, PLAN_START + frame / fps - 12.38);
        const damp = 1 - Math.exp(-tPlan * ORBIT_DAMP_K);
        const r = c.r0 * (1 - CONTRACT * damp);
        const ang = ((c.a0 + ORBIT_DEG_PER_SEC * since) * Math.PI) / 180;
        const px = 960 + r * Math.cos(ang);
        const py = 540 + r * Math.sin(ang);
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
              left: (px / 1920) * width - CARD / 2,
              top: (py / 1080) * height - CARD / 2,
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
