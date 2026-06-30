/**
 * Cacao -> Chocolat SHORT — BEAT 5 : PONT + CTA — 25,63s -> 769f @30fps (+ respiration = 820f).
 *
 * Narration (timings Whisper, beat5-words.ts — "longue" corrige a la main) :
 *   "Et le cacao n'est qu'une porte d'entrée. Le café, l'or, le cobalt : le même mécanisme, partout.
 *    La version longue de cette vidéo répond à la vraie question : pourquoi 60 ans après les indépendances
 *    ça n'a toujours pas changé. Abonne-toi pour ne pas la rater. Et dis-moi en commentaire :
 *    quel produit t'intéresse le plus que tu voudrais voir traité en vidéo ?"
 *
 * DIRECTION = "L'ARBRE AUX QUATRE OMBRES" (agent Metaphoriste, tranchee Aziz 2026-06-29).
 *   Un cacaoyer central (NOTRE CacaoTree, en couleur = munition couleur finale) projette 4 OMBRES longues
 *   (CACAO/CAFE/OR/COBALT) plus grandes que lui = "meme racine, meme mecanisme, partout". L'arbre = l'Afrique ;
 *   les ombres = la valeur produite qui enrichit ailleurs. L'arbre reste petit, seules les ombres grandissent.
 *
 * GRAMMAIRE GGW (verifiee sur le livrable ggw-muraille-verte-FINAL) : on NE CHANGE PAS de scene pour le CTA.
 *   La scene finale VIT (soleil qui pulse, sway houppier, cabosse qui pulse) et le CTA = DERNIER SOUS-TITRE
 *   karaoke + signature "GeoAfrique" en bas. Pas d'ecran typewriter dedie.
 *
 * 3 SOUS-SCENES (1 audio -> 3 phases, decoupage VISUEL au storyboard) :
 *   - 5A f0-360   "porte d'entree / cafe-or-cobalt = meme mecanisme" -> l'arbre monte, 4 ombres rayonnent (stagger).
 *   - 5B f360-530 "60 ans / la vraie question" -> 5e ombre FANTOME pointillee (question sans reponse), pulse.
 *   - 5C f530-820 CTA -> cabosse qui eclot (spring) + label 5e ombre GELE a mi-chemin (echo tracee avortee B1)
 *                        + karaoke CTA + signature GeoAfrique. La scene continue de vivre.
 *
 * Boucle B1-B5 (la + serree) : l'arbre SEUL au centre = l'inverse exact de B1 (la tablette seule + le cacaoyer
 *   avorte). En B1 l'arbre echouait a naitre ; en B5 il EST la, mais ses ombres le depassent. Le label inacheve
 *   sur la 5e ombre = echo direct des cacaoyers au trace gele de B1. La cabosse = echo CabosseOuverture (B3).
 *
 * Registre ENCRE GGW strict. Karaoke word-level brun chocolat (pattern B1/B2/B3/B4).
 */
import React, { useMemo } from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { CacaoTree } from "../components/VergerCacao";
import { WHISPER_WORDS } from "../audio/beat5-words";

export const B5_PONT_FPS = 30;
// 769f = duree audio (25,63s). +51f (~1,7s) de RESPIRATION finale (scene qui vit, musique couvre). Total 820f.
export const B5_PONT_FRAMES = 820;

const PARCH = "#e8dcc0";
const INK = "#2b2117";
const COCOA = "#6b4423";
const COCOA_DARK = "#4a2c14";
const SERIF = "Georgia, 'Times New Roman', serif";
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

// ---- Phases (frames) ----
const F_5B_START = 360; // ~"La version longue" (12.0s) -> bascule sur la 5e ombre fantome
const F_5C_START = 530; // ~"Abonne-toi" (17.7s) -> CTA + cabosse + label gele

// ---- Position de l'arbre central (au sol, point d'ancrage des ombres) ----
const TREE_X = 540;
const TREE_Y = 980; // pied de l'arbre (les ombres partent d'ici)
const TREE_S = 0.92; // arbre PETIT vs ses ombres

