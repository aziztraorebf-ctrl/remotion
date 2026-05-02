import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

// ============================================================
// PARCHEMIN LAB — Demo 10 capacites du style parchemin
//
// Seg 1  (0-299f)    : Village vivant — 30 personnages, fumee, nuages
// Seg 2  (300-599f)  : Vide progressif — personnages disparaissent un par un
// Seg 3  (600-899f)  : Medecin de la peste traverse le village vide
// Seg 4  (900-1199f) : Carte parchemin — propagation Europe
// Seg 5  (1200-1499f): Split-screen avant/apres (1346 vs 1349)
// Seg 6  (1500-1799f): Texte qui s'ecrit style scribe
// Seg 7  (1800-2099f): Parallax 3 couches — camera avance
// Seg 8  (2100-2399f): Nuit progressive — torche, ombres longues
// Seg 9  (2400-2699f): 5 archetyypes identifies (marchand, paysan, noble, moine, medecin)
// Seg 10 (2700-2999f): Transition parchemin -> scene live
//
// 3000 frames @ 30fps = 100 secondes
// ============================================================

const W = 1920;
const H = 1080;
const SEG = 300;
const GROUND_Y = 780;

const C = {
  parchment:    "#F5E6C8",
  parchmentD:   "#E8D4A8",
  parchmentDD:  "#D4B896",
  parchmentDDD: "#C8B878",
  ink:          "#1A1008",
  inkLight:     "#6B5030",
  gold:         "#C9A227",
  goldDark:     "#8B6914",
  vermillon:    "#C1392B",
  skyDay:       "#2D3A8C",
  skyDusk:      "#1A0A3A",
  seaBlue:      "#1B4F8C",
  landMap:      "#C8B878",
  seaMap:       "#A8C4E0",
  torchGlow:    "#FF9A3C",
  torchCore:    "#FFE066",
} as const;

// ── Helpers globaux ──────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function segFrame(frame: number, seg: number) {
  return frame - seg * SEG;
}

function segProgress(frame: number, seg: number) {
  return clamp(segFrame(frame, seg) / SEG, 0, 1);
}

function SegLabel({ text, sub }: { text: string; sub: string }) {
  return (
    <g>
      <rect x={40} y={40} width={600} height={90} rx={6} fill={C.ink} opacity={0.85} />
      <text x={60} y={88} fontFamily="Georgia, serif" fontSize={28} fill={C.parchment} fontWeight="bold">{text}</text>
      <text x={60} y={118} fontFamily="Georgia, serif" fontSize={18} fill={C.parchmentD}>{sub}</text>
    </g>
  );
}

function Caption({ text }: { text: string }) {
  return (
    <g>
      <text
        x={W / 2} y={H - 40}
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize={20}
        fill={C.inkLight}
        fontStyle="italic"
      >{text}</text>
    </g>
  );
}

// ── Fond parchemin ───────────────────────────────────────────

function ParchBg() {
  return (
    <>
      <rect width={W} height={H} fill={C.parchment} />
      <rect x={30} y={30} width={W - 60} height={H - 60} fill="none" stroke={C.inkLight} strokeWidth={2} opacity={0.35} />
    </>
  );
}

// ── Nuages ───────────────────────────────────────────────────

function Cloud({ cx, cy, scale = 1, opacity = 0.9 }: { cx: number; cy: number; scale?: number; opacity?: number }) {
  return (
    <g transform={`translate(${cx},${cy}) scale(${scale})`} opacity={opacity}>
      <ellipse cx={0}   cy={0}   rx={70} ry={32} fill={C.parchmentD} />
      <ellipse cx={55}  cy={-12} rx={48} ry={28} fill={C.parchmentD} />
      <ellipse cx={-45} cy={-10} rx={40} ry={24} fill={C.parchmentD} />
      <ellipse cx={10}  cy={-22} rx={52} ry={30} fill={C.parchmentD} />
    </g>
  );
}

// ── Batiments ────────────────────────────────────────────────

function House({ x, y = GROUND_Y, w = 140, h = 180, roofH = 80, hasCross = false }: {
  x: number; y?: number; w?: number; h?: number; roofH?: number; hasCross?: boolean;
}) {
  const wallTop = y - h;
  const roofTop = wallTop - roofH;
  return (
    <g>
      <rect x={x} y={wallTop} width={w} height={h} fill={C.parchmentD} stroke={C.ink} strokeWidth={2.5} />
      <polygon points={`${x - 8},${wallTop} ${x + w / 2},${roofTop} ${x + w + 8},${wallTop}`}
        fill={C.parchmentDD} stroke={C.ink} strokeWidth={2.5} />
      <rect x={x + w * 0.38} y={wallTop + h * 0.55} width={w * 0.24} height={h * 0.45}
        rx={w * 0.1} fill={C.parchmentDDD} stroke={C.ink} strokeWidth={2} />
      <rect x={x + w * 0.62} y={wallTop + h * 0.18} width={w * 0.2} height={w * 0.18}
        rx={3} fill={C.parchmentDD} stroke={C.ink} strokeWidth={1.5} />
      {hasCross && (
        <g>
          <line x1={x + w / 2} y1={roofTop - 30} x2={x + w / 2} y2={roofTop - 5} stroke={C.ink} strokeWidth={4} />
          <line x1={x + w / 2 - 10} y1={roofTop - 20} x2={x + w / 2 + 10} y2={roofTop - 20} stroke={C.ink} strokeWidth={4} />
        </g>
      )}
    </g>
  );
}

function Church({ x, y = GROUND_Y }: { x: number; y?: number }) {
  const w = 200; const h = 240; const wallTop = y - h;
  const twrW = 65; const twrH = 160; const twrX = x + w - twrW - 10;
  const twrTop = wallTop - twrH; const spireH = 90;
  return (
    <g>
      <rect x={x} y={wallTop} width={w} height={h} fill={C.parchmentD} stroke={C.ink} strokeWidth={3} />
      {[x + 18, x + 90].map((wx, i) => (
        <rect key={i} x={wx} y={wallTop + 28} width={40} height={65} rx={20}
          fill={C.parchmentDD} stroke={C.ink} strokeWidth={2} />
      ))}
      <rect x={x + w / 2 - 22} y={y - 95} width={44} height={95} rx={22}
        fill={C.parchmentDDD} stroke={C.ink} strokeWidth={2} />
      <polygon points={`${x - 8},${wallTop} ${x + w / 2},${wallTop - 70} ${x + w + 8},${wallTop}`}
        fill={C.parchmentDD} stroke={C.ink} strokeWidth={2.5} />
      <rect x={twrX} y={twrTop} width={twrW} height={twrH} fill={C.parchmentD} stroke={C.ink} strokeWidth={3} />
      <polygon points={`${twrX - 6},${twrTop} ${twrX + twrW / 2},${twrTop - spireH} ${twrX + twrW + 6},${twrTop}`}
        fill={C.parchmentDD} stroke={C.ink} strokeWidth={2.5} />
      <line x1={twrX + twrW / 2} y1={twrTop - spireH - 28} x2={twrX + twrW / 2} y2={twrTop - spireH}
        stroke={C.ink} strokeWidth={4} />
      <line x1={twrX + twrW / 2 - 12} y1={twrTop - spireH - 16} x2={twrX + twrW / 2 + 12} y2={twrTop - spireH - 16}
        stroke={C.ink} strokeWidth={4} />
    </g>
  );
}

