/**
 * SvgVs3dBench — LE test qu'Aziz a demande : un mockup s'integre-t-il mieux dans
 * une scene SVG dessinee, et lequel — le SVG de Fable ou notre 3D ?
 *
 * Trois traitements du MEME plan, MEME fond, MEME UI a l'ecran :
 *   A. SVG de Fable        — mockup dessine (public/_client-sim/noteshield/laptop-mockup.svg)
 *   B. 3D materiau ACTUEL  — metalness 0.8, cherche le photorealisme
 *   C. 3D materiau APLATI  — mat, sans reflet d'environnement, pour "rejoindre" le dessin
 *
 * L'HYPOTHESE A TESTER : un 3D photorealiste DETONNE sur un fond dessine, alors
 * qu'un 3D aplati s'y fond. Si C gagne, on garde nos modeles 3D (donc rotation,
 * ouverture de capot, camera libre) tout en ayant la coherence du dessin.
 * Si A gagne, le SVG suffit et la 3D n'apporte rien ici.
 *
 * ⛔ Protocole : les trois cellules partagent camera, echelle et eclairage. Le
 * nom du traitement n'est PAS affiche au-dessus (jugement a l'aveugle, comme le
 * banc des cles) — seule une lettre le repere.
 */

import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useState } from "react";
import {
  AbsoluteFill,
  Img,
  continueRender,
  delayRender,
  staticFile,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import { LaptopModel } from "./LaptopModel";
import { GridBackdrop, GRID_TEAL } from "./GridBackdrop";

const PLATE_DESKTOP = "_client-sim/noteshield/live/dashboard-full.png";
const SVG_MOCKUP = "_client-sim/noteshield/laptop-mockup.svg";

/** Zone d'ecran declaree par Fable dans le SVG (viewBox 1920x1080). */
const SVG_SCREEN = { x: 515, y: 140, w: 940, h: 588 };
const SVG_VB = { w: 1920, h: 1080 };
/**
 * ⛔ Le laptop DESSINE n'occupe pas tout le viewBox : mesure sur le rendu, sa
 * base va de x~270 a x~1650, soit 1380 px de large sur 1920 (72 %). Cadrer sur
 * le viewBox entier le rendait 3x plus petit que les modeles 3D — un comparatif
 * ou les objets n'ont pas la meme taille ne prouve rien.
 */
const SVG_LAPTOP_W_IN_VB = 1380;

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
 * Eclairage commun. Pour le traitement APLATI on coupera les directionnelles
 * dures : c'est l'ambiante qui domine, donc pas de speculaire qui "photographie"
 * l'objet au milieu d'un dessin.
 */
const BenchLights: React.FC<{ flat?: boolean }> = ({ flat = false }) => (
  <>
    <ambientLight color="#ffffff" intensity={flat ? 2.6 : 0.75} />
    <directionalLight
      position={[3.2, 6.5, 2.5]}
      color="#ffffff"
      intensity={flat ? 1.1 : 4.0}
    />
    <directionalLight
      position={[-4.5, 1.5, 3]}
      color="#ffffff"
      intensity={flat ? 0.5 : 1.1}
    />
  </>
);

/**
 * Traitement C : on remplace les materiaux du modele par des `meshLambertMaterial`
 * mats, sans metalness ni reflet. La geometrie ne change pas — seule la MATIERE
 * rejoint le registre dessine. Fait par parcours de la scene, comme pour l'ecran.
 */
const FlatMaterials: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = React.useRef<THREE.Group>(null);
  useLayoutEffect(() => {
    ref.current?.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const mat = m.material as THREE.MeshStandardMaterial;
      // ⛔ Ne PAS toucher a l'ecran : il porte l'UI et doit rester emissif.
      if (mat && (mat as THREE.Material & { map?: unknown }).map) return;
      if (mat && "metalness" in mat) {
        mat.metalness = 0;
        mat.roughness = 1;
        mat.envMapIntensity = 0;
        mat.needsUpdate = true;
      }
    });
  });
  return <group ref={ref}>{children}</group>;
};

