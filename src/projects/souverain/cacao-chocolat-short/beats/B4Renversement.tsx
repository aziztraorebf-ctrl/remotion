/**
 * Cacao -> Chocolat SHORT — BEAT 4 : RENVERSEMENT + NUANCE — 28,33s -> 850f @30fps
 *
 * Narration (timings Whisper, beat4-words.ts) :
 *   "Alors non. L'Afrique n'est pas pauvre. Elle est sous-payee pour ce qu'elle produit.
 *    [reflexif] Mais soyons honnetes : tout n'est pas la faute de l'exterieur. Une partie du probleme vient
 *    aussi du dedans — la transformation se fait ailleurs, et trop de revenus se perdent en route.
 *    [serieux] Les choses commencent a bouger : la Cote d'Ivoire veut transformer tout son cacao chez elle
 *    d'ici deux mille trente. Mais le combat est loin d'etre gagne."
 *
 * 3 SOUS-SCENES (1 audio -> 3 phases, decoupage VISUEL au storyboard) :
 *   - 4A CLIMAX   f0-372   "pas pauvre / sous-payee" -> le VERGER de B3 REVERDIT en cascade DEPUIS les 2 survivants.
 *   - 4B NUANCE   f372-642 "vient du dedans / revenus se perdent" -> FISSURE d'encre fend le sol, la vie se ternit.
 *   - 4C ESPOIR   f642-850 "la CI veut transformer d'ici 2030" -> USINE se construit (sobre, combat pas gagne).
 *
 * Transition 4B->4C : 2 VERSIONS comparables via prop transitionMode ("fade" | "lien").
 *   - "fade" : fondu franc entre le verger fissure et l'usine.
 *   - "lien" : la fissure du verger DEVIENT le sol d'ou nait l'usine (du probleme interne nait la solution interne).
 *
 * Fil continu : MEME verger que B3 (VergerCacao). MEME tablette (les tablettes qui sortent de l'usine = echo B1/B3).
 * Registre encre. Munition couleur (climax = LE moment couleur le plus fort). Karaoke word-level brun chocolat.
 */
import React, { useMemo } from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { VergerCacao } from "../components/VergerCacao";
import { UsineConstruction } from "../components/UsineConstruction";
import { WHISPER_WORDS } from "../audio/beat4-words";

export const B4_RENVERSEMENT_FPS = 30;
// 850f = duree audio (28,33s) + 60f (2s) de RESPIRATION usine en fin (l'usine tourne, fumee/chocolat/soleil,
// la musique couvrira ce silence a l'assemblage). Total 910f.
export const B4_RENVERSEMENT_FRAMES = 910;

const PARCH = "#e8dcc0";
const INK = "#2b2117";
const COCOA = "#6b4423";
const SERIF = "Georgia, 'Times New Roman', serif";
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

// ---- Phases (frames) ----
const F_4B_START = 372; // ~"du dedans" (12.46s)
const F_4C_START = 642; // ~"la Cote d'Ivoire" (21.0s)

// ordre de cascade de reverdissement : depuis les 2 survivants (#13 avant, #7 milieu) vers les voisins (par distance).
// indices tries par proximite croissante aux survivants (approx, pour un reverdissement narratif).
const CASCADE_ORDER = [13, 7, 11, 9, 12, 10, 8, 6, 5, 4, 3, 2, 1, 0];

// micro-lignes karaoke (regroupees par phrase)
const PHRASE_BREAKS = [9, 17, 30, 37, 51, 56, 70];

