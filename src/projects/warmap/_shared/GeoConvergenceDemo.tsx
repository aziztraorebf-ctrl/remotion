/**
 * GeoConvergenceDemo — composition ISOLÉE pour valider GeoConvergenceOverlay AVANT intégration carte.
 * Fond = faux parchemin + drift (simule la carte). Données FACTUELLES (FACTS-PREPOSITIONNEMENT-2013.md).
 *
 * Forces ancrées dans leur DIRECTION GÉO réelle depuis le Mali (anti-symétrie, DA 2026-06-10) :
 *   Épervier (Tchad, EST) · Sabre (Burkina, SUD-EST) · Licorne (Côte d'Ivoire, SUD).
 *   Total ~1650 (950 + 450 + 250 FS).
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { GeoConvergenceOverlay, GeoForce } from "./GeoConvergenceOverlay";

// Mali décalé haut-gauche : les 3 forces sont toutes à l'E/SE/S (vraie géo) donc occupent
// le bas-droite ; on recentre l'ENSEMBLE en plaçant le Mali en haut-gauche du cadre.
const CENTER = { x: 470, y: 290 };

// Jetons-acteurs incarnés (grammaire D-6) : 3 soldats France DISTINCTS (même armée, pas clones).
// 3 jetons distincts générés from-scratch : vétéran / jeune fantassin / forces spéciales.
const FORCES: GeoForce[] = [
  { op: "Épervier", country: "Tchad",         effectif: 950, token: "_shared/sprites/warmap/fr-epervier.png", angleDeg: 6,   radius: 470, reach: 200, appearAt: 20 }, // EST
  { op: "Sabre",    country: "Burkina Faso",  effectif: 250, effectifText: "250 soldats · forces spéciales", token: "_shared/sprites/warmap/fr-sabre.png", angleDeg: 54, radius: 330, reach: 150, appearAt: 32 }, // SUD-EST
  { op: "Licorne",  country: "Côte d'Ivoire", effectif: 450, token: "_shared/sprites/warmap/fr-licorne.png", angleDeg: 108, radius: 330, reach: 170, appearAt: 44 }, // SUD
];

export const GeoConvergenceDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const dx = interpolate(frame, [0, 300], [0, -30]);
  const dy = interpolate(frame, [0, 300], [0, 14]);

  return (
    <AbsoluteFill style={{ background: "#C9BA98", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px) scale(1.1)` }}>
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <rect x={0} y={0} width={1920} height={1080} fill="#C9BA98" />
          <path d="M 200 300 Q 600 200 1000 360 T 1800 420 L 1800 800 Q 1200 720 700 820 T 100 760 Z" fill="#D8CBA8" opacity={0.7} />
          <path d="M 500 100 Q 900 250 1300 180 L 1500 600 Q 1000 560 600 640 Z" fill="#BEAE88" opacity={0.6} />
          {[...Array(10)].map((_, i) => (
            <line key={i} x1={0} y1={i * 110} x2={1920} y2={i * 110 + 40} stroke="#A89970" strokeWidth={1} opacity={0.3} />
          ))}
        </svg>
      </AbsoluteFill>

      <GeoConvergenceOverlay
        startFrame={20}
        holdFrames={250}
        trigger={70}
        surtitle="Janvier 2013"
        forces={FORCES}
        center={CENTER}
        total={1650}
        footer="hommes déjà en opération"
        veilAlpha={0.70}
        scale={1}
      />
    </AbsoluteFill>
  );
};
