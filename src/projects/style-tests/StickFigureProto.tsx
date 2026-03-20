import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

// ============================================================
// STICK FIGURE PROTO — Evolution du stick figure
//
// Seg 1 (0-299f)    : Niveau 1 — Stick figure basique, ancrage sol correct
// Seg 2 (300-599f)  : Niveau 2 — Proportions expressives (4 archetyypes)
// Seg 3 (600-899f)  : Niveau 3 — Epaisseur variable + ombre sol
// Seg 4 (900-1199f) : Niveau 4 — Expressions faciales minimales
// Seg 5 (1200-1499f): Niveau 5 — Postures narratives avec spring() interpolation
// Seg 6 (1500-1799f): Niveau 6 — Silhouette partielle + deformation maladie
//
// 1800 frames @ 30fps = 60 secondes
// ============================================================

const W = 1920;
const H = 1080;
const SEG = 300;
const GY = 760;  // Ground Y — ligne de sol

const C = {
  parchment:  "#F5E6C8",
  parchmentD: "#E8D4A8",
  parchmentDD:"#D4B896",
  ink:        "#1A1008",
  inkLight:   "#6B5030",
  gold:       "#C9A227",
  goldDark:   "#8B6914",
  vermillon:  "#C1392B",
  shadow:     "rgba(26,16,8,0.12)",
} as const;

// ── Helpers ─────────────────────────────────────────────────

function SegLabel({ text, sub }: { text: string; sub: string }) {
  return (
    <g>
      <rect x={40} y={40} width={640} height={90} rx={6} fill={C.ink} opacity={0.88} />
      <text x={60} y={88} fontFamily="Georgia, serif" fontSize={28}
        fill={C.parchment} fontWeight="bold">{text}</text>
      <text x={60} y={118} fontFamily="Georgia, serif" fontSize={17}
        fill={C.parchmentD}>{sub}</text>
    </g>
  );
}

function Caption({ text }: { text: string }) {
  return (
    <text x={W / 2} y={H - 38} textAnchor="middle"
      fontFamily="Georgia, serif" fontSize={20}
      fill={C.inkLight} fontStyle="italic">{text}</text>
  );
}

function ParchBg() {
  return (
    <>
      <rect width={W} height={H} fill={C.parchment} />
      <rect x={30} y={30} width={W - 60} height={H - 60}
        fill="none" stroke={C.inkLight} strokeWidth={2} opacity={0.3} />
    </>
  );
}

// Sol avec ligne + pavés
function Ground() {
  return (
    <>
      <line x1={60} y1={GY} x2={W - 60} y2={GY} stroke={C.ink} strokeWidth={2.5} />
      {Array.from({ length: 28 }, (_, i) => (
        <rect key={i}
          x={60 + i * 66} y={GY + 8}
          width={50 + (i * 11) % 22} height={14} rx={3}
          fill="none" stroke={C.inkLight} strokeWidth={1} opacity={0.3} />
      ))}
    </>
  );
}

// Label sous un personnage
function CharLabel({ x, text, sub }: { x: number; text: string; sub?: string }) {
  return (
    <g>
      <text x={x} y={GY + 36} textAnchor="middle"
        fontFamily="Georgia, serif" fontSize={18}
        fill={C.ink} fontWeight="bold">{text}</text>
      {sub && (
        <text x={x} y={GY + 56} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={14}
          fill={C.inkLight} fontStyle="italic">{sub}</text>
      )}
    </g>
  );
}

// ============================================================
// NIVEAU 1 — Stick figure basique, ancrage sol correct
// Le pivot de scale est le sol (translate->scale->draw from 0)
// ============================================================

interface StickBasicProps {
  x: number;
  frame: number;
  phase?: number;
  scale?: number;
  walking?: boolean;
  color?: string;
}

function StickBasic({ x, frame, phase = 0, scale = 1, walking = true, color = C.ink }: StickBasicProps) {
  const f = frame + phase;
  const cycle = f / 12;
  const bob = walking ? Math.abs(Math.sin(cycle)) * 4 : 0;
  const la = walking ? Math.sin(cycle) * 28 : 0;
  const ra = walking ? Math.sin(cycle + Math.PI) * 28 : 0;
  const ll = walking ? Math.sin(cycle + Math.PI) * 26 : 0;
  const rl = walking ? Math.sin(cycle) * 26 : 0;

  const headR = 20;
  const neckLen = 10;
  const torsoLen = 55;
  const armLen = 48;
  const legLen = 60;

  // Tout est relatif a y=0 = sol
  // Tete au sommet de la colonne
  const totalH = headR * 2 + neckLen + torsoLen + legLen;
  const headCY = -(totalH - headR) - bob;
  const neckY  = headCY + headR;
  const shoulderY = neckY + neckLen;
  const hipY = shoulderY + torsoLen;

  return (
    // translate(x, GY) pose les pieds au sol
    // scale depuis GY => vers le haut uniquement
    <g transform={`translate(${x}, ${GY}) scale(${scale})`}>
      {/* Ombre sous les pieds — ancrage visuel */}
      <ellipse cx={0} cy={0} rx={18 * scale} ry={5}
        fill={C.shadow} transform={`scale(${1 / scale},1)`} />

      {/* Jambe gauche */}
      <g transform={`translate(-7,${hipY}) rotate(${ll},0,0)`}>
        <line x1={0} y1={0} x2={0} y2={legLen}
          stroke={color} strokeWidth={3} strokeLinecap="round" />
      </g>
      {/* Jambe droite */}
      <g transform={`translate(7,${hipY}) rotate(${rl},0,0)`}>
        <line x1={0} y1={0} x2={0} y2={legLen}
          stroke={color} strokeWidth={3} strokeLinecap="round" />
      </g>

      {/* Torse */}
      <line x1={0} y1={shoulderY} x2={0} y2={hipY}
        stroke={color} strokeWidth={3} strokeLinecap="round" />

      {/* Bras gauche */}
      <g transform={`translate(0,${shoulderY}) rotate(${la},0,0)`}>
        <line x1={0} y1={0} x2={-armLen * 0.7} y2={armLen * 0.7}
          stroke={color} strokeWidth={3} strokeLinecap="round" />
      </g>
      {/* Bras droit */}
      <g transform={`translate(0,${shoulderY}) rotate(${ra},0,0)`}>
        <line x1={0} y1={0} x2={armLen * 0.7} y2={armLen * 0.7}
          stroke={color} strokeWidth={3} strokeLinecap="round" />
      </g>

      {/* Cou */}
      <line x1={0} y1={neckY} x2={0} y2={shoulderY}
        stroke={color} strokeWidth={3} strokeLinecap="round" />

      {/* Tete */}
      <circle cx={0} cy={headCY} r={headR}
        fill="none" stroke={color} strokeWidth={3} />
    </g>
  );
}

