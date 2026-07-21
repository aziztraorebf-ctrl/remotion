/**
 * Scene2JetsStrike — reproduction du prompt 3 de la reference :
 * "Outline [pays A] in its flag [color] and [pays B] in its flag [color], flags spring up
 * from the map and stay planted. Top-down fighter jets take off from [pays A] and fly toward
 * [pays B], camera pans along. When they hit targets, play the explosion video — it's on a
 * BLACK BACKGROUND, use a SCREEN BLEND to key it out and only the fireball shows — leave a
 * glowing red mark on each spot. Jets fly through and keep going. Flag springs back at the end."
 *
 * LE TEST CLE DE CETTE SCENE : mix-blend-mode: 'screen' sur explosion-blackbg-source.png
 * (vrai fond noir, PAS un PNG deja alpha comme sur nos protos Mapbox precedents). Explication
 * de la reference, verifiee : screen blend ne peut qu'AJOUTER de la lumiere — le noir pur n'a
 * aucune lumiere a ajouter donc il disparait, seul le blanc/orange du fireball ressort.
 *
 * Sujet neutre : Mali (bleu, deja allume en Scene1) + Niger (vert) au lieu du sujet reel.
 */
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import {
  useWorldCountries,
  useProjection,
  NAVY_OCEAN,
  LAND_FILL,
  LAND_STROKE,
  WIDTH,
  HEIGHT,
  CamKeyframe,
} from "./VoxReproScene";

const MALI_CENTER: [number, number] = [-3.5, 17.5];
const NIGER_CENTER: [number, number] = [8.0, 17.6];
const MALI_COLOR = "#14b8a6"; // bleu-vert neutre (evite le drapeau reel d'un pays en conflit)
const NIGER_COLOR = "#f59e0b"; // orange neutre

const CAM: CamKeyframe[] = [
  { f: 0, center: NIGER_CENTER, scale: 1400 }, // raccord exact avec la fin de Scene1
  { f: 30, center: [2.5, 17.5], scale: 1000 }, // dezoom leger pour voir Mali+Niger ensemble
  { f: 240, center: [2.5, 17.5], scale: 1000 },
];

const FLAGS_START = 10;
const FLAGS_DUR = 15;
const JETS_TAKEOFF = 40;
const JETS_ARRIVAL = 130;
const N_JETS = 3;
const JET_SIZE = 130;
const IMPACT_MARKS_AT = [140, 160, 180]; // 3 impacts espaces (une frappe par jet)
const IMPACT_TARGETS: [number, number][] = [
  [7.0, 17.9], [8.3, 17.4], [8.9, 18.1],
];

export const SCENE2_FRAMES = 240;
export const SCENE2_FPS = 30;

