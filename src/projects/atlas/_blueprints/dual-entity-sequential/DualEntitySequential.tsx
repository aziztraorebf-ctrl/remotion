import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  AtlasMercator,
  AtlasPulseMarker,
} from "../../_shared/atlas-components";
import atlasData from "../../_shared/atlas-v2-data.json";

// Blueprint: DualEntitySequential
//
// DEUX personnages agissent séquentiellement sur la même scène.
// Entité A marche vers un point, effectue une action, repart.
// Entité B entre ensuite, effectue une action symétrique.
// La caméra suit l'entité active à chaque instant.
//
// Source validée : Empire Ghana Beat3Barter (berbere + sahelien, échange sel/or).
// Pattern clé : computeCameraState() retourne la position des DEUX sprites ET
// le focus caméra — tout est calculé dans la même fonction, zéro désynchronisation.
//
// Cas d'usage :
//   - Échange commercial (marchand A → marchand B)
//   - Rencontre diplomatique séquentielle (émissaire → roi)
//   - Construction / démolition (bâtisseur → destructeur)
//   - Arrivée / départ (explorer arrive, contemple, repart — guide arrive)
//
// Props :
//   spawnASvgX/Y   — point de départ entité A
//   destSvgX/Y     — point central de l'échange (où les deux convergent)
//   spawnBSvgX/Y   — point de départ entité B
//   entityAStart   — frame locale où A commence à marcher
//   entityACrouchStart — frame où A s'arrête / effectue action (optionnel)
//   entityACrouchEnd   — frame où A repart (optionnel)
//   entityAEnd     — frame où A disparaît hors-cadre
//   entityBStart   — frame où B commence à marcher
//   entityBCrouchStart / entityBCrouchEnd / entityBEnd — même logique pour B
//   durationFrames — durée totale du beat
//   zoomWalk       — zoom pendant les walks (défaut 2.8)
//   zoomCrouch     — zoom pendant les actions (défaut 3.2)
//   zoomOut        — zoom final dolly-out (défaut 1.0)
//   spriteAWalkDir — dossier walk A (ex: "empire-ghana/characters/berbere/animations/walking-b8b230ef")
//   spriteBWalkDir — dossier walk B
//   spriteAFrameCount / spriteBFrameCount
//   spriteSize     — taille CSS (défaut 140)

interface Props {
  spawnASvgX?: number;
  spawnASvgY?: number;
  destSvgX?: number;
  destSvgY?: number;
  spawnBSvgX?: number;
  spawnBSvgY?: number;
  entityAStart?: number;
  entityACrouchStart?: number;
  entityACrouchEnd?: number;
  entityAEnd?: number;
  entityBStart?: number;
  entityBCrouchStart?: number;
  entityBCrouchEnd?: number;
  entityBEnd?: number;
  durationFrames?: number;
  zoomWalk?: number;
  zoomCrouch?: number;
  zoomOut?: number;
  spriteAWalkDir?: string;
  spriteBWalkDir?: string;
  spriteAFrameCount?: number;
  spriteBFrameCount?: number;
  spriteSize?: number;
}

const SVG_W = 720;
const COMP_W = 1080;
const CSS_SCALE = COMP_W / SVG_W;
const ATLAS_CX = 360;
const ATLAS_CY = 640;

// Helper : position linéaire d'une entité selon ses phases.
// Retourne la position (svgX, svgY) à n'importe quel frame.
function entityPosition(
  frame: number,
  spawnX: number, spawnY: number,
  dropX: number, dropY: number,
  walkStart: number, crouchStart: number, crouchEnd: number, walkEnd: number,
): { x: number; y: number } {
  if (frame < walkStart) return { x: spawnX, y: spawnY };
  if (frame < crouchStart) {
    const p = (frame - walkStart) / (crouchStart - walkStart);
    return { x: spawnX + (dropX - spawnX) * p, y: spawnY + (dropY - spawnY) * p };
  }
  if (frame < crouchEnd) return { x: dropX, y: dropY };
  if (frame < walkEnd) {
    const p = (frame - crouchEnd) / (walkEnd - crouchEnd);
    return { x: dropX + (spawnX - dropX) * p, y: dropY + (spawnY - dropY) * p };
  }
  return { x: spawnX, y: spawnY };
}

