import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { HeroVerticalBars } from "../../_shared/components/layouts/HeroVerticalBars";
import { FloatingHeroObject } from "../../_shared/components/layouts/FloatingHeroObject";
import { SubtitleBarSouverain } from "../../_shared/components/ui/SubtitleBarSouverain";
import { GridOverlay } from "../../_shared/components/overlays/GridOverlay";
import { appearOrganic } from "../../_shared/animations";

// Audio (segment A3 = portion de la narration globale, commence à 31.059s = f932)
const NARRATION = "souverain/maroc-batteries/audio/narration-maroc-v3.mp3";
const MUSIC = "souverain/maroc-batteries/audio/music-C-analytique-tendu.mp3";
const SEG_START_FRAME = 932; // 31.059s * 30fps — où A3 commence dans la narration globale

// SFX (doctrine SOUVERAIN-REMOTION-PLAYBOOK section SFX — plancher volume 0.5)
const SFX = {
  reveal: "_shared/sfx/ui/node-appear.mp3",   // caillou apparait (reveal.mp3 était CORROMPU = voix fantôme 18s)
  whoosh: "_shared/sfx/ui/whoosh.mp3",         // barres montent
  tick: "_shared/sfx/data/counter-tick.mp3",   // count-up des %
  impact: "_shared/sfx/impact/impact.mp3",     // verdict (barre or domine)
  stamp: "_shared/sfx/ui/stamp-dossier.mp3",   // cartouche "ENCAISSÉE AILLEURS"
};

/**
 * A3 Cailloux — segment data-viz du Short Maroc Batteries (V3 verticale).
 * Test bout-en-bout du système HERO DATA (doctrine SOUVERAIN-REMOTION-PLAYBOOK).
 * Script (~12.3s) : "Pendant des décennies, le Maroc exportait ce phosphate brut.
 *   Des cailloux. À bas prix. D'autres le transformaient, encaissaient la valeur ajoutée."
 *
 * V3 : barres VERTICALES (anti-vide — le contraste de hauteur incarne le déséquilibre)
 *   + caillou plus gros central + cartouches pour les textes (DES CAILLOUX / ENCAISSÉE AILLEURS).
 * Combinaison : HeroVerticalBars + FloatingHeroObject + GridOverlay + SubtitleBarSouverain.
 */

export const A3_CAILLOUX_FRAMES = 368;

const RED = "#cc2200";
const GOLD = "#c8a951";

const F_INTRO = 8;        // caillou apparait
const F_BARS = 175;       // "le transformaient" — barres montent
const F_VERDICT = 300;    // "valeur ajoutée" — verdict (barre or domine)

const SUBS = [
  { text: "Pendant des décennies, le Maroc exportait ce phosphate brut.", start: 0, end: 128 },
  { text: "Des cailloux. À bas prix.", start: 128, end: 172 },
  { text: "D'autres le transformaient, encaissaient la valeur ajoutée.", start: 172, end: 368 },
];

// Cartouche texte (plaque navy translucide + bordure or) — évite le texte "collé après coup"
const Cartouche: React.FC<{
  text: string;
  color: string;
  frame: number;
  appearAt: number;
  fontSize?: number;
}> = ({ text, color, frame, appearAt, fontSize = 60 }) => (
  <div
    style={{
      ...appearOrganic(frame, appearAt, 16),
      display: "inline-block",
      padding: "12px 36px",
      background: "rgba(20,28,46,0.78)",
      border: `2px solid ${color}`,
      borderRadius: 6,
      boxShadow: `0 0 30px ${color}44, inset 0 0 20px rgba(0,0,0,0.3)`,
      backdropFilter: "blur(2px)",
    }}
  >
    <span
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize,
        color,
        letterSpacing: 5,
        lineHeight: 1,
      }}
    >
      {text}
    </span>
  </div>
);

