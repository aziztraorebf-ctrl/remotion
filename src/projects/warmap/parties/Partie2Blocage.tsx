// PARTIE 2 — LE BLOCAGE — VERSION NARRATIVE (grammaire causale, 2026-06-11).
//
// REFONTE depuis l'AUDIO (plan PLAN-NARRATIF-P2.md + DA-brief Gemini/Kimi). La v3 montrait des RÉSULTATS
// (taches qui poppent, bases qui brûlent sans attaquant) = incompréhensible œil neuf. Ici : ACTION CAUSALE.
//
// GRAMMAIRE (la cause précède l'effet) :
//   - Les JETONS jihadistes (JNIM chèche clair / EIGS cagoule sombre) AVANCENT (waypoints frame-driven).
//   - Leur SILLAGE révèle progressivement le territoire rouge (mask animé, "wet ink", pas un pop).
//   - Quand des jetons encerclent une base FR : 3 TEMPS = approche → pulse d'alerte → chute (explosion+fumée).
//   - Une FRISE 2013→2022 dicte le rythme (lent puis accélère = l'enlisement des "dix ans").
//   - Niger = junte INSTITUTIONNELLE (kaki/gris, PAS rouge jihadiste) — casser la grammaire (DA-brief).
//   - Combine l'ARSENAL : jetons + zones + sprites Gemini + fumée PixelLab + frise + data-viz 40%.
//
// Couche PURE par-dessus la carte (pattern <PartieX>). Reçoit SahelRenderContext. Ne possède PAS la map.
//
// Triggers V5 (alignment, ×30fps) :
//   2.1 Serval/Barkhane f3196/f3268 · 2.2 présence f3419 · 2.3 MINUSMA f3660 · 2.4 échec f3887
//   2.5 villes/campagnes f4384 · 2.6 Burkina f4955 · Niger f5380 · CEDEAO f5639

import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useVideoConfig, Easing } from "remotion";
import type { SahelRenderContext } from "../engine/SahelContext";
import {
  PAL, spriteMapWidth, smokePingPong, interpWaypoints, type Waypoint,
} from "./warmapPremiumKit";

// ============================================================
// TRIGGERS V5
// ============================================================
const F_SERVAL = 3196;
const F_BARKHANE = 3268;
const F_PRESENTE = 3419;
const F_MINUSMA = 3660;
const F_ECHEC = 3887;     // "dix ans plus tard" — début de l'avancée jihadiste
const F_VILLES = 4384;
const F_CAMPAGNES = 4421;
const F_DEBORDENT = 4955;
const F_BURKINA = 4976;
const F_NIGER = 5380;
const F_CEDEAO = 5639;

// ============================================================
// LIEUX (sprites Gemini ancrés carte)
// ============================================================
type Base = { id: string; name: string; coord: [number, number]; appearAt: number; fallAt: number };
const FR_BASES: Base[] = [
  { id: "gao", name: "GAO", coord: [-0.04, 16.27], appearAt: F_SERVAL + 12, fallAt: F_ECHEC + 150 },
  { id: "menaka", name: "MÉNAKA", coord: [2.40, 15.92], appearAt: F_SERVAL + 30, fallAt: F_ECHEC + 230 },
  { id: "tessalit", name: "TESSALIT", coord: [1.01, 20.20], appearAt: F_BARKHANE + 12, fallAt: F_ECHEC + 310 },
];
const MINUSMA: Base[] = [
  { id: "kidal", name: "KIDAL", coord: [1.44, 18.43], appearAt: F_MINUSMA, fallAt: F_VILLES + 40 },
  { id: "tombouctou", name: "TOMBOUCTOU", coord: [-3.01, 16.79], appearAt: F_MINUSMA + 14, fallAt: F_VILLES + 40 },
  { id: "mopti", name: "MOPTI", coord: [-4.20, 14.49], appearAt: F_MINUSMA + 28, fallAt: F_VILLES + 40 },
];
const HELD_CITIES: { id: string; coord: [number, number]; appearAt: number }[] = [
  { id: "ville-gao", coord: [-0.04, 16.27], appearAt: F_VILLES },
  { id: "ville-mopti", coord: [-4.20, 14.49], appearAt: F_VILLES + 12 },
  { id: "ville-douentza", coord: [-2.95, 15.00], appearAt: F_VILLES + 24 },
];

