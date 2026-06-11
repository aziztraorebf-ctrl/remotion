// PARTIE 2 — LE BLOCAGE (intervention FR/ONU massive, et pourtant le territoire perdu grandit).
//
// REFONTE PREMIUM (2026-06-11) sur le modèle VALIDÉ du beat 2.4 (Proto24Extinction). + corrections retour Aziz :
//   R-OBJ-1 : sprites dimensionnés en unités-CARTE (spriteMapWidth) → ne grossissent plus au dézoom.
//   R-OBJ-2 : plus de dots/points SVG — TOUT marqueur = sprite Gemini (bases FR, MINUSMA, villes tenues).
//   R-OBJ-3 : zones d'emprise TRANSITOIRES (apparaît au beat, s'estompe au suivant, jamais cumulatif).
//   + présence 2.2 = pulse visible + flèche tactique courbe (le point/trait nu était illisible).
//   + zones qui PROGRESSENT avec intention (le rouge avance), pas un état figé.
//
// Couche PURE par-dessus la carte (pattern <PartieX>). Reçoit SahelRenderContext. Ne possède PAS la map.
//
// Beats (triggers V5 alignment, ×30fps) :
//   2.1 Serval/Barkhane  f3196/f3268  bases FR sprites (Gao/Ménaka/Tessalit) + "2013"
//   2.2 présence FR      f3419/f3443  pulse origines régionales + flèches courbes vers le Mali, SOBRE
//   2.3 MINUSMA          f3660        sprites avant-postes ONU (Kidal/Tombouctou/Mopti)
//   2.4 échec 10 ans     f3887        ZONE rouge transitoire + bases s'effacent + fumée (modèle validé)
//   2.5 villes/campagnes f4384/f4421  sprites villes tenues ; zone rurale rouge (remplace 2.4)
//   2.6 Burkina déborde  f4955/f4976  zone rouge franchit Mali→Burkina (remplace 2.5), "2015"
//   (fin) Niger/CEDEAO   f5380/f5639  Niamey bascule (flash) + anneau CEDEAO (pont Partie 3)

import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useVideoConfig, Easing } from "remotion";
import type { SahelRenderContext } from "../engine/SahelContext";
import {
  PAL, buildStaticZone, smoothClosedPath, smokePingPong, spriteMapWidth, type Pt, type Zone,
} from "./warmapPremiumKit";

// ============================================================
// TRIGGERS V5 (alignment, ×30fps)
// ============================================================
const F_SERVAL = 3196;
const F_BARKHANE = 3268;
const F_PRESENTE = 3419;
const F_AUTOUR = 3443;
const F_MINUSMA = 3660;
const F_ECHEC = 3887;     // "dix ans plus tard"
const F_VILLES = 4384;
const F_CAMPAGNES = 4421;
const F_DEBORDENT = 4955;
const F_BURKINA = 4976;
const F_NIGER = 5380;
const F_CEDEAO = 5639;

