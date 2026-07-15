// Scene1Hook — Short Senegal Petrole Gaz D3 — HOOK (0.0s -> ~9.6s narration)
//
// V3 (retour Aziz + analyse croisee Kimi/Gemini, filtree — cf. memoire session) :
//   - jauge circulaire derriere le chiffre (ancrage visuel, remplace le flottement) — Kimi option A
//   - particules dorees SUPPRIMEES (jugees "template/cheap" par les 2 IA + Aziz)
//   - chiffre en police MONOSPACE (IBM Plex Mono) — evite le tremblement horizontal du count-up (Gemini)
//   - jitter leger du trace au moment de la bascule rouge (Gemini) — le ROUGE PLEIN reste (decision
//     Aziz : coherence avec Beat0AccrocheV7 de la video longue, NE PAS adoucir vers fissures/chiffre-seul)
//   - chevauchement titre/karaoke en ouverture corrige (les deux disaient "Avril 2026" en meme temps)
//
// V2 (retour Aziz apres premier test) :
//   - count-up RALENTI + enrichi (paliers + pulsation/glow) = showstopper
//   - "Avril 2026" retime pour respirer ~2s avant le remplissage carte
//   - carte RECENTREE verticalement + agrandie (+~28%), zone basse liberee pour sous-titres
//   - sous-titres bloc SUPPRIMES -> remplaces par karaoke mot-par-mot style TikTok (pattern AES)
//
// Reprend le pattern d'ouverture parchemin de la video longue (ProtoEffect_MapDrawParchemin.tsx) :
// fond parchemin quadrille + remplissage ocre (wipe bas->haut) + contour trace par-dessus.
// Calage : whisper-words-senegal-short.ts (Forced Alignment ElevenLabs, precis).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, Audio, Sequence, staticFile, random } from "remotion";
import { SENEGAL_PATH, SENEGAL_PATH_LEN, SENEGAL_CENTROID } from "../../_proto-16-9/senegalPath";
import { WHISPER_WORDS } from "./whisper-words-senegal-short";
import { buildDisplayWords, type DispWord } from "../cacao-chocolat-short/audio/karaokeWords";

const W = 1080;
const H = 1920;

// Palette (reprise du proto parchemin, charte Souverain)
const PARCH = "#e4ddca";
const PARCH_DARK = "#d6cdb4";
const GRID = "#c2a96a";
const OCRE = "#e7bd78";
const OCRE_MID = "#d2ad66";
const OCRE_DARK = "#bf9442";
const NAVY = "#16213a";
const GOLD_BRIGHT = "#f5d98a";
const RED = "#7a1f1f"; // bascule dramatique (gouvernement tombe)
const RED_LIGHT = "#a63333";
const IVORY = "#f2ebd9";

// ── Calage frames @30fps (source: whisper-words-senegal-short.ts, forced alignment ElevenLabs) ──
// "Avril" start=0.099s · "2026." end=1.480s · "pompe" start=2.619s · "jour." end=5.879s
// "Un" start=7.199s · "tombe." start=9.239s end=9.579s
const F_TITLE_IN = 3;        // "Avril" ~f3
const F_TITLE_SETTLE = 60;   // titre installe, respire ~2s avant le count-up (f60 = 2.0s)
const F_FILL_START = 14;     // remplissage carte demarre pendant que le titre respire
const F_DRAW_START = 30;
const F_COUNT_START = 70;    // demarre un peu avant "pompe" (f79) pour anticiper le mot
const F_COUNT_END = 205;     // RALENTI vs V1 (etait f176) : ~4.5s de count-up, showstopper
const F_BASCULE_START = 216; // "Un" start=7.199s -> f216 (inchange, cale sur la voix)
const F_GOV_TOMBE = 279;     // "tombe." -> f277-287
const F_TOTAL = 288;         // ~9.6s @30fps

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ── Carte : RECENTREE verticalement + AGRANDIE (~+28% vs V1 scale 1.05 -> 1.32) ──
// IMPORTANT : le path SENEGAL_PATH n'occupe PAS toute la boite nominale 900x700 declaree —
// bornes reelles mesurees : x in [40,860] (largeur 820), y in [50.5,649.5] (hauteur 599).
// Centrer sur SENEGAL_CENTROID (le vrai centre du contenu) plutot que sur la boite nominale,
// sinon le decalage boite-vs-contenu (100px en x, 100px en y) annule visuellement le recentrage.
const MAP_SCALE = 1.32;
const MAP_X = W / 2 - SENEGAL_CENTROID[0] * MAP_SCALE;
const MAP_Y = H * 0.44 - SENEGAL_CENTROID[1] * MAP_SCALE; // centre vertical, zone basse liberee pour karaoke

