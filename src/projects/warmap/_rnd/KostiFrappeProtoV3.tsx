/**
 * KostiFrappeProtoV3 — PROTO v3 (jetable, _rnd). Beat 5 Acte 4 Soudan.
 * Base = composition GPT-5.6 Sol (validee Aziz). 3 ajustements Aziz sur v2 :
 *   1. Impact ELARGI qui touche la STATION : fumee s'echappe de la station + station s'estompe/noircit.
 *   2. 6 civils DISTINCTS (portrait-civil + refugie-homme/femme1/femme2/enfant/famille), plus 1 seul asset.
 *   3. Nil ANIME : trace organique (feTurbulence ondulant) + lignes de courant qui s'ecoulent (dash defile).
 * Decor statique SANS Nil = public/_rnd/kosti-sol-decor-noriver.svg (le Nil est redessine anime ici).
 */
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, Easing, staticFile } from "remotion";

export const KOSTI_V3_FPS = 30;
export const KOSTI_V3_FRAMES = 330;

const RED = "#8a2a20";
const IVORY = "#f2ebd9";

const clampI = (f: number, a: number, b: number, lo = 0, hi = 1) =>
  interpolate(f, [a, b], [lo, hi], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const CIVILS_APPEAR = 55;
const DRONE_START = 150;
const IMPACT_AT = 214;
const SMOKE_AT = IMPACT_AT + 10;
const EXTINCT_START = IMPACT_AT + 6;

const IMPACT = { x: 744, y: 600 };          // remonte vers la station (avant : 628, au sol)
const STATION_CENTER = { x: 744, y: 526 };  // centre station (hint Sol)
const DRONE_ENTRY = { x: -66, y: -60 };

// 6 civils DISTINCTS le long de la route (du plus proche de la station au plus loin)
const CIVILS = [
  { x: 700, y: 630, asset: "portrait-civil" },
  { x: 655, y: 675, asset: "refugie-homme" },
  { x: 610, y: 720, asset: "refugie-femme1" },
  { x: 560, y: 762, asset: "refugie-enfant" },
  { x: 512, y: 800, asset: "refugie-femme2" },
  { x: 470, y: 835, asset: "refugie-famille" },
];

const quad = (o: { x: number; y: number }, m: { x: number; y: number }, t2: { x: number; y: number }, t: number) => {
  const mt = 1 - t;
  return { x: mt * mt * o.x + 2 * mt * t * m.x + t * t * t2.x, y: mt * mt * o.y + 2 * mt * t * m.y + t * t * t2.y };
};

// ── Nil ANIME : lignes de courant qui defilent (dash offset) + berges qui ondulent legerement
// (2 bandes de rive dont l'opacite/decalage varie par frame = reflet d'eau qui bouge). PAS de
// feDisplacementMap (il vidait le fill du path — bug proto v3 initial). Robuste, frame-driven. ──
const NileAnime: React.FC<{ frame: number }> = ({ frame }) => {
  const flow = (frame * 0.9) % 27;   // courant qui s'ecoule vers le sud (dash defile)
  const flow2 = (frame * 0.6) % 28;
  // legers reflets qui derivent : 3 bandes claires a des phases differentes
  const reflect = (phase: number) => 0.12 + 0.10 * (Math.sin(frame * 0.05 + phase) * 0.5 + 0.5);
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <path d="M1110 0 C1096 130 1100 252 1125 365 C1145 456 1141 529 1112 606 C1081 689 1075 773 1090 865 C1102 942 1101 1014 1092 1080 L1264 1080 C1275 1002 1272 924 1262 850 C1249 757 1255 692 1284 611 C1314 527 1319 437 1298 341 C1276 238 1274 121 1284 0 Z"
        fill="#718999" stroke="#4f6979" strokeWidth={4} />
      {/* reflets d'eau : bandes claires qui respirent (opacite varie) */}
      <path d="M1150 0 C1138 200 1150 420 1120 620 C1095 800 1110 950 1100 1080" fill="none"
        stroke="#8fa6b3" strokeWidth={14} opacity={reflect(0)} strokeLinecap="round" />
      <path d="M1230 0 C1240 220 1230 440 1250 640 C1262 820 1250 960 1245 1080" fill="none"
        stroke="#8fa6b3" strokeWidth={10} opacity={reflect(2.1)} strokeLinecap="round" />
      {/* lignes de courant : dash qui defile = eau qui s'ecoule */}
      <path d="M1194 0 C1181 132 1187 249 1209 355 C1228 447 1224 524 1197 601 C1168 686 1163 772 1177 858 C1189 938 1188 1008 1179 1080"
        fill="none" stroke="#c3b691" strokeWidth={2} strokeDasharray="13 14" strokeDashoffset={-flow} opacity={0.6} />
      <path d="M1095 0 C1081 133 1086 255 1111 369 C1130 457 1126 524 1098 602"
        fill="none" stroke="#405967" strokeWidth={2} strokeDasharray="10 18" strokeDashoffset={-flow2} opacity={0.5} />
      <path d="M1279 0 C1268 124 1271 238 1293 343 C1314 439 1309 527 1279 609"
        fill="none" stroke="#405967" strokeWidth={2} strokeDasharray="10 18" strokeDashoffset={-flow * 1.1} opacity={0.5} />
      <text x={1219} y={876} fill="#334c5a" fontFamily="Georgia, serif" fontSize={22} fontStyle="italic"
        letterSpacing={4} textAnchor="middle" opacity={0.86}>NIL BLANC</text>
    </svg>
  );
};

