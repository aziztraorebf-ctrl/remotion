/**
 * Beat5Final — Revelation + CTA
 * Fenetre : 360f = 12s (frames locales 0..359) — elargi 2026-05-12
 *
 * Timeline (audio demarre a f0) :
 *   f0       : vocal demarre (narration-beat5.mp3, 11.52s = 346f)
 *   f2       : "Maintenant" apparait
 *   f22      : "tu" apparait
 *   f31      : "sais." apparait
 *   f52      : phrase 2 debut ("L'Afrique est bien plus grande...")
 *   f218     : phrase 2 fin, pause
 *   f256     : CTA commence ("Partage cette video...")
 *   f346     : fin vocal
 *   f346-f360: musique seule + fondu noir
 */

import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import geoData from "./geo-data-equalarea.json";

const PAL = {
  oceanDark:  "#03224c",
  landAfrica: "#d4a93c",
  glow:       "#e8b84b",
} as const;

const AFRICA_DISPLAY_SCALE = 1.35;

// Timing audio — vocal demarre a f0 (forced alignment 2026-05-12)
const VOCAL_START  = 0;
const VOCAL_FRAMES = 346; // 11.52s * 30fps

// Phrase 1 : "Maintenant tu sais."
const WORD_MAINTENANT = 2;
const WORD_TU         = 22;
const WORD_SAIS       = 31;
const PHRASE1_EXIT    = 70; // disparait apres "sais."

// Phrase 2 : "L'Afrique est bien plus grande que tu ne le croyais. Et tu le vois enfin a sa vraie taille."
const WORD_LAFRIQUE   = 52;
const WORD_GRANDE     = 87;
const WORD_CROYAIS    = 116;
const WORD_ET         = 149;
const WORD_VRAIETAILLE = 208;
const PHRASE2_EXIT    = 240;

// CTA : "Partage cette video a quelqu'un qui ne le sait pas encore."
const WORD_PARTAGE    = 256;
const WORD_QUELQUUN   = 295;
const WORD_ENCORE     = 330;

const FADE_START = 376; // fin vocal + 1s respiration
const FADE_END   = 420; // + 1.47s fondu

const PHRASE1 = [
  { text: "Maintenant", start: WORD_MAINTENANT },
  { text: "tu",         start: WORD_TU },
  { text: "sais.",      start: WORD_SAIS },
];

const PHRASE2_LINE1 = [
  { text: "L'Afrique est bien plus grande", start: WORD_LAFRIQUE },
  { text: "que tu ne le croyais.",          start: WORD_GRANDE },
];

const PHRASE2_LINE2 = [
  { text: "Et tu le vois enfin", start: WORD_ET },
  { text: "a sa vraie taille.", start: WORD_VRAIETAILLE },
];

const CTA_LINE1 = [
  { text: "Partage cette video", start: WORD_PARTAGE },
  { text: "a quelqu'un",         start: WORD_QUELQUUN },
];

const CTA_LINE2 = [
  { text: "qui ne le sait pas encore.", start: WORD_ENCORE },
];

