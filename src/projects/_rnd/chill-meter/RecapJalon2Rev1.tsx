// MOTEUR: RACCORD — montage, pas une scene. Piece de COMMUNICATION client.
//
// ⭐ 10/09 — REVISION 1 du jalon 2. Variante a 2 ETATS de `RecapJalon2.tsx` (qui en montre 4).
// ⛔ Ne PAS modifier RecapJalon2.tsx : il reste la trace exacte de ce qui a ete envoye le
// 09/09 et sur quoi porte le retour d'Abigail. Ce fichier-ci est le NOUVEL envoi.
//
// POURQUOI 2 ETATS ET PAS 4 (decision Aziz, 10/09) :
//  - Son retour du 10/09 ne conteste QUE l'entrance. Elle ecrit vouloir limiter les
//    allers-retours (« as close to the included revision rounds as we can ») : lui redonner
//    a juger l'idle et le 25-50 %, qu'elle a acceptes en SILENCE, rouvrirait des discussions
//    closes. On ne remontre que ce qui a change.
//  - MAIS elle a joint un 3e fichier son, « a new 0-25% charge sound », et sa demande n°4 est
//    « the updated sound timing using the new FILES I send » (pluriel, les 3). N'envoyer que
//    l'entrance, c'est ne pas lui faire entendre ce son -> un aller-retour de plus, exactement
//    ce qu'on cherche a eviter. D'ou : entrance + fill25.
//  - L'ANIMATION du fill25 est INCHANGEE (elle n'en a rien dit) : seul son son est nouveau.
//
// Format repris a l'identique du 09/09 — elle l'a explicitement apprecie dans son message
// (« I can tell you are taking time to create these previews with captions and explanations
// so I can understand the direction »). Meme gabarit de cartons, meme principe des 2 versions
// (avec / sans le son de son plateau).

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

// Durees reprises des compositions officielles (Root.tsx) — inchangees.
const D_ENTRANCE = 120; // 4 s
const D_FILL25 = 75; // 2,5 s
// 4 s : valeur corrigee le 09/09 apres retour d'Aziz (a 1,5 s les cartons n'etaient pas lus).
const CARTON = 120;

const T_ENTRANCE = 0;
const T_CARTON1 = T_ENTRANCE + D_ENTRANCE;
const T_FILL25 = T_CARTON1 + CARTON;

export const RECAP_REV1_FRAMES = T_FILL25 + D_FILL25;

/** Duree source de l'extrait de son plateau (3:37-3:57 de sa video), 20 s a 30 fps. */
const PLATEAU_SRC_FRAMES = 600;

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

/** Carton nommant l'etat qui arrive. Fond semi-transparent : la video continue de tourner
 *  dessous, ce qui evite la coupure seche d'un carton plein cadre. */
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
          maxWidth: 1200,
          lineHeight: 1.35,
        }}
      >
        {sousTexte}
      </div>
    </AbsoluteFill>
  );
};

/** `mutePlateau` coupe UNIQUEMENT sa voix/musique — nos SFX restent actifs dans LES DEUX
 *  clips. Le 2e clip n'est pas un clip muet : c'est le meme montage, ou l'on entend nos
 *  sons sans la concurrence de l'ambiance du plateau. */
export const RecapJalon2Rev1: React.FC<{ mutePlateau?: boolean }> = ({ mutePlateau = false }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <PlateauContinu muted={mutePlateau} />

      {/* ⛔⛔ Rejouer le MEME state dans une 2e Sequence le relancerait depuis sa frame 0
          (Remotion remet `useCurrentFrame()` a 0 par Sequence) — l'entrance rejouerait donc
          thud + poussiere PENDANT le carton. `<Freeze>` fige sa derniere frame (posee,
          allumee, silencieuse). Bug vecu et corrige le 09/09, verifie par volumedetect. */}
      <Sequence from={T_ENTRANCE} durationInFrames={D_ENTRANCE}>
        <ChillMeterOverlay state="entrance" chassis="rustic" />
      </Sequence>
      <Sequence from={T_CARTON1} durationInFrames={CARTON}>
        <Freeze frame={D_ENTRANCE - 1}>
          <ChillMeterOverlay state="entrance" chassis="rustic" />
        </Freeze>
        <CartonEtat
          titre="0-25% Fill"
          sousTexte="Animation unchanged — now with the new charge sound you sent"
        />
      </Sequence>

      <Sequence from={T_FILL25} durationInFrames={D_FILL25}>
        <ChillMeterOverlay state="fill25" chassis="rustic" />
      </Sequence>
    </AbsoluteFill>
  );
};
