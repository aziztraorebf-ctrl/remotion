/**
 * soudanActors — jetons-visages + sillage cinétique, repris fidèlement du moteur AES.
 * Posés PAR-DESSUS la carte via le projecteur du SoudanWarMapEngine (children).
 *
 * - SoudanToken : jeton circulaire (parchemin + bordure faction + portrait clippé), D=58px fixe
 *   (lisible à toute échelle, ne grossit pas au zoom — comme AES). Spring d'apparition + respiration.
 * - trail : "la scène trace derrière le jeton qui bouge" (queue de positions récentes, dégradé),
 *   exactement l'effet AES (sillage uniquement en mouvement).
 */
import React from "react";
import { interpolate, staticFile, Easing } from "remotion";

export type Faction = "rsf" | "saf" | "civil";

const FACTION_BORDER: Record<Faction, string> = {
  rsf: "#B14B3C",   // rouge brique RSF
  saf: "#3E6E9E",   // bleu armée SAF
  civil: "#2E2A1E", // encre neutre
};
const FACTION_SPRITE: Record<Faction, string> = {
  rsf: "portrait-rsf",
  saf: "portrait-saf",
  civil: "portrait-civil",
};
const CREAM = "#F2E5C8";

export type Pt = { x: number; y: number };

/** Sillage cinétique : la trace qui suit le jeton en mouvement (dégradé, va en s'estompant). */
export const SoudanTrail: React.FC<{
  trail: Pt[]; faction: Faction; width: number; height: number;
}> = ({ trail, faction, width, height }) => {
  if (trail.length < 2) return null;
  const color = FACTION_BORDER[faction];
  return (
    <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* glow doux sous le sillage (le rend franc sans être dur) */}
      {trail.map((p, i) => {
        if (i === 0) return null;
        const prev = trail[i - 1];
        const t = i / trail.length;
        return (
          <line key={`g${i}`} x1={prev.x} y1={prev.y} x2={p.x} y2={p.y}
            stroke={color} strokeWidth={(3 + t * 9) * 2.2} strokeLinecap="round"
            opacity={t * 0.18} />
        );
      })}
      {trail.map((p, i) => {
        if (i === 0) return null;
        const prev = trail[i - 1];
        const t = i / trail.length;           // 0 (queue, ancien) -> 1 (près du jeton, récent)
        return (
          <line key={i} x1={prev.x} y1={prev.y} x2={p.x} y2={p.y}
            stroke={color} strokeWidth={3 + t * 9} strokeLinecap="round"
            opacity={t * 0.72} />
        );
      })}
    </svg>
  );
};

/** Objet ISO 3D posé sur la carte (base militaire / dépôt). Repris du pattern AES (mixBlend multiply
 * pour effacer le fond blanc du sprite + halo crème dessous + spring d'apparition). Taille écran fixe. */
export const SoudanBase: React.FC<{
  pos: Pt; frame: number; appear: number; sprite?: string; size?: number; label?: string; fade?: number;
}> = ({ pos, frame, appear, sprite = "base-france", size = 76, label, fade = 1 }) => {
  if (frame < appear) return null;
  const sp = interpolate(frame, [appear, appear + 22], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const breathe = 1 + 0.015 * Math.sin((frame + appear * 5) * 0.06);
  return (
    <div style={{ position: "absolute", left: pos.x, top: pos.y,
        transform: `translate(-50%,-60%) scale(${sp * breathe})`, opacity: sp * fade, pointerEvents: "none" }}>
      {/* halo crème sous la base (l'ancre au sol) */}
      <div style={{ position: "absolute", left: "50%", top: "72%", width: size * 0.7, height: size * 0.28,
        transform: "translate(-50%,-50%)",
        background: "radial-gradient(circle, rgba(40,27,8,0.34) 30%, rgba(40,27,8,0) 72%)" }} />
      {/* sprite iso : ratio natif 1408:768 respecté, alpha natif (PAS de multiply → sinon assombri) */}
      <img src={staticFile(`_shared/sprites/warmap/${sprite}.png`)}
        style={{ position: "relative", width: size, height: size * (768 / 1408), objectFit: "contain",
          display: "block" }} />
      {label && (
        <div style={{ position: "absolute", left: "50%", top: `${size * 0.42}px`, transform: "translate(-50%,0)",
          whiteSpace: "nowrap", fontFamily: "Georgia, serif", fontSize: 13, fontWeight: 700,
          color: "#F5E6CE", background: "rgba(42,18,14,0.9)", padding: "1px 8px", borderRadius: 3,
          letterSpacing: 0.5 }}>{label}</div>
      )}
    </div>
  );
};

/** Jeton-visage (repris AES) : cercle parchemin + bordure faction + portrait clippé. D=58px fixe. */
export const SoudanToken: React.FC<{
  pos: Pt; faction: Faction; frame: number; appear: number; label?: string;
}> = ({ pos, faction, frame, appear, label }) => {
  if (frame < appear) return null;
  const D = 58;
  const border = FACTION_BORDER[faction];
  const sprite = FACTION_SPRITE[faction];
  const ap = interpolate(frame, [appear, appear + 12, appear + 22], [0, 1.12, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const fadeIn = interpolate(frame, [appear, appear + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const breathe = 1 + 0.05 * Math.sin((frame + appear * 7) * 0.08);
  return (
    <div style={{ position: "absolute", left: pos.x, top: pos.y,
        transform: `translate(-50%, -50%) scale(${ap * breathe})`, opacity: fadeIn, pointerEvents: "none" }}>
      {/* ombre portée : le jeton flotte au-dessus du parchemin */}
      <div style={{ position: "absolute", left: "50%", top: "70%", width: D * 0.82, height: D * 0.26,
        transform: "translate(-50%,-50%)", background: "rgba(40,27,8,0.42)", borderRadius: "50%", filter: "blur(6px)" }} />
      <div style={{ width: D, height: D, borderRadius: "50%", overflow: "hidden",
        background: CREAM, border: `3.5px solid ${border}`,
        boxShadow: "0 4px 10px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.3)" }}>
        <img src={staticFile(`_shared/sprites/warmap/${sprite}.png`)}
          style={{ width: "118%", height: "118%", objectFit: "cover", objectPosition: "top center",
            transform: "translate(-8%, 2%)", display: "block" }} />
      </div>
      {label && (
        <div style={{ position: "absolute", left: "50%", top: `${D + 4}px`, transform: "translate(-50%,0)",
          whiteSpace: "nowrap", fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 700,
          color: "#F5E6CE", background: "rgba(42,18,14,0.92)", padding: "2px 10px", borderRadius: 3,
          letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
      )}
    </div>
  );
};
