import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Audio,
  Sequence,
  staticFile,
} from "remotion";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type SimulationNodeDatum,
} from "d3-force";
import { BEAT3, FPS as TIMING_FPS } from "../../warmap/soudan-acte4/soudanActe4Timing";

// ============================================================================================
// ACTE 4 — BEAT 3 "Le miroir egyptien" (mode d'action) — D3-FORCE, reseau qui se RECOMPOSE.
//
// Registre = schema de reseau abstrait (fond bleu nuit), adapte du proto valide
// ForceNetworkProto16x9.tsx. Sujet ICI : l'Egypte rejoint le camp SAF (renseignement +
// coordination avec les generaux) — PAS le triangle RSF-Or-Emirats du proto (ca c'est l'Acte 5).
//
// Intention : a "l'Egypte ne se contente plus de regarder" (egypteNommee), le noeud EGYPTE se
// LIE au SAF -> le reseau se RECOMPOSE physiquement (2 layouts cuits, deterministe), le camp SAF
// se renforce visuellement (lien Russie-SAF deja etabli B1-B2 + nouveau lien Egypte-SAF).
//
// DETERMINISME : simulations d3-force CUITES dans useMemo (positions initiales FIXES, zero
// Math.random). Chaque frame ne fait QUE lire/interpoler. Meme methode que le proto.
//
// Raccord : B2 (globe) finit sur Port-Soudan/mer Rouge -> B3 (ce schema abstrait) -> fade
// acceptable en entree/sortie (cf brief). Compo AUTONOME, frame 0 LOCAL = debut du beat 3.
// ============================================================================================

const W = 1920;
const H = 1080;

// Duree = portion Beat 3 de l'audio p3 (0 -> BEAT3.end, relatif au debut de p3) + petite queue de raccord.
const BEAT3_DUR_S = (BEAT3.end - BEAT3.start) / TIMING_FPS; // ~17.58s
export const ACTE4_B3_FRAMES = Math.round(BEAT3_DUR_S * TIMING_FPS) + 24; // + ~0.8s queue fade-out

// --- Jalons narratifs LOCAUX (relatifs au debut du beat 3), en frames ---
const T = {
  start: 0,
  egypteNommee: BEAT3.egypteNommee - BEAT3.start, // "l'Egypte ne se contente plus de regarder" — le lien se noue
  renseignement: BEAT3.renseignement - BEAT3.start, // "passe surtout par le renseignement"
  coordonne: BEAT3.coordonne - BEAT3.start, // "Elle coordonne aussi avec les generaux"
  end: BEAT3.end - BEAT3.start,
};

const COL = {
  bg0: "#050912",
  bg1: "#0e1830",
  ink: "#e8dcc0",
  gold: "#e8b44a",
  danger: "#d6552e",
  steel: "#5a8fc0",
  nodeSAF: "#2E6DB4", // SAF_BLUE (coherent episode)
  nodeSAFHi: "#7fa8d8",
  nodeRSF: "#C0392B", // RSF_RED (coherent episode)
  nodeRSFHi: "#e8836f",
  nodeExt: "#3e7c5a",
  nodeExtHi: "#6fb890",
  nodeEgy: "#7fae6a", // vert Egypte (meme famille que B6)
  nodeEgyHi: "#a8d090",
};

type Kind = "saf" | "rsf" | "ext" | "egy";
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
  kind: "base" | "pivot" | "tension";
}

// Noeuds : SAF (central), RSF (camp adverse), Russie (deja liee au SAF depuis B1-B2 — le lien
// EXISTE des le debut du beat 3, pas de recomposition dessus), Egypte (le nouvel entrant).
const NODES: NodeSpec[] = [
  { id: "saf", label: "Armee (SAF)", kind: "saf", ix: 0.42, iy: 0.46, r: 50 },
  { id: "rsf", label: "RSF", kind: "rsf", ix: 0.68, iy: 0.62, r: 44 },
  { id: "russie", label: "Russie", kind: "ext", ix: 0.24, iy: 0.24, r: 36 },
  { id: "egypte", label: "Egypte", kind: "egy", ix: 0.74, iy: 0.24, r: 36 },
];

