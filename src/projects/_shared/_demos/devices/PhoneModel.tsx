/**
 * PhoneModel — modern flagship smartphone mockup, fully procedural geometry.
 *
 * Design notes:
 * - BODY: one ExtrudeGeometry of a rounded rectangle with a generous bevel
 *   (bevelSegments 5). The bevel is what creates the chamfered metal edge
 *   that catches light at every angle — this is the "premium vs toy" cue.
 *   Caps and side walls share a dark titanium-like frame material.
 * - FRONT GLASS / BACK PLATE: a single thin rounded-rect ExtrudeGeometry
 *   reused for two meshes (front cover glass, satin back plate). Both are
 *   slightly smaller than the body footprint, so a thin metal frame ring
 *   stays visible around them — the classic sandwich silhouette.
 * - SCREEN: a flat rectangular PlaneGeometry facing +Z, floating 3/1000 of
 *   a unit above the cover glass (no z-fighting, negligible parallax).
 *   This plane is the UI landing zone (see SCREEN CONTRACT below).
 * - Signature details: power button (+X side), two volume buttons (-X side),
 *   punch-hole front camera (top-center, sits ABOVE the screen plane like a
 *   real cutout), rear camera island (rounded plate + 2 diagonal lens stacks
 *   + flash + mic dot) protruding from the back, visible while rotating.
 * - All silhouettes checked at rotationY = -0.2 / 0.35 / 0.85 / 1.4 rad:
 *   near-profile (1.4) still reads thanks to the chamfered frame highlight,
 *   the side buttons and the camera island bump.
 *
 * BOUNDS (real, measured from the constants below):
 *   x in [-0.778, 0.778]  (0.76 body + button protrusion)
 *   y in [-1.60, 1.60]    (height 3.2, centered on origin)
 *   z in [-0.158, 0.108]  (camera lens tip -> punch-hole camera front)
 *
 * SCREEN CONTRACT (the UI landing zone):
 *   - Plane: width SCREEN_W = 1.39, height SCREEN_H = 3.012 (ratio 19.5:9),
 *     centered at (0, 0), facing +Z, at z = SCREEN_Z = 0.106 exactly.
 *   - The mesh is named "phone-screen-plane" for programmatic lookup.
 *   - `screen` prop: pass a react-three-fiber MATERIAL element, e.g.
 *       <PhoneModel screen={<meshBasicMaterial map={uiTexture} toneMapped={false} />} ... />
 *     It is rendered as the child of the screen mesh, replacing the default
 *     deep-black glossy material.
 *   WHY this route instead of drei <Html>: Html is a DOM overlay composited
 *   OUTSIDE the WebGL canvas. It does not occlude (the phone edge cannot
 *   hide it when rotated near profile), receives no lighting, and its CSS
 *   transform is resynchronized after the three frame — a known source of
 *   one-frame misalignment in deterministic headless Remotion captures.
 *   A material on a bare mesh stays entirely in-canvas: correct occlusion
 *   at all 4 reference angles, deterministic, and trivially replaceable
 *   with a texture from useTexture / useVideoTexture / RenderTexture.
 *
 * No lights, no camera, no animation — rotation comes from the rotationY prop.
 */

import React, { useMemo } from "react";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Helpers (module scope, deterministic)
// ---------------------------------------------------------------------------