// ============================================================
// JETONS JIHADISTES (acteurs) — waypoints frame-driven. 4-6 max (Aziz).
// Ils AVANCENT vers les bases au 2.4, FRANCHISSENT la frontière Burkina au 2.6. Leur passage = le sillage.
// faction : jnim (chèche clair) / eigs (cagoule sombre). sprite fighter-*.
// ============================================================
type Jeton = { id: string; faction: "jnim" | "eigs"; appear: number; disappear: number; wp: Waypoint[] };
const JETONS: Jeton[] = [
  // EIGS depuis l'est (Ménaka/Liptako) → encercle Ménaka puis pousse vers Gao
  { id: "e1", faction: "eigs", appear: F_ECHEC, disappear: F_DEBORDENT + 400, wp: [
    { f: F_ECHEC, lon: 3.6, lat: 15.6 }, { f: F_ECHEC + 120, lon: 2.7, lat: 15.85 },
    { f: F_ECHEC + 220, lon: 2.45, lat: 15.95 }, // contact Ménaka (fallAt+...)
    { f: F_ECHEC + 360, lon: 1.2, lat: 16.1 }, { f: F_VILLES + 200, lon: 0.2, lat: 16.2 },
  ] },
  // JNIM depuis le sud-ouest (centre Mali) → remonte vers Gao
  { id: "j1", faction: "jnim", appear: F_ECHEC, disappear: F_DEBORDENT + 400, wp: [
    { f: F_ECHEC, lon: -1.8, lat: 15.2 }, { f: F_ECHEC + 110, lon: -0.9, lat: 15.8 },
    { f: F_ECHEC + 160, lon: -0.1, lat: 16.15 }, // contact Gao
    { f: F_ECHEC + 320, lon: -0.6, lat: 15.9 }, { f: F_VILLES + 200, lon: -1.5, lat: 15.3 },
  ] },
  // JNIM #2 : remonte vers Tessalit (nord)
  { id: "j2", faction: "jnim", appear: F_ECHEC + 80, disappear: F_DEBORDENT + 400, wp: [
    { f: F_ECHEC + 80, lon: 1.6, lat: 17.5 }, { f: F_ECHEC + 240, lon: 1.2, lat: 19.2 },
    { f: F_ECHEC + 300, lon: 1.05, lat: 20.0 }, // contact Tessalit
    { f: F_VILLES + 200, lon: 0.6, lat: 18.5 },
  ] },
  // EIGS #2 : patrouille le rural centre (2.5) puis FRANCHIT vers le Burkina (2.6)
  { id: "e2", faction: "eigs", appear: F_VILLES, disappear: F_NIGER + 100, wp: [
    { f: F_VILLES, lon: -1.5, lat: 15.0 }, { f: F_DEBORDENT - 60, lon: -1.2, lat: 14.2 },
    { f: F_DEBORDENT + 40, lon: -1.0, lat: 13.6 }, // franchit la frontière Mali→Burkina
    { f: F_DEBORDENT + 220, lon: -0.6, lat: 13.2 }, { f: F_NIGER, lon: -0.2, lat: 12.9 },
  ] },
  // JNIM #3 : second franchissement Burkina (ouest)
  { id: "j3", faction: "jnim", appear: F_VILLES + 40, disappear: F_NIGER + 100, wp: [
    { f: F_VILLES + 40, lon: -2.6, lat: 14.6 }, { f: F_DEBORDENT, lon: -2.2, lat: 13.8 },
    { f: F_DEBORDENT + 120, lon: -1.8, lat: 13.4 }, { f: F_NIGER, lon: -1.4, lat: 13.1 },
  ] },
];

