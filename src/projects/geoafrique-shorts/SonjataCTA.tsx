// CTA — Call to Action (4s)
// Appears after scene 10 close. Same style: Cinzel Decorative gold on dark brown.
// 3 lines animated in cascade + SVG icons

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
import { loadFont } from "@remotion/google-fonts/CinzelDecorative";
import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";

const FPS = 30;
const TOTAL_DURATION_S = 8;
const TOTAL_FRAMES = TOTAL_DURATION_S * FPS; // 240

const { fontFamily: cinzelDeco } = loadFont();
const { fontFamily: cinzel } = loadCinzel();

export const SONJATA_CTA_FRAMES = TOTAL_FRAMES;

// -- SVG Icons --

const BellIcon: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <path
      d="M22 4C22 4 14 4 14 14V24L10 28V30H34V28L30 24V14C30 4 22 4 22 4Z"
      stroke="#D4A843"
      strokeWidth="2.5"
      strokeLinejoin="round"
      fill="#D4A843"
      fillOpacity="0.15"
    />
    <path
      d="M18 30C18 32.2 19.8 34 22 34C24.2 34 26 32.2 26 30"
      stroke="#D4A843"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="22" cy="8" r="2" fill="#D4A843" />
  </svg>
);

const HeartIcon: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <path
      d="M22 36L19.3 33.5C10 25.2 4 19.7 4 13C4 7.5 8.5 3 14 3C17.1 3 20.1 4.5 22 6.9C23.9 4.5 26.9 3 30 3C35.5 3 40 7.5 40 13C40 19.7 34 25.2 24.7 33.5L22 36Z"
      stroke="#D4A843"
      strokeWidth="2.5"
      fill="#D4A843"
      fillOpacity="0.15"
    />
  </svg>
);

const LinkIcon: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect
      x="8"
      y="10"
      width="28"
      height="20"
      rx="3"
      stroke="#D4A843"
      strokeWidth="2.5"
      fill="#D4A843"
      fillOpacity="0.15"
    />
    <path
      d="M8 16L22 24L36 16"
      stroke="#D4A843"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

// CTA line component
const CTALine: React.FC<{
  text: string;
  subtext?: string;
  appearFrame: number;
  yPosition: number;
  icon: React.ReactNode;
  fontSize?: number;
}> = ({ text, subtext, appearFrame, yPosition, icon, fontSize = 36 }) => {
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
      }}
    >
      {icon}
      <p
        style={{
          fontFamily: cinzelDeco,
          fontSize,
          fontWeight: 700,
          color: "#D4A843",
          margin: 0,
          textAlign: "center",
          lineHeight: 1.4,
          textShadow: "1px 1px 6px rgba(0,0,0,0.5)",
        }}
      >
        {text}
      </p>
      {subtext && (
        <p
          style={{
            fontFamily: cinzel,
            fontSize: 26,
            color: "#C4A265",
            margin: 0,
            textAlign: "center",
            letterSpacing: "0.08em",
            opacity: 0.8,
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  );
};

export const SonjataCTA: React.FC = () => {
  // Fade in from black (continuing from scene 10C fade to black)
  const frame = useCurrentFrame();
  const bgOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          backgroundColor: "#1A120B",
          opacity: bgOpacity,
        }}
      >
        {/* Line 1: Subscribe — synced with "Abonne-toi" at ~0.2s */}
        <CTALine
          text="Abonne-toi"
          subtext="pour le prochain h\u00E9ros"
          appearFrame={6}
          yPosition={500}
          icon={<BellIcon />}
          fontSize={42}
        />

        {/* Line 2: Like & comment — synced with "Et dis-nous" at ~3.8s */}
        <CTALine
          text="Like & commente"
          subtext="pour la version longue"
          appearFrame={Math.round(3.8 * FPS)}
          yPosition={780}
          icon={<HeartIcon />}
          fontSize={38}
        />

        {/* Line 3: Newsletter link in bio — appears at ~5.5s */}
        <CTALine
          text="Lien en bio"
          subtext="histoires g\u00E9opolitiques quotidiennes"
          appearFrame={Math.round(5.5 * FPS)}
          yPosition={1060}
          icon={<LinkIcon />}
          fontSize={36}
        />

        {/* Decorative separator line at top */}
        <div
          style={{
            position: "absolute",
            top: 440,
            left: 200,
            right: 200,
            height: 2,
            backgroundColor: "#D4A843",
            opacity: interpolate(frame, [5, 15], [0, 0.4], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />

        {/* Narration */}
        <Sequence from={0} durationInFrames={TOTAL_FRAMES}>
          <Audio
            src={staticFile(
              "audio/sonjata-papercraft/sonjata-cta-narration.mp3"
            )}
            volume={1.0}
          />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