function Seg1Basic({ lf, frame }: { lf: number; frame: number }) {
  const fadeIn = interpolate(lf, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={fadeIn}>
      <ParchBg />
      <Ground />
      {/* 5 personnages qui marchent, tous ancrés au sol */}
      <StickBasic x={240}  frame={frame} phase={0}   scale={1.0} />
      <StickBasic x={560}  frame={frame} phase={40}  scale={1.0} />
      <StickBasic x={880}  frame={frame} phase={80}  scale={1.0} />
      <StickBasic x={1200} frame={frame} phase={120} scale={1.0} />
      <StickBasic x={1520} frame={frame} phase={160} scale={1.0} />
      {/* Un statique */}
      <StickBasic x={760}  frame={frame} walking={false} />
      <SegLabel text="NIVEAU 1 — Stick figure basique" sub="Ancrage sol correct : translate(x, GY) -> scale -> draw from 0" />
      <Caption text="Le pivot de scale est le sol — les personnages ne flottent jamais" />
    </g>
  );
}

// ============================================================
// NIVEAU 2 — Proportions expressives
// Meme systeme, ratios differents = archetyypes immédiats
// ============================================================

interface StickTypedProps {
  x: number;
  frame: number;
  phase?: number;
  // Ratios
  headR?: number;
  shoulderW?: number;
  torsoLen?: number;
  legLen?: number;
  hasBelly?: boolean;
  backCurve?: number;   // degres de courbure du dos
  color?: string;
  strokeW?: number;
}

function StickTyped({
  x, frame, phase = 0,
  headR = 20, shoulderW = 0, torsoLen = 55, legLen = 60,
  hasBelly = false, backCurve = 0,
  color = C.ink, strokeW = 3,
}: StickTypedProps) {
  const f = frame + phase;
  const cycle = f / 12;
  const bob = Math.abs(Math.sin(cycle)) * 4;
  const la = Math.sin(cycle) * 28;
  const ra = Math.sin(cycle + Math.PI) * 28;
  const ll = Math.sin(cycle + Math.PI) * 26;
  const rl = Math.sin(cycle) * 26;

  const neckLen = 10;
  const armLen = 48;
  const totalH = headR * 2 + neckLen + torsoLen + legLen;
  const headCY = -(totalH - headR) - bob;
  const neckY = headCY + headR;
  const shoulderY = neckY + neckLen;
  const hipY = shoulderY + torsoLen;
  const sw = shoulderW;  // ecart epaules

  return (
    <g transform={`translate(${x}, ${GY})`}>
      <ellipse cx={0} cy={0} rx={20} ry={5} fill={C.shadow} />

      {/* Jambes */}
      <g transform={`translate(-9,${hipY}) rotate(${ll},0,0)`}>
        <line x1={0} y1={0} x2={0} y2={legLen} stroke={color} strokeWidth={strokeW} strokeLinecap="round" />
      </g>
      <g transform={`translate(9,${hipY}) rotate(${rl},0,0)`}>
        <line x1={0} y1={0} x2={0} y2={legLen} stroke={color} strokeWidth={strokeW} strokeLinecap="round" />
      </g>

      {/* Torse — courbure possible */}
      {backCurve === 0 ? (
        <line x1={0} y1={shoulderY} x2={0} y2={hipY}
          stroke={color} strokeWidth={strokeW} strokeLinecap="round" />
      ) : (
        <path d={`M ${-backCurve} ${shoulderY} Q ${-backCurve * 2} ${(shoulderY + hipY) / 2} ${-backCurve} ${hipY}`}
          stroke={color} strokeWidth={strokeW} fill="none" strokeLinecap="round" />
      )}

      {/* Ventre */}
      {hasBelly && (
        <ellipse cx={0} cy={(shoulderY + hipY) / 2} rx={16} ry={12}
          fill="none" stroke={color} strokeWidth={strokeW - 1} opacity={0.6} />
      )}

      {/* Bras (avec ecartement epaules) */}
      <g transform={`translate(${-sw},${shoulderY}) rotate(${la},0,0)`}>
        <line x1={0} y1={0} x2={-armLen * 0.7} y2={armLen * 0.7}
          stroke={color} strokeWidth={strokeW} strokeLinecap="round" />
      </g>
      <g transform={`translate(${sw},${shoulderY}) rotate(${ra},0,0)`}>
        <line x1={0} y1={0} x2={armLen * 0.7} y2={armLen * 0.7}
          stroke={color} strokeWidth={strokeW} strokeLinecap="round" />
      </g>

      {/* Cou */}
      <line x1={0} y1={neckY} x2={0} y2={shoulderY}
        stroke={color} strokeWidth={strokeW} strokeLinecap="round" />

      {/* Tete */}
      <circle cx={0} cy={headCY} r={headR}
        fill="none" stroke={color} strokeWidth={strokeW} />
    </g>
  );
}

