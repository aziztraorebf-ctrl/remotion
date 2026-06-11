/**
 * SahelFriseOverlayDemo — composition ISOLÉE pour valider le design de l'overlay frise
 * AVANT intégration sur la carte (workflow Aziz : render rapide sans Mapbox/52s).
 *
 * Fond = simulation parchemin + drift lent (imite la carte qui vit derrière le voile semi-transp),
 * pour juger la lisibilité réelle du voile cream sur fond non-uni.
 *
 * Données = factuelles (chronologie reconquête Serval 2013, vérifiée WebSearch 2026-06-09).
 * NB : exemple de DÉMONSTRATION du procédé — pas forcément le contenu final de B1.
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SahelFriseOverlay } from "./SahelFriseOverlay";

export const SahelFriseOverlayDemo: React.FC = () => {
  const frame = useCurrentFrame();
  // drift lent (imite la carte vivante derrière)
  const dx = interpolate(frame, [0, 300], [0, -40]);
  const dy = interpolate(frame, [0, 300], [0, 18]);

  return (
    <AbsoluteFill style={{ background: "#C9BA98", overflow: "hidden" }}>
      {/* faux fond carte : aplats parchemin + lignes (pour tester le voile sur du non-uni) */}
      <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px) scale(1.1)` }}>
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <rect x={0} y={0} width={1920} height={1080} fill="#C9BA98" />
          <path d="M 200 300 Q 600 200 1000 360 T 1800 420 L 1800 800 Q 1200 720 700 820 T 100 760 Z"
            fill="#D8CBA8" opacity={0.7} />
          <path d="M 500 100 Q 900 250 1300 180 L 1500 600 Q 1000 560 600 640 Z" fill="#BEAE88" opacity={0.6} />
          {[...Array(10)].map((_, i) => (
            <line key={i} x1={0} y1={i * 110} x2={1920} y2={i * 110 + 40} stroke="#A89970" strokeWidth={1} opacity={0.3} />
          ))}
          <circle cx={700} cy={460} r={8} fill="#2A2018" opacity={0.5} />
          <text x={720} y={464} fill="#2A2018" fontSize={20} fontFamily="Georgia, serif" opacity={0.6}>Bamako</text>
        </svg>
      </AbsoluteFill>

      {/* L'OVERLAY testé — données factuelles reconquête Serval (jours depuis le 11 jan 2013) */}
      <SahelFriseOverlay
        startFrame={20} holdFrames={260}
        surtitle="Reconquête · 2013"
        bars={[
          { label: "Diabaly", value: 10, highlight: true },
          { label: "Gao", value: 15 },
          { label: "Tombouctou", value: 17 },
        ]}
        unit="j"
        source="Chronologie opération Serval, jan. 2013"
      />
    </AbsoluteFill>
  );
};
