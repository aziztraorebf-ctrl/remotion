// S2 A4 Gqokli + Triple-screen synthese — Atlas Shaka Zulu
// Carte Gqokli Hill avec pulsations radar + flash 90% + triple-screen synthese final
// Duree : 9.0s (frames 1899 -> 2171 globale, 0 -> 272 local)

import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SHAKA_PALETTE, SHAKA_FONTS } from "../components/AtlasShakaPalette";

export interface AtlasShakaS2A4SyntheseProps {
  durationFrames: number;
  imageVariant?: "gemini-parchemin" | "gemini-pixellab" | "pixellab-mcp";
}

export const AtlasShakaS2A4Synthese: React.FC<AtlasShakaS2A4SyntheseProps> = ({
  durationFrames,
  imageVariant = "gemini-parchemin",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iklwaPath =
    imageVariant === "gemini-parchemin"
      ? "atlas-shaka-zulu/inserts/gemini/iklwa-parchemin.png"
      : "atlas-shaka-zulu/inserts/pixellab/iklwa-side.png";
  const bouclierPath =
    imageVariant === "gemini-parchemin"
      ? "atlas-shaka-zulu/inserts/gemini/bouclier-parchemin.png"
      : "atlas-shaka-zulu/inserts/pixellab/bouclier-side.png";

  // PHASE 1 (frames 0-200) : Gqokli Hill carte + radar pulse + flash 90%
  // PHASE 2 (frames 200-272) : triple-screen synthese

  const phase = frame < 180 ? 1 : 2;

  // Phase 1 elements
  const radarPulses = [0, 1, 2].map((i) => {
    const localFrame = frame - i * 15;
    const radius = interpolate(localFrame, [0, 60], [0, 200], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const pulseOpacity = interpolate(localFrame, [0, 60], [0.8, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { radius, opacity: pulseOpacity };
  });

  // Flash 90% : visible frames 90 -> 150
  const flash90Visible = frame >= 90 && frame < 160;
  const flash90Pulse = 1 + Math.sin((frame - 90) * 0.4) * 0.15;
  const flashWhiteFrame = frame === 90 || frame === 91; // 1-2 frames de flash blanc

  // Triple-screen synthese : visible frames 200 -> 272
  const tripleScale = spring({
    frame: Math.max(0, frame - 200),
    fps,
    config: { damping: 18, stiffness: 100 },
    from: 0.8,
    to: 1,
  });

  // Fade global
  const opacity = interpolate(
    frame,
    [0, 12, durationFrames - 12, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: SHAKA_PALETTE.CARTE_FOND, opacity }}>
      {/* PHASE 1 : Gqokli Hill */}
      {phase === 1 && (
        <>
          {/* Fond carte fake */}
          <AbsoluteFill
            style={{
              background: `radial-gradient(ellipse at 50% 55%, ${SHAKA_PALETTE.OR}30 0%, ${SHAKA_PALETTE.CARTE_FOND} 60%)`,
            }}
          />

          {/* Radar pulses */}
          <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            {radarPulses.map((pulse, i) => (
              <circle
                key={i}
                cx={960}
                cy={594}
                r={pulse.radius}
                fill="none"
                stroke={SHAKA_PALETTE.BORDEAUX}
                strokeWidth={3}
                opacity={pulse.opacity}
              />
            ))}
          </svg>

          {/* Marker centre */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "55%",
              transform: "translate(-50%, -50%)",
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: SHAKA_PALETTE.BORDEAUX,
              boxShadow: `0 0 40px ${SHAKA_PALETTE.BORDEAUX}`,
            }}
          />

          {/* Label Gqokli */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "62%",
              transform: "translate(-50%, 0)",
              fontSize: 52,
              fontWeight: 900,
              fontFamily: SHAKA_FONTS.TITRE,
              color: SHAKA_PALETTE.BORDEAUX,
              letterSpacing: "0.06em",
              textShadow: "0 4px 20px rgba(0,0,0,0.9)",
            }}
          >
            Gqokli Hill — 1818
          </div>

          {/* Flash blanc */}
          {flashWhiteFrame && <AbsoluteFill style={{ background: "#FFFFFF", opacity: 0.9 }} />}

          {/* Flash 90% pulse */}
          {flash90Visible && !flashWhiteFrame && (
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
              <div
                style={{
                  fontSize: 320,
                  fontWeight: 900,
                  fontFamily: SHAKA_FONTS.TITRE,
                  color: SHAKA_PALETTE.BORDEAUX,
                  transform: `scale(${flash90Pulse})`,
                  textShadow: "0 0 80px rgba(139, 0, 0, 0.9), 0 0 40px #FFFFFF",
                  letterSpacing: "0.02em",
                }}
              >
                90 %
              </div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: SHAKA_PALETTE.PARCHEMIN,
                  marginTop: 20,
                  letterSpacing: "0.05em",
                }}
              >
                de pertes chez l'ennemi
              </div>
            </AbsoluteFill>
          )}
        </>
      )}

      {/* PHASE 2 : Triple-screen synthese */}
      {phase === 2 && (
        <AbsoluteFill style={{ background: SHAKA_PALETTE.NOIR_PROFOND, opacity: tripleScale }}>
          <div style={{ display: "flex", height: "100%", gap: 8 }}>
            {/* Panel 1 : Iklwa */}
            <div
              style={{
                flex: 1,
                background: SHAKA_PALETTE.CARTE_FOND,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRight: `4px solid ${SHAKA_PALETTE.SEPARATEUR_BORDEAUX}`,
              }}
            >
              <Img src={staticFile(iklwaPath)} style={{ maxHeight: 600, maxWidth: "90%", objectFit: "contain" }} />
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 900,
                  fontFamily: SHAKA_FONTS.TITRE,
                  color: SHAKA_PALETTE.OR,
                  marginTop: 20,
                }}
              >
                Iklwa
              </div>
            </div>

            {/* Panel 2 : Bouclier */}
            <div
              style={{
                flex: 1,
                background: SHAKA_PALETTE.CARTE_FOND,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRight: `4px solid ${SHAKA_PALETTE.SEPARATEUR_BORDEAUX}`,
              }}
            >
              <Img src={staticFile(bouclierPath)} style={{ maxHeight: 600, maxWidth: "90%", objectFit: "contain" }} />
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 900,
                  fontFamily: SHAKA_FONTS.TITRE,
                  color: SHAKA_PALETTE.OR,
                  marginTop: 20,
                }}
              >
                Bouclier
              </div>
            </div>

            {/* Panel 3 : Cornes (schema) */}
            <div
              style={{
                flex: 1,
                background: SHAKA_PALETTE.CARTE_FOND,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 400 400" width={400} height={400}>
                {/* Centre or */}
                <rect x={170} y={180} width={60} height={40} fill={SHAKA_PALETTE.OR} />
                {/* Flancs bordeaux */}
                <path d="M 50,200 Q 150,80 200,180" stroke={SHAKA_PALETTE.BORDEAUX} strokeWidth={6} fill="none" />
                <path d="M 350,200 Q 250,80 200,180" stroke={SHAKA_PALETTE.BORDEAUX} strokeWidth={6} fill="none" />
                {/* Ennemi gris */}
                <circle cx={200} cy={150} r={8} fill={SHAKA_PALETTE.GRIS_ENNEMI} />
                <circle cx={185} cy={140} r={8} fill={SHAKA_PALETTE.GRIS_ENNEMI} />
                <circle cx={215} cy={155} r={8} fill={SHAKA_PALETTE.GRIS_ENNEMI} />
              </svg>
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 900,
                  fontFamily: SHAKA_FONTS.TITRE,
                  color: SHAKA_PALETTE.OR,
                  marginTop: 20,
                }}
              >
                Cornes
              </div>
            </div>
          </div>

          {/* Bandeau bas : "Une destruction totale." */}
          <div
            style={{
              position: "absolute",
              bottom: 40,
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: 44,
              fontWeight: 700,
              fontFamily: SHAKA_FONTS.TITRE,
              color: SHAKA_PALETTE.BORDEAUX,
              letterSpacing: "0.08em",
              textShadow: "0 4px 20px rgba(0,0,0,0.9)",
            }}
          >
            UNE DESTRUCTION TOTALE
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
