import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";

// ─── DURATION EXPORT (6 secondes a 30 fps) ───────────────────────────────────
export const SCENE2_3D_FRAMES = 180;

// ─── INNER 3D SCENE (s'execute dans le contexte React Three Fiber) ───────────
const GlobeScene: React.FC<{ frame: number; sphereScale: number }> = ({
  frame,
  sphereScale,
}) => {
  const rotationY = frame * 0.008;
  const tiltX = 0.3;

  return (
    <>
      {/* Lumiere ambiante douce — evite le noir total */}
      <ambientLight intensity={0.15} />

      {/* Lumiere principale bleue neon — haut droit avant */}
      <pointLight position={[5, 5, 5]} intensity={2} color="#3264FF" />

      {/* Rim light — bas gauche arriere */}
      <pointLight position={[-3, -2, -5]} intensity={1.5} color="#1a80FF" />

      {/* Sphere principale */}
      <mesh rotation={[tiltX, rotationY, 0]} scale={[sphereScale, sphereScale, sphereScale]}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshStandardMaterial
          color="#0a1628"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Sphere halo atmosphere — legerement plus grande, semi-transparente */}
      <mesh rotation={[tiltX, rotationY, 0]} scale={[sphereScale, sphereScale, sphereScale]}>
        <sphereGeometry args={[2.0, 32, 32]} />
        <meshBasicMaterial color="#1a3a80" transparent opacity={0.15} />
      </mesh>
    </>
  );
};

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export const Scene2ActTitleCard3D: React.FC<{ startFrame?: number }> = ({
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  // Scale spring: sphere entre avec un effet "pop" physique
  const sphereScale = spring({
    frame: localFrame,
    fps,
    config: { damping: 200, stiffness: 60 },
  });

  // Opacity de la scene entiere — fade-in rapide a l'entree
  const sceneOpacity = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Texte avant (L'HUMILIATION) — apparait apres que la sphere soit visible
  const textOpacity = interpolate(localFrame, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Texte avant translate vers le bas avec spring
  const textTranslateY = interpolate(
    spring({ frame: Math.max(0, localFrame - 55), fps, config: { damping: 200, stiffness: 80 } }),
    [0, 1],
    [20, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        overflow: "hidden",
        opacity: sceneOpacity,
      }}
    >
      {/* COUCHE 0 — Texte "ACTE I" en outline derriere la sphere */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: 180,
            fontFamily: "'Georgia', serif",
            fontWeight: 900,
            WebkitTextStroke: "1px rgba(255,255,255,0.12)",
            color: "transparent",
            userSelect: "none",
            letterSpacing: "0.05em",
            lineHeight: 1,
          }}
        >
          ACTE I
        </div>
      </div>

      {/* COUCHE 1 — Canvas Three.js avec la sphere 3D */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
        }}
      >
        <ThreeCanvas width={width} height={height}>
          <GlobeScene frame={localFrame} sphereScale={sphereScale} />
        </ThreeCanvas>
      </div>

      {/* COUCHE 2 — Texte "L'HUMILIATION" devant */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        {/* Spacer pour descendre le texte sous la sphere */}
        <div style={{ height: 280 }} />
        <div
          style={{
            fontSize: 26,
            fontFamily: "'Helvetica Neue', sans-serif",
            fontWeight: 300,
            letterSpacing: "0.35em",
            color: "#ffffff",
            textTransform: "uppercase",
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
          }}
        >
          L&apos;HUMILIATION
        </div>
      </div>
    </AbsoluteFill>
  );
};