const GRID_STEP = 140;
const GRID_OFFSET_X = 30;
const GRID_OFFSET_Y = 20;

// ── Fracture (reprise de ProtoEffect_Fracture.tsx, video longue Senegal) ────────
// Ligne de fracture brisee (zigzag jitere deterministe) qui traverse la carte. Meme mecanique
// que le hook long : 2 clips (moitie A/B) qui s'ecartent a la cassure. Adapte au cadre 9:16 court —
// PAS de recomposition finale (le short se termine juste apres, contrairement au hook long).
function fracturePath(): string {
  const x0 = MAP_X + (SENEGAL_CENTROID[0] - 340) * MAP_SCALE;
  const y0 = MAP_Y + (SENEGAL_CENTROID[1] - 260) * MAP_SCALE;
  const x1 = MAP_X + (SENEGAL_CENTROID[0] + 340) * MAP_SCALE;
  const y1 = MAP_Y + (SENEGAL_CENTROID[1] + 260) * MAP_SCALE;
  const segs = 8;
  let d = `M ${x0} ${y0}`;
  for (let i = 1; i <= segs; i++) {
    const t = i / segs;
    const bx = x0 + (x1 - x0) * t;
    const by = y0 + (y1 - y0) * t;
    const jitter = (random(`s1frac-${i}`) - 0.5) * 90;
    const perpX = -(y1 - y0);
    const perpY = x1 - x0;
    const len = Math.hypot(perpX, perpY);
    d += ` L ${bx + (perpX / len) * jitter} ${by + (perpY / len) * jitter}`;
  }
  return d;
}
const FRACTURE_D = fracturePath();

