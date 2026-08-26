/**
 * LaptopModel - premium thin laptop mockup, fully procedural geometry.
 *
 * Design notes:
 * - BASE: one ExtrudeGeometry from a rounded-rect plan, extruded through the
 *   chassis thickness with a single-segment bevel on both faces. A 1-segment
 *   bevel is a flat 45deg facet, i.e. a crisp CHAMFER that catches light as a
 *   bright rim line (2+ segments would round it off and read "toy"). The deep
 *   bottom chamfer also fakes the wedge profile of a thin premium chassis.
 * - KEYBOARD: data-driven grid (weights per row -> variable key widths, wide
 *   modifiers, spacebar) sitting in a slightly recessed darker well. All keys
 *   share ONE chamfered unit geometry (rounded-rect extrude, height baked,
 *   footprint scaled per key). No glyphs, per spec.
 * - LID: rounded-rect slab hinged at its local y=0 edge. The lid group sits
 *   exactly on the hinge line, so `lidAngle` is a pure static parameter:
 *   rotation.x = PI/2 - lidAngle (lidAngle 0 = closed flat on the deck,
 *   PI/2 = vertical, default 1.85 rad ~= 106deg = slightly leaned back).
 * - HINGE: a chassis-colored barrel cylinder spans the junction so base and
 *   lid visually join through a real part (no intersecting boxes), plus two
 *   darker end caps. At rotationY ~1.4 (near profile) the barrel + thin lid
 *   slab + base chamfer are what keep the silhouette readable.
 * - Details: edge-to-edge glass panel on the lid face, thin regular bezels,
 *   camera dot in the top bezel, front thumb scoop (dark half-embedded
 *   cylinder on the front edge), 4 low rubber feet.
 * - Materials: dark anodized aluminum chassis (metalness 0.8 / roughness
 *   0.34), keys more matte, screen-off = deep black slightly reflective.
 *
 * BOUNDS (default lidAngle = 1.85, rotationY = 0, scale = 1, model space):
 *   x in [-1.60, +1.60]  -> width 3.20 = largest dimension
 *   y in [-1.08, +1.08]  (feet bottom to lid top corner)
 *   z in [-1.49, +1.03]  (lid leaning back behind the hinge / base front edge)
 *   Centered on the origin for the DEFAULT lidAngle via a fixed -0.96 y
 *   offset (recentering is not recomputed per lidAngle, so the pivot is
 *   stable if a bench sweeps the hinge).
 *
 * SCREEN PLANE (the hosting zone for a real dashboard capture):
 *   - Active area: 2.88 x 1.80 world units (16:10), flat, solidaire du capot.
 *   - Lid-local frame: center (0, 1.02, 0.053), normal +Z, up +Y.
 *   - Lid -> model space: rotate by (PI/2 - lidAngle) about X around the
 *     hinge point H = (0, 0.10, -0.93), then add the (0, -0.96, 0) recenter.
 *   - At default lidAngle 1.85 that gives, in model space:
 *       center ~ (0, 0.135, -1.160)
 *       normal ~ (0, 0.276, 0.961)   (tilted up toward the viewer)
 *       up     ~ (0, 0.961, -0.276)
 *
 * SCREEN PROP - chosen path = NAKED NAMED MESH (primary), Html (fallback):
 *   The screen surface is a plain <mesh name={SCREEN_MESH_NAME}> with a dark
 *   material. To show a real dashboard, replace that mesh's material with a
 *   CanvasTexture/VideoTexture map (scene.getObjectByName). Rationale: in
 *   Remotion headless rendering the WebGL canvas is what gets captured per
 *   frame; a texture on a mesh is lit, occluded and depth-sorted correctly at
 *   ALL rotationY angles. drei <Html> lives in a DOM/CSS3D layer OUTSIDE the
 *   canvas: it cannot interleave with WebGL depth, so at grazing angles the
 *   DOM either floats above the chassis or needs fragile occlusion hacks -
 *   disqualifying for the multi-angle requirement. If the `screen` prop is
 *   provided we still honor it via <Html transform> centered on the plane
 *   (convenient for quick previews); content is authored at 1280x800 px and
 *   scaled to the 2.88-unit plane width.
 *
 * No lights, no camera, no animation - rotation comes from the rotationY prop.
 */

