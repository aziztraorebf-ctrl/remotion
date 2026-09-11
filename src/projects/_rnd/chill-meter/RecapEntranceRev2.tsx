// MOTEUR: RACCORD — montage, piece de COMMUNICATION client.
//
// ⭐ 11/09 — 2e revision du jalon 2. Variante ENTRANCE SEULE de `RecapJalon2Rev1.tsx`.
// ⛔ Ne PAS modifier les 2 recaps precedents : ils restent la trace de ce qui a ete envoye.
//
// POURQUOI L'ENTRANCE SEULE, SANS LE 0-25 % (decision Aziz, 11/09) :
// Son retour du 11/09 porte 4 demandes — rebond, lueur bleue, pause avant allumage,
// poussiere laterale — et les QUATRE sont dans l'entrance. Le 0-25 % n'est mentionne
// nulle part : elle l'a deja vu et entendu dans l'envoi precedent sans le commenter.
// Le remontrer identique irait contre le principe deja applique ici — ne pas redonner a
// juger ce qui est accepte en silence — et lui ferait attendre 6 s de contenu valide
// avant d'arriver a ce qu'elle doit reellement regarder.
//
// Le CARTON D'OUVERTURE (et non plus de transition) nomme les changements en une ligne :
// elle sait quoi chercher avant que l'animation demarre. Le detail vit dans le message.

import React from "react";
import {
  AbsoluteFill,
  Loop,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { ChillMeterOverlay } from "./ChillMeterOverlay";

const D_CARTON = 75;   // 2,5 s — le temps de lire une ligne, pas plus
const D_ENTRANCE = 120; // 4 s — la sequence complete (poussiere eteinte a f60)

export const RECAP_ENTRANCE_REV2_FRAMES = D_CARTON + D_ENTRANCE;

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

/** Carton d'OUVERTURE : fond semi-transparent, la video tourne dessous. */
const CartonOuverture: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 8, D_CARTON - 10, D_CARTON], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "rgba(8,11,17,0.84)",
        opacity: op,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: 54,
          fontWeight: 700,
          color: "#ffffff",
          textAlign: "center",
        }}
      >
        Entrance — revised
      </div>
      <div
        style={{
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: 30,
          fontWeight: 400,
          color: "#c9d4e4",
          marginTop: 18,
          textAlign: "center",
          maxWidth: 1280,
          lineHeight: 1.4,
        }}
      >
        Bigger bounce · tighter screen glow · pause before power-on · side dust
      </div>
    </AbsoluteFill>
  );
};

export const RecapEntranceRev2: React.FC<{ mutePlateau?: boolean }> = ({
  mutePlateau = false,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <PlateauContinu muted={mutePlateau} />

      {/* ⛔ Le meter n'existe PAS pendant le carton : l'entrance doit demarrer vierge, sinon
          on verrait le chassis pose avant qu'il ne tombe. Rien a figer ici (contrairement aux
          cartons de TRANSITION des recaps precedents, qui devaient tenir l'etat precedent). */}
      <Sequence from={0} durationInFrames={D_CARTON}>
        <CartonOuverture />
      </Sequence>

      <Sequence from={D_CARTON} durationInFrames={D_ENTRANCE}>
        <ChillMeterOverlay state="entrance" chassis="rustic" />
      </Sequence>
    </AbsoluteFill>
  );
};
