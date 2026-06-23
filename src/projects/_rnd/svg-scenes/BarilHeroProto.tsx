// BarilHeroProto.tsx — proto du pivot 60% en VRAI DATA-HERO (baril-heros central).
// Grammaire DECODE-mpesa-data-hero : objet-heros central immuable (~45% hauteur) + halo qui RESPIRE
// + donnees greffees par les COTES (spring, asymetrique) + minimum de texte. Fond navy serie.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { BarilJaugeIcon } from "../../_shared/thumbnails/icons/BarilJaugeIcon";

const { fontFamily: BEBAS } = loadBebas();
const NAVY = "#16213a", GOLD = "#c8a951", IVORY = "#f2efe6", GREY = "#3a4150";
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const W = 1920, H = 1080;

export const BarilHeroProto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // remplissage baril 0->60% (proto condense f10-70)
  const ratio = interpolate(frame, [10, 70], [0, 60], clamp);
  const num = Math.round(interpolate(frame, [10, 70], [0, 60], clamp));

  // halo qui RESPIRE autour du baril (Data-Hero : le pivot respire, cree du vide)
  const halo = 0.10 + 0.05 * Math.sin(frame / 16);

  // le 60% se greffe a droite du baril par spring (Data-Hero : donnee greffee sur le cote)
  const rightIn = spring({ frame: frame - 55, fps, config: { damping: 18, mass: 0.6 } });

  // baril HERO central, gros (~46% hauteur)
  const BARIL_CX = 960, BARIL_CY = 560, BARIL_W = 360, BARIL_H = 500;

  return (
    <AbsoluteFill style={{
      backgroundColor: NAVY,
      // FOND NAVY QUADRILLE bien visible (grille fine or, registre data Souverain).
      // 2 gradients lineaires (lignes verticales + horizontales) a opacite lisible (pas les dots 6% invisibles).
      backgroundImage:
        "linear-gradient(rgba(200,169,81,0.10) 1px, transparent 1px)," +
        "linear-gradient(90deg, rgba(200,169,81,0.10) 1px, transparent 1px)",
      backgroundSize: "60px 60px, 60px 60px",
    }}>
      {/* halo radial doux derriere le baril (respiration Data-Hero : le pivot RESPIRE) */}
      <AbsoluteFill style={{
        background: `radial-gradient(circle at 50% 55%, rgba(200,169,81,${halo}) 0%, rgba(200,169,81,0) 40%)`,
      }} />

      {/* SEUL TEXTE : la question, en haut */}
      <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center", color: IVORY, opacity: 0.92, fontFamily: BEBAS, fontSize: 50, letterSpacing: "0.05em" }}>
        Combien reste au Sénégal&nbsp;?
      </div>

      {/* BARIL HERO central, gros (~48% hauteur), centre */}
      <div style={{ position: "absolute", inset: 0 }}>
        <BarilJaugeIcon
          ratio={ratio}
          flagColors={{ a: "#00853F", b: "#FDEF42", c: "#E31B23" }}
          starColor="#00853F"
          position={{ cx: 640, cy: 380 }}
          size={{ w: 320, h: 470 }}
        />
      </div>

      {/* SEULE donnee : le 60% hero greffe a droite du baril (spring), SANS label texte */}
      <div style={{ position: "absolute", right: 290, top: 410, textAlign: "left", opacity: rightIn, transform: `translateX(${(1 - rightIn) * 40}px)` }}>
        <div style={{ fontFamily: BEBAS, fontSize: 210, lineHeight: 0.9, color: GOLD, textShadow: "0 0 30px rgba(200,169,81,0.3)" }}>{num}%</div>
      </div>
    </AbsoluteFill>
  );
};

export default BarilHeroProto;