import React, { useMemo } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";

// ---------------------------------------------------------------------------
// Constants (model space, before the global recenter)
// ---------------------------------------------------------------------------

export const SCREEN_MESH_NAME = "LaptopScreenSurface";

// Base slab
const BASE_W = 3.15; // plan width (chamfer brings the true extent to ~3.20)
const BASE_D = 2.06; // plan depth
const BASE_T = 0.13; // slab thickness
const BASE_BEVEL = 0.024; // chamfer facet size
const DECK_TOP = (BASE_T + 2 * 0.02) / 2; // ~0.085, top surface after center()

// Hinge
const HINGE_Y = 0.1;
const HINGE_Z = -BASE_D / 2 + 0.1; // -0.93, barrel inset from the back edge

// Lid
const LID_W = 3.0;
const LID_H = 2.02;
const LID_T = 0.075;
const LID_BEVEL = 0.012;

// Screen (16:10) and glass, in lid-local coordinates
const SCREEN_W = 2.88;
const SCREEN_H = 1.8; // 2.88 / 1.6
const SCREEN_CY = 1.02; // bottom bezel 0.12 (chin), top bezel 0.10
const GLASS_Z = LID_T / 2 + LID_BEVEL + 0.002; // ~0.0515
const SCREEN_Z = GLASS_Z + 0.002;
const HTML_Z = SCREEN_Z + 0.003;
const SCREEN_PX_W = 1280; // authoring size for the Html fallback
const SCREEN_PX_H = 800;

// Keyboard
const KB_W = 2.6;
const KEY_GAP = 0.024;
const KEY_ROW_D = 0.15;
const KEY_ROW_GAP = 0.022;
const KB_BACK_Z = -0.82;

// Global recenter so the whole laptop is centered on the origin (default lid)
const CENTER_Y_OFFSET = -0.96;

// ---------------------------------------------------------------------------
// Shape helpers (module scope, deterministic)
// ---------------------------------------------------------------------------

/** Rounded rectangle centered on (0,0), width w along x, height h along y. */
const roundedRectCentered = (w: number, h: number, r: number): THREE.Shape => {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  s.closePath();
  return s;
};