// ---- Les 4 ombres (CACAO/CAFE/OR/COBALT) qui rayonnent depuis le pied de l'arbre ----
// angle en degres (0 = vers la droite, 90 = vers le bas). Les ombres se projettent VERS LE BAS (devant
// l'arbre, comme une vraie ombre portee) en eventail. length = portee (px) ; chacune DEPASSE l'arbre (~250px).
// Contrainte : le BOUT + son label doivent rester dans la zone sure (x in [90,990], y au-dessus du karaoke
// qui commence ~1640 en coord SVG -> pied a 980, donc longueur verticale max ~560). On garde donc l'eventail
// resserre vers le bas (55..125 deg) et on CLAMPE les labels.
// drift (B3) : taux d'elongation IRREVERSIBLE par ombre (l'extraction ne s'arrete jamais). phase = dephasage vie.
type Ombre = { label: string; angleDeg: number; length: number; appearF: number; anchor: "start" | "end" | "middle"; drift: number; phase: number };
const OMBRES: Ombre[] = [
  { label: "CACAO", angleDeg: 78, length: 580, appearF: 40, anchor: "start", drift: 1.15, phase: 0 }, // quasi-centre-droite (1er = echo B3/B4)
  { label: "CAFÉ", angleDeg: 103, length: 520, appearF: 130, anchor: "end", drift: 1.20, phase: 0.8 }, // quasi-centre-gauche
  { label: "OR", angleDeg: 57, length: 560, appearF: 175, anchor: "start", drift: 1.12, phase: 1.6 }, // droite (eventail)
  { label: "COBALT", angleDeg: 124, length: 500, appearF: 220, anchor: "end", drift: 1.22, phase: 2.4 }, // gauche (eventail)
];
// 5e ombre FANTOME (5B) : direction centrale (vers le bas, verticale) = la question sans reponse.
const GHOST = { angleDeg: 90, length: 520 };
// pied de l'arbre (origine des ombres) en coord SVG
const ORIGIN_X = 540;
const ORIGIN_Y = 980;
// zone sure pour les labels
const SAFE_X_MIN = 96;
const SAFE_X_MAX = 984;
const SAFE_Y_MAX = 1560; // au-dessus du bandeau karaoke

// ---- karaoke phrase breaks (indices de mots, regroupes par phrase) ----
// 0 "Et..entree" | 10 "Le cafe..partout" | 20 "La version..question" | 31 "Pourquoi..change"
// 44 "" | 45 "Abonne..rater" | 52 "Et dis-moi..commentaire" | 57 "quel produit..video"
const PHRASE_BREAKS = [10, 20, 31, 44, 45, 52, 57];

// ---- helper : ombre ORGANIQUE (B1) depuis l'origine (0,0), angle, longueur ----
// Flancs en COURBES de Bezier (plus de trapeze rectiligne = plus de "trepied") dont les points de controle
// sont decales par sin(wf) -> l'ombre respire/ondule, desynchronisee par `phase`. Repere local : axe = (dx,dy),
// perpendiculaire = (px,py). On construit base -> flanc droit (vers la pointe) -> pointe -> flanc gauche -> retour.
const ombrePath = (angleDeg: number, length: number, baseHalfW: number, tipHalfW: number, wf: number, phase: number): string => {
  const a = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const px = -dy; // perpendiculaire
  const py = dx;
  // helper : point en coord locales (le long de l'axe `t`*length, decale de `w` sur la perpendiculaire)
  const P = (t: number, w: number) => ({ x: dx * t * length + px * w, y: dy * t * length + py * w });
  // ondulation : amplitude qui decroit de la base (~9px) vers la pointe (~2px)
  const wob = (t: number, k: number) => Math.sin(wf * 0.04 + phase + k) * (9 - 7 * t);
  const base = baseHalfW;
  const tip = tipHalfW;
  // points cles
  const bR = P(0, base); // base droite
  const bL = P(0, -base); // base gauche
  const tR = P(1, tip); // pointe droite
  const tL = P(1, -tip); // pointe gauche
  // points de controle ondules (1/3 et 2/3 le long du flanc)
  const cR1 = P(0.34, base * 0.78 + wob(0.34, 0));
  const cR2 = P(0.7, tip * 1.6 + wob(0.7, 1.2));
  const cL2 = P(0.7, -(tip * 1.6) + wob(0.7, 2.1));
  const cL1 = P(0.34, -(base * 0.78) + wob(0.34, 3.0));
  const f = (n: number) => n.toFixed(1);
  return [
    `M ${f(bR.x)} ${f(bR.y)}`,
    `C ${f(cR1.x)} ${f(cR1.y)} ${f(cR2.x)} ${f(cR2.y)} ${f(tR.x)} ${f(tR.y)}`, // flanc droit ondule
    `L ${f(tL.x)} ${f(tL.y)}`, // pointe
    `C ${f(cL2.x)} ${f(cL2.y)} ${f(cL1.x)} ${f(cL1.y)} ${f(bL.x)} ${f(bL.y)}`, // flanc gauche ondule
    "Z",
  ].join(" ");
};