// AVANT : SAF-RSF (tension du conflit) + SAF-Russie (deja acquis, B1-B2). L'Egypte n'est PAS liee.
const BASE_LINKS: LinkSpec[] = [
  { source: "saf", target: "rsf", kind: "tension" },
  { source: "saf", target: "russie", kind: "base" },
];
// APRES : + le nouveau lien Egypte-SAF (renseignement + coordination generaux).
const PIVOT_LINKS: LinkSpec[] = [{ source: "egypte", target: "saf", kind: "pivot" }];
const ALL_LINKS = [...BASE_LINKS, ...PIVOT_LINKS];

interface SimNode extends SimulationNodeDatum, NodeSpec {}

// Cuisson d'un layout pour un jeu de liens donne (deterministe, copie du pattern proto).
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
        .distance((l: any) => (l.kind === "pivot" ? 260 : l.kind === "tension" ? 300 : 230))
        .strength(0.45),
    )
    .force("charge", forceManyBody().strength(-1600))
    .force("center", forceCenter(W / 2, H / 2))
    .force("collide", forceCollide().radius((d: any) => d.r + 38))
    .stop();

  sim.tick(320);

  const out: Record<string, { x: number; y: number }> = {};
  nodes.forEach((n) => {
    out[n.id] = { x: n.x as number, y: n.y as number };
  });
  return out;
}

function nodeColors(kind: Kind): { base: string; hi: string } {
  return kind === "saf"
    ? { base: COL.nodeSAF, hi: COL.nodeSAFHi }
    : kind === "rsf"
      ? { base: COL.nodeRSF, hi: COL.nodeRSFHi }
      : kind === "egy"
        ? { base: COL.nodeEgy, hi: COL.nodeEgyHi }
        : { base: COL.nodeExt, hi: COL.nodeExtHi };
}

