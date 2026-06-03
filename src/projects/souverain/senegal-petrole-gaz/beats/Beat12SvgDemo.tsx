import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const KRAFT_BG   = "#e8d5b0";
const KRAFT_DARK = "#2d1810";
const KRAFT_MID  = "#c4a882";
const GOLD       = "#c8a951";
const GOLD_LIGHT = "#f0d88a";
const RED_BRICK  = "#8b2020";
const IVORY      = "#f5f0e8";

const S_COFFRE   = 0;
const S_JAUGE    = 120;
const S_FLOW     = 240;
const S_SHIELD   = 360;

export const BEAT12_SVG_DEMO_FRAMES = 450;

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const sx = cx + r * Math.cos(toRad(startDeg));
  const sy = cy + r * Math.sin(toRad(startDeg));
  const ex = cx + r * Math.cos(toRad(endDeg));
  const ey = cy + r * Math.sin(toRad(endDeg));
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
}

// ── Coffre FONSIS (centré, grand) ─────────────────────────
function CoffreFONSIS({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const local = frame - S_COFFRE;

  const appear   = spring({ frame: local, fps, config: { damping: 14, stiffness: 80 }, durationInFrames: 25 });
  const ouverture = interpolate(local, [30, 90], [0, -52], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pieceProg = interpolate(local, [60, 110], [0, 1],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const coins = [
    { x: -60, y: -20, delay: 0 },
    { x:   0, y: -45, delay: 8 },
    { x:  60, y: -20, delay: 16 },
  ];

  return (
    <g transform={`translate(960, 510) scale(${appear})`}>
      {/* Base */}
      <rect x={-200} y={-130} width={400} height={290} rx={18} ry={18}
        fill={KRAFT_DARK} stroke={GOLD} strokeWidth={4} />
      {/* Bandes horizontale et verticale */}
      <rect x={-200} y={-20} width={400} height={20} fill={GOLD} opacity={0.35} />
      <rect x={-22} y={-130} width={44} height={290} fill={GOLD} opacity={0.25} />
      {/* Coins dorés */}
      {[[-200,-130],[160,-130],[160,130],[-200,130]].map(([cx,cy],i) => (
        <circle key={i} cx={cx + (i > 1 ? 40 : 40)} cy={cy + (i % 3 === 0 ? 40 : -40)} r={10} fill={GOLD} opacity={0.6} />
      ))}
      {/* Serrure */}
      <circle cx={0} cy={65} r={28} fill={GOLD} />
      <rect x={-12} y={65} width={24} height={30} rx={5} fill={KRAFT_DARK} />
      <circle cx={0} cy={58} r={12} fill={KRAFT_DARK} />
      {/* Couvercle */}
      <g transform={`rotate(${ouverture}, 0, -130)`}>
        <rect x={-200} y={-255} width={400} height={130} rx={18} ry={18}
          fill={KRAFT_DARK} stroke={GOLD} strokeWidth={4} />
        <rect x={-200} y={-175} width={400} height={20} fill={GOLD} opacity={0.3} />
        <text x={0} y={-190} textAnchor="middle" fill={GOLD}
          fontFamily="'Bebas Neue', sans-serif" fontSize={48} letterSpacing={8}>
          FONSIS
        </text>
      </g>
      {/* Pièces */}
      {coins.map((c, i) => {
        const cp = interpolate(local, [60 + c.delay, 105 + c.delay], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        return (
          <g key={i} transform={`translate(${c.x * cp}, ${c.y * cp - 150})`} opacity={cp}>
            <ellipse cx={0} cy={0} rx={22} ry={13} fill={GOLD_LIGHT} stroke={GOLD} strokeWidth={2} />
            <text x={0} y={5} textAnchor="middle" fill={KRAFT_DARK} fontSize={12} fontFamily="monospace" fontWeight="bold">$</text>
          </g>
        );
      })}
      {/* Libellé bas */}
      <text x={0} y={220} textAnchor="middle" fill={IVORY}
        fontFamily="'IBM Plex Mono', monospace" fontSize={22} letterSpacing={8}>
        FONDS SOUVERAIN
      </text>
    </g>
  );
}

// ── Jauge dette ───────────────────────────────────────────
function JaugeDette({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const local = frame - S_JAUGE;

  const appear = spring({ frame: local, fps, config: { damping: 14, stiffness: 80 }, durationInFrames: 20 });
  const prog   = interpolate(local, [20, 90], [0, 0.70], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pct    = Math.round(prog * 100);

  const START_DEG = 140;
  const SWEEP     = 270;
  const R         = 160;
  const CX        = 960;
  const CY        = 520;

  const alarmProg = interpolate(local, [80, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shakeX    = alarmProg > 0.05 ? 5 * Math.sin(local * 1.4) * Math.exp(-local * 0.025) : 0;
  const arcColor  = pct >= 60 ? RED_BRICK : GOLD;

  return (
    <g transform={`translate(${shakeX}, 0)`} style={{ transformOrigin: `${CX}px ${CY}px` }}>
      <g transform={`translate(${CX},${CY}) scale(${appear}) translate(${-CX},${-CY})`}>
        {/* Track fond */}
        <path d={describeArc(CX, CY, R, START_DEG, START_DEG + SWEEP)}
          fill="none" stroke={KRAFT_MID} strokeWidth={26} strokeLinecap="round" opacity={0.35} />
        {/* Arc progressif */}
        <path d={describeArc(CX, CY, R, START_DEG, START_DEG + SWEEP * prog + 0.001)}
          fill="none" stroke={arcColor} strokeWidth={26} strokeLinecap="round" />
        {/* Chiffre central */}
        <text x={CX} y={CY + 28} textAnchor="middle" fill={arcColor}
          fontFamily="'IBM Plex Mono', monospace" fontSize={110} fontWeight="bold">
          {pct}%
        </text>
        <text x={CX} y={CY + 75} textAnchor="middle" fill={IVORY}
          fontFamily="'IBM Plex Mono', monospace" fontSize={22} letterSpacing={4}>
          DU PIB
        </text>
        {/* Label haut */}
        <text x={CX} y={CY - 190} textAnchor="middle" fill={IVORY}
          fontFamily="'Bebas Neue', sans-serif" fontSize={32} letterSpacing={6}>
          DETTE PUBLIQUE
        </text>
        {/* Badge FMI */}
        <g transform={`translate(${CX}, ${CY + 205}) scale(${alarmProg})`}
          style={{ transformOrigin: `${CX}px ${CY + 205}px` }}>
          <rect x={-110} y={-32} width={220} height={64} rx={8} fill={RED_BRICK} />
          <text x={0} y={10} textAnchor="middle" fill={IVORY}
            fontFamily="'Bebas Neue', sans-serif" fontSize={32} letterSpacing={5}>
            ⚠ FMI ALERTE
          </text>
        </g>
      </g>
    </g>
  );
}

// ── ProcessFlow (3 nœuds centrés sur 1920) ────────────────
function ProcessFlow({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const local = frame - S_FLOW;

  const b1 = spring({ frame: local - 0,  fps, config: { damping: 14, stiffness: 100 }, durationInFrames: 20 });
  const a1 = spring({ frame: local - 28, fps, config: { damping: 14, stiffness: 100 }, durationInFrames: 20 });
  const b2 = spring({ frame: local - 42, fps, config: { damping: 14, stiffness: 100 }, durationInFrames: 20 });
  const a2 = spring({ frame: local - 70, fps, config: { damping: 14, stiffness: 100 }, durationInFrames: 20 });
  const b3 = spring({ frame: local - 84, fps, config: { damping: 14, stiffness: 100 }, durationInFrames: 20 });
  const springs = [b1, b2, b3];

  // 3 nœuds équidistants : 380 / 960 / 1540
  const nodes = [
    { x: 380,  label: "FONSIS",  sub: "Fonds souverain", col: GOLD },
    { x: 960,  label: "VANNE",   sub: "Transfert",       col: KRAFT_MID },
    { x: 1540, label: "BUDGET",  sub: "Général",         col: RED_BRICK },
  ];

  // Flèches entre nœuds (de bord droit nœud → bord gauche nœud suivant)
  const arrows = [
    { x1: 480, x2: 860, sp: a1 },
    { x1: 1060, x2: 1440, sp: a2 },
  ];

  return (
    <g>
      {/* Titre */}
      <text x={960} y={300} textAnchor="middle" fill={IVORY}
        fontFamily="'Bebas Neue', sans-serif" fontSize={34} letterSpacing={8}
        opacity={b1}>
        LE RISQUE : VARIABLE D'AJUSTEMENT
      </text>

      {/* Nœuds */}
      {nodes.map((n, i) => (
        <g key={i} transform={`translate(${n.x}, 540) scale(${springs[i]})`}>
          <rect x={-95} y={-60} width={190} height={120} rx={12}
            fill={KRAFT_DARK} stroke={n.col} strokeWidth={3} />
          <text x={0} y={8} textAnchor="middle" fill={n.col}
            fontFamily="'Bebas Neue', sans-serif" fontSize={36} letterSpacing={3}>
            {n.label}
          </text>
          <text x={0} y={38} textAnchor="middle" fill={IVORY}
            fontFamily="'IBM Plex Mono', monospace" fontSize={15}>
            {n.sub}
          </text>
        </g>
      ))}

      {/* Flèches progressives */}
      {arrows.map((a, i) => {
        const len = (a.x2 - a.x1) * a.sp;
        const arrowVisible = a.sp > 0.85;
        return (
          <g key={i}>
            <line x1={a.x1} y1={540} x2={a.x1 + len} y2={540}
              stroke={GOLD} strokeWidth={3.5} strokeDasharray="8 5" />
            {arrowVisible && (
              <polygon
                points={`${a.x2},530 ${a.x2 + 22},540 ${a.x2},550`}
                fill={GOLD} />
            )}
          </g>
        );
      })}

      {/* Annotation rouge sous BUDGET */}
      <text x={1540} y={665} textAnchor="middle" fill={RED_BRICK}
        fontFamily="'IBM Plex Mono', monospace" fontSize={17} letterSpacing={1}
        opacity={b3}>
        ← PIB CAPTURÉ
      </text>
    </g>
  );
}

// ── Shields Norvège / Sénégal ─────────────────────────────
function ShieldsComparaison({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const local = frame - S_SHIELD;

  const norv  = spring({ frame: local - 0,  fps, config: { damping: 12, stiffness: 80 }, durationInFrames: 25 });
  const seneg = spring({ frame: local - 22, fps, config: { damping: 12, stiffness: 80 }, durationInFrames: 25 });

  // Forme bouclier pointu en bas
  const shieldPath = "M 0,-110 L 95,-55 L 95,35 L 0,115 L -95,35 L -95,-55 Z";

  return (
    <g>
      {/* Ligne de séparation centrale */}
      <line x1={960} y1={320} x2={960} y2={760} stroke={KRAFT_MID} strokeWidth={1.5} opacity={0.4} />

      {/* Label titre */}
      <text x={960} y={285} textAnchor="middle" fill={IVORY}
        fontFamily="'Bebas Neue', sans-serif" fontSize={28} letterSpacing={7}
        opacity={norv}>
        COMPARAISON RÉGLEMENTAIRE
      </text>

      {/* Norvège */}
      <g transform={`translate(480, 510) scale(${norv})`}>
        <path d={shieldPath} fill={KRAFT_DARK} stroke={GOLD} strokeWidth={4} />
        <rect x={-10} y={-75} width={20} height={150} fill={GOLD} />
        <rect x={-70} y={-10} width={140} height={20} fill={GOLD} />
        <text x={0} y={180} textAnchor="middle" fill={GOLD}
          fontFamily="'Bebas Neue', sans-serif" fontSize={38} letterSpacing={5}>
          NORVÈGE
        </text>
        <text x={0} y={215} textAnchor="middle" fill={IVORY}
          fontFamily="'IBM Plex Mono', monospace" fontSize={17}>
          Règles strictes
        </text>
        {/* Checkmark */}
        <text x={0} y={42} textAnchor="middle" fill={GOLD}
          fontFamily="'IBM Plex Mono', monospace" fontSize={52}>
          ✓
        </text>
      </g>

      {/* Sénégal */}
      <g transform={`translate(1440, 510) scale(${seneg})`}>
        <path d={shieldPath} fill={KRAFT_DARK} stroke={RED_BRICK} strokeWidth={4} />
        <text x={0} y={38} textAnchor="middle" fill={RED_BRICK}
          fontFamily="'Bebas Neue', sans-serif" fontSize={110}>
          ?
        </text>
        <text x={0} y={180} textAnchor="middle" fill={RED_BRICK}
          fontFamily="'Bebas Neue', sans-serif" fontSize={38} letterSpacing={5}>
          SÉNÉGAL
        </text>
        <text x={0} y={215} textAnchor="middle" fill={IVORY}
          fontFamily="'IBM Plex Mono', monospace" fontSize={17}>
          Règles fragiles
        </text>
      </g>
    </g>
  );
}

// ── Composition ───────────────────────────────────────────
export const Beat12SvgDemo: React.FC = () => {
  const frame = useCurrentFrame();

  const showCoffre  = frame >= S_COFFRE  && frame < S_JAUGE;
  const showJauge   = frame >= S_JAUGE   && frame < S_FLOW;
  const showFlow    = frame >= S_FLOW    && frame < S_SHIELD;
  const showShields = frame >= S_SHIELD;

  const fadeIn  = (start: number) => interpolate(frame, [start, start + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = (end: number)   => interpolate(frame, [end - 15, end],     [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: KRAFT_BG }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(ellipse at center, transparent 45%, rgba(45,24,16,0.12) 100%)" }} />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {showCoffre && (
          <g opacity={fadeIn(S_COFFRE) * fadeOut(S_JAUGE)}>
            <CoffreFONSIS frame={frame} />
          </g>
        )}
        {showJauge && (
          <g opacity={fadeIn(S_JAUGE) * fadeOut(S_FLOW)}>
            <JaugeDette frame={frame} />
          </g>
        )}
        {showFlow && (
          <g opacity={fadeIn(S_FLOW) * fadeOut(S_SHIELD)}>
            <ProcessFlow frame={frame} />
          </g>
        )}
        {showShields && (
          <g opacity={fadeIn(S_SHIELD)}>
            <ShieldsComparaison frame={frame} />
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
