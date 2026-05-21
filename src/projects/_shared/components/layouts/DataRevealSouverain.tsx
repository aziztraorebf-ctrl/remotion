import React from "react";
import {
  AbsoluteFill, Audio, Img, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { fadeIn } from "../../animations";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DataBar {
  /** Label principal (ex: "ENVOIE 200 KES") */
  label: string;
  /** Sous-label monospace (ex: "≈ 1,5€") */
  sublabel?: string;
  /** Valeur finale affichée (ex: 5 ou 0.22) */
  value: number;
  /** Nombre de décimales pour le counter (0 pour entiers, 2 pour petites valeurs) */
  valueDecimals?: number;
  /** Suffixe affiché après la valeur (ex: "%", "x", "€") */
  valueSuffix?: string;
  /** Ratio de remplissage réel 0→1 (calculé depuis les vraies données) */
  barFillRatio: number;
  /** Couleur de la barre et du chiffre */
  color: string;
  /** Frame d'apparition de cette barre */
  appearFrame: number;
}

export interface DataRevealProps {
  /** Chemin staticFile de l'image pivot centrale */
  pivotAsset: string;
  /** Taille de l'image pivot en px (défaut 350) */
  pivotSize?: number;
  /** Barre gauche */
  leftBar: DataBar;
  /** Barre droite */
  rightBar: DataBar;
  /** Texte du verdict */
  verdictText: string;
  /** Frame d'apparition du verdict */
  verdictFrame: number;
  /** Titre discret en haut (ex: "FRAIS M-PESA — BARÈME OFFICIEL") */
  title?: string;
  /** Chemin staticFile du fond (opacity 0.20) */
  backgroundAsset?: string;
  /** Chemin staticFile de la narration */
  narrationAsset?: string;
  /** Chemin staticFile de la musique de fond */
  musicAsset?: string;
  /** startFrom en frames pour la musique */
  musicStartFrom?: number;
  /** Volume musique (défaut 0.07) */
  musicVolume?: number;
  /** Sous-titres calés sur la narration */
  subtitles?: Array<{ text: string; start: number; end: number }>;
  /** Frame d'apparition du crédit source */
  sourceFrame?: number;
  /** Texte du crédit source */
  sourceText?: string;
  /** Couleur NAVY de fond (défaut #141c2e) */
  bgColor?: string;
  /** Couleur GOLD pour séparateurs et glow (défaut #c8a951) */
  goldColor?: string;
  /** Couleur IVORY pour textes (défaut #f0e8d8) */
  ivoryColor?: string;
}

// ─── Constantes internes ──────────────────────────────────────────────────────

const BAR_DURATION = 25;

// ─── Hook counter animé ───────────────────────────────────────────────────────

function useCounter(frame: number, appearFrame: number, target: number, decimals: number) {
  const progress = interpolate(
    frame,
    [appearFrame, appearFrame + BAR_DURATION + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (progress * target).toFixed(decimals);
}

// ─── Composant barre ──────────────────────────────────────────────────────────

function BarCol({
  frame, fps,
  bar, alignRight, verdictFrame,
  ivoryColor, goldColor,
}: {
  frame: number;
  fps: number;
  bar: DataBar;
  alignRight: boolean;
  verdictFrame: number;
  ivoryColor: string;
  goldColor: string;
}) {
  const { appearFrame, label, sublabel, value, valueDecimals = 0, valueSuffix = "%", barFillRatio, color } = bar;

  // Entrée colonne
  const colOpacity = interpolate(frame, [appearFrame, appearFrame + 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const colSlide = interpolate(
    spring({ frame: frame - appearFrame, fps, config: { damping: 70, stiffness: 55 }, durationInFrames: 30 }),
    [0, 1],
    [alignRight ? -30 : 30, 0]
  );

  // Barre — easing convexe T4
  const rawProg = interpolate(frame, [appearFrame, appearFrame + BAR_DURATION], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const barWidth = Math.pow(rawProg, 0.7) * 100;
  const barComplete = frame >= appearFrame + BAR_DURATION;

  // Vibration post-fill
  const barVibrate = (barComplete && frame < appearFrame + BAR_DURATION + 20)
    ? Math.sin((frame - (appearFrame + BAR_DURATION)) * 0.8) * 2
    : 0;

  // Pulse au verdict
  const barHighlight = interpolate(
    frame,
    [verdictFrame, verdictFrame + 8, verdictFrame + 16, verdictFrame + 24, verdictFrame + 32],
    [1, 1.6, 1, 1.6, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Tremblement chiffre au verdict
  const valShake = frame >= verdictFrame && frame < verdictFrame + 12
    ? Math.sin((frame - verdictFrame) * 3.5) * 3
    : 0;

  // Bounce chiffre à l'arrivée
  const pctBounce = spring({
    frame: frame - (appearFrame + BAR_DURATION), fps,
    config: { damping: 6, stiffness: 200 },
    durationInFrames: 20,
  });
  const pctScale = interpolate(pctBounce, [0, 1], [1, 1.06]);

  // Counter animé T3
  const counterVal = useCounter(frame, appearFrame, value, valueDecimals);
  const textAlign = alignRight ? "right" : "left";

  return (
    <div
      className="flex flex-col gap-3 w-full"
      style={{
        opacity: colOpacity,
        transform: `translateX(${colSlide}px)`,
        alignItems: alignRight ? "flex-end" : "flex-start",
      }}
    >
      {/* Label */}
      <div style={{ textAlign, width: "100%" }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 35, color: ivoryColor, letterSpacing: 3,
        }}>
          {label}
        </div>
        {sublabel && (
          <div style={{ fontFamily: "monospace", fontSize: 24, color: goldColor, opacity: 0.7 }}>
            {sublabel}
          </div>
        )}
      </div>

      {/* Barre T2 + T4 */}
      <div
        className="w-full overflow-hidden rounded"
        style={{
          height: 70,
          background: `${color}22`,
          transform: `rotate(${barVibrate}deg)`,
          transformOrigin: alignRight ? "right center" : "left center",
          filter: `brightness(${barHighlight})`,
        }}
      >
        <div style={{
          width: `${barWidth * barFillRatio}%`,
          height: "100%",
          background: color,
          borderRadius: 4,
          boxShadow: `0 0 20px ${color}99`,
          marginLeft: alignRight ? "auto" : 0,
        }} />
      </div>

      {/* Valeur — counter + bounce + shake */}
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 120,
        color,
        lineHeight: 1,
        transform: `scale(${pctScale}) translateX(${valShake}px)`,
        transformOrigin: alignRight ? "right center" : "left center",
        textShadow: `0 0 30px ${color}88, 0 0 60px ${color}44`,
        width: "100%",
        textAlign,
      }}>
        {counterVal}{valueSuffix}
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export const DataRevealSouverain: React.FC<DataRevealProps> = ({
  pivotAsset,
  pivotSize = 350,
  leftBar,
  rightBar,
  verdictText,
  verdictFrame,
  title,
  backgroundAsset,
  narrationAsset,
  musicAsset,
  musicStartFrom = 0,
  musicVolume = 0.07,
  subtitles = [],
  sourceFrame,
  sourceText,
  bgColor = "#141c2e",
  goldColor = "#c8a951",
  ivoryColor = "#f0e8d8",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Ken Burns fond T6 ambiance
  const bgScale = interpolate(frame, [0, durationInFrames], [1.0, 1.06], { extrapolateRight: "clamp" });

  // Pivot — float + ping + glow T5
  const coinGlowRadius  = interpolate(Math.sin(frame / 9), [-1, 1], [20, 80]);
  const coinFloat       = Math.sin((frame / 110) * Math.PI * 2) * 6;
  const coinEntrySpring = spring({ frame, fps, config: { damping: 14, stiffness: 90 }, durationInFrames: 40 });
  const coinScale       = interpolate(coinEntrySpring, [0, 1], [0.3, 1.0]);

  const pingCycle       = frame % 50;
  const pingRingScale   = interpolate(pingCycle, [0, 49], [0.9, 2.4]);
  const pingRingOpacity = interpolate(pingCycle, [0, 20, 49], [0.5, 0.25, 0]);

  // Titre
  const titleOpacity = fadeIn(frame, 0, 15);

  // Separator lines T8 — s'étendent depuis pivot quand la première barre arrive
  const firstBarFrame = Math.min(leftBar.appearFrame, rightBar.appearFrame);
  const lineGrow = interpolate(
    spring({ frame: frame - firstBarFrame, fps, config: { damping: 60, stiffness: 45 }, durationInFrames: 40 }),
    [0, 1], [0, 1]
  );
  const lineOpacity = interpolate(frame, [firstBarFrame, firstBarFrame + 20], [0, 0.4], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Verdict T7
  const verdictSpring = spring({
    frame: frame - verdictFrame, fps,
    config: { damping: 12, stiffness: 100 },
    durationInFrames: 35,
  });
  const verdictSlide   = interpolate(verdictSpring, [0, 1], [80, 0]);
  const verdictOpacity = interpolate(frame, [verdictFrame, verdictFrame + 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const verdictVibrate = (frame >= verdictFrame && frame < verdictFrame + 20)
    ? Math.sin((frame - verdictFrame) * 2.5) * 1.5
    : 0;
  const verdictGlow = frame >= verdictFrame + 20
    ? interpolate(Math.sin((frame - verdictFrame - 20) / 18), [-1, 1], [10, 40])
    : 10;

  // Strobe 3f avant verdict
  const strobeOpacity = (frame >= verdictFrame - 3 && frame < verdictFrame) ? 0.20 : 0;

  // Fond rougit au verdict T6
  const verdictColor = leftBar.color;
  const bgRedOpacity = interpolate(frame, [verdictFrame, verdictFrame + 30], [0, 0.08], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Sous-titres T1
  const activeSub = subtitles.find(s => frame >= s.start && frame < s.end + 12) ?? null;
  const subOpacity = activeSub
    ? interpolate(
        frame,
        [activeSub.start, activeSub.start + 8, activeSub.end, activeSub.end + 12],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  // Source
  const sourceOpacity = sourceFrame ? fadeIn(frame, sourceFrame, 20) * 0.45 : 0;

  // Radial central
  const radialBg = `radial-gradient(ellipse 60% 40% at 50% 50%, #1a2d5a 0%, transparent 70%)`;

  return (
    <AbsoluteFill style={{ background: bgColor, overflow: "hidden" }}>

      {/* Audio T1 */}
      {narrationAsset && <Audio src={staticFile(narrationAsset)} />}
      {musicAsset && (
        <Audio src={staticFile(musicAsset)} startFrom={musicStartFrom} volume={musicVolume} />
      )}

      {/* Fond Ken Burns */}
      {backgroundAsset && (
        <AbsoluteFill style={{ transform: `scale(${bgScale})`, transformOrigin: "center" }}>
          <Img
            src={staticFile(backgroundAsset)}
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.20 }}
          />
        </AbsoluteFill>
      )}

      {/* Dégradé radial central */}
      <AbsoluteFill style={{ background: radialBg, pointerEvents: "none" }} />

      {/* Fond rougit au verdict T6 */}
      <AbsoluteFill style={{ background: verdictColor, opacity: bgRedOpacity, pointerEvents: "none" }} />

      {/* Titre */}
      {title && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div
            className="text-center w-full absolute"
            style={{
              top: 100,
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 38,
              color: ivoryColor,
              letterSpacing: 8,
              opacity: titleOpacity * 0.75,
            }}
          >
            {title}
          </div>
        </AbsoluteFill>
      )}

      {/* RANGÉE 3 COLONNES */}
      <AbsoluteFill className="flex flex-row items-center justify-center px-12">

        {/* COL GAUCHE */}
        <div className="flex flex-col items-end justify-center" style={{ flex: "0 0 35%", paddingRight: 24 }}>
          <BarCol
            frame={frame} fps={fps}
            bar={leftBar} alignRight={true}
            verdictFrame={verdictFrame}
            ivoryColor={ivoryColor} goldColor={goldColor}
          />
        </div>

        {/* COL CENTRE — pivot */}
        <div
          className="flex items-center justify-center shrink-0 relative"
          style={{ width: pivotSize }}
        >
          {/* Separator lines T8 */}
          {(["left", "right"] as const).map((side) => (
            <div key={side} style={{
              position: "absolute",
              [side]: 0,
              top: "50%",
              width: 2,
              height: `${lineGrow * 320}px`,
              transform: "translateY(-50%)",
              background: `linear-gradient(to bottom, transparent, ${goldColor}, transparent)`,
              opacity: lineOpacity,
            }} />
          ))}

          {/* Glow div derrière pivot T5 */}
          <div style={{
            position: "absolute",
            width: pivotSize, height: pivotSize,
            borderRadius: "50%",
            boxShadow: `0 0 ${coinGlowRadius}px ${coinGlowRadius / 2}px rgba(200,169,81,0.65)`,
            transform: `translateY(${coinFloat}px) scale(${coinScale})`,
            pointerEvents: "none",
          }} />

          {/* Ping ring T5 */}
          <div style={{
            position: "absolute",
            width: pivotSize, height: pivotSize,
            borderRadius: "50%",
            border: `2px solid ${goldColor}`,
            transform: `translateY(${coinFloat}px) scale(${pingRingScale})`,
            opacity: pingRingOpacity,
            pointerEvents: "none",
          }} />

          {/* Image pivot */}
          <Img
            src={staticFile(pivotAsset)}
            style={{
              width: pivotSize, height: pivotSize,
              objectFit: "contain",
              transform: `translateY(${coinFloat}px) scale(${coinScale})`,
            }}
          />
        </div>

        {/* COL DROITE */}
        <div className="flex flex-col items-start justify-center" style={{ flex: "0 0 35%", paddingLeft: 24 }}>
          <BarCol
            frame={frame} fps={fps}
            bar={rightBar} alignRight={false}
            verdictFrame={verdictFrame}
            ivoryColor={ivoryColor} goldColor={goldColor}
          />
        </div>
      </AbsoluteFill>

      {/* VERDICT T7 */}
      <AbsoluteFill
        className="flex flex-col items-center justify-end text-center px-10"
        style={{ paddingBottom: 220 }}
      >
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 80,
          color: leftBar.color,
          lineHeight: 1.15,
          opacity: verdictOpacity,
          transform: `translateY(${verdictSlide + verdictVibrate}px)`,
          textShadow: `0 0 ${verdictGlow}px ${leftBar.color}, 0 0 ${verdictGlow * 2}px ${leftBar.color}66`,
        }}>
          {verdictText}
        </div>
      </AbsoluteFill>

      {/* Strobe T7 */}
      {strobeOpacity > 0 && (
        <AbsoluteFill style={{ background: "white", opacity: strobeOpacity, pointerEvents: "none" }} />
      )}

      {/* Sous-titres T1 */}
      {activeSub && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{
            position: "absolute",
            bottom: 160, left: "50%",
            transform: "translateX(-50%)",
            width: 900, textAlign: "center",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 42, color: ivoryColor,
            letterSpacing: 2, lineHeight: 1.3,
            opacity: subOpacity,
            textShadow: "0 2px 12px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.6)",
          }}>
            {activeSub.text}
          </div>
        </AbsoluteFill>
      )}

      {/* Source */}
      {sourceText && (
        <AbsoluteFill
          className="flex items-end justify-end"
          style={{ padding: "0 54px 80px", opacity: sourceOpacity }}
        >
          <span style={{ fontFamily: "monospace", fontSize: 20, color: ivoryColor }}>
            {sourceText}
          </span>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
