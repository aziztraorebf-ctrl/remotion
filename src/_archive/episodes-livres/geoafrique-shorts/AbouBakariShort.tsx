// AbouBakariShort.tsx — GeoAfrique Shorts | Abou Bakari II
// Format   : 1080x1920 (9:16 vertical)
// FPS      : 30
// Duration : 92.88s = 2786 frames (82.80s narration + 10.08s CTA v2)
// Audio    : narration (track 0) + music variante-A (track 1) + CTA audio (track 2)
// Timing   : ALL frame references derived from timing-abou-bakari.ts — NO hardcoded frames
// Subtitles: WHISPER_WORDS_ABOU_BAKARI via Subtitles component (highlight #FFD84A)
//
// Beat structure (9 beats):
//   01 ocean      — Globe Remotion V2 animation (out/abou-bakari-final.mp4, 0-13.5s)
//   02 empire     — empire-v1.mp4 (9.06s)
//   03 fleet_a    — fleet-a-v1.mp4 (10.04s, AUDIO OFF)
//   04 fleet_b    — fleet-b-v1.mp4 (6.06s, audio ON)
//   05 name       — name-v1.mp4 (10.12s)
//   06 abdication — abdication-v1.mp4 (10.04s) + caravane (abou-bakari-final.mp4 65-70s)
//   07 obsession  — ocean-v1.mp4 (0-6s only)
//   08 colomb     — colomb-v1.mp4 (6.06s)
//   09 close_cta  — split-screen fleet_a + colomb + texte cascade
//
// Architecture: Sequence par beat, chaque beat gere son propre contenu
// Anti-patterns INTERDITS: CSS transitions, setTimeout, @keyframes, requestAnimationFrame

import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BEATS,
  FPS,
  TOTAL_FRAMES,
  NARRATION_DURATION_S,
} from "./timing-abou-bakari";
import { WHISPER_WORDS_ABOU_BAKARI } from "./whisper-words-abou-bakari";
import { Subtitles } from "./Subtitles";

// ============================================================
// CONSTANTES VISUELLES
// ============================================================

const W = 1080;
const H = 1920;

const PAL = {
  bg:       "#050208",
  gold:     "#FFD84A",
  cream:    "#f5e6c8",
  amber:    "#c8820a",
  darkBg:   "#0a0804",
} as const;

const MUSIC_VOLUME = 0.05;
const XFADE = 20; // frames de crossfade entre beats

// ============================================================
// HELPERS
// ============================================================

function clampI(v: number): number {
  return interpolate(v, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function beatFade(localFrame: number, dur: number, fadeInDur = XFADE, fadeOutDur = XFADE): number {
  const fi = fadeInDur <= 0 ? 1 : clampI(interpolate(localFrame, [0, fadeInDur], [0, 1]));
  const fo = clampI(interpolate(localFrame, [dur - fadeOutDur, dur], [1, 0]));
  return Math.min(fi, fo);
}

// ============================================================
// BEAT 01 — ocean
// Globe Remotion V2 : out/abou-bakari-final.mp4, startFrom=0, coupe a 13.5s
// Durée beat : 405 frames (0.000s -> 13.500s)
// ============================================================

const Beat01Ocean: React.FC = () => {
  const localFrame = useCurrentFrame();
  const beatDur = BEATS.ocean.end - BEATS.ocean.start; // 405

  const op = beatFade(localFrame, beatDur, 0, XFADE);

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.bg, opacity: op }}>
      <OffthreadVideo
        src={staticFile("assets/abou-bakari/abou-bakari-final.mp4")}
        startFrom={0}
        endAt={Math.round(13.5 * FPS)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Subtitles
        words={WHISPER_WORDS_ABOU_BAKARI}
        sceneStartS={BEATS.ocean.startSec}
        sceneEndS={BEATS.ocean.endSec}
        highlightColor={PAL.gold}
      />
    </AbsoluteFill>
  );
};

// ============================================================
// BEAT 02 — empire
// empire-v1.mp4 (9.06s) — AUDIO OFF
// Durée beat : 267 frames (13.799s -> 22.699s)
// ============================================================

