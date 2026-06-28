import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from "remotion";

const W = 1920;
const H = 1080;

// ── Durées des 3 états (frames @30fps) ───────────────────────────────────────
// État 1 : Jour        0  → 450f  (15s)
// Transition crépuscule: 390 → 540f  (overlap 150f = 5s)
// État 2 : Crépuscule  450 → 720f  (9s)
// Transition nuit:      660 → 810f  (overlap 150f = 5s)
// État 3 : Nuit        720 → 1500f (26s)
export const INGA_MONDE_FRAMES = 1500;

// ── Narration — 7 cartes sous-titres ─────────────────────────────────────────
const SUBS = [
  { in: 30,  out: 200, text: "Le Grand Inga. Le plus grand barrage du monde en devenir." },
  { in: 220, out: 390, text: "Ses turbines pourraient alimenter toute l'Afrique." },
  { in: 450, out: 600, text: "Mais le soleil descend sur le fleuve Congo..." },
  { in: 620, out: 780, text: "...et quelque chose ne tourne plus rond." },
  { in: 810, out: 990, text: "La nuit tombe. Le câble brille toujours — vers l'Europe." },
  { in: 1010,out: 1200, text: "Dans le village à côté : une bougie." },
  { in: 1250,out: 1450, text: "L'électricité existe. Elle passe. Elle ne s'arrête pas ici." },
];

