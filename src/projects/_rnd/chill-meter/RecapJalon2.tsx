// MOTEUR: RACCORD — montage, pas une scene. Meme principe que RecapClient.tsx : on pose
// l'objet deja valide sur l'extrait reel de la cliente, cadre plein, jamais recadre.
// Piece de COMMUNICATION client, pas une composition narrative.
//
// ⭐ 09/09 : demande d'Aziz apres constat que 11 fichiers separes pour un seul jalon
// n'avait pas de sens pour la cliente — un SEUL clip qui montre les 4 etats du jalon 2
// a la suite (Entrance -> Idle -> Fill25 -> Fill50), sur son vrai plateau, avec CARTONS
// nommant l'etat qui arrive entre chaque (comme le carton de separation de RecapClient,
// meme gabarit : fond semi-transparent, la video continue de tourner dessous).
//
// Difference cle avec RecapClient.tsx : ici le SON compte (c'est le jalon 2 qui integre
// thud + power-up). Le plateau muet de RecapClient (`plateau-reel.mp4`) ne convient pas —
// on utilise l'extrait AVEC SON deja valide pour le test audio (`reference-abigirl-
// 3m37-3m57.mp4`, sa voix + musique), et on laisse l'Entrance jouer ses propres SFX
// par-dessus (deja integres dans ChillMeterOverlay quand state="entrance").

import React from "react";
import {
  AbsoluteFill,
  Freeze,
  Loop,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { ChillMeterOverlay } from "./ChillMeterOverlay";

const FPS = 30;

// Durees des 4 etats (identiques aux compositions officielles Root.tsx).
const D_ENTRANCE = 120; // 4 s — ChillMeter-Entrance4s-Rustic
const D_IDLE = 90; // 3 s
const D_FILL25 = 75; // 2,5 s
const D_FILL50 = 105; // 3,5 s
// ⭐ 09/09 (retour Aziz) : 45 -> 120 frames (1,5s -> 4s) — les cartons disparaissaient
// avant d'avoir eu le temps d'etre lus. Aucun changement sur les animations elles-memes,
// seulement la duree d'affichage du carton entre chaque etat.
const CARTON = 120; // 4 s

const T_ENTRANCE = 0;
const T_CARTON1 = T_ENTRANCE + D_ENTRANCE;
const T_IDLE = T_CARTON1 + CARTON;
const T_CARTON2 = T_IDLE + D_IDLE;
const T_FILL25 = T_CARTON2 + CARTON;
const T_CARTON3 = T_FILL25 + D_FILL25;
const T_FILL50 = T_CARTON3 + CARTON;

export const RECAP_JALON2_FRAMES = T_FILL50 + D_FILL50;

// Duree source de l'extrait (3:37-3:57 de sa video), 20s a 30fps.
const PLATEAU_SRC_FRAMES = 600;

/** Le plateau reel, en boucle. `muted` coupe SA voix/musique — utilise pour la
 *  version silencieuse du clip (le pendant du clip avec son, meme montage). */
const PlateauContinu: React.FC<{ muted: boolean }> = ({ muted }) => (
  <Sequence from={0}>
    <Loop durationInFrames={PLATEAU_SRC_FRAMES}>
      <OffthreadVideo
        src={staticFile("_client-sim/chill-meter/test-son-reel/reference-abigirl-3m37-3m57.mp4")}
        muted={muted}
        style={{ position: "absolute", top: 0, left: 0, width: 1920, height: 1080 }}
      />
    </Loop>
  </Sequence>
);

/** Carton nommant l'etat qui arrive — meme gabarit que CartonJalon (RecapClient.tsx) :
 *  fond semi-transparent, la video continue de tourner dessous, fade in/out rapide. */
const CartonEtat: React.FC<{ titre: string; sousTexte: string }> = ({ titre, sousTexte }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 8, CARTON - 8, CARTON], [0, 1, 1, 0], {
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
          fontSize: 56,
          fontWeight: 700,
          color: "#ffffff",
          textAlign: "center",
        }}
      >
        {titre}
      </div>
      <div
        style={{
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: 30,
          fontWeight: 400,
          color: "#c9d4e4",
          marginTop: 14,
          textAlign: "center",
        }}
      >
        {sousTexte}
      </div>
    </AbsoluteFill>
  );
};

/** ⭐ 09/09 (2e precision d'Aziz) : `mutePlateau` coupe UNIQUEMENT sa voix/musique — nos
 *  2 SFX (thud/power-up de l'entrance) restent actifs dans LES DEUX clips. Le but du 2e
 *  clip n'est pas le silence total, c'est d'entendre NOS sons sans la distraction du son
 *  du plateau. Meme montage, memes cartons, dans les deux — seule la source audio du
 *  plateau change. */
export const RecapJalon2: React.FC<{ mutePlateau?: boolean }> = ({ mutePlateau = false }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <PlateauContinu muted={mutePlateau} />

      {/* ⭐ 09/09 (retour Aziz) : le bloc du CARTON rejouait `state="entrance"` dans une
          NOUVELLE Sequence — Remotion remet `useCurrentFrame()` a 0 a chaque Sequence,
          donc l'entrance repartait de son debut (thud + poussiere) PENDANT le carton
          "Idle", confus. Fix : `<Freeze frame={D_ENTRANCE-1}>` fige la DERNIERE frame de
          l'etat precedent (deja pose, allume, silencieux) au lieu de le relancer. Meme
          correctif sur les cartons 2/3 : `fill25` aurait aussi refait monter sa jauge. */}
      <Sequence from={T_ENTRANCE} durationInFrames={D_ENTRANCE}>
        <ChillMeterOverlay state="entrance" chassis="rustic" />
      </Sequence>
      <Sequence from={T_CARTON1} durationInFrames={CARTON}>
        <Freeze frame={D_ENTRANCE - 1}>
          <ChillMeterOverlay state="entrance" chassis="rustic" />
        </Freeze>
        <CartonEtat titre="Idle" sousTexte="Resting loop, no sound" />
      </Sequence>

      <Sequence from={T_IDLE} durationInFrames={D_IDLE}>
        <ChillMeterOverlay state="idle" chassis="rustic" />
      </Sequence>
      <Sequence from={T_CARTON2} durationInFrames={CARTON}>
        <Freeze frame={D_IDLE - 1}>
          <ChillMeterOverlay state="idle" chassis="rustic" />
        </Freeze>
        <CartonEtat titre="0-25% Fill" sousTexte="No sound sent for this state" />
      </Sequence>

      <Sequence from={T_FILL25} durationInFrames={D_FILL25}>
        <ChillMeterOverlay state="fill25" chassis="rustic" />
      </Sequence>
      <Sequence from={T_CARTON3} durationInFrames={CARTON}>
        <Freeze frame={D_FILL25 - 1}>
          <ChillMeterOverlay state="fill25" chassis="rustic" />
        </Freeze>
        <CartonEtat titre="25-50% Fill" sousTexte="Frost begins forming — no sound sent" />
      </Sequence>

      <Sequence from={T_FILL50} durationInFrames={D_FILL50}>
        <ChillMeterOverlay state="fill50" chassis="rustic" />
      </Sequence>
    </AbsoluteFill>
  );
};
