// Partie 1 — ORIGINE 2012 (canari). Direction SOUSTRACTION (validee DA 3 voix + Aziz).
//
// Couche PURE dessinee par-dessus la carte du moteur. Recoit le contexte
// SahelRenderContext (frame, project lon/lat->px, etat). Ne possede PAS la map.
//
// Beats (recales sur narration-v5-alignment.json) :
//   1.0 board clearing (jetons Acte 1 -> fantomes) + reperes "LIBYE" + "2012"
//   1.1 pulse Libye (effondrement)
//   1.2 trait d'encre Libye->Mali + taches d'impact Kidal/Gao/Tombouctou
//   1.3 vide d'Etat (chute opacite fill rural) + hachures tensions
//
// REGLE P1 : PAS d'overlay, PAS d'objets (origine 2012 = abstraite, 100% cartographiable).
// Encre/taches en mixBlendMode multiply, palette parchemin. PAS de particules TikTok.

import React from "react";
import { AbsoluteFill } from "remotion";
import type { SahelRenderContext } from "../engine/SahelContext";

type Props = {
  ctx: SahelRenderContext | null;
};

export const Partie1Origine: React.FC<Props> = ({ ctx }) => {
  // Coquille vide (Task 2). Les beats 1.0->1.3 arrivent en Tasks 3-6.
  if (!ctx) return null;
  return <AbsoluteFill style={{ pointerEvents: "none" }} />;
};
