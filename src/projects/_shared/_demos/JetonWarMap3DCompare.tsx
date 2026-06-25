/**
 * JetonWarMap3DCompare — DEMO (2026-06-17) : comparatif jetons War-Map style K&G.
 * Pour chaque contenu (VISAGE de chef / SYMBOLE de faction), on montre cote a cote :
 *   - PLAT   : l'image Gemini directe (= ce que K&G fait, jeton 2D illustre)
 *   - 3D     : le .glb genere par fal.ai Trellis, tournant sous lumiere LUMINEUSE
 * But : Aziz juge si le 3D apporte sur un visage (organique → risque deformation)
 * vs sur un symbole (geometrique → reussit), face au plat actuel.
 *
 * Eclairage VOLONTAIREMENT lumineux (lecon : mes demos 3D precedentes trop sombres).
 * Fond parchemin War-Map. Render via scripts/render-mapbox.sh (--gl=angle).
 */

import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

const PARCH = "#E8DCBE";
const PARCH_DEEP = "#D6C49A";
const INK = "#3E2A18";

function useGlb(file: string): THREE.Group | null {
  const [obj, setObj] = useState<THREE.Group | null>(null);
  const [handle] = useState(() => delayRender(`glb ${file}`));
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      staticFile(file),
      (gltf) => {
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);
        gltf.scene.position.sub(center);
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        gltf.scene.scale.setScalar(3.0 / maxDim);
        setObj(gltf.scene);
        continueRender(handle);
      },
      undefined,
      () => continueRender(handle)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);
  return obj;
}

const SpinModel: React.FC<{ group: THREE.Group; frame: number }> = ({ group, frame }) => {
  // oscillation douce gauche-droite (PAS tour complet : un jeton se presente, ne tournoie pas)
  const rotY = Math.sin(interpolate(frame, [0, 120], [0, Math.PI * 2])) * 0.6;
  return (
    <group rotation={[0.05, rotY, 0]}>
      <primitive object={group} />
    </group>
  );
};

const ThreeTile: React.FC<{ group: THREE.Group | null; frame: number; width: number; height: number }> = ({
  group,
  frame,
  width,
  height,
}) => (
  <ThreeCanvas width={width} height={height} gl={{ antialias: true }}>
    <perspectiveCamera position={[0, 0, 6]} fov={45} />
    {/* ECLAIRAGE LUMINEUX (lecon retenue) */}
    <ambientLight intensity={1.1} color={"#fff6e0"} />
    <directionalLight position={[3, 4, 6]} intensity={1.4} color={"#ffffff"} />
    <directionalLight position={[-4, 2, 4]} intensity={0.9} color={"#ffe8c0"} />
    <directionalLight position={[0, -3, 4]} intensity={0.4} color={"#d0e0ff"} />
    {group ? <SpinModel group={group} frame={frame} /> : null}
  </ThreeCanvas>
);

const Label: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      textAlign: "center",
      color: INK,
      fontFamily: "'Bebas Neue', 'Impact', sans-serif",
      fontSize: 30,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      marginTop: 8,
    }}
  >
    {text}
  </div>
);

export const JetonWarMap3DCompare: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const visage = useGlb("_shared/assets-3d/jeton-visage.glb");
  const symbole = useGlb("_shared/assets-3d/jeton-symbole.glb");

  const cellW = Math.floor(width / 2);
  const tileH = Math.floor(height * 0.32);

  const cell = (title: string, plat: string, group: THREE.Group | null) => (
    <div style={{ width: cellW, padding: 20, boxSizing: "border-box" }}>
      <div style={{ color: INK, fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, textAlign: "center", letterSpacing: "0.1em" }}>
        {title}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: tileH, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Img src={staticFile(plat)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
          </div>
          <Label text="PLAT (Gemini)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ height: tileH }}>
            <ThreeTile group={group} frame={frame} width={cellW / 2 - 18} height={tileH} />
          </div>
          <Label text="3D (fal.ai)" />
        </div>
      </div>
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 40%, ${PARCH} 0%, ${PARCH_DEEP} 100%)`,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ color: INK, fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, letterSpacing: "0.12em", marginBottom: 10 }}>
        JETONS WAR-MAP — PLAT vs 3D
      </div>
      <div style={{ display: "flex", width }}>
        {cell("VISAGE DE CHEF", "_shared/assets-3d/sources/jeton-visage.png", visage)}
        {cell("SYMBOLE FACTION", "_shared/assets-3d/sources/jeton-symbole.png", symbole)}
      </div>
    </AbsoluteFill>
  );
};

export default JetonWarMap3DCompare;
