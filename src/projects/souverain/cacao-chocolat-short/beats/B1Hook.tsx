import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Cacao -> Chocolat SHORT — BEAT 1 HOOK (paradoxe). VERSION A — FOCUS PUR TABLETTE (validee Aziz).
// Audio: public/souverain/cacao-chocolat-short/audio/cacao-beat1-FINAL.mp3 (12,167s -> 365f @30).
// Voix : "Le meilleur chocolat du monde vient de Suisse. Sauf qu'en Suisse, il n'y a pas un seul cacaoyer.
//         Des montagnes, de la neige, un savoir-faire de luxe... mais pas un gramme de cacao qui y pousse."
//
// AJUSTEMENTS (Aziz 2026-06-28) :
//   1. CROIX SUISSE REVELEE PAR MASQUE (plus de pop) : apres colorisation, le brun s'EFFACE depuis le centre
//      (cercle de masque qui grandit) pour reveler le carre ROUGE + croix BLANCHE dessous. "Deja DANS le chocolat".
//      100% encre/plat, PAS de flip 3D. Se revele APRES la fin du tracé+colorisation (~f300+).
//   2. STAGGER tracé : CONTOUR d'abord, PUIS quadrillage interne en leger decalage. Easing.bezier(0.4,0,0.2,1).
//   3. KARAOKE word-level (grammaire B2) : mot actif = BRUN CHOCOLAT #6b4423, reste encre attenue. Bas, parchemin.
//   4. LAYOUT : tablette remontee (CY) + titre remonte pour laisser la place au karaoke. Aucun chevauchement.
// Registre encre #2b2117 / parchemin #e8dcc0. Colorisation + glow = evenement sobre.

export const B1_HOOK_FPS = 30;
export const B1_HOOK_FRAMES = 365;

// ── Palette ──────────────────────────────────────────────────────────────────
const INK = "#2b2117";
const PARCH = "#e8dcc0";
const COCOA = "#6b4423";
const COCOA_DARK = "#4a2c14";
const SWISS_RED = "#c8202f";
const SERIF = "Georgia, 'Times New Roman', serif";

// ── Easing doux partagé (accel puis decel) ───────────────────────────────────
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

// ── Timeline (fps=30, 365f) ──────────────────────────────────────────────────
// CONTOUR : f4 -> f200 · QUADRILLAGE (stagger) : f60 -> f300 · COLORISATION clip : f30 -> f300
// (tracé+colorisation finissent ENSEMBLE ~f300) · CROIX revelee par masque : f306+.
const F_OUTLINE_START = 4;
const F_OUTLINE_END = 200; // contour fini avant le quadrillage
const F_GRID_START = 60; // quadrillage demarre en leger decalage (stagger)
const F_GRID_END = 300;
const F_COLOR_START = 30;
const F_COLOR_END = 300; // colorisation finit avec le tracé
const F_GLOW_START = 80;
const F_CROSS_REVEAL = 306; // croix suisse embossee (rebond) apparait APRES la composition

const F_TITLE_IN = 26;
const F_TITLE_OUT = 78; //  titre present ~2-3s puis fade out (in f26->~40, out f78->104)

// ── Tablette : ~68% largeur, REMONTEE pour laisser la place au karaoke en bas ─
const CX = 540;
const CY = 850; // centre vertical remonte (etait 980) -> degage le tiers inferieur pour le karaoke
const BAR_W = 736; // ~68% de 1080
const BAR_H = 860;
const COLS = 4;
const ROWS = 6;

// geometrie face avant (parallelogramme perspective douce)
const xL = CX - BAR_W / 2;
const xR = CX + BAR_W / 2;
const yT = CY - BAR_H / 2;
const yB = CY + BAR_H / 2;
const SKEW = 28;
const DEPTH = 38;
const TLX = xL,
  TLY = yT + SKEW;
const TRX = xR,
  TRY = yT;
const BRX = xR,
  BRY = yB;
const BLX = xL,
  BLY = yB + SKEW;
const DRAW_TOP = TRY;
const DRAW_BOT = BLY + DEPTH;

const crossCx = TLX + ((TRX - TLX) / COLS) * 2.0;
const crossCy = TRY + ((BRY - TRY) / ROWS) * 2.5 + SKEW * 0.5;

const easedClamp = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