// position d'un label au bout d'une ombre, CLAMPEE dans la zone sure (coord LOCALES, origine = pied arbre).
// labelW = demi-largeur estimee du texte pour ne pas deborder selon l'ancre.
const labelPosClamped = (angleDeg: number, length: number, anchor: "start" | "end" | "middle", labelW: number) => {
  const a = (angleDeg * Math.PI) / 180;
  let lx = ORIGIN_X + Math.cos(a) * (length + 30);
  let ly = ORIGIN_Y + Math.sin(a) * (length + 30);
  // marge selon l'ancre (start = texte part vers la droite -> garder de la place a droite)
  const padR = anchor === "start" ? labelW : anchor === "middle" ? labelW / 2 : 0;
  const padL = anchor === "end" ? labelW : anchor === "middle" ? labelW / 2 : 0;
  lx = Math.max(SAFE_X_MIN + padL, Math.min(SAFE_X_MAX - padR, lx));
  ly = Math.min(SAFE_Y_MAX, ly);
  // retour en local (le <g> est translate a ORIGIN)
  return { x: lx - ORIGIN_X, y: ly - ORIGIN_Y };
};

// Recompose les ELISIONS pour l'affichage : Whisper coupe "l'or" en ["l","or"], "n'est" en ["n","est"], etc.
// On recolle l/d/qu/n/t/j/c/s/m + mot suivant en un seul token affiche "l'or", en gardant les timings
// (start du 1er fragment, end du dernier) et un index "actif" qui couvre les fragments fusionnes.
type DispWord = { text: string; start: number; end: number; covers: number[] };
const ELISIONS = new Set(["l", "d", "qu", "n", "t", "j", "c", "s", "m"]);
const buildDisplayWords = (words: { word: string; start: number; end: number }[]): DispWord[] => {
  const out: DispWord[] = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const lower = w.word.toLowerCase();
    if (ELISIONS.has(lower) && i + 1 < words.length && words[i + 1].word) {
      const nxt = words[i + 1];
      out.push({ text: `${w.word}'${nxt.word}`, start: w.start, end: nxt.end, covers: [i, i + 1] });
      i++; // on a consomme le mot suivant
    } else if (w.word) {
      out.push({ text: w.word, start: w.start, end: w.end, covers: [i] });
    } else {
      out.push({ text: "", start: w.start, end: w.end, covers: [i] });
    }
  }
  return out;
};