const Beat02Empire: React.FC = () => {
  const localFrame = useCurrentFrame();
  const beatDur = BEATS.empire.end - BEATS.empire.start; // 267

  const op = beatFade(localFrame, beatDur);

  // Overlay "ABOU BAKARI II" — spring pop, disparait a ~2s
  const { fps } = useVideoConfig();
  const titleSpr = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  const titleFadeOut = clampI(interpolate(localFrame, [60, 90], [1, 0]));
  const titleOp = titleSpr * titleFadeOut;
  const subtitleOp = clampI(interpolate(localFrame, [15, 35], [0, 1])) * titleFadeOut;

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.bg, opacity: op }}>
      <OffthreadVideo
        src={staticFile("assets/abou-bakari/clips/empire-v1.mp4")}
        startFrom={0}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Overlay nom — haut de l'ecran */}
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="b02-goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F0D060" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#A07820" />
          </linearGradient>
          <filter id="b02-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <text
          x={W / 2}
          y={H * 0.10}
          textAnchor="middle"
          fill="url(#b02-goldGrad)"
          fontSize={Math.round(titleSpr * 68)}
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="bold"
          letterSpacing={6}
          opacity={titleOp}
          filter="url(#b02-glow)"
        >
          ABOU BAKARI II
        </text>

        <text
          x={W / 2}
          y={H * 0.15}
          textAnchor="middle"
          fill={PAL.cream}
          fontSize={38}
          fontFamily="'Playfair Display', Georgia, serif"
          fontStyle="italic"
          opacity={subtitleOp}
        >
          Mansa du Mali — Roi des Rois
        </text>
      </svg>

      <Subtitles
        words={WHISPER_WORDS_ABOU_BAKARI}
        sceneStartS={BEATS.empire.startSec}
        sceneEndS={BEATS.empire.endSec}
        highlightColor={PAL.gold}
      />
    </AbsoluteFill>
  );
};

// ============================================================
// BEAT 03 — fleet_a
// fleet-a-v1.mp4 (10.04s) — MUTED (narration continue sous le clip)
// Durée beat : 448 frames (23.059s -> 38.000s)
// ============================================================

const Beat03FleetA: React.FC = () => {
  const localFrame = useCurrentFrame();
  const beatDur = BEATS.fleet_a.end - BEATS.fleet_a.start; // 448
  const { fps } = useVideoConfig();

  const op = beatFade(localFrame, beatDur);

  // "2 000 pirogues" — fade in rapide, disparait a ~5s (frame 150)
  const fleetLabelOp =
    clampI(interpolate(localFrame, [0, 20], [0, 1])) *
    clampI(interpolate(localFrame, [120, 150], [1, 0]));

  // "Un seul revient." — spring dramatique, arrive apres la longue pause narrative (frame 320)
  const returnSpr = spring({
    frame: Math.max(0, localFrame - 320),
    fps,
    config: { damping: 8, stiffness: 100 },
  });
  const returnFadeOut = clampI(interpolate(localFrame, [beatDur - XFADE, beatDur], [1, 0]));
  const returnOp = returnSpr * returnFadeOut;

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.bg, opacity: op }}>
      <OffthreadVideo
        src={staticFile("assets/abou-bakari/clips/fleet-a-v1.mp4")}
        startFrom={0}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        <text
          x={W / 2}
          y={H * 0.11}
          textAnchor="middle"
          fill="#D4AF37"
          fontSize={72}
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="700"
          opacity={fleetLabelOp}
        >
          2 000 pirogues
        </text>

        <text
          x={W / 2}
          y={H * 0.88}
          textAnchor="middle"
          fill="#8B1A1A"
          fontSize={Math.round(returnSpr * 66)}
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="700"
          opacity={returnOp}
        >
          Un seul revient.
        </text>
      </svg>

      <Subtitles
        words={WHISPER_WORDS_ABOU_BAKARI}
        sceneStartS={BEATS.fleet_a.startSec}
        sceneEndS={BEATS.fleet_a.endSec}
        highlightColor={PAL.gold}
      />
    </AbsoluteFill>
  );
};

