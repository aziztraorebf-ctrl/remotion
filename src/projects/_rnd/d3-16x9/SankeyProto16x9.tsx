import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
} from "remotion";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";

export const SANKEY_FRAMES = 300; // 10s

// ---------------------------------------------------------------------------
// PROTO R&D — SANKEY (d3-sankey) : flux de ressources qui se ramifient en
// rubans EPAIS proportionnels. L'or du Darfour -> Khartoum -> sorties.
// L'Acte 3 le raconte avec un arc simple ; le Sankey le rend QUANTITATIF.
//
// Deterministe : d3-sankey calcule le layout une fois (useMemo), la frame ne
// fait que reveler (stroke-dashoffset) et faire circuler des gouttes.
// ---------------------------------------------------------------------------

const W = 1920;
const H = 1080;

const COL = {
  bg0: "#0b1220",
  bg1: "#131f33",
  ink: "#e8dcc0",
  gold: "#e8b44a",
  goldHi: "#ffe39a",
  danger: "#d6552e",
  steel: "#5a8fc0",
  green: "#3e7c5a",
  muted: "#6b7d94",
};

// noeuds (sources -> hub -> sorties) et flux (valeurs = tonnages relatifs)
const NODES = [
  { name: "Darfour" },      // 0
  { name: "Est" },          // 1
  { name: "Khartoum" },     // 2 (hub)
  { name: "Dubai" },        // 3
  { name: "Marches" },      // 4
  { name: "Local" },        // 5
];
const LINKS = [
  { source: 0, target: 2, value: 52 },
  { source: 1, target: 2, value: 26 },
  { source: 2, target: 3, value: 48 }, // le gros part a Dubai
  { source: 2, target: 4, value: 22 },
  { source: 2, target: 5, value: 8 },
];

function nodeColor(name: string): string {
  if (name === "Darfour") return COL.gold;
  if (name === "Est") return COL.danger;
  if (name === "Khartoum") return COL.ink;
  if (name === "Dubai") return COL.goldHi;
  if (name === "Marches") return COL.steel;
  return COL.green;
}

export const SankeyProto16x9: React.FC = () => {
  const frame = useCurrentFrame();

  const { nodes, links } = useMemo(() => {
    const gen = sankey<any, any>()
      .nodeWidth(26)
      .nodePadding(40)
      .extent([
        [W * 0.16, H * 0.18],
        [W * 0.86, H * 0.82],
      ]);
    const graph = gen({
      nodes: NODES.map((d) => ({ ...d })),
      links: LINKS.map((d) => ({ ...d })),
    });
    return { nodes: graph.nodes, links: graph.links };
  }, []);

  const linkGen = useMemo(() => sankeyLinkHorizontal(), []);

  return (
    <AbsoluteFill style={{ backgroundColor: COL.bg0 }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, ${COL.bg1} 0%, ${COL.bg0} 74%)`,
        }}
      />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {/* RUBANS (links) — se revelent par stroke-dashoffset, echelonnes gauche->droite */}
        {links.map((lk: any, i: number) => {
          const d = linkGen(lk) || "";
          const width = Math.max(2, lk.width);
          // ordre de revelation : les liens sources d'abord, puis sorties
          const startF = 20 + (lk.source.x0 < W * 0.4 ? 0 : 60) + i * 8;
          const reveal = interpolate(frame, [startF, startF + 40], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          if (reveal <= 0.01) return null;
          const col = nodeColor(lk.source.name);
          const flow = (frame * 3) % 60;
          return (
            <g key={i}>
              <path
                d={d}
                fill="none"
                stroke={col}
                strokeOpacity={0.42 * reveal}
                strokeWidth={width}
              />
              {/* gouttes qui circulent quand le ruban est revele */}
              {reveal > 0.95 && (
                <path
                  d={d}
                  fill="none"
                  stroke={COL.goldHi}
                  strokeOpacity={0.7}
                  strokeWidth={Math.min(width, 8)}
                  strokeDasharray="8 52"
                  strokeDashoffset={-flow}
                />
              )}
            </g>
          );
        })}

        {/* NOEUDS (barres verticales) + labels */}
        {nodes.map((n: any, i: number) => {
          const app = interpolate(frame, [10 + i * 6, 40 + i * 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          if (app <= 0.01) return null;
          const h = n.y1 - n.y0;
          const isRight = n.x0 > W * 0.5;
          return (
            <g key={i} opacity={app}>
              <rect
                x={n.x0}
                y={n.y0}
                width={n.x1 - n.x0}
                height={h}
                fill={nodeColor(n.name)}
                rx={3}
                stroke={COL.bg0}
                strokeWidth={1}
              />
              <text
                x={isRight ? n.x1 + 14 : n.x0 - 14}
                y={n.y0 + h / 2 + 8}
                fill={COL.ink}
                fontSize={26}
                fontFamily="Georgia, serif"
                fontWeight={600}
                textAnchor={isRight ? "start" : "end"}
              >
                {n.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{ position: "absolute", left: 80, top: 60, color: COL.ink, fontFamily: "Georgia, serif" }}>
        <div style={{ fontSize: 24, letterSpacing: 3, opacity: 0.7 }}>OU VA L'OR</div>
        <div style={{ fontSize: 42, fontWeight: 700 }}>Du Darfour aux marches</div>
      </div>
    </AbsoluteFill>
  );
};