// ============================================================
// JUNTE NIGER (institutionnel — casser la grammaire, DA-brief). Sprite jeton militaire, couleur KAKI.
// ============================================================
const NIAMEY: [number, number] = [2.12, 13.51];
const KAKI = "#7C6A3E";     // kaki/gris-fer (junte) — distinct du rouge jihadiste
const CEDEAO_RING: [number, number][] = [
  [-4.00, 9.50], [-1.20, 7.95], [2.30, 9.30], [8.10, 9.10],  // CI, Ghana, Bénin, Nigeria
];

// FRISE temporelle : étapes affichées. La barre se remplit de F_ECHEC à ~F_DEBORDENT (les "dix ans").
const FRISE_START = F_ECHEC;
const FRISE_END = F_DEBORDENT;        // 2013→2022 couvert sur cette plage
const FRISE_YEARS = [2013, 2015, 2018, 2020, 2022];

const BASE_DEG = 3.0, MINUSMA_DEG = 2.4, VILLE_DEG = 2.6;
const SPRITE_BOUNDS = { min: 120, max: 320 };
const BASE_RATIO = 0.56, MINUSMA_RATIO = 0.55, VILLE_RATIO = 0.55;
const JETON_DEG = 1.4;                          // acteurs plus présents (ce sont eux le sujet du 2.4)
const JETON_BOUNDS = { min: 64, max: 150 };

type Props = { ctx: SahelRenderContext | null };