export const Scene2JetsStrike: React.FC = () => {
  const frame = useCurrentFrame();
  const countries = useWorldCountries();
  const { path } = useProjection(CAM, frame);

  const mali = countries?.find((c) => c.properties.name === "Mali");
  const niger = countries?.find((c) => c.properties.name === "Niger");

  const flagT = interpolate(frame, [FLAGS_START, FLAGS_START + FLAGS_DUR], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.3)),
  });

  const projMali = mali ? path.centroid(mali as any) : [0, 0];
  const projNiger = niger ? path.centroid(niger as any) : [0, 0];

  // 3 jets : trajectoire lineaire lon/lat entre Mali et Niger, decales dans le temps et l'espace
  // (formation en V, pas une ligne unique — plus proche de la reference "three jets").
  const jets = Array.from({ length: N_JETS }).map((_, i) => {
    const offset = i * 8; // decalage temporel entre jets
    const lateralOffset = (i - 1) * 0.4; // decalage lateral en degres lat pour la formation
    const t = interpolate(frame, [JETS_TAKEOFF + offset, JETS_ARRIVAL + offset], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.linear,
    });
    const lon = interpolate(t, [0, 1], [MALI_CENTER[0] + 1.5, IMPACT_TARGETS[i][0] + 1.2]);
    const lat = interpolate(t, [0, 1], [MALI_CENTER[1], IMPACT_TARGETS[i][1] + lateralOffset]);
    const lonNext = interpolate(Math.min(1, t + 0.01), [0, 1], [MALI_CENTER[0] + 1.5, IMPACT_TARGETS[i][0] + 1.2]);
    const latNext = interpolate(Math.min(1, t + 0.01), [0, 1], [MALI_CENTER[1], IMPACT_TARGETS[i][1] + lateralOffset]);
    const p = path.centroid({ type: "Point", coordinates: [lon, lat] } as any);
    const pNext = path.centroid({ type: "Point", coordinates: [lonNext, latNext] } as any);
    const angle = Math.atan2(pNext[1] - p[1], pNext[0] - p[0]) * (180 / Math.PI);
    const visible = frame >= JETS_TAKEOFF + offset && frame <= JETS_ARRIVAL + offset + 40;
    return { p, angle, visible, i };
  });

  // Explosions : une par cible d'impact, keyees en screen-blend
  const explosions = IMPACT_TARGETS.map((target, i) => {
    const at = IMPACT_MARKS_AT[i];
    const local = frame - at;
    const active = local >= 0 && local < 24;
    const opacity = active
      ? interpolate(local, [0, 6, 18, 24], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : 0;
    const scale = active
      ? interpolate(local, [0, 8], [0.4, 1.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
      : 1;
    const p = path.centroid({ type: "Point", coordinates: target } as any);
    // marque rouge remanente APRES l'explosion
    const markOpacity = interpolate(frame, [at + 15, at + 30], [0, 0.6], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    return { p, opacity, scale, markOpacity, i };
  });

  return (
    <AbsoluteFill style={{ background: NAVY_OCEAN }}>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        {countries?.map((c, i) => (
          <path key={i} d={path(c as any) || ""} fill={LAND_FILL} stroke={LAND_STROKE} strokeWidth={0.6} />
        ))}
        {/* Contours colores Mali+Niger deja allumes (raccord Scene1) */}
        {mali && <path d={path(mali as any) || ""} fill="none" stroke={MALI_COLOR} strokeWidth={3} strokeOpacity={0.9} />}
        {niger && <path d={path(niger as any) || ""} fill="none" stroke={NIGER_COLOR} strokeWidth={3} strokeOpacity={0.9} />}

        {/* Marques rouges remanentes des impacts */}
        {explosions.map((e) => (
          <circle key={e.i} cx={e.p[0]} cy={e.p[1]} r={22} fill="#c02020" opacity={e.markOpacity} />
        ))}
      </svg>

      {/* Drapeaux (couleur unie, pas de vrai drapeau national — sujet neutre) qui spring up */}
      {flagT > 0.01 && (
        <div style={{
          position: "absolute", left: projMali[0] - 30, top: projMali[1] - 70 * flagT,
          width: 60, height: 40, background: MALI_COLOR, opacity: flagT,
          border: "2px solid rgba(0,0,0,0.3)", pointerEvents: "none",
        }} />
      )}
      {flagT > 0.01 && (
        <div style={{
          position: "absolute", left: projNiger[0] - 30, top: projNiger[1] - 70 * flagT,
          width: 60, height: 40, background: NIGER_COLOR, opacity: flagT,
          border: "2px solid rgba(0,0,0,0.3)", pointerEvents: "none",
        }} />
      )}

      {/* Jets top-down, formation, rotation orientee vers le cap de vol */}
      {jets.map((j) => j.visible && (
        <div key={j.i} style={{
          position: "absolute", left: j.p[0] - JET_SIZE / 2, top: j.p[1] - JET_SIZE / 2,
          width: JET_SIZE, height: JET_SIZE, transform: `rotate(${j.angle}deg)`,
          pointerEvents: "none", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))",
        }}>
          <img src={staticFile("_rnd/vox-repro/jet-topdown-cutout.png")}
            style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
      ))}

      {/* Explosions — LE TEST CLE : mix-blend-mode 'screen' sur PNG fond noir (pas alpha) */}
      {explosions.map((e) => e.opacity > 0.01 && (
        <div key={e.i} style={{
          position: "absolute", left: e.p[0] - 140, top: e.p[1] - 140,
          width: 280, height: 280, opacity: e.opacity,
          transform: `scale(${e.scale})`, pointerEvents: "none",
          mixBlendMode: "screen",
        }}>
          <img src={staticFile("_rnd/vox-repro/explosion-blackbg-source.png")}
            style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
      ))}
    </AbsoluteFill>
  );
};

export default Scene2JetsStrike;
