// PARTIE 3 — LA RUPTURE ET L'ÉPREUVE — VERSION NARRATIVE (grammaire causale, 2026-06-12).
//
// MODÈLE = Partie2Blocage.tsx (P2 validée Aziz). Plan : PLAN-NARRATIF-P3.md. DA-brief upstream
// (Gemini+Kimi+DeepSeek) intégré. Scan templates : SahelAttackArrow + TerritorialExpansion réutilisés.
//
// IDÉE STRUCTURANTE — INVERSION CHROMATIQUE (décision Aziz) :
//   En P2, l'avancée des jetons = ROUGE (les jihadistes prennent). En P3, l'avancée principale = BLEU MALI
//   (l'ÉTAT REPREND Kidal). Le rouge ne revient qu'en Ph9 (attaques 2026), mais REFOULÉ — il ne tient pas.
//   Cette inversion raconte "la rupture" : pour une fois, l'ordre étatique gagne du terrain.
//
// GRAMMAIRE (cause précède effet) :
//   - Ph1 : les flèches CEDEAO (héritées P2) se BRISENT/reculent → cause : l'union AES. Les 3 pays virent OR.
//   - Ph2 : la zone Liptako-Gourma PULSE OR = l'union se VOIT géographiquement. Figée 2s (naissance AES).
//   - Ph4 : "Kidal." seul, onde de choc + label tracé. Emphase chirurgicale (Kidal plein, tour épuré).
//   - Ph5 : jetons touaregs POSÉS (statu quo gelé), ONU présente mais passive.
//   - Ph6 : ONU se retire (points s'effacent) → FAMa AVANCENT (SahelAttackArrow) → Africa Corps en appui.
//   - Ph7 : touaregs reculent, Kidal vire BLEU (TerritorialExpansion), drapeau malien hissé. Figé 2s.
//   - Ph8 : Moura — flashback DATÉ mars 2022, DÉSATURATION globale + timeline qui recule. Très sobre.
//   - Ph9 : attaques 2026 (rouges qui pulsent, SANS sillage) REFOULÉES par halo bleu des capitales.
//
// Couche PURE par-dessus la carte (pattern <PartieX>). Reçoit SahelRenderContext + l'instance map (pour
// SahelAttackArrow/TerritorialExpansion qui projettent via map.project()). Ne possède PAS la map.

import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useVideoConfig, Easing } from "remotion";
import type mapboxgl from "mapbox-gl";
import type { SahelRenderContext } from "../engine/SahelContext";
import {
  PAL, spriteMapWidth, interpWaypoints, countryOutline, type Waypoint,
} from "./warmapPremiumKit";
import { MALI_RING, NIGER_RING, BURKINA_RING } from "./sahelCountries";
import { WarMapPlaque } from "./WarMapPlaque";
import { SahelAttackArrow } from "../_shared/SahelAttackArrow";
import { TerritorialExpansion, type ExpansionRegion } from "../_shared/TerritorialExpansion";

// ============================================================
// TRIGGERS V5 P3 (alignment narration-v5, ×30fps — VÉRIFIÉS contre narration-v5-alignment.json 2026-06-12)
// ============================================================
const F_BAMAKO = 6118;     // "Bamako" — Ph1 union AES, CEDEAO se brise
const F_OUAGA = 6138;      // "Ouagadougou"
const F_LIPTAKO = 6616;    // "Liptako-Gourma" — Ph2 naissance AES (figée 2s)
const F_EPREUVE = 6800;    // "mis à l'épreuve" — Ph3 transition zoom Kidal (approx)
const F_KIDAL = 7083;      // "Kidal." — Ph4 (figée 1s, silence)
const F_TOUAREGS = 7319;   // "touaregs" — Ph5 statu quo 2012
const F_RETIRE = 7673;     // "retire" — Ph6 ONU se retire
const F_AFRICA = 7794;     // "Africa" Corps — Ph6 offensive FAMa
const F_FLOTTE = 8132;     // "flotte" — Ph7 reprise Kidal (figée 2s)
const F_MOURA = 8580;      // "Moura" — Ph8 flashback mars 2022
const F_REPOUSSE = 9121;   // "repousse" — Ph9 attaques 2026 refoulées
const F_CONSERVER = 9372;  // "conserver" — pont P4
const F_END = 9560;        // fin P3

// ============================================================
// COORDONNÉES (lon, lat)
// ============================================================
const BAMAKO: [number, number] = [-8.00, 12.65];
const OUAGA: [number, number] = [-1.52, 12.37];
const NIAMEY: [number, number] = [2.12, 13.51];
const LIPTAKO_CENTER: [number, number] = [0.60, 14.40];   // triangle frontalier Mali-BF-Niger
const KIDAL: [number, number] = [1.44, 18.43];
const GAO: [number, number] = [-0.04, 16.27];
const MENAKA: [number, number] = [2.40, 15.92];
const MOURA: [number, number] = [-3.95, 14.92];           // centre Mali (région de Mopti)