// Petite croix rouge sur maison pestee
function PlagueX({ x, y, w }: { x: number; y: number; w: number }) {
  const cx = x + w * 0.2;
  const cy = y - w * 0.8;
  const s = w * 0.15;
  return (
    <g>
      <line x1={cx - s} y1={cy - s} x2={cx + s} y2={cy + s} stroke={C.vermillon} strokeWidth={5} strokeLinecap="round" />
      <line x1={cx + s} y1={cy - s} x2={cx - s} y2={cy + s} stroke={C.vermillon} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
}

// Sol
function Ground({ y = GROUND_Y }: { y?: number }) {
  return (
    <>
      <line x1={0} y1={y} x2={W} y2={y} stroke={C.ink} strokeWidth={2.5} />
      {Array.from({ length: 30 }, (_, i) => {
        const px = 40 + i * 62 + (i % 3) * 8;
        const pw = 48 + (i * 13) % 25;
        return (
          <rect key={i} x={px} y={y + 8} width={pw} height={16} rx={4}
            fill="none" stroke={C.inkLight} strokeWidth={1} opacity={0.35} />
        );
      })}
    </>
  );
}

// ── Personnage articulé ──────────────────────────────────────

interface CharProps {
  x: number;
  y?: number;
  frame: number;
  phase?: number;
  scale?: number;
  walking?: boolean;
  opacity?: number;
  // Apparence
  headFill?: string;
  bodyFill?: string;
  legFill?: string;
  // Accessoires
  hasBeak?: boolean;      // masque bec medecin
  hasRobe?: boolean;      // longue robe
  hasHood?: boolean;      // capuchon moine
  hasCrown?: boolean;     // couronne noble
  hasHat?: boolean;       // chapeau marchand
  hasStaff?: boolean;     // baton
  hatColor?: string;
}

function Char({
  x, y = GROUND_Y, frame, phase = 0, scale = 1, walking = true, opacity = 1,
  headFill = C.parchmentD, bodyFill = C.parchmentDD, legFill = C.inkLight,
  hasBeak = false, hasRobe = false, hasHood = false, hasCrown = false,
  hasHat = false, hasStaff = false, hatColor = C.ink,
}: CharProps) {
  const f = frame + phase;
  const cycle = f / 10;
  const bob = walking ? Math.abs(Math.sin(cycle)) * 5 : 0;

  const la = walking ? Math.sin(cycle) * 30 : 0;
  const ra = walking ? Math.sin(cycle + Math.PI) * 30 : 0;
  const ll = walking ? Math.sin(cycle + Math.PI) * 30 : 0;
  const rl = walking ? Math.sin(cycle) * 30 : 0;

  const headR = 24;
  const torsoH = hasRobe ? 110 : 65;
  const torsoW = 36;
  const armL = 50;
  const legL = hasRobe ? 0 : 58;
  const legW = 12;
  const footW = 18;

  const neckY = y - (hasRobe ? 110 : 58) - legL - headR * 2 - bob;
  const torsoTop = neckY + headR * 2 + 3;
  const hipY = torsoTop + torsoH;
  const shoulderY = torsoTop + 10;

  return (
    <g transform={`translate(${x},0) scale(${scale})`} opacity={opacity}>
      {/* Ombre */}
      <ellipse cx={0} cy={y} rx={24} ry={6} fill="rgba(26,16,8,0.12)" />

      {/* Jambes (masquees si robe) */}
      {!hasRobe && (
        <>
          <g transform={`translate(-9,${hipY}) rotate(${ll},0,0)`}>
            <rect x={-legW / 2} y={0} width={legW} height={legL} rx={legW / 2}
              fill={legFill} stroke={C.ink} strokeWidth={1.5} />
            <rect x={-legW / 2 - 1} y={legL - 7} width={footW} height={9} rx={5} fill={C.ink} />
          </g>
          <g transform={`translate(9,${hipY}) rotate(${rl},0,0)`}>
            <rect x={-legW / 2} y={0} width={legW} height={legL} rx={legW / 2}
              fill={legFill} stroke={C.ink} strokeWidth={1.5} />
            <rect x={-legW / 2 - 1} y={legL - 7} width={footW} height={9} rx={5} fill={C.ink} />
          </g>
        </>
      )}

      {/* Bras gauche */}
      <g transform={`translate(${-torsoW / 2 + 3},${shoulderY}) rotate(${la},0,0)`}>
        <rect x={-5} y={0} width={10} height={armL} rx={5}
          fill={headFill} stroke={C.ink} strokeWidth={1.5} />
      </g>

      {/* Corps */}
      {hasRobe ? (
        <path
          d={`M ${-torsoW / 2} ${torsoTop} L ${-torsoW / 2 - 18} ${hipY + 30}
              L ${torsoW / 2 + 18} ${hipY + 30} L ${torsoW / 2} ${torsoTop} Z`}
          fill={bodyFill} stroke={C.ink} strokeWidth={2} />
      ) : (
        <rect x={-torsoW / 2} y={torsoTop} width={torsoW} height={torsoH}
          rx={8} fill={bodyFill} stroke={C.ink} strokeWidth={2} />
      )}

      {/* Bras droit */}
      <g transform={`translate(${torsoW / 2 - 3},${shoulderY}) rotate(${ra},0,0)`}>
        <rect x={-5} y={0} width={10} height={armL} rx={5}
          fill={headFill} stroke={C.ink} strokeWidth={1.5} />
      </g>

      {/* Baton */}
      {hasStaff && (
        <line
          x1={torsoW / 2 + 8} y1={shoulderY + 20}
          x2={torsoW / 2 + 18} y2={y}
          stroke={C.ink} strokeWidth={5} strokeLinecap="round"
        />
      )}

      {/* Cou */}
      <rect x={-8} y={neckY + headR * 2 - 2} width={16} height={12} rx={5}
        fill={headFill} stroke={C.ink} strokeWidth={1.5} />

      {/* Tete */}
      <g transform={`translate(0,${neckY + headR})`}>
        {hasBeak ? (
          <>
            {/* Chapeau cylindrique medecin */}
            <rect x={-headR - 4} y={-headR * 1.1} width={(headR + 4) * 2} height={9} rx={4}
              fill={C.ink} stroke={C.ink} strokeWidth={1} />
            <rect x={-headR * 0.7} y={-headR * 1.8} width={headR * 1.4} height={headR * 0.75} rx={4}
              fill={C.ink} stroke={C.ink} strokeWidth={1} />
            {/* Masque */}
            <ellipse cx={0} cy={0} rx={headR} ry={headR * 1.1}
              fill={C.parchmentD} stroke={C.ink} strokeWidth={2} />
            {/* Bec */}
            <path d={`M ${-headR * 0.4} ${headR * 0.3} L ${-headR * 0.4} ${headR * 0.8} L ${headR * 1.2} ${headR * 0.5} Z`}
              fill={C.parchmentDDD} stroke={C.ink} strokeWidth={2} />
            {/* Yeux lunettes */}
            <circle cx={-headR * 0.3} cy={-headR * 0.1} r={8}
              fill="none" stroke={C.ink} strokeWidth={2} />
            <circle cx={headR * 0.3} cy={-headR * 0.1} r={8}
              fill="none" stroke={C.ink} strokeWidth={2} />
            <line x1={-headR * 0.3 + 8} y1={-headR * 0.1} x2={headR * 0.3 - 8} y2={-headR * 0.1}
              stroke={C.ink} strokeWidth={1.5} />
          </>
        ) : (
          <>
            <ellipse cx={0} cy={0} rx={headR} ry={headR * 1.08}
              fill={headFill} stroke={C.ink} strokeWidth={2} />
            {/* Cheveux */}
            <ellipse cx={0} cy={-headR * 0.55} rx={headR + 2} ry={headR * 0.6}
              fill={C.inkLight} stroke={C.ink} strokeWidth={1} />
            {/* Yeux */}
            <circle cx={-8} cy={3} r={3.5} fill="white" stroke={C.ink} strokeWidth={1} />
            <circle cx={8}  cy={3} r={3.5} fill="white" stroke={C.ink} strokeWidth={1} />
            <circle cx={-8} cy={4} r={1.8} fill={C.ink} />
            <circle cx={8}  cy={4} r={1.8} fill={C.ink} />
            {/* Bouche */}
            <path d="M -6 12 Q 0 17 6 12" stroke={C.ink} strokeWidth={1.5} fill="none" strokeLinecap="round" />
          </>
        )}

        {/* Capuchon moine */}
        {hasHood && (
          <path d={`M ${-headR - 8} ${-headR * 0.2} Q ${-headR - 12} ${-headR * 1.5} 0 ${-headR * 1.9}
                    Q ${headR + 12} ${-headR * 1.5} ${headR + 8} ${-headR * 0.2} Z`}
            fill={C.inkLight} stroke={C.ink} strokeWidth={2} />
        )}

        {/* Couronne noble */}
        {hasCrown && (
          <g>
            <rect x={-headR - 2} y={-headR * 1.05} width={(headR + 2) * 2} height={10} rx={2}
              fill={C.gold} stroke={C.goldDark} strokeWidth={1.5} />
            {[-headR + 4, -headR / 2 + 2, 0, headR / 2 - 2, headR - 4].map((px, i) => (
              <polygon key={i}
                points={`${px},${ -headR * 1.05} ${px + 6},${-headR * 1.5} ${px + 12},${-headR * 1.05}`}
                fill={C.gold} stroke={C.goldDark} strokeWidth={1} />
            ))}
          </g>
        )}

        {/* Chapeau marchand */}
        {hasHat && (
          <g>
            <rect x={-headR - 8} y={-headR * 0.85} width={(headR + 8) * 2} height={9} rx={4}
              fill={hatColor} stroke={C.ink} strokeWidth={1.5} />
            <rect x={-headR * 0.7} y={-headR * 1.65} width={headR * 1.4} height={headR * 0.85} rx={5}
              fill={hatColor} stroke={C.ink} strokeWidth={1.5} />
          </g>
        )}
      </g>
    </g>
  );
}

// Fumee de cheminee
function Smoke({ bx, by, frame, opacity = 1 }: { bx: number; by: number; frame: number; opacity?: number }) {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => {
        const age = (frame + i * 20) % 100;
        const sy = by - age * 1.6;
        const sx = bx + Math.sin(frame * 0.06 + i) * 8 + age * 0.3;
        const sr = 9 + age * 0.25;
        const sop = opacity * Math.max(0, 0.35 - age / 100 * 0.35);
        return <circle key={i} cx={sx} cy={sy} r={sr} fill={C.parchmentDD} opacity={sop} />;
      })}
    </>
  );
}