type KeyCell = { x: number; z: number; w: number; d: number };

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const LaptopModel: React.FC<{
  rotationY: number;
  scale: number;
  screen?: React.ReactNode;
  lidAngle?: number;
}> = ({ rotationY, scale, screen, lidAngle = 1.85 }) => {
  // BASE - rounded-rect plan extruded through the thickness, 1-segment bevel
  // = flat chamfer facets top and bottom. Extrusion runs along +Z, then the
  // slab is rotated flat (extrusion axis becomes +Y).
  const baseGeometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(
      roundedRectCentered(BASE_W, BASE_D, 0.1),
      {
        depth: BASE_T,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: BASE_BEVEL,
        bevelSegments: 1,
        curveSegments: 16,
      }
    );
    geo.center();
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  // LID - same construction, but kept in the XY plane (it stands up), with
  // its hinge edge at local y=0 so the group rotation is the hinge itself.
  const lidGeometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(roundedRectCentered(LID_W, LID_H, 0.09), {
      depth: LID_T,
      bevelEnabled: true,
      bevelThickness: LID_BEVEL,
      bevelSize: 0.014,
      bevelSegments: 1,
      curveSegments: 16,
    });
    // Shape was centered; shift so y runs 0..LID_H and z is centered.
    geo.translate(0, LID_H / 2, -LID_T / 2);
    return geo;
  }, []);

  // KEY - one shared chamfered unit keycap (1x1 footprint, height baked at
  // 0.03), scaled per key. The tiny bevel distorts slightly under non-uniform
  // scale but stays unreadable at this key size.
  const keyGeometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(roundedRectCentered(1, 1, 0.18), {
      depth: 0.022,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.05,
      bevelSegments: 1,
      curveSegments: 6,
    });
    geo.rotateX(-Math.PI / 2); // extrusion axis -> +Y, footprint in XZ
    return geo;
  }, []);

  // Keyboard layout: weights per row -> variable key widths (Tab, CapsLock,
  // Shift, Backspace, spacebar) without any lettering.
  const keyLayout = useMemo<KeyCell[]>(() => {
    const rows: { weights: number[]; depthScale: number }[] = [
      { weights: new Array<number>(13).fill(1), depthScale: 0.6 }, // fn row
      { weights: [...new Array<number>(13).fill(1), 1.7], depthScale: 1 },
      { weights: [1.5, ...new Array<number>(12).fill(1), 1.6], depthScale: 1 },
      { weights: [1.85, ...new Array<number>(11).fill(1), 2.0], depthScale: 1 },
      { weights: [2.4, ...new Array<number>(10).fill(1), 2.4], depthScale: 1 },
      { weights: [1, 1, 1.2, 1.2, 6.0, 1.2, 1, 1, 1.2], depthScale: 1 },
    ];
    const cells: KeyCell[] = [];
    let zCursor = KB_BACK_Z;
    for (const row of rows) {
      const n = row.weights.length;
      const sum = row.weights.reduce((a, b) => a + b, 0);
      const usable = KB_W - KEY_GAP * (n - 1);
      const d = KEY_ROW_D * row.depthScale;
      let xCursor = -KB_W / 2;
      for (const wgt of row.weights) {
        const w = (usable * wgt) / sum;
        cells.push({ x: xCursor + w / 2, z: zCursor + d / 2, w, d });
        xCursor += w + KEY_GAP;
      }
      zCursor += d + KEY_ROW_GAP;
    }
    return cells;
  }, []);

  // Shared materials (one instance each, reused across all meshes)
  const mat = useMemo(
    () => ({
      chassis: new THREE.MeshStandardMaterial({
        color: "#3f434a",
        metalness: 0.8,
        roughness: 0.34,
      }),
      well: new THREE.MeshStandardMaterial({
        color: "#26282d",
        metalness: 0.7,
        roughness: 0.5,
      }),
      key: new THREE.MeshStandardMaterial({
        color: "#232529",
        metalness: 0.3,
        roughness: 0.62,
      }),
      trackpad: new THREE.MeshStandardMaterial({
        color: "#4a4e56",
        metalness: 0.75,
        roughness: 0.28,
      }),
      glass: new THREE.MeshStandardMaterial({
        color: "#0a0b0e",
        metalness: 0.9,
        roughness: 0.1,
      }),
      screenOff: new THREE.MeshStandardMaterial({
        color: "#06070a",
        metalness: 0.85,
        roughness: 0.14,
      }),
      camera: new THREE.MeshStandardMaterial({
        color: "#10141c",
        metalness: 0.4,
        roughness: 0.35,
      }),
      lens: new THREE.MeshStandardMaterial({
        color: "#1d2b3a",
        metalness: 0.6,
        roughness: 0.2,
      }),
      foot: new THREE.MeshStandardMaterial({
        color: "#141517",
        metalness: 0.0,
        roughness: 0.9,
      }),
    }),
    []
  );

  const lidTilt = Math.PI / 2 - lidAngle;

  return (
    <group rotation={[0, rotationY, 0]} scale={[scale, scale, scale]}>
      <group position={[0, CENTER_Y_OFFSET, 0]}>
        {/* ------------------------------------------------ BASE ---------- */}
        <mesh geometry={baseGeometry} material={mat.chassis} />

        {/* Recessed keyboard well (slightly darker inset plate) */}
        <mesh material={mat.well} position={[0, DECK_TOP + 0.002, -0.34]}>
          <boxGeometry args={[2.72, 0.008, 1.05]} />
        </mesh>

        {/* Keys - shared chamfered geometry, per-key footprint scale */}
        {keyLayout.map((k, i) => (
          <mesh
            key={i}
            geometry={keyGeometry}
            material={mat.key}
            position={[k.x, 0.099, k.z]}
            scale={[k.w, 1, k.d]}
          />
        ))}

        {/* Trackpad - glassier, barely proud of the deck */}
        <mesh material={mat.trackpad} position={[0, DECK_TOP + 0.005, 0.56]}>
          <boxGeometry args={[1.12, 0.012, 0.66]} />
        </mesh>

        {/* Front thumb scoop - dark cylinder half-embedded in the front edge */}
        <mesh
          material={mat.well}
          position={[0, DECK_TOP - 0.008, BASE_D / 2 - 0.01]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.045, 0.045, 0.46, 20]} />
        </mesh>

        {/* Rubber feet */}
        {[
          [-1.3, -0.75],
          [1.3, -0.75],
          [-1.3, 0.75],
          [1.3, 0.75],
        ].map(([fx, fz], i) => (
          <mesh key={i} material={mat.foot} position={[fx, -0.1, fz]}>
            <cylinderGeometry args={[0.1, 0.1, 0.035, 20]} />
          </mesh>
        ))}

        {/* ------------------------------------------------ HINGE --------- */}
        <mesh
          material={mat.chassis}
          position={[0, HINGE_Y, HINGE_Z]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.062, 0.062, 2.55, 24]} />
        </mesh>
        {[-1.31, 1.31].map((hx) => (
          <mesh
            key={hx}
            material={mat.well}
            position={[hx, HINGE_Y, HINGE_Z]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.066, 0.066, 0.11, 24]} />
          </mesh>
        ))}

        {/* ------------------------------------------------ LID ----------- */}
        {/* Pivot group ON the hinge line: lidAngle is a static parameter. */}
        <group position={[0, HINGE_Y, HINGE_Z]} rotation={[lidTilt, 0, 0]}>
          <mesh geometry={lidGeometry} material={mat.chassis} />

          {/* Edge-to-edge glass panel (thin, darker than the chassis) */}
          <mesh material={mat.glass} position={[0, LID_H / 2, GLASS_Z]}>
            <planeGeometry args={[LID_W - 0.06, LID_H - 0.06]} />
          </mesh>

          {/* SCREEN SURFACE - the hosting zone. Pass a r3f material element as
              the `screen` prop to plug a real UI capture (same convention as
              PhoneModel). Falls back to the screen-off material.
              ⛔ Ne PAS charger la texture dans un composant enfant du canvas :
              useLayoutEffect/useEffect n'y sont PAS flushes avant la capture
              Remotion sur un render `still` (mesure du 2026-08-25) — la texture
              doit etre construite HORS du <ThreeCanvas> et passee en prop. */}
          <mesh
            name={SCREEN_MESH_NAME}
            position={[0, SCREEN_CY, SCREEN_Z]}
          >
            <planeGeometry args={[SCREEN_W, SCREEN_H]} />
            {screen ?? <primitive object={mat.screenOff} attach="material" />}
          </mesh>

          {/* Camera dot + lens in the top bezel */}
          <mesh material={mat.camera} position={[0, 1.955, GLASS_Z + 0.002]}>
            <circleGeometry args={[0.016, 20]} />
          </mesh>
          <mesh material={mat.lens} position={[0, 1.955, GLASS_Z + 0.003]}>
            <circleGeometry args={[0.007, 16]} />
          </mesh>

          {/* (le fallback <Html> a ete retire : la prop `screen` est desormais
              le material du mesh ci-dessus, in-canvas, donc occlus et eclaire.) */}
        </group>
      </group>
    </group>
  );
};
