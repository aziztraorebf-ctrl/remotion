import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { AtlasMercator } from "../../_shared/atlas-components";
import atlasData from "../../_shared/atlas-v2-data.json";

// Blueprint: FormationMarch
//
// N personnages marchent en formation depuis un point de spawn vers une destination.
// Le leader marche en tête. Les membres suivent avec retards temporels et offsets spatiaux.
// La caméra track le leader pendant la marche, puis pull-back sur la scène complète.
//
// Source validée : Empire Ghana Beat4Consequence (Sundiata + 3 guerriers Mande).
// Pattern clé : mandePosition(spawnDX, spawnDY, arriveDX, arriveDY, frameOffset)
// Chaque membre a sa propre position relative (offset spawn + offset arrivée) et
// son propre retard temporel. Ça donne un effet armée / cortège / caravane réaliste.
//
// Cas d'usage :
//   - Armée qui marche sur une ville
//   - Cortège royal (roi + gardes)
//   - Caravane commerciale (guide + marchands)
//   - Migration de population (chef + famille)
//
// Props :
//   spawnSvgX/Y    — point de départ de la formation (SVG 720×1280)
//   destSvgX/Y     — point d'arrivée
//   walkStart      — frame locale où le leader commence à marcher
//   walkEnd        — frame locale où le leader arrive
//   durationFrames — durée totale
//   zoomWalk       — zoom pendant la marche (défaut 2.0)
//   zoomCloseup    — zoom gros plan leader à mi-chemin (défaut 3.0, 0 = désactivé)
//   closeupAt      — frame du gros plan
//   spriteLeaderDir — dossier frames leader
//   spriteMemberDir — dossier frames membres (partagé)
//   spriteFrameCount
//   spriteSize
//   members        — tableau de membres { spawnDX, spawnDY, arriveDX, arriveDY, frameOffset }
//                    spawnD* = offset relatif au spawn, arrivéeD* = offset relatif à la dest

interface Member {
  spawnDX: number;
  spawnDY: number;
  arriveDX: number;
  arriveDY: number;
  frameOffset: number;
  spriteDir?: string;
  flipH?: boolean;
}

interface Props {
  spawnSvgX?: number;
  spawnSvgY?: number;
  destSvgX?: number;
  destSvgY?: number;
  walkStart?: number;
  walkEnd?: number;
  durationFrames?: number;
  zoomWalk?: number;
  zoomCloseup?: number;
  closeupAt?: number;
  spriteLeaderDir?: string;
  spriteMemberDir?: string;
  spriteFrameCount?: number;
  spriteSize?: number;
  members?: Member[];
}

const SVG_W = 720;
const COMP_W = 1080;
const CSS_SCALE = COMP_W / SVG_W;
const ATLAS_CX = 360;
const ATLAS_CY = 640;

function svgToCompWithCam(
  svgX: number,
  svgY: number,
  cam: { camFocusX: number; camFocusY: number; camZoom: number; scaleY: number; driftX: number; driftY: number },
): { x: number; y: number } {
  const screenSvgX = (svgX - cam.camFocusX) * cam.camZoom + ATLAS_CX + cam.driftX;
  const screenSvgY = (svgY - cam.camFocusY) * cam.camZoom * cam.scaleY + ATLAS_CY + cam.driftY;
  return { x: screenSvgX * CSS_SCALE, y: screenSvgY * CSS_SCALE };
}

// Helper central : position d'un membre de la formation.
// Source : Beat4Consequence.mandePosition() — validé Empire Ghana.
// spawnD* = offset relatif au point de spawn du groupe
// arrivéeD* = offset relatif au point d'arrivée du groupe
// frameOffset = retard en frames (leader = 0, autres > 0)
function memberPosition(
  frame: number,
  spawnX: number, spawnY: number,
  destX: number, destY: number,
  walkStart: number, walkEnd: number,
  spawnDX: number, spawnDY: number,
  arriveDX: number, arriveDY: number,
  frameOffset: number,
): { x: number; y: number } {
  const effectiveFrame = frame - frameOffset;
  const sx = spawnX + spawnDX;
  const sy = spawnY + spawnDY;
  const ax = destX + arriveDX;
  const ay = destY + arriveDY;

  if (effectiveFrame < walkStart) return { x: sx, y: sy };
  if (effectiveFrame >= walkEnd) return { x: ax, y: ay };

  const p = (effectiveFrame - walkStart) / (walkEnd - walkStart);
  return { x: sx + (ax - sx) * p, y: sy + (ay - sy) * p };
}

const DEFAULT_MEMBERS: Member[] = [
  { spawnDX: -22, spawnDY: 0,  arriveDX: -28, arriveDY: 8,  frameOffset: 10 }, // gauche
  { spawnDX:  22, spawnDY: 0,  arriveDX:  28, arriveDY: 8,  frameOffset: 10 }, // droite
  { spawnDX:   0, spawnDY: 22, arriveDX:   0, arriveDY: 35, frameOffset: 22 }, // derrière
];

