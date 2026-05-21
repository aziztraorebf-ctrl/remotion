import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { Users, Landmark, Radio } from "lucide-react";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import { SEG } from "./manifest";
import { SubtitleBar } from "./SubtitleBar";

const SUBTITLES = [
  { text: "M-Pesa a sorti des millions de Kenyans de l'exclusion financière.", start:   1, end:  38 },
  { text: "C'est vrai.",                                                        start:  38, end:  90 },
  { text: "Et les rails sur lesquels circule cet argent",                       start: 138, end: 193 },
  { text: "— ton salaire, tes urgences —",                                      start: 193, end: 300 },
  { text: "appartiennent à une seule entreprise privée.",                       start: 367, end: 461 },
  { text: "La question n'est pas si M-Pesa est bon ou mauvais.",                start: 461, end: 572 },
  { text: "La question c'est : qui décide ?",                                   start: 572, end: 663 },
];

const { fontFamily: bebas } = loadBebas();
const { fontFamily: mono } = loadMono();

export const BEAT6_DURATION = SEG.cta_pays.start + 30 - SEG.question_sorti.start;

const PHASE_B1_START = SEG.question_rails.start - SEG.question_sorti.start;       // f138
const PHASE_B2_START = SEG.question_bon_mauvais.start - SEG.question_sorti.start; // f461
const QUI_START      = SEG.question_qui.start - SEG.question_sorti.start;         // f572

const GOLD  = "#c8a951";
const IVORY = "#f0e8d8";
const DARK  = "#0d1420";
const NAVY  = "#112240";

// ─── Phase A — Statistique Pauvreté ─────────────────────────────────────────