export const B4Renversement: React.FC<{ transitionMode?: "fade" | "lien" }> = ({ transitionMode = "lien" }) => {
  const frame = useCurrentFrame();
  const t = frame / B4_RENVERSEMENT_FPS;

  // ---- 4A : reverdissement en cascade depuis les survivants ----
  const greenProgress = useMemo(() => {
    const arr = new Array(14).fill(0);
    CASCADE_ORDER.forEach((treeIdx, rank) => {
      // les 2 premiers (survivants) sont deja verts au depart ; les autres s'allument en cascade
      const d = rank === 0 || rank === 1 ? 0 : 60 + rank * 18;
      arr[treeIdx] = interpolate(frame, [d, d + 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
    });
    return arr;
  }, [frame]);

  // ---- 4B : fissure (se trace) + leger ternissement ----
  const crackProgress = interpolate(frame, [F_4B_START, F_4B_START + 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  // ---- transition verger -> usine ----
  // verger present 4A+4B, fade pendant la transition vers 4C
  const vergerOpacity = interpolate(frame, [F_4C_START - 30, F_4C_START + 40], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vergerAlive = frame < F_4C_START + 45;

  // usine : build + colorize + chocOut (4C)
  const usineBuild = interpolate(frame, [F_4C_START, F_4C_START + 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const usineColorize = interpolate(frame, [F_4C_START + 60, F_4C_START + 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const usineChocOut = interpolate(frame, [F_4C_START + 120, 850], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const usineOpacity = interpolate(frame, [F_4C_START - 10, F_4C_START + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const usineAlive = frame >= F_4C_START - 10;
  // mode "lien" : l'usine nait du centre (la fissure devient le sol). mode "fade" : simple fondu.
  const groundFromCrack = transitionMode === "lien" ? interpolate(frame, [F_4C_START, F_4C_START + 50], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  // soleil / vent (vie permanente)
  const sunRise = 1; // deja leve (suite de B3)
  const sway = 0.6;

  // ---- karaoke ----
  const activeWordIdx = WHISPER_WORDS.findIndex((w) => t >= w.start && t < w.end);
  const refIdx = useMemo(() => {
    let r = 0;
    for (let i = 0; i < WHISPER_WORDS.length; i++) { if (t >= WHISPER_WORDS[i].start) r = i; }
    return r;
  }, [t]);
  const lineStart = useMemo(() => {
    let s = 0;
    for (const b of PHRASE_BREAKS) { if (refIdx >= b) s = b; else break; }
    return s;
  }, [refIdx]);
  const lineEnd = useMemo(() => {
    for (const b of PHRASE_BREAKS) { if (b > lineStart) return b; }
    return WHISPER_WORDS.length;
  }, [lineStart]);

  // micro-source (sur le claim final)
  const srcOp = interpolate(frame, [F_4C_START + 60, F_4C_START + 76, 880, 910], [0, 0.7, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <Audio src={staticFile("souverain/cacao-chocolat-short/audio/cacao-beat4-FINAL.mp3")} />

      {/* VERGER (4A reverdit + 4B fissure) */}
      {vergerAlive && (
        <AbsoluteFill style={{ opacity: vergerOpacity }}>
          <VergerCacao
            greenProgress={greenProgress}
            crackProgress={crackProgress}
            sway={sway}
            sunRise={sunRise}
            windPhase={frame}
          />
        </AbsoluteFill>
      )}

      {/* USINE (4C) */}
      {usineAlive && (
        <AbsoluteFill style={{ opacity: usineOpacity }}>
          <UsineConstruction
            build={usineBuild}
            colorize={usineColorize}
            chocOut={usineChocOut}
            windPhase={frame}
            groundFromCrack={groundFromCrack}
          />
        </AbsoluteFill>
      )}

      {/* MICRO-SOURCE (4C) */}
      {srcOp > 0.01 && (
        <div style={{ position: "absolute", bottom: 60, width: "100%", textAlign: "center", opacity: srcOp, color: INK, fontFamily: SERIF, fontSize: 26, fontStyle: "italic" }}>
          Objectif transformation locale CI — d'ici 2030
        </div>
      )}

      {/* KARAOKE word-level (pattern B1/B2/B3) — fade en fin (apres l'audio, pendant la respiration usine) */}
      <div style={{ position: "absolute", bottom: 150, left: 60, right: 60, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 14px", background: "rgba(232,220,192,0.82)", border: "1px solid rgba(43,33,23,0.18)", borderRadius: 14, padding: "18px 26px", fontFamily: SERIF, fontSize: 40, lineHeight: 1.3, fontWeight: 700, opacity: interpolate(frame, [840, 868], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        {WHISPER_WORDS.slice(lineStart, lineEnd).map((w, j) => {
          const globalIdx = lineStart + j;
          const isActive = globalIdx === activeWordIdx;
          return (
            <span key={j} style={{ color: isActive ? COCOA : INK, opacity: isActive ? 1 : 0.62, transform: isActive ? "translateY(-2px)" : "none", display: "inline-block" }}>
              {w.word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// previews des 2 transitions
export const B4Lien: React.FC = () => <B4Renversement transitionMode="lien" />;
export const B4Fade: React.FC = () => <B4Renversement transitionMode="fade" />;
