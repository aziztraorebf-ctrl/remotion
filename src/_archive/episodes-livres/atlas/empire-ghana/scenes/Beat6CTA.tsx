// Beat 6 CTA — Empire du Ghana — v1
// Plein écran, fond sépia profond, 3 lignes cascade synchronisées sur narration CTA.
// Pattern forké de SonjataCTA mais avec palette Ghana (OR_VIF + BORDEAUX) + carte Afrique
// dynamique avec point pulse sur Wagadou.
//
// Audio : public/audio/atlas-empire-ghana/cta-narration-v1.mp3 (13.78s, 414f)
// Forced alignment : cta-alignment.json (loss 0.111)
// Pivots :
//   "Tu savais ?"           @ 0.099s -> frame 3
//   "Wagadou n'était que..." @ 5.879s -> frame 176
//   "Newsletter quotidienne" @ 8.279s -> frame 248
//   "Lien en bio."          @ 13.059s -> frame 392

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { GHANA_PALETTE, GHANA_FONTS } from "../components/GhanaPalette";
import { CTA_START_FRAME } from "../timing";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const africaData = require("../../../../../data/geo/africa-cta-paths.json");

const FPS = 30;
const TOTAL_DURATION_S = 14.0; // un poil plus que 13.78s pour silence final propre
export const BEAT6_CTA_FRAMES = Math.round(TOTAL_DURATION_S * FPS); // 420

// ─── Pivots forced-alignment ─────────────────────────────────────────────────
const FRAME_LINE_1 = 3;    // "Tu savais ?"
const FRAME_LINE_2 = 176;  // "Wagadou n'était que le début"
const FRAME_LINE_3 = 248;  // "Newsletter quotidienne..."

// ─── Carte Afrique réelle — Natural Earth 50m projetée via d3-geo ────────────
// Source : data/geo/africa-cta-paths.json (precompute-africa-silhouette.mjs)
// Projection geoMercator center=[17,0] scale=490 translate=[360,640]
const AFRICA_PATH = africaData.africaPath as string;
const [WAGADOU_X, WAGADOU_Y] = africaData.wagadouXY as [number, number];

// ─── Icônes SVG ──────────────────────────────────────────────────────────────
const QuestionIcon: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <circle cx="22" cy="22" r="18" stroke={GHANA_PALETTE.OR_VIF} strokeWidth="2.5" fill={GHANA_PALETTE.OR_VIF} fillOpacity="0.15" />
    <path d="M16 17C16 13.6863 18.6863 11 22 11C25.3137 11 28 13.6863 28 17C28 20 22 22 22 25" stroke={GHANA_PALETTE.OR_VIF} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <circle cx="22" cy="31" r="2" fill={GHANA_PALETTE.OR_VIF} />
  </svg>
);

const ScrollIcon: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <path d="M10 8H30C32.2 8 34 9.8 34 12V32C34 34.2 32.2 36 30 36H14C11.8 36 10 34.2 10 32V8Z" stroke={GHANA_PALETTE.OR_VIF} strokeWidth="2.5" fill={GHANA_PALETTE.OR_VIF} fillOpacity="0.15" />
    <path d="M16 16H28M16 22H28M16 28H24" stroke={GHANA_PALETTE.OR_VIF} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const LinkIcon: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect x="8" y="10" width="28" height="20" rx="3" stroke={GHANA_PALETTE.OR_VIF} strokeWidth="2.5" fill={GHANA_PALETTE.OR_VIF} fillOpacity="0.15" />
    <path d="M8 16L22 24L36 16" stroke={GHANA_PALETTE.OR_VIF} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// ─── CTA line ────────────────────────────────────────────────────────────────
