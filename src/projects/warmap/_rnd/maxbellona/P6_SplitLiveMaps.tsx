// MÉCANIQUE P6 — Split HORIZONTAL (haut/bas) avec DEUX cartes vivantes DIFFÉRENTES (Aziz 2026-06-14).
//
// Reprend la technique split de notre série verticale "Vous oubliez", portée en HORIZONTAL 16:9, mais avec
// 2 VRAIES cartes vivantes distinctes (cadrage géo propre + contenu animé propre par volet) — PAS la même
// carte coupée en deux (défaut signalé sur P5). But : faire passer 2 infos en parallèle, chacune animée.
//
// Volet HAUT : Mali — jeton-faction qui AVANCE (zone qui s'étend). Volet BAS : Niger — front + flux.
// Le slit s'ouvre (les 2 volets glissent en place). Chaque carte a son project cadré sur sa zone.

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing, spring } from "remotion";
import { makeProjectFor, SAND, ringToPath, type ProjectFn, type Bbox, type Pt } from "./sandbox";
import { MALI_RING, NIGER_RING, BURKINA_RING } from "../../parties/sahelCountries";

export const P6_FRAMES = 200;

// fond papier + pays (cadré par project custom) + zones rouges animées
const LiveMapPanel: React.FC<{
  width: number; height: number; project: ProjectFn; rings: { ring: [number, number][]; color: string }[];
  redZones: { c: [number, number]; r: number; grow?: number }[]; frame: number; growAt?: number;
  token?: { from: [number, number]; to: [number, number]; at: number; dur: number; color: string; label: string };
  uid: string;
}> = ({ width, height, project, rings, redZones, frame, growAt = 0, token, uid }) => {
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(160deg, ${SAND.PAPER_TOP}, ${SAND.PAPER_BOT})` }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id={`clip-${uid}`}>
            {rings.map((r, i) => <path key={i} d={ringToPath(r.ring, project)} />)}
          </clipPath>
          <radialGradient id={`rg-${uid}`}>
            <stop offset="0%" stopColor="#9E2B2B" stopOpacity={0.9} />
            <stop offset="100%" stopColor={SAND.RED_WAR} stopOpacity={0} />
          </radialGradient>
        </defs>
        {rings.map((r, i) => (
          <path key={i} d={ringToPath(r.ring, project)} fill={r.color} stroke={SAND.INK}
            strokeWidth={2} strokeOpacity={0.5} opacity={0.92} />
        ))}
        <g clipPath={`url(#clip-${uid})`}>
          {redZones.map((z, i) => {
            const p = project(z.c[0], z.c[1]);
            const g = z.grow != null
              ? interpolate(frame, [growAt, growAt + 50], [z.r * 0.4, z.r], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
              : z.r;
            return <circle key={i} cx={p.x} cy={p.y} r={g} fill={`url(#rg-${uid})`} />;
          })}
        </g>
        {/* jeton-faction qui avance (octogone) */}
        {token && frame >= token.at && (() => {
          const t = Math.max(0, Math.min(1, (frame - token.at) / token.dur));
          const e = Easing.inOut(Easing.cubic)(t);
          const lon = token.from[0] + (token.to[0] - token.from[0]) * e;
          const lat = token.from[1] + (token.to[1] - token.from[1]) * e;
          const p = project(lon, lat); const from = project(token.from[0], token.from[1]);
          const r = 26;
          const k = r * 0.41;
          const oct = `M${-k},${-r} L${k},${-r} L${r},${-k} L${r},${k} L${k},${r} L${-k},${r} L${-r},${k} L${-r},${-k} Z`;
          return (
            <g>
              <line x1={from.x} y1={from.y} x2={p.x} y2={p.y} stroke={token.color} strokeWidth={3} strokeDasharray="2 6" opacity={0.45} strokeLinecap="round" />
              <g transform={`translate(${p.x},${p.y})`}>
                <path d={oct} fill={token.color} stroke="#F4ECD8" strokeWidth={2.5} />
                <text textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={800} fill="#F4ECD8" style={{ fontFamily: "Georgia, serif" }}>{token.label}</text>
              </g>
            </g>
          );
        })()}
      </svg>
    </AbsoluteFill>
  );
};

export const P6_SplitLiveMapsDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // ouverture du split (les 2 bandes glissent en place verticalement)
  const open = interpolate(frame, [8, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const halfH = height / 2;

  // chaque volet : son propre bbox cadré + son project (volet = pleine largeur, demi-hauteur)
  const maliBbox: Bbox = { lonMin: -9, lonMax: 3, latMin: 12.5, latMax: 18 };
  const nigerBbox: Bbox = { lonMin: -1, lonMax: 10, latMin: 11.5, latMax: 17 };
  const projMali = makeProjectFor(maliBbox, width, halfH);
  const projNiger = makeProjectFor(nigerBbox, width, halfH);

  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      {/* VOLET HAUT — MALI : zone JNIM qui s'étend + jeton qui avance */}
      <div style={{ position: "absolute", left: 0, top: 0, width, height: halfH, overflow: "hidden", transform: `translateY(${(1 - open) * -halfH}px)`, opacity: open }}>
        <LiveMapPanel uid="mali" width={width} height={halfH} project={projMali}
          rings={[{ ring: MALI_RING, color: SAND.MALI }, { ring: BURKINA_RING, color: SAND.BURKINA }]}
          redZones={[{ c: [-3.95, 14.6], r: 110, grow: 1 }]} frame={frame} growAt={40}
          token={{ from: [-3.95, 14.6], to: [0.5, 15.8], at: 55, dur: 80, color: SAND.RED_WAR, label: "JNIM" }} />
        <div style={{ position: "absolute", left: 28, top: 18, fontFamily: "Georgia, serif", fontWeight: 800, fontSize: 26, color: SAND.INK }}>MALI — centre sous pression</div>
      </div>

      {/* VOLET BAS — NIGER : front ouest + zone Tillabéri */}
      <div style={{ position: "absolute", left: 0, top: halfH, width, height: halfH, overflow: "hidden", transform: `translateY(${(1 - open) * halfH}px)`, opacity: open }}>
        <LiveMapPanel uid="niger" width={width} height={halfH} project={projNiger}
          rings={[{ ring: NIGER_RING, color: SAND.NIGER }]}
          redZones={[{ c: [1.45, 14.21], r: 95, grow: 1 }, { c: [2.4, 13.7], r: 60, grow: 1 }]} frame={frame} growAt={70}
          token={{ from: [1.45, 14.21], to: [3.5, 13.9], at: 90, dur: 70, color: "#5A2424", label: "EIGS" }} />
        <div style={{ position: "absolute", left: 28, top: 18, fontFamily: "Georgia, serif", fontWeight: 800, fontSize: 26, color: SAND.INK }}>NIGER — frontière ouest</div>
      </div>

      {/* séparateur horizontal net */}
      <div style={{ position: "absolute", left: 0, top: halfH - 3, width, height: 6, background: "#F4ECD8", opacity: open, boxShadow: "0 0 10px rgba(40,28,14,0.4)" }} />

      <div style={{ position: "absolute", left: 40, bottom: 26, color: SAND.INK, fontFamily: "Georgia, serif", opacity: 0.6 }}>
        <div style={{ fontSize: 12, letterSpacing: 3 }}>R&D · MÉCANIQUE P6 · SPLIT HORIZONTAL — 2 cartes vivantes différentes</div>
      </div>
    </AbsoluteFill>
  );
};
