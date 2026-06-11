/**
 * SahelPrepositionnementDemo — composition ISOLÉE pour valider le design de l'overlay
 * pré-positionnement PREMIUM (D-9) AVANT intégration carte (render rapide sans Mapbox).
 *
 * Fond = simulation parchemin + drift lent (imite la carte qui vit derrière le voile semi-transp).
 * Données FACTUELLES (FACTS-PREPOSITIONNEMENT-2013.md, vérifié 2026-06-09) :
 *   Épervier (Tchad, 950, EST) · Licorne (Côte d'Ivoire, 450, SUD) · Sabre (Burkina, forces spéciales, SUD-EST).
 *   Total ~1 650 hommes en opération autour du Mali AVANT Serval.
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Plane, Shield, Swords } from "lucide-react";
import { SahelPrepositionnementOverlay, Force } from "./SahelPrepositionnementOverlay";

// Repère overlay W=1280 H=720. Mali = nœud central (remonté pour aérer le bas) ;
// 3 forces réparties autour dans leurs directions réelles (Épervier EST, Sabre SUD-EST, Licorne SUD).
const CENTER = { x: 640, y: 312 };

const FORCES: Force[] = [
  { op: "Épervier", country: "Tchad",         count: 950, Icon: Plane,  x: 1086, y: 250 }, // EST
  { op: "Sabre",    country: "Burkina Faso",  count: 0, countText: "Forces spéciales", Icon: Swords, x: 868, y: 508 }, // SUD-EST
  { op: "Licorne",  country: "Côte d'Ivoire", count: 450, Icon: Shield, x: 318, y: 470 }, // SUD
];

export const SahelPrepositionnementDemo: React.FC = () => {
  const frame = useCurrentFrame();
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
        </svg>
      </AbsoluteFill>

      {/* L'OVERLAY testé */}
      <SahelPrepositionnementOverlay
        startFrame={20}
        holdFrames={240}
        surtitle="Janvier 2013"
        forces={FORCES}
        center={CENTER}
        total={1650}
        footer="hommes déjà en opération"
      />
    </AbsoluteFill>
  );
};
