/**
 * WarMapDataOverlay — overlay Remotion premium "l'action se fige".
 *
 * A un beat cle (apogee RSF / catastrophe humaine), la carte se fige + s'assombrit
 * et une carte-donnee parchemin monte pour ~10s, posant LE chiffre du drame
 * (la crise des deplaces = la vraie histoire derriere le front). Count-up +
 * metaphore physique (barre de remplissage de silhouettes) + source. Puis reprise.
 *
 * Palette parchemin Atlas (discipline chromatique). Premium d'abord.
 */

import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { ATLAS } from "./sudanControlData";

type Props = {
  startFrame: number;   // debut de l'overlay
  holdFrames: number;   // duree totale visible
  fps: number;
  variant?: "displaced" | "famine"; // quel chiffre-drame
};

const CONTENT = {
  displaced: {
    kicker: "Derrière le front",
    big: 12, unit: "millions",
    sub: "de personnes déplacées",
    tagline: "La plus grave crise de déplacement au monde",
    source: "OCHA Soudan · Rapport humanitaire 2024",
    fillRatio: 1,
  },
  famine: {
    kicker: "Le coût caché",
    big: 30, unit: "millions",
    sub: "ont besoin d'aide humanitaire",
    tagline: "La plus grave crise humanitaire du monde",
    source: "OCHA · Rapport humanitaire Soudan 2025",
    fillRatio: 1,
  },
} as const;

// count-up avec overshoot physique
const countUp = (t: number, target: number) => {
  const e = t < 1 ? 1 - Math.pow(1 - t, 3) : 1;
  return Math.round(target * e);
};

export const WarMapDataOverlay: React.FC<Props> = ({ startFrame, holdFrames, fps, variant = "displaced" }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  if (local < 0 || local > holdFrames) return null;
  const C = CONTENT[variant];

  const fadeIn = interpolate(local, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(local, [holdFrames - 14, holdFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = Math.min(fadeIn, fadeOut);

  // montee de la carte (spring-like)
  const rise = interpolate(local, [0, 18], [60, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.9, 0.25, 1),
  });

  // count-up sur ~2.5s
  const tCount = interpolate(local, [10, 10 + 2.5 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bigVal = countUp(tCount, C.big); // chiffre-drame (ESTIME, OSINT)

  // metaphore : EXACTEMENT C.big icones (1 par million), s'allument une a une
  // en SYNC avec le compteur (Aziz : 12 -> 12 icones, 25 -> 25 icones).
  const TOTAL_ICONS = C.big;
  const filled = bigVal; // bigVal monte de 0 a C.big -> chaque million allume une icone
  // colonnes : 12 sur une ligne, 25 sur deux lignes plus serrees
  const cols = C.big <= 12 ? C.big : 13;

  const plaque: React.CSSProperties = {
    background: ATLAS.cream,
    border: `3px solid ${ATLAS.ink}`,
    borderRadius: 12,
    color: ATLAS.ink,
    boxShadow: "0 18px 60px rgba(0,0,0,0.5)",
  };

  return (
    <AbsoluteFill style={{ opacity: op, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      {/* CORRECTION Aziz : pas d'assombrissement. Voile PARCHEMIN CLAIR tres leger
          (la carte reste lumineuse, identite Atlas preservee). Juste assez pour
          detacher la carte-donnee sans casser la luminosite. */}
      <AbsoluteFill style={{ background: `${ATLAS.cream}59` }} />

      {/* carte-donnee centree */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
        <div style={{ ...plaque, padding: "44px 50px", transform: `translateY(${rise}px)`, width: "100%", maxWidth: 920, textAlign: "center" }}>
          <div style={{ fontSize: 24, letterSpacing: 4, fontWeight: 700, textTransform: "uppercase", opacity: 0.7 }}>
            {C.kicker}
          </div>
          <div style={{ height: 2, background: ATLAS.ink, opacity: 0.25, margin: "18px auto", width: "60%" }} />

          {/* chiffre-evenement */}
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 14 }}>
            <span style={{ fontSize: 150, fontWeight: 800, lineHeight: 0.9, fontFamily: "Georgia, serif", fontVariantNumeric: "tabular-nums" }}>
              {bigVal}
            </span>
            <span style={{ fontSize: 56, fontWeight: 700 }}>{C.unit}</span>
          </div>
          <div style={{ fontSize: 38, fontWeight: 600, marginTop: 8 }}>
            {C.sub}
          </div>

          {/* metaphore : 1 icone = 1 million, exactement C.big, s'allument en sync */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: C.big <= 12 ? 12 : 9, marginTop: 34, padding: "0 16px", justifyItems: "center" }}>
            {Array.from({ length: TOTAL_ICONS }).map((_, i) => (
              <PersonIcon key={i} on={i < filled} ink={ATLAS.ink} accent={ATLAS.rsf} />
            ))}
          </div>

          <div style={{ fontSize: 22, marginTop: 30, opacity: 0.7, fontStyle: "italic" }}>
            {C.tagline}
          </div>
          <div style={{ fontSize: 16, marginTop: 16, opacity: 0.55 }}>
            {C.source}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// WarMapFigureOverlay — presentation d'une figure humaine (usage ponctuel, Aziz)
// Portrait en gros (cercle parchemin) + legende. Carte reste claire derriere.
// ---------------------------------------------------------------------------
export const WarMapFigureOverlay: React.FC<{
  startFrame: number; holdFrames: number; fps: number;
  portrait: string; title: string; caption: string;
}> = ({ startFrame, holdFrames, fps, portrait, title, caption }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  if (local < 0 || local > holdFrames) return null;
  const op = Math.min(
    interpolate(local, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(local, [holdFrames - 14, holdFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  const scale = interpolate(local, [0, 16], [0.82, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 0.9, 0.25, 1),
  });
  return (
    <AbsoluteFill style={{ opacity: op, fontFamily: "'Cormorant Garamond', Georgia, serif", justifyContent: "center", alignItems: "center" }}>
      <AbsoluteFill style={{ background: `${ATLAS.cream}4D` }} />
      <div style={{ textAlign: "center", transform: `scale(${scale})` }}>
        <div style={{ width: 460, height: 460, borderRadius: "50%", margin: "0 auto", overflow: "hidden", background: ATLAS.cream, border: `6px solid ${ATLAS.ink}`, boxShadow: "0 18px 60px rgba(0,0,0,0.45)", position: "relative" }}>
          <img src={staticFile(`_shared/sprites/warmap/${portrait}.png`)} style={{ width: "120%", height: "120%", objectFit: "cover", objectPosition: "50% 16%", position: "absolute", left: "-10%", top: "-6%" }} />
        </div>
        <div style={{ marginTop: 30, display: "inline-block", background: ATLAS.cream, border: `3px solid ${ATLAS.ink}`, borderRadius: 10, padding: "16px 34px", color: ATLAS.ink, maxWidth: 820 }}>
          <div style={{ fontSize: 26, letterSpacing: 3, fontWeight: 700, textTransform: "uppercase", opacity: 0.7 }}>{title}</div>
          <div style={{ fontSize: 38, fontWeight: 600, marginTop: 6, fontStyle: "italic" }}>{caption}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PersonIcon: React.FC<{ on: boolean; ink: string; accent: string }> = ({ on, ink, accent }) => (
  <svg viewBox="0 0 24 24" style={{ width: "100%", height: "auto", opacity: on ? 1 : 0.16 }}>
    <circle cx="12" cy="7" r="4.2" fill={on ? accent : ink} />
    <path d="M4 22 C4 15, 20 15, 20 22 Z" fill={on ? accent : ink} />
  </svg>
);