// ============================================================
// BEAT 04 — fleet_b
// fleet-b-v1.mp4 (6.06s) — audio ON sur le clip
// Durée visuelle: 182 frames (38.000s -> 44.060s, duree naturelle du clip)
// Narration couvre seulement "On ne passe pas." (39.139s) — sous-titres bornes sur audioBoundaryS
// ============================================================

const Beat04FleetB: React.FC = () => {
  const localFrame = useCurrentFrame();
  const beatDur = BEATS.fleet_b.end - BEATS.fleet_b.start; // 182
  const op = beatFade(localFrame, beatDur);

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.bg, opacity: op }}>
      <OffthreadVideo
        src={staticFile("assets/abou-bakari/clips/fleet-b-v1.mp4")}
        startFrom={0}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Subtitles
        words={WHISPER_WORDS_ABOU_BAKARI}
        sceneStartS={BEATS.fleet_b.startSec}
        sceneEndS={(BEATS.fleet_b as any).audioBoundaryS ?? BEATS.fleet_b.endSec}
        highlightColor={PAL.gold}
      />
    </AbsoluteFill>
  );
};

// ============================================================
// BEAT 05 — name
// name-v1.mp4 (10.12s) — AUDIO OFF
// Durée beat : 238 frames (44.060s -> 51.999s)
// Narration "Abou Bakari ne recule pas..." demarre a 39.139s (sous fleet_b clip)
// Sous-titres bornent sur narrationOffsetS (44.060s) -> endSec pour eviter overlap
// ============================================================

const Beat05Name: React.FC = () => {
  const localFrame = useCurrentFrame();
  const beatDur = BEATS.name.end - BEATS.name.start; // 238
  const { fps } = useVideoConfig();

  const op = beatFade(localFrame, beatDur);

  // "Il ne reviendra jamais." — spring a ~9s (frame 270), couleur rouge/dramatique
  const jamaisSpr = spring({
    frame: Math.max(0, localFrame - 270),
    fps,
    config: { damping: 14, stiffness: 80 },
  });
  const jamaisFadeOut = clampI(interpolate(localFrame, [beatDur - XFADE, beatDur], [1, 0]));
  const jamaisOp = jamaisSpr * jamaisFadeOut;

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.bg, opacity: op }}>
      <OffthreadVideo
        src={staticFile("assets/abou-bakari/clips/name-v1.mp4")}
        startFrom={0}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        <text
          x={W / 2}
          y={H * 0.90}
          textAnchor="middle"
          fill="#8B1A1A"
          fontSize={Math.round(jamaisSpr * 58)}
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="700"
          fontStyle="italic"
          opacity={jamaisOp}
        >
          Il ne reviendra jamais.
        </text>
      </svg>

      <Subtitles
        words={WHISPER_WORDS_ABOU_BAKARI}
        sceneStartS={BEATS.name.startSec}
        sceneEndS={BEATS.name.endSec}
        highlightColor={PAL.gold}
      />
    </AbsoluteFill>
  );
};

// ============================================================
// BEAT 06 — abdication
// Plan 1 (0-210f / 7s)  : abdication-v1.mp4 (10.04s) — MUTED
// Plan 2 (frame 190+) : caravane (abou-bakari-final.mp4, startFrom=65s) — MUTED
// Overlay Plan 2 : "400 milliards de dollars"
// Durée beat : 447 frames (51.999s -> 66.899s)
// Narration "Son demi-frere..." demarre a 53.579s (1.58s silence visuel au debut du beat)
// ============================================================

