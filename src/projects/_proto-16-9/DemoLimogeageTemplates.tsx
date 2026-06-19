/**
 * DEMO — comparaison de 2 templates EXISTANTS pour la suite du hook Senegal (le limogeage du 22 mai).
 * But : qu'Aziz choisisse sur pieces AVANT qu'on construise la vraie scene.
 *
 * Contenu = UNIQUEMENT ce que dit la narration validee (pas de noms propres non verifiables) :
 *   "Un mois plus tard, le 22 mai, le gouvernement saute. Le president limoge son Premier ministre.
 *    Comment un pays qui s'enrichit bascule au meme moment dans la tourmente politique ?"
 *
 * 2 phases :
 *   A (f0-150)   : NewsClippingV2 (coupure de presse) — l'evenement tombe comme un fait de presse.
 *   B (f150-300) : FaceAFace (bascule) — deux MOMENTS (avril richesse / mai tourmente) cote a cote.
 */
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { NewsClippingV2 } from "../_shared/components/inserts/NewsClippingV2";
import { FaceAFace } from "../_shared/components/layouts/FaceAFace";

export const DemoLimogeageTemplates: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* PHASE A — Coupure de presse */}
      <Sequence from={0} durationInFrames={150}>
        <NewsClippingV2
          variant="grain"
          accentColor="#b23a2e"
          publication="Dakar"
          date="22 mai 2026"
          headline="Le gouvernement sénégalais limogé"
          lead="Un mois après le premier baril, le président dissout son gouvernement et limoge son Premier ministre."
          pullQuote="Le pays s'enrichit, et bascule au même moment."
        />
      </Sequence>

      {/* PHASE B — Bascule (deux moments) */}
      <Sequence from={150} durationInFrames={150}>
        <FaceAFace
          bgColor="#16213a"
          entityA={{
            name: "AVRIL 2026",
            stats: [
              { value: "8 M$", label: "PAR JOUR" },
              { value: "1er", label: "BARIL DE PÉTROLE" },
              { value: "+", label: "LE PAYS S'ENRICHIT" },
            ],
          }}
          entityB={{
            name: "22 MAI 2026",
            stats: [
              { value: "0", label: "GOUVERNEMENT" },
              { value: "PM", label: "LIMOGÉ" },
              { value: "?", label: "LA TOURMENTE" },
            ],
          }}
          verdict={{ symbol: "→", label: "UN MOIS PLUS TARD" }}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export default DemoLimogeageTemplates;
