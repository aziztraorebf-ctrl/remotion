import React from "react";
import {
  AbsoluteFill, Audio, Img, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { fadeIn } from "../../_shared/animations";
import * as M from "./beat4/manifest";
import { SubtitleBar } from "./SubtitleBar";

export const BEAT4_DURATION = M.DURATION_FRAMES;

const GOLD  = "#c8a951";
const IVORY = "#f0e8d8";
const RED   = "#cc2200";
const GREEN = "#4caf7d";

const MUSIC_PATH       = "souverain/silicon-savannah/audio/music/music-A.mp3";
const MUSIC_START_FROM = 1369;
const BAR_DURATION     = 25;

const SUBTITLES = [
  { text: "Mais voilà ce qu'on dit moins.",                           start:   0, end:  54 },
  { text: "200 shillings envoyés — 7 shillings de frais.",            start:  83, end: 194 },
  { text: "Moins d'un centime d'euro.",                               start: 194, end: 230 },
  { text: "50 000 shillings envoyés — 108 shillings de frais.",       start: 255, end: 365 },
  { text: "Moins d'un euro.",                                         start: 395, end: 441 },
  { text: "Même service. Même tuyau.",                                start: 441, end: 487 },
  { text: "Plus la somme est petite, plus le pourcentage est élevé.", start: 511, end: 596 },
  { text: "C'est dans le barème officiel de Safaricom.",              start: 618, end: 662 },
  { text: "La Banque centrale du Kenya a laissé faire.",              start: 718, end: 787 },
];

// Compteur animé : interpole une valeur numérique et formate
function useCounter(frame: number, appearFrame: number, target: number, decimals: number) {
  const progress = interpolate(frame, [appearFrame, appearFrame + BAR_DURATION + 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (progress * target).toFixed(decimals);
}

function BarCol({
  frame, fps, appearFrame,
  label, sublabel, pctFinal, pctDecimals,
  barRatio, color, alignRight,
  verdictFrame,
}: {
  frame: number; fps: number; appearFrame: number;
  label: string; sublabel: string;
  pctFinal: number; pctDecimals: number;
  barRatio: number;
  color: string;
  alignRight: boolean;
  verdictFrame: number;
}) {
  const colOpacity = interpolate(frame, [appearFrame, appearFrame + 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const colSlide = interpolate(
    spring({ frame: frame - appearFrame, fps, config: { damping: 70, stiffness: 55 }, durationInFrames: 30 }),
    [0, 1], [alignRight ? -30 : 30, 0]
  );

  // Barre easing convexe
  const rawProg = interpolate(frame, [appearFrame, appearFrame + BAR_DURATION], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const barWidth    = Math.pow(rawProg, 0.7) * 100;
  const barComplete = frame >= appearFrame + BAR_DURATION;

  // TYPE E — vibration barre rouge ±2°
  const barVibrate = (barComplete && color === RED && frame < appearFrame + BAR_DURATION + 20)
    ? Math.sin((frame - (appearFrame + BAR_DURATION)) * 0.8) * 2
    : 0;

  // POLISH 4 — barre rouge pulse au verdict (brightness 1→1.6→1)
  const barHighlight = color === RED
    ? interpolate(
        frame,
        [verdictFrame, verdictFrame + 8, verdictFrame + 16, verdictFrame + 24, verdictFrame + 32],
        [1, 1.6, 1, 1.6, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 1;

  // POLISH 5 — "5%" tremble au verdict
  const pctShake = color === RED && frame >= verdictFrame && frame < verdictFrame + 12
    ? Math.sin((frame - verdictFrame) * 3.5) * 3
    : 0;

  // TYPE A — bounce pct
  const pctBounce = spring({
    frame: frame - (appearFrame + BAR_DURATION), fps,
    config: { damping: 6, stiffness: 200 },
    durationInFrames: 20,
  });
  const pctScale = interpolate(pctBounce, [0, 1], [1, 1.06]);

  // POLISH 1 — compteur animé
  const counterVal = useCounter(frame, appearFrame, pctFinal, pctDecimals);
  const pctDisplay = pctDecimals === 0 ? `${counterVal}%` : `${counterVal}%`;

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
          fontSize: 35, color: IVORY, letterSpacing: 3,
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: "monospace", fontSize: 24,
          color: GOLD, opacity: 0.7,
        }}>
          {sublabel}
        </div>
      </div>

      {/* Barre */}
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
          width: `${barWidth * barRatio}%`,
          height: "100%",
          background: color,
          borderRadius: 4,
          boxShadow: `0 0 20px ${color}99`,
          marginLeft: alignRight ? "auto" : 0,
        }} />
      </div>

      {/* Pourcentage — compteur animé + tremblement au verdict */}
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 120,
        color,
        lineHeight: 1,
        transform: `scale(${pctScale}) translateX(${pctShake}px)`,
        transformOrigin: alignRight ? "right center" : "left center",
        textShadow: `0 0 30px ${color}88, 0 0 60px ${color}44`,
        width: "100%",
        textAlign,
      }}>
        {pctDisplay}
      </div>
    </div>
  );
}

export const Beat4Prix: React.FC<{ globalMusic?: boolean; globalAudio?: boolean }> = ({ globalMusic = false, globalAudio = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns fond
  const bgScale = interpolate(frame, [0, M.DURATION_FRAMES], [1.0, 1.06], { extrapolateRight: "clamp" });

  // Piece
  const coinGlowRadius  = interpolate(Math.sin(frame / 9), [-1, 1], [20, 80]);
  const coinFloat       = Math.sin((frame / 110) * Math.PI * 2) * 6;
  const coinEntrySpring = spring({ frame, fps, config: { damping: 14, stiffness: 90 }, durationInFrames: 40 });
  const coinScale       = interpolate(coinEntrySpring, [0, 1], [0.3, 1.0]);

  // Ping ring TYPE F
  const pingCycle       = frame % 50;
  const pingRingScale   = interpolate(pingCycle, [0, 49], [0.9, 2.4]);
  const pingRingOpacity = interpolate(pingCycle, [0, 20, 49], [0.5, 0.25, 0]);

  // Titre
  const titleOpacity = fadeIn(frame, 0, 15);

  // POLISH 3 — ligne séparation gold : s'étire depuis le centre quand barre rouge apparaît
  const lineGrow = interpolate(
    spring({ frame: frame - M.SEG.sh200, fps, config: { damping: 60, stiffness: 45 }, durationInFrames: 40 }),
    [0, 1], [0, 1]
  );
  const lineOpacity = interpolate(frame, [M.SEG.sh200, M.SEG.sh200 + 20], [0, 0.4], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Verdict
  const verdictSpring = spring({
    frame: frame - M.SEG.meme, fps,
    config: { damping: 12, stiffness: 100 },
    durationInFrames: 35,
  });
  const verdictSlide   = interpolate(verdictSpring, [0, 1], [80, 0]);
  const verdictOpacity = interpolate(frame, [M.SEG.meme, M.SEG.meme + 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const verdictVibrate = (frame >= M.SEG.meme && frame < M.SEG.meme + 20)
    ? Math.sin((frame - M.SEG.meme) * 2.5) * 1.5
    : 0;

  // POLISH 2 — verdict glow pulsant après apparition
  const verdictGlow = frame >= M.SEG.meme + 20
    ? interpolate(Math.sin((frame - M.SEG.meme - 20) / 18), [-1, 1], [10, 40])
    : 10;

  // POLISH 6 — fond rougit légèrement au verdict
  const bgRedOpacity = interpolate(frame, [M.SEG.meme, M.SEG.meme + 30], [0, 0.08], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Strobe
  const strobeOpacity = (frame >= M.SEG.meme - 3 && frame < M.SEG.meme) ? 0.20 : 0;

  return (
    <AbsoluteFill className="bg-[#141c2e] overflow-hidden">
      {!globalAudio && <Audio src={staticFile(M.AUDIO)} />}
      {!globalMusic && <Audio src={staticFile(MUSIC_PATH)} startFrom={MUSIC_START_FROM} volume={0.07} />}

      {/* Fond Ken Burns */}
      <AbsoluteFill style={{ transform: `scale(${bgScale})`, transformOrigin: "center" }}>
        <Img
          src={staticFile(M.BG)}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.20 }}
        />
      </AbsoluteFill>

      {/* Degrade radial central */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 50%, #1a2d5a 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* POLISH 6 — fond rouge au verdict */}
      <AbsoluteFill style={{
        background: RED,
        opacity: bgRedOpacity,
        pointerEvents: "none",
      }} />

      {/* TITRE */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div
          className="text-center w-full absolute"
          style={{
            top: 100,
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 38,
            color: IVORY,
            letterSpacing: 8,
            opacity: titleOpacity * 0.75,
          }}
        >
          FRAIS M-PESA — BARÈME OFFICIEL
        </div>
      </AbsoluteFill>

      {/* RANGÉE 3 COLONNES */}
      <AbsoluteFill className="flex flex-row items-center justify-center px-12">

        {/* COL GAUCHE — barre rouge */}
        <div className="flex flex-col items-end justify-center" style={{ flex: "0 0 35%", paddingRight: 24 }}>
          <BarCol
            frame={frame} fps={fps} appearFrame={M.SEG.sh200}
            label="ENVOIE 200 KES" sublabel="≈ 1,5€"
            pctFinal={5} pctDecimals={0}
            barRatio={1.0} color={RED} alignRight={true}
            verdictFrame={M.SEG.meme}
          />
        </div>

        {/* COL CENTRE — pièce + lignes séparation */}
        <div
          className="flex items-center justify-center shrink-0 relative"
          style={{ width: 350 }}
        >
          {/* POLISH 3 — lignes gold gauche et droite qui s'étirent */}
          <div style={{
            position: "absolute",
            left: 0, top: "50%",
            width: 2,
            height: `${lineGrow * 320}px`,
            transform: "translateY(-50%)",
            background: `linear-gradient(to bottom, transparent, ${GOLD}, transparent)`,
            opacity: lineOpacity,
          }} />
          <div style={{
            position: "absolute",
            right: 0, top: "50%",
            width: 2,
            height: `${lineGrow * 320}px`,
            transform: "translateY(-50%)",
            background: `linear-gradient(to bottom, transparent, ${GOLD}, transparent)`,
            opacity: lineOpacity,
          }} />

          {/* Glow div derrière */}
          <div style={{
            position: "absolute",
            width: 350, height: 350,
            borderRadius: "50%",
            boxShadow: `0 0 ${coinGlowRadius}px ${coinGlowRadius / 2}px rgba(200,169,81,0.65)`,
            transform: `translateY(${coinFloat}px) scale(${coinScale})`,
            pointerEvents: "none",
          }} />

          {/* Ping ring */}
          <div style={{
            position: "absolute",
            width: 350, height: 350,
            borderRadius: "50%",
            border: `2px solid ${GOLD}`,
            transform: `translateY(${coinFloat}px) scale(${pingRingScale})`,
            opacity: pingRingOpacity,
            pointerEvents: "none",
          }} />

          {/* Pièce */}
          <Img
            src={staticFile("souverain/silicon-savannah/assets/shilling-hero.png")}
            style={{
              width: 350, height: 350,
              objectFit: "contain",
              transform: `translateY(${coinFloat}px) scale(${coinScale})`,
            }}
          />
        </div>

        {/* COL DROITE — barre verte */}
        <div className="flex flex-col items-start justify-center" style={{ flex: "0 0 35%", paddingLeft: 24 }}>
          <BarCol
            frame={frame} fps={fps} appearFrame={M.SEG.sh50k}
            label="ENVOIE 50 000 KES" sublabel="≈ 380€"
            pctFinal={0.22} pctDecimals={2}
            barRatio={0.05} color={GREEN} alignRight={false}
            verdictFrame={M.SEG.meme}
          />
        </div>
      </AbsoluteFill>

      {/* VERDICT */}
      <AbsoluteFill
        className="flex flex-col items-center justify-end text-center px-10"
        style={{ paddingBottom: 220 }}
      >
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 80,
          color: RED,
          lineHeight: 1.15,
          opacity: verdictOpacity,
          transform: `translateY(${verdictSlide + verdictVibrate}px)`,
          // POLISH 2 — glow pulsant après apparition
          textShadow: `0 0 ${verdictGlow}px ${RED}, 0 0 ${verdictGlow * 2}px ${RED}66`,
        }}>
          PLUS TU ES PAUVRE,
          <br />
          PLUS TU PAIES.
        </div>
      </AbsoluteFill>

      {/* Strobe */}
      {strobeOpacity > 0 && (
        <AbsoluteFill style={{ background: "white", opacity: strobeOpacity, pointerEvents: "none" }} />
      )}

      <SubtitleBar lines={SUBTITLES} />

      {/* Source */}
      <AbsoluteFill
        className="flex items-end justify-end"
        style={{ padding: "0 54px 80px", opacity: fadeIn(frame, M.SEG.bareme, 20) * 0.45 }}
      >
        <span style={{ fontFamily: "monospace", fontSize: 20, color: IVORY }}>
          Safaricom · CBK 2024
        </span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
