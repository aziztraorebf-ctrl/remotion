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
//
// ⛔⛔ DEFAUT DE LA v3, MESURE ET CORRIGE (07/09, souleve par Aziz) : le chapitre 1 etait
// en `state="idle"` — un ETAT FIXE. Mesure sur la zone de l'objet seule (crop 560x300,
// 145 echantillons a 0,2 s) : 0,10 % de pixels changeant en moyenne, soit du bruit de
// compression. Seule SA video bougeait derriere, ce qui masquait que l'objet, lui, ne
// faisait rien — et l'echantillonnage global (hashs de frames entieres) ne pouvait pas
// le voir. ⭐ Ses 4 corrections ne sont pas des etats, ce sont des CHANGEMENTS : une
// ombre qui se forme, un objet qui se pose, des icones qui s'allument. Ca se montre en
// train de se produire, pas sur un objet inerte.
//
// ⭐⭐ CONTRAINTE QUI DECOUPE LES CHAPITRES (ChillMeterRustic.tsx:190) :
//     bandeauOn = powerOn * clamp((chill - 55) / 20)
// L'allumage de la plaque « AbiGirl Reacts » est pilote par le NIVEAU, pas par un etat
// nomme : rien jusqu'a 55, plein a 75. Le montrer OBLIGE donc a monter jusqu'au 75 % —
// il n'existe aucun moyen de le montrer « avant ». D'ou : le chapitre 1 monte a 50 %
// (`fill50` va de 25 a 50, sous le seuil) et la plaque y reste metal, donc rien du
// jalon 3 n'est devoile dans la partie a valider ; l'allumage vit dans l'apercu.
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
// CHAPITRE 1 — tout est MOUVEMENT : l'objet arrive et se pose (l'ombre se forme a
// l'impact = correction 3 visible en train de se produire), s'allume icones deja bleues
// (correction 4), a sa position basse (2) et sa taille inchangee (1). Puis la jauge monte
// jusqu'a 50 % pour montrer que l'objet VIT, sans franchir le seuil de 55 % du bandeau.
const CH1_ENTREE = 150; // 5 s — arrivee, atterrissage, allumage
const CH1_MONTEE = 165; // 5,5 s — montee de la jauge jusqu'a 50 %
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
  CH1_ENTREE + CH1_MONTEE + CARTON + CH2_ENTRANCE + CH2_FILL75 + CH2_FILL100;

const T_CARTON = CH1_ENTREE + CH1_MONTEE;
const T_CH2 = T_CARTON + CARTON;

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

      {/* ---- CHAPITRE 1 : les 4 corrections du jalon 1, a valider ----
           ⛔ En MOUVEMENT, pas en etat fixe : c'est le defaut mesure de la v3. */}

      {/* L'objet arrive, atterrit, s'allume. L'ombre de contact se forme A L'IMPACT :
          la correction 3 se voit donc se produire, au lieu d'etre decrite. */}
      <Sequence from={0} durationInFrames={CH1_ENTREE}>
        <ChillMeterOverlay state="entrance" chassis="rustic" />
      </Sequence>
      {/* Puis la jauge monte jusqu'a 50 % — l'objet VIT, et la plaque reste metal
          (seuil du bandeau a 55 %), donc rien du jalon 3 n'apparait ici. */}
      <Sequence from={CH1_ENTREE} durationInFrames={CH1_MONTEE}>
        <ChillMeterOverlay state="fill50" chassis="rustic" />
      </Sequence>

      {/* Les annotations defilent PAR-DESSUS le mouvement continu. */}
      <Sequence from={0} durationInFrames={78}>
        <Annotation
          texte="1. Size unchanged  ·  2. Moved slightly lower"
          sousTexte="Same meter size as before, sitting lower in the frame."
        />
      </Sequence>
      <Sequence from={78} durationInFrames={72}>
        <Annotation
          texte="3. Stronger contact shadow"
          sousTexte="Watch the shadow as it lands — darker underneath, so it sits in the scene instead of hovering."
        />
      </Sequence>
      <Sequence from={150} durationInFrames={80}>
        <Annotation
          texte="4. Button icons blue from the start"
          sousTexte="Blue at idle / 0%, not only once the meter fills."
        />
      </Sequence>
      <Sequence from={230} durationInFrames={85}>
        <Annotation
          texte="Frost no longer floats below the meter"
          sousTexte="Something I spotted on my side — it now stops at the base."
        />
      </Sequence>

      {/* ---- LA FRONTIERE ENTRE LES JALONS, VISIBLE A L'ECRAN ---- */}
      <Sequence from={T_CARTON} durationInFrames={CARTON}>
        <ChillMeterOverlay state="fill50" chassis="rustic" />
        <CartonJalon />
      </Sequence>

      {/* ---- CHAPITRE 2 : apercu (jalons 2 et 3), rien a approuver ---- */}
      <Sequence from={T_CH2} durationInFrames={CH2_ENTRANCE}>
        <ChillMeterOverlay state="entrance" chassis="rustic" />
      </Sequence>
      <Sequence
        from={T_CH2 + ENTRANCE_ANNOT_DELAI}
        durationInFrames={CH2_ENTRANCE - ENTRANCE_ANNOT_DELAI}
      >
        <Annotation
          accent="#7ec8f0"
          texte="Preview — power-on"
          sousTexte="'MAX CHILL DETECTION' lights up blue as the meter powers on."
        />
      </Sequence>
      <Sequence
        from={T_CH2 + CH2_ENTRANCE}
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
        from={T_CH2 + CH2_ENTRANCE + CH2_FILL75}
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
