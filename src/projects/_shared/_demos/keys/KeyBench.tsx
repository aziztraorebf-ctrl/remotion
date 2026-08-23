/**
 * KeyBench — banc de test comparatif pour les modeles de cle 3D
 *
 * Affiche UN modele de cle sous les 4 angles exacts de sa plage d'usage
 * (rotationY de -0.2 a 1.4 rad), cote a cote, meme eclairage, meme echelle.
 *
 * But : juger la LISIBILITE (critere n°1) sans se laisser influencer par
 * un angle flatteur isole. Une cle qui n'est belle qu'a un seul angle est
 * disqualifiee — c'est exactement le bug "tournevis" rencontre sur la
 * premiere version maison.
 *
 * Le nom du modele n'est PAS affiche : la comparaison se fait a l'aveugle,
 * conformement a la methode de feedback_leaderboard-presetectionne-test-aveugle-tranche.
 */

import { ThreeCanvas } from "@remotion/three";
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { KeyModel as KeyModelA } from "./KeyModelA";
import { KeyModel as KeyModelB } from "./KeyModelB";

/** Les 4 angles ou l'objet sera reellement vu, en radians. */
export const BENCH_ANGLES = [-0.2, 0.35, 0.85, 1.4] as const;

type KeyComponent = React.FC<{ rotationY: number; scale: number }>;

const BenchLights: React.FC = () => (
  <>
    <ambientLight color={0xfff2da} intensity={2.6} />
    <pointLight position={[2.5, 2.5, 4]} color={"#f0b350"} intensity={140} distance={30} />
    <pointLight position={[-3.5, -1, 5]} color={0xffd9a0} intensity={70} distance={26} />
    <pointLight position={[3, 3.5, 5]} color={0xfff0cc} intensity={55} distance={26} />
    <directionalLight position={[2, 5, 4]} intensity={3.2} color={0xfff6e8} />
  </>
);

export const KeyBench: React.FC<{ model: KeyComponent }> = ({ model: Key }) => {
  const { width, height } = useVideoConfig();
  const cellW = width / BENCH_ANGLES.length;

  return (
    <AbsoluteFill style={{ backgroundColor: "#241608" }}>
      <div style={{ display: "flex", width, height }}>
        {BENCH_ANGLES.map((angle, i) => (
          <div key={i} style={{ position: "relative", width: cellW, height }}>
            <ThreeCanvas
              width={Math.round(cellW)}
              height={height}
              camera={{ fov: 40, position: [0, 0, 10.5] }}
              style={{ background: "transparent" }}
              gl={{ alpha: true, antialias: true }}
            >
              <BenchLights />
              <Key rotationY={angle} scale={0.92} />
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
                color: "#c9a468",
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
 * navigateur → React error #130). Les modeles sont donc cables en dur ici.
 */
export const KeyBenchA: React.FC = () => <KeyBench model={KeyModelA} />;
export const KeyBenchB: React.FC = () => <KeyBench model={KeyModelB} />;