const CTALine: React.FC<{
  text: string;
  subtext?: string;
  appearFrame: number;
  yPosition: number;
  icon: React.ReactNode;
  fontSize?: number;
}> = ({ text, subtext, appearFrame, yPosition, icon, fontSize = 38 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - appearFrame;
  if (localFrame < 0) return null;

  const opacity = spring({
    frame: localFrame,
    fps,
    config: { damping: 30, stiffness: 80 },
  });

  const translateY = interpolate(
    spring({
      frame: localFrame,
      fps,
      config: { damping: 20, stiffness: 100 },
    }),
    [0, 1],
    [20, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        top: yPosition,
        left: 60,
        right: 60,
        opacity,
        transform: `translateY(${translateY}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        padding: "20px 40px",
        background: "rgba(26, 13, 13, 0.85)",
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      {icon}
      <p
        style={{
          fontFamily: GHANA_FONTS.TITRE,
          fontSize,
          fontWeight: 700,
          color: GHANA_PALETTE.OR_VIF,
          margin: 0,
          textAlign: "center",
          lineHeight: 1.4,
          letterSpacing: "0.04em",
          textShadow: "1px 1px 8px rgba(0,0,0,0.7)",
        }}
      >
        {text}
      </p>
      {subtext && (
        <p
          style={{
            fontFamily: GHANA_FONTS.SERIF,
            fontSize: 26,
            color: GHANA_PALETTE.BLANC_OS,
            margin: 0,
            textAlign: "center",
            letterSpacing: "0.06em",
            opacity: 0.95,
            maxWidth: 720,
            textShadow: "0 2px 6px rgba(0,0,0,0.65)",
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  );
};

// ─── Carte Afrique avec point pulse Wagadou ──────────────────────────────────
const AfricaPulse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade-in tres rapide pour ne pas creer un flash sepia vide a la transition Beat5→Beat6
  const fadeIn = interpolate(frame, [0, 6], [0.5, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulse continu sur Wagadou
  const pulseT = (frame % 60) / 60;
  const pulseR = interpolate(pulseT, [0, 1], [12, 50]);
  const pulseOpacity = interpolate(pulseT, [0, 1], [0.7, 0]);

  return (
    <svg
      width={720}
      height={1280}
      viewBox="0 0 720 1280"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        opacity: fadeIn,
      }}
    >
      {/* Silhouette continent — terre cuite chaude pour visibilite */}
      <path
        d={AFRICA_PATH}
        fill={GHANA_PALETTE.TERRACOTTA}
        stroke={GHANA_PALETTE.OR_VIF}
        strokeWidth={1.5}
        opacity={0.95}
      />
      {/* Pulse expansif */}
      <circle
        cx={WAGADOU_X}
        cy={WAGADOU_Y}
        r={pulseR}
        fill="none"
        stroke={GHANA_PALETTE.OR_VIF}
        strokeWidth={2}
        opacity={pulseOpacity}
      />
      {/* Point central */}
      <circle
        cx={WAGADOU_X}
        cy={WAGADOU_Y}
        r={8}
        fill={GHANA_PALETTE.OR_VIF}
      />
      {/* Label Wagadou */}
      <text
        x={WAGADOU_X + 20}
        y={WAGADOU_Y + 5}
        fill={GHANA_PALETTE.OR_VIF}
        fontFamily={GHANA_FONTS.TITRE}
        fontSize={24}
        fontWeight={700}
        letterSpacing="0.12em"
      >
        WAGADOU
      </text>
    </svg>
  );
};

// ─── Beat6CTA ────────────────────────────────────────────────────────────────
export const Beat6CTA: React.FC = () => {
  const frame = useCurrentFrame();

  // Pas de fade-in : Beat5 finit deja sur des couleurs sombres et le freeze de 30f
  // fait deja la transition. Un fade-in supplementaire creerait un flash noir.
  const bgOpacity = 1;

  // Fade-out final 30 dernières frames
  const tailFade = interpolate(
    frame,
    [BEAT6_CTA_FRAMES - 20, BEAT6_CTA_FRAMES - 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          backgroundColor: GHANA_PALETTE.SEPIA_FOND,
          opacity: bgOpacity * tailFade,
        }}
      >
        {/* Carte Afrique en fond */}
        <AfricaPulse />

        {/* Ligne 1 — "Tu savais ?" */}
        <CTALine
          text="Tu savais ?"
          subtext="le sel valait son poids d'or au treizième siècle"
          appearFrame={FRAME_LINE_1}
          yPosition={140}
          icon={<QuestionIcon />}
          fontSize={48}
        />

        {/* Ligne 2 — "Wagadou n'était que le début" */}
        <CTALine
          text="Wagadou n'était que le début"
          subtext="d'autres empires oubliés t'attendent"
          appearFrame={FRAME_LINE_2}
          yPosition={680}
          icon={<ScrollIcon />}
          fontSize={36}
        />

        {/* Ligne 3 — "Newsletter quotidienne" / "Lien en bio" */}
        <CTALine
          text="Newsletter quotidienne"
          subtext="un autre regard sur l'actualité africaine — lien en bio"
          appearFrame={FRAME_LINE_3}
          yPosition={1020}
          icon={<LinkIcon />}
          fontSize={36}
        />

        {/* Décor : double séparateur OR_VIF en haut */}
        <div
          style={{
            position: "absolute",
            top: 110,
            left: 200,
            right: 200,
            height: 2,
            backgroundColor: GHANA_PALETTE.OR_VIF,
            opacity: interpolate(frame, [5, 18], [0, 0.5], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 116,
            left: 240,
            right: 240,
            height: 1,
            backgroundColor: GHANA_PALETTE.BORDEAUX,
            opacity: interpolate(frame, [8, 22], [0, 0.4], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />

        {/* Narration CTA */}
        <Sequence from={0} durationInFrames={BEAT6_CTA_FRAMES}>
          <Audio
            src={staticFile("audio/atlas-empire-ghana/cta-narration-v1.mp3")}
            volume={1.0}
          />
        </Sequence>

        {/* Musique de fond — continuite avec les beats precedents */}
        {/* startFrom = position globale du beat dans la composition (CTA_START_FRAME) */}
        {/* Fade-out final pour ne pas couper net */}
        <Audio
          src={staticFile("audio/atlas-empire-ghana/music/v1-B-marche-or.mp3")}
          volume={(f) =>
            interpolate(
              f,
              [0, 20, BEAT6_CTA_FRAMES - 40, BEAT6_CTA_FRAMES - 5],
              [0.07, 0.07, 0.07, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            )
          }
          startFrom={CTA_START_FRAME}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
