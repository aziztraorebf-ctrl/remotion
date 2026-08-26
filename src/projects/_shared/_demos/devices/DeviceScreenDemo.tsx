/**
 * DeviceScreenDemo — le mariage pilier 3 (UI produit capturee) + pilier 4
 * (motion design React) : une capture Shotcraft REELLE plaquee dans l'ecran
 * d'un mockup 3D procedural.
 *
 * Principe (voie recommandee par les deux modeles, cf. en-tetes de
 * PhoneModel/LaptopModel) : on ne passe PAS par <Html> de drei — cette couche
 * DOM vit hors canvas, donc pas d'occlusion ni d'eclairage, et aux angles
 * rasants l'UI flotterait au-dessus du chassis. On charge la plaque en
 * THREE.Texture et on la pose sur le mesh d'ecran : elle est alors eclairee,
 * occluse et triee en profondeur comme le reste de l'objet.
 *
 * ⛔ La plaque est une CAPTURE, jamais un redessin React de l'UI
 * (regle n°1 de FICHE-UI-PRODUIT : le rendu de police d'un redessin differe
 * visiblement de la plaque au sol).
 *
 * Gestion du ratio : la plaque NorthShield est en 16:9 (3840x2160), l'ecran du
 * laptop en 16:10. On ne deforme pas l'image — on cadre dedans via repeat/offset
 * (equivalent d'un object-fit: cover), ce qui rogne un bandeau vertical.
 */

import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile, useVideoConfig } from "remotion";
import * as THREE from "three";
import { LaptopModel } from "./LaptopModel";
import { PhoneModel } from "./PhoneModel";
import { VisionLights, VISION_BG } from "./VisionLights";

/**
 * Plaques Shotcraft (pilier 3). DEUX captures, pas une redimensionnee :
 * une UI desktop rognee dans un cadre de telephone ne garde qu'une colonne.
 * La page mobile est une VARIANTE RESPONSIVE reelle (tableau replie en cartes),
 * capturee a 390x844 en x3 — src/projects/_client-sim/noteshield/live-page-mobile/.
 */
const PLATE_DESKTOP = "_client-sim/noteshield/live/dashboard-full.png";
const PLATE_MOBILE = "_client-sim/noteshield/live-mobile/dashboard-mobile.png";

/**
 * Charge la plaque en texture et la cadre en "cover" sur un ecran de ratio
 * donne. useLoader n'est pas utilise ici : TextureLoader est synchrone une fois
 * l'image en cache, et Remotion prefetch le staticFile. On memoise pour ne pas
 * recreer la texture a chaque frame.
 */
const useCoverTexture = (screenAspect: number, plate: string, plateAspect: number) => {
  const [handle] = useState(() => delayRender("loading Shotcraft plate"));
  const [tex, setTex] = useState<THREE.Texture | null>(null);

  useLayoutEffect(() => {
    /**
     * ⛔ TextureLoader.load est ASYNCHRONE. Sur un render `still`, Remotion
     * capture la frame des que React a fini — sans delayRender, l'image n'est
     * pas encore decodee et l'ecran sort NOIR (vecu sur le 1er rendu).
     * On bloque donc la capture jusqu'au onLoad, puis continueRender.
     */
    const loader = new THREE.TextureLoader();
    loader.load(
      staticFile(plate),
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        // Plaque 16:9 cadree "cover" sur l'ecran : on rogne, on n'etire pas.
        if (plateAspect > screenAspect) {
          const r = screenAspect / plateAspect;
          t.repeat.set(r, 1);
          t.offset.set((1 - r) / 2, 0);
        } else {
          const r = plateAspect / screenAspect;
          t.repeat.set(1, r);
          t.offset.set(0, (1 - r) / 2);
        }
        t.needsUpdate = true;
        setTex(t);
        continueRender(handle);
      },
      undefined,
      () => continueRender(handle)
    );
  }, [screenAspect, plate, plateAspect, handle]);

  return tex;
};

/**
 * Laptop dont l'ecran porte la plaque. On passe le material en enfant du mesh
 * nomme via la prop `screen` du modele — meme convention que PhoneModel.
 * meshBasicMaterial + toneMapped={false} : un ecran EMET sa lumiere, il ne la
 * recoit pas ; le passer en standard l'assombrirait sous un rig sombre.
 */
