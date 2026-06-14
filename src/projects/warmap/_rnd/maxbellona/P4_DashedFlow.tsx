// MÉCANIQUE P4 — Flux le long d'un trajet pointillé (décodé Max Bellona, frame RDC/04 axe vers Goma).
//
// Un trajet en POINTILLÉS apparaît (intention/mouvement), des jetons CIRCULENT le long. Généralise notre
// RefugeeFlow : ici flux MILITAIRE (axe d'attaque) ou COMMERCIAL (or exporté). Brique `DashedFlow`.
//
// Le pointillé "avance" (dashoffset animé) = sensation de courant. Jetons espacés glissent le long de la polyline.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { makeSahelProject, SahelFlatMap, SAND, type ProjectFn, type Pt } from "./sandbox";

export const P4_FRAMES = 160;

// échantillonne une polyline geo en points écran + longueurs cumulées
function buildPolyline(geo: [number, number][], project: ProjectFn) {
  const pts = geo.map(([lon, lat]) => project(lon, lat));
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  return { pts, cum, total: cum[cum.length - 1] };
}
function pointAt(pts: Pt[], cum: number[], total: number, s: number): Pt {
  const d = s * total;
  for (let i = 1; i < pts.length; i++) {
    if (d <= cum[i]) {
      const t = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
      return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t };
    }
  }
  return pts[pts.length - 1];
}

// ── Brique : flux pointillé + jetons qui circulent. ──
export const DashedFlow: React.FC<{
  project: ProjectFn; geo: [number, number][]; frame: number; startF: number;
  color?: string; tokenColor?: string; nTokens?: number; speed?: number; drawDur?: number; tokenR?: number;
}> = ({ project, geo, frame, startF, color = SAND.INK, tokenColor, nTokens = 4, speed = 0.004, drawDur = 30, tokenR = 9 }) => {
  if (frame < startF) return null;
  const { pts, cum, total } = buildPolyline(geo, project);
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) d += `L${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)}`;
  // draw-in du trajet
  const draw = Math.max(0, Math.min(1, (frame - startF) / drawDur));
  const drawOffset = total * (1 - Easing.out(Easing.cubic)(draw));
  // dash qui défile
  const phase = (frame - startF) * speed * total * 0.2;
  const local = frame - startF;
  return (
    <g>
      {/* trajet pointillé (halo + trait) */}
      <path d={d} fill="none" stroke="#F4ECD8" strokeWidth={6} strokeLinecap="round"
        strokeDasharray={total} strokeDashoffset={drawOffset} opacity={0.8} />
      <path d={d} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeDasharray="3 9"
        strokeDashoffset={-phase} opacity={0.85}
        style={{ strokeDasharray: "3 9", strokeDashoffset: -phase }} />
      {/* jetons qui circulent (apparaissent après le draw-in) */}
      {draw >= 0.95 && Array.from({ length: nTokens }).map((_, i) => {
        const s = ((local * speed) + i / nTokens) % 1;
        const p = pointAt(pts, cum, total, s);
        const fade = Math.min(1, (local - drawDur) / 12);
        return <circle key={i} cx={p.x} cy={p.y} r={tokenR} fill={tokenColor ?? color}
          stroke="#F4ECD8" strokeWidth={2} opacity={Math.max(0, fade)} />;
      })}
    </g>
  );
};

export const P4_DashedFlowDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const project = makeSahelProject(width, height);

  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      <SahelFlatMap project={project} width={width} height={height} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {/* flux MILITAIRE : axe d'attaque (centre Mali → nord-est, vers Gao/Ménaka) */}
        <DashedFlow project={project} frame={frame} startF={15}
          geo={[[-3.95, 14.6], [-1.5, 15.4], [1.0, 16.0], [2.4, 15.9]]}
          color={SAND.RED_WAR} tokenColor={SAND.RED_WAR} nTokens={5} speed={0.0045} />
        {/* flux COMMERCIAL or : Mali → sud (export, doré) */}
        <DashedFlow project={project} frame={frame} startF={45}
          geo={[[-6.0, 13.5], [-5.0, 11.5], [-3.5, 10.0]]}
          color="#C9A24B" tokenColor="#C9A24B" nTokens={3} speed={0.0035} />
      </svg>
      <div style={{ position: "absolute", left: 40, top: 36, color: SAND.INK, fontFamily: "Georgia, serif" }}>
        <div style={{ fontSize: 13, letterSpacing: 3, opacity: 0.6 }}>R&D · MÉCANIQUE P4</div>
        <div style={{ fontSize: 26, fontWeight: 800 }}>Flux pointillé — axe d'attaque (rouge) / or exporté (doré)</div>
      </div>
    </AbsoluteFill>
  );
};