// ============================================================
// GÉOGRAPHIE
// ============================================================
type Marker = { id: string; name: string; coord: [number, number]; appearAt: number; extinctAt?: number };
// Bases FR : apparaissent au 2.1, s'éteignent au 2.4 (staggered). Sprite base-fr-td.
const FR_BASES: Marker[] = [
  { id: "gao", name: "GAO", coord: [-0.04, 16.27], appearAt: F_SERVAL + 12, extinctAt: F_ECHEC + 100 },
  { id: "menaka", name: "MÉNAKA", coord: [2.40, 15.92], appearAt: F_SERVAL + 30, extinctAt: F_ECHEC + 175 },
  { id: "tessalit", name: "TESSALIT", coord: [1.01, 20.20], appearAt: F_BARKHANE + 12, extinctAt: F_ECHEC + 240 },
];
// Avant-postes MINUSMA (ONU). Sprite base-minusma-td. Présents 2.3→fin 2.4, puis s'effacent (partent en P3).
const MINUSMA: Marker[] = [
  { id: "kidal", name: "KIDAL", coord: [1.44, 18.43], appearAt: F_MINUSMA, extinctAt: F_VILLES + 60 },
  { id: "tombouctou", name: "TOMBOUCTOU", coord: [-3.01, 16.79], appearAt: F_MINUSMA + 14, extinctAt: F_VILLES + 60 },
  { id: "mopti", name: "MOPTI", coord: [-4.20, 14.49], appearAt: F_MINUSMA + 28, extinctAt: F_VILLES + 60 },
];
// Villes tenues (2.5) : les armées tiennent les villes, pas les campagnes. Sprite ville-tenue-td.
const HELD_CITIES: Marker[] = [
  { id: "ville-gao", name: "GAO", coord: [-0.04, 16.27], appearAt: F_VILLES },
  { id: "ville-mopti", name: "MOPTI", coord: [-4.20, 14.49], appearAt: F_VILLES + 12 },
  { id: "ville-douentza", name: "DOUENTZA", coord: [-2.95, 15.00], appearAt: F_VILLES + 24 },
];

// Présence FR pré-positionnée (2.2) — origines régionales AUTOUR du Mali (pulse + flèche courbe vers Mali).
type Force = { id: string; coord: [number, number]; delay: number };
const FORCES: Force[] = [
  { id: "epervier", coord: [15.05, 12.10], delay: 0 },   // Tchad (E)
  { id: "licorne", coord: [-5.55, 7.54], delay: 14 },     // Côte d'Ivoire (S)
  { id: "sabre", coord: [2.12, 13.51], delay: 28 },       // Niger/Niamey (E)
];
const MALI_CENTER: [number, number] = [-1.5, 16.5];

// Capitales / anneau (fin).
const NIAMEY: [number, number] = [2.12, 13.51];
const CEDEAO_RING: [number, number][] = [
  [-4.00, 9.50], [-1.20, 7.95], [2.30, 9.30], [8.10, 9.10],  // CI, Ghana, Bénin, Nigeria
];

// ZONES TRANSITOIRES (R-OBJ-3 : 1 active à la fois, fade-out au beat suivant).
const ZONE_ECHEC: Zone = { center: [0.9, 16.9], rLon: 4.2, rLat: 4.2, startF: F_ECHEC, endF: F_VILLES };
const ZONE_RURAL: Zone = { center: [-1.2, 15.6], rLon: 5.0, rLat: 3.4, startF: F_VILLES, endF: F_DEBORDENT };
const ZONE_BURKINA: Zone = { center: [-0.6, 13.4], rLon: 3.2, rLat: 2.4, startF: F_DEBORDENT, endF: 99999 };

const BASE_RATIO = 0.56;       // h/w sprite base-fr-td (paysage large)
const MINUSMA_RATIO = 0.55;    // h/w sprite base-minusma-td
const VILLE_RATIO = 0.55;      // h/w sprite ville-tenue-td

// Largeur des marqueurs en DEGRÉS de longitude (ancrage carte — ne grossit pas au dézoom).
const BASE_DEG = 2.4;          // fortin FR
const MINUSMA_DEG = 1.7;       // avant-poste ONU (un peu plus petit)
const VILLE_DEG = 2.0;         // ville tenue
const SPRITE_BOUNDS = { min: 60, max: 460 }; // bornes px sécurité aux zooms extrêmes

type Props = { ctx: SahelRenderContext | null };

