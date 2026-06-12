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
  PAL, spriteMapWidth, smokePingPong, interpWaypoints, countryOutline, type Waypoint,
} from "./warmapPremiumKit";
import { NIGER_RING, BURKINA_RING } from "./sahelCountries";
import { WarMapPlaque } from "./WarMapPlaque";

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
// MINUSMA part dès la FIN du 2.4 (Aziz : alléger le 2.5, les ONU ont joué leur rôle 2.3-2.4).
const MINUSMA: Base[] = [
  { id: "kidal", name: "KIDAL", coord: [1.44, 18.43], appearAt: F_MINUSMA, fallAt: F_ECHEC + 330 },
  { id: "tombouctou", name: "TOMBOUCTOU", coord: [-3.01, 16.79], appearAt: F_MINUSMA + 14, fallAt: F_ECHEC + 345 },
  { id: "mopti", name: "MOPTI", coord: [-4.20, 14.49], appearAt: F_MINUSMA + 28, fallAt: F_ECHEC + 360 },
];
const HELD_CITIES: { id: string; name: string; coord: [number, number]; appearAt: number }[] = [
  { id: "ville-gao", name: "GAO", coord: [-0.04, 16.27], appearAt: F_VILLES },
  { id: "ville-mopti", name: "MOPTI", coord: [-4.20, 14.49], appearAt: F_VILLES + 12 },
  { id: "ville-douentza", name: "DOUENTZA", coord: [-2.95, 15.00], appearAt: F_VILLES + 24 },
];

// ============================================================
// JETONS JIHADISTES (acteurs) — waypoints frame-driven. 4-6 max (Aziz).
// Ils AVANCENT vers les bases au 2.4, FRANCHISSENT la frontière Burkina au 2.6. Leur passage = le sillage.
// faction : jnim (chèche clair) / eigs (cagoule sombre). sprite fighter-*.
// ============================================================
type Jeton = { id: string; faction: "jnim" | "eigs"; appear: number; disappear: number; wp: Waypoint[]; sillage?: boolean };
// PHASE A (2.4-2.5) : jetons au Mali qui avancent/encerclent les bases. Disparaissent AVANT le Burkina
// (table rase, retour Aziz #3). PHASE B (2.6) : nouveaux jetons SUR le Burkina.
const JETONS: Jeton[] = [
  // --- PHASE A : Mali (2.4 échec + 2.5 rural). Disparaissent à F_DEBORDENT-40 (table rase avant Burkina). ---
  // EIGS depuis l'est (Ménaka/Liptako) → encercle Ménaka puis pousse vers Gao
  { id: "e1", faction: "eigs", appear: F_ECHEC, disappear: F_DEBORDENT - 40, wp: [
    { f: F_ECHEC, lon: 3.6, lat: 15.6 }, { f: F_ECHEC + 120, lon: 2.7, lat: 15.85 },
    { f: F_ECHEC + 220, lon: 2.45, lat: 15.95 },
    { f: F_ECHEC + 360, lon: 1.2, lat: 16.1 }, { f: F_VILLES + 200, lon: 0.2, lat: 16.2 },
  ] },
  // JNIM depuis le sud-ouest (centre Mali) → remonte vers Gao
  { id: "j1", faction: "jnim", appear: F_ECHEC, disappear: F_DEBORDENT - 40, wp: [
    { f: F_ECHEC, lon: -1.8, lat: 15.2 }, { f: F_ECHEC + 110, lon: -0.9, lat: 15.8 },
    { f: F_ECHEC + 160, lon: -0.1, lat: 16.15 },
    { f: F_ECHEC + 320, lon: -0.6, lat: 15.9 }, { f: F_VILLES + 200, lon: -1.5, lat: 15.3 },
  ] },
  // JNIM #2 : remonte vers Tessalit (nord)
  { id: "j2", faction: "jnim", appear: F_ECHEC + 80, disappear: F_DEBORDENT - 40, wp: [
    { f: F_ECHEC + 80, lon: 1.6, lat: 17.5 }, { f: F_ECHEC + 240, lon: 1.2, lat: 19.2 },
    { f: F_ECHEC + 300, lon: 1.05, lat: 20.0 },
    { f: F_VILLES + 200, lon: 0.6, lat: 18.5 },
  ] },
  // --- PHASE B : Burkina (2.6 débordement). Apparaissent SUR le Burkina (table rase faite). sillage=false
  //     (le rouge du Burkina vient du remplissage du contour, pas du sillage de ces jetons). ---
  { id: "b1", faction: "eigs", appear: F_DEBORDENT, disappear: F_NIGER + 60, sillage: false, wp: [
    { f: F_DEBORDENT, lon: -0.6, lat: 14.4 }, { f: F_DEBORDENT + 120, lon: -0.9, lat: 13.4 },
    { f: F_NIGER, lon: -1.1, lat: 12.8 },
  ] },
  { id: "b2", faction: "jnim", appear: F_DEBORDENT + 30, disappear: F_NIGER + 60, sillage: false, wp: [
    { f: F_DEBORDENT + 30, lon: -2.4, lat: 14.0 }, { f: F_DEBORDENT + 150, lon: -2.0, lat: 13.2 },
    { f: F_NIGER, lon: -1.7, lat: 12.6 },
  ] },
];

