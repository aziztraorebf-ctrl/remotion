import React, { useMemo } from 'react';
import * as THREE from 'three';

export const KeyModel: React.FC<{ rotationY: number; scale: number }> = ({ rotationY, scale }) => {
  const headGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 0.5, 0, Math.PI * 2, true);

    const hole1 = new THREE.Path();
    hole1.absarc(0, 0, 0.12, 0, Math.PI * 2, true);
    const hole2 = new THREE.Path();
    hole2.absarc(0.25, 0.25, 0.08, 0, Math.PI * 2, true);
    const hole3 = new THREE.Path();
    hole3.absarc(-0.25, 0.25, 0.08, 0, Math.PI * 2, true);
    const hole4 = new THREE.Path();
    hole4.absarc(0, -0.3, 0.1, 0, Math.PI * 2, true);

    shape.holes.push(hole1, hole2, hole3, hole4);

    const extrudeSettings = {
      depth: 0.15,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 4,
      steps: 1,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  const shaftGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0.0, -0.9));
    points.push(new THREE.Vector2(0.12, -0.9));
    points.push(new THREE.Vector2(0.12, -0.7));
    points.push(new THREE.Vector2(0.18, -0.6));
    points.push(new THREE.Vector2(0.12, -0.5));
    points.push(new THREE.Vector2(0.12, -0.2));
    points.push(new THREE.Vector2(0.16, -0.1));
    points.push(new THREE.Vector2(0.12, 0.0));
    points.push(new THREE.Vector2(0.12, 0.4));
    points.push(new THREE.Vector2(0.16, 0.5));
    points.push(new THREE.Vector2(0.12, 0.6));
    points.push(new THREE.Vector2(0.0, 0.6));

    return new THREE.LatheGeometry(points, 32);
  }, []);

  const teethGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.15, 0);
    shape.lineTo(0.15, 0);
    shape.lineTo(0.15, -0.7);
    shape.lineTo(0.05, -0.7);
    shape.lineTo(0.05, -0.5);
    shape.lineTo(-0.05, -0.5);
    shape.lineTo(-0.05, -0.7);
    shape.lineTo(-0.15, -0.7);
    shape.lineTo(-0.15, -0.3);
    shape.lineTo(-0.08, -0.3);
    shape.lineTo(-0.08, -0.1);
    shape.lineTo(-0.15, -0.1);
    shape.lineTo(-0.15, 0);

    const extrudeSettings = {
      depth: 0.15,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
      steps: 1,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  const tilt = 0.12;

  return (
    <group rotation={[0, rotationY, tilt]} scale={[scale, scale, scale]}>
      <mesh geometry={headGeometry} position={[0, 1.1, 0]}>
        <meshStandardMaterial color="#FFD700" metalness={1.0} roughness={0.25} />
      </mesh>

      <mesh geometry={shaftGeometry}>
        <meshStandardMaterial color="#DAA520" metalness={1.0} roughness={0.35} />
      </mesh>

      <mesh geometry={teethGeometry} position={[0, -0.9, 0]}>
        <meshStandardMaterial color="#FFD700" metalness={1.0} roughness={0.25} />
      </mesh>
    </group>
  );
};