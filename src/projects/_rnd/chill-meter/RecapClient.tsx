// MOTEUR: RACCORD — montage, pas une scene. On pose l'objet deja valide sur l'extrait
// reel de la cliente et on ecrit les annotations par-dessus. Aucune intention narrative
// propre a ce fichier : c'est une piece de COMMUNICATION client.
//
// ⛔ LA FORME EST LA CONTRAINTE PRINCIPALE (verdict Aziz 07/09, apres rejet du 1er recap) :
// le 1er montage faisait des zooms recadres et des split avant/apres — resultat, « du
// statique, differents ecrans qui defilent », on ne voyait jamais vraiment sa video.
//  - CADRE PLEIN, JAMAIS RECADRE : son extrait joue en entier, l'objet reste a sa place
//    et a sa taille reelles, exactement comme il apparaitra dans sa video YouTube.
//  - Les annotations arrivent EN HAUT, par-dessus, sans jamais toucher au cadre.
//  - ZERO frame statique, zero zoom, zero split avant/apres.
// Reference de forme validee : out/_r-and-d/chill-meter-3d/recap-forme-ref/
//   ANNOTEE-verification-06-09-v4.mp4
//
// ⛔ SEPARATION DES JALONS (decision Aziz 07/09) : le jalon 1 est toujours impayé et les
// jalons 2/3 ne sont meme pas finances. Melanger les trois dans une seule demonstration
// rend l'approbation ambigue — « approuve » ne veut plus rien dire. D'ou les DEUX
// chapitres marques a l'ecran : ce qui est a valider aujourd'hui, puis ce qui est offert
// en apercu. La frontiere doit se voir A L'IMAGE, pas seulement dans le texte du message.

import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { ChillMeterOverlay, type MeterState } from "./ChillMeterOverlay";

const FPS = 30;

/** Les 4 corrections du jalon 1, puis l'apercu. Duree en frames. */
const CH1_IDLE = 300; // 10 s — les 4 corrections se lisent sur l'objet au repos
const CARTON = 60; // 2 s — la frontiere entre les deux jalons
const CH2_ENTRANCE = 210; // 7 s — power-on (demande 5a)
// ⛔ MESURE 07/09 (bleu du sous-titre, B-R au coeur des glyphes) : +4 a la frame 0 du
// segment, +52 stabilise a partir de la frame 52. L'annotation ne doit donc PAS
// s'afficher des f0 : elle promettrait un allumage qu'on ne voit pas encore (defaut
// constate au 1er rendu de cette compo). Elle entre a la frame 40, pendant la montee.
const ENTRANCE_ANNOT_DELAI = 40;
const CH2_FILL75 = 165; // 5,5 s — « AbiGirl Reacts » qui s'allume (demande 5b)
const CH2_FILL100 = 135; // 4,5 s — l'etat plein, pour situer le 75 %

export const RECAP_DUREE =
  CH1_IDLE + CARTON + CH2_ENTRANCE + CH2_FILL75 + CH2_FILL100;

/** Le plateau reel qui tourne SANS INTERRUPTION sous tout le montage.
 *  C'est ce qui fait qu'on ne « defile » pas d'un ecran a l'autre : une seule prise. */
const PlateauContinu: React.FC = () => (
  <Sequence from={0}>
    <OffthreadVideo
      src={staticFile("_client-sim/chill-meter/test-brume/plateau-reel.mp4")}
      muted
      style={{ position: "absolute", top: 0, left: 0, width: 1920, height: 1080 }}
    />
  </Sequence>
);

/** Bandeau d'annotation en haut a gauche. Reprend le gabarit de la v4 validee :
 *  fond sombre translucide, texte blanc, coin haut gauche, jamais sur l'objet. */
const Annotation: React.FC<{ texte: string; sousTexte?: string; accent?: string }> = ({
  texte,
  sousTexte,
  accent = "#ffffff",
}) => {
  const frame = useCurrentFrame();
  // Fondu d'entree seulement : une annotation qui clignote distrait de la video.
  const op = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 28,
        left: 28,
        maxWidth: 1180,
        padding: "18px 30px",
        borderRadius: 10,
        backgroundColor: "rgba(14,18,26,0.86)",
        borderLeft: `6px solid ${accent}`,
        opacity: op,
      }}
    >
      <div
        style={{
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: 42,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.15,
        }}
      >
        {texte}
      </div>
      {sousTexte ? (
        <div
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: 30,
            fontWeight: 400,
            color: "#c9d4e4",
            marginTop: 8,
            lineHeight: 1.2,
          }}
        >
          {sousTexte}
        </div>
      ) : null}
    </div>
  );
};

