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
  AtlasLabel,
  AtlasPulseMarker,
} from "../../_shared/atlas-components";
import atlasData from "../../_shared/atlas-v2-data.json";

// Blueprint: CameraTrackEntity
//
// UN personnage marche de A vers B. La caméra zoome et suit exactement le sprite
// pendant tout le trajet. À l'arrivée : idle, label pop, pulse marker.
//
// Source validée : Empire Ghana Beat3Barter (berbere walk) + Beat4Consequence (guerrier).
// Pattern clé : computeCameraState() calcule la position sprite ET la position caméra
// dans la même fonction — garantit la synchronisation parfaite.
//
// Props :
//   spawnSvgX/Y    — point de départ du sprite (coordonnées SVG 720×1280)
//   destSvgX/Y     — point d'arrivée / destination
//   labelText      — texte qui apparaît à l'arrivée (vide = pas de label)
//   walkStart      — frame locale à laquelle le sprite commence à marcher
//   walkEnd        — frame locale à laquelle il arrive à destination
//   durationFrames — durée totale du beat
//   zoomWalk       — zoom pendant la marche (défaut 2.8)
//   zoomArrive     — zoom à l'arrivée (défaut 3.2, gros plan)
//   zoomOut        — zoom final pull-back (défaut 1.0)
//   spriteDir      — dossier frames individuels (ex: "empire-ghana/characters/berbere/animations/walking-b8b230ef")
//   spriteFrameCount — nombre de frames walk (défaut 6)
//   spriteSize     — taille CSS du sprite en px (défaut 140)
//   direction      — direction de marche pour getSpriteFramePath (défaut "south")

interface Props {
  spawnSvgX?: number;
  spawnSvgY?: number;
  destSvgX?: number;
  destSvgY?: number;
  labelText?: string;
  walkStart?: number;
  walkEnd?: number;
  durationFrames?: number;
  zoomWalk?: number;
  zoomArrive?: number;
  zoomOut?: number;
  spriteDir?: string;
  spriteFrameCount?: number;
  spriteSize?: number;
  direction?: string;
}

const SVG_W = 720;
const COMP_W = 1080;
const CSS_SCALE = COMP_W / SVG_W; // 1.5
const ATLAS_CX = 360;
const ATLAS_CY = 640;

// Convertit coordonnées SVG → CSS composition (1080×1920) en tenant compte de la caméra.
// C'est le helper central qui synchronise la carte SVG avec les sprites CSS.
// Source : Beat3Barter.svgToCompWithCam() — validé Empire Ghana.
function svgToCompWithCam(
  svgX: number,
  svgY: number,
  cam: { camFocusX: number; camFocusY: number; camZoom: number; scaleY: number; driftX: number; driftY: number },
): { x: number; y: number } {
  const screenSvgX = (svgX - cam.camFocusX) * cam.camZoom + ATLAS_CX + cam.driftX;
  const screenSvgY = (svgY - cam.camFocusY) * cam.camZoom * cam.scaleY + ATLAS_CY + cam.driftY;
  return { x: screenSvgX * CSS_SCALE, y: screenSvgY * CSS_SCALE };
}

