/**
 * HistoirePlanteur — mini-RECIT 9:16 dans le verger cacao (R&D 2026-06-30, v2 choregraphie complete).
 * Brique perso : _shared/personnage-vivant-svg (StickRig + computePose). Decor : CacaoTree (VergerCacao).
 *
 * RECIT (choregraphie demandee par Aziz — "depose, ramasse, marche" en VITESSE CONSTANTE) :
 *  - un PANIER est deja au sol des le depart (avec 2 feves dedans), pres du cacaoyer.
 *  1. ARRIVE   : entre par la gauche en marchant (cadence fluide).
 *  2. RAMASSE  : s'arrete, se penche, ramasse une feve au sol (machine HOLD).
 *  3. DEPOSE   : tend le bras vers le panier a cote, y depose la feve -> on VOIT la feve s'ajouter dans le panier.
 *  4. SOULEVE  : ramasse le panier (l'anse vient dans la main).
 *  5. REPART   : ressort a droite, panier en main.
 *
 * ⛔ VITESSE DE MARCHE CONSTANTE du debut a la fin : translation = vitesse LINEAIRE fixe (px/frame),
 *    AUCUN easing sur les phases de marche (sinon ca "accelere" — bug du v1 signale par Aziz).
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { CacaoTree } from "../components/VergerCacao";
import { StickRig } from "../../../_shared/personnage-vivant-svg/rig/StickRig";
import { computePose } from "../../../_shared/personnage-vivant-svg/rig/poses";

export const HISTOIRE_PLANTEUR_FRAMES = 470;
const PARCH = "#e8dcc0";
const INK = "#2b2117";
const POD = "#a26432";
const SACK = "#7a5230";
const EASE = Easing.bezier(0.4, 0, 0.2, 1); // SEULEMENT pour bend/armReach (gestes), JAMAIS la marche

const W = 1080, H = 1920;
const GROUND_Y = 1360;
const MAN_S = 0.6;
const STOP_X = 470;                 // ou il s'arrete pour ramasser
const TREE_X = 300;                 // cacaoyer heros A GAUCHE (il recolte sous l'arbre) -> sortie droite degagee
const BASKET_X = STOP_X + 120;      // panier au sol, juste a cote (a sa droite)
const BASKET_Y = GROUND_Y - 4;
const WALK_SPEED = 5.2;             // px/frame — VITESSE CONSTANTE (cale sur la cadence du pas)

// timeline (frames @30)
// Choregraphie logique (Aziz) : ramasse a STOP_X -> se redresse en TENANT la feve -> MARCHE jusqu'au panier
// -> se RE-PENCHE au-dessus du panier -> depose -> ramasse le panier -> repart. Feve collee a la main partout.
const F_ARRIVE = 120;    // arrive a STOP_X (marche fluide)
const F_BEND = 162;      // penche pour ramasser
const F_REACH = 192;     // main au sol
const F_GRAB = 206;      // saisit la feve (HOLD) — feve en main
const F_RISE = 236;      // se redresse a demi, feve en main
const F_WALK2 = 250;     // commence a marcher vers le panier
const F_ATBASKET = 286;  // arrive au panier (vitesse constante)
const F_BEND2 = 316;     // se re-penche au-dessus du panier
const F_DROP = 332;      // depose la feve (elle entre dans le panier -> 3 feves)
const F_LIFT = 360;      // ramasse le panier (anse en main)
const F_LEAVE = 380;     // repart
const F_END = 470;

const lerpHex = (a: string, c: string, t: number) => {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const cc = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `#${cc.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

// petit panier dessine (au sol ou en main) avec N feves visibles dedans
const Basket: React.FC<{ beans: number }> = ({ beans }) => (
  <g>
    <path d="M -34 0 L 34 0 L 26 44 L -26 44 Z" fill={SACK} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -34 0 q 34 -28 68 0" fill="none" stroke={INK} strokeWidth={4} />
    {Array.from({ length: beans }, (_, i) => {
      const cols = [-12, 6, -2, 14];
      const rows = [10, 12, 24, 26];
      return <ellipse key={i} cx={cols[i % 4]} cy={rows[i % 4]} rx={7} ry={10} fill={POD} stroke={INK} strokeWidth={2} />;
    })}
  </g>
);

export const HistoirePlanteur: React.FC = () => {
  const frame = useCurrentFrame();
  const wf = frame;

  // ---- DEPLACEMENT : VITESSE CONSTANTE, multi-segments (pas d'easing sur la marche). ----
  // Il s'arrete AVANT le panier (DEPOT_X) pour que sa MAIN TENDUE arrive AU-DESSUS du panier (pas son corps).
  // offset main au depot (penche+armReach) -> distance bras devant lui, a soustraire de BASKET_X.
  const depotPose = computePose({ walkPhase: 0, moving: false, bend: 1, armReach: 1 });
  const DEPOT_X = BASKET_X - depotPose.frontHandX * MAN_S; // le corps s'arrete ici ; la main vise BASKET_X
  let x: number;
  if (frame < F_ARRIVE) x = STOP_X - (F_ARRIVE - frame) * WALK_SPEED;
  else if (frame < F_WALK2) x = STOP_X;
  else if (frame < F_ATBASKET) x = STOP_X + (frame - F_WALK2) / (F_ATBASKET - F_WALK2) * (DEPOT_X - STOP_X);
  else if (frame < F_LEAVE) x = DEPOT_X;
  else x = DEPOT_X + (frame - F_LEAVE) * WALK_SPEED;
  const moving = frame < F_ARRIVE || (frame >= F_WALK2 && frame < F_ATBASKET) || frame >= F_LEAVE;
  const walkPhase = frame;

  // ---- GESTES. Deux penches : ramasser (F_BEND) PUIS deposer au panier (F_BEND2). ----
  // bend : penche1 (ramasse) -> se redresse a demi en marchant (F_RISE..F_WALK2) -> penche2 (depot) -> releve apres lift.
  const bend = interpolate(
    frame,
    [F_ARRIVE, F_BEND, F_RISE, F_ATBASKET, F_BEND2, F_LIFT, F_LIFT + 26],
    [0, 1, 0.35, 0.35, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE }
  );
  // armReach : tend vers le sol pour ramasser (F_REACH), reste tendu (feve en main) pendant tout le trajet,
  // tend a nouveau au depot (F_DROP), puis se replie apres le lift.
  const armReach = interpolate(
    frame,
    [F_BEND - 10, F_REACH, F_RISE, F_BEND2, F_DROP, F_LIFT, F_LIFT + 20],
    [0, 1, 0.7, 1, 1, 1, 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE }
  );
  // le panier est dessine par la SCENE (pas par le rig) pour pouvoir montrer les feves dedans.
  // -> le rig reste en carry="none" ; son bras avant (armReach retombe) pend et "tient" le panier scene.

  // ---- position de la main (helper partage) ----
  const pose = computePose({ walkPhase, moving, bend, armReach });
  const handSceneX = x + pose.frontHandX * MAN_S;
  const handSceneY = GROUND_Y + pose.frontHandY * MAN_S;

  // ---- FEVE ramassee : au sol -> COLLEE A LA MAIN jusqu'au depot. JAMAIS de glissade autonome. ----
  // Logique (Aziz) : il prend la feve, elle RESTE dans sa main ; c'est LA MAIN (le bras) qui l'amene
  // au-dessus du panier ; la feve ne disparait qu'au moment du depot (F_DROP), une fois la main au panier.
  const grabPose = computePose({ walkPhase: F_GRAB, moving: false, bend: 1, armReach: 1 });
  const podGroundX = STOP_X + grabPose.frontHandX * MAN_S;
  const podGroundY = GROUND_Y + grabPose.frontHandY * MAN_S;
  const inHand = frame >= F_GRAB;
  // feve = exactement la position de la main tant qu'elle est tenue (zero glissade)
  const podX = inHand ? handSceneX : podGroundX;
  const podY = inHand ? handSceneY : podGroundY;
  const podVisible = frame < F_DROP; // au depot, la feve "entre" dans le panier (beans passe a 3)

  // ---- panier : au sol (2 feves), 3 feves apres le depot, en main apres le soulevement ----
  const beans = frame >= F_DROP ? 3 : 2;
  const basketInHand = frame >= F_LIFT;
  // anse du panier suit la main quand souleve
  const basketX = basketInHand ? handSceneX : BASKET_X;
  const basketY = basketInHand ? handSceneY + 26 : BASKET_Y;

  // ---- AMBIANCE ----
  const dusk = interpolate(frame, [80, F_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bgDusk = lerpHex(PARCH, "#e7cfa3", dusk);
  const sunDusk = lerpHex("#f2c14e", "#e8923a", dusk);
  const sunPulse = 0.85 + 0.15 * Math.sin(wf / 22);
  const sway = (ph: number) => Math.sin(wf / 26 + ph) * 1.4;

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={bgDusk} />

        {/* soleil */}
        <circle cx={850} cy={320} r={84} fill={sunDusk} opacity={0.95} />
        <circle cx={850} cy={320} r={84} fill="none" stroke={INK} strokeWidth={3} opacity={0.4} />
        <g stroke={sunDusk} strokeWidth={4} opacity={0.5 * sunPulse} strokeLinecap="round">
          {Array.from({ length: 8 }, (_, k) => { const ba = (k / 8) * Math.PI * 2 + wf / 120; const r0 = 96, r1 = 134; return <line key={k} x1={850 + Math.cos(ba) * r0} y1={320 + Math.sin(ba) * r0} x2={850 + Math.cos(ba) * r1} y2={320 + Math.sin(ba) * r1} />; })}
        </g>

        {/* verger lointain */}
        <rect x={-200} y={GROUND_Y - 250} width={W + 400} height={70} fill="#efe6cf" opacity={0.5} />
        {[{ x: 150, y: GROUND_Y - 215, s: 0.4, ph: 4.1, tone: 1 }, { x: 340, y: GROUND_Y - 205, s: 0.36, ph: 2.0, tone: 2 }, { x: 980, y: GROUND_Y - 210, s: 0.42, ph: 0.5, tone: 1 }].map((t, k) => {
          const ap = interpolate(frame, [8 + k * 8, 64 + k * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
          return (<g key={k} transform={`translate(${t.x} ${t.y}) scale(${t.s})`} opacity={ap * 0.8}><g transform={`rotate(${sway(t.ph)} 0 0)`}><CacaoTree alive={1} grow={1} tone={t.tone} podWf={wf} podIdx={k} /></g></g>);
        })}
        <path d={`M0 ${GROUND_Y - 188} H ${W}`} fill="none" stroke={INK} strokeWidth={2.4} opacity={0.45} />

        {/* cacaoyer heros */}
        <ellipse cx={TREE_X} cy={GROUND_Y + 8} rx={130} ry={18} fill={INK} opacity={0.08} />
        <g transform={`translate(${TREE_X} ${GROUND_Y}) scale(1.05)`}>
          <g transform={`rotate(${sway(0)} 0 0)`}><CacaoTree alive={1} grow={1} tone={0} podWf={wf} podIdx={3} /></g>
        </g>

        {/* PANIER (au sol -> en main). beans = contenu visible. */}
        <g transform={`translate(${basketX} ${basketY - 44}) scale(${basketInHand ? 0.7 : 0.85})`}>
          <Basket beans={beans} />
        </g>

        {/* FEVE en transit (sol -> main -> panier). Disparait au depot (devient beans+1). */}
        {podVisible && (
          <g transform={`translate(${podX} ${podY})`}>
            {inHand && frame < F_GRAB + 10 && (
              <circle cx={0} cy={0} r={24} fill="#f2c14e" opacity={interpolate(frame, [F_GRAB, F_GRAB + 10], [0.3, 0], { extrapolateRight: "clamp" })} />
            )}
            <ellipse cx={0} cy={0} rx={15} ry={24} fill={POD} stroke={INK} strokeWidth={3} />
            <path d="M0 -20 L0 18 M-7 -15 C-3 -5 -3 7 -7 13 M7 -15 C3 -5 3 7 7 13" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
          </g>
        )}

        {/* LE PLANTEUR (panier dessine par la scene, pas le rig) */}
        <g transform={`translate(${x} ${GROUND_Y}) scale(${MAN_S})`}>
          <StickRig walkPhase={walkPhase} moving={moving} bend={bend} armReach={armReach} facing={1} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
