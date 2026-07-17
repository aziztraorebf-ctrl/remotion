/**
 * KostiFrappeProtoV2 — PROTO v2 (jetable, _rnd). Beat 5 Acte 4 Soudan.
 *
 * Base = composition proposee par GPT-5.6 Sol (validee Aziz : station 3/4, file le long de la
 * route d'acces, cadre etat-major epure), nettoyee de : drone "toile" horrible, boussole, echelle,
 * civils generiques (remplaces par NOS elements). Decor statique = public/_rnd/kosti-sol-decor.svg.
 *
 * Par-dessus, on ANIME nos elements aux coordonnees fournies par les ANIMATION_HINTS de Sol :
 *   - jetons civils (portrait-civil.png) en file le long de la route -> s'eteignent a la frappe
 *   - NOTRE sprite drone-rsf-td.png qui suit la trajectoire jusqu'a la station
 *   - impact (flash + ripple) + fumee qui monte (smoke-anchor de Sol : x=744,y=628)
 *
 * Workflow doctrine : le modele PROPOSE la composition, on valide, on branche NOS assets animables.
 * Registre : grave/clinique, pas spectacle (script v5). Pas de camera shake violent.
 */
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, Easing, staticFile } from "remotion";

export const KOSTI_V2_FPS = 30;
export const KOSTI_V2_FRAMES = 330; // 11s

const RED = "#8a2a20";
const IVORY = "#f2ebd9";

const clampI = (f: number, a: number, b: number, lo = 0, hi = 1) =>
  interpolate(f, [a, b], [lo, hi], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ── Phases ──
const CIVILS_APPEAR = 55;
const DRONE_START = 150;
const IMPACT_AT = 214;
const SMOKE_AT = IMPACT_AT + 12;
const EXTINCT_START = IMPACT_AT + 6;

// ── Coordonnees issues des ANIMATION_HINTS de Sol (viewBox 1920x1080) ──
const IMPACT = { x: 744, y: 628 };       // impact-zone / smoke-anchor de Sol
const DRONE_ENTRY = { x: -66, y: -60 };  // entree hors-champ (haut-gauche)
// file de civils le long de la route d'acces (positions Sol civil-1..6, du plus proche au plus loin)
const CIVILS = [
  { x: 700, y: 630 },
  { x: 655, y: 675 },
  { x: 610, y: 720 },
  { x: 560, y: 762 },
  { x: 512, y: 800 },
  { x: 470, y: 835 },
];

const quad = (o: { x: number; y: number }, m: { x: number; y: number }, t2: { x: number; y: number }, t: number) => {
  const mt = 1 - t;
  return { x: mt * mt * o.x + 2 * mt * t * m.x + t * t * t2.x, y: mt * mt * o.y + 2 * mt * t * m.y + t * t * t2.y };
};

// ── Jeton CIVIL : rond ivoire + portrait-civil, s'eteint (opacite + grayscale) a la frappe ──
const CivilToken: React.FC<{ x: number; y: number; appearAt: number; extinctAt: number | null; frame: number; idx: number }> =
  ({ x, y, appearAt, extinctAt, frame, idx }) => {
    const appear = clampI(frame, appearAt, appearAt + 14);
    const idle = Math.sin((frame + idx * 11) * 0.06) * 1.4;
    const alive = extinctAt === null || frame < extinctAt
      ? 1 : interpolate(frame, [extinctAt, extinctAt + 26], [1, 0.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const dead = extinctAt !== null && frame >= extinctAt;
    return (
      <div style={{
        position: "absolute", left: x, top: y + idle, transform: "translate(-50%,-50%)",
        width: 34, height: 34, borderRadius: "50%", opacity: appear * alive,
        border: `2.2px solid #5c4d38`, background: IVORY, overflow: "hidden",
        boxShadow: "0 4px 6px rgba(26,11,8,0.45)",
      }}>
        <Img src={staticFile("_shared/sprites/warmap/portrait-civil.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: dead ? "grayscale(1)" : "none" }} />
      </div>
    );
  };

// ── Notre drone RSF (sprite) qui suit la trajectoire jusqu'a l'impact ──
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
  // traineee : s'efface avec le drone (fade global) — corrige le bug v1 (trainee qui restait)
  const trailOp = droneOp * 0.5;
  const DW = 92, DH = DW * (768 / 1408);
  // points de trainee derriere le drone
  const trail = [0.04, 0.08, 0.13].map((d) => quad(DRONE_ENTRY, mid, IMPACT, Math.max(0, t - d)));
  return (
    <>
      {trail.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: p.x, top: p.y, transform: "translate(-50%,-50%)",
          width: 6 - i * 1.4, height: 6 - i * 1.4, borderRadius: "50%",
          background: RED, opacity: trailOp * (1 - i * 0.28),
        }} />
      ))}
      <div style={{ position: "absolute", left: pos.x, top: pos.y, transform: `translate(-50%,-50%) rotate(${heading}deg)`, opacity: droneOp }}>
        <Img src={staticFile("_shared/sprites/warmap/drone-rsf-td.png")}
          style={{ width: DW, height: DH, objectFit: "contain", filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.5))" }} />
      </div>
    </>
  );
};