/** Le carton de separation entre les deux jalons.
 *  ⛔ Il assombrit le plateau mais ne le REMPLACE pas : la video continue de tourner
 *  dessous, donc pas de frame statique — la contrainte de forme tient meme ici. */
const CartonJalon: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 12, CARTON - 12, CARTON], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "rgba(8,11,17,0.82)",
        opacity: op,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: 34,
          fontWeight: 600,
          letterSpacing: 4,
          color: "#7ec8f0",
          textTransform: "uppercase",
        }}
      >
        Preview
      </div>
      <div
        style={{
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: 62,
          fontWeight: 700,
          color: "#ffffff",
          marginTop: 14,
          textAlign: "center",
        }}
      >
        The animated states below are next milestone
      </div>
      <div
        style={{
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: 32,
          fontWeight: 400,
          color: "#c9d4e4",
          marginTop: 16,
          textAlign: "center",
        }}
      >
        Shown early so you can see where it is going — nothing to approve here yet.
      </div>
    </AbsoluteFill>
  );
};

/** Un segment : l'objet dans un etat donne, sur le plateau qui tourne, avec son annotation. */
const Segment: React.FC<{
  state: MeterState;
  texte: string;
  sousTexte?: string;
  accent?: string;
}> = ({ state, texte, sousTexte, accent }) => (
  <>
    <ChillMeterOverlay state={state} chassis="rustic" />
    <Annotation texte={texte} sousTexte={sousTexte} accent={accent} />
  </>
);

export const RecapClient: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Une seule prise continue : le plateau ne s'interrompt jamais. */}
      <PlateauContinu />

      {/* ---- CHAPITRE 1 : les 4 corrections du jalon 1, a valider ---- */}
      {/* Les 4 se lisent simultanement sur l'objet au repos (taille, position, ombre,
          icones bleues) : on ne coupe donc pas entre elles, on fait defiler le texte
          pendant que l'objet reste a l'ecran, immobile et entier. */}
      <Sequence from={0} durationInFrames={CH1_IDLE}>
        <ChillMeterOverlay state="idle" chassis="rustic" />
      </Sequence>
      <Sequence from={0} durationInFrames={75}>
        <Annotation
          texte="1. Size unchanged  ·  2. Moved slightly lower"
          sousTexte="Same meter size as before, sitting lower in the frame."
        />
      </Sequence>
      <Sequence from={75} durationInFrames={75}>
        <Annotation
          texte="3. Stronger contact shadow"
          sousTexte="Darker shadow underneath, so it sits in the scene instead of hovering."
        />
      </Sequence>
      <Sequence from={150} durationInFrames={75}>
        <Annotation
          texte="4. Button icons blue from the start"
          sousTexte="Blue at idle / 0%, not only once the meter fills."
        />
      </Sequence>
      <Sequence from={225} durationInFrames={75}>
        <Annotation
          texte="Frost no longer floats below the meter"
          sousTexte="Something I spotted on my side — it now stops at the base."
        />
      </Sequence>

      {/* ---- LA FRONTIERE ENTRE LES JALONS, VISIBLE A L'ECRAN ---- */}
      <Sequence from={CH1_IDLE} durationInFrames={CARTON}>
        <ChillMeterOverlay state="idle" chassis="rustic" />
        <CartonJalon />
      </Sequence>

      {/* ---- CHAPITRE 2 : apercu (jalons 2 et 3), rien a approuver ---- */}
      <Sequence from={CH1_IDLE + CARTON} durationInFrames={CH2_ENTRANCE}>
        <ChillMeterOverlay state="entrance" chassis="rustic" />
      </Sequence>
      <Sequence
        from={CH1_IDLE + CARTON + ENTRANCE_ANNOT_DELAI}
        durationInFrames={CH2_ENTRANCE - ENTRANCE_ANNOT_DELAI}
      >
        <Annotation
          accent="#7ec8f0"
          texte="Preview — power-on"
          sousTexte="'MAX CHILL DETECTION' lights up blue as the meter powers on."
        />
      </Sequence>
      <Sequence
        from={CH1_IDLE + CARTON + CH2_ENTRANCE}
        durationInFrames={CH2_FILL75}
      >
        <Segment
          state="fill75"
          accent="#7ec8f0"
          texte="Preview — 75%"
          sousTexte="Only the wording and the two snowflakes light up — the plaque stays as it is."
        />
      </Sequence>
      <Sequence
        from={CH1_IDLE + CARTON + CH2_ENTRANCE + CH2_FILL75}
        durationInFrames={CH2_FILL100}
      >
        <Segment
          state="fill100"
          accent="#7ec8f0"
          texte="Preview — 100%"
          sousTexte="Full chill, for reference."
        />
      </Sequence>
    </AbsoluteFill>
  );
};
