// Scene4Dette — Short Senegal Petrole Gaz D3 — BEAT 4 : FONSIS + dette 132% (~76.58s -> ~96.74s)
//
// Structure narrative (whisper-words-senegal-short.ts), 2 ECRANS SEPARES (retour Aziz 2026-07-16 :
// ne PAS superposer coffre + calebasse, chacun son ecran) :
//   ECRAN 1 — LE BARIL FONSIS (76.58 -> ~81.5s) : "Aujourd'hui le Senegal a son coffre. Il s'appelle
//     le FONSIS." Un BARIL aux couleurs du Senegal (vert/jaune/rouge + etoile) se REMPLIT
//     graduellement (le petrole = la richesse qui rentre), + un CADENAS central qui passe d'OUVERT a
//     FERME (le fonds qui se verrouille). Reprend le baril de la V3 longue (BarilJaugeIcon partage,
//     _shared/thumbnails/icons) que Aziz voulait reutiliser.
//   ECRAN 2 — LA CALEBASSE-DETTE (~81.5 -> 96.74s) : "Mais il est menace par une dette ecrasante —
//     132% de toute l'economie." La calebasse (template V1 Senegal) se remplit de rouge, monte a ras
//     bord et DEBORDE (coulees + gouttes + mare) : 132%.
//
// Mecanique layout : flex column centre (feedback_layout-flex-jamais-positions-absolues-au-juge).
// Cadenas : geometrie simple maison, verifiee (feedback_animer-objet-mecanique-svg-verifier-par-calcul) —
// l'anse (arc en U) pivote/se souleve, PAS de mecanique fragile.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { WHISPER_WORDS } from "./whisper-words-senegal-short";
import { buildDisplayWords, type DispWord } from "../cacao-chocolat-short/audio/karaokeWords";
import { BarilJaugeIcon } from "../../_shared/thumbnails/icons/BarilJaugeIcon";
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
const RED_LIQUID = "#8f2a24";

// couleurs officielles drapeau Senegal
const SN_GREEN = "#00853F";
const SN_YELLOW = "#FDEF42";
const SN_RED = "#E31B23";

const FONT_MONO = '"IBM Plex Mono", monospace';
const BEBAS = "'Bebas Neue','Impact',sans-serif";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ── Calage @30fps, T_OFFSET=76.58s ──
const T_OFFSET = 76.58;
const t2f = (abs: number) => Math.round((abs - T_OFFSET) * 30);

// ECRAN 1 — baril FONSIS
const F_BARIL_IN = t2f(76.58); // baril apparait
const F_BARIL_FILL = t2f(77.0); // le baril commence a se remplir
const F_FONSIS_LABEL = t2f(79.16); // "il s'appelle le FONSIS"
const F_LOCK_CLOSE = t2f(80.0); // le cadenas se ferme (le fonds se verrouille)
// ECRAN 2 — calebasse dette
const F_SCREEN2 = t2f(81.6); // "mais il est menace" -> transition ecran 1 -> ecran 2
const F_CALEB_IN = t2f(82.4); // calebasse commence a se remplir
const F_132 = t2f(84.88); // "cent trente-deux" -> 132% + debordement
const F_EXIT_START = t2f(95.8);
const F_TOTAL = t2f(96.74);

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
const PHRASES = buildPhrases(DISP, T_OFFSET, 96.74);

const KaraokeSubtitles: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const t = frame / fps + T_OFFSET;
  const phrase = PHRASES.find((p) => t >= p.start - 0.15 && t <= p.end + 0.35) ?? null;
  if (!phrase) return null;
  const opacity = interpolate(
    t,
    [phrase.start - 0.15, phrase.start + 0.08, phrase.end + 0.18, phrase.end + 0.35],
    [0, 1, 1, 0],
    clamp
  );
  if (opacity <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 140,
        transform: "translateX(-50%)",
        maxWidth: "90%",
        textAlign: "center",
        opacity,
        zIndex: 100,
        background: "rgba(11,18,32,0.72)",
        borderRadius: 16,
        padding: "14px 30px",
        boxShadow: "0 6px 26px rgba(0,0,0,0.5)",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontFamily: BEBAS, fontSize: 52, letterSpacing: 1.5, lineHeight: 1.1, textShadow: "0 2px 12px rgba(0,0,0,0.95)" }}>
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