// ── Impact : flash + 2 anneaux (SVG overlay) ──
const Impact: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - IMPACT_AT;
  if (t < 0) return null;
  const flashOp = interpolate(t, [0, 4, 20], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const r1 = interpolate(t, [0, 55], [10, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op1 = interpolate(t, [0, 10, 55], [0, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const r2 = interpolate(t, [12, 70], [10, 150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op2 = interpolate(t, [12, 24, 70], [0, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <circle cx={IMPACT.x} cy={IMPACT.y} r={r1} fill="none" stroke={RED} strokeWidth={3.5} opacity={op1} />
      <circle cx={IMPACT.x} cy={IMPACT.y} r={r2} fill="none" stroke="#bf9442" strokeWidth={2} opacity={op2} />
      <circle cx={IMPACT.x} cy={IMPACT.y} r={22} fill={IVORY} opacity={flashOp} />
    </svg>
  );
};

// ── Fumee : volutes + turbulence, monte du smoke-anchor de Sol ──
const Smoke: React.FC<{ frame: number }> = ({ frame }) => {
  const rel = frame - SMOKE_AT;
  if (rel < 0) return null;
  const appear = interpolate(rel, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const seed = Math.floor(frame / 4) % 20;
  const puffs = [0, 22, 44].map((offset, i) => {
    const tt = (((rel + offset) % 70) + 70) % 70 / 70;
    const py = -tt * 66;
    const sc = 0.5 + tt * 1.1;
    const op = interpolate(tt, [0, 0.15, 0.75, 1], [0, 0.5, 0.32, 0], { extrapolateRight: "clamp" }) * appear;
    return { py, sc, op, i };
  });
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <defs>
        <filter id="kv2smoke">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="10" />
        </filter>
      </defs>
      <g filter="url(#kv2smoke)" transform={`translate(${IMPACT.x} ${IMPACT.y - 6})`}>
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

export const KostiFrappeProtoV2: React.FC = () => {
  const frame = useCurrentFrame();
  const extinctFor = (i: number): number | null => {
    const start = EXTINCT_START + i * 6; // s'eteignent un a un, du plus proche de l'impact au plus loin
    return frame >= start ? start : null;
  };
  return (
    <AbsoluteFill style={{ background: "#d9c092" }}>
      {/* decor statique = composition Sol nettoyee */}
      <Img src={staticFile("_rnd/kosti-sol-decor.svg")} style={{ position: "absolute", inset: 0, width: 1920, height: 1080 }} />

      {/* civils (les plus proches de l'impact s'eteignent en premier) */}
      {CIVILS.map((c, i) => (
        <CivilToken key={i} x={c.x} y={c.y} appearAt={CIVILS_APPEAR + i * 7}
          extinctAt={extinctFor(i)} frame={frame} idx={i} />
      ))}

      <DroneStrike frame={frame} />
      <Impact frame={frame} />
      <Smoke frame={frame} />
    </AbsoluteFill>
  );
};

export default KostiFrappeProtoV2;
