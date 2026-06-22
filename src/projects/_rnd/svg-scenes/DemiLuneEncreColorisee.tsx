/**
 * DemiLuneEncreColorisee — PROTO ANIME : la bascule ENCRE N&B -> COULEUR PLEINE (notre signature "pilotage couleur").
 *
 * R&D Grande Muraille Verte (2026-06-22). v2 : la couleur ENVAHIT VRAIMENT (aplats vifs qui REMPLISSENT les formes,
 * pas un filtre subtil sur le trait). Le monde mort reste en encre ; la VIE jaillit en couleur pleine :
 *   - pousse + feuilles -> VERT vif plein, eau -> BLEU franc, racine -> OR. Sur le creme/encre du reste.
 * Technique (doctrine SVG) : chaque groupe encre est dans un wrapper JSX anime ; la COULEUR PLEINE = une COPIE du
 * groupe dont on a force fill+stroke a la couleur vive (recolorBody), opacite montee par frame sur le mot-cle.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import {
  G_CIEL, G_PLUIE, G_SOUS_SOL, G_TERRE_SECHE, G_DEMILUNE, G_PELLE, G_EAU, G_RACINE, G_POUSSE,
} from "./demiluneEncreGroups";

const PARCHEMIN = "#e8dcc0";

// force TOUTE couleur (fill + stroke) d'un body SVG vers une couleur vive -> aplat colore plein de la forme.
// "none" preserve (on ne colore pas les fill="none"). Sinon -> couleur cible.
function recolorBody(body: string, fill: string, stroke: string): string {
  let s = body;
  s = s.replace(/fill="(?!none")[^"]*"/g, `fill="${fill}"`);
  s = s.replace(/stroke="(?!none")[^"]*"/g, `stroke="${stroke}"`);
  return s;
}

const G: React.FC<{ body: string; opacity?: number; transform?: string }> = ({ body, opacity = 1, transform }) => (
  <g opacity={opacity} transform={transform} dangerouslySetInnerHTML={{ __html: body }} />
);

export const DemiLuneEncreColorisee: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // viewBox : horizontal plein, ou fenetre VERTICALE 9:16 centree sur l'axe demi-lune/pousse/racine
  const viewBox = vertical ? "560 0 607.5 1080" : "0 0 1920 1080";

  const opTerre = interpolate(frame, [4, 24], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const opDemilune = interpolate(frame, [26, 46], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const opPelle = interpolate(frame, [44, 56], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const opPluie = interpolate(frame, [50, 64, 110, 130], [0, 1, 1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const pluieShift = interpolate(frame, [50, 130], [0, 40], { extrapolateRight: "clamp" });
  const opEau = interpolate(frame, [70, 100], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const opRacine = interpolate(frame, [100, 130], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const pousseIn = spring({ frame: frame - 128, fps, config: { mass: 1, damping: 13, stiffness: 70 } });
  const pousseScale = interpolate(pousseIn, [0, 1], [0.08, 1]);

  // ---- LA BASCULE COULEUR PLEINE : la couleur REMPLIT les formes vivantes a partir de f118 ----
  const eauColor = interpolate(frame, [88, 118], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const racColor = interpolate(frame, [118, 150], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const vieColor = interpolate(frame, [140, 185], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const cielWarmth = interpolate(frame, [130, 195], [0, 0.45], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // couleurs vives de la VIE
  const VERT = "#3fae4a", VERT_D = "#2f7d34", BLEU = "#3a8fd0", OR = "#d8a43a";

  return (
    <AbsoluteFill style={{ background: PARCHEMIN }}>
      <svg viewBox={viewBox} width="100%" height="100%">
        {/* ciel encre permanent + rechauffement chaud (la vie revient) */}
        <G body={G_CIEL} />
        <rect x={0} y={0} width={1920} height={1080} fill="#f2cf72" opacity={cielWarmth * 0.22} />

        {/* monde encre : terre seche + sous-sol (restent en encre = le monde "mort") */}
        <G body={G_SOUS_SOL} opacity={opTerre} />
        <G body={G_TERRE_SECHE} opacity={opTerre} />

        {/* cuvette demi-lune + pelle */}
        <G body={G_DEMILUNE} opacity={opDemilune} />
        <G body={G_PELLE} opacity={opPelle} />

        {/* pluie */}
        <G body={G_PLUIE} opacity={opPluie} transform={`translate(${-pluieShift * 0.4} ${pluieShift})`} />

        {/* EAU : trait encre + REMPLISSAGE BLEU plein qui monte */}
        <G body={G_EAU} opacity={opEau} />
        <G body={recolorBody(G_EAU, BLEU, BLEU)} opacity={opEau * eauColor * 0.85} />

        {/* RACINE : trait encre + remplissage OR (elle se reveille) */}
        <G body={G_RACINE} opacity={opRacine} />
        <G body={recolorBody(G_RACINE, "none", OR)} opacity={opRacine * racColor} />

        {/* POUSSE : grandit (spring) + REMPLISSAGE VERT VIF plein des feuilles/tige */}
        <g transform={`translate(0 640) scale(1 ${pousseScale}) translate(0 -640)`}>
          <G body={G_POUSSE} opacity={pousseIn} />
          <G body={recolorBody(G_POUSSE, VERT, VERT_D)} opacity={pousseIn * vieColor} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default DemiLuneEncreColorisee;