const Beat06Abdication: React.FC = () => {
  const localF = useCurrentFrame();
  const beatDur = BEATS.abdication.end - BEATS.abdication.start; // 447
  const { fps } = useVideoConfig();

  const op = beatFade(localF, beatDur);

  // Plan 1 : 0-210 frames (7s)
  const plan1DurF = 210;
  const plan1FadeOut = clampI(interpolate(localF, [plan1DurF - XFADE, plan1DurF], [1, 0]));

  // Plan 2 : caravane — fade in quand Plan 1 fait son fade out (190-210)
  const plan2StartF = 190;
  const plan2FadeIn = clampI(interpolate(localF, [190, 210], [0, 1]));
  const plan2FadeOut = clampI(interpolate(localF, [390, 400], [1, 0]));
  const plan2Op = plan2FadeIn * plan2FadeOut;

  // Overlay "400 milliards" — apparait 2s apres plan2 (frame 250)
  const overlayDelay = plan2StartF + 60;
  const overlaySpr = spring({
    frame: Math.max(0, localF - overlayDelay),
    fps,
    config: { damping: 14, stiffness: 80 },
  });
  const overlayFadeOut = clampI(interpolate(localF, [380, 400], [1, 0]));
  const overlayOp = overlaySpr * overlayFadeOut;

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.bg, opacity: op }}>
      {/* Plan 1 — abdication clip */}
      <AbsoluteFill style={{ opacity: plan1FadeOut }}>
        <OffthreadVideo
          src={staticFile("assets/abou-bakari/clips/abdication-v1.mp4")}
          startFrom={0}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Plan 2 — caravane extract from globe animation (~65s) */}
      <AbsoluteFill style={{ opacity: plan2Op }}>
        <OffthreadVideo
          src={staticFile("assets/abou-bakari/abou-bakari-final.mp4")}
          startFrom={Math.round(65 * FPS)}
          endAt={Math.round(70 * FPS)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Overlay "400 milliards de dollars" */}
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
        >
          <defs>
            <linearGradient id="b06-goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F0D060" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#A07820" />
            </linearGradient>
            <filter id="b06-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <text
            x={W / 2}
            y={H * 0.10}
            textAnchor="middle"
            fill="url(#b06-goldGrad)"
            fontSize={Math.round(overlaySpr * 88)}
            fontFamily="'Playfair Display', Georgia, serif"
            fontWeight="bold"
            opacity={overlayOp}
            filter="url(#b06-glow)"
          >
            400 milliards
          </text>

          <text
            x={W / 2}
            y={H * 0.16}
            textAnchor="middle"
            fill={PAL.cream}
            fontSize={Math.round(overlaySpr * 44)}
            fontFamily="'Playfair Display', Georgia, serif"
            fontStyle="italic"
            opacity={overlayOp * 0.85}
          >
            de dollars
          </text>
        </svg>
      </AbsoluteFill>

      <Subtitles
        words={WHISPER_WORDS_ABOU_BAKARI}
        sceneStartS={BEATS.abdication.narrationOffsetS}
        sceneEndS={BEATS.abdication.endSec}
        highlightColor={PAL.gold}
      />
    </AbsoluteFill>
  );
};

// ============================================================
// BEAT 07 — obsession
// ocean-v1.mp4 (0-6s only, clip est 10.05s)
// Durée beat : 176 frames (67.000s -> 72.859s)
// ============================================================

const Beat07Obsession: React.FC = () => {
  const localF = useCurrentFrame();
  const beatDur = BEATS.obsession.end - BEATS.obsession.start; // 176

  const op = beatFade(localF, beatDur);

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.bg, opacity: op }}>
      <OffthreadVideo
        src={staticFile("assets/abou-bakari/clips/ocean-v1.mp4")}
        startFrom={0}
        endAt={Math.round(6 * FPS)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Subtitles
        words={WHISPER_WORDS_ABOU_BAKARI}
        sceneStartS={BEATS.obsession.startSec}
        sceneEndS={BEATS.obsession.endSec}
        highlightColor={PAL.gold}
      />
    </AbsoluteFill>
  );
};

// ============================================================
// BEAT 08 — colomb
// colomb-v1.mp4 (6.06s) — audio ON sur le clip
// Durée beat : 193 frames (72.900s -> 79.319s)
// Overlay : "181 ans plus tard" + ironie "le decouvreur"
// ============================================================

