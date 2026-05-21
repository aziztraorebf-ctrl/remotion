/**
 * Demos KraftCardDocClassifie — preset Direction C parametrique.
 * 2 demos pour illustrer la modularite du subject :
 *   A — Portrait leader (cas classique)
 *   B — Drapeau pays (variante asset)
 */

import React from "react";
import { Img, staticFile } from "remotion";
import { KraftCardDocClassifie } from "../components/inserts/KraftCardDocClassifie";

export const KRAFT_CARD_DOC_DEMO_FRAMES = 150;

// Drapeau Niger comme fond plein ecran (3 bandes CSS, pour subject=drapeau)
const FlagNigerSquare: React.FC = () => (
  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
    <div style={{ flex: 1, backgroundColor: "#E05206" }} />
    <div style={{ flex: 1, backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "22%", aspectRatio: "1", borderRadius: "50%", backgroundColor: "#E05206" }} />
    </div>
    <div style={{ flex: 1, backgroundColor: "#009A44" }} />
  </div>
);

// Demo A — sujet = portrait leader
export const KraftCardDocDemoPortrait: React.FC = () => (
  <KraftCardDocClassifie
    subject={
      <Img
        src={staticFile("_shared/flags-portraits/leaders/leader-portrait-editorial.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "grayscale(0.7) contrast(1.05) sepia(0.15)",
        }}
      />
    }
    caption="M. ISSOUFOU — Niamey, 2018"
    tampon="VÉRIFIÉ"
    tamponSubtext="SOURCE PRIMAIRE"
    note="Discours ONU 2018, repris sans coupure dans Le Monde Afrique (oct. 2018) et RFI (sept. 2018). Cohérent avec la position publique du président depuis 2014."
  />
);

// Demo B — sujet = drapeau Niger plein cadre
export const KraftCardDocDemoFlag: React.FC = () => (
  <KraftCardDocClassifie
    subject={<FlagNigerSquare />}
    caption="RÉPUBLIQUE DU NIGER — drapeau adopté 1959"
    tampon="OFFICIEL"
    tamponSubtext="ARCHIVES D'ÉTAT"
    note="Drapeau actuel inchangé depuis l'indépendance. Bandes orange/blanc/vert avec disque solaire central — référence à la liberté et au Sahel."
  />
);
