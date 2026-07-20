/**
 * DefenseGptAnimee — R&D (2026-06-21). La CLAUSE DE DEFENSE MUTUELLE de l'AES (registre tactique, GPT-5.5),
 * issue du VRAI script War-Map Sahel (Partie 3 : naissance de l'AES). ANIMEE PAR GROUPES + SFX TIMÉ.
 *
 * Approche : on decoupe le SVG body (DEFENSE_GPT) en chunks par <g id=...> (parser a profondeur, suit les <g>
 * imbriques), puis on ré-émet chaque groupe dans un <g> JSX portant opacity/transform/strokeDashoffset animés.
 * Le contenu interne reste injecte en innerHTML (fidelite du SVG GPT, zero transcription manuelle).
 *
 * Grammaire "le principe se CONSTRUIT puis se DECLENCHE" (doctrine SVG-SCENES-GENERATIVES) :
 *   f0-20   : cadre + grille + titre fade-in (le briefing s'ouvre)
 *   f20-55  : les 3 noeuds (Mali, Burkina, Niger) apparaissent en sequence (pop)
 *   f50-85  : les liens d'alliance se TRACENT (le triangle relie les 3) — stroke-dashoffset
 *   f95     : ⚡ la MENACE rouge FRAPPE le Niger (entree rapide) -> IMPACT SFX
 *   f100-140: la PROPAGATION : l'onde remonte les liens vers les 3 noeuds (solidarite instantanee)
 *   f120-160: le BOUCLIER commun OR se LEVE devant les noeuds -> montee SFX
 *
 * SFX timés (banque _shared/sfx, <Sequence from> obligatoire, plancher 0.50) :
 *   ouverture briefing · pop de chaque noeud · whoosh du trace des liens · IMPACT menace · drone propagation · montee bouclier.
 *
 * Animation = fonction de `frame` UNIQUEMENT (jamais CSS transition / @keyframes / setTimeout).
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { DEFENSE_GPT } from "./defenseBodies";

const sfx = (p: string) => staticFile(`_shared/sfx/${p}`);
const prog = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// --- decoupe le SVG en { id -> innerHTML } en suivant la profondeur des <g> ---
function splitGroups(svg: string): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /<g\s+id="([^"]+)"[^>]*>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(svg)) !== null) {
    const id = m[1];
    const start = m.index + m[0].length;
    // trouver le </g> correspondant en suivant la profondeur
    let depth = 1;
    const tag = /<g\b[^>]*>|<\/g>/g;
    tag.lastIndex = start;
    let t: RegExpExecArray | null;
    let end = svg.length;
    while ((t = tag.exec(svg)) !== null) {
      if (t[0].startsWith("</g")) depth--;
      else depth++;
      if (depth === 0) { end = t.index; break; }
    }
    out[id] = svg.slice(start, end);
  }
  return out;
}

const G = splitGroups(DEFENSE_GPT);

// un groupe injecte (innerHTML) avec transform/opacity animes en wrapper JSX
const Grp: React.FC<{ id: string; opacity?: number; transform?: string; style?: React.CSSProperties }> = ({ id, opacity = 1, transform, style }) => {
  const inner = G[id];
  if (inner === undefined) return null;
  return <g opacity={opacity} transform={transform} style={style} dangerouslySetInnerHTML={{ __html: inner }} />;
};

export const DefenseGptAnimee: React.FC = () => {
  const frame = useCurrentFrame();

  const pBrief = prog(frame, 0, 20);            // cadre+grille+titre
  const pMali = prog(frame, 20, 35);            // noeuds en sequence
  const pBurkina = prog(frame, 32, 47);
  const pNiger = prog(frame, 44, 59);
  const pLiens = prog(frame, 55, 90);           // triangle se trace
  const pMenace = prog(frame, 88, 100);         // la menace entre et frappe
  const pProp = prog(frame, 100, 140);          // onde de solidarite
  const pBouclier = prog(frame, 118, 158);      // bouclier se leve

  // trace des liens (stroke-dashoffset) : on pose un dasharray global via style sur le groupe
  const DASH = 5000;
  const liensStyle: React.CSSProperties = {
    strokeDasharray: DASH,
    strokeDashoffset: (1 - pLiens) * DASH,
  };
  // propagation : pareil, l'onde "remonte" les marqueurs en revelant le groupe
  const propStyle: React.CSSProperties = {
    strokeDasharray: DASH,
    strokeDashoffset: (1 - pProp) * DASH,
  };
  // noeuds : pop (scale via transform autour d'un centre approx) + opacity
  const pop = (p: number) => `translate(${0} ${(1 - p) * 12})`;
  // menace : entre depuis le bas-droit + petit recul a l'impact
  const menaceX = interpolate(pMenace, [0, 0.8, 1], [120, -8, 0], { extrapolateRight: "clamp" });
  const menaceY = interpolate(pMenace, [0, 0.8, 1], [120, -8, 0], { extrapolateRight: "clamp" });
  // bouclier : se leve (monte legerement + opacity)
  const bouclierY = (1 - pBouclier) * 30;

  return (
    <AbsoluteFill style={{ background: "#0b1526" }}>
      <svg viewBox="0 0 1024 1024" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <Grp id="grille" opacity={pBrief * 0.9} />
        <Grp id="cadre" opacity={pBrief} />
        <Grp id="titre" opacity={pBrief} />

        {/* liens d'alliance : se tracent pour former le triangle */}
        <Grp id="liens-alliance" opacity={prog(frame, 55, 70)} style={liensStyle} />

        {/* 3 noeuds : apparition sequentielle */}
        <Grp id="noeud-mali" opacity={pMali} transform={pop(pMali)} />
        <Grp id="noeud-burkina" opacity={pBurkina} transform={pop(pBurkina)} />
        <Grp id="noeud-niger" opacity={pNiger} transform={pop(pNiger)} />

        {/* menace : entre et frappe le Niger */}
        <Grp id="menace" opacity={prog(frame, 88, 96)} transform={`translate(${menaceX} ${menaceY})`} />

        {/* propagation : l'onde de solidarite remonte les liens */}
        <Grp id="propagation" opacity={prog(frame, 100, 112)} style={propStyle} />

        {/* bouclier commun : se leve */}
        <Grp id="bouclier" opacity={pBouclier} transform={`translate(0 ${bouclierY})`} />
      </svg>

      {/* ---- SFX TIMÉS ---- */}
      <Sequence from={0} durationInFrames={30}><Audio src={sfx("ui/whoosh.mp3")} volume={0.5} /></Sequence>
      {/* pop de chaque noeud */}
      <Sequence from={20} durationInFrames={15}><Audio src={sfx("ui/node-appear.mp3")} volume={0.5} /></Sequence>
      <Sequence from={32} durationInFrames={15}><Audio src={sfx("ui/node-appear.mp3")} volume={0.5} /></Sequence>
      <Sequence from={44} durationInFrames={15}><Audio src={sfx("ui/node-appear.mp3")} volume={0.5} /></Sequence>
      {/* trace du triangle d'alliance */}
      <Sequence from={55} durationInFrames={30}><Audio src={sfx("warmap/arrow-whoosh.mp3")} volume={0.5} /></Sequence>
      {/* ⚡ IMPACT de la menace sur le Niger */}
      <Sequence from={94} durationInFrames={45}><Audio src={sfx("warmap/boom-coup.mp3")} volume={0.6} /></Sequence>
      {/* onde de solidarite (drone grave bref) */}
      <Sequence from={100} durationInFrames={45}><Audio src={sfx("warmap/tension-drone.mp3")} volume={0.4} /></Sequence>
      {/* montee du bouclier commun -> gong de convergence */}
      <Sequence from={120} durationInFrames={60}><Audio src={sfx("warmap/liptako-gong.mp3")} volume={0.55} /></Sequence>
    </AbsoluteFill>
  );
};

export default DefenseGptAnimee;
