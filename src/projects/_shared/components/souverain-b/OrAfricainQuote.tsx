import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ─────────────────────────────────────────────────────────────────────────────
// OrAfricainQuote — Citation typographique pure (Mode C)
// Fond noir, texte italique blanc/jaune, signature SOUVERAIN.
// ─────────────────────────────────────────────────────────────────────────────

export interface OrAfricainQuoteProps {
  quote: string;
  quoteHighlight?: string;  // 2e ligne si phrase coupée
  signature?: string;       // défaut SOUVERAIN
  showSignature?: boolean;
}

const COLORS = {
  black:    "#080a10",
  yellow:   "#f4c534",
  ivory:    "#f2ebd9",
  slate:    "rgba(242,235,217,0.65)",
};

export const OrAfricainQuote: React.FC<OrAfricainQuoteProps> = ({
  quote,
  quoteHighlight,
  signature = "SOUVERAIN",
  showSignature = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const quoteP = spring({ frame, fps, config: { damping: 18 }, durationInFrames: 30 });
  const highlightP = spring({ frame: frame - 25, fps, config: { damping: 18 }, durationInFrames: 30 });
  const sigP = spring({ frame: frame - 60, fps, config: { damping: 18 }, durationInFrames: 25 });

  return (
    <AbsoluteFill style={{
      background: COLORS.black,
      backgroundImage: "radial-gradient(rgba(244,197,52,0.05) 1px, transparent 1px)",
      backgroundSize: "40px 40px",
    }}>
      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 80px",
      }}>
        <div style={{
          fontFamily: "Georgia, serif",
          fontSize: 52,
          fontStyle: "italic",
          color: COLORS.ivory,
          opacity: quoteP,
          transform: `translateY(${(1 - quoteP) * 25}px)`,
          textAlign: "center",
          lineHeight: 1.35,
          maxWidth: 900,
        }}>{quote}</div>

        {quoteHighlight && (
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: 60,
            fontWeight: 600,
            color: COLORS.yellow,
            opacity: highlightP,
            transform: `translateY(${(1 - highlightP) * 25}px)`,
            textAlign: "center",
            lineHeight: 1.2,
            marginTop: 40,
            maxWidth: 900,
          }}>{quoteHighlight}</div>
        )}

        {showSignature && (
          <div style={{
            marginTop: 120,
            opacity: sigP,
          }}>
            <div style={{
              fontFamily: "Georgia, serif",
              fontSize: 26,
              color: COLORS.yellow,
              letterSpacing: 8,
              textTransform: "uppercase",
              textAlign: "center",
            }}>{signature}</div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