type DeviceWithScreen = React.FC<{
  rotationY: number;
  scale: number;
  tex: THREE.Texture | null;
}>;

const LaptopWithScreen: DeviceWithScreen = ({ rotationY, scale, tex }) => (
  <LaptopModel
    rotationY={rotationY}
    scale={scale}
    screen={tex ? <meshBasicMaterial map={tex} toneMapped={false} /> : undefined}
  />
);

const PhoneWithScreen: DeviceWithScreen = ({ rotationY, scale, tex }) => (
  <PhoneModel
    rotationY={rotationY}
    scale={scale}
    screen={tex ? <meshBasicMaterial map={tex} toneMapped={false} /> : undefined}
  />
);

/**
 * Eclairage du demo : le rig VISION (mesure sur la reference Comma) mais
 * remonte en intensite. Le rig brut tombait l'objet en silhouette — ses
 * DIRECTIONS et ses COULEURS sont justes (verifiees au pixel), ses niveaux
 * non. On garde donc la geometrie de lumiere et on monte les gains.
 */
const DemoLights: React.FC = () => (
  <>
    <ambientLight color="#ffffff" intensity={0.75} />
    {/* KEY neutre, haut-droite : la rampe 39->67 mesuree sur la reference. */}
    <directionalLight position={[2.5, 7, 2]} color="#ffffff" intensity={4.2} />
    {/* Fill gauche faible — separe le rail du fond sans le deboucher. */}
    <directionalLight position={[-5, 1.5, 2.5]} color="#ffffff" intensity={1.4} />
    {/* Rim arriere-droite, volontairement discret (la ref n'a PAS de rim chaud). */}
    <directionalLight position={[4.5, 2, -3.5]} color="#ffffff" intensity={1.6} />
  </>
);

const ScreenScene: React.FC<{
  device: DeviceWithScreen;
  angles: readonly number[];
  scale: number;
  screenAspect: number;
  plate: string;
  plateAspect: number;
}> = ({ device: Device, angles, scale, screenAspect, plate, plateAspect }) => {
  const { width, height } = useVideoConfig();
  const cellW = width / angles.length;

  /**
   * ⛔⛔ LA TEXTURE SE CHARGE ICI, DANS UN COMPOSANT **DOM**, HORS DU CANVAS.
   * Cause racine mesuree le 2026-08-25 : un useLayoutEffect/useEffect place
   * dans un composant enfant de <ThreeCanvas> n'est JAMAIS flushe avant la
   * capture Remotion sur un render `still` (react-three-fiber a son propre
   * reconciler). Le chargement ne demarrait meme pas -> ecran noir, et
   * delayRender ne servait a rien puisqu'il n'y avait aucune course.
   */
  const tex = useCoverTexture(screenAspect, plate, plateAspect);

  return (
    <AbsoluteFill style={{ backgroundColor: VISION_BG }}>
      <div style={{ display: "flex", width, height }}>
        {angles.map((angle, i) => (
          <div key={i} style={{ position: "relative", width: cellW, height }}>
            <ThreeCanvas
              width={Math.round(cellW)}
              height={height}
              camera={{ fov: 40, position: [0, 0.35, 12.2] }}
              style={{ background: "transparent" }}
              gl={{ alpha: true, antialias: true }}
            >
              <DemoLights />
              <Device rotationY={angle} scale={scale} tex={tex} />
            </ThreeCanvas>
            <div
              style={{
                position: "absolute",
                bottom: 24,
                width: "100%",
                textAlign: "center",
                fontFamily: "monospace",
                fontSize: 26,
                color: "#6f8496",
              }}
            >
              {angle.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** Angles resserres : un ecran se lit de face, pas au profil. */
const SCREEN_ANGLES = [-0.15, 0.2, 0.5, 0.85] as const;

export const LaptopScreenDemo: React.FC = () => (
  <ScreenScene device={LaptopWithScreen} angles={SCREEN_ANGLES} scale={0.74} screenAspect={2.88 / 1.8} plate={PLATE_DESKTOP} plateAspect={3840 / 2160} />
);

export const PhoneScreenDemo: React.FC = () => (
  <ScreenScene device={PhoneWithScreen} angles={SCREEN_ANGLES} scale={0.92} screenAspect={1.39 / 3.012} plate={PLATE_MOBILE} plateAspect={1170 / 2532} />
);
