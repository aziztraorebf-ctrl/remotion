/**
 * LidOpenBench — LE test qui tranche : le capot qui s'ouvre, en SVG vs en 3D.
 *
 * CONTEXTE. J'avais affirme a Aziz qu'un SVG ne pouvait pas ouvrir son capot.
 * C'etait FAUX, et il m'a repris : un SVG s'anime tres bien tant que le point de
 * vue ne change pas. Verification faite sur le fichier de Fable — il respecte le
 * contrat "pret a animer" de la doctrine : 21 groupes nommes, dont `lid`, `hinge`
 * et `base` separes. Le capot est donc animable.
 *
 * CE QUI RESTE VRAIMENT IMPOSSIBLE EN SVG : la rotation dans l'ESPACE (tour a
 * 360 deg, revelation d'une autre face) — un SVG est un dessin d'un seul point de
 * vue, les faces cachees n'existent pas. La vraie ligne de partage n'est donc pas
 * "animable ou pas" mais "le point de vue change-t-il ?".
 *
 * ⛔ L'AXE NE SE DEVINE PAS. Mesure dans le fichier : le groupe `hinge` occupe
 * x 580->1332, y 760->760. L'axe de rotation est donc la ligne y=760, centre en
 * x=956. Un axe recalcule au juge s'est deja revele faux de 29 px sur ce projet
 * (4 essais perdus) — d'ou la mesure.
 */

import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import { LaptopModel } from "./LaptopModel";
import { GridBackdrop, GRID_TEAL } from "./GridBackdrop";

const PLATE_DESKTOP = "_client-sim/noteshield/live/dashboard-full.png";
const SVG_MOCKUP = "_client-sim/noteshield/laptop-mockup.svg";

/** Mesures relevees DANS le fichier SVG (viewBox 1920x1080). */
const SVG_VB = { w: 1920, h: 1080 };
const SVG_SCREEN = { x: 515, y: 140, w: 940, h: 588 };
const HINGE = { x: 956, y: 760 };
/** Largeur reelle du laptop dessine dans le viewBox (mesuree, pas devinee). */
const SVG_LAPTOP_W = 1380;

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

/** Materiau aplati — le traitement retenu au banc precedent. */
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
        if ((mat as THREE.Material & { map?: unknown }).map) return;
        mat.metalness = 0;
        mat.roughness = 1;
        mat.envMapIntensity = 0;
        mat.needsUpdate = true;
      });
    });
  });
  return <group ref={ref}>{children}</group>;
};

const FlatLights: React.FC = () => (
  <>
    <ambientLight color="#ffffff" intensity={2.5} />
    <directionalLight position={[3.2, 6.5, 2.5]} color="#ffffff" intensity={1.2} />
    <directionalLight position={[-4.5, 1.5, 3]} color="#dfe9f2" intensity={0.55} />
  </>
);

/**
 * SVG dont le CAPOT S'OUVRE. Le fichier etant un asset externe, on ne peut pas
 * animer son groupe `lid` de l'exterieur — on superpose donc deux copies du meme
 * SVG, l'une masquee au-dessus de la charniere (la base), l'autre masquee
 * en-dessous (le capot), et on fait tourner la seconde autour de l'axe mesure.
 *
 * ⚠️ LIMITE INTRINSEQUE DU 2D, et c'est le vrai enseignement du test : quand le
 * capot se rabat, un vrai capot REVELE sa face arriere et son epaisseur. Ici il
 * n'y a rien a reveler — le dessin s'ecrase, il ne se retourne pas. On corrige
 * partiellement en ecrasant la hauteur (scaleY) plutot qu'en tournant a plat,
 * ce qui imite la perspective sans jamais montrer le dos.
 */