export const B5Pont: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / B5_PONT_FPS;
  const wf = frame; // phase de vie permanente

  // ---- arbre central : monte du sol (reveal clip bottom-up) en 5A ----
  const treeGrow = interpolate(frame, [10, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  // arbre en couleur (munition couleur finale du short)
  const treeAlive = interpolate(frame, [40, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // sway houppier (vie permanente)
  const sway = Math.sin(wf / 26) * 1.5 * (0.7 + 0.3 * Math.sin(wf / 40));

  // ---- soleil vivant (repris du pattern VergerCacao, simplifie) ----
  const sunPulse = 0.85 + 0.15 * Math.sin(wf / 22);
  const sunGlowR = 200 + 24 * Math.sin(wf / 22);

  // ---- 5e ombre fantome (5B) : se trace en pointilles + pulse ----
  const ghostDraw = interpolate(frame, [F_5B_START, F_5B_START + 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const ghostPulse = 0.4 + 0.25 * Math.sin(wf / 16);

  // ---- 5C : cabosse qui eclot du tronc (spring overshoot) ----
  const podSpring = spring({ frame: frame - F_5C_START, fps, config: { damping: 9, stiffness: 120 }, durationInFrames: 50 });
  const podScale = frame >= F_5C_START ? podSpring : 0;
  const podPulse = 1 + 0.05 * Math.sin(wf / 14);

  // ---- 5C : label de la 5e ombre qui COMMENCE puis GELE a mi-chemin (echo trace avorte B1) ----
  // on trace "?" partiellement : le strokeDashoffset se fige a ~0.5.
  const ghostLabelDraw = interpolate(frame, [F_5C_START + 30, F_5C_START + 90], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  // ---- A3 : RACINES qui s'eveillent sous le tronc en 5C (enracine malgre l'extraction) ----
  // ligne de sol + 3 racines qui se tracent (strokeDashoffset) + lueurs aux bouts qui pulsent.
  const soilOp = interpolate(frame, [F_5C_START, F_5C_START + 30], [0, 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ROOTS = useMemo(() => ([
    { d: "M0 0 C-40 30 -78 44 -128 52", len: 180 },
    { d: "M0 0 C44 32 92 46 150 52", len: 200 },
    { d: "M0 4 C-10 40 -16 78 -22 120", len: 150 },
  ]), []);

  // ---- karaoke (sur mots affichables avec elisions recollees) ----
  const DISP = useMemo(() => buildDisplayWords(WHISPER_WORDS), []);
  // PHRASE_BREAKS sont en index BRUTS -> on les convertit en index DISP (1ere disp dont covers[0] >= break).
  const dispBreaks = useMemo(() => {
    return PHRASE_BREAKS.map((b) => {
      const idx = DISP.findIndex((d) => d.covers[0] >= b);
      return idx < 0 ? DISP.length : idx;
    });
  }, [DISP]);
  const activeDispIdx = DISP.findIndex((d) => t >= d.start && t < d.end);
  const refIdx = useMemo(() => {
    let r = 0;
    for (let i = 0; i < DISP.length; i++) { if (t >= DISP[i].start) r = i; }
    return r;
  }, [t, DISP]);
  const lineStart = useMemo(() => {
    let s = 0;
    for (const b of dispBreaks) { if (refIdx >= b) s = b; else break; }
    return s;
  }, [refIdx, dispBreaks]);
  const lineEnd = useMemo(() => {
    for (const b of dispBreaks) { if (b > lineStart) return b; }
    return DISP.length;
  }, [lineStart, dispBreaks]);

  // signature GeoAfrique (apparait en 5C, fade in)
  const sigOp = interpolate(frame, [F_5C_START + 40, F_5C_START + 90], [0, 0.78], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // karaoke fade en toute fin (apres l'audio, pendant la respiration)
  const karaokeOp = interpolate(frame, [792, 818], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <Audio src={staticFile("souverain/cacao-chocolat-short/audio/cacao-beat5-FINAL.mp3")} />

      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {/* FOND parchemin */}
        <rect width={1080} height={1920} fill={PARCH} />

        {/* CIEL : soleil qui pulse + rayons qui tournent (vie permanente, facon GGW) */}
        <defs>
          <radialGradient id="b5SunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f2c14e" stopOpacity={0.5} />
            <stop offset="55%" stopColor="#f2c14e" stopOpacity={0.16} />
            <stop offset="100%" stopColor="#f2c14e" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={250} cy={300} r={sunGlowR} fill="url(#b5SunGlow)" opacity={sunPulse} />
        <circle cx={250} cy={300} r={96} fill="#f2c14e" opacity={0.95} />
        <circle cx={250} cy={300} r={96} fill="none" stroke={INK} strokeWidth={3} opacity={0.4} />
        <g stroke="#f2c14e" strokeWidth={4} opacity={0.6} strokeLinecap="round">
          {Array.from({ length: 8 }, (_, k) => {
            const baseAngle = (k / 8) * Math.PI * 2 + wf / 120;
            const len = 38 + 18 * Math.sin(wf / 18 + k);
            const r0 = 108;
            const r1 = 108 + len;
            return (
              <line key={k}
                x1={250 + Math.cos(baseAngle) * r0} y1={300 + Math.sin(baseAngle) * r0}
                x2={250 + Math.cos(baseAngle) * r1} y2={300 + Math.sin(baseAngle) * r1} />
            );
          })}
        </g>

        {/* HORIZON + sol (ancrage, sobre) */}
        <path d="M0 985 C220 972 360 998 540 994 C720 990 860 974 1080 988" fill="none" stroke={INK} strokeWidth={2.4} opacity={0.5} />
        <ellipse cx={TREE_X} cy={TREE_Y + 8} rx={130} ry={20} fill={INK} opacity={0.08} />

        {/* OMBRES (origine = pied de l'arbre). z-order: SOUS l'arbre. */}
        <g transform={`translate(${TREE_X} ${TREE_Y})`}>
          {OMBRES.map((o, i) => {
            // chaque ombre s'allonge depuis 0 jusqu'a sa longueur (appear stagger)
            const grow = interpolate(frame, [o.appearF, o.appearF + 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
            if (grow <= 0.001) return null;
            // B3 : ELONGATION IRREVERSIBLE apres apparition (l'extraction ne s'arrete jamais), taux par ombre.
            const drift = interpolate(frame, [F_5B_START, 820], [1, o.drift], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const len = o.length * grow * drift;
            // B1 : path a flancs ondules (wf + phase desynchronisee)
            const d = ombrePath(o.angleDeg, len, 34, 6, wf, o.phase);
            // demi-largeur estimee du label (px) ~ 0.56 * fontSize * nbChars
            const labelW = o.label.length * 0.56 * 38;
            const lp = labelPosClamped(o.angleDeg, len, o.anchor, labelW);
            const labelOp = interpolate(grow, [0.6, 1], [0, 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            // B2 : 2 GOUTTES de valeur qui glissent du tronc vers la pointe, en boucle (la valeur coule sans retour).
            const a = (o.angleDeg * Math.PI) / 180;
            const dropletStart = F_5B_START + i * 15; // stagger par ombre, demarre quand les ombres sont la
            const drops = frame >= dropletStart ? [0, 45].map((off, di) => {
              const tt = (((frame - dropletStart + off) % 90) / 90); // 0..1 le long de l'ombre
              const dxp = Math.cos(a) * tt * len;
              const dyp = Math.sin(a) * tt * len;
              const op = interpolate(tt, [0, 0.2, 0.8, 1], [0, 0.55, 0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const rr = interpolate(tt, [0, 1], [5, 1.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return { key: di, x: dxp, y: dyp, op, rr };
            }) : [];
            return (
              <g key={i}>
                <path d={d} fill={INK} opacity={0.32} />
                {/* B2 gouttes (orientees dans l'axe de l'ombre) */}
                {drops.map((dr) => (
                  <ellipse key={dr.key} cx={dr.x} cy={dr.y} rx={dr.rr} ry={dr.rr * 0.62}
                    transform={`rotate(${o.angleDeg} ${dr.x} ${dr.y})`}
                    fill={INK} opacity={dr.op} />
                ))}
                {/* label au bout (serif encre) */}
                <text
                  x={lp.x}
                  y={lp.y}
                  fontFamily={SERIF}
                  fontSize={38}
                  fontWeight={700}
                  fill={INK}
                  opacity={labelOp}
                  textAnchor={o.anchor}
                  dominantBaseline="middle"
                >
                  {o.label}
                </text>
              </g>
            );
          })}

          {/* 5e OMBRE FANTOME (5B) : pointilles, pulse = la question sans reponse */}
          {ghostDraw > 0.001 && (() => {
            const len = GHOST.length * ghostDraw;
            const a = (GHOST.angleDeg * Math.PI) / 180;
            const ex = Math.cos(a) * len;
            const ey = Math.sin(a) * len;
            const total = GHOST.length;
            return (
              <g opacity={ghostPulse}>
                <line x1={0} y1={0} x2={ex} y2={ey}
                  stroke={INK} strokeWidth={4} strokeLinecap="round"
                  strokeDasharray="2 16"
                  opacity={0.55} />
                {/* "?" qui commence a se tracer en 5C puis GELE a mi-chemin (echo B1 avorte) */}
                {ghostLabelDraw > 0.001 && (
                  <text
                    x={Math.cos(a) * (len + 30)}
                    y={Math.sin(a) * (len + 30)}
                    fontFamily={SERIF}
                    fontSize={46}
                    fontWeight={700}
                    fill={INK}
                    opacity={0.4 + ghostLabelDraw}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    ?
                  </text>
                )}
              </g>
            );
          })()}
        </g>

        {/* A3 — RACINES (5C) : sous le tronc, se tracent + lueurs qui pulsent = enracine malgre l'extraction.
            z-order: au-dessus des ombres, SOUS l'arbre central. */}
        {soilOp > 0.001 && (
          <g transform={`translate(${TREE_X} ${TREE_Y})`}>
            {/* trait de sol (discret) */}
            <line x1={-170} y1={2} x2={175} y2={2} stroke={INK} strokeWidth={2.4} opacity={soilOp} strokeLinecap="round" />
            {ROOTS.map((r, k) => {
              const rootStart = F_5C_START + 20 + k * 30;
              const draw = interpolate(frame, [rootStart, rootStart + 90], [r.len, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
              const done = interpolate(frame, [rootStart + 70, rootStart + 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              // bout de la racine (approx = dernier point du path)
              const ends = [[-128, 52], [150, 52], [-22, 120]][k];
              const glow = 0.3 + 0.3 * Math.sin(wf / 20 + k * 0.8);
              return (
                <g key={k}>
                  <path d={r.d} fill="none" stroke={COCOA_DARK} strokeWidth={3.4} strokeLinecap="round"
                    opacity={0.75} strokeDasharray={r.len} strokeDashoffset={draw} />
                  {done > 0.01 && (
                    <>
                      {/* halo doux + lueur = noeud de vie qui pulse */}
                      <circle cx={ends[0]} cy={ends[1]} r={12} fill="#f2c14e" opacity={glow * done * 0.35} />
                      <circle cx={ends[0]} cy={ends[1]} r={6} fill="#f2c14e" opacity={(0.5 + 0.4 * Math.sin(wf / 16 + k)) * done} />
                    </>
                  )}
                </g>
              );
            })}
          </g>
        )}

        {/* ARBRE CENTRAL (en couleur = munition couleur finale) — sway permanent. z-order: AU-DESSUS des ombres. */}
        {treeGrow > 0.001 && (
          <g transform={`translate(${TREE_X} ${TREE_Y}) scale(${TREE_S})`}>
            <g transform={`rotate(${sway} 0 0)`}>
              <CacaoTree alive={treeAlive} grow={treeGrow} tone={0} />
              {/* CABOSSE qui ECLOT du tronc en 5C (spring overshoot) — pulse (vie) = l'invitation/la question */}
              {podScale > 0.001 && (
                <g transform={`translate(8 -120) scale(${podScale * podPulse})`} style={{ transformOrigin: "0px 0px" }}>
                  <ellipse cx={0} cy={0} rx={26} ry={46} fill="#a26432" stroke={INK} strokeWidth={3.4} />
                  <path d="M0 -42 L0 40 M-14 -34 C-6 -16 -6 14 -14 30 M14 -34 C6 -16 6 14 14 30"
                    fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
                  {/* glow doux autour (pulse) */}
                  <circle cx={0} cy={0} r={56} fill="#f2c14e" opacity={0.12 + 0.06 * Math.sin(wf / 14)} />
                </g>
              )}
            </g>
          </g>
        )}
      </svg>

      {/* SIGNATURE GeoAfrique (5C, comme GGW) */}
      <div style={{ position: "absolute", bottom: 60, width: "100%", textAlign: "center", opacity: sigOp, color: INK, fontFamily: SERIF, fontSize: 30, fontWeight: 700, letterSpacing: 2 }}>
        GéoAfrique
      </div>

      {/* KARAOKE word-level (pattern B1/B2/B3/B4) */}
      <div style={{ position: "absolute", bottom: 140, left: 60, right: 60, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 14px", background: "rgba(232,220,192,0.82)", border: "1px solid rgba(43,33,23,0.18)", borderRadius: 14, padding: "18px 26px", fontFamily: SERIF, fontSize: 40, lineHeight: 1.3, fontWeight: 700, opacity: karaokeOp }}>
        {DISP.slice(lineStart, lineEnd).map((w, j) => {
          if (!w.text) return null;
          const globalIdx = lineStart + j;
          const isActive = globalIdx === activeDispIdx;
          return (
            <span key={j} style={{ color: isActive ? COCOA : INK, opacity: isActive ? 1 : 0.62, transform: isActive ? "translateY(-2px)" : "none", display: "inline-block" }}>
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