export const FormationMarch: React.FC<Props> = ({
  spawnSvgX = 165,
  spawnSvgY = 767,
  destSvgX = 238,
  destSvgY = 697,
  walkStart = 375,
  walkEnd = 450,
  durationFrames = 636,
  zoomWalk = 2.0,
  zoomCloseup = 3.5,
  closeupAt = 410,
  spriteLeaderDir = "empire-ghana/characters/sundiata/animations/walking_forward_calmly_holding_sword_still_close_t-70738c80",
  spriteMemberDir = "empire-ghana/characters/lancier/animations/animating-ae8b3773",
  spriteFrameCount = 4,
  spriteSize = 140,
  members = DEFAULT_MEMBERS,
}) => {
  const frame = useCurrentFrame();

  // ── Position leader (frame offset = 0) ───────────────────────────────────
  const leaderPos = memberPosition(frame, spawnSvgX, spawnSvgY, destSvgX, destSvgY, walkStart, walkEnd, 0, 0, 0, 0, 0);

  // ── Positions membres ─────────────────────────────────────────────────────
  const memberPositions = members.map((m) =>
    memberPosition(frame, spawnSvgX, spawnSvgY, destSvgX, destSvgY, walkStart, walkEnd, m.spawnDX, m.spawnDY, m.arriveDX, m.arriveDY, m.frameOffset)
  );

  // ── Camera state ──────────────────────────────────────────────────────────
  const driftX = Math.sin(frame * 0.014) * 4;
  const driftY = Math.cos(frame * 0.011) * 3;

  let camFocusX = spawnSvgX;
  let camFocusY = spawnSvgY;
  let camZoom = 1.2;

  if (frame < walkStart) {
    // Avant le départ : vue globale sur le spawn
    camZoom = interpolate(frame, [0, walkStart], [1.0, zoomWalk], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    camFocusX = spawnSvgX;
    camFocusY = spawnSvgY;
  } else if (frame < closeupAt) {
    // Marche : camera-track leader
    camFocusX = leaderPos.x;
    camFocusY = leaderPos.y;
    camZoom = interpolate(frame, [walkStart, closeupAt], [zoomWalk, zoomCloseup], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  } else if (frame < walkEnd) {
    // Gros plan sur le leader
    camFocusX = leaderPos.x;
    camFocusY = leaderPos.y;
    camZoom = zoomCloseup;
  } else {
    // Arrivée + pull-back
    camFocusX = destSvgX;
    camFocusY = destSvgY;
    camZoom = interpolate(frame, [walkEnd, walkEnd + 60, durationFrames], [zoomCloseup, zoomWalk, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }

  const tiltBase = 18 + Math.sin(frame * 0.04) * 2;
  const effectiveTilt = camZoom > 1.9
    ? interpolate(camZoom, [1.9, 2.5], [tiltBase, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : tiltBase;
  const skewX = effectiveTilt * 0.15;
  const scaleY = 1 - effectiveTilt * 0.008;

  const cam = { camFocusX, camFocusY, camZoom, skewX, scaleY, driftX, driftY };

  // ── Walk cycles ───────────────────────────────────────────────────────────
  const isLeaderWalking = frame >= walkStart && frame < walkEnd;
  const leaderFrameIdx = isLeaderWalking
    ? Math.floor(Math.max(0, frame - walkStart) / 6) % spriteFrameCount
    : 0;
  const leaderSrc = staticFile(`${spriteLeaderDir}/north/frame_${String(leaderFrameIdx).padStart(3, "0")}.png`);
  const leaderComp = svgToCompWithCam(leaderPos.x, leaderPos.y, cam);

  const spriteSizeScaled = spriteSize * (camZoom / 2.0);
  const hopLeader = isLeaderWalking ? Math.abs(Math.sin(frame * 0.4)) * 4 : 0;

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
        </svg>
      </AbsoluteFill>

      {/* Membres de la formation */}
      {memberPositions.map((pos, i) => {
        const m = members[i];
        const isMemberWalking = (frame - m.frameOffset) >= walkStart && (frame - m.frameOffset) < walkEnd;
        const memberFrameIdx = isMemberWalking
          ? Math.floor(Math.max(0, frame - walkStart - m.frameOffset) / 6) % spriteFrameCount
          : 0;
        const memberSrc = staticFile(`${m.spriteDir ?? spriteMemberDir}/north/frame_${String(memberFrameIdx).padStart(3, "0")}.png`);
        const memberComp = svgToCompWithCam(pos.x, pos.y, cam);
        const hopMember = isMemberWalking ? Math.abs(Math.sin((frame + i * 15) * 0.4)) * 4 : 0;
        return (
          <AbsoluteFill key={i} style={{ pointerEvents: "none" }}>
            <Img
              src={memberSrc}
              style={{
                position: "absolute",
                left: memberComp.x - spriteSizeScaled / 2,
                top: memberComp.y - spriteSizeScaled - hopMember,
                width: spriteSizeScaled,
                height: spriteSizeScaled,
                imageRendering: "pixelated",
                transform: m.flipH ? "scaleX(-1)" : undefined,
                filter: "drop-shadow(2px 2px 6px rgba(0,0,0,0.6))",
              }}
            />
          </AbsoluteFill>
        );
      })}

      {/* Leader — rendu en dernier (par-dessus les membres) */}
      {isLeaderWalking && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <Img
            src={leaderSrc}
            style={{
              position: "absolute",
              left: leaderComp.x - spriteSizeScaled / 2,
              top: leaderComp.y - spriteSizeScaled - hopLeader,
              width: spriteSizeScaled,
              height: spriteSizeScaled,
              imageRendering: "pixelated",
              filter: "drop-shadow(2px 4px 8px rgba(0,0,0,0.8))",
            }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
