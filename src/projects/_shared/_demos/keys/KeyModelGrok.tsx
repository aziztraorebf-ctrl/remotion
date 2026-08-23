import React, { useMemo } from "react";
import * as THREE from "three";

const BOW_Y = 1.04;
const TILT_Z = 0.12;

const addFlower = (
  path: THREE.Path,
  radius: number,
  lobe: number,
  segments: number
): void => {
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    const r = radius + lobe * Math.cos(4 * t);
    const x = r * Math.sin(t);
    const y = r * Math.cos(t);
    if (i === 0) {
      path.moveTo(x, y);
    } else {
      path.lineTo(x, y);
    }
  }
};

const makeVolute = (sign: number): THREE.TubeGeometry => {
  const pts: THREE.Vector3[] = [];
  const count = 48;
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    const spiral = t * Math.PI * 2.35;
    const decay = 0.132 * (1 - t * 0.62);
    const x = sign * (0.2 + decay * Math.cos(spiral + 0.55) + 0.05 * t);
    const y = 0.62 - t * 0.2 + decay * Math.sin(spiral + 0.55);
    const z = 0.035 * Math.sin(t * Math.PI);
    pts.push(new THREE.Vector3(x, y, z));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  return new THREE.TubeGeometry(curve, 56, 0.017, 8, false);
};

const makeHelix = (phase: number): THREE.TubeGeometry => {
  const pts: THREE.Vector3[] = [];
  const count = 80;
  const y0 = -0.28;
  const y1 = 0.145;
  const radius = 0.076;
  const turns = 4.25;
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    const a = phase + t * turns * Math.PI * 2;
    pts.push(
      new THREE.Vector3(Math.cos(a) * radius, y0 + t * (y1 - y0), Math.sin(a) * radius)
    );
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  return new THREE.TubeGeometry(curve, 80, 0.011, 7, false);
};

const makeRimTube = (
  radius: number,
  lobe: number,
  tube: number,
  y: number
): THREE.TubeGeometry => {
  const pts: THREE.Vector3[] = [];
  const count = 128;
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const r = radius + lobe * Math.cos(4 * t);
    pts.push(new THREE.Vector3(r * Math.sin(t), y + r * Math.cos(t), 0));
  }
  const curve = new THREE.CatmullRomCurve3(pts, true);
  return new THREE.TubeGeometry(curve, 128, tube, 8, true);
};

