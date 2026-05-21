/**
 * Showcase Template D — KraftCard V3 (post-jury Jour 3)
 *
 * Verdict jury 3 LLMs :
 *   Option 1 : TWEAK (citation integree, "SOUVERAIN" subtil, typo +2pt)
 *   Option 2 : REWORK consensus 3/3 → SUPPRIMEE
 *   Option 3 : KEEP (template signature citation incarnee)
 *   Direction transversale : C — Document classifie/archive (consensus 2/2)
 *
 * 3 phases (120f = 4s chacune) :
 *
 * Phase A (f0-120) — Option 1 V3 : Cadre collection (corrections jury appliquees)
 * Phase B (f120-240) — Option 3 V2 : Fond narratif drapeau (KEEP avec tweaks Gemini)
 * Phase C (f240-360) — Option 4 NEW : Document classifie (Direction C)
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

const PHASE_DUR = 120;
const FADE = 12;
export const KRAFT_CARD_SHOWCASE_FRAMES = PHASE_DUR * 3;

const BG_KRAFT = "#d9c8a4";
const BG_KRAFT_DARK = "#b8a882";
const TEXT_DARK = "#1a120a";
const TEXT_MID = "#5a4a2a";
const ACCENT_OR = "#c8963c";
const ACCENT_TAMPON = "#a02525";

const phaseIn = (frame: number, start: number) =>
  interpolate(frame, [start, start + FADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const phaseOut = (frame: number, end: number) =>
  interpolate(frame, [end - FADE, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// Drapeau Niger SVG inline (ratio fixe)
const FlagNiger: React.FC<{ size?: number }> = ({ size = 260 }) => (
  <svg width={size} height={Math.round(size * 0.667)} viewBox="0 0 900 600">
    <rect width="900" height="200" fill="#E05206" />
    <rect y="200" width="900" height="200" fill="#FFFFFF" />
    <rect y="400" width="900" height="200" fill="#009A44" />
    <circle cx="450" cy="300" r="80" fill="#E05206" />
  </svg>
);

// Drapeau Niger comme fond plein ecran (3 bandes CSS, ratio libre)
const FlagNigerFullBg: React.FC = () => (
  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
    <div style={{ flex: 1, backgroundColor: "#E05206" }} />
    <div style={{ flex: 1, backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "18%", aspectRatio: "1", borderRadius: "50%", backgroundColor: "#E05206" }} />
    </div>
    <div style={{ flex: 1, backgroundColor: "#009A44" }} />
  </div>
);

// --- Option 1 V3 : Cadre collection — citation integree, "SOUVERAIN" subtil ---
const Option1Frame: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sc = spring({ frame, fps, config: { damping: 18, stiffness: 70 }, durationInFrames: 30 });
  const textOp = interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BG_KRAFT, opacity }}>
      <Img
        src={staticFile("_shared/textures/bg-kraft-affirme.png")}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", opacity: 0.82 }}
      />
      <div style={{ position: "absolute", top: 72, left: 44 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: TEXT_MID, fontStyle: "italic", letterSpacing: 1 }}>
          Option 1 V3 — Cadre collection (post-jury)
        </div>
      </div>

      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${sc})`,
        transformOrigin: "center center",
      }}>
        <div style={{
          padding: 24,
          border: `2.5px solid ${ACCENT_OR}`,
          boxShadow: `0 0 0 7px ${BG_KRAFT_DARK}, 0 0 0 10px ${ACCENT_OR}, 0 18px 56px rgba(0,0,0,0.32)`,
          backgroundColor: "#ede4cf",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          {/* "SOUVERAIN" plus subtil (recommandation Gemini) */}
          <div style={{ fontFamily: "Georgia, serif", fontSize: 12, color: TEXT_MID, opacity: 0.55, letterSpacing: 4, marginBottom: 16 }}>
            SOUVERAIN
          </div>
          <FlagNiger size={880} />
          <div style={{
            marginTop: 28,
            fontFamily: "Georgia, serif",
            fontSize: 76,
            fontWeight: 700,
            color: TEXT_DARK,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}>
            Niger
          </div>
          <div style={{ width: "80%", height: 2, backgroundColor: ACCENT_OR, opacity: 0.6, margin: "16px 0" }} />
          <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 40, color: TEXT_MID }}>
            République du Niger
          </div>
        </div>

        {/* Citation integree au fond kraft (pas de boite blanche detachee — tweak Gemini+Kimi) */}
        <div style={{ opacity: textOp, marginTop: 36, maxWidth: 720, textAlign: "center", paddingLeft: 28, paddingRight: 28 }}>
          <div style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: 32,
            color: TEXT_DARK,
            lineHeight: 1.45,
            borderLeft: `3px solid ${ACCENT_OR}`,
            borderRight: `3px solid ${ACCENT_OR}`,
            paddingLeft: 28,
            paddingRight: 28,
            paddingTop: 6,
            paddingBottom: 6,
          }}>
            "Nous revendiquons 55% des royalties sur l'uranium extrait de notre sol."
          </div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: TEXT_MID, marginTop: 14, letterSpacing: 0.3 }}>
            Déclaration CNPC · Niamey, 2023
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Option 3 V2 (ex-Option 3) : Fond narratif drapeau assombri — KEEP jury ---
const Option3Frame: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localF = frame - PHASE_DUR;
  const sc = spring({ frame: localF, fps, config: { damping: 18, stiffness: 70 }, durationInFrames: 30 });
  const cardOp = interpolate(localF, [20, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0e1a08", opacity }}>
      {/* Fond drapeau plein ecran assombri (KEEP — tres bien evalue par jury) */}
      <div style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        filter: "brightness(0.22) saturate(1.5) blur(3px)",
      }}>
        <FlagNigerFullBg />
      </div>

      {/* Grain texture */}
      <Img
        src={staticFile("_shared/textures/bg-kraft-affirme.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          mixBlendMode: "overlay",
          opacity: 0.18,
        }}
      />

      {/* Vignette radiale */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.6) 100%)",
      }} />

      <div style={{ position: "absolute", top: 72, left: 44, fontFamily: "Georgia, serif", fontSize: 22, color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>
        Option 2 V2 — Fond narratif (KEEP jury, sublabel or)
      </div>

      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: cardOp,
        transform: `scale(${sc})`,
        transformOrigin: "center center",
      }}>
        <div style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          overflow: "hidden",
          border: `3px solid ${ACCENT_OR}`,
          boxShadow: `0 0 0 5px rgba(200,150,60,0.25), 0 10px 36px rgba(0,0,0,0.7)`,
          marginBottom: 28,
        }}>
          <Img
            src={staticFile("_shared/flags-portraits/leaders/leader-portrait-editorial.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div style={{ fontFamily: "Georgia, serif", fontSize: 46, fontWeight: 700, color: "#fff", letterSpacing: 1, marginBottom: 8, textAlign: "center" }}>
          Mahamadou Issoufou
        </div>
        {/* Sublabel en or (tweak Gemini) */}
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 26, color: ACCENT_OR, marginBottom: 36 }}>
          Président du Niger 2011–2021
        </div>

        {/* Citation sans fond plein, juste liseré or (variante Gemini) */}
        <div style={{
          maxWidth: 560,
          padding: "18px 36px",
          textAlign: "center",
          borderLeft: `2px solid ${ACCENT_OR}`,
          borderRight: `2px solid ${ACCENT_OR}`,
        }}>
          <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 30, color: "#fff", lineHeight: 1.5, textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}>
            "L'uranium de notre pays enrichit d'autres nations. Cela doit changer."
          </div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 19, color: "rgba(255,255,255,0.55)", marginTop: 14 }}>
            Discours ONU, 2018
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Option 4 NEW : Document classifié (Direction C — consensus jury 2/2) ---
const Option4DocClassifie: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const localF = frame - PHASE_DUR * 2;
  const sc = spring({ frame: localF, fps, config: { damping: 20, stiffness: 80 }, durationInFrames: 28 });
  const tampon = interpolate(localF, [40, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tamponRot = interpolate(localF, [40, 65], [-25, -8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const annot = interpolate(localF, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BG_KRAFT, opacity }}>
      {/* Fond papier kraft */}
      <Img
        src={staticFile("_shared/textures/bg-kraft-affirme.png")}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", opacity: 0.95 }}
      />
      {/* Vignette papier */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(60,40,10,0.35) 100%)",
      }} />

      <div style={{ position: "absolute", top: 72, left: 44 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: TEXT_MID, fontStyle: "italic", letterSpacing: 1 }}>
          Option 3 NEW — Document classifié (Direction C jury)
        </div>
      </div>

      {/* Polaroid taped — portrait du leader incline legerement */}
      <div style={{
        position: "absolute",
        top: Math.round(height * 0.20),
        left: Math.round(width * 0.18),
        width: Math.round(width * 0.62),
        backgroundColor: "#f5f0e0",
        padding: "18px 18px 60px 18px",
        boxShadow: "0 12px 36px rgba(40,20,5,0.45), 0 4px 8px rgba(0,0,0,0.2)",
        transform: `scale(${sc}) rotate(-2.5deg)`,
        transformOrigin: "center center",
      }}>
        <Img
          src={staticFile("_shared/flags-portraits/leaders/leader-portrait-editorial.png")}
          style={{
            width: "100%",
            height: Math.round(width * 0.62 * 1.15),
            objectFit: "cover",
            filter: "grayscale(0.7) contrast(1.05) sepia(0.15)",
          }}
        />
        <div style={{
          marginTop: 14,
          fontFamily: "'Courier New', monospace",
          fontSize: 24,
          color: "#3a2a14",
          textAlign: "center",
          fontWeight: 700,
          letterSpacing: 1.5,
        }}>
          M. ISSOUFOU — Niamey, 2018
        </div>
        {/* Faux ruban adhesif haut-gauche */}
        <div style={{
          position: "absolute",
          top: -18,
          left: -22,
          width: 110,
          height: 32,
          backgroundColor: "rgba(220,200,140,0.75)",
          transform: "rotate(-18deg)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
          borderLeft: "1px dashed rgba(120,90,40,0.3)",
          borderRight: "1px dashed rgba(120,90,40,0.3)",
        }} />
      </div>

      {/* Tampon "VÉRIFIÉ" rouge — anime apparition + rotation */}
      <div style={{
        position: "absolute",
        top: Math.round(height * 0.62),
        right: Math.round(width * 0.10),
        opacity: tampon,
        transform: `rotate(${tamponRot}deg) scale(${0.7 + tampon * 0.3})`,
        transformOrigin: "center center",
      }}>
        <div style={{
          border: `5px solid ${ACCENT_TAMPON}`,
          padding: "10px 22px",
          fontFamily: "'Courier New', monospace",
          fontSize: 36,
          fontWeight: 900,
          color: ACCENT_TAMPON,
          letterSpacing: 4,
          backgroundColor: "rgba(245,235,210,0.4)",
          textShadow: "1px 1px 0 rgba(160,37,37,0.3)",
        }}>
          VÉRIFIÉ
        </div>
        <div style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 14,
          color: ACCENT_TAMPON,
          opacity: 0.7,
          textAlign: "center",
          marginTop: 4,
          letterSpacing: 1,
        }}>
          SOURCE PRIMAIRE
        </div>
      </div>

      {/* Annotation manuscrite simulee */}
      <div style={{
        position: "absolute",
        bottom: Math.round(height * 0.10),
        left: 60,
        right: 60,
        opacity: annot,
        fontFamily: "Georgia, serif",
        fontSize: 24,
        color: TEXT_DARK,
        lineHeight: 1.5,
        backgroundColor: "rgba(255,250,230,0.55)",
        padding: "16px 22px",
        borderLeft: `3px solid ${ACCENT_TAMPON}`,
      }}>
        <span style={{ fontWeight: 700 }}>Note :</span> Discours ONU 2018, repris sans coupure dans <em>Le Monde Afrique</em> (oct. 2018) et <em>RFI</em> (sept. 2018). Cohérent avec la position publique du président depuis 2014.
      </div>
    </AbsoluteFill>
  );
};

// --- Composition principale ---
export const KraftCardShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  const opA = Math.min(phaseIn(frame, 0), phaseOut(frame, PHASE_DUR));
  const opB = Math.min(phaseIn(frame, PHASE_DUR), phaseOut(frame, PHASE_DUR * 2));
  const opC = phaseIn(frame, PHASE_DUR * 2);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {opA > 0 && <Option1Frame opacity={opA} />}
      {opB > 0 && <Option3Frame opacity={opB} />}
      {opC > 0 && <Option4DocClassifie opacity={opC} />}
    </AbsoluteFill>
  );
};
