/**
 * KhartoumFxDemo — planche de demonstration ANIMEE des effets SVG candidats pour l'insert Khartoum
 * (registre etat-major grave). But : juger le MOUVEMENT reel de chaque effet avant integration dans
 * KhartoumEtatMajorSVG.tsx. R&D uniquement, pas un livrable.
 *
 * 4 effets, chacun dans sa cellule, tous en boucle continue frame-driven (zero CSS/keyframes) :
 *   1. Fumee montante (feTurbulence anime + volutes qui montent et se dissipent)
 *   2. Poussiere derriere une colonne en mouvement (particules qui trainent et s'effacent)
 *   3. Flammes persistantes (langues de flamme qui vacillent)
 *   4. Tirs radiaux (traits de tir qui jaillissent par salves)
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const KHARTOUM_FX_FPS = 30;
export const KHARTOUM_FX_FRAMES = 150; // 5s boucle

const RED = "#8a2a20";
const IVORY = "#f2ebd9";
const GOLD = "#e7bd78";
const GOLD_DARK = "#bf9442";
const INK = "#2b1410";
const SAND = "#d9c092";

// ── 1. FUMEE : volutes qui montent en boucle + turbulence deformante animee par seed ──
const SmokeFx: React.FC<{ frame: number }> = ({ frame }) => {
  const seed = Math.floor(frame / 4) % 20;
  // 3 bouffees decalees, chacune monte de y=0 vers y=-70 puis se dissipe, en boucle
  const puffs = [0, 25, 50].map((offset, i) => {
    const t = ((frame + offset) % 75) / 75; // 0..1
    const y = -t * 70;
    const scale = 0.6 + t * 1.1;
    const op = interpolate(t, [0, 0.15, 0.8, 1], [0, 0.6, 0.4, 0], { extrapolateRight: "clamp" });
    return { y, scale, op, i };
  });
  return (
    <g>
      <defs>
        <filter id="smoketurb-demo">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="12" />
        </filter>
      </defs>
      <g filter="url(#smoketurb-demo)">
        {puffs.map((p) => (
          <g key={p.i} transform={`translate(0 ${p.y}) scale(${p.scale})`} opacity={p.op}>
            <ellipse cx={0} cy={0} rx={20} ry={22} fill="#6b5c42" />
            <ellipse cx={-8} cy={-6} rx={14} ry={16} fill="#5c4d38" />
            <ellipse cx={7} cy={-3} rx={12} ry={14} fill="#4a3f2e" />
          </g>
        ))}
      </g>
      {/* foyer (cible touchee) */}
      <circle cx={0} cy={14} r={7} fill={RED} />
      <circle cx={0} cy={14} r={3} fill={GOLD} />
    </g>
  );
};

// ── 2. POUSSIERE : une colonne (rect rouge) avance, la poussiere traine derriere et s'efface ──
const DustFx: React.FC<{ frame: number }> = ({ frame }) => {
  const cycle = (frame % 90) / 90; // 0..1
  const x = interpolate(cycle, [0, 1], [-55, 55]); // le vehicule traverse
  // particules de poussiere : chacune nait derriere le vehicule et se disperse
  const particles = Array.from({ length: 7 }).map((_, i) => {
    const birth = (i / 7) * 90;
    const age = ((frame - birth) % 90 + 90) % 90;
    const px = x - 14 - age * 0.5 - i * 2;
    const py = -2 + Math.sin(i * 2.1 + frame * 0.1) * 4;
    const r = 4 + age * 0.12;
    const op = interpolate(age, [0, 8, 55], [0, 0.5, 0], { extrapolateRight: "clamp" });
    return { px, py, r, op, i };
  });
  return (
    <g>
      {particles.map((p) => (
        <circle key={p.i} cx={p.px} cy={p.py} r={p.r} fill="#8a7c5e" opacity={p.op} />
      ))}
      <g transform={`translate(${x} 0)`}>
        <rect x={-9} y={-6} width={18} height={12} rx={2} fill={RED} stroke={IVORY} strokeWidth={1.4} />
        <line x1={4} y1={0} x2={13} y2={0} stroke={GOLD} strokeWidth={2} />
      </g>
    </g>
  );
};

