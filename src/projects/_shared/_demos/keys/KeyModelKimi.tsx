import React, { useMemo } from 'react';
import * as THREE from 'three';

// Builds a quatrefoil outline path: four lobes whose circles of radius r are
// centered at distance r on each axis. Adjacent lobes meet at cusps.
const buildQuatrefoil = (r: number, reverse: boolean): THREE.Path => {
  const path = new THREE.Path();
  const centers: Array<[number, number, number, number]> = [
    [r, 0, -Math.PI / 2, Math.PI / 2],
    [0, r, 0, Math.PI],
    [-r, 0, Math.PI / 2, (3 * Math.PI) / 2],
    [0, -r, Math.PI, 2 * Math.PI],
  ];
  if (!reverse) {
    centers.forEach(([cx, cy, a0, a1], i) => {
      if (i === 0) {
        path.moveTo(cx + r * Math.cos(a0), cy + r * Math.sin(a0));
      }
      path.absarc(cx, cy, r, a0, a1, false);
    });
  } else {
    const rev = [...centers].reverse();
    rev.forEach(([cx, cy, a0, a1], i) => {
      if (i === 0) {
        path.moveTo(cx + r * Math.cos(a1), cy + r * Math.sin(a1));
      }
      path.absarc(cx, cy, r, a0, a1, true);
    });
  }
  path.closePath();
  return path;
};

export const KeyModel: React.FC<{ rotationY: number; scale: number }> = ({ rotationY, scale }) => {
  // Pierced quatrefoil bow (the head), extruded with a soft bevel.
  const bowGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const outer = buildQuatrefoil(0.3, false);
    shape.curves = outer.curves;
    const hole = buildQuatrefoil(0.17, true);
    shape.holes.push(hole);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 3,
      curveSegments: 48,
    });
    geo.translate(0, 0, -0.05);
    return geo;
  }, []);

  // Turned stem profile with collars and beads, revolved around the Y axis.
  const stemGeometry = useMemo(() => {
    const pts: THREE.Vector2[] = [
      new THREE.Vector2(0.0, 0.78),
      new THREE.Vector2(0.09, 0.78),
      new THREE.Vector2(0.1, 0.7),
      new THREE.Vector2(0.055, 0.62),
      new THREE.Vector2(0.05, 0.1),
      new THREE.Vector2(0.075, 0.06),
      new THREE.Vector2(0.075, -0.02),
      new THREE.Vector2(0.05, -0.06),
      new THREE.Vector2(0.05, -0.7),
      new THREE.Vector2(0.085, -0.74),
      new THREE.Vector2(0.085, -0.86),
      new THREE.Vector2(0.05, -0.9),
      new THREE.Vector2(0.05, -1.02),
      new THREE.Vector2(0.11, -1.06),
      new THREE.Vector2(0.11, -1.16),
      new THREE.Vector2(0.05, -1.2),
      new THREE.Vector2(0.045, -1.34),
      new THREE.Vector2(0.0, -1.38),
    ];
    return new THREE.LatheGeometry(pts, 40);
  }, []);

  // The bit (wards) at the bottom: a flat plate with real notches cut out.
  const bitGeometry = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.02, -0.95);
    s.lineTo(0.42, -0.95);
    s.lineTo(0.42, -1.06);
    s.lineTo(0.3, -1.06);
    s.lineTo(0.3, -1.14);
    s.lineTo(0.42, -1.14);
    s.lineTo(0.42, -1.5);
    s.lineTo(0.16, -1.5);
    s.lineTo(0.16, -1.32);
    s.lineTo(0.24, -1.32);
    s.lineTo(0.24, -1.22);
    s.lineTo(0.16, -1.22);
    s.lineTo(0.16, -1.06);
    s.lineTo(-0.02, -1.06);
    s.closePath();
    const geo = new THREE.ExtrudeGeometry(s, {
      depth: 0.07,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 2,
    });
    geo.translate(0, 0, -0.035);
    return geo;
  }, []);

  // Small collar ring where the bow meets the stem.
  const collarGeometry = useMemo(() => new THREE.TorusGeometry(0.11, 0.035, 16, 40), []);

  // Decorative beads placed on the quatrefoil cusps and lobe tips.
  const beadGeometry = useMemo(() => new THREE.SphereGeometry(0.045, 20, 16), []);
  const tipBeadGeometry = useMemo(() => new THREE.SphereGeometry(0.055, 20, 16), []);

  const bowCenterY = 1.08;
  const cuspPositions: Array<[number, number, number]> = [
    [0.3, bowCenterY + 0.3, 0],
    [-0.3, bowCenterY + 0.3, 0],
    [0.3, bowCenterY - 0.3, 0],
    [-0.3, bowCenterY - 0.3, 0],
  ];
  const tipPositions: Array<[number, number, number]> = [
    [0.6, bowCenterY, 0],
    [-0.6, bowCenterY, 0],
    [0, bowCenterY + 0.6, 0],
  ];

  return (
    <group rotation={[0, rotationY, 0.06]} scale={[scale, scale, scale]}>
      <mesh geometry={bowGeometry} position={[0, bowCenterY, 0]}>
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.18} />
      </mesh>
      <mesh geometry={stemGeometry}>
        <meshStandardMaterial color="#c9a227" metalness={1} roughness={0.22} />
      </mesh>
      <mesh geometry={bitGeometry}>
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
      </mesh>
      <mesh geometry={collarGeometry} position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#e3c05a" metalness={1} roughness={0.15} />
      </mesh>
      {cuspPositions.map((p, i) => (
        <mesh key={`cusp-${i}`} geometry={beadGeometry} position={p}>
          <meshStandardMaterial color="#e3c05a" metalness={1} roughness={0.15} />
        </mesh>
      ))}
      {tipPositions.map((p, i) => (
        <mesh key={`tip-${i}`} geometry={tipBeadGeometry} position={p}>
          <meshStandardMaterial color="#e3c05a" metalness={1} roughness={0.15} />
        </mesh>
      ))}
    </group>
  );
};