/**
 * MurTopDownBraise — PROTO : vue TOP-DOWN du "mur d'arbres" qui se peuple d'ouest en est puis MEURT.
 *
 * R&D Grande Muraille Verte (2026-06-22) — B1 HOOK + B5 PREUVE. Vue de dessus (satellite stylisee) :
 *   - desert nu (top-down) ;
 *   - les arbres apparaissent UN PAR UN de gauche (Senegal) a droite (Djibouti) + se colorent VERT (le mur se construit) ;
 *   - PUIS presque tous MEURENT (grisent + retrecissent), il n'en reste qu'une poignee (l'echec).
 * Prouve la faisabilite de la vue top-down animee AVANT de batir le storyboard dessus (idee Aziz).
 * 37 arbres numerotes ouest->est (groupes id="arbre-NN"), animes par frame. Registre braise-or.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { TD_FOND, TD_ARBRES } from "./topdownBraiseGroups";

const TERRE = "#1c1108";
const N = TD_ARBRES.length;

// survivants de l'echec : une poignee bien repartie reste vivante (le reste meurt)
const SURVIVORS = new Set([3, 11, 19, 27, 34].filter((i) => i < N));

function recolorBody(body: string, fill: string, stroke: string): string {
  return body.replace(/fill="(?!none")[^"]*"/g, `fill="${fill}"`).replace(/stroke="(?!none")[^"]*"/g, `stroke="${stroke}"`);
}

const G: React.FC<{ body: string; opacity?: number; transform?: string }> = ({ body, opacity = 1, transform }) => (
  <g opacity={opacity} transform={transform} dangerouslySetInnerHTML={{ __html: body }} />
);

const VERT = "#5fc24a", VERT_D = "#3e8f34", MORT = "#6b5a3f";

const Arbre: React.FC<{ item: { transform: string; body: string }; idx: number; frame: number; fps: number }> = ({ item, idx, frame, fps }) => {
  const { transform, body } = item;
  // apparition ouest->est : l'arbre idx pousse a f = 36 + idx * 2.4 (vague qui balaie)
  const birth = 36 + idx * 2.4;
  const pop = spring({ frame: frame - birth, fps, config: { mass: 1, damping: 12, stiffness: 120 } });
  // coloration verte qui suit l'apparition
  const green = interpolate(frame, [birth + 2, birth + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // LA MORT : a partir de f165, presque tous grisent + retrecissent (sauf survivants)
  const death = SURVIVORS.has(idx)
    ? 0
    : interpolate(frame, [165, 165 + (idx % 7) * 4 + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const animScale = pop * interpolate(death, [0, 1], [1, 0.35]);
  const greyFade = interpolate(death, [0, 1], [1, 0]); // le vert disparait en mourant
  // transform EXTERNE = positionnement du LLM (translate x,y le long de la bande). INTERNE = scale d'anim (centre arbre).
  return (
    <g transform={transform}>
      <g transform={`scale(${animScale})`} opacity={pop}>
        <G body={body} />
        <G body={recolorBody(body, VERT, VERT_D)} opacity={green * greyFade} />
        <G body={recolorBody(body, MORT, MORT)} opacity={death * 0.85} />
      </g>
    </g>
  );
};

export const MurTopDownBraise: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Le mur est HORIZONTAL (ouest->est). En vertical 9:16, on PANORAMIQUE : la fenetre verticale (largeur 607.5)
  // glisse de gauche (Senegal) a droite (Djibouti) en suivant la vague d'apparition. Sinon horizontal plein.
  const panX = vertical
    ? interpolate(frame, [36, 150], [0, 1920 - 607.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const vb = vertical ? `${panX} 0 607.5 1080` : "0 0 1920 1080";

  return (
    <AbsoluteFill style={{ background: TERRE }}>
      <svg viewBox={vb} width="100%" height="100%">
        <G body={TD_FOND} />
        {TD_ARBRES.map((it, i) => (
          <Arbre key={i} item={it} idx={i} frame={frame} fps={fps} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export default MurTopDownBraise;
