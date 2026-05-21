import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Beat 2 — Tension (10.9s, 327 frames)
// "Le Zimbabwe. 4e producteur mondial de lithium.
//  Le minerai partait brut — quelques centaines de dollars.
//  Transforme en Chine en composant de batterie — quinze fois plus."
//
// Approche : Remotion pur, SVG natif, springs
// Sequence narrative : label → producteur → minerai gauche → prix → batterie droite → ×15 stamp

const FPS = 30;

// Pivots audio locaux (frame 0 = debut du beat)
const F_LABEL_LEFT   = 18;   // "Zimbabwe"
const F_PRODUCTEUR   = 80;   // "lithium"
const F_MINERAI      = 170;  // "brut"
const F_PRIX_BRUT    = 240;  // "quelques centaines"
const F_BATTERIE     = 290;  // "Chine"
const F_QUINZE       = 310;  // "quinze fois"

// Couleurs
const NAVY    = "#0d1525";
const NAVY_BG = "#080d14";
const GOLD    = "#c08820";
const IVORY   = "#f0e8d8";
const GREY    = "#5a6a7a";
const RED     = "#c0392b";

export const Beat2Tension: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const spr = (from: number, cfg?: { stiffness?: number; damping?: number }) =>
    spring({ frame: frame - from, fps, config: { damping: 90, stiffness: 60, ...cfg } });

  const fadeIn = (from: number, dur = 20) =>
    interpolate(frame, [from, from + dur], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });

  const slideX = (from: number, dir: 1 | -1 = 1) =>
    interpolate(spr(from), [0, 1], [dir * 120, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });

  const scaleIn = (from: number) =>
    frame >= from ? spr(from) : 0;

  // Permanent motion — float vertical
  const floatOre     = Math.sin((frame / 90) * Math.PI * 2) * 6;
  const floatBattery = Math.sin((frame / 90) * Math.PI * 2 + Math.PI) * 6;

  // ×15 stamp — spring rebond fort (JSON: stiffness:120, damping:12)
  const x15Scale = frame >= F_QUINZE
    ? spring({ frame: frame - F_QUINZE, fps, config: { stiffness: 120, damping: 12 } })
    : 0;

  // 4e producteur fade out quand ×15 arrive
  const producerOpacity = interpolate(frame, [F_QUINZE - 10, F_QUINZE + 5], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Flux animé sur la ligne — dashoffset continu gauche→droite (suggestion Gemini #6)
  const fluxOffset = -(frame * 2);

  return (
    <AbsoluteFill style={{ background: NAVY_BG, fontFamily: "'IBM Plex Mono', monospace", overflow: "hidden" }}>

      {/* Background PNG premium genere par Gemini — dots + spotlight + vignette */}
      <AbsoluteFill>
        <Img
          src={staticFile("souverain/zimbabwe-lithium/assets/beat2/bg_premium_dots.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Ligne horizontale gold — gradient qui s'estompe aux bords + glow (suggestion #4) */}
      <AbsoluteFill>
        <div style={{
          position: "absolute",
          top: 958, left: "10%", right: "10%",
          height: 2,
          background: `linear-gradient(90deg, transparent 0%, rgba(192,136,32,0.9) 20%, rgba(192,136,32,0.9) 80%, transparent 100%)`,
          boxShadow: "0 0 10px rgba(192,136,32,0.4)",
        }} />
      </AbsoluteFill>

      {/* Flux animé sur la ligne (suggestion #6) — tirets gold qui voyagent G→D */}
      <AbsoluteFill style={{ opacity: fadeIn(F_MINERAI, 30) }}>
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          <line
            x1={108} y1={960} x2={972} y2={960}
            stroke={GOLD} strokeWidth={2.5}
            strokeDasharray="12 45"
            strokeDashoffset={fluxOffset}
            style={{ filter: "drop-shadow(0 0 5px #c08820)" }}
          />
        </svg>
      </AbsoluteFill>

      {/* Ligne verticale centre — separation */}
      <AbsoluteFill>
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          <line x1={540} y1={200} x2={540} y2={820} stroke={GOLD} strokeWidth={1} opacity={0.12} strokeDasharray="6 6" />
        </svg>
      </AbsoluteFill>

      {/* ── 4e PRODUCTEUR MONDIAL ────────────────────────────────────────────── */}
      <AbsoluteFill style={{
        opacity: fadeIn(F_PRODUCTEUR) * producerOpacity,
        transform: `translateY(${interpolate(spr(F_PRODUCTEUR), [0,1], [-20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
      }}>
        <div style={{
          position: "absolute",
          top: 200, left: 0, right: 0,
          textAlign: "center",
          color: GREY,
          fontSize: 30,
          letterSpacing: 5,
          fontWeight: 600,
        }}>
          4e PRODUCTEUR MONDIAL
        </div>
      </AbsoluteFill>

      {/* ── COLONNE GAUCHE : Minerai brut ───────────────────────────────────── */}

      {/* Badge label gauche — slide depuis gauche frame 18 */}
      <AbsoluteFill style={{
        opacity: fadeIn(F_LABEL_LEFT, 15),
        transform: `translateX(${slideX(F_LABEL_LEFT, -1)}px)`,
      }}>
        <div style={{
          position: "absolute",
          top: 1550, left: 40,
          background: NAVY,
          borderLeft: `4px solid ${GOLD}`,
          padding: "14px 24px",
          borderRadius: 3,
        }}>
          <div style={{ color: IVORY, fontSize: 22, letterSpacing: 2, fontWeight: 600 }}>
            MINERAI BRUT
          </div>
          <div style={{ color: GREY, fontSize: 16, letterSpacing: 1, marginTop: 2 }}>
            ZIMBABWE
          </div>
        </div>
      </AbsoluteFill>

      {/* Minerai PNG — roches hexagonales (fond noir + mix-blend-mode screen) */}
      <div style={{
        position: "absolute",
        left: -60, top: 300,
        width: 720, height: 720,
        opacity: scaleIn(F_MINERAI),
        transform: `scale(${scaleIn(F_MINERAI)}) translateY(${floatOre}px)`,
        transformOrigin: "290px 290px",
        mixBlendMode: "screen",
      }}>
        <Img
          src={staticFile("souverain/zimbabwe-lithium/assets/beat2/raw_lithium_screen.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      {/* Prix brut — opacity reduite pour accentuer disproportion (suggestion #5) */}
      <AbsoluteFill style={{ opacity: fadeIn(F_PRIX_BRUT, 12) * 0.75 }}>
        <div style={{
          position: "absolute",
          top: 1440, left: 40, width: 440,
          textAlign: "center",
          color: IVORY,
          fontSize: 52,
          fontWeight: 700,
          letterSpacing: 1,
        }}>
          ~ 300 $
        </div>
        <div style={{
          position: "absolute",
          top: 1500, left: 40, width: 440,
          textAlign: "center",
          color: GREY,
          fontSize: 20,
          letterSpacing: 2,
        }}>
          LA TONNE
        </div>
      </AbsoluteFill>

      {/* ── COLONNE DROITE : Composant batterie ─────────────────────────────── */}

      {/* Badge label droite — slide depuis droite frame 290 */}
      <AbsoluteFill style={{
        opacity: fadeIn(F_BATTERIE, 15),
        transform: `translateX(${slideX(F_BATTERIE, 1)}px)`,
      }}>
        <div style={{
          position: "absolute",
          top: 1550, right: 40,
          background: NAVY,
          borderLeft: `4px solid ${GOLD}`,
          padding: "14px 24px",
          borderRadius: 3,
        }}>
          <div style={{ color: GOLD, fontSize: 22, letterSpacing: 2, fontWeight: 600 }}>
            COMPOSANT
          </div>
          <div style={{ color: GREY, fontSize: 16, letterSpacing: 1, marginTop: 2 }}>
            CHINE
          </div>
        </div>
      </AbsoluteFill>

      {/* Batterie PNG — gold premium (fond noir + mix-blend-mode screen) */}
      <div style={{
        position: "absolute",
        right: -20, top: 280,
        width: 560, height: 720,
        opacity: fadeIn(F_BATTERIE, 20),
        transform: `translateX(${slideX(F_BATTERIE, 1)}px) translateY(${floatBattery}px)`,
        mixBlendMode: "screen",
        filter: "drop-shadow(0 0 20px rgba(192,136,32,0.4))",
      }}>
        <Img
          src={staticFile("souverain/zimbabwe-lithium/assets/beat2/battery_screen.png")}
          style={{ width: "100%", height: "100%", objectFit: "fill" }}
        />
      </div>

      {/* Prix batterie — full opacity + text-shadow gold pour guider l'oeil (suggestion #5) */}
      <AbsoluteFill style={{ opacity: fadeIn(F_QUINZE, 10) }}>
        <div style={{
          position: "absolute",
          top: 1440, right: 40, width: 440,
          textAlign: "center",
          color: GOLD,
          fontSize: 52,
          fontWeight: 700,
          letterSpacing: 1,
          textShadow: "0 0 20px rgba(192,136,32,0.6)",
        }}>
          ~ 4 500 $
        </div>
        <div style={{
          position: "absolute",
          top: 1500, right: 40, width: 440,
          textAlign: "center",
          color: GREY,
          fontSize: 20,
          letterSpacing: 2,
        }}>
          EQUIVALENT
        </div>
      </AbsoluteFill>

      {/* ── ×15 STAMP — gradient texte + ombre dure + overshoot spring (suggestion #3) */}
      <AbsoluteFill style={{
        opacity: x15Scale > 0.01 ? 1 : 0,
        transform: `scale(${x15Scale})`,
        transformOrigin: "center center",
      }}>
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{
            fontSize: 380,
            fontWeight: 900,
            letterSpacing: -15,
            lineHeight: 1,
            fontFamily: "'IBM Plex Mono', monospace",
            color: "#ffffff",
            textShadow: "0px 8px 0px rgba(0,0,0,0.7), 0 0 40px rgba(255,255,255,0.08)",
          }}>
            ×15
          </span>
        </div>
      </AbsoluteFill>

      {/* Zone sous-titres bas */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: 140,
        background: "rgba(8,13,20,0.9)",
        zIndex: 50,
      }} />

    </AbsoluteFill>
  );
};