function frThousands(n: number): string {
  return Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// ── Sous-titres karaoke (pattern SubtitlesWordByWord de aes-short-90s) ──────────
const SPELL_FIX: Record<string, string> = {};
const WORDS_FIXED = WHISPER_WORDS.map((w) => ({ ...w, word: SPELL_FIX[w.word] ?? w.word }));
const DISP: DispWord[] = buildDisplayWords(WORDS_FIXED);

type Phrase = { words: DispWord[]; start: number; end: number };
const MAX_WORDS = 5;
const PAUSE_GAP = 0.42;

function buildPhrases(disp: DispWord[], windowEnd: number): Phrase[] {
  const out: Phrase[] = [];
  let cur: DispWord[] = [];
  for (let i = 0; i < disp.length; i++) {
    const w = disp[i];
    if (!w.text || w.start >= windowEnd) break;
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
const PHRASES = buildPhrases(DISP, 9.6);

const KaraokeSubtitles: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const t = frame / fps;
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
      <span
        style={{
          fontFamily: "'Bebas Neue','Impact',sans-serif",
          fontSize: 56,
          letterSpacing: 1.5,
          lineHeight: 1.1,
          textShadow: "0 2px 12px rgba(0,0,0,0.95)",
        }}
      >
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

// ── Jauge circulaire derriere le chiffre (ancrage visuel, remplace le flottement) ──
// Se remplit en sync avec le count-up (0 -> 1 sur F_COUNT_START..F_COUNT_END), pulse au palier final.
const GAUGE_R = 168;
const GAUGE_CIRC = 2 * Math.PI * GAUGE_R;

const CountGauge: React.FC<{ frame: number; cx: number; cy: number; progress: number; op: number }> = ({
  frame,
  cx,
  cy,
  progress,
  op,
}) => {
  const landPulse = interpolate(frame, [F_COUNT_END, F_COUNT_END + 10, F_COUNT_END + 26], [0, 1, 0], clamp);
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: op, pointerEvents: "none" }}>
      {/* piste de fond (cercle complet, tenue) */}
      <circle cx={cx} cy={cy} r={GAUGE_R} fill="none" stroke={NAVY} strokeWidth={3} opacity={0.14} />
      {/* arc progressif */}
      <circle
        cx={cx}
        cy={cy}
        r={GAUGE_R}
        fill="none"
        stroke={OCRE_DARK}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={GAUGE_CIRC}
        strokeDashoffset={GAUGE_CIRC * (1 - progress)}
        transform={`rotate(-90 ${cx} ${cy})`}
        opacity={0.85}
      />
      {/* halo qui pulse au palier final */}
      {landPulse > 0 && (
        <circle
          cx={cx}
          cy={cy}
          r={GAUGE_R + landPulse * 22}
          fill="none"
          stroke={GOLD_BRIGHT}
          strokeWidth={3}
          opacity={landPulse * 0.5}
        />
      )}
    </svg>
  );
};

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Remplissage + contour : ETALES sur toute la duree du count-up ──────────
  // La carte se pose LEGEREMENT AVANT le pic du chiffre (F_MAP_SETTLE < F_COUNT_END) : le cadre
  // se stabilise juste avant le climax, l'attention se concentre alors sur le chiffre qui frappe.
  const F_MAP_SETTLE = F_COUNT_END - 15; // ~0.5s avant le pic du compteur
  const fillRevealY = 1 - interpolate(frame, [F_FILL_START, F_MAP_SETTLE], [0, 1], clamp);
  const draw = interpolate(frame, [F_DRAW_START, F_MAP_SETTLE], [0, 1], clamp);

  // ── Titre "AVRIL 2026" — disparait COMPLETEMENT des que le karaoke prend le relais (evite le
  // chevauchement ou les 2 disent "Avril 2026" en meme temps, releve par Aziz) ──
  const titleOp = interpolate(frame, [F_TITLE_IN, F_TITLE_IN + 14, F_TITLE_SETTLE, F_TITLE_SETTLE + 18], [0, 1, 1, 0], clamp);
  const titleY = interpolate(
    spring({ fps, frame: Math.max(0, frame - F_TITLE_IN), config: { damping: 16, stiffness: 90 } }),
    [0, 1],
    [18, 0]
  );

  // ── Count-up 0 -> 8 000 000 $ — RALENTI, avec PALIERS (a-coups perceptibles) ──
  const countTRaw = interpolate(frame, [F_COUNT_START, F_COUNT_END], [0, 1], clamp);
  const eased = 1 - Math.pow(1 - countTRaw, 2.2);
  // paliers : on quantifie en ~18 crans perceptibles plutot qu'un defilement lisse en continu
  const STEPS = 18;
  const steppedT = Math.floor(eased * STEPS) / STEPS;
  const amount = Math.round((steppedT * 8_000_000) / 1000) * 1000;
  const countOp = interpolate(frame, [F_COUNT_START - 6, F_COUNT_START + 6, F_BASCULE_START - 10, F_BASCULE_START + 10], [0, 1, 1, 0.55], clamp);

  // pulsation qui s'intensifie a mesure que le count-up avance (0 -> 1 sur la duree du count)
  const pulseIntensity = interpolate(frame, [F_COUNT_START, F_COUNT_END], [0, 1], clamp);
  const pulse = 1 + Math.sin(frame * 0.5) * 0.015 * pulseIntensity;
  // pop a chaque palier franchi (petit sursaut visuel synchronise aux a-coups)
  const stepPop = 1 + (eased * STEPS - Math.floor(eased * STEPS) < 0.15 ? 0.025 : 0);

  // flash final a l'arrivee sur 8M$
  const landPop = spring({ fps, frame: Math.max(0, frame - F_COUNT_END), config: { damping: 8, stiffness: 240 } });
  const breathe = frame > F_COUNT_END ? 1 + 0.014 * Math.sin((frame - F_COUNT_END) * 0.14) : 1;
  const landScale = (1 + 0.09 * landPop * (frame < F_COUNT_END + 18 ? 1 : 0)) * breathe;
  const countScale = pulse * stepPop * landScale;

  // glow qui s'intensifie avec le compteur
  const glowIntensity = interpolate(frame, [F_COUNT_START, F_COUNT_END, F_COUNT_END + 30], [0.15, 0.55, 0.3], clamp);

  // ── Bascule dramatique : le fill ocre vire au rouge sombre ("le gouvernement tombe") ──
  const basculeT = interpolate(frame, [F_BASCULE_START, F_GOV_TOMBE], [0, 1], clamp);

  // ── FRACTURE (reprise ProtoEffect_Fracture.tsx) : la carte se fend en 2 au moment de la cassure ──
  // BREAK = frame d'impact (le mot "tombe" tombe pile sur la dechirure, meme logique que le hook long
  // ou "limoge" declenche la cassure). Split s'ouvre puis reste ouvert (pas de recomposition, le
  // short se termine juste apres — contrairement au hook long qui referme sur "la verite").
  const BREAK = F_GOV_TOMBE - 8;
  const since = frame - BREAK;
  const crackProg = interpolate(since, [0, 10], [0, 1], clamp);
  const split = interpolate(since, [0, 14], [0, 26], clamp);
  // secousse (shake) brusque a la cassure, amortie — meme mecanique que le proto original
  const shakeAmp = since > 0 ? Math.max(0, 14 - since * 1.3) : 0;
  const shakeX = since > 0 ? (random(`s1sx${Math.floor(frame / 2)}`) - 0.5) * 2 * shakeAmp : 0;
  const shakeY = since > 0 ? (random(`s1sy${Math.floor(frame / 2)}`) - 0.5) * 2 * shakeAmp : 0;

  const gridV = Array.from({ length: Math.ceil(W / GRID_STEP) + 1 }, (_, i) => GRID_OFFSET_X + i * GRID_STEP);
  const gridH = Array.from({ length: Math.ceil(H / GRID_STEP) + 1 }, (_, i) => GRID_OFFSET_Y + i * GRID_STEP);

  const centerX = MAP_X + SENEGAL_CENTROID[0] * MAP_SCALE;
  const centerY = MAP_Y + SENEGAL_CENTROID[1] * MAP_SCALE;

  const amountStr = frThousands(amount) + " $";

  return (
    <AbsoluteFill style={{ background: PARCH }}>
      {/* SFX DECHIRURE — cedeao-snap (craquement sec), repris tel quel du hook long (ProtoEffect_Fracture),
          cale sur BREAK (le mot "tombe" tombe pile sur la cassure). */}
      {BREAK >= 0 && (
        <Sequence from={BREAK} durationInFrames={40}>
          <Audio src={staticFile("_shared/sfx/warmap/cedeao-snap.mp3")} volume={0.9} />
        </Sequence>
      )}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="b1ocreFill" x1="0" y1="0" x2="0.25" y2="1">
            <stop offset="0%" stopColor={OCRE} />
            <stop offset="55%" stopColor={OCRE_MID} />
            <stop offset="100%" stopColor={OCRE_DARK} />
          </linearGradient>
          <linearGradient id="b1redFill" x1="0" y1="0" x2="0.25" y2="1">
            <stop offset="0%" stopColor={RED_LIGHT} />
            <stop offset="100%" stopColor={RED} />
          </linearGradient>
          <filter id="b1paperTex">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" seed="7" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.07" />
            </feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
          <filter id="b1ocreTex">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="3" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.12" />
            </feComponentTransfer>
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
          <clipPath id="b1fillWipe">
            <rect x="0" y="0" width={W} height={H * (1 - fillRevealY)} transform={`translate(0, ${H * fillRevealY})`} />
          </clipPath>
          <filter id="b1glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="14" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* clips fracture (reprise ProtoEffect_Fracture.tsx) : moitie A (haut-gauche de la faille),
              moitie B (bas-droite). Chaque moitie se translate le long de la perpendiculaire au split. */}
          <clipPath id="b1halfA">
            <path d={`${FRACTURE_D} L ${MAP_X - 300} ${H} L ${MAP_X - 300} ${-300} Z`} />
          </clipPath>
          <clipPath id="b1halfB">
            <path d={`${FRACTURE_D} L ${W + 300} ${H} L ${W + 300} ${-300} Z`} />
          </clipPath>
        </defs>

        {/* fond papier texture */}
        <rect width={W} height={H} fill={PARCH_DARK} filter="url(#b1paperTex)" opacity={0.55} />

        {/* grille fine */}
        <g stroke={GRID} strokeWidth={1.4} opacity={0.65}>
          {gridV.map((x) => (
            <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />
          ))}
          {gridH.map((y) => (
            <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />
          ))}
        </g>

        {/* glow doux derriere la carte, s'intensifie avec le count-up */}
        <circle cx={centerX} cy={centerY} r={340} fill={GOLD_BRIGHT} opacity={glowIntensity * 0.25} filter="url(#b1glow)" />

        {/* CARTE Senegal — shake d'impact applique au moment de la cassure (reprise ProtoEffect_Fracture).
            FIX bug bande non-coloree (releve Aziz) : b1fillWipe est defini en coordonnees ECRAN absolues
            (0..W x 0..H). Il doit donc etre applique sur un <g> qui n'a PAS encore subi le scale(MAP_SCALE)
            de la carte — sinon le rectangle de clip est lui-meme mis a l'echelle et se desaligne du path
            reel (cause du bug). Structure correcte : clip sur le groupe EXTERIEUR (coord. ecran), le
            translate+scale de la carte s'applique SEULEMENT a l'interieur du clip.
            SPLIT (reprise ProtoEffect_Fracture.tsx) : fill ET contour appliques aux 2 moities (halfA/halfB)
            qui s'ecartent le long de la perpendiculaire a la faille, pour rester synchronises visuellement. */}
        {(["A", "B"] as const).map((half) => {
          const dx = half === "A" ? -split : split;
          const dy = half === "A" ? -split * 0.5 : split * 0.5;
          return (
            <g key={half} clipPath={`url(#b1half${half})`} transform={`translate(${dx},${dy})`}>
              <g clipPath="url(#b1fillWipe)">
                <g transform={`translate(${MAP_X + shakeX},${MAP_Y + shakeY}) scale(${MAP_SCALE})`}>
                  <path d={SENEGAL_PATH} fill={basculeT > 0.5 ? RED : OCRE_DARK} />
                  <path d={SENEGAL_PATH} fill="url(#b1ocreFill)" filter="url(#b1ocreTex)" opacity={1 - basculeT} />
                  {basculeT > 0 && (
                    <path d={SENEGAL_PATH} fill="url(#b1redFill)" filter="url(#b1ocreTex)" opacity={basculeT} />
                  )}
                </g>
              </g>
              <g transform={`translate(${MAP_X + shakeX},${MAP_Y + shakeY}) scale(${MAP_SCALE})`}>
                <path
                  d={SENEGAL_PATH}
                  fill="none"
                  stroke={NAVY}
                  strokeWidth={4}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeDasharray={SENEGAL_PATH_LEN}
                  strokeDashoffset={SENEGAL_PATH_LEN * (1 - draw)}
                />
              </g>
            </g>
          );
        })}

        {/* TRAIT DE FRACTURE (reprise ProtoEffect_Fracture.tsx) : se trace a la cassure, reste visible */}
        {since > -4 && (
          <path
            d={FRACTURE_D}
            fill="none"
            stroke="#1a0f0d"
            strokeWidth={5}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={1400}
            strokeDashoffset={1400 * (1 - crackProg)}
            opacity={0.9}
          />
        )}
      </svg>

      {/* jauge circulaire derriere le chiffre — ancrage visuel (remplace les particules dorees) */}
      <CountGauge frame={frame} cx={centerX} cy={centerY} progress={eased} op={countOp} />

      {/* "AVRIL 2026" */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "12%",
          transform: `translate(-50%,-50%) translateY(${titleY}px)`,
          opacity: titleOp,
          fontFamily: "Cinzel, serif",
          fontSize: 64,
          fontWeight: 700,
          color: NAVY,
          letterSpacing: "0.06em",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        AVRIL 2026
      </div>

      {/* Count-up central (a la place du nom du pays) */}
      <div
        style={{
          position: "absolute",
          left: centerX,
          top: centerY,
          transform: `translate(-50%,-50%) scale(${countScale})`,
          opacity: countOp,
          textAlign: "center",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: 84,
            color: NAVY,
            letterSpacing: "-1px",
            lineHeight: 1,
            textShadow: "0 2px 0 rgba(255,255,255,0.45), 0 4px 18px rgba(22,33,58,0.25)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {amountStr}
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 28,
            color: NAVY,
            letterSpacing: "0.3em",
            opacity: 0.75,
          }}
        >
          / JOUR
        </div>
      </div>

      {/* Sous-titres karaoke mot-par-mot portent seuls le texte "un mois plus tard, le gouvernement
          tombe" — plus de bloc texte statique en double (retour Aziz : redondance). */}
      <KaraokeSubtitles frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

export default Scene1Hook;
