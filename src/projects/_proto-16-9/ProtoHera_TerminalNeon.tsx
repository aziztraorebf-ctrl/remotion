/**
 * PROTO HERA #3 — REGISTRE TERMINAL NEON (decode de hera.video, references V09 line + V15 donut glow).
 *
 * Registre "tech / marche / data brute" : fond noir #111 + grille sombre + couleurs GLOW (cyan/magenta/vert/jaune).
 * Punchy, jeune. C'est le registre le PLUS eloigne de notre charte parchemin habituelle — a tester comme
 * alternative pour des sujets eco/marche/crypto/tech (pas l'eco-politique premium classique).
 *
 * Grammaire Hera conservee : 1 idee/ecran · 1 accent dominant (sauf donut multicolore = exception assumee) ·
 *   1 geste propre + glow · labels monospace directs.
 *
 * 2 scenes :
 *   SCENE A (0-150)   : LINE chart neon — 2 courbes (cyan + magenta) qui se tracent, glow, % monospace.
 *   SCENE B (150-330) : DONUT neon — 4 quadrants fluo qui se remplissent en sequence + glow + labels colores.
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, Sequence } from "remotion";

const W = 1920;
const H = 1080;

const BG = "#0c0c0e";
const GRID = "#1c1d22";
const CYAN = "#2ee6c8";
const MAGENTA = "#e64bd0";
const GREEN = "#37e07a";
const YELLOW = "#e6d23a";
const BLUE = "#3aa0e6";
const MONO = "'JetBrains Mono','SF Mono',Menlo,monospace";

const NeonGrid: React.FC = () => {
  const step = 96;
  const v = Array.from({ length: Math.ceil(W / step) + 1 }, (_, i) => i * step);
  const h = Array.from({ length: Math.ceil(H / step) + 1 }, (_, i) => i * step);
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <rect width={W} height={H} fill={BG} />
      <g stroke={GRID} strokeWidth={1}>
        {v.map((x) => (
          <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />
        ))}
        {h.map((y) => (
          <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />
        ))}
      </g>
    </svg>
  );
};

const NeonTitle: React.FC<{ text: string; color: string; localFrame: number }> = ({ text, color, localFrame }) => {
  const op = interpolate(localFrame, [4, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // effet "typing cursor" simple : underscore qui clignote
  const blink = Math.floor(localFrame / 15) % 2 === 0;
  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: op,
        fontFamily: MONO,
        fontSize: 56,
        fontWeight: 700,
        color,
        letterSpacing: "4px",
        textShadow: `0 0 18px ${color}aa, 0 0 40px ${color}55`,
      }}
    >
      {text}
      <span style={{ opacity: blink ? 1 : 0.15 }}>_</span>
    </div>
  );
};

// ============================ SCENE A — LINE NEON ============================
const SceneNeonLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const plotX = 280;
  const plotW = W - 560;
  const plotY = 820;
  const plotH = 480;

  const serieA = [0.18, 0.21, 0.23, 0.3, 0.39, 0.5, 0.62, 0.78]; // cyan
  const serieB = [0.1, 0.12, 0.11, 0.15, 0.19, 0.22, 0.26, 0.31]; // magenta

  const mk = (s: number[]) =>
    s.map((v, i) => ({ x: plotX + (plotW * i) / (s.length - 1), y: plotY - plotH * v }));
  const drawA = spring({ fps, frame: Math.max(0, frame - 20), config: { damping: 42, stiffness: 26 } });
  const drawB = spring({ fps, frame: Math.max(0, frame - 38), config: { damping: 42, stiffness: 26 } });

  const lineFor = (xy: { x: number; y: number }[]) => {
    const d = xy.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    let len = 0;
    for (let i = 1; i < xy.length; i++) len += Math.hypot(xy[i].x - xy[i - 1].x, xy[i].y - xy[i - 1].y);
    return { d, len };
  };
  const xyA = mk(serieA);
  const xyB = mk(serieB);
  const la = lineFor(xyA);
  const lb = lineFor(xyB);

  return (
    <AbsoluteFill>
      <NeonTitle text="MARKET SHARE" color={CYAN} localFrame={frame} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="glowA" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* axe X */}
        <line x1={plotX} y1={plotY} x2={plotX + plotW} y2={plotY} stroke="#33343c" strokeWidth={2} />
        {/* courbe magenta (dessous) */}
        <path d={lb.d} fill="none" stroke={MAGENTA} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={lb.len} strokeDashoffset={lb.len * (1 - drawB)} filter="url(#glowA)" />
        {/* courbe cyan (dessus) */}
        <path d={la.d} fill="none" stroke={CYAN} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={la.len} strokeDashoffset={la.len * (1 - drawA)} filter="url(#glowA)" />
        {/* points finaux + valeurs */}
        {drawA > 0.96 && (
          <>
            <circle cx={xyA[xyA.length - 1].x} cy={xyA[xyA.length - 1].y} r={9} fill={CYAN} filter="url(#glowA)" />
            <text x={xyA[xyA.length - 1].x + 24} y={xyA[xyA.length - 1].y + 8} fontFamily={MONO} fontSize={48} fill={CYAN} style={{ filter: "drop-shadow(0 0 8px #2ee6c8)" }}>
              78%
            </text>
          </>
        )}
        {drawB > 0.96 && (
          <>
            <circle cx={xyB[xyB.length - 1].x} cy={xyB[xyB.length - 1].y} r={8} fill={MAGENTA} filter="url(#glowA)" />
            <text x={xyB[xyB.length - 1].x + 24} y={xyB[xyB.length - 1].y + 8} fontFamily={MONO} fontSize={40} fill={MAGENTA}>
              31%
            </text>
          </>
        )}
      </svg>
      {/* legende monospace directe en haut a gauche du plot */}
      <div style={{ position: "absolute", left: plotX, top: 200, fontFamily: MONO, fontSize: 30, opacity: interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <div style={{ color: CYAN }}>■ AFRICA</div>
        <div style={{ color: MAGENTA, marginTop: 8 }}>■ REST OF WORLD</div>
      </div>
    </AbsoluteFill>
  );
};

