/**
 * ShockWave3D — SPIKE 2 (R&D, branche rnd/chill-meter-3d)
 *
 * INTENTION : FAIRE SURSAUTER — le 100 % doit se sentir comme une decharge,
 *             pas comme une etape de plus apres le 75 %.
 * FORME     : une onde qui EXPLOSE du meter et traverse le cadre vers le
 *             haut-droite, puis meurt avant son visage.
 * MOTEUR    : 3D (Three.js/R3F) — registre LA MATIERE, applique a un objet.
 *             ⭐ Justification du changement de registre : l'onde existe DEJA
 *             en SVG dans ChillMeterOverlay (FullChillEffect, l.114-119) et
 *             c'est precisement le chantier n°2 du jalon 2 — "pas identifiee
 *             clairement" sur les frames. Un cercle SVG qui grandit donne un
 *             contour ; il ne donne ni epaisseur, ni refraction, ni la
 *             profondeur qui fait lire une onde comme un VOLUME d'air glace.
 *             Le SVG dit OU, la 3D dit DE QUOI C'EST FAIT. Rester en SVG
 *             serait re-doser un effet deja juge insuffisant.
 * TEMPLATE  : pattern ThreeCanvas de PremiumCard3D.tsx (l.384-394), seul
 *             pattern 3D+alpha prouve au render sur ce repo (spike 1).
 *
 * QUESTION POSEE PAR CE SPIKE : peut-on ancrer un objet 3D exactement sur le
 * device SVG, pour que l'onde parte DU METER (brief Abigail : "a frozen shock
 * wave bursts from the meter") et non d'a-cote ?
 *
 * Ce fichier ne touche PAS le livrable contractuel. Il ne fait qu'importer les
 * constantes de placement pour viser le meme point que l'overlay SVG.
 *
 * Le sujet technique : passer des pixels ecran (POS_X/POS_Y/SCALE, repere
 * Remotion origine haut-gauche, Y vers le BAS) aux coordonnees monde Three.js
 * (origine au centre, Y vers le HAUT). Une erreur de signe sur Y et l'onde
 * part symetriquement du mauvais cote — invisible en lisant le code, evident
 * une fois mesure.
 */

import { ThreeCanvas } from "@remotion/three";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { DEVICE_W, DEVICE_H } from "./ChillMeterDevice";

// Placement du device — valeurs miroir de ChillMeterOverlay.tsx (jalon 1 valide).
const POS_X = 180;
const POS_Y = 706;
const SCALE = 0.373595;

const CAM_Z = 10.5;
const CAM_FOV = 40;

/**
 * Convertit un point ecran (px, origine haut-gauche) en coordonnees monde
 * Three.js sur le plan z=0, pour une camera perspective centree.
 */
export const screenToWorld = (
  px: number,
  py: number,
  width: number,
  height: number,
) => {
  // Hauteur visible du plan z=0 vue par une camera perspective a distance CAM_Z.
  const visibleH = 2 * CAM_Z * Math.tan((CAM_FOV * Math.PI) / 180 / 2);
  const visibleW = visibleH * (width / height);
  return {
    x: (px / width - 0.5) * visibleW,
    // Y s'inverse : ecran vers le bas, monde vers le haut.
    y: -(py / height - 0.5) * visibleH,
    visibleW,
    visibleH,
  };
};

/** Anneau de glace qui se propage depuis l'origine, dans le plan de l'ecran. */
const IceRing: React.FC<{
  progress: number;
  x: number;
  y: number;
  delay: number;
  maxR: number;
}> = ({ progress, x, y, delay, maxR }) => {
  const p = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
  if (p <= 0) return null;

  const r = interpolate(p, [0, 1], [0.05, maxR]);
  const op = interpolate(p, [0, 0.18, 0.7, 1], [0, 0.85, 0.4, 0], {
    extrapolateRight: "clamp",
  });
  // L'anneau s'affine en s'etendant, comme une onde qui perd son energie.
  const thickness = interpolate(p, [0, 1], [0.22, 0.045]);

  return (
    <mesh position={[x, y, 0]}>
      <ringGeometry args={[Math.max(0.01, r - thickness), r, 96]} />
      <meshBasicMaterial
        color="#bfefff"
        transparent
        opacity={op}
        depthWrite={false}
      />
    </mesh>
  );
};

/** Eclats de glace projetes vers le haut-droite, comme dans le brief. */
const Shards: React.FC<{ progress: number; x: number; y: number }> = ({
  progress,
  x,
  y,
}) => {
  const shards = React.useMemo(
    () =>
      new Array(14).fill(0).map((_, i) => {
        // Cone oriente vers le haut-droite (brief : "upward and to the right").
        const a = -0.15 + (i / 13) * 1.25;
        return {
          a,
          len: 1.6 + (((i * 37) % 100) / 100) * 2.4,
          s: 0.05 + (((i * 53) % 100) / 100) * 0.07,
        };
      }),
    [],
  );

  return (
    <group position={[x, y, 0]}>
      {shards.map((s, i) => {
        const p = Math.max(0, Math.min(1, (progress - 0.05) / 0.95));
        if (p <= 0) return null;
        const d = interpolate(p, [0, 1], [0.2, s.len]);
        const op = interpolate(p, [0, 0.2, 0.75, 1], [0, 0.9, 0.35, 0], {
          extrapolateRight: "clamp",
        });
        return (
          <mesh
            key={i}
            position={[Math.cos(s.a) * d, Math.sin(s.a) * d, 0]}
            rotation={[0, 0, s.a]}
          >
            <planeGeometry args={[s.s * 3.2, s.s]} />
            <meshBasicMaterial
              color="#eaf7ff"
              transparent
              opacity={op}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export const SHOCKWAVE_3D_FRAMES = 60;

export const ShockWave3D: React.FC<{ showAnchor?: boolean }> = ({
  showAnchor = false,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Le meme point que l'overlay SVG : le centre du device.
  const originPxX = POS_X + (DEVICE_W * SCALE) / 2;
  const originPxY = POS_Y + (DEVICE_H * SCALE) / 2;
  const { x, y } = screenToWorld(originPxX, originPxY, width, height);

  const progress = interpolate(frame, [0, SHOCKWAVE_3D_FRAMES - 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <ThreeCanvas
        width={width}
        height={height}
        orthographic={false}
        camera={{ fov: CAM_FOV, position: [0, 0, CAM_Z] }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1} />
        <IceRing progress={progress} x={x} y={y} delay={0} maxR={5.2} />
        <IceRing progress={progress} x={x} y={y} delay={0.16} maxR={3.9} />
        <IceRing progress={progress} x={x} y={y} delay={0.32} maxR={2.7} />
        <Shards progress={progress} x={x} y={y} />
      </ThreeCanvas>

      {/* Croix de controle : marque le centre du device en pixels ecran.
          Sert UNIQUEMENT a mesurer l'ancrage, jamais dans un livrable. */}
      {showAnchor && (
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <line
            x1={originPxX - 40}
            y1={originPxY}
            x2={originPxX + 40}
            y2={originPxY}
            stroke="#ff0066"
            strokeWidth={3}
          />
          <line
            x1={originPxX}
            y1={originPxY - 40}
            x2={originPxX}
            y2={originPxY + 40}
            stroke="#ff0066"
            strokeWidth={3}
          />
        </svg>
      )}
    </AbsoluteFill>
  );
};
