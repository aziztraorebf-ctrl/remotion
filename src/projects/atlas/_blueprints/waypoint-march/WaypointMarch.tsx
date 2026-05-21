import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { AtlasMercator, AtlasLabel, AtlasPulseMarker } from "../../_shared/atlas-components";
import atlasData from "../../_shared/atlas-v2-data.json";

// Blueprint: WaypointMarch
//
// UN personnage traverse plusieurs villes intermédiaires (waypoints) avant d'arriver
// à destination. Chaque segment a sa propre durée. La caméra track le sprite
// en continu et zoome progressivement au fil du trajet.
//
// Source validée : Empire Ghana Beat4Consequence (guerrier almoravide :
// Sijilmassa → Taghaza → Koumbi Saleh, 106 frames de marche).
// Pattern clé : séquence de segments linéaires if/else, p=(frame-segStart)/(segEnd-segStart).
//
// Cas d'usage :
//   - Conquête militaire multi-étapes (A→B→C→D)
//   - Voyage/pèlerinage (Le Caire → Mecque → Tombouctou)
//   - Route commerciale (villes-relais)
//   - Migration saisonnière (étapes de transhumance)
//
// Props :
//   waypoints      — tableau de { svgX, svgY, label?, arriveFrame }
//                    Le premier = spawn, le dernier = destination finale.
//                    arriveFrame = frame locale à laquelle le perso ARRIVE à ce point.
//   walkStart      — frame où le perso commence à marcher (depuis waypoints[0])
//   durationFrames
//   zoomStart      — zoom au départ (défaut 1.0)
//   zoomEnd        — zoom à l'arrivée finale (défaut 2.4)
//   spriteDir      — dossier frames walk
//   spriteFrameCount
//   spriteSize
//   direction      — direction de marche (défaut "south")

interface Waypoint {
  svgX: number;
  svgY: number;
  label?: string;
  arriveFrame: number;
}

