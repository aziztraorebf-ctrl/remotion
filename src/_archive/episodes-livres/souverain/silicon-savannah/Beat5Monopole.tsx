import React from "react";
import {
  AbsoluteFill, Audio, Img, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { fadeIn } from "../../_shared/animations";
import * as M from "./beat5/manifest";
import { SubtitleBar } from "./SubtitleBar";

export const BEAT5_DURATION = M.DURATION_FRAMES;

const GOLD  = "#c8a951";
const IVORY = "#f0e8d8";
const NAVY  = "#112240";

const MUSIC_PATH       = "souverain/silicon-savannah/audio/music/music-A.mp3";
const MUSIC_START_FROM = 2156;

// Sous-titres calés sur timestamps Whisper
const SUBTITLES = [
  { text: "a laissé M-PESA opérer",                              start:   0, end:  58 },
  { text: "7 ans avant d'imposer un cadre réglementaire complet", start:  58, end: 165 },
  { text: "ce que la BCK appelait elle-même",                    start: 194, end: 252 },
  { text: "une approche « test and learn »",                     start: 252, end: 339 },
  { text: "7 ans pendant lesquels",                              start: 339, end: 408 },
  { text: "une seule entreprise privée est devenue",             start: 408, end: 462 },
  { text: "l'infrastructure financière d'un pays entier",        start: 462, end: 537 },
  { text: "Un seul service.",                                    start: 574, end: 636 },
  { text: "Les rails de tout un pays.",                          start: 636, end: 700 },
];

function useFloat(frame: number, amplitude = 5, period = 120) {
  return Math.sin((frame / period) * Math.PI * 2) * amplitude;
}

// Cercle SVG avec remplissage progressif + ping ring intégré
function CountdownArc({ frame, fps }: { frame: number; fps: number }) {
  const SIZE = 700;
  const R    = 300;
  const CX   = SIZE / 2;
  const CY   = SIZE / 2;
  const CIRC = 2 * Math.PI * R;

  const arcEntry = spring({ frame, fps, config: { damping: 70, stiffness: 35 }, durationInFrames: 80 });

  const fillProgress = interpolate(frame, [97, M.SEG.sept_ans], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const dashOffset = CIRC * (1 - fillProgress);

  const flashBrightness = interpolate(
    frame,
    [M.SEG.sept_ans, M.SEG.sept_ans + 3, M.SEG.sept_ans + 10],
    [1, 2.0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Ping ring dans le même SVG — même centre garanti
  const cycle       = frame % 60;
  const pingScale   = interpolate(cycle, [0, 59], [1.0, 1.9]);
  const pingR       = R * pingScale;
  const pingOpacity = interpolate(cycle, [0, 20, 59], [0.45, 0.15, 0]) * arcEntry;

  return (
    <svg
      width={SIZE} height={SIZE}
      style={{ overflow: "visible", filter: `brightness(${flashBrightness})` }}
    >
      <defs>
        <filter id="arc-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Cercle fantôme */}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke={GOLD} strokeWidth={2} strokeOpacity={arcEntry * 0.15} />
      {/* Arc de remplissage */}
      <circle
        cx={CX} cy={CY} r={R}
        fill="none" stroke={GOLD} strokeWidth={18}
        strokeDasharray={CIRC} strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${CX} ${CY})`}
        filter="url(#arc-glow)"
        opacity={arcEntry}
      />
      {/* Ping ring — même centre, dans le SVG */}
      <circle cx={CX} cy={CY} r={pingR} fill="none" stroke={GOLD} strokeWidth={2} opacity={pingOpacity} />
    </svg>
  );
}

// Count-up années 2007→2013 — défile sous "7 ANS"
function YearCountup({ frame }: { frame: number }) {
  const YEARS = [2007, 2008, 2009, 2010, 2011, 2012, 2013];
  const STEP  = 26; // ~15f par année sur 182f (97→279)
  const idx   = Math.min(
    YEARS.length - 1,
    Math.floor(Math.max(0, frame - 97) / STEP)
  );
  const yr = YEARS[idx];

  // Bounce léger à chaque changement d'année
  const localFrame = (frame - 97) % STEP;
  const bounceScale = spring({
    frame: localFrame, fps: M.FPS,
    config: { damping: 8, stiffness: 200 },
    durationInFrames: 12,
  });
  const scale = interpolate(bounceScale, [0, 1], [1, 1.08]);
  const opacity = interpolate(frame, [97, 115], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <div style={{
      fontFamily: "monospace",
      fontSize: 36, color: GOLD,
      letterSpacing: 6, opacity: opacity * 0.65,
      transform: `scale(${scale})`,
      transformOrigin: "center",
      marginTop: 12,
    }}>
      {yr}
    </div>
  );
}

// Rails rayonnants depuis le sommet de la tour
function RailsNetwork({ progress, frame, originY }: { progress: number; frame: number; originY: number }) {
  const W        = 1080;
  const H        = 1920;
  const CX       = W / 2;
  const CY       = originY;
  const NUM_RAILS = 18;
  const pingCycle = frame % 40;
  const pingR     = interpolate(pingCycle, [0, 30, 39], [0, 12, 0]);
  const pingOp    = interpolate(pingCycle, [0, 15, 39], [0.7, 0, 0]);

  return (
    <svg width={W} height={H} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
      <defs>
        <filter id="rail-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {Array.from({ length: NUM_RAILS }, (_, i) => {
        const angle = (i / NUM_RAILS) * Math.PI * 2 - Math.PI / 2;
        const endX  = CX + Math.cos(angle) * 720;
        const endY  = CY + Math.sin(angle) * 960;
        const lineP = Math.min(1, Math.max(0, (progress * NUM_RAILS - i)));
        const tipX  = CX + (endX - CX) * lineP;
        const tipY  = CY + (endY - CY) * lineP;
        const isComplete = lineP >= 0.98;
        return (
          <g key={i}>
            <line
              x1={CX} y1={CY} x2={tipX} y2={tipY}
              stroke={GOLD} strokeWidth={2} strokeOpacity={0.5}
              filter="url(#rail-glow)"
            />
            {isComplete && (
              <circle cx={tipX} cy={tipY} r={pingR}
                fill="none" stroke={GOLD} strokeWidth={1.2} opacity={pingOp} />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export const Beat5Monopole: React.FC<{ globalMusic?: boolean; globalAudio?: boolean }> = ({ globalMusic = false, globalAudio = false }) => {
  const frame = useCurrentFrame();
  const { fps }  = useVideoConfig();
  const floatY   = useFloat(frame, 5, 120);
  const bgScale  = interpolate(frame, [0, M.DURATION_FRAMES], [1.0, 1.06], { extrapolateRight: "clamp" });

  // ─── PHASE A ───
  const arcOpacity      = fadeIn(frame, 0, 30);
  const label7Opacity   = fadeIn(frame, 60, 25);
  const subLabelOpacity = fadeIn(frame, M.SEG.sept_ans, 20);

  // Float sinusoïdal permanent sur "7 ANS"
  const sevenFloat  = Math.sin((frame / 110) * Math.PI * 2) * 4;
  const sevenSlowZoom = interpolate(frame, [60, M.SEG.sept_ans], [1.0, 1.04], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // "7 ANS" monte vers tiers supérieur en Phase B
  const labelMoveUp = interpolate(frame, [M.SEG.sept_ans, M.SEG.sept_ans + 50], [0, -340], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const labelShrink = interpolate(frame, [M.SEG.sept_ans, M.SEG.sept_ans + 50], [1, 0.42], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const labelPhaseB = interpolate(frame, [M.SEG.sept_ans, M.SEG.sept_ans + 50], [1, 0.5], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Bounce "7 ANS" au complet
  const sevenBounce = spring({
    frame: frame - M.SEG.sept_ans, fps,
    config: { damping: 6, stiffness: 200 },
    durationInFrames: 20,
  });
  const sevenBounceScale = interpolate(sevenBounce, [0, 1], [1, 1.06]);

  // ─── PHASE B ───
  const towerSpring = spring({
    frame: frame - M.SEG.sept_ans, fps,
    config: { damping: 75, stiffness: 50 },
    durationInFrames: 60,
  });
  const towerY      = interpolate(towerSpring, [0, 1], [400, 0]);
  // Forcer opacité 0 avant SEG.sept_ans pour éviter bleeding en Phase A
  const towerOpacity = frame < M.SEG.sept_ans
    ? 0
    : interpolate(towerSpring, [0, 0.15], [0, 1], { extrapolateRight: "clamp" });
  const towerGlow   = interpolate(Math.sin((frame - M.SEG.sept_ans) / 10), [-1, 1], [12, 32]);

  const railsProgress = interpolate(frame, [M.SEG.sept_ans + 30, M.SEG.rails1], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // Base de la tour : centrée 960 + demi-hauteur 360 = 1320px
  const towerBaseY = 1320;

  // ─── PHASE C ───
  const flashOpacity = interpolate(
    frame,
    [M.SEG.rails1, M.SEG.rails1 + 1, M.SEG.rails1 + 14],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const verdict1Spring = spring({
    frame: frame - M.SEG.rails1, fps,
    config: { damping: 14, stiffness: 90 },
    durationInFrames: 35,
  });
  const verdict1Slide   = interpolate(verdict1Spring, [0, 1], [60, 0]);
  const verdict1Opacity = interpolate(frame, [M.SEG.rails1, M.SEG.rails1 + 14], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const verdict2Spring = spring({
    frame: frame - M.SEG.rails2, fps,
    config: { damping: 14, stiffness: 90 },
    durationInFrames: 35,
  });
  const verdict2Slide   = interpolate(verdict2Spring, [0, 1], [60, 0]);
  const verdict2Opacity = interpolate(frame, [M.SEG.rails2, M.SEG.rails2 + 14], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Glow pulsant sur verdict 2 après apparition
  const verdict2Glow = frame >= M.SEG.rails2 + 20
    ? interpolate(Math.sin((frame - M.SEG.rails2 - 20) / 18), [-1, 1], [15, 45])
    : 15;

  // Tour respire légèrement en Phase C
  const towerPhaseC = frame >= M.SEG.rails1
    ? interpolate(Math.sin((frame - M.SEG.rails1) / 30), [-1, 1], [1.0, 1.03])
    : 1;



  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden" }}>
      {!globalAudio && <Audio src={staticFile(M.AUDIO)} />}
      {!globalMusic && <Audio src={staticFile(MUSIC_PATH)} startFrom={MUSIC_START_FROM} volume={0.07} />}

      {/* Fond Ken Burns */}
      <AbsoluteFill style={{ transform: `scale(${bgScale})`, transformOrigin: "center" }}>
        <Img
          src={staticFile(M.BG)}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.2 }}
        />
      </AbsoluteFill>

      {/* Dégradé radial central */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 50%, #1a2d5a 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Rails depuis la base de la tour */}
      <RailsNetwork progress={railsProgress} frame={frame} originY={towerBaseY} />

      {/* Phase A — Arc + "7 ANS" + count-up + légende */}
      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        opacity: arcOpacity * labelPhaseB,
        transform: `translateY(${labelMoveUp}px) scale(${labelShrink})`,
        transformOrigin: "center top",
      }}>
        <div style={{ position: "relative", width: 700, height: 700 }}>
          <CountdownArc frame={frame} fps={fps} />

          {/* "7 ANS" centré */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: `translate(-50%, -50%) translateY(${sevenFloat}px)`,
            textAlign: "center",
          }}>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 220, color: GOLD, lineHeight: 1,
              textShadow: `0 0 60px ${GOLD}77`,
              opacity: label7Opacity,
              transform: `scale(${sevenSlowZoom * (frame >= M.SEG.sept_ans ? sevenBounceScale : 1)})`,
              transformOrigin: "center",
            }}>
              7
            </div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 52, color: GOLD, letterSpacing: 10,
              opacity: label7Opacity,
            }}>
              ANS
            </div>
            {/* Count-up années 2007→2013 */}
            {frame >= 97 && frame < M.SEG.sept_ans + 30 && (
              <YearCountup frame={frame} />
            )}
          </div>
        </div>

        {/* Légende "SANS CADRE RÉGLEMENTAIRE COMPLET" */}
        <div style={{
          fontFamily: "monospace", fontSize: 28,
          color: IVORY, letterSpacing: 3,
          opacity: subLabelOpacity * 0.6,
          textAlign: "center", marginTop: 20,
        }}>
          SANS CADRE RÉGLEMENTAIRE COMPLET
        </div>
      </AbsoluteFill>

      {/* Phase B — Tour wireframe avec float — 720px, centrée sur l'écran */}
      <AbsoluteFill style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: towerOpacity,
        transform: `translateY(${towerY + floatY}px) scale(${towerPhaseC})`,
        pointerEvents: "none",
      }}>
        <div style={{ filter: `drop-shadow(0 0 ${towerGlow}px ${GOLD}88)` }}>
          <Img
            src={staticFile("souverain/silicon-savannah/assets/tower-hero.png")}
            style={{ height: 720, width: "auto" }}
          />
        </div>
      </AbsoluteFill>

      {/* Lens flare horizontal Phase C — bande lumineuse derrière la tour */}
      <AbsoluteFill style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: interpolate(frame, [M.SEG.rails1, M.SEG.rails1 + 30], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        }),
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}>
        <div style={{
          position: "absolute",
          top: "50%", left: 0,
          width: "100%", height: 3,
          transform: "translateY(-50%)",
          background: `radial-gradient(ellipse 80% 100% at 50% 50%, rgba(255,240,180,0.85) 0%, rgba(200,169,81,0.4) 40%, transparent 70%)`,
        }} />
      </AbsoluteFill>

      {/* Flash blanc Phase C */}
      <AbsoluteFill style={{ background: "#ffffff", opacity: flashOpacity, pointerEvents: "none" }} />

      {/* Phase C — Verdict double ligne */}
      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "flex-end",
        paddingBottom: 220, gap: 14,
        pointerEvents: "none",
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 100, color: IVORY,
          letterSpacing: 4, textAlign: "center",
          opacity: verdict1Opacity,
          transform: `translateY(${verdict1Slide}px)`,
          textShadow: `0 0 40px ${IVORY}55`,
          lineHeight: 1.1,
        }}>
          1 SEUL SERVICE.
        </div>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 100, color: GOLD,
          letterSpacing: 4, textAlign: "center",
          opacity: verdict2Opacity,
          transform: `translateY(${verdict2Slide}px)`,
          textShadow: `0 0 ${verdict2Glow}px ${GOLD}88, 0 0 ${verdict2Glow * 2}px ${GOLD}44`,
          lineHeight: 1.1,
        }}>
          LES RAILS DU PAYS.
        </div>
      </AbsoluteFill>

      <SubtitleBar lines={SUBTITLES} />

      {/* Source */}
      <AbsoluteFill style={{
        display: "flex", alignItems: "flex-end", justifyContent: "flex-end",
        padding: "0 54px 80px",
        opacity: fadeIn(frame, M.SEG.end, 20) * 0.45,
        pointerEvents: "none",
      }}>
        <span style={{ fontFamily: "monospace", fontSize: 20, color: IVORY }}>
          Safaricom · CBK 2024
        </span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
