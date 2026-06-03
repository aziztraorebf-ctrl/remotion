import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { TextChoc } from "../../_shared/components/layouts/TextChoc";
import { GridOverlay } from "../../_shared/components/overlays/GridOverlay";
import { appearOrganic } from "../../_shared/animations";

/**
 * A6 Question — beat final du Short Maroc Batteries (Remotion pur, climax émotionnel).
 * 2e beat produit via le système HERO DATA.
 * Script (~10.2s) : "Et ça pose une question que personne ne formule encore clairement :
 *   si le Maroc contrôle le phosphate ET l'assemblage, qui fixe le prix de la batterie dans dix ans ?"
 *
 * Structure (storyboard validé) : condition (PHOSPHATE—ET—ASSEMBLAGE reliés)
 *   → question (TextChoc QUI FIXE LE PRIX, PRIX en gold) → suspension (DANS 10 ANS ?).
 * Doctrine P3 (respiration), P6 (highlight typo), P8 (pas de slideshow — reveals organiques).
 */

// Beat calé sur la phrase-clé "si le Maroc contrôle le phosphate ET l'assemblage,
// qui fixe le prix dans dix ans ?" (103.379s → 109.46s) + hold final.
export const A6_QUESTION_FRAMES = 215;

const GOLD = "#c8a951";
const IVORY = "#f0e8d8";

const NARRATION = "souverain/maroc-batteries/audio/narration-maroc-v3.mp3";
const MUSIC = "souverain/maroc-batteries/audio/music-C-analytique-tendu.mp3";
const SEG_START_FRAME = 3101; // 103.379s * 30 — "si le Maroc contrôle..."

const SFX = {
  node: "_shared/sfx/ui/node-appear.mp3",   // jonction PHOSPHATE—ET—ASSEMBLAGE
  whoosh: "_shared/sfx/ui/whoosh.mp3",       // transition vers la question
  impact: "_shared/sfx/impact/impact.mp3",   // "DANS 10 ANS ?" suspension
};

// Frames locales calées sur la voix (segment commence à f3101 = "si le Maroc...").
const F_COND = 30;       // "le phosphate" (105.08s) — PHOSPHATE apparait
const F_LINK = 80;       // "ET l'assemblage" (105.94s) — le ET relie
const F_QUESTION = 128;  // "qui fixe le prix" (107.38s) — TextChoc
const F_SUSPENSE = 173;  // "dans dix ans" (109.18s) — DANS 10 ANS ?

// Mot-clé condition (PHOSPHATE / ASSEMBLAGE) avec pop organique
const CondWord: React.FC<{ text: string; appearAt: number }> = ({ text, appearAt }) => {
  const frame = useCurrentFrame();
  return (
    <div style={appearOrganic(frame, appearAt, 18)}>
      <span
        className="text-gold"
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 92, letterSpacing: 4, textShadow: `0 0 30px ${GOLD}66`, whiteSpace: "nowrap" }}
      >
        {text}
      </span>
    </div>
  );
};

