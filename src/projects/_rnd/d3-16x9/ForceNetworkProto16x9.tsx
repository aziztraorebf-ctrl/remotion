import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type SimulationNodeDatum,
} from "d3-force";

export const FORCE_NETWORK_FRAMES = 390; // 13s @ 30fps

// ---------------------------------------------------------------------------
// PROTO R&D V2 — reseau de force D3 (d3-force) frame-driven / deterministe.
// Sujet-cobaye : reseau d'acteurs du conflit soudanais.
// Intention : RESSENTIR un rapport de force qui se noue puis BASCULE + SE
// RECOMPOSE physiquement quand un soutien exterieur (UAE) s'active.
//
// V2 (premium) vs V1 :
//  1. DEUX layouts cuits (AVANT sans pivot / APRES avec pivot) -> les noeuds
//     se DEPLACENT physiquement a la bascule (recomposition, pas fige).
//  2. Noeuds premium : disque + halo interne (radial) + anneau cisele + glow.
//  3. Couche de vie ambiante : drift lent global + pulse par noeud.
//  4. Apparition : spring "tomber-sec" echelonne + liens qui se tracent.
//
// DETERMINISME : les 2 simulations d3-force sont CUITES dans useMemo (positions
// initiales FIXES, aucun Math.random). Chaque frame ne fait QUE lire/interpoler.
// ---------------------------------------------------------------------------

const W = 1920;
const H = 1080;

const COL = {
  bg0: "#0b1220",
  bg1: "#131f33",
  ink: "#e8dcc0",
  gold: "#e8b44a",
  goldSoft: "#c8a951",
  danger: "#d6552e",
  steel: "#5a8fc0",
  nodeState: "#4a6ea0",
  nodeStateHi: "#7fa8d8",
  nodeMilice: "#b8763a",
  nodeMiliceHi: "#e0a668",
  nodeExt: "#3e7c5a",
  nodeExtHi: "#6fb890",
  nodeRes: "#e8b44a",
  nodeResHi: "#ffe39a",
};

type Kind = "state" | "milice" | "ext" | "res";
interface NodeSpec {
  id: string;
  label: string;
  kind: Kind;
  ix: number;
  iy: number;
  r: number;
}
interface LinkSpec {
  source: string;
  target: string;
  kind: "base" | "pivot";
}

const NODES: NodeSpec[] = [
  { id: "saf", label: "Armee (SAF)", kind: "state", ix: 0.32, iy: 0.34, r: 46 },
  { id: "rsf", label: "RSF", kind: "milice", ix: 0.58, iy: 0.58, r: 46 },
  { id: "gold", label: "Or du Darfour", kind: "res", ix: 0.44, iy: 0.82, r: 36 },
  { id: "uae", label: "Emirats", kind: "ext", ix: 0.84, iy: 0.42, r: 40 },
  { id: "egy", label: "Egypte", kind: "ext", ix: 0.18, iy: 0.66, r: 36 },
  { id: "civ", label: "Population", kind: "state", ix: 0.5, iy: 0.2, r: 32 },
];

const BASE_LINKS: LinkSpec[] = [
  { source: "saf", target: "civ", kind: "base" },
  { source: "saf", target: "egy", kind: "base" },
  { source: "rsf", target: "gold", kind: "base" },
  { source: "saf", target: "rsf", kind: "base" },
];
const PIVOT_LINKS: LinkSpec[] = [
  { source: "uae", target: "rsf", kind: "pivot" },
  { source: "gold", target: "uae", kind: "pivot" },
];
const ALL_LINKS = [...BASE_LINKS, ...PIVOT_LINKS];

interface SimNode extends SimulationNodeDatum, NodeSpec {}

// Cuisson d'un layout pour un jeu de liens donne (deterministe).
function cookLayout(links: LinkSpec[]): Record<string, { x: number; y: number }> {
  const nodes: SimNode[] = NODES.map((n) => ({
    ...n,
    x: n.ix * W,
    y: n.iy * H,
    vx: 0,
    vy: 0,
  }));
  const lk = links.map((l) => ({ ...l }));

  const sim = forceSimulation(nodes)
    .force(
      "link",
      forceLink(lk as any)
        .id((d: any) => d.id)
        .distance((l: any) => (l.kind === "pivot" ? 240 : 215))
        .strength(0.45),
    )
    .force("charge", forceManyBody().strength(-1500))
    .force("center", forceCenter(W / 2, H / 2))
    .force("collide", forceCollide().radius((d: any) => d.r + 34))
    .stop();

  sim.tick(320);

  const out: Record<string, { x: number; y: number }> = {};
  nodes.forEach((n) => {
    out[n.id] = { x: n.x as number, y: n.y as number };
  });
  return out;
}

function nodeColors(kind: Kind): { base: string; hi: string } {
  return kind === "state"
    ? { base: COL.nodeState, hi: COL.nodeStateHi }
    : kind === "milice"
      ? { base: COL.nodeMilice, hi: COL.nodeMiliceHi }
      : kind === "ext"
        ? { base: COL.nodeExt, hi: COL.nodeExtHi }
        : { base: COL.nodeRes, hi: COL.nodeResHi };
}

