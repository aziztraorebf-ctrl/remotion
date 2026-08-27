// MOTEUR: clip genere (MiniMax H3) + cartouches iOS animes en Remotion
/**
 * FOSTER — PLAN 7 (18,45 -> 23,40 s) : LA MAISON ET LES CARTOUCHES
 * ================================================================
 * Reference : public/_client-sim/_references/foster/foster-with-confidence.mp4
 *
 * Premier plan qui monte un CLIP GENERE et du motion design par-dessus.
 *
 * ⛔ QUATRE CORRECTIONS AU TABLEAU DE DECOUPAGE (« 18,4 -> 25,1 s ») :
 *
 * 1. LE PLAN FINIT A 23,40 s, PAS 25,06. Mesure : la luminance mediane de la
 *    zone droite passe de 61 a 173 puis 253 entre 23,20 et 23,60 — c'est le
 *    dashboard blanc du plan 8 qui arrive. Le plan dure donc 4,95 s = 148 frames.
 *
 * 2. IL Y A DEUX CARTOUCHES EMPILES, pas un seul :
 *      - un TITRE « Jenny Foster Care »
 *      - sous lui un CORPS de texte qui s'ecrit MOT PAR MOT (« Jenny cares for
 *        her foster child, but is being pulled into a second, unpaid admin job. »)
 *        ⚠️ Le dernier mot n'est lisible qu'a la toute fin du plan : ne PAS le
 *        deviner. J'avais ecrit « unpaid placement » avant de lire la frame 23,28.
 *    Mesure de l'ecriture progressive : la proportion de pixels clairs de la
 *    zone monte regulierement de 16,8 % (19,4 s) a 25,2 % (23,2 s). Ce n'est pas
 *    un fondu — c'est du texte qui s'ajoute.
 *
 * 3. LE CARTOUCHE NAIT PENDANT LA DESCENTE, ~0,7 s apres le debut du plan
 *    (mesure : la pastille apparait vers 19,15 s, se stabilise vers 19,80 s).
 *    ⭐ Il ne surgit PAS a sa taille finale : il nait comme une petite PASTILLE
 *    VIDE qui s'elargit ensuite. Detail visible seulement en regardant la frame
 *    a 19,80 s — une apparition en fondu simple raterait ce geste.
 *
 * 4. LA SORTIE EST UN FONDU CROISE, PAS UNE COUPE. A 23,28 s le dashboard du
 *    plan 8 est deja superpose a la maison, et les cartouches restent lisibles
 *    par-dessus. C'est ce qui expliquait un ecart de mesure en fin de plan
 *    (surface claire 8,3 % cote reference contre 21,2 chez nous) : je comparais
 *    notre plan PLEIN a une frame de reference deja a moitie fondue.
 *    -> Le fondu appartient a l'ASSEMBLAGE des deux plans, pas a ce composant.
 *
 * ── LE CLIP ────────────────────────────────────────────────────────────────
 * `clipA-1080p-16x9.mp4` — MiniMax H3, pilote par un PREVIS de camera
 * (`mkprevis-drone-descente.py`), puis upscale 480p -> 1080p (ByteDance) et
 * recadre en 16:9. Il fait 154 frames a 30 fps ; le plan en demande 148, donc
 * il couvre le plan ENTIER avec 6 frames de marge — aucun gel necessaire.
 * ⭐ Registre PHOTOREALISTE choisi par Aziz pour la continuite du raccord avec
 * le plan 6 (satellite Mapbox). La variante vectorielle, pourtant meilleure sur
 * les mesures, aurait lu comme une COUPE au milieu d'un mouvement continu.
 * Regle complete : `memory/key-learnings.md` § METHODE.
 */

import React from "react";
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const PLAN_START = 18.45;

/** Police systeme : les cartouches de la reference sont des cartes iOS. */
const FONT =
  '-apple-system, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif';

const TITRE = "Jenny Foster Care";
const CORPS =
  "Jenny cares for her foster child, but is being pulled into a second, unpaid admin job.";