const CivilToken: React.FC<{ x: number; y: number; asset: string; appearAt: number; extinctAt: number | null; frame: number; idx: number }> =
  ({ x, y, asset, appearAt, extinctAt, frame, idx }) => {
    const appear = clampI(frame, appearAt, appearAt + 14);
    const idle = Math.sin((frame + idx * 11) * 0.06) * 1.4;
    const alive = extinctAt === null || frame < extinctAt
      ? 1 : interpolate(frame, [extinctAt, extinctAt + 26], [1, 0.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const dead = extinctAt !== null && frame >= extinctAt;
    return (
      <div style={{
        position: "absolute", left: x, top: y + idle, transform: "translate(-50%,-50%)",
        width: 38, height: 38, borderRadius: "50%", opacity: appear * alive,
        border: `2.4px solid #5c4d38`, background: IVORY, overflow: "hidden",
        boxShadow: "0 4px 6px rgba(26,11,8,0.45)",
      }}>
        <Img src={staticFile(`_shared/sprites/warmap/${asset}.png`)}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: dead ? "grayscale(1)" : "none" }} />
      </div>
    );
  };

const DroneStrike: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame - DRONE_START;
  if (local < 0) return null;
  const dur = IMPACT_AT - DRONE_START;
  const t = interpolate(local, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const mid = { x: (DRONE_ENTRY.x + IMPACT.x) / 2 + 40, y: (DRONE_ENTRY.y + IMPACT.y) / 2 - 30 };
  const pos = quad(DRONE_ENTRY, mid, IMPACT, t);
  const behind = quad(DRONE_ENTRY, mid, IMPACT, Math.max(0, t - 0.02));
  const heading = (Math.atan2(pos.y - behind.y, pos.x - behind.x) * 180) / Math.PI;
  const droneOp = interpolate(local, [0, 8, dur - 4, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const trailOp = droneOp * 0.5;
  const DW = 92, DH = DW * (768 / 1408);
  const trail = [0.04, 0.08, 0.13].map((d) => quad(DRONE_ENTRY, mid, IMPACT, Math.max(0, t - d)));
  return (
    <>
      {trail.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: p.x, top: p.y, transform: "translate(-50%,-50%)",
          width: 6 - i * 1.4, height: 6 - i * 1.4, borderRadius: "50%", background: RED, opacity: trailOp * (1 - i * 0.28) }} />
      ))}
      <div style={{ position: "absolute", left: pos.x, top: pos.y, transform: `translate(-50%,-50%) rotate(${heading}deg)`, opacity: droneOp }}>
        <Img src={staticFile("_shared/sprites/warmap/drone-rsf-td.png")}
          style={{ width: DW, height: DH, objectFit: "contain", filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.5))" }} />
      </div>
    </>
  );
};

