// Scene5Cta — Short Senegal Petrole Gaz D3 — BEAT 5 : CTA final (~97.88s -> ~109.86s)
//
// Calque le CTA du Short AES 90s (src/projects/warmap/shorts/aes-short-90s/CtaCard.tsx) — meme
// structure cartouche "L'HISTOIRE COMPLETE" + accroches + "VIDEO COMPLETE EN DESCRIPTION" — mais
// dans le registre du Short D3 (parchemin/navy/or, PAS le fond photo warmap).
//
// Structure narrative (whisper-words) :
//   97.88 -> 101.62 : "Reste a savoir si ce coffre va tenir." -> question finale (le cadenas FONSIS
//     du Beat 4 revient, avec un point d'interrogation = tension non resolue)
//   101.70 -> 103.02 : "L'histoire complete" -> le cartouche pop, titre
//   103.28 -> 107.26 : "les trois gisements / le piege de la dette / Pekin qui observe" -> 3 accroches
//     revelees une par une (synchro audio)
//   107.36 -> 109.86 : "dans la video longue. Lien en description." -> "VIDEO COMPLETE EN DESCRIPTION"
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { WHISPER_WORDS } from "./whisper-words-senegal-short";
import { buildDisplayWords, type DispWord } from "../cacao-chocolat-short/audio/karaokeWords";
import { CalebasseDettePartagee } from "./CalebasseDettePartagee";

const W = 1080;
const H = 1920;

const PARCH = "#e4ddca";
const PARCH_DARK = "#d6cdb4";
const GRID = "#c2a96a";
const NAVY = "#16213a";
const GOLD = "#c8a951";
const GOLD_BRIGHT = "#e3c068";
const IVORY = "#f2ebd9";
const RED = "#7a1f1f";

const SN_GREEN = "#00853F";
const SN_YELLOW = "#FDEF42";
const SN_RED = "#E31B23";

const FONT_MONO = '"IBM Plex Mono", monospace';
const BEBAS = "'Bebas Neue','Impact',sans-serif";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const T_OFFSET = 97.88;
const t2f = (abs: number) => Math.round((abs - T_OFFSET) * 30);

const F_QUESTION_IN = t2f(97.88); // "reste a savoir si ce coffre va tenir"
const F_CARD_IN = t2f(101.7); // "L'histoire complete" -> cartouche pop
const F_A1 = t2f(103.28); // "les trois gisements"
const F_A2 = t2f(104.5); // "le piege de la dette"
const F_A3 = t2f(105.8); // "Pekin qui observe"
const F_DESC = t2f(107.36); // "dans la video longue. Lien en description"
const F_TOTAL = t2f(109.86);

// ── Karaoke ──
const DISP: DispWord[] = buildDisplayWords(WHISPER_WORDS.map((w) => ({ ...w })));
type Phrase = { words: DispWord[]; start: number; end: number };
const MAX_WORDS = 3;
const PAUSE_GAP = 0.42;
function buildPhrases(disp: DispWord[], windowStart: number, windowEnd: number): Phrase[] {
  const out: Phrase[] = [];
  let cur: DispWord[] = [];
  for (let i = 0; i < disp.length; i++) {
    const w = disp[i];
    if (!w.text || w.start < windowStart) continue;
    if (w.start >= windowEnd) break;
    cur.push(w);
    const next = disp[i + 1];
    const gap = next ? next.start - w.end : Infinity;
    if (cur.length >= MAX_WORDS || gap >= PAUSE_GAP || !next || next.start >= windowEnd) {
      out.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
      cur = [];
    }
  }
  return out;
}
const PHRASES = buildPhrases(DISP, T_OFFSET, 109.86);

const KaraokeSubtitles: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const t = frame / fps + T_OFFSET;
  const phrase = PHRASES.find((p) => t >= p.start - 0.15 && t <= p.end + 0.35) ?? null;
  if (!phrase) return null;
  const opacity = interpolate(t, [phrase.start - 0.15, phrase.start + 0.08, phrase.end + 0.18, phrase.end + 0.35], [0, 1, 1, 0], clamp);
  if (opacity <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: "50%", bottom: 90, transform: "translateX(-50%)", maxWidth: "90%", textAlign: "center", opacity, zIndex: 100, background: "rgba(11,18,32,0.72)", borderRadius: 16, padding: "14px 30px", boxShadow: "0 6px 26px rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>
      <span style={{ fontFamily: BEBAS, fontSize: 48, letterSpacing: 1.5, lineHeight: 1.1, textShadow: "0 2px 12px rgba(0,0,0,0.95)" }}>
        {phrase.words.map((w, i) => {
          const spoken = t >= w.start - 0.02;
          return (
            <span key={i} style={{ color: spoken ? GOLD_BRIGHT : IVORY, opacity: spoken ? 1 : 0.5, marginRight: 12 }}>
              {w.text}
            </span>
          );
        })}
      </span>
    </div>
  );
};

