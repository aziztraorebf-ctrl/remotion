// MÉCANIQUE P1 — Liens orthogonaux "circuit" sur la carte (décodé Max Bellona, frame Soudan/01).
//
// Jetons-acteurs ancrés à des lieux réels, reliés par un TRACÉ ORTHOGONAL (angles droits, style schéma
// de circuit/métro) qui se DESSINE (draw-in), avec un NŒUD qui pulse à l'arrivée. Lisibilité "X relié à Y".
//
// ⭐ USAGE POLISH : CONFÉDÉRATION AES — Mali/Burkina/Niger reliés à un sceau central + soutiens étrangers.
// Le cas "dur à représenter d'habitude". NOTRE marque : pas de photos réelles → pastille drapeau/portrait stylisé.
//
// Brique pure réutilisable `OrthoLink` (signature project compatible SahelRenderContext).

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, Easing } from "remotion";
import { makeSahelProject, SahelFlatMap, SAND, type ProjectFn, type Pt } from "./sandbox";

export const P1_FRAMES = 200;

// ── Tracé orthogonal entre 2 points : on sort verticalement de A, coude, arrive sur B. ──
// elbow = fraction du trajet vertical avant le coude horizontal (0..1).
function orthoPath(a: Pt, b: Pt, elbow = 0.5): { d: string; len: number } {
  const midY = a.y + (b.y - a.y) * elbow;
  const segs = [a, { x: a.x, y: midY }, { x: b.x, y: midY }, b];
  let d = `M${segs[0].x.toFixed(1)},${segs[0].y.toFixed(1)}`;
  let len = 0;
  for (let i = 1; i < segs.length; i++) {
    d += `L${segs[i].x.toFixed(1)},${segs[i].y.toFixed(1)}`;
    len += Math.hypot(segs[i].x - segs[i - 1].x, segs[i].y - segs[i - 1].y);
  }
  return { d, len };
}

// ── Brique : un lien orthogonal animé (draw-in) entre nœud source et nœud cible. ──
export const OrthoLink: React.FC<{
  from: Pt; to: Pt; frame: number; startF: number; drawDur?: number;
  color?: string; width?: number; elbow?: number;
}> = ({ from, to, frame, startF, drawDur = 26, color = SAND.INK, width = 3.5, elbow = 0.5 }) => {
  if (frame < startF) return null;
  const { d, len } = orthoPath(from, to, elbow);
  const t = Math.max(0, Math.min(1, (frame - startF) / drawDur));
  const eased = Easing.out(Easing.cubic)(t);
  return (
    <g>
      {/* halo sous le trait (lisibilité sur fond clair) */}
      <path d={d} fill="none" stroke="#F4ECD8" strokeWidth={width + 3} strokeLinejoin="round"
        strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - eased)} opacity={0.9} />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round"
        strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - eased)} />
    </g>
  );
};

// ── Brique : jeton-acteur ancré (pastille ronde drapeau-couleur + label sous plaque + point d'ancrage). ──
export const ActorToken: React.FC<{
  pos: Pt; frame: number; startF: number; label: string; sub?: string; color: string; r?: number; pulseAt?: number;
}> = ({ pos, frame, startF, label, sub, color, r = 30, pulseAt }) => {
  const { fps } = useVideoConfig();
  if (frame < startF) return null;
  const pop = spring({ frame: frame - startF, fps, config: { damping: 12, stiffness: 140 } });
  // pulse (à l'arrivée d'un lien)
  const pulse = pulseAt != null && frame >= pulseAt
    ? Math.max(0, 1 - (frame - pulseAt) / 18) : 0;
  const rr = r * pop;
  return (
    <g transform={`translate(${pos.x},${pos.y})`} opacity={Math.min(1, pop * 1.2)}>
      {/* point d'ancrage au sol */}
      <circle cx={0} cy={0} r={3.5} fill={SAND.INK} />
      {/* anneau pulse */}
      {pulse > 0 && <circle cx={0} cy={-r - 6} r={rr * (1 + pulse * 0.8)} fill="none" stroke={color} strokeWidth={2} opacity={pulse * 0.7} />}
      {/* tige fine ancre→pastille */}
      <line x1={0} y1={0} x2={0} y2={-r - 6 + rr} stroke={SAND.INK} strokeWidth={2} opacity={0.7} />
      {/* pastille */}
      <circle cx={0} cy={-r - 6} r={rr} fill={color} stroke="#F4ECD8" strokeWidth={3} />
      <text x={0} y={-r - 6} textAnchor="middle" dominantBaseline="central" fontSize={rr * 0.5}
        fontWeight={800} fill="#F4ECD8" style={{ fontFamily: "Georgia, serif" }}>
        {label.slice(0, 3).toUpperCase()}
      </text>
      {/* plaque label sous la pastille */}
      {pop > 0.7 && (
        <g transform={`translate(0,${-r - 6 + rr + 14})`}>
          <rect x={-label.length * 4.6} y={-9} width={label.length * 9.2} height={18} rx={3} fill={SAND.INK} opacity={0.92} />
          <text x={0} y={0} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}
            fill="#F4ECD8" style={{ fontFamily: "Georgia, serif" }}>{label}</text>
          {sub && <text x={0} y={16} textAnchor="middle" fontSize={9} fill={SAND.INK} opacity={0.75}
            style={{ fontFamily: "Georgia, serif" }}>{sub}</text>}
        </g>
      )}
    </g>
  );
};

