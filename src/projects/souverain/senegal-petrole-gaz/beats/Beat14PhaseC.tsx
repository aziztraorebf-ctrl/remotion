import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Drapeaux SVG inline — flouté + desature en fond
// Phase C : 461 frames = 15.4s

const F_TOTAL = 461;
const FADE    = 18;

const C1_IN  = 0;
const C1_OUT = Math.round(F_TOTAL * 0.38);
const C2_IN  = Math.round(F_TOTAL * 0.33);
const C2_OUT = Math.round(F_TOTAL * 0.70);
const C3_IN  = Math.round(F_TOTAL * 0.65);
const C3_OUT = F_TOTAL;

const NAVY  = "#16213a";
const GOLD  = "#c8a951";
const IVORY = "#f2ebd9";

function FlagBotswana({ opacity }: { opacity: number }) {
  // Botswana : bleu ciel / blanc / noir / blanc / bleu ciel
  return (
    <svg
      viewBox="0 0 3 2"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity,
        filter: "blur(28px) saturate(0.18) brightness(0.55)",
      }}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="3" height="2" fill="#75AADB" />
      <rect y="0.77" width="3" height="0.13" fill="#fff" />
      <rect y="0.87" width="3" height="0.26" fill="#000" />
      <rect y="1.10" width="3" height="0.13" fill="#fff" />
    </svg>
  );
}

function FlagNorvege({ opacity }: { opacity: number }) {
  // Norvege : rouge + croix blanche + croix bleue
  return (
    <svg
      viewBox="0 22 66 44"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity,
        filter: "blur(28px) saturate(0.18) brightness(0.50)",
      }}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="66" height="44" y="22" fill="#EF2B2D" />
      {/* Croix blanche */}
      <rect x="14" y="22" width="8" height="44" fill="#fff" />
      <rect x="0" y="39" width="66" height="8" fill="#fff" />
      {/* Croix bleue */}
      <rect x="16" y="22" width="4" height="44" fill="#002868" />
      <rect x="0" y="41" width="66" height="4" fill="#002868" />
    </svg>
  );
}

function FlagSenegal({ opacity }: { opacity: number }) {
  // Senegal : vert / or / rouge + etoile verte centre
  return (
    <svg
      viewBox="0 0 3 2"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity,
        filter: "blur(40px) saturate(0.15) brightness(0.45)",
      }}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="1" height="2" fill="#00853F" />
      <rect x="1" width="1" height="2" fill="#FDEF42" />
      <rect x="2" width="1" height="2" fill="#E31B23" />
      {/* Etoile verte */}
      <polygon
        points="1.5,0.62 1.56,0.82 1.77,0.82 1.60,0.94 1.67,1.14 1.5,1.02 1.33,1.14 1.40,0.94 1.23,0.82 1.44,0.82"
        fill="#00853F"
      />
    </svg>
  );
}

function MomentSlide({
  opacity,
  flag,
  surtitre,
  pays,
  soustitre,
  couleur,
}: {
  opacity: number;
  flag: React.ReactNode;
  surtitre: string;
  pays: string;
  soustitre: string;
  couleur: string;
}) {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Drapeau flouté en fond */}
      {flag}

      {/* Voile navy par-dessus pour garder le fond sombre */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: NAVY,
        opacity: 0.72,
      }} />

      {/* Contenu centré */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 22,
          letterSpacing: "0.28em",
          color: couleur,
          opacity: 0.6,
          textTransform: "uppercase",
          margin: 0,
          marginBottom: 28,
        }}>
          {surtitre}
        </p>
        <p style={{
          fontFamily: "Cinzel, serif",
          fontSize: 130,
          fontWeight: 700,
          letterSpacing: "0.05em",
          color: couleur,
          textTransform: "uppercase",
          margin: 0,
          marginBottom: 24,
          lineHeight: 1,
        }}>
          {pays}
        </p>
        <p style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 26,
          letterSpacing: "0.12em",
          color: couleur,
          opacity: 0.65,
          margin: 0,
        }}>
          {soustitre}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

export const Beat14PhaseC: React.FC = () => {
  const frame = useCurrentFrame();

  const opC1 = interpolate(frame,
    [C1_IN, C1_IN + FADE, C1_OUT - FADE, C1_OUT],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opC2 = interpolate(frame,
    [C2_IN, C2_IN + FADE, C2_OUT - FADE, C2_OUT],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opC3 = interpolate(frame,
    [C3_IN, C3_IN + FADE, C3_OUT - FADE, C3_OUT],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: NAVY }}>

      {opC1 > 0 && (
        <MomentSlide
          opacity={opC1}
          flag={<FlagBotswana opacity={1} />}
          surtitre="Les règles d'abord"
          pays="Botswana"
          soustitre="Les revenus ont suivi."
          couleur={IVORY}
        />
      )}

      {opC2 > 0 && (
        <MomentSlide
          opacity={opC2}
          flag={<FlagNorvege opacity={1} />}
          surtitre="Les règles d'abord"
          pays="Norvège"
          soustitre="Les revenus ont suivi."
          couleur={IVORY}
        />
      )}

      {opC3 > 0 && (
        <MomentSlide
          opacity={opC3}
          flag={<FlagSenegal opacity={1} />}
          surtitre="C'est maintenant."
          pays="Sénégal"
          soustitre="Les règles sont en cours."
          couleur={GOLD}
        />
      )}

    </AbsoluteFill>
  );
};