// ── GLOW radial doux qui respire ─────────────────────────────────────────────
const TabletGlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const on = interpolate(frame, [F_GLOW_START, F_COLOR_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const breathe = 0.82 + 0.18 * Math.sin((frame - F_GLOW_START) / (fps * 0.5));
  const op = on * 0.3 * breathe;
  if (op <= 0.001) return null;
  return (
    <g>
      <defs>
        <radialGradient id="tabletGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#b87d34" stopOpacity={0.9} />
          <stop offset="45%" stopColor="#8a5a23" stopOpacity={0.45} />
          <stop offset="100%" stopColor="#8a5a23" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse
        cx={CX}
        cy={CY + 24}
        rx={BAR_W * 0.82}
        ry={BAR_H * 0.66}
        fill="url(#tabletGlow)"
        opacity={op}
        style={{ filter: "blur(30px)" }}
      />
    </g>
  );
};

// ── TABLETTE : stagger contour/quadrillage + colorisation clip + croix embossee (rebond) ─
const ChocolateBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // tracé STAGGER : contour d'abord, quadrillage ensuite (easing doux sur chacun)
  const outlineProg = easedClamp(frame, F_OUTLINE_START, F_OUTLINE_END);
  const gridProg = easedClamp(frame, F_GRID_START, F_GRID_END);
  const colorProg = easedClamp(frame, F_COLOR_START, F_COLOR_END);

  const LO = 3400; // longueur de dash contour
  const LG = 3400; // longueur de dash quadrillage
  const outlineOff = (1 - outlineProg) * LO;
  const gridOff = (1 - gridProg) * LG;

  // clip de colorisation : rectangle qui descend de DRAW_TOP a DRAW_BOT
  const clipBottom = DRAW_TOP + (DRAW_BOT - DRAW_TOP) * colorProg;
  const clipH = Math.max(0, clipBottom - DRAW_TOP);

  // CROIX SUISSE EMBOSSEE qui arrive APRES la composition, avec un petit REBOND (spring overshoot scale).
  const crossSpring = spring({
    frame: frame - F_CROSS_REVEAL,
    fps,
    config: { damping: 9, stiffness: 170, mass: 0.7 },
  });
  const crossScale = frame >= F_CROSS_REVEAL ? crossSpring : 0;
  const crossOp = interpolate(frame, [F_CROSS_REVEAL, F_CROSS_REVEAL + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cs = 104;
  const arm = cs * 0.62;
  const aw = cs * 0.24;

  // sillons
  const vlines: string[] = [];
  for (let c = 1; c < COLS; c++) {
    const tx = TLX + (TRX - TLX) * (c / COLS);
    const tyTop = TLY + (TRY - TLY) * (c / COLS);
    const bx = BLX + (BRX - BLX) * (c / COLS);
    const byBot = BLY + (BRY - BLY) * (c / COLS);
    vlines.push(`M ${tx} ${tyTop} L ${bx} ${byBot}`);
  }
  const hlines: string[] = [];
  for (let r = 1; r < ROWS; r++) {
    const lx = TLX + (BLX - TLX) * (r / ROWS);
    const ly = TLY + (BLY - TLY) * (r / ROWS);
    const rx = TRX + (BRX - TRX) * (r / ROWS);
    const ry = TRY + (BRY - TRY) * (r / ROWS);
    hlines.push(`M ${lx} ${ly} L ${rx} ${ry}`);
  }

  return (
    <g stroke={INK} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        {/* clip qui revele la couleur de haut en bas (synchronise au tracé) */}
        <clipPath id="colorReveal">
          <rect x={TLX - DEPTH - 20} y={DRAW_TOP} width={BAR_W + DEPTH * 2 + 40} height={clipH} />
        </clipPath>
      </defs>

      {/* COULEUR (faces remplies) — revelee par le clip descendant (synchronise au tracé) */}
      <g clipPath="url(#colorReveal)">
        <path
          d={`M ${TRX} ${TRY} L ${TRX + DEPTH} ${TRY + DEPTH} L ${BRX + DEPTH} ${BRY + DEPTH} L ${BRX} ${BRY} Z`}
          fill={COCOA_DARK}
          stroke="none"
        />
        <path
          d={`M ${BRX} ${BRY} L ${BRX + DEPTH} ${BRY + DEPTH} L ${BLX + DEPTH} ${BLY + DEPTH} L ${BLX} ${BLY} Z`}
          fill={COCOA_DARK}
          stroke="none"
        />
        <path
          d={`M ${TLX} ${TLY} L ${TRX} ${TRY} L ${BRX} ${BRY} L ${BLX} ${BLY} Z`}
          fill={COCOA}
          stroke="none"
        />
      </g>

      {/* CONTOUR EXTERIEUR + faces 3D — se-dessine en premier */}
      <g style={{ strokeDasharray: LO, strokeDashoffset: outlineOff }}>
        <path
          d={`M ${TRX} ${TRY} L ${TRX + DEPTH} ${TRY + DEPTH} L ${BRX + DEPTH} ${BRY + DEPTH} L ${BRX} ${BRY} Z`}
          strokeWidth={3.4}
        />
        <path
          d={`M ${BRX} ${BRY} L ${BRX + DEPTH} ${BRY + DEPTH} L ${BLX + DEPTH} ${BLY + DEPTH} L ${BLX} ${BLY} Z`}
          strokeWidth={3.4}
        />
        <path d={`M ${TLX} ${TLY} L ${TRX} ${TRY} L ${BRX} ${BRY} L ${BLX} ${BLY} Z`} strokeWidth={3.4} />
      </g>

      {/* QUADRILLAGE INTERNE — se-dessine en leger decalage (stagger) */}
      <g strokeWidth={2.4} style={{ strokeDasharray: LG, strokeDashoffset: gridOff }}>
        {vlines.map((d, i) => (
          <path key={`v${i}`} d={d} />
        ))}
        {hlines.map((d, i) => (
          <path key={`h${i}`} d={d} />
        ))}
      </g>
      <g strokeWidth={1.4} opacity={0.5} style={{ strokeDasharray: LG, strokeDashoffset: gridOff }}>
        {hlines.map((d, i) => (
          <path key={`hs${i}`} d={d} transform="translate(2 6)" />
        ))}
      </g>

      {/* EMBLEME SUISSE EMBOSSE rouge — APRES la composition, avec rebond (scale spring) */}
      <g
        opacity={crossOp}
        transform={`translate(${crossCx} ${crossCy}) scale(${crossScale}) translate(${-crossCx} ${-crossCy})`}
      >
        {/* carre rouge plein */}
        <rect
          x={crossCx - cs / 2}
          y={crossCy - cs / 2}
          width={cs}
          height={cs}
          rx={8}
          fill={SWISS_RED}
          stroke={INK}
          strokeWidth={2.6}
        />
        {/* ombre interne = effet "en creux" / embosse (trait fonce haut-gauche) */}
        <path
          d={`M ${crossCx - cs / 2 + 3} ${crossCy + cs / 2 - 3} L ${crossCx - cs / 2 + 3} ${crossCy - cs / 2 + 3} L ${crossCx + cs / 2 - 3} ${crossCy - cs / 2 + 3}`}
          stroke={COCOA_DARK}
          strokeWidth={2.8}
          opacity={0.7}
        />
        {/* croix blanche en reserve */}
        <path
          d={`M ${crossCx - aw} ${crossCy - arm}
              L ${crossCx + aw} ${crossCy - arm}
              L ${crossCx + aw} ${crossCy - aw}
              L ${crossCx + arm} ${crossCy - aw}
              L ${crossCx + arm} ${crossCy + aw}
              L ${crossCx + aw} ${crossCy + aw}
              L ${crossCx + aw} ${crossCy + arm}
              L ${crossCx - aw} ${crossCy + arm}
              L ${crossCx - aw} ${crossCy + aw}
              L ${crossCx - arm} ${crossCy + aw}
              L ${crossCx - arm} ${crossCy - aw}
              L ${crossCx - aw} ${crossCy - aw} Z`}
          fill={PARCH}
          stroke="none"
        />
      </g>
    </g>
  );
};

// ── TITRE qui DISPARAIT (present ~2-3s) ──────────────────────────────────────
const HookTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ frame: frame - F_TITLE_IN, fps, config: { damping: 200, stiffness: 90 } });
  const fade = interpolate(frame, [F_TITLE_OUT, F_TITLE_OUT + 24], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const op = appear * fade;
  if (op <= 0.001) return null;
  const y = interpolate(appear, [0, 1], [22, 0]);
  return (
    <div
      style={{
        position: "absolute",
        top: 56,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: op,
        transform: `translateY(${y}px)`,
      }}
    >
      <p
        style={{
          fontFamily: SERIF,
          fontSize: 66,
          fontWeight: 700,
          color: INK,
          margin: 0,
          letterSpacing: "0.01em",
          lineHeight: 1.12,
          padding: "0 70px",
        }}
      >
        Le chocolat suisse
        <br />
        n&apos;existe pas
      </p>
      <div
        style={{
          margin: "18px auto 0",
          width: interpolate(appear, [0, 1], [0, 280]),
          height: 3,
          backgroundColor: INK,
          opacity: 0.8,
        }}
      />
    </div>
  );
};