function PhaseA({ frame, fps }: { frame: number; fps: number }) {
  // Polish : countUp -2% part de 0% → -2% sur 25 frames
  const statP = spring({ frame: frame - 30, fps, config: { damping: 90, stiffness: 60 } });
  const statScale = interpolate(statP, [0, 1], [0.3, 1], { extrapolateRight: "clamp" });
  const statOp    = interpolate(statP, [0, 1], [0, 1],   { extrapolateRight: "clamp" });
  const countProgress = interpolate(statP, [0, 1], [0, 2], { extrapolateRight: "clamp" });
  const countDisplay  = `-${Math.round(countProgress)}%`;

  const label1P  = spring({ frame: frame - 75, fps, config: { damping: 90, stiffness: 60 } });
  const label1Op = interpolate(label1P, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const label1Y  = interpolate(label1P, [0, 1], [20, 0], { extrapolateRight: "clamp" });

  const label2P  = spring({ frame: frame - 100, fps, config: { damping: 90, stiffness: 60 } });
  const label2Op = interpolate(label2P, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const label2Y  = interpolate(label2P, [0, 1], [20, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: DARK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

      {/* Grille 4×2 — 8 icônes ivoire identiques */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28, width: 560, marginBottom: 48 }}>
        {Array.from({ length: 8 }).map((_, i) => {
          const p     = spring({ frame: frame - i * 9, fps, config: { damping: 80, stiffness: 70 } });
          const op    = interpolate(p, [0, 1], [0, 0.5], { extrapolateRight: "clamp" });
          const scale = interpolate(p, [0, 1], [0.5, 1], { extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ display: "flex", justifyContent: "center", opacity: op, transform: `scale(${scale})` }}>
              <Users size={120} color={IVORY} strokeWidth={1.2} />
            </div>
          );
        })}
      </div>

      {/* CountUp -2% */}
      <div style={{
        fontFamily: mono, fontSize: 340, color: GOLD, lineHeight: 1,
        opacity: statOp, transform: `scale(${statScale})`,
        filter: statOp > 0 ? `drop-shadow(0px 0px 40px rgba(200,169,81,0.7))` : "none",
        letterSpacing: "-0.02em",
      }}>
        {countDisplay}
      </div>

      <div style={{ fontFamily: bebas, fontSize: 80, color: IVORY, letterSpacing: "0.1em", opacity: label1Op, transform: `translateY(${label1Y}px)`, marginTop: 16 }}>
        DE PAUVRETÉ EXTRÊME
      </div>
      <div style={{ fontFamily: bebas, fontSize: 56, color: GOLD, letterSpacing: "0.08em", opacity: label2Op, transform: `translateY(${label2Y}px)`, marginTop: 10 }}>
        'C'EST UN FAIT.
      </div>
    </AbsoluteFill>
  );
}

// ─── Phase B1 — Rails perspective centrés + texte remonté ───────────────────

function PhaseB1({ frame, fps }: { frame: number; fps: number }) {
  const lf = frame - PHASE_B1_START;

  const railsP  = spring({ frame: lf, fps, config: { damping: 80, stiffness: 50 } });
  const railsOp = interpolate(railsP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const traverseCount = lf >= 50 ? Math.min(7, Math.floor((lf - 50) / 9) + 1) : 0;

  const hlP  = spring({ frame: lf - 120, fps, config: { damping: 80, stiffness: 50 } });
  const hlOp = interpolate(hlP, [0, 1], [0, 0.9], { extrapolateRight: "clamp" });

  // Labels latéraux — float micro-motion polish
  const labP  = spring({ frame: lf - 60, fps, config: { damping: 90, stiffness: 60 } });
  const labOp = interpolate(labP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const labX  = interpolate(labP, [0, 1], [30, 0], { extrapolateRight: "clamp" });
  const floatY = Math.sin(lf * 0.07) * 4; // micro float permanent

  // Texte bas remonté — f130
  const t1P  = spring({ frame: lf - 130, fps, config: { damping: 90, stiffness: 60 } });
  const t1Op = interpolate(t1P, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const t1Y  = interpolate(t1P, [0, 1], [24, 0], { extrapolateRight: "clamp" });

  const t2P     = spring({ frame: lf - 190, fps, config: { damping: 80, stiffness: 55 } });
  const t2Op    = interpolate(t2P, [0, 1], [0, 1],   { extrapolateRight: "clamp" });
  const t2Scale = interpolate(t2P, [0, 1], [0.75, 1], { extrapolateRight: "clamp" });

  const glowPulse = 0.45 + 0.25 * Math.sin(lf * 0.08);

  return (
    <AbsoluteFill style={{ background: DARK }}>

      {/* Rails CSS perspective — centrés verticalement, remontés */}
      <div style={{
        position: "absolute",
        top: 80,
        left: "50%",
        transform: "translateX(-50%)",
        width: 680,
        height: 700,
        opacity: railsOp,
      }}>
        <div style={{
          width: "100%", height: "100%",
          transform: "perspective(1000px) rotateX(52deg)",
          transformOrigin: "top center",
          position: "relative",
        }}>
          {/* Rail gauche */}
          <div style={{
            position: "absolute", left: "28%", top: 0, bottom: 0, width: 5,
            background: hlOp > 0.05
              ? `linear-gradient(to bottom, rgba(224,80,80,${hlOp}), ${GOLD})`
              : GOLD,
            boxShadow: `0 0 10px rgba(200,169,81,${glowPulse})`,
          }} />
          {/* Rail droit */}
          <div style={{
            position: "absolute", right: "28%", top: 0, bottom: 0, width: 5,
            background: GOLD,
            boxShadow: `0 0 10px rgba(200,169,81,${glowPulse})`,
          }} />
          {/* Traverses */}
          {Array.from({ length: traverseCount }).map((_, i) => {
            const yPct = 8 + i * 13;
            const tP   = spring({ frame: lf - 50 - i * 9, fps, config: { damping: 80, stiffness: 60 } });
            const tOp  = interpolate(tP, [0, 1], [0, 0.6], { extrapolateRight: "clamp" });
            return (
              <div key={i} style={{
                position: "absolute", left: "28%", right: "28%",
                top: `${yPct}%`, height: 3,
                background: GOLD, opacity: tOp,
              }} />
            );
          })}
        </div>
      </div>

      {/* Labels latéraux avec float */}
      <div style={{
        position: "absolute", top: 460, left: 40,
        opacity: labOp, transform: `translateX(${-labX}px) translateY(${floatY}px)`,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{ fontFamily: bebas, fontSize: 38, color: IVORY, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
          TON SALAIRE
        </div>
        <div style={{ width: 60, height: 2, background: GOLD, opacity: 0.7 }} />
      </div>
      <div style={{
        position: "absolute", top: 500, right: 40,
        opacity: labOp, transform: `translateX(${labX}px) translateY(${floatY}px)`,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{ width: 60, height: 2, background: GOLD, opacity: 0.7 }} />
        <div style={{ fontFamily: bebas, fontSize: 38, color: IVORY, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
          TES URGENCES
        </div>
      </div>

      {/* Texte centré — remonté pour éviter zone karaoke (bottom 320px minimum) */}
      <div style={{
        position: "absolute", bottom: 360, left: 0, right: 0,
        textAlign: "center", padding: "0 60px",
      }}>
        <div style={{
          fontFamily: bebas, fontSize: 58, color: IVORY,
          letterSpacing: "0.08em", whiteSpace: "nowrap",
          opacity: t1Op, transform: `translateY(${t1Y}px)`, lineHeight: 1.25,
        }}>
          CES RAILS APPARTIENNENT
        </div>
        <div style={{
          fontFamily: bebas, fontSize: 70, color: GOLD,
          letterSpacing: "0.06em", whiteSpace: "nowrap",
          opacity: t2Op, transform: `scale(${t2Scale})`,
          lineHeight: 1.2, marginTop: 6,
          filter: t2Op > 0 ? `drop-shadow(0px 0px 22px rgba(200,169,81,0.8))` : "none",
        }}>
          À UNE SEULE ENTREPRISE PRIVÉE.
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Particules tombantes par colonne ────────────────────────────────────────
// zone : "left" ou "right" — tombent dans la moitié gauche ou droite

function ColumnParticles({ frame, side }: { frame: number; side: "left" | "right" }) {
  const count = 16;
  return (
    <div style={{
      position: "absolute",
      left: side === "left" ? 0 : "50%",
      right: side === "right" ? 0 : "50%",
      top: "45%",   // commencent sous les icônes
      bottom: 280,  // s'arrêtent avant la ligne séparatrice bas
      overflow: "hidden",
      pointerEvents: "none",
    }}>
      {Array.from({ length: count }).map((_, i) => {
        const xPct   = ((i * 137.508) % 1) * 100;
        const delay  = (i * 13) % 80;
        const speed  = 0.5 + (i % 4) * 0.25;
        const localF = (frame - delay + 320) % 110;
        const yPct   = (localF * speed) % 110;
        const size   = 2 + (i % 3);
        const op     = yPct < 100
          ? interpolate(yPct, [0, 8, 92, 100], [0, 0.75, 0.75, 0], { extrapolateRight: "clamp" })
          : 0;
        return (
          <div key={i} style={{
            position: "absolute",
            left: `${xPct}%`, top: `${yPct}%`,
            width: size, height: size,
            borderRadius: "50%",
            background: GOLD, opacity: op,
            boxShadow: `0 0 4px rgba(200,169,81,0.55)`,
          }} />
        );
      })}
    </div>
  );
}

// ─── Phase B2 — Split État vs Entreprise ─────────────────────────────────────

function PhaseB2({ frame, fps }: { frame: number; fps: number }) {
  const lf = frame - PHASE_B2_START;

  const iconAp  = spring({ frame: lf,      fps, config: { damping: 80, stiffness: 60 } });
  const iconAOp = interpolate(iconAp, [0, 1], [0, 1],   { extrapolateRight: "clamp" });
  const iconASc = interpolate(iconAp, [0, 1], [0.5, 1], { extrapolateRight: "clamp" });

  const iconBp  = spring({ frame: lf - 15, fps, config: { damping: 80, stiffness: 60 } });
  const iconBOp = interpolate(iconBp, [0, 1], [0, 1],   { extrapolateRight: "clamp" });
  const iconBSc = interpolate(iconBp, [0, 1], [0.5, 1], { extrapolateRight: "clamp" });

  const labelAp  = spring({ frame: lf - 20, fps, config: { damping: 90, stiffness: 60 } });
  const labelAOp = interpolate(labelAp, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const labelAY  = interpolate(labelAp, [0, 1], [16, 0], { extrapolateRight: "clamp" });

  const labelBp  = spring({ frame: lf - 35, fps, config: { damping: 90, stiffness: 60 } });
  const labelBOp = interpolate(labelBp, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const labelBY  = interpolate(labelBp, [0, 1], [16, 0], { extrapolateRight: "clamp" });

  // "QUI DÉCIDE ?"
  const quiLocal = QUI_START - PHASE_B2_START;
  const quiP     = spring({ frame: lf - quiLocal, fps, config: { damping: 80, stiffness: 55 } });
  const quiOp    = interpolate(quiP, [0, 1], [0, 1],    { extrapolateRight: "clamp" });
  const quiScale = interpolate(quiP, [0, 1], [0.65, 1], { extrapolateRight: "clamp" });
  // Polish : breathing après apparition
  const breathe  = quiOp > 0.9 ? 1 + 0.015 * Math.sin(lf * 0.06) : quiScale;

  // Séparateur horizontal — juste sous les labels
  const sepP = spring({ frame: lf - quiLocal + 5, fps, config: { damping: 90, stiffness: 70 } });
  const sepW = interpolate(sepP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // Polish : séparateur vertical pulse amplifié
  const divPulse = 0.55 + 0.2 * Math.sin(lf * 0.04);

  return (
    <AbsoluteFill className="overflow-hidden" style={{ background: "#0d1420" }}>

      {/* Fond uniforme navy */}
      <div className="absolute inset-0" style={{ background: "#112240" }} />

      {/* Dots background subtils */}
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(200,169,81,0.1) 1.5px, transparent 2px)",
        backgroundSize: "32px 32px",
      }} />

      {/* ZONE HAUTE — flex row, occupe 58% de l'écran */}
      <div className="absolute top-0 left-0 right-0 flex flex-row" style={{ height: "58%" }}>

        {/* Colonne gauche — centré verticalement + horizontalement */}
        <div className="flex-1 flex flex-col items-center justify-center" style={{ gap: 24 }}>
          <div style={{ opacity: iconAOp, transform: `scale(${iconASc})` }}>
            <Landmark size={256} color={IVORY} strokeWidth={1.0} />
          </div>
          <div className="text-ivory tracking-widest whitespace-nowrap" style={{
            fontFamily: bebas, fontSize: 44,
            opacity: labelAOp, transform: `translateY(${labelAY}px)`,
          }}>
            ÉTAT KENYAN
          </div>
        </div>

        {/* Séparateur vertical — toute la hauteur de la zone */}
        <div style={{ width: 2, background: IVORY, opacity: 0.35, flexShrink: 0 }} />

        {/* Colonne droite — centré verticalement + horizontalement */}
        <div className="flex-1 flex flex-col items-center justify-center" style={{ gap: 24 }}>
          <div style={{ opacity: iconBOp, transform: `scale(${iconBSc})` }}>
            <Radio size={256} color={GOLD} strokeWidth={1.0} />
          </div>
          <div className="text-gold tracking-widest whitespace-nowrap" style={{
            fontFamily: bebas, fontSize: 44,
            opacity: labelBOp, transform: `translateY(${labelBY}px)`,
          }}>
            ENTREPRISE PRIVÉE
          </div>
        </div>

      </div>

      {/* Séparateur horizontal à 58% */}
      <div className="absolute left-0 right-0" style={{
        top: "58%", height: 2,
        background: GOLD, opacity: 0.5,
        transform: `scaleX(${sepW})`, transformOrigin: "center",
      }} />

      {/* ZONE BASSE — flex, occupe 42% restant, QUI DÉCIDE centré */}
      <div className="absolute left-0 right-0 bottom-0 flex items-center justify-center" style={{ top: "58%" }}>
        <div className="text-gold tracking-wider" style={{
          fontFamily: bebas, fontSize: 110,
          opacity: quiOp, transform: `scale(${breathe})`,
          textShadow: `0px 2px 16px rgba(200,169,81,0.7), 0px 0px 50px rgba(200,169,81,0.3)`,
        }}>
          QUI DÉCIDE ?
        </div>
      </div>

    </AbsoluteFill>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export function Beat6Question() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {frame < PHASE_B1_START  && <PhaseA frame={frame} fps={fps} />}
      {frame >= PHASE_B1_START && frame < PHASE_B2_START && <PhaseB1 frame={frame} fps={fps} />}
      {frame >= PHASE_B2_START && <PhaseB2 frame={frame} fps={fps} />}
      <SubtitleBar lines={SUBTITLES} />
    </AbsoluteFill>
  );
}
