/**
 * Cacao -> Chocolat SHORT — BEAT 3 : L'EXTRACTION, LE CHIFFRE — 19,13s -> 574f @30fps
 *
 * Narration (timings Whisper word-level, cacao-beat3-words.ts) :
 *   "Mais voila ce qu'on ne montre jamais. Sur le prix d'une tablette, le paysan qui cultive le cacao
 *    touche moins de dix pour cent. Le reste — la fortune — se gagne ailleurs. Le Ghana produit un septieme
 *    du cacao de la planete... et ne recoit, selon Oxfam, qu'un et demi pour cent d'une industrie qui pese
 *    cent trente milliards."
 *
 * DECOUPAGE (1 chiffre = 1 support, doctrine cacao) :
 *   - f0-90    CABOSSE s'ouvre (transition B2->B3 : territoire -> matiere cacao). "Mais voila ce qu'on ne montre jamais."
 *   - f90-310  TABLETTE B1 revient -> MORPHE en barre 6/94. Porte "le paysan touche moins de 10%".
 *              "tablette" dit a 3.22s=f97 · "moins de 10" 5.9-7.3s=f177-219 -> barre s'illumine.
 *              + geste "valeur qui fuit" vers les marques (94%).
 *   - f310-450 VERGER s'eveille (cascade) puis 2/14 se colorisent. "Le Ghana produit un septieme" (11.66s=f350).
 *   - f450-574 CHAPEAU apparait + sway leger. "selon Oxfam" (14.98s=f449). Micro-source Oxfam.
 *
 * Registre ENCRE NARRATIVE. Munition couleur (brun-vie = evenement). Karaoke word-level brun chocolat.
 * Audio-derived timing. Objets inertes (tablette/cabosse/champ) = pas de glissement (sauf le morphing = transformation).
 */
import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  Easing,
} from "remotion";
import { VergerCacao, VIVANTS_B3 } from "../components/VergerCacao";
import { CabosseOuverture } from "../components/CabosseOuverture";
import { TabletteMorphBarre } from "../components/TabletteMorphBarre";

export const B3_EXTRACTION_FPS = 30;
export const B3_EXTRACTION_FRAMES = 574;

const W = 1080;
const H = 1920;
const PARCH = "#e8dcc0";
const INK = "#2b2117";
const COCOA = "#6b4423";
const SERIF = "Georgia, 'Times New Roman', serif";
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

// ---- Phases (frames) ----
const F_CABOSSE_IN = 0;
const F_CABOSSE_OUT = 96;
const F_MORPH_IN = 90; // tablette apparait (~"tablette" f97)
const F_MORPH_START = 175; // commence a morpher (on SAVOURE la tablette carreaux+croix avant — ~"moins de 10" f177)
const F_MORPH_DONE = 240; // barre 6/94 complete
const F_MORPH_OUT = 272; // tablette/barre fade (AVANT le verger, pas de chevauchement)
const F_VERGER_IN = 300; // verger s'eveille
const F_VERGER_FULL = 360; // les 14 apparus
const F_GREEN_START = 348; // 2/14 se colorisent (~"un septieme" f350)
const F_GREEN_DONE = 430;
const F_HAT = 449; // chapeau (~"Oxfam")

// ---- Karaoke word-level (timings Whisper cacao-beat3-words.ts) ----
type W3 = { word: string; start: number; end: number };
const WORDS: W3[] = [
  { word: "Mais", start: 0.0, end: 0.24 }, { word: "voilà", start: 0.24, end: 0.54 },
  { word: "ce", start: 0.54, end: 0.76 }, { word: "qu'on", start: 0.76, end: 0.88 },
  { word: "ne", start: 0.88, end: 1.16 }, { word: "montre", start: 1.16, end: 1.26 },
  { word: "jamais.", start: 1.26, end: 1.72 },
  { word: "Sur", start: 2.74, end: 2.74 }, { word: "le", start: 2.74, end: 2.98 },
  { word: "prix", start: 2.98, end: 3.02 }, { word: "d'une", start: 3.02, end: 3.22 },
  { word: "tablette,", start: 3.22, end: 3.78 }, { word: "le", start: 3.98, end: 4.12 },
  { word: "paysan", start: 4.12, end: 4.48 }, { word: "qui", start: 4.48, end: 4.8 },
  { word: "cultive", start: 4.8, end: 5.0 }, { word: "le", start: 5.0, end: 5.34 },
  { word: "cacao", start: 5.34, end: 5.54 }, { word: "touche", start: 5.54, end: 5.9 },
  { word: "moins", start: 5.9, end: 6.1 }, { word: "de", start: 6.1, end: 6.32 },
  { word: "dix", start: 6.32, end: 7.3 }, { word: "pour cent.", start: 7.3, end: 7.7 },
  { word: "Le", start: 7.3, end: 7.7 }, { word: "reste", start: 7.7, end: 8.02 },
  { word: "la", start: 8.22, end: 8.42 }, { word: "fortune", start: 8.42, end: 8.84 },
  { word: "se", start: 9.14, end: 9.48 }, { word: "gagne", start: 9.48, end: 9.5 },
  { word: "ailleurs.", start: 9.5, end: 9.9 },
  { word: "Le", start: 10.78, end: 10.86 }, { word: "Ghana", start: 10.86, end: 11.1 },
  { word: "produit", start: 11.1, end: 11.5 }, { word: "un", start: 11.5, end: 11.66 },
  { word: "septième", start: 11.66, end: 12.02 }, { word: "du", start: 12.02, end: 12.28 },
  { word: "cacao", start: 12.28, end: 12.5 }, { word: "de la planète...", start: 12.5, end: 13.4 },
  { word: "et", start: 13.4, end: 13.92 }, { word: "ne", start: 13.92, end: 14.28 },
  { word: "reçoit,", start: 14.28, end: 14.54 }, { word: "selon", start: 14.84, end: 14.98 },
  { word: "Oxfam,", start: 14.98, end: 15.48 }, { word: "qu'un", start: 16.02, end: 16.08 },
  { word: "et", start: 16.08, end: 16.2 }, { word: "demi", start: 16.2, end: 16.46 },
  { word: "pour cent", start: 16.46, end: 16.78 }, { word: "d'une", start: 16.78, end: 17.04 },
  { word: "industrie", start: 17.04, end: 17.5 }, { word: "qui", start: 17.5, end: 18.02 },
  { word: "pèse", start: 18.02, end: 18.02 }, { word: "cent trente", start: 18.02, end: 18.64 },
  { word: "milliards.", start: 18.64, end: 19.04 },
];
// regroupement en lignes courtes (max ~5 mots affiches a la fois)
const PHRASE_BREAKS = [7, 13, 23, 31, 38, 44, 53];