export const Beat5Final: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [FADE_START, FADE_END], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Glow pulse — s'intensifie a chaque mot de phrase 1
  const words1Visible = PHRASE1.filter((w) => frame >= w.start).length;
  const glowBase    = 0.45 + Math.sin((frame + 15) / 22) * 0.15;
  const glowBonus   = words1Visible * 0.10;
  const glowOpacity = Math.min(glowBase + glowBonus, 0.95);

  const pulseSpeed = frame < VOCAL_START ? 20 : 35;
  const scalePulse = 1 + Math.sin(frame / pulseSpeed) * 0.012;

  // Impulsion glow sur chaque nouveau mot phrase 1
  const lastWord1Start = PHRASE1.filter((w) => frame >= w.start).slice(-1)[0]?.start ?? 0;
  const wordImpulse = spring({
    frame:  Math.max(0, frame - lastWord1Start),
    fps,
    config: { damping: 40, stiffness: 300 },
    from: 0, to: 1,
  });
  const impulseScale = 1 + wordImpulse * 0.03;

  const cx = width / 2;
  const cy = height / 2;

  // Phrase 1 : "Maintenant tu sais."
  const phrase1Text = PHRASE1.filter((w) => frame >= w.start).map((w) => w.text).join(" ");
  const showPhrase1 = frame >= WORD_MAINTENANT && frame < PHRASE1_EXIT;
  const phrase1Opacity = interpolate(
    frame,
    [PHRASE1_EXIT - 12, PHRASE1_EXIT],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Phrase 2 ligne 1
  const p2l1Text = PHRASE2_LINE1.filter((w) => frame >= w.start).map((w) => w.text).join(" ");
  const showP2L1 = frame >= WORD_LAFRIQUE && frame < PHRASE2_EXIT;
  const p2l1Opacity = interpolate(frame, [WORD_LAFRIQUE, WORD_LAFRIQUE + 12, PHRASE2_EXIT - 12, PHRASE2_EXIT], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Phrase 2 ligne 2
  const p2l2Text = PHRASE2_LINE2.filter((w) => frame >= w.start).map((w) => w.text).join(" ");
  const showP2L2 = frame >= WORD_ET && frame < PHRASE2_EXIT;

  // CTA ligne 1
  const cta1Text = CTA_LINE1.filter((w) => frame >= w.start).map((w) => w.text).join(" ");
  const showCTA1 = frame >= WORD_PARTAGE;
  const cta1Opacity = interpolate(frame, [WORD_PARTAGE, WORD_PARTAGE + 12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // CTA ligne 2
  const cta2Text = CTA_LINE2.filter((w) => frame >= w.start).map((w) => w.text).join(" ");
  const showCTA2 = frame >= WORD_ENCORE;
  const cta2Opacity = interpolate(frame, [WORD_ENCORE, WORD_ENCORE + 12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.oceanDark }}>
      {/* Vocal — demarre a f0 */}
      <Audio
        src={staticFile("souverain/vraie-taille-afrique/audio/narration-beat5.mp3")}
        startFrom={0}
        endAt={VOCAL_FRAMES}
      />

      <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            <filter id="beat5-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="18" result="blur" />
              <feFlood floodColor={PAL.glow} floodOpacity="1" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glowLayer" />
              <feMerge>
                <feMergeNode in="glowLayer" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g transform={`translate(${cx},${cy}) scale(${AFRICA_DISPLAY_SCALE}) translate(${-geoData.africa.cx},${-geoData.africa.cy})`}>
            <path
              d={geoData.africa.path ?? ""}
              fill={PAL.glow}
              filter="url(#beat5-glow)"
              opacity={glowOpacity}
              transform={`translate(${geoData.africa.cx},${geoData.africa.cy}) scale(${scalePulse * impulseScale}) translate(${-geoData.africa.cx},${-geoData.africa.cy})`}
            />
            <path
              d={geoData.africa.path ?? ""}
              fill={PAL.landAfrica}
              transform={`translate(${geoData.africa.cx},${geoData.africa.cy}) scale(${scalePulse}) translate(${-geoData.africa.cx},${-geoData.africa.cy})`}
            />
          </g>

          {/* Phrase 1 : "Maintenant tu sais." */}
          {showPhrase1 && phrase1Text && (
            <g opacity={phrase1Opacity}>
              <rect x={cx - 320} y={height - 300} width={640} height={80} rx={8} fill="rgba(0,0,0,0.55)" />
              <text
                x={cx}
                y={height - 245}
                textAnchor="middle"
                fill="#ffffff"
                fontSize={52}
                fontFamily="Georgia, serif"
                fontWeight="700"
                letterSpacing="2"
              >
                {phrase1Text}
              </text>
            </g>
          )}

          {/* Phrase 2 ligne 1 : "L'Afrique est bien plus grande / que tu ne le croyais." */}
          {showP2L1 && p2l1Text && (
            <g opacity={p2l1Opacity}>
              <rect x={cx - 420} y={height - 310} width={840} height={60} rx={6} fill="rgba(0,0,0,0.50)" />
              <text
                x={cx}
                y={height - 268}
                textAnchor="middle"
                fill="#ffffff"
                fontSize={34}
                fontFamily="Georgia, serif"
              >
                {p2l1Text}
              </text>
            </g>
          )}

          {/* Phrase 2 ligne 2 : "Et tu le vois enfin / a sa vraie taille." */}
          {showP2L2 && p2l2Text && (
            <g opacity={p2l1Opacity}>
              <rect x={cx - 350} y={height - 235} width={700} height={56} rx={6} fill="rgba(0,0,0,0.45)" />
              <text
                x={cx}
                y={height - 196}
                textAnchor="middle"
                fill={PAL.landAfrica}
                fontSize={32}
                fontFamily="Georgia, serif"
                fontStyle="italic"
              >
                {p2l2Text}
              </text>
            </g>
          )}

          {/* CTA ligne 1 : "Partage cette video a quelqu'un" */}
          {showCTA1 && cta1Text && (
            <g opacity={cta1Opacity}>
              <rect x={cx - 400} y={height - 310} width={800} height={60} rx={6} fill="rgba(0,0,0,0.50)" />
              <text
                x={cx}
                y={height - 268}
                textAnchor="middle"
                fill="#ffffff"
                fontSize={32}
                fontFamily="Georgia, serif"
              >
                {cta1Text}
              </text>
            </g>
          )}

          {/* CTA ligne 2 : "qui ne le sait pas encore." */}
          {showCTA2 && cta2Text && (
            <g opacity={cta2Opacity}>
              <rect x={cx - 350} y={height - 235} width={700} height={56} rx={6} fill="rgba(0,0,0,0.45)" />
              <text
                x={cx}
                y={height - 196}
                textAnchor="middle"
                fill={PAL.landAfrica}
                fontSize={32}
                fontFamily="Georgia, serif"
                fontStyle="italic"
              >
                {cta2Text}
              </text>
            </g>
          )}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const BEAT5_DURATION = 420;
