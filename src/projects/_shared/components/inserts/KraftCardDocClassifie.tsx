/**
 * KraftCardDocClassifie — preset Document classifie / archive de terrain.
 *
 * Direction C validee par jury 3 LLMs (Jour 3, consensus 2/2 Gemini+GPT).
 * Polaroid taped + tampon estampille + annotation laterale optionnelle.
 *
 * Sujet (subject) modulable : portrait, drapeau, photo, icone, n'importe quel ReactNode.
 *
 * Usage minimal :
 *   <KraftCardDocClassifie
 *     subject={<Img src={staticFile("_shared/flags-portraits/leaders/leader-portrait-editorial.png")} style={{width:"100%",height:"100%",objectFit:"cover"}} />}
 *     caption="M. ISSOUFOU — Niamey, 2018"
 *     tampon="VÉRIFIÉ"
 *     tamponSubtext="SOURCE PRIMAIRE"
 *     note="Discours ONU 2018, repris par Le Monde Afrique."
 *   />
 *
 * Variantes tampon : "VÉRIFIÉ" | "OFFICIEL" | "CONTESTÉ" | "CLASSIFIÉ" | custom
 * Variantes subject : portrait, drapeau, document scan, photo paysage, etc.
 */

import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// Palette Direction C — Document classifie (constante exportee)
export const DOC_CLASSIFIE_PALETTE = {
  bgKraft:        "#d9c8a4",
  textDark:       "#1a120a",
  textMid:        "#5a4a2a",
  accentTampon:   "#a02525",
  polaroidPaper:  "#f5f0e0",
  rubanAdhesif:   "rgba(220,200,140,0.75)",
  noteBg:         "rgba(255,250,230,0.55)",
} as const;

export type TamponPreset = "VÉRIFIÉ" | "OFFICIEL" | "CONTESTÉ" | "CLASSIFIÉ" | string;

type Props = {
  /** Sujet central : portrait, drapeau, photo, icone, ReactNode libre */
  subject: React.ReactNode;
  /** Legende sous le polaroid (font Courier monospace) */
  caption: string;
  /** Texte du tampon principal */
  tampon?: TamponPreset;
  /** Sous-texte sous le tampon (ex: "SOURCE PRIMAIRE") */
  tamponSubtext?: string;
  /** Annotation manuscrite simulee en bas */
  note?: string;
  /** Frame d'apparition du polaroid (default 0) */
  appearFrame?: number;
  /** Frame d'apparition du tampon (default appearFrame + 40) */
  tamponFrame?: number;
  /** Frame d'apparition de la note (default tamponFrame + 20) */
  noteFrame?: number;
  /** Cacher le tampon (utile si on veut juste le polaroid) */
  hideTampon?: boolean;
  /** Cacher la note */
  hideNote?: boolean;
};

export const KraftCardDocClassifie: React.FC<Props> = ({
  subject,
  caption,
  tampon = "VÉRIFIÉ",
  tamponSubtext = "SOURCE PRIMAIRE",
  note,
  appearFrame = 0,
  tamponFrame,
  noteFrame,
  hideTampon = false,
  hideNote = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const palette = DOC_CLASSIFIE_PALETTE;

  const polaroidScale = spring({
    frame: frame - appearFrame,
    fps,
    config: { damping: 20, stiffness: 80 },
    durationInFrames: 28,
  });

  const tamponStart = tamponFrame ?? appearFrame + 40;
  const tamponOp = interpolate(frame - tamponStart, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tamponRot = interpolate(frame - tamponStart, [0, 25], [-25, -8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tamponSc = interpolate(frame - tamponStart, [0, 15], [0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const noteStart = noteFrame ?? tamponStart + 20;
  const noteOp = interpolate(frame - noteStart, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: palette.bgKraft }}>
      {/* Fond papier kraft */}
      <Img
        src={staticFile("_shared/textures/bg-kraft-affirme.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          mixBlendMode: "multiply",
          opacity: 0.95,
        }}
      />

      {/* Vignette papier */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(60,40,10,0.35) 100%)",
      }} />

      {/* Polaroid taped — sujet modulable */}
      <div style={{
        position: "absolute",
        top: Math.round(height * 0.18),
        left: Math.round(width * 0.18),
        width: Math.round(width * 0.62),
        backgroundColor: palette.polaroidPaper,
        padding: "18px 18px 60px 18px",
        boxShadow: "0 12px 36px rgba(40,20,5,0.45), 0 4px 8px rgba(0,0,0,0.2)",
        transform: `scale(${polaroidScale}) rotate(-2.5deg)`,
        transformOrigin: "center center",
      }}>
        <div style={{
          width: "100%",
          height: Math.round(width * 0.62 * 1.15),
          overflow: "hidden",
        }}>
          {subject}
        </div>
        <div style={{
          marginTop: 14,
          fontFamily: "'Courier New', monospace",
          fontSize: 24,
          color: "#3a2a14",
          textAlign: "center",
          fontWeight: 700,
          letterSpacing: 1.5,
        }}>
          {caption}
        </div>
        {/* Faux ruban adhesif haut-gauche */}
        <div style={{
          position: "absolute",
          top: -18,
          left: -22,
          width: 110,
          height: 32,
          backgroundColor: palette.rubanAdhesif,
          transform: "rotate(-18deg)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
          borderLeft: "1px dashed rgba(120,90,40,0.3)",
          borderRight: "1px dashed rgba(120,90,40,0.3)",
        }} />
      </div>

      {/* Tampon estampille */}
      {!hideTampon && (
        <div style={{
          position: "absolute",
          top: Math.round(height * 0.62),
          right: Math.round(width * 0.10),
          opacity: tamponOp,
          transform: `rotate(${tamponRot}deg) scale(${tamponSc})`,
          transformOrigin: "center center",
        }}>
          <div style={{
            border: `5px solid ${palette.accentTampon}`,
            padding: "10px 22px",
            fontFamily: "'Courier New', monospace",
            fontSize: 36,
            fontWeight: 900,
            color: palette.accentTampon,
            letterSpacing: 4,
            backgroundColor: "rgba(245,235,210,0.4)",
            textShadow: `1px 1px 0 ${palette.accentTampon}33`,
          }}>
            {tampon}
          </div>
          {tamponSubtext && (
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 14,
              color: palette.accentTampon,
              opacity: 0.7,
              textAlign: "center",
              marginTop: 4,
              letterSpacing: 1,
            }}>
              {tamponSubtext}
            </div>
          )}
        </div>
      )}

      {/* Annotation manuscrite simulee */}
      {note && !hideNote && (
        <div style={{
          position: "absolute",
          bottom: Math.round(height * 0.08),
          left: 60,
          right: 60,
          opacity: noteOp,
          fontFamily: "Georgia, serif",
          fontSize: 24,
          color: palette.textDark,
          lineHeight: 1.5,
          backgroundColor: palette.noteBg,
          padding: "16px 22px",
          borderLeft: `3px solid ${palette.accentTampon}`,
        }}>
          <span style={{ fontWeight: 700 }}>Note :</span> {note}
        </div>
      )}
    </AbsoluteFill>
  );
};
