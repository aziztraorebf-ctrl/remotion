/**
 * PROTO JOURNAL VRAIE 3D (@remotion/three) — derisquage demande par Aziz.
 * But : prouver qu'on peut faire de la VRAIE 3D volumetrique (profondeur, relief, camera
 * orbitale, depth of field) la ou le faux-3D CSS ne suffit pas. RENDU LUMINEUX (papier clair),
 * PAS de fond sombre (exigence Aziz).
 *
 * Mecanique : une "page de journal" = plan 3D texture clair, des ENCARTS en relief (boites
 * extrudees posees sur la page avec epaisseur+ombre), camera qui ORBITE en continu et se
 * rapproche d'un encart a l'autre. Lumiere directionnelle douce + ambient clair.
 *
 * Chaine headless eprouvee dans le repo (cf Country3DRise.tsx) : ThreeCanvas + render --gl=angle.
 */
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";

const W = 1920;
const H = 1080;

// ─── Texture papier procedurale (canvas) — claire, pas d'asset externe ─────────
function makePaperTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#ece7da"; // papier creme clair
  ctx.fillRect(0, 0, 1024, 1024);
  // grain leger
  for (let i = 0; i < 9000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const v = 200 + Math.random() * 40;
    ctx.fillStyle = `rgba(${v},${v - 8},${v - 22},0.04)`;
    ctx.fillRect(x, y, 2, 2);
  }
  // quelques "colonnes de texte" simulees (lignes grises) pour lire "journal"
  ctx.fillStyle = "rgba(40,40,46,0.55)";
  for (let col = 0; col < 3; col++) {
    const cx = 90 + col * 320;
    for (let line = 0; line < 26; line++) {
      const ly = 240 + line * 26;
      const lw = 220 - (line % 4) * 18;
      ctx.fillRect(cx, ly, lw, 6);
    }
  }
  // gros titre simule
  ctx.fillStyle = "#16161a";
  ctx.fillRect(80, 150, 760, 40);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  return tex;
}

// ─── Texture d'un encart "illustration" (degrade clair, pour voir le relief) ───
function makeInsetTexture(hue: number): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 320;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 512, 320);
  g.addColorStop(0, `hsl(${hue},45%,72%)`);
  g.addColorStop(1, `hsl(${hue + 20},55%,52%)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 320);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "bold 26px Georgia";
  ctx.fillText("ILLUSTRATION", 150, 170);
  return new THREE.CanvasTexture(c);
}

const Scene: React.FC<{ frame: number; durationInFrames: number }> = ({ frame, durationInFrames }) => {
  const paper = useMemo(() => makePaperTexture(), []);
  const inset1 = useMemo(() => makeInsetTexture(40), []); // dore
  const inset2 = useMemo(() => makeInsetTexture(210), []); // bleu

  // camera orbitale continue : balaye et se rapproche d'un encart a l'autre
  const t = frame / durationInFrames;
  const angle = interpolate(t, [0, 1], [-0.5, 0.5]); // yaw orbital
  const camX = Math.sin(angle) * 3.2;
  const camZ = Math.cos(angle) * 3.2 + 1.5;
  const camY = interpolate(t, [0, 0.5, 1], [2.6, 2.0, 2.6]); // survol haut->bas->haut
  const lookX = interpolate(t, [0, 1], [-1.4, 1.4]); // regarde de gauche a droite

  return (
    <>
      {/* lumiere CLAIRE : ambient fort + directionnelle douce */}
      <ambientLight intensity={1.15} />
      <directionalLight position={[3, 6, 4]} intensity={1.1} color={"#fff6e6"} />
      <directionalLight position={[-4, 3, 2]} intensity={0.4} color={"#dfe8ff"} />

      {/* camera */}
      <PerspectiveRig camX={camX} camY={camY} camZ={camZ} lookX={lookX} />

      {/* la PAGE : plan clair texture, posee a plat (rotation -90 sur X) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[6, 8]} />
        <meshStandardMaterial map={paper} roughness={0.95} />
      </mesh>

      {/* ENCART 1 en relief (boite extrudee posee sur la page, gauche) */}
      <mesh position={[-1.3, 0.06, -1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[2.0, 1.25, 0.12]} />
        <meshStandardMaterial map={inset1} roughness={0.6} />
      </mesh>
      {/* ENCART 2 en relief (droite, plus loin) */}
      <mesh position={[1.4, 0.06, 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[2.0, 1.25, 0.12]} />
        <meshStandardMaterial map={inset2} roughness={0.6} />
      </mesh>
    </>
  );
};

// petit composant pour piloter la camera (useThree via primitive)
const PerspectiveRig: React.FC<{ camX: number; camY: number; camZ: number; lookX: number }> = ({ camX, camY, camZ, lookX }) => {
  return (
    <ThreeCamera camX={camX} camY={camY} camZ={camZ} lookX={lookX} />
  );
};

// camera imperative
import { useThree } from "@react-three/fiber";
const ThreeCamera: React.FC<{ camX: number; camY: number; camZ: number; lookX: number }> = ({ camX, camY, camZ, lookX }) => {
  const { camera } = useThree();
  camera.position.set(camX, camY, camZ);
  camera.lookAt(lookX, 0, 0);
  camera.updateProjectionMatrix();
  return null;
};

export const ProtoEffect_Newspaper3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#d9d3c4" }}>
      <ThreeCanvas width={W} height={H} camera={{ fov: 45, position: [0, 2.4, 4.5] }} style={{ backgroundColor: "#d9d3c4" }}>
        <Scene frame={frame} durationInFrames={durationInFrames} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