export const A6Question: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // La phase condition s'efface quand la question arrive
  const condOpacity = interpolate(frame, [F_QUESTION - 20, F_QUESTION], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ligne de jonction qui se dessine entre les 2 mots
  const linkGrow = interpolate(
    spring({ frame: frame - F_LINK, fps, config: { damping: 30, stiffness: 60 }, durationInFrames: 25 }),
    [0, 1],
    [0, 1]
  );

  // "ET" central qui pop
  const etScale = interpolate(
    spring({ frame: frame - F_LINK, fps, config: { damping: 8, stiffness: 180 }, durationInFrames: 20 }),
    [0, 1],
    [0, 1]
  );

  // Tension finale : léger pulse sur "DANS 10 ANS ?"
  const suspensePulse = frame >= F_SUSPENSE ? 1 + 0.03 * Math.sin((frame - F_SUSPENSE) / 6) : 1;

  return (
    <AbsoluteFill className="bg-navy overflow-hidden">
      {/* AUDIO */}
      <Audio src={staticFile(NARRATION)} startFrom={SEG_START_FRAME} />
      <Audio src={staticFile(MUSIC)} startFrom={SEG_START_FRAME} volume={0.13} />
      <Sequence from={F_LINK} durationInFrames={20}>
        <Audio src={staticFile(SFX.node)} volume={0.55} />
      </Sequence>
      <Sequence from={F_QUESTION - 6} durationInFrames={20}>
        <Audio src={staticFile(SFX.whoosh)} volume={0.5} />
      </Sequence>
      <Sequence from={F_SUSPENSE} durationInFrames={30}>
        <Audio src={staticFile(SFX.impact)} volume={0.6} />
      </Sequence>

      {/* Fond enrichi (P2) */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 46%, #1e2d4a 0%, #141c2e 60%, #0d1420 100%)",
          pointerEvents: "none",
        }}
      />
      <GridOverlay opacity={0.05} noiseOpacity={0.035} />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 85% 75% at 50% 46%, transparent 52%, rgba(8,13,20,0.55) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* PHASE 1 — Condition : PHOSPHATE / ET / ASSEMBLAGE empilés verticalement (zéro chevauchement) */}
      {frame < F_QUESTION && (
        <AbsoluteFill className="flex flex-col items-center justify-center" style={{ opacity: condOpacity, gap: 44 }}>
          <CondWord text="PHOSPHATE" appearAt={F_COND} />

          {/* Jonction verticale : ligne + badge ET */}
          <div className="flex flex-col items-center" style={{ position: "relative" }}>
            <div
              style={{
                width: 3,
                height: `${linkGrow * 50}px`,
                background: `linear-gradient(to bottom, transparent, ${GOLD})`,
                boxShadow: `0 0 10px ${GOLD}`,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                transform: `scale(${etScale})`,
                width: 76,
                height: 76,
                borderRadius: "50%",
                background: "#141c2e",
                border: `2.5px solid ${GOLD}`,
                boxShadow: `0 0 28px ${GOLD}99`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: GOLD, letterSpacing: 1 }}>ET</span>
            </div>
            <div
              style={{
                width: 3,
                height: `${linkGrow * 50}px`,
                background: `linear-gradient(to top, transparent, ${GOLD})`,
                boxShadow: `0 0 10px ${GOLD}`,
                marginTop: 8,
              }}
            />
          </div>

          <CondWord text="ASSEMBLAGE" appearAt={F_COND + 18} />
        </AbsoluteFill>
      )}

      {/* PHASE 2 — La question (TextChoc mot-par-mot, PRIX en gold) */}
      {frame >= F_QUESTION && frame < F_SUSPENSE && (
        <Sequence from={F_QUESTION}>
          <TextChoc
            words={["QUI", "FIXE", "LE", "PRIX", "?"]}
            accentIndex={3}
            accentColor={GOLD}
            fontSize={150}
            underlineAccent
            bgColor="transparent"
          />
        </Sequence>
      )}

      {/* PHASE 3 — Suspension : DANS 10 ANS ? */}
      {frame >= F_SUSPENSE && (
        <AbsoluteFill className="flex items-center justify-center">
          <div style={{ opacity: appearOrganic(frame, F_SUSPENSE, 16).opacity, transform: `scale(${suspensePulse})` }}>
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 108,
                color: IVORY,
                letterSpacing: 4,
                textShadow: `0 0 40px ${GOLD}55`,
                display: "block",
                textAlign: "center",
                lineHeight: 1,
              }}
            >
              DANS <span style={{ color: GOLD }}>10 ANS</span> ?
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* Source */}
      <AbsoluteFill className="flex items-end justify-end" style={{ padding: "0 54px 70px" }}>
        <span className="text-ivory" style={{ fontFamily: "monospace", fontSize: 20, opacity: 0.4 }}>
          Souverain · Maroc Batteries
        </span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
