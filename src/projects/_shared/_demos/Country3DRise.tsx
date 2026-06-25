/**
 * Country3DRise — HOOK 3D premium (2026-06-17) : la silhouette d'un VRAI pays, EXTRUDEE en
 * relief 3D (epaisseur reelle), qui se leve et tourne lentement dans une lumiere gold rasante.
 * Le chiffre choc reste net en surimpression.
 *
 * Registre neuf (jamais fait dans le projet) : profondeur + lumiere directionnelle + camera
 * spatiale, sur le SUJET d'Aziz (la geographie). Pas un gadget 3D — un pays qui prend du POIDS.
 *
 * Technique :
 *   - topojson countries-50m.json → feature pays → contour lon/lat
 *   - d3-geo (geoMercator centre sur le pays) → coords ecran 2D normalisees
 *   - THREE.Shape + ExtrudeGeometry → volume 3D avec biseau
 *   - ThreeCanvas (frame-driven, headless) : rotation + montee spring + camera fixe
 *
 * Pas de police externe requise (on extrude une SILHOUETTE, pas du texte). Le chiffre = overlay 2D.
 * Render via scripts/render-mapbox.sh (--gl=angle).
 */

import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import * as THREE from "three";
import { staticFile, continueRender, delayRender } from "remotion";

const GOLD = "#c8a951";
const IVORY = "#f2ebd9";
const NAVY_DEEP = "#0d1424";

/** Charge le topojson une fois et renvoie la THREE.Shape[] du pays (coords normalisees ~[-2,2]). */
function useCountryShapes(geoName: string): THREE.Shape[] | null {
  const [shapes, setShapes] = React.useState<THREE.Shape[] | null>(null);
  const [handle] = React.useState(() => delayRender(`Country3DRise load ${geoName}`));

  React.useEffect(() => {
    let cancelled = false;
    fetch(staticFile("_shared/geo-data/countries-50m.json"))
      .then((r) => r.json())
      .then((topo) => {
        if (cancelled) return;
        const fc = feature(topo, topo.objects.countries) as unknown as {
          features: Array<{ properties: { name: string }; geometry: unknown }>;
        };
        const feat = fc.features.find((f) => f.properties?.name === geoName);
        if (!feat) {
          continueRender(handle);
          return;
        }
        // Projection Mercator centree sur le pays, ajustee a une boite normalisee
        const proj = geoMercator().fitSize([4, 4], feat as never);
        const pathGen = geoPath(proj);
        // Iterer les coordonnees projetees directement → THREE.Shape par polygone.
        const geom = feat.geometry as {
          type: string;
          coordinates: number[][][] | number[][][][];
        };
        // Normaliser en liste de polygones (chacun = liste d'anneaux)
        const allPolys: number[][][][] =
          geom.type === "Polygon"
            ? [geom.coordinates as unknown as number[][][]]
            : (geom.coordinates as unknown as number[][][][]);

        const built: THREE.Shape[] = [];
        for (const poly of allPolys) {
          for (let ringIdx = 0; ringIdx < poly.length; ringIdx++) {
            const ring = poly[ringIdx];
            const pts: THREE.Vector2[] = [];
            for (const coord of ring) {
              const p = proj(coord as [number, number]);
              if (!p) continue;
              // centrer autour de 0 (fitSize donne [0,4]) + flip Y (ecran→3D)
              pts.push(new THREE.Vector2(p[0] - 2, -(p[1] - 2)));
            }
            if (pts.length < 3) continue;
            // anneau exterieur seulement (ringIdx 0) — on ignore les trous pour la demo
            if (ringIdx === 0) {
              const shape = new THREE.Shape(pts);
              built.push(shape);
            }
          }
        }
        if (!cancelled) {
          setShapes(built);
          continueRender(handle);
        }
      })
      .catch(() => continueRender(handle));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoName]);

  return shapes;
}