// Capitales AES (Ph1 : s'allument + lien or ; Ph9 : halo de protection bleu)
const AES_CAPITALS: { id: string; name: string; coord: [number, number]; at: number }[] = [
  { id: "bamako", name: "BAMAKO", coord: BAMAKO, at: F_BAMAKO },
  { id: "ouaga", name: "OUAGADOUGOU", coord: OUAGA, at: F_OUAGA },
  { id: "niamey", name: "NIAMEY", coord: NIAMEY, at: F_OUAGA + 24 },
];

// CEDEAO (héritée P2) : pays côtiers dont les flèches de menace vont se BRISER vers Niamey.
const CEDEAO_RING: [number, number][] = [
  [-4.00, 9.50], [-1.20, 7.95], [2.30, 9.30], [8.10, 9.10],  // CI, Ghana, Bénin, Nigeria
];

// ONU / MINUSMA autour de Kidal (Ph5 présents passifs → Ph6 se retirent un par un).
type Base = { id: string; name: string; coord: [number, number]; appearAt: number; outAt: number };
const MINUSMA_KIDAL: Base[] = [
  { id: "un-kidal", name: "KIDAL", coord: [1.44, 18.43], appearAt: F_TOUAREGS, outAt: F_RETIRE + 20 },
  { id: "un-aguelhok", name: "AGUELHOK", coord: [0.87, 19.47], appearAt: F_TOUAREGS + 14, outAt: F_RETIRE + 60 },
  { id: "un-tessalit", name: "TESSALIT", coord: [1.01, 20.20], appearAt: F_TOUAREGS + 28, outAt: F_RETIRE + 100 },
];

// Africa Corps (ex-Wagner) — base/fortin gris EN APPUI (décision Aziz : pas un jeton acteur principal).
const AFRICACORPS_BASE: Base = { id: "africacorps", name: "AFRICA CORPS", coord: [0.20, 16.80], appearAt: F_AFRICA, outAt: F_END };

// Jetons touaregs (Ph5 POSÉS autour de Kidal, ils tiennent ; Ph6-7 RECULENT vers le nord).
type Jeton = { id: string; appear: number; disappear: number; wp: Waypoint[] };
const TOUAREG_JETONS: Jeton[] = [
  // posés au sud/est de Kidal pendant le statu quo, reculent vers le nord-est à la reprise
  { id: "t1", appear: F_TOUAREGS, disappear: F_FLOTTE + 30, wp: [
    { f: F_TOUAREGS, lon: 1.70, lat: 18.20 }, { f: F_AFRICA, lon: 1.70, lat: 18.20 },
    { f: F_FLOTTE, lon: 2.60, lat: 19.10 }, { f: F_FLOTTE + 30, lon: 3.20, lat: 19.60 },
  ] },
  { id: "t2", appear: F_TOUAREGS + 12, disappear: F_FLOTTE + 30, wp: [
    { f: F_TOUAREGS, lon: 1.10, lat: 18.75 }, { f: F_AFRICA, lon: 1.10, lat: 18.75 },
    { f: F_FLOTTE, lon: 0.70, lat: 19.70 }, { f: F_FLOTTE + 30, lon: 0.30, lat: 20.20 },
  ] },
];

// Jetons FAMa (Ph6 AVANCENT depuis Gao/Ménaka vers Kidal). RACCORD CAUSAL (DA-brief B) : ils démarrent
// PENDANT le retrait ONU (chevauchement) → l'œil lit la PASSATION (vide ONU comblé par l'armée).
const F_FAMA_START = 7720; // pendant le fade ONU (le 1er point ONU est déjà à ~50%) — passation lisible
const FAMA_JETONS: Jeton[] = [
  { id: "f1", appear: F_FAMA_START, disappear: F_MOURA - 40, wp: [
    { f: F_FAMA_START, lon: GAO[0], lat: GAO[1] }, { f: F_FAMA_START + 160, lon: 0.70, lat: 17.40 },
    { f: F_FLOTTE - 30, lon: 1.30, lat: 18.30 }, { f: F_FLOTTE, lon: 1.40, lat: 18.40 },
  ] },
  { id: "f2", appear: F_FAMA_START + 24, disappear: F_MOURA - 40, wp: [
    { f: F_FAMA_START + 24, lon: MENAKA[0], lat: MENAKA[1] }, { f: F_FAMA_START + 170, lon: 1.90, lat: 17.30 },
    { f: F_FLOTTE - 30, lon: 1.55, lat: 18.25 }, { f: F_FLOTTE, lon: 1.50, lat: 18.38 },
  ] },
];

