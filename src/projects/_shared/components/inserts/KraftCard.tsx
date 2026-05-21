/**
 * KraftCard — brique transversale Template D (WonderWhy beige epure)
 *
 * Reference visuelle validee Aziz 2026-05-09 :
 *   - Fond texture papier kraft beige ou variante (slate-indigo, ivoire, ardoise)
 *   - Asset centre : drapeau SVG, portrait, objet, icone (~30% hauteur)
 *   - Label sans-serif sous l'asset
 *   - Bulle dialogue optionnelle (style diplomatique BD)
 *   - Footnote optionnel (date, source, precision)
 *
 * Variantes palette :
 *   "kraft"  — beige sable chaud #d9c8a4 (WonderWhy signature)
 *   "slate"  — ardoise indigo sombre (variante Souverain nuit)
 *   "ivoire" — creme tres clair #f5f0e6 (variante editoriale)
 *
 * Usage :
 *   <KraftCard
 *     variant="kraft"
 *     asset={<Img src={staticFile("flags/niger.svg")} style={{width:240}} />}
 *     label="Niger"
 *     dialogue="Nous revendiquons 55% des royalties."
 *     footnote="Déclaration CNPC, 2023"
 *   />
 */

import React from "react";
import { AbsoluteFill, Img, staticFile, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type KraftCardVariant = "kraft" | "slate" | "ivoire";

const KRAFT_PALETTE: Record<KraftCardVariant, {
  bg: string;
  bgTexture: string | null;
  text: string;
  subtext: string;
  bubble: string;
  bubbleBorder: string;
  bubbleText: string;
  footnote: string;
  divider: string;
}> = {
  kraft: {
    bg:           "#d9c8a4",
    bgTexture:    "_shared/textures/bg-kraft-affirme.png",
    text:         "#1a120a",
    subtext:      "#4a3a2a",
    bubble:       "#faf6ee",
    bubbleBorder: "#8a7a5a",
    bubbleText:   "#1a120a",
    footnote:     "#7a6a4a",
    divider:      "rgba(90,70,30,0.2)",
  },
  slate: {
    bg:           "#1e2540",
    bgTexture:    null,
    text:         "#f0ece4",
    subtext:      "#b0a8c0",
    bubble:       "rgba(255,255,255,0.12)",
    bubbleBorder: "#6a7ab0",
    bubbleText:   "#f0ece4",
    footnote:     "#8080a0",
    divider:      "rgba(255,255,255,0.12)",
  },
  ivoire: {
    bg:           "#f5f0e6",
    bgTexture:    null,
    text:         "#1a1a1a",
    subtext:      "#5a5a5a",
    bubble:       "#ffffff",
    bubbleBorder: "#c0b090",
    bubbleText:   "#1a1a1a",
    footnote:     "#8a8070",
    divider:      "rgba(0,0,0,0.08)",
  },
};

type Props = {
  variant?: KraftCardVariant;
  asset: React.ReactNode;
  label: string;
  sublabel?: string;
  dialogue?: string;
  footnote?: string;
  appearFrame?: number;
  dialogueFrame?: number;
};

export const KraftCard: React.FC<Props> = ({
  variant = "kraft",
  asset,
  label,
  sublabel,
  dialogue,
  footnote,
  appearFrame = 0,
  dialogueFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const palette = KRAFT_PALETTE[variant];

  const cardScale = spring({
    frame: frame - appearFrame,
    fps,
    config: { damping: 18, stiffness: 80 },
    durationInFrames: 25,
  });

  const dialogStart = dialogueFrame ?? appearFrame + 20;
  const dialogScale = spring({
    frame: frame - dialogStart,
    fps,
    config: { damping: 16, stiffness: 100 },
    durationInFrames: 20,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: palette.bg }}>
      {/* Texture background */}
      {palette.bgTexture && (
        <Img
          src={staticFile(palette.bgTexture)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            mixBlendMode: "multiply",
            opacity: variant === "slate" ? 0.4 : 0.85,
          }}
        />
      )}

      {/* Carte centrale */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${cardScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* Asset (drapeau, portrait, objet) */}
        <div
          style={{
            width: Math.round(width * 0.52),
            height: Math.round(height * 0.28),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
            filter: variant === "slate" ? "drop-shadow(0 4px 16px rgba(0,0,0,0.5))" : "drop-shadow(0 3px 10px rgba(0,0,0,0.18))",
          }}
        >
          {asset}
        </div>

        {/* Label */}
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 52,
            fontWeight: 600,
            color: palette.text,
            letterSpacing: 1,
            textAlign: "center",
            marginBottom: sublabel ? 10 : 0,
          }}
        >
          {label}
        </div>

        {/* Sublabel */}
        {sublabel && (
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: 30,
              color: palette.subtext,
              textAlign: "center",
            }}
          >
            {sublabel}
          </div>
        )}

        {/* Bulle dialogue */}
        {dialogue && (
          <div
            style={{
              marginTop: 48,
              transform: `scale(${dialogScale})`,
              transformOrigin: "top center",
              maxWidth: Math.round(width * 0.72),
              position: "relative",
            }}
          >
            {/* Queue de bulle */}
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "16px solid transparent",
                borderRight: "16px solid transparent",
                borderBottom: `18px solid ${palette.bubbleBorder}`,
                margin: "0 auto",
              }}
            />
            <div
              style={{
                backgroundColor: palette.bubble,
                border: `1.5px solid ${palette.bubbleBorder}`,
                borderRadius: 6,
                padding: "20px 28px",
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontSize: 30,
                color: palette.bubbleText,
                lineHeight: 1.45,
                textAlign: "center",
              }}
            >
              {dialogue}
            </div>
          </div>
        )}

        {/* Footnote */}
        {footnote && (
          <div
            style={{
              marginTop: 24,
              fontFamily: "Georgia, serif",
              fontSize: 22,
              color: palette.footnote,
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            * {footnote}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