const Cell: React.FC<{
  letter: string;
  children: React.ReactNode;
  width: number;
  height: number;
}> = ({ letter, children, width, height }) => (
  <div style={{ position: "relative", width, height, overflow: "hidden" }}>
    {children}
    <div
      style={{
        position: "absolute",
        bottom: 22,
        width: "100%",
        textAlign: "center",
        fontFamily: "monospace",
        fontSize: 30,
        color: "#7fa8b8",
        letterSpacing: "0.2em",
      }}
    >
      {letter}
    </div>
  </div>
);

export const SvgVs3dBench: React.FC = () => {
  const { width, height } = useVideoConfig();
  const cellW = width / 3;
  const tex = useTex(PLATE_DESKTOP, 3840 / 2160, 2.88 / 1.8);

  /**
   * Les 3 traitements doivent faire la MEME largeur d'objet a l'ecran, sinon la
   * comparaison est faussee. Cible : 82 % de la cellule.
   * 3D : le modele fait 3.2 unites de large ; a fov 40 et camZ 9.05 sur 1080 px
   * de haut, cela donne unitsToPx(3.2, 9.05) px. On aligne le SVG dessus.
   * (Le commentaire disait 7.2 alors que le code utilise 9.05 depuis toujours —
   *  corrige au /wrap 2026-08-27 : recalculer depuis 7.2 donnait +25 % d'erreur.)
   */
  const targetW = cellW * 0.82;
  const svgScale = targetW / SVG_LAPTOP_W_IN_VB;
  const svgW = SVG_VB.w * svgScale;
  const svgH = SVG_VB.h * svgScale;

  const laptop = (flat: boolean) => (
    <ThreeCanvas
      width={Math.round(cellW)}
      height={height}
      camera={{ fov: 40, position: [0, 0.12, 9.05] }}
      style={{ background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
    >
      <BenchLights flat={flat} />
      {flat ? (
        <FlatMaterials>
          <LaptopModel
            rotationY={0}
            scale={1.0}
            lidAngle={1.72}
            screen={tex ? <meshBasicMaterial map={tex} toneMapped={false} /> : undefined}
          />
        </FlatMaterials>
      ) : (
        <LaptopModel
          rotationY={0}
          scale={1.0}
          lidAngle={1.72}
          screen={tex ? <meshBasicMaterial map={tex} toneMapped={false} /> : undefined}
        />
      )}
    </ThreeCanvas>
  );

  return (
    <AbsoluteFill>
      <GridBackdrop palette={GRID_TEAL} />
      <div style={{ display: "flex", width, height }}>
        {/* A — le mockup SVG de Fable, avec l'UI reelle dans sa zone d'ecran. */}
        <Cell letter="A" width={cellW} height={height}>
          <div
            style={{
              position: "absolute",
              left: (cellW - svgW) / 2,
              top: (height - svgH) / 2,
              width: svgW,
              height: svgH,
            }}
          >
            <Img
              src={staticFile(SVG_MOCKUP)}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            />
            <div
              style={{
                position: "absolute",
                left: SVG_SCREEN.x * svgScale,
                top: SVG_SCREEN.y * svgScale,
                width: SVG_SCREEN.w * svgScale,
                height: SVG_SCREEN.h * svgScale,
                overflow: "hidden",
              }}
            >
              <Img
                src={staticFile(PLATE_DESKTOP)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </Cell>

        {/* B — 3D, materiau actuel (metallique). */}
        <Cell letter="B" width={cellW} height={height}>
          {laptop(false)}
        </Cell>

        {/* C — 3D, materiau aplati (mat, sans reflet). */}
        <Cell letter="C" width={cellW} height={height}>
          {laptop(true)}
        </Cell>
      </div>
    </AbsoluteFill>
  );
};