// ============================================================
// PRÉSENCE FR PRÉ-POSITIONNÉE (2.2) — jetons FR circulaires AUTOUR du Mali (retour Aziz : le zoom out
// révèle la présence, plus de vide). sprite fighter-france. Apparaissent au 2.2, repartent au 2.3.
// ============================================================
type FrToken = { id: string; coord: [number, number]; appear: number };
const FR_PRESENCE: FrToken[] = [
  { id: "fr-tchad", coord: [15.05, 13.50], appear: F_PRESENTE + 6 },     // Tchad (E)
  { id: "fr-niger", coord: [8.00, 17.50], appear: F_PRESENTE + 18 },     // Niger/Madama (NE)
  { id: "fr-ci", coord: [-4.00, 6.80], appear: F_PRESENTE + 30 },        // Côte d'Ivoire / Abidjan (S)
  { id: "fr-mauritanie", coord: [-10.00, 18.00], appear: F_PRESENTE + 42 }, // Mauritanie (O)
];
const F_FR_PRESENCE_OUT = F_MINUSMA + 20; // les jetons FR pré-positionnés s'estompent à l'arrivée MINUSMA

// ============================================================
// JUNTE NIGER (institutionnel — retour Aziz : un VRAI JETON militaire, pas une forme abstraite cheap).
// jeton-junte = officier africain béret (généré neutre). Se pose sur Niamey, halo de bascule.
// ============================================================
const NIAMEY: [number, number] = [2.12, 13.51];

// BURKINA — le "40%" se MONTRE : VRAI contour du pays (sahelCountries) qui se remplit de rouge + contour flash.
const BURKINA_POLY = BURKINA_RING;
const CEDEAO_RING: [number, number][] = [
  [-4.00, 9.50], [-1.20, 7.95], [2.30, 9.30], [8.10, 9.10],  // CI, Ghana, Bénin, Nigeria
];

// FRISE temporelle : étapes affichées. La barre se remplit de F_ECHEC à ~F_DEBORDENT (les "dix ans").
// (Frise = timeline graduée pleine largeur rendue par le MOTEUR pour partie2 — pas ici.)

