/**
 * DemiLuneBraiseAnimee — variante BRAISE-OR animee (comparatif d'identite vs encre colorisee).
 *
 * R&D Grande Muraille Verte (2026-06-22). Meme bascule narrative (sec/ardent -> eau -> racine reveillee -> vie),
 * mais registre braise-or : le monde de depart est CHAUD et SOMBRE (terre ardente), et la VIE verte/bleue jaillit
 * en contraste sur l'ocre. Le SVG braise est deja colore (ocre/or) ; on superpose la couleur de la VIE.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import {
  B_CIEL, B_PLUIE, B_SOUS_SOL, B_TERRE_SECHE, B_DEMILUNE, B_EAU, B_RACINE, B_POUSSE, B_FEUILLES, B_VIGNETTE,
} from "./demiluneBraiseGroups";

const TERRE = "#1c1108";

function recolorBody(body: string, fill: string, stroke: string): string {
  let s = body;
  s = s.replace(/fill="(?!none")[^"]*"/g, `fill="${fill}"`);
  s = s.replace(/stroke="(?!none")[^"]*"/g, `stroke="${stroke}"`);
  return s;
}

const G: React.FC<{ body: string; opacity?: number; transform?: string }> = ({ body, opacity = 1, transform }) => (
  <g opacity={opacity} transform={transform} dangerouslySetInnerHTML={{ __html: body }} />
);

export const DemiLuneBraiseAnimee: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const viewBox = vertical ? "560 0 607.5 1080" : "0 0 1920 1080";

  const opTerre = interpolate(frame, [4, 24], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const opDemilune = interpolate(frame, [26, 46], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const opPluie = interpolate(frame, [50, 64, 110, 130], [0, 1, 1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const pluieShift = interpolate(frame, [50, 130], [0, 40], { extrapolateRight: "clamp" });
  const opEau = interpolate(frame, [70, 100], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const opRacine = interpolate(frame, [100, 130], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const pousseIn = spring({ frame: frame - 128, fps, config: { mass: 1, damping: 13, stiffness: 70 } });
  const pousseScale = interpolate(pousseIn, [0, 1], [0.08, 1]);
  const feuillesIn = spring({ frame: frame - 150, fps, config: { mass: 1, damping: 14, stiffness: 80 } });

  const eauColor = interpolate(frame, [88, 118], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const vieColor = interpolate(frame, [140, 185], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const VERT = "#5fc24a", VERT_D = "#3e8f34", BLEU = "#4aa6e0";

  return (
    <AbsoluteFill style={{ background: TERRE }}>
      <svg viewBox={viewBox} width="100%" height="100%">
        <G body={B_CIEL} />
        <G body={B_SOUS_SOL} opacity={opTerre} />
        <G body={B_TERRE_SECHE} opacity={opTerre} />
        <G body={B_DEMILUNE} opacity={opDemilune} />
        <G body={B_PLUIE} opacity={opPluie} transform={`translate(${-pluieShift * 0.4} ${pluieShift})`} />

        {/* eau : braise d'origine + bleu vif qui remplit */}
        <G body={B_EAU} opacity={opEau} />
        <G body={recolorBody(B_EAU, BLEU, BLEU)} opacity={opEau * eauColor * 0.8} />

        {/* racine : reveil (l'or braise est deja la, on renforce a peine) */}
        <G body={B_RACINE} opacity={opRacine} />

        {/* pousse + feuilles : grandit + VERT VIF qui remplit (la vie contre l'ocre) */}
        <g transform={`translate(0 640) scale(1 ${pousseScale}) translate(0 -640)`}>
          <G body={B_POUSSE} opacity={pousseIn} />
          <G body={recolorBody(B_POUSSE, VERT, VERT_D)} opacity={pousseIn * vieColor} />
          <G body={B_FEUILLES} opacity={feuillesIn} />
          <G body={recolorBody(B_FEUILLES, VERT, VERT_D)} opacity={feuillesIn * vieColor} />
        </g>

        <G body={B_VIGNETTE} />
      </svg>
    </AbsoluteFill>
  );
};

export default DemiLuneBraiseAnimee;
