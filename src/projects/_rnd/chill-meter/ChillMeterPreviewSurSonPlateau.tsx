// MOTEUR: RACCORD — montage technique, pas une scene. On superpose 2 calques existants
// (sa vraie capture de plateau + ChillMeterOverlay, tel quel) pour VERIFIER en video un
// livrable deja concu ailleurs. Aucune intention narrative propre a ce fichier.
//
// PREVIEW SEULEMENT — jamais livre a la cliente. ChillMeterOverlay (le vrai livrable,
// fond transparent) reste INCHANGE ; ce wrapper existe uniquement parce que le rendu
// VIDEO avec alpha reel (webm/prores4444) ne conservait pas la transparence dans ce
// pipeline malgre les bons flags (--pixel-format, --prores-profile) le 06/09 — un agent
// dedie enquete la cause racine en parallele. Contournement : composer DANS Remotion
// (fond opaque, aucun alpha a transporter hors du renderer) plutot qu'apres-coup.
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { ChillMeterOverlay, type MeterState, type Chassis } from "./ChillMeterOverlay";

export const ChillMeterPreviewSurSonPlateau: React.FC<{ state: MeterState; chassis?: Chassis }> = ({
  state,
  chassis = "rustic",
}) => {
  return (
    <AbsoluteFill>
      <img
        src={staticFile("_client-sim/chill-meter/reference-06-09/plateau.png")}
        style={{ position: "absolute", top: 0, left: 0, width: 1920, height: 1080 }}
      />
      <ChillMeterOverlay state={state} chassis={chassis} />
    </AbsoluteFill>
  );
};
