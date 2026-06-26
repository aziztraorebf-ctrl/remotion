/**
 * FoyerColorTest — TEST de COLORISATION sur une scene encre pure (le foyer Gemini).
 * But : valider qu'on peut (1) faire SE-DESSINER une scene encre, (2) coloriser semantiquement
 * certains elements sur la timeline (le FEU s'embrase en or/orange) en gardant le reste en encre.
 * Methode = notre signature : monde en trait d'encre neutre, la VIE/CHALEUR arrive par la couleur timee.
 *
 * Sequence (vertical 9:16) :
 *   0-50   : la scene encre SE DESSINE (draw-on global via opacity-reveal par bandes, simple ici).
 *   50-110 : le FEU s'embrase (flammes colorees or->orange qui montent, halo chaud).
 *   110+   : la chaleur se propage (lueur sur la marmite, la fumee se teinte).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { FOYER_INNER } from "./foyerSvg";

const CREME = "#e8dcc0";
const OR = "#f2b53a", ORANGE = "#e8732a", ROUGE = "#c4391b", OR_GLOW = "#ffd86b";

export const FoyerColorTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1) la scene encre apparait (reveal doux global)
  const sceneIn = interpolate(frame, [0, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 2) le feu s'embrase (le coeur chaud arrive sur le trait d'encre)
  const fireWarm = interpolate(frame, [50, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const firePulse = 1 + 0.05 * Math.sin(frame / 6); // le feu vacille (ok ici, c'est du feu)

  // 3) la chaleur se propage (marmite + fumee teintees)
  const heatSpread = interpolate(frame, [110, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // NB : position du foyer dans le SVG Gemini (groupe hearth_and_fire) — approx au centre-bas.
  // On superpose des flammes colorees a cet endroit (le SVG d'origine reste en trait dessous).
  const fx = 560, fy = 1690; // centre du feu (cale sur les 3 pierres du groupe hearth_and_fire)

  // flammes : 5 langues qui montent, hauteur pilotee par fireWarm*firePulse
  const flames = [0, 1, 2, 3, 4].map((i) => {
    const birth = 50 + i * 4;
    const h = spring({ frame: frame - birth, fps, config: { damping: 12, stiffness: 90 } });
    const dx = (i - 2) * 22;
    const height = (90 + i % 2 * 30) * h * fireWarm * firePulse;
    const col = i % 2 === 0 ? ORANGE : OR;
    return { dx, height, col, w: 16 - Math.abs(i - 2) * 2 };
  });

  return (
    <AbsoluteFill style={{ background: CREME }}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        {/* la scene encre d'origine (trait pur), injectee */}
        <g opacity={sceneIn} dangerouslySetInnerHTML={{ __html: FOYER_INNER }} />

        {/* COLORISATION TIMEE par-dessus le trait : le feu s'embrase */}
        <g id="fire-color" opacity={fireWarm}>
          {/* halo chaud */}
          <circle cx={fx} cy={fy - 30} r={120 * firePulse} fill={OR_GLOW}
            opacity={fireWarm * 0.4} style={{ filter: "blur(34px)" }} />
          {/* langues de flamme (path en goutte inversee) */}
          {flames.map((fl, i) => (
            <path key={i}
              d={`M ${fx + fl.dx} ${fy}
                  C ${fx + fl.dx - fl.w} ${fy - fl.height * 0.5}, ${fx + fl.dx - fl.w * 0.4} ${fy - fl.height * 0.8}, ${fx + fl.dx} ${fy - fl.height}
                  C ${fx + fl.dx + fl.w * 0.4} ${fy - fl.height * 0.8}, ${fx + fl.dx + fl.w} ${fy - fl.height * 0.5}, ${fx + fl.dx} ${fy} Z`}
              fill={fl.col} opacity={0.85} />
          ))}
          {/* coeur rouge */}
          <path d={`M ${fx} ${fy} C ${fx - 8} ${fy - 28}, ${fx - 4} ${fy - 40}, ${fx} ${fy - 52} C ${fx + 4} ${fy - 40}, ${fx + 8} ${fy - 28}, ${fx} ${fy} Z`}
            fill={ROUGE} opacity={fireWarm} />
        </g>

        {/* la chaleur teinte la marmite (lueur orange dessous) + un voile chaud monte */}
        <g id="heat-spread" opacity={heatSpread}>
          <ellipse cx={fx} cy={fy - 70} rx={70} ry={30} fill={ORANGE} opacity={0.18 * heatSpread}
            style={{ filter: "blur(18px)" }} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default FoyerColorTest;
