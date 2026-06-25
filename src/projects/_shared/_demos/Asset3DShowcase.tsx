/**
 * Asset3DShowcase — DEMO (2026-06-17) : valider la qualite REELLE des assets 3D generes par
 * le pipeline Gemini-image → fal.ai Trellis → .glb. Charge token.glb + barrel.glb et les fait
 * tourner sous une lumiere gold, sur fond navy. But : Aziz juge le volume/topologie/texture.
 *
 * Chargement GLB via GLTFLoader + delayRender (pattern fiable headless, PAS useGLTF/Suspense
 * qui peut bloquer en render). Render via scripts/render-mapbox.sh (--gl=angle).
 */

import React, { useEffect, useRef, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

const GOLD = "#c8a951";
const NAVY_DEEP = "#0d1424";

function useGlb(file: string): THREE.Group | null {
  const [obj, setObj] = useState<THREE.Group | null>(null);
  const [handle] = useState(() => delayRender(`glb ${file}`));
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      staticFile(file),
      (gltf) => {
        // normaliser : centrer + scale a une taille comparable
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);
        gltf.scene.position.sub(center);
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const s = 2.6 / maxDim;
        gltf.scene.scale.setScalar(s);
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

const SpinningModel: React.FC<{ group: THREE.Group; x: number; frame: number }> = ({ group, x, frame }) => {
  const ref = useRef<THREE.Group>(null);
  const rotY = interpolate(frame, [0, 120], [0, Math.PI * 2]);
  return (
    <group ref={ref} position={[x, 0, 0]} rotation={[0.1, rotY, 0]}>
      <primitive object={group} />
    </group>
  );
};

const Scene: React.FC<{ token: THREE.Group | null; barrel: THREE.Group | null; frame: number }> = ({
  token,
  barrel,
  frame,
}) => (
  <>
    <perspectiveCamera position={[0, 0.5, 7]} fov={45} />
    <ambientLight intensity={0.6} color={"#6678a0"} />
    <directionalLight position={[5, 6, 5]} intensity={1.5} color={GOLD} />
    <directionalLight position={[-5, 2, 4]} intensity={0.7} color={"#8fb6e0"} />
    {token ? <SpinningModel group={token} x={-1.9} frame={frame} /> : null}
    {barrel ? <SpinningModel group={barrel} x={1.9} frame={frame} /> : null}
  </>
);

export const Asset3DShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const token = useGlb("_shared/assets-3d/token.glb");
  const barrel = useGlb("_shared/assets-3d/barrel.glb");

  return (
    <AbsoluteFill style={{ background: NAVY_DEEP }}>
      <ThreeCanvas width={width} height={height} gl={{ antialias: true }}>
        <Scene token={token} barrel={barrel} frame={frame} />
      </ThreeCanvas>
      <div
        style={{
          position: "absolute",
          bottom: height * 0.08,
          left: 0,
          right: 0,
          textAlign: "center",
          color: GOLD,
          fontFamily: "'Bebas Neue', 'Impact', sans-serif",
          fontSize: 34,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        Gemini → fal.ai Trellis → Remotion 3D
      </div>
    </AbsoluteFill>
  );
};

export default Asset3DShowcase;
