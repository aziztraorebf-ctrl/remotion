/**
 * PhoneModelVision - iPhone-Pro-class smartphone mockup, procedural geometry,
 * modeled from OBSERVATION of a reference frame (SaaS explainer "Comma",
 * ref_8.0s.jpg) instead of from memory. Companion lighting rig deduced from
 * the same frame lives in VisionLights.tsx - this file stays light-free.
 *
 * WHAT THE REFERENCE SHOWS (geometry takeaways, measured on the frame):
 * - FLAT RAIL chassis (iPhone 14/15 Pro style): the side walls read as one
 *   flat band with a crisp chamfer line top and bottom, NOT a continuously
 *   curved bevel. Modeled as a deeper straight extrusion (0.12) with a
 *   SMALL bevel (0.022) so the rail stays flat and the chamfer is a thin
 *   discrete edge that catches the key light as a 1-2px line.
 * - LARGE corner radius: the body corner arc spans ~60px on a ~420px wide
 *   phone -> r ~ 0.14 x width -> 0.24 world units here.
 * - THIN UNIFORM BEZEL: the black ring between chassis and UI is ~8px on
 *   408px of screen width -> ~0.028 units, identical on all 4 sides.
 * - DYNAMIC ISLAND: black capsule floating inside the screen top, width
 *   ~0.41 x screen width (168px / 408px measured), height ~0.12 units,
 *   center ~0.09 units below the screen top edge. Sits ABOVE the screen
 *   plane like a real cutout overlaying whatever UI is displayed.
 * - Buttons: power rail on +X, action + two volume buttons on -X (visible
 *   in the reference as small specular glints on the left rail).
 * - Back is never seen in the reference; a restrained iPhone-style square
 *   camera plateau with a diagonal twin-lens stack keeps the silhouette
 *   honest at near-profile angles without inventing detail.
 *
 * BOUNDS (real, derived from the constants below):
 *   x in [-0.787, 0.787]  (0.775 body half-width + 0.012 button protrusion)
 *   y in [-1.60, 1.60]    (total height 3.2, centered on origin)
 *   z in [-0.157, 0.109]  (rear lens tip -> Dynamic Island front face)
 *
 * SCREEN CONTRACT (the UI landing zone):
 *   - Rectangular plane facing +Z, width SCREEN_W = 1.41, height
 *     SCREEN_H = 3.055 (19.5:9), centered at (0, 0), z = SCREEN_Z = 0.105.
 *   - Mesh is named "phone-screen-plane" for programmatic lookup.
 *   - `screen` prop: a react-three-fiber MATERIAL element, e.g.
 *       <PhoneModelVision screen={<meshBasicMaterial map={tex} toneMapped={false} />} ... />
 *     rendered as the child of the screen mesh, replacing the default
 *     off-black glossy material. Kept in-canvas (no drei Html) so occlusion
 *     and determinism hold at every rotation angle in headless renders.
 *   - The Dynamic Island is drawn at z = SCREEN_Z + 0.004 and will overlay
 *     the provided UI exactly like a real display cutout.
 *
 * Verified silhouettes at rotationY = -0.2 / 0.35 / 0.85 / 1.4 rad: the
 * flat rail + chamfer line, side buttons and rear plateau keep the object
 * readable at near-profile.
 *
 * No lights, no camera, no animation - rotation comes from the rotationY
 * prop only. Fully deterministic: no Math.random, no Date.now, geometry
 * memoised once.
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

// Body: final outer size 1.55 x 3.20 x 0.164. iPhone 15 Pro aspect ratio
// (71.6 / 147.6 mm = 0.485 -> width 1.552 for height 3.2). The straight
// extrusion dominates (flat rail); the small bevel is the crisp chamfer.
const BODY_W = 1.55;
const BODY_H = 3.2;
const BODY_DEPTH = 0.12; // flat rail band
const BODY_BEVEL = 0.022; // thin chamfer, adds 0.022 per side -> depth 0.164
const BODY_CORNER_R = 0.24; // large iPhone-class corner (measured ~0.14 x W)

// Front glass / back plate: 1.494 x 3.144, thickness 0.024. Slightly inset
// from the body so a thin rail ring stays visible around the glass.
const PLATE_W = 1.482;
const PLATE_H = 3.132;
const PLATE_DEPTH = 0.012;
const PLATE_BEVEL = 0.006;
const PLATE_CORNER_R = 0.21;
const GLASS_Z = 0.09; // front glass spans z [0.078, 0.102]
const BACK_Z = -0.09; // back plate spans z [-0.102, -0.078]

// Screen landing zone (see SCREEN CONTRACT). Bezel = (1.55 - 1.41) / 2
// - rail ring ~= 0.028 visible black border, uniform on all sides.
const SCREEN_W = 1.41;
const SCREEN_H = 3.055; // 3.055 / 1.41 = 2.167 = 19.5:9
const SCREEN_Z = 0.105;

// Dynamic Island: black capsule inside the screen, near the top edge.
// Measured on the reference: width 0.41 x screen width, height ~0.12,
// center 0.09 below the screen top (screen top y = +1.5275).
const DI_W = 0.58;
const DI_H = 0.124;
const DI_Y = 1.437;
const DI_Z = SCREEN_Z + 0.004; // overlays the UI like a real cutout
// Front camera lens: subtle darker disc at the right end of the island.
const DI_LENS_X = DI_W / 2 - DI_H / 2;
const DI_LENS_R = 0.038;

// Rear camera plateau: square rounded plate, top-left of the back,
// proud of the back plate; twin diagonal lens stack + flash.
const ISLAND_SIZE = 0.62;
const ISLAND_DEPTH = 0.02;
const ISLAND_BEVEL = 0.008;
const ISLAND_CORNER_R = 0.19;
const ISLAND_X = -0.36;
const ISLAND_Y = 1.06;
const ISLAND_Z = -0.12; // spans z [-0.138, -0.102]

const LENS_POSITIONS: Array<[number, number]> = [
  [-0.49, 1.19],
  [-0.23, 0.93],
];
const FLASH_POS: [number, number] = [-0.23, 1.19];
const MIC_POS: [number, number] = [-0.49, 0.93];

// Side buttons. Power on +X; action + 2 volume buttons on -X (iPhone
// layout as seen from the front). Capsules flattened on X, protruding
// 0.012 beyond the 0.775 half-width.
const RAIL_X = BODY_W / 2 - 0.003;
const BUTTON_R = 0.028;

// ---------------------------------------------------------------------------
// Materials (plain prop objects shared across meshes)
// ---------------------------------------------------------------------------
// The reference chassis reads NEAR-BLACK where unlit (13-33 / 255 against a
// 16/255 background): the frame must be allowed to fall to silhouette, so
// NO emissive on the rail (an emissive floor would flatten the studio look).

const railMetal = {
  color: "#26272a",
  metalness: 0.9,
  roughness: 0.32,
};
const backSatin = {
  color: "#1b1c1f",
  metalness: 0.65,
  roughness: 0.5,
};
const coverGlass = {
  color: "#060708",
  metalness: 0.5,
  roughness: 0.15,
};
const screenOff = {
  color: "#020304",
  metalness: 0.55,
  roughness: 0.08,
};
const islandBlack = {
  // Dynamic Island: dead matte black, must stay darker than any lit UI
  color: "#000000",
  metalness: 0.0,
  roughness: 0.9,
};
const plateauSatin = {
  color: "#222327",
  metalness: 0.7,
  roughness: 0.45,
};
const buttonMetal = {
  // Slightly lighter than the rail: the reference shows small hard glints
  // (181-234 / 255) exactly where the buttons break the rail line.
  color: "#3a3c40",
  metalness: 0.92,
  roughness: 0.22,
};
const lensGlass = {
  color: "#0e1218",
  metalness: 0.4,
  roughness: 0.08,
};
const lensPupil = {
  color: "#04060a",
  metalness: 0.3,
  roughness: 0.05,
};
const flashTint = {
  color: "#d8d2b8",
  metalness: 0.1,
  roughness: 0.3,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const PhoneModelVision: React.FC<{
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
      bevelSegments: 3, // few segments -> crisp chamfer line, not a soft roll
      curveSegments: 28,
    });
    // Shape is XY-symmetric: center() puts the extrusion mid-plane on z=0
    geo.center();
    return geo;
  }, []);

  // One thin rounded plate reused for glass front and satin back.
  const plateGeometry = useMemo(() => {
    const shape = roundedRectShape(PLATE_W, PLATE_H, PLATE_CORNER_R);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: PLATE_DEPTH,
      bevelEnabled: true,
      bevelThickness: PLATE_BEVEL,
      bevelSize: PLATE_BEVEL,
      bevelSegments: 2,
      curveSegments: 28,
    });
    geo.center();
    return geo;
  }, []);

  // Dynamic Island: flat capsule (rounded rect with r = h/2), no depth
  // needed - it reads as a pure black cutout at every reference angle.
  const islandShapeGeometry = useMemo(() => {
    const shape = roundedRectShape(DI_W, DI_H, DI_H / 2 - 0.001);
    return new THREE.ShapeGeometry(shape, 24);
  }, []);

  const plateauGeometry = useMemo(() => {
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
      {/* BODY - flat titanium rail with a crisp chamfer line */}
      <mesh geometry={bodyGeometry}>
        <meshStandardMaterial {...railMetal} />
      </mesh>

      {/* FRONT COVER GLASS - inset, leaves the rail ring visible */}
      <mesh geometry={plateGeometry} position={[0, 0, GLASS_Z]}>
        <meshStandardMaterial {...coverGlass} />
      </mesh>

      {/* BACK PLATE - satin matte, darker than the rail */}
      <mesh geometry={plateGeometry} position={[0, 0, BACK_Z]}>
        <meshStandardMaterial {...backSatin} />
      </mesh>

      {/* SCREEN - the UI landing zone (see SCREEN CONTRACT). `screen` must
          be a r3f MATERIAL element; it replaces the default off-black
          glossy material and is occluded correctly at all angles. */}
      <mesh name="phone-screen-plane" position={[0, 0, SCREEN_Z]}>
        <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        {screen ?? <meshStandardMaterial {...screenOff} />}
      </mesh>

      {/* DYNAMIC ISLAND - black capsule overlaying the UI near the screen
          top, exactly like the reference frame (not a punch hole) */}
      <mesh geometry={islandShapeGeometry} position={[0, DI_Y, DI_Z]}>
        <meshStandardMaterial {...islandBlack} />
      </mesh>
      {/* Front camera lens hinted at the right end of the island */}
      <mesh position={[DI_LENS_X, DI_Y, DI_Z + 0.001]}>
        <circleGeometry args={[DI_LENS_R, 20]} />
        <meshStandardMaterial {...lensPupil} />
      </mesh>

      {/* POWER BUTTON (+X rail) - flattened capsule */}
      <mesh position={[RAIL_X, 0.5, 0]} scale={[0.55, 1, 1]}>
        <capsuleGeometry args={[BUTTON_R, 0.3, 4, 12]} />
        <meshStandardMaterial {...buttonMetal} />
      </mesh>

      {/* ACTION + VOLUME BUTTONS (-X rail) - one short, two medium */}
      <mesh position={[-RAIL_X, 1.02, 0]} scale={[0.55, 1, 1]}>
        <capsuleGeometry args={[BUTTON_R, 0.06, 4, 12]} />
        <meshStandardMaterial {...buttonMetal} />
      </mesh>
      {[0.72, 0.44].map((y) => (
        <mesh key={y} position={[-RAIL_X, y, 0]} scale={[0.55, 1, 1]}>
          <capsuleGeometry args={[BUTTON_R, 0.16, 4, 12]} />
          <meshStandardMaterial {...buttonMetal} />
        </mesh>
      ))}

      {/* REAR CAMERA PLATEAU - proud of the back plate */}
      <mesh geometry={plateauGeometry} position={[ISLAND_X, ISLAND_Y, ISLAND_Z]}>
        <meshStandardMaterial {...plateauSatin} />
      </mesh>

      {/* Lens stacks: metal rim + recessed dark glass + pupil disc */}
      {LENS_POSITIONS.map(([lx, ly]) => (
        <group key={`${lx}-${ly}`} position={[lx, ly, 0]}>
          <mesh position={[0, 0, -0.144]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.024, 32]} />
            <meshStandardMaterial {...railMetal} />
          </mesh>
          <mesh position={[0, 0, -0.153]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.006, 32]} />
            <meshStandardMaterial {...lensGlass} />
          </mesh>
          <mesh position={[0, 0, -0.1565]} rotation={[0, Math.PI, 0]}>
            <circleGeometry args={[0.03, 24]} />
            <meshStandardMaterial {...lensPupil} />
          </mesh>
        </group>
      ))}

      {/* Flash + microphone dot on the plateau */}
      <mesh
        position={[FLASH_POS[0], FLASH_POS[1], -0.14]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.032, 0.032, 0.006, 20]} />
        <meshStandardMaterial {...flashTint} />
      </mesh>
      <mesh
        position={[MIC_POS[0], MIC_POS[1], -0.14]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.014, 0.014, 0.006, 12]} />
        <meshStandardMaterial {...lensPupil} />
      </mesh>
    </group>
  );
};
