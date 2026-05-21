/**
 * BrutalHeadline — Template direction B (brutalisme editorial)
 *
 * Reference : magazines editoriaux (Monocle, Das Magazin), journalisme investigatif visuel
 * Style : photo plein cadre haute granularite + headline massive Bebas Neue + bande couleur
 *
 * Palette :
 *   "noir"   — fond #0a0a0a, headline blanc, accent or #f5d547 (signature Souverain)
 *   "rouge"  — fond #c0392b, headline blanc, accent creme #f5f0e6
 *   "blanc"  — fond blanc, headline noir, accent rouge #c0392b
 *
 * Usage minimal :
 *   <BrutalHeadline
 *     headline="L'URANIUM QUI VAUT UN EMPIRE"
 *     subline="Niger · 2006–2026"
 *     photo={<Img src={staticFile("...")} style={{width:"100%",height:"100%",objectFit:"cover"}} />}
 *   />
 */

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type BrutalHeadlineVariant = "noir" | "rouge" | "blanc";

const PALETTES: Record<BrutalHeadlineVariant, { bg: string; text: string; accent: string; bandeBg: string; bandeText: string }> = {
  noir: {
    bg: "#0a0a0a",
    text: "#ffffff",
    accent: "#f5d547",
    bandeBg: "#f5d547",
    bandeText: "#0a0a0a",
  },
  rouge: {
    bg: "#c0392b",
    text: "#ffffff",
    accent: "#f5f0e6",
    bandeBg: "#f5f0e6",
    bandeText: "#c0392b",
  },
  blanc: {
    bg: "#f5f0e6",
    text: "#0a0a0a",
    accent: "#c0392b",
    bandeBg: "#c0392b",
    bandeText: "#ffffff",
  },
};

interface BrutalHeadlineProps {
  headline: string;
  subline?: string;
  photo?: React.ReactNode;
  tag?: string;
  variant?: BrutalHeadlineVariant;
  photoRatio?: number;
}

export const BrutalHeadline: React.FC<BrutalHeadlineProps> = ({
  headline,
  subline,
  photo,
  tag,
  variant = "noir",
  photoRatio = 0.55,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pal = PALETTES[variant];

  const photoH = Math.round(1920 * photoRatio);
  const textH = 1920 - photoH;

  const photoReveal = spring({ frame, fps, config: { damping: 200, stiffness: 40 }, durationInFrames: 40 });
  const headlineProgress = spring({ frame: frame - 10, fps, config: { damping: 120, stiffness: 80 }, durationInFrames: 30 });
  const sublineProgress = spring({ frame: frame - 22, fps, config: { damping: 120, stiffness: 80 }, durationInFrames: 25 });
  const tagProgress = spring({ frame: frame - 5, fps, config: { damping: 200, stiffness: 120 }, durationInFrames: 20 });

  const photoScale = interpolate(photoReveal, [0, 1], [1.08, 1.0]);
  const headlineY = interpolate(headlineProgress, [0, 1], [40, 0]);
  const headlineOpacity = headlineProgress;
  const sublineY = interpolate(sublineProgress, [0, 1], [24, 0]);
  const sublineOpacity = sublineProgress;

  return (
    <AbsoluteFill style={{ background: pal.bg, overflow: "hidden" }}>
      {photo && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1080,
            height: photoH,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: `scale(${photoScale})`,
              transformOrigin: "center center",
            }}
          >
            {photo}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 200,
              background: `linear-gradient(to bottom, transparent, ${pal.bg})`,
            }}
          />
        </div>
      )}

      {tag && (
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 0,
            background: pal.bandeBg,
            color: pal.bandeText,
            fontFamily: "'Bebas Neue', 'Impact', sans-serif",
            fontSize: 32,
            letterSpacing: "0.25em",
            padding: "10px 40px 8px 40px",
            opacity: tagProgress,
          }}
        >
          {tag}
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: textH,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 60px 80px 60px",
          gap: 0,
        }}
      >
        <div
          style={{
            color: pal.text,
            fontFamily: "'Bebas Neue', 'Impact', 'Arial Black', sans-serif",
            fontSize: 128,
            lineHeight: 0.92,
            letterSpacing: "0.01em",
            textTransform: "uppercase",
            transform: `translateY(${headlineY}px)`,
            opacity: headlineOpacity,
          }}
        >
          {headline}
        </div>

        {subline && (
          <div
            style={{
              color: pal.accent,
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              fontSize: 46,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginTop: 18,
              transform: `translateY(${sublineY}px)`,
              opacity: sublineOpacity,
            }}
          >
            {subline}
          </div>
        )}

        <div
          style={{
            width: 80,
            height: 6,
            background: pal.accent,
            marginTop: 24,
            opacity: sublineOpacity,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