// ── Impact ELARGI (touche la station) : flash + 2 anneaux larges ──
const Impact: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - IMPACT_AT;
  if (t < 0) return null;
  const flashOp = interpolate(t, [0, 4, 22], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const r1 = interpolate(t, [0, 60], [10, 165], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // + large
  const op1 = interpolate(t, [0, 10, 60], [0, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const r2 = interpolate(t, [14, 78], [10, 205], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op2 = interpolate(t, [14, 26, 78], [0, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <circle cx={IMPACT.x} cy={IMPACT.y} r={r1} fill="none" stroke={RED} strokeWidth={4} opacity={op1} />
      <circle cx={IMPACT.x} cy={IMPACT.y} r={r2} fill="none" stroke="#bf9442" strokeWidth={2.5} opacity={op2} />
      <circle cx={IMPACT.x} cy={IMPACT.y} r={26} fill={IVORY} opacity={flashOp} />
    </svg>
  );
};

// ── Fumee : 2 colonnes — une de la STATION (station touchee) + une du point d'impact ──
const SmokeCol: React.FC<{ frame: number; ax: number; ay: number; scale: number; id: string }> = ({ frame, ax, ay, scale, id }) => {
  const rel = frame - SMOKE_AT;
  if (rel < 0) return null;
  const appear = interpolate(rel, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const seed = Math.floor(frame / 4) % 20;
  const puffs = [0, 22, 44].map((offset, i) => {
    const tt = (((rel + offset) % 72) + 72) % 72 / 72;
    const py = -tt * 74 * scale;
    const sc = (0.5 + tt * 1.1) * scale;
    const op = interpolate(tt, [0, 0.15, 0.75, 1], [0, 0.52, 0.33, 0], { extrapolateRight: "clamp" }) * appear;
    return { py, sc, op, i };
  });
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <defs>
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="10" />
        </filter>
      </defs>
      <g filter={`url(#${id})`} transform={`translate(${ax} ${ay})`}>
        {puffs.map((p) => (
          <g key={p.i} transform={`translate(0 ${p.py}) scale(${p.sc})`} opacity={p.op}>
            <ellipse cx={0} cy={0} rx={16} ry={18} fill="#6b5c42" />
            <ellipse cx={-6} cy={-5} rx={11} ry={13} fill="#5c4d38" />
            <ellipse cx={6} cy={-2} rx={9} ry={11} fill="#4a3f2e" />
          </g>
        ))}
      </g>
    </svg>
  );
};

export const KostiFrappeProtoV3: React.FC = () => {
  const frame = useCurrentFrame();
  const extinctFor = (i: number): number | null => {
    const start = EXTINCT_START + i * 6;
    return frame >= start ? start : null;
  };
  // PROTO : on ne touche PAS a l'opacite globale du decor (le voile beige general etait laid).
  // La fumee de station + l'impact large portent le "station touchee". Pour le beat final : sortir
  // <g id="station"> du decor et n'estomper/noircir QUE lui apres l'impact.
  const stationDim = 1;
  return (
    <AbsoluteFill style={{ background: "#d9c092" }}>
      {/* decor Sol SANS Nil (a un fond #d9c092 opaque plein ecran — donc le Nil doit passer PAR-DESSUS) */}
      <Img src={staticFile("_rnd/kosti-sol-decor-noriver.svg")}
        style={{ position: "absolute", inset: 0, width: 1920, height: 1080, opacity: stationDim }} />
      {/* Nil anime PAR-DESSUS le decor (sinon le rect de fond opaque du decor le masque) mais SOUS l'action */}
      <NileAnime frame={frame} />

      {CIVILS.map((c, i) => (
        <CivilToken key={i} x={c.x} y={c.y} asset={c.asset} appearAt={CIVILS_APPEAR + i * 7}
          extinctAt={extinctFor(i)} frame={frame} idx={i} />
      ))}

      <DroneStrike frame={frame} />
      <Impact frame={frame} />
      {/* fumee de la STATION (grande) + fumee du point d'impact (petite) */}
      <SmokeCol frame={frame} ax={STATION_CENTER.x} ay={STATION_CENTER.y + 30} scale={1.25} id="smokeStation" />
      <SmokeCol frame={frame} ax={IMPACT.x - 30} ay={IMPACT.y} scale={0.8} id="smokeImpact" />
    </AbsoluteFill>
  );
};

export default KostiFrappeProtoV3;