interface Props {
  waypoints?: Waypoint[];
  walkStart?: number;
  durationFrames?: number;
  zoomStart?: number;
  zoomEnd?: number;
  spriteDir?: string;
  spriteFrameCount?: number;
  spriteSize?: number;
  direction?: string;
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

// Calcule la position du sprite pour un tableau de waypoints.
// Source : Beat4Consequence — segments Sijilmassa→Taghaza→Koumbi.
function resolvePosition(
  frame: number,
  walkStart: number,
  waypoints: Waypoint[],
): { x: number; y: number; segmentIdx: number } {
  if (frame < walkStart || waypoints.length === 0) {
    return { x: waypoints[0]?.svgX ?? 0, y: waypoints[0]?.svgY ?? 0, segmentIdx: 0 };
  }

  for (let i = 0; i < waypoints.length - 1; i++) {
    const segStart = i === 0 ? walkStart : waypoints[i].arriveFrame;
    const segEnd = waypoints[i + 1].arriveFrame;
    if (frame >= segStart && frame < segEnd) {
      const p = (frame - segStart) / (segEnd - segStart);
      return {
        x: waypoints[i].svgX + (waypoints[i + 1].svgX - waypoints[i].svgX) * p,
        y: waypoints[i].svgY + (waypoints[i + 1].svgY - waypoints[i].svgY) * p,
        segmentIdx: i,
      };
    }
  }

  // Arrivée finale
  const last = waypoints[waypoints.length - 1];
  return { x: last.svgX, y: last.svgY, segmentIdx: waypoints.length - 1 };
}

const DEFAULT_WAYPOINTS: Waypoint[] = [
  { svgX: 336, svgY: 273, label: "SIJILMASSA", arriveFrame: 0 },
  { svgX: 322, svgY: 518, label: "TAGHAZA",    arriveFrame: 116 },
  { svgX: 238, svgY: 697, label: "KOUMBI",     arriveFrame: 169 },
];

export const WaypointMarch: React.FC<Props> = ({
  waypoints = DEFAULT_WAYPOINTS,
  walkStart = 63,
  durationFrames = 300,
  zoomStart = 1.0,
  zoomEnd = 2.4,
  spriteDir = "empire-ghana/characters/guerrier-almoravide/animations/animating-6c924926",
  spriteFrameCount = 6,
  spriteSize = 130,
  direction = "south",
}) => {
  const frame = useCurrentFrame();

  const { x: entityX, y: entityY } = resolvePosition(frame, walkStart, waypoints);

  // ── Camera state ──────────────────────────────────────────────────────────
  const driftX = Math.sin(frame * 0.014) * 4;
  const driftY = Math.cos(frame * 0.011) * 3;

  const lastWaypoint = waypoints[waypoints.length - 1];
  const isWalking = frame >= walkStart && frame < lastWaypoint.arriveFrame;
  const isArrived = frame >= lastWaypoint.arriveFrame;

  // Zoom : progresse linéairement de zoomStart à zoomEnd pendant toute la marche
  const camZoom = interpolate(
    frame,
    [walkStart, lastWaypoint.arriveFrame, durationFrames],
    [zoomStart, zoomEnd, zoomEnd * 0.85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Focus : suit le sprite pendant la marche, se stabilise sur la destination à l'arrivée
  const camFocusX = isArrived
    ? interpolate(frame, [lastWaypoint.arriveFrame, lastWaypoint.arriveFrame + 30], [entityX, lastWaypoint.svgX], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : entityX;
  const camFocusY = isArrived
    ? interpolate(frame, [lastWaypoint.arriveFrame, lastWaypoint.arriveFrame + 30], [entityY, lastWaypoint.svgY], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : entityY;

  const tiltBase = 18 + Math.sin(frame * 0.04) * 2;
  const effectiveTilt = camZoom > 1.9
    ? interpolate(camZoom, [1.9, 2.5], [tiltBase, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : tiltBase;
  const skewX = effectiveTilt * 0.15;
  const scaleY = 1 - effectiveTilt * 0.008;

  const cam = { camFocusX, camFocusY, camZoom, skewX, scaleY, driftX, driftY };

  // ── Walk cycle ────────────────────────────────────────────────────────────
  const walkFrameIdx = isWalking
    ? Math.floor(Math.max(0, frame - walkStart) / 6) % spriteFrameCount
    : 0;
  const spriteSrc = staticFile(`${spriteDir}/${direction}/frame_${String(walkFrameIdx).padStart(3, "0")}.png`);
  const entityComp = svgToCompWithCam(entityX, entityY, cam);
  const spriteSizeScaled = spriteSize * (camZoom / 1.7);
  const hopY = isWalking ? Math.abs(Math.sin(frame * 0.4)) * 4 : 0;

  // ── Labels waypoints ──────────────────────────────────────────────────────
  const countries = (atlasData as { mercWide: { countries: { iso: string; d: string }[] } }).mercWide.countries;

  const globalFadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const globalFadeOut = interpolate(frame, [durationFrames - 12, durationFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a", opacity: globalFadeIn * globalFadeOut }}>
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
          {/* Labels apparaissant à l'arrivée de chaque waypoint */}
          {waypoints.map((wp, i) =>
            wp.label && i > 0 ? (
              <AtlasLabel
                key={i}
                text={wp.label}
                coord={[wp.svgX, wp.svgY - 40]}
                appearAt={wp.arriveFrame}
              />
            ) : null
          )}
          {isArrived && (
            <AtlasPulseMarker
              coord={[lastWaypoint.svgX, lastWaypoint.svgY]}
              beatStart={lastWaypoint.arriveFrame}
              color="#E8C97D"
            />
          )}
        </svg>
      </AbsoluteFill>

      {/* Sprite */}
      {(isWalking || isArrived) && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <Img
            src={spriteSrc}
            style={{
              position: "absolute",
              left: entityComp.x - spriteSizeScaled / 2,
              top: entityComp.y - spriteSizeScaled - hopY,
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
