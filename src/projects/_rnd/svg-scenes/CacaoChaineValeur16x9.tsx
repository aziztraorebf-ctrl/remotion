/**
 * CacaoChaineValeur16x9 — TEST narratif 16:9 HORIZONTAL (R&D 2026-06-30). Bouclage : prouver le perso vivant
 * en horizontal, sur un vrai passage du script cacao (BEAT 3 — l'extraction / la chaine de valeur).
 *
 * SCRIPT (Beat 3) : "le paysan touche moins de 10%. Le reste — la fortune — se gagne ailleurs."
 * FORME (doctrine 16:9 = flux GAUCHE->DROITE) : la VALEUR voyage du planteur (gauche) vers les acteurs (droite).
 * INJUSTICE = DESEQUILIBRE D'ECHELLE : 1 planteur seul + petit tas a GAUCHE  vs  accumulation (acteurs +
 * tablette + valeur qui gonfle) a DROITE. Porte par la composition, ZERO texte (16:9 = ecran/son active).
 *
 * Briques : StickRig (3 persos differencies) + computePose + objectHandling + profondeur/parallaxe/heure doree (B5PontH).
 * Multi-personnages (3) + multi-objets (feves qui voyagent, tablette, pile de valeur).
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { CacaoTree } from "../../souverain/cacao-chocolat-short/components/VergerCacao";
import { StickRig } from "../../_shared/personnage-vivant-svg/rig/StickRig";
import { computePose } from "../../_shared/personnage-vivant-svg/rig/poses";

export const CACAO_CHAINE_16X9_FRAMES = 450;
const PARCH = "#e8dcc0";
const INK = "#2b2117";
const POD = "#a26432";
const COCOA = "#6b4423";
const GOLD = "#c8a951";
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

const W = 1920, H = 1080;
const GROUND_Y = 880;

// acteurs de la chaine (droite) : transformateur + distributeur (differencies)
const PLANTER_X = 360;          // le planteur, SEUL a gauche
const ACTOR1_X = 1180;          // transformateur
const ACTOR2_X = 1520;          // distributeur
const MAN_S_PLANTER = 0.5;      // planteur : PETIT (injustice d'echelle)
const MAN_S_ACTOR = 0.62;       // acteurs : plus grands

// timeline
const F_RECOLTE = 90;   // le planteur a ramasse une feve
const F_FLUX = 110;     // la feve part vers la droite
const F_ARRIVE_D = 200; // la valeur arrive a droite
const F_BUILD = 230;    // la tablette + la pile de valeur se construisent
const F_END = 450;

const lerpHex = (a: string, c: string, t: number) => {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const cc = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `#${cc.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

const Pod: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <ellipse cx={0} cy={0} rx={15} ry={24} fill={POD} stroke={INK} strokeWidth={3} />
    <path d="M0 -20 L0 18 M-7 -15 C-3 -5 -3 7 -7 13 M7 -15 C3 -5 3 7 7 13" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
  </g>
);

export const CacaoChaineValeur16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const wf = frame;

  // ---- camera lente + parallaxe (pivot au centre) + heure doree ----
  const camScale = interpolate(frame, [0, F_END], [1.05, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const camX = interpolate(frame, [0, F_END], [20, -20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const camAt = (p: number) => `translate(${camX * p} ${(10 + 4 * Math.sin(wf / 90)) * p}) translate(${W / 2} ${GROUND_Y}) scale(${1 + (camScale - 1) * p}) translate(${-W / 2} ${-GROUND_Y})`;
  const dusk = interpolate(frame, [80, F_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bgDusk = lerpHex(PARCH, "#e7cfa3", dusk);
  const sunDusk = lerpHex("#f2c14e", "#e8923a", dusk);
  const sway = (ph: number) => Math.sin(wf / 26 + ph) * 1.3;

  // ---- LE PLANTEUR (gauche) : se penche, recolte (geste maitrise) ----
  const pBend = interpolate(frame, [30, 60, F_RECOLTE, F_RECOLTE + 24], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const pReach = interpolate(frame, [50, 80, F_RECOLTE, F_RECOLTE + 18], [0, 1, 1, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const planterPose = computePose({ walkPhase: frame, moving: false, bend: pBend, armReach: pReach });

  // ---- LE FLUX : feves qui voyagent de gauche a droite (le coeur du 16:9 = mouvement horizontal) ----
  // plusieurs feves dephasees partent du planteur vers les acteurs (la valeur qui s'en va).
  const flux = Array.from({ length: 4 }, (_, i) => {
    const start = F_FLUX + i * 22;
    const t = interpolate(frame, [start, start + 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
    if (t <= 0.001 || t >= 0.999) return null;
    const fx = PLANTER_X + 60 + (ACTOR1_X - PLANTER_X - 60) * t;
    const fy = GROUND_Y - 120 - Math.sin(t * Math.PI) * 90; // arc
    return { key: i, x: fx, y: fy, op: Math.sin(t * Math.PI) };
  }).filter(Boolean) as { key: number; x: number; y: number; op: number }[];

  // ---- DROITE : la tablette se forme + la pile de valeur GONFLE (l'accumulation) ----
  const tabletBuild = interpolate(frame, [F_BUILD, F_BUILD + 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const valueStack = interpolate(frame, [F_ARRIVE_D, F_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  // le petit tas du planteur (gauche) reste DERISOIRE
  const planterPile = interpolate(frame, [F_RECOLTE, F_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={bgDusk} />

        {/* ===== FOND (ciel + soleil + verger lointain) parallaxe faible ===== */}
        <g transform={camAt(0.28)}>
          <circle cx={W / 2} cy={180} r={80} fill={sunDusk} opacity={0.9} />
          <g stroke={sunDusk} strokeWidth={4} opacity={0.5} strokeLinecap="round">
            {Array.from({ length: 8 }, (_, k) => { const ba = (k / 8) * Math.PI * 2 + wf / 120; const r0 = 92, r1 = 126; return <line key={k} x1={W / 2 + Math.cos(ba) * r0} y1={180 + Math.sin(ba) * r0} x2={W / 2 + Math.cos(ba) * r1} y2={180 + Math.sin(ba) * r1} />; })}
          </g>
        </g>

        {/* ===== MEDIAN (verger lointain, surtout cote gauche = l'origine) parallaxe moyenne ===== */}
        <g transform={camAt(0.6)}>
          <rect x={-200} y={GROUND_Y - 200} width={W + 400} height={60} fill="#efe6cf" opacity={0.5} />
          {[{ x: 120, s: 0.34, ph: 4.1, tone: 1 }, { x: 320, s: 0.3, ph: 2.0, tone: 2 }, { x: 560, s: 0.32, ph: 0.5, tone: 1 }].map((t, k) => (
            <g key={k} transform={`translate(${t.x} ${GROUND_Y - 150}) scale(${t.s})`} opacity={0.7}>
              <g transform={`rotate(${sway(t.ph)} 0 0)`}><CacaoTree alive={1} grow={1} tone={t.tone} podWf={wf} podIdx={k} /></g>
            </g>
          ))}
          <path d={`M0 ${GROUND_Y - 150} H ${W}`} fill="none" stroke={INK} strokeWidth={2} opacity={0.4} />
        </g>

        {/* ===== 1er PLAN ===== */}
        <g transform={camAt(1.0)}>
          {/* sol */}
          <path d={`M0 ${GROUND_Y} H ${W}`} fill="none" stroke={INK} strokeWidth={2.4} opacity={0.45} />

          {/* cacaoyer du planteur (gauche) */}
          <g transform={`translate(${PLANTER_X - 150} ${GROUND_Y}) scale(0.8)`}>
            <g transform={`rotate(${sway(0)} 0 0)`}><CacaoTree alive={1} grow={1} tone={0} podWf={wf} podIdx={3} /></g>
          </g>

          {/* LE PLANTEUR (petit, seul, a gauche) + son petit tas derisoire */}
          <g transform={`translate(${PLANTER_X} ${GROUND_Y}) scale(${MAN_S_PLANTER})`}>
            <StickRig walkPhase={frame} moving={false} bend={pBend} armReach={pReach} facing={1} hat="straw" />
          </g>
          {/* feve dans sa main pendant la recolte */}
          {frame >= 80 && frame < F_FLUX + 10 && (
            <g transform={`translate(${PLANTER_X + planterPose.frontHandX * MAN_S_PLANTER} ${GROUND_Y + planterPose.frontHandY * MAN_S_PLANTER})`}><Pod s={0.7} /></g>
          )}
          {/* petit tas derisoire du planteur (reste minuscule) */}
          {planterPile > 0.02 && (
            <g transform={`translate(${PLANTER_X + 70} ${GROUND_Y - 6})`} opacity={planterPile}>
              <Pod s={0.5} />
            </g>
          )}

          {/* LE FLUX horizontal : feves qui filent vers la droite (la valeur qui part) */}
          {flux.map((f) => (
            <g key={f.key} transform={`translate(${f.x} ${f.y})`} opacity={f.op}><Pod s={0.55} /></g>
          ))}

          {/* DROITE : 2 acteurs differencies (transformateur cap / distributeur scarf) */}
          <g transform={`translate(${ACTOR1_X} ${GROUND_Y}) scale(${MAN_S_ACTOR})`}>
            <StickRig walkPhase={frame} moving={false} bend={0.1 + 0.05 * Math.sin(wf / 30)} armReach={0.2} facing={-1} hat="cap" ink={INK} />
          </g>
          <g transform={`translate(${ACTOR2_X} ${GROUND_Y}) scale(${MAN_S_ACTOR})`}>
            <StickRig walkPhase={frame} moving={false} bend={0.08} armReach={0.15} facing={-1} hat="scarf" ink={INK} />
          </g>

          {/* TABLETTE de chocolat qui se forme (droite) */}
          {tabletBuild > 0.02 && (
            <g transform={`translate(${(ACTOR1_X + ACTOR2_X) / 2} ${GROUND_Y - 30})`} opacity={tabletBuild}>
              <rect x={-70} y={-46} width={140} height={92} rx={8} fill={COCOA} stroke={INK} strokeWidth={4} />
              {Array.from({ length: 3 }, (_, r) => Array.from({ length: 4 }, (_, c) => (
                <rect key={`${r}-${c}`} x={-62 + c * 33} y={-38 + r * 30} width={26} height={22} rx={3} fill="none" stroke={INK} strokeWidth={2} opacity={0.5} />
              )))}
            </g>
          )}

          {/* PILE DE VALEUR qui GONFLE a droite (l'accumulation = l'injustice). barres or qui montent. */}
          {valueStack > 0.02 && (
            <g transform={`translate(${ACTOR2_X + 200} ${GROUND_Y})`}>
              {Array.from({ length: 6 }, (_, i) => {
                const hh = (40 + i * 26) * Math.min(1, valueStack * 1.3 - i * 0.12);
                if (hh <= 1) return null;
                return <rect key={i} x={i * 26} y={-hh} width={20} height={hh} fill={GOLD} stroke={INK} strokeWidth={2.5} opacity={0.9} />;
              })}
            </g>
          )}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