function Seg2Types({ lf, frame }: { lf: number; frame: number }) {
  const fadeIn = interpolate(lf, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const labelIn = interpolate(lf, [20, 45], [0, 1], { extrapolateRight: "clamp" });

  return (
    <g opacity={fadeIn}>
      <ParchBg />
      <Ground />

      {/* Enfant — tete grosse, corps court */}
      <StickTyped x={240} frame={frame} phase={0}
        headR={26} torsoLen={38} legLen={40} strokeW={2.5} />
      <g opacity={labelIn}>
        <CharLabel x={240} text="Enfant" sub="tete grosse, corps court" />
      </g>

      {/* Guerrier — epaules larges, jambes longues */}
      <StickTyped x={560} frame={frame} phase={40}
        headR={18} shoulderW={18} torsoLen={62} legLen={72} strokeW={4} />
      <g opacity={labelIn}>
        <CharLabel x={560} text="Guerrier" sub="epaules larges, jambes longues" />
      </g>

      {/* Marchand — ventre, tete normale */}
      <StickTyped x={880} frame={frame} phase={80}
        headR={22} torsoLen={60} legLen={55} hasBelly strokeW={3} />
      <g opacity={labelIn}>
        <CharLabel x={880} text="Marchand" sub="ventre, demarche lourde" />
      </g>

      {/* Vieillard — dos courbe, petite tete, jambes courtes */}
      <StickTyped x={1200} frame={frame} phase={120}
        headR={17} torsoLen={48} legLen={44} backCurve={12} strokeW={2.5} />
      <g opacity={labelIn}>
        <CharLabel x={1200} text="Vieillard" sub="dos courbe, pas lent" />
      </g>

      {/* Noble — tete fine, corps droit, jambes longues */}
      <StickTyped x={1520} frame={frame} phase={160}
        headR={19} shoulderW={8} torsoLen={68} legLen={78} strokeW={3.5} />
      <g opacity={labelIn}>
        <CharLabel x={1520} text="Noble" sub="stature elevee, port droit" />
      </g>

      <SegLabel text="NIVEAU 2 — Proportions expressives"
        sub="Meme systeme — ratios differents = archetyypes immediats, sans dessin" />
      <Caption text="Seuls headR, torsoLen, legLen, shoulderW changent" />
    </g>
  );
}

// ============================================================
// NIVEAU 3 — Epaisseur variable + ombre sol
// strokeWidth varie selon la partie : torse > membres > extremites
// ============================================================

interface StickWeightedProps {
  x: number;
  frame: number;
  phase?: number;
  scale?: number;
  color?: string;
  walking?: boolean;
}

function StickWeighted({ x, frame, phase = 0, scale = 1, color = C.ink, walking = true }: StickWeightedProps) {
  const f = frame + phase;
  const cycle = f / 12;
  const bob = walking ? Math.abs(Math.sin(cycle)) * 4 : 0;
  const la = walking ? Math.sin(cycle) * 28 : 0;
  const ra = walking ? Math.sin(cycle + Math.PI) * 28 : 0;
  const ll = walking ? Math.sin(cycle + Math.PI) * 26 : 0;
  const rl = walking ? Math.sin(cycle) * 26 : 0;

  const headR = 22;
  const neckLen = 10;
  const torsoLen = 58;
  const armLen = 50;
  const legLen = 62;
  const totalH = headR * 2 + neckLen + torsoLen + legLen;
  const headCY = -(totalH - headR) - bob;
  const neckY = headCY + headR;
  const shoulderY = neckY + neckLen;
  const hipY = shoulderY + torsoLen;

  return (
    <g transform={`translate(${x}, ${GY}) scale(${scale})`}>
      {/* Ombre progressive — plus large = plus de poids */}
      <ellipse cx={0} cy={2} rx={26} ry={7} fill={C.shadow} />

      {/* Jambes — epaisseur moyenne */}
      <g transform={`translate(-9,${hipY}) rotate(${ll},0,0)`}>
        <line x1={0} y1={0} x2={0} y2={legLen - 12}
          stroke={color} strokeWidth={4} strokeLinecap="round" />
        {/* Pied = ligne epaisse courte = "chaussure" */}
        <line x1={0} y1={legLen - 12} x2={-12} y2={legLen}
          stroke={color} strokeWidth={5} strokeLinecap="round" />
      </g>
      <g transform={`translate(9,${hipY}) rotate(${rl},0,0)`}>
        <line x1={0} y1={0} x2={0} y2={legLen - 12}
          stroke={color} strokeWidth={4} strokeLinecap="round" />
        <line x1={0} y1={legLen - 12} x2={12} y2={legLen}
          stroke={color} strokeWidth={5} strokeLinecap="round" />
      </g>

      {/* Torse — le plus epais = centre de masse */}
      <line x1={0} y1={shoulderY} x2={0} y2={hipY}
        stroke={color} strokeWidth={6} strokeLinecap="round" />

      {/* Epaules — ligne horizontale pour la masse */}
      <line x1={-14} y1={shoulderY} x2={14} y2={shoulderY}
        stroke={color} strokeWidth={5} strokeLinecap="round" />

      {/* Bras — plus fins que le torse */}
      <g transform={`translate(-14,${shoulderY}) rotate(${la},0,0)`}>
        <line x1={0} y1={0} x2={0} y2={armLen - 10}
          stroke={color} strokeWidth={3} strokeLinecap="round" />
        {/* Main = point epais */}
        <circle cx={0} cy={armLen - 10} r={4} fill={color} />
      </g>
      <g transform={`translate(14,${shoulderY}) rotate(${ra},0,0)`}>
        <line x1={0} y1={0} x2={0} y2={armLen - 10}
          stroke={color} strokeWidth={3} strokeLinecap="round" />
        <circle cx={0} cy={armLen - 10} r={4} fill={color} />
      </g>

      {/* Cou — fin */}
      <line x1={0} y1={neckY} x2={0} y2={shoulderY}
        stroke={color} strokeWidth={3} strokeLinecap="round" />

      {/* Tete remplie — donne presence */}
      <circle cx={0} cy={headCY} r={headR}
        fill={C.parchmentD} stroke={color} strokeWidth={3} />

      {/* Jointures visibles = impression squelette */}
      <circle cx={0}   cy={hipY}     r={4} fill={color} />
      <circle cx={-14} cy={shoulderY} r={3} fill={color} />
      <circle cx={14}  cy={shoulderY} r={3} fill={color} />
    </g>
  );
}

function Seg3Weighted({ lf, frame }: { lf: number; frame: number }) {
  const fadeIn = interpolate(lf, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={fadeIn}>
      <ParchBg />
      <Ground />
      <StickWeighted x={240}  frame={frame} phase={0}   />
      <StickWeighted x={560}  frame={frame} phase={40}  />
      <StickWeighted x={880}  frame={frame} phase={80}  walking={false} />
      <StickWeighted x={1200} frame={frame} phase={120} />
      <StickWeighted x={1520} frame={frame} phase={160} />
      <SegLabel text="NIVEAU 3 — Epaisseur variable + jointures"
        sub="Torse 6px > bras 3px > cou 3px. Jointures visibles. Pieds articules." />
      <Caption text="Tete remplie + jointures = presence corporelle sans dessin detaille" />
    </g>
  );
}

// ============================================================
// NIVEAU 4 — Expressions faciales minimales
// ============================================================

type Emotion = "neutre" | "joie" | "peur" | "douleur" | "regard_gauche" | "mort";

interface FaceProps {
  cx: number;
  cy: number;
  r: number;
  emotion: Emotion;
  color?: string;
}

function Face({ cx, cy, r, emotion, color = C.ink }: FaceProps) {
  // Position des yeux selon emotion
  const eyeConfigs: Record<Emotion, { lx: number; ly: number; rx: number; ry: number; lr: number; rr: number }> = {
    neutre:       { lx: -r * 0.35, ly: -r * 0.1, rx: r * 0.35, ry: -r * 0.1, lr: 2.5, rr: 2.5 },
    joie:         { lx: -r * 0.35, ly: -r * 0.15, rx: r * 0.35, ry: -r * 0.15, lr: 2.5, rr: 2.5 },
    peur:         { lx: -r * 0.35, ly: -r * 0.05, rx: r * 0.35, ry: -r * 0.05, lr: 3.5, rr: 3.5 },
    douleur:      { lx: -r * 0.35, ly: -r * 0.05, rx: r * 0.35, ry: -r * 0.05, lr: 2.5, rr: 2.5 },
    regard_gauche:{ lx: -r * 0.45, ly: -r * 0.1,  rx: r * 0.25, ry: -r * 0.1,  lr: 2.5, rr: 2.5 },
    mort:         { lx: -r * 0.35, ly: -r * 0.1, rx: r * 0.35, ry: -r * 0.1, lr: 2.5, rr: 2.5 },
  };

  const ec = eyeConfigs[emotion];

  // Forme de la bouche selon emotion
  const mouths: Record<Emotion, React.ReactNode> = {
    neutre:
      <line x1={cx - r * 0.28} y1={cy + r * 0.35}
        x2={cx + r * 0.28} y2={cy + r * 0.35}
        stroke={color} strokeWidth={2} strokeLinecap="round" />,
    joie:
      <path d={`M ${cx - r * 0.3} ${cy + r * 0.25} Q ${cx} ${cy + r * 0.55} ${cx + r * 0.3} ${cy + r * 0.25}`}
        stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />,
    peur:
      <path d={`M ${cx - r * 0.28} ${cy + r * 0.38} Q ${cx} ${cy + r * 0.6} ${cx + r * 0.28} ${cy + r * 0.38}`}
        stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />,
    douleur:
      <path d={`M ${cx - r * 0.3} ${cy + r * 0.5} Q ${cx} ${cy + r * 0.28} ${cx + r * 0.3} ${cy + r * 0.5}`}
        stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />,
    regard_gauche:
      <path d={`M ${cx - r * 0.25} ${cy + r * 0.35} Q ${cx} ${cy + r * 0.48} ${cx + r * 0.25} ${cy + r * 0.35}`}
        stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />,
    mort:
      <>
        <line x1={cx - r * 0.3} y1={cy + r * 0.3} x2={cx - r * 0.1} y2={cy + r * 0.5}
          stroke={color} strokeWidth={2} strokeLinecap="round" />
        <line x1={cx + r * 0.1} y1={cy + r * 0.3} x2={cx + r * 0.3} y2={cy + r * 0.5}
          stroke={color} strokeWidth={2} strokeLinecap="round" />
      </>,
  };

  // Yeux croix pour mort
  const renderEyes = () => {
    if (emotion === "mort") {
      return (
        <>
          <line x1={cx + ec.lx - 4} y1={cy + ec.ly - 3} x2={cx + ec.lx + 4} y2={cy + ec.ly + 3}
            stroke={color} strokeWidth={2} />
          <line x1={cx + ec.lx + 4} y1={cy + ec.ly - 3} x2={cx + ec.lx - 4} y2={cy + ec.ly + 3}
            stroke={color} strokeWidth={2} />
          <line x1={cx + ec.rx - 4} y1={cy + ec.ry - 3} x2={cx + ec.rx + 4} y2={cy + ec.ry + 3}
            stroke={color} strokeWidth={2} />
          <line x1={cx + ec.rx + 4} y1={cy + ec.ry - 3} x2={cx + ec.rx - 4} y2={cy + ec.ry + 3}
            stroke={color} strokeWidth={2} />
        </>
      );
    }
    return (
      <>
        <circle cx={cx + ec.lx} cy={cy + ec.ly} r={ec.lr} fill={color} />
        <circle cx={cx + ec.rx} cy={cy + ec.ry} r={ec.rr} fill={color} />
        {/* Peur : pupilles dilatees = cercle blanc */}
        {emotion === "peur" && (
          <>
            <circle cx={cx + ec.lx} cy={cy + ec.ly} r={1.5} fill={C.parchment} />
            <circle cx={cx + ec.rx} cy={cy + ec.ry} r={1.5} fill={C.parchment} />
          </>
        )}
        {/* Sourcils douleur : obliques */}
        {emotion === "douleur" && (
          <>
            <line x1={cx + ec.lx - 5} y1={cy + ec.ly - 6}
              x2={cx + ec.lx + 3} y2={cy + ec.ly - 10}
              stroke={color} strokeWidth={2} strokeLinecap="round" />
            <line x1={cx + ec.rx - 3} y1={cy + ec.ry - 10}
              x2={cx + ec.rx + 5} y2={cy + ec.ry - 6}
              stroke={color} strokeWidth={2} strokeLinecap="round" />
          </>
        )}
      </>
    );
  };

  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={C.parchmentD} stroke={color} strokeWidth={3} />
      {renderEyes()}
      {mouths[emotion]}
    </g>
  );
}