export const KeyModel: React.FC<{ rotationY: number; scale: number }> = ({
  rotationY,
  scale,
}) => {
  const materials = useMemo(() => {
    const gold = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#c9a227"),
      metalness: 0.93,
      roughness: 0.16,
    });
    const goldDeep = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#b08a1e"),
      metalness: 0.88,
      roughness: 0.26,
    });
    const goldBright = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#e2c34a"),
      metalness: 0.96,
      roughness: 0.09,
    });
    return { gold, goldDeep, goldBright };
  }, []);

  const geo = useMemo(() => {
    const bowShape = new THREE.Shape();
    addFlower(bowShape, 0.4, 0.12, 160);
    const bowHole = new THREE.Path();
    addFlower(bowHole, 0.185, 0.068, 128);
    bowShape.holes.push(bowHole);

    const bow = new THREE.ExtrudeGeometry(bowShape, {
      depth: 0.15,
      bevelEnabled: true,
      bevelThickness: 0.022,
      bevelSize: 0.016,
      bevelSegments: 4,
      curveSegments: 1,
    });
    bow.translate(0, 0, -0.075);

    const outerRim = makeRimTube(0.4, 0.12, 0.026, BOW_Y);
    const innerRim = makeRimTube(0.185, 0.068, 0.014, BOW_Y);

    const shaftProfile: THREE.Vector2[] = [
      new THREE.Vector2(0.208, 0.635),
      new THREE.Vector2(0.188, 0.618),
      new THREE.Vector2(0.142, 0.592),
      new THREE.Vector2(0.116, 0.572),
      new THREE.Vector2(0.128, 0.556),
      new THREE.Vector2(0.158, 0.54),
      new THREE.Vector2(0.162, 0.526),
      new THREE.Vector2(0.118, 0.51),
      new THREE.Vector2(0.098, 0.488),
      new THREE.Vector2(0.148, 0.468),
      new THREE.Vector2(0.156, 0.452),
      new THREE.Vector2(0.148, 0.438),
      new THREE.Vector2(0.094, 0.418),
      new THREE.Vector2(0.082, 0.378),
      new THREE.Vector2(0.08, 0.342),
      new THREE.Vector2(0.128, 0.324),
      new THREE.Vector2(0.132, 0.31),
      new THREE.Vector2(0.098, 0.296),
      new THREE.Vector2(0.076, 0.268),
      new THREE.Vector2(0.072, 0.155),
      new THREE.Vector2(0.07, 0.02),
      new THREE.Vector2(0.068, -0.155),
      new THREE.Vector2(0.07, -0.295),
      new THREE.Vector2(0.11, -0.322),
      new THREE.Vector2(0.12, -0.338),
      new THREE.Vector2(0.108, -0.354),
      new THREE.Vector2(0.074, -0.372),
      new THREE.Vector2(0.072, -0.438),
      new THREE.Vector2(0.102, -0.466),
      new THREE.Vector2(0.148, -0.486),
      new THREE.Vector2(0.158, -0.502),
      new THREE.Vector2(0.138, -0.516),
      new THREE.Vector2(0.078, -0.528),
      new THREE.Vector2(0.052, -0.54),
      new THREE.Vector2(0.05, -0.72),
      new THREE.Vector2(0.05, -1.12),
      new THREE.Vector2(0.05, -1.5),
      new THREE.Vector2(0.058, -1.545),
      new THREE.Vector2(0.036, -1.575),
      new THREE.Vector2(0.002, -1.6),
    ];
    const shaft = new THREE.LatheGeometry(shaftProfile, 64);

    const bitShape = new THREE.Shape();
    bitShape.moveTo(0.035, -0.515);
    bitShape.lineTo(0.555, -0.515);
    bitShape.lineTo(0.555, -0.638);
    bitShape.lineTo(0.292, -0.638);
    bitShape.lineTo(0.292, -0.742);
    bitShape.lineTo(0.555, -0.742);
    bitShape.lineTo(0.555, -0.895);
    bitShape.lineTo(0.198, -0.895);
    bitShape.lineTo(0.198, -1.038);
    bitShape.lineTo(0.555, -1.038);
    bitShape.lineTo(0.555, -1.155);
    bitShape.lineTo(0.372, -1.155);
    bitShape.lineTo(0.372, -1.258);
    bitShape.lineTo(0.555, -1.258);
    bitShape.lineTo(0.555, -1.405);
    bitShape.lineTo(0.248, -1.405);
    bitShape.lineTo(0.248, -1.508);
    bitShape.lineTo(0.555, -1.508);
    bitShape.lineTo(0.555, -1.595);
    bitShape.lineTo(0.035, -1.595);
    bitShape.lineTo(0.035, -1.338);
    bitShape.lineTo(0.162, -1.338);
    bitShape.lineTo(0.162, -1.198);
    bitShape.lineTo(0.035, -1.198);
    bitShape.closePath();

    const bit = new THREE.ExtrudeGeometry(bitShape, {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.011,
      bevelSize: 0.009,
      bevelSegments: 2,
    });
    bit.translate(0, 0, -0.05);

    const wardShape = new THREE.Shape();
    wardShape.moveTo(0.08, -0.6);
    wardShape.lineTo(0.43, -0.6);
    wardShape.lineTo(0.43, -0.86);
    wardShape.lineTo(0.236, -0.86);
    wardShape.lineTo(0.236, -1.07);
    wardShape.lineTo(0.43, -1.07);
    wardShape.lineTo(0.43, -1.47);
    wardShape.lineTo(0.08, -1.47);
    wardShape.closePath();

    const ward = new THREE.ExtrudeGeometry(wardShape, {
      depth: 0.168,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.007,
      bevelSegments: 2,
    });
    ward.translate(0, 0, -0.084);

    const finialProfile: THREE.Vector2[] = [
      new THREE.Vector2(0.002, 1.545),
      new THREE.Vector2(0.028, 1.552),
      new THREE.Vector2(0.046, 1.568),
      new THREE.Vector2(0.05, 1.586),
      new THREE.Vector2(0.038, 1.605),
      new THREE.Vector2(0.018, 1.622),
      new THREE.Vector2(0.002, 1.635),
    ];
    const finial = new THREE.LatheGeometry(finialProfile, 32);

    const hub = new THREE.TorusGeometry(0.058, 0.015, 12, 28);
    const jewel = new THREE.IcosahedronGeometry(0.038, 1);
    const bead = new THREE.SphereGeometry(0.04, 20, 16);
    const smallBead = new THREE.SphereGeometry(0.022, 14, 12);
    const spoke = new THREE.BoxGeometry(0.022, 0.155, 0.022);
    const collar = new THREE.TorusGeometry(0.122, 0.018, 10, 28);
    const collarSmall = new THREE.TorusGeometry(0.09, 0.014, 10, 24);

    const voluteL = makeVolute(-1);
    const voluteR = makeVolute(1);
    const helixA = makeHelix(0);
    const helixB = makeHelix(Math.PI);

    return {
      bow,
      outerRim,
      innerRim,
      shaft,
      bit,
      ward,
      finial,
      hub,
      jewel,
      bead,
      smallBead,
      spoke,
      collar,
      collarSmall,
      voluteL,
      voluteR,
      helixA,
      helixB,
    };
  }, []);

  const lobeBeads = useMemo(() => {
    const items: { x: number; y: number }[] = [];
    for (let k = 0; k < 4; k++) {
      const t = (k * Math.PI) / 2;
      const r = 0.4 + 0.12;
      items.push({
        x: r * Math.sin(t),
        y: BOW_Y + r * Math.cos(t),
      });
    }
    return items;
  }, []);

  return (
    <group rotation={[0, rotationY, TILT_Z]} scale={[scale, scale, scale]}>
      <mesh
        geometry={geo.bow}
        material={materials.gold}
        position={[0, BOW_Y, 0]}
        castShadow
      />
      <mesh geometry={geo.outerRim} material={materials.goldBright} castShadow />
      <mesh geometry={geo.innerRim} material={materials.goldDeep} castShadow />
      <mesh geometry={geo.shaft} material={materials.gold} castShadow />
      <mesh geometry={geo.bit} material={materials.goldDeep} castShadow />
      <mesh geometry={geo.ward} material={materials.gold} castShadow />
      <mesh geometry={geo.finial} material={materials.goldBright} castShadow />
      <mesh geometry={geo.voluteL} material={materials.goldBright} castShadow />
      <mesh geometry={geo.voluteR} material={materials.goldBright} castShadow />
      <mesh geometry={geo.helixA} material={materials.goldDeep} castShadow />
      <mesh geometry={geo.helixB} material={materials.goldDeep} castShadow />

      <mesh
        geometry={geo.hub}
        material={materials.goldBright}
        position={[0, BOW_Y, 0]}
        castShadow
      />
      <mesh
        geometry={geo.jewel}
        material={materials.goldBright}
        position={[0, BOW_Y, 0]}
        castShadow
      />

      <mesh
        geometry={geo.spoke}
        material={materials.gold}
        position={[0, BOW_Y + 0.078, 0]}
        castShadow
      />
      <mesh
        geometry={geo.spoke}
        material={materials.gold}
        position={[0, BOW_Y - 0.078, 0]}
        castShadow
      />
      <mesh
        geometry={geo.spoke}
        material={materials.gold}
        position={[0.078, BOW_Y, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      />
      <mesh
        geometry={geo.spoke}
        material={materials.gold}
        position={[-0.078, BOW_Y, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      />

      {lobeBeads.map((p, i) => (
        <mesh
          key={`lobe-${p.x.toFixed(3)}-${p.y.toFixed(3)}`}
          geometry={geo.bead}
          material={materials.goldBright}
          position={[p.x, p.y, 0]}
          castShadow
        />
      ))}

      <mesh
        geometry={geo.smallBead}
        material={materials.goldBright}
        position={[-0.17, 0.455, 0.02]}
        castShadow
      />
      <mesh
        geometry={geo.smallBead}
        material={materials.goldBright}
        position={[0.17, 0.455, 0.02]}
        castShadow
      />

      <mesh
        geometry={geo.collar}
        material={materials.goldBright}
        position={[0, 0.332, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      />
      <mesh
        geometry={geo.collarSmall}
        material={materials.goldBright}
        position={[0, -0.338, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      />
      <mesh
        geometry={geo.collarSmall}
        material={materials.gold}
        position={[0, -0.5, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      />
    </group>
  );
};