// Convertit coordonnées SVG → CSS composition. Source : Beat3Barter.svgToCompWithCam().
function svgToCompWithCam(
  svgX: number,
  svgY: number,
  cam: { camFocusX: number; camFocusY: number; camZoom: number; scaleY: number; driftX: number; driftY: number },
): { x: number; y: number } {
  const screenSvgX = (svgX - cam.camFocusX) * cam.camZoom + ATLAS_CX + cam.driftX;
  const screenSvgY = (svgY - cam.camFocusY) * cam.camZoom * cam.scaleY + ATLAS_CY + cam.driftY;
  return { x: screenSvgX * CSS_SCALE, y: screenSvgY * CSS_SCALE };
}

export const DualEntitySequential: React.FC<Props> = ({
  spawnASvgX = 322, spawnASvgY = 518,
  destSvgX = 238, destSvgY = 697,
  spawnBSvgX = 165, spawnBSvgY = 767,
  entityAStart = 99, entityACrouchStart = 159, entityACrouchEnd = 179, entityAEnd = 273,
  entityBStart = 296, entityBCrouchStart = 363, entityBCrouchEnd = 383, entityBEnd = 443,
  durationFrames = 690,
  zoomWalk = 2.8,
  zoomCrouch = 3.2,
  zoomOut = 1.0,
  spriteAWalkDir = "empire-ghana/characters/berbere/animations/walking-b8b230ef",
  spriteBWalkDir = "empire-ghana/characters/sahelien/animations/walking-3848d070",
  spriteAFrameCount = 6,
  spriteBFrameCount = 6,
  spriteSize = 140,
}) => {
  const frame = useCurrentFrame();

  // ── Positions des deux entités ────────────────────────────────────────────
  const posA = entityPosition(frame, spawnASvgX, spawnASvgY, destSvgX, destSvgY, entityAStart, entityACrouchStart, entityACrouchEnd, entityAEnd);
  const posB = entityPosition(frame, spawnBSvgX, spawnBSvgY, destSvgX, destSvgY, entityBStart, entityBCrouchStart, entityBCrouchEnd, entityBEnd);

  // ── Camera state — suit l'entité active ──────────────────────────────────
  // Règle : A actif → focus A. Entre A et B → glisse vers destSvg. B actif → focus B.
  const driftX = Math.sin(frame * 0.014) * 4;
  const driftY = Math.cos(frame * 0.011) * 3;

  let camFocusX = destSvgX;
  let camFocusY = destSvgY;
  let camZoom = 1.85;

  if (frame < 30) {
    // Intro : zoom-in doux
    camZoom = interpolate(frame, [0, 30], [1.5, 2.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    camFocusX = destSvgX; camFocusY = destSvgY;
  } else if (frame >= entityAStart && frame < entityAEnd) {
    // Entité A active
    camFocusX = posA.x; camFocusY = posA.y;
    camZoom = frame >= entityACrouchStart && frame < entityACrouchEnd ? zoomCrouch : zoomWalk;
  } else if (frame >= entityAEnd && frame < entityBStart) {
    // Transition A→B : glisse vers point central
    const p = interpolate(frame, [entityAEnd, entityBStart], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    camFocusX = posA.x + (destSvgX - posA.x) * p;
    camFocusY = posA.y + (destSvgY - posA.y) * p;
    camZoom = interpolate(p, [0, 1], [zoomWalk, 1.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  } else if (frame >= entityBStart && frame < entityBEnd) {
    // Entité B active
    camFocusX = posB.x; camFocusY = posB.y;
    camZoom = interpolate(frame, [entityBStart, entityBCrouchStart], [1.6, zoomWalk], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    if (frame >= entityBCrouchStart && frame < entityBCrouchEnd) camZoom = zoomCrouch;
    if (frame >= entityBCrouchEnd) camZoom = zoomWalk;
  } else {
    // Dolly-out final : révèle la scène complète
    camFocusX = destSvgX; camFocusY = destSvgY;
    camZoom = interpolate(frame, [entityBEnd, durationFrames], [zoomWalk, zoomOut], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }

  const tiltBase = 18 + Math.sin(frame * 0.04) * 2;
  const effectiveTilt = camZoom > 1.9
    ? interpolate(camZoom, [1.9, 2.5], [tiltBase, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : tiltBase;
  const skewX = effectiveTilt * 0.15;
  const scaleY = 1 - effectiveTilt * 0.008;

  const cam = { camFocusX, camFocusY, camZoom, skewX, scaleY, driftX, driftY };

  // ── Walk cycles ───────────────────────────────────────────────────────────
  const aVisible = frame >= entityAStart && frame < entityAEnd;
  const bVisible = frame >= entityBStart && frame < entityBEnd;

  const walkFrameA = frame >= entityAStart
    ? Math.floor(Math.max(0, frame - entityAStart) / 6) % spriteAFrameCount
    : 0;
  const walkFrameB = frame >= entityBStart
    ? Math.floor(Math.max(0, frame - entityBStart) / 6) % spriteBFrameCount
    : 0;

  const isWalkingA = frame >= entityAStart && frame < entityACrouchStart;
  const isWalkingB = frame >= entityBStart && frame < entityBCrouchStart;

  const srcA = staticFile(`${spriteAWalkDir}/south/frame_${String(walkFrameA).padStart(3, "0")}.png`);
  const srcB = staticFile(`${spriteBWalkDir}/east/frame_${String(walkFrameB).padStart(3, "0")}.png`);

  const posAComp = svgToCompWithCam(posA.x, posA.y, cam);
  const posBComp = svgToCompWithCam(posB.x, posB.y, cam);

  // Taille sprites : suit le zoom (restent proportionnels à la carte)
  const spriteSizeScaled = spriteSize * (camZoom / 1.85);

  const hopA = isWalkingA ? Math.abs(Math.sin(frame * 0.4)) * 4 : 0;
  const hopB = isWalkingB ? Math.abs(Math.sin(frame * 0.4 + 1.5)) * 4 : 0;

  const countries = (atlasData as { mercWide: { countries: { iso: string; d: string }[] } }).mercWide.countries;

  const globalFadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const globalFadeOut = interpolate(frame, [durationFrames - 12, durationFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a", opacity: globalFadeIn * globalFadeOut }}>
      {/* Carte */}
      <AbsoluteFill>
        <svg viewBox="0 0 720 1280" style={{ width: "100%", height: "100%" }}>
          <AtlasMercator
            countries={countries}
            scale={camZoom}
            driftX={driftX}
            driftY={driftY}
            centerOffsetX={camFocusX - ATLAS_CX}
            centerOffsetY={camFocusY - ATLAS_CY}
          />
          <AtlasPulseMarker coord={[destSvgX, destSvgY]} beatStart={entityAStart} color="#E8C97D" />
        </svg>
      </AbsoluteFill>

      {/* Entité A */}
      {aVisible && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <Img
            src={srcA}
            style={{
              position: "absolute",
              left: posAComp.x - spriteSizeScaled / 2,
              top: posAComp.y - spriteSizeScaled - hopA,
              width: spriteSizeScaled,
              height: spriteSizeScaled,
              imageRendering: "pixelated",
              filter: "drop-shadow(2px 2px 6px rgba(0,0,0,0.6))",
            }}
          />
        </AbsoluteFill>
      )}

      {/* Entité B */}
      {bVisible && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <Img
            src={srcB}
            style={{
              position: "absolute",
              left: posBComp.x - spriteSizeScaled / 2,
              top: posBComp.y - spriteSizeScaled - hopB,
              width: spriteSizeScaled,
              height: spriteSizeScaled,
              imageRendering: "pixelated",
              filter: "drop-shadow(2px 2px 6px rgba(0,0,0,0.6))",
            }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
