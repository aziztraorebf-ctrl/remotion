// SubtitlesWordByWord — sous-titres karaoke facon cacao/GGW (pattern eprouve, reutilise).
// PRINCIPE (retour Aziz) : PAS de gros bloc de phrase entiere. On affiche UNE PHRASE COURTE a la fois
// (2-6 mots, calee sur les pauses naturelles de la narration), le mot courant surligne en or, le reste
// en ivoire attenue. La phrase suivante remplace la precedente. Libere l'espace bas -> carte plus grande.
//
// Pilote par WHISPER_WORDS (timing reel). Elisions recollees (l'or) via buildDisplayWords.
// Corrections d'orthographe d'affichage (CEDEAO, campagnes...) appliquees (regle mot-a-l'ecran).
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { buildDisplayWords, type DispWord } from "../../../souverain/cacao-chocolat-short/audio/karaokeWords";
import { WHISPER_WORDS } from "../../_shared/whisper-words-short-90s";

const IVORY = "#f2ebd9";
const GOLD = "#f5d98a";
const NAVY_BAR = "rgba(11,18,32,0.72)";

const SPELL_FIX: Record<string, string> = {
  CDAO: "CEDEAO",
  compagnes: "campagnes",
  Nait: "Naît",
  coup: "coût",
};
const WORDS_FIXED = WHISPER_WORDS.map((w) => ({ ...w, word: SPELL_FIX[w.word] ?? w.word }));
const DISP: DispWord[] = buildDisplayWords(WORDS_FIXED);

// Decoupe en PHRASES COURTES : on coupe (a) sur les grosses pauses (>0.5s entre 2 mots),
// (b) apres ~5 mots max pour ne jamais depasser une ligne lisible. Cale sur le rythme oral reel.
type Phrase = { words: DispWord[]; start: number; end: number };
const MAX_WORDS = 5;
const PAUSE_GAP = 0.42; // secondes de silence qui declenchent une coupure de phrase

const PHRASES: Phrase[] = (() => {
  const out: Phrase[] = [];
  let cur: DispWord[] = [];
  for (let i = 0; i < DISP.length; i++) {
    const w = DISP[i];
    if (!w.text) continue;
    cur.push(w);
    const next = DISP[i + 1];
    const gap = next ? next.start - w.end : Infinity;
    if (cur.length >= MAX_WORDS || gap >= PAUSE_GAP || !next) {
      out.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
      cur = [];
    }
  }
  return out;
})();

export const SubtitlesWordByWord: React.FC<{ bottomPx?: number; tOffset?: number }> = ({ bottomPx = 150, tOffset = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + tOffset; // tOffset : si la compo demarre a t>0 (ex Part2 a 36s)

  // phrase active = celle dont [start-0.15, end+0.35] contient t
  const phrase = PHRASES.find((p) => t >= p.start - 0.15 && t <= p.end + 0.35) ?? null;
  if (!phrase) return null;

  const opacity = interpolate(
    t,
    [phrase.start - 0.15, phrase.start + 0.08, phrase.end + 0.18, phrase.end + 0.35],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  if (opacity <= 0.001) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: bottomPx,
        transform: "translateX(-50%)",
        maxWidth: "90%",
        textAlign: "center",
        opacity,
        zIndex: 100,
        background: NAVY_BAR,
        borderRadius: 16,
        padding: "14px 30px",
        boxShadow: "0 6px 26px rgba(0,0,0,0.5)",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          fontFamily: "'Bebas Neue','Impact',sans-serif",
          fontSize: 62,
          letterSpacing: 1.5,
          lineHeight: 1.1,
          textShadow: "0 2px 12px rgba(0,0,0,0.95)",
        }}
      >
        {phrase.words.map((w, i) => {
          const spoken = t >= w.start - 0.02;
          return (
            <span key={i} style={{ color: spoken ? GOLD : IVORY, opacity: spoken ? 1 : 0.5, marginRight: 12 }}>
              {w.text}
            </span>
          );
        })}
      </span>
    </div>
  );
};

export default SubtitlesWordByWord;