// ════════════ DÉMO : CONFÉDÉRATION AES ════════════
// 3 capitales (Bamako, Ouaga, Niamey) → relient un SCEAU central (l'accord). Puis soutiens étrangers reliés.
export const P1_OrthoLinksDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const project = makeSahelProject(width, height);

  const BAMAKO = project(-8.0, 12.65);
  const OUAGA = project(-1.52, 12.37);
  const NIAMEY = project(2.12, 13.51);
  const SCEAU = project(-1.0, 16.8); // centre nord du bloc (point de convergence AES)
  const RUSSIE = project(13.5, 23.0); // soutien (coin nord-est, hors-champ symbolique)

  // séquençage (forced-alignment-like) — jamais simultané
  const capitals = [
    { pos: BAMAKO, label: "MALI", sub: "Bamako", color: SAND.MALI, at: 20, linkAt: 40 },
    { pos: OUAGA, label: "BURKINA", sub: "Ouaga", color: SAND.BURKINA, at: 35, linkAt: 60 },
    { pos: NIAMEY, label: "NIGER", sub: "Niamey", color: SAND.NIGER, at: 50, linkAt: 80 },
  ];
  const sceauAt = 95;
  const russieAt = 120;

  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      <SahelFlatMap project={project} width={width} height={height} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {/* liens capitales → sceau (se dessinent l'un après l'autre, convergent vers le centre) */}
        {capitals.map((c, i) => (
          <OrthoLink key={i} from={c.pos} to={SCEAU} frame={frame} startF={c.linkAt} drawDur={24}
            color={c.color} width={4} elbow={0.55} />
        ))}
        {/* lien soutien étranger (pointillé visuel différencié via couleur acier) */}
        <OrthoLink from={RUSSIE} to={SCEAU} frame={frame} startF={russieAt} drawDur={28}
          color="#5E7FA0" width={3} elbow={0.4} />
      </svg>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {/* jetons capitales */}
        {capitals.map((c, i) => (
          <ActorToken key={i} pos={c.pos} frame={frame} startF={c.at} label={c.label} sub={c.sub}
            color={c.color} r={26} pulseAt={c.linkAt + 24} />
        ))}
        {/* SCEAU central AES (apparait quand les 3 fils l'atteignent) */}
        <ActorToken pos={SCEAU} frame={frame} startF={sceauAt} label="AES" sub="Confédération 2024"
          color={SAND.INK} r={34} pulseAt={sceauAt + 6} />
        {/* soutien */}
        <ActorToken pos={RUSSIE} frame={frame} startF={russieAt - 8} label="RUSSIE" sub="Africa Corps"
          color="#5E7FA0" r={22} pulseAt={russieAt + 26} />
      </svg>
      {/* titre discret */}
      <div style={{ position: "absolute", left: 40, top: 36, color: SAND.INK, fontFamily: "Georgia, serif" }}>
        <div style={{ fontSize: 13, letterSpacing: 3, opacity: 0.6 }}>R&D · MÉCANIQUE P1</div>
        <div style={{ fontSize: 26, fontWeight: 800 }}>Liens "circuit" — Confédération AES</div>
      </div>
    </AbsoluteFill>
  );
};