// ── 3. FLAMMES : 3 langues de flamme qui vacillent (hauteur + inclinaison sinusoidales dephasees) ──
const FireFx: React.FC<{ frame: number }> = ({ frame }) => {
  const flames = [
    { x: -10, phase: 0, baseH: 1.0 },
    { x: 0, phase: 2.1, baseH: 1.3 },
    { x: 10, phase: 4.2, baseH: 0.9 },
  ];
  return (
    <g>
      {/* braise au sol */}
      <ellipse cx={0} cy={14} rx={22} ry={6} fill={RED} opacity={0.4} />
      {flames.map((fl, i) => {
        const flick = Math.sin(frame * 0.35 + fl.phase);
        const h = fl.baseH * (1 + flick * 0.18);
        const sway = Math.sin(frame * 0.4 + fl.phase) * 3;
        return (
          <g key={i} transform={`translate(${fl.x + sway} 12) scale(1 ${h})`}>
            <path d="M0,0 Q-9,-8 -5,-24 Q-1,-14 1,-30 Q5,-16 8,-24 Q11,-6 3,0 Z" fill={RED} opacity={0.9} />
            <path d="M0,0 Q-5,-6 -2,-16 Q1,-9 2,-20 Q5,-9 4,0 Z" fill={GOLD_DARK} />
            <path d="M0,-1 Q-2,-6 0,-12 Q2,-6 2,-1 Z" fill={GOLD} />
          </g>
        );
      })}
    </g>
  );
};

// ── 4. TIRS RADIAUX : salves de traits de tir qui jaillissent depuis le centre par rafales ──
const TracersFx: React.FC<{ frame: number }> = ({ frame }) => {
  const dirs = [
    { a: -140 }, { a: -35 }, { a: 155 }, { a: 40 }, { a: -95 }, { a: 90 },
  ];
  return (
    <g>
      {dirs.map((d, i) => {
        // chaque tir a sa propre cadence : jaillit puis s'efface, en boucle decalee
        const period = 30;
        const t = ((frame + i * 7) % period) / period;
        const len = interpolate(t, [0, 0.3, 0.6], [0, 34, 40], { extrapolateRight: "clamp" });
        const op = interpolate(t, [0, 0.1, 0.5, 0.7], [0, 1, 1, 0], { extrapolateRight: "clamp" });
        const rad = (d.a * Math.PI) / 180;
        const x1 = Math.cos(rad) * 8;
        const y1 = Math.sin(rad) * 8;
        const x2 = Math.cos(rad) * (8 + len);
        const y2 = Math.sin(rad) * (8 + len);
        return (
          <g key={i} opacity={op}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD} strokeWidth={2.2} strokeLinecap="round" />
            <circle cx={x2} cy={y2} r={2.5} fill={RED} />
          </g>
        );
      })}
      <circle cx={0} cy={0} r={7} fill={INK} />
      <circle cx={0} cy={0} r={3} fill={RED} />
    </g>
  );
};

const Cell: React.FC<{ x: number; y: number; title: string; children: React.ReactNode }> = ({ x, y, title, children }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-210} y={-190} width={420} height={380} fill={SAND} stroke={INK} strokeWidth={1.5} opacity={0.5} rx={6} />
    <text x={0} y={-155} textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize={22} fontWeight={800} fill={INK} letterSpacing={1}>
      {title}
    </text>
    <g transform="translate(0 20) scale(2.4)">{children}</g>
  </g>
);

export const KhartoumFxDemo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#c9b183" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={0} width={1920} height={1080} fill="#c9b183" />
        <Cell x={490} y={300} title="1. FUMEE">
          <SmokeFx frame={frame} />
        </Cell>
        <Cell x={1430} y={300} title="2. POUSSIERE (colonne)">
          <DustFx frame={frame} />
        </Cell>
        <Cell x={490} y={760} title="3. INCENDIE">
          <FireFx frame={frame} />
        </Cell>
        <Cell x={1430} y={760} title="4. TIRS RADIAUX">
          <TracersFx frame={frame} />
        </Cell>
      </svg>
    </AbsoluteFill>
  );
};

export default KhartoumFxDemo;
