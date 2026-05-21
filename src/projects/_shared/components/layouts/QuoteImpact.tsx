import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface QuoteImpactProps {
  question: string;
  subtitle?: string;
  startFrame: number;
}

export const QuoteImpact: React.FC<QuoteImpactProps> = ({
  question,
  subtitle,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = Math.max(0, frame - startFrame);

  const progress = spring({
    fps,
    frame: elapsed,
    config: { damping: 80, stiffness: 40 },
  });

  const contentOpacity = interpolate(progress, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const contentScale = interpolate(progress, [0, 1], [0.94, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill className="bg-navy-deep" style={{ zIndex: 10 }}>
      {/* Fond dégradé radial — navy profond au centre, presque noir aux bords */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, #1a1f35 0%, #0a0c14 60%, #050608 100%)",
        }}
      />

      {/* Contenu animé */}
      <AbsoluteFill
        className="flex flex-col items-center justify-center"
        style={{ opacity: contentOpacity, transform: `scale(${contentScale})` }}
      >
        {/* Guillemet ouvrant */}
        <div
          className="absolute font-serif font-bold select-none pointer-events-none"
          style={{
            top: 120,
            left: 32,
            fontSize: 480,
            lineHeight: 1,
            color: "#c8a95128",
            fontFamily: "Cinzel, Georgia, serif",
          }}
        >
          &ldquo;
        </div>

        {/* Guillemet fermant */}
        <div
          className="absolute font-serif font-bold select-none pointer-events-none"
          style={{
            bottom: 280,
            right: 32,
            fontSize: 480,
            lineHeight: 1,
            color: "#c8a95128",
            fontFamily: "Cinzel, Georgia, serif",
          }}
        >
          &rdquo;
        </div>

        {/* Zone texte principale — occupe 60%+ de la largeur */}
        <div
          className="relative z-10 flex flex-col items-center"
          style={{ padding: "0 40px", width: "100%" }}
        >
          <span
            className="text-ivory font-bold uppercase text-center block"
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: 175,
              lineHeight: 1.05,
              letterSpacing: "0.02em",
              width: "100%",
            }}
          >
            {question}
          </span>

          {/* Réglette or */}
          <div className="w-20 h-0.5 bg-gold mt-8 mb-6" />

          {subtitle && (
            <span
              className="text-slate text-center block"
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: 36,
                letterSpacing: "0.08em",
              }}
            >
              {subtitle}
            </span>
          )}
        </div>

        {/* Zone réservée karaoke — 140px en bas pour sous-titres TikTok */}
        <div className="absolute bottom-0 left-0 right-0" style={{ height: 200 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