const SvgLaptopOpening: React.FC<{ open: number; width: number }> = ({
  open,
  width,
}) => {
  const scale = width / SVG_LAPTOP_W;
  const w = SVG_VB.w * scale;
  const h = SVG_VB.h * scale;
  const hx = HINGE.x * scale;
  const hy = HINGE.y * scale;

  /** open=0 : capot rabattu (ecrase sur la base). open=1 : ouvert. */
  const squash = interpolate(open, [0, 1], [0.06, 1]);
  const tilt = interpolate(open, [0, 1], [-4, 0]);

  return (
    <div style={{ position: "relative", width: w, height: h }}>
      {/* BASE — le SVG entier, masque au-dessus de la charniere. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(${hy}px 0 0 0)`,
        }}
      >
        <Img src={staticFile(SVG_MOCKUP)} style={{ width: w, height: h }} />
      </div>

      {/* CAPOT — le meme SVG, masque sous la charniere, pivotant sur l'axe. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(0 0 ${h - hy}px 0)`,
          transformOrigin: `${hx}px ${hy}px`,
          transform: `scaleY(${squash}) rotate(${tilt}deg)`,
        }}
      >
        <Img src={staticFile(SVG_MOCKUP)} style={{ width: w, height: h }} />
        {/* L'UI suit le capot : elle est dans le meme groupe transforme. */}
        <div
          style={{
            position: "absolute",
            left: SVG_SCREEN.x * scale,
            top: SVG_SCREEN.y * scale,
            width: SVG_SCREEN.w * scale,
            height: SVG_SCREEN.h * scale,
            overflow: "hidden",
            opacity: interpolate(open, [0.45, 0.85], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <Img
            src={staticFile(PLATE_DESKTOP)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
};

export const LidOpenBench: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const tex = useTex(PLATE_DESKTOP, 3840 / 2160, 2.88 / 1.8);
  const cellW = width / 2;

  /**
   * ⛔ MEME TAILLE DES DEUX COTES, calculee et non dosee.
   * SVG : cellW * 0.78 = 749 px. 3D : le modele fait 3.2 unites de large ;
   * a fov 40 sur 1080 px de haut, 749 px demandent
   * z = (3.2 * 1080) / (2 * tan(20 deg) * 749) = 6.34.
   * Comparer deux objets de tailles differentes ne prouve rien.
   */
  /** Le MEME geste pour les deux : ferme -> ouvert, meme courbe, meme timing. */
  const open = interpolate(frame, [12, durationInFrames - 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.2, 1),
  });

  const svgW = cellW * 0.78;

  return (
    <AbsoluteFill>
      <GridBackdrop palette={GRID_TEAL} />
      <div style={{ display: "flex", width, height }}>
        {/* GAUCHE — SVG dessine */}
        <div style={{ position: "relative", width: cellW, height }}>
          <AbsoluteFill
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <SvgLaptopOpening open={open} width={svgW} />
          </AbsoluteFill>
          <div
            style={{
              position: "absolute",
              bottom: 26,
              width: "100%",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 28,
              color: "#7fa8b8",
              letterSpacing: "0.2em",
            }}
          >
            A
          </div>
        </div>

        {/* DROITE — 3D aplati, meme geste par le parametre lidAngle */}
        <div style={{ position: "relative", width: cellW, height }}>
          <ThreeCanvas
            width={Math.round(cellW)}
            height={height}
            camera={{ fov: 40, position: [0, 0.1, 6.34] }}
            style={{ background: "transparent" }}
            gl={{ alpha: true, antialias: true }}
          >
            <FlatLights />
            <Flatten>
              <LaptopModel
                rotationY={0}
                scale={1.0}
                lidAngle={interpolate(open, [0, 1], [0.06, 1.8])}
                screen={
                  tex ? <meshBasicMaterial map={tex} toneMapped={false} /> : undefined
                }
              />
            </Flatten>
          </ThreeCanvas>
          <div
            style={{
              position: "absolute",
              bottom: 26,
              width: "100%",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 28,
              color: "#7fa8b8",
              letterSpacing: "0.2em",
            }}
          >
            B
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
