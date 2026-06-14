// MÉCANIQUE P3 — Transformation carte géo → carte de guerre (décodé Max Bellona, hook RDC 21-34s).
//
// LE coup du hook : le MÊME objet-carte se métamorphose. "ce n'est plus une carte de pays, c'est une carte
// de guerre". Séquence : carte nue → nom + data pop (paradoxe richesse) → la carte se TEINTE de guerre
// (zones rouges montent) + jetons-factions pop. Une seule métaphore tenue.
//
// ⭐ USAGE = HOOK AES 30s. Voir memory/doctrines/HOOK-MAXBELLONA-GABARIT.md.

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, Easing } from "remotion";
import { makeSahelProject, SahelFlatMap, SAND, ringToPath, type ProjectFn } from "./sandbox";
import { MALI_RING, BURKINA_RING, NIGER_RING } from "../../parties/sahelCountries";
import { FactionBadge } from "./P2_FactionBadge";

export const P3_FRAMES = 240;

// jalons (×30fps) — gabarit hook
const F_NAME = 10;     // le nom s'écrit
const F_DATA = 45;     // data-points pop (or/uranium/pétrole + pauvreté)
const F_TRANSFORM = 110; // ⭐ la carte se teinte de guerre
const F_FACTIONS = 150;  // jetons-factions pop
const F_QUESTION = 200;  // question / boucle ouverte

// zones d'insécurité (centres geo, rayon px) qui montent au moment TRANSFORM
const WAR_ZONES: { c: [number, number]; r: number }[] = [
  { c: [-3.95, 14.6], r: 90 },   // centre Mali (Mopti)
  { c: [-1.63, 14.1], r: 70 },   // nord Burkina (Djibo)
  { c: [1.45, 14.21], r: 75 },   // ouest Niger (Tillabéri)
  { c: [2.4, 15.92], r: 60 },    // est Mali (Ménaka)
];