export const A3Cailloux: React.FC = () => {
  const frame = useCurrentFrame();

  // Caillou : gros au début (seul), légèrement réduit quand les barres arrivent (reste proéminent)
  const cailScale = interpolate(frame, [F_BARS - 20, F_BARS + 12], [1, 0.78], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const showBars = frame >= F_BARS;

  const caillou = (size: number) => (
    <FloatingHeroObject
      src="souverain/maroc-batteries/beat3/caillou-phosphate.png"
      appearFrame={F_INTRO}
      size={size}
      color={GOLD}
      clipCircle
      spin
      ring={!showBars}
    />
  );

  return (
    <AbsoluteFill className="bg-navy overflow-hidden">
      {/* AUDIO — narration globale (portion segment) + musique + SFX */}
      <Audio src={staticFile(NARRATION)} startFrom={SEG_START_FRAME} />
      <Audio src={staticFile(MUSIC)} startFrom={SEG_START_FRAME} volume={0.13} />
      {/* SFX ponctuels via Sequence (plancher volume 0.5, doctrine) */}
      <Sequence from={F_INTRO} durationInFrames={30}>
        <Audio src={staticFile(SFX.reveal)} volume={0.6} />
      </Sequence>
      <Sequence from={F_BARS} durationInFrames={20}>
        <Audio src={staticFile(SFX.whoosh)} volume={0.55} />
      </Sequence>
      <Sequence from={F_BARS + 4} durationInFrames={40}>
        <Audio src={staticFile(SFX.tick)} volume={0.5} />
      </Sequence>
      <Sequence from={F_VERDICT} durationInFrames={30}>
        <Audio src={staticFile(SFX.impact)} volume={0.65} />
      </Sequence>
      <Sequence from={F_VERDICT + 2} durationInFrames={20}>
        <Audio src={staticFile(SFX.stamp)} volume={0.6} />
      </Sequence>

      {/* Fond enrichi (P2) : dégradé radial + grille + vignette + particules */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 46%, #1e2d4a 0%, #141c2e 60%, #0d1420 100%)",
          pointerEvents: "none",
        }}
      />
      <GridOverlay opacity={0.06} noiseOpacity={0.04} />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 85% 75% at 50% 46%, transparent 52%, rgba(8,13,20,0.5) 100%)",
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {[...Array(8)].map((_, i) => {
          const seed = i * 137.5;
          const x = seed % 100;
          const baseY = (seed * 1.7) % 100;
          const drift = Math.sin(frame / 90 + i) * 2.5;
          const op = 0.07 + 0.06 * Math.abs(Math.sin(frame / 70 + i * 1.3));
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${(baseY + drift) % 100}%`,
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: GOLD,
                opacity: op,
                boxShadow: `0 0 6px ${GOLD}`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* PHASE 2 — Barres verticales (corps, P7) + caillou central proéminent.
          Barres plus hautes/larges + caillou plus gros = meuble l'espace (feedback Aziz). */}
      {showBars && (
        <AbsoluteFill className="flex items-center justify-center" style={{ paddingBottom: 40 }}>
          <HeroVerticalBars
            appearFrame={F_BARS}
            verdictFrame={F_VERDICT}
            barDuration={36}
            maxBarHeight={680}
            barWidth={180}
            dominantColor={GOLD}
            centerWidth={420}
            left={{ label: "EXPORTÉ BRUT", sublabel: "matière première", pctFinal: 8, pctDecimals: 0, color: RED }}
            right={{ label: "VALEUR AJOUTÉE", sublabel: "transformation", pctFinal: 92, pctDecimals: 0, color: GOLD }}
            centerSlot={<div style={{ transform: `scale(${cailScale})` }}>{caillou(380)}</div>}
          />
        </AbsoluteFill>
      )}

      {/* PHASE 1 — Caillou hero seul (gros, centré). Pas de plaque texte : le vide respire,
          le caillou vit (float + glow + spin). Le sous-titre porte déjà "Des cailloux. À bas prix." */}
      {!showBars && (
        <AbsoluteFill className="flex items-center justify-center">
          <div style={{ transform: `scale(${1.7})` }}>{caillou(380)}</div>
        </AbsoluteFill>
      )}

      {/* VERDICT — cartouche "ENCAISSÉE AILLEURS" descendue (plus près des barres). */}
      {frame >= F_VERDICT && (
        <AbsoluteFill className="flex flex-col items-center justify-start" style={{ paddingTop: 300 }}>
          <Cartouche text="ENCAISSÉE AILLEURS" color={RED} frame={frame} appearAt={F_VERDICT} fontSize={54} />
        </AbsoluteFill>
      )}

      <SubtitleBarSouverain lines={SUBS} />

      {/* Source discrète (P4) */}
      <AbsoluteFill className="flex items-end justify-end" style={{ padding: "0 54px 70px" }}>
        <span className="text-ivory" style={{ fontFamily: "monospace", fontSize: 20, opacity: 0.4 }}>
          OCP · Banque mondiale
        </span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