// ── KARAOKE word-level (grammaire B2 : mot actif BRUN CHOCOLAT) ───────────────
// Timestamps Whisper (out/episodes/.../cacao-beat1-words.json), fragments regroupes en mots affichables
// avec accents FR corrects. {word, start, end} en secondes.
type Word = { word: string; start: number; end: number };
const WORDS: Word[] = [
  { word: "Le", start: 0.0, end: 0.32 },
  { word: "meilleur", start: 0.32, end: 0.64 },
  { word: "chocolat", start: 0.64, end: 1.12 },
  { word: "du", start: 1.12, end: 1.6 },
  { word: "monde", start: 1.6, end: 1.6 },
  { word: "vient", start: 1.6, end: 1.74 },
  { word: "de", start: 1.74, end: 2.02 },
  { word: "Suisse.", start: 2.02, end: 2.34 },
  { word: "Sauf", start: 2.34, end: 3.16 },
  { word: "qu'en", start: 3.16, end: 3.34 },
  { word: "Suisse,", start: 3.34, end: 3.66 },
  { word: "il", start: 3.66, end: 4.0 },
  { word: "n'y", start: 4.0, end: 4.1 },
  { word: "a", start: 4.1, end: 4.2 },
  { word: "pas", start: 4.2, end: 4.44 },
  { word: "un", start: 4.44, end: 4.7 },
  { word: "seul", start: 4.7, end: 4.9 },
  { word: "cacaoyer.", start: 4.9, end: 5.82 },
  { word: "Des", start: 6.94, end: 6.94 },
  { word: "montagnes,", start: 6.94, end: 7.4 },
  { word: "de", start: 7.7, end: 7.82 },
  { word: "la", start: 7.82, end: 8.2 },
  { word: "neige,", start: 8.2, end: 8.26 },
  { word: "un", start: 8.5, end: 8.66 },
  { word: "savoir-faire", start: 8.66, end: 9.04 },
  { word: "de", start: 9.04, end: 9.38 },
  { word: "luxe,", start: 9.38, end: 10.04 },
  { word: "mais", start: 10.12, end: 10.2 },
  { word: "pas", start: 10.2, end: 10.44 },
  { word: "un", start: 10.44, end: 10.62 },
  { word: "gramme", start: 10.62, end: 10.88 },
  { word: "de", start: 10.88, end: 11.2 },
  { word: "cacao", start: 11.2, end: 11.38 },
  { word: "qui", start: 11.38, end: 11.66 },
  { word: "y", start: 11.66, end: 12.04 },
  { word: "pousse.", start: 12.04, end: 12.17 },
];
// Decoupe en phrases (indices ou une phrase SE TERMINE) — cale sur ponctuation/pauses.
//  [..Suisse.]=7  [..cacaoyer.]=17  [..luxe,]=26  [..pousse.]=35
const PHRASE_BREAKS = [7, 17, 26, 35];

