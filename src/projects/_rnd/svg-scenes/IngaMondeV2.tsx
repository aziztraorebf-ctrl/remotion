import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const W = 1920;
const H = 1080;

// ── TIMELINE (1800f / 60s @30fps) ────────────────────────────────────────────
//
//  PHASE 0 — ENCRE        f0   → f120   (4s)  Monde en traits neutres, tout vit déjà
//  PHASE 1 — RÉVÉLATION   f120 → f480   (12s) Couleurs arrivent une à une (GGW mécanisme B)
//    f120-180  Fleuve bleu (l'eau naît colorée — mécanisme A)
//    f180-280  Turbine reçoit sa couleur métal
//    f280-420  Câble or se trace gauche→droite
//    f420-480  Pylône s'illumine quand le câble le touche
//  PHASE 2 — JOUR         f480 → f780   (10s) Monde pleinement coloré. Maisons en ENCRE encore.
//  PHASE 3 — CRÉPUSCULE   f720 → f900   (6s)  Ciel vire orange-braise
//  PHASE 4 — NUIT         f900 → f1800  (30s) Fond sombre, turbine ralentit, bougies
//    f900-1020  Transition nuit
//    f1020+     Les maisons reçoivent leur seule couleur : bougie #ffcc60

export const INGA_MONDE_V2_FRAMES = 1800;