// ============================ SCENE B — DONUT NEON ============================
const SceneNeonDonut: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cx = W / 2;
  const cy = H / 2 + 30;
  const rOuter = 230;
  const rInner = 110;

  const segs = [
    { label: "GAZ", val: 0.32, color: GREEN },
    { label: "PÉTROLE", val: 0.28, color: BLUE },
    { label: "OR", val: 0.22, color: YELLOW },
    { label: "AUTRES", val: 0.18, color: MAGENTA },
  ];

  // chaque segment se remplit en sequence
  const arc = (startA: number, endA: number) => {
    const p = (a: number, r: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const large = endA - startA > Math.PI ? 1 : 0;
    const [x1, y1] = p(startA, rOuter);
    const [x2, y2] = p(endA, rOuter);
    const [x3, y3] = p(endA, rInner);
    const [x4, y4] = p(startA, rInner);
    return `M${x1},${y1} A${rOuter},${rOuter} 0 ${large} 1 ${x2},${y2} L${x3},${y3} A${rInner},${rInner} 0 ${large} 0 ${x4},${y4} Z`;
  };

  let acc = -Math.PI / 2;
  const segGeo = segs.map((s, i) => {
    const start = acc;
    const full = s.val * Math.PI * 2;
    acc += full;
    const grow = spring({ fps, frame: Math.max(0, frame - (24 + i * 18)), config: { damping: 32, stiffness: 50 } });
    return { ...s, start, end: start + full * grow, i };
  });

  return (
    <AbsoluteFill>
      <NeonTitle text="MIX EXPORT" color={GREEN} localFrame={frame} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="glowD" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {segGeo.map((s) => (
          <path key={s.label} d={arc(s.start, s.end)} fill={s.color} filter="url(#glowD)" opacity={0.92} />
        ))}
        {/* trou central deja gere par l'arc (rInner) */}
      </svg>
      {/* labels colores monospace autour (directs) */}
      {segGeo.map((s) => {
        const mid = (s.start + (s.start + s.val * Math.PI * 2)) / 2;
        const lr = rOuter + 70;
        const lx = cx + lr * Math.cos(mid);
        const ly = cy + lr * Math.sin(mid);
        const op = interpolate(frame, [24 + s.i * 18 + 14, 24 + s.i * 18 + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div
            key={s.label}
            style={{
              position: "absolute",
              left: lx,
              top: ly,
              transform: "translate(-50%,-50%)",
              fontFamily: MONO,
              fontSize: 34,
              color: s.color,
              textShadow: `0 0 12px ${s.color}aa`,
              opacity: op,
              whiteSpace: "nowrap",
              textAlign: "center",
            }}
          >
            {s.label}
            <div style={{ fontSize: 44, fontWeight: 700 }}>{Math.round(s.val * 100)}%</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const ProtoHera_TerminalNeon: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <NeonGrid />
      <Sequence from={0} durationInFrames={150}>
        <SceneNeonLine />
      </Sequence>
      <Sequence from={150} durationInFrames={180}>
        <SceneNeonDonut />
      </Sequence>
    </AbsoluteFill>
  );
};

export default ProtoHera_TerminalNeon;