/** Bornes MESUREES, en frames depuis le debut du plan (30 fps). */
const F_PASTILLE = 21; // 19,15 s — la pastille vide apparait
const F_STABLE = 41; // 19,80 s — le cartouche a sa taille finale
/**
 * ⭐ 20,65 s — le TITRE n'arrive qu'ICI, mesure par la proportion de pixels tres
 * clairs (>170) dans la bande du cartouche : 0,0 % jusqu'a 20,50 s puis 2,2 %
 * a 20,65 et une montee reguliere ensuite.
 * ⛔ Je l'avais cale sur F_STABLE (19,80 s), soit presque UNE SECONDE trop tot.
 * Le cartouche VIDE vit seul pendant ~1,5 s avant que son texte n'arrive —
 * c'est ce temps d'attente qui donne au plan son rythme posé, et c'est lui que
 * mes 3 premieres corrections cherchaient en vain ailleurs.
 */
const F_TITRE = 66;
const F_TEXTE_FIN = 142; // 23,20 s — le dernier mot est ecrit

export const Plan07Maison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  /**
   * L'OUVERTURE DU CARTOUCHE — mesure : il nait en pastille puis s'elargit.
   * Un spring porte la largeur (le geste a un leger rebond, comme les cartes
   * iOS), tandis que la hauteur suit une courbe plus sage : une carte qui
   * rebondit dans les deux axes fait « jouet ».
   */
  const ouverture = spring({
    frame: frame - F_PASTILLE,
    fps,
    config: { damping: 200, mass: 0.7 },
    durationInFrames: F_STABLE - F_PASTILLE,
  });

  const cardW = interpolate(ouverture, [0, 1], [86, 470]);
  const cardOpacity = interpolate(
    frame,
    [F_PASTILLE, F_PASTILLE + 6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  /**
   * LE TITRE n'apparait qu'une fois la pastille assez large pour l'accueillir —
   * sinon il deborde du cartouche pendant l'ouverture.
   */
  /**
   * ⭐⭐ LE TITRE S'ECRIT MOT PAR MOT, LUI AUSSI — « Jenny » puis « Foster »
   * puis « Care », chaque mot arrivant d'abord en gris clair avant de blanchir.
   * ⛔ Je l'affichais d'un seul bloc. Ni Gemini ni ma propre lecture des frames
   * ne l'avaient vu : c'est GROK (3e voix ajoutee ce jour) qui l'a releve, et
   * la verification a l'oeil sur les frames 20,70 et 21,25 s le confirme
   * exactement. GPT l'avait vu aussi mais sa reponse s'est trouvee TRONQUEE en
   * plein milieu de cette ligne — vu, mais perdu.
   * Mesure des paliers : « Jenny » ~20,65 s · « Foster » ~20,95 · « Care » ~21,25.
   */
  const motsTitre = TITRE.split(" ");
  const titreVisible = interpolate(
    frame,
    [F_TITRE, F_TITRE + 27],
    // +1 pour que le DERNIER mot atteigne lui aussi son opacite pleine :
    // sans ca l'interpolation s'arrete pile a son arrivee et « Care » reste gris.
    [0, motsTitre.length + 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  /** Le conteneur ne doit exister qu'a partir du 1er mot. */
  const titreOpacity = interpolate(
    frame,
    [F_TITRE, F_TITRE + 5],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  /**
   * LE CORPS DE TEXTE s'ecrit MOT PAR MOT (mesure : montee reguliere de la
   * surface claire, 16,8 % -> 25,2 %, sans palier). On revele donc un nombre
   * croissant de mots, pas un fondu global.
   */
  const mots = CORPS.split(" ");
  const motsVisibles = Math.round(
    interpolate(frame, [F_TITRE + 12, F_TEXTE_FIN], [0, mots.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.ease),
    }),
  );

  /** Le bloc de corps se deplie sous le titre, un peu apres lui. */
  const corpsOuverture = spring({
    frame: frame - F_TITRE - 12,
    fps,
    config: { damping: 200, mass: 0.8 },
    durationInFrames: 14,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo
        src={staticFile("_client-sim/foster/clipA-1080p-16x9.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        // Le clip n'a pas d'audio (verifie), mais on le declare muet par principe.
        muted
      />

      {/*
        Les cartouches vivent dans la moitie DROITE — c'est l'espace que
        l'oblique de la camera laisse libre. C'est precisement ce qui a fait
        pencher pour le clip realiste : la variante vectorielle, plus frontale,
        remplissait davantage le cadre et laissait moins de place ici.
      */}
      <AbsoluteFill
        style={{
          alignItems: "flex-end",
          justifyContent: "flex-start",
          paddingTop: 268,
          paddingRight: 96,
          pointerEvents: "none",
        }}
      >
        <div style={{ width: cardW, opacity: cardOpacity }}>
          {/* CARTOUCHE 1 — le titre */}
          <div
            style={{
              borderRadius: 22,
              padding: "18px 26px",
              /**
               * ⛔⛔ CE REGLAGE A COUTE 3 RENDUS PARCE QUE JE MESURAIS LE MAUVAIS
               * OBJET. Ma metrique comptait les pixels clairs de TOUTE la zone
               * droite — donc surtout le FEUILLAGE, pas la carte. Elle donnait
               * 28,9 % contre 13,9 sur la reference, et deux corrections
               * successives (retarder le texte, baisser l'opacite) ne l'ont pas
               * bougee d'un point : je corrigeais un objet qui n'etait pas en
               * cause. En isolant les deux :
               *     decor    : REF lum 91,2  ·  nous 79,4   (proche)
               *     CARTOUCHE: REF lum 44,6  ·  nous 122,7  (2,8x trop clair)
               * -> le defaut etait bien la carte, mais seule une mesure du
               * CARTOUCHE SEUL pouvait le dire. Cf. le piege « mesurer selon le
               * BON AXE » du protocole REPRO-FOSTER.
               * La reference est une vitre a peine teintee, pas une carte blanche.
               */
              background: `rgba(255,255,255,${0.015 + 0.045 * titreOpacity})`,
              border: `1px solid rgba(255,255,255,${0.16 + 0.10 * titreOpacity})`,
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                fontFamily: FONT,
                fontSize: 34,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: -0.2,
              }}
            >
              {motsTitre.map((mot, i) => (
                <span
                  key={i}
                  style={{
                    // Le mot en cours arrive en gris clair puis blanchit —
                    // visible a l'oeil sur « Foster » a 20,70 s et « Care » a 21,25.
                    opacity:
                      i < Math.floor(titreVisible)
                        ? 1
                        : i === Math.floor(titreVisible)
                          ? 0.35 + 0.3 * (titreVisible % 1)
                          : 0,
                  }}
                >
                  {mot}
                  {i < motsTitre.length - 1 ? " " : ""}
                </span>
              ))}
            </span>
          </div>

          {/* CARTOUCHE 2 — le corps, qui s'ecrit mot par mot.
              ⛔ Il n'est monte QUE lorsqu'il a du texte a montrer : un cartouche
              vide en attente occupait de la place et eclaircissait la zone
              (c'est ce qui faisait 28,9 % contre 13,9 mesures sur la reference).
              Retarder son apparition ne suffisait pas — il fallait qu'il
              n'existe pas du tout. */}
          {motsVisibles > 0 && (
          <div
            style={{
              marginTop: 18,
              borderRadius: 22,
              padding: "20px 26px",
              // Meme mesure que le cartouche titre : une vitre, pas une carte.
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.20)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.16)",
              transform: `scaleY(${corpsOuverture})`,
              transformOrigin: "top center",
              opacity: corpsOuverture,
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: FONT,
                fontSize: 25,
                lineHeight: 1.42,
                fontWeight: 600,
                color: "#fff",
              }}
            >
              {mots.map((mot, i) => (
                <span
                  key={i}
                  style={{
                    // Le mot en cours arrive en gris clair avant de blanchir —
                    // c'est ce qu'on voit sur la frame a 22,00 s, ou « second,
                    // unpaid » est encore plus pale que le reste.
                    opacity: i < motsVisibles ? 1 : i === motsVisibles ? 0.45 : 0,
                  }}
                >
                  {mot}
                  {i < mots.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
          </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
