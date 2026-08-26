/**
 * DeviceBench — banc de test pour les mockups d'appareils 3D (telephone, laptop).
 *
 * Meme protocole que keys/KeyBench.tsx : UN modele affiche sous les 4 angles
 * exacts de sa plage d'usage, cote a cote, meme eclairage, meme echelle.
 * Un objet qui n'est beau qu'a un seul angle est disqualifie (piege "tournevis").
 *
 * Difference avec KeyBench : l'eclairage vise le registre "SaaS explainer
 * premium" observe sur la reference Comma (2026-08-25) — studio sombre, key
 * light froide, rim light qui detoure la silhouette, et une nappe verte tres
 * sourde en fond pour rappeler le bokeh de la reference. Les aretes chanfreinees
 * du chassis ne se lisent QUE sous une lumiere rasante : un eclairage plat
 * ferait passer un bon modele pour un mauvais.
 */

import { ThreeCanvas } from "@remotion/three";
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { PhoneModel } from "./PhoneModel";
import { LaptopModel } from "./LaptopModel";
import { PhoneModelVision } from "./PhoneModelVision";
import { VisionLights, VISION_BG } from "./VisionLights";

/** Les 4 angles ou l'objet sera reellement vu, en radians. */
export const DEVICE_BENCH_ANGLES = [-0.2, 0.35, 0.85, 1.4] as const;

type DeviceComponent = React.FC<{ rotationY: number; scale: number }>;

/**
 * Eclairage studio sombre. Trois roles distincts :
 * - key : source principale, en haut a droite, froide et franche
 * - fill : deboucheur faible cote oppose, evite le noir bouche
 * - rim : contre-jour qui dessine le contour du chassis (le detail premium)
 */
const StudioLights: React.FC = () => (
  <>
    <ambientLight color={0xdfe6ef} intensity={1.5} />
    <directionalLight position={[4, 6, 6]} intensity={5.5} color={0xf4f8ff} />
    <directionalLight position={[-3, 2, 5]} intensity={2.2} color={0xc9d8ea} />
    <pointLight position={[-5, 1, 4]} color={0xaebdd0} intensity={160} distance={40} />
    <pointLight position={[-2, 3, -5]} color={0xbfe6c8} intensity={220} distance={40} />
    <pointLight position={[5, -2, 2]} color={0x8fa4bd} intensity={120} distance={34} />
    <pointLight position={[0, 4, 6]} color={0xffffff} intensity={90} distance={30} />
  </>
);

export const DeviceBench: React.FC<{
  model: DeviceComponent;
  scale?: number;
  lights?: React.FC;
  bg?: string;
}> = ({ model: Device, scale = 0.92, lights: Lights = StudioLights, bg = "#191d1f" }) => {
  const { width, height } = useVideoConfig();
  const cellW = width / DEVICE_BENCH_ANGLES.length;

  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <div style={{ display: "flex", width, height }}>
        {DEVICE_BENCH_ANGLES.map((angle, i) => (
          <div key={i} style={{ position: "relative", width: cellW, height }}>
            <ThreeCanvas
              width={Math.round(cellW)}
              height={height}
              camera={{ fov: 40, position: [0, 0.35, 12.2] }}
              style={{ background: "transparent" }}
              gl={{ alpha: true, antialias: true }}
            >
              <Lights />
              <Device rotationY={angle} scale={scale} />
            </ThreeCanvas>
            {/* Angle en radians — repere technique, pas le nom du modele */}
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

/**
 * Wrappers concrets — Remotion serialise les defaultProps en JSON, donc on ne
 * peut PAS y passer une reference de composant (elle arrive `undefined` cote
 * navigateur -> React error #130). Les modeles sont donc cables en dur ici.
 * Meme piege que keys/KeyBench.tsx.
 */
export const DeviceBenchPhone: React.FC = () => <DeviceBench model={PhoneModel} />;
export const DeviceBenchLaptop: React.FC = () => <DeviceBench model={LaptopModel} scale={0.74} />;

/** Test vision->3D : modele ET eclairage deduits d'une frame de reference. */
export const DeviceBenchPhoneVision: React.FC = () => (
  <DeviceBench model={PhoneModelVision} lights={VisionLights} bg={VISION_BG} />
);
/** Meme modele vision, mais sous l'eclairage regle A L'AVEUGLE — isole la variable lumiere. */
export const DeviceBenchPhoneVisionBlindLights: React.FC = () => (
  <DeviceBench model={PhoneModelVision} />
);
/** Modele d'ORIGINE sous l'eclairage VISION — isole la variable geometrie. */
export const DeviceBenchPhoneOrigVisionLights: React.FC = () => (
  <DeviceBench model={PhoneModel} lights={VisionLights} bg={VISION_BG} />
);
