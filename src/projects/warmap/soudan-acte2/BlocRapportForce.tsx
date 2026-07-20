/**
 * BlocRapportForce — BEAT 6 de l'Acte 2 "Blocage" (registre BLOC, plein cadre, abstrait).
 *
 * Concept (validé Aziz, doctrine WARMAP : un rapport de force = concept sans lieu -> BLOC, pas carte) :
 *   « L'armée a les avions et les chars lourds. Sur le papier, elle devrait gagner. Dans les faits,
 *     elle n'y arrive pas. »
 *   -> masse SAF (droite) = PUISSANCE DE FEU concentrée (chars + avions) qui POUSSE contre le front.
 *   -> ligne de front centrale = ENCAISSE les coups (ondule, s'enfonce, REVIENT — ne cède JAMAIS).
 *   -> masse RSF (gauche) = TERRITOIRE large mais INERTE (occupe l'espace, n'avance pas).
 *   Le contraste « l'un frappe fort mais rebondit / l'autre est vaste mais immobile » = l'impasse.
 *
 * PAS de lieu, PAS de géographie réelle : deux masses géométriques. Frame-driven pur.
 * Fond parchemin état-major (cohérent registre insert/bloc). NO scale oscillant sur raster.
 *
 * Proto isolé : compo Root BlocRapportForceTest (300f). Intégré ensuite dans SoudanActe2 (beat 6).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, staticFile } from "remotion";

export const BLOC_RF_FPS = 30;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const RSF = "#b8341f";
const RSF_DK = "#8a2410";
const SAF = "#2f5c8a";
const SAF_DK = "#173a5e";
const SAND = "#d9c092";
const GOLD = "#e7bd78";
const INK = "#2b2117";
const IVORY = "#f2ebd9";

const W = 1920;
const H = 1080;
const FRONT_X = 1020;      // ligne de front (un peu à droite du centre : RSF territoire plus large)

// ── phases (frames relatives) ──
const P = {
  massIn: 6,          // les 2 masses apparaissent
  fire: 70,           // la puissance de feu SAF apparaît (chars/avions) + commence à pousser
  push1: 110,         // 1re poussée
  push2: 175,         // 2e poussée
  push3: 235,         // 3e poussée (chacune bute et rebondit)
  end: 300,
};

// picto CHAR (top-down stylisé, encre) — vectoriel, pas de raster (net à toute échelle)
const TankIcon: React.FC<{ x: number; y: number; s?: number; op?: number }> = ({ x, y, s = 1, op = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <rect x={-16} y={-11} width={32} height={22} rx={3} fill={SAF_DK} stroke={INK} strokeWidth={1.5} />
    <rect x={-11} y={-7} width={22} height={14} rx={2} fill={SAF} />
    <rect x={-3} y={-3} width={26} height={6} rx={2} fill={SAF_DK} stroke={INK} strokeWidth={1} />
    {/* canon pointé vers la gauche (vers le front RSF) */}
    <rect x={-30} y={-2} width={16} height={4} rx={1.5} fill={SAF_DK} stroke={INK} strokeWidth={1} />
  </g>
);