// ── Interpolation helper ──────────────────────────────────────────────────────
function cl(f: number, a: number, b: number, from: number, to: number) {
  return interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// ── Oscillation permanente (vie) ─────────────────────────────────────────────
function osc(f: number, freq: number, amp: number, phase = 0) {
  return Math.sin((f / freq) * Math.PI * 2 + phase) * amp;
}

export const IngaMondeVivant: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Progression des 3 états ───────────────────────────────────────────────
  const jourProgress   = cl(frame, 0, 60, 0, 1);
  const crepProgress   = cl(frame, 390, 540, 0, 1);
  const nuitProgress   = cl(frame, 660, 810, 0, 1);

  // ── Couleurs de ciel interpolées ──────────────────────────────────────────
  // Jour      → Crépuscule → Nuit
  const skyTop = interpolateColor(frame,
    [0, 450, 720],
    ["#5aaad8", "#e05820", "#0a0818"]
  );
  const skyBot = interpolateColor(frame,
    [0, 450, 720],
    ["#d8eeee", "#f0a840", "#1a0808"]
  );

  // ── Soleil / lune ─────────────────────────────────────────────────────────
  const sunY   = cl(frame, 0, 800, 110, 1200);
  const sunX   = cl(frame, 0, 800, 1700, 960);
  const sunR   = cl(frame, 390, 540, 62, 40);
  const sunOp  = cl(frame, 390, 540, 0.95, 0);
  const moonOp = cl(frame, 700, 810, 0, 0.9);
  const moonX  = cl(frame, 660, 900, 800, 1600);
  const moonY  = cl(frame, 660, 900, 300, 140);

  // ── Terrain (vert → ocre → sombre) ───────────────────────────────────────
  const grassA = interpolateColor(frame, [0, 450, 720], ["#5a8a30", "#8a6a20", "#1a1008"]);
  const grassB = interpolateColor(frame, [0, 450, 720], ["#6a9a38", "#7a5a18", "#2a1a08"]);
  const grassC = interpolateColor(frame, [0, 450, 720], ["#4a7a28", "#6a5010", "#2a1808"]);

  // ── Fleuve (bleu → orange → noir-bleu) ───────────────────────────────────
  const riverColor = interpolateColor(frame, [0, 450, 720], ["#2a7abf", "#c06010", "#0a1828"]);
  const riverStroke = interpolateColor(frame, [0, 450, 720], ["#a0d8f0", "#f0a040", "#1a3848"]);

  // ── Turbine — s'arrête la nuit ────────────────────────────────────────────
  const turbineSpeed = cl(frame, 720, 900, 1, 0);  // 0 = arrêtée
  const turbineAngle = (frame * 0.4 * turbineSpeed) % 360;
  const turbineFill  = interpolateColor(frame, [0, 720, 900], ["#a0a8b0", "#c8a060", "#5a4020"]);
  const turbineCenter = interpolateColor(frame, [0, 720], ["#d8e0e8", "#f2a020"]);

  // ── Câble (toujours allumé or — il part quand même) ──────────────────────
  const cableGlow = 0.12 + osc(frame, 45, 0.06);

  // ── Pylône (jour=acier, nuit=ocre sombre) ────────────────────────────────
  const pyloneColor = interpolateColor(frame, [0, 720], ["#b0b8c0", "#c8a060"]);

  // ── Nuages (disparaissent au crépuscule) ─────────────────────────────────
  const cloudOp = cl(frame, 390, 540, 1, 0);
  // Mouvement lent des nuages
  const cloudDx = frame * 0.08;

  // ── Étoiles (apparaissent la nuit) ───────────────────────────────────────
  const starsOp = cl(frame, 700, 820, 0, 1);

  // ── Bougies (apparaissent la nuit, fenêtres éteintes le jour) ────────────
  const bougieOp  = cl(frame, 750, 880, 0, 1);
  const bougieFlicker = 0.7 + osc(frame, 7, 0.15) + osc(frame, 13, 0.1, 1.2);

  // ── Ambiance nocturne (rougeoiement turbine arrêtée) ─────────────────────
  const braiseOp = cl(frame, 720, 900, 0, 0.4);

  // ── Sous-titres ───────────────────────────────────────────────────────────
  const activeSub = SUBS.find(s => frame >= s.in && frame <= s.out);
  const subOp = activeSub
    ? interpolate(frame,
        [activeSub.in, activeSub.in + 15, activeSub.out - 15, activeSub.out],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={skyTop}/>
            <stop offset="100%" stopColor={skyBot}/>
          </linearGradient>
          {/* Halo soleil */}
          <radialGradient id="sunH" cx={sunX} cy={sunY} r="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff8d0" stopOpacity={sunOp * 0.4}/>
            <stop offset="100%" stopColor={skyTop} stopOpacity="0"/>
          </radialGradient>
          {/* Lueur rouge-braise turbine arrêtée */}
          <radialGradient id="braiseG" cx="300" cy="480" r="700" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c04020" stopOpacity={braiseOp}/>
            <stop offset="100%" stopColor="#000" stopOpacity="0"/>
          </radialGradient>
          {/* Halo bougie */}
          <radialGradient id="cg1" cx="1535" cy="610" r="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffcc60" stopOpacity={bougieOp * 0.6 * bougieFlicker}/>
            <stop offset="100%" stopColor="#ffcc60" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="cg2" cx="1658" cy="580" r="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffcc60" stopOpacity={bougieOp * 0.55 * bougieFlicker}/>
            <stop offset="100%" stopColor="#ffcc60" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="cg3" cx="1760" cy="595" r="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffcc60" stopOpacity={bougieOp * 0.5 * bougieFlicker}/>
            <stop offset="100%" stopColor="#ffcc60" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="cg4" cx="1852" cy="590" r="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffcc60" stopOpacity={bougieOp * 0.5 * bougieFlicker}/>
            <stop offset="100%" stopColor="#ffcc60" stopOpacity="0"/>
          </radialGradient>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="12" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="20"/>
          </filter>
        </defs>

        {/* ── FOND / CIEL ── */}
        <rect width={W} height={H} fill={`url(#skyG)`} opacity={jourProgress}/>
        <rect width={W} height={H} fill="url(#sunH)"/>
        <rect width={W} height={H} fill="url(#braiseG)"/>

        {/* ── ÉTOILES ── */}
        {STARS.map((s, i) => (
          <circle key={i} cx={s[0]} cy={s[1]} r={s[2]}
            fill="white" opacity={starsOp * (0.5 + osc(frame, 60 + i * 7, 0.4, i))}/>
        ))}

        {/* ── LUNE ── */}
        <circle cx={moonX} cy={moonY} r={38} fill="#e8e0c8" opacity={moonOp}/>
        <circle cx={moonX + 12} cy={moonY - 8} r={30} fill={skyTop} opacity={moonOp}/>

        {/* ── SOLEIL ── */}
        <circle cx={sunX} cy={sunY} r={sunR + 28} fill="#fff8c0" opacity={sunOp * 0.2}/>
        <circle cx={sunX} cy={sunY} r={sunR} fill="#fff5a0" opacity={sunOp}/>

        {/* ── NUAGES ── */}
        <g opacity={cloudOp}>
          <g transform={`translate(${cloudDx},0)`}>
            <ellipse cx="720" cy="140" rx="130" ry="48" fill="white"/>
            <ellipse cx="620" cy="158" rx="80" ry="38" fill="white"/>
            <ellipse cx="830" cy="162" rx="90" ry="36" fill="white"/>
            <ellipse cx="720" cy="170" rx="140" ry="36" fill="white"/>
          </g>
          <g transform={`translate(${cloudDx * 0.6},0)`}>
            <ellipse cx="200" cy="200" rx="80" ry="30" fill="white"/>
            <ellipse cx="140" cy="212" rx="50" ry="24" fill="white"/>
            <ellipse cx="260" cy="215" rx="60" ry="26" fill="white"/>
          </g>
          <g transform={`translate(${cloudDx * 0.8},0)`}>
            <ellipse cx="1200" cy="170" rx="100" ry="36" fill="white"/>
            <ellipse cx="1110" cy="184" rx="68" ry="28" fill="white"/>
            <ellipse cx="1290" cy="186" rx="72" ry="28" fill="white"/>
          </g>
        </g>

        {/* ── TERRAIN ── */}
        <path d={`M0 560 Q 400 520 960 575 T 1920 530 L 1920 ${H} L 0 ${H} Z`} fill={grassA} opacity="0.55"/>
        <path d={`M0 630 Q 500 680 1000 610 T 1920 650 L 1920 ${H} L 0 ${H} Z`} fill={grassB} opacity="0.85"/>
        <path d={`M0 690 Q 600 650 1200 720 T 1920 700 L 1920 ${H} L 0 ${H} Z`} fill={grassC} opacity="0.75"/>

        {/* ── FLEUVE ── */}
        <path d={`M0 ${720 + osc(frame, 180, 6)} C 400 740 800 700 1920 760 L 1920 ${H} L 0 ${H} Z`}
          fill={riverColor}/>
        {/* Lignes de surface ondulantes */}
        {[0, 1, 2].map(i => (
          <path key={i}
            d={`M ${100 + i * 200} ${760 + i * 60 + osc(frame, 90 + i * 20, 4, i)}
                Q ${400 + i * 200} ${760 + i * 60 + osc(frame, 70 + i * 15, 5, i + 1)}
                  ${700 + i * 200} ${760 + i * 60 + osc(frame, 80 + i * 18, 4, i + 2)}`}
            stroke={riverStroke} strokeWidth="2" fill="none" opacity="0.5"/>
        ))}
        {/* Reflet soleil/lune sur fleuve */}
        <ellipse cx={sunX * 0.5 + 480} cy="810" rx={cl(frame, 0, 450, 120, 60)} ry="15"
          fill={frame < 720 ? "#d0f0ff" : "#a0c8f0"} opacity="0.2" filter="url(#blur)"/>

        {/* ── BARRAGE ── */}
        <rect x="275" y="290" width="50" height="460"
          fill={interpolateColor(frame, [0, 720], ["#b0b8a8", "#4a3a28"])}/>
        <rect x="275" y="290" width="50" height="460" fill="none"
          stroke={interpolateColor(frame, [0, 720], ["#909888", "#2a2018"])} strokeWidth="2"/>
        {[380, 470, 560, 650].map(y => (
          <line key={y} x1="275" y1={y} x2="325" y2={y}
            stroke={interpolateColor(frame, [0, 720], ["#909888", "#2a2018"])} strokeWidth="1" opacity="0.5"/>
        ))}

        {/* ── TURBINE corps ── */}
        <ellipse cx="300" cy="600" rx="180" ry="60" fill={interpolateColor(frame, [0, 720], ["#808898", "#3a2a18"])}/>
        <rect x="120" y="500" width="360" height="100" fill={interpolateColor(frame, [0, 720], ["#909898", "#4a3020"])}/>

        {/* ── ROUE turbine (tourne, ralentit la nuit) ── */}
        <g transform={`translate(300,500) rotate(${turbineAngle})`}>
          <circle cx="0" cy="0" r="200" fill={turbineFill} stroke={interpolateColor(frame, [0, 720], ["#606870", "#2a1a08"])} strokeWidth="3"/>
          <circle cx="0" cy="0" r="170" fill="none" stroke={interpolateColor(frame, [0, 720], ["#606870", "#2a1a08"])} strokeWidth="2"/>
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
            <path key={angle}
              d="M -12 -40 L -20 -168 A 168 168 0 0 1 20 -168 L 12 -40 Z"
              fill={interpolateColor(frame, [0, 720], ["#9098a8", "#6a5030"])}
              stroke={interpolateColor(frame, [0, 720], ["#606870", "#2a1a08"])}
              strokeWidth="2"
              transform={`rotate(${angle})`}/>
          ))}
          {/* Centre moyeu */}
          <circle cx="0" cy="0" r="50" fill={turbineCenter} opacity="0.4"/>
          <circle cx="0" cy="0" r="30" fill={turbineCenter}/>
          {/* Reflet si jour */}
          <circle cx="-8" cy="-8" r="10" fill="white" opacity={cl(frame, 0, 720, 0.5, 0)}/>
          {/* Glow or si nuit */}
          <circle cx="0" cy="0" r="40" fill="#f2a020"
            opacity={cl(frame, 720, 900, 0, 0.5) * (0.4 + osc(frame, 25, 0.15))} filter="url(#glow)"/>
        </g>

        {/* Reflet turbine dans l'eau */}
        <ellipse cx="300" cy="870" rx="150" ry="38"
          fill={frame < 720 ? "#8ab0d0" : "#f2a020"}
          opacity={frame < 720 ? 0.15 : cl(frame, 720, 900, 0, 0.12)}
          filter="url(#blur)"/>

        {/* ── PYLÔNE ── */}
        <g>
          <rect x="1020" y="750" width="40" height="20" fill={pyloneColor}/>
          <rect x="1180" y="750" width="40" height="20" fill={pyloneColor}/>
          <g stroke={pyloneColor} strokeWidth="1.5" opacity="0.8">
            {PYLON_DIAGS.map((d, i) => <line key={i} {...d}/>)}
          </g>
          {PYLON_CROSS.map((d, i) => <line key={i} {...d} stroke={pyloneColor} strokeWidth="3"/>)}
          <line x1="1040" y1="750" x2="1120" y2="80" stroke={pyloneColor} strokeWidth="5"/>
          <line x1="1200" y1="750" x2="1120" y2="80" stroke={pyloneColor} strokeWidth="5"/>
          <rect x="1100" y="70" width="40" height="12" fill={pyloneColor}/>
          <line x1="1060" y1="340" x2="1180" y2="340" stroke={pyloneColor} strokeWidth="5"/>
          {/* Reflet soleil sur pylône côté droit */}
          <line x1="1200" y1="750" x2="1120" y2="80" stroke="white" strokeWidth="1.5"
            opacity={cl(frame, 0, 450, 0.3, 0)}/>
        </g>

        {/* ── CÂBLE ÉLECTRIQUE (toujours allumé, il part quand même) ── */}
        <path d="M 480 490 C 750 320 980 280 1120 340 C 1360 420 1600 500 1920 540"
          stroke="#e8c030" strokeWidth="22" fill="none" opacity={cableGlow}/>
        <path d="M 480 490 C 750 320 980 280 1120 340 C 1360 420 1600 500 1920 540"
          stroke="#e8c030" strokeWidth="7" fill="none"/>
        {/* Reflet jour sur câble */}
        <path d="M 480 490 C 750 320 980 280 1120 340 C 1360 420 1600 500 1920 540"
          stroke="white" strokeWidth="2" fill="none" opacity={cl(frame, 0, 450, 0.35, 0.1)}/>

        {/* Isolateurs */}
        {INSULATORS.map((ins, i) => (
          <g key={i} transform={`translate(${ins.x},${ins.y}) rotate(${ins.r})`}>
            <rect x="-4" y="-15" width="8" height="30"
              fill={interpolateColor(frame, [0, 720], ["#c0c8d0", "#c8a060"])}/>
            {[-10, 0, 10].map(cy => (
              <circle key={cy} cx="0" cy={cy} r="5"
                fill={interpolateColor(frame, [0, 720], ["#e8ecf0", "#1a1008"])}
                stroke={interpolateColor(frame, [0, 720], ["#8090a0", "#c8a060"])}
                strokeWidth="1.5"/>
            ))}
          </g>
        ))}

        {/* ── HALOS BOUGIES ── */}
        <rect width={W} height={H} fill="url(#cg1)"/>
        <rect width={W} height={H} fill="url(#cg2)"/>
        <rect width={W} height={H} fill="url(#cg3)"/>
        <rect width={W} height={H} fill="url(#cg4)"/>

        {/* ── VILLAGE ── */}
        {HOUSES.map((h, hi) => (
          <g key={hi} transform={`translate(${h.x},${h.y})`}>
            <ellipse cx={h.w / 2} cy={h.h + 12} rx={h.w * 0.65} ry="10"
              fill={nuitProgress > 0.5 ? "#0a0502" : "#2a4010"} opacity="0.3"/>
            {/* Corps */}
            <rect x="0" y={h.ry} width={h.w} height={h.h}
              fill={interpolateColor(frame, [0, 720], [h.dayWall, h.nightWall])}
              stroke="#a88840" strokeWidth="1.5"/>
            {/* Toit */}
            <rect x={-8} y={h.ry - 14} width={h.w + 16} height={18}
              fill={interpolateColor(frame, [0, 720], ["#c04020", "#4a2010"])}
              stroke={interpolateColor(frame, [0, 720], ["#902010", "#2a1008"])} strokeWidth="1.5"/>
            <rect x={-8} y={h.ry - 20} width={h.w + 16} height={8}
              fill={interpolateColor(frame, [0, 720], ["#902010", "#2a1008"])}/>
            {/* Fenêtres */}
            {h.wins.map((w, wi) => (
              <g key={wi}>
                <rect x={w[0]} y={w[1]} width={w[2]} height={w[3]}
                  fill="#1a1208" stroke="#a88840" strokeWidth="1"/>
                {/* Bougie la nuit */}
                <ellipse cx={w[0] + w[2] / 2} cy={w[1] + w[3] - 6}
                  rx="4" ry="6"
                  fill="#ffcc60"
                  opacity={bougieOp * bougieFlicker * 0.7}/>
                <ellipse cx={w[0] + w[2] / 2} cy={w[1] + w[3] - 9}
                  rx="2.5" ry="4"
                  fill="#fff0a0"
                  opacity={bougieOp * 0.9}/>
                {/* Croisillon fenêtre */}
                <line x1={w[0] + w[2] / 2} y1={w[1]} x2={w[0] + w[2] / 2} y2={w[1] + w[3]}
                  stroke="#1a1008" strokeWidth="0.8"/>
                <line x1={w[0]} y1={w[1] + w[3] / 2} x2={w[0] + w[2]} y2={w[1] + w[3] / 2}
                  stroke="#1a1008" strokeWidth="0.8"/>
              </g>
            ))}
            {/* Porte */}
            <rect x={h.door[0]} y={h.door[1]} width={h.door[2]} height={h.door[3]}
              fill={h.doorColor} stroke="#a88840" strokeWidth="1"/>
          </g>
        ))}

        {/* Palmiers */}
        {PALMS.map((p, i) => (
          <g key={i} transform={`translate(${p.x},${p.y})`}>
            <line x1="0" y1={p.h} x2={osc(frame, 120, 3, i)} y2="0"
              stroke="#5a3810" strokeWidth={p.thick}/>
            <ellipse cx={osc(frame, 120, 3, i)} cy="0" rx={p.rx} ry={p.ry}
              fill={interpolateColor(frame, [0, 720], ["#3a7a20", "#2a5015"])} opacity="0.9"/>
            <ellipse cx={osc(frame, 120, 3, i) - p.rx * 0.7} cy={p.ry * 0.6}
              rx={p.rx * 0.8} ry={p.ry * 0.65}
              fill={interpolateColor(frame, [0, 720], ["#4a8a28", "#3a6018"])}
              opacity="0.8" transform={`rotate(-28,${osc(frame, 120, 3, i) - p.rx * 0.7},${p.ry * 0.6})`}/>
            <ellipse cx={osc(frame, 120, 3, i) + p.rx * 0.7} cy={p.ry * 0.6}
              rx={p.rx * 0.8} ry={p.ry * 0.65}
              fill={interpolateColor(frame, [0, 720], ["#4a8a28", "#3a6018"])}
              opacity="0.8" transform={`rotate(28,${osc(frame, 120, 3, i) + p.rx * 0.7},${p.ry * 0.6})`}/>
          </g>
        ))}

        {/* Ligne de sol village */}
        <path d="M 1470 700 C 1580 690 1700 705 1895 695"
          fill="none"
          stroke={interpolateColor(frame, [0, 720], ["#5a8a30", "#3a2810"])}
          strokeWidth="1.5" opacity="0.4"/>

        {/* ── FLÈCHE NARRATIVE câble ── */}
        <path d={`M 1870 ${510 + osc(frame, 30, 3)} L 1910 ${518 + osc(frame, 30, 3)} L 1870 ${526 + osc(frame, 30, 3)}`}
          fill="none" stroke="#e8c030" strokeWidth="3.5" strokeLinejoin="round"
          opacity={0.6 + osc(frame, 30, 0.3)}/>

        {/* ── SOUS-TITRES ── */}
        {subOp > 0 && activeSub && (
          <g>
            {/* Fond sous-titre */}
            <rect x="200" y={H - 120} width={W - 400} height={70} rx="6"
              fill="#000" opacity={subOp * 0.65}/>
            <text
              x={W / 2} y={H - 72}
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontSize="34"
              fill="white"
              opacity={subOp}
              style={{ letterSpacing: "0.02em" }}>
              {activeSub.text}
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ── Interpolation couleur hex ──────────────────────────────────────────────────
function hexToRgb(h: string) {
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  return [r, g, b];
}
function interpolateColor(frame: number, frames: number[], colors: string[]) {
  if (frame <= frames[0]) return colors[0];
  if (frame >= frames[frames.length - 1]) return colors[colors.length - 1];
  for (let i = 0; i < frames.length - 1; i++) {
    if (frame >= frames[i] && frame <= frames[i + 1]) {
      const t = (frame - frames[i]) / (frames[i + 1] - frames[i]);
      const [r1, g1, b1] = hexToRgb(colors[i]);
      const [r2, g2, b2] = hexToRgb(colors[i + 1]);
      const r = Math.round(r1 + (r2 - r1) * t);
      const g = Math.round(g1 + (g2 - g1) * t);
      const b = Math.round(b1 + (b2 - b1) * t);
      return `rgb(${r},${g},${b})`;
    }
  }
  return colors[colors.length - 1];
}

// ── Données statiques ─────────────────────────────────────────────────────────
const STARS: [number, number, number][] = [
  [120,60,1.5],[280,40,1],[450,80,2],[600,30,1.5],[780,55,1],[950,25,2],
  [1100,70,1.5],[1300,45,1],[1450,65,2],[1600,35,1.5],[1750,80,1],[1850,50,1.5],
  [200,130,1],[400,110,1.5],[700,100,1],[900,120,2],[1150,90,1.5],[1380,115,1],
  [1550,105,1.5],[1700,95,1],[350,170,1],[800,160,1.5],[1250,150,1],[1650,175,2],
];

const PYLON_DIAGS = [
  { x1:1040,y1:750,x2:1182,y2:600 },{ x1:1200,y1:750,x2:1058,y2:600 },
  { x1:1058,y1:600,x2:1168,y2:480 },{ x1:1182,y1:600,x2:1072,y2:480 },
  { x1:1072,y1:480,x2:1154,y2:360 },{ x1:1168,y1:480,x2:1086,y2:360 },
  { x1:1086,y1:360,x2:1139,y2:240 },{ x1:1154,y1:360,x2:1101,y2:240 },
  { x1:1101,y1:240,x2:1125,y2:120 },{ x1:1139,y1:240,x2:1115,y2:120 },
];
const PYLON_CROSS = [
  { x1:1058,y1:600,x2:1182,y2:600 },{ x1:1072,y1:480,x2:1168,y2:480 },
  { x1:1086,y1:360,x2:1154,y2:360 },{ x1:1101,y1:240,x2:1139,y2:240 },
];
const INSULATORS = [
  { x:650,y:385,r:-20 },{ x:900,y:295,r:5 },
  { x:1120,y:340,r:15 },{ x:1400,y:440,r:20 },{ x:1700,y:515,r:10 },
];

const HOUSES = [
  {
    x:1480, y:570, w:110, h:90, ry:20,
    dayWall:"#d4b888", nightWall:"#4a3020",
    wins:[[12,40,28,28],[70,40,28,28]],
    door:[42,72,26,38], doorColor:"#1a3a8a",
  },
  {
    x:1610, y:540, w:84, h:76, ry:16,
    dayWall:"#c8a870", nightWall:"#422a18",
    wins:[[10,32,22,22],[52,32,22,22]],
    door:[31,60,22,32], doorColor:"#1a6030",
  },
  {
    x:1720, y:555, w:76, h:66, ry:14,
    dayWall:"#c0a060", nightWall:"#3c2416",
    wins:[[8,28,20,18],[48,28,20,18]],
    door:[28,52,20,28], doorColor:"#1a3a8a",
  },
  {
    x:1820, y:565, w:60, h:58, ry:12,
    dayWall:"#b89858", nightWall:"#38210f",
    wins:[[8,22,16,14],[36,22,16,14]],
    door:[22,44,16,26], doorColor:"#206040",
  },
];

const PALMS = [
  { x:1590, y:700, h:140, rx:22, ry:12, thick:5 },
  { x:1710, y:688, h:130, rx:18, ry:10, thick:4 },
  { x:1810, y:695, h:125, rx:16, ry:9, thick:4 },
];
