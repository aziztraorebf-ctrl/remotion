/**
 * FlatDeviceMotion — le traitement APLATI mis en MOUVEMENT.
 *
 * Le banc fixe (SvgVs3dBench) a montre qu'un materiau mat s'accorde au fond
 * dessine la ou le metallique detonne. Mais un materiau tient en pose fixe et
 * peut s'effondrer des que l'objet tourne : sans speculaire, les faces risquent
 * de devenir indistinctes et le volume de disparaitre. C'est CE risque que ce
 * plan teste, et c'est la seule facon de trancher.
 *
 * 3 gestes en 9 s, ceux qu'un SVG plat ne peut PAS faire :
 *   1. le capot s'ouvre        (lidAngle : 0.10 -> 1.80)
 *   2. l'objet pivote          (rotationY : -0.55 -> +0.55)
 *   3. la camera se rapproche  (camZ : 10.2 -> 7.4)
 *
 * Si le volume reste lisible tout du long, l'aplati est valide et on garde la
 * 3D — donc tous ces gestes — avec la coherence du registre dessine.
 */

import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import { LaptopModel } from "./LaptopModel";
import { PhoneModel } from "./PhoneModel";
import { GridBackdrop, GRID_TEAL, GRID_SLATE } from "./GridBackdrop";

const PLATE_DESKTOP = "_client-sim/noteshield/live/dashboard-full.png";
const PLATE_MOBILE = "_client-sim/noteshield/live-mobile/dashboard-mobile.png";

const useTex = (src: string, texAspect: number, screenAspect: number) => {
  const [handle] = useState(() => delayRender(`plate ${src}`));
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useLayoutEffect(() => {
    new THREE.TextureLoader().load(
      staticFile(src),
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        if (texAspect > screenAspect) {
          const r = screenAspect / texAspect;
          t.repeat.set(r, 1);
          t.offset.set((1 - r) / 2, 0);
        } else {
          const r = texAspect / screenAspect;
          t.repeat.set(1, r);
          t.offset.set(0, (1 - r) / 2);
        }
        setTex(t);
        continueRender(handle);
      },
      undefined,
      () => continueRender(handle)
    );
  }, [src, texAspect, screenAspect, handle]);
  return tex;
};

/**
 * Materiau APLATI. On ne remplace pas les materiaux (ce serait perdre la
 * distinction chassis/touches/trackpad que Fable a codee) : on annule seulement
 * ce qui fait "photo" — metalness, reflets d'environnement — et on garde une
 * roughness haute. La geometrie et la hierarchie des tons restent intactes.
 *
 * ⛔ L'ecran est EXCLU du traitement : il porte l'UI et doit rester emissif.
 *    Repere par la presence d'une `map` sur son materiau.
 */
const Flatten: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<THREE.Group>(null);
  useLayoutEffect(() => {
    ref.current?.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      mats.forEach((raw) => {
        const mat = raw as THREE.MeshStandardMaterial;
        if (!mat || !("metalness" in mat)) return;
        if ((mat as THREE.Material & { map?: unknown }).map) return; // ecran
        mat.metalness = 0;
        mat.roughness = 1;
        mat.envMapIntensity = 0;
        mat.flatShading = false;
        mat.needsUpdate = true;
      });
    });
  });
  return <group ref={ref}>{children}</group>;
};

/**
 * Eclairage du registre dessine : l'ambiante domine largement, une seule
 * directionnelle douce donne la direction. Pas de speculaire dur — c'est ce qui
 * "photographierait" l'objet au milieu d'un dessin.
 */
const FlatLights: React.FC = () => (
  <>
    <ambientLight color="#ffffff" intensity={2.5} />
    <directionalLight position={[3.2, 6.5, 2.5]} color="#ffffff" intensity={1.2} />
    <directionalLight position={[-4.5, 1.5, 3]} color="#dfe9f2" intensity={0.55} />
    {/* Tres leger contre-jour : sans lui le dos devient plat au demi-tour. */}
    <directionalLight position={[0, 2, -5]} color="#ffffff" intensity={0.7} />
  </>
);

export const FlatLaptopMotion: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const tex = useTex(PLATE_DESKTOP, 3840 / 2160, 2.88 / 1.8);

  /** Un seul interpolate par canal — pas de segments, donc pas d'arret. */
  const p = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.35, 0, 0.2, 1),
  });

  const lid = interpolate(p, [0.02, 0.42], [0.1, 1.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.2, 1),
  });

  return (
    <AbsoluteFill>
      <GridBackdrop palette={GRID_TEAL} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 40, position: [0, 0.2, interpolate(p, [0, 1], [10.2, 7.4])] }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <FlatLights />
        <Flatten>
          <LaptopModel
            rotationY={interpolate(p, [0, 1], [-0.55, 0.55])}
            scale={1.0}
            lidAngle={lid}
            screen={tex ? <meshBasicMaterial map={tex} toneMapped={false} /> : undefined}
          />
        </Flatten>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

/** Meme test sur le telephone : un tour complet, le cas le plus dur. */
export const FlatPhoneMotion: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const tex = useTex(PLATE_MOBILE, 1170 / 2532, 1.39 / 3.012);
  const p = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <GridBackdrop palette={GRID_SLATE} cell={72} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 40, position: [0, 0, 5.6] }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <FlatLights />
        <Flatten>
          <PhoneModel
            rotationY={p * Math.PI * 2}
            scale={1.0}
            screen={tex ? <meshBasicMaterial map={tex} toneMapped={false} /> : undefined}
          />
        </Flatten>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
