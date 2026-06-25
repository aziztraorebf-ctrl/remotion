import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Beat0 V7 — Hook "GRAPHE CONTINU" — direction GPT (storyboard hook-gptimage2.png)
//
// Breakdown source : breakdown-gptSB-gpt55.json (GPT-5.5 sur le storyboard GPT).
// Difference clé vs v6 (Gemini) : le CRASH est dramatique — la courbe or monte vers
// un PIC, un MARQUEUR VERTICAL "22 mai" tombe, puis la stabilité rouge se libère de
// la pointillée et PLONGE avec overshoot en traversant l'or. Assets gpt-image en
// screen-blend. Ciseau S'ENRICHIT/BASCULE avec sous-titres.
//
// Assets : public/souverain/senegal-petrole-gaz/beat0/assets/*.png (7, gpt-image+gemini)
// Frames audio : Avril 3 · huit 161 · jour 226 · 22mai 309 · gouv-saute 335
//   limoge 404 · Comment 476 · malediction 753 · souverainete 841 · froide 910 · fin 979

const F_TOTAL = 979;
const W = 1920;
const H = 1080;

// Palette
const NAVY_DEEP = "#0f1729";
const GOLD = "#c8a951";
const GOLD_BRIGHT = "#e3c068";
const IVORY = "#f2ebd9";
const RED = "#ef4444";
const SLATE = "#8b9bb4";
const SLATE_MUTE = "#5a657c";
const DISPLAY = "Cinzel, serif";
const MONO = "IBM Plex Mono, monospace";

// Plot area (du breakdown GPT : x0=140,y0=840,x1=1800,y1=150)
const X0 = 140;
const Y0 = 840;
const X1 = 1800;
const Y1 = 150;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeInExpo = (t: number) => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10));

