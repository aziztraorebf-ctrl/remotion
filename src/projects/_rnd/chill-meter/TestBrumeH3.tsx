// MOTEUR: RACCORD — montage technique, pas une scene. On superpose des calques existants
// (plateau + clip de brume genere + ChillMeterOverlay tel quel) pour TESTER une technique
// d'integration. Aucune intention narrative propre a ce fichier.
//
// TEST INTERNE 07/09 — jamais livre. Repond a UNE question : est-ce que le clip de brume
// genere par MiniMax H3 (fond noir opaque) s'integre proprement en `mixBlendMode: "screen"`,
// sans detourage alpha payant ?
//
// Mesure faite AVANT ce test sur le clip : coin (0,0,0) exact, zone haute a 0,5/255 de
// moyenne, 64,0 % de pixels quasi-noirs — meme profil que l'asset d'explosion deja valide
// (`explosion-blackbg-source.png`, 64,2 %), ou `screen` suffit. Cf.
// `memory/feedbacks/feedback_gemini-assets-fond-transparent.md` et le commentaire
// « LE TEST CLE » dans `src/projects/_rnd/vox-repro/Scene2JetsStrike.tsx`.
//
// ⛔ Pieges appliques ici (documentes, deja payes ailleurs) :
//  - `OffthreadVideo` nu lit la frame ABSOLUE de la composition -> toujours l'envelopper
//    dans <Sequence> (bug corrige dans GazoducActe3CarteTSGP.tsx et OuvertureBureauMixte.tsx).
//  - `screen` n'ecrete pas le rectangle du clip : il annule le noir, mais le bord HAUT
//    reste une frontiere nette si la brume y touche encore -> `maskImage` en degrade.
//  - Un blend pose PAR-DESSUS des traits fins les delave (key-learnings.md:638) -> la brume
//    passe SOUS le meter, jamais au-dessus.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { ChillMeterOverlay, type MeterState } from "./ChillMeterOverlay";

/** Hauteur de la bande de brume a l'ecran, en px sur 1080. */
const BANDE_H = 420;

/** Quel effet on teste. "brume" = bande basse ; "neige" = plein cadre. */
export type EffetTeste = "brume" | "neige" | "bords-pousse" | "bords-respire";

export const TestBrumeH3: React.FC<{
  state?: MeterState;
  avecPlateau?: boolean;
  effet?: EffetTeste;
}> = ({ state = "fill75", avecPlateau = true, effet = "brume" }) => {
  const frame = useCurrentFrame();

  // Montee douce : jamais l'opacite pleine d'un coup, sinon la brume "apparait" au lieu
  // de monter. Le clip fait 124 frames a 24 fps ; ici on tient sur 105 frames a 30 fps.
  const opacite = interpolate(frame, [0, 25, 80, 104], [0, 0.85, 0.85, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {avecPlateau && (
        <img
          src={staticFile("_client-sim/chill-meter/reference-06-09/plateau.png")}
          style={{ position: "absolute", top: 0, left: 0, width: 1920, height: 1080 }}
        />
      )}

      {/* LA BRUME — sous le meter, en `screen` : le noir du clip disparait, seule la
          matiere lumineuse subsiste. Aucun detourage, aucun credit API. */}
      <Sequence from={0}>
        <OffthreadVideo
          src={staticFile(
            effet === "neige"
              ? "_client-sim/chill-meter/test-brume/neige-h3.mp4"
              : effet === "bords-pousse"
                ? "_client-sim/chill-meter/test-brume/bords-pousse.mp4"
                : effet === "bords-respire"
                  ? "_client-sim/chill-meter/test-brume/bords-respire.mp4"
                  : "_client-sim/chill-meter/test-brume/brume-h3.mp4",
          )}
          muted
          style={{
            position: "absolute",
            left: 0,
            // ⛔ Cadrage DIFFERENT selon l'effet, ce n'est pas un detail :
            //  - la brume monte du sol -> bande basse ancree en bas ;
            //  - la neige TOMBE -> doit occuper TOUT le cadre, sinon les flocons
            //    apparaissent au milieu de l'ecran au lieu de venir du haut.
            //  - le givre de BORDS encadre tout le cadre -> plein cadre lui aussi.
            ...(effet === "brume"
              ? { bottom: 0, height: BANDE_H }
              : { top: 0, height: 1080 }),
            width: 1920,
            // ⛔ PAS `cover` : le clip fait 864x480 (ratio 1,8) et la bande 1920x420
            // (ratio 4,57). `cover` l'agrandit a 1067px de haut pour couvrir la largeur,
            // puis en rogne 647 — on ne voyait qu'une fine tranche du MILIEU du clip, pas
            // la brume du bas. `fill` etire : la brume est une matiere sans geometrie
            // reconnaissable, l'etirement ne se lit pas comme une deformation.
            objectFit: "fill",
            mixBlendMode: "screen",
            opacity: opacite,
            // Masque seulement pour la brume : il tue la ligne de coupe en haut de sa
            // bande. La neige occupe tout le cadre, elle n'a pas de bord a cacher —
            // un masque l'effacerait en haut, la ou les flocons doivent entrer.
            ...(effet === "brume"
              ? {
                  maskImage: "linear-gradient(to top, black 45%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to top, black 45%, transparent 100%)",
                }
              : {}),
            // ⛔ GIVRE DE BORDS — mesure du 07/09 : le givre poussait trop LOIN vers
            // l'interieur, surtout a GAUCHE ou il debordait sur la fenetre video qui
            // joue (60,9 % des pixels du bord gauche touches, +28,3 de luminance, contre
            // 0,4 % au centre de la fenetre). On le RETIENT aux bords par un masque qui
            // eteint le givre des qu'il depasse la bordure — plutot que de regenerer.
            // Gauche plus serre que les autres cotes : c'est la que sa video se trouve.
            ...(effet === "bords-pousse" || effet === "bords-respire"
              ? {
                  maskImage:
                    "linear-gradient(to right, black 0%, transparent 6%), " +
                    "linear-gradient(to left, black 0%, transparent 14%), " +
                    "linear-gradient(to bottom, black 0%, transparent 13%), " +
                    "linear-gradient(to top, black 0%, transparent 13%)",
                  WebkitMaskImage:
                    "linear-gradient(to right, black 0%, transparent 6%), " +
                    "linear-gradient(to left, black 0%, transparent 14%), " +
                    "linear-gradient(to bottom, black 0%, transparent 13%), " +
                    "linear-gradient(to top, black 0%, transparent 13%)",
                  maskComposite: "add",
                  WebkitMaskComposite: "source-over",
                }
              : {}),
            pointerEvents: "none",
          }}
        />
      </Sequence>

      {/* Le meter PAR-DESSUS la brume : ses traits fins et son texte restent nets. */}
      <ChillMeterOverlay state={state} chassis="rustic" />
    </AbsoluteFill>
  );
};