export const P3_MapTransformDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const project = makeSahelProject(width, height);

  // registre guerre : on NE repeint PAS les pays en rouge (ça tue les couleurs nationales = bouillie terne).
  // On garde les couleurs nationales, on assombrit légèrement (voile) + on fait monter les ZONES rouges
  // par-dessus (le contrôle se lit comme des taches, cohérent grammaire causale). warTint léger pour SahelFlatMap.
  const warTint = interpolate(frame, [F_TRANSFORM, F_TRANSFORM + 40], [0, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const darkVeil = interpolate(frame, [F_TRANSFORM, F_TRANSFORM + 40], [0, 0.28], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

  const nameOp = interpolate(frame, [F_NAME, F_NAME + 20], [0, 1], { extrapolateRight: "clamp" });
  // le nom recule quand la transformation arrive
  const nameFade = interpolate(frame, [F_TRANSFORM, F_TRANSFORM + 25], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // data chips (paradoxe)
  const dataChips = [
    { label: "OR", x: 0.26, color: "#C9A24B" },
    { label: "URANIUM", x: 0.42, color: "#9CA85E" },
    { label: "PÉTROLE", x: 0.60, color: "#2A1C0E" },
  ];
  const dataOp = interpolate(frame, [F_DATA, F_DATA + 18], [0, 1], { extrapolateRight: "clamp" });
  const dataFade = interpolate(frame, [F_TRANSFORM, F_TRANSFORM + 20], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const factions: { geo: [number, number]; sigle: string; label: string; color: string; shape: "octagon" | "diamond"; at: number }[] = [
    { geo: [-3.5, 16.0], sigle: "JNIM", label: "JNIM", color: SAND.RED_WAR, shape: "octagon", at: F_FACTIONS },
    { geo: [2.0, 16.2], sigle: "EIGS", label: "EIGS", color: "#5A2424", shape: "diamond", at: F_FACTIONS + 18 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      {/* carte plate : warTint pilote la bascule registre */}
      <SahelFlatMap project={project} width={width} height={height} warTint={warTint} />

      {/* zones d'insécurité qui MONTENT (taches rouges diffuses, clippées aux pays) */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="aesClip">
            <path d={ringToPath(MALI_RING, project)} />
            <path d={ringToPath(BURKINA_RING, project)} />
            <path d={ringToPath(NIGER_RING, project)} />
          </clipPath>
          <radialGradient id="warGrad">
            <stop offset="0%" stopColor="#9E2B2B" stopOpacity={0.95} />
            <stop offset="55%" stopColor={SAND.RED_WAR} stopOpacity={0.75} />
            <stop offset="100%" stopColor={SAND.RED_WAR} stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* voile sombre = registre "guerre" (assombrit la carte sans la repeindre) */}
        <rect x={0} y={0} width={width} height={height} fill="#1a0e08" opacity={darkVeil} />
        <g clipPath="url(#aesClip)">
          {WAR_ZONES.map((z, i) => {
            const p = project(z.c[0], z.c[1]);
            const rise = interpolate(frame, [F_TRANSFORM + i * 6, F_TRANSFORM + 30 + i * 6], [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
            const pulse = 1 + 0.05 * Math.sin((frame - F_TRANSFORM) * 0.15 + i);
            return <circle key={i} cx={p.x} cy={p.y} r={z.r * rise * pulse} fill="url(#warGrad)" opacity={rise} />;
          })}
        </g>
      </svg>

      {/* jetons-factions */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {frame >= F_FACTIONS && factions.map((f, i) => (
          <FactionBadge key={i} project={project} geo={f.geo} frame={frame} startF={f.at}
            sigle={f.sigle} label={f.label} color={f.color} shape={f.shape} r={30} fps={fps} />
        ))}
      </svg>

      {/* NOM (registre géo) */}
      {nameOp > 0 && nameFade > 0 && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          opacity: nameOp * nameFade, pointerEvents: "none",
        }}>
          <div style={{ textAlign: "center", fontFamily: "Georgia, serif", color: SAND.INK }}>
            <div style={{ fontSize: 16, letterSpacing: 8, opacity: 0.6 }}>LE CŒUR DU</div>
            <div style={{ fontSize: 72, fontWeight: 800, marginTop: 4 }}>SAHEL</div>
          </div>
        </div>
      )}

      {/* DATA CHIPS (paradoxe richesse) */}
      {dataOp > 0 && dataFade > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: dataOp * dataFade, pointerEvents: "none" }}>
          {dataChips.map((c, i) => (
            <div key={i} style={{
              position: "absolute", left: `${c.x * 100}%`, top: "70%", transform: "translate(-50%,0)",
              background: c.color, color: "#F4ECD8", padding: "8px 18px", borderRadius: 6,
              fontFamily: "Georgia, serif", fontWeight: 800, fontSize: 22, border: "2px solid #F4ECD8",
            }}>{c.label}</div>
          ))}
          <div style={{
            position: "absolute", left: "50%", top: "82%", transform: "translate(-50%,0)",
            color: SAND.RED_WAR, fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 20,
          }}>…et pourtant : des milliers de morts</div>
        </div>
      )}

      {/* PHRASE TRANSFORM */}
      {frame >= F_TRANSFORM && frame < F_QUESTION && (
        <div style={{
          position: "absolute", left: 0, right: 0, top: 40, textAlign: "center",
          opacity: interpolate(frame, [F_TRANSFORM, F_TRANSFORM + 20, F_QUESTION - 20, F_QUESTION], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          fontFamily: "Georgia, serif", color: SAND.INK, fontSize: 30, fontWeight: 800,
        }}>Ce n'est plus une carte de pays. C'est une carte de guerre.</div>
      )}

      {/* QUESTION (boucle ouverte) */}
      {frame >= F_QUESTION && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "center",
          paddingBottom: 70, opacity: interpolate(frame, [F_QUESTION, F_QUESTION + 18], [0, 1], { extrapolateRight: "clamp" }),
          pointerEvents: "none",
        }}>
          <div style={{ textAlign: "center", fontFamily: "Georgia, serif", color: SAND.INK, fontSize: 26, fontWeight: 700, lineHeight: 1.5 }}>
            Comment trois pays pauvres ont-ils défié la France ?
          </div>
        </div>
      )}

      <div style={{ position: "absolute", left: 40, top: 36, color: SAND.INK, fontFamily: "Georgia, serif", opacity: 0.5 }}>
        <div style={{ fontSize: 12, letterSpacing: 3 }}>R&D · MÉCANIQUE P3 · HOOK AES</div>
      </div>
    </AbsoluteFill>
  );
};