function ramp(frame: number, f0: number, f1: number, ease: (t: number) => number = (t) => t) {
  return ease(interpolate(frame, [f0, f1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
}
function frThousands(n: number): string {
  return Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
function sp(frame: number, fps: number, from: number, damping = 18, stiffness = 110) {
  return spring({ fps, frame: Math.max(0, frame - from), config: { damping, stiffness } });
}

const ASSET = (name: string) => staticFile(`souverain/senegal-petrole-gaz/beat0/assets/${name}.png`);

// ─── Path quadratique partiel + tip (overshoot géré par le caller via t>1 clamp) ──
function quadPartial(p0: [number, number], pc: [number, number], p1: [number, number], t: number): string {
  const STEPS = 64;
  const last = Math.max(1, Math.floor(STEPS * Math.min(1, t)));
  const pts: string[] = [];
  for (let i = 0; i <= last; i++) {
    const u = i / STEPS;
    const x = (1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * pc[0] + u * u * p1[0];
    const y = (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * pc[1] + u * u * p1[1];
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}
function quadTip(p0: [number, number], pc: [number, number], p1: [number, number], t: number): [number, number] {
  const u = Math.min(1, t);
  return [
    (1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * pc[0] + u * u * p1[0],
    (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * pc[1] + u * u * p1[1],
  ];
}

const SvgDefs: React.FC = () => (
  <defs>
    <linearGradient id="v7goldGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={GOLD_BRIGHT} />
      <stop offset="100%" stopColor={GOLD} />
    </linearGradient>
    <linearGradient id="v7goldArea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="rgba(200,169,81,0.30)" />
      <stop offset="100%" stopColor="rgba(22,33,58,0)" />
    </linearGradient>
    <linearGradient id="v7redArea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="rgba(239,68,68,0.26)" />
      <stop offset="100%" stopColor="rgba(22,33,58,0)" />
    </linearGradient>
    <filter id="v7glowGold" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="7" result="b" />
      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <filter id="v7glowRed" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="10" result="b" />
      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
);

// ─── Fond : texture asset + vignette qui respire au crash ──────────────────────
const Backdrop: React.FC<{ frame: number }> = ({ frame }) => {
  const vig = interpolate(frame, [330, 340, 360], [0.34, 0.5, 0.34], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 42%, #16213a 0%, ${NAVY_DEEP} 82%)` }} />
      <Img src={ASSET("navy_paper_oil_background_texture")} style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover", opacity: 0.55, mixBlendMode: "overlay" }} />
      <AbsoluteFill style={{ boxShadow: `inset 0 0 440px rgba(0,0,0,${vig})` }} />
    </>
  );
};

// ─── Espace-graphe : axes + grille + open loop rouge pointillé ─────────────────
const ChartFrame: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const axDraw = sp(frame, fps, 0, 22, 70);
  const gridV = [305, 475, 645, 815, 985, 1155, 1325, 1495, 1665];
  const gridH = [228, 320, 412, 504, 596, 688, 780];
  const loopDraw = sp(frame, fps, 4, 30, 70);
  const loopOff = -frame * 0.25;
  const loopVisible = frame < 332 || frame >= 470;
  const loopShift = interpolate(frame, [476, 560], [0, 26], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ly = 228 + loopShift;
  const loopD = `M${X0} ${ly} C${X0 + 300} ${ly} ${X0 + 560} ${ly + 6} ${X0 + 830} ${ly + 14} C${X0 + 1100} ${ly + 22} ${X0 + 1400} ${ly + 30} ${X1} ${ly + 44}`;

  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <SvgDefs />
      <g opacity={0.055 * axDraw}>
        {gridV.map((x) => <line key={`gv${x}`} x1={x} y1={Y1} x2={x} y2={Y0} stroke={IVORY} strokeWidth={1} />)}
        {gridH.map((y) => <line key={`gh${y}`} x1={X0} y1={y} x2={X1} y2={y} stroke={IVORY} strokeWidth={1} />)}
      </g>
      <g opacity={0.4} stroke={SLATE} strokeWidth={2} fill="none" strokeLinecap="round">
        <path d={`M${X0} ${Y0} H${X1}`} strokeDasharray={X1 - X0} strokeDashoffset={(X1 - X0) * (1 - axDraw)} />
        <path d={`M${X0} ${Y0} V${Y1}`} strokeDasharray={Y0 - Y1} strokeDashoffset={(Y0 - Y1) * (1 - axDraw)} />
      </g>
      {loopVisible && (
        <>
          <path d={loopD} fill="none" stroke={RED} strokeWidth={3} strokeDasharray="13 14" strokeDashoffset={loopOff} strokeLinecap="round" opacity={0.7 * loopDraw} />
          <text x={X1 - 4} y={ly - 14} textAnchor="end" fontFamily={MONO} fontSize={17} fill={RED} opacity={0.78 * sp(frame, fps, 30)} letterSpacing="2">
            STABILITÉ POLITIQUE
          </text>
        </>
      )}
    </svg>
  );
};

// ─── P1 — AVRIL 2026 + goutte hero (asset) ─────────────────────────────────────
const P1: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  if (frame > 170) return null;
  const titleOp = interpolate(frame, [3, 28, 145, 168], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(sp(frame, fps, 3, 14), [0, 1], [22, 0]);
  const dropOp = interpolate(frame, [18, 50, 145, 166], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dropScale = interpolate(sp(frame, fps, 18, 12, 90), [0, 1], [0.82, 1]);
  const bob = Math.sin((frame - 18) / 14) * 5;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: "50%", top: "16%", transform: `translate(-50%,-50%) translateY(${titleY}px)`, opacity: titleOp, fontFamily: DISPLAY, fontSize: 78, fontWeight: 700, color: IVORY, letterSpacing: "6px", textShadow: "0 4px 20px rgba(15,23,41,0.95)" }}>
        AVRIL 2026
      </div>
      <Img src={ASSET("oil_drop_hero")} style={{ position: "absolute", left: "50%", top: "48%", width: 300, height: 420, transform: `translate(-50%,-50%) translateY(${bob}px) scale(${dropScale})`, opacity: dropOp, objectFit: "contain", filter: "drop-shadow(0 0 24px rgba(200,169,81,0.25))" }} />
    </AbsoluteFill>
  );
};

// ─── P2 — Compteur 8M$ + burst (asset) ────────────────────────────────────────
const P2: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  if (frame < 158 || frame > 312) return null;
  const t = ramp(frame, 161, 206, easeOutExpo);
  const val = t * 8000000;
  const op = interpolate(frame, [161, 176, 296, 310], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const jourOp = interpolate(frame, [226, 244, 296, 310], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const burstOp = interpolate(frame, [161, 185, 226], [0, 0.7, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // condensation vers la base de la courbe (f250→305)
  const cond = ramp(frame, 250, 305, easeOutCubic);
  const cx = interpolate(cond, [0, 1], [W / 2, X0 + 30]);
  const cy = interpolate(cond, [0, 1], [H * 0.4, Y0 - 24]);
  const scale = interpolate(cond, [0, 1], [1, 0.22]);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: X0, top: 120, fontFamily: MONO, fontSize: 22, color: SLATE, letterSpacing: "0.2em", opacity: op }}>
        REVENUS PÉTROLIERS
      </div>
      <GoldSparks frame={frame} baseOp={burstOp} />
      <div style={{ position: "absolute", left: cx, top: cy, transform: `translate(-50%,-50%) scale(${scale})`, opacity: op, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 132, fontWeight: 700, lineHeight: 1, background: `linear-gradient(180deg, ${GOLD_BRIGHT} 0%, ${GOLD} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", whiteSpace: "nowrap", filter: "drop-shadow(0 0 28px rgba(200,169,81,0.25))" }}>
          {frThousands(val)} $
        </div>
        <div style={{ marginTop: 14, fontFamily: MONO, fontSize: 40, color: IVORY, letterSpacing: "8px", opacity: jourOp }}>/ JOUR</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Courbe or : monte (P3) → PIC au crash (P4) → S-curve "S'ENRICHIT" (P5) ─────
const GOLD_P0: [number, number] = [X0 + 20, Y0 - 26];
const PEAK: [number, number] = [X0 + (X1 - X0) * 0.6, Y1 + 70]; // sommet du pic ~f335

const GoldCurve: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  if (frame < 227) return null;
  const draw = ramp(frame, 227, 320, easeOutCubic);
  const morph = ramp(frame, 476, 560, easeOutCubic);

  // P3-P4 : montée vers le PIC. P5 : reparam en sigmoïde douce.
  const pc: [number, number] = [
    interpolate(morph, [0, 1], [X0 + (X1 - X0) * 0.42, X0 + (X1 - X0) * 0.5]),
    interpolate(morph, [0, 1], [Y0 - (Y0 - Y1) * 0.35, Y1 + (Y0 - Y1) * 0.18]),
  ];
  const p1: [number, number] = [
    interpolate(morph, [0, 1], [PEAK[0], X1 - 40]),
    interpolate(morph, [0, 1], [PEAK[1], Y1 + 40]),
  ];
  const line = quadPartial(GOLD_P0, pc, p1, draw);
  const tip = quadTip(GOLD_P0, pc, p1, draw);
  const areaT = ramp(frame, 227, 320, easeOutCubic) * (1 - morph * 0.35);
  const starOn = frame >= 300 && frame < 470;
  const starScale = interpolate(sp(frame, fps, 300, 12, 90), [0, 1], [0.35, 1]);

  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <SvgDefs />
        {areaT > 0.02 && <path d={`${line} L ${tip[0].toFixed(1)} ${Y0} L ${GOLD_P0[0]} ${Y0} Z`} fill="url(#v7goldArea)" opacity={areaT} />}
        <path d={line} fill="none" stroke="url(#v7goldGrad)" strokeWidth={6} strokeLinecap="round" filter="url(#v7glowGold)" />
      </svg>
      {starOn && (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: interpolate(frame, [300, 320, 450, 470], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), mixBlendMode: "screen", pointerEvents: "none" }}>
          <SvgDefs />
          <g transform={`translate(${tip[0]},${tip[1]}) scale(${starScale})`} filter="url(#v7glowGold)">
            {[0, 45, 90, 135].map((rot) => (
              <rect key={rot} x={-1.5} y={-90} width={3} height={180} rx={1.5} fill={GOLD_BRIGHT} transform={`rotate(${rot})`} opacity={rot % 90 === 0 ? 0.9 : 0.5} />
            ))}
            <circle r={10} fill={IVORY} />
            <circle r={20} fill="none" stroke={GOLD_BRIGHT} strokeWidth={2} opacity={0.5} />
          </g>
        </svg>
      )}
    </>
  );
};

// ─── P4 — CRASH : marqueur vertical 22mai + plongée rouge à overshoot + embers ──
const RedCrash: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  if (frame < 309) return null;
  // marqueur vertical "22 mai" : se dessine de haut en bas f309→334
  const markDraw = ramp(frame, 309, 334, easeOutCubic);
  const markX = PEAK[0];
  const markOp = interpolate(frame, [309, 320, 430, 460], [0, 0.6, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // plongée rouge : release de la pointillée (haut-gauche) → plonge bas-droite avec overshoot
  const birthRaw = sp(frame, fps, 335, 11, 150); // overshoot via spring damping bas
  const birth = Math.min(1, birthRaw);
  const morph = ramp(frame, 476, 560, easeOutCubic);
  const p0: [number, number] = [markX, Y1 + 70];
  const pc: [number, number] = [
    interpolate(morph, [0, 1], [markX + 120, X0 + (X1 - X0) * 0.5]),
    interpolate(morph, [0, 1], [Y0 - (Y0 - Y1) * 0.4, Y1 + (Y0 - Y1) * 0.82]),
  ];
  const p1: [number, number] = [X1 - 40, interpolate(morph, [0, 1], [Y0 - 30, Y0 - 24])];
  const redLine = quadPartial(p0, pc, p1, birth);
  const tip = quadTip(p0, pc, p1, birth);
  const areaT = interpolate(frame, [355, 420], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (1 - morph * 0.35);
  const embersOp = interpolate(frame, [335, 352, 440], [0, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <SvgDefs />
        {/* marqueur vertical 22 mai */}
        {frame < 460 && (
          <line x1={markX} y1={Y1 + 70} x2={markX} y2={Y1 + 70 + (Y0 - (Y1 + 70)) * markDraw} stroke={RED} strokeWidth={2} strokeDasharray="6 8" opacity={markOp} />
        )}
        {areaT > 0.02 && <path d={`${redLine} L ${tip[0].toFixed(1)} ${Y0} L ${p0[0]} ${Y0} Z`} fill="url(#v7redArea)" opacity={areaT} />}
        <path d={redLine} fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round" filter="url(#v7glowRed)" />
        {birth > 0.05 && frame < 476 && <circle cx={tip[0]} cy={tip[1]} r={8} fill={RED} filter="url(#v7glowRed)" />}
      </svg>
      {/* embers SVG au point d'impact (pic) */}
      <RedEmbers frame={frame} cx={markX} cy={Y1 + 70} baseOp={embersOp} />
    </>
  );
};

// ─── P4 overlay — 22 MAI + LE GOUVERNEMENT SAUTE + limogé ──────────────────────
const CrashLabels: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  if (frame < 309 || frame > 478) return null;
  const dateOp = interpolate(frame, [309, 322, 420, 445], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dateY = interpolate(sp(frame, fps, 309, 26, 88), [0, 1], [24, 0]);
  const slam = sp(frame, fps, 335, 12, 165);
  const govOp = interpolate(frame, [335, 344, 440, 462], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const jitter = frame >= 335 && frame <= 362 ? Math.sin(frame * 2.3) * 3 * interpolate(frame, [335, 362], [1, 0]) : 0;
  const limOp = interpolate(frame, [404, 416, 452, 472], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const limX = interpolate(sp(frame, fps, 404, 22, 90), [0, 1], [18, 0]);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: "50%", top: "22%", transform: `translate(-50%,-50%) translateY(${dateY}px)`, opacity: dateOp, fontFamily: MONO, fontSize: 30, color: RED, letterSpacing: "0.35em" }}>
        22 MAI 2026
      </div>
      <div style={{ position: "absolute", left: "50%", top: "37%", transform: `translate(-50%,-50%) translateX(${jitter}px) scale(${interpolate(slam, [0, 1], [1.16, 1])})`, opacity: govOp, fontFamily: DISPLAY, fontSize: 66, fontWeight: 700, color: IVORY, textShadow: "0 4px 24px rgba(127,29,29,0.75)" }}>
        LE GOUVERNEMENT SAUTE
      </div>
      <div style={{ position: "absolute", left: "62%", top: "70%", transform: `translateX(${limX}px)`, opacity: limOp, fontFamily: MONO, fontSize: 24, color: RED, letterSpacing: "0.2em" }}>
        Premier ministre limogé
      </div>
    </AbsoluteFill>
  );
};

// ─── P5 — ciseau labels + sous-titres + crossing glow (asset) ──────────────────
const ParadoxLabels: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  if (frame < 476 || frame > 912) return null;
  const enrOp = interpolate(frame, [490, 535, 800, 840], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const basOp = interpolate(frame, [490, 535, 800, 840], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subEnrOp = interpolate(frame, [510, 555, 800, 840], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const enrX = interpolate(sp(frame, fps, 476, 20, 90), [0, 1], [-34, 0]);
  const basX = interpolate(sp(frame, fps, 476, 20, 90), [0, 1], [34, 0]);
  const malOp = interpolate(frame, [753, 778, 840, 870], [0, 0.85, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const souvOp = interpolate(frame, [841, 862, 895, 910], [0, 0.85, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowOp = interpolate(frame, [476, 520, 880, 909], [0, 0.75, 0.75, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const crossX = X0 + (X1 - X0) * 0.5;
  const crossY = (Y0 + Y1) / 2;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: glowOp, mixBlendMode: "screen", pointerEvents: "none" }}>
        <defs>
          <radialGradient id="v7cross" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={IVORY} stopOpacity="0.9" />
            <stop offset="30%" stopColor={GOLD_BRIGHT} stopOpacity="0.5" />
            <stop offset="70%" stopColor={RED} stopOpacity="0.22" />
            <stop offset="100%" stopColor={RED} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={crossX} cy={crossY} r={150} fill="url(#v7cross)" />
      </svg>
      <div style={{ position: "absolute", left: "24%", top: "40%", transform: `translate(-50%,-50%) translateX(${enrX}px)`, opacity: enrOp, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 46, fontWeight: 700, color: NAVY_DEEP, background: GOLD, padding: "10px 28px", boxShadow: "0 10px 25px rgba(200,169,81,0.2)" }}>S'ENRICHIT</div>
        <div style={{ marginTop: 12, fontFamily: MONO, fontSize: 20, color: GOLD, letterSpacing: "0.2em", opacity: subEnrOp }}>+ des milliards</div>
      </div>
      <div style={{ position: "absolute", left: "76%", top: "62%", transform: `translate(-50%,-50%) translateX(${basX}px)`, opacity: basOp, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 46, fontWeight: 700, color: IVORY, background: RED, padding: "10px 28px", boxShadow: "0 10px 25px rgba(239,68,68,0.2)" }}>BASCULE</div>
        <div style={{ marginTop: 12, fontFamily: MONO, fontSize: 20, color: RED, letterSpacing: "0.2em", opacity: subEnrOp }}>vers le gouffre</div>
      </div>
      <div style={{ position: "absolute", left: "50%", top: "15%", transform: "translate(-50%,-50%)", opacity: malOp, fontFamily: DISPLAY, fontSize: 34, color: SLATE, fontStyle: "italic" }}>
        « malédiction » ?
      </div>
      <div style={{ position: "absolute", left: "50%", top: "85%", transform: "translate(-50%,-50%)", opacity: souvOp, fontFamily: MONO, fontSize: 22, color: SLATE, letterSpacing: "0.25em" }}>
        SOUVERAINETÉ
      </div>
    </AbsoluteFill>
  );
};

// ─── P6 — résolution + frost overlay (asset) ───────────────────────────────────
const Resolution: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  if (frame < 841) return null;
  const malOp = interpolate(frame, [841, 858, 930, 960], [0, 0.48, 0.18, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mirOp = interpolate(frame, [851, 868, 930, 960], [0, 0.48, 0.18, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const malStrike = ramp(frame, 858, 880, easeOutCubic);
  const mirStrike = ramp(frame, 868, 890, easeOutCubic);
  const ver1 = sp(frame, fps, 841, 18, 118);
  const ver2Op = interpolate(frame, [875, 905], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const froOp = interpolate(frame, [910, 935], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const underline = ramp(frame, 910, 950, easeOutExpo);
  const frostOp = interpolate(frame, [910, 950, 979], [0, 0.2, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Img src={ASSET("cold_frost_subtle_overlay")} style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover", opacity: frostOp, mixBlendMode: "screen", pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: "34%", top: "28%", transform: "translate(-50%,-50%)", fontFamily: DISPLAY, fontSize: 38, color: SLATE_MUTE, opacity: malOp }}>
        LA MALÉDICTION
        <div style={{ position: "absolute", top: "50%", left: -8, width: `${malStrike * 116}%`, height: 3, background: RED, opacity: 0.55 }} />
      </div>
      <div style={{ position: "absolute", left: "66%", top: "28%", transform: "translate(-50%,-50%)", fontFamily: DISPLAY, fontSize: 38, color: SLATE_MUTE, opacity: mirOp }}>
        LE MIRACLE
        <div style={{ position: "absolute", top: "50%", left: -8, width: `${mirStrike * 116}%`, height: 3, background: SLATE, opacity: 0.55 }} />
      </div>
      <div style={{ position: "absolute", top: "52%", transform: `translateY(${interpolate(ver1, [0, 1], [22, 0])}px)`, opacity: ver1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 92, fontWeight: 700, color: IVORY }}>LA VÉRITÉ</div>
        <div style={{ margin: "10px 0", width: `${underline * 340}px`, height: 2, background: GOLD }} />
        <div style={{ fontFamily: DISPLAY, fontSize: 56, fontWeight: 400, color: IVORY, letterSpacing: "4px", opacity: froOp }}>EST PLUS FROIDE.</div>
        <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 18, color: SLATE, letterSpacing: "0.3em", opacity: ver2Op }}>—</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Overlays SVG natifs (remplacent les assets gpt-image sans alpha) ──────────
const GoldSparks: React.FC<{ frame: number; baseOp: number }> = ({ frame, baseOp }) => {
  const sparks = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        x: W / 2 - 240 + (i * 73) % 480,
        delay: (i * 8) % 55,
        dur: 50 + (i % 5) * 12,
        r: 2 + (i % 3),
        amp: 16 + (i % 4) * 9,
      })),
    []
  );
  const local = frame - 161;
  if (local < 0 || frame > 250 || baseOp <= 0) return null;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: baseOp, mixBlendMode: "screen", pointerEvents: "none" }}>
      {sparks.map((s, i) => {
        const lp = (local - s.delay) / s.dur;
        if (lp < 0 || lp > 1) return null;
        const y = H * 0.62 - lp * 260;
        const x = s.x + Math.sin(lp * Math.PI * 3) * s.amp;
        const o = Math.sin(lp * Math.PI) * 0.9;
        return <circle key={i} cx={x} cy={y} r={s.r} fill={GOLD_BRIGHT} opacity={o} />;
      })}
    </svg>
  );
};

const RedEmbers: React.FC<{ frame: number; cx: number; cy: number; baseOp: number }> = ({ frame, cx, cy, baseOp }) => {
  const embers = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        ang: (i * 137.5 * Math.PI) / 180,
        dist: 40 + (i * 53) % 220,
        delay: (i * 3) % 18,
        dur: 50 + (i % 6) * 10,
        r: 1.5 + (i % 3),
      })),
    []
  );
  const local = frame - 335;
  if (local < 0 || frame > 440 || baseOp <= 0) return null;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: baseOp, mixBlendMode: "screen", pointerEvents: "none" }}>
      {embers.map((e, i) => {
        const lp = (local - e.delay) / e.dur;
        if (lp < 0 || lp > 1) return null;
        const d = e.dist * lp;
        const x = cx + Math.cos(e.ang) * d;
        const y = cy + Math.sin(e.ang) * d * 0.5 + lp * lp * 220; // tombe vers le bas
        const o = Math.sin(lp * Math.PI) * 0.85;
        return <circle key={i} cx={x} cy={y} r={e.r} fill={RED} opacity={o} />;
      })}
    </svg>
  );
};

// ─── Caméra ──────────────────────────────────────────────────────────────────
function useCamera(frame: number, fps: number) {
  let scale = 1, tx = 0, ty = 0, blur = 0;
  if (frame >= 161 && frame < 227) {
    scale = interpolate(sp(frame, fps, 161, 18, 80), [0, 1], [1, 1.04]);
  } else if (frame >= 227 && frame < 309) {
    scale = interpolate(ramp(frame, 227, 309, easeOutCubic), [0, 1], [1.04, 1.0]);
  } else if (frame >= 309 && frame < 335) {
    scale = interpolate(ramp(frame, 309, 335, easeOutCubic), [0, 1], [1.0, 1.04]);
  } else if (frame >= 335 && frame < 404) {
    const r = sp(frame, fps, 335, 12, 150);
    scale = interpolate(r, [0, 1], [1.04, 1.02]);
    tx = interpolate(r, [0, 1], [-16, 0]);
  } else if (frame >= 404 && frame < 476) {
    scale = interpolate(ramp(frame, 404, 476, easeOutCubic), [0, 1], [1.02, 1.0]);
  } else if (frame >= 841) {
    const r = sp(frame, fps, 841, 34, 76);
    scale = interpolate(r, [0, 1], [1.0, 0.965]);
    ty = interpolate(r, [0, 1], [0, 16]);
    blur = interpolate(sp(frame, fps, 910, 34, 76), [0, 1], [0, 1.4]);
  }
  return { scale, tx, ty, blur };
}

export const Beat0AccrocheV7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCamera(frame, fps);

  const volNarr = interpolate(frame, [0, 15, F_TOTAL - 20, F_TOTAL], [0, 1, 1, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const volMusic = interpolate(frame, [0, 30, F_TOTAL - 30, F_TOTAL], [0, 0.05, 0.05, 0.02], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const graphStyle: React.CSSProperties = {
    transform: `translate(${cam.tx}px, ${cam.ty}px) scale(${cam.scale})`,
    transformOrigin: "center center",
    filter: cam.blur > 0 ? `blur(${cam.blur}px)` : undefined,
    opacity: frame >= 841 ? interpolate(sp(frame, fps, 841, 34, 76), [0, 1], [1, 0.3]) : 1,
  };

  return (
    <AbsoluteFill style={{ background: NAVY_DEEP, overflow: "hidden" }}>
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3")} startFrom={0} volume={volNarr} />
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")} startFrom={0} volume={volMusic} />
      <Sequence from={161} name="sfx-countup"><Audio src={staticFile("souverain/senegal-petrole-gaz/audio/sfx/sfx-odometer-tick.mp3")} volume={0.4} /></Sequence>
      <Sequence from={335} name="sfx-crash"><Audio src={staticFile("souverain/senegal-petrole-gaz/audio/sfx/sfx-stamp-impact.mp3")} volume={0.85} /></Sequence>
      <Sequence from={910} name="sfx-cold"><Audio src={staticFile("souverain/senegal-petrole-gaz/audio/sfx/sfx-whoosh-transition.mp3")} volume={0.45} /></Sequence>

      <Backdrop frame={frame} />

      <AbsoluteFill style={graphStyle}>
        <ChartFrame frame={frame} fps={fps} />
        <GoldCurve frame={frame} fps={fps} />
        <RedCrash frame={frame} fps={fps} />
      </AbsoluteFill>

      <P1 frame={frame} fps={fps} />
      <P2 frame={frame} fps={fps} />
      <CrashLabels frame={frame} fps={fps} />
      <ParadoxLabels frame={frame} fps={fps} />
      <Resolution frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