// ── ECRAN CALEBASSE (continuite du Beat 4) — "reste a savoir si ce coffre va tenir".
// Retour Aziz : PAS de coffre qui surgit ici — c'est la MEME calebasse-dette du Beat 4 qui continue
// de monter et DEBORDE pleinement pendant "reste a savoir si ce coffre va tenir", juste avant le
// cartouche CTA. Pilotee par le temps absolu partage (CalebasseDettePartagee) : continuite exacte
// au raccord Beat 4 -> Beat 5. tAbs = frame/30 + T_OFFSET (97.88s). ──
const CalebasseCta: React.FC<{ frame: number; op: number }> = ({ frame, op }) => {
  if (op <= 0.001) return null;
  const tAbs = frame / 30 + T_OFFSET;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: op,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        paddingBottom: 120,
      }}
    >
      <CalebasseDettePartagee tAbs={tAbs} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 160, fontWeight: 700, color: RED, lineHeight: 1, textShadow: "0 4px 18px rgba(0,0,0,0.18)" }}>
          132<span style={{ fontSize: 72, fontWeight: 400 }}>%</span>
        </div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 28, color: NAVY, letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "center" }}>
          DE TOUTE L'ÉCONOMIE DU PAYS
        </div>
      </div>
    </div>
  );
};

// ── Cartouche CTA (calque AES, registre parchemin/navy/or) ──
const CtaCartouche: React.FC<{ frame: number; fps: number; op: number }> = ({ frame, fps, op }) => {
  if (op <= 0.001) return null;
  const cardPop = spring({ fps, frame: Math.max(0, frame - F_CARD_IN), config: { damping: 14, stiffness: 120 } });
  const cardScale = interpolate(cardPop, [0, 1], [0.8, 1]);

  const a1Op = interpolate(frame - F_A1, [0, 10], [0, 1], clamp);
  const a2Op = interpolate(frame - F_A2, [0, 10], [0, 1], clamp);
  const a3Op = interpolate(frame - F_A3, [0, 10], [0, 1], clamp);
  const descOp = interpolate(frame - F_DESC, [0, 12], [0, 1], clamp);

  const accroche = (txt: string, opv: number) => (
    <div style={{ opacity: opv, fontFamily: FONT_MONO, fontSize: 34, color: NAVY, letterSpacing: 2, textAlign: "center", transform: `translateY(${interpolate(opv, [0, 1], [10, 0])}px)` }}>
      {txt}
    </div>
  );

  return (
    <div style={{ position: "absolute", inset: 0, opacity: op, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          transform: `scale(${cardScale})`,
          background: IVORY,
          border: `4px solid ${NAVY}`,
          borderRadius: 14,
          padding: "56px 56px",
          maxWidth: "82%",
          textAlign: "center",
          boxShadow: "0 16px 50px rgba(0,0,0,0.4)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
        }}
      >
        {/* liseré or interieur */}
        <div style={{ fontFamily: BEBAS, fontSize: 76, color: NAVY, letterSpacing: 4, lineHeight: 1.05 }}>
          L'HISTOIRE
          <br />
          COMPLÈTE
        </div>
        <div style={{ width: 120, height: 3, background: GOLD }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {accroche("LES TROIS GISEMENTS", a1Op)}
          {accroche("LE PIÈGE DE LA DETTE", a2Op)}
          {accroche("PÉKIN QUI OBSERVE", a3Op)}
        </div>
        <div style={{ opacity: descOp, marginTop: 8, fontFamily: BEBAS, fontSize: 40, color: GOLD, background: NAVY, borderRadius: 10, padding: "12px 32px", letterSpacing: 3 }}>
          VIDÉO COMPLÈTE EN DESCRIPTION
        </div>
      </div>
    </div>
  );
};

export const Scene5Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gridV = Array.from({ length: Math.ceil(W / 140) + 1 }, (_, i) => 30 + i * 140);
  const gridH = Array.from({ length: Math.ceil(H / 140) + 1 }, (_, i) => 20 + i * 140);

  // transition calebasse (qui deborde) -> cartouche CTA (crossfade a F_CARD_IN). La calebasse reste
  // visible jusqu'a F_CARD_IN-6 (elle finit de deborder pdt "reste a savoir si ce coffre va tenir"),
  // puis fond quand le cartouche pop.
  const calebOp = interpolate(frame, [F_QUESTION_IN, F_QUESTION_IN + 12, F_CARD_IN - 6, F_CARD_IN + 8], [0, 1, 1, 0], clamp);
  const cartoucheOp = interpolate(frame, [F_CARD_IN - 4, F_CARD_IN + 10], [0, 1], clamp);

  // Retour Aziz : la fin coupait sec avant que "lien en description" (finit a 109.86s = F_TOTAL) ait
  // fini. Le beat est rallonge (cf. Root.tsx / ShortComplet : +~3s) et le cartouche reste affiche
  // pendant la fin de la phrase, PUIS un fondu doux (F_TOTAL+18 -> F_TOTAL+66, ~1.6s) ferme la scene
  // en douceur. Le fondu porte sur toute la scene (fond + cartouche).
  const exitFade = interpolate(frame, [F_TOTAL + 18, F_TOTAL + 66], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: PARCH, opacity: exitFade }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="s5paperTex">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" seed="11" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.07" />
            </feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
        </defs>
        <rect width={W} height={H} fill={PARCH_DARK} filter="url(#s5paperTex)" opacity={0.4} />
        <g stroke={GRID} strokeWidth={1.4} opacity={0.6}>
          {gridV.map((x) => (
            <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />
          ))}
          {gridH.map((y) => (
            <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />
          ))}
        </g>
      </svg>

      <CalebasseCta frame={frame} op={calebOp} />
      <CtaCartouche frame={frame} fps={fps} op={cartoucheOp} />

      <KaraokeSubtitles frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

export default Scene5Cta;
