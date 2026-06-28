/**
 * IngaV9x16 — R&D Grand Inga (2026-06-28). Test physicalité du sujet SVG.
 * Format VERTICAL 9:16 — grammaire SÉQUENCE TEMPORELLE (un objet par beat, remplace le précédent).
 *
 * Registre : blueprint (fond #0d1b3a, traits cyan #7fd4ff, accent or #c8a951)
 *
 * Grammaire VERTICALE = séquence dans le TEMPS :
 * un seul héros-objet par plan, qui pose une idée, puis laisse place au suivant.
 * Chaque objet occupe tout le cadre vertical — l'épure est un choix, pas un oubli.
 *
 * Chronologie (~30s, 900 frames @30fps) :
 *   f0-150   : BEAT 1 — fleuve Congo (la puissance) — trait + chiffre 41 200 m³/s
 *   f150-300 : BEAT 2 — mur de béton (la maîtrise) — blocs qui s'empilent
 *   f300-450 : BEAT 3 — turbine (l'énergie naît) — rotation + glow
 *   f450-600 : BEAT 4 — pylône (la lumière voyage) — tracé + fil
 *   f600-750 : BEAT 5 — RÉVÉLATION — 78% sans électricité vs 40 000 MW
 *   f750-900 : BEAT 6 — PARADOXE final — les deux chiffres face à face
 *
 * Transitions : cross-fade rapide (20f) entre beats — coupe nette + fond constant.
 * L'objet ne glisse pas : il fade out, le suivant fade in.
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const W = 1080;
const H = 1920;

const CYAN = "#7fd4ff";
const OR = "#c8a951";
const FOND = "#0d1b3a";
const BLANC = "#eaf6ff";

const prog = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Fondu entrant/sortant pour chaque beat
function beatOpacity(f: number, start: number, end: number): number {
  const fadeIn = prog(f, start, start + 20);
  const fadeOut = prog(f, end - 20, end, 1, 0);
  return Math.min(fadeIn, fadeOut);
}

export const IngaV9x16: React.FC = () => {
  const f = useCurrentFrame();

  // Opacités des 6 beats
  const b1 = beatOpacity(f, 0, 155);
  const b2 = beatOpacity(f, 145, 305);
  const b3 = beatOpacity(f, 295, 455);
  const b4 = beatOpacity(f, 445, 605);
  const b5 = beatOpacity(f, 595, 755);
  const b6 = beatOpacity(f, 745, 900);

  const CX = W / 2;

  return (
    <AbsoluteFill style={{ background: FOND, overflow: "hidden" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>

        {/* ======= GRILLE (très discrète, permanente) ======= */}
        <g opacity={0.05}>
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`v${i}`} x1={i * (W / 9)} y1={0} x2={i * (W / 9)} y2={H}
              stroke={CYAN} strokeWidth={0.5} />
          ))}
          {Array.from({ length: 16 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={i * (H / 16)} x2={W} y2={i * (H / 16)}
              stroke={CYAN} strokeWidth={0.5} />
          ))}
        </g>

        {/* ======= BEAT 1 — FLEUVE CONGO ======= */}
        <g opacity={b1}>
          {/* Label beat */}
          <text x={CX} y={220} fontFamily="monospace" fontSize={18} fill={CYAN}
            opacity={0.45} textAnchor="middle" letterSpacing={3}>
            01 / LA PUISSANCE
          </text>

          {/* Fleuve — serpentin vertical */}
          <path
            d={`M ${CX - 30} ${320}
                C ${CX + 80} ${420}, ${CX - 80} ${540}, ${CX + 40} ${650}
                S ${CX - 60} ${800}, ${CX} ${920}
                S ${CX + 70} ${1050}, ${CX - 20} ${1180}`}
            fill="none"
            stroke={CYAN}
            strokeWidth={prog(f, 0, 40) * 18}
            strokeLinecap="round"
            opacity={0.8}
          />
          {/* Deuxième filet */}
          <path
            d={`M ${CX + 30} ${340}
                C ${CX + 100} ${460}, ${CX - 40} ${580}, ${CX + 60} ${700}
                S ${CX - 50} ${840}, ${CX + 20} ${960}
                S ${CX + 90} ${1080}, ${CX} ${1200}`}
            fill="none"
            stroke={CYAN}
            strokeWidth={prog(f, 10, 50) * 6}
            strokeLinecap="round"
            opacity={0.35}
          />

          {/* Chiffre central */}
          <text x={CX} y={1400} fontFamily="monospace" fontSize={72} fontWeight="bold"
            fill={OR} textAnchor="middle" opacity={prog(f, 40, 90)}>
            41 200
          </text>
          <text x={CX} y={1470} fontFamily="monospace" fontSize={20} fill={CYAN}
            textAnchor="middle" opacity={prog(f, 50, 100) * 0.8} letterSpacing={2}>
            m³/s
          </text>
          <text x={CX} y={1540} fontFamily="monospace" fontSize={14} fill={BLANC}
            textAnchor="middle" opacity={prog(f, 60, 110) * 0.5} letterSpacing={1}>
            2e fleuve le plus puissant du monde
          </text>

          {/* Ligne de séparation bas */}
          <line x1={CX - 80} y1={1620} x2={CX + 80} y2={1620}
            stroke={OR} strokeWidth={0.8} opacity={prog(f, 80, 120) * 0.4} />

          {/* Indicateur étape */}
          <g transform={`translate(${CX}, ${1720})`}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle key={i} cx={(i - 2.5) * 28} cy={0} r={5}
                fill={i === 0 ? OR : "none"}
                stroke={i === 0 ? OR : CYAN}
                strokeWidth={1.2}
                opacity={i === 0 ? 0.9 : 0.3}
              />
            ))}
          </g>
        </g>

        {/* ======= BEAT 2 — MUR DE BÉTON ======= */}
        <g opacity={b2}>
          <text x={CX} y={220} fontFamily="monospace" fontSize={18} fill={CYAN}
            opacity={0.45} textAnchor="middle" letterSpacing={3}>
            02 / LA MAÎTRISE
          </text>

          {/* Mur — vue de face centrée */}
          {Array.from({ length: 8 }, (_, row) => {
            const rowStart = 145 + row * 12;
            const rowP = prog(f, rowStart, rowStart + 18);
            const yTop = 500 + row * 55;
            return (
              <g key={row} opacity={rowP}>
                {[0, 1, 2, 3].map((col) => {
                  const bx = CX - 220 + col * 112;
                  return (
                    <rect key={col} x={bx} y={yTop} width={108} height={50}
                      fill="none" stroke={BLANC} strokeWidth={1.5} opacity={0.75} />
                  );
                })}
                {/* Hachure béton armé */}
                <line x1={CX - 220} y1={yTop + 25} x2={CX + 220} y2={yTop + 25}
                  stroke={BLANC} strokeWidth={0.5} strokeDasharray="6 5" opacity={0.2} />
              </g>
            );
          })}

          {/* Flèche hauteur */}
          <g opacity={prog(f, 230, 280)}>
            <line x1={CX + 245} y1={500} x2={CX + 245} y2={940}
              stroke={OR} strokeWidth={1} opacity={0.6} />
            <text x={CX + 258} y={725} fontFamily="monospace" fontSize={14}
              fill={OR} opacity={0.7}>~100m</text>
          </g>

          {/* Label */}
          <text x={CX} y={1060} fontFamily="monospace" fontSize={28} fontWeight="bold"
            fill={BLANC} textAnchor="middle" opacity={prog(f, 240, 290) * 0.85}>
            BARRAGE INGA
          </text>
          <text x={CX} y={1120} fontFamily="monospace" fontSize={15} fill={CYAN}
            textAnchor="middle" opacity={prog(f, 255, 300) * 0.65} letterSpacing={1}>
            290m de chute en 14km
          </text>
          <text x={CX} y={1180} fontFamily="monospace" fontSize={13} fill={BLANC}
            textAnchor="middle" opacity={prog(f, 265, 305) * 0.4} letterSpacing={1}>
            concentration unique au monde
          </text>

          {/* Indicateur étape */}
          <g transform={`translate(${CX}, ${1720})`}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle key={i} cx={(i - 2.5) * 28} cy={0} r={5}
                fill={i <= 1 ? OR : "none"}
                stroke={i <= 1 ? OR : CYAN}
                strokeWidth={1.2}
                opacity={i === 1 ? 0.9 : i < 1 ? 0.5 : 0.3}
              />
            ))}
          </g>
        </g>

        {/* ======= BEAT 3 — TURBINE ======= */}
        <g opacity={b3}>
          <text x={CX} y={220} fontFamily="monospace" fontSize={18} fill={CYAN}
            opacity={0.45} textAnchor="middle" letterSpacing={3}>
            03 / L&apos;ÉNERGIE NAÎT
          </text>

          {/* Turbine centrale — grande */}
          {(() => {
            const turbR = 240;
            const localF = Math.max(0, f - 295);
            const rotation = localF * 1.6;
            const scale = prog(f, 295, 340, 0.2, 1);
            const glow = 0.12 + 0.08 * Math.sin(f * 0.1);
            return (
              <g transform={`translate(${CX}, ${H * 0.42}) scale(${scale})`}>
                {/* Glow externe */}
                <circle cx={0} cy={0} r={turbR + 30} fill="none"
                  stroke={OR} strokeWidth={2} opacity={glow} />
                <circle cx={0} cy={0} r={turbR + 60} fill="none"
                  stroke={OR} strokeWidth={1} opacity={glow * 0.5} />
                {/* Cercle principal */}
                <circle cx={0} cy={0} r={turbR} fill="none"
                  stroke={OR} strokeWidth={3} opacity={0.9} />
                {/* Pales qui tournent */}
                <g transform={`rotate(${rotation})`}>
                  {Array.from({ length: 8 }, (_, i) => {
                    const angle = (i * 45 * Math.PI) / 180;
                    const x2 = Math.cos(angle) * (turbR - 20);
                    const y2 = Math.sin(angle) * (turbR - 20);
                    return (
                      <line key={i} x1={0} y1={0} x2={x2} y2={y2}
                        stroke={OR} strokeWidth={5} strokeLinecap="round"
                        opacity={0.8} />
                    );
                  })}
                </g>
                {/* Axe central */}
                <circle cx={0} cy={0} r={22} fill={OR} opacity={0.95} />
                <circle cx={0} cy={0} r={10} fill={FOND} opacity={1} />
              </g>
            );
          })()}

          {/* Chiffre de puissance */}
          <text x={CX} y={1250} fontFamily="monospace" fontSize={52} fontWeight="bold"
            fill={OR} textAnchor="middle" opacity={prog(f, 360, 420)}>
            1 775 MW
          </text>
          <text x={CX} y={1320} fontFamily="monospace" fontSize={14} fill={CYAN}
            textAnchor="middle" opacity={prog(f, 375, 430) * 0.75} letterSpacing={1}>
            Inga 1 + Inga 2 — installés
          </text>
          {/* Paradoxe partiel */}
          <g opacity={prog(f, 400, 450)}>
            <rect x={CX - 200} y={1370} width={400} height={44}
              fill="none" stroke={CYAN} strokeWidth={1} opacity={0.4} />
            <text x={CX} y={1400} fontFamily="monospace" fontSize={13} fill={CYAN}
              textAnchor="middle" opacity={0.8} letterSpacing={0.5}>
              mais seulement 500 MW réels produits
            </text>
          </g>

          {/* Indicateur étape */}
          <g transform={`translate(${CX}, ${1720})`}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle key={i} cx={(i - 2.5) * 28} cy={0} r={5}
                fill={i <= 2 ? OR : "none"}
                stroke={i <= 2 ? OR : CYAN}
                strokeWidth={1.2}
                opacity={i === 2 ? 0.9 : i < 2 ? 0.5 : 0.3}
              />
            ))}
          </g>
        </g>

        {/* ======= BEAT 4 — PYLÔNE + FIL ======= */}
        <g opacity={b4}>
          <text x={CX} y={220} fontFamily="monospace" fontSize={18} fill={CYAN}
            opacity={0.45} textAnchor="middle" letterSpacing={3}>
            04 / LA LUMIÈRE VOYAGE
          </text>

          {/* Pylône central grand */}
          {(() => {
            const pylTop = 340;
            const pylBase = 1150;
            const pylH = pylBase - pylTop;
            const armY = pylTop + pylH * 0.3;
            const startF = 445;
            const p = prog(f, startF, startF + 60);
            const legLen = pylH * 1.2;
            const armLen = 260;

            return (
              <g>
                {/* Jambe gauche */}
                <line x1={CX - 80} y1={pylBase} x2={CX} y2={pylTop}
                  stroke={BLANC} strokeWidth={3}
                  strokeDasharray={`${legLen} ${legLen}`}
                  strokeDashoffset={legLen * (1 - p)}
                  opacity={0.85}
                />
                {/* Jambe droite */}
                <line x1={CX + 80} y1={pylBase} x2={CX} y2={pylTop}
                  stroke={BLANC} strokeWidth={3}
                  strokeDasharray={`${legLen} ${legLen}`}
                  strokeDashoffset={legLen * (1 - prog(f, startF + 8, startF + 68))}
                  opacity={0.85}
                />
                {/* Bras */}
                <line x1={CX - 130} y1={armY} x2={CX + 130} y2={armY}
                  stroke={BLANC} strokeWidth={2.5}
                  strokeDasharray={`${armLen} ${armLen}`}
                  strokeDashoffset={armLen * (1 - prog(f, startF + 18, startF + 70))}
                  opacity={0.8}
                />
                {/* Renforts diagonaux */}
                <line x1={CX - 80} y1={pylBase} x2={CX - 130} y2={armY}
                  stroke={BLANC} strokeWidth={1}
                  strokeDasharray="8 4" opacity={prog(f, startF + 30, startF + 70) * 0.4}
                />
                <line x1={CX + 80} y1={pylBase} x2={CX + 130} y2={armY}
                  stroke={BLANC} strokeWidth={1}
                  strokeDasharray="8 4" opacity={prog(f, startF + 30, startF + 70) * 0.4}
                />
                {/* Isolateurs */}
                {f > startF + 60 && (
                  <>
                    <circle cx={CX - 130} cy={armY} r={6} fill="none"
                      stroke={BLANC} strokeWidth={1.5} opacity={0.6} />
                    <circle cx={CX + 130} cy={armY} r={6} fill="none"
                      stroke={BLANC} strokeWidth={1.5} opacity={0.6} />
                  </>
                )}
                {/* Lumière au sommet */}
                <circle cx={CX} cy={pylTop} r={8} fill={OR}
                  opacity={prog(f, startF + 55, startF + 80) * 0.95} />
                <circle cx={CX} cy={pylTop} r={18 + 6 * Math.sin(f * 0.15)}
                  fill="none" stroke={OR} strokeWidth={1.5}
                  opacity={prog(f, startF + 60, startF + 85) * 0.35} />
              </g>
            );
          })()}

          {/* Fil qui part vers le haut ET vers le bas */}
          <g opacity={prog(f, 510, 550)}>
            <line x1={CX} y1={340} x2={CX} y2={280} stroke={CYAN} strokeWidth={2} strokeDasharray="6 4" opacity={0.6} />
            <text x={CX + 16} y={285} fontFamily="monospace" fontSize={12} fill={CYAN} opacity={0.6}>vers…</text>
          </g>

          {/* Label */}
          <text x={CX} y={1280} fontFamily="monospace" fontSize={22} fontWeight="bold"
            fill={BLANC} textAnchor="middle" opacity={prog(f, 520, 570) * 0.85}>
            TRANSPORT D&apos;ÉLECTRICITÉ
          </text>
          <text x={CX} y={1340} fontFamily="monospace" fontSize={13} fill={CYAN}
            textAnchor="middle" opacity={prog(f, 535, 580) * 0.65} letterSpacing={1}>
            du barrage aux provinces, aux voisins
          </text>

          {/* Indicateur étape */}
          <g transform={`translate(${CX}, ${1720})`}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle key={i} cx={(i - 2.5) * 28} cy={0} r={5}
                fill={i <= 3 ? OR : "none"}
                stroke={i <= 3 ? OR : CYAN}
                strokeWidth={1.2}
                opacity={i === 3 ? 0.9 : i < 3 ? 0.5 : 0.3}
              />
            ))}
          </g>
        </g>

        {/* ======= BEAT 5 — RÉVÉLATION PARADOXE ======= */}
        <g opacity={b5}>
          <text x={CX} y={220} fontFamily="monospace" fontSize={18} fill={CYAN}
            opacity={0.45} textAnchor="middle" letterSpacing={3}>
            05 / LE PARADOXE
          </text>

          {/* Chiffre POTENTIEL — grand, or */}
          <g opacity={prog(f, 595, 640)}>
            <text x={CX} y={640} fontFamily="monospace" fontSize={96} fontWeight="bold"
              fill={OR} textAnchor="middle" opacity={0.95}>
              42 000
            </text>
            <text x={CX} y={710} fontFamily="monospace" fontSize={22} fill={OR}
              textAnchor="middle" opacity={0.75} letterSpacing={2}>
              MW de potentiel
            </text>
          </g>

          {/* Ligne de séparation — la tension */}
          <line x1={CX - 160} y1={820} x2={CX + 160} y2={820}
            stroke={CYAN} strokeWidth={1.5}
            opacity={prog(f, 640, 680) * 0.6}
          />
          <text x={CX} y={812} fontFamily="monospace" fontSize={11} fill={CYAN}
            textAnchor="middle" opacity={prog(f, 645, 685) * 0.5} letterSpacing={2}>
            MAIS
          </text>

          {/* Chiffre SANS ÉLECTRICITÉ — blanc, douloureux */}
          <g opacity={prog(f, 650, 700)}>
            <text x={CX} y={1000} fontFamily="monospace" fontSize={96} fontWeight="bold"
              fill={BLANC} textAnchor="middle" opacity={0.9}>
              78%
            </text>
            <text x={CX} y={1070} fontFamily="monospace" fontSize={20} fill={BLANC}
              textAnchor="middle" opacity={0.65} letterSpacing={1}>
              des Congolais sans électricité
            </text>
            <text x={CX} y={1120} fontFamily="monospace" fontSize={14} fill={BLANC}
              textAnchor="middle" opacity={0.4} letterSpacing={0.5}>
              101 millions de personnes
            </text>
          </g>

          {/* Indicateur étape */}
          <g transform={`translate(${CX}, ${1720})`}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle key={i} cx={(i - 2.5) * 28} cy={0} r={5}
                fill={i <= 4 ? OR : "none"}
                stroke={i <= 4 ? OR : CYAN}
                strokeWidth={1.2}
                opacity={i === 4 ? 0.9 : i < 4 ? 0.5 : 0.3}
              />
            ))}
          </g>
        </g>

        {/* ======= BEAT 6 — CLIMAX : LES DEUX CHIFFRES ======= */}
        <g opacity={b6}>
          <text x={CX} y={220} fontFamily="monospace" fontSize={18} fill={CYAN}
            opacity={0.45} textAnchor="middle" letterSpacing={3}>
            06 / LA QUESTION
          </text>

          {/* Bloc gauche — potentiel */}
          <g opacity={prog(f, 750, 800)}>
            <rect x={60} y={400} width={420} height={320}
              fill="none" stroke={OR} strokeWidth={1.5} opacity={0.7} />
            <text x={270} y={510} fontFamily="monospace" fontSize={64} fontWeight="bold"
              fill={OR} textAnchor="middle" opacity={0.95}>
              40K
            </text>
            <text x={270} y={580} fontFamily="monospace" fontSize={15} fill={OR}
              textAnchor="middle" opacity={0.7} letterSpacing={1}>
              MW potentiel
            </text>
            <text x={270} y={630} fontFamily="monospace" fontSize={11} fill={OR}
              textAnchor="middle" opacity={0.45} letterSpacing={0.5}>
              + que les USA
            </text>
            <text x={270} y={680} fontFamily="monospace" fontSize={11} fill={CYAN}
              textAnchor="middle" opacity={0.45} letterSpacing={0.5}>
              Inga 3 : 12 Mds$
            </text>
          </g>

          {/* VS central */}
          <text x={CX} y={590} fontFamily="monospace" fontSize={32}
            fill={CYAN} textAnchor="middle" opacity={prog(f, 780, 820) * 0.6}>
            VS
          </text>

          {/* Bloc droit — réalité */}
          <g opacity={prog(f, 790, 840)}>
            <rect x={600} y={400} width={420} height={320}
              fill="none" stroke={BLANC} strokeWidth={1.5} opacity={0.5} />
            <text x={810} y={510} fontFamily="monospace" fontSize={64} fontWeight="bold"
              fill={BLANC} textAnchor="middle" opacity={0.85}>
              78%
            </text>
            <text x={810} y={580} fontFamily="monospace" fontSize={15} fill={BLANC}
              textAnchor="middle" opacity={0.6} letterSpacing={1}>
              sans électricité
            </text>
            <text x={810} y={630} fontFamily="monospace" fontSize={11} fill={BLANC}
              textAnchor="middle" opacity={0.4} letterSpacing={0.5}>
              101M personnes
            </text>
            <text x={810} y={680} fontFamily="monospace" fontSize={11} fill={BLANC}
              textAnchor="middle" opacity={0.4} letterSpacing={0.5}>
              prod réelle : 500 MW
            </text>
          </g>

          {/* Question finale */}
          <g opacity={prog(f, 830, 880)}>
            <line x1={100} y1={820} x2={W - 100} y2={820}
              stroke={CYAN} strokeWidth={1} opacity={0.3} />
            <text x={CX} y={920} fontFamily="monospace" fontSize={26}
              fill={BLANC} textAnchor="middle" opacity={0.85}>
              Qui reçoit l&apos;électricité ?
            </text>
            <text x={CX} y={980} fontFamily="monospace" fontSize={16} fill={CYAN}
              textAnchor="middle" opacity={0.6} letterSpacing={1}>
              mines · Afrique du Sud · ou la RDC ?
            </text>
            {/* Sous-titre style Souverain */}
            <text x={CX} y={1100} fontFamily="monospace" fontSize={13}
              fill={OR} textAnchor="middle" opacity={prog(f, 860, 900) * 0.7} letterSpacing={2}>
              GRAND INGA — LE PARADOXE
            </text>
          </g>

          {/* Indicateur étape — complet */}
          <g transform={`translate(${CX}, ${1720})`}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle key={i} cx={(i - 2.5) * 28} cy={0} r={5}
                fill={OR}
                stroke={OR}
                strokeWidth={1.2}
                opacity={i === 5 ? 0.95 : 0.5}
              />
            ))}
          </g>
        </g>

      </svg>
    </AbsoluteFill>
  );
};

export const INGA_V_FRAMES = 900;