// Ciel simplifie
function Sky({ frame, nightProgress = 0 }: { frame: number; nightProgress?: number }) {
  const cloudOffset = frame * 0.2;
  const skyColor = nightProgress > 0
    ? `rgba(26,10,58,${nightProgress})`
    : "transparent";
  return (
    <>
      <rect width={W} height={GROUND_Y} fill={C.parchmentD} opacity={0.3} />
      {/* Overlay nuit */}
      {nightProgress > 0 && (
        <rect width={W} height={H} fill={C.skyDusk} opacity={nightProgress} />
      )}
      <Cloud cx={280 + cloudOffset}  cy={130} scale={1.0}  opacity={0.7} />
      <Cloud cx={700 + cloudOffset}  cy={100} scale={0.8}  opacity={0.6} />
      <Cloud cx={1150 + cloudOffset} cy={145} scale={1.15} opacity={0.65} />
      <Cloud cx={1580 + cloudOffset} cy={110} scale={0.9}  opacity={0.55} />
    </>
  );
}

// ============================================================
// SEG 1 — Village vivant (30 personnages, fumee, nuages)
// ============================================================

const CROWD_DATA = Array.from({ length: 30 }, (_, i) => ({
  x: 80 + (i % 10) * 175 + (Math.floor(i / 10)) * 40 + ((i * 37) % 60),
  phase: i * 23,
  scale: 0.7 + (i % 4) * 0.08,
  bodyFill: [C.parchmentD, C.parchmentDD, C.inkLight + "44"][i % 3],
}));