const SoudanActe4B3ForceInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // DEUX layouts cuits : AVANT (SAF-RSF + SAF-Russie) et APRES (+ Egypte-SAF).
  const posBefore = useMemo(() => cookLayout(BASE_LINKS), []);
  const posAfter = useMemo(() => cookLayout(ALL_LINKS), []);

  const start = useMemo(() => {
    const s: Record<string, { x: number; y: number }> = {};
    NODES.forEach((n) => {
      s[n.id] = { x: n.ix * W, y: n.iy * H };
    });
    return s;
  }, []);

  const PIVOT_F = T.egypteNommee;

  // Arrivee echelonnee des noeuds (spring tomber-sec) — meme pattern que le proto.
  const nodeProgress = (i: number) => {
    const localF = frame - i * 7;
    return spring({
      frame: Math.max(0, localF),
      fps,
      config: { mass: 1, damping: 13, stiffness: 95 },
      durationInFrames: 42,
    });
  };

  // Recomposition physique : de posBefore vers posAfter des que l'Egypte "entre en scene".
  const recompose = spring({
    frame: Math.max(0, frame - PIVOT_F),
    fps,
    config: { mass: 1, damping: 16, stiffness: 60 },
    durationInFrames: 60,
  });

  // Drift ambiant global (le reseau "respire").
  const driftX = Math.sin(frame / 90) * 9;
  const driftY = Math.cos(frame / 110) * 7;

  const targetXY = (id: string) => ({
    x: interpolate(recompose, [0, 1], [posBefore[id].x, posAfter[id].x]) + driftX,
    y: interpolate(recompose, [0, 1], [posBefore[id].y, posAfter[id].y]) + driftY,
  });

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
  // Le halo SAF se renforce progressivement (renseignement -> coordination) : deux paliers.
  const renforce = interpolate(
    frame,
    [T.renseignement, T.renseignement + 20, T.coordonne, T.coordonne + 20],
    [0, 0.55, 0.55, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const flowOffset = (frame * 3) % 60;

  // Sous-titres synchronises aux jalons (registre sobre, bas de cadre).
  const subtitleOpacity = (from: number, to: number) =>
    interpolate(frame, [from, from + 10, to - 10, to], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const subtitles: { text: string; from: number; to: number }[] = [
    { text: "L'Egypte ne se contente plus de regarder.", from: T.egypteNommee, to: T.renseignement + 18 },
    { text: "Son soutien passe surtout par le renseignement.", from: T.renseignement, to: T.coordonne + 4 },
    { text: "Elle coordonne aussi avec les généraux.", from: T.coordonne, to: T.end },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COL.bg0 }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 42%, ${COL.bg1} 0%, ${COL.bg0} 74%)`,
        }}
      />

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="a4b3glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {NODES.map((n) => {
            const c = nodeColors(n.kind);
            return (
              <radialGradient key={`grad-${n.id}`} id={`a4b3grad-${n.id}`} cx="38%" cy="34%" r="75%">
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
          const isTension = l.kind === "tension";
          const appear = isPivot ? pivotOn : 1;
          if (appear <= 0.01) return null;

          const stroke = isPivot ? COL.nodeEgyHi : isTension ? COL.danger : COL.steel;
          const width = isPivot ? 2 + pivotOn * 3.4 : isTension ? 3.4 : 3;

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
                strokeOpacity={isTension ? 0.55 : 0.85 * appear}
                strokeDasharray={isPivot ? len : isTension ? "10 8" : undefined}
                strokeDashoffset={isPivot ? len * (1 - pivotOn) : undefined}
                strokeLinecap="round"
              />
              {isPivot && pivotOn > 0.9 && (
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={COL.nodeEgyHi}
                  strokeWidth={5}
                  strokeOpacity={0.85}
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
          // Le SAF grossit legerement a mesure que le soutien egyptien se renforce (renseignement + coordination).
          const boost = n.id === "saf" ? 1 + renforce * 0.14 : n.id === "egypte" ? 1 + pivotOn * 0.1 : 1;
          const rNow = n.r * (0.55 + 0.45 * prog) * pulse * boost;

          return (
            <g key={n.id} transform={`translate(${p.x} ${p.y})`} opacity={prog}>
              <circle r={rNow + 8} fill={nodeColors(n.kind).base} opacity={0.18} filter="url(#a4b3glow)" />
              <circle r={rNow} fill={`url(#a4b3grad-${n.id})`} />
              <circle r={rNow} fill="none" stroke={COL.ink} strokeWidth={2.5} strokeOpacity={0.85} />
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

      {/* Sous-titre bas de cadre, sobre — Georgia, style B6 pour coherence de registre. */}
      {subtitles.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 58,
            textAlign: "center",
            color: COL.ink,
            fontFamily: "Georgia, serif",
            fontSize: 33,
            letterSpacing: 0.6,
            opacity: subtitleOpacity(s.from, s.to),
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          {s.text}
        </div>
      ))}
    </AbsoluteFill>
  );
};

export const SoudanActe4B3Force: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* p3 contient BEAT3 ET BEAT4 concatenes — on ne joue QUE la portion Beat 3 (0 -> BEAT3.end
          relatif au debut de p3), coupee via endAt pour ne pas deborder sur le Beat 4 (Nil). */}
      <Sequence from={0} durationInFrames={ACTE4_B3_FRAMES}>
        <Audio
          src={staticFile("_shared/audio/soudan/acte4-voisins-aspires-p3.mp3")}
          endAt={Math.max(1, BEAT3.end - BEAT3.start)}
        />
      </Sequence>
      <SoudanActe4B3ForceInner />
    </AbsoluteFill>
  );
};