export const CameraTrackEntity: React.FC<Props> = ({
  spawnSvgX = 322,
  spawnSvgY = 518,
  destSvgX = 238,
  destSvgY = 697,
  labelText = "Arrivée",
  walkStart = 30,
  walkEnd = 150,
  durationFrames = 210,
  zoomWalk = 2.8,
  zoomArrive = 3.2,
  zoomOut = 1.0,
  spriteDir = "empire-ghana/characters/berbere/animations/walking-b8b230ef",
  spriteFrameCount = 6,
  spriteSize = 140,
  direction = "south",
}) => {
  const frame = useCurrentFrame();

  // ── Position sprite en temps réel (linéaire spawn→dest) ──────────────────
  let entityX = spawnSvgX;
  let entityY = spawnSvgY;
  if (frame >= walkStart && frame < walkEnd) {
    const p = (frame - walkStart) / (walkEnd - walkStart);
    entityX = spawnSvgX + (destSvgX - spawnSvgX) * p;
    entityY = spawnSvgY + (destSvgY - spawnSvgY) * p;
  } else if (frame >= walkEnd) {
    entityX = destSvgX;
    entityY = destSvgY;
  }

  // ── Camera state — calculé UNE FOIS, utilisé par la carte ET les sprites ──
  // Règle : la caméra suit le sprite pendant walkStart→walkEnd, puis se stabilise.
  const driftX = Math.sin(frame * 0.014) * 4;
  const driftY = Math.cos(frame * 0.011) * 3;

  let camFocusX = spawnSvgX;
  let camFocusY = spawnSvgY;
  let camZoom = 1.0;

  if (frame < walkStart) {
    // Avant le départ : centré sur spawn, zoom neutre
    camFocusX = spawnSvgX;
    camFocusY = spawnSvgY;
    camZoom = interpolate(frame, [0, walkStart], [1.0, zoomWalk], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  } else if (frame < walkEnd) {
    // Pendant la marche : la caméra SUIT le sprite
    camFocusX = entityX;
    camFocusY = entityY;
    camZoom = zoomWalk;
  } else if (frame < walkEnd + 20) {
    // Arrivée : zoom-in gros plan
    camFocusX = destSvgX;
    camFocusY = destSvgY;
    camZoom = interpolate(frame, [walkEnd, walkEnd + 20], [zoomWalk, zoomArrive], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  } else {
    // Pull-back final
    camFocusX = destSvgX;
    camFocusY = destSvgY;
    camZoom = interpolate(frame, [walkEnd + 20, durationFrames], [zoomArrive, zoomOut], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }

  // Tilt axonométrique (annulé sur gros plans)
  const tiltBase = 18 + Math.sin(frame * 0.04) * 2;
  const effectiveTilt = camZoom > 1.9
    ? interpolate(camZoom, [1.9, 2.5], [tiltBase, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : tiltBase;
  const skewX = effectiveTilt * 0.15;
  const scaleY = 1 - effectiveTilt * 0.008;

  const cam = { camFocusX, camFocusY, camZoom, skewX, scaleY, driftX, driftY };

  // ── Walk cycle sprites individuels ────────────────────────────────────────
  const isWalking = frame >= walkStart && frame < walkEnd;
  const isArrived = frame >= walkEnd;
  const walkFrameIdx = isWalking
    ? Math.floor(Math.max(0, frame - walkStart) / 6) % spriteFrameCount
    : 0;
  const frameIdxStr = String(walkFrameIdx).padStart(3, "0");
  const spriteSrc = staticFile(
    `${spriteDir}/${direction}/frame_${frameIdxStr}.png`
  );

  const entityPos = svgToCompWithCam(entityX, entityY, cam);
  const hopY = isWalking ? Math.abs(Math.sin(frame * 0.4)) * 4 : 0;

  const countries = (atlasData as { mercWide: { countries: { iso: string; d: string }[] } }).mercWide.countries;

  const globalFadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const globalFadeOut = interpolate(frame, [durationFrames - 12, durationFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a", opacity: globalFadeIn * globalFadeOut }}>
      {/* Carte SVG — AtlasMercator gère son propre transform en interne */}
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
          {isArrived && labelText && (
            <AtlasPulseMarker
              coord={[destSvgX, destSvgY]}
              beatStart={walkEnd}
              color="#E8C97D"
            />
          )}
          {isArrived && labelText && (
            <AtlasLabel
              text={labelText}
              coord={[destSvgX, destSvgY - 50]}
              appearAt={walkEnd + 5}
            />
          )}
        </svg>
      </AbsoluteFill>

      {/* Sprite CSS — positionné via svgToCompWithCam (même espace que la carte) */}
      {(isWalking || isArrived) && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <Img
            src={spriteSrc}
            style={{
              position: "absolute",
              left: entityPos.x - spriteSize / 2,
              top: entityPos.y - spriteSize - hopY,
              width: spriteSize,
              height: spriteSize,
              imageRendering: "pixelated",
              filter: "drop-shadow(2px 2px 6px rgba(0,0,0,0.6))",
            }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