const Beat08Colomb: React.FC = () => {
  const localF = useCurrentFrame();
  const beatDur = BEATS.colomb.end - BEATS.colomb.start; // 193
  const { fps } = useVideoConfig();

  const op = beatFade(localF, beatDur);

  // "181 ans plus tard" — spring frame 10
  const titSpr = spring({ frame: Math.max(0, localF - 10), fps, config: { damping: 200 } });
  const titFadeOut = clampI(interpolate(localF, [beatDur - XFADE, beatDur], [1, 0]));
  const titOp = titSpr * titFadeOut;

  // "le decouvreur." — ironique, apparait a frame 80
  const decouvOp =
    clampI(interpolate(localF, [80, 110], [0, 1])) *
    clampI(interpolate(localF, [beatDur - XFADE, beatDur], [1, 0]));

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1f2a", opacity: op }}>
      <OffthreadVideo
        src={staticFile("assets/abou-bakari/clips/colomb-v1.mp4")}
        startFrom={0}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        <text
          x={W / 2}
          y={H * 0.13}
          textAnchor="middle"
          fill={PAL.cream}
          fontSize={Math.round(titSpr * 66)}
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="400"
          fontStyle="italic"
          opacity={titOp * 0.85}
        >
          181 ans plus tard
        </text>

        <text
          x={W / 2}
          y={H * 0.90}
          textAnchor="middle"
          fill="#8090b0"
          fontSize={48}
          fontFamily="'Playfair Display', Georgia, serif"
          fontStyle="italic"
          opacity={decouvOp}
        >
          le "decouvreur".
        </text>
      </svg>

      <Subtitles
        words={WHISPER_WORDS_ABOU_BAKARI}
        sceneStartS={BEATS.colomb.startSec}
        sceneEndS={BEATS.colomb.endSec}
        highlightColor={PAL.gold}
      />
    </AbsoluteFill>
  );
};

// ============================================================
// BEAT 09 — close_cta
// Phase A (narration close, frames 0-101): split-screen fleet_a + colomb + question
// Phase B (CTA, frames 101-466): texte cascade 3 lignes + audio beat09-cta.mp3
// Durée totale beat : 466 frames (79.419s -> 94.960s)
// ============================================================