export const ForceNetworkProto16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // DEUX layouts cuits : AVANT (liens de base) et APRES (base + pivot).
  const posBefore = useMemo(() => cookLayout(BASE_LINKS), []);
  const posAfter = useMemo(() => cookLayout(ALL_LINKS), []);

  const start = useMemo(() => {
    const s: Record<string, { x: number; y: number }> = {};
    NODES.forEach((n) => {
      s[n.id] = { x: n.ix * W, y: n.iy * H };
    });
    return s;
  }, []);

  const PIVOT_F = 165;

  // Arrivee echelonnee des noeuds (spring tomber-sec).
  const nodeProgress = (i: number) => {
    const localF = frame - i * 7;
    return spring({
      frame: Math.max(0, localF),
      fps,
      config: { mass: 1, damping: 13, stiffness: 95 },
      durationInFrames: 42,
    });
  };

  // Recomposition physique : de posBefore vers posAfter apres le pivot.
  const recompose = spring({
    frame: Math.max(0, frame - PIVOT_F),
    fps,
    config: { mass: 1, damping: 16, stiffness: 60 },
    durationInFrames: 60,
  });

  // Drift ambiant global (couche de vie permanente) — le reseau "respire".
  const driftX = Math.sin(frame / 90) * 10;
  const driftY = Math.cos(frame / 110) * 8;

  // Position cible courante d'un noeud = lerp(before, after) par recompose.
  const targetXY = (id: string) => ({
    x: interpolate(recompose, [0, 1], [posBefore[id].x, posAfter[id].x]) + driftX,
    y: interpolate(recompose, [0, 1], [posBefore[id].y, posAfter[id].y]) + driftY,
  });

  // Position affichee = lerp(start, target) par progression d'arrivee.
  const cur: Record<string, { x: number; y: number }> = {};
  NODES.forEach((n, i) => {
    const p = nodeProgress(i);
    const t = targetXY(n.id);
    cur[n.id] = {
      x: interpolate(p, [0, 1], [start[n.id].x, t.x]),
      y: interpolate(p, [0, 1], [start[n.id].y, t.y]),
    };
  });

  const pivotOn = interpolate(frame, [PIVOT_F, PIVOT_F + 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fracture = interpolate(frame, [PIVOT_F + 24, PIVOT_F + 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const flowOffset = (frame * 3) % 60;

  return (
    <AbsoluteFill style={{ backgroundColor: COL.bg0 }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, ${COL.bg1} 0%, ${COL.bg0} 72%)`,
        }}
      />

      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {NODES.map((n) => {
            const c = nodeColors(n.kind);
            return (
              <radialGradient
                key={`grad-${n.id}`}
                id={`grad-${n.id}`}
                cx="38%"
                cy="34%"
                r="75%"
              >
                <stop offset="0%" stopColor={c.hi} />
                <stop offset="60%" stopColor={c.base} />
                <stop offset="100%" stopColor={c.base} stopOpacity={0.92} />
              </radialGradient>
            );
          })}
        </defs>

        {/* LIENS */}
        {ALL_LINKS.map((l, i) => {
          const a = cur[l.source];
          const b = cur[l.target];
          const isPivot = l.kind === "pivot";
          const appear = isPivot ? pivotOn : 1;
          if (appear <= 0.01) return null;

          const isFracture = l.source === "saf" && l.target === "rsf";
          const stroke = isFracture
            ? `rgb(${Math.round(90 + fracture * 124)}, ${Math.round(111 - fracture * 60)}, ${Math.round(150 - fracture * 100)})`
            : isPivot
              ? COL.gold
              : COL.steel;
          const width = isFracture ? 3 + fracture * 4 : isPivot ? 2 + pivotOn * 3 : 3;

          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.hypot(dx, dy);

          return (
            <g key={`l${i}`}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={stroke}
                strokeWidth={width}
                strokeOpacity={0.85 * appear}
                strokeDasharray={isPivot ? len : undefined}
                strokeDashoffset={isPivot ? len * (1 - pivotOn) : undefined}
                strokeLinecap="round"
              />
              {isPivot && pivotOn > 0.9 && (
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={COL.nodeResHi}
                  strokeWidth={5}
                  strokeOpacity={0.9}
                  strokeDasharray="6 54"
                  strokeDashoffset={-flowOffset}
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        })}

        {/* NOEUDS premium : glow + disque radial + anneau cisele + reflet */}
        {NODES.map((n, i) => {
          const p = cur[n.id];
          const prog = nodeProgress(i);
          if (prog <= 0.01) return null;
          const pulse = 1 + 0.028 * Math.sin(frame / 13 + i * 1.3);
          const boost = n.id === "rsf" ? 1 + pivotOn * 0.16 : 1;
          const rNow = n.r * (0.55 + 0.45 * prog) * pulse * boost;

          return (
            <g key={n.id} transform={`translate(${p.x} ${p.y})`} opacity={prog}>
              {/* halo exterieur */}
              <circle
                r={rNow + 8}
                fill={nodeColors(n.kind).base}
                opacity={0.18}
                filter="url(#softGlow)"
              />
              {/* disque radial */}
              <circle r={rNow} fill={`url(#grad-${n.id})`} />
              {/* anneau cisele */}
              <circle
                r={rNow}
                fill="none"
                stroke={COL.ink}
                strokeWidth={2.5}
                strokeOpacity={0.85}
              />
              {/* reflet haut-gauche */}
              <ellipse
                cx={-rNow * 0.28}
                cy={-rNow * 0.34}
                rx={rNow * 0.34}
                ry={rNow * 0.2}
                fill="#ffffff"
                opacity={0.16}
              />
              <text
                x={0}
                y={rNow + 30}
                fill={COL.ink}
                fontSize={27}
                fontFamily="Georgia, serif"
                fontWeight={600}
                textAnchor="middle"
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 52,
          textAlign: "center",
          color: COL.ink,
          fontFamily: "Georgia, serif",
          fontSize: 35,
          letterSpacing: 1,
          opacity: interpolate(frame, [PIVOT_F + 34, PIVOT_F + 74], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Un soutien exterieur suffit a faire basculer l'equilibre.
      </div>
    </AbsoluteFill>
  );
};
