/**
 * ShillingCoin3D — composition autonome 3D
 *
 * Remplace le PNG 2D shilling-hero.png du Beat4Prix par un vrai modèle 3D.
 * Utilise @remotion/three (ThreeCanvas) — pas de Mapbox, pas de WebGL custom.
 * Toutes les animations calées sur useCurrentFrame().
 *
 * Animations :
 *   0–30f   : entrée spring (scale 0→1 depuis le bas)
 *   30–90f  : reveal orbital — la caméra tourne pour révéler la face
 *   90–end  : float + rotation lente + glow pulsant (identique Beat4Prix mais en 3D)
 */

import { ThreeCanvas } from "@remotion/three";
import React, { Suspense, useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useFrame } from "@react-three/fiber";

export const SHILLING_COIN_3D_FRAMES = 180; // 6s @ 30fps

// ---------------------------------------------------------------------------
// Couleurs — reprises de Beat4Prix
// ---------------------------------------------------------------------------
const GOLD   = "#C8A951";
const NAVY   = "#0d1b2a";

// ---------------------------------------------------------------------------
// Modèle 3D — chargé depuis le GLB TRELLIS
// ---------------------------------------------------------------------------
const ShillingModel: React.FC<{ frame: number; fps: number; totalFrames: number }> = ({
  frame, fps, totalFrames,
}) => {
  const [scene, setScene] = useState<THREE.Group | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const handle = (window as any).__shillingDelayHandle;
    const loader = new GLTFLoader();
    loader.load(
      staticFile("poc-mapbox-tests/models/shilling-coin.glb"),
      (gltf) => {
        setScene(gltf.scene.clone(true));
      },
      undefined,
      (err) => console.error("[ShillingCoin3D] GLB error:", err)
    );
  }, []);

  // Pendant le chargement, afficher le disque fallback
  if (!scene) {
    return (
      <mesh>
        <cylinderGeometry args={[1, 1, 0.12, 64]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.2} />
      </mesh>
    );
  }

  // Entrée spring
  const entryProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
    durationInFrames: 30,
  });
  const entryScale = interpolate(entryProgress, [0, 1], [0, 1]);
  const entryY     = interpolate(entryProgress, [0, 1], [-1.5, 0]);

  // Float vertical — sinusoïde lente (comme Beat4Prix)
  const floatY = Math.sin((frame / 110) * Math.PI * 2) * 0.12;

  // Phase 1 (0–90f) : reveal orbital — caméra tourne, pièce face fixe
  // Phase 2 (90–end) : rotation lente de la pièce sur Y
  const revealEnd = 90;
  const selfRotY = frame < revealEnd
    ? 0
    : interpolate(frame, [revealEnd, totalFrames], [0, Math.PI * 3], {
        extrapolateRight: "clamp",
      });

  // Légère inclinaison oscillante (axe X) pour voir le relief
  const tiltX = Math.sin(frame * 0.04) * 0.08;

  return (
    <group
      ref={groupRef}
      scale={[entryScale, entryScale, entryScale]}
      position={[0, entryY + floatY, 0]}
      rotation={[tiltX, selfRotY, 0]}
    >
      <primitive object={scene} />
    </group>
  );
};

// ---------------------------------------------------------------------------
// Éclairage — reproduire le glow doré de Beat4Prix + contraste 3D
// ---------------------------------------------------------------------------
const Lights: React.FC<{ frame: number }> = ({ frame }) => {
  // Glow pulsant — intensité qui oscille comme le coinGlowRadius du Beat4Prix
  const glowIntensity = interpolate(
    Math.sin(frame / 9),
    [-1, 1],
    [1.5, 3.5]
  );

  // Lumière principale qui tourne lentement autour de la pièce (orbit)
  const orbitAngle = (frame / 120) * Math.PI * 2;
  const lightX = Math.cos(orbitAngle) * 4;
  const lightZ = Math.sin(orbitAngle) * 4;

  return (
    <>
      {/* Ambiance chaude — couleur or */}
      <ambientLight color={0xfff4d0} intensity={0.8} />
      {/* Lumière principale dorée en orbite */}
      <pointLight
        position={[lightX, 2, lightZ]}
        color={0xf0c060}
        intensity={glowIntensity}
        distance={12}
      />
      {/* Fill lumière froide pour le contraste (côté opposé) */}
      <pointLight
        position={[-lightX * 0.5, -1, -lightZ * 0.5]}
        color={0x8090ff}
        intensity={0.4}
        distance={8}
      />
      {/* Lumière de rim — contour brillant sur la tranche */}
      <directionalLight
        position={[0, 3, -3]}
        color={0xffffff}
        intensity={1.2}
      />
    </>
  );
};