// Attaques 2026 (Ph9) — SPRITES JIHADISTES RÉELS (DA-brief D : pas des halos qui poppent).
// Ils AVANCENT VITE vers une capitale (assaut) → arrêt NET au halo bleu de défense → reculent LENTEMENT
// en s'effaçant (déroute). Le différentiel de vélocité raconte. Court sillage rouge sourd. Continuité
// de l'ennemi P1/P2 (technical-jnim / fighter-jnim / fighter-eigs).
// attackEnd = frame d'arrêt au contact ; chaque sprite recule de attackEnd à disappear (lent).
type Attack = { id: string; faction: "jnim" | "eigs"; appear: number; attackEnd: number; disappear: number; from: [number, number]; to: [number, number] };
const ATTACKS_2026: Attack[] = [
  // vers Bamako (SO)
  { id: "atk1", faction: "jnim", appear: F_REPOUSSE, attackEnd: F_REPOUSSE + 40, disappear: F_REPOUSSE + 130, from: [-6.20, 13.40], to: [-7.30, 12.85] },
  // vers Ouaga (S)
  { id: "atk2", faction: "eigs", appear: F_REPOUSSE + 16, attackEnd: F_REPOUSSE + 56, disappear: F_REPOUSSE + 140, from: [-0.30, 13.60], to: [-1.30, 12.55] },
  // vers Niamey (SE)
  { id: "atk3", faction: "eigs", appear: F_REPOUSSE + 30, attackEnd: F_REPOUSSE + 70, disappear: F_REPOUSSE + 150, from: [3.40, 14.20], to: [2.30, 13.65] },
  // 2e poussée vers Bamako (N)
  { id: "atk4", faction: "jnim", appear: F_REPOUSSE + 44, attackEnd: F_REPOUSSE + 84, disappear: F_REPOUSSE + 160, from: [-5.80, 14.60], to: [-7.10, 13.10] },
];

// Région de Kidal (pour le remplissage BLEU à la reprise via TerritorialExpansion geoPolygon).
// Petit polygone autour de Kidal (approximatif, suffisant pour le blob bleu de reconquête).
const KIDAL_REGION: [number, number][] = [
  [0.40, 17.40], [2.60, 17.30], [3.20, 18.60], [2.40, 20.00], [0.90, 20.20], [0.10, 19.00],
];

const JETON_DEG = 1.4;
const JETON_BOUNDS = { min: 64, max: 150 };
const BASE_DEG = 3.0, MINUSMA_DEG = 2.4;
const SPRITE_BOUNDS = { min: 120, max: 320 };
const BASE_RATIO = 0.56, MINUSMA_RATIO = 0.55;
const OR_AES = "#C9A24B";    // or chaud AES (décision Aziz). Mat, pas glossy.
const BLUE_MALI = "#2B4F7C"; // bleu Mali DÉSATURÉ (anti AI-slop chromatique, DA-brief C). Fill 40-60% jamais 100%.
const RED_MOURA = "#6B1A1A"; // rouge bordeaux sourd (gravité Moura, DA-brief C/Q2)

type Props = { ctx: SahelRenderContext | null; map: mapboxgl.Map | null };

