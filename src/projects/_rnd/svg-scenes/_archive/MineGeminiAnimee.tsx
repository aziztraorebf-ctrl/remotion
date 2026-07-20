/**
 * MineGeminiAnimee — MINE D'OR DU DARFOUR (registre chaud "braise-or", 16:9), Gemini V2 (sans organique).
 *
 * R&D SVG-SCENES-GENERATIVES — banc d'essai "tenir 25-30s" + "regle des 5s" + SFX time des le depart.
 * Verdict statique : Gemini gagne (scene gravee chaude, profondeur, 100% manufacture/geometrie/naturel).
 * Intention : "suivre l'or" — de cette terre soudanaise sort la richesse qui paie la guerre.
 *
 * ⭐ DOCTRINE D'ANIMATION testee ici (2 couches) :
 *   - COUCHE DE FOND (demarre f0, ne s'arrete JAMAIS) : soleil pulse, derive Ken Burns chaude, ciel respire.
 *   - COUCHE D'EVENEMENTS (regle des 5s : un geste NOUVEAU toutes les ~5s, qui une fois lance CONTINUE) :
 *       f0    apparition (fade-in)
 *       f90   la MACHINE demarre (poulie tourne + convoyeur defile)         + SFX tension-pulse
 *       f210  un WAGONNET descend la rampe                                   + SFX arrow-whoosh
 *       f330  les FILONS D'OR scintillent                                    + SFX blip (tintement)
 *       f450  la POUSSIERE s'eleve de la fosse                               (pas de SFX — respiration)
 *       f570  la LUEUR DE GUERRE s'intensifie au loin                        + SFX boom-coup
 *       f690  le BUTIN D'OR s'illumine (pret a partir)                       + SFX plate-pop + impact
 *       f750+ apogee : tout vit, resserrement Ken Burns vers l'or
 *   - drone de fond chaud continu (tension-drone, reboucle) sous tout, volume 0.40.
 *
 * Technique (gotcha doctrine : innerHTML n'anime pas les <g> internes) : chaque groupe est injecte en
 * innerHTML dans un <g> WRAPPER cree en JSX -> le transform/opacite du wrapper EST animable.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence, Audio, staticFile } from "remotion";
import {
  G_BG_CIEL, G_BG_GUERRE, G_MID_COLLINES, G_FOSSE, G_OR_FILON, G_MACHINES,
  G_POULIE, G_CONVOYEUR, G_CONVOYEUR_BANDE, G_FG_BUTIN, G_POUSSIERE, G_VIGNETTE,
} from "./mineGeminiGroups";

const TERRE = "#1c1108";

// repere de la bande du convoyeur (de scene_svg) — pour la translation du minerai le long de l'axe
const BANDE = { x1: 1050, y1: 825, x2: 1800, y2: 425 };
const BANDE_LEN = Math.hypot(BANDE.x2 - BANDE.x1, BANDE.y2 - BANDE.y1);
const BANDE_UX = (BANDE.x2 - BANDE.x1) / BANDE_LEN; // direction vers le haut de la bande
const BANDE_UY = (BANDE.y2 - BANDE.y1) / BANDE_LEN;

// injecte le contenu d'un groupe dans un <g> wrapper anime
const Grp: React.FC<{
  body: string; transform?: string; opacity?: number; style?: React.CSSProperties;
}> = ({ body, transform, opacity, style }) => (
  <g transform={transform} opacity={opacity} style={style} dangerouslySetInnerHTML={{ __html: body }} />
);

export const MineGeminiAnimee: React.FC = () => {
  const f = useCurrentFrame();

  // ---------- COUCHE DE FOND (permanente, ne s'arrete jamais) ----------
  const reveal = interpolate(f, [0, 26], [0, 1], { extrapolateRight: "clamp" });

  // derive Ken Burns chaude : zoom lent continu + resserrement final vers l'or (fosse au centre-gauche)
  const driftScale = interpolate(f, [0, 840], [1.0, 1.08]);
  const driftX = Math.sin(f / 110) * 10 - interpolate(f, [690, 840], [0, 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const driftY = -interpolate(f, [690, 840], [0, 18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // soleil / ciel : pulse de chaleur lent
  const cielPulse = 0.9 + 0.1 * (Math.sin(f / 30) + 1) / 2;

  // ---------- COUCHE D'EVENEMENTS (echelonnee, regle des 5s) ----------

  // f90 : la MACHINE demarre — poulie tourne + bande defile (montent en regime sur ~25f)
  const machineOn = interpolate(f, [90, 115], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const poulieAngle = (f >= 90 ? (f - 90) : 0) * 2.6 * machineOn; // deg/frame -> rotation continue
  const bandeOffset = -(f >= 90 ? (f - 90) : 0) * 2.4 * machineOn; // defile vers le haut (dashoffset)

  // f210 : un WAGONNET descend la rampe (glisse le long d'un axe dans la fosse), puis revient en boucle
  const wagonOn = interpolate(f, [210, 230], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wagonCycle = f >= 210 ? (((f - 210) / 120) % 1) : 0; // boucle de 4s
  const wagonT = wagonCycle; // 0 (haut) -> 1 (bas de la rampe)
  // rampe approximative dans la fosse (de l'entree haute vers le fond) — repere visuel gauche de la fosse
  const wagonX = interpolate(wagonT, [0, 1], [430, 250]);
  const wagonY = interpolate(wagonT, [0, 1], [560, 760]);
  const wagonOp = wagonOn * (0.35 + 0.65 * Math.sin(Math.max(0.001, wagonCycle) * Math.PI)); // apparait/disparait en vague

  // f330 : les FILONS D'OR scintillent (deux pulses dephases, anti-clignotement uniforme)
  const orOn = interpolate(f, [330, 355], [0.55, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const orPulse = orOn * (0.8 + 0.2 * (Math.sin(f / 9) + Math.sin(f / 5.5)) / 2);

  // f450 : la POUSSIERE s'eleve de la fosse (monte + se dissipe en boucle)
  const poussOn = interpolate(f, [450, 480], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const poussCycle = f >= 450 ? (((f - 450) / 80) % 1) : 0;
  const poussY = -poussCycle * 70;
  const poussOp = poussOn * Math.sin(Math.max(0.001, poussCycle) * Math.PI) * 0.85;

  // f570 : la LUEUR DE GUERRE s'intensifie au loin (fumee monte plus haut + opacite monte)
  const guerreBase = -Math.abs(Math.sin(f / 42)) * 10 - (f / 840) * 8;
  const guerreBoost = interpolate(f, [570, 660], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const guerreY = guerreBase - guerreBoost * 26;
  const guerreSkew = Math.sin(f / 24) * 1.5;
  const guerreOp = 0.7 + 0.3 * guerreBoost; // la guerre "monte" narrativement

  // f690 : le BUTIN D'OR s'illumine (pret a partir) — flash chaud puis pulse soutenu
  const butinFlash = interpolate(f, [690, 706], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const butinGlow = 0.85 + 0.15 * (Math.sin(f / 16) + 1) / 2 + butinFlash * 0.25 * (f < 720 ? (720 - f) / 30 : 0);

  return (
    <AbsoluteFill style={{ background: TERRE }}>
      {/* ===== AUDIO : drone de fond + SFX timés frame-perfect ===== */}
      {/* drone chaud continu (reboucle : 8s x ~4 pour couvrir 28s), sous tout le reste */}
      <Sequence from={0} durationInFrames={840}>
        <Audio src={staticFile("_shared/sfx/warmap/tension-drone.mp3")} volume={0.40} loop />
      </Sequence>
      {/* f90 — machine démarre */}
      <Sequence from={90} durationInFrames={30}>
        <Audio src={staticFile("_shared/sfx/impact/tension-pulse.mp3")} volume={0.52} />
      </Sequence>
      {/* f210 — wagonnet descend */}
      <Sequence from={210} durationInFrames={24}>
        <Audio src={staticFile("_shared/sfx/warmap/arrow-whoosh.mp3")} volume={0.50} />
      </Sequence>
      {/* f330 — filons d'or scintillent (tintement discret) */}
      <Sequence from={330} durationInFrames={24}>
        <Audio src={staticFile("_shared/sfx/ui/blip-bubble.mp3")} volume={0.50} />
      </Sequence>
      {/* f570 — lueur de guerre s'intensifie (grondement sourd) */}
      <Sequence from={570} durationInFrames={40}>
        <Audio src={staticFile("_shared/sfx/warmap/boom-coup.mp3")} volume={0.55} />
      </Sequence>
      {/* f690 — butin d'or s'illumine (tintement + impact chaud) */}
      <Sequence from={690} durationInFrames={26}>
        <Audio src={staticFile("_shared/sfx/ui/plate-pop.mp3")} volume={0.54} />
      </Sequence>
      <Sequence from={692} durationInFrames={24}>
        <Audio src={staticFile("_shared/sfx/impact/impact.mp3")} volume={0.50} />
      </Sequence>

      {/* ===== IMAGE ===== */}
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <g
          transform={`translate(${driftX} ${driftY}) scale(${driftScale}) translate(${(1 - driftScale) * 960} ${(1 - driftScale) * 540})`}
          opacity={reveal}
        >
          {/* CIEL + SOLEIL — pulse de chaleur (fond permanent) */}
          <Grp body={G_BG_CIEL} opacity={cielPulse} />

          {/* FUMEE DE GUERRE (loin) — monte + ondule, s'intensifie a f570 */}
          <Grp body={G_BG_GUERRE} transform={`translate(0 ${guerreY}) skewX(${guerreSkew})`} opacity={guerreOp} />

          {/* COLLINES — decor stable */}
          <Grp body={G_MID_COLLINES} />

          {/* FOSSE — structure de la mine (stable) */}
          <Grp body={G_FOSSE} />

          {/* OR FILON — scintillement (geste cle, demarre f330) */}
          <Grp body={G_OR_FILON} opacity={orPulse} />

          {/* MACHINES (chevalement, structure) — stable */}
          <Grp body={G_MACHINES} />

          {/* CONVOYEUR (rails, structure) — stable */}
          <Grp body={G_CONVOYEUR} />

          {/* CONVOYEUR-BANDE — le minerai DEFILE vers le haut (demarre f90) */}
          <Grp body={G_CONVOYEUR_BANDE} transform={`translate(${BANDE_UX * bandeOffset} ${BANDE_UY * bandeOffset})`} />

          {/* POULIE — tourne autour de (550,250) (demarre f90) */}
          <Grp body={G_POULIE} transform={`rotate(${poulieAngle} 550 250)`} />

          {/* WAGONNET — descend la rampe (demarre f210) : un petit chariot stylise geometrique */}
          <g opacity={wagonOp} transform={`translate(${wagonX} ${wagonY})`}>
            <rect x={-22} y={-16} width={44} height={22} fill="#2a1a0d" stroke="#e8b44a" strokeWidth={3} />
            <rect x={-16} y={-26} width={32} height={12} fill="#f2cf72" stroke="#9c5f2c" strokeWidth={2} />
            <circle cx={-12} cy={8} r={6} fill="#1c1108" stroke="#e8b44a" strokeWidth={2.5} />
            <circle cx={12} cy={8} r={6} fill="#1c1108" stroke="#e8b44a" strokeWidth={2.5} />
          </g>

          {/* POUSSIERE — monte + se dissipe (demarre f450) */}
          <Grp body={G_POUSSIERE} transform={`translate(0 ${poussY})`} opacity={poussOp} />

          {/* BUTIN premier plan — pulse + flash a f690 */}
          <Grp body={G_FG_BUTIN} opacity={butinGlow} />

          {/* VIGNETTE chaude */}
          <Grp body={G_VIGNETTE} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default MineGeminiAnimee;