function Seg1Village({ lf }: { lf: number }) {
  const sceneIn = interpolate(lf, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const frame = lf;

  return (
    <g opacity={sceneIn}>
      <Sky frame={frame} />
      <Church x={820} />
      <House x={80}  w={160} h={195} roofH={90} />
      <House x={280} w={130} h={170} roofH={75} />
      <House x={480} w={145} h={185} roofH={85} />
      <House x={1350} w={155} h={190} roofH={85} />
      <House x={1530} w={140} h={175} roofH={80} />
      <House x={1700} w={125} h={160} roofH={70} />
      <Smoke bx={540}  by={GROUND_Y - 185} frame={frame} />
      <Smoke bx={1420} by={GROUND_Y - 190} frame={frame} opacity={0.8} />
      <Ground />
      {CROWD_DATA.map((d, i) => (
        <Char
          key={i}
          x={d.x}
          frame={frame}
          phase={d.phase}
          scale={d.scale}
          walking={i % 4 !== 2}
          bodyFill={d.bodyFill}
        />
      ))}
      <SegLabel
        text="SEGMENT 1 — Village vivant"
        sub="30 personnages, fumee, nuages"
      />
      <Caption text="Un village medieval — avant la Peste" />
    </g>
  );
}

// ============================================================
// SEG 2 — Vide progressif
// ============================================================

function Seg2Vide({ lf, frame }: { lf: number; frame: number }) {
  // Chaque personnage disparait a un moment different : etale sur 200 frames
  const globalFrame = frame;

  return (
    <g>
      <Sky frame={globalFrame} />
      <Church x={820} />
      <House x={80}  w={160} h={195} roofH={90} hasCross />
      <House x={280} w={130} h={170} roofH={75} />
      <House x={480} w={145} h={185} roofH={85} hasCross />
      <House x={1350} w={155} h={190} roofH={85} hasCross />
      <House x={1530} w={140} h={175} roofH={80} />
      <House x={1700} w={125} h={160} roofH={70} hasCross />
      <PlagueX x={80}  y={GROUND_Y} w={160} />
      <PlagueX x={480} y={GROUND_Y} w={145} />
      <PlagueX x={1350} y={GROUND_Y} w={155} />
      <PlagueX x={1700} y={GROUND_Y} w={125} />
      <Smoke bx={540}  by={GROUND_Y - 185} frame={globalFrame} opacity={0.4} />
      <Ground />
      {CROWD_DATA.map((d, i) => {
        // Chaque personnage disparait progressivement, les premiers en premier
        const disappearStart = i * 6;  // frames 0..174
        const charOpacity = interpolate(lf, [disappearStart, disappearStart + 18], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <Char
            key={i}
            x={d.x}
            frame={globalFrame}
            phase={d.phase}
            scale={d.scale}
            walking={false}
            opacity={charOpacity}
          />
        );
      })}
      <SegLabel
        text="SEGMENT 2 — Vide progressif"
        sub="30 personnages disparaissent un par un"
      />
      <Caption text="En 18 mois, un tiers de la population europeenne" />
    </g>
  );
}

// ============================================================
// SEG 3 — Medecin de la peste
// ============================================================

function Seg3Doctor({ lf, frame }: { lf: number; frame: number }) {
  // Medecin entre depuis la gauche et traverse le village vide
  const doctorX = interpolate(lf, [20, 260], [-80, W + 80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneIn = interpolate(lf, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <g opacity={sceneIn}>
      <Sky frame={frame} nightProgress={0.2} />
      <Church x={820} />
      <House x={80}  w={160} h={195} roofH={90} hasCross />
      <House x={280} w={130} h={170} roofH={75} hasCross />
      <House x={480} w={145} h={185} roofH={85} hasCross />
      <House x={1350} w={155} h={190} roofH={85} hasCross />
      <House x={1530} w={140} h={175} roofH={80} hasCross />
      <House x={1700} w={125} h={160} roofH={70} hasCross />
      <PlagueX x={80}   y={GROUND_Y} w={160} />
      <PlagueX x={280}  y={GROUND_Y} w={130} />
      <PlagueX x={480}  y={GROUND_Y} w={145} />
      <PlagueX x={1350} y={GROUND_Y} w={155} />
      <PlagueX x={1530} y={GROUND_Y} w={140} />
      <PlagueX x={1700} y={GROUND_Y} w={125} />
      <Ground />
      {/* Medecin de la peste */}
      <Char
        x={doctorX}
        frame={frame}
        scale={1.15}
        hasBeak
        hasRobe
        hasStaff
        bodyFill={C.ink}
        legFill={C.ink}
        headFill={C.parchmentD}
        walking
      />
      <SegLabel
        text="SEGMENT 3 — Medecin de la Peste"
        sub="Bec rempli de fleurs — protection contre les miasmes"
      />
      <Caption text="Il croyait que la bonne odeur eloignait la maladie" />
    </g>
  );
}

// ============================================================
// SEG 4 — Carte parchemin propagation
// ============================================================

function EuropeMap() {
  return (
    <g>
      <path
        d="M 60 320 Q 20 300 10 260 Q 0 220 30 190 Q 10 170 20 140 Q 40 110 80 100
           Q 70 70 100 50 Q 130 30 160 40 Q 180 20 210 30 Q 240 10 270 25
           Q 300 15 320 40 Q 350 30 370 60 Q 400 50 420 80 Q 450 90 460 120
           Q 480 150 460 180 Q 490 210 470 240 Q 480 270 460 290 Q 440 320 400 330
           Q 380 360 350 370 Q 320 390 290 380 Q 260 400 230 390 Q 200 410 170 400
           Q 140 415 110 400 Q 80 390 60 370 Q 40 350 60 320 Z"
        fill={C.landMap} stroke={C.ink} strokeWidth={1.5}
      />
      <path
        d="M 60 320 Q 30 340 20 370 Q 10 400 40 420 Q 70 440 100 430
           Q 130 450 150 435 Q 170 420 160 390 Q 170 360 150 340
           Q 130 320 110 330 Q 90 340 60 320 Z"
        fill={C.landMap} stroke={C.ink} strokeWidth={1.5}
      />
      <path
        d="M 290 310 Q 300 330 295 360 Q 290 390 280 410 Q 275 430 285 445
           Q 295 455 305 445 Q 315 430 320 400 Q 330 370 325 340 Q 315 315 290 310 Z"
        fill={C.landMap} stroke={C.ink} strokeWidth={1.5}
      />
      <ellipse cx={295} cy={462} rx={18} ry={10} fill={C.landMap} stroke={C.ink} strokeWidth={1} />
      <path
        d="M 120 80 Q 100 60 110 40 Q 130 20 150 30 Q 170 20 175 50 Q 180 80 160 95 Q 140 100 120 80 Z"
        fill={C.landMap} stroke={C.ink} strokeWidth={1.5}
      />
    </g>
  );
}

function MapArrow({ x1, y1, x2, y2, progress }: { x1: number; y1: number; x2: number; y2: number; progress: number }) {
  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const drawn = len * progress;
  const cx = x1 + (x2 - x1) * progress;
  const cy = y1 + (y2 - y1) * progress;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={C.vermillon} strokeWidth={2.5}
        strokeDasharray={`${drawn} ${len}`}
        strokeLinecap="round" opacity={0.85} />
      {progress > 0.05 && (
        <circle cx={cx} cy={cy} r={4} fill={C.vermillon} />
      )}
    </g>
  );
}

function MapPoint({ x, y, label, frame, startFrame }: {
  x: number; y: number; label: string; frame: number; startFrame: number;
}) {
  const lf = frame - startFrame;
  if (lf < 0) return null;
  const sc = spring({ frame: lf, fps: 30, config: { damping: 12, stiffness: 200 } });
  const pulse = interpolate((frame % 40) / 40, [0, 0.3, 0.7, 1], [0.7, 0.2, 0.7, 0.7]);
  return (
    <g transform={`translate(${x},${y}) scale(${sc})`}>
      <circle cx={0} cy={0} r={18} fill={C.vermillon} opacity={pulse * 0.25} />
      <circle cx={0} cy={0} r={10} fill={C.vermillon} opacity={pulse * 0.4} />
      <circle cx={0} cy={0} r={6} fill={C.vermillon} stroke={C.ink} strokeWidth={1.5} />
      <text x={0} y={-14} textAnchor="middle" fontSize={12}
        fontFamily="Georgia, serif" fontWeight="bold" fill={C.ink}>{label}</text>
    </g>
  );
}

function Seg4Map({ lf, frame }: { lf: number; frame: number }) {
  const sceneIn = interpolate(lf, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const parchIn = interpolate(lf, [10, 30], [0, 1], { extrapolateRight: "clamp" });
  const parchY = interpolate(lf, [10, 30], [50, 0], { extrapolateRight: "clamp" });

  const W_P = 640; const H_P = 510;
  const cx = (W - W_P) / 2; const cy = (H - H_P) / 2;
  const MX = 55; const MY = 88;

  const kirghizX = MX + 510; const kirghizY = MY + 175;
  const caffaX = MX + 405; const caffaY = MY + 205;
  const messanaX = MX + 295; const messanaY = MY + 462;
  const parisX = MX + 185; const parisY = MY + 180;

  const arr1p = interpolate(lf, [35, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arr2p = interpolate(lf, [75, 115], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arr3p = interpolate(lf, [120, 180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <g opacity={sceneIn}>
      {/* Fond galeres */}
      <rect width={W} height={H} fill={C.skyDay} />
      <rect x={0} y={550} width={W} height={530} fill={C.seaBlue} />
      {Array.from({ length: 4 }, (_, i) => {
        const wx = ((i * 500 + frame * 1.5) % 2400) - 200;
        return (
          <path key={i}
            d={`M ${wx} 650 Q ${wx + 125} 630 ${wx + 250} 650 Q ${wx + 375} 670 ${wx + 500} 650`}
            fill="none" stroke="#4A80B0" strokeWidth={4} opacity={0.45} />
        );
      })}
      <rect width={W} height={H} fill="#050202" opacity={0.5} />

      {/* Parchemin */}
      <g transform={`translate(${cx},${cy + parchY})`} opacity={parchIn}>
        {/* Ombre */}
        <rect x={7} y={7} width={W_P} height={H_P} rx={6} fill="#000" opacity={0.3} />
        {/* Fond */}
        <rect width={W_P} height={H_P} rx={6} fill={C.parchment} />
        <rect x={0} y={0} width={W_P} height={H_P} rx={6} fill="none" stroke={C.gold} strokeWidth={3} />
        <rect x={8} y={8} width={W_P - 16} height={H_P - 16} rx={4} fill="none" stroke={C.goldDark} strokeWidth={1} />
        {/* Titre */}
        <text x={W_P / 2} y={44} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={16} fontWeight="bold"
          fill={C.ink} letterSpacing="3">VIA PESTIS</text>
        <text x={W_P / 2} y={62} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={11} fill={C.inkLight}
          fontStyle="italic" letterSpacing="2">La Route de la Mort · Anno Domini MCCCXLVII</text>
        <line x1={30} y1={72} x2={W_P - 30} y2={72} stroke={C.gold} strokeWidth={1} />

        {/* Carte */}
        <g transform={`translate(${MX},${MY}) scale(0.93)`}>
          <rect x={-10} y={-10} width={535} height={440} rx={4} fill={C.seaMap} opacity={0.4} />
          <EuropeMap />
          <text x={485} y={170} fontSize={8} fontFamily="Georgia, serif" fill={C.inkLight} fontStyle="italic">Orient</text>

          <MapArrow x1={kirghizX - MX} y1={kirghizY - MY} x2={caffaX - MX} y2={caffaY - MY} progress={arr1p} />
          <MapArrow x1={caffaX - MX} y1={caffaY - MY} x2={messanaX - MX} y2={messanaY - MY} progress={arr2p} />
          <MapArrow x1={messanaX - MX} y1={messanaY - MY} x2={parisX - MX} y2={parisY - MY} progress={arr3p} />

          <MapPoint x={kirghizX - MX} y={kirghizY - MY} label="Kirgisia 1338" frame={lf} startFrame={30} />
          <MapPoint x={caffaX - MX}   y={caffaY - MY}   label="Caffa 1346"    frame={lf} startFrame={70} />
          <MapPoint x={messanaX - MX} y={messanaY - MY} label="Messine 1347"  frame={lf} startFrame={115} />
          <MapPoint x={parisX - MX}   y={parisY - MY}   label="Paris 1348"    frame={lf} startFrame={180} />
        </g>
      </g>

      <g opacity={interpolate(lf, [30, 55], [0, 1], { extrapolateRight: "clamp" })}>
        <text x={W / 2} y={H - 38} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={22} fill={C.parchment} fontStyle="italic">
          En deux ans, la moitie de l'Europe allait disparaitre.
        </text>
      </g>

      <SegLabel text="SEGMENT 4 — Carte propagation" sub="Parchemin overlay + fleches progressives + points pulsants" />
    </g>
  );
}

// ============================================================
// SEG 5 — Split-screen avant/apres
// ============================================================

function Seg5Split({ lf, frame }: { lf: number; frame: number }) {
  const sceneIn = interpolate(lf, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  // Divider qui se trace du haut vers le bas
  const dividerH = interpolate(lf, [5, 35], [0, H], { extrapolateRight: "clamp" });
  const labelIn = interpolate(lf, [20, 40], [0, 1], { extrapolateRight: "clamp" });

  return (
    <g opacity={sceneIn}>
      {/* Cote gauche — AVANT 1346 */}
      <clipPath id="clip-left">
        <rect x={0} y={0} width={W / 2} height={H} />
      </clipPath>
      <g clipPath="url(#clip-left)">
        <rect width={W} height={H} fill={C.parchment} />
        <Sky frame={frame} />
        <Church x={600} />
        <House x={80} w={160} h={195} roofH={90} />
        <House x={280} w={130} h={170} roofH={75} />
        <Ground />
        {CROWD_DATA.slice(0, 8).map((d, i) => (
          <Char key={i} x={d.x} frame={frame} phase={d.phase} scale={d.scale} walking />
        ))}
      </g>

      {/* Cote droit — PENDANT 1349 */}
      <clipPath id="clip-right">
        <rect x={W / 2} y={0} width={W / 2} height={H} />
      </clipPath>
      <g clipPath="url(#clip-right)">
        <rect width={W} height={H} fill={C.parchmentD} />
        <Sky frame={frame} nightProgress={0.35} />
        <Church x={600} />
        <House x={80} w={160} h={195} roofH={90} hasCross />
        <House x={280} w={130} h={170} roofH={75} hasCross />
        <PlagueX x={80}  y={GROUND_Y} w={160} />
        <PlagueX x={280} y={GROUND_Y} w={130} />
        <Ground />
      </g>

      {/* Diviseur central */}
      <line x1={W / 2} y1={0} x2={W / 2} y2={dividerH}
        stroke={C.gold} strokeWidth={5} strokeLinecap="round" />
      <circle cx={W / 2} cy={dividerH} r={8} fill={C.gold} />

      {/* Labels */}
      <g opacity={labelIn}>
        <rect x={50} y={H - 100} width={220} height={58} rx={6} fill={C.skyDay} opacity={0.9} />
        <text x={160} y={H - 76} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={20} fill={C.parchment} fontWeight="bold">AVANT — 1346</text>
        <text x={160} y={H - 56} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={13} fill={C.parchmentD}>Village vivant</text>

        <rect x={W - 270} y={H - 100} width={220} height={58} rx={6} fill={C.ink} opacity={0.9} />
        <text x={W - 160} y={H - 76} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={20} fill={C.parchment} fontWeight="bold">PENDANT — 1349</text>
        <text x={W - 160} y={H - 56} textAnchor="middle"
          fontFamily="Georgia, serif" fontSize={13} fill={C.parchmentD}>Village vide</text>
      </g>

      <SegLabel text="SEGMENT 5 — Split-screen avant/apres" sub="clipPath + diviseur or + labels datees" />
      <Caption text="Dualite visuelle : avant / pendant la peste — une seule composition" />
    </g>
  );
}

// ============================================================
// SEG 6 — Texte qui s'ecrit style scribe
// ============================================================

const SCRIBE_LINES = [
  { text: "Anno Domini MCCCXLVII,",           startFrame: 10  },
  { text: "en l'an de grace mil trois cent",   startFrame: 55  },
  { text: "quarante-sept, une pestilence",      startFrame: 100 },
  { text: "d'une violence inouie s'abattit",    startFrame: 145 },
  { text: "sur les terres de Chretiente.",      startFrame: 190 },
  { text: "Nul ne fut epargne.",                startFrame: 235 },
];

function Seg6Scribe({ lf }: { lf: number }) {
  const sceneIn = interpolate(lf, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <g opacity={sceneIn}>
      <rect width={W} height={H} fill={C.parchment} />

      {/* Parchemin decoratif */}
      <rect x={320} y={80} width={1280} height={820} rx={8}
        fill={C.parchmentD} stroke={C.gold} strokeWidth={3} opacity={0.6} />
      <rect x={328} y={88} width={1264} height={804} rx={6}
        fill="none" stroke={C.goldDark} strokeWidth={1} opacity={0.5} />

      {/* Lignes reglures */}
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i}
          x1={380} y1={200 + i * 62} x2={1540} y2={200 + i * 62}
          stroke={C.inkLight} strokeWidth={0.8} opacity={0.25} />
      ))}

      {/* Lettrine ornementale */}
      <text x={395} y={295}
        fontFamily="Georgia, serif" fontSize={88} fontWeight="bold"
        fill={C.vermillon} stroke={C.gold} strokeWidth={1} opacity={0.95}>A</text>

      {/* Lignes de texte avec apparition progressive */}
      {SCRIBE_LINES.map((line, i) => {
        const localF = lf - line.startFrame;
        if (localF < 0) return null;

        // Chaque ligne apparait caractere par caractere
        const charsVisible = Math.floor(interpolate(localF, [0, 35], [0, line.text.length], {
          extrapolateRight: "clamp",
        }));
        const visibleText = line.text.slice(0, charsVisible);

        // Curseur clignotant
        const cursorVisible = charsVisible < line.text.length && Math.floor(lf / 8) % 2 === 0;

        const textX = i === 0 ? 490 : 410;

        return (
          <g key={i}>
            <text
              x={textX} y={260 + i * 72}
              fontFamily="Georgia, serif"
              fontSize={i === 0 ? 32 : 28}
              fill={C.ink}
              fontStyle={i > 0 ? "italic" : "normal"}
            >
              {visibleText}
              {cursorVisible && "|"}
            </text>
          </g>
        );
      })}

      {/* Plume */}
      {lf < 270 && (
        <g transform={`translate(${interpolate(lf, [0, 270], [490, 850], { extrapolateRight: "clamp" })},${260 + Math.floor((lf - 10) / 45) * 72})`}>
          <path d="M 0 0 Q -15 -30 -5 -55 Q 5 -30 0 0" fill={C.parchmentDDD} stroke={C.inkLight} strokeWidth={1.5} />
          <line x1={0} y1={0} x2={-8} y2={18} stroke={C.ink} strokeWidth={1.5} />
        </g>
      )}

      <SegLabel text="SEGMENT 6 — Texte style scribe" sub="Caracteres apparaissent un a un, plume animee" />
    </g>
  );
}

// ============================================================
// SEG 7 — Parallax 3 couches
// ============================================================

function Seg7Parallax({ lf, frame }: { lf: number; frame: number }) {
  const sceneIn = interpolate(lf, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  // Camera qui avance : scroll offset progresse
  const scrollMax = 800;
  const scroll = interpolate(lf, [20, 280], [0, scrollMax], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 3 vitesses de parallax
  const bg = scroll * 0.25;   // nuages / ciel
  const mid = scroll * 0.65;  // batiments
  const fg = scroll * 1.0;    // personnages / sol

  return (
    <g opacity={sceneIn}>
      {/* COUCHE 0 : Ciel + nuages (lente) */}
      <g transform={`translate(${-bg},0)`}>
        <rect x={-200} width={W + 400} height={GROUND_Y} fill={C.parchmentD} opacity={0.4} />
        <Cloud cx={300}  cy={130} scale={1.1} opacity={0.65} />
        <Cloud cx={800}  cy={100} scale={0.9} opacity={0.55} />
        <Cloud cx={1300} cy={145} scale={1.0} opacity={0.6} />
        <Cloud cx={1900} cy={110} scale={0.85} opacity={0.5} />
        <Cloud cx={2500} cy={135} scale={1.05} opacity={0.55} />
      </g>

      {/* COUCHE 1 : Batiments (vitesse moyenne) */}
      <g transform={`translate(${-mid},0)`}>
        <House x={100}  w={160} h={195} roofH={90} />
        <House x={350}  w={130} h={170} roofH={75} />
        <Church x={600} />
        <House x={1000} w={145} h={185} roofH={85} />
        <House x={1250} w={155} h={190} roofH={85} />
        <House x={1500} w={140} h={175} roofH={80} />
        <House x={1780} w={125} h={160} roofH={70} />
        <House x={2050} w={150} h={180} roofH={82} />
        <House x={2300} w={135} h={170} roofH={76} />
      </g>

      {/* COUCHE 2 : Sol + personnages (vitesse normale) */}
      <g transform={`translate(${-fg},0)`}>
        {/* Sol etendu */}
        <line x1={-200} y1={GROUND_Y} x2={W + 1200} y2={GROUND_Y} stroke={C.ink} strokeWidth={2.5} />
        {Array.from({ length: 50 }, (_, i) => (
          <rect key={i} x={40 + i * 62} y={GROUND_Y + 8} width={48 + (i * 13) % 25} height={16} rx={4}
            fill="none" stroke={C.inkLight} strokeWidth={1} opacity={0.3} />
        ))}
        {/* Personnages */}
        {CROWD_DATA.map((d, i) => (
          <Char key={i} x={d.x + 200} frame={frame} phase={d.phase} scale={d.scale} walking />
        ))}
        {/* Deuxieme groupe de personnages plus loin */}
        {CROWD_DATA.slice(0, 15).map((d, i) => (
          <Char key={"b" + i} x={d.x + 1000} frame={frame} phase={d.phase + 100} scale={d.scale * 0.85} walking />
        ))}
      </g>

      {/* Indicateur parallax */}
      <g opacity={interpolate(lf, [0, 20], [0, 1], { extrapolateRight: "clamp" })}>
        {[
          { label: "Couche 0 — ciel (0.25x)", color: "#4A80B0", y: H - 130 },
          { label: "Couche 1 — batiments (0.65x)", color: C.parchmentDDD, y: H - 100 },
          { label: "Couche 2 — personnages (1.0x)", color: C.ink, y: H - 70 },
        ].map((l, i) => (
          <g key={i}>
            <rect x={W - 400} y={l.y - 18} width={14} height={14} rx={2} fill={l.color} stroke={C.inkLight} strokeWidth={1} />
            <text x={W - 378} y={l.y - 6}
              fontFamily="Georgia, serif" fontSize={14} fill={C.inkLight}>{l.label}</text>
          </g>
        ))}
      </g>

      <SegLabel text="SEGMENT 7 — Parallax 3 couches" sub="Camera avance — chaque couche a sa vitesse propre" />
    </g>
  );
}

// ============================================================
// SEG 8 — Nuit progressive, torche, ombres
// ============================================================

function Seg8Night({ lf, frame }: { lf: number; frame: number }) {
  const sceneIn = interpolate(lf, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const nightP = interpolate(lf, [20, 180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const torchX = 520;
  const torchY = GROUND_Y - 220;

  // Flamme qui pulse
  const flicker = 1 + Math.sin(frame * 0.35) * 0.12 + Math.sin(frame * 0.72) * 0.07;
  const torchR = 180 * flicker;

  // Ombres portees des batiments (s'allongent avec la nuit)
  const shadowLen = interpolate(nightP, [0, 1], [0, 280]);
  const shadowOp = interpolate(nightP, [0, 1], [0, 0.4]);

  return (
    <g opacity={sceneIn}>
      {/* Fond nuit progressif */}
      <rect width={W} height={H} fill={C.parchment} />
      <rect width={W} height={H} fill={C.skyDusk} opacity={nightP} />

      {/* Halo de torche */}
      {nightP > 0.05 && (
        <>
          <radialGradient id="torchGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={C.torchCore}  stopOpacity={0.55 * nightP} />
            <stop offset="40%"  stopColor={C.torchGlow}  stopOpacity={0.3 * nightP} />
            <stop offset="100%" stopColor={C.torchGlow}  stopOpacity={0} />
          </radialGradient>
          <ellipse cx={torchX} cy={torchY + 60} rx={torchR * 1.3} ry={torchR}
            fill="url(#torchGrad)" />
        </>
      )}

      {/* Ombres portees batiments */}
      <polygon
        points={`${80},${GROUND_Y} ${80 + 160},${GROUND_Y} ${80 + 160 + shadowLen},${GROUND_Y} ${80 + shadowLen},${GROUND_Y}`}
        fill={C.ink} opacity={shadowOp}
      />
      <polygon
        points={`${820},${GROUND_Y} ${820 + 200},${GROUND_Y} ${820 + 200 + shadowLen * 1.4},${GROUND_Y} ${820 + shadowLen * 1.4},${GROUND_Y}`}
        fill={C.ink} opacity={shadowOp * 0.8}
      />

      {/* Batiments */}
      <Church x={820} />
      <House x={80}  w={160} h={195} roofH={90} hasCross />
      <House x={280} w={130} h={170} roofH={75} />
      <House x={1350} w={155} h={190} roofH={85} hasCross />
      <House x={1700} w={125} h={160} roofH={70} />

      <Ground />

      {/* Personnage avec torche */}
      <Char x={torchX} frame={frame} scale={1.1} walking={false} />
      {/* Torche */}
      <rect x={torchX + 38} y={torchY + 40} width={8} height={60} rx={3}
        fill={C.parchmentDDD} stroke={C.inkLight} strokeWidth={1.5} />
      {/* Flamme */}
      <path
        d={`M ${torchX + 42} ${torchY + 40} Q ${torchX + 32} ${torchY + 20} ${torchX + 42} ${torchY}
            Q ${torchX + 52} ${torchY + 20} ${torchX + 42} ${torchY + 40}`}
        fill={C.torchCore} opacity={0.9 * flicker}
      />
      <path
        d={`M ${torchX + 42} ${torchY + 38} Q ${torchX + 36} ${torchY + 22} ${torchX + 42} ${torchY + 8}
            Q ${torchX + 48} ${torchY + 22} ${torchX + 42} ${torchY + 38}`}
        fill={C.torchGlow} opacity={0.7 * flicker}
      />

      {/* Etoiles (nuit) */}
      {nightP > 0.3 && Array.from({ length: 18 }, (_, i) => {
        const sx = 100 + i * 110 + (i % 3) * 30;
        const sy = 60 + (i % 5) * 55;
        const sop = (nightP - 0.3) * 1.4;
        return <circle key={i} cx={sx} cy={sy} r={2.5} fill={C.parchmentD} opacity={sop * 0.8} />;
      })}

      <SegLabel text="SEGMENT 8 — Nuit progressive" sub="Gradient radial torche + ombres portees + etoiles" />
      <Caption text="La nuit — une seule lumiere dans le village" />
    </g>
  );
}

// ============================================================
// SEG 9 — 5 archetyypes avec identites fortes
// ============================================================

const ARCHETYPES = [
  {
    label: "Marchand",
    sublabel: "Enrichi par le commerce",
    x: 160,
    props: { hasHat: true, hatColor: "#2a4a2a", bodyFill: "#6a8a4a", legFill: "#3a5a3a" },
    appearFrame: 15,
  },
  {
    label: "Paysan",
    sublabel: "Serf de la glebe",
    x: 480,
    props: { bodyFill: C.parchmentDD, legFill: C.inkLight },
    appearFrame: 45,
  },
  {
    label: "Noble",
    sublabel: "Seigneur du domaine",
    x: 800,
    props: { hasCrown: true, bodyFill: "#5a3a7a", legFill: "#3a2060", headFill: C.parchmentD },
    scale: 1.15,
    appearFrame: 75,
  },
  {
    label: "Moine",
    sublabel: "Serviteur de Dieu",
    x: 1120,
    props: { hasHood: true, hasRobe: true, bodyFill: "#4a3a2a", legFill: "#3a2a1a" },
    appearFrame: 105,
  },
  {
    label: "Medecin",
    sublabel: "Docteur de la Peste",
    x: 1440,
    props: { hasBeak: true, hasRobe: true, hasStaff: true, bodyFill: C.ink, legFill: C.ink },
    appearFrame: 135,
  },
];

function Seg9Archetypes({ lf, frame }: { lf: number; frame: number }) {
  const sceneIn = interpolate(lf, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <g opacity={sceneIn}>
      <ParchBg />
      {/* Ligne de sol ornee */}
      <line x1={80} y1={GROUND_Y} x2={W - 80} y2={GROUND_Y} stroke={C.gold} strokeWidth={3} />
      <line x1={80} y1={GROUND_Y + 4} x2={W - 80} y2={GROUND_Y + 4} stroke={C.goldDark} strokeWidth={1} />

      {/* Titre general */}
      <g opacity={interpolate(lf, [5, 25], [0, 1], { extrapolateRight: "clamp" })}>
        <text x={W / 2} y={90}
          textAnchor="middle" fontFamily="Georgia, serif"
          fontSize={32} fontWeight="bold" fill={C.ink}>
          Les Cinq Visages de la Societe Medievale
        </text>
        <line x1={300} y1={105} x2={W - 300} y2={105} stroke={C.gold} strokeWidth={1.5} />
      </g>

      {/* Chaque archetype entre avec spring */}
      {ARCHETYPES.map((arch, i) => {
        const localF = lf - arch.appearFrame;
        if (localF < 0) return null;
        const sc = spring({ frame: localF, fps: 30, config: { damping: 14, stiffness: 160 } });
        const yDrop = interpolate(localF, [0, 20], [-60, 0], { extrapolateRight: "clamp" });
        const labelOp = interpolate(localF, [15, 35], [0, 1], { extrapolateRight: "clamp" });

        return (
          <g key={i} transform={`translate(0,${yDrop})`} style={{ transformOrigin: `${arch.x}px ${GROUND_Y}px` }}>
            <Char
              x={arch.x}
              frame={frame}
              phase={i * 40}
              scale={(arch.scale || 1.0) * sc}
              walking={false}
              {...(arch.props as Partial<CharProps>)}
            />
            {/* Label */}
            <g opacity={labelOp}>
              <rect x={arch.x - 90} y={GROUND_Y + 30} width={180} height={65} rx={6}
                fill={C.ink} opacity={0.85} />
              <text x={arch.x} y={GROUND_Y + 60}
                textAnchor="middle" fontFamily="Georgia, serif"
                fontSize={20} fontWeight="bold" fill={C.parchment}>{arch.label}</text>
              <text x={arch.x} y={GROUND_Y + 83}
                textAnchor="middle" fontFamily="Georgia, serif"
                fontSize={13} fill={C.parchmentD} fontStyle="italic">{arch.sublabel}</text>
            </g>
          </g>
        );
      })}

      {/* Flourishes decoratifs entre les personnages */}
      {[320, 640, 960, 1280].map((x, i) => (
        <g key={i} opacity={interpolate(lf, [160 + i * 10, 180 + i * 10], [0, 1], { extrapolateRight: "clamp" })}>
          <line x1={x} y1={GROUND_Y - 200} x2={x} y2={GROUND_Y}
            stroke={C.goldDark} strokeWidth={1} opacity={0.3} strokeDasharray="4,6" />
        </g>
      ))}

      <SegLabel text="SEGMENT 9 — 5 Archetyypes identifies" sub="Marchand, Paysan, Noble, Moine, Medecin — chacun reconnaissable" />
    </g>
  );
}

// ============================================================
// SEG 10 — Transition parchemin -> scene live
// ============================================================

function Seg10Transition({ lf, frame }: { lf: number; frame: number }) {
  const sceneIn = interpolate(lf, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Phase 1 (0-80) : parchemin visible avec texte
  // Phase 2 (80-160) : parchemin qui tourne (3D flip simulee avec scaleX)
  // Phase 3 (160-240) : scene decouverte sous le parchemin
  // Phase 4 (240-299) : scene vivante en plein ecran

  const flipProgress = interpolate(lf, [80, 160], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const sceneReveal = interpolate(lf, [160, 220], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Simulation flip 3D : scaleX va de 1 -> 0 -> 1
  const parchScaleX = flipProgress < 0.5
    ? 1 - flipProgress * 2
    : (flipProgress - 0.5) * 2;
  const showScene = flipProgress >= 0.5;

  const W_P = 780; const H_P = 520;
  const px = (W - W_P) / 2; const py = (H - H_P) / 2;

  return (
    <g opacity={sceneIn}>
      {/* Scene en arriere-plan (revelee progressivement) */}
      <g opacity={sceneReveal}>
        <rect width={W} height={H} fill={C.parchment} />
        <Sky frame={frame} />
        <Church x={820} />
        <House x={100} w={160} h={195} roofH={90} />
        <House x={320} w={130} h={170} roofH={75} />
        <House x={1380} w={155} h={190} roofH={85} />
        <House x={1580} w={140} h={175} roofH={80} />
        <Smoke bx={420}  by={GROUND_Y - 175} frame={frame} />
        <Smoke bx={1450} by={GROUND_Y - 185} frame={frame} opacity={0.7} />
        <Ground />
        {CROWD_DATA.slice(0, 12).map((d, i) => (
          <Char key={i} x={d.x + 60} frame={frame} phase={d.phase} scale={d.scale} walking />
        ))}
      </g>

      {/* Parchemin qui se retourne */}
      <g transform={`translate(${px + W_P / 2},${py + H_P / 2})`}>
        <g transform={`scale(${parchScaleX},1)`}>
          <g transform={`translate(${-W_P / 2},${-H_P / 2})`}>
            {/* Face parchemin (visible quand scaleX > 0 et !showScene) */}
            {!showScene && (
              <>
                <rect x={4} y={4} width={W_P} height={H_P} rx={6} fill="#000" opacity={0.25} />
                <rect width={W_P} height={H_P} rx={6} fill={C.parchmentD} />
                <rect width={W_P} height={H_P} rx={6} fill="none" stroke={C.gold} strokeWidth={3} />
                <rect x={8} y={8} width={W_P - 16} height={H_P - 16} rx={4}
                  fill="none" stroke={C.goldDark} strokeWidth={1} />
                <text x={W_P / 2} y={H_P / 2 - 30}
                  textAnchor="middle" fontFamily="Georgia, serif"
                  fontSize={36} fontWeight="bold" fill={C.ink}>CHRONICA PESTIS</text>
                <text x={W_P / 2} y={H_P / 2 + 15}
                  textAnchor="middle" fontFamily="Georgia, serif"
                  fontSize={18} fill={C.inkLight} fontStyle="italic">
                  Anno Domini MCCCXLVII
                </text>
                <line x1={80} y1={H_P / 2 + 30} x2={W_P - 80} y2={H_P / 2 + 30}
                  stroke={C.gold} strokeWidth={1.5} />
              </>
            )}
            {/* Face scene (visible apres le flip) */}
            {showScene && (
              <rect width={W_P} height={H_P} rx={6} fill="transparent" />
            )}
          </g>
        </g>
      </g>

      {/* Texte de conclusion */}
      <g opacity={interpolate(lf, [240, 270], [0, 1], { extrapolateRight: "clamp" })}>
        <rect x={W / 2 - 500} y={H - 110} width={1000} height={70} rx={6}
          fill={C.ink} opacity={0.75} />
        <text x={W / 2} y={H - 80}
          textAnchor="middle" fontFamily="Georgia, serif"
          fontSize={26} fill={C.parchment} fontStyle="italic">
          Le parchemin s'ouvre — la Peste entre dans le monde vivant.
        </text>
        <text x={W / 2} y={H - 52}
          textAnchor="middle" fontFamily="Georgia, serif"
          fontSize={16} fill={C.parchmentD}>
          Transition : archive historique → scene narrative
        </text>
      </g>

      <SegLabel text="SEGMENT 10 — Transition parchemin" sub="Flip 3D simule — le document devient scene vivante" />
    </g>
  );
}

// ============================================================
// COMPOSITION PRINCIPALE
// ============================================================

export const ParcheminLab: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const seg = Math.floor(frame / SEG);
  const lf  = frame - seg * SEG;  // local frame dans le segment

  // Fade entre segments
  const segFade = interpolate(lf, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: C.parchment }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>

        {seg === 0 && (
          <g opacity={segFade}>
            <Seg1Village lf={lf} />
          </g>
        )}

        {seg === 1 && (
          <g opacity={segFade}>
            <Seg2Vide lf={lf} frame={frame} />
          </g>
        )}

        {seg === 2 && (
          <g opacity={segFade}>
            <Seg3Doctor lf={lf} frame={frame} />
          </g>
        )}

        {seg === 3 && (
          <g opacity={segFade}>
            <Seg4Map lf={lf} frame={frame} />
          </g>
        )}

        {seg === 4 && (
          <g opacity={segFade}>
            <Seg5Split lf={lf} frame={frame} />
          </g>
        )}

        {seg === 5 && (
          <g opacity={segFade}>
            <Seg6Scribe lf={lf} />
          </g>
        )}

        {seg === 6 && (
          <g opacity={segFade}>
            <Seg7Parallax lf={lf} frame={frame} />
          </g>
        )}

        {seg === 7 && (
          <g opacity={segFade}>
            <Seg8Night lf={lf} frame={frame} />
          </g>
        )}

        {seg === 8 && (
          <g opacity={segFade}>
            <Seg9Archetypes lf={lf} frame={frame} />
          </g>
        )}

        {seg === 9 && (
          <g opacity={segFade}>
            <Seg10Transition lf={lf} frame={frame} />
          </g>
        )}

        {/* Compteur de segment */}
        <text
          x={W - 50} y={H - 35}
          textAnchor="end"
          fontFamily="Georgia, serif"
          fontSize={16}
          fill={C.inkLight}
          opacity={0.5}
        >
          {seg + 1}/10
        </text>
      </svg>
    </AbsoluteFill>
  );
};