export const Partie3Rupture: React.FC<Props> = ({ ctx, map }) => {
  const { fps } = useVideoConfig();
  if (!ctx) return null;
  const { frame, width, height, project } = ctx;
  const vmin = Math.min(width, height);

  const minusmaSprite = staticFile("_shared/sprites/warmap/base-minusma-td.png");
  const africacorpsSprite = staticFile("_shared/sprites/warmap/base-africacorps.png");

  // ── Positions courantes des jetons actifs ──
  const activeTouaregs = TOUAREG_JETONS.filter((j) => frame >= j.appear && frame <= j.disappear)
    .map((j) => { const [lon, lat] = interpWaypoints(j.wp, frame); return { j, lon, lat, p: project(lon, lat) }; });
  const activeFama = FAMA_JETONS.filter((j) => frame >= j.appear && frame <= j.disappear)
    .map((j) => { const [lon, lat] = interpWaypoints(j.wp, frame); return { j, lon, lat, p: project(lon, lat) }; });

  // ── Attaques 2026 (Ph9) : assaut RAPIDE (appear→attackEnd, ease-out) puis déroute LENTE
  //    (attackEnd→disappear, ease-in, recul vers l'origine + fade). Différentiel de vélocité (DA-brief D). ──
  const activeAttacks = ATTACKS_2026.filter((a) => frame >= a.appear && frame <= a.disappear).map((a) => {
    let lon: number, lat: number, op: number, sillageEnd: number;
    if (frame <= a.attackEnd) {
      // assaut : avance vite vers la cible (ease-out = part fort, arrive net)
      const t = interpolate(frame, [a.appear, a.attackEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
      lon = a.from[0] + (a.to[0] - a.from[0]) * t;
      lat = a.from[1] + (a.to[1] - a.from[1]) * t;
      op = interpolate(frame, [a.appear, a.appear + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      sillageEnd = t;
    } else {
      // déroute : recule LENTEMENT vers l'origine (ease-in) en s'effaçant
      const t = interpolate(frame, [a.attackEnd, a.disappear], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
      lon = a.to[0] + (a.from[0] - a.to[0]) * t;
      lat = a.to[1] + (a.from[1] - a.to[1]) * t;
      op = interpolate(frame, [a.attackEnd, a.disappear], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      sillageEnd = 1 - t;
    }
    return { a, lon, lat, p: project(lon, lat), op, sillageEnd };
  });

  // ── SILLAGE BLEU (Ph6-7) : le territoire repris se révèle DERRIÈRE les FAMa (même mask wet-ink que P2,
  //    en BLEU). Inversion chromatique : l'avancée colore en bleu = l'État reprend. ──
  const sillageStamps: { x: number; y: number; r: number }[] = [];
  const sillageBlueOp = interpolate(frame, [F_AFRICA, F_AFRICA + 20, F_FLOTTE + 40, F_FLOTTE + 90], [0, 1, 1, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (sillageBlueOp > 0.01) {
    for (const j of FAMA_JETONS) {
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

  // ── Ph1 : flèches CEDEAO qui VIBRENT puis se BRISENT/reculent (DA : pas un fade mou) ──
  // progress de la menace : 1 (héritée P2) → 0 (brisée par l'union AES)
  const cedeaoBreak = interpolate(frame, [F_BAMAKO, F_BAMAKO + 40], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const cedeaoShake = frame >= F_BAMAKO && frame < F_BAMAKO + 30 ? 2.5 * Math.sin(frame * 0.9) : 0;

  // ── Ph1 : lien OR entre les 3 capitales (le pacte) ──
  const aesLinkProgress = interpolate(frame, [F_BAMAKO + 30, F_OUAGA + 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // ── Ph1 : les 3 contours AES virent OR ──
  const aesGold = interpolate(frame, [F_BAMAKO + 20, F_LIPTAKO], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Ph2 : zone Liptako PULSE OR (l'union se voit) — figée visuellement f6616→+60 ──
  const liptakoT = interpolate(frame, [F_LIPTAKO, F_LIPTAKO + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const liptakoPulse = liptakoT > 0 ? 1 + 0.10 * Math.sin((frame - F_LIPTAKO) * 0.12) : 0;

  // ── Ph4 : onde de choc "Kidal." (cercles concentriques) + assombrissement radial ──
  const kidalP = project(KIDAL[0], KIDAL[1]);
  const kidalShock = interpolate(frame, [F_KIDAL, F_KIDAL + 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kidalHalo = frame >= F_KIDAL ? 0.5 + 0.5 * Math.sin((frame - F_KIDAL) * 0.10) : 0;
  // assombrissement radial centré Kidal (Ph3-4 : tout s'épure sauf Kidal). S'estompe à l'offensive.
  const kidalFocus = interpolate(frame, [F_EPREUVE, F_KIDAL, F_RETIRE, F_RETIRE + 60], [0, 0.45, 0.45, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Ph6 : offensive FAMa (SahelAttackArrow) progress + retrait ONU ──
  const famaArrowP = interpolate(frame, [F_AFRICA, F_FLOTTE - 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // ── Ph8 : Moura — flashback mars 2022. Carte en ÉTAT ALTÉRÉ : fondu SÉPIA (pas noir, charte parchemin),
  //    retour sépia inverse au sortir (DA-brief A). Point grave ABSTRAIT, halo STATIQUE non pulsé (Q2). ──
  //    (défini AVANT kidalBlueT car celui-ci s'atténue pendant Moura.)
  const mouraDesat = interpolate(frame, [F_MOURA - 10, F_MOURA + 20, F_REPOUSSE - 60, F_REPOUSSE - 20], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mouraP = project(MOURA[0], MOURA[1]);

  // ── Ph7 : Kidal vire BLEU (remplissage causal, APRÈS l'arrivée des FAMa — délai cognitif DA) ──
  // Pendant Moura (flashback), le calque Kidal-bleu est mis "en pause" à ~20% (DA-brief A : souvenir figé).
  const kidalBlueT = interpolate(frame, [F_FLOTTE, F_FLOTTE + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (1 - 0.8 * mouraDesat);
  // drapeau malien hissé (révélé bas→haut) au mot "flotte". L'ondulation = le clip qui bouge (kidalFlagPath).
  const flagRise = interpolate(frame, [F_FLOTTE + 8, F_FLOTTE + 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // ── Ph9 : halo de protection BLEU depuis capitales (éteint les rouges) ──
  const protectT = interpolate(frame, [F_REPOUSSE + 30, F_REPOUSSE + 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── helper rendu sprite-lieu ancré carte (ONU + Africa Corps) ──
  const renderBase = (b: Base, src: string, deg: number, ratio: number, fadeOut: boolean) => {
    if (frame < b.appearAt) return null;
    const p = project(b.coord[0], b.coord[1]);
    const ap = spring({ frame: frame - b.appearAt, fps, config: { damping: 14 }, durationInFrames: 18 });
    if (ap <= 0.02) return null;
    // ONU se RETIRE (Ph6) = fade + translation Y vers le haut (un "départ", pas un cut sec — DA-brief B).
    // Africa Corps reste.
    const out = fadeOut ? interpolate(frame, [b.outAt - 30, b.outAt], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
    const driftY = fadeOut ? (1 - out) * -12 : 0; // monte de 12px en s'effaçant
    const op = ap * out;
    if (op <= 0.02) return null;
    const w = spriteMapWidth(project, b.coord[0], b.coord[1], deg, SPRITE_BOUNDS) * ap;
    const h = w * ratio;
    return (
      <img key={b.id} src={src}
        style={{ position: "absolute", left: p.x - w / 2, top: p.y - h * 0.62 + driftY, width: w, height: h, opacity: op,
          filter: `drop-shadow(0 3px 7px rgba(40,30,20,0.32))`, pointerEvents: "none" }} />
    );
  };

  // ── helper JETON CIRCULAIRE (touaregs / FAMa) — modèle chip() P2 ──
  const chip = (o: { key: string; x: number; y: number; D: number; op: number; border: string; sprite: string; seed: number }) => {
    if (o.op <= 0.02 || o.D <= 1) return null;
    const breathe = 1 + 0.05 * Math.sin((frame + o.seed) * 0.08);
    return (
      <div key={o.key} style={{ position: "absolute", left: o.x, top: o.y,
        transform: `translate(-50%,-50%) scale(${breathe})`, opacity: o.op, pointerEvents: "none" }}>
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

  // contour Kidal projeté (pour le drapeau clippé)
  const kidalRegionPx = KIDAL_REGION.map(([lon, lat]) => project(lon, lat));
  const kidalRegionPath = kidalRegionPx.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("") + "Z";
  const kidalBounds = kidalRegionPx.reduce((a, p) => ({ minX: Math.min(a.minX, p.x), maxX: Math.max(a.maxX, p.x), minY: Math.min(a.minY, p.y), maxY: Math.max(a.maxY, p.y) }), { minX: 1e9, maxX: -1e9, minY: 1e9, maxY: -1e9 });
  // clip ONDULANT pour le drapeau (le geste "flotte") : chaque sommet oscille en x d'une amplitude feutrée,
  // déphasée par index → bord du drapeau qui ondule lentement. Continue pendant le figé 2s.
  const wave = (i: number) => kidalBlueT > 0.01 ? Math.sin(frame * 0.10 + i * 1.3) * (vmin * 0.006) : 0;
  const kidalFlagPath = kidalRegionPx.map((p, i) => `${i === 0 ? "M" : "L"}${(p.x + wave(i)).toFixed(1)},${(p.y + wave(i + 2) * 0.5).toFixed(1)}`).join("") + "Z";

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* ============ ÉTAT ALTÉRÉ MOURA (Ph8) — flashback mars 2022 : la carte vire SÉPIA (pas noir,
           charte parchemin). Désaturation + teinte chaude passé. Retour inverse au sortir (DA-brief A). ============ */}
      {mouraDesat > 0.01 && (
        <>
          {/* désature la carte (souvenir) */}
          <AbsoluteFill style={{ background: "#6b5d44", mixBlendMode: "saturation", opacity: mouraDesat * 0.85 }} />
          {/* teinte sépia chaude par-dessus (passé, pas deuil noir) */}
          <AbsoluteFill style={{ background: "#7a6038", mixBlendMode: "multiply", opacity: mouraDesat * 0.32 }} />
        </>
      )}

      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="p3-blue" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={BLUE_MALI} stopOpacity={0.55} />
            <stop offset="100%" stopColor="#3C5A78" stopOpacity={0.4} />
          </radialGradient>
          <filter id="p3-sillage-blur"><feGaussianBlur stdDeviation="16" /></filter>
          <mask id="p3-sillage">
            <g filter="url(#p3-sillage-blur)">
              {sillageStamps.map((s, i) => (<circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" />))}
            </g>
          </mask>
          <clipPath id="p3-kidal-clip"><path d={kidalRegionPath} /></clipPath>
          <clipPath id="p3-kidal-flag-clip"><path d={kidalFlagPath} /></clipPath>
          {/* assombrissement radial centré Kidal (focus chirurgical Ph3-4) */}
          <radialGradient id="p3-kidal-focus"
            gradientUnits="userSpaceOnUse" cx={kidalP.x} cy={kidalP.y} r={vmin * 0.42}>
            <stop offset="0%" stopColor="#000" stopOpacity={0} />
            <stop offset="55%" stopColor="#000" stopOpacity={0} />
            <stop offset="100%" stopColor="#0a0805" stopOpacity={1} />
          </radialGradient>
        </defs>

        {/* FOCUS RADIAL KIDAL (Ph3-4 : tout s'épure autour de Kidal — emphase chirurgicale Aziz) */}
        {kidalFocus > 0.01 && (
          <rect x={0} y={0} width={width} height={height} fill="url(#p3-kidal-focus)" opacity={kidalFocus} />
        )}

        {/* TERRITOIRE BLEU = sillage des FAMa (multiply, révélé par le mask — l'État reprend, Ph6-7) */}
        {sillageStamps.length > 0 && sillageBlueOp > 0.01 && (
          <g style={{ mixBlendMode: "multiply" }} mask="url(#p3-sillage)" opacity={sillageBlueOp}>
            <rect x={0} y={0} width={width} height={height} fill="url(#p3-blue)" opacity={0.5} />
          </g>
        )}

        {/* Ph1 — FLÈCHES CEDEAO QUI SE BRISENT (héritées P2, vibrent puis reculent vers leurs pays) */}
        {cedeaoBreak > 0.02 && CEDEAO_RING.map((c, i) => {
          const p = project(c[0], c[1]);
          const niamey = project(NIAMEY[0], NIAMEY[1]);
          // la flèche RECULE : son extrémité revient vers le pays d'origine quand cedeaoBreak→0
          const tipX = p.x + (niamey.x - p.x) * 0.4 * cedeaoBreak + cedeaoShake;
          const tipY = p.y + (niamey.y - p.y) * 0.4 * cedeaoBreak;
          return (
            <g key={`cedeao-${i}`} opacity={cedeaoBreak}>
              <line x1={p.x} y1={p.y} x2={tipX} y2={tipY}
                stroke={PAL.CEDEAO} strokeWidth={2.4} strokeOpacity={0.6} strokeDasharray="5 4" />
            </g>
          );
        })}

        {/* Ph1 — LIEN OR entre les 3 capitales AES (le pacte "une seule voix") */}
        {aesLinkProgress > 0.01 && (() => {
          const b = project(BAMAKO[0], BAMAKO[1]);
          const o = project(OUAGA[0], OUAGA[1]);
          const n = project(NIAMEY[0], NIAMEY[1]);
          const seg = (a: { x: number; y: number }, c: { x: number; y: number }, t: number) => (
            <line x1={a.x} y1={a.y} x2={a.x + (c.x - a.x) * t} y2={a.y + (c.y - a.y) * t}
              stroke={OR_AES} strokeWidth={3} strokeOpacity={0.85} strokeLinecap="round" />
          );
          return (
            <g>
              {seg(b, o, Math.min(1, aesLinkProgress * 2))}
              {seg(o, n, Math.max(0, Math.min(1, (aesLinkProgress - 0.5) * 2)))}
            </g>
          );
        })()}

        {/* Ph1 — CONTOURS AES virent OR (Mali + Burkina + Niger ensemble) */}
        {aesGold > 0.01 && [MALI_RING, BURKINA_RING, NIGER_RING].map((ring, i) => {
          const oc = countryOutline({ ring, project, frame, startF: F_BAMAKO + i * 8, drawDur: 38, holdDur: 600 });
          if (!oc) return null;
          return (
            <g key={`aes-${i}`} opacity={oc.op * aesGold}>
              {oc.flash > 0.05 && <path d={oc.d} fill={OR_AES} opacity={0.10 * oc.flash} />}
              <path d={oc.d} fill="none" stroke={OR_AES} strokeWidth={6 + 3 * oc.flash} strokeOpacity={0.20}
                strokeDasharray={oc.len} strokeDashoffset={oc.dashOffset} strokeLinejoin="round" />
              <path d={oc.d} fill="none" stroke={OR_AES} strokeWidth={3.2 + 1.6 * oc.flash} strokeOpacity={0.85}
                strokeDasharray={oc.len} strokeDashoffset={oc.dashOffset} strokeLinejoin="round" />
            </g>
          );
        })}

        {/* Ph2 — ZONE LIPTAKO PULSE OR (l'union se voit géographiquement, figée 2s) */}
        {liptakoT > 0.01 && (() => {
          const lp = project(LIPTAKO_CENTER[0], LIPTAKO_CENTER[1]);
          const r = spriteMapWidth(project, LIPTAKO_CENTER[0], LIPTAKO_CENTER[1], 3.2, { min: 60, max: 260 }) * liptakoPulse;
          return (
            <g opacity={liptakoT} transform={`translate(${lp.x},${lp.y})`}>
              <circle r={r} fill={OR_AES} fillOpacity={0.16} />
              <circle r={r} fill="none" stroke={OR_AES} strokeWidth={3} strokeOpacity={0.7} />
              <circle r={r * 1.35} fill="none" stroke={OR_AES} strokeWidth={1.6} strokeOpacity={0.35 * liptakoPulse} />
            </g>
          );
        })()}

        {/* Ph4 — ONDE DE CHOC "KIDAL." (cercles concentriques encre) + halo permanent */}
        {kidalShock > 0 && kidalShock < 1 && (
          <g transform={`translate(${kidalP.x},${kidalP.y})`}>
            {[0, 0.33, 0.66].map((d, i) => {
              const t = Math.max(0, Math.min(1, kidalShock - d));
              if (t <= 0) return null;
              return <circle key={i} r={vmin * 0.04 + t * vmin * 0.10} fill="none"
                stroke={PAL.INK} strokeWidth={2.2} strokeOpacity={(1 - t) * 0.6} />;
            })}
          </g>
        )}
        {frame >= F_KIDAL && frame < F_MOURA && (
          <g transform={`translate(${kidalP.x},${kidalP.y})`}>
            <circle r={vmin * 0.018 * (1 + 0.2 * kidalHalo)} fill={OR_AES} fillOpacity={0.9} />
            <circle r={vmin * 0.030 * (1 + 0.25 * kidalHalo)} fill="none" stroke={OR_AES} strokeWidth={2} strokeOpacity={0.5 + 0.3 * kidalHalo} />
          </g>
        )}

        {/* Ph7 — KIDAL VIRE BLEU (désaturé, fill ~50% "peint sur papier") + VRAIE IMAGE drapeau malien
            clippée dans le polygone Kidal (Q1 tranchée Aziz). Le "flotte" = MICRO-ONDULATION du clip-path
            (oscillation sinusoïdale feutrée), ZÉRO sprite généré. Pendant le figé 2s, seul le drapeau ondule. */}
        {kidalBlueT > 0.01 && (() => {
          const { minX, maxX, minY, maxY } = kidalBounds;
          const w = maxX - minX, h = maxY - minY;
          return (
            <>
              {/* fond bleu de reconquête (désaturé, ~50%, jamais 100%) */}
              <g clipPath="url(#p3-kidal-clip)" style={{ mixBlendMode: "multiply" }}>
                <rect x={minX} y={minY} width={w} height={h} fill={BLUE_MALI} opacity={0.50 * kidalBlueT} />
              </g>
              {/* VRAIE IMAGE drapeau Mali, clippée au polygone Kidal ONDULANT, révélée bas→haut */}
              {flagRise > 0.01 && (
                <g clipPath="url(#p3-kidal-flag-clip)" opacity={Math.min(1, flagRise * 1.3) * 0.9}>
                  <image href={staticFile("_shared/flags/ml.png")}
                    x={minX} y={maxY - h * flagRise} width={w} height={h * flagRise}
                    preserveAspectRatio="xMidYMid slice" />
                </g>
              )}
            </>
          );
        })()}

        {/* Ph8 — MOURA : ABSTRACTION PURE (Q2). Point rouge bordeaux sourd + halo STATIQUE dilué (~20%,
            PAS pulsé = pas d'alerte jeu vidéo). Aucun visage. La gravité par la froideur clinique. */}
        {frame >= F_MOURA && frame < F_REPOUSSE - 20 && (() => {
          const ap = interpolate(frame, [F_MOURA, F_MOURA + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <g transform={`translate(${mouraP.x},${mouraP.y})`} opacity={mouraDesat * ap}>
              <circle r={vmin * 0.045} fill={RED_MOURA} fillOpacity={0.20} />
              <circle r={vmin * 0.014} fill={RED_MOURA} fillOpacity={0.92} />
            </g>
          );
        })()}

        {/* Ph9 — COURT SILLAGE ROUGE SOURD derrière les sprites d'attaque (assaut), s'effiloche à la déroute */}
        {activeAttacks.map(({ a, p, op, sillageEnd }) => {
          const from = project(a.from[0], a.from[1]);
          if (op <= 0.02) return null;
          return (
            <line key={`atk-trail-${a.id}`} x1={from.x} y1={from.y} x2={p.x} y2={p.y}
              stroke={PAL.RED_DEEP} strokeWidth={3} strokeOpacity={0.30 * op * sillageEnd} strokeLinecap="round"
              strokeDasharray="6 6" />
          );
        })}
        {/* Ph9 — HALO BLEU DE DÉFENSE des capitales (la barrière qui arrête/refoule les attaques) */}
        {protectT > 0.01 && AES_CAPITALS.map((c) => {
          const p = project(c.coord[0], c.coord[1]);
          const r = vmin * 0.05 * protectT;
          const breath = 1 + 0.06 * Math.sin(frame * 0.12);
          return (
            <g key={`shield-${c.id}`} transform={`translate(${p.x},${p.y})`} opacity={protectT * 0.7}>
              <circle r={r * breath} fill="none" stroke={BLUE_MALI} strokeWidth={2.4} strokeOpacity={0.6} />
              <circle r={r * 0.6} fill={BLUE_MALI} fillOpacity={0.12} />
            </g>
          );
        })}
      </svg>

      {/* ============ FLÈCHE OFFENSIVE FAMa (SahelAttackArrow réutilisé — Ph6) ============ */}
      {/* headType "dot" (la tête "arrow" rendait un artefact en étoile au scale réduit). S'efface dès la reprise. */}
      {famaArrowP > 0.01 && frame < F_FLOTTE && (() => {
        const arrowFade = interpolate(frame, [F_FLOTTE - 40, F_FLOTTE], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <SahelAttackArrow map={map} waypoints={[GAO, KIDAL]} progress={famaArrowP}
            color={BLUE_MALI} strokeWidth={4} headType="dot" marchingFrame={frame} opacity={0.85 * arrowFade} width={width} height={height} />
        );
      })()}

      {/* ============ RECONQUÊTE BLEUE / LIGNE DE FRONT (TerritorialExpansion réutilisé — Ph7) ============ */}
      {frame >= F_FLOTTE - 10 && frame < F_MOURA && (
        <TerritorialExpansion map={map} frame={frame} startFrame={F_FLOTTE} endFrame={F_FLOTTE + 60}
          color={BLUE_MALI} maxOpacity={0.30} width={width} height={height}
          regions={[{ id: "kidal", center: KIDAL, delayFrames: 0, durationFrames: 50, geoPolygon: KIDAL_REGION }]} />
      )}

      {/* ============ SPRITES LIEUX (ONU autour de Kidal + Africa Corps en appui) ============ */}
      {MINUSMA_KIDAL.map((m) => renderBase(m, minusmaSprite, MINUSMA_DEG, MINUSMA_RATIO, true))}
      {frame >= AFRICACORPS_BASE.appearAt && renderBase(AFRICACORPS_BASE, africacorpsSprite, BASE_DEG * 0.85, BASE_RATIO, false)}

      {/* ============ JETONS TOUAREGS (Ph5 posés → Ph6-7 reculent) ============ */}
      {activeTouaregs.map(({ j, lon, lat, p }) => {
        const ap = spring({ frame: frame - j.appear, fps, config: { damping: 15 }, durationInFrames: 14 });
        const dis = interpolate(frame, [j.disappear - 30, j.disappear], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const op = ap * dis;
        if (op <= 0.02) return null;
        const D = spriteMapWidth(project, lon, lat, JETON_DEG, JETON_BOUNDS) * ap;
        return chip({ key: j.id, x: p.x, y: p.y, D, op, border: "#9C8859", sprite: "jeton-csp", seed: j.id.charCodeAt(1) * 7 });
      })}

      {/* ============ JETONS FAMa (Ph6 avancent vers Kidal — bordure bleu Mali) ============ */}
      {activeFama.map(({ j, lon, lat, p }) => {
        const ap = spring({ frame: frame - j.appear, fps, config: { damping: 15 }, durationInFrames: 14 });
        const dis = interpolate(frame, [j.disappear - 30, j.disappear], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const op = ap * dis;
        if (op <= 0.02) return null;
        const D = spriteMapWidth(project, lon, lat, JETON_DEG, JETON_BOUNDS) * ap;
        return chip({ key: j.id, x: p.x, y: p.y, D, op, border: BLUE_MALI, sprite: "jeton-fama", seed: j.id.charCodeAt(1) * 7 });
      })}

      {/* ============ ATTAQUES 2026 (Ph9) — sprites jihadistes RÉELS qui avancent→refoulés ============ */}
      {activeAttacks.map(({ a, lon, lat, p, op }) => {
        if (op <= 0.02) return null;
        const D = spriteMapWidth(project, lon, lat, JETON_DEG * 0.92, { min: 54, max: 120 });
        const border = a.faction === "jnim" ? "#C9A24B" : "#2E2A1E";
        const sprite = a.faction === "jnim" ? "fighter-jnim" : "fighter-eigs";
        return chip({ key: a.id, x: p.x, y: p.y, D, op, border, sprite, seed: a.id.charCodeAt(3) * 7 });
      })}

      {/* (FUMÉE retrait ONU RETIRÉE — décision Aziz : l'ONU "se retire" = effacement PROPRE des points,
          pas une chute en fumée. La fumée centrale sur Kidal brouillait le retrait. Les sprites ONU
          fondent déjà via `out` dans renderBase.) */}

      {/* ============ PLAQUES DE NOMS (WarMapPlaque parchemin) ============ */}
      {/* Ph2 — naissance AES */}
      <WarMapPlaque frame={frame} name="16 SEPT. 2023 · AES" pos={project(LIPTAKO_CENTER[0], LIPTAKO_CENTER[1])}
        appearAt={F_LIPTAKO + 10} hideAt={F_EPREUVE} accent={OR_AES} size={20} yOffset={40} />
      {/* Ph4 — Kidal (label permanent toute la P3) */}
      <WarMapPlaque frame={frame} name="KIDAL" pos={kidalP}
        appearAt={F_KIDAL + 6} hideAt={F_END} accent={OR_AES} size={22} yOffset={26} />
      {/* Ph5 — hors contrôle depuis 2012 */}
      <WarMapPlaque frame={frame} name="HORS CONTRÔLE · DEPUIS 2012" pos={project(1.44, 17.40)}
        appearAt={F_TOUAREGS + 12} hideAt={F_RETIRE} accent="#9C8859" size={16} yOffset={20} />
      {/* Ph6 — FAMa + Africa Corps */}
      <WarMapPlaque frame={frame} name="FAMa + AFRICA CORPS · EX-WAGNER" pos={project(0.20, 16.20)}
        appearAt={F_AFRICA + 20} hideAt={F_FLOTTE} accent={BLUE_MALI} size={16} yOffset={20} />
      {/* Ph7 — Kidal reprise */}
      <WarMapPlaque frame={frame} name="KIDAL REPRISE · NOV. 2023" pos={project(1.44, 19.30)}
        appearAt={F_FLOTTE + 20} hideAt={F_MOURA - 20} accent={BLUE_MALI} size={18} yOffset={20} />
      {/* Ph8 — Moura (sourcé ONU) */}
      <WarMapPlaque frame={frame} name="MOURA · MARS 2022 · +500 CIVILS · RAPPORT ONU" pos={project(MOURA[0], MOURA[1] - 1.2)}
        appearAt={F_MOURA + 14} hideAt={F_REPOUSSE - 30} accent={RED_MOURA} size={15} yOffset={24} />
      {/* Ph9 — attaques repoussées */}
      <WarMapPlaque frame={frame} name="2026 · ATTAQUES REPOUSSÉES" pos={project(-1.0, 13.0)}
        appearAt={F_REPOUSSE + 20} hideAt={F_END} accent={BLUE_MALI} size={18} yOffset={20} />
    </AbsoluteFill>
  );
};

export default Partie3Rupture;