export const Partie2Blocage: React.FC<Props> = ({ ctx }) => {
  const { fps } = useVideoConfig();
  if (!ctx) return null;
  const { frame, width, height, project } = ctx;
  const vmin = Math.min(width, height);

  const baseSprite = staticFile("_shared/sprites/warmap/base-fr-td.png");
  const minusmaSprite = staticFile("_shared/sprites/warmap/base-minusma-td.png");
  const villeSprite = staticFile("_shared/sprites/warmap/ville-tenue-td.png");

  // ── Positions courantes des jetons actifs (pour le sillage + le rendu) ──
  const activeJetons = JETONS.filter((j) => frame >= j.appear && frame <= j.disappear)
    .map((j) => {
      const [lon, lat] = interpWaypoints(j.wp, frame);
      const p = project(lon, lat);
      return { j, lon, lat, p };
    });

  // ── SILLAGE : le territoire rouge se révèle là où les jetons SONT PASSÉS (mask de cercles aux positions
  //    passées, échantillonnées). "Wet ink" : chaque empreinte grandit légèrement avec le temps. ──
  // On échantillonne la trajectoire de chaque jeton de son apparition jusqu'à la frame courante.
  const sillageStamps: { x: number; y: number; r: number }[] = [];
  for (const j of JETONS) {
    if (frame < j.appear) continue;
    const until = Math.min(frame, j.disappear);
    for (let f = j.appear; f <= until; f += 12) { // échantillon tous les 12 frames
      const [lon, lat] = interpWaypoints(j.wp, f);
      const pt = project(lon, lat);
      const age = frame - f;
      const r = spriteMapWidth(project, lon, lat, 1.6, { min: 28, max: 90 })
        * interpolate(age, [0, 45], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      sillageStamps.push({ x: pt.x, y: pt.y, r });
    }
  }

  // ── Détection encerclement → chute de base en 3 temps ──
  // Une base "chute" à fallAt (calé sur l'arrivée des jetons). 3 temps : alerte (avant) → chute → ruine+fumée.
  const baseState = (b: Base) => {
    const relFall = frame - b.fallAt;
    const alert = interpolate(frame, [b.fallAt - 40, b.fallAt], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const dead = interpolate(relFall, [0, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
    return { alert, dead, relFall };
  };

  // ── Frise métronome ──
  const friseT = interpolate(frame, [FRISE_START, FRISE_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const showFrise = frame >= FRISE_START - 20 && frame <= F_DEBORDENT + 80;

  // ── Data-viz 40% Burkina ──
  const pct40 = Math.round(interpolate(frame, [F_BURKINA, F_BURKINA + 70], [0, 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const show40 = frame >= F_BURKINA && frame <= F_NIGER + 30;

  // ── Niger junte + CEDEAO ──
  const niamey = project(NIAMEY[0], NIAMEY[1]);
  const juntT = interpolate(frame, [F_NIGER, F_NIGER + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cedeaoT = interpolate(frame, [F_CEDEAO, F_CEDEAO + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Hiérarchie du regard : assombrir légèrement pendant l'avancée (2.4) ──
  const dim = interpolate(frame, [F_ECHEC - 10, F_ECHEC + 30, F_DEBORDENT, F_DEBORDENT + 60], [0, 0.18, 0.18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── helper rendu sprite-lieu ancré carte ──
  const renderBase = (b: Base, src: string, deg: number, ratio: number) => {
    if (frame < b.appearAt) return null;
    const p = project(b.coord[0], b.coord[1]);
    const ap = spring({ frame: frame - b.appearAt, fps, config: { damping: 14 }, durationInFrames: 18 });
    if (ap <= 0.02) return null;
    const { dead } = baseState(b);
    const op = ap * (1 - dead);
    if (op <= 0.02) return null;
    const w = spriteMapWidth(project, b.coord[0], b.coord[1], deg, SPRITE_BOUNDS) * ap * (1 - dead * 0.14);
    const h = w * ratio;
    return (
      <img key={b.id} src={src}
        style={{
          position: "absolute", left: p.x - w / 2, top: p.y - h * 0.62, width: w, height: h, opacity: op,
          filter: `grayscale(${dead}) brightness(${1 - dead * 0.22}) drop-shadow(0 ${2 * (1 - dead) + 1}px ${6 * (1 - dead) + 2}px rgba(80,30,20,${0.3 * (1 - dead)}))`,
          pointerEvents: "none",
        }} />
    );
  };

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="p2-red" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={PAL.RED_INK} stopOpacity={0.55} />
            <stop offset="100%" stopColor={PAL.RED_DEEP} stopOpacity={0.4} />
          </radialGradient>
          {/* mask sillage : le territoire rouge n'apparaît QUE là où les jetons sont passés.
              feGaussianBlur fond les empreintes circulaires en une NAPPE continue (pas des ronds visibles). */}
          <filter id="p2-sillage-blur"><feGaussianBlur stdDeviation="16" /></filter>
          <mask id="p2-sillage">
            <g filter="url(#p2-sillage-blur)">
              {sillageStamps.map((s, i) => (
                <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" />
              ))}
            </g>
          </mask>
        </defs>

        {/* hiérarchie du regard : léger voile sombre pendant l'avancée */}
        {dim > 0 && <rect x={0} y={0} width={width} height={height} fill="#1a1206" opacity={dim} />}

        {/* TERRITOIRE ROUGE = sillage des jetons (multiply, révélé par le mask, jamais un pop) */}
        {sillageStamps.length > 0 && (
          <g style={{ mixBlendMode: "multiply" }} mask="url(#p2-sillage)">
            <rect x={0} y={0} width={width} height={height} fill="url(#p2-red)" opacity={0.5} />
          </g>
        )}

        {/* HALOS d'alerte sous les bases (3 temps : pulse rouge qui bat avant la chute) */}
        {FR_BASES.map((b) => {
          if (frame < b.appearAt) return null;
          const { alert, dead } = baseState(b);
          if (alert <= 0.02 || dead >= 0.98) return null;
          const p = project(b.coord[0], b.coord[1]);
          const beat = 0.5 + 0.5 * Math.sin((frame - b.fallAt) * 0.4);
          const r = spriteMapWidth(project, b.coord[0], b.coord[1], 1.5, { min: 34, max: 150 });
          return (
            <g key={`alert-${b.id}`} transform={`translate(${p.x},${p.y})`} opacity={alert * (1 - dead)}>
              <circle r={r * (1 + 0.18 * beat)} fill="none" stroke={PAL.RED_INK} strokeWidth={2.4} strokeOpacity={0.5 + 0.4 * beat} />
            </g>
          );
        })}

        {/* NIGER — junte INSTITUTIONNELLE : onde géométrique KAKI (pas rouge), recolore le pays d'un coup */}
        {juntT > 0 && (
          <g transform={`translate(${niamey.x},${niamey.y})`}>
            <circle r={0.06 * vmin * interpolate(juntT, [0, 0.5], [0.2, 1], { extrapolateRight: "clamp" })}
              fill="none" stroke={KAKI} strokeWidth={3}
              strokeOpacity={interpolate(juntT, [0, 0.3, 1], [0, 0.9, 0.3], { extrapolateRight: "clamp" })} />
            <rect x={-0.018 * vmin} y={-0.018 * vmin} width={0.036 * vmin} height={0.036 * vmin}
              fill={KAKI} fillOpacity={0.9 * juntT} transform="rotate(45)" />
          </g>
        )}

        {/* CEDEAO — contour orange clignotant (menace EXTERNE, pas une tache) + flèches vers Niamey */}
        {cedeaoT > 0 && CEDEAO_RING.map((c, i) => {
          const p = project(c[0], c[1]);
          const ap = interpolate(frame, [F_CEDEAO + i * 6, F_CEDEAO + i * 6 + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          if (ap <= 0) return null;
          const blink = 0.6 + 0.4 * Math.sin(frame * 0.25 + i);
          const r = 0.012 * vmin;
          return (
            <g key={`cedeao-${i}`} transform={`translate(${p.x},${p.y})`} opacity={ap}>
              <circle r={r} fill="none" stroke={PAL.CEDEAO} strokeWidth={2.4} strokeOpacity={blink} />
              <line x1={0} y1={0} x2={(niamey.x - p.x) * 0.4} y2={(niamey.y - p.y) * 0.4}
                stroke={PAL.CEDEAO} strokeWidth={2} strokeOpacity={0.55 * blink} strokeDasharray="4 4" />
            </g>
          );
        })}
      </svg>

      {/* ============ SPRITES LIEUX (ancrés carte) ============ */}
      {MINUSMA.map((m) => renderBase(m, minusmaSprite, MINUSMA_DEG, MINUSMA_RATIO))}
      {HELD_CITIES.map((c) => {
        // villes tenues = bases sans chute (fallAt très loin)
        const b: Base = { id: c.id, name: "", coord: c.coord, appearAt: c.appearAt, fallAt: 999999 };
        return renderBase(b, villeSprite, VILLE_DEG, VILLE_RATIO);
      })}
      {FR_BASES.map((b) => renderBase(b, baseSprite, BASE_DEG, BASE_RATIO))}

      {/* ============ JETONS JIHADISTES (acteurs qui avancent) — VRAI JETON CIRCULAIRE (modèle Acte 1) :
           cercle parchemin + bordure faction (clair JNIM / sombre EIGS) + portrait clippé DANS le rond +
           ombre portée. PAS le portrait nu (= buste flottant, erreur). ============ */}
      {activeJetons.map(({ j, lon, lat, p }) => {
        const ap = spring({ frame: frame - j.appear, fps, config: { damping: 15 }, durationInFrames: 14 });
        const dis = interpolate(frame, [j.disappear - 30, j.disappear], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const op = ap * dis;
        if (op <= 0.02) return null;
        const D = spriteMapWidth(project, lon, lat, JETON_DEG, JETON_BOUNDS) * ap; // diamètre ancré carte
        const breathe = 1 + 0.05 * Math.sin((frame + j.id.charCodeAt(1) * 7) * 0.08);
        const border = j.faction === "jnim" ? "#C9A24B" : "#2E2A1E"; // bordure faction (or clair / sombre)
        const sprite = j.faction === "jnim" ? "fighter-jnim" : "fighter-eigs";
        return (
          <div key={j.id} style={{
            position: "absolute", left: p.x, top: p.y,
            transform: `translate(-50%,-50%) scale(${breathe})`, opacity: op, pointerEvents: "none",
          }}>
            {/* ombre portée (le jeton flotte au-dessus du parchemin) */}
            <div style={{ position: "absolute", left: "50%", top: "72%", width: D * 0.82, height: D * 0.26,
              transform: "translate(-50%,-50%)", background: "rgba(40,27,8,0.42)", borderRadius: "50%", filter: "blur(6px)" }} />
            {/* jeton : cercle parchemin + bordure faction + portrait clippé */}
            <div style={{ width: D, height: D, borderRadius: "50%", overflow: "hidden",
              background: "#F5EFD6", border: `${Math.max(2.5, D * 0.06)}px solid ${border}`,
              boxShadow: "0 4px 10px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.3)" }}>
              <img src={staticFile(`_shared/sprites/warmap/${sprite}.png`)}
                style={{ width: "118%", height: "118%", objectFit: "cover", objectPosition: "top center",
                  transform: "translate(-8%, 2%)", display: "block" }} />
            </div>
          </div>
        );
      })}

      {/* ============ FUMÉE (chute des bases — phase 3, après l'alerte) ============ */}
      {FR_BASES.map((b) => {
        const sm = smokePingPong({ frame, startF: b.fallAt, fps });
        if (!sm) return null;
        const rel = frame - b.fallAt;
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

      {/* ============ FRISE MÉTRONOME (2013→2022, bas écran, ancrée écran) ============ */}
      {showFrise && (() => {
        const fop = interpolate(frame, [FRISE_START - 20, FRISE_START, F_DEBORDENT + 30, F_DEBORDENT + 80], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const barX = width * 0.16, barW = width * 0.68, barY = height - 78;
        return (
          <div style={{ position: "absolute", inset: 0, opacity: fop, pointerEvents: "none" }}>
            <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
              <line x1={barX} y1={barY} x2={barX + barW} y2={barY} stroke={PAL.INK} strokeWidth={2} strokeOpacity={0.35} />
              <line x1={barX} y1={barY} x2={barX + barW * friseT} y2={barY} stroke={PAL.RED_INK} strokeWidth={3} strokeOpacity={0.8} />
              {FRISE_YEARS.map((yr, i) => {
                const yt = i / (FRISE_YEARS.length - 1);
                const lit = friseT >= yt - 0.02;
                const x = barX + barW * yt;
                return (
                  <g key={yr} opacity={lit ? 1 : 0.3}>
                    <circle cx={x} cy={barY} r={lit ? 5 : 3} fill={lit ? PAL.RED_INK : PAL.INK} />
                    <text x={x} y={barY + 24} fontSize={20} fill={PAL.INK} fontFamily="Georgia, serif" textAnchor="middle" opacity={0.85}>{yr}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        );
      })()}

      {/* ============ DATA-VIZ 40% Burkina (compteur + jauge ancrée écran) ============ */}
      {show40 && (() => {
        const op = interpolate(frame, [F_BURKINA, F_BURKINA + 20, F_NIGER, F_NIGER + 30], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const cx = width * 0.80, cy = height * 0.30, R = 56;
        const circ = 2 * Math.PI * R;
        return (
          <div style={{ position: "absolute", inset: 0, opacity: op, pointerEvents: "none" }}>
            <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
              <circle cx={cx} cy={cy} r={R} fill="none" stroke={PAL.INK} strokeWidth={8} strokeOpacity={0.2} />
              <circle cx={cx} cy={cy} r={R} fill="none" stroke={PAL.RED_INK} strokeWidth={8}
                strokeDasharray={`${circ * (pct40 / 100)} ${circ}`} strokeDashoffset={circ * 0.25} strokeLinecap="round"
                transform={`rotate(-90 ${cx} ${cy})`} />
              <text x={cx} y={cy + 8} fontSize={34} fill={PAL.RED_INK} fontFamily="Georgia, serif" fontWeight="bold" textAnchor="middle">{pct40}%</text>
              <text x={cx} y={cy + R + 26} fontSize={16} fill={PAL.INK} fontFamily="Georgia, serif" textAnchor="middle" opacity={0.8}>du Burkina · 2022</text>
            </svg>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

export default Partie2Blocage;