// ---- Micro-sources timees (sur le claim) ----
const SOURCES = [
  { text: "Paysan < 10% du prix final — FAO/BASIC", from: 180, to: 300 },
  { text: "Ghana ~1,5% — Oxfam", from: 452, to: 574 },
];

export const B3Extraction: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = B3_EXTRACTION_FPS;
  const t = frame / fps; // temps en secondes (pour le karaoke)

  // ---- progressions ----
  const cabosseProg = interpolate(frame, [F_CABOSSE_IN, F_CABOSSE_OUT], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cabosseAlive = frame <= F_CABOSSE_OUT + 6;

  // tablette : apparition (opacity) + morphing (progress) + fade out
  const tabletteOpIn = interpolate(frame, [F_MORPH_IN, F_MORPH_IN + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tabletteOpOut = interpolate(frame, [F_MORPH_OUT, F_MORPH_OUT + 22], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tabletteOp = Math.min(tabletteOpIn, tabletteOpOut);
  const morphProg = interpolate(frame, [F_MORPH_START, F_MORPH_DONE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const tabletteAlive = frame >= F_MORPH_IN && frame <= F_MORPH_OUT + 32;

  // verger : apparition par arbre (cascade depuis le fond) + colorisation 2/14
  const appearProgress = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      // les arbres du fond apparaissent d'abord (index 0..13 = fond->avant), stagger
      const d = F_VERGER_IN + i * 4;
      return interpolate(frame, [d, d + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
    });
  }, [frame]);

  const greenProgress = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      if (!VIVANTS_B3.includes(i)) return 0;
      // les 2 vivants se colorisent a ~0.5s d'ecart (l'oeil compte 2/14)
      const order = VIVANTS_B3.indexOf(i);
      const d = F_GREEN_START + order * 16;
      return interpolate(frame, [d, d + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
    });
  }, [frame]);

  const hatProgress = interpolate(frame, [F_HAT, F_HAT + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const vergerAlive = frame >= F_VERGER_IN;
  const sway = frame >= F_GREEN_DONE ? interpolate(frame, [F_GREEN_DONE, F_GREEN_DONE + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  // soleil qui SE LEVE au moment ou le verger s'eveille (vie qui revient)
  const sunRise = interpolate(frame, [F_VERGER_IN, F_VERGER_IN + 90], [0.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  // MICRO-VIE racinaire : s'eveille pendant le silence audio (f296-326) PUIS s'efface
  // (les arbres ont pousse, les racines ont fait leur travail — sinon elles parasitent sous le chapeau).
  const rootLife = interpolate(frame, [296, 330, 360, 400], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  // ---- karaoke : mot actif (pendant un silence, on garde le DERNIER mot prononce) ----
  let activeWordIdx = WORDS.findIndex((w) => t >= w.start && t < w.end);
  // index de reference pour la ligne : dernier mot dont le start est passe (stable en silence)
  const refIdx = useMemo(() => {
    let r = 0;
    for (let i = 0; i < WORDS.length; i++) { if (t >= WORDS[i].start) r = i; }
    return r;
  }, [t]);
  // ligne courante (selon les breaks) — basee sur refIdx (jamais ne retombe a 0 en silence)
  const lineStart = useMemo(() => {
    let s = 0;
    for (const b of PHRASE_BREAKS) { if (refIdx >= b) s = b; else break; }
    return s;
  }, [refIdx]);
  const lineEnd = useMemo(() => {
    for (const b of PHRASE_BREAKS) { if (b > lineStart) return b; }
    return WORDS.length;
  }, [lineStart]);

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <Audio src={staticFile("souverain/cacao-chocolat-short/audio/cacao-beat3-FINAL.mp3")} />

      {/* VERGER (fond, apparait en derniere phase) — micro-zoom TRES lent (la scene respire, pas de parallaxe 3D) */}
      {vergerAlive && (
        <AbsoluteFill style={{ transform: `scale(${1 + interpolate(frame, [F_VERGER_IN, 574], [0, 0.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`, transformOrigin: "50% 62%" }}>
          <VergerCacao
            greenProgress={greenProgress}
            appearProgress={appearProgress}
            hatProgress={hatProgress}
            sway={sway}
            sunRise={sunRise}
            rootLife={rootLife}
            windPhase={frame}
          />
        </AbsoluteFill>
      )}

      {/* CABOSSE (transition d'entree) — agrandie (plus presente, pivot centre ecran) */}
      {cabosseAlive && (
        <AbsoluteFill>
          <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
            <g transform="translate(540 900) scale(1.7) translate(-540 -900)">
              <CabosseOuverture progress={cabosseProg} />
            </g>
          </svg>
        </AbsoluteFill>
      )}

      {/* FEVES QUI TOMBENT (cabosse -> champ) : les feves de la cabosse chutent et "ensemencent" le sol
          quand le verger apparait (transition liee, organique). Frames F_VERGER_IN-30 -> F_VERGER_FULL. */}
      {frame >= F_VERGER_IN - 40 && frame <= F_VERGER_FULL + 10 && (
        <AbsoluteFill>
          <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
            {[
              { x0: 540, y0: 870, x1: 380, y1: 1560 },
              { x0: 500, y0: 900, x1: 690, y1: 1300 },
              { x0: 580, y0: 900, x1: 540, y1: 1335 },
              { x0: 520, y0: 940, x1: 210, y1: 1180 },
              { x0: 560, y0: 940, x1: 838, y1: 1185 },
            ].map((b, i) => {
              const d = F_VERGER_IN - 40 + i * 5;
              const p = interpolate(frame, [d, d + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0.6, 0.6, 1) });
              if (p <= 0 || p >= 1) return null;
              const x = b.x0 + (b.x1 - b.x0) * p;
              const y = b.y0 + (b.y1 - b.y0) * p * p; // chute acceleree (gravite)
              const op = interpolate(p, [0, 0.1, 0.85, 1], [0, 1, 1, 0]);
              // SQUASH & STRETCH : etire en chute (p<0.85), ecrase a l'impact (p>0.85)
              const impact = p > 0.85 ? (p - 0.85) / 0.15 : 0;
              const stretch = 1 + p * 0.25 - impact * 0.5; // s'allonge en tombant, s'ecrase a l'arrivee
              const squash = 1 - p * 0.1 + impact * 0.4;
              return <ellipse key={i} cx={x} cy={y} rx={14 * squash} ry={22 * stretch} transform={`rotate(${p * 180} ${x} ${y})`} fill="#6b3e22" stroke={INK} strokeWidth={2} opacity={op} />;
            })}
          </svg>
        </AbsoluteFill>
      )}

      {/* TABLETTE -> BARRE (morphing) */}
      {tabletteAlive && (
        <AbsoluteFill style={{ opacity: tabletteOp }}>
          <TabletteMorphBarre progress={morphProg} />
        </AbsoluteFill>
      )}

      {/* MICRO-SOURCES timees (bas, encre) */}
      {SOURCES.map((s, i) => {
        const op = interpolate(frame, [s.from, s.from + 16, s.to - 16, s.to], [0, 0.7, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (op <= 0.01) return null;
        return (
          <div key={i} style={{ position: "absolute", bottom: 60, width: "100%", textAlign: "center", opacity: op, color: INK, fontFamily: SERIF, fontSize: 26, fontStyle: "italic" }}>
            {s.text}
          </div>
        );
      })}

      {/* KARAOKE word-level — MEME PATTERN que B1/B2 (fond parchemin, bordure, radius, SERIF 40 bold) */}
      <div
        style={{
          position: "absolute",
          bottom: 150,
          left: 60,
          right: 60,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 14px",
          background: "rgba(232,220,192,0.82)",
          border: "1px solid rgba(43,33,23,0.18)",
          borderRadius: 14,
          padding: "18px 26px",
          fontFamily: SERIF,
          fontSize: 40,
          lineHeight: 1.3,
          fontWeight: 700,
        }}
      >
        {WORDS.slice(lineStart, lineEnd).map((w, j) => {
          const globalIdx = lineStart + j;
          const isActive = globalIdx === activeWordIdx;
          return (
            <span
              key={j}
              style={{
                color: isActive ? COCOA : INK,
                opacity: isActive ? 1 : 0.62,
                transform: isActive ? "translateY(-2px)" : "none",
                display: "inline-block",
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
