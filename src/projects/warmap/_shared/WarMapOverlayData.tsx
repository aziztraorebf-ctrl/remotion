/**
 * WarMapOverlayData — overlay DONNEE MAJEURE generique (type R2 solide).
 *
 * Regle R2 (WARMAP-PLAYBOOK) : info sans equivalent cartographique = fond SOLIDE
 * parchemin, CENTRE, fige l'action ~7-10s. Chiffre-evenement + N icones exactes
 * (1 icone = 1 unite) + source. Count-up overshoot.
 *
 * Generalise WarMapDataOverlay (engine/) : le contenu vient des PROPS, pas d'un
 * dictionnaire hardcode. Reutilisable pour tout sujet (deplaces, famine, PIB, etc.).
 *
 * Usage minimal :
 *   <WarMapOverlayData startFrame={230} holdFrames={300} fps={30}
 *     kicker="Derriere le front" big={12} unit="millions"
 *     sub="de personnes deplacees" tagline="La plus grave crise de deplacement" />
 *
 * Regle R4 : fond cream clair (jamais noir). R3 : sequentiel — appeler ce composant
 * apres que l'action s'est arretee, pas pendant un mouvement.
 */

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";

const ATLAS = {
  cream: "#F2E5C8",
  ink: "#3A2A18",
  rsf: "#B14B3C",
} as const;

type Props = {
  startFrame: number;
  holdFrames: number;
  fps: number;
  kicker: string;
  big: number;           // chiffre principal (aussi le nombre d'icones)
  unit: string;          // ex: "millions"
  sub: string;           // ex: "de personnes deplacees"
  tagline?: string;      // italique sous les icones
  source?: string;       // ligne source (defaut: "Sources OSINT")
  accentColor?: string;  // couleur icones allumees (defaut: rouge RSF)
};

const countUp = (t: number, target: number) => {
  const e = t < 1 ? 1 - Math.pow(1 - t, 3) : 1;
  return Math.round(target * e);
};

const PersonIcon: React.FC<{ on: boolean; color: string; ink: string }> = ({ on, color, ink }) => (
  <svg viewBox="0 0 24 24" style={{ width: "100%", height: "auto", opacity: on ? 1 : 0.16 }}>
    <circle cx="12" cy="7" r="4.2" fill={on ? color : ink} />
    <path d="M4 22 C4 15, 20 15, 20 22 Z" fill={on ? color : ink} />
  </svg>
);

export const WarMapOverlayData: React.FC<Props> = ({
  startFrame, holdFrames, fps,
  kicker, big, unit, sub, tagline, source,
  accentColor = ATLAS.rsf,
}) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  if (local < 0 || local > holdFrames) return null;

  const fadeIn = interpolate(local, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(local, [holdFrames - 14, holdFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = Math.min(fadeIn, fadeOut);

  const rise = interpolate(local, [0, 18], [60, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.9, 0.25, 1),
  });

  const tCount = interpolate(local, [10, 10 + 2.5 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bigVal = countUp(tCount, big);

  const cols = big <= 12 ? big : 13;

  return (
    <AbsoluteFill style={{ opacity: op, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      {/* voile cream clair (R4 : jamais noir, identite parchemin preservee) */}
      <AbsoluteFill style={{ background: `${ATLAS.cream}59` }} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
        <div style={{
          background: ATLAS.cream,
          border: `3px solid ${ATLAS.ink}`,
          borderRadius: 12,
          color: ATLAS.ink,
          boxShadow: "0 18px 60px rgba(0,0,0,0.5)",
          padding: "44px 50px",
          transform: `translateY(${rise}px)`,
          width: "100%",
          maxWidth: 920,
          textAlign: "center",
        }}>
          <div style={{ fontSize: 24, letterSpacing: 4, fontWeight: 700, textTransform: "uppercase", opacity: 0.7 }}>
            {kicker}
          </div>
          <div style={{ height: 2, background: ATLAS.ink, opacity: 0.25, margin: "18px auto", width: "60%" }} />

          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 14 }}>
            <span style={{ fontSize: 150, fontWeight: 800, lineHeight: 0.9, fontFamily: "Georgia, serif", fontVariantNumeric: "tabular-nums" }}>
              {bigVal}
            </span>
            <span style={{ fontSize: 56, fontWeight: 700 }}>{unit}</span>
          </div>
          <div style={{ fontSize: 38, fontWeight: 600, marginTop: 8 }}>{sub}</div>

          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: big <= 12 ? 12 : 9,
            marginTop: 34, padding: "0 16px",
            justifyItems: "center",
          }}>
            {Array.from({ length: big }).map((_, i) => (
              <PersonIcon key={i} on={i < bigVal} color={accentColor} ink={ATLAS.ink} />
            ))}
          </div>

          {tagline && (
            <div style={{ fontSize: 22, marginTop: 30, opacity: 0.7, fontStyle: "italic" }}>
              {tagline}
            </div>
          )}
          <div style={{ fontSize: 16, marginTop: 16, opacity: 0.55 }}>
            {source ?? "Chiffres estimés · Sources OSINT (ACLED, ONU)"}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