// picto AVION (silhouette delta, encre) — nez vers la gauche (vers le front)
const PlaneIcon: React.FC<{ x: number; y: number; s?: number; op?: number }> = ({ x, y, s = 1, op = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <path d="M -22 0 L 10 -6 L 22 -5 L 14 0 L 22 5 L 10 6 Z" fill={SAF_DK} stroke={INK} strokeWidth={1.2} />
    <path d="M -2 0 L 12 -16 L 18 -15 L 6 0 L 18 15 L 12 16 Z" fill={SAF} stroke={INK} strokeWidth={1} />
  </g>
);

export const BlocRapportForce: React.FC<{ localFrame?: number }> = ({ localFrame }) => {
  const cf = useCurrentFrame();
  const frame = localFrame ?? cf;

  // apparition des masses
  const massIn = interpolate(frame, [P.massIn, P.massIn + 24], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const fireIn = interpolate(frame, [P.fire, P.fire + 26], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // POUSSÉE SAF : 3 vagues, chacune avance vers le front puis REBONDIT (le front encaisse et repousse).
  // dépl = somme de 3 impulsions amorties -> le front bouge un peu puis revient à ~0 (impasse).
  const pulse = (start: number) => {
    const t = frame - start;
    if (t < 0) return 0;
    // impulsion : monte vite (poussée) puis revient (rebond), amortie
    return Math.sin(t * 0.14) * Math.exp(-t * 0.03) * 34;
  };
  const frontPush = Math.max(0, pulse(P.push1) + pulse(P.push2) + pulse(P.push3)); // >=0 : ne recule jamais côté SAF
  // le front s'enfonce vers la GAUCHE (dans le RSF) de frontPush px, mais revient toujours
  const frontOffset = frontPush;

  // ondulation permanente du front (il "vit", encaisse) — vectoriel donc net
  const wobble = (y: number) => 6 * Math.sin(y * 0.012 + frame * 0.08) + 4 * Math.sin(y * 0.03 - frame * 0.05);

  // chemin du front (vertical, ondulé, décalé de frontOffset vers la gauche)
  const frontPath = () => {
    const pts: string[] = [];
    for (let y = 60; y <= H - 60; y += 30) {
      const x = FRONT_X - frontOffset + wobble(y);
      pts.push(`${x.toFixed(1)} ${y}`);
    }
    return "M " + pts.join(" L ");
  };

  // flash d'impact quand une poussée bute sur le front
  const impactFlash = Math.max(
    interpolate(frame, [P.push1, P.push1 + 8, P.push1 + 22], [0, 0.7, 0], clamp),
    interpolate(frame, [P.push2, P.push2 + 8, P.push2 + 22], [0, 0.7, 0], clamp),
    interpolate(frame, [P.push3, P.push3 + 8, P.push3 + 22], [0, 0.7, 0], clamp),
  );

  // "SUR LE PAPIER" : le déséquilibre chiffré (registre data-viz, légitime en bloc)
  const labelOp = interpolate(frame, [P.fire + 20, P.fire + 44], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, #2a2416 0%, #14110a 100%)" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        <defs>
          <filter id="blocGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={5} result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* dégradé de masse (relief doux) */}
          <linearGradient id="rsfGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={RSF_DK} stopOpacity={0.55} />
            <stop offset="100%" stopColor={RSF} stopOpacity={0.32} />
          </linearGradient>
          <linearGradient id="safGrad" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor={SAF_DK} stopOpacity={0.6} />
            <stop offset="100%" stopColor={SAF} stopOpacity={0.34} />
          </linearGradient>
        </defs>

        {/* ── MASSE RSF (gauche) : large, étalée, INERTE — occupe ~55% de la largeur ── */}
        <rect x={0} y={0} width={FRONT_X} height={H} fill="url(#rsfGrad)" opacity={massIn} />
        {/* texture territoire : quelques hachures larges immobiles (vaste, calme) */}
        <g opacity={massIn * 0.5}>
          {[220, 430, 640, 850].map((y, i) => (
            <line key={i} x1={80} y1={y} x2={FRONT_X - 120} y2={y + 20} stroke={RSF_DK} strokeWidth={2} strokeDasharray="4 26" opacity={0.4} />
          ))}
        </g>

        {/* ── MASSE SAF (droite) : compacte, dense, PUISSANCE DE FEU ── */}
        <rect x={FRONT_X} y={0} width={W - FRONT_X} height={H} fill="url(#safGrad)" opacity={massIn} />

        {/* poussée : flèches de pression SAF qui poussent vers le front (apparaissent aux poussées) */}
        {[P.push1, P.push2, P.push3].map((ps, i) => {
          const a = interpolate(frame, [ps - 6, ps + 6, ps + 30, ps + 44], [0, 1, 1, 0], clamp);
          if (a <= 0.01) return null;
          const y = 380 + i * 170;
          const tip = FRONT_X - frontOffset - 10;
          return (
            <g key={i} opacity={a}>
              <line x1={FRONT_X + 180} y1={y} x2={tip} y2={y} stroke={GOLD} strokeWidth={5} strokeLinecap="round" />
              <path d={`M ${tip} ${y} l 18 -10 v 20 z`} fill={GOLD} />
            </g>
          );
        })}

        {/* ── FRONT central : encaisse, ondule, ne cède jamais ── */}
        <path d={frontPath()} fill="none" stroke={INK} strokeWidth={9} opacity={0.3} filter="url(#blocGlow)" strokeLinecap="round" />
        <path d={frontPath()} fill="none" stroke={GOLD} strokeWidth={4} opacity={0.9} strokeLinecap="round" />
        {/* flash d'impact sur le front */}
        <path d={frontPath()} fill="none" stroke={IVORY} strokeWidth={7} opacity={impactFlash} strokeLinecap="round" filter="url(#blocGlow)" />

        {/* ── PUISSANCE DE FEU SAF : chars + avions (vectoriels), apparition spring puis figés ── */}
        <g opacity={fireIn}>
          <TankIcon x={1430} y={470} s={1.5} />
          <TankIcon x={1560} y={560} s={1.5} />
          <TankIcon x={1470} y={650} s={1.5} />
          <PlaneIcon x={1660} y={430} s={1.5} />
          <PlaneIcon x={1700} y={600} s={1.5} />
          <PlaneIcon x={1620} y={720} s={1.5} />
        </g>

        {/* ── "SUR LE PAPIER" : déséquilibre matériel chiffré (data-viz, registre bloc) ── */}
        <g opacity={labelOp}>
          <text x={1560} y={210} textAnchor="middle" fontFamily="Georgia, serif" fontSize={30} fontWeight={700}
            fill={IVORY} letterSpacing={2}>PUISSANCE DE FEU</text>
          <text x={1560} y={250} textAnchor="middle" fontFamily="Georgia, serif" fontSize={19}
            fill={GOLD} letterSpacing={1} fontStyle="italic">avions · chars lourds</text>
        </g>
        <g opacity={labelOp}>
          <text x={430} y={210} textAnchor="middle" fontFamily="Georgia, serif" fontSize={30} fontWeight={700}
            fill={IVORY} letterSpacing={2}>TERRITOIRE</text>
          <text x={430} y={250} textAnchor="middle" fontFamily="Georgia, serif" fontSize={19}
            fill={RSF} letterSpacing={1} fontStyle="italic">vaste · dispersé</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default BlocRapportForce;