/** Rounded-rectangle shape centered on the origin, corner radius r. */
const roundedRectShape = (w: number, h: number, r: number): THREE.Shape => {
  const hw = w / 2;
  const hh = h / 2;
  const s = new THREE.Shape();
  s.moveTo(-hw + r, -hh);
  s.lineTo(hw - r, -hh);
  s.absarc(hw - r, -hh + r, r, -Math.PI / 2, 0, false);
  s.lineTo(hw, hh - r);
  s.absarc(hw - r, hh - r, r, 0, Math.PI / 2, false);
  s.lineTo(-hw + r, hh);
  s.absarc(-hw + r, hh - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(-hw, -hh + r);
  s.absarc(-hw + r, -hh + r, r, Math.PI, Math.PI * 1.5, false);
  s.closePath();
  return s;
};

// ---------------------------------------------------------------------------
// Dimension constants (single source of truth for the documented bounds)
// ---------------------------------------------------------------------------

// Body: final outer size 1.52 x 3.20 x 0.17 (bevel expands the shape by
// BODY_BEVEL on each side in XY and Z, so the raw shape is shrunk to match).
const BODY_W = 1.52;
const BODY_H = 3.2;
const BODY_DEPTH = 0.1; // straight extrusion, bevels add 0.035 per side -> 0.17
const BODY_BEVEL = 0.035;
const BODY_CORNER_R = 0.17;

// Front glass / back plate: final 1.452 x 3.132, thickness 0.024.
const PLATE_W = 1.44;
const PLATE_H = 3.12;
const PLATE_DEPTH = 0.012;
const PLATE_BEVEL = 0.006;
const PLATE_CORNER_R = 0.13;
const GLASS_Z = 0.091; // front glass spans z [0.079, 0.103]
const BACK_Z = -0.091; // back plate spans z [-0.103, -0.079]

// Screen landing zone (see SCREEN CONTRACT in the header).
const SCREEN_W = 1.39;
const SCREEN_H = 3.012; // 3.012 / 1.39 = 2.167 = 19.5:9
const SCREEN_Z = 0.106;

// Punch-hole front camera.
const PUNCH_Y = 1.42;
const PUNCH_R = 0.03;

// Rear camera island: final 0.60 x 0.60 plate, thickness 0.034,
// spanning z [-0.135, -0.101] (embedded into the back plate).
const ISLAND_SIZE = 0.584;
const ISLAND_DEPTH = 0.018;
const ISLAND_BEVEL = 0.008;
const ISLAND_CORNER_R = 0.17;
const ISLAND_X = -0.36;
const ISLAND_Y = 1.08;
const ISLAND_Z = -0.118;

// Two diagonal lens stacks + flash + mic dot inside the island.
const LENS_POSITIONS: Array<[number, number]> = [
  [-0.475, 1.195],
  [-0.245, 0.965],
];
const FLASH_POS: [number, number] = [-0.245, 1.195];
const MIC_POS: [number, number] = [-0.475, 0.965];

// ---------------------------------------------------------------------------
// Materials (plain prop objects, shared across meshes like KeyModelA)
// ---------------------------------------------------------------------------

const frameMetal = {
  color: "#4a4d54",
  metalness: 0.92,
  roughness: 0.28,
  emissive: "#14161a",
  emissiveIntensity: 0.3,
};
const backSatin = {
  color: "#26282e",
  metalness: 0.7,
  roughness: 0.42,
  emissive: "#101216",
  emissiveIntensity: 0.25,
};
const coverGlass = {
  color: "#07080a",
  metalness: 0.5,
  roughness: 0.18,
};
const screenOff = {
  color: "#020304",
  metalness: 0.55,
  roughness: 0.09,
};
const islandSatin = {
  color: "#2b2d33",
  metalness: 0.75,
  roughness: 0.38,
  emissive: "#101216",
  emissiveIntensity: 0.25,
};
const buttonMetal = {
  color: "#585b63",
  metalness: 0.92,
  roughness: 0.24,
};
const lensGlass = {
  color: "#10141f",
  metalness: 0.4,
  roughness: 0.08,
};
const lensPupil = {
  color: "#05070c",
  metalness: 0.3,
  roughness: 0.05,
};
const flashTint = {
  color: "#d8d2b8",
  metalness: 0.1,
  roughness: 0.3,
  emissive: "#6b6244",
  emissiveIntensity: 0.25,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const PhoneModel: React.FC<{
  rotationY: number;
  scale: number;
  screen?: React.ReactNode;
}> = ({ rotationY, scale, screen }) => {
  const bodyGeometry = useMemo(() => {
    const shape = roundedRectShape(
      BODY_W - 2 * BODY_BEVEL,
      BODY_H - 2 * BODY_BEVEL,
      BODY_CORNER_R
    );
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: BODY_DEPTH,
      bevelEnabled: true,
      bevelThickness: BODY_BEVEL,
      bevelSize: BODY_BEVEL,
      bevelSegments: 5,
      curveSegments: 24,
    });
    // Shape is XY-symmetric: center() puts the extrusion mid-plane on z=0
    geo.center();
    return geo;
  }, []);

  // One thin rounded plate, centered on z=0, reused for glass front and
  // satin back (two meshes, two materials, mirrored positions).
  const plateGeometry = useMemo(() => {
    const shape = roundedRectShape(PLATE_W, PLATE_H, PLATE_CORNER_R);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: PLATE_DEPTH,
      bevelEnabled: true,
      bevelThickness: PLATE_BEVEL,
      bevelSize: PLATE_BEVEL,
      bevelSegments: 2,
      curveSegments: 24,
    });
    geo.center();
    return geo;
  }, []);

  const islandGeometry = useMemo(() => {
    const shape = roundedRectShape(ISLAND_SIZE, ISLAND_SIZE, ISLAND_CORNER_R);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: ISLAND_DEPTH,
      bevelEnabled: true,
      bevelThickness: ISLAND_BEVEL,
      bevelSize: ISLAND_BEVEL,
      bevelSegments: 3,
      curveSegments: 20,
    });
    geo.center();
    return geo;
  }, []);

  return (
    <group rotation={[0, rotationY, 0]} scale={[scale, scale, scale]}>
      {/* BODY - chamfered rounded slab, dark titanium frame */}
      <mesh geometry={bodyGeometry}>
        <meshStandardMaterial {...frameMetal} />
      </mesh>

      {/* FRONT COVER GLASS - slightly smaller than the body, leaves a thin
          metal ring visible around it */}
      <mesh geometry={plateGeometry} position={[0, 0, GLASS_Z]}>
        <meshStandardMaterial {...coverGlass} />
      </mesh>

      {/* BACK PLATE - satin, visibly different from the frame when rotating */}
      <mesh geometry={plateGeometry} position={[0, 0, BACK_Z]}>
        <meshStandardMaterial {...backSatin} />
      </mesh>

      {/* SCREEN - the UI landing zone (see SCREEN CONTRACT in the header).
          Bare rectangular plane facing +Z at a documented z. If `screen` is
          provided it must be a r3f MATERIAL element and replaces the default
          deep-black glossy material. Kept in-canvas on purpose: correct
          occlusion and lighting at every angle, deterministic in headless
          Remotion renders (unlike a drei Html DOM overlay). */}
      <mesh name="phone-screen-plane" position={[0, 0, SCREEN_Z]}>
        <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        {screen ?? <meshStandardMaterial {...screenOff} />}
      </mesh>

      {/* PUNCH-HOLE front camera - sits just above the screen plane, like a
          real display cutout overlaying the UI */}
      <mesh position={[0, PUNCH_Y, SCREEN_Z - 0.002]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[PUNCH_R, PUNCH_R, 0.008, 24]} />
        <meshStandardMaterial {...lensPupil} />
      </mesh>

      {/* POWER BUTTON (+X side) - flattened capsule, protrudes ~0.018 */}
      <mesh position={[0.762, 0.55, 0]} scale={[0.6, 1, 1]}>
        <capsuleGeometry args={[0.03, 0.28, 4, 12]} />
        <meshStandardMaterial {...buttonMetal} />
      </mesh>

      {/* VOLUME BUTTONS (-X side) - two shorter capsules */}
      {[0.8, 0.55].map((y) => (
        <mesh key={y} position={[-0.762, y, 0]} scale={[0.6, 1, 1]}>
          <capsuleGeometry args={[0.03, 0.14, 4, 12]} />
          <meshStandardMaterial {...buttonMetal} />
        </mesh>
      ))}

      {/* REAR CAMERA ISLAND - rounded plate proud of the back plate */}
      <mesh
        geometry={islandGeometry}
        position={[ISLAND_X, ISLAND_Y, ISLAND_Z]}
      >
        <meshStandardMaterial {...islandSatin} />
      </mesh>

      {/* Lens stacks: metal rim + recessed dark glass + pupil disc */}
      {LENS_POSITIONS.map(([lx, ly]) => (
        <group key={`${lx}-${ly}`} position={[lx, ly, 0]}>
          <mesh position={[0, 0, -0.143]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.026, 32]} />
            <meshStandardMaterial {...frameMetal} />
          </mesh>
          <mesh position={[0, 0, -0.154]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.072, 0.072, 0.006, 32]} />
            <meshStandardMaterial {...lensGlass} />
          </mesh>
          <mesh position={[0, 0, -0.1578]} rotation={[0, Math.PI, 0]}>
            <circleGeometry args={[0.032, 24]} />
            <meshStandardMaterial {...lensPupil} />
          </mesh>
        </group>
      ))}

      {/* Flash + microphone dot on the island */}
      <mesh
        position={[FLASH_POS[0], FLASH_POS[1], -0.137]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.032, 0.032, 0.006, 20]} />
        <meshStandardMaterial {...flashTint} />
      </mesh>
      <mesh
        position={[MIC_POS[0], MIC_POS[1], -0.137]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.014, 0.014, 0.006, 12]} />
        <meshStandardMaterial {...lensPupil} />
      </mesh>
    </group>
  );
};
