/**
 * KeyModelB — ornamental gold key, fully procedural geometry.
 *
 * Design notes:
 * - HEAD: extruded gothic quatrefoil (four lobes) with a matching quatrefoil
 *   piercing. The extrusion axis is Z, so the openwork face points at the
 *   camera: the head reads as a wide, ornate silhouette at rotationY = 0
 *   and keeps its shape in three-quarter view. This avoids the known trap
 *   where a torus in the shaft plane reads as a screwdriver from the front.
 * - SHAFT: single LatheGeometry profile with a collar under the head, a
 *   mid bulb, a lower ring molding and a flared tip. No plain cylinder.
 * - BIT: extruded plate with stepped ward cuts of varying depth, in the
 *   same plane as the head so the silhouette stays legible from the front.
 *
 * The component only returns a <group>; lights, camera and canvas are
 * provided by the caller.
 */

import React, { useMemo } from "react";
import * as THREE from "three";

// Polar sampling of a quatrefoil outline: four lobe circles of radius r
// centered at distance d from the origin, at 0/90/180/270 degrees. The
// union boundary is sampled as R(theta) = max over lobes.
const quatrefoilPoints = (s: number, segments: number): THREE.Vector2[] => {
  const d = 0.3 * s;
  const r = 0.24 * s;
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    let best = 0;
    for (let k = 0; k < 4; k++) {
      const delta = t - (k * Math.PI) / 2;
      const sn = d * Math.sin(delta);
      if (Math.cos(delta) > 0 && Math.abs(sn) <= r) {
        const f = d * Math.cos(delta) + Math.sqrt(Math.max(r * r - sn * sn, 0));
        if (f > best) best = f;
      }
    }
    pts.push(new THREE.Vector2(Math.cos(t) * best, Math.sin(t) * best));
  }
  return pts;
};

// Slightly matte head, polished shaft, bit in between: the material shift
// separates the parts under a single warm gold.
const GOLD_HEAD = {
  color: "#f3c04e",
  metalness: 0.9,
  roughness: 0.32,
  emissive: "#6e4408",
  emissiveIntensity: 0.45,
} as const;

const GOLD_SHAFT = {
  color: "#f7cd66",
  metalness: 0.92,
  roughness: 0.16,
  emissive: "#7a4d10",
  emissiveIntensity: 0.5,
} as const;

const GOLD_BIT = {
  color: "#f2c258",
  metalness: 0.9,
  roughness: 0.24,
  emissive: "#6e4408",
  emissiveIntensity: 0.45,
} as const;

const HEAD_Y = 1.04;

export const KeyModel: React.FC<{ rotationY: number; scale: number }> = ({
  rotationY,
  scale,
}) => {
  const { headGeo, shaftGeo, bitGeo } = useMemo(() => {
    // --- Head: pierced quatrefoil, extruded toward the camera ---
    const outer = new THREE.Shape(quatrefoilPoints(1.0, 128));
    const hole = new THREE.Path(quatrefoilPoints(0.58, 96).reverse());
    outer.holes.push(hole);
    const head = new THREE.ExtrudeGeometry(outer, {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.025,
      bevelSegments: 3,
      steps: 1,
    });
    head.center();

    // --- Shaft: lathe profile, tip at the bottom, collar at the top ---
    const profile: THREE.Vector2[] = [
      new THREE.Vector2(0.0, -1.52),
      new THREE.Vector2(0.06, -1.46),
      new THREE.Vector2(0.1, -1.42),
      new THREE.Vector2(0.065, -1.38),
      new THREE.Vector2(0.065, -0.46),
      new THREE.Vector2(0.115, -0.42),
      new THREE.Vector2(0.115, -0.35),
      new THREE.Vector2(0.07, -0.31),
      new THREE.Vector2(0.07, -0.02),
      new THREE.Vector2(0.135, 0.03),
      new THREE.Vector2(0.135, 0.13),
      new THREE.Vector2(0.08, 0.18),
      new THREE.Vector2(0.08, 0.4),
      new THREE.Vector2(0.15, 0.44),
      new THREE.Vector2(0.15, 0.54),
      new THREE.Vector2(0.0, 0.54),
    ];
    const shaft = new THREE.LatheGeometry(profile, 48);

    // --- Bit: flat plate with stepped ward cuts, in the head plane ---
    const bitPts: Array<[number, number]> = [
      [0.03, -0.75],
      [0.42, -0.75],
      [0.42, -0.92],
      [0.34, -0.92],
      [0.34, -1.08],
      [0.42, -1.08],
      [0.42, -1.22],
      [0.26, -1.22],
      [0.26, -1.05],
      [0.18, -1.05],
      [0.18, -1.3],
      [0.1, -1.3],
      [0.1, -1.12],
      [0.03, -1.12],
    ];
    const bitShape = new THREE.Shape(
      bitPts.map(([x, y]) => new THREE.Vector2(x, y))
    );
    const bit = new THREE.ExtrudeGeometry(bitShape, {
      depth: 0.09,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.015,
      bevelSegments: 2,
      steps: 1,
    });
    bit.translate(0, 0, -0.045);

    return { headGeo: head, shaftGeo: shaft, bitGeo: bit };
  }, []);

  // Diagonal beads nested in the waists between the four lobes.
  const beadAngles = [45, 135, 225, 315].map((a) => (a * Math.PI) / 180);

  return (
    <group rotation={[0, rotationY, 0.08]} scale={[scale, scale, scale]}>
      {/* Head */}
      <mesh geometry={headGeo} position={[0, HEAD_Y, 0]}>
        <meshStandardMaterial {...GOLD_HEAD} />
      </mesh>

      {/* Beads between the lobes */}
      {beadAngles.map((a, i) => (
        <mesh
          key={i}
          position={[Math.cos(a) * 0.36, HEAD_Y + Math.sin(a) * 0.36, 0]}
        >
          <sphereGeometry args={[0.055, 20, 20]} />
          <meshStandardMaterial {...GOLD_SHAFT} />
        </mesh>
      ))}

      {/* Finial on top of the head */}
      <mesh position={[0, HEAD_Y + 0.58, 0]}>
        <sphereGeometry args={[0.07, 20, 20]} />
        <meshStandardMaterial {...GOLD_SHAFT} />
      </mesh>

      {/* Collar torus at the head-shaft junction */}
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.16, 0.045, 16, 40]} />
        <meshStandardMaterial {...GOLD_SHAFT} />
      </mesh>

      {/* Shaft */}
      <mesh geometry={shaftGeo}>
        <meshStandardMaterial {...GOLD_SHAFT} side={THREE.DoubleSide} />
      </mesh>

      {/* Bit */}
      <mesh geometry={bitGeo}>
        <meshStandardMaterial {...GOLD_BIT} />
      </mesh>
    </group>
  );
};
