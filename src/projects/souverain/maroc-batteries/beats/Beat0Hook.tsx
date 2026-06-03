import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SweepRevealTerritory } from "../../../_shared/mapbox/SweepRevealTerritory";
import { SEGMENTS } from "../timing";
import { MAROC_WORDS } from "../maroc-words";

// Beat 0 — Hook narratif (f0→f244, ~8.1s)
// Voix : "Dans deux ans, la prochaine batterie de votre voiture électrique
//         sortira peut-être d'ici, d'une usine qui n'existait pas il y a trois ans."
//
// Architecture : SweepRevealTerritory (le Maroc s'allume gold pendant la voix)
// + overlay "DANS 2 ANS" + karaoké forced alignment
// Doctrine : altitude pays entier (P2bis), drift continu (P2), effet vivant dès f0 (P3)

const SEG = SEGMENTS.beat0_hook;
const DURATION = SEG.endFrame - SEG.startFrame; // 244

const GOLD  = "#c8a951";
const IVORY = "#f2ebd9";
const NAVY  = "#16213a";

// ── Karaoké forced alignment ──────────────────────────────────────────────────
type WordTs = [string, number, number];

function buildPhrases(words: WordTs[], beatStartS: number) {
  const phrases: { words: WordTs[]; start: number; end: number }[] = [];
  let current: WordTs[] = [];
  for (let i = 0; i < words.length; i++) {
    current.push(words[i]);
    const next = words[i + 1];
    const gap = next ? next[1] - words[i][2] : 999;
    if (gap > 0.4 || current.length >= 6 || !next) {
      phrases.push({
        words: [...current],
        start: current[0][1] - beatStartS,
        end: current[current.length - 1][2] - beatStartS,
      });
      current = [];
    }
  }
  return phrases;
}

const KaraokeSubtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentS = SEG.startS + frame / fps;
  // Tous les mots du segment (pas seulement les anchors)
  const beatWords = MAROC_WORDS.filter(w => w[1] >= SEG.startS - 0.05 && w[2] <= SEG.endS + 0.1);
  const phrases = buildPhrases(beatWords, SEG.startS);

  const hardShadow = "2px 2px 0 #000,-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000,0 0 8px rgba(0,0,0,0.9)";
  const goldGlow   = "0 0 16px rgba(200,169,81,0.8),2px 2px 0 #000,-2px -2px 0 #000";

  return (
    <div style={{ position: "absolute", bottom: 160, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      {phrases.map((phrase, i) => {
        const nextStart = phrases[i + 1]?.start ?? (SEG.endS - SEG.startS);
        const localFrame = frame - Math.round(phrase.start * fps);
        const displayFrames = Math.round((nextStart - phrase.start) * fps) + 5;
        if (localFrame < 0 || localFrame > displayFrames) return null;
        const fadeIn  = spring({ frame: localFrame, fps, config: { damping: 35, stiffness: 130 } });
        const fadeOut = interpolate(localFrame, [displayFrames - 6, displayFrames + 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, opacity: Math.min(fadeIn, fadeOut), textAlign: "center", padding: "0 48px" }}>
            <div style={{ display: "inline-block", background: "linear-gradient(180deg,rgba(0,0,0,0.4) 0%,rgba(0,0,0,0.65) 100%)", padding: "14px 24px", borderRadius: 12, backdropFilter: "blur(2px)" }}>
              <p style={{ fontFamily: "'Anton',sans-serif", fontSize: 62, fontWeight: 400, margin: 0, lineHeight: 1.15, letterSpacing: "0.02em", textTransform: "uppercase", wordBreak: "break-word" }}>
                {phrase.words.map((w, j) => (
                  <span key={j} style={{ color: currentS >= w[1] ? GOLD : "#fff", textShadow: currentS >= w[1] ? goldGlow : hardShadow, marginRight: 10, display: "inline-block" }}>
                    {w[0]}
                  </span>
                ))}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Composant principal ───────────────────────────────────────────────────────
export const Beat0Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "DANS 2 ANS" — apparaît dès f8 (quand "deux" est prononcé selon forced alignment)
  const titleSp = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 18, stiffness: 120 }, durationInFrames: 25 });
  const titleOp = interpolate(frame, [8, 22, DURATION - 20, DURATION - 5], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const volNarr  = interpolate(frame, [0, 8, DURATION - 15, DURATION], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const volMusic = interpolate(frame, [0, 20, DURATION - 20, DURATION], [0, 0.12, 0.12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <Audio src={staticFile("souverain/maroc-batteries/audio/narration-maroc-v3.mp3")} startFrom={SEG.startFrame} volume={volNarr} />
      <Audio src={staticFile("souverain/maroc-batteries/audio/music-C-analytique-tendu.mp3")} startFrom={0} volume={volMusic} />
      {/* SFX — <Sequence> OBLIGATOIRE. Plancher 0.50. PAS de swoosh-zoom (carte fixe, pas de zoom-in). */}
      {/* Le ping accompagne le demarrage du faisceau sweep (le vrai evenement visuel). */}
      <Sequence from={30} durationInFrames={20}><Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} volume={0.50} /></Sequence>
      <Sequence from={90} durationInFrames={20}><Audio src={staticFile("_shared/sfx/data/stat-tick.mp3")} volume={0.50} /></Sequence>

      {/* Carte vivante — SweepRevealTerritory : le Maroc s'allume gold */}
      {/* Altitude pays entier (P2bis) : baseZoom 4.8, drift drift continu interne au composant */}
      <SweepRevealTerritory
        countryIso="MAR"
        geoName={["Morocco", "W. Sahara"]}
        boundaryIsos={["ESH"]}
        center={[-6.0, 32.0]}
        baseZoom={4.8}
        label="MAROC"
        sweepAt={30}
        sweepDur={60}
        durationFrames={DURATION}
        accentColor={GOLD}
        showHatching
      />

      {/* Vignette lisibilité */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(22,33,58,0.45) 0%,rgba(22,33,58,0.0) 40%,rgba(22,33,58,0.4) 100%)", pointerEvents: "none" }} />

      {/* "DANS 2 ANS" — titre choc haut d'écran */}
      <div style={{
        position: "absolute", top: 140, left: 0, right: 0,
        display: "flex", justifyContent: "center",
        opacity: titleOp,
        transform: `translateY(${(1 - titleSp) * 18}px)`,
        pointerEvents: "none",
      }}>
        <span style={{
          fontFamily: "'IBM Plex Mono',monospace",
          fontSize: 80, fontWeight: 700,
          color: GOLD, letterSpacing: "0.08em",
          textShadow: "0 2px 24px rgba(0,0,0,0.7)",
        }}>
          DANS 2 ANS
        </span>
      </div>

      {/* Karaoké */}
      <KaraokeSubtitles />
    </AbsoluteFill>
  );
};