// ── CADENAS (anse en U qui se souleve = ouvert, redescend = ferme) — geometrie simple maison.
// Repere local centre sur (0,0) au centre du CORPS du cadenas. L'anse est un arc dont les 2 pieds
// s'enfoncent dans le corps quand ferme ; ouvert, l'anse se SOULEVE (translate Y negatif) + pivote
// legerement. Verifie : translate pur (pas de rotate fragile), l'anse reste connectee au corps. */
const Cadenas: React.FC<{ frame: number; cx: number; cy: number; scale: number }> = ({ frame, cx, cy, scale }) => {
  // closeT : 0 = ouvert (anse levee), 1 = ferme (anse enfoncee). Passe de 0 a 1 a F_LOCK_CLOSE.
  const closeT = interpolate(frame, [F_LOCK_CLOSE, F_LOCK_CLOSE + 18], [0, 1], clamp);
  const anseLift = interpolate(closeT, [0, 1], [-26, 0]); // anse levee de 26u quand ouvert
  const anseTilt = interpolate(closeT, [0, 1], [-14, 0]); // legere inclinaison quand ouvert
  const bodyW = 96;
  const bodyH = 78;
  const isLocked = closeT >= 0.99;

  return (
    <g transform={`translate(${cx},${cy}) scale(${scale})`}>
      {/* ANSE (arc en U metallique) — pied gauche fixe (charniere), pied droit se souleve/pivote */}
      <g transform={`translate(0,${anseLift}) rotate(${anseTilt}, -26, -30)`}>
        <path
          d="M-26,-30 L-26,-62 A26,30 0 0 1 26,-62 L26,-30"
          fill="none"
          stroke={GOLD}
          strokeWidth={13}
          strokeLinecap="round"
        />
        <path
          d="M-26,-30 L-26,-62 A26,30 0 0 1 26,-62 L26,-30"
          fill="none"
          stroke={GOLD_BRIGHT}
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.6}
        />
      </g>
      {/* CORPS du cadenas (bloc arrondi) */}
      <rect x={-bodyW / 2} y={-28} width={bodyW} height={bodyH} rx={16} fill={NAVY} stroke={GOLD} strokeWidth={4} />
      <rect x={-bodyW / 2 + 6} y={-22} width={bodyW - 12} height={bodyH - 12} rx={11} fill="none" stroke={GOLD_BRIGHT} strokeWidth={1.5} opacity={0.5} />
      {/* trou de serrure */}
      <circle cx={0} cy={4} r={10} fill={isLocked ? GOLD_BRIGHT : IVORY} />
      <rect x={-4} y={4} width={8} height={20} rx={2} fill={isLocked ? GOLD_BRIGHT : IVORY} />
    </g>
  );
};

// ── ECRAN 1 : BARIL FONSIS (se remplit couleurs Senegal + cadenas se ferme) ──
const BarilFonsis: React.FC<{ frame: number; screenOp: number }> = ({ frame, screenOp }) => {
  const local = frame - F_BARIL_IN;
  if (local < -2 || screenOp <= 0.001) return null;

  // remplissage 0 -> 100% (le baril se remplit du drapeau senegalais), ease-out
  const fillEased = spring({ frame: Math.max(0, frame - F_BARIL_FILL), fps: 30, config: { damping: 20, stiffness: 45 } });
  const ratio = interpolate(fillEased, [0, 1], [0, 100], clamp);

  // Retour Aziz : SUPPRIME le titre "LE COFFRE DU SENEGAL" ET le label FONSIS (les sous-titres karaoke
  // en bas suffisent). Ca libere l'espace pour AGRANDIR le baril a la taille de la calebasse (~560px).
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: screenOp,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 120,
      }}
    >
      {/* baril HERO GRAND (taille de la calebasse) + cadenas proportionne pose devant le bas du fut.
          Boite 760x760 (carree, place pour le baril haut + le cadenas qui deborde en bas). Le baril
          size w=560 dans le viewBox 1280 => occupe ~44% => grand et centre. */}
      <div style={{ position: "relative", width: 760, height: 780, flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: 760, height: 780 }}>
          <BarilJaugeIcon
            ratio={ratio}
            flagColors={{ a: SN_GREEN, b: SN_YELLOW, c: SN_RED }}
            starColor={SN_GREEN}
            showStar
            position={{ cx: 640, cy: 360 }}
            size={{ w: 560, h: 620 }}
          />
        </div>
        {/* cadenas pose sur la face avant basse du baril, proportionne au baril agrandi */}
        <svg width={760} height={780} viewBox="0 0 760 780" style={{ position: "absolute", inset: 0 }}>
          <Cadenas frame={frame} cx={380} cy={560} scale={1.7} />
        </svg>
      </div>
    </div>
  );
};