export const Partie2Blocage: React.FC<Props> = ({ ctx }) => {
  const { fps } = useVideoConfig();
  if (!ctx) return null;
  const { frame, width, height, project } = ctx;
  const vmin = Math.min(width, height);

  // ── Helper zone transitoire projetée ──
  const zonePath = (z: Zone): { d: string; op: number } | null => {
    if (frame < z.startF) return null;
    const ring = buildStaticZone({ frame, startF: z.startF, center: z.center, rLon: z.rLon, rLat: z.rLat });
    const px: Pt[] = ring.map(([lon, lat]) => project(lon, lat));
    const d = smoothClosedPath(px);
    const op = interpolate(frame, [z.startF, z.startF + 22, z.endF - 40, z.endF], [0, 1, 1, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    if (op <= 0.01) return null;
    return { d, op };
  };
  const zones = [zonePath(ZONE_ECHEC), zonePath(ZONE_RURAL), zonePath(ZONE_BURKINA)];

  // ── Helper : un marqueur-sprite ancré carte, apparition spring, extinction (effacement total) ──
  type SpriteSpec = { m: Marker; src: string; deg: number; ratio: number };
  const renderSprite = ({ m, src, deg, ratio }: SpriteSpec) => {
    if (frame < m.appearAt) return null;
    const p = project(m.coord[0], m.coord[1]);
    const ap = spring({ frame: frame - m.appearAt, fps, config: { damping: 14 }, durationInFrames: 18 });
    if (ap <= 0.02) return null;
    const rel = m.extinctAt != null ? frame - m.extinctAt : -1;
    const deadT = m.extinctAt != null
      ? interpolate(rel, [0, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) })
      : 0;
    const op = ap * (1 - deadT);
    if (op <= 0.02) return null;
    // R-OBJ-1 : largeur ancrée à la carte (px par degré × deg), bornée. Ne grossit pas au dézoom.
    const w = spriteMapWidth(project, m.coord[0], m.coord[1], deg, SPRITE_BOUNDS) * ap * (1 - deadT * 0.14);
    const h = w * ratio;
    const grayscale = deadT;
    const brightness = 1 - deadT * 0.22;
    const shadowA = 0.3 * (1 - deadT);
    return (
      <img key={m.id} src={src}
        style={{
          position: "absolute", left: p.x - w / 2, top: p.y - h * 0.62, width: w, height: h,
          opacity: op,
          filter: `grayscale(${grayscale}) brightness(${brightness}) drop-shadow(0 ${2 * (1 - deadT) + 1}px ${6 * (1 - deadT) + 2}px rgba(80,30,20,${shadowA}))`,
          pointerEvents: "none",
        }} />
    );
  };

  const baseSprite = staticFile("_shared/sprites/warmap/base-fr-td.png");
  const minusmaSprite = staticFile("_shared/sprites/warmap/base-minusma-td.png");
  const villeSprite = staticFile("_shared/sprites/warmap/ville-tenue-td.png");

  const niameyFall = interpolate(frame, [F_NIGER, F_NIGER + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cedeaoT = interpolate(frame, [F_CEDEAO, F_CEDEAO + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pNiamey = project(NIAMEY[0], NIAMEY[1]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="p2-zone" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={PAL.RED_DEEP} stopOpacity={0.15} />
            <stop offset="72%" stopColor={PAL.RED_INK} stopOpacity={0.30} />
            <stop offset="100%" stopColor={PAL.RED_INK} stopOpacity={0.48} />
          </radialGradient>
          <pattern id="p2-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="7" stroke={PAL.RED_INK} strokeWidth="1.4" strokeOpacity="0.4" />
          </pattern>
          <marker id="p2-arrowhead" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill={PAL.INK} fillOpacity={0.7} />
          </marker>
        </defs>

        {/* ============ ZONES TRANSITOIRES (sous les marqueurs) ============ */}
        {zones.map((z, i) =>
          z && z.d ? (
            <g key={`zone-${i}`} opacity={z.op}>
              <path d={z.d} fill="url(#p2-zone)" />
              <path d={z.d} fill="url(#p2-hatch)" opacity={0.45} />
              <path d={z.d} fill="none" stroke={PAL.RED_INK} strokeWidth={2} strokeOpacity={0.55} />
            </g>
          ) : null
        )}

        {/* ============ 2.2 — PRÉSENCE FR : pulse origine + FLÈCHE COURBE vers le Mali ============
            Le point/trait nu était illisible (retour Aziz). Pulse net sur l'origine + flèche tactique
            courbe (arc bezier) qui se dessine vers le Mali. Sobre, voix minimale. */}
        {frame >= F_PRESENTE && FORCES.map((f, i) => {
          const p0 = project(f.coord[0], f.coord[1]);
          const pc = project(MALI_CENTER[0], MALI_CENTER[1]);
          const start = F_PRESENTE + f.delay;
          const t = interpolate(frame, [start, start + 44], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
          });
          const fade = interpolate(frame, [F_PRESENTE, F_PRESENTE + 20, F_MINUSMA - 20, F_MINUSMA + 30], [0, 1, 1, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          if (t <= 0 || fade <= 0) return null;
          // arc bezier : point de contrôle décalé perpendiculairement (flèche courbe, pas droite)
          const mx = (p0.x + pc.x) / 2, my = (p0.y + pc.y) / 2;
          const dx = pc.x - p0.x, dy = pc.y - p0.y;
          const len = Math.hypot(dx, dy) || 1;
          const nx = -dy / len, ny = dx / len; // normale
          const bow = 0.18 * len;
          const cx = mx + nx * bow, cy = my + ny * bow;
          // point d'avancée le long de l'arc (quadratique) à t
          const ax = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * cx + t * t * pc.x;
          const ay = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * cy + t * t * pc.y;
          // path partiel : on dessine de l'origine jusqu'au point d'avancée (sous-bezier approx par segments)
          const SEG = 16;
          let dPath = `M${p0.x.toFixed(1)},${p0.y.toFixed(1)}`;
          for (let s = 1; s <= SEG; s++) {
            const u = (s / SEG) * t;
            const ux = (1 - u) * (1 - u) * p0.x + 2 * (1 - u) * u * cx + u * u * pc.x;
            const uy = (1 - u) * (1 - u) * p0.y + 2 * (1 - u) * u * cy + u * u * pc.y;
            dPath += `L${ux.toFixed(1)},${uy.toFixed(1)}`;
          }
          // pulse origine
          const pulseR = 0.018 * vmin * (1 + 0.5 * (Math.sin((frame - start) * 0.18) * 0.5 + 0.5));
          const pulseOp = (0.6 + 0.4 * Math.sin((frame - start) * 0.18)) * fade;
          const showHead = t > 0.05 && t < 0.99;
          return (
            <g key={`force-${i}`} opacity={fade}>
              {/* flèche courbe qui se dessine */}
              <path d={dPath} fill="none" stroke={PAL.INK} strokeWidth={2.4} strokeOpacity={0.6}
                strokeLinecap="round" markerEnd={t > 0.9 ? "url(#p2-arrowhead)" : undefined}
                style={{ mixBlendMode: "multiply" }} />
              {/* pulse net sur l'origine (présence pré-positionnée, BIEN visible) */}
              <circle cx={p0.x} cy={p0.y} r={pulseR} fill="none" stroke={PAL.STEEL} strokeWidth={2.2} strokeOpacity={pulseOp} />
              <circle cx={p0.x} cy={p0.y} r={0.008 * vmin} fill={PAL.STEEL} fillOpacity={0.95 * fade} />
              {/* tête d'avancée */}
              {showHead && <circle cx={ax} cy={ay} r={3} fill={PAL.INK} fillOpacity={0.6 * fade} />}
            </g>
          );
        })}

        {/* ============ HALOS D'ANCRAGE acier au sol sous les bases FR (s'éteignent à la mort) ============ */}
        {FR_BASES.map((b) => {
          const p = project(b.coord[0], b.coord[1]);
          const ap = spring({ frame: frame - b.appearAt, fps, config: { damping: 14 }, durationInFrames: 18 });
          if (ap <= 0.02 || b.extinctAt == null) return null;
          const halo = ap * interpolate(frame - b.extinctAt, [0, 40], [1, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
          });
          if (halo <= 0.02) return null;
          const rHalo = spriteMapWidth(project, b.coord[0], b.coord[1], 1.4, { min: 30, max: 160 });
          const pulse = 1 + 0.06 * Math.sin((frame - b.appearAt) * 0.12);
          return (
            <g key={`halo-${b.id}`} transform={`translate(${p.x},${p.y})`}>
              <ellipse rx={rHalo * pulse} ry={rHalo * 0.5 * pulse}
                fill="none" stroke={PAL.STEEL} strokeWidth={1.8} strokeOpacity={0.42 * halo} />
            </g>
          );
        })}

        {/* ============ FIN — NIAMEY BASCULE (flash net) + ANNEAU CEDEAO ============ */}
        {niameyFall > 0 && (
          <g transform={`translate(${pNiamey.x},${pNiamey.y})`}>
            <circle r={0.05 * vmin * interpolate(niameyFall, [0, 0.4], [0.2, 1], { extrapolateRight: "clamp" })}
              fill="none" stroke="#E8DCC0" strokeWidth={2.4}
              strokeOpacity={interpolate(niameyFall, [0, 0.3, 1], [0, 0.8, 0], { extrapolateRight: "clamp" })} />
            <circle r={0.014 * vmin} fill="#E8DCC0" fillOpacity={0.95 * niameyFall} />
          </g>
        )}
        {cedeaoT > 0 && CEDEAO_RING.map((c, i) => {
          const p = project(c[0], c[1]);
          const ap = interpolate(frame, [F_CEDEAO + i * 6, F_CEDEAO + i * 6 + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          if (ap <= 0) return null;
          const r = 0.012 * vmin;
          return (
            <g key={`cedeao-${i}`} transform={`translate(${p.x},${p.y})`} opacity={ap}>
              <circle r={r} fill={PAL.CEDEAO} fillOpacity={0.85} />
              <line x1={0} y1={0} x2={(pNiamey.x - p.x) * 0.4} y2={(pNiamey.y - p.y) * 0.4}
                stroke={PAL.CEDEAO} strokeWidth={2} strokeOpacity={0.6} strokeDasharray="4 4" />
            </g>
          );
        })}
      </svg>

      {/* ============ SPRITES (hors SVG pour les filtres CSS) — ancrés carte, ordre z par latitude ============ */}
      {MINUSMA.map((m) => renderSprite({ m, src: minusmaSprite, deg: MINUSMA_DEG, ratio: MINUSMA_RATIO }))}
      {HELD_CITIES.map((m) => renderSprite({ m, src: villeSprite, deg: VILLE_DEG, ratio: VILLE_RATIO }))}
      {FR_BASES.map((m) => renderSprite({ m, src: baseSprite, deg: BASE_DEG, ratio: BASE_RATIO }))}

      {/* ============ FUMÉE (ambiant ping-pong) — chaque base éteinte fume puis SE DISPERSE ============ */}
      {FR_BASES.map((b) => {
        if (b.extinctAt == null) return null;
        const sm = smokePingPong({ frame, startF: b.extinctAt, fps });
        if (!sm) return null;
        const rel = frame - b.extinctAt;
        const disperse = interpolate(rel, [fps * 9, fps * 15], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const op = sm.op * disperse;
        if (op <= 0.02) return null;
        const p = project(b.coord[0], b.coord[1]);
        const sw = spriteMapWidth(project, b.coord[0], b.coord[1], 1.7, { min: 50, max: 320 });
        return (
          <img key={`smoke-${b.id}`} src={staticFile(`_shared/sprites/warmap/fx-smoke/${sm.idx}.png`)}
            style={{
              position: "absolute", left: p.x - sw / 2, top: p.y - sw * 0.82, width: sw, height: sw,
              opacity: op, imageRendering: "pixelated", pointerEvents: "none",
            }} />
        );
      })}
    </AbsoluteFill>
  );
};

export default Partie2Blocage;