const Karaoke: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const narSec = frame / fps;

  const phrases: { words: Word[]; start: number; end: number }[] = [];
  const breakSet = new Set(PHRASE_BREAKS);
  let startIdx = 0;
  for (let i = 0; i < WORDS.length; i++) {
    if (breakSet.has(i) || i === WORDS.length - 1) {
      const slice = WORDS.slice(startIdx, i + 1);
      phrases.push({ words: slice, start: slice[0].start, end: slice[slice.length - 1].end });
      startIdx = i + 1;
    }
  }

  const activeIdx = phrases.findIndex((p) => narSec >= p.start - 0.15 && narSec <= p.end + 0.45);
  const activePhrase = activeIdx >= 0 ? phrases[activeIdx] : null;
  if (!activePhrase) return null;

  const subOpacity = interpolate(
    narSec,
    [activePhrase.start - 0.15, activePhrase.start + 0.1, activePhrase.end + 0.25, activePhrase.end + 0.45],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  if (subOpacity <= 0.001) return null;

  return (
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
        opacity: subOpacity,
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
      {activePhrase.words.map((w, i) => {
        const active = narSec >= w.start && narSec <= w.end + 0.12;
        return (
          <span
            key={i}
            style={{
              color: active ? COCOA : INK,
              opacity: active ? 1 : 0.62,
              transform: active ? "translateY(-2px)" : "none",
              display: "inline-block",
            }}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
};

export const B1Hook: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <Audio src={staticFile("souverain/cacao-chocolat-short/audio/cacao-beat1-FINAL.mp3")} />

      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* focus pur tablette : glow + tablette. Aucun decor autour (vide). */}
        <TabletGlow />
        <ChocolateBar />
      </svg>

      <HookTitle />
      <Karaoke />
    </AbsoluteFill>
  );
};
