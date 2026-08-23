/**
 * KeyModelA — ornamental gold door key, fully procedural geometry.
 *
 * Design notes:
 * - HEAD: pierced Gothic quatrefoil rosette built as one ExtrudeGeometry.
 *   The outline is a polar-sampled union of four lobe circles; the piercing
 *   is 4 lobe holes + 1 central oculus, which leaves a real tracery web
 *   (rim + cross spokes). Extruded along Z with a bevel, so the head always
 *   presents a wide, ornate frontal silhouette — it can never collapse into
 *   a "screwdriver" line the way an in-plane torus does.
 * - SHAFT: a single LatheGeometry profile (collar, coves, upper ring, pearl
 *   knop, lower ring, bit collar, bulb finial and needle tip) plus a helical
 *   TubeGeometry wire wrapped around the mid-stem (rope twist detail).
 * - BIT: one ExtrudeGeometry plate with stepped crenellated cuts and an
 *   interior rectangular ward slot (refend), not stacked boxes.
 * - Accents: chased boss rings around the oculus, two C-scroll volutes at
 *   the head/collar junction, pearls at the quatrefoil cusps.
 *
 * Bounds: height ~3.2 (y in [-1.6, 1.6]), width ~1.2, centered on origin.
 * No lights, no camera, no animation — rotation comes from the rotationY prop.
 */

import React, { useMemo } from "react";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Helpers (module scope, deterministic)
// ---------------------------------------------------------------------------

/** Helix around the Y axis, used for the rope-twist wire on the stem. */
class HelixCurve extends THREE.Curve<THREE.Vector3> {
  constructor(
    private readonly radius: number,
    private readonly yStart: number,
    private readonly yEnd: number,
    private readonly turns: number
  ) {
    super();
  }

  override getPoint(
    t: number,
    optionalTarget: THREE.Vector3 = new THREE.Vector3()
  ): THREE.Vector3 {
    const angle = t * this.turns * Math.PI * 2;
    return optionalTarget.set(
      Math.cos(angle) * this.radius,
      this.yStart + (this.yEnd - this.yStart) * t,
      Math.sin(angle) * this.radius
    );
  }
}

/**
 * Quatrefoil outline: union of 4 circles of radius r centered at distance d
 * along the +-X / +-Y axes, sampled in polar coordinates. For a ray at angle
 * theta, the boundary distance is the far intersection with the circle of the
 * nearest lobe. Requires r > d * sin(45deg) so lobes overlap at the cusps.
 */
const quatrefoilRadius = (theta: number, d: number, r: number): number => {
  const lobe = Math.round(theta / (Math.PI / 2)) * (Math.PI / 2);
  const delta = theta - lobe;
  const s = d * Math.sin(delta);
  return d * Math.cos(delta) + Math.sqrt(Math.max(r * r - s * s, 1e-6));
};