// ---------------------------------------------------------------------------
// Caméra orbitale — reveal dans la phase 0–90f
// @react-three/fiber : useFrame pour animer la caméra dans la scène R3F
// ---------------------------------------------------------------------------
const CameraRig: React.FC<{ frame: number }> = ({ frame }) => {
  const revealEnd = 90;

  // Phase reveal : caméra part de derrière (PI) et arrive de face (0)
  const cameraAngle = frame < revealEnd
    ? interpolate(frame, [0, revealEnd], [Math.PI * 0.6, 0], {
        extrapolateRight: "clamp",
      })
    : 0;

  const camX = Math.sin(cameraAngle) * 4;
  const camZ = Math.cos(cameraAngle) * 4;
  const camY = 1.2;

  useFrame(({ camera }) => {
    camera.position.set(camX, camY, camZ);
    camera.lookAt(0, 0, 0);
  });

  return null;
};

// ---------------------------------------------------------------------------
// Fallback pendant le chargement du GLB
// ---------------------------------------------------------------------------
const CoinFallback: React.FC = () => (
  // Disque doré simple en attendant le GLB
  <mesh rotation={[0, 0, 0]}>
    <cylinderGeometry args={[1, 1, 0.12, 64]} />
    <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.2} />
  </mesh>
);

// ---------------------------------------------------------------------------
// Overlay glow + ping ring — reproduit fidèlement Beat4Prix
// ---------------------------------------------------------------------------
const GlowOverlay: React.FC<{ frame: number; width: number; height: number }> = ({
  frame, width, height,
}) => {
  const glowRadius = interpolate(Math.sin(frame / 9), [-1, 1], [60, 160]);
  const pingCycle   = frame % 50;
  const pingScale   = interpolate(pingCycle, [0, 49], [0.9, 2.4]);
  const pingOpacity = interpolate(pingCycle, [0, 20, 49], [0.5, 0.25, 0]);
  const fadeIn      = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const cx = width / 2;
  const cy = height / 2;
  const r  = 190;

  return (
    <svg
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      width={width}
      height={height}
    >
      {/* Glow doré derrière la pièce */}
      <defs>
        <radialGradient id="coin-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={GOLD} stopOpacity={0.5} />
          <stop offset="60%"  stopColor={GOLD} stopOpacity={0.15} />
          <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse
        cx={cx} cy={cy}
        rx={glowRadius} ry={glowRadius}
        fill="url(#coin-glow)"
        opacity={fadeIn}
      />
      {/* Ping ring */}
      <circle
        cx={cx} cy={cy}
        r={r * pingScale}
        fill="none"
        stroke={GOLD}
        strokeWidth={1.5}
        opacity={pingOpacity * fadeIn}
      />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Composition principale
// ---------------------------------------------------------------------------
export const ShillingCoin3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  const entryOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: NAVY }}>

      {/* Fond subtil — gradient radial comme Beat4Prix */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 50% 50%, #1a2a3a 0%, ${NAVY} 70%)`,
      }} />

      {/* Glow + ping ring (SVG overlay derrière le canvas 3D) */}
      <GlowOverlay frame={frame} width={width} height={height} />

      {/* Canvas Three.js — le cœur */}
      <div style={{ position: "absolute", inset: 0, opacity: entryOpacity }}>
        <ThreeCanvas
          width={width}
          height={height}
          style={{ background: "transparent" }}
        >
          {/* Caméra orbitale reveal */}
          <CameraRig frame={frame} />

          {/* Lumières */}
          <Lights frame={frame} />

          {/* Modèle 3D — fallback disque intégré pendant chargement */}
          <ShillingModel frame={frame} fps={fps} totalFrames={durationInFrames} />
        </ThreeCanvas>
      </div>

      {/* Label SHILLING — repris de Beat4Prix */}
      <div style={{
        position: "absolute",
        bottom: 80,
        left: 0, right: 0,
        textAlign: "center",
        opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <div style={{
          fontFamily: "Impact, Arial Black, sans-serif",
          fontSize: 28,
          letterSpacing: 8,
          color: GOLD,
          textTransform: "uppercase",
        }}>
          SHILLING KENYAN
        </div>
        <div style={{
          fontFamily: "Georgia, serif",
          fontSize: 14,
          letterSpacing: 3,
          color: "rgba(200,169,81,0.6)",
          marginTop: 8,
        }}>
          M-PESA · SAFARICOM
        </div>
      </div>

      {/* Debug frame */}
      <div style={{
        position: "absolute", bottom: 16, left: 16,
        background: "rgba(0,0,0,0.5)", color: "#fff",
        fontFamily: "monospace", fontSize: 11, padding: "3px 8px", borderRadius: 3,
      }}>
        {frame < 30   ? "Entrée spring" :
         frame < 90   ? "Reveal orbital" :
                        "Float + rotation"}
        {" "}| f{frame}
      </div>
    </AbsoluteFill>
  );
};