const BASE_DEG = 3.0, MINUSMA_DEG = 2.4;
const SPRITE_BOUNDS = { min: 120, max: 320 };
const BASE_RATIO = 0.56, MINUSMA_RATIO = 0.55;
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
  // Seuls les jetons sillage!==false laissent une traînée (les jetons Burkina = pas de sillage,
  // le rouge du Burkina vient du remplissage du contour). Le sillage Mali S'ESTOMPE après la table rase.
  const sillageStamps: { x: number; y: number; r: number }[] = [];
  const sillageGlobalOp = interpolate(frame, [F_ECHEC, F_ECHEC + 20, F_DEBORDENT - 60, F_DEBORDENT], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (sillageGlobalOp > 0.01) {
    for (const j of JETONS) {
      if (j.sillage === false) continue;
      if (frame < j.appear) continue;
      const until = Math.min(frame, j.disappear);
      for (let f = j.appear; f <= until; f += 12) {
        const [lon, lat] = interpWaypoints(j.wp, f);
        const pt = project(lon, lat);
        const age = frame - f;
        const r = spriteMapWidth(project, lon, lat, 1.6, { min: 28, max: 90 })
          * interpolate(age, [0, 45], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        sillageStamps.push({ x: pt.x, y: pt.y, r });
      }
    }
  }

  // ── BURKINA qui se remplit (2.6) : le contour du pays projeté + un fill rouge qui monte de 0→~40% de
  //    hauteur (le "40%" se VOIT, retour Aziz). Pas d'overlay chiffré. ──
  const burkinaPx = BURKINA_POLY.map(([lon, lat]) => project(lon, lat));
  const burkinaPath = burkinaPx.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("") + "Z";
  const burkinaFill = interpolate(frame, [F_DEBORDENT, F_BURKINA + 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // 0→1 (1 = ~40% couvert)
  const burkinaBounds = burkinaPx.reduce((a, p) => ({ minY: Math.min(a.minY, p.y), maxY: Math.max(a.maxY, p.y) }), { minY: 1e9, maxY: -1e9 });
  const showBurkina = frame >= F_DEBORDENT - 10 && frame <= F_NIGER + 60;

  // ── Détection encerclement → chute de base en 3 temps ──
  // Une base "chute" à fallAt (calé sur l'arrivée des jetons). 3 temps : alerte (avant) → chute → ruine+fumée.
  const baseState = (b: Base) => {
    const relFall = frame - b.fallAt;
    const alert = interpolate(frame, [b.fallAt - 40, b.fallAt], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const dead = interpolate(relFall, [0, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
    return { alert, dead, relFall };
  };

  // ── Frise métronome ──

  // (Overlay 40% SUPPRIMÉ — retour Aziz : il répétait la voix, hors-centre, inutile. Le 40% se MONTRE
  //  par le remplissage du contour du Burkina ci-dessus.)

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

  // ── helper JETON CIRCULAIRE réutilisable (jihadistes, FR pré-positionnés, junte) — modèle Acte 1 :
  //    cercle parchemin + bordure faction + portrait clippé + ombre + respiration. ──
  const chip = (o: { key: string; x: number; y: number; D: number; op: number; border: string; sprite: string; seed: number }) => {
    if (o.op <= 0.02 || o.D <= 1) return null;
    const breathe = 1 + 0.05 * Math.sin((frame + o.seed) * 0.08);
    return (
      <div key={o.key} style={{
        position: "absolute", left: o.x, top: o.y,
        transform: `translate(-50%,-50%) scale(${breathe})`, opacity: o.op, pointerEvents: "none",
      }}>
        <div style={{ position: "absolute", left: "50%", top: "72%", width: o.D * 0.82, height: o.D * 0.26,
          transform: "translate(-50%,-50%)", background: "rgba(40,27,8,0.42)", borderRadius: "50%", filter: "blur(6px)" }} />
        <div style={{ width: o.D, height: o.D, borderRadius: "50%", overflow: "hidden",
          background: "#F5EFD6", border: `${Math.max(2.5, o.D * 0.06)}px solid ${o.border}`,
          boxShadow: "0 4px 10px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.3)" }}>
          <img src={staticFile(`_shared/sprites/warmap/${o.sprite}.png`)}
            style={{ width: "118%", height: "118%", objectFit: "cover", objectPosition: "top center",
              transform: "translate(-8%, 2%)", display: "block" }} />
        </div>
      </div>
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
          {/* clip = contour du Burkina (le fill rouge ne déborde pas du pays) */}
          <clipPath id="p2-burkina-clip"><path d={burkinaPath} /></clipPath>
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

        {/* BURKINA QUI SE REMPLIT (2.6) — le "40%" se MONTRE : contour du pays + fill rouge qui monte par
            le bas (clippé au contour), jusqu'à ~40% de la hauteur. Pas d'overlay chiffré. (retour Aziz #3) */}
        {showBurkina && (() => {
          const { minY, maxY } = burkinaBounds;
          const h = maxY - minY;
          // le rouge monte du bas (maxY) vers le haut, jusqu'à 40% de la hauteur quand burkinaFill=1
          const fillTop = maxY - h * 0.40 * burkinaFill;
          const op = interpolate(frame, [F_DEBORDENT - 10, F_DEBORDENT + 20, F_NIGER + 30, F_NIGER + 60], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <g opacity={op}>
              {/* contour du Burkina mis en évidence */}
              <path d={burkinaPath} fill="none" stroke={PAL.INK} strokeWidth={2} strokeOpacity={0.55} />
              {/* fill rouge qui monte (clippé) */}
              <g clipPath="url(#p2-burkina-clip)" style={{ mixBlendMode: "multiply" }}>
                <rect x={0} y={fillTop} width={width} height={maxY - fillTop} fill={PAL.RED_INK} opacity={0.45} />
              </g>
            </g>
          );
        })()}

        {/* CONTOURS FLASH (technique systématique Aziz) : le territoire nommé se DESSINE + flash, guide l'œil.
            Burkina = rouge (débordement) · Niger = kaki (junte). Couleur porteuse de sens. */}
        {/* RENFORCÉS (Aziz 2026-06-12) : trait plus épais + halo flash plus marqué + double trait (glow). */}
        {(() => {
          const bk = countryOutline({ ring: BURKINA_RING, project, frame, startF: F_DEBORDENT, drawDur: 38, holdDur: 300 });
          if (!bk) return null;
          return (
            <g opacity={bk.op}>
              {bk.flash > 0.05 && <path d={bk.d} fill={PAL.RED_INK} opacity={0.18 * bk.flash} />}
              {/* glow sous-jacent */}
              <path d={bk.d} fill="none" stroke={PAL.RED_INK} strokeWidth={7 + 4 * bk.flash} strokeOpacity={0.22}
                strokeDasharray={bk.len} strokeDashoffset={bk.dashOffset} strokeLinejoin="round" />
              <path d={bk.d} fill="none" stroke={PAL.RED_INK} strokeWidth={3.6 + 2 * bk.flash}
                strokeOpacity={0.92} strokeDasharray={bk.len} strokeDashoffset={bk.dashOffset} strokeLinejoin="round" />
            </g>
          );
        })()}
        {(() => {
          const ng = countryOutline({ ring: NIGER_RING, project, frame, startF: F_NIGER, drawDur: 40, holdDur: 240 });
          if (!ng) return null;
          const KK = "#6E5E33";
          return (
            <g opacity={ng.op}>
              {ng.flash > 0.05 && <path d={ng.d} fill={KK} opacity={0.18 * ng.flash} />}
              <path d={ng.d} fill="none" stroke={KK} strokeWidth={7 + 4 * ng.flash} strokeOpacity={0.22}
                strokeDasharray={ng.len} strokeDashoffset={ng.dashOffset} strokeLinejoin="round" />
              <path d={ng.d} fill="none" stroke={KK} strokeWidth={3.6 + 2 * ng.flash}
                strokeOpacity={0.95} strokeDasharray={ng.len} strokeDashoffset={ng.dashOffset} strokeLinejoin="round" />
            </g>
          );
        })()}

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

        {/* ============ VILLES TENUES (2.5) — points clairs NOMMÉS qui RÉSISTENT dans le rouge (retour Aziz :
             plus de sprite-bâtiment ambigu). Halo bleu-acier qui pulse (la ville tient) + nom géo-ancré.
             Présentes 2.5 → estompent quand le Burkina commence. ============ */}
        {frame >= F_VILLES && frame < F_DEBORDENT && HELD_CITIES.map((c, i) => {
          const p = project(c.coord[0], c.coord[1]);
          const ap = spring({ frame: frame - (c.appearAt + i * 6), fps, config: { damping: 13 }, durationInFrames: 16 });
          const out = interpolate(frame, [F_DEBORDENT - 50, F_DEBORDENT], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const op = ap * out;
          if (op <= 0.02) return null;
          const pulse = 1 + 0.12 * Math.sin((frame - c.appearAt) * 0.11);
          const r = 0.011 * vmin;
          return (
            <g key={c.id} opacity={op}>
              {/* halo de tenue qui PULSE (la ville résiste dans le rouge) — double anneau */}
              <circle cx={p.x} cy={p.y} r={r * 2.8 * pulse} fill="none" stroke={PAL.STEEL} strokeWidth={1.6} strokeOpacity={0.35} />
              <circle cx={p.x} cy={p.y} r={r * 1.9} fill="none" stroke={PAL.STEEL} strokeWidth={2} strokeOpacity={0.6} />
              <circle cx={p.x} cy={p.y} r={r} fill={PAL.STEEL} fillOpacity={0.95} />
              {/* le NOM est rendu en WarMapPlaque hors-SVG (plaque parchemin élégante) */}
            </g>
          );
        })}
      </svg>

      {/* ============ SPRITES LIEUX (bases FR + MINUSMA, ancrés carte) ============ */}
      {MINUSMA.map((m) => renderBase(m, minusmaSprite, MINUSMA_DEG, MINUSMA_RATIO))}
      {FR_BASES.map((b) => renderBase(b, baseSprite, BASE_DEG, BASE_RATIO))}

      {/* ============ PLAQUES DE NOMS (WarMapPlaque parchemin élégante) ============ */}
      {/* Villes tenues (2.5) */}
      {HELD_CITIES.map((c, i) => {
        const p = project(c.coord[0], c.coord[1]);
        return (
          <WarMapPlaque key={`plaque-${c.id}`} frame={frame} name={c.name} pos={p}
            appearAt={c.appearAt + i * 6 + 8} hideAt={F_DEBORDENT} accent={PAL.STEEL} size={17} yOffset={26} />
        );
      })}
      {/* Burkina (2.6) — plaque pays + date */}
      <WarMapPlaque frame={frame} name="BURKINA FASO" pos={project(-1.5, 12.3)}
        appearAt={F_DEBORDENT + 30} hideAt={F_NIGER} accent={PAL.RED_INK} stat="2015 · 40%" size={20} yOffset={20} />
      {/* Niger (bascule) — plaque pays + date */}
      <WarMapPlaque frame={frame} name="NIGER" pos={project(8.5, 17.6)}
        appearAt={F_NIGER + 30} hideAt={F_CEDEAO + 40} accent="#6E5E33" stat="Juillet 2023 · CNSP" size={22} yOffset={20} />

      {/* ============ JETONS FR PRÉ-POSITIONNÉS (2.2) — le zoom out révèle la présence FR tout autour
           (retour Aziz : plus de vide). Bordure bleu-acier FR. Repartent à l'arrivée MINUSMA. ============ */}
      {FR_PRESENCE.map((t) => {
        if (frame < t.appear) return null;
        const op = interpolate(frame, [t.appear, t.appear + 12, F_FR_PRESENCE_OUT - 20, F_FR_PRESENCE_OUT], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (op <= 0.02) return null;
        const p = project(t.coord[0], t.coord[1]);
        const ap = spring({ frame: frame - t.appear, fps, config: { damping: 15 }, durationInFrames: 14 });
        const D = spriteMapWidth(project, t.coord[0], t.coord[1], JETON_DEG, JETON_BOUNDS) * ap;
        return chip({ key: t.id, x: p.x, y: p.y, D, op, border: PAL.STEEL, sprite: "fighter-france", seed: 3 });
      })}

      {/* ============ JETONS JIHADISTES (acteurs qui avancent) — vrai jeton circulaire (modèle Acte 1) ============ */}
      {activeJetons.map(({ j, lon, lat, p }) => {
        const ap = spring({ frame: frame - j.appear, fps, config: { damping: 15 }, durationInFrames: 14 });
        const dis = interpolate(frame, [j.disappear - 30, j.disappear], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const op = ap * dis;
        if (op <= 0.02) return null;
        const D = spriteMapWidth(project, lon, lat, JETON_DEG, JETON_BOUNDS) * ap;
        const border = j.faction === "jnim" ? "#C9A24B" : "#2E2A1E";
        const sprite = j.faction === "jnim" ? "fighter-jnim" : "fighter-eigs";
        return chip({ key: j.id, x: p.x, y: p.y, D, op, border, sprite, seed: j.id.charCodeAt(1) * 7 });
      })}

      {/* ============ JETON JUNTE NIGER (2.7) — vrai jeton militaire institutionnel (retour Aziz : pas une
           forme abstraite). Se pose sur Niamey, bordure kaki militaire. Distinct des jihadistes. ============ */}
      {juntT > 0.01 && (() => {
        const ap = spring({ frame: frame - F_NIGER, fps, config: { damping: 13 }, durationInFrames: 18 });
        const D = spriteMapWidth(project, NIAMEY[0], NIAMEY[1], JETON_DEG * 1.15, { min: 74, max: 170 }) * ap;
        return chip({ key: "junte", x: niamey.x, y: niamey.y, D, op: juntT, border: "#6E5E33", sprite: "jeton-junte", seed: 11 });
      })()}

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

      {/* FRISE : la timeline graduée pleine largeur (curseur date qui glisse dès le début de la P2) est
          REND PAR LE MOTEUR (timeline Acte 1 réactivée pour partie2, Aziz 2026-06-12). Plus de frise maison.
          Data-viz 40% jauge SUPPRIMÉE — le 40% se MONTRE par le remplissage du contour du Burkina. */}
    </AbsoluteFill>
  );
};

export default Partie2Blocage;