// ── ECRAN 2 : CALEBASSE-DETTE (composant partage pilote par temps absolu, cf. CalebasseDettePartagee) ──
const CalebasseScreen: React.FC<{ frame: number; fps: number; screenOp: number }> = ({ frame, fps, screenOp }) => {
  if (screenOp <= 0.001) return null;
  const pctLocal = frame - F_132;
  const pctValue = Math.floor(interpolate(pctLocal, [0, 40], [0, 132], clamp));
  const pctOp = interpolate(pctLocal, [0, 14], [0, 1], clamp);
  const pctScale = spring({ fps, frame: Math.max(0, pctLocal), config: { damping: 14, stiffness: 160, mass: 0.8 } });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: screenOp,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        paddingBottom: 120,
      }}
    >
      {/* Retour Aziz : titre "LA DETTE PUBLIQUE" supprime (sous-titres karaoke suffisent). Calebasse
          PARTAGEE pilotee par temps absolu (continuite exacte avec le Beat 5 qui la reprend). */}
      <CalebasseDettePartagee tAbs={frame / 30 + T_OFFSET} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: pctOp }}>
        <div style={{ transform: `scale(${pctScale})`, fontFamily: FONT_MONO, fontSize: 160, fontWeight: 700, color: RED, lineHeight: 1, textShadow: "0 4px 18px rgba(0,0,0,0.18)" }}>
          {pctValue}
          <span style={{ fontSize: 72, fontWeight: 400 }}>%</span>
        </div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 28, color: NAVY, letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "center" }}>
          DE TOUTE L'ÉCONOMIE DU PAYS
        </div>
      </div>
    </div>
  );
};

export const Scene4Dette: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gridV = Array.from({ length: Math.ceil(W / 140) + 1 }, (_, i) => 30 + i * 140);
  const gridH = Array.from({ length: Math.ceil(H / 140) + 1 }, (_, i) => 20 + i * 140);
  const exitFade = interpolate(frame, [F_EXIT_START, F_TOTAL], [1, 0], clamp);

  // transition ECRAN 1 -> ECRAN 2 (crossfade a F_SCREEN2)
  const screen1Op = interpolate(frame, [F_SCREEN2, F_SCREEN2 + 16], [1, 0], clamp);
  const screen2Op = interpolate(frame, [F_SCREEN2 + 6, F_SCREEN2 + 22], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: PARCH, opacity: exitFade }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="s4paperTex">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" seed="11" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.07" />
            </feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
        </defs>
        <rect width={W} height={H} fill={PARCH_DARK} filter="url(#s4paperTex)" opacity={0.4} />
        <g stroke={GRID} strokeWidth={1.4} opacity={0.6}>
          {gridV.map((x) => (
            <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />
          ))}
          {gridH.map((y) => (
            <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />
          ))}
        </g>
      </svg>

      <BarilFonsis frame={frame} screenOp={screen1Op} />
      <CalebasseScreen frame={frame} fps={fps} screenOp={screen2Op} />

      <KaraokeSubtitles frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

export default Scene4Dette;
