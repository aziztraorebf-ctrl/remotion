// MÉCANIQUE P2 — Badge-faction ancré + déplaçable (décodé Max Bellona, frames RDC/03 Soudan sheets).
//
// Faction = badge (octogone "insigne militaire" OU losange) contenant le sigle, label en plaque dessous,
// couleur = couleur de la zone contrôlée. Posé sur la zone. Se DÉPLACE quand la faction avance.
//
// On compare OCTOGONE vs LOSANGE vs notre CERCLE actuel (test de goût Aziz). NOTRE marque possible :
// portrait stylisé dans le badge plutôt que sigle. Brique pure `FactionBadge` (signature project compatible).

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, Easing } from "remotion";
import { makeSahelProject, SahelFlatMap, SAND, type ProjectFn, type Pt } from "./sandbox";

export const P2_FRAMES = 170;

type Shape = "octagon" | "diamond" | "circle";

function shapePath(shape: Shape, r: number): string {
  if (shape === "circle") return ""; // dessiné via <circle>
  if (shape === "diamond") {
    return `M0,${-r} L${r},0 L0,${r} L${-r},0 Z`;
  }
  // octagon
  const k = r * 0.41; // offset des pans coupés
  return `M${-k},${-r} L${k},${-r} L${r},${-k} L${r},${k} L${k},${r} L${-k},${r} L${-r},${k} L${-r},${-k} Z`;
}

// ── Brique : badge-faction ancré, optionnellement en mouvement (from→to). ──
export const FactionBadge: React.FC<{
  project: ProjectFn;
  // position fixe (geo) OU trajectoire (from→to sur [moveAt, moveAt+moveDur])
  geo: [number, number]; geoTo?: [number, number]; moveAt?: number; moveDur?: number;
  frame: number; startF: number; sigle: string; label: string; color: string;
  shape?: Shape; r?: number; fps: number;
}> = ({ project, geo, geoTo, moveAt, moveDur = 60, frame, startF, sigle, label, color, shape = "octagon", r = 34, fps }) => {
  if (frame < startF) return null;
  // position interpolée si trajectoire
  let lon = geo[0], lat = geo[1];
  if (geoTo && moveAt != null) {
    const t = Math.max(0, Math.min(1, (frame - moveAt) / moveDur));
    const e = Easing.inOut(Easing.cubic)(t);
    lon = geo[0] + (geoTo[0] - geo[0]) * e;
    lat = geo[1] + (geoTo[1] - geo[1]) * e;
  }
  const pos = project(lon, lat);
  const pop = spring({ frame: frame - startF, fps, config: { damping: 13, stiffness: 150 } });
  const rr = r * pop;
  const moving = geoTo && moveAt != null && frame >= moveAt && frame <= moveAt + moveDur;
  return (
    <g transform={`translate(${pos.x},${pos.y})`} opacity={Math.min(1, pop * 1.3)}>
      {/* trace de déplacement (sillage court derrière le badge en mouvement) */}
      {moving && (
        <line x1={project(geo[0], geo[1]).x - pos.x} y1={project(geo[0], geo[1]).y - pos.y} x2={0} y2={0}
          stroke={color} strokeWidth={3} strokeDasharray="2 6" opacity={0.4} strokeLinecap="round" />
      )}
      {/* halo clair sous le badge */}
      {shape === "circle"
        ? <circle r={rr + 3} fill="#F4ECD8" />
        : <path d={shapePath(shape, rr + 3)} fill="#F4ECD8" />}
      {/* badge */}
      {shape === "circle"
        ? <circle r={rr} fill={color} stroke={SAND.INK} strokeWidth={2.5} />
        : <path d={shapePath(shape, rr)} fill={color} stroke={SAND.INK} strokeWidth={2.5} />}
      <text y={0} textAnchor="middle" dominantBaseline="central" fontSize={rr * 0.42} fontWeight={800}
        fill="#F4ECD8" style={{ fontFamily: "Georgia, serif" }}>{sigle}</text>
      {/* plaque label dessous */}
      {pop > 0.7 && (
        <g transform={`translate(0,${rr + 13})`}>
          <rect x={-label.length * 4.4} y={-9} width={label.length * 8.8} height={18} rx={2} fill={SAND.INK} opacity={0.92} />
          <text textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}
            fill="#F4ECD8" style={{ fontFamily: "Georgia, serif" }}>{label}</text>
        </g>
      )}
    </g>
  );
};

// ════════════ DÉMO : comparaison formes + déplacement ════════════
export const P2_FactionBadgeDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const project = makeSahelProject(width, height);

  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      <SahelFlatMap project={project} width={width} height={height} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {/* COMPARAISON 3 formes (statiques) — nord Mali */}
        <FactionBadge project={project} geo={[-3.0, 18.0]} frame={frame} startF={15}
          sigle="JNIM" label="JNIM" color={SAND.RED_WAR} shape="octagon" fps={fps} />
        <FactionBadge project={project} geo={[1.5, 18.0]} frame={frame} startF={30}
          sigle="EIGS" label="EIGS" color="#5A2424" shape="diamond" fps={fps} />
        <FactionBadge project={project} geo={[6.5, 18.0]} frame={frame} startF={45}
          sigle="AES" label="(cercle actuel)" color={SAND.INK} shape="circle" fps={fps} />

        {/* DÉPLACEMENT : une faction avance (centre Mali → est, prise de terrain) */}
        <FactionBadge project={project} geo={[-3.95, 14.6]} geoTo={[1.0, 15.2]} moveAt={80} moveDur={70}
          frame={frame} startF={60} sigle="JNIM" label="avance JNIM" color={SAND.RED_WAR} shape="octagon" fps={fps} />
      </svg>
      <div style={{ position: "absolute", left: 40, top: 36, color: SAND.INK, fontFamily: "Georgia, serif" }}>
        <div style={{ fontSize: 13, letterSpacing: 3, opacity: 0.6 }}>R&D · MÉCANIQUE P2</div>
        <div style={{ fontSize: 26, fontWeight: 800 }}>Badge-faction : octogone / losange / cercle + déplacement</div>
      </div>
    </AbsoluteFill>
  );
};