const buildHeadShape = (
  d: number,
  r: number,
  lobeHoleR: number,
  centerHoleR: number
): THREE.Shape => {
  const shape = new THREE.Shape();
  const N = 192;
  for (let i = 0; i <= N; i++) {
    const theta = (i / N) * Math.PI * 2;
    const t = quatrefoilRadius(theta, d, r);
    const x = Math.cos(theta) * t;
    const y = Math.sin(theta) * t;
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  shape.closePath();

  // Central oculus
  const oculus = new THREE.Path();
  oculus.absarc(0, 0, centerHoleR, 0, Math.PI * 2, true);
  shape.holes.push(oculus);

  // One pierced hole per lobe -> leaves a cross-shaped tracery web
  const lobeCenters: Array<[number, number]> = [
    [d, 0],
    [0, d],
    [-d, 0],
    [0, -d],
  ];
  for (const [cx, cy] of lobeCenters) {
    const hole = new THREE.Path();
    hole.absarc(cx, cy, lobeHoleR, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }
  return shape;
};

const buildBitShape = (): THREE.Shape => {
  const s = new THREE.Shape();
  // Plate attached to the right of the shaft, teeth cut on the bottom edge
  s.moveTo(0.02, -0.86);
  s.lineTo(0.34, -0.86);
  s.lineTo(0.34, -0.9); // shoulder step
  s.lineTo(0.4, -0.9);
  s.lineTo(0.4, -1.06);
  s.lineTo(0.29, -1.06); // first crenel in
  s.lineTo(0.29, -1.16);
  s.lineTo(0.4, -1.16); // crenel back out
  s.lineTo(0.4, -1.32);
  s.lineTo(0.21, -1.32); // bottom edge
  s.lineTo(0.21, -1.2); // upward tooth gap
  s.lineTo(0.13, -1.2);
  s.lineTo(0.13, -1.36); // deepest tooth
  s.lineTo(0.02, -1.36);
  s.closePath();

  // Interior ward slot (refend)
  const slot = new THREE.Path();
  slot.moveTo(0.17, -1.0);
  slot.lineTo(0.33, -1.0);
  slot.lineTo(0.33, -0.94);
  slot.lineTo(0.17, -0.94);
  slot.closePath();
  s.holes.push(slot);
  return s;
};

/** Shaft profile for LatheGeometry: [radius, y], bottom tip to top collar. */
const SHAFT_PROFILE: Array<[number, number]> = [
  [0.0, -1.6], // needle tip
  [0.045, -1.54],
  [0.1, -1.47], // finial bulb
  [0.1, -1.43],
  [0.05, -1.4], // neck above bulb
  [0.05, -1.38],
  [0.09, -1.37], // collar under the bit
  [0.09, -1.33],
  [0.065, -1.32], // stem running through the bit
  [0.065, -0.8],
  [0.105, -0.78], // lower ring
  [0.105, -0.72],
  [0.07, -0.7],
  [0.07, -0.42],
  [0.13, -0.34], // pearl knop
  [0.135, -0.29],
  [0.13, -0.24],
  [0.07, -0.16],
  [0.07, 0.1],
  [0.11, 0.12], // upper ring
  [0.11, 0.18],
  [0.08, 0.2],
  [0.08, 0.34],
  [0.15, 0.4], // flared collar under the head
  [0.17, 0.46],
  [0.17, 0.5],
  [0.0, 0.5],
];

// Head geometry constants
const HEAD_Y = 1.0;
const LOBE_DIST = 0.32;
const LOBE_R = 0.28;
const LOBE_HOLE_R = 0.145;
const CENTER_HOLE_R = 0.105;
const HEAD_DEPTH = 0.13;
const BIT_DEPTH = 0.11;

// Cusp positions (diagonals between lobes) for the pearl accents
const CUSP_R = quatrefoilRadius(Math.PI / 4, LOBE_DIST, LOBE_R) + 0.015;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const KeyModel: React.FC<{ rotationY: number; scale: number }> = ({
  rotationY,
  scale,
}) => {
  const headGeometry = useMemo(() => {
    const shape = buildHeadShape(LOBE_DIST, LOBE_R, LOBE_HOLE_R, CENTER_HOLE_R);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: HEAD_DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.028,
      bevelSegments: 3,
      curveSegments: 12,
    });
    // Shape is XY-symmetric: center() puts the extrusion mid-plane on z=0
    geo.center();
    return geo;
  }, []);

  const bitGeometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(buildBitShape(), {
      depth: BIT_DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.014,
      bevelSegments: 2,
      curveSegments: 4,
    });
    // Asymmetric shape: only recenter along Z, keep XY placement
    geo.translate(0, 0, -(BIT_DEPTH / 2));
    return geo;
  }, []);

  const shaftGeometry = useMemo(() => {
    const points = SHAFT_PROFILE.map(([r, y]) => new THREE.Vector2(r, y));
    return new THREE.LatheGeometry(points, 48);
  }, []);

  const twistGeometry = useMemo(() => {
    const helix = new HelixCurve(0.082, -0.14, 0.06, 3);
    return new THREE.TubeGeometry(helix, 96, 0.024, 8, false);
  }, []);

  // Gold materials: head slightly softer (chased surface), shaft high polish
  const headGold = {
    color: "#f3c257",
    metalness: 0.88,
    roughness: 0.3,
    emissive: "#7a4d10",
    emissiveIntensity: 0.45,
  };
  const shaftGold = {
    color: "#f6c95e",
    metalness: 0.93,
    roughness: 0.16,
    emissive: "#7a4d10",
    emissiveIntensity: 0.5,
  };

  return (
    <group rotation={[0, rotationY, 0.09]} scale={[scale, scale, scale]}>
      {/* HEAD - pierced quatrefoil rosette, faces the camera */}
      <mesh geometry={headGeometry} position={[0, HEAD_Y, 0]}>
        <meshStandardMaterial {...headGold} />
      </mesh>

      {/* Chased boss rings framing the central oculus, front and back */}
      {[0.085, -0.085].map((z) => (
        <mesh key={z} position={[0, HEAD_Y, z]}>
          <torusGeometry args={[CENTER_HOLE_R + 0.022, 0.026, 12, 48]} />
          <meshStandardMaterial {...headGold} />
        </mesh>
      ))}

      {/* Pearls at the four quatrefoil cusps (diagonal notches of the rim) */}
      {[0, 1, 2, 3].map((i) => {
        const a = Math.PI / 4 + (i * Math.PI) / 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * CUSP_R, HEAD_Y + Math.sin(a) * CUSP_R, 0]}
          >
            <sphereGeometry args={[0.055, 20, 16]} />
            <meshStandardMaterial {...headGold} />
          </mesh>
        );
      })}

      {/* C-scroll volutes flanking the head / collar junction */}
      <mesh position={[0.2, 0.46, 0]} rotation={[0, 0, Math.PI * 0.65]}>
        <torusGeometry args={[0.085, 0.03, 12, 32, Math.PI * 1.5]} />
        <meshStandardMaterial {...headGold} />
      </mesh>
      <mesh position={[-0.2, 0.46, 0]} rotation={[0, Math.PI, Math.PI * 0.65]}>
        <torusGeometry args={[0.085, 0.03, 12, 32, Math.PI * 1.5]} />
        <meshStandardMaterial {...headGold} />
      </mesh>

      {/* SHAFT - single lathe: collar, rings, pearl knop, bulb finial, tip */}
      <mesh geometry={shaftGeometry}>
        <meshStandardMaterial {...shaftGold} />
      </mesh>

      {/* Rope-twist wire wrapped around the mid-stem */}
      <mesh geometry={twistGeometry}>
        <meshStandardMaterial {...headGold} />
      </mesh>

      {/* BIT - crenellated plate with interior ward slot */}
      <mesh geometry={bitGeometry}>
        <meshStandardMaterial {...shaftGold} />
      </mesh>
    </group>
  );
};