const CountryMesh: React.FC<{ shapes: THREE.Shape[]; frame: number; fps: number }> = ({
  shapes,
  frame,
  fps,
}) => {
  const geometry = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shapes, {
      depth: 0.55,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelSegments: 2,
    });
    g.center();
    return g;
  }, [shapes]);

  // Montee spring (le pays "se leve") + rotation lente continue
  const rise = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 120, mass: 1 } });
  const y = interpolate(rise, [0, 1], [-3, 0]);
  const rotY = interpolate(frame, [0, 120], [-0.5, 0.55]);
  const rotX = interpolate(rise, [0, 1], [-0.9, -0.35]); // legere plongee

  return (
    <mesh geometry={geometry} position={[0, y, 0]} rotation={[rotX, rotY, 0]} castShadow receiveShadow>
      <meshStandardMaterial color={"#1c2c4d"} metalness={0.45} roughness={0.4} />
    </mesh>
  );
};

const Scene: React.FC<{ shapes: THREE.Shape[]; frame: number; fps: number }> = ({
  shapes,
  frame,
  fps,
}) => (
  <>
    <perspectiveCamera position={[0, 1.2, 7]} fov={42} />
    <ambientLight intensity={0.4} color={"#4a5a7a"} />
    {/* spot gold rasant = relief premium */}
    <directionalLight position={[6, 7, 5]} intensity={1.6} color={GOLD} castShadow />
    <directionalLight position={[-7, 2, 3]} intensity={0.5} color={"#6fa8dc"} />
    {/* sol pour recevoir l'ombre portee */}
    <mesh position={[0, -2.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color={NAVY_DEEP} roughness={0.95} />
    </mesh>
    <CountryMesh shapes={shapes} frame={frame} fps={fps} />
  </>
);

export interface Country3DRiseProps {
  geoName?: string;
  bigText?: string;
  subText?: string;
}

export const Country3DRise: React.FC<Country3DRiseProps> = ({
  geoName = "Morocco",
  bigText = "70%",
  subText = "DU PHOSPHATE MONDIAL",
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const isVertical = height > width;
  const shapes = useCountryShapes(geoName);

  const txtSpring = spring({ frame: frame - 40, fps, config: { damping: 13, stiffness: 200 } });
  const txtScale = interpolate(txtSpring, [0, 1], [0.5, 1]);
  const txtOpacity = interpolate(frame, [40, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subOpacity = interpolate(frame, [58, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const globalOpacity = interpolate(frame, [110, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const bigFontSize = isVertical ? width * 0.22 : height * 0.28;

  return (
    <AbsoluteFill style={{ background: NAVY_DEEP, opacity: globalOpacity }}>
      <ThreeCanvas width={width} height={height} shadows gl={{ antialias: true }}>
        {shapes && shapes.length > 0 ? <Scene shapes={shapes} frame={frame} fps={fps} /> : null}
      </ThreeCanvas>

      {/* Chiffre choc 2D net, pose en haut apres que le pays se soit leve */}
      <div
        style={{
          position: "absolute",
          top: isVertical ? height * 0.12 : height * 0.1,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `scale(${txtScale})`,
          opacity: txtOpacity,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            color: IVORY,
            fontFamily: "'Bebas Neue', 'Impact', sans-serif",
            fontWeight: 900,
            fontSize: bigFontSize,
            textShadow: `0 0 40px ${GOLD}, 0 8px 30px rgba(0,0,0,0.7)`,
          }}
        >
          {bigText}
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: isVertical ? height * 0.14 : height * 0.1,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: subOpacity,
        }}
      >
        <span
          style={{
            color: GOLD,
            fontSize: isVertical ? 44 : 38,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontFamily: "'Bebas Neue', 'Impact', sans-serif",
            textShadow: "0 4px 24px rgba(0,0,0,0.8)",
          }}
        >
          {subText}
        </span>
      </div>
    </AbsoluteFill>
  );
};

export default Country3DRise;