// Stick figure level 4 avec expression
interface StickExpressedProps {
  x: number;
  frame: number;
  phase?: number;
  emotion: Emotion;
  walking?: boolean;
}

function StickExpressed({ x, frame, phase = 0, emotion, walking = false }: StickExpressedProps) {
  const f = frame + phase;
  const cycle = f / 12;
  const bob = walking ? Math.abs(Math.sin(cycle)) * 4 : 0;
  const la = walking ? Math.sin(cycle) * 28 : (emotion === "peur" ? -40 : emotion === "joie" ? 35 : 10);
  const ra = walking ? Math.sin(cycle + Math.PI) * 28 : (emotion === "peur" ? 40 : emotion === "joie" ? -35 : -10);
  const ll = walking ? Math.sin(cycle + Math.PI) * 26 : (emotion === "peur" ? 15 : 0);
  const rl = walking ? Math.sin(cycle) * 26 : (emotion === "peur" ? -15 : 0);

  const headR = 24;
  const torsoLen = 58;
  const armLen = 50;
  const legLen = 62;
  const totalH = headR * 2 + 10 + torsoLen + legLen;
  const headCY = -(totalH - headR) - bob;
  const neckY = headCY + headR;
  const shoulderY = neckY + 10;
  const hipY = shoulderY + torsoLen;

  return (
    <g transform={`translate(${x}, ${GY})`}>
      <ellipse cx={0} cy={2} rx={22} ry={6} fill={C.shadow} />

      <g transform={`translate(-9,${hipY}) rotate(${ll},0,0)`}>
        <line x1={0} y1={0} x2={0} y2={legLen} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
      </g>
      <g transform={`translate(9,${hipY}) rotate(${rl},0,0)`}>
        <line x1={0} y1={0} x2={0} y2={legLen} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
      </g>

      <line x1={0} y1={shoulderY} x2={0} y2={hipY} stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
      <line x1={-14} y1={shoulderY} x2={14} y2={shoulderY} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />

      <g transform={`translate(-14,${shoulderY}) rotate(${la},0,0)`}>
        <line x1={0} y1={0} x2={0} y2={armLen} stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
      </g>
      <g transform={`translate(14,${shoulderY}) rotate(${ra},0,0)`}>
        <line x1={0} y1={0} x2={0} y2={armLen} stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
      </g>

      <line x1={0} y1={neckY} x2={0} y2={shoulderY} stroke={C.ink} strokeWidth={3} strokeLinecap="round" />

      {/* Visage expressif */}
      <Face cx={0} cy={headCY} r={headR} emotion={emotion} />
    </g>
  );
}