// ── NARRATION ─────────────────────────────────────────────────────────────────
const SUBS = [
  { in:  20,  out: 150, text: "Le fleuve Congo. La puissance d'un continent." },
  { in: 170,  out: 340, text: "Le Grand Inga — le plus grand barrage jamais conçu." },
  { in: 360,  out: 500, text: "L'énergie circule. Le câble part vers l'est." },
  { in: 520,  out: 680, text: "Côté village — rien. Les maisons attendent." },
  { in: 740,  out: 870, text: "Le soleil descend. Quelque chose ne tourne plus." },
  { in: 930,  out: 1100, text: "La nuit tombe sur le Congo." },
  { in: 1130, out: 1320, text: "Le câble brille toujours. Il ne s'arrête pas ici." },
  { in: 1380, out: 1580, text: "Dans les maisons à côté du barrage — une bougie." },
  { in: 1630, out: 1780, text: "L'électricité existe. Elle passe. Elle part." },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function cl(f: number, a: number, b: number, from: number, to: number) {
  return interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}
function osc(f: number, freq: number, amp: number, phase = 0) {
  return Math.sin((f / freq) * Math.PI * 2 + phase) * amp;
}
function hexToRgb(h: string) {
  return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
}
function lerpColor(f: number, frames: number[], colors: string[]) {
  if (f <= frames[0]) return colors[0];
  if (f >= frames[frames.length-1]) return colors[colors.length-1];
  for (let i = 0; i < frames.length-1; i++) {
    if (f >= frames[i] && f <= frames[i+1]) {
      const t = (f - frames[i]) / (frames[i+1] - frames[i]);
      const [r1,g1,b1] = hexToRgb(colors[i]);
      const [r2,g2,b2] = hexToRgb(colors[i+1]);
      return `rgb(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)})`;
    }
  }
  return colors[colors.length-1];
}

// ── COULEUR ENCRE (neutre, parchemin sombre) ──────────────────────────────────
const ENCRE = "#3a2a18";
const ENCRE_P = "#6a5a40";   // encre pâle (détails secondaires)
const FOND_PARCHEMIN = "#e8dcc0";

export const IngaMondeV2: React.FC = () => {
  const f = useCurrentFrame();

  // ── Phases de progression ────────────────────────────────────────────────
  const encreProgress  = cl(f, 0, 80, 0, 1);        // apparition initiale en encre
  const revealFleuve   = cl(f, 120, 200, 0, 1);     // fleuve bleu
  const revealTurbine  = cl(f, 180, 300, 0, 1);     // turbine métal
  const revealCable    = cl(f, 280, 450, 0, 1);     // câble or trace
  const revealPylone   = cl(f, 420, 500, 0, 1);     // pylône illuminé
  const jourProgress   = cl(f, 480, 600, 0, 1);     // fond parchemin→ciel bleu
  const crepProgress   = cl(f, 720, 900, 0, 1);     // ciel bleu→braise
  const nuitProgress   = cl(f, 900, 1020, 0, 1);    // braise→nuit
  const bougieProgress = cl(f, 1020, 1200, 0, 1);   // maisons reçoivent la bougie

  // ── Fond — parchemin → ciel bleu → crépuscule → nuit ────────────────────
  const skyTop = lerpColor(f,
    [0,   480, 600, 780, 900, 1020],
    ["#e8dcc0","#e8dcc0","#5aaad8","#e05820","#c03010","#0a0818"]
  );
  const skyBot = lerpColor(f,
    [0,   480, 600, 780, 900, 1020],
    ["#e8dcc0","#e8dcc0","#d8eeee","#f0a840","#902010","#1a0808"]
  );

  // ── Soleil ───────────────────────────────────────────────────────────────
  const sunOp  = cl(f, 480, 600, 0, 0.95) * cl(f, 780, 920, 1, 0);
  const sunX   = cl(f, 480, 1000, 1700, 900);
  const sunY   = cl(f, 480, 1000, 100, 1300);

  // ── Lune ─────────────────────────────────────────────────────────────────
  const moonOp = cl(f, 950, 1060, 0, 0.85);

  // ── Terrain (parchemin → vert savane → ocre → sombre) ───────────────────
  const grassA = lerpColor(f, [0,480,600,720,900], ["#e8dcc0","#e8dcc0","#5a8a30","#7a6820","#1a1008"]);
  const grassB = lerpColor(f, [0,480,600,720,900], ["#e8dcc0","#e8dcc0","#6a9a38","#6a5818","#2a1a08"]);
  const grassC = lerpColor(f, [0,480,600,720,900], ["#e8dcc0","#e8dcc0","#4a7a28","#5a5010","#2a1808"]);

  // ── Fleuve ───────────────────────────────────────────────────────────────
  const riverFill   = lerpColor(f, [0,120,200,600,780,900], ["#e8dcc0","#e8dcc0","#2a7abf","#2a7abf","#c06010","#0a1828"]);
  const riverStroke = lerpColor(f, [0,120,200,600,780,900], [ENCRE_P, ENCRE_P,"#a0d8f0","#a0d8f0","#f0a040","#1a3848"]);

  // ── Turbine ──────────────────────────────────────────────────────────────
  const turbineSpeed = cl(f, 900, 1100, 1, 0);
  const turbineAngle = (f * 0.4 * turbineSpeed) % 360;
  const turbineFill  = lerpColor(f, [0,180,300,900,1100], [ENCRE, ENCRE,"#a0a8b0","#c8a060","#5a4020"]);
  const turbineRim   = lerpColor(f, [0,180,300], [ENCRE, ENCRE,"#606870"]);
  const turbineCenter = lerpColor(f, [0,180,300,900], [ENCRE, ENCRE,"#d8e0e8","#f2a020"]);
  const bladeFill    = lerpColor(f, [0,180,300,900,1100], [ENCRE_P, ENCRE_P,"#9098a8","#6a5030","#3a2010"]);

  // ── Câble ────────────────────────────────────────────────────────────────
  // Tracé progressif via strokeDashoffset
  const cableLen = 1480;
  const cableOffset = interpolate(f, [280, 450], [cableLen, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cableGlow = 0.10 + osc(f, 45, 0.06);
  const cableColor = lerpColor(f, [0,280,450], [ENCRE, ENCRE,"#e8c030"]);

  // ── Pylône ───────────────────────────────────────────────────────────────
  const pyloneColor = lerpColor(f, [0,420,500,900], [ENCRE, ENCRE,"#b0b8c0","#c8a060"]);

  // ── Maisons — restent en encre jusqu'à la phase nuit ────────────────────
  // Jour : encre. Nuit : mur sombre MAIS bougie dans les fenêtres.
  const houseWallColor = lerpColor(f, [0,480,900,1020], [ENCRE, ENCRE, ENCRE,"#3a2010"]);
  const houseToit      = lerpColor(f, [0,480,900,1020], [ENCRE, ENCRE, ENCRE,"#4a2010"]);
  const bougieOp = bougieProgress * (0.7 + osc(f, 7, 0.15) + osc(f, 13, 0.1, 1.2));

  // ── Nuages ───────────────────────────────────────────────────────────────
  const cloudOp = cl(f, 480, 600, 0, 0.85) * cl(f, 720, 840, 1, 0);
  const cloudDx = f * 0.07;

  // ── Étoiles + lune ───────────────────────────────────────────────────────
  const starsOp = cl(f, 950, 1060, 0, 1);
  const braiseOp = cl(f, 900, 1100, 0, 0.38);

  // ── Sous-titres ───────────────────────────────────────────────────────────
  const activeSub = SUBS.find(s => f >= s.in && f <= s.out);
  const subOp = activeSub
    ? interpolate(f, [activeSub.in, activeSub.in+12, activeSub.out-12, activeSub.out],
        [0,1,1,0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" })
    : 0;

  // ── Tracé en encre initiale (stroke-dashoffset) ───────────────────────────
  const drawIn = (a: number, b: number, len = 400) =>
    interpolate(f, [a, b], [len, 0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });

  // Chaque objet se trace en séquence dès f0 (tout vivant en encre)
  const traceTurbine = drawIn(0, 60, 1400);
  const tracePylon   = drawIn(10, 70, 2400);
  const traceHouses  = drawIn(20, 80, 800);
  const traceFleuve  = drawIn(5, 55, 1200);

  return (
    <AbsoluteFill style={{ background: FOND_PARCHEMIN }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id="skyG2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={skyTop}/>
            <stop offset="100%" stopColor={skyBot}/>
          </linearGradient>
          <radialGradient id="sunH2" cx={sunX} cy={sunY} r="260" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff8d0" stopOpacity={sunOp * 0.4}/>
            <stop offset="100%" stopColor={skyTop} stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="braiseG2" cx="300" cy="480" r="700" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c04020" stopOpacity={braiseOp}/>
            <stop offset="100%" stopColor="#000" stopOpacity="0"/>
          </radialGradient>
          {/* Halos bougies */}
          {HOUSES_DATA.map((h, i) => (
            <radialGradient key={i} id={`cg${i}`}
              cx={h.x + h.w/2} cy={h.y + h.ry + 40} r="55" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffcc60" stopOpacity={bougieOp * 0.55}/>
              <stop offset="100%" stopColor="#ffcc60" stopOpacity="0"/>
            </radialGradient>
          ))}
          <filter id="glow2" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="12" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="blur2" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="18"/>
          </filter>
          {/* Option C — désaturation progressive au crépuscule puis re-saturation chaude */}
          <filter id="desat">
            <feColorMatrix type="saturate" values={`${
              // Jour plein (f<720) : saturation=1
              // Désaturation (f720→810) : 1→0
              // Re-saturation chaude (f810→900) : 0→1 (mais vers palette chaude via le ciel)
              f < 720 ? 1
              : f < 810 ? cl(f, 720, 810, 1, 0.05)
              : f < 900 ? cl(f, 810, 900, 0.05, 0.7)
              : 0.7
            }`}/>
          </filter>
        </defs>

        {/* ── FOND ── */}
        <rect width={W} height={H} fill={`url(#skyG2)`}/>
        <rect width={W} height={H} fill="url(#sunH2)"/>
        <rect width={W} height={H} fill="url(#braiseG2)"/>

        {/* ── GROUPE DÉSATURATION (tout sauf fond+sous-titres) ── */}
        <g filter={f >= 720 && f <= 950 ? "url(#desat)" : undefined}>

        {/* ── GRAIN PARCHEMIN (visible phase encre) ── */}
        <rect width={W} height={H} fill="#c8b890" opacity={cl(f,480,600,0.06,0)}/>

        {/* ── CADRE DOUBLE POINTILLÉ (signature GGW, visible en encre) ── */}
        <rect x="28" y="28" width={W-56} height={H-56}
          fill="none" stroke={ENCRE} strokeWidth="1.5" strokeDasharray="6 10"
          opacity={cl(f, 480, 600, 0.35, 0)}/>

        {/* ── ÉTOILES ── */}
        {STARS.map((s, i) => (
          <circle key={i} cx={s[0]} cy={s[1]} r={s[2]}
            fill="white" opacity={starsOp * (0.4 + osc(f, 60+i*7, 0.4, i))}/>
        ))}

        {/* ── LUNE ── */}
        <circle cx="1600" cy="140" r="38" fill="#e8e0c8" opacity={moonOp}/>
        <circle cx="1614" cy="132" r="30" fill={skyTop} opacity={moonOp}/>

        {/* ── SOLEIL ── */}
        <circle cx={sunX} cy={sunY} r="90" fill="#fff8c0" opacity={sunOp*0.2}/>
        <circle cx={sunX} cy={sunY} r="62" fill="#fff5a0" opacity={sunOp}/>

        {/* ── NUAGES ── */}
        <g opacity={cloudOp}>
          <g transform={`translate(${cloudDx},0)`}>
            <ellipse cx="720" cy="140" rx="130" ry="48" fill="white"/>
            <ellipse cx="620" cy="158" rx="80" ry="38" fill="white"/>
            <ellipse cx="830" cy="162" rx="90" ry="36" fill="white"/>
          </g>
          <g transform={`translate(${cloudDx*0.6},0)`}>
            <ellipse cx="210" cy="200" rx="80" ry="30" fill="white"/>
            <ellipse cx="150" cy="212" rx="50" ry="24" fill="white"/>
          </g>
          <g transform={`translate(${cloudDx*0.8},0)`}>
            <ellipse cx="1210" cy="170" rx="100" ry="36" fill="white"/>
            <ellipse cx="1120" cy="184" rx="68" ry="28" fill="white"/>
          </g>
        </g>

        {/* ── TERRAIN ── */}
        <path d={`M0 560 Q400 520 960 575 T1920 530 L1920 ${H} L0 ${H} Z`} fill={grassA} opacity="0.55"/>
        <path d={`M0 630 Q500 680 1000 610 T1920 650 L1920 ${H} L0 ${H} Z`} fill={grassB} opacity="0.85"/>
        <path d={`M0 690 Q600 650 1200 720 T1920 700 L1920 ${H} L0 ${H} Z`} fill={grassC} opacity="0.75"/>

        {/* ── FLEUVE — tracé en encre puis se bleuit ── */}
        {/* Zone eau (colorisée) */}
        <path d={`M0 ${720+osc(f,180,5)} C400 740 800 700 1920 760 L1920 ${H} L0 ${H} Z`}
          fill={riverFill}
          strokeDasharray={`1200 1200`}
          strokeDashoffset={traceFleuve}/>
        {/* Lignes de surface ondulantes */}
        {[0,1,2].map(i => (
          <path key={i}
            d={`M ${80+i*180} ${758+i*55+osc(f,90+i*20,4,i)} Q ${380+i*200} ${758+i*55+osc(f,70+i*15,5,i+1)} ${680+i*200} ${758+i*55+osc(f,80+i*18,4,i+2)}`}
            stroke={riverStroke} strokeWidth="2" fill="none" opacity="0.5"/>
        ))}
        {/* Reflet */}
        <ellipse cx={cl(f,480,900,850,500)} cy="808" rx="100" ry="14"
          fill={f < 900 ? "#d0f0ff" : "#a0c8f0"} opacity="0.2" filter="url(#blur2)"/>

        {/* ── BARRAGE ── */}
        <rect x="275" y="290" width="50" height="460"
          fill={lerpColor(f,[0,480,600,900],[ENCRE,ENCRE,"#b0b8a8","#4a3a28"])}
          strokeDasharray="460 460" strokeDashoffset={cl(f,0,50,460,0)}/>
        {[380,470,560,650].map(y => (
          <line key={y} x1="275" y1={y} x2="325" y2={y}
            stroke={lerpColor(f,[0,480],[ENCRE_P,"#909888"])} strokeWidth="1" opacity="0.5"/>
        ))}

        {/* ── ROUE TURBINE ── */}
        <g transform={`translate(300,500) rotate(${turbineAngle})`}>
          <circle cx="0" cy="0" r="200"
            fill={turbineFill} stroke={turbineRim} strokeWidth="3"
            strokeDasharray="1260 1260" strokeDashoffset={traceTurbine}/>
          <circle cx="0" cy="0" r="170" fill="none"
            stroke={turbineRim} strokeWidth="2"/>
          {[0,45,90,135,180,225,270,315].map(angle => (
            <path key={angle}
              d="M -12 -40 L -20 -168 A 168 168 0 0 1 20 -168 L 12 -40 Z"
              fill={bladeFill} stroke={turbineRim} strokeWidth="2"
              transform={`rotate(${angle})`}/>
          ))}
          <circle cx="0" cy="0" r="50" fill={turbineCenter} opacity="0.35"/>
          <circle cx="0" cy="0" r="30" fill={turbineCenter}/>
          {/* Glow or nuit */}
          <circle cx="0" cy="0" r="40" fill="#f2a020"
            opacity={cl(f,900,1100,0,0.5) * (0.4+osc(f,25,0.15))} filter="url(#glow2)"/>
        </g>
        {/* Corps turbine */}
        <ellipse cx="300" cy="600" rx="180" ry="60"
          fill={lerpColor(f,[0,180,300],[ENCRE,ENCRE,"#808898"])}/>
        <rect x="120" y="500" width="360" height="100"
          fill={lerpColor(f,[0,180,300],[ENCRE_P,ENCRE_P,"#909898"])}/>
        {/* Reflet eau */}
        <ellipse cx="300" cy="870" rx="140" ry="35"
          fill={f<900?"#8ab0d0":"#f2a020"}
          opacity={f<900 ? revealFleuve*0.12 : cl(f,900,1100,0,0.12)}
          filter="url(#blur2)"/>

        {/* ── PYLÔNE ── */}
        <g opacity={encreProgress}>
          <rect x="1020" y="750" width="40" height="20" fill={pyloneColor}/>
          <rect x="1180" y="750" width="40" height="20" fill={pyloneColor}/>
          <g stroke={pyloneColor} strokeWidth="1.5" opacity="0.8"
            strokeDasharray="2400 2400" strokeDashoffset={tracePylon}>
            {PYLON_DIAGS.map((d,i) => <line key={i} {...d}/>)}
          </g>
          {PYLON_CROSS.map((d,i) => <line key={i} {...d} stroke={pyloneColor} strokeWidth="3"/>)}
          <line x1="1040" y1="750" x2="1120" y2="80" stroke={pyloneColor} strokeWidth="5"/>
          <line x1="1200" y1="750" x2="1120" y2="80" stroke={pyloneColor} strokeWidth="5"/>
          <rect x="1100" y="70" width="40" height="12" fill={pyloneColor}/>
          <line x1="1060" y1="340" x2="1180" y2="340" stroke={pyloneColor} strokeWidth="5"/>
          {/* Reflet soleil côté droit */}
          <line x1="1200" y1="750" x2="1120" y2="80" stroke="white" strokeWidth="1.5"
            opacity={cl(f,480,600,0,0.25)*cl(f,720,840,1,0)}/>
        </g>

        {/* ── CÂBLE (tracé progressif, toujours allumé) ── */}
        <path d="M 480 490 C 750 320 980 280 1120 340 C 1360 420 1600 500 1920 540"
          stroke={cableColor} strokeWidth="22" fill="none"
          opacity={revealCable * cableGlow}
          strokeDasharray={`${cableLen} ${cableLen}`}
          strokeDashoffset={cableOffset}/>
        <path d="M 480 490 C 750 320 980 280 1120 340 C 1360 420 1600 500 1920 540"
          stroke={cableColor} strokeWidth="7" fill="none"
          strokeDasharray={`${cableLen} ${cableLen}`}
          strokeDashoffset={cableOffset}/>
        {/* Reflet jour */}
        <path d="M 480 490 C 750 320 980 280 1120 340 C 1360 420 1600 500 1920 540"
          stroke="white" strokeWidth="2" fill="none"
          opacity={cl(f,480,600,0,0.3)*cl(f,720,860,1,0)}
          strokeDasharray={`${cableLen} ${cableLen}`}
          strokeDashoffset={cableOffset}/>

        {/* Isolateurs */}
        {INSULATORS.map((ins,i) => (
          <g key={i} transform={`translate(${ins.x},${ins.y}) rotate(${ins.r})`}
            opacity={revealCable}>
            <rect x="-4" y="-15" width="8" height="30"
              fill={lerpColor(f,[0,280,450,900],[ENCRE,ENCRE,"#c0c8d0","#c8a060"])}/>
            {[-10,0,10].map(cy => (
              <circle key={cy} cx="0" cy={cy} r="5"
                fill={lerpColor(f,[0,280,450],[ENCRE,ENCRE,"#e8ecf0"])}
                stroke={lerpColor(f,[0,280,450],[ENCRE_P,ENCRE_P,"#8090a0"])}
                strokeWidth="1.5"/>
            ))}
          </g>
        ))}

        {/* ── HALOS BOUGIES ── */}
        {HOUSES_DATA.map((_,i) => (
          <rect key={i} width={W} height={H} fill={`url(#cg${i})`}/>
        ))}

        {/* ── VILLAGE — encre jusqu'à la nuit, puis bougie ── */}
        {HOUSES_DATA.map((h, hi) => (
          <g key={hi} transform={`translate(${h.x},${h.y})`}
            opacity={encreProgress}
            strokeDasharray="800 800" strokeDashoffset={traceHouses}>
            <ellipse cx={h.w/2} cy={h.h+h.ry+12} rx={h.w*0.65} ry="10"
              fill={ENCRE} opacity="0.08"/>
            {/* Corps */}
            <rect x="0" y={h.ry} width={h.w} height={h.h}
              fill={houseWallColor} stroke={ENCRE} strokeWidth="1.8"/>
            {/* Texture mur */}
            <line x1="4" y1={h.ry+h.h*0.33} x2={h.w-4} y2={h.ry+h.h*0.33}
              stroke={ENCRE_P} strokeWidth="0.8" opacity="0.4"/>
            <line x1="4" y1={h.ry+h.h*0.66} x2={h.w-4} y2={h.ry+h.h*0.66}
              stroke={ENCRE_P} strokeWidth="0.8" opacity="0.4"/>
            {/* Toit-terrasse */}
            <rect x={-8} y={h.ry-14} width={h.w+16} height={18}
              fill={houseToit} stroke={ENCRE} strokeWidth="1.8"/>
            <rect x={-8} y={h.ry-20} width={h.w+16} height={8} fill={ENCRE} opacity="0.7"/>
            {/* Fenêtres */}
            {h.wins.map((w, wi) => (
              <g key={wi}>
                <rect x={w[0]} y={w[1]} width={w[2]} height={w[3]}
                  fill={lerpColor(f,[0,1020,1200],[FOND_PARCHEMIN,FOND_PARCHEMIN,"#1a1208"])}
                  stroke={ENCRE} strokeWidth="1"/>
                {/* Croisillon */}
                <line x1={w[0]+w[2]/2} y1={w[1]} x2={w[0]+w[2]/2} y2={w[1]+w[3]}
                  stroke={ENCRE} strokeWidth="0.8"/>
                <line x1={w[0]} y1={w[1]+w[3]/2} x2={w[0]+w[2]} y2={w[1]+w[3]/2}
                  stroke={ENCRE} strokeWidth="0.8"/>
                {/* Bougie (nuit seulement) */}
                <ellipse cx={w[0]+w[2]/2} cy={w[1]+w[3]-5}
                  rx="4" ry="7" fill="#ffcc60" opacity={bougieOp*0.7}/>
                <ellipse cx={w[0]+w[2]/2} cy={w[1]+w[3]-9}
                  rx="2.5" ry="4.5" fill="#fff0a0" opacity={bougieOp*0.9}/>
              </g>
            ))}
            {/* Porte */}
            <rect x={h.door[0]} y={h.door[1]} width={h.door[2]} height={h.door[3]}
              fill={lerpColor(f,[0,480,600],[FOND_PARCHEMIN,FOND_PARCHEMIN,h.doorColor])}
              stroke={ENCRE} strokeWidth="1"/>
          </g>
        ))}

        {/* ── PALMIERS ── (en encre phase 0, puis vert) */}
        {PALMS.map((p, i) => (
          <g key={i} transform={`translate(${p.x},${p.y})`} opacity={encreProgress}>
            <line x1="0" y1={p.h} x2={osc(f,120,3,i)} y2="0"
              stroke={lerpColor(f,[0,480,600],[ENCRE,"#5a3810","#5a3810"])} strokeWidth={p.thick}/>
            <ellipse cx={osc(f,120,3,i)} cy="0" rx={p.rx} ry={p.ry}
              fill={lerpColor(f,[0,480,600],[ENCRE_P,"#3a7a20","#3a7a20"])}
              opacity={lerpColor(f,[0,480,600],["0.5","0.9","0.9"]) as unknown as number}/>
            <ellipse cx={osc(f,120,3,i)-p.rx*0.7} cy={p.ry*0.6}
              rx={p.rx*0.8} ry={p.ry*0.65}
              fill={lerpColor(f,[0,480,600],[ENCRE_P,"#4a8a28","#4a8a28"])}
              opacity="0.8" transform={`rotate(-28,${osc(f,120,3,i)-p.rx*0.7},${p.ry*0.6})`}/>
            <ellipse cx={osc(f,120,3,i)+p.rx*0.7} cy={p.ry*0.6}
              rx={p.rx*0.8} ry={p.ry*0.65}
              fill={lerpColor(f,[0,480,600],[ENCRE_P,"#4a8a28","#4a8a28"])}
              opacity="0.8" transform={`rotate(28,${osc(f,120,3,i)+p.rx*0.7},${p.ry*0.6})`}/>
          </g>
        ))}

        {/* ── LIGNE SOL VILLAGE ── */}
        <path d="M 1470 700 C 1580 690 1700 705 1895 695" fill="none"
          stroke={lerpColor(f,[0,480,600,900],[ENCRE_P,ENCRE_P,"#5a8a30","#3a2810"])}
          strokeWidth="1.5" opacity="0.4"/>

        {/* ── FLÈCHE NARRATIVE câble ── */}
        <path d={`M 1870 ${510+osc(f,30,3)} L 1910 ${518+osc(f,30,3)} L 1870 ${526+osc(f,30,3)}`}
          fill="none" stroke="#e8c030" strokeWidth="3.5" strokeLinejoin="round"
          opacity={revealCable * (0.6+osc(f,30,0.3))}/>

        {/* ── FIN GROUPE DÉSATURATION ── */}
        </g>

        {/* ── SOUS-TITRES ── */}
        {subOp > 0 && activeSub && (
          <g>
            <rect x="160" y={H-125} width={W-320} height={72} rx="6"
              fill="#000" opacity={subOp*0.6}/>
            <text x={W/2} y={H-76}
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontSize="34"
              fill="white"
              opacity={subOp}
              style={{ letterSpacing:"0.02em" }}>
              {activeSub.text}
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ── DONNÉES STATIQUES ─────────────────────────────────────────────────────────
const STARS: [number,number,number][] = [
  [120,60,1.5],[280,40,1],[450,80,2],[600,30,1.5],[780,55,1],[950,25,2],
  [1100,70,1.5],[1300,45,1],[1450,65,2],[1600,35,1.5],[1750,80,1],[1850,50,1.5],
  [200,130,1],[400,110,1.5],[700,100,1],[900,120,2],[1150,90,1.5],[1380,115,1],
  [350,170,1],[800,160,1.5],[1250,150,1],[1650,175,2],
];
const PYLON_DIAGS = [
  {x1:1040,y1:750,x2:1182,y2:600},{x1:1200,y1:750,x2:1058,y2:600},
  {x1:1058,y1:600,x2:1168,y2:480},{x1:1182,y1:600,x2:1072,y2:480},
  {x1:1072,y1:480,x2:1154,y2:360},{x1:1168,y1:480,x2:1086,y2:360},
  {x1:1086,y1:360,x2:1139,y2:240},{x1:1154,y1:360,x2:1101,y2:240},
  {x1:1101,y1:240,x2:1125,y2:120},{x1:1139,y1:240,x2:1115,y2:120},
];
const PYLON_CROSS = [
  {x1:1058,y1:600,x2:1182,y2:600},{x1:1072,y1:480,x2:1168,y2:480},
  {x1:1086,y1:360,x2:1154,y2:360},{x1:1101,y1:240,x2:1139,y2:240},
];
const INSULATORS = [
  {x:650,y:385,r:-20},{x:900,y:295,r:5},
  {x:1120,y:340,r:15},{x:1400,y:440,r:20},{x:1700,y:515,r:10},
];
const HOUSES_DATA = [
  { x:1480,y:570,w:110,h:90,ry:20,
    wins:[[12,40,28,28],[70,40,28,28]] as [number,number,number,number][],
    door:[42,72,26,38] as [number,number,number,number], doorColor:"#1a3a8a" },
  { x:1610,y:540,w:84,h:76,ry:16,
    wins:[[10,32,22,22],[52,32,22,22]] as [number,number,number,number][],
    door:[31,60,22,32] as [number,number,number,number], doorColor:"#1a6030" },
  { x:1720,y:555,w:76,h:66,ry:14,
    wins:[[8,28,20,18],[48,28,20,18]] as [number,number,number,number][],
    door:[28,52,20,28] as [number,number,number,number], doorColor:"#1a3a8a" },
  { x:1820,y:565,w:60,h:58,ry:12,
    wins:[[8,22,16,14],[36,22,16,14]] as [number,number,number,number][],
    door:[22,44,16,26] as [number,number,number,number], doorColor:"#206040" },
];
const PALMS = [
  {x:1590,y:700,h:140,rx:22,ry:12,thick:5},
  {x:1710,y:688,h:130,rx:18,ry:10,thick:4},
  {x:1810,y:695,h:125,rx:16,ry:9,thick:4},
];