const Beat09CloseCTA: React.FC = () => {
  const localF = useCurrentFrame();
  const beatDur = BEATS.close_cta.end - BEATS.close_cta.start; // 466
  const { fps } = useVideoConfig();

  // Frontiere narration/CTA en frames locaux
  const narrationEndLocalF = BEATS.close_cta.narrationEndFrame - BEATS.close_cta.start; // 101
  const HALF = W / 2;

  // Fade in global du beat
  const fadeIn = clampI(interpolate(localF, [0, XFADE], [0, 1]));

  // ---- Phase A : split-screen (frames 0 - narrationEndLocalF) ----
  const splitOp = clampI(interpolate(localF, [narrationEndLocalF - XFADE, narrationEndLocalF], [1, 0]));

  // Ligne centrale doree — apparait frame 10
  const lineOp = clampI(interpolate(localF, [10, 30], [0, 1])) * splitOp;

  // Dates — frame 15
  const datesOp =
    clampI(interpolate(localF, [15, 35], [0, 1])) *
    splitOp;

  // "Qui a traverse en premier ?" — spring frame 40
  const questionSpr = spring({ frame: Math.max(0, localF - 40), fps, config: { damping: 14, stiffness: 80 } });
  const questionOp = questionSpr * splitOp;

  // ---- Phase B : CTA texte (frames narrationEndLocalF -> fin) ----
  const ctaFadeIn = clampI(interpolate(localF, [narrationEndLocalF, narrationEndLocalF + XFADE], [0, 1]));
  const ctaFadeOut = clampI(interpolate(localF, [beatDur - XFADE, beatDur], [1, 0]));
  const ctaOp = ctaFadeIn * ctaFadeOut;

  // Ligne 1 : spring frame narrationEndLocalF + 20
  const line1Spr = spring({ frame: Math.max(0, localF - (narrationEndLocalF + 20)), fps, config: { damping: 18, stiffness: 90 } });
  const line1Op = line1Spr * ctaOp;

  // Ligne 2 : spring frame narrationEndLocalF + 45
  const line2Spr = spring({ frame: Math.max(0, localF - (narrationEndLocalF + 45)), fps, config: { damping: 18, stiffness: 90 } });
  const line2Op = line2Spr * ctaOp;

  // Ligne 3 : spring frame narrationEndLocalF + 80
  const line3Spr = spring({ frame: Math.max(0, localF - (narrationEndLocalF + 80)), fps, config: { damping: 18, stiffness: 90 } });
  const line3Op = line3Spr * ctaOp;

  return (
    <AbsoluteFill style={{ backgroundColor: "#050208", opacity: fadeIn }}>
      {/* Audio CTA v2 — demarre au debut de la phase B (narrationEndLocalF en frames locaux) */}
      <Sequence from={narrationEndLocalF}>
        <Audio src={staticFile("audio/abou-bakari/beat09-cta-v2.mp3")} startFrom={0} />
      </Sequence>

      {/* Phase A — split-screen */}
      <AbsoluteFill style={{ opacity: splitOp }}>
        {/* Gauche : fleet_a (moitie gauche du clip) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: HALF,
            height: H,
            overflow: "hidden",
          }}
        >
          <OffthreadVideo
            src={staticFile("assets/abou-bakari/clips/fleet-a-v1.mp4")}
            startFrom={0}
            muted
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: W,
              height: H,
              objectFit: "cover",
            }}
          />
        </div>

        {/* Droite : colomb */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: HALF,
            width: HALF,
            height: H,
            overflow: "hidden",
          }}
        >
          <OffthreadVideo
            src={staticFile("assets/abou-bakari/clips/colomb-v1.mp4")}
            startFrom={0}
            muted
            style={{
              position: "absolute",
              top: 0,
              left: -HALF,
              width: W,
              height: H,
              objectFit: "cover",
            }}
          />
        </div>

        {/* Overlays split-screen */}
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
        >
          {/* Ligne doree verticale */}
          <line x1={HALF} y1={0} x2={HALF} y2={H} stroke="#D4AF37" strokeWidth={2} opacity={lineOp} />

          {/* Dates */}
          <text
            x={HALF * 0.5}
            y={H * 0.88}
            textAnchor="middle"
            fill={PAL.amber}
            fontSize={56}
            fontFamily="'Playfair Display', Georgia, serif"
            fontWeight="700"
            opacity={datesOp}
          >
            1311
          </text>
          <text
            x={HALF + HALF * 0.5}
            y={H * 0.88}
            textAnchor="middle"
            fill="#8090b0"
            fontSize={56}
            fontFamily="'Playfair Display', Georgia, serif"
            fontWeight="700"
            opacity={datesOp}
          >
            1492
          </text>

          {/* Question finale */}
          <text
            x={HALF}
            y={H * 0.50}
            textAnchor="middle"
            fill={PAL.cream}
            fontSize={Math.round(questionSpr * 50)}
            fontFamily="'Playfair Display', Georgia, serif"
            fontStyle="italic"
            opacity={questionOp}
          >
            Qui a traverse en premier ?
          </text>
        </svg>

        {/* Sous-titres narration close */}
        <Subtitles
          words={WHISPER_WORDS_ABOU_BAKARI}
          sceneStartS={BEATS.close_cta.startSec}
          sceneEndS={BEATS.close_cta.narrationEndSec}
          highlightColor={PAL.gold}
        />
      </AbsoluteFill>

      {/* Phase B — CTA texte */}
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <rect x={0} y={0} width={W} height={H} fill={PAL.darkBg} />

          {/* Lignes decoratives */}
          <line x1={100} y1={H * 0.38} x2={W - 100} y2={H * 0.38} stroke="#D4AF37" strokeWidth={1.5} opacity={0.5} />
          <line x1={100} y1={H * 0.62} x2={W - 100} y2={H * 0.62} stroke="#D4AF37" strokeWidth={1.5} opacity={0.5} />

          {/* Ligne 1 */}
          <text
            x={W / 2}
            y={H * 0.42}
            textAnchor="middle"
            fill={PAL.cream}
            fontSize={Math.round(line1Spr * 44)}
            fontFamily="'Playfair Display', Georgia, serif"
            fontStyle="italic"
            opacity={line1Op * 0.9}
          >
            Chaque jour dans notre newsletter,
          </text>

          {/* Ligne 2 */}
          <text
            x={W / 2}
            y={H * 0.50}
            textAnchor="middle"
            fill={PAL.gold}
            fontSize={Math.round(line2Spr * 50)}
            fontFamily="'Playfair Display', Georgia, serif"
            fontWeight="700"
            opacity={line2Op}
          >
            l'Afrique qu'on ne t'apprend pas.
          </text>

          {/* Ligne 3 */}
          <text
            x={W / 2}
            y={H * 0.58}
            textAnchor="middle"
            fill={PAL.gold}
            fontSize={Math.round(line3Spr * 60)}
            fontFamily="'Playfair Display', Georgia, serif"
            fontWeight="700"
            opacity={line3Op}
          >
            Lien en bio.
          </text>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export const AbouBakariShort: React.FC = () => {
  // Duree totale de la musique = toute la composition (narration + CTA)
  const musicVolume = (f: number) => {
    const fi = clampI(interpolate(f, [0, 2 * FPS], [0, MUSIC_VOLUME]));
    const fo = clampI(interpolate(f, [TOTAL_FRAMES - 2 * FPS, TOTAL_FRAMES], [MUSIC_VOLUME, 0]));
    return Math.min(fi, fo);
  };

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.bg }}>
      {/* Piste 1 : narration principale (frames 0 -> NARRATION_FRAMES) */}
      <Sequence from={0} durationInFrames={Math.round(NARRATION_DURATION_S * FPS)} premountFor={FPS}>
        <Audio
          src={staticFile("audio/abou-bakari/abou-bakari-narratrice-v1.mp3")}
          startFrom={0}
          volume={1.0}
        />
      </Sequence>

      {/* Piste 2 : musique variante-A Royal kora+balafon (frame 0, toute la composition) */}
      <Sequence from={0} durationInFrames={TOTAL_FRAMES} premountFor={FPS}>
        <Audio
          src={staticFile("audio/abou-bakari/music/variante-A-royal-kora-balafon.mp3")}
          startFrom={0}
          volume={musicVolume}
        />
      </Sequence>

      {/* Beat 01 — ocean (Globe V2, 0-13.5s) */}
      <Sequence
        from={BEATS.ocean.start}
        durationInFrames={BEATS.ocean.end - BEATS.ocean.start}
        premountFor={FPS}
      >
        <Beat01Ocean />
      </Sequence>

      {/* Beat 02 — empire */}
      <Sequence
        from={BEATS.empire.start}
        durationInFrames={BEATS.empire.end - BEATS.empire.start}
        premountFor={FPS}
      >
        <Beat02Empire />
      </Sequence>

      {/* Beat 03 — fleet_a (narration continue, clip MUTED) */}
      <Sequence
        from={BEATS.fleet_a.start}
        durationInFrames={BEATS.fleet_a.end - BEATS.fleet_a.start}
        premountFor={FPS}
      >
        <Beat03FleetA />
      </Sequence>

      {/* Beat 04 — fleet_b (duree visuelle complete 6.06s = 182 frames) */}
      <Sequence
        from={BEATS.fleet_b.start}
        durationInFrames={BEATS.fleet_b.end - BEATS.fleet_b.start}
        premountFor={FPS}
      >
        <Beat04FleetB />
      </Sequence>

      {/* Beat 05 — name */}
      <Sequence
        from={BEATS.name.start}
        durationInFrames={BEATS.name.end - BEATS.name.start}
        premountFor={FPS}
      >
        <Beat05Name />
      </Sequence>

      {/* Beat 06 — abdication */}
      <Sequence
        from={BEATS.abdication.start}
        durationInFrames={BEATS.abdication.end - BEATS.abdication.start}
        premountFor={FPS}
      >
        <Beat06Abdication />
      </Sequence>

      {/* Beat 07 — obsession (ocean-v1.mp4, 0-6s) */}
      <Sequence
        from={BEATS.obsession.start}
        durationInFrames={BEATS.obsession.end - BEATS.obsession.start}
        premountFor={FPS}
      >
        <Beat07Obsession />
      </Sequence>

      {/* Beat 08 — colomb */}
      <Sequence
        from={BEATS.colomb.start}
        durationInFrames={BEATS.colomb.end - BEATS.colomb.start}
        premountFor={FPS}
      >
        <Beat08Colomb />
      </Sequence>

      {/* Beat 09 — close_cta (narration close + CTA) */}
      <Sequence
        from={BEATS.close_cta.start}
        durationInFrames={BEATS.close_cta.end - BEATS.close_cta.start}
        premountFor={FPS}
      >
        <Beat09CloseCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
