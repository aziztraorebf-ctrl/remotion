/**
 * KineticSlam3D — DEMO (2026-06-17) : ce que @remotion/three (VRAIE 3D, jamais utilise dans
 * le projet) apporte qu'aucun effet 2D ne peut donner : PROFONDEUR reelle, parallaxe, lumiere
 * directionnelle, mouvement de camera dans l'espace.
 *
 * Scene : 3 dalles editoriales navy/gold flottant dans l'espace 3D (la grande = le chiffre choc),
 * une grille de sol en perspective (salle de controle), lumiere gold rasante. La camera fait un
 * leger orbital + dolly pilote par useCurrentFrame (frame-driven, headless-safe, comme Mapbox).
 *
 * But : montrer a Aziz le REGISTRE 3D sur sa matiere (hook chiffre choc), pas une 3D gratuite.
 * Le chiffre reste lisible en overlay 2D net PAR-DESSUS la scene 3D (best of both).
 *
 * Pas de dependance police externe (Text3D exige un typeface JSON absent) : geometrie pure.
 * Render standard Remotion (pas besoin de Mapbox ici). WebGL via --gl=angle.
 */

import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";

const GOLD = "#c8a951";
const IVORY = "#f2ebd9";
const NAVY = "#16213a";
const NAVY_DEEP = "#0d1424";

interface SlabProps {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  rotY: number;
}
const Slab: React.FC<SlabProps> = ({ position, size, color, rotY }) => (
  <mesh position={position} rotation={[0, rotY, 0]} castShadow receiveShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} metalness={0.35} roughness={0.45} />
  </mesh>
);

const Scene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Slam d'entree : les dalles arrivent en profondeur (z) avec rebond spring
  const slam = spring({ frame: frame - 4, fps, config: { damping: 12, stiffness: 180, mass: 0.9 } });
  const zIn = interpolate(slam, [0, 1], [-8, 0]);

  // Camera : leger orbital + dolly avant pilote par la frame (frame-driven)
  const camX = Math.sin(interpolate(frame, [0, 120], [0, Math.PI * 0.5])) * 2.4;
  const camZ = interpolate(frame, [0, 120], [9, 6.2]);
  const camY = 1.6;

  return (
    <>
      <perspectiveCamera position={[camX, camY, camZ]} fov={42} />
      {/* lumieres : ambiante froide + spot gold rasant = relief premium */}
      <ambientLight intensity={0.35} color={"#4a5a7a"} />
      <directionalLight position={[5, 8, 6]} intensity={1.3} color={GOLD} castShadow />
      <directionalLight position={[-6, 3, 2]} intensity={0.5} color={"#6fa8dc"} />

      {/* Sol en perspective (grille salle de controle) */}
      <mesh position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color={NAVY_DEEP} metalness={0.2} roughness={0.9} />
      </mesh>

      {/* Dalle principale (= le chiffre choc), grande, au centre, profondeur */}
      <group position={[0, 0.4, zIn]}>
        <Slab position={[0, 0, 0]} size={[5.4, 3, 0.5]} color={NAVY} rotY={-0.12} />
        {/* lisere gold en relief sur le bord */}
        <Slab position={[0, -1.65, 0.05]} size={[5.4, 0.18, 0.55]} color={GOLD} rotY={-0.12} />
      </group>

      {/* 2 dalles satellites en arriere-plan (parallaxe) */}
      <Slab position={[-4.2, 1.8, zIn - 2]} size={[1.8, 1.1, 0.3]} color={"#1f2d4a"} rotY={0.3} />
      <Slab position={[4.0, -0.6, zIn - 1.4]} size={[2.1, 1.3, 0.3]} color={"#1f2d4a"} rotY={-0.28} />
    </>
  );
};

export interface KineticSlam3DProps {
  bigText?: string;
  subText?: string;
}

export const KineticSlam3D: React.FC<KineticSlam3DProps> = ({
  bigText = "70%",
  subText = "DU PHOSPHATE MONDIAL",
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const isVertical = height > width;

  // Le chiffre choc reste en overlay 2D net, pose apres le slam des dalles
  const txtSpring = spring({ frame: frame - 10, fps, config: { damping: 13, stiffness: 200 } });
  const txtScale = interpolate(txtSpring, [0, 1], [0.4, 1]);
  const txtOpacity = interpolate(frame, [8, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subOpacity = interpolate(frame, [40, 54], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const globalOpacity = interpolate(frame, [110, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const bigFontSize = isVertical ? width * 0.26 : height * 0.34;

  return (
    <AbsoluteFill style={{ background: NAVY_DEEP, opacity: globalOpacity }}>
      <ThreeCanvas width={width} height={height} shadows gl={{ antialias: true }}>
        <Scene frame={frame} fps={fps} />
      </ThreeCanvas>

      {/* Chiffre choc 2D net par-dessus la scene 3D */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
        <div
          style={{
            transform: `scale(${txtScale})`,
            opacity: txtOpacity,
            color: IVORY,
            fontFamily: "'Bebas Neue', 'Impact', sans-serif",
            fontWeight: 900,
            fontSize: bigFontSize,
            lineHeight: 1,
            textShadow: `0 0 40px ${GOLD}, 0 8px 30px rgba(0,0,0,0.7)`,
          }}
        >
          {bigText}
        </div>
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          bottom: isVertical ? height * 0.16 : height * 0.12,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: subOpacity,
        }}
      >
        <span
          style={{
            color: GOLD,
            fontSize: isVertical ? 46 : 40,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontFamily: "'Bebas Neue', 'Impact', sans-serif",
            textShadow: "0 4px 24px rgba(0,0,0,0.8)",
          }}
        >
          {subText}
        </span>
      </div>
    </AbsoluteFill>
  );
};

export default KineticSlam3D;