const EMOTIONS: Array<{ emotion: Emotion; label: string; sub: string }> = [
  { emotion: "joie",          label: "Joie",          sub: "sourire + yeux hauts" },
  { emotion: "neutre",        label: "Neutre",         sub: "regard droit" },
  { emotion: "regard_gauche", label: "Interaction",    sub: "regarde quelqu'un" },
  { emotion: "peur",          label: "Peur",           sub: "yeux dilates + bras en arriere" },
  { emotion: "douleur",       label: "Douleur",        sub: "sourcils obliques" },
  { emotion: "mort",          label: "Mort",           sub: "yeux en croix" },
];

function Seg4Expressions({ lf, frame }: { lf: number; frame: number }) {
  const fadeIn = interpolate(lf, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const positions = [160, 400, 640, 960, 1280, 1600];

  return (
    <g opacity={fadeIn}>
      <ParchBg />
      <Ground />
      {EMOTIONS.map((e, i) => {
        const charIn = interpolate(lf, [i * 18, i * 18 + 25], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        return (
          <g key={e.emotion} opacity={charIn}>
            <StickExpressed x={positions[i]} frame={frame} phase={i * 30} emotion={e.emotion} />
            <CharLabel x={positions[i]} text={e.label} sub={e.sub} />
          </g>
        );
      })}
      <SegLabel text="NIVEAU 4 — Expressions faciales minimales"
        sub="Yeux : 2 points. Sourcils : 1 ligne. Bouche : 1 arc. Posture bras liee a l'emotion." />
      <Caption text="6 lignes par visage — impact expressif disproportionne" />
    </g>
  );
}

// ============================================================
// NIVEAU 5 — Postures narratives avec spring() interpolation
// ============================================================

type Pose = "idle" | "walk" | "flee" | "pray" | "fall" | "collapse";

interface PoseData {
  torsoAngle: number;   // inclinaison du torse
  headOffset: number;   // decalage horizontal de la tete
  lArmAngle: number;
  rArmAngle: number;
  lLegAngle: number;
  rLegAngle: number;
  bobAmp: number;       // amplitude bob
}

const POSES: Record<Pose, PoseData> = {
  idle:     { torsoAngle: 0,   headOffset: 0,  lArmAngle: 12,  rArmAngle: -12, lLegAngle: 0,  rLegAngle: 0,  bobAmp: 0 },
  walk:     { torsoAngle: 5,   headOffset: 0,  lArmAngle: 30,  rArmAngle: -30, lLegAngle: -28, rLegAngle: 28, bobAmp: 4 },
  flee:     { torsoAngle: 30,  headOffset: 20, lArmAngle: -50, rArmAngle: -50, lLegAngle: -40, rLegAngle: 40, bobAmp: 0 },
  pray:     { torsoAngle: 5,   headOffset: 0,  lArmAngle: -45, rArmAngle: 45,  lLegAngle: 0,  rLegAngle: 0,  bobAmp: 0 },
  fall:     { torsoAngle: 60,  headOffset: 30, lArmAngle: 60,  rArmAngle: -20, lLegAngle: 50,  rLegAngle: -20, bobAmp: 0 },
  collapse: { torsoAngle: 90,  headOffset: 50, lArmAngle: 90,  rArmAngle: 90,  lLegAngle: 30,  rLegAngle: -10, bobAmp: 0 },
};

function StickPosed({ x, frame, poseA, poseB, t }: {
  x: number;
  frame: number;
  poseA: Pose;
  poseB: Pose;
  t: number; // 0..1 interpolation entre les deux poses
}) {
  const a = POSES[poseA];
  const b = POSES[poseB];
  const lerp = (va: number, vb: number) => va + (vb - va) * t;

  const torsoAngle = lerp(a.torsoAngle, b.torsoAngle);
  const headOffset = lerp(a.headOffset, b.headOffset);
  const lArm = lerp(a.lArmAngle, b.lArmAngle);
  const rArm = lerp(a.rArmAngle, b.rArmAngle);
  const lLeg = lerp(a.lLegAngle, b.lLegAngle);
  const rLeg = lerp(a.rLegAngle, b.rLegAngle);
  const bob = lerp(a.bobAmp, b.bobAmp) * Math.abs(Math.sin(frame / 12));

  const headR = 22;
  const torsoLen = 58;
  const armLen = 48;
  const legLen = 60;
  const totalH = headR * 2 + 10 + torsoLen + legLen;
  const headCY = -(totalH - headR) - bob;
  const neckY = headCY + headR;
  const shoulderY = neckY + 10;
  const hipY = shoulderY + torsoLen;

  // Calcul pointe du torse depuis la hanche
  const torsoRad = (torsoAngle * Math.PI) / 180;
  const shoulderXOff = -Math.sin(torsoRad) * torsoLen;
  const shoulderYOff = -Math.cos(torsoRad) * torsoLen;

  return (
    <g transform={`translate(${x}, ${GY})`}>
      <ellipse cx={0} cy={2} rx={24} ry={6} fill={C.shadow} />

      {/* Jambes depuis la hanche */}
      <g transform={`translate(-9,${hipY}) rotate(${lLeg},0,0)`}>
        <line x1={0} y1={0} x2={0} y2={legLen} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
      </g>
      <g transform={`translate(9,${hipY}) rotate(${rLeg},0,0)`}>
        <line x1={0} y1={0} x2={0} y2={legLen} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
      </g>

      {/* Torse incline depuis la hanche */}
      <line
        x1={0} y1={hipY}
        x2={shoulderXOff} y2={hipY + shoulderYOff}
        stroke={C.ink} strokeWidth={5} strokeLinecap="round"
      />

      {/* Bras depuis les epaules (position calculee) */}
      <g transform={`translate(${shoulderXOff - 12},${hipY + shoulderYOff}) rotate(${lArm},0,0)`}>
        <line x1={0} y1={0} x2={0} y2={armLen} stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
      </g>
      <g transform={`translate(${shoulderXOff + 12},${hipY + shoulderYOff}) rotate(${rArm},0,0)`}>
        <line x1={0} y1={0} x2={0} y2={armLen} stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
      </g>

      {/* Tete : suit le haut du torse + offset expressif */}
      <Face
        cx={shoulderXOff + headOffset * 0.5}
        cy={hipY + shoulderYOff - 10 - headR}
        r={headR}
        emotion={t > 0.6 ? (poseB === "flee" ? "peur" : poseB === "pray" ? "douleur" : poseB === "collapse" ? "mort" : "neutre") : "neutre"}
      />
    </g>
  );
}

function Seg5Poses({ lf, frame }: { lf: number; frame: number }) {
  const fadeIn = interpolate(lf, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Chaque personnage est en train d'interpoler vers sa pose finale
  const t1 = interpolate(lf, [30, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t2 = interpolate(lf, [50, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t3 = interpolate(lf, [70, 170], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t4 = interpolate(lf, [90, 190], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const poses: Array<{ x: number; from: Pose; to: Pose; t: number; label: string }> = [
    { x: 280,  from: "idle", to: "flee",     t: t1, label: "Idle -> Fuite" },
    { x: 680,  from: "idle", to: "pray",     t: t2, label: "Idle -> Priere" },
    { x: 1100, from: "walk", to: "fall",     t: t3, label: "Marche -> Chute" },
    { x: 1520, from: "idle", to: "collapse", t: t4, label: "Debout -> Effondrement" },
  ];

  return (
    <g opacity={fadeIn}>
      <ParchBg />
      <Ground />
      {poses.map((p, i) => (
        <g key={i}>
          <StickPosed x={p.x} frame={frame} poseA={p.from} poseB={p.to} t={p.t} />
          <CharLabel x={p.x} text={p.label} />
          {/* Barre de progression */}
          <rect x={p.x - 50} y={GY + 42} width={100} height={8} rx={4}
            fill={C.parchmentDD} />
          <rect x={p.x - 50} y={GY + 42} width={100 * p.t} height={8} rx={4}
            fill={C.vermillon} opacity={0.8} />
        </g>
      ))}
      <SegLabel text="NIVEAU 5 — Postures narratives + spring()"
        sub="6 poses definies — lerp() pour transitionner. Torse incline depuis la hanche." />
      <Caption text="Le personnage change d'etat narratif en live — synchronisable avec l'audio" />
    </g>
  );
}

// ============================================================
// NIVEAU 6 — Silhouette partielle + deformation maladie
// ============================================================

function StickSilhouette({ x, frame, sicknessT = 0 }: {
  x: number;
  frame: number;
  sicknessT: number; // 0 = sain, 1 = malade/mort
}) {
  const cycle = frame / 14;
  const walkSpeed = 1 - sicknessT * 0.85; // plus malade = plus lent
  const stepAmp = 28 * (1 - sicknessT * 0.7);
  const la = Math.sin(cycle * walkSpeed) * stepAmp;
  const ra = Math.sin(cycle * walkSpeed + Math.PI) * stepAmp;
  const ll = Math.sin(cycle * walkSpeed + Math.PI) * stepAmp * 0.9;
  const rl = Math.sin(cycle * walkSpeed) * stepAmp * 0.9;

  // Courbure du dos progresse avec la maladie
  const backLean = sicknessT * 22;
  const headDrop = sicknessT * 15;

  const headR = 22;
  const torsoLen = 58 - sicknessT * 12; // corps se tasse
  const armLen = 48;
  const legLen = 60 - sicknessT * 10;
  const totalH = headR * 2 + 10 + torsoLen + legLen;
  const headCY = -(totalH - headR) + headDrop;
  const neckY = headCY + headR;
  const shoulderY = neckY + 10;
  const hipY = shoulderY + torsoLen;

  // Couleur qui paleit avec la maladie
  const bodyColor = sicknessT > 0
    ? `rgba(26,16,8,${1 - sicknessT * 0.5})`
    : C.ink;

  return (
    <g transform={`translate(${x}, ${GY})`}>
      <ellipse cx={0} cy={2} rx={22 * (1 - sicknessT * 0.3)} ry={5} fill={C.shadow} opacity={1 - sicknessT * 0.5} />

      {/* Jambes */}
      <g transform={`translate(-9,${hipY}) rotate(${ll},0,0)`}>
        <line x1={0} y1={0} x2={0} y2={legLen} stroke={bodyColor} strokeWidth={4} strokeLinecap="round" />
      </g>
      <g transform={`translate(9,${hipY}) rotate(${rl},0,0)`}>
        <line x1={0} y1={0} x2={0} y2={legLen} stroke={bodyColor} strokeWidth={4} strokeLinecap="round" />
      </g>

      {/* Torse incline — corps qui se courbe */}
      <line
        x1={-backLean * 0.3} y1={hipY}
        x2={-backLean} y2={shoulderY}
        stroke={bodyColor} strokeWidth={5} strokeLinecap="round"
      />

      {/* Corps = path ferme pour silhouette = presence visuelle forte */}
      <path
        d={`M ${-backLean - 10} ${shoulderY}
            L ${-backLean + 10} ${shoulderY}
            L 12 ${hipY}
            L -12 ${hipY} Z`}
        fill={C.parchmentD}
        stroke={bodyColor}
        strokeWidth={2}
        opacity={0.85}
      />

      {/* Bras */}
      <g transform={`translate(${-backLean - 12},${shoulderY}) rotate(${la + backLean},0,0)`}>
        <line x1={0} y1={0} x2={0} y2={armLen} stroke={bodyColor} strokeWidth={3} strokeLinecap="round" />
      </g>
      <g transform={`translate(${-backLean + 12},${shoulderY}) rotate(${ra - backLean},0,0)`}>
        <line x1={0} y1={0} x2={0} y2={armLen} stroke={bodyColor} strokeWidth={3} strokeLinecap="round" />
      </g>

      {/* Cou + tete qui s'incline */}
      <line
        x1={-backLean} y1={shoulderY}
        x2={-backLean - headDrop * 0.3} y2={neckY}
        stroke={bodyColor} strokeWidth={3} strokeLinecap="round"
      />

      <Face
        cx={-backLean - headDrop * 0.5}
        cy={headCY}
        r={headR}
        emotion={sicknessT < 0.3 ? "neutre" : sicknessT < 0.6 ? "douleur" : sicknessT < 0.9 ? "peur" : "mort"}
        color={bodyColor}
      />

      {/* Taches pestee (bubons) — apparaissent avec la maladie */}
      {sicknessT > 0.3 && (
        <>
          <circle cx={-backLean + 8} cy={(shoulderY + hipY) / 2 - 5} r={5 * (sicknessT - 0.3) * 1.4}
            fill={C.vermillon} opacity={0.6} />
          <circle cx={-backLean - 14} cy={(shoulderY + hipY) / 2 + 10} r={4 * (sicknessT - 0.3) * 1.4}
            fill={C.vermillon} opacity={0.5} />
        </>
      )}
    </g>
  );
}

function Seg6Silhouette({ lf, frame }: { lf: number; frame: number }) {
  const fadeIn = interpolate(lf, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // 5 personnages au meme endroit qu'avant mais avec t de maladie croissant
  const sickLevels = [0, 0.25, 0.5, 0.75, 1.0];
  const positions = [240, 560, 880, 1200, 1520];
  const labels = ["Sain", "Infecte", "Malade", "Mourant", "Mort"];

  return (
    <g opacity={fadeIn}>
      <ParchBg />
      <Ground />
      {sickLevels.map((t, i) => (
        <g key={i}>
          <StickSilhouette x={positions[i]} frame={frame} sicknessT={t} />
          <CharLabel x={positions[i]} text={labels[i]}
            sub={t === 0 ? "corps rempli, ombre forte" : t === 1 ? "courbure + 1 bubon" : t === 0.5 ? "dos courbe, pas lent" : t === 0.75 ? "effondrement partiel" : "silhouette pale"} />
        </g>
      ))}
      <SegLabel text="NIVEAU 6 — Silhouette + deformation progressive"
        sub="Corps = path ferme. Torse s'incline. Couleur paleit. Bubons apparaissent." />
      <Caption text="Un seul composant — deformation entierement controllee par sicknessT (0->1)" />
    </g>
  );
}

// ============================================================
// COMPOSITION PRINCIPALE
// ============================================================

export const StickFigureProto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg = Math.floor(frame / SEG);
  const lf  = frame - seg * SEG;

  const segFade = interpolate(lf, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: C.parchment }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>

        {seg === 0 && <g opacity={segFade}><Seg1Basic lf={lf} frame={frame} /></g>}
        {seg === 1 && <g opacity={segFade}><Seg2Types lf={lf} frame={frame} /></g>}
        {seg === 2 && <g opacity={segFade}><Seg3Weighted lf={lf} frame={frame} /></g>}
        {seg === 3 && <g opacity={segFade}><Seg4Expressions lf={lf} frame={frame} /></g>}
        {seg === 4 && <g opacity={segFade}><Seg5Poses lf={lf} frame={frame} /></g>}
        {seg === 5 && <g opacity={segFade}><Seg6Silhouette lf={lf} frame={frame} /></g>}

        {/* Compteur */}
        <text x={W - 50} y={H - 35} textAnchor="end"
          fontFamily="Georgia, serif" fontSize={16}
          fill={C.inkLight} opacity={0.5}>
          {seg + 1}/6
        </text>
      </svg>
    </AbsoluteFill>
  );
};
